import { useEffect, useMemo, useRef, useState, Suspense, lazy } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft, Download, Loader2, FileText, Sparkles, RefreshCw, FileType2,
  Search, Filter, X, Camera, Upload as UploadIcon,
} from 'lucide-react'

import {
  resumeTemplates,
  COLOR_SWATCHES, FONT_PAIRINGS,
  CATEGORIES, INDUSTRIES, LAYOUTS,
  ACCENT_PRESETS, GALLERY,
} from '../data/resumeTemplates'
import { useAuth } from '../hooks/useAuth'
import { resumeApi } from '../services/api'
import { buildResumeDocx, downloadDocxBlob } from '../utils/docxExport'
import { exportAtsSafePdf } from '../services/atsPdfExport'
import {
  ResumeProvider,
  normalizeResumeData,
} from '../context/ResumeContext'
import LayoutControls, { DEFAULT_LAYOUT } from '../components/resume/LayoutControls'

// ─── Lazy template loader (matches portfolio template gallery pattern) ────────
// Only base templates have folder components; variants reuse their base's
// component with overridden color/font props via accentColorId/fontFamilyId.
const BASE_TEMPLATE_IDS = resumeTemplates.map((t) => t.id)

const templateLoaders = Object.fromEntries(
  BASE_TEMPLATE_IDS.map((id) => [
    id,
    lazy(() => import(`../components/resume/templates/${id}/index.jsx`)),
  ])
)

// A4 at 96 DPI: 210mm × 297mm = 793.7px × 1122.5px
const A4_WIDTH_MM = 210
const A4_HEIGHT_MM = 297

export default function ResumeTemplates() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()

  const [selectedId, setSelectedId] = useState(null)
  const [resumeData, setResumeData] = useState(null)     // raw incoming data
  const [loadingData, setLoadingData] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [layout, setLayout] = useState(DEFAULT_LAYOUT)

  const previewRef = useRef(null)

  // ─── Load resume data from one of three sources ───────────────────────────
  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoadingData(true)
      try {
        // Priority 1: location.state from ResumeBuilder
        const builderData = location.state?.builderData
        if (builderData) {
          if (!cancelled) {
            setResumeData(builderData)
            setLoadingData(false)
          }
          return
        }

        // Priority 2: ?resumeId= query param (from ResumeView)
        const resumeId = searchParams.get('resumeId')
        if (resumeId) {
          const res = await resumeApi.getById(resumeId)
          const text = res.resume?.enhancedText || res.resume?.originalText || ''
          if (!cancelled) {
            setResumeData(splitMarkdownIntoResume(text, res.resume?.title))
            setLoadingData(false)
          }
          return
        }

        // Priority 3: localStorage draft (AI-extracted portfolio)
        const draft =
          localStorage.getItem('ai_resume_draft') ||
          localStorage.getItem('ai_portfolio_draft')
        if (draft) {
          try {
            const parsed = JSON.parse(draft)
            if (!cancelled) {
              setResumeData(parsed)
              setLoadingData(false)
            }
            return
          } catch (_) { /* fallthrough to fallback */ }
        }

        // Fallback: null → context will use dummy_resume.json
        if (!cancelled) {
          setResumeData(null)
          setLoadingData(false)
        }
      } catch (err) {
        if (!cancelled) {
          toast.error('Failed to load resume data')
          setResumeData(null)
          setLoadingData(false)
        }
      }
    }

    load()
    return () => { cancelled = true }
  }, [location.state, searchParams])

  // Memoize the normalized data once — context already memoizes again internally
  const normalized = useMemo(() => normalizeResumeData(resumeData), [resumeData])
  // Inject current layout into the data so every template can read it
  const dataWithLayout = useMemo(() => ({ ...normalized, layout }), [normalized, layout])

  // Resolve selected template (handles variants that share a base folder)
  const selectedEntry = useMemo(() => GALLERY.find((t) => t.id === selectedId), [selectedId])
  const selectedBaseId = selectedEntry?.baseId || selectedEntry?.id || null
  const selectedTemplate = useMemo(
    () => resumeTemplates.find((t) => t.id === selectedBaseId) || (selectedEntry?.baseId ? null : selectedEntry),
    [selectedEntry, selectedBaseId]
  )

  const [accentColorId, setAccentColorId] = useState(() => {
    if (!selectedEntry) return 'teal'
    return selectedEntry.accentId || ACCENT_PRESETS[selectedEntry.id]?.defaultColor || ACCENT_PRESETS[selectedEntry.baseId]?.defaultColor || 'teal'
  })
  const [fontFamilyId, setFontFamilyId] = useState(() => {
    if (!selectedEntry) return 'sans'
    return selectedEntry.fontId || ACCENT_PRESETS[selectedEntry.id]?.defaultFont || ACCENT_PRESETS[selectedEntry.baseId]?.defaultFont || 'sans'
  })

  // When the selection changes, reset color/font picks to its defaults
  useEffect(() => {
    if (!selectedEntry) return
    const presets =
      ACCENT_PRESETS[selectedEntry.id] || ACCENT_PRESETS[selectedEntry.baseId]
    if (presets) {
      setAccentColorId(selectedEntry.accentId || presets.defaultColor)
      setFontFamilyId(selectedEntry.fontId || presets.defaultFont)
    }
  }, [selectedEntry?.id])

  const accentSwatch = COLOR_SWATCHES.find((s) => s.id === accentColorId) || COLOR_SWATCHES[0]
  const fontPairing = FONT_PAIRINGS.find((f) => f.id === fontFamilyId) || FONT_PAIRINGS[0]

  const handleSelect = (id) => setSelectedId(id)
  const handleBack = () => setSelectedId(null)
  const handleResetData = () => {
    setResumeData(null)
    toast.success('Switched to sample data')
  }

  // ─── ATS-safe PDF export ─────────────────────────────────────────────────
  const handleDownloadPdf = async () => {
    if (!previewRef.current || !selectedTemplate) return
    setExporting(true)
    const toastId = toast.loading('Generating ATS-safe PDF…')

    try {
      const fileName = `${normalized.personal.name || 'resume'}_${selectedBaseId || 'template'}.pdf`
        .replace(/\s+/g, '_')
      const result = await exportAtsSafePdf(previewRef.current, fileName, {
        orientation: 'portrait',
        format: layout.pageSize === 'Letter' ? 'letter' : 'a4',
        marginMm: 10,
      })
      toast.success(
        result.method === 'text'
          ? 'PDF downloaded (text-layer preserved for ATS)'
          : 'PDF downloaded',
        { id: toastId }
      )
    } catch (err) {
      console.error(err)
      toast.error('Failed to export PDF', { id: toastId })
    } finally {
      setExporting(false)
    }
  }

  // Download the active template's resume data as a plain text file.
  const handleDownloadTxt = () => {
    const lines = []
    const p = normalized.personal
    lines.push(`${p.name || 'Resume'}`)
    if (p.title) lines.push(p.title)
    const contact = [p.email, p.phone, p.location, p.website, p.linkedin, p.github]
      .filter(Boolean).join(' | ')
    if (contact) lines.push(contact)
    if (p.summary) {
      lines.push('')
      lines.push('SUMMARY')
      lines.push(p.summary)
    }
    if (normalized.experience.length) {
      lines.push('')
      lines.push('EXPERIENCE')
      normalized.experience.forEach((e) => {
        lines.push('')
        lines.push(`${e.role || ''}${e.company ? ` — ${e.company}` : ''}${e.period ? ` (${e.period})` : ''}`)
        if (e.location) lines.push(e.location)
        e.bullets.forEach((b) => lines.push(`- ${b}`))
      })
    }
    if (normalized.education.length) {
      lines.push('')
      lines.push('EDUCATION')
      normalized.education.forEach((e) => {
        lines.push('')
        lines.push(`${e.degree || ''}${e.institution ? ` — ${e.institution}` : ''}${e.period ? ` (${e.period})` : ''}`)
        if (e.description) lines.push(e.description)
      })
    }
    if (normalized.projects.length) {
      lines.push('')
      lines.push('PROJECTS')
      normalized.projects.forEach((p) => {
        lines.push('')
        lines.push(p.title || '')
        if (p.description) lines.push(p.description)
        if (p.techStack.length) lines.push(`Tech: ${p.techStack.join(', ')}`)
        if (p.link) lines.push(p.link)
      })
    }
    if (normalized.skills.length) {
      lines.push('')
      lines.push('SKILLS')
      lines.push(normalized.skills.map((s) => s.name).join(', '))
    }
    if (normalized.certifications.length) {
      lines.push('')
      lines.push('CERTIFICATIONS')
      normalized.certifications.forEach((c) => {
        lines.push(`- ${c.name}${c.issuer ? ` — ${c.issuer}` : ''}${c.year ? ` (${c.year})` : ''}`)
      })
    }

    const text = lines.join('\n')
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${(p.name || 'resume').replace(/\s+/g, '_')}_${selectedBaseId || 'template'}.txt`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    toast.success('Text file downloaded')
  }

  // Build a Word (.docx) version of the active template's resume data.
  const [docxBuilding, setDocxBuilding] = useState(false)
  const handleDownloadDocx = async () => {
    setDocxBuilding(true)
    const toastId = toast.loading('Building .docx…')
    try {
      const blob = await buildResumeDocx(normalized)
      downloadDocxBlob(blob, `${(normalized.personal.name || 'resume').replace(/\s+/g, '_')}_${selectedBaseId || 'template'}.docx`)
      toast.success('Word file downloaded', { id: toastId })
    } catch (err) {
      console.error(err)
      toast.error('Failed to build .docx', { id: toastId })
    } finally {
      setDocxBuilding(false)
    }
  }

  // ─── Render: gallery vs. preview ─────────────────────────────────────────
  return (
    <ResumeProvider value={dataWithLayout}>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
          <AnimatePresence mode="wait">
            {!selectedId ? (
              <GalleryView
                key="gallery"
                onSelect={handleSelect}
                onReset={handleResetData}
                dataSource={
                  location.state?.builderData ? 'Resume Builder' :
                  searchParams.get('resumeId') ? 'Saved Resume' :
                  localStorage.getItem('ai_resume_draft') || localStorage.getItem('ai_portfolio_draft') ? 'AI Draft' :
                  'Sample Data'
                }
                loading={loadingData}
              />
            ) : (
              <PreviewView
                key="preview"
                entry={selectedEntry}
                template={selectedTemplate}
                baseId={selectedBaseId}
                data={dataWithLayout}
                previewRef={previewRef}
                accentColor={accentSwatch}
                fontFamily={fontPairing.value}
                accentColorId={accentColorId}
                fontFamilyId={fontFamilyId}
                onAccentColorChange={setAccentColorId}
                onFontFamilyChange={setFontFamilyId}
                onBack={handleBack}
                onDownload={handleDownloadPdf}
                onDownloadTxt={handleDownloadTxt}
                onDownloadDocx={handleDownloadDocx}
                exporting={exporting}
                docxBuilding={docxBuilding}
                layout={layout}
                onLayoutChange={setLayout}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </ResumeProvider>
  )
}

// ─── Gallery view ────────────────────────────────────────────────────────────
function GalleryView({ onSelect, onReset, dataSource, loading }) {
  const [category, setCategory] = useState('all')
  const [industry, setIndustry] = useState('all')
  const [layout, setLayout] = useState('all')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('default')

  const filtered = useMemo(() => {
    let arr = GALLERY
    if (category !== 'all') arr = arr.filter((t) => t.category === category)
    if (industry !== 'all') arr = arr.filter((t) => t.industry === industry)
    if (layout !== 'all') arr = arr.filter((t) => t.layout === layout)
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      arr = arr.filter((t) =>
        t.name.toLowerCase().includes(q) ||
        (t.bestFor || '').toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q)
      )
    }
    if (sort === 'az') {
      arr = [...arr].sort((a, b) => a.name.localeCompare(b.name))
    } else if (sort === 'variants') {
      arr = [...arr].sort((a, b) => (b.isVariant ? 1 : 0) - (a.isVariant ? 1 : 0))
    }
    return arr
  }, [category, industry, layout, query, sort])

  const totalBase = resumeTemplates.length
  const totalVariants = GALLERY.length - totalBase

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
    >
      <header className="mb-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-500 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Resume Templates
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
          Choose your resume style
        </h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          <strong>{totalBase}</strong> unique designs + <strong>{totalVariants}</strong> curated color &amp; font variants = <strong>{GALLERY.length}</strong> templates. Live data, ATS-safe PDF export.
        </p>
        <div className="mt-4 flex items-center justify-center gap-3 text-xs text-muted-foreground flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/60 border border-border">
            <FileText className="w-3 h-3" />
            Data source: <strong className="text-foreground">{dataSource}</strong>
          </span>
          {dataSource === 'Sample Data' && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 text-sky-500 hover:text-sky-400"
            >
              <RefreshCw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>
      </header>

      {/* ─── Filter bar ─── */}
      <div className="rounded-xl bg-card border border-border p-3 mb-5 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates…"
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/50"
          >
            <option value="default">Sort: Featured</option>
            <option value="az">Sort: A → Z</option>
            <option value="variants">Sort: Variants first</option>
          </select>
          {(category !== 'all' || industry !== 'all' || layout !== 'all' || query) && (
            <button
              type="button"
              onClick={() => { setCategory('all'); setIndustry('all'); setLayout('all'); setQuery('') }}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="w-3 h-3" /> Clear filters
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <Filter className="w-3 h-3 text-muted-foreground" />
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                category === c.id
                  ? 'bg-sky-500 text-white'
                  : 'bg-muted/60 text-muted-foreground hover:text-foreground border border-border'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mr-1">Industry</span>
          {INDUSTRIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setIndustry(c.id)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                industry === c.id
                  ? 'bg-violet-500 text-white'
                  : 'bg-muted/60 text-muted-foreground hover:text-foreground border border-border'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mr-1">Layout</span>
          {LAYOUTS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setLayout(c.id)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                layout === c.id
                  ? 'bg-emerald-500 text-white'
                  : 'bg-muted/60 text-muted-foreground hover:text-foreground border border-border'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs text-muted-foreground mb-3">
        Showing <strong className="text-foreground">{filtered.length}</strong> of {GALLERY.length} templates
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Loading your resume data…
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((t) => (
            <TemplateCard key={t.id} entry={t} onSelect={onSelect} />
          ))}
        </div>
      )}
    </motion.div>
  )
}

function TemplateCard({ entry, onSelect }) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(entry.id)}
      whileHover={{ y: -4 }}
      className="text-left rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col"
    >
      <div
        className="aspect-[210/297] w-full overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${entry.accent}22 0%, ${entry.accent}11 100%)`,
        }}
      >
        <div className="w-full h-full flex items-center justify-center p-4">
          <div
            className="w-full h-full rounded-md bg-white shadow-sm border flex flex-col"
            style={{ borderColor: `${entry.accent}33` }}
          >
            <div
              className="h-2.5 w-full"
              style={{ background: entry.accent }}
            />
            <div className="flex-1 p-2.5 space-y-1.5">
              <div
                className="h-2.5 w-2/3 rounded"
                style={{ background: entry.accent, opacity: 0.7 }}
              />
              <div className="h-1.5 w-1/2 rounded bg-muted-foreground/30" />
              <div className="mt-2 h-1 w-full rounded bg-muted-foreground/15" />
              <div className="h-1 w-5/6 rounded bg-muted-foreground/15" />
              <div className="h-1 w-4/6 rounded bg-muted-foreground/15" />
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                <div className="space-y-1">
                  <div
                    className="h-1.5 w-3/4 rounded"
                    style={{ background: entry.accent, opacity: 0.5 }}
                  />
                  <div className="h-1 w-full rounded bg-muted-foreground/15" />
                  <div className="h-1 w-2/3 rounded bg-muted-foreground/15" />
                </div>
                <div className="space-y-1">
                  <div className="h-1 w-full rounded bg-muted-foreground/15" />
                  <div className="h-1 w-5/6 rounded bg-muted-foreground/15" />
                  <div className="h-1 w-3/4 rounded bg-muted-foreground/15" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-foreground text-sm leading-tight">{entry.name}</h3>
          {entry.isPhoto && (
            <span title="Supports profile photo" className="inline-flex items-center text-[10px] text-violet-500">
              <Camera className="w-3 h-3" />
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 flex-wrap mb-1.5">
          <span
            className="px-1.5 py-0.5 text-[9px] font-medium rounded-full uppercase tracking-wider"
            style={{
              background: `${entry.accent}15`,
              color: entry.accent,
            }}
          >
            {entry.category}
          </span>
          <span className="px-1.5 py-0.5 text-[9px] font-medium rounded-full uppercase tracking-wider bg-muted text-muted-foreground">
            {entry.layout}
          </span>
        </div>
        <p className="mt-auto text-xs text-muted-foreground line-clamp-2">{entry.description}</p>
      </div>
    </motion.button>
  )
}

// ─── Preview view ────────────────────────────────────────────────────────────
function PreviewView({
  entry, template, baseId, data, previewRef,
  accentColor, fontFamily,
  accentColorId, fontFamilyId,
  onAccentColorChange, onFontFamilyChange,
  onBack, onDownload, onDownloadTxt, onDownloadDocx,
  exporting, docxBuilding,
  layout, onLayoutChange,
}) {
  const TemplateComp = baseId ? templateLoaders[baseId] : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to templates
        </button>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-foreground">{entry?.name}</span>
          <button
            type="button"
            onClick={onDownloadTxt}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted text-foreground text-sm font-medium"
          >
            <FileType2 className="w-4 h-4" />
            .txt
          </button>
          <button
            type="button"
            onClick={onDownloadDocx}
            disabled={docxBuilding}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted text-foreground text-sm font-medium disabled:opacity-50"
          >
            {docxBuilding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            .docx
          </button>
          <button
            type="button"
            onClick={onDownload}
            disabled={exporting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Customize panel (color + font + layout + photo) ── */}
      <div className="rounded-xl bg-card border border-border p-3 mb-3 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Accent</span>
          <div className="flex items-center gap-1.5">
            {COLOR_SWATCHES.map((s) => (
              <button
                key={s.id}
                type="button"
                title={s.label}
                onClick={() => onAccentColorChange(s.id)}
                aria-label={`Accent ${s.label}`}
                aria-pressed={accentColorId === s.id}
                className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                  accentColorId === s.id ? 'border-foreground scale-110' : 'border-transparent'
                }`}
                style={{ background: s.value }}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Font</span>
          <select
            value={fontFamilyId}
            onChange={(e) => onFontFamilyChange(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/50"
          >
            {FONT_PAIRINGS.map((f) => (
              <option key={f.id} value={f.id}>{f.label}</option>
            ))}
          </select>
        </div>
        {entry?.isPhoto && (
          <PhotoUploader />
        )}
      </div>

      <LayoutControls
        layout={layout}
        onChange={onLayoutChange}
        onReset={() => onLayoutChange(DEFAULT_LAYOUT)}
      />

      <div className="rounded-2xl bg-muted/40 border border-border p-4 sm:p-8 overflow-auto">
        <div className="mx-auto" style={{ maxWidth: `${A4_WIDTH_MM}mm` }}>
          <div
            ref={previewRef}
            style={{
              boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
              borderRadius: 4,
              overflow: 'hidden',
              background: '#ffffff',
            }}
          >
            {TemplateComp ? (
              <Suspense
                fallback={
                  <div className="flex items-center justify-center p-12 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Loading template…
                  </div>
                }
              >
                <TemplateComp />
              </Suspense>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Photo uploader (inline component) ───────────────────────────────────────
function PhotoUploader() {
  const fileRef = useRef(null)
  const handleFile = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be smaller than 2 MB')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = String(reader.result || '')
      const draft = JSON.parse(localStorage.getItem('ai_resume_draft') || localStorage.getItem('ai_portfolio_draft') || '{}')
      const next = { ...(draft || {}), personal: { ...(draft?.personal || {}), photo: dataUrl } }
      localStorage.setItem('ai_resume_draft', JSON.stringify(next))
      toast.success('Photo attached — refresh to see it')
    }
    reader.readAsDataURL(file)
  }
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Photo</span>
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs hover:bg-muted"
      >
        <UploadIcon className="w-3 h-3" />
        Upload
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
/**
 * Light client-side markdown → resume-shape heuristic. Splits on common
 * section headers used by the AI enhancer. This is intentionally permissive —
 * the normalize layer will fall back to dummy data for any missing field.
 */
function splitMarkdownIntoResume(text, title) {
  if (!text || typeof text !== 'string') return null
  const sections = {}
  const lines = text.split(/\r?\n/)
  let currentKey = null
  let buffer = []

  const HEADERS = {
    'summary': 'summary',
    'professional summary': 'summary',
    'about': 'summary',
    'experience': 'experience',
    'work experience': 'experience',
    'professional experience': 'experience',
    'education': 'education',
    'projects': 'projects',
    'skills': 'skills',
    'certifications': 'certifications',
  }

  const flush = () => {
    if (!currentKey) return
    const raw = buffer.join('\n').trim()
    if (!raw) return
    if (['summary'].includes(currentKey)) {
      sections[currentKey] = raw
    } else {
      sections[currentKey] = sections[currentKey] || []
      sections[currentKey].push(raw)
    }
    buffer = []
  }

  for (const line of lines) {
    const trimmed = line.trim().replace(/^#+\s*/, '').replace(/:$/, '').toLowerCase()
    if (HEADERS[trimmed]) {
      flush()
      currentKey = HEADERS[trimmed]
      continue
    }
    if (currentKey) buffer.push(line)
  }
  flush()

  // Pull a name from the first markdown H1 if we have one
  const nameMatch = text.match(/^#\s+(.+)$/m)
  const name = nameMatch?.[1]?.trim()

  return {
    personal: {
      name: name || title?.replace(/^Resume\s*[-–—:]\s*/i, ''),
    },
    ...sections,
  }
}
