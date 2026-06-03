import { CheckCircle2, ListTodo } from 'lucide-react';
import { CATEGORY_META } from '../../lib/interviewPrepTracker';

function TaskList({ title, icon: Icon, tasks, emptyMessage, accentClass }) {
  return (
    <div className={`rounded-2xl border p-5 ${accentClass}`}>
      <h3 className="text-sm font-black text-foreground flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4" aria-hidden="true" />
        {title}
        <span className="ml-auto text-xs font-bold text-muted-foreground tabular-nums">
          {tasks.length}
        </span>
      </h3>
      {tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      ) : (
        <ul className="space-y-2" role="list">
          {tasks.map((task) => (
            <li key={task.id} className="text-sm text-foreground font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 shrink-0" />
              <span className="flex-1">{task.label}</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {CATEGORY_META[task.category]?.label}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Completed vs pending task lists for today.
 */
export default function TaskSummaryPanels({ completed, pending }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <TaskList
        title="Completed today"
        icon={CheckCircle2}
        tasks={completed}
        emptyMessage="No items completed yet — start with your checklist above."
        accentClass="border-emerald-500/20 bg-emerald-500/5"
      />
      <TaskList
        title="Pending today"
        icon={ListTodo}
        tasks={pending}
        emptyMessage="You’re all caught up for today. Great work!"
        accentClass="border-amber-500/20 bg-amber-500/5"
      />
    </div>
  );
}
