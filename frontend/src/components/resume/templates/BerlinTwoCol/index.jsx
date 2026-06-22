import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'
import SkillBar from '../../shared/SkillBar'
import OrderedSections from '../../shared/OrderedSections'

/**
 * BerlinTwoCol — heavy left sidebar with skills heatmap. Berlin-startup
 * minimalist aesthetic.
 */
export default function BerlinTwoCol() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

  const nodes = {
    summary: personal.summary ? (
      <Section title="Profile" accent="#b45309" uppercase={false}>
        <p style={{ margin: 0, color: '#334155' }}>{personal.summary}</p>
      </Section>
    ) : null,

    experience: experience.length > 0 ? (
      <Section title="Experience" accent="#b45309" uppercase={false}>
        {experience.map((e, i) => (
          <ExperienceRow
            key={i}
            exp={e}
            roleColor="#0f172a"
            companyColor="#b45309"
            periodColor="#6b7280"
            bulletColor="#334155"
            fontSize="10pt"
          />
        ))}
      </Section>
    ) : null,

    projects: projects.length > 0 ? (
      <Section title="Projects" accent="#b45309" uppercase={false}>
        {projects.map((p, i) => (
          <div key={i} style={{ marginBottom: '3mm' }}>
            <strong>{p.title}</strong>
            {p.description && <div style={{ color: '#334155' }}>{p.description}</div>}
            {p.techStack.length > 0 && (
              <div style={{ color: '#b45309', fontSize: '8.5pt' }}>{p.techStack.join(' · ')}</div>
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
        background: '#ffffff',
        color: '#0f172a',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '10pt',
        lineHeight: 1.5,
        display: 'grid',
        gridTemplateColumns: '78mm 1fr',
      }}
    >
      {/* ── Sidebar (acts as a fixed header slot) ── */}
      <aside
        style={{
          background: '#fffbeb',
          padding: '14mm 8mm',
          borderRight: '1pt solid #fde68a',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '22pt', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <div style={{ marginTop: '2mm', fontSize: '11pt', color: '#b45309', fontWeight: 500 }}>
            {personal.title}
          </div>
        )}

        <SideTitle>Contact</SideTitle>
        <div style={{ fontSize: '9pt', color: '#0f172a', lineHeight: 1.7 }}>
          {personal.email && <div>{personal.email}</div>}
          {personal.phone && <div>{personal.phone}</div>}
          {personal.location && <div>{personal.location}</div>}
          {personal.website && <div style={{ wordBreak: 'break-word', color: '#b45309' }}>{personal.website.replace(/^https?:\/\//, '')}</div>}
          {personal.linkedin && <div style={{ wordBreak: 'break-word', color: '#b45309' }}>{personal.linkedin.replace(/^https?:\/\//, '')}</div>}
        </div>

        {skills.length > 0 && (
          <>
            <SideTitle>Skills Heatmap</SideTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2mm' }}>
              {skills.map((s, i) => (
                <SkillBar
                  key={i}
                  name={s.name}
                  level={s.level}
                  accent="#b45309"
                  track="#fde68a"
                />
              ))}
            </div>
          </>
        )}

        {education.length > 0 && (
          <>
            <SideTitle>Education</SideTitle>
            {education.map((e, i) => (
              <div key={i} style={{ marginBottom: '3mm' }}>
                <strong style={{ fontSize: '9.5pt' }}>{e.degree}</strong>
                <div style={{ color: '#b45309', fontSize: '9pt' }}>{e.institution}</div>
                <div style={{ color: '#6b7280', fontSize: '8.5pt' }}>{e.period}</div>
              </div>
            ))}
          </>
        )}

        {certifications.length > 0 && (
          <>
            <SideTitle>Certifications</SideTitle>
            {certifications.map((c, i) => (
              <div key={i} style={{ marginBottom: '2mm' }}>
                <strong style={{ fontSize: '9pt' }}>{c.name}</strong>
                <div style={{ color: '#6b7280', fontSize: '8.5pt' }}>
                  {[c.issuer, c.year].filter(Boolean).join(' · ')}
                </div>
              </div>
            ))}
          </>
        )}
      </aside>

      {/* ── Main ── */}
      <main style={{ padding: '14mm 12mm' }}>
        {/* ── Body sections (drag-and-drop order honored here) ── */}
        <OrderedSections
          nodes={nodes}
          sectionProps={{ accent: '#b45309', uppercase: false }}
          customBodyStyle={{ color: '#334155' }}
        />
      </main>
    </div>
  )
}

function SideTitle({ children }) {
  return (
    <h2
      style={{
        fontSize: '9pt',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        color: '#b45309',
        margin: '6mm 0 2mm',
        paddingBottom: '1mm',
        borderBottom: '0.5pt solid #fde68a',
      }}
    >
      {children}
    </h2>
  )
}