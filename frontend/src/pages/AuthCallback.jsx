import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, ShieldAlert } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { d1Auth } from '../config/d1'
import { consumePostAuthRedirect } from '../utils/authRedirect'

/**
 * Landing point for OAuth round-trips from the Cloudflare Worker gateway.
 * Extracts `#access_token=...`, hydrates the D1 auth session, and redirects
 * to the stored post-auth destination (or /dashboard).
 */
export default function AuthCallback() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [timedOut, setTimedOut] = useState(false)
  const [tokenError, setTokenError] = useState(null)
  const [urlError] = useState(() => {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    return params.get('error_description') || params.get('error')
  })

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const accessToken = params.get('access_token')
    if (accessToken && !urlError) {
      d1Auth.setSessionFromToken(accessToken).then(({ error }) => {
        if (error) setTokenError(error.message || 'Could not verify token')
      })
    }
  }, [urlError])

  useEffect(() => {
    if (!loading && user) {
      navigate(consumePostAuthRedirect(), { replace: true })
    }
  }, [user, loading, navigate])

  useEffect(() => {
    if (urlError || tokenError) return undefined
    const timer = setTimeout(() => setTimedOut(true), 12000)
    return () => clearTimeout(timer)
  }, [urlError, tokenError])

  const failed = Boolean(urlError || tokenError) || (timedOut && !loading && !user)

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-xl">
        {failed ? (
          <>
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl border border-destructive/30 bg-destructive/10 text-destructive">
              <ShieldAlert className="h-5 w-5" />
            </span>
            <h1 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
              Sign-in didn&apos;t complete
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {urlError
                ? decodeURIComponent(urlError.replace(/\+/g, ' '))
                : (tokenError || 'We couldn’t verify your session. Please try signing in again.')}
            </p>
            <Link
              to="/login"
              className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:brightness-110"
            >
              Back to sign in
            </Link>
          </>
        ) : (
          <>
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <h1 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
              Completing sign-in…
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Verifying your account and preparing your dashboard.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
