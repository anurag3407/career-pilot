import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'
import ProjectCard from '../../shared/ProjectCard'
import OrderedSections from '../../shared/OrderedSections'

/**
 * ClassicSerif — single-column, traditional resume template.
 *
 * Serif typography (Georgia) with horizontal rules between sections.
 * Most ATS-friendly of the five — single column, semantic headings, no
 * unusual font metrics.
 */
export default function ClassicSerif() {
  const { personal, experience, education, projects, skills, certifications } =
    useResume()

  const nodes = {
    summary: personal.summary ? (
      <Section title="Summary" accent="#111827" uppercase={false}>
        <p style={{ margin: 0, textAlign: 'justify', color: '#1f2937' }}>{personal.summary}</p>
      </Section>
    ) : null,

    education: education.length > 0 ? (
      <Section title="Education" accent="#111827" uppercase={false}>
        {education.map((e, i) => (
          <article key={i} style={{ marginBottom: '4mm' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h3 style={{ margin: 0, fontSize: '11.5pt', fontWeight: 700 }}>
                {e.institution || 'Institution'}
              </h3>
              {e.period && (
                <span style={{ fontSize: '10pt', color: '#374151', fontStyle: 'italic' }}>
                  {e.period}
                </span>
              )}
            </div>
            <div style={{ fontSize: '10.5pt', fontStyle: 'italic' }}>
              {[e.degree, e.location].filter(Boolean).join(', ')}
            </div>
            {e.description && (
              <p style={{ margin: '1mm 0 0', color: '#374151' }}>{e.description}</p>
            )}
          </article>
        ))}
      </Section>
    ) : null,

    experience: experience.length > 0 ? (
      <Section title="Experience" accent="#111827" uppercase={false}>
        {experience.map((e, i) => (
          <ExperienceRow
            key={i}
            exp={e}
            roleColor="#111827"
            companyColor="#1f2937"
            periodColor="#374151"
            bulletColor="#1f2937"
            fontSize="10.5pt"
          />
        ))}
      </Section>
    ) : null,

    projects: projects.length > 0 ? (
      <Section title="Projects" accent="#111827" uppercase={false}>
        {projects.map((p, i) => (
          <ProjectCard
            key={i}
            project={p}
            titleColor="#111827"
            descColor="#1f2937"
            techColor="#374151"
            linkColor="#1f2937"
            fontSize="10.5pt"
          />
        ))}
      </Section>
    ) : null,

    skills: skills.length > 0 ? (
      <Section title="Skills" accent="#111827" uppercase={false}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1mm 4mm' }}>
          {skills.map((s, i) => (
            <span key={i} style={{ fontSize: '10pt' }}>
              <strong>{s.name}</strong>
              {s.level && <span style={{ color: '#6b7280' }}> ({s.level})</span>}
              {i < skills.length - 1 && <span style={{ color: '#9ca3af' }}> · </span>}
            </span>
          ))}
        </div>
      </Section>
    ) : null,

    certifications: certifications.length > 0 ? (
      <Section title="Certifications" accent="#111827" uppercase={false}>
        {certifications.map((c, i) => (
          <div key={i} style={{ marginBottom: '2mm' }}>
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
        padding: '18mm 18mm',
        background: '#ffffff',
        color: '#1f2937',
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: '10.5pt',
        lineHeight: 1.5,
      }}
    >
      {/* ── Header (fixed) ── */}
      <header style={{ textAlign: 'center', marginBottom: '8mm' }}>
        <h1
          style={{
            margin: 0,
            fontSize: '28pt',
            fontWeight: 700,
            letterSpacing: '1px',
            color: '#111827',
          }}
        >
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <p
            style={{
              margin: '2mm 0 4mm',
              fontSize: '13pt',
              fontStyle: 'italic',
              color: '#374151',
            }}
          >
            {personal.title}
          </p>
        )}
        <div
          style={{
            fontSize: '9.5pt',
            color: '#374151',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '2mm 6mm',
          }}
        >
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>· {personal.phone}</span>}
          {personal.location && <span>· {personal.location}</span>}
          {personal.website && <span>· {personal.website}</span>}
          {personal.linkedin && <span>· {personal.linkedin}</span>}
          {personal.github && <span>· {personal.github}</span>}
        </div>
      </header>

      <hr style={ruleStyle} />

      {/* ── Body sections (drag-and-drop order honored here) ── */}
      <OrderedSections
        nodes={nodes}
        sectionProps={{ accent: '#111827', uppercase: false }}
        customBodyStyle={{ color: '#1f2937' }}
      />
    </div>
  )
}

const ruleStyle = {
  border: 'none',
  borderTop: '1.5pt solid #111827',
  margin: '0 0 5mm',
}