import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Building2,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Filter,
  X,
  Loader2,
  TrendingUp,
  Zap,
  Target,
  Sparkles
} from 'lucide-react'
import { jobsApi, jobTrackerApi } from '../services/api'
import Button from '../components/Button'

const JOB_TYPES = ['All Types', 'Full-time', 'Part-time', 'Contract', 'Internship', 'Remote']
const EXPERIENCE_LEVELS = ['All Levels', 'Entry Level', 'Mid Level', 'Senior Level', 'Lead/Manager']
const POPULAR_SEARCHES = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Scientist',
  'Product Manager',
  'UX Designer',
  'DevOps Engineer'
]

export default function JobSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [savedJobs, setSavedJobs] = useState(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    jobType: 'All Types',
    experienceLevel: 'All Levels',
    location: ''
  })

  // Load saved jobs on mount
  useEffect(() => {
    loadSavedJobs()
  }, [])

  const loadSavedJobs = async () => {
    try {
      const response = await jobTrackerApi.getAll()
      const savedIds = new Set((response.trackedJobs || []).map(j => j.jobId))
      setSavedJobs(savedIds)
    } catch (error) {
      console.error('Failed to load saved jobs:', error)
    }
  }

  const handleSearch = async (e) => {
    e?.preventDefault()
    if (!searchQuery.trim()) {
      return
    }

    setLoading(true)
    setHasSearched(true)

    try {
      const response = await jobsApi.search(searchQuery, filters)
      setJobs(response.data || [])

      if (response.data?.length === 0) {
        toast('No jobs found. Try different keywords.', { icon: 'ðŸ”' })
      } else {
        toast.success(`Found ${response.data.length} jobs!`)
      }
    } catch (error) {
      toast.error(error.message || 'Failed to search jobs')
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  const handleQuickSearch = (query) => {
    setSearchQuery(query)
    setTimeout(() => {
      handleSearch()
    }, 100)
  }

  const handleSaveJob = async (job) => {
    const jobId = job.job_id || job.id

    if (savedJobs.has(jobId)) {
      toast('Job already saved to tracker', { icon: 'ðŸ“Œ' })
      return
    }

    try {
      await jobTrackerApi.track({
        jobId: jobId,
        title: job.job_title || job.title,
        company: job.employer_name || job.company,
        location: job.job_city || job.location?.city || 'Remote',
        jobType: job.job_employment_type || job.employmentType || 'Full-time',
        applyLink: job.job_apply_link || job.applyLink,
        salary: job.job_salary_min ? `$${job.job_salary_min} - $${job.job_salary_max}` : null,
        description: job.job_description || job.description,
        status: 'saved'
      })

      setSavedJobs(prev => new Set([...prev, jobId]))
      toast.success('Job saved to tracker!')
    } catch (error) {
      toast.error('Failed to save job')
    }
  }

  const formatSalary = (job) => {
    if (job.job_min_salary && job.job_max_salary) {
      return `$${(job.job_min_salary / 1000).toFixed(0)}k - $${(job.job_max_salary / 1000).toFixed(0)}k`
    }
    if (job.job_salary_min && job.job_salary_max) {
      return `$${job.job_salary_min} - $${job.job_salary_max}`
    }
    return null
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently'
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return 'Recently'
    return formatDistanceToNow(date, { addSuffix: true })
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered Job Search
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Find Your Dream Job
          </h1>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Search thousands of opportunities and accelerate your career with careerpilot
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 backdrop-blur-sm">
            <form onSubmit={handleSearch} className="space-y-4">
              {/* Main Search Bar */}
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500 w-5 h-5" />
               <input
  type="text"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  placeholder="Job title, keywords, or company..."
  className="w-full pl-12 pr-10 py-4 bg-neutral-800/50 border border-neutral-700 rounded-xl text-lg text-white placeholder-neutral-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
/>
{searchQuery && (
  <button
    type="button"
    onClick={() => setSearchQuery('')}
    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
  >
    <X className="w-5 h-5" />
  </button>
)}
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="!px-8 !py-4 !text-lg !rounded-xl flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                  Search
                </Button>
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-4 rounded-xl border transition-all cursor-pointer ${showFilters
                    ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400'
                    : 'bg-neutral-800/50 border-neutral-700 text-neutral-400 hover:bg-neutral-800'
                    }`}
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>

              {/* Filters Panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 border-t border-neutral-800 grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-2">
                          Job Type
                        </label>
                        <select
                          value={filters.jobType}
                          onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                          className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
                        >
                          {JOB_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-2">
                          Experience Level
                        </label>
                        <select
                          value={filters.experienceLevel}
                          onChange={(e) => setFilters({ ...filters, experienceLevel: e.target.value })}
                          className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
                        >
                          {EXPERIENCE_LEVELS.map(level => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-400 mb-2">
                          Location
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 w-4 h-4" />
                          <input
                            type="text"
                            value={filters.location}
                            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                            placeholder="City, state, or remote"
                            className="w-full pl-10 pr-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            {/* Popular Searches */}
            {!hasSearched && (
              <div className="mt-6 pt-4 border-t border-neutral-800">
                <p className="text-sm text-neutral-500 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Trending searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map(search => (
                    <button
                      key={search}
                      onClick={() => handleQuickSearch(search)}
                      className="px-4 py-2 bg-neutral-800 hover:bg-indigo-500/20 hover:text-indigo-400 hover:border-indigo-500/30 border border-neutral-700 rounded-full text-sm text-neutral-400 transition-all cursor-pointer"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Results Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-2 border-neutral-800 rounded-full" />
              <div className="absolute top-0 left-0 w-16 h-16 border-2 border-transparent border-t-indigo-500 rounded-full animate-spin" />
            </div>
            <p className="text-neutral-400 mt-4">Searching for opportunities...</p>
          </div>
        ) : hasSearched && jobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-neutral-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No jobs found</h3>
            <p className="text-neutral-400 mb-6">Try adjusting your search terms or filters</p>
            <Button variant="ghost" onClick={() => setHasSearched(false)}>
              Clear Search
            </Button>
          </motion.div>
        ) : hasSearched && jobs.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-neutral-400">
                Found <span className="font-semibold text-white">{jobs.length}</span> jobs for "{searchQuery}"
              </p>
              <Link to="/job-tracker">
                <Button variant="ghost" className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4" />
                  Saved Jobs ({savedJobs.size})
                </Button>
              </Link>
            </div>

            {/* Job Cards */}
            <div className="space-y-4">
              {jobs.map((job, index) => (
                <motion.div
                  key={job.job_id || job.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-all group">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        {/* Company Logo */}
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-neutral-700">
                          {job.employer_logo ? (
                            <img
                              src={job.employer_logo}
                              alt={job.employer_name}
                              className="w-10 h-10 object-contain rounded"
                              onError={(e) => {
                                e.target.style.display = 'none'
                                e.target.nextSibling.style.display = 'flex'
                              }}
                            />
                          ) : null}
                          <Building2 className={`w-6 h-6 text-indigo-400 ${job.employer_logo ? 'hidden' : ''}`} />
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">
                            {job.job_title || job.title}
                          </h3>
                          <p className="text-neutral-400 font-medium">
                            {job.employer_name || job.company}
                          </p>

                          {/* Job Meta */}
                          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-neutral-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.job_city || job.location?.city || 'Remote'}{job.job_state ? `, ${job.job_state}` : ''}
                            </span>
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-4 h-4" />
                              {job.job_employment_type || job.employmentType || 'Full-time'}
                            </span>
                            {formatSalary(job) && (
                              <span className="flex items-center gap-1 text-green-400 font-medium">
                                <DollarSign className="w-4 h-4" />
                                {formatSalary(job)}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatDate(job.job_posted_at_datetime_utc)}
                            </span>
                          </div>

                          {/* Job Description Preview */}
                          <p className="text-neutral-500 text-sm mt-3 line-clamp-2">
                            {(job.job_description || job.description || '').substring(0, 200)}...
                          </p>

                          {/* Tags */}
                          {job.job_required_skills && job.job_required_skills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {job.job_required_skills.slice(0, 5).map((skill, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-md text-xs font-medium"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={() => handleSaveJob(job)}
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${savedJobs.has(job.job_id || job.id)
                            ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                            : 'bg-neutral-800 text-neutral-500 hover:bg-indigo-500/20 hover:text-indigo-400 border border-neutral-700'
                            }`}
                          title={savedJobs.has(job.job_id || job.id) ? 'Saved' : 'Save to tracker'}
                        >
                          {savedJobs.has(job.job_id || job.id) ? (
                            <BookmarkCheck className="w-5 h-5" />
                          ) : (
                            <Bookmark className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Apply Button */}
                    <div className="flex justify-end mt-4 pt-4 border-t border-neutral-800">
                      <a
                        href={job.job_apply_link || job.applyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-neutral-200 text-black rounded-lg font-medium transition-colors cursor-pointer"
                      >
                        Apply Now
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          /* Initial State - No Search Yet */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid md:grid-cols-3 gap-6 mt-12"
          >
            <div className="text-center p-8 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-indigo-500/30 transition-all group">
              <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Quick Apply</h3>
              <p className="text-neutral-400 text-sm">
                Apply to multiple jobs with your optimized resume in just one click
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-green-500/30 transition-all group">
              <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Target className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Smart Matching</h3>
              <p className="text-neutral-400 text-sm">
                AI-powered job recommendations based on your skills and experience
              </p>
            </div>

            <div className="text-center p-8 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-purple-500/30 transition-all group">
              <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Track Progress</h3>
              <p className="text-neutral-400 text-sm">
                Monitor all your applications and get insights on your job search
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}