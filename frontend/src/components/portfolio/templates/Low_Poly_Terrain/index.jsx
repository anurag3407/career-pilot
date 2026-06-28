import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, MapPin, ExternalLink, Briefcase, Code2, ChevronDown, Quote, Send, User, Layers, Sun, Moon } from 'lucide-react';

/* ── Low-poly colour system ────────────────────────────────────────── */
const POLY = {
  sky1:    '#87ceeb',
  sky2:    '#4a90d9',
  sky3:    '#1e3f6e',
  night1:  '#0a0a2e',
  night2:  '#1a1a4e',
  mtn1:    '#5a8c5a',
  mtn2:    '#3d6b3d',
  mtn3:    '#2d4f2d',
  snow:    '#eaf0f6',
  water:   '#2b8cbe',
  sun:     '#ffd700',
  sunset:  '#ff7043',
  text:    '#1a2e1a',
  textDark:'#e8f4e8',
  accent:  '#3d6b3d',
  card:    'rgba(255,255,255,0.85)',
  cardDk:  'rgba(20,30,20,0.85)',
};

/* ── Low-poly SVG terrain background ──────────────────────────────── */
function TerrainBackground({ dayProgress }) {
  const { portfolioData: data } = usePortfolio();

  /* dayProgress 0→1: dawn→day→dusk→night */
  const skyTop    = dayProgress < 0.5
    ? lerpColor('#1e3f6e', '#87ceeb', dayProgress * 2)
    : lerpColor('#87ceeb', '#1e3f6e', (dayProgress - 0.5) * 2);
  const skyBottom = dayProgress < 0.5
    ? lerpColor('#4a90d9', '#c9e8f8', dayProgress * 2)
    : lerpColor('#c9e8f8', '#4a90d9', (dayProgress - 0.5) * 2);

  const sunY = 15 + Math.sin(dayProgress * Math.PI) * (-12);
  const sunX = 5 + dayProgress * 90;
  const sunVisible = dayProgress > 0.05 && dayProgress < 0.95;
  const moonVisible = dayProgress < 0.1 || dayProgress > 0.9;

  return (
    <div className="fixed inset-0 pointer-events-none z-0" style={{ transition: 'none' }}>
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"
        style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={skyTop} />
            <stop offset="100%" stopColor={skyBottom} />
          </linearGradient>
          <radialGradient id="sunHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff8dc" stopOpacity="0.9" />
            <stop offset="40%" stopColor={POLY.sun} stopOpacity="0.6" />
            <stop offset="100%" stopColor={POLY.sun} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Sky */}
        <rect width="1440" height="900" fill="url(#skyGrad)" />

        {/* Sun */}
        {sunVisible && <>
          <circle cx={`${sunX}%`} cy={`${sunY}%`} r={60} fill="url(#sunHalo)" opacity={0.4} />
          <circle cx={`${sunX}%`} cy={`${sunY}%`} r={28} fill={POLY.sun} />
        </>}

        {/* Moon */}
        {moonVisible && (
          <circle cx="85%" cy="12%" r={18} fill="#e8e8d0" />
        )}

        {/* Far mountains (light) */}
        <polygon points="0,580 120,420 240,500 360,380 480,460 600,340 720,420 840,360 960,440 1080,380 1200,450 1320,400 1440,470 1440,900 0,900"
          fill="#8fbc8f" opacity="0.7" />
        {/* Poly facets far */}
        <polygon points="0,580 120,420 200,510"   fill="#7aad7a" />
        <polygon points="120,420 240,500 300,430" fill="#96c896" />
        <polygon points="360,380 480,460 420,390" fill="#7aad7a" />
        <polygon points="600,340 720,420 660,370" fill="#96c896" />
        <polygon points="840,360 960,440 900,390" fill="#7aad7a" />
        <polygon points="1080,380 1200,450 1140,400" fill="#96c896" />
        <polygon points="1320,400 1440,470 1400,410" fill="#7aad7a" />

        {/* Snow caps */}
        <polygon points="120,420 165,440 200,420 155,400" fill={POLY.snow} opacity="0.9" />
        <polygon points="600,340 650,360 680,340 640,318" fill={POLY.snow} opacity="0.9" />
        <polygon points="1080,380 1125,398 1155,378 1115,358" fill={POLY.snow} opacity="0.9" />

        {/* Mid mountains (darker) */}
        <polygon points="0,680 180,530 300,610 420,510 540,590 660,480 780,560 900,490 1020,570 1140,500 1260,580 1440,530 1440,900 0,900"
          fill={POLY.mtn2} opacity="0.85" />
        <polygon points="180,530 280,580 300,610 220,560"  fill="#2d5a2d" />
        <polygon points="420,510 520,555 540,590 460,540"  fill="#4a7a4a" />
        <polygon points="660,480 760,525 780,560 700,510"  fill="#2d5a2d" />
        <polygon points="900,490 1000,535 1020,570 940,520" fill="#4a7a4a" />
        <polygon points="1140,500 1240,545 1260,580 1180,530" fill="#2d5a2d" />

        {/* River */}
        <polygon points="320,720 400,700 460,730 420,760 340,745"
          fill={POLY.water} opacity="0.7" />
        <polygon points="400,700 490,690 530,715 460,730"
          fill={POLY.water} opacity="0.6" />

        {/* Foreground flat terrain */}
        <polygon points="0,820 1440,820 1440,900 0,900" fill={POLY.mtn3} />
        <polygon points="0,820 300,800 600,820 900,800 1200,820 1440,800 1440,820 0,820"
          fill="#1e3d1e" />

        {/* Low poly trees (triangles) */}
        {[80, 200, 350, 520, 680, 830, 1000, 1150, 1300].map((x, i) => (
          <g key={i}>
            <polygon points={`${x},780 ${x-18},820 ${x+18},820`} fill="#1a4a1a" opacity="0.9" />
            <polygon points={`${x},755 ${x-14},790 ${x+14},790`} fill="#254a25" opacity="0.9" />
            <polygon points={`${x},732 ${x-10},760 ${x+10},760`} fill="#1a4a1a" opacity="0.9" />
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ── Lerp between two hex colours ─────────────────────────────────── */
function lerpColor(a, b, t) {
  const ah = parseInt(a.slice(1), 16);
  const bh = parseInt(b.slice(1), 16);
  const ar = ah >> 16, ag = (ah >> 8) & 0xff, ab = ah & 0xff;
  const br = bh >> 16, bg = (bh >> 8) & 0xff, bb = bh & 0xff;
  const rr = Math.round(ar + (br - ar) * t);
  const rg = Math.round(ag + (bg - ag) * t);
  const rb = Math.round(ab + (bb - ab) * t);
  return `#${((1 << 24) | (rr << 16) | (rg << 8) | rb).toString(16).slice(1)}`;
}

/* ── Animated sun progress ─────────────────────────────────────────── */
function useSunCycle() {
  const [prog, setProg] = useState(0.3);
  useEffect(() => {
    const startTime = Date.now();
    const cycleDuration = 60000; /* 60s full cycle for demo */
    const raf = setInterval(() => {
      const elapsed = (Date.now() - startTime) % cycleDuration;
      setProg(elapsed / cycleDuration);
    }, 100);
    return () => clearInterval(raf);
  }, []);
  return prog;
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
function SectionHeading({ icon: Icon, title }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="flex items-center gap-3 mb-10">
      <div className="p-2.5 rounded-xl" style={{ background: 'rgba(61,107,61,0.15)', border: '1px solid rgba(61,107,61,0.4)' }}>
        <Icon size={18} style={{ color: POLY.accent }} />
      </div>
      <h2 className="text-2xl md:text-3xl font-black" style={{ color: POLY.text }}>{title}</h2>
      <div className="flex-1 h-px ml-2" style={{ background: 'linear-gradient(to right, rgba(61,107,61,0.5), transparent)' }} />
    </div>
  );
}

/* ── Skill bar ─────────────────────────────────────────────────────── */
function SkillBar({ name, level, category, delay }) {
  const { portfolioData: data } = usePortfolio();

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const catColor = { Frontend: '#4a90d9', Backend: '#3d6b3d', DevOps: '#b8860b', Design: '#c04a4a' };
  const c = catColor[category] || '#3d6b3d';
  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-semibold" style={{ color: POLY.text }}>{name}</span>
        <div className="flex gap-2 items-center">
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${c}20`, color: c, border: `1px solid ${c}50` }}>{category}</span>
          <span className="text-xs font-bold" style={{ color: c }}>{level}%</span>
        </div>
      </div>
      <div className="h-2 rounded-full" style={{ background: 'rgba(0,0,0,0.1)' }}>
        <motion.div className="h-full rounded-full"
          style={{ background: `linear-gradient(to right, ${c}90, ${c})` }}
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
  return (
    <FadeSection delay={index * 0.1}>
      <motion.div className="relative rounded-2xl overflow-hidden"
        style={{
          background: POLY.card,
          border: `1px solid ${hovered ? 'rgba(61,107,61,0.6)' : 'rgba(61,107,61,0.2)'}`,
          boxShadow: hovered ? '0 8px 32px rgba(61,107,61,0.2)' : '0 2px 12px rgba(0,0,0,0.1)',
          transition: 'all 0.3s',
          backdropFilter: 'blur(10px)',
        }}
        onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
        whileHover={{ y: -4 }}>
        <div className="relative h-44 overflow-hidden">
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(255,255,255,0.9))' }} />
        </div>
        <div className="p-5">
          <h3 className="text-base font-black mb-2" style={{ color: POLY.text }}>{project.title}</h3>
          <p className="text-sm leading-relaxed mb-4" style={{ color: '#3a5a3a' }}>{project.description}</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.techStack.map((tech) => (
              <span key={tech} className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(61,107,61,0.12)', color: POLY.accent, border: '1px solid rgba(61,107,61,0.3)' }}>
                {tech}
              </span>
            ))}
          </div>
          <div className="flex gap-3">
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(61,107,61,0.15)', color: POLY.accent, border: '1px solid rgba(61,107,61,0.4)' }}>
              <ExternalLink size={11} /> Live
            </a>
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(0,0,0,0.06)', color: '#5a7a5a', border: '1px solid rgba(0,0,0,0.12)' }}>
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
  const inputStyle = {
    background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(61,107,61,0.3)',
    borderRadius: '10px', color: POLY.text, outline: 'none', width: '100%',
    padding: '0.75rem 1rem', fontSize: '0.875rem', transition: 'border-color 0.2s',
  };
  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div key="sent" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: 3, duration: 0.5 }}
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ background: 'rgba(61,107,61,0.15)', border: '2px solid rgba(61,107,61,0.5)' }}>
            <Send size={26} style={{ color: POLY.accent }} />
          </motion.div>
          <p className="text-base font-black mb-1" style={{ color: POLY.accent }}>Message sent!</p>
          <p className="text-sm" style={{ color: '#5a7a5a' }}>Thanks for reaching out.</p>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
          <input required style={inputStyle} placeholder="Your Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          <input required type="email" style={inputStyle} placeholder="Your Email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
          <textarea required rows={4} style={{ ...inputStyle, resize: 'none' }} placeholder="Your message..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
          <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
            style={{ background: 'rgba(61,107,61,0.9)', color: 'white', border: 'none', boxShadow: '0 4px 20px rgba(61,107,61,0.3)' }}>
            <Send size={14} /> Send Message
          </motion.button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════ */
export default function LowPolyTerrain() {
  const { portfolioData: data } = usePortfolio();

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroParallax = useTransform(scrollYProgress, [0, 0.3], [0, -60]);
  const dayProgress = useSunCycle();
  const [activeSection, setActiveSection] = useState('hero');

  const isDay = dayProgress > 0.1 && dayProgress < 0.9;
  const textColor = isDay ? POLY.text : POLY.textDark;
  const cardBg = isDay ? POLY.card : POLY.cardDk;
  const cardBorder = isDay ? 'rgba(61,107,61,0.2)' : 'rgba(100,180,100,0.15)';

  const skillsByCategory = data.skills.reduce((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s); return acc;
  }, {});

  const navLinks = [
    { id: 'about', label: 'About' }, { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' }, { id: 'experience', label: 'Experience' },
    { id: 'testimonials', label: 'Reviews' }, { id: 'contact', label: 'Contact' },
  ];

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(id);
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-x-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}>
      <TerrainBackground dayProgress={dayProgress} />

      {/* White fog overlay on content areas for readability */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ background: isDay
          ? 'linear-gradient(to bottom, transparent 50%, rgba(255,255,255,0.4) 80%, rgba(255,255,255,0.6) 100%)'
          : 'linear-gradient(to bottom, transparent 50%, rgba(10,15,10,0.5) 80%, rgba(10,15,10,0.7) 100%)' }} />

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        style={{ backdropFilter: 'blur(20px)',
          background: isDay ? 'rgba(255,255,255,0.75)' : 'rgba(10,15,10,0.85)',
          borderBottom: `1px solid ${cardBorder}` }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <motion.div className="font-black text-base" style={{ color: isDay ? POLY.accent : '#7bc47b' }}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            {data.personal.name.split(' ')[0]}
            <span style={{ color: isDay ? '#7aad7a' : '#4a8a4a' }}>.terrain</span>
          </motion.div>
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button type="button" key={link.id} onClick={() => scrollTo(link.id)}
                className="px-3 py-1.5 rounded-lg text-sm transition-all"
                style={{ color: activeSection === link.id ? POLY.accent : (isDay ? '#5a8a5a' : '#7bc47b'),
                  background: activeSection === link.id ? 'rgba(61,107,61,0.12)' : 'transparent',
                  fontWeight: activeSection === link.id ? 700 : 500 }}>
                {link.label}
              </button>
            ))}
          </div>
          {/* Day/night indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ background: isDay ? 'rgba(255,215,0,0.15)' : 'rgba(200,200,255,0.1)',
              color: isDay ? '#b8860b' : '#9090d0', border: `1px solid ${isDay ? 'rgba(255,215,0,0.3)' : 'rgba(200,200,255,0.2)'}` }}>
            {isDay ? <Sun size={12} /> : <Moon size={12} />}
            {isDay ? 'Day' : 'Night'}
          </div>
        </div>
      </nav>

      {/* ══════════════ HERO ══════════════ */}
      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-10 px-6">
        <motion.div style={{ y: heroParallax }} className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-8"
            style={{ background: isDay ? 'rgba(255,255,255,0.8)' : 'rgba(30,60,30,0.8)',
              color: POLY.accent, border: '1px solid rgba(61,107,61,0.3)', backdropFilter: 'blur(8px)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: POLY.accent }} />
            {data.personal.location}
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-5 leading-none tracking-tight">
            <span style={{
              background: isDay
                ? 'linear-gradient(135deg, #1a3a1a, #3d6b3d)'
                : 'linear-gradient(135deg, #7bc47b, #a8d8a8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
            }}>
              {data.personal.name}
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
            className="text-lg md:text-xl mb-3 font-semibold"
            style={{ color: isDay ? '#3d5a3d' : '#8fc48f' }}>
            {data.personal.title}
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-sm md:text-base mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ color: isDay ? '#5a7a5a' : '#6a9a6a' }}>
            {data.personal.tagline}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <motion.button onClick={() => scrollTo('projects')} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 rounded-xl font-bold text-sm text-white"
              style={{ background: `linear-gradient(135deg, #3d6b3d, #5a8c5a)`, boxShadow: '0 4px 20px rgba(61,107,61,0.4)' }}>
              View Projects
            </motion.button>
            <motion.button onClick={() => scrollTo('contact')} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 rounded-xl font-semibold text-sm"
              style={{ background: isDay ? 'rgba(255,255,255,0.8)' : 'rgba(30,60,30,0.8)',
                color: POLY.accent, border: '1px solid rgba(61,107,61,0.4)', backdropFilter: 'blur(8px)' }}>
              Get in Touch
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="inline-flex items-center gap-8 md:gap-16 px-8 py-4 rounded-2xl"
            style={{ background: isDay ? 'rgba(255,255,255,0.7)' : 'rgba(20,40,20,0.7)',
              border: '1px solid rgba(61,107,61,0.2)', backdropFilter: 'blur(12px)' }}>
            {[
              { label: 'Years Exp.', value: `${data.stats.yearsExperience}+` },
              { label: 'Projects', value: `${data.stats.projectsCompleted}+` },
              { label: 'Clients', value: `${data.stats.happyClients}+` },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-black" style={{ color: POLY.accent }}>{s.value}</div>
                <div className="text-xs mt-0.5" style={{ color: isDay ? '#5a7a5a' : '#6a9a6a' }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ChevronDown size={22} style={{ color: 'rgba(61,107,61,0.6)' }} />
        </motion.div>
      </section>

      {/* ══════════════ CONTENT ══════════════ */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 space-y-32">

        {/* About */}
        <section id="about">
          <FadeSection>
            <SectionHeading icon={User} title="About Me" />
          </FadeSection>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeSection delay={0.1}>
              <div className="relative w-56 h-56 md:w-72 md:h-72 mx-auto">
                <div className="w-full h-full rounded-2xl overflow-hidden"
                  style={{ border: '3px solid rgba(61,107,61,0.35)',
                    boxShadow: '0 8px 40px rgba(61,107,61,0.2)' }}>
                  <img src={data.personal.avatar} alt={data.personal.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-3 -right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
                  style={{ background: cardBg, border: cardBorder, color: POLY.accent, backdropFilter: 'blur(8px)' }}>
                  <MapPin size={11} /> {data.personal.location}
                </div>
              </div>
            </FadeSection>
            <FadeSection delay={0.2}>
              <div className="p-6 rounded-2xl mb-5"
                style={{ background: cardBg, border: `1px solid ${cardBorder}`, backdropFilter: 'blur(12px)' }}>
                <p className="text-sm leading-relaxed" style={{ color: textColor }}>{data.personal.bio}</p>
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
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(61,107,61,0.12)', border: '1px solid rgba(61,107,61,0.3)', color: POLY.accent }}>
                    <Icon size={15} />
                  </motion.a>
                ))}
              </div>
            </FadeSection>
          </div>
        </section>

        {/* Skills */}
        <section id="skills">
          <FadeSection><SectionHeading icon={Code2} title="Skills" /></FadeSection>
          <div className="grid sm:grid-cols-2 gap-8">
            {Object.entries(skillsByCategory).map(([cat, skills], ci) => (
              <FadeSection key={cat} delay={ci * 0.1}>
                <div className="p-6 rounded-2xl"
                  style={{ background: cardBg, border: `1px solid ${cardBorder}`, backdropFilter: 'blur(12px)' }}>
                  <h3 className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: POLY.accent }}>{cat}</h3>
                  {skills.map((skill, si) => <SkillBar key={skill.name} {...skill} delay={si} />)}
                </div>
              </FadeSection>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section id="projects">
          <FadeSection><SectionHeading icon={Layers} title="Projects" /></FadeSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.projects.map((p, i) => <ProjectCard key={p.title} project={p} index={i} />)}
          </div>
        </section>

        {/* Experience */}
        <section id="experience">
          <FadeSection><SectionHeading icon={Briefcase} title="Experience" /></FadeSection>
          <div className="relative">
            <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px"
              style={{ background: 'linear-gradient(to bottom, rgba(61,107,61,0.5), transparent)' }} />
            <div className="space-y-8">
              {data.experience.map((exp, i) => (
                <FadeSection key={i} delay={i * 0.1}>
                  <div className="flex gap-6 md:gap-10">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl flex items-center justify-center"
                        style={{ background: 'rgba(61,107,61,0.15)', border: '2px solid rgba(61,107,61,0.4)' }}>
                        <Briefcase size={14} style={{ color: POLY.accent }} />
                      </div>
                    </div>
                    <div className="flex-1 p-5 rounded-2xl"
                      style={{ background: cardBg, border: `1px solid ${cardBorder}`, backdropFilter: 'blur(10px)' }}>
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="text-sm font-black" style={{ color: textColor }}>{exp.role}</h3>
                          <p className="text-sm font-bold" style={{ color: POLY.accent }}>{exp.company}</p>
                        </div>
                        <span className="text-xs px-3 py-1 rounded-full"
                          style={{ background: 'rgba(61,107,61,0.12)', color: POLY.accent, border: '1px solid rgba(61,107,61,0.25)' }}>
                          {exp.period}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: isDay ? '#3a5a3a' : '#7a9a7a' }}>{exp.description}</p>
                    </div>
                  </div>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials">
          <FadeSection><SectionHeading icon={Quote} title="Testimonials" /></FadeSection>
          <div className="grid sm:grid-cols-2 gap-6">
            {data.testimonials.map((t, i) => (
              <FadeSection key={i} delay={i * 0.1}>
                <div className="p-6 rounded-2xl h-full"
                  style={{ background: cardBg, border: `1px solid ${cardBorder}`, backdropFilter: 'blur(12px)' }}>
                  <Quote size={22} className="mb-4" style={{ color: POLY.accent, opacity: 0.4 }} />
                  <p className="text-sm leading-relaxed mb-5" style={{ color: isDay ? '#3a5a3a' : '#7a9a7a' }}>{t.text}</p>
                  <div className="flex items-center gap-3">
                    <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover"
                      style={{ border: '2px solid rgba(61,107,61,0.3)' }} />
                    <div>
                      <p className="text-sm font-bold" style={{ color: textColor }}>{t.name}</p>
                      <p className="text-xs" style={{ color: isDay ? '#5a7a5a' : '#6a9a6a' }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeSection>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact">
          <FadeSection><SectionHeading icon={Mail} title="Contact" /></FadeSection>
          <div className="grid md:grid-cols-2 gap-10">
            <FadeSection delay={0.1}>
              <div className="p-6 rounded-2xl mb-4"
                style={{ background: cardBg, border: `1px solid ${cardBorder}`, backdropFilter: 'blur(12px)' }}>
                <h3 className="text-lg font-black mb-2" style={{ color: textColor }}>Let's build something together</h3>
                <p className="text-sm leading-relaxed mb-5" style={{ color: isDay ? '#3a5a3a' : '#7a9a7a' }}>
                  Whether you have a project in mind or just want to say hello, my inbox is always open.
                </p>
                <div className="space-y-3">
                  {[
                    { icon: Mail,     label: data.socials.email,     href: `mailto:${data.socials.email}` },
                    { icon: MapPin,   label: data.personal.location, href: '#' },
                    { icon: Github,   label: 'GitHub',               href: data.socials.github },
                    { icon: Linkedin, label: 'LinkedIn',             href: data.socials.linkedin },
                  ].map(({ icon: Icon, label, href }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm group" style={{ color: isDay ? '#3a5a3a' : '#7a9a7a' }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: 'rgba(61,107,61,0.12)', border: '1px solid rgba(61,107,61,0.25)' }}>
                        <Icon size={13} style={{ color: POLY.accent }} />
                      </div>
                      <span className="group-hover:text-green-700 transition-colors">{label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </FadeSection>
            <FadeSection delay={0.2}>
              <div className="p-6 rounded-2xl"
                style={{ background: cardBg, border: `1px solid ${cardBorder}`, backdropFilter: 'blur(12px)' }}>
                <ContactForm />
              </div>
            </FadeSection>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 px-6"
        style={{ borderTop: '1px solid rgba(61,107,61,0.15)' }}>
        <p className="text-xs" style={{ color: isDay ? '#5a7a5a' : '#6a9a6a' }}>
          {data.personal.name} © {new Date().getFullYear()} · Built with React + Framer Motion
        </p>
      </footer>
    </div>
  );
}
