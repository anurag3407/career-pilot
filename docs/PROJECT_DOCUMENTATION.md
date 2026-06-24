# Career Pilot Project Documentation

This document is the high-level technical handbook for the whole Career Pilot repository. Use it with `README.md` for product overview, `ARCHITECTURE.md` for deeper diagrams, `docs/environment-setup.md` for environment variables, `docs/DATABASE_SCHEMA.md` for persistence details, and `API_DOCS/README.md` for endpoint-focused references.

## 1. Product Summary

Career Pilot is a full-stack career platform that helps users create resumes, improve resume content with AI, prepare for interviews, search and track jobs, build portfolio sites, collaborate with the community, and manage career-growth workflows.

Core product areas:

| Area | Main capabilities |
| --- | --- |
| Resume tools | Resume upload, resume builder, AI enhancement, ATS scoring, PDF generation, sharing, versioning, comments, custom sections. |
| Job tools | Job search, saved jobs, kanban-style tracker, alerts, weekly digest, RapidAPI-backed listings, summaries, and notifications. |
| Portfolio tools | AI extraction from resumes, template gallery, portfolio content editing, accessibility checks, sitemap and robots output, deployment helpers. |
| AI tools | Resume enhancement, cover letter generation, email outreach drafts, LinkedIn optimization, skill gap analysis, interview feedback, GitHub intelligence. |
| Community | Channels, posts, comments, direct messages, scheduling, presence, and fellowship workflows. |
| Admin and operations | Admin dashboard, bug reports, login audits, queue dashboard, metrics, rate limiting, security headers, GDPR routes. |

## 2. Repository Layout

```text
career-pilot/
|-- README.md                    # Product overview, quick start, feature summary.
|-- ARCHITECTURE.md              # Architecture diagrams, data flows, security, scaling notes.
|-- package.json                 # Root npm scripts that delegate to frontend.
|-- Docker-compose.yml           # Local multi-service orchestration.
|-- firebase/                    # Firestore and Storage security rules plus indexes.
|-- API_DOCS/                    # API-specific documentation by domain.
|-- docs/                        # User, setup, feature, schema, deployment, and architecture docs.
|-- backend/                     # Express API, Socket.IO server, models, services, routes, workers.
|-- frontend/                    # React 19 + Vite app, UI components, pages, stores, hooks, templates.
|-- scratch/                     # Temporary project artifacts and generated notes.
`-- graphify-out/                # Optional generated knowledge graph when present.
```

Important documentation entry points:

| File | Purpose |
| --- | --- |
| `README.md` | Start here for the project pitch, setup, feature list, and contribution pointers. |
| `docs/PROJECT_DOCUMENTATION.md` | This full-project technical map. |
| `ARCHITECTURE.md` | System diagrams, service responsibilities, data flow diagrams, and infrastructure view. |
| `docs/environment-setup.md` | Local, staging, and production environment variable guidance. |
| `docs/user-guide.md` | End-user walkthrough with screenshots. |
| `docs/DATABASE_SCHEMA.md` | Database collections and persistence contracts. |
| `docs/portfolio-architecture.md` | Portfolio builder architecture and lifecycle. |
| `docs/creating-portfolio-themes.md` | How to add portfolio templates. |
| `API_DOCS/README.md` | API documentation index. |
| `SECURITY.md` | Security reporting and vulnerability handling. |
| `CONTRIBUTING.md` / `CONTRIBUTION.md` | Contributor workflow and community guidance. |

## 3. Runtime Architecture

Career Pilot has a React frontend, an Express backend, and several external services.

```text
Browser
  |
  | React Router pages, Firebase client auth, Socket.IO client
  v
Frontend (Vite dev server or static hosting)
  |
  | REST API calls and WebSocket events
  v
Backend (Express + Socket.IO)
  |
  |-- MongoDB: application data, resumes, portfolios, jobs, alerts, logs
  |-- Redis: queues, rate limiting support, background jobs, BullMQ dashboard
  |-- Firebase Admin: token verification and Firebase integration
  |-- External AI providers: Gemini, OpenAI, Groq, Anthropic, OpenRouter-compatible flows
  |-- RapidAPI/JSearch and scrapers: job search inputs
  |-- SMTP/Nodemailer: email alerts, outreach, weekly digest
  `-- Deployment APIs: portfolio publishing workflows
```

Primary backend boot sequence:

1. Load environment variables and validate key production requirements.
2. Configure Express middleware: metrics, compression, CORS, security headers, rate limiting, body parsers.
3. Register health, metrics, Swagger, auth, resume, job, portfolio, AI, admin, and utility routes.
4. Connect to MongoDB and optionally start GitHub portfolio sync cron.
5. Start the HTTP server and initialize Socket.IO.
6. Initialize community defaults, schedulers, job fetchers, digest queues, and outreach workers.
7. Handle shutdown signals by closing Redis-managed resources before process exit.

## 4. Frontend Application

Location: `frontend/`

Technology stack:

| Layer | Implementation |
| --- | --- |
| UI runtime | React 19 |
| Build system | Vite |
| Routing | React Router 7 |
| Styling | TailwindCSS 4 plus project CSS variables |
| State | React context, hooks, and Zustand stores |
| Realtime | Socket.IO client |
| Forms | React Hook Form and custom components |
| Data visualization | Chart.js, Recharts, cobe, xyflow, dagre |
| Testing | Vitest and Testing Library |

Key frontend directories:

| Path | Responsibility |
| --- | --- |
| `frontend/src/App.jsx` | Main route tree, auth route wrappers, layout composition, command palette binding. |
| `frontend/src/main.jsx` | React entry point. |
| `frontend/src/pages/` | Route-level screens such as Dashboard, Upload, Enhance, Jobs, Interview, Admin, Hubs, Analyzer. |
| `frontend/src/components/` | Reusable UI and feature components. |
| `frontend/src/components/ui/` | Primitive UI elements and shared styling utilities. |
| `frontend/src/components/community/` | Community channels, posts, messaging, scheduling, comments. |
| `frontend/src/components/jobs/` | Job tracker and mobile kanban UI pieces. |
| `frontend/src/components/portfolio/` | Portfolio editor, deployment, accessibility, social links, theme selection. |
| `frontend/src/components/portfolio/templates/` | React portfolio template implementations. |
| `frontend/src/context/` | App-wide providers including auth, sockets, and theme. |
| `frontend/src/hooks/` | Reusable hooks, including auth-facing hooks. |
| `frontend/src/services/` | API client modules and service wrappers. |
| `frontend/src/stores/` | Zustand stores. |
| `frontend/src/utils/` | Shared utility functions. |
| `frontend/src/__tests__/` and nested `__tests__` | Frontend test coverage. |
| `frontend/public/` | Static assets, service worker files, redirects, template preview assets. |

Main route groups:

| Route group | Examples | Notes |
| --- | --- | --- |
| Public | `/`, `/login`, `/register`, `/privacy`, `/terms`, `/cookies`, `/templates` | Public routes use `PublicRoute` where logged-in users should be redirected to the dashboard. |
| Auth callbacks | `/auth/linkedin/callback`, `/auth/openrouter/callback` | OAuth/provider callback handlers. |
| Resume | `/upload`, `/resume-builder`, `/text-to-resume`, `/enhance/:resumeId`, `/resume/:resumeId`, `/shared/:shareToken` | Protected except shared resume views. |
| Jobs | `/jobs`, `/job-alerts`, `/job-tracker` | Search, alerts, and tracked application workflow. |
| AI and career | `/interview-prep`, `/interview-history`, `/email-generator`, `/linkedin-optimizer`, `/skill-gap`, `/cover-letter` | AI-assisted career tools. |
| Community | `/community`, `/hub/community`, `/fellowship/*` | Community and fellowship workflows. |
| Portfolio | `/hub/portfolio`, `/deployments`, `/templates/*`, `/preview/:templateId` | Template browsing, previewing, editing, and deployment. |
| Developer intelligence | GitHub dashboard, LinkedIn dashboard, repo analyzer, project visualizer | Repository and profile intelligence tools. |
| Admin | `/admin`, `/admin/users`, `/admin/logins`, `/admin/bugs` | Protected by login on the client; backend must enforce authorization. |

Frontend development commands:

```bash
cd frontend
npm install
npm run dev
npm run build
npm run test
npm run lint
npm run preview
```

Root scripts delegate to the frontend:

```bash
npm install        # npm install --prefix frontend
npm run build     # npm run build --prefix frontend
npm run build:portfolio
```

## 5. Backend Application

Location: `backend/`

Technology stack:

| Layer | Implementation |
| --- | --- |
| Runtime | Node.js 18+ with ES modules |
| HTTP framework | Express 4 |
| Realtime | Socket.IO |
| Database | MongoDB via Mongoose |
| Queue/cache | Redis and BullMQ |
| Auth | Firebase Admin token verification plus local auth-related middleware/services |
| AI providers | Google Gemini, OpenAI, Groq, Anthropic, OpenRouter-compatible provider config |
| File handling | Multer, Cloudinary, PDF parsing/generation, image optimization |
| Email | Nodemailer and queue-backed notification services |
| Docs | Swagger UI at `/api/docs` |
| Metrics | Prometheus-compatible `/metrics` endpoint |
| Testing | Node test runner for backend unit tests |

Key backend directories:

| Path | Responsibility |
| --- | --- |
| `backend/src/index.js` | Express app setup, middleware, route registration, server startup, background initialization. |
| `backend/src/config/` | Database, Redis, Firebase, Socket.IO, Swagger, AI provider configuration. |
| `backend/src/controllers/` | Request-facing controller functions for selected route groups. |
| `backend/src/routes/` | Express routers grouped by feature/domain. |
| `backend/src/middleware/` | Auth, validation, upload handling, metrics, compression, CSP, rate limiting, pagination, errors. |
| `backend/src/models/` | Mongoose models for users, resumes, jobs, portfolios, alerts, interviews, logs, and related entities. |
| `backend/src/schemas/` | Request validation schemas for auth, resume, jobs, payments, profile, 2FA, community, and AI flows. |
| `backend/src/services/` | Business logic, AI integrations, queues, scrapers, deployers, email, PDF, GitHub, LinkedIn, portfolio, and analysis services. |
| `backend/src/templates/` | Email templates and server-side portfolio templates. |
| `backend/src/utils/` | Sanitization, diffing, config safety, email config, favicon utilities. |
| `backend/src/__tests__/` and nested `__tests__` | Backend tests. |
| `backend/scripts/` | Operational scripts such as password migration and email/screenshot verification. |
| `backend/tests/` | Additional integration or template tests. |

Registered backend route prefixes:

| Prefix | Domain |
| --- | --- |
| `/health` | Health check. |
| `/metrics` | Prometheus metrics. |
| `/api/docs` | Swagger UI. |
| `/api/auth` | Authentication. |
| `/api/auth/2fa` | Two-factor authentication. |
| `/api/upload` | Resume and input upload handling. |
| `/api/resumes` | Resume CRUD, sharing, versions, comments, and related operations. |
| `/api/enhance` | Resume enhancement and AI resume operations. |
| `/api/cover-letter` | Cover letter generation. |
| `/api/fetchjobs` | Job search/fetching. |
| `/api/job-tracker` | Saved and tracked jobs. |
| `/api/job-alerts` | Job alerts and notifications. |
| `/api/community` | Community channels, messages, posts, comments. |
| `/api/fellowship` | Fellowship challenges, proposals, onboarding, chat. |
| `/api/interview` | Interview preparation, sessions, history, replay, analysis. |
| `/api/recruiter` | Recruiter-facing flows. |
| `/api/outreach` | Outreach queue and email workflows. |
| `/api/bugs` | Bug report workflow. |
| `/api/collaboration` | Resume collaboration features. |
| `/api/payments` | Payments, loaded dynamically when route dependencies are available. |
| `/api/portfolio` | Portfolio generation, templates, content, public assets, deploy flows. |
| `/api/user-profiles` | User profile management. |
| `/api/gdpr` | GDPR export/delete/privacy operations. |
| `/api/search` | Search API. |
| `/api/ai` | AI utility routes. |
| `/api/email-tracking` | Email tracking and analytics. |
| `/api/analyzer` | Repository analyzer. |
| `/api/project-visualizer` | Project visualizer. |
| `/api/admin` | Admin APIs. |
| `/api/admin/queues` | Bull board queue UI/routes. |

Backend development commands:

```bash
cd backend
npm install
npm run dev
npm start
npm test
npm run lint
```

## 6. Data Model Overview

Career Pilot uses MongoDB for primary application persistence and Firebase for auth plus selected realtime/community capabilities.

Common MongoDB model groups:

| Group | Representative models |
| --- | --- |
| Users and auth | `User`, `UserProfile`, `TwoFactor`, `LoginAttempt`, `LoginLog`. |
| Resumes | `Resume`, `ResumeVersion`, `ResumeComment`, `ResumeShare`, `ResumeAtsHistory`. |
| Jobs | `Job`, `JobListing`, `JobAlert`, `TrackedJob`, `NotificationLog`. |
| Portfolio | `Portfolio`, `PortfolioVersion`, `ProjectAnalysis`, `RepoAnalysisHistory`. |
| Community and fellowship | `Challenge`, `FellowshipProfile`, `FellowshipChat`, `Proposal`. |
| Communications | `EmailLog`, `Outreach`, notification service records. |
| Operations | `Bug`, `TokenUsage`, metrics/log support models. |

Firestore is used for Firebase-backed user/community data such as users, channels, realtime message data, and presence-like workflows. Keep Firebase rules in `firebase/firestore.rules` and `firebase/storage.rules` aligned with backend assumptions.

For exact schemas, indexes, and field-level details, use `docs/DATABASE_SCHEMA.md` and model files in `backend/src/models/`.

## 7. Authentication and Authorization

Authentication layers:

1. Firebase client auth signs users in on the frontend.
2. Frontend sends Firebase tokens in `Authorization` headers for protected API calls.
3. Backend middleware such as `verifyToken` validates the token with Firebase Admin.
4. Client route guards redirect unauthenticated users away from protected pages.
5. Server routes must still enforce authorization even when the frontend hides UI.

Important guidance:

- Treat frontend route protection as UX only, not security.
- Do not expose service credentials or server-only API keys in `VITE_` variables.
- Keep `DEV_BYPASS_AUTH` disabled outside explicit local testing.
- Keep 2FA backup codes and TOTP secrets server-side only.

## 8. AI Provider Architecture

AI features are spread across backend services and frontend pages/components.

Provider sources include:

| Provider/config | Typical use |
| --- | --- |
| Google Gemini | Resume enhancement, ATS analysis, content generation, interview support. |
| OpenAI | Optional AI provider for generation flows. |
| Groq | Optional AI provider for fast generation flows. |
| Anthropic | Optional provider through backend SDK usage. |
| OpenRouter | User/provider callback and configurable model access. |

AI implementation guidance:

- Keep provider-specific key handling on the backend unless a feature intentionally supports user-supplied client-side keys.
- Prefer schema validation for all AI request payloads.
- Fail gracefully when a provider key is absent; the app already logs development warnings for missing keys.
- Sanitize or validate AI-generated portfolio HTML/content before persistence or rendering.
- Add tests around prompt builders, response parsers, and fallbacks when changing AI services.

## 9. Resume System

Resume workflow:

1. User uploads a PDF or creates a resume from text/form inputs.
2. Backend extracts text from uploaded files and validates the upload.
3. User selects target role, experience, skills, industry, or custom instructions.
4. AI services enhance the resume, generate summaries, and produce ATS feedback.
5. Resume data is stored in MongoDB with versions and optional share tokens.
6. Frontend renders previews, allows editing/reordering sections, and exports/shares output.

Important modules:

| Module | Responsibility |
| --- | --- |
| `backend/src/routes/upload.js` | PDF upload and text extraction endpoint. |
| `backend/src/routes/resume.js` | Resume data routes. |
| `backend/src/routes/enhance.js` | AI enhancement routes. |
| `backend/src/services/pdfGenerator.js` | PDF generation. |
| `backend/src/services/atsScorer.js` | ATS scoring. |
| `backend/src/services/keywordOptimizer.js` | Keyword optimization support. |
| `frontend/src/pages/Upload*` and `frontend/src/pages/Enhance*` | User-facing upload and enhancement experiences. |
| `frontend/src/pages/ResumeBuilder*` | Resume creation/editing experience. |

## 10. Job Search, Tracking, and Alerts

Job workflow:

1. User searches for jobs or configures alerts.
2. Backend fetches listings from RapidAPI/JSearch and scraper services where applicable.
3. User saves jobs into the tracker.
4. Alerts and digest workers process matching jobs in the background.
5. Email and realtime notifications notify the user.
6. Application status is tracked through kanban-style UI.

Important modules:

| Module | Responsibility |
| --- | --- |
| `backend/src/routes/jobsRoute.js` | Job fetch/search routes. |
| `backend/src/routes/jobTracker.js` | Tracked job routes. |
| `backend/src/routes/jobAlerts.js` | Alert configuration and processing routes. |
| `backend/src/services/jobFetcher.js` | Job fetcher initialization and retrieval logic. |
| `backend/src/services/jobAlertQueue.js` | Queue-backed alert processing. |
| `backend/src/services/weeklyDigestService.js` | Weekly digest scheduling and worker logic. |
| `backend/src/services/scrapers/` | Scraper abstraction and provider-specific scrapers. |
| `frontend/src/pages/JobSearch*` | Search page. |
| `frontend/src/pages/JobTracker*` and `frontend/src/components/jobs/` | Tracker UI. |

## 11. Portfolio System

Portfolio workflow:

1. User selects a template or generates content from resume data.
2. Backend AI services extract portfolio sections or enhance existing content.
3. Frontend editor customizes sections, social links, theme, and deploy settings.
4. Backend validates slug/content, sanitizes HTML, and saves portfolio records.
5. Public routes serve sitemap, robots.txt, and accessibility report data.
6. Deploy services publish to supported providers.

Important modules:

| Module | Responsibility |
| --- | --- |
| `backend/src/routes/portfolio.js` | Main portfolio REST API. |
| `backend/src/services/portfolioTemplateEngine.js` | Template processing. |
| `backend/src/services/deploy/` | Provider-specific deployment implementations. |
| `backend/src/services/ai/portfolioExtractor.js` | AI extraction from resume content. |
| `backend/src/services/ai/portfolioContentEnhancer.js` | AI content improvement. |
| `backend/src/templates/portfolio/` | Server-side portfolio template assets and metadata. |
| `frontend/src/components/portfolio/` | Editor, deployment modal, accessibility report, preview frame. |
| `frontend/src/components/portfolio/templates/` | React-based portfolio templates. |
| `docs/creating-portfolio-themes.md` | Contributor guide for new themes. |

## 12. Community and Fellowship

Community features include channels, posts, comments, direct messages, scheduled posts, presence-like updates, and fellowship challenge flows.

Important modules:

| Module | Responsibility |
| --- | --- |
| `backend/src/routes/community.js` | Community routes. |
| `backend/src/controllers/communityFirebaseController.js` | Firebase-backed community initialization and logic. |
| `backend/src/services/presenceService.js` | Presence state support. |
| `backend/src/services/postScheduler.js` | Scheduled post initialization and processing. |
| `backend/src/routes/fellowships.js` | Fellowship routes. |
| `frontend/src/pages/Community*` | Community route page. |
| `frontend/src/components/community/` | Community UI components. |
| `frontend/src/pages/fellowship/` | Fellowship pages. |

## 13. Admin, Monitoring, and Operations

Operational surfaces:

| Surface | Location |
| --- | --- |
| Health check | `GET /health` |
| Metrics | `GET /metrics` |
| Swagger API docs | `GET /api/docs` |
| Queue dashboard | `/api/admin/queues` |
| Admin UI | Frontend `/admin` routes |
| Bug reports | `/api/bugs` and admin bug views |
| Login audit | Admin login views and login log models |
| GDPR tools | `/api/gdpr` and `docs/GDPR_API.md` |

Operational guidance:

- Use `/health` for simple uptime checks.
- Use `/metrics` for Prometheus-compatible scraping.
- Keep queue dashboards behind backend authorization.
- Check Redis connectivity before enabling queue-heavy features.
- Validate email configuration at startup so alert failures are visible early.

## 14. Environment Variables

Environment files are split by app:

```text
backend/.env    # server-only secrets and integration credentials
frontend/.env   # Vite-exposed client configuration only
```

Backend variables commonly used by the project:

| Variable | Purpose |
| --- | --- |
| `PORT` | Backend HTTP port. |
| `NODE_ENV` | Runtime environment: development, staging, production, test. |
| `FRONTEND_URL` | Allowed frontend origin for CORS and CSP. Required in production. |
| `MONGODB_URI` | MongoDB connection string. |
| `REDIS_URL` | Redis connection string for queues/cache features. |
| `FIREBASE_PROJECT_ID` | Firebase project used by Admin SDK. |
| `FIREBASE_SERVICE_ACCOUNT_PATH` or equivalent service credentials | Firebase Admin authentication. |
| `GEMINI_API_KEY` | Google Gemini AI provider. |
| `OPENAI_API_KEY` | OpenAI provider. |
| `GROQ_API_KEY` | Groq provider. |
| `ANTHROPIC_API_KEY` | Anthropic provider where enabled. |
| `RAPIDAPI_KEY` | Job search integration. |
| `EMAIL_*` / SMTP variables | Nodemailer email delivery. |
| `RAZORPAY_*` | Payment integration. |
| `TOTP_ENCRYPTION_KEY` | 2FA secret encryption. |
| `DEV_BYPASS_AUTH` | Local-only bypass flag; keep false outside development. |
| `ENABLE_GITHUB_SYNC_CRON` | Enables/disables portfolio GitHub sync cron. |
| `ALLOW_DEV_DB_MUTATIONS` | Enables selected development data mutation helpers. |

Frontend variables commonly used by the project:

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | Backend base URL. |
| `VITE_API_BASE` | Backend API base, commonly `${VITE_API_URL}/api`. |
| `VITE_FIREBASE_API_KEY` | Firebase web API key. |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain. |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID. |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket. |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase sender ID. |
| `VITE_FIREBASE_APP_ID` | Firebase app ID. |
| `VITE_FIREBASE_MEASUREMENT_ID` | Analytics measurement ID. |
| `VITE_MAX_SIZE_MB` | Upload size limit used by the client. |

Rules:

- Never commit `.env` files.
- Never put server-only secrets in `VITE_` variables.
- Use placeholders in example files, not realistic-looking credentials.
- In production, set variables directly in the hosting provider dashboard.

## 15. Local Development Setup

Prerequisites:

- Node.js 18 or newer.
- npm 10 or compatible npm version.
- MongoDB instance or hosted MongoDB URI.
- Redis instance for queues and realtime/background features.
- Firebase project for authentication and Firebase-backed data.
- Optional provider credentials for AI, jobs, email, payments, Cloudinary, and deployment services.

Suggested setup:

```bash
git clone <repository-url>
cd career-pilot
npm install
cd backend && npm install
cd ../frontend && npm install
```

Create env files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Run both apps in separate terminals:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

Default local URLs:

| Service | URL |
| --- | --- |
| Frontend | `http://localhost:5173` |
| Backend | `http://localhost:5000` or configured `PORT` |
| Health | `http://localhost:5000/health` |
| Swagger | `http://localhost:5000/api/docs` |
| Metrics | `http://localhost:5000/metrics` |

## 16. Build, Test, and Quality Checks

Recommended checks before opening a pull request:

```bash
npm run build
```

```bash
cd frontend
npm run test
npm run lint
npm run build
```

```bash
cd backend
npm test
npm run lint
```

Notes:

- Root `npm run build` builds the frontend only.
- Backend tests currently use Node's built-in test runner for selected schema/config tests.
- Frontend tests use Vitest.
- Linting may include pre-existing repository warnings; avoid unrelated cleanup unless the task requires it.
- When changing docs only, run at least `npm run build` if feasible so documentation changes do not hide broken generated imports or route errors.

## 17. Deployment Overview

Frontend deployment:

- Build with `npm run build --prefix frontend`.
- Static output is generated under `frontend/dist`.
- `vercel.json`, `firebase.json`, Netlify redirects, and frontend nginx config support multiple hosting targets.

Backend deployment:

- Build step is usually dependency installation; runtime starts with `node src/index.js`.
- Set production environment variables in the hosting dashboard.
- Ensure `FRONTEND_URL` is an origin URL without path/query/hash.
- Provide MongoDB, Redis, Firebase Admin, email, AI provider, and job provider credentials as needed.
- Expose `/health` for platform health checks.

Portfolio deployment:

- Server deploy services support provider-specific publishing flows under `backend/src/services/deploy/`.
- Portfolio pages rely on sanitized content, slug validation, and template assets.
- Public portfolio metadata includes sitemap and robots routes.

## 18. Security Checklist

Before production deploy:

- `FRONTEND_URL` is set and valid.
- CORS allowed origins are limited to trusted frontend domains.
- `DEV_BYPASS_AUTH=false`.
- `.env` files are not committed.
- Firebase rules are deployed and match the backend data model.
- Queue dashboards and admin routes require server-side authorization.
- Rate limiting is enabled for `/api/` routes.
- Helmet/CSP changes are tested against login, OAuth, Firebase, Socket.IO, and template previews.
- Server logs use presence-only secret reporting and never print raw keys.
- Uploaded files are validated by type and size.
- AI-generated HTML/content is sanitized before rendering or publishing.
- Payment keys use test mode outside production and live mode only in production.

## 19. Contribution Workflow

1. Create a feature branch from `main`.
2. Read existing docs and nearby code before editing.
3. Keep changes scoped to the issue or feature.
4. Add or update tests when behavior changes.
5. Update documentation when routes, env vars, data models, or setup steps change.
6. Run relevant checks.
7. Open a PR with a concise summary, test results, screenshots for UI changes, and migration notes if needed.

Branch naming examples:

```text
feature/resume-version-compare
fix/job-alert-deduplication
docs/portfolio-template-guide
```

## 20. Common Development Tasks

Add a backend route:

1. Create or update a router in `backend/src/routes/`.
2. Add validation schema in `backend/src/schemas/` if the route accepts input.
3. Add controller/service logic in `backend/src/controllers/` or `backend/src/services/`.
4. Register the route prefix in `backend/src/index.js`.
5. Add tests for schema, service, or route behavior.
6. Update API docs and this project documentation if the route is public.

Add a frontend page:

1. Create the page in `frontend/src/pages/`.
2. Add reusable components under `frontend/src/components/` when needed.
3. Add API methods under `frontend/src/services/`.
4. Register a route in `frontend/src/App.jsx`.
5. Add loading, empty, error, and auth states.
6. Add or update tests.
7. Update user docs if the feature is user-facing.

Add a portfolio template:

1. Read `docs/creating-portfolio-themes.md`.
2. Add frontend template components under `frontend/src/components/portfolio/templates/` if it is React-rendered.
3. Add backend template assets under `backend/src/templates/portfolio/` if it is server-rendered/deployable.
4. Include preview assets and metadata.
5. Register the template in the gallery/configuration used by the app.
6. Test preview, editor behavior, accessibility, and deployment output.

Add an AI feature:

1. Decide whether the provider call belongs on the backend or can use a user-supplied client key.
2. Add request validation and size limits.
3. Create provider-neutral service functions where possible.
4. Handle missing provider keys gracefully.
5. Sanitize model output when rendering HTML or markdown.
6. Add tests for prompt construction, parser behavior, and provider fallback.
7. Document env vars and user-facing behavior.

## 21. Troubleshooting

| Symptom | Checks |
| --- | --- |
| Frontend cannot call backend | Confirm `VITE_API_URL`, backend port, CORS `FRONTEND_URL`, and browser console network errors. |
| Login fails | Confirm Firebase web config, backend Firebase Admin credentials, token headers, and auth middleware logs. |
| AI buttons fail | Confirm provider key exists, provider headers are correct, request body matches schema, and backend logs show provider-specific errors. |
| Job alerts do not send | Confirm Redis, MongoDB, email config, job alert active status, queue worker startup, and RapidAPI key. |
| Socket events do not arrive | Confirm Socket.IO server initialized, frontend socket provider uses the correct backend URL, CORS allows the origin, and auth token is valid. |
| Portfolio deployment fails | Confirm provider token, slug validity, template assets, sanitized content, and provider-specific deploy logs. |
| Build fails on imports | Check route imports in `frontend/src/App.jsx`, template file names, and case sensitivity. |
| Production startup fails | Confirm `FRONTEND_URL` exists and is an origin URL; check MongoDB, Redis, Firebase Admin, and email configuration. |
| Admin pages load but APIs fail | Remember client-side admin checks are not authorization; inspect backend admin route authorization and token claims. |

## 22. Documentation Maintenance

Update documentation whenever one of these changes:

- Public route, API route, or route prefix.
- Environment variable name or required provider credential.
- Database model fields, indexes, or ownership rules.
- Authentication or authorization behavior.
- Queue, cron, or background worker behavior.
- Deployment provider, build command, or runtime requirement.
- Portfolio template creation workflow.
- User-facing feature behavior.

Preferred doc destinations:

| Change type | Destination |
| --- | --- |
| Product overview | `README.md` |
| Whole-project technical map | `docs/PROJECT_DOCUMENTATION.md` |
| API contract | `API_DOCS/` and Swagger annotations/config |
| Environment variable | `docs/environment-setup.md` and `.env.example` files |
| Data model | `docs/DATABASE_SCHEMA.md` |
| Architecture or flow | `ARCHITECTURE.md` |
| User-facing workflow | `docs/user-guide.md` |
| Portfolio theme workflow | `docs/creating-portfolio-themes.md` |
| Security-sensitive behavior | `SECURITY.md` plus relevant setup docs |
