# Gateway Worker API Reference

> **Base URL:** `https://<origin>/gateway/v1` (production) or
> `http://localhost:8787/v1` (`wrangler dev`)
> **Source:** `worker/src/index.js`, `worker/src/auth.js`, `worker/src/db.js`
> **Auth:** `Authorization: Bearer <D1 JWT>` on protected routes

The Worker accepts every path with or without the `/gateway` prefix (the router
strips it), so `/gateway/v1/health` and `/v1/health` are equivalent.

---

## Table of Contents

- [Health](#health)
- [Authentication](#authentication)
- [Profiles & Settings](#profiles--settings)
- [Resumes](#resumes)
- [Jobs, Alerts & Listings](#jobs-alerts--listings)
- [Career Profiles & STAR Stories](#career-profiles--star-stories)
- [Interviews](#interviews)
- [Portfolios & Deployments](#portfolios--deployments)
- [Roasts & Cover Letters](#roasts--cover-letters)
- [Notifications & Activity](#notifications--activity)
- [GitHub, Outreach & Intake](#github-outreach--intake)
- [AI](#ai)
- [Job Search Proxy](#job-search-proxy)
- [Extension Tracking](#extension-tracking)
- [ImageKit](#imagekit)
- [Errors](#errors)

---

## Health

```http
GET /v1/health
```

```json
{
  "ok": true,
  "service": "careerpilot-gateway",
  "database": "cloudflare-d1",
  "d1": true,
  "tables": 28,
  "auth": true,
  "imagekit": false
}
```

No auth. Used by `scripts/verify-deploy.mjs` and uptime checks.

---

## Authentication

### Sign up

```http
POST /v1/auth/signup        (alias: /v1/auth/register)
Content-Type: application/json

{ "email": "you@example.com", "password": "secret123", "fullName": "Ada Lovelace" }
```

201 response:

```json
{
  "success": true,
  "access_token": "<jwt>",
  "expires_at": "2026-12-05T12:00:00.000Z",
  "user": { "id": "uuid", "email": "you@example.com", "displayName": "Ada Lovelace", "isAdmin": false },
  "profile": { "id": "uuid", "email": "you@example.com", "full_name": "Ada Lovelace" }
}
```

Errors: `400` invalid email/password (<6 chars), `409` email exists.

### Log in

```http
POST /v1/auth/login
{ "email": "you@example.com", "password": "secret123" }
```

Returns the same session payload. Updates `last_login_at`.

### Log out

```http
POST /v1/auth/logout
Authorization: Bearer <jwt>
```

Revokes the `auth_sessions` row (`revoked = 1`).

### Current user

```http
GET /v1/auth/me          (aliases: /v1/auth/session, /v1/auth/user)
POST /v1/auth/verify
Authorization: Bearer <jwt>
```

```json
{ "success": true, "user": { "…": "…" }, "profile": { "…": "…" } }
```

`401` when the token is missing, expired, or revoked.

### Refresh

```http
POST /v1/auth/refresh
Authorization: Bearer <jwt>
```

Issues a fresh token/session; the old session is revoked.

### Providers

```http
GET /v1/auth/providers
→ { "email": true, "google": false, "github": false }
```

### OAuth

```http
GET /v1/auth/oauth/google?redirect_to=/dashboard
GET /v1/auth/oauth/github?redirect_to=/dashboard
```

302 to the provider. Callback (handled by the Worker):

```text
GET /v1/auth/oauth/<provider>/callback?code=…&state=…
```

On success the Worker upserts the user, creates a session, and redirects to
`<frontend>/auth/callback?token=…&redirect_to=…`. State rows expire after
10 minutes.

Required secrets: `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`,
`GITHUB_CLIENT_ID`/`GITHUB_CLIENT_SECRET`. Optional overrides:
`GOOGLE_OAUTH_REDIRECT_URI`, `GITHUB_OAUTH_REDIRECT_URI`.

---

## Profiles & Settings

| Method | Path | Notes |
|---|---|---|
| `GET` | `/v1/db/profiles/me` | `{success, profile, user}` |
| `PUT/PATCH` | `/v1/db/profiles/me` | Partial update; accepts camelCase or snake_case |
| `POST` | `/v1/db/profiles/me/avatar` | `{avatarUrl}`; also updates `users.avatar_url` |
| `DELETE` | `/v1/db/profiles/me/avatar` | Clears both |
| `GET` | `/v1/db/profiles/:uid` | Public profile view |
| `GET` | `/v1/db/profiles/:uid/stats` | Counts for resumes/jobs/etc. |
| `GET` | `/v1/db/profiles/:uid/activity` | Recent activity |
| `GET` | `/v1/db/settings` | `{settings}` with defaults when absent |
| `PUT/POST` | `/v1/db/settings` | Merge notification/AI/theme prefs |

Profile update body fields include `displayName`/`name`, `username`, `jobRole`,
`headline`, `location`, `website`, `bio`, `yearsOfExperience`, `skills`,
`avatarUrl`, `github`, `linkedin`, `preferences`, `plan`, `isPro`.

---

## Resumes

| Method | Path | Notes |
|---|---|---|
| `GET` | `/v1/db/resumes` | List (`{data, resumes}`) |
| `GET` | `/v1/db/resumes?id=:id` | Single, or public resume |
| `POST` | `/v1/db/resumes` | Create; if `id` exists for the user, updates |
| `GET` | `/v1/db/resumes/:id` | Single |
| `PUT/PATCH` | `/v1/db/resumes/:id` | Merge update |
| `DELETE` | `/v1/db/resumes/:id` | Delete |
| `DELETE` | `/v1/db/resumes?id=:id` | Delete (bulk-style) |
| `GET` | `/v1/db/resumes/share/:token` | Public read by share token (no auth) |
| `GET` | `/v1/db/resumes/:id/versions` | List snapshots |
| `POST` | `/v1/db/resumes/:id/versions` | Create snapshot (`{versionLabel, data}`) |
| `PUT/PATCH` | `/v1/db/resumes/:id/versions/:versionId` | Update snapshot |
| `DELETE` | `/v1/db/resumes/:id/versions/:versionId` | Delete snapshot |
| `POST` | `/v1/db/resumes/:id/versions/:versionId/restore` | Restore into the resume |
| `GET` | `/v1/db/resumes/:id/ats-history` | Score history |
| `POST` | `/v1/db/resumes/:id/ats-history` | Append `{score, data}` |

Create body accepts `title`, `originalText`, `enhancedText`, `jobRole`,
`targetRole`, `atsScore`, `pdfUrl`, `preferences`, `template`, plus the
structured fields (`personalInfo`, `summary`, `experience`, `education`,
`skills`, `projects`, `certifications`, `data`).

---

## Jobs, Alerts & Listings

### Tracked jobs

| Method | Path | Notes |
|---|---|---|
| `GET` | `/v1/db/jobs` | Board list (`{jobs, trackedJobs, data}`) |
| `GET` | `/v1/db/jobs/:id` | Single |
| `POST` | `/v1/db/jobs` | Requires `company`, `title`; `jobId` dedupes per user |
| `PUT/PATCH` | `/v1/db/jobs/:id` | Merge update (packet, offer, rejection, next action…) |
| `PATCH/POST` | `/v1/db/jobs/:id/status` | `{status, notes?}`; sets `applied_at` when applied |
| `DELETE` | `/v1/db/jobs/:id` | Delete |
| `DELETE` | `/v1/db/jobs?id=:id` | Delete by query |

Board stats are computed client-side in `d1Data.js` (`trackerData.getStats`) from
the full list; there is no `/v1/db/jobs/stats` endpoint.

### Alerts

| Method | Path | Notes |
|---|---|---|
| `GET` | `/v1/db/alerts` | List |
| `POST` | `/v1/db/alerts` | Create |
| `GET` | `/v1/db/alerts/:id` | Single |
| `PUT/PATCH` | `/v1/db/alerts/:id` | Update |
| `DELETE` | `/v1/db/alerts/:id` | Delete |
| `POST` | `/v1/db/alerts/:id/toggle` | Flip `is_active` |

Alert stats are computed client-side (`alertData.getStats`), not by the Worker.

### Listings

```http
GET  /v1/db/job-listings          # latest 100
POST /v1/db/job-listings          # create/upsert (auth required)
```

Shared cache of job listings (not user-owned).

---

## Career Profiles & STAR Stories

| Method | Path | Notes |
|---|---|---|
| `GET` | `/v1/db/career-profile` | Returns an empty shape when absent |
| `PUT/POST` | `/v1/db/career-profile` | Upsert `masterResumeText`, `targetRoles`, `weeklyApplyTarget`, `data` |
| `GET` | `/v1/db/star-stories` | List |
| `POST` | `/v1/db/star-stories` | Create |
| `PUT/PATCH` | `/v1/db/star-stories/:id` | Update |
| `DELETE` | `/v1/db/star-stories/:id` | Delete |

The Chrome extension reads/writes the career profile to score listings.

---

## Interviews

| Method | Path | Notes |
|---|---|---|
| `GET` | `/v1/db/interviews` | List sessions |
| `POST` | `/v1/db/interviews` | Create (`jobRole`, `interviewType`, `difficulty`, `questions[]`, `trackedJobId`…) |
| `GET` | `/v1/db/interviews/:id` | Session detail |
| `PUT/PATCH` | `/v1/db/interviews/:id` | Update status/feedback |
| `GET` | `/v1/db/interviews/:id/answers` | Answers |
| `POST` | `/v1/db/interviews/:id/answers` | Append (`transcript`, `code`, `feedback`, `duration`) |

---

## Portfolios & Deployments

| Method | Path | Notes |
|---|---|---|
| `GET` | `/v1/db/portfolios` | List; `?slug=` returns a portfolio without auth (see note) |
| `POST` | `/v1/db/portfolios` | Create (`slug`, `templateId`, `title`, `sections`, `theme`) |
| `GET` | `/v1/db/portfolios/:id` | Single |
| `PUT/PATCH` | `/v1/db/portfolios/:id` | Update |
| `DELETE` | `/v1/db/portfolios/:id` | Delete |
| `GET` | `/v1/db/portfolio-deployments` | Deployment history |
| `POST` | `/v1/db/portfolio-deployments` | Record `{portfolioId, provider, url, status, logs}` |

`slug` is unique per user. **Current behavior (documented as-is):** an
anonymous `GET /v1/db/portfolios?slug=…` prefers `is_public = 1` but falls back
to any row with that slug. Treat slugs as public identifiers until that fallback
is removed; see the security gaps in `ARCHITECTURE.md`.

---

## Roasts & Cover Letters

| Method | Path | Notes |
|---|---|---|
| `GET` | `/v1/db/roasts` | History |
| `POST` | `/v1/db/roasts` | Save roast result |
| `GET` | `/v1/db/roasts/:id` | Single |
| `DELETE` | `/v1/db/roasts/:id` | Delete |
| `GET` | `/v1/db/roasts/share/:token` | Public share (no auth) |
| `GET` | `/v1/db/cover-letters` | List |
| `POST` | `/v1/db/cover-letters` | Create |
| `DELETE` | `/v1/db/cover-letters/:id` | Delete |

---

## Notifications & Activity

| Method | Path | Notes |
|---|---|---|
| `GET` | `/v1/db/notifications` | Latest 50 |
| `POST` | `/v1/db/notifications` | Create |
| `PATCH` | `/v1/db/notifications/:id/read` | Mark read |
| `GET` | `/v1/db/ai-usage` | Recent AI usage rows for the user |

---

## GitHub, Outreach & Intake

| Method | Path | Notes |
|---|---|---|
| `GET/POST` | `/v1/db/github-builds` | GitHub portfolio builds |
| `GET/POST` | `/v1/db/outreach` | Outreach records |
| `GET/POST` | `/v1/db/user-inputs` | Resume intake |
| `POST` | `/v1/db/recruiter-analysis` | Upsert analysis for `jobTitle` |
| `GET` | `/v1/db/recruiter-analysis/leaderboard` | Public leaderboard |

---

## AI

### Generate

```http
POST /v1/ai/generate
Content-Type: application/json

{
  "prompt": "Rewrite this bullet…",
  "system": "You are a resume editor.",
  "feature": "resume-enhance"
}
```

or

```json
{
  "messages": [
    { "role": "system", "content": "…" },
    { "role": "user", "content": "…" }
  ],
  "provider": "openai",
  "model": "gpt-4o-mini"
}
```

200 response:

```json
{
  "text": "…",
  "provider": "openai",
  "model": "gpt-4o-mini",
  "usage": { "prompt_tokens": 120, "completion_tokens": 340 }
}
```

BYOK headers (override platform keys):

```http
X-AI-Provider: groq
X-AI-Key: gsk_…
X-AI-Model: llama-3.3-70b-versatile
X-AI-Base-Url: https://api.groq.com/openai/v1
X-Feature: cover-letter
```

Resolution order: headers → body → `DEFAULT_AI_PROVIDER` (`cloudflare`).
Provider ids are normalised (`claude`→`anthropic`, `google`→`gemini`).

Providers: `cloudflare`, `gemini`, `anthropic`, plus the OpenAI-compatible
registry (`openai`, `groq`, `openrouter`, `requesty`, `deepseek`, `mistral`,
`xai`, `together`, `fireworks`, `perplexity`, `cohere`, `cerebras`,
`sambanova`, `hyperbolic`, `novita`, `moonshot`, `zhipu`, `dashscope`,
`nebius`, `chutes`, `github`, `ollama`, `lmstudio`, `vllm`, `llamacpp`,
`azure`) and `custom`.

Errors: `400` no prompt/messages; `502` provider failure; `429` rate limit.

### Validate key

```http
POST /v1/ai/validate-key
{ "provider": "openai", "apiKey": "sk-…", "model": "gpt-4o-mini" }
```

Returns `{valid: true, models?: [...]}` or `{valid: false, error}`.

### Models

```http
GET  /v1/ai/models?provider=openai
POST /v1/ai/models   { "provider": "openai", "apiKey": "sk-…" }
```

Live `/models` lookup where the provider supports it, with a static catalog
fallback (`STATIC_MODEL_CATALOG`).

---

## Job Search Proxy

```http
POST /v1/jobs/search
{
  "query": "software engineer",
  "location": "Remote",
  "page": 1,
  "num_pages": 1,
  "datePosted": "week",
  "employmentTypes": "fulltime"
}
```

Proxies `jsearch.p.rapidapi.com/search`. Returns the provider payload.
`503` when `RAPIDAPI_KEY` is unset; `502` on upstream failure.

---

## Extension Tracking

```http
POST /v1/jobs/track
Authorization: Bearer <jwt>
{
  "title": "Frontend Engineer",
  "company": "Acme",
  "location": "Remote",
  "status": "saved",
  "jobUrl": "https://…",
  "description": "…",
  "notes": "…"
}
```

- Requires `title` and `company` (400 otherwise).
- Idempotency key: `jobId` or `company::title` (lowercased, 180 chars).
- Repeat calls return `alreadyTracked: true` with the existing row.
- Inserts `tracked_jobs` with `source: "extension"`.

201/200 response:

```json
{ "success": true, "alreadyTracked": false, "trackedJob": { "…": "…" }, "data": { "…": "…" } }
```

---

## ImageKit

### Upload signature

```http
GET /v1/imagekit/auth
→ { "token": "…", "expire": 1764…, "signature": "…", "publicKey": "public_…", "urlEndpoint": "https://ik.imagekit.io/…" }
```

HMAC-SHA1 signature valid for 30 minutes. `503` when
`IMAGEKIT_PRIVATE_KEY` is missing.

### Server-side upload

```http
POST /v1/imagekit/upload
Content-Type: multipart/form-data
file=@avatar.png
```

or JSON `{ "file": "<base64>", "fileName": "avatar.png", "folder": "/avatars" }`.
Maximum 10 MB. Returns the ImageKit upload result.

---

## Errors

| Status | Meaning |
|---|---|
| 400 | Bad request / validation |
| 401 | Missing, invalid, expired or revoked token |
| 403 | Not allowed |
| 404 | Not found (or not owned by the caller) |
| 405 | Method not allowed |
| 409 | Duplicate (email, slug) |
| 429 | Rate limit (240/min per IP; 20/min for AI) |
| 500 | Unhandled error |
| 502 | Upstream provider failure |
| 503 | D1/RapidAPI/ImageKit not configured |

Error body:

```json
{ "error": "human-readable message" }
```

CORS: `ALLOWED_ORIGINS` (currently `*`). `OPTIONS` returns 204.
