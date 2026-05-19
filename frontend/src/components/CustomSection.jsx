import { useState, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import Button from './Button'

// ─── Icons (inline SVG to keep zero extra deps) ────────────────────────────

const Icon = ({ path, size = 16, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d={path} />
  </svg>
)

const ICONS = {
  plus:       'M12 5v14M5 12h14',
  trash:      'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6',
  grip:       'M9 5h2M9 12h2M9 19h2M13 5h2M13 12h2M13 19h2',
  chevUp:     'M18 15l-6-6-6 6',
  chevDown:   'M6 9l6 6 6-6',
  chevUpDown: 'M12 3l4 5H8l4-5zM12 21l-4-5h8l-4 5',
  edit:       'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
  check:      'M20 6L9 17l-5-5',
  x:          'M18 6L6 18M6 6l12 12',
  arrowUp:    'M12 19V5M5 12l7-7 7 7',
  arrowDown:  'M12 5v14M19 12l-7 7-7-7',
  sparkles: 'M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z',
}

// ─── Suggested section presets ─────────────────────────────────────────────

const SECTION_PRESETS = [
  { label: 'Awards & Honors',    icon: '🏆' },
  { label: 'Publications',       icon: '📄' },
  { label: 'Certifications',     icon: '🎓' },
  { label: 'Volunteer Work',     icon: '🤝' },
  { label: 'Languages',          icon: '🌐' },
  { label: 'Patents',            icon: '💡' },
  { label: 'Conferences',        icon: '🎤' },
  { label: 'Hobbies & Interests',icon: '⚡' },
]

// ─── Entry default factory ─────────────────────────────────────────────────

const makeEntry = () => ({
  id:          crypto.randomUUID(),
  title:       '',
  subtitle:    '',
  date:        '',
  description: '',
})

// ─── Entry editor ──────────────────────────────────────────────────────────

function EntryEditor({ entry, onChange, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) {
  const [expanded, setExpanded] = useState(!entry.title)

  const update = (field) => (e) => onChange({ ...entry, [field]: e.target.value })

  return (
    <div className="border border-border/50 rounded-xl overflow-hidden bg-muted/30 group/entry">
      {/* Entry header */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/40">
        {/* Reorder arrows */}
        <div className="flex flex-col gap-0.5 shrink-0">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={isFirst}
            aria-label="Move entry up"
            className="p-0.5 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Icon path={ICONS.arrowUp} size={12} />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={isLast}
            aria-label="Move entry down"
            className="p-0.5 rounded text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Icon path={ICONS.arrowDown} size={12} />
          </button>
        </div>

        {/* Title preview / input toggle */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex-1 text-left text-sm font-medium text-foreground truncate"
        >
          {entry.title || <span className="text-muted-foreground italic">Untitled entry</span>}
        </button>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? 'Collapse entry' : 'Expand entry'}
          className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icon path={expanded ? ICONS.chevUp : ICONS.chevDown} size={14} />
        </button>

        <button
          type="button"
          onClick={onDelete}
          aria-label="Delete entry"
          className="p-1 rounded text-muted-foreground hover:text-destructive transition-colors"
        >
          <Icon path={ICONS.trash} size={14} />
        </button>
      </div>

      {/* Entry fields */}
      {expanded && (
        <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-muted-foreground mb-1">Title *</label>
            <input
              type="text"
              value={entry.title}
              onChange={update('title')}
              placeholder="e.g. Best Paper Award"
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Subtitle / Issuer</label>
            <input
              type="text"
              value={entry.subtitle}
              onChange={update('subtitle')}
              placeholder="e.g. IEEE Conference"
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Date / Year</label>
            <input
              type="text"
              value={entry.date}
              onChange={update('date')}
              placeholder="e.g. May 2024"
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-muted-foreground mb-1">Description</label>
            <textarea
              rows={2}
              value={entry.description}
              onChange={update('description')}
              placeholder="Brief description (optional)"
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors resize-none"
            />
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Single section card ────────────────────────────────────────────────────

function SectionCard({
  section,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const nameRef = useRef(null)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [enhancedData, setEnhancedData] = useState(null)
  const handleEnhance = async () => {
    if (!section.entries || section.entries.length === 0) return

    setIsEnhancing(true)
    
    // Simulate a 2-second API delay
    setTimeout(() => {
      const mockEnhancedEntries = section.entries.map(entry => ({
        ...entry,
        description: entry.description 
          ? `✨ [AI ENHANCED] ${entry.description}\n- Restructured for professional impact.\n- Quantified achievements and optimized keywords.` 
          : '✨ [AI ENHANCED] Developed and executed core modules using high-performance engineering standards.'
      }))
      
      setEnhancedData({ ...section, entries: mockEnhancedEntries })
      setIsEnhancing(false)
    }, 2000)
  }
  // ── entry helpers ────────────────────────────────────────────────────────

  const addEntry = () =>
    onChange({ ...section, entries: [...section.entries, makeEntry()] })

  const updateEntry = (id, updated) =>
    onChange({
      ...section,
      entries: section.entries.map((e) => (e.id === id ? updated : e)),
    })

  const deleteEntry = (id) =>
    onChange({
      ...section,
      entries: section.entries.filter((e) => e.id !== id),
    })

  const moveEntry = (idx, dir) => {
    const entries = [...section.entries]
    const target = idx + dir
    if (target < 0 || target >= entries.length) return
    ;[entries[idx], entries[target]] = [entries[target], entries[idx]]
    onChange({ ...section, entries })
  }

  // ── name editing ─────────────────────────────────────────────────────────

  const startEdit = () => {
    setEditingName(true)
    setTimeout(() => nameRef.current?.focus(), 0)
  }

  const commitEdit = () => setEditingName(false)

  return (
    <div
      className={cn(
        'border border-border rounded-2xl overflow-hidden transition-all duration-300',
        'bg-card shadow-sm hover:shadow-md hover:border-primary/30',
      )}
    >
      {/* Section header */}
      <div className="flex items-center gap-3 px-5 py-3.5 bg-muted/20 border-b border-border/50">
        {/* Reorder */}
        <div className="flex gap-1 shrink-0">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={isFirst}
            aria-label="Move section up"
            className="p-1 rounded text-muted-foreground hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Icon path={ICONS.arrowUp} size={14} />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={isLast}
            aria-label="Move section down"
            className="p-1 rounded text-muted-foreground hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Icon path={ICONS.arrowDown} size={14} />
          </button>
        </div>

        {/* Section name */}
        {editingName ? (
          <input
            ref={nameRef}
            type="text"
            value={section.name}
            onChange={(e) => onChange({ ...section, name: e.target.value })}
            onBlur={commitEdit}
            onKeyDown={(e) => e.key === 'Enter' && commitEdit()}
            className="flex-1 bg-transparent border-b border-primary text-sm font-semibold text-foreground outline-none"
          />
        ) : (
          <span className="flex-1 text-sm font-semibold text-foreground truncate">
            {section.name || 'Unnamed Section'}
          </span>
        )}

        {/* Edit name */}
        <button
          type="button"
          onClick={editingName ? commitEdit : startEdit}
          aria-label={editingName ? 'Save section name' : 'Edit section name'}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-primary transition-colors"
        >
          <Icon path={editingName ? ICONS.check : ICONS.edit} size={14} />
        </button>
        {/* AI Enhance Button */}
        <button
          type="button"
          onClick={handleEnhance}
          disabled={isEnhancing || !section.entries || section.entries.length === 0}
          className="flex items-center gap-1.5 px-2.5 py-1.5 ml-2 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Icon 
            path={ICONS.sparkles} 
            size={14} 
            className={isEnhancing ? "animate-spin text-amber-500" : ""} 
          />
          {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
        </button>

        {/* Collapse */}
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? 'Expand section' : 'Collapse section'}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icon path={collapsed ? ICONS.chevDown : ICONS.chevUp} size={14} />
        </button>

        {/* Delete section */}
        <button
          type="button"
          onClick={onDelete}
          aria-label="Delete section"
          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
        >
          <Icon path={ICONS.trash} size={14} />
        </button>
      </div>

      {/* Section body */}
      {!collapsed && (
        <div className="px-5 py-4 space-y-3">
          {/* AI Diff View Overlay */}
          {enhancedData && (
            <div className="mb-4 border border-amber-500/30 rounded-xl p-4 bg-amber-500/5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="text-xs font-semibold text-amber-600 flex items-center gap-1">
                  <Icon path={ICONS.sparkles} size={12} /> AI Comparison View
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onChange(enhancedData); // Apply changes to original state
                      setEnhancedData(null); // Close diff view
                      alert("Successfully enhanced section!"); // Simple success toast/notification
                    }}
                    className="px-2.5 py-1 rounded bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => setEnhancedData(null)} // Clear and close without saving
                    className="px-2.5 py-1 rounded bg-muted-foreground/20 text-foreground text-xs font-medium hover:bg-muted-foreground/30 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
              
              {/* Split-Screen Diff Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2 border-r border-border/50 pr-2">
                  <p className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">Original Description</p>
                  {section.entries.map((entry) => (
                    <div key={entry.id} className="p-2 bg-background/50 rounded border border-border/30">
                      <p className="font-medium">{entry.title || "Untitled"}</p>
                      <p className="text-muted-foreground whitespace-pre-line">{entry.description || <span className="italic">No description</span>}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-amber-600 uppercase tracking-wider text-[10px]">AI Enhanced Description</p>
                  {enhancedData.entries.map((entry) => (
                    <div key={entry.id} className="p-2 bg-amber-500/5 rounded border border-amber-500/20">
                      <p className="font-medium">{entry.title || "Untitled"}</p>
                      <p className="text-foreground whitespace-pre-line">{entry.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {section.entries.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4 italic">
              No entries yet — add one below.
            </p>
          )}

          {section.entries.map((entry, idx) => (
            <EntryEditor
              key={entry.id}
              entry={entry}
              onChange={(updated) => updateEntry(entry.id, updated)}
              onDelete={() => deleteEntry(entry.id)}
              onMoveUp={() => moveEntry(idx, -1)}
              onMoveDown={() => moveEntry(idx, 1)}
              isFirst={idx === 0}
              isLast={idx === section.entries.length - 1}
            />
          ))}

          <button
            type="button"
            onClick={addEntry}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed border-border',
              'text-sm text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors',
            )}
          >
            <Icon path={ICONS.plus} size={14} />
            Add entry
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Add-section dialog / inline form ──────────────────────────────────────

function AddSectionPanel({ onAdd, onClose }) {
  const [name, setName] = useState('')

  const submit = (nameOverride) => {
    const finalName = (nameOverride ?? name).trim()
    if (!finalName) return
    onAdd(finalName)
    onClose()
  }

  return (
    <div className="border border-border rounded-2xl bg-card shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="px-5 py-4 border-b border-border/50 bg-muted/20 flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">Add Custom Section</span>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icon path={ICONS.x} size={14} />
        </button>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Custom name input */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1.5">
            Section name
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder="e.g. Awards, Publications…"
              autoFocus
              className="flex-1 px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
            />
            <Button variant="primary" size="sm" onClick={() => submit()}>
              Add
            </Button>
          </div>
        </div>

        {/* Quick presets */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Quick presets</p>
          <div className="flex flex-wrap gap-2">
            {SECTION_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => submit(p.label)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium',
                  'border border-border bg-muted/40 text-foreground',
                  'hover:border-primary/60 hover:bg-primary/10 hover:text-primary transition-colors',
                )}
              >
                <span>{p.icon}</span>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Markdown export helper ────────────────────────────────────────────────

export function sectionsToMarkdown(sections) {
  if (!sections?.length) return ''
  return sections
    .map((s) => {
      const header = `## ${s.name}\n`
      const body = s.entries
        .map((e) => {
          const parts = []
          if (e.title) {
            const titleLine = e.subtitle
              ? `**${e.title}** — *${e.subtitle}*`
              : `**${e.title}**`
            parts.push(e.date ? `${titleLine} *(${e.date})*` : titleLine)
          }
          if (e.description) parts.push(e.description)
          return parts.join('\n')
        })
        .filter(Boolean)
        .join('\n\n')
      return header + body
    })
    .join('\n\n')
}

// ─── Main exported component ───────────────────────────────────────────────

/**
 * CustomSection
 *
 * Props:
 *   sections        – array of section objects (controlled)
 *   onSectionsChange– callback(newSections) when anything changes
 *
 * Section shape:
 *   { id: string, name: string, entries: Entry[] }
 *
 * Entry shape:
 *   { id: string, title: string, subtitle: string, date: string, description: string }
 */
export default function CustomSection({ sections = [], onSectionsChange }) {
  const [showAddPanel, setShowAddPanel] = useState(false)

  // ── section helpers ────────────────────────────────────────────────────

  const addSection = useCallback(
    (name) => {
      const newSection = { id: crypto.randomUUID(), name, entries: [] }
      onSectionsChange([...sections, newSection])
    },
    [sections, onSectionsChange],
  )

  const updateSection = useCallback(
    (id, updated) =>
      onSectionsChange(sections.map((s) => (s.id === id ? updated : s))),
    [sections, onSectionsChange],
  )

  const deleteSection = useCallback(
    (id) => onSectionsChange(sections.filter((s) => s.id !== id)),
    [sections, onSectionsChange],
  )

  const moveSection = useCallback(
    (idx, dir) => {
      const next = [...sections]
      const target = idx + dir
      if (target < 0 || target >= next.length) return
      ;[next[idx], next[target]] = [next[target], next[idx]]
      onSectionsChange(next)
    },
    [sections, onSectionsChange],
  )

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">Custom Sections</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add Awards, Publications, Certifications and more
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowAddPanel((v) => !v)}
          className="gap-1.5"
        >
          <Icon path={showAddPanel ? ICONS.x : ICONS.plus} size={13} />
          {showAddPanel ? 'Cancel' : 'Add Section'}
        </Button>
      </div>

      {/* Add section panel */}
      {showAddPanel && (
        <AddSectionPanel
          onAdd={addSection}
          onClose={() => setShowAddPanel(false)}
        />
      )}

      {/* Section list */}
      {sections.length === 0 && !showAddPanel && (
        <div className="flex flex-col items-center justify-center py-10 rounded-2xl border border-dashed border-border text-center">
          <span className="text-3xl mb-2">📂</span>
          <p className="text-sm text-muted-foreground">No custom sections yet.</p>
          <p className="text-xs text-muted-foreground mt-1">
            Click <strong>Add Section</strong> to get started.
          </p>
        </div>
      )}

      {sections.map((section, idx) => (
        <SectionCard
          key={section.id}
          section={section}
          onChange={(updated) => updateSection(section.id, updated)}
          onDelete={() => deleteSection(section.id)}
          onMoveUp={() => moveSection(idx, -1)}
          onMoveDown={() => moveSection(idx, 1)}
          isFirst={idx === 0}
          isLast={idx === sections.length - 1}
        />
      ))}
    </div>
  )
}
