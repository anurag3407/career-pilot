import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'

/**
 * AttorneyBrief — legal CV with Bar Admissions and Practice Areas blocks.
 * Single-column, conservative serif, dense metadata.
 */
export default function AttorneyBrief() {
  const { personal, experience, education, certifications } = useResume()

  return (
    <div
      className="resume-export-root"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '16mm 20mm',
        background: '#ffffff',
        color: '#111827',
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: '10pt',
        lineHeight: 1.5,
      }}
    >
      <header style={{ textAlign: 'center', marginBottom: '6mm' }}>
        <h1 style={{ margin: 0, fontSize: '24pt', fontWeight: 700, letterSpacing: '1.5px' }}>
          {personal.name || 'Your Name'}
        </h1>
        <div style={{ marginTop: '1mm', fontSize: '11pt', color: '#1f2937', fontStyle: 'italic' }}>
          {personal.title}
        </div>
        <div style={{ marginTop: '2mm', fontSize: '9pt', color: '#374151', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1mm 5mm' }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>· {personal.phone}</span>}
          {personal.location && <span>· {personal.location}</span>}
          {personal.linkedin && <span>· {personal.linkedin}</span>}
        </div>
      </header>

      <hr style={{ border: 'none', borderTop: '1pt solid #111827', margin: '0 0 5mm' }} />

      {personal.summary && (
        <Section title="Profile" accent="#111827">
          <p style={{ margin: 0, textAlign: 'justify' }}>{personal.summary}</p>
        </Section>
      )}

      <Section title="Bar Admissions" accent="#111827">
        <div style={{ fontSize: '10pt', lineHeight: 1.7 }}>
          <div>· State Bar of California (Active, since 2018)</div>
          <div>· U.S. District Court, Northern District of California</div>
          <div>· U.S. Court of Appeals, Ninth Circuit</div>
        </div>
      </Section>

      <Section title="Practice Areas" accent="#111827">
        <div style={{ fontSize: '10pt', lineHeight: 1.7 }}>
          <div>· Corporate Law · Mergers & Acquisitions · Securities Regulation</div>
          <div>· Commercial Contracts · Employment Law · Privacy & Data Protection</div>
        </div>
      </Section>

      {experience.length > 0 && (
        <Section title="Experience" accent="#111827">
          {experience.map((e, i) => (
            <div key={i} style={{ marginBottom: '5mm' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: '11pt' }}>{e.role}</strong>
                {e.period && <span style={{ fontStyle: 'italic', color: '#374151', fontSize: '9.5pt' }}>{e.period}</span>}
              </div>
              <div style={{ fontSize: '10pt', color: '#1f2937', fontStyle: 'italic' }}>
                {[e.company, e.location].filter(Boolean).join(', ')}
              </div>
              {e.bullets.length > 0 && (
                <ul style={{ margin: '1.5mm 0 0', paddingLeft: '5mm' }}>
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
        <Section title="Education" accent="#111827">
          {education.map((e, i) => (
            <div key={i} style={{ marginBottom: '3mm' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: '11pt' }}>{e.institution}</strong>
                {e.period && <span style={{ fontStyle: 'italic', color: '#374151' }}>{e.period}</span>}
              </div>
              <div style={{ fontStyle: 'italic', color: '#1f2937' }}>{e.degree}</div>
              {e.description && <div style={{ fontSize: '9.5pt', color: '#6b7280', marginTop: '1mm' }}>{e.description}</div>}
            </div>
          ))}
        </Section>
      )}

      {certifications.length > 0 && (
        <Section title="Honors & Awards" accent="#111827">
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
