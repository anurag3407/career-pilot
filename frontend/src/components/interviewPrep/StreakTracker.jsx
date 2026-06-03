import { Flame, Trophy } from 'lucide-react';
import Badge from '../Badge';

/**
 * Displays current and longest preparation streaks.
 */
export default function StreakTracker({ streak }) {
  const current = streak?.current ?? 0;
  const longest = streak?.longest ?? 0;

  return (
    <section
      className="rounded-3xl border border-border bg-card p-6 shadow-sm"
      aria-labelledby="streak-heading"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h2 id="streak-heading" className="text-lg font-black text-foreground flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" aria-hidden="true" />
            Learning streak
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Complete at least one daily checklist item to keep your streak alive.
          </p>
        </div>
        <Badge variant="warning" dot>
          {current} day{current === 1 ? '' : 's'}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 text-center">
          <p className="text-3xl font-black text-amber-500 tabular-nums">{current}</p>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
            Current streak
          </p>
        </div>
        <div className="rounded-2xl bg-primary/10 border border-primary/20 p-4 text-center">
          <p className="text-3xl font-black text-primary tabular-nums flex items-center justify-center gap-1">
            <Trophy className="w-6 h-6" aria-hidden="true" />
            {longest}
          </p>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
            Best streak
          </p>
        </div>
      </div>
    </section>
  );
}
