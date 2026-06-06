import { getDefaultProvider } from '../config/aiProviders.js';
import { KEYWORD_DICTIONARY } from './atsScorer.js';

const resolveProvider = (aiProvider) =>
  aiProvider || getDefaultProvider();

function getKeywordsForRole(jobRole = '') {
  if (!jobRole) return [];

  const targetRole = jobRole.toLowerCase();

  if (KEYWORD_DICTIONARY[targetRole]) {
    return KEYWORD_DICTIONARY[targetRole];
  }

  for (const role in KEYWORD_DICTIONARY) {
    if (
      targetRole.includes(role) ||
      role.includes(targetRole)
    ) {
      return KEYWORD_DICTIONARY[role];
    }
  }

  return [];
}

function deterministicKeywordAnalysis(resumeText, jobRole = '') {
  const keywords = getKeywordsForRole(jobRole);

  if (
  keywords.length === 0 ||
  typeof resumeText !== 'string'
) {
    return {
      keywordCoverageScore: 0,
      foundKeywords: [],
      missingKeywords: [],
      recommendedKeywords: [],
      optimizationSuggestions: []
    };
  }

  const lowerText = resumeText.toLowerCase();

  const containsKeyword = (text, keyword) => {
    const escaped = keyword.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    );

    const pattern = new RegExp(
      `(^|[^A-Za-z0-9_])${escaped}($|[^A-Za-z0-9_])`,
      'i'
    );

    return pattern.test(text);
  };

  const foundKeywords = keywords.filter(keyword =>
    containsKeyword(lowerText, keyword)
  );

  const missingKeywords = keywords.filter(keyword =>
    !containsKeyword(lowerText, keyword)
  );

  return {
    keywordCoverageScore: Math.round(
      (foundKeywords.length / keywords.length) * 100
    ),
    foundKeywords,
    missingKeywords,
    recommendedKeywords: missingKeywords.slice(0, 5),
    optimizationSuggestions: missingKeywords
      .slice(0, 5)
      .map(
        keyword =>
          `Consider adding "${keyword}" if it accurately reflects your skills and experience.`
      )
  };
}

export const optimizeKeywords = async (
  resumeText,
  targetRole,
  aiProvider
) => {
  if (
    typeof resumeText !== 'string' ||
    !resumeText.trim()
  ) {
    throw new Error('Resume text is required');
  }

  try {
    const provider = resolveProvider(aiProvider);

    const prompt = `
You are an ATS optimization expert and resume reviewer.

Analyze the following resume for a "${targetRole}" role.

Resume:
${resumeText}

Return ONLY valid JSON in this exact format:

{
  "keywordCoverageScore": 0,
  "foundKeywords": [],
  "missingKeywords": [],
  "recommendedKeywords": [],
  "optimizationSuggestions": []
}

Rules:
- keywordCoverageScore must be between 0 and 100
- foundKeywords should contain relevant keywords already present
- missingKeywords should contain important missing ATS keywords
- recommendedKeywords should contain high-value role-specific keywords
- optimizationSuggestions should contain actionable ATS optimization advice
- Return JSON only
`;

    const result = await provider.generateContent(prompt);

    const cleanedText = result.text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const start = cleanedText.indexOf('{');
    const end = cleanedText.lastIndexOf('}');

    if (start === -1 || end === -1 || end <= start) {
      throw new Error('Invalid JSON response');
    }

    const parsed = JSON.parse(
      cleanedText.slice(start, end + 1)
    );

    return {
      keywordCoverageScore: Math.min(
        100,
        Math.max(
          0,
          Number(parsed.keywordCoverageScore) || 0
        )
      ),
      foundKeywords: Array.isArray(parsed.foundKeywords)
        ? parsed.foundKeywords
        : [],
      missingKeywords: Array.isArray(parsed.missingKeywords)
        ? parsed.missingKeywords
        : [],
      recommendedKeywords: Array.isArray(
        parsed.recommendedKeywords
      )
        ? parsed.recommendedKeywords
        : [],
      optimizationSuggestions: Array.isArray(
        parsed.optimizationSuggestions
      )
        ? parsed.optimizationSuggestions
        : []
    };
  } catch (error) {
    console.error(
      'AI keyword optimization failed, using fallback:',
      error
    );

    return deterministicKeywordAnalysis(
      resumeText,
      targetRole
    );
  }
};

export { deterministicKeywordAnalysis };