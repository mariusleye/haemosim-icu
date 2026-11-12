// Service Worker von HämoSim ICU (erzeugt von bauen.mjs, nicht von Hand ändern).
// Erst Netz, bei fehlendem Netz der Zwischenspeicher: online die neueste Fassung, offline die zuletzt geladene.
const CACHE = 'haemosim-10de404fd0e8';
const VORRAT = ["./","index.html","manifest.webmanifest","icons/apple-touch-icon.png","icons/icon-192.png","icons/icon-512.png","icons/icon-64.png","icons/icon-maskable-512.png"];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => Promise.all(VORRAT.map((u) => c.add(u).catch(() => null)))).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('haemosim-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(fetch(req).then((res) => { if (res.ok && res.type === 'basic') { const kopie = res.clone(); caches.open(CACHE).then((c) => c.put(req, kopie)); } return res; })
    .catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || (req.mode === 'navigate' ? caches.match('./') : undefined)).then((r) => r || Response.error())));
});
