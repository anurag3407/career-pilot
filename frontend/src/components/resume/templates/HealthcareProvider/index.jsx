import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'

/**
 * HealthcareProvider — DEA, NPI and board certifications up top. MDs,
 * PAs, NPs.
 */
export default function HealthcareProvider() {
  const { personal, experience, education, skills, certifications } = useResume()

  return (
    <div
      className="resume-export-root"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '14mm 18mm',
        background: '#ffffff',
        color: '#0f172a',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: '10pt',
        lineHeight: 1.5,
      }}
    >
      <header style={{ borderBottom: '2pt solid #0f766e', paddingBottom: '5mm', marginBottom: '6mm' }}>
        <h1 style={{ margin: 0, fontSize: '24pt', fontWeight: 700, color: '#0f172a' }}>
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <div style={{ marginTop: '1mm', fontSize: '12pt', color: '#0f766e', fontWeight: 500 }}>
            {personal.title}
          </div>
        )}
        <div style={{ marginTop: '2mm', fontSize: '9.5pt', color: '#475569', display: 'flex', flexWrap: 'wrap', gap: '1mm 5mm' }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>· {personal.phone}</span>}
          {personal.location && <span>· {personal.location}</span>}
          {personal.linkedin && <span>· {personal.linkedin}</span>}
        </div>
      </header>

      <Section title="DEA, NPI & Board Certifications" accent="#0f766e">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1mm 8mm', fontSize: '10pt' }}>
          <div><strong>NPI:</strong> 1234567890</div>
          <div><strong>DEA:</strong> BS1234567 (Active)</div>
          <div><strong>State License:</strong> MD, CA (Active)</div>
          <div><strong>Board Certification:</strong> American Board of Internal Medicine</div>
        </div>
      </Section>

      {personal.summary && (
        <Section title="Clinical Summary" accent="#0f766e">
          <p style={{ margin: 0, color: '#334155' }}>{personal.summary}</p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Clinical Experience" accent="#0f766e">
          {experience.map((e, i) => (
            <div key={i} style={{ marginBottom: '5mm' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: '11pt', color: '#0f172a' }}>{e.role}</strong>
                {e.period && <span style={{ fontSize: '9pt', color: '#64748b' }}>{e.period}</span>}
              </div>
              <div style={{ fontSize: '10pt', color: '#0f766e', fontWeight: 500 }}>
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

      {education.length > 0 && (
        <Section title="Education & Training" accent="#0f766e">
          {education.map((e, i) => (
            <div key={i} style={{ marginBottom: '2mm' }}>
              <strong>{e.degree}</strong> · {e.institution}
              {e.period && <span style={{ color: '#64748b' }}> · {e.period}</span>}
            </div>
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Procedural Skills" accent="#0f766e">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1mm 4mm' }}>
            {skills.map((s, i) => (
              <span key={i} style={{ fontSize: '9.5pt', color: '#0f766e' }}>
                {s.name}{i < skills.length - 1 ? ' · ' : ''}
              </span>
            ))}
          </div>
        </Section>
      )}

      {certifications.length > 0 && (
        <Section title="Additional Certifications" accent="#0f766e">
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
