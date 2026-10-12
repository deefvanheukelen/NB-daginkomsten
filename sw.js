// Alleen de eigen NB-daginkomsten scope; geen NailBooker-cache.
const CACHE = 'nb-daginkomsten-static-v3';
const ASSETS = ['./styles.css', './icon-192.png', './icon-512.png', './icon-maskable-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('nb-daginkomsten-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  // HTML en JavaScript altijd via netwerk: geen verouderde inkomsten of code.
  if (request.mode === 'navigate' || /\.(?:js|json|webmanifest)$/.test(new URL(request.url).pathname)) return;
  event.respondWith(caches.match(request).then(hit => hit || fetch(request)));
});
