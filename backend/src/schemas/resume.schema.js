import { z } from 'zod';

/**
 * Sub-schema for user-defined custom sections (Gap #8). Each section has
 * a kind ('list' | 'paragraph' | 'books' | 'quotes'), a title, and either
 * an array of items or a body string depending on the kind.
 */
const customSectionItemSchema = z.object({
  id: z.string().min(1).max(60),
  title: z.string().trim().min(1, 'section title is required').max(80),
  kind: z.enum(['list', 'paragraph', 'books', 'quotes']).optional().default('list'),
  items: z.array(z.string().trim().min(1).max(500)).max(100).optional().default([]),
  body: z.string().max(5_000).optional().default(''),
  order: z.number().int().min(0).max(1000).optional().default(0),
});

const customSectionsField = z
  .array(customSectionItemSchema)
  .max(20, 'You can add at most 20 custom sections')
  .optional()
  .default([]);

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
  customSections: customSectionsField,
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
    customSections: customSectionsField.optional(),
  })
  .refine(
    (data) =>
      Object.entries(data).some(([k, v]) => k !== 'customSections' && v !== undefined),
    { message: 'At least one updatable field must be provided' }
  );

/**
 * GET /api/resumes/:resumeId/download  (query params)
 */
export const downloadResumeQuerySchema = z.object({
  version: z.enum(['enhanced', 'original']).optional().default('enhanced'),
});

/**
 * POST /api/resumes/:resumeId/versions
 */
export const createResumeVersionSchema = z.object({
  title: z.string().max(200, 'title must be at most 200 characters').optional(),
  originalText: z.string().min(1, 'originalText cannot be empty'),
  enhancedText: z.string().nullish(),
  jobRole: z.string().nullish(),
  atsScore: z.number().min(0).max(100).optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.unknown()).optional().default({}),
});

/**
 * PUT /api/resumes/:resumeId/versions/:versionId
 */
export const updateResumeVersionSchema = z.object({
  title: z.string().max(200, 'title must be at most 200 characters').optional(),
  tags: z.array(z.string()).optional(),
  jobRole: z.string().nullish(),
}).refine(
  (data) => Object.values(data).some((v) => v !== undefined),
  { message: 'At least one field must be provided for update' }
);

/**
 * POST /api/resumes/:resumeId/ats-history
 */
export const createAtsHistorySchema = z.object({
  jobRole: z.string({ required_error: 'jobRole is required' }).min(1, 'jobRole cannot be empty'),
  atsScore: z.number().min(0).max(100),
  scoreBreakdown: z.object({
    keywordMatch: z.number().min(0).max(100).default(0),
    formatting: z.number().min(0).max(100).default(0),
    experienceRelevance: z.number().min(0).max(100).default(0),
    skillsAlignment: z.number().min(0).max(100).default(0),
    educationMatch: z.number().min(0).max(100).default(0),
    summary: z.number().min(0).max(100).default(0),
    skills: z.number().min(0).max(100).default(0),
    experience: z.number().min(0).max(100).default(0),
    education: z.number().min(0).max(100).default(0),
    projects: z.number().min(0).max(100).default(0)
  }).optional(),
  missingKeywords: z.array(z.string()).optional(),
  improvementsCount: z.number().int().min(0).optional()
});


