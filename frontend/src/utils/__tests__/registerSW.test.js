import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'
import { registerServiceWorker, setupServiceWorker } from '../registerSW'

describe('registerServiceWorker', () => {
  let originalSW

  beforeEach(() => {
    originalSW = Object.getOwnPropertyDescriptor(navigator, 'serviceWorker')
    vi.restoreAllMocks()
  })

  afterEach(() => {
    if (originalSW) {
      Object.defineProperty(navigator, 'serviceWorker', originalSW)
    } else {
      delete navigator.serviceWorker
    }
  })

  function mockServiceWorker(register) {
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: { register },
    })
  }

  test('registers /sw.js when forced and API available', async () => {
    const fakeReg = { scope: '/' }
    const register = vi.fn().mockResolvedValue(fakeReg)
    mockServiceWorker(register)

    const result = await registerServiceWorker({ force: true })

    expect(register).toHaveBeenCalledWith('/sw.js')
    expect(result).toBe(fakeReg)
  })

  test('returns null when serviceWorker API is unavailable', async () => {
    if (originalSW) delete navigator.serviceWorker

    const result = await registerServiceWorker({ force: true })

    expect(result).toBeNull()
  })

  test('skips registration outside production when not forced', async () => {
    const register = vi.fn().mockResolvedValue({})
    mockServiceWorker(register)

    // import.meta.env.PROD is false under vitest, force defaults to false.
    const result = await registerServiceWorker()

    expect(register).not.toHaveBeenCalled()
    expect(result).toBeNull()
  })

  test('returns null and does not throw when registration rejects', async () => {
    const register = vi.fn().mockRejectedValue(new Error('boom'))
    mockServiceWorker(register)
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const result = await registerServiceWorker({ force: true })

    expect(result).toBeNull()
    expect(errSpy).toHaveBeenCalled()
  })
})

describe('setupServiceWorker', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('registers on window load event', () => {
    const register = vi.fn().mockResolvedValue({})
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: { register },
    })
    const addSpy = vi.spyOn(window, 'addEventListener')

    setupServiceWorker({ force: true })

    expect(addSpy).toHaveBeenCalledWith('load', expect.any(Function))

    // Fire the captured load handler and confirm it triggers registration.
    const handler = addSpy.mock.calls.find((c) => c[0] === 'load')[1]
    handler()
    expect(register).toHaveBeenCalledWith('/sw.js')
  })
})
