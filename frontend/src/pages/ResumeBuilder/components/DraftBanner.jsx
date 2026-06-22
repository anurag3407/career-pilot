import { X } from 'lucide-react'

export default function DraftBanner({ onRestore, onDismiss }) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
      <p className="text-sm text-foreground">
        We found a saved draft from your last session. Want to pick up where you left off?
      </p>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onRestore}
          className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Restore draft
        </button>
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
