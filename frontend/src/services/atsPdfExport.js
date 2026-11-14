import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

import { downloadBlob } from '../utils/downloadBlob'

/**
 * ATS-safe PDF export.
 *
 * Strategy:
 *   1. Use jsPDF.html() with autoPaging='text' — produces a PDF with a real,
 *      selectable text layer (so ATS bots can extract keywords).
 *   2. On failure (templates with heavy gradients or unusual fonts), fall back
 *      to the html2canvas + addImage approach used previously.
 *
 * @param {HTMLElement} node     Root DOM node to export
 * @param {string}      filename Output filename
 * @param {object}      opts    { orientation, format, marginMm }
 * @returns {Promise<{ ok: boolean, method: 'text'|'canvas', filename: string }>}
 */
export async function exportAtsSafePdf(node, filename = 'resume.pdf', opts = {}) {
  const {
    orientation = 'portrait',
    format = 'a4',
    marginMm = 10,
  } = opts

  if (!node) throw new Error('exportAtsSafePdf: node is required')

  // Try text-layer path first
  try {
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format,
    })
    await pdf.html(node, {
      autoPaging: 'text',
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        windowWidth: node.scrollWidth,
      },
      margin: [marginMm, marginMm, marginMm, marginMm],
      width: format === 'letter' ? 195.9 : 190,
      windowWidth: node.scrollWidth,
    })
    pdf.save(filename)
    return { ok: true, method: 'text', filename }
  } catch (err) {
    // Fall through to canvas fallback
    console.warn('ATS PDF (text) failed, falling back to canvas raster:', err)
  }

  // Fallback: rasterize the whole node and slice into pages
  const canvas = await html2canvas(node, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    windowWidth: node.scrollWidth,
    windowHeight: node.scrollHeight,
  })

  const pdf = new jsPDF({ orientation, unit: 'mm', format })
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const imgWidth = pageWidth
  const imgHeight = (canvas.height * imgWidth) / canvas.width
  const pageHeightInCanvas = (pageHeight * canvas.width) / pageWidth

  if (imgHeight <= pageHeight) {
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, imgWidth, imgHeight)
  } else {
    let yOffset = 0
    let pageIdx = 0
    while (yOffset < canvas.height) {
      const sliceHeight = Math.min(pageHeightInCanvas, canvas.height - yOffset)
      const pageCanvas = document.createElement('canvas')
      pageCanvas.width = canvas.width
      pageCanvas.height = sliceHeight
      const ctx = pageCanvas.getContext('2d')
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height)
      ctx.drawImage(canvas, 0, yOffset, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight)
      const imgData = pageCanvas.toDataURL('image/jpeg', 0.92)
      if (pageIdx > 0) pdf.addPage()
      pdf.addImage(
        imgData, 'JPEG', 0, 0,
        imgWidth,
        (sliceHeight * imgWidth) / canvas.width,
      )
      yOffset += sliceHeight
      pageIdx += 1
    }
  }
  pdf.save(filename)
  return { ok: true, method: 'canvas', filename }
}

/* ───────────────────────────────────────────────────────────────────────────
   Structured (text-layer) PDF export

   The DOM-based export above rasterises the preview when jsPDF's html() path
   is unavailable, which produces an image-only PDF that no ATS can read and
   that depends on html2canvas being able to paint the template. For the inline
   canvas we lay the resume out directly with jsPDF's text API instead: real
   selectable text, real page breaks, no canvas dependency, and a document that
   is deterministic enough to assert on.
   ─────────────────────────────────────────────────────────────────────────── */

const PDF_INK = [17, 24, 39]
const PDF_MUTED = [82, 82, 91]
const PDF_ACCENT = [31, 41, 55]

/**
 * Lay out a canonical resume as a real-text A4 PDF.
 *
 * @param {object} resumeData canonical shape (personal/experience/…)
 * @param {object} options    { pageSize, margin, font }
 * @returns {{ doc: jsPDF, pageCount: number, bytes: ArrayBuffer }}
 */
export function buildResumePdf(resumeData = {}, options = {}) {
  const { pageSize = 'a4', margin = 14, font = 'helvetica' } = options
  const d = resumeData || {}
  const p = d.personal || {}

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: pageSize, compress: false })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const contentWidth = pageWidth - margin * 2

  let y = margin + 1
  const lineHeight = (size, factor = 1.34) => size * 0.3528 * factor
  const ensure = (height) => {
    if (y + height > pageHeight - margin) {
      doc.addPage()
      y = margin
    }
  }

  const write = (text, opts = {}) => {
    if (text === null || text === undefined || text === '') return
    const {
      x = margin,
      size = 9.8,
      style = 'normal',
      color = PDF_INK,
      align = 'left',
      width = contentWidth,
    } = opts
    doc.setFont(font, style)
    doc.setFontSize(size)
    doc.setTextColor(color[0], color[1], color[2])
    const step = lineHeight(size)
    doc.splitTextToSize(String(text), width).forEach((line) => {
      ensure(step)
      doc.text(line, x, y, { align })
      y += step
    })
  }

  const heading = (label) => {
    if (!label) return
    y += 2.6
    ensure(lineHeight(9.6) + 3)
    doc.setFont(font, 'bold')
    doc.setFontSize(9.6)
    doc.setTextColor(PDF_ACCENT[0], PDF_ACCENT[1], PDF_ACCENT[2])
    doc.text(String(label).toUpperCase(), margin, y)
    y += 1.5
    doc.setDrawColor(PDF_ACCENT[0], PDF_ACCENT[1], PDF_ACCENT[2])
    doc.setLineWidth(0.25)
    doc.line(margin, y, pageWidth - margin, y)
    y += lineHeight(9.6) * 0.85
  }

  /** Left/right pair on one baseline (role + dates, institution + dates). */
  const pair = (left, right, opts = {}) => {
    if (!left && !right) return
    const { size = 10, leftStyle = 'bold', leftColor = PDF_INK, rightColor = PDF_MUTED } = opts
    doc.setFont(font, leftStyle)
    doc.setFontSize(size)
    const rightWidth = right ? doc.getTextWidth(String(right)) + 4 : 0
    const lines = doc.splitTextToSize(String(left || ''), Math.max(30, contentWidth - rightWidth))
    const step = lineHeight(size)
    const firstBaseline = y + step * 0.72
    lines.forEach((line) => {
      ensure(step)
      doc.setTextColor(leftColor[0], leftColor[1], leftColor[2])
      doc.text(line, margin, y + step * 0.72)
      y += step
    })
    if (right) {
      doc.setFont(font, 'normal')
      doc.setFontSize(size - 0.5)
      doc.setTextColor(rightColor[0], rightColor[1], rightColor[2])
      doc.text(String(right), pageWidth - margin, firstBaseline, { align: 'right' })
    }
  }

  const bullets = (items = []) => {
    items.filter(Boolean).forEach((item) => {
      const step = lineHeight(9.6)
      doc.setFont(font, 'normal')
      doc.setFontSize(9.6)
      doc.setTextColor(PDF_INK[0], PDF_INK[1], PDF_INK[2])
      const lines = doc.splitTextToSize(String(item), contentWidth - 5)
      lines.forEach((line, index) => {
        ensure(step)
        if (index === 0) doc.text('•', margin + 0.6, y)
        doc.text(line, margin + 4.2, y)
        y += step
      })
    })
  }

  /* ── header ── */
  if (p.name) {
    doc.setFont(font, 'bold')
    doc.setFontSize(20)
    doc.setTextColor(PDF_INK[0], PDF_INK[1], PDF_INK[2])
    ensure(lineHeight(20))
    doc.text(String(p.name), pageWidth / 2, y + 5, { align: 'center' })
    y += lineHeight(20, 1.15) + 2
  }
  if (p.title) {
    write(p.title, { size: 10.2, style: 'bold', color: PDF_ACCENT, align: 'center' })
  }
  const contact = [p.email, p.phone, p.location, p.website, p.linkedin, p.github].filter(Boolean)
  if (contact.length) {
    write(contact.join('  |  '), { size: 8.8, color: PDF_MUTED, align: 'center' })
  }
  y += 1.2
  doc.setDrawColor(PDF_ACCENT[0], PDF_ACCENT[1], PDF_ACCENT[2])
  doc.setLineWidth(0.35)
  doc.line(margin, y, pageWidth - margin, y)
  y += 1

  /* ── summary ── */
  if (p.summary) {
    heading('Summary')
    write(p.summary, { size: 9.8 })
  }

  /* ── body sections, honouring the saved order ── */
  const builders = {
    experience: () => {
      const items = (d.experience || []).filter((e) => e && (e.role || e.company))
      if (!items.length) return
      heading('Experience')
      items.forEach((e, index) => {
        if (index > 0) y += 1.4
        pair(e.role || '', e.period || '', { size: 10 })
        const meta = [e.company, e.location].filter(Boolean).join(' — ')
        if (meta) write(meta, { size: 9.4, style: 'italic', color: PDF_ACCENT })
        bullets(e.bullets || [])
      })
    },
    education: () => {
      const items = (d.education || []).filter((e) => e && (e.institution || e.degree))
      if (!items.length) return
      heading('Education')
      items.forEach((e, index) => {
        if (index > 0) y += 1.2
        pair(e.institution || '', e.period || '', { size: 10 })
        const degree = [e.degree, e.field].filter(Boolean).join(', ')
        if (degree) write(degree, { size: 9.4, style: 'italic' })
        if (e.description) write(e.description, { size: 9.2, color: PDF_MUTED })
      })
    },
    projects: () => {
      const items = (d.projects || []).filter((x) => x && (x.title || x.description))
      if (!items.length) return
      heading('Projects')
      items.forEach((project, index) => {
        if (index > 0) y += 1.2
        pair(project.title || '', project.link || '', { size: 10 })
        if (project.techStack?.length) {
          write(project.techStack.join(', '), { size: 9, style: 'italic', color: PDF_MUTED })
        }
        const body = String(project.description || '').split(/\r?\n/).filter(Boolean)
        bullets(body)
      })
    },
    skills: () => {
      const items = (d.skills || []).map((skill) => skill.name).filter(Boolean)
      if (!items.length) return
      heading('Skills')
      write(items.join(', '), { size: 9.6 })
    },
    certifications: () => {
      const items = (d.certifications || []).filter((c) => c && c.name)
      if (!items.length) return
      heading('Certifications')
      items.forEach((cert) => {
        const line = [cert.name, cert.issuer, cert.year ? `(${cert.year})` : ''].filter(Boolean).join(' — ')
        bullets([line])
      })
    },
  }

  const customSections = Array.isArray(d.customSections) ? d.customSections : []
  const customById = new Map(customSections.map((section) => [section.id, section]))
  const emitted = new Set()

  const emit = (key) => {
    if (emitted.has(key) || !builders[key]) return
    emitted.add(key)
    builders[key]()
  }
  const emitCustom = (section) => {
    if (!section || emitted.has(section.id)) return
    emitted.add(section.id)
    heading(section.title || 'Additional Information')
    if (section.kind === 'paragraph') write(section.body || '', { size: 9.8 })
    else bullets(section.items || [])
  }

  const order = Array.isArray(d.sectionOrder) && d.sectionOrder.length
    ? d.sectionOrder
    : ['experience', 'education', 'projects', 'skills', 'certifications']
  order.forEach((key) => {
    if (builders[key]) emit(key)
    else if (customById.has(key)) emitCustom(customById.get(key))
  })
  Object.keys(builders).forEach(emit)
  customSections.forEach(emitCustom)

  const pageCount = doc.getNumberOfPages()
  return { doc, pageCount, bytes: doc.output('arraybuffer') }
}

/**
 * Export a canonical resume as a text-layer A4 PDF.
 *
 * @param {object} resumeData canonical resume shape
 * @param {object} options    { filename, save, ...layout options }
 * @returns {Promise<{ ok: boolean, filename: string, pageCount: number, bytes: ArrayBuffer }>}
 */
export async function exportStructuredPdf(resumeData, options = {}) {
  const { filename = 'resume.pdf', save = true, ...layout } = options
  const { doc, pageCount, bytes } = buildResumePdf(resumeData, layout)
  if (save) downloadPdfBlob(doc.output('blob'), filename)
  return { ok: true, filename, pageCount, bytes }
}

/** Save a built PDF through the same anchor/object-URL flow as the DOCX. */
export function downloadPdfBlob(blob, filename = 'resume.pdf') {
  const name = filename.endsWith('.pdf') ? filename : `${filename}.pdf`
  return downloadBlob(blob, name)
}
