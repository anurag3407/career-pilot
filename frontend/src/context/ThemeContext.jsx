import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

const getStoredTheme = () => {
  try {
    return window.localStorage.getItem('theme')
  } catch {
    return null
  }
}

const setStoredTheme = (theme) => {
  try {
    window.localStorage.setItem('theme', theme)
  } catch {
    // Ignore storage write failures in restricted/brittle browser contexts.
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const savedTheme = getStoredTheme()
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme
    }

    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }

    return 'dark'
  })

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    setStoredTheme(theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
