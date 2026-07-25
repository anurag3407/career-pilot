import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown,
} from 'lucide-react'
import { FEATURES } from '../data/featuresConfig'

export default function Navbar() {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showProductsDropdown, setShowProductsDropdown] = useState(false)

  const productLinks = FEATURES.map(feature => ({
    path: `/${feature.slug}`,
    label: feature.name,
    description: feature.tagline.split('.')[0],
    icon: feature.icon
  }))

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleHomeClick = (e) => {
    if (location.pathname === '/' && e.button === 0 && !e.metaKey && !e.ctrlKey) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-border shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" onClick={handleHomeClick} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 flex items-center justify-center rounded-lg overflow-hidden group-hover:scale-105 transition-transform">
              <img src="/speed.png" alt="CareerPilot" className="w-full h-full object-contain" />
            </div>
            <span className="text-lg font-black tracking-tight text-foreground">
              careerpilot
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {/* Products Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowProductsDropdown(true)}
              onMouseLeave={() => setShowProductsDropdown(false)}
            >
              <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/60 transition-all">
                Products
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showProductsDropdown ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showProductsDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[540px] bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl p-3 grid grid-cols-2 gap-1 z-50"
                  >
                    {productLinks.map(({ path, label, description, icon: Icon }) => (
                      <Link
                        key={path}
                        to={path}
                        onClick={() => setShowProductsDropdown(false)}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted transition-colors group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                          <Icon className="w-4.5 h-4.5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{description}</p>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="ml-2 p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ y: 12, opacity: 0, rotate: 30 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: -12, opacity: 0, rotate: -30 }}
                  transition={{ duration: 0.15 }}
                >
                  {theme === 'light' ? <Moon className="w-[18px] h-[18px]" /> : <Sun className="w-[18px] h-[18px]" />}
                </motion.div>
              </AnimatePresence>
            </button>

            {/* Divider */}
            <div className="w-px h-5 bg-border mx-3" />

            {/* Auth Buttons */}
            {user ? (
              <Link
                to="/dashboard"
                className="px-5 py-2 bg-foreground text-background rounded-lg text-sm font-black transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-foreground text-background rounded-lg text-sm font-black transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile: Theme + Hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-muted transition-all"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 py-5 space-y-4">
              {/* Products */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 px-2 mb-2">Products</p>
                <div className="space-y-0.5">
                  {productLinks.map(({ path, label, icon: Icon }) => (
                    <Link
                      key={path}
                      to={path}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-foreground hover:bg-muted transition-colors"
                    >
                      <Icon className="w-4 h-4 text-primary" />
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border-t border-border" />

              {/* Auth */}
              {user ? (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex justify-center items-center px-4 py-3 bg-foreground text-background rounded-xl text-sm font-black"
                >
                  Dashboard
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex justify-center items-center px-4 py-3 border border-border rounded-xl text-sm font-bold"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex justify-center items-center px-4 py-3 bg-foreground text-background rounded-xl text-sm font-black"
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
