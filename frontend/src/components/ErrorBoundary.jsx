import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App error boundary caught an exception:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-12">
          <div className="max-w-xl w-full rounded-2xl border border-border bg-card p-8 shadow-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              Something went wrong
            </p>
            <h1 className="mt-3 text-2xl font-bold text-foreground">
              The app couldn't load completely.
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              A runtime error interrupted rendering. You can retry now, or refresh the page to reload the app from scratch.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={this.handleRetry}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90"
              >
                Retry
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted"
              >
                Refresh page
              </button>
            </div>

            <details className="mt-6">
              <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
                Technical details
              </summary>
              <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-3 text-xs text-foreground whitespace-pre-wrap">
                {String(this.state.error)}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
