import {
  Check, FileText, Palette, Github, Flame, Mic, Briefcase, Network,
  BookMarked, Users, Star, AlertTriangle, ArrowUpRight, Lock, Sparkles,
} from 'lucide-react'
import { cn } from '../../../lib/utils'
import { Eyebrow, MonoLabel, PrimaryButton, Reveal, Section } from './primitives'

const STORIES = [
  {
    id: 'resume-builder',
    icon: FileText,
    name: 'Resume builder',
    title: 'Write the resume. See the score move.',
    lede: 'A drag-and-drop editor with a live preview, ATS scoring, and rewrites you approve one line at a time. Import what you already have instead of starting from a blank page.',
    benefits: [
      { title: 'Sections you can reorder', desc: 'Experience, projects, skills, and education, with a preview that updates as you type.' },
      { title: 'PDF and docx import', desc: 'Drop an old resume and keep editing the structured version.' },
      { title: 'ATS score with a breakdown', desc: 'A deterministic score per section, plus history so you can see it climb.' },
      { title: 'Rewrites you control', desc: 'Vague bullets become specific. Tailor the whole resume to a job description before you export PDF or DOCX.' },
    ],
    cta: { label: 'Explore the resume builder', to: '/resume-builder' },
    mock: 'resume',
  },
  {
    id: 'portfolio-builder',
    icon: Palette,
    name: 'Portfolio builder',
    title: 'Turn that resume into a site people remember.',
    lede: 'Pick a template, fill it from your resume or projects, then publish. The portfolio is the public version of the same profile, not a second project you have to maintain by hand.',
    benefits: [
      { title: 'A real template gallery', desc: 'Developer-first layouts, from quiet and typographic to fully animated.' },
      { title: 'First draft from your data', desc: 'Resume content and project details land in the template so you are not staring at placeholders.' },
      { title: 'Edit any section in place', desc: 'Rewrite a block yourself, or ask the editor to redraft it.' },
      { title: 'Publish where you already host', desc: 'Cloudflare Pages, Netlify, or GitHub Pages, with the deployment URL saved.' },
    ],
    cta: { label: 'Explore the portfolio builder', to: '/portfolio-builder' },
    mock: 'portfolio',
  },
  {
    id: 'github-resume',
    icon: Github,
    name: 'GitHub resume',
    title: 'Let the repositories write the resume.',
    lede: 'Connect GitHub and turn the work you already shipped into a resume and a portfolio. Recruiters see the repos, languages, and projects you chose — not a raw profile dump.',
    benefits: [
      { title: 'Import the profile that exists', desc: 'Repos, languages, and stats come in from your GitHub account or a public username.' },
      { title: 'You pick what gets shown', desc: 'Curate the repositories that belong on a resume. Pin the work, hide the experiments.' },
      { title: 'Stack, not a star count', desc: 'Language mix and project detail sit next to the role, so the resume reads like experience.' },
      { title: 'Same source, two outputs', desc: 'Save it as resume material and as a GitHub portfolio you can publish.' },
    ],
    cta: { label: 'Build from GitHub', to: '/github-portfolio' },
    mock: 'github',
  },
  {
    id: 'resume-roast',
    icon: Flame,
    name: 'Resume roast',
    title: 'A recruiter’s read, without the polite version.',
    lede: 'Paste the resume and the target role. You get a grade, the lines that are hurting you, and the fixes worth doing first — shareable if you want the feedback in public.',
    benefits: [
      { title: 'A verdict, not a pep talk', desc: 'Tagline, category ratings, and the lines a tired reviewer would skip.' },
      { title: 'Quick wins, ranked', desc: 'Concrete edits ordered by how much they change the read.' },
      { title: 'What to keep', desc: 'The parts that already work stay marked, so you do not “fix” them away.' },
      { title: 'A link you can send', desc: 'Share the roast without asking anyone to create an account.' },
    ],
    cta: { label: 'See the resume roast', to: '/resume-roast' },
    mock: 'roast',
  },
  {
    id: 'mock-interview',
    icon: Mic,
    name: 'Mock interview',
    title: 'Rehearse the interview out loud.',
    lede: 'Behavioral questions and a coding round, built from the job you are actually chasing. The interviewer follows up when an answer is thin, then grades the session so you can replay it.',
    benefits: [
      { title: 'Voice, not a text box', desc: 'You speak. The answer is transcribed and graded against the question that was asked.' },
      { title: 'Follow-ups that push', desc: 'Weak answers get a second question instead of a polite move-on.' },
      { title: 'A coding round in the same session', desc: 'Editor, a dry run, and a judgment of the solution — not a separate app.' },
      { title: 'A transcript you can replay', desc: 'Every session stays annotated so the next one starts from what you missed.' },
    ],
    cta: { label: 'See mock interviews', to: '/mock-interview' },
    mock: 'interview',
  },
  {
    id: 'job-finder',
    icon: Briefcase,
    name: 'Job finder',
    title: 'Search, save, and move every application.',
    lede: 'Matched roles with salary context, then a board for the pipeline. Saved, applied, interviewing, offer — one place, including jobs you grab from a listing tab.',
    benefits: [
      { title: 'Search aimed at you', desc: 'Roles with pay context and a direct way to apply, matched to the profile you already built.' },
      { title: 'A board, not a spreadsheet', desc: 'Move an application across stages without losing the job description that went with it.' },
      { title: 'Alerts that stay specific', desc: 'Keyword and location rules, checked on a schedule, for the searches you care about.' },
      { title: 'Capture from the listing', desc: 'Save a role from the boards you already browse and drop it on the pipeline.' },
    ],
    cta: { label: 'See the job finder', to: '/job-finder' },
    mock: 'jobs',
  },
  {
    id: 'project-visualizer',
    icon: Network,
    name: 'Project visualizer',
    title: 'See a codebase before you explain it.',
    lede: 'Point it at a repository and get an architecture map, the risky parts, and a chat that has actually read the code. Useful when a portfolio project needs a story, or an interview needs a walkthrough.',
    benefits: [
      { title: 'A map, not a file tree', desc: 'Modules, how they connect, and where the complexity actually sits.' },
      { title: 'Risk called out', desc: 'The parts of the repo worth mentioning — and the parts worth fixing before you demo them.' },
      { title: 'Ask the repo', desc: 'Questions answered against that codebase, so you can prep a walkthrough in your own words.' },
      { title: 'A story for the portfolio', desc: 'Turn “I built X” into the architecture a reviewer can follow.' },
    ],
    cta: { label: 'See the visualizer', to: '/project-visualizer' },
    mock: 'repo',
  },
  {
    id: 'readme-generator',
    icon: BookMarked,
    name: 'README generator',
    title: 'A GitHub profile that reads on purpose.',
    lede: 'A profile README drafted from the work you want associated with your name. Structure, stack, and the projects worth a click — ready to put on the profile recruiters open first.',
    benefits: [
      { title: 'A draft, not a blank markdown file', desc: 'Sections for what you build, the stack, and the work to click.' },
      { title: 'Tied to real projects', desc: 'The README points at the repositories you want read, not a generic bio.' },
      { title: 'Editable before it ships', desc: 'Change the voice. Keep the structure.' },
      { title: 'Sits next to the resume', desc: 'The same career profile, written for the place people check after LinkedIn.' },
    ],
    cta: { label: 'See the README generator', to: '/readme-generator' },
    mock: 'readme',
  },
  {
    id: 'recruiters',
    icon: Users,
    name: 'Recruiter pipeline',
    title: 'The other side of the same search.',
    lede: 'A shared board for people hiring: stages, candidates, and the notes that usually live in a thread. Built for a small team that needs a pipeline, not a full recruiting suite.',
    benefits: [
      { title: 'One board for the opening', desc: 'Stages everyone on the team can see, without a second tool.' },
      { title: 'Notes stay on the candidate', desc: 'Feedback lives next to the person, not in a chat that scrolls away.' },
      { title: 'Small-team weight', desc: 'Enough structure to stay aligned. None of the enterprise ATS ceremony.' },
      { title: 'Same platform as the candidate tools', desc: 'Resumes, portfolios, and the pipeline sit in one product.' },
    ],
    cta: { label: 'See the recruiter pipeline', to: '/recruiters' },
    mock: 'recruit',
  },
]

function Panel({ children, title }) {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 rounded-3xl bg-primary/[0.06] blur-2xl"
      />
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-[0_24px_60px_-36px_rgba(0,0,0,0.45)]">
        <div className="flex items-center justify-between border-b border-border bg-background/70 px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-foreground/15" />
            <span className="h-2 w-2 rounded-full bg-foreground/15" />
            <span className="h-2 w-2 rounded-full bg-foreground/15" />
            <MonoLabel className="ml-2">Preview</MonoLabel>
          </div>
          {title && (
            <span className="font-mono text-[10px] text-foreground/40">{title}</span>
          )}
        </div>
        <div className="p-4 sm:p-5">{children}</div>
      </div>
    </div>
  )
}

function StoryMock({ kind }) {
  if (kind === 'resume') {
    return (
      <Panel title="v3 · tailored">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MonoLabel>Resume · live</MonoLabel>
            <span className="inline-flex items-center gap-1 rounded bg-accent px-1.5 py-0.5 font-mono text-[9px] font-medium text-accent-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-foreground" />
              Synced
            </span>
          </div>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-primary">
            ATS 91 (+29)
          </span>
        </div>

        {/* Candidate header */}
        <div className="rounded-lg border border-border/80 bg-background/90 p-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[13px] font-bold text-foreground">Maya Okafor</p>
              <p className="text-[11px] text-foreground/60">Senior Frontend Engineer · Lagos → Remote</p>
              <p className="mt-1 font-mono text-[9px] text-foreground/40">maya.dev · github.com/mayaokafor</p>
            </div>
            <span className="rounded border border-primary/30 bg-primary/5 px-1.5 py-0.5 font-mono text-[8.5px] uppercase tracking-wider text-primary">
              Target: Staff FE
            </span>
          </div>
        </div>

        {/* Experience Section */}
        <div className="mt-2.5 space-y-2">
          <div className="rounded-lg border border-border/80 bg-background/90 p-2.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-wider text-foreground/40">Experience</span>
              <span className="font-mono text-[8.5px] font-medium text-accent-foreground">9/11 Quantified</span>
            </div>
            <div className="mt-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <p className="font-semibold text-foreground/90">Lumen Labs — Frontend Lead</p>
                <span className="font-mono text-[9px] text-foreground/40">2022–Now</span>
              </div>
              <div className="mt-1 rounded border border-primary/25 bg-primary/[0.04] p-1.5 text-[10px] leading-relaxed text-foreground/80">
                <span className="mr-1 font-mono text-[8px] font-bold uppercase text-primary">[AI Rewrite]</span>
                Cut LCP <b className="font-semibold text-primary">41%</b> across 3 product surfaces, lifting signup conversion <b className="font-semibold text-primary">12%</b>.
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-border/80 bg-background/90 p-2.5">
              <span className="font-mono text-[9px] uppercase tracking-wider text-foreground/40">Skills Matched</span>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {['React 19', 'TypeScript', 'Next.js', 'Web Vitals'].map((s) => (
                  <span key={s} className="flex items-center gap-0.5 rounded bg-accent/15 px-1 py-0.5 text-[9px] font-medium text-accent-foreground">
                    <Check className="h-2 w-2" /> {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-border/80 bg-background/90 p-2.5">
              <span className="font-mono text-[9px] uppercase tracking-wider text-foreground/40">Education</span>
              <p className="mt-1 text-[10.5px] font-semibold text-foreground/90">Univ. of Lagos</p>
              <p className="text-[9.5px] text-foreground/50">B.S. CS · 1st Class Honours</p>
            </div>
          </div>
        </div>

        <div className="mt-2.5 flex items-center justify-between border-t border-border/40 pt-2 font-mono text-[9px] text-foreground/40">
          <span>1 page · 482 words · Parse-Safe</span>
          <span>export · pdf / docx</span>
        </div>
      </Panel>
    )
  }

  if (kind === 'portfolio') {
    const TEMPLATES = [
      { name: 'Studio', img: '/template-previews/Architect_Studio.png', active: false },
      { name: 'Bento Box', img: '/template-previews/Bento_Box.png', active: true },
      { name: 'Tech Startup', img: '/template-previews/Tech_Startup.png', active: false },
    ]

    return (
      <Panel title="Cloudflare Pages">
        <div className="flex items-center justify-between">
          <MonoLabel>Template · deployed</MonoLabel>
          <span className="inline-flex items-center gap-1 rounded bg-accent px-1.5 py-0.5 font-mono text-[8.5px] font-medium text-accent-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-foreground" />
            200 OK · Live
          </span>
        </div>

        {/* Template Gallery Picker with real thumbnails */}
        <div className="mt-2.5 grid grid-cols-3 gap-2">
          {TEMPLATES.map((t) => (
            <div
              key={t.name}
              className={cn(
                'group relative overflow-hidden rounded-lg border p-1 transition-all',
                t.active
                  ? 'border-primary bg-primary/[0.04] shadow-sm ring-1 ring-primary/40'
                  : 'border-border bg-background/80 hover:border-foreground/30',
              )}
            >
              <div className="aspect-[16/10] overflow-hidden rounded bg-secondary/30">
                <img
                  src={t.img}
                  alt={t.name}
                  loading="lazy"
                  className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-1 flex items-center justify-between px-0.5 pb-0.5">
                <p className="truncate text-[10px] font-semibold text-foreground/90">{t.name}</p>
                {t.active && (
                  <span className="rounded bg-primary/15 px-1 py-px font-mono text-[7.5px] font-bold uppercase text-primary">
                    Active
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Live URL & Preview Card */}
        <div className="mt-3 rounded-lg border border-border/80 bg-background/90 p-2.5">
          <div className="flex items-center justify-between border-b border-border/50 pb-1.5">
            <div className="flex items-center gap-1.5 font-mono text-[9.5px] text-foreground/70">
              <Lock className="h-2.5 w-2.5 text-accent-foreground" />
              <span>maya-okafor.pages.dev</span>
            </div>
            <span className="inline-flex items-center gap-0.5 text-[9px] font-medium text-primary">
              Visit <ArrowUpRight className="h-2.5 w-2.5" />
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-foreground/60">
            <span>Synced from Resume Profile (v3)</span>
            <span className="font-mono text-[9px] text-foreground/40">Updated 4m ago</span>
          </div>
        </div>
      </Panel>
    )
  }

  if (kind === 'github') {
    return (
      <Panel title="github.com/mayaokafor">
        <div className="flex items-center justify-between">
          <MonoLabel>Imported from GitHub</MonoLabel>
          <span className="rounded-full bg-accent px-1.5 py-0.5 font-mono text-[9px] font-medium text-accent-foreground">
            3 pinned to resume
          </span>
        </div>

        <div className="mt-2.5 space-y-2">
          {[
            {
              repo: 'career-pilot',
              desc: 'AI-driven career OS with ATS parsing and mock interviews',
              lang: 'TypeScript',
              color: 'bg-blue-500',
              stars: '142',
              commits: '1.2k',
            },
            {
              repo: 'flight-deck-ui',
              desc: 'Accessible design system tokens & editorial UI components',
              lang: 'React',
              color: 'bg-sky-400',
              stars: '78',
              commits: '420',
            },
            {
              repo: 'telemetry-worker',
              desc: 'High-throughput stream aggregator handling 85k events/sec',
              lang: 'Go',
              color: 'bg-cyan-500',
              stars: '54',
              commits: '240',
            },
          ].map((item) => (
            <div
              key={item.repo}
              className="rounded-lg border border-border/80 bg-background/90 p-2.5 transition-colors hover:border-foreground/25"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-[11.5px] font-semibold text-foreground">{item.repo}</p>
                    <span className="rounded bg-muted px-1 py-px font-mono text-[8px] text-foreground/50">Public</span>
                  </div>
                  <p className="mt-0.5 text-[10px] text-foreground/60 line-clamp-1">{item.desc}</p>
                </div>
                <div className="flex items-center gap-1 font-mono text-[10px] text-foreground/60">
                  <Star className="h-3 w-3 text-amber-500" />
                  <span>{item.stars}</span>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-3 border-t border-border/40 pt-1.5 font-mono text-[8.5px] text-foreground/50">
                <span className="flex items-center gap-1">
                  <span className={`h-1.5 w-1.5 rounded-full ${item.color}`} />
                  {item.lang}
                </span>
                <span>{item.commits} commits</span>
                <span className="ml-auto font-medium text-primary">Included in profile ✓</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    )
  }

  if (kind === 'roast') {
    return (
      <Panel title="Recruiter Read · 5:15 PM">
        <div className="flex items-center justify-between">
          <MonoLabel>Resume Roast Verdict</MonoLabel>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold text-primary">
            Overall: B+ (78/100)
          </span>
        </div>

        {/* Roast Quote Card */}
        <div className="mt-2.5 rounded-lg border border-primary/30 bg-primary/[0.04] p-3">
          <p className="text-[12px] font-medium leading-relaxed text-foreground/90">
            “Strong technical stack and clean layout. But your Northwind bullets read like a job description rather than business value. Quantify the revenue impact to pass the staff screener.”
          </p>
        </div>

        {/* Category Grades */}
        <div className="mt-2.5 grid grid-cols-3 gap-2 text-center">
          {[
            { label: 'Impact', grade: 'C+', note: 'Needs metrics' },
            { label: 'ATS Parser', grade: '92%', note: 'Pass-safe' },
            { label: 'Relevance', grade: 'A-', note: 'High match' },
          ].map((c) => (
            <div key={c.label} className="rounded-lg border border-border/80 bg-background/90 px-1 py-2">
              <p className="font-mono text-[9px] uppercase text-foreground/40">{c.label}</p>
              <p className="mt-0.5 text-[14px] font-bold tabular-nums text-foreground">{c.grade}</p>
              <p className="text-[8.5px] text-foreground/50">{c.note}</p>
            </div>
          ))}
        </div>

        {/* Quick Win Fix */}
        <div className="mt-2.5 rounded-lg border border-border/80 bg-background/90 p-2.5">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-primary">
            <Sparkles className="h-3 w-3" />
            <span>#1 Quick Win (+8 ATS points)</span>
          </div>
          <p className="mt-1 text-[9.5px] leading-snug text-foreground/60">
            Replace: <span className="text-foreground/40 line-through">"Worked on web performance"</span> →
            <span className="font-medium text-foreground/90"> "Cut LCP 41% across 3 products, lifting conversions 12%"</span>
          </p>
        </div>
      </Panel>
    )
  }

  if (kind === 'interview') {
    return (
      <Panel title="Session #04 · Staff FE">
        <div className="flex items-center justify-between">
          <MonoLabel>Voice Mock Interview</MonoLabel>
          <span className="rounded-full bg-accent px-1.5 py-0.5 font-mono text-[9px] font-medium text-accent-foreground">
            Target: Arcwise
          </span>
        </div>

        {/* Question Prompt */}
        <div className="mt-2.5 rounded-lg border border-border/80 bg-background/90 p-3">
          <span className="font-mono text-[8.5px] font-semibold uppercase tracking-wider text-primary">
            Question 2 of 5 · Behavioral &amp; Leadership
          </span>
          <p className="mt-1.5 text-[12px] font-medium leading-relaxed text-foreground/90">
            “Tell me about a time you pushed back on a product deadline because of core technical debt or performance risk.”
          </p>
        </div>

        {/* Waveform Recording Bar */}
        <div className="mt-2.5 rounded-lg border border-primary/30 bg-primary/[0.05] p-2.5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 font-mono text-[9.5px] font-medium text-primary">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              Recording Voice Answer
            </span>
            <span className="font-mono text-[10px] text-foreground/50">00:48 / 02:00</span>
          </div>
          <div className="mt-2 flex h-6 items-center gap-1">
            {[35, 60, 45, 80, 55, 90, 40, 70, 85, 65, 95, 50, 40, 75, 85, 45, 60, 40, 70, 50, 30].map((h, i) => (
              <span key={i} className="flex-1 rounded-full bg-primary/70" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>

        {/* Live AI Evaluator */}
        <div className="mt-2.5 flex items-center justify-between rounded-lg border border-border/80 bg-background/90 p-2 text-[10px] text-foreground/60">
          <span className="font-medium text-foreground/80">AI Evaluation: Strong STAR framing</span>
          <span className="font-mono font-semibold text-accent-foreground">Score: 8.6 / 10</span>
        </div>
      </Panel>
    )
  }

  if (kind === 'jobs') {
    return (
      <Panel title="Pipeline Cockpit">
        {/* Kanban Stats */}
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { label: 'Saved', n: 12, hot: false },
            { label: 'Applied', n: 8, hot: false },
            { label: 'Interview', n: 3, hot: true },
            { label: 'Offer', n: 1, win: true },
          ].map((col) => (
            <div key={col.label} className="rounded-lg border border-border/80 bg-background/90 p-2 text-center">
              <p className="font-mono text-[8.5px] uppercase tracking-wider text-foreground/40">{col.label}</p>
              <p className={cn('mt-0.5 text-[15px] font-bold tabular-nums', col.hot ? 'text-primary' : col.win ? 'text-accent-foreground' : 'text-foreground')}>
                {col.n}
              </p>
            </div>
          ))}
        </div>

        {/* High Intent Lead Card */}
        <div className="mt-2.5 rounded-lg border border-primary/35 bg-primary/[0.04] p-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-[12.5px] font-bold text-foreground">Arcwise</p>
                <span className="rounded bg-primary/15 px-1 py-px font-mono text-[8px] font-bold uppercase text-primary">
                  Round 3
                </span>
              </div>
              <p className="text-[11px] font-medium text-foreground/80">Staff Frontend Engineer</p>
              <p className="mt-1 font-mono text-[9px] text-foreground/50">$210,000 – $230,000 · Remote</p>
            </div>
            <span className="rounded bg-accent/15 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-accent-foreground">
              94% Match
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-primary/15 pt-1.5 text-[9.5px]">
            <span className="text-foreground/70">Next: System Design Loop</span>
            <span className="font-mono font-medium text-primary">Tomorrow, 2:00 PM</span>
          </div>
        </div>

        {/* Other Active Roles */}
        <div className="mt-2 grid grid-cols-2 gap-2 text-[10px]">
          <div className="rounded-lg border border-border/80 bg-background/90 p-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground/90">Stripe</span>
              <span className="font-mono text-[8px] text-foreground/40">Applied 2d</span>
            </div>
            <p className="text-[9px] text-foreground/60">Staff Infra · $215k</p>
          </div>
          <div className="rounded-lg border border-border/80 bg-background/90 p-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground/90">Retool</span>
              <span className="font-mono text-[8px] font-semibold text-accent-foreground">Offer $225k</span>
            </div>
            <p className="text-[9px] text-foreground/60">Lead UI · Signed</p>
          </div>
        </div>
      </Panel>
    )
  }

  if (kind === 'repo') {
    return (
      <Panel title="careerpilot/core-engine">
        <div className="flex items-center justify-between">
          <MonoLabel>Architecture Topology</MonoLabel>
          <span className="rounded bg-accent px-1.5 py-0.5 font-mono text-[8.5px] font-medium text-accent-foreground">
            14 modules mapped
          </span>
        </div>

        {/* Micro Topology diagram */}
        <div className="mt-2.5 rounded-lg border border-border/80 bg-background/90 p-3">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded border border-border bg-card p-2">
              <span className="font-mono text-[9px] font-bold text-foreground">api-gateway</span>
              <p className="text-[8px] text-foreground/40">FastAPI · 12ms p95</p>
            </div>
            <div className="rounded border border-primary/40 bg-primary/5 p-2">
              <span className="font-mono text-[9px] font-bold text-primary">worker-queue</span>
              <p className="text-[8px] text-foreground/40">Temporal · 4 nodes</p>
            </div>
            <div className="rounded border border-border bg-card p-2">
              <span className="font-mono text-[9px] font-bold text-foreground">postgres-db</span>
              <p className="text-[8px] text-foreground/40">PgBouncer · Supabase</p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-around font-mono text-[8px] text-foreground/40">
            <span>HTTP / REST</span>
            <span>───── gRPC ─────&gt;</span>
            <span>Connection Pool</span>
          </div>
        </div>

        {/* Risk Card */}
        <div className="mt-2.5 rounded-lg border border-amber-500/30 bg-amber-500/[0.05] p-2.5">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-amber-500">
            <AlertTriangle className="h-3 w-3" />
            <span>Architecture Risk Identified</span>
          </div>
          <p className="mt-1 text-[9.5px] leading-snug text-foreground/70">
            <code className="rounded bg-amber-500/10 px-1 py-px font-mono text-amber-400">worker/queue.go</code> lacks jitter backoff; Redis connection storms possible under network partition.
          </p>
        </div>

        {/* Ask the Repo */}
        <div className="mt-2 flex items-center justify-between rounded-lg border border-border/80 bg-background/90 p-2 text-[9.5px] text-foreground/60">
          <span>Q: "How does ATS scoring parse PDF fonts?"</span>
          <span className="font-mono font-medium text-primary">Read answer →</span>
        </div>
      </Panel>
    )
  }

  if (kind === 'readme') {
    return (
      <Panel title="github.com/mayaokafor/README.md">
        <div className="flex items-center justify-between">
          <MonoLabel>Profile README.md</MonoLabel>
          <span className="rounded bg-accent px-1.5 py-0.5 font-mono text-[8.5px] font-medium text-accent-foreground">
            Markdown Preview
          </span>
        </div>

        <div className="mt-2.5 select-none rounded-lg border border-border/80 bg-background/90 p-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-700 text-[10px] font-bold text-white">
              MO
            </div>
            <div>
              <p className="text-[12px] font-bold text-foreground">Hi, I'm Maya Okafor 👋</p>
              <p className="text-[9.5px] text-foreground/50">Lead Frontend Engineer &amp; Design Systems Specialist</p>
            </div>
          </div>

          <div className="mt-2.5 space-y-1.5 text-[10px] leading-relaxed text-foreground/75">
            <p>
              🚀 Building high-performance web applications with Next.js, TypeScript &amp; Web Vitals in focus.
            </p>
            <p className="font-mono text-[9px] text-foreground/55">
              🔭 Currently leading frontend architecture at <b>Lumen Labs</b>.
            </p>
          </div>

          <div className="mt-3 border-t border-border/50 pt-2">
            <span className="font-mono text-[8.5px] font-semibold uppercase tracking-wider text-foreground/40">
              Top OSS Projects
            </span>
            <div className="mt-1.5 grid grid-cols-2 gap-1.5">
              <div className="rounded border border-border/80 bg-card p-1.5">
                <p className="font-mono text-[9px] font-bold text-foreground">motion-primitives</p>
                <p className="text-[8px] text-foreground/50">React 19 animations · 4.2k ★</p>
              </div>
              <div className="rounded border border-border/80 bg-card p-1.5">
                <p className="font-mono text-[9px] font-bold text-foreground">tailwind-tokens</p>
                <p className="text-[8px] text-foreground/50">Multi-tenant theme sync · 890 ★</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2.5 flex items-center justify-between border-t border-border/40 pt-2 font-mono text-[9px] text-foreground/40">
          <span>Synced with CareerPilot Profile</span>
          <span className="font-medium text-primary">Ready to push ↗</span>
        </div>
      </Panel>
    )
  }

  return (
    <Panel title="Team ATS · Opening #104">
      <div className="flex items-center justify-between">
        <MonoLabel>Candidate Pipeline</MonoLabel>
        <span className="rounded bg-accent px-1.5 py-0.5 font-mono text-[8.5px] font-medium text-accent-foreground">
          Role: Staff Frontend (Open)
        </span>
      </div>

      {/* Stage Columns */}
      <div className="mt-2.5 grid grid-cols-3 gap-2">
        {[
          { stage: 'Screen', count: 4, hot: false },
          { stage: 'Technical Loop', count: 2, hot: true },
          { stage: 'Offer Stage', count: 1, win: true },
        ].map((col) => (
          <div key={col.stage} className="rounded-lg border border-border/80 bg-background/90 p-2">
            <div className="flex items-center justify-between">
              <span className="truncate text-[9.5px] font-medium text-foreground/70">{col.stage}</span>
              <span className={cn('font-mono text-[10px] font-bold', col.hot ? 'text-primary' : col.win ? 'text-accent-foreground' : 'text-foreground/50')}>
                {col.count}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Highlighted Candidate Card */}
      <div className="mt-2.5 rounded-lg border border-primary/40 bg-primary/[0.04] p-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-[12px] font-bold text-foreground">Maya Okafor</p>
              <span className="rounded bg-primary/15 px-1 py-px font-mono text-[8px] font-semibold text-primary">
                In Technical Loop
              </span>
            </div>
            <p className="text-[10px] text-foreground/60">Frontend Lead · Lumen Labs (6 yrs exp)</p>
          </div>
          <span className="rounded bg-accent px-1.5 py-0.5 font-mono text-[9px] font-bold text-accent-foreground">
            94% Match
          </span>
        </div>

        <div className="mt-2 rounded border border-border/70 bg-background/90 p-2 text-[9.5px] leading-relaxed text-foreground/75">
          <span className="font-semibold text-foreground">Reviewer Note (Alex S.):</span> “Outstanding performance breakdown during architecture interview. Recommended for Senior Staff.”
        </div>

        <div className="mt-2 flex items-center justify-between font-mono text-[8.5px] text-foreground/50">
          <span>Score: 4.9 / 5.0</span>
          <span className="font-medium text-primary">Schedule Onsite Loop →</span>
        </div>
      </div>
    </Panel>
  )
}

export default function FeatureStories() {
  return (
    <div id="features">
      {STORIES.map((story, index) => {
        const flip = index % 2 === 1
        const Icon = story.icon
        return (
          <Section key={story.id} id={story.id} className="scroll-mt-20 py-16 sm:py-24">
            {index === 0 && (
              <Reveal>
                <div className="mb-16 max-w-2xl lg:mb-20">
                  <Eyebrow>Features</Eyebrow>
                  <h2 className="mt-4 text-[1.75rem] font-medium leading-[1.08] tracking-[-0.035em] text-balance sm:text-4xl lg:text-[2.6rem]">
                    One section for each tool.
                  </h2>
                  <p className="mt-4 max-w-xl text-[14.5px] leading-7 text-foreground/58">
                    Resume builder, portfolio builder, GitHub resume, and every other product — each with what it does and why you would open it.
                  </p>
                </div>
              </Reveal>
            )}

            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <Reveal className={flip ? 'lg:order-2' : undefined}>
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-md border border-border text-foreground/70">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40">
                    {String(index + 1).padStart(2, '0')} — {story.name}
                  </span>
                </div>
                <h3 className="mt-5 text-[1.65rem] font-medium leading-[1.12] tracking-[-0.03em] text-balance sm:text-4xl">
                  {story.title}
                </h3>
                <p className="mt-4 max-w-xl text-[14.5px] leading-7 text-foreground/58">{story.lede}</p>
                <ul className="mt-7 space-y-4">
                  {story.benefits.map((benefit) => (
                    <li key={benefit.title} className="flex gap-3">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                        <Check className="h-3 w-3" />
                      </span>
                      <div>
                        <p className="text-[13.5px] font-semibold tracking-tight">{benefit.title}</p>
                        <p className="mt-0.5 text-[13px] leading-relaxed text-foreground/55">{benefit.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <PrimaryButton to={story.cta.to}>{story.cta.label}</PrimaryButton>
                </div>
              </Reveal>

              <Reveal delay={0.06} className={flip ? 'lg:order-1' : undefined}>
                <StoryMock kind={story.mock} />
              </Reveal>
            </div>
          </Section>
        )
      })}
    </div>
  )
}
