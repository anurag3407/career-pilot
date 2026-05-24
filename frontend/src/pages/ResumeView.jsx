import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import { resumeApi } from '../services/api'
import Button from '../components/Button'
import Card from '../components/Card'
import CustomSection, { sectionsToMarkdown } from '../components/CustomSection'
import { SkeletonList } from '../components/ui/Skeleton'

export default function ResumeView() {
  const { resumeId } = useParams()
  const navigate = useNavigate()

  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [activeTab, setActiveTab] = useState('enhanced') // 'original' or 'enhanced'
  const [scoreData, setScoreData] = useState({
  overallScore: 82,
  sections: {
    summary: {
      score: 80,
      feedback: "Strong professional summary"
    },
    skills: {
      score: 88,
      feedback: "Relevant technical skills"
    },
    experience: {
      score: 75,
      feedback: "Add more measurable achievements"
    },
    education: {
      score: 90,
      feedback: "Education section is well structured"
    },
    projects: {
      score: 78,
      feedback: "Projects could include impact metrics"
    }
  },
  topSuggestions: [
    "Add quantified achievements",
    "Improve project descriptions",
    "Use stronger action verbs"
  ]
})
  const [scoring, setScoring] = useState(false)
  // ── Custom sections – persisted per-resume in localStorage ───────────────
  const STORAGE_KEY = `resume_custom_sections_${resumeId}`
  const [customSections, setCustomSections] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const handleSectionsChange = (sections) => {
    setCustomSections(sections)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sections))
    } catch {
      // storage quota exceeded – silently ignore
    }
  }

  useEffect(() => {
    fetchResume()
  }, [resumeId])

  const fetchResume = async () => {
    try {
      const response = await resumeApi.getById(resumeId)
      setResume(response.data)

      // Set default tab based on available content
      if (!response.data.enhancedText) {
        setActiveTab('original')
      }
    } catch (error) {
      toast.error('Failed to load resume')
      navigate('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard!')
    } catch (error) {
      console.error('Clipboard copy failed:', error)
      toast.error('Failed to copy to clipboard')
    }
  }

  const handleDownloadPdf = async () => {
    try {
      setDownloading(true)
      const blob = await resumeApi.downloadPdf(resumeId, activeTab)

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${resume?.title || 'resume'}_${activeTab}.pdf`
      document.body.appendChild(a)
      a.click()

      // Cleanup
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('PDF downloaded successfully!')
    } catch (error) {
      toast.error(error.message || 'Failed to download PDF')
    } finally {
      setDownloading(false)
    }
  }

  const handleAnalyzeResume = async () => {
  try {
    setScoring(true)

    const resumeText =
      activeTab === 'enhanced'
        ? resume?.enhancedText
        : resume?.originalText

    const response = await fetch(
      'http://localhost:5000/api/resumes/score',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeText }),
      }
    )

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.message || 'Failed to analyze resume')
    }

    setScoreData(data.data)
    toast.success('Resume analyzed successfully!')
  } catch (error) {
    console.error(error)
    toast.error('Failed to analyze resume')
  } finally {
    setScoring(false)
  }
}

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Header Skeleton */}
            <div className="flex items-start justify-between mb-8">
              <div className="space-y-2">
                <div className="h-8 bg-muted rounded-lg w-1/2 animate-pulse" />
                <div className="h-4 bg-muted rounded-lg w-1/3 animate-pulse" />
              </div>
              <div className="h-10 bg-muted rounded-lg w-32 animate-pulse" />
            </div>

            {/* Tabs Skeleton */}
            <div className="flex gap-4 border-b border-border">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-10 bg-muted rounded w-24 animate-pulse" />
              ))}
            </div>

            {/* Content Skeleton */}
            <SkeletonList count={5} />
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{resume?.title}</h1>
            <p className="text-muted-foreground">
              {resume?.jobRole && `Target: ${resume.jobRole}`}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Last modified: {formatDate(resume?.lastModified || resume?.createdAt)}
            </p>
          </div>
          <div className="flex gap-2">
            <Link to={`/enhance/${resumeId}`}>
              <Button variant="primary">
                {resume?.enhancedText ? 'Re-enhance' : 'Enhance'}
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-border mb-6">
          <nav className="flex gap-8">
            {resume?.enhancedText && (
              <button
                onClick={() => setActiveTab('enhanced')}
                className={`pb-4 text-sm font-medium border-b-2 transition-colors cursor-pointer ${activeTab === 'enhanced'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
              >
                Enhanced Version
              </button>
            )}
            <button
              onClick={() => setActiveTab('original')}
              className={`pb-4 text-sm font-medium border-b-2 transition-colors cursor-pointer ${activeTab === 'original'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
            >
              Original Version
            </button>
          </nav>
        </div>

        {/* Content */}
        <Card>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h2 className="text-lg font-medium text-foreground">
              {activeTab === 'enhanced' ? 'AI-Enhanced Resume' : 'Original Resume'}
            </h2>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="primary"
                onClick={handleDownloadPdf}
                disabled={downloading}
              >
                {downloading ? 'Downloading...' : 'Download PDF'}
              </Button>
              <Button
                variant="primary"
                onClick={handleAnalyzeResume}
                disabled={scoring}
              >
            {scoring ? 'Analyzing...' : 'Analyze Resume'}
              </Button>
              <Button
                variant="secondary"
                onClick={() =>
                  handleCopy(
                    activeTab === 'enhanced'
                      ? resume?.enhancedText
                      : resume?.originalText,
                  )
                }
              >
                Copy to Clipboard
              </Button>
              {customSections.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    const base =
                      activeTab === 'enhanced'
                        ? resume?.enhancedText
                        : resume?.originalText
                    handleCopy((base || '') + '\n\n' + sectionsToMarkdown(customSections))
                  }}
                >
                  Copy with Custom Sections
                </Button>
              )}
            </div>
          </div>

          <div className="bg-card border border-border/40 rounded-lg p-6 min-h-96 overflow-auto shadow-lg" style={{ maxWidth: '210mm', margin: '0 auto' }}>
            {activeTab === 'enhanced' && resume?.enhancedText ? (
              <div className="resume-preview max-w-none text-foreground text-sm leading-tight">
                <ReactMarkdown
                  components={{
                    h1: ({ node, ...props }) => (
                      <div className="text-foreground text-center py-2 px-4 mb-1 text-2xl font-bold border-b-2 border-black">
                        {props.children}
                      </div>
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className="text-xs font-bold text-foreground border-b border-black pb-0.5 mt-3 mb-1 uppercase tracking-wide">
                        {props.children}
                      </h2>
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 className="text-xs font-bold text-foreground mt-1.5 mb-0.5">
                        {props.children}
                      </h3>
                    ),
                    p: ({ node, ...props }) => (
                      <p className="text-xs text-foreground mb-0.5 leading-snug">
                        {props.children}
                      </p>
                    ),
                    ul: ({ node, ...props }) => (
                      <ul className="list-none pl-0 space-y-0 mb-1">
                        {props.children}
                      </ul>
                    ),
                    li: ({ node, ...props }) => (
                      <li className="text-xs text-foreground flex items-start gap-1 leading-snug">
                        <span className="text-muted-foreground">◦</span>
                        <span>{props.children}</span>
                      </li>
                    ),
                    strong: ({ node, ...props }) => (
                      <strong className="font-bold text-foreground">
                        {props.children}
                      </strong>
                    ),
                    em: ({ node, ...props }) => (
                      <em className="text-muted-foreground text-xs font-normal">
                        {props.children}
                      </em>
                    ),
                    hr: () => null,
                    a: ({ node, ...props }) => (
                      <a className="text-blue-600 hover:underline text-xs" href={props.href} target="_blank" rel="noopener noreferrer">
                        {props.children}
                      </a>
                    ),
                  }}
                >
                  {resume.enhancedText}
                </ReactMarkdown>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap text-xs text-foreground/80 font-mono">
                {resume?.originalText}
              </pre>
            )}
          </div>
        </Card>
      {scoreData && (
  <Card className="mt-6">
    <h3 className="text-2xl font-bold mb-6">
      Resume Analysis
    </h3>

    <div className="flex flex-col items-center mb-8">
      <div className="w-32 h-32 rounded-full border-8 border-primary flex items-center justify-center text-3xl font-bold">
        {scoreData.overallScore}
      </div>

      <p className="mt-3 text-muted-foreground">
        Overall Resume Score
      </p>
    </div>

    <div className="space-y-4">
      {Object.entries(scoreData.sections).map(([section, value]) => (
        <div key={section}>
          <div className="flex justify-between mb-1">
            <span className="capitalize font-medium">
              {section}
            </span>
            <span>{value.score}/100</span>
          </div>

          <div className="w-full bg-muted rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full"
              style={{ width: `${value.score}%` }}
            />
          </div>

          <p className="text-sm text-muted-foreground mt-1">
            {value.feedback}
          </p>
        </div>
      ))}
    </div>

    <div className="mt-8">
      <h4 className="font-semibold mb-3">
        Top Suggestions
      </h4>

      <ul className="space-y-2">
        {scoreData.topSuggestions.map((tip, index) => (
          <li
            key={index}
            className="bg-muted p-3 rounded-lg"
          >
            • {tip}
          </li>
        ))}
      </ul>
    </div>
  </Card>
)}
        {/* Metadata */}
        {resume?.preferences && Object.keys(resume.preferences).length > 0 && (
          <Card className="mt-6">
            <h3 className="text-lg font-medium text-foreground mb-4">Enhancement Settings Used</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              {resume.jobRole && (
                <div>
                  <span className="text-muted-foreground">Target Role:</span>
                  <span className="ml-2 text-foreground">{resume.jobRole}</span>
                </div>
              )}
              {resume.preferences.yearsOfExperience && (
                <div>
                  <span className="text-muted-foreground">Experience:</span>
                  <span className="ml-2 text-foreground">
                    {resume.preferences.yearsOfExperience} years
                  </span>
                </div>
              )}
              {resume.preferences.skills?.length > 0 && (
                <div className="sm:col-span-2">
                  <span className="text-muted-foreground">Skills:</span>
                  <span className="ml-2 text-foreground">
                    {resume.preferences.skills.join(', ')}
                  </span>
                </div>
              )}
              {resume.preferences.industry && (
                <div>
                  <span className="text-muted-foreground">Industry:</span>
                  <span className="ml-2 text-foreground">{resume.preferences.industry}</span>
                </div>
              )}
              {resume.preferences.profileInfo && (
                <div className="sm:col-span-2 pt-2 border-t border-border">
                  <span className="text-muted-foreground block mb-2">Profile Links:</span>
                  <div className="flex flex-wrap gap-3">
                    {resume.preferences.profileInfo.linkedinUrl && (
                      <a href={resume.preferences.profileInfo.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 text-xs">
                        LinkedIn ↗
                      </a>
                    )}
                    {resume.preferences.profileInfo.githubUrl && (
                      <a href={resume.preferences.profileInfo.githubUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 text-xs">
                        GitHub ↗
                      </a>
                    )}
                    {resume.preferences.profileInfo.portfolioUrl && (
                      <a href={resume.preferences.profileInfo.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 text-xs">
                        Portfolio ↗
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* ── Custom Sections ─────────────────────────────────────────────── */}
        <Card className="mt-6">
          <CustomSection
            sections={customSections}
            onSectionsChange={handleSectionsChange}
          />
        </Card>
      </div>
    </div>
  )
}
