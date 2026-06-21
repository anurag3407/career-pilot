import { useResume } from '../../../../context/ResumeContext'

/**
 * Executive Band — premium single-column layout with a full-width colored
 * header band and elegant section headings. Conveys seniority and polish.
 *
 * Designed for senior engineers, managers, and executives.
 */
export default function ExecutiveBand() {
  const { personal, experience, education, projects, skills, certifications } =
    useResume()

  return (
    <div
      className="resume-export-root"
      style={{
        width: '210mm',
        minHeight: '297mm',
        background: '#ffffff',
        color: '#1c1917',
        fontFamily: '"Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif',
        fontSize: '10.5pt',
        lineHeight: 1.5,
      }}
    >
      {/* ── Header Band ── */}
      <header
        style={{
          background: '#7f1d1d',
          backgroundImage:
            'linear-gradient(135deg, #7f1d1d 0%, #991b1b 60%, #b91c1c 100%)',
          color: '#fef2f2',
          padding: '14mm 18mm 12mm',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: '30pt',
            fontWeight: 700,
            letterSpacing: '-0.5px',
            lineHeight: 1.05,
            color: '#ffffff',
          }}
        >
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <p
            style={{
              margin: '3mm 0 0',
              fontSize: '13pt',
              fontStyle: 'italic',
              fontWeight: 400,
              color: '#fecaca',
            }}
          >
            {personal.title}
          </p>
        )}
        <div
          style={{
            marginTop: '5mm',
            fontSize: '9.5pt',
            color: '#fee2e2',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1mm 6mm',
            alignItems: 'center',
          }}
        >
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <Dot />}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <Dot />}
          {personal.location && <span>{personal.location}</span>}
          {personal.website && <Dot />}
          {personal.website && <span>{personal.website}</span>}
          {personal.linkedin && <Dot />}
          {personal.linkedin && <span>{personal.linkedin}</span>}
          {personal.github && <Dot />}
          {personal.github && <span>{personal.github}</span>}
        </div>
      </header>

      <div style={{ padding: '10mm 18mm 12mm' }}>
        {personal.summary && (
          <Section title="Executive Summary">
            <p style={{ margin: 0, color: '#1c1917', fontSize: '10.5pt' }}>
              {personal.summary}
            </p>
          </Section>
        )}

        {experience.length > 0 && (
          <Section title="Professional Experience">
            {experience.map((e, i) => (
              <article key={i} style={{ marginBottom: '6mm' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ margin: 0, fontSize: '12pt', fontWeight: 700, color: '#7f1d1d' }}>
                    {e.role}
                  </h3>
                  {e.period && (
                    <span style={{ fontSize: '9.5pt', color: '#7f1d1d', fontStyle: 'italic' }}>
                      {e.period}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '10.5pt', fontStyle: 'italic', color: '#44403c', marginBottom: '2mm' }}>
                  {[e.company, e.location].filter(Boolean).join(', ')}
                </div>
                {e.bullets.length > 0 && (
                  <ul style={{ margin: 0, paddingLeft: '5mm', color: '#1c1917' }}>
                    {e.bullets.map((b, j) => (
                      <li key={j} style={{ marginBottom: '1.5mm' }}>{b}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </Section>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              skills.length > 0 && education.length > 0 ? '1fr 1fr' : '1fr',
            gap: '8mm',
          }}
        >
          {education.length > 0 && (
            <Section title="Education">
              {education.map((e, i) => (
                <div key={i} style={{ marginBottom: '4mm' }}>
                  <div style={{ fontWeight: 700, color: '#7f1d1d' }}>{e.degree}</div>
                  <div style={{ fontStyle: 'italic' }}>{e.institution}</div>
                  <div style={{ fontSize: '9pt', color: '#78716c' }}>
                    {[e.period, e.location].filter(Boolean).join(' · ')}
                  </div>
                  {e.description && (
                    <p style={{ margin: '1.5mm 0 0', color: '#1c1917', fontSize: '9.5pt' }}>
                      {e.description}
                    </p>
                  )}
                </div>
              ))}
            </Section>
          )}

          {skills.length > 0 && (
            <Section title="Core Competencies">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2mm' }}>
                {skills.map((s, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '9.5pt',
                      padding: '1mm 3mm',
                      border: '0.5pt solid #fecaca',
                      borderRadius: '1mm',
                      color: '#7f1d1d',
                      background: '#fef2f2',
                    }}
                  >
                    <strong>{s.name}</strong>
                    {s.level && <span style={{ fontSize: '8pt', color: '#9f1239' }}> · {s.level}</span>}
                  </span>
                ))}
              </div>
            </Section>
          )}
        </div>

        {projects.length > 0 && (
          <Section title="Selected Projects">
            {projects.map((p, i) => (
              <article key={i} style={{ marginBottom: '4mm' }}>
                <h3 style={{ margin: 0, fontSize: '11pt', fontWeight: 700, color: '#7f1d1d' }}>
                  {p.title}
                </h3>
                {p.description && <p style={{ margin: '1.5mm 0', color: '#1c1917' }}>{p.description}</p>}
                {p.techStack.length > 0 && (
                  <div style={{ fontSize: '9pt', fontStyle: 'italic', color: '#78716c' }}>
                    {p.techStack.join(' · ')}
                  </div>
                )}
              </article>
            ))}
          </Section>
        )}

        {certifications.length > 0 && (
          <Section title="Certifications">
            <ul style={{ margin: 0, paddingLeft: '5mm', color: '#1c1917' }}>
              {certifications.map((c, i) => (
                <li key={i} style={{ marginBottom: '1.5mm' }}>
                  <strong>{c.name}</strong>
                  {c.issuer && <span> — {c.issuer}</span>}
                  {c.year && <span style={{ color: '#78716c' }}> ({c.year})</span>}
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    </div>
  )
}

function Dot() {
  return (
    <span style={{ color: '#fecaca', opacity: 0.6 }}>•</span>
  )
}

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: '8mm' }}>
      <h2
        style={{
          fontSize: '11pt',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '2px',
          color: '#7f1d1d',
          margin: '0 0 3mm',
          paddingBottom: '1.5mm',
          borderBottom: '1pt solid #fecaca',
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}
