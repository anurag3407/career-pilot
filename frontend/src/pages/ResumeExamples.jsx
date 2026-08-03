import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, Filter, Sparkles, ArrowRight, Briefcase, FileText,
} from 'lucide-react'
import { motion } from 'framer-motion'
import {
  RESUME_EXAMPLES,
  EXAMPLE_CATEGORIES,
  getExamplesByCategory,
} from '../data/resumeExamples'

/**
 * ResumeExamples — browsable library of curated resume examples by
 * industry/role (Gap #6).
 *
 * Each example can be opened in the ResumeTemplates page with the
 * example's pre-filled data so users can preview any of the 8 templates
 * styled against the sample.
 */
export default function ResumeExamples() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const base = getExamplesByCategory(activeCategory)
    const q = query.trim().toLowerCase()
    if (!q) return base
    return base.filter(e =>
      e.role.toLowerCase().includes(q) ||
      e.company.toLowerCase().includes(q) ||
      e.summary.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q)
    )
  }, [activeCategory, query])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-500 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Resume Examples
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            {RESUME_EXAMPLES.length}+ curated resume examples
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Browse by industry or role. Every example opens in the templates gallery so
            you can see how it renders across our 8 styles — and export as PDF, DOCX, or TXT.
          </p>
        </motion.header>

        {/* Search + categories */}
        <div className="rounded-2xl border border-border bg-card p-4 mb-6">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search roles, industries, or keywords…"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeCategory === 'all'
                  ? 'bg-sky-500 text-white'
                  : 'bg-muted/60 text-foreground hover:bg-muted'
              }`}
            >
              <Filter className="w-3 h-3" />
              All
            </button>
            {EXAMPLE_CATEGORIES.map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCategory(c.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activeCategory === c.id
                    ? 'bg-sky-500 text-white'
                    : 'bg-muted/60 text-foreground hover:bg-muted'
                }`}
              >
                <span aria-hidden>{c.icon}</span>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Examples grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground py-12">
              No examples match "{query}". Try a different search.
            </div>
          ) : (
            filtered.map(example => (
              <ExampleCard key={example.id} example={example} />
            ))
          )}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/resume-templates"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-500 hover:text-sky-400"
          >
            Or start with your own data in the templates gallery
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

function ExampleCard({ example }) {
  const params = new URLSearchParams({
    exampleId: example.id,
  }).toString()
  return (
    <Link
      to={`/resume-templates?${params}`}
      className="group block rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all hover:-translate-y-0.5"
    >
      <div
        className="aspect-[210/297] flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #ecfeff 100%)',
        }}
      >
        <div className="text-center px-6">
          <Briefcase className="w-8 h-8 mx-auto text-sky-500 mb-2" />
          <div className="font-bold text-foreground text-sm">
            {example.personal.name}
          </div>
          <div className="text-xs text-sky-600 mt-0.5">
            {example.personal.title}
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-foreground text-sm group-hover:text-sky-500 transition-colors">
              {example.role}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {example.company}
            </p>
          </div>
          <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-muted text-foreground uppercase tracking-wider">
            {example.category}
          </span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
          {example.summary}
        </p>
        <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-sky-500">
          <FileText className="w-3 h-3" />
          Open in templates
          <ArrowRight className="w-3 h-3" />
        </div>
      </div>
    </Link>
  )
}
