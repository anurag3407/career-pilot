/**
 * Heading — single-line, customizable section heading used by many templates
 * that don't want the full Section wrapper.
 *
 * @param {object} props
 * @param {string} props.title    Heading text
 * @param {string} props.accent   Heading color
 * @param {string} props.fontSize CSS font-size
 * @param {boolean} props.uppercase
 * @param {boolean} props.underline
 */
export default function Heading({
  title,
  accent = '#0f172a',
  fontSize = '11pt',
  uppercase = true,
  underline = false,
  style = {},
}) {
  return (
    <h2
      style={{
        fontSize,
        fontWeight: 700,
        color: accent,
        margin: 0,
        marginBottom: '2mm',
        textTransform: uppercase ? 'uppercase' : 'none',
        letterSpacing: uppercase ? '1.5px' : '0',
        paddingBottom: underline ? '1mm' : 0,
        borderBottom: underline ? `1pt solid ${accent}55` : 'none',
        ...style,
      }}
    >
      {title}
    </h2>
  )
}
