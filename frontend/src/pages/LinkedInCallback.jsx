import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from 'react-hot-toast'
import { signInWithCustomToken, signOut } from 'firebase/auth'
import { ShieldCheck } from 'lucide-react'
import { auth } from '../config/firebase'
import Navbar from '../components/Navbar'
import Input from '../components/Input'
import Button from '../components/Button'
import Card from '../components/Card'
import { twoFactorApi } from '../services/api'

export default function LinkedInCallback() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [status, setStatus] = useState('Signing you in...')
    const [step, setStep] = useState('loading') // 'loading', 'totp'
    const [totpToken, setTotpToken] = useState('')
    const [useBackup, setUseBackup] = useState(false)
    const [totpLoading, setTotpLoading] = useState(false)



        if (!code) {
            toast.error('Something went wrong. Please try again.')
            navigate('/login')
            return
        }

        try {
    setStatus('Completing sign-in...')

    const apiBase = import.meta.env.VITE_API_URL || '/api'

    const resp = await fetch(
        `${apiBase}/auth/linkedin/token?code=${encodeURIComponent(code)}`
    )

    if (!resp.ok) {
        const body = await resp.json().catch(() => ({}))
        throw new Error(body.error || 'Token exchange failed')
    }

    const { token, isNew } = await resp.json()

    await signInWithCustomToken(auth, token)

    // Fetch two-factor status to prevent 2FA bypass
    const tfaStatus = await twoFactorApi.getStatus()

    if (tfaStatus && tfaStatus.enabled) {
        setStep('totp')
        toast.success('Two-factor authentication required')
    } else {
        toast.success('Signed in successfully!')
        navigate('/dashboard')
    }
} catch (err) {
    console.error('Custom token sign-in failed:', err)

    toast.error('Failed to sign in. Please try again.')

    navigate('/login')
}
    }

handleCallback()
}, [searchParams, navigate])

    const handleTotpSubmit = async (e) => {
        e.preventDefault()
        if (!totpToken.trim()) return

        setTotpLoading(true)
        try {
            if (useBackup) {
                await twoFactorApi.verifyBackup(totpToken)
            } else {
                await twoFactorApi.verify(totpToken)
            }
            toast.success('Verification successful!')
            navigate('/dashboard')
        } catch (error) {
            toast.error(error.message || 'Invalid code — please try again')
        } finally {
            setTotpLoading(false)
        }
    }

    const handleCancel = async () => {
        try {
            await signOut(auth)
        } catch (e) {
            console.error('Signout error:', e)
        }
        navigate('/login')
    }

    if (step === 'loading') {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-neutral-400 text-sm">{status}</p>
              </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
          {/* Background Effect */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />
          
          <Navbar />

          <div className="max-w-md mx-auto pt-24 md:pt-32 px-4 relative z-10">
            <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
              <div className="flex flex-col items-center mb-6">
                <div className="p-3 rounded-full bg-primary/10 border border-primary/20 mb-4">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-center text-foreground">
                  Two-Factor Verification
                </h1>
                <p className="text-muted-foreground text-sm text-center mt-2 font-medium">
                  {useBackup
                    ? 'Enter one of your backup codes to continue.'
                    : 'Open your authenticator app and enter the 6-digit code.'}
                </p>
              </div>

              <form onSubmit={handleTotpSubmit}>
                <Input
                  label={useBackup ? 'Backup code' : 'Authenticator code'}
                  type="text"
                  name="totpToken"
                  value={totpToken}
                  onChange={(e) => setTotpToken(useBackup ? e.target.value.toUpperCase() : e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder={useBackup ? 'XXXX-XXXX' : '000000'}
                  className="font-mono tracking-widest text-center text-lg font-bold"
                  maxLength={useBackup ? 9 : 6}
                  required
                />

                <Button
                  type="submit"
                  loading={totpLoading}
                  disabled={useBackup ? totpToken.replace(/[^A-Z0-9]/g, '').length !== 8 : totpToken.length !== 6}
                  className="w-full mt-4 font-bold"
                >
                  Verify &amp; Sign In
                </Button>
              </form>

              <button
                type="button"
                onClick={() => {
                  setUseBackup(v => !v)
                  setTotpToken('')
                }}
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors mt-4 font-bold"
              >
                {useBackup ? 'Use authenticator app instead' : 'Use a backup code instead'}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="w-full text-center text-sm text-primary hover:text-primary/80 transition-colors mt-4 font-bold"
              >
                Cancel and return to Login
              </button>
            </Card>
          </div>
        </div>
    )
}