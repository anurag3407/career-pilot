/**
 * resumeParser.js
 * Comprehensive Bidirectional Markdown <-> Structured Resume Parser & JSON Resume Mapper.
 *
 * Powers lossless hydration between raw markdown, uploaded resumes, AI generated text,
 * and canonical structured data for templates, builder, and exports.
 */

// Known section header keys mapped to canonical section IDs
export const CANONICAL_SECTION_KEYS = {
  summary: 'summary',
  'professional summary': 'summary',
  'career summary': 'summary',
  about: 'summary',
  'about me': 'summary',
  profile: 'summary',
  'personal statement': 'summary',

  experience: 'experience',
  'work experience': 'experience',
  'professional experience': 'experience',
  employment: 'experience',
  'work history': 'experience',

  education: 'education',
  'academic background': 'education',
  academics: 'education',
  'education & credentials': 'education',

  projects: 'projects',
  'key projects': 'projects',
  'personal projects': 'projects',
  'featured projects': 'projects',

  skills: 'skills',
  'technical skills': 'skills',
  'skills & competencies': 'skills',
  'skills & tools': 'skills',
  'skills & interests': 'skills',
  'core competencies': 'skills',

  certifications: 'certifications',
  certificates: 'certifications',
  licenses: 'certifications',
  'certifications & licenses': 'certifications',
}

/**
 * Normalizes a raw heading line to a clean header key
 */
export function normalizeHeaderTitle(title = '') {
  const clean = title.trim().replace(/^#+\s*/, '').replace(/[:*_-]+$/, '').trim().toLowerCase()
  return CANONICAL_SECTION_KEYS[clean] || clean
}

/**
 * Parses contact information from markdown text or headers
 */
function extractContactInfo(lines, existingPersonal = {}) {
  const p = { ...existingPersonal }

  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i
  const phoneRegex = /(\+?\d{1,4}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9})/
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i
  const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i
  const urlRegex = /https?:\/\/[^\s)\]]+/i

  for (const line of lines) {
    if (!p.email) {
      const m = line.match(emailRegex)
      if (m) p.email = m[1]
    }
    if (!p.phone) {
      const m = line.match(phoneRegex)
      if (m && m[1].replace(/\D/g, '').length >= 7) p.phone = m[1].trim()
    }
    if (!p.linkedin) {
      const m = line.match(linkedinRegex)
      if (m) p.linkedin = m[0].startsWith('http') ? m[0] : `https://${m[0]}`
    }
    if (!p.github) {
      const m = line.match(githubRegex)
      if (m) p.github = m[0].startsWith('http') ? m[0] : `https://${m[0]}`
    }
    if (!p.website) {
      // Find a url that is neither linkedin nor github
      const m = line.match(urlRegex)
      if (m && !m[0].includes('linkedin.com') && !m[0].includes('github.com')) {
        p.website = m[0]
      }
    }
    // Location check: City, State or City, Country pattern
    if (!p.location) {
      const locMatch = line.match(/([A-Z][a-zA-Z\s]+,\s*[A-Z]{2,}(?:\s*[A-Z]{2,})?)/)
      if (locMatch && !locMatch[1].includes('LinkedIn') && !locMatch[1].includes('GitHub')) {
        p.location = locMatch[1].trim()
      }
    }
  }

  return p
}

/**
 * Parses Work Experience section lines into structured entries
 */
function parseExperienceSection(lines) {
  const entries = []
  let current = null

  const flush = () => {
    if (current && (current.role || current.company || current.bullets.length)) {
      if (!current.role && current.title) current.role = current.title
      entries.push(current)
    }
    current = null
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i]
    const line = rawLine.trim()
    if (!line) continue

    // Detect heading for a new job entry (e.g., ### Role at Company or ### Role | Company or **Role** at Company)
    const h3Match = line.match(/^###\s+(.+)$/)
    const boldHeaderMatch = !h3Match && line.match(/^\*\*([^*]+)\*\*(?:\s*[-–—|@]\s*(.+))?$/)

    if (h3Match || boldHeaderMatch) {
      flush()
      const headerStr = h3Match ? h3Match[1].trim() : `${boldHeaderMatch[1]} ${boldHeaderMatch[2] || ''}`.trim()

      let role = ''
      let company = ''
      let period = ''
      let location = ''

      // Common separators: ' at ', ' @ ', ' - ', ' | ', ' – '
      const parts = headerStr.split(/\s+(?:at|@|[-–—|])\s+/i)
      if (parts.length >= 2) {
        role = parts[0].trim()
        company = parts[1].trim()
      } else {
        role = headerStr
      }

      current = {
        role,
        company,
        location,
        startDate: '',
        endDate: '',
        current: false,
        period: '',
        bullets: [],
      }
      continue
    }

    // If we have a current entry, check for sub-metadata (date, location) or bullet points
    if (current) {
      // Bullet point detection
      const bulletMatch = line.match(/^[-*•]\s+(.+)$/) || line.match(/^\d+\.\s+(.+)$/)
      if (bulletMatch) {
        current.bullets.push(bulletMatch[1].trim())
        continue
      }

      // Check for dates like "Jan 2021 - Present" or "2020 - 2023"
      const dateMatch = line.match(/\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{4})\s*[-–—to]+\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{4}|Present|Current)\b/i)
      if (dateMatch) {
        current.startDate = dateMatch[1].trim()
        current.endDate = dateMatch[2].trim()
        current.current = /Present|Current/i.test(dateMatch[2])
        current.period = dateMatch[0].trim()

        // Remainder of line might be location or company
        const lineWithoutDate = line.replace(dateMatch[0], '').replace(/[-–—|•]/g, '').trim()
        if (lineWithoutDate && !current.location) {
          current.location = lineWithoutDate
        }
        continue
      }

      // If text line is not a bullet, check if company/location wasn't set or treat as descriptive text
      if (!current.company && line.length < 60 && !line.includes('.')) {
        current.company = line
      } else if (line) {
        current.bullets.push(line)
      }
    } else {
      // Create a fallback entry if bullet appears before entry header
      if (line.startsWith('-') || line.startsWith('*')) {
        current = {
          role: 'Professional Experience',
          company: '',
          location: '',
          bullets: [line.replace(/^[-*•]\s+/, '').trim()],
        }
      }
    }
  }
  flush()
  return entries
}

/**
 * Parses Education section lines into structured entries
 */
function parseEducationSection(lines) {
  const entries = []
  let current = null

  const flush = () => {
    if (current && (current.institution || current.degree || current.school)) {
      if (!current.institution && current.school) current.institution = current.school
      entries.push(current)
    }
    current = null
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i]
    const line = rawLine.trim()
    if (!line) continue

    const h3Match = line.match(/^###\s+(.+)$/)
    const boldMatch = !h3Match && line.match(/^\*\*([^*]+)\*\*(?:\s*[-–—|,]\s*(.+))?$/)

    if (h3Match || boldMatch) {
      flush()
      const headerStr = h3Match ? h3Match[1].trim() : `${boldMatch[1]} ${boldMatch[2] || ''}`.trim()
      let institution = ''
      let degree = ''

      const parts = headerStr.split(/\s*[-–—|,]\s*/)
      if (parts.length >= 2) {
        institution = parts[0].trim()
        degree = parts[1].trim()
      } else {
        institution = headerStr
      }

      let field = ''
      const inMatch = degree.match(/^(.+?)\s+in\s+(.+)$/i)
      if (inMatch) {
        degree = inMatch[1].trim()
        field = inMatch[2].trim()
      }

      current = {
        institution,
        degree,
        field,
        startDate: '',
        endDate: '',
        period: '',
        gpa: '',
        highlights: [],
      }
      continue
    }

    if (current) {
      const gpaMatch = line.match(/GPA[:\s]+([\d.]+(?:\s*\/\s*[\d.]+)?)/i)
      if (gpaMatch) {
        current.gpa = gpaMatch[1].trim()
      }

      const dateMatch = line.match(/\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{4})\s*[-–—to]*\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{4}|Present|Current)?\b/i)
      if (dateMatch) {
        current.startDate = dateMatch[1] || ''
        current.endDate = dateMatch[2] || ''
        current.period = dateMatch[0].trim()
      }

      const degreeMatch = line.match(/(?:Bachelor|Master|Doctor|PhD|B\.S\.|M\.S\.|B\.A\.|M\.A\.|Associate|B\.Tech|M\.Tech|BSc|MSc|Degree)[^,\n]*/i)
      if (degreeMatch && !current.degree) {
        current.degree = degreeMatch[0].trim()
      }

      const bulletMatch = line.match(/^[-*•]\s+(.+)$/)
      if (bulletMatch) {
        current.highlights.push(bulletMatch[1].trim())
      } else if (!gpaMatch && !dateMatch && !degreeMatch) {
        if (!current.description) {
          current.description = line
        }
      }
    } else {
      if (line) {
        current = {
          institution: line,
          degree: '',
          highlights: [],
        }
      }
    }
  }
  flush()
  return entries
}

/**
 * Parses Projects section lines into structured entries
 */
function parseProjectsSection(lines) {
  const entries = []
  let current = null

  const flush = () => {
    if (current && (current.title || current.name || current.description)) {
      if (!current.title && current.name) current.title = current.name
      entries.push(current)
    }
    current = null
  }

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i]
    const line = rawLine.trim()
    if (!line) continue

    const h3Match = line.match(/^###\s+(.+)$/)
    const boldMatch = !h3Match && line.match(/^\*\*([^*]+)\*\*(?:\s*[-–—|]\s*(.+))?$/)

    if (h3Match || boldMatch) {
      flush()
      const titleStr = h3Match ? h3Match[1].trim() : `${boldMatch[1]} ${boldMatch[2] || ''}`.trim()
      current = {
        title: titleStr,
        description: '',
        link: '',
        techStack: [],
        bullets: [],
      }
      continue
    }

    if (current) {
      const linkMatch = line.match(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/) || line.match(/(https?:\/\/[^\s]+)/)
      if (linkMatch && !current.link) {
        current.link = linkMatch[2] || linkMatch[1]
      }

      const techMatch = line.match(/(?:Tech|Technologies|Stack|Built with)[:\s]+(.+)$/i)
      if (techMatch) {
        current.techStack = techMatch[1].split(/[,|•/]/).map((t) => t.trim()).filter(Boolean)
        continue
      }

      const bulletMatch = line.match(/^[-*•]\s+(.+)$/)
      if (bulletMatch) {
        current.bullets.push(bulletMatch[1].trim())
        if (!current.description) current.description = bulletMatch[1].trim()
      } else if (!current.description) {
        current.description = line
      } else {
        current.bullets.push(line)
      }
    } else {
      current = {
        title: line,
        description: '',
        bullets: [],
        techStack: [],
      }
    }
  }
  flush()
  return entries
}

/**
 * Parses Skills section lines into structured entries
 */
function parseSkillsSection(lines) {
  const skills = []
  const seen = new Set()

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    // Handle categorized skills: "Languages: JS, Python, Go"
    const catMatch = trimmed.match(/^([^:]+):\s*(.+)$/)
    if (catMatch) {
      const category = catMatch[1].replace(/^[-*•]\s*/, '').trim()
      const items = catMatch[2].split(/[,|•/]/).map((s) => s.trim()).filter(Boolean)
      for (const item of items) {
        const key = item.toLowerCase()
        if (!seen.has(key)) {
          seen.add(key)
          skills.push({ name: item, category, level: 'Proficient' })
        }
      }
      continue
    }

    // Handle bulleted or comma-separated skills
    const rawItems = trimmed.replace(/^[-*•]\s*/, '').split(/[,|•/]/).map((s) => s.trim()).filter(Boolean)
    for (const item of rawItems) {
      const key = item.toLowerCase()
      if (!seen.has(key) && item.length <= 40) {
        seen.add(key)
        skills.push({ name: item, category: 'Technical', level: 'Proficient' })
      }
    }
  }

  return skills
}

/**
 * Parses Certifications section lines into structured entries
 */
function parseCertificationsSection(lines) {
  const certs = []

  for (const line of lines) {
    const trimmed = line.trim().replace(/^[-*•]\s*/, '')
    if (!trimmed) continue

    let name = trimmed
    let issuer = ''
    let year = ''
    let url = ''

    // Detect markdown link: [Cert Name](url)
    const linkMatch = trimmed.match(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/)
    if (linkMatch) {
      name = linkMatch[1]
      url = linkMatch[2]
    }

    // Detect year: (2023) or 2023
    const yearMatch = trimmed.match(/\b(20\d{2}|19\d{2})\b/)
    if (yearMatch) {
      year = yearMatch[1]
    }

    // Detect issuer: 'Cert Name - Issuer' or 'Cert Name, Issuer'
    const parts = name.split(/\s*[-–—|,]\s*/)
    if (parts.length >= 2) {
      name = parts[0].trim()
      issuer = parts[1].replace(/\b(20\d{2}|19\d{2})\b/, '').replace(/[()]/g, '').trim()
    }

    certs.push({
      name,
      issuer,
      year,
      url,
    })
  }

  return certs
}

/**
 * Parses custom section lines into a CustomSection object
 */
function parseCustomSection(title, lines, order = 0) {
  const items = []
  const rawLines = []
  let isQuotes = false
  let isBooks = false

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    if (trimmed.startsWith('>')) {
      isQuotes = true
      items.push(trimmed.replace(/^>\s*["“]?/, '').replace(/["”]?$/, '').trim())
    } else if (trimmed.startsWith('-') || trimmed.startsWith('*') || trimmed.startsWith('•')) {
      items.push(trimmed.replace(/^[-*•]\s*/, '').trim())
    } else {
      rawLines.push(trimmed)
    }
  }

  const cleanTitle = title.replace(/^#+\s*/, '').replace(/[:*_-]+$/, '').trim()
  const lowerTitle = cleanTitle.toLowerCase()

  if (lowerTitle.includes('book') || lowerTitle.includes('reading')) {
    isBooks = true
  }

  let kind = 'list'
  if (isQuotes) {
    kind = 'quotes'
  } else if (isBooks) {
    kind = 'books'
  } else if (items.length === 0 && rawLines.length > 0) {
    kind = 'paragraph'
  }

  const id = `custom-${lowerTitle.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || Date.now()}`

  return {
    id,
    title: cleanTitle,
    kind,
    items: items.length > 0 ? items : rawLines,
    body: rawLines.join('\n\n'),
    order,
  }
}

/**
 * Parses a markdown string into the canonical structured resume data shape.
 * Lossless round-tripping for templates, editor, and exports.
 *
 * @param {string} markdownText - Raw markdown text
 * @param {string} [fallbackTitle] - Optional fallback title for name
 * @returns {object} Canonical structured resume data
 */
export function markdownToStructured(markdownText = '', fallbackTitle = '') {
  if (!markdownText || typeof markdownText !== 'string') {
    return {
      personal: { name: fallbackTitle || 'My Resume' },
      experience: [],
      education: [],
      projects: [],
      skills: [],
      certifications: [],
      customSections: [],
      sectionOrder: ['education', 'experience', 'projects', 'skills'],
    }
  }

  const lines = markdownText.split(/\r?\n/)
  const headerLines = []
  const sectionBuckets = []
  let currentSection = null

  // 1. Split into top header + section blocks based on ## (H2 headings)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    // Only match ## (H2) for top-level resume sections so ### (H3) remain entry headers
    const headingMatch = line.match(/^##\s+([^#].*)$/)

    if (headingMatch) {
      if (currentSection) {
        sectionBuckets.push(currentSection)
      }
      currentSection = {
        rawTitle: headingMatch[1].trim(),
        key: normalizeHeaderTitle(headingMatch[1]),
        lines: [],
      }
    } else {
      if (currentSection) {
        currentSection.lines.push(line)
      } else {
        headerLines.push(line)
      }
    }
  }
  if (currentSection) {
    sectionBuckets.push(currentSection)
  }

  // 2. Extract Personal Details
  let name = ''
  let title = ''

  // Look for # Name in headerLines
  for (const hLine of headerLines) {
    const nameMatch = hLine.match(/^#\s+(.+)$/)
    if (nameMatch) {
      name = nameMatch[1].trim()
      break
    }
  }

  if (!name && headerLines.length > 0) {
    const firstNonEmpty = headerLines.find((l) => l.trim().length > 0)
    if (firstNonEmpty) {
      name = firstNonEmpty.replace(/^[*_#]+/, '').replace(/[*_#]+$/, '').trim()
    }
  }
  if (!name && fallbackTitle) {
    name = fallbackTitle.replace(/^Resume\s*[-–—:]\s*/i, '').trim()
  }

  const personal = extractContactInfo(headerLines, { name, title })

  // 3. Process each section bucket
  let summary = ''
  let experience = []
  let education = []
  let projects = []
  let skills = []
  let certifications = []
  const customSections = []
  const sectionOrder = []

  sectionBuckets.forEach((bucket, index) => {
    const { key, rawTitle, lines: bLines } = bucket

    switch (key) {
      case 'summary':
        summary = bLines.map((l) => l.trim()).filter(Boolean).join(' ')
        if (!sectionOrder.includes('summary')) sectionOrder.push('summary')
        break

      case 'experience':
        experience = parseExperienceSection(bLines)
        if (!sectionOrder.includes('experience')) sectionOrder.push('experience')
        break

      case 'education':
        education = parseEducationSection(bLines)
        if (!sectionOrder.includes('education')) sectionOrder.push('education')
        break

      case 'projects':
        projects = parseProjectsSection(bLines)
        if (!sectionOrder.includes('projects')) sectionOrder.push('projects')
        break

      case 'skills':
        skills = parseSkillsSection(bLines)
        if (!sectionOrder.includes('skills')) sectionOrder.push('skills')
        break

      case 'certifications':
        certifications = parseCertificationsSection(bLines)
        if (!sectionOrder.includes('certifications')) sectionOrder.push('certifications')
        break

      default: {
        // User custom section
        const cs = parseCustomSection(rawTitle, bLines, index)
        customSections.push(cs)
        if (!sectionOrder.includes(cs.id)) sectionOrder.push(cs.id)
        break
      }
    }
  })

  if (summary) {
    personal.summary = summary
  }

  // Ensure standard sections exist in sectionOrder if they have content
  const standardKeys = ['education', 'experience', 'projects', 'skills', 'certifications']
  standardKeys.forEach((sk) => {
    const hasContent =
      (sk === 'education' && education.length) ||
      (sk === 'experience' && experience.length) ||
      (sk === 'projects' && projects.length) ||
      (sk === 'skills' && skills.length) ||
      (sk === 'certifications' && certifications.length)

    if (hasContent && !sectionOrder.includes(sk)) {
      sectionOrder.push(sk)
    }
  })

  return {
    personal,
    experience,
    education,
    projects,
    skills,
    certifications,
    customSections,
    sectionOrder: sectionOrder.filter((v) => v !== 'summary'), // summary stays lead
  }
}

/**
 * Converts structured resume data back into clean, formatted ATS-friendly Markdown.
 *
 * @param {object} resumeData - Canonical structured resume
 * @returns {string} Clean Markdown
 */
export function structuredToMarkdown(resumeData = {}) {
  const d = resumeData || {}
  const p = d.personal || {}
  let md = ''

  // 1. Header: Name & Contact
  md += `# ${p.name || 'Resume'}\n\n`

  const contact = []
  if (p.email) contact.push(`[${p.email}](mailto:${p.email})`)
  if (p.phone) contact.push(p.phone)
  if (p.location) contact.push(p.location)
  if (p.linkedin) contact.push(`[LinkedIn](${p.linkedin})`)
  if (p.github) contact.push(`[GitHub](${p.github})`)
  if (p.website) contact.push(`[Portfolio](${p.website})`)

  if (contact.length > 0) {
    md += `${contact.join(' | ')}\n\n`
  }

  // 2. Summary
  if (p.summary) {
    md += `## SUMMARY\n\n${p.summary.trim()}\n\n`
  }

  // 3. Section builders
  const sectionBuilders = {
    experience: () => {
      if (!d.experience || !d.experience.length) return ''
      let out = `## EXPERIENCE\n\n`
      d.experience.forEach((e) => {
        const role = e.role || e.title || 'Role'
        const comp = e.company ? ` at ${e.company}` : ''
        out += `### ${role}${comp}\n`
        const meta = [e.period || [e.startDate, e.endDate || (e.current ? 'Present' : '')].filter(Boolean).join(' - '), e.location].filter(Boolean).join(' | ')
        if (meta) out += `${meta}\n`
        if (e.bullets && e.bullets.length) {
          e.bullets.forEach((b) => {
            out += `- ${b}\n`
          })
        }
        out += '\n'
      })
      return out
    },

    education: () => {
      if (!d.education || !d.education.length) return ''
      let out = `## EDUCATION\n\n`
      d.education.forEach((edu) => {
        const inst = edu.institution || edu.school || 'University'
        const deg = edu.degree ? ` - ${edu.degree}` : ''
        const field = edu.field ? ` in ${edu.field}` : ''
        out += `### ${inst}${deg}${field}\n`
        const period = edu.period || [edu.startDate, edu.endDate].filter(Boolean).join(' - ')
        if (period) out += `${period}\n`
        if (edu.gpa) out += `GPA: ${edu.gpa}\n`
        if (edu.highlights && edu.highlights.length) {
          edu.highlights.forEach((h) => {
            out += `- ${h}\n`
          })
        }
        if (edu.description) {
          out += `${edu.description}\n`
        }
        out += '\n'
      })
      return out
    },

    projects: () => {
      if (!d.projects || !d.projects.length) return ''
      let out = `## PROJECTS\n\n`
      d.projects.forEach((proj) => {
        const title = proj.title || proj.name || 'Project'
        out += `### ${title}\n`
        if (proj.link) out += `[Project Link](${proj.link})\n`
        if (proj.techStack && proj.techStack.length) {
          out += `Tech: ${proj.techStack.join(', ')}\n`
        }
        if (proj.description) out += `${proj.description}\n`
        if (proj.bullets && proj.bullets.length) {
          proj.bullets.forEach((b) => {
            out += `- ${b}\n`
          })
        }
        out += '\n'
      })
      return out
    },

    skills: () => {
      if (!d.skills || !d.skills.length) return ''
      let out = `## SKILLS\n\n`
      const byCat = {}
      d.skills.forEach((s) => {
        const rawCat = s.category || 'General'
        const cat = rawCat.replace(/^[*_]+|[*_]+$/g, '').trim() || 'General'
        byCat[cat] = byCat[cat] || []
        byCat[cat].push(s.name || s)
      })

      const cats = Object.keys(byCat)
      if (cats.length === 1 && cats[0] === 'General') {
        out += `${byCat.General.join(', ')}\n\n`
      } else {
        cats.forEach((cat) => {
          out += `- **${cat}**: ${byCat[cat].join(', ')}\n`
        })
        out += '\n'
      }
      return out
    },

    certifications: () => {
      if (!d.certifications || !d.certifications.length) return ''
      let out = `## CERTIFICATIONS\n\n`
      d.certifications.forEach((c) => {
        const name = c.name || 'Certification'
        const issuer = c.issuer ? ` - ${c.issuer}` : ''
        const year = c.year ? ` (${c.year})` : ''
        if (c.url) {
          out += `- [${name}](${c.url})${issuer}${year}\n`
        } else {
          out += `- ${name}${issuer}${year}\n`
        }
      })
      out += '\n'
      return out
    },
  }

  // 4. Emit according to sectionOrder
  const emitted = new Set()
  const customById = new Map((d.customSections || []).map((cs) => [cs.id, cs]))

  const emitKey = (key) => {
    if (emitted.has(key)) return
    emitted.add(key)
    if (sectionBuilders[key]) {
      md += sectionBuilders[key]()
    } else if (customById.has(key)) {
      const cs = customById.get(key)
      md += formatCustomToMd(cs)
    }
  }

  const order = Array.isArray(d.sectionOrder) ? d.sectionOrder : ['education', 'experience', 'projects', 'skills', 'certifications']
  order.forEach(emitKey)

  // Emit remaining standard
  Object.keys(sectionBuilders).forEach(emitKey)

  // Emit remaining custom
  ;(d.customSections || []).forEach((cs) => {
    if (!emitted.has(cs.id)) {
      emitted.add(cs.id)
      md += formatCustomToMd(cs)
    }
  })

  return md.trim() + '\n'
}

function formatCustomToMd(cs) {
  if (!cs || !cs.title) return ''
  let out = `## ${cs.title.toUpperCase()}\n\n`
  if (cs.kind === 'paragraph') {
    out += `${cs.body || ''}\n\n`
  } else if (cs.kind === 'quotes') {
    ;(cs.items || []).forEach((q) => {
      out += `> "${q}"\n\n`
    })
  } else {
    ;(cs.items || []).forEach((item) => {
      out += `- ${item}\n`
    })
    out += '\n'
  }
  return out
}

/**
 * Standard JSON Resume (schema.jsonresume.org) to Canonical Structured Format
 */
export function jsonResumeToStructured(json) {
  if (!json || typeof json !== 'object') return null
  const b = json.basics || {}

  const personal = {
    name: b.name || '',
    title: b.label || '',
    email: b.email || '',
    phone: b.phone || '',
    location: b.location ? [b.location.city, b.location.region, b.location.countryCode].filter(Boolean).join(', ') : '',
    website: b.url || '',
    summary: b.summary || '',
    photo: b.image || '',
  }

  if (Array.isArray(b.profiles)) {
    b.profiles.forEach((pr) => {
      const net = (pr.network || '').toLowerCase()
      if (net.includes('linkedin')) personal.linkedin = pr.url
      if (net.includes('github')) personal.github = pr.url
    })
  }

  const experience = Array.isArray(json.work)
    ? json.work.map((w) => ({
        role: w.position || '',
        company: w.name || '',
        location: w.location || '',
        startDate: w.startDate || '',
        endDate: w.endDate || '',
        current: !w.endDate || w.endDate.toLowerCase() === 'present',
        bullets: Array.isArray(w.highlights) ? w.highlights : w.summary ? [w.summary] : [],
      }))
    : []

  const education = Array.isArray(json.education)
    ? json.education.map((edu) => ({
        institution: edu.institution || '',
        degree: [edu.studyType, edu.area].filter(Boolean).join(' in '),
        field: edu.area || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
        gpa: edu.score || '',
        highlights: Array.isArray(edu.courses) ? edu.courses : [],
      }))
    : []

  const projects = Array.isArray(json.projects)
    ? json.projects.map((pr) => ({
        title: pr.name || '',
        description: pr.description || '',
        link: pr.url || '',
        techStack: Array.isArray(pr.keywords) ? pr.keywords : [],
        bullets: Array.isArray(pr.highlights) ? pr.highlights : [],
      }))
    : []

  const skills = Array.isArray(json.skills)
    ? json.skills.flatMap((s) => {
        const cat = s.name || 'General'
        if (Array.isArray(s.keywords) && s.keywords.length) {
          return s.keywords.map((kw) => ({ name: kw, category: cat, level: s.level || 'Proficient' }))
        }
        return [{ name: cat, category: 'General', level: s.level || 'Proficient' }]
      })
    : []

  const certifications = Array.isArray(json.certificates)
    ? json.certificates.map((c) => ({
        name: c.name || '',
        issuer: c.issuer || '',
        year: c.date || '',
        url: c.url || '',
      }))
    : []

  return {
    personal,
    experience,
    education,
    projects,
    skills,
    certifications,
    customSections: [],
    sectionOrder: ['education', 'experience', 'projects', 'skills', 'certifications'],
  }
}

/**
 * Structured Resume Data to JSON Resume Format
 */
export function structuredToJsonResume(resumeData) {
  const d = resumeData || {}
  const p = d.personal || {}

  const profiles = []
  if (p.linkedin) profiles.push({ network: 'LinkedIn', url: p.linkedin })
  if (p.github) profiles.push({ network: 'GitHub', url: p.github })

  return {
    basics: {
      name: p.name || '',
      label: p.title || '',
      image: p.photo || '',
      email: p.email || '',
      phone: p.phone || '',
      url: p.website || '',
      summary: p.summary || '',
      location: { address: p.location || '' },
      profiles,
    },
    work: (d.experience || []).map((e) => ({
      name: e.company || '',
      position: e.role || '',
      startDate: e.startDate || '',
      endDate: e.endDate || '',
      highlights: e.bullets || [],
    })),
    education: (d.education || []).map((edu) => ({
      institution: edu.institution || '',
      area: edu.field || '',
      studyType: edu.degree || '',
      score: edu.gpa || '',
    })),
    skills: (d.skills || []).map((s) => ({
      name: s.name || s,
      level: s.level || 'Proficient',
    })),
    projects: (d.projects || []).map((pr) => ({
      name: pr.title || '',
      description: pr.description || '',
      highlights: pr.bullets || [],
      keywords: pr.techStack || [],
      url: pr.link || '',
    })),
    certificates: (d.certifications || []).map((c) => ({
      name: c.name || '',
      issuer: c.issuer || '',
      date: c.year || '',
      url: c.url || '',
    })),
  }
}

export default {
  markdownToStructured,
  structuredToMarkdown,
  jsonResumeToStructured,
  structuredToJsonResume,
  normalizeHeaderTitle,
}
