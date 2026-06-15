import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { toast } from "react-hot-toast";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  Trash2,
  ExternalLink,
  Plus,
  RefreshCw,
  Sparkles,
  WifiOff,
  GripVertical,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { jobTrackerApi } from "../../services/api";
import { auth } from "../../config/firebase";
import { SkeletonTracker } from "../ui/Skeleton";
import {
  calculateJobStats,
  getQueuedStatusUpdates,
  loadJobTrackerSnapshot,
  queueStatusUpdate,
  removeQueuedStatusUpdates,
  saveJobTrackerSnapshot,
  saveJobTrackerStats,
} from "../../utils/jobTrackerOffline";

const STATUS_COLUMNS = [
  { value: "saved", label: "Saved", color: "bg-muted-foreground" },
  { value: "applied", label: "Applied", color: "bg-blue-500" },
  { value: "interviewing", label: "Interviewing", color: "bg-yellow-500" },
  { value: "offered", label: "Offered", color: "bg-green-500" },
  { value: "rejected", label: "Rejected", color: "bg-red-500" },
];

const STATUS_ICONS = {
  saved: "📌",
  applied: "✉️",
  interviewing: "🎤",
  offered: "🎉",
  rejected: "❌",
};

function formatDate(date) {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(date) {
  if (!date) return "not synced yet";
  return new Date(date).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

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

const JobCard = memo(function JobCard({
  job,
  index,
  onDelete,
}) {
  return (
    <Draggable key={job.id} draggableId={job.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={provided.draggableProps.style}
          className={cn(
            "bg-card rounded-xl border shadow-sm transition-all",
            snapshot.isDragging
              ? "shadow-2xl shadow-primary/20 scale-[1.02] z-50 border-primary ring-2 ring-primary/20"
              : "border-border/60 hover:border-primary/40"
          )}
        >
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div
                {...provided.dragHandleProps}
                className="mt-1 flex shrink-0 cursor-grab active:cursor-grabbing touch-none p-2 -ml-1 -mt-1 rounded-md hover:bg-muted/50 transition-colors"
                aria-label={`Drag ${job.title}`}
              >
                <GripVertical className="w-5 h-5 text-muted-foreground/50" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-foreground text-sm leading-tight line-clamp-2">
                    {job.title || "Untitled Position"}
                  </h4>
                  <button
                    onClick={() => onDelete(job.id)}
                    className="shrink-0 text-muted-foreground/50 hover:text-red-500 transition-colors p-1 -mr-1 -mt-1"
                    aria-label={`Remove ${job.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-primary font-semibold text-xs mt-1 tracking-wide">
                  {job.company || "Unknown Company"}
                </p>

                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[11px] font-medium text-muted-foreground">
                  {job.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-foreground/40" />
                      {job.location}
                    </span>
                  )}
                  {job.salary && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-foreground/40" />
                      {job.salary}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-foreground/40" />
                    {formatDate(job.createdAt)}
                  </span>
                </div>

                <div className="flex gap-2 mt-3 pt-3 border-t border-border/50">
                  {job.applyLink && (
                    <a
                      href={job.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 py-2.5 rounded-lg text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Apply
                    </a>
                  )}
                  <button
                    type="button"
                    className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary py-2.5 rounded-lg text-xs font-bold text-center transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Research
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
});

function StatsRow({ stats, onRefresh }) {
  const items = useMemo(
    () => [
      { label: "Total", value: stats?.total ?? 0 },
      { label: "Saved", value: stats?.saved ?? 0 },
      { label: "Applied", value: stats?.applied ?? 0 },
      { label: "Interview", value: stats?.interviewing ?? 0 },
      { label: "Offered", value: stats?.offered ?? 0 },
    ],
    [stats]
  );

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          onClick={onRefresh}
          className="shrink-0 flex flex-col items-center justify-center bg-background/50 border border-border/60 rounded-xl px-4 py-2.5 min-w-[68px] min-h-[56px]"
        >
          <span className="text-lg font-bold text-foreground leading-none">
            {item.value}
          </span>
          <span className="text-[10px] font-medium text-muted-foreground mt-0.5">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
}

function EmptyKanban() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <Briefcase className="w-16 h-16 text-muted-foreground/60 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-1">
        No Tracked Jobs Yet
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-6 max-w-xs">
        Start tracking jobs from the job search page to see them here
      </p>
      <a
        href="/jobs"
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-bold min-h-[44px]"
      >
        <Plus className="w-5 h-5" />
        Find Jobs
      </a>
    </div>
  );
}

function OfflineBanner({
  isOffline,
  pendingSyncCount,
  lastSyncedAt,
  isSyncing,
  onSync,
}) {
  if (!isOffline && pendingSyncCount === 0) return null;

  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mb-4">
      <div className="flex items-center gap-3">
        <WifiOff className="w-5 h-5 text-amber-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">
            {isOffline ? "Offline mode" : "Pending sync"}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {isOffline
              ? `Showing data from ${formatDateTime(lastSyncedAt)}`
              : `${pendingSyncCount} update${pendingSyncCount > 1 ? "s" : ""} waiting to sync`}
          </p>
        </div>
        {!isOffline && (
          <button
            type="button"
            onClick={onSync}
            disabled={isSyncing}
            className="shrink-0 flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-600 px-3 py-2 rounded-lg text-xs font-bold min-h-[36px] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isSyncing && "animate-spin")} />
            Sync
          </button>
        )}
      </div>
    </div>
  );
}

function FilterBar({ columns, activeFilter, onFilterChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4">
      <button
        type="button"
        onClick={() => onFilterChange("all")}
        className={cn(
          "shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors min-h-[40px]",
          activeFilter === "all"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground hover:bg-muted/80"
        )}
      >
        All
      </button>
      {columns.map((col) => (
        <button
          key={col.value}
          type="button"
          onClick={() => onFilterChange(col.value)}
          className={cn(
            "shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors min-h-[40px] flex items-center gap-1.5",
            activeFilter === col.value
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground hover:bg-muted/80"
          )}
        >
          <span>{STATUS_ICONS[col.value]}</span>
          {col.label}
        </button>
      ))}
    </div>
  );
}

function KanbanColumn({ column, jobs, onDelete }) {
  return (
    <div className="bg-muted/20 rounded-2xl border border-border/40 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
          <span>{STATUS_ICONS[column.value]}</span>
          {column.label}
        </h3>
        <span className="bg-background px-2.5 py-0.5 rounded-full text-xs font-black border border-border text-muted-foreground min-w-[28px] text-center">
          {jobs.length}
        </span>
      </div>

      <Droppable droppableId={column.value}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              "flex flex-col gap-3 p-3 min-h-[120px] transition-colors",
              snapshot.isDraggingOver
                ? "bg-primary/5"
                : ""
            )}
          >
            {jobs.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-xs font-medium text-muted-foreground">
                  Drop jobs here
                </p>
              </div>
            )}
            {jobs.map((job, index) => (
              <JobCard
                key={job.id}
                job={job}
                index={index}
                onDelete={onDelete}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

/** Touch-friendly Kanban board for tracking job applications on mobile.
 * @param {Object}        props
 * @param {Array}         props.initialJobs         - Pre-loaded jobs (controlled mode; skips API fetch)
 * @param {Function}      props.onStatusUpdate      - Callback when a job is dragged to a new column
 * @param {Function}      props.onDelete            - Callback when a job card is removed
 * @param {string}        props.className           - Additional CSS classes
 */
export default function MobileKanban({
  initialJobs,
  onStatusUpdate: externalOnStatusUpdate,
  onDelete: externalOnDelete,
  className,
}) {
  const isControlled = initialJobs !== undefined;
  const [trackedJobs, setTrackedJobs] = useState(initialJobs || []);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(initialJobs === undefined);
  const [isOffline, setIsOffline] = useState(
    typeof navigator !== "undefined" ? !navigator.onLine : false
  );
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [filterStatus, setFilterStatus] = useState("all");
  const [isSyncing, setIsSyncing] = useState(false);

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

  const persistTrackerSnapshot = useCallback(
    (jobs, nextStats = null) => {
      const snapshot = saveJobTrackerSnapshot(currentUserId, jobs, nextStats);
      setLastSyncedAt(snapshot.lastSyncedAt);
      return snapshot;
    },
    [currentUserId]
  );

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
          id: "mobile-kanban-offline-cache",
        });
      } else {
        toast.error("Failed to load tracked jobs", {
          id: "mobile-kanban-load-error",
        });
      }
    } finally {
      setLoading(false);
    }
  }, [isControlled, persistTrackerSnapshot, loadCachedTrackerData]);

  const fetchStats = useCallback(async () => {
    if (isControlled) return;
    try {
      const data = await jobTrackerApi.getStats();
      setStats(data.stats);
      saveJobTrackerStats(currentUserId, data.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      const snapshot = loadJobTrackerSnapshot(currentUserId);
      if (snapshot?.stats) {
        setStats(snapshot.stats);
      }
    }
  }, [isControlled, currentUserId]);

  useEffect(() => {
    if (initialJobs !== undefined) {
      setTrackedJobs(initialJobs);
      setStats(calculateJobStats(initialJobs));
      setLoading(false);
    } else {
      fetchJobs();
      fetchStats();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isControlled) return;
    const handleOnline = async () => {
      setIsOffline(false);
      await syncPendingStatusUpdates();
      await fetchJobs();
      await fetchStats();
    };
    const handleOffline = () => {
      setIsOffline(true);
    };
    const updateConnectionState = () => {
      setIsOffline(!navigator.onLine);
    };

    setPendingSyncCount(getQueuedStatusUpdates(currentUserId).length);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    updateConnectionState();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [currentUserId, isControlled]); // eslint-disable-line react-hooks/exhaustive-deps

  const queueOfflineStatusChange = useCallback(
    (jobId, newStatus, jobsSnapshot) => {
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
        id: `mobile-kanban-offline-update-${jobId}`,
      });
    },
    [currentUserId, persistTrackerSnapshot]
  );

  const syncPendingStatusUpdates = async () => {
    if (isControlled || isSyncing) return;
    const queuedUpdates = getQueuedStatusUpdates(currentUserId);
    if (!queuedUpdates.length || !navigator.onLine) {
      setPendingSyncCount(queuedUpdates.length);
      return;
    }

    setIsSyncing(true);
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
    setIsSyncing(false);

    if (failedCount) {
      toast.error("Some offline updates could not be synced and will be retried");
    } else if (discardedCount) {
      toast.error("Some offline updates could not be applied");
    } else if (syncedIds.length && !stoppedForNetwork) {
      toast.success("Offline Job Tracker changes synced", {
        id: "mobile-kanban-offline-sync",
      });
    }
  };

  const handleDelete = useCallback(
    async (jobId) => {
      if (externalOnDelete) {
        externalOnDelete(jobId);
        return;
      }
      try {
        await jobTrackerApi.delete(jobId);
        const updatedJobs = trackedJobs.filter((job) => job.id !== jobId);
        setTrackedJobs(updatedJobs);
        persistTrackerSnapshot(updatedJobs, calculateJobStats(updatedJobs));
        toast.success("Job removed from tracker");
        if (!isControlled) fetchStats();
      } catch (error) {
        console.error("Error deleting job:", error);
        toast.error("Failed to remove job", {
          id: `mobile-kanban-delete-error-${jobId}`,
        });
      }
    },
    [trackedJobs, externalOnDelete, isControlled, persistTrackerSnapshot, fetchStats]
  );

  const onDragEnd = useCallback(
    async (result) => {
      const { destination, source, draggableId } = result;

      if (!destination) return;

      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      const newStatus = destination.droppableId;

      if (externalOnStatusUpdate) {
        externalOnStatusUpdate(draggableId, newStatus);
        return;
      }

      const previousJobs = trackedJobs;
      const updatedJobs = previousJobs.map((job) =>
        job.id === draggableId
          ? { ...job, status: newStatus, updatedAt: new Date().toISOString() }
          : job
      );

      const updatedStats = calculateJobStats(updatedJobs);
      setTrackedJobs(updatedJobs);
      setStats(updatedStats);
      persistTrackerSnapshot(updatedJobs, updatedStats);

      try {
        await jobTrackerApi.updateStatus(draggableId, newStatus);
        toast.success("Status updated!");
        if (!isControlled) fetchStats();
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
    },
    [
      trackedJobs,
      externalOnStatusUpdate,
      isControlled,
      persistTrackerSnapshot,
      queueOfflineStatusChange,
      fetchStats,
    ]
  );

  const filteredColumns = useMemo(() => {
    if (filterStatus === "all") return STATUS_COLUMNS;
    return STATUS_COLUMNS.filter((col) => col.value === filterStatus);
  }, [filterStatus]);

  const columnJobsMap = useMemo(() => {
    const map = {};
    for (const col of STATUS_COLUMNS) {
      map[col.value] = trackedJobs.filter((j) => j.status === col.value);
    }
    return map;
  }, [trackedJobs]);

  const totalJobs = trackedJobs.length;

  if (loading) {
    return (
      <div className={cn("", className)}>
        <SkeletonTracker />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4 pb-8", className)}>
      <OfflineBanner
        isOffline={isOffline}
        pendingSyncCount={pendingSyncCount}
        lastSyncedAt={lastSyncedAt}
        isSyncing={isSyncing}
        onSync={async () => {
          await syncPendingStatusUpdates();
          await fetchJobs();
          await fetchStats();
        }}
      />

      {stats && (
        <StatsRow stats={stats} onRefresh={fetchStats} />
      )}

      <FilterBar
        columns={STATUS_COLUMNS}
        activeFilter={filterStatus}
        onFilterChange={setFilterStatus}
      />

      {totalJobs === 0 ? (
        <EmptyKanban />
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex flex-col gap-4">
            {filteredColumns.map((column) => (
              <KanbanColumn
                key={column.value}
                column={column}
                jobs={columnJobsMap[column.value]}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </DragDropContext>
      )}
    </div>
  );
}
