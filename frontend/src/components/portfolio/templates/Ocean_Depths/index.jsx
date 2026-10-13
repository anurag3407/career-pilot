import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, MapPin, ExternalLink, Star, Briefcase, Code2, ChevronDown, Quote, Send, User, Layers } from 'lucide-react';

/* ── Bioluminescent palette ────────────────────────────────────────── */
const OCEAN = {
  surface:   '#0a1628',
  deep:      '#040d1a',
  mid:       '#0d2240',
  glow:      '#00e5ff',
  bio:       '#39ff9f',
  coral:     '#ff6b6b',
  jellyfish: '#bf9fff',
  sand:      '#c8a96e',
};

/* ── Floating bubble component ─────────────────────────────────────── */
function Bubble({ x, delay, size, opacity }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        bottom: '-20px',
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 30%, rgba(0,229,255,${opacity * 1.5}), rgba(0,229,255,${opacity * 0.3}))`,
        boxShadow: `0 0 ${size}px rgba(0,229,255,${opacity})`,
        border: `1px solid rgba(0,229,255,${opacity * 0.6})`,
      }}
      animate={{ y: [0, -900], opacity: [opacity, 0], x: [0, Math.sin(delay) * 30] }}
      transition={{ duration: 8 + delay * 3, delay, repeat: Infinity, ease: 'linear' }}
    />
  );
}

/* ── Animated fish SVG ─────────────────────────────────────────────── */
function Fish({ y, direction, color, scale = 1, delay = 0 }) {
  const { portfolioData: data } = usePortfolio();

  const startX = direction === 'right' ? '-120px' : 'calc(100vw + 120px)';
  const endX   = direction === 'right' ? 'calc(100vw + 120px)' : '-120px';
  return (
    <motion.svg
      viewBox="0 0 80 40"
      style={{
        position: 'absolute',
        top: y,
        width: 80 * scale,
        height: 40 * scale,
        scaleX: direction === 'left' ? -1 : 1,
        filter: `drop-shadow(0 0 6px ${color})`,
      }}
      animate={{ x: [startX, endX], y: [0, -15, 10, -5, 0] }}
      transition={{ duration: 18 + delay * 4, delay, repeat: Infinity, ease: 'linear' }}
    >
      <ellipse cx="35" cy="20" rx="25" ry="13" fill={color} opacity="0.85" />
      <polygon points="60,20 75,8 75,32" fill={color} opacity="0.7" />
      <circle cx="18" cy="17" r="3" fill="rgba(0,0,0,0.5)" />
      <circle cx="17" cy="16" r="1" fill="white" />
      <line x1="25" y1="12" x2="25" y2="28" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
      <line x1="32" y1="9"  x2="32" y2="31" stroke="rgba(0,0,0,0.1)"  strokeWidth="1" />
    </motion.svg>
  );
}

/* ── Light ray component ───────────────────────────────────────────── */
function LightRay({ x, rotation, opacity }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <motion.div
      className="absolute top-0 pointer-events-none origin-top"
      style={{
        left: `${x}%`,
        width: '3px',
        height: '70vh',
        background: `linear-gradient(to bottom, rgba(0,229,255,${opacity}), transparent)`,
        rotate: rotation,
        filter: 'blur(8px)',
      }}
      animate={{ opacity: [opacity, opacity * 0.4, opacity] }}
      transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

/* ── Coral SVG ─────────────────────────────────────────────────────── */
function CoralCluster({ x, color, scale = 1, flip = false }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <motion.svg
      viewBox="0 0 100 120"
      style={{
        position: 'absolute',
        bottom: 0,
        left: `${x}%`,
        width: 60 * scale,
        height: 80 * scale,
        scaleX: flip ? -1 : 1,
        filter: `drop-shadow(0 0 8px ${color})`,
        opacity: 0.85,
      }}
      animate={{ scaleY: [1, 1.03, 1] }}
      transition={{ duration: 3 + scale, repeat: Infinity, ease: 'easeInOut' }}
    >
      <path d="M50,110 Q48,80 45,60 Q40,40 35,20 Q38,18 42,22 Q45,40 48,60 Q50,80 52,110Z" fill={color} />
      <path d="M50,110 Q52,75 60,55 Q68,38 72,15 Q75,13 78,16 Q74,38 66,56 Q58,75 54,110Z" fill={color} opacity="0.8" />
      <path d="M50,110 Q45,78 38,65 Q30,50 25,30 Q22,28 24,32 Q28,50 36,65 Q44,78 50,110Z" fill={color} opacity="0.7" />
      <ellipse cx="35" cy="20"  rx="5" ry="5"  fill={color} />
      <ellipse cx="72" cy="15"  rx="5" ry="5"  fill={color} opacity="0.9" />
      <ellipse cx="25" cy="30"  rx="4" ry="4"  fill={color} opacity="0.8" />
    </motion.svg>
  );
}

/* ── Section fade-in wrapper ───────────────────────────────────────── */
function FadeSection({ children, className = '', delay = 0 }) {
  const { portfolioData: data } = usePortfolio();

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

/* ── Section heading ───────────────────────────────────────────────── */
function SectionHeading({ icon: Icon, title }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="flex items-center gap-3 mb-10">
      <div className="p-2.5 rounded-xl" style={{ background: 'rgba(0,229,255,0.12)', border: '1px solid rgba(0,229,255,0.25)' }}>
        <Icon size={20} style={{ color: OCEAN.glow }} />
      </div>
      <h2 className="text-2xl md:text-3xl font-bold" style={{ color: '#e0f7fa' }}>{title}</h2>
      <div className="flex-1 h-px ml-2" style={{ background: 'linear-gradient(to right, rgba(0,229,255,0.3), transparent)' }} />
    </div>
  );
}

/* ── Skill bar ─────────────────────────────────────────────────────── */
function SkillBar({ name, level, category, delay }) {
  const { portfolioData: data } = usePortfolio();

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const catColor = { Frontend: OCEAN.glow, Backend: OCEAN.bio, DevOps: OCEAN.coral, Design: OCEAN.jellyfish };
  const barColor = catColor[category] || OCEAN.glow;
  return (
    <div ref={ref} className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium" style={{ color: '#cce7f0' }}>{name}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${barColor}20`, color: barColor, border: `1px solid ${barColor}40` }}>{category}</span>
          <span className="text-xs" style={{ color: barColor }}>{level}%</span>
        </div>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(to right, ${barColor}aa, ${barColor})`, boxShadow: `0 0 8px ${barColor}80` }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : {}}
          transition={{ duration: 1, delay: delay * 0.08, ease: 'easeOut' }}
        />
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
      <motion.div
        className="relative rounded-2xl overflow-hidden cursor-pointer"
        style={{
          background: `linear-gradient(135deg, ${OCEAN.mid}, ${OCEAN.surface})`,
          border: `1px solid ${hovered ? 'rgba(0,229,255,0.4)' : 'rgba(0,229,255,0.12)'}`,
          boxShadow: hovered ? `0 0 30px rgba(0,229,255,0.15), 0 8px 32px rgba(0,0,0,0.5)` : `0 4px 16px rgba(0,0,0,0.4)`,
          transition: 'all 0.35s ease',
        }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ y: -4 }}
      >
        <div className="relative h-44 overflow-hidden">
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" style={{ filter: 'saturate(0.7) brightness(0.6)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(4,13,26,0.95))' }} />
          <motion.div
            className="absolute inset-0"
            style={{ background: 'rgba(0,229,255,0.08)' }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="p-5">
          <h3 className="text-lg font-bold mb-2" style={{ color: '#e0f7fa' }}>{project.title}</h3>
          <p className="text-sm leading-relaxed mb-4" style={{ color: '#7ab8c8' }}>{project.description}</p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.techStack.map((tech) => (
              <span key={tech} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,229,255,0.1)', color: OCEAN.glow, border: '1px solid rgba(0,229,255,0.2)' }}>
                {tech}
              </span>
            ))}
          </div>
          <div className="flex gap-3">
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
              style={{ background: 'rgba(0,229,255,0.15)', color: OCEAN.glow, border: '1px solid rgba(0,229,255,0.3)' }}>
              <ExternalLink size={12} /> Live
            </a>
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', color: '#9ab8c5', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Github size={12} /> Code
            </a>
          </div>
        </div>
      </motion.div>
    </FadeSection>
  );
}

/* ── Testimonial card ──────────────────────────────────────────────── */
function TestimonialCard({ testimonial, index }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <FadeSection delay={index * 0.12}>
      <div className="relative p-6 rounded-2xl h-full" style={{
        background: `linear-gradient(135deg, ${OCEAN.mid}, ${OCEAN.deep})`,
        border: '1px solid rgba(0,229,255,0.12)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}>
        <Quote size={28} className="mb-4 opacity-40" style={{ color: OCEAN.glow }} />
        <p className="text-sm leading-relaxed mb-5" style={{ color: '#9abfcc' }}>{testimonial.text}</p>
        <div className="flex items-center gap-3">
          <img src={testimonial.avatar} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover" style={{ border: `2px solid rgba(0,229,255,0.3)`, filter: 'saturate(0.8)' }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: '#e0f7fa' }}>{testimonial.name}</p>
            <p className="text-xs" style={{ color: '#5a8fa0' }}>{testimonial.role}</p>
          </div>
        </div>
      </div>
    </FadeSection>
  );
}

/* ── Contact form ──────────────────────────────────────────────────── */
function ContactForm() {
  const { portfolioData: data } = usePortfolio();

  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const handleSubmit = (e) => { e.preventDefault(); setSent(true); };
  const inputStyle = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(0,229,255,0.2)',
    borderRadius: '10px',
    color: '#cce7f0',
    outline: 'none',
    width: '100%',
    padding: '0.75rem 1rem',
    fontSize: '0.875rem',
    transition: 'border-color 0.2s',
  };
  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div key="sent" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-16 text-center">
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: 3, duration: 0.4 }}
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ background: 'rgba(57,255,159,0.15)', border: '2px solid rgba(57,255,159,0.4)' }}>
            <Send size={28} style={{ color: OCEAN.bio }} />
          </motion.div>
          <p className="text-lg font-semibold mb-1" style={{ color: OCEAN.bio }}>Message sent!</p>
          <p className="text-sm" style={{ color: '#5a8fa0' }}>Thanks for reaching out. I'll get back to you soon.</p>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={handleSubmit} className="space-y-4">
          <input required style={inputStyle} placeholder="Your Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          <input required type="email" style={inputStyle} placeholder="Your Email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
          <textarea required rows={4} style={{ ...inputStyle, resize: 'none' }} placeholder="Your message..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
          <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
            style={{ background: `linear-gradient(135deg, rgba(0,229,255,0.25), rgba(0,229,255,0.15))`, color: OCEAN.glow, border: '1px solid rgba(0,229,255,0.35)', boxShadow: '0 0 20px rgba(0,229,255,0.1)' }}>
            <Send size={15} /> Send Message
          </motion.button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

/* ── Jellyfish ambient element ─────────────────────────────────────── */
function Jellyfish({ x, y, delay = 0 }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <motion.svg viewBox="0 0 60 80" style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: 50, height: 70, opacity: 0.25, pointerEvents: 'none', filter: 'blur(1px)' }}
      animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
      transition={{ duration: 6 + delay, delay, repeat: Infinity, ease: 'easeInOut' }}>
      <ellipse cx="30" cy="25" rx="22" ry="18" fill={OCEAN.jellyfish} />
      <path d="M15,38 Q14,55 12,70" stroke={OCEAN.jellyfish} strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M22,40 Q21,58 19,72" stroke={OCEAN.jellyfish} strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M30,42 Q30,60 30,74" stroke={OCEAN.jellyfish} strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M38,40 Q39,58 41,72" stroke={OCEAN.jellyfish} strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M45,38 Q46,55 48,70" stroke={OCEAN.jellyfish} strokeWidth="1.5" fill="none" opacity="0.6" />
    </motion.svg>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════════════ */
export default function OceanDepths() {
  const { portfolioData: data } = usePortfolio();

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroParallax = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const [activeSection, setActiveSection] = useState('hero');

  const bubbles = Array.from({ length: 18 }, (_, i) => ({
    x: Math.random() * 100, delay: i * 0.7, size: `${4 + Math.random() * 10}px`, opacity: 0.3 + Math.random() * 0.4,
  }));

  const rays = [8, 18, 30, 45, 60, 72, 85];
  const skillsByCategory = data.skills.reduce((acc, s) => { (acc[s.category] = acc[s.category] || []).push(s); return acc; }, {});

  const navLinks = [
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'contact', label: 'Contact' },
  ];

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(id);
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-x-hidden" style={{ background: OCEAN.deep, fontFamily: "'Inter', sans-serif" }}>

      {/* ── Fixed ocean atmosphere overlay ── */}
      <div className="fixed inset-0 pointer-events-none z-0" style={{
        background: `radial-gradient(ellipse at 50% 0%, rgba(0,80,120,0.3) 0%, transparent 70%),
                     radial-gradient(ellipse at 80% 60%, rgba(0,40,80,0.2) 0%, transparent 60%)`,
      }} />

      {/* ── Ambient jellyfish ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <Jellyfish x={8}  y={15} delay={0} />
        <Jellyfish x={88} y={35} delay={2.5} />
        <Jellyfish x={50} y={55} delay={1.2} />
      </div>

      {/* ── Bubbles ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {bubbles.map((b, i) => <Bubble key={i} {...b} />)}
      </div>

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4" style={{ backdropFilter: 'blur(20px)', background: 'rgba(4,13,26,0.75)', borderBottom: '1px solid rgba(0,229,255,0.1)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <motion.div className="font-bold text-base tracking-tight" style={{ color: OCEAN.glow }}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            {data.personal.name.split(' ')[0]}<span style={{ color: '#5a8fa0' }}>.dev</span>
          </motion.div>
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button type="button" key={link.id} onClick={() => scrollTo(link.id)}
                className="px-3 py-1.5 rounded-lg text-sm transition-all"
                style={{ color: activeSection === link.id ? OCEAN.glow : '#5a8fa0', background: activeSection === link.id ? 'rgba(0,229,255,0.1)' : 'transparent' }}>
                {link.label}
              </button>
            ))}
          </div>
          <a href={`mailto:${data.socials.email}`}
            className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold"
            style={{ background: 'rgba(0,229,255,0.12)', color: OCEAN.glow, border: '1px solid rgba(0,229,255,0.25)' }}>
            <Mail size={13} /> Contact
          </a>
        </div>
      </nav>

      {/* ══════════════ HERO ══════════════ */}
      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
        {/* Light rays */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {rays.map((x, i) => <LightRay key={i} x={x} rotation={`${(i % 2 === 0 ? 1 : -1) * (i + 1) * 2}deg`} opacity={0.06 + (i % 3) * 0.03} />)}
        </div>

        {/* Fish layers */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
          <Fish y="15%" direction="right" color={OCEAN.glow}      scale={0.7} delay={0} />
          <Fish y="35%" direction="left"  color="#5ce6b5"          scale={0.9} delay={3} />
          <Fish y="55%" direction="right" color={OCEAN.jellyfish}  scale={0.6} delay={1.5} />
          <Fish y="70%" direction="left"  color={OCEAN.coral}      scale={0.8} delay={5} />
          <Fish y="80%" direction="right" color="#5bc8e0"          scale={0.55} delay={2} />
        </div>

        {/* Coral bottom */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden" style={{ height: 140, zIndex: 2 }}>
          <CoralCluster x={2}  color={OCEAN.coral}     scale={1.5} />
          <CoralCluster x={10} color="#ff9a9a"          scale={1.1} flip />
          <CoralCluster x={22} color={OCEAN.bio}        scale={0.9} />
          <CoralCluster x={35} color={OCEAN.glow}       scale={1.3} flip />
          <CoralCluster x={50} color={OCEAN.coral}      scale={1}   />
          <CoralCluster x={62} color={OCEAN.jellyfish}  scale={1.4} flip />
          <CoralCluster x={75} color={OCEAN.bio}        scale={1.1} />
          <CoralCluster x={86} color="#ff9a9a"          scale={0.8} />
          <CoralCluster x={93} color={OCEAN.glow}       scale={1.2} flip />
          <div className="absolute bottom-0 left-0 right-0 h-12" style={{ background: `linear-gradient(to top, ${OCEAN.deep}, transparent)` }} />
        </div>

        {/* Hero content */}
        <motion.div style={{ y: heroParallax }} className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest mb-8"
            style={{ background: 'rgba(0,229,255,0.08)', color: OCEAN.glow, border: '1px solid rgba(0,229,255,0.2)', boxShadow: '0 0 20px rgba(0,229,255,0.1)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: OCEAN.bio }} />
            Available for work
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-5 leading-none tracking-tight">
            <span style={{ color: '#e0f7fa' }}>{data.personal.name.split(' ')[0]}</span>{' '}
            <span style={{
              background: `linear-gradient(135deg, ${OCEAN.glow}, ${OCEAN.bio}, ${OCEAN.jellyfish})`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 20px rgba(0,229,255,0.4))',
            }}>{data.personal.name.split(' ').slice(1).join(' ')}</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl mb-4 font-light" style={{ color: '#7ab8c8' }}>
            {data.personal.title}
          </motion.p>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.45 }}
            className="text-sm md:text-base mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: '#4a7a8a' }}>
            {data.personal.tagline}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <motion.button onClick={() => scrollTo('projects')} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 rounded-xl font-semibold text-sm"
              style={{ background: `linear-gradient(135deg, rgba(0,229,255,0.25), rgba(0,229,255,0.15))`, color: OCEAN.glow, border: '1px solid rgba(0,229,255,0.4)', boxShadow: '0 0 30px rgba(0,229,255,0.15)' }}>
              Explore My Work
            </motion.button>
            <motion.button onClick={() => scrollTo('contact')} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 rounded-xl font-semibold text-sm"
              style={{ background: 'rgba(255,255,255,0.05)', color: '#9ab8c5', border: '1px solid rgba(255,255,255,0.1)' }}>
              Get in Touch
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-8 md:gap-16">
            {[
              { label: 'Years Exp.', value: `${data.stats.yearsExperience}+` },
              { label: 'Projects', value: `${data.stats.projectsCompleted}+` },
              { label: 'Clients', value: `${data.stats.happyClients}+` },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl md:text-3xl font-black" style={{ color: OCEAN.glow, textShadow: `0 0 20px ${OCEAN.glow}60` }}>{s.value}</div>
                <div className="text-xs mt-1" style={{ color: '#4a7a8a' }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ChevronDown size={22} style={{ color: 'rgba(0,229,255,0.4)' }} />
        </motion.div>
      </section>

      {/* ══════════════ MAIN CONTENT ══════════════ */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 space-y-32">

        {/* ── About ── */}
        <section id="about">
          <FadeSection>
            <SectionHeading icon={User} title="About Me" />
          </FadeSection>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeSection delay={0.1}>
              <div className="relative">
                <div className="w-56 h-56 md:w-72 md:h-72 mx-auto rounded-2xl overflow-hidden" style={{
                  border: '2px solid rgba(0,229,255,0.25)',
                  boxShadow: `0 0 50px rgba(0,229,255,0.15), 0 20px 60px rgba(0,0,0,0.6)`,
                }}>
                  <img src={data.personal.avatar} alt={data.personal.name} className="w-full h-full object-cover" style={{ filter: 'saturate(0.75)' }} />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,229,255,0.05), rgba(57,255,159,0.05))' }} />
                </div>
                <div className="absolute -bottom-3 -right-3 md:right-8 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold"
                  style={{ background: OCEAN.mid, border: '1px solid rgba(0,229,255,0.25)', color: OCEAN.glow }}>
                  <MapPin size={12} /> {data.personal.location}
                </div>
              </div>
            </FadeSection>
            <FadeSection delay={0.2}>
              <p className="text-base leading-relaxed mb-6" style={{ color: '#7ab8c8' }}>{data.personal.bio}</p>
              <div className="flex gap-3">
                {[
                  { icon: Github,   href: data.socials.github,   label: 'GitHub' },
                  { icon: Linkedin, href: data.socials.linkedin, label: 'LinkedIn' },
                  { icon: Twitter,  href: data.socials.twitter,  label: 'Twitter' },
                  { icon: Mail,     href: `mailto:${data.socials.email}`, label: 'Email' },
                ].map(({ icon: Icon, href, label }) => (
                  <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.2)', color: '#5a8fa0' }}
                    title={label}>
                    <Icon size={16} />
                  </motion.a>
                ))}
              </div>
            </FadeSection>
          </div>
        </section>

        {/* ── Skills ── */}
        <section id="skills">
          <FadeSection>
            <SectionHeading icon={Code2} title="Skills" />
          </FadeSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {Object.entries(skillsByCategory).map(([cat, skills], ci) => (
              <FadeSection key={cat} delay={ci * 0.1}>
                <div className="p-6 rounded-2xl" style={{ background: `linear-gradient(135deg, ${OCEAN.mid}, ${OCEAN.surface})`, border: '1px solid rgba(0,229,255,0.1)' }}>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#4a7a8a' }}>{cat}</h3>
                  {skills.map((skill, si) => <SkillBar key={skill.name} {...skill} delay={si} />)}
                </div>
              </FadeSection>
            ))}
          </div>
        </section>

        {/* ── Projects ── */}
        <section id="projects">
          <FadeSection>
            <SectionHeading icon={Layers} title="Projects" />
          </FadeSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.projects.map((project, i) => <ProjectCard key={project.title} project={project} index={i} />)}
          </div>
        </section>

        {/* ── Experience ── */}
        <section id="experience">
          <FadeSection>
            <SectionHeading icon={Briefcase} title="Experience" />
          </FadeSection>
          <div className="relative">
            <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px" style={{ background: 'linear-gradient(to bottom, rgba(0,229,255,0.4), rgba(0,229,255,0.05))' }} />
            <div className="space-y-8">
              {data.experience.map((exp, i) => (
                <FadeSection key={i} delay={i * 0.1}>
                  <div className="flex gap-6 md:gap-10">
                    <div className="relative flex-shrink-0">
                      <motion.div className="w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center z-10 relative"
                        style={{ background: `linear-gradient(135deg, rgba(0,229,255,0.2), rgba(0,229,255,0.08))`, border: '2px solid rgba(0,229,255,0.35)', boxShadow: '0 0 15px rgba(0,229,255,0.2)' }}
                        whileInView={{ boxShadow: ['0 0 15px rgba(0,229,255,0.2)', '0 0 30px rgba(0,229,255,0.4)', '0 0 15px rgba(0,229,255,0.2)'] }}
                        transition={{ duration: 2, repeat: Infinity }}>
                        <Star size={14} style={{ color: OCEAN.glow }} />
                      </motion.div>
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                        <div>
                          <h3 className="text-base font-bold" style={{ color: '#e0f7fa' }}>{exp.role}</h3>
                          <p className="text-sm font-semibold" style={{ color: OCEAN.glow }}>{exp.company}</p>
                        </div>
                        <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(0,229,255,0.08)', color: '#4a7a8a', border: '1px solid rgba(0,229,255,0.15)' }}>{exp.period}</span>
                      </div>
                      <p className="text-sm leading-relaxed mt-2" style={{ color: '#5a8fa0' }}>{exp.description}</p>
                    </div>
                  </div>
                </FadeSection>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section id="testimonials">
          <FadeSection>
            <SectionHeading icon={Quote} title="Testimonials" />
          </FadeSection>
          <div className="grid sm:grid-cols-2 gap-6">
            {data.testimonials.map((t, i) => <TestimonialCard key={i} testimonial={t} index={i} />)}
          </div>
        </section>

        {/* ── Contact ── */}
        <section id="contact">
          <FadeSection>
            <SectionHeading icon={Mail} title="Contact" />
          </FadeSection>
          <div className="grid md:grid-cols-2 gap-10">
            <FadeSection delay={0.1}>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#e0f7fa' }}>Let's build something together</h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: '#5a8fa0' }}>Whether you have a project in mind or just want to say hello, my inbox is always open.</p>
              <div className="space-y-3">
                {[
                  { icon: Mail,     label: data.socials.email, href: `mailto:${data.socials.email}` },
                  { icon: MapPin,   label: data.personal.location, href: '#' },
                  { icon: Github,   label: 'GitHub',   href: data.socials.github },
                  { icon: Linkedin, label: 'LinkedIn', href: data.socials.linkedin },
                ].map(({ icon: Icon, label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm transition-colors group"
                    style={{ color: '#5a8fa0' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.15)' }}>
                      <Icon size={14} style={{ color: OCEAN.glow }} />
                    </div>
                    <span className="group-hover:text-cyan-400 transition-colors">{label}</span>
                  </a>
                ))}
              </div>
            </FadeSection>
            <FadeSection delay={0.2}>
              <div className="p-6 rounded-2xl" style={{ background: `linear-gradient(135deg, ${OCEAN.mid}, ${OCEAN.surface})`, border: '1px solid rgba(0,229,255,0.12)' }}>
                <ContactForm />
              </div>
            </FadeSection>
          </div>
        </section>
      </div>

      {/* ── Footer ── */}
      <footer className="relative z-10 text-center py-8 px-6" style={{ borderTop: '1px solid rgba(0,229,255,0.08)' }}>
        <p className="text-xs" style={{ color: '#2a4a5a' }}>
          Built with React & Framer Motion · {data.personal.name} © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
