/**
 * Resume Job Matcher Service
 *
 * Provides AI-powered resume-to-job matching with:
 * - Match score calculation
 * - Skill gap analysis
 * - Strength identification
 * - Personalized recommendations
 *
 * Includes deterministic fallback matching when
 * AI providers are unavailable.
 */

import { getDefaultProvider } from "../config/aiProviders.js";

const resolveProvider = (aiProvider) => aiProvider || getDefaultProvider();

/**
 * Extracts normalized keywords from text while
 * filtering common stop words.
 *
 * @param {string} text
 * @returns {string[]}
 */

function extractKeywords(text = "") {
  const stopWords = new Set([
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "by",
    "for",
    "from",
    "has",
    "have",
    "in",
    "is",
    "it",
    "of",
    "on",
    "or",
    "that",
    "the",
    "to",
    "we",
    "with",
    "you",
    "your",
    "our",
    "looking",
    "hiring",
    "required",
    "requirements",
    "responsibilities",
    "candidate",
    "candidates",
    "experience",
    "years",
    "role",
    "position",
    "team",
  ]);

  const shortSkills = new Set(["go", "r", "c", "c#", "qa", "ui", "ux"]);

  const words = (text.toLowerCase().match(/[a-z0-9+#.]+/g) || []).map((word) =>
    word.replace(/\.+$/, ""),
  );

  return [
    ...new Set(
      words.filter(
        (word) =>
          (word.length > 2 || shortSkills.has(word)) && !stopWords.has(word),
      ),
    ),
  ];
}

/**
 * Performs deterministic resume-to-job matching when
 * AI providers are unavailable.
 *
 * Compares extracted keywords from the resume and
 * job description to identify matched skills,
 * missing skills, and an overall match score.
 *
 * @param {string} resumeText - Candidate resume text
 * @param {string} jobDescription - Target job description
 * @returns {{
 *   matchScore: number,
 *   matchedSkills: string[],
 *   missingSkills: string[],
 *   strengths: string[],
 *   recommendations: string[]
 * }}
 */

function deterministicResumeJobMatch(resumeText, jobDescription) {
  if (typeof resumeText !== "string" || typeof jobDescription !== "string") {
    return {
      matchScore: 0,
      matchedSkills: [],
      missingSkills: [],
      strengths: [],
      recommendations: [],
    };
  }

  const resumeKeywords = extractKeywords(resumeText);

  const jobKeywords = extractKeywords(jobDescription);

  const importantKeywords = jobKeywords.filter(
    (keyword) =>
      keyword.length > 2 &&
      ![
        "developer",
        "engineer",
        "scientist",
        "application",
        "company",
      ].includes(keyword),
  );

  if (importantKeywords.length === 0) {
    return {
      matchScore: 0,
      matchedSkills: [],
      missingSkills: [],
      strengths: [],
      recommendations: [],
    };
  }

  const matchedSkills = importantKeywords.filter((keyword) =>
    resumeKeywords.includes(keyword),
  );

  const missingSkills = importantKeywords.filter(
    (keyword) => !resumeKeywords.includes(keyword),
  );

  const matchScore = Math.round(
    (matchedSkills.length / Math.max(importantKeywords.length, 1)) * 100,
  );

  const strengths = matchedSkills
    .slice(0, 5)
    .map((skill) => `Resume demonstrates experience with "${skill}".`);

  const recommendations = missingSkills
    .slice(0, 5)
    .map(
      (skill) =>
        `Consider highlighting "${skill}" if it accurately reflects your experience.`,
    );

  return {
    matchScore,
    matchedSkills,
    missingSkills,
    strengths,
    recommendations,
  };
}

/**
 * Matches a resume against a job description using AI analysis
 * with deterministic fallback support.
 *
 * The AI provider generates:
 * - Match score
 * - Matched skills
 * - Missing skills
 * - Strengths
 * - Improvement recommendations
 *
 * If the AI provider fails, a deterministic keyword-based
 * matching algorithm is used instead.
 *
 * @param {string} resumeText - Candidate resume content
 * @param {string} jobDescription - Target job description
 * @param {Object} aiProvider - Optional AI provider instance
 * @returns {Promise<{
 *   matchScore: number,
 *   matchedSkills: string[],
 *   missingSkills: string[],
 *   strengths: string[],
 *   recommendations: string[]
 * }>}
 */

export const matchResumeToJob = async (
  resumeText,
  jobDescription,
  aiProvider,
) => {
  if (typeof resumeText !== "string" || !resumeText.trim()) {
    throw new Error("Resume text is required");
  }

  if (typeof jobDescription !== "string" || !jobDescription.trim()) {
    throw new Error("Job description is required");
  }

  try {
    const provider = resolveProvider(aiProvider);

    const prompt = `
You are an ATS expert recruiter and resume reviewer.

Compare the candidate resume against the job description.

Resume:
${resumeText}

Job Description:
${jobDescription}

Return ONLY valid JSON in this exact format:

{
  "matchScore": 0,
  "matchedSkills": [],
  "missingSkills": [],
  "strengths": [],
  "recommendations": []
}

Rules:
- matchScore must be between 0 and 100
- matchedSkills should contain relevant skills present in both resume and job description
- missingSkills should contain important skills missing from the resume
- strengths should contain positive observations about the candidate fit
- recommendations should contain actionable suggestions to improve alignment
- Return JSON only
`;

    const result = await provider.generateContent(prompt);

    const cleanedText = result.text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const start = cleanedText.indexOf("{");

    const end = cleanedText.lastIndexOf("}");

    if (start === -1 || end === -1 || end <= start) {
      throw new Error("Invalid JSON response");
    }

    const parsed = JSON.parse(cleanedText.slice(start, end + 1));

    return {
      matchScore: Math.min(100, Math.max(0, Number(parsed.matchScore) || 0)),
      matchedSkills: Array.isArray(parsed.matchedSkills)
        ? parsed.matchedSkills.filter((item) => typeof item === "string")
        : [],
      missingSkills: Array.isArray(parsed.missingSkills)
        ? parsed.missingSkills.filter((item) => typeof item === "string")
        : [],
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      recommendations: Array.isArray(parsed.recommendations)
        ? parsed.recommendations.filter((item) => typeof item === "string")
        : [],
    };
  } catch (error) {
    console.error("AI resume-job matching failed, using fallback:", error);

    return deterministicResumeJobMatch(resumeText, jobDescription);
  }
};

export { deterministicResumeJobMatch };
