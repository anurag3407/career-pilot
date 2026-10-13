import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

class DebugBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div
          role="alert"
          style={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            background: 'var(--background)',
            color: 'var(--destructive)',
            fontFamily: 'Inter, system-ui, sans-serif',
            padding: 24,
          }}
        >
          <div style={{ maxWidth: 640 }}>
            <h1 style={{ fontSize: 24, marginBottom: 12 }}>Something went wrong</h1>
            <p style={{ color: 'var(--muted-foreground)' }}>
              CareerPilot could not start. Please refresh the page; if the issue persists,
              contact support with the details below.
            </p>
            <pre
              style={{
                whiteSpace: 'pre-wrap',
                fontSize: 13,
                marginTop: 16,
                padding: 16,
                borderRadius: 12,
                background: 'var(--muted)',
                color: 'var(--foreground)',
              }}
            >
              {this.state.error.stack || this.state.error.message}
            </pre>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

const clerkKeyMissing = Boolean(!PUBLISHABLE_KEY)

function Root() {
  // Clerk is optional in local/build previews so the marketing site never becomes a
  // white screen. Authenticated routes still redirect to /login when no user exists.
  const app = (
    <DebugBoundary>
      <App />
    </DebugBoundary>
  )

  return PUBLISHABLE_KEY ? (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      {app}
    </ClerkProvider>
  ) : (
    app
  )
}

if (import.meta.env.DEV && clerkKeyMissing) {
  console.warn('VITE_CLERK_PUBLISHABLE_KEY is missing; running in public-preview mode.')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
)

import { registerSW } from 'virtual:pwa-register'

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  registerSW({
    immediate: true,
    onOfflineReady() {
    },
    onRegisterError(error) {
      console.error('SW registration error', error)
    },
  })
}
