import { describe, test, before, after } from 'node:test';
import assert from 'node:assert/strict';

describe('auth middleware plugin architecture', () => {
  let authModule;

  before(async () => {
    process.env.CLERK_SECRET_KEY = 'test-clerk-secret';
    process.env.ADMIN_EMAILS = 'admin@example.com';
    authModule = await import('../auth.js');
  });

  after(() => {
    delete process.env.CLERK_SECRET_KEY;
    delete process.env.ADMIN_EMAILS;
  });

  test('verifyToken is an array of 3 middleware functions', () => {
    assert.ok(Array.isArray(authModule.verifyToken));
    assert.equal(authModule.verifyToken.length, 3);
    authModule.verifyToken.forEach((mw) => assert.equal(typeof mw, 'function'));
  });

  test('optionalAuth is an array of 2 middleware functions', () => {
    assert.ok(Array.isArray(authModule.optionalAuth));
    assert.equal(authModule.optionalAuth.length, 2);
  });

  test('adminOnly is a function', () => {
    assert.equal(typeof authModule.adminOnly, 'function');
    assert.equal(authModule.adminOnly.length, 3);
  });
});

describe('adminOnly middleware', () => {
  let adminOnly;
  const ORIG_ADMIN_EMAILS = process.env.ADMIN_EMAILS;

  before(async () => {
    process.env.ADMIN_EMAILS = 'admin@example.com';
    const mod = await import('../auth.js');
    adminOnly = mod.adminOnly;
  });

  after(() => {
    process.env.ADMIN_EMAILS = ORIG_ADMIN_EMAILS;
  });

  function mockReqRes(user = null) {
    const state = { statusCode: 200, body: null };
    const req = { user };
    const res = {
      status(code) { state.statusCode = code; return this; },
      json(body) { state.body = body; return this; },
    };
    return { req, res, state };
  }

  test('rejects non-admin users with 403 via next(err)', () => {
    const { req, res, state } = mockReqRes({ email: 'user@example.com' });
    let passedError = null;
    adminOnly(req, res, (err) => { passedError = err; });
    assert.ok(passedError instanceof Error);
    assert.equal(passedError.statusCode, 403);
    assert.match(passedError.message, /admin access required/i);
  });

  test('allows admin users through via next()', () => {
    const { req, res, state } = mockReqRes({ email: 'admin@example.com' });
    let nextCalled = false;
    adminOnly(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, true);
  });

  test('rejects when no user on request via next(err)', () => {
    const { req, res, state } = mockReqRes(null);
    let passedError = null;
    adminOnly(req, res, (err) => { passedError = err; });
    assert.ok(passedError instanceof Error);
    assert.equal(passedError.statusCode, 403);
    assert.match(passedError.message, /admin access required/i);
  });
});
