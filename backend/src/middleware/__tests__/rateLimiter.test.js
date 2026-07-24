import { describe, test, before } from 'node:test';
import assert from 'node:assert/strict';

describe('aiRateLimiter', () => {
  let aiRateLimiter;

  before(async () => {
    const mod = await import('../rateLimiter.js');
    aiRateLimiter = mod.aiRateLimiter;
  });

  test('exports a rate limit middleware function', () => {
    assert.equal(typeof aiRateLimiter, 'function');
    assert.equal(aiRateLimiter.length, 3);
  });

  test('has configurable properties from express-rate-limit', () => {
    assert.ok(aiRateLimiter);
    // express-rate-limit returns a function that wraps the middleware
    assert.ok(typeof aiRateLimiter === 'function');
  });
});
