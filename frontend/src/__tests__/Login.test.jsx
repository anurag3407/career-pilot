import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Login from '../pages/Login'

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    login: vi.fn(),
    signup: vi.fn(),
    loginWithGoogle: vi.fn(),
    loginWithGitHub: vi.fn(),
  }),
}))

describe('Login page', () => {
  test('renders Cloudflare D1 authentication card by default', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  test('provides link to register for new accounts', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /create one now/i })).toBeInTheDocument()
  })
})
