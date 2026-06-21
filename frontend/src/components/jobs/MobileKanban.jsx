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

import { STATUS_COLUMNS, JobCard, StatsRow, FilterBar, EmptyKanban, OfflineBanner, KanbanColumn } from "./MobileKanbanComponents";

export default function MobileKanban({
  initialJobs,
  onStatusUpdate: externalOnStatusUpdate,
  onDelete: externalOnDelete,
  className,
}) {
  const isControlled = initialJobs !== undefined;
  
  const board = useJobBoard({ initialJobs, isControlled });

  const [filterStatus, setFilterStatus] = useState("all");
  const [isSyncing, setIsSyncing] = useState(false);

  const handleDelete = useCallback(
    async (jobId) => {
      if (externalOnDelete) {
        externalOnDelete(jobId);
        return;
      }
      await board.handleDelete(jobId);
    },
    [externalOnDelete, board]
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

      await board.onDragEnd(result);
    },
    [externalOnStatusUpdate, board]
  );

  const filteredColumns = useMemo(() => {
    if (filterStatus === "all") return STATUS_COLUMNS;
    return STATUS_COLUMNS.filter((col) => col.value === filterStatus);
  }, [filterStatus]);

  const columnJobsMap = useMemo(() => {
    const map = {};
    for (const col of STATUS_COLUMNS) {
      map[col.value] = board.trackedJobs.filter((j) => j.status === col.value);
    }
    return map;
  }, [board.trackedJobs]);

  const totalJobs = board.trackedJobs.length;

  if (board.loading) {
    return (
      <div className={cn("", className)}>
        <SkeletonTracker />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4 pb-8", className)}>
      <OfflineBanner
        isOffline={board.isOffline}
        pendingSyncCount={board.pendingSyncCount}
        lastSyncedAt={board.lastSyncedAt}
        isSyncing={isSyncing}
        onSync={async () => {
          setIsSyncing(true);
          await board.syncPendingStatusUpdates();
          await board.fetchJobs();
          await board.fetchStats();
          setIsSyncing(false);
        }}
      />

      {board.stats && (
        <StatsRow stats={board.stats} onRefresh={board.fetchStats} />
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
