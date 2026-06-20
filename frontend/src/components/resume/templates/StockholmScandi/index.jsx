import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'

/**
 * StockholmScandi — Scandinavian spacing and monochrome palette. Calm,
 * spacious, and timeless.
 */
export default function StockholmScandi() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

  return (
    <div
      className="resume-export-root"
      style={{
        width: '210mm',
        minHeight: '297mm',
        background: '#fafaf9',
        color: '#1c1917',
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: '10pt',
        lineHeight: 1.55,
        display: 'grid',
        gridTemplateColumns: '80mm 1fr',
      }}
    >
      {/* ── Sidebar ── */}
      <aside
        style={{
          background: '#f5f5f4',
          padding: '14mm 8mm',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '22pt', fontWeight: 400, color: '#1c1917', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <div style={{ marginTop: '2mm', fontSize: '11pt', color: '#57534e', fontStyle: 'italic' }}>
            {personal.title}
          </div>
        )}

        <SideTitle>Contact</SideTitle>
        <div style={{ fontSize: '9pt', color: '#1c1917', lineHeight: 1.7 }}>
          {personal.email && <div>{personal.email}</div>}
          {personal.phone && <div>{personal.phone}</div>}
          {personal.location && <div>{personal.location}</div>}
          {personal.website && <div>{personal.website}</div>}
          {personal.linkedin && <div>{personal.linkedin}</div>}
        </div>

        {skills.length > 0 && (
          <>
            <SideTitle>Skills</SideTitle>
            <div style={{ color: '#1c1917', lineHeight: 1.7, fontSize: '9.5pt' }}>
              {skills.map((s, i) => (
                <div key={i} style={{ marginBottom: '1mm' }}>
                  {s.name}
                  {s.level && <span style={{ color: '#78716c' }}> · {s.level}</span>}
                </div>
              ))}
            </div>
          </>
        )}

        {education.length > 0 && (
          <>
            <SideTitle>Education</SideTitle>
            {education.map((e, i) => (
              <div key={i} style={{ marginBottom: '2.5mm' }}>
                <strong style={{ fontSize: '9.5pt' }}>{e.degree}</strong>
                <div style={{ color: '#57534e', fontSize: '9pt', fontStyle: 'italic' }}>{e.institution}</div>
                <div style={{ color: '#78716c', fontSize: '8.5pt' }}>{e.period}</div>
              </div>
            ))}
          </>
        )}

        {certifications.length > 0 && (
          <>
            <SideTitle>Certifications</SideTitle>
            {certifications.map((c, i) => (
              <div key={i} style={{ marginBottom: '2mm' }}>
                <strong style={{ fontSize: '9pt' }}>{c.name}</strong>
                <div style={{ color: '#78716c', fontSize: '8.5pt' }}>
                  {[c.issuer, c.year].filter(Boolean).join(' · ')}
                </div>
              </div>
            ))}
          </>
        )}
      </aside>

      {/* ── Main ── */}
      <main style={{ padding: '14mm 12mm', background: '#fafaf9' }}>
        {personal.summary && (
          <Section title="Profile" accent="#1c1917" variant="plain">
            <p style={{ margin: 0, fontStyle: 'italic', color: '#1c1917' }}>{personal.summary}</p>
          </Section>
        )}

        {experience.length > 0 && (
          <Section title="Experience" accent="#1c1917">
            {experience.map((e, i) => (
              <div key={i} style={{ marginBottom: '5mm' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '11pt', color: '#1c1917' }}>{e.role}</strong>
                  {e.period && <span style={{ fontSize: '9pt', color: '#78716c', fontStyle: 'italic' }}>{e.period}</span>}
                </div>
                <div style={{ fontSize: '10pt', color: '#57534e', fontStyle: 'italic' }}>
                  {[e.company, e.location].filter(Boolean).join(', ')}
                </div>
                {e.bullets.length > 0 && (
                  <ul style={{ margin: '1.5mm 0 0', paddingLeft: '5mm', color: '#1c1917' }}>
                    {e.bullets.map((b, j) => (
                      <li key={j} style={{ marginBottom: '1mm' }}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </Section>
        )}

        {projects.length > 0 && (
          <Section title="Projects" accent="#1c1917">
            {projects.map((p, i) => (
              <div key={i} style={{ marginBottom: '3mm' }}>
                <strong>{p.title}</strong>
                {p.description && <div style={{ color: '#1c1917' }}>{p.description}</div>}
              </div>
            ))}
          </Section>
        )}
      </main>
    </div>
  )
}

function SideTitle({ children }) {
  return (
    <h2
      style={{
        fontSize: '9pt',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '2px',
        color: '#1c1917',
        margin: '6mm 0 2mm',
        paddingBottom: '1mm',
        borderBottom: '0.5pt solid #d6d3d1',
      }}
    >
      {children}
    </h2>
  )
}
