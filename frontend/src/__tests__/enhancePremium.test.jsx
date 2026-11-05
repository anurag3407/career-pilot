import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { buildSectionItems } from '../pages/Enhance'
import StructuredResumeEditor from '../components/resume/StructuredResumeEditor'

// Mock api
vi.mock('../services/api', () => ({
  resumeApi: {
    update: vi.fn().mockResolvedValue({ success: true, data: {} }),
    reorderSections: vi.fn().mockResolvedValue({ success: true }),
  },
}))

describe('Enhance — buildSectionItems content filtering (M1.6)', () => {
  it('hides sections that have no content (e.g. no certifications, no projects)', () => {
    const resume = {
      originalText: `
# Jane Doe
Software Engineer

## SUMMARY
Experienced engineer with 5 years in distributed systems.

## EXPERIENCE
### Senior Engineer
Acme Corp | 2020 - Present
- Built high-throughput microservices.

## EDUCATION
### B.S. Computer Science
MIT | 2016 - 2020

## SKILLS
- JavaScript, Python, Go, Docker
      `.trim(),
    }

    const items = buildSectionItems(resume)
    const ids = items.map((i) => i.id)

    expect(ids).toContain('experience')
    expect(ids).toContain('education')
    expect(ids).toContain('skills')
    // Certifications and Projects were not in the resume text, so they must be hidden
    expect(ids).not.toContain('certifications')
    expect(ids).not.toContain('projects')
  })

  it('includes certifications when certifications exist in resume', () => {
    const resume = {
      structuredData: {
        personal: { name: 'Alice Smith' },
        experience: [{ role: 'Developer', company: 'Tech', bullets: ['Built apps'] }],
        education: [{ degree: 'B.S.', school: 'Stanford' }],
        skills: ['React', 'Node'],
        certifications: [{ name: 'AWS Solutions Architect', issuer: 'Amazon', year: '2023' }],
      },
    }

    const items = buildSectionItems(resume)
    const ids = items.map((i) => i.id)

    expect(ids).toContain('experience')
    expect(ids).toContain('education')
    expect(ids).toContain('skills')
    expect(ids).toContain('certifications')
    expect(ids).not.toContain('projects')
  })

  it('includes custom sections when they contain content', () => {
    const resume = {
      structuredData: {
        personal: { name: 'Bob' },
        experience: [{ role: 'Engineer', company: 'Labs', bullets: ['Wrote code'] }],
        education: [{ degree: 'B.A.', school: 'Harvard' }],
        skills: ['Rust'],
        customSections: [
          { id: 'custom-patents', title: 'Patents', content: 'US Patent 123456' },
          { id: 'custom-empty', title: 'Empty Section', content: '' },
        ],
      },
    }

    const items = buildSectionItems(resume)
    const ids = items.map((i) => i.id)

    expect(ids).toContain('custom-patents')
    expect(ids).not.toContain('custom-empty')
  })
})

describe('StructuredResumeEditor in Enhance (M2.2)', () => {
  it('mounts and renders section accordions and ATS badge', () => {
    const sampleResume = {
      id: 'res-123',
      title: 'Dev Resume',
      jobRole: 'Frontend Developer',
      structuredData: {
        personal: { name: 'Charlie Day', title: 'Lead Architect', summary: 'Passionate builder' },
        experience: [
          {
            role: 'Lead Architect',
            company: 'Paddy Inc',
            startDate: '2021',
            endDate: 'Present',
            bullets: ['Spearheaded web architecture, increasing throughput by 40%.'],
          },
        ],
        education: [{ degree: 'B.S.', school: 'Temple University', year: '2015' }],
        skills: ['React', 'TypeScript', 'Next.js'],
        certifications: [],
        customSections: [],
      },
    }

    render(
      <MemoryRouter>
        <StructuredResumeEditor resume={sampleResume} onSaveSuccess={vi.fn()} />
      </MemoryRouter>
    )

    // Check heading / ATS Score
    expect(screen.getByText(/Live ATS:/i)).toBeInTheDocument()
    expect(screen.getByText(/Personal Info & Summary/i)).toBeInTheDocument()
    expect(screen.getByDisplayValue('Charlie Day')).toBeInTheDocument()
    expect(screen.getAllByDisplayValue('Lead Architect').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByDisplayValue(/Spearheaded web architecture/i)).toBeInTheDocument()
  })

  it('triggers onSaveSuccess when save button is clicked', async () => {
    const onSave = vi.fn()
    const sampleResume = {
      id: 'res-456',
      title: 'Engineer Resume',
      originalText: `
# Dennis Reynolds
Systems Architect

## SUMMARY
The golden god of systems architecture.

## EXPERIENCE
### Systems Lead
Reeves Corp | 2019 - Present
- Scaled high-availability clusters.
      `.trim(),
    }

    render(
      <MemoryRouter>
        <StructuredResumeEditor resume={sampleResume} onSaveSuccess={onSave} />
      </MemoryRouter>
    )

    const saveBtn = screen.getByRole('button', { name: /Save Changes/i })
    expect(saveBtn).toBeInTheDocument()

    fireEvent.click(saveBtn)

    await waitFor(() => {
      expect(onSave).toHaveBeenCalled()
    })
  })
})
