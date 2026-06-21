import { describe, test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  KeyRotator,
  shouldRotate,
  registerKeys,
  loadKeysFromEnv,
  getRotator,
  clearProvider,
  clearAllProviders,
  withRotation,
  getSystemStatus,
  generateApiKey,
} from '../apiKeyRotation.js';

// ---------------------------------------------------------------------------
// shouldRotate
// ---------------------------------------------------------------------------

describe('shouldRotate()', () => {
  test('returns false for null or undefined', () => {
    assert.equal(shouldRotate(null), false);
    assert.equal(shouldRotate(undefined), false);
  });

  test('returns true for HTTP 429 status', () => {
    assert.equal(shouldRotate({ status: 429, message: '' }), true);
  });

  test('returns true for HTTP 401 status', () => {
    assert.equal(shouldRotate({ status: 401, message: '' }), true);
  });

  test('returns true for HTTP 403 status', () => {
    assert.equal(shouldRotate({ statusCode: 403, message: '' }), true);
  });

  test('returns true for rate limit error message', () => {
    assert.equal(shouldRotate({ message: 'Rate limit exceeded for this key' }), true);
  });

  test('returns true for quota exceeded message', () => {
    assert.equal(shouldRotate({ message: 'You have exceeded your quota' }), true);
  });

  test('returns true for invalid api key message', () => {
    assert.equal(shouldRotate({ message: 'Invalid API key provided' }), true);
  });

  test('returns false for a generic server error', () => {
    assert.equal(shouldRotate({ status: 500, message: 'Internal server error' }), false);
  });

  test('returns false for a network timeout', () => {
    assert.equal(shouldRotate({ message: 'Request timed out' }), false);
  });
});

// ---------------------------------------------------------------------------
// KeyRotator
// ---------------------------------------------------------------------------

describe('KeyRotator — construction', () => {
  test('throws when provider is omitted', () => {
    assert.throws(() => new KeyRotator(''), /provider is required/);
  });

  test('initialises with zero keys when none supplied', () => {
    const r = new KeyRotator('gemini');
    assert.equal(r.totalCount, 0);
    assert.equal(r.healthyCount, 0);
  });

  test('accepts an initial key list', () => {
    const r = new KeyRotator('openai', ['key-a', 'key-b']);
    assert.equal(r.totalCount, 2);
    assert.equal(r.healthyCount, 2);
  });
});

describe('KeyRotator — addKey / removeKey', () => {
  test('addKey registers a new key', () => {
    const r = new KeyRotator('gemini');
    r.addKey('key-1');
    assert.equal(r.totalCount, 1);
  });

  test('addKey silently ignores duplicates', () => {
    const r = new KeyRotator('gemini', ['key-1']);
    r.addKey('key-1');
    assert.equal(r.totalCount, 1);
  });

  test('addKey ignores empty or non-string values', () => {
    const r = new KeyRotator('gemini');
    r.addKey('');
    r.addKey(null);
    r.addKey(42);
    assert.equal(r.totalCount, 0);
  });

  test('removeKey deletes the matching key', () => {
    const r = new KeyRotator('gemini', ['abcdefghijklmnop-1', 'abcdefghijklmnop-2']);
    r.removeKey('abcdefghijklmnop-1');
    assert.equal(r.totalCount, 1);
    const hint = r.getStatus()[0].keyHint;
    assert.ok(!hint.includes('mnop-1'));
  });

  test('removeKey is a no-op for unknown keys', () => {
    const r = new KeyRotator('gemini', ['key-1']);
    r.removeKey('unknown');
    assert.equal(r.totalCount, 1);
  });
});

describe('KeyRotator — getNextKey', () => {
  test('throws when no keys are registered', () => {
    const r = new KeyRotator('gemini');
    assert.throws(() => r.getNextKey(), /No API keys registered/);
  });

  test('returns the only registered key', () => {
    const r = new KeyRotator('gemini', ['only-key']);
    assert.equal(r.getNextKey(), 'only-key');
  });

  test('rotates through keys in round-robin order', () => {
    const r = new KeyRotator('gemini', ['a', 'b', 'c']);
    assert.equal(r.getNextKey(), 'a');
    assert.equal(r.getNextKey(), 'b');
    assert.equal(r.getNextKey(), 'c');
    assert.equal(r.getNextKey(), 'a');
  });

  test('skips unhealthy keys', () => {
    const r = new KeyRotator('gemini', ['a', 'b', 'c']);
    r.markKeyFailed('b');
    const results = [r.getNextKey(), r.getNextKey(), r.getNextKey()];
    assert.ok(!results.includes('b'));
    assert.ok(results.includes('a'));
    assert.ok(results.includes('c'));
  });

  test('throws when all keys are unhealthy', () => {
    const r = new KeyRotator('gemini', ['a', 'b']);
    r.markKeyFailed('a');
    r.markKeyFailed('b');
    assert.throws(() => r.getNextKey(), /All API keys exhausted/);
  });

  test('increments useCount on each call', () => {
    const r = new KeyRotator('gemini', ['key-1']);
    r.getNextKey();
    r.getNextKey();
    assert.equal(r.getStatus()[0].useCount, 2);
  });
});

describe('KeyRotator — markKeyFailed / markKeyHealthy', () => {
  test('markKeyFailed sets healthy=false and records failedAt', () => {
    const r = new KeyRotator('gemini', ['k']);
    r.markKeyFailed('k');
    const s = r.getStatus()[0];
    assert.equal(s.healthy, false);
    assert.ok(s.failedAt !== null);
    assert.equal(s.failCount, 1);
  });

  test('markKeyHealthy restores a failed key', () => {
    const r = new KeyRotator('gemini', ['k']);
    r.markKeyFailed('k');
    r.markKeyHealthy('k');
    assert.equal(r.healthyCount, 1);
  });

  test('failed key recovers after cooldown expires', () => {
    const r = new KeyRotator('gemini', ['k'], 50);
    r.markKeyFailed('k');
    assert.equal(r.healthyCount, 0);
    // Simulate the cooldown passing by backdating failedAt
    r._pool[0].failedAt = Date.now() - 100;
    assert.equal(r.healthyCount, 1);
  });

  test('markKeyFailed is a no-op for unregistered keys', () => {
    const r = new KeyRotator('gemini', ['k']);
    r.markKeyFailed('unknown');
    assert.equal(r.healthyCount, 1);
  });
});

describe('KeyRotator — getStatus', () => {
  test('redacts full key values', () => {
    const r = new KeyRotator('gemini', ['sk-abcdefgh12345678']);
    const hint = r.getStatus()[0].keyHint;
    assert.ok(!hint.includes('abcdefgh12345678'));
    assert.match(hint, /\.\.\./);
  });

  test('returns all tracked fields', () => {
    const r = new KeyRotator('gemini', ['sk-abcdefgh12345678']);
    const s = r.getStatus()[0];
    assert.ok('keyHint' in s);
    assert.ok('healthy' in s);
    assert.ok('useCount' in s);
    assert.ok('failCount' in s);
    assert.ok('failedAt' in s);
  });
});

// ---------------------------------------------------------------------------
// Registry helpers
// ---------------------------------------------------------------------------

describe('registerKeys / getRotator / clearProvider', () => {
  beforeEach(() => clearAllProviders());

  test('registerKeys creates a rotator with the supplied keys', () => {
    registerKeys('openai', ['k1', 'k2']);
    const r = getRotator('openai');
    assert.equal(r.totalCount, 2);
  });

  test('calling registerKeys twice on same provider merges keys', () => {
    registerKeys('openai', ['k1']);
    registerKeys('openai', ['k2']);
    assert.equal(getRotator('openai').totalCount, 2);
  });

  test('clearProvider removes the rotator for that provider only', () => {
    registerKeys('openai', ['k1']);
    registerKeys('gemini', ['k2']);
    clearProvider('openai');
    assert.equal(getRotator('openai').totalCount, 0);
    assert.equal(getRotator('gemini').totalCount, 1);
  });
});

describe('loadKeysFromEnv()', () => {
  beforeEach(() => clearAllProviders());

  test('loads the bare env var', () => {
    process.env.TEST_API_KEY = 'bare-key';
    delete process.env.TEST_API_KEY_1;
    loadKeysFromEnv('test', 'TEST_API_KEY');
    assert.equal(getRotator('test').totalCount, 1);
    delete process.env.TEST_API_KEY;
  });

  test('loads indexed env vars alongside the bare one', () => {
    process.env.TEST_API_KEY = 'key-0';
    process.env.TEST_API_KEY_1 = 'key-1';
    process.env.TEST_API_KEY_2 = 'key-2';
    delete process.env.TEST_API_KEY_3;
    loadKeysFromEnv('test', 'TEST_API_KEY');
    assert.equal(getRotator('test').totalCount, 3);
    delete process.env.TEST_API_KEY;
    delete process.env.TEST_API_KEY_1;
    delete process.env.TEST_API_KEY_2;
  });

  test('registers nothing when no matching env vars exist', () => {
    delete process.env.MISSING_API_KEY;
    loadKeysFromEnv('missing', 'MISSING_API_KEY');
    assert.equal(getRotator('missing').totalCount, 0);
  });
});

// ---------------------------------------------------------------------------
// withRotation
// ---------------------------------------------------------------------------

describe('withRotation()', () => {
  beforeEach(() => clearAllProviders());

  test('calls fn with a valid key and returns its result', async () => {
    registerKeys('gemini', ['key-a']);
    const result = await withRotation('gemini', async (key) => `ok:${key}`);
    assert.equal(result, 'ok:key-a');
  });

  test('rotates to the next key on a rate-limit error', async () => {
    registerKeys('gemini', ['bad', 'good']);
    const usedKeys = [];
    const result = await withRotation('gemini', async (key) => {
      usedKeys.push(key);
      if (key === 'bad') {
        const err = new Error('Rate limit exceeded');
        err.status = 429;
        throw err;
      }
      return 'success';
    });
    assert.equal(result, 'success');
    assert.ok(usedKeys.includes('bad'));
    assert.ok(usedKeys.includes('good'));
  });

  test('does not rotate on a non-key error (e.g. bad request)', async () => {
    registerKeys('gemini', ['key-a', 'key-b']);
    const calls = [];
    await assert.rejects(
      () =>
        withRotation('gemini', async (key) => {
          calls.push(key);
          throw new Error('Malformed request body');
        }),
      /Malformed request body/
    );
    assert.equal(calls.length, 1);
  });

  test('throws when all keys are exhausted', async () => {
    registerKeys('gemini', ['k1', 'k2']);
    await assert.rejects(
      () =>
        withRotation('gemini', async () => {
          const err = new Error('invalid api key');
          err.status = 401;
          throw err;
        }, { maxRetries: 2 }),
      /invalid api key/
    );
  });

  test('throws immediately when no keys are registered', async () => {
    await assert.rejects(
      () => withRotation('unknown-provider', async () => {}),
      /No API keys registered/
    );
  });
});

// ---------------------------------------------------------------------------
// getSystemStatus
// ---------------------------------------------------------------------------

describe('getSystemStatus()', () => {
  beforeEach(() => clearAllProviders());

  test('returns an entry per registered provider', () => {
    registerKeys('gemini', ['k1', 'k2']);
    registerKeys('openai', ['k3']);
    const status = getSystemStatus();
    assert.ok('gemini' in status);
    assert.ok('openai' in status);
    assert.equal(status.gemini.total, 2);
    assert.equal(status.openai.total, 1);
  });

  test('returns empty object when no providers registered', () => {
    assert.deepEqual(getSystemStatus(), {});
  });
});

// ---------------------------------------------------------------------------
// generateApiKey
// ---------------------------------------------------------------------------

describe('generateApiKey()', () => {
  test('returns a string', () => {
    assert.equal(typeof generateApiKey(), 'string');
  });

  test('includes the given prefix', () => {
    const key = generateApiKey('myapp');
    assert.ok(key.startsWith('myapp_'));
  });

  test('uses the default cpk prefix when none supplied', () => {
    assert.ok(generateApiKey().startsWith('cpk_'));
  });

  test('returns unique values on each call', () => {
    const a = generateApiKey();
    const b = generateApiKey();
    assert.notEqual(a, b);
  });

  test('works with no prefix', () => {
    const key = generateApiKey('');
    assert.equal(typeof key, 'string');
    assert.ok(key.length > 0);
  });
});
