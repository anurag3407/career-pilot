/**
 * Stable selector map for the F1_Racing template's editable elements.
 * Each entry maps a slug → { selector, dataPath, kind, defaultColor, label }.
 *
 * The selector targets stable DOM nodes inside the F1 template (rendered
 * inside an iframe). Because we don't modify the template, we rely on
 * pattern-matching textContent in the iframe to locate the right element.
 *
 * `dataPath` is the JS path inside `portfolioData` that this field maps to
 * (e.g. `personal.name`). The overlay uses this when committing a change.
 *
 * `kind` describes what kind of field it is so the inline editor can
 * render the right controls (text input, textarea, color picker).
 */
export const F1_EDITABLE_ELEMENTS = [
  // ─── HERO ────────────────────────────────────────────────────────────────
  {
    slug: 'hero.name',
    section: 'Hero',
    label: 'Name',
    kind: 'text',
    dataPath: 'personal.name',
    matchText: ['Alex Verstappen'],
  },
  {
    slug: 'hero.title',
    section: 'Hero',
    label: 'Job Title',
    kind: 'text',
    dataPath: 'personal.title',
    matchText: ['Lead Full-Stack Developer'],
  },
  {
    slug: 'hero.location',
    section: 'Hero',
    label: 'Location',
    kind: 'text',
    dataPath: 'personal.location',
    matchText: ['Monaco / Remote'],
  },
  {
    slug: 'hero.bio',
    section: 'Hero',
    label: 'Hero bio',
    kind: 'textarea',
    dataPath: 'personal.bio',
    matchText: ['Engineering high-performance', 'Specializing in React'],
  },
  {
    slug: 'hero.driverNumber',
    section: 'Hero',
    label: 'Driver number',
    kind: 'text',
    dataPath: 'stats.driverNumber',
    matchText: ['#33'],
  },
  {
    slug: 'hero.team',
    section: 'Hero',
    label: 'Team / company',
    kind: 'text',
    dataPath: 'stats.team',
    matchText: ['Red Bull Technical Labs'],
  },
  {
    slug: 'hero.podiums',
    section: 'Hero',
    label: 'Podiums stat',
    kind: 'text',
    dataPath: 'stats.podiums',
    matchText: ['42 Projects'],
  },
  {
    slug: 'hero.experience',
    section: 'Hero',
    label: 'Race pace stat',
    kind: 'text',
    dataPath: 'stats.experience',
    matchText: ['8 Yrs'],
  },
  {
    slug: 'hero.fastestLaps',
    section: 'Hero',
    label: 'Fast lap stat',
    kind: 'text',
    dataPath: 'stats.fastestLaps',
    matchText: ['99.9% Uptime'],
  },
  {
    slug: 'hero.status',
    section: 'Hero',
    label: 'Status',
    kind: 'text',
    dataPath: 'stats.status',
    matchText: ['ACTIVE CONTRACT'],
  },

  // ─── ABOUT ──────────────────────────────────────────────────────────────
  {
    slug: 'about.bio',
    section: 'About',
    label: 'About bio',
    kind: 'textarea',
    dataPath: 'personal.bio',
    matchText: ['Engineering high-performance'],
  },

  // ─── CONTACT ────────────────────────────────────────────────────────────
  {
    slug: 'contact.email',
    section: 'Contact',
    label: 'Contact email',
    kind: 'text',
    dataPath: 'personal.email',
    matchText: ['alex@example.com'],
  },
];

/** Slugs of all editable elements. */
export const F1_EDITABLE_SLUGS = F1_EDITABLE_ELEMENTS.map((e) => e.slug);

/**
 * Apply a single field edit to a portfolioData object using the slug's
 * `dataPath`. Supports nested paths like `personal.name` and array indices
 * aren't needed for v1.
 */
export function applyFieldEdit(portfolioData, dataPath, value) {
  if (!dataPath || value === undefined) return portfolioData;
  const next = JSON.parse(JSON.stringify(portfolioData || {}));
  const parts = dataPath.split('.');
  let cursor = next;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    if (cursor[k] === undefined || cursor[k] === null || typeof cursor[k] !== 'object') {
      cursor[k] = {};
    }
    cursor = cursor[k];
  }
  cursor[parts[parts.length - 1]] = value;
  // Mirror personal <-> personalInfo (the template reads either)
  if (dataPath.startsWith('personal.')) {
    if (!next.personalInfo) next.personalInfo = {};
    next.personalInfo[dataPath.slice('personal.'.length)] = value;
  }
  return next;
}

/**
 * Mock single-element enhancer used in development when no LLM is wired.
 * Provides a deterministic-but-plausible rewrite so the UI flow can be
 * demoed end-to-end without a backend round-trip.
 */
export function mockEnhanceElement(fieldKind, currentValue) {
  if (!currentValue) return '';
  if (fieldKind === 'textarea' || fieldKind === 'text') {
    const trimmed = String(currentValue).trim();
    // Light, predictable transformations
    if (/^#?\d+$/.test(trimmed)) return trimmed; // driver number unchanged
    if (trimmed.length < 60) {
      return `${trimmed} — engineered for speed, built for scale, and ready to ship.`;
    }
    return `${trimmed.replace(/\s+/g, ' ').trim()}. Delivered with a relentless focus on performance and reliability.`;
  }
  return currentValue;
}