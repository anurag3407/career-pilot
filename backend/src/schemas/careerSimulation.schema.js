import { z } from 'zod';

/**
  * POST /api/career-simulations
  */
export const startCareerSimulationSchema = z.object({
  resumeId: z
    .string({ required_error: 'resumeId is required' })
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid resumeId format'),
  jobRole: z
    .string({ required_error: 'jobRole is required' })
    .min(1, 'jobRole cannot be empty'),
  experienceLevel: z.enum(['internship', 'entry', 'mid', 'senior'], {
    required_error: 'experienceLevel must be one of: internship, entry, mid, senior'
  })
});
