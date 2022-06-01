let CACHE_NAME = 'coba-pwa-cache-v1';
let urlsToCache = [
  '/',
  '/fallback.json',
  '/css/main.css',
  '/js/main.js',
  '/js/jquery.min.js',
  '/images/logo.png',
  '/images/favicon.ico'
];


self.addEventListener('install', function (event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('in install serviceworker... cache openend!')
      return cache.addAll(urlsToCache);
    })
  )

});

self.addEventListener('activate', function (event) {

  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName != CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      )
    })
  )
})


self.addEventListener('fetch', function (event) {
  // NORMAL FETCH
  // event.respondWith(
  //   caches.match(event.request).then(function (response) {
  //     if (response) {
  //       return response;
  //     }
  //     return fetch(event.request);
  //   })
  // )

  // CACHE THEN NETWORK

  const request = event.request
  let url = new URL(request.url)

  //pisahkan request API dan internal
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(request).then((response) => response || fetch(request))
    );
  } else {
    event.respondWith(
      caches.open('products-cache').then(function (cache) {
        return fetch(request).then(function (liveResponse) {
          cache.put(request, liveResponse.clone())
          return liveResponse;
        }).catch(function () {
          return caches.match(request).then(function (response) {
            if (response) return response
            return caches.match('/fallback.json')
          })
        })
      })
    );
  }


})

// self.addEventListener('fetch', event => {
//   console.log('Fetch event for ', event.request.url);
//   event.respondWith(
//     caches.match(event.request)
//     .then(response => {
//       if (response) {
//         console.log('Found ', event.request.url, ' in cache');
//         return response;
//       }
//       console.log('Network request for ', event.request.url);
//       return fetch(event.request)

//       // TODO 4 - Add fetched files to the cache

//     }).catch(error => {

//       // TODO 6 - Respond with custom offline page

//     })
//   );
// });
