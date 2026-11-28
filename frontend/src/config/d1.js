// =============================================================================
// Cloudflare D1 Gateway Client & Native Auth
// =============================================================================
// Replaces Supabase client completely. Communicates with the CareerPilot
// Cloudflare Worker gateway (/gateway/v1) backed by Cloudflare D1.
// =============================================================================

const GATEWAY_URL = (import.meta.env.VITE_AI_GATEWAY_URL || '/gateway/v1').replace(/\/$/, '');
const SESSION_STORAGE_KEY = 'careerpilot:d1:session';

export const isD1Configured = import.meta.env.VITE_DISABLE_D1_AUTH !== 'true';

const authListeners = new Set();

function readStoredSession() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.access_token) return null;
    if (parsed.expires_at && new Date(parsed.expires_at).getTime() <= Date.now()) {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeStoredSession(session) {
  if (typeof window === 'undefined') return;
  try {
    if (session && session.access_token) {
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } else {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch {
    // ignore storage errors in restricted contexts
  }
}

function notifyAuthChange(event, session) {
  for (const cb of authListeners) {
    try {
      cb(event, session);
    } catch (err) {
      console.warn('Auth listener error:', err);
    }
  }
}

export async function getD1AccessToken() {
  const session = readStoredSession();
  return session?.access_token || null;
}

export async function d1Fetch(path, { method = 'GET', body, headers = {}, requireAuth = false, signal } = {}) {
  const token = await getD1AccessToken();
  if (requireAuth && !token) {
    const err = new Error('Not authenticated');
    err.status = 401;
    throw err;
  }

  const reqHeaders = { ...headers };
  if (token) reqHeaders.Authorization = `Bearer ${token}`;
  if (body !== undefined && !(body instanceof FormData) && !reqHeaders['Content-Type']) {
    reqHeaders['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${GATEWAY_URL}${path}`, {
    method,
    headers: reqHeaders,
    body: body === undefined ? undefined : (body instanceof FormData ? body : JSON.stringify(body)),
    signal,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.error || data?.message || `D1 Gateway error (${res.status})`);
    err.status = res.status;
    err.details = data?.details;
    throw err;
  }
  return data;
}

export const d1Auth = {
  async getSession() {
    const session = readStoredSession();
    return { data: { session }, error: null };
  },

  async getUser() {
    const session = readStoredSession();
    if (!session?.access_token) return { data: { user: null }, error: null };
    try {
      const data = await d1Fetch('/auth/me', { method: 'GET', requireAuth: true });
      const updatedSession = { ...session, user: data.user };
      writeStoredSession(updatedSession);
      return { data: { user: data.user }, error: null };
    } catch (err) {
      if (err.status === 401) {
        writeStoredSession(null);
        notifyAuthChange('SIGNED_OUT', null);
      }
      return { data: { user: null }, error: err };
    }
  },

  async signUp({ email, password, options = {} }) {
    try {
      const data = await d1Fetch('/auth/signup', {
        method: 'POST',
        body: {
          email,
          password,
          metadata: options.data || {},
          fullName: options.data?.full_name || options.data?.name,
        },
      });
      const session = data.session || null;
      if (session) {
        writeStoredSession(session);
        notifyAuthChange('SIGNED_IN', session);
      }
      return { data: { user: data.user || session?.user || null, session }, error: null };
    } catch (err) {
      return { data: { user: null, session: null }, error: err };
    }
  },

  async signInWithPassword({ email, password }) {
    try {
      const data = await d1Fetch('/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      const session = data.session || null;
      if (session) {
        writeStoredSession(session);
        notifyAuthChange('SIGNED_IN', session);
      }
      return { data: { user: data.user || session?.user || null, session }, error: null };
    } catch (err) {
      return { data: { user: null, session: null }, error: err };
    }
  },

  async signInWithOAuth({ provider, options = {} }) {
    try {
      const providers = await d1Fetch('/auth/providers', { method: 'GET' }).catch(() => ({}));
      const normalized = provider === 'linkedin_oidc' ? 'linkedin' : provider;
      if (!providers?.[normalized]) {
        const err = new Error(`${normalized} OAuth is not configured on the gateway. Please sign in with email and password.`);
        return { data: null, error: err };
      }
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const redirectTo = options.redirectTo || '/dashboard';
      const target = `${GATEWAY_URL}/auth/oauth/${normalized}?origin=${encodeURIComponent(origin)}&redirect_to=${encodeURIComponent(redirectTo)}`;
      if (typeof window !== 'undefined') {
        window.location.assign(target);
      }
      return { data: { url: target }, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  async setSessionFromToken(accessToken) {
    if (!accessToken) return { data: { session: null }, error: new Error('Missing access token') };
    const tempSession = { access_token: accessToken };
    writeStoredSession(tempSession);
    try {
      const data = await d1Fetch('/auth/me', { method: 'GET', requireAuth: true });
      const fullSession = {
        access_token: accessToken,
        token_type: 'bearer',
        user: data.user,
      };
      writeStoredSession(fullSession);
      notifyAuthChange('SIGNED_IN', fullSession);
      return { data: { session: fullSession }, error: null };
    } catch (err) {
      writeStoredSession(null);
      return { data: { session: null }, error: err };
    }
  },

  async signOut() {
    try {
      await d1Fetch('/auth/logout', { method: 'POST' }).catch(() => {});
    } finally {
      writeStoredSession(null);
      notifyAuthChange('SIGNED_OUT', null);
    }
    return { error: null };
  },

  onAuthStateChange(callback) {
    authListeners.add(callback);
    const current = readStoredSession();
    Promise.resolve().then(() => callback('INITIAL_SESSION', current));
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            authListeners.delete(callback);
          },
        },
      },
    };
  },
};

export default {
  auth: d1Auth,
  fetch: d1Fetch,
  getAccessToken: getD1AccessToken,
  isConfigured: isD1Configured,
};
