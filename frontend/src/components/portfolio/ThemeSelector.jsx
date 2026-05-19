import { useState } from 'react'

const THEMES = [
  { id: 'minimal', name: 'Minimal', supportsDarkMode: true, lightPreview: '#ffffff', darkPreview: '#1a1a1a', accent: '#6366f1' },
  { id: 'professional', name: 'Professional', supportsDarkMode: true, lightPreview: '#f8fafc', darkPreview: '#0f172a', accent: '#0ea5e9' },
  { id: 'creative', name: 'Creative', supportsDarkMode: false, lightPreview: '#fdf4ff', darkPreview: null, accent: '#d946ef' },
  { id: 'bold', name: 'Bold', supportsDarkMode: true, lightPreview: '#fff7ed', darkPreview: '#1c1917', accent: '#f97316' },
]

export default function ThemeSelector({ selectedTheme, onSelectTheme }) {
  const [isDarkPreview, setIsDarkPreview] = useState(false)

  return (
    <div className="w-full p-4">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Preview mode:</span>
        <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <button onClick={() => setIsDarkPreview(false)} className={`px-4 py-1.5 text-sm font-medium transition-colors ${!isDarkPreview ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>☀️ Light</button>
          <button onClick={() => setIsDarkPreview(true)} className={`px-4 py-1.5 text-sm font-medium transition-colors ${isDarkPreview ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>🌙 Dark</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {THEMES.map((t) => {
          const isSelected = selectedTheme === t.id
          const previewColor = isDarkPreview && t.supportsDarkMode ? t.darkPreview : t.lightPreview
          return (
            <div key={t.id} onClick={() => onSelectTheme && onSelectTheme(t.id)} className={`relative cursor-pointer rounded-xl border-2 overflow-hidden transition-all ${isSelected ? 'border-indigo-500 shadow-lg scale-105' : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'}`}>
              <div className="h-24 w-full flex items-center justify-center" style={{ backgroundColor: previewColor }}>
                <div className="w-8 h-8 rounded-full" style={{ backgroundColor: t.accent }} />
              </div>
              <div className="p-2 bg-white dark:bg-gray-900">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{t.name}</p>
                {t.supportsDarkMode && (
                  <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">🌙 Dark mode supported</span>
                )}
              </div>
              {isSelected && (
                <div className="absolute top-2 right-2 bg-indigo-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">✓</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
