import { z } from 'zod';

/**
 * POST /api/auth/2fa/enable
 */
export const enable2FASchema = z.object({
  secret: z
    .string({ required_error: 'secret is required' })
    .min(1, 'secret cannot be empty'),
  token: z
    .string({ required_error: 'token is required' })
    .min(1, 'token cannot be empty'),
});

/**
 * POST /api/auth/2fa/disable
 * POST /api/auth/2fa/verify
 * POST /api/auth/2fa/backup-codes/regenerate
 */
export const tokenOnlySchema = z.object({
  token: z
    .string({ required_error: 'token is required' })
    .min(1, 'token cannot be empty'),
});

/**
 * POST /api/auth/2fa/verify-backup
 */
export const backupCodeSchema = z.object({
  code: z
    .string({ required_error: 'code is required' })
    .min(1, 'code cannot be empty'),
});

/**
 * POST /api/auth/2fa/verify-login
 */
export const verifyLoginSchema = z.object({
  email: z
    .string()
    .email('email must be a valid email address')
    .optional(),
  token: z
    .string({ required_error: 'token is required' })
    .min(1, 'token cannot be empty'),
  useBackup: z
    .boolean()
    .optional()
    .default(false),
});
