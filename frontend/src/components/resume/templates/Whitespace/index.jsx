import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'
import ProjectCard from '../../shared/ProjectCard'

/**
 * Whitespace — luxury minimal layout. Extra-wide margins, oversized name,
 * calm typography. Reserved for design-forward companies and boutique
 * studios.
 */
export default function Whitespace() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

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

      {personal.summary && (
        <Section title="Profile" accent="#0f172a" variant="plain" headingSize="10pt">
          <p style={{ margin: 0, fontStyle: 'italic', color: '#374151', fontSize: '11pt' }}>
            {personal.summary}
          </p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Experience" accent="#0f172a">
          {experience.map((e, i) => (
            <div key={i} style={{ marginBottom: '6mm' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ margin: 0, fontSize: '12pt', fontWeight: 700, color: '#0f172a' }}>{e.role}</h3>
                {e.period && <span style={{ fontSize: '9pt', color: '#94a3b8', fontWeight: 300 }}>{e.period}</span>}
              </div>
              <div style={{ fontSize: '10pt', color: '#64748b', marginBottom: '2mm' }}>
                {[e.company, e.location].filter(Boolean).join(' · ')}
              </div>
              {e.bullets.length > 0 && (
                <ul style={{ margin: 0, paddingLeft: '5mm', color: '#374151' }}>
                  {e.bullets.map((b, j) => (
                    <li key={j} style={{ marginBottom: '1mm' }}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Projects" accent="#0f172a">
          {projects.map((p, i) => (
            <ProjectCard key={i} project={p} titleColor="#0f172a" descColor="#374151" techColor="#64748b" fontSize="10pt" />
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education" accent="#0f172a">
          {education.map((e, i) => (
            <div key={i} style={{ marginBottom: '3mm' }}>
              <strong style={{ fontSize: '11pt' }}>{e.degree}</strong> — {e.institution}
              {e.period && <span style={{ color: '#94a3b8', marginLeft: '2mm' }}>({e.period})</span>}
            </div>
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills" accent="#0f172a">
          <div style={{ color: '#374151', fontSize: '10pt', lineHeight: 1.7 }}>
            {skills.map((s) => s.name).join(' · ')}
          </div>
        </Section>
      )}

      {certifications.length > 0 && (
        <Section title="Certifications" accent="#0f172a">
          {certifications.map((c, i) => (
            <div key={i} style={{ marginBottom: '1.5mm', fontSize: '10pt' }}>
              <strong>{c.name}</strong>
              {c.issuer && <span> · {c.issuer}</span>}
              {c.year && <span style={{ color: '#94a3b8' }}> · {c.year}</span>}
            </div>
          ))}
        </Section>
      )}
    </div>
  )
}
