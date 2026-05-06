// 2026-03-07 | DE/TR: Cache bump + safer update flow (skipWaiting/message).
const CACHE = "sprachbox-de-tr-v3-bgfix-20260310-01";
const CORE = [
  "./",
  "./index.html",
  "./styles.css",
  "./styles.css?v=bgfix_20260310_01",
  "./app.js",
  "./app.js?v=bgfix_20260310_01",
  "./manifest.webmanifest",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/bg-de-en.webp",
  "./data/talk_levels_de_tr.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil((async ()=>{
    const cache = await caches.open(CACHE);
    await cache.addAll(CORE);
    self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async ()=>{
    const keys = await caches.keys();
    await Promise.all(keys.map(k => (k === CACHE) ? null : caches.delete(k)));
    self.clients.claim();
  })());
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Cache-first for same-origin, runtime cache for JSON
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle same-origin
  if (url.origin !== self.location.origin) return;

  event.respondWith((async ()=>{
    const cache = await caches.open(CACHE);

    // Prefer fresh HTML for navigation so updates show up sooner.
    if (req.mode === "navigate") {
      try{
        const fresh = await fetch(req, { cache: "no-cache" });
        if (fresh && fresh.ok) cache.put(req, fresh.clone());
        return fresh;
      }catch(_e){
        const fallbackNav = await cache.match(req);
        if (fallbackNav) return fallbackNav;
        const fallbackIndex = await cache.match("./index.html");
        if (fallbackIndex) return fallbackIndex;
      }
    }

    // Try cache first
    const cached = await cache.match(req);
    if (cached) return cached;

    try{
      const res = await fetch(req);
      // Cache successful responses (including JSON)
      if (res && res.ok){
        cache.put(req, res.clone());
      }
      return res;
    }catch(e){
      // Offline fallback to index for navigation
      if (req.mode === "navigate"){
        const fallback = await cache.match("./index.html");
        if (fallback) return fallback;
      }
      throw e;
    }
  })());
});
