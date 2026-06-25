import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'
import OrderedSections from '../../shared/OrderedSections'

/**
 * TokyoCompact — JP-inspired compact layout with vertical text accents.
 * Vertical Japanese-style typography decorations on the left margin.
 */
export default function TokyoCompact() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

  const nodes = {
    summary: personal.summary ? (
      <Section title="Summary" accent="#be185d" uppercase={false}>
        <p style={{ margin: 0, color: '#334155' }}>{personal.summary}</p>
      </Section>
    ) : null,

    experience: experience.length > 0 ? (
      <Section title="Experience" accent="#be185d" uppercase={false}>
        {experience.map((e, i) => (
          <ExperienceRow
            key={i}
            exp={e}
            roleColor="#1f2937"
            companyColor="#be185d"
            periodColor="#6b7280"
            bulletColor="#334155"
            fontSize="9.5pt"
          />
        ))}
      </Section>
    ) : null,

    education: education.length > 0 ? (
      <Section title="Education" accent="#be185d" uppercase={false}>
        {education.map((e, i) => (
          <div key={i} style={{ marginBottom: '2mm' }}>
            <strong>{e.degree}</strong> · {e.institution}
            {e.period && <span style={{ color: '#6b7280' }}> · {e.period}</span>}
          </div>
        ))}
      </Section>
    ) : null,

    projects: projects.length > 0 ? (
      <Section title="Projects" accent="#be185d" uppercase={false}>
        {projects.map((p, i) => (
          <div key={i} style={{ marginBottom: '3mm' }}>
            <strong>{p.title}</strong>
            {p.description && <div style={{ color: '#334155' }}>{p.description}</div>}
            {p.techStack.length > 0 && (
              <div style={{ color: '#be185d', fontSize: '8.5pt' }}>{p.techStack.join(' · ')}</div>
            )}
          </div>
        ))}
      </Section>
    ) : null,

    skills: skills.length > 0 ? (
      <Section title="Skills" accent="#be185d" uppercase={false}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1mm' }}>
          {skills.map((s, i) => (
            <span key={i} style={{ fontSize: '8.5pt', padding: '0.5mm 2mm', background: '#fce7f3', color: '#9d174d', borderRadius: 12, fontWeight: 500 }}>
              {s.name}
            </span>
          ))}
        </div>
      </Section>
    ) : null,

    certifications: certifications.length > 0 ? (
      <Section title="Certifications" accent="#be185d" uppercase={false}>
        {certifications.map((c, i) => (
          <div key={i} style={{ marginBottom: '1.5mm' }}>
            <strong>{c.name}</strong>
            {c.issuer && <span> · {c.issuer}</span>}
            {c.year && <span style={{ color: '#6b7280' }}> · {c.year}</span>}
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
        padding: '14mm 14mm 14mm 24mm',
        background: '#ffffff',
        color: '#1f2937',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: '9.5pt',
        lineHeight: 1.5,
        position: 'relative',
      }}
    >
      {/* ── Vertical Japanese-style accent (fixed) ── */}
      <div
        style={{
          position: 'absolute',
          top: '14mm',
          bottom: '14mm',
          left: '8mm',
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          fontSize: '11pt',
          letterSpacing: '4px',
          color: '#be185d',
          fontWeight: 700,
          textTransform: 'uppercase',
        }}
      >
        {personal.name ? personal.name.split('').slice(0, 2).join(' ') : '名 前'}
      </div>

      {/* ── Header (fixed) ── */}
      <header style={{ marginBottom: '7mm', paddingBottom: '5mm', borderBottom: '0.5pt solid #fbcfe8' }}>
        <h1 style={{ margin: 0, fontSize: '24pt', fontWeight: 700, color: '#1f2937', letterSpacing: '-0.5px' }}>
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <div style={{ marginTop: '2mm', fontSize: '11pt', color: '#be185d', fontWeight: 500 }}>
            {personal.title}
          </div>
        )}
        <div style={{ marginTop: '3mm', fontSize: '9pt', color: '#6b7280', display: 'flex', flexWrap: 'wrap', gap: '1mm 5mm' }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>· {personal.phone}</span>}
          {personal.location && <span>· {personal.location}</span>}
          {personal.linkedin && <span>· {personal.linkedin}</span>}
        </div>
      </header>

      {/* ── Body sections (drag-and-drop order honored here) ── */}
      <OrderedSections
        nodes={nodes}
        sectionProps={{ accent: '#be185d', uppercase: false }}
        customBodyStyle={{ color: '#334155' }}
      />
    </div>
  )
}