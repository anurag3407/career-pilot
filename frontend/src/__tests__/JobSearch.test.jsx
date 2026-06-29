import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import JobSearch from '../pages/JobSearch'
import { jobsApi, jobTrackerApi } from '../services/api'
import toast from 'react-hot-toast'

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    custom: vi.fn(),
  },
}))

// Mock API services
vi.mock('../services/api', () => ({
  jobsApi: {
    search: vi.fn(),
  },
  jobTrackerApi: {
    getAll: vi.fn(() => Promise.resolve({ trackedJobs: [] })),
    track: vi.fn(),
  },
}))

describe('JobSearch page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders JobSearch page components', async () => {
    render(
      <MemoryRouter>
        <JobSearch />
      </MemoryRouter>
    )

    expect(screen.getByText('Find Your Dream Job')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Job title, keywords, or company.../i)).toBeInTheDocument()

    await waitFor(() => {
      expect(jobTrackerApi.getAll).toHaveBeenCalled()
    })
  })

  test('resets filters when "Reset Filters" button is clicked', async () => {
    jobsApi.search.mockResolvedValue({
      data: [{ id: '1', title: 'Software Engineer', company: 'Test Company' }]
    })

    render(
      <MemoryRouter>
        <JobSearch />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(jobTrackerApi.getAll).toHaveBeenCalled()
    })

    // Open filters
    const filterToggle = screen.getByRole('button', { name: /Toggle Filters/i })
    fireEvent.click(filterToggle)

    // Verify Job Type default is 'All Types'
    const jobTypeSelect = screen.getByLabelText(/Job Type/i)
    expect(jobTypeSelect.value).toBe('All Types')

    // Change value
    fireEvent.change(jobTypeSelect, { target: { value: 'Full-time' } })
    expect(jobTypeSelect.value).toBe('Full-time')

    // Click Reset Filters
    const resetBtn = screen.getByRole('button', { name: /Reset Filters/i })
    await act(async () => {
      fireEvent.click(resetBtn)
    })

    // Verify it changed back to 'All Types'
    expect(jobTypeSelect.value).toBe('All Types')
  })

  test.each([
    ['matchScore', 82, '82%'],
    ['match_percentage', 68, '68%'],
    ['matchPercentage', '82', '82%'],
  ])('renders API-provided match score badge from %s on job cards', async (field, value, expectedScore) => {
    jobsApi.search.mockResolvedValue({
      data: [{ id: '1', title: 'Frontend Developer', company: 'Test Company', [field]: value }]
    })

    render(
      <MemoryRouter>
        <JobSearch />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByPlaceholderText(/Job title, keywords, or company.../i), {
      target: { value: 'frontend' }
    })
    fireEvent.click(screen.getByRole('button', { name: /^Search$/i }))

    expect(await screen.findByText(expectedScore)).toBeInTheDocument()
    expect(screen.getByLabelText(new RegExp(`${expectedScore} .* Based on your resume`))).toBeInTheDocument()
  })
})
