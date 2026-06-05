// Single source of truth lives in schemas/auth.schema.js.
// This file re-exports from there so any existing import of authValidator
// continues to work without changes.
export {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../schemas/auth.schema.js';
