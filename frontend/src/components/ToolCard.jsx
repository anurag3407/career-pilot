import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '../lib/utils'

const COLOR_STYLES = {
  primary: 'bg-primary/10 border-primary/25 text-primary',
  secondary: 'bg-secondary/10 border-secondary/25 text-secondary',
  emerald: 'bg-accent border-accent-foreground/25 text-accent-foreground',
  'emerald-500': 'bg-accent border-accent-foreground/25 text-accent-foreground',
  amber: 'bg-amber-500/10 border-amber-500/25 text-amber-600 dark:text-amber-400',
  foreground: 'bg-muted border-border text-foreground',
}

export default function ToolCard({
  to,
  icon: Icon,
  title,
  description,
  color = 'primary',
  badge,
  onClick,
  actionLabel = 'Open',
}) {
  const iconTone = COLOR_STYLES[color] || COLOR_STYLES.primary

  const inner = (
    <div className="group relative flex h-full flex-col justify-between rounded-xl border border-border bg-card p-5 transition-colors duration-200 hover:border-primary/40 hover:bg-background">
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border transition-transform duration-200 group-hover:scale-105',
              iconTone,
            )}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>

          {badge && (
            <span className="rounded-md border border-border bg-muted px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/75">
              {badge}
            </span>
          )}
        </div>

        <h3 className="text-[15px] font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
          {title}
        </h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-muted-foreground transition-colors group-hover:text-primary">
        <span>{actionLabel}</span>
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
      </div>
    </div>
  )

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="block h-full w-full text-left cursor-pointer">
        {inner}
      </button>
    )
  }

  return (
    <Link to={to} className="block h-full">
      {inner}
    </Link>
  )
}
