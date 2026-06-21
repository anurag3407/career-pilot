import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'

/**
 * Hospitality — languages and service-period emphasis. Hotels, F&B, chefs.
 */
export default function Hospitality() {
  const { personal, experience, education, skills, certifications } = useResume()

  return (
    <div
      className="resume-export-root"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '14mm 18mm',
        background: '#ffffff',
        color: '#1f2937',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '10pt',
        lineHeight: 1.5,
      }}
    >
      <header style={{ borderBottom: '1pt solid #fbcfe8', paddingBottom: '5mm', marginBottom: '6mm' }}>
        <h1 style={{ margin: 0, fontSize: '26pt', fontWeight: 700, color: '#1f2937', letterSpacing: '-0.5px' }}>
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <div style={{ marginTop: '1mm', fontSize: '12pt', color: '#be185d', fontWeight: 500 }}>
            {personal.title}
          </div>
        )}
        <div style={{ marginTop: '3mm', fontSize: '9.5pt', color: '#64748b', display: 'flex', flexWrap: 'wrap', gap: '1mm 5mm' }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>· {personal.phone}</span>}
          {personal.location && <span>· {personal.location}</span>}
          {personal.linkedin && <span>· {personal.linkedin}</span>}
        </div>
      </header>

      <Section title="Languages" accent="#be185d">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1mm 4mm', fontSize: '10pt' }}>
          <span><strong>English</strong> · Native</span>
          <span>· <strong>Spanish</strong> · Fluent</span>
          <span>· <strong>French</strong> · Professional</span>
          <span>· <strong>Mandarin</strong> · Conversational</span>
        </div>
      </Section>

      {personal.summary && (
        <Section title="Profile" accent="#be185d">
          <p style={{ margin: 0, color: '#334155' }}>{personal.summary}</p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Service History" accent="#be185d">
          {experience.map((e, i) => (
            <div key={i} style={{ marginBottom: '5mm' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: '11pt', color: '#1f2937' }}>{e.role}</strong>
                {e.period && <span style={{ fontSize: '9pt', color: '#64748b' }}>{e.period}</span>}
              </div>
              <div style={{ fontSize: '10pt', color: '#be185d', fontWeight: 500 }}>
                {[e.company, e.location].filter(Boolean).join(' · ')}
              </div>
              {e.bullets.length > 0 && (
                <ul style={{ margin: '1.5mm 0 0', paddingLeft: '5mm', color: '#334155' }}>
                  {e.bullets.map((b, j) => (
                    <li key={j} style={{ marginBottom: '0.5mm' }}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Specialties" accent="#be185d">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1mm' }}>
            {skills.map((s, i) => (
              <span key={i} style={{ fontSize: '9pt', padding: '0.5mm 2mm', background: '#fce7f3', color: '#9d174d', borderRadius: 12, fontWeight: 500 }}>
                {s.name}
              </span>
            ))}
          </div>
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education" accent="#be185d">
          {education.map((e, i) => (
            <div key={i} style={{ marginBottom: '2mm' }}>
              <strong>{e.degree}</strong> · {e.institution}
              {e.period && <span style={{ color: '#64748b' }}> · {e.period}</span>}
            </div>
          ))}
        </Section>
      )}

      {certifications.length > 0 && (
        <Section title="Certifications" accent="#be185d">
          {certifications.map((c, i) => (
            <div key={i} style={{ marginBottom: '1.5mm' }}>
              <strong>{c.name}</strong>
              {c.issuer && <span> · {c.issuer}</span>}
              {c.year && <span style={{ color: '#64748b' }}> · {c.year}</span>}
            </div>
          ))}
        </Section>
      )}
    </div>
  )
}
