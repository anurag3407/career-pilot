import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Login from '../pages/Login'

jest.mock('firebase/auth', () => ({
  sendPasswordResetEmail: jest.fn(),
}))

jest.mock('../config/firebase', () => ({
  auth: {},
}))

jest.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    login: jest.fn(),
    loginWithGoogle: jest.fn(),
    loginWithLinkedIn: jest.fn(),
  }),
}))

jest.mock('../services/api', () => ({
  twoFactorApi: {
    verify: jest.fn(),
    verifyBackup: jest.fn(),
  },
}))

jest.mock('../components/Navbar', () => ({
  __esModule: true,
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