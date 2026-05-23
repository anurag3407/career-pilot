import { GoogleGenerativeAI } from '@google/generative-ai';

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey || !geminiApiKey.trim()) {
  throw new Error('GEMINI_API_KEY environment variable is required');
}
const genAI = new GoogleGenerativeAI(geminiApiKey);

/**
 * Build the review prompt for Gemini
 */
const buildReviewPrompt = (portfolioData) => `
You are an expert portfolio reviewer for software developers and tech professionals.
Review the following portfolio data and provide a detailed quality assessment.

Portfolio Data:
${JSON.stringify(portfolioData, null, 2)}

IMPORTANT RULES:
- Only review CONTENT quality — do NOT comment on visual design
- Be specific and actionable in suggestions
- Base scores on real portfolio best practices
- Do NOT fabricate missing information

Score each category from 0 to 100:
1. Content Quality — clarity, depth, and impact of written content
2. Completeness — presence of all important sections
3. SEO — keywords, meta descriptions, title optimization
4. Technical Accuracy — correctness of technical claims and descriptions
5. Visual Appeal — layout structure and content organization (NOT design/colors)

Also provide:
- Overall score (weighted average: Content 35%, Completeness 25%, SEO 15%, Technical 15%, Visual 10%)
- Specific actionable improvement suggestions (minimum 3, maximum 8)
- List of missing sections (from: hero, about, projects, skills, experience, education, contact, testimonials)
- Comparison with high-performing portfolios (what top portfolios have that this one lacks)

Respond ONLY with valid JSON in this exact format:
{
  "scores": {
    "contentQuality": 0,
    "completeness": 0,
    "seo": 0,
    "technicalAccuracy": 0,
    "visualAppeal": 0,
    "overall": 0
  },
  "grade": "A",
  "summary": "brief overall summary here",
  "improvements": [
    "specific actionable suggestion 1",
    "specific actionable suggestion 2"
  ],
  "missingSections": ["section1", "section2"],
  "comparedToTopPortfolios": [
    "what top portfolios have that this one lacks 1",
    "what top portfolios have that this one lacks 2"
  ]
}`;

/**
 * Calculate weighted overall score
 */
const calculateOverallScore = (scores) => {
  return Math.round(
    scores.contentQuality * 0.35 +
    scores.completeness * 0.25 +
    scores.seo * 0.15 +
    scores.technicalAccuracy * 0.15 +
    scores.visualAppeal * 0.10
  );
};

/**
 * Convert numeric score to letter grade
 */
const getGrade = (score) => {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
};

/**
 * Review a complete portfolio using Gemini AI
 * @param {object} portfolioData - Complete portfolio content
 * @returns {object} - Scores, grade, improvements, missing sections
 */
export const reviewPortfolio = async (portfolioData) => {
  if (!portfolioData || typeof portfolioData !== 'object') {
    throw new Error('portfolioData must be a non-null object');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const prompt = buildReviewPrompt(portfolioData);

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  const clean = responseText.replace(/```json|```/g, '').trim();

  let review;
  try {
    review = JSON.parse(clean);
  } catch (error) {
    const parseError = new Error('AI returned invalid JSON');
    parseError.statusCode = 502;
    parseError.cause = error;
    parseError.responseText = responseText;
    throw parseError;
  }

  // Recalculate overall score server-side to ensure accuracy
  const overallScore = calculateOverallScore(review.scores);
  review.scores.overall = overallScore;
  review.grade = getGrade(overallScore);

  return {
    portfolioId: portfolioData.id || null,
    reviewedAt: new Date().toISOString(),
    scores: review.scores,
    grade: review.grade,
    summary: review.summary || '',
    improvements: review.improvements || [],
    missingSections: review.missingSections || [],
    comparedToTopPortfolios: review.comparedToTopPortfolios || [],
  };
};