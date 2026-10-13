import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Login from '../pages/Login'

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
  }),
}))

vi.mock('../components/Navbar', () => ({
  default: () => <div>Mock Navbar</div>,
}))

describe('Login page', () => {
  test('renders a safe preview state when Clerk is not configured', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument()
    expect(screen.getByText(/authentication is not configured/i)).toBeInTheDocument()
  })

  test('keeps users in the product flow with template and home links', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /browse templates/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /back to home/i })).toBeInTheDocument()
  })
})
