import { useResume } from '../../../../context/ResumeContext'
import OrderedSections from '../../shared/OrderedSections'

/**
 * BrutalistBold — black & white, thick rules, oversized type. Anti-design
 * for designers who don't want to look like designers.
 */
export default function BrutalistBold() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

  const brutalSectionStyle = {
    marginBottom: '7mm',
    paddingBottom: '5mm',
    borderBottom: '2pt solid #000000',
  }

  const brutalHeadingStyle = {
    fontSize: '14pt',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '3px',
    color: '#000000',
    margin: '0 0 3mm',
  }

  const nodes = {
    summary: personal.summary ? (
      <section style={brutalSectionStyle}>
        <h2 style={{ ...brutalHeadingStyle, marginBottom: '2mm' }}>/ Summary</h2>
        <p style={{ margin: 0, fontSize: '11pt', color: '#000000' }}>{personal.summary}</p>
      </section>
    ) : null,

    experience: experience.length > 0 ? (
      <section style={brutalSectionStyle}>
        <h2 style={{ ...brutalHeadingStyle, marginBottom: '4mm' }}>/ Experience</h2>
        {experience.map((e, i) => (
          <div key={i} style={{ marginBottom: '5mm' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <strong style={{ fontSize: '12pt', fontWeight: 900, textTransform: 'uppercase', color: '#000000' }}>{e.role}</strong>
              {e.period && <span style={{ fontSize: '9pt', fontWeight: 700, color: '#000000' }}>{e.period}</span>}
            </div>
            <div style={{ fontSize: '10pt', fontWeight: 600, color: '#000000', marginBottom: '1.5mm' }}>
              {e.company}{e.location ? ` · ${e.location}` : ''}
            </div>
            {e.bullets.length > 0 && (
              <ul style={{ margin: '1mm 0 0', paddingLeft: '5mm', color: '#000000' }}>
                {e.bullets.map((b, j) => (
                  <li key={j} style={{ marginBottom: '0.7mm' }}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>
    ) : null,

    skills: skills.length > 0 ? (
      <section style={brutalSectionStyle}>
        <h2 style={brutalHeadingStyle}>/ Skills</h2>
        <div style={{ fontSize: '10pt', fontWeight: 600, color: '#000000' }}>
          {skills.map((s, i) => (
            <span key={i}>
              {s.name.toUpperCase()}
              {i < skills.length - 1 && <span style={{ color: '#666666' }}> · </span>}
            </span>
          ))}
        </div>
      </section>
    ) : null,

    education: education.length > 0 ? (
      <section>
        <h2 style={brutalHeadingStyle}>/ Education</h2>
        {education.map((e, i) => (
          <div key={i} style={{ marginBottom: '2mm' }}>
            <strong style={{ fontWeight: 900, textTransform: 'uppercase' }}>{e.degree}</strong>
            <div style={{ fontSize: '10pt', fontWeight: 600 }}>{e.institution}</div>
            <div style={{ fontSize: '9pt', color: '#444444' }}>{e.period}</div>
          </div>
        ))}
      </section>
    ) : null,

    projects: projects.length > 0 ? (
      <section>
        <h2 style={brutalHeadingStyle}>/ Projects</h2>
        {projects.map((p, i) => (
          <div key={i} style={{ marginBottom: '3mm' }}>
            <strong style={{ fontWeight: 900, textTransform: 'uppercase' }}>{p.title}</strong>
            {p.description && <div style={{ color: '#000000' }}>{p.description}</div>}
            {p.techStack.length > 0 && (
              <div style={{ fontSize: '8.5pt', color: '#666666', fontWeight: 600 }}>{p.techStack.join(' · ')}</div>
            )}
          </div>
        ))}
      </section>
    ) : null,

    certifications: certifications.length > 0 ? (
      <section style={{ marginTop: '5mm' }}>
        <h2 style={brutalHeadingStyle}>/ Certifications</h2>
        {certifications.map((c, i) => (
          <div key={i} style={{ marginBottom: '1.5mm' }}>
            <strong>{c.name.toUpperCase()}</strong>
            {c.issuer && <span> · {c.issuer.toUpperCase()}</span>}
            {c.year && <span style={{ color: '#444444' }}> · {c.year}</span>}
          </div>
        ))}
      </section>
    ) : null,
  }

  return (
    <div
      className="resume-export-root"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '14mm 18mm',
        background: '#ffffff',
        color: '#000000',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '10pt',
        lineHeight: 1.5,
      }}
    >
      {/* ── Header (fixed) ── */}
      <header style={{ marginBottom: '8mm', paddingBottom: '5mm', borderBottom: '4pt solid #000000' }}>
        <h1 style={{ margin: 0, fontSize: '40pt', fontWeight: 900, color: '#000000', letterSpacing: '-2px', lineHeight: 0.95, textTransform: 'uppercase' }}>
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <div style={{ marginTop: '4mm', fontSize: '14pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#000000' }}>
            {personal.title}
          </div>
        )}
        <div style={{ marginTop: '4mm', fontSize: '9pt', color: '#000000', display: 'flex', flexWrap: 'wrap', gap: '1mm 5mm', fontWeight: 600 }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>· {personal.phone}</span>}
          {personal.location && <span>· {personal.location}</span>}
          {personal.linkedin && <span>· {personal.linkedin}</span>}
          {personal.website && <span>· {personal.website}</span>}
        </div>
      </header>

      {/* ── Body sections (drag-and-drop order honored here) ── */}
      <OrderedSections
        nodes={nodes}
        sectionProps={{ accent: '#000000', uppercase: false }}
        customBodyStyle={{ color: '#000000' }}
      />
    </div>
  )
}