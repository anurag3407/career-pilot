import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import { fellowshipApi, paymentApi } from '../../services/api'
import { useSocket } from '../../context/SocketContext'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import {
    ArrowLeft,
    Send,
    Loader2,
    MessageCircle,
    User,
    Clock,
    CheckCircle,
    Wallet,
    AlertTriangle
} from 'lucide-react'

export default function FellowshipChat() {
    const { roomId } = useParams()
    const navigate = useNavigate()
    const { profile } = useOutletContext()
    const { subscribe, emit, isConnected } = useSocket()
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    const [room, setRoom] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const [releasingFunds, setReleasingFunds] = useState(false)
    const [showReleaseConfirm, setShowReleaseConfirm] = useState(false)

    useEffect(() => {
        loadRoom()
    }, [roomId])

    useEffect(() => {
        if (room && isConnected) {
            emit('join_fellowship_chat', { roomId: room._id })

            const unsubscribe = subscribe('fellowship_message', (data) => {
                if (data.roomId === room._id) {
                    setMessages(prev => {
                        const incoming = data.message
                        const hasId = incoming?._id
                        const isDuplicate = prev.some(message => {
                            if (hasId && message._id) return message._id === incoming._id
                            return message.createdAt === incoming.createdAt &&
                                message.senderId === incoming.senderId &&
                                message.content === incoming.content
                        })
                        return isDuplicate ? prev : [...prev, incoming]
                    })
                    scrollToBottom()
                }
            })

            return () => {
                emit('leave_fellowship_chat', { roomId: room._id })
                unsubscribe()
            }
        }
    }, [room, isConnected])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const loadRoom = async () => {
        try {
            const [roomRes, messagesRes] = await Promise.all([
                fellowshipApi.getChatRoom(roomId),
                fellowshipApi.getChatMessages(roomId)
            ])
            setRoom(roomRes.data)
            setMessages(messagesRes.data)
        } catch (error) {
            toast.error('Failed to load chat')
            navigate('/fellowship/messages')
        } finally {
            setLoading(false)
        }
    }

    const handleSend = async (e) => {
        e.preventDefault()
        if (!newMessage.trim() || sending) return

        const content = newMessage.trim()
        setNewMessage('')
        setSending(true)

        try {
            const response = await fellowshipApi.sendChatMessage(roomId, content)

            setMessages(prev => [...prev, response.data])

            if (isConnected) {
                emit('fellowship_message', {
                    roomId: room._id,
                    message: response.data
                })
            }
        } catch (error) {
            toast.error('Failed to send message')
            setNewMessage(content)
        } finally {
            setSending(false)
            inputRef.current?.focus()
        }
    }

    const formatTime = (date) => {
        const parsed = new Date(date)
        if (Number.isNaN(parsed.getTime())) return '--'
        return parsed.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatDate = (date) => {
        const d = new Date(date)
        if (Number.isNaN(d.getTime())) return 'Unknown'
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)

        if (d.toDateString() === today.toDateString()) return 'Today'
        if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    const handleReleaseFunds = async () => {
        if (releasingFunds) return
        setReleasingFunds(true)

        try {
            await paymentApi.releaseFunds(roomId)
            toast.success('Funds released! Challenge marked as completed.')
            setShowReleaseConfirm(false)
            navigate('/fellowship/messages')
        } catch (error) {
            toast.error(error.message || 'Failed to release funds')
        } finally {
            setReleasingFunds(false)
        }
    }

    // Check if user is corporate and payment is in escrow
    const canReleaseFunds = profile?.role === 'corporate' && room?.paymentStatus === 'escrow'

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        )
    }

    if (!room) return null

    const otherName = profile?.role === 'student' ? room.corporateName : room.studentName

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            <div className="flex items-center gap-4 pb-4 border-b border-border">
                <button
                    onClick={() => navigate('/fellowship/messages')}
                    className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-foreground">{otherName}</h2>
                        <p className="text-xs text-muted-foreground">{room.challengeTitle}</p>
                    </div>
                </div>
                <div className="ml-auto flex items-center gap-3">
                    {/* Payment Status Badge */}
                    {room.paymentStatus === 'escrow' && (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-950 text-amber-400 rounded-lg text-xs">
                            <Wallet className="w-3.5 h-3.5" />
                            In Escrow
                        </span>
                    )}
                    {room.paymentStatus === 'released' && (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950 text-emerald-400 rounded-lg text-xs">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Completed
                        </span>
                    )}

                    {/* Release Funds Button - Only for corporate when in escrow */}
                    {canReleaseFunds && (
                        <button
                            onClick={() => setShowReleaseConfirm(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-foreground rounded-lg text-sm font-medium transition-colors"
                        >
                            <CheckCircle className="w-4 h-4" />
                            Release Funds
                        </button>
                    )}

                    {/* Connection Status */}
                    {isConnected ? (
                        <span className="flex items-center gap-1 text-xs text-emerald-400">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            Connected
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <span className="w-2 h-2 bg-muted-foreground/50 rounded-full" />
                            Offline
                        </span>
                    )}
                </div>
            </div>

            {/* Release Funds Confirmation Modal */}
            {showReleaseConfirm && (
                <div className="fixed inset-0 bg-background/70 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-background border border-border rounded-2xl p-6 max-w-md w-full mx-4"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-emerald-950 rounded-full flex items-center justify-center">
                                <Wallet className="w-6 h-6 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-foreground">Release Funds</h3>
                                <p className="text-sm text-muted-foreground">₹{room.amount?.toLocaleString('en-IN')}</p>
                            </div>
                        </div>

                        <div className="bg-amber-950/50 border border-amber-900/50 rounded-lg p-4 mb-6">
                            <div className="flex items-start gap-2">
                                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-amber-200">
                                    <p className="font-medium mb-1">This action is final</p>
                                    <p className="text-amber-300/80">Releasing funds will mark the challenge as completed and close this chat. Make sure you're satisfied with the work delivered.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowReleaseConfirm(false)}
                                disabled={releasingFunds}
                                className="flex-1 py-2.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg font-medium disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReleaseFunds}
                                disabled={releasingFunds}
                                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-foreground rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {releasingFunds ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <CheckCircle className="w-4 h-4" />
                                )}
                                Confirm Release
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                        <MessageCircle className="w-12 h-12 mb-3" />
                        <p>No messages yet</p>
                        <p className="text-sm">Start the conversation!</p>
                    </div>
                ) : (
                    <>
                        {messages.map((message, index) => {
                            const currentUserId = profile?.userId || profile?.uid
                            const isMe = currentUserId
                                ? message.senderId === currentUserId
                                : profile?.role === message.senderRole
                            const showDate = index === 0 ||
                                formatDate(messages[index - 1].createdAt) !== formatDate(message.createdAt)

                            return (
                                <div key={message._id || index}>
                                    {showDate && (
                                        <div className="flex justify-center my-4">
                                            <span className="px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground">
                                                {formatDate(message.createdAt)}
                                            </span>
                                        </div>
                                    )}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[70%] ${isMe ? 'order-2' : 'order-1'}`}>
                                            <div className={`px-4 py-2.5 rounded-2xl ${isMe
                                                ? 'bg-emerald-600 text-foreground rounded-br-md'
                                                : 'bg-muted text-foreground rounded-bl-md'
                                                }`}>
                                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                            </div>
                                            <p className={`text-[10px] text-muted-foreground mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                                                {formatTime(message.createdAt)}
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>
                            )
                        })}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            <form onSubmit={handleSend} className="pt-4 border-t border-border">
                <div className="flex gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-foreground rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {sending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                             <>
        <Send className="w-5 h-5" />
        <span className="sr-only">Send Message</span>
    </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
