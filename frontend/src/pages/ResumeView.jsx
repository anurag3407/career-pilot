import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import { resumeApi, enhanceApi } from '../services/api'
import Button from '../components/Button'
import Card from '../components/Card'
import { SkeletonResumeView } from '../components/ui/Skeleton'
import CustomSection from '../components/CustomSection'
import { sectionsToMarkdown } from '../components/customSectionUtils'
import { SkeletonList } from '../components/ui/Skeleton'
import ResumeVersions from '../components/ResumeVersions'
import AtsProgressChart from '../components/AtsProgressChart'
import { Loader2 } from 'lucide-react'

export default function ResumeView() {
  const { resumeId } = useParams()
  const navigate = useNavigate()

  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [activeTab, setActiveTab] = useState('preview') // 'preview' | 'versions' | 'ats'
  const [previewTab, setPreviewTab] = useState('enhanced') // 'enhanced' | 'original'
  const [scoreData, setScoreData] = useState(null)
  const [scoring, setScoring] = useState(false)
  const [scoringStep, setScoringStep] = useState(0)
  const [fontFamily, setFontFamily] = useState("Poppins")
  const [fontSize, setFontSize] = useState("Medium")

  useEffect(() => {
    let interval
    if (scoring) {
      interval = setInterval(() => {
        setScoringStep((prev) => (prev + 1) % 4)
      }, 2500)
    } else {
      setScoringStep(0)
    }
    return () => clearInterval(interval)
  }, [scoring])
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
        setPreviewTab('original')
      } else {
        setPreviewTab('enhanced')
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
      toast.success(
  `Exporting with ${fontFamily} font and ${fontSize} size`
)
      const blob = await resumeApi.downloadPdf(resumeId, previewTab)

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${resume?.title || 'resume'}_${previewTab}.pdf`
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
        previewTab === 'enhanced'
          ? resume?.enhancedText
          : resume?.originalText

      if (!resumeText || !resumeText.trim()) {
        toast.error('No resume text available to analyze.')
        return
      }

      const result = await enhanceApi.scoreResume(resumeText)

      if (!result.success) {
        throw new Error(result.message || 'Failed to analyze resume')
      }

      setScoreData(result.data)
      toast.success('Resume analyzed successfully!')

      // Log score to ATS history
      try {
        await resumeApi.logAtsHistory(resumeId, {
          jobRole: resume?.jobRole || 'Software Engineer',
          atsScore: result.data.overallScore,
          scoreBreakdown: {
            summary: result.data.sections?.summary?.score || 0,
            skills: result.data.sections?.skills?.score || 0,
            experience: result.data.sections?.experience?.score || 0,
            education: result.data.sections?.education?.score || 0,
            projects: result.data.sections?.projects?.score || 0
          },
          missingKeywords: [],
          improvementsCount: result.data.topSuggestions?.length || 0
        })
      } catch (historyErr) {
        console.error('Failed to log ATS score run:', historyErr)
      }
    } catch (error) {
      console.error('Resume analysis error:', error)

      if (error.message === 'Not authenticated') {
        toast.error('Session expired. Please log in again.')
      } else if (error.status === 429) {
        const retryMsg = error.retryAfter
          ? ` Try again in ${Math.ceil(error.retryAfter / 60)} minutes.`
          : ' Try again tomorrow.'
        toast.error(`Daily AI limit reached.${retryMsg}`)
      } else if (error.status === 401 || error.status === 403) {
        toast.error('Authentication error. Please log in again.')
      } else if (error.status >= 500) {
        toast.error('Analysis service temporarily unavailable. Please try again.')
      } else if (!navigator.onLine || error.message?.includes('Failed to fetch')) {
        toast.error('Network error. Check your connection and try again.')
      } else {
        toast.error(error.message || 'Failed to analyze resume. Please try again.')
      }
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
    return <SkeletonResumeView />
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
            <button
              onClick={() => setActiveTab('preview')}
              className={`pb-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${activeTab === 'preview'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
            >
              Resume Preview
            </button>
            <button
              onClick={() => setActiveTab('versions')}
              className={`pb-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${activeTab === 'versions'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
            >
              Versions & Snapshots
            </button>
            <button
              onClick={() => setActiveTab('ats')}
              className={`pb-4 text-sm font-semibold border-b-2 transition-all cursor-pointer ${activeTab === 'ats'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
            >
              ATS Progression
            </button>
          </nav>
        </div>

        {/* Content Tabs */}
        {activeTab === 'preview' && (
          <div className="space-y-6">
            <Card>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-foreground">
                    {previewTab === 'enhanced' ? 'AI-Enhanced Resume' : 'Original Resume'}
                  </h2>
                  {resume?.enhancedText && (
                    <div className="flex bg-muted rounded-xl p-0.5 border border-border">
                      <button
                        onClick={() => setPreviewTab('enhanced')}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                          previewTab === 'enhanced' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        AI Enhanced
                      </button>
                      <button
                        onClick={() => setPreviewTab('original')}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                          previewTab === 'original' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        Original
                      </button>
                    </div>
                  )}
                </div>
                <div className="mb-4 flex gap-4">
  <div>
    <label className="block text-sm mb-1">Font Family</label>
    <select
      value={fontFamily}
      onChange={(e) => setFontFamily(e.target.value)}
      className="border rounded px-2 py-1"
    >
      <option value="Poppins">Poppins</option>
      <option value="Arial">Arial</option>
      <option value="Times New Roman">Times New Roman</option>
    </select>
  </div>

  <div>
    <label className="block text-sm mb-1">Font Size</label>
    <select
      value={fontSize}
      onChange={(e) => setFontSize(e.target.value)}
      className="border rounded px-2 py-1"
    >
      <option value="Small">Small</option>
      <option value="Medium">Medium</option>
      <option value="Large">Large</option>
    </select>
  </div>
</div>
                <div className="flex gap-2 flex-wrap">
                 <Button
  variant="primary"
  onClick={handleDownloadPdf}
  disabled={downloading}
>
  {downloading ? (
    <div className="flex items-center gap-2">
      <Loader2 className="w-4 h-4 animate-spin" />
      Generating PDF...
    </div>
  ) : (
    'Download PDF'
  )}
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
                        previewTab === 'enhanced'
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
                          previewTab === 'enhanced'
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
                {previewTab === 'enhanced' && resume?.enhancedText ? (
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

            {/* Animated Scanner Loader during AI Scoring */}
            {scoring && (
              <Card className="mt-6 border-primary/20 bg-primary/5 relative overflow-hidden animate-pulse">
                <div className="flex flex-col items-center py-10 px-4">
                  {/* Animated Glowing ATS Radar Scanner */}
                  <div className="relative w-24 h-24 mb-6">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.8, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-primary/20"
                    />
                    <div className="absolute inset-2 rounded-full border-4 border-dashed border-primary/40 animate-spin" />
                    <div className="absolute inset-4 rounded-full border border-primary/60 flex items-center justify-center">
                      <svg className="w-8 h-8 text-primary animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-2">Analyzing Your Resume</h3>
                  
                  {/* Animated active scoring message */}
                  <motion.p
                    key={scoringStep}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-sm font-semibold text-primary tracking-wide text-center"
                  >
                    {scoringStep === 0 && "🤖 Initializing AI ATS parser..."}
                    {scoringStep === 1 && "🔍 Analyzing keyword relevance & density..."}
                    {scoringStep === 2 && "⚡ Measuring impact statements & formatting..."}
                    {scoringStep === 3 && "📈 Compiling score and suggestions..."}
                  </motion.p>
                  
                  <p className="text-xs text-muted-foreground mt-4 text-center max-w-sm">
                    This might take a few seconds as the AI evaluates your resume against industry benchmarks and formats custom suggestions.
                  </p>
                </div>
              </Card>
            )}

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

            {/* Custom Sections */}
            <Card className="mt-6">
              <CustomSection
                sections={customSections}
                onSectionsChange={handleSectionsChange}
              />
            </Card>
          </div>
        )}

        {activeTab === 'versions' && (
          <Card>
            <ResumeVersions
              resumeId={resumeId}
              currentOriginalText={resume?.originalText}
              currentEnhancedText={resume?.enhancedText}
              currentJobRole={resume?.jobRole}
              currentAtsScore={resume?.atsScore}
              onRestore={(updatedResume) => {
                setResume(updatedResume)
                if (!updatedResume.enhancedText) {
                  setPreviewTab('original')
                } else {
                  setPreviewTab('enhanced')
                }
                setActiveTab('preview')
              }}
            />
          </Card>
        )}

        {activeTab === 'ats' && (
          <Card>
            <AtsProgressChart resumeId={resumeId} />
          </Card>
        )}
      </div>
    </div>
  )
}
