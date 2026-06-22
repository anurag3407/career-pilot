import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'
import ProjectCard from '../../shared/ProjectCard'
import OrderedSections from '../../shared/OrderedSections'

/**
 * CleanSingle — the most ATS-safe single-column possible. Pure semantic
 * HTML structure: h1/h2/p/ul/li with no decorative borders, no color
 * decoration, no italics-as-headings. Maximizes parser compatibility.
 */
export default function CleanSingle() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

  const nodes = {
    summary: personal.summary ? (
      <Section title="Summary" accent="#000000" uppercase={false}>
        <p style={{ margin: 0, color: '#000000' }}>{personal.summary}</p>
      </Section>
    ) : null,

    experience: experience.length > 0 ? (
      <Section title="Experience" accent="#000000" uppercase={false}>
        {experience.map((e, i) => (
          <ExperienceRow
            key={i}
            exp={e}
            roleColor="#000000"
            companyColor="#000000"
            periodColor="#000000"
            bulletColor="#000000"
            fontSize="11pt"
          />
        ))}
      </Section>
    ) : null,

    education: education.length > 0 ? (
      <Section title="Education" accent="#000000" uppercase={false}>
        {education.map((e, i) => (
          <ExperienceRow
            key={i}
            exp={{ ...e, role: e.institution, company: e.degree, bullets: [] }}
            roleColor="#000000"
            companyColor="#000000"
            periodColor="#000000"
            bulletColor="#000000"
            fontSize="11pt"
          />
        ))}
      </Section>
    ) : null,

    projects: projects.length > 0 ? (
      <Section title="Projects" accent="#000000" uppercase={false}>
        {projects.map((p, i) => (
          <ProjectCard
            key={i}
            project={p}
            titleColor="#000000"
            descColor="#000000"
            techColor="#000000"
            linkColor="#000000"
            fontSize="11pt"
          />
        ))}
      </Section>
    ) : null,

    skills: skills.length > 0 ? (
      <Section title="Skills" accent="#000000" uppercase={false}>
        <div style={{ color: '#000000' }}>{skills.map((s) => s.name).join(', ')}</div>
      </Section>
    ) : null,

    certifications: certifications.length > 0 ? (
      <Section title="Certifications" accent="#000000" uppercase={false}>
        {certifications.map((c, i) => (
          <div key={i} style={{ marginBottom: '1mm' }}>
            {c.name}{c.issuer ? ` — ${c.issuer}` : ''}{c.year ? ` (${c.year})` : ''}
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
        padding: '18mm 20mm',
        background: '#ffffff',
        color: '#000000',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: '11pt',
        lineHeight: 1.5,
      }}
    >
      {/* ── Header (fixed) ── */}
      <header style={{ marginBottom: '6mm' }}>
        <h1 style={{ margin: 0, fontSize: '20pt', fontWeight: 700, color: '#000000' }}>
          {personal.name || 'Your Name'}
        </h1>
        <div style={{ marginTop: '1mm', fontSize: '11pt', color: '#000000' }}>
          {personal.title}
        </div>
        <div style={{ marginTop: '2mm', fontSize: '10pt', color: '#000000' }}>
          {[personal.email, personal.phone, personal.location, personal.linkedin, personal.website].filter(Boolean).join(' | ')}
        </div>
      </header>

      {/* ── Body sections (drag-and-drop order honored here) ── */}
      <OrderedSections
        nodes={nodes}
        sectionProps={{ accent: '#000000', uppercase: false }}
        customBodyStyle={{ color: '#000000' }}
      />
    </div>
  )
}