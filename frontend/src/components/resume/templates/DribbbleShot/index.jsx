import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import Avatar from '../../shared/Avatar'
import OrderedSections from '../../shared/OrderedSections'

/**
 * DribbbleShot — left large color block + right bio. Photo-enabled. Two-
 * column at top with a tall accent block on the left containing name.
 */
export default function DribbbleShot() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

  const nodes = {
    summary: personal.summary ? (
      <div>
        <div style={{ fontSize: '9pt', textTransform: 'uppercase', letterSpacing: '2px', color: '#be185d', marginBottom: '2mm', fontWeight: 700 }}>
          About
        </div>
        <p style={{ margin: 0, fontSize: '11pt', color: '#374151', lineHeight: 1.6 }}>
          {personal.summary}
        </p>
      </div>
    ) : null,

    skills: skills.length > 0 ? (
      <Section title="Skills" accent="#be185d" uppercase={false}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1mm' }}>
          {skills.map((s, i) => (
            <span key={i} style={{ fontSize: '9pt', padding: '0.5mm 2mm', background: '#fdf2f8', color: '#be185d', border: '1px solid #fbcfe8', borderRadius: 12, fontWeight: 500 }}>
              {s.name}
            </span>
          ))}
        </div>
      </Section>
    ) : null,

    education: education.length > 0 ? (
      <Section title="Education" accent="#be185d" uppercase={false}>
        {education.map((e, i) => (
          <div key={i} style={{ marginBottom: '2mm' }}>
            <strong>{e.degree}</strong>
            <div style={{ color: '#be185d', fontSize: '9pt' }}>{e.institution}</div>
            <div style={{ color: '#6b7280', fontSize: '8.5pt' }}>{e.period}</div>
          </div>
        ))}
      </Section>
    ) : null,

    certifications: certifications.length > 0 ? (
      <Section title="Certifications" accent="#be185d" uppercase={false}>
        {certifications.map((c, i) => (
          <div key={i} style={{ marginBottom: '1.5mm' }}>
            <strong>{c.name}</strong>
            <div style={{ color: '#6b7280', fontSize: '8.5pt' }}>
              {[c.issuer, c.year].filter(Boolean).join(' · ')}
            </div>
          </div>
        ))}
      </Section>
    ) : null,

    experience: experience.length > 0 ? (
      <Section title="Experience" accent="#be185d" uppercase={false}>
        {experience.map((e, i) => (
          <article key={i} style={{ marginBottom: '5mm' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <h3 style={{ margin: 0, fontSize: '11pt', fontWeight: 700, color: '#831843' }}>{e.role}</h3>
              {e.period && <span style={{ fontSize: '9pt', color: '#9ca3af' }}>{e.period}</span>}
            </div>
            <div style={{ fontSize: '10pt', color: '#be185d', fontWeight: 500 }}>
              {e.company}{e.location ? ` · ${e.location}` : ''}
            </div>
            {e.bullets.length > 0 && (
              <ul style={{ margin: '1.5mm 0 0', paddingLeft: '5mm', color: '#374151' }}>
                {e.bullets.map((b, j) => (
                  <li key={j} style={{ marginBottom: '0.7mm' }}>{b}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </Section>
    ) : null,

    projects: projects.length > 0 ? (
      <Section title="Selected Projects" accent="#be185d" uppercase={false}>
        {projects.map((p, i) => (
          <article key={i} style={{ marginBottom: '4mm', padding: '3mm', background: '#fdf2f8', borderRadius: 6, border: '1px solid #fbcfe8' }}>
            <h3 style={{ margin: 0, fontSize: '10.5pt', fontWeight: 700, color: '#831843' }}>{p.title}</h3>
            {p.description && <p style={{ margin: '1mm 0', fontSize: '9pt', color: '#374151' }}>{p.description}</p>}
            {p.techStack.length > 0 && (
              <div style={{ fontSize: '8pt', color: '#be185d', marginBottom: '1mm' }}>{p.techStack.join(' · ')}</div>
            )}
            {p.link && <div style={{ fontSize: '8.5pt', color: '#be185d' }}>{p.link}</div>}
          </article>
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
        color: '#1f2937',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '10pt',
        lineHeight: 1.5,
      }}
    >
      {/* ── Top split (fixed header slot) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '78mm 1fr', minHeight: '70mm' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #be185d 0%, #9d174d 60%, #831843 100%)',
            color: '#ffffff',
            padding: '10mm 8mm',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          <Avatar sizeMm={26} accent="#831843" bg="#fce7f3" fontSize="14pt" style={{ marginBottom: '5mm' }} />
          <h1 style={{ margin: 0, fontSize: '24pt', fontWeight: 700, letterSpacing: '-0.5px', lineHeight: 1 }}>
            {personal.name || 'Your Name'}
          </h1>
          {personal.title && (
            <div style={{ marginTop: '3mm', fontSize: '11pt', color: '#fce7f3', fontWeight: 400 }}>
              {personal.title}
            </div>
          )}
          <div style={{ marginTop: '4mm', fontSize: '9pt', color: '#fce7f3', display: 'flex', flexDirection: 'column', gap: '1mm' }}>
            {personal.email && <span>✉ {personal.email}</span>}
            {personal.phone && <span>☎ {personal.phone}</span>}
            {personal.location && <span>⌂ {personal.location}</span>}
            {personal.website && <span>↗ {personal.website.replace(/^https?:\/\//, '')}</span>}
          </div>
        </div>

        <div style={{ padding: '10mm 14mm' }}>
          {/* ── Summary sits in the right cell of the top split (header slot) ── */}
          {personal.summary && (
            <div>
              <div style={{ fontSize: '9pt', textTransform: 'uppercase', letterSpacing: '2px', color: '#be185d', marginBottom: '2mm', fontWeight: 700 }}>
                About
              </div>
              <p style={{ margin: 0, fontSize: '11pt', color: '#374151', lineHeight: 1.6 }}>
                {personal.summary}
              </p>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '0 14mm 12mm', display: 'grid', gridTemplateColumns: '78mm 1fr', gap: '6mm' }}>
        {/* ── Left column: skills + certs + education (fixed) ── */}
        <aside>
          {skills.length > 0 && (
            <Section title="Skills" accent="#be185d" uppercase={false}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1mm' }}>
                {skills.map((s, i) => (
                  <span key={i} style={{ fontSize: '9pt', padding: '0.5mm 2mm', background: '#fdf2f8', color: '#be185d', border: '1px solid #fbcfe8', borderRadius: 12, fontWeight: 500 }}>
                    {s.name}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {education.length > 0 && (
            <Section title="Education" accent="#be185d" uppercase={false}>
              {education.map((e, i) => (
                <div key={i} style={{ marginBottom: '2mm' }}>
                  <strong>{e.degree}</strong>
                  <div style={{ color: '#be185d', fontSize: '9pt' }}>{e.institution}</div>
                  <div style={{ color: '#6b7280', fontSize: '8.5pt' }}>{e.period}</div>
                </div>
              ))}
            </Section>
          )}

          {certifications.length > 0 && (
            <Section title="Certifications" accent="#be185d" uppercase={false}>
              {certifications.map((c, i) => (
                <div key={i} style={{ marginBottom: '1.5mm' }}>
                  <strong>{c.name}</strong>
                  <div style={{ color: '#6b7280', fontSize: '8.5pt' }}>
                    {[c.issuer, c.year].filter(Boolean).join(' · ')}
                  </div>
                </div>
              ))}
            </Section>
          )}
        </aside>

        {/* ── Right column: experience + projects (order-aware body) ── */}
        <main>
          <OrderedSections
            nodes={nodes}
            sectionProps={{ accent: '#be185d', uppercase: false }}
            customBodyStyle={{ color: '#374151' }}
          />
        </main>
      </div>
    </div>
  )
}