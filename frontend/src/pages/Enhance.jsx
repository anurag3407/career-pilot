import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { resumeApi, enhanceApi } from '../services/api'
import { triggerConfetti } from '../utils/confetti'
import ResumeAnalysisSkeleton from '../components/ui/ResumeAnalysisSkeleton'
import {
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  ArrowRight,
  BarChart3,
  Zap,
  FileText,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Award,
  AlertCircle,
  Star,
  GraduationCap,
  Code,
  FolderKanban,
  Lightbulb,
  Brain,
  Edit3,
  ClipboardList
} from 'lucide-react'
import { SkeletonList } from '../components/ui/Skeleton'
import ResumeScore from '../components/ResumeScore'

// Score ring component
const ScoreRing = ({ score, size = 120, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (score / 100) * circumference

  const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e'
    if (score >= 60) return '#eab308'
    if (score >= 40) return '#f97316'
    return '#ef4444'
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-muted-foreground/70"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke={getScoreColor(score)}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="text-3xl font-bold text-foreground"
        >
          {score}
        </motion.span>
        <span className="text-xs text-muted-foreground">ATS Score</span>
      </div>
    </div>
  )
}

// Score breakdown bar
const ScoreBar = ({ label, score, delay = 0 }) => {
  const getBarColor = (score) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    if (score >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-foreground font-medium">{score}%</span>
      </div>
      <div className="h-2 bg-card rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, delay, ease: "easeOut" }}
          className={`h-full rounded-full ${getBarColor(score)}`}
        />
      </div>
    </div>
  )
}

// Improvement card
const ImprovementCard = ({ improvement, index }) => {
  const [expanded, setExpanded] = useState(false)

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30'
      default: return 'bg-muted-foreground/20 text-muted-foreground border-border/30'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-muted/50 border border-border rounded-xl p-4 hover:border-border/80 transition-colors"
    >
      <div
        className="flex items-start justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(improvement.priority)}`}>
              {improvement.priority || 'Medium'} Priority
            </span>
            <span className="text-xs text-muted-foreground">{improvement.category}</span>
          </div>
          <p className="text-foreground font-medium">{improvement.issue}</p>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground ml-2 shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground ml-2 shrink-0" />
        )}
      </div>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 pt-3 border-t border-border"
        >
          <div className="flex items-start gap-2">
            <Zap className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <p className="text-sm text-foreground">{improvement.suggestion}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

// Section Grade Card Component
const SectionGradeCard = ({ section, data, icon: Icon }) => {
  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'from-green-500 to-emerald-500'
      case 'B': return 'from-blue-500 to-cyan-500'
      case 'C': return 'from-yellow-500 to-orange-400'
      case 'D': return 'from-orange-500 to-red-400'
      case 'F': return 'from-red-500 to-red-600'
      default: return 'from-neutral-500 to-neutral-600'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-muted/50 border border-border rounded-xl p-4 hover:border-border/80 transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-primary" />
          <span className="font-medium text-foreground capitalize">{section}</span>
        </div>
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getGradeColor(data?.grade)} flex items-center justify-center`}>
          <span className="text-foreground font-bold text-lg">{data?.grade || 'N/A'}</span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-1.5 bg-card rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${data?.score || 0}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`h-full rounded-full bg-gradient-to-r ${getGradeColor(data?.grade)}`}
          />
        </div>
        <p className="text-sm text-muted-foreground">{data?.feedback || 'No feedback available'}</p>
      </div>
    </motion.div>
  )
}

// Bullet Analysis Card Component
const BulletAnalysisCard = ({ bullet, index }) => {
  const [expanded, setExpanded] = useState(false)

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-400 bg-green-500/20 border-green-500/30'
    if (score >= 5) return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30'
    return 'text-red-400 bg-red-500/20 border-red-500/30'
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-muted/30 border border-border rounded-xl p-4 hover:bg-muted/50 transition-all"
    >
      <div className="cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between gap-4">
          <p className="text-foreground text-sm flex-1">{bullet.original}</p>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-xs px-2 py-1 rounded-lg border ${getScoreColor(bullet.score)}`}>
              {bullet.score}/10
            </span>
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </div>

        {bullet.starCheck && (
          <div className="flex gap-2 mt-2">
            {['S', 'T', 'A', 'R'].map((letter, i) => {
              const key = ['hasSituation', 'hasTask', 'hasAction', 'hasResult'][i]
              const has = bullet.starCheck[key]
              return (
                <span
                  key={letter}
                  className={`text-xs px-1.5 py-0.5 rounded ${has ? 'bg-green-500/20 text-green-400' : 'bg-card text-muted-foreground'}`}
                >
                  {letter}
                </span>
              )
            })}
          </div>
        )}
      </div>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 pt-4 border-t border-border space-y-3"
        >
          {bullet.issues && bullet.issues.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Issues:</p>
              <div className="flex flex-wrap gap-1">
                {bullet.issues.map((issue, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 bg-red-500/10 text-red-400 rounded">
                    {issue}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs text-primary font-medium">Improved Version</span>
            </div>
            <p className="text-sm text-foreground">{bullet.improved}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

// Senior Tip Card Component
const SeniorTipCard = ({ tip, index }) => {
  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'formatting': return FileText
      case 'content': return Edit3
      case 'impact': return Zap
      case 'keywords': return Code
      case 'structure': return FolderKanban
      default: return Lightbulb
    }
  }

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'formatting': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'content': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'impact': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'keywords': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'structure': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
      default: return 'bg-primary/20 text-primary border-primary/30'
    }
  }

  const Icon = getCategoryIcon(tip.category)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`border rounded-xl p-4 ${getCategoryColor(tip.category)}`}
    >
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 mt-0.5 shrink-0" />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs opacity-75 capitalize">{tip.category}</span>
            {tip.priority === 'high' && (
              <span className="text-xs px-1.5 py-0.5 bg-red-500/30 text-red-300 rounded">High Priority</span>
            )}
          </div>
          <p className="text-sm font-medium">{tip.tip}</p>
          {tip.example && (
            <p className="text-xs opacity-75 mt-2 italic">"{tip.example}"</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function Enhance() {
  const { resumeId } = useParams()
  const navigate = useNavigate()

  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [enhancing, setEnhancing] = useState(false)
  const [scoring, setScoring] = useState(false)
  const [scoreData, setScoreData] = useState(null)
  const [atsAnalysis, setAtsAnalysis] = useState(null)
  const [comprehensiveAnalysis, setComprehensiveAnalysis] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  const [jobRole, setJobRole] = useState('')
  const [hasAnalyzed, setHasAnalyzed] = useState(false)
  const [copiedKeyword, setCopiedKeyword] = useState(null)

  useEffect(() => {
    fetchResume()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeId])

  const fetchResume = async () => {
    try {
      const response = await resumeApi.getById(resumeId)
      setResume(response.data)
      if (response.data.jobRole) {
        setJobRole(response.data.jobRole)
      }
    } catch (_error) {
      toast.error('Failed to load resume')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyze = async () => {
    if (!jobRole.trim()) {
      toast.error('Please enter a target job role')
      return
    }

    setAnalyzing(true)
    try {
      const [atsResponse, comprehensiveResponse] = await Promise.all([
        enhanceApi.analyzeATS(resume.originalText, jobRole),
        enhanceApi.comprehensiveAnalysis(resume.originalText, jobRole)
      ])

      setAtsAnalysis(atsResponse.data)
      setComprehensiveAnalysis(comprehensiveResponse.data)
      setHasAnalyzed(true)

      if (atsResponse.data?.atsScore >= 90) {
        triggerConfetti({ duration: 4000, particleCount: 220, spread: 140 })
      }

      await resumeApi.update(resumeId, { jobRole })

      // Log to ATS history
      try {
        await resumeApi.logAtsHistory(resumeId, {
          jobRole: jobRole,
          atsScore: atsResponse.data?.atsScore || 0,
          scoreBreakdown: {
            keywordMatch: atsResponse.data?.scoreBreakdown?.keywordMatch || 0,
            formatting: atsResponse.data?.scoreBreakdown?.formatting || 0,
            experienceRelevance: atsResponse.data?.scoreBreakdown?.experienceRelevance || 0,
            skillsAlignment: atsResponse.data?.scoreBreakdown?.skillsAlignment || 0,
            educationMatch: atsResponse.data?.scoreBreakdown?.educationMatch || 0
          },
          missingKeywords: atsResponse.data?.missingKeywords || [],
          improvementsCount: atsResponse.data?.improvements?.length || 0
        })
      } catch (err) {
        console.error('Failed to log ATS score run:', err)
      }

      toast.success('Senior-level analysis complete!')
    } catch (error) {
      toast.error(error.message || 'Failed to analyze resume')
    } finally {
      setAnalyzing(false)
    }
  }

  const copyKeywordToClipboard = async (keyword) => {
    if (!keyword) return

    try {
      await navigator.clipboard.writeText(keyword)
      setCopiedKeyword(keyword)
      setTimeout(() => {
        setCopiedKeyword((current) => (current === keyword ? null : current))
      }, 2000)
    } catch (err) {
      console.error('Failed to copy keyword:', err)
      toast.error('Could not copy keyword to clipboard. Please try again.')
    }
  }

  const handleEnhanceWithAI = async () => {
    setEnhancing(true)
    try {
      const apiPreferences = {
        jobRole: jobRole,
        yearsOfExperience: resume.yearsOfExperience || 0, // Assuming yearsOfExperience is available in resume object
        skills: atsAnalysis?.missingKeywords || [],
        industry: '',
        customInstructions: `Focus on improving: ${atsAnalysis?.improvements?.map(i => i.issue).join(', ') || 'general improvements'}`,
        profileInfo: {}
      }

      const enhanceResponse = await enhanceApi.enhance(resume.originalText, apiPreferences)

      await resumeApi.update(resumeId, {
        enhancedText: enhanceResponse.data.enhancedResume,
        jobRole: jobRole,
        preferences: apiPreferences
      })

      // Create a version snapshot for the AI enhanced state
      try {
        await resumeApi.createVersion(resumeId, {
          title: `AI Enhanced for ${jobRole}`,
          originalText: resume.originalText,
          enhancedText: enhanceResponse.data.enhancedResume,
          jobRole: jobRole,
          atsScore: atsAnalysis?.atsScore || null,
          tags: ['AI-Enhanced', jobRole]
        })
      } catch (versionErr) {
        console.error('Failed to auto-save version snapshot for AI enhancement:', versionErr)
      }

      toast.success('Resume enhanced successfully!')
      triggerConfetti({ duration: 3000, particleCount: 150, spread: 120 })
      navigate(`/resume/${resumeId}`)
    } catch (error) {
      toast.error(error.message || 'Failed to enhance resume')
    } finally {
      setEnhancing(false)
    }
  }

  const handleScoreResume = async () => {
    if (!resume?.originalText) {
      toast.error('No resume text found to score')
      return
    }
    setScoring(true)
    setActiveTab('score')
    try {
      const response = await enhanceApi.scoreResume(resume.originalText)
      setScoreData(response.data)
      // Save the score back to the resume history
      await resumeApi.update(resumeId, { atsScore: response.data.overallScore })
      toast.success('Resume scored!')
    } catch (error) {
      toast.error(error.message || 'Failed to score resume')
      setActiveTab('overview')
    } finally {
      setScoring(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <div className="mb-8 space-y-3">
              <div className="h-4 bg-muted rounded-lg w-32 animate-pulse" />
              <div className="h-10 bg-muted rounded-lg w-2/3 animate-pulse" />
              <div className="h-4 bg-muted rounded-lg w-1/2 animate-pulse" />
            </div>
            <SkeletonList count={4} />
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-4">
            <Target className="w-4 h-4" />
            ATS Score Analysis
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Resume Analysis</h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <FileText className="w-4 h-4" />
            {resume?.title}
          </p>
        </motion.div>

        {/* Job Role Input */}
        {!hasAnalyzed && !analyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background/50 border border-border rounded-2xl p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Enter Target Job Role</h2>
                <p className="text-sm text-muted-foreground">We'll analyze your resume against this position</p>
              </div>
            </div>

            <div className="flex gap-4">
              <input
                type="text"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                placeholder="e.g., Senior Software Engineer, Product Manager, Data Scientist"
                className="flex-1 px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
              />
              <button
                onClick={handleAnalyze}
                disabled={analyzing || !jobRole.trim()}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-foreground rounded-xl font-medium hover:from-primary hover:to-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <BarChart3 className="w-5 h-5" />
                Analyze Resume
              </button>
            </div>
          </motion.div>
        )}

        {/* Analyzing State */}
        {analyzing && <ResumeAnalysisSkeleton />}

        {/* ATS Analysis Results */}
        {hasAnalyzed && atsAnalysis && (
          <div className="space-y-6">
            {/* Score Overview */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Score Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="lg:col-span-1 bg-background/50 border border-border rounded-2xl p-6"
              >
                <div className="flex flex-col items-center">
                  <ScoreRing score={atsAnalysis.atsScore} size={160} strokeWidth={12} />
                  <div className="mt-4 text-center">
                    <p className="text-lg font-medium text-foreground mb-1">
                      {atsAnalysis.atsScore >= 80 ? 'Excellent!' :
                        atsAnalysis.atsScore >= 60 ? 'Good Progress' :
                          atsAnalysis.atsScore >= 40 ? 'Needs Work' : 'Major Improvements Needed'}
                    </p>
                    <p className="text-sm text-muted-foreground">for {jobRole}</p>
                  </div>
                  <button
                    onClick={() => {
                      setHasAnalyzed(false)
                      setAtsAnalysis(null)
                      setComprehensiveAnalysis(null)
                      setActiveTab('overview')
                    }}
                    className="mt-4 text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Analyze Different Role
                  </button>
                  <button
                    onClick={handleScoreResume}
                    disabled={scoring}
                    className="mt-2 text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    <ClipboardList className="w-4 h-4" />
                    {scoring ? 'Scoring...' : 'Score My Resume'}
                  </button>
                </div>
              </motion.div>

              {/* Score Breakdown */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2 bg-background/50 border border-border rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Score Breakdown
                </h3>
                <div className="space-y-4">
                  <ScoreBar label="Keyword Match" score={atsAnalysis.scoreBreakdown?.keywordMatch || 0} delay={0.1} />
                  <ScoreBar label="Formatting" score={atsAnalysis.scoreBreakdown?.formatting || 0} delay={0.2} />
                  <ScoreBar label="Experience Relevance" score={atsAnalysis.scoreBreakdown?.experienceRelevance || 0} delay={0.3} />
                  <ScoreBar label="Skills Alignment" score={atsAnalysis.scoreBreakdown?.skillsAlignment || 0} delay={0.4} />
                  <ScoreBar label="Education Match" score={atsAnalysis.scoreBreakdown?.educationMatch || 0} delay={0.5} />
                </div>
              </motion.div>
            </div>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-background/50 border border-border rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                Analysis Summary
              </h3>
              <p className="text-foreground leading-relaxed">{atsAnalysis.summary}</p>
            </motion.div>

            {/* Strengths & Missing Keywords */}
            <div className="grid lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-background/50 border border-border rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Strengths
                </h3>
                <ul className="space-y-3">
                  {atsAnalysis.strengths?.map((strength, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-start gap-2"
                    >
                      <Award className="w-4 h-4 text-green-400 mt-1 shrink-0" />
                      <span className="text-foreground">{strength}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-background/50 border border-border rounded-2xl p-6"
              >
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  Missing Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {atsAnalysis.missingKeywords?.map((keyword, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                      onClick={() => copyKeywordToClipboard(keyword)}
                      className="relative cursor-pointer px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-lg text-sm transition hover:bg-yellow-500/20 hover:border-yellow-500/50 hover:text-yellow-300"
                    >
                      <span className="relative z-10">{keyword}</span>
                      {copiedKeyword === keyword && (
                        <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded-full bg-amber-500/95 px-2 py-1 text-[10px] font-semibold text-white shadow-lg">
                          Copied!
                        </span>
                      )}
                    </motion.span>
                  ))}
                  {(!atsAnalysis.missingKeywords || atsAnalysis.missingKeywords.length === 0) && (
                    <p className="text-muted-foreground text-sm">No critical keywords missing!</p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Improvements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-background/50 border border-border rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Recommended Improvements
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {atsAnalysis.improvements?.map((improvement, index) => (
                  <ImprovementCard key={index} improvement={improvement} index={index} />
                ))}
              </div>
            </motion.div>

            {/* Senior Expert Analysis */}
            {comprehensiveAnalysis && (
              <>
                {/* Tab Navigation */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="flex items-center justify-center gap-2 bg-background/50 border border-border rounded-xl p-2"
                >
                  {[
                    { id: 'overview', label: 'Section Grades', icon: BarChart3 },
                    { id: 'bullets', label: 'Bullet Analysis', icon: Edit3 },
                    { id: 'tips', label: 'Senior Tips', icon: Lightbulb },
                    { id: 'score', label: 'Resume Score', icon: ClipboardList }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === tab.id
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  ))}
                </motion.div>

                {/* Section Grades Tab */}
                {activeTab === 'overview' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${
                        comprehensiveAnalysis.overallGrade === 'A' ? 'from-green-500 to-emerald-500' :
                        comprehensiveAnalysis.overallGrade === 'B' ? 'from-blue-500 to-cyan-500' :
                        comprehensiveAnalysis.overallGrade === 'C' ? 'from-yellow-500 to-orange-400' :
                        'from-red-500 to-red-600'
                      } flex items-center justify-center`}>
                        <span className="text-foreground font-bold text-2xl">{comprehensiveAnalysis.overallGrade}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">Overall Resume Grade</h3>
                        <p className="text-muted-foreground text-sm">{comprehensiveAnalysis.executiveSummary}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <SectionGradeCard section="Summary" data={comprehensiveAnalysis.sectionGrades?.summary} icon={FileText} />
                      <SectionGradeCard section="Experience" data={comprehensiveAnalysis.sectionGrades?.experience} icon={Briefcase} />
                      <SectionGradeCard section="Education" data={comprehensiveAnalysis.sectionGrades?.education} icon={GraduationCap} />
                      <SectionGradeCard section="Skills" data={comprehensiveAnalysis.sectionGrades?.skills} icon={Code} />
                      <SectionGradeCard section="Projects" data={comprehensiveAnalysis.sectionGrades?.projects} icon={FolderKanban} />
                    </div>

                    <div className="grid lg:grid-cols-2 gap-4 mt-6">
                      <div className="bg-muted/50 border border-border rounded-xl p-4">
                        <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                          <Zap className="w-4 h-4 text-orange-400" />
                          Action Verb Quality
                        </h4>
                        <ScoreBar label="Verb Score" score={comprehensiveAnalysis.actionVerbAnalysis?.verbScore || 0} delay={0.1} />
                        {comprehensiveAnalysis.actionVerbAnalysis?.powerVerbsUsed?.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs text-muted-foreground mb-1">Power verbs used:</p>
                            <div className="flex flex-wrap gap-1">
                              {comprehensiveAnalysis.actionVerbAnalysis.powerVerbsUsed.slice(0, 5).map((verb, i) => (
                                <span key={i} className="text-xs px-2 py-0.5 bg-green-500/10 text-green-400 rounded">{verb}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="bg-muted/50 border border-border rounded-xl p-4">
                        <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-blue-400" />
                          Quantification Level
                        </h4>
                        <ScoreBar label="Bullets with Metrics" score={comprehensiveAnalysis.quantificationAnalysis?.percentageQuantified || 0} delay={0.2} />
                        <div className="mt-2 flex gap-4 text-sm">
                          <span className="text-green-400">{comprehensiveAnalysis.quantificationAnalysis?.bulletsWithMetrics || 0} with metrics</span>
                          <span className="text-muted-foreground">{comprehensiveAnalysis.quantificationAnalysis?.bulletsWithoutMetrics || 0} without</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Bullet Analysis Tab */}
                {activeTab === 'bullets' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-background/50 border border-border rounded-2xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <Edit3 className="w-5 h-5 text-primary" />
                        Bullet-by-Bullet Analysis
                      </h3>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Legend:</span>
                        {['S', 'T', 'A', 'R'].map((l, i) => (
                          <span key={l} className="flex items-center gap-1 text-xs">
                            <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded">{l}</span>
                            <span className="text-muted-foreground">{['Situation', 'Task', 'Action', 'Result'][i]}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">Click on any bullet to see detailed analysis and AI-improved version</p>
                    <div className="space-y-3">
                      {comprehensiveAnalysis.bulletAnalysis?.map((bullet, index) => (
                        <BulletAnalysisCard key={index} bullet={bullet} index={index} />
                      ))}
                      {(!comprehensiveAnalysis.bulletAnalysis || comprehensiveAnalysis.bulletAnalysis.length === 0) && (
                        <p className="text-muted-foreground text-center py-8">No bullet points analyzed</p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Senior Tips Tab */}
                {activeTab === 'tips' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                        <Brain className="w-6 h-6 text-foreground" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">Senior Resume Expert Tips</h3>
                        <p className="text-muted-foreground text-sm">Pro advice to make your resume stand out</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {comprehensiveAnalysis.seniorTips?.map((tip, index) => (
                        <SeniorTipCard key={index} tip={tip} index={index} />
                      ))}
                    </div>

                    {comprehensiveAnalysis.competitiveEdge && (
                      <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-500/30 rounded-xl p-6 mt-4">
                        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                          <Star className="w-5 h-5 text-amber-400" />
                          Competitive Edge Score: {comprehensiveAnalysis.competitiveEdge.score}/100
                        </h4>
                        {comprehensiveAnalysis.competitiveEdge.standoutFactors?.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-muted-foreground mb-2">What makes you stand out:</p>
                            <ul className="space-y-1">
                              {comprehensiveAnalysis.competitiveEdge.standoutFactors.map((factor, i) => (
                                <li key={i} className="text-sm text-amber-300 flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                  {factor}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {comprehensiveAnalysis.competitiveEdge.differentiators?.length > 0 && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">To stand out even more:</p>
                            <ul className="space-y-1">
                              {comprehensiveAnalysis.competitiveEdge.differentiators.map((diff, i) => (
                                <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                                  <ArrowRight className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                                  {diff}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Resume Score Tab */}
                {activeTab === 'score' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {scoring ? (
                      <div className="bg-background/50 border border-border rounded-2xl p-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
                          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Scoring Your Resume</h3>
                        <p className="text-muted-foreground">Gemini is evaluating each section...</p>
                      </div>
                    ) : scoreData ? (
                      <ResumeScore data={scoreData} onRescore={handleScoreResume} />
                    ) : (
                      <div className="bg-background/50 border border-border rounded-2xl p-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
                          <ClipboardList className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">Resume Score</h3>
                        <p className="text-muted-foreground mb-6">Get an overall score and section-by-section breakdown with 3 tailored improvement tips.</p>
                        <button
                          onClick={handleScoreResume}
                          disabled={scoring}
                          className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-primary hover:to-secondary transition-all flex items-center gap-2 mx-auto"
                        >
                          <ClipboardList className="w-5 h-5" />
                          Score My Resume
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </>
            )}

            {/* Enhance with AI Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass glow border border-primary/30 rounded-3xl p-8 relative overflow-hidden mt-8"
            >
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-indigo-500/10 to-purple-500/10"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Ready to Improve Your Resume?</h3>
                    <p className="text-muted-foreground">Let AI optimize your resume based on the analysis above</p>
                  </div>
                </div>
                <button
                  onClick={handleEnhanceWithAI}
                  disabled={enhancing}
                  className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-foreground rounded-xl font-semibold hover:from-primary hover:to-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
                >
                  {enhancing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Enhancing with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Improve with AI
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              {enhancing && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    This may take a minute. We're optimizing your resume for {jobRole} position...
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}