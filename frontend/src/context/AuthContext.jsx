import { createContext, useContext, useState, useEffect } from 'react'
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

const AuthContext = createContext(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

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

  // Sign up with email/password
  const signup = async (email, password, displayName) => {
    if (!auth) throw new Error('Authentication service is currently unconfigured.')
    const result = await createUserWithEmailAndPassword(auth, email, password)
    if (displayName) {
      await updateProfile(result.user, { displayName })
    }
    return result.user
  }

  // Sign in with email/password
  const login = async (email, password) => {
    if (!auth) throw new Error('Authentication service is currently unconfigured.')
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result.user
  }

  // Sign in with Google
  const loginWithGoogle = async () => {
    if (!auth) throw new Error('Authentication service is currently unconfigured.')
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    return result.user
  }

  // Sign in with LinkedIn
  const loginWithLinkedIn = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    window.location.href = `${apiUrl}/api/auth/linkedin`
  }

  // Sign out
  const logout = async () => {
    if (!auth) throw new Error('Authentication service is currently unconfigured.')
    await signOut(auth)
  }

  // Get ID token for API calls
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