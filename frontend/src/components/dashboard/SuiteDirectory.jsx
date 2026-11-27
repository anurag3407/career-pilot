import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Search, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { NAV_GROUPS } from '../../constants/navigation'

const SUITES = NAV_GROUPS.filter((g) => g.id !== 'overview')

/**
 * SuiteDirectory: categorized paid-SaaS feature explorer with suite filter
 * tabs and instant keyword filtering across every tool in CareerPilot.
 */
export default function SuiteDirectory({ initialSuite = 'all' }) {
  const [selectedSuite, setSelectedSuite] = useState(initialSuite)
  const [query, setQuery] = useState('')

  const visibleSuites = useMemo(() => {
    const q = query.trim().toLowerCase()
    return SUITES.filter((group) => selectedSuite === 'all' || group.id === selectedSuite)
      .map((group) => ({
        ...group,
        items: q
          ? group.items.filter(
              (item) =>
                item.label.toLowerCase().includes(q) ||
                item.desc.toLowerCase().includes(q) ||
                group.label.toLowerCase().includes(q),
            )
          : group.items,
      }))
      .filter((group) => group.items.length > 0)
  }, [selectedSuite, query])

  const totalTools = SUITES.reduce((count, group) => count + group.items.length, 0)

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary/85">
            Product suites
          </span>
          <h2 className="mt-1.5 text-[1.4rem] font-medium tracking-[-0.03em]">
            All {totalTools} tools, organized by workflow
          </h2>
        </div>

        {/* Search input */}
        <div className="relative w-full lg:w-72">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground/40"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter tools..."
            aria-label="Filter product suite tools"
            className="h-9 w-full rounded-lg border border-border bg-card pl-8 pr-8 text-[13px] text-foreground outline-none placeholder:text-foreground/40 focus:border-primary"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear tool filter"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-foreground/40 hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Suite Filter Tabs */}
      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filter by product suite">
        <button
          type="button"
          role="tab"
          aria-selected={selectedSuite === 'all'}
          onClick={() => setSelectedSuite('all')}
          className={cn(
            'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
            selectedSuite === 'all'
              ? 'border-primary/40 bg-primary/10 text-primary'
              : 'border-border bg-card text-foreground/65 hover:text-foreground',
          )}
        >
          All suites
        </button>
        {SUITES.map((suite) => (
          <button
            key={suite.id}
            type="button"
            role="tab"
            aria-selected={selectedSuite === suite.id}
            onClick={() => setSelectedSuite(suite.id)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
              selectedSuite === suite.id
                ? 'border-primary/40 bg-primary/10 text-primary'
                : 'border-border bg-card text-foreground/65 hover:text-foreground',
            )}
          >
            {suite.stage && (
              <span className="font-mono text-[10px] opacity-70">{suite.stage}</span>
            )}
            <span>{suite.label}</span>
          </button>
        ))}
      </div>

      {/* Suite List */}
      {visibleSuites.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center">
          <p className="text-sm font-medium text-foreground">No tools match "{query}"</p>
          <p className="mt-1 text-xs text-foreground/55">
            Clear the filter or switch suites to view all available tools.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setSelectedSuite('all')
            }}
            className="mt-4 inline-flex items-center rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary/40"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleSuites.map((group) => (
            <div key={group.id} className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-background/60 px-5 py-3">
                <div className="flex items-center gap-2.5">
                  {group.stage && (
                    <span className="font-mono text-[11px] font-semibold tabular-nums text-primary">
                      {group.stage}
                    </span>
                  )}
                  <h3 className="text-[13.5px] font-semibold tracking-tight text-foreground">
                    {group.label}
                  </h3>
                  <span className="hidden text-xs text-foreground/45 sm:inline">
                    {group.tagline}
                  </span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/40">
                  {group.items.length} tool{group.items.length === 1 ? '' : 's'}
                </span>
              </div>

              <div className="grid gap-px bg-border sm:grid-cols-2 xl:grid-cols-3">
                {group.items.map((tool) => (
                  <Link
                    key={tool.to}
                    to={tool.to}
                    className="group flex items-start gap-3 bg-card px-5 py-4 transition-colors hover:bg-background"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-border bg-background text-foreground/55 transition-colors group-hover:border-primary/30 group-hover:text-primary">
                      <tool.icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1 text-[13.5px] font-medium text-foreground transition-colors group-hover:text-primary">
                        <span className="truncate">{tool.label}</span>
                        <ArrowUpRight
                          className="h-3.5 w-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                          aria-hidden="true"
                        />
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-[12px] leading-relaxed text-foreground/55">
                        {tool.desc}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
