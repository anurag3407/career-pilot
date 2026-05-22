import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import ThemeSelector from "../components/portfolio/ThemeSelector"
import PreviewFrame from "../components/portfolio/PreviewFrame"

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
  Globe
} from 'lucide-react'

import { resumeApi, jobTrackerApi, portfolioApi } from '../services/api'
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
  const [portfolioCount, setPortfolioCount] = useState(0)

  // ✅ FIXED STATE NAME (IMPORTANT)
  const [selectedTheme, setSelectedTheme] = useState("minimal")
  const [device, setDevice] = useState("desktop")
  const [isDarkPreview, setIsDarkPreview] = useState(false)

  useEffect(() => {
    console.log("selectedTheme:", selectedTheme)
  }, [selectedTheme])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [resumeRes, jobsRes, portfolioRes] = await Promise.all([
        resumeApi.getAll().catch(() => ({ resumes: [] })),
        jobTrackerApi.getAll().catch(() => ({ trackedJobs: [] })),
        portfolioApi.getAll().catch(() => ({ portfolioItems: [] }))
      ])

      setResumes(resumeRes.resumes || resumeRes.data?.resumes || [])

      const jobs = jobsRes.trackedJobs || []
      setTrackedJobs(jobs)

      const portfolios =
        portfolioRes.portfolios ||
        portfolioRes.data?.portfolios ||
        portfolioRes.data ||
        []

      setPortfolioCount(portfolios.length)

      setJobStats({
        total: jobs.length,
        saved: jobs.filter(j => j.status === 'saved').length,
        applied: jobs.filter(j => j.status === 'applied').length,
        interviewing: jobs.filter(j => j.status === 'interviewing').length,
        offered: jobs.filter(j => j.status === 'offered').length
      })

    } catch (error) {
      console.error('Failed to fetch data:', error)
      setFetchError('Failed to load your dashboard. Please try again.')
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <ThemeSelector
          selectedTheme={selectedTheme}
          onSelectTheme={setSelectedTheme}
          isDarkPreview={isDarkPreview}
          setIsDarkPreview={setIsDarkPreview}
        />
<div className="fixed bottom-2 right-2 bg-black text-white p-2 text-xs z-50">
  Theme: {selectedTheme} <br />
  Device: {device}
</div>
       
         <PreviewFrame
  url="https://google.com"
  device={device}
  setDevice={setDevice}
  selectedTheme={selectedTheme}
/>
      
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-3 tracking-tight">
            Welcome back
          </h1>

          <p className="text-lg text-muted-foreground font-medium">
            Track your applications, enhance resumes, and land your dream job.
          </p>
        </motion.div>

      </div>
    </div>
  )
}