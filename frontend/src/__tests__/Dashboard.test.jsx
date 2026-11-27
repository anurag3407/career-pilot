import '@testing-library/jest-dom/vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import Dashboard from '../pages/Dashboard'

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { uid: 'user-1', email: 'pilot@careerpilot.app', displayName: 'Alex Mercer' },
  }),
}))

vi.mock('../services/api', () => ({
  resumeApi: {
    getAll: vi.fn().mockResolvedValue({
      resumes: [
        {
          id: 'res-1',
          title: 'Senior Frontend Resume',
          jobRole: 'Frontend Engineer',
          enhancedText: 'Improved',
          atsScore: 91,
          createdAt: '2026-11-10T10:00:00.000Z',
        },
      ],
    }),
    previewGitHub: vi.fn().mockResolvedValue({
      preview: {
        totalRepos: 24,
        totalStars: 140,
        topLanguages: ['TypeScript', 'React'],
        currentStreak: 12,
      },
    }),
  },
  jobTrackerApi: {
    getAll: vi.fn().mockResolvedValue({
      trackedJobs: [
        {
          id: 'job-1',
          title: 'Staff UI Engineer',
          company: 'Acme Flight',
          status: 'interviewing',
          appliedAt: new Date().toISOString(),
        },
        {
          id: 'job-2',
          title: 'Product Engineer',
          company: 'Runway Labs',
          status: 'applied',
          appliedAt: new Date().toISOString(),
        },
      ],
    }),
  },
  portfolioApi: {
    getAll: vi.fn().mockResolvedValue({ portfolios: [{ id: 'port-1', title: 'Main Portfolio' }] }),
  },
  userProfileApi: {
    getMyProfile: vi.fn().mockResolvedValue({
      profile: { name: 'Alex Mercer', github: 'alexmercer' },
    }),
  },
  interviewApi: {
    getHistory: vi.fn().mockResolvedValue({
      data: [{ _id: 'int-1', overallScore: 84 }],
    }),
  },
  careerProfileApi: {
    get: vi.fn().mockResolvedValue({
      profile: {
        masterResumeId: 'res-1',
        targetRoles: ['Staff UI Engineer'],
        weeklyApplyTarget: 5,
      },
    }),
  },
  starStoriesApi: {
    getAll: vi.fn().mockResolvedValue({
      stories: [{ id: 'st-1', title: 'Checkout latency cut by 40%' }],
    }),
  },
}))

describe('Dashboard Command Center', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders telemetry, pipeline, readiness, and categorized SaaS suites', async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText(/Alex/i)).toBeInTheDocument()
    })

    // Telemetry + Resumes + Applications
    expect(screen.getByText('Senior Frontend Resume')).toBeInTheDocument()
    expect(screen.getByText('Master')).toBeInTheDocument()
    expect(screen.getByText('Staff UI Engineer')).toBeInTheDocument()
    expect(screen.getByText('Acme Flight')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument() // 1 interviewing / 2 sent
    expect(screen.getByText('100%')).toBeInTheDocument() // 5/5 readiness steps

    // Suite tabs
    expect(screen.getByRole('tab', { name: 'Command Center' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: '01 Career Studio' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: '02 Job Pipeline' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: '03 Interview & Growth' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: '04 Presence & Network' })).toBeInTheDocument()
  })

  test('switches workspace tabs and filters tool directory', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText('Senior Frontend Resume')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('tab', { name: '03 Interview & Growth' }))
    expect(screen.getByText('Interview readiness')).toBeInTheDocument()
    expect(screen.getByText('84%')).toBeInTheDocument()

    const filterInput = screen.getByLabelText('Filter product suite tools')
    await user.type(filterInput, 'Skill Gap')
    expect(screen.getAllByText('Skill Gap Analyzer').length).toBeGreaterThanOrEqual(1)
    expect(screen.queryByText('Career Path')).not.toBeInTheDocument()
    expect(screen.queryByText('Interview History')).not.toBeInTheDocument()
  })
})
