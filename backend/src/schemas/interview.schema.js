import { z } from 'zod';

/**
 * POST /api/interview/start
 *
 * Extended in v2 to accept:
 *   - mode            : interview mode (behavioral | technical | coding | mixed)
 *   - language        : short code from frontend/src/constants/languages.js
 *   - companyName     : optional target company (fetches from curated bank)
 *   - codingLanguage  : preferred starter language for coding mode
 *   - jobDescriptionText : pre-scraped JD body (alternative to URL paste)
 *   - skipWarmup      : if true, skip the 2-question warmup phase
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

  // v2 additions
  mode: z.enum(['behavioral', 'technical', 'coding', 'mixed']).optional().default('behavioral'),
  language: z.string().min(2).max(10).optional().default('en'),
  companyName: z.string().max(120).nullish(),
  companyRole: z.string().max(120).nullish(),
  codingLanguage: z.enum(['javascript', 'python', 'java', 'cpp', 'go']).optional().default('javascript'),
  jobDescriptionText: z.string().max(20000).nullish(),
  skipWarmup: z.boolean().optional().default(false)
});

/**
 * POST /api/interview/:id/answer
 *
 * Extended in v2 to accept:
 *   - code             : candidate's source code (coding mode)
 *   - codingLanguage   : which language the code is in
 *   - isWarmup         : true when the answer belongs to a warmup question
 *                        (not counted toward overall scoring)
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

  // v2 additions
  code: z.string().max(50000).nullish(),
  codingLanguage: z.enum(['javascript', 'python', 'java', 'cpp', 'go']).optional(),
  isWarmup: z.boolean().optional().default(false)
});

/**
 * POST /api/interview/transcribe
 *
 * Body shape (multipart, validated separately by multer):
 *   - audio   : file (audio/webm or audio/wav)
 *   - language: short language code (en, es, ...)
 *
 * Only the `language` field is validated here.
 */
export const transcribeAudioSchema = z.object({
  language: z.string().min(2).max(10).default('en')
});

/**
 * POST /api/interview/parse-jd
 *
 * Accepts either a URL to scrape or raw pasted text. At least one is required.
 */
export const parseJdSchema = z
  .object({
    url: z.string().url().optional(),
    text: z.string().max(50000).optional()
  })
  .refine((d) => d.url || d.text, {
    message: 'Either `url` or `text` must be provided',
  });

/**
 * POST /api/interview/:id/annotate/:answerId
 */
export const annotateSchema = z.object({
  annotation: z.string().min(1, 'annotation cannot be empty').max(2000)
});

/**
 * POST /api/interview/:id/switch-provider
 *
 * No body required — provider is re-extracted from BYOK headers. We keep the
 * endpoint typed for future expansion (e.g., model override).
 */
export const switchProviderSchema = z
  .object({
    note: z.string().max(500).optional()
  })
  .optional();

/**
 * POST /api/interview/:id/run-code
 *
 * Body:
 *   - code          : candidate's source
 *   - language      : language tag
 *   - problemId     : optional explicit problem id (defaults to interview's first coding question)
 */
export const runCodeSchema = z.object({
  code: z.string().min(1).max(50000),
  language: z.enum(['javascript', 'python', 'java', 'cpp', 'go']),
  problemId: z.string().optional()
});
