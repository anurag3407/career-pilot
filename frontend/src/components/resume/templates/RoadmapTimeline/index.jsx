import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'

/**
 * RoadmapTimeline — horizontal product roadmap across the header, then
 * dense body content. Each experience slot renders as a phase marker.
 */
export default function RoadmapTimeline() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

  // Use first 5 experience entries as roadmap phases
  const phases = experience.slice(0, 5)

  return (
    <div
      className="resume-export-root"
      style={{
        width: '210mm',
        minHeight: '297mm',
        background: '#ffffff',
        color: '#0f172a',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '10pt',
        lineHeight: 1.5,
      }}
    >
      {/* ── Header ── */}
      <header style={{ padding: '14mm 18mm 6mm' }}>
        <h1 style={{ margin: 0, fontSize: '26pt', fontWeight: 700, letterSpacing: '-0.5px' }}>
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <div style={{ marginTop: '1mm', fontSize: '12pt', color: '#4338ca', fontWeight: 500 }}>
            {personal.title}
          </div>
        )}
        <div style={{ marginTop: '3mm', fontSize: '9pt', color: '#64748b', display: 'flex', flexWrap: 'wrap', gap: '1mm 5mm' }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>· {personal.phone}</span>}
          {personal.location && <span>· {personal.location}</span>}
          {personal.linkedin && <span>· {personal.linkedin}</span>}
        </div>
      </header>

      {/* ── Roadmap ── */}
      <section style={{ padding: '4mm 18mm', background: '#eef2ff' }}>
        <div style={{ fontSize: '9pt', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#4338ca', marginBottom: '4mm', fontWeight: 700 }}>
          Product Roadmap
        </div>
        <div style={{ position: 'relative', paddingTop: '12mm', paddingBottom: '2mm' }}>
          {/* Timeline rail */}
          <div
            style={{
              position: 'absolute',
              top: '8mm',
              left: 0,
              right: 0,
              height: '1pt',
              background: '#c7d2fe',
            }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${phases.length}, 1fr)`, gap: '2mm', position: 'relative' }}>
            {phases.map((p, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: i === phases.length - 1 ? '#4338ca' : '#a5b4fc',
                    border: '2pt solid #ffffff',
                    boxShadow: '0 0 0 1pt #c7d2fe',
                    position: 'absolute',
                    top: 'calc(8mm - 8px)',
                  }}
                />
                <div style={{ marginTop: '8mm', textAlign: 'center', fontSize: '8.5pt' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.role || `Phase ${i + 1}`}</div>
                  <div style={{ color: '#4338ca' }}>{p.company}</div>
                  <div style={{ color: '#94a3b8' }}>{p.period}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ padding: '6mm 18mm 12mm' }}>
        {personal.summary && (
          <Section title="About" accent="#4338ca">
            <p style={{ margin: 0, color: '#334155' }}>{personal.summary}</p>
          </Section>
        )}

        {experience.length > 0 && (
          <Section title="Experience" accent="#4338ca">
            {experience.map((e, i) => (
              <ExperienceRow
                key={i}
                exp={e}
                roleColor="#0f172a"
                companyColor="#4338ca"
                periodColor="#6b7280"
                bulletColor="#334155"
                fontSize="10pt"
              />
            ))}
          </Section>
        )}

        {skills.length > 0 && (
          <Section title="Skills" accent="#4338ca">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1mm' }}>
              {skills.map((s, i) => (
                <span key={i} style={{ fontSize: '9pt', padding: '0.5mm 2mm', background: '#e0e7ff', color: '#1e1b4b', borderRadius: 8, fontWeight: 500 }}>
                  {s.name}
                </span>
              ))}
            </div>
          </Section>
        )}

        {projects.length > 0 && (
          <Section title="Projects Shipped" accent="#4338ca">
            {projects.map((p, i) => (
              <div key={i} style={{ marginBottom: '3mm' }}>
                <strong>{p.title}</strong>
                {p.description && <div style={{ color: '#334155' }}>{p.description}</div>}
                {p.techStack.length > 0 && (
                  <div style={{ color: '#4338ca', fontSize: '8.5pt' }}>{p.techStack.join(' · ')}</div>
                )}
              </div>
            ))}
          </Section>
        )}

        {education.length > 0 && (
          <Section title="Education" accent="#4338ca">
            {education.map((e, i) => (
              <div key={i} style={{ marginBottom: '2mm' }}>
                <strong>{e.institution}</strong>
                {e.degree && <span> · {e.degree}</span>}
                {e.period && <span style={{ color: '#6b7280' }}> · {e.period}</span>}
              </div>
            ))}
          </Section>
        )}

        {certifications.length > 0 && (
          <Section title="Certifications" accent="#4338ca">
            {certifications.map((c, i) => (
              <div key={i} style={{ marginBottom: '1.5mm' }}>
                <strong>{c.name}</strong>
                {c.issuer && <span> · {c.issuer}</span>}
                {c.year && <span style={{ color: '#6b7280' }}> · {c.year}</span>}
              </div>
            ))}
          </Section>
        )}
      </div>
    </div>
  )
}
