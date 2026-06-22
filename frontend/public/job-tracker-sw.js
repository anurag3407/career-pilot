const CACHE_NAME = "career-pilot-app-shell-v1";
const APP_SHELL_URLS = ["/", "/index.html"];
const STATIC_ASSET_EXTENSIONS = [
  ".css",
  ".gif",
  ".html",
  ".ico",
  ".jpg",
  ".jpeg",
  ".js",
  ".json",
  ".png",
  ".svg",
  ".webp",
  ".woff",
  ".woff2",
];

const isCacheableStaticRequest = (request, url) => {
  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return false;
  }

  if (url.pathname.startsWith("/api") || request.headers.get("authorization")) {
    return false;
  }

  return STATIC_ASSET_EXTENSIONS.some((extension) =>
    url.pathname.endsWith(extension),
  );
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/index.html")),
    );
    return;
  }

  if (!isCacheableStaticRequest(request, url)) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type === "opaque") {
          return response;
        }

        const responseToCache = response.clone();
        event.waitUntil(
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(request, responseToCache)),
        );
        return response;
      });
    }),
  );
});
