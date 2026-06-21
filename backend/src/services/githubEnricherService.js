import fetch from 'node-fetch';

const getHeaders = () => {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Career-Pilot-Backend'
  };
  
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }
  
  return headers;
};

const checkRateLimit = (response) => {
  const remaining = response.headers.get('x-ratelimit-remaining');
  return remaining && parseInt(remaining, 10) === 0;
};

export const enrichWithGitHubData = async (repoOwner, repoName) => {
  try {
    const baseUrl = `https://api.github.com/repos/${repoOwner}/${repoName}`;
    const headers = getHeaders();
    
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
      updatedAt: repoData.updated_at
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

    return {
      metadata,
      contributors,
      languages,
      recentCommits,
      branches,
      rateLimited: false
    };
  } catch (error) {
    console.error('❌ Error in enrichWithGitHubData:', error.message);
    return { rateLimited: false, metadata: {}, contributors: [], languages: {}, recentCommits: [], branches: [], error: error.message };
  }
};
