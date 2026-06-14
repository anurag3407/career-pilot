import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createSocketOptions,
  getAllowedSocketOrigins,
  isSocketOriginAllowed,
  SOCKET_TRANSPORTS
} from '../socketOptions.js';

const validateCorsOrigin = (origin) =>
  new Promise((resolve, reject) => {
    const options = createSocketOptions();

    options.cors.origin(origin, (error, allowed) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(allowed);
    });
  });

test('configures polling before websocket', () => {
  const options = createSocketOptions();

  assert.deepEqual(SOCKET_TRANSPORTS, [
    'polling',
    'websocket'
  ]);

  assert.deepEqual(options.transports, [
    'polling',
    'websocket'
  ]);
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

test('includes all REST API default origins', () => {
  const origins = getAllowedSocketOrigins();

  assert.equal(
    origins.includes('http://localhost:5173'),
    true
  );

  assert.equal(
    origins.includes('http://localhost:3000'),
    true
  );

  assert.equal(
    origins.includes('https://careerpilotyy.netlify.app'),
    true
  );
});

test('includes and normalizes FRONTEND_URL', () => {
  const previousFrontendUrl = process.env.FRONTEND_URL;

  process.env.FRONTEND_URL =
    'https://career-pilot.example.com/';

  try {
    const origins = getAllowedSocketOrigins();

    assert.equal(
      origins.includes('https://career-pilot.example.com'),
      true
    );

    assert.equal(
      origins.includes('https://career-pilot.example.com/'),
      false
    );
  } finally {
    if (previousFrontendUrl === undefined) {
      delete process.env.FRONTEND_URL;
    } else {
      process.env.FRONTEND_URL = previousFrontendUrl;
    }
  }
});

test('accepts all default frontend origins', async () => {
  const origins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://careerpilotyy.netlify.app'
  ];

  for (const origin of origins) {
    assert.equal(await validateCorsOrigin(origin), true);
  }
});

test('accepts a supported origin with a trailing slash', () => {
  assert.equal(
    isSocketOriginAllowed('http://localhost:3000/'),
    true
  );
});

test('accepts requests without an Origin header', async () => {
  assert.equal(await validateCorsOrigin(undefined), true);
});

test('rejects origins outside the allowlist', async () => {
  await assert.rejects(
    () =>
      validateCorsOrigin(
        'https://malicious.example.com'
      ),
    /Not allowed by CORS/
  );
});

test('preserves CORS methods and credentials', () => {
  const options = createSocketOptions();

  assert.deepEqual(options.cors.methods, [
    'GET',
    'POST'
  ]);

  assert.equal(options.cors.credentials, true);
});