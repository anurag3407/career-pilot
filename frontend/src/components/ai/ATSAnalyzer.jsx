import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Upload as UploadIcon,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Briefcase,
  TrendingUp,
  Award,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Zap,
  ChevronRight,
  ClipboardList
} from 'lucide-react'
import { enhanceApi, uploadApi } from '../../services/api'
import DropZone from '../DropZone'
import toast from 'react-hot-toast'

// Score Ring Component with responsive HSL glow effects
const ScoreRing = ({ score, size = 150, strokeWidth = 10 }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (score / 100) * circumference

  const getScoreColor = (score) => {
    if (score >= 70) return '#10b981' // emerald-500
    if (score >= 40) return '#f59e0b' // amber-500
    return '#ef4444' // red-500
  }

  const getScoreGlow = (score) => {
    if (score >= 70) return 'rgba(16, 185, 129, 0.25)'
    if (score >= 40) return 'rgba(245, 158, 11, 0.25)'
    return 'rgba(239, 68, 68, 0.25)'
  }

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-border/40"
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
          transition={{ duration: 1.2, ease: "easeOut" }}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          stroke={getScoreColor(score)}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            filter: `drop-shadow(0 0 6px ${getScoreGlow(score)})`
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-4xl font-extrabold text-foreground"
        >
          {score}
        </motion.span>
        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground mt-0.5">
          ATS Score
        </span>
      </div>
    </div>
  )
}

// Score Bar breakdown list
const ScoreBar = ({ label, score, delay = 0 }) => {
  const getBarColor = (score) => {
    if (score >= 70) return 'bg-emerald-500'
    if (score >= 40) return 'bg-amber-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-semibold">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-foreground">{score}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
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

// Custom Accordion/Card for recommendations
const ImprovementCard = ({ item, index }) => {
  const [expanded, setExpanded] = useState(false)

  const getPriorityStyles = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'medium':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
      case 'low':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
      default:
        return 'bg-muted text-muted-foreground border-border'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all duration-300"
    >
      <div
        className="flex items-start justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityStyles(item.priority)}`}>
              {item.priority?.toUpperCase() || 'MEDIUM'} PRIORITY
            </span>
            {item.category && (
              <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full uppercase tracking-wider">
                {item.category}
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-foreground leading-tight">
            {item.issue}
          </p>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-muted-foreground flex-shrink-0"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-border overflow-hidden"
          >
            <div className="flex gap-2">
              <Zap className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.suggestion}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const ATSAnalyzer = ({ initialResumeText = "" }) => {
  const [resumeText, setResumeText] = useState(initialResumeText)
  const [jobDescription, setJobDescription] = useState("")
  const [inputMode, setInputMode] = useState("paste") // 'paste' | 'upload'
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [fileName, setFileName] = useState("")
  const [error, setError] = useState("")

  const handlePdfUpload = async (file) => {
    setUploading(true)
    setError("")
    setFileName(file.name)

    try {
      const response = await uploadApi.uploadPdf(file)
      const extractedText = response.data?.extractedText || response.extractedText
      if (extractedText) {
        setResumeText(extractedText)
        setInputMode("paste")
        toast.success("PDF parsed successfully! Feel free to edit below.")
      } else {
        throw new Error("Could not extract text from the PDF file.")
      }
    } catch (err) {
      setError(err.message || "Failed to extract text from PDF. Please paste manually.")
      toast.error(err.message || "Failed to extract text from PDF.")
      setFileName("")
    } finally {
      setUploading(false)
    }
  }

  const analyzeResume = async () => {
    if (!resumeText.trim()) {
      setError("Please provide your resume text or upload a PDF.")
      return
    }
    if (!jobDescription.trim()) {
      setError("Please provide a job description to match against.")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      // Use existing analyzeATS endpoint
      const response = await enhanceApi.analyzeATS(resumeText, jobDescription)
      
      if (response.success && response.data) {
        setResult(response.data)
        toast.success("Analysis complete!")
      } else {
        throw new Error("Failed to retrieve analysis from server.")
      }
    } catch (err) {
      setError(err.message || "Analysis failed. Please try again.")
      toast.error("Analysis failed.")
    } finally {
      setLoading(false)
    }
  }

  const resetAnalyzer = () => {
    setResult(null)
    setJobDescription("")
    setError("")
  }

  // Safely extract recommendations/suggestions
  const improvementsList = result?.improvements || []
  const missingKeywords = result?.missingKeywords || []
  const strengths = result?.strengths || []

  return (
    <div className="w-full">
      {!result ? (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Resume Input Area */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-primary" />
                  Resume Text
                </label>
                <div className="flex bg-muted rounded-lg p-0.5 border border-border">
                  <button
                    type="button"
                    onClick={() => setInputMode("paste")}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                      inputMode === "paste"
                        ? "bg-primary text-primary-foreground shadow"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Paste Text
                  </button>
                  <button
                    type="button"
                    onClick={() => setInputMode("upload")}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                      inputMode === "upload"
                        ? "bg-primary text-primary-foreground shadow"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Upload PDF
                  </button>
                </div>
              </div>

              <div className="flex-1 min-h-[220px]">
                {inputMode === "upload" ? (
                  <div className="h-full flex flex-col justify-center">
                    <DropZone
                      onFileSelect={handlePdfUpload}
                      disabled={uploading}
                      maxSizeMB={5}
                      multiple={false}
                    />
                    {uploading && (
                      <div className="flex items-center justify-center gap-2 mt-4 text-sm text-primary">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Extracting resume text...
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative h-full flex flex-col">
                    <textarea
                      className="w-full flex-1 min-h-[200px] max-h-[300px] border border-border rounded-xl p-4 text-xs resize-y focus:outline-none focus:ring-2 focus:ring-primary bg-background/50 text-foreground placeholder:text-muted-foreground"
                      placeholder="Paste your resume text here..."
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                    />
                    {fileName && (
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/80 border border-border px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        Parsed: {fileName}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Job Description Area */}
            <div className="flex-1 flex flex-col">
              <label className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-primary" />
                Job Description
              </label>
              <textarea
                className="w-full flex-1 min-h-[200px] max-h-[300px] border border-border rounded-xl p-4 text-xs resize-y focus:outline-none focus:ring-2 focus:ring-primary bg-background/50 text-foreground placeholder:text-muted-foreground"
                placeholder="Paste the job description or target job role here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={analyzeResume}
            disabled={loading || uploading || !resumeText.trim() || !jobDescription.trim()}
            className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:scale-[1.01] hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none transition-all duration-300 rounded-xl font-bold flex items-center justify-center gap-2 text-sm shadow-md"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Analyzing ATS score...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Analyze Compatibility
              </>
            )}
          </button>
        </div>
      ) : (
        /* Results View */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Back button */}
          <div className="flex justify-between items-center pb-2 border-b border-border/40">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              ATS Analysis Report
            </h3>
            <button
              onClick={resetAnalyzer}
              className="text-xs font-semibold px-3 py-1.5 bg-muted hover:bg-muted-foreground/10 text-muted-foreground hover:text-foreground rounded-lg border border-border transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              New Analysis
            </button>
          </div>

          {/* Top Panel: Score Ring + Breakdown + Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Score Ring */}
            <div className="flex flex-col items-center justify-center p-6 bg-muted/30 border border-border rounded-2xl">
              <ScoreRing score={result.atsScore} />
              <div className="mt-4 text-center">
                <p className="text-sm font-bold text-foreground">
                  {result.atsScore >= 70
                    ? '✅ Good ATS compatibility'
                    : result.atsScore >= 40
                    ? '⚠️ Needs improvement'
                    : '❌ Poor ATS compatibility'}
                </p>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="p-6 bg-muted/30 border border-border rounded-2xl flex flex-col justify-center space-y-4">
              <h4 className="text-xs uppercase tracking-wider font-extrabold text-muted-foreground mb-1">
                Score Breakdown
              </h4>
              <ScoreBar label="Keyword Match" score={result.scoreBreakdown?.keywordMatch || 0} delay={0.1} />
              <ScoreBar label="Formatting" score={result.scoreBreakdown?.formatting || 0} delay={0.2} />
              <ScoreBar label="Experience Relevance" score={result.scoreBreakdown?.experienceRelevance || 0} delay={0.3} />
              <ScoreBar label="Skills Alignment" score={result.scoreBreakdown?.skillsAlignment || 0} delay={0.4} />
            </div>

            {/* Assessment Summary */}
            <div className="p-6 bg-muted/30 border border-border rounded-2xl flex flex-col justify-center">
              <h4 className="text-xs uppercase tracking-wider font-extrabold text-muted-foreground mb-2 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-primary" />
                Executive Summary
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {result.summary || 'Resume successfully scanned against target job description. Focus on addressing the missing keywords and priority suggestions below to maximize your interview conversion rate.'}
              </p>
            </div>
          </div>

          {/* Keywords Section: Matched vs Missing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Missing Keywords */}
            <div className="p-5 border border-border bg-card rounded-2xl flex flex-col">
              <h4 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2 pb-2 border-b border-border/40">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                ❌ Missing Keywords ({missingKeywords.length})
              </h4>
              {missingKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {missingKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="text-xs font-semibold px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg hover:scale-105 transition-transform"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">None identified. Excellent keyword matching!</p>
              )}
            </div>

            {/* Strengths / Matched Keywords */}
            <div className="p-5 border border-border bg-card rounded-2xl flex flex-col">
              <h4 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2 pb-2 border-b border-border/40">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                ✅ Strengths & Matches ({strengths.length})
              </h4>
              {strengths.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {strengths.map((st, i) => (
                    <span
                      key={i}
                      className="text-xs font-semibold px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-lg hover:scale-105 transition-transform"
                    >
                      {st}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">No explicit strengths listed. Check suggestions to improve.</p>
              )}
            </div>
          </div>

          {/* Actionable Suggestions */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              💡 Recommended Improvements ({improvementsList.length})
            </h4>
            {improvementsList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {improvementsList.map((item, idx) => (
                  <ImprovementCard key={idx} item={item} index={idx} />
                ))}
              </div>
            ) : (
              <div className="p-4 bg-muted/20 border border-border rounded-xl text-center text-xs text-muted-foreground">
                No major improvements recommended. Your resume is highly optimized!
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ATSAnalyzer
