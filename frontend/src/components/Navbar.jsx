import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
  LogOut,
  User,
  Bell,
  Sun,
  Moon,
  Palette,
  ChevronDown
} from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [notificationCount] = useState(3)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleHomeClick = (e) => {
    if (
      location.pathname === '/' &&
      e.button === 0 &&
      !e.metaKey &&
      !e.ctrlKey
    ) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setTimeout(() => {
        window.scrollTo(0, 0)
      }, 0)
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b border-border bg-background shadow-sm transition-shadow duration-300 ${
        scrolled ? 'shadow-lg shadow-background/20' : ''
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">

          {/* Logo */}
          <Link
            to="/"
            onClick={handleHomeClick}
            className="group flex shrink-0 items-center gap-2"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-xl overflow-hidden group-hover:scale-105 transition-transform">
              <img
                src="/speed.png"
                alt="careerpilot logo"
                className="w-full h-full object-contain"
              />
            </div>

            <span className="text-xl font-bold text-foreground tracking-tight">
              careerpilot
            </span>
          </Link>

          <div className="min-w-0 flex-1" />

          {/* Right Side */}
          <div className="ml-auto hidden shrink-0 items-center gap-3 md:flex">

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-muted hover:bg-accent border border-border text-foreground transition-all"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ y: 20, opacity: 0, rotate: 45 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: -20, opacity: 0, rotate: -45 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === 'light' ? (
                    <Moon className="w-5 h-5" />
                  ) : (
                    <Sun className="w-5 h-5" />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>

            {user ? (
              <>
                {/* Notification Bell */}
                <button
                  className="relative p-2 rounded-xl bg-muted border border-border hover:bg-accent transition-all"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 text-foreground" />

                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </button>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 px-3 py-2 bg-muted border border-border rounded-full hover:bg-accent transition-all"
                    aria-label="User menu"
                    aria-expanded={showDropdown}
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center">
                      <img
                        src="/user.svg"
                        alt="User profile"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <span className="text-sm font-medium text-foreground max-w-[100px] truncate">
                      {user.displayName || user.email?.split('@')[0]}
                    </span>

                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>

                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-14 w-52 bg-background border border-border rounded-2xl shadow-xl overflow-hidden"
                      >
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-4 py-3 hover:bg-muted transition-colors text-sm"
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </Link>

                        <Link
                          to="/settings"
                          className="flex items-center gap-2 px-4 py-3 hover:bg-muted transition-colors text-sm"
                        >
                          <Palette className="w-4 h-4" />
                          Settings
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-destructive/10 text-destructive transition-colors text-sm"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-bold transition-all-300 shadow-lg shadow-primary/20 hover:-translate-y-0.5 hover:shadow-primary/40"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center gap-2 md:hidden">

            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-muted border border-border"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-muted transition-all"
              aria-label={mobileMenuOpen ? "Close main navigation menu" : "Open main navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-6 space-y-3">
              {user ? (
                <button
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="flex items-center gap-3 w-full px-4 py-4 rounded-xl text-base font-semibold text-destructive hover:bg-destructive/10 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    to="/login"
                    className="flex justify-center items-center px-4 py-3 bg-muted rounded-xl font-semibold"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="flex justify-center items-center px-4 py-3 bg-primary text-primary-foreground rounded-xl font-semibold"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
