import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'
import OrderedSections from '../../shared/OrderedSections'

/**
 * Boardroom — center-aligned summary, board-style header, gold accent.
 * Built for board directors, advisors, and senior finance professionals.
 */
export default function Boardroom() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

  const nodes = {
    summary: personal.summary ? (
      <Section title="Profile" accent="#b45309" variant="plain" uppercase={false}>
        <p style={{ margin: 0, textAlign: 'center', color: '#1c1917', fontStyle: 'italic' }}>{personal.summary}</p>
      </Section>
    ) : null,

    experience: experience.length > 0 ? (
      <Section title="Directorships & Executive Experience" accent="#b45309" uppercase={false}>
        {experience.map((e, i) => (
          <ExperienceRow
            key={i}
            exp={e}
            roleColor="#1c1917"
            companyColor="#b45309"
            periodColor="#78716c"
            bulletColor="#1c1917"
            fontSize="10.5pt"
          />
        ))}
      </Section>
    ) : null,

    education: education.length > 0 ? (
      <Section title="Education" accent="#b45309" uppercase={false}>
        {education.map((e, i) => (
          <div key={i} style={{ marginBottom: '2mm' }}>
            <strong>{e.institution}</strong> · {e.degree}
            {e.period && <span style={{ color: '#78716c' }}> · {e.period}</span>}
          </div>
        ))}
      </Section>
    ) : null,

    projects: projects.length > 0 ? (
      <Section title="Selected Engagements" accent="#b45309" uppercase={false}>
        {projects.map((p, i) => (
          <div key={i} style={{ marginBottom: '3mm' }}>
            <strong>{p.title}</strong>
            {p.description && <div style={{ color: '#1c1917' }}>{p.description}</div>}
          </div>
        ))}
      </Section>
    ) : null,

    skills: skills.length > 0 ? (
      <Section title="Areas of Expertise" accent="#b45309" uppercase={false}>
        <div style={{ color: '#1c1917', lineHeight: 1.7 }}>{skills.map((s) => s.name).join(' · ')}</div>
      </Section>
    ) : null,

    certifications: certifications.length > 0 ? (
      <Section title="Credentials" accent="#b45309" uppercase={false}>
        {certifications.map((c, i) => (
          <div key={i} style={{ marginBottom: '1.5mm' }}>
            <strong>{c.name}</strong>
            {c.issuer && <span> · {c.issuer}</span>}
            {c.year && <span style={{ color: '#78716c' }}> · {c.year}</span>}
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
        padding: '18mm 22mm',
        background: '#ffffff',
        color: '#1c1917',
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: '10.5pt',
        lineHeight: 1.5,
      }}
    >
      {/* ── Header (fixed) ── */}
      <header style={{ textAlign: 'center', marginBottom: '8mm', paddingBottom: '6mm', borderBottom: '1pt double #b45309' }}>
        <h1 style={{ margin: 0, fontSize: '26pt', fontWeight: 700, color: '#1c1917', letterSpacing: '1px' }}>
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <div style={{ marginTop: '2mm', fontSize: '12pt', color: '#b45309', fontStyle: 'italic' }}>
            {personal.title}
          </div>
        )}
        <div style={{ marginTop: '3mm', fontSize: '9.5pt', color: '#57534e', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1mm 6mm' }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>· {personal.phone}</span>}
          {personal.location && <span>· {personal.location}</span>}
          {personal.linkedin && <span>· {personal.linkedin}</span>}
        </div>
      </header>

      {/* ── Body sections (drag-and-drop order honored here) ── */}
      <OrderedSections
        nodes={nodes}
        sectionProps={{ accent: '#b45309', uppercase: false }}
        customBodyStyle={{ color: '#1c1917' }}
      />
    </div>
  )
}