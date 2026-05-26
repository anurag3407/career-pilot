import { useState } from 'react'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Input from '../components/Input'
import Button from '../components/Button'
import Card from '../components/Card'
import { twoFactorApi } from '../services/api'

export default function Login() {

  const schema = yup.object({
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
password: yup
  .string()
  .required("Password is required")
  .min(6, "Password must be at least 6 characters")
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
    "Password must contain uppercase, lowercase, number and special character"
  ),
  })

  const navigate = useNavigate()
  const { login, loginWithGoogle, loginWithLinkedIn } = useAuth()

  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('credentials')
  const [totpToken, setTotpToken] = useState('')
  const [useBackup, setUseBackup] = useState(false)
  const [totpLoading, setTotpLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data) => {
    setLoading(true)

    try {
      const response = await login(
        data.email,
        data.password
      )

      if (response && response.twoFactorRequired) {
        setStep('totp')
        toast.success('Two-factor authentication required')
      } else {
        toast.success('Signed in successfully!')
        navigate('/dashboard')
      }

    } catch (error) {
      console.error('Login error:', error)

      toast.error(
        error.message ||
        'Failed to sign in. Please check your credentials.'
      )

    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)

    try {
      const response = await loginWithGoogle()

      if (response && response.twoFactorRequired) {
        setStep('totp')
        toast.success('Two-factor authentication required')
      } else {
        toast.success('Signed in with Google!')
        navigate('/dashboard')
      }

    } catch (error) {
      console.error('Google login error:', error)
      toast.error(error.message || 'Failed to sign in with Google')

    } finally {
      setLoading(false)
    }
  }

  const handleLinkedInLogin = () => {
    if (!loginWithLinkedIn) {
      toast.error('LinkedIn login integration is not configured.')
      return
    }

    setLoading(true)

    try {
      loginWithLinkedIn()

    } catch (error) {
      console.error('LinkedIn login error:', error)
      toast.error(error.message || 'Failed to login with LinkedIn')
      setLoading(false)
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

      <div className="max-w-md mx-auto pt-32 px-4 relative z-10">
        <Card className="border-border/50 bg-card/60 backdrop-blur-xl">

          {step === 'credentials' ? (
            <>
              <h1 className="text-3xl font-black text-center mb-8 text-foreground tracking-tight">
                Welcome Back
              </h1>

              <form onSubmit={handleSubmit(onSubmit)}>

                <Input
                  label="Email"
                  type="email"
                  {...register("email")}
                  placeholder="you@example.com"
                  error={errors.email?.message}
                 
                />

                <Input
                  label="Password"
                  type="password"
                  {...register("password")}
                  placeholder="••••••••"
                  error={errors.password?.message}
                 
                />

                <Button
                  type="submit"
                  loading={loading}
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
                  <span className="px-4 bg-card text-muted-foreground font-bold tracking-widest uppercase text-xs">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">

                <Button
                  variant="outline"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full font-bold"
                >
                  Google
                </Button>

                <Button
                  variant="outline"
                  onClick={handleLinkedInLogin}
                  disabled={loading}
                  className="w-full font-bold"
                >
                  LinkedIn
                </Button>

              </div>

              <p className="text-center text-sm font-medium text-muted-foreground mt-8">
                Don't have an account?{' '}

                <Link
                  to="/register"
                  className="text-primary hover:text-primary/80 font-bold transition-colors underline decoration-primary/30 underline-offset-4"
                >
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
                  Verify & Sign In
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
                {useBackup
                  ? 'Use authenticator app instead'
                  : 'Use a backup code instead'}
              </button>
            </>
          )}

        </Card>
      </div>
    </div>
  )
}