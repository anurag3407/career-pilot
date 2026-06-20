import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'
import ProjectCard from '../../shared/ProjectCard'

/**
 * CleanSingle — the most ATS-safe single-column possible. Pure semantic
 * HTML structure: h1/h2/p/ul/li with no decorative borders, no color
 * decoration, no italics-as-headings. Maximizes parser compatibility.
 */
export default function CleanSingle() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

  return (
    <div
      className="resume-export-root"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '18mm 20mm',
        background: '#ffffff',
        color: '#000000',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: '11pt',
        lineHeight: 1.5,
      }}
    >
      <header style={{ marginBottom: '6mm' }}>
        <h1 style={{ margin: 0, fontSize: '20pt', fontWeight: 700, color: '#000000' }}>
          {personal.name || 'Your Name'}
        </h1>
        <div style={{ marginTop: '1mm', fontSize: '11pt', color: '#000000' }}>
          {personal.title}
        </div>
        <div style={{ marginTop: '2mm', fontSize: '10pt', color: '#000000' }}>
          {[personal.email, personal.phone, personal.location, personal.linkedin, personal.website].filter(Boolean).join(' | ')}
        </div>
      </header>

      {personal.summary && (
        <section style={{ marginBottom: '6mm' }}>
          <h2 style={{ fontSize: '12pt', fontWeight: 700, margin: '0 0 2mm', color: '#000000' }}>Summary</h2>
          <p style={{ margin: 0 }}>{personal.summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section style={{ marginBottom: '6mm' }}>
          <h2 style={{ fontSize: '12pt', fontWeight: 700, margin: '0 0 2mm', color: '#000000' }}>Experience</h2>
          {experience.map((e, i) => (
            <div key={i} style={{ marginBottom: '4mm' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{e.role}</strong>
                {e.period && <span style={{ fontSize: '10pt' }}>{e.period}</span>}
              </div>
              <div style={{ fontSize: '10.5pt' }}>
                {[e.company, e.location].filter(Boolean).join(', ')}
              </div>
              {e.bullets.length > 0 && (
                <ul style={{ margin: '1mm 0 0', paddingLeft: '5mm' }}>
                  {e.bullets.map((b, j) => (
                    <li key={j} style={{ marginBottom: '0.5mm' }}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section style={{ marginBottom: '6mm' }}>
          <h2 style={{ fontSize: '12pt', fontWeight: 700, margin: '0 0 2mm', color: '#000000' }}>Education</h2>
          {education.map((e, i) => (
            <div key={i} style={{ marginBottom: '3mm' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{e.institution}</strong>
                {e.period && <span style={{ fontSize: '10pt' }}>{e.period}</span>}
              </div>
              <div>{e.degree}</div>
            </div>
          ))}
        </section>
      )}

      {projects.length > 0 && (
        <section style={{ marginBottom: '6mm' }}>
          <h2 style={{ fontSize: '12pt', fontWeight: 700, margin: '0 0 2mm', color: '#000000' }}>Projects</h2>
          {projects.map((p, i) => (
            <div key={i} style={{ marginBottom: '3mm' }}>
              <strong>{p.title}</strong>
              {p.description && <div style={{ fontSize: '10pt' }}>{p.description}</div>}
              {p.techStack.length > 0 && (
                <div style={{ fontSize: '9.5pt' }}>Tech: {p.techStack.join(', ')}</div>
              )}
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section style={{ marginBottom: '6mm' }}>
          <h2 style={{ fontSize: '12pt', fontWeight: 700, margin: '0 0 2mm', color: '#000000' }}>Skills</h2>
          <div>{skills.map((s) => s.name).join(', ')}</div>
        </section>
      )}

      {certifications.length > 0 && (
        <section>
          <h2 style={{ fontSize: '12pt', fontWeight: 700, margin: '0 0 2mm', color: '#000000' }}>Certifications</h2>
          {certifications.map((c, i) => (
            <div key={i} style={{ marginBottom: '1mm' }}>
              {c.name}{c.issuer ? ` — ${c.issuer}` : ''}{c.year ? ` (${c.year})` : ''}
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
