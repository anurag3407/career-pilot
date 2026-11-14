/**
 * Portfolio template registry.
 *
 * Every art-directed portfolio template lives in
 * `frontend/src/components/portfolio/templates/<Id>/index.jsx`.
 *
 * Instead of a hand-maintained lazy-import map (which silently dropped
 * templates and broke deploys for anything outside the list), the registry is
 * derived from the filesystem with `import.meta.glob`. That keeps the gallery,
 * the live preview and the Studio's template switcher in sync automatically.
 */
import { lazy } from 'react';
import { templates as rawTemplates } from './templates';

const dirModules = import.meta.glob('../components/portfolio/templates/*/index.jsx');
const fileModules = import.meta.glob('../components/portfolio/templates/*.jsx');

const loaders = new Map();

for (const [path, loader] of Object.entries(dirModules)) {
  const id = path.replace('../components/portfolio/templates/', '').replace('/index.jsx', '');
  loaders.set(id, loader);
}
for (const [path, loader] of Object.entries(fileModules)) {
  const id = path.replace('../components/portfolio/templates/', '').replace('.jsx', '');
  if (!loaders.has(id)) loaders.set(id, loader);
}

/** Canonical "build from sections" template rendered by the Studio itself. */
export const STUDIO_TEMPLATE_ID = 'Studio';

export const STUDIO_TEMPLATE = {
  id: STUDIO_TEMPLATE_ID,
  title: 'Studio',
  category: 'Portfolio',
  colorScheme: 'Dark',
  layout: 'Minimal',
  author: 'CareerPilot',
  views: 0,
  rating: 5,
  description:
    'The composable CareerPilot layout: reorder or hide any section, restyle colours, type and density, and edit every word on the canvas.',
  isComplete: true,
  isStudio: true,
};

export const TEMPLATE_IDS = Object.keys(Object.fromEntries(loaders)).sort();

export function hasTemplate(id) {
  return loaders.has(id);
}

export function getTemplateLoader(id) {
  return loaders.get(id) || null;
}

function MissingTemplate({ templateId }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-zinc-950 p-10 text-center text-zinc-200">
      <p className="font-mono text-sm text-rose-400">Template “{templateId}” could not be loaded.</p>
      <p className="max-w-sm text-xs text-zinc-400">
        This layout file is missing or failed to compile. Pick another template in the Studio — your
        content is safe.
      </p>
    </div>
  );
}

const componentCache = new Map();

/**
 * Returns a cached `React.lazy` component for a template id.
 * Unknown ids resolve to a readable error card instead of crashing the route.
 */
export function getTemplateComponent(id) {
  const templateId = String(id || '');
  if (componentCache.has(templateId)) return componentCache.get(templateId);

  const loader = loaders.get(templateId);
  const Component = lazy(
    loader
      ? () =>
          loader().catch((error) => {
            console.error(`Failed to load portfolio template "${templateId}"`, error);
            return { default: () => <MissingTemplate templateId={templateId} /> };
          })
      : () => Promise.resolve({ default: () => <MissingTemplate templateId={templateId} /> }),
  );

  componentCache.set(templateId, Component);
  return Component;
}

/** Template metadata (title, category, tags…) with Studio first. */
export function getTemplateMeta(id) {
  if (id === STUDIO_TEMPLATE_ID) return STUDIO_TEMPLATE;
  return rawTemplates.find((template) => template.id === id) || {
    id,
    title: String(id || 'Template').replace(/_/g, ' '),
    category: 'Portfolio',
    colorScheme: 'Dark',
    layout: 'Grid',
    author: 'CareerPilot',
    views: 0,
    rating: 0,
    isComplete: true,
  };
}

/**
 * Gallery-ready list: de-duplicated, only ids that actually resolve to a
 * component, Studio pinned to the front.
 */
export function listPortfolioTemplates() {
  const seen = new Set();
  const list = [STUDIO_TEMPLATE];

  for (const template of rawTemplates) {
    if (!template?.id || seen.has(template.id) || !loaders.has(template.id)) continue;
    seen.add(template.id);
    list.push({
      ...template,
      title: template.title || String(template.id).replace(/_/g, ' '),
      category: template.category || 'Portfolio',
      colorScheme: template.colorScheme || 'Dark',
      layout: template.layout || 'Grid',
      author: template.author || 'CareerPilot',
      views: template.views ?? 0,
      rating: template.rating ?? 0,
      searchText: [
        template.title,
        template.id,
        template.category,
        template.colorScheme,
        template.layout,
        template.author,
        template.description,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase(),
    });
  }

  return list;
}
