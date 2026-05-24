import fetch from 'node-fetch';

/**
 * Fetches user profile and repository data from GitHub public API
 * @param {string} username - GitHub username
 */
export const fetchGitHubProfile = async (username) => {
  try {
    const headers = {
      'User-Agent': 'Career-Pilot-App'
    };
    
    // Add GitHub token if available to increase rate limits
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    // Fetch user profile
    const profileResponse = await fetch(`https://api.github.com/users/${username}`, { headers });
    if (!profileResponse.ok) {
      if (profileResponse.status === 404) {
        throw new Error('GitHub user not found');
      }
      throw new Error(`GitHub API error: ${profileResponse.statusText}`);
    }
    const profile = await profileResponse.json();

    // Fetch user repositories (get top 100, sorted by updated)
    const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, { headers });
    let repos = [];
    if (reposResponse.ok) {
      repos = await reposResponse.json();
    }

    // Process repository data
    const processedRepos = repos
      .filter(repo => !repo.fork) // Ignore forks
      .sort((a, b) => b.stargazers_count - a.stargazers_count) // Sort by stars
      .slice(0, 6) // Take top 6
      .map(repo => ({
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        language: repo.language,
        stars: repo.stargazers_count,
        updatedAt: repo.updated_at
      }));

    // Aggregate languages
    const languages = {};
    repos.forEach(repo => {
      if (repo.language && !repo.fork) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    // Sort languages by frequency
    const topLanguages = Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([lang]) => lang);

    return {
      username: profile.login,
      name: profile.name || profile.login,
      bio: profile.bio || '',
      company: profile.company || '',
      location: profile.location || '',
      email: profile.email || '',
      blog: profile.blog || '',
      avatar_url: profile.avatar_url,
      public_repos: profile.public_repos,
      followers: profile.followers,
      url: profile.html_url,
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
