import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useJobBoard } from "../hooks/useJobBoard";
import { jobTrackerApi } from "../services/api";

// Mock dependencies
vi.mock("../services/api", () => ({
  jobTrackerApi: {
    getAll: vi.fn(),
    getStats: vi.fn(),
    updateStatus: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("../config/firebase", () => ({
  auth: { currentUser: { uid: "test-user-123" } },
}));

vi.mock("react-hot-toast", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("../utils/jobTrackerOffline", () => ({
  calculateJobStats: vi.fn(() => ({ total: 1, saved: 1 })),
  getQueuedStatusUpdates: vi.fn(() => []),
  loadJobTrackerSnapshot: vi.fn(() => null),
  queueStatusUpdate: vi.fn(() => [{ id: "q1" }]),
  removeQueuedStatusUpdates: vi.fn(() => []),
  saveJobTrackerSnapshot: vi.fn(() => ({ lastSyncedAt: new Date().toISOString() })),
  saveJobTrackerStats: vi.fn(),
}));

describe("useJobBoard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useJobBoard({ isControlled: true }));
    expect(result.current.trackedJobs).toEqual([]);
    expect(result.current.stats).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("should handle initial jobs when controlled", () => {
    const mockJobs = [{ id: "1", title: "Test Job", status: "saved" }];
    const { result } = renderHook(() =>
      useJobBoard({ isControlled: true, initialJobs: mockJobs })
    );
    expect(result.current.trackedJobs).toEqual(mockJobs);
    expect(result.current.loading).toBe(false);
  });

  it("should fetch jobs and stats when not controlled", async () => {
    const mockJobs = [{ id: "1", title: "API Job", status: "applied" }];
    jobTrackerApi.getAll.mockResolvedValueOnce({ trackedJobs: mockJobs });
    jobTrackerApi.getStats.mockResolvedValueOnce({ stats: { total: 1 } });

    const { result } = renderHook(() => useJobBoard({ isControlled: false }));
    
    // Initially loading
    expect(result.current.loading).toBe(true);

    // Wait for async effects
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.trackedJobs).toEqual(mockJobs);
    expect(jobTrackerApi.getAll).toHaveBeenCalledTimes(1);
    expect(jobTrackerApi.getStats).toHaveBeenCalledTimes(1);
  });

  it("should update status via handleStatusUpdate", async () => {
    const mockJobs = [{ id: "1", title: "Test Job", status: "saved" }];
    const { result } = renderHook(() =>
      useJobBoard({ isControlled: true, initialJobs: mockJobs })
    );

    jobTrackerApi.updateStatus.mockResolvedValueOnce({});

    await act(async () => {
      await result.current.handleStatusUpdate("1", "applied");
    });

    expect(jobTrackerApi.updateStatus).toHaveBeenCalledWith("1", "applied");
    expect(result.current.trackedJobs[0].status).toBe("applied");
  });

  it("should update status via onDragEnd", async () => {
    const mockJobs = [{ id: "1", title: "Test Job", status: "saved" }];
    const { result } = renderHook(() =>
      useJobBoard({ isControlled: true, initialJobs: mockJobs })
    );

    jobTrackerApi.updateStatus.mockResolvedValueOnce({});

    await act(async () => {
      await result.current.onDragEnd({
        destination: { droppableId: "applied", index: 0 },
        source: { droppableId: "saved", index: 0 },
        draggableId: "1",
      });
    });

    expect(jobTrackerApi.updateStatus).toHaveBeenCalledWith("1", "applied");
    expect(result.current.trackedJobs[0].status).toBe("applied");
  });

  it("should delete job via handleDelete", async () => {
    const mockJobs = [{ id: "1", title: "Test Job", status: "saved" }];
    const { result } = renderHook(() =>
      useJobBoard({ isControlled: true, initialJobs: mockJobs })
    );

    jobTrackerApi.delete.mockResolvedValueOnce({ success: true });
    vi.spyOn(window, "confirm").mockImplementation(() => true);

    await act(async () => {
      await result.current.handleDelete("1");
    });

    expect(jobTrackerApi.delete).toHaveBeenCalledWith("1");
    expect(result.current.trackedJobs).toEqual([]);
  });
});
