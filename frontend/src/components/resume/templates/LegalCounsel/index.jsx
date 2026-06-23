import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'
import OrderedSections from '../../shared/OrderedSections'

/**
 * LegalCounsel — bar admissions and matters handled. In-house counsel or
 * attorney variant of AttorneyBrief.
 */
export default function LegalCounsel() {
  const { personal, experience, education, certifications } = useResume()

  const nodes = {
    summary: personal.summary ? (
      <Section title="Profile" accent="#4338ca" uppercase={false}>
        <p style={{ margin: 0, textAlign: 'justify', color: '#1e1b4b' }}>{personal.summary}</p>
      </Section>
    ) : null,

    experience: experience.length > 0 ? (
      <Section title="In-House & Firm Experience" accent="#4338ca" uppercase={false}>
        {experience.map((e, i) => (
          <ExperienceRow
            key={i}
            exp={e}
            roleColor="#1e1b4b"
            companyColor="#4338ca"
            periodColor="#64748b"
            bulletColor="#1e1b4b"
            fontSize="10pt"
          />
        ))}
      </Section>
    ) : null,

    education: education.length > 0 ? (
      <Section title="Education" accent="#4338ca" uppercase={false}>
        {education.map((e, i) => (
          <div key={i} style={{ marginBottom: '2mm' }}>
            <strong>{e.institution}</strong> · {e.degree}
            {e.period && <span style={{ color: '#64748b' }}> · {e.period}</span>}
          </div>
        ))}
      </Section>
    ) : null,

    certifications: certifications.length > 0 ? (
      <Section title="Affiliations & Certifications" accent="#4338ca" uppercase={false}>
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
        color: '#1e1b4b',
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: '10pt',
        lineHeight: 1.5,
      }}
    >
      {/* ── Header (fixed) ── */}
      <header style={{ borderBottom: '1.5pt solid #4338ca', paddingBottom: '4mm', marginBottom: '6mm' }}>
        <h1 style={{ margin: 0, fontSize: '22pt', fontWeight: 700, color: '#1e1b4b' }}>
          {personal.name || 'Your Name'}
        </h1>
        <div style={{ marginTop: '1mm', fontSize: '11pt', color: '#4338ca', fontStyle: 'italic' }}>
          {personal.title}
        </div>
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
        sectionProps={{ accent: '#4338ca', uppercase: false }}
        customBodyStyle={{ color: '#1e1b4b' }}
        header={
          <Section title="Bar Admissions" accent="#4338ca" uppercase={false}>
            <div style={{ fontSize: '10pt', lineHeight: 1.6 }}>
              <div>· New York State Bar (Active, since 2017)</div>
              <div>· California State Bar (Active, since 2019)</div>
              <div>· U.S. District Court, S.D.N.Y. · E.D.N.Y.</div>
            </div>
          </Section>
        }
        footer={
          <>
            <Section title="Practice Areas" accent="#4338ca" uppercase={false}>
              <div style={{ fontSize: '10pt', lineHeight: 1.6 }}>
                <div>· Commercial Contracts · Corporate Governance · M&amp;A</div>
                <div>· Privacy &amp; Data Protection · Employment Law · IP Licensing</div>
              </div>
            </Section>

            <Section title="Notable Matters" accent="#4338ca" uppercase={false}>
              <div style={{ fontSize: '10pt', lineHeight: 1.6 }}>
                <div>· Led $300M+ corporate venture portfolio across 18 portfolio companies.</div>
                <div>· Negotiated 50+ commercial agreements including MSAs, NDAs, and SaaS contracts.</div>
                <div>· Advised on global privacy program covering 30+ jurisdictions.</div>
              </div>
            </Section>
          </>
        }
      />
    </div>
  )
}