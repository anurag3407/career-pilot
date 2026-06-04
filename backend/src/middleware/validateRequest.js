import { ZodError } from 'zod';

const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.issues.map((issue) => ({
          field: issue.path.join('.') || 'root',
          message: issue.message,
        }));
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details,
        });
      }
      next(error);
    }
  };
};

export default validateRequest;
