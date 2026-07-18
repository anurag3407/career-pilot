import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'
import OrderedSections from '../../shared/OrderedSections'

/**
 * StrategyMckinsey — leadership-and-impact style. Header emphasizes scale,
 * every bullet leads with a metric. Conservative type for top firms.
 */
export default function StrategyMckinsey() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

  const nodes = {
    summary: personal.summary ? (
      <Section title="Summary" accent="#4338ca" uppercase={false}>
        <p style={{ margin: 0, color: '#334155', fontWeight: 400 }}>{personal.summary}</p>
      </Section>
    ) : null,

    experience: experience.length > 0 ? (
      <Section title="Professional Experience" accent="#4338ca" uppercase={false}>
        {experience.map((e, i) => (
          <ExperienceRow
            key={i}
            exp={e}
            roleColor="#0f172a"
            companyColor="#4338ca"
            periodColor="#64748b"
            bulletColor="#334155"
            fontSize="10pt"
          />
        ))}
      </Section>
    ) : null,

    education: education.length > 0 ? (
      <Section title="Education" accent="#4338ca" uppercase={false}>
        {education.map((e, i) => (
          <div key={i} style={{ marginBottom: '2mm' }}>
            <strong>{e.institution}</strong>
            {e.degree && <span> · {e.degree}</span>}
            {e.period && <span style={{ color: '#64748b' }}> · {e.period}</span>}
            {e.description && <div style={{ fontSize: '9pt', color: '#64748b', fontStyle: 'italic' }}>{e.description}</div>}
          </div>
        ))}
      </Section>
    ) : null,

    projects: projects.length > 0 ? (
      <Section title="Selected Client Engagements" accent="#4338ca" uppercase={false}>
        {projects.map((p, i) => (
          <div key={i} style={{ marginBottom: '3mm' }}>
            <strong>{p.title}</strong>
            {p.description && <div style={{ color: '#334155' }}>{p.description}</div>}
            {p.techStack.length > 0 && (
              <div style={{ color: '#4338ca', fontSize: '8.5pt' }}>{p.techStack.join(' · ')}</div>
            )}
          </div>
        ))}
      </Section>
    ) : null,

    skills: skills.length > 0 ? (
      <Section title="Functional Expertise" accent="#4338ca" uppercase={false}>
        <div style={{ color: '#334155', lineHeight: 1.7 }}>{skills.map((s) => s.name).join(' · ')}</div>
      </Section>
    ) : null,

    certifications: certifications.length > 0 ? (
      <Section title="Languages & Certifications" accent="#4338ca" uppercase={false}>
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
        padding: '16mm 18mm',
        background: '#ffffff',
        color: '#0f172a',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: '10pt',
        lineHeight: 1.5,
      }}
    >
      {/* ── Header (fixed) ── */}
      <header style={{ borderBottom: '2pt solid #4338ca', paddingBottom: '5mm', marginBottom: '6mm' }}>
        <h1 style={{ margin: 0, fontSize: '24pt', fontWeight: 700, color: '#0f172a' }}>
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <div style={{ marginTop: '1mm', fontSize: '12pt', color: '#4338ca', fontWeight: 500 }}>
            {personal.title}
          </div>
        )}
        <div style={{ marginTop: '3mm', fontSize: '9pt', color: '#475569', display: 'flex', flexWrap: 'wrap', gap: '1mm 5mm' }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>· {personal.phone}</span>}
          {personal.location && <span>· {personal.location}</span>}
          {personal.linkedin && <span>· {personal.linkedin}</span>}
        </div>
      </header>

      {/* ── Body sections (drag-and-drop order honored here) ── */}
      <OrderedSections
        nodes={nodes}
        sectionProps={{ accent: '#4338ca', uppercase: false }}
        customBodyStyle={{ color: '#334155' }}
      />
    </div>
  )
}