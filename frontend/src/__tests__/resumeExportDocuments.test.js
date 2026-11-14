import { describe, test, expect } from 'vitest'
import JSZip from 'jszip'
import { buildResumeDocx } from '../utils/docxExport'
import { buildResumePdf, exportStructuredPdf } from '../services/atsPdfExport'
import { formatPeriod } from '../utils/resumeDateFormat'

/**
 * Real document output, no DOM and no mocks.
 *
 * The PDF path deliberately does not go through html2canvas: a resume PDF must
 * carry a real text layer (ATS parsers cannot read pixels), and a text-based
 * layout is also the only variant we can assert on honestly.
 */

const LONG_BULLET =
  'Cut p99 latency from 820ms to 210ms by replacing the synchronous index rebuild with an incremental pipeline, which unblocked the analytics launch.'

const ROLES = [
  ['Principal Engineer', 'Analytical Engine Ltd', 'Mar 2020 – Present'],
  ['Senior Engineer', 'Difference Machines', 'Jan 2017 – Feb 2020'],
  ['Software Engineer', 'Babbage & Co', 'Jun 2014 – Dec 2016'],
  ['Junior Engineer', 'Punch Card Systems', 'Jul 2012 – May 2014'],
]

const MODEL = {
  personal: {
    name: 'Ada Lovelace',
    title: 'Principal Engineer',
    email: 'ada@analytical.org',
    phone: '+44 20 7946 0958',
    location: 'London, UK',
    website: 'ada.dev',
    linkedin: 'linkedin.com/in/ada',
    github: 'github.com/ada',
    summary: 'Computing pioneer who shipped the first published algorithm and led cross-functional programs for a decade.',
  },
  experience: ROLES.map(([role, company, period], roleIndex) => ({
    role,
    company,
    location: 'London',
    period,
    bullets: Array.from({ length: 8 }, (_, bulletIndex) => `Bullet ${roleIndex + 1}-${bulletIndex + 1}: ${LONG_BULLET}`),
  })),
  education: [{
    institution: 'University of London',
    degree: 'BSc, Mathematics',
    period: 'Sep 2008 – Jun 2011',
    location: 'London',
    description: 'First Class Honours',
  }],
  projects: [{
    title: 'Note G',
    link: 'github.com/ada/note-g',
    description: 'Built the first published algorithm for computing Bernoulli numbers.\nDocumented the method in seven detailed notes.',
    techStack: ['Analytical Engine', 'Mathematics'],
  }],
  skills: [{ name: 'Mathematics' }, { name: 'Algorithms' }, { name: 'Technical Writing' }],
  certifications: [{ name: 'Chartered Engineer', issuer: 'IET', year: '2021' }],
  sectionOrder: ['experience', 'education', 'projects', 'skills', 'certifications', 'custom-honors'],
  customSections: [{
    id: 'custom-honors',
    title: 'Honors',
    kind: 'list',
    items: ['Royal Society Fellow (2022)', 'Ada Award for Computing (2019)'],
    body: '',
  }],
}

async function blobToArrayBuffer(blob) {
  if (typeof blob.arrayBuffer === 'function') return blob.arrayBuffer()
  return new Response(blob).arrayBuffer()
}

/** DOCX stores XML text, so `&` arrives as `&amp;`. Decode before asserting. */
function unescapeXml(value) {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
}

describe('DOCX export', () => {
  test('is a well-formed archive whose document XML contains the whole resume', async () => {
    const blob = await buildResumeDocx(MODEL)
    expect(blob.size).toBeGreaterThan(1000)

    const zip = await JSZip.loadAsync(await blobToArrayBuffer(blob))
    expect(Object.keys(zip.files)).toEqual(expect.arrayContaining(['[Content_Types].xml', 'word/document.xml']))

    const xml = await zip.file('word/document.xml').async('string')
    const text = unescapeXml(xml.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ')

    // identity, contact and every section heading
    expect(text).toContain('Ada Lovelace')
    expect(text).toContain('Principal Engineer')
    expect(text).toContain('ada@analytical.org')
    expect(text).toContain('+44 20 7946 0958')
    expect(text).toContain('SUMMARY')
    expect(text).toContain('EXPERIENCE')
    expect(text).toContain('EDUCATION')
    expect(text).toContain('PROJECTS')
    expect(text).toContain('SKILLS')
    expect(text).toContain('CERTIFICATIONS')
    expect(text).toContain('HONORS')

    // every role, every bullet, every detail
    ROLES.forEach(([role, company]) => {
      expect(text).toContain(role)
      expect(text).toContain(company)
    })
    ROLES.forEach((_, roleIndex) => {
      for (let bulletIndex = 0; bulletIndex < 8; bulletIndex += 1) {
        expect(text).toContain(`Bullet ${roleIndex + 1}-${bulletIndex + 1}:`)
      }
    })
    expect(text).toContain('University of London')
    expect(text).toContain('BSc, Mathematics')
    expect(text).toContain('Note G')
    expect(text).toContain('Mathematics, Algorithms, Technical Writing')
    expect(text).toContain('Chartered Engineer')
    expect(text).toContain('Royal Society Fellow (2022)')

    // dates are human, never raw ISO months
    expect(text).toContain('Mar 2020 – Present')
    expect(text).toContain('Jan 2017 – Feb 2020')
    expect(text).not.toMatch(/20\d\d-\d\d/)
  })
})

describe('PDF export', () => {
  test('is a valid multi-page PDF with a real text layer', () => {
    const { pageCount, bytes } = buildResumePdf(MODEL)
    const buffer = Buffer.from(bytes)
    const raw = buffer.toString('latin1')

    expect(buffer.subarray(0, 5).toString('latin1')).toBe('%PDF-')
    expect(raw).toContain('%%EOF')
    expect(pageCount).toBeGreaterThanOrEqual(2)

    // one /Type /Page object per page, plus the /Pages tree
    const pageObjects = (raw.match(/\/Type\s*\/Page[^s]/g) || []).length
    expect(pageObjects).toBe(pageCount)

    // actual resume text is present in the (uncompressed) content streams
    expect(raw).toContain('Ada Lovelace')
    expect(raw).toContain('Principal Engineer')
    expect(raw).toContain('ada@analytical.org')
    expect(raw).toContain('SUMMARY')
    expect(raw).toContain('EXPERIENCE')
    expect(raw).toContain('EDUCATION')
    expect(raw).toContain('PROJECTS')
    expect(raw).toContain('SKILLS')
    expect(raw).toContain('CERTIFICATIONS')
    expect(raw).toContain('HONORS')
    expect(raw).toContain('Bullet 1-1:')
    expect(raw).toContain('Bullet 4-8:')
    expect(raw).toContain('Note G')
    expect(raw).toContain('Chartered Engineer')

    // A4, portrait, in points (jsPDF emits full float precision)
    expect(raw).toMatch(/\/MediaBox \[0 0 595\.27\d+ 841\.88\d+\]/)

    // dates render in the recruiter-facing style, not ISO
    expect(raw).toContain('Mar 2020')
    expect(raw).toContain('Present')
    expect(raw).toContain('Jan 2017')
    expect(raw).not.toContain('2020-03')
    expect(raw).not.toContain('2017-01')
  })

  test('exports through the public entry point without writing a file', async () => {
    const result = await exportStructuredPdf(MODEL, { save: false })
    expect(result.ok).toBe(true)
    expect(result.pageCount).toBeGreaterThanOrEqual(2)
    expect(Buffer.from(result.bytes).subarray(0, 5).toString('latin1')).toBe('%PDF-')
    expect(result.filename).toBe('resume.pdf')
  })

  test('a minimal resume still produces a valid one-page PDF', async () => {
    const minimal = { personal: { name: 'Grace Hopper', email: 'grace@navy.mil' } }
    const { pageCount, bytes } = buildResumePdf(minimal)
    expect(pageCount).toBe(1)
    expect(Buffer.from(bytes).subarray(0, 5).toString('latin1')).toBe('%PDF-')
  })
})

describe('date formatting', () => {
  test('ISO month values are rendered as "Mon YYYY" and "Present"', () => {
    expect(formatPeriod('2024-01', '', true)).toBe('Jan 2024 – Present')
    expect(formatPeriod('2020-03', '2023-07', false)).toBe('Mar 2020 – Jul 2023')
    expect(formatPeriod('2019', '', false)).toBe('2019')
    expect(formatPeriod('', '', false)).toBe('')
  })
})
