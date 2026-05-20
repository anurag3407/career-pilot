import { useState, useEffect } from 'react'
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
  Mic
} from 'lucide-react'
import { resumeApi, jobTrackerApi } from '../services/api'
import Button from '../components/Button'
import { 
  SkeletonDashboardActions, 
  SkeletonStatCards, 
  SkeletonJobList,
  SkeletonList 
} from '../components/ui/Skeleton'

const STATUS_CONFIG = {
  saved: { label: 'Saved', color: 'bg-muted text-muted-foreground border border-border', icon: Star },
  applied: { label: 'Applied', color: 'bg-primary/10 text-primary border border-primary/20', icon: Send },
  interviewing: { label: 'Interviewing', color: 'bg-secondary/10 text-secondary border border-secondary/20', icon: MessageSquare },
  offered: { label: 'Offered', color: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20', icon: CheckCircle2 }
}

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

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [resumeRes, jobsRes] = await Promise.all([
        resumeApi.getAll().catch(() => ({ resumes: [] })),
        jobTrackerApi.getAll().catch(() => ({ trackedJobs: [] }))
      ])

      setResumes(resumeRes.resumes || resumeRes.data?.resumes || [])
      const jobs = jobsRes.trackedJobs || []
      setTrackedJobs(jobs)

      const stats = {
        total: jobs.length,
        saved: jobs.filter(j => j.status === 'saved').length,
        applied: jobs.filter(j => j.status === 'applied').length,
        interviewing: jobs.filter(j => j.status === 'interviewing').length,
        offered: jobs.filter(j => j.status === 'offered').length
      }
      setJobStats(stats)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      setFetchError('Failed to load your dashboard. Please try again.')
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
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
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-3 tracking-tight">
            Welcome back
          </h1>
          <p className="text-lg text-muted-foreground font-medium">Track your applications, enhance resumes, and land your dream job.</p>
        </motion.div>

        {loading ? (
          <div className="space-y-10">
            {/* Quick Actions Skeleton */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <SkeletonDashboardActions />
            </motion.div>

            {/* Stats Skeleton */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <SkeletonStatCards count={5} />
            </motion.div>

            {/* Recent Applications & Resumes Skeleton */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="grid lg:grid-cols-2 gap-10"
            >
              <div>
                <div className="mb-6 h-8 bg-muted rounded-lg w-1/3 animate-pulse" />
                <SkeletonList count={3} />
              </div>
              <div>
                <div className="mb-6 h-8 bg-muted rounded-lg w-1/3 animate-pulse" />
                <SkeletonList count={3} />
              </div>
            </motion.div>
          </div>
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
            
            {/* Quick Actions */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-10">
              {[
                { to: '/jobs', icon: Search, label: 'Find Jobs', sub: 'Opportunities', color: 'primary' },
                { to: '/job-alerts', icon: Bell, label: 'Alerts', sub: 'Get notified', color: 'secondary' },
                { to: '/interview-prep', icon: Mic, label: 'Interview', sub: 'AI practice', color: 'primary' },
                { to: '/upload', icon: Sparkles, label: 'AI Enhance', sub: 'Optimize', color: 'secondary' },
                { to: '/job-tracker', icon: Briefcase, label: 'Tracker', sub: `${jobStats.total} tracked`, color: 'emerald-500' },
                { to: '/community', icon: Users, label: 'Community', sub: 'Connect', color: 'primary' },
                { to: '/fellowship', icon: GraduationCap, label: 'Fellowship', sub: 'Earn & learn', color: 'primary', isNew: true },
              ].map((action, idx) => (
                <motion.div key={idx} variants={itemVariants}>
                  <Link to={action.to} className="group">
                    <div className={`relative p-5 rounded-2xl bg-card border border-border overflow-hidden transition-all duration-300 hover:border-${action.color} hover:shadow-xl hover:shadow-${action.color}/5 hover:-translate-y-1`}>
                      {action.isNew && (
                        <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-primary/20 rounded text-[9px] text-primary font-black uppercase tracking-wider">NEW</div>
                      )}
                      <div className={`w-12 h-12 bg-muted rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <action.icon className={`w-6 h-6 text-foreground group-hover:text-primary transition-colors`} />
                      </div>
                      <h3 className="text-sm font-bold text-foreground mb-1">{action.label}</h3>
                      <p className="text-muted-foreground text-xs font-medium">{action.sub}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats Row */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-5 gap-5 mb-10">
              {[
                { icon: Star, value: jobStats.saved, label: 'Saved', color: 'text-muted-foreground', bg: 'bg-muted' },
                { icon: Send, value: jobStats.applied, label: 'Applied', color: 'text-primary', bg: 'bg-primary/10' },
                { icon: MessageSquare, value: jobStats.interviewing, label: 'Interviewing', color: 'text-secondary', bg: 'bg-secondary/10' },
                { icon: CheckCircle2, value: jobStats.offered, label: 'Offers', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                { icon: FileText, value: resumes.length, label: 'Resumes', color: 'text-primary', bg: 'bg-primary/10' }
              ].map((stat, idx) => (
                <motion.div key={idx} variants={itemVariants} className="p-6 rounded-2xl bg-card border border-border text-center hover:border-primary/30 transition-all shadow-sm group">
                  <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <p className="text-3xl font-black text-foreground">{stat.value}</p>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">{stat.label}</p>
                </motion.div>
              ))}
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
                  <div className="rounded-[2rem] bg-card/50 border border-border text-center py-16 backdrop-blur-sm">
                    <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">No applications yet</h3>
                    <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto font-medium">Start searching for jobs to track your applications</p>
                    <Link to="/jobs">
                      <Button variant="primary" className="font-bold px-8">Search Jobs</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="rounded-[2rem] bg-card border border-border overflow-hidden shadow-sm">
                    <div className="divide-y divide-border">
                      {trackedJobs.slice(0, 5).map((job, index) => {
                        const statusConfig = STATUS_CONFIG[job.status] || STATUS_CONFIG.saved
                        const StatusIcon = statusConfig.icon
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
                        )
                      })}
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
                  <div className="rounded-[2rem] bg-card/50 border border-border text-center py-16 backdrop-blur-sm">
                    <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">No resumes yet</h3>
                    <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto font-medium">Upload your resume to get AI-powered enhancements</p>
                    <Link to="/upload">
                      <Button variant="primary" className="font-bold px-8">Upload Resume</Button>
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

