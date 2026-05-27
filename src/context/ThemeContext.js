import { createContext } from 'react';

/**
 * Context object that holds the state and operations for the theme configuration.
 * Shared between ThemeProvider and useTheme hook.
 */
export const ThemeContext = createContext(null);
