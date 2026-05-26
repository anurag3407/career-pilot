import { aiCallsCounter } from '../../middleware/metrics.js';

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
export const predictTrajectory = async (resumeData, aiProvider) => {
  if (!aiProvider) {
    throw new Error('AI Provider is required. Please provide an API key.');
  }

  const profile = {
    currentRole: resumeData.currentRole,
    skills: resumeData.skills,
    yearsOfExperience: resumeData.yearsOfExperience,
    industry: resumeData.industry,
  };

  const prompt = buildPrompt(profile);

  const result = await aiProvider.generateContent(prompt);

  // Guard against nullish adapter response before dereferencing
  if (!result) {
    throw new Error('AI provider returned a null or undefined response.');
  }

  // Normalise across provider adapters — some return .text directly, some wrap it
  const responseText = typeof result.text === 'function'
    ? result.text()
    : result.text ?? result?.response?.text?.() ?? '';

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

  // Hard-cap parsed output to enforce API contract regardless of model compliance.
  // This prevents oversized payloads and keeps token/cost bounds stable.
  const rawPaths = Array.isArray(parsed.typicalPaths)
    ? parsed.typicalPaths
    : Array.isArray(parsed.paths)
    ? parsed.paths
    : [];

  const trajectories = rawPaths.slice(0, 3).map((path) => ({
    pathName: path.pathName || '',
    roles: Array.isArray(path.roles)
      ? path.roles.slice(0, 4).map((role) => ({
          title: role.title || '',
          level: role.level || '',
          timeToReach: role.timeToReach || '',
          skills: Array.isArray(role.skills) ? role.skills.slice(0, 3) : [],
          estimatedSalary: role.estimatedSalary || '',
        }))
      : [],
  }));

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
