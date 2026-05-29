import { useState, useEffect, useRef, useCallback } from 'react'
import { Globe, Rocket, LayoutTemplate, Github, Upload, Settings } from 'lucide-react'
import { portfolioApi } from '../../services/api'
import HubLayout from '../../components/HubLayout'
import ToolCard from '../../components/ToolCard'
import EmptyPortfolioState from '../../components/portfolio/EmptyPortfolioState'
import PortfolioSettings from '../../components/portfolio/PortfolioSettings'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const MotionDiv = motion.div

export default function PortfolioHub() {
  const [portfolios, setPortfolios] = useState([])
  const [loading, setLoading] = useState(true)
  const [importing, setImporting] = useState(false)
  const [settingsPortfolio, setSettingsPortfolio] = useState(null)
  const fileInputRef = useRef(null)

  const fetchPortfolios = useCallback(async () => {
    try {
      const res = await portfolioApi.getAll()
      const items = res.portfolios || res.data?.portfolios || res.data || []
      setPortfolios(items)
    } catch (err) {
      console.error('Failed to fetch portfolios in PortfolioHub', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPortfolios()
  }, [fetchPortfolios])

  const handleImportClick = () => {
    if (importing) return
    fileInputRef.current?.click()
  }

  const handleImportFile = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    if (!file.name.toLowerCase().endsWith('.json') && file.type !== 'application/json') {
      toast.error('Choose a JSON portfolio file')
      return
    }

    try {
      setImporting(true)
      const result = await portfolioApi.importJson(file)
      const imported = result.data
      toast.success(`Imported ${imported?.slug || 'portfolio'}`)
      await fetchPortfolios()
    } catch (err) {
      toast.error(err.message || 'Failed to import portfolio')
    } finally {
      setImporting(false)
    }
  }

  const handleSaveSettings = async (settings) => {
    await portfolioApi.updateSettings(settingsPortfolio.slug, settings)
    await fetchPortfolios()
    setSettingsPortfolio(null)
  }

  const handleDeletePortfolio = async (portfolio) => {
    await portfolioApi.delete(portfolio.slug)
    await fetchPortfolios()
    setSettingsPortfolio(null)
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
      <ToolCard
        to="/templates"
        icon={LayoutTemplate}
        title="Portfolio Templates"
        description="Choose from curated premium developer templates. Fully responsive and customizable."
        color="primary"
      />
      <ToolCard
        to="/github-dashboard"
        icon={Github}
        title="GitHub Dashboard"
        description="Connect your repositories, track stats, and manage synced showcase items."
        color="secondary"
      />
      <ToolCard
        to="/deployments"
        icon={Rocket}
        title="Deploy Portfolio"
        description="Deploy and manage active production websites on Cloudflare or GitHub Pages."
        color="emerald-500"
      />
      <ToolCard
        icon={Upload}
        title={importing ? 'Importing JSON' : 'Import JSON'}
        description="Upload a validated portfolio JSON file and add it to your workspace."
        color="amber-500"
        onClick={handleImportClick}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={handleImportFile}
      />

      {/* Showcase list or placeholder */}
      {!loading && portfolios.length === 0 && (
        <div className="col-span-full mt-6">
          <EmptyPortfolioState />
        </div>
      )}

      {!loading && portfolios.length > 0 && (
        <div className="col-span-full mt-6">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 rounded-full bg-secondary" />
            My Deployed Portfolios
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {portfolios.map((portfolio, idx) => (
              <MotionDiv
                key={portfolio.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all group relative overflow-hidden"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Live
                  </span>
                </div>
                <h3 className="font-bold text-foreground mb-1 truncate">
                  {portfolio.title || portfolio.name || 'Personal Portfolio'}
                </h3>
                <p className="text-xs text-muted-foreground mb-4 truncate font-medium">
                  Theme: {portfolio.theme || 'Modern'}
                </p>
                <div className="flex items-center gap-2">
                  <a
                    href={portfolio.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center text-xs font-semibold px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors inline-flex items-center justify-center gap-1.5"
                  >
                    Visit Site
                    <Globe className="w-3 h-3" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setSettingsPortfolio(portfolio)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                    aria-label={`Open settings for ${portfolio.slug}`}
                    title="Portfolio settings"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </MotionDiv>
            ))}
          </div>
        </div>
      )}

      {settingsPortfolio && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-background/80 px-4 py-6 backdrop-blur-sm">
          <div className="mx-auto max-w-5xl">
            <div className="mb-4 flex items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4">
              <div>
                <h2 className="text-lg font-black text-foreground">Portfolio Settings</h2>
                <p className="text-sm text-muted-foreground">{settingsPortfolio.slug}</p>
              </div>
              <button
                type="button"
                onClick={() => setSettingsPortfolio(null)}
                className="rounded-xl px-4 py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Close
              </button>
            </div>
            <PortfolioSettings
              portfolio={settingsPortfolio}
              existingSlugs={portfolios
                .map((portfolio) => portfolio.slug)
                .filter((slug) => slug && slug !== settingsPortfolio.slug)}
              onSave={handleSaveSettings}
              onDelete={handleDeletePortfolio}
            />
          </div>
        </div>
      )}
    </HubLayout>
  )
}
