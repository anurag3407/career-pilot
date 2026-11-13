const MAX_EMAIL_LENGTH = 254;
const EMAIL_REGEX =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export function isValidEmail(email) {
  if (typeof email !== 'string') return false;

  const trimmed = email.trim();

  if (trimmed.length === 0 || trimmed.length > MAX_EMAIL_LENGTH) {
    return false;
  }

  return EMAIL_REGEX.test(trimmed);
}