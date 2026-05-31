import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ShieldCheck } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import Navbar from '../components/Navbar'
import Input from '../components/Input'
import Button from '../components/Button'
import Card from '../components/Card'
import { twoFactorApi } from '../services/api'

const validationRules = {
  email: {
    required: 'Email is required',
    pattern: {
      value: /\S+@\S+\.\S+/,
      message: 'Invalid email address',
    },
  },
  password: {
    required: 'Password is required',
  },
}

export default function Login() {
  const navigate = useNavigate()
  const { login, loginWithGoogle, loginWithLinkedIn } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const [step, setStep] = useState('credentials')
  const [totpToken, setTotpToken] = useState('')
  const [useBackup, setUseBackup] = useState(false)
  const [totpLoading, setTotpLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [linkedinLoading, setLinkedinLoading] = useState(false)

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password)
      try {
        const statusRes = await twoFactorApi.getStatus()
        if (statusRes.enabled) {
          setStep('totp')
          return
        }
      } catch (_) {}
      toast.success('Signed in successfully!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.message || 'Failed to sign in. Please check your credentials.')
    }
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    try {
      await loginWithGoogle()
      try {
        const statusRes = await twoFactorApi.getStatus()
        if (statusRes.enabled) {
          setStep('totp')
          return
        }
      } catch (_) {}
      toast.success('Signed in with Google!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.message || 'Failed to sign in with Google')
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleLinkedInLogin = () => {
    if (!loginWithLinkedIn) {
      toast.error('LinkedIn login integration is not configured.')
      return
    }
    setLinkedinLoading(true)
    try {
      loginWithLinkedIn()
    } catch (error) {
      toast.error(error.message || 'Failed to login with LinkedIn')
      setLinkedinLoading(false)
    }
  }

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

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />

      <Navbar />

      <div className="max-w-md mx-auto pt-24 md:pt-32 px-4 relative z-10">
        <Card className="border-border/50 bg-card/60 backdrop-blur-xl">
          {step === 'credentials' ? (
            <>
              <h1 className="text-3xl font-black text-center mb-8 text-foreground tracking-tight">Welcome Back</h1>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  error={errors.email?.message}
                  {...register('email', validationRules.email)}
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register('password', validationRules.password)}
                />

                <Button
                  type="submit"
                  loading={isSubmitting}
                  className="w-full mt-4 font-bold"
                >
                  Sign In
                </Button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-card text-muted-foreground font-bold tracking-widest uppercase text-xs">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={handleGoogleLogin}
                  disabled={googleLoading}
                  loading={googleLoading}
                  className="w-full font-bold"
                >
                  <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>

                <Button
                  variant="outline"
                  onClick={handleLinkedInLogin}
                  disabled={linkedinLoading}
                  loading={linkedinLoading}
                  className="w-full font-bold"
                >
                  <svg className="w-5 h-5 mr-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </Button>
              </div>

              <p className="text-center text-sm font-medium text-muted-foreground mt-8">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:text-primary/80 font-bold transition-colors underline decoration-primary/30 underline-offset-4">
                  Sign up
                </Link>
              </p>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center mb-6">
                <div className="p-3 rounded-full bg-primary/10 border border-primary/20 mb-4">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-center text-foreground">Two-Factor Verification</h1>
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
                  value={totpToken}
                  onChange={(e) =>
                    setTotpToken(
                      useBackup
                        ? e.target.value.toUpperCase()
                        : e.target.value.replace(/\D/g, '').slice(0, 6)
                    )
                  }
                  placeholder={useBackup ? 'XXXX-XXXX' : '000000'}
                  className="font-mono tracking-widest text-center text-lg font-bold"
                  maxLength={useBackup ? 9 : 6}
                  required
                />

                <Button
                  type="submit"
                  loading={totpLoading}
                  disabled={
                    useBackup
                      ? totpToken.replace(/[^A-Z0-9]/g, '').length !== 8
                      : totpToken.length !== 6
                  }
                  className="w-full mt-4 font-bold"
                >
                  Verify &amp; Sign In
                </Button>
              </form>

              <button
                type="button"
                onClick={() => {
                  setUseBackup((v) => !v)
                  setTotpToken('')
                }}
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors mt-4 font-bold"
              >
                {useBackup ? 'Use authenticator app instead' : 'Use a backup code instead'}
              </button>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}