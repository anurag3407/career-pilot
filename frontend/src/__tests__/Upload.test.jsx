import { fireEvent, render, screen, waitFor, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Upload from '../pages/Upload'

// Per-test timeout values used below (Vitest in this environment doesn't expose vi.setTimeout)

const mocks = vi.hoisted(() => {
  const toast = Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  })

  return {
    navigate: vi.fn(),
    toast,
    uploadPdf: vi.fn(),
    createResume: vi.fn(),
  }
})

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mocks.navigate,
  }
})

vi.mock('react-hot-toast', () => ({
  default: mocks.toast,
}))

vi.mock('../services/api', () => ({
  uploadApi: {
    uploadPdf: mocks.uploadPdf,
  },
  resumeApi: {
    create: mocks.createResume,
  },
}))

vi.mock('../components/Button', () => ({
  default: ({ children, loading = false, ...props }) => (
    <button {...props}>{loading ? 'Loading...' : children}</button>
  ),
}))

vi.mock('../components/DropZone', () => ({
  default: ({ onFileSelect, disabled }) => (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onFileSelect(new File(['resume'], 'resume.pdf', { type: 'application/pdf' }))}
    >
      Start upload
    </button>
  ),
}))

describe('Upload page regression flows', () => {
  beforeEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  afterEach(() => {
    // ensure real timers are clean
  })

  test('cancels an in-flight upload and prevents the redirect timer from firing', async () => {
    mocks.uploadPdf.mockImplementation((_file, { signal } = {}) => {
      return new Promise((_, reject) => {
        signal?.addEventListener(
          'abort',
          () => {
            const error = new Error('Aborted')
            error.name = 'AbortError'
            reject(error)
          },
          { once: true }
        )
      })
    })

    mocks.createResume.mockResolvedValue({ data: { id: 'resume-1' } })

    render(
      <MemoryRouter>
        <Upload />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: /start upload/i }))

    const cancelButton = await screen.findByRole('button', { name: /cancel upload/i })
    fireEvent.click(cancelButton)

    await waitFor(() => {
      expect(mocks.toast).toHaveBeenCalledWith('Upload cancelled')
    })

    // wait real time for any redirect timers to run
    await new Promise((r) => setTimeout(r, 2000))

    expect(mocks.createResume).not.toHaveBeenCalled()
    expect(mocks.navigate).not.toHaveBeenCalled()
  }, 10000)

  test('redirects after a successful upload and resume creation', async () => {
    mocks.uploadPdf.mockResolvedValueOnce({
      data: { extractedText: 'sample resume text' },
    })
    mocks.createResume.mockResolvedValueOnce({
      data: { id: 'resume-42' },
    })

    render(
      <MemoryRouter>
        <Upload />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: /start upload/i }))

    expect(await screen.findByText(/resume uploaded successfully/i)).toBeInTheDocument()

    await new Promise((r) => setTimeout(r, 1500))

    await waitFor(() => {
      expect(mocks.navigate).toHaveBeenCalledWith('/enhance/resume-42')
    })
  }, 10000)
})