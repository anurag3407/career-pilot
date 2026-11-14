import { useEffect, useMemo, useState } from 'react'
import { AuthContext } from './AuthContext'
import { authApi } from '../services/api'
import { supabase, isSupabaseConfigured } from '../config/supabase'
import { storePostAuthRedirect } from '../utils/authRedirect'

// OAuth and email confirmation leave the SPA entirely, so they return through
// /auth/callback which restores the intended destination (or /dashboard).
const authCallbackUrl = () => `${window.location.origin}/auth/callback`

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

  const signup = async (emailOrObj, passwordArg, metaArg = {}, redirectTo = '/dashboard') => {
    const email = typeof emailOrObj === 'object' ? emailOrObj.email : emailOrObj
    const password = typeof emailOrObj === 'object' ? emailOrObj.password : passwordArg
    const metadata = typeof emailOrObj === 'object' ? (emailOrObj.metadata || emailOrObj.options?.data || {}) : metaArg

    storePostAuthRedirect(redirectTo)
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: authCallbackUrl(),
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

  const loginWithGoogle = async (redirectTo = '/dashboard') => {
    storePostAuthRedirect(redirectTo)
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: authCallbackUrl(),
      },
    })
  }

  const loginWithLinkedIn = async (redirectTo = '/dashboard') => {
    storePostAuthRedirect(redirectTo)
    return await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: {
        redirectTo: authCallbackUrl(),
      },
    })
  }

  const loginWithGitHub = async (redirectTo = '/dashboard') => {
    storePostAuthRedirect(redirectTo)
    return await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: authCallbackUrl(),
      },
    })
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
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
      isMockAuth: false,
    }),
    [user, session, loading, isAdmin],
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
  return <PublicPreviewAuthState>{children}</PublicPreviewAuthState>
}

export default AuthProvider
