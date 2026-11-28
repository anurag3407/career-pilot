import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Upload from '../pages/Upload'
import { uploadApi, resumeApi } from '../services/api'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('react-hot-toast', () => ({
  default: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
  }),
}))

function createPdfFile(text = 'Senior Backend Engineer') {
  const stream = `BT /F1 12 Tf 72 720 Td (${text}) Tj ET`
  const objs = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj',
    `4 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj',
  ]
  let pdf = '%PDF-1.4\n'
  const offsets = [0]
  for (const o of objs) {
    offsets.push(pdf.length)
    pdf += `${o}\n`
  }
  const xref = pdf.length
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`
  for (let i = 1; i <= objs.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`
  }
  pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`
  return new File([new TextEncoder().encode(pdf)], 'my-resume.pdf', { type: 'application/pdf' })
}

describe('Upload page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('extracts PDF text client-side, creates resume in D1, and navigates to /enhance/:id', async () => {
    const createSpy = vi.spyOn(resumeApi, 'create').mockResolvedValue({
      success: true,
      data: { id: 'res-abc-123' },
    })
    const uploadSpy = vi.spyOn(uploadApi, 'uploadPdf')

    const { container } = render(
      <MemoryRouter>
        <Upload />
      </MemoryRouter>
    )

    const input = container.querySelector('input[type="file"]')
    expect(input).toBeTruthy()

    const file = createPdfFile('Anurag Mishra Full Stack Engineer')
    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(uploadSpy).toHaveBeenCalledTimes(1)
      expect(createSpy).toHaveBeenCalledTimes(1)
    })

    expect(createSpy.mock.calls[0][0].originalText).toContain('Anurag Mishra Full Stack Engineer')
    await waitFor(() => {
      expect(screen.getByText(/Resume Uploaded Successfully!/i)).toBeInTheDocument()
    })
  })
})
