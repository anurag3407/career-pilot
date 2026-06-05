/**
 * Service worker registration helper.
 *
 * Kept as a pure-ish function so it is unit-testable in jsdom (the SW itself
 * cannot run there). Registration is gated to production builds to avoid
 * aggressive caching getting in the way during development.
 */

/**
 * Register the service worker at /sw.js.
 *
 * @param {object} [options]
 * @param {boolean} [options.force=false] - Register even outside production
 *   (used by tests / manual debugging).
 * @returns {Promise<ServiceWorkerRegistration|null>} the registration, or null
 *   if registration was skipped or failed.
 */
export async function registerServiceWorker({ force = false } = {}) {
  // Skip when the API is unavailable (SSR, old browsers, jsdom without mock).
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  // Production-only unless explicitly forced.
  const isProd =
    force ||
    (typeof import.meta !== 'undefined' &&
      import.meta.env &&
      import.meta.env.PROD);
  if (!isProd) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    return registration;
  } catch (err) {
    // Never let a SW failure break app startup.
    console.error('[sw] registration failed:', err);
    return null;
  }
}

/**
 * Attach registration to the window `load` event so it never competes with
 * initial render/network. No-op when `window` is unavailable.
 *
 * @param {object} [options] - forwarded to {@link registerServiceWorker}.
 */
export function setupServiceWorker(options) {
  if (typeof window === 'undefined') return;
  window.addEventListener('load', () => {
    registerServiceWorker(options);
  });
}
