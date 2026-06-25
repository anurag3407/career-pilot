import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, test, expect, vi, beforeEach } from 'vitest'
import InterviewHistory from '../pages/InterviewHistory'
import { interviewApi } from '../services/api'
import toast from 'react-hot-toast'

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock('../services/api', () => ({
  interviewApi: {
    getHistory: vi.fn(),
    deleteHistory: vi.fn(),
  },
}))

const renderPage = () =>
  render(
    <MemoryRouter>
      <InterviewHistory />
    </MemoryRouter>
  )

describe('InterviewHistory page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('confirm', vi.fn(() => true))
  })

  test('removes a history item after successful deletion', async () => {
    interviewApi.getHistory.mockResolvedValue({
      data: [
        {
          _id: 'session-1',
          jobRole: 'Frontend Engineer',
          overallScore: 82,
          createdAt: '2026-06-20T00:00:00.000Z',
          completedAt: '2026-06-20T00:30:00.000Z',
          duration: 1800,
        },
      ],
    })
    interviewApi.deleteHistory.mockResolvedValue({ success: true })

    renderPage()

    expect(await screen.findByText('Frontend Engineer')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /delete frontend engineer history/i }))

    await waitFor(() => {
      expect(interviewApi.deleteHistory).toHaveBeenCalledWith('session-1')
    })

    await waitFor(() => {
      expect(screen.queryByText('Frontend Engineer')).not.toBeInTheDocument()
    })

    expect(toast.success).toHaveBeenCalledWith('Interview deleted')
  })

  test('keeps the history item when deletion fails', async () => {
    interviewApi.getHistory.mockResolvedValue({
      data: [
        {
          _id: 'session-2',
          jobRole: 'Backend Engineer',
          overallScore: 76,
          createdAt: '2026-06-21T00:00:00.000Z',
          completedAt: '2026-06-21T00:30:00.000Z',
          duration: 1800,
        },
      ],
    })
    interviewApi.deleteHistory.mockRejectedValue(new Error('request failed'))

    renderPage()

    expect(await screen.findByText('Backend Engineer')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /delete backend engineer history/i }))

    await waitFor(() => {
      expect(interviewApi.deleteHistory).toHaveBeenCalledWith('session-2')
    })

    expect(screen.getByText('Backend Engineer')).toBeInTheDocument()
    expect(toast.error).toHaveBeenCalledWith('Failed to delete interview')
  })

  test('does not call deleteHistory when deletion is cancelled', async () => {
    window.confirm.mockReturnValue(false)
    interviewApi.getHistory.mockResolvedValue({
      data: [
        {
          _id: 'session-3',
          jobRole: 'Product Manager',
          overallScore: 64,
          createdAt: '2026-06-22T00:00:00.000Z',
          completedAt: '2026-06-22T00:30:00.000Z',
          duration: 1800,
        },
      ],
    })

    renderPage()

    expect(await screen.findByText('Product Manager')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /delete product manager history/i }))

    expect(interviewApi.deleteHistory).not.toHaveBeenCalled()
  })
})
