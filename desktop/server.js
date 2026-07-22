// Salt Desktop — self-contained local server. Serves the DJ app and the guest
// request page, and provides the request/feedback/QR API entirely on the DJ's
// machine. Guests on the same wifi reach it at the laptop's LAN IP. No external
// hosting, nothing to crash. Pure Node core + qrcode; no framework.
const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
let QRCode = null;
try { QRCode = require("qrcode"); } catch { /* QR endpoint degrades gracefully */ }

const APP_DIR = path.join(__dirname, "app");

// ---- in-memory request store (room-scoped) ----
const rooms = new Map();
function getRoom(code, create) {
  let r = rooms.get(code);
  if (!r && create) { r = { seq: 1, requests: [], op: null }; rooms.set(code, r); }
  return r;
}
const clip = (v, n) => String(v == null ? "" : v).trim().slice(0, n);
const roomCode = (v) => clip(v, 12).toUpperCase().replace(/[^A-Z0-9]/g, "") || "MAIN";

// ---- naive per-ip rate limit ----
const hits = new Map();
function limited(key, max, winMs) {
  const now = Date.now(), h = hits.get(key);
  if (!h || h.reset < now) { hits.set(key, { n: 1, reset: now + winMs }); return false; }
  h.n++; return h.n > max;
}
function ipOf(req) { const f = req.headers["x-forwarded-for"]; return (f ? f.split(",")[0] : req.socket.remoteAddress) || "local"; }

const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".json": "application/json", ".png": "image/png", ".svg": "image/svg+xml", ".webmanifest": "application/manifest+json", ".css": "text/css" };

function send(res, code, body, type) {
  res.writeHead(code, { "Content-Type": type || "application/json", "Cache-Control": "no-store" });
  res.end(body);
}
function readBody(req, cb) {
  let data = "", tooBig = false;
  req.on("data", (c) => { data += c; if (data.length > 20000) { tooBig = true; req.destroy(); } });
  req.on("end", () => { if (tooBig) return cb(null); try { cb(JSON.parse(data || "{}")); } catch { cb(undefined); } });
  req.on("error", () => cb(null));
}

function api(req, res, url) {
  const p = url.pathname;
  // ---- requests ----
  if (p === "/api/dj/requests") {
    if (req.method === "GET") {
      const r = getRoom(roomCode(url.searchParams.get("room")), false);
      const requests = r ? [...r.requests].sort((a, b) => b.id - a.id).slice(0, 100) : [];
      return send(res, 200, JSON.stringify({ requests }));
    }
    if (req.method === "POST") {
      if (limited("post:" + ipOf(req), 30, 60000)) return send(res, 429, JSON.stringify({ error: "Slow down" }));
      return readBody(req, (b) => {
        if (!b) return send(res, 400, JSON.stringify({ error: "Bad request" }));
        const songId = clip(b.songId, 40), songText = clip(b.songText, 80);
        if (!songId && !songText) return send(res, 400, JSON.stringify({ error: "Pick a song" }));
        const room = getRoom(roomCode(b.room), true);
        if (limited("room:" + roomCode(b.room), 60, 60000)) return send(res, 429, JSON.stringify({ error: "Slow down" }));
        const tip = Number(b.tip);
        const request = { id: room.seq++, name: clip(b.name, 40) || "Guest", songId, songText, note: clip(b.note, 140), tip: [5, 10, 20].includes(tip) ? tip : 0, status: "pending", ts: Date.now() };
        room.requests.push(request);
        if (room.requests.length > 300) room.requests = room.requests.slice(-300);
        return send(res, 201, JSON.stringify({ request }));
      });
    }
    if (req.method === "PATCH") {
      return readBody(req, (b) => {
        if (!b) return send(res, 400, JSON.stringify({ error: "Bad request" }));
        if (b.status !== "accepted" && b.status !== "declined") return send(res, 400, JSON.stringify({ error: "bad status" }));
        const room = getRoom(roomCode(b.room), false);
        if (!room) return send(res, 404, JSON.stringify({ error: "Not found" }));
        const op = clip(req.headers["x-salt-op"], 64);
        if (room.op === null) { if (!op) return send(res, 401, JSON.stringify({ error: "operator token required" })); room.op = op; }
        else if (room.op !== op) return send(res, 403, JSON.stringify({ error: "not operator" }));
        const found = room.requests.find((r) => r.id === Number(b.id));
        if (!found) return send(res, 404, JSON.stringify({ error: "Not found" }));
        found.status = b.status;
        return send(res, 200, JSON.stringify({ request: found }));
      });
    }
    return send(res, 405, JSON.stringify({ error: "method" }));
  }
  // ---- feedback (local file next to the app data) ----
  if (p === "/api/dj/feedback" && req.method === "POST") {
    if (limited("fb:" + ipOf(req), 5, 60000)) return send(res, 429, JSON.stringify({ error: "Slow down" }));
    return readBody(req, (b) => {
      if (!b || !clip(b.msg, 2000)) return send(res, 400, JSON.stringify({ error: "empty" }));
      try { fs.appendFileSync(path.join(os.homedir(), "salt-feedback.jsonl"), JSON.stringify({ ts: new Date().toISOString(), name: clip(b.name, 60), msg: clip(b.msg, 2000), where: clip(b.where, 200) }) + "\n"); } catch {}
      return send(res, 201, JSON.stringify({ ok: true }));
    });
  }
  // ---- QR for the local guest URL ----
  if (p === "/api/dj/qr" && req.method === "GET") {
    const text = (url.searchParams.get("text") || "").slice(0, 300);
    // desktop: only encode our own local guest page (any host/port on this box)
    if (!/\/demo\/request\.html(\?room=[A-Z0-9]{1,12})?$/.test(text)) return send(res, 403, "no");
    if (!QRCode) return send(res, 501, "qr unavailable");
    return QRCode.toString(text, { type: "svg", margin: 1, width: 192, color: { dark: "#14101F", light: "#FFFFFF" } }, (e, svg) => {
      if (e) return send(res, 500, "err");
      send(res, 200, svg, "image/svg+xml");
    });
  }
  return send(res, 404, JSON.stringify({ error: "not found" }));
}

// LAN IP so guests can reach the DJ's laptop
function lanIp() {
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const i of ifaces[name] || []) {
      if (i.family === "IPv4" && !i.internal) return i.address;
    }
  }
  return "127.0.0.1";
}

function serveStatic(req, res, url) {
  let rel = decodeURIComponent(url.pathname);
  if (rel === "/" || rel === "") rel = "/demo/salt.html";
  // prevent path traversal
  const safe = path.normalize(rel).replace(/^(\.\.[/\\])+/, "");
  const file = path.join(APP_DIR, safe);
  if (!file.startsWith(APP_DIR)) return send(res, 403, "no");
  fs.readFile(file, (err, buf) => {
    if (err) return send(res, 404, "not found", "text/plain");
    let body = buf;
    // inject the LAN guest URL into the DJ app so its QR/copy-link point at
    // this laptop, not localhost
    if (file.endsWith("salt.html")) {
      const guest = `http://${lanIp()}:${PORT}/demo/request.html`;
      body = Buffer.from(`<script>window.__SALT_GUEST_BASE=${JSON.stringify(guest)};window.__SALT_DESKTOP=true;</script>` + buf.toString("utf8"));
    }
    res.writeHead(200, { "Content-Type": MIME[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(body);
  });
}

let PORT = 0;
function start(port) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url, "http://x");
      if (url.pathname.startsWith("/api/")) return api(req, res, url);
      return serveStatic(req, res, url);
    });
    server.listen(port || 0, "0.0.0.0", () => {
      PORT = server.address().port;
      resolve({ port: PORT, lan: lanIp() });
    });
  });
}

module.exports = { start };
if (require.main === module) start(Number(process.argv[2]) || 4599).then((i) => console.log("Salt local server on", i));
