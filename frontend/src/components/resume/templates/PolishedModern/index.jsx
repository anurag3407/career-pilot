import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'
import KPICell from '../../shared/KPICell'

/**
 * PolishedModern — top bar with the role and three quick stat tiles,
 * then dense content. Reads like a SaaS landing page applied to a resume.
 */
export default function PolishedModern() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

  const yearsExp = (() => {
    if (!experience.length) return null
    const matches = experience.map((e) => e.period).filter(Boolean).join(' ').match(/(19|20)\d{2}/g)
    if (!matches) return null
    const span = Math.max(...matches.map(Number)) - Math.min(...matches.map(Number))
    return span > 0 ? `${span}+` : null
  })()

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
      {/* ── Header bar ── */}
      <header
        style={{
          background: '#2563eb',
          backgroundImage: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 60%, #1e40af 100%)',
          color: '#ffffff',
          padding: '14mm 18mm 12mm',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '28pt', fontWeight: 700, letterSpacing: '-0.5px' }}>
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <div style={{ marginTop: '2mm', fontSize: '13pt', color: '#dbeafe', fontWeight: 400 }}>
            {personal.title}
          </div>
        )}
        <div style={{ marginTop: '4mm', fontSize: '9.5pt', color: '#dbeafe', display: 'flex', flexWrap: 'wrap', gap: '1mm 6mm' }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>· {personal.phone}</span>}
          {personal.location && <span>· {personal.location}</span>}
          {personal.website && <span>· {personal.website}</span>}
          {personal.linkedin && <span>· {personal.linkedin}</span>}
        </div>
      </header>

      {/* ── KPI strip ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '3mm',
          padding: '5mm 18mm',
          background: '#eff6ff',
        }}
      >
        <KPICell label="Years" value={yearsExp || '—'} bg="#2563eb" fg="#ffffff" lbl="#dbeafe" />
        <KPICell label="Projects" value={projects.length || experience.length || 0} bg="#2563eb" fg="#ffffff" lbl="#dbeafe" />
        <KPICell label="Certifications" value={certifications.length} bg="#2563eb" fg="#ffffff" lbl="#dbeafe" />
      </div>

      <div style={{ padding: '6mm 18mm 12mm' }}>
        {personal.summary && (
          <Section title="About" accent="#2563eb">
            <p style={{ margin: 0, color: '#334155' }}>{personal.summary}</p>
          </Section>
        )}

        {experience.length > 0 && (
          <Section title="Experience" accent="#2563eb">
            {experience.map((e, i) => (
              <ExperienceRow
                key={i}
                exp={e}
                roleColor="#0f172a"
                companyColor="#2563eb"
                periodColor="#6b7280"
                bulletColor="#334155"
                fontSize="10pt"
              />
            ))}
          </Section>
        )}

        {projects.length > 0 && (
          <Section title="Selected Projects" accent="#2563eb">
            {projects.map((p, i) => (
              <div key={i} style={{ marginBottom: '4mm' }}>
                <h3 style={{ margin: 0, fontSize: '10.5pt', fontWeight: 700, color: '#0f172a' }}>{p.title}</h3>
                {p.description && <p style={{ margin: '1mm 0', color: '#334155' }}>{p.description}</p>}
                {p.techStack.length > 0 && (
                  <div style={{ fontSize: '8.5pt', color: '#2563eb', fontWeight: 500 }}>
                    {p.techStack.join(' · ')}
                  </div>
                )}
              </div>
            ))}
          </Section>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: skills.length > 0 && education.length > 0 ? '1fr 1fr' : '1fr',
            gap: '8mm',
          }}
        >
          {education.length > 0 && (
            <Section title="Education" accent="#2563eb">
              {education.map((e, i) => (
                <div key={i} style={{ marginBottom: '2mm' }}>
                  <strong>{e.degree}</strong>
                  <div style={{ color: '#2563eb', fontSize: '9.5pt' }}>{e.institution}</div>
                  {e.period && <div style={{ color: '#6b7280', fontSize: '8.5pt' }}>{e.period}</div>}
                </div>
              ))}
            </Section>
          )}

          {skills.length > 0 && (
            <Section title="Skills" accent="#2563eb">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1mm 3mm' }}>
                {skills.map((s, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '8.5pt',
                      padding: '0.5mm 2mm',
                      background: '#dbeafe',
                      color: '#1e40af',
                      borderRadius: 8,
                      fontWeight: 500,
                    }}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </Section>
          )}
        </div>

        {certifications.length > 0 && (
          <Section title="Certifications" accent="#2563eb">
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
