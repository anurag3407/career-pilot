import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOutletContext } from 'react-router-dom'
import { fellowshipApi } from '../../services/api'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import {
    ArrowLeft,
    Plus,
    X,
    Loader2,
    CheckCircle,
    IndianRupee,
    Calendar,
    Briefcase
} from 'lucide-react'

const CATEGORIES = [
    { id: 'design', label: 'Design', icon: '🎨' },
    { id: 'content', label: 'Content', icon: '✍️' },
    { id: 'development', label: 'Development', icon: '💻' },
    { id: 'research', label: 'Research', icon: '🔬' },
    { id: 'marketing', label: 'Marketing', icon: '📈' },
]

export default function CreateChallenge() {
    const navigate = useNavigate()
    useOutletContext()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('design')
    const [price, setPrice] = useState('')
    const [deadline, setDeadline] = useState('')
    const [requirements, setRequirements] = useState([])
    const [newRequirement, setNewRequirement] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleAddRequirement = () => {
        if (newRequirement.trim() && requirements.length < 10) {
            setRequirements([...requirements, newRequirement.trim()])
            setNewRequirement('')
        }
    }

    const handleRemoveRequirement = (index) => {
        setRequirements(requirements.filter((_, i) => i !== index))
    }

    const isValid = title.trim().length >= 10 &&
        description.trim().length >= 50 &&
        category &&
        parseInt(price) >= 1000 &&
        deadline

    const handleSubmit = async () => {
        if (!isValid) return

        setLoading(true)
        try {
            await fellowshipApi.createChallenge({
                title: title.trim(),
                description: description.trim(),
                category,
                price: parseInt(price),
                deadline,
                requirements
            })
            setSuccess(true)
            setTimeout(() => navigate('/fellowship/my-challenges'), 2000)
        } catch (error) {
            toast.error(error.message || 'Failed to create challenge')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-background border border-border rounded-2xl p-12 text-center"
                >
                    <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950 flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h2 className="mt-4 text-xl font-semibold text-foreground">Challenge Posted!</h2>
                    <p className="mt-2 text-muted-foreground">Students can now start applying.</p>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm"
            >
                <ArrowLeft className="w-4 h-4" />
                Back
            </button>

            <div>
                <h1 className="text-2xl font-bold text-foreground">Post a New Challenge</h1>
                <p className="text-muted-foreground">Create a challenge for students to solve and earn</p>
            </div>

            <div className="bg-background border border-border rounded-2xl p-6 space-y-6">
                <div className="flex items-center gap-2 text-foreground">
                    <Briefcase className="w-5 h-5" />
                    <h2 className="text-lg font-semibold">Challenge Details</h2>
                </div>

                <div>
                    <label className="block text-sm text-muted-foreground mb-2">Title *</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Design a Modern Logo for TechStart"
                        className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">Minimum 10 characters</p>
                </div>

                <div>
                    <label className="block text-sm text-muted-foreground mb-2">Category *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => setCategory(cat.id)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${category === cat.id
                                    ? 'bg-emerald-600 text-foreground'
                                    : 'bg-muted text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {cat.icon} {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-muted-foreground mb-2">Description *</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the challenge in detail..."
                        rows={5}
                        className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 resize-none"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">{description.length}/50 minimum characters</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm text-muted-foreground mb-2">Reward Amount (₹) *</label>
                        <div className="relative">
                            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="5000"
                                min="1000"
                                className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">Minimum ₹1,000</p>
                    </div>
                    <div>
                        <label className="block text-sm text-muted-foreground mb-2">Deadline *</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                            <input
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full pl-10 pr-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:outline-none focus:border-emerald-500 cursor-pointer [color-scheme:dark]"
                                style={{ colorScheme: 'dark' }}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm text-muted-foreground mb-2">Skills/Requirements</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newRequirement}
                            onChange={(e) => setNewRequirement(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRequirement())}
                            placeholder="e.g., Figma, React, Writing"
                            className="flex-1 px-4 py-2.5 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500"
                        />
                        <button
                            type="button"
                            onClick={handleAddRequirement}
                            className="px-4 py-2.5 bg-muted border border-border rounded-xl text-muted-foreground hover:text-foreground"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    {requirements.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {requirements.map((req, i) => (
                                <span key={i} className="flex items-center gap-1 px-3 py-1 bg-muted text-foreground rounded-lg text-sm">
                                    {req}
                                    <button onClick={() => handleRemoveRequirement(i)} className="hover:text-red-400">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex gap-3 pt-4 border-t border-border">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 bg-muted text-foreground rounded-xl font-medium hover:bg-muted/80"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!isValid || loading}
                        className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-foreground rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Creating...</>
                        ) : (
                            <><Plus className="w-5 h-5" /> Post Challenge</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
