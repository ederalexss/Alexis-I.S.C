// Asignar nombre y versión de la cache

const CACHE_NAME = 'v1_cache_alexis_pwa';

// Ficheros a cachear en la aplicación

var urlToCache = [
    
    'css/styles.css',
    'img/favicon.png',
    'img/1.png',
    'img/2.png',
    'img/3.png',
    'img/4.png',
    'img/5.png',
    'img/6.png',
    'img/facebook.png',
    'img/instagram.png',
    'img/twitter.png',
    'img/favicon-1024.png',
    'img/favicon-512.png',
    'img/favicon-384.png',
    'img/favicon-256.png',
    'img/favicon-192.png',
    'img/favicon-128.png',
    'img/favicon-96.png',
    'img/favicon-64.png',
    'img/favicon-32.png',
    'img/favicon-16.png'
];

//Evento install
//instalador del service worker y guardar en cache
//durante la fase de instalación, generalmente se almacena en caché los activos estáticos
self.addEventListener('install', e => {
    e.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => {
          return cache.addAll(urlToCache)
            .then(() => self.skipWaiting())
        })
        .catch(err => console.log('Falló registro de cache', err))
    )
  })
   
  //una vez que se instala el SW, se activa y busca los recursos para hacer que funcione sin conexión
  self.addEventListener('activate', e => {
    const cacheWhitelist = [CACHE_NAME]
   
    e.waitUntil(
      caches.keys()
        .then(cacheNames => {
          return Promise.all(
            cacheNames.map(cacheName => {
              //Eliminamos lo que ya no se necesita en cache
              if (cacheWhitelist.indexOf(cacheName) === -1) {
                return caches.delete(cacheName)
              }
            })
          )
        })
        // Le indica al SW activar el cache actual
        .then(() => self.clients.claim())
    )
  })
   
  //cuando el navegador recupera una url
  self.addEventListener('fetch', e => {
    //Responder ya sea con el objeto en caché o continuar y buscar la url real
    e.respondWith(
      caches.match(e.request)
        .then(res => {
          if (res) {
            //recuperar del cache
            return res
          }
          //recuperar de la petición a la url
          return fetch(e.request)
        })
    )
  })