import React, { useState } from 'react';
import { ArrowRight, TrendingUp, ExternalLink } from 'lucide-react';

// ─────────────────────────────────────────────────────────
// Project data — replace with props / API data as needed
// Each project: id, category, title, description, tech[],
//               metrics[{label, value}], link
// ─────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: 1,
    category: 'Risk Analytics',
    title: 'Enterprise Risk Intelligence Platform',
    description:
      'End-to-end risk-scoring engine that aggregates real-time market data, credit exposure, and operational KPIs into a single governance dashboard adopted by 14 Fortune 500 clients.',
    tech: ['Python', 'Apache Kafka', 'PostgreSQL', 'React', 'Power BI'],
    metrics: [
      { label: 'Risk Reduction', value: '34%' },
      { label: 'Clients', value: '14' },
      { label: 'AUM Monitored', value: '$2.4B' },
    ],
    link: '#',
  },
  {
    id: 2,
    category: 'Regulatory Compliance',
    title: 'Automated Basel III Reporting Suite',
    description:
      'Regulatory reporting automation covering COREP, FINREP and LCR/NSFR ratios, cutting manual reconciliation hours by 80% across three European banking entities.',
    tech: ['Java', 'Spring Boot', 'Oracle DB', 'XBRL', 'Docker'],
    metrics: [
      { label: 'Hours Saved', value: '80%' },
      { label: 'Automated Reports', value: '120+' },
      { label: 'Audit Findings', value: '0' },
    ],
    link: '#',
  },
  {
    id: 3,
    category: 'Investment Intelligence',
    title: 'Quantitative Portfolio Optimizer',
    description:
      'ML-driven mean-variance optimizer with factor-exposure controls and stress-test scenarios, deployed for a mid-market asset manager overseeing multi-asset portfolios.',
    tech: ['Python', 'scikit-learn', 'FastAPI', 'AWS Lambda', 'TypeScript'],
    metrics: [
      { label: 'Alpha Generated', value: '+2.1%' },
      { label: 'Sharpe Ratio', value: '1.87' },
      { label: 'AUM Managed', value: '$780M' },
    ],
    link: '#',
  },
  {
    id: 4,
    category: 'FinTech Integration',
    title: 'Open-Banking Payments Hub',
    description:
      'PSD2-compliant open-banking gateway enabling instant account-to-account transfers, multi-currency FX, and real-time reconciliation for a pan-European neobank.',
    tech: ['Node.js', 'GraphQL', 'Redis', 'Kubernetes', 'ISO 20022'],
    metrics: [
      { label: 'Transactions/Day', value: '2.3M' },
      { label: 'Uptime SLA', value: '99.99%' },
      { label: 'P99 Latency', value: '<120ms' },
    ],
    link: '#',
  },
  {
    id: 5,
    category: 'Treasury & Capital Markets',
    title: 'Real-Time Treasury Management System',
    description:
      'Centralized liquidity and cash-flow forecasting platform integrated with 18 banking counterparties, providing intraday position visibility and FX hedging recommendations.',
    tech: ['C#', '.NET 8', 'Azure Service Bus', 'SQL Server', 'Power Automate'],
    metrics: [
      { label: 'Cash Visibility', value: '100%' },
      { label: 'FX Savings/yr', value: '$1.2M' },
      { label: 'Integrations', value: '18' },
    ],
    link: '#',
  },
  {
    id: 6,
    category: 'ESG & Reporting',
    title: 'ESG Data Aggregation & Scoring Engine',
    description:
      'Automated ESG data pipeline ingesting third-party ratings, company disclosures, and news sentiment to produce composite scores aligned with TCFD and SFDR frameworks.',
    tech: ['Python', 'dbt', 'Snowflake', 'Airflow', 'Tableau'],
    metrics: [
      { label: 'Data Sources', value: '40+' },
      { label: 'Companies Tracked', value: '3,200' },
      { label: 'Report Time Cut', value: '65%' },
    ],
    link: '#',
  },
];

// ─────────────────────────────────────────────────────────
// Category badge colour map — finance-domain palette
// ─────────────────────────────────────────────────────────
const CATEGORY_COLORS = {
  'Risk Analytics':             'bg-blue-50 text-blue-800 border-blue-200',
  'Regulatory Compliance':      'bg-slate-100 text-slate-700 border-slate-300',
  'Investment Intelligence':    'bg-amber-50 text-amber-800 border-amber-200',
  'FinTech Integration':        'bg-indigo-50 text-indigo-800 border-indigo-200',
  'Treasury & Capital Markets': 'bg-cyan-50 text-cyan-800 border-cyan-200',
  'ESG & Reporting':            'bg-emerald-50 text-emerald-800 border-emerald-200',
};

// ─────────────────────────────────────────────────────────
// ProjectCard — single reusable project card
// FIX: arrow hover is scoped to its own <a> group,
//      not the parent <article> group, so it animates
//      correctly on link hover, not just card hover.
// FIX: card body uses flex-col with the description
//      as flex-1 to push the CTA to the bottom cleanly.
// ─────────────────────────────────────────────────────────
function ProjectCard({ project }) {
  const badgeClass =
    CATEGORY_COLORS[project.category] ||
    'bg-gray-100 text-gray-700 border-gray-200';

  return (
    <article
      className="
        group flex flex-col bg-white border border-slate-200
        rounded-2xl shadow-sm overflow-hidden
        transition-all duration-300 ease-out
        hover:shadow-lg hover:-translate-y-1 hover:border-slate-300
      "
      aria-label={`Project: ${project.title}`}
    >
      {/* Top accent bar — navy-to-blue-to-gold gradient */}
      <div
        className="h-1 w-full bg-gradient-to-r from-[#0f2557] via-[#1a3a8f] to-[#c9a84c]
          opacity-70 group-hover:opacity-100 transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* Card body — flex-col so description expands and CTA stays at bottom */}
      <div className="flex flex-col flex-1 p-6 gap-4">

        {/* Category badge */}
        <span
          className={`self-start text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border ${badgeClass}`}
        >
          {project.category}
        </span>

        {/* Title */}
        <h3 className="text-[17px] font-bold text-[#0f2557] leading-snug group-hover:text-[#1a3a8f] transition-colors duration-200">
          {project.title}
        </h3>

        {/* Description — flex-1 pushes everything below it down */}
        <p className="text-sm text-slate-500 leading-relaxed flex-1">
          {project.description}
        </p>

        {/* Metrics row — 3-column KPI block */}
        <div className="grid grid-cols-3 divide-x divide-slate-200 border border-slate-100 rounded-xl bg-slate-50 overflow-hidden">
          {project.metrics.map((m) => (
            <div key={m.label} className="flex flex-col items-center py-3 px-1">
              <span className="text-sm font-extrabold text-[#0f2557] tabular-nums">
                {m.value}
              </span>
              <span className="text-[9px] text-slate-400 text-center leading-tight mt-0.5 uppercase tracking-wider">
                {m.label}
              </span>
            </div>
          ))}
        </div>

        {/* Tech stack tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium bg-[#0f2557]/5 text-[#0f2557]/80 border border-[#0f2557]/10 px-2.5 py-0.5 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA link — FIX: arrow uses local `peer` so it animates on link-hover only */}
        <a
          href={project.link}
          aria-label={`View case study for ${project.title}`}
          className="
            group/link inline-flex items-center gap-1.5 self-start
            text-sm font-semibold text-[#1a3a8f]
            border-b border-transparent pb-0.5
            hover:border-[#c9a84c] hover:text-[#c9a84c]
            transition-all duration-200 focus:outline-none
            focus-visible:ring-2 focus-visible:ring-[#1a3a8f] focus-visible:rounded-sm
          "
        >
          View Case Study
          {/* FIX: scoped to group/link — animates on link-hover, not card-hover */}
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:translate-x-1"
            aria-hidden="true"
          />
        </a>

      </div>
    </article>
  );
}

// ─────────────────────────────────────────────────────────
// Projects — main exported section component
// ─────────────────────────────────────────────────────────
export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All');

  // Derive unique category list preserving insertion order
  const categories = [
    'All',
    ...Array.from(new Set(PROJECTS.map((p) => p.category))),
  ];

  const filtered =
    activeFilter === 'All'
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeFilter);

  return (
    <section
      id="projects"
      className="w-full bg-[#f7f8fc] py-20 px-4 sm:px-6 lg:px-8"
      aria-labelledby="projects-heading"
    >
      <div className="max-w-7xl mx-auto">

        {/* ── Section header ─────────────────────────────── */}
        <div className="mb-12 text-center">

          {/* Eyebrow label with side rules */}
          <p className="inline-flex items-center gap-3 text-[11px] font-bold tracking-[0.22em] uppercase text-[#c9a84c] mb-4">
            <span className="block h-px w-8 bg-[#c9a84c]" aria-hidden="true" />
            Portfolio of Work
            <span className="block h-px w-8 bg-[#c9a84c]" aria-hidden="true" />
          </p>

          <h2
            id="projects-heading"
            className="text-3xl sm:text-4xl font-extrabold text-[#0f2557] tracking-tight leading-tight"
          >
            Featured Projects &amp;{' '}
            <span className="text-[#1a3a8f]">Engagements</span>
          </h2>

          <p className="mt-4 max-w-2xl mx-auto text-slate-500 text-[15px] leading-relaxed">
            A curated selection of high-impact financial technology initiatives spanning
            risk management, regulatory compliance, capital markets, and enterprise
            data engineering.
          </p>

          {/* Decorative divider */}
          <div
            className="mt-8 flex items-center justify-center gap-2"
            aria-hidden="true"
          >
            <div className="h-px w-16 bg-slate-200" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#c9a84c]" />
            <div className="h-px w-8 bg-[#0f2557]/25" />
            <TrendingUp className="h-4 w-4 text-[#0f2557]/25" />
            <div className="h-px w-8 bg-[#0f2557]/25" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#c9a84c]" />
            <div className="h-px w-16 bg-slate-200" />
          </div>
        </div>

        {/* ── Category filter tabs ────────────────────────── */}
        {/* FIX: added px-2 sm:px-0 wrapper so pills don't clip on very small screens */}
        <nav
          aria-label="Filter projects by category"
          className="flex flex-wrap justify-center gap-2 mb-10 px-2 sm:px-0"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveFilter(cat)}
              aria-pressed={activeFilter === cat}
              className={`
                px-4 py-2 rounded-full text-sm font-medium border
                transition-all duration-200 cursor-pointer
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a3a8f] focus-visible:ring-offset-2
                ${
                  activeFilter === cat
                    ? 'bg-[#0f2557] text-white border-[#0f2557] shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-[#0f2557]/30 hover:text-[#0f2557] hover:bg-slate-50'
                }
              `}
            >
              {cat}
            </button>
          ))}
        </nav>

        {/* ── Projects grid ───────────────────────────────── */}
        {/* FIX: when only 1 card is shown (filtered), grid naturally sizes it to 1 col
            on sm, 2 on md, 3 on lg — no odd full-width stretching */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          role="list"
          aria-label="Project cards"
        >
          {filtered.map((project) => (
            <div key={project.id} role="listitem" className="flex">
              {/* flex on listitem makes the child article stretch to full height */}
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        {/* Empty state — shown when a category filter returns no results */}
        {filtered.length === 0 && (
          <div className="py-20 text-center text-slate-400 text-sm">
            No projects found for this category.
          </div>
        )}

        {/* ── Bottom CTA banner ───────────────────────────── */}
        <div className="mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 bg-[#0f2557] rounded-2xl px-7 py-6 shadow-lg">
          <div>
            <p className="text-white font-bold text-lg leading-snug">
              Interested in a collaboration?
            </p>
            <p className="text-slate-300 text-sm mt-1 leading-relaxed">
              Open to consulting engagements, advisory roles, and full-time opportunities.
            </p>
          </div>
          <a
            href="#contact"
            className="
              shrink-0 inline-flex items-center gap-2 px-6 py-3
              bg-[#c9a84c] hover:bg-[#b8943d] active:bg-[#a8833d]
              text-[#0f2557] font-bold text-sm rounded-xl
              transition-colors duration-200 shadow-md
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]
              focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f2557]
            "
          >
            Get In Touch
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

      </div>
    </section>
  );
}
