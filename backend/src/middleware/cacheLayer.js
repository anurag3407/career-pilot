import { createHash } from 'node:crypto';

export const CACHE_HEADER = 'X-Cache';
export const DEFAULT_CACHE_TTL_SECONDS = 60;

const CACHE_CONNECTION_NAME = 'api-cache';
const CACHE_KEY_VERSION = 'api-cache:v1';
const MAX_CACHE_TTL_SECONDS = 86400;
const MAX_NAMESPACE_LENGTH = 64;
const SCAN_COUNT = 100;

let redisManagerPromise = null;

/**
 * Load the shared Redis manager only when the default client is actually used.
 *
 * Tests that inject their own client do not initialize Redis infrastructure.
 *
 * @returns {Promise<object>} Shared Redis manager.
 */
const loadRedisManager = async () => {
  if (!redisManagerPromise) {
    redisManagerPromise =
      import('../config/redis.js')
        .then(
          ({ default: redisManager }) =>
            redisManager,
        );
  }

  return redisManagerPromise;
};

const CACHEABLE_METHODS = new Set([
  'GET',
  'HEAD',
]);

const NAMESPACE_PATTERN =
  /^[a-z0-9][a-z0-9:_-]*$/i;

/**
 * Create a SHA-256 digest.
 *
 * @param {*} value Value to hash.
 * @param {number} length Maximum digest length.
 * @returns {string} Hexadecimal digest.
 */
const hashValue = (
  value,
  length = 64,
) =>
  createHash('sha256')
    .update(String(value))
    .digest('hex')
    .slice(0, length);

/**
 * Validate and normalize a cache namespace.
 *
 * @param {*} namespace Cache namespace.
 * @returns {string} Normalized namespace.
 */
const normalizeNamespace = (namespace) => {
  if (
    typeof namespace !== 'string' ||
    !namespace.trim()
  ) {
    throw new TypeError(
      'cache namespace must be a non-empty string',
    );
  }

  const normalized =
    namespace.trim().toLowerCase();

  if (
    normalized.length >
      MAX_NAMESPACE_LENGTH ||
    !NAMESPACE_PATTERN.test(normalized)
  ) {
    throw new TypeError(
      'cache namespace may contain only letters, numbers, colons, underscores, and hyphens',
    );
  }

  return normalized;
};

/**
 * Validate a cache TTL.
 *
 * @param {*} ttlSeconds Cache lifetime in seconds.
 * @returns {number} Valid TTL.
 */
const normalizeTtl = (ttlSeconds) => {
  if (
    !Number.isInteger(ttlSeconds) ||
    ttlSeconds < 1 ||
    ttlSeconds > MAX_CACHE_TTL_SECONDS
  ) {
    throw new RangeError(
      `cache ttlSeconds must be an integer between 1 and ${MAX_CACHE_TTL_SECONDS}`,
    );
  }

  return ttlSeconds;
};

/**
 * Validate and hash a cache scope.
 *
 * Hashing prevents raw user identifiers from being stored in Redis keys and
 * ensures wildcard characters cannot affect namespace invalidation.
 *
 * @param {*} scope Cache isolation scope.
 * @returns {string} Hashed scope.
 */
const createScopeDigest = (scope) => {
  if (
    scope === null ||
    scope === undefined ||
    String(scope).trim() === ''
  ) {
    throw new TypeError(
      'cache scope must be a non-empty value',
    );
  }

  return hashValue(
    String(scope).trim(),
    24,
  );
};

/**
 * Sort query-string entries deterministically.
 *
 * @param {URLSearchParams} searchParams Query parameters.
 * @returns {string} Canonical query string.
 */
const canonicalizeSearchParams = (
  searchParams,
) =>
  [...searchParams.entries()]
    .sort(
      (
        [firstKey, firstValue],
        [secondKey, secondValue],
      ) => {
        const keyComparison =
          firstKey.localeCompare(secondKey);

        if (keyComparison !== 0) {
          return keyComparison;
        }

        return firstValue.localeCompare(
          secondValue,
        );
      },
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join('&');

/**
 * Build a stable request fingerprint.
 *
 * @param {object} req Express request-like object.
 * @returns {string} Canonical request representation.
 */
const createRequestFingerprint = (req) => {
  if (!req || typeof req !== 'object') {
    throw new TypeError(
      'cache key generation requires a request object',
    );
  }

  const method = String(
    req.method ?? 'GET',
  ).toUpperCase();

  const rawUrl =
    req.originalUrl ??
    req.url ??
    req.path ??
    '/';

  const parsedUrl = new URL(
    rawUrl,
    'http://cache.local',
  );

  let pathname =
    parsedUrl.pathname.replace(
      /\/{2,}/g,
      '/',
    );

  if (
    pathname.length > 1 &&
    pathname.endsWith('/')
  ) {
    pathname = pathname.slice(0, -1);
  }

  const query =
    canonicalizeSearchParams(
      parsedUrl.searchParams,
    );

  return `${method}|${pathname}|${query}`;
};

/**
 * Build the prefix used for scoped invalidation.
 *
 * @param {string} namespace Cache namespace.
 * @param {*} scope Cache isolation scope.
 * @returns {string} Redis key prefix.
 */
const createNamespacePrefix = (
  namespace,
  scope,
) => {
  const normalizedNamespace =
    normalizeNamespace(namespace);

  const scopeDigest =
    createScopeDigest(scope);

  return (
    `${CACHE_KEY_VERSION}:` +
    `${normalizedNamespace}:` +
    `${scopeDigest}:`
  );
};

/**
 * Create a deterministic and bounded Redis cache key.
 *
 * @param {object} options Key options.
 * @param {string} options.namespace Cache namespace.
 * @param {*} options.scope Cache isolation scope.
 * @param {object} options.req Express request-like object.
 * @returns {string} Redis cache key.
 */
export const createCacheKey = ({
  namespace,
  scope,
  req,
}) => {
  const prefix =
    createNamespacePrefix(
      namespace,
      scope,
    );

  const requestDigest = hashValue(
    createRequestFingerprint(req),
  );

  return `${prefix}${requestDigest}`;
};

/**
 * Obtain the repository-managed Redis connection.
 *
 * A connection may still be starting when the first request arrives. In that
 * case the request bypasses caching instead of waiting or failing.
 *
 * @returns {object|null} Ready Redis client or null.
 */
const getDefaultClient = async () => {
  try {
    const redisManager =
      await loadRedisManager();

    const client = redisManager.get(
      CACHE_CONNECTION_NAME,
    );

    if (
      !client ||
      client.status !== 'ready'
    ) {
      return null;
    }

    return client;
  } catch {
    return null;
  }
};

/**
 * Set a response header for Express or a response-like test object.
 *
 * @param {object} res Response object.
 * @param {string} name Header name.
 * @param {string} value Header value.
 */
const setResponseHeader = (
  res,
  name,
  value,
) => {
  if (typeof res.set === 'function') {
    res.set(name, value);
    return;
  }

  if (
    typeof res.setHeader === 'function'
  ) {
    res.setHeader(name, value);
  }
};

/**
 * Read a response header.
 *
 * @param {object} res Response object.
 * @param {string} name Header name.
 * @returns {*} Header value.
 */
const getResponseHeader = (
  res,
  name,
) => {
  if (
    typeof res.getHeader === 'function'
  ) {
    return res.getHeader(name);
  }

  if (typeof res.get === 'function') {
    return res.get(name);
  }

  return undefined;
};

/**
 * Send a cached JSON response.
 *
 * @param {object} res Express response object.
 * @param {number} statusCode HTTP status code.
 * @param {*} body Cached response body.
 * @returns {*} Express response result.
 */
const sendCachedResponse = (
  res,
  statusCode,
  body,
) => {
  if (typeof res.status === 'function') {
    res.status(statusCode);
  } else {
    res.statusCode = statusCode;
  }

  return res.json(body);
};

/**
 * Determine whether a request explicitly bypasses caching.
 *
 * @param {object} req Express request object.
 * @returns {boolean} True when caching should be bypassed.
 */
const requestBypassesCache = (req) => {
  const cacheControl = String(
    req.headers?.['cache-control'] ??
    '',
  ).toLowerCase();

  const pragma = String(
    req.headers?.pragma ?? '',
  ).toLowerCase();

  return (
    cacheControl.includes('no-cache') ||
    cacheControl.includes('no-store') ||
    pragma.includes('no-cache')
  );
};

/**
 * Determine whether response headers prohibit caching.
 *
 * @param {object} res Express response object.
 * @returns {boolean} True when response must not be cached.
 */
const responseDisallowsCache = (res) => {
  const cacheControl = String(
    getResponseHeader(
      res,
      'cache-control',
    ) ?? '',
  ).toLowerCase();

  const setCookie =
    getResponseHeader(
      res,
      'set-cookie',
    );

  return (
    Boolean(setCookie) ||
    cacheControl.includes('no-store') ||
    cacheControl.includes('private')
  );
};

/**
 * Validate a stored cache envelope.
 *
 * @param {*} entry Parsed cache value.
 * @returns {boolean} True when the entry is valid.
 */
const isValidCacheEntry = (entry) =>
  Boolean(
    entry &&
    typeof entry === 'object' &&
    Number.isInteger(entry.statusCode) &&
    entry.statusCode >= 200 &&
    entry.statusCode < 300 &&
    Number.isFinite(entry.cachedAt) &&
    Object.prototype.hasOwnProperty.call(
      entry,
      'body',
    ),
  );

/**
 * Remove Redis keys without blocking the request path.
 *
 * @param {object} client Redis client.
 * @param {string[]} keys Redis keys.
 * @returns {Promise<number>} Number of deleted keys.
 */
const unlinkKeys = async (
  client,
  keys,
) => {
  if (!keys.length) {
    return 0;
  }

  if (
    typeof client.unlink === 'function'
  ) {
    return client.unlink(...keys);
  }

  return client.del(...keys);
};

/**
 * Resolve a Redis client from a configurable provider.
 *
 * @param {Function} clientProvider Redis client provider.
 * @param {*} context Optional provider context.
 * @returns {Promise<object|null>} Redis client or null.
 */
const resolveClient = async (
  clientProvider,
  context,
) => {
  try {
    return (
      await clientProvider(context)
    ) ?? null;
  } catch {
    return null;
  }
};

/**
 * Create Redis-backed API response caching middleware.
 *
 * The middleware is fail-open: Redis failures never prevent the underlying
 * API handler from running.
 *
 * @param {object} options Middleware options.
 * @param {string} options.namespace Cache namespace.
 * @param {number} [options.ttlSeconds] Cache TTL.
 * @param {Function} options.scopeBuilder Function that returns the cache scope.
 * @param {Function} [options.clientProvider] Redis client provider.
 * @returns {Function} Express middleware.
 */
export const cacheResponse = ({
  namespace,
  ttlSeconds =
    DEFAULT_CACHE_TTL_SECONDS,
  scopeBuilder,
  clientProvider =
    getDefaultClient,
}) => {
  const normalizedNamespace =
    normalizeNamespace(namespace);

  const normalizedTtl =
    normalizeTtl(ttlSeconds);

  if (
    typeof scopeBuilder !== 'function'
  ) {
    throw new TypeError(
      'cache scopeBuilder must be a function',
    );
  }

  if (
    typeof clientProvider !== 'function'
  ) {
    throw new TypeError(
      'cache clientProvider must be a function',
    );
  }

  return async (
    req,
    res,
    next,
  ) => {
    const method = String(
      req.method ?? '',
    ).toUpperCase();

    if (
      !CACHEABLE_METHODS.has(method) ||
      requestBypassesCache(req)
    ) {
      setResponseHeader(
        res,
        CACHE_HEADER,
        'BYPASS',
      );

      next();
      return;
    }

    let scope;
    let cacheKey;

    try {
      scope = await scopeBuilder(req);

      cacheKey = createCacheKey({
        namespace:
          normalizedNamespace,
        scope,
        req,
      });
    } catch {
      setResponseHeader(
        res,
        CACHE_HEADER,
        'BYPASS',
      );

      next();
      return;
    }

    const client = await resolveClient(
      clientProvider,
      req,
    );

    if (!client) {
      setResponseHeader(
        res,
        CACHE_HEADER,
        'BYPASS',
      );

      next();
      return;
    }

    let cachedValue;

    try {
      cachedValue =
        await client.get(cacheKey);
    } catch {
      setResponseHeader(
        res,
        CACHE_HEADER,
        'BYPASS',
      );

      next();
      return;
    }

    if (cachedValue !== null) {
      try {
        const cachedEntry =
          JSON.parse(cachedValue);

        if (
          !isValidCacheEntry(
            cachedEntry,
          )
        ) {
          throw new TypeError(
            'invalid cache entry',
          );
        }

        const ageSeconds = Math.max(
          0,
          Math.floor(
            (
              Date.now() -
              cachedEntry.cachedAt
            ) / 1000,
          ),
        );

        setResponseHeader(
          res,
          CACHE_HEADER,
          'HIT',
        );

        setResponseHeader(
          res,
          'Age',
          String(ageSeconds),
        );

        sendCachedResponse(
          res,
          cachedEntry.statusCode,
          cachedEntry.body,
        );

        return;
      } catch {
        try {
          await unlinkKeys(
            client,
            [cacheKey],
          );
        } catch {
          // Corrupt cache cleanup is best effort.
        }
      }
    }

    setResponseHeader(
      res,
      CACHE_HEADER,
      'MISS',
    );

    const originalJson =
      res.json.bind(res);

    let responseHandled = false;

    res.json = (body) => {
      if (!responseHandled) {
        responseHandled = true;

        const statusCode =
          Number(res.statusCode) || 200;

        const shouldCache =
          statusCode >= 200 &&
          statusCode < 300 &&
          !responseDisallowsCache(res);

        if (shouldCache) {
          try {
            const serialized =
              JSON.stringify({
                statusCode,
                body,
                cachedAt:
                  Date.now(),
              });

            try {
              const writePromise =
                client.set(
                  cacheKey,
                  serialized,
                  'EX',
                  normalizedTtl,
                );

              Promise.resolve(
                writePromise,
              ).catch(() => {
                // Cache persistence is fail-open.
              });
            } catch {
              // Synchronous Redis failures are fail-open.
            }
          } catch {
            // Non-serializable responses are returned but not cached.
          }
        }
      }

      return originalJson(body);
    };

    next();
  };
};

/**
 * Invalidate all cached requests for one namespace and scope.
 *
 * SCAN and UNLINK are used instead of KEYS and DEL to avoid blocking Redis on
 * large keyspaces.
 *
 * @param {object} options Invalidation options.
 * @param {string} options.namespace Cache namespace.
 * @param {*} options.scope Cache isolation scope.
 * @param {Function} [options.clientProvider] Redis client provider.
 * @returns {Promise<object>} Invalidation result.
 */
export const invalidateCacheNamespace =
  async ({
    namespace,
    scope,
    clientProvider =
      getDefaultClient,
  }) => {
    const prefix =
      createNamespacePrefix(
        namespace,
        scope,
      );

    if (
      typeof clientProvider !==
      'function'
    ) {
      throw new TypeError(
        'cache clientProvider must be a function',
      );
    }

    const client =
      await resolveClient(
        clientProvider,
        {
          namespace,
          scope,
        },
      );

    if (!client) {
      return {
        deletedCount: 0,
        bypassed: true,
      };
    }

    let cursor = '0';
    let deletedCount = 0;

    try {
      do {
        const scanResult =
          await client.scan(
            cursor,
            'MATCH',
            `${prefix}*`,
            'COUNT',
            SCAN_COUNT,
          );

        const nextCursor =
          String(scanResult[0]);

        const keys =
          Array.isArray(scanResult[1])
            ? scanResult[1]
            : [];

        if (keys.length > 0) {
          const removed =
            await unlinkKeys(
              client,
              keys,
            );

          deletedCount +=
            Number(removed) || 0;
        }

        cursor = nextCursor;
      } while (cursor !== '0');

      return {
        deletedCount,
        bypassed: false,
      };
    } catch {
      return {
        deletedCount,
        bypassed: true,
      };
    }
  };