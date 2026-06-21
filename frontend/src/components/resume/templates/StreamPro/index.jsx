import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'
import ProjectCard from '../../shared/ProjectCard'
import ContactRow from '../../shared/ContactRow'

/**
 * StreamPro — two-column with section icons in the sidebar. A tighter
 * alternative to Modern Sidebar with metric chips instead of avatar.
 */
const ICONS = {
  Contact: '◐',
  Skills: '✦',
  Education: '◆',
  Certifications: '◇',
  Languages: '◍',
  Links: '↗',
}

export default function StreamPro() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

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
        display: 'grid',
        gridTemplateColumns: '62mm 1fr',
      }}
    >
      {/* ── Sidebar ── */}
      <aside
        style={{
          background: '#f0fdfa',
          padding: '14mm 8mm',
          borderRight: '0.5pt solid #ccfbf1',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: '20pt',
            fontWeight: 700,
            letterSpacing: '-0.5px',
            color: '#0f172a',
            lineHeight: 1.1,
          }}
        >
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <div style={{ marginTop: '2mm', fontSize: '10pt', color: '#0f766e', fontWeight: 500 }}>
            {personal.title}
          </div>
        )}

        <SidebarSection title="Contact" icon={ICONS.Contact}>
          {personal.email && <ContactRow label="Email" value={personal.email} valueColor="#0f172a" labelColor="#0f766e" />}
          {personal.phone && <ContactRow label="Phone" value={personal.phone} valueColor="#0f172a" labelColor="#0f766e" />}
          {personal.location && <ContactRow label="Location" value={personal.location} valueColor="#0f172a" labelColor="#0f766e" />}
          {personal.website && <ContactRow label="Web" value={personal.website} short valueColor="#0f172a" labelColor="#0f766e" />}
          {personal.linkedin && <ContactRow label="LinkedIn" value={personal.linkedin} short valueColor="#0f172a" labelColor="#0f766e" />}
          {personal.github && <ContactRow label="GitHub" value={personal.github} short valueColor="#0f172a" labelColor="#0f766e" />}
        </SidebarSection>

        {skills.length > 0 && (
          <SidebarSection title="Skills" icon={ICONS.Skills}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2mm' }}>
              {skills.map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: '9.5pt', fontWeight: 600 }}>{s.name}</div>
                  {s.level && (
                    <div style={{ fontSize: '8.5pt', color: '#0f766e' }}>{s.level}</div>
                  )}
                </div>
              ))}
            </div>
          </SidebarSection>
        )}

        {education.length > 0 && (
          <SidebarSection title="Education" icon={ICONS.Education}>
            {education.map((e, i) => (
              <div key={i} style={{ marginBottom: '2mm' }}>
                <div style={{ fontWeight: 600, fontSize: '9.5pt' }}>{e.degree}</div>
                <div style={{ color: '#0f766e', fontSize: '9pt' }}>{e.institution}</div>
                {e.period && <div style={{ color: '#6b7280', fontSize: '8.5pt' }}>{e.period}</div>}
              </div>
            ))}
          </SidebarSection>
        )}

        {certifications.length > 0 && (
          <SidebarSection title="Certifications" icon={ICONS.Certifications}>
            {certifications.map((c, i) => (
              <div key={i} style={{ marginBottom: '2mm' }}>
                <div style={{ fontWeight: 600, fontSize: '9.5pt' }}>{c.name}</div>
                <div style={{ color: '#0f766e', fontSize: '8.5pt' }}>
                  {[c.issuer, c.year].filter(Boolean).join(' · ')}
                </div>
              </div>
            ))}
          </SidebarSection>
        )}
      </aside>

      {/* ── Main ── */}
      <main style={{ padding: '14mm 12mm' }}>
        {personal.summary && (
          <Section title="Summary" accent="#0f766e">
            <p style={{ margin: 0, color: '#334155' }}>{personal.summary}</p>
          </Section>
        )}

        {experience.length > 0 && (
          <Section title="Experience" accent="#0f766e">
            {experience.map((e, i) => (
              <ExperienceRow
                key={i}
                exp={e}
                roleColor="#0f172a"
                companyColor="#0f766e"
                periodColor="#6b7280"
                bulletColor="#334155"
                fontSize="10pt"
              />
            ))}
          </Section>
        )}

        {projects.length > 0 && (
          <Section title="Projects" accent="#0f766e">
            {projects.map((p, i) => (
              <ProjectCard key={i} project={p} titleColor="#0f172a" descColor="#334155" techColor="#0f766e" fontSize="10pt" />
            ))}
          </Section>
        )}
      </main>
    </div>
  )
}

function SidebarSection({ title, icon, children }) {
  return (
    <section style={{ marginBottom: '7mm' }}>
      <h2
        style={{
          fontSize: '9pt',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          color: '#0f766e',
          margin: '0 0 3mm',
          display: 'flex',
          alignItems: 'center',
          gap: '2mm',
        }}
      >
        <span style={{ fontSize: '11pt' }}>{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  )
}
