import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'
import Avatar from '../../shared/Avatar'
import KPICell from '../../shared/KPICell'
import OrderedSections from '../../shared/OrderedSections'

/**
 * CSuite — full-bleed photo band plus KPI strip. The most senior of the
 * photo-enabled templates. Falls back to initials avatar when no photo.
 */
export default function CSuite() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

  const yearsExp = (() => {
    if (!experience.length) return null
    const matches = experience.map((e) => e.period).filter(Boolean).join(' ').match(/(19|20)\d{2}/g)
    if (!matches) return null
    const span = Math.max(...matches.map(Number)) - Math.min(...matches.map(Number))
    return span > 0 ? `${span}+` : null
  })()

  const nodes = {
    summary: personal.summary ? (
      <Section title="Executive Summary" accent="#4338ca" uppercase={false}>
        <p style={{ margin: 0, color: '#334155' }}>{personal.summary}</p>
      </Section>
    ) : null,

    experience: experience.length > 0 ? (
      <Section title="Experience" accent="#4338ca" uppercase={false}>
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
    ) : null,

    education: education.length > 0 ? (
      <Section title="Education" accent="#4338ca" uppercase={false}>
        {education.map((e, i) => (
          <div key={i} style={{ marginBottom: '2mm' }}>
            <strong>{e.institution}</strong>
            {e.degree && <span> · {e.degree}</span>}
            {e.period && <span style={{ color: '#6b7280' }}> · {e.period}</span>}
          </div>
        ))}
      </Section>
    ) : null,

    projects: projects.length > 0 ? (
      <Section title="Selected Initiatives" accent="#4338ca" uppercase={false}>
        {projects.map((p, i) => (
          <div key={i} style={{ marginBottom: '3mm' }}>
            <strong>{p.title}</strong>
            {p.description && <div style={{ color: '#334155' }}>{p.description}</div>}
          </div>
        ))}
      </Section>
    ) : null,

    skills: skills.length > 0 ? (
      <Section title="Areas of Expertise" accent="#4338ca" uppercase={false}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1mm 3mm' }}>
          {skills.map((s, i) => (
            <span
              key={i}
              style={{
                fontSize: '9pt',
                padding: '0.5mm 2mm',
                background: '#e0e7ff',
                color: '#1e1b4b',
                borderRadius: 8,
                fontWeight: 500,
              }}
            >
              {s.name}
            </span>
          ))}
        </div>
      </Section>
    ) : null,

    certifications: certifications.length > 0 ? (
      <Section title="Credentials" accent="#4338ca" uppercase={false}>
        {certifications.map((c, i) => (
          <div key={i} style={{ marginBottom: '1.5mm' }}>
            <strong>{c.name}</strong>
            {c.issuer && <span> · {c.issuer}</span>}
            {c.year && <span style={{ color: '#6b7280' }}> · {c.year}</span>}
          </div>
        ))}
      </Section>
    ) : null,
  }

  return (
    <div
      className="resume-export-root"
      style={{
        width: '210mm',
        minHeight: '297mm',
        background: '#ffffff',
        color: '#0f172a',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: '10pt',
        lineHeight: 1.5,
      }}
    >
      {/* ── Photo band (fixed) ── */}
      <header
        style={{
          background: 'linear-gradient(135deg, #4338ca 0%, #1e1b4b 60%, #0f172a 100%)',
          color: '#ffffff',
          padding: '12mm 18mm',
          display: 'grid',
          gridTemplateColumns: '34mm 1fr',
          gap: '8mm',
          alignItems: 'center',
        }}
      >
        <Avatar sizeMm={30} accent="#0f172a" bg="#e0e7ff" fontSize="16pt" />
        <div>
          <h1 style={{ margin: 0, fontSize: '28pt', fontWeight: 700, letterSpacing: '-0.5px' }}>
            {personal.name || 'Your Name'}
          </h1>
          {personal.title && (
            <div style={{ marginTop: '2mm', fontSize: '13pt', color: '#e0e7ff', fontWeight: 400 }}>
              {personal.title}
            </div>
          )}
          <div style={{ marginTop: '3mm', fontSize: '9.5pt', color: '#e0e7ff', display: 'flex', flexWrap: 'wrap', gap: '1mm 5mm' }}>
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>· {personal.phone}</span>}
            {personal.location && <span>· {personal.location}</span>}
            {personal.linkedin && <span>· {personal.linkedin}</span>}
          </div>
        </div>
      </header>

      <div style={{ padding: '6mm 18mm 12mm' }}>
        <OrderedSections
          nodes={nodes}
          sectionProps={{ accent: '#4338ca', uppercase: false }}
          customBodyStyle={{ color: '#334155' }}
          header={
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '3mm',
                marginBottom: '6mm',
                padding: '5mm',
                background: '#eef2ff',
                borderRadius: 4,
              }}
            >
              <KPICell label="Years" value={yearsExp || '—'} bg="#4338ca" fg="#ffffff" lbl="#c7d2fe" />
              <KPICell label="Leadership Roles" value={experience.length} bg="#4338ca" fg="#ffffff" lbl="#c7d2fe" />
              <KPICell label="Credentials" value={certifications.length} bg="#4338ca" fg="#ffffff" lbl="#c7d2fe" />
            </div>
          }
        />
      </div>
    </div>
  )
}