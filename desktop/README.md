# Salt — Desktop app (macOS / Windows)

A native desktop wrapper around the Salt DJ app. **Runs entirely on the
computer — no internet, no hosting, nothing to crash.** A tiny local server
(bundled) powers the request/QR/feedback API, so even live guest requests work
over the venue's wifi without any external server.

## What's here

| File | Purpose |
| --- | --- |
| `main.js` | Electron main process — starts the local server, opens the app window, app menu |
| `server.js` | Bundled local server: serves the app + guest page, request/QR/feedback API (Node core + `qrcode`, no framework) |
| `app/` | The bundled Salt app (`demo/salt.html`, guest `request.html`, catalog, icons) |
| `build/icon.png` | App icon (swap for a 1024×1024 for best quality) |
| `package.json` | Electron + electron-builder config, mac/win/linux targets |

## Build the Mac app (do this on a Mac)

```bash
cd desktop
npm install
npm run dist:mac      # -> release/Salt-1.0.0-arm64.dmg  (and x64)
```

Open the `.dmg`, drag **Salt** to Applications, done. First launch: right-click →
Open (unsigned app — see signing below). `npm start` runs it live without
building, for quick iteration.

Windows: `npm run dist:win` (run on Windows). Linux: `npm run dist` builds an
AppImage.

## How live requests work in the desktop app

- The app opens against the bundled local server (`127.0.0.1`).
- The server also listens on the machine's **LAN IP**, and the app's Requests
  tab shows a QR / link at that address (e.g. `http://192.168.1.20:4599/demo/
  request.html`).
- Guests on the **same wifi** scan it and request — it hits the DJ's laptop
  directly. No hosting, no accounts, works at a venue with just local wifi.
- The DJ's accept/decline is authorized by a per-machine operator token, so
  guests can't moderate the queue.

## Code signing / notarization (for distributing to others)

Unsigned builds run fine for you (right-click → Open the first time). To
distribute without the Gatekeeper warning you need an Apple Developer account
($99/yr): set `CSC_LINK`/`CSC_KEY_PASSWORD` (Developer ID cert) and add
`"notarize": true` with your Apple ID creds in the mac build config, then
`npm run dist:mac`. electron-builder handles the rest.

## Keeping the app in sync with the web version

The bundled app is a copy of `public/demo/salt.html` + `public/demo/request.html`
+ `public/demo/catalog.json`. After changing the DJ app, refresh the copies:

```bash
cp ../public/demo/salt.html      app/demo/salt.html
cp ../public/demo/request.html   app/demo/request.html
cp ../public/demo/catalog.json   app/demo/catalog.json
```

## Why this beats the shared-hosting version
- No Passenger, no Node process limits, no FTP deploys, no outages.
- Opens instantly, works offline, and the request line runs on the DJ's own
  machine over local wifi.
- The web build (paidmediapro.eb28.co) stays as the marketing demo; the
  desktop app is the real tool DJs run at the booth.
