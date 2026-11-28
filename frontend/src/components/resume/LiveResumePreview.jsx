import React, { useEffect, useState, useRef, Suspense, lazy } from 'react'
import {
  Download, FileText, FileType2, Loader2, ZoomIn, ZoomOut, Maximize2,
  Sparkles, Palette, Type, Check, ChevronDown, ShieldCheck, AlertTriangle
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { resumeTemplates, COLOR_SWATCHES, FONT_PAIRINGS } from '../../data/resumeTemplates'
import { ResumeProvider } from '../../context/ResumeContext'
import { exportAtsSafePdf } from '../../services/atsPdfExport'
import { buildResumeDocx, downloadDocxBlob } from '../../utils/docxExport'
import { structuredToMarkdown, structuredToJsonResume } from '../../utils/resumeParser'

const BASE_TEMPLATE_IDS = resumeTemplates.map((t) => t.id)
const templateLoaders = Object.fromEntries(
  BASE_TEMPLATE_IDS.map((id) => [
    id,
    lazy(() => import(`../../components/resume/templates/${id}/index.jsx`)),
  ])
)

const A4_WIDTH_MM = 210

export default function LiveResumePreview({
  resumeData,
  defaultTemplateId = 'IvyLeague',
  className = '',
  // Optional controlled presentation. The builder owns these so the chosen
  // template/theme can be saved with the resume instead of resetting on every
  // remount. When omitted, the component keeps its own state as before.
  templateId: controlledTemplateId,
  accentColorId: controlledAccentColorId,
  fontFamilyId: controlledFontFamilyId,
  onTemplateChange,
  onAccentColorChange,
  onFontFamilyChange,
  showAtsCheck = true,
}) {
  const [internalTemplateId, setInternalTemplateId] = useState(defaultTemplateId)
  const [internalAccentColorId, setInternalAccentColorId] = useState('slate')
  const [internalFontFamilyId, setInternalFontFamilyId] = useState('serif')
  const [zoom, setZoom] = useState(85)
  const [exportingPdf, setExportingPdf] = useState(false)
  const [exportingDocx, setExportingDocx] = useState(false)
  const [atsOpen, setAtsOpen] = useState(false)

  const templateId = controlledTemplateId || internalTemplateId
  const accentColorId = controlledAccentColorId || internalAccentColorId
  const fontFamilyId = controlledFontFamilyId || internalFontFamilyId

  const setTemplateId = (id) => {
    setInternalTemplateId(id)
    onTemplateChange?.(id)
  }
  const setAccentColorId = (id) => {
    setInternalAccentColorId(id)
    onAccentColorChange?.(id)
  }
  const setFontFamilyId = (id) => {
    setInternalFontFamilyId(id)
    onFontFamilyChange?.(id)
  }

  const previewRef = useRef(null)
  const TemplateComp = templateLoaders[templateId] || templateLoaders['IvyLeague']

  const activeSwatch = COLOR_SWATCHES.find((s) => s.id === accentColorId) || COLOR_SWATCHES[0]
  const activeFont = FONT_PAIRINGS.find((f) => f.id === fontFamilyId) || FONT_PAIRINGS[0]

  // ATS readability from the same document the exports use. This is the JSON
  // Resume validator (semantic HTML, fonts, contact text, tables, headings…),
  // not the heuristic keyword score. Loaded on demand to keep the builder's
  // initial bundle light.
  const [atsReport, setAtsReport] = useState(null)
  useEffect(() => {
    if (!showAtsCheck) return undefined
    let cancelled = false
    import('../../utils/atsReadability')
      .then(({ checkAtsReadability }) => checkAtsReadability(resumeData || {}))
      .then((report) => {
        if (!cancelled) setAtsReport(report)
      })
      .catch(() => {
        if (!cancelled) setAtsReport(null)
      })
    return () => {
      cancelled = true
    }
  }, [resumeData, showAtsCheck])

  const atsScore = atsReport?.score
  const atsTone = atsScore == null
    ? 'text-muted-foreground border-border bg-muted'
    : atsScore >= 80
    ? 'text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
    : atsScore >= 60
    ? 'text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10'
    : 'text-red-600 dark:text-red-400 border-red-500/30 bg-red-500/10'

  const handleDownloadPdf = async () => {
    if (!previewRef.current) return
    setExportingPdf(true)
    try {
      const name = resumeData?.personal?.name || 'Resume'
      await exportAtsSafePdf(previewRef.current, `${name.replace(/\s+/g, '_')}_Resume.pdf`)
      toast.success('PDF downloaded!')
    } catch (err) {
      console.error('PDF export error:', err)
      toast.error('Failed to generate PDF')
    } finally {
      setExportingPdf(false)
    }
  }

  const handleDownloadDocx = async () => {
    setExportingDocx(true)
    try {
      const blob = await buildResumeDocx(resumeData)
      const name = resumeData?.personal?.name || 'Resume'
      downloadDocxBlob(blob, `${name.replace(/\s+/g, '_')}_Resume.docx`)
      toast.success('Word document downloaded!')
    } catch (err) {
      console.error('DOCX export error:', err)
      toast.error('Failed to generate DOCX')
    } finally {
      setExportingDocx(false)
    }
  }

  const handleDownloadTxt = () => {
    try {
      const txt = structuredToMarkdown(resumeData)
      const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${(resumeData?.personal?.name || 'Resume').replace(/\s+/g, '_')}.txt`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Plaintext resume downloaded!')
    } catch (_err) {
      toast.error('Failed to export plaintext')
    }
  }

  const handleDownloadJson = () => {
    try {
      const jsonResume = structuredToJsonResume(resumeData)
      const blob = new Blob([JSON.stringify(jsonResume, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${(resumeData?.personal?.name || 'Resume').replace(/\s+/g, '_')}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('JSON Resume downloaded!')
    } catch (_err) {
      toast.error('Failed to export JSON')
    }
  }

  return (
    <div className={`flex flex-col h-full bg-muted/30 border border-border rounded-2xl overflow-hidden shadow-sm ${className}`}>
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-card border-b border-border text-xs">
        {/* Template & Color Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground font-medium focus:ring-2 focus:ring-primary/40 cursor-pointer"
          >
            {resumeTemplates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.category})
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1 pl-1">
            {COLOR_SWATCHES.slice(0, 6).map((swatch) => (
              <button
                key={swatch.id}
                type="button"
                onClick={() => setAccentColorId(swatch.id)}
                title={swatch.label}
                className={`w-4 h-4 rounded-full border transition-transform ${
                  accentColorId === swatch.id ? 'scale-125 border-foreground' : 'border-transparent'
                }`}
                style={{ backgroundColor: swatch.value }}
              />
            ))}
          </div>

          <select
            value={fontFamilyId}
            onChange={(e) => setFontFamilyId(e.target.value)}
            className="px-2 py-1.5 rounded-lg border border-border bg-background text-foreground font-medium text-[11px]"
          >
            {FONT_PAIRINGS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Zoom & Export Actions */}
        <div className="flex items-center gap-1.5">
          {showAtsCheck && (
            <button
              type="button"
              onClick={() => setAtsOpen((open) => !open)}
              data-testid="ats-readability-badge"
              title="ATS readability (JSON Resume validator)"
              className={`px-2 py-1.5 rounded-lg border text-[11px] font-semibold inline-flex items-center gap-1 ${atsTone}`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ATS {atsReport ? atsReport.score : '…'}</span>
              {atsReport && <span className="opacity-70">({atsReport.grade})</span>}
            </button>
          )}
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(50, z - 10))}
              className="p-1 text-muted-foreground hover:text-foreground"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-medium w-8 text-center text-muted-foreground">{zoom}%</span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(130, z + 10))}
              className="p-1 text-muted-foreground hover:text-foreground"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleDownloadTxt}
            title="Download Plaintext (ATS Form Autofill)"
            className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground text-xs"
          >
            <FileType2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleDownloadDocx}
            disabled={exportingDocx}
            title="Download editable Word Document (.docx)"
            className="px-2.5 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground text-xs font-medium inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            {exportingDocx ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
            <span>.docx</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={exportingPdf}
            title="Download ATS-Friendly PDF"
            className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold inline-flex items-center gap-1.5 shadow-xs disabled:opacity-50"
          >
            {exportingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span>PDF</span>
          </button>
        </div>
      </div>

      {showAtsCheck && atsOpen && atsReport && (
        <div
          data-testid="ats-readability-panel"
          className="border-b border-border bg-card px-3 py-2.5 text-xs space-y-2 max-h-56 overflow-y-auto"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-semibold text-foreground">
              ATS readability: {atsReport.score}/100 · {atsReport.grade}
            </p>
            <p className="text-muted-foreground">
              {atsReport.passed} checks passed, {atsReport.failed} need attention
            </p>
          </div>
          <p className="text-muted-foreground">{atsReport.summary}</p>
          {atsReport.issues.length > 0 ? (
            <ul className="space-y-1.5">
              {atsReport.issues.slice(0, 6).map((issue, index) => (
                <li key={`${issue.message}-${index}`} className="flex gap-1.5">
                  <AlertTriangle
                    className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                      issue.severity === 'error'
                        ? 'text-red-500'
                        : issue.severity === 'warning'
                        ? 'text-amber-500'
                        : 'text-muted-foreground'
                    }`}
                  />
                  <span className="text-muted-foreground">{issue.message}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-emerald-600 dark:text-emerald-400">
              No issues found. This document is clean for ATS parsing.
            </p>
          )}
          {atsReport.issues.length > 6 && (
            <p className="text-muted-foreground">+{atsReport.issues.length - 6} more issue(s)</p>
          )}
        </div>
      )}

      {/* Interactive Paper Preview Canvas */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-start justify-center bg-muted/40">
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease',
            width: `${A4_WIDTH_MM}mm`,
            minHeight: '297mm',
            backgroundColor: '#ffffff',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12)',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <div ref={previewRef} style={{ width: '100%', minHeight: '100%', background: '#ffffff' }}>
            <ResumeProvider
              value={{
                ...resumeData,
                theme: {
                  primary: activeSwatch.value,
                  accent: activeSwatch.value,
                  fontFamily: activeFont.value,
                },
              }}
            >
              <Suspense
                fallback={
                  <div className="flex flex-col items-center justify-center p-24 text-muted-foreground text-sm">
                    <Loader2 className="w-6 h-6 animate-spin text-primary mb-2" />
                    <span>Rendering {templateId}…</span>
                  </div>
                }
              >
                {TemplateComp ? <TemplateComp /> : null}
              </Suspense>
            </ResumeProvider>
          </div>
        </div>
      </div>
    </div>
  )
}
