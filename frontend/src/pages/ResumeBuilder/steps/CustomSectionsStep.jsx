import { Plus, Trash2 } from 'lucide-react'

export default function CustomSectionsStep({
  customSections,
  addCustomSection,
  removeCustomSection,
  updateCustomSection,
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Custom Sections</h2>
        <p className="text-sm text-muted-foreground">
          Add anything that doesn't fit the standard sections — Certifications, Awards,
          Languages, Volunteer Work, Publications, and so on. These appear at the end of
          your resume, in the order you add them.
        </p>
      </div>

      {customSections.length === 0 && (
        <div className="border border-dashed border-border rounded-xl p-8 text-center text-muted-foreground">
          No custom sections yet. Add one if you want to include something extra.
        </div>
      )}

      <div className="space-y-4">
        {customSections.map((section, index) => (
          <div
            key={index}
            className="bg-background/30 p-5 rounded-xl border border-border relative"
          >
            <button
              onClick={() => removeCustomSection(index)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 transition-colors"
              aria-label="Remove custom section"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="space-y-3 pr-8">
              <div>
                <label className="block text-sm font-medium mb-1">Section Title</label>
                <input
                  type="text"
                  className="w-full bg-muted border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
                  value={section.title}
                  onChange={e => updateCustomSection(index, 'title', e.target.value)}
                  placeholder="Certifications"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  className="w-full bg-muted border border-border rounded-lg px-4 py-2 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
                  value={section.content}
                  onChange={e => updateCustomSection(index, 'content', e.target.value)}
                  placeholder={'- AWS Certified Solutions Architect (2025)\n- Google Data Analytics Certificate (2024)'}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addCustomSection}
        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
      >
        <Plus className="w-4 h-4" /> Add Custom Section
      </button>
    </div>
  )
}
