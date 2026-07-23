#!/usr/bin/env bash
# Build the REAL native macOS Salt app (Electron) for BOTH Apple Silicon and
# Intel — and do it even from Linux/CI where GitHub release downloads are
# blocked, by pulling Electron's runtime from its official npmmirror CDN.
#
# On a Mac you don't need any of this — just:  cd desktop && npm i && npm start
# (or npm run dist:mac). This script exists for headless/locked-down builders.
#
# Requirements: node + npm. Optional: rcodesign (cargo install apple-codesign)
# to ad-hoc sign so the app launches on Apple Silicon without a local rebuild.
set -euo pipefail
cd "$(dirname "$0")"

EV="33.0.0"
export ELECTRON_MIRROR="https://cdn.npmmirror.com/binaries/electron/"   # allowed CDN mirror
export ELECTRON_CUSTOM_DIR="v${EV}"
export ELECTRON_GET_USE_PROXY=1

echo "==> generating icon (icns from build/icon.png)"
node -e '
const fs=require("fs");const png=fs.readFileSync("build/icon.png");
const ents=[["ic09",png],["ic14",png]];const parts=[];let t=8;
for(const [c,d] of ents){const h=Buffer.alloc(8);h.write(c,0,"ascii");h.writeUInt32BE(d.length+8,4);parts.push(h,d);t+=d.length+8;}
const hd=Buffer.alloc(8);hd.write("icns",0,"ascii");hd.writeUInt32BE(t,4);
fs.writeFileSync("build/AppIcon.icns",Buffer.concat([hd,...parts]));'

echo "==> staging clean app (only qrcode at runtime; electron is dev-only)"
rm -rf stage-native && mkdir -p stage-native
cp main.js server.js stage-native/
cp -r app stage-native/app
cat > stage-native/package.json <<JSON
{ "name":"salt-desktop","productName":"Salt","version":"1.0.0","main":"main.js",
  "dependencies":{"qrcode":"^1.5.4"},"devDependencies":{"electron":"${EV}"} }
JSON
( cd stage-native && ELECTRON_SKIP_BINARY_DOWNLOAD=1 npm install --no-audit --no-fund )

echo "==> installing packager (from npmjs; kept out of the bundle)"
ELECTRON_SKIP_BINARY_DOWNLOAD=1 npm install --no-save --no-audit --no-fund electron@"${EV}" @electron/packager qrcode

rm -rf release-native
for ARCH in arm64 x64; do
  echo "==> packaging darwin/${ARCH}"
  ( cd stage-native && ../node_modules/.bin/electron-packager . Salt \
      --platform=darwin --arch="${ARCH}" --overwrite --out=../release-native \
      --app-bundle-id=co.eb28.salt --app-version=1.0.0 --prune=true )
  cp build/AppIcon.icns "release-native/Salt-darwin-${ARCH}/Salt.app/Contents/Resources/electron.icns"
  if command -v rcodesign >/dev/null 2>&1; then
    echo "==> ad-hoc signing darwin/${ARCH} (required to launch on Apple Silicon)"
    rcodesign sign "release-native/Salt-darwin-${ARCH}/Salt.app" >/dev/null
  else
    echo "!!  rcodesign not found — ${ARCH} app is UNSIGNED and will not launch on"
    echo "!!  Apple Silicon until re-signed. Install: cargo install apple-codesign"
  fi
  ( cd "release-native/Salt-darwin-${ARCH}" && zip -y -r -q -X "../Salt-${ARCH}.zip" Salt.app )
  echo "==> release-native/Salt-${ARCH}.zip"
done
echo "Done. Zips in release-native/. Unsigned/undownloaded install: xattr -cr Salt.app"
