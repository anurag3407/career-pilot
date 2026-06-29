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

export const scrapeLinkedInProfile = async (url) => {
  const apiKey = process.env.LINKDAPI_API_KEY || process.env.PROXYCURL_API_KEY;

  if (!apiKey) {
    const env = process.env.NODE_ENV;
    if (env === 'development' || env === 'test') {
      console.warn(
        '⚠️  LINKDAPI_API_KEY is not set — returning mock LinkedIn profile (development/test only).'
      );
      return getMockProfile(url);
    }
    throw new Error(
      'LinkedIn import requires a LinkdAPI API key. Set LINKDAPI_API_KEY in your .env file. ' +
        'Get a key at https://linkdapi.com.'
    );
  }

  // Extract username from url
  const match = url.match(/\/in\/([^/?#]+)/i);
  const username = match ? match[1] : url.replace(/\/$/, '').split('/').pop();

  const requestUrl = `${LINKDAPI_ENDPOINT}?username=${encodeURIComponent(username)}`;

  const response = await fetch(requestUrl, {
    headers: { 'X-linkdapi-apikey': apiKey },
  });

  if (response.status === 401) {
    throw new Error(
      'Invalid LinkdAPI key. Check your LINKDAPI_API_KEY in .env.'
    );
  }
  if (response.status === 403) {
    throw new Error('LinkdAPI credits exhausted. Add credits at linkdapi.com.');
  }
  if (response.status === 404) {
    throw new Error(
      'LinkedIn profile not found. Make sure the URL is correct and the profile is public.'
    );
  }
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(
      `LinkdAPI error (${response.status}): ${body || response.statusText}`
    );
  }

  const data = await response.json();

  jobsScrapedCounter.inc({
    source: 'linkedin',
  });

  // LinkdAPI response mapping
  const profileData = data.data || {};

  const experience = (
    profileData.position ||
    profileData.fullPositions ||
    []
  ).map((exp) => {
    const startYear = exp.start?.year;
    const endYear = exp.end?.year === 0 ? 'Present' : exp.end?.year;
    return {
      title: exp.title || '',
      company: exp.companyName || '',
      duration: [startYear, endYear].filter(Boolean).join(' – '),
      description: exp.description || '',
    };
  });

  const education = (profileData.educations || []).map((edu) => {
    const startYear = edu.start?.year;
    const endYear = edu.end?.year === 0 ? 'Present' : edu.end?.year;
    return {
      school: edu.schoolName || '',
      degree: [edu.degree, edu.fieldOfStudy].filter(Boolean).join(', '),
      duration: [startYear, endYear].filter(Boolean).join(' – '),
    };
  });

  const skills = (profileData.skills || [])
    .map((s) => s.name || s)
    .slice(0, 25);

  return {
    name: [profileData.firstName, profileData.lastName]
      .filter(Boolean)
      .join(' '),
    headline: profileData.headline || '',
    location: profileData.geo?.full || profileData.geo?.city || '',
    about: typeof profileData.summary === 'string' ? profileData.summary : '',
    experience,
    education,
    skills,
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
