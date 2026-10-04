import { useEffect, useState } from 'react';

export function useReducedMotion() {
    const getPreference = () => {
        if (typeof window === 'undefined' || !window.matchMedia) {
            return false;
        }

        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    };

    const [prefersReducedMotion, setPrefersReducedMotion] = useState(getPreference);

    useEffect(() => {
        if (typeof window === 'undefined' || !window.matchMedia) {
            return;
        }

        const mediaQuery = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        );

        const handleChange = (event) => {
            setPrefersReducedMotion(event.matches);
        };

        setPrefersReducedMotion(mediaQuery.matches);

        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }

        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
    }, []);

    return prefersReducedMotion;
}

export default useReducedMotion;