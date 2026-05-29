import { useState } from 'react'
const ENABLE_PREMIUM_THEMES = import.meta.env.VITE_ENABLE_PREMIUM_THEMES === 'true'
const THEMES = [
  { id: 'minimal', name: 'Minimal', supportsDarkMode: true, lightPreview: '#ffffff', darkPreview: '#1a1a1a', accent: '#6366f1', isPremium: false },
  { id: 'professional', name: 'Professional', supportsDarkMode: true, lightPreview: '#f8fafc', darkPreview: '#0f172a', accent: '#0ea5e9', isPremium: true },
  { id: 'creative', name: 'Creative', supportsDarkMode: false, lightPreview: '#fdf4ff', darkPreview: null, accent: '#d946ef', isPremium: true },
  { id: 'bold', name: 'Bold', supportsDarkMode: true, lightPreview: '#fff7ed', darkPreview: '#1c1917', accent: '#f97316', isPremium: false },
]

export default function ThemeSelector({ selectedTheme, onSelectTheme }) {
  const [isDarkPreview, setIsDarkPreview] = useState(false)

  return (
    <div className="w-full p-4">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm font-medium text-muted-foreground">Preview mode:</span>
        <div className="flex rounded-lg overflow-hidden border border-border">
          <button onClick={() => setIsDarkPreview(false)} className={`px-4 py-1.5 text-sm font-medium transition-colors ${!isDarkPreview ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted'}`}>☀️ Light</button>
          <button onClick={() => setIsDarkPreview(true)} className={`px-4 py-1.5 text-sm font-medium transition-colors ${isDarkPreview ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted'}`}>🌙 Dark</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
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
              className={`relative rounded-xl border-2 overflow-hidden transition-all ${
                isDisabled ? 'cursor-not-allowed opacity-90 border-border' 
                : isSelected ? 'cursor-pointer border-primary shadow-lg scale-105' 
                : 'cursor-pointer border-border hover:border-primary/50'
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
              <div className="h-24 w-full flex items-center justify-center" style={{ backgroundColor: previewColor }}>
                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: t.accent }} />
              </div>
              <div className="p-2 bg-card">
                <p className="text-sm font-medium text-foreground">{t.name}</p>
                {t.supportsDarkMode && (
                  <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">🌙 Dark mode supported</span>
                )}
              </div>
              {isSelected && !isDisabled && (
                <div className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">✓</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
