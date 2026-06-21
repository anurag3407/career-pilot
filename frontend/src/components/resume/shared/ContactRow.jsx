/**
 * ContactRow — labeled contact line (label/value pair).
 * Used in sidebar layouts that show a small label like "Email" above the value.
 *
 * @param {object} props
 * @param {string} props.label  Small uppercase label
 * @param {string} props.value  The actual contact value (email/phone/etc.)
 * @param {string} props.labelColor Label color
 * @param {string} props.valueColor Value color
 * @param {string} props.fontSize Font size for the value
 * @param {boolean} props.short  Strip protocol from URLs
 */
export default function ContactRow({
  label,
  value,
  labelColor = '#94a3b8',
  valueColor = '#0f172a',
  fontSize = '9pt',
  short = false,
}) {
  if (!value) return null
  const display = short ? value.replace(/^https?:\/\//, '').replace(/^www\./, '') : value
  return (
    <div style={{ marginBottom: '2mm', fontSize, lineHeight: 1.35 }}>
      <div
        style={{
          fontSize: '7.5pt',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          color: labelColor,
          opacity: 0.85,
          marginBottom: '0.4mm',
        }}
      >
        {label}
      </div>
      <div style={{ color: valueColor, wordBreak: 'break-word' }}>{display}</div>
    </div>
  )
}
