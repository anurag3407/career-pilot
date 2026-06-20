import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'

/**
 * MagazineEditorial — serif hero with pull-quote summary block. Reads like
 * the masthead of a print magazine.
 */
export default function MagazineEditorial() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

  return (
    <div
      className="resume-export-root"
      style={{
        width: '210mm',
        minHeight: '297mm',
        background: '#ffffff',
        color: '#1f2937',
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: '10pt',
        lineHeight: 1.5,
      }}
    >
      {/* ── Masthead ── */}
      <header
        style={{
          padding: '14mm 22mm 10mm',
          borderBottom: '3pt double #831843',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '9pt', letterSpacing: '4px', textTransform: 'uppercase', color: '#831843', marginBottom: '3mm' }}>
          Career · Portfolio · Issue
        </div>
        <h1 style={{ margin: 0, fontSize: '36pt', fontWeight: 700, color: '#1f2937', letterSpacing: '-0.5px', lineHeight: 1 }}>
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <div style={{ marginTop: '3mm', fontSize: '14pt', color: '#831843', fontStyle: 'italic' }}>
            {personal.title}
          </div>
        )}
        <div style={{ marginTop: '4mm', fontSize: '9pt', color: '#6b7280', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1mm 5mm' }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>· {personal.phone}</span>}
          {personal.location && <span>· {personal.location}</span>}
          {personal.website && <span>· {personal.website}</span>}
        </div>
      </header>

      <div style={{ padding: '8mm 22mm 12mm' }}>
        {personal.summary && (
          <section
            style={{
              marginBottom: '8mm',
              padding: '6mm 8mm',
              background: '#fdf2f8',
              borderLeft: '4pt solid #be185d',
            }}
          >
            <div style={{ fontSize: '9pt', textTransform: 'uppercase', letterSpacing: '2px', color: '#be185d', marginBottom: '2mm', fontWeight: 700 }}>
              Editor's Note
            </div>
            <p style={{ margin: 0, fontStyle: 'italic', fontSize: '11.5pt', color: '#1f2937', lineHeight: 1.55 }}>
              {personal.summary}
            </p>
          </section>
        )}

        {experience.length > 0 && (
          <Section title="Selected Features" accent="#831843">
            {experience.map((e, i) => (
              <article key={i} style={{ marginBottom: '5mm' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h3 style={{ margin: 0, fontSize: '12pt', fontWeight: 700, color: '#1f2937' }}>
                    {e.role} <span style={{ fontWeight: 400, color: '#be185d' }}>at {e.company}</span>
                  </h3>
                  {e.period && <span style={{ fontSize: '9pt', color: '#6b7280', fontStyle: 'italic' }}>{e.period}</span>}
                </div>
                {e.bullets.length > 0 && (
                  <ul style={{ margin: '2mm 0 0', paddingLeft: '5mm', color: '#374151' }}>
                    {e.bullets.map((b, j) => (
                      <li key={j} style={{ marginBottom: '1mm' }}>{b}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </Section>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: skills.length > 0 && education.length > 0 ? '1fr 1fr' : '1fr',
            gap: '8mm',
          }}
        >
          {skills.length > 0 && (
            <Section title="Capabilities" accent="#831843">
              <div style={{ color: '#1f2937', lineHeight: 1.8 }}>
                {skills.map((s, i) => (
                  <span key={i} style={{ display: 'block', marginBottom: '1mm' }}>
                    <strong>{s.name}</strong>
                    {s.level && <span style={{ color: '#6b7280', fontStyle: 'italic' }}> · {s.level}</span>}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {education.length > 0 && (
            <Section title="Education" accent="#831843">
              {education.map((e, i) => (
                <div key={i} style={{ marginBottom: '3mm' }}>
                  <strong>{e.degree}</strong>
                  <div style={{ color: '#831843', fontStyle: 'italic' }}>{e.institution}</div>
                  <div style={{ color: '#6b7280', fontSize: '9pt' }}>{e.period}</div>
                </div>
              ))}
            </Section>
          )}
        </div>

        {projects.length > 0 && (
          <Section title="Portfolio" accent="#831843">
            {projects.map((p, i) => (
              <div key={i} style={{ marginBottom: '3mm' }}>
                <strong>{p.title}</strong>
                {p.description && <div style={{ color: '#374151' }}>{p.description}</div>}
                {p.techStack.length > 0 && (
                  <div style={{ color: '#be185d', fontSize: '8.5pt', fontStyle: 'italic' }}>{p.techStack.join(' · ')}</div>
                )}
                {p.link && <div style={{ color: '#be185d', fontSize: '8.5pt' }}>{p.link}</div>}
              </div>
            ))}
          </Section>
        )}

        {certifications.length > 0 && (
          <Section title="Credentials" accent="#831843">
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
