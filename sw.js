const CACHE_STATIC_NAME = 'static-v1';
const CACHE_DYNAMIC_NAME = 'dynamic-v1';
const CACHE_INMUTABLE_NAME = 'inmutable-v1';

function clean(cacheName, sizeItems){
    caches.open(cacheName)
        .then(cache => {
            cache.keys().then(k => {
                if (k.length >= sizeItems) {
                    cache.delete(k[0]).then(() => {
                        clean(cacheName, sizeItems)
                    })
                }
            })
        })
}

self.addEventListener('install', (e) => {
    const promStatic = caches.open(CACHE_STATIC_NAME)
        .then(cache => {
            return cache.addAll([
                '/20213-PWA-GSA-U2-P2/',
                '/20213-PWA-GSA-U2-P2/index.html',
                '/20213-PWA-GSA-U2-P2/images/1.png',
                '/20213-PWA-GSA-U2-P2/images/2.png',
                '/20213-PWA-GSA-U2-P2/images/3.png',
                '/20213-PWA-GSA-U2-P2/images/4.png',
                '/20213-PWA-GSA-U2-P2/js/app.js'
            ])
        })

    const promInmutable = caches.open(CACHE_INMUTABLE_NAME)
        .then(cacheInmutable => {
            return cacheInmutable.addAll([
                'https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css',
                'https://code.jquery.com/jquery-3.5.1.min.js',
                'https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.bundle.min.js'
            ])
        })
        
    e.waitUntil(Promise.all([promStatic, promInmutable]));
})

self.addEventListener('fetch', (e) => {
    // Cache with network fallback
    const resCache = caches.match(e.request)
        .then(res => {
            if (res) {
                return res;
            }
            return fetch(e.request)
                .then(response => {
                    caches.open(CACHE_DYNAMIC_NAME)
                        .then(c => {
                            c.put(e.request, response).then(() => {
                                clean(CACHE_DYNAMIC_NAME, 10)
                            })
                        });
                    return response.clone();
                })
        })
    e.respondWith(resCache)
})