/**
 * SkillPill — tag chip for skills. Used by templates that style skills as chips.
 *
 * @param {object} props
 * @param {string} props.name      Skill name
 * @param {string} props.accent    Accent color (text)
 * @param {string} props.bg        Background color
 * @param {string} props.border    Border color
 * @param {string} props.fontSize  CSS font-size
 * @param {boolean} props.solid    If true, use solid accent bg + white text
 */
export default function SkillPill({
  name,
  accent = '#0f766e',
  bg = '#ccfbf1',
  border,
  fontSize = '9pt',
  solid = false,
  style = {},
}) {
  if (!name) return null
  return (
    <span
      style={{
        fontSize,
        padding: '0.8mm 2.5mm',
        background: solid ? accent : bg,
        color: solid ? '#ffffff' : accent,
        border: border ? `1px solid ${border}` : `1px solid ${accent}33`,
        borderRadius: 12,
        fontWeight: 500,
        whiteSpace: 'nowrap',
        display: 'inline-block',
        ...style,
      }}
    >
      {name}
    </span>
  )
}
