import { useState } from 'react'
import { Sparkles, Loader2, Check, X, Briefcase } from 'lucide-react'
import toast from 'react-hot-toast'
import { enhanceApi } from '../../services/api'

/**
 * ResumeTailor — One-Click Resume Tailor.
 *
 * Paste a job description, and the AI rewrites the current resume text to
 * match. The user can preview the diff, then accept (replaces the resume's
 * enhancedText in-memory) or reject (discards).
 *
 * Props:
 *   resumeText  - current resume text (markdown)
 *   jobRole     - optional target role name to seed the input
 *   onTailored  - called with the new resume text when the user accepts
 */
export default function ResumeTailor({ resumeText, jobRole: initialRole, onTailored }) {
  const [open, setOpen] = useState(false)
  const [jobDescription, setJobDescription] = useState('')
  const [jobRole, setJobRole] = useState(initialRole || '')
  const [loading, setLoading] = useState(false)
  const [tailored, setTailored] = useState(null)

  const handleTailor = async () => {
    if (!resumeText || !resumeText.trim()) {
      toast.error('No resume to tailor')
      return
    }
    if (!jobDescription.trim() || jobDescription.trim().length < 20) {
      toast.error('Paste a job description (at least 20 characters)')
      return
    }
    setLoading(true)
    setTailored(null)
    const toastId = toast.loading('Tailoring resume to job…')
    try {
      const res = await enhanceApi.tailorResume(resumeText, jobDescription, jobRole)
      const text = res?.data?.tailoredText || res?.tailoredText
      if (!text) {
        toast.error('Empty response', { id: toastId })
        return
      }
      setTailored({ text, jobRole })
      toast.success('Tailored resume ready — review and apply', { id: toastId })
    } catch (err) {
      toast.error(err.message || 'Tailoring failed', { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = () => {
    if (tailored && onTailored) onTailored(tailored.text)
    setTailored(null)
    setJobDescription('')
    toast.success('Tailored resume applied')
  }

  const handleReject = () => setTailored(null)

  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-sky-500"
      >
        <Sparkles className="w-4 h-4" />
        Tailor to a Job
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Target Role (optional)
            </label>
            <input
              type="text"
              value={jobRole}
              onChange={e => setJobRole(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              rows={6}
              placeholder="Paste the full job description here. The AI will rewrite your resume to highlight the most relevant experience, skills, and keywords."
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 resize-y"
            />
          </div>

          <button
            type="button"
            onClick={handleTailor}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Tailoring…
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Tailor Resume
              </>
            )}
          </button>

          {tailored && (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-500 uppercase tracking-wider">
                  <Briefcase className="w-3 h-3" />
                  Tailored for: {tailored.jobRole || 'this role'}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleAccept}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium bg-emerald-500 text-white hover:bg-emerald-600"
                  >
                    <Check className="w-3 h-3" />
                    Apply
                  </button>
                  <button
                    type="button"
                    onClick={handleReject}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium bg-muted text-foreground hover:bg-muted/80"
                  >
                    <X className="w-3 h-3" />
                    Discard
                  </button>
                </div>
              </div>
              <pre className="max-h-72 overflow-auto whitespace-pre-wrap text-xs leading-relaxed text-foreground bg-muted/50 p-3 rounded-lg border border-border">
                {tailored.text}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
