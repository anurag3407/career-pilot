const DEFAULT_OPTIONS = {
  enabled: true,
  intervalMs: 30_000,
  windowSize: 6,
  warningGrowthRate: 0.15,
  criticalGrowthRate: 0.35,
  maxHeapUsedBytes: 512 * 1024 * 1024,
  maxRssBytes: 1024 * 1024 * 1024,
  clock: () => new Date(),
  memoryUsage: () => process.memoryUsage(),
  logger: console,
};

const MEMORY_FIELDS = [
  "rss",
  "heapTotal",
  "heapUsed",
  "external",
  "arrayBuffers",
];

const toFiniteNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeOptions = (options = {}) => {
  const merged = { ...DEFAULT_OPTIONS, ...options };
  const warningGrowthRate = Math.max(
    0,
    toFiniteNumber(merged.warningGrowthRate, DEFAULT_OPTIONS.warningGrowthRate)
  );
  const criticalGrowthRate = Math.max(
    warningGrowthRate,
    toFiniteNumber(merged.criticalGrowthRate, DEFAULT_OPTIONS.criticalGrowthRate)
  );

  return {
    ...merged,
    intervalMs: Math.max(1, toFiniteNumber(merged.intervalMs, DEFAULT_OPTIONS.intervalMs)),
    windowSize: Math.max(2, Math.trunc(toFiniteNumber(merged.windowSize, DEFAULT_OPTIONS.windowSize))),
    warningGrowthRate,
    criticalGrowthRate,
    maxHeapUsedBytes: Math.max(1, toFiniteNumber(merged.maxHeapUsedBytes, DEFAULT_OPTIONS.maxHeapUsedBytes)),
    maxRssBytes: Math.max(1, toFiniteNumber(merged.maxRssBytes, DEFAULT_OPTIONS.maxRssBytes)),
  };
};

const normalizeMemoryUsage = (rawUsage) => {
  const usage = rawUsage || {};

  return MEMORY_FIELDS.reduce((normalized, field) => {
    normalized[field] = Math.max(0, toFiniteNumber(usage[field], 0));
    return normalized;
  }, {});
};

const buildSample = (options) => ({
  timestamp: options.clock().toISOString(),
  memory: normalizeMemoryUsage(options.memoryUsage()),
});

const calculateGrowthRate = (firstValue, lastValue) => {
  if (firstValue <= 0) return lastValue > 0 ? 1 : 0;
  return (lastValue - firstValue) / firstValue;
};

export class MemoryMonitor {
  constructor(options = {}) {
    this.options = normalizeOptions(options);
    this.samples = [];
    this.timer = null;
    this.lastAnalysis = null;
  }

  collectSample() {
    const sample = buildSample(this.options);
    this.samples.push(sample);

    if (this.samples.length > this.options.windowSize) {
      this.samples.splice(0, this.samples.length - this.options.windowSize);
    }

    this.lastAnalysis = this.analyze();
    this.logIfNeeded(this.lastAnalysis);

    return {
      sample,
      analysis: this.lastAnalysis,
    };
  }

  safeCollectSample() {
    try {
      return this.collectSample();
    } catch (error) {
      this.logMonitorError(error);
      return null;
    }
  }

  analyze() {
    const latest = this.samples.at(-1);
    if (!latest) {
      return {
        status: "insufficient_data",
        sampleCount: 0,
        message: "No memory samples have been collected yet.",
        checks: [],
      };
    }

    const first = this.samples[0];
    const heapGrowthRate = calculateGrowthRate(first.memory.heapUsed, latest.memory.heapUsed);
    const rssGrowthRate = calculateGrowthRate(first.memory.rss, latest.memory.rss);
    const checks = [];

    if (latest.memory.heapUsed >= this.options.maxHeapUsedBytes) {
      checks.push({
        level: "critical",
        metric: "heapUsed",
        value: latest.memory.heapUsed,
        threshold: this.options.maxHeapUsedBytes,
        reason: "heap usage exceeded the configured maximum",
      });
    }

    if (latest.memory.rss >= this.options.maxRssBytes) {
      checks.push({
        level: "critical",
        metric: "rss",
        value: latest.memory.rss,
        threshold: this.options.maxRssBytes,
        reason: "resident set size exceeded the configured maximum",
      });
    }

    const growthLevel =
      Math.max(heapGrowthRate, rssGrowthRate) >= this.options.criticalGrowthRate
        ? "critical"
        : Math.max(heapGrowthRate, rssGrowthRate) >= this.options.warningGrowthRate
          ? "warning"
          : null;

    if (growthLevel) {
      checks.push({
        level: growthLevel,
        metric: "growthRate",
        value: {
          heapUsed: heapGrowthRate,
          rss: rssGrowthRate,
        },
        threshold:
          growthLevel === "critical"
            ? this.options.criticalGrowthRate
            : this.options.warningGrowthRate,
        reason: "memory usage is growing across the rolling sample window",
      });
    }

    const status = checks.some((check) => check.level === "critical")
      ? "critical"
      : checks.some((check) => check.level === "warning")
        ? "warning"
        : "healthy";

    return {
      status,
      sampleCount: this.samples.length,
      latestSample: latest,
      growthRate: {
        heapUsed: heapGrowthRate,
        rss: rssGrowthRate,
      },
      checks,
      message:
        status === "healthy"
          ? "Memory usage is within configured limits."
          : "Potential memory leak symptoms detected.",
    };
  }

  getSnapshot() {
    return {
      running: this.isRunning(),
      options: {
        enabled: this.options.enabled,
        intervalMs: this.options.intervalMs,
        windowSize: this.options.windowSize,
        warningGrowthRate: this.options.warningGrowthRate,
        criticalGrowthRate: this.options.criticalGrowthRate,
        maxHeapUsedBytes: this.options.maxHeapUsedBytes,
        maxRssBytes: this.options.maxRssBytes,
      },
      samples: [...this.samples],
      analysis: this.lastAnalysis || this.analyze(),
    };
  }

  start() {
    if (!this.options.enabled || this.timer) {
      return this;
    }

    this.safeCollectSample();
    this.timer = setInterval(() => this.safeCollectSample(), this.options.intervalMs);

    if (typeof this.timer.unref === "function") {
      this.timer.unref();
    }

    return this;
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    return this;
  }

  reset() {
    this.samples = [];
    this.lastAnalysis = null;
    return this;
  }

  isRunning() {
    return Boolean(this.timer);
  }

  logIfNeeded(analysis) {
    if (!analysis || analysis.status === "healthy" || analysis.status === "insufficient_data") {
      return;
    }

    const logMethod = analysis.status === "critical" ? "error" : "warn";
    const logger = this.options.logger || {};

    if (typeof logger[logMethod] === "function") {
      logger[logMethod]("[memory-monitor]", analysis.message, {
        status: analysis.status,
        checks: analysis.checks,
      });
    }
  }

  logMonitorError(error) {
    const logger = this.options.logger || {};
    const logMethod = typeof logger.error === "function" ? "error" : null;

    try {
      if (logMethod) {
        logger[logMethod]("[memory-monitor]", "Memory monitor sampling failed.", {
          error: error?.message || String(error),
        });
        return;
      }

      console.error("[memory-monitor]", "Memory monitor sampling failed.", error);
    } catch (loggerError) {
      console.error("[memory-monitor]", "Memory monitor error logging failed.", loggerError);
      console.error("[memory-monitor]", "Original memory monitor error:", error);
    }
  }
}

export const createMemoryMonitor = (options = {}) => new MemoryMonitor(options);

const memoryMonitor = createMemoryMonitor({
  enabled: process.env.MEMORY_MONITOR_ENABLED !== "false",
  intervalMs: process.env.MEMORY_MONITOR_INTERVAL_MS,
  windowSize: process.env.MEMORY_MONITOR_WINDOW_SIZE,
  warningGrowthRate: process.env.MEMORY_MONITOR_WARNING_GROWTH_RATE,
  criticalGrowthRate: process.env.MEMORY_MONITOR_CRITICAL_GROWTH_RATE,
  maxHeapUsedBytes: process.env.MEMORY_MONITOR_MAX_HEAP_BYTES,
  maxRssBytes: process.env.MEMORY_MONITOR_MAX_RSS_BYTES,
});

export default memoryMonitor;
