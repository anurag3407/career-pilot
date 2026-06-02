import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import CommandPalette from '../components/CommandPalette'

const { navigateMock, toastSuccessMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  toastSuccessMock: vi.fn(),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')

  return {
    ...actual,
    useNavigate: () => navigateMock,
  }
})

vi.mock('react-hot-toast', () => ({
  default: {
    success: toastSuccessMock,
  },
}))

describe('CommandPalette', () => {
  beforeEach(() => {
    localStorage.clear()
    navigateMock.mockReset()
    toastSuccessMock.mockReset()
  })

  test('searches by description and opens the selected command with Enter', async () => {
    const setIsOpen = vi.fn()

    render(<CommandPalette isOpen={true} setIsOpen={setIsOpen} />)

    const input = screen.getByPlaceholderText('Search commands...')
    fireEvent.change(input, { target: { value: 'repo insights' } })

    expect(
      screen.getByText('Analyze Repository')
    ).toBeInTheDocument()

    fireEvent.keyDown(window, { key: 'Enter' })

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith('/profile')
      expect(toastSuccessMock).toHaveBeenCalledWith('Opening Analyze Repository')
      expect(setIsOpen).toHaveBeenCalledWith(false)
    })
  })

  test('keeps both recent selections when commands are chosen rapidly', async () => {
    const setIsOpen = vi.fn()

    render(<CommandPalette isOpen={true} setIsOpen={setIsOpen} />)

    fireEvent.click(screen.getByRole('button', { name: /Create Portfolio/i }))
    fireEvent.click(screen.getByRole('button', { name: /Connect GitHub/i }))

    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem('recentCommands'))).toEqual([
        {
          id: 2,
          title: 'Connect GitHub',
          description: 'Link your GitHub account',
          path: '/profile',
        },
        {
          id: 1,
          title: 'Create Portfolio',
          description: 'Build and manage your portfolio',
          path: '/profile',
        },
      ])
    })
  })
})
