# 🤝 Contributing to Career Pilot

Thank you for your interest in contributing to **Career Pilot**! 🚀

Career Pilot is an AI-powered Resume Builder built with React, Vite, TailwindCSS, Firebase, and modern web technologies. We welcome contributions of all sizes, whether it's fixing bugs, improving documentation, enhancing the UI, or implementing new features.

---

## 📋 Table of Contents

- [📜 Code of Conduct](#-code-of-conduct)
- [🚀 Getting Started](#-getting-started)
- [🛠 Development Setup](#-development-setup)
- [🎯 Ways to Contribute](#-ways-to-contribute)
- [🌿 Branch Naming Convention](#-branch-naming-convention)
- [💻 Coding Guidelines](#-coding-guidelines)
- [✅ Before Submitting](#-before-submitting)
- [📝 Commit Message Convention](#-commit-message-convention)
- [🔄 Pull Request Process](#-pull-request-process)
- [🐛 Reporting Issues](#-reporting-issues)
- [🌟 First-Time Contributors](#-first-time-contributors)
- [🙌 Thank You](#-thank-you)

---

## 📜 Code of Conduct

By participating in this project, you agree to maintain a respectful and welcoming environment for everyone.

Please be constructive, professional, and collaborative in all discussions and contributions.

---

## 🚀 Getting Started

### Prerequisites

Before contributing, make sure you have:

#### Basic Requirements

- Node.js 18.0 or higher
- npm
- Git
- A GitHub account

#### Additional Requirements

Depending on the area you contribute to, additional services may be required:

- Firebase credentials (authentication and local testing)
- MongoDB (database-related features)
- Redis (caching and background services)
- AI provider API keys (OpenAI / Gemini / Groq)
- RapidAPI key (job-search-related features)

> Note: For complete backend setup instructions and environment configuration, refer to CONTRIBUTION.md.

---

## 🛠 Development Setup

### 1. Fork the Repository

Click the **Fork** button on GitHub.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/career-pilot.git

cd career-pilot
```

### 3. Add the Upstream Remote

```bash
git remote add upstream https://github.com/anurag3407/career-pilot.git
```

Verify the remotes:

```bash
git remote -v
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Configure Environment Variables

```bash
cp .env.example .env
```

Fill in the required Firebase and API configuration values.

### 6. Start the Development Server

```bash
cd frontend
npm run dev
```

The application should now be available locally.

---

## 🎯 Ways to Contribute

You can contribute by:

- Fixing bugs
- Improving UI/UX
- Optimizing performance
- Adding accessibility improvements
- Enhancing documentation
- Creating new resume templates
- Improving AI-powered resume features
- Refactoring existing code

Before starting major work, please open an issue or discuss the idea with maintainers.

---

## 🌿 Branch Naming Convention

Create a new branch from `main`.

Examples:

```bash
feature/resume-preview
feature/new-template
fix/authentication-bug
docs/update-readme
refactor/form-handling
```

---

## 💻 Coding Guidelines

### General Guidelines

- Write clean and readable code.
- Follow existing project patterns.
- Keep components modular.
- Avoid unnecessary dependencies.
- Prefer reusable solutions.

### React Guidelines

- Use functional components.
- Use hooks where appropriate.
- Keep components focused on a single responsibility.

### Styling

- Use TailwindCSS utilities consistently.
- Maintain responsive design.
- Support existing theme modes when applicable.

---

## ✅ Before Submitting

Run the following commands:

```bash
cd frontend

# Run lint checks
npm run lint

# Create a production build
npm run build
```

Ensure:

- No build errors
- No lint errors
- No unnecessary console logs
- No unused imports

---

## 📝 Commit Message Convention

Use clear commit messages.

Examples:

```bash
feat: add resume preview component

fix: resolve firebase auth redirect issue

docs: update installation guide

refactor: simplify resume form validation
```

Recommended prefixes:

| Type | Description |
|--------|------------|
| feat | New feature |
| fix | Bug fix |
| docs | Documentation |
| style | Formatting/UI changes |
| refactor | Code restructuring |
| test | Testing |
| chore | Maintenance |

---

## 🔄 Pull Request Process

### 1. Sync Your Fork

```bash
git fetch upstream
git merge upstream/main
```

### 2. Push Your Changes

```bash
git push origin your-branch-name
```

### 3. Open a Pull Request

Include:

- Clear title
- Description of changes
- Related issue number
- Screenshots (for UI changes)

Example:

```markdown
## Description

Added a responsive resume preview section.

## Related Issue

Fixes #123

## Changes Made

- Added preview component
- Improved mobile responsiveness
- Updated documentation
```

---

## 🐛 Reporting Issues

When creating an issue, include:

### Bug Reports

- Expected behavior
- Actual behavior
- Steps to reproduce
- Browser/OS information
- Screenshots (if applicable)

### Feature Requests

- Problem being solved
- Proposed solution
- Additional context

---

## 🌟 First-Time Contributors

If you're new to open source, look for issues labeled:

- good first issue
- beginner friendly
- documentation

These are excellent starting points.

---

## 🙌 Thank You

Every contribution helps improve Career Pilot and makes resume building more accessible for everyone.

Happy Contributing! 🎉