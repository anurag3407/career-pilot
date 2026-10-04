import { z } from 'zod';

/** Shared base: resumeText + jobRole */
const resumeTextJobRoleBase = z.object({
  resumeText: z
    .string({ required_error: 'resumeText is required' })
    .min(1, 'resumeText cannot be empty'),
  jobRole: z
    .string({ required_error: 'jobRole is required' })
    .min(1, 'jobRole cannot be empty'),
});

/**
 * POST /api/enhance
 */
export const enhanceResumeSchema = z.object({
  resumeText: z
    .string({ required_error: 'resumeText is required' })
    .min(1, 'resumeText cannot be empty'),
  preferences: z
    .object({
      jobRole: z
        .string({ required_error: 'preferences.jobRole is required' })
        .min(1, 'preferences.jobRole cannot be empty'),
      yearsOfExperience: z.number().min(0).optional().default(0),
      skills: z.array(z.string()).optional().default([]),
      industry: z.string().optional().default(''),
      customInstructions: z.string().optional().default(''),
      profileInfo: z.record(z.unknown()).optional().default({}),
    })
    .strict(),
});

/**
 * POST /api/enhance/summary
 * POST /api/enhance/suggestions
 * POST /api/enhance/ats-analysis
 * POST /api/enhance/comprehensive-analysis
 * POST /api/enhance/analyze-bullets
 */
export const resumeTextJobRoleSchema = resumeTextJobRoleBase;

/**
 * POST /api/enhance/before-after
 */
export const beforeAfterSchema = resumeTextJobRoleBase.extend({
  analysisResults: z.record(z.unknown()).optional().default({}),
});

/**
 * POST /api/enhance/translate
 *
 * Translates a resume to a target language while preserving formatting
 * and locale-aware conventions. Used by the AI Translation tool in the
 * resume viewer.
 */
export const translateResumeSchema = z.object({
  resumeText: z
    .string({ required_error: 'resumeText is required' })
    .min(1, 'resumeText cannot be empty')
    .max(20_000, 'resumeText is too long (max 20,000 characters)'),
  targetLanguage: z
    .string({ required_error: 'targetLanguage is required' })
    .min(2, 'targetLanguage must be at least 2 characters')
    .max(60, 'targetLanguage must be at most 60 characters'),
  sourceLanguage: z.string().max(60).optional().default('auto-detect'),
});

/**
 * POST /api/enhance/tailor
 *
 * One-Click Resume Tailor. Takes a resume + job description and
 * returns a JD-tailored rewrite.
 */
export const tailorResumeSchema = z.object({
  resumeText: z
    .string({ required_error: 'resumeText is required' })
    .min(1, 'resumeText cannot be empty')
    .max(20_000, 'resumeText is too long (max 20,000 characters)'),
  jobDescription: z
    .string({ required_error: 'jobDescription is required' })
    .min(20, 'jobDescription must be at least 20 characters')
    .max(10_000, 'jobDescription must be at most 10,000 characters'),
  jobRole: z.string().max(120).optional().default(''),
});

/**
 * POST /api/enhance/generate-email
 */
export const generateEmailSchema = z.object({
  resume: z
    .string({ required_error: 'resume is required' })
    .min(1, 'resume cannot be empty'),
  jobDesc: z
    .string({ required_error: 'jobDesc is required' })
    .min(1, 'jobDesc cannot be empty')
    .max(10_000, 'jobDesc is too long (max 10,000 characters)'),
  tone: z
    .enum(['Professional', 'Friendly', 'Formal', 'Casual'])
    .optional()
    .default('Professional'),
});

/**
 * POST /api/enhance/resume-score
 */
export const resumeScoreSchema = z.object({
  resumeText: z
    .string({ required_error: 'resumeText is required' })
    .min(50, 'resumeText is too short to score meaningfully'),
});

/**
 * POST /api/enhance/optimize-linkedin
 */
export const optimizeLinkedInSchema = z.object({
  profileText: z
    .string({ required_error: 'profileText is required' })
    .min(1, 'profileText cannot be empty')
    .max(5000, 'profileText must not exceed 5000 characters'),
  targetRole: z.string().optional().default(''),
});

/**
 * POST /api/enhance/skill-gap
 */
export const skillGapSchema = z.object({
  resumeText: z
    .string({ required_error: 'resumeText is required' })
    .min(1, 'resumeText cannot be empty'),
  jobDescription: z
    .string({ required_error: 'jobDescription is required' })
    .min(20, 'jobDescription must be at least 20 characters')
    .max(10_000, 'jobDescription is too long (max 10,000 characters)'),
});