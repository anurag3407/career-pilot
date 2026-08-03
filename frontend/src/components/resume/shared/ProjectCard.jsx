/**
 * ProjectCard — single project block used by every template.
 *
 * @param {object} props
 * @param {object} props.project
 * @param {string} props.titleColor
 * @param {string} props.descColor
 * @param {string} props.techColor
 * @param {string} props.linkColor
 * @param {string} props.fontSize
 * @param {boolean} props.card Wrap project in a soft card surface
 */
export default function ProjectCard({
  project = {},
  titleColor = '#0f172a',
  descColor = '#374151',
  techColor = '#0f766e',
  linkColor = '#0f766e',
  fontSize = '10pt',
  card = false,
}) {
  const wrap = {
    padding: card ? '3mm' : 0,
    background: card ? '#f8fafc' : 'transparent',
    border: card ? '1px solid #e2e8f0' : 'none',
    borderRadius: card ? 4 : 0,
    marginBottom: card ? '3mm' : '4mm',
  }
  return (
    <article style={wrap}>
      <h3
        style={{
          margin: 0,
          fontSize: `calc(${fontSize} + 0.5pt)`,
          fontWeight: 700,
          color: titleColor,
        }}
      >
        {project.title || 'Project'}
      </h3>
      {project.description && (
        <p style={{ margin: '1mm 0', fontSize, color: descColor }}>{project.description}</p>
      )}
      {project.techStack && project.techStack.length > 0 && (
        <div
          style={{
            fontSize: `calc(${fontSize} - 1pt)`,
            color: techColor,
            fontWeight: 500,
          }}
        >
          {project.techStack.join(' · ')}
        </div>
      )}
      {project.link && (
        <a
          href={project.link}
          style={{
            display: 'inline-block',
            marginTop: '1mm',
            fontSize: `calc(${fontSize} - 1pt)`,
            color: linkColor,
            textDecoration: 'underline',
            wordBreak: 'break-all',
          }}
        >
          {project.link}
        </a>
      )}
    </article>
  )
}
