import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType,
} from 'docx'

/**
 * Build a .docx file from the canonical resume shape used across the
 * ResumeContext. Produces a clean, ATS-friendly Word document with
 * selectable text layers (no rasterized content).
 *
 * Sections (in order):
 *   1. Header — name, title, contact line
 *   2. Summary
 *   3. Experience (company, role, period, bullets)
 *   4. Education
 *   5. Projects
 *   6. Skills
 *   7. Certifications
 *
 * @param {object} resumeData - canonical shape from ResumeContext
 * @returns {Promise<Blob>} - ready-to-download .docx blob
 */
export async function buildResumeDocx(resumeData) {
  const d = resumeData || {}
  const p = d.personal || {}
  const children = []

  // ─── Header ─────────────────────────────────────────────────────────────
  if (p.name) {
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: p.name, bold: true, size: 40 })],
    }))
  }
  if (p.title) {
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: p.title, italics: true, size: 26 })],
    }))
  }
  const contactParts = [p.email, p.phone, p.location, p.website, p.linkedin, p.github]
    .filter(Boolean)
  if (contactParts.length) {
    children.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      children: [new TextRun({ text: contactParts.join(' | '), size: 22 })],
    }))
  }

  // ─── Summary ────────────────────────────────────────────────────────────
  if (p.summary) {
    children.push(sectionHeading('Summary'))
    children.push(bodyParagraph(p.summary))
  }

  // ─── Experience ─────────────────────────────────────────────────────────
  if (d.experience?.length) {
    children.push(sectionHeading('Experience'))
    d.experience.forEach(e => {
      const header = new Paragraph({
        spacing: { before: 160, after: 40 },
        children: [
          new TextRun({ text: e.role || 'Role', bold: true, size: 24 }),
          ...(e.company ? [new TextRun({ text: ` — ${e.company}`, size: 24 })] : []),
        ],
      })
      children.push(header)
      const meta = [e.period, e.location].filter(Boolean).join(' | ')
      if (meta) {
        children.push(new Paragraph({
          spacing: { after: 60 },
          children: [new TextRun({ text: meta, italics: true, size: 22, color: '555555' })],
        }))
      }
      e.bullets?.forEach(b => {
        children.push(new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 40 },
          children: [new TextRun({ text: b, size: 22 })],
        }))
      })
    })
  }

  // ─── Education ──────────────────────────────────────────────────────────
  if (d.education?.length) {
    children.push(sectionHeading('Education'))
    d.education.forEach(e => {
      children.push(new Paragraph({
        spacing: { before: 120, after: 40 },
        children: [
          new TextRun({ text: e.institution || 'Institution', bold: true, size: 24 }),
          ...(e.degree ? [new TextRun({ text: ` — ${e.degree}`, size: 24 })] : []),
        ],
      }))
      const meta = [e.period, e.location].filter(Boolean).join(' | ')
      if (meta) {
        children.push(new Paragraph({
          spacing: { after: 40 },
          children: [new TextRun({ text: meta, italics: true, size: 22, color: '555555' })],
        }))
      }
      if (e.description) {
        children.push(bodyParagraph(e.description))
      }
    })
  }

  // ─── Projects ───────────────────────────────────────────────────────────
  if (d.projects?.length) {
    children.push(sectionHeading('Projects'))
    d.projects.forEach(p => {
      children.push(new Paragraph({
        spacing: { before: 120, after: 40 },
        children: [
          new TextRun({ text: p.title || 'Project', bold: true, size: 24 }),
          ...(p.link ? [new TextRun({ text: `  ·  ${p.link}`, size: 22, color: '1f6feb' })] : []),
        ],
      }))
      if (p.description) children.push(bodyParagraph(p.description))
      if (p.techStack?.length) {
        children.push(new Paragraph({
          spacing: { after: 60 },
          children: [new TextRun({ text: `Tech: ${p.techStack.join(', ')}`, italics: true, size: 22, color: '555555' })],
        }))
      }
    })
  }

  // ─── Skills ─────────────────────────────────────────────────────────────
  if (d.skills?.length) {
    children.push(sectionHeading('Skills'))
    const items = d.skills.map(s => s.name).filter(Boolean).join(', ')
    if (items) children.push(bodyParagraph(items))
  }

  // ─── Certifications ─────────────────────────────────────────────────────
  if (d.certifications?.length) {
    children.push(sectionHeading('Certifications'))
    d.certifications.forEach(c => {
      children.push(new Paragraph({
        spacing: { after: 40 },
        bullet: { level: 0 },
        children: [
          new TextRun({ text: c.name || 'Certification', bold: true, size: 22 }),
          ...(c.issuer ? [new TextRun({ text: ` — ${c.issuer}`, size: 22 })] : []),
          ...(c.year ? [new TextRun({ text: ` (${c.year})`, size: 22, color: '555555' })] : []),
        ],
      }))
    })
  }

  const doc = new Document({
    creator: 'Career Pilot',
    title: `${p.name || 'Resume'} — Career Pilot`,
    description: 'Generated with Career Pilot',
    styles: {
      default: {
        document: {
          run: { font: 'Calibri' },
        },
      },
    },
    sections: [{
      properties: { page: { margin: { top: 720, right: 720, bottom: 720, left: 720 } } },
      children,
    }],
  })

  const buffer = await Packer.toBlob(doc)
  return buffer
}

function sectionHeading(text) {
  return new Paragraph({
    spacing: { before: 280, after: 80 },
    border: { bottom: { color: '999999', size: 6, style: BorderStyle.SINGLE, space: 2 } },
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 24, color: '1f2937' })],
  })
}

function bodyParagraph(text) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text: String(text), size: 22 })],
  })
}

/**
 * Trigger a browser download for a generated .docx blob.
 */
export function downloadDocxBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.endsWith('.docx') ? filename : `${filename}.docx`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
