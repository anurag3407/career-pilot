import { useState, useEffect, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { AnimatePresence } from "framer-motion";
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
  StickyNote,
  Send,
  X,
  Mail,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { jobTrackerApi } from "../services/api";
import { auth } from "../config/firebase";
import Button from "../components/Button";
import Card from "../components/Card";
import CompanyResearch from "../components/CompanyResearch";
import EmailGeneratorPanel from "../components/EmailGeneratorPanel";
import OutreachPanel from "../components/OutreachPanel";
import { SkeletonTracker } from "../components/ui/Skeleton";
import {
  calculateJobStats,
  getQueuedStatusUpdates,
  loadJobTrackerSnapshot,
  queueStatusUpdate,
  removeQueuedStatusUpdates,
  saveJobTrackerStats,
  saveJobTrackerSnapshot,
} from "../utils/jobTrackerOffline";

// ─── Deadline utilities ────────────────────────────────────────────────────────

const MS_48H = 48 * 60 * 60 * 1000;

/**
 * Returns 'passed' | 'today' | 'closing-soon' | null
 */
function getDeadlineStatus(deadline) {
  if (!deadline) return null;
  const now = new Date();
  const dl = new Date(deadline);
  const ms = dl - now;

  if (ms < 0) return "passed";

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  if (dl <= todayEnd) return "today";

  if (ms <= MS_48H) return "closing-soon";
  return null;
}

function formatDeadline(deadline) {
  if (!deadline) return null;
  return new Date(deadline).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Convert a Date (or ISO string) to YYYY-MM-DD for <input type="date"> */
function toDateInputValue(deadline) {
  if (!deadline) return "";
  const d = new Date(deadline);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function DeadlineBadge({ status }) {
  if (status === "passed") {
    return (
      <span data-testid="deadline-badge-passed" className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/15 text-red-500 border border-red-500/30">
        <AlertCircle className="w-2.5 h-2.5" aria-hidden="true" />
        Deadline Passed
      </span>
    );
  }
  if (status === "today" || status === "closing-soon") {
    return (
      <span data-testid="deadline-badge-closing-soon" className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-600 border border-amber-500/30">
        <Clock className="w-2.5 h-2.5" aria-hidden="true" />
        Closing Soon
      </span>
    );
  }
  return null;
}

function DeadlinePicker({ job, onUpdate, loading }) {
  const [editing, setEditing] = useState(false);

  const handleChange = async (e) => {
    const rawValue = e.target.value;
    const deadline = rawValue ? new Date(rawValue + "T23:59:59.000Z").toISOString() : null;
    setEditing(false);
    await onUpdate(job.id, deadline);
  };

  const currentValue = toDateInputValue(job.deadline);

  return (
    <div className="flex items-center gap-1 mt-1">
      <Calendar className="w-3 h-3 text-foreground/40 shrink-0" aria-hidden="true" />
      {editing ? (
        <input
          type="date"
          defaultValue={currentValue}
          onChange={handleChange}
          onBlur={() => setEditing(false)}
          autoFocus
          aria-label="Set application deadline"
          className="text-[11px] bg-background border border-border rounded px-1 py-0.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary w-full"
        />
      ) : (
        <button
          onClick={() => setEditing(true)}
          disabled={loading}
          aria-label={job.deadline ? `Deadline: ${formatDeadline(job.deadline)}. Click to change.` : "Set deadline"}
          className="text-[11px] text-muted-foreground hover:text-primary transition-colors text-left truncate disabled:opacity-50"
        >
          {loading ? "Saving…" : job.deadline ? `Due ${formatDeadline(job.deadline)}` : "+ Set deadline"}
        </button>
      )}
      {job.deadline && !editing && !loading && (
        <button
          onClick={() => onUpdate(job.id, null)}
          aria-label="Remove deadline"
          className="text-muted-foreground/40 hover:text-red-400 transition-colors shrink-0"
        >
          <X className="w-2.5 h-2.5" />
        </button>
      )}
    </div>
  );
}

function ClosingTodayBanner({ jobs, onDismiss }) {
  if (!jobs.length) return null;

  return (
    <AnimatePresence>
      <div
        className="mb-6 flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3"
        role="alert"
        aria-live="polite"
      >
        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-red-600">
            {jobs.length === 1
              ? "1 application deadline is today!"
              : `${jobs.length} application deadlines are today!`}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {jobs.map((j) => `${j.title} at ${j.company}`).join(" · ")}
          </p>
        </div>
        <button
          onClick={onDismiss}
          aria-label="Dismiss banner"
          className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </AnimatePresence>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const JobTracker = () => {
  const [trackedJobs, setTrackedJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [deadlineFilter, setDeadlineFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [deadlineLoading, setDeadlineLoading] = useState({});
  const [researchCompany, setResearchCompany] = useState(null);
  const [isOffline, setIsOffline] = useState(
    typeof navigator !== "undefined" ? !navigator.onLine : false,
  );
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [noteEditing, setNoteEditing] = useState(null);
  const [noteText, setNoteText] = useState("");
  const [emailGeneratorJob, setEmailGeneratorJob] = useState(null);
  const [outreachJob, setOutreachJob] = useState(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const currentUserId = auth?.currentUser?.uid || "anonymous";

  const statusOptions = [
    { value: "saved", label: "Saved", color: "bg-muted-foreground", icon: "📌" },
    { value: "applied", label: "Applied", color: "bg-blue-500", icon: "✉️" },
    { value: "interviewing", label: "Interviewing", color: "bg-yellow-500", icon: "🎤" },
    { value: "offered", label: "Offered", color: "bg-green-500", icon: "🎉" },
    { value: "rejected", label: "Rejected", color: "bg-red-500", icon: "❌" },
  ];

  const isNetworkError = (error) =>
    isOffline ||
    !navigator.onLine ||
    error?.name === "TypeError" ||
    error?.message?.toLowerCase().includes("failed to fetch");

  const isUnrecoverableStatusUpdateError = (error) =>
    [400, 404, 422].includes(error?.status);

  const loadCachedTrackerData = () => {
    const snapshot = loadJobTrackerSnapshot(currentUserId);
    if (!snapshot) return false;
    const cachedJobs = snapshot.trackedJobs || [];
    setTrackedJobs(cachedJobs);
    setStats(snapshot.stats || calculateJobStats(cachedJobs));
    setLastSyncedAt(snapshot.lastSyncedAt || null);
    return true;
  };

  const persistTrackerSnapshot = (jobs, nextStats = null) => {
    const snapshot = saveJobTrackerSnapshot(currentUserId, jobs, nextStats);
    setLastSyncedAt(snapshot.lastSyncedAt);
    return snapshot;
  };

  const fetchJobs = useCallback(async () => {
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
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const data = await jobTrackerApi.getStats();
      setStats(data.stats);
      const snapshot = saveJobTrackerStats(currentUserId, data.stats);
      setLastSyncedAt(snapshot.lastSyncedAt);
    } catch (error) {
      console.error("Error fetching stats:", error);
      const snapshot = loadJobTrackerSnapshot(currentUserId);
      if (snapshot?.stats) setStats(snapshot.stats);
    }
  }, [currentUserId]);

  const queueOfflineStatusChange = (jobId, newStatus, jobsSnapshot) => {
    const updatedJobs = jobsSnapshot.map((job) =>
      job.id === jobId
        ? { ...job, status: newStatus, updatedAt: new Date().toISOString() }
        : job,
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
  };

  const syncPendingStatusUpdates = useCallback(async () => {
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
        if (isNetworkError(error)) { stoppedForNetwork = true; break; }
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
      toast.success("Offline Job Tracker changes synced", { id: "tracked-job-offline-sync" });
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchJobs();
    fetchStats();
  }, [fetchJobs, fetchStats]);

  useEffect(() => {
    const handleOnline = async () => {
      setIsOffline(false);
      await syncPendingStatusUpdates();
      await fetchJobs();
      await fetchStats();
    };
    const handleOffline = () => setIsOffline(true);
    setPendingSyncCount(getQueuedStatusUpdates(currentUserId).length);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [currentUserId, fetchJobs, fetchStats, syncPendingStatusUpdates]);

  useEffect(() => {
    setBannerDismissed(false);
  }, [trackedJobs.length]);

  const handleDeadlineUpdate = async (jobId, deadline) => {
    try {
      setDeadlineLoading((prev) => ({ ...prev, [jobId]: true }));
      const result = await jobTrackerApi.updateDeadline(jobId, deadline);
      setTrackedJobs((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, deadline: result.data?.deadline ?? null } : job,
        ),
      );
      toast.success(deadline ? "Deadline set!" : "Deadline removed");
    } catch (error) {
      console.error("Error updating deadline:", error);
      toast.error("Failed to update deadline", { id: `deadline-update-error-${jobId}` });
    } finally {
      setDeadlineLoading((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    const newStatus = destination.droppableId;
    const previousJobs = trackedJobs;
    const updatedJobs = previousJobs.map((job) =>
      job.id === draggableId
        ? { ...job, status: newStatus, updatedAt: new Date().toISOString() }
        : job,
    );
    const updatedStats = calculateJobStats(updatedJobs);
    setTrackedJobs(updatedJobs);
    setStats(updatedStats);
    persistTrackerSnapshot(updatedJobs, updatedStats);
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
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to remove this job from your tracker?")) return;
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
  };

  const handleSaveNote = async (jobId, noteContent) => {
    const trimmed = noteContent.trim();
    if (!trimmed) { setNoteEditing(null); setNoteText(""); return; }
    try {
      const job = trackedJobs.find((j) => j.id === jobId);
      if (!job) return;
      await jobTrackerApi.updateStatus(jobId, job.status, trimmed);
      const newNote = { content: trimmed, createdAt: new Date().toISOString() };
      const updatedJobs = trackedJobs.map((j) =>
        j.id === jobId ? { ...j, notes: [...(j.notes || []), newNote] } : j,
      );
      setTrackedJobs(updatedJobs);
      persistTrackerSnapshot(updatedJobs, calculateJobStats(updatedJobs));
      toast.success("Note saved!");
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note");
    } finally {
      setNoteEditing(null);
      setNoteText("");
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const formatDateTime = (date) => {
    if (!date) return "not synced yet";
    return new Date(date).toLocaleString("en-US", {
      month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
    });
  };

  const jobsClosingToday = trackedJobs.filter((job) => getDeadlineStatus(job.deadline) === "today");

  const applyDeadlineFilter = (jobs) => {
    if (deadlineFilter === "all") return jobs;
    return jobs.filter((job) => {
      const ds = getDeadlineStatus(job.deadline);
      if (deadlineFilter === "closing-soon") return ds === "closing-soon" || ds === "today";
      if (deadlineFilter === "passed") return ds === "passed";
      if (deadlineFilter === "has-deadline") return !!job.deadline;
      return true;
    });
  };

  const sortJobs = (jobs) => {
    if (sortBy === "deadline") {
      return [...jobs].sort((a, b) => {
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      });
    }
    return [...jobs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const displayedJobs = sortJobs(applyDeadlineFilter(trackedJobs));

  if (loading) {
    return (
      <Layout>
        <SkeletonTracker />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Job Tracker</h1>
            <p className="text-muted-foreground">Track your job applications in one place</p>
          </div>

          {(isOffline || pendingSyncCount > 0) && (
            <Card className="mb-6 border-amber-500/40 bg-amber-500/10 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <WifiOff className="mt-0.5 h-5 w-5 text-amber-500" />
                  <div>
                    <p className="font-semibold text-foreground">
                      {isOffline ? "Offline mode" : "Pending offline sync"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Showing saved tracker data from {formatDateTime(lastSyncedAt)}.
                      {pendingSyncCount > 0
                        ? ` ${pendingSyncCount} status update${pendingSyncCount > 1 ? "s are" : " is"} waiting to sync.`
                        : ""}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    await syncPendingStatusUpdates();
                    await fetchJobs();
                    await fetchStats();
                  }}
                  disabled={isOffline}
                  className="shrink-0"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry Sync
                </Button>
              </div>
            </Card>
          )}

          {/* Closing Today Banner */}
          {!bannerDismissed && (
            <ClosingTodayBanner
              jobs={jobsClosingToday}
              onDismiss={() => setBannerDismissed(true)}
            />
          )}

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {[
                { label: "Total", value: stats.total, icon: "📊" },
                { label: "Saved", value: stats.saved, icon: "📌" },
                { label: "Applied", value: stats.applied, icon: "✉️" },
                { label: "Interviewing", value: stats.interviewing, icon: "🎤" },
                { label: "Offered", value: stats.offered, icon: "🎉" },
              ].map(({ label, value, icon }) => (
                <Card key={label} className="p-6 bg-background/50 border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm mb-1">{label}</p>
                      <p className="text-3xl font-bold text-foreground">{value}</p>
                    </div>
                    <div className="text-3xl">{icon}</div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Status filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              All Columns
            </button>
            {statusOptions.map((status) => (
              <button
                key={status.value}
                onClick={() => setFilterStatus(status.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === status.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {status.icon} {status.label}
              </button>
            ))}
          </div>

          {/* Deadline filter + Sort */}
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-xs text-muted-foreground font-medium mr-1">Deadline:</span>
              {[
                { value: "all", label: "All" },
                { value: "closing-soon", label: "⚠️ Closing Soon" },
                { value: "passed", label: "🔴 Passed" },
                { value: "has-deadline", label: "Has Deadline" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDeadlineFilter(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    deadlineFilter === opt.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 ml-auto">
              <span className="text-xs text-muted-foreground font-medium mr-1">Sort:</span>
              {[
                { value: "date", label: "Date Added" },
                { value: "deadline", label: "Deadline" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === opt.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Kanban Board */}
          {displayedJobs.length === 0 && trackedJobs.length === 0 ? (
            <Card className="p-12 text-center bg-background/50 border-border">
              <div className="max-w-md mx-auto">
                <Briefcase className="w-16 h-16 text-muted-foreground/80 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Tracked Jobs Yet</h3>
                <p className="text-muted-foreground mb-6">Start tracking jobs from the job search page</p>
                <Button onClick={() => (window.location.href = "/jobs")} className="mx-auto">
                  <Plus className="w-5 h-5 mr-2" />
                  Find Jobs
                </Button>
              </div>
            </Card>
          ) : displayedJobs.length === 0 ? (
            <Card className="p-12 text-center bg-background/50 border-border">
              <div className="max-w-md mx-auto">
                <Clock className="w-16 h-16 text-muted-foreground/80 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Jobs Match Filter</h3>
                <p className="text-muted-foreground mb-6">Try adjusting the deadline filter.</p>
                <Button onClick={() => setDeadlineFilter("all")} className="mx-auto" variant="outline">
                  Clear Filter
                </Button>
              </div>
            </Card>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex gap-6 overflow-x-auto pb-8 min-h-[60vh] snap-x scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                {statusOptions
                  .filter((status) => filterStatus === "all" || status.value === filterStatus)
                  .map((status) => {
                    const columnJobs = displayedJobs.filter((j) => j.status === status.value);
                    return (
                      <div
                        key={status.value}
                        className="shrink-0 w-80 bg-muted/20 rounded-2xl p-4 flex flex-col snap-start border border-border/40 shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-4 px-2">
                          <h3 className="font-bold flex items-center gap-2 text-foreground text-sm uppercase tracking-wider">
                            <span>{status.icon}</span> {status.label}
                          </h3>
                          <span className="bg-background px-2.5 py-0.5 rounded-full text-xs font-black border border-border text-muted-foreground">
                            {columnJobs.length}
                          </span>
                        </div>

                        <Droppable droppableId={status.value}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`flex-1 flex flex-col gap-3 min-h-[150px] transition-colors rounded-xl p-1.5 ${
                                snapshot.isDraggingOver
                                  ? "bg-primary/5 border border-primary/20 border-dashed"
                                  : "border border-transparent"
                              }`}
                            >
                              {columnJobs.map((job, index) => {
                                const dlStatus = getDeadlineStatus(job.deadline);
                                return (
                                  <Draggable key={job.id} draggableId={job.id} index={index}>
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{ ...provided.draggableProps.style }}
                                      >
                                        <Card
                                          className={`p-4 bg-card hover:border-primary/40 transition-all ${
                                            snapshot.isDragging
                                              ? "shadow-2xl shadow-primary/20 scale-105 rotate-2 z-50 border-primary ring-2 ring-primary/20"
                                              : "border-border/60 shadow-sm hover:-translate-y-0.5"
                                          }`}
                                        >
                                          <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-foreground text-sm line-clamp-2 leading-tight pr-4">
                                              {job.title}
                                            </h4>
                                            <button
                                              onClick={() => handleDelete(job.id)}
                                              className="text-muted-foreground/50 hover:text-red-500 transition-colors absolute top-4 right-4"
                                              title="Remove Job"
                                              aria-label={`Remove ${job.title} from tracker`}
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          </div>

                                          <p className="text-primary font-black text-xs mb-2 tracking-wide">
                                            {job.company}
                                          </p>

                                          {dlStatus && (
                                            <div className="mb-2">
                                              <DeadlineBadge status={dlStatus} />
                                            </div>
                                          )}

                                          <div className="flex flex-col gap-1.5 text-[11px] font-semibold text-muted-foreground mb-3">
                                            {job.location && (
                                              <div className="flex items-center gap-1.5">
                                                <MapPin className="w-3.5 h-3.5 text-foreground/40" />
                                                {job.location}
                                              </div>
                                            )}
                                            {job.salary && (
                                              <div className="flex items-center gap-1.5">
                                                <DollarSign className="w-3.5 h-3.5 text-foreground/40" />
                                                {job.salary}
                                              </div>
                                            )}
                                            <div className="flex items-center gap-1.5">
                                              <Calendar className="w-3.5 h-3.5 text-foreground/40" />
                                              Added {formatDate(job.createdAt)}
                                            </div>
                                          </div>

                                          <DeadlinePicker
                                            job={job}
                                            onUpdate={handleDeadlineUpdate}
                                            loading={!!deadlineLoading[job.id]}
                                          />

                                          <div className="flex gap-2 mt-3 pt-3 border-t border-border/50 flex-wrap">
                                            {job.applyLink && (
                                              <a
                                                href={job.applyLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 bg-primary text-background hover:bg-primary/90 py-1.5 rounded-md text-xs font-bold text-center transition-colors flex items-center justify-center gap-1"
                                                aria-label={`Apply to ${job.title} at ${job.company}`}
                                              >
                                                <ExternalLink className="w-3 h-3" /> Apply
                                              </a>
                                            )}
                                            <button
                                              onClick={() =>
                                                setResearchCompany({
                                                  name: job.company,
                                                  industry: job.industry || "",
                                                })
                                              }
                                              className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary py-1.5 rounded-md text-[11px] font-bold text-center transition-colors flex items-center justify-center gap-1"
                                              aria-label={`Research ${job.company}`}
                                            >
                                              <Sparkles className="w-3 h-3" /> AI Research
                                            </button>
                                            <button
                                              onClick={() => setEmailGeneratorJob(job)}
                                              className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 py-1.5 rounded-md text-[11px] font-bold text-center transition-colors flex items-center justify-center gap-1"
                                            >
                                              <Mail className="w-3 h-3" /> Draft Email
                                            </button>
                                            <button
                                              onClick={() => setOutreachJob(job)}
                                              className="flex-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 py-1.5 rounded-md text-[11px] font-bold text-center transition-colors flex items-center justify-center gap-1"
                                            >
                                              <Send className="w-3 h-3" /> Outreach
                                            </button>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (noteEditing === job.id) {
                                                  setNoteEditing(null);
                                                  setNoteText("");
                                                } else {
                                                  setNoteEditing(job.id);
                                                  setNoteText("");
                                                }
                                              }}
                                              title={noteEditing === job.id ? "Close notes" : "Add a note"}
                                              className={`relative shrink-0 p-1.5 rounded-md text-[11px] font-bold transition-colors flex items-center justify-center gap-1 ${
                                                noteEditing === job.id
                                                  ? "bg-amber-500/20 text-amber-500"
                                                  : job.notes?.length > 0
                                                  ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
                                                  : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                                              }`}
                                            >
                                              <StickyNote className="w-3.5 h-3.5" />
                                              {job.notes?.length > 0 && noteEditing !== job.id && (
                                                <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] bg-amber-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-0.5">
                                                  {job.notes.length}
                                                </span>
                                              )}
                                            </button>
                                          </div>

                                          {noteEditing === job.id && (
                                            <div
                                              onMouseDown={(e) => e.stopPropagation()}
                                              onClick={(e) => e.stopPropagation()}
                                              className="mt-3 pt-3 border-t border-amber-500/20"
                                            >
                                              {job.notes?.length > 0 && (
                                                <div className="mb-2 space-y-1.5 max-h-28 overflow-y-auto pr-1">
                                                  {[...job.notes].reverse().map((note, ni) => (
                                                    <div
                                                      key={ni}
                                                      className="text-[11px] bg-amber-500/5 border border-amber-500/15 rounded-lg px-2.5 py-1.5"
                                                    >
                                                      <p className="text-foreground/80 leading-relaxed">{note.content}</p>
                                                      <p className="text-muted-foreground/50 mt-0.5">
                                                        {new Date(note.createdAt).toLocaleDateString("en-US", {
                                                          month: "short",
                                                          day: "numeric",
                                                        })}
                                                      </p>
                                                    </div>
                                                  ))}
                                                </div>
                                              )}
                                              <div className="flex gap-1.5">
                                                <textarea
                                                  autoFocus
                                                  rows={2}
                                                  value={noteText}
                                                  onChange={(e) => setNoteText(e.target.value)}
                                                  onKeyDown={(e) => {
                                                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                                                      e.preventDefault();
                                                      handleSaveNote(job.id, noteText);
                                                    }
                                                    if (e.key === "Escape") {
                                                      setNoteEditing(null);
                                                      setNoteText("");
                                                    }
                                                  }}
                                                  placeholder="Add a note... (⌘↵ to save)"
                                                  className="flex-1 text-[11px] bg-background border border-amber-500/30 focus:border-amber-500/60 rounded-lg px-2.5 py-1.5 text-foreground placeholder:text-muted-foreground/40 resize-none outline-none transition-colors"
                                                />
                                                <div className="flex flex-col gap-1">
                                                  <button
                                                    onClick={() => handleSaveNote(job.id, noteText)}
                                                    disabled={!noteText.trim()}
                                                    title="Save note (⌘↵)"
                                                    className="p-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white rounded-lg transition-colors flex items-center justify-center"
                                                  >
                                                    <Send className="w-3 h-3" />
                                                  </button>
                                                  <button
                                                    onClick={() => { setNoteEditing(null); setNoteText(""); }}
                                                    title="Cancel"
                                                    className="p-1.5 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg transition-colors flex items-center justify-center"
                                                  >
                                                    <X className="w-3 h-3" />
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </Card>
                                      </div>
                                    )}
                                  </Draggable>
                                );
                              })}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    );
                  })}
              </div>
            </DragDropContext>
          )}
        </div>
      </div>

      {researchCompany && (
        <CompanyResearch
          companyName={researchCompany.name}
          industry={researchCompany.industry}
          onClose={() => setResearchCompany(null)}
        />
      )}
      {emailGeneratorJob && (
        <EmailGeneratorPanel
          companyName={emailGeneratorJob.company}
          jobTitle={emailGeneratorJob.title}
          onClose={() => setEmailGeneratorJob(null)}
        />
      )}
      {outreachJob && (
        <OutreachPanel
          companyName={outreachJob.company}
          onClose={() => setOutreachJob(null)}
        />
      )}
    </Layout>
  );
};

export default JobTracker;
