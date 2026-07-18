# Salt — beta test plan

**Live app:** https://paidmediapro.eb28.co/demo/salt
**Guest page:** https://paidmediapro.eb28.co/demo/request.html
Feedback: the **β** button in the app header (stored server-side; read at
`/api/dj/feedback?key=saltbeta`).

## Automated suite

```
cd dj-prototype/test && python3 build-selftest.py
chromium --headless --no-sandbox --autoplay-policy=no-user-gesture-required \
  --window-size=1280,800 --virtual-time-budget=90000 --dump-dom selftest.html \
  | grep -o 'id="TESTLOG">[^<]*'
```

Run at 1280x800 **and** 390x844. Every entry must read `OK`; `uncaught:NONE`
and `no-source-leak:OK` are mandatory. ~80 checks cover decks, scratch,
loops, sync, automix, imports (audio/M3U/Rekordbox), BPM+key detection,
rooms, sections, lights, censor, soundboard, REC, EQ, events, invoicing,
the explicit report and the feedback sheet.

## Manual checklist (per device: laptop Chrome/Safari + one phone)

1. **Sound + mix** — SOUND on; load two tracks via SUGGEST; SYNC; ride the
   crossfader and channel EQs (LO full-left must kill the bass); ECHO/FILT.
2. **Explicit radar** — load SICKO MODE dirty (CLEAN off) in Wedding mode;
   watch the LYRICS lane countdown and warning bar; hold CENSOR through a
   flag; hit CLEAN and confirm the lane flips to "flags removed".
3. **Turntables** — scratch both platters; hot cues set/jump/shift-clear;
   4/8/16 loops audibly loop; beat-jumps stay on grid.
4. **Import** — drop 2-3 real MP3s: BPM/key detected, waveform real, plays
   on deck; import an M3U or Rekordbox XML; ♪ In-key only narrows sensibly.
5. **Requests (two devices)** — New room; scan the QR with a phone; send a
   request with tip; accept on the DJ screen; phone status flips to
   Accepted; track lands in Up Next and auto-loads when a deck ends.
6. **Automix** — enable; let a track run out; it should sync, start and
   crossfade hands-free.
7. **Lights** — programs react to the beat; Projector fullscreens; (if
   available) WLED/LIFX connect from an http/local copy.
8. **Soundboard + REC** — every pad fires; load a custom clip; REC a minute
   and play the downloaded file back.
9. **Events & business** — new event, edit venue/date, add notes; pick a
   package; download invoice + contract and print-preview them.
10. **Reports & log** — Explicit report groups correctly per mode; set log
    fills after 15s of play; Export downloads.
11. **Persistence** — reload: notes, queue, EQ, mode, event survive.
12. **Feedback** — send a β note; confirm it lands in the inbox URL above.

## Known limitations (by design, this build)

- Demo library metadata is illustrative; only imported audio is analyzed.
- Imported audio lives in memory — re-import after reload.
- Request/feedback stores are file/memory on shared hosting — fine for
  beta, replaced by a database for production.
- LAN lighting (WLED) can't be reached from the https page; use a local
  copy at the gig. Hue needs the future desktop companion.
