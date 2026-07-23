#!/usr/bin/env node
// Assembles a native macOS .app bundle for Salt WITHOUT Electron.
// The bundle boots the local Node server when `node` is on the Mac (full LAN
// guest-request features) and otherwise opens the self-contained HTML directly
// (all DJ features still work). Runs in this Linux build env; produces a real
// double-clickable Mac app.
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const OUT = path.join(ROOT, "release-mac");
const APP = path.join(OUT, "Salt.app");
const C = path.join(APP, "Contents");
const MACOS = path.join(C, "MacOS");
const RES = path.join(C, "Resources");
const SRV = path.join(RES, "server");

function rmrf(p) { fs.rmSync(p, { recursive: true, force: true }); }
function cp(src, dst) { fs.cpSync(src, dst, { recursive: true }); }
function mkdir(p) { fs.mkdirSync(p, { recursive: true }); }

rmrf(OUT);
[OUT, MACOS, RES, SRV].forEach(mkdir);

// ---- bundle the server + app payload (node-present path) ----
cp(path.join(ROOT, "server.js"), path.join(SRV, "server.js"));
cp(path.join(ROOT, "app"), path.join(SRV, "app"));
if (fs.existsSync(path.join(ROOT, "node_modules"))) {
  cp(path.join(ROOT, "node_modules"), path.join(SRV, "node_modules")); // qrcode + deps (small)
}

// ---- launcher (CFBundleExecutable) ----
const launcher = `#!/bin/bash
# Salt launcher. Prefers the bundled local server (real LAN guest requests) when
# node is installed; otherwise opens the fully-working standalone app file.
# Opens as a chromeless "app window" (Chrome/Brave/Edge) so it looks native,
# and falls back to the default browser when none is present.
HERE="$(cd "$(dirname "$0")/../Resources" && pwd)"
SRV="$HERE/server"
PORT=4599
FILE="$SRV/app/demo/salt.html"
PROFILE="$HOME/Library/Application Support/Salt/window"

# Open URL/file in a standalone app window if a Chromium-based browser exists;
# otherwise hand it to the default browser. Returns 0 either way.
open_app() {
  local url="$1" b
  for b in "Google Chrome" "Brave Browser" "Microsoft Edge" "Chromium"; do
    if open -Ra "$b" >/dev/null 2>&1; then
      open -na "$b" --args --app="$url" --user-data-dir="$PROFILE" >/dev/null 2>&1 && return 0
    fi
  done
  open "$url"
}

open_when_ready() {
  for i in $(seq 1 20); do
    if curl -s -o /dev/null "http://127.0.0.1:$PORT/demo/salt.html" 2>/dev/null; then
      open_app "http://127.0.0.1:$PORT/demo/salt.html"
      return
    fi
    sleep 0.3
  done
  open_app "file://$FILE"   # server never came up -> standalone fallback
}

if command -v node >/dev/null 2>&1; then
  cd "$SRV" || { open_app "file://$FILE"; exit 0; }
  open_when_ready &
  exec node server.js "$PORT"   # stays in foreground: Dock icon + Quit stops the server
else
  open_app "file://$FILE"       # no node: standalone file (all DJ features work)
fi
`;
fs.writeFileSync(path.join(MACOS, "Salt"), launcher, { mode: 0o755 });

// ---- Info.plist ----
const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleName</key><string>Salt</string>
  <key>CFBundleDisplayName</key><string>Salt</string>
  <key>CFBundleExecutable</key><string>Salt</string>
  <key>CFBundleIdentifier</key><string>co.eb28.salt</string>
  <key>CFBundleIconFile</key><string>AppIcon</string>
  <key>CFBundlePackageType</key><string>APPL</string>
  <key>CFBundleShortVersionString</key><string>1.0.0</string>
  <key>CFBundleVersion</key><string>1</string>
  <key>CFBundleInfoDictionaryVersion</key><string>6.0</string>
  <key>LSMinimumSystemVersion</key><string>10.13</string>
  <key>NSHighResolutionCapable</key><true/>
  <key>LSApplicationCategoryType</key><string>public.app-category.music</string>
</dict>
</plist>
`;
fs.writeFileSync(path.join(C, "Info.plist"), plist);
fs.writeFileSync(path.join(C, "PkgInfo"), "APPL????");

// ---- AppIcon.icns from the 512x512 PNG (embed as multiple OSTypes) ----
function buildIcns(pngPath, icnsPath) {
  const png = fs.readFileSync(pngPath);
  // OSTypes that accept raw PNG data. We only have a 512x512 source, so we tag
  // it at the sizes macOS will accept a 512 image for; macOS scales as needed.
  const entries = [
    ["ic09", png], // 512x512
    ["ic14", png], // 512x512 (256@2x)
  ];
  const parts = [];
  let total = 8; // header: magic(4) + length(4)
  for (const [type, data] of entries) {
    const header = Buffer.alloc(8);
    header.write(type, 0, "ascii");
    header.writeUInt32BE(data.length + 8, 4);
    parts.push(header, data);
    total += data.length + 8;
  }
  const head = Buffer.alloc(8);
  head.write("icns", 0, "ascii");
  head.writeUInt32BE(total, 4);
  fs.writeFileSync(icnsPath, Buffer.concat([head, ...parts]));
}
try {
  buildIcns(path.join(ROOT, "build", "icon.png"), path.join(RES, "AppIcon.icns"));
  console.log("icon: AppIcon.icns written");
} catch (e) {
  console.warn("icon skipped:", e.message);
}

// ---- START-HERE.txt (travels next to the app in the zip) ----
const startHere = `SALT — Mac app
==============

1. Drag  Salt.app  into your Applications folder (or leave it here).

2. Double-click Salt.

   First time only: because this app isn't signed with a paid Apple
   Developer certificate yet, macOS may say it "cannot be opened."
   Do ONE of these:

   - Right-click Salt.app  ->  Open  ->  Open   (older macOS), OR
   - Open Terminal, paste this one line, press Return, then open Salt:

        xattr -cr /Applications/Salt.app

     (if you kept Salt somewhere else, drag it onto the Terminal window
      after typing "xattr -cr " to fill in the correct path)

That's it. Salt opens in its own app window (no browser tabs or address
bar) with every feature working — mixing decks, BPM + key detection,
"mixes well with," explicit-lyric flags, emcee notes, soundboard, light
show, request queue, invoicing.

Live guest song requests (the QR code / phone link):
  If Node.js is installed on this Mac, Salt automatically runs a tiny
  local request server on your wifi, and the QR code in the Requests tab
  points guests' phones straight at your laptop — no internet needed.
  If Node isn't installed, Salt still opens fully; the request queue just
  runs in demo mode. To enable real requests, install Node from
  https://nodejs.org (LTS), then reopen Salt.

The native window uses Chrome / Brave / Edge if installed (opens with no
browser chrome, in its own Salt profile). Without one, it opens in your
default browser. Nothing here needs the internet, a login, or hosting.
Quitting Salt (Cmd-Q) stops the local request server.
`;
fs.writeFileSync(path.join(OUT, "START-HERE.txt"), startHere);

console.log("Built", APP);
