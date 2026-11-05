/**
 * Reorder markdown sections to match the user's chosen sectionOrder
 * and append/inject any customSections.
 */

const SECTION_HEADER_MAP = {
  'summary': 'summary',
  'professional summary': 'summary',
  'about': 'summary',
  'about me': 'summary',
  'profile': 'summary',
  'education': 'education',
  'academic background': 'education',
  'academics': 'education',
  'experience': 'experience',
  'work experience': 'experience',
  'professional experience': 'experience',
  'employment': 'experience',
  'projects': 'projects',
  'key projects': 'projects',
  'personal projects': 'projects',
  'skills': 'skills',
  'technical skills': 'skills',
  'skills & tools': 'skills',
  'skills & interests': 'skills',
  'core competencies': 'skills',
  'certifications': 'certifications',
  'certificates': 'certifications',
  'licenses': 'certifications',
};

export function normalizeSectionHeader(headerText = '') {
  const clean = headerText.trim().replace(/^#+\s*/, '').replace(/:$/, '').toLowerCase();
  return SECTION_HEADER_MAP[clean] || clean;
}

export function formatCustomSectionToMarkdown(section) {
  if (!section || !section.title) return '';
  const { title, kind, items = [], body = '' } = section;
  let md = `## ${title.toUpperCase()}\n\n`;

  if (kind === 'paragraph') {
    md += `${body.trim()}\n\n`;
  } else if (kind === 'quotes') {
    items.filter(Boolean).forEach((q) => {
      md += `> "${q}"\n\n`;
    });
  } else if (kind === 'books') {
    items.filter(Boolean).forEach((b) => {
      md += `* ${b}\n`;
    });
    md += '\n';
  } else {
    // 'list' (default)
    items.filter(Boolean).forEach((item) => {
      md += `* ${item}\n`;
    });
    md += '\n';
  }
  return md;
}

export function reorderMarkdownBySectionOrder(markdownText, sectionOrder = [], customSections = []) {
  if (!markdownText || typeof markdownText !== 'string') return markdownText || '';

  // Match markdown section headings starting with ## or ###
  const lines = markdownText.split(/\r?\n/);
  let headerLines = [];
  const sections = [];
  let currentSection = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^(#{2,3})\s+(.+)$/);

    if (match) {
      if (currentSection) {
        sections.push(currentSection);
      }
      const rawTitle = match[2].trim();
      currentSection = {
        key: normalizeSectionHeader(rawTitle),
        title: rawTitle,
        lines: [line],
      };
    } else {
      if (currentSection) {
        currentSection.lines.push(line);
      } else {
        headerLines.push(line);
      }
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  // If no sections were identified, simply append custom sections if any
  if (sections.length === 0) {
    let result = markdownText.trim() + '\n\n';
    for (const cs of customSections) {
      result += formatCustomSectionToMarkdown(cs);
    }
    return result.trim();
  }

  const sectionsByKey = new Map();
  for (const s of sections) {
    sectionsByKey.set(s.key, s);
  }

  const customById = new Map();
  const customByKey = new Map();
  for (const cs of customSections) {
    if (cs?.id) customById.set(cs.id, cs);
    if (cs?.title) customByKey.set(normalizeSectionHeader(cs.title), cs);
  }

  const emittedKeys = new Set();
  const outputParts = [];

  // 1. Header (Name, contact info)
  const headerContent = headerLines.join('\n').trim();
  if (headerContent) {
    outputParts.push(headerContent);
  }

  // 2. Summary fixed lead (if present)
  if (sectionsByKey.has('summary')) {
    outputParts.push(sectionsByKey.get('summary').lines.join('\n').trim());
    emittedKeys.add('summary');
  }

  // 3. User chosen section order
  const orderList = Array.isArray(sectionOrder) ? sectionOrder.filter(Boolean) : [];
  for (const rawKey of orderList) {
    const key = normalizeSectionHeader(rawKey);
    if (key === 'summary' || emittedKeys.has(key)) continue;

    if (sectionsByKey.has(key)) {
      outputParts.push(sectionsByKey.get(key).lines.join('\n').trim());
      emittedKeys.add(key);
    } else if (customById.has(rawKey)) {
      const cs = customById.get(rawKey);
      outputParts.push(formatCustomSectionToMarkdown(cs).trim());
      emittedKeys.add(rawKey);
      if (cs.title) emittedKeys.add(normalizeSectionHeader(cs.title));
    } else if (customByKey.has(key)) {
      const cs = customByKey.get(key);
      outputParts.push(formatCustomSectionToMarkdown(cs).trim());
      emittedKeys.add(key);
      if (cs.id) emittedKeys.add(cs.id);
    }
  }

  // 4. Remaining standard sections that weren't in sectionOrder
  for (const s of sections) {
    if (!emittedKeys.has(s.key)) {
      outputParts.push(s.lines.join('\n').trim());
      emittedKeys.add(s.key);
    }
  }

  // 5. Remaining custom sections that haven't been emitted
  for (const cs of customSections) {
    if (!emittedKeys.has(cs.id) && !emittedKeys.has(normalizeSectionHeader(cs.title))) {
      outputParts.push(formatCustomSectionToMarkdown(cs).trim());
      emittedKeys.add(cs.id);
    }
  }

  return outputParts.filter(Boolean).join('\n\n') + '\n';
}

export default reorderMarkdownBySectionOrder;
