import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Download,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';

const defaultContent = {
  eyebrow: 'Resume CTA',
  title: 'Make your next opportunity feel inevitable.',
  description:
    'Turn your portfolio into a high-conviction hiring moment with a polished resume snapshot, curated skills, and a clear next step for recruiters.',
  primaryLabel: 'Download resume kit',
  secondaryLabel: 'Preview portfolio flow',
  primaryHref: '#',
  secondaryHref: '#',
  metrics: [
    { value: '97%', label: 'Faster first impressions' },
    { value: '3x', label: 'More recruiter clicks' },
    { value: '24h', label: 'Average turnaround' },
  ],
};

const featureBadges = [
  { icon: ShieldCheck, text: 'ATS-friendly layout' },
  { icon: Sparkles, text: 'Holographic highlight accents' },
  { icon: Zap, text: 'Fast scanning for hiring teams' },
];

export default function ResumeCTA({
  eyebrow = defaultContent.eyebrow,
  title = defaultContent.title,
  description = defaultContent.description,
  primaryLabel = defaultContent.primaryLabel,
  secondaryLabel = defaultContent.secondaryLabel,
  primaryHref = defaultContent.primaryHref,
  secondaryHref = defaultContent.secondaryHref,
  metrics = defaultContent.metrics,
}) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-fuchsia-300/40 bg-[linear-gradient(135deg,#090A1A_0%,#11142E_45%,#1B1A4A_100%)] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.3),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.24),transparent_24%),radial-gradient(circle_at_center,rgba(34,211,238,0.15),transparent_30%)]" />
        <div className="absolute left-[-8rem] top-1/2 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="absolute right-[-6rem] top-[-4rem] h-56 w-56 rounded-full bg-fuchsia-400/20 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.08)_50%,transparent_100%)] opacity-40" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-300/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-cyan-100">
            <Sparkles className="h-3.5 w-3.5" />
            {eyebrow}
          </div>

          <div className="space-y-4">
            <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[2.6rem] lg:leading-tight">
              {title}
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-slate-200/90 sm:text-base">
              {description}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={primaryHref}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-fuchsia-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_12px_40px_rgba(103,232,249,0.28)] transition-transform duration-200 hover:scale-[1.01]"
            >
              <Download className="h-4 w-4" />
              {primaryLabel}
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href={secondaryHref}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-fuchsia-200/40 hover:bg-white/10"
            >
              <PlayCircle className="h-4 w-4 text-fuchsia-200" />
              {secondaryLabel}
            </a>
          </div>

          <div className="grid gap-3 pt-2 sm:grid-cols-3">
            {metrics.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 + index * 0.08 }}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-lg"
              >
                <p className="text-lg font-semibold text-white sm:text-xl">{item.value}</p>
                <p className="mt-1 text-xs text-slate-200/80">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-[1.75rem] bg-gradient-to-br from-cyan-300/30 via-fuchsia-300/20 to-sky-300/10 blur-[2px]" />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-[linear-gradient(180deg,rgba(12,18,48,0.92),rgba(11,16,38,0.85))] p-5 shadow-[0_24px_80px_rgba(72,85,255,0.18)] backdrop-blur-xl sm:p-6">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.35em] text-cyan-100/80">Resume spotlight</p>
                <p className="mt-2 text-lg font-semibold text-white">Holographic Recruiter Preview</p>
              </div>
              <div className="rounded-full border border-cyan-200/30 bg-cyan-100/10 px-3 py-1 text-xs text-cyan-50">
                Live
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              <div className="rounded-2xl border border-fuchsia-300/30 bg-fuchsia-300/10 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.3em] text-fuchsia-100/80">Core message</p>
                <p className="mt-3 text-sm leading-6 text-slate-100">
                  Designed to feel premium, futuristic, and immediately memorable for the hiring team.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {featureBadges.map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                  >
                    <Icon className="h-4 w-4 text-cyan-100" />
                    <p className="mt-3 text-sm text-slate-100">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-cyan-200/20 bg-[linear-gradient(135deg,rgba(34,211,238,0.18),rgba(244,114,182,0.14))] px-4 py-4 text-sm text-slate-100">
              <p className="font-medium text-white">Next best action</p>
              <p className="mt-2 leading-6 text-slate-100/90">
                Highlight your most important proof points, emphasize impact, and invite the recruiter to connect instantly.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
