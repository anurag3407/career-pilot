import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'
import Avatar from '../../shared/Avatar'
import OrderedSections from '../../shared/OrderedSections'

/**
 * DirectorSuite — black accent, monogram crest, hairline rules. Built
 * for directors and VPs who want quiet authority.
 */
export default function DirectorSuite() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

  const nodes = {
    summary: personal.summary ? (
      <Section title="Profile" accent="#1c1917" variant="plain" uppercase={false}>
        <p style={{ margin: 0, fontStyle: 'italic', color: '#1c1917' }}>{personal.summary}</p>
      </Section>
    ) : null,

    experience: experience.length > 0 ? (
      <Section title="Experience" accent="#1c1917" uppercase={false}>
        {experience.map((e, i) => (
          <ExperienceRow
            key={i}
            exp={e}
            roleColor="#1c1917"
            companyColor="#1c1917"
            periodColor="#57534e"
            bulletColor="#1c1917"
            fontSize="10.5pt"
          />
        ))}
      </Section>
    ) : null,

    education: education.length > 0 ? (
      <Section title="Education" accent="#1c1917" uppercase={false}>
        {education.map((e, i) => (
          <div key={i} style={{ marginBottom: '2mm' }}>
            <strong>{e.institution}</strong> · {e.degree}
            {e.period && <span style={{ color: '#57534e' }}> · {e.period}</span>}
          </div>
        ))}
      </Section>
    ) : null,

    skills: skills.length > 0 ? (
      <Section title="Areas of Expertise" accent="#1c1917" uppercase={false}>
        <div style={{ color: '#1c1917', lineHeight: 1.7 }}>
          {skills.map((s) => s.name).join(' · ')}
        </div>
      </Section>
    ) : null,

    projects: projects.length > 0 ? (
      <Section title="Selected Engagements" accent="#1c1917" uppercase={false}>
        {projects.map((p, i) => (
          <div key={i} style={{ marginBottom: '3mm' }}>
            <strong>{p.title}</strong>
            {p.description && <div style={{ color: '#1c1917' }}>{p.description}</div>}
          </div>
        ))}
      </Section>
    ) : null,

    certifications: certifications.length > 0 ? (
      <Section title="Board Roles & Affiliations" accent="#1c1917" uppercase={false}>
        {certifications.map((c, i) => (
          <div key={i} style={{ marginBottom: '1.5mm' }}>
            <strong>{c.name}</strong>
            {c.issuer && <span> · {c.issuer}</span>}
            {c.year && <span style={{ color: '#57534e' }}> · {c.year}</span>}
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
      {/* ── Crest (fixed) ── */}
      <header style={{ display: 'flex', alignItems: 'center', gap: '8mm', marginBottom: '6mm', borderBottom: '1pt solid #1c1917', paddingBottom: '5mm' }}>
        <div
          style={{
            width: '20mm',
            height: '20mm',
            border: '1.5pt solid #1c1917',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14pt',
            fontWeight: 700,
            color: '#1c1917',
            letterSpacing: '2px',
          }}
        >
          {(personal.name || 'YN')
            .split(/\s+/)
            .map((s) => s[0])
            .filter(Boolean)
            .slice(0, 2)
            .join('')}
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '24pt', fontWeight: 700, color: '#1c1917', letterSpacing: '1px' }}>
            {personal.name || 'Your Name'}
          </h1>
          {personal.title && (
            <div style={{ marginTop: '1mm', fontSize: '12pt', color: '#44403c', fontStyle: 'italic' }}>
              {personal.title}
            </div>
          )}
          <div style={{ marginTop: '2mm', fontSize: '9.5pt', color: '#57534e', display: 'flex', flexWrap: 'wrap', gap: '1mm 5mm' }}>
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>· {personal.phone}</span>}
            {personal.location && <span>· {personal.location}</span>}
            {personal.linkedin && <span>· {personal.linkedin}</span>}
          </div>
        </div>
      </header>

      {/* ── Body sections (drag-and-drop order honored here) ── */}
      <OrderedSections
        nodes={nodes}
        sectionProps={{ accent: '#1c1917', uppercase: false }}
        customBodyStyle={{ color: '#1c1917' }}
      />
    </div>
  )
}