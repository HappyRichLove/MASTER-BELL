/* Service Worker — MASTER PRANA v1.0.5 */
var CACHE_NAME = 'master-prana-v1.0.5';
var ASSETS = [
  './',
  './index.html',
  './pranayama.html',
  './metronome.html',
  './manifest.json',
  './favicon.svg',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k.startsWith('master-prana-') && k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  var url = e.request.url;

  /* External audio bypass */
  if (url.includes('.m4a') || url.includes('.mp3') || url.includes('.ogg')) {
    if (url.startsWith('http') && !url.includes(self.location.hostname)) {
      return;
    }
  }

  /* HTML navigations: network-first, fallback to cache */
  if (e.request.mode === 'navigate' || url.endsWith('.html') || url.endsWith('/')) {
    e.respondWith(
      fetch(e.request).then(function(resp) {
        if (resp && resp.status === 200) {
          var respClone = resp.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(e.request, respClone);
          });
        }
        return resp;
      }).catch(function() {
        return caches.match(e.request).then(function(cached) {
          return cached || caches.match('./index.html') || caches.match('./');
        });
      })
    );
    return;
  }

  /* Assets: cache-first */
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).then(function(resp) {
        if (resp && resp.status === 200) {
          var respClone = resp.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(e.request, respClone);
          });
        }
        return resp;
      });
    })
  );
});