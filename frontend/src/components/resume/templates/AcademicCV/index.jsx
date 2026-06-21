import { useResume } from '../../../../context/ResumeContext'
import Section from '../../shared/Section'

/**
 * AcademicCV — long-form academic CV with publications, grants, and
 * teaching sections. Single-column, dense metadata.
 */
export default function AcademicCV() {
  const { personal, education, experience } = useResume()

  return (
    <div
      className="resume-export-root"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '16mm 18mm',
        background: '#ffffff',
        color: '#1e1b4b',
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: '10pt',
        lineHeight: 1.45,
      }}
    >
      <header style={{ marginBottom: '6mm' }}>
        <h1 style={{ margin: 0, fontSize: '22pt', fontWeight: 700, color: '#1e1b4b' }}>
          {personal.name || 'Your Name'}
        </h1>
        <div style={{ marginTop: '1mm', fontSize: '11pt', color: '#4338ca', fontStyle: 'italic' }}>
          {personal.title}
        </div>
        <div style={{ marginTop: '2mm', fontSize: '9.5pt', color: '#374151' }}>
          {[personal.email, personal.phone, personal.location, personal.linkedin].filter(Boolean).join(' · ')}
        </div>
      </header>

      <Section title="Academic Appointments" accent="#4338ca" spacing="Compact">
        {experience.slice(0, 2).map((e, i) => (
          <div key={i} style={{ marginBottom: '2mm' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{e.role}</strong>
              {e.period && <span style={{ color: '#6b7280' }}>{e.period}</span>}
            </div>
            <div style={{ fontStyle: 'italic', color: '#4338ca' }}>{e.company}{e.location ? `, ${e.location}` : ''}</div>
          </div>
        ))}
      </Section>

      <Section title="Education" accent="#4338ca" spacing="Compact">
        {education.map((e, i) => (
          <div key={i} style={{ marginBottom: '2mm' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{e.degree}</strong>
              {e.period && <span style={{ color: '#6b7280' }}>{e.period}</span>}
            </div>
            <div style={{ fontStyle: 'italic', color: '#4338ca' }}>{e.institution}</div>
            {e.description && <div style={{ fontSize: '9.5pt', color: '#6b7280', marginTop: '1mm' }}>{e.description}</div>}
          </div>
        ))}
      </Section>

      <Section title="Publications" accent="#4338ca" spacing="Compact">
        <ol style={{ margin: 0, paddingLeft: '5mm' }}>
          <li style={{ marginBottom: '1.5mm' }}>Author, A. (2024). "Title of Paper." <em>Journal of Research</em>, 12(3), 45-67.</li>
          <li style={{ marginBottom: '1.5mm' }}>Author, A., & Co-Author, B. (2023). "Title of Paper." <em>Journal of Research</em>, 11(2), 12-34.</li>
          <li style={{ marginBottom: '1.5mm' }}>Author, A. (2022). "Title of Paper." <em>Conference Proceedings</em>, 2022, 100-115.</li>
        </ol>
      </Section>

      <Section title="Grants & Fellowships" accent="#4338ca" spacing="Compact">
        <ul style={{ margin: 0, paddingLeft: '5mm' }}>
          <li style={{ marginBottom: '1.5mm' }}>NSF Grant #XXXXX — "$XX,XXX" (2023-2025). Role: PI.</li>
          <li style={{ marginBottom: '1.5mm' }}>University Research Fellowship — "$X,XXX" (2022). Role: Sole PI.</li>
        </ul>
      </Section>

      <Section title="Teaching Experience" accent="#4338ca" spacing="Compact">
        <ul style={{ margin: 0, paddingLeft: '5mm' }}>
          <li style={{ marginBottom: '1.5mm' }}>Graduate Seminar — "Topic Title" (Spring 2024, 2025)</li>
          <li style={{ marginBottom: '1.5mm' }}>Undergraduate Course — "Topic Title" (Fall 2022, 2023, 2024)</li>
        </ul>
      </Section>

      <Section title="Service" accent="#4338ca" spacing="Compact">
        <ul style={{ margin: 0, paddingLeft: '5mm' }}>
          <li style={{ marginBottom: '1.5mm' }}>Editorial board, <em>Journal of Research</em> (2023-present).</li>
          <li style={{ marginBottom: '1.5mm' }}>Committee member, University Faculty Senate (2022-2024).</li>
        </ul>
      </Section>

      <Section title="Presentations" accent="#4338ca" spacing="Compact">
        <ul style={{ margin: 0, paddingLeft: '5mm' }}>
          <li style={{ marginBottom: '1.5mm' }}>"Title of Talk." Annual Conference. City, State. (2024).</li>
          <li style={{ marginBottom: '1.5mm' }}>"Title of Talk." Annual Conference. City, State. (2023).</li>
        </ul>
      </Section>
    </div>
  )
}
