import React, { useMemo, useState } from 'react';
import { Check, Search, Sparkles, X } from 'lucide-react';
import { listPortfolioTemplates, STUDIO_TEMPLATE_ID } from '../../../data/portfolioTemplates';

const LAYOUTS = ['All', 'Minimal', 'Grid', 'Interactive', 'Cards', 'Scroll', 'Dashboard'];
const SCHEMES = ['All', 'Dark', 'Light', 'Colorful'];

function hashGradient(id) {
  let hash = 0;
  for (let index = 0; index < String(id).length; index += 1) {
    hash = (hash * 31 + String(id).charCodeAt(index)) % 360;
  }
  const hue = hash;
  return `linear-gradient(135deg, hsl(${hue} 62% 22%) 0%, hsl(${(hue + 46) % 360} 68% 42%) 100%)`;
}

export default function TemplatesPanel({ currentTemplateId, onSelectTemplate }) {
  const [query, setQuery] = useState('');
  const [layout, setLayout] = useState('All');
  const [scheme, setScheme] = useState('All');

  const templates = useMemo(() => listPortfolioTemplates(), []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return templates.filter((template) => {
      if (layout !== 'All' && template.layout !== layout) return false;
      if (scheme !== 'All' && template.colorScheme !== scheme) return false;
      if (!needle) return true;
      return (template.searchText || `${template.title} ${template.id}`).includes(needle);
    });
  }, [templates, query, layout, scheme]);

  const studio = filtered.find((template) => template.id === STUDIO_TEMPLATE_ID);
  const rest = filtered.filter((template) => template.id !== STUDIO_TEMPLATE_ID);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="space-y-2 border-b border-border px-4 py-3">
        <div>
          <h2 className="text-sm font-bold text-foreground">Templates</h2>
          <p className="text-[11px] text-muted-foreground">
            {templates.length} designs · switching keeps all of your content
          </p>
        </div>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search 260+ templates…"
            className="w-full rounded-lg border border-border bg-background py-1.5 pl-8 pr-7 text-xs text-foreground placeholder:text-muted-foreground/70 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        <div className="flex gap-1 overflow-x-auto pb-0.5">
          {LAYOUTS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setLayout(item)}
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold transition ${
                layout === item
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="flex gap-1 overflow-x-auto pb-0.5">
          {SCHEMES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setScheme(item)}
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold transition ${
                scheme === item
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {studio && (
          <button
            type="button"
            onClick={() => onSelectTemplate(STUDIO_TEMPLATE_ID)}
            className={`mb-2 w-full overflow-hidden rounded-xl border p-0 text-left transition ${
              currentTemplateId === STUDIO_TEMPLATE_ID
                ? 'border-primary ring-2 ring-primary/25'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="relative flex h-20 items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(52,211,153,0.35),transparent_60%),linear-gradient(135deg,#0a0f0d,#111a16)]">
              <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-300">
                Composable
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 px-2.5 py-2">
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-foreground">Studio layout</p>
                <p className="truncate text-[10px] text-muted-foreground">Reorder sections · full design control</p>
              </div>
              {currentTemplateId === STUDIO_TEMPLATE_ID ? (
                <Check className="h-4 w-4 shrink-0 text-primary" />
              ) : (
                <Sparkles className="h-4 w-4 shrink-0 text-muted-foreground" />
              )}
            </div>
          </button>
        )}

        <div className="grid grid-cols-2 gap-2">
          {rest.map((template) => {
            const active = currentTemplateId === template.id;
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => onSelectTemplate(template.id)}
                title={template.description || template.title}
                className={`group overflow-hidden rounded-lg border text-left transition ${
                  active ? 'border-primary ring-2 ring-primary/25' : 'border-border hover:border-primary/50'
                }`}
              >
                <div
                  className="relative flex h-16 items-end justify-between p-1.5"
                  style={{ background: hashGradient(template.id) }}
                >
                  <span className="rounded bg-black/35 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white/90">
                    {template.layout}
                  </span>
                  {active && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-black">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                  )}
                </div>
                <div className="px-2 py-1.5">
                  <p className="truncate text-[11px] font-semibold text-foreground">{template.title}</p>
                  <p className="truncate text-[9px] text-muted-foreground">{template.colorScheme}</p>
                </div>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="px-3 py-8 text-center text-[11px] text-muted-foreground">
            No templates match those filters.
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setLayout('All');
                setScheme('All');
              }}
              className="mt-2 block w-full text-primary hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
