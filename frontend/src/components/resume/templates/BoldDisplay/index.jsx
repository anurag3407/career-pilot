import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'

/**
 * BoldDisplay — oversized role title rotated 90° as a sidebar accent.
 * Maximum impact for design studios.
 */
export default function BoldDisplay() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

  return (
    <div
      className="resume-export-root"
      style={{
        width: '210mm',
        minHeight: '297mm',
        background: '#ffffff',
        color: '#1f2937',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '10pt',
        lineHeight: 1.5,
        display: 'grid',
        gridTemplateColumns: '32mm 1fr',
      }}
    >
      {/* ── Sidebar ── */}
      <aside
        style={{
          background: '#b91c1c',
          color: '#ffffff',
          padding: '14mm 4mm',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            fontSize: '32pt',
            fontWeight: 700,
            letterSpacing: '4px',
            textTransform: 'uppercase',
            color: '#ffffff',
            whiteSpace: 'nowrap',
            marginTop: '40mm',
          }}
        >
          {(personal.title || 'Creative Director').toUpperCase()}
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ padding: '14mm 18mm 12mm' }}>
        <header style={{ marginBottom: '8mm' }}>
          <h1 style={{ margin: 0, fontSize: '36pt', fontWeight: 700, color: '#1f2937', letterSpacing: '-1.5px', lineHeight: 1 }}>
            {personal.name || 'Your Name'}
          </h1>
          <div style={{ marginTop: '2mm', fontSize: '10pt', color: '#b91c1c', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>
            Portfolio · Resume
          </div>
          <div style={{ marginTop: '3mm', fontSize: '9pt', color: '#6b7280', display: 'flex', flexWrap: 'wrap', gap: '1mm 5mm' }}>
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>· {personal.phone}</span>}
            {personal.location && <span>· {personal.location}</span>}
            {personal.website && <span>· {personal.website}</span>}
            {personal.linkedin && <span>· {personal.linkedin}</span>}
          </div>
        </header>

        {personal.summary && (
          <Section title="Statement" accent="#b91c1c">
            <p style={{ margin: 0, fontSize: '11pt', color: '#1f2937', lineHeight: 1.6 }}>{personal.summary}</p>
          </Section>
        )}

        {experience.length > 0 && (
          <Section title="Experience" accent="#b91c1c">
            {experience.map((e, i) => (
              <article key={i} style={{ marginBottom: '5mm' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ margin: 0, fontSize: '11.5pt', fontWeight: 700, color: '#1f2937' }}>{e.role}</h3>
                  {e.period && <span style={{ fontSize: '9pt', color: '#9ca3af' }}>{e.period}</span>}
                </div>
                <div style={{ fontSize: '10pt', color: '#b91c1c', fontWeight: 600 }}>
                  {[e.company, e.location].filter(Boolean).join(' · ')}
                </div>
                {e.bullets.length > 0 && (
                  <ul style={{ margin: '1.5mm 0 0', paddingLeft: '5mm', color: '#374151' }}>
                    {e.bullets.map((b, j) => (
                      <li key={j} style={{ marginBottom: '0.7mm' }}>{b}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </Section>
        )}

        {projects.length > 0 && (
          <Section title="Projects" accent="#b91c1c">
            {projects.map((p, i) => (
              <div key={i} style={{ marginBottom: '3mm' }}>
                <strong>{p.title}</strong>
                {p.description && <div style={{ color: '#374151' }}>{p.description}</div>}
                {p.techStack.length > 0 && (
                  <div style={{ color: '#b91c1c', fontSize: '8.5pt', fontWeight: 500 }}>{p.techStack.join(' · ')}</div>
                )}
                {p.link && <div style={{ color: '#b91c1c', fontSize: '8.5pt' }}>{p.link}</div>}
              </div>
            ))}
          </Section>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: skills.length > 0 && education.length > 0 ? '1fr 1fr' : '1fr', gap: '8mm' }}>
          {skills.length > 0 && (
            <Section title="Skills" accent="#b91c1c">
              <div style={{ color: '#1f2937', lineHeight: 1.8 }}>{skills.map((s) => s.name).join(' · ')}</div>
            </Section>
          )}

          {education.length > 0 && (
            <Section title="Education" accent="#b91c1c">
              {education.map((e, i) => (
                <div key={i} style={{ marginBottom: '2mm' }}>
                  <strong>{e.degree}</strong>
                  <div style={{ color: '#b91c1c', fontSize: '9pt' }}>{e.institution}</div>
                  <div style={{ color: '#6b7280', fontSize: '8.5pt' }}>{e.period}</div>
                </div>
              ))}
            </Section>
          )}
        </div>

        {certifications.length > 0 && (
          <Section title="Certifications" accent="#b91c1c">
            {certifications.map((c, i) => (
              <div key={i} style={{ marginBottom: '1.5mm' }}>
                <strong>{c.name}</strong>
                {c.issuer && <span> · {c.issuer}</span>}
                {c.year && <span style={{ color: '#6b7280' }}> · {c.year}</span>}
              </div>
            ))}
          </Section>
        )}
      </main>
    </div>
  )
}
