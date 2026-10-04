// backend/src/__tests__/middleware/auth.test.js
import { describe, it, mock, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

// ─── Minimal ApiError  ────────────────────────────────────
class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.statusCode = status;
  }
}



function buildVerifyToken(adminAuth) {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ApiError(401, 'No token provided');
      }

      const token = authHeader.split('Bearer ')[1];

      try {
        const decodedToken = await adminAuth.verifyIdToken(token);

        req.user = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          name: decodedToken.name || decodedToken.email?.split('@')[0],
          picture: decodedToken.picture || null,
          emailVerified: decodedToken.email_verified,
        };

        next();
      } catch (firebaseError) {
        if (firebaseError?.code === 'app/no-app') {
          throw new ApiError(500, 'Firebase Admin not configured');
        }
        throw new ApiError(401, 'Invalid or expired token');
      }
    } catch (error) {
      next(error);
    }
  };
}

function buildAdminOnly() {
  return (req, res, next) => {
    const adminEmails = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean);

    if (!req.user || !adminEmails.includes(req.user.email)) {
      return next(new ApiError(403, 'Admin access required'));
    }
    next();
  };
}

function buildOptionalAuth(adminAuth) {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        req.user = null;
        return next();
      }

      const token = authHeader.split('Bearer ')[1];

      try {
        const decodedToken = await adminAuth.verifyIdToken(token);

        req.user = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          name: decodedToken.name || decodedToken.email?.split('@')[0],
          picture: decodedToken.picture || null,
          emailVerified: decodedToken.email_verified,
        };

        next();
      } catch (error) {
        if (error?.code === 'app/no-app') {
          throw new ApiError(500, 'Firebase Admin not configured');
        }
        req.user = null;
        next();
      }
    } catch (error) {
      next(error);
    }
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function makeRes() {
  return {
    status: mock.fn(function () { return this; }),
    json:   mock.fn(function () { return this; }),
  };
}

function makeMockAuth(impl) {
  return { verifyIdToken: mock.fn(impl) };
}


// verifyToken
describe('verifyToken', () => {

  it('calls next() and sets req.user for a valid token', async () => {
    const adminAuth = makeMockAuth(async () => ({
      uid: 'uid123', email: 'user@example.com',
      name: 'Test User', picture: 'https://pic.url', email_verified: true,
    }));

    const req  = { headers: { authorization: 'Bearer valid_token' } };
    const next = mock.fn();

    await buildVerifyToken(adminAuth)(req, makeRes(), next);

    assert.equal(next.mock.calls.length, 1);
    assert.equal(next.mock.calls[0].arguments[0], undefined);
    assert.deepEqual(req.user, {
      uid: 'uid123', email: 'user@example.com',
      name: 'Test User', picture: 'https://pic.url', emailVerified: true,
    });
  });

  it('derives name from email prefix when name is absent', async () => {
    const adminAuth = makeMockAuth(async () => ({
      uid: 'uid2', email: 'hello@domain.com',
      name: undefined, picture: undefined, email_verified: false,
    }));

    const req  = { headers: { authorization: 'Bearer token' } };
    const next = mock.fn();

    await buildVerifyToken(adminAuth)(req, makeRes(), next);

    assert.equal(req.user.name, 'hello');
    assert.equal(req.user.picture, null);
  });

  it('passes ApiError(401) when Authorization header is absent', async () => {
    const adminAuth = makeMockAuth();
    const req  = { headers: {} };
    const next = mock.fn();

    await buildVerifyToken(adminAuth)(req, makeRes(), next);

    const err = next.mock.calls[0].arguments[0];
    assert.equal(err.status, 401);
    assert.equal(err.message, 'No token provided');
  });

  it('passes ApiError(401) when Bearer prefix is missing', async () => {
    const adminAuth = makeMockAuth();
    const req  = { headers: { authorization: 'Token abc123' } };
    const next = mock.fn();

    await buildVerifyToken(adminAuth)(req, makeRes(), next);

    assert.equal(next.mock.calls[0].arguments[0].status, 401);
  });

  it('passes ApiError(401) when header is an empty string', async () => {
    const adminAuth = makeMockAuth();
    const req  = { headers: { authorization: '' } };
    const next = mock.fn();

    await buildVerifyToken(adminAuth)(req, makeRes(), next);

    assert.equal(next.mock.calls[0].arguments[0].status, 401);
  });

  it('passes ApiError(401) for an invalid or expired token', async () => {
    const adminAuth = makeMockAuth(async () => {
      throw Object.assign(new Error('Token expired'), { code: 'auth/id-token-expired' });
    });

    const req  = { headers: { authorization: 'Bearer bad_token' } };
    const next = mock.fn();

    await buildVerifyToken(adminAuth)(req, makeRes(), next);

    const err = next.mock.calls[0].arguments[0];
    assert.equal(err.status, 401);
    assert.equal(err.message, 'Invalid or expired token');
  });

  it('passes ApiError(500) when Firebase Admin is not configured', async () => {
    const adminAuth = makeMockAuth(async () => {
      throw Object.assign(new Error('No app'), { code: 'app/no-app' });
    });

    const req  = { headers: { authorization: 'Bearer any_token' } };
    const next = mock.fn();

    await buildVerifyToken(adminAuth)(req, makeRes(), next);

    const err = next.mock.calls[0].arguments[0];
    assert.equal(err.status, 500);
    assert.equal(err.message, 'Firebase Admin not configured');
  });
});


// adminOnly
describe('adminOnly', () => {

  it('calls next() without error for a recognised admin email', () => {
    process.env.ADMIN_EMAILS = 'admin@example.com, super@example.com';

    const req  = { user: { email: 'admin@example.com' } };
    const next = mock.fn();

    buildAdminOnly()(req, makeRes(), next);

    assert.equal(next.mock.calls.length, 1);
    assert.equal(next.mock.calls[0].arguments[0], undefined);
  });

  it('passes ApiError(403) for a non-admin user', () => {
    process.env.ADMIN_EMAILS = 'admin@example.com';

    const req  = { user: { email: 'regular@example.com' } };
    const next = mock.fn();

    buildAdminOnly()(req, makeRes(), next);

    const err = next.mock.calls[0].arguments[0];
    assert.equal(err.status, 403);
    assert.equal(err.message, 'Admin access required');
  });

  it('passes ApiError(403) when req.user is null', () => {
    process.env.ADMIN_EMAILS = 'admin@example.com';

    const req  = { user: null };
    const next = mock.fn();

    buildAdminOnly()(req, makeRes(), next);

    assert.equal(next.mock.calls[0].arguments[0].status, 403);
  });

  it('passes ApiError(403) when ADMIN_EMAILS env var is not set', () => {
    delete process.env.ADMIN_EMAILS;

    const req  = { user: { email: 'anyone@example.com' } };
    const next = mock.fn();

    buildAdminOnly()(req, makeRes(), next);

    assert.equal(next.mock.calls[0].arguments[0].status, 403);
  });

  it('handles extra whitespace around emails in ADMIN_EMAILS', () => {
    process.env.ADMIN_EMAILS = '  admin@example.com  ,  other@example.com  ';

    const req  = { user: { email: 'admin@example.com' } };
    const next = mock.fn();

    buildAdminOnly()(req, makeRes(), next);

    assert.equal(next.mock.calls[0].arguments[0], undefined);
  });
});


// optionalAuth
describe('optionalAuth', () => {

  it('sets req.user and calls next() for a valid token', async () => {
    const adminAuth = makeMockAuth(async () => ({
      uid: 'optUid', email: 'opt@example.com',
      name: 'Opt User', picture: null, email_verified: true,
    }));

    const req  = { headers: { authorization: 'Bearer good_token' } };
    const next = mock.fn();

    await buildOptionalAuth(adminAuth)(req, makeRes(), next);

    assert.equal(next.mock.calls.length, 1);
    assert.equal(req.user.uid, 'optUid');
  });

  it('sets req.user to null and calls next() when no Authorization header', async () => {
    const adminAuth = makeMockAuth();
    const req  = { headers: {} };
    const next = mock.fn();

    await buildOptionalAuth(adminAuth)(req, makeRes(), next);

    assert.equal(req.user, null);
    assert.equal(next.mock.calls[0].arguments[0], undefined);
  });

  it('sets req.user to null when Bearer prefix is missing', async () => {
    const adminAuth = makeMockAuth();
    const req  = { headers: { authorization: 'Basic sometoken' } };
    const next = mock.fn();

    await buildOptionalAuth(adminAuth)(req, makeRes(), next);

    assert.equal(req.user, null);
    assert.equal(next.mock.calls.length, 1);
  });

  it('sets req.user to null for invalid token (graceful degradation)', async () => {
    const adminAuth = makeMockAuth(async () => {
      throw Object.assign(new Error('bad'), { code: 'auth/invalid-id-token' });
    });

    const req  = { headers: { authorization: 'Bearer invalid_token' } };
    const next = mock.fn();

    await buildOptionalAuth(adminAuth)(req, makeRes(), next);

    assert.equal(req.user, null);
    assert.equal(next.mock.calls[0].arguments[0], undefined);
  });

  it('passes ApiError(500) when Firebase Admin is not configured', async () => {
    const adminAuth = makeMockAuth(async () => {
      throw Object.assign(new Error('no app'), { code: 'app/no-app' });
    });

    const req  = { headers: { authorization: 'Bearer any_token' } };
    const next = mock.fn();

    await buildOptionalAuth(adminAuth)(req, makeRes(), next);

    const err = next.mock.calls[0].arguments[0];
    assert.equal(err.status, 500);
    assert.equal(err.message, 'Firebase Admin not configured');
  });
});