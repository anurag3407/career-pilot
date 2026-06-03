import { Minus, Plus } from 'lucide-react';
import { CATEGORY_META, getCategoryProgressPercent } from '../../lib/interviewPrepTracker';
import ProgressBar from './ProgressBar';

/**
 * Tracks session count for a single preparation category.
 */
export default function CategoryTrackerCard({
  categoryId,
  categoryProgress,
  onIncrement,
  onDecrement,
}) {
  const meta = CATEGORY_META[categoryId];
  const sessions = categoryProgress[categoryId]?.sessionsCompleted ?? 0;
  const percent = getCategoryProgressPercent(categoryProgress, categoryId);

  return (
    <article className="rounded-2xl border border-border bg-card p-5 hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-black text-foreground">{meta.label}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{meta.description}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onDecrement(categoryId)}
            disabled={sessions <= 0}
            className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label={`Decrease ${meta.label} sessions`}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="min-w-[2rem] text-center font-black text-foreground tabular-nums" aria-live="polite">
            {sessions}
          </span>
          <button
            type="button"
            onClick={() => onIncrement(categoryId)}
            className="p-2 rounded-lg border border-border text-primary hover:bg-primary/10 transition-colors"
            aria-label={`Increase ${meta.label} sessions`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      <ProgressBar value={percent} label="Goal progress (30 sessions)" barClassName="bg-gradient-to-r from-emerald-500 to-primary" />
    </article>
  );
}
