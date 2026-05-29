import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe, Sparkles, Target, Copy, Check,
  ChevronDown, ChevronUp, TrendingUp, Zap,
  AlertCircle, CheckCircle2, Star
} from 'lucide-react'
import { enhanceApi } from '../services/api'
import { toast } from 'react-hot-toast'

const IMPACT_CONFIG = {
  High:   { color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30'    },
  Medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  Low:    { color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/30'  },
}

function ScoreRing({ score, label, size = 'md' }) {
  const safeScore = isNaN(Number(score)) ? 0 : Math.max(0, Math.min(100, Math.round(Number(score))))
  const r = size === 'lg' ? 44 : 28
  const stroke = size === 'lg' ? 7 : 5
  const dim = (r + stroke) * 2
  const circ = 2 * Math.PI * r
  const color =
    safeScore >= 75 ? 'stroke-green-400' :
    safeScore >= 50 ? 'stroke-yellow-400' : 'stroke-red-400'
  const textColor =
    safeScore >= 75 ? 'text-green-400' :
    safeScore >= 50 ? 'text-yellow-400' : 'text-red-400'

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative flex items-center justify-center">
        <svg width={dim} height={dim} className="-rotate-90" viewBox={`0 0 ${dim} ${dim}`}>
          <circle
            cx={r + stroke} cy={r + stroke} r={r}
            fill="none" strokeWidth={stroke}
            stroke="currentColor" className="text-muted/30"
          />
          <circle
            cx={r + stroke} cy={r + stroke} r={r}
            fill="none" strokeWidth={stroke}
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - safeScore / 100)}
            strokeLinecap="round"
            className={`transition-all duration-700 ${color}`}
          />
        </svg>
        <span className={`absolute text-sm font-bold ${textColor}`}>{safeScore}%</span>
      </div>
      <p className="text-xs text-muted-foreground text-center">{label}</p>
    </div>
  )
}

function HeadlineCard({ headline, index, copied, onCopy }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className="flex items-start gap-3 bg-background/60 border border-border rounded-xl p-4 hover:border-primary/40 transition"
    >
      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
        {index + 1}
      </span>
      <p className="text-sm text-foreground font-medium flex-1 leading-relaxed">{headline}</p>
      <button
        onClick={() => onCopy(headline, `hl-${index}`)}
        className="ml-2 text-muted-foreground hover:text-primary transition flex-shrink-0"
        title="Copy"
      >
        {copied === `hl-${index}` ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
      </button>
    </motion.div>
  )
}

export default function LinkedInOptimizer() {
  const [profileText, setProfileText] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [aboutExpanded, setAboutExpanded] = useState(false)
  const [aboutCopied, setAboutCopied] = useState(false)

  const handleOptimize = async (e) => {
    e.preventDefault()
    
    // Safety check: minimum length validation
    const trimmedProfile = profileText.trim()
    const trimmedRole = targetRole.trim()
    
    if (trimmedProfile.length < 50) {
      setError('Please paste a substantial portion of your LinkedIn profile (at least 50 characters) for optimization.')
      return
    }
    
    // targetRole is optional, default to General career growth if empty
    const finalRole = trimmedRole || 'General career growth'

    setLoading(true)
    setError(null)
    setResults(null)
    try {
      const response = await enhanceApi.optimizeLinkedIn({ 
        profileText: trimmedProfile, 
        targetRole: finalRole 
      })
      setResults(response)
    } catch (err) {
      console.error('LinkedIn optimization error:', err)
      setError(err.message || 'Failed to optimize your profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text, key) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text)
        setCopiedIndex(key)
        setTimeout(() => setCopiedIndex(null), 2000)
      } else {
        throw new Error('Clipboard API not supported')
      }
    } catch (err) {
      console.warn('Clipboard write failed:', err)
      // Fallback selection copy
      try {
        const textarea = document.createElement('textarea')
        textarea.value = text
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        setCopiedIndex(key)
        setTimeout(() => setCopiedIndex(null), 2000)
      } catch (fallbackErr) {
        toast.error('Could not copy to clipboard. Please copy manually.')
      }
    }
  }

  const copyAbout = async () => {
    if (!results?.aboutRewrite) return
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(results.aboutRewrite)
        setAboutCopied(true)
        setTimeout(() => setAboutCopied(false), 2000)
      } else {
        throw new Error('Clipboard API not supported')
      }
    } catch (err) {
      console.warn('Clipboard write failed:', err)
      // Fallback selection copy
      try {
        const textarea = document.createElement('textarea')
        textarea.value = results.aboutRewrite
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        setAboutCopied(true)
        setTimeout(() => setAboutCopied(false), 2000)
      } catch (fallbackErr) {
        toast.error('Could not copy to clipboard. Please copy manually.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-4">
            <Globe className="w-4 h-4" />
            AI LinkedIn Profile Optimizer
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            Stand Out on LinkedIn
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Paste your LinkedIn profile text and get AI-powered headline rewrites, an About section overhaul, and skills gap insights vs industry peers.
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border shadow-xl mb-10 overflow-hidden"
        >
          <div className="bg-blue-600 px-6 py-4 flex items-center gap-2 text-white font-semibold">
            <Globe className="w-5 h-5" />
            Paste Your Profile Details
          </div>
          <form onSubmit={handleOptimize} className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                  <Globe className="w-4 h-4 text-blue-400" />
                  Your LinkedIn Profile Text
                </label>
                <textarea
                  className="w-full p-4 border border-border bg-muted/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition h-52 resize-none text-foreground placeholder:text-muted-foreground text-sm"
                  placeholder="Paste your LinkedIn headline, About section, and key experience details here..."
                  required
                  maxLength={5000}
                  value={profileText}
                  onChange={(e) => setProfileText(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">{profileText.length}/5000</p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                  <Target className="w-4 h-4 text-blue-400" />
                  Target Role / Industry <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <textarea
                  className="w-full p-4 border border-border bg-muted/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition h-52 resize-none text-foreground placeholder:text-muted-foreground text-sm"
                  placeholder="e.g. Senior Product Manager at a B2B SaaS company, or Full Stack Engineer in fintech..."
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              id="optimize-linkedin-btn"
              className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing your profile...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Optimize My Profile
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Score Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-6">
                  <h3 className="font-bold text-foreground mb-5 flex items-center gap-2">
                    <Star className="w-4 h-4 text-blue-400" /> Profile Score Breakdown
                  </h3>
                  <div className="flex items-center justify-around">
                    <ScoreRing score={results.overallScore} label="Overall" size="lg" />
                    {results.scoreBreakdown && (
                      <>
                        <ScoreRing score={results.scoreBreakdown.headline} label="Headline" />
                        <ScoreRing score={results.scoreBreakdown.about} label="About" />
                        <ScoreRing score={results.scoreBreakdown.skills} label="Skills" />
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-6">
                  <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-400" /> AI Summary
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{results.summary}</p>
                  <div>
                    <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Current Strengths
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {results.strengthsFound?.map((s, i) => (
                        <span key={i} className="px-3 py-1 text-xs rounded-full bg-green-500/10 text-green-400 border border-green-500/30 font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Headline Suggestions */}
              {results.headlineSuggestions?.length > 0 && (
                <div className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-400" /> Optimized Headline Suggestions
                  </h2>
                  <div className="space-y-3">
                    {results.headlineSuggestions.map((h, i) => (
                      <HeadlineCard key={i} headline={h} index={i} copied={copiedIndex} onCopy={copyToClipboard} />
                    ))}
                  </div>
                </div>
              )}

              {/* About Section Rewrite */}
              {results.aboutRewrite && (
                <div className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-400" /> Rewritten About Section
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={copyAbout}
                        className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition font-medium"
                      >
                        {aboutCopied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy All</>}
                      </button>
                      <button
                        onClick={() => setAboutExpanded(!aboutExpanded)}
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition"
                      >
                        {aboutExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className={`text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap bg-muted/30 rounded-xl p-4 border border-border ${!aboutExpanded ? 'line-clamp-5' : ''}`}>
                    {results.aboutRewrite}
                  </div>
                  {!aboutExpanded && (
                    <button onClick={() => setAboutExpanded(true)} className="text-xs text-primary hover:text-primary/80 mt-2 font-medium">
                      Show full rewrite →
                    </button>
                  )}
                </div>
              )}

              {/* Quick Wins + Skills Gap */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Quick Wins */}
                {results.quickWins?.length > 0 && (
                  <div className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-400" /> Quick Wins
                    </h2>
                    <div className="space-y-3">
                      {results.quickWins.map((win, i) => {
                        const cfg = IMPACT_CONFIG[win.impact] || IMPACT_CONFIG.Low
                        return (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.07 }}
                            className={`flex items-start gap-3 p-3 rounded-xl border ${cfg.border} ${cfg.bg}`}
                          >
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${cfg.border} ${cfg.color} ${cfg.bg} flex-shrink-0 mt-0.5`}>
                              {win.impact}
                            </span>
                            <p className="text-sm text-foreground">{win.action}</p>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Skills Gap vs Peers */}
                {results.skillsGapVsPeers?.length > 0 && (
                  <div className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-red-400" /> Skills Gap vs Industry Peers
                    </h2>
                    <div className="space-y-3">
                      {results.skillsGapVsPeers.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.07 }}
                          className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 border border-border"
                        >
                          <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0 mt-1.5" />
                          <div>
                            <p className="text-sm font-semibold text-foreground">{item.skill}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{item.reason}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
