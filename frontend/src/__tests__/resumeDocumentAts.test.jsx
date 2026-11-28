import { describe, expect, it } from 'vitest'
import { normalizeResumeData, RESUME_DOCUMENT_VERSION } from '../context/ResumeContext'
import { resumeDocumentToHtml } from '../utils/resumeHtml'
import { checkAtsReadability, isAtsSafe } from '../utils/atsReadability'

const SAMPLE = {
  template: 'IvyLeague',
  templateOptions: { accentColorId: 'slate', fontFamilyId: 'serif' },
  sectionOrder: ['experience', 'education', 'projects', 'skills', 'certifications'],
  personal: {
    name: 'Ada Lovelace',
    title: 'Staff Software Engineer',
    email: 'ada@example.com',
    phone: '+1 555 123 4567',
    location: 'London, UK',
    linkedin: 'https://www.linkedin.com/in/ada',
    github: 'https://github.com/ada',
    summary: 'Engineer with a decade of experience building reliable distributed systems.',
  },
  experience: [
    {
      role: 'Staff Engineer',
      company: 'Analytical Engines',
      period: '2020 - Present',
      location: 'London',
      bullets: ['Led a team of 8 engineers.', 'Cut p95 latency by 42%.'],
    },
  ],
  education: [
    { degree: 'BSc Computer Science', institution: 'Cambridge', period: '2012 - 2015' },
  ],
  projects: [{ title: 'Difference Engine', techStack: ['TypeScript', 'Rust'], description: 'A compute engine.' }],
  skills: [
    { name: 'TypeScript', category: 'Languages' },
    { name: 'Rust', category: 'Languages' },
  ],
  certifications: [{ name: 'AWS Solutions Architect', issuer: 'Amazon', year: '2024' }],
  customSections: [],
}

describe('canonical resume document', () => {
  it('preserves schema version and editor presentation choices', () => {
    const doc = normalizeResumeData(SAMPLE)
    expect(doc.schemaVersion).toBe(RESUME_DOCUMENT_VERSION)
    expect(doc.template).toBe('IvyLeague')
    expect(doc.templateOptions).toEqual({ accentColorId: 'slate', fontFamilyId: 'serif' })
    expect(doc.sectionOrder).toEqual(['experience', 'education', 'projects', 'skills', 'certifications'])
  })

  it('serializes semantic, single-column HTML with real contact text', () => {
    const html = resumeDocumentToHtml(normalizeResumeData(SAMPLE))
    expect(html).toContain('<html lang="en">')
    expect(html).toContain('<h1>Ada Lovelace</h1>')
    expect(html).toContain('<h2>Experience</h2>')
    expect(html).toContain('mailto:ada@example.com')
    expect(html).toContain('tel:+15551234567')
    expect(html).not.toContain('<table')
    expect(html).not.toContain('grid-template-columns')
  })

  it('passes the JSON Resume ATS validator on a complete resume', async () => {
    const report = await checkAtsReadability(normalizeResumeData(SAMPLE))
    expect(report.score).toBeGreaterThanOrEqual(80)
    expect(report.grade).toMatch(/^[AB]$/)
    expect(report.issues.filter((issue) => issue.severity === 'error')).toEqual([])
    expect(isAtsSafe(report)).toBe(true)
  })

  it('surfaces missing contact details as actionable issues', async () => {
    const report = await checkAtsReadability(
      normalizeResumeData({
        personal: { name: 'No Contact' },
        experience: [{ role: 'Engineer', company: 'Acme', bullets: ['Built things.'] }],
      }),
    )
    expect(report.score).toBeLessThan(100)
    expect(report.issues.some((issue) => /email/i.test(issue.message))).toBe(true)
  })
})
