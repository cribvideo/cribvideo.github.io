var UI_CACHE_STORE = `CA0.1i`;
var data_cache_store = `cribdata`
var urlsToCache = [
  '/android/',
  '/android/index.js',
  '/android/index.css'
];

const dontCache = [
  "/api/v1/updates"
]

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(UI_CACHE_STORE)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});


self.addEventListener('fetch', function (event) {
    event.respondWith(
      fetch(event.request).then((response) => {
        let currentStore = UI_CACHE_STORE;

        if (event.request.url.startsWith("https://cribapi.ceccun.com")) {
          currentStore = data_cache_store;
        }

        return caches.open(currentStore).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      }).catch(function () {
        return caches.match(event.request);
      }),
    );
});