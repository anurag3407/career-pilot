/**
 * BulletList — bullet-list renderer used by every experience / project block.
 * Splits content into <li> elements.
 *
 * @param {object} props
 * @param {string[]} props.bullets Array of bullet strings
 * @param {string} props.color Text color
 * @param {string} props.fontSize CSS font-size
 * @param {string} props.paddingLeft
 * @param {string} props.itemMargin
 */
export default function BulletList({
  bullets = [],
  color = '#374151',
  fontSize = '10pt',
  paddingLeft = '5mm',
  itemMargin = '1mm',
}) {
  if (!bullets || bullets.length === 0) return null
  return (
    <ul
      style={{
        margin: '2mm 0 0',
        paddingLeft,
        color,
        fontSize,
      }}
    >
      {bullets.map((b, i) => (
        <li key={i} style={{ marginBottom: itemMargin }}>
          {b}
        </li>
      ))}
    </ul>
  )
}
