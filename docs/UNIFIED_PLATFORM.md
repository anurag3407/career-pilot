# CareerPilot — Unified Platform Architecture

> One landing page. One dashboard. One auth. One AI config. One database.
> Deployed free on **Cloudflare Pages + Workers + D1**.

---

## What changed in the unification

| Before | After |
|---|---|
| Clerk **or** Supabase auth (3 auth states) | **D1 native auth** issued by the gateway Worker (`worker/src/auth.js`) |
| Mongo + Appwrite + Supabase data split | **Cloudflare D1** (`careerpilot-db`) through `services/d1Data.js` / `config/d1.js` |
| AI keys per-feature, BYOK headers scattered | **One gateway Worker** (`worker/`) + one config store (`useAIConfigStore`) |
| Tabbed dashboard explorer | **Single curated dashboard** — every tool visible, grouped |
| Multiple landing surfaces | **One landing page** — hero, stats, feature grid, 8 tool sections, open source, CTA |

The Supabase/Postgres migrations under `supabase/migrations` are legacy history;
the Worker D1 migrations under `worker/migrations` are the live schema.

## Architecture

```
┌────────────────────────────────────────────────────────┐
│  Cloudflare Pages (free)                               │
│  React 19 + Vite SPA — frontend/                       │
│  • Landing: components/landing/unified/                │
│  • Dashboard: pages/Dashboard.jsx (curated grid)       │
│  • Data: services/d1Data.js   → /gateway/v1/db/*       │
│  • AI:   services/aiGateway.js → /gateway/v1/ai/*      │
└───────────────┬────────────────────────────────────────┘
                │
        ┌───────▼─────────────────────────────┐
        │  Cloudflare Worker (free)           │
        │  worker/ — careerpilot-gateway      │
        │  • /v1/auth/*    (D1 native auth)   │
        │  • /v1/db/*      (tool documents)   │
        │  • /v1/ai/generate  (all providers) │
        │  • /v1/jobs/search  (RapidAPI)      │
        │  • /v1/jobs/track   (extension)     │
        │  • platform keys live HERE (secrets)│
        └───────┬─────────────────────────────┘
                │
        ┌───────▼─────────────────────────────┐
        │  Cloudflare D1 (free)               │
        │  careerpilot-db — binding DB        │
        │  • 28 tables, user-scoped        │
        │  • migrations in worker/migrations  │
        │  • AI usage ledger (ai_usage)       │
        └─────────────────────────────────────┘
```

The Express backend (`backend/`) still exists for **self-hosted extras** — PDF
rendering, portfolio deploys, community/fellowship, admin, queues, and the
feature-specific AI endpoints. Auth, CRUD, AI provider routing, job search and
uploads run without it; the AI prompts under `/api/enhance`, `/api/interview`,
`/api/roast` and `/api/cover-letter` still need Express until they are ported
(see phase 2).

## Deploy runbook (free tier)

### Automated path (primary)

A push to `main` runs `.github/workflows/ci-cd.yml`:

1. **frontend** — `npm ci`, lint, vitest, then `npm run build` (SPA to `dist`,
   standalone portfolio shell to `dist-portfolio`). Uploads `frontend-dist` and
   a slim `portfolio-shell` (`standalone.html` + `assets/`).
2. **backend** — restores `portfolio-shell` (the only `dist-portfolio` input the
   portfolio generator tests read), then lint + `node --test`.
3. **worker** — `npm ci` + `node --test` against an in-memory D1 database.
4. **deploy** — only after all three pass, only on `main`:
   - `npx wrangler d1 migrations apply DB --remote`
   - `npx wrangler deploy`
   - `wrangler pages deploy frontend/dist --project-name=careerpilot --branch=main`
   - `node scripts/verify-deploy.mjs` (asset-hash check + `/v1/health`)

Required secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` (repo-level or
in the `production` environment). The token needs **Workers Scripts: Edit**,
**Pages: Edit**, and **D1: Edit** permissions. Optional variables: `PAGES_URL`,
`WORKER_URL`, `PUBLIC_SITE_URL` for the smoke test.

### Manual fallback

```bash
# 1. Apply D1 schema (CI does this before every Worker deploy)
cd worker
npx wrangler d1 migrations apply DB --remote

# 2. Set Worker secrets (only the ones you use)
npx wrangler secret put AUTH_SECRET            # JWT signing; set explicitly
npx wrangler secret put GEMINI_API_KEY         # + any other provider keys
npx wrangler secret put RAPIDAPI_KEY           # job search (optional)
npx wrangler secret put IMAGEKIT_PRIVATE_KEY   # image auth/upload (optional)

# 3. Deploy the Worker
npx wrangler deploy

# 4. Build and deploy the SPA
cd ../frontend
VITE_AI_GATEWAY_URL=/gateway/v1 npm run build
npx wrangler pages deploy dist --project-name=careerpilot --branch=main

# 5. Verify
cd ..
node scripts/verify-deploy.mjs
```

Routing note: the frontend builds with `VITE_AI_GATEWAY_URL=/gateway/v1`, so the
public origin needs a same-origin `/gateway/*` route to the Worker (a Worker
route on the custom domain, configured outside this repo) or the build must use
the absolute `https://<worker>.workers.dev/v1` URL. The post-deploy smoke test
checks the direct Worker URL as a hard gate and `/gateway/v1/health` on
`PUBLIC_SITE_URL` as a warning.

## Single AI configuration

Everything flows through one client (`services/aiGateway.js`) and one Worker:

- **Platform mode (default)** — Worker injects server-side keys. Users just
  click and it works. Keys are never in the browser bundle.
- **BYOK mode** — user adds their own key in **Settings → AI Provider**
  (`useAIConfigStore`, encrypted in localStorage). The key rides to the Worker
  via `X-AI-*` headers and overrides the platform key per request.

The Worker logs every call to the `ai_usage` table (provider, model, tokens,
latency, byok) — the platform's single usage ledger.

## Data layer map (D1 tables → tools)

| Table | Tool(s) |
|---|---|
| `users`, `profiles`, `auth_sessions`, `oauth_states` | Native auth, profile, admin flag |
| `resumes`, `resume_versions`, `resume_ats_history` | Resume Studio, AI Enhancer |
| `resume_roasts` | Resume Roast (public share via `share_token`) |
| `cover_letters` | Cover Letter generator |
| `tracked_jobs`, `job_alerts`, `job_listings` | Job Finder, Tracker, Alerts, application packets |
| `career_profiles`, `star_stories` | Career profile, STAR stories, extension scoring |
| `portfolios`, `portfolio_deployments` | Portfolio Studio |
| `interviews`, `interview_answers` | Interview Sim |
| `github_portfolio_builds` | GitHub Portfolio |
| `outreach_records` | Recruiter outreach |
| `notifications` | Notification center |
| `ai_usage` | AI usage ledger (written by the gateway) |
| `user_settings` | Cross-device prefs (AI keys stay client-side) |
| `files`, `user_inputs`, `recruiter_analysis` | Uploads, resume intake, recruiter leaderboard |
| `community_posts`, `community_comments` | Community (schema ready; live UI still uses Express/Appwrite) |

The Worker authenticates every request and scopes user-owned rows to the
authenticated `user_id`; tool documents are stored verbatim in a `data` column
so existing field names keep working.

## Phase-2 ports (documented, not blocking)

These still call the Express backend (`VITE_API_BASE`) and need either a
Node host (Docker/Railway) or a gateway port. The **reference pattern** for
porting one is `salaryApi.estimate` (client logic) and `jobsApi.search`
(gateway proxy):

1. **AI feature endpoints** — `enhanceApi.*`, `interviewApi.*`, `roastApi.create`,
   cover letters, README generator, LinkedIn optimizer, repo visualizer,
   GitHub portfolio build. Port = move prompt + response contract to
   `lib/prompts/*` + call `aiGateway.generateJson()`.
2. **PDF upload parsing** — replace `uploadApi` with client-side pdf.js
   extraction (backend `pdf-parse` equivalent).
3. **Resume PDF download** — client `services/atsPdfExport.js` already exists;
   wire `resumeApi.downloadPdf` to it for Cloudflare-only deploys.
4. **Community/fellowship realtime** — the legacy Socket.IO/Appwrite path still
   needs a Worker-native channel (Durable Object or SSE); Supabase Realtime is
   no longer the target.
5. **Background jobs** (alert email fetch, digests) — Cloudflare Cron Triggers
   on the gateway Worker, or keep the Node worker self-hosted.
