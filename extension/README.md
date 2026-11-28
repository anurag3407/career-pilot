# CareerPilot — 1-Click Job Tracker (Chrome Extension)

Manifest V3 extension that captures job listings from **LinkedIn, Indeed,
Greenhouse and Lever** and saves them to the CareerPilot job board.

---

## Features

- **Auto-extraction** — title, company, location, salary and description from
  the page DOM.
- **Gateway sync** — `POST /v1/jobs/track` on the Worker (falls back to
  `/api/jobs/track` when pointed at the Express backend), idempotent per
  `company::title` / `jobId`.
- **Profile match score** — fetches the career profile
  (`GET /v1/db/career-profile`) and scores the listing by keyword overlap
  before you save.
- **Packet deep-link** — after saving, jump to
  `<app>/job-tracker?job=<id>&packet=1` to build the application packet.
- **Status selection** — saved / applied / interviewing / offer.
- **Custom endpoints** — works with production, a self-hosted backend, or
  localhost.

---

## Install

1. Open `chrome://extensions` (or `edge://extensions`).
2. Enable **Developer mode**.
3. Click **Load unpacked** and select the `extension/` directory.
4. Pin the CareerPilot icon.

---

## Configure

Open the extension → **Settings**.

| Field | Default | Notes |
|---|---|---|
| Gateway / API URL | `https://careerpilot.sayalabs.in/gateway/v1` | Use your Worker URL (`…/gateway/v1` or `…/v1`). For the Express backend use `http://localhost:5000/api` |
| Web App URL | `https://careerpilot.sayalabs.in` | Used for the "Open packet" deep link |
| Auth Token | — | Paste the `access_token` from the CareerPilot session (the extension adds `Bearer ` if missing) |

How to get a token today: sign in to the web app, open DevTools →
Application → Local Storage → `careerpilot:d1:session`, and copy
`access_token`. (A dedicated "copy extension token" button in Settings is a
planned improvement.)

The extension detects whether the API URL is a gateway (`…/v1` or `/gateway`)
and calls `/jobs/track` + `/db/career-profile`; otherwise it uses the Express
`/api/jobs/track` + `/api/career-profile` routes.

---

## Usage

1. Open a job posting on LinkedIn, Indeed, Greenhouse or Lever.
2. Click the CareerPilot icon — fields auto-fill.
3. Review the match score (based on your master resume/target roles).
4. Pick a status and click **Save to CareerPilot**.
5. Optionally click **Save & build the packet** to continue in the web app.

---

## Permissions

| Permission | Why |
|---|---|
| `activeTab`, `scripting` | Extract the current job page DOM |
| `storage` | Persist API URL, app URL and token in `chrome.storage.sync` |
| Host permissions | LinkedIn, Indeed, Greenhouse, Lever, localhost, and the configured API host |

No data is sent anywhere except the configured CareerPilot endpoint.

---

## Development

1. Edit `popup.js` / `content.js` / `popup.html` / `popup.css`.
2. Reload the extension from `chrome://extensions` (↻).
3. Point the API URL at `http://localhost:8787/v1` (gateway) or
   `http://localhost:5000/api` (Express backend).

There is no build step and no npm dependency for the extension. `manifest.json`
is the source of truth for version and permissions.
