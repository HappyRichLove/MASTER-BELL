const CACHE_NAME = 'master-icon-test-v1';
const ASSETS = [
  './',
  './index.html',
  './raw.html',
  './manifest.json',
  './manifest-raw.json',
  './apple-touch-icon.png',
  './apple-touch-icon-raw.png',
  './icon-192.png',
  './icon-192-raw.png',
  './icon-512.png',
  './icon-512-raw.png',
  './icon-1024.png',
  './icon-1024-raw.png',
  './favicon.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
