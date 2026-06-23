import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Resume Roast local store.
 *
 * Persists: last result, recent history (for instant UI load while the
 * network request is in flight), and which share token was last generated.
 *
 * Does NOT persist the raw resume text — privacy-first.
 */
export const useRoastStore = create(
  persist(
    (set, get) => ({
      lastResult: null,
      history: [],
      isLoading: false,
      error: null,
      setLoading: (v) => set({ isLoading: v, error: null }),
      setError: (e) => set({ error: e, isLoading: false }),
      setResult: (result) =>
        set((s) => ({
          lastResult: result,
          history: [result, ...s.history].slice(0, 25),
          isLoading: false,
          error: null,
        })),
      setHistory: (history) => set({ history }),
      clear: () => set({ lastResult: null, history: [], error: null }),
    }),
    {
      name: 'resume-roast-v1',
      partialize: (s) => ({
        lastResult: s.lastResult,
        history: s.history.slice(0, 10),
      }),
    }
  )
);