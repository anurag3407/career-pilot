import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  // user selection: 'light' | 'dark' | 'system'
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'system'
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved
    return 'system'
  })

  // helper to detect current system preference
  const getSystemTheme = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    return 'light'
  }
  const resolvedTheme = theme === 'system' ? getSystemTheme() : theme

  // helper to update html class
  const applyHtmlClass = useCallback((mode) => {
    if (typeof window === 'undefined') return
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(mode)
  }, [])

  // Sync DOM + localStorage whenever preference changes
  useEffect(() => {
    applyHtmlClass(resolvedTheme)
    try {
      localStorage.setItem('theme', theme)
    } catch (e) {
      // localStorage might be blocked; swallow errors gracefully
      // In a PR you can mention this as a compatibility note.
    }
  }, [theme, resolvedTheme, applyHtmlClass])

  // Listen for system changes when user selected 'system'
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (theme !== 'system') return

    const mq = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e) => {
      const newResolved = e.matches ? 'dark' : 'light'
      applyHtmlClass(newResolved)
    }

    // modern API
    if (mq.addEventListener) {
      mq.addEventListener('change', handleChange)
      return () => mq.removeEventListener('change', handleChange)
    }

    // fallback for older browsers
    mq.addListener(handleChange)
    return () => mq.removeListener(handleChange)
  }, [theme, applyHtmlClass])

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}