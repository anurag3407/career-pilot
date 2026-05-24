import { useState, useEffect, useCallback, useRef } from 'react';

export function useApi(apiFn, options = {}) {
    const { immediate = true, onSuccess, onError } = options;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(immediate);
    const [error, setError] = useState(null);
    const mountedRef = useRef(true);

    const execute = useCallback(async (...args) => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiFn(...args);
            if (mountedRef.current) {
                setData(result);
                onSuccess?.(result);
            }
            return result;
        } catch (err) {
            if (mountedRef.current) {
                setError(err);
                onError?.(err);
            }
            throw err;
        } finally {
            if (mountedRef.current) setLoading(false);
        }
    }, [apiFn, onSuccess, onError]);

    useEffect(() => {
        mountedRef.current = true;
        if (immediate) execute().catch(() => { });
        return () => { mountedRef.current = false; };
    }, [immediate, execute]);

    return { data, loading, error, execute, reset: () => { setData(null); setError(null); setLoading(false); } };
}
