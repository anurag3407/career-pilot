import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlarmClock, Mic, Layers, ArrowRight, PartyPopper, Target, CalendarDays,
} from 'lucide-react'
import MessageComposer from '../MessageComposer'
import {
  dueFollowUps,
  interviewsSoon,
  quietApplications,
  weeklyAppliedCount,
  FOLLOW_UP_DAYS,
  QUIET_DAYS,
} from '../../utils/applicationFlow'

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

/**
 * DueToday: the follow-up calendar. Answers "what is due today": day-7
 * follow-ups, interviews in the next 48h, applications gone quiet, and the
 * weekly apply target.
 */
export default function DueToday({ jobs = [], weeklyTarget = 5 }) {
  const [composerJob, setComposerJob] = useState(null)
  const followUps = dueFollowUps(jobs)
  const soonInterviews = interviewsSoon(jobs)
  const quiet = quietApplications(jobs)
  const appliedThisWeek = weeklyAppliedCount(jobs)

  const hasDue = followUps.length || soonInterviews.length || quiet.length
  const nextSaved = jobs.find((j) => (j.status || 'saved') === 'saved' && !j.packet?.tailoredResumeText)

  if (!jobs.length) return null

  return (
    <div className="overflow-hidden rounded-xl border border-amber-500/30 bg-amber-500/[0.04]">
      <div className="flex h-11 items-center justify-between border-b border-amber-500/15 px-5">
        <span className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-600 dark:text-amber-400">
          <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" /> Due today
        </span>
        {weeklyTarget > 0 && (
          <span className="flex items-center gap-1.5 text-[12px] font-medium text-foreground/65 tabular-nums">
            <Target className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            {appliedThisWeek}/{weeklyTarget} applied this week
          </span>
        )}
      </div>

      {/* Weekly target progress */}
      {weeklyTarget > 0 && (
        <div className="h-1 bg-foreground/[0.06]">
          <div
            className={`h-full transition-all ${appliedThisWeek >= weeklyTarget ? 'bg-accent-foreground' : 'bg-amber-500'}`}
            style={{ width: `${Math.min(100, (appliedThisWeek / weeklyTarget) * 100)}%` }}
          />
        </div>
      )}

      <div className="divide-y divide-border/60">
        {/* Day-7 follow-ups due */}
        {followUps.map((job) => (
          <div key={`fu-${job.id}`} className="flex items-center justify-between gap-3 px-5 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <AlarmClock className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13.5px] font-semibold tracking-tight">
                  Follow up: {job.company}
                </p>
                <p className="truncate text-[12px] text-foreground/55">
                  {job.title} (due {fmtDate(job.nextActionAt)})
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setComposerJob(job)}
              className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-amber-500/15 px-3 text-[12px] font-semibold text-amber-700 dark:text-amber-300 transition hover:bg-amber-500/25"
            >
              Draft <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </button>
          </div>
        ))}

        {/* Interviews in the next 48h */}
        {soonInterviews.map((job) => (
          <div key={`iv-${job.id}`} className="flex items-center justify-between gap-3 px-5 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary/15 text-primary">
                <Mic className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13.5px] font-semibold tracking-tight">
                  Interview: {job.company}
                </p>
                <p className="truncate text-[12px] text-foreground/55">
                  {job.title} ({fmtDate(job.interviewAt)})
                </p>
              </div>
            </div>
            <Link
              to={`/mock-interview/practice?job=${job.id}`}
              className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-primary/15 px-3 text-[12px] font-semibold text-primary transition hover:bg-primary/25"
            >
              Practice <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>
        ))}

        {/* Quiet applications (14 days, no follow-up scheduled) */}
        {quiet.map((job) => (
          <div key={`q-${job.id}`} className="flex items-center justify-between gap-3 px-5 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                <AlarmClock className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13.5px] font-semibold tracking-tight">
                  Gone quiet: {job.company}
                </p>
                <p className="truncate text-[12px] text-foreground/55">
                  {job.title} (no activity for {QUIET_DAYS}+ days)
                </p>
              </div>
            </div>
            <Link
              to={`/job-tracker?job=${job.id}&packet=1`}
              className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-[12px] font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
            >
              Open card <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>
        ))}

        {/* Nothing due */}
        {!hasDue && nextSaved && (
          <div className="flex items-center justify-between gap-3 px-5 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary/15 text-primary">
                <Layers className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13.5px] font-semibold tracking-tight">
                  Nothing due today: build your next application packet
                </p>
                <p className="truncate text-[12px] text-foreground/55">
                  {nextSaved.title} at {nextSaved.company}
                </p>
              </div>
            </div>
            <Link
              to={`/job-tracker?job=${nextSaved.id}&packet=1`}
              className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md bg-primary px-3 text-[12px] font-semibold text-primary-foreground transition hover:brightness-110"
            >
              Build packet <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>
        )}
        {!hasDue && !nextSaved && appliedThisWeek >= weeklyTarget && (
          <div className="flex items-center gap-3 px-5 py-4">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-accent text-accent-foreground">
              <PartyPopper className="h-4 w-4" aria-hidden="true" />
            </span>
            <p className="text-[13.5px] font-semibold tracking-tight">
              Weekly target met and nothing overdue. Save more roles to keep your pipeline moving.
            </p>
          </div>
        )}
      </div>

      <p className="border-t border-amber-500/15 px-5 py-2.5 text-[11px] text-foreground/50">
        Follow-ups surface {FOLLOW_UP_DAYS} days after you mark a card applied. Scheduled interviews appear 48h in advance.
      </p>

      {composerJob && (
        <MessageComposer
          job={composerJob}
          variant="drawer"
          initialTemplate="follow_up"
          onClose={() => setComposerJob(null)}
        />
      )}
    </div>
  )
}
