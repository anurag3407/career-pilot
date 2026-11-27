import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Flame,
  Globe,
  Github,
  Linkedin,
  Briefcase,
  Target,
  Bell,
  Mail,
  Mic,
  Video,
  TrendingUp,
  GraduationCap,
  DollarSign,
  Users,
  Award,
  Rocket,
  User,
  UserRound,
  Settings,
  ShieldCheck,
  Sparkles,
  BookMarked,
  Network,
} from 'lucide-react'

/**
 * Single source of truth for CareerPilot's paid-SaaS product taxonomy.
 *
 * Every navigation surface (sidebar, workspace header breadcrumbs, mobile drawer,
 * command palette, and dashboard suite directory) derives from this config.
 *
 * Suites:
 *   - Overview: Command Center & Analytics
 *   - 01 Career Studio: Resumes, Career Profile, LinkedIn, Resume Roast
 *   - 02 Job Pipeline: Job Finder, Tracker, Alerts, Message Composer, Offer Desk
 *   - 03 Interview & Growth: Mock Interview, History, Skill Gap, Career Path
 *   - 04 Presence & Network: Portfolio Studio, GitHub Suite, Deployments, Community, Fellowship
 */
export const NAV_GROUPS = [
  {
    id: 'overview',
    label: 'Command Center',
    tagline: 'Daily priorities and pipeline telemetry',
    items: [
      {
        label: 'Dashboard',
        to: '/dashboard',
        icon: LayoutDashboard,
        desc: 'Priorities, pipeline health, and active workspaces',
        primary: true,
        match: ['/dashboard'],
        exactMatch: true,
      },
      {
        label: 'Analytics',
        to: '/dashboard/analytics',
        icon: BarChart3,
        desc: 'Resume conversion funnel and interview trends',
        primary: true,
        match: ['/dashboard/analytics'],
      },
    ],
  },
  {
    id: 'career-studio',
    label: 'Career Studio',
    stage: '01',
    tagline: 'Build the assets that sell your work',
    items: [
      {
        label: 'Career Profile',
        to: '/career-profile',
        icon: UserRound,
        desc: 'Master resume, target roles, and STAR story bank',
        primary: true,
        match: ['/career-profile'],
      },
      {
        label: 'Resume & Documents',
        to: '/hub/resume',
        icon: FileText,
        desc: 'Builder, AI enhancer, templates, and cover letters',
        primary: true,
        match: [
          '/hub/resume',
          '/resume-builder',
          '/upload',
          '/enhance/',
          '/resume/',
          '/text-to-resume',
          '/resume-templates',
          '/resume-examples',
          '/cover-letter',
        ],
      },
      {
        label: 'Resume Roast',
        to: '/resume-roast/analyze',
        icon: Flame,
        desc: 'Direct AI resume critique with builder handoff',
        match: ['/resume-roast', '/hub/roast', '/roast/'],
      },
      {
        label: 'LinkedIn Optimizer',
        to: '/linkedin-optimizer',
        icon: Linkedin,
        desc: 'Headline, About rewrite, and profile import',
        primary: true,
        match: ['/linkedin-optimizer', '/linkedin', '/linkedin-dashboard'],
      },
    ],
  },
  {
    id: 'job-pipeline',
    label: 'Job Pipeline',
    stage: '02',
    tagline: 'Source roles, build packets, and close offers',
    items: [
      {
        label: 'Job Finder',
        to: '/hub/jobs',
        icon: Briefcase,
        desc: 'Role search, match scoring, and saved alerts',
        primary: true,
        match: ['/hub/jobs', '/job-finder', '/jobs'],
      },
      {
        label: 'Job Tracker',
        to: '/job-tracker',
        icon: Target,
        desc: 'Kanban board with tailored application packets',
        primary: true,
        match: ['/job-tracker'],
      },
      {
        label: 'Job Alerts',
        to: '/job-alerts',
        icon: Bell,
        desc: 'Automated role alerts and email notifications',
        match: ['/job-alerts'],
      },
      {
        label: 'Message Composer',
        to: '/email-generator',
        icon: Mail,
        desc: 'First notes, follow-ups, thank-yous, and negotiation',
        primary: true,
        match: ['/email-generator', '/outreach'],
      },
      {
        label: 'Offer Desk',
        to: '/salary-estimate',
        icon: DollarSign,
        desc: 'Market salary bands and offer counter-strategy',
        match: ['/salary-estimate', '/offer-desk'],
      },
    ],
  },
  {
    id: 'interview-growth',
    label: 'Interview & Growth',
    stage: '03',
    tagline: 'Practice interviews, close skill gaps, and plan ahead',
    items: [
      {
        label: 'Mock Interview',
        to: '/mock-interview/practice',
        icon: Mic,
        desc: 'Voice and coding AI interview simulator',
        primary: true,
        match: ['/mock-interview', '/interview-prep'],
      },
      {
        label: 'Interview History',
        to: '/interview-history',
        icon: Video,
        desc: 'Replay sessions and track score progression',
        primary: true,
        match: ['/interview-history'],
      },
      {
        label: 'Skill Gap Analyzer',
        to: '/skill-gap',
        icon: TrendingUp,
        desc: 'JD skill matching and rejection learnings',
        primary: true,
        match: ['/skill-gap'],
      },
      {
        label: 'Career Path',
        to: '/career-path',
        icon: GraduationCap,
        desc: 'Role progression roadmap and skill requirements',
        match: ['/career-path'],
      },
    ],
  },
  {
    id: 'presence-network',
    label: 'Presence & Network',
    stage: '04',
    tagline: 'Ship portfolios, showcase code, and collaborate',
    items: [
      {
        label: 'Portfolio Studio',
        to: '/hub/portfolio',
        icon: Globe,
        desc: 'Visual editor, theme gallery, and live sites',
        primary: true,
        match: ['/hub/portfolio', '/portfolio-builder', '/templates'],
      },
      {
        label: 'GitHub Suite',
        to: '/github',
        icon: Github,
        desc: 'Resume import, GitHub portfolio, README, and visualizer',
        primary: true,
        match: [
          '/github',
          '/github-dashboard',
          '/github-portfolio',
          '/hub/portfolio/github',
          '/readme-generator',
          '/project-visualizer',
          '/repo-analyzer',
        ],
      },
      {
        label: 'README Generator',
        to: '/readme-generator/generate',
        icon: BookMarked,
        desc: 'Generate a structured GitHub profile README',
        match: ['/readme-generator'],
      },
      {
        label: 'Repo Visualizer',
        to: '/project-visualizer/analyze',
        icon: Network,
        desc: 'Architecture maps and dependency analysis for repos',
        match: ['/project-visualizer'],
      },
      {
        label: 'Deployments',
        to: '/deployments',
        icon: Rocket,
        desc: 'Manage live portfolio sites and published URLs',
        match: ['/deployments'],
      },
      {
        label: 'Community',
        to: '/hub/community',
        icon: Users,
        desc: 'Posts, topic channels, and direct messages',
        primary: true,
        match: ['/hub/community', '/community'],
      },
      {
        label: 'Fellowship',
        to: '/fellowship',
        icon: Award,
        desc: 'Collaborative engineering challenges and proposals',
        primary: true,
        match: ['/fellowship'],
      },
    ],
  },
]

export const ACCOUNT_LINKS = [
  {
    label: 'Profile',
    to: '/profile',
    icon: User,
    desc: 'Your public profile and social links',
    match: ['/profile'],
  },
  {
    label: 'Settings',
    to: '/settings',
    icon: Settings,
    desc: 'AI providers, integrations, notifications, and plan',
    match: ['/settings'],
  },
  {
    label: 'Security',
    to: '/security',
    icon: ShieldCheck,
    desc: 'Password, two-factor auth, and sessions',
    match: ['/security'],
  },
]

export const QUICK_CREATE_ACTIONS = [
  { label: 'New resume', desc: 'Build from scratch with ATS scoring', to: '/resume-builder/build', icon: FileText },
  { label: 'Track a job', desc: 'Open pipeline & application packets', to: '/job-tracker', icon: Target },
  { label: 'Mock interview', desc: 'Start a voice or coding session', to: '/mock-interview/practice', icon: Mic },
  { label: 'Draft message', desc: 'Follow-up, cold note, or negotiation', to: '/email-generator', icon: Mail },
  { label: 'Build portfolio', desc: 'Open live Portfolio Studio', to: '/portfolio-builder/studio', icon: Sparkles },
]

/** Flat list of every navigable tool, for the command palette and directory. */
export function getAllTools() {
  return NAV_GROUPS.flatMap((group) =>
    group.items.map((item) => ({
      ...item,
      group: group.label,
      groupId: group.id,
      stage: group.stage,
    }))
  )
}

/** True when the current pathname should highlight this nav item. */
export function isNavItemActive(pathname, item) {
  if (pathname === item.to) return true
  if (item.exactMatch) return false
  return (item.match || []).some((prefix) => pathname.startsWith(prefix))
}

/** Resolve current suite and tool metadata for workspace breadcrumbs. */
export function getActiveNavContext(pathname) {
  for (const group of NAV_GROUPS) {
    for (const item of group.items) {
      if (isNavItemActive(pathname, item)) {
        return { group, item }
      }
    }
  }
  for (const accountItem of ACCOUNT_LINKS) {
    if (isNavItemActive(pathname, accountItem)) {
      return {
        group: { id: 'account', label: 'Account' },
        item: accountItem,
      }
    }
  }
  if (pathname.startsWith('/admin')) {
    return {
      group: { id: 'admin', label: 'Administration' },
      item: { label: 'Admin Panel', to: '/admin' },
    }
  }
  return {
    group: { id: 'overview', label: 'Command Center' },
    item: { label: 'Workspace', to: '/dashboard' },
  }
}
