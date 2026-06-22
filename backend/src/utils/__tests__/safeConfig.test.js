/**
 * Unit tests for the safe configuration logging helper.
 *
 * Run with:
 *   node --test src/utils/__tests__/safeConfig.test.js
 *
 * Uses Node.js built-in node:test; no extra dependencies required.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import { getSafeConfig, isSensitiveKey } from '../safeConfig.js';

describe('getSafeConfig', () => {
  test('reports configured for present values without revealing them', () => {
    const env = { FRONTEND_URL: 'https://example.com', GEMINI_API_KEY: 'super-secret' };
    const summary = getSafeConfig(env, ['FRONTEND_URL', 'GEMINI_API_KEY']);
    assert.equal(summary.FRONTEND_URL, 'configured');
    assert.equal(summary.GEMINI_API_KEY, 'configured');
  });

  test('never includes the underlying secret value', () => {
    const env = { JWT_SECRET: 'do-not-leak' };
    const summary = getSafeConfig(env, ['JWT_SECRET']);
    const serialized = JSON.stringify(summary);
    assert.ok(!serialized.includes('do-not-leak'));
  });

  test('reports missing for absent or empty values', () => {
    const env = { EMAIL_SERVICE_URL: '' };
    const summary = getSafeConfig(env, ['EMAIL_SERVICE_URL', 'NOT_SET']);
    assert.equal(summary.EMAIL_SERVICE_URL, 'missing');
    assert.equal(summary.NOT_SET, 'missing');
  });

  test('returns an empty object when no keys are requested', () => {
    assert.deepEqual(getSafeConfig({ A: '1' }, []), {});
  });
});

describe('isSensitiveKey', () => {
  test('flags explicitly listed secret keys', () => {
    assert.equal(isSensitiveKey('GEMINI_API_KEY'), true);
    assert.equal(isSensitiveKey('DATABASE_URL'), true);
    assert.equal(isSensitiveKey('JWT_SECRET'), true);
  });

  test('flags keys matching sensitive patterns', () => {
    assert.equal(isSensitiveKey('SOME_API_KEY'), true);
    assert.equal(isSensitiveKey('MY_TOKEN'), true);
    assert.equal(isSensitiveKey('CUSTOM_SECRET'), true);
  });

  test('does not flag plain non-sensitive keys', () => {
    assert.equal(isSensitiveKey('NODE_ENV'), false);
    assert.equal(isSensitiveKey('FRONTEND_URL'), false);
    assert.equal(isSensitiveKey('PORT'), false);
  });
});
