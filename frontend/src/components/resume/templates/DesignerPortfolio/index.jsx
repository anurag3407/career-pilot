import { useResume } from '../../../../context/ResumeContext'

/**
 * DesignerPortfolio — visual-forward resume template for designers and
 * creative roles. Large accent band, project showcase, link-rich.
 */
export default function DesignerPortfolio() {
  const { personal, experience, education, projects, skills, certifications } =
    useResume()

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
      {/* ── Hero band ── */}
      <header
        style={{
          background: 'linear-gradient(135deg, #db2777 0%, #be185d 60%, #9d174d 100%)',
          color: '#ffffff',
          padding: '18mm 18mm 14mm',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '36pt', fontWeight: 700, letterSpacing: '-1px', lineHeight: 1 }}>
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <p style={{ margin: '3mm 0 0', fontSize: '14pt', fontWeight: 300, color: '#fce7f3' }}>
            {personal.title}
          </p>
        )}
        <div style={{ marginTop: '5mm', display: 'flex', flexWrap: 'wrap', gap: '1mm 6mm', fontSize: '9pt', color: '#fce7f3' }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span style={{ opacity: 0.8 }}>·</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.website && <span style={{ opacity: 0.8 }}>·</span>}
          {personal.website && <span>{personal.website}</span>}
          {personal.linkedin && <span style={{ opacity: 0.8 }}>·</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
        </div>
      </header>

      <div style={{ padding: '8mm 18mm 10mm', display: 'grid', gridTemplateColumns: '1fr 70mm', gap: '8mm' }}>
        {/* ── Left: experience + skills ── */}
        <main>
          {personal.summary && (
            <p style={{ margin: '0 0 7mm', fontSize: '11pt', color: '#374151', lineHeight: 1.6 }}>
              {personal.summary}
            </p>
          )}

          {experience.length > 0 && (
            <section style={{ marginBottom: '7mm' }}>
              <h2 style={sectionHeadingStyle}>Experience</h2>
              {experience.map((e, i) => (
                <article key={i} style={{ marginBottom: '5mm' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h3 style={{ margin: 0, fontSize: '11pt', fontWeight: 700, color: '#831843' }}>
                      {e.role}
                    </h3>
                    {e.period && (
                      <span style={{ fontSize: '9pt', color: '#9ca3af' }}>{e.period}</span>
                    )}
                  </div>
                  <div style={{ fontSize: '10pt', color: '#be185d', fontWeight: 500 }}>
                    {e.company}{e.location ? ` · ${e.location}` : ''}
                  </div>
                  {e.bullets.length > 0 && (
                    <ul style={{ margin: '2mm 0 0', paddingLeft: '5mm', color: '#374151' }}>
                      {e.bullets.map((b, j) => (
                        <li key={j} style={{ marginBottom: '1mm' }}>{b}</li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </section>
          )}

          {education.length > 0 && (
            <section style={{ marginBottom: '7mm' }}>
              <h2 style={sectionHeadingStyle}>Education</h2>
              {education.map((e, i) => (
                <div key={i} style={{ marginBottom: '2mm' }}>
                  <strong>{e.degree}</strong> — {e.institution}
                  {e.period && <span style={{ color: '#9ca3af' }}> · {e.period}</span>}
                </div>
              ))}
            </section>
          )}

          {certifications.length > 0 && (
            <section>
              <h2 style={sectionHeadingStyle}>Certifications</h2>
              {certifications.map((c, i) => (
                <div key={i} style={{ marginBottom: '2mm' }}>
                  <strong>{c.name}</strong>
                  {c.issuer && <span> · {c.issuer}</span>}
                  {c.year && <span style={{ color: '#9ca3af' }}> · {c.year}</span>}
                </div>
              ))}
            </section>
          )}
        </main>

        {/* ── Right: skills + projects ── */}
        <aside>
          {skills.length > 0 && (
            <section style={{ marginBottom: '7mm' }}>
              <h2 style={sectionHeadingStyle}>Skills</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2mm' }}>
                {skills.map((s, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '9pt',
                      padding: '1mm 3mm',
                      background: '#fdf2f8',
                      color: '#be185d',
                      border: '1px solid #fce7f3',
                      borderRadius: 12,
                      fontWeight: 500,
                    }}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {projects.length > 0 && (
            <section style={{ marginBottom: '7mm' }}>
              <h2 style={sectionHeadingStyle}>Projects</h2>
              {projects.map((p, i) => (
                <article
                  key={i}
                  style={{
                    marginBottom: '4mm',
                    padding: '3mm',
                    background: '#fdf2f8',
                    borderRadius: 6,
                    border: '1px solid #fbcfe8',
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: '10.5pt', fontWeight: 700, color: '#831843' }}>
                    {p.title}
                  </h3>
                  {p.description && (
                    <p style={{ margin: '1mm 0', fontSize: '9pt', color: '#374151' }}>{p.description}</p>
                  )}
                  {p.techStack.length > 0 && (
                    <div style={{ fontSize: '8pt', color: '#be185d', marginBottom: '1mm' }}>
                      {p.techStack.join(' · ')}
                    </div>
                  )}
                  {p.link && (
                    <a
                      href={p.link}
                      style={{
                        fontSize: '8.5pt',
                        color: '#be185d',
                        textDecoration: 'underline',
                        wordBreak: 'break-all',
                      }}
                    >
                      {p.link}
                    </a>
                  )}
                </article>
              ))}
            </section>
          )}
        </aside>
      </div>
    </div>
  )
}

const sectionHeadingStyle = {
  fontSize: '9pt',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '2px',
  color: '#be185d',
  margin: '0 0 3mm',
  paddingBottom: '1mm',
  borderBottom: '1pt solid #fbcfe8',
}
