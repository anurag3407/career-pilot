import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import KPICell from '../../shared/KPICell'
import OrderedSections from '../../shared/OrderedSections'

/**
 * SalesCloser — quota and percentage callouts. KPI strip at top with
 * quota attainment, deals closed, revenue generated.
 */
export default function SalesCloser() {
  const { personal, experience, education, skills, certifications } = useResume()

  const nodes = {
    summary: personal.summary ? (
      <Section title="Profile" accent="#b91c1c" uppercase={false}>
        <p style={{ margin: 0, color: '#334155' }}>{personal.summary}</p>
      </Section>
    ) : null,

    experience: experience.length > 0 ? (
      <Section title="Sales Record" accent="#b91c1c" uppercase={false}>
        {experience.map((e, i) => (
          <div key={i} style={{ marginBottom: '5mm' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <strong style={{ fontSize: '11pt', color: '#0f172a' }}>{e.role}</strong>
              {e.period && <span style={{ fontSize: '9pt', color: '#64748b' }}>{e.period}</span>}
            </div>
            <div style={{ fontSize: '10pt', color: '#b91c1c', fontWeight: 600 }}>
              {[e.company, e.location].filter(Boolean).join(' · ')}
            </div>
            {e.bullets.length > 0 && (
              <ul style={{ margin: '1.5mm 0 0', paddingLeft: '5mm', color: '#334155' }}>
                {e.bullets.map((b, j) => (
                  <li key={j} style={{ marginBottom: '0.5mm' }}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </Section>
    ) : null,

    skills: skills.length > 0 ? (
      <Section title="Skills & Tools" accent="#b91c1c" uppercase={false}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1mm' }}>
          {skills.map((s, i) => (
            <span key={i} style={{ fontSize: '9pt', padding: '0.5mm 2mm', background: '#fee2e2', color: '#b91c1c', borderRadius: 8, fontWeight: 500 }}>
              {s.name}
            </span>
          ))}
        </div>
      </Section>
    ) : null,

    education: education.length > 0 ? (
      <Section title="Education" accent="#b91c1c" uppercase={false}>
        {education.map((e, i) => (
          <div key={i} style={{ marginBottom: '2mm' }}>
            <strong>{e.institution}</strong> · {e.degree}
            {e.period && <span style={{ color: '#64748b' }}> · {e.period}</span>}
          </div>
        ))}
      </Section>
    ) : null,

    certifications: certifications.length > 0 ? (
      <Section title="Sales Training & Certifications" accent="#b91c1c" uppercase={false}>
        {certifications.map((c, i) => (
          <div key={i} style={{ marginBottom: '1.5mm' }}>
            <strong>{c.name}</strong>
            {c.issuer && <span> · {c.issuer}</span>}
            {c.year && <span style={{ color: '#64748b' }}> · {c.year}</span>}
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
      {/* ── Header (fixed) ── */}
      <header style={{ padding: '14mm 18mm 6mm' }}>
        <h1 style={{ margin: 0, fontSize: '28pt', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.5px' }}>
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <div style={{ marginTop: '1mm', fontSize: '13pt', color: '#b91c1c', fontWeight: 600 }}>
            {personal.title}
          </div>
        )}
        <div style={{ marginTop: '3mm', fontSize: '9.5pt', color: '#64748b', display: 'flex', flexWrap: 'wrap', gap: '1mm 5mm' }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>· {personal.phone}</span>}
          {personal.location && <span>· {personal.location}</span>}
          {personal.linkedin && <span>· {personal.linkedin}</span>}
        </div>
      </header>

      <div style={{ padding: '4mm 18mm 12mm' }}>
        {/* ── Body sections (drag-and-drop order honored here) ── */}
        <OrderedSections
          nodes={nodes}
          sectionProps={{ accent: '#b91c1c', uppercase: false }}
          customBodyStyle={{ color: '#334155' }}
          header={
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '3mm',
                padding: '0 0 6mm',
              }}
            >
              <KPICell label="Quota Attainment" value="128%" bg="#fee2e2" fg="#b91c1c" lbl="#b91c1c" />
              <KPICell label="Deals Closed" value="42" bg="#fee2e2" fg="#b91c1c" lbl="#b91c1c" />
              <KPICell label="Revenue" value="$2.4M" bg="#fee2e2" fg="#b91c1c" lbl="#b91c1c" />
              <KPICell label="Cycle Time" value="34d" bg="#fee2e2" fg="#b91c1c" lbl="#b91c1c" />
            </div>
          }
        />
      </div>
    </div>
  )
}