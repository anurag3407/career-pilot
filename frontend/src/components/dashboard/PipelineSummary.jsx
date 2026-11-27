import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Compass, Target } from 'lucide-react'
import { cn } from '../../lib/utils'
import { weeklyAppliedCount } from '../../utils/applicationFlow'

export default function PipelineSummary({
  jobStats,
  trackedJobs = [],
  weeklyApplyTarget = 5,
  nextAction,
}) {
  const reduce = useReducedMotion()
  const inFlight = jobStats.applied + jobStats.interviewing + jobStats.offered
  const responseRate =
    inFlight > 0 ? Math.round(((jobStats.interviewing + jobStats.offered) / inFlight) * 100) : null
  const appliedThisWeek = weeklyAppliedCount(trackedJobs)
  const weeklyPct =
    weeklyApplyTarget > 0 ? Math.min(100, Math.round((appliedThisWeek / weeklyApplyTarget) * 100)) : 0

  const pipeline = [
    { key: 'saved', label: 'Saved', value: jobStats.saved, bar: 'bg-foreground/20' },
    { key: 'applied', label: 'Applied', value: jobStats.applied, bar: 'bg-foreground/65' },
    { key: 'interviewing', label: 'Interviewing', value: jobStats.interviewing, bar: 'bg-primary' },
    { key: 'offered', label: 'Offered', value: jobStats.offered, bar: 'bg-accent-foreground' },
  ]
  const pipelineTotal = pipeline.reduce((sum, stage) => sum + stage.value, 0)

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="flex h-11 items-center justify-between border-b border-border px-5">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/45">
          Pipeline telemetry
        </span>
        <Link
          to="/job-tracker"
          className="inline-flex items-center gap-1 text-[12px] font-medium text-foreground/60 transition-colors hover:text-primary"
        >
          Open board <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </Link>
      </div>

      {/* Main metrics */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[2.5rem] font-medium leading-none tabular-nums tracking-[-0.05em]">
                {responseRate != null ? `${responseRate}%` : 'No data'}
              </p>
              <p className="mt-2 text-[13px] text-foreground/55">
                {inFlight > 0
                  ? `Interview response rate across ${inFlight} sent application${inFlight === 1 ? '' : 's'}`
                  : 'Track applied roles to measure interview conversion'}
              </p>
            </div>

            {weeklyApplyTarget > 0 && (
              <Link
                to="/career-profile"
                className="group flex flex-col items-end rounded-lg border border-border bg-background px-3 py-2 transition-colors hover:border-primary/40"
                title="Adjust weekly apply target in Career Profile"
              >
                <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/45">
                  <Target className="h-3 w-3 text-primary" aria-hidden="true" />
                  Weekly goal
                </span>
                <span className="mt-1 text-sm font-semibold tabular-nums text-foreground">
                  {appliedThisWeek}/{weeklyApplyTarget}{' '}
                  <span className="text-xs font-normal text-foreground/50">({weeklyPct}%)</span>
                </span>
              </Link>
            )}
          </div>

          {/* Segmented Pipeline Bar */}
          <div
            className="mt-6 flex h-2.5 overflow-hidden rounded-full bg-foreground/[0.06]"
            role="img"
            aria-label="Application pipeline breakdown"
          >
            {pipelineTotal > 0 &&
              pipeline.map((stage) =>
                stage.value > 0 ? (
                  <motion.span
                    key={stage.key}
                    className={cn('h-full border-r-2 border-card last:border-r-0', stage.bar)}
                    initial={reduce ? false : { width: 0 }}
                    animate={{ width: `${(stage.value / pipelineTotal) * 100}%` }}
                    transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                  />
                ) : null,
              )}
          </div>

          {/* Clickable Stage Breakdown */}
          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {pipeline.map((stage) => (
              <Link
                key={stage.key}
                to={`/job-tracker?status=${stage.key}`}
                className="group rounded-lg border border-border bg-background/60 px-3.5 py-2.5 transition-colors hover:border-primary/40 hover:bg-background"
              >
                <div className="flex items-center gap-2">
                  <span className={cn('h-2 w-2 rounded-full', stage.bar)} />
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/50 group-hover:text-foreground">
                    {stage.label}
                  </span>
                </div>
                <p className="mt-1.5 text-lg font-medium tabular-nums tracking-tight text-foreground">
                  {stage.value}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Next Best Action Strip */}
        {nextAction && (
          <div className="mt-6 flex flex-col gap-3 rounded-xl border border-primary/25 bg-primary/[0.05] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary/15 text-primary">
                <Compass className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
                  Recommended next move
                </p>
                <p className="mt-0.5 text-[13.5px] font-semibold tracking-tight text-foreground">
                  {nextAction.title}
                </p>
                <p className="text-[12px] text-foreground/55">{nextAction.desc}</p>
              </div>
            </div>
            <Link
              to={nextAction.to}
              className="inline-flex h-8 shrink-0 items-center gap-1.5 self-start rounded-md bg-primary px-3.5 text-[12.5px] font-semibold text-primary-foreground transition hover:brightness-110 sm:self-auto"
            >
              {nextAction.cta} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
