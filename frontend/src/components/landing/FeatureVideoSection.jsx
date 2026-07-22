import { createElement } from 'react';
import { motion } from 'framer-motion';
import { Github, Globe2, Palette, Play, Rocket } from 'lucide-react';

const MotionSection = motion.section;
const MotionDiv = motion.div;
const MotionH2 = motion.h2;
const MotionP = motion.p;

const portfolioSteps = [
  {
    icon: Palette,
    title: 'Choose a template',
    description: 'Start from a polished portfolio layout built for developers and students.',
  },
  {
    icon: Github,
    title: 'Add your work',
    description: 'Showcase projects, skills, sections, and links in a recruiter-friendly format.',
  },
  {
    icon: Rocket,
    title: 'Preview and deploy',
    description: 'Review the portfolio experience before publishing it online.',
  },
];

const previewStats = [
  { value: '3', label: 'Steps' },
  { value: '100%', label: 'Mobile' },
  { value: 'Live', label: 'Preview' },
];

function getPortfolioHeadingContent(heading) {
  if (heading !== 'Preview your portfolio before launch') {
    return heading;
  }

  return (
    <>
      Preview your
      <br />
      portfolio before
      <span className="mt-1 block">launch</span>
    </>
  );
}

function PortfolioDemoPreview({ videoUrl, posterUrl, heading }) {
  if (videoUrl) {
    return (
      <iframe
        src={videoUrl}
        title={`${heading} demo video`}
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
        sandbox="allow-scripts allow-same-origin allow-presentation"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    );
  }

  return (
    <div className="group absolute inset-0 overflow-hidden bg-slate-950">
      {posterUrl ? (
        <img
          src={posterUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_32%),linear-gradient(135deg,rgba(15,23,42,0.95),rgba(2,6,23,0.98))]" />
      )}

      <div className="absolute inset-5 rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
              Portfolio preview
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Template, projects, skills, and deployment flow
            </p>
          </div>
          <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-bold text-emerald-300">
            Demo
          </span>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
            <div className="h-3 w-24 rounded-full bg-emerald-300/80" />
            <div className="mt-4 h-8 w-40 rounded-xl bg-white/15" />
            <div className="mt-3 space-y-2">
              <div className="h-2.5 w-full rounded-full bg-white/10" />
              <div className="h-2.5 w-4/5 rounded-full bg-white/10" />
              <div className="h-2.5 w-3/5 rounded-full bg-white/10" />
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {previewStats.map((stat) => (
                <div
                  key={stat.label}
                  className="min-w-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-3"
                >
                  <div className="truncate text-sm font-black text-white">{stat.value}</div>
                  <div className="mt-1 truncate text-[10px] uppercase tracking-[0.08em] text-slate-500">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {['Template selected', 'Projects imported', 'Ready to publish'].map((item, index) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-300/15 text-xs font-black text-emerald-300">
                  {index + 1}
                </span>
                <span className="text-sm font-semibold text-slate-200">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 z-20 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-emerald-300 text-slate-950 shadow-2xl shadow-emerald-400/25 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-200 group-hover:shadow-emerald-400/40"
      >
        <Play className="ml-1 h-7 w-7" fill="currentColor" aria-hidden="true" />
      </div>
    </div>
  );
}

function DefaultVideoSection({
  heading,
  subheading,
  videoUrl,
  posterUrl,
  caption,
}) {
  return (
    <section className="relative z-10 bg-background py-24 sm:py-32">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-16 text-center">
          <MotionH2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            {getPortfolioHeadingContent(heading)}
          </MotionH2>
          <MotionP
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground"
          >
            {subheading}
          </MotionP>
        </div>

        <MotionDiv
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
        >
          <div className="relative flex h-10 items-center border-b border-border bg-muted/40 px-4">
            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500" />
              <span className="h-3 w-3 rounded-full bg-yellow-500" />
              <span className="h-3 w-3 rounded-full bg-green-500" />
            </div>
          </div>

          <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden bg-muted/50">
            <PortfolioDemoPreview videoUrl={videoUrl} posterUrl={posterUrl} heading={heading} />
          </div>
        </MotionDiv>

        {caption && (
          <MotionP
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-center text-sm text-muted-foreground"
          >
            {caption}
          </MotionP>
        )}
      </div>
    </section>
  );
}

export default function FeatureVideoSection({
  heading = 'See it in action',
  subheading = 'Watch how our tools can transform your workflow in minutes.',
  videoUrl = '',
  posterUrl = '',
  caption = 'A quick 2-minute walkthrough of the core features.',
  variant = 'default',
}) {
  if (variant !== 'portfolio') {
    return (
      <DefaultVideoSection
        heading={heading}
        subheading={subheading}
        videoUrl={videoUrl}
        posterUrl={posterUrl}
        caption={caption}
      />
    );
  }

  return (
    <MotionSection className="relative z-10 overflow-hidden bg-[#0a0a0a] py-24 text-white sm:py-32">
      <div className="absolute inset-x-0 top-10 mx-auto h-72 max-w-4xl rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div>
          <MotionDiv
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm font-semibold text-emerald-300"
          >
            <Globe2 className="h-4 w-4" aria-hidden="true" />
            Demo walkthrough
          </MotionDiv>

          <MotionH2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="max-w-2xl text-4xl font-black leading-[0.98] tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            {getPortfolioHeadingContent(heading)}
          </MotionH2>

          <MotionP
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 max-w-xl text-lg leading-8 text-slate-300"
          >
            {subheading}
          </MotionP>

          <MotionDiv
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-8 space-y-4"
          >
            {portfolioSteps.map(({ icon, title, description }) => (
              <div
                key={title}
                className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-300/10 text-emerald-300">
                  {createElement(icon, { className: 'h-5 w-5', 'aria-hidden': true })}
                </span>
                <div>
                  <p className="font-bold text-white">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">{description}</p>
                </div>
              </div>
            ))}
          </MotionDiv>
        </div>

        <MotionDiv
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.12 }}
          className="relative"
        >
          <div className="absolute -inset-6 rounded-[2rem] bg-emerald-400/10 blur-3xl" />

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/90 p-3 shadow-2xl shadow-emerald-950/30 backdrop-blur">
            <div className="flex h-11 items-center justify-between rounded-t-[1.5rem] border border-white/10 border-b-0 bg-white/[0.04] px-4">
              <div className="flex gap-2">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
              </div>
              <span className="hidden rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-slate-400 sm:inline">
                careerpilot.app/portfolio-builder
              </span>
            </div>

            <div className="relative aspect-video overflow-hidden rounded-b-[1.5rem] border border-white/10">
              <PortfolioDemoPreview videoUrl={videoUrl} posterUrl={posterUrl} heading={heading} />
            </div>
          </div>

          {caption && (
            <p className="mt-5 text-center text-sm leading-6 text-slate-400">
              {caption}
            </p>
          )}
        </MotionDiv>
      </div>
    </MotionSection>
  );
}
