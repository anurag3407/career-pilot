import { describe, expect, test } from 'vitest'
import { render } from '@testing-library/react'
import { ResumeProvider, normalizeResumeData } from '../context/ResumeContext'
import IvyLeague from '../components/resume/templates/IvyLeague'
import { buildResumeDocx } from '../utils/docxExport'

// ── normalizeResumeData carries the new fields ────────────────────────────────
describe('normalizeResumeData — sectionOrder & customSections', () => {
  test('passes through and de-dupes sectionOrder', () => {
    const out = normalizeResumeData({
      sectionOrder: ['experience', 'education', 'experience', '', null, 'skills'],
    })
    expect(out.sectionOrder).toEqual(['experience', 'education', 'skills'])
  })

  test('defaults sectionOrder/customSections to [] when absent', () => {
    const out = normalizeResumeData({})
    expect(out.sectionOrder).toEqual([])
    expect(out.customSections).toEqual([])
  })

  test('normalizes, filters empty, and sorts customSections by order', () => {
    const out = normalizeResumeData({
      customSections: [
        { id: 'b', title: 'Awards', kind: 'list', items: ['X'], order: 2 },
        { id: 'empty', title: '', items: [], body: '', order: 0 },
        { id: 'a', title: 'Languages', kind: 'paragraph', body: 'English', order: 1 },
        { title: 'NoId', items: ['Y'] },
      ],
    })
    // 'empty' dropped (no content). Sorted by order: Languages(1), Awards(2),
    // then 'NoId' which has no order and backfills to its index (3).
    expect(out.customSections.map((s) => s.title)).toEqual(['Languages', 'Awards', 'NoId'])
    expect(out.customSections[0].kind).toBe('paragraph')
    expect(out.customSections[1].items).toEqual(['X'])
    expect(out.customSections[2].id).toBe('custom-3') // missing id backfilled from index
  })
})

// ── IvyLeague honors sectionOrder in the rendered DOM ─────────────────────────
const SAMPLE = {
  personal: { name: 'Ada Lovelace', summary: 'Pioneering programmer.' },
  experience: [{ role: 'Engineer', company: 'Analytical Co', bullets: ['Built engines'] }],
  education: [{ degree: 'BSc', institution: 'Cambridge' }],
  projects: [{ title: 'Engine', description: 'A machine' }],
  skills: [{ name: 'Math' }],
  certifications: [{ name: 'Cert', issuer: 'Org' }],
  customSections: [{ id: 'lang', title: 'Languages', kind: 'list', items: ['French'], order: 0 }],
}

function renderedHeadings(data) {
  const { container } = render(
    <ResumeProvider value={data}>
      <IvyLeague />
    </ResumeProvider>
  )
  return Array.from(container.querySelectorAll('h2')).map((h) => h.textContent)
}

describe('IvyLeague — drag-and-drop section order', () => {
  test('default order renders standard sequence, summary first, custom last', () => {
    const headings = renderedHeadings(SAMPLE)
    expect(headings).toEqual([
      'Summary',
      'Education',
      'Experience',
      'Projects',
      'Skills & Interests',
      'Certifications',
      'Languages',
    ])
  })

  test('reordering sectionOrder reorders the rendered sections', () => {
    const headings = renderedHeadings({
      ...SAMPLE,
      sectionOrder: ['skills', 'experience', 'education', 'projects'],
    })
    // Summary stays a fixed lead; chosen order applies; certifications + custom append.
    expect(headings).toEqual([
      'Summary',
      'Skills & Interests',
      'Experience',
      'Education',
      'Projects',
      'Certifications',
      'Languages',
    ])
  })

  test('a custom-section id inside sectionOrder is placed at that position', () => {
    const headings = renderedHeadings({
      ...SAMPLE,
      sectionOrder: ['lang', 'experience'],
    })
    expect(headings[0]).toBe('Summary')
    expect(headings[1]).toBe('Languages')
    expect(headings[2]).toBe('Experience')
  })
})

// ── DOCX export runs through the ordered/custom path without throwing ─────────
describe('buildResumeDocx — ordered export', () => {
  test('produces a non-empty .docx blob for a reordered resume with custom sections', async () => {
    const data = normalizeResumeData({ ...SAMPLE, sectionOrder: ['skills', 'experience'] })
    const blob = await buildResumeDocx(data)
    expect(blob).toBeInstanceOf(Blob)
    expect(blob.size).toBeGreaterThan(0)
  })
})
