

const getUtcDateKey = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
};

const shiftUtcDate = (date, days) => {
  const shifted = new Date(date);
  shifted.setUTCDate(shifted.getUTCDate() + days);
  return shifted;
};

const calculateCurrentActivityStreak = (repos) => {
  const activeDates = new Set(
    repos
      .map(repo => getUtcDateKey(repo.pushed_at || repo.updated_at))
      .filter(Boolean)
  );

  if (activeDates.size === 0) return 0;

  let cursor = new Date();
  let cursorKey = getUtcDateKey(cursor);

  if (!activeDates.has(cursorKey)) {
    cursor = shiftUtcDate(cursor, -1);
    cursorKey = getUtcDateKey(cursor);
  }

  let streak = 0;
  while (activeDates.has(cursorKey)) {
    streak += 1;
    cursor = shiftUtcDate(cursor, -1);
    cursorKey = getUtcDateKey(cursor);
  }

  return streak;
};

/**
 * Fetches user profile and repository data from GitHub public API
 * @param {string} username - GitHub username
 * @param {string|null} [token] - Optional BYOK token
 */
export const fetchGitHubProfile = async (username, token = null) => {
  try {
    const headers = {
      'User-Agent': 'Career-Pilot-App',
      'Accept': 'application/vnd.github.v3+json'
    };

    // Add GitHub token if available to increase rate limits
    const effectiveToken = token || process.env.GITHUB_TOKEN;
    if (effectiveToken && typeof effectiveToken === 'string' && effectiveToken.trim()) {
      const cleanToken = effectiveToken.trim();
      headers['Authorization'] = (cleanToken.startsWith('Bearer ') || cleanToken.startsWith('token '))
        ? cleanToken
        : `Bearer ${cleanToken}`;
    }

    // Fetch user profile
    const profileResponse = await fetch(`https://api.github.com/users/${username}`, { headers });
    if (!profileResponse.ok) {
      if (profileResponse.status === 404) {
        const err = new Error('GitHub user not found. Check the username and try again.');
        err.status = 404;
        throw err;
      }
      if (profileResponse.status === 403 || profileResponse.status === 429) {
        const err = new Error('GitHub API rate limit exceeded. Please try again later or add a GitHub Personal Access Token in Settings.');
        err.status = 429;
        throw err;
      }
      if (profileResponse.status === 401) {
        const err = new Error('Invalid or expired GitHub token. Please verify your GitHub token.');
        err.status = 401;
        throw err;
      }
      const err = new Error(`GitHub API error (${profileResponse.status}): ${profileResponse.statusText}`);
      err.status = profileResponse.status;
      throw err;
    }
    const profile = await profileResponse.json();

    // Fetch user repositories (get top 100, sorted by updated)
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, { headers });
    let repos = [];
    if (reposResponse.ok) {
      const repoData = await reposResponse.json();
      if (Array.isArray(repoData)) {
        repos = repoData;
      }
    }

    // Process repository data
    const processedRepos = repos
      .filter(repo => repo && !repo.fork) // Ignore forks
      .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0)) // Sort by stars
      .slice(0, 6) // Take top 6
      .map(repo => ({
        name: repo.name || '',
        description: repo.description || '',
        url: repo.html_url || '',
        language: repo.language || null,
        stars: repo.stargazers_count || 0,
        updatedAt: repo.updated_at || null
      }));

    // Aggregate languages
    const languages = {};
    repos.forEach(repo => {
      if (repo && repo.language && !repo.fork) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    // Sort languages by frequency
    const topLanguages = Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([lang]) => lang);

    const sourceRepos = repos.filter(repo => repo && !repo.fork);
    const totalStars = sourceRepos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
    const currentStreak = calculateCurrentActivityStreak(sourceRepos);

    return {
      username: profile.login,
      name: profile.name || profile.login,
      bio: profile.bio || '',
      company: profile.company || '',
      location: profile.location || '',
      email: profile.email || '',
      blog: profile.blog || '',
      avatar_url: profile.avatar_url,
      public_repos: profile.public_repos || 0,
      followers: profile.followers || 0,
      url: profile.html_url,
      totalRepos: profile.public_repos || 0,
      totalStars,
      currentStreak,
      topRepositories: processedRepos,
      topLanguages
    };
  } catch (error) {
    console.error('Error fetching GitHub profile:', error);
    throw error;
  }
};

/**
 * Converts GitHub profile data into structured resume text
 * @param {object} profileData - Data returned by fetchGitHubProfile
 */
export const convertGitHubToResumeText = (profileData) => {
  let text = `# ${profileData.name}\n\n`;
  
  // Contact Info
  const contact = [];
  if (profileData.email) contact.push(`[${profileData.email}](mailto:${profileData.email})`);
  contact.push(`[GitHub](https://github.com/${profileData.username})`);
  if (profileData.blog) contact.push(`[Portfolio](${profileData.blog.startsWith('http') ? profileData.blog : 'https://' + profileData.blog})`);
  if (profileData.location) contact.push(profileData.location);
  
  text += `${contact.join(' | ')}\n\n`;

  // Summary
  text += `## SUMMARY\n\n`;
  if (profileData.bio) {
    text += `${profileData.bio}\n\n`;
  } else {
    text += `Software developer with a strong focus on open-source contributions. Actively maintaining ${profileData.public_repos} repositories and proficient in ${profileData.topLanguages.slice(0, 3).join(', ')}.\n\n`;
  }

  // Skills
  if (profileData.topLanguages.length > 0) {
    text += `## SKILLS\n\n`;
    text += `**Languages & Technologies:** ${profileData.topLanguages.join(', ')}\n\n`;
  }

  // Experience (from company if available)
  if (profileData.company) {
    text += `## EXPERIENCE\n\n`;
    const cleanCompany = profileData.company.replace('@', '');
    text += `**Software Engineer** | ${cleanCompany} | Present\n`;
    text += `- Developed and maintained software projects as per organization requirements\n`;
    text += `- Contributed to various repositories using ${profileData.topLanguages.slice(0, 3).join(', ')}\n\n`;
  }

  // Projects
  if (profileData.topRepositories.length > 0) {
    text += `## PROJECTS\n\n`;
    
    profileData.topRepositories.forEach(repo => {
      text += `**${repo.name}** | ${repo.language || 'Multiple Technologies'}\n`;
      if (repo.description) {
        text += `- ${repo.description}\n`;
      }
      if (repo.stars > 0) {
        text += `- Achieved ${repo.stars} stars on GitHub\n`;
      }
      text += `- [Project Link](${repo.url})\n\n`;
    });
  }

  return text;
};
