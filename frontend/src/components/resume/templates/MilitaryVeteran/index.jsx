import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'
import OrderedSections from '../../shared/OrderedSections'

/**
 * MilitaryVeteran — MOS, rank and route structure. Single-column.
 */
export default function MilitaryVeteran() {
  const { personal, experience, education, skills, certifications } = useResume()

  const nodes = {
    summary: personal.summary ? (
      <Section title="Objective" accent="#047857" uppercase={false}>
        <p style={{ margin: 0, color: '#334155' }}>{personal.summary}</p>
      </Section>
    ) : null,

    experience: experience.length > 0 ? (
      <Section title="Military & Civilian Experience" accent="#047857" uppercase={false}>
        {experience.map((e, i) => (
          <ExperienceRow
            key={i}
            exp={e}
            roleColor="#0f172a"
            companyColor="#047857"
            periodColor="#64748b"
            bulletColor="#334155"
            fontSize="10pt"
          />
        ))}
      </Section>
    ) : null,

    skills: skills.length > 0 ? (
      <Section title="Military & Technical Skills" accent="#047857" uppercase={false}>
        <div style={{ color: '#334155' }}>{skills.map((s) => s.name).join(' · ')}</div>
      </Section>
    ) : null,

    education: education.length > 0 ? (
      <Section title="Education & Training" accent="#047857" uppercase={false}>
        {education.map((e, i) => (
          <div key={i} style={{ marginBottom: '2mm' }}>
            <strong>{e.degree}</strong> · {e.institution}
            {e.period && <span style={{ color: '#64748b' }}> · {e.period}</span>}
          </div>
        ))}
      </Section>
    ) : null,

    certifications: certifications.length > 0 ? (
      <Section title="Awards & Certifications" accent="#047857" uppercase={false}>
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
        padding: '14mm 18mm',
        background: '#ffffff',
        color: '#0f172a',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: '10pt',
        lineHeight: 1.5,
      }}
    >
      {/* ── Header (fixed) ── */}
      <header style={{ borderBottom: '3pt solid #047857', paddingBottom: '5mm', marginBottom: '6mm' }}>
        <h1 style={{ margin: 0, fontSize: '24pt', fontWeight: 700, color: '#0f172a' }}>
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <div style={{ marginTop: '1mm', fontSize: '12pt', color: '#047857', fontWeight: 600 }}>
            {personal.title}
          </div>
        )}
        <div style={{ marginTop: '2mm', fontSize: '9.5pt', color: '#475569', display: 'flex', flexWrap: 'wrap', gap: '1mm 5mm' }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>· {personal.phone}</span>}
          {personal.location && <span>· {personal.location}</span>}
          {personal.linkedin && <span>· {personal.linkedin}</span>}
        </div>
      </header>

      {/* ── Body sections (drag-and-drop order honored here) ── */}
      <OrderedSections
        nodes={nodes}
        sectionProps={{ accent: '#047857', uppercase: false }}
        customBodyStyle={{ color: '#334155' }}
        header={
          <Section title="Military Profile" accent="#047857" uppercase={false}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1mm 8mm', fontSize: '10pt' }}>
              <div><strong>Branch:</strong> U.S. Army</div>
              <div><strong>Rank:</strong> Staff Sergeant (E-6)</div>
              <div><strong>MOS:</strong> 25B — Information Technology Specialist</div>
              <div><strong>Years of Service:</strong> 8 (2014-2022)</div>
              <div><strong>Discharge:</strong> Honorable</div>
              <div><strong>Security Clearance:</strong> Secret (active)</div>
            </div>
          </Section>
        }
      />
    </div>
  )
}