# Career Pilot — Frontend

React 19 + Vite 7 SPA deployed to **Cloudflare Pages**. It talks to the
gateway Worker (`../worker`) for auth, D1 data and AI, and optionally to the
Express backend (`../backend`) for PDF/deploy/community extras.

## Quick Start

The SPA needs the gateway for login and data. Run both:

From the repository root:

```bash
# Terminal 1 — gateway Worker (D1 + auth + AI)
cd worker
npx wrangler d1 migrations apply DB --local
npx wrangler dev            # http://localhost:8787

# Terminal 2 — frontend
cd frontend
npm install
cp .env.example .env        # defaults work
npm run dev                 # http://localhost:5173
```

Vite proxies `/gateway` → `http://localhost:8787` and `/api` → `http://localhost:5000`.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server on `:5173` |
| `npm run build` | SPA build (`dist`) **and** standalone portfolio shell (`dist-portfolio`) |
| `npm run build:portfolio` | Only the standalone portfolio shell |
| `npm test` | Vitest + Testing Library |
| `npm run lint` | ESLint |
| `npm run preview` | Preview the production build |

## Environment Variables

Copy `.env.example` → `.env`.

| Variable | Default | Purpose |
|---|---|---|
| `VITE_AI_GATEWAY_URL` | `/gateway/v1` | Gateway base for auth, D1 CRUD and AI |
| `VITE_AI_GATEWAY_DEV_URL` | `http://localhost:8787` | Dev proxy target (shell env, not `.env`) |
| `VITE_API_URL` / `VITE_API_BASE` | — / `/api` | Express backend (AI feature endpoints + extras) |
| `VITE_SOCKET_URL` | falls back to `VITE_API_URL` | Optional Socket.IO |
| `VITE_DISABLE_D1_AUTH` | `false` | Bypass native auth in preview builds |
| `VITE_CDN_URL` | `/` | Vite base for CDN assets (shell env) |

Legacy `VITE_SUPABASE_*`, `VITE_CLERK_*` and `VITE_APPWRITE_*` keys are only read
by legacy modules and are not needed for the D1 core.

## Structure

```text
src/
├── App.jsx              # route tree (public, protected, hubs, admin, shares)
├── context/             # Auth, Theme, Socket, Portfolio, Resume providers
├── services/
│   ├── api.js           # facade used by pages
│   ├── d1Data.js        # D1 CRUD via /gateway/v1/db
│   ├── aiGateway.js     # /gateway/v1/ai
│   ├── imagekit.js      # signed uploads
│   └── atsPdfExport.js  # client PDF export
├── components/
│   ├── resume/templates/     # 60 resume templates
│   ├── portfolio/templates/  # 262 portfolio templates
│   └── ui/                   # primitives
├── pages/               # 50+ route screens
├── stores/              # Zustand (AI/GitHub config)
├── data/                # portfolioTemplates registry + metadata
├── standalone/          # standalone portfolio bundle entry
└── utils/               # PDF extraction, sanitizers, export helpers
```

## Data & AI

- **Auth:** `context/AuthProvider.jsx` → `config/d1.js` (`d1Auth`).
- **Data:** `services/api.js` delegates core tools to `services/d1Data.js`;
  Express-only tools go to `/api`.
- **AI:** `services/aiGateway.js` sends `X-AI-*` headers (BYOK) or uses platform
  mode. Settings → AI Provider manages the 30-provider catalog.

## Testing & Build Notes

```bash
npm test
npm run build           # SPA + portfolio shell
npm run build:portfolio # backend tests read this output
```

Backend portfolio-generator tests read `dist-portfolio/standalone.html`, so run
`npm run build:portfolio` before backend tests locally. CI builds it once in the
frontend job and restores it for the backend job.

## Deployment

See [../docs/deployment-setup.md](../docs/deployment-setup.md). Pages project:
`careerpilot`, build `npm run build`, output `dist`, env
`VITE_AI_GATEWAY_URL=/gateway/v1`.
