import { ZodError } from 'zod';

/**
 * Formats a ZodError into a structured array of field-level errors.
 *
 * Each element contains:
 *  - field  : dot-joined path (e.g. "preferences.jobRole")
 *  - message: human-readable description
 *
 * @param {ZodError} zodError
 * @returns {{ field: string, message: string }[]}
 */
const formatZodErrors = (zodError) =>
  (zodError.issues ?? zodError.errors).map((issue) => ({
    field: issue.path.join('.') || 'root',
    message: issue.message,
  }));

/**
 * Factory that returns an Express middleware validating the chosen part of the
 * request (body | query | params) against a Zod schema.
 *
 * On success the validated (and potentially transformed/defaulted) data is
 * written back to `req[target]` so downstream handlers receive clean data.
 *
 * On failure a structured 400 response is sent:
 * ```json
 * {
 *   "success": false,
 *   "error": "Validation failed",
 *   "details": [
 *     { "field": "title", "message": "Required" },
 *     { "field": "preferences.jobRole", "message": "Expected string, received number" }
 *   ]
 * }
 * ```
 *
 * @param {import('zod').ZodTypeAny} schema - Zod schema to validate against
 * @param {'body'|'query'|'params'} [target='body'] - which part of req to validate
 * @returns {import('express').RequestHandler}
 *
 * @example
 * import { validate } from '../middleware/validate.js';
 * import { createResumeSchema } from '../schemas/resume.schema.js';
 *
 * router.post('/', verifyToken, validate(createResumeSchema), asyncHandler(handler));
 */
export const validate = (schema, target = 'body') => {
  return (req, res, next) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: formatZodErrors(result.error),
      });
    }

    // Replace req[target] with the parsed (possibly transformed) data
    req[target] = result.data;

    next();
  };
};
