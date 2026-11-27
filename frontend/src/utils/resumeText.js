// resumeText.js — flatten a resume (text or structured doc) into plain text
// for the AI endpoints (tailor, cover letter, email generator, interviews).

/** Convert a structured resume document (ResumeContext shape) to plain text. */
export function structuredResumeToText(doc = {}) {
  const out = [];
  const p = doc.personal || {};
  const header = [p.name, p.title].filter(Boolean).join(' — ');
  if (header) out.push(header);
  const contact = [p.email, p.phone, p.location, p.website, p.linkedin, p.github].filter(Boolean).join(' | ');
  if (contact) out.push(contact);
  if (p.summary || doc.summary) out.push(`\nSUMMARY\n${p.summary || doc.summary}`);

  if (Array.isArray(doc.experience) && doc.experience.length) {
    out.push('\nEXPERIENCE');
    for (const e of doc.experience) {
      out.push([e.role, e.company, e.period, e.location].filter(Boolean).join(' | '));
      for (const b of e.bullets || []) out.push(`- ${b}`);
    }
  }
  if (Array.isArray(doc.education) && doc.education.length) {
    out.push('\nEDUCATION');
    for (const e of doc.education) {
      out.push([e.degree || e.field, e.school || e.institution, e.period || e.year].filter(Boolean).join(' | '));
    }
  }
  if (Array.isArray(doc.skills) && doc.skills.length) {
    const names = doc.skills.map((s) => (typeof s === 'string' ? s : s.name)).filter(Boolean);
    if (names.length) out.push(`\nSKILLS\n${names.join(', ')}`);
  }
  if (Array.isArray(doc.projects) && doc.projects.length) {
    out.push('\nPROJECTS');
    for (const pr of doc.projects) {
      out.push([pr.title, (pr.techStack || []).join(', ')].filter(Boolean).join(' | '));
      if (pr.description) out.push(`- ${pr.description}`);
    }
  }
  if (Array.isArray(doc.certifications) && doc.certifications.length) {
    out.push('\nCERTIFICATIONS');
    for (const c of doc.certifications) out.push(`- ${typeof c === 'string' ? c : [c.name, c.issuer, c.year].filter(Boolean).join(' | ')}`);
  }
  return out.join('\n').trim();
}

/**
 * Best-effort plain text for any resume row: prefer stored text
 * (enhancedText/originalText), fall back to serializing the structured doc.
 */
export function resumeDocToText(resume) {
  if (!resume) return '';
  const stored = resume.enhancedText || resume.enhanced_text || resume.originalText || resume.original_text;
  if (stored && String(stored).trim().length > 80) return String(stored);
  return structuredResumeToText(resume.data || resume);
}
