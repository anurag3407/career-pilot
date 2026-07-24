import { describe, test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { csrfProtection } from '../csrfProtection.js';

function mockReq({ method = 'GET', cookies = {}, headers = {} } = {}) {
  return { method, cookies, headers };
}

function mockRes() {
  const state = { statusCode: 200, body: null, cookieValues: [] };
  const res = {
    status(code) { state.statusCode = code; return this; },
    json(body) { state.body = body; return this; },
    cookie(name, value, opts) { state.cookieValues.push({ name, value, opts }); },
  };
  return { res, state };
}

describe('csrfProtection — safe methods (GET, HEAD, OPTIONS)', () => {
  test('GET without token sets a new CSRF cookie', () => {
    const req = mockReq({ method: 'GET' });
    const { res, state } = mockRes();
    let nextCalled = false;
    csrfProtection(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, true);
    assert.equal(state.cookieValues.length, 1);
    assert.equal(state.cookieValues[0].name, 'csrf-token');
    assert.equal(state.cookieValues[0].opts.httpOnly, false);
    assert.equal(state.cookieValues[0].opts.sameSite, 'strict');
  });

  test('GET with existing token does NOT overwrite it', () => {
    const req = mockReq({ method: 'GET', cookies: { 'csrf-token': 'existing-token-123' } });
    const { res, state } = mockRes();
    let nextCalled = false;
    csrfProtection(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, true);
    assert.equal(state.cookieValues.length, 0);
  });

  test('HEAD requests are treated as safe', () => {
    const req = mockReq({ method: 'HEAD' });
    const { res } = mockRes();
    let nextCalled = false;
    csrfProtection(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, true);
  });

  test('OPTIONS requests are treated as safe', () => {
    const req = mockReq({ method: 'OPTIONS' });
    const { res } = mockRes();
    let nextCalled = false;
    csrfProtection(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, true);
  });

  test('secure flag set only in production', () => {
    const origEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const req = mockReq({ method: 'GET' });
    const { res, state } = mockRes();
    csrfProtection(req, res, () => {});
    assert.equal(state.cookieValues[0].opts.secure, true);
    process.env.NODE_ENV = 'development';
    const req2 = mockReq({ method: 'GET' });
    const { res: res2, state: state2 } = mockRes();
    csrfProtection(req2, res2, () => {});
    assert.equal(state2.cookieValues[0].opts.secure, false);
    process.env.NODE_ENV = origEnv;
  });
});

describe('csrfProtection — unsafe methods (POST, PUT, DELETE, PATCH)', () => {
  test('missing cookie returns 403', () => {
    const req = mockReq({ method: 'POST', headers: { 'x-csrf-token': 'abc' } });
    const { res, state } = mockRes();
    let nextCalled = false;
    csrfProtection(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, false);
    assert.equal(state.statusCode, 403);
    assert.match(state.body.message, /missing.*csrf/i);
  });

  test('missing header returns 403', () => {
    const req = mockReq({ method: 'POST', cookies: { 'csrf-token': 'abc' } });
    const { res, state } = mockRes();
    csrfProtection(req, res, () => {});
    assert.equal(state.statusCode, 403);
    assert.match(state.body.message, /missing.*csrf/i);
  });

  test('matching tokens call next()', () => {
    const req = mockReq({
      method: 'POST',
      cookies: { 'csrf-token': 'matching-token' },
      headers: { 'x-csrf-token': 'matching-token' },
    });
    const { res } = mockRes();
    let nextCalled = false;
    csrfProtection(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, true);
  });

  test('different content tokens with same length return 403', () => {
    const req = mockReq({
      method: 'POST',
      cookies: { 'csrf-token': '0123456789abcdef0123456789abcdef' },
      headers: { 'x-csrf-token': 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
    });
    const { res, state } = mockRes();
    let nextCalled = false;
    csrfProtection(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, false);
    assert.equal(state.statusCode, 403);
    assert.match(state.body.message, /invalid.*csrf/i);
  });
});
