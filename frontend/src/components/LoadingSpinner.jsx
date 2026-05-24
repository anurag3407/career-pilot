/**
 * Shared full-screen loading spinner.
 */
export default function LoadingSpinner({ message = 'Loading CareerPilot...' }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-muted border-t-primary rounded-full animate-spin" />
                <p className="text-muted-foreground font-medium">{message}</p>
            </div>
        </div>
    );
}
