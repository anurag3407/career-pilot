import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('../services/api', () => ({
  jobTrackerApi: {
    getAll: vi.fn(),
    getStats: vi.fn(),
    updateStatus: vi.fn(),
    updateDeadline: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('react-hot-toast', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({ children }) => <div>{children}</div>,
  Droppable: ({ children }) => children({ innerRef: () => {}, droppableProps: {}, placeholder: null }, {}),
  Draggable: ({ children }) => children({ innerRef: () => {}, draggableProps: {}, dragHandleProps: {} }, {}),
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

vi.mock('../components/Layout', () => ({ default: ({ children }) => <div>{children}</div> }));
vi.mock('../components/Button', () => ({ default: ({ children, onClick }) => <button onClick={onClick}>{children}</button> }));
vi.mock('../components/Card', () => ({ default: ({ children, className }) => <div className={className}>{children}</div> }));
vi.mock('../components/EmptyJobState', () => ({ default: () => <div>EmptyJobState</div> }));
vi.mock('../components/CompanyResearch', () => ({ default: () => <div>CompanyResearch</div> }));
vi.mock('../components/ui/Skeleton.jsx', () => ({ SkeletonDashboard: () => <div>Loading...</div> }));

import { jobTrackerApi } from '../services/api';
import JobTracker from '../pages/JobTracker';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const NOW = new Date('2026-06-24T10:00:00.000Z');

function makeJob(overrides = {}) {
  return {
    id: 'job-1',
    title: 'Frontend Engineer',
    company: 'Acme Corp',
    location: 'Remote',
    salary: null,
    applyLink: null,
    status: 'saved',
    deadline: null,
    createdAt: new Date('2026-06-20').toISOString(),
    updatedAt: new Date('2026-06-20').toISOString(),
    notes: [],
    ...overrides,
  };
}

const defaultStats = { total: 1, saved: 1, applied: 0, interviewing: 0, offered: 0, rejected: 0 };

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('JobTracker — deadline badges', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.setSystemTime(NOW);
    jobTrackerApi.getStats.mockResolvedValue({ stats: defaultStats });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders no badge when deadline is null', async () => {
    jobTrackerApi.getAll.mockResolvedValue({ trackedJobs: [makeJob()] });
    render(<JobTracker />);
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
    expect(screen.queryByTestId('deadline-badge-closing-soon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('deadline-badge-passed')).not.toBeInTheDocument();
  });

  it('renders Closing Soon badge for deadline within 48 hours', async () => {
    const soon = new Date(NOW.getTime() + 24 * 60 * 60 * 1000).toISOString();
    jobTrackerApi.getAll.mockResolvedValue({ trackedJobs: [makeJob({ deadline: soon })] });
    render(<JobTracker />);
    await waitFor(() => screen.getByTestId('deadline-badge-closing-soon'));
    expect(screen.getByTestId('deadline-badge-closing-soon')).toBeInTheDocument();
  });

  it('renders Deadline Passed badge for past deadline', async () => {
    const past = new Date(NOW.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();
    jobTrackerApi.getAll.mockResolvedValue({ trackedJobs: [makeJob({ deadline: past })] });
    render(<JobTracker />);
    await waitFor(() => screen.getByTestId('deadline-badge-passed'));
    expect(screen.getByTestId('deadline-badge-passed')).toBeInTheDocument();
  });

  it('renders no deadline badge for future deadline beyond 48h', async () => {
    const future = new Date(NOW.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString();
    jobTrackerApi.getAll.mockResolvedValue({ trackedJobs: [makeJob({ deadline: future })] });
    render(<JobTracker />);
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
    expect(screen.queryByTestId('deadline-badge-closing-soon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('deadline-badge-passed')).not.toBeInTheDocument();
  });
});

describe('JobTracker — closing today banner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.setSystemTime(NOW);
    jobTrackerApi.getStats.mockResolvedValue({ stats: defaultStats });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows banner when a job deadline is today', async () => {
    const todayEnd = new Date(NOW);
    todayEnd.setHours(23, 0, 0, 0);
    jobTrackerApi.getAll.mockResolvedValue({ trackedJobs: [makeJob({ deadline: todayEnd.toISOString() })] });
    render(<JobTracker />);
    await waitFor(() => screen.getByRole('alert'));
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/deadline is today/i)).toBeInTheDocument();
  });

  it('banner can be dismissed', async () => {
    const todayEnd = new Date(NOW);
    todayEnd.setHours(22, 0, 0, 0);
    jobTrackerApi.getAll.mockResolvedValue({ trackedJobs: [makeJob({ deadline: todayEnd.toISOString() })] });
    render(<JobTracker />);
    await waitFor(() => screen.getByRole('alert'));
    const dismissBtn = screen.getByLabelText(/dismiss banner/i);
    fireEvent.click(dismissBtn);
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());
  });

  it('does not show banner when no deadlines are today', async () => {
    const future = new Date(NOW.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString();
    jobTrackerApi.getAll.mockResolvedValue({ trackedJobs: [makeJob({ deadline: future })] });
    render(<JobTracker />);
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

describe('JobTracker — deadline picker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.setSystemTime(NOW);
    jobTrackerApi.getStats.mockResolvedValue({ stats: defaultStats });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows "+ Set deadline" when no deadline set', async () => {
    jobTrackerApi.getAll.mockResolvedValue({ trackedJobs: [makeJob()] });
    render(<JobTracker />);
    await waitFor(() => screen.getByText(/\+ Set deadline/i));
    expect(screen.getByText(/\+ Set deadline/i)).toBeInTheDocument();
  });

  it('shows deadline date when deadline is set', async () => {
    const future = new Date('2026-09-15T23:59:59.000Z').toISOString();
    jobTrackerApi.getAll.mockResolvedValue({ trackedJobs: [makeJob({ deadline: future })] });
    render(<JobTracker />);
    await waitFor(() => screen.getByText(/Due Sep/i));
    expect(screen.getByText(/Due Sep/i)).toBeInTheDocument();
  });

  it('calls updateDeadline API when date is selected', async () => {
    jobTrackerApi.getAll.mockResolvedValue({ trackedJobs: [makeJob()] });
    jobTrackerApi.updateDeadline.mockResolvedValue({
      success: true,
      data: { deadline: '2026-09-01T23:59:59.000Z' }
    });
    render(<JobTracker />);
    await waitFor(() => screen.getByText(/\+ Set deadline/i));

    // Click to open picker
    fireEvent.click(screen.getByText(/\+ Set deadline/i));
    const input = screen.getByLabelText(/set application deadline/i);
    fireEvent.change(input, { target: { value: '2026-09-01' } });

    await waitFor(() => expect(jobTrackerApi.updateDeadline).toHaveBeenCalledWith('job-1', expect.stringContaining('2026-09-01')));
  });

  it('calls updateDeadline with null when remove button clicked', async () => {
    const future = new Date('2026-09-15T23:59:59.000Z').toISOString();
    jobTrackerApi.getAll.mockResolvedValue({ trackedJobs: [makeJob({ deadline: future })] });
    jobTrackerApi.updateDeadline.mockResolvedValue({ success: true, data: { deadline: null } });
    render(<JobTracker />);
    await waitFor(() => screen.getByLabelText(/remove deadline/i));

    fireEvent.click(screen.getByLabelText(/remove deadline/i));
    await waitFor(() => expect(jobTrackerApi.updateDeadline).toHaveBeenCalledWith('job-1', null));
  });
});

describe('JobTracker — deadline filter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.setSystemTime(NOW);
    jobTrackerApi.getStats.mockResolvedValue({ stats: defaultStats });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows deadline filter buttons', async () => {
    jobTrackerApi.getAll.mockResolvedValue({ trackedJobs: [] });
    render(<JobTracker />);
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
    expect(screen.getByText(/⚠️ Closing Soon/i)).toBeInTheDocument();
    expect(screen.getByText(/🔴 Passed/i)).toBeInTheDocument();
    expect(screen.getByText(/Has Deadline/i)).toBeInTheDocument();
  });

  it('filters to show only closing-soon jobs', async () => {
    const soon = new Date(NOW.getTime() + 20 * 60 * 60 * 1000).toISOString();
    const future = new Date(NOW.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString();
    jobTrackerApi.getAll.mockResolvedValue({
      trackedJobs: [
        makeJob({ id: 'j1', title: 'Soon Job', deadline: soon }),
        makeJob({ id: 'j2', title: 'Future Job', deadline: future }),
      ],
    });
    jobTrackerApi.getStats.mockResolvedValue({ stats: { ...defaultStats, total: 2, saved: 2 } });
    render(<JobTracker />);
    await waitFor(() => screen.getByText('Soon Job'));

    fireEvent.click(screen.getByText(/⚠️ Closing Soon/i));
    await waitFor(() => expect(screen.getByText('Soon Job')).toBeInTheDocument());
    // Future job should be hidden
    expect(screen.queryByText('Future Job')).not.toBeInTheDocument();
  });
});

describe('JobTracker — deadline sorting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.setSystemTime(NOW);
    jobTrackerApi.getStats.mockResolvedValue({ stats: defaultStats });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows sort buttons', async () => {
    jobTrackerApi.getAll.mockResolvedValue({ trackedJobs: [] });
    render(<JobTracker />);
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());
    expect(screen.getByText('Date Added')).toBeInTheDocument();
    expect(screen.getByText('Deadline')).toBeInTheDocument();
  });

  it('sorts jobs by deadline when Deadline sort selected', async () => {
    const earlier = new Date(NOW.getTime() + 24 * 60 * 60 * 1000).toISOString();
    const later = new Date(NOW.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString();
    jobTrackerApi.getAll.mockResolvedValue({
      trackedJobs: [
        makeJob({ id: 'j1', title: 'Later Job', deadline: later }),
        makeJob({ id: 'j2', title: 'Earlier Job', deadline: earlier }),
      ],
    });
    jobTrackerApi.getStats.mockResolvedValue({ stats: { ...defaultStats, total: 2, saved: 2 } });
    render(<JobTracker />);
    await waitFor(() => screen.getByText('Later Job'));

    fireEvent.click(screen.getByText('Deadline'));

    await waitFor(() => {
      const headings = screen.getAllByRole('heading', { level: 4 });
      expect(headings[0].textContent).toBe('Earlier Job');
    });
  });
});

describe('JobTracker — empty states', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.setSystemTime(NOW);
    jobTrackerApi.getStats.mockResolvedValue({ stats: { total: 0, saved: 0, applied: 0, interviewing: 0, offered: 0, rejected: 0 } });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows empty state when no jobs tracked', async () => {
    jobTrackerApi.getAll.mockResolvedValue({ trackedJobs: [] });
    render(<JobTracker />);
    await waitFor(() => screen.getByText(/No Tracked Jobs Yet/i));
    expect(screen.getByText(/No Tracked Jobs Yet/i)).toBeInTheDocument();
  });

  it('shows filter empty state when filter returns no results', async () => {
    const future = new Date(NOW.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString();
    jobTrackerApi.getAll.mockResolvedValue({
      trackedJobs: [makeJob({ id: 'j1', title: 'Future Job', deadline: future })],
    });
    jobTrackerApi.getStats.mockResolvedValue({ stats: defaultStats });
    render(<JobTracker />);
    await waitFor(() => screen.getByText('Future Job'));

    // Filter to passed (no past deadlines)
    fireEvent.click(screen.getByText(/🔴 Passed/i));
    await waitFor(() => screen.getByText(/No Jobs Match Filter/i));
    expect(screen.getByText(/No Jobs Match Filter/i)).toBeInTheDocument();
  });
});
