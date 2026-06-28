import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { jobTrackerApi } from "../services/api";
import { auth } from "../config/firebase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  const currentUserId = auth?.currentUser?.uid || "anonymous";

  const [updateLoading, setUpdateLoading] = useState({});
  const [isOffline, setIsOffline] = useState(
    typeof navigator !== "undefined" ? !navigator.onLine : false
  );
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);

  // Fallback to local storage cache 
  const getCachedJobs = useCallback(() => {
    const snapshot = loadJobTrackerSnapshot(currentUserId);
    return snapshot ? (snapshot.trackedJobs || []) : [];
  }, [currentUserId]);

  const getCachedStats = useCallback(() => {
    const snapshot = loadJobTrackerSnapshot(currentUserId);
    return snapshot ? (snapshot.stats || calculateJobStats([])) : calculateJobStats([]);
  }, [currentUserId]);

  const persistTrackerSnapshot = useCallback((jobs, nextStats = null) => {
    const snapshot = saveJobTrackerSnapshot(currentUserId, jobs, nextStats);
    setLastSyncedAt(snapshot.lastSyncedAt);
    return snapshot;
  }, [currentUserId]);

  // Queries
  const { data: trackedJobs = getCachedJobs(), isLoading: jobsLoading, refetch: fetchJobs } = useQuery({
    queryKey: ['trackedJobs', currentUserId],
    queryFn: async () => {
      const data = await jobTrackerApi.getAll();
      const jobs = data.trackedJobs || [];
      persistTrackerSnapshot(jobs, calculateJobStats(jobs));
      setIsOffline(false);
      return jobs;
    },
    enabled: !isControlled,
    initialData: initialJobs,
  });

  const { data: stats = getCachedStats(), refetch: fetchStats } = useQuery({
    queryKey: ['jobStats', currentUserId],
    queryFn: async () => {
      const data = await jobTrackerApi.getStats();
      const snapshot = saveJobTrackerStats(currentUserId, data.stats);
      setLastSyncedAt(snapshot.lastSyncedAt);
      return data.stats;
    },
    enabled: !isControlled,
    initialData: isControlled && initialJobs ? calculateJobStats(initialJobs) : undefined,
  });

  const loading = jobsLoading && !initialJobs;

  // Offline queue helper
  const queueOfflineStatusChange = useCallback((jobId, newStatus, jobsSnapshot) => {
    const updatedJobs = jobsSnapshot.map((job) =>
      job.id === jobId
        ? { ...job, status: newStatus, updatedAt: new Date().toISOString() }
        : job
    );
    const offlineStats = calculateJobStats(updatedJobs);
    const queue = queueStatusUpdate(currentUserId, jobId, newStatus);

    queryClient.setQueryData(['trackedJobs', currentUserId], updatedJobs);
    queryClient.setQueryData(['jobStats', currentUserId], offlineStats);
    setPendingSyncCount(queue.length);
    setIsOffline(true);
    persistTrackerSnapshot(updatedJobs, offlineStats);
    toast.success("Status saved offline. It will sync when you reconnect.", {
      id: `tracked-job-offline-update-${jobId}`,
    });
  }, [currentUserId, persistTrackerSnapshot, queryClient]);

  // Mutations
  const updateStatusMutation = useMutation({
    mutationFn: ({ jobId, newStatus, note }) => jobTrackerApi.updateStatus(jobId, newStatus, note),
    onMutate: async ({ jobId, newStatus }) => {
      await queryClient.cancelQueries({ queryKey: ['trackedJobs', currentUserId] });
      await queryClient.cancelQueries({ queryKey: ['jobStats', currentUserId] });

      const previousJobs = queryClient.getQueryData(['trackedJobs', currentUserId]) || [];
      const updatedJobs = previousJobs.map((job) =>
        job.id === jobId
          ? { ...job, status: newStatus, updatedAt: new Date().toISOString() }
          : job
      );

      queryClient.setQueryData(['trackedJobs', currentUserId], updatedJobs);
      const newStats = calculateJobStats(updatedJobs);
      queryClient.setQueryData(['jobStats', currentUserId], newStats);
      persistTrackerSnapshot(updatedJobs, newStats);

      return { previousJobs };
    },
    onError: (err, variables, context) => {
      console.error("Error updating status:", err);
      if (isNetworkError(err)) {
        queueOfflineStatusChange(variables.jobId, variables.newStatus, context.previousJobs);
      } else {
        toast.error("Failed to update status");
        queryClient.setQueryData(['trackedJobs', currentUserId], context.previousJobs);
        const prevStats = calculateJobStats(context.previousJobs);
        queryClient.setQueryData(['jobStats', currentUserId], prevStats);
        persistTrackerSnapshot(context.previousJobs, prevStats);
      }
    },
    onSettled: (data, error, variables) => {
      setUpdateLoading((prev) => ({ ...prev, [variables.jobId]: false }));
      if (!error || isNetworkError(error)) {
        // If success, we already updated optimistically, but let's invalidate to be safe if online
        if (!isNetworkError(error)) {
          toast.success("Status updated!");
          queryClient.invalidateQueries({ queryKey: ['jobStats', currentUserId] });
        }
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (jobId) => jobTrackerApi.delete(jobId),
    onMutate: async (jobId) => {
      await queryClient.cancelQueries({ queryKey: ['trackedJobs', currentUserId] });
      const previousJobs = queryClient.getQueryData(['trackedJobs', currentUserId]) || [];
      const updatedJobs = previousJobs.filter((job) => job.id !== jobId);
      
      queryClient.setQueryData(['trackedJobs', currentUserId], updatedJobs);
      queryClient.setQueryData(['jobStats', currentUserId], calculateJobStats(updatedJobs));
      persistTrackerSnapshot(updatedJobs, calculateJobStats(updatedJobs));
      
      return { previousJobs };
    },
    onError: (err, jobId, context) => {
      console.error("Error deleting job:", err);
      toast.error("Failed to remove job");
      queryClient.setQueryData(['trackedJobs', currentUserId], context.previousJobs);
      queryClient.setQueryData(['jobStats', currentUserId], calculateJobStats(context.previousJobs));
      persistTrackerSnapshot(context.previousJobs, calculateJobStats(context.previousJobs));
    },
    onSuccess: () => {
      toast.success("Job removed from tracker");
      queryClient.invalidateQueries({ queryKey: ['jobStats', currentUserId] });
    }
  });

  const saveNoteMutation = useMutation({
    mutationFn: async ({ jobId, noteContent }) => {
      const job = trackedJobs.find((j) => j.id === jobId);
      if (!job) throw new Error("Job not found");
      await jobTrackerApi.updateStatus(jobId, job.status, noteContent);
      return { jobId, noteContent };
    },
    onSuccess: ({ jobId, noteContent }) => {
      const newNote = { content: noteContent, createdAt: new Date().toISOString() };
      queryClient.setQueryData(['trackedJobs', currentUserId], (old) => {
        const updated = (old || []).map((j) =>
          j.id === jobId ? { ...j, notes: [...(j.notes || []), newNote] } : j
        );
        persistTrackerSnapshot(updated, calculateJobStats(updated));
        return updated;
      });
      toast.success("Note saved!");
    },
    onError: (err) => {
      console.error("Error saving note:", err);
      toast.error("Failed to save note");
    }
  });

  // Action Handlers
  const handleStatusUpdate = useCallback(async (jobId, newStatus) => {
    setUpdateLoading((prev) => ({ ...prev, [jobId]: true }));
    updateStatusMutation.mutate({ jobId, newStatus });
  }, [updateStatusMutation]);

  const onDragEnd = useCallback(async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    updateStatusMutation.mutate({ jobId: draggableId, newStatus: destination.droppableId });
  }, [updateStatusMutation]);

  const handleDelete = useCallback(async (jobId) => {
    if (!window.confirm("Are you sure you want to remove this job from your tracker?")) return;
    deleteMutation.mutate(jobId);
  }, [deleteMutation]);

  const handleSaveNote = useCallback(async (jobId, noteContent) => {
    const trimmed = noteContent.trim();
    if (!trimmed) return false;
    try {
      await saveNoteMutation.mutateAsync({ jobId, noteContent: trimmed });
      return true;
    } catch {
      return false;
    }
  }, [saveNoteMutation]);

  // Sync logic
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

    if (failedCount) toast.error("Some offline updates could not be synced and will be retried");
    else if (discardedCount) toast.error("Some offline updates could not be applied");
    else if (syncedIds.length && !stoppedForNetwork) {
      toast.success("Offline Job Tracker changes synced", { id: "tracked-job-offline-sync" });
    }
  }, [currentUserId, isControlled]);

  // Event listeners for offline/online
  useEffect(() => {
    const updateConnectionState = () => setIsOffline(!navigator.onLine);

    const handleOnline = async () => {
      setIsOffline(false);
      await syncPendingStatusUpdates();
      queryClient.invalidateQueries({ queryKey: ['trackedJobs', currentUserId] });
      queryClient.invalidateQueries({ queryKey: ['jobStats', currentUserId] });
    };

    const handleOffline = () => setIsOffline(true);

    setPendingSyncCount(getQueuedStatusUpdates(currentUserId).length);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    updateConnectionState();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [currentUserId, syncPendingStatusUpdates, queryClient]);

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
