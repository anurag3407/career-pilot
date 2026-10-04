import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ResumeBuilder from '../pages/ResumeBuilder'
import Enhance from '../pages/Enhance'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

// Mock toast to avoid noise
vi.mock('react-hot-toast', () => ({ toast: { success: vi.fn(), error: vi.fn() }, default: { success: vi.fn(), error: vi.fn() } }))

vi.mock('../services/api', () => ({
  resumeApi: {
    create: vi.fn().mockResolvedValue({ data: { id: 'resume-1' } }),
    getById: vi.fn().mockResolvedValue({ data: { id: 'resume-1', originalText: 'Sample' } }),
    update: vi.fn().mockResolvedValue({}),
    createVersion: vi.fn().mockResolvedValue({}),
    logAtsHistory: vi.fn().mockResolvedValue({}),
  },
  enhanceApi: {
    enhance: vi.fn().mockResolvedValue({ data: { enhancedResume: 'enhanced', tokensUsed: 123 } }),
    analyzeATS: vi.fn().mockResolvedValue({ data: { atsScore: 80, scoreBreakdown: {}, missingKeywords: [], improvements: [], strengths: [], summary: '' } }),
    comprehensiveAnalysis: vi.fn().mockResolvedValue({ data: { overallGrade: 'B', sectionGrades: {}, executiveSummary: '' } }),
    scoreResume: vi.fn().mockResolvedValue({ data: { overallScore: 85 } })
  }
}))

describe('Draft recovery and enhance retry flows', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  test('saves and restores draft in ResumeBuilder', async () => {
    render(
      <MemoryRouter initialEntries={["/resume-builder"]}>
        <Routes>
          <Route path="/resume-builder" element={<ResumeBuilder />} />
        </Routes>
      </MemoryRouter>
    )

    // Fill name and summary
    const nameInput = screen.getByPlaceholderText('John Doe')
    fireEvent.change(nameInput, { target: { value: 'Test User' } })

    const summary = screen.getByPlaceholderText('A brief summary of your professional background...')
    fireEvent.change(summary, { target: { value: 'This is my summary' } })

    // Click save draft
    const saveBtn = screen.getByRole('button', { name: /save draft/i })
    fireEvent.click(saveBtn)

    await waitFor(() => {
      const raw = localStorage.getItem('resumeBuilder:draft:v1')
      expect(raw).toBeTruthy()
      const parsed = JSON.parse(raw)
      expect(parsed.personal.name).toBe('Test User')
      expect(parsed.personal.summary).toBe('This is my summary')
    })

    // Remount component to simulate refresh
    const { cleanup } = await vi.importActual('@testing-library/react')
    cleanup()
    render(
      <MemoryRouter initialEntries={["/resume-builder"]}>
        <Routes>
          <Route path="/resume-builder" element={<ResumeBuilder />} />
        </Routes>
      </MemoryRouter>
    )

    // check restored
    await waitFor(() => expect(screen.getByDisplayValue('Test User')).toBeInTheDocument())
    expect(screen.getByDisplayValue('This is my summary')).toBeInTheDocument()
  })

  test('retry enhance after failure', async () => {
    const { enhance } = (await vi.importMock('../services/api')).enhanceApi
    // First call fails, second succeeds
    enhance.mockRejectedValueOnce(new Error('AI rate limited'))
    enhance.mockResolvedValueOnce({ data: { enhancedResume: 'ok', tokensUsed: 10 } })

    render(
      <MemoryRouter initialEntries={["/enhance/resume-1"]}>
        <Routes>
          <Route path="/enhance/:resumeId" element={<Enhance />} />
        </Routes>
      </MemoryRouter>
    )

    // Wait for resume load
    await waitFor(() => expect(screen.getByText(/Resume Analysis/i)).toBeInTheDocument())

    // simulate entering job role then Analyze and Enhance flows
    const roleInput = screen.getByPlaceholderText(/e.g., Senior Software Engineer/)
    fireEvent.change(roleInput, { target: { value: 'Software Engineer' } })

    const analyzeBtn = screen.getByRole('button', { name: /analyze resume/i })
    fireEvent.click(analyzeBtn)

    // Wait for Analyze -> then click Enhance
    await waitFor(() => expect(screen.getByText(/Recommended Improvements/i)).toBeInTheDocument())

    const enhanceBtn = screen.getByRole('button', { name: /Improve with AI/i })
    fireEvent.click(enhanceBtn)

    // First attempt will fail and show Retry button
    await waitFor(() => expect(screen.getByText(/Failed to enhance/i)).toBeInTheDocument())
    const retryBtn = screen.getByRole('button', { name: /retry/i })
    fireEvent.click(retryBtn)

    // After retry, success should navigate away (we'll just ensure no error message)
    await waitFor(() => expect(screen.queryByText(/Failed to enhance/i)).not.toBeInTheDocument())
  })
})
