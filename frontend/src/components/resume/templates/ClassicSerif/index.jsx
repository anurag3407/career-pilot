import { useResume } from '../../../../context/ResumeContext'

/**
 * Classic Serif — single-column, traditional resume template.
 *
 * Serif typography (Georgia) with horizontal rules between sections.
 * Most ATS-friendly of the five — single column, semantic headings, no
 * unusual font metrics.
 */
export default function ClassicSerif() {
  const { personal, experience, education, projects, skills, certifications } =
    useResume()

  return (
    <div
      className="resume-export-root"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '18mm 18mm',
        background: '#ffffff',
        color: '#1f2937',
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: '10.5pt',
        lineHeight: 1.5,
      }}
    >
      {/* ── Header ── */}
      <header style={{ textAlign: 'center', marginBottom: '8mm' }}>
        <h1
          style={{
            margin: 0,
            fontSize: '28pt',
            fontWeight: 700,
            letterSpacing: '1px',
            color: '#111827',
          }}
        >
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <p
            style={{
              margin: '2mm 0 4mm',
              fontSize: '13pt',
              fontStyle: 'italic',
              color: '#374151',
            }}
          >
            {personal.title}
          </p>
        )}
        <div
          style={{
            fontSize: '9.5pt',
            color: '#374151',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '2mm 6mm',
          }}
        >
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>· {personal.phone}</span>}
          {personal.location && <span>· {personal.location}</span>}
          {personal.website && <span>· {personal.website}</span>}
          {personal.linkedin && <span>· {personal.linkedin}</span>}
          {personal.github && <span>· {personal.github}</span>}
        </div>
      </header>

      <hr style={ruleStyle} />

      {personal.summary && (
        <Section title="Summary">
          <p style={{ margin: 0, textAlign: 'justify' }}>{personal.summary}</p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Experience">
          {experience.map((e, i) => (
            <article key={i} style={{ marginBottom: '5mm' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ margin: 0, fontSize: '12pt', fontWeight: 700 }}>
                  {e.role || 'Role'}
                </h3>
                {e.period && (
                  <span style={{ fontSize: '10pt', color: '#374151', fontStyle: 'italic' }}>
                    {e.period}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '10.5pt', fontStyle: 'italic', color: '#1f2937', marginBottom: '1.5mm' }}>
                {[e.company, e.location].filter(Boolean).join(', ')}
              </div>
              {e.bullets.length > 0 && (
                <ul style={{ margin: '1mm 0 0', paddingLeft: '6mm' }}>
                  {e.bullets.map((b, j) => (
                    <li key={j} style={{ marginBottom: '1mm' }}>{b}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education">
          {education.map((e, i) => (
            <article key={i} style={{ marginBottom: '4mm' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ margin: 0, fontSize: '11.5pt', fontWeight: 700 }}>
                  {e.institution || 'Institution'}
                </h3>
                {e.period && (
                  <span style={{ fontSize: '10pt', color: '#374151', fontStyle: 'italic' }}>
                    {e.period}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '10.5pt', fontStyle: 'italic' }}>
                {[e.degree, e.location].filter(Boolean).join(', ')}
              </div>
              {e.description && (
                <p style={{ margin: '1mm 0 0', color: '#374151' }}>{e.description}</p>
              )}
            </article>
          ))}
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((p, i) => (
            <article key={i} style={{ marginBottom: '4mm' }}>
              <h3 style={{ margin: 0, fontSize: '11.5pt', fontWeight: 700 }}>{p.title}</h3>
              {p.description && <p style={{ margin: '1mm 0' }}>{p.description}</p>}
              {p.techStack.length > 0 && (
                <p style={{ margin: '1mm 0 0', fontSize: '9.5pt', fontStyle: 'italic', color: '#374151' }}>
                  {p.techStack.join(' · ')}
                </p>
              )}
            </article>
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1mm 4mm' }}>
            {skills.map((s, i) => (
              <span key={i} style={{ fontSize: '10pt' }}>
                <strong>{s.name}</strong>
                {s.level && <span style={{ color: '#6b7280' }}> ({s.level})</span>}
                {i < skills.length - 1 && <span style={{ color: '#9ca3af' }}> · </span>}
              </span>
            ))}
          </div>
        </Section>
      )}

      {certifications.length > 0 && (
        <Section title="Certifications">
          {certifications.map((c, i) => (
            <div key={i} style={{ marginBottom: '2mm' }}>
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

const ruleStyle = {
  border: 'none',
  borderTop: '1.5pt solid #111827',
  margin: '0 0 5mm',
}

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: '6mm' }}>
      <h2
        style={{
          fontSize: '12pt',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '2.5px',
          textAlign: 'center',
          margin: '0 0 3mm',
          color: '#111827',
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}
