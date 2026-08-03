import { useState } from 'react'
import { Sliders, Type, Maximize2 } from 'lucide-react'

/**
 * LayoutControls — per-section layout controls panel.
 *
 * Gap #9. Allows the user to adjust:
 *   - Page size (A4 / Letter)
 *   - Base font size (Small / Medium / Large)
 *   - Section spacing (Compact / Comfortable / Spacious)
 *   - Line height multiplier
 *
 * These props are consumed by every resume template through the
 * `ResumeContext` provider (via the `layout` field).
 *
 * The user can also reset to defaults.
 */
export default function LayoutControls({ layout, onChange, onReset }) {
  const [open, setOpen] = useState(false)

  const update = (patch) => onChange({ ...layout, ...patch })

  return (
    <div className="rounded-xl bg-card border border-border p-3 mb-4">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground"
      >
        <Sliders className="w-3 h-3" />
        Layout Controls
        {open ? null : (
          <span className="ml-2 text-[10px] text-muted-foreground normal-case font-normal tracking-normal">
            {layout.pageSize} · {layout.fontSize} · {layout.spacing}
          </span>
        )}
      </button>

      {open && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Page size */}
          <Group label="Page Size" icon={Maximize2}>
            <div className="flex rounded-lg border border-border overflow-hidden">
              {['A4', 'Letter'].map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => update({ pageSize: size })}
                  className={`flex-1 px-2 py-1.5 text-xs font-medium transition-colors ${
                    layout.pageSize === size
                      ? 'bg-sky-500 text-white'
                      : 'bg-background text-foreground hover:bg-muted'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </Group>

          {/* Font size */}
          <Group label="Font Size" icon={Type}>
            <div className="flex rounded-lg border border-border overflow-hidden">
              {[
                { id: 'Small',    px: '12px' },
                { id: 'Medium',   px: '14px' },
                { id: 'Large',    px: '16px' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => update({ fontSize: opt.id, fontSizePx: opt.px })}
                  className={`flex-1 px-2 py-1.5 text-xs font-medium transition-colors ${
                    layout.fontSize === opt.id
                      ? 'bg-sky-500 text-white'
                      : 'bg-background text-foreground hover:bg-muted'
                  }`}
                >
                  {opt.id}
                </button>
              ))}
            </div>
          </Group>

          {/* Section spacing */}
          <Group label="Spacing" icon={Sliders}>
            <div className="flex rounded-lg border border-border overflow-hidden">
              {['Compact', 'Comfortable', 'Spacious'].map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => update({ spacing: opt })}
                  className={`flex-1 px-2 py-1.5 text-xs font-medium transition-colors ${
                    layout.spacing === opt
                      ? 'bg-sky-500 text-white'
                      : 'bg-background text-foreground hover:bg-muted'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </Group>

          {/* Line height */}
          <Group label="Line Height" icon={Sliders}>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="1.2"
                max="1.8"
                step="0.05"
                value={layout.lineHeight}
                onChange={(e) => update({ lineHeight: Number(e.target.value) })}
                className="flex-1 accent-sky-500"
              />
              <span className="text-xs font-mono text-muted-foreground w-10 text-right">
                {Number(layout.lineHeight).toFixed(2)}
              </span>
            </div>
          </Group>

          <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
            <button
              type="button"
              onClick={onReset}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Reset to defaults
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Group({ label, icon: Icon, children }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
        <Icon className="w-3 h-3" />
        {label}
      </label>
      {children}
    </div>
  )
}

export const DEFAULT_LAYOUT = {
  pageSize: 'A4',
  fontSize: 'Medium',
  fontSizePx: '14px',
  spacing: 'Comfortable',
  lineHeight: 1.5,
}
