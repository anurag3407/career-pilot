import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Mail, Loader2, ShieldAlert, Copy, Check, Sparkles, AlarmClock, HeartHandshake, TrendingUp,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { enhanceApi, careerProfileApi } from '../services/api'

// The four composer templates. `emailType` maps to the backend
// /api/enhance/generate-email template engine.
export const COMPOSER_TEMPLATES = [
  {
    key: 'application',
    label: 'First note',
    Icon: Mail,
    blurb: 'Introduce yourself to the hiring team',
    contextPlaceholder: 'Anything to add: the role, a referral, why this company...',
  },
  {
    key: 'follow_up',
    label: 'Follow-up',
    Icon: AlarmClock,
    blurb: 'Check in on an application gone quiet',
    contextPlaceholder: 'When did you apply? Any new win to mention?',
  },
  {
    key: 'thank_you',
    label: 'Thank-you',
    Icon: HeartHandshake,
    blurb: 'Send within 24h of an interview',
    contextPlaceholder: 'What did you discuss? Who did you meet?',
  },
  {
    key: 'negotiate',
    label: 'Negotiate',
    Icon: TrendingUp,
    blurb: 'Counter an offer with market data',
    contextPlaceholder: 'Current offer, target comp, competing signals...',
  },
]

const TONES = ['Professional', 'Friendly', 'Formal', 'Casual']

/**
 * MessageComposer — the one composer for first notes, follow-ups,
 * thank-yous, and negotiation emails. Used from the job card (drawer),
 * the /email-generator page, and the /outreach page.
 */
export default function MessageComposer({ job = null, initialTemplate = 'application', variant = 'page', onClose }) {
  const isDrawer = variant === 'drawer'
  const [template, setTemplate] = useState(initialTemplate)
  const [tone, setTone] = useState('Professional')
  const [resumeText, setResumeText] = useState('')
  const [resumeSource, setResumeSource] = useState('')
  const [jobDesc, setJobDesc] = useState(job?.description || '')
  const [context, setContext] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [copiedIdx, setCopiedIdx] = useState(null)

  const activeTemplate = useMemo(() => COMPOSER_TEMPLATES.find((t) => t.key === template) || COMPOSER_TEMPLATES[0], [template])

  // Load resume context: the packet's tailored text, else the master profile.
  useEffect(() => {
    const load = async () => {
      if (job?.packet?.tailoredResumeText) {
        setResumeText(job.packet.tailoredResumeText)
        setResumeSource(`Tailored resume · ${job.company}`)
        return
      }
      const prof = await careerProfileApi.get().catch(() => null)
      const master = prof?.profile?.masterResumeText || ''
      if (master) {
        setResumeText(master)
        setResumeSource('Career profile · master resume')
      } else {
        setResumeSource('')
      }
    }
    load()
  }, [job])

  const generate = async () => {
    if (!resumeText.trim() && !context.trim()) {
      setError('Add your resume text or some context first so the composer has something to work from.')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await enhanceApi.generateEmail({
        resume: resumeText || context,
        jobDesc: jobDesc || `${job?.title || 'the role'} at ${job?.company || 'the company'}`,
        tone,
        emailType: template,
        context,
      })
      setResult({ subjectLines: res?.subjectLines || [], variants: res?.variants || [] })
      toast.success('Drafts ready')
    } catch (err) {
      setError(err.message || 'Could not generate drafts')
    } finally {
      setLoading(false)
    }
  }

  const copy = async (idx) => {
    const email = `Subject: ${result.subjectLines[0] || ''}\n\n${result.variants[idx]}`
    await navigator.clipboard.writeText(email)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 1500)
  }

  const body = (
    <div className={isDrawer ? 'flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin' : 'space-y-4'}>
      {/* Template picker */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {COMPOSER_TEMPLATES.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTemplate(t.key)}
            className={`rounded-xl border p-3 text-left transition ${
              template === t.key
                ? 'border-primary/50 bg-primary/10 text-foreground'
                : 'border-border bg-card/40 text-muted-foreground hover:border-primary/30 hover:text-foreground'
            }`}
          >
            <t.Icon className={`h-4 w-4 mb-1.5 ${template === t.key ? 'text-primary' : 'text-muted-foreground'}`} aria-hidden="true" />
            <p className={`text-[13px] font-bold ${template === t.key ? 'text-primary' : 'text-foreground'}`}>{t.label}</p>
            <p className="text-[10.5px] leading-tight">{t.blurb}</p>
          </button>
        ))}
      </div>

      {/* Context fields */}
      <div className="grid gap-3">
        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
            Your resume {resumeSource ? <span className="ml-1 font-semibold text-primary normal-case">· {resumeSource}</span> : ''}
          </span>
          <textarea
            value={resumeText}
            onChange={(e) => { setResumeText(e.target.value); setResumeSource('') }}
            rows={4}
            placeholder="Paste your resume text (or set a master resume in your career profile)"
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-[13px] text-foreground outline-none focus:border-primary/50 resize-y"
          />
        </label>
        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Job / role context</span>
          <textarea
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            rows={3}
            placeholder={job ? `${job.title} at ${job.company}` : 'Paste the job description'}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-[13px] text-foreground outline-none focus:border-primary/50 resize-y"
          />
        </label>
        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{activeTemplate.label} context</span>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={2}
            placeholder={activeTemplate.contextPlaceholder}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-[13px] text-foreground outline-none focus:border-primary/50 resize-y"
          />
        </label>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Tone</span>
          <div className="flex flex-wrap gap-1.5">
            {TONES.map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition ${
                  tone === t ? 'border-primary/50 bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={generate}
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition hover:brightness-110 disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        {loading ? 'Drafting…' : `Generate ${activeTemplate.label.toLowerCase()} drafts`}
      </button>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" /><span>{error}</span>
        </div>
      )}

      {result && (
        <div className="space-y-2.5">
          {result.subjectLines.length > 0 && (
            <div className="rounded-lg border border-border bg-card/45 p-3">
              <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Subject lines</p>
              <ul className="space-y-1">
                {result.subjectLines.map((s, i) => (
                  <li key={i} className="text-[13px] font-semibold text-foreground/90">· {s}</li>
                ))}
              </ul>
            </div>
          )}
          {result.variants.map((v, i) => (
            <div key={i} className="rounded-lg border border-border bg-card/45 p-3">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Draft {i + 1}</span>
                <button
                  onClick={() => copy(i)}
                  className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/40 px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
                >
                  {copiedIdx === i ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  {copiedIdx === i ? 'Copied' : 'Copy email'}
                </button>
              </div>
              <pre className="whitespace-pre-wrap text-[12.5px] leading-relaxed text-foreground/85">{v}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  if (!isDrawer) {
    return (
      <div className="rounded-2xl border border-border bg-card/30 p-5">
        <div className="mb-4 flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Message composer</h2>
            <p className="text-xs text-muted-foreground">
              {job ? `${job.title} · ${job.company}` : 'First notes, follow-ups, thank-yous, and negotiation in one composer'}
            </p>
          </div>
        </div>
        {body}
      </div>
    )
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 220 }}
          className="relative w-full max-w-lg h-full bg-background border-l border-border shadow-2xl flex flex-col z-10 overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-border bg-card/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground line-clamp-1">Composer</h3>
                <p className="text-xs text-muted-foreground">{job ? `${job.title} · ${job.company}` : activeTemplate.blurb}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-lg transition">
              <X className="w-5 h-5" />
            </button>
          </div>
          {body}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
