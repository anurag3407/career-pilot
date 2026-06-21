import { useResume } from '../../../../context/ResumeContext'
import TimelineNode from '../../shared/TimelineNode'

/**
 * GitCommit — commit-log timeline on the left for experience entries.
 * Each row reads like a commit: hash + date + role + message + bullet list.
 */
export default function GitCommit() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

  const fakeHash = (s = '') => {
    let h = 0
    for (let i = 0; i < s.length; i += 1) {
      h = (h * 31 + s.charCodeAt(i)) >>> 0
    }
    return h.toString(16).slice(0, 7).padEnd(7, '0')
  }

  return (
    <div
      className="resume-export-root"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '14mm 16mm',
        background: '#0b1220',
        color: '#e2e8f0',
        fontFamily: '"SF Mono", Menlo, Consolas, monospace',
        fontSize: '9.5pt',
        lineHeight: 1.5,
      }}
    >
      {/* ── Header ── */}
      <header
        style={{
          background: '#020617',
          border: '1px solid #1e293b',
          borderRadius: 6,
          padding: '6mm 7mm',
          marginBottom: '7mm',
        }}
      >
        <div style={{ fontSize: '8.5pt', color: '#64748b' }}>git log --author="{personal.name || 'your-name'}"</div>
        <h1 style={{ margin: '1mm 0 0', fontSize: '18pt', fontWeight: 700, color: '#10b981' }}>
          {personal.name || 'your-name'}
        </h1>
        {personal.title && (
          <div style={{ marginTop: '1mm', fontSize: '10pt', color: '#94a3b8' }}>
            → {personal.title}
          </div>
        )}
        <div style={{ marginTop: '3mm', fontSize: '8.5pt', color: '#94a3b8', display: 'flex', flexWrap: 'wrap', gap: '1mm 4mm' }}>
          {personal.email && <span>✉ {personal.email}</span>}
          {personal.phone && <span>☎ {personal.phone}</span>}
          {personal.location && <span>⌂ {personal.location}</span>}
          {personal.github && <span>gh: {personal.github.replace(/^https?:\/\//, '')}</span>}
          {personal.linkedin && <span>in: {personal.linkedin.replace(/^https?:\/\//, '')}</span>}
        </div>
      </header>

      {personal.summary && (
        <Section title="$ cat about.md" accent="#10b981">
          <p style={{ margin: 0, color: '#cbd5e1' }}>{personal.summary}</p>
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="$ ls skills/" accent="#10b981">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5mm' }}>
            {skills.map((s, i) => (
              <span
                key={i}
                style={{
                  fontSize: '8.5pt',
                  padding: '0.5mm 2mm',
                  background: '#064e3b',
                  color: '#6ee7b7',
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
        <Section title="$ git log --oneline --all" accent="#10b981">
          {experience.map((e, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '6mm 1fr',
                gap: '3mm',
                marginBottom: '4mm',
              }}
            >
              <TimelineNode first={i === 0} last={i === experience.length - 1} accent="#10b981" rail="#1e293b" />
              <article>
                <div style={{ display: 'flex', gap: '2mm', alignItems: 'baseline', flexWrap: 'wrap' }}>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>{fakeHash(`${e.role}${e.company}`)}</span>
                  <span style={{ color: '#94a3b8' }}>({e.period || 'current'})</span>
                  <strong style={{ color: '#f1f5f9', fontSize: '10pt' }}>{e.role}</strong>
                </div>
                <div style={{ color: '#94a3b8', fontSize: '9pt', marginTop: '1mm' }}>
                  Authored at <span style={{ color: '#6ee7b7' }}>{e.company}</span>{e.location ? ` · ${e.location}` : ''}
                </div>
                {e.bullets.length > 0 && (
                  <div style={{ marginTop: '2mm', color: '#cbd5e1' }}>
                    <div style={{ color: '#64748b', fontSize: '8.5pt' }}>// changes:</div>
                    <ul style={{ margin: '1mm 0 0', paddingLeft: '5mm', color: '#cbd5e1' }}>
                      {e.bullets.map((b, j) => (
                        <li key={j} style={{ marginBottom: '0.5mm' }}>{b}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            </div>
          ))}
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="$ ls projects/" accent="#10b981">
          {projects.map((p, i) => (
            <div key={i} style={{ marginBottom: '3mm' }}>
              <strong style={{ color: '#f1f5f9' }}>{p.title}</strong>
              {p.description && <div style={{ color: '#cbd5e1' }}>{p.description}</div>}
              {p.techStack.length > 0 && (
                <div style={{ color: '#6ee7b7', fontSize: '8.5pt' }}>{p.techStack.join(' · ')}</div>
              )}
              {p.link && (
                <div style={{ color: '#10b981', fontSize: '8.5pt' }}>{p.link}</div>
              )}
            </div>
          ))}
        </Section>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6mm' }}>
        {education.length > 0 && (
          <Section title="$ cat education.json" accent="#10b981">
            {education.map((e, i) => (
              <div key={i} style={{ marginBottom: '2mm' }}>
                <strong style={{ color: '#f1f5f9' }}>{e.degree}</strong>
                <div style={{ color: '#6ee7b7' }}>{e.institution}</div>
                <div style={{ color: '#64748b', fontSize: '8.5pt' }}>{[e.period, e.location].filter(Boolean).join(' · ')}</div>
              </div>
            ))}
          </Section>
        )}

        {certifications.length > 0 && (
          <Section title="$ cat certs.json" accent="#10b981">
            {certifications.map((c, i) => (
              <div key={i} style={{ marginBottom: '1.5mm', fontSize: '9pt' }}>
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

function Section({ title, accent, children }) {
  return (
    <section style={{ marginBottom: '5mm' }}>
      <h2 style={{ fontSize: '9.5pt', color: accent, fontWeight: 700, margin: '0 0 2mm' }}>{title}</h2>
      {children}
    </section>
  )
}
