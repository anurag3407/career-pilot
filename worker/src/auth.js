// =============================================================================
// CareerPilot Native Auth — Cloudflare Worker + D1
// =============================================================================
// Replaces Supabase Auth completely using Web Crypto (PBKDF2-SHA256 + HS256 JWT)
// backed by Cloudflare D1 (`users`, `profiles`, `auth_sessions`, `oauth_states`).
// =============================================================================

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days
const PBKDF2_ITERATIONS = 100_000;

function toBase64Url(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(str) {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((str.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function bytesToHex(bytes) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i += 1) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const derived = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  return `pbkdf2$${PBKDF2_ITERATIONS}$${bytesToHex(salt)}$${bytesToHex(new Uint8Array(derived))}`;
}

export async function verifyPassword(password, storedHash) {
  if (!storedHash || typeof storedHash !== 'string') return false;
  const parts = storedHash.split('$');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false;
  const iterations = parseInt(parts[1], 10);
  const saltHex = parts[2];
  const expectedHex = parts[3];
  if (!iterations || !saltHex || !expectedHex) return false;

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const derived = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: hexToBytes(saltHex), iterations, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  return timingSafeEqual(bytesToHex(new Uint8Array(derived)), expectedHex);
}

function getSigningSecret(env) {
  return (
    env.AUTH_SECRET ||
    env.JWT_SECRET ||
    env.CLOUDFLARE_API_TOKEN ||
    'careerpilot-local-dev-secret-do-not-use-in-prod'
  );
}

async function importHmacKey(secret, usage) {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    [usage]
  );
}

export async function signJwt(payload, env, ttlSeconds = TOKEN_TTL_SECONDS) {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + ttlSeconds,
  };
  const headerB64 = toBase64Url(encoder.encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const payloadB64 = toBase64Url(encoder.encode(JSON.stringify(fullPayload)));
  const signingInput = `${headerB64}.${payloadB64}`;

  const key = await importHmacKey(getSigningSecret(env), 'sign');
  const sigBuf = await crypto.subtle.sign('HMAC', key, encoder.encode(signingInput));
  const sigB64 = toBase64Url(new Uint8Array(sigBuf));
  return { token: `${signingInput}.${sigB64}`, expiresAt: new Date(fullPayload.exp * 1000).toISOString() };
}

export async function verifyJwt(token, env) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [headerB64, payloadB64, sigB64] = parts;
  const signingInput = `${headerB64}.${payloadB64}`;
  try {
    const key = await importHmacKey(getSigningSecret(env), 'verify');
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      fromBase64Url(sigB64),
      encoder.encode(signingInput)
    );
    if (!valid) return null;
    const payload = JSON.parse(decoder.decode(fromBase64Url(payloadB64)));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;
    return payload;
  } catch {
    return null;
  }
}

function getAdminEmails(env) {
  return (env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function safeJsonParse(raw, fallback) {
  if (raw === null || raw === undefined || raw === '') return fallback;
  if (typeof raw === 'object') return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function formatProfile(row, userRow = null, env = {}) {
  if (!row && !userRow) return null;
  const doc = safeJsonParse(row?.data, {});
  const email = row?.email || userRow?.email || '';
  const isAdmin = Boolean(
    row?.is_admin ||
      userRow?.is_admin ||
      getAdminEmails(env).includes(email.toLowerCase())
  );
  const id = row?.id || userRow?.id;
  return {
    ...doc,
    uid: id,
    id,
    email,
    displayName:
      row?.full_name ||
      doc.displayName ||
      row?.username ||
      userRow?.name ||
      email.split('@')[0] ||
      'User',
    username: row?.username || userRow?.username || email.split('@')[0] || 'user',
    photoURL: row?.avatar_url || doc.photoURL || userRow?.avatar_url || null,
    avatarUrl: row?.avatar_url || doc.avatarUrl || userRow?.avatar_url || null,
    jobRole: row?.job_role || doc.jobRole || '',
    yearsOfExperience: row?.years_of_experience ?? doc.yearsOfExperience ?? 0,
    skills: safeJsonParse(row?.skills, doc.skills || []),
    bio: row?.bio ?? doc.bio ?? '',
    headline: row?.headline || doc.headline || '',
    location: row?.location || doc.location || '',
    website: row?.website || doc.website || '',
    github: doc.github || row?.github_username || '',
    linkedin: doc.linkedin || row?.linkedin_url || '',
    preferences: safeJsonParse(row?.preferences, {
      jobAlerts: true,
      directMessages: true,
      proposalUpdates: true,
    }),
    isAdmin,
    plan: row?.plan || 'free',
    isPro: Boolean(row?.is_pro || row?.plan === 'pro'),
    createdAt: row?.created_at || userRow?.created_at,
    updatedAt: row?.updated_at || userRow?.updated_at,
  };
}

export async function ensureUserProfile(env, userRow, meta = {}) {
  const existing = await env.DB.prepare(`SELECT * FROM profiles WHERE id = ?`)
    .bind(userRow.id)
    .first();
  if (existing) return existing;

  const email = (userRow.email || '').toLowerCase();
  const username = meta.username || userRow.username || email.split('@')[0] || 'user';
  const fullName = meta.full_name || meta.fullName || meta.name || userRow.name || username;
  const avatarUrl = meta.avatar_url || meta.avatarUrl || userRow.avatar_url || null;
  const isAdmin = getAdminEmails(env).includes(email) ? 1 : 0;

  await env.DB.prepare(
    `INSERT INTO profiles (id, username, email, full_name, avatar_url, is_admin)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       email = excluded.email,
       updated_at = datetime('now')`
  )
    .bind(userRow.id, username, email, fullName, avatarUrl, isAdmin)
    .run();

  return env.DB.prepare(`SELECT * FROM profiles WHERE id = ?`).bind(userRow.id).first();
}

async function createSessionForUser(env, userRow, profileRow) {
  const jti = crypto.randomUUID();
  const { token, expiresAt } = await signJwt(
    {
      sub: userRow.id,
      email: userRow.email,
      jti,
    },
    env
  );

  await env.DB.prepare(
    `INSERT INTO auth_sessions (id, user_id, token_jti, expires_at, revoked)
     VALUES (?, ?, ?, ?, 0)`
  )
    .bind(crypto.randomUUID(), userRow.id, jti, expiresAt)
    .run();

  const profile = formatProfile(profileRow, userRow, env);
  const user = {
    uid: profile.uid,
    id: profile.id,
    email: profile.email,
    displayName: profile.displayName,
    name: profile.displayName,
    username: profile.username,
    photoURL: profile.photoURL,
    avatarUrl: profile.avatarUrl,
    isAdmin: profile.isAdmin,
    plan: profile.plan,
    emailVerified: Boolean(userRow.email_verified ?? 1),
  };

  return {
    user,
    profile,
    session: {
      access_token: token,
      token_type: 'bearer',
      expires_at: expiresAt,
      user,
    },
  };
}

export async function authenticateRequest(request, env) {
  if (!env.DB) return null;

  // Service-to-service trusted call (e.g. self-hosted Express backend with shared secret)
  const serviceSecret = request.headers.get('X-Gateway-Secret');
  const serviceUserId = request.headers.get('X-User-Id');
  if (
    env.GATEWAY_SERVICE_SECRET &&
    serviceSecret &&
    timingSafeEqual(serviceSecret, env.GATEWAY_SERVICE_SECRET) &&
    serviceUserId
  ) {
    const userRow = await env.DB.prepare(`SELECT * FROM users WHERE id = ?`).bind(serviceUserId).first();
    const profileRow = await env.DB.prepare(`SELECT * FROM profiles WHERE id = ?`).bind(serviceUserId).first();
    if (userRow || profileRow) {
      const profile = formatProfile(profileRow, userRow, env);
      return {
        token: null,
        jti: null,
        user: {
          uid: profile.uid,
          id: profile.id,
          email: profile.email,
          displayName: profile.displayName,
          name: profile.displayName,
          photoURL: profile.photoURL,
          isAdmin: profile.isAdmin,
          plan: profile.plan,
        },
        profile,
      };
    }
  }

  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;

  const claims = await verifyJwt(token, env);
  if (!claims?.sub) return null;

  if (claims.jti) {
    const session = await env.DB.prepare(
      `SELECT revoked, expires_at FROM auth_sessions WHERE token_jti = ?`
    )
      .bind(claims.jti)
      .first();
    if (session && session.revoked) return null;
  }

  const userRow = await env.DB.prepare(`SELECT * FROM users WHERE id = ?`).bind(claims.sub).first();
  if (!userRow) return null;

  const profileRow = await ensureUserProfile(env, userRow);
  const profile = formatProfile(profileRow, userRow, env);
  return {
    token,
    jti: claims.jti || null,
    user: {
      uid: profile.uid,
      id: profile.id,
      email: profile.email,
      displayName: profile.displayName,
      name: profile.displayName,
      username: profile.username,
      photoURL: profile.photoURL,
      avatarUrl: profile.avatarUrl,
      isAdmin: profile.isAdmin,
      plan: profile.plan,
      emailVerified: Boolean(userRow.email_verified ?? 1),
    },
    profile,
  };
}

// ---------------------------------------------------------------------------
// Auth Route Handlers
// ---------------------------------------------------------------------------
export async function handleAuthRoutes(request, env, url, path) {
  if (!env.DB) {
    return { data: { error: 'Cloudflare D1 database is not bound' }, status: 503 };
  }

  const method = request.method;

  // POST /v1/auth/signup or /v1/auth/register
  if (method === 'POST' && (path === '/v1/auth/signup' || path === '/v1/auth/register')) {
    const body = await request.json().catch(() => ({}));
    const rawEmail = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');

    if (!rawEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)) {
      return { data: { error: 'Please provide a valid email address.' }, status: 400 };
    }
    if (password.length < 6) {
      return { data: { error: 'Password must be at least 6 characters.' }, status: 400 };
    }

    const existing = await env.DB.prepare(`SELECT id FROM users WHERE email = ?`).bind(rawEmail).first();
    if (existing) {
      return { data: { error: 'An account with this email already exists.' }, status: 409 };
    }

    const meta = body.metadata || body.data || {};
    const fullName = String(
      body.fullName || body.full_name || body.name || meta.full_name || meta.name || rawEmail.split('@')[0]
    ).trim();
    const username = String(
      body.username || meta.username || rawEmail.split('@')[0]
    ).trim();
    const isAdmin = getAdminEmails(env).includes(rawEmail) ? 1 : 0;
    const id = crypto.randomUUID();
    const passwordHash = await hashPassword(password);

    await env.DB.prepare(
      `INSERT INTO users (id, email, name, username, password_hash, is_admin, email_verified, auth_provider, last_login_at)
       VALUES (?, ?, ?, ?, ?, ?, 1, 'email', datetime('now'))`
    )
      .bind(id, rawEmail, fullName, username, passwordHash, isAdmin)
      .run();

    const userRow = await env.DB.prepare(`SELECT * FROM users WHERE id = ?`).bind(id).first();
    const profileRow = await ensureUserProfile(env, userRow, { fullName, username });
    const authPayload = await createSessionForUser(env, userRow, profileRow);

    return {
      data: {
        success: true,
        ...authPayload,
      },
      status: 201,
    };
  }

  // POST /v1/auth/login
  if (method === 'POST' && path === '/v1/auth/login') {
    const body = await request.json().catch(() => ({}));
    const rawEmail = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');

    if (!rawEmail || !password) {
      return { data: { error: 'Email and password are required.' }, status: 400 };
    }

    const userRow = await env.DB.prepare(`SELECT * FROM users WHERE email = ?`).bind(rawEmail).first();
    if (!userRow || !userRow.password_hash) {
      return { data: { error: 'Invalid email or password.' }, status: 401 };
    }

    const valid = await verifyPassword(password, userRow.password_hash);
    if (!valid) {
      return { data: { error: 'Invalid email or password.' }, status: 401 };
    }

    await env.DB.prepare(`UPDATE users SET last_login_at = datetime('now'), updated_at = datetime('now') WHERE id = ?`)
      .bind(userRow.id)
      .run();

    const profileRow = await ensureUserProfile(env, userRow);
    const authPayload = await createSessionForUser(env, userRow, profileRow);

    return {
      data: {
        success: true,
        ...authPayload,
      },
      status: 200,
    };
  }

  // POST /v1/auth/logout
  if (method === 'POST' && path === '/v1/auth/logout') {
    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (token) {
      const claims = await verifyJwt(token, env);
      if (claims?.jti) {
        await env.DB.prepare(`UPDATE auth_sessions SET revoked = 1 WHERE token_jti = ?`)
          .bind(claims.jti)
          .run()
          .catch(() => {});
      }
    }
    return { data: { success: true }, status: 200 };
  }

  // GET /v1/auth/me | /v1/auth/session | /v1/auth/user | POST /v1/auth/verify
  if (
    (method === 'GET' && (path === '/v1/auth/me' || path === '/v1/auth/session' || path === '/v1/auth/user')) ||
    (method === 'POST' && path === '/v1/auth/verify')
  ) {
    const auth = await authenticateRequest(request, env);
    if (!auth) {
      return { data: { error: 'Not authenticated' }, status: 401 };
    }
    return {
      data: {
        success: true,
        user: auth.user,
        profile: auth.profile,
        session: {
          access_token: auth.token,
          token_type: 'bearer',
          user: auth.user,
        },
      },
      status: 200,
    };
  }

  // POST /v1/auth/refresh
  if (method === 'POST' && path === '/v1/auth/refresh') {
    const auth = await authenticateRequest(request, env);
    if (!auth) {
      return { data: { error: 'Not authenticated' }, status: 401 };
    }
    if (auth.jti) {
      await env.DB.prepare(`UPDATE auth_sessions SET revoked = 1 WHERE token_jti = ?`)
        .bind(auth.jti)
        .run()
        .catch(() => {});
    }
    const userRow = await env.DB.prepare(`SELECT * FROM users WHERE id = ?`).bind(auth.user.id).first();
    const profileRow = await ensureUserProfile(env, userRow);
    const refreshed = await createSessionForUser(env, userRow, profileRow);
    return { data: { success: true, ...refreshed }, status: 200 };
  }

  // GET /v1/auth/providers
  if (method === 'GET' && path === '/v1/auth/providers') {
    return {
      data: {
        email: true,
        google: Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET),
        github: Boolean(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET),
      },
      status: 200,
    };
  }

  // OAuth start: GET /v1/auth/oauth/:provider
  const oauthStartMatch = path.match(/^\/v1\/auth\/oauth\/(google|github)$/);
  if (method === 'GET' && oauthStartMatch) {
    const provider = oauthStartMatch[1];
    const redirectTo = url.searchParams.get('redirect_to') || '/dashboard';
    const frontendOrigin = url.searchParams.get('origin') || env.FRONTEND_URL || url.origin;
    const state = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    if (provider === 'google') {
      if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
        return { data: { error: 'Google OAuth is not configured on this gateway. Please sign in with email and password.' }, status: 503 };
      }
      await env.DB.prepare(
        `INSERT INTO oauth_states (state, provider, redirect_to, expires_at) VALUES (?, ?, ?, ?)`
      )
        .bind(state, provider, JSON.stringify({ redirectTo, frontendOrigin }), expiresAt)
        .run();

      const callbackUrl = `${url.origin}/gateway/v1/auth/oauth/google/callback`;
      const params = new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID,
        redirect_uri: env.GOOGLE_OAUTH_REDIRECT_URI || callbackUrl,
        response_type: 'code',
        scope: 'openid email profile',
        state,
      });
      return { redirect: `https://accounts.google.com/o/oauth2/v2/auth?${params}` };
    }

    if (provider === 'github') {
      if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
        return { data: { error: 'GitHub OAuth is not configured on this gateway. Please sign in with email and password.' }, status: 503 };
      }
      await env.DB.prepare(
        `INSERT INTO oauth_states (state, provider, redirect_to, expires_at) VALUES (?, ?, ?, ?)`
      )
        .bind(state, provider, JSON.stringify({ redirectTo, frontendOrigin }), expiresAt)
        .run();

      const callbackUrl = `${url.origin}/gateway/v1/auth/oauth/github/callback`;
      const params = new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        redirect_uri: env.GITHUB_OAUTH_REDIRECT_URI || callbackUrl,
        scope: 'read:user user:email',
        state,
      });
      return { redirect: `https://github.com/login/oauth/authorize?${params}` };
    }
  }

  // OAuth callback: GET /v1/auth/oauth/:provider/callback
  const oauthCbMatch = path.match(/^\/v1\/auth\/oauth\/(google|github)\/callback$/);
  if (method === 'GET' && oauthCbMatch) {
    const provider = oauthCbMatch[1];
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const errParam = url.searchParams.get('error');

    const stored = state
      ? await env.DB.prepare(`SELECT * FROM oauth_states WHERE state = ?`).bind(state).first()
      : null;
    if (state) {
      await env.DB.prepare(`DELETE FROM oauth_states WHERE state = ?`).bind(state).run().catch(() => {});
    }

    const meta = safeJsonParse(stored?.redirect_to, { redirectTo: '/dashboard', frontendOrigin: env.FRONTEND_URL || url.origin });
    const frontendOrigin = meta.frontendOrigin || env.FRONTEND_URL || url.origin;

    if (errParam || !code || !stored || new Date(stored.expires_at).getTime() < Date.now()) {
      const msg = encodeURIComponent(errParam || 'OAuth state expired or invalid');
      return { redirect: `${frontendOrigin}/auth/callback#error=${msg}` };
    }

    try {
      let email = '';
      let name = '';
      let avatarUrl = '';
      let providerId = '';

      if (provider === 'google') {
        const callbackUrl = env.GOOGLE_OAUTH_REDIRECT_URI || `${url.origin}/gateway/v1/auth/oauth/google/callback`;
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            code,
            client_id: env.GOOGLE_CLIENT_ID,
            client_secret: env.GOOGLE_CLIENT_SECRET,
            redirect_uri: callbackUrl,
            grant_type: 'authorization_code',
          }),
        });
        const tokenJson = await tokenRes.json();
        const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${tokenJson.access_token}` },
        });
        const profile = await userRes.json();
        email = (profile.email || '').toLowerCase();
        name = profile.name || email.split('@')[0];
        avatarUrl = profile.picture || '';
        providerId = String(profile.id || '');
      } else if (provider === 'github') {
        const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST',
          headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_id: env.GITHUB_CLIENT_ID,
            client_secret: env.GITHUB_CLIENT_SECRET,
            code,
          }),
        });
        const tokenJson = await tokenRes.json();
        const ghHeaders = {
          Authorization: `Bearer ${tokenJson.access_token}`,
          Accept: 'application/vnd.github.v3+json',
          'User-Agent': 'CareerPilot-Gateway',
        };
        const userRes = await fetch('https://api.github.com/user', { headers: ghHeaders });
        const ghUser = await userRes.json();
        email = (ghUser.email || '').toLowerCase();
        if (!email) {
          const emailsRes = await fetch('https://api.github.com/user/emails', { headers: ghHeaders });
          const emails = await emailsRes.json().catch(() => []);
          const primary = Array.isArray(emails) ? emails.find((e) => e.primary && e.verified) || emails[0] : null;
          email = (primary?.email || `${ghUser.login}@users.noreply.github.com`).toLowerCase();
        }
        name = ghUser.name || ghUser.login || email.split('@')[0];
        avatarUrl = ghUser.avatar_url || '';
        providerId = String(ghUser.id || '');
      }

      if (!email) {
        return { redirect: `${frontendOrigin}/auth/callback#error=${encodeURIComponent('Could not read email from OAuth provider')}` };
      }

      let userRow = await env.DB.prepare(`SELECT * FROM users WHERE email = ?`).bind(email).first();
      if (!userRow) {
        const id = crypto.randomUUID();
        const isAdmin = getAdminEmails(env).includes(email) ? 1 : 0;
        await env.DB.prepare(
          `INSERT INTO users (id, email, name, username, avatar_url, is_admin, email_verified, auth_provider, provider_id, last_login_at)
           VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?, datetime('now'))`
        )
          .bind(id, email, name, email.split('@')[0], avatarUrl, isAdmin, provider, providerId)
          .run();
        userRow = await env.DB.prepare(`SELECT * FROM users WHERE id = ?`).bind(id).first();
      } else {
        await env.DB.prepare(
          `UPDATE users SET last_login_at = datetime('now'), avatar_url = COALESCE(NULLIF(avatar_url, ''), ?), updated_at = datetime('now') WHERE id = ?`
        )
          .bind(avatarUrl, userRow.id)
          .run();
      }

      const profileRow = await ensureUserProfile(env, userRow, { fullName: name, avatarUrl });
      const sessionPayload = await createSessionForUser(env, userRow, profileRow);
      return {
        redirect: `${frontendOrigin}/auth/callback#access_token=${encodeURIComponent(sessionPayload.session.access_token)}`,
      };
    } catch (err) {
      return { redirect: `${frontendOrigin}/auth/callback#error=${encodeURIComponent(err.message || 'OAuth failed')}` };
    }
  }

  return null;
}
