# Career Pilot Project Documentation

This document is the high-level technical handbook for the whole Career Pilot repository. Use it with `README.md` for the product overview, `ARCHITECTURE.md` for deeper diagrams, `docs/environment-setup.md` for environment variables, `docs/DATABASE_SCHEMA.md` for persistence details, and `API_DOCS/README.md` for endpoint references.

**Last updated:** 2026-11-28.

## 1. Product Summary

Career Pilot is a full-stack career platform: resumes, AI enhancement, mock interviews, job search and tracking, portfolio publishing, GitHub intelligence, outreach, community and fellowships.

| Area | Main capabilities |
| --- | --- |
| Resume tools | Upload/text-to-resume, builder, AI enhancement, ATS scoring, PDF export, sharing, versioning, 60 templates. |
| Job tools | JSearch-powered search, kanban tracker, application packets, follow-up calendar, alerts, weekly digest. |
| Portfolio tools | 262 React templates, AI extraction, section editor, accessibility checks, sitemap/robots, deploys to Cloudflare Pages / Netlify / GitHub Pages. |
| AI tools | Resume enhancement, cover letters, outreach drafts, LinkedIn optimizer, skill-gap analysis, interview feedback, GitHub intelligence. 30 providers with BYOK. |
| Community | Channels, posts, comments, DMs, scheduled posts, fellowship challenges (Express/Appwrite path). |
| Admin/ops | Admin dashboard, bug reports, login audits, queue dashboard, metrics, rate limiting, GDPR, 2FA (Express path). |

## 2. Repository Layout

```text
career-pilot/
|-- README.md                    # Product overview, quick start, feature summary
|-- ARCHITECTURE.md              # Current architecture, flows, security, deployment
|-- API_DOCS/                    # Gateway + Express API reference
|-- docs/                        # This handbook + setup, schema, portfolio, AI docs
|-- frontend/                    # React 19 + Vite 7 SPA (Cloudflare Pages)
|-- worker/                      # Cloudflare Worker gateway: auth, D1 CRUD, AI, jobs, ImageKit
|-- backend/                     # Optional Express API for self-hosted extras
|-- extension/                   # Chrome MV3 job tracker
|-- supabase/                    # Legacy Supabase migrations (pre-D1)
|-- scripts/                     # verify-deploy.mjs, gateway smoke checks
|-- .github/workflows/           # ci-cd.yml, security.yml, release.yml
|-- docker-compose.yml           # Legacy self-hosted stack (frontend + backend + Mongo + Redis)
`-- package.json                 # Root scripts delegating to frontend/backend
```

Important documentation entry points:

| File | Purpose |
| --- | --- |
| `README.md` | Product pitch, setup, features, routes. |
| `docs/README.md` | Documentation index and freshness map. |
| `docs/PROJECT_DOCUMENTATION.md` | This full-project technical map. |
| `ARCHITECTURE.md` | System diagrams, flows, data/security/deployment architecture. |
| `docs/DATABASE_SCHEMA.md` | D1 tables, columns, indexes, legacy schemas. |
| `docs/UNIFIED_PLATFORM.md` | Cloudflare Pages + Worker + D1 architecture and runbook. |
| `docs/APPLICATION_PACKETS.md` | Packet/calendar workflow. |
| `docs/environment-setup.md` | Environment variable matrix. |
| `API_DOCS/README.md` | API index (gateway + Express). |
| `API_DOCS/gateway.md` | Gateway Worker endpoint reference. |
| `SECURITY.md` | Vulnerability disclosure policy. |
| `CONTRIBUTING.md` | Contributor workflow. |

## 3. Runtime Architecture

Two runtime paths share one repository.

### Live path (Cloudflare)

```text
Browser (React SPA on Cloudflare Pages)
  |
  | /gateway/v1/*  (same-origin proxy or absolute Worker URL)
  v
Cloudflare Worker "careerpilot-gateway"  (worker/src/index.js)
  |-- worker/src/auth.js  → D1 users/profiles/auth_sessions/oauth_states
  |-- worker/src/db.js    → D1 CRUD for every platform table
  |-- AI router           → Workers AI binding, Gemini, Anthropic, 26 OpenAI-compatible providers
  |-- RapidAPI JSearch    → /v1/jobs/search
  |-- ImageKit            → /v1/imagekit/auth, /v1/imagekit/upload
  `-- /v1/health
  |
  v
Cloudflare D1 "careerpilot-db" (binding DB)
```

Auth, profiles, resume/job/portfolio/career/interview CRUD, settings,
notifications and generic AI generation run on this path. The feature-specific
AI prompts (resume enhance, interview question/feedback generation, roast,
cover-letter/LinkedIn/README generation) and PDF/portfolio deploy still call
the Express `/api` endpoints; see [section 5](#5-backend-application).

### Optional path (Express)

```text
Browser
  |
  | /api/*  (VITE_API_BASE)
  v
Express 4 + Socket.IO (backend/src/index.js)
  |-- MongoDB (Mongoose): legacy feature data
  |-- Redis + BullMQ: queues, cache, Socket.IO adapter
  |-- Appwrite: community/fellowship (legacy)
  |-- Supabase/Clerk: legacy auth fallback
  |-- Puppeteer/PDFKit: resume PDFs
  |-- Deploy services: Cloudflare Pages / Netlify / GitHub Pages
  `-- Razorpay, Nodemailer, GitHub/LinkedIn integrations
```

It authenticates D1 JWTs with `verifyD1Token` (local HMAC check or
`/v1/auth/verify`), then falls back to Supabase and Clerk. CI builds and tests
the backend but does not deploy it.

## 4. Frontend Application

Location: `frontend/`

| Layer | Implementation |
| --- | --- |
| UI runtime | React 19 |
| Build | Vite 7 (`vite.config.js`) + standalone portfolio build (`vite.standalone.config.js`) |
| Routing | React Router 7 (`frontend/src/App.jsx`) |
| Styling | TailwindCSS 4 + project CSS variables |
| State | React context + Zustand (`useAIConfigStore`, `useGithubConfigStore`, …) |
| Auth | `context/AuthProvider.jsx` → `config/d1.js` (`d1Auth`) |
| Data | `services/api.js` → `services/d1Data.js` (D1) or `/api` (Express extras) |
| AI | `services/aiGateway.js` → `/gateway/v1/ai/*` |
| Uploads | `services/imagekit.js` (gateway signature, direct ImageKit upload) |
| PDF text | `utils/pdfExtract.js` (pdfjs-dist, client-side) |
| PDF output | `services/atsPdfExport.js` (jsPDF/html2canvas) |
| Tests | Vitest + Testing Library |
| PWA | `vite-plugin-pwa` + `pwaOptions.js` |

Key directories:

| Path | Responsibility |
| --- | --- |
| `src/pages/` | Route screens: Dashboard, ResumeBuilder, Enhance, JobTracker, PortfolioStudio, hubs, fellowship, admin. |
| `src/components/` | UI and feature components. |
| `src/components/resume/templates/` | 60 resume templates. |
| `src/components/portfolio/templates/` | 262 portfolio templates (folder per template with `index.jsx`). |
| `src/context/` | Auth, Socket, Theme, Portfolio, Resume providers. |
| `src/services/` | API facade, D1 data layer, AI gateway, ImageKit, PDF export. |
| `src/stores/` | Zustand stores (AI provider config, GitHub config). |
| `frontend/src/data/portfolioTemplates.jsx` | Filesystem-derived template registry (`import.meta.glob`). |
| `src/standalone/` | Standalone portfolio bundle entry. |
| `src/utils/` | PDF extraction, sanitizers, export helpers. |
| `public/` | `_redirects`, `_headers`, icons, template previews. |

Main route groups (see `frontend/src/App.jsx` for the full tree):

| Group | Examples |
| --- | --- |
| Public marketing/tools | `/`, `/resume-builder`, `/portfolio-builder`, `/resume-roast`, `/github-portfolio`, `/project-visualizer`, `/job-finder`, `/mock-interview`, `/recruiters`, `/readme-generator`, `/templates`, `/pricing` |
| Legal | `/privacy`, `/terms`, `/cookies`, `/about` |
| Auth | `/login`, `/register`, `/auth/callback`, `/auth/openrouter/callback`, `/auth/github/callback` |
| Protected tools | `/dashboard`, `/dashboard/analytics`, `/upload`, `/resume-builder/build`, `/text-to-resume`, `/enhance/:resumeId`, `/resume/:resumeId`, `/resume-templates`, `/job-finder/search`, `/job-tracker`, `/job-alerts`, `/community`, `/mock-interview/practice`, `/interview-history`, `/profile`, `/security`, `/linkedin-optimizer`, `/skill-gap`, `/salary-estimate`, `/career-profile`, `/email-generator`, `/career-path`, `/outreach`, `/deployments`, `/resume-roast/analyze`, `/github-portfolio/build`, `/settings`, `/portfolio-builder/studio`, `/project-visualizer/analyze` |
| Hubs | `/hub/resume`, `/hub/roast`, `/hub/portfolio`, `/hub/portfolio/github`, `/hub/jobs`, `/hub/career`, `/hub/community` |
| Dashboards | `/github`, `/linkedin`, `/project-visualizer/dashboard/:sessionId` |
| Fellowship | `/fellowship/*` (challenges, proposals, messages, verify) |
| Admin | `/admin`, `/admin/users`, `/admin/logins`, `/admin/bugs` |
| Public shares | `/shared/:shareToken`, `/roast/:shareToken`, `/preview/:templateId` (plus per-theme `/templates/<name>` demo routes) |

Frontend commands:

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
npm run build        # SPA + standalone portfolio bundle
npm run build:portfolio
npm test             # vitest run
npm run lint
npm run preview
```

## 5. Backend Application

Location: `backend/` (optional; only needed for self-hosted extras)

| Layer | Implementation |
| --- | --- |
| Runtime | Node.js 22+, ES modules |
| HTTP | Express 4 |
| Realtime | Socket.IO 4 |
| Primary DB | MongoDB via Mongoose 9 (legacy features) |
| D1 bridge | `config/d1.js` (gateway verify + REST/gateway queries) |
| Queue/cache | Redis 7, BullMQ, Bull-Board |
| Auth | D1 JWT → Supabase → Clerk fallback (`middleware/auth.js`) |
| AI | Provider registry in `config/aiProviders.js`, SDKs for Gemini/OpenAI/Groq/Anthropic |
| Files | Multer, Cloudinary, PDF parsing/generation, Sharp |
| Email | Nodemailer + queue-backed services |
| Docs | Swagger UI at `/api/docs` |
| Metrics | Prometheus `/metrics` (outside `/api`) |
| Tests | Node's built-in test runner |

Registered route prefixes (`backend/src/index.js`):

| Prefix | Domain |
| --- | --- |
| `/health` | Health check. |
| `/metrics` | Prometheus metrics. |
| `/api/docs` | Swagger UI. |
| `/api/webhooks` | Payment/webhook handlers. |
| `/api/auth` | Auth, OAuth, notification prefs. |
| `/api/auth/2fa` | Two-factor setup/verify. |
| `/api/upload` | Resume/input uploads. |
| `/api/resumes` | Resume CRUD, sharing, versions, comments. |
| `/api/enhance` | AI resume enhancement. |
| `/api/roast` | Resume roast. |
| `/api/cover-letter` | Cover letter generation. |
| `/api/fetchjobs` | Job search/fetch. |
| `/api/salary` | Salary estimation. |
| `/api/job-tracker` | Tracked jobs. |
| `/api/jobs` | Application packets / tracking. |
| `/api/career-profile` | Career profile. |
| `/api/job-alerts` | Alerts. |
| `/api/community` | Community channels/posts/DMs. |
| `/api/fellowship` | Challenges/proposals/chat. |
| `/api/interview` | Interview sessions/history/replay. |
| `/api/recruiter` | Recruiter flows. |
| `/api/outreach` | Outreach drafts/queue. |
| `/api/bugs` | Bug reports. |
| `/api/collaboration` | Resume collaboration. |
| `/api/payments` | Razorpay payments (loaded when configured). |
| `/api/portfolio` | Portfolio generation/content/deploy. |
| `/api/portfolio/github` | GitHub portfolio sync/build. |
| `/api/user-profiles` | Public user profiles. |
| `/api/gdpr` | Export/delete. |
| `/api/search` | Search. |
| `/api/ai` | AI utility routes. |
| `/api/email-tracking` | Email tracking. |
| `/api/analyzer` | Repository analyzer. |
| `/api/readme-generator` | GitHub README generator. |
| `/api/project-visualizer` | Project visualizer. |
| `/api/subscription` | Subscription/plan state. |
| `/api/admin` | Admin APIs. |
| `/api/admin/queues` | Bull-Board UI. |

Backend commands:

```bash
cd backend
npm install
npm run dev       # nodemon src/index.js
npm start
npm test          # node scripts/run-tests.js
npm run lint
```

## 6. Data Model Overview

- **Primary (live):** Cloudflare D1. 28 tables covering identity, resumes,
  jobs, portfolios, career, interviews, notifications, settings, AI telemetry,
  uploads and community. See `docs/DATABASE_SCHEMA.md`.
- **Legacy:** Supabase Postgres migrations in `supabase/migrations/`; MongoDB
  models in `backend/src/models/` for the Express path; Appwrite collections for
  community; Redis for queues/cache.
- **Convention:** user-owned rows carry `user_id`; tool documents are stored
  verbatim in a `data TEXT` column so existing camelCase shapes keep working.
- **Relationships:** logical only (no enforced FKs in D1), maintained by ids in
  the Worker and frontend.

## 7. Authentication and Authorization

**Live (D1):**

1. The SPA signs up/logs in via `POST /v1/auth/signup|login` on the gateway.
2. The Worker hashes passwords with PBKDF2-SHA256 (100k iterations), issues an
   HS256 JWT (7-day TTL), and stores its `jti` in `auth_sessions`.
3. `AuthProvider` keeps the session in `localStorage`
   (`careerpilot:d1:session`) and hydrates the user via `/v1/auth/me`.
4. Every `/v1/db/*` request is scoped to the authenticated `user_id`; public
   share reads are limited to `share_token`/public portfolio slugs.
5. Google/GitHub OAuth is enabled when the Worker has the provider secrets.

**Optional (Express):** `verifyToken` accepts a D1 bearer token first
(`verifyD1Token`), then a Supabase token, then a Clerk session. `adminOnly`
protects admin routes using `ADMIN_EMAILS`/`ADMIN_UIDS`.

Guidance:

- Frontend route guards are UX only; server-side checks are authoritative.
- Never put server-only secrets in `VITE_` variables.
- Keep `DEV_BYPASS_AUTH` disabled outside local testing.
- TOTP secrets and backup codes stay server-side.

## 8. AI Provider Architecture

Generic AI generation goes through `frontend/src/services/aiGateway.js` →
`POST /v1/ai/generate` on the Worker. Feature-specific endpoints
(`enhanceApi`, `interviewApi`, `roastApi`, cover-letter/LinkedIn/README
generation) still call Express `/api/*`, which uses its own provider registry
(`backend/src/config/aiProviders.js`).

| Mode | How it works |
| --- | --- |
| Platform (default) | Worker secret or the Workers AI binding supplies the key. |
| BYOK | `useAIConfigStore` (encrypted localStorage) sends `X-AI-Provider`, `X-AI-Key`, `X-AI-Model`, `X-AI-Base-Url` per request. |

Provider coverage:

- Native: Cloudflare Workers AI (`cloudflare`), Google Gemini, Anthropic.
- OpenAI-compatible registry (26): OpenAI, Groq, OpenRouter, Requesty, DeepSeek,
  Mistral, xAI, Together, Fireworks, Perplexity, Cohere, Cerebras, SambaNova,
  Hyperbolic, Novita, Moonshot, Zhipu, DashScope, Nebius, Chutes, GitHub,
  Ollama, LM Studio, vLLM, llama.cpp, Azure.
- Custom: any OpenAI-compatible `baseUrl`.

The frontend catalog shows 30 providers (`PROVIDER_META` in
`useAIConfigStore.js`); keep it in sync with `PROVIDER_REGISTRY` in
`worker/src/index.js` when adding one.

Endpoints: `/v1/ai/generate`, `/v1/ai/validate-key`, `/v1/ai/models` (live
discovery with static fallback). Usage is logged to `ai_usage`.

## 9. Resume System

1. User uploads a PDF (client-side text extraction via `pdfExtract.js`) or
   creates a resume from text/form inputs.
2. Resume data is stored in D1 (`resumes`) through `/v1/db/resumes`.
3. AI enhancement runs through the gateway; ATS scores are stored in
   `resume_ats_history`; versions in `resume_versions`.
4. The builder renders any of 60 templates and exports via `atsPdfExport.js`.
5. Sharing uses `share_token` and the public `/shared/:shareToken` route.
6. Express extras: server-side PDF rendering (`pdfGenerator.js`), upload route,
   resume comments/collaboration.

## 10. Job Search, Tracking, and Alerts

1. Search calls `POST /v1/jobs/search` (RapidAPI JSearch) through the gateway.
2. Users track jobs via `/v1/db/jobs` (or the extension's `/v1/jobs/track`).
3. The tracker is a kanban backed by `tracked_jobs`; packets, follow-up dates
   (`next_action_at`), offers and rejections live on the same row.
4. Alerts are stored in `job_alerts`; the Express BullMQ worker
   (`jobAlertQueue.js`, `jobFetcher.js`) fetches/dedupes/emails matches.
5. Weekly digest and GitHub sync cron run only on the Express path.

See `docs/APPLICATION_PACKETS.md` for the packet/calendar model.

## 11. Portfolio System

1. Templates are React components under
   `frontend/src/components/portfolio/templates/*/index.jsx` (262 of them),
   discovered automatically by `frontend/src/data/portfolioTemplates.jsx`.
2. Each template consumes `usePortfolio()` from `PortfolioContext`.
3. The standalone build (`vite.standalone.config.js`) emits
   `frontend/dist-portfolio/standalone.html`, the shell the Express deployer
   fills with the user's content.
4. `backend/src/services/deploy/portfolioHtmlGenerator.js` builds the bundle;
   `cloudflareDeployer.js`, `netlifyDeployer.js` and `githubPagesDeployer.js`
   publish it.
5. Deploy results are recorded in D1 `portfolio_deployments`; portfolio content
   lives in `portfolios`.
6. `docs/portfolio-architecture.md` and
   `docs/creating-portfolio-themes.md` cover internals and authoring.

## 12. Community and Fellowship

The live UI uses the Express/Appwrite path:

| Module | Responsibility |
| --- | --- |
| `backend/src/routes/community.js` | Channels, posts, comments, DMs, presence, search. |
| `backend/src/controllers/communityAppwriteController.js` | Appwrite-backed data access. |
| `backend/src/services/presenceService.js` | Presence. |
| `backend/src/services/postScheduler.js` | Scheduled posts. |
| `backend/src/routes/fellowships.js` | Challenges, proposals, onboarding, chat. |
| `frontend/src/pages/Community.jsx`, `components/community/` | Community UI. |
| `frontend/src/pages/fellowship/` | Fellowship UI. |

D1 already has `community_posts`/`community_comments` for a future Worker-native
port; the frontend `communityApi` still calls `/api/community`.

## 13. Admin, Monitoring, and Operations

| Surface | Location |
| --- | --- |
| Worker health | `GET /v1/health` (D1 ready, table count, auth/ImageKit flags) |
| Backend health | `GET /health` |
| Metrics | `GET /metrics` (Prometheus) |
| API docs | `GET /api/docs` (Swagger) |
| Queue dashboard | `/api/admin/queues` (Bull-Board) |
| Admin UI | `/admin`, `/admin/users`, `/admin/logins`, `/admin/bugs` |
| Bug reports | `/api/bugs` |
| GDPR | `/api/gdpr` (see `docs/GDPR_API.md`) |
| AI usage | D1 `ai_usage` |

Guidance: keep the queue dashboard and admin routes behind authorization, check
Redis before enabling queue features, and validate email config at startup.

## 14. Environment Variables

Three surfaces: frontend (`VITE_*`), Worker (`wrangler.toml` vars + secrets),
optional backend (`backend/.env`). Full matrix in
`docs/environment-setup.md`.

Frontend essentials:

| Variable | Purpose |
| --- | --- |
| `VITE_AI_GATEWAY_URL` | Gateway base, default `/gateway/v1`. |
| `VITE_API_URL`, `VITE_API_BASE` | Express backend (optional). |
| `VITE_AI_GATEWAY_DEV_URL` | Dev proxy target, default `http://localhost:8787`. |
| `VITE_MAX_SIZE_MB` | Upload limit. |
| `VITE_DISABLE_D1_AUTH` | Disables native auth for preview builds. |

Worker essentials:

| Variable | Purpose |
| --- | --- |
| `DB`, `AI` | D1 and Workers AI bindings (not env vars; declared in `wrangler.toml`). |
| `AUTH_SECRET` | JWT signing secret (required in production). |
| `DEFAULT_AI_PROVIDER` | `cloudflare` by default. |
| `ALLOWED_ORIGINS` | CORS allow-list (`*` today). |
| Provider keys | `GEMINI_API_KEY`, `OPENAI_API_KEY`, `GROQ_API_KEY`, `OPENROUTER_API_KEY`, `ANTHROPIC_API_KEY`, `CLOUDFLARE_API_TOKEN`. |
| Integrations | `RAPIDAPI_KEY`, `IMAGEKIT_PRIVATE_KEY`, OAuth client ids/secrets. |

Backend essentials: `PORT`, `NODE_ENV`, `FRONTEND_URL`, `MONGODB_URI`,
`REDIS_URL`, `CLOUDFLARE_D1_GATEWAY_URL`, `AUTH_SECRET`, legacy
`SUPABASE_*`/`CLERK_*`/`APPWRITE_*`, AI keys, `RAPIDAPI_KEY`, `EMAIL_*`,
`RAZORPAY_*`, deployment tokens.

Rules: never commit `.env`; never expose server-only secrets with `VITE_`;
use placeholders in examples.

## 15. Local Development Setup

Prerequisites:

- Node.js 22+ (`.nvmrc`), npm 10+.
- A Cloudflare account for Pages/Workers/D1, or `wrangler dev` locally.
- Optional: MongoDB and Redis only if running the Express backend.

```bash
git clone <repository-url>
cd career-pilot
npm run install:all          # root + frontend + backend
npm --prefix worker install  # gateway Worker

cp frontend/.env.example frontend/.env
# optional backend
cp backend/.env.example backend/.env
```

Run:

```bash
# Terminal 1 — gateway Worker (http://localhost:8787)
cd worker && npx wrangler d1 migrations apply DB --local && npx wrangler dev

# Terminal 2 — frontend (http://localhost:5173)
cd frontend && npm run dev

# Terminal 3 — optional Express backend (http://localhost:5000)
cd backend && npm run dev
```

Local URLs:

| Service | URL |
| --- | --- |
| Frontend | `http://localhost:5173` |
| Gateway Worker | `http://localhost:8787` |
| Express backend | `http://localhost:5000` |
| Backend health | `http://localhost:5000/health` |
| Swagger | `http://localhost:5000/api/docs` |
| Metrics | `http://localhost:5000/metrics` |

## 16. Build, Test, and Quality Checks

```bash
# Frontend
cd frontend && npm run lint && npm test && npm run build

# Gateway Worker
cd worker && npm test

# Backend (optional)
cd backend && npm run lint && npm test
```

Root shortcuts: `npm run lint`, `npm run test:frontend`, `npm run test:backend`,
`npm run test:worker`, `npm run test:all`, `npm run build`,
`npm run build:portfolio`.

Notes:

- `npm run build` builds the SPA and the standalone portfolio bundle.
- Backend portfolio-generator tests read `frontend/dist-portfolio/standalone.html`;
  run `npm run build:portfolio` first locally (CI restores it from the frontend
  artifact).
- Frontend tests use Vitest; backend and worker tests use `node:test`.
- Config files for targeted suites: `frontend/vitest-notfound.json`,
  `frontend/vitest-reportbug.json`.

## 17. Deployment Overview

**Primary (automated):** push to `main` → `.github/workflows/ci-cd.yml`:
frontend lint/test/build, backend lint/test, worker tests; then D1 migrations,
Worker deploy, Pages deploy, smoke test.

**Primary (manual):** see `docs/UNIFIED_PLATFORM.md`.

**Backend (optional):** build with its Dockerfile or run `node src/index.js`
behind any Node host; set production env vars, expose `/health`, and point
`VITE_API_BASE` at it. Alternative static hosting configs (`vercel.json`,
`netlify.toml`, `nginx.conf`) exist per app but are not used by the live
pipeline.

**Portfolio deploys:** Express deployers publish generated bundles to Cloudflare
Pages, Netlify, or GitHub Pages using the user's provider token.

## 18. Security Checklist

- `AUTH_SECRET` set as a Worker secret; `ALLOWED_ORIGINS` narrowed to trusted
  origins.
- `DEV_BYPASS_AUTH=false` outside local development.
- `.env` files not committed; no server secrets in `VITE_` variables.
- Admin routes and queue dashboards require server-side authorization.
- Rate limiting active on the gateway and Express.
- Helmet/CSP changes tested against login, OAuth, Socket.IO and template
  previews.
- Uploads validated by type and size (10 MB gateway limit).
- AI-generated HTML sanitized before rendering/publishing.
- Payment keys in test mode outside production.
- TOTP secrets/backup codes server-side only.
- D1 tenant scoping covered by worker tests when touching `db.js`.

## 19. Contribution Workflow

1. Branch from `main` (`feature/…`, `fix/…`, `docs/…`).
2. Read nearby code and the relevant docs first.
3. Keep changes scoped; add tests when behavior changes.
4. Update docs when routes, env vars, data models or setup change.
5. Run the relevant lint/test/build commands.
6. Open a PR with summary, test results, screenshots for UI changes, and
   migration notes when applicable.

CI must be green: `frontend`, `backend`, `worker` jobs and, on `main`, the
deploy job.

## 20. Common Development Tasks

**Add a gateway route**
1. Handle the path in `worker/src/db.js` (data) or `worker/src/index.js`
   (router/utility).
2. Resolve the user with `authenticateRequest`; scope every query by `user_id`.
3. Add the client method in `frontend/src/services/d1Data.js`, re-export through
   `services/api.js` if the UI uses the facade.
4. Add a worker test in `worker/test/`.
5. Update `API_DOCS/gateway.md` and `docs/DATABASE_SCHEMA.md` if schema changed.

**Add a D1 table**
1. Add a new `worker/migrations/000N_*.sql` (never edit an applied migration).
2. Add CRUD handlers in `worker/src/db.js` and a client method.
3. Apply locally (`wrangler d1 migrations apply DB --local`); CI applies remote.
4. Document it in `docs/DATABASE_SCHEMA.md`.

**Add an Express route**
1. Create/update a router in `backend/src/routes/`.
2. Add validation (`schemas/`), controller/service logic.
3. Register the prefix in `backend/src/index.js`.
4. Add tests and update `API_DOCS/`.

**Add a frontend page**
1. Create the page in `frontend/src/pages/`.
2. Add components and API methods.
3. Register the route in `App.jsx` (protected/public/share).
4. Add loading/empty/error/auth states and tests.

**Add a portfolio template**
1. Create `frontend/src/components/portfolio/templates/<Id>/index.jsx`.
2. Consume `usePortfolio()`; no other global dependencies.
3. Add a preview image under `frontend/public/template-previews/`.
4. The registry picks it up automatically; verify gallery, preview, studio and
   the standalone build.
5. Follow `docs/creating-portfolio-themes.md`.

**Add an AI feature**
1. Call `aiGateway.generate()`/`generateJson()` with a feature label.
2. Keep the prompt/response contract in the frontend or Express service.
3. Handle missing provider/keys gracefully.
4. Sanitize model output before rendering.
5. Add tests for parsing/fallbacks and document the provider requirement.

## 21. Troubleshooting

| Symptom | Checks |
| --- | --- |
| Frontend cannot reach gateway | `VITE_AI_GATEWAY_URL`, `/gateway` proxy in `vite.config.js`, Worker on `:8787`, `wrangler dev` logs. |
| Login fails | Worker `AUTH_SECRET`, D1 migrated, `/v1/auth/providers`, browser localStorage session, OAuth redirect URIs (`/gateway/v1/auth/oauth/<provider>/callback`). |
| D1 errors in the dashboard | `wrangler d1 migrations apply DB --remote`, table names, `wrangler tail`. |
| AI buttons fail | Provider key/selection in Settings, `/v1/ai/validate-key`, `X-AI-*` headers, Worker logs. |
| Job search 503 | `RAPIDAPI_KEY` secret on the Worker. |
| Uploads fail | `IMAGEKIT_PRIVATE_KEY`, public key/URL endpoint, file size ≤ 10 MB. |
| Backend extras fail | Express running, `VITE_API_BASE`, CORS `FRONTEND_URL`, Mongo/Redis reachable. |
| Job alerts do not send | Express only: Redis, Mongo, SMTP, active alert, queue worker startup, RapidAPI key. |
| Socket events missing | Express only: Socket.IO initialized, `VITE_SOCKET_URL`, CORS, token. |
| Portfolio deploy fails | Provider token, slug, `dist-portfolio/standalone.html`, deploy logs. |
| CI deploy skipped | Only runs on `main` push (or manual dispatch with `deploy: true`) after all three CI jobs pass. |

## 22. Documentation Maintenance

Update documentation whenever these change:

- Gateway or Express routes, or route prefixes.
- Environment variables or required credentials.
- D1 schema, indexes or ownership rules.
- Auth/authorization behavior.
- Queue, cron or background-worker behavior.
- Deployment workflow, build command or runtime requirement.
- Portfolio template contract.
- User-facing feature behavior.

Preferred destinations:

| Change type | Destination |
| --- | --- |
| Product overview | `README.md` |
| Whole-project map | `docs/PROJECT_DOCUMENTATION.md` |
| Architecture/flows | `ARCHITECTURE.md`, `docs/UNIFIED_PLATFORM.md` |
| API contract | `API_DOCS/` (gateway + Express) |
| Env vars | `docs/environment-setup.md` + `.env.example` files |
| Data model | `docs/DATABASE_SCHEMA.md` |
| Portfolio workflow | `docs/portfolio-architecture.md`, `docs/creating-portfolio-themes.md` |
| Security-sensitive behavior | `SECURITY.md` + setup docs |

`docs/README.md` is the index; add new documents there and mark analysis
snapshots as historical.
