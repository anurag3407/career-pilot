import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState, useEffect } from 'react';
import { motion, animate } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, MapPin, Mail, Github, Linkedin, Twitter,
  ExternalLink, Quote, TrendingUp, Presentation, Rocket
} from 'lucide-react';

/**
 * Startup Pitch Portfolio Template
 * Category: Professional / Industry
 * Description: Pitch deck presentation style with slide-by-slide layout. Each section is a presentation slide with Problem, Solution, Demo, Team, Contact flow.
 */

const ACCENT = '#a3e635'; // single lime accent on dark deck slides

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
const slideIn = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } }
};
const fadeUp = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

const initials = (name) =>
  (name || '').trim().split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || '?';

const statNumber = (v) => (typeof v === 'number' && isFinite(v) ? v : null);

// Giant counting number for the traction slide
function StatCounter({ value, suffix = '', className = '' }) {
  const [started, setStarted] = useState(false);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!started) return;
    const controls = animate(0, value, { duration: 1.3, ease: 'easeOut', onUpdate: (v) => setN(Math.round(v)) });
    return () => controls.stop();
  }, [started, value]);
  return (
    <motion.span className={className} viewport={{ once: false, amount: 0.5 }} onViewportEnter={() => setStarted(true)}>
      {n}{suffix}
    </motion.span>
  );
}

// Slide shell — all slides stay mounted (ids stay anchorable); inactive ones are display:none
function SlideShell({ def, active, children }) {
  return (
    <div id={def.id} aria-hidden={!active}
      className={`absolute inset-0 flex items-center justify-center overflow-hidden px-6 md:px-16 pt-20 pb-24 ${active ? '' : 'hidden'}`}
      style={{ background: def.alt ? '#0d1019' : '#0b0e14' }}>
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.15 }} variants={stagger}
        className="w-full max-w-5xl">
        <motion.p variants={fadeUp} className="text-[10px] md:text-[11px] font-bold tracking-[0.4em] uppercase mb-4" style={{ color: ACCENT }}>
          {def.no} · {def.label}
        </motion.p>
        {children}
      </motion.div>
    </div>
  );
}

const SlideTitle = ({ children }) => (
  <motion.h2 variants={slideIn} className="text-4xl md:text-6xl font-black tracking-tight text-white leading-none mb-8 md:mb-10">
    {children}
  </motion.h2>
);

// ---------------- Slide 1: Cover ----------------
function CoverSlide({ data, nav }) {
  const ctaDefs = [
    { id: 'about', label: 'Skip to the Problem' },
    { id: 'projects', label: 'See the Demo' },
    { id: 'contact', label: 'Jump to the Ask' },
  ];
  const ctas = nav ? ctaDefs.filter((c) => nav.ids.includes(c.id)) : [];
  return (
    <div className="text-center md:text-left">
      <motion.div variants={fadeUp}>
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-bold tracking-[0.3em] uppercase"
          style={{ borderColor: `${ACCENT}55`, color: ACCENT, background: 'rgba(163,230,53,0.07)' }}>
          <Presentation size={13} /> Series {new Date().getFullYear()} · Founder Edition
        </span>
      </motion.div>
      <motion.h1 variants={slideIn} className="mt-8 text-6xl md:text-8xl font-black tracking-tight text-white leading-[0.95] mb-5">
        {data.personal.name || 'The Pitch'}
      </motion.h1>
      {data.personal.title && (
        <motion.p variants={fadeUp} className="text-xl md:text-3xl font-bold mb-3" style={{ color: ACCENT }}>
          {data.personal.title}
        </motion.p>
      )}
      {data.personal.tagline && <motion.p variants={fadeUp} className="text-slate-400 md:text-lg mb-3 max-w-xl">{data.personal.tagline}</motion.p>}
      {data.personal.location && (
        <motion.p variants={fadeUp} className="text-slate-500 text-sm flex items-center gap-1.5 mb-10 justify-center md:justify-start">
          <MapPin size={14} /> {data.personal.location}
        </motion.p>
      )}
      <motion.div variants={fadeUp} className="flex flex-wrap gap-3 justify-center md:justify-start">
        {ctas.map((c) => (
          <a key={c.id} href={`#${c.id}`}
            onClick={(e) => { e.preventDefault(); if (nav) nav.goToId(c.id); }}
            className="px-6 py-3 rounded-lg font-bold text-sm tracking-wide text-black transition-transform hover:-translate-y-0.5"
            style={{ background: ACCENT, boxShadow: '0 10px 30px rgba(163,230,53,0.18)' }}>
            {c.label}
          </a>
        ))}
      </motion.div>
      <motion.p variants={fadeUp} className="mt-12 text-[10px] tracking-[0.35em] uppercase text-slate-600 flex items-center gap-2 justify-center md:justify-start">
        Press <ChevronRight size={12} className="text-slate-500" /> or use the arrows to advance the deck
      </motion.p>
    </div>
  );
}

// ---------------- Slide 2: The Problem (about) ----------------
function ProblemSlide({ data }) {
  return (
    <div className="grid md:grid-cols-[auto_1fr] gap-10 md:gap-14 items-center">
      <motion.div variants={slideIn} className="mx-auto">
        <div className="relative">
          <div className="absolute -inset-3 rounded-2xl border" style={{ borderColor: `${ACCENT}33`, transform: 'rotate(-2deg)' }} aria-hidden="true" />
          {data.personal.avatar
            ? <img src={data.personal.avatar} alt={data.personal.name || 'Portrait'} className="relative w-52 h-52 md:w-60 md:h-60 object-cover rounded-2xl border border-white/15" />
            : <div className="relative w-52 h-52 md:w-60 md:h-60 rounded-2xl border border-white/15 bg-white/[0.04] flex items-center justify-center text-6xl font-black tracking-widest text-slate-600">
                {initials(data.personal.name)}
              </div>}
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[9px] font-bold tracking-[0.25em] uppercase whitespace-nowrap text-black" style={{ background: ACCENT }}>
            The Founder
          </span>
        </div>
      </motion.div>
      <motion.div variants={slideIn}>
        <SlideTitle>The Problem.</SlideTitle>
        {data.personal.bio && <p className="text-slate-300 leading-relaxed md:text-xl mb-6 max-w-2xl">{data.personal.bio}</p>}
        <motion.p variants={fadeUp} className="text-slate-500 text-sm italic max-w-xl">
          Most teams never meet the one person who can fix it — until now.
        </motion.p>
      </motion.div>
    </div>
  );
}

// ---------------- Slide 3: The Solution (skills) ----------------
function SolutionSlide({ data }) {
  const categories = [...new Set(data.skills.map((s) => s.category || 'Core'))];
  return (
    <div>
      <SlideTitle>The Solution.</SlideTitle>
      <motion.div variants={stagger}>
        {categories.map((cat, ci) => (
          <motion.div key={cat} variants={slideIn} className="mb-7 last:mb-0">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-slate-400">{cat}</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="grid md:grid-cols-2 gap-x-10 gap-y-5">
              {data.skills.filter((s) => (s.category || 'Core') === cat).map((skill, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="font-semibold text-white/90">{skill.name}</span>
                    <span className="text-xs font-black" style={{ color: ACCENT }}>{skill.level || 85}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/[0.08] overflow-hidden">
                    <motion.div className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, #3f6212, ${ACCENT})` }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level || 85}%` }}
                      viewport={{ once: false }}
                      transition={{ duration: 1, delay: ci * 0.08 + i * 0.05, ease: 'easeOut' }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// ---------------- Slide 4: Demo (projects) ----------------
function DemoSlide({ data }) {
  const shown = data.projects.slice(0, 4);
  return (
    <div>
      <SlideTitle>Live Demo.</SlideTitle>
      <motion.div variants={stagger} className="grid sm:grid-cols-2 gap-6">
        {shown.map((project, i) => (
          <motion.article key={i} variants={slideIn}
            className="group rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden hover:border-white/25 transition-colors">
            <div className="relative h-40 overflow-hidden border-b border-white/10" style={{ background: 'rgba(255,255,255,0.05)' }}>
              {project.image
                ? <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                : <div className="w-full h-full flex items-center justify-center text-white/20 group-hover:text-white/40 transition-colors"><Rocket size={36} /></div>}
              <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[9px] font-black tracking-[0.25em] uppercase bg-black/70 border border-white/15 text-slate-300">
                DEMO {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-white text-lg mb-1.5">{project.title}</h3>
              {project.description && <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-3">{project.description}</p>}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {(project.techStack || []).slice(0, 5).map((tech, j) => (
                  <span key={j} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/[0.07] border border-white/10 text-slate-300">{tech}</span>
                ))}
              </div>
              <div className="flex gap-4">
                {project.liveUrl && project.liveUrl !== '#' && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase" style={{ color: ACCENT }}>
                    <ExternalLink size={12} /> Launch
                  </a>
                )}
                {project.githubUrl && project.githubUrl !== '#' && (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-slate-500 hover:text-slate-300 transition-colors">
                    <Github size={12} /> Repo
                  </a>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
      {data.projects.length > shown.length && (
        <motion.p variants={fadeUp} className="mt-5 text-xs tracking-[0.25em] uppercase text-slate-500">
          + {data.projects.length - shown.length} more in the data room
        </motion.p>
      )}
    </div>
  );
}

// ---------------- Slide 5: Traction (stats) ----------------
function TractionSlide({ data }) {
  const stats = [
    { label: 'Years Experience', value: statNumber(data.stats?.yearsExperience), suffix: '+' },
    { label: 'Projects Completed', value: statNumber(data.stats?.projectsCompleted), suffix: '+' },
    { label: 'Happy Clients', value: statNumber(data.stats?.happyClients), suffix: '+' },
  ].filter((s) => s.value !== null);
  return (
    <div>
      <SlideTitle>Traction.</SlideTitle>
      <motion.div variants={stagger} className="grid sm:grid-cols-3 gap-6 max-w-3xl">
        {stats.map((s, i) => (
          <motion.div key={i} variants={slideIn} className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 text-center">
            <StatCounter value={s.value} suffix={s.suffix} className="block text-5xl md:text-6xl font-black" />
            <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-slate-400 mt-3">{s.label}</div>
          </motion.div>
        ))}
      </motion.div>
      <motion.div variants={fadeUp} className="mt-8 flex items-center gap-2 text-slate-500 text-xs tracking-[0.2em] uppercase">
        <TrendingUp size={14} style={{ color: ACCENT }} /> Numbers verified by the founder, audited by reality
      </motion.div>
    </div>
  );
}

// ---------------- Slide 6: Track Record (experience) ----------------
function TrackSlide({ data }) {
  return (
    <div>
      <SlideTitle>Track Record.</SlideTitle>
      <motion.div variants={stagger} className="max-w-3xl">
        {data.experience.map((exp, i) => (
          <motion.div key={i} variants={slideIn} className="flex gap-5 mb-6 last:mb-0">
            <div className="shrink-0 pt-1">
              <div className="w-11 h-11 rounded-xl border flex items-center justify-center font-black text-sm"
                style={{ borderColor: `${ACCENT}44`, color: ACCENT, background: 'rgba(163,230,53,0.06)' }}>
                {String(i + 1).padStart(2, '0')}
              </div>
            </div>
            <div className="flex-1 border-l border-white/10 pl-5">
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-slate-500">{exp.period || 'UNDATED'}</span>
              <h3 className="text-xl font-bold text-white mt-0.5">{exp.role}</h3>
              {exp.company && <p className="text-sm font-semibold mb-1.5" style={{ color: ACCENT }}>{exp.company}</p>}
              {exp.description && <p className="text-slate-400 text-sm leading-relaxed">{exp.description}</p>}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// ---------------- Slide 7: Proof (testimonials) ----------------
function ProofSlide({ data }) {
  return (
    <div>
      <SlideTitle>Proof.</SlideTitle>
      <motion.div variants={stagger} className="grid md:grid-cols-2 gap-6 max-w-4xl">
        {data.testimonials.slice(0, 4).map((t, i) => (
          <motion.blockquote key={i} variants={slideIn} className="rounded-xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/25 transition-colors">
            <Quote size={18} style={{ color: ACCENT }} className="mb-3" />
            <p className="text-slate-300 text-sm leading-relaxed italic mb-5">“{t.text}”</p>
            <footer className="flex items-center gap-3">
              {t.avatar
                ? <img src={t.avatar} alt={t.name || 'Investor'} className="w-10 h-10 rounded-full object-cover border border-white/15" />
                : <div className="w-10 h-10 rounded-full border border-white/15 bg-white/[0.05] flex items-center justify-center text-[11px] font-black text-slate-400">{initials(t.name)}</div>}
              <div>
                <div className="text-sm font-bold text-white">{t.name}</div>
                {t.role && <div className="text-[11px] text-slate-500">{t.role}</div>}
              </div>
            </footer>
          </motion.blockquote>
        ))}
      </motion.div>
    </div>
  );
}

// ---------------- Slide 8: The Ask (contact + footer) ----------------
function AskSlide({ data }) {
  return (
    <div className="text-center">
      <SlideTitle>The Ask.</SlideTitle>
      <motion.p variants={fadeUp} className="text-slate-400 md:text-xl mb-10 max-w-xl mx-auto">
        One conversation is all this deck asks for. Bring your hardest problem — leave with a partner.
      </motion.p>
      <motion.div variants={stagger} className="flex flex-wrap justify-center gap-3 mb-14">
        {data.socials.email && (
          <motion.a variants={slideIn} href={`mailto:${data.socials.email}`}
            className="flex items-center gap-2 px-8 py-4 rounded-lg font-black text-sm tracking-wider uppercase text-black transition-transform hover:-translate-y-0.5"
            style={{ background: ACCENT, boxShadow: '0 14px 40px rgba(163,230,53,0.22)' }}>
            <Mail size={17} /> Email Me
          </motion.a>
        )}
        {data.socials.github && (
          <motion.a variants={slideIn} href={data.socials.github} target="_blank" rel="noreferrer"
            className="flex items-center gap-2 px-6 py-4 rounded-lg font-bold text-sm border border-white/20 text-slate-300 hover:border-white/50 hover:text-white transition-colors">
            <Github size={16} /> GitHub
          </motion.a>
        )}
        {data.socials.linkedin && (
          <motion.a variants={slideIn} href={data.socials.linkedin} target="_blank" rel="noreferrer"
            className="flex items-center gap-2 px-6 py-4 rounded-lg font-bold text-sm border border-white/20 text-slate-300 hover:border-white/50 hover:text-white transition-colors">
            <Linkedin size={16} /> LinkedIn
          </motion.a>
        )}
        {data.socials.twitter && (
          <motion.a variants={slideIn} href={data.socials.twitter} target="_blank" rel="noreferrer"
            className="flex items-center gap-2 px-6 py-4 rounded-lg font-bold text-sm border border-white/20 text-slate-300 hover:border-white/50 hover:text-white transition-colors">
            <Twitter size={16} /> Twitter
          </motion.a>
        )}
      </motion.div>
      <motion.div variants={fadeUp}>
        <div className="h-px w-40 mx-auto bg-white/10 mb-6" />
        <p className="text-[10px] tracking-[0.35em] uppercase text-slate-600">
          © {new Date().getFullYear()} {data.personal.name || 'Portfolio'} · Startup Pitch Deck · Thank You
        </p>
      </motion.div>
    </div>
  );
}

// ---------------- Main: deck controller ----------------
export default function StartupPitch() {
  const { portfolioData: data } = usePortfolio();
  const [idx, setIdx] = useState(0);

  const hasAbout = Boolean(data.personal.bio || data.personal.avatar);
  const hasStats = [data.stats?.yearsExperience, data.stats?.projectsCompleted, data.stats?.happyClients]
    .some((v) => statNumber(v) !== null);

  // Build deck from available content — Cover and The Ask always present
  const deck = [{ id: 'hero', label: 'Cover', Comp: CoverSlide, alt: false }];
  if (hasAbout) deck.push({ id: 'about', label: 'The Problem', Comp: ProblemSlide, alt: true });
  if (data.skills?.length > 0) deck.push({ id: 'skills', label: 'The Solution', Comp: SolutionSlide, alt: false });
  if (data.projects?.length > 0) deck.push({ id: 'projects', label: 'Live Demo', Comp: DemoSlide, alt: true });
  if (hasStats) deck.push({ id: 'traction', label: 'Traction', Comp: TractionSlide, alt: false });
  if (data.experience?.length > 0) deck.push({ id: 'experience', label: 'Track Record', Comp: TrackSlide, alt: true });
  if (data.testimonials?.length > 0) deck.push({ id: 'testimonials', label: 'Proof', Comp: ProofSlide, alt: false });
  deck.push({ id: 'contact', label: 'The Ask', Comp: AskSlide, alt: true });
  const numbered = deck.map((d, i) => ({ ...d, no: String(i + 1).padStart(2, '0') }));

  const goTo = (i) => setIdx(Math.max(0, Math.min(numbered.length - 1, i)));
  const goToId = (id) => {
    const i = numbered.findIndex((d) => d.id === id);
    if (i >= 0) setIdx(i);
  };
  const nav = { ids: numbered.map((d) => d.id), goToId };

  // Clamp when the deck shrinks (e.g. user clears their data)
  useEffect(() => {
    if (idx > numbered.length - 1) setIdx(0);
  }, [numbered.length, idx]);

  // Arrow-key slide navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); goTo(idx + 1); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); goTo(idx - 1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [idx, numbered.length]);

  const current = numbered[idx];

  return (
    <div className="relative h-screen w-full overflow-hidden font-sans antialiased text-white" style={{ background: '#0b0e14' }}>
      {/* faint deck grid */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '56px 56px'
        }} />
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true"
        style={{ background: 'radial-gradient(ellipse 50% 40% at 85% 10%, rgba(163,230,53,0.06), transparent 65%)' }} />

      {/* Deck chrome: top bar */}
      <header className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-5 md:px-8 h-14 border-b border-white/[0.06] bg-[#0b0e14]/80 backdrop-blur-sm">
        <span className="flex items-center gap-2.5 text-[11px] font-bold tracking-[0.3em] uppercase text-slate-300">
          <span className="w-2.5 h-2.5 rounded-[3px]" style={{ background: ACCENT }} />
          {data.personal.name || 'Pitch Deck'}
        </span>
        <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-slate-500">
          {current ? current.label : ''} · {String(idx + 1).padStart(2, '0')} / {String(numbered.length).padStart(2, '0')}
        </span>
      </header>

      {/* Slides (all mounted; inactive hidden so ids stay in the DOM) */}
      {numbered.map((def, i) => {
        const Comp = def.Comp;
        return (
          <SlideShell key={def.id} def={def} active={i === idx}>
            <Comp data={data} nav={nav} />
          </SlideShell>
        );
      })}

      {/* Dot navigation */}
      <nav className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 hidden sm:flex flex-col gap-2.5" aria-label="Slides">
        {numbered.map((d, i) => (
          <button key={d.id} aria-label={`Go to ${d.label}`} onClick={() => goTo(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === idx ? 10 : 8,
              height: i === idx ? 10 : 8,
              background: i === idx ? ACCENT : 'rgba(255,255,255,0.22)',
              boxShadow: i === idx ? '0 0 10px rgba(163,230,53,0.5)' : 'none'
            }} />
        ))}
      </nav>

      {/* Prev / Next controls */}
      <div className="absolute bottom-6 right-5 md:right-8 z-30 flex gap-2">
        <button onClick={() => goTo(idx - 1)} disabled={idx === 0} aria-label="Previous slide"
          className="w-11 h-11 rounded-lg border border-white/15 bg-white/[0.04] flex items-center justify-center text-slate-300 hover:border-white/40 hover:text-white transition-colors disabled:opacity-25 disabled:hover:border-white/15">
          <ChevronLeft size={18} />
        </button>
        <button onClick={() => goTo(idx + 1)} disabled={idx === numbered.length - 1} aria-label="Next slide"
          className="w-11 h-11 rounded-lg border flex items-center justify-center text-black transition-all disabled:opacity-25"
          style={{ background: ACCENT, borderColor: ACCENT }}>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Deck progress bar */}
      <div className="absolute bottom-0 inset-x-0 z-30 h-1 bg-white/[0.07]">
        <motion.div className="h-full" style={{ background: ACCENT }}
          initial={false}
          animate={{ width: `${((idx + 1) / numbered.length) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }} />
      </div>
    </div>
  );
}
