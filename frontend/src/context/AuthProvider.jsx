import { useEffect, useMemo, useState } from 'react'
import { useUser, useAuth, useClerk } from '@clerk/clerk-react'
import { AuthContext } from './AuthContext'
import { authApi } from '../services/api'

const clerkConfigured = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)

function ClerkAuthState({ children }) {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser()
  const { getToken: getClerkToken, signOut } = useAuth()
  const clerk = useClerk()

  const [mappedUser, setMappedUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [checkingAdmin, setCheckingAdmin] = useState(false)

  useEffect(() => {
    let cancelled = false

    if (isLoaded && isSignedIn && clerkUser) {
      setCheckingAdmin(true)

      const user = {
        uid: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress,
        displayName:
          clerkUser.fullName ||
          clerkUser.username ||
          clerkUser.primaryEmailAddress?.emailAddress?.split('@')[0],
        photoURL: clerkUser.imageUrl,
        isAdmin: false,
      }

      authApi
        .getProfile()
        .then((res) => {
          if (cancelled) return
          if (res?.success && res?.user) {
            user.isAdmin = !!res.user.isAdmin
            setIsAdmin(user.isAdmin)
          }
        })
        .catch((err) => {
          console.error('Failed to fetch user profile for admin check:', err)
        })
        .finally(() => {
          if (cancelled) return
          setMappedUser(user)
          setCheckingAdmin(false)
        })
    } else {
      setMappedUser(null)
      setIsAdmin(false)
      setCheckingAdmin(false)
    }

    return () => {
      cancelled = true
    }
  }, [isLoaded, isSignedIn, clerkUser])

  const value = useMemo(
    () => ({
      user: mappedUser,
      loading: !isLoaded || (isSignedIn && checkingAdmin),
      isAdmin,
      signup: () => clerk.redirectToSignUp(),
      login: () => clerk.redirectToSignIn(),
      loginWithGoogle: () => clerk.redirectToSignIn({ strategy: 'oauth_google' }),
      loginWithLinkedIn: () => clerk.redirectToSignIn({ strategy: 'oauth_linkedin' }),
      loginWithGitHub: () => clerk.redirectToSignIn({ strategy: 'oauth_github' }),
      logout: () => signOut(),
      getToken: async () => {
        if (!isSignedIn) return null
        try {
          return await getClerkToken()
        } catch (err) {
          console.error('Failed to get Clerk token', err)
          return null
        }
      },
      isMockAuth: false,
      isClerkConfigured: true,
    }),
    [mappedUser, isLoaded, isSignedIn, checkingAdmin, isAdmin, clerk, getClerkToken, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function PublicPreviewAuthState({ children }) {
  const value = useMemo(
    () => ({
      user: null,
      loading: false,
      isAdmin: false,
      isClerkConfigured: false,
      signup: () => {},
      login: () => {},
      loginWithGoogle: () => {},
      loginWithLinkedIn: () => {},
      loginWithGitHub: () => {},
      logout: async () => {},
      getToken: async () => null,
      isMockAuth: false,
    }),
    [],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function AuthProvider({ children }) {
  return clerkConfigured ? (
    <ClerkAuthState>{children}</ClerkAuthState>
  ) : (
    <PublicPreviewAuthState>{children}</PublicPreviewAuthState>
  )
}
