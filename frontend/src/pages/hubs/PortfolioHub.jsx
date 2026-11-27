import { useState, useRef, useEffect } from 'react'
import { Globe, Rocket, LayoutTemplate, Github, Upload, Loader2, Check, ExternalLink } from 'lucide-react'
import { portfolioApi, uploadApi } from '../../services/api'
import HubLayout from '../../components/HubLayout'
import ToolCard from '../../components/ToolCard'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function PortfolioHub() {
  const [portfolios, setPortfolios] = useState([])
  const [loading, setLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [recommendedTheme, setRecommendedTheme] = useState('')
  const [themeInsights, setThemeInsights] = useState([])
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    try {
      const draft = localStorage.getItem('ai_portfolio_draft')
      if (!draft) return
      const data = JSON.parse(draft)
      const role = (data.role || data.profession || '').toLowerCase()

      if (role.includes('developer') || role.includes('engineer')) {
        setRecommendedTheme('Developer Pro')
        setThemeInsights(['Best for software engineers', 'Highlights GitHub projects', 'Technical skill structure'])
      } else if (role.includes('designer')) {
        setRecommendedTheme('Creative Portfolio')
        setThemeInsights(['Visual-first layout', 'Showcases design case studies', 'Modern gallery sections'])
      } else if (role.includes('marketing')) {
        setRecommendedTheme('Business Elite')
        setThemeInsights(['Executive presentation', 'Case study focused', 'Client-ready structure'])
      } else {
        setRecommendedTheme('Modern')
        setThemeInsights(['Clean editorial structure', 'Balanced experience & projects', 'Mobile responsive'])
      }
    } catch {
      // Ignore malformed draft
    }
  }, [])

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const res = await portfolioApi.getAll()
        const items = res.portfolios || res.data?.portfolios || res.data || []
        setPortfolios(Array.isArray(items) ? items : [])
      } catch (err) {
        console.error('Failed to fetch portfolios in PortfolioHub', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPortfolios()
  }, [])

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file.')
      return
    }

    setIsUploading(true)
    const loadingToast = toast.loading('Extracting data from resume...')

    try {
      const uploadRes = await uploadApi.uploadPdf(file)
      const text = uploadRes.data?.extractedText || uploadRes.extractedText

      if (!text) {
        throw new Error('Could not extract text from the PDF.')
      }

      toast.loading('Structuring portfolio data...', { id: loadingToast })
      const extractRes = await portfolioApi.extractFromResume(text)
      const portfolioData = extractRes.data

      localStorage.setItem('ai_portfolio_draft', JSON.stringify(portfolioData))
      toast.success('Resume parsed. Pick a theme to continue.', { id: loadingToast })
      navigate('/templates')
    } catch (err) {
      console.error('Upload error:', err)
      toast.error(err.message || 'Failed to process resume.', { id: loadingToast })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const liveCount = portfolios.filter((p) => Boolean(p.deployedUrl || p.url)).length

  const stats = [
    { icon: Globe, value: portfolios.length, label: 'Projects', color: 'text-primary', bg: 'bg-primary/10' },
    { icon: Rocket, value: liveCount, label: 'Live sites', color: 'text-accent-foreground', bg: 'bg-accent' },
  ]

  return (
    <HubLayout
      icon={Globe}
      title="Portfolio Studio & Sites"
      description="Turn your resume or GitHub repositories into a live developer portfolio, customize layouts in the studio, and publish to edge hosting."
      color="primary"
      suite="04 Presence & Network"
      breadcrumb="Portfolio Studio"
      stats={loading ? [] : stats}
      actions={
        <Link
          to="/portfolio-builder/studio"
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3.5 text-xs font-semibold text-primary-foreground transition hover:brightness-110"
        >
          Open studio
        </Link>
      }
    >
      {/* Resume Auto-Build Dropzone */}
      <div className="col-span-full mb-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".pdf"
          className="hidden"
          aria-label="Upload PDF resume to auto-build portfolio"
        />
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full rounded-xl border-2 border-dashed p-7 text-center transition-colors cursor-pointer ${
            isUploading
              ? 'border-primary/50 bg-primary/5'
              : 'border-border bg-card hover:border-primary/50 hover:bg-background'
          }`}
        >
          <div className="mx-auto flex max-w-md flex-col items-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
              ) : (
                <Upload className="h-6 w-6" aria-hidden="true" />
              )}
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">
                {isUploading ? 'Analyzing resume...' : 'Auto-build portfolio from PDF resume'}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {isUploading
                  ? 'Extracting experience, skills, and projects into a portfolio draft.'
                  : 'Upload your PDF resume to auto-populate a draft and preview matching themes.'}
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Recommended Theme from Draft */}
      {recommendedTheme && (
        <div className="col-span-full rounded-xl border border-primary/25 bg-card p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                Draft detected
              </p>
              <h2 className="mt-1 text-base font-semibold text-foreground">
                Recommended theme: {recommendedTheme}
              </h2>
              <ul className="mt-2 flex flex-wrap gap-3">
                {themeInsights.map((item) => (
                  <li key={item} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Check className="h-3.5 w-3.5 text-accent-foreground" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to="/templates"
              className="inline-flex h-9 shrink-0 items-center justify-center rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground transition hover:brightness-110"
            >
              Preview themes
            </Link>
          </div>
        </div>
      )}

      <ToolCard
        to="/portfolio-builder/studio"
        icon={Globe}
        title="Portfolio Studio"
        description="Edit sections, typography, and projects live with real-time desktop and mobile preview."
        color="primary"
      />
      <ToolCard
        to="/templates"
        icon={LayoutTemplate}
        title="Theme Gallery"
        description="Explore 50+ responsive portfolio themes with live previews before deploying."
        color="secondary"
      />
      <ToolCard
        to="/github-portfolio/build"
        icon={Github}
        title="GitHub Portfolio Builder"
        description="Select your strongest repositories and let AI write project summaries and hero copy."
        color="foreground"
      />
      <ToolCard
        to="/deployments"
        icon={Rocket}
        title="Live Deployments"
        description="View published URLs, manage hosting status, and verify live portfolio builds."
        color="emerald"
      />

      {/* Saved / Deployed Portfolios */}
      {!loading && portfolios.length > 0 && (
        <div className="col-span-full mt-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">My portfolios</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {portfolios.map((portfolio, idx) => {
              const liveUrl = portfolio.deployedUrl || portfolio.url
              const pid = portfolio.id || portfolio._id || idx
              return (
                <div
                  key={pid}
                  className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/35"
                >
                  <div>
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Globe className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <span
                        className={`rounded-md border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${
                          liveUrl
                            ? 'border-accent-foreground/25 bg-accent text-accent-foreground'
                            : 'border-border bg-muted text-muted-foreground'
                        }`}
                      >
                        {liveUrl ? 'Live' : 'Draft'}
                      </span>
                    </div>
                    <h3 className="truncate text-[15px] font-semibold text-foreground">
                      {portfolio.projectName || portfolio.title || portfolio.name || 'Personal Portfolio'}
                    </h3>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      Theme: {portfolio.theme || 'Modern'}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-border pt-3">
                    {liveUrl ? (
                      <a
                        href={liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
                      >
                        Visit live site
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    ) : (
                      <Link
                        to="/portfolio-builder/studio"
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/40"
                      >
                        Continue in studio
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </HubLayout>
  )
}
