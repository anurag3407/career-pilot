import React from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Github,
  Gauge,
  History,
  Lightbulb,
  Mail,
  MonitorSmartphone,
  MousePointerClick,
  Sparkles,
  Keyboard,
  Linkedin,
  Target,
  TimerReset,
  Trophy,
  TrendingUp,
  Users,
  MessageSquareQuote,
  Layers3,
} from 'lucide-react';
import { motion } from 'framer-motion';

const SECTION_IDS = {
  overview: 'overview',
  features: 'features',
  stats: 'stats',
  stack: 'stack',
  gallery: 'gallery',
  learnings: 'learnings',
  contact: 'contact',
};

const joinClasses = (...classes) => classes.filter(Boolean).join(' ');

function pickText(value, fallback) {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function pickArray(value, fallback = []) {
  return Array.isArray(value) && value.length ? value : fallback;
}

function toTechList(project) {
  const stack = project?.techStack || project?.technologies || project?.tech || [];
  return Array.isArray(stack) ? stack.filter(Boolean) : [stack].filter(Boolean);
}

function SectionHeading({ kicker, title, description, align = 'left' }) {
  return (
    <div className={joinClasses('max-w-3xl', align === 'center' && 'mx-auto text-center')}>
      <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-cyan-200">
        <Sparkles size={12} />
        {kicker}
      </div>
      <h2 className="mt-4 text-3xl font-black tracking-tight text-white md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className={joinClasses('mt-4 text-sm leading-7 text-slate-300 md:text-base', align === 'center' && 'mx-auto max-w-2xl')}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, hint, accent = 'cyan' }) {
  const accents = {
    cyan: 'from-cyan-400/18 to-cyan-500/6 border-cyan-400/20 text-cyan-100',
    amber: 'from-amber-400/18 to-amber-500/6 border-amber-400/20 text-amber-100',
    emerald: 'from-emerald-400/18 to-emerald-500/6 border-emerald-400/20 text-emerald-100',
    violet: 'from-violet-400/18 to-violet-500/6 border-violet-400/20 text-violet-100',
  };

  return (
    <div className={joinClasses(
      'rounded-3xl border bg-gradient-to-br p-5 shadow-[0_18px_60px_rgba(2,6,23,0.45)] backdrop-blur-xl',
      accents[accent] || accents.cyan
    )}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55">{label}</p>
          <div className="mt-2 text-3xl font-black text-white">{value}</div>
          {hint ? <p className="mt-2 text-sm leading-6 text-white/68">{hint}</p> : null}
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white/90">
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="group rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_18px_50px_rgba(2,6,23,0.35)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 hover:border-cyan-400/30">
      <div className="flex items-center justify-between">
        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-200">
          <Icon size={18} />
        </div>
        <ChevronRight size={16} className="text-white/30 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
      <h3 className="mt-5 text-lg font-bold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
    </div>
  );
}

function GalleryCard({ project, index }) {
  const techList = toTechList(project).slice(0, 4);
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="group overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/70 shadow-[0_18px_60px_rgba(2,6,23,0.45)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
        <img
          src={project?.image || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=750&fit=crop`}
          alt={project?.title || 'Project screenshot'}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />
        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/80 backdrop-blur">
          <MonitorSmartphone size={12} />
          Preview {String(index + 1).padStart(2, '0')}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-white">{project?.title || 'Untitled Project'}</h3>
          <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-200">
            Live
          </div>
        </div>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          {project?.description || 'A project built with a performance-first mindset and a clean user experience.'}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {techList.length ? techList.map((item) => (
            <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-slate-200">
              {item}
            </span>
          )) : (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-slate-200">
              UI / UX
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function TimelineItem({ title, meta, description, icon: Icon, progress }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-200">
          <Icon size={16} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold text-white">{title}</h3>
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/80">{meta}</span>
          </div>
          <p className="mt-2 text-sm leading-7 text-slate-300">{description}</p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TypingSpeedTestTracker() {
  const { portfolioData: data } = usePortfolio();

  const personal = data?.personal || {};
  const socials = data?.socials || {};
  const stats = data?.stats || {};
  const skills = pickArray(data?.skills);
  const projects = pickArray(data?.projects);
  const experience = pickArray(data?.experience);
  const testimonials = pickArray(data?.testimonials);

  const title = pickText(personal.title, 'Typing Speed Test Tracker');
  const tagline = pickText(personal.tagline, personal.bio || 'Track keystrokes, spot patterns, and improve every session.');
  const overview = pickText(
    personal.bio,
    'A focused typing tracker that brings WPM, accuracy, history, and performance analytics into one calm dashboard.'
  );
  const projectName = pickText(projects?.[0]?.title, 'Typing Speed Test Tracker');
  const featuredProject = projects[0] || {
    title: projectName,
    description: overview,
    image: '',
    techStack: ['React', 'Analytics', 'Motion UI', 'Dashboard'],
  };

  const derivedWpm = Math.max(42, Math.round(58 + (Number(stats.projectsCompleted) || 0) * 0.45 + skills.length * 0.35));
  const derivedAccuracy = Math.min(99, Math.round(91 + (Number(stats.yearsExperience) || 0) * 1.3 + (testimonials.length > 2 ? 1 : 0)));
  const derivedSessions = Math.max(12, (projects.length * 6) + (experience.length * 4) + 8);
  const derivedFocusScore = Math.min(100, 60 + skills.length * 2 + testimonials.length);

  const featureItems = [
    {
      icon: Keyboard,
      title: 'WPM tracking',
      description: 'Live speed monitoring with a keyboard-first interface that highlights pacing, bursts, and consistency.',
    },
    {
      icon: Target,
      title: 'Accuracy tracking',
      description: 'Precision-focused feedback that keeps errors visible, so users can improve without losing rhythm.',
    },
    {
      icon: History,
      title: 'Progress history',
      description: 'Session history and recent milestones pulled from the portfolio context to show growth over time.',
    },
    {
      icon: BarChart3,
      title: 'Performance analytics',
      description: 'Analytics panels translate project data into a polished dashboard of momentum, depth, and momentum trends.',
    },
  ];

  const galleryProjects = projects.slice(0, 3);
  const techStack = [
    ...skills.slice(0, 6).map((skill) => skill?.name).filter(Boolean),
    ...toTechList(featuredProject),
  ].slice(0, 8);

  const challengeCards = [
    {
      icon: TimerReset,
      title: 'Timing without distraction',
      meta: personal.location || 'Focus mode',
      description: overview,
      progress: 72,
    },
    {
      icon: Gauge,
      title: 'Balancing speed and precision',
      meta: `WPM ${derivedWpm}`,
      description: experience[0]?.description || 'Fast input should still feel calm, accurate, and easy to interpret at a glance.',
      progress: 84,
    },
    {
      icon: Lightbulb,
      title: 'Turning feedback into habits',
      meta: testimonials[0]?.role || 'Learning loop',
      description: testimonials[0]?.text || 'The most useful tracker is the one that helps the user understand where to improve next.',
      progress: 64,
    },
  ];

  const emailHref = socials.email ? `mailto:${socials.email}` : '#contact';
  const primaryLink = socials.github || socials.website || '#gallery';
  const secondaryLink = socials.linkedin || socials.twitter || '#overview';

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white selection:bg-cyan-300/30 selection:text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(139,92,246,0.18),_transparent_24%),linear-gradient(180deg,_rgba(255,255,255,0.03),_transparent_26%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.05)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />

      <header className="sticky top-0 z-30 border-b border-white/8 bg-slate-950/70 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <button onClick={() => scrollTo('hero')} className="flex items-center gap-3 text-left">
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-200 shadow-[0_0_40px_rgba(34,211,238,0.18)]">
              <Keyboard size={18} />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/70">Portfolio Template</div>
              <div className="text-sm font-bold text-white">{projectName}</div>
            </div>
          </button>

          <nav className="hidden items-center gap-1 lg:flex">
            {Object.entries(SECTION_IDS).map(([label, id]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/60 transition hover:bg-white/6 hover:text-white"
              >
                {label}
              </button>
            ))}
          </nav>

          <button
            onClick={() => scrollTo('contact')}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-300 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-slate-950 transition hover:scale-[1.02]"
          >
            Hire / Contact
            <ArrowRight size={14} />
          </button>
        </div>
      </header>

      <main className="relative z-10">
        <section id="hero" className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pb-24 lg:pt-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-emerald-200">
              <Clock3 size={12} />
              Typing themed showcase
            </div>

            <h1 className="mt-6 text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
              {projectName}
              <span className="mt-3 block bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-300 bg-clip-text text-transparent">
                {title}
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              {tagline}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => scrollTo('gallery')}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.2em] text-slate-950 transition hover:translate-y-[-1px]"
              >
                View Screenshots
                <ChevronRight size={15} />
              </button>
              <a
                href={primaryLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:border-cyan-300/30 hover:bg-cyan-300/10"
              >
                Project Link
                <ArrowRight size={15} />
              </a>
              <button
                onClick={() => scrollTo('overview')}
                className="inline-flex items-center gap-2 rounded-full border border-white/12 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/75 transition hover:bg-white/6 hover:text-white"
              >
                Learn More
              </button>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <MetricCard
                icon={Keyboard}
                label="Avg WPM"
                value={derivedWpm}
                hint="Sustained typing speed from recent project activity."
                accent="cyan"
              />
              <MetricCard
                icon={CheckCircle2}
                label="Accuracy"
                value={`${derivedAccuracy}%`}
                hint="Accuracy-focused workflow for clean typing sessions."
                accent="emerald"
              />
              <MetricCard
                icon={TrendingUp}
                label="Focus score"
                value={derivedFocusScore}
                hint="A blended signal from experience, skills, and portfolio depth."
                accent="violet"
              />
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -left-8 top-10 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute -right-8 bottom-0 h-44 w-44 rounded-full bg-violet-400/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/85 p-5 shadow-[0_24px_80px_rgba(2,6,23,0.6)] backdrop-blur-2xl">
              <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">Live tracker</div>
                  <div className="mt-1 text-sm font-bold text-white">Typing session monitor</div>
                </div>
                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-emerald-200">
                  Active
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(34,211,238,0.18),rgba(15,23,42,0.96))] p-5">
                  <div className="flex items-center justify-between text-white/65">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.28em]">Speed</span>
                    <Gauge size={14} />
                  </div>
                  <div className="mt-4 text-5xl font-black text-white">{derivedWpm}</div>
                  <p className="mt-2 text-sm text-white/60">Words per minute</p>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between text-white/65">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.28em]">Accuracy</span>
                    <Target size={14} />
                  </div>
                  <div className="mt-4 text-5xl font-black text-white">{derivedAccuracy}%</div>
                  <p className="mt-2 text-sm text-white/60">Precision across sessions</p>
                </div>
              </div>

              <div className="mt-5 rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">
                  <span>Typing flow</span>
                  <span>{derivedSessions} sessions</span>
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    { label: 'Warm-up', value: 72 },
                    { label: 'Sprint', value: 86 },
                    { label: 'Review', value: 64 },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="mb-2 flex items-center justify-between text-sm text-white/70">
                        <span>{item.label}</span>
                        <span>{item.value}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400"
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { label: 'WPM', value: derivedWpm },
                  { label: 'Acc', value: `${derivedAccuracy}%` },
                  { label: 'Streak', value: `${Math.max(3, experience.length)}d` },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4 text-center">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">{item.label}</div>
                    <div className="mt-2 text-xl font-black text-white">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-3xl border border-cyan-400/15 bg-cyan-400/6 p-5">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-200/80">
                  <MousePointerClick size={13} />
                  Session snapshot
                </div>
                <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/90 p-4 font-mono text-sm leading-7 text-cyan-100/90">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-300">$</span>
                    <span>typing-tracker --session</span>
                    <span className="inline-block h-5 w-2 animate-pulse rounded-sm bg-cyan-300" />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-slate-300">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="text-white/45">Current run</div>
                      <div className="mt-1 text-base font-bold text-white">{derivedWpm} WPM</div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="text-white/45">Success rate</div>
                      <div className="mt-1 text-base font-bold text-white">{derivedAccuracy}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        </section>

        <section id={SECTION_IDS.overview} className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            kicker="Project overview"
            title="A calm dashboard for focused typing practice"
            description={overview}
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[30px] border border-white/10 bg-white/5 p-7 backdrop-blur-xl">
              <div className="flex items-center gap-3 text-cyan-200">
                <MonitorSmartphone size={18} />
                <span className="text-xs font-semibold uppercase tracking-[0.3em]">Overview</span>
              </div>
              <p className="mt-5 text-base leading-8 text-slate-200">
                {pickText(
                  featuredProject?.description,
                  'The interface organizes typing performance into readable blocks so speed, accuracy, and progress never feel overwhelming.'
                )}
              </p>
              <div className="mt-7 grid gap-4 sm:grid-cols-3">
                {[
                  ['Speed first', 'Live WPM feedback keeps users informed while they type.'],
                  ['Accuracy aware', 'Error visibility helps users understand quality, not just speed.'],
                  ['Progressive habits', 'History and analytics turn practice into a repeatable routine.'],
                ].map(([titleText, body]) => (
                  <div key={titleText} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                    <div className="text-sm font-bold text-white">{titleText}</div>
                    <p className="mt-2 text-sm leading-7 text-slate-300">{body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-slate-950/80 p-7">
              <div className="flex items-center gap-3 text-cyan-200">
                <Layers3 size={18} />
                <span className="text-xs font-semibold uppercase tracking-[0.3em]">Project stack</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {techStack.length ? techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-medium text-slate-100"
                  >
                    {tech}
                  </span>
                )) : (
                  <span className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-medium text-slate-100">
                    Frontend
                  </span>
                )}
              </div>

              <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/45">Focused build</div>
                    <div className="mt-1 text-xl font-black text-white">{projectName}</div>
                  </div>
                  <Trophy size={18} className="text-amber-200" />
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Built as a showcase template with a typing-first visual language and responsive data cards that scale from desktop to mobile.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id={SECTION_IDS.features} className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            kicker="Features"
            title="Everything the tracker needs, wrapped in a polished UI"
            description="Each feature block is designed as a readable card so the experience feels like a product showcase, not a plain dashboard."
            align="center"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featureItems.map((item) => (
              <FeatureCard key={item.title} {...item} />
            ))}
          </div>
        </section>

        <section id={SECTION_IDS.stats} className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            kicker="Statistics"
            title="Typing analytics at a glance"
            description="The metrics blend shared portfolio context with tracker-specific insight so the layout feels grounded and still purpose-built."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              icon={Keyboard}
              label="Average WPM"
              value={derivedWpm}
              hint="Steady typing speed for calm practice sessions."
              accent="cyan"
            />
            <MetricCard
              icon={CheckCircle2}
              label="Accuracy"
              value={`${derivedAccuracy}%`}
              hint="Mistakes are tracked without interrupting flow."
              accent="emerald"
            />
            <MetricCard
              icon={History}
              label="Sessions tracked"
              value={derivedSessions}
              hint="A running history of completed practice runs."
              accent="amber"
            />
            <MetricCard
              icon={Users}
              label="Portfolio depth"
              value={projects.length}
              hint="Connected work samples and project history."
              accent="violet"
            />
          </div>
        </section>

        <section id={SECTION_IDS.stack} className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            kicker="Technology stack"
            title="Built from the same portfolio context the rest of the builder uses"
            description="Skills and project tech are surfaced directly from the shared data model, keeping the template consistent with the rest of the portfolio system."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[30px] border border-white/10 bg-white/5 p-7">
              <div className="text-sm font-semibold uppercase tracking-[0.26em] text-cyan-200/70">Skills</div>
              <div className="mt-5 flex flex-wrap gap-2">
                {skills.slice(0, 12).map((skill) => (
                  <span key={skill.name} className="rounded-full border border-white/10 bg-slate-950/80 px-4 py-2 text-sm text-slate-100">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-slate-950/80 p-7">
              <div className="text-sm font-semibold uppercase tracking-[0.26em] text-cyan-200/70">Featured project tech</div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {toTechList(featuredProject).length ? toTechList(featuredProject).map((tech) => (
                  <div key={tech} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100">
                    {tech}
                  </div>
                )) : (
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100">
                    React + Motion UI
                  </div>
                )}
              </div>
              <div className="mt-6 rounded-3xl border border-cyan-400/15 bg-cyan-400/6 p-5 text-sm leading-7 text-slate-200">
                Reused data from the shared context keeps the template editable, future-proof, and free from hardcoded portfolio content.
              </div>
            </div>
          </div>
        </section>

        <section id={SECTION_IDS.gallery} className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            kicker="Screenshots"
            title="Gallery and history in one scrollable story"
            description="The gallery reuses project images from the portfolio context so the template previews the actual work instead of placeholder mockups."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {galleryProjects.length ? galleryProjects.map((project, index) => (
              <GalleryCard key={`${project.title || 'project'}-${index}`} project={project} index={index} />
            )) : (
              <GalleryCard project={featuredProject} index={0} />
            )}
          </div>
        </section>

        <section id={SECTION_IDS.learnings} className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <SectionHeading
            kicker="Challenges & learnings"
            title="How the tracker turns progress into motivation"
            description="The challenge section frames the product thinking behind the template while still drawing its narrative from the shared portfolio context."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {challengeCards.map((item) => (
              <TimelineItem key={item.title} {...item} />
            ))}
          </div>
        </section>

        <section id={SECTION_IDS.contact} className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
          <div className="overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(135deg,rgba(8,15,40,0.95),rgba(15,23,42,0.85))] p-8 shadow-[0_30px_100px_rgba(2,6,23,0.55)] sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-cyan-200">
                  <Mail size={12} />
                  Contact
                </div>
                <h2 className="mt-5 text-3xl font-black tracking-tight text-white md:text-5xl">
                  Ready to build a sharper typing experience?
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
                  Whether this template is used as a project showcase or adapted into a live app, the final call to action stays rooted in the portfolio context and keeps the experience simple to contact from any device.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href={emailHref}
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-slate-950 transition hover:scale-[1.02]"
                  >
                    Email Now
                    <ArrowRight size={15} />
                  </a>
                  {socials.github ? (
                    <a
                      href={socials.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
                    >
                      <Github size={15} />
                      GitHub
                    </a>
                  ) : null}
                  {socials.linkedin ? (
                    <a
                      href={socials.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
                    >
                      <Linkedin size={15} />
                      LinkedIn
                    </a>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">Contact route</div>
                  <div className="mt-2 text-lg font-bold text-white">{pickText(personal.name, 'Portfolio owner')}</div>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {pickText(personal.bio, 'A quick way to reach the portfolio owner about the tracker or the wider design system.')}
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">Location</div>
                    <div className="mt-2 text-lg font-bold text-white">{pickText(personal.location, 'Remote')}</div>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">Experience</div>
                    <div className="mt-2 text-lg font-bold text-white">{Number(stats.yearsExperience) || 0}+ years</div>
                  </div>
                </div>
                <div className="rounded-3xl border border-cyan-400/15 bg-cyan-400/6 p-5">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-200/80">
                    <MessageSquareQuote size={13} />
                    Footer note
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-200">
                    {pickText(
                      testimonials[0]?.text,
                      'A strong portfolio template should feel fast, readable, and easy to personalize without touching the structure.'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
