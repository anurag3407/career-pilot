import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Input from '../components/Input'
import Button from '../components/Button'
import Card from '../components/Card'

// Stat card with mouse-proximity bluish glow
function GlowCard({ value, label, delay, mounted }) {
  const cardRef = useRef(null)
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50, opacity: 0 })

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setGlowPos({ x, y, opacity: 1 })
  }

  const handleMouseLeave = () => {
    setGlowPos(prev => ({ ...prev, opacity: 0 }))
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-2xl overflow-hidden p-4 cursor-default"
      style={{
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(12px)',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(12px)',
        transition: `opacity 0.5s ease ${delay}, transform 0.5s ease ${delay}`,
      }}
    >
      {/* Glow spotlight */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(34,211,238,0.25) 0%, rgba(99,102,241,0.15) 40%, transparent 70%)`,
          opacity: glowPos.opacity,
          transition: 'opacity 0.3s ease',
        }}
      />
      {/* Border glow */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          boxShadow: `inset 0 0 0 1px rgba(34,211,238,${glowPos.opacity * 0.4})`,
          transition: 'box-shadow 0.3s ease',
        }}
      />
      <p className="relative text-xl font-black" style={{ background: 'linear-gradient(90deg, #22d3ee, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        {value}
      </p>
      <p className="relative text-[11px] text-white/40 mt-1 leading-tight">{label}</p>
    </div>
  )
}

export default function Register() {
  const navigate = useNavigate()
  const { signup, loginWithGoogle, loginWithLinkedIn } = useAuth()
  const [mounted, setMounted] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [focusedField, setFocusedField] = useState(null)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getPasswordStrength = (password) => {
    let score = 0
    if (password.length >= 6) score++
    if (password.length >= 10) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return score
  }

  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong']
  const strengthColors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4']

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
    if (name === 'password') {
      setPasswordStrength(getPasswordStrength(value))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Enter a valid email'
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      await signup(formData.email, formData.password, formData.name)
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setLoading(true)
    try {
      await loginWithGoogle()
      toast.success('Welcome!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.message || 'Failed to sign up with Google')
    } finally {
      setLoading(false)
    }
  }

  const handleLinkedInSignup = async () => {
    setLoading(true)
    try {
      await loginWithLinkedIn()
      toast.success('Welcome!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.message || 'Failed to sign up with LinkedIn')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { label: 'Build Profile', icon: '◎', x: 'left-8', y: 'bottom-12', delay: '0s' },
    { label: 'Get Matched', icon: '◉', x: 'left-1/2 -translate-x-1/2', y: 'top-1/2 -translate-y-1/2', delay: '0.4s' },
    { label: 'Land Job', icon: '●', x: 'right-8', y: 'top-10', delay: '0.8s' },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#060812' }}>
      {/* ── Frosted glass blur gradient blobs ── */}
      {/* Top-right violet */}
      <div className="absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full pointer-events-none animate-blob"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.55) 0%, rgba(109,40,217,0.3) 40%, transparent 70%)', filter: 'blur(90px)' }} />
      {/* Bottom-left deep blue */}
      <div className="absolute -bottom-40 -left-40 w-[650px] h-[650px] rounded-full pointer-events-none animate-blob animation-delay-2000"
        style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.5) 0%, rgba(29,78,216,0.3) 40%, transparent 70%)', filter: 'blur(100px)' }} />
      {/* Center cyan accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none animate-blob animation-delay-4000"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.2) 0%, rgba(8,145,178,0.1) 50%, transparent 70%)', filter: 'blur(80px)' }} />
      {/* Top-left pink/rose */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none animate-blob animation-delay-3000"
        style={{ background: 'radial-gradient(circle, rgba(219,39,119,0.2) 0%, rgba(157,23,77,0.1) 50%, transparent 70%)', filter: 'blur(80px)' }} />
      {/* Bottom-right indigo */}
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] rounded-full pointer-events-none animate-blob animation-delay-5000"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, rgba(67,56,202,0.15) 50%, transparent 70%)', filter: 'blur(90px)' }} />

      <Navbar />

      <div
        className="relative z-10 min-h-[calc(100vh-80px)] pt-20 px-4 pb-12 flex items-center justify-center"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}
      >
        <div className="w-full max-w-6xl grid lg:grid-cols-2 rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-2xl shadow-[0_32px_80px_rgba(0,0,0,0.4)]">

          {/* ── LEFT PANEL ── */}
          <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(99,102,241,0.10) 50%, rgba(15,15,25,0.95) 100%)' }}
          >
            {/* Subtle grid overlay */}
            <div className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }}
            />

            {/* Animated ring decoration */}
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border border-cyan-400/10 animate-spin" style={{ animationDuration: '20s' }} />
            <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full border border-cyan-400/5 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-400">
                  Careerpilot
                </p>
              </div>

              <h2 className="text-[2.6rem] font-black leading-[1.1] text-white tracking-tight">
                Start building
                <br />
                <span style={{ background: 'linear-gradient(90deg, #22d3ee, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  your career
                </span>
                <br />
                journey today.
              </h2>

              <p className="mt-5 text-sm text-white/50 leading-relaxed max-w-xs">
                Create your profile, improve your resume with AI, track applications, and discover better opportunities — all in one place.
              </p>

              {/* Career journey illustration */}
              <div className="mt-10 relative h-56 w-full">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 220" preserveAspectRatio="none">
                  {/* Track shadow */}
                  <path d="M40,200 C120,180 200,110 360,30" fill="none" stroke="rgba(34,211,238,0.06)" strokeWidth="12" strokeLinecap="round" />
                  {/* Base track */}
                  <path d="M40,200 C120,180 200,110 360,30" fill="none" stroke="rgba(34,211,238,0.15)" strokeWidth="2" strokeLinecap="round" />
                  {/* Animated dashed line */}
                  <path
                    d="M40,200 C120,180 200,110 360,30"
                    fill="none"
                    stroke="rgba(34,211,238,0.7)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="8 6"
                    style={{ animation: 'dash 2.5s linear infinite' }}
                  />
                </svg>

                {/* Step nodes */}
                {steps.map((step, i) => (
                  <div
                    key={i}
                    className={`absolute ${step.x} ${step.y} flex flex-col items-center gap-2`}
                    style={{
                      opacity: mounted ? 1 : 0,
                      transform: mounted ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.9)',
                      transition: `opacity 0.5s ease ${step.delay}, transform 0.5s ease ${step.delay}`,
                    }}
                  >
                    <div className="relative">
                      <div
                        className="w-4 h-4 rounded-full border-2 border-slate-900"
                        style={{ background: i === 2 ? '#22d3ee' : '#06b6d4', boxShadow: `0 0 ${i === 2 ? 20 : 12}px rgba(34,211,238,${i === 2 ? 0.9 : 0.6})` }}
                      />
                      {/* Ping ring */}
                      <div
                        className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping"
                        style={{ animationDelay: step.delay, animationDuration: '2s' }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-cyan-200/80 tracking-wider whitespace-nowrap">
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats row — mouse-drag bluish glow */}
            <div className="relative z-10 grid grid-cols-3 gap-3">
              {[
                { value: 'AI', label: 'Resume insights', delay: '0.2s' },
                { value: 'Jobs', label: 'Smart tracking', delay: '0.3s' },
                { value: '10x', label: 'More interviews', delay: '0.4s' },
              ].map((stat, i) => (
                <GlowCard key={i} value={stat.value} label={stat.label} delay={stat.delay} mounted={mounted} />
              ))}
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="p-6 sm:p-10 lg:p-12 flex items-center backdrop-blur-xl" style={{ background: 'rgba(11,15,26,0.75)' }}>
            <div className="w-full">
              <div
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 0.6s ease 0.15s, transform 0.6s ease 0.15s',
                }}
              >
                <h1 className="text-3xl font-black text-center mb-1 text-foreground tracking-tight">
                  Create Account
                </h1>
                <p className="text-center text-sm text-muted-foreground mb-8">
                  Join thousands building their dream career
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-1">
                  {/* Name */}
                  <div>
                    <Input
                      label="Full Name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="John Doe"
                      error={errors.name}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <Input
                      label="Email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="you@example.com"
                      error={errors.email}
                      required
                    />
                  </div>

                  {/* Password with strength meter */}
                  <div>
                    <div className="relative">
                      <Input
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        placeholder="••••••••"
                        error={errors.password}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(p => !p)}
                        className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors text-xs select-none"
                        tabIndex={-1}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    {/* Password strength bar */}
                    {formData.password && (
                      <div className="mt-1.5 px-0.5">
                        <div className="flex gap-1 h-1">
                          {[1, 2, 3, 4, 5].map(i => (
                            <div
                              key={i}
                              className="flex-1 rounded-full transition-all duration-300"
                              style={{
                                background: i <= passwordStrength ? strengthColors[passwordStrength] : 'rgba(255,255,255,0.08)',
                              }}
                            />
                          ))}
                        </div>
                        <p className="text-[10px] mt-1 font-medium" style={{ color: strengthColors[passwordStrength] }}>
                          {strengthLabels[passwordStrength]}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="relative">
                    <Input
                      label="Confirm Password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('confirmPassword')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="••••••••"
                      error={errors.confirmPassword}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(p => !p)}
                      className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors text-xs select-none"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? 'Hide' : 'Show'}
                    </button>
                    {/* Match indicator */}
                    {formData.confirmPassword && formData.password && (
                      <p className={`text-[10px] mt-1 font-medium px-0.5 ${formData.password === formData.confirmPassword ? 'text-green-400' : 'text-red-400'}`}>
                        {formData.password === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                      </p>
                    )}
                  </div>

                  <div className="pt-3">
                    <Button
                      type="submit"
                      loading={loading}
                      className="w-full font-bold relative overflow-hidden group"
                      style={{
                        background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
                        border: 'none',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.75rem',
                        fontSize: '0.95rem',
                        letterSpacing: '0.02em',
                        transition: 'transform 0.2s, box-shadow 0.2s, opacity 0.2s',
                        boxShadow: '0 4px 20px rgba(6,182,212,0.3)',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-1px)'
                        e.currentTarget.style.boxShadow = '0 8px 30px rgba(6,182,212,0.45)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(6,182,212,0.3)'
                      }}
                    >
                      {loading ? 'Creating Account…' : 'Create Account →'}
                    </Button>
                  </div>
                </form>

                {/* Divider */}
                <div className="relative my-7">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/8" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-4 bg-background text-muted-foreground font-semibold tracking-widest uppercase">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Social buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleGoogleSignup}
                    disabled={loading}
                    className="flex items-center justify-center gap-2.5 w-full font-semibold text-sm border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-foreground rounded-xl py-3 px-4 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    onClick={handleLinkedInSignup}
                    disabled={loading}
                    className="flex items-center justify-center gap-2.5 w-full font-semibold text-sm border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-foreground rounded-xl py-3 px-4 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backdropFilter: 'blur(8px)' }}
                  >
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="#0A66C2">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </button>
                </div>

                <p className="text-center text-sm text-muted-foreground mt-7">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-bold transition-colors underline underline-offset-4"
                    style={{ color: '#22d3ee', textDecoration: 'underline', textDecorationColor: 'rgba(34,211,238,0.4)' }}
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Keyframe styles */}
      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -28; }
        }
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(30px, -30px) scale(1.05); }
          66%       { transform: translate(-20px, 20px) scale(0.97); }
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