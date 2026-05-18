import { useState } from 'react'
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
  const navigate = useNavigate()
  const { login, loginWithGoogle } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  // Two-factor auth step
  const [step, setStep] = useState('credentials') // 'credentials' | 'totp'
  const [totpToken, setTotpToken] = useState('')
  const [useBackup, setUseBackup] = useState(false)
  const [totpLoading, setTotpLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const checkAndProceed = async () => {
    try {
      const status = await twoFactorApi.getStatus()
      if (status.enabled) {
        setStep('totp')
      } else {
        toast.success('Welcome back!')
        navigate('/dashboard')
      }
    } catch {
      // If 2FA status check fails, proceed without blocking login
      toast.success('Welcome back!')
      navigate('/dashboard')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      await login(formData.email, formData.password)
      await checkAndProceed()
    } catch (error) {
      toast.error(error.message || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      await loginWithGoogle()
      await checkAndProceed()
    } catch (error) {
      toast.error(error.message || 'Failed to login with Google')
    } finally {
      setLoading(false)
    }
  }

  const handleTotpSubmit = async (e) => {
    e.preventDefault()
    if (!totpToken.trim()) return

    setTotpLoading(true)
    try {
      if (useBackup) {
        await twoFactorApi.verifyBackup(totpToken.trim())
      } else {
        await twoFactorApi.verify(totpToken.trim())
      }
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.message || 'Invalid code — please try again')
    } finally {
      setTotpLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="max-w-md mx-auto pt-32 px-4">
        <Card>
          {step === 'credentials' ? (
            <>
              <h1 className="text-2xl font-bold text-center mb-6 text-white">Sign In</h1>

              <form onSubmit={handleSubmit}>
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  error={errors.email}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  error={errors.password}
                  required
                />

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full mt-4"
                >
                  Sign In
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-neutral-900 text-neutral-500">Or continue with</span>
                </div>
              </div>

              <Button
                variant="secondary"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              <p className="text-center text-sm text-neutral-400 mt-6">
                Don't have an account?{' '}
                <Link to="/register" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                  Sign up
                </Link>
              </p>
            </>
          ) : (
            /* ── TOTP step ──────────────────────────────────────── */
            <>
              <div className="flex flex-col items-center mb-6">
                <div className="p-3 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
                  <ShieldCheck className="w-6 h-6 text-indigo-400" />
                </div>
                <h1 className="text-2xl font-bold text-center text-white">
                  Two-Factor Verification
                </h1>
                <p className="text-neutral-400 text-sm text-center mt-2">
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
                  onChange={(e) =>
                    setTotpToken(
                      useBackup
                        ? e.target.value.toUpperCase()
                        : e.target.value.replace(/\D/g, '').slice(0, 6)
                    )
                  }
                  placeholder={useBackup ? 'XXXX-XXXX' : '000000'}
                  className="font-mono tracking-widest text-center text-lg"
                  maxLength={useBackup ? 9 : 6}
                  required
                />

                <Button
                  type="submit"
                  loading={totpLoading}
                  disabled={useBackup ? totpToken.length < 4 : totpToken.length !== 6}
                  className="w-full mt-2"
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
                className="w-full text-center text-sm text-neutral-500 hover:text-neutral-300 transition-colors mt-4"
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
