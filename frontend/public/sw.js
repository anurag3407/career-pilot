/* careerpilot service worker (manual, no Workbox).
 *
 * Strategy:
 *  - install : precache the app shell, then skipWaiting()
 *  - activate: drop old caches, then clients.claim()
 *  - fetch   : navigations -> network-first (fallback cache/offline),
 *              same-origin static assets -> cache-first,
 *              API + cross-origin -> network-only (never cached)
 *
 * Bump CACHE_VERSION on any shell change to invalidate old caches.
 */

const CACHE_VERSION = 'v1';
const CACHE_NAME = `careerpilot-${CACHE_VERSION}`;

// App shell precached on install. Keep small; runtime cache handles the rest.
const APP_SHELL = ['/', '/index.html', '/manifest.json', '/speed.png'];

// Minimal offline fallback for failed navigations when no cache exists.
const OFFLINE_HTML =
  '<!doctype html><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width,initial-scale=1">' +
  '<title>Offline</title>' +
  '<body style="font-family:system-ui;background:#f8fafc;color:#0f172a;' +
  'display:flex;align-items:center;justify-content:center;height:100vh;margin:0">' +
  '<div style="text-align:center"><h1>You are offline</h1>' +
  '<p>careerpilot needs a connection to load this page.</p></div>';

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(APP_SHELL);
      } catch (err) {
        // Don't block install if a single asset 404s.
        console.error('[sw] precache failed:', err);
      }
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith('careerpilot-') && key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      );
      await self.clients.claim();
    })(),
  );
});

// Allow the page to trigger an immediate activation of a waiting worker.
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

function isStaticAsset(url) {
  return /\.(?:js|css|png|svg|jpg|jpeg|gif|webp|ico|woff2?|ttf|eot)$/i.test(
    url.pathname,
  );
}

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET; let the browser deal with everything else.
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Never cache cross-origin (fonts, firebase, razorpay) or API calls.
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api')) {
    return;
  }

  // HTML navigations -> network-first so the SPA shell stays fresh.
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(request);
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, fresh.clone());
          return fresh;
        } catch {
          const cached =
            (await caches.match(request)) || (await caches.match('/index.html'));
          return (
            cached ||
            new Response(OFFLINE_HTML, {
              headers: { 'Content-Type': 'text/html; charset=utf-8' },
            })
          );
        }
      })(),
    );
    return;
  }

  // Same-origin static assets -> cache-first with background fill.
  if (isStaticAsset(url)) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        try {
          const fresh = await fetch(request);
          if (fresh && fresh.status === 200 && fresh.type === 'basic') {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, fresh.clone());
          }
          return fresh;
        } catch (err) {
          console.error('[sw] asset fetch failed:', err);
          return Response.error();
        }
      })(),
    );
  }
});
