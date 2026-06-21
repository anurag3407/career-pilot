import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'
import Avatar from '../../shared/Avatar'

/**
 * PhotoElegant — circular photo top-left, single-column. Subtle personal
 * brand without being aggressive.
 */
export default function PhotoElegant() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

  return (
    <div
      className="resume-export-root"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '18mm 20mm',
        background: '#ffffff',
        color: '#0f172a',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '10pt',
        lineHeight: 1.5,
      }}
    >
      <header
        style={{
          display: 'grid',
          gridTemplateColumns: '34mm 1fr',
          gap: '8mm',
          alignItems: 'center',
          marginBottom: '7mm',
          paddingBottom: '5mm',
          borderBottom: '1pt solid #ccfbf1',
        }}
      >
        <Avatar sizeMm={32} accent="#0f766e" bg="#ccfbf1" fontSize="16pt" />
        <div>
          <h1 style={{ margin: 0, fontSize: '26pt', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.5px' }}>
            {personal.name || 'Your Name'}
          </h1>
          {personal.title && (
            <div style={{ marginTop: '2mm', fontSize: '12pt', color: '#0f766e', fontWeight: 500 }}>
              {personal.title}
            </div>
          )}
          <div style={{ marginTop: '3mm', fontSize: '9.5pt', color: '#64748b', display: 'flex', flexWrap: 'wrap', gap: '1mm 5mm' }}>
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>· {personal.phone}</span>}
            {personal.location && <span>· {personal.location}</span>}
            {personal.website && <span>· {personal.website}</span>}
            {personal.linkedin && <span>· {personal.linkedin}</span>}
          </div>
        </div>
      </header>

      {personal.summary && (
        <Section title="Summary" accent="#0f766e">
          <p style={{ margin: 0, color: '#334155' }}>{personal.summary}</p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Experience" accent="#0f766e">
          {experience.map((e, i) => (
            <ExperienceRow
              key={i}
              exp={e}
              roleColor="#0f172a"
              companyColor="#0f766e"
              periodColor="#6b7280"
              bulletColor="#334155"
              fontSize="10pt"
            />
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education" accent="#0f766e">
          {education.map((e, i) => (
            <div key={i} style={{ marginBottom: '2mm' }}>
              <strong>{e.degree}</strong> · {e.institution}
              {e.period && <span style={{ color: '#6b7280' }}> · {e.period}</span>}
            </div>
          ))}
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Projects" accent="#0f766e">
          {projects.map((p, i) => (
            <div key={i} style={{ marginBottom: '3mm' }}>
              <strong>{p.title}</strong>
              {p.description && <div style={{ color: '#334155' }}>{p.description}</div>}
              {p.techStack.length > 0 && (
                <div style={{ color: '#0f766e', fontSize: '8.5pt' }}>{p.techStack.join(' · ')}</div>
              )}
            </div>
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills" accent="#0f766e">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1mm' }}>
            {skills.map((s, i) => (
              <span key={i} style={{ fontSize: '9pt', padding: '0.5mm 2mm', background: '#ccfbf1', color: '#0f766e', borderRadius: 12, fontWeight: 500 }}>
                {s.name}
              </span>
            ))}
          </div>
        </Section>
      )}

      {certifications.length > 0 && (
        <Section title="Certifications" accent="#0f766e">
          {certifications.map((c, i) => (
            <div key={i} style={{ marginBottom: '1.5mm' }}>
              <strong>{c.name}</strong>
              {c.issuer && <span> · {c.issuer}</span>}
              {c.year && <span style={{ color: '#6b7280' }}> · {c.year}</span>}
            </div>
          ))}
        </Section>
      )}
    </div>
  )
}
