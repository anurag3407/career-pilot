/**
 * Heuristic, client-side resume analysis for the Resume Builder's
 * Improvement Suggestions Panel. Runs instantly (no network) so feedback
 * can update in real time as the user edits.
 *
 * analyzeResume(data) returns an array of suggestion objects:
 *   { id, category, severity, message }
 *
 * category: 'missing-section' | 'summary' | 'skills' |
 *           'weak-statement' | 'action-verb' | 'quantification'
 * severity: 'high' | 'medium' | 'low'
 */

// Phrases that signal passive / low-impact wording.
const WEAK_PHRASES = [
  'responsible for',
  'worked on',
  'helped with',
  'assisted with',
  'duties included',
  'tasks included',
  'involved in',
  'in charge of',
  'participated in',
]

// A curated set of strong action verbs used to detect weak bullet openers.
// Includes both past-tense forms (previous roles) and present/base forms
// (current roles, which recruiters expect to be written in present tense).
const ACTION_VERBS = new Set([
  // Past tense
  'accelerated', 'achieved', 'analyzed', 'architected', 'automated', 'boosted',
  'built', 'collaborated', 'coordinated', 'created', 'delivered', 'deployed',
  'designed', 'developed', 'drove', 'engineered', 'established', 'executed',
  'generated', 'implemented', 'improved', 'increased', 'initiated', 'integrated',
  'launched', 'led', 'maintained', 'managed', 'mentored', 'migrated',
  'modernized', 'negotiated', 'optimized', 'organized', 'overhauled', 'pioneered',
  'produced', 'redesigned', 'reduced', 'refactored', 'resolved', 'scaled',
  'spearheaded', 'streamlined', 'transformed',
  // Present / base tense
  'accelerate', 'achieve', 'analyze', 'architect', 'automate', 'boost',
  'build', 'collaborate', 'coordinate', 'create', 'deliver', 'deploy',
  'design', 'develop', 'drive', 'engineer', 'establish', 'execute',
  'generate', 'implement', 'improve', 'increase', 'initiate', 'integrate',
  'launch', 'lead', 'maintain', 'manage', 'mentor', 'migrate',
  'modernize', 'negotiate', 'optimize', 'organize', 'overhaul', 'pioneer',
  'produce', 'redesign', 'reduce', 'refactor', 'resolve', 'scale',
  'spearhead', 'streamline', 'transform',
])

const MIN_SUMMARY_WORDS = 20
const MIN_SKILLS = 5

/** Split a multi-line description into trimmed bullet strings. */
function getBullets(description) {
  return String(description || '')
    .split('\n')
    .map(line => line.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean)
}

/** Count comma-separated, non-empty skills. */
function getSkillList(skills) {
  return String(skills || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
}

export function analyzeResume(data = {}) {
  const {
    personal = {},
    education = [],
    experience = [],
    projects = [],
    skills = '',
  } = data

  const suggestions = []
  const add = (id, category, severity, message) =>
    suggestions.push({ id, category, severity, message })

  // ── Missing sections / summary quality ──────────────────────────────────────
  const summary = (personal.summary || '').trim()
  if (!summary) {
    add('missing-summary', 'missing-section', 'high',
      'Add a professional summary to introduce yourself and highlight your strengths.')
  } else if (summary.split(/\s+/).filter(Boolean).length < MIN_SUMMARY_WORDS) {
    add('short-summary', 'summary', 'medium',
      'Your summary is quite short. Aim for 2–3 sentences (about 30–50 words) covering your experience and goals.')
  }

  if (!education.some(e => (e.school || '').trim())) {
    add('missing-education', 'missing-section', 'medium',
      'Add your education details to give recruiters a complete picture.')
  }

  if (!experience.some(e => (e.title || '').trim())) {
    add('missing-experience', 'missing-section', 'high',
      'Add work experience — this is one of the first sections recruiters read.')
  }

  if (!projects.some(p => (p.name || '').trim())) {
    add('missing-projects', 'missing-section', 'medium',
      'Add projects to showcase practical skills — especially valuable early in your career.')
  }

  const skillList = getSkillList(skills)
  if (skillList.length === 0) {
    add('missing-skills', 'missing-section', 'high',
      'Add a skills section listing the tools and technologies you know.')
  } else if (skillList.length < MIN_SKILLS) {
    add('few-skills', 'skills', 'medium',
      `You've listed only ${skillList.length} skill${skillList.length === 1 ? '' : 's'}. Add more relevant skills (aim for 8–12) to improve keyword matching.`)
  }

  // ── Bullet-level checks (experience + projects) ─────────────────────────────
  const bullets = []
  experience.forEach(e => getBullets(e.description).forEach(b => bullets.push(b)))
  projects.forEach(p => getBullets(p.description).forEach(b => bullets.push(b)))

  // Weak statements: one suggestion per distinct weak phrase found.
  const lowerBullets = bullets.map(b => b.toLowerCase())
  WEAK_PHRASES.filter(phrase => lowerBullets.some(b => b.includes(phrase)))
    .forEach(phrase => {
      add(`weak-${phrase.replace(/\s+/g, '-')}`, 'weak-statement', 'medium',
        `Replace the weak phrase "${phrase}" with a strong action verb that shows impact (e.g. "Led", "Built", "Improved").`)
    })

  // Action verbs: flag bullets that don't begin with a recognised action verb.
  const weakOpeners = bullets.filter(b => {
    const first = (b.split(/\s+/)[0] || '').toLowerCase().replace(/[^a-z]/g, '')
    return first && !ACTION_VERBS.has(first)
  })
  if (weakOpeners.length > 0) {
    add('action-verbs', 'action-verb', 'medium',
      `${weakOpeners.length} bullet point${weakOpeners.length === 1 ? '' : 's'} don't start with a strong action verb. Begin each with verbs like "Developed", "Led", or "Optimized".`)
  }

  // Quantification: flag bullets with no measurable numbers.
  const unquantified = bullets.filter(b => !/\d/.test(b))
  if (bullets.length > 0 && unquantified.length > 0) {
    add('quantification', 'quantification', 'medium',
      `${unquantified.length} bullet point${unquantified.length === 1 ? '' : 's'} lack measurable results. Add numbers or metrics (e.g. "reduced load time by 40%").`)
  }

  return suggestions
}
