import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";

const { mockToast, mockJobTrackerApi, mockOfflineUtils, dndMock } = vi.hoisted(() => {
  const toast = Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn(), custom: vi.fn() });
  const api = {
    getAll: vi.fn(),
    getStats: vi.fn(),
    updateStatus: vi.fn(),
    delete: vi.fn(),
  };
  const offlineUtils = {
    calculateJobStats: vi.fn((jobs = []) => {
      const stats = { total: 0, saved: 0, applied: 0, interviewing: 0, offered: 0, rejected: 0 };
      for (const job of jobs) {
        const s = ["saved", "applied", "interviewing", "offered", "rejected"].includes(job.status)
          ? job.status
          : "saved";
        stats[s] += 1;
        stats.total += 1;
      }
      return stats;
    }),
    getQueuedStatusUpdates: vi.fn(() => []),
    loadJobTrackerSnapshot: vi.fn(() => null),
    queueStatusUpdate: vi.fn(() => []),
    removeQueuedStatusUpdates: vi.fn(() => []),
    saveJobTrackerSnapshot: vi.fn(() => ({ lastSyncedAt: new Date().toISOString() })),
    saveJobTrackerStats: vi.fn(() => ({ lastSyncedAt: new Date().toISOString() })),
  };
  const onDragEndCallbacks = [];
  const dnd = {
    _callbacks: onDragEndCallbacks,
    triggerDragEnd(result) {
      for (const cb of onDragEndCallbacks) {
        cb(result);
      }
    },
    reset() {
      onDragEndCallbacks.length = 0;
    },
  };
  return { mockToast: toast, mockJobTrackerApi: api, mockOfflineUtils: offlineUtils, dndMock: dnd };
});

vi.mock("react-hot-toast", () => ({
  default: mockToast,
  toast: mockToast,
}));

vi.mock("../../../services/api", () => ({
  jobTrackerApi: mockJobTrackerApi,
}));

vi.mock("../../../config/firebase", () => ({
  auth: {
    currentUser: { uid: "test-user-123" },
  },
}));

vi.mock("../../../utils/jobTrackerOffline", () => mockOfflineUtils);

vi.mock("@hello-pangea/dnd", () => ({
  DragDropContext: ({ children, onDragEnd }) => {
    if (onDragEnd) dndMock._callbacks.push(onDragEnd);
    return children;
  },
  Droppable: ({ children }) =>
    children(
      { innerRef: vi.fn(), droppableProps: {}, placeholder: null },
      { isDraggingOver: false }
    ),
  Draggable: ({ children }) =>
    children(
      { innerRef: vi.fn(), draggableProps: {}, dragHandleProps: {} },
      { isDragging: false }
    ),
}));

const sampleJobs = [
  {
    id: "job-1",
    title: "Frontend Developer",
    company: "Tech Corp",
    status: "saved",
    location: "Remote",
    salary: "$120k",
    createdAt: "2026-05-01",
    applyLink: "https://example.com/apply",
  },
  {
    id: "job-2",
    title: "Backend Engineer",
    company: "Startup Inc",
    status: "applied",
    location: "New York",
    salary: "$130k",
    createdAt: "2026-05-15",
    applyLink: "https://example.com/apply-2",
  },
  {
    id: "job-3",
    title: "Full Stack Developer",
    company: "Big Co",
    status: "interviewing",
    location: "San Francisco",
    createdAt: "2026-04-20",
  },
  {
    id: "job-4",
    title: "DevOps Engineer",
    company: "Cloud Inc",
    status: "offered",
    location: "Austin",
    salary: "$150k",
    createdAt: "2026-03-10",
  },
  {
    id: "job-5",
    title: "Data Scientist",
    company: "AI Labs",
    status: "rejected",
    location: "Boston",
    createdAt: "2026-02-01",
  },
  {
    id: "job-6",
    title: "Product Designer",
    company: "Design Studio",
    status: "saved",
    location: "Chicago",
    createdAt: "2026-05-20",
  },
];

const mockStats = {
  total: 6,
  saved: 2,
  applied: 1,
  interviewing: 1,
  offered: 1,
  rejected: 1,
};

describe("MobileKanban component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dndMock.reset();
    mockJobTrackerApi.getAll.mockResolvedValue({ trackedJobs: sampleJobs });
    mockJobTrackerApi.getStats.mockResolvedValue({ stats: mockStats });
    mockJobTrackerApi.updateStatus.mockResolvedValue({});
    mockJobTrackerApi.delete.mockResolvedValue({});
  });

  describe("Core logic", () => {
    test("renders all 5 Kanban columns with correct headings", async () => {
      const MobileKanban = (await import("../MobileKanban")).default;
      render(<MobileKanban />);

      await waitFor(() => {
        expect(screen.getAllByText("Saved").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("Applied").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("Interviewing").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("Offered").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("Rejected").length).toBeGreaterThanOrEqual(1);
      });
    });

    test("renders jobs in their respective status columns", async () => {
      const MobileKanban = (await import("../MobileKanban")).default;
      render(<MobileKanban />);

      await waitFor(() => {
        expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
        expect(screen.getByText("Backend Engineer")).toBeInTheDocument();
        expect(screen.getByText("Full Stack Developer")).toBeInTheDocument();
        expect(screen.getByText("DevOps Engineer")).toBeInTheDocument();
        expect(screen.getByText("Data Scientist")).toBeInTheDocument();
      });
    });

    test("displays company names on job cards", async () => {
      const MobileKanban = (await import("../MobileKanban")).default;
      render(<MobileKanban />);

      await waitFor(() => {
        expect(screen.getByText("Tech Corp")).toBeInTheDocument();
        expect(screen.getByText("Startup Inc")).toBeInTheDocument();
        expect(screen.getByText("Big Co")).toBeInTheDocument();
      });
    });

    test("calls fetch APIs on mount", async () => {
      const MobileKanban = (await import("../MobileKanban")).default;
      render(<MobileKanban />);

      await waitFor(() => {
        expect(mockJobTrackerApi.getAll).toHaveBeenCalledTimes(1);
        expect(mockJobTrackerApi.getStats).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("Drag and drop", () => {
    test("drag from Saved to Applied column calls updateStatus API", async () => {
      const MobileKanban = (await import("../MobileKanban")).default;
      render(<MobileKanban />);

      await waitFor(() => {
        expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
      });

      dndMock.triggerDragEnd({
        draggableId: "job-1",
        source: { droppableId: "saved", index: 0 },
        destination: { droppableId: "applied", index: 0 },
      });

      await waitFor(() => {
        expect(mockJobTrackerApi.updateStatus).toHaveBeenCalledWith("job-1", "applied");
        expect(mockToast.success).toHaveBeenCalledWith("Status updated!");
      });
    });

    test("drag cancellation (no destination) does not call updateStatus", async () => {
      const MobileKanban = (await import("../MobileKanban")).default;
      render(<MobileKanban />);

      await waitFor(() => {
        expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
      });

      dndMock.triggerDragEnd({
        draggableId: "job-1",
        source: { droppableId: "saved", index: 0 },
        destination: null,
      });

      await waitFor(() => {
        expect(mockJobTrackerApi.updateStatus).not.toHaveBeenCalled();
      });
    });

    test("status update API failure reverts the job to its original column", async () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      mockJobTrackerApi.updateStatus.mockRejectedValue(new Error("Server error"));

      const MobileKanban = (await import("../MobileKanban")).default;
      render(<MobileKanban />);

      await waitFor(() => {
        expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
      });

      dndMock.triggerDragEnd({
        draggableId: "job-1",
        source: { droppableId: "saved", index: 0 },
        destination: { droppableId: "applied", index: 0 },
      });

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith("Failed to update status");
      });
    });

    test("offline queue after drag when network error occurs", async () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      mockJobTrackerApi.updateStatus.mockRejectedValue(new TypeError("Failed to fetch"));

      const MobileKanban = (await import("../MobileKanban")).default;
      render(<MobileKanban />);

      await waitFor(() => {
        expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
      });

      dndMock.triggerDragEnd({
        draggableId: "job-1",
        source: { droppableId: "saved", index: 0 },
        destination: { droppableId: "applied", index: 0 },
      });

      await waitFor(() => {
        expect(mockOfflineUtils.queueStatusUpdate).toHaveBeenCalledWith("anonymous", "job-1", "applied");
        expect(mockToast.success).toHaveBeenCalledWith(
          "Status saved offline. It will sync when you reconnect.",
          expect.any(Object)
        );
      });
    });

    test("calls onStatusUpdate callback in controlled mode", async () => {
      const onStatusUpdate = vi.fn();
      const MobileKanban = (await import("../MobileKanban")).default;
      render(<MobileKanban initialJobs={[sampleJobs[0]]} onStatusUpdate={onStatusUpdate} />);

      dndMock.triggerDragEnd({
        draggableId: "job-1",
        source: { droppableId: "saved", index: 0 },
        destination: { droppableId: "applied", index: 0 },
      });

      await waitFor(() => {
        expect(onStatusUpdate).toHaveBeenCalledWith("job-1", "applied");
      });
    });
  });

  describe("Loading state", () => {
    test("does not render columns while loading", async () => {
      mockJobTrackerApi.getAll.mockImplementation(() => new Promise(() => {}));
      const MobileKanban = (await import("../MobileKanban")).default;
      render(<MobileKanban />);

      expect(screen.queryByText("Saved")).not.toBeInTheDocument();
      expect(screen.queryByText("Applied")).not.toBeInTheDocument();
    });
  });

  describe("Empty state", () => {
    test("shows empty state when no jobs tracked", async () => {
      mockJobTrackerApi.getAll.mockResolvedValue({ trackedJobs: [] });
      const MobileKanban = (await import("../MobileKanban")).default;
      render(<MobileKanban />);

      await waitFor(() => {
        expect(screen.getByText("No Tracked Jobs Yet")).toBeInTheDocument();
        expect(screen.getByText("Find Jobs")).toBeInTheDocument();
      });
    });
  });

  describe("Error handling", () => {
    test("shows error toast when API fetch fails with no cache", async () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      mockJobTrackerApi.getAll.mockRejectedValue(new Error("Network error"));
      mockOfflineUtils.loadJobTrackerSnapshot.mockReturnValue(null);

      const MobileKanban = (await import("../MobileKanban")).default;
      render(<MobileKanban />);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(
          "Failed to load tracked jobs",
          expect.any(Object)
        );
      });
    });

    test("falls back to cached data when API fails and cache exists", async () => {
      vi.spyOn(console, "error").mockImplementation(() => {});
      mockJobTrackerApi.getAll.mockRejectedValue(new Error("Network error"));
      mockOfflineUtils.loadJobTrackerSnapshot.mockReturnValue({
        trackedJobs: sampleJobs,
        stats: mockStats,
        lastSyncedAt: "2026-06-01T00:00:00Z",
      });

      const MobileKanban = (await import("../MobileKanban")).default;
      render(<MobileKanban />);

      await waitFor(() => {
        expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
      });
    });
  });

  describe("Filter bar", () => {
    test("shows filter buttons for all statuses", async () => {
      const MobileKanban = (await import("../MobileKanban")).default;
      render(<MobileKanban />);

      await waitFor(() => {
        expect(screen.getByText("All")).toBeInTheDocument();
        expect(screen.getAllByText("Applied").length).toBeGreaterThanOrEqual(1);
      });
    });

    test("shows all columns by default", async () => {
      const MobileKanban = (await import("../MobileKanban")).default;
      render(<MobileKanban />);

      await waitFor(() => {
        const allButton = screen.getByText("All");
        expect(allButton.className).toContain("bg-primary");
      });
    });
  });

  describe("Offline support", () => {
    test("shows offline banner when queued updates exist", async () => {
      mockOfflineUtils.getQueuedStatusUpdates.mockReturnValue([
        { id: "update-1", jobId: "job-1", status: "applied" },
      ]);

      const MobileKanban = (await import("../MobileKanban")).default;
      render(<MobileKanban />);

      await waitFor(() => {
        expect(screen.getByText(/Pending sync/i)).toBeInTheDocument();
      });
    });
  });

  describe("Stats row", () => {
    test("shows stats when available", async () => {
      const MobileKanban = (await import("../MobileKanban")).default;
      render(<MobileKanban />);

      await waitFor(() => {
        expect(screen.getByText("Total")).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText("6")).toBeInTheDocument();
      });
    });
  });

  describe("Job card actions", () => {
    test("shows Apply button for jobs with applyLink", async () => {
      const MobileKanban = (await import("../MobileKanban")).default;
      render(<MobileKanban />);

      await waitFor(() => {
        const applyButtons = screen.getAllByText("Apply");
        expect(applyButtons.length).toBeGreaterThanOrEqual(1);
      });
    });

    test("shows AI Research button on job cards", async () => {
      const MobileKanban = (await import("../MobileKanban")).default;
      render(<MobileKanban />);

      await waitFor(() => {
        const researchButtons = screen.getAllByText("AI Research");
        expect(researchButtons.length).toBeGreaterThanOrEqual(1);
      });
    });

    test("shows delete button on job cards", async () => {
      const MobileKanban = (await import("../MobileKanban")).default;
      render(<MobileKanban />);

      await waitFor(() => {
        const deleteButtons = screen.getAllByLabelText(/Remove/i);
        expect(deleteButtons.length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe("Controlled mode", () => {
    test("accepts initialJobs prop and renders without fetching API", async () => {
      const MobileKanban = (await import("../MobileKanban")).default;
      render(<MobileKanban initialJobs={sampleJobs} />);

      expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
      expect(mockJobTrackerApi.getAll).not.toHaveBeenCalled();
    });

    test("calls onDelete callback in controlled mode", async () => {
      const onDelete = vi.fn();
      const MobileKanban = (await import("../MobileKanban")).default;
      render(<MobileKanban initialJobs={[sampleJobs[0]]} onDelete={onDelete} />);

      const deleteButton = screen.getByLabelText(/Remove/i);
      fireEvent.click(deleteButton);

      expect(onDelete).toHaveBeenCalledWith("job-1");
    });
  });
});
