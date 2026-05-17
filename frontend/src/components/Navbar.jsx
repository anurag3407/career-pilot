import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { isNavActive } from '../lib/nav'
import {
  Zap,
  Search,
  FileText,
  LayoutDashboard,
  Menu,
  X,
  LogOut,
  User,
  Bell,
  Users,
  GraduationCap,
  Mic
} from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

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

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/jobs', label: 'Find Jobs', icon: Search },
    { path: '/job-alerts', label: 'Alerts', icon: Bell },
    { path: '/interview-prep', label: 'Interview', icon: Mic },
    { path: '/fellowship', label: 'Fellowship', icon: GraduationCap },
    { path: '/community', label: 'Community', icon: Users },
    { path: '/upload', label: 'Resume', icon: FileText },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
      ? 'bg-black/80 backdrop-blur-xl border-b border-zinc-800'
      : 'bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-12 h-8 flex items-center justify-center">
              <img src="/speed.png" alt="" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-bold text-white">
              careerpilot
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {user ? (
              <>
                {navLinks.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border-b-2 ${isNavActive(path, location.pathname)
                      ? 'bg-zinc-800 text-white border-indigo-400'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border-transparent'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                ))}
              </>
            ) : null}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center">
                    <img src="/user.svg" alt="" />
                  </div>
                  <span className="text-sm font-medium text-zinc-300 max-w-[120px] truncate">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-zinc-400 hover:text-red-400 hover:bg-red-950/50 rounded-lg text-sm font-medium transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-zinc-400 hover:text-white text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-white hover:bg-zinc-200 text-black rounded-lg text-sm font-medium transition-all"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-zinc-900 text-zinc-400 cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-black/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-2">
            {user ? (
              <>
                {/* User Info */}
                <div className="flex items-center gap-3 px-3 py-3 bg-zinc-900 rounded-xl mb-4 border border-zinc-800">
                  <div className="w-10 h-10 bg-sky-500/20 border border-sky-500/30 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-sky-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {user.displayName || 'User'}
                    </p>
                    <p className="text-sm text-zinc-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Nav Links */}
                {navLinks.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all border-l-2 ${isNavActive(path, location.pathname)
                      ? 'bg-zinc-800 text-white border-indigo-400'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-white border-transparent'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    {label}
                  </Link>
                ))}

                {/* Logout */}
                <button
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-medium text-red-400 hover:bg-red-950/50 transition-all cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-zinc-400 hover:bg-zinc-900 hover:text-white rounded-xl text-base font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 bg-white text-black rounded-xl text-base font-medium text-center"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
