const CACHE_NAME = 'auto-kauf-assistent-v2';
const ASSETS = [
  './index.html',
  './manifest.webmanifest',
  './sw.js',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  const isIndex =
    url.origin === self.location.origin &&
    (url.pathname.endsWith('/index.html') ||
      url.pathname.endsWith('/auto-kauf-assistent/'));

  if (url.origin === self.location.origin) {
    event.respondWith(
      (isIndex
        ? fetch(event.request)
            .then((response) => {
              const copy = response.clone();
              caches.open(CACHE_NAME).then((cache) =>
                cache.put(event.request, copy)
              );
              return response;
            })
            .catch(() => caches.match('./index.html'))
        : caches.match(event.request).then((cached) => {
            if (cached) return cached;
            return fetch(event.request)
              .then((response) => {
                const copy = response.clone();
                caches.open(CACHE_NAME).then((cache) =>
                  cache.put(event.request, copy)
                );
                return response;
              })
              .catch(() => caches.match('./index.html'));
          }))
    );
  } else {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('./index.html'))
    );
  }
});
