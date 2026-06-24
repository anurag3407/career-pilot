 What's there now (WIP, broken): scaffolding exists but the 7 landing pages pass props that don't match the
  components (so they show placeholder text), the components are hardcoded dark (ignore the theme toggle),
  _illustrations/ is empty, routing is flat (not nested), /project-visualizer base route is missing, and
  there's no SEO.

  The plan, in short:
  - One config file (featuresConfig.js) becomes the single source of truth driving the 7 landing pages, the
  Home grid, the Dashboard grid, the navbar dropdown, the footer, and the sitemap — no more duplicated copy.
  - Fix + tokenise the existing components/landing/* so they render the right copy and respond to
  light/dark/high-contrast (theme toggle works everywhere).
  - Inline SVG/CSS mockup illustrations per feature (theme-aware, crisp) in heroes and cards; the video
  frame is already built (FeatureVideoSection) — just an empty drop-in slot for now.
  - Nested SEO routes: /resume-builder (landing) → /resume-builder/build, /resume-builder/resume-templates,
  /resume-builder/optimise/:id (chained), same pattern ×7. Every old path 301-redirects, including /hub/*.
  Chained sub-features stay inline, not in nav.
  - SEO via React 19 native metadata (no new dependency) — per-page title/meta/canonical/OG/JSON-LD +
  robots.txt + sitemap.xml.
  - Auth-aware CTAs so logged-in users skip the marketing double-hop.
  - Constant Navbar (logo, title, theme toggle, AI provider) + Footer across the whole marketing surface.

  Per your CLAUDE.md, I'll delegate the bulk/boilerplate writing (the 7 illustration components, config
  population) to ask-agy where it helps, and keep the routing/architecture edits precise myself.

────────────────────────────────────────────────────────────────────────────────────────────────────────────
 Ready to code?

 Here is Claude's plan:
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
 CareerPilot — Premium SaaS Landing & Feature IA Revamp

 Context

 CareerPilot bundles 7 standalone tools (Resume Builder, Portfolio Builder, Resume Roast, GitHub Portfolio,
 Project Visualizer, Job Finder, Mock Interview) plus several chained sub-features (inline bullet
 optimisation, resume enhance/optimise, resume templates, project enhancement). Today they are reachable
 via a flat, inconsistent route map (/resume-builder-landing, /roast, /visualizer, /ai-interview, /jobs,
 /enhance/:id…) and a parallel /hub/* system.

 A previous session scaffolded premium landing infrastructure (components/landing/*,
 pages/features/*Landing.jsx) but it is broken and unfinished:
 - The 7 landing pages pass props (category, headline, subheadline, title) that don't match the component
 prop names (badgeText, title, accentText, description, heading) → they render generic placeholder copy.
 - Landing components are hardcoded slate-950/indigo → they ignore the app's 3-theme token system, so the
 navbar theme toggle looks inert on them.
 - _illustrations/ is empty; there are no SVG mockups.
 - Routing does not match the desired nested SEO IA; /project-visualizer base route is missing (legacy
 redirects point to a dead path → NotFound).
 - There is no per-route SEO (title/meta/canonical/OG/JSON-LD), no sitemap/robots.

 Goal: turn this into a premium, theme-aware, SEO-optimised product where each feature has its own
 SaaS-style landing page (hero, bento feature cards w/ illustrations, video frame, how-it-works, social
 proof, CTA — no pricing), with clean nested URLs (/resume-builder, /resume-builder/build,
 /resume-builder/templates, …), driven by a single config so the Home grid, Dashboard grid, navbar
 dropdown, footer, and sitemap all stay in sync. Constant Navbar + Footer (logo, brand title, theme toggle,
 AI provider) across the marketing surface. Nothing breaks: every old URL 301-redirects to its new home.

 Decisions (confirmed with user): nested IA + redirects · theme-aware tokens · all 7 in one pass · inline
 SVG/CSS mockups.

 ---
 Architecture: single source of truth

 Create frontend/src/data/featuresConfig.js — one exported array of 7 feature objects. This drives the
 landing pages, OurToolsSection, the Dashboard grid, the Navbar product dropdown, the Footer product
 column, and sitemap generation. No more copy duplicated across files.

 Each feature object shape:
 {
   slug: 'resume-builder',          // base route + landing URL
   name: 'Resume Builder',
   icon: FileText,                  // lucide
   size: 'large'|'medium'|'small', // bento weight on Home/Dashboard
   badge: 'Most Popular',          // optional
   tagline: '...',                 // card description
   illustration: ResumeBuilderMockup, // component ref (theme-aware SVG)
   seo: { title, description, keywords, canonical },
   hero: { badgeText, title, accentText, description, primaryCta:{text,to}, secondaryCta:{text,href},
 stats:[...] },
   showcase: { heading, features: [{ icon, title, description }] },
   video: { heading, subheading, videoUrl, caption }, // videoUrl '' => play-button frame
   howItWorks: { title, steps: [{ number, title, description }] },
   testimonials: { heading, items:[{ name, role, company, metric, quote, avatar }] },
   cta: { headline, subtext, ctaText, ctaTo },
   primaryAction: { label, to },   // authed "open the tool" target, e.g. /resume-builder/build
 }

 Populate all 7 from existing landing-page copy + the functional summaries already gathered (each feature's
 real sub-steps). Chained sub-features are represented inside showcase/howItWorks copy but are NOT given
 top-level nav entries or standalone CTAs.

 ---
 Route map (App.jsx)

 Pattern per feature: base slug = public landing, tools nested beneath, /hub/* and old flat paths redirect.
 Add a small Redirect helper (or use <Navigate replace>).

 Feature: Resume Builder
 Landing (public): /resume-builder
 Nested tool routes (auth): /resume-builder/build, /resume-builder/from-text,
   /resume-builder/resume-templates, /resume-builder/optimise/:resumeId (chained),
   /resume-builder/resume/:resumeId, /resume-builder/examples
 Redirects (old → new): /resume-builder-landing→base, old /resume-builder(tool)→/build, /text-to-resume,
   /resume-templates, /enhance/:resumeId, /resume/:resumeId, /resume-examples, /hub/resume→base
 ────────────────────────────────────────
 Feature: Portfolio Builder
 Landing (public): /portfolio-builder
 Nested tool routes (auth): /portfolio-builder/templates, /portfolio-builder/build,
   /portfolio-builder/deployments
 Redirects (old → new): /templates*, /deployments, /hub/portfolio→base
 ────────────────────────────────────────
 Feature: Resume Roast
 Landing (public): /resume-roast
 Nested tool routes (auth): /resume-roast/analyze, /resume-roast/shared/:shareToken
 Redirects (old → new): /roast→base, old /resume-roast(tool)→/analyze, /roast/:shareToken, /hub/roast→base
 ────────────────────────────────────────
 Feature: GitHub Portfolio
 Landing (public): /github-portfolio
 Nested tool routes (auth): /github-portfolio/build
 Redirects (old → new): /portfolio/github, /hub/portfolio/github→base
 ────────────────────────────────────────
 Feature: Project Visualizer
 Landing (public): /project-visualizer
 Nested tool routes (auth): /project-visualizer/dashboard/:sessionId (exists)
 Redirects (old → new): /visualizer→base; fixes dead /repo-analyzer*→base, /project-visualizer-legacy kept
 ────────────────────────────────────────
 Feature: Job Finder
 Landing (public): /job-finder
 Nested tool routes (auth): /job-finder/search, /job-finder/tracker, /job-finder/alerts
 Redirects (old → new): /jobs, /job-tracker, /job-alerts, /hub/jobs→base
 ────────────────────────────────────────
 Feature: Mock Interview
 Landing (public): /mock-interview
 Nested tool routes (auth): /mock-interview/practice, /mock-interview/history, /mock-interview/history/:id
 Redirects (old → new): /ai-interview→base, /interview-prep, /interview-history, /interview-history/:id

 * /templates/:name and /preview/:templateId are live deployed-portfolio renders, not marketing — leave
 untouched (per "don't touch resume templates").

 Notes:
 - OAuth callbacks (/auth/github/callback, linkedin, openrouter) unchanged.
 - Each landing route is public (no ProtectedRoute); nested tool routes keep their existing ProtectedRoute
 wrappers and lazy imports — we only change the path strings and add redirect routes.
 - Landing pages are public but auth-aware: when useAuth().user is set, primary CTAs switch from "Start
 free" → primaryAction ("Open Resume Builder" → /resume-builder/build). Avoids the current double-hop
 (Dashboard card → marketing page → tool) for logged-in users.

 ---
 Build steps

 1. Fix + theme-convert the shared landing components

 components/landing/{FeatureLandingHero,FeatureShowcase,FeatureVideoSection,FeatureHowItWorks,FeatureTestim
 onials,FeatureCTA,PremiumFeatureCard,OurToolsSection}.jsx:
 - Replace hardcoded slate-950/900/800/400, indigo-*, purple/pink with token classes: bg-background,
 bg-card, border-border, text-foreground, text-muted-foreground, bg-primary, text-primary, from-primary
 to-secondary (reuse existing .gradient-text, .glass, .glow, .bg-mesh, .animate-blob, .animate-float from
 index.css). Result: responds to light / dark / high-contrast.
 - Settle ONE prop contract = the component signatures already in the files
 (badgeText/title/accentText/description for hero, heading/features, heading/subheading/videoUrl/caption,
 title/steps, heading/items, headline/ctaText/ctaTo). Each section accepts an illustration node where
 relevant.
 - FeatureVideoSection already renders the browser-chrome video frame — keep, just tokenise. videoUrl===''
 shows the play-button placeholder (the "frame to add a video" the user asked for).
 - PremiumFeatureCard already supports an illustration slot — wire it.

 2. Illustration kit (inline SVG/CSS, theme-aware)

 New components/landing/illustrations/ with one mockup component per feature (ResumeBuilderMockup,
 PortfolioBuilderMockup, ResumeRoastMockup, GithubPortfolioMockup, ProjectVisualizerMockup,
 JobFinderMockup, MockInterviewMockup) + an index.js barrel. Each is a small styled "fake product UI" panel
 (cards, bars, gauges, graph nodes, waveform, etc.) using currentColor/token CSS vars so it recolors with
 theme, with subtle animate-float/staggered motion. Used in the hero (right column), the bento card, and
 optionally the video poster.

 3. Generic landing page

 New components/landing/FeatureLandingPage.jsx: takes a config and renders Navbar → background mesh/blobs →
 FeatureLandingHero (with illustration) → FeatureShowcase (bento) → FeatureVideoSection (video frame) →
 FeatureHowItWorks → FeatureTestimonials → FeatureCTA → Footer, plus <Seo .../>. Auth-aware CTA logic lives
 here.
 Rewrite the 7 pages/features/*Landing.jsx to thin wrappers: export default () => <FeatureLandingPage
 config={featuresConfig.resumeBuilder} />. (Fixes the prop-mismatch bug by construction.)

 4. SEO (React 19 native metadata — no new dep)

 New components/Seo.jsx: renders <title>, <meta name="description">, <meta name="keywords">, canonical
 <link>, OpenGraph + Twitter card tags, and a <script type="application/ld+json"> SoftwareApplication
 block. React 19.2 hoists these to <head> automatically. Embed in FeatureLandingPage and Home.
 Also: base/default tags + preconnect in index.html; public/robots.txt; public/sitemap.xml (list / + 7
 landing slugs). Ensure each landing uses a single semantic <h1> (hero title) and section <h2>s.

 5. Wire the shared config into existing surfaces

 - OurToolsSection.jsx (used on Home): replace inline tools array with featuresConfig; cards link to clean
 base slugs; pass illustration.
 - pages/Dashboard.jsx (~line 281): replace the inline duplicate grid with the same config-driven
 PremiumFeatureCard grid; links go to clean slugs (auth users → primaryAction tool route). Reuses existing
 token-based styling already there.
 - Navbar.jsx product dropdown (7 items) + ui/Footer.jsx product column: source labels/links from
 featuresConfig clean slugs. Confirm Navbar shows brand logo + brand title + theme toggle (cycles
 light/dark/highContrast) + AIProviderSelector (all already present) — these stay constant across every
 landing.
 - pages/Home.jsx: keep Navbar/HeroSection/OurToolsSection/Footer; de-duplicate overlap between
 OurToolsSection and the older FeaturesSection/AdditionalFeatures (make OurToolsSection the single
 canonical feature grid; trim or repurpose the legacy sections to avoid showing the same 7 tools twice).

 6. Redirects & safety

 Add the redirect routes from the table (old path → new) using <Navigate to=... replace />, including
 /hub/*. Keep NotFound catch-all last. Grep the codebase for internal Link/navigate(/to=" usages of every
 renamed path and update them (sidebar AppSidebar.jsx hub links, CommandPalette, any navigate('/jobs')
 etc.) so internal navigation uses new URLs directly (redirects are only a safety net for
 external/bookmarked links).

 ---
 Critical files

 - New: src/data/featuresConfig.js, src/components/Seo.jsx, src/components/landing/FeatureLandingPage.jsx,
 src/components/landing/illustrations/* (7 + barrel), public/robots.txt, public/sitemap.xml
 - Edit: src/App.jsx (routes + redirects), all src/components/landing/*.jsx (tokenise + fix props),
 src/pages/features/*Landing.jsx (→ thin wrappers), src/pages/Dashboard.jsx, src/pages/Home.jsx,
 src/components/Navbar.jsx, src/components/ui/Footer.jsx, src/components/AppSidebar.jsx (hub links),
 src/components/CommandPalette.jsx, index.html
 - Reuse: existing index.css utilities (.gradient-text, .glass, .glow, .bg-mesh,
 .animate-blob/float/shimmer), lib/utils.js cn, theme tokens from context/ThemeProvider, hooks/useAuth,
 lucide icons. Do not touch portfolio template components or /templates/:name renders.

 Out of scope (note for user)

 - Restyling the authed AppLayout/AppSidebar shell to use the marketing Navbar — kept as-is (it already
 exposes logo, theme, AI-provider indicator). Can be a follow-up if you want a literally identical top bar
 inside the app.
 - Real demo videos — frames ship empty (play-button placeholder); drop in videoUrls later via config.

 Verification

 1. cd frontend && npm run dev; visit each of the 7 landing slugs — confirm correct (non-placeholder) copy,
 illustration in hero + cards, video frame, no pricing.
 2. Toggle theme in navbar on a landing page → confirm hero/showcase/video/CTA all recolor
     │ identical top bar inside the app.                                                                   │
     │ - Real demo videos — frames ship empty (play-button placeholder); drop in videoUrls later via       │
     │ config.                                                                                             │
     │                                                                                                     │
     │ Verification                                                                                        │
     │                                                                                                     │
     │ 1. cd frontend && npm run dev; visit each of the 7 landing slugs — confirm correct                  │
     │ (non-placeholder) copy, illustration in hero + cards, video frame, no pricing.                      │
     │ 2. Toggle theme in navbar on a landing page → confirm hero/showcase/video/CTA all recolor           │
     │ (light/dark/high-contrast).                                                                         │
     │ 3. Hit every old URL from the redirect table → confirm 301-style redirect to the new path (logged   │
     │ out and logged in).                                                                                 │
     │ 4. Logged in: Dashboard cards → land directly on the tool (no marketing double-hop); logged out:    │
     │ Home cards → land on the marketing page.                                                            │
     │ 5. Click into nested tool routes (/resume-builder/build, /resume-builder/resume-templates,          │
     │ /job-finder/search, /mock-interview/practice, etc.) → tools load as before.                         │
     │ 6. View page source / React DevTools → <head> has per-page <title>, description, canonical, OG, and │
     │ JSON-LD; /sitemap.xml and /robots.txt serve.                                                        │
     │ 7. npm run build succeeds (no broken lazy imports); npm run lint.                                   │
     │ 8. Spot-check no console errors and that AppSidebar/CommandPalette links resolve without bouncing   │
     │ through redirects.                                                                                  │
     ╰─────────────────────────────────────────────────────────────────────────────────────────────────────╯

⏺ Understood — you want a self-contained, detailed plan.md that any LLM (or teammate) can pick up and
  execute without the surrounding conversation. I'll expand the plan into a fully standalone document. Since
  plan mode only lets me edit the designated plan file, I'll write the complete version there now, and on
  approval drop it into your repo as plan.md.

⏺ Updated plan
  ⎿  /plan to preview

⏺ I've expanded the plan into a fully self-contained document — it now includes the feature inventory (what
  each of the 7 tools does + which sub-features are chained), the complete config schema, the full route +
  redirect table, file-by-file steps, conventions, and verification — enough for any LLM/engineer to execute
  cold.

  To drop it into your repo as plan.md (a write, which plan mode blocks), I need to exit plan mode. On
  approval, my first action will be to save this document as plan.md at the repo root — then I'll proceed
  with implementation per the plan.

────────────────────────────────────────────────────────────────────────────────────────────────────────────
 Ready to code?

 Here is Claude's plan:
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
 CareerPilot — Premium SaaS Landing & Feature-IA Revamp

 ▎ Self-contained implementation plan. Any engineer/LLM can execute this without prior context.
 ▎ Repo: career-pilot · Frontend: frontend/ (React 19.2 + Vite 7 + Tailwind v4 + react-router-dom v7 +
 ▎ framer-motion + Zustand).

 ---
 1. Context & Goal

 CareerPilot is an AI career platform with 7 standalone tools plus several chained sub-features. Today the
 tools are reachable through a flat, inconsistent route map and a parallel /hub/* system, and the marketing
 layer is half-built and broken.

 The 7 standalone features (each gets its own SaaS-style landing page):

 ┌───────────┬────────────────────────────────────────────────────┬────────────────────────────────────┐
 │  Feature  │                    What it does                    │         Primary tool file          │
 ├───────────┼────────────────────────────────────────────────────┼────────────────────────────────────┤
 │ Resume    │ 6-step guided resume builder (personal/education/e │                                    │
 │ Builder   │ xperience/projects/skills/preview) with live ATS   │ pages/ResumeBuilder.jsx            │
 │           │ scoring & export (PDF/DOCX)                        │                                    │
 ├───────────┼────────────────────────────────────────────────────┼────────────────────────────────────┤
 │ Portfolio │ Turn resume/profile into a deployed portfolio      │ pages/TemplateGallery.jsx,         │
 │  Builder  │ site; template gallery, theme customisation,       │ pages/hubs/PortfolioHub.jsx        │
 │           │ one-click deploy                                   │                                    │
 ├───────────┼────────────────────────────────────────────────────┼────────────────────────────────────┤
 │ Resume    │ Fast, gamified AI critique of a resume vs a target │ pages/ResumeRoast.jsx              │
 │ Roast     │  role; shareable score card                        │                                    │
 ├───────────┼────────────────────────────────────────────────────┼────────────────────────────────────┤
 │ GitHub    │ Turn top GitHub repos into a portfolio site (OAuth │ pages/PortfolioGithub.jsx          │
 │ Portfolio │  or username); repo selection; deploy              │                                    │
 ├───────────┼────────────────────────────────────────────────────┼────────────────────────────────────┤
 │ Project V │ AI architecture maps, dependency scan, codebase    │ pages/ProjectVisualizer/Dashboard. │
 │ isualizer │ chat, interview-prep & contribution guide for any  │ jsx                                │
 │           │ GitHub repo                                        │                                    │
 ├───────────┼────────────────────────────────────────────────────┼────────────────────────────────────┤
 │ Job       │ Job search aggregator with filters, match score,   │ pages/JobSearch.jsx                │
 │ Finder    │ saved jobs, tracker, alerts                        │                                    │
 ├───────────┼────────────────────────────────────────────────────┼────────────────────────────────────┤
 │ Mock      │ AI mock interviews (behavioral/technical/coding),  │ pages/InterviewPrep.jsx            │
 │ Interview │ A/V check, real-time feedback, history/replay      │                                    │
 └───────────┴────────────────────────────────────────────────────┴────────────────────────────────────┘

 Chained sub-features (only appear inside a parent flow — NEVER a top-level nav item or standalone landing
 CTA):
 - Inline content optimisation — components/resume/AchievementEnhancer.jsx, lives inside Resume Builder's
 Experience/Projects steps ("Enhance with AI" on a bullet). No route.
 - Optimise / Enhance resume — pages/Enhance.jsx, reached only from an existing resume → route
 /resume-builder/optimise/:resumeId.
 - Resume templates — pages/ResumeTemplates.jsx, part of the resume flow →
 /resume-builder/resume-templates.
 - Project enhancement / interview prep from a repo — inside Project Visualizer/Interview flows. Stays
 inline.

 Current problems (verified):
 1. The 7 landing pages in pages/features/*Landing.jsx pass props (category, headline, subheadline, title)
 that do not match the component signatures (badgeText, title, accentText, description, heading). →
 landings render generic placeholder copy, not feature copy.
 2. components/landing/* are hardcoded slate-950/900/800/400 + indigo/purple/pink. They ignore the app's
 CSS-variable theme tokens, so the navbar theme toggle (light/dark/highContrast) looks inert on marketing
 pages.
 3. pages/features/_illustrations/ is empty — there are no illustrations/mockups.
 4. Routing is flat & inconsistent (/resume-builder-landing, /roast, /visualizer, /ai-interview, /jobs,
 /enhance/:id, /hub/*). It does not match the desired nested SEO IA.
 5. /project-visualizer base route is missing → the existing /repo-analyzer* redirects point to a dead path
 that hits the NotFound catch-all.
 6. No SEO: no per-route <title>/meta/canonical/OG/JSON-LD, no sitemap.xml/robots.txt. It's a
 client-rendered SPA.
 7. Duplication: the feature-card grid copy is duplicated inline in OurToolsSection.jsx AND
 pages/Dashboard.jsx (~line 281). Home also shows the same tools twice (OurToolsSection + legacy
 FeaturesSection/AdditionalFeatures).

 Goal: A premium, theme-aware, SEO-optimised experience where:
 - The Home page and the post-login Dashboard both show a bento grid of feature cards (icon, illustration,
 description, badge).
 - Clicking a card opens that feature's SaaS-style landing page — hero (benefit headline + paired CTAs +
 stats), bento feature cards with illustrations, a video frame ("dashboard frame to add a demo video"),
 how-it-works, social proof, final CTA. No pricing.
 - Tools live at clean nested URLs under each feature (/resume-builder, /resume-builder/build,
 /resume-builder/resume-templates, /resume-builder/optimise/:id, …), pattern repeated for all 7.
 - Navbar + Footer are constant across the marketing surface and contain: brand logo, brand title, theme
 toggle, AI-provider selector.
 - Nothing breaks: every old URL 301-redirects to its new home.
 - SEO so search engines surface "our resume builder" etc. for each tool.

 Confirmed decisions:
 1. URL structure: feature base slug = the landing page; tools nested beneath; old paths redirect.
 2. Theme: landing pages are theme-aware via design tokens (toggle works everywhere).
 3. Scope: build all 7 in one pass (shared infra first, then all features).
 4. Illustrations: inline SVG/CSS product mockups (theme-aware React components), not raster images.

 ---
 2. Tech baseline (already in repo — reuse, don't add deps)

 - React 19.2.6 → natively hoists <title>/<meta>/<link>/<script> to <head> when rendered anywhere. This is
 the SEO mechanism — no react-helmet needed.
 - react-router-dom 7.1.1 — BrowserRouter, Routes, Route, Navigate. Routing lives in frontend/src/App.jsx.
 - Tailwind v4 (no tailwind.config.js; theme defined via @theme/CSS vars in frontend/src/index.css).
 - Design tokens (CSS vars, 3 themes light/dark/highContrast on <html> class): --background, --foreground,
 --card, --primary, --secondary, --muted-foreground, --border, --radius. Token utility classes:
 bg-background, text-foreground, bg-card, bg-primary, text-primary, border-border, text-muted-foreground.
 - Reusable CSS in index.css: .gradient-text, .glass, .glow, .bg-mesh, .animate-float, .animate-blob,
 .animate-shimmer, animation-delay-2000/4000.
 - framer-motion 12 for scroll/stagger animation. lucide-react for icons. cn() in
 frontend/src/lib/utils.js. Theme via context/ThemeProvider (+ useTheme). Auth via hooks/useAuth ({ user,
 loading }).
 - Do NOT touch components/portfolio/templates/* or the /templates/:name & /preview/:templateId routes —
 those are live deployed-portfolio renders, not marketing.

 ---
 3. Single source of truth — frontend/src/data/featuresConfig.js

 Create one config that drives: the 7 landing pages, OurToolsSection (Home), the Dashboard grid, the Navbar
 product dropdown, the Footer product column, and sitemap.xml. Eliminates all duplicated copy.

 // featuresConfig.js
 import { FileText, Palette, Flame, Github, Network, Briefcase, Mic } from 'lucide-react';
 import * as Ill from '../components/landing/illustrations';

 export const FEATURES = [
   {
     slug: 'resume-builder',
     name: 'Resume Builder',
     icon: FileText,
     size: 'large',            // bento weight: large|medium|small
     badge: 'Most Popular',
     tagline: 'Build resumes that get interviews. AI-powered ATS optimization that makes recruiters stop
 scrolling.',
     Illustration: Ill.ResumeBuilderMockup,
     primaryAction: { label: 'Open Resume Builder', to: '/resume-builder/build' }, // authed deep link
     seo: {
       title: 'AI Resume Builder — CareerPilot',
       description: 'Build an ATS-optimized resume in minutes with AI. Templates, scoring, GitHub &
 LinkedIn import, PDF export.',
       keywords: 'resume builder, ATS resume, AI resume, resume templates',
       canonical: 'https://careerpilot.app/resume-builder',
     },
     hero: {
       badgeText: 'Resume Builder',
       title: 'Build resumes that get',
       accentText: 'interviews, not rejections.',
       description: 'AI-powered ATS optimization that makes recruiters stop scrolling.',
       primaryCta: { text: 'Start building free', to: '/resume-builder/build' },
       secondaryCta: { text: 'Watch demo', href: '#demo' },
       stats: [{ value: '3x', label: 'Interview rate' }, { value: '50K+', label: 'Resumes built' }, {
 value: '95%', label: 'ATS pass' }],
     },
     showcase: {
       heading: 'Everything you need to stand out',
       features: [
         { icon: 'FileText', title: 'Create from scratch', description: 'Build block by block on a clean
 canvas.' },
         { icon: 'Type', title: 'Text to resume', description: 'Paste text; AI formats it perfectly.' },
         { icon: 'Github', title: 'GitHub to resume', description: 'Turn your repos into experience.' },
         { icon: 'Sparkles', title: 'AI enhance', description: 'Rewrite bullets with measurable impact.' },
         { icon: 'BarChart', title: 'ATS score', description: 'Match against any job description.' },
         { icon: 'Layout', title: 'Templates', description: 'Modern, recruiter-approved designs.' },
         { icon: 'Linkedin', title: 'LinkedIn import', description: 'Pull your profile in one click.' },
         { icon: 'Download', title: 'PDF & DOCX', description: 'Pixel-perfect, ATS-safe exports.' },
       ],
     },
     video: { heading: 'See it in action', subheading: 'A 2-minute walkthrough.', videoUrl: '', caption:
 'Demo coming soon.' },
     howItWorks: { title: 'Your path to a perfect resume', steps: [
       { number: 1, title: 'Start or import', description: 'Upload a resume or start fresh.' },
       { number: 2, title: 'AI enhances', description: 'Optimize content for impact.' },
       { number: 3, title: 'ATS score', description: 'Fix what recruiters’ filters flag.' },
       { number: 4, title: 'Download & apply', description: 'Export and send with confidence.' },
     ] },
     testimonials: { heading: 'Loved by job seekers', items: [
       { name: 'Maya R.', role: 'SWE', company: 'Stripe', metric: '3x interviews', quote: '...', avatar: ''
 },
     ] },
     cta: { headline: 'Ready to land your dream job?', subtext: 'Free for individuals. No credit card.',
 ctaText: 'Start building free', ctaTo: '/resume-builder/build' },
   },
   // ... 6 more objects: portfolio-builder, resume-roast, github-portfolio,
   //     project-visualizer, job-finder, mock-interview (same shape, real copy)
 ];

 export const FEATURES_BY_SLUG = Object.fromEntries(FEATURES.map(f => [f.slug, f]));

 Populate all 7 from the existing landing-page copy + the feature descriptions in §1. Keep copy
 benefit-first (premium voice), no pricing.

 ---
 4. Route map — frontend/src/App.jsx

 Pattern per feature: base slug = public landing, tools nested beneath (keep their existing ProtectedRoute
 + lazy imports — only change path strings), /hub/* + old flat paths redirect via <Navigate replace>.

 Feature: Resume Builder
 Landing (public): /resume-builder
 Nested tool routes (auth): /resume-builder/build, /resume-builder/from-text,
   /resume-builder/resume-templates, /resume-builder/optimise/:resumeId (chained),
   /resume-builder/resume/:resumeId, /resume-builder/examples
 Redirects (old → new): /resume-builder-landing→base · old /resume-builder(tool)→/build · /text-to-resume ·

   /resume-templates · /enhance/:resumeId · /resume/:resumeId · /resume-examples · /hub/resume→base
 ────────────────────────────────────────
 Feature: Portfolio Builder
 Landing (public): /portfolio-builder
 Nested tool routes (auth): /portfolio-builder/templates, /portfolio-builder/build,
   /portfolio-builder/deployments
 Redirects (old → new): /templates† · /deployments · /hub/portfolio→base
 ────────────────────────────────────────
 Feature: Resume Roast
 Landing (public): /resume-roast
 Nested tool routes (auth): /resume-roast/analyze, /resume-roast/shared/:shareToken
 Redirects (old → new): /roast→base · old /resume-roast(tool)→/analyze · /roast/:shareToken ·
   /hub/roast→base
 ────────────────────────────────────────
 Feature: GitHub Portfolio
 Landing (public): /github-portfolio
 Nested tool routes (auth): /github-portfolio/build
 Redirects (old → new): /portfolio/github · /hub/portfolio/github→base
 ────────────────────────────────────────
 Feature: Project Visualizer
 Landing (public): /project-visualizer (NEW base — fixes dead redirects)
 Nested tool routes (auth): /project-visualizer/dashboard/:sessionId (exists)
 Redirects (old → new): /visualizer→base · /repo-analyzer*→base
 ────────────────────────────────────────
 Feature: Job Finder
 Landing (public): /job-finder
 Nested tool routes (auth): /job-finder/search, /job-finder/tracker, /job-finder/alerts
 Redirects (old → new): /jobs · /job-tracker · /job-alerts · /hub/jobs→base
 ────────────────────────────────────────
 Feature: Mock Interview
 Landing (public): /mock-interview
 Nested tool routes (auth): /mock-interview/practice, /mock-interview/history, /mock-interview/history/:id
 Redirects (old → new): /ai-interview→base · /interview-prep · /interview-history · /interview-history/:id

 † /templates/:name and /preview/:templateId are live portfolio renders, not marketing → leave untouched.
 /portfolio-builder/templates maps to the gallery (TemplateGallery), distinct from those.

 Rules:
 - OAuth callbacks (/auth/github/callback, /auth/linkedin/callback, /auth/openrouter/callback) unchanged.
 - Landing routes are public (no ProtectedRoute). Nested tool routes keep current protection + lazy import;
 only the path changes + a redirect route is added for the old path.
 - Keep NotFound (*) catch-all last.
 - Optional helper: const Redirect = ({to}) => <Navigate to={to} replace/>; for param-less redirects; for
 param paths use <Navigate to="/new/:x" replace/> won't interpolate — instead render a tiny component that
 reads useParams() and builds the target (e.g. RedirectResume → /resume-builder/optimise/${resumeId}).

 ---
 5. Build steps (in order)

 Step 1 — Fix & tokenise shared landing components

 Files: frontend/src/components/landing/{FeatureLandingHero,FeatureShowcase,FeatureVideoSection,FeatureHowI
 tWorks,FeatureTestimonials,FeatureCTA,PremiumFeatureCard,OurToolsSection}.jsx
 - Swap every hardcoded color for tokens: slate-950/900→bg-background/bg-card, slate-800→border-border,
 slate-400/500→text-muted-foreground, text-white→text-foreground, indigo-600→bg-primary,
 indigo-400→text-primary, from-indigo… to-pink…→from-primary to-secondary (or reuse .gradient-text). Reuse
 .bg-mesh, .animate-blob/float, .glass, .glow.
 - One prop contract = the components' existing signatures: hero {badgeText,title,accentText,description,pr
 imaryCtaText,primaryCtaLink,secondaryCtaText,secondaryCtaLink,stats,illustration}; showcase
 {heading,features}; video {heading,subheading,videoUrl,caption,posterUrl}; howItWorks {title,steps};
 testimonials {heading,items} (rename current testimonials prop usage consistently); cta
 {headline,subtext,ctaText,ctaTo}.
 - FeatureVideoSection already renders the browser-chrome video frame with a play-button placeholder when
 videoUrl==='' — this is the "frame to add a demo video." Keep, just tokenise.
 - PremiumFeatureCard already has an illustration slot — keep; render the feature's mockup.

 Step 2 — Illustration kit (theme-aware inline SVG/CSS)

 New dir frontend/src/components/landing/illustrations/ with one component per feature + index.js barrel:
 ResumeBuilderMockup, PortfolioBuilderMockup, ResumeRoastMockup, GithubPortfolioMockup,
 ProjectVisualizerMockup, JobFinderMockup, MockInterviewMockup.
 - Each = a small "fake product UI" panel built from divs/SVG (cards, progress bars, score gauge, graph
 nodes, job rows, audio waveform, etc.) using token CSS vars / currentColor so it recolors with theme. Add
 subtle animate-float / framer stagger.
 - Used in: hero right column, bento card, optional video poster.
 - (This is the bulk boilerplate — a good candidate to delegate to the ask-agy MCP per repo CLAUDE.md, then
 review.)

 Step 3 — Generic landing page + thin wrappers

 - New frontend/src/components/landing/FeatureLandingPage.jsx: props { config }. Renders: <Seo
 {...config.seo}/> → <Navbar/> → bg mesh/blobs → FeatureLandingHero (with config.hero +
 config.Illustration) → FeatureShowcase → <div id="demo"><FeatureVideoSection/></div> → FeatureHowItWorks →
 FeatureTestimonials → FeatureCTA → <Footer/>.
   - Auth-aware CTA: const { user } = useAuth(); — if user, primary CTA text/target = config.primaryAction
 ("Open Resume Builder" → tool route); else marketing copy (sign-up flow). Avoids the logged-in double-hop.
 - Rewrite the 7 frontend/src/pages/features/*Landing.jsx to one-liners: export default () =>
 <FeatureLandingPage config={FEATURES_BY_SLUG['resume-builder']} />; (this structurally fixes the
 prop-mismatch bug).

 Step 4 — SEO (React 19 native metadata, no new dep)

 - New frontend/src/components/Seo.jsx: renders <title>, <meta name="description">, <meta name="keywords">,
 <link rel="canonical">, OpenGraph (og:title/description/type/url/image), Twitter card, and <script
 type="application/ld+json"> with a SoftwareApplication object. React 19 hoists all to <head>.
 - Add <Seo/> to FeatureLandingPage and Home.
 - frontend/index.html: base <title>, default description, og: defaults, <link rel="preconnect"> for fonts.
 - frontend/public/robots.txt (allow all + Sitemap: line) and frontend/public/sitemap.xml (list / + the 7
 landing slugs). Generate the sitemap URL list from FEATURES slugs (script or hand-write 8 entries).
 - Ensure each landing has exactly one <h1> (hero title) and <h2> section headers (already the case after
 Step 1).

 Step 5 — Wire config into existing surfaces

 - frontend/src/components/landing/OurToolsSection.jsx: replace inline tools array with FEATURES; cards
 link to clean base slugs; pass Illustration.
 - frontend/src/pages/Dashboard.jsx (~line 281): replace the inline duplicate grid with the same
 FEATURES-driven PremiumFeatureCard grid; for authed users link to primaryAction.to (tool), keeping current
 token styling.
 - frontend/src/components/Navbar.jsx: product dropdown (7 items) sourced from FEATURES (label + base
 slug). Confirm logo + brand title + theme toggle (cycles light→dark→highContrast) + AIProviderSelector all
 present (they are) — these stay constant on every landing.
 - frontend/src/components/ui/Footer.jsx: product column links from FEATURES clean slugs.
 - frontend/src/pages/Home.jsx: keep Navbar/HeroSection/OurToolsSection/Footer; make OurToolsSection the
 single canonical feature grid — trim/repurpose legacy FeaturesSection/AdditionalFeatures so the same 7
 tools aren't listed twice.

 Step 6 — Redirects & internal-link cleanup

 - Add all redirect routes from §4 (old → new), incl. /hub/*.
 - Grep & update internal Link to= / navigate( usages of every renamed path so the app navigates to new
 URLs directly (redirects are only a safety net for bookmarks/external links). Known spots:
 frontend/src/components/AppSidebar.jsx (hub links: /hub/resume, /hub/jobs, /hub/portfolio, …),
 frontend/src/components/CommandPalette.jsx, Dashboard quick links (/jobs, /upload, /job-tracker), any
 to="/resume-builder-landing".

 ---
 6. Files summary

 New:
 - frontend/src/data/featuresConfig.js
 - frontend/src/components/Seo.jsx
 - frontend/src/components/landing/FeatureLandingPage.jsx
 - frontend/src/components/landing/illustrations/{7 mockups}.jsx + index.js
 - frontend/public/robots.txt, frontend/public/sitemap.xml

 Edit:
 - frontend/src/App.jsx (routes + redirects)
 - frontend/src/components/landing/*.jsx (tokenise + fix prop contract)
 - frontend/src/pages/features/*Landing.jsx (→ thin wrappers, ×7)
 - frontend/src/pages/Dashboard.jsx, frontend/src/pages/Home.jsx
 - frontend/src/components/Navbar.jsx, frontend/src/components/ui/Footer.jsx
 - frontend/src/components/AppSidebar.jsx, frontend/src/components/CommandPalette.jsx
 - frontend/index.html

 Reuse (do not reinvent): index.css utilities, lib/utils.js cn, context/ThemeProvider, hooks/useAuth,
 lucide icons.
 Do not touch: components/portfolio/templates/*, /templates/:name, /preview/:templateId.

 ---
 7. Conventions for implementers

 - Match surrounding code style (functional components, default export, framer-motion whileInView with
 viewport={{once:true}}, staggered delays).
 - Colors: only token classes on marketing components — no raw slate-*/indigo-*. Verify by toggling theme.
 - Keep all tool components' internal logic untouched; only their route path and inbound links change.
 - Copy is benefit-first, premium tone, no pricing anywhere.
 - Keep lazy-loading + Suspense fallbacks for tool routes; landing pages may stay lazy too.

 ---
 8. Out of scope (flag to stakeholder)

 - Restyling the authed AppLayout/AppSidebar shell to use the marketing Navbar (it already exposes logo,
 theme, AI-provider indicator). Optional follow-up if a literally identical in-app top bar is wanted.
 - Real demo videos — frames ship empty (play-button placeholder); add videoUrls later via config.
 - SSR/prerender — React 19 head hoisting + sitemap/robots is the SEO scope here; full SSR (e.g. via a
 prerender step) is a separate effort if needed.

 ---
 9. Verification

     │ New:                                                                                                │
     │ - frontend/src/data/featuresConfig.js                                                               │
     │ - frontend/src/components/Seo.jsx                                                                   │
     │ - frontend/src/components/landing/FeatureLandingPage.jsx                                            │
     │ - frontend/src/components/landing/illustrations/{7 mockups}.jsx + index.js                          │
     │ - frontend/public/robots.txt, frontend/public/sitemap.xml                                           │
     │                                                                                                     │
     │ Edit:                                                                                               │
     │ - frontend/src/App.jsx (routes + redirects)                                                         │
     │ - frontend/src/components/landing/*.jsx (tokenise + fix prop contract)                              │
     │ - frontend/src/pages/features/*Landing.jsx (→ thin wrappers, ×7)                                    │
     │ - frontend/src/pages/Dashboard.jsx, frontend/src/pages/Home.jsx                                     │
     │ - frontend/src/components/Navbar.jsx, frontend/src/components/ui/Footer.jsx                         │
     │ - frontend/src/components/AppSidebar.jsx, frontend/src/components/CommandPalette.jsx                │
     │ - frontend/index.html                                                                               │
     │                                                                                                     │
     │ Reuse (do not reinvent): index.css utilities, lib/utils.js cn, context/ThemeProvider,               │
     │ hooks/useAuth, lucide icons.                                                                        │
     │ Do not touch: components/portfolio/templates/*, /templates/:name, /preview/:templateId.             │
     │                                                                                                     │
     │ ---                                                                                                 │
     │ 7. Conventions for implementers                                                                     │
     │                                                                                                     │
     │ - Match surrounding code style (functional components, default export, framer-motion whileInView    │
     │ with viewport={{once:true}}, staggered delays).                                                     │
     │ - Colors: only token classes on marketing components — no raw slate-*/indigo-*. Verify by toggling  │
     │ theme.                                                                                              │
     │ - Keep all tool components' internal logic untouched; only their route path and inbound links       │
     │ change.                                                                                             │
     │ - Copy is benefit-first, premium tone, no pricing anywhere.                                         │
     │ - Keep lazy-loading + Suspense fallbacks for tool routes; landing pages may stay lazy too.          │
     │                                                                                                     │
     │ ---                                                                                                 │
     │ 8. Out of scope (flag to stakeholder)                                                               │
     │                                                                                                     │
     │ - Restyling the authed AppLayout/AppSidebar shell to use the marketing Navbar (it already exposes   │
     │ logo, theme, AI-provider indicator). Optional follow-up if a literally identical in-app top bar is  │
     │ wanted.                                                                                             │
     │ - Real demo videos — frames ship empty (play-button placeholder); add videoUrls later via config.   │
     │ - SSR/prerender — React 19 head hoisting + sitemap/robots is the SEO scope here; full SSR (e.g. via │
     │ a prerender step) is a separate effort if needed.                                                   │
     │                                                                                                     │
     │ ---                                                                                                 │
     │ 9. Verification                                                                                     │
     │ change.                                                                                             │
     │ - Copy is benefit-first, premium tone, no pricing anywhere.                                         │
     │ - Keep lazy-loading + Suspense fallbacks for tool routes; landing pages may stay lazy too.          │
     │                                                                                                     │
     │ ---                                                                                                 │
     │ 8. Out of scope (flag to stakeholder)                                                               │
     │                                                                                                     │
     │ - Restyling the authed AppLayout/AppSidebar shell to use the marketing Navbar (it already exposes   │
     │ logo, theme, AI-provider indicator). Optional follow-up if a literally identical in-app top bar is  │
     │ wanted.                                                                                             │
     │ - Real demo videos — frames ship empty (play-button placeholder); add videoUrls later via config.   │
     │ - SSR/prerender — React 19 head hoisting + sitemap/robots is the SEO scope here; full SSR (e.g. via │
     │ a prerender step) is a separate effort if needed.                                                   │
     │                                                                                                     │
     │ ---                                                                                                 │
     │ 9. Verification                                                                                     │
     │                                                                                                     │
     │ 1. cd frontend && npm run dev; open each of the 7 landing slugs → real (non-placeholder) copy, hero │
     │ + card illustrations, video frame, no pricing.                                                      │
     │ 2. Toggle theme on a landing page → hero/showcase/video/CTA all recolor across                      │
     │ light/dark/highContrast.                                                                            │
     │ 3. Hit every old URL in §4 (logged out and in) → redirects to the new path.                         │
     │ 4. Logged in: Dashboard cards → land directly on the tool (no marketing double-hop). Logged out:    │
     │ Home cards → marketing landing.                                                                     │
     │ 5. Open nested tool routes (/resume-builder/build, /resume-builder/resume-templates,                │
     │ /job-finder/search, /mock-interview/practice, /project-visualizer/dashboard/:id) → tools load       │
     │ unchanged.                                                                                          │
     │ 6. View source / React DevTools → <head> has per-page <title>, description, canonical, OG, JSON-LD. │
     │ /robots.txt + /sitemap.xml serve.                                                                   │
     │ 7. npm run build succeeds (no broken lazy imports); npm run lint clean.                             │
     │ 8. No console errors; AppSidebar/CommandPalette links resolve without bouncing through redirects.   │
     ╰───────────────────────────────────────────────────────────────────────────────────────────────────