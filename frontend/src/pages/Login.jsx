import { useState } from 'react'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
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
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../config/firebase'

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
    validate: (value) =>
      value === value.trim() || 'Password cannot start or end with spaces',
  },
}

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
  const [forgotPassword, setForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetMessage, setResetMessage] = useState('')
  const [resetError, setResetError] = useState('')



  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
  const newErrors = {}

  // Email validation
  if (!formData.email.trim()) {
    newErrors.email = 'Email is required'
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
  ) {
    newErrors.email = 'Please enter a valid email address'
  }

  // Password validation
  if (!formData.password.trim()) {
    newErrors.password = 'Password is required'
  } else if (formData.password.length < 8) {
    newErrors.password = 'Password must be at least 8 characters'
  } else if (!/(?=.*[A-Z])/.test(formData.password)) {
    newErrors.password = 'Password must contain at least one uppercase letter'
  } else if (!/(?=.*[a-z])/.test(formData.password)) {
    newErrors.password = 'Password must contain at least one lowercase letter'
  } else if (!/(?=.*\d)/.test(formData.password)) {
    newErrors.password = 'Password must contain at least one number'
  }

  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return


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


    setLoading(true)

    try {
      loginWithLinkedIn()


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

  const handlePasswordReset = async (e) => {
  e.preventDefault()
  setResetMessage('')
  setResetError('')
  try {
    await sendPasswordResetEmail(auth, resetEmail)
    setResetMessage('Password reset email sent! Check your inbox.')
  } catch (error) {
    setResetError(error.message || 'Failed to send reset email. Please try again.')
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

                  {...register("password")}
                  placeholder="••••••••"
                  error={errors.password?.message}
                 
                />

                <Button
                  type="submit"
                  loading={loading}

                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register('password', validationRules.password)}
                />

                {/* Forgot Password Link */}
                <div className="text-right -mt-2 mb-2">
                  <button
                    type="button"
                    onClick={() => { setForgotPassword(true); setResetMessage(''); setResetError('') }}
                    className="text-sm text-primary hover:text-primary/80 font-bold underline underline-offset-4 decoration-primary/30"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Forgot Password Form */}
                {forgotPassword && (
                  <div className="mb-4 p-4 border border-border/50 rounded-lg bg-card/60">
                    <h3 className="text-sm font-bold mb-3 text-foreground">Reset your password</h3>
                    <form onSubmit={handlePasswordReset}>
                      <Input
                        label="Email"
                        type="email"
                        placeholder="you@example.com"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                      />
                      <Button type="submit" className="w-full mt-2 font-bold">
                        Send Reset Email
                      </Button>
                    </form>
                    {resetMessage && <p className="text-green-500 text-sm mt-2 font-medium">{resetMessage}</p>}
                    {resetError && <p className="text-red-500 text-sm mt-2 font-medium">{resetError}</p>}
                    <button
                      type="button"
                      onClick={() => setForgotPassword(false)}
                      className="text-xs text-muted-foreground mt-2 underline hover:text-foreground transition-colors"
                    >
                      Back to Login
                    </button>
                  </div>
                )}

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
                  <span className="px-4 bg-card text-muted-foreground font-bold tracking-widest uppercase text-xs">
                    Or continue with
                  </span>
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
                  Google
                </Button>

                <Button
                  variant="outline"
                  onClick={handleLinkedInLogin}
                  disabled={linkedinLoading}
                  loading={linkedinLoading}
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
                  Verify & Sign In
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