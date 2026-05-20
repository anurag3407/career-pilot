import express from 'express';
import { enhanceResume, generateSummary, suggestImprovements, analyzeATSScore, analyzeResumeComprehensive, analyzeBulletPoints, generateBeforeAfter, getVerbLists, getSystemPrompt } from '../config/langchain.js';
import { generateEmails } from '../services/emailGeneratorService.js';
import { optimizeLinkedInProfile } from '../services/linkedinOptimizerService.js';
import { verifyToken } from '../middleware/auth.js';
import { extractAIProvider } from '../middleware/aiKey.js';
import { asyncHandler, ApiError } from '../middleware/errorHandler.js';
import { aiRateLimiter } from '../middleware/rateLimiter.js';
import { createSSEStream } from '../middleware/stream.js';
import { getDefaultProvider } from '../config/aiProviders.js';
import { validate } from '../middleware/validate.js';
import {
  enhanceResumeSchema,
  resumeTextJobRoleSchema,
  beforeAfterSchema,
  generateEmailSchema,
  optimizeLinkedInSchema,
} from '../schemas/enhance.schema.js';

const router = express.Router();

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

export default router;
