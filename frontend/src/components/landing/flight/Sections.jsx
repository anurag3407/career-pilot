import { useState } from 'react'
import { Check, Minus, ArrowRight } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { GhostButton, MonoLabel, Reveal, Section, SectionHeading } from './primitives'

/* ─── Templates marquee ─────────────────────────────────────────────────── */

// High-fidelity micro-compositions for resume templates with real human text & metrics.
const PREVIEWS = {
  classic: (
    <div className="flex h-full select-none flex-col justify-between bg-white p-2.5 text-neutral-900 leading-tight">
      <div>
        <div className="border-b border-neutral-300 pb-1">
          <p className="text-[10px] font-bold tracking-tight text-neutral-950 uppercase">Eleanor Vance</p>
          <p className="font-mono text-[6px] text-neutral-500">
            eleanor@vance.io · San Francisco, CA · github.com/evance
          </p>
        </div>
        <div className="mt-1.5">
          <p className="border-b border-neutral-200 text-[6.5px] font-bold uppercase tracking-wider text-neutral-700">Experience</p>
          <div className="mt-1">
            <div className="flex justify-between text-[7px] font-semibold text-neutral-800">
              <span>Stripe — Staff Infrastructure Eng</span>
              <span className="font-mono text-[6px] text-neutral-500">2021–Now</span>
            </div>
            <p className="mt-0.5 text-[6px] leading-[1.25] text-neutral-600">
              • Scaled distributed ingestion engine to 2.4M ops/sec with 99.999% uptime.
            </p>
            <p className="text-[6px] leading-[1.25] text-neutral-600">
              • Cut cross-region transfer costs by $480k/yr via gRPC compression.
            </p>
          </div>
          <div className="mt-1">
            <div className="flex justify-between text-[7px] font-semibold text-neutral-800">
              <span>Figma — Senior Systems Engineer</span>
              <span className="font-mono text-[6px] text-neutral-500">2018–21</span>
            </div>
            <p className="mt-0.5 text-[6px] leading-[1.25] text-neutral-600">
              • Optimized WebAssembly canvas rendering, reducing p95 latency by 42%.
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-neutral-200 pt-0.5 text-[6px] text-neutral-500 font-mono">
        <span className="font-bold text-neutral-700">Stack:</span> Go, Rust, Kubernetes, eBPF, Kafka, PostgreSQL
      </div>
    </div>
  ),

  split: (
    <div className="grid h-full select-none grid-cols-[36%_64%] bg-white text-neutral-900 leading-tight">
      <div className="flex flex-col justify-between bg-slate-900 p-2 text-white">
        <div>
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-[7.5px] font-bold text-sky-400">
            MC
          </div>
          <p className="mt-1.5 text-[8px] font-bold leading-tight">Marcus Chen</p>
          <p className="text-[6px] text-slate-400">Lead UI Engineer</p>
          <div className="mt-2 space-y-1 text-[5.5px] text-slate-300">
            <p className="font-semibold uppercase tracking-wider text-slate-400">Skills</p>
            <div className="flex flex-wrap gap-0.5">
              {['React', 'Next.js', 'TypeScript', 'Tailwind', 'GraphQL'].map((s) => (
                <span key={s} className="rounded bg-slate-800 px-1 py-px">{s}</span>
              ))}
            </div>
          </div>
        </div>
        <p className="font-mono text-[5.5px] text-slate-400">marcus@chen.dev</p>
      </div>
      <div className="flex flex-col justify-between p-2">
        <div>
          <p className="border-b border-slate-200 pb-0.5 text-[6.5px] font-bold uppercase tracking-wider text-slate-800">Experience</p>
          <div className="mt-1">
            <p className="text-[6.5px] font-semibold text-slate-900">Linear — Lead UI Engineer</p>
            <p className="text-[5.5px] text-slate-500">2022 — Present · SF</p>
            <p className="mt-0.5 text-[6px] leading-[1.25] text-slate-600">
              • Shipped synced desktop/web UI for 65k teams; +34% triage speed.
            </p>
            <p className="text-[6px] leading-[1.25] text-slate-600">
              • Created core design token architecture across web and mobile.
            </p>
          </div>
          <div className="mt-1">
            <p className="text-[6.5px] font-semibold text-slate-900">Vercel — Frontend Engineer</p>
            <p className="text-[5.5px] text-slate-500">2019 — 2022</p>
            <p className="mt-0.5 text-[6px] leading-[1.25] text-slate-600">
              • Built Analytics 2.0 dashboard serving 180M visits/month.
            </p>
          </div>
        </div>
        <p className="text-[5.5px] font-medium text-slate-400">Stanford University · B.S. CS</p>
      </div>
    </div>
  ),

  serif: (
    <div className="flex h-full select-none flex-col justify-between bg-[#fbf8f1] p-2.5 text-stone-900 leading-tight">
      <div>
        <div className="border-b border-stone-300 pb-1 text-center">
          <p className="font-serif text-[10px] tracking-wide text-stone-950 uppercase">Claire De Roche</p>
          <p className="font-serif text-[6.5px] italic text-stone-600">Editorial Lead &amp; Brand Strategist · New York</p>
        </div>
        <div className="mt-1.5">
          <p className="font-serif text-[6.5px] font-bold uppercase tracking-wider text-stone-700">Experience</p>
          <div className="mt-1 font-serif">
            <div className="flex justify-between text-[6.5px] font-bold text-stone-900">
              <span>The Atlantic — Senior Editor</span>
              <span className="font-sans text-[6px] text-stone-500">2020–Now</span>
            </div>
            <p className="mt-0.5 text-[6px] leading-[1.25] text-stone-700">
              • Directed investigative features nominated for National Magazine Awards.
            </p>
            <p className="text-[6px] leading-[1.25] text-stone-700">
              • Increased subscriber retention by 28% through newsletter redesign.
            </p>
          </div>
          <div className="mt-1 font-serif">
            <div className="flex justify-between text-[6.5px] font-bold text-stone-900">
              <span>Condé Nast — Staff Writer</span>
              <span className="font-sans text-[6px] text-stone-500">2016–20</span>
            </div>
            <p className="mt-0.5 text-[6px] leading-[1.25] text-stone-700">
              • Authored 36 cover stories reaching 6.8M monthly readers.
            </p>
          </div>
        </div>
      </div>
      <p className="border-t border-stone-200 pt-0.5 font-serif text-[5.5px] text-stone-500">
        Columbia University — M.S. in Journalism, Honors
      </p>
    </div>
  ),

  executive: (
    <div className="flex h-full select-none flex-col justify-between bg-white text-neutral-900 leading-tight">
      <div>
        <div className="bg-[#0f172a] p-2 text-white">
          <p className="text-[9.5px] font-bold tracking-wide uppercase">David K. Sterling</p>
          <p className="text-[6.5px] font-medium text-amber-300">VP of Engineering · Cloud Infrastructure</p>
          <div className="mt-1 flex gap-2 font-mono text-[5.5px] text-slate-300">
            <span>$140M ARR</span>
            <span>·</span>
            <span>180+ Eng Org</span>
            <span>·</span>
            <span>FedRAMP</span>
          </div>
        </div>
        <div className="p-2">
          <p className="text-[6.5px] font-bold uppercase tracking-wider text-slate-800">Executive Leadership</p>
          <div className="mt-1">
            <div className="flex justify-between text-[6.5px] font-bold text-slate-900">
              <span>Datadog — VP of Engineering</span>
              <span className="font-mono text-[6px] text-slate-500">2021–Now</span>
            </div>
            <p className="mt-0.5 text-[6px] leading-[1.25] text-slate-600">
              • Scaled global engineering org from 60 to 185 across 4 hubs.
            </p>
            <p className="text-[6px] leading-[1.25] text-slate-600">
              • Spearheaded FedRAMP High certification, securing $52M pipeline.
            </p>
          </div>
          <div className="mt-1">
            <div className="flex justify-between text-[6.5px] font-bold text-slate-900">
              <span>Snowflake — Senior Director</span>
              <span className="font-mono text-[6px] text-slate-500">2017–21</span>
            </div>
            <p className="mt-0.5 text-[6px] leading-[1.25] text-slate-600">
              • Built multi-cloud telemetry backbone ingesting 120PB/day.
            </p>
          </div>
        </div>
      </div>
      <div className="p-2 pt-0 font-mono text-[5.5px] text-slate-400">
        Advisory: 3 Series-A Infrastructure Startups
      </div>
    </div>
  ),

  ivy: (
    <div className="flex h-full select-none flex-col justify-between bg-white p-2.5 text-neutral-900 leading-tight">
      <div>
        <div className="border-b border-neutral-300 pb-1 text-center">
          <p className="font-serif text-[10px] font-bold tracking-wider uppercase">Julian H. Montgomery</p>
          <p className="font-serif text-[6px] text-neutral-600">74 Dunster Street, Cambridge, MA · jmontgomery@post.harvard.edu</p>
        </div>
        <div className="mt-1.5">
          <p className="font-serif text-[6.5px] font-bold uppercase tracking-wider text-neutral-800">Education</p>
          <div className="mt-0.5 font-serif text-[6px] text-neutral-700">
            <p className="font-bold">HARVARD UNIVERSITY — A.B. in Economics (2020)</p>
            <p>GPA: 3.92 / 4.00 · magna cum laude · Phi Beta Kappa</p>
          </div>
        </div>
        <div className="mt-1.5">
          <p className="font-serif text-[6.5px] font-bold uppercase tracking-wider text-neutral-800">Experience</p>
          <div className="mt-0.5 font-serif">
            <div className="flex justify-between text-[6.5px] font-bold text-neutral-900">
              <span>GOLDMAN SACHS — Investment Banking</span>
              <span className="font-sans text-[6px] text-neutral-500">2020–22</span>
            </div>
            <p className="text-[6px] leading-[1.25] text-neutral-700">
              • Executed $16.4B in aggregate M&amp;A transactions across software.
            </p>
          </div>
          <div className="mt-1 font-serif">
            <div className="flex justify-between text-[6.5px] font-bold text-neutral-900">
              <span>BLACKSTONE — Private Equity Associate</span>
              <span className="font-sans text-[6px] text-neutral-500">2022–Now</span>
            </div>
            <p className="text-[6px] leading-[1.25] text-neutral-700">
              • Led due diligence on $2.4B SaaS platform buyout.
            </p>
          </div>
        </div>
      </div>
      <p className="border-t border-neutral-200 pt-0.5 font-serif text-[5.5px] text-neutral-500">
        Financial Modeling · LBO &amp; DCF · Strategic M&amp;A
      </p>
    </div>
  ),

  techMono: (
    <div className="flex h-full select-none flex-col justify-between bg-[#0b0f19] p-2.5 font-mono text-[7px] leading-snug text-emerald-400">
      <div>
        <div className="border-b border-emerald-900/60 pb-1">
          <p className="font-bold text-emerald-300">&gt; alex_rivera.json</p>
          <p className="text-[6px] text-emerald-500/70">role: "Staff Systems Architect" · Remote</p>
        </div>
        <div className="mt-1.5 space-y-1">
          <div>
            <p className="text-[6.5px] font-semibold text-emerald-200">Cloudflare — Staff Systems Eng</p>
            <p className="text-[5.5px] text-emerald-500/60">2021 — present</p>
            <p className="text-[6px] leading-[1.2] text-emerald-400/80">
              * Built low-latency storage engine for Workers KV.
            </p>
          </div>
          <div>
            <p className="text-[6.5px] font-semibold text-emerald-200">Red Hat — Kernel Dev</p>
            <p className="text-[5.5px] text-emerald-500/60">2017 — 2021</p>
            <p className="text-[6px] leading-[1.2] text-emerald-400/80">
              * eBPF packet scheduler optimizations in Linux 5.x.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-0.5 text-[5.5px] text-emerald-300">
        {['Go', 'Rust', 'C++', 'Linux', 'eBPF', 'K8s'].map((s) => (
          <span key={s} className="rounded border border-emerald-800/40 bg-emerald-950/80 px-1 py-px">{s}</span>
        ))}
      </div>
    </div>
  ),

  minimal: (
    <div className="flex h-full select-none flex-col justify-between bg-white p-2.5 text-neutral-900 leading-tight">
      <div>
        <div className="border-b-2 border-neutral-900 pb-1">
          <p className="text-[10px] font-black uppercase tracking-tight">Sophia Lindqvist</p>
          <p className="font-mono text-[6.5px] text-neutral-500">Senior Frontend Architect · Stockholm</p>
        </div>
        <div className="mt-1.5">
          <p className="text-[6.5px] font-bold uppercase tracking-wider text-neutral-900">Experience</p>
          <div className="mt-1">
            <div className="flex justify-between text-[6.5px] font-bold">
              <span>Spotify — Frontend Architect</span>
              <span className="font-mono text-[6px] text-neutral-500">2021–Now</span>
            </div>
            <p className="mt-0.5 text-[6px] leading-[1.25] text-neutral-600">
              • Rebuilt Web Player client, cutting memory overhead by 32%.
            </p>
          </div>
          <div className="mt-1">
            <div className="flex justify-between text-[6.5px] font-bold">
              <span>Klarna — Senior Frontend</span>
              <span className="font-mono text-[6px] text-neutral-500">2018–21</span>
            </div>
            <p className="mt-0.5 text-[6px] leading-[1.25] text-neutral-600">
              • Built checkout SDK deployed on 45k merchant stores.
            </p>
          </div>
        </div>
      </div>
      <p className="border-t border-neutral-200 pt-0.5 font-mono text-[5.5px] text-neutral-500">
        TypeScript, React, WebAudio, CSS Architecture
      </p>
    </div>
  ),
}

const ROW_A = [
  { name: 'Classic ATS', kind: 'Resume', p: 'classic' },
  { name: 'Swiss Typography', kind: 'Portfolio', image: '/template-previews/Swiss_Typography.png' },
  { name: 'Modern Clean', kind: 'Resume', p: 'split' },
  { name: 'Neon Cityscape', kind: 'Portfolio', image: '/template-previews/Neon_Cityscape.png' },
  { name: 'Elegant Serif', kind: 'Resume', p: 'serif' },
  { name: 'Terminal CLI', kind: 'Portfolio', image: '/template-previews/Terminal_CLI.png' },
  { name: 'Bento Box', kind: 'Portfolio', image: '/template-previews/Bento_Box.png' },
  { name: 'Tech Mono', kind: 'Resume', p: 'techMono' },
]

const ROW_B = [
  { name: 'Northern Fjords', kind: 'Portfolio', image: '/template-previews/Northern_Fjords.png' },
  { name: 'Executive Suite', kind: 'Resume', p: 'executive' },
  { name: 'Cyberpunk', kind: 'Portfolio', image: '/template-previews/Cyberpunk.png' },
  { name: 'Minimalist White', kind: 'Portfolio', image: '/template-previews/Minimalist_White.png' },
  { name: 'Memphis Pop', kind: 'Portfolio', image: '/template-previews/Memphis_Pop.png' },
  { name: 'Ivy League', kind: 'Resume', p: 'ivy' },
  { name: 'Ocean Depths', kind: 'Portfolio', image: '/template-previews/Ocean_Depths.png' },
  { name: 'High Fashion', kind: 'Portfolio', image: '/template-previews/High_Fashion.png' },
  { name: 'Vintage Newspaper', kind: 'Portfolio', image: '/template-previews/Vintage_Newspaper.png' },
  { name: 'Minimal Resume', kind: 'Resume', p: 'minimal' },
]

function TemplateCard({ t }) {
  const [imgError, setImgError] = useState(false)
  return (
    <div className="group w-56 shrink-0 rounded-lg border border-border bg-card p-1.5 transition hover:-translate-y-0.5 hover:border-foreground/20 sm:w-60">
      <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-border/60 bg-secondary/30">
        {t.image && !imgError ? (
          <img
            src={t.image}
            alt={t.name}
            onError={() => setImgError(true)}
            loading="lazy"
            className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          PREVIEWS[t.p] || PREVIEWS.classic
        )}
      </div>
      <div className="flex items-center gap-2 px-1.5 pb-1 pt-2.5">
        <span className="truncate text-[12.5px] font-medium tracking-tight text-foreground/80">{t.name}</span>
        <span
          className={cn(
            'ml-auto rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em]',
            t.kind === 'Resume'
              ? 'bg-primary/10 text-primary font-medium'
              : 'bg-accent text-accent-foreground font-medium',
          )}
        >
          {t.kind}
        </span>
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
