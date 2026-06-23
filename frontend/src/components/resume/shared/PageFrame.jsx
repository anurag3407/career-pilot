/**
 * PageFrame — A4 page wrapper. Centralizes the resume canvas so every
 * template gets the same print-friendly root: width 210mm, minHeight 297mm,
 * padding, background, font size, line-height, font family.
 *
 * Templates opt in by wrapping their content in `<PageFrame>` and reading
 * `accent`, `fontHeading`, `fontBody`, etc. from props or the layout context.
 *
 * The layout prop comes from ResumeContext.layout and is shaped:
 *   { pageSize, fontSize, fontSizePx, spacing, lineHeight }
 */
export default function PageFrame({
  layout = {},
  fontFamily,
  fontHeading,
  accent = '#0f172a',
  background = '#ffffff',
  color = '#0f172a',
  paddingMm = 14,
  style = {},
  children,
}) {
  const lineHeight = layout.lineHeight || 1.5
  const fontSizePx = layout.fontSizePx || '14px'
  const isLetter = layout.pageSize === 'Letter'
  return (
    <div
      className="resume-export-root"
      style={{
        width: isLetter ? '215.9mm' : '210mm',
        minHeight: isLetter ? '279.4mm' : '297mm',
        padding: `${paddingMm}mm`,
        background,
        color,
        fontFamily: fontFamily || '"Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize: fontSizePx,
        lineHeight,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
