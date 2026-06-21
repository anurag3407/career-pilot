import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'
import Avatar from '../../shared/Avatar'

/**
 * PhotoCorner — small photo in top-right corner, otherwise minimal.
 * Subtle personal brand.
 */
export default function PhotoCorner() {
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
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: '10pt',
        lineHeight: 1.5,
      }}
    >
      <header style={{ position: 'relative', marginBottom: '8mm', paddingBottom: '5mm', borderBottom: '1pt solid #dbeafe' }}>
        <Avatar
          sizeMm={24}
          accent="#2563eb"
          bg="#dbeafe"
          fontSize="12pt"
          style={{ position: 'absolute', top: 0, right: 0 }}
        />
        <h1 style={{ margin: 0, fontSize: '26pt', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.5px', paddingRight: '30mm' }}>
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <div style={{ marginTop: '2mm', fontSize: '12pt', color: '#2563eb', fontWeight: 500 }}>
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
      </header>

      {personal.summary && (
        <Section title="Summary" accent="#2563eb">
          <p style={{ margin: 0, color: '#334155' }}>{personal.summary}</p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Experience" accent="#2563eb">
          {experience.map((e, i) => (
            <ExperienceRow
              key={i}
              exp={e}
              roleColor="#0f172a"
              companyColor="#2563eb"
              periodColor="#6b7280"
              bulletColor="#334155"
              fontSize="10pt"
            />
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education" accent="#2563eb">
          {education.map((e, i) => (
            <div key={i} style={{ marginBottom: '2mm' }}>
              <strong>{e.degree}</strong> · {e.institution}
              {e.period && <span style={{ color: '#6b7280' }}> · {e.period}</span>}
            </div>
          ))}
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Projects" accent="#2563eb">
          {projects.map((p, i) => (
            <div key={i} style={{ marginBottom: '3mm' }}>
              <strong>{p.title}</strong>
              {p.description && <div style={{ color: '#334155' }}>{p.description}</div>}
              {p.techStack.length > 0 && (
                <div style={{ color: '#2563eb', fontSize: '8.5pt' }}>{p.techStack.join(' · ')}</div>
              )}
            </div>
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills" accent="#2563eb">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1mm' }}>
            {skills.map((s, i) => (
              <span key={i} style={{ fontSize: '9pt', padding: '0.5mm 2mm', background: '#dbeafe', color: '#1e40af', borderRadius: 12, fontWeight: 500 }}>
                {s.name}
              </span>
            ))}
          </div>
        </Section>
      )}

      {certifications.length > 0 && (
        <Section title="Certifications" accent="#2563eb">
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
