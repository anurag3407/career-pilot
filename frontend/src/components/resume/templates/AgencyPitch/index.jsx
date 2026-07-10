import { useResume } from '../../../../context/ResumeContext'
import OrderedSections from '../../shared/OrderedSections'

/**
 * AgencyPitch — agency-deck aesthetic with big section numbers.
 * Reads like the deck you would pitch a client.
 */
export default function AgencyPitch() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

  const nodes = {
    summary: personal.summary ? (
      <section style={{ marginBottom: '8mm' }}>
        <BigSectionNumber n={1} title="The Brief" />
        <p style={{ margin: '2mm 0 0', fontSize: '12pt', color: '#1c1917', lineHeight: 1.6 }}>{personal.summary}</p>
      </section>
    ) : null,

    experience: experience.length > 0 ? (
      <section style={{ marginBottom: '8mm' }}>
        <BigSectionNumber n={2} title="Selected Engagements" />
        {experience.map((e, i) => (
          <article key={i} style={{ marginBottom: '5mm' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h3 style={{ margin: 0, fontSize: '12pt', fontWeight: 700, color: '#1c1917' }}>{e.role}</h3>
              {e.period && <span style={{ fontSize: '9pt', color: '#6b7280' }}>{e.period}</span>}
            </div>
            <div style={{ fontSize: '10pt', color: '#1c1917', fontWeight: 500 }}>
              {[e.company, e.location].filter(Boolean).join(' · ')}
            </div>
            {e.bullets.length > 0 && (
              <ul style={{ margin: '1.5mm 0 0', paddingLeft: '5mm', color: '#1c1917' }}>
                {e.bullets.map((b, j) => (
                  <li key={j} style={{ marginBottom: '0.7mm' }}>{b}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </section>
    ) : null,

    projects: projects.length > 0 ? (
      <section style={{ marginBottom: '8mm' }}>
        <BigSectionNumber n={3} title="Case Studies" />
        {projects.map((p, i) => (
          <div key={i} style={{ marginBottom: '3mm' }}>
            <strong>{p.title}</strong>
            {p.description && <div style={{ color: '#1c1917' }}>{p.description}</div>}
            {p.techStack.length > 0 && (
              <div style={{ color: '#6b7280', fontSize: '8.5pt' }}>{p.techStack.join(' · ')}</div>
            )}
          </div>
        ))}
      </section>
    ) : null,

    skills: skills.length > 0 ? (
      <section style={{ marginBottom: '8mm' }}>
        <BigSectionNumber n={4} title="Capabilities" />
        <div style={{ marginTop: '2mm', display: 'flex', flexWrap: 'wrap', gap: '1mm 4mm' }}>
          {skills.map((s, i) => (
            <span key={i} style={{ fontSize: '10pt', color: '#1c1917' }}>
              <strong>{s.name}</strong>
              {s.level && <span style={{ color: '#6b7280' }}> ({s.level})</span>}
              {i < skills.length - 1 && <span style={{ color: '#d1d5db' }}> · </span>}
            </span>
          ))}
        </div>
      </section>
    ) : null,

    education: education.length > 0 ? (
      <section style={{ marginBottom: '8mm' }}>
        <BigSectionNumber n={5} title="Education" />
        {education.map((e, i) => (
          <div key={i} style={{ marginBottom: '2mm' }}>
            <strong>{e.degree}</strong>
            {e.institution && <span> · {e.institution}</span>}
            {e.period && <span style={{ color: '#6b7280' }}> · {e.period}</span>}
          </div>
        ))}
      </section>
    ) : null,

    certifications: certifications.length > 0 ? (
      <section>
        <BigSectionNumber n={6} title="Credentials" />
        {certifications.map((c, i) => (
          <div key={i} style={{ marginBottom: '1.5mm' }}>
            <strong>{c.name}</strong>
            {c.issuer && <span> · {c.issuer}</span>}
            {c.year && <span style={{ color: '#6b7280' }}> · {c.year}</span>}
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
        background: '#ffffff',
        color: '#1c1917',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '10pt',
        lineHeight: 1.5,
      }}
    >
      {/* ── Cover (fixed) ── */}
      <header style={{ padding: '18mm 18mm 12mm', borderBottom: '1pt solid #e5e7eb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8mm' }}>
          <div style={{ fontSize: '9pt', textTransform: 'uppercase', letterSpacing: '3px', color: '#1c1917', fontWeight: 700 }}>
            Career Pitch · 2024
          </div>
          <div style={{ fontSize: '9pt', color: '#6b7280' }}>Page 01</div>
        </div>
        <h1 style={{ margin: 0, fontSize: '44pt', fontWeight: 700, color: '#1c1917', letterSpacing: '-1.5px', lineHeight: 1 }}>
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <div style={{ marginTop: '4mm', fontSize: '16pt', color: '#1c1917', fontWeight: 300 }}>
            {personal.title}
          </div>
        )}
        <div style={{ marginTop: '6mm', fontSize: '9pt', color: '#6b7280', display: 'flex', flexWrap: 'wrap', gap: '1mm 6mm' }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>· {personal.phone}</span>}
          {personal.location && <span>· {personal.location}</span>}
          {personal.linkedin && <span>· {personal.linkedin}</span>}
          {personal.website && <span>· {personal.website}</span>}
        </div>
      </header>

      <div style={{ padding: '10mm 18mm 12mm' }}>
        {/* ── Body sections (drag-and-drop order honored here) ── */}
        <OrderedSections
          nodes={nodes}
          sectionProps={{ accent: '#1c1917', uppercase: false }}
          customBodyStyle={{ color: '#1c1917' }}
        />
      </div>
    </div>
  )
}

function BigSectionNumber({ n, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '3mm', borderBottom: '2pt solid #1c1917', paddingBottom: '1mm' }}>
      <span style={{ fontSize: '32pt', fontWeight: 700, color: '#1c1917', lineHeight: 1 }}>
        {String(n).padStart(2, '0')}
      </span>
      <span style={{ fontSize: '11pt', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: 700, color: '#1c1917' }}>
        {title}
      </span>
    </div>
  )
}