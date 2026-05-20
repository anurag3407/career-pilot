import { z } from 'zod';

const EMPLOYMENT_TYPES = ['full-time', 'part-time', 'contract', 'internship', 'freelance'];

/**
 * POST /api/job-alerts
 */
export const createJobAlertSchema = z.object({
  title: z
    .string({ required_error: 'title is required' })
    .min(1, 'title cannot be empty'),
  keywords: z.array(z.string()).optional().default([]),
  location: z.string().optional().default(''),
  remoteOnly: z.boolean().optional().default(false),
  salaryMin: z.number().min(0).nullish().default(null),
  salaryMax: z.number().min(0).nullish().default(null),
  employmentType: z
    .array(z.enum(EMPLOYMENT_TYPES))
    .optional()
    .default(['full-time']),
});

/**
 * PUT /api/job-alerts/:id
 */
export const updateJobAlertSchema = z.object({
  title: z.string().min(1, 'title cannot be empty').optional(),
  keywords: z.array(z.string()).optional(),
  location: z.string().optional(),
  remoteOnly: z.boolean().optional(),
  salaryMin: z.number().min(0).nullish(),
  salaryMax: z.number().min(0).nullish(),
  employmentType: z.array(z.enum(EMPLOYMENT_TYPES)).optional(),
  isActive: z.boolean().optional(),
});
