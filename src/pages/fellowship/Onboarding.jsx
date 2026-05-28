import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { fellowshipApi } from '../../services/api'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import {
    GraduationCap,
    Building2,
    ArrowRight,
    Mail,
    Loader2,
    CheckCircle,
    ShieldCheck
} from 'lucide-react'

const MotionDiv = motion.div
const MotionButton = motion.button

export default function Onboarding() {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [step, setStep] = useState('role')
    const [companyName, setCompanyName] = useState('')
    const [collegeName, setCollegeName] = useState('')
    const [bio, setBio] = useState('')
    const [email, setEmail] = useState(user?.email || '')
    const [verificationCode, setVerificationCode] = useState('')
    const [loading, setLoading] = useState(false)

    const handleRoleSelect = (selectedRole) => {
        if (selectedRole === 'corporate') {
            setStep('company')
        } else {
            setStep('verify')
        }
    }

    const handleCompanySubmit = async () => {
        if (!companyName.trim()) {
            toast.error('Please enter your company name')
            return
        }

        setLoading(true)
        try {
            await fellowshipApi.createProfile({
                role: 'corporate',
                companyName: companyName.trim(),
                bio: bio.trim() || null
            })
            toast.success('Profile created!')
            navigate('/fellowship/challenges')
        } catch (error) {
            toast.error(error.message || 'Failed to save profile')
        } finally {
            setLoading(false)
        }
    }

    const handleSendVerification = async () => {
        if (!email.trim()) {
            toast.error('Please enter your email')
            return
        }

        setLoading(true)
        try {
            await fellowshipApi.createProfile({
                role: 'student',
                collegeName: collegeName.trim() || null,
                bio: bio.trim() || null
            })
            await fellowshipApi.sendVerificationEmail(email)
            toast.success('Verification code sent!')
            setStep('code')
        } catch (error) {
            toast.error(error.message || 'Failed to send verification')
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyCode = async () => {
        if (!verificationCode.trim()) {
            toast.error('Please enter the verification code')
            return
        }

        setLoading(true)
        try {
            await fellowshipApi.confirmVerification(verificationCode)
            toast.success('Verified successfully!')
            setStep('success')
            setTimeout(() => navigate('/fellowship/challenges'), 1500)
        } catch (error) {
            toast.error(error.message || 'Invalid code')
        } finally {
            setLoading(false)
        }
    }

    const handleSkipVerification = async () => {
        setLoading(true)
        try {
            await fellowshipApi.createProfile({
                role: 'student',
                collegeName: collegeName.trim() || null,
                bio: bio.trim() || null
            })
            navigate('/fellowship/challenges')
        } catch (error) {
            toast.error(error.message || 'Failed to save profile')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[70vh] flex items-center justify-center py-12">
            <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg"
            >
                {step === 'role' && (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-foreground">Choose Your Role</h1>
                            <p className="mt-2 text-muted-foreground">How will you use Fellowships?</p>
                        </div>

                        <div className="grid gap-4">
                            <MotionButton
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleRoleSelect('student')}
                                disabled={loading}
                                className="flex items-center gap-4 p-6 bg-background border border-border rounded-2xl hover:border-emerald-500/50 transition-all text-left"
                            >
                                <div className="w-14 h-14 rounded-xl bg-emerald-950 flex items-center justify-center">
                                    <GraduationCap className="w-7 h-7 text-emerald-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-foreground">I'm a Student</h3>
                                    <p className="text-sm text-muted-foreground">Browse challenges, submit proposals, earn money</p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-muted-foreground" />
                            </MotionButton>

                            <MotionButton
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleRoleSelect('corporate')}
                                disabled={loading}
                                className="flex items-center gap-4 p-6 bg-background border border-border rounded-2xl hover:border-blue-500/50 transition-all text-left"
                            >
                                <div className="w-14 h-14 rounded-xl bg-blue-950 flex items-center justify-center">
                                    <Building2 className="w-7 h-7 text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-foreground">I'm a Company</h3>
                                    <p className="text-sm text-muted-foreground">Post challenges, find talent, get work done</p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-muted-foreground" />
                            </MotionButton>
                        </div>
                    </div>
                )}

                {step === 'company' && (
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="mx-auto w-16 h-16 rounded-xl bg-blue-950 flex items-center justify-center mb-4">
                                <Building2 className="w-8 h-8 text-blue-400" />
                            </div>
                            <h1 className="text-2xl font-bold text-foreground">Company Details</h1>
                            <p className="mt-2 text-muted-foreground">Tell us about your organization</p>
                        </div>

                        <div className="space-y-4">
                            <input
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder="Company Name"
                                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-500"
                            />

                            <div>
                                <label htmlFor="company-bio" className="block text-sm text-muted-foreground mb-2">Profile summary (optional)</label>
                                <textarea
                                    id="company-bio"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    maxLength={500}
                                    rows={4}
                                    placeholder="Briefly describe your organization and the kind of challenges you offer"
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-500 resize-none"
                                />
                                <p className="mt-1 text-right text-xs text-muted-foreground">{bio.length}/500 characters</p>
                            </div>

                            <button
                                onClick={handleCompanySubmit}
                                disabled={loading || !companyName.trim()}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-foreground rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continue'}
                            </button>
                        </div>
                    </div>
                )}

                {step === 'verify' && (
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="mx-auto w-16 h-16 rounded-xl bg-emerald-950 flex items-center justify-center mb-4">
                                <ShieldCheck className="w-8 h-8 text-emerald-400" />
                            </div>
                            <h1 className="text-2xl font-bold text-foreground">Verify Student Status</h1>
                            <p className="mt-2 text-muted-foreground">Use your academic email (.edu, .ac.in)</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">College/University (optional)</label>
                                <input
                                    type="text"
                                    value={collegeName}
                                    onChange={(e) => setCollegeName(e.target.value)}
                                    placeholder="College/University name"
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="student-bio" className="block text-sm text-muted-foreground mb-2">Profile summary (optional)</label>
                                <textarea
                                    id="student-bio"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    maxLength={500}
                                    rows={4}
                                    placeholder="Briefly describe your background, skills, and what you want to work on"
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 resize-none"
                                />
                                <p className="mt-1 text-right text-xs text-muted-foreground">{bio.length}/500 characters</p>
                            </div>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="yourname@college.ac.in"
                                    className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <button
                                onClick={handleSendVerification}
                                disabled={loading || !email.trim()}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-foreground rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Verification Code'}
                            </button>

                            <button
                                onClick={handleSkipVerification}
                                disabled={loading}
                                className="w-full py-2 text-muted-foreground hover:text-foreground text-sm disabled:opacity-50"
                            >
                                Skip for now (you can verify later)
                            </button>
                        </div>
                    </div>
                )}

                {step === 'code' && (
                    <div className="space-y-6">
                        <div className="text-center">
                            <div className="mx-auto w-16 h-16 rounded-xl bg-emerald-950 flex items-center justify-center mb-4">
                                <Mail className="w-8 h-8 text-emerald-400" />
                            </div>
                            <h1 className="text-2xl font-bold text-foreground">Enter Verification Code</h1>
                            <p className="mt-2 text-muted-foreground">Check your email for the 6-digit code</p>
                        </div>

                        <div className="space-y-4">
                            <input
                                type="text"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="000000"
                                maxLength={6}
                                className="w-full px-4 py-4 bg-background border border-border rounded-xl text-foreground text-center text-2xl tracking-widest placeholder:text-muted-foreground/80 focus:outline-none focus:border-emerald-500"
                            />

                            <button
                                onClick={handleVerifyCode}
                                disabled={loading || verificationCode.length !== 6}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-foreground rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify'}
                            </button>

                            <button
                                onClick={handleSendVerification}
                                disabled={loading}
                                className="w-full py-2 text-muted-foreground hover:text-foreground text-sm"
                            >
                                Resend code
                            </button>
                        </div>
                    </div>
                )}

                {step === 'success' && (
                    <div className="text-center space-y-4">
                        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-950 flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">Verified!</h1>
                        <p className="text-muted-foreground">Redirecting to challenges...</p>
                    </div>
                )}
            </MotionDiv>
        </div>
    )
}
