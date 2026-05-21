import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
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
    { path: '/#portfolio', label: 'Portfolio', icon: User },
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
          ? 'bg-background/70 backdrop-blur-xl border-b border-border shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link
            to="/"
            onClick={handleHomeClick}
            className="flex items-center gap-2 group"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-xl overflow-hidden group-hover:scale-105 transition-transform">
              <img
                src="/speed.png"
                alt="CareerPilot logo"
                className="w-full h-full object-contain"
              />
            </div>

            <span className="text-xl font-bold text-foreground tracking-tight">
              CareerPilot
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">

            {/* Search Bar */}
            <div className="relative">
              <div className="flex items-center bg-muted border border-border rounded-xl px-3 py-2 w-72 focus-within:ring-2 focus-within:ring-primary/40 transition-all">
                <Search className="w-4 h-4 text-muted-foreground mr-2" />

                <input
                  type="text"
                  placeholder="Search anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  className="bg-transparent outline-none text-sm w-full text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Suggestions Dropdown */}
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute top-14 left-0 w-full bg-background border border-border rounded-xl shadow-xl overflow-hidden"
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

            {/* Public Links */}
            {publicLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(path)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}

            {/* Private Links */}
            {user &&
              privateLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(path)
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">

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
                <button className="relative p-2 rounded-xl bg-muted border border-border hover:bg-accent transition-all">
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
                  className="px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-bold transition-all shadow-lg shadow-primary/20"
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

              {/* Mobile Search */}
              <div className="flex items-center bg-muted border border-border rounded-xl px-3 py-3">
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
                  className="flex items-center gap-3 px-4 py-4 rounded-xl text-base font-semibold hover:bg-muted transition-all"
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </Link>
              ))}

              {user &&
                privateLinks.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-4 rounded-xl text-base font-semibold hover:bg-muted transition-all"
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </Link>
                ))}

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