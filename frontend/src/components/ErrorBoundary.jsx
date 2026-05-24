import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * Global Error Boundary — catches unhandled React render errors and displays
 * a branded fallback UI instead of a blank white screen.
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    handleGoHome = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-background px-4">
                    <div className="max-w-md w-full text-center">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
                            <AlertTriangle className="w-10 h-10 text-destructive" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">Something went wrong</h1>
                        <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                            An unexpected error occurred. You can try refreshing the page or going back to the homepage.
                        </p>
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="mb-6 p-4 rounded-xl bg-muted border border-border text-left">
                                <p className="text-xs font-mono text-destructive break-all">{this.state.error.toString()}</p>
                            </div>
                        )}
                        <div className="flex items-center justify-center gap-3">
                            <button onClick={this.handleReset} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
                                <RefreshCw className="w-4 h-4" /> Try Again
                            </button>
                            <button onClick={this.handleGoHome} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-muted text-foreground font-semibold text-sm border border-border hover:bg-muted/80 transition-colors">
                                <Home className="w-4 h-4" /> Go Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
