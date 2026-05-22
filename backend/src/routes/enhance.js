import express from 'express';
import { enhanceResume, generateSummary, suggestImprovements, analyzeATSScore, analyzeResumeComprehensive, analyzeBulletPoints, generateBeforeAfter, getVerbLists, getSystemPrompt } from '../config/langchain.js';
import { generateEmails } from '../services/emailGeneratorService.js';
import { predictTrajectory } from '../services/ai/careerTrajectory.js';
import { optimizeLinkedInProfile } from '../services/linkedinOptimizerService.js';
import { verifyToken } from '../middleware/auth.js';
import { extractAIProvider } from '../middleware/aiKey.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';
import { createSSEStream } from '../middleware/stream.js';
import { getDefaultProvider } from '../config/aiProviders.js';
import { validate } from '../middleware/validate.js';
import { genAI } from '../config/genAI.js';
import {
  enhanceResumeSchema,
  resumeTextJobRoleSchema,
  beforeAfterSchema,
  generateEmailSchema,
  optimizeLinkedInSchema,
  resumeScoreSchema,
} from '../schemas/enhance.schema.js';

const router = express.Router();

// Score a resume and return structured feedback
// POST /api/enhance/resume-score
router.post('/resume-score', verifyToken, aiRateLimiter, validate(resumeScoreSchema), asyncHandler(async (req, res) => {
  const { resumeText } = req.body;

  const prompt = `Analyze this resume and return a JSON object with exactly these fields:
- overallScore (number 0-100)
- sections: object with keys "summary", "skills", "experience", "education", "projects" — each containing:
    - score (number 0-100)
    - feedback (string, one concise sentence)
- topSuggestions: array of exactly 3 strings, each a specific actionable improvement tip

Resume:
${resumeText}

Return only valid JSON. No markdown fences, no extra text, no explanation.`;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    // Strip markdown fences if model includes them despite instructions
    if (text.startsWith('```')) {
      text = text.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    }

    let scoreData;
    try {
      scoreData = JSON.parse(text);
    } catch (parseErr) {
      console.error('Resume score JSON parse error:', parseErr, 'Raw text:', text);
      throw new ApiError(502, 'AI returned an unexpected response. Please try again.');
    }

    res.json({
      success: true,
      data: scoreData,
    });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    console.error('Resume scoring error:', error);
    throw new ApiError(500, 'Failed to score resume. Please try again.');
  }
}));



// Enhance resume with AI
router.post('/', verifyToken, extractAIProvider, aiRateLimiter, validate(enhanceResumeSchema), asyncHandler(async (req, res) => {
  const { resumeText, preferences } = req.body;

  if (!resumeText || !resumeText.trim()) {
    throw new ApiError(400, 'Resume text is required');
  }

  if (!preferences || !preferences.jobRole) {
    throw new ApiError(400, 'Job role preference is required');
  }

  // Validate preferences
  const validatedPreferences = {
    jobRole: preferences.jobRole,
    yearsOfExperience: preferences.yearsOfExperience || 0,
    skills: Array.isArray(preferences.skills) ? preferences.skills : [],
    industry: preferences.industry || '',
    customInstructions: preferences.customInstructions || ''
  };

  try {
    const result = await enhanceResume(resumeText, validatedPreferences, req.aiProvider);

    res.json({
      success: true,
      data: {
        enhancedResume: result.enhancedResume,
        tokensUsed: result.tokensUsed,
        provider: result.provider,
        providerSource: req.aiProviderSource,
        processedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Resume enhancement error:', error);
    throw new ApiError(500, 'Failed to enhance resume. Please try again.');
  }
}));

// Generate summary only
router.post('/summary', verifyToken, extractAIProvider, aiRateLimiter, validate(resumeTextJobRoleSchema), asyncHandler(async (req, res) => {
  const { resumeText, jobRole } = req.body;

  if (!resumeText || !resumeText.trim()) {
    throw new ApiError(400, 'Resume text is required');
  }

  if (!jobRole) {
    throw new ApiError(400, 'Job role is required');
  }

  try {
    const result = await generateSummary(resumeText, jobRole, req.aiProvider);

    res.json({
      success: true,
      data: {
        summary: result.summary,
        provider: result.provider,
        providerSource: req.aiProviderSource
      }
    });
  } catch (error) {
    console.error('Summary generation error:', error);
    throw new ApiError(500, 'Failed to generate summary. Please try again.');
  }
}));

// Get improvement suggestions
router.post('/suggestions', verifyToken, extractAIProvider, aiRateLimiter, validate(resumeTextJobRoleSchema), asyncHandler(async (req, res) => {
  const { resumeText, jobRole } = req.body;

  if (!resumeText || !resumeText.trim()) {
    throw new ApiError(400, 'Resume text is required');
  }

  if (!jobRole) {
    throw new ApiError(400, 'Job role is required');
  }

  try {
    const result = await suggestImprovements(resumeText, jobRole, req.aiProvider);

    res.json({
      success: true,
      data: {
        suggestions: result.suggestions,
        provider: result.provider,
        providerSource: req.aiProviderSource
      }
    });
  } catch (error) {
    console.error('Suggestions generation error:', error);
    throw new ApiError(500, 'Failed to generate suggestions. Please try again.');
  }
}));

// Analyze ATS score
router.post('/ats-analysis', verifyToken, extractAIProvider, aiRateLimiter, validate(resumeTextJobRoleSchema), asyncHandler(async (req, res) => {
  const { resumeText, jobRole } = req.body;

  if (!resumeText || !resumeText.trim()) {
    throw new ApiError(400, 'Resume text is required');
  }

  if (!jobRole) {
    throw new ApiError(400, 'Job role is required');
  }

  try {
    const result = await analyzeATSScore(resumeText, jobRole, req.aiProvider);

    res.json({
      success: true,
      data: result.analysis,
      provider: result.provider,
      providerSource: req.aiProviderSource
    });
  } catch (error) {
    console.error('ATS analysis error:', error);
    throw new ApiError(500, 'Failed to analyze ATS score. Please try again.');
  }
}));

// Comprehensive resume analysis (Senior Expert Level)
router.post('/comprehensive-analysis', verifyToken, extractAIProvider, aiRateLimiter, validate(resumeTextJobRoleSchema), asyncHandler(async (req, res) => {
  const { resumeText, jobRole } = req.body;

  if (!resumeText || !resumeText.trim()) {
    throw new ApiError(400, 'Resume text is required');
  }

  if (!jobRole) {
    throw new ApiError(400, 'Job role is required');
  }

  try {
    const result = await analyzeResumeComprehensive(resumeText, jobRole, req.aiProvider);

    res.json({
      success: true,
      data: result.analysis,
      provider: result.provider,
      providerSource: req.aiProviderSource
    });
  } catch (error) {
    console.error('Comprehensive analysis error:', error);
    throw new ApiError(500, 'Failed to perform comprehensive analysis. Please try again.');
  }
}));

// Analyze individual bullet points
router.post('/analyze-bullets', verifyToken, extractAIProvider, aiRateLimiter, validate(resumeTextJobRoleSchema), asyncHandler(async (req, res) => {
  const { resumeText, jobRole } = req.body;

  if (!resumeText || !resumeText.trim()) {
    throw new ApiError(400, 'Resume text is required');
  }

  if (!jobRole) {
    throw new ApiError(400, 'Job role is required');
  }

  try {
    const result = await analyzeBulletPoints(resumeText, jobRole, req.aiProvider);

    res.json({
      success: true,
      data: result.analysis,
      provider: result.provider,
      providerSource: req.aiProviderSource
    });
  } catch (error) {
    console.error('Bullet analysis error:', error);
    throw new ApiError(500, 'Failed to analyze bullet points. Please try again.');
  }
}));

// Generate before/after comparison
router.post('/before-after', verifyToken, extractAIProvider, aiRateLimiter, validate(beforeAfterSchema), asyncHandler(async (req, res) => {
  const { resumeText, jobRole, analysisResults } = req.body;

  if (!resumeText || !resumeText.trim()) {
    throw new ApiError(400, 'Resume text is required');
  }

  if (!jobRole) {
    throw new ApiError(400, 'Job role is required');
  }

  try {
    const result = await generateBeforeAfter(resumeText, jobRole, analysisResults || {}, req.aiProvider);

    res.json({
      success: true,
      data: result.comparison,
      provider: result.provider,
      providerSource: req.aiProviderSource
    });
  } catch (error) {
    console.error('Before/after generation error:', error);
    throw new ApiError(500, 'Failed to generate comparison. Please try again.');
  }
}));

// Get power/weak verb lists
router.get('/verb-lists', verifyToken, asyncHandler(async (req, res) => {
  const verbs = getVerbLists();

  res.json({
    success: true,
    data: verbs
  });
}));

// Generate Email Variants
router.post('/generate-email', verifyToken, extractAIProvider, aiRateLimiter, validate(generateEmailSchema), asyncHandler(async (req, res) => {
  const { resume, jobDesc, tone } = req.body;

  if (!resume || !jobDesc) {
    throw new ApiError(400, 'Resume and Job Description are required');
  }

  try {
    const result = await generateEmails(resume, jobDesc, tone || 'Professional', req.aiProvider);
    res.json({
      success: true,
      subjectLines: result.subjectLines,
      variants: result.variants,
      provider: req.aiProvider.providerName,
      providerSource: req.aiProviderSource,
    });
  } catch (error) {
    console.error('Email generation error:', error);
    throw new ApiError(500, 'Failed to generate emails. Please try again.');
  }
}));

// Optimize LinkedIn Profile
router.post('/optimize-linkedin', verifyToken, aiRateLimiter, validate(optimizeLinkedInSchema), asyncHandler(async (req, res) => {
  const { profileText, targetRole } = req.body;
  const normalizedProfile = typeof profileText === 'string' ? profileText.trim() : '';
  const normalizedRole = typeof targetRole === 'string' ? targetRole.trim() : '';

  if (!normalizedProfile) {
    throw new ApiError(400, 'LinkedIn profile text is required');
  }

  if (normalizedProfile.length > 5000) {
    throw new ApiError(400, 'Profile text exceeds the allowed limit (max 5000 characters)');
  }

  const result = await optimizeLinkedInProfile(normalizedProfile, normalizedRole);
  res.json(result);
}));

// Streaming endpoint for resume enhancement
router.post('/stream', verifyToken, extractAIProvider, aiRateLimiter, asyncHandler(async (req, res) => {
  const { resumeText, preferences } = req.body;

  if (!resumeText || !resumeText.trim()) {
    throw new ApiError(400, 'Resume text is required');
  }

  if (!preferences || !preferences.jobRole) {
    throw new ApiError(400, 'Job role preference is required');
  }

  const stream = createSSEStream(res);

  try {
    stream.sendProgress(10, 'Initializing AI model...');

    const validatedPreferences = {
      jobRole: preferences.jobRole,
      yearsOfExperience: preferences.yearsOfExperience || 0,
      skills: Array.isArray(preferences.skills) ? preferences.skills : [],
      industry: preferences.industry || '',
      customInstructions: preferences.customInstructions || ''
    };

    stream.sendProgress(20, 'Preparing prompt...');

    const provider = req.aiProvider || getDefaultProvider();
    const systemPrompt = getSystemPrompt(
      validatedPreferences.jobRole,
      validatedPreferences.yearsOfExperience,
      validatedPreferences.skills,
      validatedPreferences.industry,
      validatedPreferences.customInstructions,
      preferences.profileInfo || {}
    );

    const prompt = `${systemPrompt}\n\nPlease enhance the following resume:\n\n${resumeText}`;

    stream.sendProgress(30, 'Processing resume with AI...');

    if (!provider.generateContentStream) {
      const result = await provider.generateContent(prompt);
      stream.sendChunk(result.text, true);
      stream.sendDone({ tokensUsed: result.usage });
      stream.endStream();
      return;
    }

    let fullText = '';
    let tokensUsed = { prompt: 0, completion: 0, total: 0 };
    let lastProgress = 30;

    for await (const chunk of await provider.generateContentStream(prompt)) {
      if (chunk.done) {
        tokensUsed = chunk.usage || tokensUsed;
        stream.sendDone({ tokensUsed });
        break;
      }

      if (chunk.text) {
        fullText += chunk.text;
        stream.sendChunk(chunk.text, false);

        const progress = Math.min(90, 30 + (fullText.length / 50));
        if (progress - lastProgress > 5) {
          stream.sendProgress(Math.round(progress), 'Generating enhanced resume...');
          lastProgress = progress;
        }
      }
    }

    stream.sendProgress(100, 'Complete!');
    stream.endStream();

  } catch (error) {
    console.error('Streaming enhancement error:', error);
    stream.sendError(error.message || 'Failed to enhance resume');
    stream.endStream();
  }
}));




// Predict career trajectories based on resume data
// POST /api/enhance/career-trajectory
router.post('/career-trajectory', verifyToken, extractAIProvider, aiRateLimiter, asyncHandler(async (req, res) => {
  const { resumeData } = req.body;

  if (!resumeData || typeof resumeData !== 'object') {
    throw new ApiError(400, 'resumeData object is required');
  }

  const { currentRole, skills, yearsOfExperience, industry } = resumeData;

  // At least one meaningful field must be present
  const hasRole = currentRole && typeof currentRole === 'string' && currentRole.trim();
  const hasSkills = Array.isArray(skills) && skills.length > 0;

  if (!hasRole && !hasSkills) {
    throw new ApiError(400, 'resumeData must include at least currentRole or skills');
  }

  // Sanitise inputs — never forward raw resumeText to the AI (token cost)
  // Validate and sanitise each field to enforce strict token/cost bounds
  const sanitisedData = {
    // Cap role to 100 chars to prevent prompt injection / token bloat
    currentRole: hasRole ? currentRole.trim().slice(0, 100) : 'Software Engineer',

    // Filter to valid non-empty strings only, cap each skill at 50 chars, limit to 10 skills
    skills: hasSkills
      ? skills
          .filter((s) => typeof s === 'string' && s.trim().length > 0)
          .map((s) => s.trim().slice(0, 50))
          .slice(0, 10)
      : [],

    // Reject NaN, Infinity, and negative values — clamp to safe range [0, 50]
    yearsOfExperience:
      typeof yearsOfExperience === 'number' &&
      Number.isFinite(yearsOfExperience) &&
      yearsOfExperience >= 0
        ? Math.min(Math.floor(yearsOfExperience), 50)
        : 0,

    // Cap industry to 100 chars
    industry: typeof industry === 'string' ? industry.trim().slice(0, 100) : 'Technology',
  };

  try {
    const result = await predictTrajectory(sanitisedData, req.aiProvider);

    res.json({
      success: true,
      data: {
        ...result,
        provider: req.aiProvider?.providerName || 'gemini',
        providerSource: req.aiProviderSource,
      },
    });
  } catch (error) {
    console.error('Career trajectory prediction error:', error);
    if (error.statusCode === 502) {
      throw new ApiError(502, 'AI returned an unexpected response. Please try again.');
    }
    throw new ApiError(500, 'Failed to predict career trajectory. Please try again.');
  }
}));

export default router;