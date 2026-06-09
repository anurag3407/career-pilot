
const redis = require("redis");
const crypto = require("crypto");

/**
 * Default session TTL in seconds (1 hour)
 */
const SESSION_TTL = 3600;

let client;

/**
 * Initializes and returns the Redis client (singleton).
 * @returns {Promise<RedisClient>}
 */
async function getRedisClient() {
  if (!client) {
    client = redis.createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    });

    client.on("error", (err) => {
      console.error("[SessionManager] Redis Client Error:", err);
    });

    await client.connect();
  }
  return client;
}

/**
 * Creates a new session for a given user ID.
 * @param {string} userId - The user's unique identifier.
 * @param {Object} [metadata={}] - Optional metadata to store with the session.
 * @returns {Promise<string>} The generated session token.
 */
async function createSession(userId, metadata = {}) {
  if (!userId) throw new Error("userId is required to create a session");

  const redisClient = await getRedisClient();
  const token = crypto.randomBytes(32).toString("hex");
  const sessionKey = `session:${token}`;

  const sessionData = JSON.stringify({
    userId,
    createdAt: Date.now(),
    ...metadata,
  });

  await redisClient.set(sessionKey, sessionData, { EX: SESSION_TTL });
  return token;
}

/**
 * Validates a session token and returns the session data.
 * @param {string} token - The session token to validate.
 * @returns {Promise<Object>} The session data object.
 * @throws {Error} If the session is invalid or expired.
 */
async function validateSession(token) {
  if (!token) throw new Error("Token is required for validation");

  const redisClient = await getRedisClient();
  const sessionKey = `session:${token}`;
  const data = await redisClient.get(sessionKey);

  if (!data) {
    throw new Error("Session not found or has expired");
  }

  return JSON.parse(data);
}

/**
 * Invalidates (deletes) a session by its token.
 * @param {string} token - The session token to invalidate.
 * @returns {Promise<boolean>} True if deleted, false if not found.
 */
async function invalidateSession(token) {
  if (!token) throw new Error("Token is required for invalidation");

  const redisClient = await getRedisClient();
  const sessionKey = `session:${token}`;
  const deleted = await redisClient.del(sessionKey);

  return deleted === 1;
}

/**
 * Extends the TTL of an existing session (sliding expiry).
 * @param {string} token - The session token to refresh.
 * @returns {Promise<boolean>} True if refreshed, false if session not found.
 */
async function refreshSession(token) {
  if (!token) throw new Error("Token is required to refresh session");

  const redisClient = await getRedisClient();
  const sessionKey = `session:${token}`;
  const result = await redisClient.expire(sessionKey, SESSION_TTL);

  return result === 1;
}

/**
 * Gracefully disconnects the Redis client.
 * @returns {Promise<void>}
 */
async function disconnect() {
  if (client) {
    await client.quit();
    client = null;
  }
}

module.exports = {
  createSession,
  validateSession,
  invalidateSession,
  refreshSession,
  disconnect,
};
