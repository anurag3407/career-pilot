import { describe, expect, test } from 'vitest'
import {
  MAX_EMAIL_LENGTH,
  sanitizeRecruiterEmail,
  isValidRecruiterEmail,
  buildSafeMailtoUrl,
  isSafeHttpUrl,
} from '../utils/emailCheck'

describe('sanitizeRecruiterEmail', () => {
  test('returns a trimmed email', () => {
    expect(sanitizeRecruiterEmail('  jobs@startup.com  ')).toBe('jobs@startup.com')
  })

  test('strips injected query parameters', () => {
    expect(
      sanitizeRecruiterEmail('recruiter@co.com?cc=attacker@evil.com')
    ).toBe('recruiter@co.com')

    expect(
      sanitizeRecruiterEmail('recruiter@co.com#fragment')
    ).toBe('recruiter@co.com')
  })

  test('preserves question marks in the local part', () => {
    expect(
      sanitizeRecruiterEmail('dev?jobs@company.com')
    ).toBe('dev?jobs@company.com')
  })

  test('does not modify long email addresses', () => {
    const longLocal = 'a'.repeat(MAX_EMAIL_LENGTH)
    const email = `${longLocal}@example.com`

    expect(sanitizeRecruiterEmail(email)).toBe(email)
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

  test('rejects email longer than MAX_EMAIL_LENGTH', () => {
    const longEmail = `${'a'.repeat(MAX_EMAIL_LENGTH)}@example.com`

    expect(isValidRecruiterEmail(longEmail)).toBe(false)
  })

  test('accepts address after stripping injected query parameters', () => {
    expect(
      isValidRecruiterEmail('recruiter@co.com?cc=attacker@evil.com')
    ).toBe(true)

    expect(
      sanitizeRecruiterEmail('recruiter@co.com?cc=attacker@evil.com')
    ).toBe('recruiter@co.com')
  })
})

describe('buildSafeMailtoUrl', () => {
  test('builds a mailto link with encoded subject', () => {
    expect(
      buildSafeMailtoUrl('jobs@startup.com', {
        subject: 'Application for Engineer',
      })
    ).toBe('mailto:jobs@startup.com?subject=Application+for+Engineer')
  })

  test('returns null for invalid email', () => {
    expect(
      buildSafeMailtoUrl('bad-address', {
        subject: 'Hi',
      })
    ).toBeNull()
  })

  test('ignores injected cc parameters from raw input', () => {
    const url = buildSafeMailtoUrl(
      'recruiter@co.com?cc=attacker@evil.com',
      {
        subject: 'Hello',
      }
    )

    expect(url).toBe('mailto:recruiter@co.com?subject=Hello')
    expect(url).not.toContain('attacker@evil.com')
  })
})

describe('isSafeHttpUrl', () => {
  test('accepts http and https URLs', () => {
    expect(isSafeHttpUrl('https://example.com')).toBe(true)
    expect(isSafeHttpUrl('http://example.com')).toBe(true)
  })

  test('rejects unsafe schemes', () => {
    expect(isSafeHttpUrl('javascript:alert(1)')).toBe(false)
    expect(isSafeHttpUrl('data:text/html,test')).toBe(false)
    expect(isSafeHttpUrl('ftp://example.com')).toBe(false)
  })

  test('rejects invalid URLs', () => {
    expect(isSafeHttpUrl('not-a-url')).toBe(false)
    expect(isSafeHttpUrl('')).toBe(false)
    expect(isSafeHttpUrl(null)).toBe(false)
  })
})