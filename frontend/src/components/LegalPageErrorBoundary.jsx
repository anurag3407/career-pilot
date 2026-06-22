import { Component } from 'react';

export default class LegalPageErrorBoundary extends Component {
    state = { failed: false };

    static getDerivedStateFromError() {
        return { failed: true };
    }

    render() {
        if (this.state.failed) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-background">
                    <p className="text-muted-foreground text-sm font-medium">
                        This page could not be loaded. Please disable your ad-blocker and try again.
                    </p>
                </div>
            );
        }
        return this.props.children;
    }
}
