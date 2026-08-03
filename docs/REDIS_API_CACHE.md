# Redis API Response Cache

## Overview

Career Pilot uses a reusable Redis-backed Express middleware to cache selected read-only API responses.

The caching layer reduces repeated database and external-service work while preserving authenticated-user isolation, safe failure handling, and predictable invalidation.

The core middleware is implemented in:

```text
backend/src/middleware/cacheLayer.js
```

Profile-specific cache configuration is implemented in:

```text
backend/src/services/profileCache.js
```

Focused tests are located at:

```text
backend/src/middleware/__tests__/cacheLayer.test.js
```

The cache is integrated with profile-related operations in:

```text
backend/src/routes/userProfile.js
backend/src/routes/portfolio.js
backend/src/routes/gdpr.js
```

## Goals

The caching layer is designed to provide:

* Deterministic request cache keys
* Isolation between authenticated users
* Configurable time-to-live values
* Cache hit, miss, and bypass visibility
* Graceful operation when Redis is unavailable
* Safe handling of malformed cache entries
* Namespace- and user-scoped invalidation
* Bounded Redis key lengths
* Non-blocking cache persistence
* Efficient invalidation without Redis `KEYS`
* Protection against unnecessary cache variants

## Architecture

The middleware uses the repository-managed Redis infrastructure from:

```text
backend/src/config/redis.js
```

The Redis manager is imported lazily. Tests that inject `ioredis-mock` therefore do not initialize the real Redis configuration or start `redis-memory-server`.

The request flow is:

```text
Authenticated request
        ↓
Generate deterministic scoped cache key
        ↓
Read Redis
   ┌────┴────┐
Cache hit   Cache miss
    ↓           ↓
Return body   Run route handler
                ↓
          Cache eligible JSON response
```

Redis failures are fail-open. The underlying API handler continues to run whenever Redis is unavailable or returns an error.

## Public API

### `cacheResponse`

Creates reusable Express response-caching middleware.

```js
import {
  cacheResponse,
} from '../middleware/cacheLayer.js';

const resourceCache = cacheResponse({
  namespace: 'resource',
  ttlSeconds: 60,
  scopeBuilder: (req) => req.user.uid,
});
```

Supported options:

* `namespace`: required cache namespace
* `ttlSeconds`: cache lifetime from 1 to 86,400 seconds
* `scopeBuilder`: function that returns the cache-isolation scope
* `clientProvider`: optional Redis client provider used for dependency injection

### `createCacheKey`

Creates a deterministic and bounded Redis key.

```js
const key = createCacheKey({
  namespace: 'user-profile',
  scope: req.user.uid,
  req,
});
```

### `invalidateCacheNamespace`

Removes all entries belonging to one namespace and scope.

```js
await invalidateCacheNamespace({
  namespace: 'user-profile',
  scope: req.user.uid,
});
```

The function returns:

```js
{
  deletedCount: 0,
  bypassed: false,
}
```

When Redis is unavailable or invalidation fails:

```js
{
  deletedCount: 0,
  bypassed: true,
}
```

### Profile cache helpers

Profile-specific cache behavior is centralized in:

```text
backend/src/services/profileCache.js
```

The service exports:

```js
import {
  cacheProfileResponse,
  invalidateProfileCache,
} from '../services/profileCache.js';
```

`cacheProfileResponse` applies the shared profile-cache namespace, TTL, scope rules, and query-parameter bypass behavior.

`invalidateProfileCache` removes every cached profile representation associated with a specific UID.

## Cache Key Design

Keys use the following structure:

```text
api-cache:v1:<namespace>:<scope-digest>:<request-digest>
```

The request digest is derived from:

* HTTP method
* Normalized request path
* Deterministically sorted query parameters

For example, these requests generate the same key:

```text
/api/resources?page=2&limit=10
/api/resources?limit=10&page=2
```

The scope and request fingerprint are hashed with SHA-256.

This provides:

* Bounded Redis key lengths
* Protection from wildcard characters in user identifiers
* No raw authentication tokens in keys
* No raw user identifiers in keys
* Stable keys for logically equivalent requests

Authorization headers, cookies, access tokens, and refresh tokens are never used directly in Redis cache keys.

## Supported Requests

The generic middleware considers only:

```text
GET
HEAD
```

Other HTTP methods bypass caching automatically.

Requests also bypass the cache when they contain:

```text
Cache-Control: no-cache
Cache-Control: no-store
Pragma: no-cache
```

## Response Headers

The middleware exposes cache behavior through the `X-Cache` response header.

### Cache miss

```text
X-Cache: MISS
```

The route handler executes and an eligible response is stored.

### Cache hit

```text
X-Cache: HIT
Age: <seconds>
```

The cached status code and body are returned without executing the route handler.

### Cache bypass

```text
X-Cache: BYPASS
```

A bypass occurs when:

* Redis is unavailable
* Redis reads fail
* The request method is not cacheable
* The request explicitly disables caching
* Scope or key generation fails
* A profile request contains unused query parameters

## Cacheable Responses

A response is cached only when all of these conditions are met:

* The HTTP status code is between 200 and 299
* The body can be serialized as JSON
* The response does not contain `Set-Cookie`
* The response does not use `Cache-Control: private`
* The response does not use `Cache-Control: no-store`

The following responses are not cached:

* Client-error responses
* Server-error responses
* Redirect responses
* Cookie-setting responses
* Private responses
* Non-serializable responses

A response is still returned normally when serialization or Redis persistence fails.

## Fail-Open Behavior

Redis is treated as an optional performance layer rather than a requirement for API correctness.

The middleware continues to the underlying handler when:

* No Redis connection is configured
* The Redis connection is not ready
* Redis `GET` fails
* Key generation fails
* Scope generation fails

Redis `SET` failures do not affect successful API responses.

Invalidation failures do not cause ordinary profile updates, avatar operations, portfolio restoration, or account-deletion database operations to fail.

## Corrupted Entry Recovery

Cached values use an envelope:

```js
{
  statusCode: 200,
  body: {},
  cachedAt: Date.now(),
}
```

When a cached value contains malformed JSON or an invalid envelope:

1. The entry is removed using `UNLINK` when available.
2. The request continues as a cache miss.
3. The route handler regenerates the response.
4. A valid response may replace the corrupted entry.

## Namespace Invalidation

Invalidation uses:

```text
SCAN
UNLINK
```

It does not use:

```text
KEYS
```

`KEYS` can block Redis while scanning a large keyspace. Incremental `SCAN` keeps invalidation suitable for production workloads.

When `UNLINK` is unavailable, the implementation can fall back to `DEL`.

Only keys matching the requested namespace and hashed scope are removed.

For example, invalidating:

```text
namespace: user-profile
scope: user-a
```

does not remove:

* `user-profile` entries for `user-b`
* Entries from another namespace
* Unrelated Redis data

## User Profile Integration

Caching is applied to:

```text
GET /api/user-profiles/me
GET /api/user-profiles/:uid
```

Profile cache entries use:

```text
namespace: user-profile
TTL: 120 seconds
scope: requested profile UID
```

Profile read routes bypass caching when query parameters are present because the handlers do not consume query parameters.

For example:

```text
GET /api/user-profiles/me?unused=value
```

returns:

```text
X-Cache: BYPASS
```

and does not create a Redis entry.

This prevents arbitrary query strings from creating multiple equivalent cache entries for the same profile.

The following operations invalidate the affected profile scope after the database operation succeeds:

```text
PUT /api/user-profiles/me
POST /api/user-profiles/me/avatar
DELETE /api/user-profiles/me/avatar
POST /api/portfolio/:id/restore/:versionId
DELETE /api/gdpr/delete
```

### Direct profile updates

The primary profile mutation routes invalidate cached profile representations after successfully writing to MongoDB.

This ensures that subsequent requests to both:

```text
GET /api/user-profiles/me
GET /api/user-profiles/:uid
```

receive the updated data.

### Portfolio restoration

Portfolio restoration may update `UserProfile` data outside the primary profile routes.

After the restoration operation successfully updates the profile, the restored user’s UID-scoped profile cache is invalidated.

This prevents stale restored profile data from remaining available for the duration of the cache TTL.

### GDPR account deletion

The GDPR deletion flow removes the user’s profile and associated records.

After the database deletions complete, the deleted user’s profile-cache scope is invalidated before the success response is returned.

This prevents deleted profile data from remaining accessible through cached `/me` or `/:uid` responses.

Statistics and activity-feed endpoints are intentionally not cached because their underlying data is modified by other modules and would require broader invalidation coordination.

## Security Considerations

Authenticated responses must always use a user-specific or resource-specific scope.

Never cache authenticated data under a shared public scope.

Never include these values directly in a Redis key:

* Authorization headers
* Session cookies
* Access tokens
* Refresh tokens
* Passwords
* Other secrets

The middleware hashes scopes before adding them to cache keys.

Responses that set cookies or mark themselves private are not cached.

Profile requests with unused query parameters bypass caching to prevent unbounded creation of equivalent cache entries.

GDPR deletion explicitly invalidates cached profile data after account records are removed.

## Performance Characteristics

The middleware improves repeated-request performance by allowing cache hits to skip the route handler entirely.

The performance regression test performs 100 equivalent requests and verifies:

```text
1 route-handler execution
1 cache miss
99 cache hits
```

The implementation also uses:

* Constant-length request hashes
* Bounded Redis key sizes
* Background cache writes
* Incremental `SCAN`
* Non-blocking `UNLINK`
* Shared repository-managed Redis connections
* Route-specific cache bypass rules
* Scoped invalidation instead of clearing unrelated keys

## Adding Caching to Another Route

```js
import {
  cacheResponse,
} from '../middleware/cacheLayer.js';

const resourceCache = cacheResponse({
  namespace: 'resource',
  ttlSeconds: 60,
  scopeBuilder: (req) => req.user.uid,
});

router.get(
  '/resource',
  verifyToken,
  resourceCache,
  resourceHandler,
);
```

After a successful write:

```js
await invalidateCacheNamespace({
  namespace: 'resource',
  scope: req.user.uid,
});
```

Invalidate only after the corresponding database operation succeeds.

For profile data, use the centralized helper instead:

```js
import {
  invalidateProfileCache,
} from '../services/profileCache.js';

await invalidateProfileCache(uid);
```

## Testing

Run all commands in this section from the `backend` directory.

### Focused cache suite

```bash
node --test src/middleware/__tests__/cacheLayer.test.js
```

The focused suite covers:

* Deterministic query ordering
* Namespace, route, and user isolation
* Bounded cache keys
* Invalid option rejection
* Cache hits and misses
* Status-code and body restoration
* Redis read and write failures
* Malformed cache recovery
* Client cache-bypass headers
* Profile query-parameter bypass behavior
* Non-cacheable methods
* Error-response exclusion
* Cookie and private-response exclusion
* Non-serializable response handling
* Authenticated-user isolation
* Scoped invalidation
* Multi-page Redis scanning
* `UNLINK` usage
* Invalidation failures
* Repeated-request handler bypass

### Complete backend suite

```bash
npm test
```

### Targeted lint validation

```powershell
.\node_modules\.bin\eslint.cmd --quiet `
  src\middleware\cacheLayer.js `
  src\middleware\__tests__\cacheLayer.test.js `
  src\services\profileCache.js `
  src\routes\userProfile.js `
  src\routes\portfolio.js `
  src\routes\gdpr.js
```

### Syntax validation

```bash
node --check src/middleware/cacheLayer.js
node --check src/middleware/__tests__/cacheLayer.test.js
node --check src/services/profileCache.js
node --check src/routes/userProfile.js
node --check src/routes/portfolio.js
node --check src/routes/gdpr.js
```
