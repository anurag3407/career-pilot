import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import SupabaseAuthCard from '../components/auth/SupabaseAuthCard'

const mockLogin = vi.fn().mockResolvedValue({ data: { session: { access_token: 'test-token' } } })
const mockSignup = vi.fn().mockResolvedValue({ data: { session: { access_token: 'test-token' } } })
const mockLoginWithGoogle = vi.fn().mockResolvedValue({})
const mockLoginWithGitHub = vi.fn().mockResolvedValue({})

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    login: mockLogin,
    signup: mockSignup,
    loginWithGoogle: mockLoginWithGoogle,
    loginWithGitHub: mockLoginWithGitHub,
  }),
}))

describe('SupabaseAuthCard component', () => {
  test('renders login mode with email, password, and social buttons', () => {
    render(
      <MemoryRouter>
        <SupabaseAuthCard mode="login" />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /github/i })).toBeInTheDocument()
  })

  test('submits login credentials correctly', async () => {
    render(
      <MemoryRouter>
        <SupabaseAuthCard mode="login" />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
      target: { value: 'user@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: 'secret123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('user@example.com', 'secret123')
    })
  })

  test('renders register mode with name, email, and password', () => {
    render(
      <MemoryRouter>
        <SupabaseAuthCard mode="register" />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: /create your account/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/jane doe/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  test('submits registration data correctly', async () => {
    render(
      <MemoryRouter>
        <SupabaseAuthCard mode="register" />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByPlaceholderText(/jane doe/i), {
      target: { value: 'Jane Developer' },
    })
    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
      target: { value: 'jane@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), {
      target: { value: 'supersecret' },
    })

    fireEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith('jane@example.com', 'supersecret', {
        full_name: 'Jane Developer',
      })
    })
  })
})
