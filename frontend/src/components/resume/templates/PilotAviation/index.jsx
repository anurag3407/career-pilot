import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import KPICell from '../../shared/KPICell'
import Avatar from '../../shared/Avatar'

/**
 * PilotAviation — type ratings and flight hours. Photo-enabled.
 */
export default function PilotAviation() {
  const { personal, experience, education, skills, certifications } = useResume()

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
      <header
        style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 60%, #1e3a8a 100%)',
          color: '#ffffff',
          padding: '10mm 18mm',
          display: 'grid',
          gridTemplateColumns: '28mm 1fr',
          gap: '8mm',
          alignItems: 'center',
        }}
      >
        <Avatar sizeMm={26} accent="#1e3a8a" bg="#dbeafe" fontSize="14pt" />
        <div>
          <h1 style={{ margin: 0, fontSize: '26pt', fontWeight: 700, letterSpacing: '-0.5px' }}>
            {personal.name || 'Your Name'}
          </h1>
          {personal.title && (
            <div style={{ marginTop: '2mm', fontSize: '12pt', color: '#dbeafe' }}>
              {personal.title}
            </div>
          )}
          <div style={{ marginTop: '3mm', fontSize: '9.5pt', color: '#dbeafe', display: 'flex', flexWrap: 'wrap', gap: '1mm 5mm' }}>
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>· {personal.phone}</span>}
            {personal.location && <span>· {personal.location}</span>}
            {personal.linkedin && <span>· {personal.linkedin}</span>}
          </div>
        </div>
      </header>

      {/* ── KPI strip ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '3mm', padding: '5mm 18mm' }}>
        <KPICell label="Total Hours" value="4,250" bg="#dbeafe" fg="#1e3a8a" lbl="#2563eb" />
        <KPICell label="PIC Hours" value="3,100" bg="#dbeafe" fg="#1e3a8a" lbl="#2563eb" />
        <KPICell label="Type Ratings" value="4" bg="#dbeafe" fg="#1e3a8a" lbl="#2563eb" />
        <KPICell label="Years" value="9+" bg="#dbeafe" fg="#1e3a8a" lbl="#2563eb" />
      </div>

      <Section title="Type Ratings & Certifications" accent="#2563eb">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1mm 4mm', fontSize: '10pt' }}>
          <span><strong>ATP</strong> · Air Transport Pilot</span>
          <span>· <strong>CFI</strong> · Certificated Flight Instructor</span>
          <span>· <strong>CFII</strong> · Instrument Instructor</span>
          <span>· <strong>Type:</strong> B737, A320, CRJ-200, ERJ-170</span>
        </div>
      </Section>

      <div style={{ padding: '4mm 18mm 12mm' }}>
        {personal.summary && (
          <Section title="Profile" accent="#2563eb">
            <p style={{ margin: 0, color: '#334155' }}>{personal.summary}</p>
          </Section>
        )}

        {experience.length > 0 && (
          <Section title="Flight Experience" accent="#2563eb">
            {experience.map((e, i) => (
              <div key={i} style={{ marginBottom: '5mm' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <strong style={{ fontSize: '11pt', color: '#0f172a' }}>{e.role}</strong>
                  {e.period && <span style={{ fontSize: '9pt', color: '#64748b' }}>{e.period}</span>}
                </div>
                <div style={{ fontSize: '10pt', color: '#2563eb', fontWeight: 500 }}>
                  {[e.company, e.location].filter(Boolean).join(' · ')}
                </div>
                {e.bullets.length > 0 && (
                  <ul style={{ margin: '1.5mm 0 0', paddingLeft: '5mm', color: '#334155' }}>
                    {e.bullets.map((b, j) => (
                      <li key={j} style={{ marginBottom: '0.5mm' }}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </Section>
        )}

        {education.length > 0 && (
          <Section title="Education" accent="#2563eb">
            {education.map((e, i) => (
              <div key={i} style={{ marginBottom: '2mm' }}>
                <strong>{e.degree}</strong> · {e.institution}
                {e.period && <span style={{ color: '#64748b' }}> · {e.period}</span>}
              </div>
            ))}
          </Section>
        )}

        {skills.length > 0 && (
          <Section title="Skills" accent="#2563eb">
            <div style={{ color: '#334155' }}>{skills.map((s) => s.name).join(' · ')}</div>
          </Section>
        )}

        {certifications.length > 0 && (
          <Section title="Additional Certifications" accent="#2563eb">
            {certifications.map((c, i) => (
              <div key={i} style={{ marginBottom: '1.5mm' }}>
                <strong>{c.name}</strong>
                {c.issuer && <span> · {c.issuer}</span>}
                {c.year && <span style={{ color: '#64748b' }}> · {c.year}</span>}
              </div>
            ))}
          </Section>
        )}
      </div>
    </div>
  )
}
