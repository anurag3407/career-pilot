import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'

/**
 * MilitaryVeteran — MOS, rank and route structure. Single-column.
 */
export default function MilitaryVeteran() {
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
      <header style={{ borderBottom: '3pt solid #047857', paddingBottom: '5mm', marginBottom: '6mm' }}>
        <h1 style={{ margin: 0, fontSize: '24pt', fontWeight: 700, color: '#0f172a' }}>
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <div style={{ marginTop: '1mm', fontSize: '12pt', color: '#047857', fontWeight: 600 }}>
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

      <Section title="Military Profile" accent="#047857">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1mm 8mm', fontSize: '10pt' }}>
          <div><strong>Branch:</strong> U.S. Army</div>
          <div><strong>Rank:</strong> Staff Sergeant (E-6)</div>
          <div><strong>MOS:</strong> 25B — Information Technology Specialist</div>
          <div><strong>Years of Service:</strong> 8 (2014-2022)</div>
          <div><strong>Discharge:</strong> Honorable</div>
          <div><strong>Security Clearance:</strong> Secret (active)</div>
        </div>
      </Section>

      {personal.summary && (
        <Section title="Objective" accent="#047857">
          <p style={{ margin: 0, color: '#334155' }}>{personal.summary}</p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Military & Civilian Experience" accent="#047857">
          {experience.map((e, i) => (
            <div key={i} style={{ marginBottom: '5mm' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: '11pt', color: '#0f172a' }}>{e.role}</strong>
                {e.period && <span style={{ fontSize: '9pt', color: '#64748b' }}>{e.period}</span>}
              </div>
              <div style={{ fontSize: '10pt', color: '#047857', fontWeight: 500 }}>
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
        <Section title="Military & Technical Skills" accent="#047857">
          <div style={{ color: '#334155' }}>{skills.map((s) => s.name).join(' · ')}</div>
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education & Training" accent="#047857">
          {education.map((e, i) => (
            <div key={i} style={{ marginBottom: '2mm' }}>
              <strong>{e.degree}</strong> · {e.institution}
              {e.period && <span style={{ color: '#64748b' }}> · {e.period}</span>}
            </div>
          ))}
        </Section>
      )}

      {certifications.length > 0 && (
        <Section title="Awards & Certifications" accent="#047857">
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
