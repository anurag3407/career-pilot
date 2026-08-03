import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'
import OrderedSections from '../../shared/OrderedSections'

/**
 * DenseProfessional — 9pt sans, info-packed two-column. Maximum density.
 */
export default function DenseProfessional() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

  const nodes = {
    summary: personal.summary ? (
      <Section title="Summary" accent="#1f2937" headingSize="9.5pt" spacing="Compact" uppercase={false}>
        <p style={{ margin: 0, color: '#374151' }}>{personal.summary}</p>
      </Section>
    ) : null,

    experience: experience.length > 0 ? (
      <Section title="Experience" accent="#1f2937" headingSize="9.5pt" uppercase={false}>
        {experience.map((e, i) => (
          <ExperienceRow
            key={i}
            exp={e}
            roleColor="#1f2937"
            companyColor="#1f2937"
            periodColor="#6b7280"
            bulletColor="#374151"
            fontSize="9pt"
          />
        ))}
      </Section>
    ) : null,

    projects: projects.length > 0 ? (
      <Section title="Projects" accent="#1f2937" headingSize="9.5pt" uppercase={false}>
        {projects.map((p, i) => (
          <div key={i} style={{ marginBottom: '2.5mm' }}>
            <strong style={{ fontSize: '9pt' }}>{p.title}</strong>
            {p.description && <div style={{ color: '#374151' }}>{p.description}</div>}
            {p.techStack.length > 0 && (
              <div style={{ color: '#6b7280', fontSize: '7.5pt' }}>{p.techStack.join(' · ')}</div>
            )}
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
        padding: '10mm 12mm',
        background: '#ffffff',
        color: '#1f2937',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '8.5pt',
        lineHeight: 1.4,
        display: 'grid',
        gridTemplateColumns: '62mm 1fr',
        gap: '5mm',
      }}
    >
      {/* ── Sidebar (acts as a fixed header slot) ── */}
      <aside style={{ borderRight: '0.5pt solid #e5e7eb', paddingRight: '4mm' }}>
        <h1 style={{ margin: 0, fontSize: '15pt', fontWeight: 700, color: '#1f2937', letterSpacing: '-0.3px', lineHeight: 1.15 }}>
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <p style={{ margin: '1.5mm 0 0', fontSize: '9pt', color: '#1f2937', fontWeight: 500 }}>
            {personal.title}
          </p>
        )}

        <SideTitle>Contact</SideTitle>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '8.5pt' }}>
          {personal.email && <ContactItem label="Email" value={personal.email} />}
          {personal.phone && <ContactItem label="Phone" value={personal.phone} />}
          {personal.location && <ContactItem label="Location" value={personal.location} />}
          {personal.website && <ContactItem label="Web" value={personal.website} short />}
          {personal.linkedin && <ContactItem label="LinkedIn" value={personal.linkedin} short />}
          {personal.github && <ContactItem label="GitHub" value={personal.github} short />}
        </ul>

        {skills.length > 0 && (
          <>
            <SideTitle>Skills</SideTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5mm' }}>
              {skills.map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8.5pt' }}>
                  <span style={{ fontWeight: 500 }}>{s.name}</span>
                  {s.level && <span style={{ color: '#6b7280' }}>{s.level}</span>}
                </div>
              ))}
            </div>
          </>
        )}

        {education.length > 0 && (
          <>
            <SideTitle>Education</SideTitle>
            {education.map((e, i) => (
              <div key={i} style={{ marginBottom: '2.5mm' }}>
                <strong style={{ fontSize: '9pt' }}>{e.degree}</strong>
                <div style={{ color: '#1f2937', fontSize: '8.5pt' }}>{e.institution}</div>
                <div style={{ color: '#6b7280', fontSize: '8pt' }}>{[e.period, e.location].filter(Boolean).join(' · ')}</div>
              </div>
            ))}
          </>
        )}

        {certifications.length > 0 && (
          <>
            <SideTitle>Certifications</SideTitle>
            {certifications.map((c, i) => (
              <div key={i} style={{ marginBottom: '2mm' }}>
                <strong style={{ fontSize: '8.5pt' }}>{c.name}</strong>
                <div style={{ color: '#6b7280', fontSize: '8pt' }}>
                  {[c.issuer, c.year].filter(Boolean).join(' · ')}
                </div>
              </div>
            ))}
          </>
        )}
      </aside>

      {/* ── Main ── */}
      <main>
        {/* ── Body sections (drag-and-drop order honored here) ── */}
        <OrderedSections
          nodes={nodes}
          sectionProps={{ accent: '#1f2937', uppercase: false }}
          customBodyStyle={{ color: '#374151' }}
        />
      </main>
    </div>
  )
}

function SideTitle({ children }) {
  return (
    <h2
      style={{
        fontSize: '8pt',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        color: '#1f2937',
        margin: '5mm 0 2mm',
        paddingBottom: '1mm',
        borderBottom: '0.5pt solid #e5e7eb',
      }}
    >
      {children}
    </h2>
  )
}

function ContactItem({ label, value, short }) {
  const display = short ? value.replace(/^https?:\/\//, '').replace(/^www\./, '') : value
  return (
    <li style={{ marginBottom: '1.5mm', lineHeight: 1.3 }}>
      <span style={{ color: '#6b7280', fontSize: '7pt', textTransform: 'uppercase', letterSpacing: '1px', display: 'block' }}>
        {label}
      </span>
      <span style={{ wordBreak: 'break-word' }}>{display}</span>
    </li>
  )
}