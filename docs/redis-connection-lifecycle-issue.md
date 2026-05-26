# Redis Connection Lifecycle Crisis

## Location

`backend/src/services/postScheduler.js`, `backend/src/services/jobAlertQueue.js`, `backend/src/middleware/rateLimiter.js`

## Severity

**Critical** — unhandled Redis errors crash the Node.js process; no graceful shutdown causes job-state corruption.

## Description

The server creates **5 independent IORedis connections** to the same Redis server across three modules, each with lifecycle defects that crash the process or silently degrade the application.

---

### 1. Unhandled `error` on `postScheduler.js` Worker Connection (CRITICAL)

**File:** `backend/src/services/postScheduler.js:18-28` (before fix)

```js
const createWorkerConnection = () => {
    if (!redisUrl) return null;
    return new IORedis(redisUrl, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        retryStrategy: (times) => {
            if (times > 3) return null;
            return Math.min(times * 200, 1000);
        }
    });
    // ⚠️ NO error handler — any 'error' event crashes the process
};
```

In Node.js v15+, emitting an `'error'` event on an `EventEmitter` that has **no registered listeners** throws the error as an unhandled exception, crashing the process ([Node.js error events docs](https://nodejs.org/api/events.html#error-events)).

**Any transient Redis issue** — network blip, connection timeout, Redis server restart, TLS renegotiation failure — causes the IORedis client to emit an `'error'` event. Since no handler is registered, Node.js throws the error, and the entire production server dies.

### 2. Queue Connections Use `once('error')` During Init Only (CRITICAL)

**Files:** `backend/src/services/postScheduler.js:52-56`, `backend/src/services/jobAlertQueue.js:81-89` (before fix)

```js
await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Redis connection timeout')), 5000);
    redisConnection.once('ready', () => { clearTimeout(timeout); resolve(); });
    redisConnection.once('error', (err) => { clearTimeout(timeout); reject(err); }); // ← fires ONCE
});
```

Both modules register handlers with `once()`. After the `ready` event fires and `resolve()` completes, the `once('error')` handler is consumed and **unsubscribed**. Any subsequent Redis error on that connection has no listener. The process crashes identically to issue #1.

### 3. No Graceful Shutdown (CRITICAL)

**File:** `backend/src/index.js` (before fix)

```js
process.on('SIGTERM'|'SIGINT') // ← NOT HANDLED
```

The server has zero `SIGTERM`/`SIGINT` handlers. When the process is killed (deployment rollouts, scaling events, manual restarts):

- **In-flight BullMQ jobs are abruptly terminated mid-execution.** The worker cannot update job status (mark as completed/failed), so jobs are retried from scratch when a new process starts, wasting API calls and processing time.
- **Redis connections are violently closed (TCP RST).** The Redis server has to detect the dropped connections via timeouts, wasting server resources.
- **Locks and lease keys expire naturally**, but the intervening window allows concurrent duplicate processing.

### 4. No Reconnection After Retry Exhaustion (HIGH)

**Files:** `backend/src/services/postScheduler.js:23-25`, `backend/src/services/jobAlertQueue.js:35-37` (before fix)

```js
retryStrategy: (times) => {
    if (times > 3) return null;  // ← gives up forever
    return Math.min(times * 200, 1000);
}
```

After 3 failed retry attempts, `retryStrategy` returns `null`, which tells IORedis to **permanently stop retrying**. The connection is dead forever. The application silently degrades with no recovery mechanism:

- Job alerts stop queuing and processing
- Post scheduling stops completely
- Rate limiting falls back to a fresh in-memory store (losing accumulated data)

The only recovery is a full process restart.

### 5. Worker Lifecycle Invisible (HIGH)

**File:** `backend/src/services/postScheduler.js:72` (before fix)

```js
const worker = new Worker(QUEUE_NAME, processor, { connection: workerConnection });
// ^--- local variable, never stored at module level
```

The BullMQ Worker is stored in a local `const` variable inside `initializePostScheduler()`. There is no module-level reference, meaning:

- The worker **can never be closed** during shutdown — `worker.close()` is unreachable
- Worker health **cannot be monitored** from outside the module
- If the worker enters an error state, it **cannot be restarted**

## Impact Summary

| Issue | Severity | Effect |
|-------|----------|--------|
| 1 | 🔴 Critical | Any Redis disconnect kills the process |
| 2 | 🔴 Critical | Runtime Redis errors kill the process after init |
| 3 | 🔴 Critical | In-flight jobs lost on restart, connection resources leaked |
| 4 | 🟠 High | Permanent degradation after transient failure; no recovery |
| 5 | 🟠 High | Worker can never be stopped or monitored |

## Root Cause

The codebase has **no shared infrastructure** for managing external connections. Each module independently:

1. Parses `REDIS_URL`
2. Creates an IORedis client with its own options
3. Registers error handlers (or forgets to)
4. Never cleans up on shutdown

This is a classic **connection management abstraction gap** — common in fast-moving codebases where Redis is added incrementally for different features (rate limiting → job alerts → post scheduling).

## Fix

See **PR #1711**.

The fix introduces a centralized `RedisManager` class (`backend/src/config/redis.js`) that:

- Creates every connection with **persistent** `on('error')`, `on('close')`, and `on('reconnecting')` handlers (never `once()`)
- Retries up to 10 times with exponential backoff before giving up
- Tracks BullMQ workers for lifecycle management
- Provides `shutdown()` that closes workers first, then all connections
- Reports connection health via `isHealthy(name)`

All three Redis-consuming modules (`postScheduler.js`, `jobAlertQueue.js`, `index.js`) are refactored to delegate to `RedisManager`, eliminating the ~40 lines of duplicated connection code and fixing all five issues.
