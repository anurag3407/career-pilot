import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Flame,
  Globe,
  Github,
  BookMarked,
  Linkedin,
  Briefcase,
  Target,
  Bell,
  Send,
  Mail,
  Mic,
  Video,
  TrendingUp,
  GraduationCap,
  DollarSign,
  Users,
  Award,
  GitBranch,
  Network,
  Rocket,
  User,
  Settings,
  ShieldCheck,
} from 'lucide-react'

/**
 * Single source of truth for product navigation.
 *
 * Every surface (sidebar, mobile drawer, command palette, dashboard tool
 * directory) renders from this config so a tool is never reachable from one
 * place and missing from another. Groups follow the career journey:
 * Prepare → Find & Apply → Interview → Grow → Connect, plus developer tools.
 *
 * `primary` items appear in the sidebar and mobile drawer; every item appears
 * in the command palette and the dashboard directory. `match` lists extra
 * path prefixes that should keep a nav item highlighted (e.g. the Resume hub
 * stays active while the user is inside the builder).
 */
export const NAV_GROUPS = [
  {
    id: 'overview',
    label: 'Overview',
    items: [
      {
        label: 'Dashboard',
        to: '/dashboard',
        icon: LayoutDashboard,
        desc: 'Your career mission control',
        primary: true,
      },
      {
        label: 'Analytics',
        to: '/dashboard/analytics',
        icon: BarChart3,
        desc: 'Application funnel and success insights',
        primary: true,
        match: ['/dashboard/analytics'],
      },
    ],
  },
  {
    id: 'prepare',
    label: 'Prepare',
    stage: '01',
    tagline: 'Build the assets that sell you',
    items: [
      {
        label: 'Resume & Documents',
        to: '/hub/resume',
        icon: FileText,
        desc: 'Builder, enhancer, cover letters, templates',
        primary: true,
        match: ['/hub/resume', '/resume-builder', '/upload', '/enhance/', '/resume/', '/text-to-resume', '/resume-templates', '/resume-examples', '/cover-letter'],
      },
      {
        label: 'Resume Roast',
        to: '/resume-roast/analyze',
        icon: Flame,
        desc: 'Brutally honest AI resume feedback',
        match: ['/resume-roast', '/hub/roast', '/roast/'],
      },
      {
        label: 'Portfolio',
        to: '/hub/portfolio',
        icon: Globe,
        desc: 'Portfolio studio, templates, deployments',
        primary: true,
        match: ['/hub/portfolio', '/portfolio-builder', '/templates', '/deployments'],
      },
      {
        label: 'GitHub Portfolio',
        to: '/github-portfolio/build',
        icon: Github,
        desc: 'Turn your repositories into a portfolio',
        match: ['/github-portfolio', '/hub/portfolio/github'],
      },
      {
        label: 'README Generator',
        to: '/readme-generator/generate',
        icon: BookMarked,
        desc: 'AI-crafted GitHub profile README',
        match: ['/readme-generator'],
      },
      {
        label: 'LinkedIn Optimizer',
        to: '/linkedin-optimizer',
        icon: Linkedin,
        desc: 'Headline, about and experience rewrites',
        match: ['/linkedin-optimizer'],
      },
    ],
  },
  {
    id: 'apply',
    label: 'Find & Apply',
    stage: '02',
    tagline: 'Discover roles and run your pipeline',
    items: [
      {
        label: 'Job Finder',
        to: '/hub/jobs',
        icon: Briefcase,
        desc: 'AI-matched search, alerts, outreach',
        primary: true,
        match: ['/hub/jobs', '/job-finder'],
      },
      {
        label: 'Job Tracker',
        to: '/job-tracker',
        icon: Target,
        desc: 'Kanban board for every application',
        primary: true,
        match: ['/job-tracker'],
      },
      {
        label: 'Job Alerts',
        to: '/job-alerts',
        icon: Bell,
        desc: 'Get notified when matching roles open',
        match: ['/job-alerts'],
      },
      {
        label: 'Cold Outreach',
        to: '/outreach',
        icon: Send,
        desc: 'Personalized messages to recruiters',
        match: ['/outreach'],
      },
      {
        label: 'Email Generator',
        to: '/email-generator',
        icon: Mail,
        desc: 'Follow-ups and thank-you notes',
        match: ['/email-generator'],
      },
    ],
  },
  {
    id: 'interview',
    label: 'Interview',
    stage: '03',
    tagline: 'Practice until answers feel natural',
    items: [
      {
        label: 'Mock Interview',
        to: '/mock-interview/practice',
        icon: Mic,
        desc: 'Live AI voice interview practice',
        primary: true,
        match: ['/mock-interview'],
      },
      {
        label: 'Interview History',
        to: '/interview-history',
        icon: Video,
        desc: 'Replay sessions and review feedback',
        primary: true,
        match: ['/interview-history'],
      },
      {
        label: 'Skill Gap Analyzer',
        to: '/skill-gap',
        icon: TrendingUp,
        desc: 'Find the skills your target role needs',
        match: ['/skill-gap'],
      },
    ],
  },
  {
    id: 'grow',
    label: 'Grow',
    stage: '04',
    tagline: 'Level up skills and compensation',
    items: [
      {
        label: 'Career Growth',
        to: '/hub/career',
        icon: GraduationCap,
        desc: 'Readiness score, paths, learning',
        primary: true,
        match: ['/hub/career', '/career-path'],
      },
      {
        label: 'Salary Estimate',
        to: '/salary-estimate',
        icon: DollarSign,
        desc: 'Know your market value before negotiating',
        match: ['/salary-estimate'],
      },
    ],
  },
  {
    id: 'connect',
    label: 'Connect',
    stage: '05',
    tagline: 'Learn with people on the same road',
    items: [
      {
        label: 'Community',
        to: '/hub/community',
        icon: Users,
        desc: 'Posts, channels and direct messages',
        primary: true,
        match: ['/hub/community', '/community'],
      },
      {
        label: 'Fellowship',
        to: '/fellowship',
        icon: Award,
        desc: 'Collaborative challenges and proposals',
        primary: true,
        match: ['/fellowship'],
      },
    ],
  },
  {
    id: 'devtools',
    label: 'Developer Tools',
    items: [
      {
        label: 'GitHub Dashboard',
        to: '/github',
        icon: GitBranch,
        desc: 'Repository analytics and contribution signal',
        primary: true,
        match: ['/github', '/github-dashboard'],
      },
      {
        label: 'LinkedIn Dashboard',
        to: '/linkedin',
        icon: Linkedin,
        desc: 'Profile performance metrics',
        match: ['/linkedin', '/linkedin-dashboard'],
      },
      {
        label: 'Project Visualizer',
        to: '/project-visualizer',
        icon: Network,
        desc: 'AI architecture maps for any repo',
        primary: true,
        match: ['/project-visualizer', '/repo-analyzer'],
      },
      {
        label: 'Deployments',
        to: '/deployments',
        icon: Rocket,
        desc: 'Manage your live portfolio sites',
        match: ['/deployments'],
      },
    ],
  },
]

export const ACCOUNT_LINKS = [
  { label: 'Profile', to: '/profile', icon: User, desc: 'Your public profile and connections', match: ['/profile'] },
  { label: 'Settings', to: '/settings', icon: Settings, desc: 'Preferences, AI providers, billing', match: ['/settings'] },
  { label: 'Security', to: '/security', icon: ShieldCheck, desc: 'Password, sessions and account safety', match: ['/security'] },
]

/** Flat list of every navigable tool, for the command palette and directory. */
export function getAllTools() {
  return NAV_GROUPS.flatMap((group) =>
    group.items.map((item) => ({ ...item, group: group.label, groupId: group.id }))
  )
}

/** True when the current pathname should highlight this nav item. */
export function isNavItemActive(pathname, item) {
  if (pathname === item.to) return true
  return (item.match || []).some((prefix) => pathname.startsWith(prefix))
}