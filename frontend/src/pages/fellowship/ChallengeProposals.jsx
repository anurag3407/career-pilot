import { useState, useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import { fellowshipApi, paymentApi } from '../../services/api'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import {
    ArrowLeft,
    User,
    Clock,
    IndianRupee,
    ExternalLink,
    CheckCircle,
    XCircle,
    Loader2,
    FileText,
    Mail,
    MessageCircle,
    CreditCard
} from 'lucide-react'

const STATUS_CONFIG = {
    pending: { label: 'Pending', color: 'bg-yellow-950 text-yellow-400', icon: Clock },
    accepted: { label: 'Accepted', color: 'bg-emerald-950 text-emerald-400', icon: CheckCircle },
    rejected: { label: 'Rejected', color: 'bg-red-950 text-red-400', icon: XCircle },
}

export default function ChallengeProposals() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { profile } = useOutletContext()
    const [challenge, setChallenge] = useState(null)
    const [proposals, setProposals] = useState([])
    const [chatRooms, setChatRooms] = useState({})
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(null)
    const [feedback, setFeedback] = useState('')
    const [showFeedbackFor, setShowFeedbackFor] = useState(null)

    const formatDate = (value) => {
        const date = new Date(value)
        return Number.isNaN(date.getTime()) ? 'Unknown' : date.toLocaleDateString()
    }

    useEffect(() => {
        if (profile?.role === 'student') {
            navigate('/fellowship/challenges')
            return
        }
        if (profile?.role === 'corporate') {
            loadData()
        }
    }, [profile, id])

    const loadData = async () => {
        try {
            const [challengeRes, proposalsRes, roomsRes] = await Promise.all([
                fellowshipApi.getChallenge(id),
                fellowshipApi.getChallengeProposals(id),
                fellowshipApi.getChatRooms()
            ])
            setChallenge(challengeRes.data)
            setProposals(proposalsRes.data)

            const roomMap = {}
            roomsRes.data.forEach(room => {
                roomMap[room.proposalId] = room
            })
            setChatRooms(roomMap)
        } catch (error) {
            toast.error('Failed to load proposals')
            navigate('/fellowship/my-challenges')
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateStatus = async (proposalId, status) => {
        setUpdating(proposalId)

        try {
            if (status === 'accepted') {
                // For acceptance, initiate payment flow
                const orderRes = await paymentApi.createOrder(proposalId)
                const orderData = orderRes.data

                if (typeof window === 'undefined' || !window.Razorpay) {
                    toast.error('Payment gateway unavailable. Please try again later.')
                    setUpdating(null)
                    return
                }

                // Configure Razorpay options with all payment methods
                const options = {
                    key: orderData.keyId,
                    amount: orderData.amount,
                    currency: orderData.currency,
                    name: 'careerpilot Fellowships',
                    description: `Payment for: ${orderData.challengeTitle}`,
                    order_id: orderData.orderId,
                    handler: async function (response) {
                        try {
                            // Verify payment and complete acceptance
                            const verifyRes = await paymentApi.verifyPayment({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                proposalId: proposalId,
                                feedback: feedback
                            })

                            toast.success('Payment successful! Proposal accepted.')
                            setShowFeedbackFor(null)
                            setFeedback('')

                            if (verifyRes.data.chatRoom) {
                                setChatRooms(prev => ({
                                    ...prev,
                                    [proposalId]: verifyRes.data.chatRoom
                                }))
                            }

                            loadData()
                        } catch (err) {
                            toast.error(err.message || 'Payment verification failed')
                        } finally {
                            setUpdating(null)
                        }
                    },
                    prefill: {
                        name: profile?.companyName || '',
                        email: '',
                        contact: ''
                    },
                    notes: {
                        proposalId: proposalId,
                        studentName: orderData.studentName
                    },
                    theme: {
                        color: '#10b981'
                    },
                    modal: {
                        ondismiss: function () {
                            setUpdating(null)
                            toast.error('Payment cancelled')
                        }
                    },
                    // Enable all payment methods
                    config: {
                        display: {
                            blocks: {
                                banks: {
                                    name: 'Pay via UPI/Cards/NetBanking',
                                    instruments: [
                                        { method: 'upi' },
                                        { method: 'card' },
                                        { method: 'netbanking' },
                                        { method: 'wallet' }
                                    ]
                                }
                            },
                            sequence: ['block.banks'],
                            preferences: {
                                show_default_blocks: true
                            }
                        }
                    }
                }

                // Open Razorpay checkout
                const rzp = new window.Razorpay(options)
                rzp.on('payment.failed', function (response) {
                    toast.error('Payment failed: ' + response.error.description)
                    setUpdating(null)
                })
                rzp.open()

            } else {
                // For rejection, use the old direct update flow
                await fellowshipApi.updateProposalStatus(proposalId, status, feedback)
                toast.success(`Proposal ${status}!`)
                setShowFeedbackFor(null)
                setFeedback('')
                loadData()
                setUpdating(null)
            }
        } catch (error) {
            toast.error(error.message || 'Failed to process')
            setUpdating(null)
        }
    }

    const handleMessageClick = (proposalId) => {
        const room = chatRooms[proposalId]
        if (room) {
            navigate(`/fellowship/messages/${room._id}`)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <button
                onClick={() => navigate('/fellowship/my-challenges')}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to My Challenges
            </button>

            {challenge && (
                <div className="bg-background border border-border rounded-2xl p-6">
                    <h1 className="text-2xl font-bold text-foreground">{challenge.title}</h1>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <IndianRupee className="w-4 h-4" />
                            ₹{challenge.price?.toLocaleString('en-IN')}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Deadline: {formatDate(challenge.deadline)}
                        </span>
                        <span className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {proposals.length} proposal{proposals.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                </div>
            )}

            <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Proposals Received</h2>

                {proposals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
                        <FileText className="h-12 w-12 text-muted-foreground/80" />
                        <h3 className="mt-4 text-lg font-semibold text-foreground">No proposals yet</h3>
                        <p className="mt-2 text-sm text-muted-foreground">Students will submit proposals once they see your challenge</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {proposals.map((proposal) => {
                            const status = STATUS_CONFIG[proposal.status] || STATUS_CONFIG.pending
                            const StatusIcon = status.icon
                            const hasRoom = chatRooms[proposal._id]

                            return (
                                <motion.div
                                    key={proposal._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-background border border-border rounded-2xl p-6"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                                <User className="w-6 h-6 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-foreground">{proposal.studentName}</h3>
                                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                    <Mail className="w-3 h-3" />
                                                    {proposal.studentEmail}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm ${status.color}`}>
                                            <StatusIcon className="w-4 h-4" />
                                            {status.label}
                                        </span>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                        <div className="p-3 bg-muted rounded-lg">
                                            <p className="text-muted-foreground mb-1">Proposed Price</p>
                                            <p className="text-emerald-400 font-semibold">₹{proposal.proposedPrice?.toLocaleString('en-IN')}</p>
                                        </div>
                                        <div className="p-3 bg-muted rounded-lg">
                                            <p className="text-muted-foreground mb-1">Delivery Time</p>
                                            <p className="text-foreground font-semibold">{proposal.estimatedDays} days</p>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <p className="text-sm text-muted-foreground mb-2">Cover Letter</p>
                                        <p className="text-foreground text-sm whitespace-pre-wrap bg-muted rounded-lg p-4">
                                            {proposal.coverLetter}
                                        </p>
                                    </div>

                                    {proposal.portfolioLinks?.length > 0 && (
                                        <div className="mt-4">
                                            <p className="text-sm text-muted-foreground mb-2">Portfolio Links</p>
                                            <div className="flex flex-wrap gap-2">
                                                {proposal.portfolioLinks.map((link, i) => (
                                                    <a
                                                        key={i}
                                                        href={link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-muted text-blue-400 rounded-lg text-sm hover:bg-muted/80"
                                                    >
                                                        <ExternalLink className="w-3 h-3" />
                                                        Link {i + 1}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {proposal.status === 'pending' && (
                                        <div className="mt-6 pt-4 border-t border-border">
                                            {showFeedbackFor === proposal._id ? (
                                                <div className="space-y-3">
                                                    <textarea
                                                        value={feedback}
                                                        onChange={(e) => setFeedback(e.target.value)}
                                                        placeholder="Add feedback (optional)..."
                                                        rows={3}
                                                        className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 resize-none"
                                                    />
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleUpdateStatus(proposal._id, 'accepted')}
                                                            disabled={updating === proposal._id}
                                                            className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-foreground rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                                                        >
                                                            {updating === proposal._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(proposal._id, 'rejected')}
                                                            disabled={updating === proposal._id}
                                                            className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-foreground rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                            Reject
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => { setShowFeedbackFor(null); setFeedback('') }}
                                                        className="w-full py-2 text-muted-foreground hover:text-foreground text-sm"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setShowFeedbackFor(proposal._id)}
                                                    className="w-full py-2.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg font-medium"
                                                >
                                                    Review This Proposal
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {proposal.status === 'accepted' && (
                                        <div className="mt-6 pt-4 border-t border-border">
                                            <button
                                                onClick={() => handleMessageClick(proposal._id)}
                                                disabled={!hasRoom}
                                                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-foreground rounded-lg font-medium flex items-center justify-center gap-2"
                                            >
                                                <MessageCircle className="w-4 h-4" />
                                                Message Student
                                            </button>
                                        </div>
                                    )}

                                    <p className="mt-4 text-xs text-muted-foreground">
                                        Submitted on {formatDate(proposal.createdAt)}
                                    </p>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
