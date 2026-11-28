# Documentation Index

**Last reviewed:** 2026-11-28

This page is the map of Career Pilot's documentation. Each file is marked with a
status so readers know whether it describes the live system, a specific
subsystem, or a historical analysis.

| Status | Meaning |
|---|---|
| **Current** | Matches the code in `main`; update it when behavior changes. |
| **Reference** | Accurate for the named subsystem (often the optional Express backend). |
| **Historical** | A snapshot/analysis from an earlier iteration; useful context, not a contract. |

---

## Start Here

| Doc | Status | Contents |
|---|---|---|
| [../README.md](../README.md) | Current | Product overview, quick install, features, routes, deployment summary. |
| [../ARCHITECTURE.md](../ARCHITECTURE.md) | Current | Pages + Worker/D1 architecture, request flows, auth, AI, data, security, CI/CD. |
| [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md) | Current | Whole-project handbook: layout, frontend, backend, data, env, testing, troubleshooting. |
| [UNIFIED_PLATFORM.md](UNIFIED_PLATFORM.md) | Current | Cloudflare unification, deploy runbook, data map, phase-2 ports. |

## Setup & Operations

| Doc | Status | Contents |
|---|---|---|
| [environment-setup.md](environment-setup.md) | Current | Frontend / Worker / backend environment matrix and credentials. |
| [deployment-setup.md](deployment-setup.md) | Current | CI pipeline, manual Cloudflare runbook, alternative hosts, rollback. |
| [../CONTRIBUTING.md](../CONTRIBUTING.md) | Current | Contributor workflow, commands, PR expectations. |
| [../SECURITY.md](../SECURITY.md) | Current | Threat model, disclosure process. |
| [../CLAUDE.md](../CLAUDE.md) | Current | Agent/coding conventions and command cheat sheet. |
| [../frontend/README.md](../frontend/README.md) | Current | SPA setup, scripts, structure, data/AI layers. |
| [../extension/README.md](../extension/README.md) | Current | Chrome extension install, endpoints, token setup. |

## Data & APIs

| Doc | Status | Contents |
|---|---|---|
| [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) | Current | D1 tables/columns/indexes, access patterns, legacy Supabase/Mongo notes. |
| [../API_DOCS/README.md](../API_DOCS/README.md) | Current | API index: gateway vs Express, auth, conventions, rate limits. |
| [../API_DOCS/gateway.md](../API_DOCS/gateway.md) | Current | Every gateway endpoint with request/response examples. |
| [../API_DOCS/ai-tools.md](../API_DOCS/ai-tools.md) | Reference | Interview + search endpoints (Express). |
| [../API_DOCS/deployment.md](../API_DOCS/deployment.md) | Reference | Payments + 2FA (Express). |
| [../API_DOCS/github.md](../API_DOCS/github.md) | Reference | Public profiles / GitHub intelligence (Express). |
| [../API_DOCS/portfolio.md](../API_DOCS/portfolio.md) | Reference | Fellowship API (Express). |
| [../API_DOCS/portfolio-cms.md](../API_DOCS/portfolio-cms.md) | Reference | Portfolio content/analytics/SEO (Express). |
| [APPLICATION_PACKETS.md](APPLICATION_PACKETS.md) | Current | Packets, follow-up calendar, career profile, STAR stories. |
| [GDPR_API.md](GDPR_API.md) | Current | Export/delete endpoints + D1 erasure SQL. |

## Features

| Doc | Status | Contents |
|---|---|---|
| [ai-features.md](ai-features.md) | Current | AI workflows, 30-provider gateway, prompt/validation patterns. |
| [RESUME_PLATFORM_ROADMAP.md](RESUME_PLATFORM_ROADMAP.md) | Current | Resume unification: OSS capability map, shipped changes, remaining phases, acceptance criteria. |
| [portfolio-architecture.md](portfolio-architecture.md) | Current | Template registry, Studio, standalone bundle, deploy pipeline. |
| [creating-portfolio-themes.md](creating-portfolio-themes.md) | Current | How to add a React portfolio template. |
| [component-guide.md](component-guide.md) | Current | Frontend component/style conventions. |
| [cdn-setup.md](cdn-setup.md) | Current | `VITE_CDN_URL`, caching headers, CDN options. |
| [github-intelligence.md](github-intelligence.md) | Reference | GitHub analysis algorithms; transport notes are in the banner. |
| [JOB_DEDUPLICATION.md](JOB_DEDUPLICATION.md) | Reference | Job dedupe engine (Express backend). |
| [REDIS_API_CACHE.md](REDIS_API_CACHE.md) | Reference | Redis response cache (Express backend). |

## Historical / Analysis Snapshots

These were written at a point in time and may reference retired stacks (Clerk,
Firebase, Mongo-only, Supabase-only). Keep them for context; do not treat them
as current contracts.

| Doc | Note |
|---|---|
| [INSIGHT_CV_VS_CAREER_PILOT_FEATURE_DISCOVERY.md](INSIGHT_CV_VS_CAREER_PILOT_FEATURE_DISCOVERY.md) | Competitive feature discovery. |
| [PRODUCT_GAP_REPORT.md](PRODUCT_GAP_REPORT.md) | Product gap analysis snapshot. |
| [RESUME_BUILDER_GAP_ANALYSIS.md](RESUME_BUILDER_GAP_ANALYSIS.md) | Resume-builder gap analysis snapshot. |

## Unmaintained But Present

| Path | Note |
|---|---|
| `firebase/` | Rules/indexes from the Firebase era; no runtime dependency. |
| `supabase/migrations/` | Legacy Postgres schema; live schema is `worker/migrations/`. |
| `anurag3407-portfolio/` | Personal single-file portfolio, not product code. |

---

## Maintenance Rules

1. When you change a route, env var, D1 column or deploy step, update the file
   in the table above **in the same PR**.
2. New documents must be added to this index with a status.
3. Prefer linking to the source (`worker/src/db.js`, `App.jsx`,
   `worker/migrations/`) over duplicating large code blocks.
4. Analysis/report documents are snapshots: date them and mark them
   **Historical** rather than rewriting them into a moving target.
