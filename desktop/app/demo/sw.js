// Salt Requests service worker — makes the guest request app installable and
// keeps the shell available offline. Network-first for the API (always fresh
// requests/status), cache-first for the app shell and icons.
const CACHE = "salt-requests-v1";
const SHELL = [
  "/demo/request.html",
  "/demo/catalog.json",
  "/demo/manifest.webmanifest",
  "/demo/icons/icon-192.png",
  "/demo/icons/icon-512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return; // never cache POST/PATCH
  // API: always go to the network so requests and statuses are live
  if (url.pathname.startsWith("/api/")) {
    e.respondWith(fetch(e.request).catch(() => new Response(JSON.stringify({ requests: [] }), { headers: { "Content-Type": "application/json" } })));
    return;
  }
  // shell/assets: cache-first, fall back to network then cache the result
  e.respondWith(
    caches.match(e.request).then((hit) =>
      hit ||
      fetch(e.request).then((res) => {
        if (res.ok && (url.pathname.startsWith("/demo/"))) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      }).catch(() => hit)
    )
  );
});
