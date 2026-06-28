/** RFC 5321 maximum email address length */
export const MAX_EMAIL_LENGTH = 254;

const RECRUITER_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Removes query/fragment injection while preserving
 * the original email address.
 */
export function sanitizeRecruiterEmail(raw) {
  if (typeof raw !== 'string') return '';

  return raw
    .trim()
    .split(/[?#]/)[0]
    .trim();
}

/**
 * Validates a recruiter email after sanitization.
 *
 * @param {string} email
 * @returns {boolean}
 */
export function isValidRecruiterEmail(email) {
  const sanitized = sanitizeRecruiterEmail(email);

  if (!sanitized) return false;

  if (sanitized.length > MAX_EMAIL_LENGTH) {
    return false;
  }

  return RECRUITER_EMAIL_REGEX.test(sanitized);
}

/**
 * Build a safe mailto URL with validated recipient and encoded query params.
 * Returns null when the email is invalid.
 */
export function buildSafeMailtoUrl(email, { subject = '', body = '' } = {}) {
  if (!isValidRecruiterEmail(email)) return null;

  const sanitized = sanitizeRecruiterEmail(email);

  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);

  const query = params.toString();

  return query ? `mailto:${sanitized}?${query}` : `mailto:${sanitized}`;
}

/**
 * Returns true only for valid HTTP/HTTPS URLs.
 *
 * @param {string} url
 * @returns {boolean}
 */
export function isSafeHttpUrl(url) {
  if (!url || typeof url !== "string") return false;

  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}