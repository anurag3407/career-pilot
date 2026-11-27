// =============================================================================
// Cloudflare D1 Client for the Express Backend
// =============================================================================
// Connects the optional Express backend to the same Cloudflare D1 database and
// Worker Gateway auth used by the frontend.
// =============================================================================

import crypto from 'crypto';

const GATEWAY_URL = (
  process.env.CLOUDFLARE_D1_GATEWAY_URL ||
  process.env.AI_GATEWAY_URL ||
  ''
).replace(/\/$/, '');

const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '';
const CF_D1_DB_ID = process.env.CLOUDFLARE_D1_DATABASE_ID || '';
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';

export const isD1GatewayConfigured = Boolean(GATEWAY_URL);
export const isD1RestConfigured = Boolean(CF_ACCOUNT_ID && CF_D1_DB_ID && CF_API_TOKEN);
export const isD1Configured = isD1GatewayConfigured || isD1RestConfigured;

/**
 * Verifies a D1 HS256 JWT locally if AUTH_SECRET is set, or via the Worker
 * gateway `/v1/auth/verify` endpoint.
 */
export async function verifyD1Token(token) {
  if (!token) return null;

  const secret = process.env.AUTH_SECRET || process.env.JWT_SECRET;
  if (secret) {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const [h, p, s] = parts;
        const expectedSig = crypto
          .createHmac('sha256', secret)
          .update(`${h}.${p}`)
          .digest('base64url');
        const a = Buffer.from(expectedSig);
        const b = Buffer.from(s);
        if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
          const payload = JSON.parse(Buffer.from(p, 'base64url').toString('utf8'));
          const now = Math.floor(Date.now() / 1000);
          if (!payload.exp || payload.exp >= now) {
            return {
              id: payload.sub,
              uid: payload.sub,
              email: payload.email,
              name: payload.email?.split('@')[0] || 'User',
              emailVerified: true,
            };
          }
        }
      }
    } catch {
      // fall through to gateway check
    }
  }

  if (GATEWAY_URL) {
    try {
      const res = await fetch(`${GATEWAY_URL}/auth/verify`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.user) return data.user;
      }
    } catch {
      // ignore network error
    }
  }

  return null;
}

/**
 * Executes a parameterized SQL query against Cloudflare D1 REST API.
 */
export async function queryD1(sql, params = []) {
  if (!isD1RestConfigured) {
    throw new Error('Cloudflare D1 REST credentials are not configured');
  }

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/d1/database/${CF_D1_DB_ID}/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
    }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    const msg = data?.errors?.[0]?.message || `D1 query failed (${res.status})`;
    throw new Error(msg);
  }
  const firstResult = Array.isArray(data.result) ? data.result[0] : data.result;
  return firstResult?.results || [];
}

/**
 * Calls an authenticated D1 Gateway endpoint on behalf of a user.
 */
export async function gatewayRequest(path, { method = 'GET', body, token, userId } = {}) {
  if (!GATEWAY_URL) {
    throw new Error('CLOUDFLARE_D1_GATEWAY_URL is not configured');
  }
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (process.env.GATEWAY_SERVICE_SECRET && userId) {
    headers['X-Gateway-Secret'] = process.env.GATEWAY_SERVICE_SECRET;
    headers['X-User-Id'] = userId;
  }
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${GATEWAY_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.error || `Gateway error (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export default {
  isD1Configured,
  isD1GatewayConfigured,
  isD1RestConfigured,
  verifyD1Token,
  queryD1,
  gatewayRequest,
};
