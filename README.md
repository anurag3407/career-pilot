<div align="center">
  <h1>🚀 Career Pilot</h1>
  <p><strong>AI-powered career OS — resumes, mock interviews, job tracking, portfolios, fellowships, GitHub intelligence and outreach, all in one full-stack platform.</strong></p>
  <p>
    <a href="https://github.com/anurag3407/career-pilot/stargazers"><img src="https://img.shields.io/github/stars/anurag3407/career-pilot?style=for-the-badge&logo=github" alt="Stars"/></a>
    <a href="https://github.com/anurag3407/career-pilot/blob/main/LICENSE"><img src="https://img.shields.io/github/license/anurag3407/career-pilot?style=for-the-badge" alt="License"/></a>
    <a href="#-quick-install"><img src="https://img.shields.io/badge/install-one%20command-7c3aed?style=for-the-badge&logo=rocket" alt="Install"/></a>
  </p>
  <p>
    <img src="https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white" alt="Node.js"/>
    <img src="https://img.shields.io/badge/Express-4.18-000000?logo=express&logoColor=white" alt="Express"/>
    <img src="https://img.shields.io/badge/MongoDB-6.0-47A248?logo=mongodb&logoColor=white" alt="MongoDB"/>
    <img src="https://img.shields.io/badge/Redis-7.0-DC382D?logo=redis&logoColor=white" alt="Redis"/>
    <img src="https://img.shields.io/badge/Socket.IO-4-010101?logo=socket.io&logoColor=white" alt="Socket.IO"/>
    <img src="https://img.shields.io/badge/BullMQ-queues-EA2424?logo=bull&logoColor=white" alt="BullMQ"/>
    <img src="https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white" alt="React"/>
    <img src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" alt="Vite"/>
    <img src="https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwindcss&logoColor=white" alt="TailwindCSS"/>
    <img src="https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-FFCA28?logo=firebase&logoColor=black" alt="Firebase"/>
    <img src="https://img.shields.io/badge/Razorpay-payments-3395FF?logo=razorpay&logoColor=white" alt="Razorpay"/>
    <img src="https://img.shields.io/badge/Tesseract-OCR-5C2D91" alt="OCR"/>
    <img src="https://img.shields.io/badge/Multi--AI-OpenAI%20%7C%20Anthropic%20%7C%20Groq%20%7C%20Gemini-7c3aed" alt="Multi-AI"/>
  </p>
  <p>
    Documentation · <a href="https://discord.gg/dpDMVywS">Discord</a> · License: <a href="LICENSE">MIT</a> · Built with ❤️ by the Career Pilot community
  </p>
</div>

---

## ✨ What is Career Pilot?

**Career Pilot** is a full-stack, AI-first **career operating system** that turns job hunting from a chaotic, multi-tab slog into a single workflow. It's not a single-purpose resume builder — it's a unified platform that combines **resumes, mock interviews, job search & tracking, portfolio publishing, GitHub intelligence, fellowships, paid challenges, community, outreach, and admin tooling** behind one authenticated dashboard.

Powered by **multi-provider AI** (OpenAI, Anthropic Claude, Groq, Google Gemini, OpenRouter and a Bring-Your-Own-Key path), Career Pilot writes your resume, critiques it like an ATS, runs you through mock interviews with an avatar, tracks every job application on a kanban board, deploys a designer-grade portfolio to Netlify / Cloudflare Pages / GitHub Pages, parses your GitHub for risk and impact, and emails recruiters on your behalf — all from the same Express + React app.

It's modular by design: the Express backend exposes 30+ route groups, the React frontend has 50+ pages across feature hubs, and contributors can pick up **good-first-issue** tickets in any one of them without having to grok the rest of the system.

---

## 🧭 Feature Pillars

Career Pilot is organized into six tightly-integrated pillars. Each pillar ships its own UI hub, REST routes, AI services, and MongoDB models — and they share authentication, presence, notifications, and rate limiting.

| | Pillar | What you get |
|---|---|---|
| 📝 | **Resume Studio** | AI-built resumes, 60+ templates, ATS scorer, drag-and-drop sections, text-to-resume, tailoring, translation, versions & sharing |
| 🎤 | **Interview Sim** | Audio + video mock interviews with an avatar interviewer, coding round (Monaco editor, executed against hidden tests), 14 languages, confidence meter, replay |
| 💼 | **Jobs & Tracker** | JSearch-powered search, drag-and-drop kanban tracker, scheduled email alerts, company research, JD summarizer, recruiter outreach & tracking |
| 🎨 | **Portfolio Studio** | 250+ themes, AI content enhancer + extractor, deploy to Netlify / Cloudflare / GitHub Pages, custom domains, accessibility audit, SEO, GitHub sync |
| 🧠 | **AI Career Tools** | Cover-letter generator, email drafter (3 variants), LinkedIn optimizer, skill-gap analyzer, career-trajectory predictor, weekly digest |
| 🌐 | **Community, Fellowships & GitHub Intel** | Channels, posts, DMs, scheduled posts, paid fellowship challenges, Razorpay payouts, repo analyzer, project visualizer, CI/CD & dependency detection |

---

## 🚀 Quick Install

### Prerequisites
- **Node.js 18+** and **npm 10+** (or yarn / pnpm)
- **MongoDB 6.0+** (local or Atlas)
- **Redis 7.0+** (local, Upstash, or Memorystore)
- **Firebase project** (Authentication + Firestore)
- Optional: **Cloudinary** for media, **OpenAI / Anthropic / Groq** keys for AI features, **RapidAPI** for JSearch, **Razorpay** for fellowship payments, **GitHub token** for higher rate-limits

### Clone & bootstrap
```bash
git clone https://github.com/anurag3407/career-pilot.git
cd career-pilot

# Install root, backend, and frontend deps
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### Configure environment

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env — set MONGODB_URI, REDIS_URL, OPENAI_API_KEY, RAPIDAPI_KEY,
# FIREBASE_PROJECT_ID, FIREBASE_SERVICE_ACCOUNT_PATH, FRONTEND_URL

# Frontend
cp frontend/.env.example frontend/.env
# Edit frontend/.env — set VITE_API_URL, VITE_FIREBASE_* keys
```

### Run locally

```bash
# Terminal 1 — backend (Express on :5000)
cd backend
npm run dev

# Terminal 2 — frontend (Vite on :5173)
cd frontend
npm run dev
```

Visit **http://localhost:5173** and sign up. Two-factor authentication, social login, and Firebase auth are wired in — registration takes one click.

### Docker (one command)

```bash
docker compose up --build
```

The included `Docker-compose.yml` builds the frontend, the backend, and pulls in MongoDB + Redis with health-checks so you can be running in a single command on Linux, macOS, or Windows.

---

## 🏁 Getting Started

After installation, the most-used workflows are:

```bash
# Resume
cd frontend && npm run dev          # open /dashboard → "New Resume"
# AI: paste a job description into Enhance → ATS score + rewrite

# Mock interview
# Open /interview-prep → pick a role → speak or type answers

# Job tracker
# Open /jobs-hub → "Track" a job → drag across the kanban

# Portfolio
# Open /portfolio-hub → "New Portfolio" → pick a theme → Deploy
```

The **Hubs** (`/resume-hub`, `/jobs-hub`, `/portfolio-hub`, `/career-growth-hub`, `/community-hub`) act as mission control — every tool you need for that pillar is one click away.

---

## 📝 Pillar 1 — Resume Studio

A complete resume authoring + analysis environment.

| Feature | Description |
|---|---|
| **Visual Builder** | Step-wizard with sections for Personal, Education, Experience, Projects, Skills, Certifications, Custom Sections. Drag-and-drop reorder with persistence. |
| **60+ Templates** | From `ClassicSerif` and `IvyLeague` to `TechMono`, `IDETheme`, `Glassmorphism`, `BrutalistBold`, `NeumorphismSoft`, `PhotoBanner`, `StockholmScandi`, `BerlinTwoCol` — pick the one that matches your industry. |
| **Text-to-Resume** | Paste a wall of text (LinkedIn export, old bio, anything) and the AI structures it into a resume. See `/text-to-resume`. |
| **AI Enhancement** | `Enhance.jsx` runs a multi-pass critique: ATS scoring, achievement rewrites with action verbs, quantified-impact suggestions, tone analyzer, consistency checker. |
| **Resume Tailor** | Paste a job description → AI rewrites your resume to match keywords and rank for that specific role. |
| **Resume Translator** | Translate to 14 languages while preserving layout and section ordering. |
| **ATS Scorer** | Section-aware keyword matching with role dictionaries (software engineer, frontend, backend, data scientist, PM, designer, marketing, sales, HR, PM, etc.). Returns 0–100 with actionable feedback. |
| **Versions & Compare** | Every save snapshots a `ResumeVersion`. Diff two versions side-by-side, restore any prior snapshot. |
| **Sharing & Comments** | Generate a public link (`/shared/:token`) with optional expiry. Reviewers can leave inline comments without an account. |
| **Resume ↔ Portfolio Compare** | Detects drift between your resume claims and your live portfolio content. |
| **PDF Export** | One-click export via `jsPDF` + `html2canvas`, paginated, print-ready. |

**Routes**: `/dashboard`, `/resume-builder`, `/enhance`, `/resume-templates`, `/resume-view/:id`, `/shared/:token`, `/text-to-resume`

**Backend**: `routes/resume.js`, `routes/enhance.js`, `routes/collaboration.js`, `services/atsScorer.js`, `services/resumeJobMatcher.js`, `services/keywordOptimizer.js`, `services/pdfGenerator.js`

---

## 🎤 Pillar 2 — Interview Sim

A real interview, not a quiz.

| Feature | Description |
|---|---|
| **Avatar Interviewer** | 3D-animated interviewer with idle/active/listening states — built in `AvatarInterviewer.jsx`. |
| **Audio + Video** | Browser mic capture via `VoiceToTextButton`, video toggle, push-to-talk. Falls back gracefully on devices without a camera. |
| **Speech-to-Text** | Server-side transcription pipeline (`transcribeAudio`) uploads buffer to storage and returns text — so any candidate can answer verbally. |
| **Coding Round** | Lazy-loaded **Monaco editor** with syntax highlighting. Code is executed against hidden test cases (`runCodeAgainstTests`) and graded. |
| **14 Languages** | English, Spanish, French, German, Italian, Portuguese, Dutch, Hindi, Japanese, Korean, Simplified Chinese, Arabic, Russian, Turkish — the AI gives feedback and ideal answers in your chosen language. |
| **Company-Specific Bank** | A curated `QuestionBank` model ships pre-vetted questions for top companies. AI generation fills the gaps. |
| **Confidence Meter** | Real-time audio analysis + answer-quality scoring — see how you sound under pressure. |
| **Body Language Tips** | Browser-side heuristics for posture, eye contact, and pace — actionable prompts mid-interview. |
| **Replay** | Every interview is saved (`Interview.model.js`) with question, your answer, ideal answer, and AI analysis. Replay any past attempt in `/interview-history` and `/interview-replay/:id`. |
| **JD-Driven Questions** | Drop in a job description URL or paste text — the parser extracts role / level / skills and generates a tailored loop. |
| **Share Cards** | Generate a poster-style image of your interview summary to share on LinkedIn. |

**Routes**: `/interview-prep`, `/interview-history`, `/interview-replay/:id`

**Backend**: `routes/interview.js`, `services/interviewService.js`, `services/jdParser.service.js`, `models/Interview.model.js`, `models/QuestionBank.model.js`

---

## 💼 Pillar 3 — Jobs & Tracker

Find, organize, follow up — without losing a single application.

| Feature | Description |
|---|---|
| **Job Search** | Filters for title, location, salary, remote/on-site, recency. Backed by **RapidAPI JSearch** with a multi-source **Scraper Registry** (LinkedIn, Naukri, AngelList, RemoteOK) as a fallback when the API quota is exhausted. |
| **Job Tracker** | Drag-and-drop kanban: `Saved → Applied → Interviewing → Offered → Rejected`. Each card tracks company, role, link, notes, salary, status updates, and timeline. |
| **Mobile Kanban** | Swipe-friendly board for on-the-go status changes (`MobileKanban.jsx`). |
| **Job Alerts** | Define keyword + location + frequency; a **BullMQ** worker runs the query, dedupes, and emails matching roles. (`jobFetcher.js`, `jobAlertQueue.js`) |
| **Smart Email Alerts** | Open + click tracking via `emailTracker.js` + `bounceHandler.js`; unsubscribe links; weekly digest summary. |
| **Company Research** | Paste a company name → AI returns structured intelligence (size, funding, tech stack, culture, recent news) for interview prep. |
| **JD Summarizer** | One-line "what this job actually wants" + responsibility breakdown + must-have vs. nice-to-have skills. |
| **Recruiter Outreach** | `/outreach` — give it a company URL and it drafts 3 personalized cold emails using your resume + the company's open roles, then queues them. |
| **Email Tracking** | Open pixels + click redirects tell you which recruiter actually read your email. |
| **Offline Tolerant** | Status changes are queued locally (`getQueuedStatusUpdates`) and replayed when you're back online — track a job from the train. |

**Routes**: `/job-search`, `/job-tracker`, `/job-alerts`, `/outreach`

**Backend**: `routes/jobsRoute.js`, `routes/jobTracker.js`, `routes/jobAlerts.js`, `routes/outreach.route.js`, `routes/emailTracking.js`, `services/jobFetcher.js`, `services/companyResearchService.js`, `services/jobSummarizer.js`, `services/scrapers/*`, `services/outreachQueue.js`, `services/weeklyDigestService.js`

---

## 🎨 Pillar 4 — Portfolio Studio

A working portfolio site in under a minute — themed, accessible, and live on your domain.

| Feature | Description |
|---|---|
| **250+ Themes** | From `Aurora_Sky` to `Cyberpunk`, `Cyber_Security_Red_Team`, `Magazine_Editorial`, `Liquid_Morph`, `Apple_Showcase`, `Spotify_Wrapped`, `Vercel_Deploy`, `IKEA_Assembly_Manual`, `Cyber_Security_Red_Team`, `Reddit_Whistleblower`, `Notion_Workspace`, `VS_Code_Theme`, and many more — including tribute templates inspired by Delba, Dev Jadiya, Clyde D'Souza, and ChiragChrg. |
| **AI Portfolio Extractor** | Paste your resume → AI extracts structured data (hero, projects, skills, experience, education) → pre-fills the editor. |
| **AI Content Enhancer** | Section-by-section rewrites to sharpen your "About", tighten project descriptions, and humanize your tone. |
| **Theme Selector + Color Customizer** | Live preview with custom palette, fonts, and accent colors per section. |
| **Resume ↔ Portfolio Compare** | Detects drift so your portfolio never contradicts your resume. |
| **Section Editor** | Reorder, hide, or duplicate hero / projects / about / skills / experience / education sections. |
| **Social Links Editor** | GitHub, LinkedIn, X, Email, Website — rendered as themed buttons. |
| **Accessibility Audit** | `accessibilityChecker.js` scores contrast, alt-text, ARIA, heading order, and keyboard traps; surfaces a per-page report. |
| **Image Optimization** | Sharp-based pipeline that resizes, re-encodes, and lazy-loads every asset. |
| **One-Click Deploy** | Push to **Netlify**, **Cloudflare Pages**, or **GitHub Pages** with the same UI. Custom slugs, deploy logs, and rollback are all in-app. |
| **GitHub Sync** | `portfolioGitHubSync.js` watches a connected repo, auto-rebuilds the portfolio on new commits, and pins your best work. |
| **SEO** | Auto-generated `robots.txt`, `sitemap.xml`, OpenGraph, and Twitter cards. |
| **Screenshot Service** | `screenshotService.js` uses a shared Puppeteer browser instance to generate social-share previews. |
| **HTML Sanitization** | Every user-pasted HTML block is sanitized through `htmlSanitizer.js` and threat-scanned before render. |
| **Portfolio Versions** | Snapshot every publish, roll back in one click. |

**Routes**: `/portfolio-hub`, `/portfolio/:id`, `/deployments`

**Backend**: `routes/portfolio.js`, `services/portfolioTemplateEngine.js`, `services/portfolioGitHubSync.js`, `services/accessibilityChecker.js`, `services/screenshotService.js`, `services/imageOptimizer.js`, `services/deploy/{netlify,cloudflare,githubPages}Deployer.js`, `services/deploy/portfolioHtmlGenerator.js`, `services/ai/portfolioExtractor.js`, `services/ai/portfolioContentEnhancer.js`

---

## 🧠 Pillar 5 — AI Career Tools

A bag of focused, deterministic AI utilities that compose with everything else.

| Tool | What it does |
|---|---|
| **AI Resume Enhancer** | Multi-pass rewrite of bullet points, with action verbs, quantified impact, and tone control. |
| **ATS Scorer** | Section-aware keyword density, role-specific dictionaries, 0–100 score with concrete fixes. |
| **Resume ↔ JD Matcher** | Match score, missing skills, strengths, and tailored recommendation list. |
| **Skill Gap Analyzer** | Paste a JD → see what you're missing, get a personalized learning plan. |
| **Career Trajectory Predictor** | 3 career paths × 4 roles × 3 skills each, from your current role + skills. |
| **Salary Estimator** | Industry + experience + location → market salary band with reasoning. |
| **Cover Letter Generator** | Upload your resume PDF → AI extracts text → tone picker (formal / conversational / enthusiastic) → PDF-ready letter. |
| **Cold Email Generator** | 3 variants + 3 subject lines from your resume + a job description; pickable tone. |
| **LinkedIn Optimizer** | Section-by-section critique of your LinkedIn profile with a ScoreRing UI, copyable rewrites, and impact-tagged recommendations. |
| **LinkedIn Headline Generator** | Standalone generator powered by `LinkedInHelper`. |
| **LinkedIn Dashboard** | Importer, engagement analytics, and connection-tracking. |
| **JD Summarizer** | Compresses any job description into responsibilities / requirements / nice-to-haves / red flags. |
| **Company Research** | AI-driven company intelligence report. |
| **Keyword Optimizer** | Finds high-value keywords missing from your resume for a target role. |
| **Weekly Digest** | Personalized email of new jobs, alerts fired, interview stats, and application status. |
| **Multi-Provider AI** | `aiProviders.js` routes between OpenAI, Anthropic Claude, Groq, Gemini, OpenRouter. BYOK via `extractAIProvider` middleware. |

**Routes**: `/enhance`, `/skill-gap`, `/cover-letter`, `/email-generator`, `/linkedin-optimizer`, `/linkedin-dashboard`, `/analytics`

**Backend**: `services/atsScorer.js`, `services/resumeJobMatcher.js`, `services/keywordOptimizer.js`, `services/coverLetterService.js`, `services/emailGeneratorService.js`, `services/linkedinOptimizerService.js`, `services/linkedinService.js`, `services/linkedinImporter.js`, `services/careerPathSuggester.js`, `services/salaryEstimator*`, `services/companyResearchService.js`, `services/jobSummarizer.js`, `services/weeklyDigestService.js`, `services/ai/*`, `services/anthropicChatService.js`

---

## 🌐 Pillar 6 — Community, Fellowships & GitHub Intel

The non-resume half of Career Pilot: where humans (and code) meet.

### Community
- **Channels** with member counts and unread badges
- **Posts feed** with rich text + image uploads, scheduled posts (`postScheduler.js`)
- **Comments** with like-toggle and threaded replies
- **Direct Messages** with online presence indicators
- **Presence service** via Socket.IO (`presenceService.js`) — see who's online right now
- **Real-time** updates through `socketServiceFirebase.js`
- **Bull-Board UI** at `/admin/queues` for ops to watch queues live

### Fellowships — paid challenges
- **Browse Challenges** (`/fellowship/challenges`) across Design, Content, Development, Research, Marketing
- **Submit Proposals** with budget and timeline
- **Onboarding & Verification** — email + 6-digit code with rate-limited attempts (`verifyCodeLimiter`)
- **Chat Rooms** scoped per challenge (`FellowshipChat`)
- **Razorpay Payouts** — proposals are funded via `paymentService.js` (`routes/payments.js`): create order → user pays → signature verified → funds released
- **My Challenges / My Proposals** — personal dashboards

### GitHub Intelligence
- **Repo Analyzer Workspace** (`/repo-analyzer/workspace`) — paste a GitHub URL, get a node-graph of files, dependencies, and complexity. Includes file drawer, chat panel, and **interview mode** where the AI quizzes you on the codebase.
- **Project Visualizer** (`/project-visualizer`) — architecture canvas, module inspector, language bar, dependency-health panel, risk cards, contributor grid, commit timeline, AI suggestions.
- **CI/CD Detector** — auto-detects GitHub Actions, Jenkins, CircleCI, Travis, GitLab CI, and reports coverage.
- **Dependency Analyzer** — surfaces outdated, vulnerable, or unused packages.
- **GitHub Dashboard** — contribution heatmap, productive hours chart, repo radar, README generator, profile import → resume.
- **Repo Ingestion** — clones and indexes repos for offline analysis.

**Routes**: `/community`, `/fellowship/*`, `/repo-analyzer/*`, `/project-visualizer/*`, `/github-dashboard`

**Backend**: `routes/community.js`, `routes/fellowships.js`, `routes/payments.js`, `routes/repoAnalyzer.js`, `routes/projectVisualizer.route.js`, `routes/githubImporter.js`, `services/postScheduler.js`, `services/presenceService.js`, `services/socketServiceFirebase.js`, `services/repoScanner.js`, `services/repoIngestionService.js`, `services/dependencyAnalyzer.js`, `services/cicdDetector.js`, `services/githubEnricherService.js`, `services/paymentService.js`, `services/twoFactorService.js`

---

## 🔐 Security, Auth & Privacy

| Capability | Implementation |
|---|---|
| **Firebase Authentication** | Email/password, Google, GitHub social login. Token verified server-side via `verifyToken` middleware. |
| **Two-Factor Auth** | TOTP via `speakeasy`, AES-256-GCM-encrypted secrets, QR code setup, 10 single-use backup codes, secure recovery flow (`routes/twoFactor.js`). |
| **Rate Limiting** | Per-route, per-user limits on AI endpoints (`aiRateLimiter`), fellowship verify codes, and cover-letter generation. |
| **Role-Based Access** | `adminOnly` middleware protects admin routes; `/api/admin/*` exposes stats, user management, login logs, bug reports. |
| **GDPR** | `/api/gdpr/*` endpoints for export and deletion. |
| **Email Bounce Handling** | `bounceHandler.js` unsubscribes and flags invalid addresses. |
| **HTML Sanitization** | `htmlSanitizer.js` + threat scanner protect portfolio rendering. |
| **Payments** | Razorpay HMAC signature verification on every callback. |
| **Security Settings UI** | `/security-settings` — enable/disable 2FA, regenerate backup codes, view active sessions. |

---

## 🧩 Architecture at a Glance

```
career-pilot/
├── backend/                # Express 4.18 API server
│   ├── src/
│   │   ├── routes/         # 30+ route groups (resume, jobs, portfolio, etc.)
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # 50+ business-logic services (AI, jobs, deploy…)
│   │   ├── models/         # 30+ Mongoose schemas
│   │   ├── middleware/     # auth, rateLimiter, aiKey, validate, errorHandler
│   │   ├── schemas/        # Zod request validators
│   │   ├── config/         # aiProviders, firebase, redis, multer
│   │   ├── utils/          # htmlSanitizer, diff, sitemapGenerator
│   │   ├── validators/     # Custom validators
│   │   └── templates/      # Email + portfolio template sources
│   ├── tests/              # Jest test suite
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/               # React 19 + Vite 7 SPA
│   ├── src/
│   │   ├── pages/          # 50+ pages grouped by pillar
│   │   ├── components/     # 200+ components grouped by feature
│   │   ├── services/       # Typed API clients
│   │   ├── stores/         # Zustand stores
│   │   ├── hooks/          # useAuth, useSocket, usePrefetch…
│   │   ├── constants/      # Languages, statuses, tooltips
│   │   ├── utils/          # resumeChecker, toneAnalyzer, shareCard…
│   │   └── data/           # Static data
│   ├── Dockerfile
│   └── .env.example
│
├── docs/                   # PROJECT_DOCUMENTATION, AI architecture, GDPR, deployment
├── API_DOCS/               # API documentation index
├── ARCHITECTURE.md         # System diagrams and deeper flows
├── DATABASE_SCHEMA.md      # MongoDB schema reference
├── firebase/               # Firestore rules + indexes
├── activity/               # Activity tracking
├── scripts/                # Operational scripts
├── prometheus.yml          # Prometheus scrape config
├── docker-compose.yml
├── Dockerfile
└── README.md (this file)
```

**Stack detail:**
- **Backend** — Node.js 18+, Express 4.18, Mongoose 8, Socket.IO 4, BullMQ, Bull-Board, Redis 7, Firebase Admin, Razorpay, Puppeteer, Sharp, Tesseract.js, Speakeasy, Multer, Zod, Jest
- **Frontend** — React 19, Vite 7, TailwindCSS 4, Framer Motion, React Router 7, Zustand, React Query, Monaco Editor, Recharts, @hello-pangea/dnd, react-hot-toast, Lucide Icons
- **Infra** — Firebase (Auth + Firestore + Storage), Redis (queues + rate limit + pub/sub), MongoDB, Prometheus metrics

---

## 🌐 Real-time, Queues & Background Work

- **Socket.IO** gateway for live presence, kanban updates, post scheduling, job-alert push, outreach progress, and editor collaboration.
- **BullMQ workers** for job-alert fetching (`jobAlertQueue.js`), outreach queue (`outreachQueue.js`), email queue, image processing, portfolio build, and digest emails.
- **Bull-Board UI** at `/admin/queues` for live queue inspection.
- **Cron-scheduled** weekly digest (`weeklyDigestService.js`), job-alert polling, GitHub repo re-sync.
- **Circuit breaker** in `jobFetcher.js` to protect upstream APIs.

---

## 🛠 CLI vs Web Quick Reference

Career Pilot is primarily a web app, but the most-used flows are mirrored as frontend "Hubs" and individual routes for fast access.

| Workflow | Route | Hub |
|---|---|---|
| Build / edit a resume | `/resume-builder` | `/resume-hub` |
| AI-enhance a resume | `/enhance` | `/resume-hub` |
| Generate resume from text | `/text-to-resume` | `/resume-hub` |
| Browse resume templates | `/resume-templates` | `/resume-hub` |
| View a shared resume | `/shared/:token` | — |
| Practice a mock interview | `/interview-prep` | `/career-growth-hub` |
| Review past interviews | `/interview-history`, `/interview-replay/:id` | `/career-growth-hub` |
| Search jobs | `/job-search` | `/jobs-hub` |
| Track applications | `/job-tracker` | `/jobs-hub` |
| Manage job alerts | `/job-alerts` | `/jobs-hub` |
| Recruiter outreach | `/outreach` | `/jobs-hub` |
| Generate a cover letter | `/cover-letter` | `/career-growth-hub` |
| Generate cold emails | `/email-generator` | `/career-growth-hub` |
| Optimize LinkedIn | `/linkedin-optimizer`, `/linkedin-dashboard` | `/career-growth-hub` |
| Skill-gap analysis | `/skill-gap` | `/career-growth-hub` |
| Analytics dashboard | `/analytics` | — |
| Build a portfolio | `/portfolio-hub` | `/portfolio-hub` |
| Deploy a portfolio | `/deployments` | `/portfolio-hub` |
| Community channels | `/community` | `/community-hub` |
| Fellowship challenges | `/fellowship/challenges` | `/community-hub` |
| Repo analyzer | `/repo-analyzer/workspace` | — |
| Project visualizer | `/project-visualizer/dashboard` | — |
| GitHub dashboard | `/github-dashboard` | — |
| Security & 2FA | `/security-settings` | — |
| Admin console | `/admin/*` | — |
| Live queue board | `/admin/queues` (Bull-Board) | — |

---

## 📚 Documentation

All long-form documentation lives in `docs/` and at the repo root:

| File | Contents |
|---|---|
| [docs/PROJECT_DOCUMENTATION.md](docs/PROJECT_DOCUMENTATION.md) | Full technical map — frontend/backend, route groups, data models, env vars, local setup, build/test, deployment, security, troubleshooting |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System diagrams and deeper technical flows |
| [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) | MongoDB schema reference for every collection |
| [docs/ai-features.md](docs/ai-features.md) | Multi-provider AI architecture, prompt engineering, skill-gap & trajectory logic |
| [docs/user-guide.md](docs/user-guide.md) | Onboarding walkthrough + FAQ |
| [docs/environment-setup.md](docs/environment-setup.md) | Step-by-step env configuration |
| [docs/deployment-setup.md](docs/deployment-setup.md) | Netlify / Cloudflare / VPS / Docker deployment |
| [docs/creating-portfolio-themes.md](docs/creating-portfolio-themes.md) | How to author a new portfolio theme |
| [docs/cdn-setup.md](docs/cdn-setup.md) | Cloudinary and CDN configuration |
| [docs/component-guide.md](docs/component-guide.md) | Frontend component conventions |
| [docs/portfolio-architecture.md](docs/portfolio-architecture.md) | Deep dive into the portfolio system |
| [API_DOCS/README.md](API_DOCS/README.md) | API documentation index |
| [Real_life_usecase.md](Real_life_usecase.md) | End-to-end user journeys |
| [SECURITY.md](SECURITY.md) | Vulnerability disclosure policy |
| [CONTRIBUTING.md](CONTRIBUTING.md) / [CONTRIBUTION.md](CONTRIBUTION.md) | Contribution guide |
| [CICD_DETECTOR_DOCUMENTATION.md](CICD_DETECTOR_DOCUMENTATION.md) | CI/CD detection internals |

---

## 🧪 Testing

```bash
# Backend
cd backend
npm test                    # Jest
npm run test:watch

# Frontend
cd frontend
npm test                    # Vitest / React Testing Library
npm run test:coverage
```

Tests live in `backend/src/__tests__/`, `backend/src/services/__tests__/`, and `frontend/src/__tests__/`.

---

## 🚢 Deployment

Career Pilot is built to deploy on the platform of your choice:

- **Frontend** — `frontend/dist/` is static; works on Netlify, Vercel, Cloudflare Pages, GitHub Pages, Firebase Hosting, or any Nginx + CDN.
- **Backend** — Node.js process; works on Render, Railway, Fly.io, EC2, GCP Cloud Run, or your own VPS. `Dockerfile` is included.
- **Queues** — Redis 7 (Upstash, Memorystore, or self-hosted).
- **Storage** — Firebase Storage (default), Cloudinary optional.
- **MongoDB** — Atlas recommended; self-hosted works too.

See [docs/deployment-setup.md](docs/deployment-setup.md) and [docs/cdn-setup.md](docs/cdn-setup.md) for full step-by-step instructions.

---

## 🔄 Migrating from Other Tools

Coming from another platform? Career Pilot ships importers that turn your existing footprint into Career Pilot data:

| From | What gets imported |
|---|---|
| **LinkedIn** | `linkedinImporter.js` — profile, headline, experience, education, skills. Maps straight into a new resume. |
| **GitHub** | `githubImporter.js` — public repos, languages, contribution stats; populates Portfolio "Projects" and GitHub Dashboard. |
| **Existing resume PDF** | Drop into Cover Letter generator or Text-to-Resume — AI extracts and structures it. |
| **Other resume builders** | Import JSON or use the Resume Builder wizard to recreate; AI enhancer will close the quality gap. |

After import, run the **AI Enhancer** and **ATS Scorer** to make sure the resume meets Career Pilot's quality bar.

---

## 🛣 Roadmap

- ✅ Multi-provider AI with BYOK
- ✅ 60+ resume templates, 250+ portfolio themes
- ✅ Audio + video mock interviews with avatar
- ✅ Coding round with hidden test execution
- ✅ BullMQ job-alert queue with email tracking
- ✅ Razorpay-powered fellowship challenges
- ✅ Repo analyzer + project visualizer
- 🔲 Native mobile apps (React Native)
- 🔲 Public Skills Hub — share + remix community-built prompts
- 🔲 Recruiter-side portal (companies post challenges, candidates apply)
- 🔲 Interview pair-programming rooms with live coding
- 🔲 Pluggable scraper marketplace
- 🔲 Real-time multi-user resume co-editing (Yjs)

---

## 🧠 Project Notes

- The project is actively developed; expect weekly releases.
- Local-only by default; cloud deploy is opt-in.
- Firebase is the identity layer — configure a Firebase project before first run.
- All AI endpoints are rate-limited per user per route.
- Portfolio HTML is sanitized before serving; you cannot inject scripts.

---

## 🤝 Contributing

We welcome contributions from developers of all levels — from **GSSoC** first-timers to senior engineers.

### Quick start for contributors
```bash
git clone https://github.com/anurag3407/career-pilot.git
cd career-pilot
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Create a feature branch
git checkout -b feature/your-feature

# Make changes, commit, push, open a PR
git add .
git commit -m "feat(resume): add export to DOCX"
git push origin feature/your-feature
```

### Recommended branch names
- `feature/<short-description>`
- `fix/<short-description>`
- `docs/<short-description>`
- `ai/<short-description>`
- `refactor/<short-description>`

### PR checklist
- [ ] Change is described clearly in PR title and description
- [ ] Code passes linting and local tests
- [ ] Environment setup steps documented (if new vars introduced)
- [ ] Breaking changes called out in the description
- [ ] Linked to the issue it closes

### Good first issues
- Documentation improvements for setup or environment variables
- Fixing UI/UX issues on the dashboard or resume builder
- Backend bug fixes around authentication and job search
- Adding a new portfolio theme (see `docs/creating-portfolio-themes.md`)
- Adding a new resume template
- Writing tests for an existing service
- Improving AI prompt quality for a specific workflow

If you are part of GSSoC or a first-time contributor, comment on an issue or open a discussion to request mentorship.

See [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for the full policy.

---

## 👥 Maintainers

<div align="center">
  <table>
    <tr>
      <td align="center">
        <a href="https://github.com/anurag3407">
          <img src="https://github.com/anurag3407.png" width="100" style="border-radius: 50%;" alt="anurag3407"/><br />
          <sub><b>anurag3407</b></sub>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/Mohnish27-dev">
          <img src="https://github.com/Mohnish27-dev.png" width="100" style="border-radius: 50%;" alt="Mohnish27-dev"/><br />
          <sub><b>Mohnish27-dev</b></sub>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/Kaushal00Vaid">
          <img src="https://github.com/Kaushal00Vaid.png" width="100" style="border-radius: 50%;" alt="Kaushal00Vaid"/><br />
          <sub><b>Kaushal00Vaid</b></sub>
        </a>
      </td>
    </tr>
  </table>
</div>

---

## 💬 Community

- 💬 [Discord Community](https://discord.gg/dpDMVywS) — Join our server to chat, ask questions, and share ideas!
- 🐛 [GitHub Issues](https://github.com/anurag3407/career-pilot/issues)
- 📚 [Full Documentation](docs/PROJECT_DOCUMENTATION.md)
- 🌟 Star the repo to follow releases

---

## 📄 License

Career Pilot is open-source under the **MIT License** — see [LICENSE](LICENSE).
