import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'

/**
 * BrutalistBold — black & white, thick rules, oversized type. Anti-design
 * for designers who don't want to look like designers.
 */
export default function BrutalistBold() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

  return (
    <div
      className="resume-export-root"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '14mm 18mm',
        background: '#ffffff',
        color: '#000000',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '10pt',
        lineHeight: 1.5,
      }}
    >
      <header style={{ marginBottom: '8mm', paddingBottom: '5mm', borderBottom: '4pt solid #000000' }}>
        <h1 style={{ margin: 0, fontSize: '40pt', fontWeight: 900, color: '#000000', letterSpacing: '-2px', lineHeight: 0.95, textTransform: 'uppercase' }}>
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <div style={{ marginTop: '4mm', fontSize: '14pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#000000' }}>
            {personal.title}
          </div>
        )}
        <div style={{ marginTop: '4mm', fontSize: '9pt', color: '#000000', display: 'flex', flexWrap: 'wrap', gap: '1mm 5mm', fontWeight: 600 }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>· {personal.phone}</span>}
          {personal.location && <span>· {personal.location}</span>}
          {personal.linkedin && <span>· {personal.linkedin}</span>}
          {personal.website && <span>· {personal.website}</span>}
        </div>
      </header>

      {personal.summary && (
        <section style={{ marginBottom: '7mm', paddingBottom: '5mm', borderBottom: '2pt solid #000000' }}>
          <h2 style={{ fontSize: '14pt', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', color: '#000000', margin: '0 0 2mm' }}>
            / Summary
          </h2>
          <p style={{ margin: 0, fontSize: '11pt', color: '#000000' }}>{personal.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section style={{ marginBottom: '7mm', paddingBottom: '5mm', borderBottom: '2pt solid #000000' }}>
          <h2 style={{ fontSize: '14pt', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', color: '#000000', margin: '0 0 4mm' }}>
            / Experience
          </h2>
          {experience.map((e, i) => (
            <div key={i} style={{ marginBottom: '5mm' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: '12pt', fontWeight: 900, textTransform: 'uppercase', color: '#000000' }}>{e.role}</strong>
                {e.period && <span style={{ fontSize: '9pt', fontWeight: 700, color: '#000000' }}>{e.period}</span>}
              </div>
              <div style={{ fontSize: '10pt', fontWeight: 600, color: '#000000', marginBottom: '1.5mm' }}>
                {e.company}{e.location ? ` · ${e.location}` : ''}
              </div>
              {e.bullets.length > 0 && (
                <ul style={{ margin: '1mm 0 0', paddingLeft: '5mm', color: '#000000' }}>
                  {e.bullets.map((b, j) => (
                    <li key={j} style={{ marginBottom: '0.7mm' }}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section style={{ marginBottom: '7mm', paddingBottom: '5mm', borderBottom: '2pt solid #000000' }}>
          <h2 style={{ fontSize: '14pt', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', color: '#000000', margin: '0 0 3mm' }}>
            / Skills
          </h2>
          <div style={{ fontSize: '10pt', fontWeight: 600, color: '#000000' }}>
            {skills.map((s, i) => (
              <span key={i}>
                {s.name.toUpperCase()}
                {i < skills.length - 1 && <span style={{ color: '#666666' }}> · </span>}
              </span>
            ))}
          </div>
        </section>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: education.length > 0 && projects.length > 0 ? '1fr 1fr' : '1fr', gap: '5mm' }}>
        {education.length > 0 && (
          <section>
            <h2 style={{ fontSize: '14pt', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', color: '#000000', margin: '0 0 3mm' }}>
              / Education
            </h2>
            {education.map((e, i) => (
              <div key={i} style={{ marginBottom: '2mm' }}>
                <strong style={{ fontWeight: 900, textTransform: 'uppercase' }}>{e.degree}</strong>
                <div style={{ fontSize: '10pt', fontWeight: 600 }}>{e.institution}</div>
                <div style={{ fontSize: '9pt', color: '#444444' }}>{e.period}</div>
              </div>
            ))}
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <h2 style={{ fontSize: '14pt', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', color: '#000000', margin: '0 0 3mm' }}>
              / Projects
            </h2>
            {projects.map((p, i) => (
              <div key={i} style={{ marginBottom: '3mm' }}>
                <strong style={{ fontWeight: 900, textTransform: 'uppercase' }}>{p.title}</strong>
                {p.description && <div style={{ color: '#000000' }}>{p.description}</div>}
                {p.techStack.length > 0 && (
                  <div style={{ fontSize: '8.5pt', color: '#666666', fontWeight: 600 }}>{p.techStack.join(' · ')}</div>
                )}
              </div>
            ))}
          </section>
        )}
      </div>

      {certifications.length > 0 && (
        <section style={{ marginTop: '5mm' }}>
          <h2 style={{ fontSize: '14pt', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '3px', color: '#000000', margin: '0 0 3mm' }}>
            / Certifications
          </h2>
          {certifications.map((c, i) => (
            <div key={i} style={{ marginBottom: '1.5mm' }}>
              <strong>{c.name.toUpperCase()}</strong>
              {c.issuer && <span> · {c.issuer.toUpperCase()}</span>}
              {c.year && <span style={{ color: '#444444' }}> · {c.year}</span>}
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
