import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import KPICell from '../../shared/KPICell'
import Avatar from '../../shared/Avatar'
import OrderedSections from '../../shared/OrderedSections'

/**
 * RealEstateAgent — transactions closed tile dashboard. Photo-enabled.
 */
export default function RealEstateAgent() {
  const { personal, experience, education, skills, certifications } = useResume()

  const nodes = {
    summary: personal.summary ? (
      <Section title="Profile" accent="#047857" uppercase={false}>
        <p style={{ margin: 0, color: '#334155' }}>{personal.summary}</p>
      </Section>
    ) : null,

    experience: experience.length > 0 ? (
      <Section title="Career" accent="#047857" uppercase={false}>
        {experience.map((e, i) => (
          <div key={i} style={{ marginBottom: '5mm' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <strong style={{ fontSize: '11pt', color: '#0f172a' }}>{e.role}</strong>
              {e.period && <span style={{ fontSize: '9pt', color: '#64748b' }}>{e.period}</span>}
            </div>
            <div style={{ fontSize: '10pt', color: '#047857', fontWeight: 500 }}>
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
      <Section title="Specialties" accent="#047857" uppercase={false}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1mm' }}>
          {skills.map((s, i) => (
            <span key={i} style={{ fontSize: '9pt', padding: '0.5mm 2mm', background: '#d1fae5', color: '#047857', borderRadius: 12, fontWeight: 500 }}>
              {s.name}
            </span>
          ))}
        </div>
      </Section>
    ) : null,

    education: education.length > 0 ? (
      <Section title="Education" accent="#047857" uppercase={false}>
        {education.map((e, i) => (
          <div key={i} style={{ marginBottom: '2mm' }}>
            <strong>{e.degree}</strong> · {e.institution}
            {e.period && <span style={{ color: '#64748b' }}> · {e.period}</span>}
          </div>
        ))}
      </Section>
    ) : null,

    certifications: certifications.length > 0 ? (
      <Section title="Licenses & Certifications" accent="#047857" uppercase={false}>
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
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '10pt',
        lineHeight: 1.5,
      }}
    >
      {/* ── Photo header (fixed) ── */}
      <header
        style={{
          background: 'linear-gradient(135deg, #047857 0%, #065f46 60%, #064e3b 100%)',
          color: '#ffffff',
          padding: '10mm 18mm',
          display: 'grid',
          gridTemplateColumns: '28mm 1fr',
          gap: '8mm',
          alignItems: 'center',
        }}
      >
        <Avatar sizeMm={26} accent="#064e3b" bg="#a7f3d0" fontSize="14pt" />
        <div>
          <h1 style={{ margin: 0, fontSize: '26pt', fontWeight: 700, letterSpacing: '-0.5px' }}>
            {personal.name || 'Your Name'}
          </h1>
          {personal.title && (
            <div style={{ marginTop: '2mm', fontSize: '12pt', color: '#a7f3d0' }}>
              {personal.title}
            </div>
          )}
          <div style={{ marginTop: '3mm', fontSize: '9.5pt', color: '#d1fae5', display: 'flex', flexWrap: 'wrap', gap: '1mm 5mm' }}>
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>· {personal.phone}</span>}
            {personal.location && <span>· {personal.location}</span>}
            {personal.linkedin && <span>· {personal.linkedin}</span>}
          </div>
        </div>
      </header>

      <div style={{ padding: '4mm 18mm 12mm' }}>
        {/* ── Body sections (drag-and-drop order honored here) ── */}
        <OrderedSections
          nodes={nodes}
          sectionProps={{ accent: '#047857', uppercase: false }}
          customBodyStyle={{ color: '#334155' }}
          header={
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '3mm', padding: '5mm 0', marginBottom: '4mm' }}>
              <KPICell label="Transactions" value="156" bg="#047857" fg="#ffffff" lbl="#a7f3d0" />
              <KPICell label="Volume" value="$48M" bg="#047857" fg="#ffffff" lbl="#a7f3d0" />
              <KPICell label="Avg DOM" value="32d" bg="#047857" fg="#ffffff" lbl="#a7f3d0" />
              <KPICell label="List-to-Sale" value="99%" bg="#047857" fg="#ffffff" lbl="#a7f3d0" />
            </div>
          }
        />
      </div>
    </div>
  )
}