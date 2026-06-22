import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'

/**
 * NeumorphismSoft — soft-shadow cards over a calm surface. Single-column.
 */
export default function NeumorphismSoft() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

  return (
    <div
      className="resume-export-root"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '14mm 18mm',
        background: '#e0e7ff',
        color: '#1e1b4b',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '10pt',
        lineHeight: 1.5,
      }}
    >
      <SoftCard>
        <h1 style={{ margin: 0, fontSize: '28pt', fontWeight: 700, color: '#1e1b4b', letterSpacing: '-0.5px' }}>
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <div style={{ marginTop: '2mm', fontSize: '13pt', color: '#7c3aed' }}>
            {personal.title}
          </div>
        )}
        <div style={{ marginTop: '3mm', fontSize: '9.5pt', color: '#4338ca', display: 'flex', flexWrap: 'wrap', gap: '1mm 5mm' }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>· {personal.phone}</span>}
          {personal.location && <span>· {personal.location}</span>}
          {personal.linkedin && <span>· {personal.linkedin}</span>}
        </div>
      </SoftCard>

      {personal.summary && (
        <SoftCard title="About">
          <p style={{ margin: 0, color: '#1e1b4b' }}>{personal.summary}</p>
        </SoftCard>
      )}

      {experience.length > 0 && (
        <SoftCard title="Experience">
          {experience.map((e, i) => (
            <ExperienceRow
              key={i}
              exp={e}
              roleColor="#1e1b4b"
              companyColor="#7c3aed"
              periodColor="#6b7280"
              bulletColor="#1f2937"
              fontSize="10pt"
            />
          ))}
        </SoftCard>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: skills.length > 0 && education.length > 0 ? '1fr 1fr' : '1fr', gap: '5mm' }}>
        {skills.length > 0 && (
          <SoftCard title="Skills">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1mm' }}>
              {skills.map((s, i) => (
                <span key={i} style={{ fontSize: '9pt', padding: '0.5mm 2mm', background: '#ede9fe', color: '#5b21b6', borderRadius: 12, fontWeight: 500 }}>
                  {s.name}
                </span>
              ))}
            </div>
          </SoftCard>
        )}

        {education.length > 0 && (
          <SoftCard title="Education">
            {education.map((e, i) => (
              <div key={i} style={{ marginBottom: '2mm' }}>
                <strong>{e.degree}</strong>
                <div style={{ color: '#7c3aed', fontSize: '9pt' }}>{e.institution}</div>
                <div style={{ color: '#6b7280', fontSize: '8.5pt' }}>{e.period}</div>
              </div>
            ))}
          </SoftCard>
        )}
      </div>

      {projects.length > 0 && (
        <SoftCard title="Projects">
          {projects.map((p, i) => (
            <div key={i} style={{ marginBottom: '3mm' }}>
              <strong>{p.title}</strong>
              {p.description && <div style={{ color: '#1e1b4b' }}>{p.description}</div>}
              {p.techStack.length > 0 && (
                <div style={{ color: '#7c3aed', fontSize: '8.5pt' }}>{p.techStack.join(' · ')}</div>
              )}
            </div>
          ))}
        </SoftCard>
      )}

      {certifications.length > 0 && (
        <SoftCard title="Certifications">
          {certifications.map((c, i) => (
            <div key={i} style={{ marginBottom: '1.5mm' }}>
              <strong>{c.name}</strong>
              {c.issuer && <span> · {c.issuer}</span>}
              {c.year && <span style={{ color: '#6b7280' }}> · {c.year}</span>}
            </div>
          ))}
        </SoftCard>
      )}
    </div>
  )
}

function SoftCard({ title, children }) {
  return (
    <section
      style={{
        background: '#e0e7ff',
        borderRadius: 16,
        padding: '5mm 6mm',
        marginBottom: '5mm',
        boxShadow: '8px 8px 16px #c7d2fe, -8px -8px 16px #ffffff',
      }}
    >
      {title && (
        <h2 style={{ margin: '0 0 3mm', fontSize: '10pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#7c3aed' }}>
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}
