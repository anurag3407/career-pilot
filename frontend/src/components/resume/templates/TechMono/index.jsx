import { useResume } from '../../../../context/ResumeContext'

/**
 * TechMono — engineer-friendly single-column resume template.
 *
 * Uses a monospace header block with terminal-like framing, technology
 * chips for skills, and tight, info-dense sections. Best for software
 * engineers.
 */
export default function TechMono() {
  const { personal, experience, education, projects, skills, certifications } =
    useResume()

  return (
    <div
      className="resume-export-root"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '14mm 16mm',
        background: '#0b1220',
        color: '#e2e8f0',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '10pt',
        lineHeight: 1.5,
      }}
    >
      {/* ── Header (terminal style) ── */}
      <header
        style={{
          background: '#020617',
          border: '1px solid #1e293b',
          borderRadius: 6,
          padding: '8mm 8mm 7mm',
          marginBottom: '7mm',
          fontFamily: '"SF Mono", Menlo, Consolas, monospace',
        }}
      >
        <div style={{ display: 'flex', gap: 6, marginBottom: '4mm' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
        </div>
        <div style={{ fontSize: '9pt', color: '#64748b' }}>$ whoami</div>
        <h1 style={{ margin: '1mm 0 0', fontSize: '22pt', fontWeight: 700, color: '#10b981' }}>
          {personal.name || 'your-name'}
        </h1>
        {personal.title && (
          <div style={{ marginTop: '1mm', fontSize: '11pt', color: '#94a3b8' }}>
            → {personal.title}
          </div>
        )}
        <div style={{ marginTop: '3mm', fontSize: '9pt', color: '#94a3b8', display: 'flex', flexWrap: 'wrap', gap: '1mm 5mm' }}>
          {personal.email && <span>✉ {personal.email}</span>}
          {personal.phone && <span>☎ {personal.phone}</span>}
          {personal.location && <span>⌂ {personal.location}</span>}
          {personal.github && <span>gh: {personal.github.replace(/^https?:\/\//, '')}</span>}
          {personal.linkedin && <span>in: {personal.linkedin.replace(/^https?:\/\//, '')}</span>}
          {personal.website && <span>↗ {personal.website.replace(/^https?:\/\//, '')}</span>}
        </div>
      </header>

      {personal.summary && (
        <Section title="// about">
          <p style={{ margin: 0, color: '#cbd5e1' }}>{personal.summary}</p>
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="// skills">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2mm' }}>
            {skills.map((s, i) => (
              <span
                key={i}
                style={{
                  fontFamily: '"SF Mono", Menlo, Consolas, monospace',
                  fontSize: '9pt',
                  padding: '1mm 3mm',
                  background: '#064e3b',
                  color: '#6ee7b7',
                  border: '1px solid #047857',
                  borderRadius: 3,
                }}
              >
                {s.name}
              </span>
            ))}
          </div>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="// experience">
          {experience.map((e, i) => (
            <article key={i} style={{ marginBottom: '5mm' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ margin: 0, fontSize: '11pt', fontWeight: 700, color: '#f1f5f9' }}>
                  {e.role || 'role'}
                </h3>
                {e.period && (
                  <span style={{ fontFamily: '"SF Mono", Menlo, Consolas, monospace', fontSize: '9pt', color: '#64748b' }}>
                    {e.period}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '10pt', color: '#10b981', fontFamily: '"SF Mono", Menlo, Consolas, monospace' }}>
                @{e.company}{e.location ? ` · ${e.location}` : ''}
              </div>
              {e.bullets.length > 0 && (
                <ul style={{ margin: '2mm 0 0', paddingLeft: '5mm', color: '#cbd5e1' }}>
                  {e.bullets.map((b, j) => (
                    <li key={j} style={{ marginBottom: '1mm' }}>{b}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="// projects">
          {projects.map((p, i) => (
            <article key={i} style={{ marginBottom: '4mm' }}>
              <h3 style={{ margin: 0, fontSize: '10.5pt', fontWeight: 700, color: '#f1f5f9' }}>
                {p.title || 'project'}
              </h3>
              {p.description && (
                <p style={{ margin: '1mm 0', color: '#cbd5e1' }}>{p.description}</p>
              )}
              {p.techStack.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1mm', marginTop: '1mm' }}>
                  {p.techStack.map(t => (
                    <span
                      key={t}
                      style={{
                        fontFamily: '"SF Mono", Menlo, Consolas, monospace',
                        fontSize: '8.5pt',
                        padding: '0.5mm 1.5mm',
                        background: '#1e293b',
                        color: '#94a3b8',
                        borderRadius: 3,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </Section>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6mm' }}>
        {education.length > 0 && (
          <Section title="// education">
            {education.map((e, i) => (
              <div key={i} style={{ marginBottom: '3mm' }}>
                <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{e.degree}</div>
                <div style={{ color: '#10b981', fontSize: '9.5pt', fontFamily: '"SF Mono", Menlo, Consolas, monospace' }}>
                  {e.institution}
                </div>
                <div style={{ color: '#64748b', fontSize: '8.5pt' }}>
                  {[e.period, e.location].filter(Boolean).join(' · ')}
                </div>
              </div>
            ))}
          </Section>
        )}

        {certifications.length > 0 && (
          <Section title="// certs">
            {certifications.map((c, i) => (
              <div key={i} style={{ marginBottom: '2mm', fontSize: '9.5pt' }}>
                <strong style={{ color: '#f1f5f9' }}>{c.name}</strong>
                {c.issuer && <span style={{ color: '#94a3b8' }}> · {c.issuer}</span>}
                {c.year && <span style={{ color: '#64748b' }}> ({c.year})</span>}
              </div>
            ))}
          </Section>
        )}
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: '6mm' }}>
      <h2
        style={{
          fontFamily: '"SF Mono", Menlo, Consolas, monospace',
          fontSize: '10pt',
          fontWeight: 700,
          color: '#10b981',
          margin: '0 0 3mm',
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}
