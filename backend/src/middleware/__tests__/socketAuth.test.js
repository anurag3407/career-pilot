import { describe, test, before, after } from 'node:test';
import assert from 'node:assert/strict';

const ORIG_CLERK_KEY = process.env.CLERK_SECRET_KEY;
const ORIG_NODE_ENV = process.env.NODE_ENV;
const ORIG_DEV_BYPASS = process.env.DEV_BYPASS_AUTH;

describe('socketAuthMiddleware', () => {
  let socketAuthMiddleware;

  before(async () => {
    process.env.CLERK_SECRET_KEY = 'test-clerk-secret';
    const mod = await import('../socketAuth.js');
    socketAuthMiddleware = mod.socketAuthMiddleware;
  });

  after(() => {
    process.env.CLERK_SECRET_KEY = ORIG_CLERK_KEY;
    process.env.NODE_ENV = ORIG_NODE_ENV;
    process.env.DEV_BYPASS_AUTH = ORIG_DEV_BYPASS;
  });

  function makeSocket(auth = {}) {
    return { handshake: { auth }, user: null };
  }

  test('rejects connection without token', () => {
    return new Promise((resolve) => {
      const socket = makeSocket({});
      socketAuthMiddleware(socket, (err) => {
        assert.ok(err);
        resolve();
      });
    });
  });

  test('uses dev bypass when ALLOW_DEV_SOCKET_AUTH is true', () => {
    return new Promise((resolve) => {
      process.env.ALLOW_DEV_SOCKET_AUTH = 'true';
      const socket = makeSocket({ token: 'invalid-token-will-fail' });

      socketAuthMiddleware(socket, () => {
        assert.ok(socket.user);
        assert.equal(socket.user.uid, 'dev-user-001');
        delete process.env.ALLOW_DEV_SOCKET_AUTH;
        resolve();
      });
    });
  });

  test('uses dev bypass when DEV_BYPASS_AUTH is true in development', () => {
    return new Promise((resolve) => {
      process.env.NODE_ENV = 'development';
      process.env.DEV_BYPASS_AUTH = 'true';
      process.env.ALLOW_DEV_SOCKET_AUTH = 'false';
      const socket = makeSocket({ token: 'will-fail' });

      socketAuthMiddleware(socket, () => {
        assert.ok(socket.user);
        assert.equal(socket.user.uid, 'dev-user-001');
        process.env.NODE_ENV = ORIG_NODE_ENV;
        process.env.DEV_BYPASS_AUTH = ORIG_DEV_BYPASS;
        resolve();
      });
    });
  });

  test('rejects invalid token when no dev bypass', () => {
    return new Promise((resolve) => {
      process.env.ALLOW_DEV_SOCKET_AUTH = 'false';
      process.env.NODE_ENV = 'production';
      process.env.DEV_BYPASS_AUTH = 'false';
      const socket = makeSocket({ token: 'invalid-token' });

      socketAuthMiddleware(socket, (err) => {
        assert.ok(err);
        resolve();
      });
    });
  });
});
