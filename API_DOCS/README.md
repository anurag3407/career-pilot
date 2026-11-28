# 📚 API Documentation

<div align="center">

**Career Pilot — API reference index**

*Last updated: 2026-11-28*

</div>

---

Career Pilot exposes **two APIs**:

| API | Base URL | Status | Auth |
|---|---|---|---|
| **Gateway Worker** | `https://<origin>/gateway/v1` (or `http://localhost:8787/v1`) | **Primary** — used by the SPA and extension | Bearer D1 JWT |
| **Express backend** | `https://<api-host>/api` (or `http://localhost:5000/api`) | Optional — self-hosted extras | Bearer D1 JWT (falls back to Supabase/Clerk) |

The gateway covers auth, profiles, resumes, jobs, alerts, portfolios, career
profile, interviews, settings, notifications, AI, job search and ImageKit.
The Express API covers PDF rendering, portfolio deploys, GitHub intelligence,
community/fellowship, payments, admin, 2FA and queues.

---

## Table of Contents

- [Gateway API](#gateway-api)
- [Express API](#express-api)
- [Authentication](#authentication)
- [Conventions](#conventions)
- [Rate Limits](#rate-limits)
- [Domain References](#domain-references)

---

## Gateway API

Full reference: **[gateway.md](gateway.md)**.

| Group | Base | Highlights |
|---|---|---|
| Health | `/v1/health` | `{ok, d1, tables, auth, imagekit}` |
| Auth | `/v1/auth` | signup, login, logout, me, refresh, providers, OAuth |
| Profiles | `/v1/db/profiles` | `me`, avatar, stats, activity, public `:uid` |
| Resumes | `/v1/db/resumes` | CRUD, versions, ATS history, share tokens |
| Jobs | `/v1/db/jobs` | tracker CRUD, status, stats |
| Alerts | `/v1/db/alerts` | CRUD, toggle |
| Listings | `/v1/db/job-listings` | shared listing cache |
| Portfolios | `/v1/db/portfolios` | CRUD, deployments; public slug read |
| Career | `/v1/db/career-profile`, `/v1/db/star-stories` | master profile + STAR stories |
| Interviews | `/v1/db/interviews` | sessions, answers |
| Roasts | `/v1/db/roasts` | create, history, public share |
| Cover letters | `/v1/db/cover-letters` | list, create, delete |
| Settings | `/v1/db/settings` | notification/AI prefs |
| Notifications | `/v1/db/notifications` | list, mark read |
| GitHub | `/v1/db/github-builds` | builds |
| Outreach | `/v1/db/outreach` | records |
| Other | `/v1/db/user-inputs`, `/v1/db/recruiter-analysis`, `/v1/db/ai-usage` | intake, leaderboard, ledger |
| AI | `/v1/ai` | generate, validate-key, models |
| Jobs proxy | `/v1/jobs/search` | RapidAPI JSearch |
| Extension | `/v1/jobs/track` | idempotent track |
| ImageKit | `/v1/imagekit` | auth signature, upload |

All paths also work with the `/gateway` prefix
(`/gateway/v1/db/jobs`), because the Worker strips it.

---

## Express API

Base: `/api`. Full route inventory lives in
[`docs/PROJECT_DOCUMENTATION.md`](../docs/PROJECT_DOCUMENTATION.md#5-backend-application).

| Prefix | Domain | Detail doc |
|---|---|---|
| `/api/auth` | Login/session, GitHub OAuth, notification prefs | — |
| `/api/auth/2fa` | TOTP setup/enable/verify/backup codes | [deployment.md](deployment.md) |
| `/api/resumes`, `/api/enhance` | Resume CRUD, enhancement, PDF render | — |
| `/api/upload` | PDF upload/text extraction | — |
| `/api/roast`, `/api/cover-letter` | Roast + cover letters | — |
| `/api/fetchjobs`, `/api/job-tracker`, `/api/jobs`, `/api/job-alerts` | Jobs and packets | — |
| `/api/career-profile` | Career profile | — |
| `/api/interview` | Mock interviews | [ai-tools.md](ai-tools.md) |
| `/api/search` | Global search | [ai-tools.md](ai-tools.md) |
| `/api/community`, `/api/fellowship` | Community/fellowship | [portfolio.md](portfolio.md) (fellowship) |
| `/api/portfolio`, `/api/portfolio/github` | Portfolio content/deploy/sync | [portfolio-cms.md](portfolio-cms.md) |
| `/api/user-profiles` | Public profiles | [github.md](github.md) |
| `/api/gdpr` | Export/delete | [../docs/GDPR_API.md](../docs/GDPR_API.md) |
| `/api/payments` | Razorpay | [deployment.md](deployment.md) |
| `/api/ai`, `/api/analyzer`, `/api/readme-generator`, `/api/project-visualizer` | AI/GitHub tools | [ai-tools.md](ai-tools.md), [github.md](github.md) |
| `/api/admin`, `/api/admin/queues` | Admin + Bull-Board | — |
| `/api/webhooks`, `/api/email-tracking`, `/api/subscription`, `/api/bugs`, `/api/collaboration` | Ops | — |

> The domain documents were written for the Express API. Where a path differs
> from the mounted prefix, this table and
> `backend/src/index.js` are authoritative.

---

## Authentication

### Getting a token (D1)

```http
POST /v1/auth/login
Content-Type: application/json

{ "email": "you@example.com", "password": "••••••••" }
```

```json
{
  "success": true,
  "access_token": "<jwt>",
  "expires_at": "2026-12-05T12:00:00.000Z",
  "user": { "id": "uuid", "email": "you@example.com", "displayName": "…", "isAdmin": false },
  "profile": { "…": "…" }
}
```

Send it on every protected request:

```http
Authorization: Bearer <jwt>
```

- Tokens are HS256 JWTs with a 7-day TTL and a `jti` row in `auth_sessions`.
- `POST /v1/auth/logout` revokes the session.
- The Express backend accepts the same token (local HMAC verification with
  `AUTH_SECRET`/`JWT_SECRET`, or remote `/v1/auth/verify`).
- Public reads: resumes/roasts by `share_token`, portfolios by public `slug`.

### Dev bypass (Express only)

With `NODE_ENV=development` and `DEV_BYPASS_AUTH=true`, the Express API accepts
any request as `DEV_USER_UID`. Never enable outside local testing.

---

## Conventions

- Requests and responses are JSON (`Content-Type: application/json`).
- The gateway returns `{ "error": "message" }` on failure.
- The Express API returns `{ "success": false, "error": "message" }` (some
  routes include `details`).
- The gateway includes compatibility aliases: list endpoints may return both
  `data` and a named key (`resumes`, `jobs`, `items`, …); single resources return
  `success: true` plus `data`/the named key.
- Timestamps are ISO-8601 strings.
- Tool documents use camelCase keys; the Worker maps snake_case columns to
  camelCase fields.
- Unknown fields are preserved in `data` JSON columns where the endpoint
  supports it.

### Common status codes

| Status | Meaning |
|---|---|
| 200 | OK |
| 201 | Created (signup, create) |
| 400 | Validation error |
| 401 | Missing/invalid/revoked token |
| 403 | Forbidden (admin) |
| 404 | Not found |
| 409 | Conflict (duplicate email/job) |
| 429 | Rate limited |
| 502 | Upstream provider failed (AI/jobs) |
| 503 | Integration not configured (RAPIDAPI/ImageKit/D1) |

---

## Rate Limits

| Scope | Limit |
|---|---|
| Gateway, per IP | 240 requests/min |
| Gateway AI generate, per IP | 20 requests/min |
| Express `/api/*` | 100 requests / 15 min (configurable via `RATE_LIMIT_*`) |
| Express AI routes | Per-route `aiRateLimiter` |

Gateway limits are in-memory per isolate; treat them as abuse damping, not a
billing guarantee. `429` responses include a human-readable `error`.

---

## Domain References

| Doc | Covers |
|---|---|
| [gateway.md](gateway.md) | Every gateway endpoint, request/response shapes |
| [ai-tools.md](ai-tools.md) | Interview + search (Express) |
| [deployment.md](deployment.md) | Payments + 2FA (Express) |
| [github.md](github.md) | Public profiles / GitHub intelligence (Express) |
| [portfolio.md](portfolio.md) | Fellowship API (Express) |
| [portfolio-cms.md](portfolio-cms.md) | Portfolio content/analytics/SEO (Express) |
| [../docs/DATABASE_SCHEMA.md](../docs/DATABASE_SCHEMA.md) | Data models |
| [../docs/PROJECT_DOCUMENTATION.md](../docs/PROJECT_DOCUMENTATION.md) | Backend route map and setup |

### WebSocket events (Express only)

Socket.IO is initialized by `backend/src/config/socket.js` when the backend is
running. Clients connect with the same bearer token; the client only attempts a
connection when `VITE_SOCKET_URL` or `VITE_API_URL` is set. Events cover
presence, kanban updates, scheduled posts, notifications and fellowship chat.
The Cloudflare-only deployment does not include Socket.IO.
