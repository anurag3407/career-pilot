import { z } from 'zod';

/**
 * POST /api/resumes
 */
export const createResumeSchema = z.object({
  originalText: z
    .string({ required_error: 'originalText is required' })
    .min(1, 'originalText cannot be empty'),
  enhancedText: z.string().nullish(),
  jobRole: z.string().nullish(),
  preferences: z.record(z.unknown()).optional().default({}),
  title: z.string().max(200, 'title must be at most 200 characters').optional(),
});

/**
 * PUT /api/resumes/:resumeId
 */
export const updateResumeSchema = z
  .object({
    originalText: z.string().min(1, 'originalText cannot be empty').optional(),
    enhancedText: z.string().nullish(),
    jobRole: z.string().nullish(),
    preferences: z.record(z.unknown()).optional(),
    title: z.string().max(200, 'title must be at most 200 characters').optional(),
    pdfUrl: z.string().url('pdfUrl must be a valid URL').nullish(),
  })
  .refine(
    (data) => Object.values(data).some((v) => v !== undefined),
    { message: 'At least one field must be provided for update' }
  );

/**
 * GET /api/resumes/:resumeId/download  (query params)
 */
export const downloadResumeQuerySchema = z.object({
  version: z.enum(['enhanced', 'original']).optional().default('enhanced'),
});
