import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'

/**
 * SingleQuiet — Helvetica 9pt with hairline rules. Calm and editorial.
 * Designed to feel like a long-form magazine article.
 */
export default function SingleQuiet() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

  return (
    <div
      className="resume-export-root"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '20mm 24mm',
        background: '#ffffff',
        color: '#374151',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: '9.5pt',
        lineHeight: 1.55,
      }}
    >
      <header style={{ marginBottom: '8mm' }}>
        <h1 style={{ margin: 0, fontSize: '24pt', fontWeight: 300, color: '#111827', letterSpacing: '0.5px' }}>
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <div style={{ margin: '2mm 0 0', fontSize: '11pt', color: '#1f2937', fontWeight: 400 }}>
            {personal.title}
          </div>
        )}
        <div style={{ marginTop: '3mm', fontSize: '8.5pt', color: '#6b7280', letterSpacing: '0.5px' }}>
          {[personal.email, personal.phone, personal.location, personal.linkedin].filter(Boolean).join(' · ')}
        </div>
      </header>

      {personal.summary && (
        <Section title="About" accent="#111827" variant="plain" headingSize="8.5pt" spacing="Compact">
          <p style={{ margin: 0, color: '#374151' }}>{personal.summary}</p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Experience" accent="#111827">
          {experience.map((e, i) => (
            <div key={i} style={{ marginBottom: '5mm' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ margin: 0, fontSize: '10.5pt', fontWeight: 600, color: '#111827' }}>{e.role}</h3>
                {e.period && <span style={{ fontSize: '8.5pt', color: '#94a3b8' }}>{e.period}</span>}
              </div>
              <div style={{ fontSize: '9.5pt', color: '#1f2937', marginBottom: '1.5mm' }}>
                {[e.company, e.location].filter(Boolean).join(', ')}
              </div>
              {e.bullets.length > 0 && (
                <ul style={{ margin: '1mm 0 0', paddingLeft: '5mm', color: '#374151' }}>
                  {e.bullets.map((b, j) => (
                    <li key={j} style={{ marginBottom: '0.7mm' }}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education" accent="#111827">
          {education.map((e, i) => (
            <div key={i} style={{ marginBottom: '2mm' }}>
              <strong style={{ color: '#111827' }}>{e.degree}</strong>
              {e.institution && <span> · {e.institution}</span>}
              {e.period && <span style={{ color: '#94a3b8' }}> · {e.period}</span>}
            </div>
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills" accent="#111827">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1mm 4mm', fontSize: '9.5pt', color: '#374151' }}>
            {skills.map((s, i) => (
              <span key={i}>
                {s.name}
                {s.level && <span style={{ color: '#9ca3af' }}> ({s.level})</span>}
                {i < skills.length - 1 && <span style={{ color: '#d1d5db' }}> · </span>}
              </span>
            ))}
          </div>
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Projects" accent="#111827">
          {projects.map((p, i) => (
            <div key={i} style={{ marginBottom: '3mm' }}>
              <strong style={{ color: '#111827' }}>{p.title}</strong>
              {p.description && <div style={{ color: '#374151' }}>{p.description}</div>}
              {p.techStack.length > 0 && (
                <div style={{ fontSize: '8.5pt', color: '#94a3b8' }}>{p.techStack.join(' · ')}</div>
              )}
            </div>
          ))}
        </Section>
      )}

      {certifications.length > 0 && (
        <Section title="Certifications" accent="#111827">
          {certifications.map((c, i) => (
            <div key={i} style={{ marginBottom: '1.5mm' }}>
              <strong>{c.name}</strong>
              {c.issuer && <span> · {c.issuer}</span>}
              {c.year && <span style={{ color: '#94a3b8' }}> · {c.year}</span>}
            </div>
          ))}
        </Section>
      )}
    </div>
  )
}
