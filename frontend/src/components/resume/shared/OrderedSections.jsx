import { Fragment } from 'react'
import { useResume } from '../../../context/ResumeContext'
import Section from './Section'

/**
 * OrderedSections — renders a template's body sections in the user-chosen
 * drag-and-drop order, then appends any user-defined custom sections.
 *
 * This is the reusable pattern for making a template "order-aware". A template
 * builds a `nodes` map of its already-rendered section JSX (keyed by section
 * id) and hands it to <OrderedSections/>. The component reads `sectionOrder`
 * and `customSections` from the resume context and emits the nodes in order.
 *
 * Ordering rules (robust to a partial/empty/absent sectionOrder):
 *   1. `summary` (if provided) renders first as a fixed lead — it is never
 *      part of the reorderable set.
 *   2. Each id in `sectionOrder` renders next, in order. An id may be a known
 *      node key (education/experience/…) or a custom-section id.
 *   3. Any known node not yet emitted is appended in KNOWN_ORDER sequence, so
 *      nothing ever disappears when sectionOrder omits a section.
 *   4. Any custom section not yet emitted is appended (already order-sorted).
 *
 * When no sectionOrder/customSections are supplied the output is identical to
 * rendering the nodes in KNOWN_ORDER — i.e. no behavioral change.
 *
 * @param {object} props
 * @param {Record<string, React.ReactNode>} props.nodes  Map of sectionId → rendered node (falsy = skip)
 * @param {object} [props.sectionProps]   Props forwarded to <Section> for custom sections (accent, variant, spacing…)
 * @param {object} [props.customBodyStyle] Inline style applied to custom-section body text
 * @param {(section, sectionProps, bodyStyle) => React.ReactNode} [props.renderCustomSection] Optional override
 */

// Default render order for the standard body sections (summary handled separately).
export const KNOWN_ORDER = ['education', 'experience', 'projects', 'skills', 'certifications']

// Templates that render via <OrderedSections/> and therefore honor the user's
// drag-and-drop section order + custom sections. Add a template's id here as it
// is migrated to the OrderedSections pattern. Used to set expectations in the
// gallery (templates not listed here use their own fixed layout).
export const ORDER_AWARE_TEMPLATE_IDS = new Set(['IvyLeague'])

export function CustomSectionBlock({ section, sectionProps = {}, bodyStyle = {} }) {
  if (!section) return null
  const { title, kind, items = [], body } = section

  let content = null
  if (kind === 'paragraph') {
    content = body ? <p style={{ margin: 0, ...bodyStyle }}>{body}</p> : null
  } else if (kind === 'quotes') {
    content = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2mm' }}>
        {items.map((q, i) => (
          <blockquote key={i} style={{ margin: 0, fontStyle: 'italic', ...bodyStyle }}>“{q}”</blockquote>
        ))}
      </div>
    )
  } else if (kind === 'books') {
    content = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1mm' }}>
        {items.map((b, i) => (
          <div key={i} style={{ fontStyle: 'italic', ...bodyStyle }}>{b}</div>
        ))}
      </div>
    )
  } else {
    // 'list' (default)
    content = (
      <ul style={{ margin: 0, paddingLeft: '5mm', ...bodyStyle }}>
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    )
  }

  if (!content) return null
  return (
    <Section title={title || 'Section'} {...sectionProps}>
      {content}
    </Section>
  )
}

export default function OrderedSections({
  nodes = {},
  sectionProps = {},
  customBodyStyle = {},
  renderCustomSection,
}) {
  const { sectionOrder = [], customSections = [] } = useResume()

  const emitted = new Set()
  const out = []

  const pushNode = (key) => {
    if (key === 'summary' || emitted.has(key)) return
    const node = nodes[key]
    if (!node) { emitted.add(key); return }
    emitted.add(key)
    out.push(<Fragment key={key}>{node}</Fragment>)
  }

  const customById = new Map(customSections.map((s) => [s.id, s]))
  const pushCustom = (section) => {
    if (!section || emitted.has(section.id)) return
    emitted.add(section.id)
    const block = renderCustomSection
      ? renderCustomSection(section, sectionProps, customBodyStyle)
      : <CustomSectionBlock section={section} sectionProps={sectionProps} bodyStyle={customBodyStyle} />
    if (block) out.push(<Fragment key={section.id}>{block}</Fragment>)
  }

  // 1. Fixed lead: summary
  if (nodes.summary) out.push(<Fragment key="summary">{nodes.summary}</Fragment>)

  // 2. User-chosen order (known nodes + custom ids)
  for (const key of sectionOrder) {
    if (Object.prototype.hasOwnProperty.call(nodes, key)) pushNode(key)
    else if (customById.has(key)) pushCustom(customById.get(key))
  }

  // 3. Any known nodes not yet emitted, in default sequence
  for (const key of KNOWN_ORDER) pushNode(key)

  // 4. Any remaining custom sections (already order-sorted by normalization)
  for (const section of customSections) pushCustom(section)

  return <>{out}</>
}
