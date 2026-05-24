"use strict";


// ----- Demo defaults (used when no user-provided data exists) -----

const DEFAULT_PROFILE = {
  name: 'Alex Morgan',
  username: 'alexmorgan-dev',
  // Short, casual bio — suitable as a starting point for contributors.
  bio: 'Frontend & backend developer building practical tools and libraries.',
  stats: {
    followers: 2340,
    following: 487
  },

  // Small README used for the About section. Keep simple and editable.

  readme: `## About Me
I am a senior full-stack developer focused on building reliable, maintainable, and high-performance web applications and developer tooling.

I work across frontend and backend boundaries to deliver end-to-end solutions — shipping component-driven UIs with React and TypeScript, and designing scalable APIs and services with Node.js and PostgreSQL. My approach balances product velocity with engineering discipline: robust testing, observability, and incremental performance improvements.

Core areas I focus on:
- Frontend: architecting component libraries, accessible UI patterns, client performance optimizations, and TypeScript-first developer experiences.
- Backend: building resilient REST and GraphQL APIs, data modeling and migrations with PostgreSQL, background processing, and service-level scalability.
- Performance & Scalability: profiling, caching, fault-tolerant design, horizontal scaling, and cost-aware infrastructure decisions.
- Collaboration & Open Source: clear documentation, automated releases, mentoring peers, and contributing to open-source projects and developer tooling.

I enjoy transforming ambiguous product goals into pragmatic roadmaps, improving developer experience, and shipping production-ready systems that are maintainable and observable.
`,
};

const DEFAULT_REPOSITORIES = [
  { name: 'career-pilot', url: '#', description: 'AI-powered career platform combining scalable Node.js APIs with a PostgreSQL backbone. Features include job ingestion, personalized recommendations, resume optimization, and real-time notifications designed for production load and observability.', language: 'JavaScript', languageColor: '#f1e05a', stars: 542 },
  { name: 'react-component-library', url: '#', description: 'A TypeScript-first, accessible component system with Storybook, visual regression tests, and design tokens. Focused on performance, low runtime overhead, theming, and improving developer experience across multiple products.', language: 'TypeScript', languageColor: '#3178c6', stars: 189 },
  { name: 'docker-deployment-automation', url: '#', description: 'Deployment and CI/CD tooling for containerized services: reproducible builds, automated image scanning, health checks, blue/green and canary rollout scripts, and Helm/GitOps helpers to streamline production rollouts.', language: 'Shell', languageColor: '#89e051', stars: 156 },
  { name: 'ai-career-assistant', url: '#', description: 'Model orchestration and tooling powering resume feedback, interview practice, and job summarization. Built with privacy-first design, cached embeddings for performance, and extensible connectors for provider integrations.', language: 'Python', languageColor: '#3572A5', stars: 78 },
  { name: 'dev-productivity-tools', url: '#', description: 'Developer tooling suite: CLI helpers, code generators, linting presets, and local environment orchestration. Includes observability dashboards and scripts to automate repetitive workflows and enforce best practices.', language: 'JavaScript', languageColor: '#f1e05a', stars: 214 }
];

// ----- Utility: shallow/deep merge helper -----

function deepMerge(target, source) {
  if (!source) return target;
  const out = Array.isArray(target) ? target.slice() : Object.assign({}, target);
  Object.keys(source).forEach(function (key) {
    const val = source[key];
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      out[key] = deepMerge(target[key] || {}, val);
    } else {
      out[key] = val;
    }
  });
  return out;
}

// ----- Merge dynamic overrides (if provided by a user script) -----
// Expected shape on the page: `window.GITHUB_PROFILE_DATA = { profile: {...}, repositories: [...] }`

const PROFILE = (window.GITHUB_PROFILE_DATA && window.GITHUB_PROFILE_DATA.profile)
  ? deepMerge(DEFAULT_PROFILE, window.GITHUB_PROFILE_DATA.profile)
  : DEFAULT_PROFILE;

const REPOSITORIES = (window.GITHUB_PROFILE_DATA && Array.isArray(window.GITHUB_PROFILE_DATA.repositories))
  ? window.GITHUB_PROFILE_DATA.repositories.length > 0
    ? window.GITHUB_PROFILE_DATA.repositories
    : DEFAULT_REPOSITORIES
  : DEFAULT_REPOSITORIES;

// ----- Render: profile sidebar -----
// Populates name, username, bio and stats in the left sidebar.

const renderProfile = () => {
  document.getElementById('profile-name').textContent = PROFILE.name;
  document.getElementById('profile-username').textContent = `@${PROFILE.username}`;
  document.getElementById('profile-bio').textContent = PROFILE.bio;

  // Social links are now hardcoded in HTML with branded styling

  const stats = document.getElementById('profile-stats');
  stats.innerHTML = [
    { label: 'followers', value: PROFILE.stats.followers },
    { label: 'following', value: PROFILE.stats.following }
  ].map((stat) => `<div><strong>${stat.value.toLocaleString()}</strong> ${stat.label}</div>`).join('');
};

// ----- Render: single repository card -----
const renderRepoCard = (repo, index) => {
  const article = document.createElement('article');
  article.className = 'repo-card';
  article.style.animationDelay = `${index * 60}ms`;

  article.innerHTML = `
    <a class="repo-name" href="${repo.url}" target="_blank" rel="noopener noreferrer">${repo.name}</a>
    <p class="repo-desc">${repo.description}</p>
    <div class="repo-meta">
      <span class="lang">
        <i class="lang-dot" style="--lang:${repo.languageColor}"></i>
        ${repo.language}
      </span>
      <span>★ ${repo.stars}</span>
    </div>
  `;

  return article;
};

// ----- Render: repository lists (pinned + grid) -----
const renderRepositories = () => {
  const repoGrid = document.getElementById('repo-grid');

  // Populate the single Projects section (no duplicate pinned/projects lists)
  REPOSITORIES.forEach((repo, index) => {
    if (repoGrid) repoGrid.appendChild(renderRepoCard(repo, index));
  });
};

// ----- Render: contribution heatmap -----
// Generates a random heatmap (visual only; no external API calls).
const renderHeatmap = () => {
  const heatmap = document.getElementById('heatmap');
  const total = document.getElementById('contrib-total');
  const levels = [0, 1, 2, 3, 4];
  let sum = 0;

  // Contribution heatmap section — generate grid of levels

  for (let col = 0; col < 53; col += 1) {
    for (let row = 0; row < 7; row += 1) {
      const level = levels[Math.floor(Math.random() * levels.length)];
      const cell = document.createElement('div');
      cell.className = `day lv${level}`;
      heatmap.appendChild(cell);
      sum += level;
    }
  }

  total.textContent = `${sum * 4} contributions in the last year`;
};

// ----- Utility: escape HTML for safe rendering -----
const escapeHtml = (value) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

// ----- Render: simple markdown subset -----
// Supports headings (##/###), unordered lists (-), paragraphs and inline code.
const renderMarkdown = (source) => {
  const lines = source.split('\n');
  const html = [];
  let listOpen = false;

  const flushList = () => {
    if (listOpen) {
      html.push('</ul>');
      listOpen = false;
    }
  };

  lines.forEach((raw) => {
    const line = raw.trim();

    if (!line) {
      flushList();
      return;
    }

    if (line.startsWith('### ')) {
      flushList();
      html.push(`<h3>${escapeHtml(line.slice(4))}</h3>`);
      return;
    }

    if (line.startsWith('## ')) {
      flushList();
      html.push(`<h3>${escapeHtml(line.slice(3))}</h3>`);
      return;
    }

    if (line.startsWith('- ')) {
      if (!listOpen) {
        html.push('<ul>');
        listOpen = true;
      }
      html.push(`<li>${escapeHtml(line.slice(2))}</li>`);
      return;
    }

    flushList();
    html.push(`<p>${escapeHtml(line)}</p>`);
  });

  flushList();

  return html
    .join('')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
};

// ----- Render: README content -----
const renderReadme = () => {
  document.getElementById('readme-content').innerHTML = renderMarkdown(PROFILE.readme);
};

// ----- UI: set avatar initials -----
// Derives initials from PROFILE.name and writes them into the avatar element.
const setAvatarInitials = () => {
  const el = document.getElementById('avatar-initials');
  if (!el) return;
  const name = PROFILE.name || PROFILE.username || 'Dev';
  const parts = name.split(/\s+/).filter(Boolean);
  const initials = (parts.length === 1)
    ? parts[0].slice(0,2).toUpperCase()
    : (parts[0][0] + parts[parts.length-1][0]).toUpperCase();
  el.textContent = initials;
};

// ----- Init: wire everything together -----
const init = () => {
  renderProfile();
  renderRepositories();
  renderHeatmap();
  renderReadme();
  setAvatarInitials();
  // Wire up tab click behavior so the active underline follows the clicked tab
  const tabs = Array.from(document.querySelectorAll('.gh-tab'));
  if (tabs.length) {
    tabs.forEach((tab) => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        tabs.forEach((t) => t.classList.remove('is-active'));
        tab.classList.add('is-active');

        const href = tab.getAttribute('href');
        if (href && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            try { history.replaceState(null, '', href); } catch (err) { /* ignore */ }
          }
        }
      });
    });

    // Set initial active based on hash
    if (location.hash) {
      const current = document.querySelector(`.gh-tab[href="${location.hash}"]`);
      if (current) {
        tabs.forEach((t) => t.classList.remove('is-active'));
        current.classList.add('is-active');
      }
    }

    // Update active on hashchange (keyboard nav / history)
    window.addEventListener('hashchange', () => {
      const current = document.querySelector(`.gh-tab[href="${location.hash}"]`);
      if (current) {
        tabs.forEach((t) => t.classList.remove('is-active'));
        current.classList.add('is-active');
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', init);
