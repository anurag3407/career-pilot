// frontend/src/utils/performanceMonitor.js

const metrics = new Map();
const fallbackMarks = new Map();
const fallbackMeasures = new Map();

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
      fallbackMarks.set(`${label}-start`, performance.now ? performance.now() : Date.now());
    }
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
      const endTime = performance.now ? performance.now() : Date.now();
      duration = typeof startTime === "number" ? Math.max(0, endTime - startTime) : null;
      if (duration !== null) {
        fallbackMeasures.set(label, duration);
      }
    }

    if (duration !== null) {
      metrics.set(label, duration);
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
  metrics.clear();
  fallbackMarks.clear();
  fallbackMeasures.clear();

  if (typeof performance !== "undefined") {
    if (typeof performance.clearMarks === "function") {
      performance.clearMarks();
    }

    if (typeof performance.clearMeasures === "function") {
      performance.clearMeasures();
    }
  }
};