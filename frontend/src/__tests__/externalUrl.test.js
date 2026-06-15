import { describe, expect, test } from 'vitest'
import { normalizeExternalUrl } from '../utils/externalUrl'

describe('normalizeExternalUrl', () => {
  test.each([
    ['https://example.com/project', 'https://example.com/project'],
    ['http://example.com/project', 'http://example.com/project'],
  ])('allows an HTTP(S) URL', (value, expected) => {
    expect(normalizeExternalUrl(value)).toBe(expected)
  })

  test.each([
    'javascript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'mailto:owner@example.com',
    'not a URL',
    '',
    null,
    undefined,
  ])('rejects an unsafe or invalid URL', (value) => {
    expect(normalizeExternalUrl(value)).toBeNull()
  })
})
