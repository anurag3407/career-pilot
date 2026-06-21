import { useState, useEffect } from 'react'
import { Briefcase, Search, Bell, Star, Send, MessageSquare, CheckCircle2, Building2, Eye, ExternalLink } from 'lucide-react'
import { jobTrackerApi } from '../../services/api'
import HubLayout from '../../components/HubLayout'
import ToolCard from '../../components/ToolCard'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import logger from '../../utils/logger';
const STATUS_CONFIG = {
  saved: { label: 'Saved', color: 'bg-muted text-muted-foreground border border-border', icon: Star },
  applied: { label: 'Applied', color: 'bg-primary/10 text-primary border border-primary/20', icon: Send },
  interviewing: { label: 'Interviewing', color: 'bg-secondary/10 text-secondary border border-secondary/20', icon: MessageSquare },
  offered: { label: 'Offered', color: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20', icon: CheckCircle2 }
}

export default function JobsHub() {
  const [trackedJobs, setTrackedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [jobStats, setJobStats] = useState({
    total: 0,
    saved: 0,
    applied: 0,
    interviewing: 0,
    offered: 0
  })

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await jobTrackerApi.getAll()
        const jobs = res.trackedJobs || []
        setTrackedJobs(jobs)
        
        const stats = {
          total: jobs.length,
          saved: jobs.filter(j => j.status === 'saved').length,
          applied: jobs.filter(j => j.status === 'applied').length,
          interviewing: jobs.filter(j => j.status === 'interviewing').length,
          offered: jobs.filter(j => j.status === 'offered').length
        }
        setJobStats(stats)
      } catch (err) {
        logger.error('Failed to fetch jobs in JobsHub', err);
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  const stats = [
    { icon: Briefcase, value: jobStats.total, label: 'Total Tracked', color: 'text-primary', bg: 'bg-primary/10' },
    { icon: Send, value: jobStats.applied, label: 'Applied', color: 'text-secondary', bg: 'bg-secondary/10' },
    { icon: MessageSquare, value: jobStats.interviewing, label: 'Interviews', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { icon: CheckCircle2, value: jobStats.offered, label: 'Offers', color: 'text-emerald-500', bg: 'bg-emerald-500/10' }
  ]

  return (
    <HubLayout
      icon={Briefcase}
      title="Job Finder"
      description="Discover new opportunities, manage your job pipeline, track applications, and optimize alerts."
      color="primary"
      breadcrumb="Job Finder"
      stats={loading ? [] : stats}
    >
      <ToolCard
        to="/jobs"
        icon={Search}
        title="Search Jobs"
        description="Find and filter job opportunities aligned with your skills and preferences."
        color="primary"
      />
      <ToolCard
        to="/job-alerts"
        icon={Bell}
        title="Job Alerts"
        description="Configure customized alerts to get notified the instant matching jobs are posted."
        color="secondary"
      />
      <ToolCard
        to="/job-tracker"
        icon={Briefcase}
        title="Application Tracker"
        description="Monitor status, tasks, contacts, and notes for all your active job applications."
        color="emerald-500"
      />
      <ToolCard
        to="/jobs"
        icon={Building2}
        title="Company Research"
        description="Explore detailed insights about hiring organizations and specific roles."
        color="primary"
      />

      {/* Recent Applications Section */}
      {!loading && trackedJobs.length > 0 && (
        <div className="col-span-full mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <span className="w-1.5 h-6 rounded-full bg-secondary" />
              Recent Applications
            </h2>
            <Link to="/job-tracker" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
              View Application Tracker <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trackedJobs.slice(0, 3).map((job, idx) => {
              const statusConfig = STATUS_CONFIG[job.status] || STATUS_CONFIG.saved
              const StatusIcon = statusConfig.icon

              return (
                <motion.div
                  key={job._id || job.id || idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all group relative overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-primary" />
                    </div>
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black flex items-center gap-1.5 uppercase ${statusConfig.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig.label}
                    </span>
                  </div>
                  <h3 className="font-bold text-foreground mb-1 truncate">
                    {job.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4 font-semibold">
                    {job.company}
                  </p>
                  <div className="flex items-center gap-2">
                    <Link
                      to="/job-tracker"
                      className="flex-1 text-center text-xs font-semibold px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 inline mr-1" />
                      Manage
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}
    </HubLayout>
  )
}
