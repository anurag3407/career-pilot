/**
 * Build a startup configuration summary that is safe to log.
 *
 * Server startup logs are useful for confirming which integrations are wired
 * up, but printing raw environment values risks leaking secrets (API keys,
 * database URLs, JWT secrets) into log aggregators, CI output, or Swagger
 * docs. This helper reports only whether each non-sensitive configuration key
 * is present, never its value, and omits sensitive keys entirely.
 */

// Keys whose values must never appear in logs.
export const SENSITIVE_KEYS = [
  'GEMINI_API_KEY',
  'OPENAI_API_KEY',
  'GROQ_API_KEY',
  'OPENROUTER_API_KEY',
  'REQUESTY_API_KEY',
  'DATABASE_URL',
  'MONGODB_URI',
  'JWT_SECRET',
  'EMAIL_PASS',
  'EMAIL_API_KEY',
  'REDIS_URL',
];

// Substrings that mark a key as sensitive even if not explicitly listed above.
const SENSITIVE_PATTERNS = ['KEY', 'SECRET', 'PASS', 'TOKEN', 'URI', 'DSN'];

/**
 * Return true when a key should never have its value logged.
 *
 * @param {string} key Environment variable name.
 * @returns {boolean}
 */
export function isSensitiveKey(key) {
  if (SENSITIVE_KEYS.includes(key)) {
    return true;
  }
  const upper = key.toUpperCase();
  return SENSITIVE_PATTERNS.some((pattern) => upper.includes(pattern));
}

/**
 * Produce a presence-only summary of the relevant configuration keys.
 *
 * For each requested key the result records "configured" or "missing" rather
 * than the underlying value. Sensitive keys are still reduced to presence only,
 * so no secret material is ever returned.
 *
 * @param {NodeJS.ProcessEnv} env Environment to read from.
 * @param {string[]} keys Keys to include in the summary.
 * @returns {Record<string, string>}
 */
export function getSafeConfig(env = process.env, keys = []) {
  const summary = {};
  for (const key of keys) {
    const value = env[key];
    summary[key] = value ? 'configured' : 'missing';
  }
  return summary;
}

export default getSafeConfig;
