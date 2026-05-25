import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  FileText,
  LayoutDashboard,
  Menu,
  X,
  LogOut,
  User,
  Bell,
  Mail,
  Linkedin,
  Users,
  GraduationCap,
  Mic,
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
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [notificationCount] = useState(3)

  const navRef = useRef(null)
  const userDropdownRef = useRef(null)

  // Close mobile menu on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      if (mobileMenuOpen) setMobileMenuOpen(false)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [mobileMenuOpen])

  // Close mobile menu and user dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMobileMenuOpen(false)
        setShowUserDropdown(false)
        setShowSearchDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setShowUserDropdown(false)
  }, [location.pathname])

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

  const isActive = (path) => location.pathname === path

  const publicLinks = [
    { path: '/templates', label: 'Templates', icon: Palette },
    { path: '/portfolio', label: 'Portfolio', icon: User },
  ]

  const privateLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/jobs', label: 'Jobs', icon: Search },
    { path: '/job-alerts', label: 'Alerts', icon: Bell },
    { path: '/interview-prep', label: 'Interview', icon: Mic },
    { path: '/fellowship', label: 'Fellowship', icon: GraduationCap },
    { path: '/community', label: 'Community', icon: Users },
    { path: '/upload', label: 'Resume', icon: FileText },
    { path: '/email-generator', label: 'Emails', icon: Mail },
    { path: '/linkedin-optimizer', label: 'LinkedIn', icon: Linkedin },
  ]

  const searchSuggestions = [
    'Frontend Developer',
    'Backend Developer',
    'Resume Builder',
    'Interview Questions',
    'Remote Jobs'
  ]

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass border-b border-border shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Main Navbar Row ── */}
        <div className="flex items-center justify-between h-16">

          {/* Logo — always left-aligned */}
          <Link
            to="/"
            onClick={handleHomeClick}
            className="flex items-center gap-2 group flex-shrink-0"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl overflow-hidden group-hover:scale-105 transition-transform">
              <img
                src="/speed.png"
                alt="careerpilot logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-lg md:text-xl font-bold text-foreground tracking-tight">
              careerpilot
            </span>
          </Link>

          {/* ── Desktop / Tablet Nav Links — hidden on mobile (<md) ── */}
          {/* md–lg: compact links (gap-1, smaller padding via text-xs override)
              lg+:  full spacing (gap-2, normal padding) */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2 flex-1 justify-center px-2 lg:px-4 overflow-x-auto">

            {/* Search bar — only visible on lg+ */}
            <div className="relative hidden lg:block">
              <div className="flex items-center bg-muted border border-border rounded-xl px-3 py-2 w-56 xl:w-72 focus-within:ring-2 focus-within:ring-primary/40 transition-all">
                <Search className="w-4 h-4 text-muted-foreground mr-2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearchDropdown(true)}
                  onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                  className="bg-transparent outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showSearchDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute top-14 left-0 w-full bg-background border border-border rounded-xl shadow-xl overflow-hidden z-50"
                  >
                    {searchSuggestions.map((item, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-4 py-3 hover:bg-muted transition-colors text-sm text-foreground"
                      >
                        {item}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Public nav links */}
            {publicLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`nav-link md:px-2 md:py-1.5 md:text-xs lg:px-3 lg:py-2 lg:text-sm ${isActive(path) ? 'nav-link-active' : 'nav-link-inactive'}`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="hidden lg:inline">{label}</span>
                {/* on md, show a condensed tooltip-friendly label */}
                <span className="lg:hidden">{label}</span>
              </Link>
            ))}

            {/* Private nav links (authenticated only) */}
            {user &&
              privateLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`nav-link md:px-2 md:py-1.5 md:text-xs lg:px-3 lg:py-2 lg:text-sm ${isActive(path) ? 'nav-link-active' : 'nav-link-inactive'}`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden lg:inline">{label}</span>
                  <span className="lg:hidden">{label}</span>
                </Link>
              ))}
          </div>

          {/* ── Right Side: Theme + CTA / User — hidden on mobile ── */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3 flex-shrink-0">

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
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2 px-3 py-2 bg-muted border border-border rounded-full hover:bg-accent transition-all"
                    aria-label="User menu"
                    aria-expanded={showUserDropdown}
                  >
                    <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center">
                      <img
                        src="/user.svg"
                        alt="User profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="hidden lg:block text-sm font-medium text-foreground max-w-[100px] truncate">
                      {user.displayName || user.email?.split('@')[0]}
                    </span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>

                  <AnimatePresence>
                    {showUserDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-14 w-52 bg-background border border-border rounded-2xl shadow-xl overflow-hidden z-50"
                      >
                        <Link
                          to="/profile"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center gap-2 px-4 py-3 hover:bg-muted transition-colors text-sm"
                        >
                          <User className="w-4 h-4" />
                          Profile
                        </Link>

                        <Link
                          to="/settings"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center gap-2 px-4 py-3 hover:bg-muted transition-colors text-sm"
                        >
                          <Palette className="w-4 h-4" />
                          Settings
                        </Link>

                        <button
                          onClick={() => { handleLogout(); setShowUserDropdown(false) }}
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
              /* Login / Get Started CTA — right-aligned */
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 lg:px-4 py-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="px-4 lg:px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-bold transition-all-300 shadow-lg shadow-primary/20 hover:-translate-y-0.5 hover:shadow-primary/40"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* ── Mobile Controls: Theme toggle + Hamburger — visible only on <md ── */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-muted border border-border text-foreground transition-all"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>

            {/* Hamburger — spec: aria-label="Toggle navigation", aria-expanded */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-lg hover:bg-muted transition-all text-foreground"
              aria-label="Toggle navigation"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mobileMenuOpen ? 'close' : 'open'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {mobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>

        </div>{/* end main row */}
      </div>

      {/* ── Mobile Dropdown Menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-5 space-y-2 transition-all duration-200">

              {/* Mobile Search */}
              <div className="flex items-center bg-muted border border-border rounded-xl px-3 py-3 mb-3">
                <Search className="w-4 h-4 text-muted-foreground mr-2 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search anything..."
                  className="bg-transparent outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Public Links — vertical stacked */}
              {publicLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={closeMobileMenu}
                  className={`nav-link text-base w-full ${isActive(path) ? 'nav-link-active' : 'nav-link-inactive'}`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {label}
                </Link>
              ))}

              {/* Private Links */}
              {user &&
                privateLinks.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={closeMobileMenu}
                    className={`nav-link text-base w-full ${isActive(path) ? 'nav-link-active' : 'nav-link-inactive'}`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {label}
                  </Link>
                ))}

              {/* Divider */}
              <div className="border-t border-border my-2" />

              {user ? (
                /* Authenticated: show profile info + logout */
                <div className="space-y-1">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50">
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <img src="/user.svg" alt="User profile" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {user.displayName || user.email?.split('@')[0]}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-all"
                  >
                    <User className="w-5 h-5" />
                    Profile
                  </Link>

                  <Link
                    to="/settings"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-muted transition-all"
                  >
                    <Palette className="w-5 h-5" />
                    Settings
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout()
                      closeMobileMenu()
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-semibold text-destructive hover:bg-destructive/10 transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              ) : (
                /* Unauthenticated: show login/signup grid */
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="flex justify-center items-center px-4 py-3 bg-muted border border-border rounded-xl font-semibold text-sm text-foreground hover:bg-accent transition-all"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="flex justify-center items-center px-4 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold text-sm transition-all shadow-lg shadow-primary/20"
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