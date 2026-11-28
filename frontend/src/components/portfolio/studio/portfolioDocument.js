/**
 * Portfolio Studio document model.
 *
 * One plain-JSON document holds everything the builder edits, saves and
 * deploys:
 *
 *   content  → personal, hero, about, socials, stats, skills, projects,
 *              experience, education, testimonials, contact, custom[]
 *   pf       → Studio settings: chosen template, section order/visibility,
 *              design tokens and site metadata.
 *
 * `pf` is namespaced so the 260 art-directed templates (which only read the
 * content keys) keep working untouched, while the composable Studio layout and
 * the builder chrome read the settings.
 */

export const DOC_VERSION = 1;

let idCounter = 0;
export function uid(prefix = 'id') {
  idCounter += 1;
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now().toString(36)}${idCounter.toString(36)}${random}`;
}

/* ────────────────────────────── Section registry ───────────────────────────── */

export const SECTION_TYPES = [
  { type: 'hero', label: 'Hero', hint: 'Name, role, pitch and call to action', singleton: true },
  { type: 'about', label: 'About', hint: 'Your story in a paragraph or two', singleton: true },
  { type: 'stats', label: 'Highlights', hint: 'Years, projects, clients — proof points', singleton: true },
  { type: 'projects', label: 'Projects', hint: 'Case studies with links and tech', singleton: true },
  { type: 'skills', label: 'Skills', hint: 'Grouped by category with levels', singleton: true },
  { type: 'experience', label: 'Experience', hint: 'Roles, dates and achievements', singleton: true },
  { type: 'education', label: 'Education', hint: 'Degrees and programmes', singleton: true },
  { type: 'testimonials', label: 'Testimonials', hint: 'Quotes from people you worked with', singleton: true },
  { type: 'contact', label: 'Contact', hint: 'Email, location and availability', singleton: true },
  { type: 'socials', label: 'Links', hint: 'GitHub, LinkedIn, X, website', singleton: true },
];

export const SECTION_TYPE_MAP = Object.fromEntries(SECTION_TYPES.map((s) => [s.type, s]));

export const DEFAULT_SECTION_ORDER = [
  'hero',
  'about',
  'stats',
  'projects',
  'skills',
  'experience',
  'education',
  'testimonials',
  'contact',
];

/* ──────────────────────────────── Design system ────────────────────────────── */

export const DESIGN_PRESETS = [
  { id: 'emerald', label: 'Emerald night', mode: 'dark', accent: '#34d399', background: '#0a0f0d', surface: '#111a16', text: '#ecfdf5', muted: '#93a89c' },
  { id: 'indigo', label: 'Indigo ink', mode: 'dark', accent: '#818cf8', background: '#0b0c14', surface: '#141626', text: '#eef0ff', muted: '#9aa2c4' },
  { id: 'amber', label: 'Amber paper', mode: 'light', accent: '#b45309', background: '#fbf7ef', surface: '#f3ecdf', text: '#241c12', muted: '#7c6a54' },
  { id: 'graphite', label: 'Graphite', mode: 'dark', accent: '#e5e7eb', background: '#0b0b0c', surface: '#161617', text: '#fafafa', muted: '#a1a1aa' },
  { id: 'ocean', label: 'Ocean glass', mode: 'light', accent: '#0284c7', background: '#f2f8ff', surface: '#e4f0fb', text: '#0b2540', muted: '#4f6b83' },
  { id: 'rose', label: 'Rose studio', mode: 'dark', accent: '#fb7185', background: '#140b10', surface: '#20131a', text: '#fff1f4', muted: '#c39aa5' },
  { id: 'citrus', label: 'Citrus pop', mode: 'light', accent: '#65a30d', background: '#fdfdf6', surface: '#f1f5e1', text: '#1b2410', muted: '#5f6b4a' },
  { id: 'mono', label: 'Mono editorial', mode: 'light', accent: '#111827', background: '#ffffff', surface: '#f4f4f5', text: '#111827', muted: '#6b7280' },
];

export const FONT_PAIRS = [
  { id: 'inter', label: 'Inter / Inter', display: "'Inter', 'Segoe UI', system-ui, sans-serif", body: "'Inter', 'Segoe UI', system-ui, sans-serif", mono: "'JetBrains Mono', ui-monospace, monospace" },
  { id: 'editorial', label: 'Editorial serif', display: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif", body: "'Inter', system-ui, sans-serif", mono: "'JetBrains Mono', ui-monospace, monospace" },
  { id: 'grotesk', label: 'Grotesk', display: "'Helvetica Neue', 'Archivo', Arial, sans-serif", body: "'Helvetica Neue', Arial, sans-serif", mono: "'IBM Plex Mono', ui-monospace, monospace" },
  { id: 'mono', label: 'Monospace', display: "'JetBrains Mono', 'SFMono-Regular', ui-monospace, monospace", body: "'JetBrains Mono', ui-monospace, monospace", mono: "'JetBrains Mono', ui-monospace, monospace" },
  { id: 'geometric', label: 'Geometric', display: "'Futura', 'Avenir Next', 'Segoe UI', sans-serif", body: "'Avenir Next', 'Segoe UI', sans-serif", mono: "'JetBrains Mono', ui-monospace, monospace" },
];

export const WIDTH_OPTIONS = [
  { id: 'narrow', label: 'Narrow', max: 880 },
  { id: 'regular', label: 'Regular', max: 1080 },
  { id: 'wide', label: 'Wide', max: 1280 },
];

export const DENSITY_OPTIONS = [
  { id: 'compact', label: 'Compact', scale: 0.82 },
  { id: 'comfortable', label: 'Comfortable', scale: 1 },
  { id: 'airy', label: 'Airy', scale: 1.22 },
];

export const DEFAULT_DESIGN = {
  preset: 'emerald',
  mode: 'dark',
  accent: '#34d399',
  background: '#0a0f0d',
  surface: '#111a16',
  text: '#ecfdf5',
  muted: '#93a89c',
  font: 'inter',
  radius: 16,
  density: 'comfortable',
  width: 'regular',
  heroLayout: 'split',
  projectColumns: 2,
  showNav: true,
  avatarSize: 340,
  skillGroupLayouts: {},
};

export const SECTION_WIDTH_PRESETS = [
  { id: 'auto', label: 'Default', max: null },
  { id: 'narrow', label: 'Narrow', max: 760 },
  { id: 'regular', label: 'Regular', max: 1080 },
  { id: 'wide', label: 'Wide', max: 1280 },
  { id: 'full', label: 'Full', max: 1440 },
];

export function getSectionMaxWidth(widthId) {
  return SECTION_WIDTH_PRESETS.find((option) => option.id === widthId)?.max || null;
}

export function getDesignPreset(id) {
  return DESIGN_PRESETS.find((preset) => preset.id === id) || DESIGN_PRESETS[0];
}

export function getFontPair(id) {
  return FONT_PAIRS.find((font) => font.id === id) || FONT_PAIRS[0];
}

export function getWidth(id) {
  return WIDTH_OPTIONS.find((option) => option.id === id) || WIDTH_OPTIONS[1];
}

export function getDensity(id) {
  return DENSITY_OPTIONS.find((option) => option.id === id) || DENSITY_OPTIONS[1];
}

/* ───────────────────────────────── Sample content ──────────────────────────── */

export function createSampleContent() {
  return {
    personal: {
      name: 'Your Name',
      title: 'Product-minded Software Engineer',
      tagline: 'I build fast, accessible products that people actually enjoy using.',
      bio: 'I am a full-stack engineer focused on product velocity and interface craft. Over the last five years I shipped design systems, billing infrastructure and realtime collaboration tools — usually as the first engineer on the team.',
      location: 'Bengaluru, India',
      email: 'you@example.com',
      phone: '',
      avatar: '',
    },
    hero: {
      headline: '',
      subheadline: 'Open to senior product engineering roles and selective consulting.',
      availability: 'Available for new work',
      primaryLabel: 'View selected work',
      primaryHref: '#projects',
      secondaryLabel: 'Email me',
      secondaryHref: '',
    },
    socials: {
      github: 'https://github.com/your-handle',
      linkedin: 'https://linkedin.com/in/your-handle',
      twitter: '',
      website: '',
      email: 'you@example.com',
    },
    stats: [
      { id: uid('stat'), value: '5', suffix: '+', label: 'Years shipping products' },
      { id: uid('stat'), value: '18', suffix: '', label: 'Products launched' },
      { id: uid('stat'), value: '40', suffix: '%', label: 'Faster page loads' },
    ],
    skills: [
      { id: uid('skill'), name: 'TypeScript', category: 'Engineering', level: 95 },
      { id: uid('skill'), name: 'React', category: 'Engineering', level: 95 },
      { id: uid('skill'), name: 'Node.js', category: 'Engineering', level: 88 },
      { id: uid('skill'), name: 'PostgreSQL', category: 'Engineering', level: 82 },
      { id: uid('skill'), name: 'Figma', category: 'Design', level: 78 },
      { id: uid('skill'), name: 'Design systems', category: 'Design', level: 86 },
      { id: uid('skill'), name: 'Docker', category: 'Platform', level: 76 },
      { id: uid('skill'), name: 'CI/CD', category: 'Platform', level: 80 },
    ],
    projects: [
      {
        id: uid('project'),
        title: 'Ledgerline',
        description:
          'Usage-based billing platform handling 12M metered events a day. Cut invoice disputes by 38% with a reconciliation UI engineers actually trust.',
        techStack: ['TypeScript', 'React', 'Node.js', 'ClickHouse'],
        liveUrl: 'https://example.com',
        githubUrl: 'https://github.com',
        image: '',
        featured: true,
      },
      {
        id: uid('project'),
        title: 'Northstar Docs',
        description:
          'Realtime collaborative documentation editor with CRDT sync, comments and an offline-first cache. 4.8k weekly active editors at launch.',
        techStack: ['React', 'Yjs', 'WebSockets'],
        liveUrl: 'https://example.com',
        githubUrl: 'https://github.com',
        image: '',
        featured: false,
      },
      {
        id: uid('project'),
        title: 'Atlas Design System',
        description:
          '42 accessible components, tokens and Figma parity shipped to six product teams. Reduced new-feature UI build time from days to hours.',
        techStack: ['React', 'Radix', 'Tailwind'],
        liveUrl: 'https://example.com',
        githubUrl: '',
        image: '',
        featured: false,
      },
    ],
    experience: [
      {
        id: uid('role'),
        role: 'Senior Product Engineer',
        company: 'Fathom Labs',
        location: 'Remote',
        start: '2023',
        end: 'Present',
        current: true,
        bullets: [
          'Led billing and entitlements rebuild used by every paying account.',
          'Shipped a design system adopted by six product teams.',
        ],
      },
      {
        id: uid('role'),
        role: 'Full-stack Engineer',
        company: 'Northwind Studio',
        location: 'Bengaluru',
        start: '2021',
        end: '2023',
        current: false,
        bullets: [
          'Built the realtime collaboration layer behind the flagship editor.',
          'Reduced p95 API latency by 46% with query and cache work.',
        ],
      },
    ],
    education: [
      {
        id: uid('edu'),
        degree: 'B.Tech, Computer Science',
        school: 'National Institute of Technology',
        year: '2021',
        description: 'Graduated with distinction. Systems, compilers and HCI electives.',
      },
    ],
    testimonials: [
      {
        id: uid('quote'),
        author: 'Priya Raman',
        role: 'Head of Product, Fathom Labs',
        content:
          'The rare engineer who argues about the product, not just the implementation. Shipping with them raised the bar for the whole team.',
      },
    ],
    contact: {
      email: 'you@example.com',
      phone: '',
      location: 'Bengaluru, India',
      message: 'The fastest way to reach me is email — I reply within a day.',
      showForm: true,
    },
    custom: [],
  };
}

export function createBlankContent() {
  return {
    personal: { name: '', title: '', tagline: '', bio: '', location: '', email: '', phone: '', avatar: '' },
    hero: {
      headline: '',
      subheadline: '',
      availability: '',
      primaryLabel: 'View work',
      primaryHref: '#projects',
      secondaryLabel: '',
      secondaryHref: '',
    },
    socials: { github: '', linkedin: '', twitter: '', website: '', email: '' },
    stats: [],
    skills: [],
    projects: [],
    experience: [],
    education: [],
    testimonials: [],
    contact: { email: '', phone: '', location: '', message: '', showForm: true },
    custom: [],
  };
}

export function createDefaultSections() {
  return DEFAULT_SECTION_ORDER.map((type) => ({
    id: type,
    type,
    visible: ['stats', 'testimonials', 'education'].includes(type) ? false : true,
  }));
}

export function createDocument(options = {}) {
  const { templateId = 'Studio', sample = true } = options;
  return normalizeDocument({
    ...(sample ? createSampleContent() : createBlankContent()),
    pf: {
      version: DOC_VERSION,
      templateId,
      sections: createDefaultSections(),
      design: { ...DEFAULT_DESIGN },
      meta: {
        siteTitle: '',
        description: '',
        slug: '',
      },
    },
  });
}

/* ─────────────────────────────── Normalization ─────────────────────────────── */

const asString = (value) => (typeof value === 'string' ? value : value == null ? '' : String(value));
const asArray = (value) => (Array.isArray(value) ? value : []);
const asObject = (value) => (value && typeof value === 'object' && !Array.isArray(value) ? value : {});

function withIds(list, prefix, mapper) {
  return asArray(list).map((item, index) => {
    const base = asObject(item);
    return {
      id: asString(base.id) || uid(prefix),
      ...mapper(base, index),
    };
  });
}

const clampNumber = (value, min, max) => {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return null;
  return Math.max(min, Math.min(max, Math.round(num)));
};

const clampSpan = (value, max = 3) => {
  const num = Number(value);
  if (!Number.isFinite(num) || num < 1) return 1;
  return Math.max(1, Math.min(max, Math.round(num)));
};

function normalizeSections(rawSections) {
  const input = asArray(rawSections);
  const seen = new Set();
  const sections = [];

  for (const entry of input) {
    const obj = asObject(entry);
    const type = asString(obj.type || entry);
    if (!type || seen.has(type)) continue;
    if (type !== 'custom' && !SECTION_TYPE_MAP[type]) continue;
    seen.add(type);
    const maxWidth = ['auto', 'narrow', 'regular', 'wide', 'full'].includes(obj.maxWidth) ? obj.maxWidth : 'auto';
    const paddingY = clampNumber(obj.paddingY, 24, 180);
    sections.push({
      id: asString(obj.id) || type,
      type,
      visible: obj.visible !== false,
      customId: asString(obj.customId),
      ...(maxWidth !== 'auto' ? { maxWidth } : {}),
      ...(paddingY ? { paddingY } : {}),
    });
  }

  for (const type of DEFAULT_SECTION_ORDER) {
    if (seen.has(type)) continue;
    seen.add(type);
    sections.push({ id: type, type, visible: !['stats', 'testimonials', 'education'].includes(type) });
  }

  return sections;
}

export function normalizeDocument(raw) {
  const source = asObject(raw);
  const personal = asObject(source.personal || source.personalInfo);
  const hero = asObject(source.hero);
  const about = asObject(source.about);
  const socials = asObject(source.socials || source.contact);
  const contact = asObject(source.contact);
  const pf = asObject(source.pf);

  const name = asString(personal.name || hero.subtitle || source.name);
  const title = asString(personal.title || hero.title);
  const bio = asString(personal.bio || about.bio);
  const tagline = asString(personal.tagline || hero.tagline);
  const email = asString(personal.email || contact.email || socials.email);
  const location = asString(personal.location || contact.location);

  const doc = {
    personal: {
      name,
      title,
      tagline,
      bio,
      location,
      email,
      phone: asString(personal.phone || contact.phone),
      avatar: asString(personal.avatar || hero.image),
    },
    hero: {
      headline: asString(hero.headline),
      subheadline: asString(hero.subheadline),
      availability: asString(hero.availability),
      primaryLabel: asString(hero.primaryLabel) || 'View selected work',
      primaryHref: asString(hero.primaryHref) || '#projects',
      secondaryLabel: asString(hero.secondaryLabel),
      secondaryHref: asString(hero.secondaryHref),
    },
    socials: {
      github: asString(socials.github),
      linkedin: asString(socials.linkedin),
      twitter: asString(socials.twitter || socials.x),
      website: asString(socials.website || socials.portfolio),
      email: asString(socials.email || email),
    },
    stats: withIds(source.stats, 'stat', (item) => {
      const colSpan = clampSpan(item.colSpan, 2);
      const cardHeight = clampNumber(item.cardHeight, 96, 360);
      return {
        value: asString(item.value),
        suffix: asString(item.suffix),
        label: asString(item.label),
        ...(colSpan > 1 ? { colSpan } : {}),
        ...(cardHeight ? { cardHeight } : {}),
      };
    }),
    skills: withIds(source.skills, 'skill', (item, index) => ({
      name: asString(typeof item === 'string' ? item : item.name),
      category: asString(item.category) || 'Core',
      level:
        typeof item.level === 'number'
          ? Math.max(0, Math.min(100, item.level))
          : 80 + ((index * 5) % 16),
    })),
    projects: withIds(source.projects, 'project', (item, index) => {
      const stack = item.techStack || item.technologies || item.tech;
      const colSpan = clampSpan(item.colSpan, 3);
      const cardHeight = clampNumber(item.cardHeight, 220, 760);
      const mediaHeight = clampNumber(item.mediaHeight, 100, 420);
      return {
        title: asString(item.title || item.name) || `Project ${index + 1}`,
        description: asString(item.description || item.summary),
        techStack: asArray(stack).map(asString).filter(Boolean),
        liveUrl: asString(item.liveUrl || item.link),
        githubUrl: asString(item.githubUrl || item.repoUrl),
        image: asString(item.image || item.imageUrl),
        featured: Boolean(item.featured),
        ...(colSpan > 1 ? { colSpan } : {}),
        ...(cardHeight ? { cardHeight } : {}),
        ...(mediaHeight ? { mediaHeight } : {}),
      };
    }),
    experience: withIds(source.experience, 'role', (item) => ({
      role: asString(item.role || item.title),
      company: asString(item.company),
      location: asString(item.location),
      start: asString(item.start || item.startDate),
      end: asString(item.current ? 'Present' : item.end || item.endDate),
      current: Boolean(item.current) || asString(item.end || item.endDate).toLowerCase() === 'present',
      bullets: [
        ...asArray(item.bullets),
        ...asArray(item.highlights),
        ...(asString(item.description) ? [asString(item.description)] : []),
      ]
        .map(asString)
        .filter(Boolean),
    })),
    education: withIds(source.education, 'edu', (item) => ({
      degree: asString(item.degree),
      school: asString(item.school || item.institution),
      year: asString(item.year || item.endDate),
      description: asString(item.description),
    })),
    testimonials: withIds(source.testimonials, 'quote', (item) => {
      const colSpan = clampSpan(item.colSpan, 2);
      const cardHeight = clampNumber(item.cardHeight, 140, 440);
      return {
        author: asString(item.author || item.name),
        role: asString(item.role || item.title),
        content: asString(item.content || item.quote || item.text),
        ...(colSpan > 1 ? { colSpan } : {}),
        ...(cardHeight ? { cardHeight } : {}),
      };
    }),
    contact: {
      email,
      phone: asString(contact.phone || personal.phone),
      location,
      message: asString(contact.message),
      showForm: contact.showForm !== false,
    },
    custom: withIds(source.custom || source.customSections, 'custom', (item) => ({
      title: asString(item.title) || 'New section',
      description: asString(item.description),
      items: withIds(item.items, 'item', (entry) => ({
        title: asString(entry.title),
        description: asString(entry.description),
        meta: asString(entry.meta),
        url: asString(entry.url),
      })),
    })),
  };

  const design = asObject(pf.design);
  const meta = asObject(pf.meta);
  const templateId = asString(pf.templateId) || 'Studio';

  return {
    ...doc,
    pf: {
      version: DOC_VERSION,
      templateId,
      sections: normalizeSections(pf.sections),
      design: {
        ...DEFAULT_DESIGN,
        ...design,
        radius: Number.isFinite(Number(design.radius)) ? Number(design.radius) : DEFAULT_DESIGN.radius,
        projectColumns: [1, 2, 3].includes(Number(design.projectColumns))
          ? Number(design.projectColumns)
          : DEFAULT_DESIGN.projectColumns,
        avatarSize: clampNumber(design.avatarSize, 180, 480) || DEFAULT_DESIGN.avatarSize,
        skillGroupLayouts: asObject(design.skillGroupLayouts),
      },
      meta: {
        siteTitle: asString(meta.siteTitle),
        description: asString(meta.description),
        slug: asString(meta.slug),
      },
    },
  };
}

/* ────────────────────────────── Immutable paths ────────────────────────────── */

export function getPath(object, path) {
  if (!path) return object;
  return String(path)
    .split('.')
    .reduce((acc, key) => (acc == null ? undefined : acc[key]), object);
}

export function setPath(object, path, value) {
  const keys = String(path).split('.');
  const clone = Array.isArray(object) ? [...object] : { ...object };
  let cursor = clone;

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      cursor[key] = value;
      return;
    }
    const next = cursor[key];
    cursor[key] = Array.isArray(next) ? [...next] : { ...(next || {}) };
    cursor = cursor[key];
  });

  return clone;
}

export function deepMerge(base, patch) {
  if (Array.isArray(patch)) return patch;
  if (!patch || typeof patch !== 'object') return patch;
  const result = { ...(base || {}) };
  for (const [key, value] of Object.entries(patch)) {
    result[key] =
      value && typeof value === 'object' && !Array.isArray(value) ? deepMerge(result[key], value) : value;
  }
  return result;
}

export function moveItem(list, from, to) {
  const next = [...asArray(list)];
  if (from < 0 || from >= next.length || to < 0 || to >= next.length || from === to) return next;
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

/* ───────────────────────────── Derived helpers ─────────────────────────────── */

export function slugify(value, fallback = 'my-portfolio') {
  const slug = asString(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return slug || fallback;
}

export function sectionTitle(doc, section) {
  const type = typeof section === 'string' ? section : section?.type;
  if (type === 'custom') {
    const custom = doc.custom?.find((item) => item.id === section?.customId);
    return custom?.title || 'Custom section';
  }
  return SECTION_TYPE_MAP[type]?.label || 'Section';
}

export function visibleSections(doc) {
  return (doc.pf?.sections || []).filter((section) => section.visible);
}

export function countContent(doc) {
  return {
    projects: doc.projects?.length || 0,
    skills: doc.skills?.length || 0,
    experience: doc.experience?.length || 0,
    testimonials: doc.testimonials?.length || 0,
  };
}

/**
 * Readiness report shown in the Publish tab — the same checks a paid builder
 * uses before it lets you ship: identity, story, evidence, links, SEO.
 */
export function scoreDocument(doc) {
  const personal = doc.personal || {};
  const meta = doc.pf?.meta || {};
  const projects = doc.projects || [];
  const describedProjects = projects.filter((project) => (project.description || '').trim().length >= 60);
  const linkedProjects = projects.filter((project) => project.liveUrl || project.githubUrl);
  const socialCount = ['github', 'linkedin', 'twitter', 'website'].filter((key) => doc.socials?.[key]).length;

  const checks = [
    {
      id: 'name',
      label: 'Name and role',
      passed: Boolean(personal.name?.trim() && personal.title?.trim()),
      hint: 'Recruiters look for your name and the role you want next.',
      weight: 12,
    },
    {
      id: 'bio',
      label: 'Story of 200+ characters',
      passed: (personal.bio || '').trim().length >= 200,
      hint: 'Expand About — what you build, for whom, and the impact.',
      weight: 12,
    },
    {
      id: 'projects',
      label: 'Three or more projects',
      passed: projects.length >= 3,
      hint: 'Add projects so the page has depth beyond the hero.',
      weight: 14,
    },
    {
      id: 'project-detail',
      label: 'Projects with real detail',
      passed: projects.length > 0 && describedProjects.length >= Math.min(2, projects.length),
      hint: 'Aim for 60+ characters per project: problem, action, measurable result.',
      weight: 12,
    },
    {
      id: 'project-links',
      label: 'Live or repo links',
      passed: linkedProjects.length >= Math.min(2, Math.max(1, projects.length)),
      hint: 'Link at least two projects to a live demo or repository.',
      weight: 10,
    },
    {
      id: 'skills',
      label: 'Six or more skills',
      passed: (doc.skills || []).length >= 6,
      hint: 'List the tools you would happily be interviewed on.',
      weight: 8,
    },
    {
      id: 'experience',
      label: 'Experience or education',
      passed: (doc.experience || []).length > 0 || (doc.education || []).length > 0,
      hint: 'Add at least one role — students can use Education.',
      weight: 8,
    },
    {
      id: 'socials',
      label: 'Two professional links',
      passed: socialCount >= 2,
      hint: 'GitHub plus LinkedIn (or your site) builds trust.',
      weight: 8,
    },
    {
      id: 'contact',
      label: 'Contact email',
      passed: Boolean(doc.contact?.email || personal.email),
      hint: 'Without an email the page cannot convert.',
      weight: 8,
    },
    {
      id: 'seo',
      label: 'SEO title and description',
      passed: Boolean(meta.siteTitle?.trim()) && (meta.description || '').trim().length >= 50,
      hint: 'Set a browser title and a 50+ character description in Publish.',
      weight: 8,
    },
  ];

  const totalWeight = checks.reduce((sum, check) => sum + check.weight, 0);
  const earned = checks.reduce((sum, check) => sum + (check.passed ? check.weight : 0), 0);

  return {
    score: Math.round((earned / totalWeight) * 100),
    checks,
    failing: checks.filter((check) => !check.passed),
  };
}

/**
 * Flat index of every editable string in the document.
 * Used by the canvas bridge to map "the text I clicked" in an art-directed
 * template back to the field that produced it.
 */
export function buildFieldIndex(doc, { max = 600 } = {}) {
  const entries = [];
  const IGNORED_KEYS = new Set(['id', 'pf', 'level', 'featured', 'current', 'showForm', 'image', 'avatar']);

  const walk = (node, path) => {
    if (entries.length >= max) return;
    if (typeof node === 'string') {
      const value = node.trim();
      if (value.length >= 2 && !/^(https?:|mailto:|#|\/)/i.test(value)) entries.push({ path, value });
      return;
    }
    if (Array.isArray(node)) {
      node.forEach((item, index) => walk(item, path ? `${path}.${index}` : String(index)));
      return;
    }
    if (node && typeof node === 'object') {
      Object.entries(node).forEach(([key, value]) => {
        if (IGNORED_KEYS.has(key)) return;
        walk(value, path ? `${path}.${key}` : key);
      });
    }
  };

  walk({ ...doc, pf: undefined }, '');
  return entries;
}

/* ─────────────────────────────────── I/O ───────────────────────────────────── */

export function serializeDocument(doc) {
  return JSON.stringify(doc, null, 2);
}

export function parseDocument(text) {
  const parsed = JSON.parse(text);
  const candidate = parsed?.doc || parsed;
  if (!candidate || typeof candidate !== 'object') throw new Error('That file is not a portfolio document.');
  return normalizeDocument(candidate);
}

/** Content payload handed to templates and the deploy pipeline. */
export function toPortfolioData(doc) {
  return {
    ...doc,
    personalInfo: doc.personal,
    hero: {
      ...doc.hero,
      title: doc.personal.title,
      subtitle: doc.personal.name,
      tagline: doc.personal.tagline,
      bio: doc.personal.bio,
      image: doc.personal.avatar,
    },
    about: { bio: doc.personal.bio },
  };
}

/** True when any section, card, or avatar has a custom in-canvas size override. */
export function hasCustomLayout(doc) {
  if (!doc) return false;
  if ((doc.pf?.sections || []).some((s) => (s.maxWidth && s.maxWidth !== 'auto') || s.paddingY)) return true;
  if (doc.pf?.design?.avatarSize && doc.pf.design.avatarSize !== DEFAULT_DESIGN.avatarSize) return true;
  if (Object.keys(doc.pf?.design?.skillGroupLayouts || {}).length > 0) return true;
  if ((doc.projects || []).some((p) => (p.colSpan && p.colSpan > 1) || p.cardHeight || p.mediaHeight)) return true;
  if ((doc.stats || []).some((s) => (s.colSpan && s.colSpan > 1) || s.cardHeight)) return true;
  if ((doc.testimonials || []).some((t) => (t.colSpan && t.colSpan > 1) || t.cardHeight)) return true;
  return false;
}

/** Convert a GitHub AI portfolio build into a full Studio document. */
export function fromGithubPortfolioBuild(build) {
  const sections = asObject(build?.sections);
  const hero = asObject(sections.hero);
  const profile = asObject(build?.profile);
  const stats = asObject(build?.aggregateStats);
  const layout = asObject(build?.layout);
  const rawProjects = asArray(sections.projects);
  const rawSkills = asObject(sections.skills);

  const skills = [
    ...asArray(rawSkills.languages).map((l) => ({
      name: asString(l?.name || l),
      category: 'Languages',
      level: Math.max(20, Math.min(100, (Number(l?.level) || 3) * 20)),
    })),
    ...asArray(rawSkills.tools).map((t) => ({
      name: asString(t),
      category: 'Tools',
      level: 85,
    })),
    ...asArray(rawSkills.domains).map((d) => ({
      name: asString(d),
      category: 'Domains',
      level: 85,
    })),
  ].filter((s) => s.name);

  const projects = rawProjects.map((proj, index) => {
    const key = proj?.id || proj?.name || `proj-${index}`;
    const cardLayout = asObject(layout?.projects?.[key]);
    return {
      title: asString(proj?.title || proj?.name) || `Project ${index + 1}`,
      description: [asString(proj?.summary), ...asArray(proj?.highlights).map((h) => `• ${h}`)]
        .filter(Boolean)
        .join('\n'),
      techStack: asArray(proj?.tech).map(asString).filter(Boolean),
      githubUrl: asString(proj?.url),
      liveUrl: asString(proj?.liveUrl),
      featured: index === 0,
      colSpan: cardLayout.colSpan || 1,
      cardHeight: cardLayout.cardHeight || null,
    };
  });

  const statCards = [
    stats.stars != null ? { value: String(stats.stars), suffix: '', label: 'GitHub Stars' } : null,
    stats.forks != null ? { value: String(stats.forks), suffix: '', label: 'Total Forks' } : null,
    { value: String(stats.reposAnalyzed || projects.length), suffix: '', label: 'Repositories' },
  ].filter(Boolean);

  return normalizeDocument({
    personal: {
      name: asString(profile.name || build?.username || 'Developer'),
      title: asString(hero.headline || 'Software Engineer'),
      tagline: asString(hero.subheadline),
      bio: asString(sections.about),
      location: asString(hero.location || profile.location),
      email: asString(profile.email),
      avatar: asString(profile.avatarUrl),
    },
    hero: {
      headline: asString(hero.headline),
      subheadline: asString(hero.subheadline),
      availability: asString(hero.availableFor),
      primaryLabel: 'View projects',
      primaryHref: '#projects',
      secondaryLabel: build?.username ? 'GitHub Profile' : '',
      secondaryHref: asString(profile.htmlUrl),
    },
    socials: {
      github: asString(profile.htmlUrl || (build?.username ? `https://github.com/${build.username}` : '')),
      website: asString(profile.blog),
    },
    stats: statCards,
    skills,
    projects,
    contact: {
      email: asString(profile.email),
      location: asString(hero.location || profile.location),
      message: asString(sections.callToAction || 'Get in touch to collaborate.'),
      showForm: true,
    },
    pf: {
      templateId: 'Studio',
      design: {
        ...DEFAULT_DESIGN,
        avatarSize: layout?.avatarSize ? clampNumber(layout.avatarSize * 3, 180, 480) || 340 : 340,
      },
      meta: {
        siteTitle: asString(profile.name || build?.username),
        description: asString(hero.subheadline || sections.about).slice(0, 160),
        slug: slugify(build?.username || profile.name || 'github-portfolio'),
      },
    },
  });
}
