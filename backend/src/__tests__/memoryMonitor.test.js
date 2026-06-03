import { describe, test } from "node:test";
import assert from "node:assert/strict";

import { createMemoryMonitor } from "../services/memoryMonitor.js";

const makeClock = () => {
  let tick = 0;
  return () => new Date(Date.UTC(2026, 0, 1, 0, 0, tick++));
};

const makeMemorySequence = (samples) => {
  let index = 0;
  return () => samples[Math.min(index++, samples.length - 1)];
};

const baseUsage = {
  rss: 100,
  heapTotal: 80,
  heapUsed: 50,
  external: 10,
  arrayBuffers: 5,
};

describe("memoryMonitor", () => {
  test("collects normalized rolling memory samples", () => {
    const monitor = createMemoryMonitor({
      windowSize: 2,
      clock: makeClock(),
      memoryUsage: makeMemorySequence([
        baseUsage,
        { ...baseUsage, heapUsed: 55 },
        { ...baseUsage, heapUsed: 60 },
      ]),
      logger: {},
    });

    monitor.collectSample();
    monitor.collectSample();
    monitor.collectSample();

    const snapshot = monitor.getSnapshot();

    assert.equal(snapshot.samples.length, 2);
    assert.equal(snapshot.samples[0].memory.heapUsed, 55);
    assert.equal(snapshot.samples[1].memory.heapUsed, 60);
    assert.equal(snapshot.analysis.status, "healthy");
  });

  test("returns warning when memory grows across the window", () => {
    const monitor = createMemoryMonitor({
      warningGrowthRate: 0.2,
      criticalGrowthRate: 0.8,
      clock: makeClock(),
      memoryUsage: makeMemorySequence([
        { ...baseUsage, rss: 100, heapUsed: 100 },
        { ...baseUsage, rss: 135, heapUsed: 130 },
      ]),
      logger: {},
    });

    monitor.collectSample();
    const { analysis } = monitor.collectSample();

    assert.equal(analysis.status, "warning");
    assert.equal(analysis.checks[0].metric, "growthRate");
    assert.ok(analysis.growthRate.heapUsed >= 0.3);
  });

  test("keeps critical growth threshold at or above warning threshold", () => {
    const monitor = createMemoryMonitor({
      warningGrowthRate: 0.5,
      criticalGrowthRate: 0.1,
      clock: makeClock(),
      memoryUsage: makeMemorySequence([
        { ...baseUsage, rss: 100, heapUsed: 100 },
        { ...baseUsage, rss: 120, heapUsed: 120 },
      ]),
      logger: {},
    });

    monitor.collectSample();
    const { analysis } = monitor.collectSample();
    const snapshot = monitor.getSnapshot();

    assert.equal(snapshot.options.criticalGrowthRate, 0.5);
    assert.equal(analysis.status, "healthy");
  });

  test("returns critical when absolute thresholds are crossed", () => {
    const monitor = createMemoryMonitor({
      maxHeapUsedBytes: 120,
      maxRssBytes: 200,
      clock: makeClock(),
      memoryUsage: () => ({ ...baseUsage, rss: 250, heapUsed: 150 }),
      logger: {},
    });

    const { analysis } = monitor.collectSample();

    assert.equal(analysis.status, "critical");
    assert.equal(
      analysis.checks.filter((check) => check.level === "critical").length,
      2
    );
  });

  test("start and stop clean up the sampling timer", () => {
    const monitor = createMemoryMonitor({
      intervalMs: 10_000,
      clock: makeClock(),
      memoryUsage: () => baseUsage,
      logger: {},
    });

    monitor.start();
    assert.equal(monitor.isRunning(), true);

    monitor.stop();
    assert.equal(monitor.isRunning(), false);
  });

  test("sampling timer errors are logged without escaping the interval", () => {
    const originalSetInterval = global.setInterval;
    const originalClearInterval = global.clearInterval;
    let intervalCallback;
    const errors = [];

    global.setInterval = (callback) => {
      intervalCallback = callback;
      return { unref() {} };
    };
    global.clearInterval = () => {};

    try {
      const monitor = createMemoryMonitor({
        intervalMs: 10_000,
        clock: makeClock(),
        memoryUsage: () => baseUsage,
        logger: {
          error: (...args) => errors.push(args),
        },
      });

      let calls = 0;
      monitor.options.memoryUsage = () => {
        calls += 1;
        if (calls === 1) {
          return baseUsage;
        }
        throw new Error("memory unavailable");
      };

      monitor.start();

      assert.doesNotThrow(() => intervalCallback());
      assert.equal(errors.length, 1);
      assert.match(errors[0][2].error, /memory unavailable/);

      monitor.stop();
    } finally {
      global.setInterval = originalSetInterval;
      global.clearInterval = originalClearInterval;
    }
  });

  test("disabled monitors do not start timers", () => {
    const monitor = createMemoryMonitor({
      enabled: false,
      clock: makeClock(),
      memoryUsage: () => baseUsage,
      logger: {},
    });

    monitor.start();

    assert.equal(monitor.isRunning(), false);
    assert.equal(monitor.getSnapshot().samples.length, 0);
  });
});
