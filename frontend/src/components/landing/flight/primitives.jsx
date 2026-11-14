import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { cn } from '../../../lib/utils'

export const REPO_URL = 'https://github.com/anurag3407/career-pilot'

/** `// Label` — the mono section eyebrow used across the Flight Deck UI. */
export function Eyebrow({ children, className }) {
  return (
    <span className={cn('font-mono text-[10px] uppercase tracking-[0.22em] text-primary/85', className)}>
      // {children}
    </span>
  )
}

/** Mono micro-label (table headers, card tags, stat captions). */
export function MonoLabel({ children, className }) {
  return (
    <span className={cn('font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40', className)}>
      {children}
    </span>
  )
}

export function Section({ id, children, className, inner }) {
  return (
    <section id={id} className={cn('relative px-5 py-20 sm:px-8 sm:py-28 lg:px-12', className)}>
      <div className={cn('mx-auto max-w-6xl', inner)}>{children}</div>
    </section>
  )
}

export function SectionHeading({ eyebrow, title, lede, className, children }) {
  return (
    <div className={cn('max-w-2xl', className)}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-4 text-[1.75rem] font-medium leading-[1.08] tracking-[-0.035em] text-balance sm:text-4xl lg:text-[2.6rem]">
        {title}
      </h2>
      {lede && <p className="mt-4 max-w-xl text-[14.5px] leading-7 text-foreground/58">{lede}</p>}
      {children}
    </div>
  )
}

const btnBase =
  'group inline-flex items-center justify-center gap-2 rounded-md font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

export function PrimaryButton({ to, children, size = 'md', className, arrow = true }) {
  return (
    <Link
      to={to}
      className={cn(
        btnBase,
        'bg-primary text-primary-foreground shadow-[0_14px_40px_-18px_var(--primary)] hover:brightness-110',
        size === 'sm' ? 'px-3.5 py-1.5 text-[12.5px]' : 'px-5 py-2.5 text-sm',
        className,
      )}
    >
      {children}
      {arrow && <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />}
    </Link>
  )
}

export function GhostButton({ to, href, children, size = 'md', className }) {
  const cls = cn(
    btnBase,
    'border border-border bg-background/40 text-foreground/80 backdrop-blur-sm hover:border-foreground/30 hover:text-foreground',
    size === 'sm' ? 'px-3.5 py-1.5 text-[12.5px]' : 'px-5 py-2.5 text-sm',
    className,
  )
  if (href) {
    return (
      <a href={href} className={cls} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
        {children}
      </a>
    )
  }
  return (
    <Link to={to} className={cls}>
      {children}
    </Link>
  )
}

/** Fade-up on first scroll into view. No-ops for reduced-motion users. */
export function Reveal({ children, delay = 0, className, as = 'div' }) {
  const reduce = useReducedMotion()
  const Comp = motion[as] || motion.div
  if (reduce) return <Comp className={className}>{children}</Comp>
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  )
}

/** CareerPilot mark: a heading chevron inside a rounded tile. */
export function LogoMark({ className }) {
  return (
    <span
      className={cn(
        'inline-grid h-6 w-6 place-items-center rounded-[7px] bg-foreground text-background',
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
        <path d="M2.5 9.5 13.5 3l-4 11-1.8-4.7L2.5 9.5Z" fill="currentColor" />
        <path d="M7.7 9.3 13.5 3" stroke="var(--primary)" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </span>
  )
}

export function Wordmark({ className }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <LogoMark />
      <span className="text-[15px] font-semibold tracking-[-0.03em]">careerpilot</span>
    </span>
  )
}
