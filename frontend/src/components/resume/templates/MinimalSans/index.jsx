import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'
import OrderedSections from '../../shared/OrderedSections'

/**
 * Minimal Sans — clean, generous-whitespace single-column resume.
 *
 * Sans-serif (Helvetica) with thin dividers and a calm blue accent.
 * Designed for startups, product roles, and modern design-forward companies.
 */
export default function MinimalSans() {
  const { personal, experience, education, projects, skills, certifications } =
    useResume()

  const nodes = {
    summary: personal.summary ? (
      <Section title="About" accent="#2563eb" uppercase={false}>
        <p style={{ margin: 0, color: '#475569' }}>{personal.summary}</p>
      </Section>
    ) : null,

    experience: experience.length > 0 ? (
      <Section title="Experience" accent="#2563eb" uppercase={false}>
        {experience.map((e, i) => (
          <ExperienceRow
            key={i}
            exp={e}
            roleColor="#0f172a"
            companyColor="#2563eb"
            periodColor="#94a3b8"
            bulletColor="#475569"
            fontSize="10pt"
          />
        ))}
      </Section>
    ) : null,

    projects: projects.length > 0 ? (
      <Section title="Projects" accent="#2563eb" uppercase={false}>
        {projects.map((p, i) => (
          <article key={i} style={{ marginBottom: '5mm' }}>
            <h3 style={{ margin: 0, fontSize: '11pt', fontWeight: 600, color: '#0f172a' }}>
              {p.title}
            </h3>
            {p.description && (
              <p style={{ margin: '1.5mm 0', color: '#475569' }}>{p.description}</p>
            )}
            {p.techStack.length > 0 && (
              <div style={{ fontSize: '8.5pt', color: '#94a3b8', letterSpacing: '0.5px' }}>
                {p.techStack.join('  ·  ')}
              </div>
            )}
          </article>
        ))}
      </Section>
    ) : null,

    education: education.length > 0 ? (
      <Section title="Education" accent="#2563eb" uppercase={false}>
        {education.map((e, i) => (
          <div key={i} style={{ marginBottom: '3mm' }}>
            <div style={{ fontWeight: 600, color: '#0f172a' }}>{e.degree}</div>
            <div style={{ color: '#2563eb', fontSize: '9.5pt' }}>{e.institution}</div>
            <div style={{ color: '#94a3b8', fontSize: '8.5pt' }}>
              {[e.period, e.location].filter(Boolean).join(' · ')}
            </div>
          </div>
        ))}
      </Section>
    ) : null,

    skills: skills.length > 0 ? (
      <Section title="Skills" accent="#2563eb" uppercase={false}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5mm' }}>
          {skills.map((s, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 500 }}>{s.name}</span>
              {s.level && (
                <span style={{ fontSize: '8.5pt', color: '#94a3b8', fontWeight: 300 }}>
                  {s.level}
                </span>
              )}
            </div>
          ))}
        </div>
      </Section>
    ) : null,

    certifications: certifications.length > 0 ? (
      <Section title="Certifications" accent="#2563eb" uppercase={false}>
        {certifications.map((c, i) => (
          <div key={i} style={{ marginBottom: '2mm' }}>
            <span style={{ fontWeight: 500 }}>{c.name}</span>
            {c.issuer && <span style={{ color: '#94a3b8' }}>  ·  {c.issuer}</span>}
            {c.year && <span style={{ color: '#94a3b8' }}>  ·  {c.year}</span>}
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
        padding: '22mm 22mm',
        background: '#ffffff',
        color: '#1e293b',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: '10pt',
        lineHeight: 1.55,
      }}
    >
      {/* ── Header (fixed) ── */}
      <header style={{ marginBottom: '10mm' }}>
        <h1
          style={{
            margin: 0,
            fontSize: '32pt',
            fontWeight: 200,
            letterSpacing: '-1px',
            color: '#0f172a',
          }}
        >
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <p
            style={{
              margin: '2mm 0 4mm',
              fontSize: '12pt',
              fontWeight: 400,
              color: '#2563eb',
              letterSpacing: '0.5px',
            }}
          >
            {personal.title}
          </p>
        )}
        <div
          style={{
            fontSize: '9pt',
            color: '#64748b',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1mm 5mm',
          }}
        >
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.website && <span>{personal.website}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
          {personal.github && <span>{personal.github}</span>}
        </div>
      </header>

      <Divider />

      {/* ── Body sections (drag-and-drop order honored here) ── */}
      <OrderedSections
        nodes={nodes}
        sectionProps={{ accent: '#2563eb', uppercase: false }}
        customBodyStyle={{ color: '#475569' }}
      />
    </div>
  )
}

function Divider() {
  return (
    <hr
      style={{
        border: 'none',
        borderTop: '0.5pt solid #cbd5e1',
        margin: '0 0 7mm',
      }}
    />
  )
}