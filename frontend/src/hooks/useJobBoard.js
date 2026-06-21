import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { jobTrackerApi } from "../services/api";
import { auth } from "../config/firebase";
import {
  calculateJobStats,
  getQueuedStatusUpdates,
  loadJobTrackerSnapshot,
  queueStatusUpdate,
  removeQueuedStatusUpdates,
  saveJobTrackerSnapshot,
  saveJobTrackerStats,
} from "../utils/jobTrackerOffline";

function isNetworkError(error) {
  return (
    !navigator.onLine ||
    error?.name === "TypeError" ||
    error?.message?.toLowerCase().includes("failed to fetch")
  );
}

function isUnrecoverableStatusUpdateError(error) {
  return [400, 404, 422].includes(error?.status);
}

export function useJobBoard({ initialJobs, isControlled } = {}) {
  const [trackedJobs, setTrackedJobs] = useState(initialJobs || []);
  const [stats, setStats] = useState(isControlled && initialJobs ? calculateJobStats(initialJobs) : null);
  const [loading, setLoading] = useState(!isControlled);
  const [updateLoading, setUpdateLoading] = useState({});
  const [isOffline, setIsOffline] = useState(
    typeof navigator !== "undefined" ? !navigator.onLine : false
  );
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  const currentUserId = auth?.currentUser?.uid || "anonymous";

  const loadCachedTrackerData = useCallback(() => {
    const snapshot = loadJobTrackerSnapshot(currentUserId);
    if (!snapshot) return false;

    const cachedJobs = snapshot.trackedJobs || [];
    setTrackedJobs(cachedJobs);
    setStats(snapshot.stats || calculateJobStats(cachedJobs));
    setLastSyncedAt(snapshot.lastSyncedAt || null);
    return true;
  }, [currentUserId]);

  const persistTrackerSnapshot = useCallback((jobs, nextStats = null) => {
    const snapshot = saveJobTrackerSnapshot(currentUserId, jobs, nextStats);
    setLastSyncedAt(snapshot.lastSyncedAt);
    return snapshot;
  }, [currentUserId]);

  const fetchStats = useCallback(async () => {
    if (isControlled) return;
    try {
      const data = await jobTrackerApi.getStats();
      setStats(data.stats);
      const snapshot = saveJobTrackerStats(currentUserId, data.stats);
      setLastSyncedAt(snapshot.lastSyncedAt);
    } catch (error) {
      console.error("Error fetching stats:", error);
      const snapshot = loadJobTrackerSnapshot(currentUserId);
      if (snapshot?.stats) {
        setStats(snapshot.stats);
      }
    }
  }, [currentUserId]);

  const fetchJobs = useCallback(async () => {
    if (isControlled) return;
    try {
      setLoading(true);
      const data = await jobTrackerApi.getAll();
      const jobs = data.trackedJobs || [];
      setTrackedJobs(jobs);
      persistTrackerSnapshot(jobs, calculateJobStats(jobs));
      setIsOffline(false);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      const hasCachedData = loadCachedTrackerData();
      if (hasCachedData) {
        setIsOffline(true);
        toast("Showing saved Job Tracker data while offline", {
          id: "tracked-jobs-offline-cache",
        });
      } else {
        toast.error("Failed to load tracked jobs", { id: "tracked-jobs-load-error" });
      }
    } finally {
      setLoading(false);
    }
  }, [loadCachedTrackerData, persistTrackerSnapshot]);

  const queueOfflineStatusChange = useCallback((jobId, newStatus, jobsSnapshot) => {
    const updatedJobs = jobsSnapshot.map((job) =>
      job.id === jobId
        ? { ...job, status: newStatus, updatedAt: new Date().toISOString() }
        : job
    );
    const offlineStats = calculateJobStats(updatedJobs);
    const queue = queueStatusUpdate(currentUserId, jobId, newStatus);

    setTrackedJobs(updatedJobs);
    setStats(offlineStats);
    setPendingSyncCount(queue.length);
    setIsOffline(true);
    persistTrackerSnapshot(updatedJobs, offlineStats);
    toast.success("Status saved offline. It will sync when you reconnect.", {
      id: `tracked-job-offline-update-${jobId}`,
    });
  }, [currentUserId, persistTrackerSnapshot]);

  const syncPendingStatusUpdates = useCallback(async () => {
    if (isControlled) return;
    const queuedUpdates = getQueuedStatusUpdates(currentUserId);
    if (!queuedUpdates.length || !navigator.onLine) {
      setPendingSyncCount(queuedUpdates.length);
      return;
    }

    const syncedIds = [];
    let failedCount = 0;
    let discardedCount = 0;
    let stoppedForNetwork = false;

    for (const update of queuedUpdates) {
      try {
        await jobTrackerApi.updateStatus(update.jobId, update.status);
        syncedIds.push(update.id);
      } catch (error) {
        console.error("Error syncing offline job update:", error);
        if (isNetworkError(error)) {
          stoppedForNetwork = true;
          break;
        }
        if (isUnrecoverableStatusUpdateError(error)) {
          discardedCount += 1;
          syncedIds.push(update.id);
        } else {
          failedCount += 1;
        }
      }
    }

    const remainingUpdates = syncedIds.length
      ? removeQueuedStatusUpdates(currentUserId, syncedIds)
      : queuedUpdates;

    setPendingSyncCount(remainingUpdates.length);

    if (failedCount) {
      toast.error("Some offline updates could not be synced and will be retried");
    } else if (discardedCount) {
      toast.error("Some offline updates could not be applied");
    } else if (syncedIds.length && !stoppedForNetwork) {
      toast.success("Offline Job Tracker changes synced", {
        id: "tracked-job-offline-sync",
      });
    }
  }, [currentUserId]);

  const handleStatusUpdate = useCallback(async (jobId, newStatus) => {
    const previousJobs = trackedJobs;

    try {
      setUpdateLoading((prev) => ({ ...prev, [jobId]: true }));
      await jobTrackerApi.updateStatus(jobId, newStatus);

      const updatedJobs = previousJobs.map((job) =>
        job.id === jobId
          ? { ...job, status: newStatus, updatedAt: new Date().toISOString() }
          : job
      );
      setTrackedJobs(updatedJobs);
      persistTrackerSnapshot(updatedJobs, calculateJobStats(updatedJobs));

      toast.success("Status updated!");
      fetchStats();
    } catch (error) {
      console.error("Error updating status:", error);
      if (isNetworkError(error)) {
        queueOfflineStatusChange(jobId, newStatus, previousJobs);
      } else {
        toast.error("Failed to update status", { id: `tracked-job-update-error-${jobId}` });
      }
    } finally {
      setUpdateLoading((prev) => ({ ...prev, [jobId]: false }));
    }
  }, [trackedJobs, fetchStats, persistTrackerSnapshot, queueOfflineStatusChange]);

  const onDragEnd = useCallback(async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId;
    const previousJobs = trackedJobs;
    const updatedJobs = previousJobs.map((job) =>
      job.id === draggableId
        ? { ...job, status: newStatus, updatedAt: new Date().toISOString() }
        : job
    );
    
    // Optimistic UI update
    const updatedStats = calculateJobStats(updatedJobs);
    setTrackedJobs(updatedJobs);
    setStats(updatedStats);
    persistTrackerSnapshot(updatedJobs, updatedStats);

    // Backend update
    try {
      await jobTrackerApi.updateStatus(draggableId, newStatus);
      toast.success("Status updated!");
      fetchStats();
    } catch (error) {
      console.error("Error updating status:", error);
      if (isNetworkError(error)) {
        queueOfflineStatusChange(draggableId, newStatus, previousJobs);
      } else {
        toast.error("Failed to update status");
        const previousStats = calculateJobStats(previousJobs);
        setTrackedJobs(previousJobs);
        setStats(previousStats);
        persistTrackerSnapshot(previousJobs, previousStats);
      }
    }
  }, [trackedJobs, fetchStats, persistTrackerSnapshot, queueOfflineStatusChange]);

  const handleDelete = useCallback(async (jobId) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this job from your tracker?"
      )
    ) {
      return;
    }

    try {
      await jobTrackerApi.delete(jobId);
      const updatedJobs = trackedJobs.filter((job) => job.id !== jobId);
      setTrackedJobs(updatedJobs);
      persistTrackerSnapshot(updatedJobs, calculateJobStats(updatedJobs));
      toast.success("Job removed from tracker");
      fetchStats();
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to remove job", { id: `tracked-job-delete-error-${jobId}` });
    }
  }, [trackedJobs, fetchStats, persistTrackerSnapshot]);

  const handleSaveNote = useCallback(async (jobId, noteContent) => {
    const trimmed = noteContent.trim();
    if (!trimmed) {
      return false;
    }
    try {
      const job = trackedJobs.find((j) => j.id === jobId);
      if (!job) return false;
      await jobTrackerApi.updateStatus(jobId, job.status, trimmed);
      const newNote = { content: trimmed, createdAt: new Date().toISOString() };
      const updatedJobs = trackedJobs.map((j) =>
        j.id === jobId
          ? { ...j, notes: [...(j.notes || []), newNote] }
          : j
      );
      setTrackedJobs(updatedJobs);
      persistTrackerSnapshot(updatedJobs, calculateJobStats(updatedJobs));
      toast.success("Note saved!");
      return true;
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note");
      return false;
    }
  }, [trackedJobs, persistTrackerSnapshot]);

  useEffect(() => {
    if (initialJobs !== undefined) {
      setTrackedJobs(initialJobs);
      setStats(calculateJobStats(initialJobs));
      setLoading(false);
    } else {
      fetchJobs();
      fetchStats();
    }
  }, [fetchJobs, fetchStats, initialJobs]);

  useEffect(() => {
    const updateConnectionState = () => {
      setIsOffline(!navigator.onLine);
    };

    const handleOnline = async () => {
      setIsOffline(false);
      await syncPendingStatusUpdates();
      await fetchJobs();
      await fetchStats();
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    setPendingSyncCount(getQueuedStatusUpdates(currentUserId).length);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    updateConnectionState();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [currentUserId, fetchJobs, fetchStats, syncPendingStatusUpdates]);

  return {
    trackedJobs,
    stats,
    loading,
    updateLoading,
    isOffline,
    lastSyncedAt,
    pendingSyncCount,
    fetchJobs,
    fetchStats,
    syncPendingStatusUpdates,
    handleStatusUpdate,
    onDragEnd,
    handleDelete,
    handleSaveNote,
  };
}
