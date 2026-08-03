import '@testing-library/jest-dom'
import { vi } from 'vitest'

vi.mock('@clerk/clerk-react', () => ({
  useUser: () => ({
    isLoaded: true,
    isSignedIn: true,
    user: {
      id: 'test-user-123',
      fullName: 'Test User',
      primaryEmailAddress: { emailAddress: 'test@example.com' },
      imageUrl: 'https://example.com/avatar.jpg'
    }
  }),
  useAuth: () => ({
    isLoaded: true,
    isSignedIn: true,
    userId: 'test-user-123',
    getToken: async () => 'mock-clerk-token',
    signOut: async () => {}
  }),
  useClerk: () => ({
    redirectToSignIn: vi.fn(),
    redirectToSignUp: vi.fn(),
    signOut: vi.fn()
  }),
  ClerkProvider: ({ children }) => children,
  SignedIn: ({ children }) => children,
  SignedOut: () => null,
  UserButton: () => <div>UserButton</div>,
  SignIn: () => (
    <div>
      <h1>Welcome back</h1>
      <input placeholder="you@example.com" />
      <input placeholder="••••••••" />
      <button>Sign in</button>
    </div>
  ),
  SignUp: () => <div>SignUp Component</div>
}))
