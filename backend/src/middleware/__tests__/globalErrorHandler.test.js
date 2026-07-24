import { describe, test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { globalErrorHandler, catchAsync } from '../globalErrorHandler.js';

function mockReqRes() {
  const state = { statusCode: 200, body: null };
  const res = {
    status(code) {
      state.statusCode = code;
      return this;
    },
    json(body) {
      state.body = body;
      return this;
    },
  };
  return { res, state };
}

describe('globalErrorHandler', () => {
  test('handles error with statusCode and message', () => {
    const { res, state } = mockReqRes();
    const err = new Error('Not found');
    err.statusCode = 404;

    globalErrorHandler(err, {}, res, () => {});

    assert.equal(state.statusCode, 404);
    assert.equal(state.body.success, false);
    assert.equal(state.body.message, 'Not found');
  });

  test('defaults to 500 when no statusCode', () => {
    const { res, state } = mockReqRes();
    const err = new Error('Something broke');

    globalErrorHandler(err, {}, res, () => {});

    assert.equal(state.statusCode, 500);
    assert.equal(state.body.message, 'Something broke');
  });

  test('uses fallback message when no message', () => {
    const { res, state } = mockReqRes();
    const err = {};

    globalErrorHandler(err, {}, res, () => {});

    assert.equal(state.statusCode, 500);
    assert.equal(state.body.message, 'Something went wrong');
  });
});

describe('catchAsync', () => {
  test('catches async errors and passes to next', async () => {
    const handler = catchAsync(async () => {
      throw new Error('Async error');
    });

    let passedError = null;
    await handler({}, {}, (err) => { passedError = err; });

    assert.equal(passedError.message, 'Async error');
  });

  test('passes through successful handler', async () => {
    let called = false;
    const handler = catchAsync(async (req, res, next) => {
      called = true;
      next();
    });

    await handler({}, {}, () => {});
    assert.equal(called, true);
  });
});
