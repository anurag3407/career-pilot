/**
 * Career Path Suggester Service
 *
 * Provides AI-powered career path recommendations with:
 * - Career path suggestions
 * - Match score estimation
 * - Skill gap analysis
 * - Learning roadmap generation
 *
 * Includes deterministic fallback recommendations when
 * AI providers are unavailable.
 */

import { getDefaultProvider } from "../config/aiProviders.js";

const resolveProvider = (aiProvider) => aiProvider || getDefaultProvider();

const CAREER_PATHS = {
  "frontend developer": [
    "Full Stack Developer",
    "Frontend Architect",
    "AI Engineer",
  ],

  "backend developer": [
    "Software Architect",
    "Cloud Engineer",
    "DevOps Engineer",
  ],

  "data analyst": ["Data Scientist", "ML Engineer", "Analytics Manager"],

  "data scientist": ["Senior Data Scientist", "ML Engineer", "AI Engineer"],

  "machine learning engineer": [
    "Senior ML Engineer",
    "AI Architect",
    "Applied AI Scientist",
  ],
};

/**
 * Deterministic fallback career path recommendation.
 *
 * @param {string} currentRole
 * @param {number} experienceYears
 * @param {string[]} skills
 * @param {string[]} interests
 * @returns {{
 *   currentProfileSummary: string,
 *   careerPaths: Array<{
 *     title: string,
 *     matchScore: number,
 *     reasoning: string,
 *     requiredSkills: string[],
 *     learningRoadmap: string[]
 *   }>,
 *   recommendedNextSteps: string[]
 * }}
 */
function deterministicCareerPathSuggestion(
  currentRole,
  experienceYears,
  skills = [],
  interests = [],
) {
  const roleKey = currentRole.trim().toLowerCase();

  const normalizedSkills = Array.isArray(skills) ? skills : [];

  const normalizedInterests = Array.isArray(interests) ? interests : [];

  let suggestedPaths = CAREER_PATHS[roleKey] || [
    "Senior Specialist",
    "Technical Lead",
    "Engineering Manager",
  ];

  const lowerInterests = normalizedInterests.map((interest) =>
    interest.toLowerCase(),
  );

  if (
    lowerInterests.some(
      (interest) =>
        interest.includes("ai") || interest.includes("machine learning"),
    )
  ) {
    if (!suggestedPaths.includes("AI Engineer")) {
      suggestedPaths = ["AI Engineer", ...suggestedPaths];
    }
  }

  return {
    currentProfileSummary: `${currentRole} with ${experienceYears} years of experience and expertise in ${normalizedSkills.slice(0, 5).join(", ") || "multiple domains"}.`,

    careerPaths: suggestedPaths.map((path, index) => ({
      title: path,
      matchScore: Math.max(60, 85 - index * 10),

      reasoning: `${path} is a logical next step based on your current experience, skill set, and professional growth trajectory.`,

      requiredSkills: ["Leadership", "System Design", "Problem Solving"],

      learningRoadmap: [
        "Build advanced real-world projects",
        "Strengthen domain expertise",
        "Develop leadership and communication skills",
      ],
    })),

    recommendedNextSteps: [
      "Expand technical depth in your current specialization.",
      "Build portfolio-worthy projects demonstrating impact.",
      "Pursue industry certifications and continuous learning.",
      "Contribute to open-source projects.",
      "Strengthen leadership and collaboration skills.",
    ],
  };
}

/**
 * Generates career path recommendations using AI
 * with deterministic fallback support.
 *
 * @param {string} currentRole
 * @param {number} experienceYears
 * @param {string[]} skills
 * @param {string[]} interests
 * @param {Object} aiProvider
 *
 * @returns {Promise<{
 *   currentProfileSummary: string,
 *   careerPaths: Array<{
 *     title: string,
 *     matchScore: number,
 *     reasoning: string,
 *     requiredSkills: string[],
 *     learningRoadmap: string[]
 *   }>,
 *   recommendedNextSteps: string[]
 * }>}
 */
export const suggestCareerPaths = async (
  currentRole,
  experienceYears,
  skills = [],
  interests = [],
  aiProvider,
) => {
  if (typeof currentRole !== "string" || !currentRole.trim()) {
    throw new Error("Current role is required");
  }

  try {
    const provider = resolveProvider(aiProvider);

    const prompt = `
You are an expert career coach and talent advisor.

Current Role:
${currentRole}

Years of Experience:
${experienceYears}

Skills:
${skills.join(", ")}

Interests:
${interests.join(", ")}

Return ONLY valid JSON in this exact format:

{
  "currentProfileSummary": "",
  "careerPaths": [
    {
      "title": "",
      "matchScore": 0,
      "reasoning": "",
      "requiredSkills": [],
      "learningRoadmap": []
    }
  ],
  "recommendedNextSteps": []
}

Rules:
- Suggest exactly 3 career paths
- matchScore must be between 0 and 100
- requiredSkills must contain relevant skills
- learningRoadmap must contain actionable learning steps
- recommendedNextSteps must contain career growth advice
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
      currentProfileSummary:
        typeof parsed.currentProfileSummary === "string"
          ? parsed.currentProfileSummary
          : "",

      careerPaths: Array.isArray(parsed.careerPaths)
        ? parsed.careerPaths.map((path) => ({
            title: typeof path?.title === "string" ? path.title : "",

            matchScore: Math.min(
              100,
              Math.max(0, Number(path?.matchScore) || 0),
            ),

            reasoning:
              typeof path?.reasoning === "string" ? path.reasoning : "",

            requiredSkills: Array.isArray(path?.requiredSkills)
              ? path.requiredSkills.filter((item) => typeof item === "string")
              : [],

            learningRoadmap: Array.isArray(path?.learningRoadmap)
              ? path.learningRoadmap.filter((item) => typeof item === "string")
              : [],
          }))
        : [],

      recommendedNextSteps: Array.isArray(parsed.recommendedNextSteps)
        ? parsed.recommendedNextSteps.filter((item) => typeof item === "string")
        : [],
    };
  } catch (error) {
    console.error("AI career path suggestion failed, using fallback:", error);

    return deterministicCareerPathSuggestion(
      currentRole,
      experienceYears,
      skills,
      interests,
    );
  }
};

export { deterministicCareerPathSuggestion };
