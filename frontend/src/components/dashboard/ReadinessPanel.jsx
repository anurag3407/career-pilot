import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Check } from 'lucide-react'
import { cn } from '../../lib/utils'

/**
 * ReadinessPanel: computes Career Readiness strictly from real user state
 * (master profile, resumes, GitHub connection, portfolios, mock interviews)
 * and renders one-click launchpad actions.
 */
export default function ReadinessPanel({
  steps = [],
  quickActions = [],
  dismissed = false,
  onDismiss,
  onRestore,
}) {
  const reduce = useReducedMotion()
  const doneCount = steps.filter((s) => s.done).length
  const totalCount = steps.length || 1
  const pct = Math.round((doneCount / totalCount) * 100)
  const allDone = doneCount === steps.length

  return (
    <div className="flex h-full flex-col gap-5">
      {/* Readiness Meter */}
      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex h-11 items-center justify-between border-b border-border px-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/45">
            Workspace readiness ({doneCount}/{steps.length})
          </span>
          {!allDone && (
            dismissed ? (
              <button
                type="button"
                onClick={onRestore}
                className="text-[12px] font-medium text-primary hover:underline"
              >
                Show checklist
              </button>
            ) : (
              <button
                type="button"
                onClick={onDismiss}
                className="text-[12px] font-medium text-foreground/45 transition-colors hover:text-foreground"
              >
                Minimize
              </button>
            )
          )}
        </div>

        <div className="p-5">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-[13px] font-medium text-foreground/65">
              {allDone
                ? 'All core career assets connected'
                : 'Complete your setup so AI tools share context'}
            </p>
            <span className="font-mono text-sm font-semibold tabular-nums text-primary">
              {pct}%
            </span>
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-foreground/[0.07]">
            <motion.div
              className={cn('h-full rounded-full', allDone ? 'bg-accent-foreground' : 'bg-primary')}
              initial={reduce ? false : { width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          {(!dismissed || allDone) && (
            <ul className="mt-4 space-y-1.5">
              {steps.map((step) => (
                <li key={step.id}>
                  <Link
                    to={step.to}
                    className={cn(
                      'group flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-[13px] transition-colors',
                      step.done
                        ? 'border-border/60 bg-background/40 text-foreground/55 hover:border-border'
                        : 'border-border bg-background text-foreground hover:border-primary/40',
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span
                        className={cn(
                          'grid h-5 w-5 shrink-0 place-items-center rounded-full border',
                          step.done
                            ? 'border-accent-foreground/40 bg-accent text-accent-foreground'
                            : 'border-dashed border-foreground/30 text-foreground/35',
                        )}
                      >
                        {step.done && <Check className="h-3 w-3" aria-hidden="true" />}
                      </span>
                      <span className={cn('truncate font-medium', step.done && 'line-through decoration-foreground/30')}>
                        {step.label}
                      </span>
                    </span>
                    <ArrowUpRight
                      className="h-3.5 w-3.5 shrink-0 text-foreground/30 transition group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Quick Launchpad */}
      <section className="flex-1 overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex h-11 items-center justify-between border-b border-border px-5">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/45">
            Quick launch
          </span>
        </div>
        <div className="grid grid-cols-2 gap-px bg-border">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.to}
              className="group flex items-center gap-2.5 bg-card px-4 py-3.5 text-[13px] font-medium text-foreground/80 transition-colors hover:bg-background hover:text-foreground"
            >
              <action.icon
                className="h-4 w-4 shrink-0 text-foreground/45 transition-colors group-hover:text-primary"
                aria-hidden="true"
              />
              <span className="truncate">{action.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
