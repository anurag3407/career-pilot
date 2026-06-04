import { useState, useLayoutEffect } from 'react';
import { ThemeContext } from './ThemeContext';

/**
 * Provider component that manages the application theme (light or dark)
 * and persists the setting across browser sessions.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The children elements.
 * @returns {React.JSX.Element} The rendered Provider component.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    const savedTheme = window.localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    return 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState(() => {
    if (theme !== 'system') return theme;
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    
    const root = window.document.documentElement;
    const updateTheme = (newTheme) => {
      const actualTheme = newTheme === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : newTheme;
      
      root.classList.remove('light', 'dark');
      root.classList.add(actualTheme);
      setResolvedTheme(actualTheme);
      window.localStorage.setItem('theme', newTheme);
    };

    updateTheme(theme);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => updateTheme('system');
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

