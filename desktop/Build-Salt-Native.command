#!/bin/bash
# Double-click this on your Mac to build the REAL native Salt app (its own
# window, no browser). It downloads Electron and packages Salt.app + a .dmg
# installer. Everything runs on your Mac; nothing here is restricted.
cd "$(dirname "$0")/desktop" 2>/dev/null || cd "$(dirname "$0")" || exit 1
clear
echo "================================================"
echo "   Building the native Salt app for your Mac"
echo "================================================"
echo

if ! command -v node >/dev/null 2>&1; then
  echo "One thing needed first: Node.js (free, ~1 minute)."
  echo
  echo "  1. nodejs.org is opening now — click the big green LTS"
  echo "     button, download it, run the installer."
  echo "  2. Then double-click Build-Salt-Native.command again."
  echo
  open "https://nodejs.org/en/download/" 2>/dev/null
  echo
  read -n 1 -s -r -p "Press any key to close this window."
  exit 1
fi

echo "Step 1/2  Installing components (downloads Electron, ~1-2 min)..."
echo
npm install --no-audit --no-fund || {
  echo; echo "Install hit a snag. Copy the red text above and send it to me."
  read -n 1 -s -r -p "Press any key to close."; exit 1;
}

echo
echo "Step 2/2  Packaging Salt.app + installer..."
echo
npm run dist:mac || {
  echo; echo "Packaging hit a snag. Copy the red text above and send it to me."
  read -n 1 -s -r -p "Press any key to close."; exit 1;
}

echo
echo "================================================"
echo "   Done. Opening the folder with your app."
echo "================================================"
echo "  - Salt.app          <- the native app (drag to Applications)"
echo "  - Salt-1.0.0-*.dmg  <- installer to share"
echo
open release/ 2>/dev/null
read -n 1 -s -r -p "Press any key to close this window."
