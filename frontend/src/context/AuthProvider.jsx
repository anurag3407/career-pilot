import { useState, useEffect } from 'react'
import { useUser, useAuth, useClerk } from '@clerk/clerk-react'
import { AuthContext } from './AuthContext'
import { authApi } from '../services/api'

export function AuthProvider({ children }) {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser()
  const { getToken: getClerkToken, signOut } = useAuth()
  const clerk = useClerk()
  
  const [mappedUser, setMappedUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [checkingAdmin, setCheckingAdmin] = useState(false)

  // Map Clerk user to our app's expected user structure
  useEffect(() => {
    if (isLoaded && isSignedIn && clerkUser) {
      setCheckingAdmin(true)
      
      const u = {
        uid: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress,
        displayName: clerkUser.fullName || clerkUser.username || clerkUser.primaryEmailAddress?.emailAddress?.split('@')[0],
        photoURL: clerkUser.imageUrl,
        isAdmin: false // default, check backend next
      }

      authApi.getProfile()
        .then(res => {
          if (res?.success && res?.user) {
            u.isAdmin = !!res.user.isAdmin
            setIsAdmin(u.isAdmin)
          }
        })
        .catch(err => {
          console.error('Failed to fetch user profile for admin check:', err)
        })
        .finally(() => {
          setMappedUser(u)
          setCheckingAdmin(false)
        })
    } else {
      setMappedUser(null)
      setIsAdmin(false)
      setCheckingAdmin(false)
    }
  }, [isLoaded, isSignedIn, clerkUser])

  const signup = async () => {
    clerk.redirectToSignUp()
  }

  const login = async () => {
    clerk.redirectToSignIn()
  }

  const loginWithGoogle = async () => {
    clerk.redirectToSignIn({ strategy: 'oauth_google' })
  }

  const loginWithLinkedIn = () => {
    clerk.redirectToSignIn({ strategy: 'oauth_linkedin' })
  }

  const loginWithGitHub = async () => {
    clerk.redirectToSignIn({ strategy: 'oauth_github' })
  }

  const logout = async () => {
    await signOut()
  }

  const getToken = async () => {
    if (!isSignedIn) return null
    try {
      return await getClerkToken()
    } catch (err) {
      console.error("Failed to get Clerk token", err)
      return null
    }
  }

  const loading = !isLoaded || (isSignedIn && checkingAdmin)

  const value = {
    user: mappedUser,
    loading,
    isAdmin,
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
