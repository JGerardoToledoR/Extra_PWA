const CACHE_NAME = "camara-pwa-v1";
const ASSETS_APP_SHELL = [
    "./",
    "./index.html",
    "./css/styles.css",
    "./js/app.js",
    "./main.js",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS_APP_SHELL);
        })
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request)
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            )
        )
    );
});
