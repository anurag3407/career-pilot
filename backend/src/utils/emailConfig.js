/**
 * Email service configuration validation.
 *
 * The mail service (src/services/mailService.js) sends mail through one of two
 * paths: an external Vercel email service (EMAIL_SERVICE_URL + EMAIL_API_KEY)
 * or a direct SMTP fallback (EMAIL_USER + EMAIL_PASS, with EMAIL_HOST
 * defaulting to smtp.gmail.com). If neither is configured, email features fail
 * silently at send time. These helpers let the server detect that at startup.
 */

/**
 * Determine which email delivery mode, if any, is configured.
 *
 * @param {NodeJS.ProcessEnv} env Environment to read from.
 * @returns {{ configured: boolean, mode: 'external' | 'smtp' | 'none' }}
 */
export function describeEmailConfig(env = process.env) {
  const hasExternal = Boolean(env.EMAIL_SERVICE_URL && env.EMAIL_API_KEY);
  if (hasExternal) {
    return { configured: true, mode: 'external' };
  }

  const hasSmtp = Boolean(env.EMAIL_USER && env.EMAIL_PASS);
  if (hasSmtp) {
    return { configured: true, mode: 'smtp' };
  }

  return { configured: false, mode: 'none' };
}

/**
 * Return true when at least one email delivery path is fully configured.
 *
 * @param {NodeJS.ProcessEnv} env Environment to read from.
 * @returns {boolean}
 */
export function isEmailConfigured(env = process.env) {
  return describeEmailConfig(env).configured;
}

/**
 * Validate email configuration for a given environment.
 *
 * In production, missing email configuration is a hard error so the
 * deployment fails fast rather than silently dropping notification email. In
 * other environments it is a soft warning and email is treated as disabled.
 *
 * @param {NodeJS.ProcessEnv} env Environment to read from.
 * @returns {{ enabled: boolean, mode: string, message: string }}
 * @throws {Error} When configuration is missing in production.
 */
export function validateEmailConfig(env = process.env) {
  const { configured, mode } = describeEmailConfig(env);

  if (configured) {
    return { enabled: true, mode, message: `Email service configured (${mode}).` };
  }

  if (env.NODE_ENV === 'production') {
    throw new Error(
      'Email service configuration is required in production. Set EMAIL_SERVICE_URL and EMAIL_API_KEY, or EMAIL_USER and EMAIL_PASS.'
    );
  }

  return {
    enabled: false,
    mode: 'none',
    message: 'Email service disabled: no credentials configured.',
  };
}

export default validateEmailConfig;
