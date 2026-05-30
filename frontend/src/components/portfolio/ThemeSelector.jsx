import { useState } from 'react'

const ENABLE_PREMIUM_THEMES = import.meta.env.VITE_ENABLE_PREMIUM_THEMES === 'true'

const THEMES = [
  {
    id: 'minimal',
    name: 'Minimal',
    supportsDarkMode: true,
    lightPreview: 'from-slate-800 via-slate-900 to-indigo-950',
    darkPreview: 'from-zinc-950 via-slate-950 to-indigo-950',
    accent: '#6366f1',
    isPremium: false,
  },
  {
    id: 'professional',
    name: 'Professional',
    supportsDarkMode: true,
    lightPreview: 'from-sky-950 via-slate-900 to-cyan-950',
    darkPreview: 'from-slate-950 via-sky-950 to-slate-900',
    accent: '#0ea5e9',
    isPremium: true,
  },
  {
    id: 'creative',
    name: 'Creative',
    supportsDarkMode: false,
    lightPreview: 'from-fuchsia-950 via-slate-900 to-violet-950',
    darkPreview: null,
    accent: '#d946ef',
    isPremium: true,
  },
  {
    id: 'bold',
    name: 'Bold',
    supportsDarkMode: true,
    lightPreview: 'from-orange-950 via-stone-950 to-slate-900',
    darkPreview: 'from-stone-950 via-orange-950 to-zinc-950',
    accent: '#f97316',
    isPremium: false,
  },
]

export default function ThemeSelector({ selectedTheme, onSelectTheme }) {
  const [isDarkPreview, setIsDarkPreview] = useState(false)

  return (
    <div className="w-full p-4">
      <div className="mb-6 flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Preview mode:</span>
        <div className="flex overflow-hidden rounded-lg border border-border bg-card">
          <button
            type="button"
            onClick={() => setIsDarkPreview(false)}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              !isDarkPreview ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            Light
          </button>
          <button
            type="button"
            onClick={() => setIsDarkPreview(true)}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              isDarkPreview ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted'
            }`}
          >
            Dark
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {THEMES.map((themeOption) => {
          const isSelected = selectedTheme === themeOption.id
          const previewGradient =
            isDarkPreview && themeOption.supportsDarkMode
              ? themeOption.darkPreview
              : themeOption.lightPreview
          const isDisabled = ENABLE_PREMIUM_THEMES && themeOption.isPremium

          return (
            <button
              key={themeOption.id}
              type="button"
              disabled={isDisabled}
              onClick={() => {
                if (isDisabled) return
                if (onSelectTheme) onSelectTheme(themeOption.id)
              }}
              className={`relative overflow-hidden rounded-xl border-2 text-left transition-all ${
                isDisabled
                  ? 'cursor-not-allowed border-border opacity-90'
                  : isSelected
                    ? 'cursor-pointer border-primary shadow-lg shadow-primary/20 scale-[1.02]'
                    : 'cursor-pointer border-border hover:border-primary/50'
              } flex h-full flex-col`}
            >
              {themeOption.isPremium && (
                <span className="absolute left-2 top-2 z-10 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                  Premium
                </span>
              )}

              {isDisabled && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/70 backdrop-blur-[2px]">
                  <span className="rounded-md border border-border bg-card/95 px-3 py-1 text-sm font-semibold text-foreground shadow-sm">
                    Coming Soon
                  </span>
                </div>
              )}

              <div className={`flex h-24 w-full shrink-0 items-center justify-center border-b border-white/10 bg-gradient-to-br ${previewGradient}`}>
                <div className="relative h-12 w-24 rounded-full border border-white/15 bg-white/10 shadow-inner shadow-white/5">
                  <div
                    className="absolute left-5 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full shadow-lg shadow-black/30"
                    style={{ backgroundColor: themeOption.accent }}
                  />
                  <div className="absolute right-4 top-4 h-2 w-8 rounded-full bg-white/20" />
                  <div className="absolute bottom-4 right-7 h-1.5 w-12 rounded-full bg-white/10" />
                </div>
              </div>

              <div className="flex min-h-[4.875rem] flex-1 flex-col justify-start bg-card/95 p-2">
                <p className="text-sm font-medium text-foreground">{themeOption.name}</p>
                {themeOption.supportsDarkMode ? (
                  <span className="mt-1 inline-block rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs text-primary">
                    Dark mode supported
                  </span>
                ) : (
                  <span className="mt-1 inline-block w-fit rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-500">
                    Light preview only
                  </span>
                )}
              </div>

              {isSelected && !isDisabled && (
                <div className="absolute right-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  ✓
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
