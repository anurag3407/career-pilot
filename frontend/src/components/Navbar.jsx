import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
  User,
  Sun,
  Moon
} from 'lucide-react'

export default function Navbar() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
      className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background text-foreground shadow-sm"
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
            <Link
              to="/community"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              CareerNet
            </Link>

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

            <Link
              to={user ? "/profile" : "/login"}
              className="flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
            >
              {user ? (
                <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center">
                  <img
                    src="/user.svg"
                    alt="User profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <User className="w-4 h-4" />
              )}
              <span className="max-w-[120px] truncate">
                {user ? user.displayName || user.email?.split('@')[0] || 'Profile' : 'Profile'}
              </span>
            </Link>
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
            className="md:hidden border-t border-border bg-background overflow-hidden"
          >
            <div className="px-4 py-6 space-y-3">
              <Link
                to="/community"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-semibold text-foreground hover:bg-muted"
              >
                CareerNet
              </Link>

              <Link
                to={user ? "/profile" : "/login"}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold text-foreground hover:bg-muted"
              >
                {user ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center">
                    <img
                      src="/user.svg"
                      alt="User profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <User className="w-5 h-5" />
                )}
                <span>
                  {user ? user.displayName || user.email?.split('@')[0] || 'Profile' : 'Profile'}
                </span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
