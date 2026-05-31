import React from 'react';

class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error('RouteErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 text-white p-8 flex flex-col items-center justify-center">
          <div className="max-w-2xl w-full bg-zinc-900 border border-red-500/30 rounded-2xl p-8 shadow-2xl">
            <h1 className="text-3xl font-bold text-red-400 mb-4">💥 Something went wrong</h1>
            <p className="text-zinc-400 mb-6">The templates page crashed while rendering. Check the details below:</p>
            
            <div className="bg-zinc-950 rounded-xl p-4 mb-4 overflow-auto">
              <h2 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-2">Error</h2>
              <pre className="text-red-300 text-sm font-mono whitespace-pre-wrap">{this.state.error?.toString()}</pre>
            </div>
            
            <div className="bg-zinc-950 rounded-xl p-4 overflow-auto">
              <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-2">Component Stack</h2>
              <pre className="text-amber-300 text-xs font-mono whitespace-pre-wrap">{this.state.errorInfo?.componentStack}</pre>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default RouteErrorBoundary;
