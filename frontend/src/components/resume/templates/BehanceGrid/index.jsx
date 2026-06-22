import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'

/**
 * BehanceGrid — project thumbnails in a 2x2 grid. Visual-first for
 * illustrators and visual designers.
 */
export default function BehanceGrid() {
  const { personal, experience, education, projects, skills } = useResume()

  // Pad projects to fill 4 grid cells, then tile in a 2x2 layout
  const gridItems = []
  for (let i = 0; i < Math.max(4, projects.length); i += 1) {
    const p = projects[i]
    gridItems.push(p || { title: '—', description: '' })
  }

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
      }}
    >
      {/* ── Header ── */}
      <header style={{ padding: '12mm 16mm 6mm' }}>
        <h1 style={{ margin: 0, fontSize: '28pt', fontWeight: 700, color: '#1f2937', letterSpacing: '-0.5px' }}>
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <div style={{ marginTop: '1mm', fontSize: '12pt', color: '#7c3aed', fontWeight: 500 }}>
            {personal.title}
          </div>
        )}
        <div style={{ marginTop: '3mm', fontSize: '9pt', color: '#64748b', display: 'flex', flexWrap: 'wrap', gap: '1mm 5mm' }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>· {personal.phone}</span>}
          {personal.location && <span>· {personal.location}</span>}
          {personal.website && <span>· {personal.website}</span>}
          {personal.linkedin && <span>· {personal.linkedin}</span>}
        </div>
      </header>

      {/* ── Project grid ── */}
      {projects.length > 0 && (
        <section style={{ padding: '0 16mm 6mm' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3mm' }}>
            {gridItems.slice(0, 4).map((p, i) => {
              // Pseudo-random hue based on index for the placeholder swatch
              const hues = ['#7c3aed', '#ec4899', '#f59e0b', '#10b981']
              const hue = hues[i % hues.length]
              return (
                <article
                  key={i}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: 6,
                    overflow: 'hidden',
                    background: '#ffffff',
                  }}
                >
                  <div
                    style={{
                      height: '38mm',
                      background: `linear-gradient(135deg, ${hue}33 0%, ${hue}aa 100%)`,
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: '24pt',
                      fontWeight: 700,
                    }}
                  >
                    {(p.title || '·').charAt(0).toUpperCase()}
                  </div>
                  <div style={{ padding: '3mm' }}>
                    <h3 style={{ margin: 0, fontSize: '10.5pt', fontWeight: 700, color: '#1f2937' }}>
                      {p.title}
                    </h3>
                    {p.description && (
                      <p style={{ margin: '1mm 0 0', fontSize: '9pt', color: '#6b7280', lineHeight: 1.4 }}>
                        {p.description.slice(0, 100)}{p.description.length > 100 ? '…' : ''}
                      </p>
                    )}
                    {p.techStack && p.techStack.length > 0 && (
                      <div style={{ marginTop: '1mm', fontSize: '8pt', color: '#7c3aed' }}>
                        {p.techStack.join(' · ')}
                      </div>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}

      <div style={{ padding: '0 16mm 12mm', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8mm' }}>
        {experience.length > 0 && (
          <Section title="Experience" accent="#7c3aed">
            {experience.map((e, i) => (
              <div key={i} style={{ marginBottom: '3mm' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ fontSize: '10.5pt' }}>{e.role}</strong>
                  {e.period && <span style={{ fontSize: '9pt', color: '#6b7280' }}>{e.period}</span>}
                </div>
                <div style={{ color: '#7c3aed', fontSize: '9.5pt' }}>
                  {[e.company, e.location].filter(Boolean).join(' · ')}
                </div>
                {e.bullets.length > 0 && (
                  <ul style={{ margin: '1mm 0 0', paddingLeft: '5mm', color: '#374151' }}>
                    {e.bullets.slice(0, 3).map((b, j) => (
                      <li key={j} style={{ marginBottom: '0.5mm', fontSize: '9.5pt' }}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </Section>
        )}

        <div>
          {personal.summary && (
            <Section title="About" accent="#7c3aed">
              <p style={{ margin: 0, color: '#374151' }}>{personal.summary}</p>
            </Section>
          )}

          {skills.length > 0 && (
            <Section title="Skills" accent="#7c3aed">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1mm' }}>
                {skills.map((s, i) => (
                  <span key={i} style={{ fontSize: '8.5pt', padding: '0.5mm 2mm', background: '#ede9fe', color: '#5b21b6', borderRadius: 12, fontWeight: 500 }}>
                    {s.name}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {education.length > 0 && (
            <Section title="Education" accent="#7c3aed">
              {education.map((e, i) => (
                <div key={i} style={{ marginBottom: '2mm' }}>
                  <strong>{e.degree}</strong>
                  <div style={{ color: '#7c3aed', fontSize: '9pt' }}>{e.institution}</div>
                  <div style={{ color: '#6b7280', fontSize: '8.5pt' }}>{e.period}</div>
                </div>
              ))}
            </Section>
          )}
        </div>
      </div>
    </div>
  )
}
