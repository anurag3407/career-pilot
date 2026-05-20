import { z } from 'zod';

const JOB_STATUSES = ['saved', 'applied', 'interviewing', 'offered', 'rejected'];

/**
 * POST /api/job-tracker/research
 */
export const companyResearchSchema = z.object({
  companyName: z
    .string({ required_error: 'companyName is required' })
    .min(1, 'companyName cannot be empty'),
  industry: z.string().optional(),
});

/**
 * POST /api/job-tracker
 */
export const trackJobSchema = z.object({
  jobId: z.string().optional(),
  title: z
    .string({ required_error: 'title is required' })
    .min(1, 'title cannot be empty'),
  company: z
    .string({ required_error: 'company is required' })
    .min(1, 'company cannot be empty'),
  location: z.string().optional().default('Remote'),
  jobType: z.string().optional().default('Full-time'),
  salary: z.string().nullish(),
  applyLink: z
    .string()
    .url('applyLink must be a valid URL starting with http:// or https://')
    .nullish(),
  description: z.string().nullish(),
  status: z.enum(JOB_STATUSES).optional().default('saved'),
});

/**
 * PUT /api/job-tracker/:trackerId
 */
export const updateTrackedJobSchema = z
  .object({
    status: z.enum(JOB_STATUSES, {
      errorMap: () => ({
        message: `status must be one of: ${JOB_STATUSES.join(', ')}`,
      }),
    }).optional(),
    notes: z.string().min(1, 'notes cannot be empty').optional(),
  })
  .refine((data) => data.status || data.notes, {
    message: 'Provide at least one of: status, notes',
  });
