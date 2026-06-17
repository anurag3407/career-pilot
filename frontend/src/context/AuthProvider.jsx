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
    // and provide a mock user for local development.
    if (!auth) {
      if (import.meta.env.DEV) {
        setUser({
          uid: 'dev-user-001',
          email: 'dev@example.com',
          displayName: 'Local Dev User',
          getIdToken: async () => 'mock-dev-token'
        });
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  /**
   * Registers a new user with an email, password, and display name.
   *
   * @param {string} email - The email address.
   * @param {string} password - The password.
   * @param {string} displayName - The user's display name.
   * @returns {Promise<object>} The Firebase user object.
   */
  const signup = async (email, password, displayName) => {
    if (!auth) throw new Error("Authentication service is not configured. Please check your environment variables and authentication provider setup. Refer to the project setup documentation for configuration instructions.")
    const result = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName) {
      await updateProfile(result.user, { displayName })
    }
    return result.user
  }

  /**
   * Logs in a user with an email and password.
   *
   * @param {string} email - The email address.
   * @param {string} password - The password.
   * @returns {Promise<object>} The Firebase user object.
   */
  const login = async (email, password) => {
    if (!auth && import.meta.env.DEV) {
      const mockUser = {
        uid: 'dev-user-001',
        email: 'dev@example.com',
        displayName: 'Local Dev User',
        getIdToken: async () => 'mock-dev-token'
      };
      setUser(mockUser);
      return mockUser;
    }
    if (!auth) throw new Error("Authentication service is not configured. Please check your environment variables and authentication provider setup. Refer to the project setup documentation for configuration instructions.")
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result.user
  }

  /**
   * Logs in a user using Google Sign-In popup.
   *
   * @returns {Promise<object>} The Firebase user object.
   */
  const loginWithGoogle = async () => {
    if (!auth) throw new Error("Authentication service is not configured. Please check your environment variables and authentication provider setup. Refer to the project setup documentation for configuration instructions.")
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    return result.user
  }

  /**
   * Redirects the user to the LinkedIn authentication flow.
   */
  const loginWithLinkedIn = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    window.location.href = `${apiUrl}/api/auth/linkedin`
  }

  /**
   * Signs the user out of the current session.
   *
   * @returns {Promise<void>}
   */
  const logout = async () => {
    if (!auth) throw new Error("Authentication service is not configured. Please check your environment variables and authentication provider setup. Refer to the project setup documentation for configuration instructions.")
    await signOut(auth)
  }

  /**
   * Retrieves the current user's Firebase ID token.
   *
   * @returns {Promise<string|null>} The token string, or null if no user is authenticated.
   */
  const getToken = async () => {
    if (!user) return null
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
