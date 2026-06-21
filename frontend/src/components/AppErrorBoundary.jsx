import React from 'react';

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, retryCount: 0 };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('AppErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    window.stop(); // Cancel existing in-flight fetches cleanly
    this.setState(prev => ({
      hasError: false,
      error: null,
      retryCount: prev.retryCount + 1
    }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-8">
          <div className="max-w-md w-full text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h1>
            <p className="text-zinc-400 mb-6">
              The application encountered an unexpected error. Please try refreshing the page.
            </p>
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-white transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return <React.Fragment key={this.state.retryCount}>{this.props.children}</React.Fragment>;
  }
}

export default AppErrorBoundary;