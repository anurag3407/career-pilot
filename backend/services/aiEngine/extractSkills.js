// backend/services/aiEngine/extractSkills.js
// Uses Google Gemini via REST API to extract skills, inferred role, and experience years from raw resume text.

const fetch = require('node-fetch');

// Example static list of high‑impact skills for missing‑skill detection (could be expanded).
const HIGH_IMPACT_SKILLS = [
  'JavaScript', 'React', 'Node.js', 'Python', 'Machine Learning', 'SQL',
  'AWS', 'Docker', 'Kubernetes', 'Git', 'REST APIs', 'CI/CD', 'Agile',
];

/**
 * Calls Gemini with a crafted prompt to extract relevant information.
 * @param {string} rawText - Raw extracted resume text.
 * @returns {Promise<Object>} { skills: string[], role: string, experienceYears: number }
 */
async function extractSkills(rawText) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not set in environment');
  }

  const prompt = `You are an AI assistant specialized in resume analysis.
Extract a concise list of technical skills (as an array of strings), the primary job role the candidate is targeting, and the total years of professional experience mentioned in the following resume text. Also, identify any missing high‑impact skills from the predefined list.
Resume Text:\n"""
${rawText}
"""
Respond only with JSON in the format:
{ "skills": [...], "role": "...", "experienceYears": <number> }`;

  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }] }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${err}`);
  }

  const result = await response.json();
  // Gemini returns a complex structure; we attempt to parse the first text part.
  const text = result.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) {
    throw new Error('Gemini response missing expected text content');
  }
  // The model should return JSON; safely parse.
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    // If parsing fails, attempt to extract JSON via regex.
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Failed to parse Gemini JSON response');
    }
  }
  return parsed;
}

/**
 * Detect missing high‑impact skills based on extracted skill list.
 * @param {string[]} extractedSkills
 * @returns {string[]} missing skills from HIGH_IMPACT_SKILLS
 */
function missingSkills(extractedSkills) {
  const lower = extractedSkills.map(s => s.toLowerCase());
  return HIGH_IMPACT_SKILLS.filter(skill => !lower.includes(skill.toLowerCase()));
}

module.exports = { extractSkills, missingSkills };
