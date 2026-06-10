<div align="center">
  <h1>🚀 Career Pilot</h1>
  <p>An AI-powered resume builder and career toolkit that helps users create resumes, prepare for interviews, search jobs, and launch developer portfolios. </p>
</div>

<div align="center" style="max-width:900px; margin:12px auto;">
  <p style="margin-bottom:10px; text-align:center; font-size:1.05rem; color:var(--text-color, #e6edf3);">
    Full-stack web app combining modern frontend and backend tooling
  </p>
  <p style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin:8px 0;">
    <img src="https://img.shields.io/badge/Node.js-20-green?logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express-4.18-lightgrey?logo=express&logoColor=black" alt="Express" />
    <img src="https://img.shields.io/badge/MongoDB-6.0-darkgreen?logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Redis-7.0-d9932e?logo=redis&logoColor=white" alt="Redis" />
    <img src="https://img.shields.io/badge/Socket.IO-4-cyan?logo=socket.io&logoColor=white" alt="Socket.IO" />
    <img src="https://img.shields.io/badge/React-19-blue?logo=react&logoColor=white" alt="React" />
    <img src="https://img.shields.io/badge/Vite-7.3.5-brightgreen?logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/TailwindCSS-4-skyblue?logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
  </p>
</div>

## How It Works (Overview)

1. User registers / logs in using Firebase Authentication  
2. User enters the Career Pilot dashboard  
3. User selects or creates a resume template  
4. User edits resume sections (Education, Skills, Experience, etc.)  
5. Drag & drop support allows easy section rearrangement  
6. AI features assist in improving resume content  
7. User previews final resume in real time  
8. Resume is exported as PDF using jsPDF + html2canvas  

## Table of Contents

- [How It Works](#how-it-works-overview)
- [Why This Project](#why-this-project)
- [Key Features](#key-features)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Maintainers](#maintainers)
- [License](#license)

## Why This Project

- Helps users create strong resumes quickly using AI guidance.
- Supports interview preparation and portfolio building in one unified product.
- Provides real-time collaboration and notification workflows.
- Built with modular frontend/backend architecture that is ideal for contributors.

## Key Features

- AI resume creation, improvement, and formatting.
- PDF export and resume download.
- Firebase authentication and auth session handling.
- Job search powered by RapidAPI JSearch.
- Portfolio templates with deploy-ready publishing flows.
- Real-time updates and collaboration via Socket.IO.
- Responsive UI built with TailwindCSS and Framer Motion.
- Admin and community tools for job seekers and teams.

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+ (or Yarn / pnpm)
- MongoDB
- Redis
- Firebase project and service account
- Optional: Cloudinary account for media storage

### Install dependencies

```bash
cd career-pilot
npm install
cd backend
npm install
cd ../frontend
npm install
```

### Run locally

```bash
# Backend
cd career-pilot/backend
npm run dev

# Frontend
cd ../frontend
npm run dev
```

### Testing

Add or update tests in `backend/tests`, `frontend/tests`, and root-level test utilities. Run any existing test scripts from the relevant package directories.


## Environment Variables

The project requires separate environment configuration for backend and frontend.

### Backend (.env)
- PORT – Server port
- MONGODB_URI – MongoDB connection string
- REDIS_URL – Redis connection string
- OPENAI_API_KEY – AI integration key
- RAPIDAPI_KEY – Job search API key
- FIREBASE_PROJECT_ID – Firebase project ID
- FIREBASE_SERVICE_ACCOUNT_PATH – Firebase admin SDK file path
- FRONTEND_URL – Frontend URL for CORS

### Frontend (.env)
- VITE_API_URL – Backend API URL
- VITE_FIREBASE_API_KEY – Firebase API key
- VITE_FIREBASE_PROJECT_ID – Firebase project ID
- VITE_FIREBASE_AUTH_DOMAIN – Firebase auth domain
- VITE_FIREBASE_STORAGE_BUCKET – Firebase storage bucket

## Project Structure

```text
career-pilot/
├── backend/        # Express backend (APIs, auth, AI, jobs, portfolio)
├── frontend/       # React + Vite frontend (UI, resume builder, dashboard)
├── docs/           # Documentation and setup guides
├── CONTRIBUTION.md # Contribution guidelines
├── CODE_OF_CONDUCT.md
└── LICENSE
```

## Roadmap

- Improve resume generation prompts and AI content quality.
- Expand interview prep flows with more question categories.
- Add more portfolio templates and publishing options.
- Strengthen end-to-end test coverage.
- Improve documentation for contributors and deploy workflows.


## 🧠 Project Notes

- Project is currently in development stage  
- No live deployment available yet  
- Firebase configuration is required to run locally  


### Good first issues

- Documentation improvements for setup or environment variables.
- Fixing UI/UX issues on the dashboard or resume builder.
- Backend bug fixes around authentication and job search.
- Code quality and linting improvements.

If you are part of GSSoC or a first-time contributor, add a comment to an issue or open a discussion to request mentorship.

## Contributing

We welcome contributions from developers of all levels.

### Contribution flow

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Make your changes and commit with a descriptive message.
4. Push the branch and open a PR against `main`.

### Recommended branch names

- `feature/<short-description>`
- `fix/<short-description>`
- `docs/<short-description>`

### PR checklist

- [ ] The change is described clearly in the PR title and description.
- [ ] Code passes linting and local tests.
- [ ] Environment setup steps are documented if needed.
- [ ] Any breaking changes are noted.

### GSoC / community contributors

- Start with issues labeled as good first issue or help wanted.
- Check `CONTRIBUTION.md` and `CODE_OF_CONDUCT.md` before contributing.
- Ask questions by opening an issue or commenting on an existing one.
- If you want a feature idea, ask for a mentor review on a draft PR.

See [CONTRIBUTION.md](CONTRIBUTION.md) for full contribution details.

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
