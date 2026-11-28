import { describe, it, expect, vi, afterEach } from 'vitest'
import { extractTextFromPdf, isPdfFile } from '../utils/pdfExtract'
import { uploadApi } from '../services/api'

function createMinimalPdfBytes(lines = ['Jane Doe', 'Senior Software Engineer']) {
  const streamOps = lines
    .map((line, idx) => {
      const y = 720 - idx * 20
      const escaped = line.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
      return `BT /F1 12 Tf 72 ${y} Td (${escaped}) Tj ET`
    })
    .join('\n')

  const objects = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj',
    `4 0 obj\n<< /Length ${streamOps.length} >>\nstream\n${streamOps}\nendstream\nendobj`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj',
  ]

  let pdf = '%PDF-1.4\n'
  const offsets = [0]
  for (const obj of objects) {
    offsets.push(pdf.length)
    pdf += `${obj}\n`
  }
  const xrefStart = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`
  return new TextEncoder().encode(pdf)
}

function makePdfFile(bytes, name = 'resume.pdf', type = 'application/pdf') {
  return new File([bytes], name, { type })
}

describe('pdfExtract utility & uploadApi', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('isPdfFile recognizes standard, x-pdf, and extension-only PDFs', () => {
    expect(isPdfFile({ name: 'cv.pdf', type: 'application/pdf' })).toBe(true)
    expect(isPdfFile({ name: 'cv.pdf', type: 'application/x-pdf' })).toBe(true)
    expect(isPdfFile({ name: 'CV.PDF', type: '' })).toBe(true)
    expect(isPdfFile({ name: 'notes.txt', type: 'text/plain' })).toBe(false)
    expect(isPdfFile(null)).toBe(false)
  })

  it('extracts multi-line text from a valid PDF client-side', async () => {
    const file = makePdfFile(createMinimalPdfBytes(['Ada Lovelace', 'Staff Systems Engineer']))
    const result = await extractTextFromPdf(file)

    expect(result.pageCount).toBe(1)
    expect(result.text).toContain('Ada Lovelace')
    expect(result.text).toContain('Staff Systems Engineer')
  })

  it('rejects empty, oversized, non-PDF, and spoofed-magic-byte files', async () => {
    await expect(extractTextFromPdf(null)).rejects.toThrow(/no file/i)

    const txtFile = new File(['hello'], 'resume.txt', { type: 'text/plain' })
    await expect(extractTextFromPdf(txtFile)).rejects.toThrow(/unsupported file format/i)

    const emptyPdf = makePdfFile(new Uint8Array(0))
    await expect(extractTextFromPdf(emptyPdf)).rejects.toThrow(/empty/i)

    const bigFile = { name: 'big.pdf', type: 'application/pdf', size: 6 * 1024 * 1024 }
    await expect(extractTextFromPdf(bigFile, { maxSizeMB: 5 })).rejects.toThrow(/exceeds 5MB/i)

    const fakePdf = makePdfFile(new TextEncoder().encode('NOT A PDF FILE'))
    await expect(extractTextFromPdf(fakePdf)).rejects.toThrow(/valid PDF/i)
  })

  it('rejects scanned image-only PDFs with zero extractable text', async () => {
    const emptyPagePdf = makePdfFile(createMinimalPdfBytes([]))
    await expect(extractTextFromPdf(emptyPagePdf)).rejects.toThrow(/scanned image-only/i)
  })

  it('aborts cleanly when signal is already aborted', async () => {
    const controller = new AbortController()
    controller.abort()
    const file = makePdfFile(createMinimalPdfBytes(['Hello']))
    await expect(extractTextFromPdf(file, { signal: controller.signal })).rejects.toMatchObject({
      name: 'AbortError',
    })
  })

  it('uploadApi.uploadPdf succeeds even if ImageKit gateway is unavailable', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network down'))
    const file = makePdfFile(createMinimalPdfBytes(['Grace Hopper', 'Compiler Architect']))

    const res = await uploadApi.uploadPdf(file)
    expect(res.success).toBe(true)
    expect(res.data.extractedText).toContain('Grace Hopper')
    expect(res.data.extractedText).toContain('Compiler Architect')
    expect(res.data.pageCount).toBe(1)
    expect(res.data.pdfUrl).toBeNull()
  })

  it('uploadApi.uploadPdf attaches pdfUrl when ImageKit gateway succeeds', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          success: true,
          fileId: 'ik_123',
          name: 'resume.pdf',
          url: 'https://ik.imagekit.io/demo/resumes/resume.pdf',
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    )
    const file = makePdfFile(createMinimalPdfBytes(['Margaret Hamilton', 'Flight Software']))

    const res = await uploadApi.uploadPdf(file)
    expect(res.success).toBe(true)
    expect(res.data.extractedText).toContain('Margaret Hamilton')
    expect(res.data.pdfUrl).toBe('https://ik.imagekit.io/demo/resumes/resume.pdf')
  })

  it('uploadApi.extractText extracts text client-side without hitting /api', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    const file = makePdfFile(createMinimalPdfBytes(['Linus Torvalds', 'Kernel Maintainer']))

    const res = await uploadApi.extractText(file)
    expect(fetchSpy).not.toHaveBeenCalled()
    expect(res.success).toBe(true)
    expect(res.data.text).toContain('Linus Torvalds')
    expect(res.data.pageCount).toBe(1)
  })
})
