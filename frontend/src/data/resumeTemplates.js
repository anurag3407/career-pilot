/**
 * Resume templates registry.
 *
 * Each entry's `id` MUST match the folder name under
 * `frontend/src/components/resume/templates/<id>/index.jsx` so the
 * ResumeTemplates page can lazy-import by id.
 *
 * Color tokens: every template reads at most 5 colors (primary, accent,
 * ink, muted, bg). The legacy `accent`/`accentSoft` fields are kept for
 * backward-compatibility with the existing gallery thumbnails.
 *
 * New fields:
 *   - category: 'Traditional' | 'Modern' | 'Executive' | 'Tech' |
 *               'PM' | 'Creative' | 'Photo' | 'Two-Column' |
 *               'Trendy' | 'Industry'
 *   - industry: Tech, Finance, Healthcare, Design, Sales, Education,
 *               Legal, Hospitality, Aviation, Military, General, …
 *   - themePack: 'corporate' | 'bold' | 'elegant' | 'creative' | 'mono'
 *                (used to derive variant entries)
 *   - isPhoto:   true if the template supports a profile photo
 */
const COLOR_SWATCHES = [
  { id: 'teal',     label: 'Teal',     value: '#0f766e', soft: '#ccfbf1' },
  { id: 'slate',    label: 'Slate',    value: '#1f2937', soft: '#f3f4f6' },
  { id: 'blue',     label: 'Blue',     value: '#2563eb', soft: '#dbeafe' },
  { id: 'violet',   label: 'Violet',   value: '#7c3aed', soft: '#ede9fe' },
  { id: 'red',      label: 'Red',      value: '#b91c1c', soft: '#fee2e2' },
  { id: 'amber',    label: 'Amber',    value: '#b45309', soft: '#fef3c7' },
  { id: 'emerald',  label: 'Emerald',  value: '#047857', soft: '#d1fae5' },
  { id: 'indigo',   label: 'Indigo',   value: '#4338ca', soft: '#e0e7ff' },
  { id: 'rose',     label: 'Rose',     value: '#be185d', soft: '#fce7f3' },
  { id: 'graphite', label: 'Graphite', value: '#374151', soft: '#f3f4f6' },
]

const FONT_PAIRINGS = [
  { id: 'sans',     label: 'Sans (Helvetica)',  value: '"Helvetica Neue", Helvetica, Arial, sans-serif' },
  { id: 'inter',    label: 'Inter',             value: 'Inter, system-ui, sans-serif' },
  { id: 'serif',    label: 'Serif (Georgia)',   value: 'Georgia, "Times New Roman", serif' },
  { id: 'palatino', label: 'Palatino',          value: '"Iowan Old Style", "Palatino Linotype", Palatino, serif' },
  { id: 'mono',     label: 'Mono (SF Mono)',    value: '"SF Mono", Menlo, Consolas, monospace' },
]

const CATEGORIES = [
  { id: 'all',         label: 'All' },
  { id: 'Traditional', label: 'Traditional' },
  { id: 'Modern',      label: 'Modern' },
  { id: 'Executive',   label: 'Executive' },
  { id: 'Tech',        label: 'Tech' },
  { id: 'PM',          label: 'PM / Product' },
  { id: 'Creative',    label: 'Creative' },
  { id: 'Photo',       label: 'Photo' },
  { id: 'Two-Column',  label: 'Two-Column' },
  { id: 'Trendy',      label: 'Trendy' },
  { id: 'Industry',    label: 'Industry' },
]

const INDUSTRIES = [
  { id: 'all',         label: 'All industries' },
  { id: 'general',     label: 'General' },
  { id: 'tech',        label: 'Tech' },
  { id: 'finance',     label: 'Finance' },
  { id: 'healthcare',  label: 'Healthcare' },
  { id: 'design',      label: 'Design' },
  { id: 'sales',       label: 'Sales' },
  { id: 'education',   label: 'Education' },
  { id: 'legal',       label: 'Legal' },
  { id: 'hospitality', label: 'Hospitality' },
  { id: 'transport',   label: 'Transport' },
  { id: 'aviation',    label: 'Aviation' },
  { id: 'military',    label: 'Military' },
  { id: 'government',  label: 'Government' },
]

const LAYOUTS = [
  { id: 'all',           label: 'All layouts' },
  { id: 'Single Column', label: 'Single column' },
  { id: 'Two Column',    label: 'Two column' },
  { id: 'Multi Column',  label: 'Multi column' },
]

const ACCENT_PRESETS = {
  // legacy
  ModernSidebar:      { defaultColor: 'teal',     defaultFont: 'inter', supportsTwoColumn: true,  themePack: 'corporate' },
  ClassicSerif:       { defaultColor: 'slate',    defaultFont: 'serif',  supportsTwoColumn: false, themePack: 'elegant'   },
  MinimalSans:        { defaultColor: 'blue',     defaultFont: 'sans',   supportsTwoColumn: false, themePack: 'corporate' },
  CompactTwoCol:      { defaultColor: 'violet',   defaultFont: 'inter',  supportsTwoColumn: true,  themePack: 'bold'      },
  ExecutiveBand:      { defaultColor: 'red',      defaultFont: 'palatino', supportsTwoColumn: false, themePack: 'elegant' },
  TechMono:           { defaultColor: 'emerald',  defaultFont: 'mono',   supportsTwoColumn: false, themePack: 'mono'      },
  PMClassic:          { defaultColor: 'indigo',   defaultFont: 'sans',   supportsTwoColumn: false, themePack: 'corporate' },
  DesignerPortfolio:  { defaultColor: 'rose',     defaultFont: 'inter',  supportsTwoColumn: true,  themePack: 'creative'  },

  // traditional / ats
  IvyLeague:          { defaultColor: 'slate',    defaultFont: 'serif',  themePack: 'elegant' },
  FederalFederal:     { defaultColor: 'graphite', defaultFont: 'sans',   themePack: 'mono' },
  GovernmentTraditional: { defaultColor: 'indigo', defaultFont: 'serif', themePack: 'elegant' },
  AttorneyBrief:      { defaultColor: 'slate',    defaultFont: 'serif',  themePack: 'elegant' },
  AcademicCV:         { defaultColor: 'indigo',   defaultFont: 'serif',  themePack: 'elegant' },
  CleanSingle:        { defaultColor: 'graphite', defaultFont: 'sans',   themePack: 'mono' },

  // modern / minimal
  Whitespace:         { defaultColor: 'slate',    defaultFont: 'serif',  themePack: 'elegant' },
  SingleQuiet:        { defaultColor: 'graphite', defaultFont: 'sans',   themePack: 'mono' },
  PolishedModern:     { defaultColor: 'blue',     defaultFont: 'inter',  themePack: 'corporate' },
  StreamPro:          { defaultColor: 'teal',     defaultFont: 'inter',  themePack: 'corporate' },

  // executive
  DirectorSuite:      { defaultColor: 'graphite', defaultFont: 'serif',  themePack: 'elegant' },
  SeniorLeader:       { defaultColor: 'slate',    defaultFont: 'palatino', themePack: 'elegant' },
  Boardroom:          { defaultColor: 'amber',    defaultFont: 'serif',  themePack: 'elegant' },
  CSuite:             { defaultColor: 'indigo',   defaultFont: 'sans',   themePack: 'bold' },

  // tech
  GitCommit:          { defaultColor: 'emerald',  defaultFont: 'mono',   themePack: 'mono' },
  IDETheme:           { defaultColor: 'indigo',   defaultFont: 'mono',   themePack: 'mono' },
  StackOverflow:      { defaultColor: 'amber',    defaultFont: 'sans',   themePack: 'bold' },
  DevCard:            { defaultColor: 'emerald',  defaultFont: 'inter',  themePack: 'mono' },
  OpenSource:         { defaultColor: 'emerald',  defaultFont: 'mono',   themePack: 'mono' },
  TerminalCLI:        { defaultColor: 'emerald',  defaultFont: 'mono',   themePack: 'mono' },

  // pm / product
  KPIBoard:           { defaultColor: 'blue',     defaultFont: 'inter',  themePack: 'bold' },
  RoadmapTimeline:    { defaultColor: 'indigo',   defaultFont: 'inter',  themePack: 'corporate' },
  ConsultingCase:     { defaultColor: 'slate',    defaultFont: 'serif',  themePack: 'elegant' },
  StrategyMckinsey:   { defaultColor: 'indigo',   defaultFont: 'sans',   themePack: 'corporate' },

  // creative
  MagazineEditorial:  { defaultColor: 'rose',     defaultFont: 'serif',  themePack: 'creative' },
  DribbbleShot:       { defaultColor: 'rose',     defaultFont: 'inter',  themePack: 'creative' },
  BehanceGrid:        { defaultColor: 'violet',   defaultFont: 'inter',  themePack: 'creative' },
  BoldDisplay:        { defaultColor: 'red',      defaultFont: 'inter',  themePack: 'bold' },
  AgencyPitch:        { defaultColor: 'graphite', defaultFont: 'inter',  themePack: 'bold' },

  // photo
  PhotoElegant:       { defaultColor: 'teal',     defaultFont: 'inter',  themePack: 'elegant' },
  PhotoBanner:        { defaultColor: 'indigo',   defaultFont: 'sans',   themePack: 'bold' },
  PhotoSplit:         { defaultColor: 'violet',   defaultFont: 'inter',  themePack: 'creative' },
  PhotoCorner:        { defaultColor: 'blue',     defaultFont: 'sans',   themePack: 'corporate' },

  // two-column / compact
  DenseProfessional:  { defaultColor: 'slate',    defaultFont: 'inter',  themePack: 'corporate' },
  BerlinTwoCol:       { defaultColor: 'amber',    defaultFont: 'inter',  themePack: 'bold' },
  TokyoCompact:       { defaultColor: 'rose',     defaultFont: 'sans',   themePack: 'creative' },
  StockholmScandi:    { defaultColor: 'slate',    defaultFont: 'serif',  themePack: 'elegant' },

  // trendy
  Glassmorphism:      { defaultColor: 'indigo',   defaultFont: 'inter',  themePack: 'creative' },
  NeumorphismSoft:    { defaultColor: 'violet',   defaultFont: 'inter',  themePack: 'creative' },
  BrutalistBold:      { defaultColor: 'graphite', defaultFont: 'inter',  themePack: 'bold' },
  GradientFlow:       { defaultColor: 'violet',   defaultFont: 'inter',  themePack: 'creative' },

  // industry
  NurseClinical:      { defaultColor: 'teal',     defaultFont: 'sans',   themePack: 'corporate' },
  TeacherEducation:   { defaultColor: 'amber',    defaultFont: 'serif',  themePack: 'elegant' },
  FinanceBanking:     { defaultColor: 'slate',    defaultFont: 'serif',  themePack: 'elegant' },
  SalesCloser:        { defaultColor: 'red',      defaultFont: 'sans',   themePack: 'bold' },
  LegalCounsel:       { defaultColor: 'indigo',   defaultFont: 'serif',  themePack: 'elegant' },
  HealthcareProvider: { defaultColor: 'teal',     defaultFont: 'sans',   themePack: 'corporate' },
  RealEstateAgent:    { defaultColor: 'emerald',  defaultFont: 'inter',  themePack: 'bold' },
  Hospitality:        { defaultColor: 'rose',     defaultFont: 'inter',  themePack: 'creative' },
  TruckDriver:        { defaultColor: 'amber',    defaultFont: 'sans',   themePack: 'bold' },
  PilotAviation:      { defaultColor: 'blue',     defaultFont: 'sans',   themePack: 'bold' },
  MilitaryVeteran:    { defaultColor: 'emerald',  defaultFont: 'sans',   themePack: 'bold' },
}

/**
 * THEME_PACKS — declarative palette + font combinations for variant
 * generation. Each pack declares a set of accent swatches and font
 * pairings. The variants array (built below) cross-multiplies the most
 * attractive combinations, giving 150+ gallery entries.
 */
const THEME_PACKS = {
  corporate: {
    label: 'Corporate',
    accents: ['teal', 'blue', 'indigo', 'graphite', 'slate', 'emerald'],
    fonts:   ['sans', 'inter', 'serif', 'palatino'],
  },
  bold: {
    label: 'Bold',
    accents: ['red', 'amber', 'emerald', 'indigo', 'graphite', 'blue'],
    fonts:   ['sans', 'inter', 'palatino', 'mono'],
  },
  elegant: {
    label: 'Elegant',
    accents: ['slate', 'graphite', 'blue', 'indigo', 'rose', 'amber'],
    fonts:   ['serif', 'palatino', 'inter', 'sans'],
  },
  creative: {
    label: 'Creative',
    accents: ['rose', 'violet', 'indigo', 'red', 'amber', 'emerald'],
    fonts:   ['inter', 'sans', 'palatino', 'serif'],
  },
  mono: {
    label: 'Monochrome',
    accents: ['slate', 'graphite', 'blue', 'indigo', 'emerald', 'amber'],
    fonts:   ['mono', 'sans', 'inter'],
  },
}

/* eslint-disable */
const _base = [
  // ─── A. Traditional / ATS ────────────────────────────────────────────────
  { id: 'IvyLeague',            name: 'Ivy League',            category: 'Traditional', industry: 'general',    layout: 'Single Column', bestFor: 'Education-first, ATS-safe',     description: 'Harvard-style single-column, serif, publication-friendly.', accent: '#1f2937', accentSoft: '#f3f4f6', fontFamily: 'Georgia, serif', isPhoto: false },
  { id: 'FederalFederal',       name: 'Federal',               category: 'Traditional', industry: 'government', layout: 'Single Column', bestFor: 'US federal applications',        description: 'Long-form federal-style resume with dense metadata and competencies.', accent: '#374151', accentSoft: '#f3f4f6', fontFamily: '"Helvetica Neue", sans-serif', isPhoto: false },
  { id: 'GovernmentTraditional',name: 'Government',            category: 'Traditional', industry: 'government', layout: 'Single Column', bestFor: 'Civil service, public sector',   description: 'Civic-style header, conservative serif, structured sections.', accent: '#4338ca', accentSoft: '#e0e7ff', fontFamily: 'Georgia, serif', isPhoto: false },
  { id: 'AttorneyBrief',        name: 'Attorney Brief',        category: 'Traditional', industry: 'legal',      layout: 'Single Column', bestFor: 'Lawyers, paralegals',            description: 'Legal CV with Bar Admissions and Practice Areas.', accent: '#1f2937', accentSoft: '#f3f4f6', fontFamily: 'Georgia, serif', isPhoto: false },
  { id: 'AcademicCV',           name: 'Academic CV',           category: 'Traditional', industry: 'education',  layout: 'Single Column', bestFor: 'Researchers, PhDs',              description: 'Long-form academic CV with publications, grants, presentations.', accent: '#4338ca', accentSoft: '#e0e7ff', fontFamily: 'Georgia, serif', isPhoto: false },
  { id: 'CleanSingle',          name: 'Clean Single',          category: 'Traditional', industry: 'general',    layout: 'Single Column', bestFor: 'Maximum ATS compatibility',      description: 'Most ATS-safe single-column possible — semantic headings only.', accent: '#374151', accentSoft: '#f3f4f6', fontFamily: '"Helvetica Neue", sans-serif', isPhoto: false },

  // ─── B. Modern / Minimal ─────────────────────────────────────────────────
  { id: 'Whitespace',           name: 'Whitespace',            category: 'Modern',      industry: 'general',    layout: 'Single Column', bestFor: 'Design-forward companies',       description: 'Extra-wide margins and oversized name. Quiet luxury.', accent: '#1f2937', accentSoft: '#f3f4f6', fontFamily: 'Georgia, serif', isPhoto: false },
  { id: 'SingleQuiet',          name: 'Single Quiet',          category: 'Modern',      industry: 'general',    layout: 'Single Column', bestFor: 'Startups, calm aesthetic',        description: 'Helvetica 9pt with hairline rules. Calm and editorial.', accent: '#374151', accentSoft: '#f3f4f6', fontFamily: '"Helvetica Neue", sans-serif', isPhoto: false },
  { id: 'PolishedModern',       name: 'Polished Modern',       category: 'Modern',      industry: 'general',    layout: 'Single Column', bestFor: 'Senior ICs, managers',            description: 'Top bar with role and 3 quick stat tiles.', accent: '#2563eb', accentSoft: '#dbeafe', fontFamily: 'Inter, sans-serif', isPhoto: false },
  { id: 'StreamPro',            name: 'Stream Pro',            category: 'Modern',      industry: 'tech',       layout: 'Two Column',    bestFor: 'Mid-senior tech pros',            description: 'Two-column with section icons and metric chips.', accent: '#0f766e', accentSoft: '#ccfbf1', fontFamily: 'Inter, sans-serif', isPhoto: false },

  // ─── C. Executive / Senior ───────────────────────────────────────────────
  { id: 'DirectorSuite',        name: 'Director Suite',        category: 'Executive',   industry: 'general',    layout: 'Single Column', bestFor: 'Directors, VPs',                  description: 'Black accent, monogram crest, hairline rules.', accent: '#1c1917', accentSoft: '#f5f5f4', fontFamily: 'Georgia, serif', isPhoto: false },
  { id: 'SeniorLeader',         name: 'Senior Leader',         category: 'Executive',   industry: 'general',    layout: 'Single Column', bestFor: 'C-suite, founders',               description: 'Large initials/portrait plus dense experience.', accent: '#1f2937', accentSoft: '#f3f4f6', fontFamily: 'Palatino, serif', isPhoto: true  },
  { id: 'Boardroom',            name: 'Boardroom',             category: 'Executive',   industry: 'finance',    layout: 'Single Column', bestFor: 'Board directors, advisors',       description: 'Center-aligned summary, board-style header.', accent: '#b45309', accentSoft: '#fef3c7', fontFamily: 'Georgia, serif', isPhoto: false },
  { id: 'CSuite',               name: 'C-Suite',               category: 'Executive',   industry: 'general',    layout: 'Single Column', bestFor: 'C-suite with profile photo',      description: 'Full-bleed photo band plus KPI strip.', accent: '#4338ca', accentSoft: '#e0e7ff', fontFamily: '"Helvetica Neue", sans-serif', isPhoto: true },

  // ─── D. Tech / Engineering ───────────────────────────────────────────────
  { id: 'GitCommit',            name: 'Git Commit',            category: 'Tech',        industry: 'tech',       layout: 'Single Column', bestFor: 'Backend / infra engineers',       description: 'Commit-log timeline on the left for experience.', accent: '#047857', accentSoft: '#d1fae5', fontFamily: '"SF Mono", monospace', isPhoto: false },
  { id: 'IDETheme',             name: 'IDE Theme',             category: 'Tech',        industry: 'tech',       layout: 'Single Column', bestFor: 'Senior engineers',                description: 'Code-editor chrome (tabs, line numbers) frames content.', accent: '#4338ca', accentSoft: '#e0e7ff', fontFamily: '"SF Mono", monospace', isPhoto: false },
  { id: 'StackOverflow',        name: 'Stack Overflow',        category: 'Tech',        industry: 'tech',       layout: 'Two Column',    bestFor: 'Reputation-driven engineers',     description: 'Score chips and tag-cloud skills.', accent: '#b45309', accentSoft: '#fef3c7', fontFamily: '"Helvetica Neue", sans-serif', isPhoto: false },
  { id: 'DevCard',              name: 'Dev Card',              category: 'Tech',        industry: 'tech',       layout: 'Two Column',    bestFor: 'Frontend, fullstack',             description: 'GitHub-style profile card on top, project repos below.', accent: '#047857', accentSoft: '#d1fae5', fontFamily: 'Inter, sans-serif', isPhoto: false },
  { id: 'OpenSource',           name: 'Open Source',           category: 'Tech',        industry: 'tech',       layout: 'Single Column', bestFor: 'OSS maintainers',                 description: 'Contribution-graph SVG in header.', accent: '#047857', accentSoft: '#d1fae5', fontFamily: '"SF Mono", monospace', isPhoto: false },
  { id: 'TerminalCLI',          name: 'Terminal CLI',          category: 'Tech',        industry: 'tech',       layout: 'Single Column', bestFor: 'Linux / DevOps / SRE',            description: 'Full terminal-window frame, light variant of TechMono.', accent: '#047857', accentSoft: '#d1fae5', fontFamily: '"SF Mono", monospace', isPhoto: false },

  // ─── E. PM / Product / Consulting ────────────────────────────────────────
  { id: 'KPIBoard',             name: 'KPI Board',             category: 'PM',          industry: 'general',    layout: 'Single Column', bestFor: 'PMs, growth, marketing leads',    description: 'Dashboard of 6 metric tiles at the top.', accent: '#2563eb', accentSoft: '#dbeafe', fontFamily: 'Inter, sans-serif', isPhoto: false },
  { id: 'RoadmapTimeline',      name: 'Roadmap Timeline',      category: 'PM',          industry: 'tech',       layout: 'Single Column', bestFor: 'Product managers',                description: 'Horizontal product roadmap across the header.', accent: '#4338ca', accentSoft: '#e0e7ff', fontFamily: 'Inter, sans-serif', isPhoto: false },
  { id: 'ConsultingCase',       name: 'Consulting Case',       category: 'PM',          industry: 'general',    layout: 'Single Column', bestFor: 'Consultants, strategists',        description: 'Case Studies sections instead of Experience.', accent: '#1f2937', accentSoft: '#f3f4f6', fontFamily: 'Georgia, serif', isPhoto: false },
  { id: 'StrategyMckinsey',     name: 'Strategy',              category: 'PM',          industry: 'finance',    layout: 'Single Column', bestFor: 'Strategy & ops leaders',           description: 'Leadership-and-impact style for top firms.', accent: '#4338ca', accentSoft: '#e0e7ff', fontFamily: '"Helvetica Neue", sans-serif', isPhoto: false },

  // ─── F. Creative / Designer ──────────────────────────────────────────────
  { id: 'MagazineEditorial',    name: 'Magazine Editorial',    category: 'Creative',    industry: 'design',     layout: 'Single Column', bestFor: 'Senior designers, art directors', description: 'Serif hero with pull-quote summary block.', accent: '#be185d', accentSoft: '#fce7f3', fontFamily: 'Georgia, serif', isPhoto: false },
  { id: 'DribbbleShot',         name: 'Dribbble Shot',         category: 'Creative',    industry: 'design',     layout: 'Two Column',    bestFor: 'Product designers',               description: 'Left large color block + right bio.', accent: '#be185d', accentSoft: '#fce7f3', fontFamily: 'Inter, sans-serif', isPhoto: true },
  { id: 'BehanceGrid',          name: 'Behance Grid',          category: 'Creative',    industry: 'design',     layout: 'Two Column',    bestFor: 'Visual designers, illustrators',  description: 'Project thumbnails in a 2x2 grid.', accent: '#7c3aed', accentSoft: '#ede9fe', fontFamily: 'Inter, sans-serif', isPhoto: false },
  { id: 'BoldDisplay',          name: 'Bold Display',          category: 'Creative',    industry: 'design',     layout: 'Single Column', bestFor: 'Designers, agencies',              description: 'Oversized role title rotated 90° as a sidebar accent.', accent: '#b91c1c', accentSoft: '#fee2e2', fontFamily: 'Inter, sans-serif', isPhoto: false },
  { id: 'AgencyPitch',          name: 'Agency Pitch',          category: 'Creative',    industry: 'design',     layout: 'Single Column', bestFor: 'Agency creatives, founders',      description: 'Agency-deck aesthetic with big section numbers.', accent: '#1c1917', accentSoft: '#f5f5f4', fontFamily: 'Inter, sans-serif', isPhoto: false },

  // ─── G. Photo / Personal Brand ───────────────────────────────────────────
  { id: 'PhotoElegant',         name: 'Photo Elegant',         category: 'Photo',       industry: 'general',    layout: 'Single Column', bestFor: 'Personal-brand pros',             description: 'Circular photo top-left, single-column.', accent: '#0f766e', accentSoft: '#ccfbf1', fontFamily: 'Inter, sans-serif', isPhoto: true },
  { id: 'PhotoBanner',          name: 'Photo Banner',          category: 'Photo',       industry: 'general',    layout: 'Single Column', bestFor: 'Speakers, coaches',               description: 'Full-width photo banner with gradient overlay.', accent: '#4338ca', accentSoft: '#e0e7ff', fontFamily: '"Helvetica Neue", sans-serif', isPhoto: true },
  { id: 'PhotoSplit',           name: 'Photo Split',           category: 'Photo',       industry: 'design',     layout: 'Two Column',    bestFor: 'Designers, creatives',            description: '50/50 split: photo left, content right.', accent: '#7c3aed', accentSoft: '#ede9fe', fontFamily: 'Inter, sans-serif', isPhoto: true },
  { id: 'PhotoCorner',          name: 'Photo Corner',          category: 'Photo',       industry: 'general',    layout: 'Single Column', bestFor: 'Subtle, refined',                 description: 'Small photo in top-right corner, otherwise minimal.', accent: '#2563eb', accentSoft: '#dbeafe', fontFamily: '"Helvetica Neue", sans-serif', isPhoto: true },

  // ─── H. Two-Column / Compact ─────────────────────────────────────────────
  { id: 'DenseProfessional',    name: 'Dense Professional',    category: 'Two-Column',  industry: 'general',    layout: 'Two Column',    bestFor: 'Experienced professionals',       description: '9pt sans, info-packed two-column.', accent: '#1f2937', accentSoft: '#f3f4f6', fontFamily: 'Inter, sans-serif', isPhoto: false },
  { id: 'BerlinTwoCol',         name: 'Berlin Two-Column',     category: 'Two-Column',  industry: 'tech',       layout: 'Two Column',    bestFor: 'Berlin-style minimalist',         description: 'Heavy left sidebar with skills heatmap.', accent: '#b45309', accentSoft: '#fef3c7', fontFamily: 'Inter, sans-serif', isPhoto: false },
  { id: 'TokyoCompact',         name: 'Tokyo Compact',         category: 'Two-Column',  industry: 'design',     layout: 'Two Column',    bestFor: 'JP-inspired accents',             description: 'Compact layout with vertical text accents.', accent: '#be185d', accentSoft: '#fce7f3', fontFamily: '"Helvetica Neue", sans-serif', isPhoto: false },
  { id: 'StockholmScandi',      name: 'Stockholm Scandi',      category: 'Two-Column',  industry: 'design',     layout: 'Two Column',    bestFor: 'Nordic, calm aesthetic',          description: 'Scandinavian spacing and monochrome palette.', accent: '#1f2937', accentSoft: '#f3f4f6', fontFamily: 'Georgia, serif', isPhoto: false },

  // ─── I. Modern Visual / Trendy ───────────────────────────────────────────
  { id: 'Glassmorphism',         name: 'Glassmorphism',         category: 'Trendy',      industry: 'tech',       layout: 'Two Column',    bestFor: 'Web designers, frontend',        description: 'Frosted-glass card surfaces over a gradient background.', accent: '#4338ca', accentSoft: '#e0e7ff', fontFamily: 'Inter, sans-serif', isPhoto: false },
  { id: 'NeumorphismSoft',      name: 'Neumorphism Soft',      category: 'Trendy',      industry: 'design',     layout: 'Single Column', bestFor: 'UI designers',                    description: 'Soft-shadow cards over a calm surface.', accent: '#7c3aed', accentSoft: '#ede9fe', fontFamily: 'Inter, sans-serif', isPhoto: false },
  { id: 'BrutalistBold',        name: 'Brutalist Bold',        category: 'Trendy',      industry: 'design',     layout: 'Single Column', bestFor: 'Bold creatives',                  description: 'Black & white, thick rules, oversized type.', accent: '#1c1917', accentSoft: '#f5f5f4', fontFamily: 'Inter, sans-serif', isPhoto: false },
  { id: 'GradientFlow',         name: 'Gradient Flow',         category: 'Trendy',      industry: 'tech',       layout: 'Single Column', bestFor: 'Modern tech, design',             description: 'Animated-feel gradient hero (static for print).', accent: '#7c3aed', accentSoft: '#ede9fe', fontFamily: 'Inter, sans-serif', isPhoto: false },

  // ─── J. Niche / Industry-Specific ────────────────────────────────────────
  { id: 'NurseClinical',        name: 'Nurse Clinical',        category: 'Industry',    industry: 'healthcare', layout: 'Single Column', bestFor: 'RNs, NPs, nursing students',      description: 'Clinical-skills matrix and certifications-heavy.', accent: '#0f766e', accentSoft: '#ccfbf1', fontFamily: '"Helvetica Neue", sans-serif', isPhoto: false },
  { id: 'TeacherEducation',     name: 'Teacher Education',     category: 'Industry',    industry: 'education',  layout: 'Single Column', bestFor: 'K-12 and university teachers',    description: 'Certifications plus grade levels taught.', accent: '#b45309', accentSoft: '#fef3c7', fontFamily: 'Georgia, serif', isPhoto: false },
  { id: 'FinanceBanking',       name: 'Finance Banking',       category: 'Industry',    industry: 'finance',    layout: 'Single Column', bestFor: 'IB, banking, PE',                 description: 'Credentials-heavy header (CFA, Series 7).', accent: '#1f2937', accentSoft: '#f3f4f6', fontFamily: 'Georgia, serif', isPhoto: false },
  { id: 'SalesCloser',          name: 'Sales Closer',          category: 'Industry',    industry: 'sales',      layout: 'Single Column', bestFor: 'AE, BDR, sales leaders',          description: 'Quota and percentage callouts.', accent: '#b91c1c', accentSoft: '#fee2e2', fontFamily: '"Helvetica Neue", sans-serif', isPhoto: false },
  { id: 'LegalCounsel',         name: 'Legal Counsel',         category: 'Industry',    industry: 'legal',      layout: 'Single Column', bestFor: 'In-house counsel, attorneys',     description: 'Bar admissions and matters handled.', accent: '#4338ca', accentSoft: '#e0e7ff', fontFamily: 'Georgia, serif', isPhoto: false },
  { id: 'HealthcareProvider',   name: 'Healthcare Provider',   category: 'Industry',    industry: 'healthcare', layout: 'Single Column', bestFor: 'MDs, PAs, NPs',                   description: 'DEA, NPI and board certifications up top.', accent: '#0f766e', accentSoft: '#ccfbf1', fontFamily: '"Helvetica Neue", sans-serif', isPhoto: false },
  { id: 'RealEstateAgent',      name: 'Real Estate Agent',     category: 'Industry',    industry: 'sales',      layout: 'Single Column', bestFor: 'Realtors, brokers',               description: 'Transactions closed tile dashboard.', accent: '#047857', accentSoft: '#d1fae5', fontFamily: 'Inter, sans-serif', isPhoto: true },
  { id: 'Hospitality',          name: 'Hospitality',           category: 'Industry',    industry: 'hospitality',layout: 'Single Column', bestFor: 'Hotels, F&B, chefs',              description: 'Languages and service-period emphasis.', accent: '#be185d', accentSoft: '#fce7f3', fontFamily: 'Inter, sans-serif', isPhoto: false },
  { id: 'TruckDriver',          name: 'Truck Driver',          category: 'Industry',    industry: 'transport',  layout: 'Single Column', bestFor: 'CDL A/B drivers',                 description: 'CDL endorsements and miles driven.', accent: '#b45309', accentSoft: '#fef3c7', fontFamily: '"Helvetica Neue", sans-serif', isPhoto: false },
  { id: 'PilotAviation',        name: 'Pilot Aviation',        category: 'Industry',    industry: 'aviation',   layout: 'Single Column', bestFor: 'Commercial pilots, ATC',          description: 'Type ratings and flight hours.', accent: '#2563eb', accentSoft: '#dbeafe', fontFamily: '"Helvetica Neue", sans-serif', isPhoto: true },
  { id: 'MilitaryVeteran',      name: 'Military Veteran',      category: 'Industry',    industry: 'military',   layout: 'Single Column', bestFor: 'Transitioning veterans',          description: 'MOS, rank and route structure.', accent: '#047857', accentSoft: '#d1fae5', fontFamily: '"Helvetica Neue", sans-serif', isPhoto: false },
]

// legacy entries kept for backward compatibility (id matches folder name)
const _legacy = [
  { id: 'ModernSidebar',       name: 'Modern Sidebar',       category: 'Modern',      industry: 'general', layout: 'Two Column',    bestFor: 'Tech, general',                description: 'Two-column with a colored sidebar for contact and skills.', accent: '#0f766e', accentSoft: '#ccfbf1', fontFamily: 'Inter, sans-serif', isPhoto: false },
  { id: 'ClassicSerif',        name: 'Classic Serif',        category: 'Traditional', industry: 'general', layout: 'Single Column', bestFor: 'Corporate, ATS',               description: 'Single-column, traditional serif typography. ATS-safe and timeless.', accent: '#1f2937', accentSoft: '#f3f4f6', fontFamily: 'Georgia, serif', isPhoto: false },
  { id: 'MinimalSans',         name: 'Minimal Sans',         category: 'Modern',      industry: 'general', layout: 'Single Column', bestFor: 'Startups, modern',             description: 'Clean, generous whitespace with thin dividers.', accent: '#2563eb', accentSoft: '#dbeafe', fontFamily: '"Helvetica Neue", sans-serif', isPhoto: false },
  { id: 'CompactTwoCol',       name: 'Compact Two-Column',   category: 'Two-Column',  industry: 'general', layout: 'Two Column',    bestFor: 'Experienced devs',             description: 'Dense two-column layout with icon-prefixed contact info.', accent: '#7c3aed', accentSoft: '#ede9fe', fontFamily: 'Inter, sans-serif', isPhoto: false },
  { id: 'ExecutiveBand',       name: 'Executive Band',       category: 'Executive',   industry: 'general', layout: 'Single Column', bestFor: 'Senior, executive',            description: 'Full-width colored header band with elegant section headings.', accent: '#b91c1c', accentSoft: '#fee2e2', fontFamily: 'Palatino, serif', isPhoto: false },
  { id: 'TechMono',            name: 'Tech Mono',            category: 'Tech',        industry: 'tech',    layout: 'Single Column', bestFor: 'Software engineers',           description: 'Engineer-friendly layout with a monospace header and tech-stack chips.', accent: '#047857', accentSoft: '#d1fae5', fontFamily: 'Inter, sans-serif', isPhoto: false },
  { id: 'PMClassic',           name: 'PM Classic',           category: 'PM',          industry: 'general', layout: 'Single Column', bestFor: 'Project / product managers',   description: 'PM-focused: KPI bar up top, crisp experience, certifications row.', accent: '#4338ca', accentSoft: '#e0e7ff', fontFamily: '"Helvetica Neue", sans-serif', isPhoto: false },
  { id: 'DesignerPortfolio',   name: 'Designer Portfolio',   category: 'Creative',    industry: 'design',  layout: 'Two Column',    bestFor: 'Designers, creative',          description: 'Visual-forward layout with a large accent band and project callouts.', accent: '#be185d', accentSoft: '#fce7f3', fontFamily: 'Inter, sans-serif', isPhoto: false },
]

const resumeTemplates = [..._base, ..._legacy]

/**
 * Generate the variant catalog — 150+ entries derived from THEME_PACKS.
 * Each variant references a base template id and overrides accent/font.
 */
function buildVariants() {
  const out = []
  // Pick the top 50 base templates (skip the most industry-specific ones)
  const baseForVariants = resumeTemplates.slice(0, 50)
  for (const base of baseForVariants) {
    const pack = THEME_PACKS[ACCENT_PRESETS[base.id]?.themePack || 'corporate']
    if (!pack) continue
    // 2 accents × 2 fonts per pack = 4 variants per base × 50 bases = 200
    for (let ai = 0; ai < Math.min(2, pack.accents.length); ai += 1) {
      for (let fi = 0; fi < Math.min(2, pack.fonts.length); fi += 1) {
        const accentId = pack.accents[ai]
        const fontId = pack.fonts[fi]
        const swatch = COLOR_SWATCHES.find((s) => s.id === accentId) || COLOR_SWATCHES[0]
        const font = FONT_PAIRINGS.find((f) => f.id === fontId) || FONT_PAIRINGS[0]
        const label = swatch.label
        const fontLabel = font.label.split(' ')[0]
        out.push({
          id: `${base.id}__${accentId}__${fontId}`,
          baseId: base.id,
          name: `${base.name} · ${label} · ${fontLabel}`,
          category: base.category,
          industry: base.industry,
          layout: base.layout,
          bestFor: base.bestFor,
          description: `${base.description} (${label} accent, ${fontLabel} type)`,
          accent: swatch.value,
          accentSoft: swatch.soft,
          fontFamily: font.value,
          accentId,
          fontId,
          isPhoto: base.isPhoto,
          isVariant: true,
        })
      }
    }
  }
  return out
}

const RESUME_VARIANTS = buildVariants()

// Full gallery = base templates + variants
const GALLERY = [...resumeTemplates, ...RESUME_VARIANTS]

export {
  COLOR_SWATCHES,
  FONT_PAIRINGS,
  CATEGORIES,
  INDUSTRIES,
  LAYOUTS,
  ACCENT_PRESETS,
  THEME_PACKS,
  RESUME_VARIANTS,
  GALLERY,
  resumeTemplates,
}

export default resumeTemplates
