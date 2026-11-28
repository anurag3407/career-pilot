import { describe, it, expect, vi, beforeEach } from 'vitest'

const ioMock = vi.fn()
vi.mock('socket.io-client', () => ({
  io: (...args) => ioMock(...args),
}))

describe('socket service', () => {
  beforeEach(() => {
    vi.resetModules()
    ioMock.mockReset()
  })

  it('does not attempt a localhost Socket.IO connection when VITE_API_URL and VITE_SOCKET_URL are unset', async () => {
    const { initializeSocket, getSocket } = await import('../services/socket')
    const result = await initializeSocket()
    expect(result).toBeNull()
    expect(getSocket()).toBeNull()
    expect(ioMock).not.toHaveBeenCalled()
  })
})
