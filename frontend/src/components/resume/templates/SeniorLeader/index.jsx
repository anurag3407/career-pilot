import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'
import Avatar from '../../shared/Avatar'

/**
 * SeniorLeader — large initials/portrait plus dense experience.
 * Two-column at the top (avatar + summary) flowing into single-column body.
 */
export default function SeniorLeader() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

  return (
    <div
      className="resume-export-root"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '16mm 18mm',
        background: '#ffffff',
        color: '#1f2937',
        fontFamily: '"Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif',
        fontSize: '10.5pt',
        lineHeight: 1.55,
      }}
    >
      {/* ── Hero block ── */}
      <header
        style={{
          display: 'grid',
          gridTemplateColumns: '40mm 1fr',
          gap: '8mm',
          paddingBottom: '6mm',
          marginBottom: '6mm',
          borderBottom: '0.5pt solid #d6d3d1',
          alignItems: 'center',
        }}
      >
        <Avatar sizeMm={36} accent="#1f2937" bg="#e7e5e4" fontSize="18pt" />
        <div>
          <h1 style={{ margin: 0, fontSize: '30pt', fontWeight: 700, color: '#1f2937', letterSpacing: '-0.5px', lineHeight: 1.05 }}>
            {personal.name || 'Your Name'}
          </h1>
          {personal.title && (
            <div style={{ marginTop: '2mm', fontSize: '13pt', color: '#57534e', fontStyle: 'italic' }}>
              {personal.title}
            </div>
          )}
          <div style={{ marginTop: '3mm', fontSize: '9.5pt', color: '#57534e', display: 'flex', flexWrap: 'wrap', gap: '1mm 5mm' }}>
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>· {personal.phone}</span>}
            {personal.location && <span>· {personal.location}</span>}
            {personal.linkedin && <span>· {personal.linkedin}</span>}
            {personal.website && <span>· {personal.website}</span>}
          </div>
        </div>
      </header>

      {personal.summary && (
        <Section title="Summary" accent="#1f2937" variant="plain" spacing="Compact">
          <p style={{ margin: 0, fontStyle: 'italic', color: '#1f2937' }}>{personal.summary}</p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Experience" accent="#1f2937">
          {experience.map((e, i) => (
            <div key={i} style={{ marginBottom: '5mm' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: '12pt', color: '#1f2937' }}>{e.role}</strong>
                {e.period && <span style={{ fontSize: '10pt', color: '#57534e', fontStyle: 'italic' }}>{e.period}</span>}
              </div>
              <div style={{ fontSize: '10.5pt', color: '#57534e', fontStyle: 'italic' }}>
                {[e.company, e.location].filter(Boolean).join(', ')}
              </div>
              {e.bullets.length > 0 && (
                <ul style={{ margin: '1.5mm 0 0', paddingLeft: '5mm', color: '#1f2937' }}>
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
        <Section title="Education" accent="#1f2937">
          {education.map((e, i) => (
            <div key={i} style={{ marginBottom: '2mm' }}>
              <strong>{e.degree}</strong> — {e.institution}
              {e.period && <span style={{ color: '#57534e' }}> · {e.period}</span>}
            </div>
          ))}
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Selected Engagements" accent="#1f2937">
          {projects.map((p, i) => (
            <div key={i} style={{ marginBottom: '3mm' }}>
              <strong>{p.title}</strong>
              {p.description && <div style={{ color: '#1f2937' }}>{p.description}</div>}
            </div>
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Core Competencies" accent="#1f2937">
          <div style={{ color: '#1f2937', lineHeight: 1.7 }}>{skills.map((s) => s.name).join(' · ')}</div>
        </Section>
      )}

      {certifications.length > 0 && (
        <Section title="Certifications" accent="#1f2937">
          {certifications.map((c, i) => (
            <div key={i} style={{ marginBottom: '1.5mm' }}>
              <strong>{c.name}</strong>
              {c.issuer && <span> · {c.issuer}</span>}
              {c.year && <span style={{ color: '#57534e' }}> · {c.year}</span>}
            </div>
          ))}
        </Section>
      )}
    </div>
  )
}
