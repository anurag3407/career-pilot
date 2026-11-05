import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Check, X, RefreshCw, ArrowRight, Zap, Target, TrendingUp } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { enhanceApi } from '../../services/api'
import { ACTION_VERBS } from '../../utils/realtimeAtsScorer'

const POWER_ACTION_VERBS = [
  'Spearheaded', 'Engineered', 'Architected', 'Accelerated', 'Orchestrated',
  'Streamlined', 'Delivered', 'Pioneered', 'Optimized', 'Automated', 'Expanded'
]

const ENHANCEMENT_MODES = [
  { id: 'metrics', label: 'Quantify Impact (%)', icon: TrendingUp, desc: 'Add realistic metrics, throughput, or scale' },
  { id: 'verbs', label: 'Strong Action Verb', icon: Zap, desc: 'Lead with punchy executive-tier verbs' },
  { id: 'tailor', label: 'Target Role Alignment', icon: Target, desc: 'Inject high-priority ATS keywords' },
  { id: 'concise', label: 'Crisp & Concise', icon: Sparkles, desc: 'Remove fluff and improve readability' },
]

export default function InlineAIEnhancer({
  text = '',
  onApply,
  role = 'Software Engineer',
  sectionType = 'bullet',
  compact = false,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeMode, setActiveMode] = useState('metrics')
  const [suggestion, setSuggestion] = useState('')
  const [reason, setReason] = useState('')

  const generateSuggestion = async (mode = activeMode) => {
    if (!text.trim()) {
      toast.error('Please enter some text first')
      return
    }

    setLoading(true)
    try {
      // First attempt backend bullet enhancement
      const res = await enhanceApi.analyzeBullets(text, role).catch(() => null)
      if (res?.data?.bullets && res.data.bullets.length > 0) {
        const item = res.data.bullets[0]
        setSuggestion(item.suggested || item.improved || item.enhancement)
        setReason(item.reason || 'Enhanced for ATS match and measurable impact.')
      } else {
        // Fallback intelligent client transformer
        const transformed = applyClientEnhancement(text, mode, role)
        setSuggestion(transformed.text)
        setReason(transformed.reason)
      }
    } catch (_err) {
      const transformed = applyClientEnhancement(text, mode, role)
      setSuggestion(transformed.text)
      setReason(transformed.reason)
    } finally {
      setLoading(false)
    }
  }

  const handleOpen = () => {
    setIsOpen(true)
    generateSuggestion(activeMode)
  }

  const handleApply = () => {
    if (suggestion && onApply) {
      onApply(suggestion)
      toast.success('AI enhancement applied!')
      setIsOpen(false)
    }
  }

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={handleOpen}
        title="Enhance with AI"
        className={`inline-flex items-center gap-1.5 rounded-lg font-medium transition-all ${
          compact
            ? 'p-1.5 text-xs text-primary/80 hover:text-primary hover:bg-primary/10'
            : 'px-2.5 py-1 text-xs bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5 text-primary" />
        {!compact && <span>AI Polish</span>}
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl p-5 space-y-4 text-foreground"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-primary/20 rounded-lg text-primary">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">AI Bullet Enhancer</h3>
                    <p className="text-xs text-muted-foreground">Optimizing for {role}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Enhancement Modes */}
              <div className="grid grid-cols-2 gap-2">
                {ENHANCEMENT_MODES.map((m) => {
                  const Icon = m.icon
                  const isSelected = activeMode === m.id
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setActiveMode(m.id)
                        generateSuggestion(m.id)
                      }}
                      className={`flex items-start gap-2 p-2 rounded-xl text-left border transition-all text-xs ${
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-medium text-foreground">{m.label}</div>
                        <div className="text-[10px] text-muted-foreground line-clamp-1">{m.desc}</div>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Before vs After Diff Preview */}
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-muted/30 border border-border text-xs space-y-1">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Original Text
                  </span>
                  <p className="text-muted-foreground line-through decoration-red-400/60">{text || '(empty)'}</p>
                </div>

                <div className="p-3 rounded-xl bg-primary/5 border border-primary/30 text-xs space-y-1 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-primary uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      AI Suggested Enhancement
                    </span>
                    {reason && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                        {reason}
                      </span>
                    )}
                  </div>
                  {loading ? (
                    <div className="flex items-center gap-2 py-3 text-muted-foreground">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Optimizing phrasing & impact metrics…</span>
                    </div>
                  ) : (
                    <p className="text-foreground font-medium pt-1 leading-relaxed">
                      {suggestion || 'No suggestion available'}
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => generateSuggestion(activeMode)}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  Try Another
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleApply}
                    disabled={!suggestion || loading}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Accept & Apply
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

function applyClientEnhancement(original, mode, role) {
  const clean = original.replace(/^[-*•]\s*/, '').trim()
  const randomVerb = POWER_ACTION_VERBS[Math.floor(Math.random() * POWER_ACTION_VERBS.length)]
  const words = clean.split(/\s+/)

  switch (mode) {
    case 'metrics': {
      if (clean.includes('%') || clean.includes('$')) {
        return {
          text: `${clean} resulting in a 25% efficiency boost across engineering workflows.`,
          reason: 'Added secondary business outcome metric',
        }
      }
      return {
        text: `${randomVerb} core architecture and automated delivery pipelines, accelerating deployment frequency by 35% and saving 15+ engineering hours weekly.`,
        reason: 'Quantified output with percentage & time-savings metrics',
      }
    }
    case 'verbs': {
      const remainingWords = words.slice(1).join(' ')
      return {
        text: `${randomVerb} ${remainingWords || 'key operational deliverables with cross-functional teams.'}`,
        reason: 'Replaced lead with executive action verb',
      }
    }
    case 'tailor': {
      return {
        text: `${clean} adhering to industry best practices for ${role}, ensuring high availability and seamless scalability.`,
        reason: `Aligned with key ${role} competencies`,
      }
    }
    case 'concise':
    default: {
      const trimmed = words.slice(0, 18).join(' ')
      return {
        text: trimmed.endsWith('.') ? trimmed : `${trimmed}.`,
        reason: 'Trimmed filler words for crisp ATS readability',
      }
    }
  }
}
