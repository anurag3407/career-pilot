import { z } from 'zod';

/**
 * POST /api/portfolio/github/build
 */
export const buildGithubPortfolioSchema = z.object({
  username: z
    .string({ required_error: 'GitHub username is required' })
    .min(1, 'Username cannot be empty')
    .max(39, 'GitHub usernames are at most 39 characters')
    .regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/, 'Invalid GitHub username'),
  // Optional explicit PAT — frontend passes when the user opted out of OAuth
  token: z.string().nullable().optional(),
  // Restrict to specific repos (format: "owner/name"). Empty array = auto-pick top 6.
  selectedRepos: z.array(z.string()).max(20).optional().default([]),
  templateSlug: z.string().max(80).optional().default('github-default'),
  isPublic: z.boolean().optional().default(false),
});

/**
 * GET /api/portfolio/github/repos/:username
 */
export const listReposSchema = z.object({
  username: z
    .string()
    .min(1)
    .max(39)
    .regex(/^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/),
});

/**
 * POST /api/portfolio/github/validate-token
 */
export const validateTokenSchema = z.object({
  token: z.string({ required_error: 'GitHub token is required' }).min(10),
});