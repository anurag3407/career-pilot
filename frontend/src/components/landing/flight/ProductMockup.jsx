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

const RAIL = [
  { icon: FileText, label: 'Resume Studio' },
  { icon: Sparkles, label: 'AI Rewriter' },
  { icon: Briefcase, label: 'Job Tracker' },
  { icon: Mic, label: 'Mock Interview' },
  { icon: Palette, label: 'Portfolio' },
  { icon: GitBranch, label: 'Repo Intelligence' },
]

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
  {
    label: 'Saved',
    n: 12,
    cards: [
      { company: 'Stripe', role: 'Staff FE', pay: '$210k', badge: 'Remote' },
      { company: 'Linear', role: 'UI Eng', pay: '$195k', badge: 'SF' },
    ],
  },
  {
    label: 'Applied',
    n: 8,
    cards: [
      { company: 'Vercel', role: 'Product', pay: '2d ago', badge: 'Review' },
      { company: 'Supabase', role: 'Web Dev', pay: '4d ago', badge: 'Sent' },
    ],
  },
  {
    label: 'Interview',
    n: 3,
    hot: true,
    cards: [
      { company: 'Arcwise', role: 'Staff FE', pay: 'Round 3', badge: 'Tomorrow', hot: true },
      { company: 'Figma', role: 'Design Sys', pay: 'Thu 10a', badge: 'Round 2', hot: true },
    ],
  },
  {
    label: 'Offer',
    n: 1,
    win: true,
    cards: [
      { company: 'Retool', role: 'Lead UI', pay: '$225k', badge: 'Offer', win: true },
    ],
  },
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
            {RAIL.map((item, i) => (
              <span
                key={i}
                title={item.label}
                className={cn(
                  'relative grid h-8 w-8 place-items-center rounded-md transition-colors',
                  i === 0 ? 'bg-primary/10 text-primary' : 'text-foreground/30 hover:text-foreground/60',
                )}
              >
                {i === 0 && (
                  <span className="absolute -left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-primary" />
                )}
                <item.icon className="h-4 w-4" />
              </span>
            ))}
          </div>

          {/* document */}
          <div className="relative overflow-hidden bg-secondary/40 p-4 sm:p-8">
            <div className="mx-auto max-w-[34rem] rounded-md border border-border bg-card p-5 shadow-sm sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[17px] font-semibold tracking-tight sm:text-xl">Maya Okafor</p>
                    <span className="inline-flex items-center gap-1 rounded bg-accent px-1.5 py-0.5 font-mono text-[8.5px] uppercase tracking-wider text-accent-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent-foreground" />
                      ATS Ready
                    </span>
                  </div>
                  <p className="mt-0.5 text-[12px] text-foreground/50">Senior Frontend Engineer · Lagos → Remote</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2 font-mono text-[9.5px] text-foreground/40">
                    <span>maya.dev</span>
                    <span>·</span>
                    <span>github.com/mayaokafor</span>
                    <span>·</span>
                    <span>linkedin.com/in/mayaokafor</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="hidden rounded border border-border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/40 sm:inline">
                    v3 · tailored
                  </span>
                  <span className="hidden font-mono text-[8.5px] text-foreground/30 sm:inline">
                    Arcwise Staff FE
                  </span>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between border-b border-border/50 pb-1">
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-foreground/35">Experience</p>
                  <span className="font-mono text-[8.5px] text-foreground/30">2 roles · 5 quantified metrics</span>
                </div>

                <div className="mt-3 flex items-baseline justify-between">
                  <p className="text-[12.5px] font-medium text-foreground/90">Lumen Labs — Frontend Lead</p>
                  <p className="font-mono text-[10px] text-foreground/35">2022 — now</p>
                </div>

                {/* the AI rewrite moment */}
                <div
                  className={cn(
                    'relative mt-2 rounded-md border px-3 py-2 text-[12px] leading-relaxed transition-colors duration-700',
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
                    <span className="absolute -top-2 right-2 inline-flex items-center gap-1 rounded bg-primary px-1.5 py-px font-mono text-[8.5px] uppercase tracking-[0.16em] text-primary-foreground shadow-sm">
                      <Sparkles className="h-2.5 w-2.5" /> AI rewrite
                    </span>
                  )}
                </div>

                <ul className="mt-2.5 space-y-1.5 pl-3 text-[11.5px] leading-snug text-foreground/65">
                  <li className="flex items-start gap-1.5">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground/30" />
                    <span>
                      Architected design system in Next.js 14 and Tailwind, standardizing 42 components and speeding sprint velocity by <b className="font-medium text-foreground/85">35%</b>.
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground/30" />
                    <span>
                      Mentored 5 engineers and introduced strict Web Vitals assertions in CI/CD pipeline.
                    </span>
                  </li>
                </ul>

                <div className="mt-4 flex items-baseline justify-between border-t border-border/30 pt-2.5">
                  <p className="text-[12.5px] font-medium text-foreground/90">Northwind — Software Engineer</p>
                  <p className="font-mono text-[10px] text-foreground/35">2019 — 22</p>
                </div>
                <ul className="mt-2 space-y-1.5 pl-3 text-[11.5px] leading-snug text-foreground/65">
                  <li className="flex items-start gap-1.5">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground/30" />
                    <span>
                      Migrated legacy monolith to React 18 SPA, cutting initial page load time from <b className="font-medium text-foreground/85">3.4s to 820ms</b>.
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground/30" />
                    <span>
                      Spearheaded checkout overhaul processing <b className="font-medium text-foreground/85">$4.2M</b> in monthly GMV with zero payment outages.
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground/30" />
                    <span>
                      Implemented GraphQL caching layer, decreasing redundant network requests by <b className="font-medium text-foreground/85">48%</b>.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-5 border-t border-border/50 pt-2.5">
                <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-foreground/35">Target Skills &amp; Stack</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {['React 19', 'TypeScript', 'Web Vitals', 'Design systems', 'GraphQL', 'Next.js', 'CI/CD'].map((s) => (
                    <span key={s} className="inline-flex items-center gap-1 rounded border border-border bg-secondary/50 px-1.5 py-0.5 text-[10px] text-foreground/75">
                      <Check className="h-2.5 w-2.5 text-accent-foreground" />
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
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/40">ATS score</p>
                <span className="rounded bg-accent px-1.5 py-0.5 font-mono text-[9px] text-accent-foreground font-medium">
                  Pass target 85+
                </span>
              </div>
              <div className="mt-3 flex items-center gap-4">
                <div className="relative">
                  <ScoreRing value={score} />
                  <span className="absolute inset-0 grid place-items-center text-[22px] font-semibold tabular-nums tracking-tight">
                    {score}
                  </span>
                </div>
                <div>
                  <p className="inline-flex items-center gap-1 rounded bg-accent px-1.5 py-0.5 font-mono text-[10px] text-accent-foreground">
                    +{score - 62} since v1
                  </p>
                  <p className="mt-2 text-[12px] leading-snug text-foreground/55">
                    Strong match for <span className="font-medium text-foreground">Staff FE · Arcwise</span>
                  </p>
                </div>
              </div>
              <ul className="mt-4 space-y-2 text-[12px]">
                {[
                  ['Keywords matched', '18/20'],
                  ['Quantified bullets', '9/11'],
                  ['Parse-safe layout', 'Pass'],
                  ['Action verb strength', '94%'],
                ].map(([k, v]) => (
                  <li key={k} className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-foreground/60">
                      <Check className="h-3 w-3 text-accent-foreground shrink-0" /> {k}
                    </span>
                    <span className="font-mono text-[11px] font-medium text-foreground/80">{v}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-1 p-5">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/40">Active Pipeline</p>
                <span className="font-mono text-[9px] text-foreground/30">24 total</span>
              </div>
              <div className="mt-3 grid grid-cols-4 gap-1.5">
                {PIPE.map((col) => (
                  <div key={col.label} className="min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="truncate font-mono text-[8.5px] uppercase tracking-[0.14em] text-foreground/40">
                        {col.label}
                      </p>
                      <span
                        className={cn(
                          'font-mono text-[10px] font-semibold tabular-nums',
                          col.hot ? 'text-primary' : col.win ? 'text-accent-foreground' : 'text-foreground/50',
                        )}
                      >
                        {col.n}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1.5">
                      {col.cards.map((card, i) => (
                        <div
                          key={i}
                          className={cn(
                            'min-h-[38px] rounded-md border p-1 text-left transition-all',
                            card.hot
                              ? 'border-primary/40 bg-primary/[0.07] shadow-sm'
                              : card.win
                              ? 'border-accent-foreground/50 bg-accent-foreground/[0.08] shadow-sm'
                              : 'border-border/80 bg-background/90',
                          )}
                        >
                          <div className="flex items-center justify-between gap-0.5">
                            <span className="truncate text-[9.5px] font-semibold tracking-tight text-foreground/90">
                              {card.company}
                            </span>
                            {card.hot && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                            {card.win && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-foreground" />}
                          </div>
                          <div className="flex items-center justify-between gap-0.5 text-[8px] text-foreground/50">
                            <span className="truncate">{card.role}</span>
                            <span
                              className={cn(
                                'shrink-0 font-mono tabular-nums',
                                card.hot
                                  ? 'font-medium text-primary'
                                  : card.win
                                  ? 'font-medium text-accent-foreground'
                                  : 'text-foreground/40',
                              )}
                            >
                              {card.pay}
                            </span>
                          </div>
                        </div>
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
            tailoring to Arcwise (Staff Frontend) · 482 words · 1 page<span className="fd-caret">_</span>
          </span>
          <span>export · pdf / docx</span>
        </div>
      </div>
    </div>
  )
}
