import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, X } from 'lucide-react';
import {
  useAIConfigStore,
  PROVIDER_META,
  PROVIDER_CATEGORIES,
} from '../../stores/useAIConfigStore';
import { cn } from '../../lib/utils';
import AIProviderCard from './AIProviderCard';

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
  },
};

const ALL_PROVIDER_IDS = Object.keys(PROVIDER_META);

export default function AIProviderSetup() {
  const activeProvider = useAIConfigStore((s) => s.activeProvider);
  const providers = useAIConfigStore((s) => s.providers);
  const setActiveProvider = useAIConfigStore((s) => s.setActiveProvider);

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');

  // Derive active provider display info
  const activeMeta = activeProvider ? PROVIDER_META[activeProvider] : null;
  const activeEntry = activeProvider ? providers[activeProvider] : null;
  const activeModel = activeEntry?.model || activeMeta?.defaultModel || '';

  const configuredCount = useMemo(
    () => ALL_PROVIDER_IDS.filter((id) => providers[id]?.apiKey || providers[id]?.validated).length,
    [providers]
  );

  const filteredIds = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_PROVIDER_IDS.filter((id) => {
      const meta = PROVIDER_META[id];
      if (!meta) return false;
      if (category !== 'all' && meta.category !== category) return false;
      if (!q) return true;
      return (
        meta.name.toLowerCase().includes(q) ||
        (meta.tagline || '').toLowerCase().includes(q) ||
        id.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  const groups = useMemo(
    () =>
      PROVIDER_CATEGORIES.map((cat) => ({
        ...cat,
        ids: filteredIds.filter((id) => PROVIDER_META[id]?.category === cat.id),
      })).filter((group) => group.ids.length > 0),
    [filteredIds]
  );

  return (
    <div className="space-y-6">
      {/* ---- Summary Banner ---- */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="relative overflow-hidden rounded-xl border border-border bg-card/60 backdrop-blur-sm px-5 py-4"
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/[0.04] via-transparent to-transparent" />

        <div className="relative flex items-center gap-3">
          {/* Status dot */}
          {activeProvider ? (
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>
          ) : (
            <span className="inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-muted-foreground/40" />
          )}

          <p className="text-sm text-muted-foreground">
            {activeProvider ? (
              <>
                Currently using{' '}
                <span className="font-semibold text-foreground">
                  {activeMeta?.name}
                </span>{' '}
                <span className="text-muted-foreground/70">
                  ({activeModel})
                </span>
              </>
            ) : (
              <>
                No{' '}
                <span className="font-semibold text-foreground">
                  API Key Found
                </span>{' '}
                <span className="text-muted-foreground/70">(configure your own API keys to use AI features)</span>
              </>
            )}
          </p>

          <span className="ml-auto shrink-0 rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
            {ALL_PROVIDER_IDS.length} providers
            {configuredCount > 0 && ` · ${configuredCount} configured`}
          </span>
        </div>
      </motion.div>

      {/* ---- Search + category filters ---- */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search providers (openai, groq, ollama, custom…)"
            className={cn(
              'w-full rounded-xl border border-border bg-background/60 py-2.5 pl-9 pr-9 text-sm text-foreground',
              'placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30'
            )}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setCategory('all')}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
              category === 'all'
                ? 'border-primary/40 bg-primary/10 text-primary'
                : 'border-border bg-background/60 text-muted-foreground hover:text-foreground'
            )}
          >
            All ({ALL_PROVIDER_IDS.length})
          </button>
          {PROVIDER_CATEGORIES.map((cat) => {
            const count = ALL_PROVIDER_IDS.filter(
              (id) => PROVIDER_META[id]?.category === cat.id
            ).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
                  category === cat.id
                    ? 'border-primary/40 bg-primary/10 text-primary'
                    : 'border-border bg-background/60 text-muted-foreground hover:text-foreground'
                )}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* ---- Provider Cards, grouped ---- */}
      {groups.length === 0 ? (
        <div className="rounded-xl border border-border bg-card/60 px-6 py-10 text-center text-sm text-muted-foreground">
          No providers match “{query}”.
        </div>
      ) : (
        groups.map((group) => (
          <div key={group.id} className="space-y-3">
            {category === 'all' && (
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </h3>
                <span className="text-[11px] text-muted-foreground/60">
                  {group.ids.length}
                </span>
                <div className="h-px flex-1 bg-border/60" />
              </div>
            )}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 lg:grid-cols-2 gap-4"
            >
              {group.ids.map((id) => (
                <motion.div key={id} variants={cardVariants}>
                  <AIProviderCard
                    providerId={id}
                    isActive={activeProvider === id}
                    onActivate={setActiveProvider}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        ))
      )}

      {!activeProvider && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" />
          Pick a provider, add your key (or base URL for local endpoints), then Test connection and Save.
        </p>
      )}
    </div>
  );
}
