import { CheckCircle2, Circle } from 'lucide-react';
import { CATEGORY_META } from '../../lib/interviewPrepTracker';

/**
 * Today's preparation checklist with accessible toggles.
 */
export default function DailyChecklist({ tasks, onToggle }) {
  return (
    <section
      className="rounded-3xl border border-border bg-card p-6 shadow-sm"
      aria-labelledby="daily-checklist-heading"
    >
      <h2 id="daily-checklist-heading" className="text-lg font-black text-foreground mb-1">
        Daily preparation checklist
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Check off items as you complete them today. Progress saves automatically.
      </p>

      <ul className="space-y-3" role="list">
        {tasks.map((task) => {
          const categoryLabel = CATEGORY_META[task.category]?.label ?? task.category;
          return (
            <li key={task.id}>
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-colors ${
                  task.completed
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-muted/30 border-border hover:border-primary/30'
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={task.completed}
                  onChange={() => onToggle(task.id)}
                />
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" aria-hidden="true" />
                )}
                <span className="flex-1 min-w-0">
                  <span className={`block text-sm font-bold ${task.completed ? 'text-foreground line-through opacity-80' : 'text-foreground'}`}>
                    {task.label}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1 inline-block">
                    {categoryLabel}
                  </span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
