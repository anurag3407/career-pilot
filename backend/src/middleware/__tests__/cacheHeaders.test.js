import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import cacheHeaders from '../cacheHeaders.js';

function mockReqRes({ method = 'GET', headers = {} } = {}) {
  const state = { statusCode: 200, body: null, removedHeaders: [], headers: {} };
  const req = { method, headers };
  const res = {
    set(key, value) { state.headers[key] = value; return this; },
    getHeader(key) { return state.headers[key]; },
    removeHeader(key) { state.removedHeaders.push(key); },
    status(code) { state.statusCode = code; return this; },
    send(body) { state.body = body; return this; },
  };
  return { req, res, state };
}

describe('cacheHeaders middleware', () => {
  test('skips caching for non-GET/non-HEAD methods', () => {
    const { req, res, state } = mockReqRes({ method: 'POST' });
    let nextCalled = false;
    cacheHeaders()(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, true);
    assert.equal(state.headers['Cache-Control'], undefined);
  });

  test('sets private no-store cache for authenticated requests', () => {
    const { req, res, state } = mockReqRes({ headers: { authorization: 'Bearer token123' } });
    let nextCalled = false;
    cacheHeaders()(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, true);
    assert.match(state.headers['Cache-Control'], /private/);
    assert.match(state.headers['Cache-Control'], /no-store/);
  });

  test('sets public cache-control with max-age when configured', () => {
    const { req, res, state } = mockReqRes();
    let nextCalled = false;
    cacheHeaders({ maxAge: 300, isPublic: true })(req, res, () => { nextCalled = true; });
    assert.equal(nextCalled, true);
    assert.match(state.headers['Cache-Control'], /public/);
    assert.match(state.headers['Cache-Control'], /max-age=300/);
  });

  test('sets private cache-control when isPublic is false', () => {
    const { req, res, state } = mockReqRes();
    cacheHeaders({ maxAge: 60, isPublic: false })(req, res, () => {});
    assert.match(state.headers['Cache-Control'], /private/);
    assert.match(state.headers['Cache-Control'], /max-age=60/);
  });

  test('sets Vary header by default', () => {
    const { req, res, state } = mockReqRes();
    cacheHeaders()(req, res, () => {});
    assert.ok(state.headers['Vary']);
    assert.match(state.headers['Vary'], /Accept-Encoding/);
  });

  test('includes Authorization in Vary when auth header present', () => {
    const { req, res, state } = mockReqRes({ headers: { authorization: 'Bearer x' } });
    cacheHeaders()(req, res, () => {});
    assert.ok(state.headers['Vary']);
    assert.match(state.headers['Vary'], /Authorization/);
  });

  test('ETag is a valid weak ETag format', () => {
    const { req, res, state } = mockReqRes();
    let capturedETag = null;
    const origSet = res.set.bind(res);
    res.set = (key, value) => {
      if (key === 'ETag') capturedETag = value;
      return origSet(key, value);
    };
    cacheHeaders()(req, res, () => {});
    res.send('test body');
    assert.ok(capturedETag);
    assert.match(capturedETag, /^W\/"/);
  });

  test('sends body when res.send is called after middleware', () => {
    const { req, res, state } = mockReqRes();
    cacheHeaders()(req, res, () => {});
    res.send('{"data":"test"}');
    assert.equal(state.statusCode, 200);
    assert.equal(state.body, '{"data":"test"}');
  });
});
