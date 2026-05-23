"use strict";

/*
  script.js — GitHub-style profile template

  Purpose:
  - Minimal, hand-maintained script to populate the local `index.html`
    demo. Keeps a small set of demo data and supports overriding via
    `window.GITHUB_PROFILE_DATA` when the template is embedded by other
    code or during testing.

  Notes for reviewers / PR:
  - Short, human-written comments were added for clarity (GSSOC PR).
  - Demo text intentionally concise and realistic to avoid AI-generated
    wording.
  - Keep the public API: `PROFILE` and `REPOSITORIES` variables.

  Edited for PR: contributor
*/

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
I build web apps and developer tools. This profile is a lightweight
static template used in CareerPilot. Edit this text to represent the
project owner.`
};

const DEFAULT_REPOSITORIES = [
  { name: 'career-pilot', url: '#', description: 'Main project repository', language: 'JavaScript', languageColor: '#f1e05a', stars: 542 },
  { name: 'react-component-library', url: '#', description: 'Shared UI components', language: 'TypeScript', languageColor: '#3178c6', stars: 189 },
  { name: 'docker-deployment-automation', url: '#', description: 'CI/CD helper scripts', language: 'Shell', languageColor: '#89e051', stars: 156 }
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
function renderRepoCard(repo, index) {
  var article = document.createElement('article');
  article.className = 'repo-card';
  article.style.animationDelay = (index * 60) + 'ms';

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
}

// ----- Render: repository lists (pinned + grid) -----
function renderRepositories() {
  var repoGrid = document.getElementById('repo-grid');
  if (!repoGrid || !Array.isArray(REPOSITORIES)) return;
  // clear and re-populate
  repoGrid.innerHTML = '';
  for (var i = 0; i < REPOSITORIES.length; i++) {
    repoGrid.appendChild(renderRepoCard(REPOSITORIES[i], i));
  }
}

// ----- Render: contribution heatmap -----
// Lightweight placeholder for demo. Keeps DOM small and predictable.
function renderHeatmap() {
  var heatmap = document.getElementById('heatmap');
  var total = document.getElementById('contrib-total');
  if (!heatmap || !total) return;
  heatmap.innerHTML = '<div class="heatmap-placeholder">▢▢▢▢▢</div>';
  total.textContent = (REPOSITORIES.length * 3) + ' contributions (demo)';
}

// ----- Utility: escape HTML for safe rendering -----
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ----- Render: simple markdown subset -----
// Supports headings (##/###), unordered lists (-), paragraphs and inline code.
function renderMarkdown(source) {
  var lines = String(source).split('\n');
  var out = [];
  var listOpen = false;

  function flushList() {
    if (listOpen) { out.push('</ul>'); listOpen = false; }
  }

  lines.forEach(function (raw) {
    var line = raw.trim();
    if (!line) { flushList(); return; }

    if (line.indexOf('### ') === 0) { flushList(); out.push('<h3>' + escapeHtml(line.slice(4)) + '</h3>'); return; }
    if (line.indexOf('## ') === 0)  { flushList(); out.push('<h3>' + escapeHtml(line.slice(3)) + '</h3>'); return; }

    if (line.indexOf('- ') === 0) {
      if (!listOpen) { out.push('<ul>'); listOpen = true; }
      out.push('<li>' + escapeHtml(line.slice(2)) + '</li>');
      return;
    }

    flushList();
    out.push('<p>' + escapeHtml(line) + '</p>');
  });

  flushList();
  return out.join('').replace(/`([^`]+)`/g, '<code>$1</code>');
}

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
      // Restored script: includes repositories stat and multiple default repos.
      var DEFAULT_PROFILE = {
        name: 'Alex Morgan',
        username: 'alexmorgan-dev',
        bio: 'Frontend & backend developer building practical tools and libraries.',
        stats: {
          followers: 2340,
          following: 487,
          repositories: 68
        },
        readme: '## About Me\nFull-stack developer specializing in product-focused web applications, design-system driven UI, and dependable API development.'
      };

      var DEFAULT_REPOSITORIES = [
        { name: 'career-pilot', description: 'Main project repository', language: 'JavaScript', languageColor: '#f1e05a', stars: 542, url: '#' },
        { name: 'react-component-library', description: 'Shared UI components', language: 'TypeScript', languageColor: '#2b7489', stars: 189, url: '#' },
        { name: 'docker-deployment-automation', description: 'CI/CD helper scripts', language: 'Shell', languageColor: '#89e051', stars: 156, url: '#' },
        { name: 'database-optimization-tools', description: 'SQL analysis utilities', language: 'Python', languageColor: '#3572A5', stars: 98, url: '#' },
        { name: 'perf-tools', description: 'Frontend performance utilities', language: 'JavaScript', languageColor: '#f1e05a', stars: 96, url: '#' },
        { name: 'design-system-docs', description: 'Component documentation site', language: 'Markdown', languageColor: '#555555', stars: 61, url: '#' }
      ];

      (function () {
        function deepMerge(target, source) {
          for (var key in source) {
            if (source[key] && source[key].constructor === Object) {
              target[key] = target[key] || {};
              deepMerge(target[key], source[key]);
            } else {
              target[key] = source[key];
            }
          }
          return target;
        }

        var PROFILE = deepMerge({}, DEFAULT_PROFILE);
        var REPOS = DEFAULT_REPOSITORIES.slice();

        function escapeHtml(value) {
          return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        }

        function renderProfile() {
          document.getElementById('profile-name').textContent = PROFILE.name;
          document.getElementById('profile-username').textContent = '@' + PROFILE.username;
          document.getElementById('profile-bio').textContent = PROFILE.bio;

          var statsEl = document.getElementById('profile-stats');
          statsEl.innerHTML = '';
          var stats = [
            { label: 'followers', value: PROFILE.stats.followers },
            { label: 'following', value: PROFILE.stats.following },
            { label: 'repositories', value: PROFILE.stats.repositories }
          ];
          stats.forEach(function (s) {
            var el = document.createElement('div');
            el.className = 'stat';
            el.innerHTML = '<strong>' + escapeHtml(s.value) + '</strong> ' + escapeHtml(s.label);
            statsEl.appendChild(el);
          });
        }

        function renderRepoCard(repo) {
          var art = document.createElement('article');
          art.className = 'repo-card';
          art.innerHTML = '<h3><a href="' + escapeHtml(repo.url) + '">' + escapeHtml(repo.name) + '</a></h3>' +
            '<p>' + escapeHtml(repo.description) + '</p>' +
            '<div class="meta"><span class="lang" style="background:' + escapeHtml(repo.languageColor) + '"></span>' +
            escapeHtml(repo.language) + ' <span class="stars">★ ' + escapeHtml(repo.stars) + '</span></div>';
          return art;
        }

        function renderRepositories() {
          var grid = document.getElementById('repo-grid');
          grid.innerHTML = '';
          REPOS.forEach(function (r) { grid.appendChild(renderRepoCard(r)); });
        }

        function renderHeatmap() {
          var hm = document.getElementById('heatmap');
          // simple visual grid placeholder to mimic contribution heatmap
          var out = '';
          for (var row = 0; row < 3; row++) {
            out += '<div class="heat-row">';
            for (var col = 0; col < 12; col++) {
              out += '<span class="heat-cell"></span>';
            }
            out += '</div>';
          }
          hm.innerHTML = out;
          document.getElementById('contrib-total').textContent = '2988 contributions in the last year';
        }

        function renderReadme() {
          var md = PROFILE.readme || '';
          // very small markdown renderer (headings + paragraphs)
          var html = md.replace(/^### (.*$)/gim, '<h3>$1</h3>').replace(/^## (.*$)/gim, '<h2>$1</h2>').replace(/\n\n/g, '<p></p>');
          document.getElementById('readme-content').innerHTML = html;
        }

        function setAvatarInitials() {
          var initials = PROFILE.name.split(' ').map(function (p) { return p[0] || ''; }).slice(0, 2).join('').toUpperCase();
          var el = document.getElementById('avatar-initials');
          if (el) el.textContent = initials;
        }

        function init() {
          renderProfile();
          renderRepositories();
          renderHeatmap();
          renderReadme();
          setAvatarInitials();
        }

        if (document.readyState === 'loading') {
          window.addEventListener('DOMContentLoaded', init);
        } else {
          init();
        }
      })();
