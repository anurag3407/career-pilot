// LinkedIn profile import via LinkdAPI (https://linkdapi.com)
// Paid: ~$0.01/profile. No scraping, no bot detection.
// Set LINKDAPI_API_KEY in .env to enable.

import { jobsScrapedCounter } from '../middleware/metrics.js';

// Using LinkdAPI
const LINKDAPI_ENDPOINT = 'https://linkdapi.com/api/v1/profile/full';

const getMockProfile = (url) => ({
  name: 'Alex Developer',
  headline: 'Full-Stack Engineer | React · Node.js · TypeScript',
  location: 'San Francisco, CA',
  about:
    'Passionate software engineer with 4 years of experience building scalable web applications. ' +
    'Strong background in React, Node.js, and cloud infrastructure.',
  experience: [
    {
      title: 'Senior Software Engineer',
      company: 'TechCorp',
      duration: '2022 – Present',
      description:
        'Led migration of monolith to microservices, reducing latency by 40%.',
    },
    {
      title: 'Software Engineer',
      company: 'StartupXYZ',
      duration: '2020 – 2022',
      description: 'Built React dashboard used by 50k+ users.',
    },
  ],
  education: [
    {
      school: 'University of California, Berkeley',
      degree: 'B.S. Computer Science',
      duration: '2016 – 2020',
    },
  ],
  skills: [
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'PostgreSQL',
    'Docker',
    'AWS',
  ],
  _mock: true,
  _mockNote: `DEV MODE — set LINKDAPI_API_KEY to fetch the real profile for: ${url}`,
});

const TINYFISH_ENDPOINT = 'https://api.search.tinyfish.ai';

export const scrapeLinkedInProfile = async (url) => {
  const apiKey = process.env.TINYFISH_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      console.warn('⚠️ TINYFISH_API_KEY is not set — returning mock LinkedIn profile.');
      return getMockProfile(url);
    }
    throw new Error('LinkedIn import requires TINYFISH_API_KEY to be set in environment variables.');
  }

  const requestUrl = `${TINYFISH_ENDPOINT}?query=${encodeURIComponent(url)}`;

  const response = await fetch(requestUrl, {
    headers: {
      'X-API-Key': apiKey,
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`TinyFish API error (${response.status}): ${body || response.statusText}`);
  }

  const data = await response.json();
  const results = data.results || [];

  if (!results.length) {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      return getMockProfile(url);
    }
    throw new Error('No LinkedIn profile results found via TinyFish search.');
  }

  // Extract primary result
  const primaryResult = results.find(r => r.url && r.url.includes('/in/')) || results[0];

  // Clean title (e.g. "Satya Nadella - Chairman and CEO at Microsoft | LinkedIn")
  let cleanTitle = (primaryResult.title || '')
    .replace(/\s*\|\s*LinkedIn$/i, '')
    .replace(/\s*-\s*LinkedIn$/i, '')
    .trim();

  let name = '';
  let headline = '';

  if (cleanTitle.includes(' - ')) {
    const parts = cleanTitle.split(' - ');
    name = parts[0].trim();
    headline = parts.slice(1).join(' - ').trim();
  } else if (cleanTitle.includes(' – ')) {
    const parts = cleanTitle.split(' – ');
    name = parts[0].trim();
    headline = parts.slice(1).join(' – ').trim();
  } else {
    name = cleanTitle;
  }

  // Combine snippets
  const allSnippets = results
    .map(r => r.snippet)
    .filter(Boolean)
    .join('\n\n');

  const about = primaryResult.snippet || allSnippets.slice(0, 300);

  // Extract experience items from other LinkedIn result snippets
  const experience = results.slice(1, 5).map(r => {
    return {
      title: r.title ? r.title.replace(/\s*\|\s*LinkedIn$/i, '').trim() : 'Experience / Activity',
      company: r.site_name || 'LinkedIn',
      duration: r.date || 'Present',
      description: r.snippet || ''
    };
  });

  // Extract skills from snippets
  const knownSkills = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'AWS', 'Docker', 'Kubernetes', 'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'GraphQL', 'REST API', 'AI', 'Machine Learning', 'Leadership', 'Management', 'Strategy'];
  const extractedSkills = knownSkills.filter(skill => {
    const escaped = skill.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    return new RegExp(`${escaped}`, 'i').test(allSnippets);
  });

  try {
    if (jobsScrapedCounter && typeof jobsScrapedCounter.inc === 'function') {
      jobsScrapedCounter.inc({
        source: 'linkedin_tinyfish',
      });
    }
  } catch (e) {
    // Ignore counter errors
  }

  return {
    name: name || 'LinkedIn Profile',
    headline: headline || 'Professional',
    location: '',
    about,
    experience: experience.length ? experience : [
      {
        title: headline || 'Professional Role',
        company: 'LinkedIn Profile Data',
        duration: 'Present',
        description: about
      }
    ],
    education: [],
    skills: extractedSkills.length ? extractedSkills : ['Leadership', 'Management', 'Strategy'],
    _source: 'tinyfish'
  };
};

export const profileToResumeText = (profile) => {
  const lines = [];

  lines.push(`# ${profile.name || 'Your Name'}`);
  if (profile.location) lines.push(profile.location);
  lines.push('');

  if (profile.about) {
    lines.push('## SUMMARY');
    lines.push(profile.about.replace(/\n+/g, ' '));
    lines.push('');
  }

  if (profile.experience?.length) {
    lines.push('## EXPERIENCE');
    profile.experience.forEach((exp) => {
      const header = [exp.title, exp.company, exp.duration]
        .filter(Boolean)
        .join(' | ');
      lines.push(`### ${header}`);
      if (exp.description) {
        exp.description
          .split('\n')
          .map((l) => l.replace(/^[-•·]\s*/, '').trim())
          .filter(Boolean)
          .forEach((l) => lines.push(`- ${l}`));
      }
      lines.push('');
    });
  }

  if (profile.education?.length) {
    lines.push('## EDUCATION');
    profile.education.forEach((edu) => {
      const header = [edu.degree, edu.school, edu.duration]
        .filter(Boolean)
        .join(' | ');
      lines.push(`### ${header}`);
      lines.push('');
    });
  }

  if (profile.skills?.length) {
    lines.push('## SKILLS');
    lines.push(profile.skills.join(', '));
    lines.push('');
  }

  return lines.join('\n');
};
