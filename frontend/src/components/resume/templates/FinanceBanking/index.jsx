import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'

/**
 * FinanceBanking — credentials-heavy header (CFA, Series 7). Single-column
 * with a Deal Book / Transactions block.
 */
export default function FinanceBanking() {
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
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: '10.5pt',
        lineHeight: 1.5,
      }}
    >
      <header style={{ borderBottom: '2pt solid #1f2937', paddingBottom: '5mm', marginBottom: '6mm' }}>
        <h1 style={{ margin: 0, fontSize: '24pt', fontWeight: 700, color: '#0f172a' }}>
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <div style={{ marginTop: '1mm', fontSize: '12pt', color: '#1f2937', fontStyle: 'italic' }}>
            {personal.title}
          </div>
        )}
        <div style={{ marginTop: '3mm', fontSize: '9.5pt', color: '#475569', display: 'flex', flexWrap: 'wrap', gap: '1mm 5mm' }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>· {personal.phone}</span>}
          {personal.location && <span>· {personal.location}</span>}
          {personal.linkedin && <span>· {personal.linkedin}</span>}
        </div>
      </header>

      <Section title="Licenses & Designations" accent="#1f2937">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1mm 4mm', fontSize: '10pt' }}>
          <span><strong>CFA</strong> · Level III Candidate</span>
          <span>· <strong>Series 7</strong> General Securities</span>
          <span>· <strong>Series 63</strong> Uniform State</span>
          <span>· <strong>Series 79</strong> Investment Banking</span>
        </div>
      </Section>

      {personal.summary && (
        <Section title="Summary" accent="#1f2937">
          <p style={{ margin: 0, textAlign: 'justify' }}>{personal.summary}</p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Transaction Experience" accent="#1f2937">
          {experience.map((e, i) => (
            <div key={i} style={{ marginBottom: '5mm' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: '11pt', color: '#0f172a' }}>{e.role}</strong>
                {e.period && <span style={{ fontSize: '10pt', color: '#64748b', fontStyle: 'italic' }}>{e.period}</span>}
              </div>
              <div style={{ fontSize: '10.5pt', color: '#1f2937', fontStyle: 'italic' }}>
                {[e.company, e.location].filter(Boolean).join(', ')}
              </div>
              {e.bullets.length > 0 && (
                <ul style={{ margin: '1.5mm 0 0', paddingLeft: '5mm', color: '#0f172a' }}>
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
        <Section title="Education" accent="#1f2937">
          {education.map((e, i) => (
            <div key={i} style={{ marginBottom: '2mm' }}>
              <strong>{e.degree}</strong> · {e.institution}
              {e.period && <span style={{ color: '#64748b' }}> · {e.period}</span>}
            </div>
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Technical Proficiencies" accent="#1f2937">
          <div style={{ color: '#0f172a', lineHeight: 1.7 }}>{skills.map((s) => s.name).join(' · ')}</div>
        </Section>
      )}

      {certifications.length > 0 && (
        <Section title="Additional Certifications" accent="#1f2937">
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
