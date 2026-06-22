import { Component } from 'react';

/**
 * ErrorBoundary catches unhandled JavaScript errors in any child component
 * tree and displays a friendly fallback UI instead of crashing the entire app.
 *
 * Usage:
 *   <ErrorBoundary>
 *     <SomeFeaturePage />
 *   </ErrorBoundary>
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging / future monitoring integration (e.g. Sentry).
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '1rem',
            padding: '2rem',
            background: 'var(--background, #0f0f0f)',
            color: 'var(--foreground, #f5f5f5)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '3rem' }}>⚠️</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
            Something went wrong
          </h2>
          <p style={{ color: 'var(--muted-foreground, #888)', maxWidth: '480px', margin: 0 }}>
            An unexpected error occurred. This is usually caused by a temporary
            network or API issue. Your data has been preserved — try refreshing or
            going back.
          </p>

          {/* Show error message in development only */}
          {import.meta.env.DEV && this.state.error && (
            <pre
              style={{
                background: 'var(--card, #1a1a1a)',
                border: '1px solid var(--border, #333)',
                borderRadius: '0.5rem',
                padding: '1rem',
                fontSize: '0.75rem',
                textAlign: 'left',
                maxWidth: '600px',
                overflowX: 'auto',
                color: '#ef4444',
              }}
            >
              {this.state.error.toString()}
            </pre>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={this.handleReset}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '0.5rem',
                border: 'none',
                background: 'var(--primary, #6366f1)',
                color: '#fff',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.assign('/dashboard')}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border, #333)',
                background: 'transparent',
                color: 'var(--foreground, #f5f5f5)',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
