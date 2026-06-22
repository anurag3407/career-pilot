import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'

/**
 * StackOverflow — reputation-driven engineer template. Score chips and a
 * tag-cloud skills section. Two-column.
 */
export default function StackOverflow() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

  // Synthetic reputation score (gold/silver/bronze badges)
  const goldCount = Math.min(skills.length, 4)
  const silverCount = Math.min(skills.length - 4, 8)
  const bronzeCount = Math.max(0, skills.length - 12)

  return (
    <div
      className="resume-export-root"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '14mm 16mm',
        background: '#ffffff',
        color: '#232629',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: '10pt',
        lineHeight: 1.5,
        display: 'grid',
        gridTemplateColumns: '60mm 1fr',
        gap: '6mm',
      }}
    >
      {/* ── Left column ── */}
      <aside style={{ borderRight: '0.5pt solid #d6d9dc', paddingRight: '5mm' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3mm', marginBottom: '4mm' }}>
          <div
            style={{
              width: '12mm',
              height: '12mm',
              borderRadius: 3,
              background: '#f48024',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14pt',
              fontWeight: 700,
            }}
          >
            {(personal.name || 'U')[0]?.toUpperCase()}
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '14pt', fontWeight: 700, color: '#0074cc' }}>
              {personal.name || 'Your Name'}
            </h1>
            <div style={{ fontSize: '9pt', color: '#6a737c' }}>{personal.title}</div>
          </div>
        </div>

        <SideTitle>Contact</SideTitle>
        <div style={{ fontSize: '9pt', color: '#232629', lineHeight: 1.6 }}>
          {personal.email && <div>{personal.email}</div>}
          {personal.phone && <div>{personal.phone}</div>}
          {personal.location && <div>{personal.location}</div>}
          {personal.github && <div style={{ color: '#0074cc' }}>{personal.github.replace(/^https?:\/\//, '')}</div>}
          {personal.linkedin && <div style={{ color: '#0074cc' }}>{personal.linkedin.replace(/^https?:\/\//, '')}</div>}
        </div>

        <SideTitle>Reputation</SideTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2mm' }}>
          <BadgeRow color="#ffcc01" label="Gold" count={goldCount} />
          <BadgeRow color="#b4b8bc" label="Silver" count={silverCount} />
          <BadgeRow color="#ab825f" label="Bronze" count={bronzeCount} />
        </div>

        {skills.length > 0 && (
          <>
            <SideTitle>Top Tags</SideTitle>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1mm' }}>
              {skills.slice(0, 18).map((s, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '8pt',
                    padding: '0.5mm 2mm',
                    background: '#e1ecf4',
                    color: '#39739d',
                    borderRadius: 2,
                  }}
                >
                  {s.name}
                </span>
              ))}
            </div>
          </>
        )}

        {education.length > 0 && (
          <>
            <SideTitle>Education</SideTitle>
            {education.map((e, i) => (
              <div key={i} style={{ marginBottom: '2mm' }}>
                <strong style={{ fontSize: '9pt' }}>{e.degree}</strong>
                <div style={{ color: '#6a737c', fontSize: '8.5pt' }}>{e.institution}</div>
                <div style={{ color: '#9199a1', fontSize: '8pt' }}>{e.period}</div>
              </div>
            ))}
          </>
        )}

        {certifications.length > 0 && (
          <>
            <SideTitle>Verified Credentials</SideTitle>
            {certifications.map((c, i) => (
              <div key={i} style={{ marginBottom: '2mm', fontSize: '9pt' }}>
                <strong>{c.name}</strong>
                <div style={{ color: '#6a737c', fontSize: '8.5pt' }}>{c.issuer}{c.year ? ` · ${c.year}` : ''}</div>
              </div>
            ))}
          </>
        )}
      </aside>

      {/* ── Main ── */}
      <main>
        {personal.summary && (
          <Section title="About" accent="#0074cc">
            <p style={{ margin: 0, color: '#232629' }}>{personal.summary}</p>
          </Section>
        )}

        {experience.length > 0 && (
          <Section title="Developer Story" accent="#0074cc">
            {experience.map((e, i) => (
              <ExperienceRow
                key={i}
                exp={e}
                roleColor="#0c0d0e"
                companyColor="#0074cc"
                periodColor="#6a737c"
                bulletColor="#232629"
                fontSize="10pt"
              />
            ))}
          </Section>
        )}

        {projects.length > 0 && (
          <Section title="Featured Projects" accent="#0074cc">
            {projects.map((p, i) => (
              <div key={i} style={{ marginBottom: '3mm' }}>
                <strong>{p.title}</strong>
                {p.description && <div style={{ color: '#232629' }}>{p.description}</div>}
                {p.techStack.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1mm', marginTop: '1mm' }}>
                    {p.techStack.map((t) => (
                      <span key={t} style={{ fontSize: '8pt', padding: '0.4mm 1.5mm', background: '#e1ecf4', color: '#39739d', borderRadius: 2 }}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </Section>
        )}
      </main>
    </div>
  )
}

function SideTitle({ children }) {
  return (
    <h2
      style={{
        fontSize: '8.5pt',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        color: '#232629',
        margin: '6mm 0 2mm',
        paddingBottom: '1mm',
        borderBottom: '0.5pt solid #d6d9dc',
      }}
    >
      {children}
    </h2>
  )
}

function BadgeRow({ color, label, count }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2mm' }}>
      <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block' }} />
      <span style={{ fontSize: '9pt', color: '#232629' }}>{label}</span>
      <span style={{ marginLeft: 'auto', fontSize: '9pt', fontWeight: 600, color: '#6a737c' }}>{count}</span>
    </div>
  )
}
