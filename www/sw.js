const CACHE_NAME = "mce-ios-offline-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./libs/tailwind.min.js",
  "./libs/chart.min.js",
  "./libs/datalabels.min.js",
  "./libs/xlsx.full.min.js",
  "./libs/jspdf.umd.min.js",
  "./libs/jspdf.plugin.autotable.min.js"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    );
  }
});
