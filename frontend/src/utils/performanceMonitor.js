// frontend/src/utils/performanceMonitor.js

const metrics = new Map();
const fallbackMarks = new Map();
const fallbackMeasures = new Map();
const trackedLabels = new Set();

export const startMeasure = (label) => {
  try {
    if (!label || typeof label !== "string") {
      throw new Error("Valid label is required");
    }

    if (typeof performance === "undefined") {
      return false;
    }

    if (typeof performance.mark === "function") {
      performance.mark(`${label}-start`);
    } else {
      fallbackMarks.set(`${label}-start`, typeof performance.now === "function" ? performance.now() : Date.now());
    }
    trackedLabels.add(label);
    return true;
  } catch (error) {
    console.error("Performance monitoring start failed:", error);
    return false;
  }
};

export const endMeasure = (label) => {
  try {
    if (!label || typeof label !== "string") {
      throw new Error("Valid label is required");
    }

    if (typeof performance === "undefined") {
      return null;
    }

    const startMark = `${label}-start`;
    const endMark = `${label}-end`;

    let duration = null;

    if (typeof performance.mark === "function" && typeof performance.measure === "function" && typeof performance.getEntriesByName === "function") {
      performance.mark(endMark);
      performance.measure(label, startMark, endMark);

      const entries = performance.getEntriesByName(label);
      const latestEntry = entries[entries.length - 1];
      duration = latestEntry?.duration ?? null;
    } else {
      const startTime = fallbackMarks.get(startMark);
      const endTime = typeof performance.now === "function" ? performance.now() : Date.now();
      duration = typeof startTime === "number" ? Math.max(0, endTime - startTime) : null;
      if (duration !== null) {
        fallbackMeasures.set(label, duration);
      }
    }

    if (duration !== null) {
      metrics.set(label, duration);
      trackedLabels.add(label);
    }

    return duration;
  } catch (error) {
    console.error("Performance monitoring end failed:", error);
    return null;
  }
};

export const getMetrics = () => {
  return Object.fromEntries(metrics);
};

export const clearMetrics = () => {
  if (typeof performance !== "undefined") {
    // SAFETY: Clear only marks/measures created by this module (tracked in trackedLabels).
    // Never call performance.clearMarks() or clearMeasures() with no arguments,
    // as that would wipe all performance entries in the runtime, including entries
    // from other modules or tests, breaking unrelated telemetry and test assertions.
    if (typeof performance.clearMarks === "function") {
      for (const label of trackedLabels) {
        performance.clearMarks(`${label}-start`);
        performance.clearMarks(`${label}-end`);
      }
    }

    if (typeof performance.clearMeasures === "function") {
      for (const label of trackedLabels) {
        performance.clearMeasures(label);
      }
    }
  }

  // Clear internal module state.
  metrics.clear();
  fallbackMarks.clear();
  fallbackMeasures.clear();
  trackedLabels.clear();
};