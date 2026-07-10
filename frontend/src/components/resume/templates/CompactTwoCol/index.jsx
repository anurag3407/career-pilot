import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'
import OrderedSections from '../../shared/OrderedSections'

/**
 * Compact Two-Column — dense, info-packed layout for experienced candidates.
 *
 * Left sidebar (~30%): contact, skills, education, certifications.
 * Right main (~70%): summary, experience, projects.
 *
 * Designed to fit experienced candidates (10+ years) on 2 pages max.
 */
export default function CompactTwoCol() {
  const { personal, experience, education, projects, skills, certifications } =
    useResume()

  const nodes = {
    summary: personal.summary ? (
      <Section title="Summary" accent="#7c3aed" uppercase={false}>
        <p style={{ margin: 0, color: '#374151' }}>{personal.summary}</p>
      </Section>
    ) : null,

    experience: experience.length > 0 ? (
      <Section title="Experience" accent="#7c3aed" uppercase={false}>
        {experience.map((e, i) => (
          <ExperienceRow
            key={i}
            exp={e}
            roleColor="#1e1b4b"
            companyColor="#7c3aed"
            periodColor="#6b7280"
            bulletColor="#374151"
            fontSize="9pt"
          />
        ))}
      </Section>
    ) : null,

    projects: projects.length > 0 ? (
      <Section title="Projects" accent="#7c3aed" uppercase={false}>
        {projects.map((p, i) => (
          <article key={i} style={{ marginBottom: '3mm' }}>
            <h3 style={{ margin: 0, fontSize: '10pt', fontWeight: 700 }}>{p.title}</h3>
            {p.description && <p style={{ margin: '0.8mm 0', color: '#374151' }}>{p.description}</p>}
            {p.techStack.length > 0 && (
              <div style={{ fontSize: '8pt', color: '#7c3aed' }}>{p.techStack.join(' · ')}</div>
            )}
          </article>
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
        padding: '12mm 12mm',
        background: '#ffffff',
        color: '#1e1b4b',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '9pt',
        lineHeight: 1.45,
        display: 'grid',
        gridTemplateColumns: '58mm 1fr',
        gap: '6mm',
      }}
    >
      {/* ── Sidebar (acts as a fixed header slot) ── */}
      <aside style={{ borderRight: '0.5pt solid #ede9fe', paddingRight: '5mm' }}>
        <h1
          style={{
            margin: 0,
            fontSize: '17pt',
            fontWeight: 700,
            letterSpacing: '-0.3px',
            lineHeight: 1.15,
            color: '#1e1b4b',
          }}
        >
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <p
            style={{
              margin: '2mm 0 0',
              fontSize: '9.5pt',
              color: '#7c3aed',
              fontWeight: 500,
            }}
          >
            {personal.title}
          </p>
        )}

        <SideTitle>Contact</SideTitle>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {personal.email && <ContactItem label="@" value={personal.email} />}
          {personal.phone && <ContactItem label="☎" value={personal.phone} />}
          {personal.location && <ContactItem label="◆" value={personal.location} />}
          {personal.website && <ContactItem label="◉" value={personal.website} short />}
          {personal.linkedin && <ContactItem label="in" value={personal.linkedin} short />}
          {personal.github && <ContactItem label="gh" value={personal.github} short />}
        </ul>

        {skills.length > 0 && (
          <>
            <SideTitle>Skills</SideTitle>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5mm' }}>
              {skills.map((s, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '8pt',
                    padding: '0.8mm 2mm',
                    background: '#ede9fe',
                    color: '#5b21b6',
                    borderRadius: '2mm',
                    fontWeight: 500,
                  }}
                >
                  {s.name}
                </span>
              ))}
            </div>
          </>
        )}

        {education.length > 0 && (
          <>
            <SideTitle>Education</SideTitle>
            {education.map((e, i) => (
              <div key={i} style={{ marginBottom: '3mm' }}>
                <div style={{ fontWeight: 600, color: '#1e1b4b' }}>{e.degree}</div>
                <div style={{ color: '#7c3aed', fontSize: '8.5pt' }}>{e.institution}</div>
                <div style={{ color: '#6b7280', fontSize: '8pt' }}>
                  {[e.period, e.location].filter(Boolean).join(' · ')}
                </div>
              </div>
            ))}
          </>
        )}

        {certifications.length > 0 && (
          <>
            <SideTitle>Certifications</SideTitle>
            {certifications.map((c, i) => (
              <div key={i} style={{ marginBottom: '2mm' }}>
                <div style={{ fontWeight: 600 }}>{c.name}</div>
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
          sectionProps={{ accent: '#7c3aed', uppercase: false }}
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
        fontSize: '8.5pt',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        color: '#7c3aed',
        margin: '6mm 0 2mm',
        paddingBottom: '1mm',
        borderBottom: '0.5pt solid #ddd6fe',
      }}
    >
      {children}
    </h2>
  )
}

function ContactItem({ label, value, short }) {
  const display = short
    ? value.replace(/^https?:\/\//, '').replace(/^www\./, '')
    : value
  return (
    <li
      style={{
        display: 'grid',
        gridTemplateColumns: '5mm 1fr',
        gap: '1mm',
        marginBottom: '1.5mm',
        alignItems: 'start',
        fontSize: '8pt',
      }}
    >
      <span style={{ color: '#7c3aed', fontWeight: 700, textAlign: 'center' }}>{label}</span>
      <span style={{ wordBreak: 'break-word' }}>{display}</span>
    </li>
  )
}