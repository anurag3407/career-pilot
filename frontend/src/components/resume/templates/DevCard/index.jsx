import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'
import Avatar from '../../shared/Avatar'

/**
 * DevCard — GitHub-style profile card on top, project repos below.
 * Two-column layout with the profile card spanning both columns.
 */
export default function DevCard() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

  return (
    <div
      className="resume-export-root"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '14mm 16mm',
        background: '#ffffff',
        color: '#1f2937',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '10pt',
        lineHeight: 1.5,
      }}
    >
      {/* ── Profile card ── */}
      <header
        style={{
          background: 'linear-gradient(135deg, #047857 0%, #064e3b 60%, #022c22 100%)',
          color: '#ffffff',
          padding: '8mm 10mm',
          borderRadius: 8,
          display: 'grid',
          gridTemplateColumns: '28mm 1fr',
          gap: '8mm',
          marginBottom: '8mm',
          alignItems: 'center',
        }}
      >
        <Avatar sizeMm={26} accent="#022c22" bg="#a7f3d0" fontSize="14pt" />
        <div>
          <h1 style={{ margin: 0, fontSize: '22pt', fontWeight: 700, letterSpacing: '-0.5px' }}>
            {personal.name || 'Your Name'}
          </h1>
          {personal.title && (
            <div style={{ marginTop: '1mm', fontSize: '11pt', color: '#a7f3d0' }}>
              {personal.title}
            </div>
          )}
          <div style={{ marginTop: '3mm', fontSize: '9pt', color: '#d1fae5', display: 'flex', flexWrap: 'wrap', gap: '1mm 5mm' }}>
            {personal.email && <span>✉ {personal.email}</span>}
            {personal.location && <span>⌂ {personal.location}</span>}
            {personal.github && <span>gh: {personal.github.replace(/^https?:\/\//, '')}</span>}
            {personal.linkedin && <span>in: {personal.linkedin.replace(/^https?:\/\//, '')}</span>}
          </div>
        </div>
      </header>

      {personal.summary && (
        <Section title="Bio" accent="#047857">
          <p style={{ margin: 0, color: '#334155' }}>{personal.summary}</p>
        </Section>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6mm' }}>
        {skills.length > 0 && (
          <Section title="Tech I work with" accent="#047857">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1mm' }}>
              {skills.map((s, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '8.5pt',
                    padding: '0.5mm 2mm',
                    background: '#d1fae5',
                    color: '#047857',
                    borderRadius: 12,
                    fontWeight: 500,
                  }}
                >
                  {s.name}
                </span>
              ))}
            </div>
          </Section>
        )}

        {education.length > 0 && (
          <Section title="Education" accent="#047857">
            {education.map((e, i) => (
              <div key={i} style={{ marginBottom: '2mm' }}>
                <strong>{e.degree}</strong>
                <div style={{ color: '#047857', fontSize: '9pt' }}>{e.institution}</div>
                <div style={{ color: '#6b7280', fontSize: '8.5pt' }}>{e.period}</div>
              </div>
            ))}
          </Section>
        )}
      </div>

      {experience.length > 0 && (
        <Section title="Where I've worked" accent="#047857">
          {experience.map((e, i) => (
            <ExperienceRow
              key={i}
              exp={e}
              roleColor="#0f172a"
              companyColor="#047857"
              periodColor="#6b7280"
              bulletColor="#334155"
              fontSize="10pt"
            />
          ))}
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Pinned Repositories" accent="#047857">
          {projects.map((p, i) => (
            <article
              key={i}
              style={{
                marginBottom: '3mm',
                padding: '3mm',
                border: '1px solid #d1fae5',
                borderRadius: 6,
                background: '#f0fdf4',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '2mm' }}>
                <span style={{ color: '#047857', fontSize: '11pt' }}>📁</span>
                <strong style={{ color: '#047857' }}>{p.title}</strong>
              </div>
              {p.description && <p style={{ margin: '1mm 0 0', color: '#334155', fontSize: '9.5pt' }}>{p.description}</p>}
              {p.techStack.length > 0 && (
                <div style={{ marginTop: '1mm', fontSize: '8.5pt', color: '#6b7280' }}>
                  {p.techStack.join(' · ')}
                </div>
              )}
              {p.link && (
                <div style={{ marginTop: '1mm', fontSize: '8.5pt', color: '#047857' }}>
                  <span style={{ fontFamily: 'monospace' }}>{p.link}</span>
                </div>
              )}
            </article>
          ))}
        </Section>
      )}

      {certifications.length > 0 && (
        <Section title="Verified Badges" accent="#047857">
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
  )
}
