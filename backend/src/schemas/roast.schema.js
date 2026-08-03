import { z } from 'zod';

export const createRoastSchema = z.object({
  resumeText: z
    .string({ required_error: 'resumeText is required' })
    .min(50, 'resumeText must be at least 50 characters to roast meaningfully'),
  jobRole: z
    .string()
    .max(120)
    .optional()
    .default(''),
  isPublic: z.boolean().optional().default(false),
});