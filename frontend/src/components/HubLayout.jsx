import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ChevronRight } from 'lucide-react'

const CHIP = {
  primary: 'bg-primary/10 border-primary/25 text-primary',
  secondary: 'bg-secondary/10 border-secondary/25 text-secondary',
  amber: 'bg-amber-500/10 border-amber-500/25 text-amber-600 dark:text-amber-400',
  emerald: 'bg-accent border-accent-foreground/25 text-accent-foreground',
  foreground: 'bg-muted border-border text-foreground',
}

export default function HubLayout({
  icon: Icon,
  title,
  description,
  color = 'primary',
  breadcrumb,
  suite,
  actions,
  children,
  stats,
}) {
  const chip = CHIP[color] || CHIP.primary
  const reduce = useReducedMotion()

  return (
    <div className="cp-flight min-h-full bg-background text-foreground antialiased">
      <div className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Command Center
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="font-semibold text-foreground">{breadcrumb || title}</span>
          </div>

          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>

        {/* Hub Header */}
        <motion.header
          initial={reduce ? false : { opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative mb-8 overflow-hidden rounded-xl border border-border bg-card"
        >
          <div className="fd-grid-bg pointer-events-none absolute inset-0 opacity-60" />
          <div className="relative p-6 sm:p-8">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-primary/85">
              {suite || breadcrumb || title}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${chip}`}>
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-semibold tracking-[-0.03em] text-foreground sm:text-3xl">
                  {title}
                </h1>
                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                  {description}
                </p>
              </div>
            </div>

            {stats && stats.length > 0 && (
              <div className="relative mt-6 flex flex-wrap gap-6 border-t border-border pt-5">
                {stats.map((stat, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.bg || 'bg-muted'}`}>
                      <stat.icon className={`h-4 w-4 ${stat.color || 'text-muted-foreground'}`} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold leading-none tabular-nums text-foreground">
                        {stat.value}
                      </p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.header>

        {/* Tool Grid */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/55">
            <span className="h-3.5 w-1 rounded-full bg-primary" />
            Workspace tools
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {children}
          </div>
        </section>
      </div>
    </div>
  )
}
