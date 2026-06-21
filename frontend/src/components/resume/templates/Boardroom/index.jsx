import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'

/**
 * Boardroom — center-aligned summary, board-style header, gold accent.
 * Built for board directors, advisors, and senior finance professionals.
 */
export default function Boardroom() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

  return (
    <div
      className="resume-export-root"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '18mm 22mm',
        background: '#ffffff',
        color: '#1c1917',
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: '10.5pt',
        lineHeight: 1.5,
      }}
    >
      <header style={{ textAlign: 'center', marginBottom: '8mm', paddingBottom: '6mm', borderBottom: '1pt double #b45309' }}>
        <h1 style={{ margin: 0, fontSize: '26pt', fontWeight: 700, color: '#1c1917', letterSpacing: '1px' }}>
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <div style={{ marginTop: '2mm', fontSize: '12pt', color: '#b45309', fontStyle: 'italic' }}>
            {personal.title}
          </div>
        )}
        <div style={{ marginTop: '3mm', fontSize: '9.5pt', color: '#57534e', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1mm 6mm' }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>· {personal.phone}</span>}
          {personal.location && <span>· {personal.location}</span>}
          {personal.linkedin && <span>· {personal.linkedin}</span>}
        </div>
      </header>

      {personal.summary && (
        <Section title="Profile" accent="#b45309" variant="plain">
          <p style={{ margin: 0, textAlign: 'center', color: '#1c1917', fontStyle: 'italic' }}>{personal.summary}</p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Directorships & Executive Experience" accent="#b45309">
          {experience.map((e, i) => (
            <div key={i} style={{ marginBottom: '5mm' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: '11.5pt', color: '#1c1917' }}>{e.role}</strong>
                {e.period && <span style={{ fontSize: '10pt', color: '#78716c', fontStyle: 'italic' }}>{e.period}</span>}
              </div>
              <div style={{ fontSize: '10.5pt', color: '#b45309', fontStyle: 'italic' }}>
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

      {education.length > 0 && (
        <Section title="Education" accent="#b45309">
          {education.map((e, i) => (
            <div key={i} style={{ marginBottom: '2mm' }}>
              <strong>{e.institution}</strong> · {e.degree}
              {e.period && <span style={{ color: '#78716c' }}> · {e.period}</span>}
            </div>
          ))}
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Selected Engagements" accent="#b45309">
          {projects.map((p, i) => (
            <div key={i} style={{ marginBottom: '3mm' }}>
              <strong>{p.title}</strong>
              {p.description && <div style={{ color: '#1c1917' }}>{p.description}</div>}
            </div>
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Areas of Expertise" accent="#b45309">
          <div style={{ color: '#1c1917', lineHeight: 1.7 }}>{skills.map((s) => s.name).join(' · ')}</div>
        </Section>
      )}

      {certifications.length > 0 && (
        <Section title="Credentials" accent="#b45309">
          {certifications.map((c, i) => (
            <div key={i} style={{ marginBottom: '1.5mm' }}>
              <strong>{c.name}</strong>
              {c.issuer && <span> · {c.issuer}</span>}
              {c.year && <span style={{ color: '#78716c' }}> · {c.year}</span>}
            </div>
          ))}
        </Section>
      )}
    </div>
  )
}
