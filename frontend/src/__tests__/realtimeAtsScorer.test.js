import { describe, expect, test } from 'vitest'
import {
  calculateRealtimeAtsScore,
  analyzeBullet,
  ACTION_VERBS,
  WEAK_PHRASES,
} from '../utils/realtimeAtsScorer'

describe('realtimeAtsScorer — analyzeBullet', () => {
  test('identifies strong action verbs and metrics', () => {
    const res = analyzeBullet('Engineered high-throughput streaming pipeline that reduced latency by 45%.')
    expect(res.hasActionVerb).toBe(true)
    expect(res.hasMetric).toBe(true)
    expect(res.weakPhrases).toHaveLength(0)
    expect(res.score).toBeGreaterThanOrEqual(90)
  })

  test('penalizes weak phrases and lacks of metrics', () => {
    const res = analyzeBullet('Responsible for assisting in weekly meetings and helping with bugs.')
    expect(res.weakPhrases).toContain('responsible for')
    expect(res.hasMetric).toBe(false)
    expect(res.score).toBeLessThan(60)
  })
})

describe('realtimeAtsScorer — calculateRealtimeAtsScore', () => {
  test('returns high score for complete structured resume', () => {
    const resumeData = {
      personal: {
        name: 'Grace Hopper',
        email: 'grace@navy.mil',
        phone: '+1 555-0100',
        location: 'Arlington, VA',
        linkedin: 'https://linkedin.com/in/gracehopper',
        summary: 'Pioneered compiler development and modern programming language design with over 20 years of military leadership.',
      },
      experience: [
        {
          role: 'Rear Admiral',
          company: 'US Navy',
          bullets: [
            'Spearheaded development of the COBOL language adopted across 90% of global finance systems.',
            'Architected the A-0 compiler reducing system programming cycles by 60%.',
          ],
        },
      ],
      education: [{ institution: 'Yale University', degree: 'Ph.D. in Mathematics' }],
      skills: Array.from({ length: 12 }, (_, i) => ({ name: `Skill ${i}` })),
    }

    const report = calculateRealtimeAtsScore(resumeData)
    expect(report.overallScore).toBeGreaterThanOrEqual(85)
    expect(report.grade).toBe('Excellent')
    expect(report.stats.bulletsWithVerbs).toBe(2)
    expect(report.stats.bulletsWithMetrics).toBe(2)
  })

  test('flags missing information with targeted tips', () => {
    const incomplete = {
      personal: { name: 'New Grad' },
      experience: [],
      skills: [],
    }

    const report = calculateRealtimeAtsScore(incomplete)
    expect(report.overallScore).toBeLessThan(50)
    expect(report.tips.some((t) => t.section === 'personal')).toBe(true)
    expect(report.tips.some((t) => t.section === 'experience')).toBe(true)
  })
})
