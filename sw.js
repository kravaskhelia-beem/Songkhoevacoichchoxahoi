/* =========================================================
   sw.js — Service Worker cho PWA
   Chiến lược: cache-first cho tài sản tĩnh, network fallback
   Tăng CACHE_VERSION khi cập nhật site để làm mới cache
   ========================================================= */
const CACHE_VERSION = 'skkc-v1.0.0';
const ASSETS = [
  './',
  './index.html',
  './ma-tuy.html',
  './assets/css/main.min.css',
  './assets/js/site.js',
  './assets/js/trang-chu.js',
  './manifest.json',
  './images/logo.png',
  './images/og-image.jpg',
  './images/favicon-16.png',
  './images/favicon-32.png',
  './images/apple-touch-icon.png',
  './images/icon-192.png',
  './images/icon-512.png',
  './images/smokers-lungs.jpg',
  './images/evali-lung.jpg',
  './images/evali-ct.gif',
  './images/meth-tablets.jpg',
  './images/strawberry-meth.jpg',
  './images/opium-poppy.jpg'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function (cache) {
      return cache.addAll(ASSETS);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (key) { return key !== CACHE_VERSION; })
            .map(function (key) { return caches['delete'](key); })
      ).then(function () {
        return self.clients.claim();
      });
    })
  );
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(function (cached) {
      return cached || fetch(event.request).then(function (response) {
        if (response.ok && event.request.url.startsWith(self.location.origin)) {
          const clone = response.clone();
          caches.open(CACHE_VERSION).then(function (cache) {
            cache.put(event.request, clone);
          });
        }
        return response;
      }).catch(function () {
        /* Offline & chưa có cache: trả về trang chủ cho điều hướng */
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
        return Response.error();
      });
    })
  );
});
