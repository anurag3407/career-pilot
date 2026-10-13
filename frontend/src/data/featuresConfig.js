import { FileText, Palette, Flame, Github, Network, Briefcase, Mic, Users, BookMarked } from 'lucide-react';
import * as Ill from '../components/landing/illustrations';

export const FEATURES = [
  {
    slug: 'resume-builder',
    name: 'Resume Builder',
    icon: FileText,
    size: 'large',
    badge: 'Most Popular',
    tagline: 'Build resumes that get interviews. AI-powered ATS optimization that makes recruiters stop scrolling.',
    Illustration: Ill.ResumeBuilderMockup,
    primaryAction: { label: 'Open Resume Builder', to: '/resume-builder/build' },
    seo: {
      title: 'AI Resume Builder — CareerPilot',
      description: 'Build an ATS-optimized resume in minutes with AI. Templates, scoring, GitHub & LinkedIn import, PDF export.',
      keywords: 'resume builder, ATS resume, AI resume, resume templates',
      canonical: 'https://careerpilot.app/resume-builder',
    },
    hero: {
      badgeText: 'Resume Builder',
      title: 'Build resumes that get',
      accentText: 'interviews, not rejections.',
      description: 'AI-powered ATS optimization that makes recruiters stop scrolling.',
      primaryCta: { text: 'Start building free', to: '/resume-builder/build' },
      secondaryCta: { text: 'Preview workflow', href: '#demo' },
      stats: [{ value: 'Built in', label: 'Minutes' }, { value: 'Core tools', label: 'One workspace' }, { value: 'PDF + DOCX', label: 'Exports' }],
    },
    showcase: {
      subheading: 'Focused capabilities available inside the current product.',
      heading: 'Everything you need to stand out',
      features: [
        { icon: 'FileText', title: 'Create from scratch', description: 'Build block by block on a clean canvas.' },
        { icon: 'Type', title: 'Text to resume', description: 'Paste text; AI formats it perfectly.' },
        { icon: 'Github', title: 'GitHub to resume', description: 'Turn your repos into experience.' },
        { icon: 'Sparkles', title: 'AI enhance', description: 'Rewrite bullets with measurable impact.' },
        { icon: 'BarChart', title: 'ATS score', description: 'Check role alignment and common formatting gaps.' },
        { icon: 'Layout', title: 'Templates', description: 'Modern, recruiter-approved designs.' },
        { icon: 'Linkedin', title: 'LinkedIn import', description: 'Preview and import available profile data.' },
        { icon: 'Download', title: 'PDF & DOCX', description: 'Pixel-perfect, ATS-safe exports.' },
      ],
    },
    video: { heading: 'See the resume workflow', subheading: 'The guided path from import to polished export.', videoUrl: '', caption: 'Interactive product preview with sample data.' },
    howItWorks: { subheading: 'A short, guided workflow with clear next steps.', title: 'Your path to a perfect resume', steps: [
      { number: 1, title: 'Start or import', description: 'Upload a resume or start fresh.', illustration: null },
      { number: 2, title: 'AI enhances', description: 'Optimize content for impact.', illustration: null },
      { number: 3, title: 'ATS score', description: 'Review role and formatting signals before export.', illustration: null },
      { number: 4, title: 'Download & apply', description: 'Export and send with confidence.', illustration: null },
    ] },
    testimonials: { heading: 'Loved by job seekers', items: [
      { name: 'Maya R.', role: 'Software engineer', metric: 'AI-assisted revisions', quote: 'The rewrite suggestions helped me turn vague bullets into clearer, more specific achievements.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya', rating: 5 },
    ] },
    comparison: {
      heading: 'The complete alternative to paid resume suites',
      competitors: [
        {
          name: 'Rezi',
          features: [
            { capability: 'ATS scoring', careerpilot: 'Included free', alternative: 'Paid plans' },
            { capability: 'AI rewriting', careerpilot: 'Impact bullets', alternative: 'Limited credits' },
            { capability: 'Exports', careerpilot: 'PDF + DOCX', alternative: 'Watermarked/free limits' },
            { capability: 'Version control', careerpilot: 'Resume versions', alternative: 'Higher tiers' },
          ],
        },
        {
          name: 'Zety',
          features: [
            { capability: 'ATS scoring', careerpilot: 'Included free', alternative: 'Not included' },
            { capability: 'AI rewriting', careerpilot: 'Impact bullets', alternative: 'Guidance only' },
            { capability: 'Exports', careerpilot: 'PDF + DOCX', alternative: 'Subscription required' },
            { capability: 'Version control', careerpilot: 'Resume versions', alternative: 'Manual copies' },
          ],
        },
      ],
    },
    cta: { headline: 'Ready to land your dream job?', subtext: 'Free for individuals. No credit card.', ctaText: 'Start building free', ctaTo: '/resume-builder/build' },
  },
  {
    slug: 'portfolio-builder',
    name: 'Portfolio Builder',
    icon: Palette,
    size: 'large',
    badge: 'New Templates',
    tagline: 'Your work deserves to be seen. Draft, preview, and publish a portfolio with the providers you choose.',
    Illustration: Ill.PortfolioBuilderMockup,
    primaryAction: { label: 'Open Portfolio Builder', to: '/portfolio-builder/templates' },
    seo: {
      title: 'AI Portfolio Builder — CareerPilot',
      description: 'Turn resume data into portfolio content, preview responsive themes, and publish through GitHub Pages, Cloudflare Pages, or Netlify.',
      keywords: 'portfolio builder, developer portfolio, AI portfolio',
      canonical: 'https://careerpilot.app/portfolio-builder',
    },
    hero: {
      badgeText: 'Portfolio Builder',
      title: 'Turn your resume into',
      accentText: 'a stunning portfolio.',
      description: 'Import resume or GitHub data, preview responsive themes, then publish through your selected hosting provider.',
      primaryCta: { text: 'Build your portfolio', to: '/portfolio-builder/templates' },
      secondaryCta: { text: 'See examples', href: '#demo' },
      stats: [{ value: '20+', label: 'Portfolio themes' }, { value: '3', label: 'Publish providers' }, { value: '100%', label: 'Mobile responsive' }],
    },
    showcase: {
      subheading: 'Focused capabilities available inside the current product.',
      heading: 'Your professional presence, streamlined',
      features: [
        { icon: 'Palette', title: 'Theme gallery', description: 'Choose from dozens of premium templates.' },
        { icon: 'Rocket', title: 'Provider publishing', description: 'Publish to Cloudflare Pages, GitHub Pages, or Netlify.' },
        { icon: 'Smartphone', title: 'Mobile perfect', description: 'Looks flawless on every device.' },
        { icon: 'Globe', title: 'Provider URLs', description: 'Use the generated hosted URL, then add a custom domain in your provider dashboard.' },
      ],
    },
    video: { heading: 'Preview your portfolio before launch', subheading: 'See how templates, projects, skills, and deployment steps come together in a polished portfolio workflow.', videoUrl: '', caption: 'Demo preview shown with placeholder content until a production walkthrough is available.' },
    howItWorks: { subheading: 'A short, guided workflow with clear next steps.', title: 'Launch in 3 steps', steps: [
      { number: 1, title: 'Pick a template', description: 'Browse our gallery of developer-focused designs.', illustration: null },
      { number: 2, title: 'Prepare your data', description: 'Import resume data or use GitHub to create portfolio content.', illustration: null },
      { number: 3, title: 'Publish', description: 'Choose a hosting provider and share the generated link.', illustration: null },
    ] },
    testimonials: { heading: 'What developers say', items: [
      { name: 'David C.', role: 'Frontend Developer', metric: 'Faster setup', quote: 'Starting from a portfolio template gave me a polished first draft instead of a blank page.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', rating: 5 },
    ] },
    comparison: {
      heading: 'Why pay for a separate website builder?',
      competitors: [
        {
          name: 'Wix Premium',
          features: [
            { capability: 'Developer templates', careerpilot: 'Portfolio-native', alternative: 'Generic templates' },
            { capability: 'Publishing', careerpilot: 'Cloudflare, GitHub, or Netlify', alternative: 'Paid plan + custom domain' },
            { capability: 'GitHub import', careerpilot: 'Supported', alternative: 'Manual embeds' },
            { capability: 'Mobile polish', careerpilot: 'Responsive themes', alternative: 'Editor-dependent' },
          ],
        },
        {
          name: 'Carbonmade',
          features: [
            { capability: 'Developer templates', careerpilot: 'Portfolio-native', alternative: 'Creative-only' },
            { capability: 'Publishing', careerpilot: 'Cloudflare, GitHub, or Netlify', alternative: 'Subscription' },
            { capability: 'GitHub import', careerpilot: 'Supported', alternative: 'Not available' },
            { capability: 'Mobile polish', careerpilot: 'Responsive themes', alternative: 'Included' },
          ],
        },
      ],
    },
    cta: { headline: 'Claim your piece of the internet.', subtext: 'Launch your developer portfolio today.', ctaText: 'View templates', ctaTo: '/portfolio-builder/templates' },
  },
  {
    slug: 'resume-roast',
    name: 'Resume Roast',
    icon: Flame,
    size: 'small',
    badge: null,
    tagline: 'Get direct AI feedback on your resume in one guided pass.',
    Illustration: Ill.ResumeRoastMockup,
    primaryAction: { label: 'Roast My Resume', to: '/resume-roast/analyze' },
    seo: {
      title: 'AI Resume Roast — CareerPilot',
      description: 'Fast, gamified AI critique of your resume. Find out exactly why you are getting rejected.',
      keywords: 'resume roast, resume review, AI resume feedback',
      canonical: 'https://careerpilot.app/resume-roast',
    },
    hero: {
      badgeText: 'Resume Roast',
      title: 'Find out why you’re',
      accentText: 'getting rejected.',
      description: 'A brutally honest AI review of your resume against your target role. Fast, gamified, and actionable.',
      primaryCta: { text: 'Roast my resume', to: '/resume-roast/analyze' },
      secondaryCta: { text: 'Preview workflow', href: '#how-it-works' },
      tertiaryCta: { text: 'Skip to Builder', href: '/resume-builder/build' },
      stats: [{ value: 'Fast', label: 'AI analysis' }, { value: 'Targeted', label: 'Role checks' }],
    },
    showcase: {
      subheading: 'Focused capabilities available inside the current product.',
      heading: 'Tough love for your career',
      features: [
        { icon: 'Target', title: 'Role matching', description: 'We check if you actually fit the job.' },
        { icon: 'Flame', title: 'Brutal honesty', description: 'No sugar-coating. We tell you what to fix.' },
        { icon: 'Share', title: 'Shareable score', description: 'Flex your high score (or low score) online.' },
      ],
    },
    video: { heading: 'See the roast workflow', subheading: 'Review sample feedback before you upload your own resume.', videoUrl: '', caption: 'Interactive product preview with sample data.' },
    howItWorks: { subheading: 'A short, guided workflow with clear next steps.', title: 'How to get roasted', steps: [
      { number: 1, title: 'Enter text', description: 'Paste your resume content and target role.', illustration: null },
      { number: 2, title: 'Brace yourself', description: 'AI analyzes every line.', illustration: null },
      { number: 3, title: 'Fix it', description: 'Take the feedback and improve.', illustration: null },
    ] },
    testimonials: { heading: 'Tears of joy', items: [
      { name: 'Alex P.', role: 'Data Scientist', metric: 'Actionable feedback', quote: 'The critique was direct, but it gave me concrete edits instead of generic advice.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', rating: 5 },
    ] },
    comparison: {
      heading: 'Direct feedback without a $100 coach',
      competitors: [
        {
          name: 'Human resume review',
          features: [
            { capability: 'Turnaround', careerpilot: 'One AI request', alternative: '2–5 days' },
            { capability: 'Coverage', careerpilot: 'Targeted checks', alternative: 'Reviewer dependent' },
            { capability: 'Next actions', careerpilot: 'Builder integration', alternative: 'Written notes' },
            { capability: 'Cost', careerpilot: 'Free', alternative: '$50–$300' },
          ],
        },
        {
          name: 'Paid review marketplaces',
          features: [
            { capability: 'Turnaround', careerpilot: 'One AI request', alternative: 'Queue dependent' },
            { capability: 'Coverage', careerpilot: 'Targeted checks', alternative: 'Single pass' },
            { capability: 'Next actions', careerpilot: 'Builder integration', alternative: 'Comments only' },
            { capability: 'Cost', careerpilot: 'Free', alternative: 'Per resume' },
          ],
        },
      ],
    },
    cta: { headline: 'Can your resume handle the heat?', subtext: 'Find out now. Free.', ctaText: 'Start roasting', ctaTo: '/resume-roast/analyze' },
  },
  {
    slug: 'github-portfolio',
    name: 'GitHub Portfolio',
    icon: Github,
    size: 'small',
    badge: null,
    tagline: 'Turn your GitHub into a portfolio that speaks louder than your resume.',
    Illustration: Ill.GithubPortfolioMockup,
    primaryAction: { label: 'Connect GitHub', to: '/github-portfolio/build' },
    seo: {
      title: 'GitHub Portfolio Generator — CareerPilot',
      description: 'Turn selected GitHub repositories into a structured portfolio presentation.',
      keywords: 'github portfolio, developer portfolio generator',
      canonical: 'https://careerpilot.app/github-portfolio',
    },
    hero: {
      badgeText: 'GitHub Portfolio',
      title: 'Let your code',
      accentText: 'do the talking.',
      description: 'Turn your top GitHub repositories into a structured portfolio preview. Import repository details, languages, and stats, then save it to your portfolio hub.',
      primaryCta: { text: 'Connect GitHub', to: '/github-portfolio/build' },
      secondaryCta: { text: 'See examples', href: '#demo' },
      stats: [{ value: 'GitHub API', label: 'Repository import' }, { value: 'Guided', label: 'AI generation' }],
    },
    showcase: {
      subheading: 'Focused capabilities available inside the current product.',
      heading: 'Showcase your commits',
      features: [
        { icon: 'Github', title: 'GitHub import', description: 'Import public repository details with your GitHub account.' },
        { icon: 'Code', title: 'Language stats', description: 'Visualizes your tech stack.' },
        { icon: 'Star', title: 'Highlight top repos', description: 'Curate what recruiters see.' },
      ],
    },
    video: { heading: 'From repositories to portfolio', subheading: 'See how selected repositories become portfolio highlights.', videoUrl: '', caption: 'Interactive product preview with sample data.' },
    howItWorks: { subheading: 'A short, guided workflow with clear next steps.', title: 'Generate in 3 steps', steps: [
      { number: 1, title: 'Authorize', description: 'Choose GitHub access or paste a username.', illustration: null },
      { number: 2, title: 'Select repos', description: 'Pick your best work.', illustration: null },
      { number: 3, title: 'Generate', description: 'Preview and save your portfolio content.', illustration: null },
    ] },
    testimonials: { heading: 'Loved by OSS contributors', items: [
      { name: 'Sam K.', role: 'Open Source Developer', metric: 'Repository highlights', quote: 'Starting from selected repositories gives recruiters a faster way to understand my best work.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam', rating: 5, verified: false, label: 'Illustrative preview' },
    ] },
    comparison: {
      heading: 'GitHub-native portfolio without a website subscription',
      competitors: [
        {
          name: 'GitHub Pages + manual site',
          features: [
            { capability: 'Setup', careerpilot: 'Guided builder', alternative: 'Manual repo' },
            { capability: 'Project updates', careerpilot: 'Generate from selected repos', alternative: 'Manual edits' },
            { capability: 'Curation', careerpilot: 'Repo picker', alternative: 'Hand-coded' },
            { capability: 'Design choices', careerpilot: 'Professional themes', alternative: 'From scratch' },
          ],
        },
        {
          name: 'Paid portfolio builders',
          features: [
            { capability: 'Setup', careerpilot: 'Guided builder', alternative: 'Template setup' },
            { capability: 'Project updates', careerpilot: 'Generate from selected repos', alternative: 'Limited integrations' },
            { capability: 'Curation', careerpilot: 'Repo picker', alternative: 'Included' },
            { capability: 'Design choices', careerpilot: 'Professional themes', alternative: 'Subscription unlocks' },
          ],
        },
      ],
    },
    cta: { headline: 'Stop manually updating your portfolio.', subtext: 'Let GitHub do the work.', ctaText: 'Connect GitHub', ctaTo: '/github-portfolio/build' },
  },
  {
    slug: 'project-visualizer',
    name: 'Project Visualizer',
    icon: Network,
    size: 'small',
    badge: null,
    tagline: 'See the architecture before you write a line of code.',
    Illustration: Ill.ProjectVisualizerMockup,
    primaryAction: { label: 'Analyze Repo', to: '/project-visualizer/analyze' },
    seo: {
      title: 'Codebase Project Visualizer — CareerPilot',
      description: 'AI architecture maps, dependency scan, and interview-prep for any GitHub repo.',
      keywords: 'codebase visualizer, architecture diagram, github repo analyzer',
      canonical: 'https://careerpilot.app/project-visualizer',
    },
    hero: {
      badgeText: 'Project Visualizer',
      title: 'Understand any codebase',
      accentText: 'in seconds.',
      description: 'Generate AI architecture maps, dependency scans, and interview prep guides for any GitHub repository.',
      primaryCta: { text: 'Analyze a repo', to: '/project-visualizer/analyze' },
      secondaryCta: { text: 'Preview workflow', href: '#demo' },
      stats: [{ value: 'Map', label: 'Architecture diagram' }, { value: 'Chat', label: 'Codebase Q&A' }],
    },
    showcase: {
      subheading: 'Focused capabilities available inside the current product.',
      heading: 'X-Ray vision for code',
      features: [
        { icon: 'Network', title: 'Auto-diagrams', description: 'Visualizes folder structure and imports.' },
        { icon: 'MessageSquare', title: 'Repo chat', description: 'Ask questions about the codebase.' },
        { icon: 'BookOpen', title: 'Interview prep', description: 'Generate technical questions based on the repo.' },
      ],
    },
    video: { heading: 'Visualize a repository', subheading: 'See how folders and dependencies become an interactive map.', videoUrl: '', caption: 'Interactive product preview with sample data.' },
    howItWorks: { subheading: 'A short, guided workflow with clear next steps.', title: 'How it works', steps: [
      { number: 1, title: 'Paste URL', description: 'Give us a public GitHub link.', illustration: null },
      { number: 2, title: 'AI scans', description: 'We analyze the AST and dependencies.', illustration: null },
      { number: 3, title: 'Explore', description: 'Navigate the visual map and chat.', illustration: null },
    ] },
    testimonials: { heading: 'Developer approved', items: [
      { name: 'Chris M.', role: 'Senior Engineer', metric: 'Faster orientation', quote: 'An interactive architecture map can shorten the time it takes to understand an unfamiliar repository.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris', rating: 5, verified: false, label: 'Illustrative preview' },
    ] },
    comparison: {
      heading: 'Understand code without an internal developer portal',
      competitors: [
        {
          name: 'Sourcegraph',
          features: [
            { capability: 'Architecture map', careerpilot: 'Automatic', alternative: 'Search-first' },
            { capability: 'Repo Q&A', careerpilot: 'AI chat', alternative: 'Enterprise search' },
            { capability: 'Interview prep', careerpilot: 'Repo-specific', alternative: 'Not included' },
            { capability: 'Pricing', careerpilot: 'Free', alternative: 'Enterprise' },
          ],
        },
        {
          name: 'Professional code audits',
          features: [
            { capability: 'Architecture map', careerpilot: 'Automatic', alternative: 'Consultant time' },
            { capability: 'Repo Q&A', careerpilot: 'AI chat', alternative: 'Email thread' },
            { capability: 'Interview prep', careerpilot: 'Repo-specific', alternative: 'Not included' },
            { capability: 'Pricing', careerpilot: 'Free', alternative: '$500+' },
          ],
        },
      ],
    },
    cta: { headline: 'Stop getting lost in the source code.', subtext: 'Map it visually today.', ctaText: 'Analyze a repo', ctaTo: '/project-visualizer/analyze' },
  },
  {
    slug: 'job-finder',
    name: 'Job Finder',
    icon: Briefcase,
    size: 'medium',
    badge: null,
    tagline: 'Search, save, and track roles in one focused workflow.',
    Illustration: Ill.JobFinderMockup,
    primaryAction: { label: 'Search Jobs', to: '/job-finder/search' },
    seo: {
      title: 'AI Job Search & Tracker — CareerPilot',
      description: 'Search aggregated listings, save roles, track applications, and manage job alerts.',
      keywords: 'job search, job tracker, AI job match',
      canonical: 'https://careerpilot.app/job-finder',
    },
    hero: {
      badgeText: 'Job Finder',
      title: 'Find jobs that actually',
      accentText: 'match your skills.',
      description: 'Search listings through a configured job-search provider, save promising roles, track applications, and set alerts in one workspace.',
      primaryCta: { text: 'Start searching', to: '/job-finder/search' },
      secondaryCta: { text: 'View tracker', href: '#demo' },
      stats: [{ value: 'Search', label: 'Aggregated listings' }, { value: 'Track', label: 'Saved applications' }],
    },
    showcase: {
      subheading: 'Focused capabilities available inside the current product.',
      heading: 'Your command center',
      features: [
        { icon: 'Search', title: 'Aggregated search', description: 'Search listings and save the best matches to your tracker.' },
        { icon: 'Target', title: 'Source scores', description: 'Show provider match percentages when a source supplies them.' },
        { icon: 'ListTodo', title: 'Kanban tracker', description: 'Track applications from Applied to Offer.' },
        { icon: 'Bell', title: 'Job alerts', description: 'Save searches and receive alerts for new matching roles.' },
      ],
    },
    video: { heading: 'Organize your search', subheading: 'See the workflow from saved jobs to tracked stages.', videoUrl: '', caption: 'Interactive product preview with sample data.' },
    howItWorks: { subheading: 'A short, guided workflow with clear next steps.', title: 'A better way to hunt', steps: [
      { number: 1, title: 'Search', description: 'Filter by role, location, work type, and level.', illustration: null },
      { number: 2, title: 'Review results', description: 'Compare each role against your resume, then apply in one click.', illustration: null },
      { number: 3, title: 'Track', description: 'Move applications across the board.', illustration: null },
    ] },
    testimonials: { heading: 'Success stories', items: [
      { name: 'Jessica W.', role: 'Marketing Director', metric: 'Organized pipeline', quote: 'Keeping searches, saved roles, and application stages together makes a long search easier to manage.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica', rating: 5 },
    ] },
    comparison: {
      heading: 'A focused alternative to scattered boards and trackers',
      competitors: [
        {
          name: 'Teal',
          features: [
            { capability: 'Job search', careerpilot: 'Aggregated search (provider key required)', alternative: 'Chrome extension' },
            { capability: 'Resume match', careerpilot: 'Free, unlimited', alternative: 'Premium' },
            { capability: 'Application tracker', careerpilot: 'Kanban + job alerts', alternative: 'Tracker limits' },
            { capability: 'Cost', careerpilot: 'Free', alternative: 'Monthly plan' },
          ],
        },
        {
          name: 'Jobscan',
          features: [
            { capability: 'Job search', careerpilot: 'Aggregated search', alternative: 'Not included' },
            { capability: 'Resume match', careerpilot: 'Free, unlimited', alternative: 'Per-scan credits' },
            { capability: 'Application tracker', careerpilot: 'Kanban + job alerts', alternative: 'Not included' },
            { capability: 'Cost', careerpilot: 'Free', alternative: 'Monthly plan' },
          ],
        },
      ],
    },
    cta: { headline: 'Your next great role is waiting.', subtext: 'Start your targeted search today.', ctaText: 'Search jobs', ctaTo: '/job-finder/search' },
  },
  {
    slug: 'mock-interview',
    name: 'Mock Interview',
    icon: Mic,
    size: 'medium',
    badge: 'AI Audio',
    tagline: 'Practice interviews with an AI that actually listens and gives feedback.',
    Illustration: Ill.MockInterviewMockup,
    primaryAction: { label: 'Start Interview', to: '/mock-interview/practice' },
    seo: {
      title: 'AI Mock Interviews — CareerPilot',
      description: 'Practice behavioral and technical interviews with AI voice prompts and detailed post-session feedback.',
      keywords: 'mock interview, AI interview prep, behavioral questions',
      canonical: 'https://careerpilot.app/mock-interview',
    },
    hero: {
      badgeText: 'Mock Interview',
      title: 'Nail your interview',
      accentText: 'before it happens.',
      description: 'Practice behavioral, technical, and coding interviews with spoken AI prompts, then review structured feedback on answers and delivery.',
      primaryCta: { text: 'Start practice', to: '/mock-interview/practice' },
      secondaryCta: { text: 'Preview workflow', href: '#demo' },
      stats: [{ value: 'Voice', label: 'Spoken prompts' }, { value: 'Role-based', label: 'Question sets' }],
    },
    showcase: {
      subheading: 'Focused capabilities available inside the current product.',
      heading: 'Eliminate interview anxiety',
      features: [
        { icon: 'Mic', title: 'Voice interaction', description: 'Talk naturally to the AI interviewer.' },
        { icon: 'Briefcase', title: 'Role-specific', description: 'Questions tailored to your target job.' },
        { icon: 'BarChart', title: 'Detailed feedback', description: 'Actionable tips on content and delivery.' },
        { icon: 'Video', title: 'History replay', description: 'Watch past sessions to see improvement.' },
      ],
    },
    video: { heading: 'Practice with AI questions', subheading: 'See how prompts, answers, and feedback connect.', videoUrl: '', caption: 'Interactive product preview with sample data.' },
    howItWorks: { subheading: 'A short, guided workflow with clear next steps.', title: 'Practice makes perfect', steps: [
      { number: 1, title: 'Configure', description: 'Select the role and interview type.', illustration: null },
      { number: 2, title: 'Speak', description: 'Answer questions verbally via mic.', illustration: null },
      { number: 3, title: 'Review', description: 'Get a scorecard and suggestions.', illustration: null },
    ] },
    testimonials: { heading: 'Overcome the nerves', items: [
      { name: 'Emily R.', role: 'UX Designer', metric: 'Practice sessions', quote: 'Running through role-specific questions and reviewing detailed feedback helps reduce surprises on interview day.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily', rating: 5, verified: false, label: 'Illustrative preview' },
    ] },
    comparison: {
      heading: 'Interview practice without per-session pricing',
      competitors: [
        {
          name: 'Final Round AI',
          features: [
            { capability: 'Mock sessions', careerpilot: 'Included practice', alternative: 'Often credit or plan based' },
            { capability: 'Delivery feedback', careerpilot: 'Voice + delivery', alternative: 'In-interview copilot' },
            { capability: 'Coding rounds', careerpilot: 'Monaco editor', alternative: 'Role dependent' },
            { capability: 'Replay', careerpilot: 'Session history', alternative: 'Included' },
          ],
        },
        {
          name: 'Interview Warmup (Google)',
          features: [
            { capability: 'Mock sessions', careerpilot: 'Included practice', alternative: 'Question set' },
            { capability: 'Delivery feedback', careerpilot: 'Voice + delivery', alternative: 'Transcript insights' },
            { capability: 'Coding rounds', careerpilot: 'Monaco editor', alternative: 'Not included' },
            { capability: 'Replay', careerpilot: 'Session history', alternative: 'Limited' },
          ],
        },
      ],
    },
    cta: { headline: 'Don’t practice on the real thing.', subtext: 'Hone your skills with AI.', ctaText: 'Start mock interview', ctaTo: '/mock-interview/practice' },
  },
  {
    slug: 'recruiters',
    name: 'Recruiter Pipeline',
    icon: Users,
    size: 'medium',
    badge: 'Early Access',
    tagline: 'A lightweight way for small teams to organize candidate follow-up.',
    Illustration: null,
    primaryAction: { label: 'Join Early Access', to: '/register' },
    seo: {
      title: 'Recruiter Pipeline — CareerPilot Early Access',
      description: 'A lightweight candidate pipeline concept for small teams. Currently in early access, not a full ATS.',
      keywords: 'recruiting pipeline, candidate tracking, ATS alternative',
      canonical: 'https://careerpilot.app/recruiters',
    },
    hero: {
      badgeText: 'Early Access',
      title: 'Organize small-team',
      accentText: 'candidate follow-up.',
      description: 'We are exploring a lightweight pipeline for tracking conversations and follow-ups. It is not a full ATS or automated recruiter today.',
      primaryCta: { text: 'Join early access', to: '/register' },
      secondaryCta: { text: 'See the scope', href: '#how-it-works' },
      stats: [{ value: 'Concept', label: 'Not a full ATS' }, { value: 'Lightweight', label: 'Small-team focus' }],
    },
    showcase: {
      subheading: 'What this page is — and is not.',
      heading: 'A simpler alternative for small teams',
      features: [
        { icon: 'Users', title: 'Candidate tracking', description: 'A shared way to organize who needs follow-up.' },
        { icon: 'ListTodo', title: 'Pipeline stages', description: 'Move conversations from contacted to interview.' },
        { icon: 'Bell', title: 'Follow-up reminders', description: 'Reduce missed updates without enterprise tooling.' },
        { icon: 'BarChart', title: 'Simple progress', description: 'See where candidates are in your process.' },
      ],
    },
    video: { heading: 'Early-access workflow', subheading: 'The candidate pipeline is not generally available yet.', videoUrl: '', caption: 'This page describes a product direction rather than a production walkthrough.' },
    howItWorks: { subheading: 'Scope is intentionally narrow while we validate the workflow.', title: 'Early-access concept', steps: [
      { number: 1, title: 'Add candidates', description: 'Track people you are already talking to.' },
      { number: 2, title: 'Move stages', description: 'Keep follow-up state clear across your team.' },
      { number: 3, title: 'Review progress', description: 'Spot stalled conversations without a full ATS.' },
    ] },
    testimonials: { heading: 'A lightweight way to stay organized', items: [
      { name: 'Sarah J.', role: 'Head of Talent', metric: 'Organized hiring', quote: 'A simple shared pipeline can help a small team stay aligned without investing in a full ATS.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', rating: 5, verified: false, label: 'Illustrative preview' },
    ] },
    comparison: {
      heading: 'How this differs from enterprise ATS platforms',
      competitors: [
        {
          name: 'LinkedIn Recruiter',
          features: [
            { capability: 'Product status', careerpilot: 'Early access', alternative: 'Available now' },
            { capability: 'Sourcing', careerpilot: 'Not included', alternative: 'Core capability' },
            { capability: 'Pipeline depth', careerpilot: 'Lightweight follow-up', alternative: 'Enterprise recruiting' },
            { capability: 'Pricing', careerpilot: 'Join list to learn more', alternative: 'Enterprise contract' },
          ],
        },
        {
          name: 'Greenhouse',
          features: [
            { capability: 'Product status', careerpilot: 'Early access', alternative: 'Full ATS' },
            { capability: 'Interview kits', careerpilot: 'Not included', alternative: 'Included' },
            { capability: 'Pipeline depth', careerpilot: 'Lightweight follow-up', alternative: 'Configurable hiring workflows' },
            { capability: 'Pricing', careerpilot: 'Join list to learn more', alternative: 'Per-employee pricing' },
          ],
        },
      ],
    },
    cta: { headline: 'Help us shape the recruiter workflow.', subtext: 'Join the early-access list if you need a simpler small-team pipeline.', ctaText: 'Join early access', ctaTo: '/register' },
  },
  {
    slug: 'readme-generator',
    name: 'README Generator',
    icon: BookMarked,
    size: 'small',
    badge: 'New',
    tagline: 'Turn your GitHub profile into a stunning README in seconds with AI.',
    Illustration: null,
    primaryAction: { label: 'Open Generator', to: '/readme-generator/generate' },
    seo: {
      title: 'GitHub README Generator — CareerPilot',
      description: 'Generate a stunning GitHub profile README.md with AI. Choose from 10 templates, auto-fetch your repos and stats.',
      keywords: 'github readme generator, profile readme, github profile',
      canonical: 'https://careerpilot.app/readme-generator',
    },
    hero: {
      badgeText: 'README Generator',
      title: 'Your GitHub profile',
      accentText: 'deserves better.',
      description: 'Generate a stunning profile README in seconds. Pick a template, paste your URL, and let AI do the rest.',
      primaryCta: { text: 'Generate my README', to: '/readme-generator/generate' },
      secondaryCta: { text: 'See templates', href: '#demo' },
      stats: [{ value: '10', label: 'Templates' }, { value: '30s', label: 'Generation time' }],
    },
    showcase: {
      subheading: 'Focused capabilities available inside the current product.',
      heading: 'Stand out on GitHub',
      features: [
        { icon: 'Github', title: 'Auto-fetch data', description: 'Pulls your repos, languages, and stats.' },
        { icon: 'Layout', title: '10 templates', description: 'Minimal, developer, creative, academic, and more.' },
        { icon: 'Sparkles', title: 'AI-powered', description: 'Crafts compelling copy from your data.' },
        { icon: 'Download', title: 'Copy & publish', description: 'Copy the generated markdown with setup instructions.' },
      ],
    },
    video: { heading: 'Generate a README', subheading: 'See how repository details become structured documentation.', videoUrl: '', caption: 'Interactive product preview with sample data.' },
    howItWorks: { subheading: 'A short, guided workflow with clear next steps.', title: '3 steps to a killer profile', steps: [
      { number: 1, title: 'Paste your URL', description: 'Enter your GitHub username or profile link.', illustration: null },
      { number: 2, title: 'Pick a template', description: 'Choose from 10 professionally designed styles.', illustration: null },
      { number: 3, title: 'Copy & publish', description: 'Download or copy your README, then follow the GitHub setup steps.', illustration: null },
    ] },
    testimonials: { heading: 'A faster way to draft your profile', items: [
      { name: 'Jordan T.', role: 'Full Stack Dev', metric: 'Profile-ready draft', quote: 'A structured README draft makes a GitHub profile feel intentional without hours of manual formatting.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan', rating: 5, verified: false, label: 'Illustrative preview' },
    ] },
    comparison: {
      heading: 'A stronger GitHub profile without a freelance designer',
      competitors: [
        {
          name: 'Manual README',
          features: [
            { capability: 'Setup', careerpilot: 'Paste username', alternative: 'Write markdown' },
            { capability: 'Repo data', careerpilot: 'Auto-fetched', alternative: 'Manual' },
            { capability: 'Copy', careerpilot: 'Professional layouts', alternative: 'Basic markdown' },
            { capability: 'Refresh', careerpilot: 'Regenerate anytime', alternative: 'Manual edits' },
          ],
        },
        {
          name: 'Fiverr profile design',
          features: [
            { capability: 'Setup', careerpilot: 'Paste username', alternative: 'Brief + wait' },
            { capability: 'Repo data', careerpilot: 'Auto-fetched', alternative: 'You provide' },
            { capability: 'Copy', careerpilot: 'Professional layouts', alternative: 'Custom' },
            { capability: 'Refresh', careerpilot: 'Regenerate anytime', alternative: 'New order' },
          ],
        },
      ],
    },
    cta: { headline: 'Stop having a blank GitHub profile.', subtext: 'Generate a structured profile README in one AI-assisted pass.', ctaText: 'Generate my README', ctaTo: '/readme-generator/generate' },
  }
];

export const FEATURES_BY_SLUG = Object.fromEntries(FEATURES.map(f => [f.slug, f]));
