import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import { fellowshipApi } from '../../services/api'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import {
    ArrowLeft,
    Clock,
    IndianRupee,
    Calendar,
    Building2,
    Loader2,
    Send,
    CheckCircle,
    AlertCircle,
    FileText,
    Users
} from 'lucide-react'
import { SkeletonPanel } from '../../components/ui/Skeleton'

const CATEGORIES = {
    design: { label: 'Design', icon: '🎨' },
    content: { label: 'Content', icon: '✍️' },
    development: { label: 'Development', icon: '💻' },
    research: { label: 'Research', icon: '🔬' },
    marketing: { label: 'Marketing', icon: '📈' },
}

export default function ChallengeDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { profile } = useOutletContext()
    const [challenge, setChallenge] = useState(null)
    const [loading, setLoading] = useState(true)
    const [applying, setApplying] = useState(false)
    const [showApplyForm, setShowApplyForm] = useState(false)
    const [coverLetter, setCoverLetter] = useState('')
    const [estimatedDays, setEstimatedDays] = useState('')
    const [portfolioLinks, setPortfolioLinks] = useState('')
    const [applied, setApplied] = useState(false)

    const loadChallenge = useCallback(async () => {
        try {
            const response = await fellowshipApi.getChallenge(id)
            setChallenge(response.data)
        } catch (error) {
            toast.error('Challenge not found')
            navigate('/fellowship/challenges')
        } finally {
            setLoading(false)
        }
    }, [id, navigate])

    useEffect(() => {
        loadChallenge()
    }, [loadChallenge])

    const handleApply = async () => {
        if (!coverLetter || coverLetter.length < 100) {
            toast.error('Cover letter must be at least 100 characters')
            return
        }
        if (!estimatedDays || parseInt(estimatedDays) < 1) {
            toast.error('Estimated days must be at least 1')
            return
        }

        setApplying(true)
        try {
            await fellowshipApi.applyToChallenge(id, {
                coverLetter,
                proposedPrice: challenge.price,
                estimatedDays: parseInt(estimatedDays),
                portfolioLinks: portfolioLinks.split('\n').filter(l => l.trim())
            })
            toast.success('Proposal submitted!')
            setApplied(true)
            setShowApplyForm(false)
        } catch (error) {
            toast.error(error.message || 'Failed to submit proposal')
        } finally {
            setApplying(false)
        }
    }

    if (loading) {
        return <SkeletonPanel rows={4} className="max-w-3xl mx-auto" />
    }

    if (!challenge) return null

    const category = CATEGORIES[challenge.category] || { label: challenge.category, icon: '📋' }
    const deadlineDate = new Date(challenge.deadline)
    const isValidDeadline = !Number.isNaN(deadlineDate.getTime())
    const daysLeft = isValidDeadline
        ? Math.ceil((deadlineDate - new Date()) / (1000 * 60 * 60 * 24))
        : null
    const isStudent = profile?.role === 'student'
    const canApply = isStudent && profile?.isVerified && challenge.status === 'open' && !applied

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <button type="button"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Challenges
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-background border border-border rounded-2xl overflow-hidden"
            >
                <div className="bg-gradient-to-r from-emerald-900/50 to-neutral-900 p-6 border-b border-border">
                    <div className="flex items-start justify-between gap-4">
                        <span className="px-3 py-1 bg-muted/80 rounded-lg text-sm">
                            {category.icon} {category.label}
                        </span>
                        <div className="text-right">
                            <p className="text-xs text-muted-foreground">Reward</p>
                            <p className="text-2xl font-bold text-emerald-400">
                                ₹{challenge.price.toLocaleString('en-IN')}
                            </p>
                        </div>
                    </div>
                    <h1 className="mt-4 text-2xl font-bold text-foreground">{challenge.title}</h1>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-muted/50 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                                <Building2 className="w-3 h-3" />
                                Company
                            </div>
                            <p className="text-foreground font-medium truncate">{challenge.companyName}</p>
                        </div>
                        <div className="bg-muted/50 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                                <Calendar className="w-3 h-3" />
                                Deadline
                            </div>
                            <p className="text-foreground font-medium">{isValidDeadline ? deadlineDate.toLocaleDateString() : 'Unknown'}</p>
                        </div>
                        <div className="bg-muted/50 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                                <Clock className="w-3 h-3" />
                                Time Left
                            </div>
                            <p className={`font-medium ${daysLeft === null ? 'text-muted-foreground' : daysLeft > 0 ? 'text-foreground' : 'text-red-400'}`}>
                                {daysLeft === null ? 'Unknown' : daysLeft > 0 ? `${daysLeft} days` : 'Expired'}
                            </p>
                        </div>
                        <div className="bg-muted/50 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                                <Users className="w-3 h-3" />
                                Proposals
                            </div>
                            <p className="text-foreground font-medium">{challenge.proposalCount || 0}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
                            <FileText className="w-4 h-4" />
                            Project Description
                        </h3>
                        <div className="bg-muted/30 rounded-xl p-4">
                            <p className="text-foreground whitespace-pre-wrap leading-relaxed">{challenge.description}</p>
                        </div>
                    </div>

                    {challenge.requirements?.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium text-foreground mb-3">Required Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {challenge.requirements.map((req, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-emerald-950 text-emerald-300 rounded-lg text-sm">
                                        {req}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            {applied && (
                <div className="bg-emerald-950 border border-emerald-800 rounded-2xl p-6 flex items-center gap-4">
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                    <div>
                        <h3 className="font-semibold text-emerald-300">Proposal Submitted!</h3>
                        <p className="text-sm text-emerald-400/70">View your proposal in "My Proposals"</p>
                    </div>
                </div>
            )}

            {isStudent && !profile?.isVerified && (
                <div className="bg-amber-950 border border-amber-800 rounded-2xl p-6 flex items-center gap-4">
                    <AlertCircle className="w-8 h-8 text-amber-400" />
                    <div>
                        <h3 className="font-semibold text-amber-300">Verify to Apply</h3>
                        <p className="text-sm text-amber-400/70">You need to verify your student status first</p>
                    </div>
                    <button type="button"
                        onClick={() => navigate('/fellowship/verify')}
                        className="ml-auto px-4 py-2 bg-amber-600 text-foreground rounded-lg text-sm hover:bg-amber-500"
                    >
                        Verify Now
                    </button>
                </div>
            )}

            {canApply && !showApplyForm && (
                <button type="button"
                    onClick={() => setShowApplyForm(true)}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-foreground rounded-2xl font-semibold flex items-center justify-center gap-2"
                >
                    <Send className="w-5 h-5" />
                    Submit Proposal
                </button>
            )}

            {showApplyForm && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-background border border-border rounded-2xl p-6 space-y-5"
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-foreground">Submit Your Proposal</h2>
                        <div className="text-right">
                            <p className="text-xs text-muted-foreground">You will earn</p>
                            <p className="text-lg font-bold text-emerald-400">₹{challenge.price.toLocaleString('en-IN')}</p>
                        </div>
                    </div>

                    <div className="bg-muted/50 rounded-xl p-4 border border-border">
                        <p className="text-sm text-muted-foreground mb-2">You're applying for:</p>
                        <p className="text-foreground font-medium">{challenge.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">by {challenge.companyName}</p>
                    </div>

                    <div>
                        <label className="block text-sm text-muted-foreground mb-2">Cover Letter *</label>
                        <textarea
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            placeholder="Explain why you're the right fit for this challenge. Describe your relevant experience, approach, and what makes you uniquely qualified..."
                            rows={6}
                            className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 resize-none"
                        />
                        <p className="mt-1 text-xs text-muted-foreground">{coverLetter.length}/100 minimum characters</p>
                    </div>

                    <div>
                        <label className="block text-sm text-muted-foreground mb-2">Days to Complete *</label>
                        <input
                            type="number"
                            value={estimatedDays}
                            onChange={(e) => setEstimatedDays(e.target.value)}
                            placeholder="e.g., 7"
                            min="1"
                            className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500"
                        />
                        <p className="mt-1 text-xs text-muted-foreground">How many days do you need to complete this project?</p>
                    </div>

                    <div>
                        <label className="block text-sm text-muted-foreground mb-2">Portfolio Links (optional, one per line)</label>
                        <textarea
                            value={portfolioLinks}
                            onChange={(e) => setPortfolioLinks(e.target.value)}
                            placeholder="https://yourportfolio.com&#10;https://github.com/yourusername"
                            rows={3}
                            className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 resize-none"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button"
                            onClick={() => setShowApplyForm(false)}
                            className="px-6 py-3 bg-muted text-foreground rounded-xl font-medium hover:bg-muted/80"
                        >
                            Cancel
                        </button>
                        <button type="button"
                            onClick={handleApply}
                            disabled={applying}
                            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-foreground rounded-xl font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {applying ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            {applying ? 'Submitting...' : 'Submit Proposal'}
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    )
}
