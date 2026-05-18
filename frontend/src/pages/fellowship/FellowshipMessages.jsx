import { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { fellowshipApi } from '../../services/api'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import {
    MessageCircle,
    User,
    Clock,
    Loader2,
    ArrowRight
} from 'lucide-react'

export default function FellowshipMessages() {
    const navigate = useNavigate()
    const { profile } = useOutletContext()
    const [rooms, setRooms] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadRooms()
    }, [])

    const loadRooms = async () => {
        try {
            const response = await fellowshipApi.getChatRooms()
            setRooms(response.data)
        } catch (error) {
            console.error('Failed to load chat rooms:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatTime = (date) => {
        const d = new Date(date)
        if (!date || Number.isNaN(d.getTime())) return 'Unknown'
        const now = new Date()
        const diff = now - d

        if (diff < 60000) return 'Just now'
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Messages</h1>
                <p className="text-muted-foreground">Chat with your accepted {profile?.role === 'student' ? 'companies' : 'students'}</p>
            </div>

            {rooms.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
                    <MessageCircle className="h-12 w-12 text-muted-foreground/80" />
                    <h3 className="mt-4 text-lg font-semibold text-foreground">No conversations yet</h3>
                    <p className="mt-2 text-sm text-muted-foreground text-center max-w-md">
                        {profile?.role === 'student'
                            ? 'Once a company accepts your proposal, you can chat with them here.'
                            : 'Accept a student proposal to start a conversation with them.'}
                    </p>
                    <button
                        onClick={() => navigate('/fellowship/challenges')}
                        className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-foreground rounded-xl font-medium"
                    >
                        Browse Challenges
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {rooms.map((room) => {
                        const otherName = profile?.role === 'student' ? room.corporateName : room.studentName

                        return (
                            <motion.div
                                key={room._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                onClick={() => navigate(`/fellowship/messages/${room._id}`)}
                                className="flex items-center gap-4 p-4 bg-background border border-border rounded-2xl cursor-pointer hover:border-emerald-500/50 transition-all"
                            >
                                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                    <User className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-foreground truncate">{otherName}</h3>
                                    <p className="text-sm text-muted-foreground truncate">{room.challengeTitle}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {formatTime(room.lastMessageAt)}
                                    </span>
                                    <ArrowRight className="w-4 h-4 text-muted-foreground/80" />
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
