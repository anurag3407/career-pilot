import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion, useReducedMotion } from 'framer-motion'
import {
  FileText,
  Briefcase,
  Search,
  Plus,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Mic,
  Github,
  Flame,
  Palette,
  BookMarked,
  Settings as SettingsIcon,
  Check,
  Compass,
} from 'lucide-react'
import { resumeApi, jobTrackerApi, portfolioApi, userProfileApi, interviewApi } from '../services/api'
import {
  SkeletonAction,
  SkeletonStat,
  SkeletonRow,
  SkeletonBlock
} from '../components/ui/Skeleton'
import { getGithubUsername } from '../utils/github'
import { cn } from '../lib/utils'
import { useAuth } from '../hooks/useAuth'
import { NAV_GROUPS } from '../constants/navigation'

/* Dashboard — "Flight Deck" design system (src/styles/flightdeck.css).
   Monochrome tools, one orange signal for "in motion", green for wins. */

/* ─── Tool directory (shared navigation config, ordered by career journey) ─ */
const TOOL_DIRECTORY = NAV_GROUPS.filter((group) => group.id !== 'overview')

/* ─── Quick Actions ──────────────────────────────────────────────────── */
const QUICK_ACTIONS = [
  { label: 'Build resume', to: '/resume-builder/build', icon: FileText },
  { label: 'Search jobs', to: '/job-finder/search', icon: Search },
  { label: 'Mock interview', to: '/mock-interview/practice', icon: Mic },
  { label: 'Build portfolio', to: '/hub/portfolio', icon: Palette },
  { label: 'Roast resume', to: '/resume-roast/analyze', icon: Flame },
  { label: 'README generator', to: '/readme-generator', icon: BookMarked },
]

/* ─── Status Config ──────────────────────────────────────────────────── */
const STATUS_CONFIG = {
  saved: { label: 'Saved', dot: 'bg-foreground/30', text: 'text-foreground/60', ring: 'border-border' },
  applied: { label: 'Applied', dot: 'bg-foreground/70', text: 'text-foreground/80', ring: 'border-border' },
  interviewing: { label: 'Interviewing', dot: 'bg-primary', text: 'text-primary', ring: 'border-primary/30 bg-primary/[0.06]' },
  offered: { label: 'Offered', dot: 'bg-accent-foreground', text: 'text-accent-foreground', ring: 'border-accent-foreground/30 bg-accent' },
}

/* ─── Primitives ─────────────────────────────────────────────────────── */
function Eyebrow({ children, className }) {
  return (
    <span className={cn('font-mono text-[10px] uppercase tracking-[0.22em] text-primary/85', className)}>
      // {children}
    </span>
  )
}

function Mono({ children, className }) {
  return (
    <span className={cn('font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/40', className)}>
      {children}
    </span>
  )
}

function Panel({ label, action, children, className }) {
  return (
    <div className={cn('overflow-hidden rounded-xl border border-border bg-card', className)}>
      <div className="flex h-11 items-center justify-between border-b border-border px-5">
        <Mono>{label}</Mono>
        {action}
      </div>
      {children}
    </div>
  )
}

function PanelLink({ to, children }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1 text-[12px] font-medium text-foreground/55 transition-colors hover:text-primary"
    >
      {children}
    </Link>
  )
}

function EmptyRow({ icon: Icon, title, hint, cta }) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <span className="grid h-10 w-10 place-items-center rounded-lg border border-dashed border-border text-foreground/35">
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-4 text-sm font-medium">{title}</p>
      <p className="mt-1 text-[13px] text-foreground/50">{hint}</p>
      {cta && (
        <Link
          to={cta.to}
          className="mt-5 inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-1.5 text-[12.5px] font-medium text-primary-foreground transition hover:brightness-110"
        >
          {cta.label} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  )
}

function greetingFor(date = new Date()) {
  const h = date.getHours()
  if (h < 5) return 'Working late'
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

/* ─── Mission brief ──────────────────────────────────────────────────────
   New users get a four-step setup checklist computed from their real data.
   Once setup is complete (or skipped) it collapses into a single
   state-driven "next move" so the dashboard always answers "what now?". */
function MissionBrief({ steps, nextAction, dismissed, onDismiss }) {
  const doneCount = steps.filter((s) => s.done).length
  const allDone = doneCount === steps.length

  if (allDone || dismissed) {
    return (
      <div className="flex flex-col gap-4 rounded-xl border border-primary/25 bg-primary/[0.05] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary/15 text-primary">
            <Compass className="h-4 w-4" />
          </span>
          <div>
            <Mono className="text-primary/80">Next move</Mono>
            <p className="mt-1 text-[14px] font-semibold tracking-tight">{nextAction.title}</p>
            <p className="mt-0.5 text-[12.5px] text-foreground/55">{nextAction.desc}</p>
          </div>
        </div>
        <Link
          to={nextAction.to}
          className="inline-flex h-9 shrink-0 items-center gap-2 self-start rounded-md bg-primary px-4 text-[13px] font-medium text-primary-foreground transition hover:brightness-110 sm:self-auto"
        >
          {nextAction.cta} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex h-11 items-center justify-between border-b border-border px-5">
        <Mono>Get started · {doneCount}/{steps.length}</Mono>
        <button
          onClick={onDismiss}
          className="text-[12px] font-medium text-foreground/45 transition-colors hover:text-foreground"
        >
          Skip setup
        </button>
      </div>
      <div className="h-1 bg-foreground/[0.06]">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${(doneCount / steps.length) * 100}%` }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <ul className="grid gap-px bg-border sm:grid-cols-2 xl:grid-cols-4">
        {steps.map((step, idx) => (
          <li key={step.id} className="bg-card">
            <Link
              to={step.to}
              className={cn(
                'group flex h-full flex-col gap-2 px-5 py-4 transition-colors hover:bg-background',
                step.done && 'opacity-70'
              )}
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    'grid h-6 w-6 place-items-center rounded-full border font-mono text-[10px] tabular-nums',
                    step.done
                      ? 'border-accent-foreground/40 bg-accent text-accent-foreground'
                      : 'border-dashed border-foreground/30 text-foreground/40'
                  )}
                >
                  {step.done ? <Check className="h-3 w-3" /> : idx + 1}
                </span>
                {!step.done && (
                  <ArrowUpRight className="h-3.5 w-3.5 text-foreground/25 transition group-hover:text-primary" />
                )}
              </div>
              <p className={cn('text-[13.5px] font-semibold tracking-tight', step.done && 'line-through decoration-foreground/30')}>
                {step.label}
              </p>
              <p className="text-[12px] leading-relaxed text-foreground/50">{step.hint}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ─── Skeleton ───────────────────────────────────────────────────────── */
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonStat key={i} />)}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonAction key={i} />)}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {[0, 1].map((col) => (
          <div key={col} className="space-y-3">
            <SkeletonBlock className="h-6 w-40" />
            <div className="space-y-3 rounded-xl border border-border bg-card p-4">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Main Dashboard ─────────────────────────────────────────────────── */
export default function Dashboard() {
  const { user } = useAuth()
  const [resumes, setResumes] = useState([])
  const [trackedJobs, setTrackedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [jobStats, setJobStats] = useState({ total: 0, saved: 0, applied: 0, interviewing: 0, offered: 0 })
  const [portfolioCount, setPortfolioCount] = useState(0)
  const [interviewCount, setInterviewCount] = useState(0)
  const [candidateName, setCandidateName] = useState('')
  const [githubOverview, setGithubOverview] = useState({ connected: false, loading: false, stats: null })
  const [setupDismissed, setSetupDismissed] = useState(false)
  const fetchRequestId = useRef(0)
  const isMounted = useRef(false)

  const setupStorageKey = user?.uid ? `cp.setup.dismissed.${user.uid}` : null

  useEffect(() => {
    if (!setupStorageKey) return
    try {
      setSetupDismissed(localStorage.getItem(setupStorageKey) === '1')
    } catch {
      // Storage unavailable — show the checklist until data completes it.
    }
  }, [setupStorageKey])

  const dismissSetup = () => {
    setSetupDismissed(true)
    if (setupStorageKey) {
      try {
        localStorage.setItem(setupStorageKey, '1')
      } catch {
        // Non-fatal: dismissal still applies for this session.
      }
    }
  }

  useEffect(() => {
    isMounted.current = true
    fetchData()
    return () => { isMounted.current = false; fetchRequestId.current += 1 }
  }, [])

  const fetchData = async () => {
    const requestId = fetchRequestId.current + 1
    fetchRequestId.current = requestId
    const canUpdate = () => isMounted.current && fetchRequestId.current === requestId

    try {
      const [resumeRes, jobsRes, portfolioRes, userProfileRes, interviewRes] = await Promise.all([
        resumeApi.getAll().catch(() => ({ resumes: [] })),
        jobTrackerApi.getAll().catch(() => ({ trackedJobs: [] })),
        portfolioApi.getAll().catch(() => ({ portfolioItems: [] })),
        userProfileApi.getMyProfile().catch(() => null),
        interviewApi.getHistory().catch(() => null),
      ])
      if (!canUpdate()) return

      const fetchedResumes = Array.isArray(resumeRes.data) ? resumeRes.data : (resumeRes.resumes || resumeRes.data?.resumes || [])
      setResumes(fetchedResumes)
      const jobs = jobsRes.trackedJobs || []
      setTrackedJobs(jobs)

      const portfolios = portfolioRes.portfolios || portfolioRes.data?.portfolios || portfolioRes.data || []
      setPortfolioCount(Array.isArray(portfolios) ? portfolios.length : 0)

      const interviews = interviewRes?.data || interviewRes?.history || []
      setInterviewCount(Array.isArray(interviews) ? interviews.length : 0)

      const githubUsername = getGithubUsername(
        userProfileRes?.profile?.github || userProfileRes?.data?.github || userProfileRes?.github
      )
      const rawName = userProfileRes?.profile?.name || userProfileRes?.data?.name || userProfileRes?.name || ''
      setCandidateName(rawName.trim())

      if (githubUsername) {
        setGithubOverview({ connected: true, loading: true, stats: null })
        resumeApi.previewGitHub(githubUsername)
          .then((githubRes) => {
            if (!canUpdate()) return
            const preview = githubRes.preview || githubRes.data || githubRes
            setGithubOverview({ connected: true, loading: false, stats: buildGithubStats(preview) })
          })
          .catch(() => { if (canUpdate()) setGithubOverview({ connected: true, loading: false, stats: null }) })
      } else {
        setGithubOverview({ connected: false, loading: false, stats: null })
      }

      setJobStats({
        total: jobs.length,
        saved: jobs.filter(j => j.status === 'saved').length,
        applied: jobs.filter(j => j.status === 'applied').length,
        interviewing: jobs.filter(j => j.status === 'interviewing').length,
        offered: jobs.filter(j => j.status === 'offered').length,
      })
    } catch (error) {
      if (!canUpdate()) return
      console.error('Failed to fetch data:', error)
      setFetchError('Failed to load your dashboard. Please try again.')
      toast.error('Failed to load dashboard data')
    } finally {
      if (canUpdate()) setLoading(false)
    }
  }

  const buildGithubStats = (profile = {}) => {
    const repositorySource = profile.topRepositories || profile.repositories || profile.repos
    const repositories = Array.isArray(repositorySource) ? repositorySource : []
    const languageSource = profile.topLanguages || profile.languages || repositories.map((r) => r.language).filter(Boolean)
    const topLanguages = Array.isArray(languageSource) ? languageSource
      : Object.entries(languageSource || {}).sort((a, b) => Number(b[1]) - Number(a[1])).map(([l]) => l)
    const totalStars = profile.totalStars ?? profile.stars ?? repositories.reduce((s, r) => s + Number(r.stars || r.stargazers_count || 0), 0)
    return {
      totalRepos: profile.totalRepos ?? profile.public_repos ?? profile.publicRepos ?? repositories.length,
      totalStars,
      topLanguages: topLanguages.slice(0, 3),
      currentStreak: profile.currentStreak ?? profile.streak?.currentStreak ?? profile.current_streak ?? null,
    }
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const reduce = useReducedMotion()
  const firstName = candidateName.split(/\s+/)[0] || ''

  const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: reduce ? 0 : 0.05 } } }
  const item = reduce
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } }

  const inFlight = jobStats.applied + jobStats.interviewing + jobStats.offered
  const responseRate = inFlight > 0 ? Math.round(((jobStats.interviewing + jobStats.offered) / inFlight) * 100) : null
  const pipeline = [
    { key: 'saved', label: 'Saved', value: jobStats.saved, bar: 'bg-foreground/15' },
    { key: 'applied', label: 'Applied', value: jobStats.applied, bar: 'bg-foreground/60' },
    { key: 'interviewing', label: 'Interviewing', value: jobStats.interviewing, bar: 'bg-primary' },
    { key: 'offered', label: 'Offered', value: jobStats.offered, bar: 'bg-accent-foreground' },
  ]
  const pipelineTotal = pipeline.reduce((s, p) => s + p.value, 0)

  const stats = [
    { value: jobStats.total, label: 'Tracked', to: '/job-tracker' },
    { value: jobStats.applied, label: 'Applied', to: '/job-tracker' },
    { value: jobStats.interviewing, label: 'Interviews', to: '/job-tracker', tone: 'primary' },
    { value: jobStats.offered, label: 'Offers', to: '/job-tracker', tone: 'accent' },
    { value: resumes.length, label: 'Resumes', to: '/hub/resume' },
    { value: portfolioCount, label: 'Portfolios', to: '/hub/portfolio' },
  ]

  const summary = [
    jobStats.interviewing > 0 && `${jobStats.interviewing} interview${jobStats.interviewing === 1 ? '' : 's'} in flight`,
    jobStats.applied > 0 && `${jobStats.applied} application${jobStats.applied === 1 ? '' : 's'} out`,
    resumes.length > 0 && `${resumes.length} resume${resumes.length === 1 ? '' : 's'} ready`,
    interviewCount > 0 && `${interviewCount} practice session${interviewCount === 1 ? '' : 's'}`,
  ].filter(Boolean)

  const setupSteps = [
    {
      id: 'profile',
      label: 'Complete your profile',
      hint: 'Add your name and GitHub so every tool can personalize output.',
      to: '/profile',
      done: Boolean(candidateName) && githubOverview.connected,
    },
    {
      id: 'resume',
      label: 'Create your first resume',
      hint: 'Build from scratch, upload an old one, or paste plain text.',
      to: resumes.length > 0 ? '/hub/resume' : '/resume-builder/build',
      done: resumes.length > 0,
    },
    {
      id: 'job',
      label: 'Save your first job',
      hint: 'Search matching roles and track them on your pipeline.',
      to: trackedJobs.length > 0 ? '/job-tracker' : '/job-finder/search',
      done: trackedJobs.length > 0,
    },
    {
      id: 'interview',
      label: 'Run a mock interview',
      hint: 'Practice out loud with AI and get scored feedback.',
      to: interviewCount > 0 ? '/interview-history' : '/mock-interview/practice',
      done: interviewCount > 0,
    },
  ]

  const nextAction = (() => {
    if (resumes.length === 0) {
      return { title: 'Build the resume everything else relies on', desc: 'ATS-friendly, tailored, and ready to export in minutes.', cta: 'Build resume', to: '/resume-builder/build' }
    }
    if (jobStats.total === 0) {
      return { title: 'Find roles that match your resume', desc: 'AI-matched search across your skills and target titles.', cta: 'Search jobs', to: '/job-finder/search' }
    }
    if (jobStats.interviewing > 0) {
      return { title: 'Prep for the interviews already in flight', desc: 'Rehearse answers out loud and review past session feedback.', cta: 'Practice now', to: '/mock-interview/practice' }
    }
    if (jobStats.applied > 0) {
      return { title: 'Follow up before your applications go quiet', desc: 'A short, well-timed note keeps you visible to recruiters.', cta: 'Draft follow-up', to: '/email-generator' }
    }
    if (portfolioCount === 0) {
      return { title: 'Ship a portfolio that works while you sleep', desc: 'Turn your repos and resume into a live, shareable site.', cta: 'Open studio', to: '/hub/portfolio' }
    }
    return { title: 'Sharpen your edge with a mock interview', desc: 'Keep answers crisp between applications with scored practice.', cta: 'Practice now', to: '/mock-interview/practice' }
  })()

  return (
    <div className="cp-flight min-h-full bg-background text-foreground antialiased">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

        {/* ─── Header ─────────────────────────────────────────────── */}
        <motion.header
          initial={reduce ? false : { opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6 border-b border-border pb-8 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <Eyebrow>{today}</Eyebrow>
            <h1 className="mt-3 text-[2rem] font-medium leading-[1.05] tracking-[-0.045em] sm:text-[2.6rem]">
              {greetingFor()}
              {firstName ? (
                <>
                  , <span className="text-primary">{firstName}</span>.
                </>
              ) : (
                '.'
              )}
            </h1>
            <p className="mt-2.5 text-[14px] text-foreground/55">
              {summary.length > 0 ? summary.join(' · ') : 'Your cockpit is ready. Start with a resume or a job search.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent('cp:open-command-palette'))}
              className="hidden h-9 items-center gap-2 rounded-md border border-border px-3 text-[12px] text-foreground/50 transition hover:border-foreground/30 hover:text-foreground sm:inline-flex"
            >
              <Search className="h-3.5 w-3.5" /> Quick search
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
            </button>
            <Link
              to="/settings"
              aria-label="Settings"
              className="grid h-9 w-9 place-items-center rounded-md border border-border text-foreground/55 transition hover:border-foreground/30 hover:text-foreground"
            >
              <SettingsIcon className="h-4 w-4" />
            </Link>
            <Link
              to="/job-finder/search"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3.5 text-[13px] font-medium text-foreground/80 transition hover:border-foreground/30 hover:text-foreground"
            >
              <Search className="h-3.5 w-3.5" /> Search jobs
            </Link>
            <Link
              to="/resume-builder/build"
              className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3.5 text-[13px] font-medium text-primary-foreground shadow-[0_12px_32px_-16px_var(--primary)] transition hover:brightness-110"
            >
              <Plus className="h-3.5 w-3.5" /> New resume
            </Link>
          </div>
        </motion.header>

        {loading ? (
          <div className="mt-8">
            <DashboardSkeleton />
          </div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="visible" className="mt-8 space-y-6">

            {/* ─── Error Banner ─────────────────────────────────────── */}
            {fetchError && (
              <div className="flex items-center justify-between gap-4 rounded-xl border border-destructive/25 bg-destructive/[0.06] px-5 py-3 text-sm text-destructive">
                <span className="font-medium">{fetchError}</span>
                <button
                  onClick={fetchData}
                  className="rounded-md bg-destructive px-3 py-1 text-xs font-semibold text-destructive-foreground transition-opacity hover:opacity-90"
                >
                  Retry
                </button>
              </div>
            )}

            {/* ─── Mission brief (setup checklist → next best action) ─── */}
            <motion.div variants={item}>
              <MissionBrief
                steps={setupSteps}
                nextAction={nextAction}
                dismissed={setupDismissed}
                onDismiss={dismissSetup}
              />
            </motion.div>

            {/* ─── Instrument panel (stats) ─────────────────────────── */}
            <motion.div variants={item} className="overflow-hidden rounded-xl border border-border">
              <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-3 lg:grid-cols-6">
                {stats.map((stat, idx) => (
                  <Link key={stat.label} to={stat.to} className="group bg-card p-5 transition-colors hover:bg-background">
                    <div className="flex items-center justify-between">
                      <Mono>{stat.label}</Mono>
                      <span className="font-mono text-[10px] tabular-nums text-foreground/20">{String(idx + 1).padStart(2, '0')}</span>
                    </div>
                    <p
                      className={cn(
                        'mt-4 text-[2rem] font-medium leading-none tabular-nums tracking-[-0.04em]',
                        stat.tone === 'primary' && stat.value > 0 && 'text-primary',
                        stat.tone === 'accent' && stat.value > 0 && 'text-accent-foreground',
                      )}
                    >
                      {stat.value}
                    </p>
                    <ArrowUpRight className="mt-3 h-3.5 w-3.5 text-foreground/20 transition group-hover:text-primary" />
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* ─── Flight path (pipeline) + launchpad ───────────────── */}
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
              <motion.div variants={item}>
                <Panel
                  label="Flight path"
                  action={<PanelLink to="/job-tracker">Open tracker <ArrowRight className="h-3 w-3" /></PanelLink>}
                  className="h-full"
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-[2.4rem] font-medium leading-none tabular-nums tracking-[-0.05em]">
                          {responseRate != null ? `${responseRate}%` : '—'}
                        </p>
                        <p className="mt-2 text-[13px] text-foreground/50">
                          Response rate across {inFlight} sent application{inFlight === 1 ? '' : 's'}
                        </p>
                      </div>
                      {jobStats.offered > 0 && (
                        <span className="rounded bg-accent px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-accent-foreground">
                          {jobStats.offered} offer{jobStats.offered === 1 ? '' : 's'}
                        </span>
                      )}
                    </div>

                    <div className="mt-6 flex h-2 overflow-hidden rounded-full bg-foreground/[0.06]" role="img" aria-label="Pipeline breakdown">
                      {pipelineTotal > 0 &&
                        pipeline.map((p) =>
                          p.value > 0 ? (
                            <motion.span
                              key={p.key}
                              className={cn('h-full border-r-2 border-card last:border-r-0', p.bar)}
                              initial={reduce ? false : { width: 0 }}
                              animate={{ width: `${(p.value / pipelineTotal) * 100}%` }}
                              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                            />
                          ) : null,
                        )}
                    </div>

                    <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                      {pipeline.map((p) => (
                        <div key={p.key}>
                          <dt className="flex items-center gap-2">
                            <span className={cn('h-2 w-2 rounded-full', p.bar)} />
                            <Mono>{p.label}</Mono>
                          </dt>
                          <dd className="mt-1.5 text-lg font-medium tabular-nums tracking-tight">{p.value}</dd>
                        </div>
                      ))}
                    </dl>

                    {pipelineTotal === 0 && (
                      <p className="mt-5 border-t border-dashed border-border pt-4 text-[13px] text-foreground/50">
                        No applications yet.{' '}
                        <Link to="/job-finder/search" className="font-medium text-primary hover:underline">
                          Find your first role →
                        </Link>
                      </p>
                    )}
                  </div>
                </Panel>
              </motion.div>

              <motion.div variants={item}>
                <Panel label="Launchpad" className="h-full">
                  <div className="grid auto-rows-fr grid-cols-2 gap-px bg-border lg:h-[calc(100%-2.75rem)]">
                    {QUICK_ACTIONS.map((action) => (
                      <Link
                        key={action.label}
                        to={action.to}
                        className="group flex items-center gap-3 bg-card px-4 py-4 text-[13px] font-medium text-foreground/80 transition-colors hover:bg-background hover:text-foreground"
                      >
                        <action.icon className="h-4 w-4 shrink-0 text-foreground/40 transition-colors group-hover:text-primary" />
                        <span className="truncate">{action.label}</span>
                      </Link>
                    ))}
                  </div>
                </Panel>
              </motion.div>
            </div>

            {/* ─── Recent activity ──────────────────────────────────── */}
            <div className="grid gap-6 lg:grid-cols-2">
              <motion.div variants={item}>
                <Panel
                  label="Recent applications"
                  action={<PanelLink to="/job-tracker">View all <ArrowRight className="h-3 w-3" /></PanelLink>}
                  className="h-full"
                >
                  {trackedJobs.length === 0 ? (
                    <EmptyRow
                      icon={Briefcase}
                      title="No applications yet"
                      hint="Save roles from search or the browser extension."
                      cta={{ to: '/job-finder/search', label: 'Search jobs' }}
                    />
                  ) : (
                    <ul className="divide-y divide-border">
                      {trackedJobs.slice(0, 5).map((job, index) => {
                        const cfg = STATUS_CONFIG[job.status] || STATUS_CONFIG.saved
                        return (
                          <li key={job.id || index} className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-2 px-5 py-3.5 transition-colors hover:bg-background">
                            <span className="font-mono text-[10px] tabular-nums text-foreground/30">{String(index + 1).padStart(2, '0')}</span>
                            <div className="min-w-0">
                              <p className="truncate text-[13.5px] font-medium">{job.title}</p>
                              <p className="truncate text-[12px] text-foreground/50">{job.company}</p>
                            </div>
                            <span className={cn('inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em]', cfg.ring, cfg.text)}>
                              <span className={cn('h-1.5 w-1.5 rounded-full', cfg.dot)} /> {cfg.label}
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </Panel>
              </motion.div>

              <motion.div variants={item}>
                <Panel
                  label="My resumes"
                  action={<PanelLink to="/upload">Upload <Plus className="h-3 w-3" /></PanelLink>}
                  className="h-full"
                >
                  {resumes.length === 0 ? (
                    <EmptyRow
                      icon={FileText}
                      title="No resumes yet"
                      hint="Upload an existing one or build from scratch."
                      cta={{ to: '/resume-builder/build', label: 'Build resume' }}
                    />
                  ) : (
                    <ul className="divide-y divide-border">
                      {resumes.slice(0, 5).map((resume, index) => (
                        <li key={resume.id} className="group grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-2 px-5 py-3.5 transition-colors hover:bg-background">
                          <span className="font-mono text-[10px] tabular-nums text-foreground/30">{String(index + 1).padStart(2, '0')}</span>
                          <div className="min-w-0">
                            <p className="flex items-center gap-2 truncate text-[13.5px] font-medium">
                              <span className="truncate">{resume.title}</span>
                              {resume.enhancedText && (
                                <span className="inline-flex shrink-0 items-center gap-0.5 rounded bg-primary/10 px-1.5 py-px font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
                                  <Sparkles className="h-2.5 w-2.5" /> AI
                                </span>
                              )}
                            </p>
                            <p className="truncate text-[12px] text-foreground/50">
                              {resume.jobRole || 'General'} · {formatDate(resume.createdAt)}
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-1">
                            <Link to={`/resume/${resume.id}`} className="rounded-md px-2.5 py-1 text-[12px] font-medium text-foreground/55 transition-colors hover:bg-muted hover:text-foreground">
                              View
                            </Link>
                            <Link to={`/enhance/${resume.id}`} className="rounded-md border border-primary/25 px-2.5 py-1 text-[12px] font-medium text-primary transition-colors hover:bg-primary/10">
                              Enhance
                            </Link>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </Panel>
              </motion.div>
            </div>

            {/* ─── GitHub ───────────────────────────────────────────── */}
            <motion.div variants={item}>
              {githubOverview.connected ? (
                <div className="grid overflow-hidden rounded-xl border border-border bg-card sm:grid-cols-[minmax(0,1fr)_auto]">
                  <div className="flex items-center gap-3 px-5 py-4">
                    <span className="grid h-9 w-9 place-items-center rounded-md border border-border">
                      <Github className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="flex items-center gap-2 text-[14px] font-medium">
                        GitHub
                        {githubOverview.loading ? (
                          <Mono className="animate-pulse normal-case tracking-normal">syncing…</Mono>
                        ) : (
                          <span className="h-1.5 w-1.5 rounded-full bg-accent-foreground" aria-label="Connected" />
                        )}
                      </p>
                      <p className="text-[12px] text-foreground/50">Repository signal for your resume and portfolio</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-px border-t border-border bg-border sm:border-l sm:border-t-0">
                    {[
                      { label: 'Repos', value: githubOverview.stats?.totalRepos ?? '—' },
                      { label: 'Stars', value: githubOverview.stats?.totalStars ?? '—' },
                      { label: 'Top lang', value: githubOverview.stats?.topLanguages?.[0] || '—' },
                      { label: 'Streak', value: githubOverview.stats?.currentStreak != null ? `${githubOverview.stats.currentStreak}d` : '—' },
                    ].map((s) => (
                      <div key={s.label} className="bg-card px-4 py-3 sm:px-5">
                        <Mono>{s.label}</Mono>
                        <p className="mt-1 truncate text-[15px] font-medium tabular-nums">{s.value}</p>
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/github"
                    className="flex items-center justify-center gap-1.5 border-t border-border px-5 py-3 text-[12.5px] font-medium text-foreground/60 transition-colors hover:bg-background hover:text-primary sm:col-span-2"
                  >
                    Open GitHub dashboard <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col justify-between gap-3 rounded-xl border border-dashed border-border px-5 py-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3">
                    <Github className="h-4 w-4 text-foreground/40" />
                    <p className="text-[13.5px] text-foreground/60">Connect GitHub to pull repos, stars and languages into your profile.</p>
                  </div>
                  <Link
                    to="/profile"
                    className="inline-flex items-center gap-1.5 self-start rounded-md border border-border px-3 py-1.5 text-[12.5px] font-medium transition hover:border-primary/40 hover:text-primary sm:self-auto"
                  >
                    Connect <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </motion.div>

            {/* ─── Tool directory (ordered by the career journey) ───── */}
            <motion.section variants={item} className="pt-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <Eyebrow>Tool directory</Eyebrow>
                  <h2 className="mt-2 text-[1.5rem] font-medium tracking-[-0.035em]">Every tool, in journey order.</h2>
                  <p className="mt-1 text-[13px] text-foreground/50">
                    Prepare → find &amp; apply → interview → grow → connect. Start anywhere; the dashboard keeps your place.
                  </p>
                </div>
                <Mono className="text-foreground/35">
                  {TOOL_DIRECTORY.reduce((n, g) => n + g.items.length, 0)} tools · {TOOL_DIRECTORY.length} groups
                </Mono>
              </div>

              <div className="mt-6 overflow-hidden rounded-xl border border-border">
                {TOOL_DIRECTORY.map((group, gi) => (
                  <div key={group.id} className={cn('grid lg:grid-cols-[15rem_minmax(0,1fr)]', gi > 0 && 'border-t border-border')}>
                    <div className="flex items-center gap-3 border-b border-border bg-background px-5 py-4 lg:border-b-0 lg:border-r">
                      {group.stage ? (
                        <span className="font-mono text-[11px] tabular-nums text-primary/80">{group.stage}</span>
                      ) : (
                        <span className="font-mono text-[11px] text-foreground/30">+</span>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-semibold tracking-tight">{group.label}</p>
                        <Mono className="normal-case tracking-normal text-foreground/40">{group.tagline || `${group.items.length} tools`}</Mono>
                      </div>
                    </div>
                    <div className="grid gap-px bg-border sm:grid-cols-2 xl:grid-cols-3">
                      {group.items.map((tool) => (
                        <Link
                          key={tool.to}
                          to={tool.to}
                          className="group flex items-start gap-3 bg-card px-4 py-4 transition-colors hover:bg-background"
                        >
                          <tool.icon className="mt-0.5 h-4 w-4 shrink-0 text-foreground/40 transition-colors group-hover:text-primary" />
                          <div className="min-w-0">
                            <p className="flex items-center gap-1 text-[13px] font-medium transition-colors group-hover:text-primary">
                              {tool.label}
                              <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                            </p>
                            <p className="mt-0.5 line-clamp-1 text-[12px] text-foreground/50">{tool.desc}</p>
                          </div>
                        </Link>
                      ))}
                      {/* pad the hairline grid so short rows don't expose the border colour */}
                      {(() => {
                        const n = group.items.length
                        const padSm = (2 - (n % 2)) % 2
                        const padXl = (3 - (n % 3)) % 3
                        return Array.from({ length: Math.max(padSm, padXl) }).map((_, i) => (
                          <div
                            key={`pad-${i}`}
                            aria-hidden="true"
                            className={cn(
                              'hidden bg-card',
                              i < padSm ? 'sm:block' : 'sm:hidden',
                              i < padXl ? 'xl:block' : 'xl:hidden',
                            )}
                          />
                        ))
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* ─── Next moves ───────────────────────────────────────── */}
            <motion.div variants={item} className="overflow-hidden rounded-xl border border-border">
              <div className="grid gap-px bg-border sm:grid-cols-3">
                {[
                  { title: 'Optimize', desc: 'Tailor your resume to each job description before you apply.', to: '/hub/resume' },
                  { title: 'Track', desc: 'Keep notes and move statuses so nothing goes quiet.', to: '/job-tracker' },
                  { title: 'Follow up', desc: 'Check in a week after applying so your application stays visible.', to: '/job-alerts' },
                ].map((tip, idx) => (
                  <Link key={tip.title} to={tip.to} className="group bg-card p-5 transition-colors hover:bg-background">
                    <div className="flex items-baseline gap-3">
                      <span className={cn('font-mono text-xs tabular-nums', idx === 0 ? 'text-primary' : 'text-foreground/30')}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <p className="text-[14px] font-semibold tracking-tight">{tip.title}</p>
                        <p className="mt-1 text-[12.5px] leading-relaxed text-foreground/52">{tip.desc}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>

          </motion.div>
        )}
      </div>
    </div>
  )
}
