import React, { useEffect, useRef, useState } from 'react'
import {
  Sparkles, GripVertical, Plus, Trash2, ArrowUp, ArrowDown, Loader2, Download,
  FileText, ZoomIn, ZoomOut, ChevronDown, Check, AlertTriangle, Maximize2, Palette,
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import InlineText from './InlineText'
import InlineAIEnhancer from '../InlineAIEnhancer'
import { STYLE_PRESETS, getStylePreset } from '../../../data/resumeStylePresets'
import { COLOR_SWATCHES } from '../../../data/resumeTemplates'
import { formatPeriod } from '../../../utils/resumeDateFormat'
import { exportStructuredPdf } from '../../../services/atsPdfExport'
import { buildResumeDocx, downloadDocxBlob } from '../../../utils/docxExport'
import './inline-editor.css'

const A4_HEIGHT_PX = 297 * (96 / 25.4) // 1122.52px at 96dpi
const STYLE_STORAGE_KEY = 'careerpilot_resume_canvas_style'

const SECTION_LABELS = {
  experience: 'Experience',
  education: 'Education',
  projects: 'Projects',
  skills: 'Skills',
  certifications: 'Certifications',
}

const KNOWN_SECTIONS = Object.keys(SECTION_LABELS)
const DEFAULT_ORDER = ['experience', 'education', 'projects', 'skills']

/* ───────────────────────── helpers ───────────────────────────────────────── */

function prettyUrl(url) {
  return String(url || '')
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/$/, '')
}

/**
 * Split a skills string into {label, value} rows, honouring "**Label:** a, b".
 * Leading blank lines are dropped; interior/trailing ones are kept so a
 * freshly-added (still empty) row stays on the page until it is filled in.
 */
export function parseSkillLines(raw) {
  const lines = String(raw || '').replace(/\r/g, '').split('\n')
  return lines.map((line) => line.trim()).map((line) => {
      const bold = line.match(/^\*\*(.+?)\*\*[:\s]*(.*)$/)
      if (bold && bold[2]) {
        return { label: bold[1].replace(/[:*]/g, '').trim(), value: bold[2].trim() }
      }
      const plain = line.match(/^([A-Za-z][A-Za-z &/+#.-]{1,28}):\s+(.+)$/)
      if (plain) return { label: plain[1].trim(), value: plain[2].trim() }
      return { label: '', value: line.replace(/\*\*/g, '') }
    })
}

export function composeSkillLines(lines) {
  // Blank rows are kept: the row the user just added (and has not typed into
  // yet) has to survive the round-trip, exactly like an empty bullet line.
  return lines
    .map((line) => (line.label ? `**${line.label}:** ${line.value}` : line.value))
    .join('\n')
}

/** Format choices survive tab switches and reloads (kept out of builder state). */
function readStylePreference() {
  try {
    const raw = localStorage.getItem(STYLE_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

/* ───────────────────────── drag & drop ───────────────────────────────────── */

function useDragReorder(onReorder) {
  const [drag, setDrag] = useState(null)
  const [over, setOver] = useState(null)

  const same = (a, b) =>
    Boolean(a) && Boolean(b) &&
    a.scope === b.scope && a.section === b.section && a.item === b.item

  const grip = (payload) => ({
    draggable: true,
    onDragStart: (event) => {
      event.stopPropagation()
      setDrag(payload)
      // The platform DnD protocol wants a payload; the reorder itself is driven
      // by React state, so a missing dataTransfer (jsdom, synthetic drags) must
      // never break the handle.
      const transfer = event.dataTransfer
      if (transfer) {
        try {
          transfer.effectAllowed = 'move'
          transfer.setData('text/plain', 'resume-block')
        } catch { /* read-only transfer — nothing to do */ }
      }
    },
    onDragEnd: () => { setDrag(null); setOver(null) },
  })

  const zone = (target) => ({
    onDragOver: (event) => {
      if (!same(drag, target)) return
      event.preventDefault()
      event.stopPropagation()
      const rect = event.currentTarget.getBoundingClientRect()
      const after = event.clientY > rect.top + rect.height / 2
      setOver((prev) => (prev && prev.scope === target.scope && prev.section === target.section &&
        prev.item === target.item && prev.index === target.index && prev.after === after
        ? prev
        : { ...target, after }))
    },
    onDragLeave: (event) => {
      if (!same(drag, target)) return
      event.stopPropagation()
    },
    onDrop: (event) => {
      if (!same(drag, target)) return
      event.preventDefault()
      event.stopPropagation()
      const rect = event.currentTarget.getBoundingClientRect()
      const after = event.clientY > rect.top + rect.height / 2
      let insertAt = target.index + (after ? 1 : 0)
      if (drag.index < insertAt) insertAt -= 1
      if (insertAt !== drag.index) onReorder(drag, insertAt)
      setDrag(null)
      setOver(null)
    },
  })

  const indicator = (target) => {
    if (!over || !same(drag, target)) return ''
    if (over.index !== target.index) return ''
    return over.after ? 'is-drop-after' : 'is-drop-before'
  }

  return { grip, zone, indicator }
}

/* ───────────────────────── inline date editor ────────────────────────────── */

function PeriodField({ startDate, endDate, current, onChange }) {
  const [editing, setEditing] = useState(false)
  const label = formatPeriod(startDate, endDate, current)

  if (!editing) {
    return (
      <div
        className="rce-period rce-editable"
        role="button"
        tabIndex={0}
        title="Click to edit dates"
        onClick={() => setEditing(true)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setEditing(true)
          }
        }}
      >
        {label || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Add dates</span>}
      </div>
    )
  }

  const inputCls =
    'bg-white border border-border rounded px-1 py-0.5 text-[10px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40'

  return (
    <div className="rce-period flex items-center gap-1" data-export-hide>
      <input
        type="month"
        value={startDate || ''}
        onChange={(event) => onChange({ startDate: event.target.value })}
        className={inputCls}
        aria-label="Start date"
        autoFocus
      />
      <span className="text-[9px] text-muted-foreground">–</span>
      {current ? (
        <span className="text-[10px] text-muted-foreground px-1">Present</span>
      ) : (
        <input
          type="month"
          value={endDate || ''}
          onChange={(event) => onChange({ endDate: event.target.value })}
          className={inputCls}
          aria-label="End date"
        />
      )}
      <label className="flex items-center gap-0.5 text-[9px] text-muted-foreground" title="Currently here">
        <input
          type="checkbox"
          checked={Boolean(current)}
          onChange={(event) => onChange({ current: event.target.checked, endDate: event.target.checked ? '' : endDate })}
          className="accent-primary"
        />
        Now
      </label>
      <button type="button" onClick={() => setEditing(false)} title="Done" className="rce-chrome-btn">
        <Check size={10} />
      </button>
    </div>
  )
}

/* ───────────────────────── bullets ───────────────────────────────────────── */

function BulletList({ items, role, onEdit, onAdd, onRemove, onMove }) {
  // An entry with no bullets still needs an editable first row to type into.
  const rows = Array.isArray(items) && items.length ? items : ['']

  return (
    <>
      <ul className="rce-bullets">
        {rows.map((bullet, index) => (
          <li
            key={index}
            className="rce-bullet"
            {...(onMove ? onMove.zone({ index }) : {})}
          >
            <span className="rce-bullet-dot" aria-hidden="true">•</span>
            <InlineText
              value={bullet}
              multiline
              className="rce-bullet-text"
              placeholder="Led … resulting in … (quantify the impact)"
              onChange={(value) => onEdit(index, value)}
            />
            <div className="rce-bullet-tools" data-export-hide>
              {onMove && (
                <button
                  type="button"
                  className="rce-chrome-btn rce-grip"
                  title="Drag to reorder"
                  {...onMove.grip(index)}
                >
                  <GripVertical size={10} />
                </button>
              )}
              <InlineAIEnhancer
                text={bullet}
                role={role || 'Professional'}
                sectionType="experience"
                compact
                onApply={(value) => onEdit(index, value)}
              />
              {onMove && (
                <>
                  <button
                    type="button"
                    className="rce-chrome-btn"
                    title="Move up"
                    disabled={index === 0}
                    onClick={() => onMove.up(index)}
                  >
                    <ArrowUp size={10} />
                  </button>
                  <button
                    type="button"
                    className="rce-chrome-btn"
                    title="Move down"
                    disabled={index === rows.length - 1}
                    onClick={() => onMove.down(index)}
                  >
                    <ArrowDown size={10} />
                  </button>
                </>
              )}
              <button type="button" className="rce-chrome-btn" title="Delete bullet" onClick={() => onRemove(index)}>
                <Trash2 size={10} />
              </button>
            </div>
          </li>
        ))}
      </ul>
      {/* With no bullets yet the placeholder row above is the first bullet, so
          the button only appears once there is a real row to add after. */}
      {Array.isArray(items) && items.length > 0 && (
        <div className="rce-addbar" data-export-hide style={{ border: 0, marginTop: 2, paddingTop: 0 }}>
          <button type="button" className="rce-inline-add" onClick={onAdd} style={{ opacity: 1 }}>
            <Plus size={10} /> Add bullet
          </button>
        </div>
      )}
    </>
  )
}

/* ───────────────────────── main component ────────────────────────────────── */

export default function ResumeCanvasEditor({ doc, onChange, targetRole = '', className = '' }) {
  const [presetId, setPresetId] = useState(() => readStylePreference()?.presetId || 'modern-clean')
  const [accentId, setAccentId] = useState(() => readStylePreference()?.accentId || null)
  const [zoom, setZoom] = useState(85)
  const [density, setDensity] = useState(0)
  const [pages, setPages] = useState(1)
  const [contentHeight, setContentHeight] = useState(A4_HEIGHT_PX)
  const [exporting, setExporting] = useState(null) // 'pdf' | 'docx' | null
  const [styleOpen, setStyleOpen] = useState(false)

  const paperRef = useRef(null)
  const preset = getStylePreset(presetId)
  const accent = COLOR_SWATCHES.find((swatch) => swatch.id === (accentId || preset.accentId)) || COLOR_SWATCHES[0]

  const op = (payload) => onChange?.(payload)

  useEffect(() => {
    try {
      localStorage.setItem(STYLE_STORAGE_KEY, JSON.stringify({ presetId, accentId }))
    } catch { /* storage full / private mode — the format is cosmetic */ }
  }, [presetId, accentId])

  /**
   * Sections are keyed, not indexed, and the canvas may show keys the saved
   * order omits — so always emit the fully-resolved order rather than an index
   * pair. Dragging can never reorder the wrong section.
   */
  function moveSectionTo(from, to) {
    // Only the sections the user can actually see take part in the order;
    // persisting a hidden one would resurrect an empty block.
    const next = [...visibleSections]
    if (from < 0 || from >= next.length) return
    const [moved] = next.splice(from, 1)
    next.splice(Math.max(0, Math.min(to, next.length)), 0, moved)
    op({ type: 'setSectionOrder', order: next })
  }

  /* measure pages / height ──────────────────────────────────────────────── */
  useEffect(() => {
    const node = paperRef.current
    if (!node) return undefined
    const measure = () => {
      const height = node.offsetHeight || A4_HEIGHT_PX
      setContentHeight(height)
      setPages(Math.max(1, Math.ceil((height - 4) / A4_HEIGHT_PX)))
    }
    measure()
    if (typeof ResizeObserver === 'undefined') return undefined
    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const { grip, zone, indicator } = useDragReorder((drag, insertAt) => {
    if (drag.scope === 'sections') {
      moveSectionTo(drag.index, insertAt)
    } else if (drag.scope === 'bullets') {
      op({ type: 'moveBullet', section: drag.section, index: drag.item, from: drag.index, to: insertAt })
    } else {
      op({ type: 'moveEntry', section: drag.section, from: drag.index, to: insertAt })
    }
  })

  /* ordered section list ────────────────────────────────────────────────── */
  const declaredOrder = Array.isArray(doc?.sectionOrder) && doc.sectionOrder.length ? doc.sectionOrder : DEFAULT_ORDER
  const customSectionIds = (doc?.customSections || []).map((section) => section.id)
  const orderedSections = [
    ...declaredOrder,
    ...KNOWN_SECTIONS.filter((key) => !declaredOrder.includes(key)),
    ...customSectionIds.filter((id) => !declaredOrder.includes(id)),
  ]

  const hasContent = (key) => {
    // The builder keeps one blank entry per list as an editing skeleton. A
    // section is only worth showing when something in it was actually filled
    // in — otherwise a fresh resume grows an empty "Certifications" block.
    if (key === 'experience') {
      return (doc?.experience || []).some((item) => item.role || item.company || (item.bullets || []).some(Boolean))
    }
    if (key === 'education') {
      return (doc?.education || []).some((item) => item.institution || item.degree || item.field)
    }
    if (key === 'projects') {
      return (doc?.projects || []).some((item) => item.name || item.tech || (item.bullets || []).some(Boolean))
    }
    if (key === 'skills') return (doc?.skills || []).some((line) => line.label || line.value)
    if (key === 'certifications') {
      return (doc?.certifications || []).some((item) => item.name || item.issuer || item.year)
    }
    const custom = (doc?.customSections || []).find((section) => section.id === key)
    return Boolean(custom && (custom.items?.length || custom.body))
  }

  /** A known section shows when it has content or the user put it in the order. */
  const isVisible = (key) => {
    if (!KNOWN_SECTIONS.includes(key)) return true
    return declaredOrder.includes(key) || hasContent(key)
  }
  const visibleSections = orderedSections.filter(isVisible)
  const missingSections = KNOWN_SECTIONS.filter((key) => !isVisible(key))

  /* export ──────────────────────────────────────────────────────────────── */
  const filenameBase = (doc?.personal?.name || 'Resume').trim().replace(/\s+/g, '_') || 'Resume'

  /**
   * Canonical shape for the exporters — exactly what is on the page, with dates
   * resolved through formatPeriod so no raw ISO string can reach a document.
   */
  function buildExportModel() {
    return {
      personal: doc?.personal || {},
      experience: (doc?.experience || []).map((item) => ({
        role: item.role,
        company: item.company,
        location: item.location,
        period: formatPeriod(item.startDate, item.endDate, item.current),
        bullets: (item.bullets || []).filter(Boolean),
      })),
      education: (doc?.education || []).map((item) => ({
        institution: item.institution,
        degree: [item.degree, item.field].filter(Boolean).join(', '),
        period: formatPeriod(item.startDate, item.endDate, false),
        location: item.location,
        description: item.description,
      })),
      projects: (doc?.projects || []).map((item) => ({
        title: item.name,
        link: item.link,
        description: (item.bullets || []).filter(Boolean).join('\n'),
        techStack: String(item.tech || '').split(',').map((tech) => tech.trim()).filter(Boolean),
      })),
      skills: (doc?.skills || []).map((line) => ({
        name: line.label ? `${line.label}: ${line.value}` : line.value,
      })).filter((line) => line.name),
      certifications: doc?.certifications || [],
      sectionOrder: doc?.sectionOrder || [],
      customSections: doc?.customSections || [],
    }
  }

  const handlePdf = async () => {
    setExporting('pdf')
    try {
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
      const { pageCount } = await exportStructuredPdf(buildExportModel(), {
        filename: `${filenameBase}_Resume.pdf`,
      })
      toast.success(pageCount > 1 ? `PDF downloaded (${pageCount} pages)` : 'ATS-friendly PDF downloaded')
    } catch (error) {
      console.error('PDF export failed:', error)
      toast.error('Could not generate the PDF — try again')
    } finally {
      setExporting(null)
    }
  }

  const handleDocx = async () => {
    setExporting('docx')
    try {
      const blob = await buildResumeDocx(buildExportModel())
      downloadDocxBlob(blob, `${filenameBase}_Resume.docx`)
      toast.success('Editable Word document downloaded')
    } catch (error) {
      console.error('DOCX export failed:', error)
      toast.error('Could not generate the .docx — try again')
    } finally {
      setExporting(null)
    }
  }

  /* typography scaling (compression for one-page fit) ────────────────────── */
  const densityFactor = [1, 0.955, 0.91, 0.87][density] || 1
  const scale = zoom / 100

  const paperStyle = {
    fontFamily: preset.font,
    fontSize: `${preset.bodySize * densityFactor}px`,
    lineHeight: preset.lineHeight,
    padding: `${Math.max(10, preset.marginMm * (density ? 0.94 : 1))}mm`,
    '--rce-accent': accent.value,
    '--rce-ink': preset.ink,
    '--rce-muted': preset.muted,
    '--rce-gap': `${preset.sectionGap * densityFactor}px`,
    '--rce-heading-font': preset.headingFont || preset.font,
  }

  const contactItems = [
    { key: 'email', placeholder: 'you@email.com' },
    { key: 'phone', placeholder: 'Phone' },
    { key: 'location', placeholder: 'City, Country' },
    { key: 'website', placeholder: 'portfolio.com' },
    { key: 'linkedin', placeholder: 'linkedin.com/in/you' },
    { key: 'github', placeholder: 'github.com/you' },
  ]

  const entryZone = (section, index) => zone({ scope: 'entries', section, item: null, index })
  const entryGrip = (section, index) => grip({ scope: 'entries', section, item: null, index })
  const entryIndicator = (section, index) => indicator({ scope: 'entries', section, item: null, index })

  const renderEntryTools = (section, index, length) => (
    <div className="rce-gutter" data-export-hide>
      <button type="button" className="rce-grip" title="Drag to reorder" {...entryGrip(section, index)}>
        <GripVertical size={11} />
      </button>
      <button
        type="button"
        title="Move up"
        disabled={index === 0}
        onClick={() => op({ type: 'moveEntry', section, from: index, to: index - 1 })}
      >
        <ArrowUp size={10} />
      </button>
      <button
        type="button"
        title="Move down"
        disabled={index === length - 1}
        onClick={() => op({ type: 'moveEntry', section, from: index, to: index + 1 })}
      >
        <ArrowDown size={10} />
      </button>
      <button type="button" title="Delete" onClick={() => op({ type: 'removeEntry', section, index })}>
        <Trash2 size={10} />
      </button>
    </div>
  )

  /* ── section bodies ───────────────────────────────────────────────────── */
  const renderExperience = () => (
    <>
      {(doc.experience || []).map((item, index) => (
        <div
          key={`experience-${index}`}
          className={`rce-entry ${entryIndicator('experience', index)}`}
          {...entryZone('experience', index)}
        >
          {renderEntryTools('experience', index, (doc.experience || []).length)}
          <div className="rce-row">
            <InlineText
              value={item.role}
              className="rce-role"
              placeholder="Job Title"
              onChange={(value) => op({ type: 'entry', section: 'experience', index, field: 'role', value })}
            />
            <PeriodField
              startDate={item.startDate}
              endDate={item.endDate}
              current={item.current}
              onChange={(patch) => {
                Object.entries(patch).forEach(([field, value]) =>
                  op({ type: 'entry', section: 'experience', index, field, value }))
              }}
            />
          </div>
          <div className="rce-row">
            <InlineText
              value={item.company}
              className="rce-company"
              placeholder="Company"
              onChange={(value) => op({ type: 'entry', section: 'experience', index, field: 'company', value })}
            />
            <InlineText
              value={item.location}
              className="rce-meta"
              placeholder="Location"
              onChange={(value) => op({ type: 'entry', section: 'experience', index, field: 'location', value })}
            />
          </div>
          <BulletList
            items={item.bullets}
            role={targetRole}
            onEdit={(bulletIndex, value) =>
              op({ type: 'bullet', section: 'experience', index, bulletIndex, value })}
            onAdd={() => op({ type: 'addBullet', section: 'experience', index })}
            onRemove={(bulletIndex) => op({ type: 'removeBullet', section: 'experience', index, bulletIndex })}
            onMove={{
              zone: (target) => zone({ scope: 'bullets', section: 'experience', item: index, index: target.index }),
              grip: (bulletIndex) => grip({ scope: 'bullets', section: 'experience', item: index, index: bulletIndex }),
              up: (bulletIndex) => op({ type: 'moveBullet', section: 'experience', index, from: bulletIndex, to: bulletIndex - 1 }),
              down: (bulletIndex) => op({ type: 'moveBullet', section: 'experience', index, from: bulletIndex, to: bulletIndex + 1 }),
            }}
          />
        </div>
      ))}
      <button
        type="button"
        className="rce-inline-add"
        data-export-hide
        onClick={() => op({ type: 'addEntry', section: 'experience' })}
      >
        <Plus size={10} /> Add role
      </button>
    </>
  )

  const renderEducation = () => (
    <>
      {(doc.education || []).map((item, index) => (
        <div
          key={`education-${index}`}
          className={`rce-entry ${entryIndicator('education', index)}`}
          {...entryZone('education', index)}
        >
          {renderEntryTools('education', index, (doc.education || []).length)}
          <div className="rce-row">
            <InlineText
              value={item.institution}
              className="rce-role"
              placeholder="University"
              onChange={(value) => op({ type: 'entry', section: 'education', index, field: 'institution', value })}
            />
            <PeriodField
              startDate={item.startDate}
              endDate={item.endDate}
              current={false}
              onChange={(patch) => {
                Object.entries(patch).forEach(([field, value]) =>
                  op({ type: 'entry', section: 'education', index, field, value }))
              }}
            />
          </div>
          <div className="rce-row">
            <div style={{ flex: '1 1 auto', display: 'flex', flexWrap: 'wrap', gap: '0 4px' }}>
              <InlineText
                value={item.degree}
                className="rce-company"
                placeholder="Degree"
                onChange={(value) => op({ type: 'entry', section: 'education', index, field: 'degree', value })}
              />
              <InlineText
                value={item.field}
                className="rce-company"
                placeholder="Field of study"
                onChange={(value) => op({ type: 'entry', section: 'education', index, field: 'field', value })}
              />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <InlineText
                value={item.location}
                className="rce-meta"
                placeholder="Location"
                onChange={(value) => op({ type: 'entry', section: 'education', index, field: 'location', value })}
              />
              <InlineText
                value={item.gpa ? `GPA ${item.gpa}` : ''}
                className="rce-meta"
                placeholder="GPA"
                onChange={(value) =>
                  op({ type: 'entry', section: 'education', index, field: 'gpa', value: value.replace(/^GPA\s*/i, '') })}
              />
            </div>
          </div>
          {item.description ? (
            <InlineText
              value={item.description}
              multiline
              className="rce-paragraph"
              placeholder="Honours, coursework, activities"
              onChange={(value) => op({ type: 'entry', section: 'education', index, field: 'description', value })}
            />
          ) : null}
        </div>
      ))}
      <button
        type="button"
        className="rce-inline-add"
        data-export-hide
        onClick={() => op({ type: 'addEntry', section: 'education' })}
      >
        <Plus size={10} /> Add education
      </button>
    </>
  )

  const renderProjects = () => (
    <>
      {(doc.projects || []).map((item, index) => (
        <div
          key={`project-${index}`}
          className={`rce-entry ${entryIndicator('projects', index)}`}
          {...entryZone('projects', index)}
        >
          {renderEntryTools('projects', index, (doc.projects || []).length)}
          <div className="rce-row">
            <InlineText
              value={item.name}
              className="rce-role"
              placeholder="Project name"
              onChange={(value) => op({ type: 'entry', section: 'projects', index, field: 'name', value })}
            />
            <InlineText
              value={item.link ? prettyUrl(item.link) : ''}
              className="rce-meta"
              placeholder="link"
              onChange={(value) => op({ type: 'entry', section: 'projects', index, field: 'link', value })}
            />
          </div>
          <div className="rce-row">
            <InlineText
              value={item.tech}
              className="rce-meta"
              placeholder="React, Node.js, PostgreSQL"
              onChange={(value) => op({ type: 'entry', section: 'projects', index, field: 'tech', value })}
            />
          </div>
          <BulletList
            items={item.bullets}
            role={targetRole}
            onEdit={(bulletIndex, value) =>
              op({ type: 'bullet', section: 'projects', index, bulletIndex, value })}
            onAdd={() => op({ type: 'addBullet', section: 'projects', index })}
            onRemove={(bulletIndex) => op({ type: 'removeBullet', section: 'projects', index, bulletIndex })}
            onMove={{
              zone: (target) => zone({ scope: 'bullets', section: 'projects', item: index, index: target.index }),
              grip: (bulletIndex) => grip({ scope: 'bullets', section: 'projects', item: index, index: bulletIndex }),
              up: (bulletIndex) => op({ type: 'moveBullet', section: 'projects', index, from: bulletIndex, to: bulletIndex - 1 }),
              down: (bulletIndex) => op({ type: 'moveBullet', section: 'projects', index, from: bulletIndex, to: bulletIndex + 1 }),
            }}
          />
        </div>
      ))}
      <button
        type="button"
        className="rce-inline-add"
        data-export-hide
        onClick={() => op({ type: 'addEntry', section: 'projects' })}
      >
        <Plus size={10} /> Add project
      </button>
    </>
  )

  const renderSkills = () => (
    <>
      {(doc.skills || []).map((line, index) => (
        <div key={`skill-${index}`} className="rce-skill-row">
          <div className="rce-gutter" data-export-hide>
            <button type="button" title="Delete row" onClick={() => op({ type: 'removeSkillLine', index })}>
              <Trash2 size={10} />
            </button>
          </div>
          {line.label ? (
            <>
              <InlineText
                value={line.label}
                className="rce-skill-label"
                placeholder="Category"
                onChange={(value) => op({ type: 'skillLine', index, field: 'label', value })}
              />
              <span className="rce-skill-colon">:</span>
            </>
          ) : null}
          <InlineText
            value={line.value}
            className="rce-skill-value"
            placeholder="React, TypeScript, Node.js, AWS"
            onChange={(value) => op({ type: 'skillLine', index, field: 'value', value })}
          />
        </div>
      ))}
      <button
        type="button"
        className="rce-inline-add"
        data-export-hide
        onClick={() => op({ type: 'addSkillLine' })}
      >
        <Plus size={10} /> Add skills row
      </button>
    </>
  )

  const renderCertifications = () => (
    <>
      {(doc.certifications || []).map((item, index) => (
        <div
          key={`cert-${index}`}
          className={`rce-entry ${entryIndicator('certifications', index)}`}
          {...entryZone('certifications', index)}
          style={{ marginBottom: 3 }}
        >
          {renderEntryTools('certifications', index, (doc.certifications || []).length)}
          <div className="rce-row" style={{ justifyContent: 'flex-start', gap: 5, flexWrap: 'wrap' }}>
            <span className="rce-bullet-dot" aria-hidden="true">•</span>
            <InlineText
              value={item.name}
              className="rce-company"
              placeholder="Certification name"
              onChange={(value) => op({ type: 'entry', section: 'certifications', index, field: 'name', value })}
            />
            <InlineText
              value={item.issuer}
              placeholder="Issuer"
              onChange={(value) => op({ type: 'entry', section: 'certifications', index, field: 'issuer', value })}
            />
            <InlineText
              value={item.year}
              className="rce-meta"
              placeholder="Year"
              onChange={(value) => op({ type: 'entry', section: 'certifications', index, field: 'year', value })}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        className="rce-inline-add"
        data-export-hide
        onClick={() => op({ type: 'addEntry', section: 'certifications' })}
      >
        <Plus size={10} /> Add certification
      </button>
    </>
  )

  const renderCustom = (section) => (
    <>
      {section.kind === 'paragraph' ? (
        <InlineText
          value={section.body || ''}
          multiline
          className="rce-paragraph"
          placeholder="Write here…"
          onChange={(value) => op({ type: 'custom', action: 'body', id: section.id, value })}
        />
      ) : (
        <ul className="rce-bullets">
          {(section.items || []).map((item, index) => (
            <li key={index} className="rce-bullet">
              <span className="rce-bullet-dot" aria-hidden="true">{section.kind === 'quotes' ? '“' : '•'}</span>
              <InlineText
                value={item}
                multiline
                className="rce-bullet-text"
                placeholder="Add an item"
                onChange={(value) => op({ type: 'custom', action: 'item', id: section.id, index, value })}
              />
              <div className="rce-bullet-tools" data-export-hide>
                <button
                  type="button"
                  className="rce-chrome-btn"
                  title="Delete item"
                  onClick={() => op({ type: 'custom', action: 'removeItem', id: section.id, index })}
                >
                  <Trash2 size={10} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        className="rce-inline-add"
        data-export-hide
        onClick={() => op({ type: 'custom', action: 'addItem', id: section.id })}
      >
        <Plus size={10} /> Add item
      </button>
    </>
  )

  const renderSectionBody = (key) => {
    if (key === 'experience') return renderExperience()
    if (key === 'education') return renderEducation()
    if (key === 'projects') return renderProjects()
    if (key === 'skills') return renderSkills()
    if (key === 'certifications') return renderCertifications()
    const custom = (doc.customSections || []).find((section) => section.id === key)
    return custom ? renderCustom(custom) : null
  }

  /* ── render ───────────────────────────────────────────────────────────── */
  return (
    <div className={`rce-root relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm ${exporting ? 'rce-exporting' : ''} ${className}`}>
      {/* toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border p-2.5 text-xs" data-export-hide>
        <div className="flex flex-wrap items-center gap-2">
          {/* style preset picker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setStyleOpen((open) => !open)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 font-medium text-foreground hover:border-primary/40"
            >
              <Palette className="h-3.5 w-3.5 text-primary" />
              <span>{preset.name}</span>
              <ChevronDown className={`h-3 w-3 transition-transform ${styleOpen ? 'rotate-180' : ''}`} />
            </button>

            {styleOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setStyleOpen(false)} />
                <div className="absolute left-0 top-full z-50 mt-2 max-h-[70vh] w-[22rem] overflow-y-auto rounded-xl border border-border bg-card p-2 shadow-2xl">
                  <p className="px-2 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Resume formats · 10 presets
                  </p>
                  {STYLE_PRESETS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => { setPresetId(option.id); setDensity(0); setStyleOpen(false) }}
                      className={`flex w-full items-start gap-2.5 rounded-lg p-2 text-left transition-colors ${
                        option.id === presetId ? 'bg-primary/10 ring-1 ring-primary/30' : 'hover:bg-muted'
                      }`}
                    >
                      <span
                        className="mt-0.5 flex h-9 w-7 shrink-0 flex-col justify-center gap-[3px] rounded border border-border bg-white px-1"
                        aria-hidden="true"
                      >
                        <span className="h-[2px] w-full" style={{ background: option.ink, opacity: 0.7 }} />
                        <span className="h-[1px] w-3/4" style={{ background: option.muted, opacity: 0.5 }} />
                        <span className="h-[1px] w-full" style={{ background: option.muted, opacity: 0.3 }} />
                        <span className="h-[1px] w-full" style={{ background: option.muted, opacity: 0.3 }} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-foreground">{option.name}</span>
                          <span className="rounded-full bg-muted px-1.5 py-px text-[9px] font-medium text-muted-foreground">
                            {option.category}
                          </span>
                          {option.id === presetId && <Check className="h-3 w-3 text-primary" />}
                        </span>
                        <span className="mt-0.5 block text-[10px] leading-snug text-muted-foreground">{option.blob}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* accent colours */}
          <div className="flex items-center gap-1 border-l border-border pl-2">
            {COLOR_SWATCHES.map((swatch) => (
              <button
                key={swatch.id}
                type="button"
                onClick={() => setAccentId(swatch.id)}
                title={swatch.label}
                aria-label={`${swatch.label} accent`}
                className={`h-4 w-4 rounded-full border transition-transform ${
                  accent.id === swatch.id ? 'scale-125 border-foreground' : 'border-transparent hover:scale-110'
                }`}
                style={{ backgroundColor: swatch.value }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[10px] font-medium ${
              pages > 1
                ? 'border-amber-300 bg-amber-50 text-amber-700'
                : 'border-emerald-300 bg-emerald-50 text-emerald-700'
            }`}
            title="Recruiters expect one page under 10 years of experience"
          >
            {pages > 1 ? <AlertTriangle className="h-3 w-3" /> : <Check className="h-3 w-3" />}
            {pages} {pages === 1 ? 'page' : 'pages'}
          </span>

          {pages > 1 && density < 3 && (
            <button
              type="button"
              onClick={() => setDensity((value) => Math.min(3, value + 1))}
              title="Tighten leading and margins to reclaim space"
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2 py-1 text-[10px] font-medium text-foreground hover:border-primary/40"
            >
              <Maximize2 className="h-3 w-3" /> Fit closer
            </button>
          )}
          {density > 0 && (
            <button
              type="button"
              onClick={() => setDensity(0)}
              className="rounded-lg px-1.5 py-1 text-[10px] text-muted-foreground hover:text-foreground"
            >
              Reset spacing
            </button>
          )}

          <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-0.5">
            <button type="button" onClick={() => setZoom((value) => Math.max(50, value - 10))} className="p-1 text-muted-foreground hover:text-foreground" title="Zoom out">
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="w-8 text-center text-[10px] font-medium text-muted-foreground">{zoom}%</span>
            <button type="button" onClick={() => setZoom((value) => Math.min(130, value + 10))} className="p-1 text-muted-foreground hover:text-foreground" title="Zoom in">
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleDocx}
            disabled={Boolean(exporting)}
            className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2 py-1.5 text-[10px] font-medium text-foreground hover:bg-muted disabled:opacity-50"
            title="Download an editable Word document"
          >
            {exporting === 'docx' ? <Loader2 className="h-3 w-3 animate-spin" /> : <FileText className="h-3 w-3" />}
            .docx
          </button>

          <button
            type="button"
            onClick={handlePdf}
            disabled={Boolean(exporting)}
            className="inline-flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1.5 text-[10px] font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            title="Download an ATS-friendly PDF"
          >
            {exporting === 'pdf' ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
            PDF
          </button>
        </div>
      </div>

      {/* hint strip */}
      <div className="flex items-center gap-2 border-b border-border/60 bg-muted/30 px-3 py-1 text-[10px] text-muted-foreground" data-export-hide>
        <Sparkles className="h-3 w-3 text-primary" />
        <span>Click any line to edit it. Drag a handle to reorder sections, roles and bullets — no forms, no tabs.</span>
      </div>

      {/* canvas */}
      <div className="rce-stage bg-muted/40">
        <div
          className="rce-scale"
          style={{
            transform: `scale(${scale})`,
            marginBottom: `-${Math.max(0, (1 - scale) * contentHeight)}px`,
          }}
        >
          <div
            ref={paperRef}
            className="rce-paper"
            data-head={preset.head}
            data-headings={preset.headings}
            data-meta={preset.metaStyle}
            style={paperStyle}
          >
            {pages > 1 && [1, 2, 3].filter((n) => n < pages).map((n) => (
              <div key={n} className="rce-page-break" style={{ top: `${297 * n}mm` }} data-export-hide>
                <span>page break → page {n + 1}</span>
              </div>
            ))}

            {/* header */}
            <header className="rce-header">
              <InlineText
                value={doc?.personal?.name || ''}
                className="rce-name"
                placeholder="Your Name"
                style={{
                  fontSize: `${preset.nameSize * densityFactor}px`,
                  letterSpacing: preset.nameTracking,
                  textTransform: preset.nameTransform,
                }}
                onChange={(value) => op({ type: 'personal', field: 'name', value })}
              />
              <InlineText
                value={doc?.personal?.title || ''}
                className="rce-title"
                placeholder="Target job title"
                onChange={(value) => op({ type: 'personal', field: 'title', value })}
              />
              <div className="rce-contact">
                {contactItems.map((item) => (
                  <span className="rce-contact-item" key={item.key}>
                    <InlineText
                      value={doc?.personal?.[item.key] || ''}
                      placeholder={item.placeholder}
                      style={{ display: 'inline-block' }}
                      onChange={(value) => op({ type: 'personal', field: item.key, value })}
                    />
                  </span>
                ))}
              </div>
              {preset.headerRule && <div className="rce-header-rule" />}
            </header>

            {/* summary (fixed lead block, as in every standard resume format) */}
            <section className="rce-section" data-section="summary">
              <div className="rce-gutter" data-export-hide style={{ top: 2 }}>
                <InlineAIEnhancer
                  text={doc?.personal?.summary || ''}
                  role={targetRole || doc?.personal?.title || 'Professional'}
                  sectionType="summary"
                  compact
                  onApply={(value) => op({ type: 'personal', field: 'summary', value })}
                />
              </div>
              <div className="rce-section-head">
                <span className="rce-section-title">Summary</span>
                <span className="rce-section-line" />
              </div>
              <InlineText
                value={doc?.personal?.summary || ''}
                multiline
                placeholder="Two or three lines: who you are, your strongest proof point, and the role you are targeting."
                onChange={(value) => op({ type: 'personal', field: 'summary', value })}
              />
            </section>

            {/* body sections */}
            {visibleSections.map((key, index) => {
              const custom = (doc?.customSections || []).find((section) => section.id === key)
              const isKnown = KNOWN_SECTIONS.includes(key)
              if (!isKnown && !custom) return null

              return (
                <section
                  key={key}
                  data-section={key}
                  className={`rce-section ${indicator({ scope: 'sections', section: null, item: null, index })}`}
                  {...zone({ scope: 'sections', section: null, item: null, index })}
                >
                  <div className="rce-section-head">
                    <div className="rce-gutter" data-export-hide>
                      <button
                        type="button"
                        className="rce-grip"
                        title="Drag to reorder section"
                        {...grip({ scope: 'sections', section: null, item: null, index })}
                      >
                        <GripVertical size={11} />
                      </button>
                      <button
                        type="button"
                        title="Move up"
                        disabled={index === 0}
                        onClick={() => moveSectionTo(index, index - 1)}
                      >
                        <ArrowUp size={10} />
                      </button>
                      <button
                        type="button"
                        title="Move down"
                        disabled={index === visibleSections.length - 1}
                        onClick={() => moveSectionTo(index, index + 1)}
                      >
                        <ArrowDown size={10} />
                      </button>
                      {custom && (
                        <button
                          type="button"
                          title="Delete section"
                          onClick={() => op({ type: 'custom', action: 'removeSection', id: custom.id })}
                        >
                          <Trash2 size={10} />
                        </button>
                      )}
                    </div>

                    {custom ? (
                      <InlineText
                        value={custom.title || ''}
                        className="rce-section-title"
                        placeholder="Section title"
                        onChange={(value) => op({ type: 'custom', action: 'title', id: custom.id, value })}
                      />
                    ) : (
                      <span className="rce-section-title">{SECTION_LABELS[key]}</span>
                    )}
                    <span className="rce-section-line" />
                  </div>

                  {renderSectionBody(key)}
                </section>
              )
            })}

            {/* add a section */}
            <div className="rce-addbar" data-export-hide>
              {missingSections.map((key) => (
                <button
                  key={key}
                  type="button"
                  className="rce-add-chip"
                  onClick={() => op({ type: 'addSection', section: key })}
                >
                  <Plus size={9} /> {SECTION_LABELS[key]}
                </button>
              ))}
              <button
                type="button"
                className="rce-add-chip"
                onClick={() => op({ type: 'custom', action: 'addSection' })}
              >
                <Plus size={9} /> Custom section
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
