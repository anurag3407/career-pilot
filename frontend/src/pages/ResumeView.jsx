import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import { resumeApi } from '../services/api'
import Button from '../components/Button'
import Card from '../components/Card'

export default function ResumeView() {
  const { resumeId } = useParams()
  const navigate = useNavigate()

  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [activeTab, setActiveTab] = useState('enhanced') // 'original' or 'enhanced'

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
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Loading resume...
          </div>
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
            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={handleDownloadPdf}
                disabled={downloading}
              >
                {downloading ? 'Downloading...' : 'Download PDF'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleCopy(
                  activeTab === 'enhanced'
                    ? resume?.enhancedText
                    : resume?.originalText
                )}
              >
                Copy to Clipboard
              </Button>
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
      </div>
    </div>
  )
}
