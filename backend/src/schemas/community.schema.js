import { z } from 'zod';

/**
 * POST /api/community/channels
 */
export const createChannelSchema = z.object({
  name: z
    .string({ required_error: 'name is required' })
    .min(1, 'name cannot be empty')
    .max(100, 'name must be at most 100 characters'),
  description: z.string().max(500).optional().default(''),
  isPrivate: z.boolean().optional().default(false),
});

/**
 * POST /api/community/posts
 * PUT /api/community/posts/:postId
 */
export const upsertPostSchema = z.object({
  title: z
    .string({ required_error: 'title is required' })
    .min(1, 'title cannot be empty')
    .max(200, 'title must be at most 200 characters'),
  content: z
    .string({ required_error: 'content is required' })
    .min(1, 'content cannot be empty'),
  category: z.string().optional().default('general'),
  scheduledAt: z.string().datetime({ message: 'scheduledAt must be an ISO-8601 datetime' }).optional().nullable(),
});

/**
 * POST /api/community/posts/:postId/comments
 */
export const createCommentSchema = z.object({
  content: z
    .string({ required_error: 'content is required' })
    .min(1, 'content cannot be empty')
    .max(2000, 'content must be at most 2000 characters'),
});
