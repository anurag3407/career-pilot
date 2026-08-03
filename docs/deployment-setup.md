# 🚀 Deployment Providers Integration Guide

This guide helps you deploy the frontend of the project using popular platforms. No prior setup is assumed.

> [!NOTE]
> This guide primarily covers frontend deployment. Backend services (Node.js, MongoDB, Redis) should be deployed separately using platforms like Render, Railway, or similar.

---

## 🌐 Supported Platforms

The general continuous integration and deployment flow is:

```mermaid
flowchart LR
    Code[Code] -->|Push| GitHub[GitHub]
    GitHub -->|Trigger| Platform[Deployment Platform]
    Platform -->|Build & Serve| LiveApp[Live App]
```

### ⚙️ General Build Settings
For most platforms, use these standard React/Vite build settings:
- **Framework Preset:** Vite / React
- **Build Command:** `npm run build`
- **Output/Publish Directory:** `dist`
- **Environment Variables:** `VITE_API_URL=https://your-backend-url`

---

## ☁️ Cloudflare Pages

1. **Account Setup:** Go to [Cloudflare Dashboard](https://dash.cloudflare.com) and log in.
2. **Create Project:** Navigate to **Pages → Create Project** and connect your GitHub repository.
3. **Configure Build:** Use the standard settings (Vite, `npm run build`, `dist`).
4. **Environment Variables:** Add `VITE_API_URL`.
5. **Deploy:** Click **Deploy**.

> [!TIP]
> **Troubleshooting:** If the page is blank, verify the output directory is set to `dist`.

---

## 🐙 GitHub Pages

1. **Setup Branch:** Go to repository **Settings → Pages** and select `main` or `gh-pages` branch.
2. **Install Plugin:** Run `npm install gh-pages --save-dev`.
3. **Configure Scripts:** Add this script to `package.json`:
   ```json
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```
4. **Deploy:** Run `npm run build` then `npm run deploy`.

> [!WARNING]
> **Troubleshooting:** If you see a 404 on refresh, it's a Single Page App (SPA) routing issue. Consider using a `404.html` fallback or HashRouter.

---

## 🌍 Netlify

1. **Create Site:** Go to [Netlify](https://netlify.com), log in, and click **Add new site → Import from Git**.
2. **Configure Build:** Apply standard settings (`npm run build`, `dist`).
3. **Environment Variables:** Add `VITE_API_URL`.
4. **Deploy:** Click **Deploy site**.

> [!TIP]
> **Troubleshooting:** To fix SPA routing on Netlify, ensure you have a `_redirects` file in the `public` folder containing: `/* /index.html 200`.

---

## ⚡ Vercel

1. **Create Project:** Go to [Vercel](https://vercel.com) and import your GitHub project.
2. **Configure Build:** Vercel usually auto-detects Vite. If not, use standard settings.
3. **Environment Variables:** Add `VITE_API_URL`.
4. **Deploy:** Click **Deploy**.

> [!TIP]
> **Troubleshooting:** Vercel handles SPA routing automatically out of the box with Vite. If API errors occur, verify that your backend URL is correct.

---

## ✅ Post-Deployment Checklist

- [ ] App loads correctly without blank screens
- [ ] API calls are working (check Network tab)
- [ ] Environment variables are properly applied
- [ ] SPA routing works on page refresh
- [ ] No errors in browser console

> [!CAUTION]
> **Security Reminder:** Never expose backend secrets (like database URIs or private API keys) in frontend environment variables. Only use public keys or URLs (e.g., `VITE_API_URL`).
