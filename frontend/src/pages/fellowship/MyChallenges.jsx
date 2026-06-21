import { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { fellowshipApi } from '../../services/api'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import logger from '../../../utils/logger';
import {
    FolderKanban,
    Plus,
    Clock,
    Users,
    IndianRupee,
    Trash2,
    Loader2
} from 'lucide-react'

const STATUS_CONFIG = {
    open: { label: 'Open', color: 'bg-emerald-950 text-emerald-400' },
    in_progress: { label: 'In Progress', color: 'bg-blue-950 text-blue-400' },
    completed: { label: 'Completed', color: 'bg-muted text-muted-foreground' },
    cancelled: { label: 'Cancelled', color: 'bg-red-950 text-red-400' },
}

export default function MyChallenges() {
    const navigate = useNavigate()
    const { profile } = useOutletContext()
    const [challenges, setChallenges] = useState([])
    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState(null)
    const [confirmDelete, setConfirmDelete] = useState(null)

    useEffect(() => {
        if (profile?.role === 'student') {
            navigate('/fellowship/my-proposals')
            return
        }
        if (profile?.role === 'corporate') {
            loadChallenges()
        } else {
            setLoading(false)
        }
    }, [profile])

    const loadChallenges = async () => {
        try {
            const response = await fellowshipApi.getMyChallenges()
            setChallenges(response.data)
        } catch (error) {
            logger.error('Failed to load challenges:', error);
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (challengeId) => {
        setDeleting(challengeId)
        try {
            await fellowshipApi.deleteChallenge(challengeId)
            toast.success('Challenge deleted successfully')
            setChallenges(prev => prev.filter(c => c._id !== challengeId))
            setConfirmDelete(null)
        } catch (error) {
            toast.error(error.message || 'Failed to delete challenge')
        } finally {
            setDeleting(null)
        }
    }

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-32 bg-background border border-border rounded-2xl animate-pulse" />
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">My Challenges</h1>
                    <p className="text-muted-foreground">Manage your posted challenges</p>
                </div>
                <button
                    onClick={() => navigate('/fellowship/create-challenge')}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-foreground rounded-xl font-medium"
                >
                    <Plus className="w-4 h-4" />
                    New Challenge
                </button>
            </div>

            {challenges.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
                    <FolderKanban className="h-12 w-12 text-muted-foreground/80" />
                    <h3 className="mt-4 text-lg font-semibold text-foreground">No challenges yet</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Post your first challenge to find student talent</p>
                    <button
                        onClick={() => navigate('/fellowship/create-challenge')}
                        className="mt-4 flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-foreground rounded-xl font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Post Challenge
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {challenges.map(challenge => {
                        const status = STATUS_CONFIG[challenge.status] || STATUS_CONFIG.open
                        const deadlineDate = new Date(challenge.deadline)
                        const isValidDeadline = !Number.isNaN(deadlineDate.getTime())
                        const daysLeft = isValidDeadline
                            ? Math.ceil((deadlineDate - new Date()) / (1000 * 60 * 60 * 24))
                            : null
                        const priceValue = Number(challenge.price)
                        const formattedPrice = Number.isFinite(priceValue) ? priceValue.toLocaleString('en-IN') : '0'

                        return (
                            <motion.div
                                key={challenge._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-background border border-border rounded-2xl p-5 hover:border-border transition-colors"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-foreground">{challenge.title}</h3>
                                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{challenge.description}</p>
                                    </div>
                                    <span className={`px-3 py-1.5 rounded-lg text-sm ${status.color}`}>
                                        {status.label}
                                    </span>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                                    <div className="flex items-center gap-1 text-emerald-400">
                                        <IndianRupee className="w-4 h-4" />
                                        ₹{formattedPrice}
                                    </div>
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        <Users className="w-4 h-4" />
                                        {challenge.proposalCount || 0} proposals
                                    </div>
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        <Clock className="w-4 h-4" />
                                        {daysLeft === null ? 'Unknown' : daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                                    </div>
                                </div>

                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={() => navigate(`/fellowship/challenges/${challenge._id}`)}
                                        className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm hover:bg-muted/80"
                                    >
                                        View Details
                                    </button>
                                    {challenge.proposalCount > 0 && (
                                        <button
                                            onClick={() => navigate(`/fellowship/challenges/${challenge._id}/proposals`)}
                                            className="px-4 py-2 bg-emerald-600 text-foreground rounded-lg text-sm hover:bg-emerald-500"
                                        >
                                            Review Proposals
                                        </button>
                                    )}

                                    {confirmDelete === challenge._id ? (
                                        <div className="flex gap-2 ml-auto">
                                            <button
                                                onClick={() => handleDelete(challenge._id)}
                                                disabled={deleting === challenge._id}
                                                className="px-4 py-2 bg-red-600 text-foreground rounded-lg text-sm hover:bg-red-500 disabled:opacity-50 flex items-center gap-2"
                                            >
                                                {deleting === challenge._id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    'Confirm'
                                                )}
                                            </button>
                                            <button
                                                onClick={() => setConfirmDelete(null)}
                                                className="px-4 py-2 bg-card text-foreground rounded-lg text-sm hover:bg-muted/60"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setConfirmDelete(challenge._id)}
                                            className="px-3 py-2 bg-muted text-red-400 rounded-lg text-sm hover:bg-red-950 ml-auto"
                                            title="Delete challenge"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
