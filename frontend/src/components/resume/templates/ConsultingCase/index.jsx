import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'

/**
 * ConsultingCase — Case Studies instead of Experience. Each case has a
 * client, problem, approach, and outcome.
 */
export default function ConsultingCase() {
  const { personal, experience, education, skills, certifications } = useResume()

  // Re-shape experience into "Case Studies" — extract first bullet as the
  // outcome / metric, others as approach.
  const cases = experience.map((e) => {
    const bullets = e.bullets || []
    return {
      client: e.company,
      role: e.role,
      period: e.period,
      industry: e.location,
      outcome: bullets[0] || '',
      approach: bullets.slice(1),
    }
  })

  return (
    <div
      className="resume-export-root"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '16mm 20mm',
        background: '#ffffff',
        color: '#1f2937',
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: '10pt',
        lineHeight: 1.5,
      }}
    >
      <header style={{ textAlign: 'center', marginBottom: '7mm' }}>
        <h1 style={{ margin: 0, fontSize: '24pt', fontWeight: 700, color: '#1f2937', letterSpacing: '1px' }}>
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <div style={{ marginTop: '2mm', fontSize: '12pt', color: '#1f2937', fontStyle: 'italic' }}>
            {personal.title}
          </div>
        )}
        <div style={{ marginTop: '3mm', fontSize: '9.5pt', color: '#374151', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1mm 5mm' }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>· {personal.phone}</span>}
          {personal.location && <span>· {personal.location}</span>}
          {personal.linkedin && <span>· {personal.linkedin}</span>}
        </div>
      </header>

      <hr style={{ border: 'none', borderTop: '1pt solid #1f2937', margin: '0 0 5mm' }} />

      {personal.summary && (
        <Section title="Executive Summary" accent="#1f2937" variant="plain">
          <p style={{ margin: 0, textAlign: 'justify' }}>{personal.summary}</p>
        </Section>
      )}

      {cases.length > 0 && (
        <Section title="Case Studies" accent="#1f2937">
          {cases.map((c, i) => (
            <article key={i} style={{ marginBottom: '5mm', paddingBottom: '4mm', borderBottom: i === cases.length - 1 ? 'none' : '0.5pt solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1mm' }}>
                <strong style={{ fontSize: '11.5pt', color: '#1f2937' }}>{c.client}</strong>
                {c.period && <span style={{ fontSize: '10pt', color: '#6b7280', fontStyle: 'italic' }}>{c.period}</span>}
              </div>
              <div style={{ fontSize: '10pt', color: '#1f2937', marginBottom: '2mm' }}>
                <em>Role:</em> {c.role}{c.industry ? ` · <em>Industry:</em> ${c.industry}` : ''}
              </div>
              {c.outcome && (
                <div style={{ marginBottom: '1.5mm' }}>
                  <strong style={{ color: '#1f2937' }}>Outcome:</strong>{' '}
                  <span style={{ color: '#1f2937' }}>{c.outcome}</span>
                </div>
              )}
              {c.approach.length > 0 && (
                <div>
                  <strong style={{ color: '#1f2937' }}>Approach:</strong>
                  <ul style={{ margin: '1mm 0 0', paddingLeft: '5mm', color: '#1f2937' }}>
                    {c.approach.map((a, j) => (
                      <li key={j} style={{ marginBottom: '0.5mm' }}>{a}</li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Capabilities" accent="#1f2937">
          <div style={{ color: '#1f2937', lineHeight: 1.7 }}>
            {skills.map((s) => s.name).join(' · ')}
          </div>
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education" accent="#1f2937">
          {education.map((e, i) => (
            <div key={i} style={{ marginBottom: '2mm' }}>
              <strong>{e.institution}</strong> · {e.degree}
              {e.period && <span style={{ color: '#6b7280' }}> · {e.period}</span>}
            </div>
          ))}
        </Section>
      )}

      {certifications.length > 0 && (
        <Section title="Certifications" accent="#1f2937">
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
