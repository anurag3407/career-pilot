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
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    const root = window.document.documentElement;
    const nextTheme = theme === 'dark' ? 'dark' : 'light';
    root.classList.remove('light', 'dark');
    root.classList.add(nextTheme);
    window.localStorage.setItem('theme', nextTheme);
  }, [theme]);

  /**
   * Toggles the current theme between 'light' and 'dark'.
   */
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
