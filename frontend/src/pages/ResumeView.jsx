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
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [activeTab, setActiveTab] = useState('enhanced')

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
      console.log('Storage issue')
    }
  }

  useEffect(() => {
    fetchResume()
  }, [resumeId])

  const fetchResume = async () => {
    try {
      const response = await resumeApi.getById(resumeId)

      setResume(response.data)

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
      toast.error('Failed to copy')
    }
  }

  const handleDownloadPdf = async () => {
    try {
      setDownloading(true)

      const blob = await resumeApi.downloadPdf(
        resumeId,
        activeTab
      )

      const url = window.URL.createObjectURL(blob)

      const a = document.createElement('a')

      a.href = url
      a.download = `${resume?.title || 'resume'}_${activeTab}.pdf`

      document.body.appendChild(a)
      a.click()

      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('PDF downloaded successfully!')

    } catch (error) {
      toast.error(error.message || 'Failed to download PDF')

    } finally {
      setDownloading(false)
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <SkeletonList count={5} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">

          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {resume?.title}
            </h1>

            <p className="text-muted-foreground">
              {resume?.jobRole && `Target: ${resume.jobRole}`}
            </p>

            <p className="text-sm text-muted-foreground mt-1">
              Last modified:
              {' '}
              {formatDate(
                resume?.lastModified || resume?.createdAt
              )}
            </p>
          </div>

          <div className="flex flex-wrap w-full lg:w-auto gap-3">

            <Link to={`/enhance/${resumeId}`}>
              <Button
                variant="primary"
                className="w-full sm:w-auto rounded-xl px-5 py-3 font-semibold shadow-md hover:scale-[1.02] transition-all duration-300"
              >
                {resume?.enhancedText
                  ? 'Re-enhance'
                  : 'Enhance'}
              </Button>
            </Link>

            <Link to="/dashboard">
              <Button
                variant="outline"
                className="w-full sm:w-auto rounded-xl px-5 py-3 font-semibold"
              >
                Back to Dashboard
              </Button>
            </Link>

          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border mb-6">

          <nav className="flex flex-wrap gap-4 sm:gap-8 overflow-x-auto scrollbar-hide">

            {resume?.enhancedText && (
              <button
                onClick={() => setActiveTab('enhanced')}
                className={`pb-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'enhanced'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                Enhanced Version
              </button>
            )}

            <button
              onClick={() => setActiveTab('original')}
              className={`pb-4 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'original'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Original Version
            </button>

          </nav>
        </div>

        {/* Resume Content */}
        <Card className="rounded-2xl shadow-xl">

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 mb-6">

            <h2 className="text-xl font-semibold text-foreground">
              {activeTab === 'enhanced'
                ? 'AI-Enhanced Resume'
                : 'Original Resume'}
            </h2>

            <div className="flex flex-wrap gap-3 w-full lg:w-auto">

              <Button
                variant="primary"
                onClick={handleDownloadPdf}
                disabled={downloading}
                className="w-full sm:w-auto rounded-xl shadow-md"
              >
                {downloading
                  ? 'Downloading...'
                  : 'Download PDF'}
              </Button>

              <Button
                variant="secondary"
                className="w-full sm:w-auto rounded-xl"
                onClick={() =>
                  handleCopy(
                    activeTab === 'enhanced'
                      ? resume?.enhancedText
                      : resume?.originalText
                  )
                }
              >
                Copy to Clipboard
              </Button>

              {customSections.length > 0 && (
                <Button
                  variant="outline"
                  className="w-full sm:w-auto rounded-xl"
                  onClick={() => {
                    const base =
                      activeTab === 'enhanced'
                        ? resume?.enhancedText
                        : resume?.originalText

                    handleCopy(
                      (base || '') +
                      '\n\n' +
                      sectionsToMarkdown(customSections)
                    )
                  }}
                >
                  Copy with Custom Sections
                </Button>
              )}

            </div>
          </div>

          {/* Resume Preview */}
          <div
            className="bg-card border border-border/40 rounded-2xl p-4 sm:p-6 min-h-[500px] overflow-auto shadow-2xl transition-all duration-300"
            style={{
              maxWidth: '210mm',
              margin: '0 auto'
            }}
          >

            {activeTab === 'enhanced' &&
            resume?.enhancedText ? (

              <div className="resume-preview max-w-none text-foreground text-sm sm:text-base leading-relaxed">

                <ReactMarkdown>
                  {resume.enhancedText}
                </ReactMarkdown>

              </div>

            ) : (

              <pre className="whitespace-pre-wrap text-sm text-foreground/80 font-mono">
                {resume?.originalText}
              </pre>

            )}

          </div>
        </Card>

        {/* Metadata */}
        {resume?.preferences &&
          Object.keys(resume.preferences).length > 0 && (

          <Card className="mt-6 rounded-2xl shadow-lg">

            <h3 className="text-xl font-semibold text-foreground mb-5">
              Enhancement Settings Used
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">

              {resume.jobRole && (
                <div>
                  <span className="text-muted-foreground">
                    Target Role:
                  </span>

                  <span className="ml-2 text-foreground">
                    {resume.jobRole}
                  </span>
                </div>
              )}

              {resume.preferences.yearsOfExperience && (
                <div>
                  <span className="text-muted-foreground">
                    Experience:
                  </span>

                  <span className="ml-2 text-foreground">
                    {resume.preferences.yearsOfExperience} years
                  </span>
                </div>
              )}

            </div>
          </Card>
        )}

        {/* Custom Sections */}
        <Card className="mt-6 rounded-2xl shadow-lg">

          <CustomSection
            sections={customSections}
            onSectionsChange={handleSectionsChange}
          />

        </Card>

      </div>
    </div>
  )
}