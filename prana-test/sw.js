/* Service Worker — MASTER PRANA v2.0 (Build 2026.11.19-clean) */
var CACHE_NAME = 'master-prana-v2.0';
var ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.svg',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png',
  './img/ios-step1.jpeg',
  './img/ios-step2.jpeg',
  './img/ios-step3.jpeg',
  './img/ios-step4.jpeg',
  './img/ios-step5.jpeg',
  './img/android-step1.jpeg',
  './img/android-step2.jpeg',
  './img/android-step3.jpeg',
  './img/android-step4.jpeg'
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

self.addEventListener('message', function(e) {
  if (e.data && e.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', function(e) {
  var url = e.request.url;

  /* External audio bypass */
  if (url.includes('.m4a') || url.includes('.mp3') || url.includes('.ogg')) {
    if (url.startsWith('http') && !url.includes(self.location.hostname)) {
      return;
    }
  }

  /* HTML navigations: network-first with no-cache, fallback to cache */
  if (e.request.mode === 'navigate' || url.endsWith('.html') || url.endsWith('/')) {
    e.respondWith(
      fetch(e.request, { cache: 'no-cache' }).then(function(resp) {
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
