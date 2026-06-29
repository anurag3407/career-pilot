/**
 * Converts an array of custom resume sections into a Markdown string.
 *
 * @param {Array<{name: string, entries: Array<{id: string, title: string, subtitle: string, date: string, description: string}>}>} sections
 * @returns {string}
 */
export function sectionsToMarkdown(sections) {
  if (!Array.isArray(sections) || sections.length === 0) return '';
  return sections
    .map((s) => {
      const header = `## ${s?.name || 'Untitled Section'}\n`;
      const entries = Array.isArray(s?.entries) ? s.entries : [];
      const body = entries
        .map((e) => {
          const parts = [];
          if (e?.title) {
            const titleLine = e.subtitle
              ? `**${e.title}** — *${e.subtitle}*`
              : `**${e.title}**`;
            parts.push(e.date ? `${titleLine} *(${e.date})*` : titleLine);
          }
          if (e?.description) parts.push(e.description);
          return parts.join('\n');
        })
        .filter(Boolean)
        .join('\n\n');
      return header + body;
    })
    .join('\n\n');
}
