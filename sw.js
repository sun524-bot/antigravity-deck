// Antigravity Deck GitHub Pages Service Worker
const CACHE_NAME = 'antigravity-deck-v5';
const STATIC_ASSETS = [
  '/antigravity-deck/',
  '/antigravity-deck/index.html',
  '/antigravity-deck/manifest.json',
  '/antigravity-deck/icon-192.png',
  '/antigravity-deck/icon-512.png'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS).catch(() => {})));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.pathname.includes('snapshot') || url.pathname.includes('/api') || url.pathname.includes('audio') || url.pathname.includes('gist')) {
    e.respondWith(fetch(e.request));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
