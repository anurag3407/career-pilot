\# Redis API Response Cache



\## Overview



Career Pilot uses a reusable Redis-backed Express middleware to cache selected read-only API responses.



The caching layer reduces repeated database and external-service work while preserving request isolation, safe failure behavior, and predictable invalidation.



The implementation is located at:



```text

backend/src/middleware/cacheLayer.js

```



Focused tests are located at:



```text

backend/src/middleware/\_\_tests\_\_/cacheLayer.test.js

```



The first production integration is located at:



```text

backend/src/routes/userProfile.js

```



\## Goals



The caching layer is designed to provide:



\* Deterministic request cache keys

\* Isolation between authenticated users

\* Configurable time-to-live values

\* Cache hit, miss, and bypass visibility

\* Graceful operation when Redis is unavailable

\* Safe handling of malformed cache entries

\* Namespace- and user-scoped invalidation

\* Bounded key lengths

\* Non-blocking cache persistence

\* Efficient invalidation without Redis `KEYS`



\## Architecture



The middleware uses the repository-managed Redis infrastructure from:



```text

backend/src/config/redis.js

```



The Redis manager is imported lazily. Tests that inject `ioredis-mock` therefore do not initialize the real Redis configuration or start `redis-memory-server`.



The request flow is:



```text

Authenticated request

&#x20;       ↓

Generate deterministic scoped cache key

&#x20;       ↓

Read Redis

&#x20;  ┌────┴────┐

&#x20;Cache hit  Cache miss

&#x20;   ↓          ↓

Return body   Run route handler

&#x20;              ↓

&#x20;        Cache successful JSON response

```



Redis failures are fail-open. The underlying API handler continues to run whenever Redis is unavailable or returns an error.



\## Public API



\### `cacheResponse`



Creates an Express response-caching middleware.



```js

import {

&#x20; cacheResponse,

} from '../middleware/cacheLayer.js';



const profileCache = cacheResponse({

&#x20; namespace: 'user-profile',

&#x20; ttlSeconds: 120,

&#x20; scopeBuilder: (req) => req.user.uid,

});

```



Options:



\* `namespace`: required cache namespace

\* `ttlSeconds`: cache lifetime from 1 to 86,400 seconds

\* `scopeBuilder`: function that returns the isolation scope

\* `clientProvider`: optional Redis client provider used for dependency injection



\### `createCacheKey`



Creates a deterministic Redis key.



```js

const key = createCacheKey({

&#x20; namespace: 'user-profile',

&#x20; scope: req.user.uid,

&#x20; req,

});

```



\### `invalidateCacheNamespace`



Removes all entries belonging to one namespace and scope.



```js

await invalidateCacheNamespace({

&#x20; namespace: 'user-profile',

&#x20; scope: req.user.uid,

});

```



The function returns:



```js

{

&#x20; deletedCount: 0,

&#x20; bypassed: false,

}

```



When Redis is unavailable:



```js

{

&#x20; deletedCount: 0,

&#x20; bypassed: true,

}

```



\## Cache Key Design



Keys use the following structure:



```text

api-cache:v1:<namespace>:<scope-digest>:<request-digest>

```



The request digest is derived from:



\* HTTP method

\* Normalized request path

\* Deterministically sorted query parameters



For example, these requests generate the same key:



```text

/api/resources?page=2\&limit=10

/api/resources?limit=10\&page=2

```



The scope and request fingerprint are hashed with SHA-256.



This provides:



\* Bounded Redis key lengths

\* Protection from wildcard characters in user identifiers

\* No raw authentication tokens in keys

\* No raw user identifiers in keys

\* Stable keys for logically equivalent requests



Authorization headers, cookies, and access tokens are never used directly in Redis cache keys.



\## Supported Requests



The middleware considers only:



```text

GET

HEAD

```



Other methods bypass caching automatically.



Requests also bypass the cache when they contain:



```text

Cache-Control: no-cache

Cache-Control: no-store

Pragma: no-cache

```



\## Response Headers



The middleware exposes cache behavior through the `X-Cache` response header.



\### Cache miss



```text

X-Cache: MISS

```



The route handler executes and an eligible response is stored.



\### Cache hit



```text

X-Cache: HIT

Age: <seconds>

```



The cached status code and body are returned without executing the route handler.



\### Cache bypass



```text

X-Cache: BYPASS

```



A bypass occurs when:



\* Redis is unavailable

\* Redis reads fail

\* The request method is not cacheable

\* The request explicitly disables caching

\* Scope or key generation fails



\## Cacheable Responses



A response is cached only when all of these conditions are met:



\* The HTTP status code is between 200 and 299

\* The body can be serialized as JSON

\* The response does not contain `Set-Cookie`

\* The response does not use `Cache-Control: private`

\* The response does not use `Cache-Control: no-store`



The following responses are not cached:



\* Client errors

\* Server errors

\* Redirects

\* Cookie-setting responses

\* Private responses

\* Non-serializable responses



A response is still returned normally when serialization or Redis persistence fails.



\## Fail-Open Behavior



Redis is treated as an optional performance layer rather than a requirement for API correctness.



The middleware continues to the underlying handler when:



\* No Redis connection is configured

\* The Redis connection is not ready

\* Redis `GET` fails

\* Key generation fails

\* Scope generation fails



Redis `SET` failures do not affect successful API responses.



Invalidation failures do not cause profile updates or avatar operations to fail.



\## Corrupted Entry Recovery



Cached values use an envelope:



```js

{

&#x20; statusCode: 200,

&#x20; body: {},

&#x20; cachedAt: Date.now(),

}

```



When a cached value contains malformed JSON or an invalid envelope:



1\. The entry is removed using `UNLINK` when available.

2\. The request continues as a cache miss.

3\. The route handler regenerates the response.

4\. A valid response may replace the corrupted entry.



\## Namespace Invalidation



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



Only keys matching the requested namespace and hashed scope are removed.



For example, invalidating:



```text

namespace: user-profile

scope: user-a

```



does not remove:



\* `user-profile` entries for `user-b`

\* Entries from another namespace

\* Unrelated Redis data



\## User Profile Integration



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



The following mutations invalidate the affected profile scope after the database operation succeeds:



```text

PUT /api/user-profiles/me

POST /api/user-profiles/me/avatar

DELETE /api/user-profiles/me/avatar

```



Statistics and activity-feed endpoints are intentionally not cached because their underlying data is modified by other modules and would require broader invalidation coordination.



\## Security Considerations



Authenticated responses must always use a user-specific or resource-specific scope.



Never cache authenticated data under a shared public scope.



Never include these values directly in a Redis key:



\* Authorization headers

\* Session cookies

\* Access tokens

\* Refresh tokens

\* Passwords

\* Other secrets



The middleware hashes scopes before adding them to cache keys.



Responses that set cookies or mark themselves private are not cached.



\## Performance Characteristics



The middleware improves repeated-request performance by allowing cache hits to skip the route handler entirely.



The performance regression test performs 100 equivalent requests and verifies:



```text

1 route-handler execution

1 cache miss

99 cache hits

```



The implementation also uses:



\* Constant-length request hashes

\* Bounded Redis key sizes

\* Background cache writes

\* Incremental `SCAN`

\* Non-blocking `UNLINK`

\* Shared repository-managed Redis connections



\## Adding Caching to Another Route



```js

import {

&#x20; cacheResponse,

} from '../middleware/cacheLayer.js';



const resourceCache = cacheResponse({

&#x20; namespace: 'resource',

&#x20; ttlSeconds: 60,

&#x20; scopeBuilder: (req) => req.user.uid,

});



router.get(

&#x20; '/resource',

&#x20; verifyToken,

&#x20; resourceCache,

&#x20; resourceHandler,

);

```



After a successful write:



```js

await invalidateCacheNamespace({

&#x20; namespace: 'resource',

&#x20; scope: req.user.uid,

});

```



Invalidate only after the corresponding database operation succeeds.



\## Testing



Run all commands in this section from the `backend` directory.



\### Focused cache suite



```bash

node --test src/middleware/\_\_tests\_\_/cacheLayer.test.js

```



The focused suite covers:



\* Deterministic query ordering

\* Namespace, route, and user isolation

\* Bounded cache keys

\* Invalid option rejection

\* Cache hits and misses

\* Status-code and body restoration

\* Redis read and write failures

\* Malformed cache recovery

\* Client cache bypass headers

\* Non-cacheable methods

\* Error-response exclusion

\* Cookie and private-response exclusion

\* Non-serializable response handling

\* Authenticated-user isolation

\* Scoped invalidation

\* Multi-page Redis scanning

\* `UNLINK` usage

\* Invalidation failures

\* Repeated-request handler bypass



\### Complete backend suite



```bash

npm test

```



\### Targeted lint validation



```powershell

.\\node\_modules\\.bin\\eslint.cmd `

&#x20; src\\middleware\\cacheLayer.js `

&#x20; src\\middleware\\\_\_tests\_\_\\cacheLayer.test.js `

&#x20; src\\routes\\userProfile.js

```



\### Syntax validation



```bash

node --check src/middleware/cacheLayer.js

node --check src/middleware/\_\_tests\_\_/cacheLayer.test.js

node --check src/routes/userProfile.js

```
