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
 * Slots (rendered in this fixed order):
 *   1. `header`           — optional decorative header slot (KPIs, photos, band)
 *                           rendered before any body section so templates with
 *                           photo/KPI/cover bands can opt-in to the order-aware
 *                           body without losing their custom header.
 *   2. `summary`          — fixed lead (if provided). Never reorderable.
 *   3. user-chosen body   — each id in `sectionOrder` renders next, in order.
 *                           An id may be a known node key (education/
 *                           experience/…) or a custom-section id.
 *   4. tail nodes         — any known node not yet emitted, in KNOWN_ORDER
 *                           sequence, so nothing ever disappears.
 *   5. custom sections    — any custom section not yet emitted, in order.
 *   6. `footer`           — optional decorative footer slot (selected
 *                           engagements, board roles, languages) rendered
 *                           after the order-aware body for templates that want
 *                           a closing callout strip.
 *
 * When no sectionOrder/customSections are supplied the output is identical to
 * rendering the nodes in KNOWN_ORDER — i.e. no behavioral change.
 *
 * @param {object} props
 * @param {Record<string, React.ReactNode>} props.nodes  Map of sectionId → rendered node (falsy = skip)
 * @param {object} [props.sectionProps]   Props forwarded to <Section> for custom sections (accent, variant, spacing…)
 * @param {object} [props.customBodyStyle] Inline style applied to custom-section body text
 * @param {React.ReactNode} [props.header] Optional fixed header slot (rendered before body)
 * @param {React.ReactNode} [props.footer] Optional fixed footer slot (rendered after body)
 * @param {(section, sectionProps, bodyStyle) => React.ReactNode} [props.renderCustomSection] Optional override
 */

// Default render order for the standard body sections (summary handled separately).
export const KNOWN_ORDER = ['education', 'experience', 'projects', 'skills', 'certifications']

// Templates that render via <OrderedSections/> and therefore honor the user's
// drag-and-drop section order + custom sections. Add a template's id here as it
// is migrated to the OrderedSections pattern. Used to set expectations in the
// gallery (templates not listed here use their own fixed layout).
export const ORDER_AWARE_TEMPLATE_IDS = new Set([
  // Wave 1 — single-column / traditional / executive
  'IvyLeague',
  'ClassicSerif',
  'CleanSingle',
  'Whitespace',
  'SingleQuiet',
  'PolishedModern',
  'CSuite',
  'SeniorLeader',
  'DirectorSuite',
  'Boardroom',
  'MinimalSans',
  'ExecutiveBand',
  'PMClassic',
  'StrategyMckinsey',
  // Wave 2 — niche industry
  'AcademicCV',
  'AttorneyBrief',
  'LegalCounsel',
  'FinanceBanking',
  'NurseClinical',
  'TeacherEducation',
  'MilitaryVeteran',
  // Wave 3 — two-column / sidebar
  'ModernSidebar',
  'CompactTwoCol',
  'DenseProfessional',
  'BerlinTwoCol',
  'TokyoCompact',
  'StockholmScandi',
  // Wave 4 — tech / themed
  'TechMono',
  'GitCommit',
  'IDETheme',
  'DevCard',
  'OpenSource',
  'TerminalCLI',
  // Wave 5 — PM / KPI
  'KPIBoard',
  'RoadmapTimeline',
  'ConsultingCase',
  'StackOverflow',
  'StreamPro',
  // Wave 6 — creative / designer
  'MagazineEditorial',
  'DribbbleShot',
  'BehanceGrid',
  'BoldDisplay',
  'AgencyPitch',
  // Wave 7 — photo
  'PhotoElegant',
  'PhotoBanner',
  'PhotoSplit',
  'PhotoCorner',
  // Wave 8 — trendy
  'Glassmorphism',
  'NeumorphismSoft',
  'BrutalistBold',
  'GradientFlow',
  // Wave 9 — specialty
  'RealEstateAgent',
  'Hospitality',
  'PilotAviation',
  'HealthcareProvider',
  'SalesCloser',
  // Wave 10 — niche
  'FederalFederal',
  'GovernmentTraditional',
  'TruckDriver',
  'DesignerPortfolio',
  'Federal',
  'BoldGrid',
])

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
  header,
  footer,
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

  // 1. Optional fixed header slot (decorative — photo band, KPI strip, cover)
  if (header) out.push(<Fragment key="__header">{header}</Fragment>)

  // 2. Fixed lead: summary
  if (nodes.summary) out.push(<Fragment key="summary">{nodes.summary}</Fragment>)

  // 3. User-chosen order (known nodes + custom ids)
  for (const key of sectionOrder) {
    if (Object.prototype.hasOwnProperty.call(nodes, key)) pushNode(key)
    else if (customById.has(key)) pushCustom(customById.get(key))
  }

  // 4. Any known nodes not yet emitted, in default sequence
  for (const key of KNOWN_ORDER) pushNode(key)

  // 5. Any remaining custom sections (already order-sorted by normalization)
  for (const section of customSections) pushCustom(section)

  // 6. Optional fixed footer slot (callout strip — engagements, board roles…)
  if (footer) out.push(<Fragment key="__footer">{footer}</Fragment>)

  return <>{out}</>
}