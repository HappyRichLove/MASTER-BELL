// MASTER SLEEP Service Worker v1.0.0
const CACHE_NAME = 'master-sleep-v1.0.0';

const ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'img/icon-192.png',
  'img/icon-512.png',
  'img/apple-touch-icon.png',
  'img/favicon.svg',
  'audio/spiritus_10m.mp3',
  'audio/spiritus_loop.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch((err) => {
        console.warn('[SW] Cache addAll warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k.startsWith('master-sleep-') && k !== CACHE_NAME)
            .map((k) => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  // Only handle GET requests within this scope
  if (event.request.method !== 'GET') return;

  // Audio files: Cache First with Network Fallback
  if (url.pathname.endsWith('.mp3')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
          }
          return networkRes;
        }).catch(() => cached);
      })
    );
    return;
  }

  // HTML and other assets: Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request).then((networkRes) => {
        if (networkRes && networkRes.status === 200) {
          const resClone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        }
        return networkRes;
      }).catch(() => cached);

      return cached || fetchPromise;
    })
  );
});