# Environment Setup Guide

Career Pilot has **three configuration surfaces**. Most contributors only need
the first two.

| Surface | Where it lives | Applied at |
|---|---|---|
| Frontend | `frontend/.env` (Vite `VITE_*`) | Build time |
| Gateway Worker | `worker/wrangler.toml` vars + `wrangler secret put` | Deploy time |
| Optional Express backend | `backend/.env` | Process start |

Auth, profiles, resumes, jobs, alerts, portfolios, career profile, interview
CRUD, settings, notifications and generic AI generation need **only the
frontend + Worker + D1**. The Express backend is optional but required for the
feature-specific AI endpoints (`/api/enhance`, `/api/interview`, `/api/roast`,
`/api/cover-letter`, README/LinkedIn tools) and PDF/portfolio deploy.

---

## How It Works

- Vite inlines `VITE_*` variables into the browser bundle at build time. Treat
  them as public.
- Worker secrets are encrypted by Cloudflare and available as `env.*` at
  runtime. They never reach the browser.
- `worker/wrangler.toml` `[vars]` are plaintext, non-secret configuration
  (`ALLOWED_ORIGINS`, `DEFAULT_AI_PROVIDER`, ImageKit public key, account id).
- The dev server proxies `/gateway` → `http://localhost:8787` and `/api` →
  `http://localhost:5000` (see `frontend/vite.config.js`), so local `.env` can
  stay almost empty.

---

## Frontend (`frontend/.env`)

Copy `frontend/.env.example` → `frontend/.env`.

| Variable | Default | Purpose |
|---|---|---|
| `VITE_AI_GATEWAY_URL` | `/gateway/v1` | Gateway base URL. All auth, D1 CRUD and AI calls use it. |
| `VITE_AI_GATEWAY_DEV_URL` | `http://localhost:8787` | Dev proxy target for `/gateway`; `vite.config.js` reads it from the shell env, not `.env`. |
| `VITE_API_URL` | — | Express backend origin (required for AI feature endpoints + PDF/deploy extras). |
| `VITE_API_BASE` | `/api` | Express API prefix used by `services/api.js` fallbacks. |
| `VITE_SOCKET_URL` | falls back to `VITE_API_URL` | Socket.IO server (optional). |
| `VITE_DISABLE_D1_AUTH` | `false` | Set `true` to bypass native auth in preview builds. |
| `VITE_CDN_URL` | `/` | Vite `base` for serving assets from a CDN (read from the shell env at build time). |

Legacy variables (`VITE_SUPABASE_*`, `VITE_CLERK_PUBLISHABLE_KEY`,
`VITE_APPWRITE_*`, `VITE_MAX_SIZE_MB`, `VITE_ENABLE_PREMIUM_THEMES`) are
unused or only read by legacy modules and are **not required** for the D1 core.
Upload limits are code constants (5 MB client PDF, 10 MB gateway).

Production example:

```bash
VITE_AI_GATEWAY_URL=/gateway/v1        # same-origin Worker route (recommended)
# or: VITE_AI_GATEWAY_URL=https://careerpilot-gateway.<subdomain>.workers.dev/gateway/v1
```

---

## Gateway Worker (`worker/`)

### Bindings and vars (`wrangler.toml`)

| Name | Kind | Notes |
|---|---|---|
| `DB` | D1 binding | `careerpilot-db`; migrations in `worker/migrations`. |
| `AI` | Workers AI binding | Used when `provider=cloudflare` and no BYOK key. |
| `ALLOWED_ORIGINS` | var | `*` today; set an explicit comma-separated list in production. |
| `DEFAULT_AI_PROVIDER` | var | `cloudflare`. |
| `CLOUDFLARE_ACCOUNT_ID` | var | Workers AI REST calls and live model discovery. |
| `IMAGEKIT_PUBLIC_KEY` | var | Public ImageKit key. |
| `IMAGEKIT_URL_ENDPOINT` | var | e.g. `https://ik.imagekit.io/<account>`. |

### Secrets

Set from `worker/` with `npx wrangler secret put <NAME>`.

| Secret | Required | Purpose |
|---|---|---|
| `AUTH_SECRET` | **Yes** | Signs HS256 JWTs and verifies sessions. |
| `CLOUDFLARE_API_TOKEN` | Optional | REST fallback for Workers AI if the binding is unavailable. |
| `GEMINI_API_KEY` | Optional | Gemini provider. |
| `OPENAI_API_KEY` | Optional | OpenAI provider. |
| `GROQ_API_KEY` | Optional | Groq provider. |
| `OPENROUTER_API_KEY` | Optional | OpenRouter provider. |
| `ANTHROPIC_API_KEY` | Optional | Anthropic provider. |
| `RAPIDAPI_KEY` | Optional | `/v1/jobs/search` (JSearch). |
| `RAPIDAPI_HOST` | Optional | Defaults to `jsearch.p.rapidapi.com`. |
| `IMAGEKIT_PRIVATE_KEY` | Optional | `/v1/imagekit/auth` and `/v1/imagekit/upload`. |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Optional | Google OAuth. |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | Optional | GitHub OAuth. |
| `GOOGLE_OAUTH_REDIRECT_URI` / `GITHUB_OAUTH_REDIRECT_URI` | Optional | Override the callback URL. |

OAuth callback default:
`https://<public-origin>/gateway/v1/auth/oauth/<provider>/callback`.

Local development:

```bash
cd worker
npx wrangler d1 migrations apply DB --local
npx wrangler dev            # http://localhost:8787
# optional, for auth persistence in production only:
npx wrangler secret put AUTH_SECRET
```

`wrangler dev` reads secrets from `.dev.vars` if present; never commit it.

### Verify

```bash
curl -s http://localhost:8787/v1/health
# { "ok": true, "database": "cloudflare-d1", "d1": true, "tables": 28, ... }
```

---

## Optional Express Backend (`backend/.env`)

Copy `backend/.env.example` → `backend/.env`. Only needed if you run the
self-hosted extras.

### Server and D1 bridge

| Variable | Purpose |
|---|---|
| `PORT` | HTTP port (default `5000`). |
| `NODE_ENV` | `development` / `staging` / `production` / `test`. |
| `FRONTEND_URL` | Allowed origin; **required** in production (origin only, no path). |
| `CLOUDFLARE_D1_GATEWAY_URL` | Gateway base for D1 reads and token verification. |
| `AI_GATEWAY_URL` | Alias for the same value. |
| `AUTH_SECRET` / `JWT_SECRET` | Local verification of D1 JWTs (same value as the Worker). |
| `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_D1_DATABASE_ID`, `CLOUDFLARE_API_TOKEN` | Optional direct D1 REST access. |
| `MONGODB_URI` | Mongo for legacy Express features. |
| `ENABLE_DB_PROFILING` | Slow-query logging. |
| `REDIS_URL` | BullMQ/Socket.IO/cache. |

### Auth and integrations

| Variable | Purpose |
|---|---|
| `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Legacy auth fallback. |
| `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | Legacy Clerk fallback. |
| `APPWRITE_ENDPOINT`, `APPWRITE_PROJECT_ID`, `APPWRITE_API_KEY` | Legacy community/storage. |
| `ADMIN_EMAILS`, `ADMIN_UIDS` | Admin allow-lists. |
| `DEV_BYPASS_AUTH`, `DEV_USER_EMAIL`, `DEV_USER_UID` | Local-only bypass. |
| `ENCRYPTION_KEY`, `TOTP_ENCRYPTION_KEY` | 32-byte hex keys for token/2FA encryption. |
| `GITHUB_TOKEN_ENCRYPTION_KEY` | At-rest encryption for GitHub OAuth tokens. |

### AI, jobs, email, payments, deploy

| Category | Variables |
|---|---|
| AI | `GEMINI_API_KEY`, `OPENAI_API_KEY`, `GROQ_API_KEY`, `ANTHROPIC_API_KEY`, `AI_PROVIDER` |
| Jobs | `RAPIDAPI_KEY`, `RAPIDAPI_HOST`, `LINKDAPI_API_KEY` |
| Email | `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_SERVICE_URL`, `EMAIL_API_KEY` |
| Alerts | `ALERT_CRON_SCHEDULE`, `ALERT_TEST_INTERVAL`, `ENABLE_GITHUB_SYNC_CRON` |
| Rate limiting | `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX_REQUESTS` |
| Payments | `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` |
| LinkedIn | `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, `LINKEDIN_REDIRECT_URI` |
| GitHub | `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GITHUB_OAUTH_REDIRECT_URI` |
| Deploy | `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_WEBHOOK_SECRET`, `NETLIFY_ACCESS_TOKEN`, `VERCEL_TOKEN` |
| Feature flags | `ENABLE_PREMIUM_THEMES`, `ALLOW_DEV_DB_MUTATIONS` |

See `backend/.env.example` for every entry with inline descriptions.

---

## Environments

| Setting | Development | Production |
|---|---|---|
| Frontend gateway | `/gateway/v1` (vite proxy → `:8787`) | `/gateway/v1` (same-origin Worker route) or absolute Worker URL |
| Express API | `http://localhost:5000` | `VITE_API_BASE` pointing at your Node host, if used |
| Worker secrets | `.dev.vars` (optional) | `wrangler secret put` |
| D1 | `--local` | `--remote` (CI applies migrations) |
| `ALLOWED_ORIGINS` | `*` is fine | Explicit origin list |
| `DEV_BYPASS_AUTH` | may be `true` for backend testing | must be `false` |
| OAuth callbacks | `http://localhost:8787/gateway/v1/auth/oauth/*/callback` | `https://<public-origin>/gateway/v1/auth/oauth/*/callback` |

Staging can mirror production with a separate Pages project/Worker and a D1
preview or second database.

---

## Getting Credentials

| Service | Where |
|---|---|
| Cloudflare API token | <https://dash.cloudflare.com/profile/api-tokens> — Workers Scripts: Edit, Pages: Edit, D1: Edit |
| Cloudflare account id | Dashboard sidebar / any zone overview |
| Gemini | <https://aistudio.google.com/app/apikey> |
| OpenAI | <https://platform.openai.com/api-keys> |
| Groq | <https://console.groq.com> |
| OpenRouter | <https://openrouter.ai/keys> |
| Anthropic | <https://console.anthropic.com/settings/keys> |
| RapidAPI JSearch | <https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch> |
| ImageKit | <https://imagekit.io/dashboard/developer/api-keys> |
| Google OAuth | <https://console.cloud.google.com/apis/credentials> |
| GitHub OAuth | <https://github.com/settings/applications/new> |
| Razorpay | <https://dashboard.razorpay.com/app/keys> |

---

## Security Checklist

- `.env`, `.dev.vars` and `wrangler.toml` secrets are never committed.
- No server-only secret is exposed through a `VITE_` variable.
- `AUTH_SECRET` is a long random value and matches the Express
  `AUTH_SECRET`/`JWT_SECRET` if the backend verifies tokens locally.
- `ALLOWED_ORIGINS` is an explicit origin list in production.
- `DEV_BYPASS_AUTH` is `false` outside local development.
- OAuth callback URLs match the deployed origin exactly.
- `ENCRYPTION_KEY` and `TOTP_ENCRYPTION_KEY` are 64-character hex strings
  generated with a CSPRNG.
- Rotate any key that has ever been pasted into a chat, issue or commit.
