# Salt Requests — iOS & Google Play packaging

The guest request app is now an installable **PWA** (Progressive Web App):
manifest, service worker, app icons, offline shell, an install button, and a
venue-code entry screen for when it's opened as a standalone app.

- **Live app:** https://paidmediapro.eb28.co/demo/request.html
- Installs today on Android (Chrome → "Install app") and iOS (Share → "Add to
  Home Screen"). Opens fullscreen with its own icon, no browser chrome.

## Fastest path to both stores — PWABuilder (free, official)

[PWABuilder](https://www.pwabuilder.com) (by Microsoft) packages a PWA into
store-ready native wrappers.

1. Go to pwabuilder.com, enter `https://paidmediapro.eb28.co/demo/request.html`.
2. It scores the manifest/SW (this app already passes the installability
   checks) and lets you download packages:
   - **Android** → a signed `.aab` (Trusted Web Activity via Bubblewrap) you
     upload to Google Play. ~$25 one-time Play developer fee.
   - **iOS** → an Xcode project you build/submit to App Store Connect. Needs
     an Apple Developer account ($99/yr) and a Mac (or a Mac cloud build).
3. Fill listing copy from the landing page, add screenshots, submit.

## Alternative — Capacitor (more native control)

If you later want push notifications, native tips/payments, or deeper OS
integration, wrap it with [Capacitor](https://capacitorjs.com): `npm i
@capacitor/core @capacitor/cli`, point `webDir` at the request app, add the
iOS and Android platforms, and build in Xcode / Android Studio. Same web
codebase, native shells.

## Recommended before a public store launch
- **Own domain** for the app (e.g. `saltrequests.app`) — cleaner branding,
  and store reviewers prefer a dedicated domain over a subpath.
- **Backend**: move the request store from in-memory to a database, and add
  venue accounts so any bar/DJ can create a room and print a QR.
- **Store assets**: 512² icon (already generated), feature graphic, 3–5
  screenshots per platform, privacy policy URL (required by both stores).
- **Monetization hooks**: real tipping via Stripe/Apple Pay/Google Pay, and a
  licensing tier for venues (the universal-request-app play).

## The product vision this enables
One installable "Salt Requests" app that patrons keep on their phone and use
at **any** participating venue by entering that venue's code — while each DJ
or bar licenses the booth side. The web app and this PWA are the shared
foundation for both the dedicated-to-Salt launch and the universal platform.
