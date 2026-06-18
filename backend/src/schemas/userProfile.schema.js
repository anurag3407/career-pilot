import { z } from 'zod';

// Reusable string field that tolerates null / undefined and coerces to ''.
const optionalString = (max) =>
  z
    .union([z.string(), z.null(), z.undefined()])
    .transform((v) => (v == null ? '' : String(v)))
    .refine((v) => v.length <= max, `must be at most ${max} characters`)
    .optional();

const yearSchema = z
  .number()
  .int('year must be an integer')
  .min(1900, 'year must be >= 1900')
  .max(2100, 'year must be <= 2100');

const educationItemSchema = z.object({
  institution: z.string().trim().max(150).optional(),
  degree: z.string().trim().max(100).optional(),
  field: z.string().trim().max(100).optional(),
  startYear: yearSchema.optional(),
  endYear: yearSchema.optional(),
});

/**
 * PUT /api/profile/me
 *
 * Every field is optional — clients may PATCH any subset. Empty objects are
 * allowed so consumers can save a single field at a time.
 */
export const updateProfileSchema = z.object({
  // Existing fields
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

  // New personal-info fields
  avatarUrl: optionalString(500),
  phone: optionalString(30),
  headline: optionalString(120),
  dateOfBirth: z
    .union([z.string(), z.date(), z.null()])
    .nullable()
    .transform((v) => (v === '' || v == null ? null : new Date(v)))
    .refine(
      (v) => v === null || (!isNaN(v.getTime()) && v <= new Date()),
      'dateOfBirth must be a valid past or current date'
    )
    .optional(),
  gender: z
    .enum(['male', 'female', 'non-binary', 'prefer-not-to-say', 'other', ''])
    .optional(),
  company: optionalString(100),
  yearsOfExperience: z
    .number()
    .int('yearsOfExperience must be an integer')
    .min(0, 'yearsOfExperience must be >= 0')
    .max(80, 'yearsOfExperience must be <= 80')
    .optional(),
  collegeStudent: z.boolean().optional(),
  openToWork: z.boolean().optional(),
  education: z.array(educationItemSchema).max(20, 'You can list at most 20 education entries').optional(),
  languages: z
    .array(z.string().trim().min(1).max(50))
    .max(20, 'You can list at most 20 languages')
    .optional(),
  resumeHeadline: optionalString(300),
});

/**
 * POST /api/profile/me/avatar
 *
 * Validates the JSON body returned after an avatar has been uploaded to
 * Firebase Storage. The client uploads directly to Storage and then sends
 * the resulting download URL here so we can persist it on the profile.
 */
export const setAvatarSchema = z.object({
  avatarUrl: z
    .string()
    .trim()
    .url('avatarUrl must be a valid URL')
    .max(500, 'avatarUrl must be at most 500 characters'),
});
