/**
 * Pure function: turns the wizard's form state into the markdown
 * representation used for preview and for the resumeApi.create() call.
 * No component state needed — everything comes in as arguments.
 */
export function generateMarkdown({
  personal, phoneCode, phoneDigits,
  education, experience, projects, skills, sectionOrder, customSections = [],
}) {
  const fullPhone = phoneDigits ? `${phoneCode} ${phoneDigits}` : ''
  let md = `# ${personal.name || 'Your Name'}\n\n`

  const contact = []
  if (personal.email)     contact.push(`[${personal.email}](mailto:${personal.email})`)
  if (fullPhone)          contact.push(fullPhone)
  if (personal.linkedin)  contact.push(`[LinkedIn](${personal.linkedin})`)
  if (personal.github)    contact.push(`[GitHub](${personal.github})`)
  if (personal.portfolio) contact.push(`[Portfolio](${personal.portfolio})`)
  if (contact.length > 0) md += `${contact.join(' | ')}\n\n`

  if (personal.summary) md += `## SUMMARY\n\n${personal.summary}\n\n`

  const renderSection = (section) => {
    let sectionMd = ''
    if (section === 'education' && education.some(e => e.school)) {
      sectionMd += `## EDUCATION\n\n`
      education.forEach(e => {
        if (!e.school) return
        sectionMd += `**${e.degree}${e.field ? ' in ' + e.field : ''}** | ${e.school} | ${e.startDate} - ${e.endDate}\n`
        if (e.gpa) sectionMd += `- GPA: ${e.gpa}\n`
        if (e.description) sectionMd += `- ${e.description}\n`
        sectionMd += '\n'
      })
    } else if (section === 'experience' && experience.some(e => e.title)) {
      sectionMd += `## EXPERIENCE\n\n`
      experience.forEach(e => {
        if (!e.title) return
        sectionMd += `**${e.title}** | ${e.company} | ${e.location} | ${e.startDate} - ${e.current ? 'Present' : e.endDate}\n`
        const bullets = (e.description || '').split('\n').filter(b => b.trim())
        bullets.forEach(b => { sectionMd += `- ${b.replace(/^- /, '').trim()}\n` })
        sectionMd += '\n'
      })
    } else if (section === 'projects' && projects.some(p => p.name)) {
      sectionMd += `## PROJECTS\n\n`
      projects.forEach(p => {
        if (!p.name) return
        sectionMd += `**${p.name}** | ${p.tech}\n`
        const bullets = (p.description || '').split('\n').filter(b => b.trim())
        bullets.forEach(b => { sectionMd += `- ${b.replace(/^- /, '').trim()}\n` })
        if (p.link) sectionMd += `- [Project Link](${p.link})\n`
        sectionMd += '\n'
      })
    } else if (section === 'skills' && skills) {
      sectionMd += `## SKILLS\n\n${skills}\n\n`
    }
    return sectionMd
  }

  sectionOrder.forEach(section => {
    md += renderSection(section)
  })

  customSections.forEach(section => {
    if (!section.title?.trim()) return
    md += `## ${section.title.toUpperCase()}\n\n`
    if (section.content) md += `${section.content}\n\n`
  })

  return md
}
