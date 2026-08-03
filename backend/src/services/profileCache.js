import {
  CACHE_HEADER,
  cacheResponse,
  invalidateCacheNamespace,
} from '../middleware/cacheLayer.js';

export const PROFILE_CACHE_NAMESPACE =
  'user-profile';

export const PROFILE_CACHE_TTL_SECONDS =
  120;

const profileCache = cacheResponse({
  namespace: PROFILE_CACHE_NAMESPACE,
  ttlSeconds: PROFILE_CACHE_TTL_SECONDS,
  scopeBuilder: (req) =>
    req.params.uid ?? req.user.uid,
});

/**
 * Cache profile reads only when the route receives no query parameters.
 *
 * The profile handlers ignore req.query, so allowing query variants would
 * create multiple equivalent Redis entries for the same profile.
 */
export const cacheProfileResponse = (
  req,
  res,
  next,
) => {
  if (
    Object.keys(
      req.query ?? {},
    ).length > 0
  ) {
    res.set(
      CACHE_HEADER,
      'BYPASS',
    );

    return next();
  }

  return profileCache(
    req,
    res,
    next,
  );
};

/**
 * Invalidate every cached profile representation for a UID.
 *
 * @param {string} uid Profile UID.
 * @returns {Promise<object>} Invalidation result.
 */
export const invalidateProfileCache = (
  uid,
) =>
  invalidateCacheNamespace({
    namespace:
      PROFILE_CACHE_NAMESPACE,
    scope: uid,
  });
