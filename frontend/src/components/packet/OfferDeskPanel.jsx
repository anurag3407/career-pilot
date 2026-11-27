import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, PartyPopper, DollarSign, MapPin, CalendarClock, Loader2, ShieldAlert, Copy, Check, Send } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { jobTrackerApi, salaryApi, enhanceApi, careerProfileApi } from '../../services/api'

/**
 * OfferDeskBody — the offer desk fields + counter-email drafter, shared by
 * the drawer on the job card and the /offer-desk page.
 */
export function OfferDeskBody({ job, onSaved }) {
  const existing = job?.offer || {}
  const [base, setBase] = useState(existing.base || '')
  const [equity, setEquity] = useState(existing.equity || '')
  const [location, setLocation] = useState(existing.location || job?.location || '')
  const [deadline, setDeadline] = useState(existing.deadline || '')
  const [notes, setNotes] = useState(existing.notes || '')
  const [estimate, setEstimate] = useState(null)
  const [estimating, setEstimating] = useState(false)
  const [counterEmail, setCounterEmail] = useState(existing.counterEmail || null)
  const [drafting, setDrafting] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      setEstimating(true)
      try {
        const res = await salaryApi.estimate({
          title: job.title || '',
          location: location || job.location || '',
          experienceLevel: 'Mid level',
        })
        if (!cancelled) setEstimate(res?.data || null)
      } catch {
        // Estimator is best-effort; counter email still works without it.
      } finally {
        if (!cancelled) setEstimating(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [job.title, location])

  const draftCounter = async () => {
    setDrafting(true)
    setError('')
    try {
      let resumeText = job?.packet?.tailoredResumeText || ''
      if (!resumeText) {
        const prof = await careerProfileApi.get().catch(() => null)
        resumeText = prof?.profile?.masterResumeText || ''
      }
      const band = estimate
        ? `Market band for this role${location ? ` in ${location}` : ''}: $${estimate.p25 ?? '?'}–$${estimate.p75 ?? '?'} (median $${estimate.median ?? '?'}).`
        : ''
      const res = await enhanceApi.generateEmail({
        resume: resumeText || `${job.title} candidate`,
        jobDesc: job.description || `${job.title} at ${job.company}`,
        tone: 'Professional',
        emailType: 'negotiate',
        context: [
          band,
          base ? `Current offer: ${base}${equity ? ` base plus ${equity} equity` : ''}.` : 'The candidate has received an offer and wants to counter respectfully.',
          location ? `Role location: ${location}.` : '',
          notes ? `Candidate notes: ${notes}` : '',
        ].filter(Boolean).join(' '),
      })
      setCounterEmail({
        subjectLines: res?.subjectLines || [],
        variants: res?.variants || [],
        draftedAt: new Date().toISOString(),
      })
      toast.success('Counter-email drafted — review before sending')
    } catch (err) {
      setError(err.message || 'Could not draft the counter-email')
    } finally {
      setDrafting(false)
    }
  }

  const save = async () => {
    setSaving(true)
    try {
      await jobTrackerApi.update(job.id, {
        offer: {
          base,
          equity,
          location,
          deadline,
          notes,
          counterEmail,
          savedAt: new Date().toISOString(),
        },
      })
      toast.success('Offer saved to this card')
      onSaved?.()
    } catch (err) {
      toast.error(err.message || 'Could not save the offer')
    } finally {
      setSaving(false)
    }
  }

  const copyEmail = async (text) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="space-y-5">
      {/* Market estimate */}
      <div className="rounded-xl border border-border bg-card/45 p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <DollarSign className="w-4 h-4 text-emerald-500" />
          <div>
            <p className="text-sm font-bold text-foreground">Market band</p>
            <p className="text-[11px] text-muted-foreground">{estimating ? 'Estimating…' : estimate ? 'Live postings + baseline estimate' : 'Estimate unavailable'}</p>
          </div>
        </div>
        {estimate && (
          <p className="text-sm font-bold text-foreground">
            ${estimate.p25 ?? '?'}–${estimate.p75 ?? '?'}
          </p>
        )}
      </div>

      {/* Offer fields */}
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Base</span>
          <input value={base} onChange={(e) => setBase(e.target.value)} placeholder="$150,000"
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50" />
        </label>
        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Equity</span>
          <input value={equity} onChange={(e) => setEquity(e.target.value)} placeholder="0.05% / 4y"
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50" />
        </label>
        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</span>
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Remote / SF"
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50" />
        </label>
        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-1"><CalendarClock className="w-3 h-3" /> Response deadline</span>
          <input type="date" value={deadline || ''} onChange={(e) => setDeadline(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50" />
        </label>
      </div>
      <label className="block">
        <span className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Notes</span>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Anything to remember about this offer…"
          className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50 resize-none" />
      </label>

      {/* Counter email */}
      <div className="rounded-xl border border-primary/25 bg-primary/[0.05] p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-bold text-foreground flex items-center gap-2">
            <Send className="w-4 h-4 text-primary" /> Counter-email
          </p>
          <button
            onClick={draftCounter} disabled={drafting}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-[13px] font-bold text-primary-foreground transition hover:brightness-110 disabled:opacity-50"
          >
            {drafting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {counterEmail ? 'Redraft' : 'Draft from estimator'}
          </button>
        </div>
        {error && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" /><span>{error}</span>
          </div>
        )}
        {counterEmail && (
          <div className="mt-3 space-y-2">
            {counterEmail.subjectLines?.map((s, i) => (
              <p key={i} className="text-[12.5px] font-semibold text-foreground/90">Subject: {s}</p>
            ))}
            {counterEmail.variants?.map((v, i) => (
              <div key={i} className="rounded-lg bg-muted/30 border border-border p-3">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Variant {i + 1}</span>
                  <button
                    onClick={() => copyEmail(`Subject: ${counterEmail.subjectLines?.[0] || ''}\n\n${v}`)}
                    className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/40 px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}{copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="whitespace-pre-wrap text-[12px] leading-relaxed text-foreground/85">{v}</pre>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={save} disabled={saving}
        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:opacity-50"
      >
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        Save offer to this card
      </button>
    </div>
  )
}

/** Drawer variant — opens from an offered card on the tracker board. */
export default function OfferDeskPanel({ job, onClose, onSaved }) {
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
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-500 shrink-0">
                <PartyPopper className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground line-clamp-1">Offer desk</h3>
                <p className="text-xs text-muted-foreground">{job.title} · {job.company}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-lg transition">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
            <OfferDeskBody job={job} onSaved={onSaved} />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
