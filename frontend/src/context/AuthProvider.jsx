import { useState, useEffect } from 'react'
import { account } from '../config/appwrite'
import { ID, OAuthProvider } from 'appwrite'
import { AuthContext } from './AuthContext'
import { authApi } from '../services/api'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const sessionUser = await account.get()
        if (sessionUser) {
          try {
            // Check admin status from our backend
            const response = await authApi.getProfile()
            if (response?.success && response?.user) {
              sessionUser.isAdmin = !!response.user.isAdmin
              if (response.user.name) {
                sessionUser.displayName = response.user.name
              } else {
                sessionUser.displayName = sessionUser.name
              }
            } else {
              sessionUser.isAdmin = false
              sessionUser.displayName = sessionUser.name
            }
          } catch (error) {
            console.error('Failed to fetch user profile for admin check:', error)
            sessionUser.isAdmin = false
            sessionUser.displayName = sessionUser.name
          }
          // Appwrite uses $id, Firebase used uid. Polyfill for compatibility:
          sessionUser.uid = sessionUser.$id
          setUser(sessionUser)
        }
      } catch (err) {
        // Not logged in
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const signup = async (email, password, displayName) => {
    // Create the user
    await account.create(ID.unique(), email, password, displayName)
    // Log them in immediately
    await account.createEmailPasswordSession(email, password)
    
    // Fetch and set the user
    const sessionUser = await account.get()
    sessionUser.uid = sessionUser.$id
    sessionUser.displayName = sessionUser.name
    setUser(sessionUser)
    return sessionUser
  }

  const login = async (email, password) => {
    await account.createEmailPasswordSession(email, password)
    const sessionUser = await account.get()
    sessionUser.uid = sessionUser.$id
    sessionUser.displayName = sessionUser.name
    setUser(sessionUser)
    return sessionUser
  }

  const loginWithGoogle = async () => {
    const apiUrl = window.location.origin
    account.createOAuth2Session(OAuthProvider.Google, `${apiUrl}/`, `${apiUrl}/login`)
  }

  const loginWithLinkedIn = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    window.location.href = `${apiUrl}/api/auth/linkedin`
  }

  const loginWithGitHub = async () => {
    const apiUrl = window.location.origin
    account.createOAuth2Session(OAuthProvider.Github, `${apiUrl}/`, `${apiUrl}/login`)
  }

  const logout = async () => {
    try {
      await account.deleteSession('current')
    } catch(err) {
      console.warn("No active session to delete")
    }
    setUser(null)
  }

  const getToken = async () => {
    if (!user) return null
    try {
      const jwt = await account.createJWT()
      return jwt.jwt
    } catch (err) {
      console.error("Failed to get JWT", err)
      return null
    }
  }

  const value = {
    user,
    loading,
    isAdmin: loading ? undefined : (user?.isAdmin ?? false),
    signup,
    login,
    loginWithGoogle,
    loginWithLinkedIn,
    loginWithGitHub,
    logout,
    getToken,
    isMockAuth: false
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
