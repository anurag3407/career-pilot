import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'

/**
 * TeacherEducation — certifications plus grade levels taught.
 * Single-column with a "Grade Levels" + "Subjects" block.
 */
export default function TeacherEducation() {
  const { personal, experience, education, skills, certifications } = useResume()

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
      <header style={{ textAlign: 'center', marginBottom: '6mm', paddingBottom: '4mm', borderBottom: '1pt solid #b45309' }}>
        <h1 style={{ margin: 0, fontSize: '24pt', fontWeight: 700, color: '#1c1917' }}>
          {personal.name || 'Your Name'}
        </h1>
        {personal.title && (
          <div style={{ marginTop: '1mm', fontSize: '12pt', color: '#b45309', fontStyle: 'italic' }}>
            {personal.title}
          </div>
        )}
        <div style={{ marginTop: '2mm', fontSize: '9.5pt', color: '#57534e', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1mm 5mm' }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>· {personal.phone}</span>}
          {personal.location && <span>· {personal.location}</span>}
          {personal.linkedin && <span>· {personal.linkedin}</span>}
        </div>
      </header>

      {personal.summary && (
        <Section title="Teaching Philosophy" accent="#b45309" variant="plain">
          <p style={{ margin: 0, textAlign: 'justify', color: '#1c1917', fontStyle: 'italic' }}>{personal.summary}</p>
        </Section>
      )}

      <Section title="Grade Levels & Subjects" accent="#b45309">
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

      {experience.length > 0 && (
        <Section title="Teaching Experience" accent="#b45309">
          {experience.map((e, i) => (
            <div key={i} style={{ marginBottom: '5mm' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <strong style={{ fontSize: '11pt', color: '#1c1917' }}>{e.role}</strong>
                {e.period && <span style={{ fontSize: '10pt', color: '#78716c', fontStyle: 'italic' }}>{e.period}</span>}
              </div>
              <div style={{ fontSize: '10.5pt', color: '#b45309', fontStyle: 'italic' }}>
                {[e.company, e.location].filter(Boolean).join(', ')}
              </div>
              {e.bullets.length > 0 && (
                <ul style={{ margin: '1.5mm 0 0', paddingLeft: '5mm', color: '#1c1917' }}>
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
        <Section title="Education" accent="#b45309">
          {education.map((e, i) => (
            <div key={i} style={{ marginBottom: '2mm' }}>
              <strong>{e.degree}</strong> · {e.institution}
              {e.period && <span style={{ color: '#78716c' }}> · {e.period}</span>}
            </div>
          ))}
        </Section>
      )}

      {certifications.length > 0 && (
        <Section title="Teaching Certifications" accent="#b45309">
          <ul style={{ margin: 0, paddingLeft: '5mm', color: '#1c1917' }}>
            {certifications.map((c, i) => (
              <li key={i} style={{ marginBottom: '0.5mm' }}>
                <strong>{c.name}</strong>
                {c.issuer && <span> · {c.issuer}</span>}
                {c.year && <span style={{ color: '#78716c' }}> · {c.year}</span>}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills" accent="#b45309">
          <div style={{ color: '#1c1917', lineHeight: 1.7 }}>{skills.map((s) => s.name).join(' · ')}</div>
        </Section>
      )}
    </div>
  )
}
