import { useCallback, useEffect, useState } from 'react';
import {
  decrementCategory,
  ensureToday,
  getDayRecord,
  getOverallStats,
  getTodayKey,
  incrementCategory,
  loadTrackerState,
  saveTrackerState,
  toggleTask,
} from '../lib/interviewPrepTracker';

/**
 * Manages interview preparation tracker state with localStorage persistence.
 */
export function useInterviewPrepTracker() {
  const [state, setState] = useState(() => loadTrackerState());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveTrackerState(state);
  }, [state, hydrated]);

  const persist = useCallback((updater) => {
    setState((prev) => ensureToday(updater(prev)));
  }, []);

  const handleToggleTask = useCallback((taskId) => {
    persist((prev) => toggleTask(prev, taskId));
  }, [persist]);

  const handleIncrementCategory = useCallback((categoryId) => {
    persist((prev) => incrementCategory(prev, categoryId));
  }, [persist]);

  const handleDecrementCategory = useCallback((categoryId) => {
    persist((prev) => decrementCategory(prev, categoryId));
  }, [persist]);

  const stats = getOverallStats(state);
  const todayTasks = getDayRecord(state, getTodayKey())?.tasks ?? [];

  return {
    state,
    stats,
    todayTasks,
    hydrated,
    toggleTask: handleToggleTask,
    incrementCategory: handleIncrementCategory,
    decrementCategory: handleDecrementCategory,
  };
}
