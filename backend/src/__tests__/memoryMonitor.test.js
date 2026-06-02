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
