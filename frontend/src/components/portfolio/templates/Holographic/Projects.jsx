import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Cpu,
  Globe,
  Layers3,
  MonitorSmartphone,
  ShieldCheck,
  Sparkles,
  Star,
  Workflow,
} from 'lucide-react';

const defaultProjects = [
  {
    title: 'AI Voice Interview Coach',
    blurb:
      'An immersive rehearsal flow that blends speech cues, feedback loops, and recruiter-style scoring into one polished experience.',
    audience: 'Job seekers',
    outcome: '82% better interview confidence',
    metrics: ['Real-time coaching', 'Scenario library', 'Pinned insights'],
    icon: Cpu,
    accent: 'from-cyan-300 to-sky-400',
  },
  {
    title: 'Portfolio Autopilot',
    blurb:
      'A modular portfolio builder that turns projects, achievements, and resume data into a premium story in minutes.',
    audience: 'Freelancers',
    outcome: '3x faster launch',
    metrics: ['Content suggestions', 'Template switching', 'Export-ready pages'],
    icon: Layers3,
    accent: 'from-fuchsia-300 to-pink-400',
  },
  {
    title: 'Hiring Pulse Dashboard',
    blurb:
      'A recruiter-facing command center that highlights strong signals, spotlight metrics, and next-step prompts at a glance.',
    audience: 'Hiring teams',
    outcome: '24h faster approvals',
    metrics: ['Signal tracking', 'Quick briefs', 'CRM sync'],
    icon: Globe,
    accent: 'from-violet-300 to-indigo-400',
  },
];

const highlights = [
  { label: 'Responsive by default', icon: MonitorSmartphone },
  { label: 'Holographic motion accents', icon: Sparkles },
  { label: 'Trusted delivery checklist', icon: ShieldCheck },
];

export default function Projects({
  eyebrow = 'Featured Projects',
  title = 'A holographic project showcase built to convert attention into action.',
  description = 'Each project block is tuned for clarity, motion, and strong visual hierarchy so the portfolio feels futuristic without losing readability.',
  projects = defaultProjects,
}) {
  const safeProjects = Array.isArray(projects) && projects.length > 0 ? projects : defaultProjects;

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-fuchsia-300/40 bg-[linear-gradient(135deg,#090A1A_0%,#11142E_45%,#1B1A4A_100%)] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.24),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.22),transparent_23%),radial-gradient(circle_at_center,rgba(99,102,241,0.16),transparent_25%)]" />
        <div className="absolute left-[-6rem] top-[-4rem] h-52 w-52 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute bottom-[-6rem] right-[-4rem] h-56 w-56 rounded-full bg-fuchsia-400/20 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.06)_48%,transparent_100%)] opacity-45" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl space-y-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-end">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/35 bg-cyan-300/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-cyan-100">
              <Sparkles className="h-3.5 w-3.5" />
              {eyebrow}
            </div>

            <div className="space-y-4">
              <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[2.65rem] lg:leading-tight">
                {title}
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-slate-200/90 sm:text-base">
                {description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              {highlights.map(({ label, icon: Icon }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100"
                >
                  <Icon className="h-4 w-4 text-cyan-100" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(12,18,48,0.92),rgba(11,16,38,0.85))] p-5 shadow-[0_24px_80px_rgba(72,85,255,0.16)] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-cyan-100/80">
                  Spotlight
                </p>
                <p className="mt-2 text-lg font-semibold text-white">Project pulse</p>
              </div>
              <div className="inline-flex items-center gap-1 rounded-full border border-amber-200/35 bg-amber-100/10 px-3 py-1 text-xs text-amber-50">
                <Star className="h-3.5 w-3.5" />
                Featured
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-cyan-200/20 bg-cyan-100/10 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-50/80">Reach</p>
                <p className="mt-2 text-2xl font-semibold text-white">4.9/5</p>
                <p className="mt-1 text-sm text-slate-100/85">Reviewer satisfaction across launches</p>
              </div>
              <div className="rounded-2xl border border-fuchsia-200/20 bg-fuchsia-100/10 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-50/80">Flow</p>
                <p className="mt-2 text-2xl font-semibold text-white">92%</p>
                <p className="mt-1 text-sm text-slate-100/85">Reusability across portfolio pages</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {safeProjects.map((project, index) => {
            const Icon = project.icon;

            return (
              <motion.article
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08 * index }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,14,36,0.96),rgba(12,17,42,0.88))] p-5 shadow-[0_20px_60px_rgba(72,85,255,0.14)]"
              >
                <div className={`absolute inset-x-6 top-0 h-1 rounded-full bg-gradient-to-r ${project.accent}`} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_22%)]" />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${project.accent} text-slate-950`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.7rem] uppercase tracking-[0.3em] text-cyan-100">
                      {project.audience}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                    <p className="text-sm leading-6 text-slate-200/85">{project.blurb}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {project.metrics.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-100"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-[0.65rem] uppercase tracking-[0.3em] text-cyan-100/80">Outcome</p>
                    <p className="mt-2 text-sm font-medium text-white">{project.outcome}</p>
                  </div>

                  <a
                    href="#"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-100 transition group-hover:text-white"
                  >
                    Explore case study
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="rounded-[1.5rem] border border-cyan-200/20 bg-[linear-gradient(135deg,rgba(34,211,238,0.14),rgba(244,114,182,0.12))] px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Ready to showcase your best work?</p>
              <p className="mt-1 text-sm text-slate-100/85">
                Blend sleek motion, strong hierarchy, and conversion-friendly storytelling into every project card.
              </p>
            </div>
            <a
              href="#"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-fuchsia-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_12px_40px_rgba(103,232,249,0.28)]"
            >
              <Workflow className="h-4 w-4" />
              Build your portfolio
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
