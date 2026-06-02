import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import Enhance from '../pages/Enhance'
import * as api from '../services/api'
import * as confetti from '../utils/confetti'
import toast from 'react-hot-toast'

// Mock dependencies
vi.mock('../services/api', () => ({
  resumeApi: {
    getById: vi.fn(),
    update: vi.fn(),
    logAtsHistory: vi.fn(),
    createVersion: vi.fn()
  },
  enhanceApi: {
    analyzeATS: vi.fn(),
    comprehensiveAnalysis: vi.fn(),
    enhance: vi.fn(),
    scoreResume: vi.fn()
  }
}))

vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn()
  }
}))

vi.mock('../utils/confetti', () => ({
  triggerConfetti: vi.fn()
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    li: ({ children, ...props }) => <li {...props}>{children}</li>,
    circle: ({ children, ...props }) => <circle {...props}>{children}</circle>
  }
}))

vi.mock('../components/ui/ResumeAnalysisSkeleton', () => ({
  default: () => <div data-testid="resume-analysis-skeleton">Loading...</div>
}))

vi.mock('../components/ui/Skeleton', () => ({
  SkeletonList: () => <div data-testid="skeleton-list">Loading...</div>
}))

vi.mock('../components/ResumeScore', () => ({
  default: ({ data, onRescore }) => (
    <div data-testid="resume-score">
      <div>{data?.overallScore}</div>
      <button onClick={onRescore}>Rescore</button>
    </div>
  )
}))

const mockResume = {
  id: 'resume-123',
  title: 'My Resume',
  originalText: 'Sample resume text',
  jobRole: '',
  yearsOfExperience: 5
}

const mockAtsAnalysis = {
  atsScore: 85,
  scoreBreakdown: {
    keywordMatch: 80,
    formatting: 90,
    experienceRelevance: 85,
    skillsAlignment: 80,
    educationMatch: 75
  },
  summary: 'Your resume is well-formatted and matches the job role well.',
  strengths: ['Good keyword match', 'Well-formatted', 'Relevant experience'],
  missingKeywords: ['React', 'Node.js', 'Docker'],
  improvements: [
    {
      issue: 'Add more action verbs',
      priority: 'high',
      category: 'content',
      suggestion: 'Use stronger action verbs to describe achievements'
    },
    {
      issue: 'Quantify achievements',
      priority: 'medium',
      category: 'impact',
      suggestion: 'Add metrics and numbers to your accomplishments'
    }
  ]
}

const mockComprehensiveAnalysis = {
  overallGrade: 'B',
  executiveSummary: 'Good resume with room for improvement',
  sectionGrades: {
    summary: { grade: 'A', score: 85, feedback: 'Strong summary' },
    experience: { grade: 'B', score: 75, feedback: 'Good experience section' },
    education: { grade: 'A', score: 90, feedback: 'Complete education details' },
    skills: { grade: 'B', score: 80, feedback: 'Skills well-listed' },
    projects: { grade: 'C', score: 70, feedback: 'Add more project details' }
  },
  bulletAnalysis: [
    {
      original: 'Developed web application',
      improved: 'Architected and deployed React web application serving 10k+ users',
      score: 6,
      issues: ['Lacking metrics', 'Weak action verb'],
      starCheck: {
        hasSituation: true,
        hasTask: true,
        hasAction: true,
        hasResult: false
      }
    }
  ],
  actionVerbAnalysis: {
    verbScore: 75,
    powerVerbsUsed: ['Developed', 'Implemented', 'Led']
  },
  quantificationAnalysis: {
    percentageQuantified: 60,
    bulletsWithMetrics: 6,
    bulletsWithoutMetrics: 4
  },
  seniorTips: [
    {
      tip: 'Use numbers and percentages',
      category: 'impact',
      priority: 'high',
      example: 'Increased sales by 25%'
    }
  ],
  competitiveEdge: {
    score: 72,
    standoutFactors: ['Strong technical background', 'Good leadership experience'],
    differentiators: ['Add more quantified results', 'Include certifications']
  }
}

const mockScoreData = {
  overallScore: 78,
  sections: {
    summary: 85,
    experience: 75,
    education: 90
  },
  tips: ['Add metrics', 'Use action verbs', 'Expand projects']
}

// Wrapper component for router
const EnhanceWithRouter = (props) => (
  <BrowserRouter>
    <Enhance {...props} />
  </BrowserRouter>
)

describe('Enhance Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    api.resumeApi.getById.mockResolvedValue({ data: mockResume })
    api.enhanceApi.analyzeATS.mockResolvedValue({ data: mockAtsAnalysis })
    api.enhanceApi.comprehensiveAnalysis.mockResolvedValue({ data: mockComprehensiveAnalysis })
    api.resumeApi.update.mockResolvedValue({ data: mockResume })
    api.resumeApi.logAtsHistory.mockResolvedValue({ data: {} })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // ============================================================
  // PAGE RENDER & LOADING TESTS
  // ============================================================

  describe('Page Render - Initial Load', () => {
    it('should render loading skeleton on initial mount', () => {
      render(<EnhanceWithRouter />)
      expect(screen.getByTestId('skeleton-list')).toBeInTheDocument()
    })

    it('should fetch resume on mount', async () => {
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(api.resumeApi.getById).toHaveBeenCalled()
      })
    })

    it('should display resume title after loading', async () => {
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByText('My Resume')).toBeInTheDocument()
      })
    })

    it('should show "Resume Analysis" heading', async () => {
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByText('Resume Analysis')).toBeInTheDocument()
      })
    })

    it('should display job role input field when not analyzed', async () => {
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })
    })
  })

  // ============================================================
  // JOB ROLE INPUT TESTS
  // ============================================================

  describe('Job Role Input', () => {
    it('should update job role on input change', async () => {
      const user = userEvent.setup()
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Senior Software Engineer/)
      await user.type(input, 'Senior Engineer')
      
      expect(input).toHaveValue('Senior Engineer')
    })

    it('should disable Analyze button when job role is empty', async () => {
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        const button = screen.getByRole('button', { name: /Analyze Resume/ })
        expect(button).toBeDisabled()
      })
    })

    it('should enable Analyze button when job role is entered', async () => {
      const user = userEvent.setup()
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Senior Software Engineer/)
      await user.type(input, 'Senior Engineer')

      const button = screen.getByRole('button', { name: /Analyze Resume/ })
      expect(button).not.toBeDisabled()
    })

    it('should trigger analysis on Enter key press', async () => {
      const user = userEvent.setup()
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Senior Software Engineer/)
      await user.type(input, 'Senior Engineer')
      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(api.enhanceApi.analyzeATS).toHaveBeenCalledWith('Sample resume text', 'Senior Engineer')
      })
    })
  })

  // ============================================================
  // API CALL TESTS
  // ============================================================

  describe('API Calls on Analyze', () => {
    it('should call analyzeATS with resume text and job role', async () => {
      const user = userEvent.setup()
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Senior Software Engineer/)
      await user.type(input, 'Backend Engineer')

      const button = screen.getByRole('button', { name: /Analyze Resume/ })
      await user.click(button)

      await waitFor(() => {
        expect(api.enhanceApi.analyzeATS).toHaveBeenCalledWith('Sample resume text', 'Backend Engineer')
      })
    })

    it('should call comprehensiveAnalysis with resume text and job role', async () => {
      const user = userEvent.setup()
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Senior Software Engineer/)
      await user.type(input, 'Backend Engineer')

      const button = screen.getByRole('button', { name: /Analyze Resume/ })
      await user.click(button)

      await waitFor(() => {
        expect(api.enhanceApi.comprehensiveAnalysis).toHaveBeenCalledWith('Sample resume text', 'Backend Engineer')
      })
    })

    it('should call resumeApi.update with jobRole', async () => {
      const user = userEvent.setup()
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Senior Software Engineer/)
      await user.type(input, 'Backend Engineer')

      const button = screen.getByRole('button', { name: /Analyze Resume/ })
      await user.click(button)

      await waitFor(() => {
        expect(api.resumeApi.update).toHaveBeenCalled()
      })
    })

    it('should call logAtsHistory after analysis', async () => {
      const user = userEvent.setup()
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Senior Software Engineer/)
      await user.type(input, 'Backend Engineer')

      const button = screen.getByRole('button', { name: /Analyze Resume/ })
      await user.click(button)

      await waitFor(() => {
        expect(api.resumeApi.logAtsHistory).toHaveBeenCalled()
      })
    })
  })

  // ============================================================
  // RESULTS DISPLAY TESTS
  // ============================================================

  describe('Results Display', () => {
    it('should display ATS score after analysis', async () => {
      const user = userEvent.setup()
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Senior Software Engineer/)
      await user.type(input, 'Backend Engineer')

      const button = screen.getByRole('button', { name: /Analyze Resume/ })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByText('85')).toBeInTheDocument()
      })
    })

    it('should display score breakdown', async () => {
      const user = userEvent.setup()
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Senior Software Engineer/)
      await user.type(input, 'Backend Engineer')

      const button = screen.getByRole('button', { name: /Analyze Resume/ })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByText('Keyword Match')).toBeInTheDocument()
        expect(screen.getByText('Formatting')).toBeInTheDocument()
      })
    })

    it('should display analysis summary', async () => {
      const user = userEvent.setup()
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Senior Software Engineer/)
      await user.type(input, 'Backend Engineer')

      const button = screen.getByRole('button', { name: /Analyze Resume/ })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByText(/well-formatted and matches/i)).toBeInTheDocument()
      })
    })

    it('should display strengths section', async () => {
      const user = userEvent.setup()
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Senior Software Engineer/)
      await user.type(input, 'Backend Engineer')

      const button = screen.getByRole('button', { name: /Analyze Resume/ })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByText('Good keyword match')).toBeInTheDocument()
      })
    })

    it('should display missing keywords', async () => {
      const user = userEvent.setup()
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Senior Software Engineer/)
      await user.type(input, 'Backend Engineer')

      const button = screen.getByRole('button', { name: /Analyze Resume/ })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByText('React')).toBeInTheDocument()
        expect(screen.getByText('Node.js')).toBeInTheDocument()
      })
    })

    it('should display recommended improvements', async () => {
      const user = userEvent.setup()
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Senior Software Engineer/)
      await user.type(input, 'Backend Engineer')

      const button = screen.getByRole('button', { name: /Analyze Resume/ })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByText('Add more action verbs')).toBeInTheDocument()
      })
    })
  })

  // ============================================================
  // KEYWORD COPY FUNCTIONALITY
  // ============================================================

  describe('Keyword Copy to Clipboard', () => {
    it('should copy keyword to clipboard on click', async () => {
      const user = userEvent.setup()
      const clipboardWriteText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
      
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Senior Software Engineer/)
      await user.type(input, 'Backend Engineer')

      const button = screen.getByRole('button', { name: /Analyze Resume/ })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByText('React')).toBeInTheDocument()
      })

      const reactKeyword = screen.getByText('React')
      await user.click(reactKeyword)

      expect(clipboardWriteText).toHaveBeenCalledWith('React')
    })

    it('should show "Copied!" feedback after copying keyword', async () => {
      const user = userEvent.setup()
      vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
      
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Senior Software Engineer/)
      await user.type(input, 'Backend Engineer')

      const button = screen.getByRole('button', { name: /Analyze Resume/ })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByText('React')).toBeInTheDocument()
      })

      const reactKeyword = screen.getByText('React')
      await user.click(reactKeyword)

      await waitFor(() => {
        expect(screen.getByText('Copied!')).toBeInTheDocument()
      })
    })

    it('should show error toast on clipboard failure', async () => {
      const user = userEvent.setup()
      vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValueOnce(new Error('Clipboard failed'))
      
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Senior Software Engineer/)
      await user.type(input, 'Backend Engineer')

      const button = screen.getByRole('button', { name: /Analyze Resume/ })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByText('React')).toBeInTheDocument()
      })

      const reactKeyword = screen.getByText('React')
      await user.click(reactKeyword)

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('copy'))
      })
    })
  })

  // ============================================================
  // TAB SWITCHING TESTS
  // ============================================================

  describe('Tab Navigation', () => {
    it('should switch to Section Grades tab', async () => {
      const user = userEvent.setup()
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Senior Software Engineer/)
      await user.type(input, 'Backend Engineer')

      const button = screen.getByRole('button', { name: /Analyze Resume/ })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByText('Overall Resume Grade')).toBeInTheDocument()
      })
    })

    it('should switch to Bullet Analysis tab', async () => {
      const user = userEvent.setup()
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Senior Software Engineer/)
      await user.type(input, 'Backend Engineer')

      const button = screen.getByRole('button', { name: /Analyze Resume/ })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByText('Bullet Analysis')).toBeInTheDocument()
      })

      const bulletTab = screen.getByRole('button', { name: /Bullet Analysis/ })
      await user.click(bulletTab)

      expect(screen.getByText('Bullet-by-Bullet Analysis')).toBeInTheDocument()
    })

    it('should switch to Senior Tips tab', async () => {
      const user = userEvent.setup()
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Senior Software Engineer/)
      await user.type(input, 'Backend Engineer')

      const button = screen.getByRole('button', { name: /Analyze Resume/ })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByText('Senior Tips')).toBeInTheDocument()
      })

      const tipsTab = screen.getByRole('button', { name: /Senior Tips/ })
      await user.click(tipsTab)

      expect(screen.getByText('Senior Resume Expert Tips')).toBeInTheDocument()
    })

    it('should switch to Resume Score tab', async () => {
      const user = userEvent.setup()
      
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Senior Software Engineer/)
      await user.type(input, 'Backend Engineer')

      const button = screen.getByRole('button', { name: /Analyze Resume/ })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByText('Resume Score')).toBeInTheDocument()
      })

      const scoreTab = screen.getByRole('button', { name: /Resume Score/ })
      await user.click(scoreTab)

      // The tab button should have active styling after click
      expect(scoreTab).toHaveClass('bg-primary/20')
    })
  })

  // ============================================================
  // ERROR HANDLING TESTS
  // ============================================================

  describe('Error Handling', () => {
    it('should show error toast when resume fetch fails', async () => {
      api.resumeApi.getById.mockRejectedValueOnce(new Error('Failed to load'))
      
      render(<EnhanceWithRouter />)

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to load resume')
      })
    })

    it('should show error toast when analyze fails', async () => {
      const user = userEvent.setup()
      api.enhanceApi.analyzeATS.mockRejectedValueOnce(new Error('Analysis failed'))
      
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Senior Software Engineer/)
      await user.type(input, 'Backend Engineer')

      const button = screen.getByRole('button', { name: /Analyze Resume/ })
      await user.click(button)

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled()
      })
    })

    it('should prevent click when job role is empty', async () => {
      const user = userEvent.setup()
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const button = screen.getByRole('button', { name: /Analyze Resume/ })
      
      // Button should be disabled when job role is empty
      expect(button).toBeDisabled()
      
      // Even if we try to click it, the handler won't execute
      await user.click(button)
      
      // API should not be called
      expect(api.enhanceApi.analyzeATS).not.toHaveBeenCalled()
    })
  })

  // ============================================================
  // CONFETTI TRIGGER TEST
  // ============================================================

  describe('Confetti Celebration', () => {
    it('should trigger confetti when score is 90 or higher', async () => {
      const user = userEvent.setup()
      api.enhanceApi.analyzeATS.mockResolvedValueOnce({
        data: { ...mockAtsAnalysis, atsScore: 95 }
      })
      
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Senior Software Engineer/)
      await user.type(input, 'Backend Engineer')

      const button = screen.getByRole('button', { name: /Analyze Resume/ })
      await user.click(button)

      await waitFor(() => {
        expect(confetti.triggerConfetti).toHaveBeenCalled()
      })
    })

    it('should not trigger confetti when score is below 90', async () => {
      const user = userEvent.setup()
      
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Senior Software Engineer/)
      await user.type(input, 'Backend Engineer')

      const button = screen.getByRole('button', { name: /Analyze Resume/ })
      await user.click(button)

      await waitFor(() => {
        expect(confetti.triggerConfetti).not.toHaveBeenCalled()
      })
    })
  })

  // ============================================================
  // TOAST NOTIFICATIONS
  // ============================================================

  describe('Toast Notifications', () => {
    it('should show success toast after analysis', async () => {
      const user = userEvent.setup()
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Senior Software Engineer/)
      await user.type(input, 'Backend Engineer')

      const button = screen.getByRole('button', { name: /Analyze Resume/ })
      await user.click(button)

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Senior-level analysis complete!')
      })
    })
  })

  // ============================================================
  // BUTTON INTERACTION TESTS
  // ============================================================

  describe('Button Interactions', () => {
    it('should show "Analyze Different Role" button after analysis', async () => {
      const user = userEvent.setup()
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Senior Software Engineer/)
      await user.type(input, 'Backend Engineer')

      const button = screen.getByRole('button', { name: /Analyze Resume/ })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Analyze Different Role/ })).toBeInTheDocument()
      })
    })

    it('should reset analysis when clicking "Analyze Different Role"', async () => {
      const user = userEvent.setup()
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Senior Software Engineer/)
      await user.type(input, 'Backend Engineer')

      const button = screen.getByRole('button', { name: /Analyze Resume/ })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Analyze Different Role/ })).toBeInTheDocument()
      })

      const resetButton = screen.getByRole('button', { name: /Analyze Different Role/ })
      await user.click(resetButton)

      // After reset, job role input should be visible again and results should be gone
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Analyze Resume/ })).not.toBeDisabled()
      }, { timeout: 2000 })
    })

    it('should show "Score My Resume" button after analysis', async () => {
      const user = userEvent.setup()
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Senior Software Engineer/)
      await user.type(input, 'Backend Engineer')

      const button = screen.getByRole('button', { name: /Analyze Resume/ })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Score My Resume/ })).toBeInTheDocument()
      })
    })
  })

  // ============================================================
  // LOADING STATE TESTS
  // ============================================================

  describe('Loading States', () => {
    it('should show analyzing skeleton while analyzing', async () => {
      const user = userEvent.setup()
      let resolveFn
      const promise = new Promise(resolve => {
        resolveFn = resolve
      })
      api.enhanceApi.analyzeATS.mockImplementationOnce(() => promise)
      api.enhanceApi.comprehensiveAnalysis.mockImplementationOnce(() => promise)
      
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Senior Software Engineer/)
      await user.type(input, 'Backend Engineer')

      const button = screen.getByRole('button', { name: /Analyze Resume/ })
      await user.click(button)

      // Wait a moment for skeleton to appear
      await new Promise(r => setTimeout(r, 100))
      
      expect(screen.getByTestId('resume-analysis-skeleton')).toBeInTheDocument()

      resolveFn({ data: mockAtsAnalysis })
    })
  })

  // ============================================================
  // COMPREHENSIVE ANALYSIS DISPLAY
  // ============================================================

  describe('Comprehensive Analysis Display', () => {
    it('should display overall grade', async () => {
      const user = userEvent.setup()
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Senior Software Engineer/)
      await user.type(input, 'Backend Engineer')

      const button = screen.getByRole('button', { name: /Analyze Resume/ })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByText('Overall Resume Grade')).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('should display section grades', async () => {
      const user = userEvent.setup()
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Senior Software Engineer/)
      await user.type(input, 'Backend Engineer')

      const button = screen.getByRole('button', { name: /Analyze Resume/ })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByText('Overall Resume Grade')).toBeInTheDocument()
      }, { timeout: 3000 })

      expect(screen.getByText('Summary')).toBeInTheDocument()
    })

    it('should display action verb analysis', async () => {
      const user = userEvent.setup()
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Senior Software Engineer/)
      await user.type(input, 'Backend Engineer')

      const button = screen.getByRole('button', { name: /Analyze Resume/ })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByText('Action Verb Quality')).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('should display quantification analysis', async () => {
      const user = userEvent.setup()
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Senior Software Engineer/)
      await user.type(input, 'Backend Engineer')

      const button = screen.getByRole('button', { name: /Analyze Resume/ })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByText('Quantification Level')).toBeInTheDocument()
      }, { timeout: 3000 })
    })
  })

  // ============================================================
  // SCORE RESUME TESTS
  // ============================================================

  describe('Score Resume Functionality', () => {
    it('should call scoreResume API when Score button is clicked', async () => {
      const user = userEvent.setup()
      api.enhanceApi.scoreResume.mockResolvedValueOnce({ data: mockScoreData })
      
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Senior Software Engineer/)
      await user.type(input, 'Backend Engineer')

      const button = screen.getByRole('button', { name: /Analyze Resume/ })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Score My Resume/ })).toBeInTheDocument()
      })

      const scoreButton = screen.getByRole('button', { name: /Score My Resume/ })
      await user.click(scoreButton)

      await waitFor(() => {
        expect(api.enhanceApi.scoreResume).toHaveBeenCalled()
      })
    })

    it('should display resume score after scoring', async () => {
      const user = userEvent.setup()
      api.enhanceApi.scoreResume.mockResolvedValueOnce({ data: mockScoreData })
      
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Senior Software Engineer/)
      await user.type(input, 'Backend Engineer')

      const button = screen.getByRole('button', { name: /Analyze Resume/ })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Score My Resume/ })).toBeInTheDocument()
      })

      const scoreButton = screen.getByRole('button', { name: /Score My Resume/ })
      await user.click(scoreButton)

      await waitFor(() => {
        expect(screen.getByTestId('resume-score')).toBeInTheDocument()
      })
    })
  })

  // ============================================================
  // EDGE CASES
  // ============================================================

  describe('Edge Cases', () => {
    it('should handle empty strengths array', async () => {
      const user = userEvent.setup()
      api.enhanceApi.analyzeATS.mockResolvedValueOnce({
        data: { ...mockAtsAnalysis, strengths: [] }
      })
      
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Senior Software Engineer/)
      await user.type(input, 'Backend Engineer')

      const button = screen.getByRole('button', { name: /Analyze Resume/ })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByText('Strengths')).toBeInTheDocument()
      })
    })

    it('should handle no missing keywords', async () => {
      const user = userEvent.setup()
      api.enhanceApi.analyzeATS.mockResolvedValueOnce({
        data: { ...mockAtsAnalysis, missingKeywords: [] }
      })
      
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Senior Software Engineer/)
      await user.type(input, 'Backend Engineer')

      const button = screen.getByRole('button', { name: /Analyze Resume/ })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByText('No critical keywords missing!')).toBeInTheDocument()
      })
    })

    it('should display score feedback based on score value', async () => {
      const user = userEvent.setup()
      api.enhanceApi.analyzeATS.mockResolvedValueOnce({
        data: { ...mockAtsAnalysis, atsScore: 95 }
      })
      
      render(<EnhanceWithRouter />)
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Senior Software Engineer/)).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText(/Senior Software Engineer/)
      await user.type(input, 'Backend Engineer')

      const button = screen.getByRole('button', { name: /Analyze Resume/ })
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByText('Excellent!')).toBeInTheDocument()
      })
    })
  })
})
