import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { toast } from 'react-hot-toast'
import {
  Lightbulb, Sparkles, ChevronDown, ChevronUp,
  CheckCircle2, AlertTriangle, Info, Brain, RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { analyzeResume } from '../utils/resumeSuggestions'
import { enhanceApi } from '../services/api'

const SEVERITY_STYLES = {
  high:   { icon: AlertTriangle, color: 'text-red-400' },
  medium: { icon: Info,          color: 'text-yellow-400' },
  low:    { icon: Info,          color: 'text-blue-400' },
}

/**
 * Real-time resume improvement suggestions panel for the Resume Builder.
 * Shows instant client-side heuristics that update as the user types, plus
 * an on-demand AI review via the existing /enhance/suggestions endpoint.
 */
export default function ResumeSuggestionsPanel({
  personal, education, experience, projects, skills, targetRole, getResumeText,
}) {
  const [collapsed, setCollapsed]         = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState('')
  const [aiLoading, setAiLoading]         = useState(false)
  const [aiError, setAiError]             = useState('')

  const suggestions = useMemo(
    () => analyzeResume({ personal, education, experience, projects, skills }),
    [personal, education, experience, projects, skills],
  )

  const resumeText = typeof getResumeText === 'function' ? getResumeText() : ''
  // Roughly empty once placeholders and markdown punctuation are stripped.
  // Remove the "Your Name" placeholder BEFORE collapsing whitespace, otherwise
  // the space is gone and the placeholder regex can never match.
  const isEmpty = !resumeText.replace(/your name/i, '').replace(/[#|*\-\s]/g, '').trim()

  const handleAnalyze = async () => {
    if (isEmpty) {
      toast.error('Add some resume content before requesting AI suggestions.')
      return
    }
    setAiLoading(true)
    setAiError('')
    try {
      const res = await enhanceApi.getSuggestions(resumeText, targetRole?.trim() || 'Software Engineer')
      setAiSuggestions(res?.data?.suggestions || 'No suggestions were returned.')
    } catch (err) {
      const msg = err?.message || 'Failed to generate AI suggestions. Please try again.'
      setAiError(msg)
      toast.error(msg)
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 bg-card/50 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl overflow-hidden"
    >
      {/* Header / collapse toggle */}
      <button
        type="button"
        onClick={() => setCollapsed(c => !c)}
        className="w-full flex items-center justify-between gap-3 p-5 sm:p-6 text-left"
        aria-expanded={!collapsed}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
            <Lightbulb className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Improvement Suggestions</h3>
            <p className="text-xs text-muted-foreground">Real-time tips to strengthen your resume</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className={cn(
            'text-xs font-medium px-2.5 py-1 rounded-full',
            suggestions.length === 0 ? 'bg-green-500/15 text-green-400' : 'bg-primary/15 text-primary',
          )}>
            {suggestions.length === 0 ? 'All good' : `${suggestions.length} tip${suggestions.length === 1 ? '' : 's'}`}
          </span>
          {collapsed
            ? <ChevronDown className="w-5 h-5 text-muted-foreground" />
            : <ChevronUp className="w-5 h-5 text-muted-foreground" />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="px-5 sm:px-6 pb-6"
          >
            {/* Instant, real-time suggestions */}
            {suggestions.length === 0 ? (
              <div className="flex items-start gap-2 text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Looking good! No quick improvements detected — try the AI review for deeper feedback.</span>
              </div>
            ) : (
              <ul className="space-y-2">
                {suggestions.map(s => {
                  const sev  = SEVERITY_STYLES[s.severity] || SEVERITY_STYLES.low
                  const Icon = sev.icon
                  return (
                    <li key={s.id} className="flex items-start gap-3 bg-background/30 border border-border rounded-xl p-3">
                      <Icon className={cn('w-4 h-4 mt-0.5 shrink-0', sev.color)} />
                      <span className="text-sm text-foreground/90">{s.message}</span>
                    </li>
                  )
                })}
              </ul>
            )}

            {/* On-demand AI review */}
            <div className="mt-5 pt-5 border-t border-border">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={aiLoading}
                className="px-5 py-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-medium text-sm"
              >
                {aiLoading ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Analyzing…</>
                ) : (
                  <><Brain className="w-4 h-4" /> Analyze with AI</>
                )}
              </button>

              {aiError && <p className="mt-3 text-sm text-red-400">{aiError}</p>}

              {aiSuggestions && !aiError && (
                <div className="mt-4 bg-background/30 border border-border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2 text-primary">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">AI Suggestions</span>
                  </div>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    className="prose prose-invert prose-sm max-w-none text-sm text-foreground/90 [&_ol]:pl-5 [&_ul]:pl-5 [&_li]:my-1"
                  >
                    {aiSuggestions}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
