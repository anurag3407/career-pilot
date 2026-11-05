import { useEffect, useMemo, useState } from 'react'
import { AuthContext } from './AuthContext'
import { authApi } from '../services/api'
import { supabase, isSupabaseConfigured } from '../config/supabase'

const clerkConfigured = Boolean(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)

function SupabaseAuthState({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    let mounted = true

    // Initial session load
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (!mounted) return
      setSession(initialSession)
      if (initialSession?.user) {
        mapAndSetUser(initialSession.user)
      } else {
        setUser(null)
        setLoading(false)
      }
    }).catch(() => {
      if (mounted) setLoading(false)
    })

    // Listen to Supabase auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return
      setSession(newSession)
      if (newSession?.user) {
        await mapAndSetUser(newSession.user)
      } else {
        setUser(null)
        setIsAdmin(false)
        setLoading(false)
        window.Clerk = null
      }
    })

    async function mapAndSetUser(supaUser) {
      const meta = supaUser.user_metadata || {}
      const mapped = {
        uid: supaUser.id,
        id: supaUser.id,
        email: supaUser.email,
        displayName:
          meta.full_name ||
          meta.name ||
          meta.username ||
          supaUser.email?.split('@')[0],
        photoURL: meta.avatar_url || meta.picture || null,
        isAdmin: false,
      }

      // Backward compatibility shim for window.Clerk callers
      window.Clerk = {
        user: { id: mapped.uid, email: mapped.email },
        session: {
          getToken: async () => {
            const { data } = await supabase.auth.getSession()
            return data?.session?.access_token || null
          },
        },
      }

      try {
        const res = await authApi.getProfile()
        if (mounted && res?.success && res?.user) {
          mapped.isAdmin = !!res.user.isAdmin
          setIsAdmin(mapped.isAdmin)
        }
      } catch (err) {
        console.warn('Profile fetch for admin check:', err.message)
      } finally {
        if (mounted) {
          setUser(mapped)
          setLoading(false)
        }
      }
    }

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [])

  const signup = async (emailOrObj, passwordArg, metaArg = {}) => {
    const email = typeof emailOrObj === 'object' ? emailOrObj.email : emailOrObj
    const password = typeof emailOrObj === 'object' ? emailOrObj.password : passwordArg
    const metadata = typeof emailOrObj === 'object' ? (emailOrObj.metadata || emailOrObj.options?.data || {}) : metaArg

    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: window.location.origin,
      },
    })
  }

  const login = async (emailOrObj, passwordArg) => {
    const email = typeof emailOrObj === 'object' ? emailOrObj.email : emailOrObj
    const password = typeof emailOrObj === 'object' ? emailOrObj.password : passwordArg

    return await supabase.auth.signInWithPassword({
      email,
      password,
    })
  }

  const loginWithGoogle = async () => {
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    })
  }

  const loginWithLinkedIn = async () => {
    return await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: {
        redirectTo: window.location.origin,
      },
    })
  }

  const loginWithGitHub = async () => {
    return await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin,
      },
    })
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    window.Clerk = null
  }

  const getToken = async () => {
    const { data } = await supabase.auth.getSession()
    return data?.session?.access_token || null
  }

  const value = useMemo(
    () => ({
      user,
      session,
      loading,
      isAdmin,
      signup,
      login,
      loginWithGoogle,
      loginWithLinkedIn,
      loginWithGitHub,
      logout,
      getToken,
      isConfigured: true,
      isSupabaseConfigured: true,
      isClerkConfigured: false,
      isMockAuth: false,
    }),
    [user, session, loading, isAdmin],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function ClerkAuthState({ children }) {
  const [mappedUser, setMappedUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [checkingAdmin, setCheckingAdmin] = useState(false)
  const [clerkHooks, setClerkHooks] = useState(null)

  useEffect(() => {
    import('@clerk/clerk-react').then((mod) => {
      setClerkHooks({
        useUser: mod.useUser,
        useAuth: mod.useAuth,
        useClerk: mod.useClerk,
      })
    }).catch((err) => {
      console.warn('Could not load Clerk modules:', err.message)
    })
  }, [])

  if (!clerkHooks) {
    return <PublicPreviewAuthState>{children}</PublicPreviewAuthState>
  }

  return (
    <ClerkLoadedAuthState
      hooks={clerkHooks}
      mappedUser={mappedUser}
      setMappedUser={setMappedUser}
      isAdmin={isAdmin}
      setIsAdmin={setIsAdmin}
      checkingAdmin={checkingAdmin}
      setCheckingAdmin={setCheckingAdmin}
    >
      {children}
    </ClerkLoadedAuthState>
  )
}

function ClerkLoadedAuthState({
  children,
  hooks,
  mappedUser,
  setMappedUser,
  isAdmin,
  setIsAdmin,
  checkingAdmin,
  setCheckingAdmin,
}) {
  const { isLoaded, isSignedIn, user: clerkUser } = hooks.useUser()
  const { getToken: getClerkToken, signOut } = hooks.useAuth()
  const clerk = hooks.useClerk()

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
  }, [isLoaded, isSignedIn, clerkUser, setCheckingAdmin, setIsAdmin, setMappedUser])

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
      isConfigured: true,
      isSupabaseConfigured: false,
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
      isConfigured: false,
      isSupabaseConfigured: false,
      isClerkConfigured: false,
      signup: async () => {},
      login: async () => {},
      loginWithGoogle: async () => {},
      loginWithLinkedIn: async () => {},
      loginWithGitHub: async () => {},
      logout: async () => {},
      getToken: async () => null,
      isMockAuth: false,
    }),
    [],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function AuthProvider({ children }) {
  if (isSupabaseConfigured) {
    return <SupabaseAuthState>{children}</SupabaseAuthState>
  }
  if (clerkConfigured) {
    return <ClerkAuthState>{children}</ClerkAuthState>
  }
  return <PublicPreviewAuthState>{children}</PublicPreviewAuthState>
}

export default AuthProvider
