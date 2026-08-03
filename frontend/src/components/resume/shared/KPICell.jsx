/**
 * KPICell — single stat tile for dashboard-style templates.
 *
 * @param {object} props
 * @param {string} props.label  Small uppercase label under the value
 * @param {string|number} props.value The headline number
 * @param {string} props.bg     Background color
 * @param {string} props.fg     Foreground (value) color
 * @param {string} props.lbl    Label color
 */
export default function KPICell({ label, value, bg = '#1e40af', fg = '#ffffff', lbl = '#bfdbfe' }) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '3mm 2mm',
        background: bg,
        color: fg,
        borderRadius: 4,
      }}
    >
      <div style={{ fontSize: '20pt', fontWeight: 700, lineHeight: 1 }}>{value}</div>
      <div
        style={{
          fontSize: '8pt',
          color: lbl,
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          marginTop: '1mm',
        }}
      >
        {label}
      </div>
    </div>
  )
}
