import { describe, expect, test } from 'vitest'
import {
  MAX_EMAIL_LENGTH,
  sanitizeRecruiterEmail,
  isValidRecruiterEmail,
  buildSafeMailtoUrl,
} from '../utils/emailCheck'

describe('sanitizeRecruiterEmail', () => {
  test('returns a trimmed email', () => {
    expect(sanitizeRecruiterEmail('  jobs@startup.com  ')).toBe('jobs@startup.com')
  })

  test('strips injected query parameters', () => {
    expect(sanitizeRecruiterEmail('recruiter@co.com?cc=attacker@evil.com')).toBe('recruiter@co.com')
    expect(sanitizeRecruiterEmail('recruiter@co.com&body=phish')).toBe('recruiter@co.com')
  })

  test('caps length at MAX_EMAIL_LENGTH', () => {
    const longLocal = 'a'.repeat(MAX_EMAIL_LENGTH)
    expect(sanitizeRecruiterEmail(`${longLocal}@example.com`).length).toBe(MAX_EMAIL_LENGTH)
  })
})

describe('isValidRecruiterEmail', () => {
  test('accepts valid addresses', () => {
    expect(isValidRecruiterEmail('jobs@startup.com')).toBe(true)
  })

  test('rejects invalid addresses', () => {
    expect(isValidRecruiterEmail('not-an-email')).toBe(false)
    expect(isValidRecruiterEmail('')).toBe(false)
    expect(isValidRecruiterEmail(null)).toBe(false)
  })

  test('accepts address after stripping injected query parameters', () => {
    expect(isValidRecruiterEmail('recruiter@co.com?cc=attacker@evil.com')).toBe(true)
    expect(sanitizeRecruiterEmail('recruiter@co.com?cc=attacker@evil.com')).toBe('recruiter@co.com')
  })
})

describe('buildSafeMailtoUrl', () => {
  test('builds a mailto link with encoded subject', () => {
    expect(buildSafeMailtoUrl('jobs@startup.com', { subject: 'Application for Engineer' }))
      .toBe('mailto:jobs@startup.com?subject=Application+for+Engineer')
  })

  test('returns null for invalid email', () => {
    expect(buildSafeMailtoUrl('bad-address', { subject: 'Hi' })).toBeNull()
  })

  test('ignores injected cc parameters from raw input', () => {
    const url = buildSafeMailtoUrl('recruiter@co.com?cc=attacker@evil.com', { subject: 'Hello' })
    expect(url).toBe('mailto:recruiter@co.com?subject=Hello')
    expect(url).not.toContain('attacker@evil.com')
  })
})
