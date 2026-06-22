import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

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
