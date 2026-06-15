/**
 * Unit tests for the email configuration validation helpers.
 *
 * Run with:
 *   node --test src/utils/__tests__/emailConfig.test.js
 *
 * Uses Node.js built-in node:test; no extra dependencies required.
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  describeEmailConfig,
  isEmailConfigured,
  validateEmailConfig,
} from '../emailConfig.js';

describe('describeEmailConfig', () => {
  test('detects external service configuration', () => {
    const env = { EMAIL_SERVICE_URL: 'https://mail.example.com', EMAIL_API_KEY: 'key' };
    assert.deepEqual(describeEmailConfig(env), { configured: true, mode: 'external' });
  });

  test('detects SMTP configuration', () => {
    const env = { EMAIL_USER: 'user@example.com', EMAIL_PASS: 'secret' };
    assert.deepEqual(describeEmailConfig(env), { configured: true, mode: 'smtp' });
  });

  test('prefers external mode when both are present', () => {
    const env = {
      EMAIL_SERVICE_URL: 'https://mail.example.com',
      EMAIL_API_KEY: 'key',
      EMAIL_USER: 'user@example.com',
      EMAIL_PASS: 'secret',
    };
    assert.equal(describeEmailConfig(env).mode, 'external');
  });

  test('reports none when nothing is configured', () => {
    assert.deepEqual(describeEmailConfig({}), { configured: false, mode: 'none' });
  });

  test('treats partial SMTP config as not configured', () => {
    assert.equal(describeEmailConfig({ EMAIL_USER: 'user@example.com' }).configured, false);
  });
});

describe('isEmailConfigured', () => {
  test('true when external is set', () => {
    assert.equal(
      isEmailConfigured({ EMAIL_SERVICE_URL: 'https://m', EMAIL_API_KEY: 'k' }),
      true
    );
  });

  test('false when nothing is set', () => {
    assert.equal(isEmailConfigured({}), false);
  });
});

describe('validateEmailConfig', () => {
  test('returns enabled status when configured', () => {
    const result = validateEmailConfig({ EMAIL_USER: 'u@e.com', EMAIL_PASS: 'p' });
    assert.equal(result.enabled, true);
    assert.equal(result.mode, 'smtp');
  });

  test('throws in production when not configured', () => {
    assert.throws(
      () => validateEmailConfig({ NODE_ENV: 'production' }),
      /required in production/
    );
  });

  test('warns (does not throw) outside production when not configured', () => {
    const result = validateEmailConfig({ NODE_ENV: 'development' });
    assert.equal(result.enabled, false);
    assert.equal(result.mode, 'none');
  });
});
