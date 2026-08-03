import { useResume } from '../../../context/ResumeContext'

/**
 * Avatar — renders initials OR photo. Falls back gracefully.
 *
 * Uses personal.photo (data URL or remote URL) when present, otherwise
 * computes initials from personal.name.
 *
 * @param {object} props
 * @param {number} props.sizeMm  Diameter in millimeters
 * @param {string} props.accent Accent color (initials bg)
 * @param {string} props.bg     Background color (initials text)
 * @param {number} props.fontSize Font size for initials (CSS string)
 * @param {object} props.style  Extra inline styles for the wrapper
 */
export default function Avatar({
  sizeMm = 36,
  accent = '#0f766e',
  bg = '#ccfbf1',
  fontSize,
  style = {},
}) {
  const { personal } = useResume()
  const initials = (personal?.name || 'U')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('')

  const baseStyle = {
    width: `${sizeMm}mm`,
    height: `${sizeMm}mm`,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
    ...style,
  }

  if (personal?.photo) {
    return (
      <div style={baseStyle}>
        <img
          src={personal.photo}
          alt={personal?.name || 'avatar'}
          crossOrigin="anonymous"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>
    )
  }

  return (
    <div
      style={{
        ...baseStyle,
        background: bg,
        color: accent,
        fontSize: fontSize || `${Math.round(sizeMm * 0.5)}pt`,
        fontWeight: 700,
      }}
    >
      {initials || '·'}
    </div>
  )
}
