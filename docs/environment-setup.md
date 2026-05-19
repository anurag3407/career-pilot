# Environment Setup Guide

This guide explains how to configure environment variables for CareerPilot across different environments.

---

## How It Works

1. Copy the example files to create your local `.env` files:
```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
```
2. Fill in your actual values in the `.env` files
3. Never commit `.env` files to version control — they are already listed in `.gitignore`

---

## Environments

CareerPilot uses three environments:

| Environment | Purpose |
|---|---|
| **development** | Local development on your machine |
| **staging** | Testing before releasing to production |
| **production** | Live app used by real users |

---

## Development

Local setup for contributors. Runs entirely on your machine.

### Backend (`backend/.env`)

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/career-pilot
REDIS_URL=redis://localhost:6379
GEMINI_API_KEY=AIzaSy-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RAPIDAPI_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RAPIDAPI_HOST=jsearch.p.rapidapi.com
FIREBASE_PROJECT_ID=xxxxxxxxxxxxxxxx
FIREBASE_STORAGE_BUCKET=xxxxxxxxxxxxxxxx.appspot.com
FIREBASE_SERVICE_ACCOUNT_PATH=./path/to/service-account-key.json
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SERVICE_URL=https://email-service.example.com
EMAIL_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
LINKEDIN_CLIENT_ID=xxxxxxxxxxxxxxxx
LINKEDIN_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
LINKEDIN_REDIRECT_URI=http://localhost:5000/api/auth/linkedin/callback
TOTP_ENCRYPTION_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
ALERT_CRON_SCHEDULE="0 */6 * * *"
ALERT_TEST_INTERVAL=
ENABLE_DB_PROFILING=false
DEV_BYPASS_AUTH=false
DEV_USER_UID=dev-user-001
DEV_USER_EMAIL=dev@example.com
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000
VITE_API_BASE=http://localhost:5000/api
VITE_FIREBASE_API_KEY=AIzaSy-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=xxxxxxxxxxxxxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=xxxxxxxxxxxxxxxx
VITE_FIREBASE_STORAGE_BUCKET=xxxxxxxxxxxxxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=1:000000000000:web:xxxxxxxxxxxxxxxx
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_MAX_SIZE_MB=5
```

### Notes
- `DEV_BYPASS_AUTH=false` — set to `true` only to skip Firebase login during local testing
- `ALERT_TEST_INTERVAL` — set a value in milliseconds (e.g. `10000` for 10 seconds) to test job alerts faster locally
- `ENABLE_DB_PROFILING=false` — set to `true` to log slow MongoDB queries while debugging

---

## Staging

Used for testing the full app before pushing to production. Mirrors production settings but uses test credentials.

### Key differences from development

| Variable | Development | Staging |
|---|---|---|
| `NODE_ENV` | `development` | `staging` |
| `MONGODB_URI` | local MongoDB | separate Atlas cluster |
| `REDIS_URL` | local Redis | Upstash or Redis Cloud |
| `FRONTEND_URL` | `http://localhost:5173` | staging frontend URL |
| `RAZORPAY_KEY_ID` | `rzp_test_` prefix | `rzp_test_` prefix |
| `DEV_BYPASS_AUTH` | optional `true` | always `false` |
| `ENABLE_DB_PROFILING` | optional `true` | `true` |
| `EMAIL_SERVICE_URL` | not needed | deployed email service URL |

### Notes
- Always use **test credentials** for Razorpay in staging — never real payment keys
- Set `ENABLE_DB_PROFILING=true` in staging to catch slow queries before they hit production
- `DEV_BYPASS_AUTH` must always be `false` in staging

---

## Production

The live environment. All values must be real, secure, and set as environment variables on your hosting platform — never in a `.env` file on the server.

### Key differences from staging

| Variable | Staging | Production |
|---|---|---|
| `NODE_ENV` | `staging` | `production` |
| `RAZORPAY_KEY_ID` | `rzp_test_` prefix | `rzp_live_` prefix |
| `FRONTEND_URL` | staging URL | live frontend URL |
| `ENABLE_DB_PROFILING` | `true` | `false` |
| `ALERT_TEST_INTERVAL` | optional | must be empty |
| `DEV_BYPASS_AUTH` | `false` | `false` |

### Notes
- Set all variables directly in your hosting platform dashboard (Railway, Render, Heroku etc.) — do not use a `.env` file
- Use **live Razorpay keys** (`rzp_live_` prefix) only in production
- `ENABLE_DB_PROFILING` must be `false` — profiling adds overhead and slows down the app
- `DEV_BYPASS_AUTH` must always be `false` — setting it to `true` would let anyone access the app without logging in
- Rotate `TOTP_ENCRYPTION_KEY` and `RAZORPAY_KEY_SECRET` immediately if they are ever exposed

---

## Getting Your Credentials

| Service | Where to get it |
|---|---|
| **Firebase** | [Firebase Console](https://console.firebase.google.com) > Project Settings |
| **Google Gemini** | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| **Groq** | [Groq Console](https://console.groq.com) |
| **RapidAPI / JSearch** | [RapidAPI](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch) |
| **Razorpay** | [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys) |
| **LinkedIn OAuth** | [LinkedIn Developers](https://www.linkedin.com/developers/apps) |
| **Gmail App Password** | [Google Account](https://myaccount.google.com/apppasswords) |
| **TOTP Key** | Run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

---

## Security Checklist

Before deploying, make sure:

- [ ] `.env` files are in `.gitignore` and never committed
- [ ] `DEV_BYPASS_AUTH=false` in staging and production
- [ ] `ENABLE_DB_PROFILING=false` in production
- [ ] Razorpay live keys are only used in production
- [ ] `TOTP_ENCRYPTION_KEY` is a unique 64-char hex string
- [ ] `RAZORPAY_KEY_SECRET` is never exposed to the frontend
- [ ] `ALERT_TEST_INTERVAL` is empty in staging and production