import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Briefcase,
  Search,
  Bell,
  Star,
  Send,
  MessageSquare,
  CheckCircle2,
  Building2,
  Layers,
  Mail,
  LineChart,
  ArrowRight,
} from 'lucide-react'
import { jobTrackerApi } from '../../services/api'
import HubLayout from '../../components/HubLayout'
import ToolCard from '../../components/ToolCard'

const STATUS_CONFIG = {
  saved: { label: 'Saved', color: 'bg-muted text-muted-foreground border border-border', icon: Star },
  applied: { label: 'Applied', color: 'bg-primary/10 text-primary border border-primary/20', icon: Send },
  interviewing: { label: 'Interviewing', color: 'bg-secondary/10 text-secondary border border-secondary/20', icon: MessageSquare },
  offered: { label: 'Offered', color: 'bg-accent text-accent-foreground border border-accent-foreground/25', icon: CheckCircle2 },
}

export default function JobsHub() {
  const navigate = useNavigate()
  const [trackedJobs, setTrackedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [quickQuery, setQuickQuery] = useState('')
  const [jobStats, setJobStats] = useState({
    total: 0,
    saved: 0,
    applied: 0,
    interviewing: 0,
    offered: 0,
  })

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await jobTrackerApi.getAll()
        const jobs = res.trackedJobs || []
        setTrackedJobs(jobs)

        setJobStats({
          total: jobs.length,
          saved: jobs.filter((j) => j.status === 'saved').length,
          applied: jobs.filter((j) => j.status === 'applied').length,
          interviewing: jobs.filter((j) => j.status === 'interviewing').length,
          offered: jobs.filter((j) => j.status === 'offered').length,
        })
      } catch (err) {
        console.error('Failed to fetch jobs in JobsHub', err)
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  const handleQuickSearch = (e) => {
    e.preventDefault()
    const q = quickQuery.trim()
    navigate(q ? `/job-finder/search?q=${encodeURIComponent(q)}` : '/job-finder/search')
  }

  const stats = [
    { icon: Briefcase, value: jobStats.total, label: 'Tracked', color: 'text-primary', bg: 'bg-primary/10' },
    { icon: Send, value: jobStats.applied, label: 'Applied', color: 'text-foreground', bg: 'bg-muted' },
    { icon: MessageSquare, value: jobStats.interviewing, label: 'Interviews', color: 'text-primary', bg: 'bg-primary/10' },
    { icon: CheckCircle2, value: jobStats.offered, label: 'Offers', color: 'text-accent-foreground', bg: 'bg-accent' },
  ]

  return (
    <HubLayout
      icon={Briefcase}
      title="Job Pipeline"
      description="Search matching roles, assemble tailored application packets, manage follow-ups, and benchmark offers."
      color="primary"
      suite="02 Job Pipeline"
      breadcrumb="Job Pipeline"
      stats={loading ? [] : stats}
      actions={
        <Link
          to="/job-tracker"
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3.5 text-xs font-semibold text-primary-foreground transition hover:brightness-110"
        >
          Open Kanban board <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      }
    >
      {/* Inline Quick Role Search */}
      <form
        onSubmit={handleQuickSearch}
        className="col-span-full flex flex-col gap-2 rounded-xl border border-border bg-card p-3 sm:flex-row sm:items-center"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            value={quickQuery}
            onChange={(e) => setQuickQuery(e.target.value)}
            placeholder="Search job titles, skills, or companies (e.g. Senior React Engineer)..."
            aria-label="Search open roles"
            className="h-10 w-full rounded-lg bg-background pl-9 pr-3 text-sm text-foreground outline-none border border-border focus:border-primary"
          />
        </div>
        <button
          type="submit"
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-xs font-semibold text-primary-foreground transition hover:brightness-110"
        >
          Search roles <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </form>

      <ToolCard
        to="/job-finder/search"
        icon={Search}
        title="Job Search & Match"
        description="Filter openings by work type and seniority, score against your resume, and save directly to the tracker."
        color="primary"
      />
      <ToolCard
        to="/job-tracker"
        icon={Briefcase}
        title="Application Tracker"
        description="Manage pipeline stages, build tailored packets, and schedule day-7 follow-ups."
        color="emerald"
      />
      <ToolCard
        to="/job-alerts"
        icon={Bell}
        title="Job Alerts"
        description="Configure automated role watches and receive alerts when new matching postings appear."
        color="secondary"
      />
      <ToolCard
        to="/job-tracker"
        icon={Building2}
        title="Company Research"
        description="Generate role-aware company briefs grounded in the job descriptions on your tracked cards."
        color="primary"
      />
      <ToolCard
        to="/email-generator"
        icon={Mail}
        title="Message Composer"
        description="Draft first notes, follow-ups, interview thank-yous, and counter-offer emails."
        color="emerald"
      />
      <ToolCard
        to="/offer-desk"
        icon={LineChart}
        title="Offer Desk & Salary"
        description="Compare salary bands by location and level, and prepare counter-offer language."
        color="primary"
      />

      {/* Recent Applications */}
      {!loading && trackedJobs.length > 0 && (
        <div className="col-span-full mt-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Recent applications</h2>
            <Link to="/job-tracker" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
              View all tracked jobs <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trackedJobs.slice(0, 3).map((job, idx) => {
              const statusConfig = STATUS_CONFIG[job.status] || STATUS_CONFIG.saved
              const StatusIcon = statusConfig.icon
              const jid = job.id || job._id

              return (
                <div
                  key={jid || idx}
                  className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/35"
                >
                  <div>
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Briefcase className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${statusConfig.color}`}>
                        <StatusIcon className="h-3 w-3" aria-hidden="true" />
                        {statusConfig.label}
                      </span>
                    </div>
                    <h3 className="truncate text-[15px] font-semibold text-foreground">
                      {job.title}
                    </h3>
                    <p className="mt-0.5 truncate text-xs font-medium text-muted-foreground">
                      {job.company}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
                    <Link
                      to={jid ? `/job-tracker?job=${jid}&packet=1` : '/job-tracker'}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                    >
                      <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                      Open packet
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </HubLayout>
  )
}
