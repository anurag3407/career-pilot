import { describe, it, expect } from 'vitest'
import { resolvePostAuthRedirect } from '../utils/authRedirect'

describe('resolvePostAuthRedirect', () => {
  it('returns the stored internal path', () => {
    expect(resolvePostAuthRedirect('/job-tracker?stage=applied')).toBe('/job-tracker?stage=applied')
  })

  it('falls back to the dashboard when nothing is stored', () => {
    expect(resolvePostAuthRedirect(undefined)).toBe('/dashboard')
    expect(resolvePostAuthRedirect(null)).toBe('/dashboard')
    expect(resolvePostAuthRedirect('')).toBe('/dashboard')
  })

  it('rejects absolute external URLs', () => {
    expect(resolvePostAuthRedirect('https://evil.example.com/steal')).toBe('/dashboard')
    expect(resolvePostAuthRedirect('http://evil.example.com')).toBe('/dashboard')
  })

  it('rejects protocol-relative URLs', () => {
    expect(resolvePostAuthRedirect('//evil.example.com')).toBe('/dashboard')
  })

  it('rejects non-string values', () => {
    expect(resolvePostAuthRedirect(42)).toBe('/dashboard')
    expect(resolvePostAuthRedirect({ path: '/dashboard' })).toBe('/dashboard')
    expect(resolvePostAuthRedirect(['/dashboard'])).toBe('/dashboard')
  })
})