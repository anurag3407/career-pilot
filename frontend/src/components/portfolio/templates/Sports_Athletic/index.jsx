import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import {
  Github, Linkedin, Twitter, Mail, MapPin, ExternalLink,
  ChevronDown, Star, Send, Briefcase, Code2, Calendar,
  ArrowUpRight, Trophy, Zap, Eye, Menu, X,
} from 'lucide-react';
import dummyData from '../../../../data/dummy_data.json';
import TrophyCabinet from './TrophyCabinet';

/* ─────────────────────────────────────────────
   DESIGN TOKENS — Sports Athletic palette
───────────────────────────────────────────── */
const S = {
  bg:       '#070707',
  bgCard:   '#0f0f0f',
  bgAlt:    '#0a0a0a',
  red:      '#e11d48',
  redDark:  '#9f1239',
  redGlow:  'rgba(225,29,72,0.35)',
  white:    '#f8fafc',
  muted:    '#94a3b8',
  mutedDim: '#64748b',
  border:   '#1a1a1a',
  borderLt: '#252525',
  gold:     '#f59e0b',
  accent:   '#e11d48',
};

const font = "'Inter', system-ui, sans-serif";

/* ─────────────────────────────────────────────
   KEYFRAME STYLES
───────────────────────────────────────────── */
const keyframeCSS = `
  @keyframes sa-pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
  @keyframes sa-slide { from{transform:translateX(-100%)} to{transform:translateX(100%)} }
  @keyframes sa-glow  { 0%,100%{box-shadow:0 0 20px ${S.redGlow}} 50%{box-shadow:0 0 40px ${S.redGlow}} }
`;

/* ─────────────────────────────────────────────
   ANIMATION VARIANTS
───────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' },
  }),
};

/* ─────────────────────────────────────────────
   SECTION LABEL
───────────────────────────────────────────── */
function SectionLabel({ children, color = S.red }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
      <div style={{ width: 3, height: 20, background: color }} />
      <span style={{
        fontFamily: font, fontSize: 11, fontWeight: 800,
        letterSpacing: '0.22em', textTransform: 'uppercase', color,
      }}>
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${S.border}, transparent)` }} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   DIVIDER
───────────────────────────────────────────── */
function Divider() {
  return (
    <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${S.border}, transparent)` }} />
  );
}

/* ─────────────────────────────────────────────
   NAV
───────────────────────────────────────────── */
function Nav({ data }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = ['About', 'Skills', 'Projects', 'Experience', 'Trophies', 'Contact'];
  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: scrolled ? `${S.bg}f0` : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? `1px solid ${S.border}` : 'none',
          transition: 'all 0.3s ease', padding: '0 24px',
        }}
      >
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64,
        }}>
          <span style={{
            fontFamily: font, fontSize: 20, fontWeight: 900,
            textTransform: 'uppercase', letterSpacing: '0.06em', color: S.white,
          }}>
            {data.personal.name.split(' ')[0]}
            <span style={{ color: S.red }}>.</span>
          </span>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <button key={link} onClick={() => scrollTo(link)} style={{
                fontFamily: font, fontSize: 12, fontWeight: 700, color: S.muted,
                background: 'none', border: 'none', cursor: 'pointer',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                transition: 'color 0.2s', padding: '4px 0',
              }}
                onMouseEnter={(e) => (e.currentTarget.style.color = S.red)}
                onMouseLeave={(e) => (e.currentTarget.style.color = S.muted)}
              >{link}</button>
            ))}
            <a href={`mailto:${data.socials.email}`} style={{
              fontFamily: font, fontSize: 12, fontWeight: 800,
              color: S.white, background: S.red, borderRadius: 0,
              padding: '10px 24px', textDecoration: 'none',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              transition: 'all 0.2s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = S.redDark; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = S.red; }}
            >Hire Me</a>
          </div>

          {/* Hamburger */}
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: S.white }}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed', top: 64, left: 0, right: 0, zIndex: 99,
              background: `${S.bg}f8`, backdropFilter: 'blur(20px)',
              borderBottom: `1px solid ${S.border}`, padding: 24,
              display: 'flex', flexDirection: 'column', gap: 4,
            }}
          >
            {links.map((link, i) => (
              <motion.button key={link} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }} onClick={() => scrollTo(link)}
                style={{
                  fontFamily: font, fontSize: 14, fontWeight: 700, color: S.muted,
                  background: 'none', border: 'none', cursor: 'pointer',
                  textAlign: 'left', padding: '12px 0',
                  borderBottom: `1px solid ${S.border}`,
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                }}
              >{link}</motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */
function Hero({ data }) {
  const { name, title, bio } = data.personal;
  const { yearsExperience, projectsCompleted, happyClients } = data.stats;

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacityParallax = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const stats = [
    { value: `${yearsExperience}+`, label: 'Years' },
    { value: `${projectsCompleted}+`, label: 'Projects' },
    { value: `${happyClients}+`, label: 'Clients' },
  ];

  return (
    <section ref={containerRef} style={{
      position: 'relative', minHeight: '100vh',
      background: S.bg, display: 'flex', flexDirection: 'column',
      justifyContent: 'center', overflow: 'hidden', paddingTop: 80,
    }}>
      {/* Background texture */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.03,
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 60px, ${S.white} 60px, ${S.white} 61px),
                          repeating-linear-gradient(90deg, transparent, transparent 60px, ${S.white} 60px, ${S.white} 61px)`,
        pointerEvents: 'none',
      }} />

      {/* Red accent glow */}
      <div style={{
        position: 'absolute', top: '20%', right: '-5%', width: 500, height: 500,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${S.redGlow} 0%, transparent 70%)`,
        filter: 'blur(80px)', pointerEvents: 'none',
      }} />

      <motion.div style={{ y: yParallax, opacity: opacityParallax, position: 'relative', zIndex: 2 }}
        className="px-6 md:px-12 lg:px-24"
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Tag */}
          <motion.div variants={fadeIn} custom={0} initial="hidden" animate="visible"
            style={{ marginBottom: 24 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: `${S.red}15`, border: `1px solid ${S.red}30`,
              padding: '6px 16px',
            }}>
              <Zap size={12} color={S.red} fill={S.red} />
              <span style={{
                fontFamily: font, fontSize: 11, fontWeight: 800,
                color: S.red, letterSpacing: '0.18em', textTransform: 'uppercase',
              }}>
                Full Stack Developer
              </span>
            </div>
          </motion.div>

          {/* Name */}
          <motion.h1 variants={fadeUp} custom={1} initial="hidden" animate="visible"
            style={{
              fontFamily: font, fontSize: 'clamp(48px, 10vw, 120px)',
              fontWeight: 900, lineHeight: 0.95, letterSpacing: '-0.03em',
              color: S.white, textTransform: 'uppercase', marginBottom: 16,
            }}
          >
            {name.split(' ')[0]}<br />
            <span style={{ color: S.red }}>{name.split(' ').slice(1).join(' ')}</span>
          </motion.h1>

          {/* Title */}
          <motion.p variants={fadeUp} custom={2} initial="hidden" animate="visible"
            style={{
              fontFamily: font, fontSize: 'clamp(14px, 2vw, 20px)',
              color: S.muted, marginBottom: 40, fontWeight: 400,
              letterSpacing: '0.04em', maxWidth: 500,
            }}
          >{title}</motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} custom={3} initial="hidden" animate="visible"
            style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 64 }}
          >
            <a href={`mailto:${data.socials.email}`} style={{
              fontFamily: font, fontSize: 13, fontWeight: 800, color: S.white,
              background: S.red, border: 'none', padding: '14px 36px',
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              transition: 'all 0.25s', boxShadow: `0 4px 30px ${S.redGlow}`,
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 40px ${S.redGlow}`; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 30px ${S.redGlow}`; }}
            >
              <Mail size={16} /> Get In Touch
            </a>
            <a href="#projects" style={{
              fontFamily: font, fontSize: 13, fontWeight: 700, color: S.muted,
              background: 'transparent', border: `1px solid ${S.border}`,
              padding: '14px 36px', textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              textTransform: 'uppercase', letterSpacing: '0.1em',
              transition: 'all 0.25s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = S.red; e.currentTarget.style.color = S.white; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = S.border; e.currentTarget.style.color = S.muted; }}
            >
              View Work <ArrowUpRight size={15} />
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeUp} custom={4} initial="hidden" animate="visible"
            style={{ display: 'flex', gap: 0, border: `1px solid ${S.border}`, width: 'fit-content' }}
          >
            {stats.map((stat, i) => (
              <div key={i} style={{
                padding: '20px 32px', textAlign: 'center',
                borderRight: i < stats.length - 1 ? `1px solid ${S.border}` : 'none',
                background: S.bgCard,
              }}>
                <div style={{ fontFamily: font, fontSize: 32, fontWeight: 900, color: S.red, lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{
                  fontFamily: font, fontSize: 10, fontWeight: 700, color: S.muted,
                  textTransform: 'uppercase', letterSpacing: '0.14em', marginTop: 4,
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        style={{
          position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 3,
        }}
      >
        <span style={{ fontFamily: font, fontSize: 10, color: S.mutedDim, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
          <ChevronDown size={18} color={S.mutedDim} />
        </motion.div>
      </motion.div>

      {/* Bottom accent line */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${S.red}, transparent)` }} />
    </section>
  );
}

/* ─────────────────────────────────────────────
   ABOUT
───────────────────────────────────────────── */
function About({ data }) {
  const { name, bio, avatar, location } = data.personal;
  const email = data.socials.email;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about" ref={ref} style={{ background: S.bgAlt, padding: '100px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Avatar */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6 }}
            style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}
          >
            <div style={{
              position: 'relative', width: 300, height: 360,
              overflow: 'hidden',
            }}>
              <img src={avatar} alt={name} style={{
                width: '100%', height: '100%', objectFit: 'cover',
                filter: 'grayscale(30%) contrast(1.1)',
              }} />
              {/* Red accent overlay */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%',
                background: `linear-gradient(to top, ${S.red}40, transparent)`,
                pointerEvents: 'none',
              }} />
              {/* Corner accent */}
              <div style={{
                position: 'absolute', top: -2, right: -2,
                width: 40, height: 40,
                borderTop: `3px solid ${S.red}`,
                borderRight: `3px solid ${S.red}`,
              }} />
              <div style={{
                position: 'absolute', bottom: -2, left: -2,
                width: 40, height: 40,
                borderBottom: `3px solid ${S.red}`,
                borderLeft: `3px solid ${S.red}`,
              }} />
            </div>
          </motion.div>

          {/* Text */}
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'}>
            <SectionLabel>About Me</SectionLabel>
            <motion.h2 variants={fadeUp} custom={1} style={{
              fontFamily: font, fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 900, color: S.white, lineHeight: 1.1,
              textTransform: 'uppercase', marginBottom: 24, letterSpacing: '-0.02em',
            }}>
              Driven by<br />
              <span style={{ color: S.red }}>Passion</span> & Code
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} style={{
              fontFamily: font, fontSize: 15, color: S.muted, lineHeight: 1.8, marginBottom: 32,
            }}>{bio}</motion.p>

            <motion.div variants={fadeUp} custom={3} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { Icon: MapPin, value: location },
                { Icon: Mail, value: email },
              ].map(({ Icon, value }) => (
                <div key={value} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36, height: 36,
                    background: `${S.red}15`, border: `1px solid ${S.red}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={16} color={S.red} />
                  </div>
                  <span style={{ fontFamily: font, fontSize: 14, color: S.muted }}>{value}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SKILLS
───────────────────────────────────────────── */
function Skills({ data }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const categories = [...new Set(data.skills.map((s) => s.category))];

  return (
    <section id="skills" ref={ref} style={{ background: S.bg, padding: '100px 24px', position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 64 }}>
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeIn} custom={0}>
            <SectionLabel>Arsenal</SectionLabel>
          </motion.div>
          <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={1}
            style={{
              fontFamily: font, fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 900, color: S.white, textTransform: 'uppercase', letterSpacing: '-0.02em',
            }}>
            Skills & <span style={{ color: S.red }}>Tech Stack</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, ci) => {
            const catSkills = data.skills.filter((s) => s.category === cat);
            return (
              <motion.div key={cat} initial="hidden" animate={inView ? 'visible' : 'hidden'}
                variants={fadeUp} custom={ci}
                style={{
                  background: S.bgCard, border: `1px solid ${S.border}`,
                  padding: 28, transition: 'border-color 0.25s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${S.red}50`)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}
              >
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: `${S.red}12`, padding: '5px 12px', marginBottom: 24,
                }}>
                  <div style={{ width: 6, height: 6, background: S.red }} />
                  <span style={{
                    fontFamily: font, fontSize: 11, fontWeight: 800, color: S.red,
                    letterSpacing: '0.16em', textTransform: 'uppercase',
                  }}>{cat}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {catSkills.map((skill, si) => (
                    <div key={skill.name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: S.white }}>{skill.name}</span>
                        <span style={{ fontFamily: font, fontSize: 12, color: S.muted, fontWeight: 700 }}>{skill.level}%</span>
                      </div>
                      <div style={{ height: 4, background: S.border, overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
                          transition={{ duration: 1, delay: ci * 0.1 + si * 0.06, ease: [0.22, 1, 0.36, 1] }}
                          style={{ height: '100%', background: `linear-gradient(90deg, ${S.red}, ${S.gold})` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Skill tags */}
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={4}
          style={{ marginTop: 48, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {data.skills.map((skill, i) => (
            <motion.span key={skill.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.4 + i * 0.03, duration: 0.3 }}
              whileHover={{ scale: 1.08, y: -2 }}
              style={{
                fontFamily: font, fontSize: 12, fontWeight: 600, color: S.muted,
                background: S.bgCard, border: `1px solid ${S.border}`,
                padding: '6px 14px', cursor: 'default', transition: 'all 0.2s',
              }}
            >{skill.name}</motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   PROJECTS
───────────────────────────────────────────── */
function Projects({ data }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [hovered, setHovered] = useState(null);

  return (
    <section id="projects" ref={ref} style={{ background: S.bgAlt, padding: '100px 24px', position: 'relative' }}>
      {/* Top accent */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${S.red}40, transparent)` }} />

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 64 }}>
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeIn} custom={0}>
            <SectionLabel>Portfolio</SectionLabel>
          </motion.div>
          <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={1}
            style={{
              fontFamily: font, fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 900, color: S.white, textTransform: 'uppercase', letterSpacing: '-0.02em',
            }}>
            Featured <span style={{ color: S.red }}>Projects</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.projects.map((project, i) => (
            <motion.div key={project.title}
              initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={i}
              onMouseEnter={() => setHovered(project.title)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: S.bgCard, border: `1px solid ${S.border}`,
                overflow: 'hidden', cursor: 'pointer',
                transition: 'border-color 0.3s, transform 0.3s',
                transform: hovered === project.title ? 'translateY(-4px)' : 'translateY(0)',
                borderColor: hovered === project.title ? `${S.red}50` : S.border,
              }}
            >
              {/* Image */}
              <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                <img src={project.image} alt={project.title} style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  transition: 'transform 0.5s',
                  transform: hovered === project.title ? 'scale(1.05)' : 'scale(1)',
                  filter: 'grayscale(20%)',
                }} />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `linear-gradient(to top, ${S.bg}, transparent 60%)`,
                }} />
                {/* Links */}
                <div style={{
                  position: 'absolute', bottom: 12, right: 12,
                  display: 'flex', gap: 8, opacity: hovered === project.title ? 1 : 0,
                  transition: 'opacity 0.3s',
                }}>
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" style={{
                      width: 36, height: 36, background: S.red,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: S.white, textDecoration: 'none',
                    }}>
                      <ExternalLink size={16} />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" style={{
                      width: 36, height: 36, background: S.bgCard,
                      border: `1px solid ${S.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: S.white, textDecoration: 'none',
                    }}>
                      <Github size={16} />
                    </a>
                  )}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '24px 24px 28px' }}>
                <h3 style={{
                  fontFamily: font, fontSize: 18, fontWeight: 800, color: S.white,
                  textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: 8,
                }}>{project.title}</h3>
                <p style={{
                  fontFamily: font, fontSize: 13, color: S.muted,
                  lineHeight: 1.7, marginBottom: 16,
                }}>{project.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {project.techStack.map((tech) => (
                    <span key={tech} style={{
                      fontFamily: font, fontSize: 10, fontWeight: 700, color: S.red,
                      background: `${S.red}12`, border: `1px solid ${S.red}25`,
                      padding: '3px 10px', textTransform: 'uppercase', letterSpacing: '0.08em',
                    }}>{tech}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   EXPERIENCE TIMELINE
───────────────────────────────────────────── */
function Experience({ data }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="experience" ref={ref} style={{ background: S.bg, padding: '100px 24px', position: 'relative' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ marginBottom: 64 }}>
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeIn} custom={0}>
            <SectionLabel>Career</SectionLabel>
          </motion.div>
          <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={1}
            style={{
              fontFamily: font, fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 900, color: S.white, textTransform: 'uppercase', letterSpacing: '-0.02em',
            }}>
            Experience <span style={{ color: S.red }}>Timeline</span>
          </motion.h2>
        </div>

        <div style={{ position: 'relative' }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute', left: 16, top: 0, bottom: 0, width: 2,
            background: `linear-gradient(to bottom, ${S.red}, ${S.border})`,
          }} />

          {data.experience.map((exp, i) => (
            <motion.div key={i}
              initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={i}
              style={{ position: 'relative', paddingLeft: 48, marginBottom: i < data.experience.length - 1 ? 48 : 0 }}
            >
              {/* Dot */}
              <div style={{
                position: 'absolute', left: 9, top: 6, width: 16, height: 16,
                background: i === 0 ? S.red : S.bgCard,
                border: `2px solid ${i === 0 ? S.red : S.border}`,
                zIndex: 2,
              }} />

              <div style={{
                background: S.bgCard, border: `1px solid ${S.border}`, padding: 28,
                transition: 'border-color 0.25s',
              }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${S.red}40`)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = S.border)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Calendar size={13} color={S.red} />
                  <span style={{
                    fontFamily: font, fontSize: 11, fontWeight: 700, color: S.red,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                  }}>{exp.period}</span>
                </div>
                <h3 style={{
                  fontFamily: font, fontSize: 18, fontWeight: 800, color: S.white,
                  textTransform: 'uppercase', marginBottom: 4,
                }}>{exp.role}</h3>
                <p style={{
                  fontFamily: font, fontSize: 13, fontWeight: 600, color: S.gold,
                  marginBottom: 12, letterSpacing: '0.04em',
                }}>{exp.company}</p>
                <p style={{
                  fontFamily: font, fontSize: 14, color: S.muted, lineHeight: 1.7,
                }}>{exp.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CONTACT
───────────────────────────────────────────── */
function Contact({ data }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const socials = [
    { href: data.socials.github, Icon: Github, label: 'GitHub' },
    { href: data.socials.linkedin, Icon: Linkedin, label: 'LinkedIn' },
    { href: data.socials.twitter, Icon: Twitter, label: 'Twitter' },
    { href: `mailto:${data.socials.email}`, Icon: Mail, label: 'Email' },
  ];

  return (
    <section id="contact" ref={ref} style={{ background: S.bgAlt, padding: '100px 24px', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${S.red}40, transparent)` }} />

      <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeIn} custom={0}
          style={{ display: 'flex', justifyContent: 'center' }}>
          <SectionLabel>Contact</SectionLabel>
        </motion.div>

        <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={1}
          style={{
            fontFamily: font, fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 900, color: S.white, textTransform: 'uppercase',
            letterSpacing: '-0.02em', marginBottom: 16,
          }}>
          Let's <span style={{ color: S.red }}>Connect</span>
        </motion.h2>

        <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={2}
          style={{
            fontFamily: font, fontSize: 15, color: S.muted,
            lineHeight: 1.8, marginBottom: 40, maxWidth: 500, margin: '0 auto 40px',
          }}>
          Have a project in mind or just want to chat? I'm always open to discussing new opportunities and ideas.
        </motion.p>

        <motion.a
          initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={3}
          href={`mailto:${data.socials.email}`}
          style={{
            fontFamily: font, fontSize: 14, fontWeight: 800, color: S.white,
            background: S.red, padding: '16px 48px',
            textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10,
            textTransform: 'uppercase', letterSpacing: '0.1em',
            transition: 'all 0.25s', boxShadow: `0 4px 30px ${S.redGlow}`,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 12px 40px ${S.redGlow}`; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 30px ${S.redGlow}`; }}
        >
          <Send size={16} /> Send Message
        </motion.a>

        {/* Socials */}
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={4}
          style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 40 }}>
          {socials.map(({ href, Icon, label }) => (
            <a key={label} href={href} aria-label={label} target="_blank" rel="noreferrer" style={{
              width: 44, height: 44, background: S.bgCard,
              border: `1px solid ${S.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: S.muted, textDecoration: 'none', transition: 'all 0.25s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = S.red; e.currentTarget.style.color = S.red; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = S.border; e.currentTarget.style.color = S.muted; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <Icon size={18} />
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
function Footer({ data }) {
  return (
    <footer style={{
      background: S.bg, padding: '32px 24px',
      borderTop: `1px solid ${S.border}`, textAlign: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
        <Zap size={12} color={S.red} fill={S.red} />
        <span style={{
          fontFamily: font, fontSize: 11, fontWeight: 800,
          letterSpacing: '0.2em', color: S.mutedDim, textTransform: 'uppercase',
        }}>
          Built with Passion
        </span>
        <Zap size={12} color={S.red} fill={S.red} />
      </div>
      <p style={{ fontFamily: font, fontSize: 12, color: S.mutedDim }}>
        © {new Date().getFullYear()} {data.personal.name}. All rights reserved.
      </p>
    </footer>
  );
}

/* ─────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────── */
export default function SportsAthletic({ portfolioData }) {
  const data = portfolioData || dummyData;

  return (
    <div style={{ fontFamily: font, background: S.bg, color: S.white, minHeight: '100vh' }}>
      <style>{keyframeCSS}</style>
      <Nav data={data} />
      <Hero data={data} />
      <About data={data} />
      <Skills data={data} />
      <Projects data={data} />
      <Experience data={data} />
      <div id="trophies">
        <TrophyCabinet />
      </div>
      <Contact data={data} />
      <Footer data={data} />
    </div>
  );
}
