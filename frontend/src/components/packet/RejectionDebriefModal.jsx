import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShieldAlert, Loader2, Check } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { jobTrackerApi, starStoriesApi, enhanceApi, careerProfileApi } from '../../services/api'

const REJECTION_STAGES = [
  { value: 'saved', label: 'No response (saved)' },
  { value: 'applied', label: 'Application rejected' },
  { value: 'interviewing', label: 'Rejected after interview' },
]

/**
 * RejectionDebriefModal — a short debrief when a card is marked rejected:
 * stage, reason (if known), missing skills. Feeds the skill-gap view and
 * drafts a story-bank entry so the product gets smarter about this person.
 */
export default function RejectionDebriefModal({ job, onClose, onSaved }) {
  const [stage, setStage] = useState(job?.rejection?.stage || (job?.status === 'rejected' ? 'applied' : job?.status) || 'applied')
  const [reason, setReason] = useState(job?.rejection?.reason || '')
  const [missingSkills, setMissingSkills] = useState((job?.rejection?.missingSkills || []).join(', '))
  const [analyze, setAnalyze] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const save = async () => {
    setSaving(true)
    setError('')
    const skills = missingSkills.split(',').map((s) => s.trim()).filter(Boolean)
    const rejection = {
      stage,
      reason: reason.trim(),
      missingSkills: skills,
      debriefedAt: new Date().toISOString(),
    }

    try {
      // Optional AI skill-gap analysis against the tailored/master resume.
      if (analyze) {
        try {
          let resumeText = job?.packet?.tailoredResumeText || ''
          if (!resumeText) {
            const prof = await careerProfileApi.get().catch(() => null)
            resumeText = prof?.profile?.masterResumeText || ''
          }
          if (resumeText && (job.description || reason)) {
            const res = await enhanceApi.analyzeSkillGap(resumeText, job.description || `${job.title} at ${job.company}. Rejection reason: ${reason}`)
            if (res?.data) rejection.gapAnalysis = { missingSkills: res.data.missingSkills || [], matchScore: res.data.matchScore, capturedAt: new Date().toISOString() }
          }
        } catch {
          // Skill-gap analysis is optional — never block the debrief.
        }
      }

      await jobTrackerApi.update(job.id, { rejection })

      // Story-bank entry: what happened, what to do differently next time.
      try {
        await starStoriesApi.create({
          title: `Lesson from ${job.company || 'a rejection'} — ${job.title || ''}`.trim(),
          situation: `Applied to ${job.title || 'a role'} at ${job.company || 'a company'}${job.appliedAt ? ` (${new Date(job.appliedAt).toLocaleDateString()})` : ''}.`,
          task: `Reach the ${stage === 'interviewing' ? 'past the final interviews' : stage === 'applied' ? 'screening stage' : 'first response'} stage.`,
          action: reason ? `What happened: ${reason}` : 'Application did not move forward.',
          result: skills.length ? `Focus skills: ${skills.join(', ')}.` : 'No specific skill gap identified.',
          skills,
          roleTags: job.title ? [job.title] : [],
          source: 'rejection_debrief',
          trackedJobId: job.id,
        })
      } catch {
        // Story bank write is best-effort.
      }

      toast.success('Debrief saved — skill-gap view and story bank updated')
      onSaved?.()
    } catch (err) {
      setError(err.message || 'Could not save the debrief')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 12 }}
          className="relative w-full max-w-md rounded-2xl border border-border bg-background shadow-2xl overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-border bg-card/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-500">
                <ShieldAlert className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Rejection debrief</h3>
                <p className="text-xs text-muted-foreground">{job.title} · {job.company}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-lg transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            <label className="block">
              <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">How far did it get?</span>
              <select value={stage} onChange={(e) => setStage(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50">
                {REJECTION_STAGES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Reason (if you know it)</span>
              <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2}
                placeholder="e.g. 'Wanted more production Kubernetes experience'"
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 resize-none" />
            </label>
            <label className="block">
              <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Skills that came up short (comma-separated)</span>
              <input value={missingSkills} onChange={(e) => setMissingSkills(e.target.value)}
                placeholder="Kubernetes, system design"
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50" />
            </label>
            <label className="flex items-center gap-2 text-[12.5px] text-foreground/80">
              <input type="checkbox" checked={analyze} onChange={(e) => setAnalyze(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-[var(--primary)]" />
              Also run a skill-gap analysis against my resume (one AI call)
            </label>

            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" /><span>{error}</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <button onClick={onClose} className="rounded-lg px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground">Skip</button>
              <button
                onClick={save} disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-[13px] font-bold text-primary-foreground transition hover:brightness-110 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Save debrief
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              The debrief updates your skill-gap view and adds a story-bank entry — the product learns this person instead of starting from scratch next time.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
