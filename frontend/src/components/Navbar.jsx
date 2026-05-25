import { useState, useEffect } from 'react'
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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass border-b border-border shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">

          {/* Logo Container */}
          <Link
            to="/"
            onClick={handleHomeClick}
            className="flex items-center gap-2 group shrink-0"
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

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-1.5 flex-1 justify-center overflow-x-auto no-scrollbar">

            {/* Search Input Layout */}
            <div className="relative">
              <div className="flex items-center bg-muted border border-border rounded-xl px-2.5 py-1.5 w-48 xl:w-56 focus-within:ring-2 focus-within:ring-primary/40 transition-all">
                <Search className="w-3.5 h-3.5 text-muted-foreground mr-1.5 shrink-0" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  className="bg-transparent outline-none text-xs w-full text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Suggestions View Dropdown */}
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute top-12 left-0 w-full bg-background border border-border rounded-xl shadow-xl overflow-hidden z-50"
                  >
                    {searchSuggestions.map((item, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-3 py-2 hover:bg-muted transition-colors text-xs text-foreground"
                      >
                        {item}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Public Access Buttons */}
            {publicLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`nav-link text-xs px-2.5 py-1.5 flex items-center gap-1.5 shrink-0 ${isActive(path) ? 'nav-link-active' : 'nav-link-inactive'}`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Link>
            ))}

            {/* Logged-In Internal App Views */}
            {user &&
              privateLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`nav-link text-xs px-2.5 py-1.5 flex items-center gap-1.5 shrink-0 ${isActive(path) ? 'nav-link-active' : 'nav-link-inactive'}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              ))}
          </div>

          {/* Desktop Controls Group */}
          <div className="hidden xl:flex items-center gap-2 shrink-0">

            {/* Mode Shift Switch */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-xl bg-muted hover:bg-accent border border-border text-foreground transition-all"
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
                    <Moon className="w-4 h-4" />
                  ) : (
                    <Sun className="w-4 h-4" />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>

            {user ? (
              <>
                <button
                  className="relative p-1.5 rounded-xl bg-muted border border-border hover:bg-accent transition-all"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4 text-foreground" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </button>

                {/* Profile Dashboard Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-muted border border-border rounded-full hover:bg-accent transition-all"
                    aria-label="User menu"
                    aria-expanded={showDropdown}
                  >
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center">
                      <img
                        src="/user.svg"
                        alt="User profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs font-medium text-foreground max-w-[80px] truncate">
                      {user.displayName || user.email?.split('@')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>

                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-12 w-48 bg-background border border-border rounded-2xl shadow-xl overflow-hidden z-50"
                      >
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-4 py-2.5 hover:bg-muted transition-colors text-xs"
                        >
                          <User className="w-3.5 h-3.5" />
                          Profile
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center gap-2 px-4 py-2.5 hover:bg-muted transition-colors text-xs"
                        >
                          <Palette className="w-3.5 h-3.5" />
                          Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-left hover:bg-destructive/10 text-destructive transition-colors text-xs"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-muted-foreground hover:text-foreground text-xs font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-xs font-bold transition-all shadow-md shadow-primary/20"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Small Screen Layout Action Controls */}
          <div className="flex items-center gap-2 xl:hidden">
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
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
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

      {/* Mobile Drawer Navigation Links Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden border-t border-border bg-background/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-6 space-y-3 max-h-[calc(100vh-4rem)] overflow-y-auto纯">

              <div className="flex items-center bg-muted border border-border rounded-xl px-3 py-2.5">
                <Search className="w-4 h-4 text-muted-foreground mr-2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent outline-none text-sm w-full"
                />
              </div>

              {publicLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`nav-link text-sm flex items-center gap-2 py-2 ${isActive(path) ? 'nav-link-active' : 'nav-link-inactive'}`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}

              {user &&
                privateLinks.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`nav-link text-sm flex items-center gap-2 py-2 ${isActive(path) ? 'nav-link-active' : 'nav-link-inactive'}`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                ))}

              {user ? (
                <button
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-destructive hover:bg-destructive/10 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex justify-center items-center px-4 py-2.5 bg-muted rounded-xl font-semibold text-sm"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex justify-center items-center px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm"
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