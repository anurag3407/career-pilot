import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { FileText, Sparkles, Briefcase, Mic, Palette, GitBranch, Check, Command } from 'lucide-react'
import { cn } from '../../../lib/utils'

/* Illustrative product preview — coded, not a screenshot, so it follows the
   theme and stays crisp at any size. All names/companies are fictional. */

function useCountUp(target, start, { from = 0, duration = 1400 } = {}) {
  const [value, setValue] = useState(from)
  const reduce = useReducedMotion()
  useEffect(() => {
    if (!start) return
    if (reduce) {
      setValue(target)
      return
    }
    let raf
    const t0 = performance.now()
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(from + (target - from) * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [start, target, from, duration, reduce])
  return value
}

const RAIL = [FileText, Sparkles, Briefcase, Mic, Palette, GitBranch]

function Line({ w, className }) {
  return <div className={cn('h-[5px] rounded-full bg-foreground/[0.09]', className)} style={{ width: w }} />
}

function ScoreRing({ value }) {
  const r = 34
  const c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 80 80" className="h-[84px] w-[84px] -rotate-90">
      <circle cx="40" cy="40" r={r} fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="6" />
      <circle
        cx="40"
        cy="40"
        r={r}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - value / 100)}
      />
    </svg>
  )
}

const PIPE = [
  { label: 'Saved', n: 12, cards: 2 },
  { label: 'Applied', n: 8, cards: 2 },
  { label: 'Interview', n: 3, cards: 1, hot: true },
  { label: 'Offer', n: 1, cards: 1, win: true },
]

export default function ProductMockup() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-120px' })
  const score = useCountUp(91, inView, { from: 62 })
  const rewritten = score > 80

  return (
    <div ref={ref} className="relative mx-auto max-w-6xl">
      {/* glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-10 -top-10 bottom-10 rounded-[40px] opacity-80 blur-3xl"
        style={{ background: 'radial-gradient(60% 50% at 50% 30%, var(--fd-glow), transparent 70%)' }}
      />

      <div className="relative overflow-hidden rounded-[14px] border border-border bg-card shadow-[0_50px_120px_-50px_rgba(0,0,0,0.35)]">
        {/* title bar */}
        <div className="flex h-10 items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-2.5 w-2.5 rounded-full bg-foreground/[0.12]" />
            ))}
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/40">
            careerpilot <span className="text-foreground/20">/</span> resume studio
          </span>
          <span className="inline-flex items-center gap-1 font-mono text-[10px] text-foreground/30">
            <Command className="h-3 w-3" /> K
          </span>
        </div>

        <div className="grid min-h-[22rem] grid-cols-[3rem_minmax(0,1fr)] sm:min-h-[30rem] lg:grid-cols-[3rem_minmax(0,1fr)_19rem]">
          {/* rail */}
          <div className="flex flex-col items-center gap-2 border-r border-border py-4">
            {RAIL.map((Icon, i) => (
              <span
                key={i}
                className={cn(
                  'grid h-8 w-8 place-items-center rounded-md',
                  i === 0 ? 'bg-primary/10 text-primary' : 'text-foreground/30',
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
            ))}
          </div>

          {/* document */}
          <div className="relative overflow-hidden bg-secondary/40 p-4 sm:p-8">
            <div className="mx-auto max-w-[34rem] rounded-md border border-border bg-card p-5 shadow-sm sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[17px] font-semibold tracking-tight sm:text-xl">Maya Okafor</p>
                  <p className="mt-0.5 text-[12px] text-foreground/50">Senior Frontend Engineer · Lagos → Remote</p>
                </div>
                <span className="hidden rounded border border-border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/40 sm:inline">
                  v3 · tailored
                </span>
              </div>

              <div className="mt-6">
                <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-foreground/35">Experience</p>
                <div className="mt-3 flex items-baseline justify-between">
                  <p className="text-[12.5px] font-medium">Lumen Labs — Frontend Lead</p>
                  <p className="font-mono text-[10px] text-foreground/35">2022 — now</p>
                </div>

                {/* the AI rewrite moment */}
                <div
                  className={cn(
                    'relative mt-2.5 rounded-md border px-3 py-2 text-[12px] leading-relaxed transition-colors duration-700',
                    rewritten ? 'border-primary/30 bg-primary/[0.06]' : 'border-transparent',
                  )}
                >
                  {rewritten ? (
                    <span>
                      Cut LCP <b className="font-semibold text-primary">41%</b> across 3 product surfaces, lifting
                      signup conversion <b className="font-semibold text-primary">12%</b>.
                    </span>
                  ) : (
                    <span className="text-foreground/50">Worked on improving website performance.</span>
                  )}
                  {rewritten && (
                    <span className="absolute -top-2 right-2 inline-flex items-center gap-1 rounded bg-primary px-1.5 py-px font-mono text-[8.5px] uppercase tracking-[0.16em] text-primary-foreground">
                      <Sparkles className="h-2.5 w-2.5" /> AI rewrite
                    </span>
                  )}
                </div>

                <div className="mt-3 space-y-2 pl-3">
                  <Line w="92%" />
                  <Line w="78%" />
                </div>

                <div className="mt-5 flex items-baseline justify-between">
                  <p className="text-[12.5px] font-medium">Northwind — Software Engineer</p>
                  <p className="font-mono text-[10px] text-foreground/35">2019 — 22</p>
                </div>
                <div className="mt-3 space-y-2 pl-3">
                  <Line w="86%" />
                  <Line w="70%" />
                  <Line w="80%" />
                </div>
              </div>

              <div className="mt-6">
                <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-foreground/35">Skills</p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {['React', 'TypeScript', 'Web Vitals', 'Design systems', 'GraphQL'].map((s) => (
                    <span key={s} className="rounded border border-border px-1.5 py-0.5 text-[10.5px] text-foreground/60">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-card to-transparent lg:hidden"
            />
          </div>

          {/* inspector */}
          <aside className="hidden flex-col border-l border-border lg:flex">
            <div className="border-b border-border p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/40">ATS score</p>
              <div className="mt-3 flex items-center gap-4">
                <div className="relative">
                  <ScoreRing value={score} />
                  <span className="absolute inset-0 grid place-items-center text-[22px] font-medium tabular-nums tracking-tight">
                    {score}
                  </span>
                </div>
                <div>
                  <p className="inline-flex items-center gap-1 rounded bg-accent px-1.5 py-0.5 font-mono text-[10px] text-accent-foreground">
                    +{score - 62} since v1
                  </p>
                  <p className="mt-2 text-[12px] leading-snug text-foreground/55">
                    Strong match for <span className="text-foreground">Staff FE · Arcwise</span>
                  </p>
                </div>
              </div>
              <ul className="mt-5 space-y-2.5 text-[12px]">
                {[
                  ['Keywords matched', '18/20'],
                  ['Quantified bullets', '9/11'],
                  ['Parse-safe layout', 'Pass'],
                ].map(([k, v]) => (
                  <li key={k} className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-foreground/60">
                      <Check className="h-3 w-3 text-accent-foreground" /> {k}
                    </span>
                    <span className="font-mono text-[11px] text-foreground/80">{v}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-1 p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/40">Pipeline</p>
              <div className="mt-3 grid grid-cols-4 gap-1.5">
                {PIPE.map((col) => (
                  <div key={col.label} className="min-w-0">
                    <p className="truncate font-mono text-[8.5px] uppercase tracking-[0.14em] text-foreground/40">
                      {col.label}
                    </p>
                    <p
                      className={cn(
                        'mt-1 text-[15px] font-medium tabular-nums',
                        col.hot && 'text-primary',
                        col.win && 'text-accent-foreground',
                      )}
                    >
                      {col.n}
                    </p>
                    <div className="mt-2 space-y-1">
                      {Array.from({ length: col.cards }).map((_, i) => (
                        <div
                          key={i}
                          className={cn(
                            'h-7 rounded border bg-background',
                            col.hot ? 'border-primary/35' : col.win ? 'border-accent-foreground/40' : 'border-border',
                          )}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* status bar */}
        <div className="flex h-8 items-center justify-between border-t border-border px-4 font-mono text-[10px] text-foreground/40">
          <span className="inline-flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="fd-ping absolute inline-flex h-full w-full rounded-full bg-accent-foreground" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-foreground" />
            </span>
            synced · 3 versions
          </span>
          <span className="hidden sm:inline">
            tailoring to job description<span className="fd-caret">_</span>
          </span>
          <span>export · pdf / docx</span>
        </div>
      </div>
    </div>
  )
}
