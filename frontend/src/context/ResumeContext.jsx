import { createContext, useContext, useMemo } from 'react'
import dummy from '../data/dummy_resume.json'

/**
 * Resume data context.
 *
 * Mirrors PortfolioContext.jsx — normalizes a variety of input shapes (AI
 * extractor output, ResumeBuilder form state, saved resume text, AI draft
 * from localStorage) into the canonical resume shape that all 5 templates
 * consume via `useResume()`.
 *
 * Canonical shape:
 *   {
 *     personal:    { name, title, summary, email, phone, location,
 *                    website, linkedin, github, photo },
 *     experience:  [{ role, company, period, location, bullets[] }],
 *     education:   [{ degree, institution, period, location, description }],
 *     projects:    [{ title, description, techStack[], link }],
 *     skills:      [{ name, level, category }],
 *     certifications: [{ name, issuer, year }]
 *   }
 */

const FALLBACK = dummy

const ResumeContext = createContext(null)

export function ResumeProvider({ value, children }) {
  // Memoize so referential equality holds across re-renders unless data changes.
  const memo = useMemo(() => normalizeResumeData(value), [value])
  return (
    <ResumeContext.Provider value={memo}>{children}</ResumeContext.Provider>
  )
}

export function useResume() {
  const ctx = useContext(ResumeContext)
  if (!ctx) {
    // Allow components to render outside a provider by falling back to dummy data
    // (useful for storybook-style previews and lazy-loaded templates).
    return FALLBACK
  }
  return ctx
}

// ─── Normalization helpers ────────────────────────────────────────────────────

function asString(v, fallback = '') {
  if (v === null || v === undefined) return fallback
  return String(v).trim()
}

function pickPeriod(item = {}) {
  if (item.period) return asString(item.period)
  if (item.duration) return asString(item.duration)
  if (item.year) return asString(item.year)
  if (item.startDate || item.endDate) {
    const s = item.startDate ? asString(item.startDate) : ''
    const e = item.endDate ? asString(item.endDate) : (item.current ? 'Present' : '')
    if (s && e) return `${s} – ${e}`
    return s || e
  }
  return ''
}

function splitBullets(input) {
  if (Array.isArray(input)) return input.filter(Boolean).map(asString)
  if (typeof input !== 'string' || !input.trim()) return []
  // Split on newline OR " • " OR " - " OR " * " so multi-line descriptions
  // (e.g. from the AI extractor) become bullet items automatically.
  return input
    .split(/\r?\n|(?:^|\s)[•\-*]\s+/)
    .map(s => s.trim())
    .filter(Boolean)
}

function normalizeSkill(s) {
  if (typeof s === 'string') return { name: s, level: '', category: '' }
  if (s && typeof s === 'object') {
    return {
      name: asString(s.name || s.title),
      level: asString(s.level || s.rating),
      category: asString(s.category || s.type),
    }
  }
  return { name: '', level: '', category: '' }
}

function normalizeExperience(item = {}) {
  if (typeof item === 'string') return { description: item }
  return {
    role: asString(item.role || item.title || item.position),
    company: asString(item.company || item.organization || item.employer),
    period: pickPeriod(item),
    location: asString(item.location),
    bullets: splitBullets(item.bullets || item.description || item.highlights),
  }
}

function normalizeProject(item = {}) {
  if (typeof item === 'string') return { title: item }
  return {
    title: asString(item.title || item.name),
    description: asString(item.description || item.summary),
    techStack: Array.isArray(item.techStack)
      ? item.techStack.map(asString).filter(Boolean)
      : Array.isArray(item.technologies)
      ? item.technologies.map(asString).filter(Boolean)
      : Array.isArray(item.tech)
      ? item.tech.map(asString).filter(Boolean)
      : [],
    link: asString(item.link || item.url || item.liveUrl || item.githubUrl),
  }
}

function normalizeEducation(item = {}) {
  return {
    degree: asString(item.degree || item.title),
    institution: asString(item.institution || item.school || item.university),
    period: pickPeriod(item),
    location: asString(item.location),
    description: asString(item.description),
  }
}

function normalizeCertification(item = {}) {
  return {
    name: asString(item.name || item.title),
    issuer: asString(item.issuer || item.organization),
    year: asString(item.year || item.date),
  }
}

function normalizePersonal(p = {}, fallback = {}) {
  const src = { ...fallback, ...p }
  return {
    name: asString(src.name || src.fullName),
    title: asString(src.title || src.headline),
    summary: asString(src.summary || src.bio || src.tagline),
    email: asString(src.email),
    phone: asString(src.phone),
    location: asString(src.location || src.address),
    website: asString(src.website || src.portfolio || src.url),
    linkedin: asString(src.linkedin),
    github: asString(src.github),
    photo: asString(src.photo || src.avatar || src.avatarUrl),
  }
}

// ─── Top-level shape detection ────────────────────────────────────────────────

/**
 * Detect whether `raw` matches the AI portfolio-extractor output shape
 * (hero / contact / about / experience / projects / skills).
 */
function fromAiExtractor(raw) {
  return Boolean(raw && (raw.hero || raw.contact || raw.about))
}

/**
 * @param {object|null|undefined} raw
 * @returns {object} The canonical resume shape
 */
export function normalizeResumeData(raw) {
  const fbPersonal = { photo: '', ...(FALLBACK.personal || {}) }
  const personal = normalizePersonal(raw?.personal || {}, fbPersonal)

  // Merge in social-links from portfolio/socials if explicit fields missing
  const socials = raw?.socials || {}
  if (!personal.email && raw?.contact?.email) personal.email = raw.contact.email
  if (!personal.phone && raw?.contact?.phone) personal.phone = raw.contact.phone
  if (!personal.linkedin && (socials.linkedin || raw?.contact?.linkedin))
    personal.linkedin = socials.linkedin || raw.contact.linkedin
  if (!personal.github && (socials.github || raw?.contact?.github))
    personal.github = socials.github || raw.contact.github
  if (!personal.website && (socials.portfolio || raw?.contact?.portfolio))
    personal.website = socials.portfolio || raw.contact.portfolio

  // Backfill personal from AI extractor hero/about blocks
  if (fromAiExtractor(raw) && !raw.personal) {
    if (!personal.name && raw.hero?.subtitle) personal.name = raw.hero.subtitle
    if (!personal.title && raw.hero?.title) personal.title = raw.hero.title
    if (!personal.summary && raw.about?.bio) personal.summary = raw.about.bio
  }

  const experience = Array.isArray(raw?.experience)
    ? raw.experience.map(normalizeExperience).filter(e => e.role || e.company || e.bullets.length)
    : []

  const education = Array.isArray(raw?.education)
    ? raw.education.map(normalizeEducation).filter(e => e.degree || e.institution)
    : []

  const projects = Array.isArray(raw?.projects)
    ? raw.projects.map(normalizeProject).filter(p => p.title || p.description)
    : []

  const skills = Array.isArray(raw?.skills)
    ? raw.skills.map(normalizeSkill).filter(s => s.name)
    : []

  const certifications = Array.isArray(raw?.certifications)
    ? raw.certifications.map(normalizeCertification).filter(c => c.name)
    : []

  // Layout controls (Gap #9). Accepts the same shape as DEFAULT_LAYOUT,
  // or undefined. Caller can override via ResumeProvider value.layout.
  const layout = { ...DEFAULT_LAYOUT, ...(raw?.layout || {}) }

  return {
    personal,
    experience,
    education,
    projects,
    skills,
    certifications,
    layout,
  }
}

const DEFAULT_LAYOUT = {
  pageSize: 'A4',
  fontSize: 'Medium',
  fontSizePx: '14px',
  spacing: 'Comfortable',
  lineHeight: 1.5,
}

export { FALLBACK as RESUME_FALLBACK, DEFAULT_LAYOUT }
