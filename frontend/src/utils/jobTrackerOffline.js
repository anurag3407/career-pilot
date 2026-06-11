const SNAPSHOT_PREFIX = "careerPilot.jobTracker.snapshot";
const QUEUE_PREFIX = "careerPilot.jobTracker.statusQueue";

const statusKeys = ["saved", "applied", "interviewing", "offered", "rejected"];

function scopedKey(prefix, userId) {
  return `${prefix}.${userId || "anonymous"}`;
}

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can fail in private browsing or quota-limited environments.
  }
}

export function calculateJobStats(jobs = []) {
  return jobs.reduce(
    (stats, job) => {
      const status = statusKeys.includes(job.status) ? job.status : "saved";
      stats[status] += 1;
      stats.total += 1;
      return stats;
    },
    {
      total: 0,
      saved: 0,
      applied: 0,
      interviewing: 0,
      offered: 0,
      rejected: 0,
    },
  );
}

export function loadJobTrackerSnapshot(userId) {
  return readJson(scopedKey(SNAPSHOT_PREFIX, userId), null);
}

export function saveJobTrackerSnapshot(userId, trackedJobs = [], stats = null) {
  const snapshot = {
    trackedJobs,
    stats: stats || calculateJobStats(trackedJobs),
    lastSyncedAt: new Date().toISOString(),
  };

  writeJson(scopedKey(SNAPSHOT_PREFIX, userId), snapshot);
  return snapshot;
}

export function saveJobTrackerStats(userId, stats = null) {
  const previousSnapshot = loadJobTrackerSnapshot(userId);
  const trackedJobs = previousSnapshot?.trackedJobs || [];
  const snapshot = {
    trackedJobs,
    stats: stats || calculateJobStats(trackedJobs),
    lastSyncedAt: new Date().toISOString(),
  };

  writeJson(scopedKey(SNAPSHOT_PREFIX, userId), snapshot);
  return snapshot;
}

export function getQueuedStatusUpdates(userId) {
  return readJson(scopedKey(QUEUE_PREFIX, userId), []);
}

export function queueStatusUpdate(userId, jobId, status) {
  const key = scopedKey(QUEUE_PREFIX, userId);
  const existing = getQueuedStatusUpdates(userId).filter(
    (update) => update.jobId !== jobId,
  );

  const nextQueue = [
    ...existing,
    {
      id: `${jobId}-${Date.now()}`,
      jobId,
      status,
      queuedAt: new Date().toISOString(),
    },
  ];

  writeJson(key, nextQueue);
  return nextQueue;
}

export function removeQueuedStatusUpdates(userId, updateIds = []) {
  const key = scopedKey(QUEUE_PREFIX, userId);
  const nextQueue = getQueuedStatusUpdates(userId).filter(
    (update) => !updateIds.includes(update.id),
  );

  writeJson(key, nextQueue);
  return nextQueue;
}
