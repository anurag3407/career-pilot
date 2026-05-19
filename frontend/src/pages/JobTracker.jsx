import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Briefcase, MapPin, DollarSign, Calendar, Trash2, ExternalLink, Plus, Filter } from 'lucide-react'
import Layout from '../components/Layout'
import { jobTrackerApi } from '../services/api'
import Button from '../components/Button'
import Card from '../components/Card'
import EmptyJobState from '../components/EmptyJobState'
import CompanyResearch from '../components/CompanyResearch'
import { Sparkles } from 'lucide-react'

const JobTracker = () => {
  const [trackedJobs, setTrackedJobs] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [updateLoading, setUpdateLoading] = useState({})
  const [researchCompany, setResearchCompany] = useState(null)

  const statusOptions = [
    { value: 'saved', label: 'Saved', color: 'bg-muted-foreground', icon: '📌' },
    { value: 'applied', label: 'Applied', color: 'bg-blue-500', icon: '✉️' },
    { value: 'interviewing', label: 'Interviewing', color: 'bg-yellow-500', icon: '🎤' },
    { value: 'offered', label: 'Offered', color: 'bg-green-500', icon: '🎉' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-500', icon: '❌' }
  ]

  useEffect(() => {
    fetchJobs()
    fetchStats()
  }, [])

  const fetchJobs = async () => {
    try {
      setLoading(true)
      const data = await jobTrackerApi.getAll()
      setTrackedJobs(data.trackedJobs || [])
    } catch (error) {
      console.error('Error fetching jobs:', error)
      toast.error('Failed to load tracked jobs')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const data = await jobTrackerApi.getStats()
      setStats(data.stats)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleStatusUpdate = async (jobId, newStatus) => {
    try {
      setUpdateLoading(prev => ({ ...prev, [jobId]: true }))
      await jobTrackerApi.updateStatus(jobId, newStatus)

      setTrackedJobs(prev =>
        prev.map(job =>
          job.id === jobId ? { ...job, status: newStatus, updatedAt: new Date() } : job
        )
      )

      toast.success('Status updated!')
      fetchStats()
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status')
    } finally {
      setUpdateLoading(prev => ({ ...prev, [jobId]: false }))
    }
  }

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to remove this job from your tracker?')) {
      return
    }

    try {
      await jobTrackerApi.delete(jobId)
      setTrackedJobs(prev => prev.filter(job => job.id !== jobId))
      toast.success('Job removed from tracker')
      fetchStats()
    } catch (error) {
      console.error('Error deleting job:', error)
      toast.error('Failed to remove job')
    }
  }

  const filteredJobs = filterStatus === 'all'
    ? trackedJobs
    : trackedJobs.filter(job => job.status === filterStatus)

  const getStatusInfo = (status) => {
    return statusOptions.find(opt => opt.value === status) || statusOptions[0]
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Loading tracked jobs...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Job Tracker</h1>
            <p className="text-muted-foreground">Track your job applications in one place</p>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <Card className="p-6 bg-background/50 border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Total</p>
                    <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                  </div>
                  <div className="text-3xl">📊</div>
                </div>
              </Card>
              <Card className="p-6 bg-background/50 border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Saved</p>
                    <p className="text-3xl font-bold text-foreground">{stats.saved}</p>
                  </div>
                  <div className="text-3xl">📌</div>
                </div>
              </Card>
              <Card className="p-6 bg-background/50 border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Applied</p>
                    <p className="text-3xl font-bold text-foreground">{stats.applied}</p>
                  </div>
                  <div className="text-3xl">✉️</div>
                </div>
              </Card>
              <Card className="p-6 bg-background/50 border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Interviewing</p>
                    <p className="text-3xl font-bold text-foreground">{stats.interviewing}</p>
                  </div>
                  <div className="text-3xl">🎤</div>
                </div>
              </Card>
              <Card className="p-6 bg-background/50 border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Offered</p>
                    <p className="text-3xl font-bold text-foreground">{stats.offered}</p>
                  </div>
                  <div className="text-3xl">🎉</div>
                </div>
              </Card>
            </div>
          )}

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'all'
                  ? 'bg-primary text-foreground'
                  : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
            >
              All Jobs
            </button>
            {statusOptions.map(status => (
              <button
                key={status.value}
                onClick={() => setFilterStatus(status.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === status.value
                    ? 'bg-primary text-foreground'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                  }`}
              >
                {status.icon} {status.label}
              </button>
            ))}
          </div>

          {/* Jobs List */}
          {filteredJobs.length === 0 ? (
            <Card className="p-12 text-center bg-background/50 border-border">
              <div className="max-w-md mx-auto">
                <Briefcase className="w-16 h-16 text-muted-foreground/80 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {filterStatus === 'all' ? 'No Tracked Jobs Yet' : `No ${getStatusInfo(filterStatus).label} Jobs`}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {filterStatus === 'all'
                    ? 'Start tracking jobs from the job search page'
                    : `You don't have any jobs with "${getStatusInfo(filterStatus).label}" status`}
                </p>
                {filterStatus === 'all' && (
                  <Button
                    onClick={() => window.location.href = '/jobs'}
                    className="mx-auto"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Find Jobs
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredJobs.map(job => {
                const statusInfo = getStatusInfo(job.status)
                return (
                  <Card
                    key={job.id}
                    className="p-6 bg-background/50 border-border hover:border-border transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Job Info */}
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-foreground mb-1">
                              {job.title}
                            </h3>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-primary font-medium">
                                {job.company}
                              </span>
                              <button
                                onClick={() => setResearchCompany({ name: job.company, industry: job.industry || '' })}
                                className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition flex items-center gap-1"
                                title="Analyze company size, culture, funding, rating and news"
                              >
                                <Sparkles className="w-3 h-3" /> AI Research
                              </button>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium text-foreground ${statusInfo.color}`}>
                            {statusInfo.icon} {statusInfo.label}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                          {job.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </div>
                          )}
                          {job.salary && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {job.salary}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Added {formatDate(job.createdAt)}
                          </div>
                        </div>

                        {job.notes && (
                          <p className="text-sm text-foreground bg-muted/50 rounded p-3 mb-3">
                            📝 {job.notes}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 lg:w-48">
                        <select
                          value={job.status}
                          onChange={(e) => handleStatusUpdate(job.id, e.target.value)}
                          disabled={updateLoading[job.id]}
                          className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary disabled:opacity-50"
                        >
                          {statusOptions.map(status => (
                            <option key={status.value} value={status.value}>
                              {status.icon} {status.label}
                            </option>
                          ))}
                        </select>

                        <div className="flex gap-2">
                          {job.applyLink && (
                            <a
                              href={job.applyLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 px-3 py-2 bg-primary hover:bg-primary/80 text-foreground rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Apply
                            </a>
                          )}
                          <button
                            onClick={() => handleDelete(job.id)}
                            className="px-3 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-lg transition-colors"
                            title="Remove from tracker"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
      {researchCompany && (
        <CompanyResearch
          companyName={researchCompany.name}
          industry={researchCompany.industry}
          onClose={() => setResearchCompany(null)}
        />
      )}
    </Layout>
  )
}

export default JobTracker