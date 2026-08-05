import { describe, test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { MemoryMonitor } from '../memoryMonitor.js';

const monitors = [];
const track = (monitor) => {
  monitors.push(monitor);
  return monitor;
};

// Returns a sampler stub with a fixed memory footprint; the caller can
// adjust the heapUsed value between calls via the `heapUsedMB` property.
const makeSampler = (heapUsedMB) => {
  const sampler = () => ({
    rss: (sampler.heapUsedMB * 1.4) * 1024 * 1024,
    heapTotal: (sampler.heapUsedMB * 1.2) * 1024 * 1024,
    heapUsed: sampler.heapUsedMB * 1024 * 1024,
    external: 0,
    arrayBuffers: 0,
  });
  sampler.heapUsedMB = heapUsedMB;
  return sampler;
};

afterEach(() => {
  for (const monitor of monitors) monitor.stop();
  monitors.length = 0;
});

describe('MemoryMonitor', () => {
  test('starts and stops cleanly', () => {
    const monitor = track(new MemoryMonitor({ intervalMs: 10_000 }));
    assert.equal(monitor.running, false);
    monitor.start();
    assert.equal(monitor.running, true);
    monitor.start();
    monitor.stop();
    assert.equal(monitor.running, false);
  });

  test('snapshot() reports process memory in MB', () => {
    const monitor = track(new MemoryMonitor({ sampler: makeSampler(100) }));
    const snap = monitor.snapshot();
    assert.equal(snap.heapUsedMB, 100);
    assert.equal(snap.rssMB, 140);
    assert.ok(snap.rssMB >= snap.heapUsedMB);
    assert.equal(snap.status, 'unknown');
  });

  test('collects a bounded sample window', () => {
    const monitor = track(new MemoryMonitor({ window: 5, sampler: makeSampler(100) }));
    for (let i = 0; i < 12; i += 1) monitor.tick();
    assert.equal(monitor.samples.length, 5);
    assert.equal(monitor.getStats().sampleCount, 5);
  });

  test('does not flag a leak with fewer than 2 samples', () => {
    const monitor = track(new MemoryMonitor({ sampler: makeSampler(100) }));
    monitor.tick();
    assert.equal(monitor.detectLeak(), false);
  });

  test('detectLeak() flags sustained growth above the threshold', () => {
    const sampler = makeSampler(100);
    const monitor = track(new MemoryMonitor({ window: 10, leakThresholdMb: 10, sampler }));
    for (const heapUsedMB of [100, 112, 115]) {
      sampler.heapUsedMB = heapUsedMB;
      monitor.tick();
    }
    assert.equal(monitor.detectLeak(), true);
    assert.equal(monitor.status(), 'leaking');
  });

  test('detectLeak() stays quiet when growth is below the threshold', () => {
    const sampler = makeSampler(100);
    const monitor = track(new MemoryMonitor({ window: 10, leakThresholdMb: 10, sampler }));
    for (const heapUsedMB of [100, 105, 108]) {
      sampler.heapUsedMB = heapUsedMB;
      monitor.tick();
    }
    assert.equal(monitor.detectLeak(), false);
    assert.equal(monitor.status(), 'healthy');
  });

  test('status() maps thresholds to warning and critical', () => {
    const sampler = makeSampler(100);
    const monitor = track(new MemoryMonitor({
      window: 10,
      warningThresholdMb: 500,
      criticalThresholdMb: 800,
      leakThresholdMb: 10,
      sampler,
    }));
    sampler.heapUsedMB = 100;
    monitor.tick();
    assert.equal(monitor.status(), 'healthy');
    sampler.heapUsedMB = 600;
    monitor.tick();
    assert.equal(monitor.status(), 'warning');
    sampler.heapUsedMB = 900;
    monitor.tick();
    assert.equal(monitor.status(), 'critical');
  });

  test('growthRateMbPerSample computes per-sample growth', () => {
    const sampler = makeSampler(100);
    const monitor = track(new MemoryMonitor({ window: 10, sampler }));
    for (const heapUsedMB of [100, 120, 140]) {
      sampler.heapUsedMB = heapUsedMB;
      monitor.tick();
    }
    assert.equal(monitor.growthRateMbPerSample(), 20);
  });

  test('growthRateMbPerSample returns 0 with fewer than 2 samples', () => {
    const monitor = track(new MemoryMonitor({ sampler: makeSampler(100) }));
    assert.equal(monitor.growthRateMbPerSample(), 0);
  });

  test('tick() emits sample and leak events on sustained growth', () => {
    const sampler = makeSampler(100);
    const monitor = track(new MemoryMonitor({ window: 5, leakThresholdMb: 10, sampler }));
    const events = [];
    monitor.on('sample', () => events.push('sample'));
    monitor.on('leak', () => events.push('leak'));
    for (const heapUsedMB of [100, 100, 130]) {
      sampler.heapUsedMB = heapUsedMB;
      monitor.tick();
    }
    assert.ok(events.includes('sample'));
    assert.ok(events.includes('leak'));
  });

  test('tick() emits warning and critical events at thresholds', () => {
    const sampler = makeSampler(100);
    const monitor = track(new MemoryMonitor({
      window: 5,
      warningThresholdMb: 500,
      criticalThresholdMb: 800,
      leakThresholdMb: 10,
      sampler,
    }));
    const events = [];
    monitor.on('warning', () => events.push('warning'));
    monitor.on('critical', () => events.push('critical'));
    sampler.heapUsedMB = 900;
    monitor.tick();
    assert.ok(events.includes('critical'));
    assert.ok(!events.includes('warning'));
    sampler.heapUsedMB = 600;
    monitor.tick();
    assert.ok(events.includes('warning'));
  });

  test('getStats() reports running state and latest snapshot', () => {
    const monitor = track(new MemoryMonitor({ sampler: makeSampler(100) }));
    monitor.start();
    const stats = monitor.getStats();
    assert.equal(stats.running, true);
    assert.equal(stats.sampleCount, 1);
    assert.equal(typeof stats.latest.heapUsedMB, 'number');
    assert.equal(stats.lastError, null);
  });
});
