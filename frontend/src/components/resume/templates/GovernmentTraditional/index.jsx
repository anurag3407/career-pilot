import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'
import ProjectCard from '../../shared/ProjectCard'

/**
 * GovernmentTraditional — civic-style resume. Centered header, eagle-feel
 * serif body, structured section order that mirrors USAJOBS expectations.
 */
export default function GovernmentTraditional() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

  return (
    <div
      className="resume-export-root"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '18mm 22mm',
        background: '#ffffff',
        color: '#1e1b4b',
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: '10.5pt',
        lineHeight: 1.5,
      }}
    >
      <header style={{ textAlign: 'center', marginBottom: '7mm' }}>
        <h1 style={{ margin: 0, fontSize: '24pt', fontWeight: 700, color: '#1e1b4b', letterSpacing: '2px', textTransform: 'uppercase' }}>
          {personal.name || 'Your Name'}
        </h1>
        <div style={{ marginTop: '2mm', fontSize: '11pt', color: '#4338ca', fontStyle: 'italic' }}>
          {personal.title}
        </div>
        <div style={{ marginTop: '3mm', fontSize: '9.5pt', color: '#374151', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1mm 5mm' }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>· {personal.phone}</span>}
          {personal.location && <span>· {personal.location}</span>}
          {personal.website && <span>· {personal.website}</span>}
          {personal.linkedin && <span>· {personal.linkedin}</span>}
        </div>
      </header>

      <div style={{ borderTop: '2pt double #4338ca', borderBottom: '2pt double #4338ca', padding: '1mm 0', marginBottom: '6mm' }} />

      {personal.summary && (
        <Section title="Summary of Qualifications" accent="#4338ca">
          <p style={{ margin: 0, textAlign: 'justify' }}>{personal.summary}</p>
        </Section>
      )}

      {experience.length > 0 && (
        <Section title="Professional Experience" accent="#4338ca">
          {experience.map((e, i) => (
            <ExperienceRow
              key={i}
              exp={e}
              roleColor="#1e1b4b"
              companyColor="#4338ca"
              periodColor="#6b7280"
              bulletColor="#1f2937"
              fontSize="10pt"
            />
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education" accent="#4338ca">
          {education.map((e, i) => (
            <div key={i} style={{ marginBottom: '3mm' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: '11pt' }}>{e.institution || 'Institution'}</strong>
                {e.period && <span style={{ color: '#6b7280', fontStyle: 'italic', fontSize: '10pt' }}>{e.period}</span>}
              </div>
              <div style={{ fontStyle: 'italic', color: '#4338ca' }}>{e.degree}</div>
            </div>
          ))}
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Key Initiatives & Projects" accent="#4338ca">
          {projects.map((p, i) => (
            <ProjectCard key={i} project={p} titleColor="#1e1b4b" descColor="#1f2937" techColor="#4338ca" fontSize="10pt" />
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Core Competencies" accent="#4338ca">
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
      )}

      {certifications.length > 0 && (
        <Section title="Training & Certifications" accent="#4338ca">
          {certifications.map((c, i) => (
            <div key={i} style={{ marginBottom: '1.5mm' }}>
              <strong>{c.name}</strong>
              {c.issuer && <span> — {c.issuer}</span>}
              {c.year && <span style={{ color: '#6b7280' }}> ({c.year})</span>}
            </div>
          ))}
        </Section>
      )}
    </div>
  )
}
