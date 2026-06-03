import { BarChart3, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Seven-day checklist completion summary.
 */
export default function WeeklySummary({ weekly }) {
  if (!weekly) return null;

  return (
    <section
      className="rounded-3xl border border-border bg-card p-6 shadow-sm"
      aria-labelledby="weekly-summary-heading"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 id="weekly-summary-heading" className="text-lg font-black text-foreground flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" aria-hidden="true" />
            Weekly summary
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {weekly.totalCompleted} of {weekly.totalTasks} checklist items completed this week
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
          <BarChart3 className="w-4 h-4 text-emerald-500" aria-hidden="true" />
          <span className="tabular-nums">{weekly.averagePercent}%</span>
          <span className="text-muted-foreground font-medium">avg. completion</span>
        </div>
      </div>

      <ul className="grid grid-cols-7 gap-2" aria-label="Daily completion for the past week">
        {weekly.days.map((day) => (
          <li key={day.dateKey} className="flex flex-col items-center gap-2 min-w-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground truncate w-full text-center">
              {day.label}
            </span>
            <div
              className="w-full aspect-square max-w-[3rem] rounded-xl bg-muted border border-border flex items-end overflow-hidden"
              title={`${day.completed} of ${day.total} tasks`}
            >
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${day.percent}%` }}
                transition={{ duration: 0.5 }}
                className="w-full bg-gradient-to-t from-primary to-secondary rounded-t-lg min-h-[4px]"
                role="presentation"
              />
            </div>
            <span className="text-[10px] font-bold text-foreground tabular-nums">
              {day.completed}/{day.total}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
