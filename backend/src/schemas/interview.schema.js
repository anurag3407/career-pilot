import { z } from 'zod';

/**
 * POST /api/interview/start
 */
export const startInterviewSchema = z.object({
  jobRole: z
    .string({ required_error: 'jobRole is required' })
    .min(1, 'jobRole cannot be empty'),
  industry: z
    .string({ required_error: 'industry is required' })
    .min(1, 'industry cannot be empty'),
  experienceLevel: z
    .string({ required_error: 'experienceLevel is required' })
    .min(1, 'experienceLevel cannot be empty'),
  questionCount: z.number().int().min(2).max(20).optional().default(10),
  resumeText: z.string().nullish(),
});

/**
 * POST /api/interview/:id/answer
 */
export const submitAnswerSchema = z.object({
  questionId: z
    .string({ required_error: 'questionId is required' })
    .min(1, 'questionId cannot be empty'),
  transcript: z
    .string({ required_error: 'transcript is required' })
    .min(1, 'transcript cannot be empty'),
  duration: z.number().min(0, 'duration must be a non-negative number'),
  expressionMetrics: z
    .object({
      averageConfidence: z.number().min(0).max(1).optional().default(0),
      eyeContactPercentage: z.number().min(0).max(100).optional().default(0),
      headMovementStability: z.number().min(0).max(1).optional().default(0),
      overallExpressionScore: z.number().min(0).max(100).optional().default(0),
    })
    .optional(),
});
