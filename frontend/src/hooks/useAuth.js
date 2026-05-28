import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Hook to access the authentication context values (user, login, logout, etc.).
 * Must be used inside an AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
