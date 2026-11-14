import {
  FileText, Gauge, Wand2, Crosshair, Flame, Mic, Code2, Search, KanbanSquare,
  Rocket, Network, TrendingUp, Mail, Linkedin, KeyRound, Check, Minus, ArrowRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../../../lib/utils'
import { GhostButton, MonoLabel, Reveal, Section, SectionHeading } from './primitives'

/* ─── Features ─────────────────────────────────────────────────────────── */

const FEATURES = [
  { icon: FileText, title: 'Resume builder', desc: 'Drag-and-drop sections, live preview and ATS-safe layouts. Import a PDF or docx and keep editing.', to: '/resume-builder/build' },
  { icon: Gauge, title: 'ATS scoring', desc: 'A deterministic score with a per-section breakdown and history, so you can watch it climb.', to: '/hub/resume' },
  { icon: Wand2, title: 'AI rewrites', desc: 'Vague bullets become quantified, specific lines. You approve every change.', to: '/resume-builder/build' },
  { icon: Crosshair, title: 'One-click tailoring', desc: 'Paste a job description and get a version matched to its language and priorities.', to: '/hub/resume' },
  { icon: Flame, title: 'Resume roast', desc: 'Graded like a tired recruiter at 5pm, with quick wins ranked by impact. Shareable.', to: '/resume-roast/analyze' },
  { icon: Mic, title: 'Voice mock interviews', desc: 'The AI asks, listens, follows up on weak answers and grades the whole session.', to: '/mock-interview/practice' },
  { icon: Code2, title: 'Coding rounds', desc: 'A built-in editor with LLM-judged dry runs and a replayable transcript.', to: '/mock-interview/practice' },
  { icon: Search, title: 'Job search', desc: 'AI-matched roles with salary context and direct apply links.', to: '/job-finder/search' },
  { icon: KanbanSquare, title: 'Pipeline tracker', desc: 'Saved, applied, interviewing, offer. A kanban plus a browser extension for one-click saves.', to: '/job-tracker' },
  { icon: Rocket, title: 'Portfolio deploy', desc: '264 templates. Edit inline, then ship to Cloudflare Pages, Netlify or GitHub Pages.', to: '/hub/portfolio' },
  { icon: Network, title: 'Repo visualizer', desc: 'Architecture graphs, risk cards and an AI chat that knows the codebase.', to: '/project-visualizer' },
  { icon: TrendingUp, title: 'Skill gap & salary', desc: 'What to learn next for a target role, and what that role pays where you live.', to: '/hub/career' },
  { icon: Mail, title: 'Cover letters & outreach', desc: 'Tailored drafts for every application and every recruiter follow-up.', to: '/cover-letter' },
  { icon: Linkedin, title: 'LinkedIn optimizer', desc: 'Headline, about and experience rewrites that match the roles you want.', to: '/linkedin-optimizer' },
  { icon: KeyRound, title: 'Bring your own key', desc: 'Run on Gemini, OpenAI, Anthropic, Groq or OpenRouter. Your key, your bill, your choice.', to: '/settings' },
]

export function Features() {
  return (
    <Section id="features">
      <Reveal>
        <SectionHeading
          eyebrow="Features"
          title="Every career tool, without the tab sprawl."
          lede="Fifteen tools that share one profile. Fix a bullet in your resume and it is already in your portfolio, your cover letter and your next mock interview."
        />
      </Reveal>

      <Reveal delay={0.05} className="mt-12 overflow-hidden rounded-xl border border-border">
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Link
              key={f.title}
              to={f.to}
              className="group relative bg-background p-6 transition-colors hover:bg-card sm:p-7"
            >
              <div className="flex items-start justify-between">
                <span className="grid h-8 w-8 place-items-center rounded-md border border-border text-foreground/60 transition group-hover:border-primary/40 group-hover:text-primary">
                  <f.icon className="h-4 w-4" />
                </span>
                <span className="font-mono text-[10px] tabular-nums text-foreground/25">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="mt-5 text-[14px] font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-foreground/52">{f.desc}</p>
              <ArrowRight className="absolute bottom-6 right-6 h-3.5 w-3.5 -translate-x-1 text-primary opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </Reveal>
    </Section>
  )
}

/* ─── Templates marquee ─────────────────────────────────────────────────── */

// Each preview is a tiny CSS composition hinting at the real template.
const PREVIEWS = {
  classic: (
    <div className="flex h-full flex-col gap-1.5 bg-white p-3">
      <div className="h-2 w-1/2 rounded-sm bg-neutral-800" />
      <div className="h-1 w-1/3 rounded-sm bg-neutral-300" />
      <div className="mt-2 h-px bg-neutral-200" />
      {[90, 75, 82, 60, 88, 70].map((w, i) => (
        <div key={i} className="h-1 rounded-sm bg-neutral-200" style={{ width: `${w}%` }} />
      ))}
    </div>
  ),
  split: (
    <div className="grid h-full grid-cols-[35%_65%] bg-white">
      <div className="flex flex-col gap-1.5 bg-slate-800 p-2.5">
        <div className="h-5 w-5 rounded-full bg-slate-500" />
        {[80, 60, 70, 50].map((w, i) => (
          <div key={i} className="h-1 rounded-sm bg-slate-600" style={{ width: `${w}%` }} />
        ))}
      </div>
      <div className="flex flex-col gap-1.5 p-2.5">
        <div className="h-2 w-2/3 rounded-sm bg-slate-800" />
        {[95, 80, 88, 70, 90].map((w, i) => (
          <div key={i} className="h-1 rounded-sm bg-slate-200" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  ),
  serif: (
    <div className="flex h-full flex-col items-center gap-1.5 bg-[#fbf8f1] p-3">
      <div className="font-serif text-[13px] italic text-stone-800">A. Laurent</div>
      <div className="h-px w-1/2 bg-stone-300" />
      {[85, 70, 90, 65, 80].map((w, i) => (
        <div key={i} className="h-1 rounded-sm bg-stone-200" style={{ width: `${w}%` }} />
      ))}
    </div>
  ),
  swiss: (
    <div className="relative h-full bg-[#f4f1ea] p-3">
      <div className="text-[34px] font-black leading-none tracking-[-0.06em] text-neutral-900">Aa</div>
      <div className="absolute bottom-3 right-3 h-8 w-8 bg-[#e3321f]" />
      <div className="mt-2 h-1 w-1/2 bg-neutral-900" />
    </div>
  ),
  neon: (
    <div className="relative h-full overflow-hidden bg-[#0b0820] p-3">
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-fuchsia-600/40 to-transparent" />
      <div className="relative text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-300">Night/shift</div>
      <div className="relative mt-2 h-1 w-1/2 rounded bg-fuchsia-400" />
      <div className="absolute bottom-2 left-3 right-3 flex items-end gap-1">
        {[40, 70, 55, 85, 45, 65].map((h, i) => (
          <div key={i} className="flex-1 bg-indigo-400/50" style={{ height: `${h * 0.35}px` }} />
        ))}
      </div>
    </div>
  ),
  terminal: (
    <div className="h-full bg-[#0d1117] p-3 font-mono text-[8.5px] leading-[1.6] text-emerald-400">
      <div>$ whoami</div>
      <div className="text-emerald-200/80">dev · systems · rust</div>
      <div>$ ls ./skills</div>
      <div className="text-emerald-200/60">go k8s postgres</div>
      <div>
        $ <span className="fd-caret">▍</span>
      </div>
    </div>
  ),
  fjords: (
    <div className="relative h-full overflow-hidden bg-gradient-to-b from-sky-200 to-sky-50">
      <div className="absolute bottom-0 h-3/5 w-full bg-slate-600 [clip-path:polygon(0_60%,25%_10%,45%_55%,65%_0,100%_50%,100%_100%,0_100%)]" />
      <div className="absolute bottom-0 h-2/5 w-full bg-slate-800 [clip-path:polygon(0_40%,30%_70%,55%_20%,80%_60%,100%_30%,100%_100%,0_100%)]" />
    </div>
  ),
  block: (
    <div className="grid h-full grid-cols-3 grid-rows-2">
      <div className="col-span-2 bg-[#ffcf33]" />
      <div className="bg-[#1f4bff]" />
      <div className="bg-[#ff5a36]" />
      <div className="col-span-2 bg-neutral-900 p-2">
        <div className="h-1.5 w-1/2 rounded-sm bg-white" />
      </div>
    </div>
  ),
  fluid: (
    <div className="relative h-full overflow-hidden bg-neutral-950">
      <div className="absolute -left-4 top-2 h-16 w-16 rounded-full bg-violet-600/60 blur-xl" />
      <div className="absolute bottom-0 right-0 h-14 w-14 rounded-full bg-orange-500/50 blur-xl" />
      <div className="relative p-3 text-[11px] font-medium tracking-tight text-white/90">hello, I build interfaces.</div>
    </div>
  ),
  memphis: (
    <div className="relative h-full overflow-hidden bg-[#fff4e0]">
      <div className="absolute left-3 top-3 h-6 w-6 rounded-full bg-[#ff4d8d]" />
      <div className="absolute right-4 top-4 h-0 w-0 border-x-[10px] border-b-[18px] border-x-transparent border-b-[#2ec4b6]" />
      <div className="absolute bottom-3 left-6 h-3 w-14 rotate-[-8deg] bg-[#ffbf00]" />
      <div className="absolute bottom-5 right-5 h-5 w-5 border-[3px] border-[#5b3cc4]" />
    </div>
  ),
  ocean: (
    <div className="relative h-full overflow-hidden bg-gradient-to-b from-cyan-800 to-[#031a2b]">
      {[20, 45, 70].map((t, i) => (
        <div key={i} className="absolute h-1 w-1 rounded-full bg-cyan-200/70" style={{ top: `${t}%`, left: `${15 + i * 28}%` }} />
      ))}
      <div className="absolute bottom-3 left-3 text-[10px] font-semibold text-cyan-100">deep work</div>
    </div>
  ),
  fashion: (
    <div className="flex h-full flex-col justify-between bg-neutral-100 p-3">
      <div className="font-serif text-[22px] leading-none tracking-[-0.04em] text-black">Atelier</div>
      <div className="flex gap-1">
        <div className="h-8 flex-1 bg-neutral-300" />
        <div className="h-8 flex-1 bg-neutral-800" />
      </div>
    </div>
  ),
}

const ROW_A = [
  { name: 'Classic ATS', kind: 'Resume', p: 'classic' },
  { name: 'Swiss Typography', kind: 'Portfolio', p: 'swiss' },
  { name: 'Modern Clean', kind: 'Resume', p: 'split' },
  { name: 'Neon Cityscape', kind: 'Portfolio', p: 'neon' },
  { name: 'Elegant Serif', kind: 'Resume', p: 'serif' },
  { name: 'Terminal Skills', kind: 'Portfolio', p: 'terminal' },
]
const ROW_B = [
  { name: 'Northern Fjords', kind: 'Portfolio', p: 'fjords' },
  { name: 'Executive', kind: 'Resume', p: 'split' },
  { name: 'Color Block', kind: 'Portfolio', p: 'block' },
  { name: 'Minimal Dark Fluid', kind: 'Portfolio', p: 'fluid' },
  { name: 'Memphis Pop', kind: 'Portfolio', p: 'memphis' },
  { name: 'Ivy League', kind: 'Resume', p: 'classic' },
  { name: 'Ocean Depths', kind: 'Portfolio', p: 'ocean' },
  { name: 'High Fashion', kind: 'Portfolio', p: 'fashion' },
]

function TemplateCard({ t }) {
  return (
    <div className="w-56 shrink-0 rounded-lg border border-border bg-card p-1.5 transition hover:-translate-y-0.5 hover:border-foreground/20 sm:w-60">
      <div className="aspect-[4/3] overflow-hidden rounded-md border border-border/60">{PREVIEWS[t.p]}</div>
      <div className="flex items-center gap-2 px-1.5 pb-1 pt-2.5">
        <span className="truncate text-[12.5px] font-medium tracking-tight text-foreground/80">{t.name}</span>
        <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/30">{t.kind}</span>
      </div>
    </div>
  )
}

function MarqueeRow({ items, reverse }) {
  const doubled = [...items, ...items]
  return (
    <div className="fd-marquee-wrap overflow-hidden">
      <div className={cn('flex w-max gap-3', reverse ? 'fd-marquee-rev' : 'fd-marquee')}>
        {doubled.map((t, i) => (
          <div key={`${t.name}-${i}`} aria-hidden={i >= items.length || undefined}>
            <TemplateCard t={t} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function Templates() {
  return (
    <section id="templates" className="relative overflow-hidden py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:px-0">
        <Reveal>
          <SectionHeading
            eyebrow="Templates"
            title="Start from a layout, not a blank page."
            lede="ATS-safe resume layouts for applying, expressive portfolio templates for being remembered. Every one is fully editable."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <GhostButton to="/templates" className="text-primary">
            Browse all templates <ArrowRight className="h-3.5 w-3.5" />
          </GhostButton>
        </Reveal>
      </div>

      <div className="relative mt-12 flex flex-col gap-3 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <MarqueeRow items={ROW_A} />
        <MarqueeRow items={ROW_B} reverse />
      </div>
    </section>
  )
}

/* ─── Comparison ────────────────────────────────────────────────────────── */

const COLS = ['CareerPilot', 'Resume builders', 'Job trackers', 'Interview apps']
const ROWS = [
  ['ATS score + AI rewrites', [1, 1, 0, 0]],
  ['Tailor to a job description', [1, 0.5, 0, 0]],
  ['Application pipeline', [1, 0, 1, 0]],
  ['Voice + coding mock interviews', [1, 0, 0, 1]],
  ['Deployable portfolio', [1, 0, 0, 0]],
  ['GitHub & repo insights', [1, 0, 0, 0]],
  ['Bring your own AI key', [1, 0, 0, 0.5]],
  ['Open source, self-hostable', [1, 0, 0, 0]],
]

function Mark({ v, highlight }) {
  if (v === 1)
    return <Check className={cn('mx-auto h-4 w-4', highlight ? 'text-primary' : 'text-foreground/60')} aria-label="Yes" />
  if (v === 0.5) return <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/40">Some</span>
  return <Minus className="mx-auto h-4 w-4 text-foreground/20" aria-label="No" />
}

export function Comparison() {
  return (
    <Section id="compare">
      <Reveal>
        <SectionHeading
          eyebrow="Compare"
          title="One cockpit instead of a stack of subscriptions."
          lede="Most career tools do one job well and leave you to copy-paste between them. CareerPilot keeps the whole loop in one place, with one profile."
        />
      </Reveal>

      <Reveal delay={0.05} className="mt-12 overflow-x-auto rounded-xl border border-border bg-card/40">
        <div className="min-w-[40rem]" role="table" aria-label="Feature comparison">
          <div
            role="row"
            className="grid grid-cols-[minmax(12rem,1.5fr)_repeat(4,minmax(6rem,0.6fr))] border-b border-border bg-background/70 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/42"
          >
            <div role="columnheader" className="px-5 py-3.5 text-left">Capability</div>
            {COLS.map((c, i) => (
              <div
                role="columnheader"
                key={c}
                className={cn('px-3 py-3.5', i === 0 && 'bg-primary/[0.06] text-primary')}
              >
                {c}
              </div>
            ))}
          </div>
          {ROWS.map(([label, vals]) => (
            <div
              role="row"
              key={label}
              className="grid grid-cols-[minmax(12rem,1.5fr)_repeat(4,minmax(6rem,0.6fr))] items-center border-b border-border/60 text-center last:border-b-0"
            >
              <div role="cell" className="px-5 py-3.5 text-left text-[13.5px] text-foreground/80">{label}</div>
              {vals.map((v, i) => (
                <div role="cell" key={i} className={cn('flex h-full items-center justify-center px-3 py-3.5', i === 0 && 'bg-primary/[0.06]')}>
                  <Mark v={v} highlight={i === 0} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </Reveal>
      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/35">
        Columns describe typical single-purpose tools in each category.
      </p>
    </Section>
  )
}

/* ─── Use cases ─────────────────────────────────────────────────────────── */

const CASES = [
  { tag: '0–2 yrs', title: 'New grads', desc: 'Turn coursework and side projects into a resume that reads like experience, then rehearse the interviews out loud.' },
  { tag: 'Pivot', title: 'Career switchers', desc: 'Map transferable skills to a new field, see the exact gaps, and tailor every application to the new language.' },
  { tag: 'Staff+', title: 'Senior engineers', desc: 'Quantify impact, prep system-design and behavioural rounds, and track a handful of high-stakes processes.' },
  { tag: 'Portfolio-first', title: 'Self-taught & bootcamp', desc: 'Let your GitHub do the talking: visualize repos, generate a README and deploy a portfolio people remember.' },
]

export function UseCases() {
  return (
    <Section id="use-cases">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
        <Reveal className="lg:sticky lg:top-28">
          <SectionHeading
            eyebrow="Who it's for"
            title="Made for searches that need to move."
            lede="Whatever stage you are at, the loop is the same: present yourself sharply, apply deliberately, rehearse until it is boring."
          >
            <div className="mt-7">
              <GhostButton to="/register">Set up your profile</GhostButton>
            </div>
          </SectionHeading>
        </Reveal>
        <div className="grid gap-3 sm:grid-cols-2">
          {CASES.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.05}>
              <div className="h-full rounded-xl border border-border bg-card p-6 transition hover:border-foreground/20">
                <MonoLabel className="text-foreground/36">{c.tag}</MonoLabel>
                <h3 className="mt-6 text-[15px] font-semibold tracking-tight">{c.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-foreground/52">{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
