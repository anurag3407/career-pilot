const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      const details = (error.issues ?? error.errors ?? []).map((issue) => ({
        field: issue.path?.join('.') || 'root',
        message: issue.message,
      }));
      return res.status(400).json({
        error: 'Validation failed',
        details,
      });
    }
  };
};

export default validateRequest;
