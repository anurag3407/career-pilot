import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { FEATURES_BY_SLUG } from '../../data/featuresConfig';
import Seo from '../../components/Seo';
import Navbar from '../../components/Navbar';
import Footer from '../../components/ui/Footer';
import { ImageComparisonDemo } from '../../components/ui/image-comparison-demo';
import {
  FileText, Type, Github, Sparkles, BarChart3,
  Layout, Linkedin, Download, ArrowRight, Check,
  Star, Zap, Target, Shield
} from 'lucide-react';

const iconMap = {
  FileText, Type, Github, Sparkles, BarChart: BarChart3, Layout, Linkedin, Download
};

/* ─── Hero Mockup: fake resume builder UI ─────────────────── */
function ResumeBuilderMockup() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card/60 shadow-2xl backdrop-blur-xl">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400/70" />
        <span className="h-3 w-3 rounded-full bg-amber-400/70" />
        <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
        <span className="ml-3 text-xs text-muted-foreground">Resume Builder — CareerPilot</span>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="hidden w-44 shrink-0 border-r border-border bg-muted/20 p-4 md:block">
          <div className="space-y-3">
            {['Personal', 'Experience', 'Education', 'Skills', 'Projects'].map((s, i) => (
              <div key={s} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold ${i === 1 ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
                <div className={`h-1.5 w-1.5 rounded-full ${i === 1 ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                {s}
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-lg border border-dashed border-border p-3 text-center">
            <Sparkles className="mx-auto h-4 w-4 text-primary/60" />
            <p className="mt-1 text-[10px] font-bold text-muted-foreground">AI Assist</p>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-5">
          {/* ATS Score bar */}
          <div className="mb-5 flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400">ATS Score</span>
            </div>
            <span className="text-sm font-black text-emerald-400">95/100</span>
          </div>

          {/* Resume content skeleton */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/15 border border-primary/20" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-32 rounded bg-foreground/12" />
                <div className="h-2.5 w-24 rounded bg-foreground/6" />
              </div>
            </div>
            <div className="border-t border-border pt-3 space-y-2">
              <div className="h-2.5 w-full rounded bg-foreground/8" />
              <div className="h-2.5 w-5/6 rounded bg-foreground/5" />
              <div className="h-2.5 w-4/6 rounded bg-foreground/5" />
            </div>
            <div className="border-t border-border pt-3 space-y-2">
              <div className="h-2.5 w-full rounded bg-foreground/8" />
              <div className="h-2.5 w-3/4 rounded bg-foreground/5" />
            </div>
            {/* Skill tags */}
            <div className="flex gap-2 pt-2">
              {['React', 'Node.js', 'TypeScript'].map(tag => (
                <span key={tag} className="rounded-md bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── AI Enhancement visual ───────────────────────────────── */
function AIEnhanceVisual() {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-xs font-black uppercase tracking-wider text-primary">AI Rewrite</span>
      </div>
      {/* Before */}
      <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 mb-3">
        <p className="text-[10px] font-bold uppercase text-red-400 mb-1">Before</p>
        <p className="text-xs text-muted-foreground line-through decoration-red-400/50">Worked on the frontend team doing stuff with React</p>
      </div>
      {/* Arrow */}
      <div className="flex justify-center my-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
          <ArrowRight className="h-3 w-3 text-primary rotate-90" />
        </div>
      </div>
      {/* After */}
      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
        <p className="text-[10px] font-bold uppercase text-emerald-400 mb-1">After</p>
        <p className="text-xs text-foreground font-medium">Led migration of 40+ components to React 18, reducing bundle size by 34% and improving LCP by 1.2s</p>
      </div>
    </div>
  );
}

/* ─── ATS Score visual ────────────────────────────────────── */
function ATSScoreVisual() {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-5">
        <BarChart3 className="h-4 w-4 text-primary" />
        <span className="text-xs font-black uppercase tracking-wider text-primary">ATS Analysis</span>
      </div>
      {/* Score ring */}
      <div className="flex items-center justify-center mb-5">
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-4 border-emerald-500/30">
          <div className="absolute inset-1 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin-slow" style={{ animationDuration: '3s' }} />
          <div className="text-center">
            <span className="text-2xl font-black text-foreground">95</span>
            <span className="block text-[9px] font-bold uppercase text-muted-foreground">/ 100</span>
          </div>
        </div>
      </div>
      {/* Checklist */}
      <div className="space-y-2">
        {[
          { label: 'Keywords matched', ok: true },
          { label: 'Formatting ATS-safe', ok: true },
          { label: 'Section headings', ok: true },
          { label: 'Contact info placement', ok: true },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Templates visual ────────────────────────────────────── */
function TemplatesVisual() {
  const templates = [
    { name: 'Modern', accent: 'from-sky-500 to-blue-600' },
    { name: 'Executive', accent: 'from-amber-500 to-orange-600' },
    { name: 'Minimal', accent: 'from-violet-500 to-purple-600' },
    { name: 'Creative', accent: 'from-rose-500 to-pink-600' },
  ];
  return (
    <div className="grid grid-cols-2 gap-3">
      {templates.map((t, i) => (
        <motion.div
          key={t.name}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          className="group rounded-xl border border-border bg-card/60 p-4 transition-all duration-300 hover:border-primary/40 hover:-translate-y-1"
        >
          <div className={`mb-3 h-2 w-10 rounded-full bg-gradient-to-r ${t.accent}`} />
          <div className="space-y-1.5">
            <div className="h-2 w-full rounded bg-foreground/10" />
            <div className="h-2 w-3/4 rounded bg-foreground/6" />
            <div className="h-2 w-1/2 rounded bg-foreground/4" />
          </div>
          <p className="mt-3 text-[10px] font-bold text-muted-foreground">{t.name}</p>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── Main Component ──────────────────────────────────────── */
export default function ResumeBuilderLanding() {
  const { user } = useAuth();
  const config = FEATURES_BY_SLUG['resume-builder'];

  const primaryCtaText = user ? config.primaryAction.label : config.hero.primaryCta.text;
  const primaryCtaLink = user ? config.primaryAction.to : config.hero.primaryCta.to;

  const ctaSectionText = user ? config.primaryAction.label : config.cta.ctaText;
  const ctaSectionLink = user ? config.primaryAction.to : config.cta.ctaTo;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Seo {...config.seo} />
      <Navbar />

      <main className="pt-20">
        {/* ═══ HERO ═══════════════════════════════════════════ */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-[140px]" />
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
              {/* Left: Copy */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 backdrop-blur-md">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-muted-foreground">
                    #1 AI Resume Builder
                  </span>
                </div>

                <h1 className="mt-7 text-4xl font-black leading-[0.95] tracking-tighter text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                  {config.hero.title}{' '}
                  <span className="text-muted-foreground/40">{config.hero.accentText}</span>
                </h1>

                <p className="mt-6 max-w-md text-lg font-medium leading-relaxed text-muted-foreground">
                  {config.hero.description}
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <Link
                    to={primaryCtaLink}
                    className="group inline-flex items-center gap-3 rounded-xl bg-foreground px-8 py-4 text-sm font-black text-background shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
                  >
                    {primaryCtaText}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <a
                    href="#demo"
                    className="inline-flex items-center rounded-xl border border-border px-7 py-4 text-sm font-black text-foreground transition-all duration-300 hover:border-foreground/40"
                  >
                    {config.hero.secondaryCta.text}
                  </a>
                </div>

                {/* Stats */}
                <div className="mt-12 flex gap-10">
                  {config.hero.stats.map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                    >
                      <span className="text-2xl font-black tracking-tight text-foreground md:text-3xl">{stat.value}</span>
                      <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{stat.label}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Right: Mockup */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-primary/[0.06] blur-2xl" />
                <ResumeBuilderMockup />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══ SOCIAL PROOF STRIP ═════════════════════════════ */}
        <section className="border-y border-border py-8">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/40">Trusted by professionals at</span>
            {['Google', 'Meta', 'Stripe', 'Netflix', 'Vercel'].map(company => (
              <span key={company} className="text-sm font-black tracking-tight text-muted-foreground/30">{company}</span>
            ))}
          </div>
        </section>

        {/* ═══ FEATURE SPOTLIGHTS ═════════════════════════════ */}
        <section className="py-24 md:py-36">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-20"
            >
              <span className="text-[11px] font-black uppercase tracking-[0.35em] text-primary/70">Features</span>
              <h2 className="mt-4 max-w-2xl text-4xl font-black tracking-tighter text-foreground md:text-6xl">
                {config.showcase.heading}
              </h2>
            </motion.div>

            {/* Feature Row 1: AI Enhance */}
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20 mb-24">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 mb-5">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-2xl font-black tracking-tight text-foreground md:text-4xl">
                  AI that writes like you — but better
                </h3>
                <p className="mt-4 max-w-md text-base font-medium leading-relaxed text-muted-foreground">
                  Paste a rough bullet point and watch AI transform it into a measurable, impact-driven achievement. Tailored to your industry and seniority level.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {['Action verbs', 'Quantified impact', 'Industry-tuned'].map(tag => (
                    <span key={tag} className="rounded-lg bg-muted/60 border border-border px-3 py-1.5 text-xs font-bold text-muted-foreground">{tag}</span>
                  ))}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <AIEnhanceVisual />
              </motion.div>
            </div>

            {/* Feature Row 2: ATS Score */}
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20 mb-24">
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:order-2"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-5">
                  <Target className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-black tracking-tight text-foreground md:text-4xl">
                  Beat the bots with ATS scoring
                </h3>
                <p className="mt-4 max-w-md text-base font-medium leading-relaxed text-muted-foreground">
                  75% of resumes are rejected by ATS before a human sees them. Our real-time scanner checks keywords, formatting, and structure against any job description.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {['Real-time scan', 'Job matching', 'Fix suggestions'].map(tag => (
                    <span key={tag} className="rounded-lg bg-muted/60 border border-border px-3 py-1.5 text-xs font-bold text-muted-foreground">{tag}</span>
                  ))}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="lg:order-1"
              >
                <ATSScoreVisual />
              </motion.div>
            </div>

            {/* Feature Row 3: Templates */}
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20 mb-5">
                  <Layout className="h-5 w-5 text-violet-400" />
                </div>
                <h3 className="text-2xl font-black tracking-tight text-foreground md:text-4xl">
                  60+ templates recruiters actually like
                </h3>
                <p className="mt-4 max-w-md text-base font-medium leading-relaxed text-muted-foreground">
                  Every template is ATS-tested and recruiter-approved. From minimalist to executive — pick a design that matches your industry and personality.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {['ATS-safe', 'Custom colors', 'Multi-page'].map(tag => (
                    <span key={tag} className="rounded-lg bg-muted/60 border border-border px-3 py-1.5 text-xs font-bold text-muted-foreground">{tag}</span>
                  ))}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <TemplatesVisual />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ═══ BEFORE / AFTER DEMO ════════════════════════════ */}
        <section id="demo" className="py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10 text-center"
            >
              <span className="text-[11px] font-black uppercase tracking-[0.35em] text-primary/70">See the difference</span>
              <h2 className="mt-4 text-3xl font-black tracking-tighter text-foreground md:text-5xl">
                Before & after AI optimization
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <ImageComparisonDemo />
            </motion.div>
          </div>
        </section>

        {/* ═══ ALL FEATURES GRID ══════════════════════════════ */}
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-14"
            >
              <span className="text-[11px] font-black uppercase tracking-[0.35em] text-primary/70">Everything included</span>
              <h2 className="mt-4 text-3xl font-black tracking-tighter text-foreground md:text-5xl">
                One builder. Every tool.
              </h2>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {config.showcase.features.map((feature, i) => {
                const Icon = iconMap[feature.icon] || FileText;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="group rounded-2xl border border-border bg-card/40 p-6 transition-all duration-300 hover:border-primary/40 hover:-translate-y-1"
                  >
                    <Icon className="h-6 w-6 text-muted-foreground transition-colors duration-300 group-hover:text-primary" strokeWidth={1.5} />
                    <h3 className="mt-4 text-sm font-black tracking-tight text-foreground">{feature.title}</h3>
                    <p className="mt-1.5 text-xs font-medium leading-relaxed text-muted-foreground">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ HOW IT WORKS ═══════════════════════════════════ */}
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 text-center"
            >
              <span className="text-[11px] font-black uppercase tracking-[0.35em] text-primary/70">How it works</span>
              <h2 className="mt-4 text-4xl font-black tracking-tighter text-foreground md:text-6xl">
                {config.howItWorks.title}
              </h2>
            </motion.div>

            <div className="relative">
              <div className="absolute left-[27px] top-0 bottom-0 w-px bg-border md:left-[35px]" />
              <div className="space-y-16">
                {config.howItWorks.steps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="relative flex gap-8 md:gap-12"
                  >
                    <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background text-lg font-black text-primary shadow-lg shadow-primary/10 md:h-[72px] md:w-[72px]">
                      {step.number}
                    </div>
                    <div className="pt-2">
                      <h3 className="text-xl font-black tracking-tight text-foreground md:text-2xl">{step.title}</h3>
                      <p className="mt-2 max-w-md text-base font-medium leading-relaxed text-muted-foreground">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ TESTIMONIALS ═══════════════════════════════════ */}
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-14 text-center"
            >
              <span className="text-[11px] font-black uppercase tracking-[0.35em] text-primary/70">Testimonials</span>
              <h2 className="mt-4 text-4xl font-black tracking-tighter text-foreground md:text-5xl">
                {config.testimonials.heading}
              </h2>
            </motion.div>

            {/* Featured testimonial */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mx-auto max-w-3xl rounded-3xl border border-border bg-card/50 p-8 text-center backdrop-blur-sm md:p-12"
            >
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <blockquote className="text-xl font-medium leading-relaxed text-foreground md:text-2xl">
                "{config.testimonials.items[0]?.quote}"
              </blockquote>
              <div className="mt-8 flex items-center justify-center gap-4">
                <img
                  src={config.testimonials.items[0]?.avatar}
                  alt={config.testimonials.items[0]?.name}
                  className="h-12 w-12 rounded-full border-2 border-border object-cover"
                />
                <div className="text-left">
                  <p className="text-sm font-black text-foreground">{config.testimonials.items[0]?.name}</p>
                  <p className="text-xs font-medium text-muted-foreground">
                    {config.testimonials.items[0]?.role} at {config.testimonials.items[0]?.company} · {config.testimonials.items[0]?.metric}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Stats bar */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border/40"
            >
              {config.hero.stats.map((s, i) => (
                <div key={i} className="bg-background/80 px-6 py-5 text-center">
                  <div className="text-2xl font-black text-foreground">{s.value}</div>
                  <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══ CTA ════════════════════════════════════════════ */}
        <section className="relative overflow-hidden py-28 md:py-40">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
            <span className="select-none whitespace-nowrap text-[18vw] font-black leading-none text-foreground/[0.02]">RESUME</span>
          </div>

          <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-4xl font-black leading-[0.9] tracking-tighter text-foreground md:text-7xl">
                {config.cta.headline}
              </h2>
              <p className="mx-auto mt-6 max-w-md text-lg font-medium text-muted-foreground">
                {config.cta.subtext}
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  to={ctaSectionLink}
                  className="group inline-flex items-center gap-3 rounded-xl bg-foreground px-10 py-5 text-base font-black text-background shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
                >
                  {ctaSectionText}
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                {['Free forever plan', 'No credit card', 'Export anytime'].map(p => (
                  <span key={p} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground/60">
                    <Check className="h-3.5 w-3.5 text-primary/60" />
                    {p}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
