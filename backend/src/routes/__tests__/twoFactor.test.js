import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { ApiError } from '../../middleware/errorHandler.js';
import router, { verifyLoginChallenge } from '../twoFactor.js';

describe('twoFactor routes', () => {
  test('registers the verify-login compatibility route', () => {
    const verifyLoginRoute = router.stack.find(
      (layer) => layer.route?.path === '/verify-login' && layer.route.methods?.post
    );

    assert.ok(verifyLoginRoute, 'expected POST /verify-login route to be registered');
  });
});

describe('verifyLoginChallenge', () => {
  test('uses TOTP verification by default', async () => {
    const calls = [];
    const req = {
      user: { uid: 'user-123' },
      body: { token: '123456' },
    };
    const res = {
      payload: null,
      json(body) {
        this.payload = body;
      },
    };

    await verifyLoginChallenge(req, res, {
      async verifyTotp(uid, token) {
        calls.push(['totp', uid, token]);
        return true;
      },
      async verifyBackupCode() {
        calls.push(['backup']);
        return true;
      },
    });

    assert.deepEqual(calls, [['totp', 'user-123', '123456']]);
    assert.deepEqual(res.payload, { success: true });
  });

  test('uses backup-code verification when requested', async () => {
    const calls = [];
    const req = {
      user: { uid: 'user-456' },
      body: { token: 'ABCD-1234', useBackup: true },
    };
    const res = {
      payload: null,
      json(body) {
        this.payload = body;
      },
    };

    await verifyLoginChallenge(req, res, {
      async verifyTotp() {
        calls.push(['totp']);
        return true;
      },
      async verifyBackupCode(uid, code) {
        calls.push(['backup', uid, code]);
        return true;
      },
    });

    assert.deepEqual(calls, [['backup', 'user-456', 'ABCD-1234']]);
    assert.deepEqual(res.payload, { success: true });
  });

  test('throws the same backup-code error message on invalid backup code', async () => {
    const req = {
      user: { uid: 'user-789' },
      body: { token: 'BAD-CODE', useBackup: true },
    };
    const res = {
      json() {
        assert.fail('res.json should not be called on invalid backup code');
      },
    };

    await assert.rejects(
      verifyLoginChallenge(req, res, {
        async verifyTotp() {
          return true;
        },
        async verifyBackupCode() {
          return false;
        },
      }),
      (error) => {
        assert.ok(error instanceof ApiError);
        assert.equal(error.statusCode, 401);
        assert.equal(error.message, 'Invalid backup code');
        return true;
      }
    );
  });
});
