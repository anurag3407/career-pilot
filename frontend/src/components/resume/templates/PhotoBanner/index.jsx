import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'
import Avatar from '../../shared/Avatar'

/**
 * PhotoBanner — full-width photo banner with gradient overlay. Built for
 * speakers, coaches, and consultants who lead with personal brand.
 */
export default function PhotoBanner() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

  return (
    <div
      className="resume-export-root"
      style={{
        width: '210mm',
        minHeight: '297mm',
        background: '#ffffff',
        color: '#0f172a',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: '10pt',
        lineHeight: 1.5,
      }}
    >
      {/* ── Banner with overlay ── */}
      <header
        style={{
          position: 'relative',
          minHeight: '60mm',
          background: 'linear-gradient(135deg, #4338ca 0%, #1e1b4b 60%, #0f172a 100%)',
          color: '#ffffff',
          padding: '10mm 18mm',
          display: 'flex',
          alignItems: 'center',
          gap: '8mm',
        }}
      >
        <Avatar sizeMm={36} accent="#0f172a" bg="#e0e7ff" fontSize="18pt" />
        <div>
          <h1 style={{ margin: 0, fontSize: '28pt', fontWeight: 700, letterSpacing: '-0.5px' }}>
            {personal.name || 'Your Name'}
          </h1>
          {personal.title && (
            <div style={{ marginTop: '2mm', fontSize: '13pt', color: '#e0e7ff', fontWeight: 400 }}>
              {personal.title}
            </div>
          )}
          <div style={{ marginTop: '3mm', fontSize: '9.5pt', color: '#e0e7ff', display: 'flex', flexWrap: 'wrap', gap: '1mm 6mm' }}>
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>· {personal.phone}</span>}
            {personal.location && <span>· {personal.location}</span>}
            {personal.website && <span>· {personal.website}</span>}
            {personal.linkedin && <span>· {personal.linkedin}</span>}
          </div>
        </div>
      </header>

      <div style={{ padding: '8mm 18mm 12mm' }}>
        {personal.summary && (
          <Section title="About" accent="#4338ca">
            <p style={{ margin: 0, color: '#334155', fontSize: '11pt', lineHeight: 1.6 }}>{personal.summary}</p>
          </Section>
        )}

        {experience.length > 0 && (
          <Section title="Experience" accent="#4338ca">
            {experience.map((e, i) => (
              <ExperienceRow
                key={i}
                exp={e}
                roleColor="#0f172a"
                companyColor="#4338ca"
                periodColor="#6b7280"
                bulletColor="#334155"
                fontSize="10pt"
              />
            ))}
          </Section>
        )}

        {skills.length > 0 && (
          <Section title="Skills" accent="#4338ca">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1mm' }}>
              {skills.map((s, i) => (
                <span key={i} style={{ fontSize: '9pt', padding: '0.5mm 2mm', background: '#e0e7ff', color: '#1e1b4b', borderRadius: 12, fontWeight: 500 }}>
                  {s.name}
                </span>
              ))}
            </div>
          </Section>
        )}

        {education.length > 0 && (
          <Section title="Education" accent="#4338ca">
            {education.map((e, i) => (
              <div key={i} style={{ marginBottom: '2mm' }}>
                <strong>{e.degree}</strong> · {e.institution}
                {e.period && <span style={{ color: '#6b7280' }}> · {e.period}</span>}
              </div>
            ))}
          </Section>
        )}

        {projects.length > 0 && (
          <Section title="Selected Projects" accent="#4338ca">
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
        )}

        {certifications.length > 0 && (
          <Section title="Certifications" accent="#4338ca">
            {certifications.map((c, i) => (
              <div key={i} style={{ marginBottom: '1.5mm' }}>
                <strong>{c.name}</strong>
                {c.issuer && <span> · {c.issuer}</span>}
                {c.year && <span style={{ color: '#6b7280' }}> · {c.year}</span>}
              </div>
            ))}
          </Section>
        )}
      </div>
    </div>
  )
}
