import fetch from 'node-fetch';

let customFetch = fetch;

/**
 * Overrides the fetch implementation for testing purposes.
 */
export const setFetch = (fn) => {
  customFetch = fn;
};

/**
 * Parses various GitHub URL formats into owner and repo.
 * @param {string} url - GitHub repository URL
 * @returns {object} { owner, repo }
 */
export const parseGitHubUrl = (url) => {
  if (!url) throw new Error('Repository URL is required');
  
  let cleanUrl = url.trim().replace(/\/$/, '');
  if (cleanUrl.endsWith('.git')) {
    cleanUrl = cleanUrl.slice(0, -4);
  }

  // Shorthand "owner/repo"
  const simpleMatch = /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.exec(cleanUrl);
  if (simpleMatch) {
    const [owner, repo] = cleanUrl.split('/');
    return { owner, repo };
  }

  // SSH Format: git@github.com:owner/repo
  const sshRegex = /^git@github\.com:([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/;
  const sshMatch = sshRegex.exec(cleanUrl);
  if (sshMatch) {
    return { owner: sshMatch[1], repo: sshMatch[2] };
  }

  // HTTPS Format: https://github.com/owner/repo
  try {
    const parsed = new URL(cleanUrl);
    if (parsed.hostname !== 'github.com' && parsed.hostname !== 'www.github.com') {
      throw new Error('Not a GitHub repository URL');
    }
    const paths = parsed.pathname.split('/').filter(Boolean);
    if (paths.length >= 2) {
      return { owner: paths[0], repo: paths[1] };
    }
  } catch (e) {
    if (e.message === 'Not a GitHub repository URL') {
      throw e;
    }
  }

  throw new Error('Invalid GitHub repository URL format');
};

/**
 * Constructs standard headers for GitHub API requests.
 */
const getHeaders = (token) => {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Career-Pilot-RepoScanner'
  };
  const tokenToUse = token || process.env.GITHUB_TOKEN;
  if (tokenToUse) {
    headers['Authorization'] = `token ${tokenToUse}`;
  }
  return headers;
};

/**
 * Fetches repository general metadata.
 */
export const fetchRepoMetadata = async (owner, repo, token) => {
  const url = `https://api.github.com/repos/${owner}/${repo}`;
  const response = await customFetch(url, { headers: getHeaders(token) });
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Repository not found');
    }
    if (response.status === 403 || response.status === 429) {
      throw new Error('GitHub API rate limit exceeded');
    }
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

/**
 * Fetches repository root directory structure.
 */
export const fetchRepoStructure = async (owner, repo, token) => {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents`;
  const response = await customFetch(url, { headers: getHeaders(token) });
  
  if (!response.ok) {
    return [];
  }
  
  return response.json();
};

/**
 * Fetches package.json content and returns it parsed as JSON.
 */
export const fetchPackageJsonContent = async (owner, repo, token) => {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/package.json`;
  const response = await customFetch(url, { headers: getHeaders(token) });
  
  if (!response.ok) {
    return null;
  }
  
  const data = await response.json();
  if (data.content && data.encoding === 'base64') {
    const rawContent = Buffer.from(data.content, 'base64').toString('utf-8');
    try {
      return JSON.parse(rawContent);
    } catch (e) {
      return null;
    }
  }
  
  return null;
};

/**
 * Fetches the recent commit history.
 */
export const fetchRecentCommits = async (owner, repo, token) => {
  const url = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=10`;
  const response = await customFetch(url, { headers: getHeaders(token) });
  
  if (!response.ok) {
    return [];
  }
  
  return response.json();
};

/**
 * Calculates a repository health score from 0 to 100.
 */
export const calculateHealthScore = (metadata, structure, packageJson, commits) => {
  let score = 0;
  const breakDown = {
    hasReadme: false,
    hasLicense: false,
    hasGitignore: false,
    hasCIWorkflow: false,
    hasDockerfile: false,
    hasPackageJson: false,
    hasTests: false,
    hasRecentActivity: false,
    starsCount: metadata?.stargazers_count || 0,
    openIssuesCount: metadata?.open_issues_count || 0
  };

  const fileNames = new Set((structure || []).map(f => f.name.toLowerCase()));
  
  // 1. Documentation (25 pts)
  if (fileNames.has('readme.md')) {
    score += 15;
    breakDown.hasReadme = true;
  }
  
  const hasLicenseFile = (structure || []).some(f => f.name.toLowerCase().includes('license'));
  if (hasLicenseFile) {
    score += 10;
    breakDown.hasLicense = true;
  }

  // 2. Configuration & DevOps (20 pts)
  if (fileNames.has('.gitignore')) {
    score += 10;
    breakDown.hasGitignore = true;
  }
  
  const hasCI = (structure || []).some(f => f.name.toLowerCase() === '.github' && f.type === 'dir') ||
                fileNames.has('.gitlab-ci.yml') || fileNames.has('github');
  if (hasCI) {
    score += 5;
    breakDown.hasCIWorkflow = true;
  }

  if (fileNames.has('dockerfile') || fileNames.has('docker-compose.yml')) {
    score += 5;
    breakDown.hasDockerfile = true;
  }

  // 3. Project Configuration & Testing (25 pts)
  if (fileNames.has('package.json')) {
    score += 10;
    breakDown.hasPackageJson = true;
    
    if (packageJson && packageJson.scripts && packageJson.scripts.test) {
      score += 15;
      breakDown.hasTests = true;
    }
  } else {
    const otherConfigs = ['requirements.txt', 'go.mod', 'cargo.toml', 'pom.xml', 'build.gradle'];
    const hasOtherConfig = otherConfigs.some(c => fileNames.has(c));
    if (hasOtherConfig) {
      score += 10;
      breakDown.hasPackageJson = true;
      
      score += 10; // partial test score assumption
      breakDown.hasTests = true;
    }
  }

  // 4. Activity & Engagement (30 pts)
  if (commits && commits.length > 0) {
    score += 10;
    
    const latestCommitDateStr = commits[0]?.commit?.committer?.date || commits[0]?.commit?.author?.date;
    if (latestCommitDateStr) {
      const latestCommitDate = new Date(latestCommitDateStr);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      if (latestCommitDate >= thirtyDaysAgo) {
        score += 10;
        breakDown.hasRecentActivity = true;
      }
    }
  }

  if (metadata && metadata.stargazers_count > 0) {
    const stars = metadata.stargazers_count;
    if (stars > 100) score += 5;
    else if (stars > 10) score += 4;
    else score += 2;
  }

  if (metadata && metadata.open_issues_count !== undefined) {
    const issues = metadata.open_issues_count;
    if (issues > 0 && issues < 50) {
      score += 5;
    } else if (issues >= 50 && issues < 200) {
      score += 3;
    } else if (issues === 0) {
      score += 2;
    }
  }

  return {
    score: Math.min(100, score),
    breakDown
  };
};

/**
 * Scans a GitHub repository and returns metadata and health score.
 * @param {string} repoUrl - GitHub repository URL
 * @param {string} [token] - Optional GitHub Personal Access Token
 * @returns {object} Scanner result
 */
export const scanRepository = async (repoUrl, token) => {
  const { owner, repo } = parseGitHubUrl(repoUrl);
  
  const metadata = await fetchRepoMetadata(owner, repo, token);
  const structure = await fetchRepoStructure(owner, repo, token);
  
  let packageJson = null;
  const fileNames = new Set((structure || []).map(f => f.name.toLowerCase()));
  if (fileNames.has('package.json')) {
    packageJson = await fetchPackageJsonContent(owner, repo, token);
  }
  
  const commits = await fetchRecentCommits(owner, repo, token);
  const health = calculateHealthScore(metadata, structure, packageJson, commits);
  
  return {
    owner,
    repo,
    name: metadata.name,
    description: metadata.description,
    primaryLanguage: metadata.language,
    stars: metadata.stargazers_count,
    forks: metadata.forks_count,
    openIssues: metadata.open_issues_count,
    createdAt: metadata.created_at,
    updatedAt: metadata.updated_at,
    pushedAt: metadata.pushed_at,
    health
  };
};
