import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'

/**
 * NurseClinical — clinical-skills matrix and certifications-heavy.
 * Single-column with a dedicated "Clinical Skills" grid section.
 */
export default function NurseClinical() {
  const { personal, experience, education, skills, certifications } = useResume()

  // Split skills into "Clinical" and "Soft" by category if provided, else
  // bucket first half as clinical.
  const half = Math.ceil(skills.length / 2)
  const clinicalSkills = skills.filter((s) => /clinical|patient|medic|nurs|ic|cath/i.test(s.name)).concat(skills.slice(0, half))
  const softSkills = skills.filter((s) => !/clinical|patient|medic|nurs|ic|cath/i.test(s.name)).concat(skills.slice(half))

  return (
    <div
      className="resume-export-root"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '14mm 16mm',
        background: '#ffffff',
        color: '#0f172a',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: '10pt',
        lineHeight: 1.5,
      }}
    >
      <header style={{ marginBottom: '6mm', paddingBottom: '4mm', borderBottom: '2pt solid #0f766e' }}>
        <h1 style={{ margin: 0, fontSize: '24pt', fontWeight: 700, color: '#0f766e' }}>
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <div style={{ marginTop: '1mm', fontSize: '12pt', color: '#0f172a', fontWeight: 500 }}>
            {personal.title}
          </div>
        )}
        <div style={{ marginTop: '2mm', fontSize: '9pt', color: '#475569', display: 'flex', flexWrap: 'wrap', gap: '1mm 5mm' }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>· {personal.phone}</span>}
          {personal.location && <span>· {personal.location}</span>}
          {personal.linkedin && <span>· {personal.linkedin}</span>}
        </div>
      </header>

      {personal.summary && (
        <Section title="Clinical Summary" accent="#0f766e">
          <p style={{ margin: 0, color: '#334155' }}>{personal.summary}</p>
        </Section>
      )}

      <Section title="Clinical Skills Matrix" accent="#0f766e">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1mm 6mm' }}>
          {clinicalSkills.map((s, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5pt', padding: '1mm 0', borderBottom: '0.5pt solid #ccfbf1' }}>
              <span style={{ fontWeight: 500 }}>{s.name}</span>
              {s.level && <span style={{ color: '#0f766e' }}>{s.level}</span>}
            </div>
          ))}
        </div>
      </Section>

      {experience.length > 0 && (
        <Section title="Clinical Experience" accent="#0f766e">
          {experience.map((e, i) => (
            <div key={i} style={{ marginBottom: '4mm' }}>
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
              {e.description && <div style={{ color: '#64748b', fontSize: '9pt' }}>{e.description}</div>}
            </div>
          ))}
        </Section>
      )}

      {certifications.length > 0 && (
        <Section title="Licenses & Certifications" accent="#0f766e">
          <ul style={{ margin: 0, paddingLeft: '5mm', color: '#0f172a' }}>
            {certifications.map((c, i) => (
              <li key={i} style={{ marginBottom: '0.5mm' }}>
                <strong>{c.name}</strong>
                {c.issuer && <span> · {c.issuer}</span>}
                {c.year && <span style={{ color: '#64748b' }}> · {c.year}</span>}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {softSkills.length > 0 && (
        <Section title="Additional Skills" accent="#0f766e">
          <div style={{ color: '#334155' }}>{softSkills.map((s) => s.name).join(' · ')}</div>
        </Section>
      )}
    </div>
  )
}
