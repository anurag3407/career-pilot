import { describe, it, expect } from 'vitest'
import { validateLinkedIn } from '../utils/resumeValidation'

describe('validateLinkedIn', () => {
  it('accepts a URL without the www. subdomain', () => {
    expect(validateLinkedIn('https://linkedin.com/in/john-doe')).toBe('')
  })

  it('accepts a URL with the www. subdomain', () => {
    expect(validateLinkedIn('https://www.linkedin.com/in/john-doe')).toBe('')
  })

  it('treats an empty value as valid (optional field)', () => {
    expect(validateLinkedIn('')).toBe('')
    expect(validateLinkedIn('   ')).toBe('')
  })

  it('rejects a non-LinkedIn URL', () => {
    expect(validateLinkedIn('https://example.com/in/john')).not.toBe('')
  })

  it('rejects a LinkedIn URL with an empty/too-short profile path', () => {
    expect(validateLinkedIn('https://linkedin.com/in/')).not.toBe('')
    expect(validateLinkedIn('https://www.linkedin.com/in/a')).not.toBe('')
  })

  it('trims surrounding whitespace before validating', () => {
    expect(validateLinkedIn('  https://linkedin.com/in/john-doe  ')).toBe('')
  })
})
