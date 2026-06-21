import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'
import ProjectCard from '../../shared/ProjectCard'

/**
 * IvyLeague — Harvard-style single-column resume. Education-first with a
 * centered, traditional serif header. Designed for academic / entry-level
 * professional roles where education matters most.
 */
export default function IvyLeague() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

  return (
    <div
      className="resume-export-root"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '20mm 22mm',
        background: '#ffffff',
        color: '#111827',
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: '10.5pt',
        lineHeight: 1.5,
      }}
    >
      {/* ── Header ── */}
      <header style={{ textAlign: 'center', marginBottom: '8mm' }}>
        <h1 style={{ margin: 0, fontSize: '26pt', fontWeight: 700, letterSpacing: '1.5px', color: '#0f172a' }}>
          {personal.name || 'Your Name'}
        </h1>
        <div style={{ marginTop: '2mm', fontSize: '10pt', color: '#1f2937', fontStyle: 'italic' }}>
          {personal.title}
        </div>
        <div
          style={{
            marginTop: '3mm',
            fontSize: '9.5pt',
            color: '#374151',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1mm 5mm',
          }}
        >
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>· {personal.phone}</span>}
          {personal.location && <span>· {personal.location}</span>}
          {personal.website && <span>· {personal.website}</span>}
          {personal.linkedin && <span>· {personal.linkedin}</span>}
        </div>
      </header>

      <hr style={{ border: 'none', borderTop: '1.5pt solid #111827', margin: '0 0 6mm' }} />

      {personal.summary && (
        <Section title="Summary" accent="#111827" variant="plain">
          <p style={{ margin: 0, textAlign: 'center', fontStyle: 'italic', color: '#1f2937' }}>
            {personal.summary}
          </p>
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education" accent="#111827">
          {education.map((e, i) => (
            <div key={i} style={{ marginBottom: '4mm' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: '11.5pt', color: '#0f172a' }}>{e.institution || 'Institution'}</strong>
                {e.period && <span style={{ fontStyle: 'italic', color: '#374151', fontSize: '10pt' }}>{e.period}</span>}
              </div>
              <div style={{ fontStyle: 'italic', fontSize: '10pt', color: '#1f2937' }}>
                {[e.degree, e.location].filter(Boolean).join(', ')}
              </div>
              {e.description && (
                <p style={{ margin: '1.5mm 0 0', color: '#374151', fontSize: '10pt' }}>{e.description}</p>
              )}
            </div>
          ))}
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Experience" accent="#111827">
          {experience.map((e, i) => (
            <ExperienceRow
              key={i}
              exp={e}
              roleColor="#0f172a"
              companyColor="#1f2937"
              periodColor="#374151"
              bulletColor="#1f2937"
              fontSize="10pt"
            />
          ))}
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Projects" accent="#111827">
          {projects.map((p, i) => (
            <ProjectCard
              key={i}
              project={p}
              titleColor="#0f172a"
              descColor="#1f2937"
              techColor="#374151"
              linkColor="#1f2937"
              fontSize="10pt"
            />
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills & Interests" accent="#111827">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1mm 4mm' }}>
            {skills.map((s, i) => (
              <span key={i} style={{ fontSize: '10pt' }}>
                <strong>{s.name}</strong>
                {s.level && <span style={{ color: '#6b7280' }}> ({s.level})</span>}
                {i < skills.length - 1 && <span style={{ color: '#9ca3af' }}> · </span>}
              </span>
            ))}
          </div>
        </Section>
      )}

      {certifications.length > 0 && (
        <Section title="Certifications" accent="#111827">
          {certifications.map((c, i) => (
            <div key={i} style={{ marginBottom: '1.5mm', fontSize: '10pt' }}>
              <strong>{c.name}</strong>
              {c.issuer && <span> · {c.issuer}</span>}
              {c.year && <span style={{ color: '#6b7280' }}> · {c.year}</span>}
            </div>
          ))}
        </Section>
      )}
    </div>
  )
}
