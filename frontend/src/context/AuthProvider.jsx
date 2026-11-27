import { useEffect, useMemo, useState } from 'react'
import { AuthContext } from './AuthContext'
import { authApi } from '../services/api'
import { d1Auth, isD1Configured } from '../config/d1'
import { storePostAuthRedirect } from '../utils/authRedirect'

const authCallbackUrl = () => `${window.location.origin}/auth/callback`

function D1AuthState({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    let mounted = true

    d1Auth.getSession().then(({ data: { session: initialSession } }) => {
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

    const { data: { subscription } } = d1Auth.onAuthStateChange(async (_event, newSession) => {
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

    async function mapAndSetUser(d1User) {
      const mapped = {
        uid: d1User.uid || d1User.id,
        id: d1User.id || d1User.uid,
        email: d1User.email,
        displayName:
          d1User.displayName ||
          d1User.name ||
          d1User.username ||
          d1User.email?.split('@')[0],
        photoURL: d1User.photoURL || d1User.avatarUrl || null,
        isAdmin: Boolean(d1User.isAdmin),
      }

      try {
        const res = await authApi.getProfile()
        if (mounted && res?.success && res?.user) {
          mapped.isAdmin = !!res.user.isAdmin
          mapped.displayName = res.user.displayName || mapped.displayName
          mapped.photoURL = res.user.photoURL || mapped.photoURL
          setIsAdmin(mapped.isAdmin)
        }
      } catch (err) {
        if (err?.status === 401) {
          await d1Auth.signOut().catch(() => {})
          if (mounted) {
            setUser(null)
            setSession(null)
            setIsAdmin(false)
            setLoading(false)
          }
          return
        }
        console.warn('Profile fetch for user hydration:', err.message)
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
    return await d1Auth.signUp({
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

    return await d1Auth.signInWithPassword({
      email,
      password,
    })
  }

  const loginWithGoogle = async (redirectTo = '/dashboard') => {
    storePostAuthRedirect(redirectTo)
    return await d1Auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    })
  }

  const loginWithLinkedIn = async (redirectTo = '/dashboard') => {
    storePostAuthRedirect(redirectTo)
    return await d1Auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: { redirectTo },
    })
  }

  const loginWithGitHub = async (redirectTo = '/dashboard') => {
    storePostAuthRedirect(redirectTo)
    return await d1Auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo },
    })
  }

  const logout = async () => {
    await d1Auth.signOut()
    setUser(null)
    setSession(null)
    setIsAdmin(false)
  }

  const getToken = async () => {
    const { data } = await d1Auth.getSession()
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
      isD1Configured: true,
      isSupabaseConfigured: false,
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
      isD1Configured: false,
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
  if (isD1Configured) {
    return <D1AuthState>{children}</D1AuthState>
  }
  return <PublicPreviewAuthState>{children}</PublicPreviewAuthState>
}

export default AuthProvider
