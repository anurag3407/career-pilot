import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'
import OrderedSections from '../../shared/OrderedSections'

/**
 * NurseClinical — clinical-skills matrix and certifications-heavy.
 * Single-column with a dedicated "Clinical Skills" grid section.
 */
export default function NurseClinical() {
  const { personal, experience, education, skills, certifications } = useResume()

  // Split skills into "Clinical" and "Soft" by category if provided, else
  // bucket first half as clinical.
  const half = Math.ceil(skills.length / 2)
  const clinicalSkills = skills.filter((s) => /clinical|patient|medic|nurs|ic|cath/i.test(s.name)).concat(skills.slice(0, half))
  const softSkills = skills.filter((s) => !/clinical|patient|medic|nurs|ic|cath/i.test(s.name)).concat(skills.slice(half))

  const nodes = {
    summary: personal.summary ? (
      <Section title="Clinical Summary" accent="#0f766e" uppercase={false}>
        <p style={{ margin: 0, color: '#334155' }}>{personal.summary}</p>
      </Section>
    ) : null,

    experience: experience.length > 0 ? (
      <Section title="Clinical Experience" accent="#0f766e" uppercase={false}>
        {experience.map((e, i) => (
          <ExperienceRow
            key={i}
            exp={e}
            roleColor="#0f172a"
            companyColor="#0f766e"
            periodColor="#64748b"
            bulletColor="#334155"
            fontSize="10pt"
          />
        ))}
      </Section>
    ) : null,

    education: education.length > 0 ? (
      <Section title="Education & Training" accent="#0f766e" uppercase={false}>
        {education.map((e, i) => (
          <div key={i} style={{ marginBottom: '2mm' }}>
            <strong>{e.degree}</strong> · {e.institution}
            {e.period && <span style={{ color: '#64748b' }}> · {e.period}</span>}
            {e.description && <div style={{ color: '#64748b', fontSize: '9pt' }}>{e.description}</div>}
          </div>
        ))}
      </Section>
    ) : null,

    certifications: certifications.length > 0 ? (
      <Section title="Licenses & Certifications" accent="#0f766e" uppercase={false}>
        {certifications.map((c, i) => (
          <div key={i} style={{ marginBottom: '0.5mm' }}>
            <strong>{c.name}</strong>
            {c.issuer && <span> · {c.issuer}</span>}
            {c.year && <span style={{ color: '#64748b' }}> · {c.year}</span>}
          </div>
        ))}
      </Section>
    ) : null,

    skills: softSkills.length > 0 ? (
      <Section title="Additional Skills" accent="#0f766e" uppercase={false}>
        <div style={{ color: '#334155' }}>{softSkills.map((s) => s.name).join(' · ')}</div>
      </Section>
    ) : null,
  }

  return (
    <div
      className="resume-export-root"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '14mm 16mm',
        background: '#ffffff',
        color: '#0f172a',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: '10pt',
        lineHeight: 1.5,
      }}
    >
      {/* ── Header (fixed) ── */}
      <header style={{ marginBottom: '6mm', paddingBottom: '4mm', borderBottom: '2pt solid #0f766e' }}>
        <h1 style={{ margin: 0, fontSize: '24pt', fontWeight: 700, color: '#0f766e' }}>
          {personal.name || 'Your Name'}
        </h1>
        <div style={{ marginTop: '1mm', fontSize: '12pt', color: '#0f172a', fontWeight: 500 }}>
          {personal.title}
        </div>
        <div style={{ marginTop: '2mm', fontSize: '9pt', color: '#475569', display: 'flex', flexWrap: 'wrap', gap: '1mm 5mm' }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>· {personal.phone}</span>}
          {personal.location && <span>· {personal.location}</span>}
          {personal.linkedin && <span>· {personal.linkedin}</span>}
        </div>
      </header>

      {/* ── Body sections (drag-and-drop order honored here) ── */}
      <OrderedSections
        nodes={nodes}
        sectionProps={{ accent: '#0f766e', uppercase: false }}
        customBodyStyle={{ color: '#334155' }}
        header={
          <Section title="Clinical Skills Matrix" accent="#0f766e" uppercase={false}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1mm 6mm' }}>
              {clinicalSkills.map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5pt', padding: '1mm 0', borderBottom: '0.5pt solid #ccfbf1' }}>
                  <span style={{ fontWeight: 500 }}>{s.name}</span>
                  {s.level && <span style={{ color: '#0f766e' }}>{s.level}</span>}
                </div>
              ))}
            </div>
          </Section>
        }
      />
    </div>
  )
}