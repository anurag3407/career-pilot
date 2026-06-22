import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'
import OrderedSections from '../../shared/OrderedSections'

/**
 * GradientFlow — animated-feel gradient hero (static for print).
 * Modern and trendy, signals design-savvy.
 */
export default function GradientFlow() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

  const nodes = {
    summary: personal.summary ? (
      <Section title="About" accent="#7c3aed" uppercase={false}>
        <p style={{ margin: 0, color: '#334155', fontSize: '11pt', lineHeight: 1.6 }}>{personal.summary}</p>
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
            bulletColor="#334155"
            fontSize="10pt"
          />
        ))}
      </Section>
    ) : null,

    skills: skills.length > 0 ? (
      <Section title="Skills" accent="#7c3aed" uppercase={false}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1mm' }}>
          {skills.map((s, i) => (
            <span key={i} style={{ fontSize: '9pt', padding: '0.5mm 2mm', background: '#ede9fe', color: '#5b21b6', borderRadius: 12, fontWeight: 500 }}>
              {s.name}
            </span>
          ))}
        </div>
      </Section>
    ) : null,

    projects: projects.length > 0 ? (
      <Section title="Projects" accent="#7c3aed" uppercase={false}>
        {projects.map((p, i) => (
          <div key={i} style={{ marginBottom: '3mm' }}>
            <strong>{p.title}</strong>
            {p.description && <div style={{ color: '#334155' }}>{p.description}</div>}
            {p.techStack.length > 0 && (
              <div style={{ color: '#7c3aed', fontSize: '8.5pt' }}>{p.techStack.join(' · ')}</div>
            )}
          </div>
        ))}
      </Section>
    ) : null,

    education: education.length > 0 ? (
      <Section title="Education" accent="#7c3aed" uppercase={false}>
        {education.map((e, i) => (
          <div key={i} style={{ marginBottom: '2mm' }}>
            <strong>{e.degree}</strong>
            <div style={{ color: '#7c3aed', fontSize: '9pt' }}>{e.institution}</div>
            <div style={{ color: '#6b7280', fontSize: '8.5pt' }}>{e.period}</div>
          </div>
        ))}
      </Section>
    ) : null,

    certifications: certifications.length > 0 ? (
      <Section title="Certifications" accent="#7c3aed" uppercase={false}>
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
        background: '#ffffff',
        color: '#1f2937',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '10pt',
        lineHeight: 1.5,
      }}
    >
      {/* ── Gradient hero (fixed) ── */}
      <header
        style={{
          background: 'linear-gradient(120deg, #7c3aed 0%, #c026d3 35%, #ec4899 65%, #f59e0b 100%)',
          color: '#ffffff',
          padding: '16mm 18mm 14mm',
          position: 'relative',
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '8mm', right: '12mm', width: '24mm', height: '24mm', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.15)' }} />
        <div style={{ position: 'absolute', bottom: '6mm', right: '32mm', width: '14mm', height: '14mm', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.12)' }} />
        <h1 style={{ margin: 0, fontSize: '32pt', fontWeight: 700, letterSpacing: '-0.5px', position: 'relative' }}>
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <div style={{ marginTop: '2mm', fontSize: '14pt', color: 'rgba(255, 255, 255, 0.9)', fontWeight: 300, position: 'relative' }}>
            {personal.title}
          </div>
        )}
        <div style={{ marginTop: '5mm', fontSize: '9.5pt', color: 'rgba(255, 255, 255, 0.9)', display: 'flex', flexWrap: 'wrap', gap: '1mm 6mm', position: 'relative' }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>· {personal.phone}</span>}
          {personal.location && <span>· {personal.location}</span>}
          {personal.website && <span>· {personal.website}</span>}
          {personal.linkedin && <span>· {personal.linkedin}</span>}
        </div>
      </header>

      <div style={{ padding: '8mm 18mm 12mm' }}>
        {/* ── Body sections (drag-and-drop order honored here) ── */}
        <OrderedSections
          nodes={nodes}
          sectionProps={{ accent: '#7c3aed', uppercase: false }}
          customBodyStyle={{ color: '#334155' }}
        />
      </div>
    </div>
  )
}