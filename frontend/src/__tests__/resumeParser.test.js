import { describe, expect, test } from 'vitest'
import {
  markdownToStructured,
  structuredToMarkdown,
  jsonResumeToStructured,
  structuredToJsonResume,
  normalizeHeaderTitle,
} from '../utils/resumeParser'

describe('resumeParser — Header normalization', () => {
  test('normalizes standard headers to canonical keys', () => {
    expect(normalizeHeaderTitle('## Professional Summary')).toBe('summary')
    expect(normalizeHeaderTitle('### Work Experience')).toBe('experience')
    expect(normalizeHeaderTitle('## Academic Background')).toBe('education')
    expect(normalizeHeaderTitle('## Key Projects')).toBe('projects')
    expect(normalizeHeaderTitle('## Technical Skills')).toBe('skills')
    expect(normalizeHeaderTitle('## Certifications & Licenses')).toBe('certifications')
  })

  test('leaves custom section titles in lowercase slug form', () => {
    expect(normalizeHeaderTitle('## Honors & Awards')).toBe('honors & awards')
    expect(normalizeHeaderTitle('## Volunteer Experience')).toBe('volunteer experience')
  })
})

describe('resumeParser — markdownToStructured & structuredToMarkdown round-trip', () => {
  const sampleMarkdown = `# Margaret Hamilton
margaret@apollo.nasa.gov | +1 617-253-1000 | Cambridge, MA | [LinkedIn](https://linkedin.com/in/mhamilton) | [GitHub](https://github.com/mhamilton)

## SUMMARY

Director of the Software Engineering Division of the MIT Instrumentation Laboratory. Pioneered asynchronous executive software that enabled Apollo 11 lunar landing.

## EXPERIENCE

### Director of Software Engineering at MIT Instrumentation Laboratory
1965 - 1976 | Cambridge, MA
- Created the asynchronous executive system for Apollo guidance computer
- Designed priority displays that prevented mission abort during lunar descent
- Coined the term 'software engineering' to establish legitimacy of the field

### Software Engineer at SAGE Project
1961 - 1965 | Lexington, MA
- Wrote software to identify enemy aircraft for North American air defense

## EDUCATION

### Earlham College - B.A. in Mathematics
1954 - 1958
GPA: 3.9
- Philosophy minor

## PROJECTS

### Apollo 11 Guidance Computer Software
[Project Link](https://github.com/chrislgarry/Apollo-11)
Tech: Assembly, AGC Architecture
- Source code for Apollo 11 Lunar Module (Eagle) and Command Module (Columbia)

## SKILLS

- **Core**: Systems Architecture, Real-Time Operating Systems, Fault Tolerance
- **Languages**: AGC Assembly, FORTRAN, Lisp

## CERTIFICATIONS

- Presidential Medal of Freedom - White House (2016)

## AWARDS

- NASA Exceptional Space Act Award (2003)
- Augusta Ada Lovelace Award (1986)
`

  test('parses markdown into structured object with all fields', () => {
    const data = markdownToStructured(sampleMarkdown)

    expect(data.personal.name).toBe('Margaret Hamilton')
    expect(data.personal.email).toBe('margaret@apollo.nasa.gov')
    expect(data.personal.phone).toBe('+1 617-253-1000')
    expect(data.personal.location).toBe('Cambridge, MA')
    expect(data.personal.linkedin).toBe('https://linkedin.com/in/mhamilton')
    expect(data.personal.github).toBe('https://github.com/mhamilton')
    expect(data.personal.summary).toContain('Director of the Software Engineering Division')

    expect(data.experience).toHaveLength(2)
    expect(data.experience[0].role).toBe('Director of Software Engineering')
    expect(data.experience[0].company).toBe('MIT Instrumentation Laboratory')
    expect(data.experience[0].bullets).toHaveLength(3)
    expect(data.experience[0].bullets[0]).toContain('asynchronous executive system')

    expect(data.education).toHaveLength(1)
    expect(data.education[0].institution).toBe('Earlham College')
    expect(data.education[0].degree).toBe('B.A.')
    expect(data.education[0].field).toBe('Mathematics')
    expect(data.education[0].gpa).toBe('3.9')

    expect(data.projects).toHaveLength(1)
    expect(data.projects[0].title).toBe('Apollo 11 Guidance Computer Software')
    expect(data.projects[0].link).toBe('https://github.com/chrislgarry/Apollo-11')
    expect(data.projects[0].techStack).toContain('Assembly')

    expect(data.skills.length).toBeGreaterThanOrEqual(4)
    expect(data.skills.some((s) => s.name === 'Systems Architecture')).toBe(true)

    expect(data.certifications).toHaveLength(1)
    expect(data.certifications[0].name).toContain('Presidential Medal of Freedom')
    expect(data.certifications[0].year).toBe('2016')

    expect(data.customSections).toHaveLength(1)
    expect(data.customSections[0].title).toBe('AWARDS')
    expect(data.customSections[0].items).toHaveLength(2)

    expect(data.sectionOrder).toEqual(
      expect.arrayContaining(['experience', 'education', 'projects', 'skills', 'certifications', 'custom-awards'])
    )
  })

  test('structuredToMarkdown produces clean ATS markdown preserving custom sections', () => {
    const data = markdownToStructured(sampleMarkdown)
    const regeneratedMd = structuredToMarkdown(data)

    expect(regeneratedMd).toContain('# Margaret Hamilton')
    expect(regeneratedMd).toContain('margaret@apollo.nasa.gov')
    expect(regeneratedMd).toContain('## SUMMARY')
    expect(regeneratedMd).toContain('## EXPERIENCE')
    expect(regeneratedMd).toContain('Director of Software Engineering at MIT Instrumentation Laboratory')
    expect(regeneratedMd).toContain('## EDUCATION')
    expect(regeneratedMd).toContain('## PROJECTS')
    expect(regeneratedMd).toContain('## SKILLS')
    expect(regeneratedMd).toContain('## CERTIFICATIONS')
    expect(regeneratedMd).toContain('## AWARDS')
  })
})

describe('resumeParser — JSON Resume compatibility', () => {
  const jsonResumeSample = {
    basics: {
      name: 'Grace Hopper',
      label: 'Rear Admiral & Computer Scientist',
      email: 'grace@navy.mil',
      phone: '+1 703-555-0199',
      url: 'https://hopper.navy.mil',
      summary: 'Pioneered compiler development and the FLOW-MATIC language.',
      profiles: [
        { network: 'LinkedIn', url: 'https://linkedin.com/in/gracehopper' },
        { network: 'GitHub', url: 'https://github.com/gracehopper' },
      ],
    },
    work: [
      {
        name: 'United States Navy',
        position: 'Rear Admiral',
        startDate: '1943-12-01',
        endDate: '1986-08-31',
        highlights: ['Co-developed UNIVAC I', 'Led COBOL development committee'],
      },
    ],
    education: [
      {
        institution: 'Yale University',
        studyType: 'Ph.D.',
        area: 'Mathematics',
        score: '4.0',
      },
    ],
    skills: [
      {
        name: 'Compilers',
        keywords: ['FLOW-MATIC', 'COBOL', 'A-0'],
      },
    ],
  }

  test('converts JSON resume to canonical structured format', () => {
    const structured = jsonResumeToStructured(jsonResumeSample)
    expect(structured.personal.name).toBe('Grace Hopper')
    expect(structured.personal.title).toBe('Rear Admiral & Computer Scientist')
    expect(structured.experience[0].company).toBe('United States Navy')
    expect(structured.education[0].institution).toBe('Yale University')
    expect(structured.skills.some((s) => s.name === 'COBOL')).toBe(true)
  })

  test('converts structured data to valid JSON Resume schema', () => {
    const structured = jsonResumeToStructured(jsonResumeSample)
    const jsonOut = structuredToJsonResume(structured)
    expect(jsonOut.basics.name).toBe('Grace Hopper')
    expect(jsonOut.work[0].position).toBe('Rear Admiral')
    expect(jsonOut.education[0].institution).toBe('Yale University')
  })
})
