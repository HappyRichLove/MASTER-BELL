/* Service Worker — MASTER v20.11 */
var CACHE_NAME = 'master-v20.11';
var ASSETS = [
  './',
  './index.html',
  './favicon.svg',
  './favicon.ico',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png',
  './manifest.json',
  './metronome.html',
  './suncalc.min.js'
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
        keys.filter(function(k) { return k !== CACHE_NAME; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  var url = e.request.url;
  /* Media files: cache-first (audio from S3) */
  if (url.includes('.m4a') || url.includes('.mp3') || url.includes('.ogg')) {
    // Bypass SW for external audio to fix Safari Range request (The operation was aborted) error
    if (url.startsWith('http') && !url.includes(self.location.hostname)) {
      return; 
    }
    e.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return cache.match(e.request).then(function(cached) {
          if (cached) return cached;
          return fetch(e.request).then(function(resp) {
            if (resp.status === 200) {
              cache.put(e.request, resp.clone());
            }
            return resp;
          });
        });
      })
    );
    return;
  }
  /* HTML: network-first (to pick up updates), fallback to cache */
  if (e.request.url.includes('index.html') || e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).then(function(resp) {
        return caches.open(CACHE_NAME).then(function(cache) {
          cache.put(e.request, resp.clone());
          return resp;
        });
      }).catch(function() {
        return caches.match(e.request);
      })
    );
    return;
  }
  /* All other: cache-first */
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request);
    })
  );
});

/* Push notifications (Web Push — готово к подключению бэкенда) */
self.addEventListener('push', function(e) {
  if (!e.data) return;
  var data = e.data.json();
  e.waitUntil(
    self.registration.showNotification(data.title || '🙏 MASTER', {
      body: data.body || 'Время практики',
      icon: './icon-192.png',
      badge: './icon-192.png',
      tag: 'sandhya-notification',
      renotify: true
    })
  );
});

self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(cls) {
      for (var i = 0; i < cls.length; i++) {
        if (cls[i].url && 'focus' in cls[i]) { return cls[i].focus(); }
      }
      if (clients.openWindow) return clients.openWindow('./index.html');
    })
  );
});
