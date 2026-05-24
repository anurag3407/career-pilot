import { z } from 'zod';

/**
 * PUT /api/profile/me
 */
export const updateProfileSchema = z.object({
  displayName: z.string().max(100, 'displayName must be at most 100 characters').optional(),
  bio: z.string().max(500, 'bio must be at most 500 characters').optional(),
  jobRole: z.string().max(100, 'jobRole must be at most 100 characters').optional(),
  skills: z
    .array(z.string().trim().min(1))
    .max(20, 'You can list at most 20 skills')
    .optional(),
  location: z.string().max(100, 'location must be at most 100 characters').optional(),
  website: z.string().max(200, 'website must be at most 200 characters').optional(),
  github: z.string().max(100, 'github must be at most 100 characters').optional(),
  linkedin: z.string().max(200, 'linkedin must be at most 200 characters').optional(),
});
