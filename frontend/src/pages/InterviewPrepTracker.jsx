import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ChevronRight,
  ClipboardList,
  Flame,
  Target,
  TrendingUp,
} from 'lucide-react';
import { useInterviewPrepTracker } from '../hooks/useInterviewPrepTracker';
import { CATEGORY_IDS } from '../lib/interviewPrepTracker';
import ProgressBar from '../components/interviewPrep/ProgressBar';
import StreakTracker from '../components/interviewPrep/StreakTracker';
import WeeklySummary from '../components/interviewPrep/WeeklySummary';
import CategoryTrackerCard from '../components/interviewPrep/CategoryTrackerCard';
import DailyChecklist from '../components/interviewPrep/DailyChecklist';
import TaskSummaryPanels from '../components/interviewPrep/TaskSummaryPanels';
import { getTaskLists } from '../lib/interviewPrepTracker';

const statCards = [
  { key: 'todayProgress', label: "Today's progress", icon: Target, suffix: '%' },
  { key: 'completedCount', label: 'Completed', icon: ClipboardList, suffix: '' },
  { key: 'pendingCount', label: 'Pending', icon: TrendingUp, suffix: '' },
  { key: 'streakCurrent', label: 'Streak', icon: Flame, suffix: 'd' },
];

export default function InterviewPrepTracker() {
  const {
    state,
    stats,
    todayTasks,
    hydrated,
    toggleTask,
    incrementCategory,
    decrementCategory,
  } = useInterviewPrepTracker();

  const { completed, pending } = getTaskLists(state);

  const statValues = {
    todayProgress: stats.todayProgress,
    completedCount: stats.completedCount,
    pendingCount: stats.pendingCount,
    streakCurrent: stats.streak.current,
  };

  if (!hydrated) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-6"
          aria-label="Breadcrumb"
        >
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          <Link to="/hub/career" className="hover:text-foreground transition-colors font-medium">
            Career Growth
          </Link>
          <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="text-foreground font-semibold">Interview Prep Tracker</span>
        </motion.nav>

        <motion.header
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-10 p-8 glass rounded-3xl glow border-border/50 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-primary mb-4">
              <ClipboardList className="w-4 h-4" aria-hidden="true" />
              Preparation dashboard
            </p>
            <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight mb-2">
              Interview Preparation Tracker
            </h1>
            <p className="text-base md:text-lg text-muted-foreground font-medium max-w-2xl">
              Track DSA, aptitude, CS subjects, and mock interviews with a daily checklist, streaks, and weekly insights — saved on this device.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Looking for AI mock interviews?{' '}
              <Link to="/interview-prep" className="text-primary font-bold hover:underline">
                Open AI Interview Prep
              </Link>
            </p>
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {statCards.map(({ key, label, icon: Icon, suffix }) => (
            <div
              key={key}
              className="rounded-2xl border border-border bg-card p-5 text-center shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
              </div>
              <p className="text-2xl font-black text-foreground tabular-nums">
                {statValues[key]}
                {suffix}
              </p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                {label}
              </p>
            </div>
          ))}
        </motion.div>

        <div className="mb-8 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <ProgressBar value={stats.todayProgress} label="Overall daily completion" />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <StreakTracker streak={stats.streak} />
          <WeeklySummary weekly={stats.weekly} />
        </div>

        <section className="mb-8" aria-labelledby="category-tracking-heading">
          <h2 id="category-tracking-heading" className="text-xl font-black text-foreground mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 rounded-full bg-primary" aria-hidden="true" />
            Category tracking
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {CATEGORY_IDS.map((categoryId) => (
              <CategoryTrackerCard
                key={categoryId}
                categoryId={categoryId}
                categoryProgress={state.categoryProgress}
                onIncrement={incrementCategory}
                onDecrement={decrementCategory}
              />
            ))}
          </div>
        </section>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 mb-8">
          <DailyChecklist tasks={todayTasks} onToggle={toggleTask} />
          <div className="space-y-4">
            <TaskSummaryPanels completed={completed} pending={pending} />
            <div className="rounded-2xl border border-border bg-muted/30 p-4 text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Mock interview tip:</strong> Log a session in Mock Interviews after each practice run, then use{' '}
              <Link to="/interview-prep" className="text-primary font-bold hover:underline">
                AI Interview Prep
              </Link>{' '}
              for scored feedback and{' '}
              <Link to="/dashboard/analytics" className="text-primary font-bold hover:underline">
                Interview Analytics
              </Link>{' '}
              for trends.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
