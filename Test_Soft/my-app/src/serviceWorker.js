const CACHE_NAME = 'retro-app-cache-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    // poți adăuga aici și CSS-ul/JS-ul bundlat dacă vrei să le cache-ui
];

// Instalare și pre-caching
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activare și curățare cache vechi
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

// Fetch: răspunde din cache, apoi updatează din rețea
self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return;
    event.respondWith(
        caches.match(event.request).then(cached => {
            const networkFetch = fetch(event.request)
                .then(res => {
                    if (res.ok) {
                        caches.open(CACHE_NAME).then(cache => cache.put(event.request, res.clone()));
                    }
                    return res.clone();
                })
                .catch(() => cached);
            return cached || networkFetch;
        })
    );
});
