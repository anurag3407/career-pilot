import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType,
} from 'docx'

/**
 * Build a .docx file from the canonical resume shape used across the
 * ResumeContext. Produces a clean, ATS-friendly Word document with
 * selectable text layers (no rasterized content).
 *
 * Section order: the header (name/title/contact) and Summary lead; the
 * remaining body sections follow the user-chosen `resumeData.sectionOrder`
 * (with `resumeData.customSections` appended), mirroring the on-screen
 * <OrderedSections/> renderer so the .docx matches the preview and PDF.
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

  // ─── Section builders (keyed by id) ───────────────────────────────────────
  // Each returns an array of Paragraphs (empty when the section has no content).
  const builders = {
    summary: () => (p.summary ? [sectionHeading('Summary'), bodyParagraph(p.summary)] : []),

    experience: () => {
      if (!d.experience?.length) return []
      const out = [sectionHeading('Experience')]
      d.experience.forEach(e => {
        out.push(new Paragraph({
          spacing: { before: 160, after: 40 },
          children: [
            new TextRun({ text: e.role || 'Role', bold: true, size: 24 }),
            ...(e.company ? [new TextRun({ text: ` — ${e.company}`, size: 24 })] : []),
          ],
        }))
        const meta = [e.period, e.location].filter(Boolean).join(' | ')
        if (meta) {
          out.push(new Paragraph({
            spacing: { after: 60 },
            children: [new TextRun({ text: meta, italics: true, size: 22, color: '555555' })],
          }))
        }
        e.bullets?.forEach(b => {
          out.push(new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 40 },
            children: [new TextRun({ text: b, size: 22 })],
          }))
        })
      })
      return out
    },

    education: () => {
      if (!d.education?.length) return []
      const out = [sectionHeading('Education')]
      d.education.forEach(e => {
        out.push(new Paragraph({
          spacing: { before: 120, after: 40 },
          children: [
            new TextRun({ text: e.institution || 'Institution', bold: true, size: 24 }),
            ...(e.degree ? [new TextRun({ text: ` — ${e.degree}`, size: 24 })] : []),
          ],
        }))
        const meta = [e.period, e.location].filter(Boolean).join(' | ')
        if (meta) {
          out.push(new Paragraph({
            spacing: { after: 40 },
            children: [new TextRun({ text: meta, italics: true, size: 22, color: '555555' })],
          }))
        }
        if (e.description) out.push(bodyParagraph(e.description))
      })
      return out
    },

    projects: () => {
      if (!d.projects?.length) return []
      const out = [sectionHeading('Projects')]
      d.projects.forEach(proj => {
        out.push(new Paragraph({
          spacing: { before: 120, after: 40 },
          children: [
            new TextRun({ text: proj.title || 'Project', bold: true, size: 24 }),
            ...(proj.link ? [new TextRun({ text: `  ·  ${proj.link}`, size: 22, color: '1f6feb' })] : []),
          ],
        }))
        if (proj.description) out.push(bodyParagraph(proj.description))
        if (proj.techStack?.length) {
          out.push(new Paragraph({
            spacing: { after: 60 },
            children: [new TextRun({ text: `Tech: ${proj.techStack.join(', ')}`, italics: true, size: 22, color: '555555' })],
          }))
        }
      })
      return out
    },

    skills: () => {
      if (!d.skills?.length) return []
      const items = d.skills.map(s => s.name).filter(Boolean).join(', ')
      return items ? [sectionHeading('Skills'), bodyParagraph(items)] : []
    },

    certifications: () => {
      if (!d.certifications?.length) return []
      const out = [sectionHeading('Certifications')]
      d.certifications.forEach(c => {
        out.push(new Paragraph({
          spacing: { after: 40 },
          bullet: { level: 0 },
          children: [
            new TextRun({ text: c.name || 'Certification', bold: true, size: 22 }),
            ...(c.issuer ? [new TextRun({ text: ` — ${c.issuer}`, size: 22 })] : []),
            ...(c.year ? [new TextRun({ text: ` (${c.year})`, size: 22, color: '555555' })] : []),
          ],
        }))
      })
      return out
    },
  }

  // ─── Emit sections in the user-chosen order (mirrors <OrderedSections/>) ───
  const KNOWN_ORDER = ['education', 'experience', 'projects', 'skills', 'certifications']
  const sectionOrder = Array.isArray(d.sectionOrder) ? d.sectionOrder : []
  const customSections = Array.isArray(d.customSections) ? d.customSections : []
  const customById = new Map(customSections.map(s => [s.id, s]))
  const emitted = new Set()

  const emit = (key) => {
    if (key === 'summary' || emitted.has(key) || !builders[key]) return
    emitted.add(key)
    children.push(...builders[key]())
  }
  const emitCustom = (section) => {
    if (!section || emitted.has(section.id)) return
    emitted.add(section.id)
    children.push(...buildCustomSection(section))
  }

  children.push(...builders.summary())                       // 1. summary fixed lead
  emitted.add('summary')
  for (const key of sectionOrder) {                          // 2. user-chosen order
    if (builders[key]) emit(key)
    else if (customById.has(key)) emitCustom(customById.get(key))
  }
  for (const key of KNOWN_ORDER) emit(key)                   // 3. remaining known sections
  for (const section of customSections) emitCustom(section)  // 4. remaining custom sections

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
    children: [new TextRun({ text: String(text).toUpperCase(), bold: true, size: 24, color: '1f2937' })],
  })
}

function bodyParagraph(text) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text: String(text), size: 22 })],
  })
}

// Build a user-defined custom section. Returns [] when it has no content so an
// empty heading is never emitted. Mirrors CustomSectionBlock kinds.
function buildCustomSection(section) {
  if (!section) return []
  const { title, kind, items = [], body } = section
  const out = [sectionHeading(title || 'Section')]

  if (kind === 'paragraph') {
    if (body) out.push(bodyParagraph(body))
  } else if (kind === 'quotes') {
    items.forEach(q => out.push(new Paragraph({
      spacing: { after: 60 },
      children: [new TextRun({ text: `“${q}”`, italics: true, size: 22 })],
    })))
  } else if (kind === 'books') {
    items.forEach(b => out.push(new Paragraph({
      spacing: { after: 40 },
      children: [new TextRun({ text: b, italics: true, size: 22 })],
    })))
  } else {
    // 'list' (default)
    items.forEach(it => out.push(new Paragraph({
      bullet: { level: 0 },
      spacing: { after: 40 },
      children: [new TextRun({ text: it, size: 22 })],
    })))
  }

  return out.length > 1 ? out : []
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
