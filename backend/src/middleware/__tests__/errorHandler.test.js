import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { ApiError, errorHandler, asyncHandler } from '../errorHandler.js';

function mockRes() {
  const state = { statusCode: 200, body: null, headers: {} };
  const res = {
    status(code) { state.statusCode = code; return this; },
    json(body) { state.body = body; return this; },
    setHeader(k, v) { state.headers[k] = v; },
  };
  return { res, state };
}

describe('ApiError class', () => {
  test('creates an operational error with statusCode and message', () => {
    const err = new ApiError(404, 'Not found');
    assert.equal(err.statusCode, 404);
    assert.equal(err.message, 'Not found');
    assert.equal(err.isOperational, true);
    assert.equal(err.details, null);
  });

  test('accepts optional details', () => {
    const details = { field: 'email', reason: 'already exists' };
    const err = new ApiError(409, 'Conflict', details);
    assert.deepEqual(err.details, details);
  });

  test('captures stack trace', () => {
    const err = new ApiError(500, 'Oops');
    assert.ok(err.stack);
  });
});

describe('errorHandler middleware', () => {
  test('handles LIMIT_FILE_SIZE multer error', () => {
    const { res, state } = mockRes();
    const err = new Error('File too big');
    err.code = 'LIMIT_FILE_SIZE';
    errorHandler(err, {}, res, () => {});
    assert.equal(state.statusCode, 400);
    assert.equal(state.body.success, false);
    assert.match(state.body.error, /5MB/i);
  });

  test('handles LIMIT_UNEXPECTED_FILE multer error', () => {
    const { res, state } = mockRes();
    const err = new Error('Unexpected field');
    err.code = 'LIMIT_UNEXPECTED_FILE';
    errorHandler(err, {}, res, () => {});
    assert.equal(state.statusCode, 400);
    assert.match(state.body.error, /unexpected file field/i);
  });

  test('handles ApiError', () => {
    const { res, state } = mockRes();
    const err = new ApiError(403, 'Forbidden', { reason: 'admin only' });
    errorHandler(err, {}, res, () => {});
    assert.equal(state.statusCode, 403);
    assert.equal(state.body.success, false);
    assert.equal(state.body.error, 'Forbidden');
    assert.deepEqual(state.body.details, { reason: 'admin only' });
  });

  test('handles Firebase auth errors (codes starting with auth/)', () => {
    const { res, state } = mockRes();
    const err = new Error('Firebase: Invalid token.');
    err.code = 'auth/invalid-token';
    errorHandler(err, {}, res, () => {});
    assert.equal(state.statusCode, 401);
    assert.equal(state.body.success, false);
    assert.equal(state.body.error, 'Authentication error');
  });

  test('handles gRPC numeric error codes', () => {
    const { res, state } = mockRes();
    const err = new Error('Document not found');
    err.code = 5;
    errorHandler(err, {}, res, () => {});
    assert.equal(state.statusCode, 500);
    assert.equal(state.body.error, 'Not found');
  });

  test('handles unknown gRPC numeric code with fallback message', () => {
    const { res, state } = mockRes();
    const err = new Error('Some unknown error');
    err.code = 99;
    errorHandler(err, {}, res, () => {});
    assert.equal(state.statusCode, 500);
    assert.equal(state.body.error, 'Database error');
  });

  test('handles ValidationError', () => {
    const { res, state } = mockRes();
    const err = new Error('Validation failed: email is required');
    err.name = 'ValidationError';
    errorHandler(err, {}, res, () => {});
    assert.equal(state.statusCode, 400);
    assert.equal(state.body.success, false);
    assert.equal(state.body.error, 'Validation error');
  });

  test('default fallback hides message in production', () => {
    const origEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const { res, state } = mockRes();
    const err = new Error('Internal secret details');
    errorHandler(err, {}, res, () => {});
    assert.equal(state.statusCode, 500);
    assert.equal(state.body.error, 'An unexpected error occurred');
    assert.equal(state.body.stack, undefined);
    process.env.NODE_ENV = origEnv;
  });

  test('default fallback exposes message in development', () => {
    const origEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    const { res, state } = mockRes();
    const err = new Error('Debug info');
    err.stack = 'Error: Debug info\n    at test.js:1:1';
    errorHandler(err, {}, res, () => {});
    assert.equal(state.statusCode, 500);
    assert.equal(state.body.error, 'Debug info');
    assert.ok(state.body.stack);
    process.env.NODE_ENV = origEnv;
  });
});

describe('asyncHandler wrapper', () => {
  test('catches errors from async handlers and passes to next', async () => {
    const handler = asyncHandler(async () => {
      throw new ApiError(400, 'Bad input');
    });
    let passedError = null;
    await handler({}, {}, (err) => { passedError = err; });
    assert.ok(passedError instanceof ApiError);
    assert.equal(passedError.statusCode, 400);
  });

  test('passes through successful handler results', async () => {
    let called = false;
    const handler = asyncHandler(async (req, res, next) => {
      called = true;
      next();
    });
    let nextCalled = false;
    await handler({}, {}, () => { nextCalled = true; });
    assert.equal(called, true);
  });
});
