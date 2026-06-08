<div align="center">
  <h1>🚀 Career Pilot</h1>
  <p>An AI-powered resume builder and career toolkit that helps users create resumes, prepare for interviews, search jobs, and launch developer portfolios.</p>
  
</div>

<div align="center" style="max-width:900px; margin:12px auto;">
  <p style="margin-bottom:10px; text-align:center; font-size:1.05rem; color:var(--text-color, #e6edf3);">
    Full-stack web app combining modern frontend and backend tooling
  </p>
  <!-- Primary stack -->
  <p style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin:8px 0;">
    <img src="https://img.shields.io/badge/Node.js-20-green?logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express-4.18-lightgrey?logo=express&logoColor=black" alt="Express" />
    <img src="https://img.shields.io/badge/MongoDB-6.0-darkgreen?logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Redis-7.0-d9932e?logo=redis&logoColor=white" alt="Redis" />
    <img src="https://img.shields.io/badge/Socket.IO-4-cyan?logo=socket.io&logoColor=white" alt="Socket.IO" />
  </p>

  <!-- Frontend & Infra -->
  <p style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin:6px 0 0 0;">
    <img src="https://img.shields.io/badge/React-19-blue?logo=react&logoColor=white" alt="React" />
    <img src="https://img.shields.io/badge/Vite-7.3.5-brightgreen?logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/TailwindCSS-4-skyblue?logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
    <img src="https://img.shields.io/badge/Firebase-auth-orange?logo=firebase&logoColor=white" alt="Firebase" />
    <img src="https://img.shields.io/badge/Cloudinary-Storage-4ea8ff?logo=cloudinary&logoColor=white" alt="Cloudinary" />
  </p>
</div>

## Overview

Career Pilot is a full-stack web application built to help job seekers and developers accelerate career readiness with AI-enhanced resume creation, interview preparation, job discovery, portfolio publishing, and real-time collaboration.

The project combines a React + Vite frontend with an Express backend, Firebase authentication, AI providers (Gemini / OpenAI / Groq), job search integration, and portfolio deployment capabilities.

## Why This Project

- Enables non-technical users to build polished resumes quickly
- Supports AI-powered resume enrichment, interview coaching, and job search
- Includes portfolio builder and live deploy workflows for developers
- Designed for contributors with a modular frontend/backend architecture

## Key Features

- AI resume builder with smart content generation and formatting
- PDF export and resume download using `jsPDF` + `html2canvas`
- Firebase authentication and session management
- Job search and alerts powered by RapidAPI JSearch
- Portfolio templates and deployment support
- Real-time features with Socket.IO
- Responsive UI with TailwindCSS and Framer Motion
- Admin and community tools for job seekers and teams

## Workflow / How It Works

1. A user signs in through Firebase.
2. They create or edit resume content in the AI-enhanced resume builder.
3. They preview and export a resume as a PDF.
4. The app offers job search, job alerts, and interview preparation tools.
5. Users can publish a developer portfolio and showcase projects.
6. Real-time notifications and collaboration features keep the experience responsive.

<!-- Screenshots removed per request: add real screenshots or GIFs in `docs/assets/` and reference them here when available -->

## Environment Variables

### Backend (`backend/.env`)
<table>
  <colgroup>
    <col style="width: 18%;" />
    <col style="width: 55%;" />
    <col style="width: 27%;" />
  </colgroup>
  <thead>
    <tr>
      <th>Variable</th>
      <th>Description</th>
      <th>Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>PORT</code></td>
      <td>Backend server port</td>
      <td><code>5001</code></td>
    </tr>
    <tr>
      <td><code>NODE_ENV</code></td>
      <td>Runtime environment</td>
      <td><code>development</code></td>
    </tr>
    <tr>
      <td><code>FRONTEND_URL</code></td>
      <td>Frontend origin for CORS</td>
      <td><code>http://localhost:5173</code></td>
    </tr>
    <tr>
      <td><code>MONGODB_URI</code></td>
      <td>MongoDB connection string</td>
      <td><code>mongodb://localhost:27017/career-pilot</code></td>
    </tr>
    <tr>
      <td><code>REDIS_URL</code></td>
      <td>Redis URL for BullMQ</td>
      <td><code>redis://localhost:6379</code></td>
    </tr>
    <tr>
      <td><code>GEMINI_API_KEY</code></td>
      <td>Google Gemini API key</td>
      <td><code>your-gemini-api-key</code></td>
    </tr>
    <tr>
      <td><code>OPENAI_API_KEY</code></td>
      <td>OpenAI API key</td>
      <td><code>your-openai-api-key</code></td>
    </tr>
    <tr>
      <td><code>RAPIDAPI_KEY</code></td>
      <td>RapidAPI key for job search</td>
      <td><code>your-rapidapi-key</code></td>
    </tr>
    <tr>
      <td><code>FIREBASE_PROJECT_ID</code></td>
      <td>Firebase project identifier</td>
      <td><code>your-firebase-project-id</code></td>
    </tr>
    <tr>
      <td><code>FIREBASE_STORAGE_BUCKET</code></td>
      <td>Firebase storage bucket</td>
      <td><code>your-firebase.appspot.com</code></td>
    </tr>
    <tr>
      <td><code>FIREBASE_SERVICE_ACCOUNT_PATH</code></td>
      <td>Path to Firebase service account JSON</td>
      <td><code>./service-account.json</code></td>
    </tr>
    <tr>
      <td><code>EMAIL_HOST</code></td>
      <td>SMTP host for email service</td>
      <td><code>smtp.gmail.com</code></td>
    </tr>
    <tr>
      <td><code>EMAIL_PORT</code></td>
      <td>SMTP port</td>
      <td><code>587</code></td>
    </tr>
    <tr>
      <td><code>EMAIL_USER</code></td>
      <td>Email sender address</td>
      <td><code>no-reply@example.com</code></td>
    </tr>
    <tr>
      <td><code>EMAIL_PASS</code></td>
      <td>SMTP password / app password</td>
      <td><code>your-email-password</code></td>
    </tr>
    <tr>
      <td><code>LINKEDIN_REDIRECT_URI</code></td>
      <td>LinkedIn OAuth callback</td>
      <td><code>http://localhost:5001/api/auth/linkedin/callback</code></td>
    </tr>
    <tr>
      <td><code>DEV_BYPASS_AUTH</code></td>
      <td>Local auth bypass flag</td>
      <td><code>false</code></td>
    </tr>
  </tbody>
</table>

### Frontend (`frontend/.env`)
<table>
  <colgroup>
    <col style="width: 18%;" />
    <col style="width: 55%;" />
    <col style="width: 27%;" />
  </colgroup>
  <thead>
    <tr>
      <th>Variable</th>
      <th>Description</th>
      <th>Example</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>VITE_API_URL</code></td>
      <td>Backend API base URL</td>
      <td><code>http://localhost:5001</code></td>
    </tr>
    <tr>
      <td><code>VITE_API_BASE</code></td>
      <td>Backend API prefix</td>
      <td><code>http://localhost:5001/api</code></td>
    </tr>
    <tr>
      <td><code>VITE_FIREBASE_API_KEY</code></td>
      <td>Firebase client API key</td>
      <td><code>your-firebase-api-key</code></td>
    </tr>
    <tr>
      <td><code>VITE_FIREBASE_AUTH_DOMAIN</code></td>
      <td>Firebase auth domain</td>
      <td><code>your-project.firebaseapp.com</code></td>
    </tr>
    <tr>
      <td><code>VITE_FIREBASE_PROJECT_ID</code></td>
      <td>Firebase project ID</td>
      <td><code>your-firebase-project-id</code></td>
    </tr>
    <tr>
      <td><code>VITE_FIREBASE_STORAGE_BUCKET</code></td>
      <td>Firebase storage bucket</td>
      <td><code>your-project.appspot.com</code></td>
    </tr>
    <tr>
      <td><code>VITE_FIREBASE_MESSAGING_SENDER_ID</code></td>
      <td>Firebase messaging sender ID</td>
      <td><code>1234567890</code></td>
    </tr>
    <tr>
      <td><code>VITE_FIREBASE_APP_ID</code></td>
      <td>Firebase app ID</td>
      <td><code>1:1234567890:web:abcdef123456</code></td>
    </tr>
    <tr>
      <td><code>VITE_FIREBASE_MEASUREMENT_ID</code></td>
      <td>Analytics measurement ID</td>
      <td><code>G-XXXXXXXXXX</code></td>
    </tr>
    <tr>
      <td><code>VITE_MAX_SIZE_MB</code></td>
      <td>Max upload size for resumes</td>
      <td><code>5</code></td>
    </tr>
  </tbody>
</table>

> For the complete list of supported variables, see `backend/.env.example`, `frontend/.env.example`, and `docs/environment-setup.md`.

## Project Structure

```
career-pilot/
├── backend/               # Express API, AI integrations, auth, jobs, scheduler, portfolio deployment
├── frontend/              # React + Vite app, resume builder, dashboard, portfolio templates
├── docs/                  # Setup guides and environment documentation
├── CONTRIBUTION.md        # Contribution guidelines
├── CODE_OF_CONDUCT.md    # Community behavior policy
├── LICENSE               # Project license
└── README.md             # Project overview and onboarding
```

## Quick Start

```bash
# Install dependencies for frontend and root scripts
cd career-pilot
npm install

# Backend install
cd backend
npm install

# Frontend install
cd ../frontend
npm install
```

### Run locally

```bash
# Start backend (from backend/)
npm run dev

# Start frontend (from frontend/)
npm run dev
```

## Tech Stack

- **Frontend:** React 19, Vite
- **Styling:** TailwindCSS 4, Framer Motion
- **Backend:** Node.js, Express
- **Authentication:** Firebase
- **AI Providers:** Google Gemini, OpenAI, Groq
- **Job Search:** RapidAPI JSearch
- **Real-time:** Socket.IO
- **Data:** MongoDB, Redis / BullMQ

## Contributing

We welcome contributions from developers of all levels.

1. Fork the repo
2. Create a feature branch
3. Commit and push your changes
4. Open a PR against `main`

See [CONTRIBUTION.md](CONTRIBUTION.md) for full details.

## Maintainers

<div align="center">
  <table>
    <tr>
      <td align="center">
        <a href="https://github.com/anurag3407">
          <img src="https://github.com/anurag3407.png" width="100" style="border-radius: 50%;" alt="anurag3407"/><br />
          <sub><b>anurag3407</b></sub>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/Mohnish27-dev">
          <img src="https://github.com/Mohnish27-dev.png" width="100" style="border-radius: 50%;" alt="Mohnish27-dev"/><br />
          <sub><b>Mohnish27-dev</b></sub>
        </a>
      </td>
    </tr>
  </table>
</div>

## License

This project is open-source and licensed under the terms in the `LICENSE` file.
