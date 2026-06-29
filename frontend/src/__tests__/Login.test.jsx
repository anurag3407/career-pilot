import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Login from '../pages/Login'

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    login: vi.fn(),
    loginWithGoogle: vi.fn(),
    loginWithLinkedIn: vi.fn(),
  }),
}))

vi.mock('../services/api', () => ({
  twoFactorApi: {
    verify: vi.fn(),
    verifyBackup: vi.fn(),
  },
}))

vi.mock('../components/Navbar', () => ({
    default: () => <div>Mock Navbar</div>,
  }))

describe('Login page', () => {
  test('renders sign in form', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument()
  })

  test('renders sign in button', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    expect(
      screen.getByRole('button', { name: /sign in/i })
    ).toBeInTheDocument()
  })
})