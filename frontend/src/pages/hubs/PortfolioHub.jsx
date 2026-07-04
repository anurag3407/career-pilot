import { useState, useRef, useEffect } from 'react'
import {
  Globe,
  Rocket,
  LayoutTemplate,
  Github,
  Upload,
  Loader2,
  MoreVertical,
  Copy,
} from 'lucide-react'
import { portfolioApi, uploadApi } from '../../services/api'
import HubLayout from '../../components/HubLayout'
import ToolCard from '../../components/ToolCard'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

export default function PortfolioHub() {
  const [portfolios, setPortfolios] = useState([])
  const [loading, setLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [recommendedTheme, setRecommendedTheme] = useState('')
  const [themeInsights, setThemeInsights] = useState([])
  const [menuOpen, setMenuOpen] = useState(null)
  const [duplicating, setDuplicating] = useState(null)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const draft = localStorage.getItem('ai_portfolio_draft')
    if (!draft) return
    const data = JSON.parse(draft)
    let theme = 'Modern'
    let insights = []
    const role = data.role || data.profession || ''
    if (role.toLowerCase().includes('developer')) {
      theme = 'Developer Pro'
      insights = ['Best for software engineers', 'Highlights GitHub projects', 'Technical skill focused']
    } else if (role.toLowerCase().includes('designer')) {
      theme = 'Creative Portfolio'
      insights = ['Visual-first layout', 'Showcases design work', 'Modern gallery sections']
    } else if (role.toLowerCase().includes('marketing')) {
      theme = 'Business Elite'
      insights = ['Professional presentation', 'Case study focused', 'Client-ready structure']
    }
    setRecommendedTheme(theme)
    setThemeInsights(insights)
  }, [])

  useEffect(() => {
    fetchPortfolios()
  }, [])

  const fetchPortfolios = async () => {
    try {
      const res = await portfolioApi.getAll()
      const items = res.portfolios || res.data?.portfolios || res.data || []
      setPortfolios(items)
    } catch (err) {
      console.error('Failed to fetch portfolios in PortfolioHub', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDuplicate = async (slug) => {
    setMenuOpen(null)
    setDuplicating(slug)
    try {
      await portfolioApi.duplicate(slug)
      await fetchPortfolios()
    } catch (err) {
      console.error('Failed to duplicate portfolio', err)
    } finally {
      setDuplicating(null)
    }
  }

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
      if (!text) throw new Error('Could not extract text from the PDF.')
      toast.loading('AI is building your portfolio data...', { id: loadingToast })
      const extractRes = await portfolioApi.extractFromResume(text)
      const portfolioData = extractRes.data
      localStorage.setItem('ai_portfolio_draft', JSON.stringify(portfolioData))
      toast.success('Resume parsed successfully!', { id: loadingToast })
      navigate('/templates')
    } catch (err) {
      console.error('Upload error:', err)
      toast.error(err.message || 'Failed to process resume.', { id: loadingToast })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const stats = [
    { icon: Globe, value: portfolios.length, label: 'Active Projects', color: 'text-primary', bg: 'bg-primary/10' },
  ]

  return (
    <HubLayout
      icon={Globe}
      title="Portfolio Builder"
      description="Create, customize, and deploy a stunning developer portfolio. Sync with GitHub and publish to high-performance servers."
      color="primary"
      breadcrumb="Portfolio Builder"
      stats={loading ? [] : stats}
    >
      <div className="col-span-full mb-6">
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`relative overflow-hidden rounded-2xl border-2 border-dashed ${isUploading ? 'border-primary/50 bg-primary/5' : 'border-primary/30 hover:border-primary bg-card hover:bg-primary/5'} transition-all cursor-pointer p-8 text-center group`}
        >
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf" className="hidden" />
          <div className="flex flex-col items-center justify-center space-y-4 relative z-10">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              {isUploading ? <Loader2 className="w-8 h-8 text-primary animate-spin" /> : <Upload className="w-8 h-8 text-primary" />}
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {isUploading ? 'Analyzing Resume...' : 'Upload Resume to Auto-Build'}
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {isUploading ? 'Our AI is extracting your experience, skills, and projects.' : 'Upload your PDF resume and our AI will auto-populate your portfolio.'}
              </p>
            </div>
          </div>
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors pointer-events-none" />
        </div>
      </div>

      {recommendedTheme && (
        <div className="col-span-full mb-6">
          <div className="p-6 rounded-2xl border border-border bg-card">
            <h2 className="text-xl font-bold mb-2">Recommended Theme</h2>
            <p className="text-muted-foreground mb-4">Based on your profession and portfolio content.</p>
            <div className="inline-flex px-4 py-2 rounded-full bg-primary/10 text-primary font-medium">{recommendedTheme}</div>
            <div className="mt-4 space-y-2">
              {themeInsights.map((item, index) => (
                <div key={index} className="text-sm text-muted-foreground">✓ {item}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      <ToolCard to="/templates" icon={LayoutTemplate} title="Portfolio Templates" description="Choose from curated premium developer templates. Fully responsive and customizable." color="primary" />
      <ToolCard to="/github-dashboard" icon={Github} title="GitHub Dashboard" description="Connect your repositories, track stats, and manage synced showcase items." color="secondary" />
      <ToolCard to="/deployments" icon={Rocket} title="Deploy Portfolio" description="Deploy and manage active production websites on Cloudflare or GitHub Pages." color="emerald-500" />

      {!loading && portfolios.length > 0 && (
        <div className="col-span-full mt-6">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 rounded-full bg-secondary" />
            My Portfolios
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolios.map((portfolio, idx) => {
              const slug = portfolio.slug ?? portfolio.id ?? null
              const cardKey = slug ?? `portfolio-${idx}`
              const isDuplicating = slug !== null && duplicating === slug
              return (
                <motion.div
                  key={cardKey}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all group relative overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex items-center gap-2">
                      {portfolio.deployStatus !== 'draft' && (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          Live
                        </span>
                      )}
                      <div className="relative">
                        <button
                          onClick={() => setMenuOpen(menuOpen === slug ? null : slug)}
                          className="p-1 rounded-lg hover:bg-muted transition-colors"
                          aria-label="Portfolio options"
                        >
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <AnimatePresence>
                          {menuOpen === slug && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -4 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -4 }}
                              transition={{ duration: 0.1 }}
                              className="absolute right-0 top-8 z-20 w-40 rounded-xl bg-popover border border-border shadow-lg overflow-hidden"
                            >
                              <button
                                onClick={() => slug && handleDuplicate(slug)}
                                disabled={!slug || isDuplicating}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                              >
                                <Copy className="w-4 h-4" />
                                Duplicate
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-bold text-foreground mb-1 truncate">
                    {portfolio.title || portfolio.name || 'Personal Portfolio'}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4 truncate font-medium">
                    Theme: {portfolio.theme || 'Modern'}
                  </p>
                  <div className="flex items-center gap-2">
                    {isDuplicating ? (
                      <div className="flex-1 flex items-center justify-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg bg-muted text-muted-foreground">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Duplicating...
                      </div>
                    ) : portfolio.deployStatus === 'draft' ? (
                      <span className="flex-1 text-center text-xs font-semibold px-3 py-2 rounded-lg bg-muted text-muted-foreground">
                        Draft
                      </span>
                    ) : (
                      
                        href={portfolio.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center text-xs font-semibold px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors inline-flex items-center justify-center gap-1.5"
                      >
                        Visit Site
                        <Globe className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
      )}
    </HubLayout>
  )
}
