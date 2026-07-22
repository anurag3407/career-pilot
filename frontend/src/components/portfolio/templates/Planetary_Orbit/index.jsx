import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, MapPin, ExternalLink, Briefcase, Code2, Quote, Send, User, Layers, Star, ChevronLeft, ChevronRight } from 'lucide-react';

/* ── Space palette ─────────────────────────────────────────────────── */
const SPACE = {
  bg:      '#000008',
  surface: '#08080f',
  card:    '#0d0d18',
  sun:     '#ffd700',
  sunGlow: '#ff8c00',
  text:    '#e8e8f0',
  muted:   '#6060a0',
  subtle:  '#30304a',
};

/* Planet config — one per section */
const PLANETS = [
  { id: 'about',        label: 'About',        color: '#4fc3f7', glow: '#4fc3f7', size: 18, orbitR: 90,  speed: 14 },
  { id: 'skills',       label: 'Skills',       color: '#81c784', glow: '#66bb6a', size: 14, orbitR: 140, speed: 22 },
  { id: 'projects',     label: 'Projects',     color: '#ff8a65', glow: '#ff7043', size: 22, orbitR: 195, speed: 32 },
  { id: 'experience',   label: 'Experience',   color: '#ce93d8', glow: '#ba68c8', size: 16, orbitR: 255, speed: 46 },
  { id: 'testimonials', label: 'Reviews',      color: '#f48fb1', glow: '#e91e63', size: 13, orbitR: 310, speed: 60 },
  { id: 'contact',      label: 'Contact',      color: '#80cbc4', glow: '#26a69a', size: 15, orbitR: 360, speed: 76 },
];

/* ── Starfield ─────────────────────────────────────────────────────── */
function Starfield({ count = 180 }) {
  const { portfolioData: data } = usePortfolio();

  const stars = Array.from({ length: count }, (_, i) => ({
    x: (i * 137.5) % 100,
    y: (i * 93.7) % 100,
    r: (i % 3 === 0) ? 1.5 : 0.8,
    opacity: 0.3 + (i % 5) * 0.12,
    delay: (i % 30) * 0.1,
  }));
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {stars.map((s, i) => (
        <motion.div key={i}
          className="absolute rounded-full"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.r * 2, height: s.r * 2, background: 'white', opacity: s.opacity }}
          animate={{ opacity: [s.opacity, s.opacity * 0.3, s.opacity] }}
          transition={{ duration: 2 + (i % 4), delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/* ── Solar system navigator ────────────────────────────────────────── */
function SolarSystem({ activeSection, onNavigate }) {
  const { portfolioData: data } = usePortfolio();

  const [hoveredPlanet, setHoveredPlanet] = useState(null);
  const size = 760;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="relative mx-auto select-none" style={{ width: '100%', maxWidth: size, aspectRatio: '1' }}>
      <svg viewBox={`0 0 ${size} ${size}`} style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <defs>
          <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#fff8dc" />
            <stop offset="40%"  stopColor={SPACE.sun} />
            <stop offset="100%" stopColor={SPACE.sunGlow} stopOpacity="0.6" />
          </radialGradient>
          <filter id="sunBloom">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {PLANETS.map((p) => (
            <radialGradient key={p.id} id={`planet-${p.id}`} cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="white" stopOpacity="0.5" />
              <stop offset="60%" stopColor={p.color} />
              <stop offset="100%" stopColor={p.color} stopOpacity="0.7" />
            </radialGradient>
          ))}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Orbit rings */}
        {PLANETS.map((p) => (
          <circle key={p.id} cx={cx} cy={cy} r={p.orbitR}
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1"
            strokeDasharray={activeSection === p.id ? '6 4' : 'none'}
            style={{ transition: 'stroke 0.4s' }}
          />
        ))}

        {/* Sun */}
        <motion.circle cx={cx} cy={cy} r={32} fill="url(#sunGrad)" filter="url(#sunBloom)"
          animate={{ r: [32, 35, 32] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.circle cx={cx} cy={cy} r={44} fill="none" stroke={SPACE.sun} strokeWidth="1"
          animate={{ opacity: [0.1, 0.3, 0.1], r: [44, 52, 44] }} transition={{ duration: 4, repeat: Infinity }} />

        {/* Planets */}
        {PLANETS.map((p) => (
          <motion.g key={p.id}
            animate={{ rotate: 360 }}
            transition={{ duration: p.speed, repeat: Infinity, ease: 'linear' }}
            style={{ originX: `${cx}px`, originY: `${cy}px` }}>
            <g transform={`translate(${cx + p.orbitR}, ${cy})`}>
              {/* Planet glow */}
              <motion.circle r={p.size + 6} fill="none" stroke={p.glow} strokeWidth="1.5"
                animate={{ opacity: activeSection === p.id ? [0.5, 1, 0.5] : [0, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }} />

              {/* Planet body */}
              <circle r={p.size} fill={`url(#planet-${p.id})`} filter="url(#glow)"
                style={{ cursor: 'pointer', transition: 'r 0.2s' }}
                onClick={() => onNavigate(p.id)} />

              {/* Active ring */}
              {activeSection === p.id && (
                <motion.circle r={p.size + 10} fill="none" stroke={p.color} strokeWidth="2"
                  animate={{ opacity: [1, 0.3, 1], r: [p.size + 10, p.size + 16, p.size + 10] }}
                  transition={{ duration: 1.5, repeat: Infinity }} />
              )}

              {/* Counter-rotate label */}
              <motion.g animate={{ rotate: -360 }} transition={{ duration: p.speed, repeat: Infinity, ease: 'linear' }}>
                <text y={p.size + 18} textAnchor="middle" fontSize={9} fill={p.color}
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, letterSpacing: '0.05em', cursor: 'pointer' }}
                  onClick={() => onNavigate(p.id)}>
                  {p.label.toUpperCase()}
                </text>
              </motion.g>
            </g>
          </motion.g>
        ))}

        {/* Center label on sun */}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize={9} fill={SPACE.sun} fontWeight={700} fontFamily="Inter, sans-serif" letterSpacing="0.08em">
          {data.personal.name.split(' ')[0].toUpperCase()}
        </text>
        <text x={cx} y={cy + 9} textAnchor="middle" fontSize={7} fill={SPACE.sun} fontFamily="Inter, sans-serif" opacity={0.7}>
          .dev
        </text>
      </svg>

      {/* Hover tooltip */}
      <AnimatePresence>
        {hoveredPlanet && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl text-xs font-bold pointer-events-none"
            style={{ background: SPACE.card, border: `1px solid ${hoveredPlanet.color}40`, color: hoveredPlanet.color }}>
            Navigate to {hoveredPlanet.label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Fade section ──────────────────────────────────────────────────── */
function FadeSection({ children, className = '', delay = 0 }) {
  const { portfolioData: data } = usePortfolio();

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}>
      {children}
    </motion.div>
  );
}

/* ── Section heading ───────────────────────────────────────────────── */
function SectionHeading({ icon: Icon, title, planet }) {
  const { portfolioData: data } = usePortfolio();

  const p = PLANETS.find(p => p.id === planet) || PLANETS[0];
  return (
    <div className="flex items-center gap-3 mb-10">
      <div className="p-2.5 rounded-xl" style={{ background: `${p.color}18`, border: `1px solid ${p.color}40` }}>
        <Icon size={18} style={{ color: p.color }} />
      </div>
      <h2 className="text-2xl md:text-3xl font-black" style={{ color: SPACE.text }}>{title}</h2>
      <div className="flex-1 h-px ml-2" style={{ background: `linear-gradient(to right, ${p.color}50, transparent)` }} />
      <div className="w-3 h-3 rounded-full" style={{ background: p.color, boxShadow: `0 0 10px ${p.color}` }} />
    </div>
  );
}

/* ── Skill bar ─────────────────────────────────────────────────────── */
function SkillBar({ name, level, category, delay }) {
  const { portfolioData: data } = usePortfolio();

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const catColor = { Frontend: '#4fc3f7', Backend: '#81c784', DevOps: '#ffb74d', Design: '#f48fb1' };
  const c = catColor[category] || '#4fc3f7';
  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium" style={{ color: SPACE.text }}>{name}</span>
        <div className="flex gap-2 items-center">
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${c}18`, color: c, border: `1px solid ${c}35` }}>{category}</span>
          <span className="text-xs font-bold" style={{ color: c }}>{level}%</span>
        </div>
      </div>
      <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div className="h-full rounded-full"
          style={{ background: `linear-gradient(to right, ${c}80, ${c})`, boxShadow: `0 0 8px ${c}80` }}
          initial={{ width: 0 }} animate={inView ? { width: `${level}%` } : {}}
          transition={{ duration: 1, delay: delay * 0.07, ease: 'easeOut' }} />
      </div>
    </div>
  );
}

/* ── Project card ──────────────────────────────────────────────────── */
function ProjectCard({ project, index }) {
  const { portfolioData: data } = usePortfolio();

  const [hovered, setHovered] = useState(false);
  const p = PLANETS[2]; // projects planet
  const c = p.color;
  return (
    <FadeSection delay={index * 0.1}>
      <motion.div className="relative rounded-2xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${SPACE.card}, ${SPACE.surface})`,
          border: `1px solid ${hovered ? c : `${c}20`}`,
          boxShadow: hovered ? `0 0 25px ${c}20` : 'none',
          transition: 'all 0.3s',
        }}
        onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
        whileHover={{ y: -4 }}>
        <div className="relative h-44 overflow-hidden">
          <img src={project.image} alt={project.title} className="w-full h-full object-cover"
            style={{ filter: 'saturate(0.5) brightness(0.55)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,8,0.95))' }} />
        </div>
        <div className="p-5">
          <h3 className="text-base font-black mb-2" style={{ color: SPACE.text }}>{project.title}</h3>
          <p className="text-sm leading-relaxed mb-4" style={{ color: SPACE.muted }}>{project.description}</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.techStack.map((tech) => (
              <span key={tech} className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: `${c}12`, color: c, border: `1px solid ${c}30` }}>{tech}</span>
            ))}
          </div>
          <div className="flex gap-3">
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg"
              style={{ background: `${c}18`, color: c, border: `1px solid ${c}40` }}>
              <ExternalLink size={11} /> Live
            </a>
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.05)', color: SPACE.muted, border: '1px solid rgba(255,255,255,0.1)' }}>
              <Github size={11} /> Code
            </a>
          </div>
        </div>
      </motion.div>
    </FadeSection>
  );
}

/* ── Contact form ──────────────────────────────────────────────────── */
function ContactForm() {
  const { portfolioData: data } = usePortfolio();

  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const c = PLANETS[5].color;
  const inputStyle = {
    background: 'rgba(255,255,255,0.04)', border: `1px solid ${c}25`,
    borderRadius: '10px', color: SPACE.text, outline: 'none', width: '100%',
    padding: '0.75rem 1rem', fontSize: '0.875rem', transition: 'border-color 0.2s',
  };
  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div key="sent" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center">
          <motion.div animate={{ scale: [1, 1.15, 1], boxShadow: [`0 0 20px ${c}50`, `0 0 50px ${c}80`, `0 0 20px ${c}50`] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ background: `${c}18`, border: `2px solid ${c}` }}>
            <Send size={26} style={{ color: c }} />
          </motion.div>
          <p className="text-base font-black mb-1" style={{ color: c }}>Signal transmitted!</p>
          <p className="text-sm" style={{ color: SPACE.muted }}>Message sent across the cosmos.</p>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
          <input required style={inputStyle} placeholder="Your Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          <input required type="email" style={inputStyle} placeholder="Your Email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
          <textarea required rows={4} style={{ ...inputStyle, resize: 'none' }} placeholder="Your message..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
          <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
            style={{ background: `${c}18`, color: c, border: `1px solid ${c}40`, boxShadow: `0 0 20px ${c}15` }}>
            <Send size={14} /> Send Signal
          </motion.button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════ */
export default function PlanetaryOrbit() {
  const { portfolioData: data } = usePortfolio();

  const [activeSection, setActiveSection] = useState('about');

  const scrollTo = useCallback((id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const skillsByCategory = data.skills.reduce((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s); return acc;
  }, {});

  /* Intersection observer to update active section on scroll */
  useEffect(() => {
    const sections = PLANETS.map(p => document.getElementById(p.id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: SPACE.bg, fontFamily: "'Inter', sans-serif" }}>
      <Starfield />

      {/* Nebula glow blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div style={{ position: 'absolute', width: 500, height: 500, left: '-10%', top: '10%',
          background: 'radial-gradient(ellipse, rgba(79,195,247,0.04) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', width: 600, height: 400, right: '-15%', top: '40%',
          background: 'radial-gradient(ellipse, rgba(206,147,216,0.04) 0%, transparent 70%)', filter: 'blur(50px)' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, left: '30%', bottom: '5%',
          background: 'radial-gradient(ellipse, rgba(255,138,101,0.04) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      </div>

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        style={{ backdropFilter: 'blur(20px)', background: 'rgba(0,0,8,0.8)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <motion.div className="font-black text-base" style={{ color: SPACE.sun }}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            {data.personal.name.split(' ')[0]}
            <span style={{ color: SPACE.muted }}>·orbit</span>
          </motion.div>
          <div className="hidden md:flex items-center gap-1">
            {PLANETS.map((p) => (
              <button type="button" key={p.id} onClick={() => scrollTo(p.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{ color: activeSection === p.id ? p.color : SPACE.muted,
                  background: activeSection === p.id ? `${p.color}12` : 'transparent' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
                {p.label}
              </button>
            ))}
          </div>
          <a href={`mailto:${data.socials.email}`}
            className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold"
            style={{ background: `${SPACE.sun}18`, color: SPACE.sun, border: `1px solid ${SPACE.sun}30` }}>
            <Mail size={12} /> Contact
          </a>
        </div>
      </nav>

      {/* ══════════════ HERO ══════════════ */}
      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-10">
        <div className="max-w-6xl w-full mx-auto grid lg:grid-cols-2 gap-10 items-center">
          {/* Text */}
          <div className="text-center lg:text-left">
            <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest mb-8"
              style={{ background: `${SPACE.sun}12`, color: SPACE.sun, border: `1px solid ${SPACE.sun}30` }}>
              <Star size={11} />
              Full Stack Developer
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black mb-5 leading-tight">
              <span style={{ color: SPACE.text }}>{data.personal.name.split(' ')[0]}</span>
              <br />
              <span style={{
                background: `linear-gradient(135deg, ${SPACE.sun}, #ff8c00)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                filter: `drop-shadow(0 0 20px ${SPACE.sun}60)`,
              }}>{data.personal.name.split(' ').slice(1).join(' ')}</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
              className="text-base mb-3" style={{ color: SPACE.muted }}>{data.personal.title}</motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="text-sm mb-8 leading-relaxed max-w-md" style={{ color: SPACE.subtle }}>{data.personal.tagline}</motion.p>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4 mb-10 justify-center lg:justify-start">
              <motion.button onClick={() => scrollTo('projects')} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="px-7 py-3 rounded-xl font-bold text-sm"
                style={{ background: `${SPACE.sun}20`, color: SPACE.sun, border: `1px solid ${SPACE.sun}50`, boxShadow: `0 0 20px ${SPACE.sun}15` }}>
                Explore Universe
              </motion.button>
              <motion.button onClick={() => scrollTo('contact')} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="px-7 py-3 rounded-xl font-semibold text-sm"
                style={{ background: 'rgba(255,255,255,0.05)', color: SPACE.muted, border: '1px solid rgba(255,255,255,0.1)' }}>
                Make Contact
              </motion.button>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
              className="flex gap-8 justify-center lg:justify-start">
              {[
                { label: 'Years', value: `${data.stats.yearsExperience}+` },
                { label: 'Projects', value: `${data.stats.projectsCompleted}+` },
                { label: 'Clients', value: `${data.stats.happyClients}+` },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-black" style={{ color: SPACE.sun, textShadow: `0 0 15px ${SPACE.sun}` }}>{s.value}</div>
                  <div className="text-xs mt-0.5" style={{ color: SPACE.muted }}>{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Solar system */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }}
            className="relative z-10">
            <p className="text-center text-xs mb-3 tracking-widest uppercase" style={{ color: SPACE.muted }}>
              Click a planet to navigate
            </p>
            <SolarSystem activeSection={activeSection} onNavigate={scrollTo} />
          </motion.div>
        </div>
      </section>

      {/* ══════════════ CONTENT ══════════════ */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10 space-y-32">

        {/* About */}
        <section id="about">
          <FadeSection><SectionHeading icon={User} title="About Me" planet="about" /></FadeSection>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeSection delay={0.1}>
              <div className="relative w-56 h-56 md:w-72 md:h-72 mx-auto">
                <div className="w-full h-full rounded-full overflow-hidden"
                  style={{ border: `3px solid ${PLANETS[0].color}40`,
                    boxShadow: `0 0 40px ${PLANETS[0].color}20, 0 0 80px ${PLANETS[0].color}10` }}>
                  <img src={data.personal.avatar} alt={data.personal.name} className="w-full h-full object-cover"
                    style={{ filter: 'saturate(0.75)' }} />
                </div>
                <motion.div className="absolute inset-0 rounded-full" style={{ border: `1px dashed ${PLANETS[0].color}30` }}
                  animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} />
              </div>
            </FadeSection>
            <FadeSection delay={0.2}>
              <p className="text-sm leading-relaxed mb-2" style={{ color: SPACE.muted }}>{data.personal.bio}</p>
              <div className="flex items-center gap-1.5 mb-6">
                <MapPin size={13} style={{ color: PLANETS[0].color }} />
                <span className="text-sm" style={{ color: SPACE.muted }}>{data.personal.location}</span>
              </div>
              <div className="flex gap-3">
                {[
                  { icon: Github,   href: data.socials.github },
                  { icon: Linkedin, href: data.socials.linkedin },
                  { icon: Twitter,  href: data.socials.twitter },
                  { icon: Mail,     href: `mailto:${data.socials.email}` },
                ].map(({ icon: Icon, href }, idx) => (
                  <motion.a key={idx} href={href} target="_blank" rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: `${PLANETS[0].color}10`, border: `1px solid ${PLANETS[0].color}30`, color: SPACE.muted }}>
                    <Icon size={15} />
                  </motion.a>
                ))}
              </div>
            </FadeSection>
          </div>
        </section>

        {/* Skills */}
        <section id="skills">
          <FadeSection><SectionHeading icon={Code2} title="Skills" planet="skills" /></FadeSection>
          <div className="grid sm:grid-cols-2 gap-8">
            {Object.entries(skillsByCategory).map(([cat, skills], ci) => (
              <FadeSection key={cat} delay={ci * 0.1}>
                <div className="p-6 rounded-2xl"
                  style={{ background: `linear-gradient(135deg, ${SPACE.card}, ${SPACE.surface})`,
                    border: `1px solid ${PLANETS[1].color}15` }}>
                  <h3 className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: SPACE.muted }}>{cat}</h3>
                  {skills.map((skill, si) => <SkillBar key={skill.name} {...skill} delay={si} />)}
                </div>
              </FadeSection>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section id="projects">
          <FadeSection><SectionHeading icon={Layers} title="Projects" planet="projects" /></FadeSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.projects.map((p, i) => <ProjectCard key={p.title} project={p} index={i} />)}
          </div>
        </section>

        {/* Experience */}
        <section id="experience">
          <FadeSection><SectionHeading icon={Briefcase} title="Experience" planet="experience" /></FadeSection>
          <div className="relative">
            <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px"
              style={{ background: `linear-gradient(to bottom, ${PLANETS[3].color}50, transparent)` }} />
            <div className="space-y-8">
              {data.experience.map((exp, i) => (
                <FadeSection key={i} delay={i * 0.1}>
                  <div className="flex gap-6 md:gap-10">
                    <div className="flex-shrink-0">
                      <motion.div className="w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center z-10 relative"
                        style={{ background: `${PLANETS[3].color}15`, border: `2px solid ${PLANETS[3].color}50` }}
                        whileInView={{ boxShadow: [`0 0 10px ${PLANETS[3].color}20`, `0 0 25px ${PLANETS[3].color}50`, `0 0 10px ${PLANETS[3].color}20`] }}
                        transition={{ duration: 2.5, repeat: Infinity }}>
                        <Star size={12} style={{ color: PLANETS[3].color }} />
                      </motion.div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                        <div>
                          <h3 className="text-sm font-black" style={{ color: SPACE.text }}>{exp.role}</h3>
                          <p className="text-sm font-bold" style={{ color: PLANETS[3].color }}>{exp.company}</p>
                        </div>
                        <span className="text-xs px-3 py-1 rounded-full"
                          style={{ background: `${PLANETS[3].color}10`, color: PLANETS[3].color, border: `1px solid ${PLANETS[3].color}25` }}>
                          {exp.period}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed mt-2" style={{ color: SPACE.muted }}>{exp.description}</p>
                    </div>
                  </div>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials">
          <FadeSection><SectionHeading icon={Quote} title="Testimonials" planet="testimonials" /></FadeSection>
          <div className="grid sm:grid-cols-2 gap-6">
            {data.testimonials.map((t, i) => (
              <FadeSection key={i} delay={i * 0.1}>
                <div className="p-6 rounded-2xl h-full"
                  style={{ background: `linear-gradient(135deg, ${SPACE.card}, ${SPACE.surface})`,
                    border: `1px solid ${PLANETS[4].color}15` }}>
                  <Quote size={22} className="mb-4" style={{ color: PLANETS[4].color, opacity: 0.5 }} />
                  <p className="text-sm leading-relaxed mb-5" style={{ color: SPACE.muted }}>{t.text}</p>
                  <div className="flex items-center gap-3">
                    <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover"
                      style={{ border: `2px solid ${PLANETS[4].color}40`, filter: 'saturate(0.7)' }} />
                    <div>
                      <p className="text-sm font-bold" style={{ color: SPACE.text }}>{t.name}</p>
                      <p className="text-xs" style={{ color: SPACE.muted }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeSection>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact">
          <FadeSection><SectionHeading icon={Mail} title="Contact" planet="contact" /></FadeSection>
          <div className="grid md:grid-cols-2 gap-10">
            <FadeSection delay={0.1}>
              <h3 className="text-lg font-black mb-3" style={{ color: SPACE.text }}>Let's connect across the cosmos</h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: SPACE.muted }}>
                Open to new projects, collaborations, and conversations. Send a signal.
              </p>
              <div className="space-y-3">
                {[
                  { icon: Mail,     label: data.socials.email,     href: `mailto:${data.socials.email}` },
                  { icon: MapPin,   label: data.personal.location, href: '#' },
                  { icon: Github,   label: 'GitHub',               href: data.socials.github },
                  { icon: Linkedin, label: 'LinkedIn',             href: data.socials.linkedin },
                ].map(({ icon: Icon, label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm group" style={{ color: SPACE.muted }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: `${PLANETS[5].color}10`, border: `1px solid ${PLANETS[5].color}25` }}>
                      <Icon size={13} style={{ color: PLANETS[5].color }} />
                    </div>
                    <span className="group-hover:text-teal-300 transition-colors">{label}</span>
                  </a>
                ))}
              </div>
            </FadeSection>
            <FadeSection delay={0.2}>
              <div className="p-6 rounded-2xl"
                style={{ background: `linear-gradient(135deg, ${SPACE.card}, ${SPACE.surface})`,
                  border: `1px solid ${PLANETS[5].color}15` }}>
                <ContactForm />
              </div>
            </FadeSection>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 px-6"
        style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <p className="text-xs" style={{ color: SPACE.subtle }}>
          {data.personal.name} © {new Date().getFullYear()} · Built with React + Framer Motion
        </p>
      </footer>
    </div>
  );
}
