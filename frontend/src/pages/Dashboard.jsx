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
  Code2
} from 'lucide-react'
import { resumeApi, jobTrackerApi, portfolioApi, userProfileApi } from '../services/api'
import Button from '../components/Button'
import PortfolioGrammarAssistant from '../components/PortfolioGrammarAssistant'
import JobApplicationSuccessInsights from '../components/JobApplicationSuccessInsights'
import ResumeBulletEnhancer from '../components/ResumeBulletEnhancer'
import PortfolioTemplatePreview from '../components/PortfolioTemplatePreview'
import ResumeIndustryOptimizer from '../components/ResumeIndustryOptimizer'
import {
  SkeletonAction,
  SkeletonStat,
  SkeletonRow,
  SkeletonBlock
} from '../components/ui/Skeleton'
import { getGithubUsername } from '../utils/github'

function DashboardSkeleton() {
  return (
    <div>
      {/* Quick Actions skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-10">
        {Array.from({ length: 7 }).map((_, i) => (
          <SkeletonAction key={i} />
        ))}
      </div>

      {/* Stats Row skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mb-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonStat key={i} />
        ))}
      </div>

      {/* Two-column content skeleton */}
      <div className="grid lg:grid-cols-2 gap-10">
        {[0, 1].map((col) => (
          <div key={col}>
            <div className="flex justify-between items-center mb-6">
              <SkeletonBlock className="h-7 w-52" />
              <SkeletonBlock className="h-4 w-20" />
            </div>
            <div className="rounded-[2rem] bg-card border border-border overflow-hidden shadow-sm">
              <div className="divide-y divide-border">
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const STATUS_CONFIG = {
  saved: { label: 'Saved', color: 'bg-muted text-muted-foreground border border-border', icon: Star },
  applied: { label: 'Applied', color: 'bg-primary/10 text-primary border border-primary/20', icon: Send },
  interviewing: { label: 'Interviewing', color: 'bg-secondary/10 text-secondary border border-secondary/20', icon: MessageSquare },
  offered: { label: 'Offered', color: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20', icon: CheckCircle2 }
}
// portfolioAnalytics intentionally removed — no real API exists yet.
// Section is gated behind portfolioCount > 0 in the JSX below.

export default function Dashboard() {
  const [resumes, setResumes] = useState([])
  const [trackedJobs, setTrackedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [jobStats, setJobStats] = useState({
    total: 0,
    saved: 0,
    applied: 0,
    interviewing: 0,
    offered: 0
  })
  const [portfolioCount, setPortfolioCount] = useState(0)
  // careerInsights: no real API yet — section is gated behind resumes.length > 0
  const [candidateName, setCandidateName] = useState('')
  const [githubOverview, setGithubOverview] = useState({
    connected: false,
    loading: false,
    stats: null
  })
  const fetchRequestId = useRef(0)
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true
    fetchData()

    return () => {
      isMounted.current = false
      fetchRequestId.current += 1
    }
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
        userProfileApi.getMyProfile().catch(() => null)
      ])

      if (!canUpdate()) return

      const fetchedResumes = Array.isArray(resumeRes.data) ? resumeRes.data : (resumeRes.resumes || resumeRes.data?.resumes || [])
      setResumes(fetchedResumes)
      const jobs = jobsRes.trackedJobs || []
      setTrackedJobs(jobs)

      const portfolios =
        portfolioRes.portfolios ||
        portfolioRes.data?.portfolios ||
        portfolioRes.data ||
        [];

      setPortfolioCount(portfolios.length)
      const githubUsername = getGithubUsername(
        userProfileRes?.profile?.github ||
        userProfileRes?.data?.github ||
        userProfileRes?.github
      )
      const rawName = userProfileRes?.profile?.name || userProfileRes?.data?.name || userProfileRes?.name || ''
      setCandidateName(rawName.trim())

      if (githubUsername) {
        setGithubOverview({ connected: true, loading: true, stats: null })
        resumeApi.previewGitHub(githubUsername)
          .then((githubRes) => {
            if (!canUpdate()) return

            const preview = githubRes.preview || githubRes.data || githubRes
            setGithubOverview({
              connected: true,
              loading: false,
              stats: buildGithubStats(preview)
            })
          })
          .catch(() => {
            if (!canUpdate()) return

            setGithubOverview({ connected: true, loading: false, stats: null })
          })
      } else {
        setGithubOverview({ connected: false, loading: false, stats: null })
      }

      const stats = {
        total: jobs.length,
        saved: jobs.filter(j => j.status === 'saved').length,
        applied: jobs.filter(j => j.status === 'applied').length,
        interviewing: jobs.filter(j => j.status === 'interviewing').length,
        offered: jobs.filter(j => j.status === 'offered').length
      }
      setJobStats(stats)
    } catch (error) {
      if (!canUpdate()) return

      console.error('Failed to fetch data:', error)
      setFetchError('Failed to load your dashboard. Please try again.')
      toast.error('Failed to load dashboard data')
    } finally {
      if (canUpdate()) {
        setLoading(false)
      }
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const buildGithubStats = (profile = {}) => {
    const repositorySource = profile.topRepositories || profile.repositories || profile.repos
    const repositories = Array.isArray(repositorySource) ? repositorySource : []
    const languageSource =
      profile.topLanguages ||
      profile.languages ||
      repositories.map((repo) => repo.language).filter(Boolean)

    const topLanguages = Array.isArray(languageSource)
      ? languageSource
      : Object.entries(languageSource || {})
        .sort((a, b) => Number(b[1]) - Number(a[1]))
        .map(([language]) => language)

    const totalStars = profile.totalStars ??
      profile.stars ??
      repositories.reduce((sum, repo) => sum + Number(repo.stars || repo.stargazers_count || 0), 0)

    return {
      totalRepos: profile.totalRepos ?? profile.public_repos ?? profile.publicRepos ?? repositories.length,
      totalStars,
      topLanguages: topLanguages.slice(0, 3),
      currentStreak: profile.currentStreak ?? profile.streak?.currentStreak ?? profile.current_streak ?? null
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-10 p-8 glass rounded-3xl glow border-border/50 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-3 tracking-tight">
            Welcome back{candidateName ? <span className="gradient-text">, {candidateName}</span> : <span className="gradient-text"> Pilot</span>}
          </h1>
          <p className="text-lg text-muted-foreground font-medium max-w-2xl">Your career dashboard is ready. Track applications, enhance resumes, and land your dream job with AI insights.</p>
        </motion.div>

        {loading ? (
          <DashboardSkeleton />
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            {fetchError && (
              <div className="mb-8 rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-4 text-sm text-destructive flex items-center justify-between backdrop-blur-md">
                <span className="font-semibold">{fetchError}</span>
                <button
                  onClick={fetchData}
                  className="px-4 py-1.5 bg-destructive text-foreground rounded-lg font-bold hover:opacity-90 transition-opacity"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Modular Hubs */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-10">
              {[
                { to: '/hub/resume', icon: FileText, label: 'Resume Builder', desc: 'Create, parse, and optimize ATS resumes.', sub: `${resumes.length} resumes`, color: 'primary', badge: 'AI' },
                { to: '/hub/jobs', icon: Briefcase, label: 'Job Finder', desc: 'Search jobs, set alerts, and track applications.', sub: `${jobStats.total} tracked`, color: 'primary' },
                { to: '/hub/portfolio', icon: Globe, label: 'Portfolio Builder', desc: 'Sync repos and deploy portfolios instantly.', sub: `${portfolioCount} portfolios`, color: 'secondary' },
                { to: '/hub/career', icon: GraduationCap, label: 'Career Growth', desc: 'Email & profile tuning tools.', sub: 'Growth tools', color: 'emerald-500', badge: 'AI' },
                { to: '/interview-prep', icon: Mic, label: 'AI Mock Interview', desc: 'Practice with AI and get real-time feedback.', sub: 'Practice', color: 'primary', badge: 'AI' },
                { to: '/dashboard/analytics', icon: TrendingUp, label: 'Interview Analytics', desc: 'Visualize mock interview performance trends and scores.', sub: 'Real-time metrics', color: 'emerald-500', badge: 'AI' },
                { to: '/hub/community', icon: Users, label: 'Community Hub', desc: 'Group chat, public posts, and direct DMs.', sub: 'Connect', color: 'primary' },
              ].map((hub, idx) => (
                <motion.div key={idx} variants={itemVariants}>
                  <Link to={hub.to} className="group block h-full">
                    <div className="relative p-6 rounded-3xl bg-card border border-border overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 h-full flex flex-col justify-between">
                      {/* Hover glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      
                      {/* Badge */}
                      {hub.badge && (
                        <div className="absolute top-4 right-4 px-2 py-0.5 bg-primary/10 rounded-full text-[9px] text-primary font-black uppercase tracking-wider border border-primary/20">
                          {hub.badge}
                        </div>
                      )}

                      <div>
                        {/* Icon */}
                        <div className={`w-14 h-14 bg-${hub.color}/10 border border-${hub.color}/20 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-${hub.color}/15 transition-all duration-300`}>
                          <hub.icon className={`w-7 h-7 text-${hub.color}`} />
                        </div>
                        
                        {/* Content */}
                        <h3 className="text-lg font-black text-foreground mb-2 group-hover:text-primary transition-colors">{hub.label}</h3>
                        <p className="text-muted-foreground text-xs font-semibold leading-relaxed mb-4">{hub.desc}</p>
                      </div>

                      {/* Footer Info */}
                      <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground pt-4 border-t border-border/40 mt-auto">
                        <span className="uppercase tracking-wider">{hub.sub}</span>
                        <span className="text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex items-center gap-0.5">
                          Open <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats Row */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-6 gap-5 mb-10">
              {[
                {
                  icon: Star,
                  value: jobStats.saved,
                  label: "Saved",
                  color: "text-muted-foreground",
                  bg: "bg-muted",
                },
                {
                  icon: Send,
                  value: jobStats.applied,
                  label: "Applied",
                  color: "text-primary",
                  bg: "bg-primary/10",
                },
                {
                  icon: MessageSquare,
                  value: jobStats.interviewing,
                  label: "Interviewing",
                  color: "text-secondary",
                  bg: "bg-secondary/10",
                },
                {
                  icon: CheckCircle2,
                  value: jobStats.offered,
                  label: "Offers",
                  color: "text-emerald-500",
                  bg: "bg-emerald-500/10",
                },
                {
                  icon: FileText,
                  value: resumes.length,
                  label: "Resumes",
                  color: "text-primary",
                  bg: "bg-primary/10",
                },
                {
                  icon: Globe,
                  value: portfolioCount,
                  label: "Portfolios",
                  color: "text-purple-500",
                  bg: "bg-purple-500/10",
                  link: "/portfolio",
                },
              ].map((stat, idx) => {
                const content = (
                  <div className="p-6 rounded-2xl bg-card border border-border text-center hover:border-primary/30 transition-all shadow-sm group">
                    <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>

                    <p className="text-3xl font-black text-foreground">
                      {stat.value}
                    </p>

                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                      {stat.label}
                    </p>
                  </div>
                );

                return stat.link ? (
                  <motion.div key={idx} variants={itemVariants}>
                    <Link to={stat.link}>
                      {content}
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div key={idx} variants={itemVariants}>
                    {content}
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div variants={itemVariants} className="mb-10">
              <JobApplicationSuccessInsights />
            </motion.div>

            {/* GitHub Overview */}
            <motion.div variants={itemVariants} className="mb-10">
              {githubOverview.connected ? (
                <div className="rounded-2xl bg-card border border-border p-5 shadow-sm">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
                        <Github className="w-6 h-6 text-foreground" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-lg font-black text-foreground">GitHub Overview</h2>
                          {githubOverview.loading && (
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                              Syncing
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-muted-foreground mt-1">
                          Your repository snapshot at a glance.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:min-w-[560px]">
                      {[
                        { icon: Github, label: 'Repos', value: githubOverview.stats?.totalRepos ?? '-' },
                        { icon: Star, label: 'Stars', value: githubOverview.stats?.totalStars ?? '-' },
                        { icon: Code2, label: 'Languages', value: githubOverview.stats?.topLanguages?.join(', ') || '-' },
                        { icon: Flame, label: 'Streak', value: githubOverview.stats?.currentStreak !== null && githubOverview.stats?.currentStreak !== undefined ? `${githubOverview.stats.currentStreak}d` : '-' },
                      ].map((item) => (
                        <div key={item.label} className="rounded-xl border border-border bg-background/50 px-3 py-3 min-w-0">
                          <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <item.icon className="w-3.5 h-3.5 shrink-0" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                          </div>
                          <p className="text-sm font-black text-foreground truncate">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    <Link to="/github" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-sm font-black text-primary hover:bg-primary/15 transition-colors shrink-0">
                      View Details <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <Github className="w-5 h-5 text-primary shrink-0" />
                    <p className="text-sm font-bold text-foreground">Connect GitHub to see repository stats on your dashboard.</p>
                  </div>
                  <Link to="/profile" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-black text-primary-foreground hover:bg-primary/90 transition-colors">
                    Connect GitHub <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </motion.div>

            <motion.div variants={itemVariants} className="mb-10">
  <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
    <div className="flex items-center gap-3 mb-5">
      <GraduationCap className="w-6 h-6 text-primary" />
      <h2 className="text-xl font-black">
        Career Growth Insights
      </h2>
    </div>

    {resumes.length > 0 ? (
      <div className="p-6 rounded-xl border border-dashed border-border bg-muted/20 text-center">
        <GraduationCap className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
        <p className="text-sm font-bold text-muted-foreground mb-1">AI Career Insights Coming Soon</p>
        <p className="text-xs text-muted-foreground max-w-xs mx-auto">
          Personalized readiness score, skill gap analysis, and trending skills will appear here once our AI analyses your resume.
        </p>
      </div>
    ) : (
      <div className="p-6 rounded-xl border border-dashed border-primary/20 bg-primary/5 text-center">
        <GraduationCap className="w-10 h-10 text-primary mx-auto mb-3 opacity-60" />
        <p className="text-sm font-bold text-foreground mb-1">Upload a Resume to Unlock Insights</p>
        <p className="text-xs text-muted-foreground max-w-xs mx-auto mb-4">
          Your readiness score, skill gaps, and personalised learning path will be generated once you add a resume.
        </p>
        <Link
          to="/upload"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-black hover:bg-primary/90 transition-colors"
        >
          Upload Resume <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    )}
  </div>
</motion.div>

{portfolioCount > 0 && (
  <motion.div variants={itemVariants} className="mb-10">
    <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-black">
          Portfolio Performance Analytics
        </h2>
      </div>

      <div className="p-6 rounded-xl border border-dashed border-border bg-muted/20 text-center">
        <TrendingUp className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
        <p className="text-sm font-bold text-muted-foreground mb-1">Analytics Tracking Coming Soon</p>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Real visit counts, unique visitors, and weekly growth metrics will be tracked once portfolio analytics are enabled.
        </p>
      </div>
    </div>
  </motion.div>
)}

<motion.div variants={itemVariants} className="mb-10">
  <PortfolioGrammarAssistant />
</motion.div>

<motion.div variants={itemVariants} className="mb-10">
  <PortfolioTemplatePreview />
</motion.div>

<motion.div variants={itemVariants} className="mb-10">
  <ResumeBulletEnhancer />
</motion.div>

<motion.div variants={itemVariants} className="mb-10">
  <ResumeIndustryOptimizer />
</motion.div>



            <div className="grid lg:grid-cols-2 gap-10">
              {/* Recent Applications */}
              <motion.div variants={itemVariants}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black text-foreground flex items-center gap-3">
                    <Clock className="w-6 h-6 text-primary" />
                    Recent Applications
                  </h2>
                  <Link to="/job-tracker" className="group text-primary hover:text-primary/80 text-sm font-bold flex items-center gap-1 transition-all">
                    View all <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

                {trackedJobs.length === 0 ? (
                  <div className="rounded-[2rem] glass border border-primary/20 text-center py-16 glow relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 relative z-10 animate-bounce">
                      <Briefcase className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2 relative z-10">No applications yet</h3>
                    <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto font-medium relative z-10">Start searching for jobs to track your applications</p>
                    <Link to="/jobs" className="relative z-10">
                      <Button variant="primary" className="font-bold px-8 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all-300 hover:-translate-y-0.5">Search Jobs</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="rounded-[2rem] bg-card border border-border overflow-hidden shadow-sm">
                    <div className="divide-y divide-border">
                      {/** * GSSoC Optimization: Defensive structural evaluation on the active data view slice.
                       * Prevents layout container voids if the array slice metrics index is altered.
                       */}
                      {(() => {
                        const displayedJobs = trackedJobs.slice(0, 5);

                        if (displayedJobs.length > 0) {
                          return displayedJobs.map((job, index) => {
                            const statusConfig = STATUS_CONFIG[job.status] || STATUS_CONFIG.saved;
                            const StatusIcon = statusConfig.icon;
                            return (
                              <div key={job.id || index} className="p-5 hover:bg-muted/50 transition-all group">
                                <div className="flex justify-between items-center">
                                  <div className="flex-1">
                                    <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{job.title}</h4>
                                    <p className="text-sm text-muted-foreground font-semibold">{job.company}</p>
                                  </div>
                                  <span className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 ${statusConfig.color}`}>
                                    <StatusIcon className="w-3.5 h-3.5" />
                                    {statusConfig.label}
                                  </span>
                                </div>
                              </div>
                            );
                          });
                        } else {
                          return (
                            /* Graceful fallback UI layout state when view density evaluation yields zero records */
                            <div className="p-10 text-center text-sm font-medium text-muted-foreground bg-muted/10 rounded-2xl border border-dashed border-border/60 mx-5 my-4">
                              No active application records available in this view index.
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* My Resumes */}
              <motion.div variants={itemVariants}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black text-foreground flex items-center gap-3">
                    <FileText className="w-6 h-6 text-primary" />
                    My Resumes
                  </h2>
                  <Link to="/upload" className="group text-primary hover:text-primary/80 text-sm font-bold flex items-center gap-1 transition-all">
                    Upload new <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                  </Link>
                </div>

                {resumes.length === 0 ? (
                  <div className="rounded-[2rem] glass border border-primary/20 text-center py-16 glow relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent"></div>
                    <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 relative z-10 animate-bounce">
                      <FileText className="w-8 h-8 text-secondary" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2 relative z-10">No resumes yet</h3>
                    <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto font-medium relative z-10">Upload your resume to get AI-powered enhancements</p>
                    <Link to="/upload" className="relative z-10">
                      <Button variant="primary" className="font-bold px-8 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all-300 hover:-translate-y-0.5">Upload Resume</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="rounded-[2rem] bg-card border border-border overflow-hidden shadow-sm">
                    <div className="divide-y divide-border">
                      {resumes.slice(0, 5).map(resume => (
                        <div key={resume.id} className="p-5 hover:bg-muted/50 transition-all group">
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{resume.title}</h4>
                                {resume.enhancedText && (
                                  <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded text-[10px] font-black uppercase tracking-widest animate-pulse">Enhanced</span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground font-semibold">{resume.jobRole || 'General'} • {formatDate(resume.createdAt)}</p>
                            </div>
                            <div className="flex gap-2">
                              <Link to={`/resume/${resume.id}`}>
                                <Button variant="ghost" className="!py-2 !px-4 text-xs font-bold">View</Button>
                              </Link>
                              <Link to={`/enhance/${resume.id}`}>
                                <Button variant="primary" className="!py-2 !px-4 text-xs font-bold">Enhance</Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Tips Section */}
            <motion.div variants={itemVariants} className="mt-16">
              <h2 className="text-2xl font-black text-foreground mb-8 flex items-center gap-3">
                <Zap className="w-6 h-6 text-amber-500 animate-pulse" />
                Pro Tips for Success
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: Zap, color: 'amber-500', title: 'Optimize Your Resume', text: 'Use our AI to tailor your resume for each job application' },
                  { icon: Target, color: 'emerald-500', title: 'Track Everything', text: 'Keep notes and update statuses to stay organized in your job hunt' },
                  { icon: TrendingUp, color: 'primary', title: 'Follow Up', text: "Don't forget to follow up on applications after a week" }
                ].map((tip, idx) => (
                  <div key={idx} className="p-8 rounded-[2rem] bg-card border border-border hover:border-primary/30 hover:shadow-xl transition-all group">
                    <div className={`w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <tip.icon className={`w-7 h-7 text-foreground group-hover:text-${tip.color} transition-colors`} />
                    </div>
                    <h3 className="text-xl font-black text-foreground mb-2">{tip.title}</h3>
                    <p className="text-muted-foreground font-medium leading-relaxed">{tip.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

