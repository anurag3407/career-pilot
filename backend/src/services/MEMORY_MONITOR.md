Memory Monitor Service
======================

Location: `backend/src/services/memoryMonitor.js`

Purpose
-------
Samples process memory usage on an interval and flags sustained heap growth
as a potential leak, so runaway memory usage is visible in logs and metrics
instead of ending in an OOM crash.

Usage
-----
```js
import { MemoryMonitor } from './memoryMonitor.js';

const monitor = new MemoryMonitor({
  intervalMs: 30_000,       // sampling interval
  window: 20,               // retained samples
  leakThresholdMb: 25,      // sustained growth that triggers 'leak'
  warningThresholdMb: 512,  // heapUsed warning level
  criticalThresholdMb: 768, // heapUsed critical level
});

monitor.on('leak', (snapshot) => log.error('possible memory leak', snapshot));
monitor.on('critical', (snapshot) => log.fatal('heap usage critical', snapshot));
monitor.start();

monitor.getStats(); // { running, sampleCount, status, latest, lastError }
monitor.stop();
```

Events
------
- `sample`   — after every measurement, with the snapshot
- `warning`  — heapUsed crosses `warningThresholdMb`
- `critical` — heapUsed crosses `criticalThresholdMb`
- `leak`     — heapUsed grows by `leakThresholdMb` across the window
- `error`    — a measurement failed

Status values: `unknown` (no samples yet), `healthy`, `warning`, `critical`,
`leaking`. Threshold checks take precedence over the leak label.

Notes
-----
- Bounded sample window (`Array.prototype.shift`), so memory use is constant
  regardless of uptime.
- The interval timer is `unref`'d, so the monitor never keeps the process
  alive by itself.
- `sampler` is injectable for deterministic tests; it defaults to
  `process.memoryUsage`.
- The monitor is passive: it observes and emits, it never kills the process.
