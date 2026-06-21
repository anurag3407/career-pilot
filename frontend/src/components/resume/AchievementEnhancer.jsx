import { useState } from 'react'
import { Sparkles, Loader2, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { enhanceApi } from '../../services/api'

/**
 * AchievementEnhancer — inline AI assistant for resume bullet points.
 *
 * Connects to the existing `POST /enhance/analyze-bullets` endpoint, fetches
 * the AI's improved bullet(s) for the current description, and lets the user
 * accept (replaces current text) or reject (discards) the suggestion.
 *
 * Props:
 *   value     — current bullet text
 *   jobRole   — target role context for the AI prompt
 *   onApply   — called with the AI-improved text when the user accepts
 */
export default function AchievementEnhancer({ value, jobRole, onApply }) {
  const [loading, setLoading] = useState(false)
  const [suggestion, setSuggestion] = useState(null)

  const handleEnhance = async () => {
    if (!value || !value.trim()) {
      toast.error('Add some bullet points first')
      return
    }

    setLoading(true)
    setSuggestion(null)
    const toastId = toast.loading('Rewriting bullets with AI…')
    try {
      const res = await enhanceApi.analyzeBullets(value, jobRole)
      // The backend returns either { improvedBullets: [...] } or { bullets: [...] }
      const improved =
        res?.improvedBullets ||
        res?.bullets ||
        res?.analysis?.improvedBullets ||
        []
      if (!improved.length) {
        toast.error('No suggestions returned', { id: toastId })
        return
      }
      const joined = improved
        .map(b => (b.startsWith('-') ? b : `- ${b}`))
        .join('\n')
      setSuggestion(joined)
      toast.success('Suggestion ready — review and apply', { id: toastId })
    } catch (err) {
      toast.error(err.message || 'Failed to enhance', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = () => {
    if (suggestion && onApply) onApply(suggestion)
    setSuggestion(null)
    toast.success('Bullets updated')
  }

  const handleReject = () => setSuggestion(null)

  return (
    <div className="mt-3 space-y-2">
      <button
        type="button"
        onClick={handleEnhance}
        disabled={loading}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
      >
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Enhancing…
          </>
        ) : (
          <>
            <Sparkles className="w-3.5 h-3.5" />
            Enhance with AI
          </>
        )}
      </button>

      {suggestion && (
        <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider">
              AI Suggestion
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleAccept}
                title="Apply suggestion"
                className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-emerald-500 text-white hover:bg-emerald-600"
              >
                <Check className="w-3 h-3" />
                Apply
              </button>
              <button
                type="button"
                onClick={handleReject}
                title="Discard"
                className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-muted text-foreground hover:bg-muted/80"
              >
                <X className="w-3 h-3" />
                Discard
              </button>
            </div>
          </div>
          <pre className="whitespace-pre-wrap font-sans text-sm text-foreground">
            {suggestion}
          </pre>
        </div>
      )}
    </div>
  )
}
