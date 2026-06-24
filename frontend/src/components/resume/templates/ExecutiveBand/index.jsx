import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'
import OrderedSections from '../../shared/OrderedSections'

/**
 * Executive Band — premium single-column layout with a full-width colored
 * header band and elegant section headings. Conveys seniority and polish.
 *
 * Designed for senior engineers, managers, and executives.
 */
export default function ExecutiveBand() {
  const { personal, experience, education, projects, skills, certifications } =
    useResume()

  const nodes = {
    summary: personal.summary ? (
      <Section title="Executive Summary" accent="#7f1d1d" uppercase={false}>
        <p style={{ margin: 0, color: '#1c1917', fontSize: '10.5pt' }}>
          {personal.summary}
        </p>
      </Section>
    ) : null,

    experience: experience.length > 0 ? (
      <Section title="Professional Experience" accent="#7f1d1d" uppercase={false}>
        {experience.map((e, i) => (
          <ExperienceRow
            key={i}
            exp={e}
            roleColor="#7f1d1d"
            companyColor="#44403c"
            periodColor="#7f1d1d"
            bulletColor="#1c1917"
            fontSize="10.5pt"
          />
        ))}
      </Section>
    ) : null,

    education: education.length > 0 ? (
      <Section title="Education" accent="#7f1d1d" uppercase={false}>
        {education.map((e, i) => (
          <div key={i} style={{ marginBottom: '4mm' }}>
            <div style={{ fontWeight: 700, color: '#7f1d1d' }}>{e.degree}</div>
            <div style={{ fontStyle: 'italic' }}>{e.institution}</div>
            <div style={{ fontSize: '9pt', color: '#78716c' }}>
              {[e.period, e.location].filter(Boolean).join(' · ')}
            </div>
            {e.description && (
              <p style={{ margin: '1.5mm 0 0', color: '#1c1917', fontSize: '9.5pt' }}>
                {e.description}
              </p>
            )}
          </div>
        ))}
      </Section>
    ) : null,

    skills: skills.length > 0 ? (
      <Section title="Core Competencies" accent="#7f1d1d" uppercase={false}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2mm' }}>
          {skills.map((s, i) => (
            <span
              key={i}
              style={{
                fontSize: '9.5pt',
                padding: '1mm 3mm',
                border: '0.5pt solid #fecaca',
                borderRadius: '1mm',
                color: '#7f1d1d',
                background: '#fef2f2',
              }}
            >
              <strong>{s.name}</strong>
              {s.level && <span style={{ fontSize: '8pt', color: '#9f1239' }}> · {s.level}</span>}
            </span>
          ))}
        </div>
      </Section>
    ) : null,

    projects: projects.length > 0 ? (
      <Section title="Selected Projects" accent="#7f1d1d" uppercase={false}>
        {projects.map((p, i) => (
          <article key={i} style={{ marginBottom: '4mm' }}>
            <h3 style={{ margin: 0, fontSize: '11pt', fontWeight: 700, color: '#7f1d1d' }}>
              {p.title}
            </h3>
            {p.description && <p style={{ margin: '1.5mm 0', color: '#1c1917' }}>{p.description}</p>}
            {p.techStack.length > 0 && (
              <div style={{ fontSize: '9pt', fontStyle: 'italic', color: '#78716c' }}>
                {p.techStack.join(' · ')}
              </div>
            )}
          </article>
        ))}
      </Section>
    ) : null,

    certifications: certifications.length > 0 ? (
      <Section title="Certifications" accent="#7f1d1d" uppercase={false}>
        {certifications.map((c, i) => (
          <div key={i} style={{ marginBottom: '1.5mm' }}>
            <strong>{c.name}</strong>
            {c.issuer && <span> — {c.issuer}</span>}
            {c.year && <span style={{ color: '#78716c' }}> ({c.year})</span>}
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
        color: '#1c1917',
        fontFamily: '"Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif',
        fontSize: '10.5pt',
        lineHeight: 1.5,
      }}
    >
      {/* ── Header Band (fixed) ── */}
      <header
        style={{
          background: '#7f1d1d',
          backgroundImage:
            'linear-gradient(135deg, #7f1d1d 0%, #991b1b 60%, #b91c1c 100%)',
          color: '#fef2f2',
          padding: '14mm 18mm 12mm',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: '30pt',
            fontWeight: 700,
            letterSpacing: '-0.5px',
            lineHeight: 1.05,
            color: '#ffffff',
          }}
        >
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <p
            style={{
              margin: '3mm 0 0',
              fontSize: '13pt',
              fontStyle: 'italic',
              fontWeight: 400,
              color: '#fecaca',
            }}
          >
            {personal.title}
          </p>
        )}
        <div
          style={{
            marginTop: '5mm',
            fontSize: '9.5pt',
            color: '#fee2e2',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1mm 6mm',
            alignItems: 'center',
          }}
        >
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <Dot />}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <Dot />}
          {personal.location && <span>{personal.location}</span>}
          {personal.website && <Dot />}
          {personal.website && <span>{personal.website}</span>}
          {personal.linkedin && <Dot />}
          {personal.linkedin && <span>{personal.linkedin}</span>}
          {personal.github && <Dot />}
          {personal.github && <span>{personal.github}</span>}
        </div>
      </header>

      <div style={{ padding: '10mm 18mm 12mm' }}>
        {/* ── Body sections (drag-and-drop order honored here) ── */}
        <OrderedSections
          nodes={nodes}
          sectionProps={{ accent: '#7f1d1d', uppercase: false }}
          customBodyStyle={{ color: '#1c1917' }}
        />
      </div>
    </div>
  )
}

function Dot() {
  return (
    <span style={{ color: '#fecaca', opacity: 0.6 }}>•</span>
  )
}