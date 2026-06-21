// frontend/src/utils/performanceMonitor.js
import logger from './logger';
const metrics = new Map();

export const startMeasure = (label) => {
  try {
    if (!label || typeof label !== "string") {
      throw new Error("Valid label is required");
    }

    if (typeof performance === "undefined") {
      return false;
    }

    performance.mark(`${label}-start`);
    return true;
  } catch (error) {
    logger.error('Performance monitoring start failed:', error);
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

    performance.mark(endMark);
    performance.measure(label, startMark, endMark);

    const entries = performance.getEntriesByName(label);
    const latestEntry = entries[entries.length - 1];

    const duration = latestEntry?.duration ?? null;

    if (duration !== null) {
      metrics.set(label, duration);
    }

    return duration;
  } catch (error) {
    logger.error('Performance monitoring end failed:', error);
    return null;
  }
};

export const getMetrics = () => {
  return Object.fromEntries(metrics);
};

export const clearMetrics = () => {
  metrics.clear();

  if (typeof performance !== "undefined") {
    performance.clearMarks();
    performance.clearMeasures();
  }
};