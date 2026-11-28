# Career Pilot — Agent Guide

This file orients coding agents working in this repository. It is **not** a
product doc; see `README.md` and `docs/` for that.

## What this project is

React 19 + Vite SPA (`frontend/`) on Cloudflare Pages, backed by a single
Cloudflare Worker gateway (`worker/`) with Cloudflare D1. An optional Express
backend (`backend/`) handles PDF rendering, portfolio deploys, community,
queues and admin. A Chrome MV3 extension (`extension/`) tracks job listings.

## Commands

```bash
# Install
npm run install:all
npm --prefix worker install

# Local dev
cd worker && npx wrangler d1 migrations apply DB --local && npx wrangler dev  # :8787
cd frontend && npm run dev                                                   # :5173
cd backend && npm run dev                                                    # :5000 (optional)

# Checks
npm run lint            # backend + frontend
npm run test:frontend   # vitest
npm run test:backend    # node:test
npm run test:worker     # node:test (in-memory D1)
npm run test:all
npm run build           # SPA + dist-portfolio

# Deploy (CI does this on main)
cd worker && npx wrangler deploy
cd frontend && npm run build && npx wrangler pages deploy dist --project-name=careerpilot --branch=main
```

## Architecture rules

1. **Auth is D1-native** (`worker/src/auth.js`): PBKDF2-SHA256 + HS256 JWT,
   `auth_sessions` rows, Google/GitHub OAuth. The SPA uses
   `frontend/src/config/d1.js`; do not add Clerk/Supabase/Firebase to the core.
2. **Data goes through `/v1/db/*`** (`worker/src/db.js` → `services/d1Data.js`).
   Every user-owned query must include `user_id = ?`. Public reads are only by
   `share_token` or public portfolio slug.
3. **AI goes through `/v1/ai/generate`** (`services/aiGateway.js`). Platform mode
   uses Worker secrets; BYOK uses `X-AI-*` headers. Keep
   `PROVIDER_REGISTRY` (`worker/src/index.js`) and `PROVIDER_META`
   (`frontend/src/stores/useAIConfigStore.js`) in sync.
4. **Express is optional.** Don't move core flows back into it. New features
   should target the Worker unless they need Node-only libraries.
5. **Portfolio templates** live in
   `frontend/src/components/portfolio/templates/<Id>/index.jsx` and consume
   `usePortfolio()`. The registry is filesystem-derived — no manual imports.
6. **D1 migrations are append-only.** Add `worker/migrations/000N_*.sql`; never
   edit applied migrations.
7. **CI:** `.github/workflows/ci-cd.yml` runs frontend/backend/worker jobs, then
   on `main` applies D1 migrations, deploys the Worker and Pages, and runs
   `scripts/verify-deploy.mjs`. Update the docs when routes/env/schema change.

## Conventions

- Match surrounding code style; ES modules, no TypeScript in app code (some UI
  primitives are `.tsx`).
- Frontend data calls: use `services/api.js`'s facade or `d1Data.js`, not raw
  `fetch` in components.
- Dates are ISO-8601 strings; D1 stores JSON in `TEXT` columns.
- Never commit secrets (`worker/wrangler.toml` holds only non-secret vars).
- New env vars must be added to `docs/environment-setup.md` and the relevant
  `.env.example`.

## Docs map

| Doc | Use |
|---|---|
| `docs/README.md` | Index + freshness map |
| `ARCHITECTURE.md` | System design, flows, security |
| `docs/DATABASE_SCHEMA.md` | D1 tables/columns/indexes |
| `docs/UNIFIED_PLATFORM.md` | Cloudflare architecture + runbook |
| `API_DOCS/README.md`, `API_DOCS/gateway.md` | API contracts |
| `docs/portfolio-architecture.md`, `docs/creating-portfolio-themes.md` | Portfolio internals |
| `docs/environment-setup.md`, `docs/deployment-setup.md` | Env + deploy |
