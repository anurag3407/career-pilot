import { describe, test, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import RedisMock from 'ioredis-mock';
import redisManager from '../../config/redis.js';
import {
  createSession,
  getSession,
  touchSession,
  invalidateSession,
  invalidateAllSessions,
  getUserSessions,
} from '../sessionManager.js';

const CONNECTION_NAME = 'sessions';

describe('sessionManager', () => {
  before(() => {
    // Replace the lazily-created Redis client with an in-memory mock.
    // ioredis-mock doesn't set `.status`, but redisManager.get() checks
    // existing.client.status to decide whether to reuse a connection,
    // so we set it to 'ready' to mimic a healthy ioredis client.
    const mockClient = new RedisMock();
    mockClient.status = 'ready';
    redisManager.connections.set(CONNECTION_NAME, {
      client: mockClient,
      status: 'connected',
    });
  });

  after(async () => {
    await redisManager.close(CONNECTION_NAME);
  });

  beforeEach(async () => {
    const entry = redisManager.connections.get(CONNECTION_NAME);
    await entry.client.flushall();
  });

  test('createSession returns a sessionId and expiresAt', async () => {
    const { sessionId, expiresAt } = await createSession('user-1', { email: 'a@b.com' });
    assert.ok(sessionId);
    assert.equal(sessionId.length, 64);
    assert.ok(expiresAt > Date.now());
  });

  test('getSession returns stored session data', async () => {
    const { sessionId } = await createSession('user-1', { email: 'a@b.com' });
    const session = await getSession(sessionId);
    assert.equal(session.uid, 'user-1');
    assert.equal(session.email, 'a@b.com');
  });

  test('getSession returns null for unknown sessionId', async () => {
    const session = await getSession('does-not-exist');
    assert.equal(session, null);
  });

  test('touchSession extends expiry and returns true', async () => {
    const { sessionId, expiresAt } = await createSession('user-1', {}, 10);
    const ok = await touchSession(sessionId, 1000);
    assert.equal(ok, true);

    const session = await getSession(sessionId);
    assert.ok(session.expiresAt > expiresAt);
  });

  test('touchSession returns false for unknown sessionId', async () => {
    const ok = await touchSession('nope');
    assert.equal(ok, false);
  });

  test('invalidateSession removes the session', async () => {
    const { sessionId } = await createSession('user-1', {});
    const ok = await invalidateSession(sessionId);
    assert.equal(ok, true);

    const session = await getSession(sessionId);
    assert.equal(session, null);
  });

  test('invalidateSession returns false for already-removed session', async () => {
    const { sessionId } = await createSession('user-1', {});
    await invalidateSession(sessionId);
    const ok = await invalidateSession(sessionId);
    assert.equal(ok, false);
  });

  test('getUserSessions lists active sessions for a user', async () => {
    const s1 = await createSession('user-2', {});
    const s2 = await createSession('user-2', {});

    const sessions = await getUserSessions('user-2');
    assert.equal(sessions.length, 2);
    assert.ok(sessions.includes(s1.sessionId));
    assert.ok(sessions.includes(s2.sessionId));
  });

  test('invalidateAllSessions removes all sessions for a user', async () => {
    const s1 = await createSession('user-3', {});
    const s2 = await createSession('user-3', {});

    const count = await invalidateAllSessions('user-3');
    assert.equal(count, 2);

    assert.equal(await getSession(s1.sessionId), null);
    assert.equal(await getSession(s2.sessionId), null);
    assert.deepEqual(await getUserSessions('user-3'), []);
  });

  test('invalidateAllSessions returns 0 for a user with no sessions', async () => {
    const count = await invalidateAllSessions('user-no-sessions');
    assert.equal(count, 0);
  });

  test('createSession throws without a uid', async () => {
    await assert.rejects(() => createSession(), /requires a uid/);
  });

  test('createSession throws with invalid ttlSeconds', async () => {
    await assert.rejects(() => createSession('user-1', {}, -5), /ttlSeconds/);
  });
});
