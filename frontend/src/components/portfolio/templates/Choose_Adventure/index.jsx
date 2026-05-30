import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Code2,
  Compass,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Map,
  MapPin,
  MessageSquareQuote,
  RotateCcw,
  Send,
  Sparkles,
  Star,
  Twitter,
  UserRound,
} from 'lucide-react';

import data from '../../../../data/dummy_data.json';

const MotionSection = motion.section;

const sectionOrder = ['about', 'skills', 'projects', 'experience', 'testimonials', 'contact'];

const sectionMeta = {
  about: {
    title: 'About',
    eyebrow: 'Chapter I',
    icon: UserRound,
    prompt: 'Bio, avatar, and the personal summary behind the work.',
  },
  skills: {
    title: 'Skills',
    eyebrow: 'Chapter II',
    icon: Code2,
    prompt: 'Choose the workshop path and inspect the craft.',
  },
  projects: {
    title: 'Projects',
    eyebrow: 'Chapter III',
    icon: Sparkles,
    prompt: 'Follow the lanterns toward finished projects and links.',
  },
  experience: {
    title: 'Experience',
    eyebrow: 'Chapter IV',
    icon: BriefcaseBusiness,
    prompt: 'Read the milestones carved into the career timeline.',
  },
  testimonials: {
    title: 'Testimonials',
    eyebrow: 'Chapter V',
    icon: MessageSquareQuote,
    prompt: 'Hear client and colleague quotes from the journey.',
  },
  contact: {
    title: 'Contact',
    eyebrow: 'Final Chapter',
    icon: Mail,
    prompt: 'Open a direct route through the form and social links.',
  },
};

const choiceGraph = {
  hero: [
    { label: 'Begin with the story', next: 'about', detail: 'Meet the person and purpose first.' },
    { label: 'Scout the work', next: 'projects', detail: 'Jump straight to shipped projects.' },
    { label: 'Inspect the craft', next: 'skills', detail: 'Start with strengths and tools.' },
  ],
  about: [
    { label: 'Enter the workshop', next: 'skills', detail: 'See the skills behind the profile.' },
    { label: 'Follow the portfolio lights', next: 'projects', detail: 'View selected work and links.' },
    { label: 'Trace the career path', next: 'experience', detail: 'Review roles and impact.' },
  ],
  skills: [
    { label: 'Use these skills in the wild', next: 'projects', detail: 'Connect capabilities to outcomes.' },
    { label: 'Find where they were earned', next: 'experience', detail: 'Move from tools to timeline.' },
    { label: 'Ask for a collaboration', next: 'contact', detail: 'Start a conversation now.' },
  ],
  projects: [
    { label: 'Uncover the trail behind them', next: 'experience', detail: 'See the work history.' },
    { label: 'Listen to the reviews', next: 'testimonials', detail: 'Read social proof.' },
    { label: 'Open the message portal', next: 'contact', detail: 'Get in touch.' },
  ],
  experience: [
    { label: 'Look at the artifacts', next: 'projects', detail: 'Return to portfolio projects.' },
    { label: 'Gather campfire notes', next: 'testimonials', detail: 'Hear from collaborators.' },
    { label: 'Plan the next chapter', next: 'contact', detail: 'Reach out directly.' },
  ],
  testimonials: [
    { label: 'Visit the project gallery', next: 'projects', detail: 'Pair praise with proof.' },
    { label: 'Check the toolkit', next: 'skills', detail: 'Explore technical strengths.' },
    { label: 'Start the next quest', next: 'contact', detail: 'Send a message.' },
  ],
  contact: [
    { label: 'Reread the origin', next: 'about', detail: 'Loop back to the beginning.' },
    { label: 'Review the best work', next: 'projects', detail: 'Take one more look.' },
  ],
};

const fallbackAvatar =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop&crop=face';

const safeArray = (value) => (Array.isArray(value) ? value : []);

const getUrl = (url, fallback = '#') => {
  if (typeof url !== 'string' || !url.trim()) return fallback;
  try {
    const parsed = new URL(url.trim());
    return ['http:', 'https:', 'mailto:'].includes(parsed.protocol) ? url.trim() : fallback;
  } catch {
    return fallback;
  }
};

function Shell({ children }) {
  return (
    <main className="min-h-screen overflow-hidden bg-[#10131b] text-slate-50">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(20,184,166,0.2),transparent_30%),radial-gradient(circle_at_88%_12%,rgba(250,204,21,0.16),transparent_26%),radial-gradient(circle_at_70%_82%,rgba(244,63,94,0.18),transparent_30%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:34px_34px]" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent" />
      </div>
      {children}
    </main>
  );
}

function ChoiceButton({ choice, onSelect, index }) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(choice.next)}
      className="group flex min-h-24 w-full items-center justify-between gap-4 rounded-xl border border-white/15 bg-white/[0.07] p-4 text-left shadow-lg shadow-black/20 backdrop-blur transition hover:border-amber-200/70 hover:bg-amber-200/10"
    >
      <span>
        <span className="block text-sm font-bold text-white sm:text-base">{choice.label}</span>
        <span className="mt-1 block text-xs leading-5 text-slate-300">{choice.detail}</span>
      </span>
      <ChevronRight className="h-5 w-5 shrink-0 text-teal-200 transition group-hover:translate-x-1 group-hover:text-amber-100" />
    </motion.button>
  );
}

function AdventureMap({ active, visited, onJump, onReset }) {
  return (
    <aside className="rounded-2xl border border-white/15 bg-slate-950/60 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl lg:sticky lg:top-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-200">Path Log</p>
          <h2 className="mt-1 text-lg font-black text-white">Adventure map</h2>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-slate-300 transition hover:border-rose-200/70 hover:bg-rose-300/10 hover:text-white"
          aria-label="Restart adventure"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5 space-y-2">
        {sectionOrder.map((id, index) => {
          const meta = sectionMeta[id];
          const Icon = meta.icon;
          const wasVisited = visited.includes(id);
          const isActive = active === id;

          return (
            <button
              key={id}
              type="button"
              disabled={!wasVisited}
              onClick={() => onJump(id)}
              className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${
                isActive
                  ? 'border-amber-200/70 bg-amber-200/15 text-white'
                  : wasVisited
                    ? 'border-white/15 bg-white/[0.05] text-slate-200 hover:border-teal-200/60 hover:bg-teal-300/10'
                    : 'border-white/10 bg-slate-900/50 text-slate-500'
              }`}
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-950/70">
                {wasVisited ? <Icon className="h-4 w-4" /> : <Map className="h-4 w-4" />}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold">{meta.title}</span>
                <span className="block text-xs text-slate-400">
                  {wasVisited ? (isActive ? 'Reading now' : 'Unlocked') : `Hidden route ${index + 1}`}
                </span>
              </span>
              {wasVisited && <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-teal-200" />}
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function Hero({ personal, stats, onSelect }) {
  return (
    <section className="relative mx-auto grid min-h-screen w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
      <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-200/30 bg-teal-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-teal-100">
          <Compass className="h-4 w-4" />
          Choose Adventure Portfolio
        </div>
        <h1 className="mt-6 max-w-4xl break-words text-5xl font-black leading-[0.98] text-white sm:text-7xl lg:text-8xl">
          {personal.name || 'Portfolio'}
        </h1>
        <p className="mt-5 max-w-2xl text-xl font-semibold text-amber-100 sm:text-2xl">
          {personal.title || 'Creative professional'}
        </p>
        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
          {personal.tagline || personal.bio || 'Pick a route through the portfolio and let each choice reveal a new chapter.'}
        </p>
        {personal.location && (
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm text-slate-200">
            <MapPin className="h-4 w-4 text-rose-200" />
            {personal.location}
          </div>
        )}

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {choiceGraph.hero.map((choice, index) => (
            <ChoiceButton key={choice.next} choice={choice} index={index} onSelect={onSelect} />
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, rotate: 1 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative mx-auto w-full max-w-md"
      >
        <div className="absolute -inset-3 rounded-[2rem] border border-dashed border-amber-200/30" />
        <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.08] p-4 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <img
            src={personal.avatar || fallbackAvatar}
            alt={personal.name || 'Portfolio avatar'}
            className="aspect-[4/5] w-full rounded-[1.5rem] object-cover"
          />
          <div className="mt-4 grid grid-cols-3 gap-3">
            <Stat value={stats.yearsExperience} label="Years" />
            <Stat value={stats.projectsCompleted} label="Projects" />
            <Stat value={stats.happyClients} label="Clients" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Stat({ value, label }) {
  return (
    <div className="rounded-xl border border-white/15 bg-slate-950/55 p-3 text-center">
      <div className="text-2xl font-black text-white">{value ?? 0}+</div>
      <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</div>
    </div>
  );
}

function ChapterFrame({ active, children }) {
  const meta = sectionMeta[active];
  const Icon = meta.icon;

  return (
    <MotionSection
      key={active}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-white/15 bg-white/[0.07] p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6 lg:p-8"
    >
      <div className="mb-7 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-teal-200/40 bg-teal-300/10 text-teal-100">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-200">{meta.eyebrow}</p>
            <h2 className="mt-1 text-3xl font-black text-white sm:text-4xl">{meta.title}</h2>
          </div>
        </div>
        <p className="max-w-sm text-sm leading-6 text-slate-300">{meta.prompt}</p>
      </div>
      {children}
    </MotionSection>
  );
}

function About({ personal }) {
  return (
    <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-center">
      <img
        src={personal.avatar || fallbackAvatar}
        alt={personal.name || 'Portfolio avatar'}
        className="mx-auto aspect-square w-full max-w-xs rounded-2xl object-cover ring-1 ring-white/15 md:max-w-none"
      />
      <div>
        <p className="text-lg leading-8 text-slate-200">{personal.bio || 'A concise biography will appear here.'}</p>
        <div className="mt-6 rounded-2xl border border-amber-200/25 bg-amber-200/10 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-100">Field note</p>
          <p className="mt-2 text-xl font-black text-white">{personal.tagline || personal.title || 'Thoughtful digital work, clearly told.'}</p>
        </div>
      </div>
    </div>
  );
}

function Skills({ skills }) {
  const groupedSkills = useMemo(() => {
    return skills.reduce((acc, skill) => {
      const category = skill.category || 'Core';
      return { ...acc, [category]: [...(acc[category] || []), skill] };
    }, {});
  }, [skills]);

  if (!skills.length) return <EmptyState label="Skills" />;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {Object.entries(groupedSkills).map(([category, items]) => (
        <div key={category} className="rounded-2xl border border-white/12 bg-slate-950/45 p-5">
          <h3 className="flex items-center gap-2 text-xl font-black text-white">
            <Star className="h-5 w-5 text-amber-200" />
            {category}
          </h3>
          <div className="mt-5 space-y-4">
            {items.map((skill) => (
              <div key={`${category}-${skill.name}`}>
                <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                  <span className="font-bold text-slate-100">{skill.name}</span>
                  <span className="text-teal-100">{skill.level ?? 0}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-800">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-teal-300 via-amber-200 to-rose-300"
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level ?? 0}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Projects({ projects }) {
  if (!projects.length) return <EmptyState label="Projects" />;

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      {projects.map((project, index) => (
        <motion.article
          key={`${project.title}-${index}`}
          whileHover={{ y: -5 }}
          className="group overflow-hidden rounded-2xl border border-white/12 bg-slate-950/50"
        >
          <div className="relative aspect-video overflow-hidden bg-slate-900">
            {project.image && (
              <img
                src={project.image}
                alt={project.title || `Project ${index + 1}`}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />
          </div>
          <div className="p-5">
            <h3 className="text-2xl font-black text-white">{project.title || 'Untitled project'}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">{project.description || 'Project description coming soon.'}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {safeArray(project.techStack).map((tech) => (
                <span key={tech} className="rounded-full border border-teal-200/25 bg-teal-300/10 px-3 py-1 text-xs font-bold text-teal-100">
                  {tech}
                </span>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              {project.liveUrl && (
                <a href={getUrl(project.liveUrl)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-white">
                  Live <ExternalLink className="h-4 w-4" />
                </a>
              )}
              {project.githubUrl && (
                <a href={getUrl(project.githubUrl)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-black text-white transition hover:border-teal-200 hover:bg-teal-300/10">
                  Code <Github className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

function Experience({ experience }) {
  if (!experience.length) return <EmptyState label="Experience" />;

  return (
    <div className="relative space-y-4">
      <div className="absolute bottom-6 left-5 top-6 hidden w-px bg-gradient-to-b from-teal-200 via-amber-200 to-rose-200 sm:block" />
      {experience.map((item, index) => (
        <article key={`${item.company}-${item.role}-${index}`} className="relative rounded-2xl border border-white/12 bg-slate-950/50 p-5 sm:ml-12">
          <span className="absolute -left-[3.18rem] top-6 hidden h-5 w-5 rounded-full border-4 border-slate-950 bg-amber-200 sm:block" />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-xl font-black text-white">{item.role || 'Role'}</h3>
              <p className="font-bold text-teal-100">{item.company || 'Company'}</p>
            </div>
            <span className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-300">
              {item.period || 'Period'}
            </span>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-300">{item.description || 'Experience details coming soon.'}</p>
        </article>
      ))}
    </div>
  );
}

function Testimonials({ testimonials }) {
  if (!testimonials.length) return <EmptyState label="Testimonials" />;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {testimonials.map((testimonial, index) => (
        <motion.figure
          key={`${testimonial.name}-${index}`}
          whileHover={{ y: -4 }}
          className="rounded-2xl border border-white/12 bg-slate-950/50 p-5"
        >
          <blockquote className="text-base leading-7 text-slate-200">"{testimonial.text || 'No testimonial text available.'}"</blockquote>
          <figcaption className="mt-5 flex items-center gap-3">
            <img
              src={testimonial.avatar || fallbackAvatar}
              alt={testimonial.name || 'Testimonial avatar'}
              className="h-12 w-12 rounded-xl object-cover"
            />
            <div>
              <p className="font-black text-white">{testimonial.name || 'Anonymous'}</p>
              <p className="text-sm text-amber-100">{testimonial.role || 'Collaborator'}</p>
            </div>
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}

function Contact({ personal, socials }) {
  const [sent, setSent] = useState(false);
  const links = [
    { label: 'Email', href: getUrl(socials.email ? `mailto:${socials.email}` : ''), value: socials.email, icon: Mail },
    { label: 'GitHub', href: getUrl(socials.github), value: socials.github, icon: Github },
    { label: 'LinkedIn', href: getUrl(socials.linkedin), value: socials.linkedin, icon: Linkedin },
    { label: 'Twitter', href: getUrl(socials.twitter), value: socials.twitter, icon: Twitter },
  ].filter((link) => link.value);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="rounded-2xl border border-rose-200/25 bg-rose-300/10 p-6">
        <Send className="h-10 w-10 text-rose-100" />
        <h3 className="mt-4 text-3xl font-black text-white">Ready for the next chapter?</h3>
        <p className="mt-3 leading-7 text-slate-300">
          Reach out to {personal.name || 'this portfolio owner'} through the form or one of the direct links.
        </p>
        <div className="mt-5 grid gap-3">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.label === 'Email' ? undefined : '_blank'}
              rel={link.label === 'Email' ? undefined : 'noreferrer'}
              className="group flex items-center justify-between rounded-xl border border-white/15 bg-slate-950/45 p-3 font-bold text-white transition hover:border-teal-200/70 hover:bg-teal-300/10"
            >
              <span className="flex items-center gap-3">
                <link.icon className="h-4 w-4 text-teal-100" />
                {link.label}
              </span>
              <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-white" />
            </a>
          ))}
        </div>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSent(true);
        }}
        className="rounded-2xl border border-white/12 bg-slate-950/50 p-5"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-bold text-slate-200">
            Name
            <input className="mt-2 w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-amber-200" placeholder="Your name" />
          </label>
          <label className="text-sm font-bold text-slate-200">
            Email
            <input type="email" className="mt-2 w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-amber-200" placeholder="you@example.com" />
          </label>
        </div>
        <label className="mt-4 block text-sm font-bold text-slate-200">
          Message
          <textarea className="mt-2 min-h-32 w-full resize-y rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-amber-200" placeholder="Tell me about the project..." />
        </label>
        <button type="submit" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-100 px-5 py-3 font-black text-slate-950 transition hover:bg-white sm:w-auto">
          Send message <Send className="h-4 w-4" />
        </button>
        {sent && <p className="mt-3 text-sm font-bold text-teal-100">Message staged. Connect this form to your backend to send it live.</p>}
      </form>
    </div>
  );
}

function EmptyState({ label }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/45 p-6 text-slate-400">
      {label} will appear here when portfolio data is available.
    </div>
  );
}

export default function ChooseAdventurePortfolio() {
  const portfolio = data || {};
  const personal = portfolio.personal || {};
  const socials = portfolio.socials || {};
  const stats = portfolio.stats || {};
  const skills = safeArray(portfolio.skills);
  const projects = safeArray(portfolio.projects);
  const experience = safeArray(portfolio.experience);
  const testimonials = safeArray(portfolio.testimonials);

  const [active, setActive] = useState('hero');
  const [visited, setVisited] = useState([]);

  const choosePath = (next) => {
    if (!sectionMeta[next]) return;
    setActive(next);
    setVisited((current) => (current.includes(next) ? current : [...current, next]));
  };

  const resetAdventure = () => {
    setActive('hero');
    setVisited([]);
  };

  const renderChapter = () => {
    switch (active) {
      case 'about':
        return <About personal={personal} />;
      case 'skills':
        return <Skills skills={skills} />;
      case 'projects':
        return <Projects projects={projects} />;
      case 'experience':
        return <Experience experience={experience} />;
      case 'testimonials':
        return <Testimonials testimonials={testimonials} />;
      case 'contact':
        return <Contact personal={personal} socials={socials} />;
      default:
        return null;
    }
  };

  if (active === 'hero') {
    return (
      <Shell>
        <Hero personal={personal} stats={stats} onSelect={choosePath} />
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="relative mx-auto grid w-full max-w-7xl gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:px-8">
        <AdventureMap active={active} visited={visited} onJump={choosePath} onReset={resetAdventure} />

        <div className="min-w-0 space-y-5">
          <AnimatePresence mode="wait">
            <ChapterFrame active={active}>{renderChapter()}</ChapterFrame>
          </AnimatePresence>

          <section className="rounded-2xl border border-white/15 bg-slate-950/55 p-4 shadow-xl shadow-black/20 backdrop-blur">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-100">Choose your next route</p>
                <h3 className="mt-1 text-2xl font-black text-white">Where should the story go now?</h3>
              </div>
              <p className="text-sm text-slate-400">{visited.length} of {sectionOrder.length} chapters discovered</p>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {choiceGraph[active].map((choice, index) => (
                <ChoiceButton key={`${active}-${choice.next}`} choice={choice} index={index} onSelect={choosePath} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </Shell>
  );
}
