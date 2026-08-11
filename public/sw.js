import { precacheAndRoute } from 'workbox-precaching';

precacheAndRoute(self.__WB_MANIFEST || []);

const CACHE_NAME = 'tuzla-parking-v3';
const TILE_CACHE_NAME = 'tuzla-tiles-v3';
const DATA_CACHE_NAME = 'tuzla-data-v3';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/main.tsx',
  '/src/index.css',
  '/src/App.tsx',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  '/tile/online-style.json',
  '/tile/offline-style.json',
  '/tile/tuzla.pmtiles',
];

// Helper to determine if request is for map tile images
function isTileRequest(url) {
  return (
    url.includes('/tile/') ||
    url.includes('tile.openstreetmap.org') ||
    url.includes('basemaps.cartocdn.com') ||
    url.includes('stadiamaps') ||
    url.includes('mapbox') ||
    url.includes('/pmtiles/') ||
    url.match(/\/\d+\/\d+\/\d+(\.pmtiles|\.jpg|\.webp)?/)
  );
}

// Helper to determine if request is an API request (Geoapify, etc.)
function isApiRequest(url) {
  return (
    url.includes('geoapify.com') ||
    url.includes('/api/') ||
    url.includes('openstreetmap')
  );
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((e) => {
        console.warn('SW cache addAll warning:', e);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  const allowedCaches = [CACHE_NAME, TILE_CACHE_NAME, DATA_CACHE_NAME];
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (!allowedCaches.includes(key)) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = event.request.url;

  // 1. Map Tiles: Cache-First Strategy for speed & offline map rendering
  if (isTileRequest(url)) {
    event.respondWith(
      caches.open(TILE_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request)
            .then((networkResponse) => {
              if (
                networkResponse &&
                (networkResponse.status === 200 ||
                  networkResponse.type === 'opaque' ||
                  networkResponse.type === 'cors')
              ) {
                cache.put(event.request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => {
              return caches.match('/tile/14/9040/5921.webp').then((fallback) => {
                if (fallback) return fallback;
                return new Response('', { status: 404, statusText: 'Tile Not Cached' });
              });
            });
        });
      })
    );
    return;
  }

  // 2. API & Routing Data: Network-First with Cache Fallback
  if (isApiRequest(url)) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) => {
        return fetch(event.request)
          .then((networkResponse) => {
            if (
              networkResponse &&
              (networkResponse.status === 200 ||
                networkResponse.type === 'opaque' ||
                networkResponse.type === 'cors')
            ) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
            return cache.match(event.request).then((cachedData) => {
              if (cachedData) return cachedData;
              return new Response(JSON.stringify({ offline: true }), {
                headers: { 'Content-Type': 'application/json' },
              });
            });
          });
      })
    );
    return;
  }

  // 3. App Shell & Static Assets: Cache-First falling back to Network
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch fresh copy in background to keep cache fresh
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          })
          .catch(() => {/* ignore background refresh errors */ });
        return cachedResponse;
      }

      return fetch(event.request)
        .then((response) => {
          if (
            response &&
            (response.status === 200 || response.type === 'basic' || response.type === 'cors')
          ) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/index.html');
          }
          return new Response('Offline', { status: 503, statusText: 'Offline' });
        });
    })
  );
});

