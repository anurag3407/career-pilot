// =============================================================================
// UnifiedLanding.jsx — section primitives for the single unified landing page.
// Sections: StatsStrip · FeatureGrid · ToolSection ×8 · OpenSourceSection
// =============================================================================
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  Star,
  GitFork,
  Users,
  Terminal,
  ShieldCheck,
  Zap,
  FileText,
  Target,
  Mic,
  Palette,
  GitBranch,
  Flame,
  Sparkles,
  Briefcase,
  Bell,
  BarChart3,
  PenLine,
  TrendingUp,
  DollarSign,
  Mail,
  Linkedin,
  Users2,
  Award,
  BookMarked,
  Upload,
  Languages,
  GraduationCap,
  Code2,
  Rocket,
} from 'lucide-react'
import TOOLS from './toolsData'

// ---------------------------------------------------------------------------
// Shared bits
// ---------------------------------------------------------------------------
const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.55, ease: 'easeOut' },
}

function SectionShell({ id, children, className = '' }) {
  return (
    <section id={id} className={`relative py-20 sm:py-28 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  )
}

function Eyebrow({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-muted-foreground">
      {Icon && <Icon className="w-3.5 h-3.5 text-primary" />}
      {children}
    </span>
  )
}

// ---------------------------------------------------------------------------
// 1. StatsStrip — the platform in numbers
// ---------------------------------------------------------------------------
const STATS = [
  { value: '10+', label: 'AI career tools', sub: 'in one account' },
  { value: '264', label: 'Portfolio templates', sub: 'deploy in one click' },
  { value: '6', label: 'AI providers', sub: 'or bring your own key' },
  { value: '100%', label: 'Open source', sub: 'MIT licensed' },
]

export function StatsStrip() {
  return (
    <SectionShell className="py-12 sm:py-16">
      <motion.div
        {...reveal}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {STATS.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border bg-card/60 p-5 sm:p-6 text-center sm:text-left"
          >
            <p className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">{s.value}</p>
            <p className="text-sm font-semibold text-foreground mt-1">{s.label}</p>
            <p className="text-xs text-muted-foreground">{s.sub}</p>
          </div>
        ))}
      </motion.div>
    </SectionShell>
  )
}

// ---------------------------------------------------------------------------
// 2. FeatureGrid — the complete capability grid
// ---------------------------------------------------------------------------
const FEATURES = [
  { icon: FileText, title: 'Resume builder', desc: 'Drag-and-drop editor with live preview' },
  { icon: Upload, title: 'Upload & parse', desc: 'PDF / docx → structured resume data' },
  { icon: Sparkles, title: 'AI enhancement', desc: 'Summaries, rewrites, comprehensive analysis' },
  { icon: Target, title: 'ATS scoring', desc: 'Deterministic score with full breakdown' },
  { icon: Flame, title: 'Resume Roast', desc: 'Brutal feedback with share links' },
  { icon: Languages, title: 'Translate & tailor', desc: 'Any language, any job description' },
  { icon: Mic, title: 'Voice interviews', desc: 'Behavioral + coding mock sessions' },
  { icon: Code2, title: 'Coding rounds', desc: 'Monaco editor with AI-judged runs' },
  { icon: Briefcase, title: 'Job search', desc: 'AI-matched roles with salary data' },
  { icon: BarChart3, title: 'Kanban tracker', desc: 'Pipeline board with offline sync' },
  { icon: Bell, title: 'Job alerts', desc: 'Keyword rules with scheduled matches' },
  { icon: Palette, title: 'Portfolio studio', desc: '264 templates, inline AI editing' },
  { icon: Rocket, title: '1-click deploys', desc: 'Cloudflare Pages / Netlify / GitHub' },
  { icon: GitBranch, title: 'Repo visualizer', desc: 'Architecture graphs + repo chat' },
  { icon: BookMarked, title: 'README generator', desc: 'Profile READMEs that get reads' },
  { icon: PenLine, title: 'Cover letters', desc: 'Tailored to each application' },
  { icon: TrendingUp, title: 'Skill gap analysis', desc: 'What to learn next, ranked' },
  { icon: DollarSign, title: 'Salary estimator', desc: 'Percentile bands by role/region' },
  { icon: Linkedin, title: 'LinkedIn optimizer', desc: 'Headline to experience section' },
  { icon: Mail, title: 'Recruiter outreach', desc: 'Drafts, tracking and follow-ups' },
  { icon: Users2, title: 'Community', desc: 'Channels, posts and DMs in-app' },
  { icon: Award, title: 'Fellowships', desc: 'Challenges with verification' },
]

export function FeatureGrid() {
  return (
    <SectionShell id="features" className="scroll-mt-20">
      <motion.div {...reveal} className="max-w-2xl">
        <Eyebrow icon={Zap}>Everything included</Eyebrow>
        <h2 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          One platform. <span className="text-primary">Every tool your job search needs.</span>
        </h2>
        <p className="mt-3 text-base text-muted-foreground leading-relaxed">
          No add-ons, no per-tool pricing, no tab chaos. Every capability below ships in the single
          dashboard — powered by one account, one AI config, one database.
        </p>
      </motion.div>

      <motion.div
        {...reveal}
        className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
      >
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="group rounded-xl border border-border bg-card/50 p-4 hover:border-primary/30 hover:bg-card transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-4.5 h-4.5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{f.title}</p>
                <p className="text-xs text-muted-foreground truncate">{f.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </SectionShell>
  )
}

// ---------------------------------------------------------------------------
// 3. ToolSection — one section per tool, alternating layout
// ---------------------------------------------------------------------------
/* Miniature UI mocks, built from divs — one per tool type. */
function ToolMock({ variant, tool }) {
  const chip = tool.chipBg
  const iconColor = tool.iconColor

  const MockCard = ({ children, className = '' }) => (
    <div className={`rounded-xl border border-border bg-card/90 shadow-xl p-4 ${className}`}>{children}</div>
  )

  if (variant === 'resume') {
    return (
      <MockCard>
        <div className="flex items-center gap-2 mb-3">
          <span className={`w-7 h-7 rounded-lg ${chip} flex items-center justify-center`}>
            <FileText className={`w-3.5 h-3.5 ${iconColor}`} />
          </span>
          <div className="h-2.5 w-24 rounded bg-foreground/15" />
        </div>
        {['Experience', 'Projects', 'Skills', 'Education'].map((s, i) => (
          <div key={s} className="flex items-center gap-3 rounded-lg border border-border/70 px-3 py-2 mb-2 bg-background/60">
            <Grip />
            <span className="text-[11px] font-medium text-foreground/80 w-20">{s}</span>
            <div className="flex-1 h-1.5 rounded-full bg-foreground/10" style={{ maxWidth: `${70 - i * 12}%` }} />
          </div>
        ))}
        <div className="mt-2 flex justify-end">
          <span className="text-[10px] font-bold text-primary bg-primary/10 rounded-full px-2.5 py-1">v4 · latest</span>
        </div>
      </MockCard>
    )
  }

  if (variant === 'enhance') {
    return (
      <MockCard>
        <div className="flex items-center justify-between mb-3">
          <span className={`w-7 h-7 rounded-lg ${chip} flex items-center justify-center`}>
            <Sparkles className={`w-3.5 h-3.5 ${iconColor}`} />
          </span>
          <div className="relative w-14 h-14 rounded-full border-4 border-primary/25 border-t-primary" />
          <span className="text-xl font-black text-foreground">87</span>
        </div>
        {[
          { label: 'Impact', w: '82%' },
          { label: 'Keywords', w: '64%' },
          { label: 'Format', w: '93%' },
        ].map((r) => (
          <div key={r.label} className="mb-2.5">
            <div className="flex justify-between text-[10px] font-medium text-muted-foreground mb-1">
              <span>{r.label}</span><span>{r.w}</span>
            </div>
            <div className="h-1.5 rounded-full bg-foreground/10">
              <div className="h-full rounded-full bg-primary/70" style={{ width: r.w }} />
            </div>
          </div>
        ))}
        <div className="rounded-lg bg-primary/5 border border-primary/20 px-3 py-2 text-[10px] text-foreground/70 leading-snug">
          <Sparkles className="inline w-3 h-3 text-primary mr-1 -mt-0.5" />
          "Reduced API latency by 40%…" — rewritten with quantified impact
        </div>
      </MockCard>
    )
  }

  if (variant === 'roast') {
    return (
      <MockCard>
        <div className="flex items-center gap-2 mb-3">
          <span className={`w-7 h-7 rounded-lg ${chip} flex items-center justify-center`}>
            <Flame className={`w-3.5 h-3.5 ${iconColor}`} />
          </span>
          <div className="h-2.5 w-32 rounded bg-foreground/15" />
        </div>
        <div className="rounded-lg bg-orange-500/5 border border-orange-500/20 px-3 py-2.5 text-[11px] font-medium text-foreground/80 leading-snug mb-3">
          "Your 'skills' section lists Microsoft Office. It's 2026."
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[['Format', '6/10'], ['Impact', '4/10'], ['Honesty', '9/10']].map(([k, v]) => (
            <div key={k} className="rounded-lg border border-border/70 bg-background/60 p-2 text-center">
              <p className="text-[9px] text-muted-foreground font-medium">{k}</p>
              <p className="text-sm font-black text-foreground">{v}</p>
            </div>
          ))}
        </div>
      </MockCard>
    )
  }

  if (variant === 'interview') {
    return (
      <MockCard>
        <div className="flex items-center gap-2 mb-3">
          <span className={`w-7 h-7 rounded-lg ${chip} flex items-center justify-center`}>
            <Mic className={`w-3.5 h-3.5 ${iconColor}`} />
          </span>
          <div className="h-2.5 w-28 rounded bg-foreground/15" />
          <span className="ml-auto flex items-center gap-1 text-[10px] font-bold text-red-500">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> REC
          </span>
        </div>
        <div className="rounded-lg bg-background/60 border border-border/70 px-3 py-2.5 text-[11px] text-foreground/80 leading-snug mb-2">
          "Walk me through a time a production issue was your fault."
        </div>
        <div className="flex items-end gap-[3px] h-8 mb-3">
          {[38, 62, 45, 78, 55, 90, 42, 68, 85, 50, 72, 40, 60, 88, 46, 64].map((h, i) => (
            <div key={i} className="flex-1 rounded-sm bg-primary/40" style={{ height: `${h}%` }} />
          ))}
        </div>
        <div className="flex gap-2">
          <span className="text-[10px] font-bold text-primary bg-primary/10 rounded-full px-2.5 py-1">Follow-up ready</span>
          <span className="text-[10px] font-bold text-muted-foreground bg-muted rounded-full px-2.5 py-1">Q7 of 10</span>
        </div>
      </MockCard>
    )
  }

  if (variant === 'tracker') {
    const cols = [
      ['Saved', 3], ['Applied', 5], ['Interview', 2], ['Offer', 1],
    ]
    return (
      <MockCard>
        <div className="flex items-center gap-2 mb-3">
          <span className={`w-7 h-7 rounded-lg ${chip} flex items-center justify-center`}>
            <Briefcase className={`w-3.5 h-3.5 ${iconColor}`} />
          </span>
          <div className="h-2.5 w-24 rounded bg-foreground/15" />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {cols.map(([label, n]) => (
            <div key={label} className="rounded-lg bg-background/60 border border-border/70 p-2">
              <p className="text-[9px] font-semibold text-muted-foreground mb-1.5">{label}</p>
              {Array.from({ length: n }).map((_, i) => (
                <div key={i} className="h-4 rounded bg-foreground/10 mb-1" />
              ))}
            </div>
          ))}
        </div>
      </MockCard>
    )
  }

  if (variant === 'portfolio') {
    return (
      <MockCard>
        <div className="flex items-center gap-2 mb-3">
          <span className={`w-7 h-7 rounded-lg ${chip} flex items-center justify-center`}>
            <Palette className={`w-3.5 h-3.5 ${iconColor}`} />
          </span>
          <div className="h-2.5 w-24 rounded bg-foreground/15" />
          <span className="ml-auto text-[10px] font-bold text-emerald-500 bg-emerald-500/10 rounded-full px-2 py-0.5">
            live
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="aspect-[3/4] rounded-lg border border-border/70 bg-gradient-to-b from-primary/15 to-transparent p-1.5">
              <div className="h-1 w-2/3 rounded bg-foreground/20 mb-1" />
              <div className="h-1 w-1/2 rounded bg-foreground/10 mb-2" />
              <div className="h-4 rounded bg-foreground/10" />
            </div>
          ))}
        </div>
        <div className="rounded-lg bg-background/60 border border-border/70 px-3 py-2 flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground font-mono">you.pages.dev</span>
          <Rocket className="w-3 h-3 text-primary" />
        </div>
      </MockCard>
    )
  }

  if (variant === 'github') {
    return (
      <MockCard>
        <div className="flex items-center gap-2 mb-3">
          <span className={`w-7 h-7 rounded-lg ${chip} flex items-center justify-center`}>
            <GitBranch className={`w-3.5 h-3.5 ${iconColor}`} />
          </span>
          <div className="h-2.5 w-28 rounded bg-foreground/15" />
        </div>
        <svg viewBox="0 0 220 84" className="w-full h-20 mb-2">
          <g stroke="currentColor" className="text-border" strokeWidth="1.5" fill="none">
            <path d="M30 42 C 70 42, 80 16, 120 16" />
            <path d="M30 42 C 70 42, 80 68, 120 68" />
            <path d="M120 16 C 160 16, 160 42, 190 42" />
            <path d="M120 42 L 190 42" />
            <path d="M120 68 C 160 68, 160 42, 190 42" />
          </g>
          {[[30, 42, 'text-primary'], [120, 16, 'text-sky-400'], [120, 42, 'text-sky-400'], [120, 68, 'text-sky-400'], [190, 42, 'text-emerald-400']].map(([x, y, c], i) => (
            <circle key={i} cx={x} cy={y} r="7" className={`fill-background stroke-current ${c}`} strokeWidth="2" />
          ))}
        </svg>
        <div className="flex gap-2">
          <span className="text-[10px] font-bold text-primary bg-primary/10 rounded-full px-2.5 py-1">risk: low</span>
          <span className="text-[10px] font-bold text-muted-foreground bg-muted rounded-full px-2.5 py-1">12 modules</span>
        </div>
      </MockCard>
    )
  }

  // growth
  return (
    <MockCard>
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-7 h-7 rounded-lg ${chip} flex items-center justify-center`}>
          <GraduationCap className={`w-3.5 h-3.5 ${iconColor}`} />
        </span>
        <div className="h-2.5 w-28 rounded bg-foreground/15" />
      </div>
      {[
        ['System design', 72],
        ['Kubernetes', 45],
        ['TypeScript', 88],
      ].map(([skill, pct]) => (
        <div key={skill} className="mb-2.5">
          <div className="flex justify-between text-[10px] font-medium text-muted-foreground mb-1">
            <span>{skill}</span><span>{pct >= 70 ? 'ready' : 'gap'}</span>
          </div>
          <div className="h-1.5 rounded-full bg-foreground/10">
            <div
              className={`h-full rounded-full ${pct >= 70 ? 'bg-emerald-500/70' : 'bg-amber-500/70'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      ))}
      <div className="flex items-center justify-between rounded-lg bg-background/60 border border-border/70 px-3 py-2 mt-1">
        <span className="text-[10px] text-muted-foreground">Median · Senior SWE</span>
        <span className="text-sm font-black text-foreground">$165k</span>
      </div>
    </MockCard>
  )
}

function Grip() {
  return (
    <div className="flex flex-col gap-[3px] shrink-0 cursor-grab">
      {[0, 1].map((r) => (
        <div key={r} className="flex gap-[3px]">
          {[0, 1].map((c) => (
            <span key={c} className="w-[3px] h-[3px] rounded-full bg-foreground/25" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function ToolSections() {
  return (
    <>
      {TOOLS.map((tool, index) => (
        <SectionShell key={tool.id} id={tool.id} className="scroll-m-20 pt-4 sm:pt-8">
          <motion.div
            {...reveal}
            className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center`}
          >
            {/* Copy */}
            <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
              <div className="flex items-center gap-3">
                <span className={`w-11 h-11 rounded-xl bg-gradient-to-br ${tool.accent} border border-border flex items-center justify-center`}>
                  <tool.icon className={`w-5 h-5 ${tool.iconColor}`} />
                </span>
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Tool {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <h3 className="mt-5 text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                {tool.name}
              </h3>
              <p className="mt-1.5 text-base font-semibold text-primary">{tool.tagline}</p>
              <p className="mt-3 text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
                {tool.description}
              </p>

              <ul className="mt-6 space-y-3">
                {tool.bullets.map((b) => (
                  <li key={b.title} className="flex gap-3">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-primary" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{b.title}</p>
                      <p className="text-xs text-muted-foreground">{b.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <Link
                to={tool.cta.to}
                className="group mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all hover:gap-3"
              >
                {tool.cta.label}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Mock */}
            <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
              <div className="relative">
                <div className={`absolute -inset-6 rounded-3xl bg-gradient-to-br ${tool.accent} blur-2xl opacity-60`} />
                <div className="relative">
                  <ToolMock variant={tool.mock} tool={tool} />
                </div>
              </div>
            </div>
          </motion.div>
        </SectionShell>
      ))}
    </>
  )
}

// ---------------------------------------------------------------------------
// 4. OpenSourceSection — MIT, self-host, contribute
// ---------------------------------------------------------------------------
const OSS_POINTS = [
  {
    icon: ShieldCheck,
    title: 'Your data, your database',
    desc: 'Self-host against your own Cloudflare D1 database. BYOK means AI keys never leave your control.',
  },
  {
    icon: GitFork,
    title: 'Fork it, extend it',
    desc: 'Every tool is a module with clean seams — add a provider, a template or a whole tool.',
  },
  {
    icon: Users,
    title: 'Built by the community',
    desc: 'Good-first-issue tickets across 30+ route groups. First PR always gets a review.',
  },
]

export function OpenSourceSection() {
  return (
    <SectionShell id="open-source" className="scroll-mt-20">
      <motion.div
        {...reveal}
        className="relative overflow-hidden rounded-3xl border border-border bg-card/60 px-6 py-12 sm:px-12 sm:py-16"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="relative grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <Eyebrow icon={Terminal}>Open source</Eyebrow>
            <h2 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              Career OS, <span className="text-primary">MIT licensed</span>.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
              CareerPilot is a monorepo you can read, run and remix: a React frontend, a single
              Cloudflare Worker gateway, and a Cloudflare D1 schema you fully own. No black boxes, no
              vendor lock-in — star it, fork it, ship it.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="https://github.com/anurag3407/career-pilot"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-foreground px-5 py-2.5 text-sm font-bold text-background hover:opacity-90 transition-opacity"
              >
                <Star className="w-4 h-4" /> Star on GitHub
              </a>
              <a
                href="https://github.com/anurag3407/career-pilot/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-2.5 text-sm font-bold text-foreground hover:bg-muted transition-colors"
              >
                <GitFork className="w-4 h-4" /> Contribute
              </a>
            </div>
          </div>

          <div className="space-y-3">
            {OSS_POINTS.map((p) => (
              <div key={p.title} className="flex gap-4 rounded-xl border border-border bg-background/70 p-4">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <p.icon className="w-4.5 h-4.5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{p.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </SectionShell>
  )
}

// ---------------------------------------------------------------------------
// 5. ToolIndexStrip — quick anchor nav into the tool sections (optional jump)
// ---------------------------------------------------------------------------
export function ToolIndexStrip() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div {...reveal} className="flex flex-wrap justify-center gap-2 py-6">
        {TOOLS.map((t) => (
          <a
            key={t.id}
            href={`#${t.id}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
          >
            <t.icon className={`w-3.5 h-3.5 ${t.iconColor}`} />
            {t.name}
          </a>
        ))}
      </motion.div>
    </div>
  )
}
