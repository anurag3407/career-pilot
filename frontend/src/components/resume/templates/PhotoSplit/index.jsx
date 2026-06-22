import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'
import Avatar from '../../shared/Avatar'
import OrderedSections from '../../shared/OrderedSections'

/**
 * PhotoSplit — 50/50 split, photo left, content right.
 */
export default function PhotoSplit() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

  const nodes = {
    summary: personal.summary ? (
      <Section title="About" accent="#7c3aed" uppercase={false}>
        <p style={{ margin: 0, color: '#374151' }}>{personal.summary}</p>
      </Section>
    ) : null,

    experience: experience.length > 0 ? (
      <Section title="Experience" accent="#7c3aed" uppercase={false}>
        {experience.map((e, i) => (
          <ExperienceRow
            key={i}
            exp={e}
            roleColor="#1f2937"
            companyColor="#7c3aed"
            periodColor="#6b7280"
            bulletColor="#374151"
            fontSize="10pt"
          />
        ))}
      </Section>
    ) : null,

    projects: projects.length > 0 ? (
      <Section title="Projects" accent="#7c3aed" uppercase={false}>
        {projects.map((p, i) => (
          <div key={i} style={{ marginBottom: '3mm' }}>
            <strong>{p.title}</strong>
            {p.description && <div style={{ color: '#374151' }}>{p.description}</div>}
            {p.techStack.length > 0 && (
              <div style={{ color: '#7c3aed', fontSize: '8.5pt' }}>{p.techStack.join(' · ')}</div>
            )}
            {p.link && <div style={{ color: '#7c3aed', fontSize: '8.5pt' }}>{p.link}</div>}
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
        color: '#1f2937',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '10pt',
        lineHeight: 1.5,
        display: 'grid',
        gridTemplateColumns: '95mm 1fr',
      }}
    >
      {/* ── Left photo + sidebar (fixed header slot) ── */}
      <aside style={{ background: '#f5f3ff', padding: '10mm 8mm', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar sizeMm={60} accent="#7c3aed" bg="#ddd6fe" fontSize="32pt" style={{ marginBottom: '6mm' }} />
        <h1 style={{ margin: 0, fontSize: '20pt', fontWeight: 700, color: '#1f2937', letterSpacing: '-0.5px', textAlign: 'center' }}>
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <div style={{ marginTop: '2mm', fontSize: '11pt', color: '#7c3aed', textAlign: 'center', fontWeight: 500 }}>
            {personal.title}
          </div>
        )}
        <div style={{ marginTop: '4mm', fontSize: '9pt', color: '#6b7280', textAlign: 'center', lineHeight: 1.6 }}>
          {personal.email && <div>{personal.email}</div>}
          {personal.phone && <div>{personal.phone}</div>}
          {personal.location && <div>{personal.location}</div>}
          {personal.website && <div style={{ wordBreak: 'break-word' }}>{personal.website.replace(/^https?:\/\//, '')}</div>}
          {personal.linkedin && <div style={{ color: '#7c3aed' }}>{personal.linkedin.replace(/^https?:\/\//, '')}</div>}
        </div>

        {skills.length > 0 && (
          <div style={{ marginTop: '8mm', width: '100%' }}>
            <h2 style={{ fontSize: '9pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#7c3aed', margin: '0 0 3mm', paddingBottom: '1mm', borderBottom: '0.5pt solid #ddd6fe' }}>
              Skills
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1mm' }}>
              {skills.map((s, i) => (
                <span key={i} style={{ fontSize: '8.5pt', padding: '0.5mm 2mm', background: '#ede9fe', color: '#5b21b6', borderRadius: 12, fontWeight: 500 }}>
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div style={{ marginTop: '6mm', width: '100%' }}>
            <h2 style={{ fontSize: '9pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#7c3aed', margin: '0 0 3mm', paddingBottom: '1mm', borderBottom: '0.5pt solid #ddd6fe' }}>
              Education
            </h2>
            {education.map((e, i) => (
              <div key={i} style={{ marginBottom: '2mm' }}>
                <strong style={{ fontSize: '9.5pt' }}>{e.degree}</strong>
                <div style={{ color: '#7c3aed', fontSize: '9pt' }}>{e.institution}</div>
                <div style={{ color: '#6b7280', fontSize: '8.5pt' }}>{e.period}</div>
              </div>
            ))}
          </div>
        )}

        {certifications.length > 0 && (
          <div style={{ marginTop: '6mm', width: '100%' }}>
            <h2 style={{ fontSize: '9pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#7c3aed', margin: '0 0 3mm', paddingBottom: '1mm', borderBottom: '0.5pt solid #ddd6fe' }}>
              Certifications
            </h2>
            {certifications.map((c, i) => (
              <div key={i} style={{ marginBottom: '1.5mm', fontSize: '9pt' }}>
                <strong>{c.name}</strong>
                <div style={{ color: '#6b7280', fontSize: '8.5pt' }}>
                  {[c.issuer, c.year].filter(Boolean).join(' · ')}
                </div>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* ── Main content (order-aware body) ── */}
      <main style={{ padding: '10mm 14mm' }}>
        {/* ── Body sections (drag-and-drop order honored here) ── */}
        <OrderedSections
          nodes={nodes}
          sectionProps={{ accent: '#7c3aed', uppercase: false }}
          customBodyStyle={{ color: '#374151' }}
        />
      </main>
    </div>
  )
}