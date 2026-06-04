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
  const [theme, setThemeState] = useState(() => {
    if (typeof window === 'undefined') return 'light';

  });

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    
    const root = window.document.documentElement;

  const toggleTheme = () => {
    setThemeState((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'highContrast';
      return 'light';
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

