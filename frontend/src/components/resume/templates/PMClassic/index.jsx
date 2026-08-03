import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'
import OrderedSections from '../../shared/OrderedSections'

/**
 * PMClassic — project-management focused resume template.
 *
 * Puts a "KPI bar" up top (years experience + # of projects), then a
 * strong summary, experience with metrics-leading bullets, and a
 * certifications row at the bottom.
 */
export default function PMClassic() {
  const { personal, experience, education, projects, skills, certifications } =
    useResume()

  const yearsExp = (() => {
    if (!experience.length) return null
    const dates = experience
      .map(e => e.period)
      .filter(Boolean)
      .join(' ')
    const matches = dates.match(/(19|20)\d{2}/g)
    if (!matches || matches.length === 0) return null
    const min = Math.min(...matches.map(Number))
    const max = Math.max(...matches.map(Number))
    const span = Math.max(0, max - min)
    return span > 0 ? `${span}+` : null
  })()

  const projectCount = projects.length
    || experience.reduce((acc, e) => acc + (e.bullets?.length || 0), 0)

  const nodes = {
    summary: personal.summary ? (
      <Section title="Executive Summary" accent="#1e40af" uppercase={false}>
        <p style={{ margin: 0, color: '#334155', fontSize: '10.5pt' }}>{personal.summary}</p>
      </Section>
    ) : null,

    experience: experience.length > 0 ? (
      <Section title="Professional Experience" accent="#1e40af" uppercase={false}>
        {experience.map((e, i) => (
          <ExperienceRow
            key={i}
            exp={e}
            roleColor="#0f172a"
            companyColor="#1e40af"
            periodColor="#64748b"
            bulletColor="#334155"
            fontSize="10pt"
          />
        ))}
      </Section>
    ) : null,

    skills: skills.length > 0 ? (
      <Section title="Core Competencies" accent="#1e40af" uppercase={false}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1mm 4mm' }}>
          {skills.map((s, i) => (
            <div key={i} style={{ fontSize: '9.5pt' }}>
              <strong>{s.name}</strong>
              {s.level && <span style={{ color: '#64748b' }}> · {s.level}</span>}
            </div>
          ))}
        </div>
      </Section>
    ) : null,

    projects: projects.length > 0 ? (
      <Section title="Selected Projects" accent="#1e40af" uppercase={false}>
        {projects.map((p, i) => (
          <article key={i} style={{ marginBottom: '3mm' }}>
            <h3 style={{ margin: 0, fontSize: '10.5pt', fontWeight: 700 }}>{p.title}</h3>
            {p.description && <p style={{ margin: '0.5mm 0', color: '#334155' }}>{p.description}</p>}
            {p.techStack.length > 0 && (
              <div style={{ fontSize: '8.5pt', color: '#1e40af' }}>{p.techStack.join(' · ')}</div>
            )}
          </article>
        ))}
      </Section>
    ) : null,

    education: education.length > 0 ? (
      <Section title="Education" accent="#1e40af" uppercase={false}>
        {education.map((e, i) => (
          <div key={i} style={{ marginBottom: '2mm' }}>
            <strong>{e.institution}</strong>
            {e.degree && <span> — {e.degree}</span>}
            {e.period && <span style={{ color: '#64748b' }}> ({e.period})</span>}
          </div>
        ))}
      </Section>
    ) : null,

    certifications: certifications.length > 0 ? (
      <Section title="Certifications" accent="#1e40af" uppercase={false}>
        {certifications.map((c, i) => (
          <span
            key={i}
            style={{
              display: 'inline-block',
              marginRight: '2mm',
              marginBottom: '2mm',
              fontSize: '9pt',
              padding: '1mm 3mm',
              background: '#dbeafe',
              color: '#1e40af',
              borderRadius: 12,
              fontWeight: 500,
            }}
          >
            {c.name}{c.year ? ` · ${c.year}` : ''}
          </span>
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
        padding: '14mm 16mm',
        background: '#ffffff',
        color: '#1e293b',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: '10pt',
        lineHeight: 1.5,
      }}
    >
      {/* ── Header (fixed) ── */}
      <header style={{ marginBottom: '6mm' }}>
        <h1 style={{ margin: 0, fontSize: '28pt', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.5px' }}>
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <p style={{ margin: '2mm 0 0', fontSize: '12pt', color: '#1e40af', fontWeight: 500 }}>
            {personal.title}
          </p>
        )}
        <div style={{ marginTop: '3mm', fontSize: '9pt', color: '#475569', display: 'flex', flexWrap: 'wrap', gap: '1mm 5mm' }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>· {personal.phone}</span>}
          {personal.location && <span>· {personal.location}</span>}
          {personal.linkedin && <span>· {personal.linkedin}</span>}
        </div>
      </header>

      {/* ── KPI bar (fixed header slot) ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 0,
          background: '#1e40af',
          color: '#ffffff',
          borderRadius: 4,
          padding: '4mm 0',
          marginBottom: '7mm',
        }}
      >
        <KPI label="Years" value={yearsExp || '—'} />
        <KPI label="Projects Led" value={projectCount || 0} />
        <KPI label="Certifications" value={certifications.length || 0} />
      </div>

      {/* ── Body sections (drag-and-drop order honored here) ── */}
      <OrderedSections
        nodes={nodes}
        sectionProps={{ accent: '#1e40af', uppercase: false }}
        customBodyStyle={{ color: '#334155' }}
      />
    </div>
  )
}

function KPI({ label, value }) {
  return (
    <div style={{ textAlign: 'center', borderRight: '1px solid rgba(255,255,255,0.2)' }}>
      <div style={{ fontSize: '18pt', fontWeight: 700, color: '#ffffff' }}>{value}</div>
      <div style={{ fontSize: '8pt', color: '#bfdbfe', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '0.5mm' }}>
        {label}
      </div>
    </div>
  )
}