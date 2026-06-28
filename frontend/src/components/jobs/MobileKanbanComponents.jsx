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
import { useJobBoard } from "../../hooks/useJobBoard";

export const STATUS_COLUMNS = [
  { value: "saved", label: "Saved", color: "bg-muted-foreground" },
  { value: "applied", label: "Applied", color: "bg-blue-500" },
  { value: "interviewing", label: "Interviewing", color: "bg-yellow-500" },
  { value: "offered", label: "Offered", color: "bg-green-500" },
  { value: "rejected", label: "Rejected", color: "bg-red-500" },
];

export const STATUS_ICONS = {
  saved: "📌",
  applied: "✉️",
  interviewing: "🎤",
  offered: "🎉",
  rejected: "❌",
};

export function formatDate(date) {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(date) {
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

export const JobCard = memo(function JobCard({
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

export function StatsRow({ stats, onRefresh }) {
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

export function EmptyKanban() {
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

export function OfflineBanner({
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

export function FilterBar({ columns, activeFilter, onFilterChange }) {
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

export function KanbanColumn({ column, jobs, onDelete }) {
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
