/**
 * resumeHtml.js
 * Semantic, ATS-friendly HTML serialization of a canonical resume document.
 *
 * This is deliberately boring HTML: one column, real headings, real text for
 * email/phone, no tables, no icon fonts and no CSS layout tricks. It is the
 * input contract for @jsonresume/ats-validator and is also a safe fallback for
 * share pages and print views.
 */

const ESCAPE_RE = /[&<>"']/g
const ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

export function escapeHtml(value) {
  return String(value ?? '').replace(ESCAPE_RE, (ch) => ESCAPE_MAP[ch])
}

function text(value) {
  return escapeHtml(value).replace(/\r?\n/g, '<br>')
}

function sectionTitle(title) {
  return `<h2>${escapeHtml(title)}</h2>`
}

function renderSummary(summary) {
  if (!summary) return ''
  return `<section aria-labelledby="summary-heading">${sectionTitle('Summary')}<p>${text(summary)}</p></section>`
}

function renderExperience(experience = []) {
  const entries = experience.filter((item) => item && (item.role || item.company || item.bullets?.length))
  if (!entries.length) return ''
  const body = entries.map((item) => {
    const heading = [item.role, item.company].filter(Boolean).join(' - ') || 'Experience'
    const meta = [item.location, item.period].filter(Boolean).join(' | ')
    const bullets = (item.bullets || []).filter(Boolean)
    return [
      '<article>',
      `<h3>${escapeHtml(heading)}</h3>`,
      meta ? `<p>${escapeHtml(meta)}</p>` : '',
      bullets.length ? `<ul>${bullets.map((bullet) => `<li>${text(bullet)}</li>`).join('')}</ul>` : '',
      '</article>',
    ].join('')
  }).join('')
  return `<section aria-labelledby="experience-heading">${sectionTitle('Experience')}${body}</section>`
}

function renderEducation(education = []) {
  const entries = education.filter((item) => item && (item.degree || item.institution))
  if (!entries.length) return ''
  const body = entries.map((item) => {
    const heading = [item.degree, item.institution].filter(Boolean).join(' - ') || 'Education'
    const meta = [item.location, item.period].filter(Boolean).join(' | ')
    return [
      '<article>',
      `<h3>${escapeHtml(heading)}</h3>`,
      meta ? `<p>${escapeHtml(meta)}</p>` : '',
      item.description ? `<p>${text(item.description)}</p>` : '',
      '</article>',
    ].join('')
  }).join('')
  return `<section aria-labelledby="education-heading">${sectionTitle('Education')}${body}</section>`
}

function renderProjects(projects = []) {
  const entries = projects.filter((item) => item && (item.title || item.description))
  if (!entries.length) return ''
  const body = entries.map((item) => {
    const tech = Array.isArray(item.techStack) ? item.techStack.filter(Boolean).join(', ') : ''
    return [
      '<article>',
      `<h3>${escapeHtml(item.title || 'Project')}</h3>`,
      tech ? `<p>${escapeHtml(tech)}</p>` : '',
      item.link ? `<p>Project: <a href="${escapeHtml(item.link)}">${escapeHtml(item.link)}</a></p>` : '',
      item.description ? `<p>${text(item.description)}</p>` : '',
      '</article>',
    ].join('')
  }).join('')
  return `<section aria-labelledby="projects-heading">${sectionTitle('Projects')}${body}</section>`
}

function renderSkills(skills = []) {
  const entries = skills.filter((item) => item && item.name)
  if (!entries.length) return ''
  const groups = new Map()
  for (const skill of entries) {
    const category = skill.category || 'Skills'
    if (!groups.has(category)) groups.set(category, [])
    groups.get(category).push(skill.name)
  }
  const body = [...groups.entries()]
    .map(([category, names]) => `<p><strong>${escapeHtml(category)}:</strong> ${escapeHtml(names.join(', '))}</p>`)
    .join('')
  return `<section aria-labelledby="skills-heading">${sectionTitle('Skills')}${body}</section>`
}

function renderCertifications(certifications = []) {
  const entries = certifications.filter((item) => item && item.name)
  if (!entries.length) return ''
  const body = `<ul>${entries.map((item) => {
    const suffix = [item.issuer, item.year].filter(Boolean).join(', ')
    return `<li>${escapeHtml(item.name)}${suffix ? ` - ${escapeHtml(suffix)}` : ''}</li>`
  }).join('')}</ul>`
  return `<section aria-labelledby="certifications-heading">${sectionTitle('Certifications')}${body}</section>`
}

function renderCustomSection(section) {
  if (!section || !section.title) return ''
  let body = ''
  if (section.kind === 'paragraph') {
    body = section.body ? `<p>${text(section.body)}</p>` : ''
  } else if (section.kind === 'quotes') {
    body = (section.items || []).filter(Boolean).map((item) => `<blockquote>${text(item)}</blockquote>`).join('')
  } else {
    const items = (section.items || []).filter(Boolean)
    body = items.length ? `<ul>${items.map((item) => `<li>${text(item)}</li>`).join('')}</ul>` : ''
  }
  return `<section aria-labelledby="${escapeHtml(section.id || 'custom')}-heading">${sectionTitle(section.title)}${body}</section>`
}

const KNOWN_SECTIONS = {
  summary: renderSummary,
  experience: renderExperience,
  education: renderEducation,
  projects: renderProjects,
  skills: renderSkills,
  certifications: renderCertifications,
}

const DEFAULT_ORDER = ['experience', 'education', 'projects', 'skills', 'certifications']

/**
 * Serialize a canonical resume document to semantic HTML.
 *
 * @param {object} doc canonical resume document (normalizeResumeData output)
 * @returns {string} complete HTML document
 */
export function resumeDocumentToHtml(doc = {}) {
  const personal = doc.personal || {}
  const name = personal.name || 'Resume'

  const contact = []
  if (personal.email) contact.push(`<a href="mailto:${escapeHtml(personal.email)}">${escapeHtml(personal.email)}</a>`)
  if (personal.phone) contact.push(`<a href="tel:${escapeHtml(String(personal.phone).replace(/[^\d+]/g, ''))}">${escapeHtml(personal.phone)}</a>`)
  if (personal.location) contact.push(escapeHtml(personal.location))
  if (personal.linkedin) contact.push(`<a href="${escapeHtml(personal.linkedin)}">LinkedIn</a>`)
  if (personal.github) contact.push(`<a href="${escapeHtml(personal.github)}">GitHub</a>`)
  if (personal.website) contact.push(`<a href="${escapeHtml(personal.website)}">Portfolio</a>`)

  const header = [
    '<header>',
    `<h1>${escapeHtml(name)}</h1>`,
    personal.title ? `<p>${escapeHtml(personal.title)}</p>` : '',
    contact.length ? `<p>${contact.join(' | ')}</p>` : '',
    '</header>',
  ].join('')

  const order = Array.isArray(doc.sectionOrder) && doc.sectionOrder.length
    ? [...new Set(doc.sectionOrder)]
    : DEFAULT_ORDER

  const customById = new Map((doc.customSections || []).map((section) => [section.id, section]))
  const emitted = new Set()

  const renderKey = (key) => {
    if (emitted.has(key)) return ''
    emitted.add(key)
    if (KNOWN_SECTIONS[key]) return KNOWN_SECTIONS[key](doc[key])
    if (customById.has(key)) return renderCustomSection(customById.get(key))
    return ''
  }

  const body = [
    ...order.map(renderKey),
    ...DEFAULT_ORDER.filter((key) => !emitted.has(key)).map(renderKey),
    ...(doc.customSections || []).filter((section) => !emitted.has(section.id)).map(renderCustomSection),
  ].join('')

  return [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    `<title>${escapeHtml(name)} - Resume</title>`,
    '<style>',
    'body{font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.5;color:#111;max-width:820px;margin:0 auto;padding:24px}',
    'h1{font-size:24px;margin:0 0 4px}',
    'h2{font-size:14px;margin:18px 0 6px;border-bottom:1px solid #ddd;padding-bottom:2px}',
    'h3{font-size:13px;margin:10px 0 2px}',
    'p{margin:2px 0}',
    'ul{margin:4px 0 4px 18px;padding:0}',
    'li{margin:2px 0}',
    'blockquote{margin:4px 0;padding-left:12px;border-left:2px solid #ddd}',
    'a{color:#111}',
    '</style>',
    '</head>',
    '<body>',
    header,
    body,
    '</body>',
    '</html>',
  ].join('')
}

export default resumeDocumentToHtml
