import { useState } from 'react'
const ENABLE_PREMIUM_THEMES = import.meta.env.VITE_ENABLE_PREMIUM_THEMES === 'true'
const THEMES = [
  { id: 'minimal', name: 'Minimal', supportsDarkMode: true, lightPreview: '#ffffff', darkPreview: '#1a1a1a', accent: '#6366f1', isPremium: false },
  { id: 'professional', name: 'Professional', supportsDarkMode: true, lightPreview: '#f8fafc', darkPreview: '#0f172a', accent: '#0ea5e9', isPremium: true },
  { id: 'creative', name: 'Creative', supportsDarkMode: false, lightPreview: '#fdf4ff', darkPreview: null, accent: '#d946ef', isPremium: true },
  { id: 'bold', name: 'Bold', supportsDarkMode: true, lightPreview: '#fff7ed', darkPreview: '#1c1917', accent: '#f97316', isPremium: false },
  {
  id: 'digital-dna',
  name: 'Digital DNA',
  supportsDarkMode: true,
  lightPreview: '#e0f7ff',
  darkPreview: '#0f172a',
  accent: '#06b6d4'
},
]


export default function ThemeSelector({ selectedTheme, onSelectTheme }) {
  const [isDarkPreview, setIsDarkPreview] = useState(false)

  return (
    <div className="w-full p-4">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm font-medium text-muted-foreground">Preview mode:</span>
        <div className="flex rounded-lg overflow-hidden border border-border bg-background/50 backdrop-blur-sm">
          <button onClick={() => setIsDarkPreview(false)} className={`px-4 py-1.5 text-sm font-medium transition-colors ${!isDarkPreview ? 'bg-cyan-500 text-white' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}>☀️ Light</button>
          <button onClick={() => setIsDarkPreview(true)} className={`px-4 py-1.5 text-sm font-medium transition-colors ${isDarkPreview ? 'bg-cyan-500 text-white' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}>🌙 Dark</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-5">
        {THEMES.map((t) => {
          const isSelected = selectedTheme === t.id
          const previewColor = isDarkPreview && t.supportsDarkMode ? t.darkPreview : t.lightPreview
          const isDisabled = ENABLE_PREMIUM_THEMES && t.isPremium

          return (
            <div 
              key={t.id} 
              onClick={() => {
                if (isDisabled) return
                if (onSelectTheme) onSelectTheme(t.id)
              }} 
              className={`relative rounded-xl border-2 overflow-hidden transition-all flex flex-col ${
                isDisabled ? 'cursor-not-allowed opacity-90 border-border bg-background' 
                : isSelected ? 'cursor-pointer border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.25)] scale-105 bg-card/80' 
                : 'cursor-pointer border-border/50 hover:border-cyan-500/50 bg-background/50 hover:bg-card/50'
              }`}
            >
              {t.isPremium && (
                <span className="absolute top-2 left-2 z-10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase bg-gradient-to-r from-amber-400 to-amber-600 rounded-full shadow-sm">
                  Premium
                </span>
              )}
              {isDisabled && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
                  <span className="px-3 py-1 text-sm font-semibold text-foreground bg-card/90 rounded-md shadow-sm border border-border">
                    Coming Soon
                  </span>
                </div>
              )}
              <div className="h-28 w-full flex items-center justify-center border-b border-border/50 transition-colors" style={{ backgroundColor: previewColor }}>
                <div className="w-8 h-8 rounded-full shadow-md" style={{ backgroundColor: t.accent }} />
              </div>
              <div className="p-3 flex-1 flex flex-col justify-between">
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                {t.supportsDarkMode && (
                  <div className="mt-2">
                    <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">🌙 Dark mode ready</span>
                  </div>
                )}
              </div>
              {isSelected && !isDisabled && (
                <div className="absolute top-2 right-2 z-10 bg-cyan-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-md">✓</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
