import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

/**
 * Hook to access the theme context value (theme, toggleTheme).
 * Must be used inside a ThemeProvider.
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
