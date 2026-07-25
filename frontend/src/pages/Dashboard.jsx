import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import {
  FileText,
  Briefcase,
  Search,
  Plus,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Send,
  Star,
  MessageSquare,
  Zap,
  Target,
  TrendingUp,
  Clock,
  Users,
  Sparkles,
  GraduationCap,
  Bell,
  Mic,
  Globe,
  Github,
  Flame,
  Code2,
  Palette,
  Network,
  BookMarked,
  Linkedin,
  BarChart3,
  PenLine,
  Rocket,
  Shield,
  CalendarDays,
  ChevronRight,
  LayoutGrid,
  Video,
  GitBranch,
  Award,
  Heart,
} from 'lucide-react'
import { resumeApi, jobTrackerApi, portfolioApi, userProfileApi } from '../services/api'
import {
  SkeletonAction,
  SkeletonStat,
  SkeletonRow,
  SkeletonBlock
} from '../components/ui/Skeleton'
import { getGithubUsername } from '../utils/github'

/* ─── Feature Categories ─────────────────────────────────────────────── */
const FEATURE_CATEGORIES = [
  {
    id: 'resume',
    label: 'Resume & Documents',
    icon: FileText,
    features: [
      { name: 'Resume Builder', desc: 'AI-powered ATS-optimized resumes', to: '/hub/resume', icon: FileText, accent: 'text-blue-500 bg-blue-500/10' },
      { name: 'Resume Roast', desc: 'Brutally honest AI feedback', to: '/resume-roast/analyze', icon: Flame, accent: 'text-orange-500 bg-orange-500/10' },
      { name: 'Cover Letter', desc: 'Tailored cover letters in seconds', to: '/cover-letter', icon: PenLine, accent: 'text-violet-500 bg-violet-500/10' },
      { name: 'Text to Resume', desc: 'Paste text, get a formatted resume', to: '/text-to-resume', icon: Sparkles, accent: 'text-cyan-500 bg-cyan-500/10' },
    ],
  },
  {
    id: 'jobs',
    label: 'Job Search & Tracking',
    icon: Briefcase,
    features: [
      { name: 'Job Finder', desc: 'AI-matched job search', to: '/job-finder/search', icon: Search, accent: 'text-emerald-500 bg-emerald-500/10' },
      { name: 'Job Tracker', desc: 'Kanban board for applications', to: '/job-tracker', icon: Target, accent: 'text-teal-500 bg-teal-500/10' },
      { name: 'Job Alerts', desc: 'Smart notifications for new roles', to: '/job-alerts', icon: Bell, accent: 'text-amber-500 bg-amber-500/10' },
      { name: 'Analytics', desc: 'Application success insights', to: '/dashboard/analytics', icon: BarChart3, accent: 'text-indigo-500 bg-indigo-500/10' },
    ],
  },
  {
    id: 'portfolio',
    label: 'Portfolio & Online Presence',
    icon: Globe,
    features: [
      { name: 'Portfolio Builder', desc: 'Deploy a stunning portfolio', to: '/hub/portfolio', icon: Palette, accent: 'text-purple-500 bg-purple-500/10' },
      { name: 'GitHub Portfolio', desc: 'Turn repos into a portfolio', to: '/github-portfolio/build', icon: Github, accent: 'text-gray-500 bg-gray-500/10' },
      { name: 'README Generator', desc: 'AI GitHub profile README', to: '/readme-generator', icon: BookMarked, accent: 'text-pink-500 bg-pink-500/10' },
      { name: 'LinkedIn Optimizer', desc: 'Boost your LinkedIn profile', to: '/linkedin-optimizer', icon: Linkedin, accent: 'text-sky-500 bg-sky-500/10' },
    ],
  },
  {
    id: 'interview',
    label: 'Interview Preparation',
    icon: Mic,
    features: [
      { name: 'Mock Interview', desc: 'AI voice interview practice', to: '/mock-interview/practice', icon: Mic, accent: 'text-red-500 bg-red-500/10' },
      { name: 'Interview History', desc: 'Review past sessions', to: '/interview-history', icon: Video, accent: 'text-rose-500 bg-rose-500/10' },
      { name: 'Skill Gap Analyzer', desc: 'Find missing skills for roles', to: '/skill-gap', icon: TrendingUp, accent: 'text-lime-500 bg-lime-500/10' },
    ],
  },
  {
    id: 'devtools',
    label: 'Developer Tools',
    icon: Code2,
    features: [
      { name: 'Project Visualizer', desc: 'AI architecture maps for repos', to: '/project-visualizer', icon: Network, accent: 'text-fuchsia-500 bg-fuchsia-500/10' },
      { name: 'GitHub Dashboard', desc: 'Repo analytics & insights', to: '/github', icon: GitBranch, accent: 'text-slate-500 bg-slate-500/10' },
      { name: 'LinkedIn Dashboard', desc: 'Profile performance metrics', to: '/linkedin', icon: Linkedin, accent: 'text-blue-600 bg-blue-600/10' },
    ],
  },
  {
    id: 'growth',
    label: 'Career Growth & Community',
    icon: GraduationCap,
    features: [
      { name: 'Career Growth', desc: 'Readiness score & learning paths', to: '/hub/career', icon: GraduationCap, accent: 'text-emerald-600 bg-emerald-600/10' },
      { name: 'Community', desc: 'Network with job seekers', to: '/hub/community', icon: Users, accent: 'text-cyan-600 bg-cyan-600/10' },
      { name: 'Fellowship', desc: 'Collaborative challenges', to: '/fellowship', icon: Award, accent: 'text-yellow-600 bg-yellow-600/10' },
    ],
  },
]

/* ─── Quick Actions ──────────────────────────────────────────────────── */
const QUICK_ACTIONS = [
  { label: 'Build Resume', to: '/resume-builder/build', icon: FileText },
  { label: 'Search Jobs', to: '/job-finder/search', icon: Search },
  { label: 'Mock Interview', to: '/mock-interview/practice', icon: Mic },
  { label: 'Build Portfolio', to: '/hub/portfolio', icon: Palette },
  { label: 'Roast Resume', to: '/resume-roast/analyze', icon: Flame },
  { label: 'Generate README', to: '/readme-generator', icon: BookMarked },
]

/* ─── Status Config ──────────────────────────────────────────────────── */
const STATUS_CONFIG = {
  saved: { label: 'Saved', color: 'bg-muted text-muted-foreground', icon: Star },
  applied: { label: 'Applied', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', icon: Send },
  interviewing: { label: 'Interviewing', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', icon: MessageSquare },
  offered: { label: 'Offered', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', icon: CheckCircle2 },
}

/* ─── Skeleton ───────────────────────────────────────────────────────── */
function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonStat key={i} />)}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonAction key={i} />)}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        {[0, 1].map((col) => (
          <div key={col} className="space-y-3">
            <SkeletonBlock className="h-6 w-40" />
            <div className="rounded-2xl bg-card border border-border p-4 space-y-3">
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
  const [resumes, setResumes] = useState([])
  const [trackedJobs, setTrackedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [jobStats, setJobStats] = useState({ total: 0, saved: 0, applied: 0, interviewing: 0, offered: 0 })
  const [portfolioCount, setPortfolioCount] = useState(0)
  const [candidateName, setCandidateName] = useState('')
  const [githubOverview, setGithubOverview] = useState({ connected: false, loading: false, stats: null })
  const [activeCategory, setActiveCategory] = useState('resume')
  const fetchRequestId = useRef(0)
  const isMounted = useRef(false)

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
      const [resumeRes, jobsRes, portfolioRes, userProfileRes] = await Promise.all([
        resumeApi.getAll().catch(() => ({ resumes: [] })),
        jobTrackerApi.getAll().catch(() => ({ trackedJobs: [] })),
        portfolioApi.getAll().catch(() => ({ portfolioItems: [] })),
        userProfileApi.getMyProfile().catch(() => null),
      ])
      if (!canUpdate()) return

      const fetchedResumes = Array.isArray(resumeRes.data) ? resumeRes.data : (resumeRes.resumes || resumeRes.data?.resumes || [])
      setResumes(fetchedResumes)
      const jobs = jobsRes.trackedJobs || []
      setTrackedJobs(jobs)

      const portfolios = portfolioRes.portfolios || portfolioRes.data?.portfolios || portfolioRes.data || []
      setPortfolioCount(Array.isArray(portfolios) ? portfolios.length : 0)

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

  const container = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.04 } } }
  const item = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } }

  const activeFeatures = FEATURE_CATEGORIES.find(c => c.id === activeCategory)?.features || []

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ─── Header ─────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                <CalendarDays className="w-3.5 h-3.5" /> {today}
              </p>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                {candidateName ? `Welcome back, ${candidateName}` : 'Welcome back'}
              </h1>
            </div>
            <Link
              to="/settings"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Shield className="w-4 h-4" /> Settings
            </Link>
          </div>
        </motion.div>

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <motion.div variants={container} initial="hidden" animate="visible" className="space-y-8">

            {/* ─── Error Banner ─────────────────────────────────────── */}
            {fetchError && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-5 py-3 text-sm text-destructive flex items-center justify-between">
                <span className="font-medium">{fetchError}</span>
                <button onClick={fetchData} className="px-3 py-1 bg-destructive text-destructive-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity">
                  Retry
                </button>
              </div>
            )}

            {/* ─── Stats Strip ──────────────────────────────────────── */}
            <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { icon: Briefcase, value: jobStats.total, label: 'Jobs Tracked', to: '/job-tracker' },
                { icon: Send, value: jobStats.applied, label: 'Applied', to: '/job-tracker' },
                { icon: MessageSquare, value: jobStats.interviewing, label: 'Interviews', to: '/job-tracker' },
                { icon: CheckCircle2, value: jobStats.offered, label: 'Offers', to: '/job-tracker' },
                { icon: FileText, value: resumes.length, label: 'Resumes', to: '/hub/resume' },
                { icon: Globe, value: portfolioCount, label: 'Portfolios', to: '/hub/portfolio' },
              ].map((stat, idx) => (
                <Link key={idx} to={stat.to} className="group p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <stat.icon className="w-4.5 h-4.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-foreground leading-none">{stat.value}</p>
                      <p className="text-[11px] font-medium text-muted-foreground mt-0.5">{stat.label}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </motion.div>

            {/* ─── Quick Actions ────────────────────────────────────── */}
            <motion.div variants={item}>
              <div className="flex flex-wrap gap-2">
                {QUICK_ACTIONS.map((action) => (
                  <Link
                    key={action.label}
                    to={action.to}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border text-sm font-medium text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all"
                  >
                    <action.icon className="w-4 h-4 text-primary" />
                    {action.label}
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* ─── Feature Explorer ─────────────────────────────────── */}
            <motion.div variants={item} className="rounded-2xl bg-card border border-border overflow-hidden">
              {/* Category Tabs */}
              <div className="flex overflow-x-auto border-b border-border px-4 pt-3 gap-1 scrollbar-hide">
                {FEATURE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg whitespace-nowrap transition-colors border-b-2 -mb-px ${
                      activeCategory === cat.id
                        ? 'border-primary text-primary bg-primary/5'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <cat.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{cat.label}</span>
                    <span className="sm:hidden">{cat.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              {/* Feature Cards */}
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {activeFeatures.map((feature) => (
                  <Link
                    key={feature.name}
                    to={feature.to}
                    className="group flex items-start gap-3 p-4 rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all bg-background/50"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${feature.accent}`}>
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                        {feature.name}
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{feature.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* ─── Two Column: Recent Activity ──────────────────────── */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Applications */}
              <motion.div variants={item}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    Recent Applications
                  </h2>
                  <Link to="/job-tracker" className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                    View all <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>

                {trackedJobs.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border p-8 text-center">
                    <Briefcase className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-sm font-medium text-muted-foreground mb-1">No applications yet</p>
                    <p className="text-xs text-muted-foreground/70 mb-4">Start searching to track your progress</p>
                    <Link to="/job-finder/search" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors">
                      <Search className="w-3.5 h-3.5" /> Search Jobs
                    </Link>
                  </div>
                ) : (
                  <div className="rounded-xl bg-card border border-border divide-y divide-border overflow-hidden">
                    {trackedJobs.slice(0, 5).map((job, index) => {
                      const cfg = STATUS_CONFIG[job.status] || STATUS_CONFIG.saved
                      const StatusIcon = cfg.icon
                      return (
                        <div key={job.id || index} className="px-4 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{job.title}</p>
                            <p className="text-xs text-muted-foreground">{job.company}</p>
                          </div>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold shrink-0 ${cfg.color}`}>
                            <StatusIcon className="w-3 h-3" /> {cfg.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </motion.div>

              {/* My Resumes */}
              <motion.div variants={item}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    My Resumes
                  </h2>
                  <Link to="/upload" className="text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                    Upload new <Plus className="w-3 h-3" />
                  </Link>
                </div>

                {resumes.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border p-8 text-center">
                    <FileText className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-sm font-medium text-muted-foreground mb-1">No resumes yet</p>
                    <p className="text-xs text-muted-foreground/70 mb-4">Upload or build one to get started</p>
                    <Link to="/resume-builder/build" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors">
                      <FileText className="w-3.5 h-3.5" /> Build Resume
                    </Link>
                  </div>
                ) : (
                  <div className="rounded-xl bg-card border border-border divide-y divide-border overflow-hidden">
                    {resumes.slice(0, 5).map((resume) => (
                      <div key={resume.id} className="px-4 py-3 flex items-center justify-between hover:bg-muted/30 transition-colors group">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{resume.title}</p>
                          <p className="text-xs text-muted-foreground">{resume.jobRole || 'General'} · {formatDate(resume.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {resume.enhancedText && (
                            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-bold">AI</span>
                          )}
                          <Link to={`/resume/${resume.id}`} className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                            View
                          </Link>
                          <Link to={`/enhance/${resume.id}`} className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-primary bg-primary/10 hover:bg-primary/15 transition-colors">
                            Enhance
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* ─── GitHub Overview ──────────────────────────────────── */}
            <motion.div variants={item}>
              {githubOverview.connected ? (
                <div className="rounded-xl bg-card border border-border p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                        <Github className="w-5 h-5 text-foreground" />
                      </div>
                      <div>
                        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                          GitHub
                          {githubOverview.loading && <span className="text-[10px] text-muted-foreground font-normal animate-pulse">syncing…</span>}
                        </h2>
                        <p className="text-xs text-muted-foreground">Repository overview</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {[
                        { label: 'Repos', value: githubOverview.stats?.totalRepos ?? '—' },
                        { label: 'Stars', value: githubOverview.stats?.totalStars ?? '—' },
                        { label: 'Languages', value: githubOverview.stats?.topLanguages?.join(', ') || '—' },
                        { label: 'Streak', value: githubOverview.stats?.currentStreak != null ? `${githubOverview.stats.currentStreak}d` : '—' },
                      ].map((s) => (
                        <div key={s.label} className="text-center">
                          <p className="text-sm font-bold text-foreground">{s.value}</p>
                          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{s.label}</p>
                        </div>
                      ))}
                    </div>

                    <Link to="/github" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-xs font-semibold text-foreground hover:bg-muted/80 transition-colors shrink-0">
                      Details <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Github className="w-5 h-5 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Connect GitHub to see repository stats</p>
                  </div>
                  <Link to="/profile" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors">
                    Connect <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </motion.div>

            {/* ─── Career Progress ──────────────────────────────────── */}
            <motion.div variants={item} className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: Zap, title: 'Optimize', desc: 'Use AI to tailor your resume for each application', to: '/hub/resume', color: 'text-amber-500' },
                { icon: Target, title: 'Track', desc: 'Keep notes and update statuses to stay organized', to: '/job-tracker', color: 'text-emerald-500' },
                { icon: TrendingUp, title: 'Follow Up', desc: 'Follow up on applications after one week', to: '/job-alerts', color: 'text-blue-500' },
              ].map((tip, idx) => (
                <Link key={idx} to={tip.to} className="group p-5 rounded-xl bg-card border border-border hover:border-primary/20 hover:shadow-sm transition-all">
                  <tip.icon className={`w-5 h-5 ${tip.color} mb-3`} />
                  <h3 className="text-sm font-semibold text-foreground mb-1">{tip.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tip.desc}</p>
                </Link>
              ))}
            </motion.div>

          </motion.div>
        )}
      </div>
    </div>
  )
}
