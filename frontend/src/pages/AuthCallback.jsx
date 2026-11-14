import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, ShieldAlert } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { consumePostAuthRedirect } from '../utils/authRedirect'

/**
 * Landing point for OAuth and email-confirmation round-trips. Supabase
 * detects the session from the URL hash; once the user resolves we forward
 * them to their intended destination (stored before the redirect) or the
 * dashboard — never the marketing home page.
 */
export default function AuthCallback() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [timedOut, setTimedOut] = useState(false)
  const [urlError] = useState(() => {
    const params = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    return params.get('error_description') || params.get('error')
  })

  useEffect(() => {
    if (!loading && user) {
      navigate(consumePostAuthRedirect(), { replace: true })
    }
  }, [user, loading, navigate])

  useEffect(() => {
    if (urlError) return undefined
    const timer = setTimeout(() => setTimedOut(true), 12000)
    return () => clearTimeout(timer)
  }, [urlError])

  const failed = Boolean(urlError) || (timedOut && !loading && !user)

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
                : 'We couldn’t verify your session. Please try signing in again.'}
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