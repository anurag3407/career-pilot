import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createSocketOptions,
  SOCKET_TRANSPORTS
} from '../socketOptions.js';

test('configures polling before websocket', () => {
  const options = createSocketOptions();

  assert.deepEqual(SOCKET_TRANSPORTS, ['polling', 'websocket']);
  assert.deepEqual(options.transports, ['polling', 'websocket']);
});

test('allows websocket upgrades after polling connection', () => {
  const options = createSocketOptions();

  assert.equal(options.allowUpgrades, true);
});

test('preserves socket heartbeat configuration', () => {
  const options = createSocketOptions();

  assert.equal(options.pingTimeout, 60_000);
  assert.equal(options.pingInterval, 25_000);
});

test('uses the configured frontend URL for CORS', () => {
  const previousFrontendUrl = process.env.FRONTEND_URL;
  process.env.FRONTEND_URL = 'https://career-pilot.example.com';

  try {
    const options = createSocketOptions();

    assert.equal(
      options.cors.origin,
      'https://career-pilot.example.com'
    );
    assert.deepEqual(options.cors.methods, ['GET', 'POST']);
    assert.equal(options.cors.credentials, true);
  } finally {
    if (previousFrontendUrl === undefined) {
      delete process.env.FRONTEND_URL;
    } else {
      process.env.FRONTEND_URL = previousFrontendUrl;
    }
  }
});