import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
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
  Sparkles,
  History // Added icon for search history visualization
} from 'lucide-react'
import { jobsApi, jobTrackerApi } from '../services/api'
import { useSearchHistory } from '../hooks/useSearchHistory' // Imported custom hook
import Button from '../components/Button'
import MatchScoreBadge from '../components/MatchScoreBadge'
import { SkeletonJobList } from '../components/ui/Skeleton'

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
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [savedJobs, setSavedJobs] = useState(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false)
  
  // Initialize Search History Hook
  const { history, addToHistory, removeFromHistory, clearHistory } = useSearchHistory()

  const [filters, setFilters] = useState({
    jobType: JOB_TYPES.includes(searchParams.get('jobType')) ? searchParams.get('jobType') : 'All Types',
    experienceLevel: EXPERIENCE_LEVELS.includes(searchParams.get('experienceLevel')) ? searchParams.get('experienceLevel') : 'All Levels',
    location: searchParams.get('location') || ''
  })

  const isAnyFilterActive =
    filters.jobType !== 'All Types' ||
    filters.experienceLevel !== 'All Levels' ||
    filters.location !== ''

  const clearAllFilters = async () => {
    const clearedFilters = {
      jobType: 'All Types',
      experienceLevel: 'All Levels',
      location: ''
    }
    setFilters(clearedFilters)

    const params = {}
    if (searchQuery.trim()) {
      params.q = searchQuery
    }
    setSearchParams(params)

    if (searchQuery.trim()) {
      setLoading(true)
      setHasSearched(true)
      try {
        const response = await jobsApi.search(searchQuery, clearedFilters)
        setJobs(response.data || [])
        toast.success('Filters cleared!')
      } catch (error) {
        toast.error(error.message || 'Failed to search jobs')
        setJobs([])
      } finally {
        setLoading(false)
      }
    } else {
      toast.success('Filters cleared!')
    }
  }

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
    setShowHistoryDropdown(false)

    // Save search query into history
    addToHistory(searchQuery.trim())

    // Only persist non-default filter values for cleaner URLs
    const params = { q: searchQuery }
    if (filters.jobType !== 'All Types') params.jobType = filters.jobType
    if (filters.experienceLevel !== 'All Levels') params.experienceLevel = filters.experienceLevel
    if (filters.location) params.location = filters.location
    setSearchParams(params)

    try {
      const response = await jobsApi.search(searchQuery, filters)
      setJobs(response.data || [])

      if (response.data?.length === 0) {
        toast('No jobs found. Try different keywords.', { icon: '🔍' })
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
    setShowHistoryDropdown(false)
    setTimeout(() => {
      // Trigger search manually with correct latest query bound context
      setLoading(true)
      setHasSearched(true)
      addToHistory(query.trim())
      
      const params = { q: query }
      if (filters.jobType !== 'All Types') params.jobType = filters.jobType
      if (filters.experienceLevel !== 'All Levels') params.experienceLevel = filters.experienceLevel
      if (filters.location) params.location = filters.location
      setSearchParams(params)

      jobsApi.search(query, filters)
        .then(response => {
          setJobs(response.data || [])
          if (response.data?.length === 0) {
            toast('No jobs found. Try different keywords.', { icon: '🔍' })
          } else {
            toast.success(`Found ${response.data.length} jobs!`)
          }
        })
        .catch(error => {
          toast.error(error.message || 'Failed to search jobs')
          setJobs([])
        })
        .finally(() => {
          setLoading(false)
        })
    }, 100)
  }

  const handleResetFilters = () => {
    const defaultFilters = { jobType: 'All Types', experienceLevel: 'All Levels', location: '' }
    setFilters(defaultFilters)
    setSearchParams({ q: searchQuery })

    if (hasSearched && searchQuery.trim()) {
      setLoading(true)
      jobsApi.search(searchQuery, defaultFilters)
        .then(response => {
          setJobs(response.data || [])
          toast.success('Filters reset successfully')
        })
        .catch(error => {
          toast.error(error.message || 'Failed to search jobs')
          setJobs([])
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      toast.success('Filters reset')
    }
  }

  const handleSaveJob = async (job) => {
    const jobId = job.job_id || job.id

    if (savedJobs.has(jobId)) {
      toast('Job already saved to tracker', { icon: '📌' })
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

  const saveRecentlyViewedJob = (job) => {
    const recentJobs = JSON.parse(localStorage.getItem('recentJobs')) || [];

    const filteredJobs = recentJobs.filter(
      (item) => (item.job_id || item.id) !== (job.job_id || job.id)
    );

    const updatedJobs = [
      {
        ...job,
        viewedAt: new Date().toISOString(),
      },
      ...filteredJobs,
    ].slice(0, 15);

    localStorage.setItem('recentJobs', JSON.stringify(updatedJobs));
  };

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

  const getMatchScore = (job) => {
    const score = job.matchScore ?? job.match_score ?? job.matchPercentage ?? job.match_percentage
    const numericScore = typeof score === 'string' ? Number(score) : score
    return typeof numericScore === 'number' && Number.isFinite(numericScore) ? numericScore : null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered Job Search
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            Find Your Dream Job
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
          <div className="p-6 rounded-2xl bg-background/50 border border-border backdrop-blur-sm">
            <form onSubmit={handleSearch} className="space-y-4">
              {/* Main Search Bar */}
              <div className="flex gap-3 relative">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onFocus={() => setShowHistoryDropdown(true)}
                    onBlur={() => setTimeout(() => setShowHistoryDropdown(false), 200)}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Job title, keywords, or company..."
                    className="w-full pl-12 pr-10 py-4 bg-muted/50 border border-border rounded-xl text-lg text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}

                  {/* Search History Dropdown Menu */}
                  <AnimatePresence>
                    {showHistoryDropdown && history && history.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute z-50 left-0 right-0 mt-2 bg-background border border-border rounded-xl shadow-xl overflow-hidden max-h-64 overflow-y-auto"
                      >
                        <div className="flex items-center justify-between px-4 py-2 bg-muted/40 border-b border-border">
                          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                            <History className="w-3 h-3" /> Recent Searches
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              clearHistory();
                            }}
                            className="text-xs text-red-500 hover:text-red-700 transition-colors"
                          >
                            Clear All
                          </button>
                        </div>
                        <ul>
                          {history.map((item, idx) => (
                            <li
                              key={idx}
                              className="flex items-center justify-between px-4 py-3 hover:bg-muted/60 cursor-pointer group transition-colors"
                              onMouseDown={() => handleQuickSearch(item)}
                            >
                              <span className="text-sm text-foreground flex items-center gap-2">
                                <Search className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                {item}
                              </span>
                              <button
                                type="button"
                                onMouseDown={(e) => {
                                  e.stopPropagation();
                                  removeFromHistory(item);
                                }}
                                className="text-muted-foreground hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Remove search item"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                  aria-label="Toggle Filters"
                  className={`px-4 py-4 rounded-xl border transition-all cursor-pointer ${showFilters
                    ? 'bg-primary/20 border-primary/30 text-primary'
                    : 'bg-muted/50 border-border text-muted-foreground hover:bg-muted'
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
                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg text-foreground">Filters</h3>
                        {isAnyFilterActive && (
                          <button
                            type="button"
                            onClick={clearAllFilters}
                            className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors duration-200 flex items-center gap-1 cursor-pointer"
                            aria-label="Clear all filters"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Clear All
                          </button>
                        )}
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label htmlFor="job-type-select" className="block text-sm font-medium text-muted-foreground mb-2">
                            Job Type
                          </label>
                          <select
                            id="job-type-select"
                            value={filters.jobType}
                            onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                            className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary"
                          >
                            {JOB_TYPES.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="experience-level-select" className="block text-sm font-medium text-muted-foreground mb-2">
                            Experience Level
                          </label>
                          <select
                            id="experience-level-select"
                            value={filters.experienceLevel}
                            onChange={(e) => setFilters({ ...filters, experienceLevel: e.target.value })}
                            className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary"
                          >
                            {EXPERIENCE_LEVELS.map(level => (
                              <option key={level} value={level}>{level}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label htmlFor="location-input" className="block text-sm font-medium text-muted-foreground mb-2">
                            Location
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <input
                              id="location-input"
                              type="text"
                              value={filters.location}
                              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                              placeholder="City, state, or remote"
                              className="