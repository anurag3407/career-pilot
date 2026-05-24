import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage(key, defaultValue) {
    const [value, setValue] = useState(() => {
        try {
            const stored = window.localStorage.getItem(key);
            return stored !== null ? JSON.parse(stored) : defaultValue;
        } catch { return defaultValue; }
    });

    useEffect(() => {
        try {
            if (value === undefined) window.localStorage.removeItem(key);
            else window.localStorage.setItem(key, JSON.stringify(value));
        } catch { }
    }, [key, value]);

    return [value, setValue, useCallback(() => {
        try { window.localStorage.removeItem(key); } catch { }
        setValue(defaultValue);
    }, [key, defaultValue])];
}
