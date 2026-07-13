# Paid Media Pro for iOS

Native SwiftUI companion for the Paid Media Pro web platform.

## Current state

- Warm, plain-language overview matching the web workspace.
- Explicitly labeled sample metrics; no fabricated live-account state.
- AI recommendation queue with evidence, estimated impact, and local demo approvals.
- Watch-only, approval, and bounded-autopilot control concepts.
- Google Ads and Meta connection guidance that routes authentication through the server-owned web flow.
- iOS Simulator build verified with Xcode.

The app does not yet authenticate users or call the Paid Media Pro API. OAuth tokens must remain on the server; they should never be embedded in the app bundle.

## Build

```bash
xcodebuild \
  -project PaidMediaBuyerPro.xcodeproj \
  -scheme PaidMediaBuyerPro \
  -sdk iphonesimulator \
  -destination 'generic/platform=iOS Simulator' \
  CODE_SIGNING_ALLOWED=NO \
  build
```

## Before TestFlight

- Add authenticated API networking and Keychain-backed user session handling.
- Add app icon and launch assets.
- Replace the temporary web setup URL after production hosting is restored.
- Complete privacy manifests and App Store privacy disclosures.
- Add unit, accessibility, and UI tests.
- Archive with the intended App Store Connect record and current signing assets.
