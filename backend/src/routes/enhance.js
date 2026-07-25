import express from "express";
import {
  enhanceResume,
  generateSummary,
  suggestImprovements,
  analyzeATSScore,
  analyzeResumeComprehensive,
  analyzeBulletPoints,
  generateBeforeAfter,
  getVerbLists,
  getSystemPrompt,
  analyzeSkillGap,
  translateResume,
  tailorResume,
} from "../config/langchain.js";
import { computeATSScore } from "../services/atsScorer.js";
import { generateEmails } from "../services/emailGeneratorService.js";
import { predictTrajectory } from "../services/ai/careerTrajectory.js";
import { optimizeLinkedInProfile } from "../services/linkedinOptimizerService.js";
import { verifyToken } from "../middleware/auth.js";
import { extractAIProvider } from "../middleware/aiKey.js";
import { asyncHandler, ApiError } from "../middleware/errorHandler.js";
import { aiRateLimiter } from "../middleware/rateLimiter.js";
import { createSSEStream } from "../middleware/stream.js";
import { validate } from "../middleware/validate.js";
import { genAI } from "../config/genAI.js";
import {
  enhanceResumeSchema,
  resumeTextJobRoleSchema,
  beforeAfterSchema,
  generateEmailSchema,
  optimizeLinkedInSchema,
  resumeScoreSchema,
  skillGapSchema,
  translateResumeSchema,
  tailorResumeSchema,
} from "../schemas/enhance.schema.js";

const router = express.Router();

const MAX_RESUME_TEXT_LENGTH = 50_000;

function assertResumeTextWithinLimit(resumeText) {
  if (
    typeof resumeText === "string" &&
    resumeText.length > MAX_RESUME_TEXT_LENGTH
  ) {
    throw new ApiError(
      413,
      "Payload Too Large: Resume text exceeds maximum allowed length.",
    );
  }
}

// Score a resume and return structured feedback
// POST /api/enhance/resume-score
router.post(
  "/resume-score",
  verifyToken,
  extractAIProvider,
  aiRateLimiter,
  validate(resumeScoreSchema),
  asyncHandler(async (req, res) => {
    const { resumeText, jobRole } = req.body;
    assertResumeTextWithinLimit(resumeText);
    const targetRole = jobRole || "Software Engineer"; // Fallback if not provided

    try {
      // 1. Get deterministic scores
      const deterministicScoring = computeATSScore(resumeText, targetRole);

      // 2. Get qualitative feedback via AI
      const prompt = `Analyze this resume for a ${targetRole} position and return a JSON object with EXACTLY these fields:
- sections: object with keys "summary", "skills", "experience", "education", "projects" — each containing:
    - feedback (string, one concise sentence of constructive feedback)
- topSuggestions: array of exactly 3 strings, each a specific actionable improvement tip

Resume:
${resumeText}

Return ONLY valid JSON. No markdown fences, no extra text.`;

      const provider = req.aiProvider;
      const result = await provider.generateContent(prompt);
      let text = result.text.trim();

      // Strip markdown fences
      if (text.startsWith("```")) {
        text = text
          .replace(/^```(?:json)?\n?/, "")
          .replace(/\n?```$/, "")
          .trim();
      }

      // Attempt extra extraction
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) text = jsonMatch[0];

      let qualitativeData;
      try {
        qualitativeData = JSON.parse(text);
      } catch (parseErr) {
        console.error(
          "Resume score JSON parse error:",
          parseErr,
          "Raw text:",
          text,
        );
        throw new ApiError(
          502,
          "AI service returned an invalid response. Please try again in a moment.",
        );
      }

      // 3. Map into the format expected by the frontend
      const scoreData = {
        overallScore: deterministicScoring.overallScore,
        sections: {
          summary: {
            score: deterministicScoring.breakdown.formatting,
            feedback:
              qualitativeData.sections?.summary?.feedback || "Good formatting.",
          },
          skills: {
            score: deterministicScoring.breakdown.skills,
            feedback:
              qualitativeData.sections?.skills?.feedback ||
              "Include more role-specific skills.",
          },
          experience: {
            score: deterministicScoring.breakdown.experience,
            feedback:
              qualitativeData.sections?.experience?.feedback || "Add metrics.",
          },
          education: {
            score: 80, // Default good score for education
            feedback: qualitativeData.sections?.education?.feedback || "Good.",
          },
          projects: {
            score: deterministicScoring.breakdown.keywordMatch,
            feedback: qualitativeData.sections?.projects?.feedback || "Good.",
          },
        },
        topSuggestions: qualitativeData.topSuggestions || [
          "Add more quantifiable metrics to your experience.",
          "Tailor keywords to the specific job role.",
          "Ensure formatting is clean and easy to read.",
        ],
      };

      res.json({
        success: true,
        data: scoreData,
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      console.error("Resume scoring error:", error);
      throw new ApiError(500, "Failed to score resume. Please try again.");
    }
  }),
);

// Enhance resume with AI
router.post(
  "/",
  verifyToken,
  extractAIProvider,
  aiRateLimiter,
  validate(enhanceResumeSchema),
  asyncHandler(async (req, res) => {
    const { resumeText, preferences } = req.body;

    if (!resumeText || !resumeText.trim()) {
      throw new ApiError(400, "Resume text is required");
    }
    assertResumeTextWithinLimit(resumeText);

    if (!preferences || !preferences.jobRole) {
      throw new ApiError(400, "Job role preference is required");
    }

    // Validate preferences
    const validatedPreferences = {
      jobRole: preferences.jobRole,
      yearsOfExperience: preferences.yearsOfExperience || 0,
      skills: Array.isArray(preferences.skills) ? preferences.skills : [],
      industry: preferences.industry || "",
      customInstructions: preferences.customInstructions || "",
    };

    try {
      const result = await enhanceResume(
        resumeText,
        validatedPreferences,
        req.aiProvider,
      );

      res.json({
        success: true,
        data: {
          enhancedResume: result.enhancedResume,
          tokensUsed: result.tokensUsed,
          provider: result.provider,
          providerSource: req.aiProviderSource,
          processedAt: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Resume enhancement error:", error);
      throw new ApiError(500, "Failed to enhance resume. Please try again.");
    }
  }),
);

// Generate summary only
router.post(
  "/summary",
  verifyToken,
  extractAIProvider,
  aiRateLimiter,
  validate(resumeTextJobRoleSchema),
  asyncHandler(async (req, res) => {
    const { resumeText, jobRole } = req.body;

    if (!resumeText || !resumeText.trim()) {
      throw new ApiError(400, "Resume text is required");
    }
    assertResumeTextWithinLimit(resumeText);

    if (!jobRole) {
      throw new ApiError(400, "Job role is required");
    }

    try {
      const result = await generateSummary(resumeText, jobRole, req.aiProvider);

      res.json({
        success: true,
        data: {
          summary: result.summary,
          provider: result.provider,
          providerSource: req.aiProviderSource,
        },
      });
    } catch (error) {
      console.error("Summary generation error:", error);
      throw new ApiError(500, "Failed to generate summary. Please try again.");
    }
  }),
);

// Get improvement suggestions
router.post(
  "/suggestions",
  verifyToken,
  extractAIProvider,
  aiRateLimiter,
  validate(resumeTextJobRoleSchema),
  asyncHandler(async (req, res) => {
    const { resumeText, jobRole } = req.body;

    if (!resumeText || !resumeText.trim()) {
      throw new ApiError(400, "Resume text is required");
    }
    assertResumeTextWithinLimit(resumeText);

    if (!jobRole) {
      throw new ApiError(400, "Job role is required");
    }

    try {
      const result = await suggestImprovements(
        resumeText,
        jobRole,
        req.aiProvider,
      );

      res.json({
        success: true,
        data: {
          suggestions: result.suggestions,
          provider: result.provider,
          providerSource: req.aiProviderSource,
        },
      });
    } catch (error) {
      console.error("Suggestions generation error:", error);
      throw new ApiError(
        500,
        "Failed to generate suggestions. Please try again.",
      );
    }
  }),
);

// Analyze ATS score
router.post(
  "/ats-analysis",
  verifyToken,
  extractAIProvider,
  aiRateLimiter,
  validate(resumeTextJobRoleSchema),
  asyncHandler(async (req, res) => {
    const { resumeText, jobRole } = req.body;

    if (!resumeText || !resumeText.trim()) {
      throw new ApiError(400, "Resume text is required");
    }
    assertResumeTextWithinLimit(resumeText);

    if (!jobRole) {
      throw new ApiError(400, "Job role is required");
    }

    try {
      const result = await analyzeATSScore(resumeText, jobRole, req.aiProvider);

      res.json({
        success: true,
        data: result.analysis,
        provider: result.provider,
        providerSource: req.aiProviderSource,
      });
    } catch (error) {
      console.error("ATS analysis error:", error);
      throw new ApiError(500, "Failed to analyze ATS score. Please try again.");
    }
  }),
);

// Comprehensive resume analysis (Senior Expert Level)
router.post(
  "/comprehensive-analysis",
  verifyToken,
  extractAIProvider,
  aiRateLimiter,
  validate(resumeTextJobRoleSchema),
  asyncHandler(async (req, res) => {
    const { resumeText, jobRole } = req.body;

    if (!resumeText || !resumeText.trim()) {
      throw new ApiError(400, "Resume text is required");
    }
    assertResumeTextWithinLimit(resumeText);

    if (!jobRole) {
      throw new ApiError(400, "Job role is required");
    }

    try {
      const result = await analyzeResumeComprehensive(
        resumeText,
        jobRole,
        req.aiProvider,
      );

      res.json({
        success: true,
        data: result.analysis,
        provider: result.provider,
        providerSource: req.aiProviderSource,
      });
    } catch (error) {
      console.error("Comprehensive analysis error:", error);
      throw new ApiError(
        500,
        "Failed to perform comprehensive analysis. Please try again.",
      );
    }
  }),
);

// Analyze individual bullet points
router.post(
  "/analyze-bullets",
  verifyToken,
  extractAIProvider,
  aiRateLimiter,
  validate(resumeTextJobRoleSchema),
  asyncHandler(async (req, res) => {
    const { resumeText, jobRole } = req.body;

    if (!resumeText || !resumeText.trim()) {
      throw new ApiError(400, "Resume text is required");
    }
    assertResumeTextWithinLimit(resumeText);

    if (!jobRole) {
      throw new ApiError(400, "Job role is required");
    }

    try {
      const result = await analyzeBulletPoints(
        resumeText,
        jobRole,
        req.aiProvider,
      );

      res.json({
        success: true,
        data: result.analysis,
        provider: result.provider,
        providerSource: req.aiProviderSource,
      });
    } catch (error) {
      console.error("Bullet analysis error:", error);
      throw new ApiError(
        500,
        "Failed to analyze bullet points. Please try again.",
      );
    }
  }),
);

// Generate before/after comparison
router.post(
  "/before-after",
  verifyToken,
  extractAIProvider,
  aiRateLimiter,
  validate(beforeAfterSchema),
  asyncHandler(async (req, res) => {
    const { resumeText, jobRole, analysisResults } = req.body;

    if (!resumeText || !resumeText.trim()) {
      throw new ApiError(400, "Resume text is required");
    }
    assertResumeTextWithinLimit(resumeText);

    if (!jobRole) {
      throw new ApiError(400, "Job role is required");
    }

    try {
      const result = await generateBeforeAfter(
        resumeText,
        jobRole,
        analysisResults || {},
        req.aiProvider,
      );

      res.json({
        success: true,
        data: result.comparison,
        provider: result.provider,
        providerSource: req.aiProviderSource,
      });
    } catch (error) {
      console.error("Before/after generation error:", error);
      throw new ApiError(
        500,
        "Failed to generate comparison. Please try again.",
      );
    }
  }),
);

// Get power/weak verb lists
router.get(
  "/verb-lists",
  verifyToken,
  asyncHandler(async (req, res) => {
    const verbs = getVerbLists();

    res.json({
      success: true,
      data: verbs,
    });
  }),
);

// Generate Email Variants
router.post(
  "/generate-email",
  verifyToken,
  extractAIProvider,
  aiRateLimiter,
  validate(generateEmailSchema),
  asyncHandler(async (req, res) => {
    const { resume, jobDesc, tone } = req.body;

    if (!resume || !jobDesc) {
      throw new ApiError(400, "Resume and Job Description are required");
    }
    assertResumeTextWithinLimit(resume);

    try {
      const result = await generateEmails(
        resume,
        jobDesc,
        tone || "Professional",
        req.aiProvider,
      );
      res.json({
        success: true,
        subjectLines: result.subjectLines,
        variants: result.variants,
        provider: req.aiProvider.providerName,
        providerSource: req.aiProviderSource,
      });
    } catch (error) {
      console.error("Email generation error:", error);
      throw new ApiError(500, "Failed to generate emails. Please try again.");
    }
  }),
);

// Optimize LinkedIn Profile
router.post(
  "/optimize-linkedin",
  verifyToken,
  extractAIProvider,
  aiRateLimiter,
  validate(optimizeLinkedInSchema),
  asyncHandler(async (req, res) => {
    const { profileText, targetRole } = req.body;
    const normalizedProfile =
      typeof profileText === "string" ? profileText.trim() : "";
    const normalizedRole =
      typeof targetRole === "string" ? targetRole.trim() : "";

    if (!normalizedProfile) {
      throw new ApiError(400, "LinkedIn profile text is required");
    }

    if (normalizedProfile.length > 5000) {
      throw new ApiError(
        400,
        "Profile text exceeds the allowed limit (max 5000 characters)",
      );
    }

    const result = await optimizeLinkedInProfile(
      normalizedProfile,
      normalizedRole,
      req.aiProvider,
    );
    res.json(result);
  }),
);

// Analyze skill gap between resume and job description
router.post(
  "/skill-gap",
  verifyToken,
  extractAIProvider,
  aiRateLimiter,
  validate(skillGapSchema),
  asyncHandler(async (req, res) => {
    const { resumeText, jobDescription } = req.body;
    assertResumeTextWithinLimit(resumeText);

    try {
      const result = await analyzeSkillGap(
        resumeText,
        jobDescription,
        req.aiProvider,
      );

      res.json({
        success: true,
        data: result.analysis,
        provider: result.provider,
        providerSource: req.aiProviderSource,
      });
    } catch (error) {
      console.error("Skill gap analysis error:", error);
      throw new ApiError(500, "Failed to analyze skill gap. Please try again.");
    }
  }),
);

// Translate a resume into a target language while preserving formatting.
// Powers the "Translate" tool in the resume viewer — useful for international
// job applications.
router.post(
  "/translate",
  verifyToken,
  extractAIProvider,
  aiRateLimiter,
  validate(translateResumeSchema),
  asyncHandler(async (req, res) => {
    const { resumeText, targetLanguage, sourceLanguage } = req.body;
    assertResumeTextWithinLimit(resumeText);

    try {
      const result = await translateResume(
        resumeText,
        targetLanguage,
        sourceLanguage,
        req.aiProvider,
      );

      res.json({
        success: true,
        data: {
          translatedText: result.translatedText,
          targetLanguage: result.targetLanguage,
          sourceLanguage: result.sourceLanguage,
        },
        provider: result.provider,
        providerSource: req.aiProviderSource,
      });
    } catch (error) {
      console.error("Resume translation error:", error);
      throw new ApiError(500, "Failed to translate resume. Please try again.");
    }
  }),
);

// One-Click Resume Tailor — rewrites the resume to match a job description.
// Powers the "Tailor to this job" tool in the resume viewer.
router.post(
  "/tailor",
  verifyToken,
  extractAIProvider,
  aiRateLimiter,
  validate(tailorResumeSchema),
  asyncHandler(async (req, res) => {
    const { resumeText, jobDescription, jobRole } = req.body;
    assertResumeTextWithinLimit(resumeText);

    try {
      const result = await tailorResume(
        resumeText,
        jobDescription,
        jobRole,
        req.aiProvider,
      );

      res.json({
        success: true,
        data: {
          tailoredText: result.tailoredText,
          jobRole: jobRole || null,
        },
        provider: result.provider,
        providerSource: req.aiProviderSource,
      });
    } catch (error) {
      console.error("Resume tailoring error:", error);
      throw new ApiError(500, "Failed to tailor resume. Please try again.");
    }
  }),
);

// Inline element enhancer — powers the ✨ Enhance button inside the AI
// Portfolio Builder modal. Receives a single text field and returns a
// rewritten version. Lightweight: no auth required, deterministic rewrite
// in v1 so the modal flow is fully demoable without an LLM round-trip.
// TODO: switch to `req.aiProvider.generateContent(microPrompt)` once the
// provider is fully wired into the modal's auth flow.
router.post(
  "/element",
  verifyToken,
  extractAIProvider,
  aiRateLimiter,
  asyncHandler(async (req, res) => {
    const { slug, kind, value } = req.body || {};
    if (typeof value !== "string") {
      throw new ApiError(400, "value string is required");
    }

    const trimmed = value.trim();
    if (!trimmed) {
      return res.json({ success: true, enhanced: "" });
    }

    if (/^#?\d+$/.test(trimmed)) {
      return res.json({ success: true, enhanced: trimmed });
    }

    try {
      const provider = req.aiProvider;
      const prompt = `You are an AI copywriting assistant. Please improve and enhance the following text. Make it sound professional, engaging, and polished. Do not add any extra commentary, just return the improved text.
Original text: "${trimmed}"`;

      const result = await provider.generateContent(prompt);
      let enhanced = result.text.trim();
      // remove quotes if the LLM wrapped it
      if (enhanced.startsWith('"') && enhanced.endsWith('"')) {
        enhanced = enhanced.slice(1, -1).trim();
      }

      res.json({
        success: true,
        enhanced,
        slug: slug || null,
        kind: kind || "text",
      });
    } catch (error) {
      console.error("Element Enhance Error:", error);
      // Fallback if LLM fails
      let enhanced;
      if (kind === "textarea" || trimmed.length >= 60) {
        enhanced = `${trimmed.replace(/\s+/g, " ").trim()}. Delivered with a relentless focus on performance and reliability.`;
      } else {
        enhanced = `${trimmed} — engineered for speed, built for scale, ready to ship.`;
      }

      res.json({
        success: true,
        enhanced,
        slug: slug || null,
        kind: kind || "text",
      });
    }
  }),
);

// Streaming endpoint for resume enhancement
router.post(
  "/stream",
  verifyToken,
  extractAIProvider,
  aiRateLimiter,
  asyncHandler(async (req, res) => {
    const { resumeText, preferences } = req.body;
    let isAborted = false;

    const markAborted = () => {
      isAborted = true;
    };

    req.once("close", markAborted);
    res.once("close", markAborted);

    if (!resumeText || !resumeText.trim()) {
      throw new ApiError(400, "Resume text is required");
    }
    assertResumeTextWithinLimit(resumeText);

    if (!preferences || !preferences.jobRole) {
      throw new ApiError(400, "Job role preference is required");
    }

    const stream = createSSEStream(res);

    try {
      if (isAborted) return;
      stream.sendProgress(10, "Initializing AI model...");

      const validatedPreferences = {
        jobRole: preferences.jobRole,
        yearsOfExperience: preferences.yearsOfExperience || 0,
        skills: Array.isArray(preferences.skills) ? preferences.skills : [],
        industry: preferences.industry || "",
        customInstructions: preferences.customInstructions || "",
      };

      stream.sendProgress(20, "Preparing prompt...");

      if (isAborted) return;

      const provider = req.aiProvider;
      const systemPrompt = getSystemPrompt(
        validatedPreferences.jobRole,
        validatedPreferences.yearsOfExperience,
        validatedPreferences.skills,
        validatedPreferences.industry,
        validatedPreferences.customInstructions,
        preferences.profileInfo || {},
      );

      const prompt = `${systemPrompt}\n\nPlease enhance the following resume:\n\n${resumeText}`;

      stream.sendProgress(30, "Processing resume with AI...");

      if (isAborted) return;

      if (!provider.generateContentStream) {
        const result = await provider.generateContent(prompt);
        if (isAborted) return;
        stream.sendChunk(result.text, true);
        stream.sendDone({ tokensUsed: result.usage });
        stream.endStream();
        return;
      }

      let fullText = "";
      let tokensUsed = { prompt: 0, completion: 0, total: 0 };
      let lastProgress = 30;

      for await (const chunk of await provider.generateContentStream(prompt)) {
        if (isAborted) {
          stream.endStream();
          return;
        }

        if (chunk.done) {
          tokensUsed = chunk.usage || tokensUsed;
          stream.sendDone({ tokensUsed });
          break;
        }

        if (chunk.text) {
          fullText += chunk.text;
          stream.sendChunk(chunk.text, false);

          const progress = Math.min(90, 30 + fullText.length / 50);
          if (progress - lastProgress > 5) {
            stream.sendProgress(
              Math.round(progress),
              "Generating enhanced resume...",
            );
            lastProgress = progress;
          }
        }
      }

      stream.sendProgress(100, "Complete!");
      stream.endStream();
    } catch (error) {
      if (isAborted) {
        return;
      }
      console.error("Streaming enhancement error:", error);
      stream.sendError(error.message || "Failed to enhance resume");
      stream.endStream();
    } finally {
      req.off("close", markAborted);
      res.off("close", markAborted);
    }
  }),
);

// Predict career trajectories based on resume data
// POST /api/enhance/career-trajectory
router.post(
  "/career-trajectory",
  verifyToken,
  extractAIProvider,
  aiRateLimiter,
  asyncHandler(async (req, res) => {
    const { resumeData } = req.body;

    if (!resumeData || typeof resumeData !== "object") {
      throw new ApiError(400, "resumeData object is required");
    }

    const { currentRole, skills, yearsOfExperience, industry } = resumeData;

    // At least one meaningful field must be present
    const hasRole =
      currentRole && typeof currentRole === "string" && currentRole.trim();
    const hasSkills = Array.isArray(skills) && skills.length > 0;

    if (!hasRole && !hasSkills) {
      throw new ApiError(
        400,
        "resumeData must include at least currentRole or skills",
      );
    }

    // Sanitise inputs — never forward raw resumeText to the AI (token cost)
    // Validate and sanitise each field to enforce strict token/cost bounds
    const sanitisedData = {
      // Cap role to 100 chars to prevent prompt injection / token bloat
      currentRole: hasRole
        ? currentRole.trim().slice(0, 100)
        : "Software Engineer",

      // Filter to valid non-empty strings only, cap each skill at 50 chars, limit to 10 skills
      skills: hasSkills
        ? skills
            .filter((s) => typeof s === "string" && s.trim().length > 0)
            .map((s) => s.trim().slice(0, 50))
            .slice(0, 10)
        : [],

      // Reject NaN, Infinity, and negative values — clamp to safe range [0, 50]
      yearsOfExperience:
        typeof yearsOfExperience === "number" &&
        Number.isFinite(yearsOfExperience) &&
        yearsOfExperience >= 0
          ? Math.min(Math.floor(yearsOfExperience), 50)
          : 0,

      // Cap industry to 100 chars
      industry:
        typeof industry === "string"
          ? industry.trim().slice(0, 100)
          : "Technology",
    };

    try {
      const result = await predictTrajectory(sanitisedData, req.aiProvider);

      res.json({
        success: true,
        data: {
          ...result,
          provider: req.aiProvider?.providerName || "gemini",
          providerSource: req.aiProviderSource,
        },
      });
    } catch (error) {
      console.error("Career trajectory prediction error:", error);
      if (error.statusCode === 502) {
        throw new ApiError(
          502,
          "AI returned an unexpected response. Please try again.",
        );
      }
      throw new ApiError(
        500,
        "Failed to predict career trajectory. Please try again.",
      );
    }
  }),
);

export default router;
