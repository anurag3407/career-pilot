import { useResume } from '../../../../context/ResumeContext'
import ExperienceRow from '../../shared/ExperienceRow'
import OrderedSections from '../../shared/OrderedSections'

/**
 * Glassmorphism — frosted-glass card surfaces over a gradient background.
 * Two-column with translucent cards.
 */
export default function Glassmorphism() {
  const { personal, experience, education, projects, skills, certifications } = useResume()

  const nodes = {
    summary: personal.summary ? (
      <GlassCard title="About">
        <p style={{ margin: 0, color: '#1f2937' }}>{personal.summary}</p>
      </GlassCard>
    ) : null,

    skills: skills.length > 0 ? (
      <GlassCard title="Skills">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1mm' }}>
          {skills.map((s, i) => (
            <span key={i} style={{ fontSize: '9pt', padding: '0.5mm 2mm', background: 'rgba(255, 255, 255, 0.4)', color: '#1e1b4b', borderRadius: 12, fontWeight: 500 }}>
              {s.name}
            </span>
          ))}
        </div>
      </GlassCard>
    ) : null,

    experience: experience.length > 0 ? (
      <GlassCard title="Experience" wide>
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
      </GlassCard>
    ) : null,

    education: education.length > 0 ? (
      <GlassCard title="Education">
        {education.map((e, i) => (
          <div key={i} style={{ marginBottom: '2mm' }}>
            <strong>{e.degree}</strong>
            <div style={{ color: '#4338ca', fontSize: '9pt' }}>{e.institution}</div>
            <div style={{ color: '#6b7280', fontSize: '8.5pt' }}>{e.period}</div>
          </div>
        ))}
      </GlassCard>
    ) : null,

    projects: projects.length > 0 ? (
      <GlassCard title="Projects">
        {projects.map((p, i) => (
          <div key={i} style={{ marginBottom: '2mm' }}>
            <strong>{p.title}</strong>
            {p.description && <div style={{ color: '#1f2937' }}>{p.description}</div>}
          </div>
        ))}
      </GlassCard>
    ) : null,

    certifications: certifications.length > 0 ? (
      <GlassCard title="Certifications" wide>
        {certifications.map((c, i) => (
          <div key={i} style={{ marginBottom: '1.5mm' }}>
            <strong>{c.name}</strong>
            {c.issuer && <span> · {c.issuer}</span>}
            {c.year && <span style={{ color: '#6b7280' }}> · {c.year}</span>}
          </div>
        ))}
      </GlassCard>
    ) : null,
  }

  return (
    <div
      className="resume-export-root"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '14mm 16mm',
        background: 'linear-gradient(135deg, #4338ca 0%, #7c3aed 50%, #ec4899 100%)',
        color: '#1f2937',
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '10pt',
        lineHeight: 1.5,
      }}
    >
      {/* ── Header (fixed) ── */}
      <header style={{ marginBottom: '7mm' }}>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.18)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: 12,
            padding: '8mm 10mm',
            color: '#ffffff',
          }}
        >
          <h1 style={{ margin: 0, fontSize: '28pt', fontWeight: 700, letterSpacing: '-0.5px' }}>
            {personal.name || 'Your Name'}
          </h1>
          {personal.title && (
            <div style={{ marginTop: '2mm', fontSize: '13pt', color: 'rgba(255, 255, 255, 0.85)' }}>
              {personal.title}
            </div>
          )}
          <div style={{ marginTop: '4mm', fontSize: '9.5pt', color: 'rgba(255, 255, 255, 0.85)', display: 'flex', flexWrap: 'wrap', gap: '1mm 6mm' }}>
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>· {personal.phone}</span>}
            {personal.location && <span>· {personal.location}</span>}
            {personal.linkedin && <span>· {personal.linkedin}</span>}
          </div>
        </div>
      </header>

      {/* ── Body sections (drag-and-drop order honored here) ── */}
      <OrderedSections
        nodes={nodes}
        sectionProps={{ accent: '#4338ca', uppercase: false }}
        customBodyStyle={{ color: '#1f2937' }}
      />
    </div>
  )
}

function GlassCard({ title, children, wide }) {
  return (
    <section
      style={{
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        borderRadius: 10,
        padding: '5mm 6mm',
        marginBottom: '4mm',
        gridColumn: wide ? 'span 2' : 'auto',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h2 style={{ margin: '0 0 3mm', fontSize: '10pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#4338ca' }}>
        {title}
      </h2>
      {children}
    </section>
  )
}