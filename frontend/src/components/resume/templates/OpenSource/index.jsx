import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'

/**
 * OpenSource — contribution-graph SVG in header (53 weeks × 7 days
 * dot grid, deterministic from data hash). Best for OSS maintainers.
 */
export default function OpenSource() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

  // Build a deterministic pseudo-random contribution map from the data
  const buildHeatmap = () => {
    const seed = (personal.name || 'anon').split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    const weeks = 30
    const days = 7
    const cells = []
    for (let w = 0; w < weeks; w += 1) {
      for (let d = 0; d < days; d += 1) {
        const v = Math.sin((seed + w * 13 + d * 7) * 0.31) * 0.5 + 0.5
        cells.push({ w, d, level: Math.min(4, Math.floor(v * 5)) })
      }
    }
    return { cells, weeks, days }
  }
  const { cells, weeks, days } = buildHeatmap()
  const levelColors = ['#ecfdf5', '#a7f3d0', '#6ee7b7', '#34d399', '#047857']

  return (
    <div
      className="resume-export-root"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '14mm 16mm',
        background: '#ffffff',
        color: '#0f172a',
        fontFamily: '"SF Mono", Menlo, Consolas, monospace',
        fontSize: '10pt',
        lineHeight: 1.5,
      }}
    >
      <header style={{ borderBottom: '0.5pt solid #e5e7eb', paddingBottom: '5mm', marginBottom: '6mm' }}>
        <h1 style={{ margin: 0, fontSize: '22pt', fontWeight: 700, color: '#0f172a', fontFamily: '"Helvetica Neue", sans-serif' }}>
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <div style={{ marginTop: '1mm', fontSize: '11pt', color: '#047857' }}>
            {personal.title}
          </div>
        )}
        <div style={{ marginTop: '2mm', fontSize: '9pt', color: '#6b7280', display: 'flex', flexWrap: 'wrap', gap: '1mm 5mm', fontFamily: '"Helvetica Neue", sans-serif' }}>
          {personal.email && <span>✉ {personal.email}</span>}
          {personal.github && <span>gh: {personal.github.replace(/^https?:\/\//, '')}</span>}
          {personal.linkedin && <span>in: {personal.linkedin.replace(/^https?:\/\//, '')}</span>}
        </div>
      </header>

      {/* ── Heatmap ── */}
      <section style={{ marginBottom: '6mm' }}>
        <div style={{ fontSize: '9pt', color: '#374151', marginBottom: '2mm' }}>$ git log --graph --decorate --all</div>
        <svg
          viewBox={`0 0 ${weeks * 12 + 10} ${days * 12 + 10}`}
          width={`${weeks * 12 + 10}mm`}
          height={`${days * 12 + 10}mm`}
          style={{ maxWidth: '100%' }}
        >
          {cells.map((c, i) => (
            <rect
              key={i}
              x={c.w * 12 + 4}
              y={c.d * 12 + 4}
              width="10"
              height="10"
              rx="2"
              fill={levelColors[c.level]}
            />
          ))}
        </svg>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1mm', marginTop: '1mm', fontSize: '8pt', color: '#6b7280' }}>
          <span>Less</span>
          {levelColors.map((c) => (
            <span key={c} style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
          ))}
          <span>More</span>
        </div>
      </section>

      {personal.summary && (
        <Section title="// about" accent="#047857">
          <p style={{ margin: 0, color: '#334155', fontFamily: '"Helvetica Neue", sans-serif' }}>{personal.summary}</p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="// experience" accent="#047857">
          {experience.map((e, i) => (
            <div key={i} style={{ marginBottom: '4mm' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: '11pt', color: '#0f172a', fontFamily: '"Helvetica Neue", sans-serif' }}>
                  {e.role}
                </strong>
                {e.period && <span style={{ color: '#6b7280', fontSize: '9pt' }}>{e.period}</span>}
              </div>
              <div style={{ color: '#047857', fontFamily: '"Helvetica Neue", sans-serif' }}>
                @{e.company}{e.location ? ` · ${e.location}` : ''}
              </div>
              {e.bullets.length > 0 && (
                <ul style={{ margin: '1.5mm 0 0', paddingLeft: '5mm', color: '#334155', fontFamily: '"Helvetica Neue", sans-serif' }}>
                  {e.bullets.map((b, j) => (
                    <li key={j} style={{ marginBottom: '0.7mm' }}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="// open source projects" accent="#047857">
          {projects.map((p, i) => (
            <div key={i} style={{ marginBottom: '3mm', fontFamily: '"Helvetica Neue", sans-serif' }}>
              <strong>{p.title}</strong>
              {p.description && <div style={{ color: '#334155' }}>{p.description}</div>}
              {p.techStack.length > 0 && (
                <div style={{ color: '#6b7280', fontSize: '8.5pt' }}>{p.techStack.join(' · ')}</div>
              )}
              {p.link && <div style={{ color: '#047857', fontSize: '8.5pt' }}>{p.link}</div>}
            </div>
          ))}
        </Section>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6mm' }}>
        {skills.length > 0 && (
          <Section title="// skills" accent="#047857">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1mm' }}>
              {skills.map((s, i) => (
                <span key={i} style={{ fontSize: '8.5pt', padding: '0.5mm 2mm', background: '#d1fae5', color: '#047857', borderRadius: 2 }}>
                  {s.name}
                </span>
              ))}
            </div>
          </Section>
        )}

        {education.length > 0 && (
          <Section title="// education" accent="#047857">
            {education.map((e, i) => (
              <div key={i} style={{ marginBottom: '2mm', fontFamily: '"Helvetica Neue", sans-serif' }}>
                <strong>{e.degree}</strong>
                <div style={{ color: '#047857', fontSize: '9pt' }}>{e.institution}</div>
                <div style={{ color: '#6b7280', fontSize: '8.5pt' }}>{e.period}</div>
              </div>
            ))}
          </Section>
        )}
      </div>

      {certifications.length > 0 && (
        <Section title="// certs" accent="#047857">
          {certifications.map((c, i) => (
            <div key={i} style={{ marginBottom: '1.5mm', fontFamily: '"Helvetica Neue", sans-serif' }}>
              <strong>{c.name}</strong>
              {c.issuer && <span style={{ color: '#6b7280' }}> · {c.issuer}</span>}
              {c.year && <span style={{ color: '#6b7280' }}> ({c.year})</span>}
            </div>
          ))}
        </Section>
      )}
    </div>
  )
}
