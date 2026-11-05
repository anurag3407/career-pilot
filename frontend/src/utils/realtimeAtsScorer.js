/**
 * realtimeAtsScorer.js
 * Instant client-side ATS & Content Strength Analyzer for live editing.
 * Evaluates action verbs, quantified metrics, section completeness, and role relevance.
 */

// Strong action verbs categorized by impact
export const ACTION_VERBS = new Set([
  'accelerated', 'achieved', 'administered', 'advanced', 'analyzed', 'architected',
  'automated', 'boosted', 'built', 'championed', 'coached', 'collaborated',
  'compiled', 'constructed', 'converted', 'coordinated', 'created', 'decreased',
  'delivered', 'deployed', 'designed', 'developed', 'devised', 'directed',
  'doubled', 'eliminated', 'engineered', 'enhanced', 'established', 'evaluated',
  'executed', 'expanded', 'expedited', 'formulated', 'generated', 'guided',
  'implemented', 'improved', 'increased', 'initiated', 'innovated', 'inspected',
  'instituted', 'integrated', 'invented', 'launched', 'led', 'leveraged',
  'maximized', 'mentored', 'minimized', 'modernized', 'negotiated', 'operated',
  'optimized', 'orchestrated', 'overhauled', 'oversaw', 'pioneered', 'planned',
  'produced', 'programmed', 'projected', 'published', 'rebuilt', 'redesigned',
  'reduced', 'refined', 'reorganized', 'resolved', 'restructured', 'revamped',
  'scaled', 'secured', 'simplified', 'spearheaded', 'standardized', 'streamlined',
  'strengthened', 'structured', 'surpassed', 'systematized', 'trained', 'transformed',
  'unified', 'upgraded', 'validated', 'yielded'
])

// Weak passive or cliché phrases to avoid
export const WEAK_PHRASES = [
  'responsible for', 'duties included', 'helped with', 'worked on', 'assisted in',
  'participated in', 'tasked with', 'handled', 'hard worker', 'team player',
  'go-getter', 'detail-oriented', 'think outside the box', 'synergy'
]

// Metric and quantification patterns
const METRIC_PATTERNS = [
  /\b\d+%\b/,                          // 25%, 100%
  /\$\s*\d+[\d,.]*(?:[kKmMbB]|(?:\s*(?:thousand|million|billion)))?/, // $50K, $1.2M, $500
  /\b\d+[\d,.]*\s*(?:k|m|b|thousand|million|billion)\b/i,           // 10M, 50k
  /\b(?:\d+x|x\d+)\b/i,                // 3x, 10x
  /\b(?:increased|decreased|reduced|saved|grew|boosted)\s+by\s+\d+/i, // reduced by 40
  /\b(?:under|within)\s+\d+\s+(?:days|weeks|months|hours|minutes)\b/i, // within 2 weeks
  /\b\d+\+\s+(?:users|clients|customers|teams|engineers|projects)\b/i, // 50+ users
  /\b\d{2,}(?:,\d{3})*\b/,              // raw numbers >= 10 (e.g. 100, 2,500)
]

/**
 * Analyzes a single bullet point for action verbs, metrics, and weak words.
 */
export function analyzeBullet(text = '') {
  if (!text || typeof text !== 'string') {
    return { hasActionVerb: false, hasMetric: false, weakPhrases: [], score: 0 }
  }

  const lower = text.toLowerCase()
  const words = lower.split(/[^a-z0-9'-]+/).filter(Boolean)
  const firstWord = words[0] || ''

  const hasActionVerb = ACTION_VERBS.has(firstWord) || words.some((w) => ACTION_VERBS.has(w))
  const hasMetric = METRIC_PATTERNS.some((pat) => pat.test(text))
  const foundWeakPhrases = WEAK_PHRASES.filter((p) => lower.includes(p))

  let score = 50
  if (hasActionVerb) score += 25
  if (hasMetric) score += 35
  if (foundWeakPhrases.length > 0) score -= 20 * foundWeakPhrases.length
  if (words.length < 5) score -= 20 // Too brief
  if (words.length > 35) score -= 10 // Run-on

  return {
    hasActionVerb,
    hasMetric,
    weakPhrases: foundWeakPhrases,
    wordCount: words.length,
    score: Math.max(10, Math.min(100, score)),
  }
}

/**
 * Comprehensive real-time analysis of entire resume structured data.
 * @param {object} resumeData
 * @param {string} [targetRole]
 * @returns {object} Overall score, breakdown, suggestions
 */
export function calculateRealtimeAtsScore(resumeData = {}, targetRole = '') {
  const p = resumeData.personal || {}
  const exp = resumeData.experience || []
  const edu = resumeData.education || []
  const proj = resumeData.projects || []
  const skills = resumeData.skills || []
  const certs = resumeData.certifications || []
  const custom = resumeData.customSections || []

  const tips = []
  const sectionScores = {}

  // 1. Personal Info Score (Weight: 15%)
  let personalScore = 0
  if (p.name?.trim()) personalScore += 25
  if (p.email?.trim() && p.email.includes('@')) personalScore += 25
  if (p.phone?.trim()) personalScore += 20
  if (p.location?.trim()) personalScore += 15
  if (p.linkedin?.trim() || p.github?.trim() || p.website?.trim()) personalScore += 15

  if (!p.email) tips.push({ section: 'personal', type: 'error', text: 'Add an email address for recruiters to reach you' })
  if (!p.phone) tips.push({ section: 'personal', type: 'warning', text: 'Add a contact phone number' })
  if (!p.linkedin) tips.push({ section: 'personal', type: 'info', text: 'Link your LinkedIn profile for 40% higher response rates' })
  sectionScores.personal = Math.min(100, personalScore)

  // 2. Summary Score (Weight: 15%)
  let summaryScore = 0
  const summaryText = (p.summary || '').trim()
  const summaryWords = summaryText.split(/\s+/).filter(Boolean).length

  if (summaryWords >= 25 && summaryWords <= 90) {
    summaryScore = 95
  } else if (summaryWords > 90) {
    summaryScore = 75
    tips.push({ section: 'summary', type: 'warning', text: 'Summary is a bit lengthy. Keep it under 80 words for quick scanning.' })
  } else if (summaryWords > 10) {
    summaryScore = 65
    tips.push({ section: 'summary', type: 'info', text: 'Expand summary with your top 2-3 achievements and target role keywords.' })
  } else if (summaryWords === 0) {
    summaryScore = 20
    tips.push({ section: 'summary', type: 'warning', text: 'A strong 3-sentence summary helps recruiter ATS bots index your profile.' })
  }
  sectionScores.summary = summaryScore

  // 3. Experience Score (Weight: 35%)
  let expScore = 0
  let totalBullets = 0
  let bulletsWithVerbs = 0
  let bulletsWithMetrics = 0

  if (exp.length === 0) {
    expScore = 30
    tips.push({ section: 'experience', type: 'error', text: 'Add your work experience or leadership roles.' })
  } else {
    expScore = 40 // base for having entries
    exp.forEach((job) => {
      const bullets = job.bullets || []
      totalBullets += bullets.length
      bullets.forEach((b) => {
        const res = analyzeBullet(b)
        if (res.hasActionVerb) bulletsWithVerbs++
        if (res.hasMetric) bulletsWithMetrics++
        if (res.weakPhrases.length > 0) {
          tips.push({
            section: 'experience',
            type: 'warning',
            text: `Replace passive phrase "${res.weakPhrases[0]}" in "${job.role || 'role'}" with an active verb.`
          })
        }
      })
    })

    if (totalBullets > 0) {
      const verbRatio = bulletsWithVerbs / totalBullets
      const metricRatio = bulletsWithMetrics / totalBullets

      expScore += Math.round(verbRatio * 30)
      expScore += Math.round(metricRatio * 30)

      if (metricRatio < 0.3) {
        tips.push({
          section: 'experience',
          type: 'warning',
          text: 'Quantify your impact! Aim for at least 40% of bullets to have numbers, $, or % metrics.'
        })
      }
      if (verbRatio < 0.6) {
        tips.push({
          section: 'experience',
          type: 'info',
          text: 'Start each bullet with a punchy past-tense action verb (e.g. Engineered, Accelerated).'
        })
      }
    }
  }
  sectionScores.experience = Math.min(100, expScore)

  // 4. Skills Score (Weight: 20%)
  let skillsScore = 0
  const skillCount = skills.length
  if (skillCount >= 10 && skillCount <= 25) {
    skillsScore = 95
  } else if (skillCount >= 5) {
    skillsScore = 75
    tips.push({ section: 'skills', type: 'info', text: 'Add 3-5 more industry-specific technical or functional skills.' })
  } else if (skillCount > 0) {
    skillsScore = 40
    tips.push({ section: 'skills', type: 'warning', text: 'List at least 8 key skills matching your target job descriptions.' })
  } else {
    skillsScore = 15
    tips.push({ section: 'skills', type: 'error', text: 'Add a skills section so ATS scanners can match job requirements.' })
  }
  sectionScores.skills = skillsScore

  // 5. Education & Credentials Score (Weight: 15%)
  let eduScore = 0
  if (edu.length > 0) {
    eduScore += 70
    if (edu.some((e) => e.degree && (e.institution || e.school))) eduScore += 30
  } else {
    eduScore = 30
    tips.push({ section: 'education', type: 'warning', text: 'Add your degree or educational background.' })
  }
  if (certs.length > 0) {
    eduScore = Math.min(100, eduScore + 10)
  }
  sectionScores.education = Math.min(100, eduScore)

  // Overall Weighted Score
  const overall = Math.round(
    sectionScores.personal * 0.15 +
    sectionScores.summary * 0.15 +
    sectionScores.experience * 0.35 +
    sectionScores.skills * 0.20 +
    sectionScores.education * 0.15
  )

  const grade =
    overall >= 85 ? 'Excellent' :
    overall >= 70 ? 'Strong' :
    overall >= 50 ? 'Needs Improvement' : 'Incomplete'

  return {
    overallScore: Math.max(0, Math.min(100, overall)),
    grade,
    sectionScores,
    stats: {
      totalBullets,
      bulletsWithVerbs,
      bulletsWithMetrics,
      skillCount,
      experienceCount: exp.length,
      educationCount: edu.length,
      certCount: certs.length,
      customSectionCount: custom.length,
    },
    tips: tips.slice(0, 6), // Top actionable tips
  }
}

export default {
  calculateRealtimeAtsScore,
  analyzeBullet,
  ACTION_VERBS,
  WEAK_PHRASES,
}
