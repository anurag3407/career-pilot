# 🤝 Contributing to AI Resume Builder & Career Platform

<div align="center">

**Thank you for your interest in contributing!**

We welcome contributions from developers of all skill levels.

</div>

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Issue Guidelines](#issue-guidelines)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Documentation](#documentation)
- [Community](#community)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Examples of positive behavior:**

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Examples of unacceptable behavior:**

- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

### Enforcement

Project maintainers are responsible for clarifying standards of acceptable behavior and will take appropriate action in response to unacceptable behavior.

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **Git** for version control
- **MongoDB** (local or Atlas account)
- **Redis** (local or cloud instance)
- **Firebase** project (for authentication)
- **Google Gemini API** key
- **RapidAPI** key (for job search)

### Fork and Clone

1. **Fork the repository** on GitHub

2. **Clone your fork:**

```bash
git clone https://github.com/YOUR_USERNAME/ai-resume-builder.git
cd ai-resume-builder
```

1. **Add upstream remote:**

```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/ai-resume-builder.git
```

1. **Keep your fork synced:**

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

---

## Development Setup

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your credentials
# See README.md for required variables

# Start development server
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your Firebase config

# Start development server
npm run dev
```

### 3. Verify Setup

- Backend health check: `http://localhost:5000/health`
- Frontend: `http://localhost:5173`
- Login with a test account to verify authentication

---

## How to Contribute

### Types of Contributions

| Type | Description |
|------|-------------|
| 🐛 **Bug Fixes** | Fix reported issues |
| ✨ **Features** | Add new functionality |
| 📝 **Documentation** | Improve docs, add examples |
| 🎨 **UI/UX** | Improve design and usability |
| ⚡ **Performance** | Optimize speed and efficiency |
| 🧪 **Tests** | Add or improve test coverage |
| 🌐 **Translations** | Add language support |

### Finding Issues to Work On

1. **Browse open issues:** Look for difficulty labels:
   - `good first issue` - Great for newcomers (69 available!)
   - `beginner` - Suitable for new contributors
   - `intermediate` - Requires moderate experience
   - `advanced` - Complex tasks for experienced developers
   - `critical` - High priority, needs immediate attention

2. **Feature areas:**
   - `portfolio` - Portfolio builder features
   - `github` - GitHub Intelligence features
   - `deployment` - Deployment/hosting features
   - `ai-feature` - AI/ML features
   - `resume-builder` - Resume builder features
   - `job-scraper` - Job scraping features
   - `interview` - Interview prep features
   - `ui-revamp` - UI/UX redesign
   - `testing` - Tests and coverage
   - `documentation` - Docs and guides
   - `devops` - CI/CD and infrastructure
   - `security` - Security improvements
   - `performance` - Performance optimization

3. **Check the project board:** See planned features and priorities

4. **Create your own:** If you have an idea, open an issue first to discuss

### Issue and PR Limits

To ensure fair distribution of work across all contributors:

| Rule | Limit |
|------|-------|
| **Issues opened per day** | Max 4 issues per contributor |
| **PRs opened per day** | Max 3 PRs per contributor |
| **Issues assigned at once** | Max 3 issues per contributor |
| **Issue inactivity timeout** | 7 days - unassigned if no PR is opened |
| **PR review response** | Respond to review comments within 48 hours |
| **Stale PR closure** | PRs with no activity for 14 days will be closed |

> **Why?** These limits prevent issue hoarding, encourage quality over quantity, and give everyone a fair chance to contribute.

### Before Starting Work

1. **Check existing issues** for duplicates
2. **Comment on the issue** to claim it (say: "I'd like to work on this")
3. **Wait for a maintainer to assign you** (usually within 24 hours)
4. **Do NOT start working before assignment** - another contributor may already be working on it
5. **Create a branch** from `main`
6. **Read the issue description carefully** - each issue specifies:
   - What to do (required tasks)
   - What NOT to do (common mistakes to avoid)
   - Files to modify (exact file paths)

---

## Pull Request Process

### 1. Create a Feature Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name

# For bug fixes
git checkout -b fix/bug-description
```

### 2. Make Your Changes

- Write clean, documented code
- Follow the coding standards below
- Add tests for new functionality
- Update documentation if needed

### 3. Commit Your Changes

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "feat: add resume template selection"
```

### 4. Push and Create PR

```bash
# Push to your fork
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:

- Clear title describing the change
- Description of what and why
- Link to related issue(s)
- **Mandatory Screenshots/GIFs** for any UI/UX or visual changes

### 5. PR Review Process

1. **Automated checks** must pass (lint, tests)
2. **At least one maintainer** must approve
3. **Address feedback** promptly
4. **Squash commits** if requested
5. **Maintainer merges** when ready

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Other (describe)

## Related Issue
Fixes #(issue number)

## Testing
- [ ] Unit tests pass
- [ ] Manual testing completed
- [ ] New tests added

## Screenshots (MANDATORY for UI/UX changes)
Please attach screenshots or screen recordings showing the before and after state of your visual changes.

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-reviewed my code
- [ ] Commented hard-to-understand areas
- [ ] Updated documentation
- [ ] No new warnings generated
```

---

## Coding Standards

### JavaScript/TypeScript

```javascript
// ✅ Good: Clear naming, documented
/**
 * Enhances a resume using AI
 * @param {string} resumeText - Original resume content
 * @param {Object} preferences - Enhancement preferences
 * @returns {Promise<Object>} Enhanced resume data
 */
export const enhanceResume = async (resumeText, preferences) => {
  const { jobRole, yearsOfExperience } = preferences;
  
  if (!resumeText?.trim()) {
    throw new ApiError(400, 'Resume text is required');
  }
  
  // ... implementation
};

// ❌ Bad: Unclear naming, no documentation
export const er = async (rt, p) => {
  // ... unclear implementation
};
```

### React Components

```jsx
// ✅ Good: Functional component with clear structure
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Displays a single resume card with actions
 */
export default function ResumeCard({ resume, onDelete, onEdit }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(resume.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="resume-card">
      <h3>{resume.title}</h3>
      <p>{resume.jobRole}</p>
      <div className="actions">
        <button onClick={() => onEdit(resume)}>Edit</button>
        <button onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}

ResumeCard.propTypes = {
  resume: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    jobRole: PropTypes.string,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};
```

### CSS/Tailwind

```jsx
// ✅ Good: Organized, readable Tailwind classes
<button 
  className={`
    px-4 py-2 rounded-lg font-medium
    transition-colors duration-200
    ${variant === 'primary' 
      ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
    }
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `}
>
  {children}
</button>

// ❌ Bad: Unreadable class string
<button className="px-4 py-2 rounded-lg font-medium transition-colors duration-200 bg-indigo-600 text-white hover:bg-indigo-700">
```

### File Organization

```
// ✅ Good: Related code together
src/
├── components/
│   └── Resume/
│       ├── index.js          # Main export
│       ├── ResumeCard.jsx    # Component
│       ├── ResumeCard.test.js# Tests
│       └── ResumeCard.css    # Styles (if needed)

// ❌ Bad: Scattered files
src/
├── components/
│   ├── ResumeCard.jsx
├── tests/
│   ├── ResumeCard.test.js
├── styles/
│   ├── ResumeCard.css
```

### ESLint Configuration

The project uses ESLint for code quality. Run before committing:

```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lint -- --fix
```

---

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code change without fix/feature |
| `perf` | Performance improvement |
| `test` | Adding tests |
| `chore` | Maintenance tasks |

### Examples

```bash
# Feature
feat(resume): add multiple template selection

# Bug fix
fix(auth): resolve token refresh issue on mobile

# Documentation
docs(api): add job alerts endpoint documentation

# Refactor
refactor(services): extract job fetching to separate module

# Performance
perf(search): add pagination to job results
```

### Commit Best Practices

- Keep commits atomic (one logical change per commit)
- Write in imperative mood ("add" not "added")
- First line under 72 characters
- Reference issues: `Fixes #123`

---

## Issue Guidelines

### Bug Reports

Use this template:

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
If applicable

## Environment
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 18.17.0]

## Additional Context
Any other relevant information
```

### Feature Requests

Use this template:

```markdown
## Feature Description
Clear description of the desired feature

## Problem It Solves
Why is this feature needed?

## Proposed Solution
How you envision it working

## Alternatives Considered
Other approaches you've thought about

## Additional Context
Mockups, examples, or references
```

---

## Project Structure

### Backend Structure

```
backend/src/
├── index.js              # Entry point - start here
├── config/               # Configuration files
│   ├── firebase.js       # Firebase Admin setup
│   ├── langchain.js      # AI configuration
│   └── socket.js         # Socket.IO setup
├── controllers/          # Route handlers
├── middleware/            # Express middleware
│   ├── cmsAuth.js        # CMS API key auth
│   └── portfolioValidator.js # Portfolio content validation
├── models/               # Mongoose schemas
│   ├── Portfolio.model.js # Portfolio data
│   ├── Deployment.model.js # Deploy history
│   └── ...
├── routes/               # API route definitions
│   ├── portfolio.js      # Portfolio CRUD + deploy
│   ├── portfolioCMS.js   # Headless CMS API
│   ├── github.js         # GitHub intelligence
│   ├── webhooks.js       # Deploy provider webhooks
│   └── ...
├── services/             # Business logic
│   ├── ai/               # AI career tools
│   │   ├── skillGapAnalyzer.js
│   │   ├── careerTrajectory.js
│   │   ├── salaryEstimator.js
│   │   └── projectDescriptionWriter.js
│   ├── deploy/           # Deployment providers
│   │   ├── cloudflareDeployer.js
│   │   ├── githubPagesDeployer.js
│   │   ├── netlifyDeployer.js
│   │   ├── vercelDeployer.js
│   │   └── deployerFactory.js
│   ├── github/           # GitHub analysis
│   │   ├── repoDeepScanner.js
│   │   ├── techStackDetector.js
│   │   ├── commitHeatmap.js
│   │   ├── repoHealthScorer.js
│   │   ├── codebaseExplainer.js
│   │   └── readmeAssetEngine.js
│   └── ...
├── templates/            # Portfolio themes
│   └── portfolio/
│       ├── _starter/     # Starter kit for contributors
│       ├── minimal-dark/
│       ├── developer-pro/
│       ├── creative-gradient/
│       └── ...
└── utils/                # Helper functions
```

### Frontend Structure

```
frontend/src/
├── App.jsx               # Root component - start here
├── main.jsx              # Entry point
├── components/           # Reusable components
│   ├── ui/               # Generic UI components
│   ├── community/        # Community-specific components
│   ├── portfolio/        # Portfolio builder components
│   │   ├── PortfolioCard.jsx
│   │   ├── SectionEditor.jsx
│   │   ├── ThemeSelector.jsx
│   │   ├── DeployModal.jsx
│   │   └── ...
│   ├── github/           # GitHub intelligence components
│   │   ├── RepoCard.jsx
│   │   ├── ContributionHeatmap.jsx
│   │   ├── HealthScoreGauge.jsx
│   │   └── ...
│   └── ai/               # AI tools components
│       ├── CareerTrajectoryChart.jsx
│       └── LinkedInHeadlineGenerator.jsx
├── config/               # Configuration
├── context/              # React context providers
├── hooks/                # Custom React hooks
├── pages/                # Page components
│   ├── Portfolio.jsx
│   ├── PortfolioEditor.jsx
│   ├── GitHubDashboard.jsx
│   ├── RepoAnalysis.jsx
│   ├── SkillGap.jsx
│   ├── CareerPath.jsx
│   ├── SalaryEstimate.jsx
│   ├── Deployments.jsx
│   ├── TemplateGallery.jsx
│   ├── admin/            # Admin-only pages
│   └── fellowship/       # Fellowship pages
├── services/             # API service layer
└── lib/                  # Utility functions
```

### Key Files to Understand

| File | Purpose |
|------|---------|
| `backend/src/index.js` | Server initialization, route registration |
| `backend/src/routes/*.js` | API endpoint definitions |
| `backend/src/services/*.js` | Core business logic |
| `backend/src/services/deploy/` | All deployment provider integrations |
| `backend/src/services/github/` | GitHub analysis and intelligence |
| `backend/src/services/ai/` | AI-powered career tools |
| `backend/src/templates/portfolio/` | Portfolio theme templates |
| `frontend/src/App.jsx` | Application routing |
| `frontend/src/services/api.js` | API client functions |
| `frontend/src/context/*.jsx` | Global state management |
| `frontend/src/components/portfolio/` | Portfolio builder UI |
| `frontend/src/components/github/` | GitHub intelligence UI |

---

## Testing

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

### Writing Tests

```javascript
// Example: API endpoint test
describe('POST /api/enhance', () => {
  it('should enhance resume with valid input', async () => {
    const response = await request(app)
      .post('/api/enhance')
      .set('Authorization', `Bearer ${validToken}`)
      .send({
        resumeText: 'John Doe, Software Engineer...',
        preferences: { jobRole: 'Senior Engineer' }
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.enhancedResume).toBeDefined();
  });

  it('should return 400 without resume text', async () => {
    const response = await request(app)
      .post('/api/enhance')
      .set('Authorization', `Bearer ${validToken}`)
      .send({ preferences: { jobRole: 'Engineer' } });

    expect(response.status).toBe(400);
  });
});
```

### Test Coverage Goals

| Category | Minimum Coverage |
|----------|-----------------|
| API Endpoints | 80% |
| Services | 70% |
| Utilities | 90% |
| Components | 60% |

---

## Documentation

### Where to Document

| Type | Location |
|------|----------|
| API Endpoints | `API_DOCS/README.md` |
| Architecture | `ARCHITECTURE.md` |
| Setup/Usage | `README.md` |
| Code | JSDoc comments |
| Components | PropTypes + comments |

### Documentation Standards

- Keep documentation up-to-date with code changes
- Include code examples where helpful
- Use clear, simple language
- Add screenshots for UI features

---

## Community

### Getting Help

- **GitHub Issues:** Bug reports and feature requests
- **Discussions:** General questions and ideas
- **Discord:** Real-time chat with contributors

### Recognition

Contributors are recognized in:

- README contributors section
- Release notes
- Annual contributor highlights

### Becoming a Maintainer

Active contributors may be invited to become maintainers. Criteria:

- Consistent quality contributions
- Helpful code reviews
- Community engagement
- Following project guidelines

---

## Quick Reference

### Common Commands

```bash
# Start development servers
npm run dev

# Run linter
npm run lint

# Run tests
npm test

# Build for production
npm run build

# Create new branch
git checkout -b feature/name

# Update from upstream
git fetch upstream && git merge upstream/main
```

### Useful Links

- [Project README](./README.md)
- [API Documentation](./API_DOCS/README.md)
- [Architecture Guide](./ARCHITECTURE.md)
- [Issue Tracker](https://github.com/anurag3407/career-pilot/issues)

---

## Issue Lifecycle

| State | Description |
|-------|-------------|
| **Open** | Available for anyone to claim |
| **Assigned** | Claimed by a contributor, work expected within 7 days |
| **In Progress** | PR has been opened |
| **Review** | PR is being reviewed by maintainers |
| **Merged** | Work is complete and merged |
| **Closed** | Issue resolved or deemed unnecessary |

### Quality Expectations

- **Code must pass linting** (`npm run lint`)
- **No `console.log` in production code** (use proper logging)
- **All new components must be responsive** (mobile-first)
- **All new API endpoints must have input validation**
- **All new features must follow existing design tokens** (CSS variables)
- **Screenshots are MANDATORY for UI changes** in PRs

---

<div align="center">

**Thank you for contributing to CareerPilot! 🎉**

Your contributions help job seekers worldwide build portfolios, ace interviews, and land their dream jobs.

**415+ issues available** across all difficulty levels - there is something for everyone!

</div>
