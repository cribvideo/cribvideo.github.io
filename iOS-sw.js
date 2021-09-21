var UI_CACHE_STORE = `CA0.1i`;
var data_cache_store = `cribdata`
var urlsToCache = [
  '/ios/',
  '/ios/index.js',
  '/ios/index.css'
];

const dontCache = [
  "/api/v1/updates"
]

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});


self.addEventListener('fetch', function (event) {
    event.respondWith(
      fetch(event.request).then((response) => {
        let currentStore = data_cache_store;

        if (event.request.url.endsWith(".css") || event.request.url.endsWith(".html") || event.request.url.endsWith(".js")) {
          currentStore = UI_CACHE_STORE;
        }

        return caches.open(currentStore).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        })
      }).catch(function () {
        return caches.match(event.request);
      }),
    );
});