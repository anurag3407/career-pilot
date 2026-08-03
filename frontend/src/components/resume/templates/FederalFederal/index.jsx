import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'
import OrderedSections from '../../shared/OrderedSections'

/**
 * FederalFederal — long-form federal-style resume. Includes supervisor
 * names, hours-per-week, GS-grade metadata, and a dedicated competencies
 * block. Falls back to dummy values when fields are missing.
 */
export default function FederalFederal() {
  const { personal, experience, education, skills, certifications } = useResume()

  const nodes = {
    summary: personal.summary ? (
      <Section title="Professional Summary" accent="#1f2937" uppercase={false}>
        <p style={{ margin: 0 }}>{personal.summary}</p>
      </Section>
    ) : null,

    experience: experience.length > 0 ? (
      <Section title="Work Experience" accent="#1f2937" uppercase={false}>
        {experience.map((e, i) => (
          <div key={i} style={{ marginBottom: '5mm' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <strong style={{ fontSize: '11pt' }}>{e.role || 'Position Title'}</strong>
              {e.period && <span style={{ fontSize: '9pt', color: '#6b7280' }}>{e.period}</span>}
            </div>
            <div style={{ fontSize: '10pt', color: '#1f2937', fontWeight: 600 }}>
              {[e.company, e.location].filter(Boolean).join(', ')}
            </div>
            <div style={{ fontSize: '8.5pt', color: '#6b7280', fontStyle: 'italic', marginBottom: '1mm' }}>
              Hours per week: 40 · Supervisor: Available upon request
            </div>
            {e.bullets.length > 0 && (
              <ul style={{ margin: '1mm 0 0', paddingLeft: '5mm', fontSize: '9.5pt' }}>
                {e.bullets.map((b, j) => (
                  <li key={j} style={{ marginBottom: '0.5mm' }}>{b}</li>
                ))}
              </ul>
            )}
            {i === 0 && (
              <div style={{ marginTop: '1mm', fontSize: '8.5pt', color: '#6b7280', fontStyle: 'italic' }}>
                Reason for leaving: Career advancement
              </div>
            )}
          </div>
        ))}
      </Section>
    ) : null,

    skills: skills.length > 0 ? (
      <Section title="Key Competencies / Skills" accent="#1f2937" uppercase={false}>
        <ul style={{ margin: 0, paddingLeft: '5mm', columns: 2, columnGap: '8mm' }}>
          {skills.map((s, i) => (
            <li key={i} style={{ marginBottom: '0.5mm', breakInside: 'avoid' }}>{s.name}</li>
          ))}
        </ul>
      </Section>
    ) : null,

    education: education.length > 0 ? (
      <Section title="Education" accent="#1f2937" uppercase={false}>
        {education.map((e, i) => (
          <div key={i} style={{ marginBottom: '2mm' }}>
            <strong>{e.degree}</strong> — {e.institution}
            {e.period && <span style={{ color: '#6b7280' }}> ({e.period})</span>}
            {e.description && (
              <div style={{ fontSize: '9pt', color: '#6b7280', fontStyle: 'italic' }}>{e.description}</div>
            )}
          </div>
        ))}
      </Section>
    ) : null,

    certifications: certifications.length > 0 ? (
      <Section title="Training & Certifications" accent="#1f2937" uppercase={false}>
        {certifications.map((c, i) => (
          <div key={i} style={{ marginBottom: '1.5mm' }}>
            <strong>{c.name}</strong>
            {c.issuer && <span> — {c.issuer}</span>}
            {c.year && <span style={{ color: '#6b7280' }}> ({c.year})</span>}
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
        padding: '12mm 16mm',
        background: '#ffffff',
        color: '#1f2937',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: '9.5pt',
        lineHeight: 1.45,
      }}
    >
      {/* ── Header (fixed) ── */}
      <header style={{ borderBottom: '2pt solid #1f2937', paddingBottom: '4mm', marginBottom: '6mm' }}>
        <h1 style={{ margin: 0, fontSize: '20pt', fontWeight: 700, color: '#111827', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
          {personal.name || 'Your Name'}
        </h1>
        <div style={{ marginTop: '1mm', fontSize: '11pt', color: '#374151' }}>
          {personal.title}
        </div>
        <div style={{ marginTop: '2mm', fontSize: '9pt', color: '#374151', display: 'flex', flexWrap: 'wrap', gap: '1mm 4mm' }}>
          {personal.email && <span>Email: {personal.email}</span>}
          {personal.phone && <span>· Phone: {personal.phone}</span>}
          {personal.location && <span>· Location: {personal.location}</span>}
        </div>
      </header>

      {/* ── Body sections (drag-and-drop order honored here) ── */}
      <OrderedSections
        nodes={nodes}
        sectionProps={{ accent: '#1f2937', uppercase: false }}
        customBodyStyle={{ color: '#1f2937' }}
        header={
          <>
            <Section title="Job Information" accent="#1f2937" spacing="Compact" uppercase={false}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2mm 6mm', fontSize: '9.5pt' }}>
                <div><strong>Series/Grade:</strong> 0301-13 (or GS-equivalent)</div>
                <div><strong>Duty Station:</strong> {personal.location || 'Washington, DC'}</div>
                <div><strong>Citizenship:</strong> U.S. Citizen</div>
                <div><strong>Security Clearance:</strong> Public Trust</div>
                <div><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</div>
                <div><strong>Veterans' Preference:</strong> None</div>
              </div>
            </Section>
          </>
        }
        footer={
          <Section title="References" accent="#1f2937" spacing="Compact" uppercase={false}>
            <p style={{ margin: 0, fontStyle: 'italic', color: '#6b7280' }}>
              Available upon request.
            </p>
          </Section>
        }
      />
    </div>
  )
}