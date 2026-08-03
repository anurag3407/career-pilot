/**
 * TimelineNode — visual node used by timeline-style templates.
 * Renders a vertical rail with a dot + line.
 *
 * @param {object} props
 * @param {boolean} props.first  Skip the top half-line on the first node
 * @param {boolean} props.last   Skip the bottom half-line on the last node
 * @param {string} props.accent  Dot color
 * @param {string} props.rail    Rail color
 * @param {number} props.sizeMm  Dot diameter in millimeters
 */
export default function TimelineNode({
  first = false,
  last = false,
  accent = '#0f766e',
  rail = '#cbd5e1',
  sizeMm = 4,
  style = {},
}) {
  return (
    <div
      style={{
        width: `${sizeMm + 4}mm`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexShrink: 0,
        ...style,
      }}
    >
      <div
        style={{
          flex: first ? 0 : 1,
          width: '1pt',
          background: first ? 'transparent' : rail,
        }}
      />
      <div
        style={{
          width: `${sizeMm}mm`,
          height: `${sizeMm}mm`,
          borderRadius: '50%',
          background: accent,
          flexShrink: 0,
        }}
      />
      <div
        style={{
          flex: last ? 0 : 1,
          width: '1pt',
          background: last ? 'transparent' : rail,
        }}
      />
    </div>
  )
}
