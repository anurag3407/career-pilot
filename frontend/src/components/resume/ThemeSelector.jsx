import { RESUME_THEMES } from './themes/index'

export default function ThemeSelector({ selected, onChange }) {
  return (
    <div className="mb-4">
      <p className="text-sm font-semibold text-muted-foreground mb-2">
        Choose Resume Theme
      </p>
      <div className="flex flex-wrap gap-3">
        {Object.values(RESUME_THEMES).map((theme) => (
          <button
            key={theme.id}
            onClick={() => onChange(theme.id)}
            className={`px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-all flex items-center gap-2
              ${selected === theme.id
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:border-primary'
              }`}
          >
            {/* Color swatch */}
            <span
              className="w-3 h-3 rounded-full inline-block border border-border"
              style={{ backgroundColor: theme.accent }}
            />
            <span>
              {theme.name}
              <span className="block text-xs font-normal opacity-70">
                {theme.description}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}