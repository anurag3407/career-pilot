import { z } from 'zod';

const PASSWORD_STRENGTH_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

/**
 * POST /api/auth/register
 */
export const registerSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters')
    .trim(),
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address')
    .transform((val) => val.toLowerCase()),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .regex(
      PASSWORD_STRENGTH_PATTERN,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
});

/**
 * POST /api/auth/login
 */
export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address')
    .transform((val) => val.toLowerCase()),
  password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
});

/**
 * POST /api/auth/forgot-password
 */
export const forgotPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address')
    .transform((val) => val.toLowerCase()),
});

/**
 * POST /api/auth/reset-password
 */
export const resetPasswordSchema = z.object({
  token: z.string({ required_error: 'Reset token is required' }).min(1, 'Reset token is required'),
  newPassword: z
    .string({ required_error: 'New password is required' })
    .min(8, 'Password must be at least 8 characters')
    .regex(
      PASSWORD_STRENGTH_PATTERN,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
});

/**
 * PUT /api/auth/notification-preferences
 */
export const updateNotificationPrefsSchema = z.object({
  jobAlerts: z.boolean({
    required_error: 'jobAlerts is required',
    invalid_type_error: 'jobAlerts must be a boolean',
  }),
  directMessages: z.boolean({
    required_error: 'directMessages is required',
    invalid_type_error: 'directMessages must be a boolean',
  }),
  proposalUpdates: z.boolean({
    required_error: 'proposalUpdates is required',
    invalid_type_error: 'proposalUpdates must be a boolean',
  }),
});
