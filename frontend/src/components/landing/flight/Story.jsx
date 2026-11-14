import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Plus, FileUp, Check, Github, BookOpen, MessageCircle } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { Eyebrow, MonoLabel, PrimaryButton, Reveal, Section, SectionHeading, Wordmark, REPO_URL } from './primitives'
import { ThemeSwitch } from './FlightNav'

/* ─── How it works ──────────────────────────────────────────────────────── */

const STEPS = [
  { phase: 'Import', title: 'Bring what you already have', desc: 'Drop a PDF or docx, paste plain text, or pull your GitHub profile. It becomes one structured profile.' },
  { phase: 'Tailor', title: 'Aim it at a real role', desc: 'Paste a job description. See the keyword gaps, accept AI rewrites line by line, watch the ATS score move.' },
  { phase: 'Apply', title: 'Run the pipeline', desc: 'Save roles from any job board, move them across the board, and get nudged when a follow-up is due.' },
  { phase: 'Prepare', title: 'Rehearse until it is boring', desc: 'Voice and coding mock interviews built from that same job description, graded answer by answer.' },
]

function StepPreview({ step }) {
  if (step === 0)
    return (
      <div className="space-y-3">
        <div className="grid place-items-center rounded-lg border border-dashed border-border bg-background/60 py-10 text-center">
          <FileUp className="h-5 w-5 text-foreground/40" />
          <p className="mt-2 text-[13px] text-foreground/60">Drop a resume, or paste text</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-3">
          <div className="flex items-center justify-between text-[12.5px]">
            <span className="font-medium">resume_final_v3_REAL.pdf</span>
            <span className="font-mono text-[10px] text-accent-foreground">parsed</span>
          </div>
          <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-foreground/[0.07]">
            <div className="h-full w-full rounded-full bg-accent-foreground" />
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {['4 roles', '11 bullets', '14 skills', '2 degrees'].map((t) => (
              <span key={t} className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-foreground/55">{t}</span>
            ))}
          </div>
        </div>
      </div>
    )
  if (step === 1)
    return (
      <div className="space-y-3">
        <div className="rounded-lg border border-border bg-background p-4">
          <MonoLabel>Job description · keywords</MonoLabel>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {[['React', 1], ['TypeScript', 1], ['Accessibility', 1], ['Design systems', 1], ['Testing', 0], ['Web Vitals', 1], ['Mentoring', 0]].map(([k, hit]) => (
              <span
                key={k}
                className={cn(
                  'inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11.5px]',
                  hit ? 'bg-accent text-accent-foreground' : 'border border-dashed border-primary/40 text-primary',
                )}
              >
                {hit ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />} {k}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
          <div>
            <MonoLabel>ATS score</MonoLabel>
            <p className="mt-1 text-3xl font-medium tabular-nums tracking-tight">
              74 <span className="text-foreground/30">→</span> <span className="text-primary">88</span>
            </p>
          </div>
          <span className="rounded bg-accent px-2 py-1 font-mono text-[10px] text-accent-foreground">2 gaps left</span>
        </div>
      </div>
    )
  if (step === 2) {
    const COLUMNS = [
      {
        col: 'Saved',
        cards: [
          { company: 'Arcwise', role: 'Staff Frontend', meta: '$210k · Remote' },
          { company: 'Fern & Co', role: 'Design Eng', meta: 'Added 1d ago' },
          { company: 'Polaris', role: 'Lead Architect', meta: '$195k · Referral' },
        ],
      },
      {
        col: 'Applied',
        cards: [
          { company: 'Lumen Labs', role: 'Senior Frontend', meta: 'Applied 2d ago' },
          { company: 'Kestrel', role: 'UI Engineer', meta: 'Applied 4d ago' },
        ],
      },
      {
        col: 'Interview',
        hot: true,
        cards: [
          { company: 'Northwind', role: 'Principal FE', meta: 'Round 3 · Tue 2pm', hot: true },
        ],
      },
      {
        col: 'Offer',
        win: true,
        cards: [
          { company: 'Halcyon', role: 'Staff Engineer', meta: '$225k + Equity', win: true },
        ],
      },
    ]

    return (
      <div className="grid grid-cols-4 gap-2">
        {COLUMNS.map((group) => (
          <div key={group.col} className="min-w-0">
            <div className="flex items-center justify-between">
              <p className="truncate font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/40">{group.col}</p>
              <span className={cn('font-mono text-[9px]', group.hot ? 'text-primary' : group.win ? 'text-accent-foreground' : 'text-foreground/30')}>
                {group.cards.length}
              </span>
            </div>
            <div className="mt-2 space-y-1.5">
              {group.cards.map((c) => (
                <div
                  key={c.company}
                  className={cn(
                    'rounded-md border p-2 text-[11px] transition-colors',
                    c.hot
                      ? 'border-primary/40 bg-primary/[0.04]'
                      : c.win
                      ? 'border-accent-foreground/40 bg-accent-foreground/[0.04]'
                      : 'border-border bg-background',
                  )}
                >
                  <div className="flex items-center justify-between gap-1">
                    <p className="truncate font-medium text-foreground">{c.company}</p>
                    {c.hot && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                    {c.win && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-foreground" />}
                  </div>
                  <p className="mt-0.5 truncate text-[10px] text-foreground/60">{c.role}</p>
                  <p className="mt-1 font-mono text-[8.5px] text-foreground/40">{c.meta}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }
  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-border bg-background p-4">
        <MonoLabel>Interviewer</MonoLabel>
        <p className="mt-2 text-[13px] leading-relaxed">Tell me about a time you pushed back on a product decision.</p>
      </div>
      <div className="rounded-lg border border-primary/30 bg-primary/[0.05] p-4">
        <div className="flex items-center justify-between">
          <MonoLabel className="text-primary/80">You · recording</MonoLabel>
          <span className="font-mono text-[10px] text-foreground/40">00:42</span>
        </div>
        <div className="mt-3 flex h-8 items-center gap-[3px]">
          {[30, 60, 45, 80, 55, 90, 40, 70, 35, 65, 85, 50, 30, 60, 75, 45, 55, 35, 70, 40].map((h, i) => (
            <span key={i} className="w-1 flex-1 rounded-full bg-primary/70" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
      <p className="font-mono text-[10.5px] text-foreground/45">
        Feedback: strong situation, quantify the result. <span className="text-accent-foreground">7.8 / 10</span>
      </p>
    </div>
  )
}

export function HowItWorks() {
  const [active, setActive] = useState(0)
  const [auto, setAuto] = useState(true)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!auto || reduce) return
    const id = setInterval(() => setActive((a) => (a + 1) % STEPS.length), 5200)
    return () => clearInterval(id)
  }, [auto, reduce])

  return (
    <Section id="how-it-works">
      <Reveal>
        <SectionHeading
          eyebrow="How it works"
          title="From an old PDF to a booked interview."
          lede="Four phases, one profile underneath. Click a step to see that part of the product."
        />
      </Reveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
        <ol className="border-t border-border">
          {STEPS.map((s, i) => {
            const on = i === active
            return (
              <li key={s.phase} className="border-b border-border">
                <button
                  type="button"
                  onClick={() => {
                    setActive(i)
                    setAuto(false)
                  }}
                  aria-pressed={on}
                  className="group grid w-full grid-cols-[2.5rem_minmax(0,1fr)] gap-2 py-5 text-left"
                >
                  <span className={cn('pt-0.5 font-mono text-xs tabular-nums', on ? 'text-primary' : 'text-foreground/28')}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>
                    <span className={cn('font-mono text-[10px] uppercase tracking-[0.24em]', on ? 'text-primary' : 'text-accent-foreground/80')}>
                      {s.phase}
                    </span>
                    <span
                      className={cn(
                        'mt-1 block text-[17px] tracking-tight transition-colors',
                        on ? 'font-semibold text-foreground' : 'font-medium text-foreground/70 group-hover:text-foreground',
                      )}
                    >
                      {s.title}
                    </span>
                    <AnimatePresence initial={false}>
                      {on && (
                        <motion.span
                          initial={reduce ? false : { height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={reduce ? undefined : { height: 0, opacity: 0 }}
                          className="block overflow-hidden"
                        >
                          <span className="block max-w-md pt-2 text-sm leading-6 text-foreground/58">{s.desc}</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>

        <div className="relative overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex h-9 items-center justify-between border-b border-border px-4">
            <MonoLabel>{STEPS[active].phase}</MonoLabel>
            <div className="flex gap-1">
              {STEPS.map((_, i) => (
                <span key={i} className={cn('h-1 rounded-full transition-all', i === active ? 'w-5 bg-primary' : 'w-1.5 bg-foreground/15')} />
              ))}
            </div>
          </div>
          <div className="fd-grid-bg min-h-[20rem] p-5 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <StepPreview step={active} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Section>
  )
}

/* ─── FAQ ───────────────────────────────────────────────────────────────── */

const FAQS = [
  ['Is CareerPilot free?', 'Yes. The Free Starter plan covers the core tools when you bring your own AI key. Pro adds managed models, automated job alerts and higher limits. See Pricing for details.'],
  ['Do I need my own AI key?', 'On the free plan, yes. Gemini, OpenAI, Anthropic, Groq and OpenRouter keys all work, and several providers offer free tiers. Your key stays tied to your account.'],
  ['Will my resume pass every ATS?', 'No tool can promise that. The ATS score is deterministic and explains itself: parse-safe layout, keyword coverage, quantified bullets. You see exactly what to fix and why.'],
  ['Is it only for developers?', 'No. The resume, interview, tracker, cover letter and salary tools work for any role. GitHub insights and the repo visualizer are extras for engineers.'],
  ['Where can my portfolio be deployed?', 'Cloudflare Pages, Netlify or GitHub Pages, in one click, from any of the 264 templates. Every deployment is logged with its URL.'],
  ['Can I self-host it?', 'Yes. CareerPilot is MIT licensed and developed in public on GitHub. Fork it, run it, or contribute back.'],
]

export function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <Section id="faq">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <Reveal>
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="mt-4 text-[1.75rem] font-medium tracking-[-0.035em] sm:text-4xl">Common questions</h2>
          <p className="mt-4 max-w-sm text-[14px] leading-7 text-foreground/55">
            Anything else? Ask in the{' '}
            <Link to="/community" className="text-foreground underline decoration-border underline-offset-4 hover:decoration-primary">
              community
            </Link>
            .
          </p>
        </Reveal>
        <div className="border-t border-border">
          {FAQS.map(([q, a], i) => {
            const on = open === i
            return (
              <div key={q} className="border-b border-border">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(on ? -1 : i)}
                    aria-expanded={on}
                    className="flex w-full items-start justify-between gap-6 py-5 text-left text-[15px] font-medium tracking-tight transition-colors hover:text-primary"
                  >
                    {q}
                    <Plus className={cn('mt-0.5 h-4 w-4 shrink-0 text-foreground/40 transition-transform duration-300', on && 'rotate-45 text-primary')} />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-xl pb-5 pr-10 text-sm leading-7 text-foreground/58">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}

/* ─── Final call + footer ───────────────────────────────────────────────── */

const ASCII = [
  { art: '   /\\\n  /  \\\n /_/\\_\\\n   ||\n   ||', cls: 'left-[5%] top-[14%]' },
  { art: ' .-.\n( o )\n `-´\n  |\n -+-', cls: 'right-[7%] top-[18%]' },
  { art: '>>-->\n >>-->\n  >>-->', cls: 'bottom-[12%] left-[16%] hidden sm:block' },
  { art: '+ + +\n + +\n+ + +', cls: 'bottom-[14%] right-[18%] hidden md:block' },
]

export function FinalCall() {
  return (
    <section className="relative overflow-hidden border-t border-border px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
      <div aria-hidden="true" className="fd-grid-bg pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      {ASCII.map((a, i) => (
        <pre
          key={i}
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute select-none font-mono text-[10px] font-bold leading-[1.05] text-foreground/25 sm:text-[12px]',
            a.cls,
          )}
        >
          {a.art}
        </pre>
      ))}
      <Reveal className="relative mx-auto max-w-3xl text-center">
        <Eyebrow className="tracking-[0.28em]">Cleared for takeoff</Eyebrow>
        <h2 className="mt-5 text-[1.9rem] font-medium leading-[1.04] tracking-[-0.045em] text-balance sm:text-5xl lg:text-[4rem]">
          Your next role, <span className="text-primary">planned properly.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-foreground/58">
          Set up your profile once. Every resume, application, interview and portfolio builds on it from then on.
        </p>
        <div className="mt-9 flex justify-center">
          <PrimaryButton to="/register">Create your free account</PrimaryButton>
        </div>
      </Reveal>
    </section>
  )
}

const FOOTER = [
  { h: 'Product', links: [['Features', '#features'], ['Templates', '/templates'], ['Pricing', '/pricing'], ['How it works', '#how-it-works'], ['FAQ', '#faq']] },
  { h: 'Tools', links: [['Resume builder', '/resume-builder/build'], ['Mock interview', '/mock-interview/practice'], ['Job tracker', '/job-tracker'], ['Portfolio', '/hub/portfolio'], ['Repo visualizer', '/project-visualizer']] },
  { h: 'Project', links: [['Community', '/community'], ['Source code', REPO_URL], ['Privacy', '/privacy'], ['Terms', '/terms'], ['Cookies', '/cookies']] },
]

function FooterLink({ label, to }) {
  const cls = 'text-[13px] text-foreground/55 underline decoration-transparent underline-offset-4 transition-colors hover:text-primary hover:decoration-primary'
  if (to.startsWith('http')) return <a href={to} target="_blank" rel="noreferrer" className={cls}>{label}</a>
  if (to.startsWith('#')) return <a href={to} className={cls}>{label}</a>
  return <Link to={to} className={cls}>{label}</Link>
}

export function FlightFooter() {
  return (
    <footer className="border-t border-border px-5 pb-10 pt-16 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div>
            <Wordmark />
            <p className="mt-6 max-w-md text-[1.4rem] font-medium leading-[1.15] tracking-[-0.035em] text-balance sm:text-[1.75rem]">
              Turn a scattered job search into one deliberate, well-instrumented flight.
            </p>
            <div className="mt-6 flex items-center gap-1">
              {[[Github, REPO_URL, 'GitHub'], [MessageCircle, '/community', 'Community'], [BookOpen, '/resume-examples', 'Resume examples']].map(([Icon, to, label]) =>
                to.startsWith('http') ? (
                  <a key={label} href={to} target="_blank" rel="noreferrer" aria-label={label} className="grid h-8 w-8 place-items-center rounded-md text-foreground/50 hover:bg-muted hover:text-foreground">
                    <Icon className="h-4 w-4" />
                  </a>
                ) : (
                  <Link key={label} to={to} aria-label={label} className="grid h-8 w-8 place-items-center rounded-md text-foreground/50 hover:bg-muted hover:text-foreground">
                    <Icon className="h-4 w-4" />
                  </Link>
                ),
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {FOOTER.map((col) => (
              <div key={col.h}>
                <h3 className="text-[14px] font-medium">{col.h}</h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map(([label, to]) => (
                    <li key={label}>
                      <FooterLink label={label} to={to} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
          <MonoLabel className="text-foreground/35">© {new Date().getFullYear()} CareerPilot · MIT licensed · Built in public</MonoLabel>
          <ThemeSwitch />
        </div>
      </div>
    </footer>
  )
}
