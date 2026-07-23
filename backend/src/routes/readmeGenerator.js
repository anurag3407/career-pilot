import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { extractAIProvider } from '../middleware/aiKey.js';
import { fetchGitHubProfile } from '../services/githubImporter.js';

const router = express.Router();

// ---------------------------------------------------------------------------
// README Templates
// ---------------------------------------------------------------------------
const TEMPLATES = {
  minimal: {
    id: 'minimal',
    name: 'Minimal Clean',
    description: 'Clean, concise layout with essential info only.',
    promptDirective: `Use a MINIMAL style: short bio, a single "About Me" paragraph, a compact tech-stack list using inline badges (shields.io markdown), top 3 repos as a simple table, and a one-line "Currently working on" section. No emojis. No banners. Keep it under 40 lines.`,
  },
  developer: {
    id: 'developer',
    name: 'Developer Pro',
    description: 'Full-featured developer profile with stats and badges.',
    promptDirective: `Use a DEVELOPER PRO style: animated typing SVG header, "About Me" with bullet points (pronouns, current focus, fun fact), a "Tech Stack" section grouped by category (Frontend, Backend, Tools) using shields.io badges, GitHub stats card (github-readme-stats), top pinned repos as cards, "GitHub Trophies" section, and a visitor counter badge. Use tasteful emojis for section headers.`,
  },
  creative: {
    id: 'creative',
    name: 'Creative Portfolio',
    description: 'Bold, visual-first layout with banners and personality.',
    promptDirective: `Use a CREATIVE style: a large ASCII-art or emoji banner header, a witty tagline, "What I Do" section with icon-prefixed bullet points, a "Featured Projects" section with descriptions and links, a "Let's Connect" section with social badges (LinkedIn, Twitter, Email), a Spotify "now playing" widget placeholder, and a fun "Random Dev Quote" using a quote API badge. Be expressive and use emojis liberally.`,
  },
  academic: {
    id: 'academic',
    name: 'Academic / Research',
    description: 'Structured for researchers with publications and citations.',
    promptDirective: `Use an ACADEMIC style: formal name header with credentials, a "Research Interests" section, "Publications" placeholder list (with format: Title, Authors, Venue, Year, Link), "Teaching" section, "Skills & Tools" as a categorized list, "Education" timeline, and a "Contact" section with ORCID and Google Scholar placeholders. No emojis. Formal tone. Use markdown headers (##) for each section.`,
  },
  startup: {
    id: 'startup',
    name: 'Startup Founder',
    description: 'Impact-driven layout highlighting products and metrics.',
    promptDirective: `Use a STARTUP FOUNDER style: bold name + one-liner mission statement, "Building" section describing current product with a tagline, "Previously" section with past ventures as a timeline, "Metrics that matter" section (users served, revenue, growth), "Tech I Use" as a compact badge row, "Speaking & Writing" section with talk/article placeholders, and a "Let's Talk" CTA with Calendly and email links. Use power emojis sparingly (🚀, 📈).`,
  },
};

// ---------------------------------------------------------------------------
// GET /api/readme-generator/templates
// ---------------------------------------------------------------------------
router.get('/templates', (req, res) => {
  res.json({
    success: true,
    templates: Object.values(TEMPLATES).map(({ id, name, description }) => ({ id, name, description })),
  });
});

// ---------------------------------------------------------------------------
// POST /api/readme-generator/fetch-profile
// Fetches GitHub profile data for preview
// ---------------------------------------------------------------------------
router.post('/fetch-profile', verifyToken, async (req, res) => {
  try {
    const { username } = req.body;
    if (!username || typeof username !== 'string') {
      return res.status(400).json({ success: false, error: 'GitHub username is required' });
    }

    // Strip URL if user pastes full URL
    let cleanUsername = username.trim();
    const urlMatch = cleanUsername.match(/github\.com\/([a-zA-Z0-9_-]+)/);
    if (urlMatch) cleanUsername = urlMatch[1];
    cleanUsername = cleanUsername.replace(/^@/, '');

    const githubToken = req.headers['x-github-token'] || null;
    const profile = await fetchGitHubProfile(cleanUsername, githubToken);

    res.json({ success: true, profile });
  } catch (error) {
    console.error('README Generator - Fetch Profile Error:', error);
    if (error.message === 'GitHub user not found') {
      return res.status(404).json({ success: false, error: 'GitHub user not found. Check the username and try again.' });
    }
    res.status(500).json({ success: false, error: 'Failed to fetch GitHub profile' });
  }
});

// ---------------------------------------------------------------------------
// POST /api/readme-generator/generate
// Generates README.md using AI
// ---------------------------------------------------------------------------
router.post('/generate', verifyToken, extractAIProvider, async (req, res) => {
  try {
    const { username, templateId, customInstructions } = req.body;

    if (!username || typeof username !== 'string') {
      return res.status(400).json({ success: false, error: 'GitHub username is required' });
    }
    if (!templateId || !TEMPLATES[templateId]) {
      return res.status(400).json({ success: false, error: 'Valid templateId is required' });
    }

    // Strip URL if user pastes full URL
    let cleanUsername = username.trim();
    const urlMatch = cleanUsername.match(/github\.com\/([a-zA-Z0-9_-]+)/);
    if (urlMatch) cleanUsername = urlMatch[1];
    cleanUsername = cleanUsername.replace(/^@/, '');

    // Fetch GitHub profile
    const githubToken = req.headers['x-github-token'] || null;
    const profile = await fetchGitHubProfile(cleanUsername, githubToken);

    // Build AI prompt
    const template = TEMPLATES[templateId];
    const profileSummary = [
      `Name: ${profile.name}`,
      `Username: ${profile.username}`,
      `Bio: ${profile.bio || 'N/A'}`,
      `Company: ${profile.company || 'N/A'}`,
      `Location: ${profile.location || 'N/A'}`,
      `Blog: ${profile.blog || 'N/A'}`,
      `Public Repos: ${profile.public_repos}`,
      `Followers: ${profile.followers}`,
      `Total Stars: ${profile.totalStars}`,
      `Top Languages: ${profile.topLanguages.join(', ')}`,
      `Top Repositories:`,
      ...profile.topRepositories.map(r =>
        `  - ${r.name} (${r.language || 'N/A'}, ${r.stars}★): ${r.description || 'No description'}`
      ),
    ].join('\n');

    const prompt = `You are an expert GitHub profile README writer. Generate a complete, ready-to-use GitHub profile README.md for the following developer.

DEVELOPER PROFILE DATA:
${profileSummary}

TEMPLATE STYLE INSTRUCTIONS:
${template.promptDirective}

${customInstructions ? `ADDITIONAL USER INSTRUCTIONS:\n${customInstructions}\n` : ''}
RULES:
1. Output ONLY the raw markdown content for the README.md file. No explanations, no code fences wrapping the output.
2. Use real shields.io badge URLs where applicable (e.g., https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white).
3. Use the developer's actual data (repos, languages, stats) — do NOT invent fake data.
4. For GitHub stats cards, use: https://github-readme-stats.vercel.app/api?username=${cleanUsername}
5. For top langs card: https://github-readme-stats.vercel.app/api/top-langs/?username=${cleanUsername}
6. Make it visually appealing with proper spacing, alignment, and structure.
7. Keep it professional but personality-driven based on the template style.
8. Include a "How to use" HTML comment at the very top explaining: create a repo named "${cleanUsername}/${cleanUsername}", add this as README.md.

Generate the complete README.md now:`;

    const provider = req.aiProvider;
    const result = await provider.generateContent(prompt);

    // Clean the response (remove wrapping code fences if present)
    let readme = result.text || '';
    readme = readme.replace(/^```markdown\n?/i, '').replace(/\n?```$/i, '').trim();

    res.json({
      success: true,
      readme,
      profile: {
        username: profile.username,
        name: profile.name,
        avatar_url: profile.avatar_url,
      },
      template: { id: template.id, name: template.name },
    });
  } catch (error) {
    console.error('README Generator - Generate Error:', error);
    if (error.message === 'GitHub user not found') {
      return res.status(404).json({ success: false, error: 'GitHub user not found.' });
    }
    res.status(500).json({ success: false, error: error.message || 'Failed to generate README' });
  }
});

export default router;
