import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center p-8 max-w-md">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-foreground">Something went wrong</h2>
              <p className="mb-8 text-muted-foreground">
                An unexpected error occurred. Try again or refresh the page.
              </p>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={this.handleRetry}
                  className="px-6 py-3 rounded-lg font-medium transition-all duration-300 bg-card text-foreground border border-border hover:bg-muted"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 rounded-lg font-medium transition-all duration-300 bg-primary text-primary-foreground hover:opacity-90"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
