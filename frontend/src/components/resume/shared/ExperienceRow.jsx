/**
 * ExperienceRow — single experience block used by every template.
 * Renders role, period, company/location, and bullets in a consistent shape.
 *
 * Templates can pass color overrides to align with their accent palette.
 *
 * @param {object} props
 * @param {object} props.exp      Experience item from ResumeContext
 * @param {string} props.roleColor
 * @param {string} props.companyColor
 * @param {string} props.periodColor
 * @param {string} props.bulletColor
 * @param {string} props.fontSize
 */
export default function ExperienceRow({
  exp = {},
  roleColor = '#0f172a',
  companyColor = '#0f766e',
  periodColor = '#6b7280',
  bulletColor = '#374151',
  fontSize = '10pt',
}) {
  const roleFontSize = `calc(${fontSize} + 1pt)`
  const periodFontSize = `calc(${fontSize} - 1pt)`
  return (
    <article style={{ marginBottom: '5mm' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: roleFontSize,
            fontWeight: 700,
            color: roleColor,
          }}
        >
          {exp.role || 'Role'}
        </h3>
        {exp.period && (
          <span
            style={{
              fontSize: periodFontSize,
              color: periodColor,
              whiteSpace: 'nowrap',
            }}
          >
            {exp.period}
          </span>
        )}
      </div>
      {(exp.company || exp.location) && (
        <div
          style={{
            fontSize,
            color: companyColor,
            fontWeight: 500,
            marginTop: '0.5mm',
          }}
        >
          {[exp.company, exp.location].filter(Boolean).join(' · ')}
        </div>
      )}
      {exp.bullets && exp.bullets.length > 0 && (
        <ul
          style={{
            margin: '2mm 0 0',
            paddingLeft: '5mm',
            color: bulletColor,
            fontSize,
          }}
        >
          {exp.bullets.map((b, j) => (
            <li key={j} style={{ marginBottom: '1mm' }}>
              {b}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
