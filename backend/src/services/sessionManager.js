import crypto from 'crypto';
import redisManager from '../config/redis.js';

const CONNECTION_NAME = 'sessions';
const SESSION_PREFIX = 'session:';
const USER_SESSIONS_PREFIX = 'user-sessions:';
const DEFAULT_TTL_SECONDS = 60 * 60 * 24 * 7;

function getClient() {
  return redisManager.get(CONNECTION_NAME);
}

function sessionKey(sessionId) {
  return `${SESSION_PREFIX}${sessionId}`;
}

function userSessionsKey(uid) {
  return `${USER_SESSIONS_PREFIX}${uid}`;
}

export async function createSession(uid, metadata = {}, ttlSeconds = DEFAULT_TTL_SECONDS) {
  if (!uid) {
    throw new Error('createSession requires a uid');
  }
  if (!Number.isFinite(ttlSeconds) || ttlSeconds <= 0) {
    throw new Error('ttlSeconds must be a positive number');
  }

  getClient();
  const client = await redisManager.waitForReady(CONNECTION_NAME);
  const sessionId = crypto.randomBytes(32).toString('hex');
  const createdAt = Date.now();
  const expiresAt = createdAt + ttlSeconds * 1000;

  const payload = JSON.stringify({ uid, createdAt, expiresAt, ...metadata });

  await client.set(sessionKey(sessionId), payload, 'EX', ttlSeconds);
  await client.sadd(userSessionsKey(uid), sessionId);
  await client.expire(userSessionsKey(uid), ttlSeconds);

  return { sessionId, expiresAt };
}

export async function getSession(sessionId) {
  if (!sessionId) return null;

  getClient();
  const client = await redisManager.waitForReady(CONNECTION_NAME);
  const raw = await client.get(sessionKey(sessionId));
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    await client.del(sessionKey(sessionId));
    return null;
  }
}

export async function touchSession(sessionId, ttlSeconds = DEFAULT_TTL_SECONDS) {
  if (!sessionId) return false;

  getClient();
  const client = await redisManager.waitForReady(CONNECTION_NAME);
  const session = await getSession(sessionId);
  if (!session) return false;

  session.expiresAt = Date.now() + ttlSeconds * 1000;
  await client.set(sessionKey(sessionId), JSON.stringify(session), 'EX', ttlSeconds);
  await client.expire(userSessionsKey(session.uid), ttlSeconds);
  return true;
}

export async function invalidateSession(sessionId) {
  if (!sessionId) return false;

  getClient();
  const client = await redisManager.waitForReady(CONNECTION_NAME);
  const session = await getSession(sessionId);

  const deleted = await client.del(sessionKey(sessionId));

  if (session?.uid) {
    await client.srem(userSessionsKey(session.uid), sessionId);
  }

  return deleted > 0;
}

export async function invalidateAllSessions(uid) {
  if (!uid) return 0;

  getClient();
  const client = await redisManager.waitForReady(CONNECTION_NAME);
  const sessionIds = await client.smembers(userSessionsKey(uid));

  if (sessionIds.length === 0) {
    await client.del(userSessionsKey(uid));
    return 0;
  }

  const pipeline = client.pipeline();
  for (const sessionId of sessionIds) {
    pipeline.del(sessionKey(sessionId));
  }
  pipeline.del(userSessionsKey(uid));

  await pipeline.exec();
  return sessionIds.length;
}

export async function getUserSessions(uid) {
  if (!uid) return [];
  getClient();
  const client = await redisManager.waitForReady(CONNECTION_NAME);
  return client.smembers(userSessionsKey(uid));
}

const sessionManager = {
  createSession,
  getSession,
  touchSession,
  invalidateSession,
  invalidateAllSessions,
  getUserSessions,
};

export default sessionManager;
