import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { authStore } from '../services/authStore.js';
import { ResilientRedisStore } from '../middleware/rateLimiter.js';

describe('authStore — OAuth State Persistence', () => {
  beforeEach(() => {
    // Reset process environment for consistency
    process.env.NODE_ENV = 'development';
  });

  test('successfully sets, validates and deletes OAuth state', async () => {
    const state = 'test-oauth-state-123';
    await authStore.setOAuthState(state, 60);

    const isValid = await authStore.validateOAuthState(state);
    assert.strictEqual(isValid, true, 'OAuth state should be valid upon first check');

    const isValidAgain = await authStore.validateOAuthState(state);
    assert.strictEqual(isValidAgain, false, 'OAuth state should be invalid after being consumed (replay prevention)');
  });

  test('non-existent OAuth state is invalid', async () => {
    const isValid = await authStore.validateOAuthState('non-existent-state');
    assert.strictEqual(isValid, false);
  });
});

describe('authStore — Password Reset Token Store', () => {
  test('successfully sets, retrieves and deletes password reset token mapping', async () => {
    const token = 'pwd-reset-token-abc';
    const userId = 'user-id-999';

    await authStore.setPasswordResetToken(token, userId, 60);

    const retrievedUserId = await authStore.getAndDeletePasswordResetToken(token);
    assert.strictEqual(retrievedUserId, userId, 'Should retrieve correct userId');

    const retrievedAgain = await authStore.getAndDeletePasswordResetToken(token);
    assert.strictEqual(retrievedAgain, null, 'Should be null after consumption (one-time usage constraint)');
  });

  test('returns null for invalid/expired tokens', async () => {
    const result = await authStore.getAndDeletePasswordResetToken('invalid-token');
    assert.strictEqual(result, null);
  });
});

describe('authStore — LinkedIn Exchange Code Store', () => {
  test('successfully sets, retrieves and deletes exchange codes', async () => {
    const code = 'linkedin-exchange-code-xyz';
    const payload = { token: 'mock-firebase-token', isNew: true };

    await authStore.setLinkedInCode(code, payload, 60);

    const retrievedPayload = await authStore.getAndDeleteLinkedInCode(code);
    assert.deepEqual(retrievedPayload, payload, 'Should retrieve identical payload object');

    const retrievedAgain = await authStore.getAndDeleteLinkedInCode(code);
    assert.strictEqual(retrievedAgain, null, 'Should return null after deletion');
  });
});

describe('authStore — Production Fail Secure Behavior', () => {
  let originalNodeEnv;
  let originalRedisUrl;

  beforeEach(() => {
    originalNodeEnv = process.env.NODE_ENV;
    originalRedisUrl = process.env.REDIS_URL;
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    process.env.REDIS_URL = originalRedisUrl;
  });

  test('fails securely in production when Redis connection fails', async () => {
    process.env.NODE_ENV = 'production';
    // Force getClient to trigger error by specifying an invalid URL
    process.env.REDIS_URL = 'redis://invalid-host-name-that-does-not-exist:9999';

    // Verify it rejects or throws an error in production
    await assert.rejects(async () => {
      await authStore.setOAuthState('some-state', 60);
    }, (err) => {
      return err.statusCode === 503 && err.message.includes('unavailable');
    }, 'Should throw a 503 error instead of silently falling back to in-memory store in production');
  });

  test('falls back gracefully in development when Redis connection fails', async () => {
    process.env.NODE_ENV = 'development';
    process.env.REDIS_URL = 'redis://invalid-host-name-that-does-not-exist:9999';

    // Should not throw, should fall back to memory
    await authStore.setOAuthState('fallback-state', 60);
    const isValid = await authStore.validateOAuthState('fallback-state');
    assert.strictEqual(isValid, true, 'Should successfully complete via local fallback store');
  });
});

describe('ResilientRedisStore — Rate Limiting Conformance', () => {
  let store;

  beforeEach(() => {
    // Instantiate ResilientRedisStore with null client to trigger local fallback test
    store = new ResilientRedisStore(() => null, 60000, 'test_limit:');
    process.env.NODE_ENV = 'development';
  });

  test('implements store increment, decrement and reset contract correctly', async () => {
    const key = '127.0.0.1';

    // 1st increment
    const res1 = await store.increment(key);
    assert.strictEqual(res1.totalHits, 1);
    assert.ok(res1.resetTime instanceof Date);

    // 2nd increment
    const res2 = await store.increment(key);
    assert.strictEqual(res2.totalHits, 2);

    // Decrement
    await store.decrement(key);
    const res3 = await store.increment(key);
    assert.strictEqual(res3.totalHits, 2); // Hits went 1 -> 2 -> 1 -> 2

    // Reset
    await store.resetKey(key);
    const res4 = await store.increment(key);
    assert.strictEqual(res4.totalHits, 1, 'Counter should reset back to 1');
  });
});
