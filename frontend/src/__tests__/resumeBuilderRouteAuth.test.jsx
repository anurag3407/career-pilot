import { describe, test, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from '../App'
import ResumeBuilder from '../pages/ResumeBuilder'

/**
 * The resume builder lives behind <ProtectedRoute>, so this exercises the guard
 * itself: a signed-out visitor must be redirected, and a signed-in user must
 * actually get the builder mounted inside the app shell.
 */

const authState = vi.hoisted(() => ({ current: { user: null, loading: false } }))

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => authState.current,
}))

vi.mock('../components/AppLayout', () => ({
  default: ({ children }) => <div data-testid="app-layout">{children}</div>,
}))

function renderRoute() {
  return render(
    <MemoryRouter initialEntries={['/resume-builder/build']}>
      <Routes>
        <Route
          path="/resume-builder/build"
          element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>}
        />
        <Route path="/login" element={<div>SIGN IN SCREEN</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('ResumeBuilder route — auth guard', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('signed-out visitor is redirected to the login screen', () => {
    authState.current = { user: null, loading: false }
    renderRoute()
    expect(screen.getByText('SIGN IN SCREEN')).toBeTruthy()
  })

  test('signed-in user gets the builder inside the app shell', () => {
    authState.current = { user: { id: 'user-1', email: 'ada@analytical.org' }, loading: false }
    renderRoute()
    expect(screen.getByTestId('app-layout')).toBeTruthy()
    expect(screen.getByText(/Resume Studio/i)).toBeTruthy()
    expect(screen.getByRole('button', { name: /Inline Editor/i })).toBeTruthy()
  })
})
