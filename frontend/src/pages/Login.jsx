import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Input from '../components/Input'
import Button from '../components/Button'
import Card from '../components/Card'
import { twoFactorApi } from '../services/api'

// Reusable mouse-drag glow card (same as Register.jsx)
function GlowCard({ value, label }) {
  const cardRef = useRef(null)
  const [glow, setGlow] = useState({ x: 50, y: 50, opacity: 0 })

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect()
    setGlow({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      opacity: 1,
    })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setGlow(p => ({ ...p, opacity: 0 }))}
      className="relative rounded-2xl overflow-hidden p-4 cursor-default"
      style={{
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(12px)',
        transition: 'transform 0.3s ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
    >
      {/* Bluish glow spotlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(34,211,238,0.28) 0%, rgba(99,102,241,0.18) 40%, transparent 70%)`,
          opacity: glow.opacity,
          transition: 'opacity 0.3s ease',
        }}
      />
      {/* Border highlight on hover */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          boxShadow: `inset 0 0 0 1px rgba(34,211,238,${glow.opacity * 0.45})`,
          transition: 'box-shadow 0.3s ease',
        }}
      />
      <p className="relative text-2xl font-black" style={{ background: 'linear-gradient(90deg, #22d3ee, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        {value}
      </p>
      <p className="relative text-sm text-white/40 mt-1">{label}</p>
    </div>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const { login, loginWithGoogle, loginWithLinkedIn } = useAuth()

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [step, setStep] = useState('credentials')
  const [totpToken, setTotpToken] = useState('')
  const [useBackup, setUseBackup] = useState(false)
  const [totpLoading, setTotpLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address'
    if (!formData.password) newErrors.password = 'Password is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    try {
      const response = await login(formData.email, formData.password)
      if (response && response.twoFactorRequired) {
        setStep('totp')
        toast.success('Two-factor authentication required')
      } else {
        toast.success('Signed in successfully!')
        navigate('/dashboard')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to sign in. Please check your credentials.')
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
      toast.error(error.message || 'Failed to sign in with Google')
    } finally {
      setLoading(false)
    }
  }

  const handleLinkedInLogin = () => {
    if (!loginWithLinkedIn) { toast.error('LinkedIn login is not configured.'); return }
    setLoading(true)
    try {
      loginWithLinkedIn()
    } catch (error) {
      toast.error(error.message || 'Failed to login with LinkedIn')
      setLoading(false)
    }
  }

  const handleTotpSubmit = async (e) => {
    e.preventDefault()
    if (!totpToken.trim()) return
    setTotpLoading(true)
    try {
      if (useBackup) await twoFactorApi.verifyBackup(totpToken)
      else await twoFactorApi.verify(totpToken)
      toast.success('Verification successful!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.message || 'Invalid code — please try again')
    } finally {
      setTotpLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: '#060812' }}
    >
      {/* ── Frosted glass blur gradient blobs ── */}
      <div className="absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full pointer-events-none animate-blob"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.55) 0%, rgba(109,40,217,0.3) 40%, transparent 70%)', filter: 'blur(90px)' }} />
      <div className="absolute -bottom-40 -left-40 w-[650px] h-[650px] rounded-full pointer-events-none animate-blob animation-delay-2000"
        style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.5) 0%, rgba(29,78,216,0.3) 40%, transparent 70%)', filter: 'blur(100px)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none animate-blob animation-delay-4000"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, rgba(8,145,178,0.1) 50%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none animate-blob animation-delay-3000"
        style={{ background: 'radial-gradient(circle, rgba(219,39,119,0.2) 0%, rgba(157,23,77,0.1) 50%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] rounded-full pointer-events-none animate-blob animation-delay-5000"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, rgba(67,56,202,0.15) 50%, transparent 70%)', filter: 'blur(90px)' }} />

      <Navbar />

      <div className="relative z-10 min-h-[calc(100vh-80px)] pt-20 px-4 pb-12 flex items-center justify-center">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_32px_80px_rgba(0,0,0,0.4)]">

          {/* ── LEFT PANEL ── */}
          <div
            className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(99,102,241,0.10) 50%, rgba(15,15,25,0.95) 100%)' }}
          >
            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            {/* Spinning rings */}
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border border-cyan-400/10 animate-spin" style={{ animationDuration: '20s' }} />
            <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full border border-cyan-400/5 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-400">Careerpilot</p>
              </div>

              <h2 className="text-[2.6rem] font-black leading-[1.1] text-white tracking-tight">
                Welcome back to
                <br />
                <span style={{ background: 'linear-gradient(90deg, #22d3ee, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  your career
                </span>
                <br />
                command center.
              </h2>

              <p className="mt-5 text-sm text-white/50 leading-relaxed max-w-xs">
                Continue tracking applications, improving resumes, and finding better job opportunities with AI-powered tools.
              </p>

              {/* AI Match Illustration */}
              <div className="mt-10 relative flex items-center justify-center h-56 w-full">
                <div className="absolute inset-0 opacity-40 rounded-2xl" style={{ background: 'radial-gradient(ellipse at center, rgba(34,211,238,0.08) 0%, transparent 70%)' }} />

                {/* Central pulsing node with wave rings */}
                <div className="relative z-10 flex flex-col items-center justify-center w-32 h-32 rounded-full"
                  style={{
                    border: '1.5px solid rgba(34,211,238,0.6)',
                    background: 'radial-gradient(circle, rgba(8,50,60,0.95) 0%, rgba(6,20,30,0.98) 100%)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 0 60px rgba(34,211,238,0.35), 0 0 120px rgba(34,211,238,0.15), inset 0 0 30px rgba(34,211,238,0.08)',
                  }}
                >
                  {/* Wave ring 1 — fastest */}
                  <div className="absolute rounded-full pointer-events-none" style={{
                    inset: '-12px',
                    border: '1.5px solid rgba(34,211,238,0.5)',
                    animation: 'wave-ring 2s ease-out infinite',
                  }} />
                  {/* Wave ring 2 — medium */}
                  <div className="absolute rounded-full pointer-events-none" style={{
                    inset: '-12px',
                    border: '1.5px solid rgba(34,211,238,0.35)',
                    animation: 'wave-ring 2s ease-out infinite',
                    animationDelay: '0.65s',
                  }} />
                  {/* Wave ring 3 — slowest */}
                  <div className="absolute rounded-full pointer-events-none" style={{
                    inset: '-12px',
                    border: '1px solid rgba(99,102,241,0.3)',
                    animation: 'wave-ring 2s ease-out infinite',
                    animationDelay: '1.3s',
                  }} />
                  <span className="text-[10px] font-bold tracking-widest text-cyan-400 mb-1 uppercase">AI-Match</span>
                  <span className="text-4xl font-black text-white tracking-tight">92%</span>
                </div>

                {/* Floating nodes */}
                <div className="absolute top-8 left-12 flex items-center gap-2 opacity-80 animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" style={{ boxShadow: '0 0 10px rgba(34,211,238,0.8)' }} />
                  <span className="text-xs text-cyan-200/70">Skills Fit</span>
                </div>
                <div className="absolute bottom-10 right-12 flex items-center gap-2 opacity-80 animate-pulse" style={{ animationDelay: '0.15s' }}>
                  <div className="w-2 h-2 rounded-full bg-cyan-400" style={{ boxShadow: '0 0 10px rgba(34,211,238,0.8)' }} />
                  <span className="text-xs text-cyan-200/70">Resume Match</span>
                </div>
              </div>
            </div>

            {/* Track / Grow — GlowCards */}
            <div className="relative z-10 grid grid-cols-2 gap-4">
              <GlowCard value="Track" label="Applications" />
              <GlowCard value="Grow" label="Career faster" />
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="p-6 sm:p-10 lg:p-12 flex items-center backdrop-blur-xl" style={{ background: 'rgba(11,15,26,0.75)' }}>
            <Card className="w-full border-white/10 bg-white/5 backdrop-blur-xl">
              {step === 'credentials' ? (
                <>
                  <h1 className="text-3xl font-black text-center mb-1 text-white tracking-tight">Welcome Back</h1>
                  <p className="text-center text-sm text-white/40 mb-8">Sign in to your Careerpilot account</p>

                  <form onSubmit={handleSubmit}>
                    <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" error={errors.email} required />
                    <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" error={errors.password} required />

                    <div className="pt-3">
                      <Button
                        type="submit"
                        loading={loading}
                        className="w-full font-bold"
                        style={{
                          background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
                          border: 'none',
                          color: 'white',
                          padding: '0.75rem 1.5rem',
                          borderRadius: '0.75rem',
                          fontSize: '0.95rem',
                          boxShadow: '0 4px 20px rgba(6,182,212,0.3)',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(6,182,212,0.45)' }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(6,182,212,0.3)' }}
                      >
                        {loading ? 'Signing In…' : 'Sign In →'}
                      </Button>
                    </div>
                  </form>

                  <div className="relative my-7">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/8" /></div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-4 text-white/30 font-semibold tracking-widest uppercase" style={{ background: 'rgba(11,15,26,0.9)' }}>Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      className="flex items-center justify-center gap-2.5 w-full font-semibold text-sm border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white rounded-xl py-3 px-4 transition-all duration-200 disabled:opacity-50"
                      style={{ backdropFilter: 'blur(8px)' }}
                    >
                      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Google
                    </button>
                    <button
                      type="button"
                      onClick={handleLinkedInLogin}
                      disabled={loading}
                      className="flex items-center justify-center gap-2.5 w-full font-semibold text-sm border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-white rounded-xl py-3 px-4 transition-all duration-200 disabled:opacity-50"
                      style={{ backdropFilter: 'blur(8px)' }}
                    >
                      <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="#0A66C2">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      LinkedIn
                    </button>
                  </div>

                  <p className="text-center text-sm text-white/40 mt-7">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-bold underline underline-offset-4" style={{ color: '#22d3ee', textDecorationColor: 'rgba(34,211,238,0.4)' }}>
                      Sign up
                    </Link>
                  </p>
                </>
              ) : (
                <>
                  <div className="flex flex-col items-center mb-6">
                    <div className="p-3 rounded-full mb-4" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
                      <ShieldCheck className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-center text-white">Two-Factor Verification</h1>
                    <p className="text-white/40 text-sm text-center mt-2">
                      {useBackup ? 'Enter one of your backup codes to continue.' : 'Open your authenticator app and enter the 6-digit code.'}
                    </p>
                  </div>

                  <form onSubmit={handleTotpSubmit}>
                    <Input
                      label={useBackup ? 'Backup code' : 'Authenticator code'}
                      type="text"
                      name="totpToken"
                      value={totpToken}
                      onChange={e => setTotpToken(useBackup ? e.target.value.toUpperCase() : e.target.value.replace(/\D/g, '').slice(0, 6))}
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
                    onClick={() => { setUseBackup(v => !v); setTotpToken('') }}
                    className="w-full text-center text-sm text-white/40 hover:text-white transition-colors mt-4 font-bold"
                  >
                    {useBackup ? 'Use authenticator app instead' : 'Use a backup code instead'}
                  </button>
                </>
              )}
            </Card>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes wave-ring {
          0%   { transform: scale(1);    opacity: 0.8; }
          100% { transform: scale(2.2);  opacity: 0; }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0,0) scale(1); }
          33%       { transform: translate(30px,-30px) scale(1.05); }
          66%       { transform: translate(-20px,20px) scale(0.97); }
        }
        .animate-blob { animation: blob 9s infinite ease-in-out; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-3000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-5000 { animation-delay: 5s; }
      `}</style>
    </div>
  )
}