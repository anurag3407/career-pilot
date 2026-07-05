/**
 * Rating — 5-star rating indicator.
 * Renders a row of filled/empty stars based on a numeric or string rating.
 *
 * @param {object} props
 * @param {number|string} props.value Rating value (0-5, or 'Expert'/'Advanced'/etc.)
 * @param {string} props.color  Star color
 * @param {string} props.emptyColor Empty star color
 * @param {number} props.size    Star size in pt
 */
const TEXT_TO_NUM = {
  Expert: 5,
  Advanced: 4,
  Intermediate: 3,
  Beginner: 2,
  Novice: 1,
}

export default function Rating({
  value = 0,
  color = '#f59e0b',
  emptyColor = '#e2e8f0',
  size = 9,
}) {
  let num = value
  if (typeof value === 'string') num = TEXT_TO_NUM[value] || 0
  num = Math.max(0, Math.min(5, Number(num) || 0))

  return (
    <span style={{ display: 'inline-flex', gap: '0.5mm', verticalAlign: 'middle' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} filled={i < num} color={i < num ? color : emptyColor} size={size} />
      ))}
    </span>
  )
}

function Star({ filled, color, size }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ display: 'inline-block' }}
    >
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={filled ? color : 'none'}
        stroke={color}
        strokeWidth="1.5"
      />
    </svg>
  )
}
