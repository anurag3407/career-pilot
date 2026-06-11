import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Bell,
  Briefcase,
  FileText,
  Home,
  LayoutDashboard,
  Linkedin,
  Mail,
  Menu,
  Mic,
  Palette,
  Settings,
  Target,
  User,
  Users,
  X,
} from 'lucide-react'
import { cn } from '../../lib/utils'

const defaultNavigationGroups = [
  {
    label: 'Main navigation',
    items: [
      { to: '/', label: 'Home', icon: Home, exact: true },
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/jobs', label: 'Jobs', icon: Briefcase },
      { to: '/job-alerts', label: 'Job Alerts', icon: Bell },
      { to: '/interview-prep', label: 'Interview Prep', icon: Mic },
      { to: '/community', label: 'Community', icon: Users },
      { to: '/upload', label: 'Upload Resume', icon: FileText },
      { to: '/resume-builder', label: 'Resume Builder', icon: FileText },
      { to: '/email-generator', label: 'Email Generator', icon: Mail },
      { to: '/linkedin-optimizer', label: 'LinkedIn Optimizer', icon: Linkedin },
      { to: '/skill-gap', label: 'Skill Gap', icon: Target },
      { to: '/templates', label: 'Templates', icon: Palette },
      { to: '/portfolio', label: 'Portfolio', icon: User },
      { to: '/settings', label: 'Settings', icon: Settings },
    ],
  },
]

function isPathActive(pathname, targetPath, exact = false) {
  if (exact) {
    return pathname === targetPath
  }

  if (targetPath === '/') {
    return pathname === '/'
  }

  return pathname === targetPath || pathname.startsWith(`${targetPath}/`)
}

function DrawerLink({ item, pathname, onNavigate }) {
  const Icon = item.icon
  const active = isPathActive(pathname, item.to, item.exact)

  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        active
          ? 'border-primary/30 bg-primary/10 text-foreground'
          : 'border-border/60 bg-background/60 text-muted-foreground hover:bg-muted hover:text-foreground'
      )}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="flex-1">{item.label}</span>
    </Link>
  )
}

export default function Drawer({
  groups = defaultNavigationGroups,
  label = 'Mobile navigation',
  triggerLabel = 'Open navigation menu',
  drawerTitle = 'Navigation',
  className,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const drawerRef = useRef(null)
  const triggerRef = useRef(null)
  const location = useLocation()

  const pathname = location.pathname

  const visibleGroups = useMemo(() => groups.filter((group) => group?.items?.length), [groups])

  const openDrawer = () => {
    setIsMounted(true)
    setIsOpen(true)
  }

  const closeDrawer = () => {
    setIsOpen(false)
    triggerRef.current?.focus()
  }

  useEffect(() => {
    if (!isMounted) return undefined

    if (isOpen) {
      const focusableSelector = [
        'button:not([disabled])',
        '[href]',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ].join(', ')

      const getFocusableElements = () =>
        Array.from(drawerRef.current?.querySelectorAll(focusableSelector) ?? []).filter(
          (element) => !element.hasAttribute('disabled') && element.tabIndex !== -1
        )

      const focusFirstElement = () => {
        const focusableElements = getFocusableElements()
        focusableElements[0]?.focus()
      }

      const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
          setIsOpen(false)
          triggerRef.current?.focus()
          return
        }

        if (event.key !== 'Tab') {
          return
        }

        const focusableElements = getFocusableElements()

        if (!focusableElements.length) {
          event.preventDefault()
          return
        }

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]
        const activeElement = document.activeElement
        const isFocusInsideDrawer = drawerRef.current?.contains(activeElement)

        if (event.shiftKey) {
          if (!isFocusInsideDrawer || activeElement === firstElement) {
            event.preventDefault()
            lastElement.focus()
          }

          return
        }

        if (!isFocusInsideDrawer || activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }

      const handlePointerDown = (event) => {
        if (!drawerRef.current) return
        if (drawerRef.current.contains(event.target)) return
        setIsOpen(false)
        triggerRef.current?.focus()
      }

      const previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('pointerdown', handlePointerDown)
      focusFirstElement()

      return () => {
        document.body.style.overflow = previousOverflow
        document.removeEventListener('keydown', handleKeyDown)
        document.removeEventListener('pointerdown', handlePointerDown)
      }
    }

    const closeTimer = window.setTimeout(() => {
      setIsMounted(false)
    }, 300)

    return () => {
      window.clearTimeout(closeTimer)
    }
  }, [isMounted, isOpen])

  return (
    <div className={cn('md:hidden', className)}>
      <button
        type="button"
        ref={triggerRef}
        onClick={openDrawer}
        aria-label={triggerLabel}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation-drawer"
        aria-haspopup="dialog"
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      {isMounted && (
        <div className="fixed inset-0 z-50 md:hidden" aria-hidden={!isOpen}>
          {/* Backdrop closes the drawer when the user taps outside the panel. */}
          <button
            type="button"
            tabIndex={-1}
            aria-label="Close navigation drawer"
            onClick={closeDrawer}
            className={cn(
              'absolute inset-0 h-full w-full bg-slate-950/50 backdrop-blur-sm transition-opacity duration-300',
              isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
            )}
          />

          <aside
            id="mobile-navigation-drawer"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            className={cn(
              'relative flex h-full w-[86vw] max-w-sm flex-col border-r border-border bg-background shadow-2xl transition-transform duration-300 ease-out',
              isOpen ? 'translate-x-0' : '-translate-x-full'
            )}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Career-pilot
                </p>
                <h2 className="text-lg font-semibold text-foreground">{drawerTitle}</h2>
              </div>

              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close navigation menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <nav
              aria-label={label}
              className="flex-1 overflow-y-auto px-4 py-5"
            >
              <div className="space-y-6">
                {visibleGroups.map((group) => (
                  <section key={group.label} className="space-y-3">
                    <h3 className="px-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {group.label}
                    </h3>

                    <div className="space-y-2">
                      {group.items.map((item) => (
                        <DrawerLink
                          key={item.to}
                          item={item}
                          pathname={pathname}
                          onNavigate={closeDrawer}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </nav>
          </aside>
        </div>
      )}
    </div>
  )
}
