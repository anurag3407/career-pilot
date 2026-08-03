import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import KPICell from '../../shared/KPICell'
import ExperienceRow from '../../shared/ExperienceRow'
import OrderedSections from '../../shared/OrderedSections'

/**
 * KPIBoard — dashboard of 6 metric tiles at the top followed by content.
 * Synthesizes the "metrics at a glance" feel recruiters love.
 */
export default function KPIBoard() {
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
      <Section title="Summary" accent="#2563eb" uppercase={false}>
        <p style={{ margin: 0, color: '#334155' }}>{personal.summary}</p>
      </Section>
    ) : null,

    experience: experience.length > 0 ? (
      <Section title="Experience" accent="#2563eb" uppercase={false}>
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
    ) : null,

    skills: skills.length > 0 ? (
      <Section title="Skills" accent="#2563eb" uppercase={false}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1mm' }}>
          {skills.map((s, i) => (
            <span key={i} style={{ fontSize: '9pt', padding: '0.5mm 2mm', background: '#dbeafe', color: '#1e40af', borderRadius: 8, fontWeight: 500 }}>
              {s.name}
            </span>
          ))}
        </div>
      </Section>
    ) : null,

    projects: projects.length > 0 ? (
      <Section title="Selected Projects" accent="#2563eb" uppercase={false}>
        {projects.map((p, i) => (
          <div key={i} style={{ marginBottom: '3mm' }}>
            <strong>{p.title}</strong>
            {p.description && <div style={{ color: '#334155' }}>{p.description}</div>}
            {p.techStack.length > 0 && (
              <div style={{ color: '#2563eb', fontSize: '8.5pt', fontWeight: 500 }}>{p.techStack.join(' · ')}</div>
            )}
          </div>
        ))}
      </Section>
    ) : null,

    education: education.length > 0 ? (
      <Section title="Education" accent="#2563eb" uppercase={false}>
        {education.map((e, i) => (
          <div key={i} style={{ marginBottom: '2mm' }}>
            <strong>{e.institution}</strong>
            {e.degree && <span> · {e.degree}</span>}
            {e.period && <span style={{ color: '#6b7280' }}> · {e.period}</span>}
          </div>
        ))}
      </Section>
    ) : null,

    certifications: certifications.length > 0 ? (
      <Section title="Certifications" accent="#2563eb" uppercase={false}>
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
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '10pt',
        lineHeight: 1.5,
      }}
    >
      {/* ── Header (fixed) ── */}
      <header style={{ padding: '14mm 18mm 6mm' }}>
        <h1 style={{ margin: 0, fontSize: '26pt', fontWeight: 700, letterSpacing: '-0.5px' }}>
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <div style={{ marginTop: '1mm', fontSize: '12pt', color: '#2563eb', fontWeight: 500 }}>
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

      {/* ── KPI Dashboard (fixed header slot) ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '3mm',
          padding: '0 18mm 6mm',
        }}
      >
        <KPICell label="Years" value={yearsExp || '—'} bg="#dbeafe" fg="#1e40af" lbl="#2563eb" />
        <KPICell label="Projects Led" value={projects.length || 0} bg="#dbeafe" fg="#1e40af" lbl="#2563eb" />
        <KPICell label="Team Size" value="6+" bg="#dbeafe" fg="#1e40af" lbl="#2563eb" />
        <KPICell label="Skills" value={skills.length} bg="#dbeafe" fg="#1e40af" lbl="#2563eb" />
        <KPICell label="Certifications" value={certifications.length} bg="#dbeafe" fg="#1e40af" lbl="#2563eb" />
        <KPICell label="Industries" value="3" bg="#dbeafe" fg="#1e40af" lbl="#2563eb" />
      </div>

      <div style={{ padding: '4mm 18mm 12mm' }}>
        {/* ── Body sections (drag-and-drop order honored here) ── */}
        <OrderedSections
          nodes={nodes}
          sectionProps={{ accent: '#2563eb', uppercase: false }}
          customBodyStyle={{ color: '#334155' }}
        />
      </div>
    </div>
  )
}