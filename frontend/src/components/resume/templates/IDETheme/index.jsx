import { useResume } from '../../../../context/ResumeContext'
import OrderedSections from '../../shared/OrderedSections'

/**
 * IDETheme — code-editor chrome (tab bar, line numbers, traffic lights)
 * framing the resume content. Reads like an editor that has been turned
 * into a personal site.
 */
export default function IDETheme() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

  const nodes = {
    summary: personal.summary ? (
      <div style={{ marginTop: '6mm', padding: '3mm', background: '#252526', borderLeft: '3px solid #007acc', color: '#d4d4d4' }}>
        <div style={{ fontSize: '8pt', color: '#569cd6', marginBottom: '1mm' }}>// summary.md</div>
        {personal.summary}
      </div>
    ) : null,

    experience: experience.length > 0 ? (
      <div style={{ marginTop: '6mm' }}>
        <div style={{ fontSize: '10pt', color: '#569cd6', marginBottom: '2mm' }}>## Experience</div>
        {experience.map((e, i) => (
          <div key={i} style={{ marginBottom: '4mm', paddingLeft: '4mm', borderLeft: '1px solid #2d2d2d' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span><span style={{ color: '#4ec9b0' }}>const</span> <span style={{ color: '#9cdcfe' }}>role</span> = <span style={{ color: '#ce9178' }}>"{e.role}"</span></span>
              {e.period && <span style={{ color: '#6a9955', fontSize: '8.5pt' }}>// {e.period}</span>}
            </div>
            <div style={{ color: '#9cdcfe' }}>company = <span style={{ color: '#ce9178' }}>"{e.company}"</span>{e.location ? ` · ${e.location}` : ''}</div>
            {e.bullets.length > 0 && (
              <ul style={{ margin: '1.5mm 0 0', paddingLeft: '5mm', color: '#d4d4d4' }}>
                {e.bullets.map((b, j) => (
                  <li key={j} style={{ marginBottom: '0.5mm' }}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    ) : null,

    skills: skills.length > 0 ? (
      <div style={{ marginTop: '5mm' }}>
        <div style={{ fontSize: '10pt', color: '#569cd6', marginBottom: '2mm' }}>## Skills</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5mm' }}>
          {skills.map((s, i) => (
            <span
              key={i}
              style={{
                fontSize: '8.5pt',
                padding: '0.5mm 2mm',
                background: '#2d2d2d',
                color: '#9cdcfe',
                borderRadius: 2,
                border: '1px solid #3e3e3e',
              }}
            >
              {s.name}
            </span>
          ))}
        </div>
      </div>
    ) : null,

    projects: projects.length > 0 ? (
      <div style={{ marginTop: '5mm' }}>
        <div style={{ fontSize: '10pt', color: '#569cd6', marginBottom: '2mm' }}>## Projects</div>
        {projects.map((p, i) => (
          <div key={i} style={{ marginBottom: '3mm', paddingLeft: '4mm', borderLeft: '1px solid #2d2d2d' }}>
            <strong style={{ color: '#4ec9b0' }}>{p.title}</strong>
            {p.description && <div style={{ color: '#d4d4d4' }}>{p.description}</div>}
            {p.techStack.length > 0 && (
              <div style={{ color: '#c586c0', fontSize: '8.5pt' }}>{p.techStack.join(' · ')}</div>
            )}
          </div>
        ))}
      </div>
    ) : null,

    education: education.length > 0 ? (
      <div style={{ marginTop: '5mm' }}>
        <div style={{ fontSize: '10pt', color: '#569cd6', marginBottom: '2mm' }}>## Education</div>
        {education.map((e, i) => (
          <div key={i} style={{ marginBottom: '2mm', paddingLeft: '4mm', borderLeft: '1px solid #2d2d2d' }}>
            <strong style={{ color: '#4ec9b0' }}>{e.degree}</strong> · {e.institution}
            {e.period && <span style={{ color: '#6a9955' }}> // {e.period}</span>}
          </div>
        ))}
      </div>
    ) : null,

    certifications: certifications.length > 0 ? (
      <div style={{ marginTop: '5mm' }}>
        <div style={{ fontSize: '10pt', color: '#569cd6', marginBottom: '2mm' }}>## Certifications</div>
        {certifications.map((c, i) => (
          <div key={i} style={{ color: '#9cdcfe' }}>
            - {c.name}{c.issuer ? ` (${c.issuer})` : ''}{c.year ? ` — ${c.year}` : ''}
          </div>
        ))}
      </div>
    ) : null,
  }

  return (
    <div
      className="resume-export-root"
      style={{
        width: '210mm',
        minHeight: '297mm',
        background: '#1e1e1e',
        color: '#d4d4d4',
        fontFamily: '"SF Mono", Menlo, Consolas, monospace',
        fontSize: '10pt',
        lineHeight: 1.5,
      }}
    >
      {/* ── Title bar (fixed) ── */}
      <div
        style={{
          background: '#252526',
          padding: '2mm 4mm',
          display: 'flex',
          alignItems: 'center',
          gap: '3mm',
          borderBottom: '1px solid #1e1e1e',
        }}
      >
        <div style={{ display: 'flex', gap: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
        </div>
        <div style={{ flex: 1, display: 'flex', gap: 1 }}>
          {['resume.mdx', 'about.md', 'skills.json'].map((t, i) => (
            <div
              key={t}
              style={{
                padding: '1mm 3mm',
                fontSize: '8pt',
                background: i === 0 ? '#1e1e1e' : '#2d2d2d',
                color: i === 0 ? '#ffffff' : '#969696',
                borderTop: i === 0 ? '1.5px solid #007acc' : '1.5px solid transparent',
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '8mm 1fr', minHeight: '280mm' }}>
        {/* ── Line numbers gutter (fixed) ── */}
        <div
          style={{
            background: '#1e1e1e',
            color: '#858585',
            padding: '8mm 2mm 8mm 0',
            fontSize: '8.5pt',
            textAlign: 'right',
            userSelect: 'none',
            borderRight: '1px solid #2d2d2d',
          }}
        >
          {Array.from({ length: 65 }).map((_, i) => (
            <div key={i} style={{ lineHeight: 1.5, height: '15pt' }}>{i + 1}</div>
          ))}
        </div>

        {/* ── Code body ── */}
        <div style={{ padding: '8mm 10mm', background: '#1e1e1e' }}>
          <pre style={{ margin: 0, fontFamily: 'inherit', color: '#d4d4d4', fontSize: '10pt', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
            <span style={{ color: '#c586c0' }}>---</span>{'\n'}
            <span style={{ color: '#569cd6' }}>name</span>: <span style={{ color: '#ce9178' }}>"{personal.name || 'Your Name'}"</span>{'\n'}
            {personal.title && <><span style={{ color: '#569cd6' }}>title</span>: <span style={{ color: '#ce9178' }}>"{personal.title}"</span>{'\n'}</>}
            {personal.email && <><span style={{ color: '#569cd6' }}>email</span>: <span style={{ color: '#ce9178' }}>"{personal.email}"</span>{'\n'}</>}
            {personal.location && <><span style={{ color: '#569cd6' }}>location</span>: <span style={{ color: '#ce9178' }}>"{personal.location}"</span>{'\n'}</>}
            {personal.github && <><span style={{ color: '#569cd6' }}>github</span>: <span style={{ color: '#ce9178' }}>"{personal.github}"</span>{'\n'}</>}
            {personal.linkedin && <><span style={{ color: '#569cd6' }}>linkedin</span>: <span style={{ color: '#ce9178' }}>"{personal.linkedin}"</span>{'\n'}</>}
            <span style={{ color: '#c586c0' }}>---</span>
          </pre>

          {/* ── Body sections (drag-and-drop order honored here) ── */}
          <OrderedSections
            nodes={nodes}
            sectionProps={{ accent: '#569cd6', uppercase: false }}
            customBodyStyle={{ color: '#d4d4d4' }}
          />
        </div>
      </div>
    </div>
  )
}