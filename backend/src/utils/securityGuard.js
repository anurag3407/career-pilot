/**
 * Security guard to prevent accidental deployment of development authentication bypass.
 * Throws a fatal error if development auth bypass is enabled in a production environment.
 */
export const checkDevAuthBypassGuard = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const hasLegacyEnvFlag = process.env.DEV_BYPASS_AUTH === 'true';
  const hasCliFlag = process.argv.includes('--dev-bypass-auth');

  if (isProduction && (hasLegacyEnvFlag || hasCliFlag)) {
    throw new Error('FATAL: Dev auth bypass is enabled in production environment! Refusing to start.');
  }
};
