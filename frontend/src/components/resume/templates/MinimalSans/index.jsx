import { useResume } from '../../../../context/ResumeContext'

/**
 * Minimal Sans — clean, generous-whitespace single-column resume.
 *
 * Sans-serif (Helvetica) with thin dividers and a calm blue accent.
 * Designed for startups, product roles, and modern design-forward companies.
 */
export default function MinimalSans() {
  const { personal, experience, education, projects, skills, certifications } =
    useResume()

  return (
    <div
      className="resume-export-root"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '22mm 22mm',
        background: '#ffffff',
        color: '#1e293b',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: '10pt',
        lineHeight: 1.55,
      }}
    >
      {/* ── Header ── */}
      <header style={{ marginBottom: '10mm' }}>
        <h1
          style={{
            margin: 0,
            fontSize: '32pt',
            fontWeight: 200,
            letterSpacing: '-1px',
            color: '#0f172a',
          }}
        >
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <p
            style={{
              margin: '2mm 0 4mm',
              fontSize: '12pt',
              fontWeight: 400,
              color: '#2563eb',
              letterSpacing: '0.5px',
            }}
          >
            {personal.title}
          </p>
        )}
        <div
          style={{
            fontSize: '9pt',
            color: '#64748b',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1mm 5mm',
          }}
        >
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.website && <span>{personal.website}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
          {personal.github && <span>{personal.github}</span>}
        </div>
      </header>

      <Divider />

      {personal.summary && (
        <Section title="About">
          <p style={{ margin: 0, color: '#475569' }}>{personal.summary}</p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Experience">
          {experience.map((e, i) => (
            <article key={i} style={{ marginBottom: '6mm' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ margin: 0, fontSize: '11pt', fontWeight: 600, color: '#0f172a' }}>
                  {e.role}
                </h3>
                {e.period && (
                  <span style={{ fontSize: '9pt', color: '#94a3b8', fontWeight: 300 }}>
                    {e.period}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '10pt', color: '#2563eb', marginBottom: '2mm' }}>
                {e.company}
                {e.location && <span style={{ color: '#94a3b8', fontWeight: 300 }}>  ·  {e.location}</span>}
              </div>
              {e.bullets.length > 0 && (
                <ul style={{ margin: 0, paddingLeft: '4mm', color: '#475569' }}>
                  {e.bullets.map((b, j) => (
                    <li key={j} style={{ marginBottom: '1.5mm' }}>{b}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </Section>
      )}

      <Divider />

      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((p, i) => (
            <article key={i} style={{ marginBottom: '5mm' }}>
              <h3 style={{ margin: 0, fontSize: '11pt', fontWeight: 600, color: '#0f172a' }}>
                {p.title}
              </h3>
              {p.description && (
                <p style={{ margin: '1.5mm 0', color: '#475569' }}>{p.description}</p>
              )}
              {p.techStack.length > 0 && (
                <div style={{ fontSize: '8.5pt', color: '#94a3b8', letterSpacing: '0.5px' }}>
                  {p.techStack.join('  ·  ')}
                </div>
              )}
            </article>
          ))}
        </Section>
      )}

      <Divider />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: skills.length > 0 && education.length > 0 ? '1fr 1fr' : '1fr',
          gap: '8mm',
        }}
      >
        {education.length > 0 && (
          <Section title="Education">
            {education.map((e, i) => (
              <div key={i} style={{ marginBottom: '3mm' }}>
                <div style={{ fontWeight: 600, color: '#0f172a' }}>{e.degree}</div>
                <div style={{ color: '#2563eb', fontSize: '9.5pt' }}>{e.institution}</div>
                <div style={{ color: '#94a3b8', fontSize: '8.5pt' }}>
                  {[e.period, e.location].filter(Boolean).join(' · ')}
                </div>
              </div>
            ))}
          </Section>
        )}

        {skills.length > 0 && (
          <Section title="Skills">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5mm' }}>
              {skills.map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 500 }}>{s.name}</span>
                  {s.level && (
                    <span style={{ fontSize: '8.5pt', color: '#94a3b8', fontWeight: 300 }}>
                      {s.level}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}
      </div>

      {certifications.length > 0 && (
        <>
          <Divider />
          <Section title="Certifications">
            {certifications.map((c, i) => (
              <div key={i} style={{ marginBottom: '2mm' }}>
                <span style={{ fontWeight: 500 }}>{c.name}</span>
                {c.issuer && <span style={{ color: '#94a3b8' }}>  ·  {c.issuer}</span>}
                {c.year && <span style={{ color: '#94a3b8' }}>  ·  {c.year}</span>}
              </div>
            ))}
          </Section>
        </>
      )}
    </div>
  )
}

function Divider() {
  return (
    <hr
      style={{
        border: 'none',
        borderTop: '0.5pt solid #cbd5e1',
        margin: '0 0 7mm',
      }}
    />
  )
}

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: '7mm' }}>
      <h2
        style={{
          fontSize: '9pt',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '3px',
          color: '#2563eb',
          margin: '0 0 3mm',
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}
