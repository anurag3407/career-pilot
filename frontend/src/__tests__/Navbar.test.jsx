import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from '../components/Navbar'

// Mock useAuth
const mockLogout = vi.fn()
const mockUser = {
  displayName: 'Test User',
  email: 'test@example.com'
}
vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: mockUser,
    logout: mockLogout
  })
}))

// Mock useTheme
const mockToggleTheme = vi.fn()
vi.mock('../hooks/useTheme', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: mockToggleTheme
  })
}))

// Mock AIProviderSelector
vi.mock('../components/AIProviderSelector', () => ({
  default: () => <div>Mock AIProviderSelector</div>
}))

describe('Navbar component dropdowns', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders Navbar and initially does not show search suggestions or user dropdown', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )

    expect(screen.queryByText('Frontend Developer')).not.toBeInTheDocument()
    expect(screen.queryByText('Profile')).not.toBeInTheDocument()
  })

  test('focusing search input opens search suggestions dropdown and closing it on blur', async () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )

    const searchInput = screen.getByPlaceholderText('Search anything...')
    
    // Focus search input
    fireEvent.focus(searchInput)
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument()

    // Blur search input
    fireEvent.blur(searchInput)
    
    // Wait for the timeout to finish
    await waitFor(() => {
      expect(screen.queryByText('Frontend Developer')).not.toBeInTheDocument()
    })
  })

  test('clicking user menu opens profile dropdown and toggles it', async () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )

    const userMenuButton = screen.getByLabelText('User menu')
    
    // Click user menu button to open profile dropdown
    fireEvent.click(userMenuButton)
    expect(screen.getByText('Profile')).toBeInTheDocument()

    // Click again to close
    fireEvent.click(userMenuButton)
    await waitFor(() => {
      expect(screen.queryByText('Profile')).not.toBeInTheDocument()
    })
  })

  test('opening profile dropdown closes search suggestions dropdown, and focusing search input closes profile dropdown', async () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )

    const searchInput = screen.getByPlaceholderText('Search anything...')
    const userMenuButton = screen.getByLabelText('User menu')

    // Focus search -> search dropdown opens
    fireEvent.focus(searchInput)
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument()
    expect(screen.queryByText('Profile')).not.toBeInTheDocument()

    // Click profile button -> search dropdown closes, profile dropdown opens
    fireEvent.click(userMenuButton)
    await waitFor(() => {
      expect(screen.queryByText('Frontend Developer')).not.toBeInTheDocument()
    })
    expect(screen.getByText('Profile')).toBeInTheDocument()

    // Focus search again -> profile dropdown closes, search dropdown opens
    fireEvent.focus(searchInput)
    await waitFor(() => {
      expect(screen.queryByText('Profile')).not.toBeInTheDocument()
    })
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument()
  })

  test('pressing Escape closes both dropdowns', async () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )

    const searchInput = screen.getByPlaceholderText('Search anything...')
    const userMenuButton = screen.getByLabelText('User menu')

    // Focus search -> search dropdown opens
    fireEvent.focus(searchInput)
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument()

    // Press Escape
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })
    await waitFor(() => {
      expect(screen.queryByText('Frontend Developer')).not.toBeInTheDocument()
    })

    // Click profile button -> profile dropdown opens
    fireEvent.click(userMenuButton)
    expect(screen.getByText('Profile')).toBeInTheDocument()

    // Press Escape
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })
    await waitFor(() => {
      expect(screen.queryByText('Profile')).not.toBeInTheDocument()
    })
  })

  test('tabbing from search input to suggestion button keeps dropdown open, and tabbing out closes it', async () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    )

    const searchInput = screen.getByPlaceholderText('Search anything...')
    
    // Focus search -> search dropdown opens
    fireEvent.focus(searchInput)
    const suggestionButton = screen.getByText('Frontend Developer')
    expect(suggestionButton).toBeInTheDocument()

    // Move focus to the suggestion button (simulating Tab key)
    fireEvent.blur(searchInput, { relatedTarget: suggestionButton })
    fireEvent.focus(suggestionButton)

    // Suggestion dropdown should still be open
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument()

    // Tab out of the suggestion button to document body or somewhere outside
    const outsideElement = document.createElement('button')
    document.body.appendChild(outsideElement)
    fireEvent.blur(suggestionButton, { relatedTarget: outsideElement })
    
    await waitFor(() => {
      expect(screen.queryByText('Frontend Developer')).not.toBeInTheDocument()
    })
    document.body.removeChild(outsideElement)
  })
})
