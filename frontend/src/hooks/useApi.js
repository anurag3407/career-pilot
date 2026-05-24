import { useState, useEffect, useCallback, useRef } from 'react';

export function useApi(apiFn, options = {}) {
    const { immediate = true, onSuccess, onError } = options;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(immediate);
    const [error, setError] = useState(null);
    const mountedRef = useRef(true);

    const apiFnRef = useRef(apiFn);
    const onSuccessRef = useRef(onSuccess);
    const onErrorRef = useRef(onError);

    useEffect(() => {
        apiFnRef.current = apiFn;
        onSuccessRef.current = onSuccess;
        onErrorRef.current = onError;
    });

    const execute = useCallback(async (...args) => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiFnRef.current(...args);
            if (mountedRef.current) {
                setData(result);
                onSuccessRef.current?.(result);
            }
            return result;
        } catch (err) {
            if (mountedRef.current) {
                setError(err);
                onErrorRef.current?.(err);
            }
            throw err;
        } finally {
            if (mountedRef.current) setLoading(false);
        }
    }, []);

    useEffect(() => {
        mountedRef.current = true;
        if (immediate) execute().catch(() => { });
        return () => { mountedRef.current = false; };
    }, [immediate, execute]);

    return { data, loading, error, execute, reset: () => { setData(null); setError(null); setLoading(false); } };
}
