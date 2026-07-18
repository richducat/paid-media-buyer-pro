import { NextResponse } from "next/server";
import { clientIp, rateLimited, tooMany } from "@/lib/ratelimit";

// Salt request line, room-scoped: each gig gets its own request room
// (?room=CODE). In-memory store: fine for the prototype (resets on server
// restart), swap for a real DB + accounts when productizing.

export const dynamic = "force-dynamic";

type DjRequest = {
  id: number;
  name: string;
  songId: string;
  songText: string;
  note: string;
  tip: number;
  status: "pending" | "accepted" | "declined";
  ts: number;
};

// `op` binds the first DJ operator token to see the room; PATCH requires it.
type Room = { seq: number; requests: DjRequest[]; op: string | null; touched: number };
type Store = Map<string, Room>;

const g = globalThis as typeof globalThis & { __djStore?: Store };
if (!g.__djStore) {
  g.__djStore = new Map();
  const now = Date.now();
  g.__djStore.set("MAIN", {
    seq: 4,
    op: null,
    touched: now,
    requests: [
      { id: 3, name: "Maya R.", songId: "getlow", songText: "", note: "Bridal party demands this 🙏", tip: 20, status: "pending", ts: now - 2 * 60_000 },
      { id: 2, name: "Uncle Tony", songId: "dontstop", songText: "", note: "You know why.", tip: 0, status: "pending", ts: now - 6 * 60_000 },
      { id: 1, name: "Grandma Lois", songId: "september", songText: "", note: "Our song from 1978 ❤️", tip: 0, status: "pending", ts: now - 11 * 60_000 },
    ],
  });
}
const store = g.__djStore;

const clip = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
const noStore = { "Cache-Control": "no-store" };
const MAX_BODY = 20_000;

function roomCode(v: unknown): string {
  const code = clip(v, 12).toUpperCase().replace(/[^A-Z0-9]/g, "");
  return code || "MAIN";
}
// Read-only lookup: never creates or evicts. GET is a pure read so it can't
// be abused to evict live gigs' rooms.
function peekRoom(code: string): Room | undefined {
  return store.get(code);
}
// Create-on-write, only from POST. Evicts the least-recently-touched
// non-MAIN room when full so an active gig isn't dropped mid-event.
function ensureRoom(code: string): Room {
  let room = store.get(code);
  if (!room) {
    if (store.size >= 200) {
      let victim: string | undefined, oldest = Infinity;
      for (const [k, v] of store) {
        if (k === "MAIN") continue;
        if (v.touched < oldest) { oldest = v.touched; victim = k; }
      }
      if (victim) store.delete(victim);
    }
    room = { seq: 1, requests: [], op: null, touched: Date.now() };
    store.set(code, room);
  }
  return room;
}

// Read the body with a hard byte cap while streaming, so a chunked/no-
// Content-Length request can't buffer unbounded memory before we truncate.
async function readCapped(req: Request): Promise<Record<string, unknown> | null> {
  const buf = await req.arrayBuffer();
  if (buf.byteLength > MAX_BODY) return null;
  try {
    return JSON.parse(new TextDecoder().decode(buf));
  } catch {
    return null;
  }
}

export function GET(req: Request) {
  const room = peekRoom(roomCode(new URL(req.url).searchParams.get("room")));
  const requests = room ? [...room.requests].sort((a, b) => b.id - a.id).slice(0, 100) : [];
  return NextResponse.json({ requests }, { headers: noStore });
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  const body = await readCapped(req);
  if (body === null) return NextResponse.json({ error: "Invalid or oversized request" }, { status: 400, headers: noStore });
  const code = roomCode(body.room);
  // per-room flood cap survives IP spoofing and venue-NAT crowds; per-IP is a
  // secondary guard sized so a whole party on one wifi isn't blocked.
  if (rateLimited("room:" + code, 40, 60_000)) return tooMany(60_000);
  if (rateLimited("reqip:" + ip, 30, 60_000)) return tooMany(60_000);
  const songId = clip(body.songId, 40);
  const songText = clip(body.songText, 80);
  if (!songId && !songText) {
    return NextResponse.json({ error: "Pick a song or type one in" }, { status: 400, headers: noStore });
  }
  const room = ensureRoom(code);
  room.touched = Date.now();
  const tip = Number(body.tip);
  const request: DjRequest = {
    id: room.seq++,
    name: clip(body.name, 40) || "Guest",
    songId,
    songText,
    note: clip(body.note, 140),
    tip: [5, 10, 20].includes(tip) ? tip : 0,
    status: "pending",
    ts: Date.now(),
  };
  room.requests.push(request);
  if (room.requests.length > 300) room.requests = room.requests.slice(-300);
  return NextResponse.json({ request }, { status: 201, headers: noStore });
}

export async function PATCH(req: Request) {
  if (rateLimited("patch:" + clientIp(req), 60, 60_000)) return tooMany(60_000);
  const body = await readCapped(req);
  if (body === null) return NextResponse.json({ error: "Invalid or oversized request" }, { status: 400, headers: noStore });
  const id = Number(body.id);
  const status = body.status;
  if (status !== "accepted" && status !== "declined") {
    return NextResponse.json({ error: "status must be accepted or declined" }, { status: 400, headers: noStore });
  }
  const room = peekRoom(roomCode(body.room));
  if (!room) return NextResponse.json({ error: "Not found" }, { status: 404, headers: noStore });

  // DJ authorization: the booth app sends an operator token. The first token
  // to moderate a room claims it; afterwards only that token may accept/
  // decline, so a guest (who never sends one) can't moderate the queue.
  const op = clip(req.headers.get("x-salt-op"), 64);
  if (room.op === null) {
    if (!op) return NextResponse.json({ error: "Operator token required" }, { status: 401, headers: noStore });
    room.op = op;
  } else if (room.op !== op) {
    return NextResponse.json({ error: "Not the room operator" }, { status: 403, headers: noStore });
  }

  const found = room.requests.find((r) => r.id === id);
  if (!found) {
    return NextResponse.json({ error: "Not found" }, { status: 404, headers: noStore });
  }
  found.status = status;
  room.touched = Date.now();
  return NextResponse.json({ request: found }, { headers: noStore });
}
