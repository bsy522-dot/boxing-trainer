// Boxing Trainer Pro - Service Worker v12
const CACHE_NAME = 'boxing-trainer-v14';
const PRECACHE_URLS = [
  './',
  './index.html',
  './boxing-trainer-v5.html',
  './v8_patch.js',
  './v9_patch.js',
  './v10_patch.js',
  './v11_patch.js',
  './v12_patch.js',
  './v13_patch.js',
  './v14_patch.js',
  './manifest.json'
];

// Install: precache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_URLS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate: clean old caches + claim clients
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch: cache-first for HTML/CSS/JS, network-first for JSON data
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if(url.origin !== location.origin) {
    event.respondWith(fetch(request));
    return;
  }

  // Network-first for JSON data (API responses, dynamic data)
  if(request.url.endsWith('.json') && !request.url.includes('manifest.json')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Cache-first for HTML, CSS, JS, and manifest
  event.respondWith(cacheFirst(request));
});

// Cache-first strategy
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if(cached) {
    // Update cache in background
    fetchAndCache(request).catch(() => {});
    return cached;
  }
  return fetchAndCache(request);
}

// Network-first strategy
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if(response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch(e) {
    const cached = await caches.match(request);
    if(cached) return cached;
    return new Response(JSON.stringify({error: 'offline'}), {
      headers: {'Content-Type': 'application/json'}
    });
  }
}

// Fetch and update cache
async function fetchAndCache(request) {
  try {
    const response = await fetch(request);
    if(response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch(e) {
    // If network fails and nothing in cache, return offline page
    const cached = await caches.match(request);
    if(cached) return cached;
    // Return a basic offline response for navigation requests
    if(request.mode === 'navigate') {
      const offlineCache = await caches.match('./index.html');
      if(offlineCache) return offlineCache;
    }
    return new Response('Offline', {status: 503, statusText: 'Service Unavailable'});
  }
}
