import { analyzeResume } from '../utils/resumeSuggestions'

// Builds a resume data object matching ResumeBuilder's state shape,
// with sensible empty defaults that individual tests override.
function makeData(overrides = {}) {
  return {
    personal: { name: '', email: '', summary: '' },
    education: [{ school: '', degree: '', field: '', startDate: '', endDate: '', gpa: '', description: '' }],
    experience: [{ title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' }],
    projects: [{ name: '', tech: '', link: '', description: '' }],
    skills: '',
    ...overrides,
  }
}

const has = (suggestions, category) => suggestions.some(s => s.category === category)
const hasId = (suggestions, id) => suggestions.some(s => s.id === id)

describe('analyzeResume', () => {
  test('flags missing sections for an empty resume', () => {
    const result = analyzeResume(makeData())
    expect(hasId(result, 'missing-summary')).toBe(true)
    expect(hasId(result, 'missing-experience')).toBe(true)
    expect(hasId(result, 'missing-education')).toBe(true)
    expect(hasId(result, 'missing-projects')).toBe(true)
    expect(hasId(result, 'missing-skills')).toBe(true)
  })

  test('detects weak statements in experience bullets', () => {
    const result = analyzeResume(makeData({
      experience: [{ title: 'Engineer', description: 'Responsible for the project delivery' }],
    }))
    expect(has(result, 'weak-statement')).toBe(true)
    const weak = result.find(s => s.category === 'weak-statement')
    expect(weak.message.toLowerCase()).toContain('responsible for')
  })

  test('recommends quantification for bullets without metrics', () => {
    const result = analyzeResume(makeData({
      experience: [{ title: 'Engineer', description: 'Built a web application for clients' }],
    }))
    expect(has(result, 'quantification')).toBe(true)
  })

  test('does not recommend quantification when bullets already have metrics', () => {
    const result = analyzeResume(makeData({
      experience: [{ title: 'Engineer', description: 'Increased revenue by 30% in 6 months' }],
    }))
    expect(has(result, 'quantification')).toBe(false)
  })

  test('recommends stronger action verbs for weak bullet openers', () => {
    const result = analyzeResume(makeData({
      experience: [{ title: 'Engineer', description: 'The site was redesigned for mobile' }],
    }))
    expect(has(result, 'action-verb')).toBe(true)
  })

  test('does not flag action verbs when bullets start with strong verbs', () => {
    const result = analyzeResume(makeData({
      experience: [{ title: 'Engineer', description: 'Developed a scalable API' }],
    }))
    expect(has(result, 'action-verb')).toBe(false)
  })

  test('suggests adding more skills when too few are listed', () => {
    const result = analyzeResume(makeData({ skills: 'JavaScript, React' }))
    expect(has(result, 'skills')).toBe(true)
  })

  test('does not suggest more skills when enough are listed', () => {
    const result = analyzeResume(makeData({
      skills: 'JavaScript, React, Node.js, TypeScript, PostgreSQL, Docker, AWS, GraphQL',
    }))
    expect(has(result, 'skills')).toBe(false)
  })

  test('returns no suggestions for a strong, complete resume', () => {
    const result = analyzeResume({
      personal: {
        name: 'Jane Doe',
        email: 'jane@example.com',
        summary:
          'Experienced software engineer with over five years building scalable web ' +
          'applications and leading cross functional teams to deliver high quality products on time.',
      },
      education: [{ school: 'MIT', degree: 'BS', field: 'Computer Science', startDate: '2015', endDate: '2019', gpa: '', description: '' }],
      experience: [{
        title: 'Senior Engineer',
        company: 'Acme',
        description:
          'Developed a microservices platform that reduced latency by 40%\n' +
          'Led a team of 5 engineers to deliver 3 major releases',
      }],
      projects: [{
        name: 'OpenLib',
        tech: 'React',
        description:
          'Built an open-source library with 200 GitHub stars\n' +
          'Improved test coverage to 95%',
      }],
      skills: 'JavaScript, React, Node.js, TypeScript, PostgreSQL, Docker, AWS, GraphQL',
    })
    expect(result).toHaveLength(0)
  })
})
