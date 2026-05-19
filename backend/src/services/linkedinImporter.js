// LinkedIn profile import via Proxycurl API (https://proxycurl.com)
// Free tier: 10 credits. Paid: ~$0.01/profile. No scraping, no bot detection.
// Set PROXYCURL_API_KEY in .env to enable.

const PROXYCURL_ENDPOINT = 'https://nubela.co/proxycurl/api/v2/linkedin';

export const scrapeLinkedInProfile = async (url) => {
  const apiKey = process.env.PROXYCURL_API_KEY;

  if (!apiKey) {
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
