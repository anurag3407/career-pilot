import { useState, useLayoutEffect } from 'react';
import { ThemeContext } from './ThemeContext';
import logger from '../utils/logger';
/**
 * Provider component that manages the application theme (light or dark)
 * and persists the setting across browser sessions.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The children elements.
 * @returns {React.JSX.Element} The rendered Provider component.
 */
export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    try {
      const savedTheme = window.localStorage.getItem('theme');
      if (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'highContrast') return savedTheme;
    } catch (e) {
      logger.warn('Failed to read from localStorage:', e);
    }
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    const root = window.document.documentElement;
    
    root.classList.remove('light', 'dark', 'highContrast');
    root.classList.add(theme);
    
    try {
      window.localStorage.setItem('theme', theme);
    } catch (e) {
      logger.warn('Failed to write to localStorage:', e);
    }
  }, [theme]);

  /**
   * Cycles the current theme: light -> dark -> highContrast -> light.
   */
  const toggleTheme = () => {
    setThemeState((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'highContrast';
      return 'light';
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
