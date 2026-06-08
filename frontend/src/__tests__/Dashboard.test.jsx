import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard.jsx';
import { jobTrackerApi, portfolioApi, resumeApi, userProfileApi } from '../services/api';

jest.mock('../services/api', () => ({
  resumeApi: {
    getAll: jest.fn(),
    previewGitHub: jest.fn(),
  },
  jobTrackerApi: {
    getAll: jest.fn(),
  },
  portfolioApi: {
    getAll: jest.fn(),
  },
  userProfileApi: {
    getMyProfile: jest.fn(),
  },
}));

beforeEach(() => {
  resumeApi.getAll.mockResolvedValue({ data: [] });
  resumeApi.previewGitHub.mockResolvedValue({});
  jobTrackerApi.getAll.mockResolvedValue({ trackedJobs: [] });
  portfolioApi.getAll.mockResolvedValue({ portfolios: [] });
  userProfileApi.getMyProfile.mockResolvedValue({ data: { name: 'John Doe' } });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Dashboard Component Test Suite', () => {
  test('renders the dashboard after loading service data', async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      const heading = screen.getByRole('heading', { name: /welcome back/i });
      expect(heading).toHaveTextContent(/john doe/i);
    });

    expect(screen.getByText(/0 tracked/i)).toBeInTheDocument();
    expect(screen.getByText(/0 resumes/i)).toBeInTheDocument();
  });

  test('falls back gracefully when resume API rejects asynchronously', async () => {
    resumeApi.getAll.mockRejectedValue(new Error('API Failure'));

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      const heading = screen.getByRole('heading', { name: /welcome back/i });
      expect(heading).toHaveTextContent(/john doe/i);
    });

    expect(screen.getByText(/0 resumes/i)).toBeInTheDocument();
    expect(screen.queryByText(/failed to load your dashboard/i)).not.toBeInTheDocument();
  });
});