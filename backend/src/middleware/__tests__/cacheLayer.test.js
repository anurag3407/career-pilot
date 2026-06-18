import assert from 'node:assert/strict';
import {
  afterEach,
  beforeEach,
  describe,
  test,
} from 'node:test';

import Redis from 'ioredis-mock';

import {
  CACHE_HEADER,
  cacheResponse,
  createCacheKey,
  invalidateCacheNamespace,
} from '../cacheLayer.js';

import {
  cacheProfileResponse,
} from '../../services/profileCache.js';

const flushAsyncWork = async () => {
  await new Promise((resolve) => {
    setImmediate(resolve);
  });

  await new Promise((resolve) => {
    setImmediate(resolve);
  });
};

const createRequest = ({
  method = 'GET',
  originalUrl = '/api/resources',
  headers = {},
  user = {
    uid: 'user-a',
  },
  params = {},
} = {}) => ({
  method,
  originalUrl,
  headers,
  user,
  params,
});

const createResponse = () => {
  const headers = new Map();

  return {
    statusCode: 200,
    body: undefined,
    jsonCallCount: 0,

    set(name, value) {
      headers.set(
        String(name).toLowerCase(),
        String(value),
      );

      return this;
    },

    setHeader(name, value) {
      headers.set(
        String(name).toLowerCase(),
        value,
      );
    },

    get(name) {
      return headers.get(
        String(name).toLowerCase(),
      );
    },

    getHeader(name) {
      return headers.get(
        String(name).toLowerCase(),
      );
    },

    status(statusCode) {
      this.statusCode = statusCode;
      return this;
    },

    json(body) {
      this.body = body;
      this.jsonCallCount += 1;
      return this;
    },
  };
};

const invokeMiddleware = async ({
  middleware,
  req,
  handler,
}) => {
  const res = createResponse();

  let nextCallCount = 0;
  let handlerCallCount = 0;
  let handlerPromise = null;

  const next = () => {
    nextCallCount += 1;
    handlerCallCount += 1;

    handlerPromise = Promise.resolve(
      handler(req, res),
    );

    return handlerPromise;
  };

  await middleware(
    req,
    res,
    next,
  );

  if (handlerPromise) {
    await handlerPromise;
  }

  await flushAsyncWork();

  return {
    res,
    nextCallCount,
    handlerCallCount,
  };
};

describe(
  'cacheLayer',
  () => {
    let redis;

beforeEach(async () => {
  redis = new Redis();

  if (
    typeof redis.unlink !==
    'function'
  ) {
    redis.unlink = (
      ...keys
    ) => redis.del(...keys);
  }

  await redis.flushall();
});

afterEach(async () => {
  try {
    await redis.flushall();
    redis.disconnect();
  } catch {
    // The mock may already be disconnected.
  }
});

    describe(
      'createCacheKey',
      () => {
        test('creates the same key for equivalent query parameter orderings', () => {
          const firstKey =
            createCacheKey({
              namespace:
                'user-profile',
              scope: 'user-a',
              req: createRequest({
                originalUrl:
                  '/api/user-profiles/me?page=2&limit=10',
              }),
            });

          const secondKey =
            createCacheKey({
              namespace:
                'user-profile',
              scope: 'user-a',
              req: createRequest({
                originalUrl:
                  '/api/user-profiles/me?limit=10&page=2',
              }),
            });

          assert.equal(
            firstKey,
            secondKey,
          );
        });

        test('isolates keys by scope, namespace, and route path', () => {
          const baseRequest =
            createRequest({
              originalUrl:
                '/api/user-profiles/me',
            });

          const firstKey =
            createCacheKey({
              namespace:
                'user-profile',
              scope: 'user-a',
              req: baseRequest,
            });

          const differentScopeKey =
            createCacheKey({
              namespace:
                'user-profile',
              scope: 'user-b',
              req: baseRequest,
            });

          const differentNamespaceKey =
            createCacheKey({
              namespace:
                'account-settings',
              scope: 'user-a',
              req: baseRequest,
            });

          const differentPathKey =
            createCacheKey({
              namespace:
                'user-profile',
              scope: 'user-a',
              req: createRequest({
                originalUrl:
                  '/api/user-profiles/user-a',
              }),
            });

          assert.notEqual(
            firstKey,
            differentScopeKey,
          );

          assert.notEqual(
            firstKey,
            differentNamespaceKey,
          );

          assert.notEqual(
            firstKey,
            differentPathKey,
          );

          assert.ok(
            firstKey.length <= 180,
            `expected a bounded key, received ${firstKey.length} characters`,
          );

          assert.equal(
            firstKey.includes(
              'user-a',
            ),
            false,
          );
        });

        test('rejects invalid namespaces and middleware options', () => {
          assert.throws(
            () =>
              createCacheKey({
                namespace: '',
                scope: 'user-a',
                req: createRequest(),
              }),
            TypeError,
          );

          assert.throws(
            () =>
              createCacheKey({
                namespace:
                  'invalid namespace',
                scope: 'user-a',
                req: createRequest(),
              }),
            TypeError,
          );

          assert.throws(
            () =>
              createCacheKey({
                namespace:
                  'valid-namespace',
                scope: '',
                req: createRequest(),
              }),
            TypeError,
          );

          assert.throws(
            () =>
              cacheResponse({
                namespace:
                  'user-profile',
                ttlSeconds: 0,
                scopeBuilder:
                  () => 'user-a',
              }),
            RangeError,
          );

          assert.throws(
            () =>
              cacheResponse({
                namespace:
                  'user-profile',
                ttlSeconds: 86401,
                scopeBuilder:
                  () => 'user-a',
              }),
            RangeError,
          );

          assert.throws(
            () =>
              cacheResponse({
                namespace:
                  'user-profile',
                ttlSeconds: 60,
              }),
            TypeError,
          );
        });
      },
    );

    describe(
      'cache hits and misses',
      () => {
        test('stores a successful miss and serves the next request from Redis', async () => {
          const req =
            createRequest({
              originalUrl:
                '/api/user-profiles/me',
            });

          const middleware =
            cacheResponse({
              namespace:
                'user-profile',
              ttlSeconds: 60,
              scopeBuilder:
                (request) =>
                  request.user.uid,
              clientProvider:
                () => redis,
            });

          let routeHandlerCalls = 0;

          const handler = (
            request,
            res,
          ) => {
            routeHandlerCalls += 1;

            return res.json({
              success: true,
              uid:
                request.user.uid,
            });
          };

          const firstResult =
            await invokeMiddleware({
              middleware,
              req,
              handler,
            });

          assert.equal(
            firstResult.res.get(
              CACHE_HEADER,
            ),
            'MISS',
          );

          assert.equal(
            routeHandlerCalls,
            1,
          );

          const key =
            createCacheKey({
              namespace:
                'user-profile',
              scope: 'user-a',
              req,
            });

          const ttl =
            await redis.ttl(key);

          assert.ok(
            ttl > 0 && ttl <= 60,
            `expected a Redis TTL between 1 and 60, received ${ttl}`,
          );

          const secondResult =
            await invokeMiddleware({
              middleware,
              req,
              handler,
            });

          assert.equal(
            secondResult.res.get(
              CACHE_HEADER,
            ),
            'HIT',
          );

          assert.equal(
            secondResult.nextCallCount,
            0,
          );

          assert.equal(
            routeHandlerCalls,
            1,
          );

          assert.deepEqual(
            secondResult.res.body,
            {
              success: true,
              uid: 'user-a',
            },
          );

          assert.equal(
            secondResult.res.statusCode,
            200,
          );

          assert.equal(
            secondResult.res.get(
              'Age',
            ),
            '0',
          );
        });

        test('restores the cached success status and body', async () => {
          const req =
            createRequest({
              originalUrl:
                '/api/resources/created',
            });

          const middleware =
            cacheResponse({
              namespace:
                'resource',
              ttlSeconds: 60,
              scopeBuilder:
                () => 'user-a',
              clientProvider:
                () => redis,
            });

          const handler = (
            request,
            res,
          ) =>
            res
              .status(201)
              .json({
                success: true,
                id: 'resource-1',
              });

          await invokeMiddleware({
            middleware,
            req,
            handler,
          });

          const result =
            await invokeMiddleware({
              middleware,
              req,
              handler: () => {
                throw new Error(
                  'handler must not execute on a cache hit',
                );
              },
            });

          assert.equal(
            result.res.statusCode,
            201,
          );

          assert.deepEqual(
            result.res.body,
            {
              success: true,
              id: 'resource-1',
            },
          );

          assert.equal(
            result.res.get(
              CACHE_HEADER,
            ),
            'HIT',
          );
        });
      },
    );

    describe(
      'fail-open behavior',
      () => {
        test('bypasses caching when no Redis client is available', async () => {
          const middleware =
            cacheResponse({
              namespace:
                'resource',
              scopeBuilder:
                () => 'user-a',
              clientProvider:
                () => null,
            });

          const result =
            await invokeMiddleware({
              middleware,
              req:
                createRequest(),
              handler: (
                request,
                res,
              ) =>
                res.json({
                  success: true,
                }),
            });

          assert.equal(
            result.res.get(
              CACHE_HEADER,
            ),
            'BYPASS',
          );

          assert.equal(
            result.handlerCallCount,
            1,
          );

          assert.deepEqual(
            result.res.body,
            {
              success: true,
            },
          );
        });

        test('continues to the route handler when Redis GET fails', async () => {
          const failingClient = {
            async get() {
              throw new Error(
                'Redis unavailable',
              );
            },
          };

          const middleware =
            cacheResponse({
              namespace:
                'resource',
              scopeBuilder:
                () => 'user-a',
              clientProvider:
                () => failingClient,
            });

          const result =
            await invokeMiddleware({
              middleware,
              req:
                createRequest(),
              handler: (
                request,
                res,
              ) =>
                res.json({
                  success: true,
                }),
            });

          assert.equal(
            result.res.get(
              CACHE_HEADER,
            ),
            'BYPASS',
          );

          assert.equal(
            result.handlerCallCount,
            1,
          );
        });

        test('returns the response when Redis SET fails', async () => {
          const failingClient = {
            async get() {
              return null;
            },

            async set() {
              throw new Error(
                'Redis write failed',
              );
            },
          };

          const middleware =
            cacheResponse({
              namespace:
                'resource',
              scopeBuilder:
                () => 'user-a',
              clientProvider:
                () => failingClient,
            });

          const result =
            await invokeMiddleware({
              middleware,
              req:
                createRequest(),
              handler: (
                request,
                res,
              ) =>
                res.json({
                  success: true,
                }),
            });

          assert.equal(
            result.res.get(
              CACHE_HEADER,
            ),
            'MISS',
          );

          assert.deepEqual(
            result.res.body,
            {
              success: true,
            },
          );
        });

        test('deletes malformed cached JSON and continues normally', async () => {
          const req =
            createRequest({
              originalUrl:
                '/api/resources/corrupt',
            });

          const key =
            createCacheKey({
              namespace:
                'resource',
              scope: 'user-a',
              req,
            });

          await redis.set(
            key,
            '{invalid-json',
          );

          const middleware =
            cacheResponse({
              namespace:
                'resource',
              scopeBuilder:
                () => 'user-a',
              clientProvider:
                () => redis,
            });

          const result =
            await invokeMiddleware({
              middleware,
              req,
              handler: (
                request,
                res,
              ) =>
                res
                  .status(500)
                  .json({
                    success: false,
                  }),
            });

          assert.equal(
            result.res.get(
              CACHE_HEADER,
            ),
            'MISS',
          );

          assert.equal(
            await redis.get(key),
            null,
          );
        });
      },
    );

    describe(
      'cache safety rules',
      () => {
        test('does not cache unsuccessful responses', async () => {
          for (
            const statusCode
            of [404, 500]
          ) {
            const req =
              createRequest({
                originalUrl:
                  `/api/resources/status-${statusCode}`,
              });

            const middleware =
              cacheResponse({
                namespace:
                  'resource',
                scopeBuilder:
                  () => 'user-a',
                clientProvider:
                  () => redis,
              });

            await invokeMiddleware({
              middleware,
              req,
              handler: (
                request,
                res,
              ) =>
                res
                  .status(
                    statusCode,
                  )
                  .json({
                    success: false,
                  }),
            });

            const key =
              createCacheKey({
                namespace:
                  'resource',
                scope: 'user-a',
                req,
              });

            assert.equal(
              await redis.get(key),
              null,
            );
          }
        });

        test('bypasses profile caching when ignored query parameters are present', async () => {
  const req = createRequest({
    originalUrl:
      '/api/user-profiles/me?unused=value',
  });

  req.query = {
    unused: 'value',
  };

  const res = createResponse();

  let nextCallCount = 0;

  await cacheProfileResponse(
    req,
    res,
    () => {
      nextCallCount += 1;
    },
  );

  assert.equal(
    res.get(CACHE_HEADER),
    'BYPASS',
  );

  assert.equal(
    nextCallCount,
    1,
  );
});

        test('honors explicit client cache bypass headers', async () => {
          const req =
            createRequest({
              originalUrl:
                '/api/resources/no-cache',
              headers: {
                'cache-control':
                  'no-cache',
              },
            });

          const middleware =
            cacheResponse({
              namespace:
                'resource',
              scopeBuilder:
                () => 'user-a',
              clientProvider:
                () => redis,
            });

          let handlerCalls = 0;

          const handler = (
            request,
            res,
          ) => {
            handlerCalls += 1;

            return res.json({
              success: true,
            });
          };

          const firstResult =
            await invokeMiddleware({
              middleware,
              req,
              handler,
            });

          const secondResult =
            await invokeMiddleware({
              middleware,
              req,
              handler,
            });

          assert.equal(
            firstResult.res.get(
              CACHE_HEADER,
            ),
            'BYPASS',
          );

          assert.equal(
            secondResult.res.get(
              CACHE_HEADER,
            ),
            'BYPASS',
          );

          assert.equal(
            handlerCalls,
            2,
          );
        });

        test('returns non-serializable bodies without caching them', async () => {
          const req =
            createRequest({
              originalUrl:
                '/api/resources/bigint',
            });

          const middleware =
            cacheResponse({
              namespace:
                'resource',
              scopeBuilder:
                () => 'user-a',
              clientProvider:
                () => redis,
            });

          const result =
            await invokeMiddleware({
              middleware,
              req,
              handler: (
                request,
                res,
              ) =>
                res.json({
                  value: 1n,
                }),
            });

          assert.equal(
            result.res.body.value,
            1n,
          );

          const key =
            createCacheKey({
              namespace:
                'resource',
              scope: 'user-a',
              req,
            });

          assert.equal(
            await redis.get(key),
            null,
          );
        });

        test('does not cache responses that set cookies or private cache control', async () => {
          const cases = [
            {
              path:
                '/api/resources/cookie',
              configureResponse:
                (res) => {
                  res.setHeader(
                    'Set-Cookie',
                    'session=secret',
                  );
                },
            },
            {
              path:
                '/api/resources/private',
              configureResponse:
                (res) => {
                  res.setHeader(
                    'Cache-Control',
                    'private, max-age=60',
                  );
                },
            },
          ];

          for (const cacheCase of cases) {
            const req =
              createRequest({
                originalUrl:
                  cacheCase.path,
              });

            const middleware =
              cacheResponse({
                namespace:
                  'resource',
                scopeBuilder:
                  () => 'user-a',
                clientProvider:
                  () => redis,
              });

            await invokeMiddleware({
              middleware,
              req,
              handler: (
                request,
                res,
              ) => {
                cacheCase
                  .configureResponse(
                    res,
                  );

                return res.json({
                  success: true,
                });
              },
            });

            const key =
              createCacheKey({
                namespace:
                  'resource',
                scope: 'user-a',
                req,
              });

            assert.equal(
              await redis.get(key),
              null,
            );
          }
        });

        test('bypasses non-cacheable HTTP methods', async () => {
          const middleware =
            cacheResponse({
              namespace:
                'resource',
              scopeBuilder:
                () => 'user-a',
              clientProvider:
                () => redis,
            });

          const result =
            await invokeMiddleware({
              middleware,
              req:
                createRequest({
                  method: 'POST',
                }),
              handler: (
                request,
                res,
              ) =>
                res.json({
                  success: true,
                }),
            });

          assert.equal(
            result.res.get(
              CACHE_HEADER,
            ),
            'BYPASS',
          );

          assert.equal(
            result.handlerCallCount,
            1,
          );
        });
      },
    );

    describe(
      'authenticated scope isolation',
      () => {
        test('does not share cached profile data between users', async () => {
          const middleware =
            cacheResponse({
              namespace:
                'user-profile',
              ttlSeconds: 60,
              scopeBuilder:
                (request) =>
                  request.user.uid,
              clientProvider:
                () => redis,
            });

          let handlerCalls = 0;

          const handler = (
            request,
            res,
          ) => {
            handlerCalls += 1;

            return res.json({
              uid:
                request.user.uid,
            });
          };

          const userARequest =
            createRequest({
              originalUrl:
                '/api/user-profiles/me',
              user: {
                uid: 'user-a',
              },
            });

          const userBRequest =
            createRequest({
              originalUrl:
                '/api/user-profiles/me',
              user: {
                uid: 'user-b',
              },
            });

          const userAFirst =
            await invokeMiddleware({
              middleware,
              req:
                userARequest,
              handler,
            });

          const userBFirst =
            await invokeMiddleware({
              middleware,
              req:
                userBRequest,
              handler,
            });

          const userASecond =
            await invokeMiddleware({
              middleware,
              req:
                userARequest,
              handler,
            });

          const userBSecond =
            await invokeMiddleware({
              middleware,
              req:
                userBRequest,
              handler,
            });

          assert.equal(
            userAFirst.res.get(
              CACHE_HEADER,
            ),
            'MISS',
          );

          assert.equal(
            userBFirst.res.get(
              CACHE_HEADER,
            ),
            'MISS',
          );

          assert.equal(
            userASecond.res.get(
              CACHE_HEADER,
            ),
            'HIT',
          );

          assert.equal(
            userBSecond.res.get(
              CACHE_HEADER,
            ),
            'HIT',
          );

          assert.deepEqual(
            userASecond.res.body,
            {
              uid: 'user-a',
            },
          );

          assert.deepEqual(
            userBSecond.res.body,
            {
              uid: 'user-b',
            },
          );

          assert.equal(
            handlerCalls,
            2,
          );
        });
      },
    );

    describe(
      'namespace invalidation',
      () => {
        test('invalidates only the requested namespace and scope', async () => {
          const userAFirstRequest =
            createRequest({
              originalUrl:
                '/api/user-profiles/me',
            });

          const userASecondRequest =
            createRequest({
              originalUrl:
                '/api/user-profiles/user-a',
            });

          const userBRequest =
            createRequest({
              originalUrl:
                '/api/user-profiles/me',
              user: {
                uid: 'user-b',
              },
            });

          const keys = {
            userAFirst:
              createCacheKey({
                namespace:
                  'user-profile',
                scope: 'user-a',
                req:
                  userAFirstRequest,
              }),

            userASecond:
              createCacheKey({
                namespace:
                  'user-profile',
                scope: 'user-a',
                req:
                  userASecondRequest,
              }),

            userB:
              createCacheKey({
                namespace:
                  'user-profile',
                scope: 'user-b',
                req:
                  userBRequest,
              }),

            otherNamespace:
              createCacheKey({
                namespace:
                  'account-settings',
                scope: 'user-a',
                req:
                  userAFirstRequest,
              }),
          };

          await redis.mset(
            keys.userAFirst,
            'first',
            keys.userASecond,
            'second',
            keys.userB,
            'third',
            keys.otherNamespace,
            'fourth',
          );

          const result =
            await invalidateCacheNamespace({
              namespace:
                'user-profile',
              scope: 'user-a',
              clientProvider:
                () => redis,
            });

          assert.deepEqual(
            result,
            {
              deletedCount: 2,
              bypassed: false,
            },
          );

          assert.equal(
            await redis.get(
              keys.userAFirst,
            ),
            null,
          );

          assert.equal(
            await redis.get(
              keys.userASecond,
            ),
            null,
          );

          assert.equal(
            await redis.get(
              keys.userB,
            ),
            'third',
          );

          assert.equal(
            await redis.get(
              keys.otherNamespace,
            ),
            'fourth',
          );
        });

        test('handles multiple SCAN pages and uses UNLINK', async () => {
          const scanCalls = [];
          const unlinkCalls = [];

          const client = {
            async scan(
              cursor,
              ...argumentsList
            ) {
              scanCalls.push({
                cursor,
                argumentsList,
              });

              if (cursor === '0') {
                return [
                  '7',
                  [
                    'cache-key-1',
                    'cache-key-2',
                  ],
                ];
              }

              return [
                '0',
                [
                  'cache-key-3',
                ],
              ];
            },

            async unlink(
              ...keys
            ) {
              unlinkCalls.push(keys);
              return keys.length;
            },

            async del() {
              throw new Error(
                'DEL must not be used when UNLINK is available',
              );
            },
          };

          const result =
            await invalidateCacheNamespace({
              namespace:
                'user-profile',
              scope: 'user-a',
              clientProvider:
                () => client,
            });

          assert.deepEqual(
            result,
            {
              deletedCount: 3,
              bypassed: false,
            },
          );

          assert.equal(
            scanCalls.length,
            2,
          );

          assert.deepEqual(
            unlinkCalls,
            [
              [
                'cache-key-1',
                'cache-key-2',
              ],
              [
                'cache-key-3',
              ],
            ],
          );

          assert.ok(
            scanCalls[0]
              .argumentsList
              .includes('MATCH'),
          );

          assert.ok(
            scanCalls[0]
              .argumentsList
              .includes('COUNT'),
          );
        });

        test('fails open when invalidation Redis access fails', async () => {
          const unavailableResult =
            await invalidateCacheNamespace({
              namespace:
                'user-profile',
              scope: 'user-a',
              clientProvider:
                () => null,
            });

          assert.deepEqual(
            unavailableResult,
            {
              deletedCount: 0,
              bypassed: true,
            },
          );

          const failingResult =
            await invalidateCacheNamespace({
              namespace:
                'user-profile',
              scope: 'user-a',
              clientProvider:
                () => ({
                  async scan() {
                    throw new Error(
                      'Redis scan failed',
                    );
                  },
                }),
            });

          assert.deepEqual(
            failingResult,
            {
              deletedCount: 0,
              bypassed: true,
            },
          );
        });
      },
    );

    describe(
      'performance characteristics',
      () => {
        test('serves repeated requests without rerunning the route handler', async () => {
          const middleware =
            cacheResponse({
              namespace:
                'performance',
              ttlSeconds: 60,
              scopeBuilder:
                () => 'user-a',
              clientProvider:
                () => redis,
            });

          const req =
            createRequest({
              originalUrl:
                '/api/resources/repeated',
            });

          let handlerCalls = 0;
          let cacheHits = 0;
          let cacheMisses = 0;

          const handler = (
            request,
            res,
          ) => {
            handlerCalls += 1;

            return res.json({
              success: true,
              execution:
                handlerCalls,
            });
          };

          for (
            let index = 0;
            index < 100;
            index += 1
          ) {
            const result =
              await invokeMiddleware({
                middleware,
                req,
                handler,
              });

            const cacheStatus =
              result.res.get(
                CACHE_HEADER,
              );

            if (
              cacheStatus === 'HIT'
            ) {
              cacheHits += 1;
            }

            if (
              cacheStatus === 'MISS'
            ) {
              cacheMisses += 1;
            }
          }

          assert.equal(
            handlerCalls,
            1,
          );

          assert.equal(
            cacheMisses,
            1,
          );

          assert.equal(
            cacheHits,
            99,
          );
        });
      },
    );
  },
);