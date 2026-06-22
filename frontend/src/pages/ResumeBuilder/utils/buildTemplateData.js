/**
 * Builds the `builderData` payload handed off to /resume-templates
 * when the user clicks "Choose Resume Template".
 */
export function buildTemplateData({
  targetRole, personal, phoneCode, phoneDigits,
  experience, education, projects, skills,
  sectionOrder, customSections,
}) {
  const fullPhone = (phoneCode && phoneDigits) ? `${phoneCode} ${phoneDigits}` : (personal?.phone || '')

  return {
    targetRole,
    personal: { ...personal, phone: fullPhone },
    experience: (experience || []).filter(e => e.title || e.company)
      .map(e => ({
        role: e.title,
        company: e.company,
        period: [e.startDate, e.current ? 'Present' : e.endDate]
          .filter(Boolean).join(' – ') || undefined,
        location: e.location,
        description: e.description,
      })),
    education: (education || []).filter(e => e.school || e.degree)
      .map(e => ({
        degree: e.degree,
        institution: e.school,
        period: [e.startDate, e.endDate].filter(Boolean).join(' – ') || undefined,
        location: e.location,
        description: e.field,
      })),
    projects: (projects || []).filter(p => p.name).map(p => ({
      title: p.name,
      description: p.description,
      techStack: p.tech ? p.tech.split(',').map(s => s.trim()).filter(Boolean) : [],
      link: p.link,
    })),
    skills: skills ? skills.split(/[,\n]/).map(s => s.trim()).filter(Boolean) : [],
    sectionOrder,
    customSections: (customSections || []).filter(s => s.title),
  }
}
