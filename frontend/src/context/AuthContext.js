import { createContext } from 'react';

/**
 * Context object that holds the state and operations for Firebase authentication.
 * Shared between AuthProvider and useAuth hook.
 */
export const AuthContext = createContext(null);
