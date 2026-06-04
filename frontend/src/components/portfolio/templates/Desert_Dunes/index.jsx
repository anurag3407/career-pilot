import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  ExternalLink,
  Phone,
  ChevronDown,
  Star,
  Quote,
  Send,
  Briefcase,
  Code2,
  Calendar,
  ArrowUpRight,
  Sun,
  Wind,
} from 'lucide-react';
import data from '../../../../data/dummy_data.json';

/* ─────────────────────────────────────────────
   DESIGN TOKENS — Desert Dunes palette
───────────────────────────────────────────── */
const C = {
  sand:             '#F5E6C8',
  sandLight:        '#FDF6E3',
  sandMid:          '#E8D5A3',
  sandDark:         '#C9A96E',
  terracotta:       '#C1440E',
  terracottaLight:  '#D4622E',
  terracottaMid:    '#B8391A',
  burnt:            '#8B2500',
  amber:            '#E8A020',
  amberLight:       '#F5B83D',
  gold:             '#D4AF37',
  goldLight:        '#F0CC60',
  dusk:             '#7A4419',
  duskDeep:         '#3D1C0A',
  cream:            '#FBF5E6',
  warmWhite:        '#FEF9F0',
  stone:            '#A08060',
  stoneLight:       '#C4A882',
  dusty:            '#6B4F35',
  shadow:           'rgba(61,28,10,0.15)',
  shadowDeep:       'rgba(61,28,10,0.35)',
};

const fontDisplay = "'Georgia', 'Times New Roman', serif";
const fontSans    = "'Inter', system-ui, sans-serif";
const fontItalic  = "'Georgia', serif";

/* ─────────────────────────────────────────────
   ANIMATION VARIANTS
───────────────────────────────────────────── */
const fadeUp = {
  hidden:  { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeIn = {
  hidden:  { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.6, delay: i * 0.08, ease: 'easeOut' },
  }),
};

const slideRight = {
  hidden:  { opacity: 0, x: -50 },
  visible: (i = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ─────────────────────────────────────────────
   SVG DUNE DIVIDERS
───────────────────────────────────────────── */
function DuneDivider({ fill = C.sand, flip = false }) {
  return (
    <div style={{ lineHeight: 0, transform: flip ? 'rotate(180deg)' : 'none' }}>
      <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
        style={{ display: 'block', width: '100%', height: 80 }}>
        <path d="M0,60 C180,20 360,100 540,55 C720,10 900,90 1080,50 C1260,10 1380,80 1440,60 L1440,120 L0,120 Z" fill={fill} />
      </svg>
    </div>
  );
}

function DuneDividerTall({ fill = C.sand }) {
  return (
    <div style={{ lineHeight: 0 }}>
      <svg viewBox="0 0 1440 160" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
        style={{ display: 'block', width: '100%', height: 110 }}>
        <path d="M0,80 C120,30 300,130 480,70 C660,10 840,120 1020,65 C1200,10 1340,100 1440,70 L1440,160 L0,160 Z" fill={fill} />
        <path d="M0,100 C200,60 400,140 600,90 C800,40 1000,130 1200,85 C1320,60 1400,100 1440,90 L1440,160 L0,160 Z" fill={fill} opacity="0.5" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   HEAT SHIMMER + ANIMATIONS CSS
───────────────────────────────────────────── */
const globalCSS = `
  @keyframes dune-shimmer1 {
    0%,100% { transform:translateY(0) scaleX(1); opacity:0.04; }
    50%      { transform:translateY(-12px) scaleX(1.02); opacity:0.08; }
  }
  @keyframes dune-shimmer2 {
    0%,100% { transform:translateY(0) scaleX(1); opacity:0.03; }
    50%      { transform:translateY(-8px) scaleX(0.98); opacity:0.07; }
  }
  @keyframes dune-shimmer3 {
    0%,100% { transform:translateY(0); opacity:0.05; }
    33%     { transform:translateY(-6px); opacity:0.09; }
    66%     { transform:translateY(-3px); opacity:0.06; }
  }
  @keyframes dune-sunray {
    0%,100% { opacity:0.06; transform:scaleY(1); }
    50%      { opacity:0.13; transform:scaleY(1.08); }
  }
  @keyframes dune-dustfloat {
    0%   { transform:translateX(0) translateY(0); opacity:0; }
    10%  { opacity:1; }
    90%  { opacity:1; }
    100% { transform:translateX(120px) translateY(-60px); opacity:0; }
  }
  @keyframes dune-spin {
    from { transform:rotate(0deg); }
    to   { transform:rotate(360deg); }
  }
  @keyframes dune-windspin {
    from { transform:rotate(0deg); }
    to   { transform:rotate(360deg); }
  }
  @media (prefers-reduced-motion:reduce) {
    @keyframes dune-shimmer1   { 0%,100%{} }
    @keyframes dune-shimmer2   { 0%,100%{} }
    @keyframes dune-shimmer3   { 0%,100%{} }
    @keyframes dune-sunray     { 0%,100%{} }
    @keyframes dune-dustfloat  { 0%,100%{ opacity:0; } }
    @keyframes dune-spin       { 0%,100%{} }
    @keyframes dune-windspin   { 0%,100%{} }
  }
`;

function GlobalStyles() {
  return <style>{globalCSS}</style>;
}

/* ─────────────────────────────────────────────
   HEAT SHIMMER OVERLAY
───────────────────────────────────────────── */
function HeatShimmer() {
  const dustSeeds = useRef(
    Array.from({ length: 8 }, () => ({
      w: Math.random() * 4 + 2,
      top: 30 + Math.random() * 50,
      left: Math.random() * 80,
    }))
  ).current;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }}>
      {/* sun rays */}
      {[15, 30, 45, 60, 75].map((angle, i) => (
        <div key={i} style={{
          position: 'absolute', top: '-10%', left: '50%',
          width: 3, height: '80%',
          background: `linear-gradient(to bottom, ${C.goldLight}cc, transparent)`,
          transformOrigin: 'top center',
          transform: `translateX(-50%) rotate(${angle - 45}deg)`,
          animation: `dune-sunray ${3 + i * 0.7}s ease-in-out infinite ${i * 0.5}s`,
        }} />
      ))}
      {/* heat shimmer bands */}
      {[60, 72, 85].map((top, i) => (
        <div key={i} style={{
          position: 'absolute', top: `${top}%`, left: 0, right: 0, height: 60,
          background: `linear-gradient(to bottom, transparent, ${C.amberLight}20, transparent)`,
          animation: `dune-shimmer${i + 1} ${4 + i}s ease-in-out infinite ${i * 1.3}s`,
          filter: 'blur(8px)',
        }} />
      ))}
      {/* dust motes */}
      {dustSeeds.map((seed, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: seed.w, height: seed.w,
          borderRadius: '50%',
          background: C.sandDark,
          top: `${seed.top}%`,
          left: `${seed.left}%`,
          animation: `dune-dustfloat ${8 + i * 2}s linear infinite ${i * 1.5}s`,
          opacity: 0,
        }} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   SECTION LABEL
───────────────────────────────────────────── */
function SectionLabel({ children, light = false }) {
  return (
    <motion.div variants={fadeIn} custom={0} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
      <div style={{ width: 32, height: 2, background: light ? C.sandLight : C.terracotta, borderRadius: 99 }} />
      <span style={{
        fontFamily: fontSans, fontSize: 11, fontWeight: 700,
        letterSpacing: '0.2em', textTransform: 'uppercase',
        color: light ? C.sandLight : C.terracotta,
      }}>
        {children}
      </span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   NAV
───────────────────────────────────────────── */
function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const links = ['About', 'Skills', 'Projects', 'Experience', 'Testimonials', 'Contact'];
  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: scrolled ? `${C.duskDeep}f0` : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? `1px solid ${C.sandDark}30` : 'none',
          transition: 'all 0.4s ease',
          padding: '0 24px',
        }}
      >
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64,
        }}>
          <span style={{ fontFamily: fontDisplay, fontSize: 20, fontWeight: 700, color: C.gold, letterSpacing: '-0.02em' }}>
            {data.personal.name.split(' ')[0]}<span style={{ color: C.terracottaLight }}>.</span>
          </span>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <button key={link} onClick={() => scrollTo(link)} style={{
                fontFamily: fontSans, fontSize: 13, fontWeight: 500, color: C.sandMid,
                background: 'none', border: 'none', cursor: 'pointer',
                letterSpacing: '0.04em', transition: 'color 0.2s', padding: '4px 0',
              }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.sandMid)}
              >{link}</button>
            ))}
            <a href={`mailto:${data.socials.email}`} style={{
              fontFamily: fontSans, fontSize: 13, fontWeight: 600,
              color: C.duskDeep, background: C.gold, borderRadius: 6,
              padding: '8px 20px', textDecoration: 'none', transition: 'all 0.2s',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = C.amberLight; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = C.gold; e.currentTarget.style.transform = 'translateY(0)'; }}
            >Hire Me</a>
          </div>

          {/* Hamburger */}
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 5, padding: 4 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.span key={i} animate={{
                rotate: open && i === 0 ? 45 : open && i === 2 ? -45 : 0,
                y: open && i === 0 ? 9 : open && i === 2 ? -9 : 0,
                opacity: open && i === 1 ? 0 : 1,
              }} style={{ display: 'block', width: 22, height: 2, background: C.sandMid, borderRadius: 99, transformOrigin: 'center' }} />
            ))}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed', top: 64, left: 0, right: 0, zIndex: 99,
              background: `${C.duskDeep}f8`, backdropFilter: 'blur(24px)',
              borderBottom: `1px solid ${C.sandDark}30`,
              padding: '24px', display: 'flex', flexDirection: 'column', gap: 4,
            }}
          >
            {links.map((link, i) => (
              <motion.button key={link} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }} onClick={() => scrollTo(link)}
                style={{
                  fontFamily: fontSans, fontSize: 16, fontWeight: 500, color: C.sandMid,
                  background: 'none', border: 'none', cursor: 'pointer',
                  textAlign: 'left', padding: '12px 0', borderBottom: `1px solid ${C.sandDark}20`,
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
function Hero() {
  const { name, title, location, bio } = data.personal;
  const { github, linkedin, twitter, email } = data.socials;
  const { yearsExperience, projectsCompleted, happyClients } = data.stats;

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacityParallax = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const stats = [
    { value: `${yearsExperience}+`, label: 'Years Experience' },
    { value: `${projectsCompleted}+`, label: 'Projects Shipped' },
    { value: `${happyClients}+`, label: 'Happy Clients' },
  ];

  const socials = [
    { href: github, Icon: Github, label: 'GitHub' },
    { href: linkedin, Icon: Linkedin, label: 'LinkedIn' },
    { href: twitter, Icon: Twitter, label: 'Twitter' },
    { href: `mailto:${email}`, Icon: Mail, label: 'Email' },
  ];

  return (
    <section ref={containerRef} style={{
      position: 'relative', minHeight: '100vh',
      background: `linear-gradient(165deg, ${C.duskDeep} 0%, ${C.dusk} 30%, ${C.burnt} 55%, ${C.terracotta} 75%, ${C.amber} 95%)`,
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      overflow: 'hidden', paddingTop: 80,
    }}>
      <HeatShimmer />

      {/* Ambient glow orbs */}
      <div style={{
        position: 'absolute', top: '10%', right: '15%', width: 400, height: 400,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${C.goldLight}40 0%, transparent 70%)`,
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', left: '5%', width: 300, height: 300,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${C.terracottaLight}30 0%, transparent 70%)`,
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      <motion.div style={{ y: yParallax, opacity: opacityParallax, position: 'relative', zIndex: 2 }}
        className="px-6 md:px-12 lg:px-24"
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Location pill */}
          <motion.div variants={fadeIn} custom={0} initial="hidden" animate="visible"
            style={{ marginBottom: 24 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: `${C.sandDark}30`, border: `1px solid ${C.sandDark}50`,
              borderRadius: 99, padding: '6px 14px', backdropFilter: 'blur(8px)',
            }}>
              <MapPin size={12} color={C.gold} />
              <span style={{ fontFamily: fontSans, fontSize: 12, color: C.sandMid, letterSpacing: '0.08em' }}>
                {location}
              </span>
            </div>
          </motion.div>

          {/* Name */}
          <motion.h1 variants={fadeUp} custom={1} initial="hidden" animate="visible"
            style={{
              fontFamily: fontDisplay,
              fontSize: 'clamp(52px, 9vw, 110px)',
              fontWeight: 700, lineHeight: 1.0,
              letterSpacing: '-0.03em', color: C.cream, marginBottom: 16,
            }}
          >
            {name.split(' ').map((word, i) => (
              <span key={i}>{i === 0 ? word : <span style={{ color: C.gold }}> {word}</span>}</span>
            ))}
          </motion.h1>

          {/* Title */}
          <motion.p variants={fadeUp} custom={2} initial="hidden" animate="visible"
            style={{
              fontFamily: fontSans,
              fontSize: 'clamp(16px, 2.5vw, 24px)',
              color: C.sandMid, marginBottom: 24, fontWeight: 400, letterSpacing: '0.02em',
            }}
          >{title}</motion.p>

          {/* Bio excerpt */}
          <motion.p variants={fadeUp} custom={3} initial="hidden" animate="visible"
            style={{
              fontFamily: fontSans, fontSize: 16, color: C.stoneLight,
              lineHeight: 1.7, maxWidth: 540, marginBottom: 40,
            }}
          >
            {bio.split('.')[0]}.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={fadeUp} custom={4} initial="hidden" animate="visible"
            style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 64 }}
          >
            <a href={`mailto:${email}`} style={{
              fontFamily: fontSans, fontSize: 15, fontWeight: 600, color: C.duskDeep,
              background: `linear-gradient(135deg, ${C.gold}, ${C.amberLight})`,
              border: 'none', borderRadius: 10, padding: '14px 32px',
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
              transition: 'all 0.25s ease', boxShadow: `0 4px 24px ${C.amber}60`,
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 32px ${C.amber}80`; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 24px ${C.amber}60`; }}
            >
              <Mail size={16} /> Get In Touch
            </a>
            <a href={data.personal.resumeUrl || '#'} style={{
              fontFamily: fontSans, fontSize: 15, fontWeight: 500, color: C.sandMid,
              background: `${C.sandDark}20`, border: `1px solid ${C.sandDark}50`,
              borderRadius: 10, padding: '14px 32px',
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
              backdropFilter: 'blur(8px)', transition: 'all 0.25s ease',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.sandDark; e.currentTarget.style.color = C.sand; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${C.sandDark}50`; e.currentTarget.style.color = C.sandMid; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              View Resume <ArrowUpRight size={15} />
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeUp} custom={5} initial="hidden" animate="visible"
            style={{ display: 'flex', flexWrap: 'wrap' }}
          >
            {stats.map((stat, i) => (
              <div key={i} style={{
                paddingRight: 40, marginRight: 40, marginBottom: 16,
                borderRight: i < stats.length - 1 ? `1px solid ${C.sandDark}40` : 'none',
              }}>
                <div style={{ fontFamily: fontDisplay, fontSize: 40, fontWeight: 700, color: C.gold, lineHeight: 1, marginBottom: 4 }}>
                  {stat.value}
                </div>
                <div style={{ fontFamily: fontSans, fontSize: 12, color: C.stone, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Social sidebar */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        style={{
          position: 'absolute', bottom: 140, left: 24,
          display: 'flex', flexDirection: 'column', gap: 12, zIndex: 3,
        }}
        className="hidden lg:flex"
      >
        {socials.map(({ href, Icon, label }) => (
          <a key={label} href={href} aria-label={label} style={{
            color: C.stone, transition: 'all 0.2s ease', display: 'flex', padding: 8,
          }}
            onMouseEnter={(e) => { e.currentTarget.style.color = C.gold; e.currentTarget.style.transform = 'scale(1.2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = C.stone; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <Icon size={18} />
          </a>
        ))}
        <div style={{ width: 1, height: 60, background: `${C.stone}40`, margin: '4px auto' }} />
      </motion.div>

      {/* Scroll cue */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        style={{
          position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 3,
        }}
      >
        <span style={{ fontFamily: fontSans, fontSize: 10, color: C.stone, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}>
          <ChevronDown size={18} color={C.stone} />
        </motion.div>
      </motion.div>

      {/* Bottom dune */}
      <div style={{ position: 'absolute', bottom: -2, left: 0, right: 0, zIndex: 4 }}>
        <DuneDividerTall fill={C.cream} />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   ABOUT
───────────────────────────────────────────── */
function About() {
  const { name, bio, avatar, location } = data.personal;
  const email = data.personal.email || data.socials.email;
  const phone = data.personal.phone;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about" ref={ref} style={{ background: C.cream, padding: '100px 24px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Avatar */}
          <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}
          >
            <div style={{
              position: 'absolute', inset: -24, borderRadius: '50%',
              border: `2px dashed ${C.sandDark}50`,
              animation: 'dune-spin 25s linear infinite',
            }} />
            <div style={{
              position: 'absolute', inset: -12, borderRadius: '50%',
              background: `conic-gradient(${C.sandDark} 0deg, ${C.amber} 90deg, ${C.terracotta} 180deg, ${C.sandDark} 360deg)`,
              opacity: 0.3,
            }} />
            <img src={avatar} alt={name} style={{
              width: 260, height: 260, borderRadius: '50%', objectFit: 'cover',
              border: `6px solid ${C.cream}`,
              boxShadow: `0 20px 60px ${C.shadowDeep}, 0 0 0 12px ${C.sandMid}30`,
              position: 'relative', zIndex: 2,
            }} />
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
              style={{
                position: 'absolute', bottom: 16, right: '15%',
                width: 56, height: 56, borderRadius: '50%',
                background: `linear-gradient(135deg, ${C.gold}, ${C.amber})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 4px 20px ${C.amber}60`, zIndex: 3,
              }}
            >
              <Sun size={24} color={C.duskDeep} />
            </motion.div>
          </motion.div>

          {/* Text */}
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'}>
            <SectionLabel>About Me</SectionLabel>
            <motion.h2 variants={fadeUp} custom={1} style={{
              fontFamily: fontDisplay,
              fontSize: 'clamp(32px, 4vw, 52px)',
              fontWeight: 700, color: C.duskDeep, lineHeight: 1.15,
              marginBottom: 24, letterSpacing: '-0.02em',
            }}>
              Crafting digital<br />
              <em style={{ color: C.terracotta, fontStyle: 'italic' }}>experiences</em> that endure
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} style={{
              fontFamily: fontSans, fontSize: 16, color: C.dusty, lineHeight: 1.8, marginBottom: 32,
            }}>{bio}</motion.p>

            <motion.div variants={fadeUp} custom={3} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { Icon: MapPin, value: location },
                { Icon: Mail, value: email },
                ...(phone ? [{ Icon: Phone, value: phone }] : []),
              ].map(({ Icon, value }) => (
                <div key={value} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: `${C.terracotta}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={16} color={C.terracotta} />
                  </div>
                  <span style={{ fontFamily: fontSans, fontSize: 14, color: C.dusty }}>{value}</span>
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
function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const categories = [...new Set(data.skills.map((s) => s.category))];
  const catColors = {
    Frontend: { bg: C.terracotta, light: `${C.terracotta}18` },
    Backend:  { bg: C.amber,      light: `${C.amber}18` },
    DevOps:   { bg: C.dusk,       light: `${C.dusk}18` },
  };

  return (
    <section id="skills" ref={ref} style={{
      background: `linear-gradient(160deg, ${C.sandLight} 0%, ${C.sand} 100%)`,
      padding: '100px 24px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200,
        background: `linear-gradient(to top, ${C.cream}, transparent)`, pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeIn} custom={0}
            style={{ display: 'flex', justifyContent: 'center' }}>
            <SectionLabel>Expertise</SectionLabel>
          </motion.div>
          <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={1}
            style={{
              fontFamily: fontDisplay, fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 700, color: C.duskDeep, letterSpacing: '-0.02em',
            }}>
            Skills & Technologies
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {categories.map((cat, ci) => {
            const catSkills = data.skills.filter((s) => s.category === cat);
            const colors = catColors[cat] || { bg: C.terracotta, light: `${C.terracotta}18` };
            return (
              <motion.div key={cat} initial="hidden" animate={inView ? 'visible' : 'hidden'}
                variants={fadeUp} custom={ci} whileHover={{ y: -4 }}
                style={{
                  background: C.warmWhite, borderRadius: 20, padding: 28,
                  boxShadow: `0 4px 24px ${C.shadow}, 0 1px 4px ${C.shadow}`,
                  border: `1px solid ${C.sandMid}60`,
                  transition: 'box-shadow 0.25s ease',
                }}
              >
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: colors.light, borderRadius: 8, padding: '6px 12px', marginBottom: 24,
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors.bg }} />
                  <span style={{
                    fontFamily: fontSans, fontSize: 12, fontWeight: 700, color: colors.bg,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                  }}>{cat}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {catSkills.map((skill, si) => (
                    <div key={skill.name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontFamily: fontSans, fontSize: 14, fontWeight: 500, color: C.duskDeep }}>{skill.name}</span>
                        <span style={{ fontFamily: fontSans, fontSize: 13, color: C.stone, fontWeight: 600 }}>{skill.level}%</span>
                      </div>
                      <div style={{ height: 6, background: `${C.sandMid}50`, borderRadius: 99, overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
                          transition={{ duration: 1, delay: ci * 0.1 + si * 0.08, ease: [0.22, 1, 0.36, 1] }}
                          style={{ height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${colors.bg}, ${C.amber})` }}
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
          style={{ marginTop: 48, display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
          {data.skills.map((skill, i) => (
            <motion.span key={skill.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.4 + i * 0.04, duration: 0.35 }}
              whileHover={{ scale: 1.08, y: -2 }}
              style={{
                fontFamily: fontSans, fontSize: 13, fontWeight: 500, color: C.dusty,
                background: C.warmWhite, border: `1px solid ${C.sandMid}80`,
                borderRadius: 99, padding: '7px 16px', cursor: 'default',
                boxShadow: `0 2px 8px ${C.shadow}`, transition: 'all 0.2s ease',
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
function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [hovered, setHovered] = useState(null);

  return (
    <section id="projects" ref={ref} style={{
      background: `linear-gradient(170deg, ${C.duskDeep} 0%, ${C.burnt} 50%, ${C.dusk} 100%)`,
      padding: '120px 24px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: -2, left: 0, right: 0 }}>
        <DuneDivider fill={C.cream} flip />
      </div>
      <div style={{
        position: 'absolute', top: '30%', right: '-10%', width: 500, height: 500,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${C.amber}20 0%, transparent 70%)`,
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div style={{ marginBottom: 64 }}>
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeIn} custom={0}>
            <SectionLabel light>Work</SectionLabel>
          </motion.div>
          <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={1}
            style={{
              fontFamily: fontDisplay, fontSize: 'clamp(28px, 4vw, 52px)',
              fontWeight: 700, color: C.cream, letterSpacing: '-0.02em', maxWidth: 500,
            }}>
            Featured Projects
          </motion.h2>
        </div>

        {/* Featured */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, marginBottom: 32 }}>
          {data.projects.filter((p) => p.featured).map((project, i) => (
            <motion.div key={project.title}
              initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideRight} custom={i}
              onMouseEnter={() => setHovered(project.title)}
              onMouseLeave={() => setHovered(null)}
              className="flex flex-col md:grid md:grid-cols-2"
              style={{
                borderRadius: 20, overflow: 'hidden',
                background: `${C.duskDeep}80`, border: `1px solid ${C.sandDark}30`,
                backdropFilter: 'blur(8px)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                transform: hovered === project.title ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: hovered === project.title ? `0 20px 60px ${C.shadowDeep}` : `0 4px 20px ${C.shadow}`,
              }}
            >
              <div style={{ position: 'relative', overflow: 'hidden', minHeight: 260 }}>
                <img src={project.image} alt={project.title} style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  transition: 'transform 0.5s ease',
                  transform: hovered === project.title ? 'scale(1.05)' : 'scale(1)',
                }} />
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${C.duskDeep}40, transparent)` }} />
                <div style={{
                  position: 'absolute', top: 16, left: 16,
                  background: `linear-gradient(135deg, ${C.gold}, ${C.amber})`,
                  color: C.duskDeep, fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  padding: '5px 12px', borderRadius: 99, fontFamily: fontSans,
                }}>Featured</div>
              </div>
              <div style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{ fontFamily: fontDisplay, fontSize: 28, fontWeight: 700, color: C.cream, marginBottom: 12, letterSpacing: '-0.02em' }}>
                  {project.title}
                </h3>
                <p style={{ fontFamily: fontSans, fontSize: 14, color: C.stoneLight, lineHeight: 1.7, marginBottom: 24 }}>
                  {project.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
                  {project.techStack.map((tech) => (
                    <span key={tech} style={{
                      fontFamily: fontSans, fontSize: 12, fontWeight: 500, color: C.sandMid,
                      background: `${C.sandDark}20`, border: `1px solid ${C.sandDark}30`,
                      borderRadius: 6, padding: '4px 10px',
                    }}>{tech}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <a href={project.liveUrl} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontFamily: fontSans, fontSize: 13, fontWeight: 600, color: C.duskDeep,
                    background: `linear-gradient(135deg, ${C.gold}, ${C.amberLight})`,
                    padding: '9px 18px', borderRadius: 8, textDecoration: 'none', transition: 'all 0.2s',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.04)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                  ><ExternalLink size={13} /> Live</a>
                  <a href={project.githubUrl} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontFamily: fontSans, fontSize: 13, fontWeight: 500, color: C.sandMid,
                    background: `${C.sandDark}20`, border: `1px solid ${C.sandDark}40`,
                    padding: '9px 18px', borderRadius: 8, textDecoration: 'none', transition: 'all 0.2s',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.sandDark; e.currentTarget.style.color = C.sand; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${C.sandDark}40`; e.currentTarget.style.color = C.sandMid; }}
                  ><Github size={13} /> Code</a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Other projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.projects.filter((p) => !p.featured).map((project, i) => (
            <motion.div key={project.title}
              initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={i + 2}
              whileHover={{ y: -4 }}
              style={{
                borderRadius: 16, overflow: 'hidden',
                background: `${C.duskDeep}80`, border: `1px solid ${C.sandDark}30`,
              }}
            >
              <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${C.duskDeep}, transparent)` }} />
              </div>
              <div style={{ padding: '20px 24px' }}>
                <h3 style={{ fontFamily: fontDisplay, fontSize: 20, fontWeight: 700, color: C.cream, marginBottom: 8 }}>{project.title}</h3>
                <p style={{ fontFamily: fontSans, fontSize: 13, color: C.stoneLight, lineHeight: 1.6, marginBottom: 16 }}>{project.description}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                  {project.techStack.map((tech) => (
                    <span key={tech} style={{ fontSize: 11, fontFamily: fontSans, color: C.stone, background: `${C.sandDark}20`, borderRadius: 4, padding: '3px 8px' }}>{tech}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <a href={project.liveUrl} style={{ color: C.gold, fontSize: 13, fontFamily: fontSans, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none', fontWeight: 600 }}><ExternalLink size={13} /> Live</a>
                  <a href={project.githubUrl} style={{ color: C.stone, fontSize: 13, fontFamily: fontSans, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}><Github size={13} /> Code</a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: -2, left: 0, right: 0, zIndex: 3 }}>
        <DuneDivider fill={C.sandLight} />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   EXPERIENCE
───────────────────────────────────────────── */
function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const dotColors = [C.terracotta, C.amber, C.sandDark];

  return (
    <section id="experience" ref={ref} style={{
      background: `linear-gradient(160deg, ${C.sandLight} 0%, ${C.sand} 100%)`,
      padding: '120px 24px', position: 'relative',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeIn} custom={0}>
              <SectionLabel>Career</SectionLabel>
            </motion.div>
            <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={1}
              style={{
                fontFamily: fontDisplay, fontSize: 'clamp(28px, 4vw, 52px)',
                fontWeight: 700, color: C.duskDeep, letterSpacing: '-0.02em', lineHeight: 1.15,
              }}>
              My Professional<br /><em style={{ color: C.terracotta, fontStyle: 'italic' }}>Journey</em>
            </motion.h2>
            <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={2}
              style={{ fontFamily: fontSans, fontSize: 15, color: C.dusty, lineHeight: 1.7, marginTop: 20 }}>
              Like dunes shaped by the wind, each role has carved new skills and perspectives into who I am as an engineer.
            </motion.p>
          </div>

          {/* Timeline */}
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', left: 20, top: 0, bottom: 0, width: 2,
              background: `linear-gradient(to bottom, ${C.terracotta}, ${C.amber}, ${C.sandDark})`,
              borderRadius: 99,
            }} />
            <div style={{ paddingLeft: 56 }}>
              {data.experience.map((exp, i) => (
                <motion.div key={exp.company}
                  initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={slideRight} custom={i}
                  style={{ position: 'relative', marginBottom: i < data.experience.length - 1 ? 48 : 0 }}
                >
                  <div style={{
                    position: 'absolute', left: -44, top: 4,
                    width: 16, height: 16, borderRadius: '50%',
                    background: dotColors[i] || C.sandDark,
                    border: `3px solid ${C.cream}`,
                    boxShadow: `0 0 0 2px ${dotColors[i] || C.sandDark}`,
                  }} />
                  <div style={{
                    background: C.warmWhite, borderRadius: 16, padding: 24,
                    border: `1px solid ${C.sandMid}60`,
                    boxShadow: `0 4px 20px ${C.shadow}`,
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(4px)'; e.currentTarget.style.boxShadow = `0 8px 32px ${C.shadowDeep}`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = `0 4px 20px ${C.shadow}`; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                      <div>
                        <div style={{ fontFamily: fontDisplay, fontSize: 18, fontWeight: 700, color: C.duskDeep, marginBottom: 2 }}>{exp.role}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Briefcase size={13} color={C.terracotta} />
                          <span style={{ fontFamily: fontSans, fontSize: 13, fontWeight: 600, color: C.terracotta }}>{exp.company}</span>
                        </div>
                      </div>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 5,
                        background: `${C.amber}15`, borderRadius: 6, padding: '4px 10px',
                      }}>
                        <Calendar size={11} color={C.amber} />
                        <span style={{ fontFamily: fontSans, fontSize: 11, color: C.amber, fontWeight: 600 }}>{exp.period}</span>
                      </div>
                    </div>
                    <p style={{ fontFamily: fontSans, fontSize: 13, color: C.dusty, lineHeight: 1.7, marginTop: 12 }}>{exp.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   TESTIMONIALS
───────────────────────────────────────────── */
function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="testimonials" ref={ref} style={{
      background: `linear-gradient(160deg, ${C.duskDeep} 0%, ${C.burnt} 60%, ${C.terracottaMid} 100%)`,
      padding: '120px 24px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: -2, left: 0, right: 0 }}>
        <DuneDivider fill={C.sand} flip />
      </div>
      {/* decorative quote mark */}
      <div style={{
        position: 'absolute', top: '20%', left: '5%',
        fontFamily: fontDisplay, fontSize: 400, color: `${C.gold}08`,
        lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
      }}>"</div>

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeIn} custom={0}
            style={{ display: 'flex', justifyContent: 'center' }}>
            <SectionLabel light>Testimonials</SectionLabel>
          </motion.div>
          <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={1}
            style={{ fontFamily: fontDisplay, fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, color: C.cream, letterSpacing: '-0.02em' }}>
            What People Say
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.testimonials.map((testimonial, i) => (
            <motion.div key={testimonial.name}
              initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={i}
              whileHover={{ y: -6 }}
              style={{
                background: `${C.duskDeep}80`, backdropFilter: 'blur(12px)',
                border: `1px solid ${C.sandDark}25`, borderRadius: 20, padding: 32, position: 'relative',
              }}
            >
              <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                {Array.from({ length: 5 }).map((_, si) => <Star key={si} size={14} fill={C.gold} color={C.gold} />)}
              </div>
              <Quote size={24} color={`${C.gold}60`} style={{ marginBottom: 12 }} />
              <p style={{
                fontFamily: fontItalic, fontSize: 15, color: C.sandMid,
                lineHeight: 1.8, fontStyle: 'italic', marginBottom: 24,
              }}>"{testimonial.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderTop: `1px solid ${C.sandDark}25`, paddingTop: 20 }}>
                <img src={testimonial.avatar} alt={testimonial.name} style={{
                  width: 44, height: 44, borderRadius: '50%',
                  border: `2px solid ${C.gold}50`, objectFit: 'cover',
                }} />
                <div>
                  <div style={{ fontFamily: fontSans, fontSize: 14, fontWeight: 700, color: C.cream }}>{testimonial.name}</div>
                  <div style={{ fontFamily: fontSans, fontSize: 12, color: C.stone }}>{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: -2, left: 0, right: 0 }}>
        <DuneDivider fill={C.cream} />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   CONTACT
───────────────────────────────────────────── */
function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => setStatus('success'), 1800);
  };

  const inputBase = {
    width: '100%', fontFamily: fontSans, fontSize: 14, color: C.duskDeep,
    background: C.warmWhite, border: `1.5px solid ${C.sandMid}80`,
    borderRadius: 10, padding: '12px 16px', outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease', boxSizing: 'border-box',
  };

  const socials = [
    { href: data.socials.github, Icon: Github, label: 'GitHub' },
    { href: data.socials.linkedin, Icon: Linkedin, label: 'LinkedIn' },
    { href: data.socials.twitter, Icon: Twitter, label: 'Twitter' },
    { href: `mailto:${data.socials.email}`, Icon: Mail, label: 'Email' },
  ];

  return (
    <section id="contact" ref={ref} style={{ background: C.cream, padding: '120px 24px 80px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div>
            <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeIn} custom={0}>
              <SectionLabel>Contact</SectionLabel>
            </motion.div>
            <motion.h2 initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={1}
              style={{
                fontFamily: fontDisplay, fontSize: 'clamp(32px, 4vw, 56px)',
                fontWeight: 700, color: C.duskDeep, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 20,
              }}>
              Let's build<br />something<br /><em style={{ color: C.terracotta }}>remarkable</em>
            </motion.h2>
            <motion.p initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={2}
              style={{ fontFamily: fontSans, fontSize: 15, color: C.dusty, lineHeight: 1.7, marginBottom: 40 }}>
              Have a project in mind? I'd love to hear about it. Drop me a message and I'll get back to you within 24 hours.
            </motion.p>
            <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={3}
              style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {socials.map(({ href, Icon, label }) => (
                <a key={label} href={href} aria-label={label} style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: C.warmWhite, border: `1.5px solid ${C.sandMid}80`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: C.dusty, textDecoration: 'none', transition: 'all 0.2s ease',
                  boxShadow: `0 2px 8px ${C.shadow}`,
                }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = C.terracotta;
                    e.currentTarget.style.color = C.cream;
                    e.currentTarget.style.borderColor = C.terracotta;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 8px 20px ${C.terracotta}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = C.warmWhite;
                    e.currentTarget.style.color = C.dusty;
                    e.currentTarget.style.borderColor = `${C.sandMid}80`;
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 2px 8px ${C.shadow}`;
                  }}
                >
                  <Icon size={18} />
                </a>
              ))}
            </motion.div>
          </div>

          <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={fadeUp} custom={2}>
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div key="success"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  style={{
                    background: C.warmWhite, borderRadius: 20, padding: 48, textAlign: 'center',
                    border: `1px solid ${C.sandMid}60`, boxShadow: `0 8px 32px ${C.shadow}`,
                  }}
                >
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${C.gold}, ${C.amber})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px', boxShadow: `0 8px 24px ${C.amber}50`,
                  }}>
                    <Sun size={32} color={C.duskDeep} />
                  </div>
                  <h3 style={{ fontFamily: fontDisplay, fontSize: 28, color: C.duskDeep, marginBottom: 12 }}>Message Sent!</h3>
                  <p style={{ fontFamily: fontSans, fontSize: 15, color: C.dusty, lineHeight: 1.6 }}>
                    Thank you for reaching out. I'll be in touch before the sun sets.
                  </p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} style={{
                  background: C.warmWhite, borderRadius: 20, padding: 36,
                  border: `1px solid ${C.sandMid}60`, boxShadow: `0 8px 32px ${C.shadow}`,
                  display: 'flex', flexDirection: 'column', gap: 20,
                }}>
                  {[
                    { name: 'name', label: 'Your Name', type: 'text', placeholder: 'What do they call you?' },
                    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'where@can.i.reach.you' },
                  ].map(({ name, label, type, placeholder }) => (
                    <div key={name}>
                      <label style={{ fontFamily: fontSans, fontSize: 13, fontWeight: 600, color: C.dusty, display: 'block', marginBottom: 8 }}>
                        {label}
                      </label>
                      <input type={type} name={name} value={form[name]} onChange={handleChange}
                        required placeholder={placeholder} style={inputBase}
                        onFocus={(e) => { e.target.style.borderColor = C.terracotta; e.target.style.boxShadow = `0 0 0 3px ${C.terracotta}20`; }}
                        onBlur={(e) => { e.target.style.borderColor = `${C.sandMid}80`; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={{ fontFamily: fontSans, fontSize: 13, fontWeight: 600, color: C.dusty, display: 'block', marginBottom: 8 }}>
                      Message
                    </label>
                    <textarea name="message" value={form.message} onChange={handleChange}
                      required rows={5} placeholder="Tell me about your project, idea, or just say hello..."
                      style={{ ...inputBase, resize: 'vertical', minHeight: 120 }}
                      onFocus={(e) => { e.target.style.borderColor = C.terracotta; e.target.style.boxShadow = `0 0 0 3px ${C.terracotta}20`; }}
                      onBlur={(e) => { e.target.style.borderColor = `${C.sandMid}80`; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                  <button type="submit" disabled={status === 'sending'} style={{
                    fontFamily: fontSans, fontSize: 15, fontWeight: 700, color: C.duskDeep,
                    background: `linear-gradient(135deg, ${C.gold}, ${C.amberLight})`,
                    border: 'none', borderRadius: 10, padding: '14px 28px', cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    transition: 'all 0.25s ease', boxShadow: `0 4px 20px ${C.amber}50`,
                    opacity: status === 'sending' ? 0.8 : 1,
                  }}
                    onMouseEnter={(e) => { if (status !== 'sending') { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 28px ${C.amber}70`; } }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = `0 4px 20px ${C.amber}50`; }}
                  >
                    {status === 'sending' ? (
                      <><Wind size={16} style={{ animation: 'dune-windspin 1s linear infinite' }} /> Sending...</>
                    ) : (
                      <><Send size={16} /> Send Message</>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ background: C.duskDeep, padding: '48px 24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -2, left: 0, right: 0 }}>
        <DuneDivider fill={C.cream} flip />
      </div>
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <span style={{ fontFamily: fontDisplay, fontSize: 22, fontWeight: 700, color: C.gold }}>
            {data.personal.name.split(' ')[0]}<span style={{ color: C.terracottaLight }}>.</span>
          </span>
          <p style={{ fontFamily: fontSans, fontSize: 13, color: C.stone, textAlign: 'center' }}>
            © {new Date().getFullYear()} {data.personal.name}. Crafted with care in the desert sun.
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            {[
              { href: data.socials.github, Icon: Github },
              { href: data.socials.linkedin, Icon: Linkedin },
              { href: `mailto:${data.socials.email}`, Icon: Mail },
            ].map(({ href, Icon }, i) => (
              <a key={i} href={href} style={{ color: C.stone, transition: 'color 0.2s', display: 'flex' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = C.gold)}
                onMouseLeave={(e) => (e.currentTarget.style.color = C.stone)}
              ><Icon size={18} /></a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function DesertDunes() {
  return (
    <>
      <GlobalStyles />
      <div style={{ fontFamily: fontSans, overflowX: 'hidden' }}>
        <Nav />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Testimonials />
        <Contact />
        <Footer />
      </div>
    </>
  );
}