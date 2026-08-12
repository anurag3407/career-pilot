import { EventEmitter } from 'events';

const DEFAULT_INTERVAL_MS = 30_000;
const DEFAULT_WINDOW = 20;
const DEFAULT_LEAK_THRESHOLD_MB = 25;
const WARNING_THRESHOLD_MB = 512;
const CRITICAL_THRESHOLD_MB = 768;

const mb = (bytes) => Math.round(bytes / 1024 / 1024);

/**
 * Samples process memory usage on an interval and flags sustained
 * heap growth as a potential leak. Emits:
 *   'sample'   ({ snapshot }) after every measurement
 *   'warning'  (snapshot) when heapUsed crosses WARNING_THRESHOLD_MB
 *   'critical' (snapshot) when heapUsed crosses CRITICAL_THRESHOLD_MB
 *   'leak'     (snapshot) when heapUsed grows by more than leakThresholdMb
 *              across the retained sample window
 *   'error'    (err) when a measurement fails
 */
export class MemoryMonitor extends EventEmitter {
  constructor({
    intervalMs = DEFAULT_INTERVAL_MS,
    window = DEFAULT_WINDOW,
    leakThresholdMb = DEFAULT_LEAK_THRESHOLD_MB,
    warningThresholdMb = WARNING_THRESHOLD_MB,
    criticalThresholdMb = CRITICAL_THRESHOLD_MB,
    sampler = process.memoryUsage.bind(process),
  } = {}) {
    super();
    this.intervalMs = intervalMs;
    this.window = window;
    this.leakThresholdMb = leakThresholdMb;
    this.warningThresholdMb = warningThresholdMb;
    this.criticalThresholdMb = criticalThresholdMb;
    this.sampler = sampler;

    this.samples = [];
    this.running = false;
    this.timer = null;
    this.lastError = null;
  }

  start() {
    if (this.running) return this;
    this.running = true;
    this.tick();
    this.timer = setInterval(() => this.tick(), this.intervalMs);
    if (typeof this.timer.unref === 'function') this.timer.unref();
    return this;
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.running = false;
    return this;
  }

  tick() {
    try {
      const snapshot = this.snapshot();
      this.samples.push(snapshot);
      if (this.samples.length > this.window) this.samples.shift();
      this.emit('sample', snapshot);

      if (snapshot.heapUsedMB >= this.criticalThresholdMb) {
        this.emit('critical', snapshot);
      } else if (snapshot.heapUsedMB >= this.warningThresholdMb) {
        this.emit('warning', snapshot);
      }

      if (this.detectLeak()) {
        this.emit('leak', snapshot);
      }
    } catch (err) {
      this.lastError = err;
      this.emit('error', err);
    }
  }

  /**
   * Returns true when heapUsed grew by more than leakThresholdMb
   * between the oldest and newest retained samples, indicating
   * sustained (non-GC-recovered) growth.
   */
  detectLeak() {
    if (this.samples.length < 2) return false;
    const first = this.samples[0].heapUsedMB;
    const last = this.samples[this.samples.length - 1].heapUsedMB;
    return last - first >= this.leakThresholdMb;
  }

  /** Returns the growth rate (MB per sample) across the retained window. */
  growthRateMbPerSample() {
    if (this.samples.length < 2) return 0;
    const first = this.samples[0].heapUsedMB;
    const last = this.samples[this.samples.length - 1].heapUsedMB;
    return Number(((last - first) / (this.samples.length - 1)).toFixed(3));
  }

  snapshot() {
    const usage = this.sampler();
    return {
      timestamp: Date.now(),
      rssMB: mb(usage.rss),
      heapTotalMB: mb(usage.heapTotal),
      heapUsedMB: mb(usage.heapUsed),
      externalMB: mb(usage.external),
      arrayBuffersMB: mb(usage.arrayBuffers || 0),
      growthRateMBPerSample: this.growthRateMbPerSample(),
      status: this.status(),
    };
  }

  status() {
    const latest = this.samples[this.samples.length - 1];
    if (!latest) return 'unknown';
    if (latest.heapUsedMB >= this.criticalThresholdMb) return 'critical';
    if (latest.heapUsedMB >= this.warningThresholdMb) return 'warning';
    if (this.detectLeak()) return 'leaking';
    return 'healthy';
  }

  getStats() {
    return {
      running: this.running,
      intervalMs: this.intervalMs,
      sampleCount: this.samples.length,
      status: this.status(),
      latest: this.samples[this.samples.length - 1] || null,
      lastError: this.lastError ? this.lastError.message : null,
    };
  }
}
