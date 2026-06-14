import { useCallback, useEffect, useRef } from 'react';
import { jobsApi } from '../services/api';

// Global cache to persist across component remounts
// Format: { '{"query":"...","filters":{...}}': { data, timestamp } | 'IN_FLIGHT' }
const prefetchCache = new Map();
const IN_FLIGHT = 'IN_FLIGHT';
const TTL_MS = 5 * 60 * 1000; // 5 minutes

export function usePrefetch() {
  // We use a ref to track mounted state, to avoid updating state/unhandled rejections
  // if the component unmounts, though the cache map will still persist correctly.
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const prefetchJobSearch = useCallback((query, filters = {}) => {
    const cacheKey = JSON.stringify({ query, filters });

    // Skip if already cached or in-flight
    if (prefetchCache.has(cacheKey)) {
      const cached = prefetchCache.get(cacheKey);
      // If it's cached and valid, just return the promise resolving to that data
      if (cached !== IN_FLIGHT) {
        const isExpired = Date.now() - cached.timestamp > TTL_MS;
        if (!isExpired) {
          return Promise.resolve(cached.data);
        } else {
          // If expired, we should re-fetch
          prefetchCache.delete(cacheKey);
        }
      } else {
        // If it's IN_FLIGHT, we don't start another request, but we can't easily return the promise.
        // We just return a generic resolving promise to indicate prefetch was already triggered.
        return Promise.resolve();
      }
    }

    // Mark as in-flight
    prefetchCache.set(cacheKey, IN_FLIGHT);

    // Initiate background fetch
    const promise = jobsApi.search(query, filters)
      .then(response => {
        prefetchCache.set(cacheKey, { data: response.data, timestamp: Date.now() });
        return response.data;
      })
      .catch(error => {
        // Clear cache so it can be retried later
        prefetchCache.delete(cacheKey);
        console.warn('Prefetch failed for query:', query, error);
        return null;
      });

    return promise;
  }, []);

  const getCachedJobSearch = useCallback((query, filters = {}) => {
    const cacheKey = JSON.stringify({ query, filters });
    const cached = prefetchCache.get(cacheKey);
    
    if (cached && cached !== IN_FLIGHT) {
      const isExpired = Date.now() - cached.timestamp > TTL_MS;
      if (!isExpired) {
        return cached.data;
      } else {
        prefetchCache.delete(cacheKey);
      }
    }
    return null;
  }, []);

  const clearCache = useCallback(() => {
    prefetchCache.clear();
  }, []);

  return { prefetchJobSearch, getCachedJobSearch, clearCache };
}
