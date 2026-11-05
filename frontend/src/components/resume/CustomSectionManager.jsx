import React, { useState } from 'react'
import { Plus, Trash2, GripVertical, Sparkles, BookOpen, Quote, List, AlignLeft, Check } from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

export const PRESET_CUSTOM_SECTIONS = [
  { title: 'Languages', kind: 'list', defaultItem: 'English (Native)' },
  { title: 'Honors & Awards', kind: 'list', defaultItem: 'Outstanding Achievement Award — 2023' },
  { title: 'Volunteering & Leadership', kind: 'list', defaultItem: 'Lead Volunteer — Tech for Good' },
  { title: 'Publications & Research', kind: 'list', defaultItem: 'Co-author on Distributed Consensus Paper' },
  { title: 'Key Strengths', kind: 'list', defaultItem: 'Cross-functional Collaboration' },
  { title: 'Interests & Passions', kind: 'list', defaultItem: 'Open Source Development & Mentorship' },
  { title: 'Favorite Books', kind: 'books', defaultItem: 'Designing Data-Intensive Applications — Martin Kleppmann' },
  { title: 'Testimonials', kind: 'quotes', defaultItem: 'Exceptional engineer who elevated team standards.' },
]

const generateSectionId = (title) => {
  const slug = (title || 'section').toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const randomSuffix = Math.random().toString(36).substring(2, 6)
  return `custom-${slug}-${randomSuffix}`
}

export default function CustomSectionManager({
  customSections = [],
  onChange,
  onSectionOrderChange,
  sectionOrder = [],
}) {
  const [newTitle, setNewTitle] = useState('')
  const [newKind, setNewKind] = useState('list')
  const [showAddMenu, setShowAddMenu] = useState(false)

  const handleAddPreset = (preset) => {
    const id = generateSectionId(preset.title)
    const newSection = {
      id,
      title: preset.title,
      kind: preset.kind,
      items: [preset.defaultItem],
      body: preset.kind === 'paragraph' ? preset.defaultItem : '',
      order: customSections.length,
    }
    const updated = [...customSections, newSection]
    onChange(updated)
    if (onSectionOrderChange && !sectionOrder.includes(id)) {
      onSectionOrderChange([...sectionOrder, id])
    }
    setShowAddMenu(false)
  }

  const handleAddCustom = (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    const id = generateSectionId(newTitle.trim())
    const newSection = {
      id,
      title: newTitle.trim(),
      kind: newKind,
      items: newKind === 'paragraph' ? [] : ['First entry…'],
      body: newKind === 'paragraph' ? 'Write your section description here…' : '',
      order: customSections.length,
    }
    const updated = [...customSections, newSection]
    onChange(updated)
    if (onSectionOrderChange && !sectionOrder.includes(id)) {
      onSectionOrderChange([...sectionOrder, id])
    }
    setNewTitle('')
    setShowAddMenu(false)
  }

  const handleRemoveSection = (id) => {
    const updated = customSections.filter((s) => s.id !== id)
    onChange(updated)
    if (onSectionOrderChange) {
      onSectionOrderChange(sectionOrder.filter((k) => k !== id))
    }
  }

  const handleAddItem = (sectionId) => {
    const updated = customSections.map((s) => {
      if (s.id !== sectionId) return s
      return { ...s, items: [...(s.items || []), ''] }
    })
    onChange(updated)
  }

  const handleItemChange = (sectionId, index, val) => {
    const updated = customSections.map((s) => {
      if (s.id !== sectionId) return s
      const items = [...(s.items || [])]
      items[index] = val
      return { ...s, items }
    })
    onChange(updated)
  }

  const handleRemoveItem = (sectionId, index) => {
    const updated = customSections.map((s) => {
      if (s.id !== sectionId) return s
      const items = (s.items || []).filter((_, i) => i !== index)
      return { ...s, items }
    })
    onChange(updated)
  }

  const handleBodyChange = (sectionId, val) => {
    const updated = customSections.map((s) => {
      if (s.id !== sectionId) return s
      return { ...s, body: val }
    })
    onChange(updated)
  }

  return (
    <div className="space-y-6">
      {/* Existing Custom Sections */}
      {customSections.map((sec) => (
        <div key={sec.id} className="p-5 rounded-2xl bg-card border border-border space-y-4 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground text-base">{sec.title}</span>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                {sec.kind}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleRemoveSection(sec.id)}
              className="text-muted-foreground hover:text-red-500 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
              title="Delete Section"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {sec.kind === 'paragraph' ? (
            <textarea
              value={sec.body || ''}
              onChange={(e) => handleBodyChange(sec.id, e.target.value)}
              placeholder="Enter section content..."
              rows={4}
              className="w-full px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-y"
            />
          ) : (
            <div className="space-y-2">
              {(sec.items || []).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary/60 shrink-0" />
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleItemChange(sec.id, idx, e.target.value)}
                    placeholder={`Entry ${idx + 1}`}
                    className="flex-1 px-3 py-2 text-sm bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(sec.id, idx)}
                    className="p-1.5 text-muted-foreground hover:text-red-500 rounded-lg hover:bg-muted"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddItem(sec.id)}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80"
              >
                <Plus className="w-3.5 h-3.5" />
                Add entry to {sec.title}
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Add Custom Section Button & Popover */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="w-full py-3.5 px-4 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 bg-card/50 hover:bg-card text-muted-foreground hover:text-foreground text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-2xs"
        >
          <Plus className="w-4 h-4 text-primary" />
          Add Custom Section (Languages, Awards, Volunteering…)
        </button>

        {showAddMenu && (
          <div className="mt-3 p-4 rounded-2xl bg-card border border-border shadow-xl space-y-4">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Popular Section Presets
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESET_CUSTOM_SECTIONS.map((preset) => (
                  <button
                    key={preset.title}
                    type="button"
                    onClick={() => handleAddPreset(preset)}
                    className="p-2.5 rounded-xl border border-border bg-muted/30 hover:bg-primary/10 hover:border-primary/40 text-left text-xs font-medium text-foreground transition-all flex flex-col justify-between"
                  >
                    <span>{preset.title}</span>
                    <span className="text-[10px] text-muted-foreground capitalize mt-1">{preset.kind}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddCustom} className="pt-3 border-t border-border flex flex-wrap gap-2 items-center">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Or create your own (e.g., Patents, Press)"
                className="flex-1 min-w-[200px] px-3 py-2 text-xs bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <select
                value={newKind}
                onChange={(e) => setNewKind(e.target.value)}
                className="px-2.5 py-2 text-xs bg-muted/40 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="list">Bullet List</option>
                <option value="paragraph">Paragraph</option>
                <option value="quotes">Quotes</option>
                <option value="books">Books</option>
              </select>
              <button
                type="submit"
                disabled={!newTitle.trim()}
                className="px-4 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50"
              >
                Add Section
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
