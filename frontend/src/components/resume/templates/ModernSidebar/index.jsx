import { useResume } from '../../../../context/ResumeContext'

/**
 * Modern Sidebar — two-column resume template.
 *
 * Left sidebar (accent color): contact, skills, education, certifications.
 * Right main: summary, experience, projects.
 *
 * Designed for multi-page A4 output. No fixed heights — sections flow
 * naturally across pages. Use .resume-export-root as the canvas root for
 * PDF export targeting.
 */
export default function ModernSidebar() {
  const { personal, experience, education, projects, skills, certifications } =
    useResume()

  const initials = (personal.name || 'U')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(s => s[0]?.toUpperCase())
    .join('')

  return (
    <div
      className="resume-export-root"
      style={{
        width: '210mm',
        minHeight: '297mm',
        background: '#ffffff',
        color: '#111827',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '10pt',
        lineHeight: 1.5,
        display: 'grid',
        gridTemplateColumns: '70mm 1fr',
      }}
    >
      {/* ─── Sidebar ─── */}
      <aside
        style={{
          background: '#0f766e',
          color: '#f0fdfa',
          padding: '14mm 10mm',
        }}
      >
        {/* Avatar circle */}
        <div
          style={{
            width: '36mm',
            height: '36mm',
            borderRadius: '50%',
            background: '#ccfbf1',
            color: '#0f766e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22pt',
            fontWeight: 700,
            margin: '0 auto 8mm',
          }}
        >
          {initials || '·'}
        </div>

        <SidebarSection title="Contact">
          <ContactLine label="Email" value={personal.email} />
          <ContactLine label="Phone" value={personal.phone} />
          <ContactLine label="Location" value={personal.location} />
          <ContactLine label="Website" value={personal.website} />
          <ContactLine label="LinkedIn" value={personal.linkedin} short />
          <ContactLine label="GitHub" value={personal.github} short />
        </SidebarSection>

        {skills.length > 0 && (
          <SidebarSection title="Skills">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3mm' }}>
              {skills.map((s, i) => (
                <div key={i}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: '9.5pt',
                      color: '#ffffff',
                    }}
                  >
                    {s.name}
                  </div>
                  {(s.level || s.category) && (
                    <div style={{ fontSize: '8.5pt', color: '#ccfbf1', opacity: 0.85 }}>
                      {[s.level, s.category].filter(Boolean).join(' · ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </SidebarSection>
        )}

        {education.length > 0 && (
          <SidebarSection title="Education">
            {education.map((e, i) => (
              <div key={i} style={{ marginBottom: '3mm' }}>
                <div style={{ fontWeight: 600, color: '#ffffff' }}>{e.degree}</div>
                <div style={{ fontSize: '9pt', color: '#ccfbf1' }}>{e.institution}</div>
                <div style={{ fontSize: '8.5pt', color: '#ccfbf1', opacity: 0.85 }}>
                  {[e.period, e.location].filter(Boolean).join(' · ')}
                </div>
                {e.description && (
                  <div style={{ fontSize: '9pt', color: '#f0fdfa', marginTop: '1mm' }}>
                    {e.description}
                  </div>
                )}
              </div>
            ))}
          </SidebarSection>
        )}

        {certifications.length > 0 && (
          <SidebarSection title="Certifications">
            {certifications.map((c, i) => (
              <div key={i} style={{ marginBottom: '3mm' }}>
                <div style={{ fontWeight: 600, color: '#ffffff' }}>{c.name}</div>
                <div style={{ fontSize: '9pt', color: '#ccfbf1' }}>
                  {[c.issuer, c.year].filter(Boolean).join(' · ')}
                </div>
              </div>
            ))}
          </SidebarSection>
        )}
      </aside>

      {/* ─── Main ─── */}
      <main style={{ padding: '14mm 12mm', color: '#111827' }}>
        <header style={{ marginBottom: '8mm' }}>
          <h1
            style={{
              fontSize: '26pt',
              fontWeight: 700,
              margin: 0,
              letterSpacing: '-0.5px',
              color: '#0f172a',
            }}
          >
            {personal.name || 'Your Name'}
          </h1>
          {personal.title && (
            <p
              style={{
                fontSize: '13pt',
                color: '#0f766e',
                margin: '2mm 0 0',
                fontWeight: 500,
              }}
            >
              {personal.title}
            </p>
          )}
        </header>

        {personal.summary && (
          <Section title="Summary">
            <p style={{ margin: 0, color: '#374151' }}>{personal.summary}</p>
          </Section>
        )}

        {experience.length > 0 && (
          <Section title="Experience">
            {experience.map((e, i) => (
              <article key={i} style={{ marginBottom: '5mm' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ margin: 0, fontSize: '11pt', fontWeight: 700, color: '#0f172a' }}>
                    {e.role || 'Role'}
                  </h3>
                  {e.period && (
                    <span style={{ fontSize: '9pt', color: '#6b7280', whiteSpace: 'nowrap' }}>
                      {e.period}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '10pt', color: '#0f766e', fontWeight: 600 }}>
                  {[e.company, e.location].filter(Boolean).join(' · ')}
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
          </Section>
        )}

        {projects.length > 0 && (
          <Section title="Projects">
            {projects.map((p, i) => (
              <article key={i} style={{ marginBottom: '4mm' }}>
                <h3 style={{ margin: 0, fontSize: '10.5pt', fontWeight: 700, color: '#0f172a' }}>
                  {p.title || 'Project'}
                </h3>
                {p.description && (
                  <p style={{ margin: '1mm 0', color: '#374151' }}>{p.description}</p>
                )}
                {p.techStack.length > 0 && (
                  <div style={{ fontSize: '9pt', color: '#0f766e', fontWeight: 600 }}>
                    {p.techStack.join(' · ')}
                  </div>
                )}
              </article>
            ))}
          </Section>
        )}
      </main>
    </div>
  )
}

function SidebarSection({ title, children }) {
  return (
    <section style={{ marginBottom: '7mm' }}>
      <h2
        style={{
          fontSize: '10pt',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          color: '#ccfbf1',
          margin: '0 0 3mm',
          paddingBottom: '1.5mm',
          borderBottom: '0.5pt solid #14b8a6',
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: '7mm' }}>
      <h2
        style={{
          fontSize: '11pt',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '2px',
          color: '#0f766e',
          margin: '0 0 3mm',
          paddingBottom: '1mm',
          borderBottom: '1pt solid #ccfbf1',
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

function ContactLine({ label, value, short }) {
  if (!value) return null
  // Strip protocol for cleaner display
  const display = short
    ? value.replace(/^https?:\/\//, '').replace(/^www\./, '')
    : value
  return (
    <div style={{ marginBottom: '2.5mm', fontSize: '9pt', lineHeight: 1.35 }}>
      <div
        style={{
          fontSize: '7.5pt',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          color: '#ccfbf1',
          opacity: 0.7,
        }}
      >
        {label}
      </div>
      <div style={{ color: '#ffffff', wordBreak: 'break-word' }}>{display}</div>
    </div>
  )
}
