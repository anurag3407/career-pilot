import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

/**
 * Hook to access the theme context value (theme, toggleTheme).
 *
 * Gracefully handles the case where no ThemeProvider is present in the tree
 * (e.g. during SSR, isolated unit tests, or accidental usage outside the
 * provider) by returning safe defaults instead of throwing a hard error that
 * would crash the entire page.
 *
 * Fixes: https://github.com/anurag3407/career-pilot/issues/2226
 *
 * @returns {{ theme: string, toggleTheme: () => void }}
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[useTheme] ThemeContext is null. ' +
        'Make sure this hook is called inside a <ThemeProvider>. ' +
        'Falling back to default light theme.'
      );
    }
    // Return safe defaults so the page renders instead of crashing.
    return { theme: 'light', toggleTheme: () => {} };
  }
  return context;
}
