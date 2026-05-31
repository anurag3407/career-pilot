import { useState, useEffect } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth'
import { auth } from '../config/firebase'
import { AuthContext } from './AuthContext'

/**
 * Provider component that manages and exposes the Firebase authentication state and methods.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The children elements.
 * @returns {React.JSX.Element} The rendered Provider component.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // If firebase initialization was skipped, unblock the loading state immediately
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  /**
   * Helper for handling mock authentication
   */
  const handleMockAuth = (mockUser) => {
    if (import.meta.env.DEV) {
      console.info('🛠️ Mock Auth Bypass: Logging in as dummy user.');
      setUser(mockUser);
      return mockUser;
    }
    throw new Error('Authentication service is currently unconfigured.');
  };

  /**
   * Registers a new user with an email, password, and display name.
   */
  const signup = async (email, password, displayName) => {
    if (!auth) return handleMockAuth({ uid: 'demo123', email, displayName: displayName || 'Demo User' });
    const result = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName) {
      await updateProfile(result.user, { displayName })
    }
    return result.user
  }

  /**
   * Logs in a user with an email and password.
   */
  const login = async (email, password) => {
    if (!auth) return handleMockAuth({ uid: 'demo123', email, displayName: 'Demo User' });
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result.user
  }

  /**
   * Logs in a user using Google Sign-In popup.
   */
  const loginWithGoogle = async () => {
    if (!auth) return handleMockAuth({ uid: 'demo_google_123', email: 'google_demo@careerpilot.com', displayName: 'Google Demo User' });
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    return result.user
  }

  /**
   * Redirects the user to the LinkedIn authentication flow.
   */
  const loginWithLinkedIn = () => {
    if (!auth && import.meta.env.DEV) {
      console.info('🛠️ Mock Auth Bypass: Logging in as LinkedIn user.');
      setUser({ uid: 'demo_linkedin_123', email: 'linkedin_demo@careerpilot.com', displayName: 'LinkedIn Demo User' });
      return;
    }
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001'
    window.location.href = `${apiUrl}/api/auth/linkedin`
  }

  /**
   * Signs the user out of the current session.
   */
  const logout = async () => {
    if (!auth) {
      if (import.meta.env.DEV) {
        setUser(null);
        return;
      }
      throw new Error('Authentication service is currently unconfigured.');
    }
    await signOut(auth)
  }

  /**
   * Retrieves the current user's Firebase ID token.
   */
  const getToken = async () => {
    if (!user) return null;
    if (!auth && import.meta.env.DEV) return 'mock_token_123';
    return await user.getIdToken()
  }

  const value = {
    user,
    loading,
    signup,
    login,
    loginWithGoogle,
    loginWithLinkedIn,
    logout,
    getToken,
    isMockAuth: !auth // Helper flag indicating local offline development
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
