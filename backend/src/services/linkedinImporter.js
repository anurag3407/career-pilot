// LinkedIn profile import via Proxycurl API (https://proxycurl.com)
// Free tier: 10 credits. Paid: ~$0.01/profile. No scraping, no bot detection.
// Set PROXYCURL_API_KEY in .env to enable.

import { jobsScrapedCounter } from '../middleware/metrics.js';

const PROXYCURL_ENDPOINT = 'https://nubela.co/proxycurl/api/v2/linkedin';

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
      description: 'Led migration of monolith to microservices, reducing latency by 40%.',
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
  skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'],
  _mock: true,
  _mockNote: `DEV MODE — set PROXYCURL_API_KEY to fetch the real profile for: ${url}`,
});

export const scrapeLinkedInProfile = async (url) => {
  const apiKey = process.env.PROXYCURL_API_KEY;

  if (!apiKey) {
    const env = process.env.NODE_ENV;
    if (env === 'development' || env === 'test') {
      console.warn(
        '⚠️  PROXYCURL_API_KEY is not set — returning mock LinkedIn profile (development/test only).'
      );
      return getMockProfile(url);
    }
    throw new Error(
      'LinkedIn import requires a Proxycurl API key. Set PROXYCURL_API_KEY in your .env file. ' +
      'Get a free key (10 credits) at https://proxycurl.com.'
    );
  }

  const requestUrl = `${PROXYCURL_ENDPOINT}?url=${encodeURIComponent(url)}&fallback_to_cache=on-error&use_cache=if-present`;

  const response = await fetch(requestUrl, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (response.status === 401) {
    throw new Error('Invalid Proxycurl API key. Check your PROXYCURL_API_KEY in .env.');
  }
  if (response.status === 403) {
    throw new Error('Proxycurl API credits exhausted. Add credits at proxycurl.com.');
  }
  if (response.status === 404) {
    throw new Error('LinkedIn profile not found. Make sure the URL is correct and the profile is public.');
  }
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Proxycurl API error (${response.status}): ${body || response.statusText}`);
  }

  const data = await response.json();

  jobsScrapedCounter.inc({
    source: "linkedin",
  });

  // Map Proxycurl response to our internal profile shape
  const experience = (data.experiences || []).map((exp) => ({
    title: exp.title || '',
    company: exp.company || '',
    duration: [exp.starts_at?.year, exp.ends_at?.year || 'Present']
      .filter(Boolean)
      .join(' – '),
    description: exp.description || '',
  }));

  const education = (data.education || []).map((edu) => ({
    school: edu.school || '',
    degree: [edu.degree_name, edu.field_of_study].filter(Boolean).join(', '),
    duration: [edu.starts_at?.year, edu.ends_at?.year].filter(Boolean).join(' – '),
  }));

  const skills = (data.skills || []).slice(0, 25);

  return {
    name: [data.first_name, data.last_name].filter(Boolean).join(' '),
    headline: data.headline || '',
    location: data.city || data.country_full_name || '',
    about: data.summary || '',
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
      const header = [exp.title, exp.company, exp.duration].filter(Boolean).join(' | ');
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
      const header = [edu.degree, edu.school, edu.duration].filter(Boolean).join(' | ');
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
