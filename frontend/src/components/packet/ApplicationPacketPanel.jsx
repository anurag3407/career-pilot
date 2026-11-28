import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Briefcase, FileText, Mail, HelpCircle, Send, Sparkles, ShieldAlert,
  Check, Copy, CalendarClock, Loader2, Layers, RefreshCw, PartyPopper,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'
import {
  enhanceApi, interviewApi, coverLetterApi, careerProfileApi,
  jobTrackerApi, resumeApi,
} from '../../services/api'
import { resumeDocToText } from '../../utils/resumeText'
import { tailorResumeToJob } from '../../services/resumeAi'
import { addDays, FOLLOW_UP_DAYS } from '../../utils/applicationFlow'

const STEPS = [
  { key: 'tailor', label: 'Tailored resume', icon: FileText, hint: 'Rewritten against this job description' },
  { key: 'coverLetter', label: 'Cover letter', icon: Mail, hint: 'Drafted from the tailored resume' },
  { key: 'questions', label: 'Likely interview questions', icon: HelpCircle, hint: 'Based on the role and your resume' },
  { key: 'followUp', label: 'Day-7 follow-up email', icon: Send, hint: 'Ready to send if they go quiet' },
]

const STEP_STATUS_ICON = {
  pending: <span className="w-4 h-4 rounded-full border-2 border-dashed border-foreground/25 inline-block" />,
  running: <Loader2 className="w-4 h-4 animate-spin text-primary" />,
  done: <span className="grid place-items-center w-4 h-4 rounded-full bg-emerald-500 text-white"><Check className="w-3 h-3" /></span>,
  error: <ShieldAlert className="w-4 h-4 text-destructive" />,
}

function CopyButton({ text, label = 'Copy' }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error('Copy failed')
    }
  }
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/40 px-2 py-1 text-[11px] font-semibold text-muted-foreground transition hover:text-foreground hover:border-primary/40"
    >
      {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
      {copied ? 'Copied' : label}
    </button>
  )
}

function Section({ icon: Icon, title, actions, children }) {
  return (
    <section className="rounded-xl border border-border bg-card/45 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h4 className="flex items-center gap-2 text-sm font-bold text-foreground">
          <Icon className="w-4 h-4 text-primary" /> {title}
        </h4>
        <div className="flex items-center gap-1.5">{actions}</div>
      </div>
      {children}
    </section>
  )
}

/**
 * ApplicationPacketPanel — one action from a saved role produces the whole
 * application: tailored resume, cover letter, likely interview questions,
 * and the day-7 follow-up email — all attached to the tracked job card.
 */
export default function ApplicationPacketPanel({ job, onClose, onUpdated }) {
  const [profile, setProfile] = useState(null)
  const [resumes, setResumes] = useState([])
  const [resumeId, setResumeId] = useState('')
  const [steps, setSteps] = useState({})
  const [building, setBuilding] = useState(false)
  const [buildError, setBuildError] = useState('')
  const [packet, setPacket] = useState(job?.packet || {})
  const [markAppliedOpen, setMarkAppliedOpen] = useState(false)

  const packetExists = useMemo(
    () => packet && (packet.tailoredResumeText || packet.coverLetter || packet.questions?.length || packet.followUpEmail),
    [packet],
  )

  useEffect(() => {
    const load = async () => {
      const [profileRes, resumesRes] = await Promise.all([
        careerProfileApi.get().catch(() => null),
        resumeApi.getAll().catch(() => null),
      ])
      const list = resumesRes?.resumes || resumesRes?.data || []
      const prof = profileRes?.profile || null
      setProfile(prof)
      setResumes(list)
      const preferred = prof?.masterResumeId || prof?.data?.masterResumeId
      const initial = list.find((r) => r.id === preferred)?.id || list[0]?.id || ''
      setResumeId(initial)
    }
    load()
  }, [])

  const resumeText = useMemo(() => resumeDocToText(resumes.find((r) => r.id === resumeId)), [resumes, resumeId])

  const setStep = (key, status, detail) =>
    setSteps((prev) => ({ ...prev, [key]: { status, detail } }))

  const persistPacket = async (nextPacket, extra = {}) => {
    const updated = await jobTrackerApi.update(job.id, {
      packet: nextPacket,
      lastActivityAt: new Date().toISOString(),
      ...extra,
    })
    setPacket(nextPacket)
    onUpdated?.(updated.trackedJob || updated.data)
    return updated
  }

  const buildPacket = async () => {
    if (!resumeId) {
      setBuildError('Create a resume first — the packet tailors it to this role.')
      return
    }
    if (!resumeText || !resumeText.trim()) {
      setBuildError('That resume has no usable text. Open it in the builder and add content first.')
      return
    }
    setBuilding(true)
    setBuildError('')
    setSteps({})

    const nextPacket = {
      ...(packet || {}),
      resumeLabel: resumes.find((r) => r.id === resumeId)?.title || 'Resume',
      builtAt: new Date().toISOString(),
    }
    let tailored = resumeText
    let resumeVersionId = packet?.resumeVersionId || null

    try {
      // 1 — tailor the resume against this description
      setStep('tailor', 'running')
      try {
        const { tailoredText } = await tailorResumeToJob(
          resumeText,
          job.description || `${job.title} at ${job.company}`,
          job.title || '',
        )
        tailored = tailoredText || resumeText
      } catch (err) {
        setStep('tailor', 'error', err.message)
        throw new Error('Resume tailoring failed: ' + (err.message || 'unknown error'))
      }
      nextPacket.tailoredResumeText = tailored
      setStep('tailor', 'done')

      // Snapshot the tailored resume as a version so it lives in the resume
      // system, not just on the card.
      try {
        const versionRes = await resumeApi.createVersion(resumeId, {
          versionLabel: `Packet · ${job.company || 'Role'}`,
          data: { tailoredText: tailored, basedOn: resumeId, trackedJobId: job.id },
        })
        resumeVersionId = versionRes?.data?.id || versionRes?.version?.id || resumeVersionId
      } catch {
        // Version snapshot is best-effort; the packet keeps the text either way.
      }

      // 2 — cover letter from the tailored resume
      setStep('coverLetter', 'running')
      let coverLetterId = packet?.coverLetterId || null
      try {
        const res = await coverLetterApi.generateText({
          resumeText: tailored,
          jobDescription: job.description || `${job.title} at ${job.company}`,
          companyName: job.company || '',
          hiringManager: '',
          tone: 'professional',
        })
        const letter = res?.coverLetter || res?.data?.coverLetter || ''
        nextPacket.coverLetter = letter
        if (letter) {
          try {
            const saved = await coverLetterApi.create({
              resumeId,
              jobTitle: job.title || '',
              company: job.company || '',
              tone: 'professional',
              content: letter,
              data: { trackedJobId: job.id },
            })
            coverLetterId = saved?.data?.id || saved?.coverLetter?.id || coverLetterId
          } catch {
            // Persisting the letter is best-effort.
          }
        }
        setStep('coverLetter', 'done')
      } catch (err) {
        setStep('coverLetter', 'error', err.message)
        throw new Error('Cover letter failed: ' + (err.message || 'unknown error'))
      }

      // 3 — likely interview questions for this role + tailored resume
      setStep('questions', 'running')
      try {
        const res = await interviewApi.previewQuestions({
          jobRole: job.title || 'this role',
          industry: job.industry || 'technology',
          experienceLevel: 'Mid',
          questionCount: 5,
          resumeText: tailored,
          jobDescriptionText: job.description || '',
        })
        nextPacket.questions = res?.data?.questions || []
        setStep('questions', 'done')
      } catch (err) {
        setStep('questions', 'error', err.message)
        throw new Error('Interview questions failed: ' + (err.message || 'unknown error'))
      }

      // 4 — day-7 follow-up email
      setStep('followUp', 'running')
      try {
        const res = await enhanceApi.generateEmail({
          resume: tailored,
          jobDesc: job.description || `${job.title} at ${job.company}`,
          tone: 'Friendly',
          emailType: 'follow_up',
          context: `The candidate applied to ${job.title} at ${job.company} and has heard nothing for 7 days. Write the follow-up they should send.`,
        })
        nextPacket.followUpEmail = {
          subjectLines: res?.subjectLines || [],
          variants: res?.variants || [],
          generatedAt: new Date().toISOString(),
        }
        setStep('followUp', 'done')
      } catch (err) {
        setStep('followUp', 'error', err.message)
        throw new Error('Follow-up email failed: ' + (err.message || 'unknown error'))
      }

      await persistPacket(nextPacket, {
        resumeId,
        resumeVersionId,
        coverLetterId,
      })
      toast.success('Packet ready — resume, letter, questions, and follow-up attached to this card')
    } catch (err) {
      setBuildError(err.message || 'Packet build failed')
      // Keep whatever steps completed so a retry resumes with them.
      if (Object.keys(nextPacket).length) {
        try {
          await persistPacket(nextPacket, { resumeId, resumeVersionId })
        } catch {
          // ignore persist errors on partial build
        }
      }
    } finally {
      setBuilding(false)
    }
  }

  const markApplied = async ({ scheduleFollowUp = true } = {}) => {
    try {
      const now = new Date().toISOString()
      await jobTrackerApi.updateStatus(job.id, 'applied')
      await jobTrackerApi.update(job.id, {
        appliedAt: now,
        ...(scheduleFollowUp
          ? { nextActionAt: addDays(now, FOLLOW_UP_DAYS).toISOString(), nextActionType: 'follow_up' }
          : {}),
      })
      toast.success(scheduleFollowUp ? 'Marked applied — day-7 follow-up scheduled' : 'Marked applied')
      setMarkAppliedOpen(false)
      onUpdated?.()
    } catch (err) {
      toast.error(err.message || 'Could not update the card')
    }
  }

  const scheduleFollowUp = async (days) => {
    try {
      if (days === null) {
        await jobTrackerApi.update(job.id, { nextActionAt: null, nextActionType: null })
        toast.success('Follow-up cleared')
      } else {
        await jobTrackerApi.update(job.id, {
          nextActionAt: addDays(new Date(), days).toISOString(),
          nextActionType: 'follow_up',
        })
        toast.success(`Follow-up scheduled in ${days} days`)
      }
      onUpdated?.()
    } catch (err) {
      toast.error(err.message || 'Could not schedule the follow-up')
    }
  }

  const nextActionLabel = job?.nextActionAt
    ? `${job.nextActionType === 'follow_up' ? 'Follow up' : 'Next action'} on ${new Date(job.nextActionAt).toLocaleDateString()}`
    : null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 220 }}
          className="relative w-full max-w-2xl h-full bg-background border-l border-border shadow-2xl flex flex-col z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-border bg-card/30 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground line-clamp-1">{job.title || 'Application packet'}</h3>
                <p className="text-xs text-muted-foreground">
                  {job.company || ''}{nextActionLabel ? ` · ${nextActionLabel}` : ''}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-lg transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin">
            {/* Source resume picker */}
            <div className="rounded-xl border border-border bg-card/45 p-4">
              <div className="flex items-center justify-between gap-3 mb-2">
                <p className="text-sm font-bold text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> Source resume
                </p>
                {profile?.masterResumeId ? (
                  <span className="text-[11px] font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                    Master profile
                  </span>
                ) : (
                  <Link to="/career-profile" className="text-[11px] font-semibold text-amber-500 hover:underline">
                    Set up your career profile →
                  </Link>
                )}
              </div>
              {resumes.length === 0 ? (
                <p className="text-xs text-muted-foreground">No resumes yet — <Link to="/resume-builder" className="text-primary hover:underline">build one</Link> first.</p>
              ) : (
                <select
                  value={resumeId}
                  onChange={(e) => setResumeId(e.target.value)}
                  disabled={building}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
                >
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title || 'Untitled resume'}{r.id === profile?.masterResumeId ? ' (master)' : ''}
                    </option>
                  ))}
                </select>
              )}
              <p className="mt-2 text-[11px] text-muted-foreground">
                One click produces the tailored resume, cover letter, likely questions, and the follow-up.
              </p>
            </div>

            {/* Build CTA + step list */}
            <div className="rounded-xl border border-primary/25 bg-primary/[0.05] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-foreground">
                  {packetExists ? 'Rebuild the packet' : 'Build the application packet'}
                </p>
                <button
                  onClick={buildPacket}
                  disabled={building || !resumeId}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-[13px] font-bold text-primary-foreground transition hover:brightness-110 disabled:opacity-50"
                >
                  {building ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {building ? 'Building…' : packetExists ? 'Rebuild' : 'Build packet'}
                </button>
              </div>
              <ul className="mt-3 space-y-2">
                {STEPS.map((step) => {
                  const state = steps[step.key]?.status || (packet?.[step.key === 'tailor' ? 'tailoredResumeText' : step.key === 'coverLetter' ? 'coverLetter' : step.key === 'questions' ? 'questions' : 'followUpEmail'] ? 'done' : 'pending')
                  const Icon = step.icon
                  return (
                    <li key={step.key} className="flex items-center gap-2.5 text-[13px]">
                      {STEP_STATUS_ICON[state] || STEP_STATUS_ICON.pending}
                      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className={`font-semibold ${state === 'error' ? 'text-destructive' : 'text-foreground'}`}>{step.label}</span>
                      <span className="text-muted-foreground text-[11px] truncate">
                        {steps[step.key]?.detail || (state === 'done' ? step.hint : '')}
                      </span>
                    </li>
                  )
                })}
              </ul>
              {buildError && (
                <div className="mt-3 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{buildError}</span>
                </div>
              )}
            </div>

            {/* Mark applied */}
            <div className="rounded-xl border border-border bg-card/45 p-4">
              <p className="text-sm font-bold text-foreground mb-1">Apply moment</p>
              <p className="text-xs text-muted-foreground mb-3">
                When you send this application, mark it here — a day-7 follow-up lands on your dashboard automatically.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setMarkAppliedOpen(true)}
                  disabled={building}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3.5 py-2 text-[13px] font-bold text-white transition hover:bg-emerald-500 disabled:opacity-50"
                >
                  <PartyPopper className="w-4 h-4" />
                  Mark applied{job.status === 'applied' ? ' (again)' : ''}
                </button>
                {job.appliedAt && (
                  <span className="text-[11px] text-muted-foreground">Applied {new Date(job.appliedAt).toLocaleDateString()}</span>
                )}
                {job.nextActionAt ? (
                  <>
                    <span className="text-[11px] text-muted-foreground">· Follow-up {new Date(job.nextActionAt).toLocaleDateString()}</span>
                    <button onClick={() => scheduleFollowUp(null)} className="text-[11px] font-semibold text-muted-foreground underline hover:text-foreground">clear</button>
                  </>
                ) : (
                  <button onClick={() => scheduleFollowUp(FOLLOW_UP_DAYS)} disabled={building} className="text-[11px] font-semibold text-primary underline hover:brightness-110 disabled:opacity-50">
                    schedule day-7 follow-up
                  </button>
                )}
              </div>
              {markAppliedOpen && (
                <div className="mt-3 rounded-lg border border-border bg-background p-3 space-y-2">
                  <p className="text-xs font-semibold text-foreground">Schedule the day-7 follow-up?</p>
                  <div className="flex gap-2">
                    <button onClick={() => markApplied({ scheduleFollowUp: true })} className="rounded-md bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground">Yes — remind me in 7 days</button>
                    <button onClick={() => markApplied({ scheduleFollowUp: false })} className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground">Mark applied without reminder</button>
                    <button onClick={() => setMarkAppliedOpen(false)} className="rounded-md px-2 py-1.5 text-xs text-muted-foreground">Cancel</button>
                  </div>
                </div>
              )}
            </div>

            {/* Packet contents */}
            {packet?.tailoredResumeText && (
              <Section
                icon={FileText}
                title="Tailored resume"
                actions={<CopyButton text={packet.tailoredResumeText} />}
              >
                <pre className="max-h-56 overflow-y-auto whitespace-pre-wrap rounded-lg bg-muted/30 border border-border p-3 text-[12px] leading-relaxed text-foreground/85 scrollbar-thin">
                  {packet.tailoredResumeText}
                </pre>
              </Section>
            )}

            {packet?.coverLetter && (
              <Section
                icon={Mail}
                title="Cover letter"
                actions={<CopyButton text={packet.coverLetter} />}
              >
                <pre className="max-h-56 overflow-y-auto whitespace-pre-wrap rounded-lg bg-muted/30 border border-border p-3 text-[12px] leading-relaxed text-foreground/85 scrollbar-thin">
                  {packet.coverLetter}
                </pre>
              </Section>
            )}

            {packet?.questions?.length > 0 && (
              <Section icon={HelpCircle} title="Likely interview questions">
                <ol className="space-y-1.5 list-decimal list-inside">
                  {packet.questions.map((q, i) => (
                    <li key={i} className="text-[12.5px] text-foreground/85">
                      {q.question || q}
                      {q.type && <span className="ml-1.5 text-[10px] uppercase tracking-wide text-muted-foreground">· {q.type}</span>}
                    </li>
                  ))}
                </ol>
                {job.id && (
                  <Link
                    to={`/mock-interview/practice?job=${job.id}`}
                    className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-bold text-primary hover:underline"
                  >
                    Practice this interview →
                  </Link>
                )}
              </Section>
            )}

            {packet?.followUpEmail && (
              <Section icon={Send} title="Day-7 follow-up email">
                <div className="space-y-2">
                  {(packet.followUpEmail.subjectLines || []).map((s, i) => (
                    <p key={i} className="text-[12.5px] font-semibold text-foreground/90">Subject: {s}</p>
                  ))}
                  {(packet.followUpEmail.variants || []).map((v, i) => (
                    <div key={i} className="rounded-lg bg-muted/30 border border-border p-3">
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Variant {i + 1}</span>
                        <CopyButton text={`Subject: ${packet.followUpEmail.subjectLines?.[0] || ''}\n\n${v}`} label="Copy email" />
                      </div>
                      <pre className="whitespace-pre-wrap text-[12px] leading-relaxed text-foreground/85">{v}</pre>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {packet?.builtAt && (
              <p className="text-center text-[11px] text-muted-foreground">
                Packet built {new Date(packet.builtAt).toLocaleString()}
                {packet.resumeVersionId ? ' · tailored resume saved as a resume version' : ''}
                {packet.coverLetterId ? ' · letter saved to Cover letters' : ''}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
