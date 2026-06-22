import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'

/**
 * TerminalCLI — full terminal-window frame, light variant of TechMono.
 * Lighter background, less neon, similar $prompt experience feel.
 */
export default function TerminalCLI() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

  return (
    <div
      className="resume-export-root"
      style={{
        width: '210mm',
        minHeight: '297mm',
        background: '#fafaf9',
        color: '#1c1917',
        fontFamily: '"SF Mono", Menlo, Consolas, monospace',
        fontSize: '10pt',
        lineHeight: 1.5,
      }}
    >
      {/* ── Terminal title bar ── */}
      <div
        style={{
          background: '#e7e5e4',
          padding: '3mm 5mm',
          display: 'flex',
          alignItems: 'center',
          gap: '3mm',
          borderBottom: '1px solid #d6d3d1',
        }}
      >
        <div style={{ display: 'flex', gap: 4 }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#ef4444' }} />
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#f59e0b' }} />
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#10b981' }} />
        </div>
        <div style={{ flex: 1, textAlign: 'center', fontSize: '9pt', color: '#57534e' }}>
          {personal.name ? `${personal.name.toLowerCase().replace(/\s+/g, '-')}@career-pilot: ~` : 'career-pilot@resume: ~'}
        </div>
      </div>

      <div style={{ padding: '10mm 14mm', background: '#fafaf9' }}>
        <div style={{ fontSize: '9.5pt', color: '#78716c' }}>$ cat resume.txt</div>
        <h1 style={{ margin: '2mm 0 0', fontSize: '22pt', fontWeight: 700, color: '#0f766e' }}>
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <div style={{ marginTop: '1mm', fontSize: '11pt', color: '#57534e' }}>
            → {personal.title}
          </div>
        )}
        <div style={{ marginTop: '3mm', fontSize: '9pt', color: '#57534e', display: 'flex', flexWrap: 'wrap', gap: '1mm 4mm' }}>
          {personal.email && <span>✉ {personal.email}</span>}
          {personal.phone && <span>☎ {personal.phone}</span>}
          {personal.location && <span>⌂ {personal.location}</span>}
          {personal.github && <span>gh: {personal.github.replace(/^https?:\/\//, '')}</span>}
          {personal.linkedin && <span>in: {personal.linkedin.replace(/^https?:\/\//, '')}</span>}
          {personal.website && <span>↗ {personal.website.replace(/^https?:\/\//, '')}</span>}
        </div>

        <hr style={{ border: 'none', borderTop: '0.5pt dashed #d6d3d1', margin: '6mm 0' }} />

        {personal.summary && (
          <Section title="$ about" accent="#0f766e">
            <p style={{ margin: 0, color: '#1c1917', fontFamily: '"SF Mono", Menlo, monospace' }}>{personal.summary}</p>
          </Section>
        )}

        {skills.length > 0 && (
          <Section title="$ ls skills/" accent="#0f766e">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1mm' }}>
              {skills.map((s, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '8.5pt',
                    padding: '0.5mm 2mm',
                    background: '#ccfbf1',
                    color: '#0f766e',
                    border: '1px solid #5eead4',
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
          <Section title="$ cat experience.log" accent="#0f766e">
            {experience.map((e, i) => (
              <div key={i} style={{ marginBottom: '4mm' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '11pt', color: '#0f172a' }}>{e.role}</strong>
                  {e.period && <span style={{ color: '#78716c', fontSize: '9pt' }}>{e.period}</span>}
                </div>
                <div style={{ color: '#0f766e' }}>
                  @{e.company}{e.location ? ` · ${e.location}` : ''}
                </div>
                {e.bullets.length > 0 && (
                  <ul style={{ margin: '1.5mm 0 0', paddingLeft: '5mm', color: '#1c1917' }}>
                    {e.bullets.map((b, j) => (
                      <li key={j} style={{ marginBottom: '0.5mm' }}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </Section>
        )}

        {projects.length > 0 && (
          <Section title="$ cd projects && ls" accent="#0f766e">
            {projects.map((p, i) => (
              <div key={i} style={{ marginBottom: '3mm' }}>
                <strong>{p.title}/</strong>
                {p.description && <div style={{ color: '#1c1917' }}>{p.description}</div>}
                {p.techStack.length > 0 && (
                  <div style={{ color: '#78716c', fontSize: '8.5pt' }}>tech: {p.techStack.join(', ')}</div>
                )}
              </div>
            ))}
          </Section>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6mm' }}>
          {education.length > 0 && (
            <Section title="$ cat education.json" accent="#0f766e">
              {education.map((e, i) => (
                <div key={i} style={{ marginBottom: '2mm' }}>
                  <strong>{e.degree}</strong>
                  <div style={{ color: '#0f766e' }}>{e.institution}</div>
                  <div style={{ color: '#78716c', fontSize: '8.5pt' }}>{e.period}</div>
                </div>
              ))}
            </Section>
          )}

          {certifications.length > 0 && (
            <Section title="$ cat certs.json" accent="#0f766e">
              {certifications.map((c, i) => (
                <div key={i} style={{ marginBottom: '1.5mm', fontSize: '9pt' }}>
                  <strong>{c.name}</strong>
                  {c.issuer && <span style={{ color: '#78716c' }}> · {c.issuer}</span>}
                  {c.year && <span style={{ color: '#78716c' }}> ({c.year})</span>}
                </div>
              ))}
            </Section>
          )}
        </div>

        <div style={{ marginTop: '6mm', fontSize: '9pt', color: '#0f766e' }}>
          $ <span style={{ background: '#0f766e', color: '#fafaf9', padding: '0 2px' }}>_</span>
        </div>
      </div>
    </div>
  )
}
