/**
 * Section — generic wrapper used by every resume template.
 * Applies layout.spacing-aware vertical rhythm and a bottom margin.
 *
 * @param {object}  props
 * @param {string}  props.title       Section heading text
 * @param {string}  props.accent      Accent color for heading + underline
 * @param {string}  props.muted       Optional muted color for body text
 * @param {string}  props.spacing     'Compact' | 'Comfortable' | 'Spacious'
 * @param {string}  props.variant     'underline' | 'boxed' | 'banded' | 'plain'
 * @param {string}  props.headingSize Heading font-size (CSS string)
 * @param {boolean} props.uppercase   Whether to uppercase the title
 * @param {boolean} props.divider     Show a thin rule under the title
 * @param {number}  props.children    Section body
 */
export default function Section({
  title,
  accent = '#0f172a',
  muted = '#475569',
  spacing = 'Comfortable',
  variant = 'underline',
  headingSize = '11pt',
  uppercase = true,
  divider = true,
  children,
}) {
  const padMap = { Compact: '4mm', Comfortable: '6mm', Spacious: '9mm' }
  const pad = padMap[spacing] || padMap.Comfortable

  const headingStyle = {
    fontSize: headingSize,
    fontWeight: 700,
    color: accent,
    margin: 0,
    marginBottom: '3mm',
    textTransform: uppercase ? 'uppercase' : 'none',
    letterSpacing: uppercase ? '1.5px' : '0',
  }

  if (variant === 'boxed') {
    return (
      <section
        style={{
          marginBottom: pad,
          padding: '3mm 4mm',
          border: `1px solid ${accent}33`,
          borderRadius: 3,
          background: `${accent}08`,
        }}
      >
        <h2 style={headingStyle}>{title}</h2>
        <div style={{ color: muted }}>{children}</div>
      </section>
    )
  }

  if (variant === 'banded') {
    return (
      <section style={{ marginBottom: pad }}>
        <h2
          style={{
            ...headingStyle,
            background: accent,
            color: '#ffffff',
            padding: '1.5mm 4mm',
            display: 'inline-block',
            borderRadius: 2,
            marginBottom: '3mm',
          }}
        >
          {title}
        </h2>
        <div style={{ color: muted, padding: '0 1mm' }}>{children}</div>
      </section>
    )
  }

  if (variant === 'plain') {
    return (
      <section style={{ marginBottom: pad }}>
        <h2 style={{ ...headingStyle, borderBottom: 'none', marginBottom: '2mm' }}>{title}</h2>
        <div style={{ color: muted }}>{children}</div>
      </section>
    )
  }

  // underline (default)
  return (
    <section style={{ marginBottom: pad }}>
      <h2
        style={{
          ...headingStyle,
          paddingBottom: '1mm',
          borderBottom: divider ? `1pt solid ${accent}55` : 'none',
        }}
      >
        {title}
      </h2>
      <div style={{ color: muted, marginTop: '2mm' }}>{children}</div>
    </section>
  )
}
