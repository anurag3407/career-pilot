import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { aiCallsCounter } from '../../middleware/metrics.js';

dotenv.config();

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  console.warn('GEMINI_API_KEY is missing. Career trajectory service will only work with a user-supplied AI provider.');
}

// Lazily initialised — avoids crashing on startup if key is absent
let defaultModel;
if (geminiApiKey) {
  const genAI = new GoogleGenerativeAI(geminiApiKey);
  // gemini-2.0-flash: fastest & cheapest Gemini variant — minimises token cost
  defaultModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
}

/**
 * Build a compact, token-efficient prompt.
 * Raw resumeText is intentionally excluded — structured fields only.
 * Output is capped at 3 paths × 4 roles × 3 skills to limit response tokens.
 *
 * @param {object} profile - Extracted structured fields from resumeData
 */
const buildPrompt = ({ currentRole, skills, yearsOfExperience, industry }) => {
  // Trim skills list to avoid ballooning the input token count
  const topSkills = (skills || []).slice(0, 10).join(', ') || 'not specified';
  const exp = yearsOfExperience ?? 'unknown';
  const ind = industry || 'Technology';

  return `You are a career advisor AI. Given the profile below, return ONLY a valid JSON object — no markdown, no extra text.

Profile:
- Role: ${currentRole || 'Software Engineer'}
- Skills: ${topSkills}
- Experience: ${exp} years
- Industry: ${ind}

Return exactly this JSON structure (3 paths, max 4 roles each, max 3 skills each):
{
  "typicalPaths": [
    {
      "pathName": "short label e.g. Senior Engineer → Engineering Manager",
      "roles": [
        {
          "title": "job title",
          "level": "Junior|Mid|Senior|Lead|Director",
          "timeToReach": "e.g. 1-2 yrs",
          "skills": ["skill1", "skill2", "skill3"],
          "estimatedSalary": "e.g. $80k-$110k"
        }
      ]
    }
  ]
}

Rules:
- Exactly 3 paths. Each path max 4 roles. Each role max 3 skills.
- Use hedging language in pathName: "typical", "estimated" where suitable.
- Salaries as short strings like "$90k-$120k". Vary by industry.
- No descriptions, no extra fields, no markdown fences.`;
};

/**
 * Predict 3 typical career trajectories from structured resume data.
 *
 * Token optimisations applied:
 *  - Raw resumeText is never sent to the AI
 *  - Skills list is capped at 10 inputs
 *  - Output is constrained to 3 paths × 4 roles × 3 skills
 *  - Salary returned as a compact string (not an object)
 *  - No prose description fields
 *  - Uses gemini-2.0-flash (cheapest Gemini model)
 *
 * @param {object} resumeData
 * @param {string}   resumeData.currentRole
 * @param {string[]} resumeData.skills
 * @param {number}   resumeData.yearsOfExperience
 * @param {string}   [resumeData.industry]
 * @param {object}   [aiProvider] - Provider instance from extractAIProvider middleware
 * @returns {Promise<object>} Parsed trajectory result
 */
export const predictTrajectory = async (resumeData, aiProvider = null) => {
  const profile = {
    currentRole: resumeData.currentRole,
    skills: resumeData.skills,
    yearsOfExperience: resumeData.yearsOfExperience,
    industry: resumeData.industry,
  };

  const prompt = buildPrompt(profile);

  let responseText;

  // --- Use injected aiProvider (user's key / DB config) if available ---
  if (aiProvider && typeof aiProvider.generateContent === 'function') {
    const providerName = aiProvider.providerName || 'custom';
    aiCallsCounter.inc({ provider: providerName });

    const result = await aiProvider.generateContent(prompt);
    // Normalise across provider adapters — some return .text directly, some wrap it
    responseText = typeof result.text === 'function'
      ? result.text()
      : result.text ?? result?.response?.text?.() ?? '';
  } else {
    // --- Fall back to server Gemini key ---
    if (!defaultModel) {
      throw new Error('No AI provider available. Please configure GEMINI_API_KEY or supply a provider.');
    }

    aiCallsCounter.inc({ provider: 'gemini' });
    const result = await defaultModel.generateContent(prompt);
    responseText = result.response.text();
  }

  // Strip markdown code fences if the model adds them despite instructions
  const cleaned = responseText
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (parseError) {
    const err = new Error('AI returned invalid JSON for career trajectory');
    err.statusCode = 502;
    err.cause = parseError;
    err.rawResponse = responseText;
    throw err;
  }

  const trajectories = parsed.typicalPaths || parsed.paths || [];

  return {
    trajectories,
    analyzedProfile: {
      currentRole: profile.currentRole || 'Not specified',
      yearsOfExperience: profile.yearsOfExperience ?? 'Not specified',
      skillCount: (profile.skills || []).length,
      industry: profile.industry || 'Technology',
    },
    disclaimer:
      'These are estimated typical career paths based on industry trends and are not guarantees. ' +
      'Actual timelines and salaries may vary based on location, company, and individual performance.',
    generatedAt: new Date().toISOString(),
  };
};
