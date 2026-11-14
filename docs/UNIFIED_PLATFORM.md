# CareerPilot — Unified Platform Architecture

> One landing page. One dashboard. One auth. One AI config. One database.
> Deployable free on **Cloudflare Pages + Workers** with **Supabase**.

---

## What changed in the unification

| Before | After |
|---|---|
| Clerk **or** Supabase auth (3 auth states) | **Supabase Auth only** (`context/AuthProvider.jsx`) |
| Mongo + Appwrite + Supabase data split | **Supabase Postgres + RLS** for all core tools (`services/supabaseData.js`) |
| AI keys per-feature, BYOK headers scattered | **One gateway Worker** (`worker/`) + one config store (`useAIConfigStore`) |
| Tabbed dashboard explorer | **Single curated dashboard** — every tool visible, grouped |
| Multiple landing surfaces | **One landing page** — hero, stats, feature grid, 8 tool sections, open source, CTA |

## Architecture

```
┌────────────────────────────────────────────────────────┐
│  Cloudflare Pages (free)                               │
│  React 19 + Vite SPA — frontend/                       │
│  • Landing: components/landing/unified/                │
│  • Dashboard: pages/Dashboard.jsx (curated grid)       │
│  • Data: services/supabaseData.js  → Supabase (RLS)    │
│  • AI:   services/aiGateway.js     → /gateway/*        │
└───────────────┬────────────────────────────────────────┘
                │
        ┌───────▼─────────────────────────────┐
        │  Cloudflare Worker (free)           │
        │  worker/ — careerpilot-gateway      │
        │  • /v1/ai/generate  (all providers) │
        │  • /v1/jobs/search  (RapidAPI)      │
        │  • /v1/jobs/track   (extension)     │
        │  • platform keys live HERE (secrets)│
        └───────┬─────────────────────────────┘
                │
        ┌───────▼─────────────────────────────┐
        │  Supabase (free)                    │
        │  • Auth (email + Google/GitHub OAuth)│
        │  • Postgres + RLS (all tool tables) │
        │  • Storage (avatars, resumes)       │
        │  • Realtime (community, notifs)     │
        └─────────────────────────────────────┘
```

The Express backend (`backend/`) still exists for **self-hosted extras** — PDF
rendering, interview audio processing, community/fellowship, admin, queues.
The core loop (resumes, jobs, alerts, portfolios, profile, settings, job
search, AI) runs fully without it.

## Deploy runbook (free tier)

### 1. Supabase
1. Create a project at [supabase.com](https://supabase.com) (free).
2. SQL Editor → run `supabase/migrations/20261105000000_init_supabase.sql`
   (skip if already applied), then
   `supabase/migrations/20261114000000_unified_platform.sql`.
3. Auth → URL config: set Site URL to your Pages URL; add
   `https://<pages-domain>/*` to redirect allowlist.
4. Auth → Providers: enable Email, Google, GitHub as needed.
5. Copy `Project URL` + `anon key` → frontend env (`VITE_SUPABASE_*`).

### 2. AI gateway Worker
```bash
cd worker
npx wrangler login
npx wrangler deploy
npx wrangler secret put GEMINI_API_KEY        # + any providers you want
npx wrangler secret put RAPIDAPI_KEY          # optional: job search
npx wrangler secret put SUPABASE_URL
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY   # usage ledger + /v1/jobs/track
```
Note the deployed URL (`https://careerpilot-gateway.<subdomain>.workers.dev`).

### 3. Frontend on Cloudflare Pages
- Build command: `npm run build` · Output dir: `dist` · Root: `frontend`
- Env vars:
  - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
  - `VITE_AI_GATEWAY_URL=https://careerpilot-gateway.<subdomain>.workers.dev/v1`
  - (optional) `VITE_API_BASE` if you also self-host the Express backend
- `_redirects` (SPA) and `_headers` (caching/security) ship in `frontend/public/`.
- Local dev: `npx wrangler dev` in `worker/` — vite proxies `/gateway` → `:8787`.

Free-tier headroom: Pages (unlimited static requests), Workers (100k req/day),
Supabase (500k edge invocations, 500MB DB).

## Single AI configuration

Everything flows through one client (`services/aiGateway.js`) and one Worker:

- **Platform mode (default)** — Worker injects server-side keys. Users just
  click and it works. Keys are never in the browser bundle.
- **BYOK mode** — user adds their own key in **Settings → AI Provider**
  (`useAIConfigStore`, encrypted in localStorage). The key rides to the Worker
  via `X-AI-*` headers and overrides the platform key per request.

The Worker logs every call to the `ai_usage` table (provider, model, tokens,
latency, byok) — the platform's single usage ledger.

## Data layer map (Supabase tables → tools)

| Table | Tool(s) |
|---|---|
| `profiles` | Auth profile, public profile, admin flag |
| `resumes`, `resume_versions`, `resume_ats_history` | Resume Studio, AI Enhancer |
| `resume_roasts` | Resume Roast (public share via `share_token`) |
| `tracked_jobs`, `job_alerts`, `job_listings` | Job Finder, Tracker, Alerts |
| `portfolios`, `portfolio_deployments` | Portfolio Studio |
| `interviews`, `interview_answers` | Interview Sim |
| `github_portfolio_builds` | GitHub Portfolio |
| `outreach_records` | Recruiter outreach |
| `notifications` | Notification center (realtime) |
| `ai_usage` | AI usage ledger (written by the gateway) |
| `user_settings` | Cross-device prefs (AI keys stay client-side) |
| `community_posts`, `community_comments` | Community (Supabase Realtime ready) |

Every user-owned table has RLS (`auth.uid() = user_id`); tool documents are
stored verbatim in a `data JSONB` column so existing field names keep working.

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
4. **Community/fellowship realtime** — move from Socket.IO/Appwrite to
   Supabase Realtime channels (tables + RLS already exist).
5. **Background jobs** (alert email fetch, digests) — Cloudflare Cron Triggers
   on the gateway Worker, or keep the Node worker self-hosted.
