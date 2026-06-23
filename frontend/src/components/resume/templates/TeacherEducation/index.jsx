import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'
import ExperienceRow from '../../shared/ExperienceRow'
import OrderedSections from '../../shared/OrderedSections'

/**
 * TeacherEducation — certifications plus grade levels taught.
 * Single-column with a "Grade Levels" + "Subjects" block.
 */
export default function TeacherEducation() {
  const { personal, experience, education, skills, certifications } = useResume()

  const nodes = {
    summary: personal.summary ? (
      <Section title="Teaching Philosophy" accent="#b45309" variant="plain" uppercase={false}>
        <p style={{ margin: 0, textAlign: 'justify', color: '#1c1917', fontStyle: 'italic' }}>{personal.summary}</p>
      </Section>
    ) : null,

    experience: experience.length > 0 ? (
      <Section title="Teaching Experience" accent="#b45309" uppercase={false}>
        {experience.map((e, i) => (
          <ExperienceRow
            key={i}
            exp={e}
            roleColor="#1c1917"
            companyColor="#b45309"
            periodColor="#78716c"
            bulletColor="#1c1917"
            fontSize="10.5pt"
          />
        ))}
      </Section>
    ) : null,

    education: education.length > 0 ? (
      <Section title="Education" accent="#b45309" uppercase={false}>
        {education.map((e, i) => (
          <div key={i} style={{ marginBottom: '2mm' }}>
            <strong>{e.degree}</strong> · {e.institution}
            {e.period && <span style={{ color: '#78716c' }}> · {e.period}</span>}
          </div>
        ))}
      </Section>
    ) : null,

    certifications: certifications.length > 0 ? (
      <Section title="Teaching Certifications" accent="#b45309" uppercase={false}>
        {certifications.map((c, i) => (
          <div key={i} style={{ marginBottom: '0.5mm' }}>
            <strong>{c.name}</strong>
            {c.issuer && <span> · {c.issuer}</span>}
            {c.year && <span style={{ color: '#78716c' }}> · {c.year}</span>}
          </div>
        ))}
      </Section>
    ) : null,

    skills: skills.length > 0 ? (
      <Section title="Skills" accent="#b45309" uppercase={false}>
        <div style={{ color: '#1c1917', lineHeight: 1.7 }}>{skills.map((s) => s.name).join(' · ')}</div>
      </Section>
    ) : null,
  }

  return (
    <div
      className="resume-export-root"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '16mm 18mm',
        background: '#ffffff',
        color: '#1c1917',
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: '10.5pt',
        lineHeight: 1.5,
      }}
    >
      {/* ── Header (fixed) ── */}
      <header style={{ textAlign: 'center', marginBottom: '6mm', paddingBottom: '4mm', borderBottom: '1pt solid #b45309' }}>
        <h1 style={{ margin: 0, fontSize: '24pt', fontWeight: 700, color: '#1c1917' }}>
          {personal.name || 'Your Name'}
        </h1>
        <div style={{ marginTop: '1mm', fontSize: '12pt', color: '#b45309', fontStyle: 'italic' }}>
          {personal.title}
        </div>
        <div style={{ marginTop: '2mm', fontSize: '9.5pt', color: '#57534e', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1mm 5mm' }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>· {personal.phone}</span>}
          {personal.location && <span>· {personal.location}</span>}
          {personal.linkedin && <span>· {personal.linkedin}</span>}
        </div>
      </header>

      {/* ── Body sections (drag-and-drop order honored here) ── */}
      <OrderedSections
        nodes={nodes}
        sectionProps={{ accent: '#b45309', uppercase: false }}
        customBodyStyle={{ color: '#1c1917' }}
        header={
          <Section title="Grade Levels & Subjects" accent="#b45309" uppercase={false}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2mm 8mm', fontSize: '10pt' }}>
              <div>
                <strong style={{ color: '#b45309' }}>Grade Levels:</strong>
                <div style={{ marginTop: '1mm' }}>Pre-K · Elementary (K-5) · Middle School · High School · Post-Secondary</div>
              </div>
              <div>
                <strong style={{ color: '#b45309' }}>Subjects Taught:</strong>
                <div style={{ marginTop: '1mm' }}>Mathematics · Science · English Language Arts · Social Studies · Computer Science</div>
              </div>
            </div>
          </Section>
        }
      />
    </div>
  )
}