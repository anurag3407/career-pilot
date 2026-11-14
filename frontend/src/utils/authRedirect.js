/**
 * Resolves where a user should land after signing in.
 *
 * `ProtectedRoute` stores the originally requested path in the router's
 * location state. We only ever honour internal, absolute paths so a crafted
 * `from` value can never be used to bounce someone to another origin.
 *
 * @param {unknown} from - Value taken from `location.state.from`
 * @returns {string} An internal path, defaulting to '/dashboard'
 */
export function resolvePostAuthRedirect(from) {
  const fallback = '/dashboard';

  if (typeof from !== 'string') return fallback;

  const trimmed = from.trim();

  if (!trimmed.startsWith('/')) return fallback;
  // Protocol-relative URLs ("//evil.com") are treated as external.
  if (trimmed.startsWith('//')) return fallback;
  // Reject anything that could smuggle a scheme (e.g. "/\evil.com").
  if (/^\/+[\\/]/.test(trimmed) || trimmed.includes('\\')) return fallback;

  return trimmed;
}

const POST_AUTH_STORAGE_KEY = 'cp.postAuthRedirect';

/**
 * Persists the intended destination across a full-page OAuth or email
 * confirmation round-trip, where router state cannot survive.
 */
export function storePostAuthRedirect(from) {
  try {
    sessionStorage.setItem(POST_AUTH_STORAGE_KEY, resolvePostAuthRedirect(from));
  } catch {
    // Storage unavailable (private mode etc.) — the callback falls back to /dashboard.
  }
}

/** Reads and clears the stored destination, always returning a safe path. */
export function consumePostAuthRedirect() {
  try {
    const stored = sessionStorage.getItem(POST_AUTH_STORAGE_KEY);
    sessionStorage.removeItem(POST_AUTH_STORAGE_KEY);
    return resolvePostAuthRedirect(stored);
  } catch {
    return '/dashboard';
  }
}