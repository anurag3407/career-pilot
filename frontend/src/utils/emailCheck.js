/** RFC 5321 maximum email address length */
export const MAX_EMAIL_LENGTH = 254

const RECRUITER_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Strip query-string injection from API-provided recruiter emails
 * (e.g. "recruiter@co.com?cc=attacker@evil.com").
 */
export function sanitizeRecruiterEmail(raw) {
  if (!raw || typeof raw !== 'string') return ''
  const cleaned = raw.trim().split(/[?&#]/)[0].trim()
  if (!cleaned) return ''
  return cleaned.length <= MAX_EMAIL_LENGTH ? cleaned : cleaned.slice(0, MAX_EMAIL_LENGTH)
}

export function isValidRecruiterEmail(email) {
  const sanitized = sanitizeRecruiterEmail(email)
  if (!sanitized) return false
  return RECRUITER_EMAIL_REGEX.test(sanitized)
}

/**
 * Build a safe mailto URL with validated recipient and encoded query params.
 * Returns null when the email is invalid.
 */
export function buildSafeMailtoUrl(email, { subject = '', body = '' } = {}) {
  const sanitized = sanitizeRecruiterEmail(email)
  if (!isValidRecruiterEmail(sanitized)) return null

  const params = new URLSearchParams()
  if (subject) params.set('subject', subject)
  if (body) params.set('body', body)

  const query = params.toString()
  return query ? `mailto:${sanitized}?${query}` : `mailto:${sanitized}`
}
