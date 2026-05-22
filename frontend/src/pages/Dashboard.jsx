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

const STATUS_CONFIG = {
  saved: {
    label: 'Saved',
    color: 'bg-muted text-muted-foreground border border-border',
    icon: Star
  },
  applied: {
    label: 'Applied',
    color: 'bg-primary/10 text-primary border border-primary/20',
    icon: Send
  },
  interviewing: {
    label: 'Interviewing',
    color: 'bg-secondary/10 text-secondary border border-secondary/20',
    icon: MessageSquare
  },
  offered: {
    label: 'Offered',
    color: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
    icon: CheckCircle2
  }
}

export default function Dashboard() {
  const [resumes, setResumes] = useState([])
  const [trackedJobs, setTrackedJobs] = useState([])
  const [upcomingInterviews, setUpcomingInterviews] = useState([])

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

      setResumes(
        resumeRes.resumes ||
        resumeRes.data?.resumes ||
        []
      )

      const jobs = jobsRes.trackedJobs || []

      setTrackedJobs(jobs)

      // UPCOMING INTERVIEWS
      const interviewJobs = jobs
        .filter(
          j =>
            j.status === 'interviewing' &&
            j.interviewDate
        )
        .sort(
          (a, b) =>
            new Date(a.interviewDate) -
            new Date(b.interviewDate)
        )
        .slice(0, 3)

      setUpcomingInterviews(interviewJobs)

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

      setFetchError(
        'Failed to load your dashboard. Please try again.'
      )

      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(
      'en-US',
      {
        month: 'short',
        day: 'numeric'
      }
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* HEADING */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-3 tracking-tight">
            Welcome back
          </h1>

          <p className="text-lg text-muted-foreground font-medium">
            Track your applications, enhance resumes,
            and land your dream job.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-muted border-t-primary rounded-full animate-spin" />
            </div>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >

            {/* ERROR */}
            {fetchError && (
              <div className="mb-8 rounded-2xl border border-destructive/20 bg-destructive/5 px-6 py-4 text-sm text-destructive flex items-center justify-between backdrop-blur-md">
                <span className="font-semibold">
                  {fetchError}
                </span>

                <button
                  onClick={fetchData}
                  className="px-4 py-1.5 bg-destructive text-foreground rounded-lg font-bold hover:opacity-90 transition-opacity"
                >
                  Retry
                </button>
              </div>
            )}

            {/* QUICK ACTIONS */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-10"
            >
              {[
                {
                  to: '/jobs',
                  icon: Search,
                  label: 'Find Jobs',
                  sub: 'Opportunities'
                },
                {
                  to: '/job-alerts',
                  icon: Bell,
                  label: 'Alerts',
                  sub: 'Get notified'
                },
                {
                  to: '/interview-prep',
                  icon: Mic,
                  label: 'Interview',
                  sub: 'AI practice'
                },
                {
                  to: '/upload',
                  icon: Sparkles,
                  label: 'AI Enhance',
                  sub: 'Optimize'
                },
                {
                  to: '/job-tracker',
                  icon: Briefcase,
                  label: 'Tracker',
                  sub: `${jobStats.total} tracked`
                },
                {
                  to: '/community',
                  icon: Users,
                  label: 'Community',
                  sub: 'Connect'
                },
                {
                  to: '/fellowship',
                  icon: GraduationCap,
                  label: 'Fellowship',
                  sub: 'Earn & learn'
                }
              ].map((action, idx) => (
                <Link
                  key={idx}
                  to={action.to}
                  className="group"
                >
                  <div className="relative p-5 rounded-2xl bg-card border border-border overflow-hidden transition-all duration-300 hover:border-primary hover:shadow-xl hover:-translate-y-1">

                    <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <action.icon className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
                    </div>

                    <h3 className="text-sm font-bold text-foreground mb-1">
                      {action.label}
                    </h3>

                    <p className="text-muted-foreground text-xs font-medium">
                      {action.sub}
                    </p>
                  </div>
                </Link>
              ))}
            </motion.div>

            {/* STATS */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-5 gap-5 mb-10"
            >
              {[
                {
                  icon: Star,
                  value: jobStats.saved,
                  label: 'Saved'
                },
                {
                  icon: Send,
                  value: jobStats.applied,
                  label: 'Applied'
                },
                {
                  icon: MessageSquare,
                  value: jobStats.interviewing,
                  label: 'Interviewing'
                },
                {
                  icon: CheckCircle2,
                  value: jobStats.offered,
                  label: 'Offers'
                },
                {
                  icon: FileText,
                  value: resumes.length,
                  label: 'Resumes'
                }
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-card border border-border text-center"
                >
                  <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>

                  <p className="text-3xl font-black text-foreground">
                    {stat.value}
                  </p>

                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* UPCOMING INTERVIEWS */}
            {upcomingInterviews.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="mb-10"
              >
                <div className="bg-card border border-border rounded-[2rem] p-6 shadow-sm">

                  <h3 className="font-black text-foreground mb-5 flex items-center gap-3 text-xl">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>

                    Upcoming Interviews
                  </h3>

                  <div className="space-y-4">
                    {upcomingInterviews.map(job => (
                      <div
                        key={job.id}
                        className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border"
                      >
                        <div>
                          <p className="font-bold text-foreground">
                            {job.title}
                          </p>

                          <p className="text-sm text-muted-foreground font-medium">
                            {job.company}
                          </p>
                        </div>

                        <span className="text-xs md:text-sm text-primary font-bold text-right">
                          {new Date(
                            job.interviewDate
                          ).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            }
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

          </motion.div>
        )}
      </div>
    </div>
  )
}