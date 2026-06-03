/**
 * Local persistence and derived metrics for the Interview Preparation Tracker.
 * @module interviewPrepTracker
 */

export const INTERVIEW_PREP_STORAGE_KEY = 'careerpilot_interview_prep_tracker_v1';

export const TRACKER_VERSION = 1;

export const CATEGORY_IDS = ['dsa', 'aptitude', 'csSubjects', 'mockInterview'];

export const CATEGORY_META = {
  dsa: { label: 'DSA', description: 'Data structures & algorithms practice' },
  aptitude: { label: 'Aptitude', description: 'Quantitative & logical reasoning' },
  csSubjects: { label: 'CS Subjects', description: 'OS, DBMS, CN, OOP, etc.' },
  mockInterview: { label: 'Mock Interviews', description: 'Timed mock sessions & reviews' },
};

const DEFAULT_DAILY_TASKS = [
  { id: 'daily-review-notes', label: 'Review yesterday’s notes', category: 'csSubjects' },
  { id: 'daily-dsa-problem', label: 'Solve at least 1 DSA problem', category: 'dsa' },
  { id: 'daily-aptitude-set', label: 'Complete an aptitude practice set', category: 'aptitude' },
  { id: 'daily-cs-revision', label: 'Revise one CS core subject topic', category: 'csSubjects' },
  { id: 'daily-mock-prep', label: 'Practice behavioral / HR answers', category: 'mockInterview' },
];

function emptyCategoryProgress() {
  return CATEGORY_IDS.reduce((acc, id) => {
    acc[id] = { sessionsCompleted: 0, minutesSpent: 0 };
    return acc;
  }, {});
}

export function createDefaultState() {
  const today = getTodayKey();
  return {
    version: TRACKER_VERSION,
    categoryProgress: emptyCategoryProgress(),
    days: {
      [today]: buildDayRecord(today),
    },
    streak: { current: 0, longest: 0, lastActiveDate: null },
  };
}

function buildDayRecord(dateKey) {
  return {
    date: dateKey,
    tasks: DEFAULT_DAILY_TASKS.map((task) => ({
      ...task,
      completed: false,
      completedAt: null,
    })),
  };
}

/** @returns {string} YYYY-MM-DD in local timezone */
export function getTodayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseDateKey(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function addDays(dateKey, delta) {
  const next = parseDateKey(dateKey);
  next.setDate(next.getDate() + delta);
  return getTodayKey(next);
}

function migrateState(raw) {
  if (!raw || typeof raw !== 'object') return createDefaultState();
  if (raw.version !== TRACKER_VERSION) {
    return { ...createDefaultState(), ...raw, version: TRACKER_VERSION };
  }
  return raw;
}

export function loadTrackerState() {
  if (typeof window === 'undefined') return createDefaultState();
  try {
    const stored = window.localStorage.getItem(INTERVIEW_PREP_STORAGE_KEY);
    if (!stored) return createDefaultState();
    return ensureToday(migrateState(JSON.parse(stored)));
  } catch {
    return createDefaultState();
  }
}

export function saveTrackerState(state) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(INTERVIEW_PREP_STORAGE_KEY, JSON.stringify(state));
}

/** Ensures today exists in days map and prunes records older than 90 days. */
export function ensureToday(state) {
  const today = getTodayKey();
  const days = { ...state.days };

  if (!days[today]) {
    days[today] = buildDayRecord(today);
  }

  const cutoff = addDays(today, -90);
  Object.keys(days).forEach((key) => {
    if (key < cutoff) delete days[key];
  });

  const next = { ...state, days };
  next.streak = computeStreak(next);
  return next;
}

export function getDayRecord(state, dateKey = getTodayKey()) {
  return state.days[dateKey] || null;
}

export function toggleTask(state, taskId, dateKey = getTodayKey()) {
  const next = ensureToday({ ...state });
  const day = next.days[dateKey];
  if (!day) return next;

  const tasks = day.tasks.map((task) => {
    if (task.id !== taskId) return task;
    const completed = !task.completed;
    return {
      ...task,
      completed,
      completedAt: completed ? new Date().toISOString() : null,
    };
  });

  next.days = { ...next.days, [dateKey]: { ...day, tasks } };
  next.streak = computeStreak(next);
  return next;
}

export function incrementCategory(state, categoryId, { sessions = 1, minutes = 0 } = {}) {
  if (!CATEGORY_IDS.includes(categoryId)) return state;
  const next = ensureToday({ ...state });
  const current = next.categoryProgress[categoryId] || { sessionsCompleted: 0, minutesSpent: 0 };
  next.categoryProgress = {
    ...next.categoryProgress,
    [categoryId]: {
      sessionsCompleted: current.sessionsCompleted + sessions,
      minutesSpent: current.minutesSpent + minutes,
    },
  };
  return next;
}

export function decrementCategory(state, categoryId) {
  if (!CATEGORY_IDS.includes(categoryId)) return state;
  const next = ensureToday({ ...state });
  const current = next.categoryProgress[categoryId] || { sessionsCompleted: 0, minutesSpent: 0 };
  next.categoryProgress = {
    ...next.categoryProgress,
    [categoryId]: {
      sessionsCompleted: Math.max(0, current.sessionsCompleted - 1),
      minutesSpent: current.minutesSpent,
    },
  };
  return next;
}

/**
 * A day counts toward the streak if at least one daily task is completed.
 */
export function computeStreak(state) {
  const activeDates = Object.keys(state.days)
    .filter((dateKey) => {
      const day = state.days[dateKey];
      return day?.tasks?.some((t) => t.completed);
    })
    .sort();

  if (activeDates.length === 0) {
    return { current: 0, longest: 0, lastActiveDate: null };
  }

  let longest = 0;
  let run = 0;
  let prev = null;

  activeDates.forEach((dateKey) => {
    if (!prev) {
      run = 1;
    } else if (addDays(prev, 1) === dateKey) {
      run += 1;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
    prev = dateKey;
  });

  const today = getTodayKey();
  const lastActive = activeDates[activeDates.length - 1];
  let current = 0;

  if (lastActive === today || addDays(lastActive, 1) === today) {
    current = 1;
    for (let i = activeDates.length - 2; i >= 0; i -= 1) {
      if (addDays(activeDates[i], 1) === activeDates[i + 1]) {
        current += 1;
      } else {
        break;
      }
    }
  }

  return { current, longest, lastActiveDate: lastActive };
}

export function getTaskLists(state, dateKey = getTodayKey()) {
  const day = getDayRecord(state, dateKey);
  if (!day) return { completed: [], pending: [] };
  const completed = day.tasks.filter((t) => t.completed);
  const pending = day.tasks.filter((t) => !t.completed);
  return { completed, pending };
}

/** Overall progress: share of today's checklist completed (0–100). */
export function getTodayProgressPercent(state, dateKey = getTodayKey()) {
  const day = getDayRecord(state, dateKey);
  if (!day?.tasks?.length) return 0;
  const done = day.tasks.filter((t) => t.completed).length;
  return Math.round((done / day.tasks.length) * 100);
}

/** Category progress as % toward a soft goal of 30 sessions per category. */
export function getCategoryProgressPercent(categoryProgress, categoryId) {
  const sessions = categoryProgress[categoryId]?.sessionsCompleted ?? 0;
  const goal = 30;
  return Math.min(100, Math.round((sessions / goal) * 100));
}

export function getWeeklySummary(state) {
  const today = getTodayKey();
  const days = [];

  for (let i = 6; i >= 0; i -= 1) {
    const dateKey = addDays(today, -i);
    const day = state.days[dateKey];
    const total = day?.tasks?.length ?? DEFAULT_DAILY_TASKS.length;
    const completed = day?.tasks?.filter((t) => t.completed).length ?? 0;
    const label = parseDateKey(dateKey).toLocaleDateString(undefined, {
      weekday: 'short',
    });
    days.push({
      dateKey,
      label,
      completed,
      total,
      percent: total ? Math.round((completed / total) * 100) : 0,
    });
  }

  const totalCompleted = days.reduce((sum, d) => sum + d.completed, 0);
  const totalTasks = days.reduce((sum, d) => sum + d.total, 0);

  return {
    days,
    totalCompleted,
    totalTasks,
    averagePercent: totalTasks ? Math.round((totalCompleted / totalTasks) * 100) : 0,
  };
}

export function getOverallStats(state) {
  const { completed, pending } = getTaskLists(state);
  const weekly = getWeeklySummary(state);
  const categoryTotals = CATEGORY_IDS.reduce((acc, id) => {
    acc[id] = state.categoryProgress[id]?.sessionsCompleted ?? 0;
    return acc;
  }, {});

  return {
    todayProgress: getTodayProgressPercent(state),
    streak: state.streak,
    completedCount: completed.length,
    pendingCount: pending.length,
    weekly,
    categoryTotals,
  };
}
