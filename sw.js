const CACHE_NAME = "notepad-pro-v1";

const APP_FILES = [
    "./",
    "./index.html",
    "./manifest.json",
    "./icon.png"
];

// App install হলে প্রয়োজনীয় ফাইল cache করবে
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(APP_FILES))
            .then(() => self.skipWaiting())
    );
});

// পুরোনো cache মুছে ফেলবে
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

// Internet না থাকলেও cached file থেকে চালানোর চেষ্টা করবে
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {

            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request).catch(() => {
                return caches.match("./index.html");
            });
        })
    );
});