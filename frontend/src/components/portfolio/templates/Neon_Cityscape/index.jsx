import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, MapPin, ExternalLink, Briefcase, Code2, ChevronDown, Quote, Send, User, Layers, Zap } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

/* ── Cyberpunk palette ─────────────────────────────────────────────── */
const NEON = {
  bg:      '#0a0010',
  surface: '#110022',
  card:    '#160028',
  pink:    '#ff2d78',
  cyan:    '#00f5ff',
  purple:  '#bf00ff',
  yellow:  '#ffe600',
  dark:    '#05000f',
  muted:   '#8b4fa8',
  text:    '#f0d0ff',
  textSub: '#7a5590',
};

/* ── Rain drop ─────────────────────────────────────────────────────── */
function RainDrop({ x, delay, duration }) {
  return (
    <motion.div className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: '-5px', width: 1, height: 12,
        background: 'linear-gradient(to bottom, transparent, rgba(0,245,255,0.4))' }}
      animate={{ y: ['0vh', '105vh'], opacity: [0, 0.6, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
    />
  );
}

/* ── Neon sign flicker ─────────────────────────────────────────────── */
function NeonSign({ text, color, x, y, size = 14, angle = 0 }) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() > 0.85) { setOn(false); setTimeout(() => setOn(true), 80 + Math.random() * 200); }
    }, 2000 + Math.random() * 3000);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{
      position: 'absolute', left: `${x}%`, top: `${y}%`, fontSize: size, fontWeight: 700,
      fontFamily: 'monospace', color: on ? color : 'transparent',
      textShadow: on ? `0 0 6px ${color}, 0 0 14px ${color}, 0 0 28px ${color}` : 'none',
      transform: `rotate(${angle}deg)`, opacity: on ? 0.85 : 0.05,
      transition: 'all 0.05s', pointerEvents: 'none', userSelect: 'none', letterSpacing: '0.1em',
    }}>{text}</div>
  );
}

/* ── City building silhouette ─────────────────────────────────────── */
function CityBuildings({ layer = 1 }) {
  const buildings = layer === 1
    ? [
        { x: 0,   w: 40,  h: 180 }, { x: 45,  w: 30, h: 220 }, { x: 80,  w: 50, h: 160 },
        { x: 135, w: 35,  h: 250 }, { x: 175, w: 55, h: 200 }, { x: 235, w: 40, h: 280 },
        { x: 280, w: 30,  h: 190 }, { x: 315, w: 60, h: 230 }, { x: 380, w: 45, h: 170 },
        { x: 430, w: 35,  h: 260 }, { x: 470, w: 50, h: 210 }, { x: 525, w: 40, h: 290 },
        { x: 570, w: 30,  h: 180 }, { x: 605, w: 55, h: 240 }, { x: 665, w: 42, h: 200 },
        { x: 712, w: 35,  h: 270 }, { x: 752, w: 48, h: 190 }, { x: 805, w: 38, h: 250 },
        { x: 848, w: 52,  h: 215 }, { x: 905, w: 40, h: 185 },
      ]
    : [
        { x: 0,   w: 60,  h: 120 }, { x: 65,  w: 45, h: 140 }, { x: 115, w: 70, h: 100 },
        { x: 190, w: 50,  h: 155 }, { x: 245, w: 65, h: 115 }, { x: 315, w: 55, h: 145 },
        { x: 375, w: 70,  h: 120 }, { x: 450, w: 48, h: 160 }, { x: 503, w: 62, h: 110 },
        { x: 570, w: 55,  h: 140 }, { x: 630, w: 68, h: 125 }, { x: 703, w: 52, h: 150 },
        { x: 760, w: 60,  h: 115 }, { x: 825, w: 50, h: 145 }, { x: 880, w: 65, h: 130 },
      ];
  const fill = layer === 1 ? '#1a0030' : '#120020';
  const winColors = [NEON.pink, NEON.cyan, NEON.yellow, NEON.purple];
  return (
    <svg viewBox="0 0 950 300" preserveAspectRatio="none"
      style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', height: 300 }}>
      {buildings.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={300 - b.h} width={b.w} height={b.h} fill={fill} />
          {Array.from({ length: Math.floor(b.h / 22) }).map((_, row) =>
            Array.from({ length: Math.floor(b.w / 14) }).map((_, col) => {
              const seed = (i * 31 + row * 7 + col * 13) % 100;
              if (seed > 50) return null;
              const c = winColors[(i + row + col) % winColors.length];
              return (
                <rect key={`${row}-${col}`}
                  x={b.x + 4 + col * 13} y={300 - b.h + 8 + row * 21}
                  width={7} height={10} fill={c} opacity={0.4 + (seed % 5) * 0.08} />
              );
            })
          )}
        </g>
      ))}
    </svg>
  );
}

/* ── Glitch text ──────────────────────────────────────────────────── */
function GlitchText({ text, className = '', style = {} }) {
  const [g, setG] = useState(false);
  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() > 0.7) { setG(true); setTimeout(() => setG(false), 120); }
    }, 3000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className={`relative inline-block ${className}`} style={style}>
      {text}
      {g && <>
        <span style={{ position: 'absolute', left: 2, top: 0, color: NEON.cyan, opacity: 0.7, clipPath: 'inset(20% 0 60% 0)' }}>{text}</span>
        <span style={{ position: 'absolute', left: -2, top: 0, color: NEON.pink, opacity: 0.7, clipPath: 'inset(60% 0 10% 0)' }}>{text}</span>
      </>}
    </span>
  );
}

/* ── Scroll fade wrapper ───────────────────────────────────────────── */
function FadeSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}>
      {children}
    </motion.div>
  );
}

/* ── Section heading ───────────────────────────────────────────────── */
function SectionHeading({ icon: Icon, title, accent = NEON.pink }) {
  return (
    <div className="flex items-center gap-3 mb-10">
      <div className="p-2.5 rounded-xl" style={{ background: `${accent}15`, border: `1px solid ${accent}35` }}>
        <Icon size={18} style={{ color: accent }} />
      </div>
      <h2 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: NEON.text }}>{title}</h2>
      <div className="flex-1 h-px ml-2" style={{ background: `linear-gradient(to right, ${accent}50, transparent)` }} />
    </div>
  );
}

/* ── Skill bar ─────────────────────────────────────────────────────── */
function SkillBar({ name, level, category, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const catColor = { Frontend: NEON.cyan, Backend: NEON.pink, DevOps: NEON.yellow, Design: NEON.purple };
  const c = catColor[category] || NEON.cyan;
  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-semibold" style={{ color: NEON.text }}>{name}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${c}18`, color: c, border: `1px solid ${c}40` }}>{category}</span>
          <span className="text-xs font-bold" style={{ color: c }}>{level}%</span>
        </div>
      </div>
      <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <motion.div className="h-full rounded-full"
          style={{ background: `linear-gradient(to right, ${c}90, ${c})`, boxShadow: `0 0 8px ${c}` }}
          initial={{ width: 0 }} animate={inView ? { width: `${level}%` } : {}}
          transition={{ duration: 1, delay: delay * 0.07, ease: 'easeOut' }} />
      </div>
    </div>
  );
}

/* ── Project card ──────────────────────────────────────────────────── */
function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false);
  const accent = index % 2 === 0 ? NEON.pink : NEON.cyan;
  return (
    <FadeSection delay={index * 0.1}>
      <motion.div className="relative rounded-2xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${NEON.card}, ${NEON.surface})`,
          border: `1px solid ${hovered ? accent : `${accent}25`}`,
          boxShadow: hovered ? `0 0 30px ${accent}25, 0 8px 32px rgba(0,0,0,0.6)` : '0 4px 16px rgba(0,0,0,0.5)',
          transition: 'all 0.3s ease',
        }}
        onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
        whileHover={{ y: -4 }}>
        <div className="relative h-44 overflow-hidden">
          <img src={project.image} alt={project.title} className="w-full h-full object-cover"
            style={{ filter: `saturate(0.3) brightness(0.5) hue-rotate(${index % 2 === 0 ? '300deg' : '180deg'})` }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 30%, ${NEON.dark}f0)` }} />
          <motion.div className="absolute inset-0" style={{ background: `${accent}10` }}
            animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.3 }} />
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 3px)' }} />
        </div>
        <div className="p-5">
          <h3 className="text-base font-black mb-2 tracking-tight" style={{ color: NEON.text }}>{project.title}</h3>
          <p className="text-sm leading-relaxed mb-4" style={{ color: NEON.muted }}>{project.description}</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.techStack.map((tech) => (
              <span key={tech} className="text-xs px-2 py-0.5 rounded"
                style={{ background: `${accent}12`, color: accent, border: `1px solid ${accent}30`, fontFamily: 'monospace' }}>
                {tech}
              </span>
            ))}
          </div>
          <div className="flex gap-3">
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg"
              style={{ background: `${accent}20`, color: accent, border: `1px solid ${accent}40` }}>
              <ExternalLink size={11} /> Live
            </a>
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.05)', color: NEON.muted, border: '1px solid rgba(255,255,255,0.1)' }}>
              <Github size={11} /> Code
            </a>
          </div>
        </div>
      </motion.div>
    </FadeSection>
  );
}

/* ── Testimonial card ──────────────────────────────────────────────── */
function TestimonialCard({ testimonial, index }) {
  return (
    <FadeSection delay={index * 0.1}>
      <div className="p-6 rounded-2xl h-full"
        style={{ background: `linear-gradient(135deg, ${NEON.card}, ${NEON.surface})`, border: `1px solid ${NEON.purple}20` }}>
        <Quote size={24} className="mb-4" style={{ color: NEON.purple, opacity: 0.5 }} />
        <p className="text-sm leading-relaxed mb-5" style={{ color: NEON.muted }}>{testimonial.text}</p>
        <div className="flex items-center gap-3">
          <img src={testimonial.avatar} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover"
            style={{ border: `2px solid ${NEON.purple}50`, filter: 'saturate(0.5) hue-rotate(280deg)' }} />
          <div>
            <p className="text-sm font-bold" style={{ color: NEON.text }}>{testimonial.name}</p>
            <p className="text-xs" style={{ color: NEON.muted }}>{testimonial.role}</p>
          </div>
        </div>
      </div>
    </FadeSection>
  );
}

/* ── Contact form ──────────────────────────────────────────────────── */
function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const inputStyle = {
    background: 'rgba(255,255,255,0.03)', border: `1px solid ${NEON.pink}30`, borderRadius: '8px',
    color: NEON.text, outline: 'none', width: '100%', padding: '0.75rem 1rem',
    fontSize: '0.875rem', fontFamily: 'monospace', transition: 'border-color 0.2s',
  };
  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div key="sent" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center">
          <motion.div animate={{ boxShadow: [`0 0 20px ${NEON.pink}60`, `0 0 50px ${NEON.pink}80`, `0 0 20px ${NEON.pink}60`] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ background: `${NEON.pink}20`, border: `2px solid ${NEON.pink}` }}>
            <Zap size={28} style={{ color: NEON.pink }} />
          </motion.div>
          <p className="text-lg font-black mb-1" style={{ color: NEON.pink }}>Transmission sent!</p>
          <p className="text-sm" style={{ color: NEON.muted }}>I'll ping you back soon.</p>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
          <input required style={inputStyle} placeholder="// your_name" value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          <input required type="email" style={inputStyle} placeholder="// your_email" value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
          <textarea required rows={4} style={{ ...inputStyle, resize: 'none' }} placeholder="// your_message..."
            value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
          <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 tracking-widest uppercase"
            style={{ background: `linear-gradient(135deg, ${NEON.pink}25, ${NEON.cyan}15)`, color: NEON.pink,
              border: `1px solid ${NEON.pink}50`, boxShadow: `0 0 20px ${NEON.pink}20` }}>
            <Send size={14} /> Transmit
          </motion.button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════ */
export default function NeonCityscape() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroParallax = useTransform(scrollYProgress, [0, 0.3], [0, -60]);
  const [activeSection, setActiveSection] = useState('hero');

  const rainDrops = Array.from({ length: 60 }, (_, i) => ({
    x: (i * 1.67) % 100, delay: (i * 0.05) % 3, duration: 0.6 + (i % 5) * 0.15,
  }));

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
      style={{ background: NEON.bg, fontFamily: "'Inter', sans-serif" }}>

      {/* Scanline */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-25"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.4) 0px, rgba(0,0,0,0.4) 1px, transparent 1px, transparent 4px)' }} />

      {/* CRT vignette */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,5,0.8) 100%)' }} />

      {/* Rain */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {rainDrops.map((r, i) => <RainDrop key={i} {...r} />)}
      </div>

      {/* Ambient neon signs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <NeonSign text="OPEN" color={NEON.pink}   x={5}  y={20} size={13} angle={-5} />
        <NeonSign text="24H"  color={NEON.cyan}   x={88} y={30} size={15} angle={3} />
        <NeonSign text="BAR"  color={NEON.yellow} x={12} y={55} size={12} />
        <NeonSign text="LIVE" color={NEON.purple} x={82} y={60} size={14} angle={-3} />
        <NeonSign text=">>>>" color={NEON.cyan}   x={45} y={15} size={11} />
      </div>

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        style={{ backdropFilter: 'blur(20px)', background: 'rgba(10,0,16,0.85)', borderBottom: `1px solid ${NEON.pink}20` }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <motion.div className="font-black text-base tracking-widest uppercase"
            style={{ color: NEON.pink, textShadow: `0 0 10px ${NEON.pink}` }}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            {data.personal.name.split(' ')[0]}<span style={{ color: NEON.cyan }}>.EXE</span>
          </motion.div>
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button key={link.id} onClick={() => scrollTo(link.id)}
                className="px-3 py-1.5 rounded text-xs font-bold uppercase tracking-widest transition-all font-mono"
                style={{
                  color: activeSection === link.id ? NEON.cyan : NEON.muted,
                  background: activeSection === link.id ? `${NEON.cyan}12` : 'transparent',
                  borderBottom: activeSection === link.id ? `1px solid ${NEON.cyan}` : '1px solid transparent',
                }}>
                {link.label}
              </button>
            ))}
          </div>
          <a href={`mailto:${data.socials.email}`}
            className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded text-xs font-black uppercase tracking-widest"
            style={{ background: `${NEON.pink}15`, color: NEON.pink, border: `1px solid ${NEON.pink}40`, boxShadow: `0 0 10px ${NEON.pink}20` }}>
            <Mail size={12} /> Contact
          </a>
        </div>
      </nav>

      {/* ══════════════ HERO ══════════════ */}
      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
        {/* City layers */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden" style={{ height: 300, zIndex: 1 }}>
          <div style={{ opacity: 0.5 }}><CityBuildings layer={2} /></div>
          <CityBuildings layer={1} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 30,
            background: `linear-gradient(to top, ${NEON.bg}, transparent)` }} />
        </div>

        {/* Glow beams */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: '60%', zIndex: 0 }}>
          {[10, 25, 40, 58, 72, 85].map((x, i) => (
            <div key={i} style={{ position: 'absolute', bottom: 0, left: `${x}%`, width: 2, height: '100%',
              background: `linear-gradient(to top, ${i % 2 === 0 ? NEON.pink : NEON.cyan}60, transparent)`,
              filter: 'blur(6px)', opacity: 0.4 }} />
          ))}
        </div>

        <motion.div style={{ y: heroParallax }} className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded text-xs font-black uppercase tracking-widest mb-8 font-mono"
            style={{ background: `${NEON.pink}10`, color: NEON.pink, border: `1px solid ${NEON.pink}30`, boxShadow: `0 0 20px ${NEON.pink}15` }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: NEON.pink }} />
            System Online
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-5 leading-none tracking-tight">
            <GlitchText text={data.personal.name.split(' ')[0]} style={{ color: NEON.text }} />
            {' '}
            <GlitchText text={data.personal.name.split(' ').slice(1).join(' ')} style={{
              background: `linear-gradient(135deg, ${NEON.pink}, ${NEON.cyan})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              filter: `drop-shadow(0 0 20px ${NEON.pink}60)`,
            }} />
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="text-base md:text-lg mb-4 font-mono" style={{ color: NEON.cyan, textShadow: `0 0 10px ${NEON.cyan}50` }}>
            &gt; {data.personal.title}
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
            className="text-sm md:text-base mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: NEON.muted }}>
            {data.personal.tagline}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <motion.button onClick={() => scrollTo('projects')} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 rounded font-black text-sm uppercase tracking-widest"
              style={{ background: `linear-gradient(135deg, ${NEON.pink}30, ${NEON.pink}15)`, color: NEON.pink,
                border: `1px solid ${NEON.pink}60`, boxShadow: `0 0 30px ${NEON.pink}20` }}>
              Load Projects
            </motion.button>
            <motion.button onClick={() => scrollTo('contact')} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 rounded font-black text-sm uppercase tracking-widest"
              style={{ background: `${NEON.cyan}10`, color: NEON.cyan, border: `1px solid ${NEON.cyan}30` }}>
              Init Contact
            </motion.button>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-10 md:gap-20">
            {[
              { label: 'YRS_EXP',  value: `${data.stats.yearsExperience}+` },
              { label: 'PROJECTS', value: `${data.stats.projectsCompleted}+` },
              { label: 'CLIENTS',  value: `${data.stats.happyClients}+` },
            ].map((s) => (
              <div key={s.label} className="text-center font-mono">
                <div className="text-2xl md:text-3xl font-black" style={{ color: NEON.pink, textShadow: `0 0 15px ${NEON.pink}` }}>{s.value}</div>
                <div className="text-xs mt-1 tracking-widest" style={{ color: NEON.muted }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ChevronDown size={22} style={{ color: `${NEON.pink}60` }} />
        </motion.div>
      </section>

      {/* ══════════════ CONTENT ══════════════ */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 space-y-32">

        {/* About */}
        <section id="about">
          <FadeSection><SectionHeading icon={User} title="About" accent={NEON.cyan} /></FadeSection>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeSection delay={0.1}>
              <div className="relative w-56 h-56 md:w-72 md:h-72 mx-auto">
                <div className="w-full h-full rounded-2xl overflow-hidden"
                  style={{ border: `2px solid ${NEON.pink}40`, boxShadow: `0 0 40px ${NEON.pink}20, 0 0 80px ${NEON.cyan}10` }}>
                  <img src={data.personal.avatar} alt={data.personal.name} className="w-full h-full object-cover"
                    style={{ filter: 'saturate(0.4) hue-rotate(280deg) brightness(0.8)' }} />
                  <div className="absolute inset-0"
                    style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 1px, transparent 1px, transparent 3px)' }} />
                </div>
                <div className="absolute -bottom-3 -right-3 flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold font-mono"
                  style={{ background: NEON.card, border: `1px solid ${NEON.cyan}40`, color: NEON.cyan }}>
                  <MapPin size={10} /> {data.personal.location}
                </div>
              </div>
            </FadeSection>
            <FadeSection delay={0.2}>
              <p className="text-sm leading-relaxed mb-6 font-mono" style={{ color: NEON.muted }}>{data.personal.bio}</p>
              <div className="flex gap-3">
                {[
                  { icon: Github,   href: data.socials.github,              label: 'GitHub' },
                  { icon: Linkedin, href: data.socials.linkedin,            label: 'LinkedIn' },
                  { icon: Twitter,  href: data.socials.twitter,             label: 'Twitter' },
                  { icon: Mail,     href: `mailto:${data.socials.email}`,   label: 'Email' },
                ].map(({ icon: Icon, href, label }) => (
                  <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded flex items-center justify-center"
                    style={{ background: `${NEON.pink}10`, border: `1px solid ${NEON.pink}30`, color: NEON.muted }}
                    title={label}>
                    <Icon size={15} />
                  </motion.a>
                ))}
              </div>
            </FadeSection>
          </div>
        </section>

        {/* Skills */}
        <section id="skills">
          <FadeSection><SectionHeading icon={Code2} title="Skills" accent={NEON.pink} /></FadeSection>
          <div className="grid sm:grid-cols-2 gap-8">
            {Object.entries(skillsByCategory).map(([cat, skills], ci) => (
              <FadeSection key={cat} delay={ci * 0.1}>
                <div className="p-6 rounded-xl"
                  style={{ background: `linear-gradient(135deg, ${NEON.card}, ${NEON.surface})`, border: `1px solid ${NEON.pink}15` }}>
                  <h3 className="text-xs font-black uppercase tracking-widest mb-4 font-mono" style={{ color: NEON.muted }}>{cat}</h3>
                  {skills.map((skill, si) => <SkillBar key={skill.name} {...skill} delay={si} />)}
                </div>
              </FadeSection>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section id="projects">
          <FadeSection><SectionHeading icon={Layers} title="Projects" accent={NEON.cyan} /></FadeSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.projects.map((p, i) => <ProjectCard key={p.title} project={p} index={i} />)}
          </div>
        </section>

        {/* Experience */}
        <section id="experience">
          <FadeSection><SectionHeading icon={Briefcase} title="Experience" accent={NEON.purple} /></FadeSection>
          <div className="relative">
            <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px"
              style={{ background: `linear-gradient(to bottom, ${NEON.pink}50, ${NEON.cyan}20, transparent)` }} />
            <div className="space-y-8">
              {data.experience.map((exp, i) => (
                <FadeSection key={i} delay={i * 0.1}>
                  <div className="flex gap-6 md:gap-10">
                    <div className="relative flex-shrink-0">
                      <motion.div className="w-8 h-8 md:w-12 md:h-12 rounded flex items-center justify-center z-10 relative"
                        style={{ background: `${NEON.pink}15`, border: `2px solid ${NEON.pink}50`, boxShadow: `0 0 15px ${NEON.pink}30` }}
                        whileInView={{ boxShadow: [`0 0 10px ${NEON.pink}30`, `0 0 25px ${NEON.pink}60`, `0 0 10px ${NEON.pink}30`] }}
                        transition={{ duration: 2, repeat: Infinity }}>
                        <Zap size={14} style={{ color: NEON.pink }} />
                      </motion.div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                        <div>
                          <h3 className="text-sm font-black" style={{ color: NEON.text }}>{exp.role}</h3>
                          <p className="text-sm font-black" style={{ color: NEON.pink, textShadow: `0 0 8px ${NEON.pink}50` }}>{exp.company}</p>
                        </div>
                        <span className="text-xs px-3 py-1 rounded font-mono"
                          style={{ background: `${NEON.cyan}10`, color: NEON.cyan, border: `1px solid ${NEON.cyan}25` }}>
                          {exp.period}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed mt-2 font-mono" style={{ color: NEON.muted }}>{exp.description}</p>
                    </div>
                  </div>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials">
          <FadeSection><SectionHeading icon={Quote} title="Reviews" accent={NEON.purple} /></FadeSection>
          <div className="grid sm:grid-cols-2 gap-6">
            {data.testimonials.map((t, i) => <TestimonialCard key={i} testimonial={t} index={i} />)}
          </div>
        </section>

        {/* Contact */}
        <section id="contact">
          <FadeSection><SectionHeading icon={Mail} title="Contact" accent={NEON.pink} /></FadeSection>
          <div className="grid md:grid-cols-2 gap-10">
            <FadeSection delay={0.1}>
              <h3 className="text-lg font-black mb-3 font-mono" style={{ color: NEON.text }}>
                <span style={{ color: NEON.cyan }}>&gt;</span> Let's build something
              </h3>
              <p className="text-sm leading-relaxed mb-6 font-mono" style={{ color: NEON.muted }}>
                Available for freelance, full-time, and consulting. Drop a line.
              </p>
              <div className="space-y-3">
                {[
                  { icon: Mail,     label: data.socials.email,     href: `mailto:${data.socials.email}` },
                  { icon: MapPin,   label: data.personal.location, href: '#' },
                  { icon: Github,   label: 'GitHub',               href: data.socials.github },
                  { icon: Linkedin, label: 'LinkedIn',             href: data.socials.linkedin },
                ].map(({ icon: Icon, label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm group font-mono" style={{ color: NEON.muted }}>
                    <div className="w-8 h-8 rounded flex items-center justify-center"
                      style={{ background: `${NEON.pink}10`, border: `1px solid ${NEON.pink}25` }}>
                      <Icon size={13} style={{ color: NEON.pink }} />
                    </div>
                    <span className="group-hover:text-pink-400 transition-colors">{label}</span>
                  </a>
                ))}
              </div>
            </FadeSection>
            <FadeSection delay={0.2}>
              <div className="p-6 rounded-xl"
                style={{ background: `linear-gradient(135deg, ${NEON.card}, ${NEON.surface})`, border: `1px solid ${NEON.pink}20` }}>
                <ContactForm />
              </div>
            </FadeSection>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 px-6 font-mono"
        style={{ borderTop: `1px solid ${NEON.pink}15` }}>
        <p className="text-xs" style={{ color: NEON.muted }}>
          {data.personal.name} © {new Date().getFullYear()} · Built with React + Framer Motion
        </p>
      </footer>
    </div>
  );
}
