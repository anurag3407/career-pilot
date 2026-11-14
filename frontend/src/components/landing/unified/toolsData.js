// =============================================================================
// toolsData.js — the single source of truth for the platform's tool lineup.
// One entry per tool = one landing section = one dashboard group.
// =============================================================================
import {
  FileText,
  Sparkles,
  Flame,
  Mic,
  Briefcase,
  Palette,
  GitBranch,
  GraduationCap,
} from 'lucide-react'

export const TOOLS = [
  {
    id: 'resume-studio',
    name: 'Resume Studio',
    icon: FileText,
    accent: 'from-blue-500/20 to-blue-500/5',
    iconColor: 'text-blue-500',
    chipBg: 'bg-blue-500/10',
    tagline: 'Build, import and manage every version of your resume',
    description:
      'A full drag-and-drop resume builder with ATS-safe templates, PDF/docx upload parsing, text-to-resume conversion, version snapshots and shareable links. Your resume history stays in one place, not in ten files named resume_final_v3.',
    bullets: [
      { title: 'Drag-and-drop builder', desc: 'Section ordering, live preview, 30+ layouts' },
      { title: 'Upload & parse', desc: 'Drop a PDF or docx and get structured data back' },
      { title: 'Version snapshots', desc: 'Restore any previous state with one click' },
      { title: 'Share links', desc: 'Public read-only links for recruiters' },
    ],
    cta: { label: 'Open Resume Studio', to: '/hub/resume' },
    mock: 'resume',
  },
  {
    id: 'ai-enhancer',
    name: 'AI Enhancer & ATS',
    icon: Sparkles,
    accent: 'from-violet-500/20 to-violet-500/5',
    iconColor: 'text-violet-500',
    chipBg: 'bg-violet-500/10',
    tagline: 'Score, rewrite and tailor your resume with AI',
    description:
      'A deterministic ATS scorer plus multi-provider AI that rewrites bullet points, generates summaries, tailors your resume to a job description, tracks your score history and translates the whole thing — with your choice of Gemini, OpenAI, Groq, OpenRouter or Anthropic.',
    bullets: [
      { title: 'ATS score & breakdown', desc: 'Deterministic scoring with per-section feedback' },
      { title: 'Bullet rewrites', desc: 'Weak lines become quantified, high-impact bullets' },
      { title: 'One-click tailor', desc: 'Rewrite the resume against any job description' },
      { title: 'Score history', desc: 'Watch your ATS score climb across versions' },
    ],
    cta: { label: 'Enhance a resume', to: '/resume-builder/build' },
    mock: 'enhance',
  },
  {
    id: 'resume-roast',
    name: 'Resume Roast',
    icon: Flame,
    accent: 'from-orange-500/20 to-orange-500/5',
    iconColor: 'text-orange-500',
    chipBg: 'bg-orange-500/10',
    tagline: 'Brutally honest AI feedback — shareable, sometimes painful',
    description:
      'The same ATS engine, a sharper tongue. Roast grades your resume like a tired recruiter at 5pm: tagline, category ratings, silver linings and quick wins. Share the roast publicly with a link — great for LinkedIn engagement and for actually fixing the resume.',
    bullets: [
      { title: 'Roast + ratings', desc: 'Tagline, per-category scores, emoji verdict' },
      { title: 'Quick wins', desc: 'Concrete fixes ranked by impact' },
      { title: 'Silver linings', desc: 'What is already working — keep it' },
      { title: 'Public share links', desc: 'One token, zero login for the reader' },
    ],
    cta: { label: 'Roast my resume', to: '/resume-roast/analyze' },
    mock: 'roast',
  },
  {
    id: 'interview-sim',
    name: 'Interview Sim',
    icon: Mic,
    accent: 'from-red-500/20 to-red-500/5',
    iconColor: 'text-red-500',
    chipBg: 'bg-red-500/10',
    tagline: 'Voice mock interviews with an AI that pushes back',
    description:
      'Practice behavioral and coding interviews out loud. The AI asks, listens, follow-ups on weak answers, runs code in a built-in editor, then grades the whole session with per-answer feedback and a replayable transcript history.',
    bullets: [
      { title: 'Voice answers', desc: 'Speak naturally — audio is transcribed and graded' },
      { title: 'Coding mode', desc: 'Monaco editor + LLM-judged dry runs' },
      { title: 'JD parsing', desc: 'Paste a job URL and get a targeted session' },
      { title: 'History & replay', desc: 'Every session stored, annotated and replayable' },
    ],
    cta: { label: 'Start a mock interview', to: '/mock-interview/practice' },
    mock: 'interview',
  },
  {
    id: 'job-tracker',
    name: 'Job Finder & Tracker',
    icon: Briefcase,
    accent: 'from-emerald-500/20 to-emerald-500/5',
    iconColor: 'text-emerald-500',
    chipBg: 'bg-emerald-500/10',
    tagline: 'Search, save and move every application across a kanban',
    description:
      'AI-matched job search, a kanban tracker for the whole pipeline, smart alerts for new matches and analytics on what is actually working. The browser extension one-clicks jobs from LinkedIn, Indeed, Greenhouse and Lever straight into your board.',
    bullets: [
      { title: 'AI job search', desc: 'Matched roles with salary and apply links' },
      { title: 'Kanban pipeline', desc: 'Saved → Applied → Interviewing → Offer' },
      { title: 'Smart alerts', desc: 'Keyword + location rules, checked on schedule' },
      { title: '1-click extension', desc: 'Track jobs from any job board tab' },
    ],
    cta: { label: 'Open the tracker', to: '/job-finder/search' },
    mock: 'tracker',
  },
  {
    id: 'portfolio-studio',
    name: 'Portfolio Studio',
    icon: Palette,
    accent: 'from-purple-500/20 to-purple-500/5',
    iconColor: 'text-purple-500',
    chipBg: 'bg-purple-500/10',
    tagline: 'A designer-grade portfolio, deployed in one click',
    description:
      'Turn your resume into a live personal site. Pick from 264 templates, edit everything inline (with AI section rewrites), then deploy to Cloudflare Pages, Netlify or GitHub Pages — your subdomain, your content, no code.',
    bullets: [
      { title: '264 templates', desc: 'From minimal to animated showpieces' },
      { title: 'Inline AI editing', desc: 'Rewrite any section with a prompt' },
      { title: 'One-click deploy', desc: 'Cloudflare Pages, Netlify or GitHub Pages' },
      { title: 'Deployment log', desc: 'Every build tracked with its URL' },
    ],
    cta: { label: 'Build a portfolio', to: '/hub/portfolio' },
    mock: 'portfolio',
  },
  {
    id: 'github-intel',
    name: 'GitHub Intelligence',
    icon: GitBranch,
    accent: 'from-sky-500/20 to-sky-500/5',
    iconColor: 'text-sky-500',
    chipBg: 'bg-sky-500/10',
    tagline: 'Understand any codebase — including your own career signal',
    description:
      'Visualize any repository as an interactive architecture graph with risk cards and an AI chat that knows your code. Import your GitHub profile into a resume, generate a profile README, and turn pinned repos into a portfolio automatically.',
    bullets: [
      { title: 'Repo visualizer', desc: 'Module graph, complexity and risk analysis' },
      { title: 'Repo chat', desc: 'Ask questions about any codebase' },
      { title: 'GitHub → resume', desc: 'Import profile, repos and stats in seconds' },
      { title: 'README generator', desc: 'A profile README people actually read' },
    ],
    cta: { label: 'Visualize a repo', to: '/project-visualizer' },
    mock: 'github',
  },
  {
    id: 'career-growth',
    name: 'Career Growth & Community',
    icon: GraduationCap,
    accent: 'from-teal-500/20 to-teal-500/5',
    iconColor: 'text-teal-500',
    chipBg: 'bg-teal-500/10',
    tagline: 'Skill gaps, salary intel, outreach — and people on the same grind',
    description:
      'Close the loop: skill-gap analysis against any JD, salary bands by role and location, tailored cover letters, LinkedIn optimization, recruiter outreach drafts — plus a real community with channels, DMs and fellowships with challenges.',
    bullets: [
      { title: 'Skill gap & career path', desc: 'What to learn next, in what order' },
      { title: 'Salary estimator', desc: 'Percentile bands by role and region' },
      { title: 'Cover letters & outreach', desc: 'Tailored drafts for every application' },
      { title: 'Community & fellowship', desc: 'Channels, DMs, challenges and verification' },
    ],
    cta: { label: 'Explore growth tools', to: '/hub/career' },
    mock: 'growth',
  },
]

export default TOOLS
