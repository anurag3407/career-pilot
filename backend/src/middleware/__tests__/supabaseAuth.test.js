import { describe, test, mock } from 'node:test';
import assert from 'node:assert/strict';
import { supabaseAdmin, isSupabaseConfigured } from '../../config/supabase.js';
import { verifyToken, optionalAuth, adminOnly } from '../auth.js';

describe('Supabase auth integration', () => {
  const [tokenParser, attachUser, enforce] = verifyToken;

  test('attaches user when Supabase verifies token', async () => {
    const mockUser = {
      id: 'supabase-user-123',
      email: 'alex@example.com',
      email_confirmed_at: '2026-01-01T00:00:00Z',
      user_metadata: {
        full_name: 'Alex Developer',
        avatar_url: 'https://example.com/avatar.png',
      },
    };

    const getUserMock = mock.method(supabaseAdmin.auth, 'getUser', async (token) => {
      if (token === 'valid-supabase-token') {
        return { data: { user: mockUser }, error: null };
      }
      return { data: { user: null }, error: new Error('Invalid token') };
    });

    const req = {
      headers: {
        authorization: 'Bearer valid-supabase-token',
      },
    };
    const res = {};

    let nextCalled = false;
    await attachUser(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true);
    assert.ok(req.user);
    assert.equal(req.user.id, 'supabase-user-123');
    assert.equal(req.user.uid, 'supabase-user-123');
    assert.equal(req.user.email, 'alex@example.com');
    assert.equal(req.user.name, 'Alex Developer');
    assert.equal(req.user.picture, 'https://example.com/avatar.png');
    assert.equal(req.user.emailVerified, true);

    getUserMock.mock.restore();
  });

  test('enforceAuth rejects requests when req.user is null', () => {
    const req = { user: null };
    const res = {};
    let passedError = null;

    enforce(req, res, (err) => {
      passedError = err;
    });

    assert.ok(passedError);
    assert.equal(passedError.statusCode, 401);
  });

  test('enforceAuth passes through when req.user is present', () => {
    const req = { user: { id: 'u1' } };
    const res = {};
    let nextCalled = false;

    enforce(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true);
  });
});
