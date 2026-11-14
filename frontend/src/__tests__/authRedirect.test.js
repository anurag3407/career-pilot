import { describe, it, expect, beforeEach } from 'vitest'
import { resolvePostAuthRedirect, storePostAuthRedirect, consumePostAuthRedirect } from '../utils/authRedirect'

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

describe('post-auth redirect storage (OAuth round-trip)', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('stores and consumes the intended destination once', () => {
    storePostAuthRedirect('/job-tracker')
    expect(consumePostAuthRedirect()).toBe('/job-tracker')
    // Consumed — a second read falls back to the dashboard.
    expect(consumePostAuthRedirect()).toBe('/dashboard')
  })

  it('defaults to the dashboard when nothing was stored', () => {
    expect(consumePostAuthRedirect()).toBe('/dashboard')
  })

  it('never stores an external destination', () => {
    storePostAuthRedirect('https://evil.example.com')
    expect(consumePostAuthRedirect()).toBe('/dashboard')
    storePostAuthRedirect('//evil.example.com')
    expect(consumePostAuthRedirect()).toBe('/dashboard')
  })
})