import crypto from 'crypto';

const DEFAULT_COOLDOWN_MS = 60_000;
const DEFAULT_MAX_RETRIES = 3;

// HTTP status codes and error message patterns that warrant trying a different key
const ROTATION_STATUS_CODES = new Set([401, 403, 429]);
const ROTATION_MESSAGE_PATTERNS = [
  'rate limit',
  'rate_limit',
  'quota',
  'insufficient_quota',
  'invalid api key',
  'invalid_api_key',
  'api key expired',
  'api_key_expired',
  'unauthorized',
  'forbidden',
];

/**
 * Decide whether an error should trigger key rotation.
 * Checks HTTP status codes and common error message substrings.
 */
export function shouldRotate(error) {
  if (!error) return false;
  if (ROTATION_STATUS_CODES.has(error.status) || ROTATION_STATUS_CODES.has(error.statusCode)) {
    return true;
  }
  const msg = (error.message || '').toLowerCase();
  return ROTATION_MESSAGE_PATTERNS.some((p) => msg.includes(p));
}

/**
 * Manages a pool of API keys for a single provider.
 * Keys are rotated round-robin; failed keys are sidelined for cooldownMs
 * before being retried.
 */
export class KeyRotator {
  constructor(provider, keys = [], cooldownMs = DEFAULT_COOLDOWN_MS) {
    if (!provider) throw new Error('provider is required');
    this.provider = provider;
    this.cooldownMs = cooldownMs;
    this._pool = [];
    this._index = 0;
    for (const k of keys) this.addKey(k);
  }

  addKey(key) {
    if (!key || typeof key !== 'string') return;
    if (this._pool.some((e) => e.value === key)) return;
    this._pool.push({
      value: key,
      healthy: true,
      failedAt: null,
      useCount: 0,
      failCount: 0,
    });
  }

  removeKey(key) {
    const idx = this._pool.findIndex((e) => e.value === key);
    if (idx === -1) return;
    this._pool.splice(idx, 1);
    if (this._index >= this._pool.length) this._index = 0;
  }

  _recoverExpired() {
    const now = Date.now();
    for (const entry of this._pool) {
      if (!entry.healthy && entry.failedAt !== null && now - entry.failedAt >= this.cooldownMs) {
        entry.healthy = true;
        entry.failedAt = null;
      }
    }
  }

  /**
   * Return the next healthy key using round-robin selection.
   * Throws if no healthy key is available.
   */
  getNextKey() {
    this._recoverExpired();
    const total = this._pool.length;
    if (total === 0) throw new Error(`No API keys registered for provider "${this.provider}"`);

    for (let i = 0; i < total; i++) {
      const idx = (this._index + i) % total;
      const entry = this._pool[idx];
      if (entry.healthy) {
        this._index = (idx + 1) % total;
        entry.useCount++;
        return entry.value;
      }
    }
    throw new Error(`All API keys exhausted for provider "${this.provider}" — waiting for cooldown`);
  }

  markKeyFailed(key) {
    const entry = this._pool.find((e) => e.value === key);
    if (!entry) return;
    entry.healthy = false;
    entry.failedAt = Date.now();
    entry.failCount++;
  }

  markKeyHealthy(key) {
    const entry = this._pool.find((e) => e.value === key);
    if (!entry) return;
    entry.healthy = true;
    entry.failedAt = null;
  }

  get totalCount() {
    return this._pool.length;
  }

  get healthyCount() {
    this._recoverExpired();
    return this._pool.filter((e) => e.healthy).length;
  }

  /**
   * Return status of all keys without exposing full key values.
   */
  getStatus() {
    this._recoverExpired();
    return this._pool.map((e) => ({
      keyHint: _redact(e.value),
      healthy: e.healthy,
      useCount: e.useCount,
      failCount: e.failCount,
      failedAt: e.failedAt,
    }));
  }
}

function _redact(key) {
  if (!key || key.length <= 8) return '****';
  return `${key.slice(0, 4)}...${key.slice(-4)}`;
}

// ---------------------------------------------------------------------------
// Registry: one KeyRotator per provider, shared across the process
// ---------------------------------------------------------------------------

const _registry = new Map();

/**
 * Return (or create) the KeyRotator for the given provider.
 */
export function getRotator(provider, options = {}) {
  if (!_registry.has(provider)) {
    _registry.set(provider, new KeyRotator(provider, [], options.cooldownMs));
  }
  return _registry.get(provider);
}

/**
 * Register one or more keys for a provider. Idempotent — duplicates ignored.
 */
export function registerKeys(provider, keys, options = {}) {
  const rotator = getRotator(provider, options);
  const list = Array.isArray(keys) ? keys : [keys];
  for (const k of list) rotator.addKey(k);
  return rotator;
}

/**
 * Load keys from environment variables following the naming convention:
 *   PROVIDER_API_KEY, PROVIDER_API_KEY_1, PROVIDER_API_KEY_2, ...
 *
 * Example for Gemini: GEMINI_API_KEY, GEMINI_API_KEY_1, GEMINI_API_KEY_2
 */
export function loadKeysFromEnv(provider, envPrefix = null) {
  const prefix = (envPrefix || `${provider.toUpperCase()}_API_KEY`).replace(/_+$/, '');
  const keys = [];

  // bare key: GEMINI_API_KEY
  if (process.env[prefix]) keys.push(process.env[prefix]);

  // indexed keys: GEMINI_API_KEY_1, GEMINI_API_KEY_2, ...
  for (let i = 1; ; i++) {
    const val = process.env[`${prefix}_${i}`];
    if (!val) break;
    keys.push(val);
  }

  return registerKeys(provider, keys);
}

/**
 * Remove all registered keys for a provider (useful for testing).
 */
export function clearProvider(provider) {
  _registry.delete(provider);
}

/**
 * Remove all providers from the registry (useful for testing).
 */
export function clearAllProviders() {
  _registry.clear();
}

// ---------------------------------------------------------------------------
// withRotation: wrap an API call with automatic key rotation on failure
// ---------------------------------------------------------------------------

/**
 * Execute fn(key) with automatic rotation on rotateable errors.
 *
 * @param {string} provider - provider name, used to look up the rotator
 * @param {(key: string) => Promise<any>} fn - async function that receives a key
 * @param {object} [options]
 * @param {number} [options.maxRetries] - max number of key attempts (default 3)
 * @returns {Promise<any>} result of fn
 */
export async function withRotation(provider, fn, options = {}) {
  const rotator = getRotator(provider);
  const maxRetries = options.maxRetries ?? DEFAULT_MAX_RETRIES;
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    let key;
    try {
      key = rotator.getNextKey();
    } catch (e) {
      throw lastError || e;
    }

    try {
      const result = await fn(key);
      return result;
    } catch (err) {
      lastError = err;
      if (shouldRotate(err)) {
        rotator.markKeyFailed(key);
      } else {
        throw err;
      }
    }
  }

  throw lastError;
}

/**
 * Return a summary of all registered providers and their key health.
 */
export function getSystemStatus() {
  const out = {};
  for (const [provider, rotator] of _registry.entries()) {
    out[provider] = {
      total: rotator.totalCount,
      healthy: rotator.healthyCount,
      keys: rotator.getStatus(),
    };
  }
  return out;
}

/**
 * Generate a cryptographically random API key with an optional prefix.
 * Useful for creating new keys in a rotation workflow.
 */
export function generateApiKey(prefix = 'cpk', byteLength = 24) {
  const raw = crypto.randomBytes(byteLength).toString('base64url');
  return prefix ? `${prefix}_${raw}` : raw;
}
