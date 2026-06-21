import { useState, useEffect } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import { fellowshipApi } from '../../services/api'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import logger from '../../../utils/logger';
import {
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    IndianRupee,
    ExternalLink
} from 'lucide-react'

const STATUS_CONFIG = {
    pending: { label: 'Pending', color: 'bg-yellow-950 text-yellow-400', icon: Clock },
    accepted: { label: 'Accepted', color: 'bg-emerald-950 text-emerald-400', icon: CheckCircle },
    rejected: { label: 'Rejected', color: 'bg-red-950 text-red-400', icon: XCircle },
    withdrawn: { label: 'Withdrawn', color: 'bg-muted text-muted-foreground', icon: XCircle },
}

export default function MyProposals() {
    const { profile } = useOutletContext()
    const navigate = useNavigate()
    const [proposals, setProposals] = useState([])
    const [loading, setLoading] = useState(true)

    const formatDate = (value) => {
        const date = new Date(value)
        return Number.isNaN(date.getTime()) ? 'Unknown' : date.toLocaleDateString()
    }

    const formatPrice = (value) => {
        const price = Number(value)
        return Number.isFinite(price) ? price.toLocaleString('en-IN') : '0'
    }

    useEffect(() => {
        if (profile?.role === 'corporate') {
            navigate('/fellowship/my-challenges')
            return
        }
        if (profile?.role === 'student') {
            loadProposals()
        } else {
            setLoading(false)
        }
    }, [profile])

    const loadProposals = async () => {
        try {
            const response = await fellowshipApi.getMyProposals()
            setProposals(response.data)
        } catch (error) {
            logger.error('Failed to load proposals:', error);
        } finally {
            setLoading(false)
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
            <div>
                <h1 className="text-2xl font-bold text-foreground">My Proposals</h1>
                <p className="text-muted-foreground">Track your submitted applications</p>
            </div>

            {proposals.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
                    <FileText className="h-12 w-12 text-muted-foreground/80" />
                    <h3 className="mt-4 text-lg font-semibold text-foreground">No proposals yet</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Start browsing challenges to submit your first proposal</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {proposals.map((proposal) => {
                        const status = STATUS_CONFIG[proposal.status] || STATUS_CONFIG.pending
                        const StatusIcon = status.icon

                        return (
                            <motion.div
                                key={proposal._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-background border border-border rounded-2xl p-5"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-foreground">
                                            {proposal.challenge?.title || 'Challenge'}
                                        </h3>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {proposal.challenge?.companyName || 'Company'}
                                        </p>
                                    </div>
                                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm ${status.color}`}>
                                        <StatusIcon className="w-4 h-4" />
                                        {status.label}
                                    </span>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                                    <div className="flex items-center gap-1 text-emerald-400">
                                        <IndianRupee className="w-4 h-4" />
                                        Your bid: ₹{formatPrice(proposal.proposedPrice)}
                                    </div>
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        <Clock className="w-4 h-4" />
                                        {proposal.estimatedDays} days estimated
                                    </div>
                                </div>

                                {proposal.corporateFeedback && (
                                    <div className="mt-4 p-3 bg-muted rounded-lg">
                                        <p className="text-xs text-muted-foreground mb-1">Feedback from company:</p>
                                        <p className="text-sm text-foreground">{proposal.corporateFeedback}</p>
                                    </div>
                                )}

                                <p className="mt-4 text-xs text-muted-foreground">
                                    Applied on {formatDate(proposal.createdAt)}
                                </p>
                            </motion.div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
