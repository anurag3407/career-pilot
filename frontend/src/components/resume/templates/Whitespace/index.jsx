import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'
import ProjectCard from '../../shared/ProjectCard'
import OrderedSections from '../../shared/OrderedSections'

/**
 * Whitespace — luxury minimal layout. Extra-wide margins, oversized name,
 * calm typography. Reserved for design-forward companies and boutique
 * studios.
 */
export default function Whitespace() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

  const nodes = {
    summary: personal.summary ? (
      <Section title="Profile" accent="#0f172a" variant="plain" headingSize="10pt" uppercase={false}>
        <p style={{ margin: 0, fontStyle: 'italic', color: '#374151', fontSize: '11pt' }}>
          {personal.summary}
        </p>
      </Section>
    ) : null,

    experience: experience.length > 0 ? (
      <Section title="Experience" accent="#0f172a" uppercase={false}>
        {experience.map((e, i) => (
          <ExperienceRow
            key={i}
            exp={e}
            roleColor="#0f172a"
            companyColor="#64748b"
            periodColor="#94a3b8"
            bulletColor="#374151"
            fontSize="10pt"
          />
        ))}
      </Section>
    ) : null,

    projects: projects.length > 0 ? (
      <Section title="Projects" accent="#0f172a" uppercase={false}>
        {projects.map((p, i) => (
          <ProjectCard
            key={i}
            project={p}
            titleColor="#0f172a"
            descColor="#374151"
            techColor="#64748b"
            fontSize="10pt"
          />
        ))}
      </Section>
    ) : null,

    education: education.length > 0 ? (
      <Section title="Education" accent="#0f172a" uppercase={false}>
        {education.map((e, i) => (
          <div key={i} style={{ marginBottom: '3mm' }}>
            <strong style={{ fontSize: '11pt' }}>{e.degree}</strong> — {e.institution}
            {e.period && <span style={{ color: '#94a3b8', marginLeft: '2mm' }}>({e.period})</span>}
          </div>
        ))}
      </Section>
    ) : null,

    skills: skills.length > 0 ? (
      <Section title="Skills" accent="#0f172a" uppercase={false}>
        <div style={{ color: '#374151', fontSize: '10pt', lineHeight: 1.7 }}>
          {skills.map((s) => s.name).join(' · ')}
        </div>
      </Section>
    ) : null,

    certifications: certifications.length > 0 ? (
      <Section title="Certifications" accent="#0f172a" uppercase={false}>
        {certifications.map((c, i) => (
          <div key={i} style={{ marginBottom: '1.5mm', fontSize: '10pt' }}>
            <strong>{c.name}</strong>
            {c.issuer && <span> · {c.issuer}</span>}
            {c.year && <span style={{ color: '#94a3b8' }}> · {c.year}</span>}
          </div>
        ))}
      </Section>
    ) : null,
  }

  return (
    <div
      className="resume-export-root"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '32mm 36mm',
        background: '#ffffff',
        color: '#1f2937',
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: '10.5pt',
        lineHeight: 1.6,
      }}
    >
      {/* ── Header (fixed) ── */}
      <header style={{ marginBottom: '14mm' }}>
        <h1 style={{ margin: 0, fontSize: '40pt', fontWeight: 400, letterSpacing: '-1.5px', color: '#0f172a', lineHeight: 1 }}>
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <p style={{ margin: '4mm 0 0', fontSize: '13pt', color: '#64748b', fontWeight: 300 }}>
            {personal.title}
          </p>
        )}
        <div
          style={{
            marginTop: '5mm',
            fontSize: '9pt',
            color: '#94a3b8',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2mm 6mm',
          }}
        >
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.website && <span>{personal.website}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
        </div>
      </header>

      {/* ── Body sections (drag-and-drop order honored here) ── */}
      <OrderedSections
        nodes={nodes}
        sectionProps={{ accent: '#0f172a', uppercase: false }}
        customBodyStyle={{ color: '#374151' }}
      />
    </div>
  )
}