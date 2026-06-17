import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { usePrefetch } from '../usePrefetch';
import { jobsApi } from '../../services/api';

vi.mock('../../services/api', () => ({
  jobsApi: {
    search: vi.fn(),
  },
}));

describe('usePrefetch', () => {
  beforeEach(() => {
    // We can't directly clear the module-level Map without the hook's clearCache method
    // But we can mount the hook and call clearCache
    const { result } = renderHook(() => usePrefetch());
    act(() => {
      result.current.clearCache();
    });
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should fetch data when prefetchJobSearch is called', async () => {
    const mockData = { data: [{ id: 1, title: 'Engineer' }] };
    jobsApi.search.mockResolvedValue(mockData);

    const { result } = renderHook(() => usePrefetch());

    let promise;
    act(() => {
      promise = result.current.prefetchJobSearch('engineer', { jobType: 'All' });
    });

    const data = await promise;
    expect(jobsApi.search).toHaveBeenCalledWith('engineer', { jobType: 'All' });
    expect(data).toEqual(mockData.data);
  });

  it('should not fetch duplicate requests simultaneously (deduplication)', async () => {
    const mockData = { data: [{ id: 1, title: 'Engineer' }] };
    
    // Delay resolution to simulate in-flight request
    let resolveSearch;
    const searchPromise = new Promise(resolve => {
      resolveSearch = resolve;
    });
    jobsApi.search.mockReturnValue(searchPromise);

    const { result } = renderHook(() => usePrefetch());

    act(() => {
      result.current.prefetchJobSearch('react', {});
    });

    act(() => {
      result.current.prefetchJobSearch('react', {});
    });

    expect(jobsApi.search).toHaveBeenCalledTimes(1);
    
    // Resolve the mock promise
    resolveSearch(mockData);
  });

  it('should return cached data if available and fresh', async () => {
    const mockData = { data: [{ id: 1, title: 'Engineer' }] };
    jobsApi.search.mockResolvedValue(mockData);

    const { result } = renderHook(() => usePrefetch());

    let promise;
    act(() => {
      promise = result.current.prefetchJobSearch('dev', {});
    });

    await promise;

    // Now try to fetch the cached data synchronously
    let cachedData;
    act(() => {
      cachedData = result.current.getCachedJobSearch('dev', {});
    });

    expect(cachedData).toEqual(mockData.data);
  });

  it('should clear cache on error', async () => {
    jobsApi.search.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => usePrefetch());

    let promise;
    act(() => {
      promise = result.current.prefetchJobSearch('error_query', {});
    });

    const res = await promise;
    expect(res).toBeNull();

    let cachedData;
    act(() => {
      cachedData = result.current.getCachedJobSearch('error_query', {});
    });

    expect(cachedData).toBeNull(); // Cache should have been cleared
  });

  it('should expire cache after TTL (5 minutes)', async () => {
    const mockData = { data: [{ id: 1, title: 'Engineer' }] };
    jobsApi.search.mockResolvedValue(mockData);

    const { result } = renderHook(() => usePrefetch());

    let promise;
    act(() => {
      promise = result.current.prefetchJobSearch('dev', {});
    });

    await promise;

    // Advance time by 6 minutes
    act(() => {
      vi.advanceTimersByTime(6 * 60 * 1000);
    });

    let cachedData;
    act(() => {
      cachedData = result.current.getCachedJobSearch('dev', {});
    });

    // Cache should be expired and removed
    expect(cachedData).toBeNull();
  });
});
