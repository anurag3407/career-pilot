/**
 * Generate portfolio section content (hero / about / projects / skills)
 * from a consolidated GitHub data blob.
 *
 * Mirrors the deterministic + AI pattern used by RoastOrchestrator: pure data
 * shaping first, then a single LLM call that emits strict JSON.
 */

const MAX_REPOS_FOR_PROMPT = 6;
const README_PREVIEW_CHARS = 1200;

/**
 * Build the JSON shape passed to the LLM. Includes a profile summary,
 * per-repo facts, and aggregated language + activity stats.
 */
function buildPayload({ profile, repos, languages, aggregateStats }) {
  const slimRepos = repos.slice(0, MAX_REPOS_FOR_PROMPT).map((r) => ({
    name: r.name,
    fullName: r.fullName,
    description: r.description,
    stars: r.stars,
    forks: r.forks,
    language: r.language,
    topics: (r.topics || []).slice(0, 6),
    updatedAt: r.updatedAt,
    readmePreview: r.readme
      ? String(r.readme).slice(0, README_PREVIEW_CHARS).replace(/\s+/g, ' ').trim()
      : '',
  }));

  return {
    profile: profile
      ? {
          login: profile.login,
          name: profile.name,
          bio: profile.bio,
          company: profile.company,
          location: profile.location,
          blog: profile.blog,
          htmlUrl: profile.htmlUrl,
          publicRepos: profile.publicRepos,
          followers: profile.followers,
        }
      : null,
    repos: slimRepos,
    languages,
    aggregateStats,
  };
}

const SECTION_JSON_SHAPE = `{
  "hero": {
    "headline": "<catchy one-liner, max 90 chars>",
    "subheadline": "<one sentence tagline>",
    "location": "<city, country>",
    "availableFor": "<e.g. 'Open to work' or 'Building in public'>"
  },
  "about": "<2-3 paragraph bio based on repos and languages. Plain text, no markdown.>",
  "projects": [
    {
      "name": "<repo name>",
      "title": "<display title>",
      "summary": "<2-3 sentence summary in the user's voice>",
      "highlights": ["<bullet 1>", "<bullet 2>", "<bullet 3>"],
      "tech": ["<tech 1>", "<tech 2>"],
      "url": "<html_url>",
      "stars": <number>,
      "forks": <number>
    }
  ],
  "skills": {
    "languages": [{"name": "JavaScript", "level": 1-5}],
    "tools": ["<tool 1>", "<tool 2>"],
    "domains": ["<domain 1>", "<domain 2>"]
  },
  "callToAction": "<one-line CTA, e.g. 'Open to backend roles — let's build something'>"
}`;

/**
 * @param {object} ctx
 * @param {object} ctx.profile        - Output of fetchGithubProfile()
 * @param {Array}  ctx.repos          - Output of enrichWithGitHubData() for each selected repo
 * @param {object} ctx.languages      - Aggregated language byte counts across repos
 * @param {object} ctx.aggregateStats - { stars, forks, commits, topLanguages }
 * @param {object} ctx.aiProvider     - AI adapter from middleware
 */
export const generateGithubPortfolio = async ({
  profile,
  repos,
  languages,
  aggregateStats,
  aiProvider,
}) => {
  if (!aiProvider) {
    throw new Error('AI provider is required for portfolio generation');
  }

  const payload = buildPayload({ profile, repos, languages, aggregateStats });

  const prompt = `You are a senior portfolio strategist. Build a complete portfolio draft from this GitHub data.

DATA:
${JSON.stringify(payload, null, 2)}

RULES:
1. Be authentic to the user's actual work — only reference repos/languages in DATA.
2. Use first-person voice sparingly; focus on outcomes and craft.
3. Order projects by star count, then by recency.
4. Skills should reflect the languages actually present in DATA.
5. Hero headline max 90 chars. Subheadline one sentence.
6. About should be 2-3 short paragraphs.
7. For each project, write 2-3 sentences explaining what it does and the value it delivers — NOT just restating the README.
8. NEVER invent credentials, employers, education, or projects.
9. Return ONLY valid JSON (no markdown fences, no commentary).

Return JSON in this exact shape:
${SECTION_JSON_SHAPE}`;

  const result = await aiProvider.generateContent(prompt);
  let text = String(result.text || '').trim();

  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\n?/i, '').replace(/\n?```\s*$/i, '').trim();
  }
  const match = text.match(/\{[\s\S]*\}/);
  if (match) text = match[0];

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    console.error('[generateGithubPortfolio] JSON parse error:', err.message, 'Raw:', text.slice(0, 400));
    throw new Error('AI returned an invalid portfolio response. Please try again.');
  }

  return {
    sections: {
      hero: parsed.hero || {},
      about: parsed.about || '',
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      skills: parsed.skills || { languages: [], tools: [], domains: [] },
      callToAction: parsed.callToAction || '',
    },
    provider: aiProvider.providerName,
  };
};

/**
 * Compute aggregate stats and language totals across an array of enriched repos.
 *
 * @param {Array} repos - Each entry should have { metadata: { stars, forks, language, topics }, languages: {Lang: bytes} }
 */
export const aggregateRepoData = (repos) => {
  const languages = {};
  const domains = new Set();
  const tools = new Set();
  let stars = 0;
  let forks = 0;
  let commits = 0;

  for (const r of repos) {
    const m = r.metadata || {};
    stars += Number(m.stars) || 0;
    forks += Number(m.forks) || 0;
    commits += Array.isArray(r.recentCommits) ? r.recentCommits.length : 0;

    if (m.language) languages[m.language] = (languages[m.language] || 0) + 1;
    for (const [lang, bytes] of Object.entries(r.languages || {})) {
      languages[lang] = (languages[lang] || 0) + Number(bytes || 0);
    }
    for (const t of m.topics || []) {
      if (typeof t === 'string') domains.add(t.toLowerCase());
    }
  }

  // Sort languages by total bytes (or count if bytes unavailable)
  const sortedLanguages = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .map(([name, value]) => ({ name, value }));

  return {
    stars,
    forks,
    commits,
    topLanguages: sortedLanguages.slice(0, 8),
    domains: Array.from(domains).slice(0, 10),
    tools: Array.from(tools).slice(0, 10),
    reposAnalyzed: repos.length,
  };
};