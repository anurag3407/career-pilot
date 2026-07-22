

const getHeaders = (token = null) => {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Career-Pilot-Backend'
  };

  // Precedence: explicit token (BYOK) > env GITHUB_TOKEN > unauthenticated
  const effectiveToken = token || process.env.GITHUB_TOKEN;
  if (effectiveToken) {
    headers['Authorization'] = `token ${effectiveToken}`;
  }

  return headers;
};

const checkRateLimit = (response) => {
  const remaining = response.headers.get('x-ratelimit-remaining');
  return remaining && parseInt(remaining, 10) === 0;
};

/**
 * Enrich a GitHub repo with metadata, contributors, languages, commits and branches.
 *
 * @param {string} repoOwner       - Owner login
 * @param {string} repoName        - Repo name
 * @param {string|null} [token]    - Optional BYOK user token. Falls back to env GITHUB_TOKEN.
 */
export const enrichWithGitHubData = async (repoOwner, repoName, token = null) => {
  try {
    const baseUrl = `https://api.github.com/repos/${repoOwner}/${repoName}`;
    const headers = getHeaders(token);

    // Fetch repository metadata
    const repoResponse = await fetch(baseUrl, { headers });

    if (!repoResponse.ok) {
      if (checkRateLimit(repoResponse)) {
        console.warn('⚠️ GitHub API rate limit reached. Returning partial data.');
        return { rateLimited: true, metadata: {}, contributors: [], languages: {}, recentCommits: [], branches: [] };
      }
      throw new Error(`GitHub API error: ${repoResponse.statusText}`);
    }

    const repoData = await repoResponse.json();

    const metadata = {
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      openIssues: repoData.open_issues_count,
      license: repoData.license?.name || null,
      description: repoData.description,
      defaultBranch: repoData.default_branch,
      createdAt: repoData.created_at,
      updatedAt: repoData.updated_at,
      topics: repoData.topics || [],
      homepage: repoData.homepage || null,
      language: repoData.language || null,
      size: repoData.size || 0,
      visibility: repoData.visibility || (repoData.private ? 'private' : 'public'),
    };

    // Fetch contributors (top 30)
    let contributors = [];
    try {
      const contributorsResponse = await fetch(`${baseUrl}/contributors?per_page=30`, { headers });
      if (contributorsResponse.ok) {
        const contributorsData = await contributorsResponse.json();
        contributors = contributorsData.map(c => ({
          login: c.login,
          avatar: c.avatar_url,
          contributions: c.contributions
        }));
      }
    } catch (e) {
      console.warn(`Failed to fetch contributors: ${e.message}`);
    }

    // Fetch languages
    let languages = {};
    try {
      const languagesResponse = await fetch(`${baseUrl}/languages`, { headers });
      if (languagesResponse.ok) {
        languages = await languagesResponse.json();
      }
    } catch (e) {
      console.warn(`Failed to fetch languages: ${e.message}`);
    }

    // Fetch recent commits (30)
    let recentCommits = [];
    try {
      const commitsResponse = await fetch(`${baseUrl}/commits?per_page=30`, { headers });
      if (commitsResponse.ok) {
        const commitsData = await commitsResponse.json();
        recentCommits = commitsData.map(c => ({
          sha: c.sha,
          message: c.commit.message,
          author: {
            login: c.author?.login || c.commit.author.name,
            avatar: c.author?.avatar_url
          },
          date: c.commit.author.date
        }));
      }
    } catch (e) {
      console.warn(`Failed to fetch commits: ${e.message}`);
    }

    // Fetch branches
    let branches = [];
    try {
      const branchesResponse = await fetch(`${baseUrl}/branches`, { headers });
      if (branchesResponse.ok) {
        const branchesData = await branchesResponse.json();
        branches = branchesData.map(b => b.name);
      }
    } catch (e) {
      console.warn(`Failed to fetch branches: ${e.message}`);
    }

    // Fetch README (base64-decoded plaintext)
    let readme = null;
    try {
      const readmeResponse = await fetch(`${baseUrl}/readme`, { headers });
      if (readmeResponse.ok) {
        const readmeData = await readmeResponse.json();
        if (readmeData?.content) {
          readme = Buffer.from(readmeData.content, 'base64').toString('utf8');
        }
      }
    } catch (e) {
      console.warn(`Failed to fetch README: ${e.message}`);
    }

    return {
      metadata,
      contributors,
      languages,
      recentCommits,
      branches,
      readme,
      rateLimited: false
    };
  } catch (error) {
    console.error('❌ Error in enrichWithGitHubData:', error.message);
    return { rateLimited: false, metadata: {}, contributors: [], languages: {}, recentCommits: [], branches: [], readme: null, error: error.message };
  }
};

/**
 * Fetch a user's public (or token-visible) repositories.
 *
 * @param {string} username       - GitHub login
 * @param {object} [opts]
 * @param {string|null} [opts.token]   - Optional BYOK token (unlocks private repos)
 * @param {string} [opts.sort]         - created | updated | pushed | full_name (default 'updated')
 * @param {number} [opts.perPage]      - Default 30, max 100
 */
export const listUserRepos = async (username, { token = null, sort = 'updated', perPage = 30 } = {}) => {
  const effectiveToken = token || process.env.GITHUB_TOKEN;
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Career-Pilot-Backend',
  };
  if (effectiveToken) headers.Authorization = `token ${effectiveToken}`;

  const response = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=${sort}&per_page=${perPage}&type=all`,
    { headers }
  );

  if (!response.ok) {
    if (checkRateLimit(response)) {
      return { rateLimited: true, repos: [] };
    }
    throw new Error(`GitHub API error listing repos: ${response.statusText}`);
  }

  const repos = await response.json();
  return {
    rateLimited: false,
    repos: repos.map((r) => ({
      id: r.id,
      name: r.name,
      fullName: r.full_name,
      description: r.description,
      private: r.private,
      htmlUrl: r.html_url,
      stars: r.stargazers_count,
      forks: r.forks_count,
      language: r.language,
      topics: r.topics || [],
      updatedAt: r.updated_at,
      pushedAt: r.pushed_at,
      defaultBranch: r.default_branch,
    })),
  };
};

/**
 * Fetch a user's profile (public or token-visible).
 *
 * @param {string} username
 * @param {string|null} [token]
 */
export const fetchGithubProfile = async (username, token = null) => {
  const effectiveToken = token || process.env.GITHUB_TOKEN;
  const headers = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Career-Pilot-Backend',
  };
  if (effectiveToken) headers.Authorization = `token ${effectiveToken}`;

  const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
    headers,
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`GitHub user "${username}" not found`);
    }
    if (checkRateLimit(response)) {
      return { rateLimited: true };
    }
    throw new Error(`GitHub API error: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    rateLimited: false,
    profile: {
      login: data.login,
      name: data.name,
      bio: data.bio,
      avatarUrl: data.avatar_url,
      htmlUrl: data.html_url,
      company: data.company,
      location: data.location,
      blog: data.blog,
      twitter: data.twitter_username,
      publicRepos: data.public_repos,
      followers: data.followers,
      following: data.following,
      createdAt: data.created_at,
    },
  };
};
