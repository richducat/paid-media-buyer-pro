# Salt — DJ Set Intelligence (preview build)

A booth tool for working DJs: know every track before it drops.

**Live demo:** https://paidmediapro.eb28.co/demo/salt
**Guest request page:** https://paidmediapro.eb28.co/demo/request.html

## Features

- **Live performance screen** — dual decks with spinning, scratchable platters
  (33⅓ RPM, drag to scrub), frequency-layered scrolling waveforms with beat
  grid, seekable track overview, hot cues, 4/8/16-beat loops, beat jump,
  keylock, pitch faders, per-deck SYNC, crossfader with VU meters.
- **Explicit radar** — flagged lyric moments render as red/amber zones on the
  waveforms; a countdown warning bar fires when a flag is under 15 seconds
  out; CLEAN swaps a deck to the clean edit. Wedding / Corporate / Club event
  modes change every safety verdict.
- **Mix intelligence** — BPM + Camelot key everywhere, a live Match % column
  ranked against the on-air deck, and a Mix tab that explains each
  recommendation (key relationship, tempo fit, energy delta).
- **Real guest requests** — guests open the request page on their phones and
  submit songs (with optional note + tip). Requests sync to the DJ screen
  every few seconds; accepting queues the track (clean edit auto-selected in
  strict modes) and PATCHes the status back so the guest sees
  accepted/declined live. Up Next auto-loads when a deck runs out.
- **Automix + Suggest** — hands-free blending as tracks run out (queue first,
  then best match), and one-tap smartest-next-track (key/BPM match,
  room-safe, not already played).
- **Emcee suite** — pronunciations, timeline (first item pinned to the Live
  screen), shoutouts, do-not-play list, and an automatic set log.

## Architecture

| Piece | Path | Notes |
| --- | --- | --- |
| DJ app (single file) | `dj-prototype/index.html` | Source of truth; vanilla JS, no deps |
| Deployed page | `public/demo/salt.html` | Generated from the file above (adds doctype/head) |
| Guest request page | `public/demo/request.html` | Standalone; fetches `catalog.json` |
| Song catalog | `public/demo/catalog.json` | Generated from the SONGS array in `index.html` |
| Requests API | `src/app/api/dj/requests/route.ts` | GET / POST / PATCH, in-memory store |

The app polls `/api/dj/requests` (same origin). Where the API exists (the
deployed site) requests are real and cross-device; anywhere else (artifact
viewer, local file) it falls back to a simulated request feed automatically.

## What is real vs. simulated

Real: the whole UI, the request line (API-backed on the deployed site), the
Camelot/BPM matching math, persistence (notes, set log, queue, settings
survive reloads per device).

Simulated: no audio plays; waveforms are generated; BPM/key/lyric-flag
metadata is illustrative demo data, not analysis of actual recordings.

## Productization roadmap

1. **Audio analysis** — real BPM/key/beat-grid detection from the DJ's files
   (e.g. Essentia/aubio server-side, or licensed analysis SDK).
2. **Lyric intelligence** — licensed lyrics with timestamps (e.g. Musixmatch
   API) + profanity/content classifier to generate the flagged-moment data
   automatically, with human review flow.
3. **Playback** — real audio engine (Web Audio) or integrate as a companion
   app alongside Serato/Rekordbox via their libraries (Serato crates are
   readable), which is likely the faster wedge with working DJs.
4. **Requests at scale** — durable store (Postgres/Redis), per-event rooms
   with QR codes, WebSocket push instead of polling, real tips via Stripe.
5. **Accounts + billing** — DJ accounts, event profiles, subscription.
6. Native/PWA packaging, offline library, multi-device booth sync.

## Store caveat

The request store is in-memory: it resets when the Node app restarts and
assumes a single server process (true on the current Passenger setup). Fine
for demos; step 4 above replaces it.
