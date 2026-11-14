import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Moon, Sun, Github } from 'lucide-react'
import { useTheme } from '../../../hooks/useTheme'
import { cn } from '../../../lib/utils'
import { GhostButton, PrimaryButton, Wordmark, REPO_URL } from './primitives'

const LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Templates', href: '#templates' },
  { label: 'Compare', href: '#compare' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Pricing', to: '/pricing' },
]

export function ThemeSwitch({ className }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch theme (current: ${theme})`}
      className={cn(
        'grid h-8 w-8 place-items-center rounded-md border border-transparent text-foreground/55 transition hover:border-border hover:text-foreground',
        className,
      )}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}

function NavLink({ item, onClick, className }) {
  const cls = cn(
    'rounded px-2.5 py-1.5 transition-colors hover:bg-primary/10 hover:text-primary',
    className,
  )
  return item.to ? (
    <Link to={item.to} className={cls} onClick={onClick}>
      {item.label}
    </Link>
  ) : (
    <a href={item.href} className={cls} onClick={onClick}>
      {item.label}
    </a>
  )
}

export default function FlightNav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-colors duration-300',
        scrolled || open
          ? 'border-border/70 bg-background/80 backdrop-blur-xl'
          : 'border-transparent bg-transparent',
      )}
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-8 lg:px-0">
        <Link to="/" aria-label="CareerPilot home" className="shrink-0">
          <Wordmark />
        </Link>

        <div className="hidden items-center gap-0.5 text-[13px] text-foreground/60 md:flex">
          {LINKS.map((l) => (
            <NavLink key={l.label} item={l} />
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-foreground/45 transition hover:text-foreground"
          >
            <Github className="h-3.5 w-3.5" /> Source
          </a>
          <ThemeSwitch />
          <GhostButton to="/login" size="sm">
            Sign in
          </GhostButton>
          <PrimaryButton to="/register" size="sm">
            Start free
          </PrimaryButton>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeSwitch />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="grid h-9 w-9 place-items-center rounded-md text-foreground/70 hover:text-foreground"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border/70 px-5 pb-5 pt-3 md:hidden">
          <div className="flex flex-col text-[15px] text-foreground/75">
            {LINKS.map((l) => (
              <NavLink key={l.label} item={l} onClick={() => setOpen(false)} className="px-0 py-2.5 hover:bg-transparent" />
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <GhostButton to="/login">Sign in</GhostButton>
            <PrimaryButton to="/register">Start free</PrimaryButton>
          </div>
        </div>
      )}
    </header>
  )
}
