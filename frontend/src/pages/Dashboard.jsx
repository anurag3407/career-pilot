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
  Mic,
  Github,
  Palette,
  Mail,
  Settings as SettingsIcon,
  Layers,
  Target,
  UserRound,
  TrendingUp,
  Award,
  Users,
  BookOpen,
} from 'lucide-react'
import {
  resumeApi,
  jobTrackerApi,
  portfolioApi,
  userProfileApi,
  interviewApi,
  careerProfileApi,
  starStoriesApi,
} from '../services/api'
import DueToday from '../components/dashboard/DueToday'
import PipelineSummary from '../components/dashboard/PipelineSummary'
import ReadinessPanel from '../components/dashboard/ReadinessPanel'
import SuiteDirectory from '../components/dashboard/SuiteDirectory'
import {
  SkeletonAction,
  SkeletonStat,
  SkeletonRow,
  SkeletonBlock,
} from '../components/ui/Skeleton'
import { getGithubUsername } from '../utils/github'
import { cn } from '../lib/utils'
import { useAuth } from '../hooks/useAuth'

/* ─── Workspace Views (Paid-SaaS Suite Switcher) ───────────────────────── */
const WORKSPACE_TABS = [
  { id: 'all', label: 'Command Center' },
  { id: 'career-studio', label: '01 Career Studio' },
  { id: 'job-pipeline', label: '02 Job Pipeline' },
  { id: 'interview-growth', label: '03 Interview & Growth' },
  { id: 'presence-network', label: '04 Presence & Network' },
]

/* ─── Quick Launchpad Actions ──────────────────────────────────────────── */
const QUICK_ACTIONS = [
  { label: 'Build resume', to: '/resume-builder/build', icon: FileText },
  { label: 'Search jobs', to: '/job-finder/search', icon: Search },
  { label: 'Job tracker', to: '/job-tracker', icon: Target },
  { label: 'Mock interview', to: '/mock-interview/practice', icon: Mic },
  { label: 'Draft message', to: '/email-generator', icon: Mail },
  { label: 'Portfolio studio', to: '/hub/portfolio', icon: Palette },
]

/* ─── Job Status Styling (Flight Deck Semantic Tokens) ─────────────────── */
const STATUS_CONFIG = {
  saved: { label: 'Saved', dot: 'bg-foreground/30', text: 'text-foreground/65', ring: 'border-border' },
  applied: { label: 'Applied', dot: 'bg-foreground/75', text: 'text-foreground/85', ring: 'border-border' },
  interviewing: { label: 'Interviewing', dot: 'bg-primary', text: 'text-primary', ring: 'border-primary/30 bg-primary/[0.06]' },
  offered: { label: 'Offered', dot: 'bg-accent-foreground', text: 'text-accent-foreground', ring: 'border-accent-foreground/30 bg-accent' },
  rejected: { label: 'Closed', dot: 'bg-destructive', text: 'text-destructive', ring: 'border-destructive/30 bg-destructive/[0.06]' },
}

/* ─── Primitives ───────────────────────────────────────────────────────── */
function Eyebrow({ children, className }) {
  return (
    <span className={cn('font-mono text-[10px] uppercase tracking-[0.22em] text-primary/85', className)}>
      {children}
    </span>
  )
}

function Mono({ children, className }) {
  return (
    <span className={cn('font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/45', className)}>
      {children}
    </span>
  )
}

function Panel({ label, action, children, className }) {
  return (
    <section className={cn('overflow-hidden rounded-xl border border-border bg-card', className)}>
      <div className="flex h-11 items-center justify-between border-b border-border px-5">
        <Mono>{label}</Mono>
        {action}
      </div>
      {children}
    </section>
  )
}

function PanelLink({ to, children }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1 text-[12px] font-medium text-foreground/60 transition-colors hover:text-primary"
    >
      {children}
    </Link>
  )
}

function EmptyRow({ icon: Icon, title, hint, cta }) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <span className="grid h-10 w-10 place-items-center rounded-lg border border-dashed border-border text-foreground/40">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <p className="mt-4 text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 max-w-xs text-[13px] text-foreground/55">{hint}</p>
      {cta && (
        <Link
          to={cta.to}
          className="mt-5 inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-1.5 text-[12.5px] font-medium text-primary-foreground transition hover:brightness-110"
        >
          {cta.label} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
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

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonStat key={i} />)}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <SkeletonBlock className="h-72 rounded-xl" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonAction key={i} />)}
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {[0, 1].map((col) => (
          <div key={col} className="space-y-3 rounded-xl border border-border bg-card p-4">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Main Dashboard ───────────────────────────────────────────────────── */
export default function Dashboard() {
  const { user } = useAuth()
  const [activeWorkspace, setActiveWorkspace] = useState('all')
  const [resumes, setResumes] = useState([])
  const [trackedJobs, setTrackedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [jobStats, setJobStats] = useState({ total: 0, saved: 0, applied: 0, interviewing: 0, offered: 0 })
  const [portfolioCount, setPortfolioCount] = useState(0)
  const [interviews, setInterviews] = useState([])
  const [starStoryCount, setStarStoryCount] = useState(0)
  const [careerProfile, setCareerProfile] = useState(null)
  const [candidateName, setCandidateName] = useState('')
  const [githubOverview, setGithubOverview] = useState({ connected: false, loading: false, stats: null })
  const [setupDismissed, setSetupDismissed] = useState(false)
  const [weeklyApplyTarget, setWeeklyApplyTarget] = useState(5)
  const fetchRequestId = useRef(0)
  const isMounted = useRef(false)

  const setupStorageKey = user?.uid ? `cp.setup.dismissed.${user.uid}` : null

  useEffect(() => {
    if (!setupStorageKey) return
    try {
      setSetupDismissed(localStorage.getItem(setupStorageKey) === '1')
    } catch {
      // Storage unavailable
    }
  }, [setupStorageKey])

  const persistSetupDismissed = (val) => {
    setSetupDismissed(val)
    if (setupStorageKey) {
      try {
        if (val) localStorage.setItem(setupStorageKey, '1')
        else localStorage.removeItem(setupStorageKey)
      } catch {
        // Non-fatal
      }
    }
  }

  useEffect(() => {
    isMounted.current = true
    fetchData()
    return () => {
      isMounted.current = false
      fetchRequestId.current += 1
    }
  }, [])

  const buildGithubStats = (profile = {}) => {
    const repositorySource = profile.topRepositories || profile.repositories || profile.repos
    const repositories = Array.isArray(repositorySource) ? repositorySource : []
    const languageSource = profile.topLanguages || profile.languages || repositories.map((r) => r.language).filter(Boolean)
    const topLanguages = Array.isArray(languageSource)
      ? languageSource
      : Object.entries(languageSource || {}).sort((a, b) => Number(b[1]) - Number(a[1])).map(([l]) => l)
    const totalStars =
      profile.totalStars ??
      profile.stars ??
      repositories.reduce((s, r) => s + Number(r.stars || r.stargazers_count || 0), 0)
    return {
      totalRepos: profile.totalRepos ?? profile.public_repos ?? profile.publicRepos ?? repositories.length,
      totalStars,
      topLanguages: topLanguages.slice(0, 3),
      currentStreak: profile.currentStreak ?? profile.streak?.currentStreak ?? profile.current_streak ?? null,
    }
  }

  const fetchData = async () => {
    const requestId = fetchRequestId.current + 1
    fetchRequestId.current = requestId
    const canUpdate = () => isMounted.current && fetchRequestId.current === requestId
    setFetchError('')

    try {
      const [resumeRes, jobsRes, portfolioRes, userProfileRes, interviewRes, profileRes, storiesRes] = await Promise.all([
        resumeApi.getAll().catch(() => ({ resumes: [] })),
        jobTrackerApi.getAll().catch(() => ({ trackedJobs: [] })),
        portfolioApi.getAll().catch(() => ({ portfolioItems: [] })),
        userProfileApi.getMyProfile().catch(() => null),
        interviewApi.getHistory().catch(() => null),
        careerProfileApi.get().catch(() => null),
        starStoriesApi.getAll().catch(() => null),
      ])
      if (!canUpdate()) return

      const fetchedResumes = Array.isArray(resumeRes.data)
        ? resumeRes.data
        : resumeRes.resumes || resumeRes.data?.resumes || []
      setResumes(fetchedResumes)

      const jobs = jobsRes.trackedJobs || []
      setTrackedJobs(jobs)

      const prof = profileRes?.profile || null
      setCareerProfile(prof)
      const target = prof?.weeklyApplyTarget
      if (Number.isFinite(target) && target > 0) setWeeklyApplyTarget(target)

      const storyList = storiesRes?.stories || storiesRes?.data || []
      setStarStoryCount(Array.isArray(storyList) ? storyList.length : 0)

      const portfolios = portfolioRes.portfolios || portfolioRes.data?.portfolios || portfolioRes.data || []
      setPortfolioCount(Array.isArray(portfolios) ? portfolios.length : 0)

      const interviewList = interviewRes?.data || interviewRes?.history || []
      setInterviews(Array.isArray(interviewList) ? interviewList : [])

      const githubUsername = getGithubUsername(
        userProfileRes?.profile?.github || userProfileRes?.data?.github || userProfileRes?.github,
      )
      const rawName = userProfileRes?.profile?.name || userProfileRes?.data?.name || userProfileRes?.name || ''
      setCandidateName(rawName.trim())

      if (githubUsername) {
        setGithubOverview({ connected: true, loading: true, stats: null })
        resumeApi
          .previewGitHub(githubUsername)
          .then((githubRes) => {
            if (!canUpdate()) return
            const preview = githubRes.preview || githubRes.data || githubRes
            setGithubOverview({ connected: true, loading: false, stats: buildGithubStats(preview) })
          })
          .catch(() => {
            if (canUpdate()) setGithubOverview({ connected: true, loading: false, stats: null })
          })
      } else {
        setGithubOverview({ connected: false, loading: false, stats: null })
      }

      setJobStats({
        total: jobs.length,
        saved: jobs.filter((j) => j.status === 'saved').length,
        applied: jobs.filter((j) => j.status === 'applied').length,
        interviewing: jobs.filter((j) => j.status === 'interviewing').length,
        offered: jobs.filter((j) => j.status === 'offered').length,
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

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recent'

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const reduce = useReducedMotion()
  const firstName = candidateName.split(/\s+/)[0] || ''

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: reduce ? 0 : 0.04 } },
  }
  const item = reduce
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } } }

  const stats = [
    { value: jobStats.total, label: 'Tracked', to: '/job-tracker' },
    { value: jobStats.applied, label: 'Applied', to: '/job-tracker?status=applied' },
    { value: jobStats.interviewing, label: 'Interviews', to: '/job-tracker?status=interviewing', tone: 'primary' },
    { value: jobStats.offered, label: 'Offers', to: '/job-tracker?status=offered', tone: 'accent' },
    { value: resumes.length, label: 'Resumes', to: '/hub/resume' },
    { value: portfolioCount, label: 'Portfolios', to: '/hub/portfolio' },
  ]

  const summary = [
    jobStats.interviewing > 0 && `${jobStats.interviewing} interview${jobStats.interviewing === 1 ? '' : 's'} active`,
    jobStats.applied > 0 && `${jobStats.applied} application${jobStats.applied === 1 ? '' : 's'} out`,
    resumes.length > 0 && `${resumes.length} resume${resumes.length === 1 ? '' : 's'} ready`,
    interviews.length > 0 && `${interviews.length} practice session${interviews.length === 1 ? '' : 's'}`,
  ].filter(Boolean)

  const setupSteps = [
    {
      id: 'career-profile',
      label: 'Set master resume & target roles',
      to: '/career-profile',
      done: Boolean(careerProfile?.masterResumeId) && (careerProfile?.targetRoles?.length || 0) > 0,
    },
    {
      id: 'resume',
      label: 'Create or upload your resume',
      to: resumes.length > 0 ? '/hub/resume' : '/resume-builder/build',
      done: resumes.length > 0,
    },
    {
      id: 'job',
      label: 'Save roles to your pipeline',
      to: trackedJobs.length > 0 ? '/job-tracker' : '/job-finder/search',
      done: trackedJobs.length > 0,
    },
    {
      id: 'interview',
      label: 'Complete a mock interview',
      to: interviews.length > 0 ? '/interview-history' : '/mock-interview/practice',
      done: interviews.length > 0,
    },
    {
      id: 'github',
      label: 'Connect GitHub & portfolio',
      to: githubOverview.connected ? '/github' : '/profile',
      done: githubOverview.connected,
    },
  ]

  const nextAction = (() => {
    if (resumes.length === 0) {
      return {
        title: 'Build the resume every tool draws from',
        desc: 'ATS-friendly, structured, and ready to tailor for each role.',
        cta: 'Build resume',
        to: '/resume-builder/build',
      }
    }
    if (!careerProfile?.masterResumeId) {
      return {
        title: 'Link your master resume in Career Profile',
        desc: 'Unlocks one-click application packets, mock interviews, and tailored outreach.',
        cta: 'Open profile',
        to: '/career-profile',
      }
    }
    if (jobStats.total === 0) {
      return {
        title: 'Find roles matching your skills',
        desc: 'Search openings and save them directly to your Kanban tracker.',
        cta: 'Search jobs',
        to: '/job-finder/search',
      }
    }
    if (jobStats.interviewing > 0) {
      return {
        title: 'Rehearse for active interviews',
        desc: 'Practice role-specific questions with AI scoring and replay.',
        cta: 'Start practice',
        to: '/mock-interview/practice',
      }
    }
    if (jobStats.applied > 0) {
      return {
        title: 'Send timely recruiter follow-ups',
        desc: 'Draft tailored follow-up notes anchored in your application packet.',
        cta: 'Open composer',
        to: '/email-generator?template=follow_up',
      }
    }
    if (portfolioCount === 0) {
      return {
        title: 'Publish a developer portfolio',
        desc: 'Convert your GitHub repos or resume into a live deployed site.',
        cta: 'Open studio',
        to: '/hub/portfolio',
      }
    }
    return {
      title: 'Review your conversion analytics',
      desc: 'See which resume versions earn callbacks and where to sharpen skills.',
      cta: 'View analytics',
      to: '/dashboard/analytics',
    }
  })()

  const avgInterviewScore =
    interviews.length > 0
      ? Math.round(interviews.reduce((sum, s) => sum + Number(s.overallScore || 0), 0) / interviews.length)
      : null

  const showAll = activeWorkspace === 'all'
  const showCareerStudio = showAll || activeWorkspace === 'career-studio'
  const showJobPipeline = showAll || activeWorkspace === 'job-pipeline'
  const showInterviewGrowth = activeWorkspace === 'interview-growth'
  const showPresenceNetwork = showAll || activeWorkspace === 'presence-network'

  return (
    <div className="cp-flight min-h-full bg-background text-foreground antialiased">
      <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">

        {/* ─── Header ─────────────────────────────────────────────── */}
        <motion.header
          initial={reduce ? false : { opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-5 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div>
            <Eyebrow>{today}</Eyebrow>
            <h1 className="mt-2.5 text-[2rem] font-medium leading-[1.05] tracking-[-0.045em] sm:text-[2.5rem]">
              {greetingFor()}
              {firstName ? (
                <>
                  , <span className="text-primary">{firstName}</span>.
                </>
              ) : (
                '.'
              )}
            </h1>
            <p className="mt-2 text-[14px] text-foreground/55">
              {summary.length > 0
                ? summary.join(' · ')
                : 'Your career command center is ready. Start with a resume or search open roles.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/career-profile"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-[12.5px] font-medium text-foreground/80 transition hover:border-foreground/30 hover:text-foreground"
            >
              <UserRound className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              Career profile
            </Link>
            <Link
              to="/job-finder/search"
              className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3.5 text-[13px] font-medium text-foreground/85 transition hover:border-foreground/30 hover:text-foreground"
            >
              <Search className="h-3.5 w-3.5" aria-hidden="true" /> Search jobs
            </Link>
            <Link
              to="/resume-builder/build"
              className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3.5 text-[13px] font-medium text-primary-foreground transition hover:brightness-110"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" /> New resume
            </Link>
            <Link
              to="/settings"
              aria-label="Settings"
              className="grid h-9 w-9 place-items-center rounded-md border border-border bg-card text-foreground/60 transition hover:border-foreground/30 hover:text-foreground"
            >
              <SettingsIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </motion.header>

        {/* ─── Workspace Suite Switcher ───────────────────────────── */}
        <div
          className="mt-5 flex items-center gap-1.5 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Dashboard workspace views"
        >
          {WORKSPACE_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeWorkspace === tab.id}
              onClick={() => setActiveWorkspace(tab.id)}
              className={cn(
                'shrink-0 rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors',
                activeWorkspace === tab.id
                  ? 'border-primary/40 bg-primary/10 text-primary'
                  : 'border-border bg-card text-foreground/65 hover:text-foreground',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-6">
            <DashboardSkeleton />
          </div>
        ) : (
          <motion.div variants={container} initial="hidden" animate="visible" className="mt-6 space-y-6">

            {/* ─── Error Banner ─────────────────────────────────────── */}
            {fetchError && (
              <div className="flex items-center justify-between gap-4 rounded-xl border border-destructive/25 bg-destructive/[0.06] px-5 py-3 text-sm text-destructive">
                <span className="font-medium">{fetchError}</span>
                <button
                  type="button"
                  onClick={fetchData}
                  className="rounded-md bg-destructive px-3 py-1 text-xs font-semibold text-destructive-foreground transition-opacity hover:opacity-90"
                >
                  Retry
                </button>
              </div>
            )}

            {/* ─── Instrument Panel (Key Metrics) ───────────────────── */}
            {showAll && (
              <motion.div variants={item} className="overflow-hidden rounded-xl border border-border">
                <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-3 lg:grid-cols-6">
                  {stats.map((stat, idx) => (
                    <Link key={stat.label} to={stat.to} className="group bg-card p-4 sm:p-5 transition-colors hover:bg-background">
                      <div className="flex items-center justify-between">
                        <Mono>{stat.label}</Mono>
                        <span className="font-mono text-[10px] tabular-nums text-foreground/25">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                      </div>
                      <p
                        className={cn(
                          'mt-3.5 text-[1.9rem] font-medium leading-none tabular-nums tracking-[-0.04em]',
                          stat.tone === 'primary' && stat.value > 0 && 'text-primary',
                          stat.tone === 'accent' && stat.value > 0 && 'text-accent-foreground',
                        )}
                      >
                        {stat.value}
                      </p>
                      <ArrowUpRight className="mt-3 h-3.5 w-3.5 text-foreground/25 transition group-hover:text-primary" aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ─── Due Today Strip ──────────────────────────────────── */}
            {showJobPipeline && (
              <motion.div variants={item}>
                <DueToday jobs={trackedJobs} weeklyTarget={weeklyApplyTarget} />
              </motion.div>
            )}

            {/* ─── Command Center Split (Pipeline + Readiness) ──────── */}
            {showAll && (
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
                <motion.div variants={item}>
                  <PipelineSummary
                    jobStats={jobStats}
                    trackedJobs={trackedJobs}
                    weeklyApplyTarget={weeklyApplyTarget}
                    nextAction={nextAction}
                  />
                </motion.div>
                <motion.div variants={item}>
                  <ReadinessPanel
                    steps={setupSteps}
                    quickActions={QUICK_ACTIONS}
                    dismissed={setupDismissed}
                    onDismiss={() => persistSetupDismissed(true)}
                    onRestore={() => persistSetupDismissed(false)}
                  />
                </motion.div>
              </div>
            )}

            {/* ─── Focused Suite Highlights (when a specific suite tab is active) */}
            {activeWorkspace === 'career-studio' && (
              <motion.div variants={item} className="grid gap-4 sm:grid-cols-3">
                <Link to="/career-profile" className="rounded-xl border border-border bg-card p-5 transition hover:border-primary/40">
                  <Mono>Target roles</Mono>
                  <p className="mt-2 text-lg font-medium text-foreground">
                    {careerProfile?.targetRoles?.length
                      ? careerProfile.targetRoles.join(', ')
                      : 'None configured'}
                  </p>
                  <p className="mt-1 text-xs text-foreground/55">
                    {careerProfile?.masterResumeId ? 'Master resume linked' : 'Link a master resume'}
                  </p>
                </Link>
                <Link to="/career-profile" className="rounded-xl border border-border bg-card p-5 transition hover:border-primary/40">
                  <Mono>STAR story bank</Mono>
                  <p className="mt-2 text-2xl font-medium tabular-nums text-foreground">{starStoryCount}</p>
                  <p className="mt-1 text-xs text-foreground/55">Reusable behavioral stories</p>
                </Link>
                <Link to="/linkedin-optimizer" className="rounded-xl border border-border bg-card p-5 transition hover:border-primary/40">
                  <Mono>LinkedIn &amp; roast</Mono>
                  <p className="mt-2 text-base font-medium text-foreground">Optimize profile or roast resume</p>
                  <p className="mt-1 text-xs text-primary">Open Career Studio tools</p>
                </Link>
              </motion.div>
            )}

            {activeWorkspace === 'job-pipeline' && (
              <motion.div variants={item}>
                <PipelineSummary
                  jobStats={jobStats}
                  trackedJobs={trackedJobs}
                  weeklyApplyTarget={weeklyApplyTarget}
                  nextAction={nextAction}
                />
              </motion.div>
            )}

            {showInterviewGrowth && (
              <motion.div variants={item} className="grid gap-6 lg:grid-cols-2">
                <Panel
                  label="Interview readiness"
                  action={<PanelLink to="/interview-history">History <ArrowRight className="h-3 w-3" aria-hidden="true" /></PanelLink>}
                >
                  <div className="p-5 sm:p-6">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                      <div>
                        <Mono>Sessions</Mono>
                        <p className="mt-1.5 text-2xl font-medium tabular-nums">{interviews.length}</p>
                      </div>
                      <div>
                        <Mono>Avg score</Mono>
                        <p className="mt-1.5 text-2xl font-medium tabular-nums text-primary">
                          {avgInterviewScore != null ? `${avgInterviewScore}%` : 'No data'}
                        </p>
                      </div>
                      <div>
                        <Mono>STAR stories</Mono>
                        <p className="mt-1.5 text-2xl font-medium tabular-nums">{starStoryCount}</p>
                      </div>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <Link
                        to="/mock-interview/practice"
                        className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground transition hover:brightness-110"
                      >
                        <Mic className="h-3.5 w-3.5" aria-hidden="true" /> Start mock interview
                      </Link>
                      <Link
                        to="/dashboard/analytics"
                        className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3.5 text-xs font-medium text-foreground hover:border-primary/40"
                      >
                        View performance analytics
                      </Link>
                    </div>
                  </div>
                </Panel>

                <Panel
                  label="Skill gap &amp; career path"
                  action={<PanelLink to="/skill-gap">Analyze <ArrowRight className="h-3 w-3" aria-hidden="true" /></PanelLink>}
                >
                  <div className="p-5 sm:p-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="mt-0.5 h-5 w-5 text-primary shrink-0" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">Compare resume against target JDs</p>
                        <p className="mt-1 text-xs text-foreground/55">
                          Surface missing technical skills, synergy recommendations, and rejection learnings from your tracker.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to="/skill-gap"
                        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs font-medium hover:border-primary/40 hover:text-primary"
                      >
                        Skill Gap Analyzer
                      </Link>
                      <Link
                        to="/career-path"
                        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-xs font-medium hover:border-primary/40 hover:text-primary"
                      >
                        Career Path Planner
                      </Link>
                    </div>
                  </div>
                </Panel>
              </motion.div>
            )}

            {/* ─── Active Applications & Resumes ────────────────────── */}
            {(showJobPipeline || showCareerStudio) && (
              <div className={cn('grid gap-6', showJobPipeline && showCareerStudio ? 'lg:grid-cols-2' : 'grid-cols-1')}>
                {showJobPipeline && (
                  <motion.div variants={item}>
                    <Panel
                      label="Active applications"
                      action={<PanelLink to="/job-tracker">View all <ArrowRight className="h-3 w-3" aria-hidden="true" /></PanelLink>}
                      className="h-full"
                    >
                      {trackedJobs.length === 0 ? (
                        <EmptyRow
                          icon={Briefcase}
                          title="No applications tracked yet"
                          hint="Save roles from Job Search or the browser extension to build tailored packets."
                          cta={{ to: '/job-finder/search', label: 'Search jobs' }}
                        />
                      ) : (
                        <ul className="divide-y divide-border">
                          {trackedJobs.slice(0, 5).map((job, index) => {
                            const cfg = STATUS_CONFIG[job.status] || STATUS_CONFIG.saved
                            const jobId = job.id || job._id
                            return (
                              <li
                                key={jobId || index}
                                className="group grid grid-cols-[1.75rem_minmax(0,1fr)_auto] items-center gap-3 px-5 py-3.5 transition-colors hover:bg-background"
                              >
                                <span className="font-mono text-[10px] tabular-nums text-foreground/30">
                                  {String(index + 1).padStart(2, '0')}
                                </span>
                                <div className="min-w-0">
                                  <p className="truncate text-[13.5px] font-medium text-foreground">{job.title}</p>
                                  <p className="truncate text-[12px] text-foreground/55">{job.company}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  {jobId && (
                                    <Link
                                      to={`/job-tracker?job=${jobId}&packet=1`}
                                      className="hidden items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] font-medium text-foreground/65 transition hover:border-primary/40 hover:text-primary sm:inline-flex"
                                    >
                                      <Layers className="h-3 w-3" aria-hidden="true" />
                                      Packet
                                    </Link>
                                  )}
                                  <span
                                    className={cn(
                                      'inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em]',
                                      cfg.ring,
                                      cfg.text,
                                    )}
                                  >
                                    <span className={cn('h-1.5 w-1.5 rounded-full', cfg.dot)} />
                                    {cfg.label}
                                  </span>
                                </div>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </Panel>
                  </motion.div>
                )}

                {showCareerStudio && (
                  <motion.div variants={item}>
                    <Panel
                      label="Resume library"
                      action={<PanelLink to="/upload">Upload PDF <Plus className="h-3 w-3" aria-hidden="true" /></PanelLink>}
                      className="h-full"
                    >
                      {resumes.length === 0 ? (
                        <EmptyRow
                          icon={FileText}
                          title="No resumes created yet"
                          hint="Build from scratch, upload a PDF, or import from GitHub or LinkedIn."
                          cta={{ to: '/resume-builder/build', label: 'Build resume' }}
                        />
                      ) : (
                        <ul className="divide-y divide-border">
                          {resumes.slice(0, 5).map((resume, index) => {
                            const rid = resume.id || resume._id
                            const isMaster = Boolean(careerProfile?.masterResumeId && rid === careerProfile.masterResumeId)
                            return (
                              <li
                                key={rid || index}
                                className="group grid grid-cols-[1.75rem_minmax(0,1fr)_auto] items-center gap-3 px-5 py-3.5 transition-colors hover:bg-background"
                              >
                                <span className="font-mono text-[10px] tabular-nums text-foreground/30">
                                  {String(index + 1).padStart(2, '0')}
                                </span>
                                <div className="min-w-0">
                                  <p className="flex items-center gap-2 truncate text-[13.5px] font-medium text-foreground">
                                    <span className="truncate">{resume.title || 'Untitled resume'}</span>
                                    {isMaster && (
                                      <span className="shrink-0 rounded bg-accent px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-accent-foreground">
                                        Master
                                      </span>
                                    )}
                                    {resume.enhancedText && (
                                      <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-primary">
                                        Enhanced
                                      </span>
                                    )}
                                  </p>
                                  <p className="truncate text-[12px] text-foreground/55">
                                    {resume.jobRole || 'General'} · {formatDate(resume.createdAt)}
                                    {resume.atsScore ? ` · ATS ${resume.atsScore}` : ''}
                                  </p>
                                </div>
                                <div className="flex shrink-0 items-center gap-1">
                                  <Link
                                    to={`/resume/${rid}`}
                                    className="rounded-md px-2.5 py-1 text-[12px] font-medium text-foreground/65 transition-colors hover:bg-muted hover:text-foreground"
                                  >
                                    View
                                  </Link>
                                  <Link
                                    to={`/enhance/${rid}`}
                                    className="rounded-md border border-primary/25 px-2.5 py-1 text-[12px] font-medium text-primary transition-colors hover:bg-primary/10"
                                  >
                                    Enhance
                                  </Link>
                                </div>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </Panel>
                  </motion.div>
                )}
              </div>
            )}

            {/* ─── Presence & GitHub Telemetry ──────────────────────── */}
            {showPresenceNetwork && (
              <motion.div variants={item} className="space-y-4">
                {githubOverview.connected ? (
                  <div className="grid overflow-hidden rounded-xl border border-border bg-card sm:grid-cols-[minmax(0,1fr)_auto]">
                    <div className="flex items-center gap-3 px-5 py-4">
                      <span className="grid h-9 w-9 place-items-center rounded-md border border-border bg-background">
                        <Github className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="flex items-center gap-2 text-[14px] font-medium text-foreground">
                          GitHub signal
                          {githubOverview.loading ? (
                            <Mono className="normal-case tracking-normal">syncing...</Mono>
                          ) : (
                            <span className="h-1.5 w-1.5 rounded-full bg-accent-foreground" aria-label="Connected" />
                          )}
                        </p>
                        <p className="text-[12px] text-foreground/55">
                          Powers GitHub-to-resume, portfolio builds, and profile READMEs
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-px border-t border-border bg-border sm:border-l sm:border-t-0">
                      {[
                        { label: 'Repos', value: githubOverview.stats?.totalRepos ?? '0' },
                        { label: 'Stars', value: githubOverview.stats?.totalStars ?? '0' },
                        { label: 'Top lang', value: githubOverview.stats?.topLanguages?.[0] || 'None' },
                        {
                          label: 'Streak',
                          value: githubOverview.stats?.currentStreak != null ? `${githubOverview.stats.currentStreak}d` : 'N/A',
                        },
                      ].map((s) => (
                        <div key={s.label} className="bg-card px-4 py-3 sm:px-5">
                          <Mono>{s.label}</Mono>
                          <p className="mt-1 truncate text-[15px] font-medium tabular-nums text-foreground">{s.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-5 py-2.5 sm:col-span-2">
                      <div className="flex flex-wrap gap-3 text-xs font-medium text-foreground/65">
                        <Link to="/github" className="hover:text-primary">Open GitHub Suite</Link>
                        <Link to="/readme-generator/generate" className="hover:text-primary">README Generator</Link>
                        <Link to="/project-visualizer/analyze" className="hover:text-primary">Repo Visualizer</Link>
                      </div>
                      <Link
                        to="/hub/portfolio"
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                      >
                        Portfolio Studio <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col justify-between gap-3 rounded-xl border border-dashed border-border bg-card/50 px-5 py-4 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                      <Github className="h-4 w-4 text-foreground/50" aria-hidden="true" />
                      <p className="text-[13.5px] text-foreground/70">
                        Connect GitHub in your profile to sync repositories, stars, and top languages.
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      className="inline-flex items-center gap-1.5 self-start rounded-md border border-border bg-background px-3 py-1.5 text-[12.5px] font-medium transition hover:border-primary/40 hover:text-primary sm:self-auto"
                    >
                      Connect GitHub <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                )}

                {activeWorkspace === 'presence-network' && (
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Link to="/hub/portfolio" className="rounded-xl border border-border bg-card p-5 transition hover:border-primary/40">
                      <BookOpen className="h-4 w-4 text-primary" aria-hidden="true" />
                      <p className="mt-3 text-sm font-semibold text-foreground">Portfolios &amp; Deployments</p>
                      <p className="mt-1 text-xs text-foreground/55">{portfolioCount} active project{portfolioCount === 1 ? '' : 's'}</p>
                    </Link>
                    <Link to="/hub/community" className="rounded-xl border border-border bg-card p-5 transition hover:border-primary/40">
                      <Users className="h-4 w-4 text-primary" aria-hidden="true" />
                      <p className="mt-3 text-sm font-semibold text-foreground">Community Channels</p>
                      <p className="mt-1 text-xs text-foreground/55">Posts, live rooms, and direct messages</p>
                    </Link>
                    <Link to="/fellowship" className="rounded-xl border border-border bg-card p-5 transition hover:border-primary/40">
                      <Award className="h-4 w-4 text-primary" aria-hidden="true" />
                      <p className="mt-3 text-sm font-semibold text-foreground">Fellowship Challenges</p>
                      <p className="mt-1 text-xs text-foreground/55">Submit proposals and collaborate</p>
                    </Link>
                  </div>
                )}
              </motion.div>
            )}

            {/* ─── Categorized Product Suites Directory ─────────────── */}
            <motion.div variants={item} className="pt-2">
              <SuiteDirectory key={activeWorkspace} initialSuite={activeWorkspace} />
            </motion.div>

          </motion.div>
        )}
      </div>
    </div>
  )
}
