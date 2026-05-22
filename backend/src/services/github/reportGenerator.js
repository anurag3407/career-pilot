import puppeteer from 'puppeteer';

// ─── GitHub API helpers ──────────────────────────────────────────────────────

/**
 * Shared fetch wrapper for the GitHub REST API.
 * Uses the caller's personal token so access is naturally scoped to what
 * that user can actually see — no server-side master token required.
 *
 * @param {string} path  - GitHub API path, e.g. '/repos/owner/repo'
 * @param {string} token - User's GitHub personal access token (from request header)
 * @returns {Promise<object>} Parsed JSON response
 * @throws {Error} With statusCode attached for upstream error propagation
 */
const githubFetch = async (path, token) => {
  const url = `https://api.github.com${path}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'CareerPilot-ReportGenerator/1.0',
    },
  });

  if (!res.ok) {
    const err = new Error(`GitHub API error ${res.status} for ${path}`);
    err.statusCode = res.status === 404 ? 404 : res.status === 403 ? 403 : 502;
    err.githubStatus = res.status;
    throw err;
  }

  return res.json();
};

// ─── Data fetching ───────────────────────────────────────────────────────────

/**
 * Fetch all data needed for the report in parallel for speed.
 * If optional endpoints (community profile, topics) fail, they are
 * silently swallowed so the report can still be generated.
 */
const fetchRepoData = async (owner, repo, token) => {
  // Core repo metadata — failure here is fatal (propagates to route handler)
  const repoInfo = await githubFetch(`/repos/${owner}/${repo}`, token);

  // Run optional requests in parallel; failures produce null values
  const [languages, contributors, communityProfile, commits] =
    await Promise.all([
      githubFetch(`/repos/${owner}/${repo}/languages`, token).catch(() => ({})),
      githubFetch(
        `/repos/${owner}/${repo}/contributors?per_page=5&anon=false`,
        token
      ).catch(() => []),
      githubFetch(
        `/repos/${owner}/${repo}/community/profile`,
        token
      ).catch(() => null),
      githubFetch(
        `/repos/${owner}/${repo}/commits?per_page=1`,
        token
      ).catch(() => []),
    ]);

  return { repoInfo, languages, contributors, communityProfile, commits };
};

// ─── Health score ────────────────────────────────────────────────────────────

/**
 * Compute a 0–100 health score from repo signals.
 * Returns an object with the numeric score and a breakdown array so the
 * PDF can show users *why* they got that score.
 */
const computeHealthScore = (repoInfo, communityProfile, contributors, commits) => {
  const checks = [];

  const add = (label, condition, points) => {
    const earned = condition ? points : 0;
    checks.push({ label, earned, max: points, passed: condition });
    return earned;
  };

  let score = 0;

  // Documentation
  score += add('Has README', communityProfile?.files?.readme != null || repoInfo.size > 0, 15);
  score += add('Has License', !!repoInfo.license, 10);
  score += add('Has Description', !!repoInfo.description?.trim(), 10);
  score += add('Has Topics/Tags', Array.isArray(repoInfo.topics) && repoInfo.topics.length > 0, 5);

  // Community health (from community profile endpoint)
  score += add(
    'Has Contributing Guide',
    communityProfile?.files?.contributing != null,
    10
  );
  score += add(
    'Has Code of Conduct',
    communityProfile?.files?.code_of_conduct != null,
    5
  );
  score += add(
    'Has Issue Templates',
    communityProfile?.files?.issue_template != null,
    5
  );

  // Activity
  const hasRecentCommit =
    Array.isArray(commits) &&
    commits.length > 0 &&
    commits[0]?.commit?.author?.date
      ? Date.now() - new Date(commits[0].commit.author.date).getTime() <
        90 * 24 * 60 * 60 * 1000 // 90 days
      : false;
  score += add('Recently Active (< 90 days)', hasRecentCommit, 15);

  // Popularity signals
  score += add('Has Stars (≥ 1)', repoInfo.stargazers_count >= 1, 5);
  score += add('Has Multiple Contributors', contributors.length > 1, 10);

  // Issue hygiene (lower open/total ratio = better)
  const totalIssues =
    (repoInfo.open_issues_count || 0) + (repoInfo.closed_issues_count || 0);
  const issueRatio =
    totalIssues > 0 ? repoInfo.open_issues_count / totalIssues : 0;
  score += add('Healthy Issue Ratio (< 50% open)', issueRatio < 0.5, 10);

  // Cap at 100
  const finalScore = Math.min(100, score);

  const grade =
    finalScore >= 85
      ? { letter: 'A', color: '#22c55e' }
      : finalScore >= 70
      ? { letter: 'B', color: '#84cc16' }
      : finalScore >= 55
      ? { letter: 'C', color: '#eab308' }
      : finalScore >= 40
      ? { letter: 'D', color: '#f97316' }
      : { letter: 'F', color: '#ef4444' };

  return { score: finalScore, checks, grade };
};

// ─── Auto-recommendations ────────────────────────────────────────────────────

/** Derive human-readable recommendations from the failed health checks. */
const buildRecommendations = (checks) => {
  const tips = {
    'Has README': 'Add a README.md to explain what the project does and how to get started.',
    'Has License': 'Include an open-source license (e.g. MIT) so contributors know the terms.',
    'Has Description': 'Set a short repository description on GitHub so it shows up in search.',
    'Has Topics/Tags': 'Add relevant GitHub Topics to improve discoverability.',
    'Has Contributing Guide': 'Create a CONTRIBUTING.md to help new contributors onboard quickly.',
    'Has Code of Conduct': 'Add a CODE_OF_CONDUCT.md to foster an inclusive community.',
    'Has Issue Templates': 'Add issue templates (.github/ISSUE_TEMPLATE) to improve bug reports.',
    'Recently Active (< 90 days)': 'Push a commit or release to signal the project is actively maintained.',
    'Has Stars (≥ 1)': 'Share the repository with your network to gain initial traction.',
    'Has Multiple Contributors': 'Encourage collaboration by welcoming external contributors.',
    'Healthy Issue Ratio (< 50% open)': 'Triage open issues regularly to keep the backlog manageable.',
  };

  return checks
    .filter((c) => !c.passed)
    .map((c) => tips[c.label] || `Improve: ${c.label}`);
};

// ─── Language bar chart data ─────────────────────────────────────────────────

/** Convert language byte-count map → sorted array with percentages. */
const processLanguages = (languages) => {
  const total = Object.values(languages).reduce((s, v) => s + v, 0);
  if (total === 0) return [];

  const COLORS = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
    '#3b82f6', '#ef4444', '#14b8a6', '#f97316', '#a855f7',
  ];

  return Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([lang, bytes], i) => ({
      lang,
      pct: ((bytes / total) * 100).toFixed(1),
      color: COLORS[i % COLORS.length],
    }));
};

// ─── HTML template ───────────────────────────────────────────────────────────

/** Build the complete HTML string for Puppeteer to render. */
const buildHtml = (data) => {
  const { repoInfo, langData, contributors, health, recommendations, generatedAt } = data;

  const { score, checks, grade } = health;

  const checksHtml = checks
    .map(
      (c) => `
      <div class="check-row">
        <span class="check-dot ${c.passed ? 'pass' : 'fail'}"></span>
        <span class="check-label">${escapeHtml(c.label)}</span>
        <span class="check-pts">${c.earned}/${c.max} pts</span>
      </div>`
    )
    .join('');

  const langBarsHtml = langData
    .map(
      (l) => `
      <div class="lang-row">
        <span class="lang-name">${escapeHtml(l.lang)}</span>
        <div class="lang-bar-wrap">
          <div class="lang-bar" style="width:${l.pct}%;background:${l.color}"></div>
        </div>
        <span class="lang-pct">${l.pct}%</span>
      </div>`
    )
    .join('');

  const contributorsHtml = (Array.isArray(contributors) ? contributors : [])
    .slice(0, 5)
    .map(
      (c, i) => `
      <div class="contributor">
        <span class="contrib-rank">#${i + 1}</span>
        <img class="avatar" src="${escapeHtml(c.avatar_url || '')}" alt="${escapeHtml(c.login || '')}" />
        <div class="contrib-info">
          <span class="contrib-name">${escapeHtml(c.login || 'Unknown')}</span>
          <span class="contrib-commits">${(c.contributions || 0).toLocaleString('en-US')} commits</span>
        </div>
      </div>`
    )
    .join('');

  const topicsHtml = Array.isArray(repoInfo.topics) && repoInfo.topics.length > 0
    ? repoInfo.topics.map((t) => `<span class="topic">${escapeHtml(t)}</span>`).join('')
    : '<span class="topic-none">No topics defined</span>';

  const recsHtml = recommendations.length === 0
    ? '<p class="all-good">No critical issues detected. Repository health is in good standing.</p>'
    : recommendations.map((r) => `<li class="rec-item">${escapeHtml(r)}</li>`).join('');

  // Score arc path for a clean half-circle gauge
  const arcLen = Math.PI * 50; // circumference of half-circle r=50
  const arcOffset = arcLen * (1 - score / 100);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(repoInfo.full_name)} — Repository Report</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    /*
     * CareerPilot Repository Report — Professional Theme
     * Design tokens from frontend/src/index.css (light mode):
     *   --primary          #0ea5e9
     *   --secondary        #6366f1
     *   --background       #f8fafc
     *   --foreground       #0f172a
     *   --card             #ffffff
     *   --muted            #f1f5f9
     *   --muted-foreground #64748b
     *   --border           #e2e8f0
     *   --destructive      #ef4444
     *   success            #10b981
     *   warning            #f59e0b
     */

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 11.5px;
      color: #0f172a;
      background: #f8fafc;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }

    /* ── Header ── */
    .header {
      background: linear-gradient(135deg, #0284c7 0%, #4f46e5 100%);
      padding: 30px 40px 26px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    /* Monogram instead of emoji */
    .brand-monogram {
      width: 38px;
      height: 38px;
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.3);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 14px;
      font-weight: 800;
      letter-spacing: -1px;
    }

    .brand-text { color: #fff; }
    .brand-name { font-size: 17px; font-weight: 800; letter-spacing: -0.4px; }
    .brand-tagline { font-size: 9.5px; color: rgba(255,255,255,0.7); margin-top: 1px; font-weight: 500; letter-spacing: 0.2px; }

    .header-right { text-align: right; color: rgba(255,255,255,0.85); }
    .header-repo { font-size: 13px; font-weight: 700; color: #fff; }
    .header-sub { font-size: 9.5px; margin-top: 3px; font-weight: 500; }
    .header-date { font-size: 9px; margin-top: 2px; color: rgba(255,255,255,0.65); }

    /* ── Page layout ── */
    .page { padding: 28px 40px; background: #f8fafc; }

    /* ── Divider ── */
    .divider {
      border: none;
      border-top: 1px solid #e2e8f0;
      margin: 22px 0 18px;
    }

    /* ── Section label ── */
    .section-label {
      font-size: 9px;
      font-weight: 700;
      color: #0ea5e9;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-label::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #e2e8f0;
    }

    /* ── Overview ── */
    .overview-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 16px;
    }

    .stat-card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px 12px;
      text-align: center;
    }

    .stat-value {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
    }

    .stat-label {
      font-size: 8.5px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-top: 3px;
      font-weight: 600;
    }

    .overview-desc {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-left: 3px solid #0ea5e9;
      padding: 10px 14px;
      border-radius: 0 6px 6px 0;
      color: #334155;
      font-size: 11px;
      margin-bottom: 12px;
      font-style: italic;
    }

    .meta-row {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      margin-bottom: 10px;
    }
    .meta-item { display: flex; flex-direction: column; gap: 1px; }
    .meta-key {
      font-size: 8.5px;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    .meta-val { font-size: 11px; font-weight: 600; color: #0f172a; }

    .topics { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
    .topic {
      background: #f1f5f9;
      color: #475569;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 2px 8px;
      font-size: 9.5px;
      font-weight: 600;
      letter-spacing: 0.2px;
    }
    .topic-none { color: #94a3b8; font-size: 10px; font-style: italic; }

    /* ── Health score ── */
    .health-layout {
      display: grid;
      grid-template-columns: 160px 1fr;
      gap: 24px;
      align-items: start;
    }

    .gauge-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .gauge-label {
      font-size: 8.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      padding: 3px 12px;
      border-radius: 4px;
      color: #fff;
    }

    .gauge-sub {
      font-size: 9px;
      color: #94a3b8;
      font-weight: 500;
    }

    .checks-list { display: flex; flex-direction: column; gap: 4px; }

    .check-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 5px 10px;
      border-radius: 5px;
      background: #fff;
      border: 1px solid #f1f5f9;
    }

    .check-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .check-dot.pass { background: #10b981; }
    .check-dot.fail { background: #cbd5e1; }

    .check-label { flex: 1; color: #334155; font-size: 10.5px; font-weight: 500; }
    .check-pts { font-size: 9.5px; color: #94a3b8; white-space: nowrap; font-weight: 600; }

    /* ── Tech stack ── */
    .lang-list { display: flex; flex-direction: column; gap: 8px; }
    .lang-row { display: flex; align-items: center; gap: 12px; }
    .lang-name { width: 80px; font-size: 10.5px; font-weight: 600; color: #334155; text-align: right; }
    .lang-bar-wrap {
      flex: 1;
      background: #f1f5f9;
      border-radius: 2px;
      height: 6px;
      overflow: hidden;
    }
    .lang-bar { height: 100%; border-radius: 2px; }
    .lang-pct { width: 38px; font-size: 10px; color: #64748b; text-align: right; font-weight: 600; }

    /* ── Contributors ── */
    .contributors-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 10px;
    }

    .contributor {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      position: relative;
    }

    .contrib-rank {
      position: absolute;
      top: 6px;
      right: 8px;
      font-size: 8.5px;
      font-weight: 700;
      color: #94a3b8;
    }

    .avatar {
      width: 36px; height: 36px;
      border-radius: 50%;
      border: 2px solid #e2e8f0;
    }

    .contrib-info { display: flex; flex-direction: column; align-items: center; gap: 1px; }
    .contrib-name { font-weight: 700; font-size: 10px; color: #0f172a; text-align: center; }
    .contrib-commits { font-size: 9px; color: #64748b; font-weight: 500; }

    /* ── Recommendations ── */
    .rec-list { list-style: none; display: flex; flex-direction: column; gap: 5px; }

    .rec-item {
      padding: 9px 12px 9px 14px;
      background: #fff;
      border: 1px solid #e2e8f0;
      border-left: 3px solid #f59e0b;
      border-radius: 0 6px 6px 0;
      color: #334155;
      font-size: 10.5px;
      font-weight: 500;
      line-height: 1.5;
    }

    .all-good {
      padding: 10px 14px;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-left: 3px solid #10b981;
      border-radius: 0 6px 6px 0;
      color: #166534;
      font-size: 10.5px;
      font-weight: 500;
    }

    /* ── Footer ── */
    .footer {
      margin-top: 28px;
      padding-top: 12px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      font-size: 8.5px;
      color: #94a3b8;
      font-weight: 500;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <div class="header">
    <div class="brand">
      <div class="brand-monogram">CP</div>
      <div class="brand-text">
        <div class="brand-name">CareerPilot</div>
        <div class="brand-tagline">AI-Powered Career Platform</div>
      </div>
    </div>
    <div class="header-right">
      <div class="header-repo">${escapeHtml(repoInfo.full_name)}</div>
      <div class="header-sub">Repository Analysis Report</div>
      <div class="header-date">Generated ${escapeHtml(generatedAt)}</div>
    </div>
  </div>

  <div class="page">

    <!-- 1. Overview -->
    <div class="section-label">Overview</div>

    <div class="overview-grid">
      <div class="stat-card">
        <div class="stat-value">${formatNum(repoInfo.stargazers_count)}</div>
        <div class="stat-label">Stars</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${formatNum(repoInfo.forks_count)}</div>
        <div class="stat-label">Forks</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${formatNum(repoInfo.open_issues_count)}</div>
        <div class="stat-label">Open Issues</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${formatNum(repoInfo.watchers_count)}</div>
        <div class="stat-label">Watchers</div>
      </div>
    </div>

    ${repoInfo.description
      ? `<div class="overview-desc">${escapeHtml(repoInfo.description)}</div>`
      : ''}

    <div class="meta-row">
      <div class="meta-item">
        <span class="meta-key">License</span>
        <span class="meta-val">${escapeHtml(repoInfo.license?.spdx_id || 'Not specified')}</span>
      </div>
      <div class="meta-item">
        <span class="meta-key">Visibility</span>
        <span class="meta-val">${repoInfo.private ? 'Private' : 'Public'}</span>
      </div>
      <div class="meta-item">
        <span class="meta-key">Default Branch</span>
        <span class="meta-val">${escapeHtml(repoInfo.default_branch || 'main')}</span>
      </div>
    </div>

    <div class="topics">${topicsHtml}</div>

    <hr class="divider" />

    <!-- 2. Health Score -->
    <div class="section-title">2 · Health Score</div>
    <div class="health-layout">
      <div class="score-circle-wrap">
        <svg class="score-svg" width="140" height="80" viewBox="-10 -10 130 90">
          <!-- half-circle background -->
          <path
            d="M 5 70 A 50 50 0 0 1 105 70"
            fill="none" stroke="#e2e8f0" stroke-width="10"
          />
          <!-- half-circle score arc -->
          <path
            d="M 5 70 A 50 50 0 0 1 105 70"
            fill="none"
            stroke="${grade.color}"
            stroke-width="10"
            stroke-linecap="round"
            stroke-dasharray="${Math.PI * 50}"
            stroke-dashoffset="${Math.PI * 50 * (1 - score / 100)}"
          />
          <text x="55" y="62" text-anchor="middle" class="score-number" fill="#1e293b">
            ${score}
          </text>
        </svg>
        <span class="score-grade" style="background:${grade.color}">${grade.letter} Grade</span>
        <span class="score-label">out of 100 points</span>
      </div>

      <div class="checks-list">
        ${checksHtml}
      </div>
    </div>

    <!-- 3. Tech Stack -->
    <div class="section-title">3 · Tech Stack</div>
    ${
      langData.length > 0
        ? `<div class="lang-list">${langBarsHtml}</div>`
        : '<p style="color:#94a3b8;font-size:11px">No language data available.</p>'
    }

    <!-- 4. Contributors -->
    <div class="section-title">4 · Top Contributors</div>
    ${
      contributors.length > 0
        ? `<div class="contributors-list">${contributorsHtml}</div>`
        : '<p style="color:#94a3b8;font-size:11px">No contributor data available.</p>'
    }

    <!-- 5. Recommendations -->
    <div class="section-title">5 · Recommendations</div>
    ${
      recommendations.length === 0
        ? '<p class="all-good">🎉 No critical issues found. Great job maintaining this repository!</p>'
        : `<ul class="rec-list">${recsHtml}</ul>`
    }

    <!-- Footer -->
    <div class="footer">
      <span>Generated by CareerPilot · careerpilot.app</span>
      <span>Data sourced from GitHub API · ${escapeHtml(generatedAt)}</span>
      <span>This report is for informational purposes only.</span>
    </div>

  </div>
</body>
</html>`;
};

// ─── Tiny helpers ─────────────────────────────────────────────────────────────

const escapeHtml = (str) =>
  String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const formatNum = (n) =>
  typeof n === 'number' ? n.toLocaleString('en-US') : '—';

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Generate a PDF report for a GitHub repository.
 *
 * @param {string} owner      - GitHub repository owner (user or org)
 * @param {string} repo       - GitHub repository name
 * @param {string} githubToken - User's GitHub personal access token
 * @returns {Promise<Buffer>} Raw PDF bytes ready to stream to the client
 *
 * Errors from githubFetch propagate with .statusCode set:
 *   404 → repo not found or not accessible
 *   403 → forbidden (private repo the user can't read)
 *   502 → unexpected upstream error
 */
export const generateRepoReport = async (owner, repo, githubToken) => {
  // 1. Fetch all data (throws on 404/403/502)
  const { repoInfo, languages, contributors, communityProfile, commits } =
    await fetchRepoData(owner, repo, githubToken);

  // 2. Compute derived data
  const langData = processLanguages(languages);
  const health = computeHealthScore(repoInfo, communityProfile, contributors, commits);
  const recommendations = buildRecommendations(health.checks);

  const generatedAt = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  // 3. Build HTML
  const html = buildHtml({
    repoInfo,
    langData,
    contributors,
    health,
    recommendations,
    generatedAt,
  });

  // 4. Render to PDF with Puppeteer (matches pattern in pdfGenerator.js)
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: `
        <div style="width:100%;font-size:8px;text-align:center;color:#94a3b8;padding-bottom:8px">
          <span class="pageNumber"></span> / <span class="totalPages"></span>
        </div>`,
      margin: { top: '1cm', bottom: '1.5cm', left: '0', right: '0' },
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
};
