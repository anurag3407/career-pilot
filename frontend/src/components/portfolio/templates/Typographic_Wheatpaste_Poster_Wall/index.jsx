import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Calendar,
  ArrowUpRight,
  ArrowRight,
  Zap,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────
   DESIGN TOKENS — Wheatpaste Poster Wall palette
───────────────────────────────────────────────────── */
const C = {
  ink:          '#0D0D0D',
  inkDeep:      '#1A1109',
  red:          '#CC1100',
  redBright:    '#E8000D',
  redMuted:     '#A30C00',
  offWhite:     '#F5F0E8',
  paperLight:   '#FAF6ED',
  paperMid:     '#EDE4D0',
  paperDark:    '#D4C5A9',
  paperBrown:   '#C8B89A',
  paperDeep:    '#A89278',
  beige:        '#E8DCC8',
  beigeLight:   '#F0E8D8',
  cream:        '#FBF7F0',
  charcoal:     '#2C2418',
  sepia:        '#6B5A42',
  tape:         '#F0D080',
  tapeLight:    '#F8E8A0',
  shadow:       'rgba(13,13,9,0.18)',
  shadowDeep:   'rgba(13,13,9,0.38)',
};

const fontDisplay  = "'Impact', 'Anton', 'Arial Black', sans-serif";
const fontHeading  = "'Georgia', 'Times New Roman', serif";
const fontBody     = "'Courier New', 'Courier', monospace";
const fontSans     = "'Arial', system-ui, sans-serif";

/* ─────────────────────────────────────────────────────
   GLOBAL CSS — Animations & Textures
───────────────────────────────────────────────────── */
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Anton&family=Special+Elite&display=swap');

  .wp-root {
    background-color: ${C.inkDeep};
    font-family: ${fontBody};
    overflow-x: hidden;
  }

  @keyframes wp-float {
    0%, 100% { transform: translateY(0px) rotate(var(--rot, 0deg)); }
    33%       { transform: translateY(-6px) rotate(calc(var(--rot, 0deg) + 0.5deg)); }
    66%       { transform: translateY(3px) rotate(calc(var(--rot, 0deg) - 0.3deg)); }
  }
  @keyframes wp-stamp {
    0%   { transform: scale(1.6) rotate(-8deg); opacity: 0; }
    60%  { transform: scale(0.96) rotate(2deg); opacity: 1; }
    80%  { transform: scale(1.04) rotate(-1deg); opacity: 1; }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }
  @keyframes wp-flicker {
    0%, 94%, 98%, 100% { opacity: 1; }
    95%, 99%           { opacity: 0.88; }
  }
  @keyframes wp-marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes wp-shake {
    0%, 100% { transform: rotate(0deg); }
    25%       { transform: rotate(-1deg); }
    75%       { transform: rotate(1deg); }
  }
  @keyframes wp-scanline {
    0%   { background-position: 0 0; }
    100% { background-position: 0 100px; }
  }

  .wp-torn-top::before {
    content: '';
    display: block;
    height: 24px;
    background: ${C.paperLight};
    clip-path: polygon(0% 100%, 2% 40%, 4% 70%, 6% 20%, 8% 60%, 10% 10%, 12% 50%, 14% 80%, 16% 30%, 18% 65%, 20% 15%, 22% 55%, 24% 85%, 26% 25%, 28% 70%, 30% 10%, 32% 50%, 34% 80%, 36% 30%, 38% 60%, 40% 5%, 42% 45%, 44% 75%, 46% 20%, 48% 55%, 50% 90%, 52% 35%, 54% 65%, 56% 10%, 58% 50%, 60% 85%, 62% 25%, 64% 60%, 66% 5%, 68% 45%, 70% 80%, 72% 20%, 74% 55%, 76% 90%, 78% 30%, 80% 65%, 82% 10%, 84% 50%, 86% 75%, 88% 15%, 90% 55%, 92% 85%, 94% 25%, 96% 60%, 98% 5%, 100% 40%, 100% 100%);
  }
  .wp-torn-bottom::after {
    content: '';
    display: block;
    height: 24px;
    background: ${C.paperLight};
    clip-path: polygon(0% 0%, 2% 60%, 4% 30%, 6% 80%, 8% 40%, 10% 90%, 12% 50%, 14% 20%, 16% 70%, 18% 35%, 20% 85%, 22% 45%, 24% 15%, 26% 75%, 28% 30%, 30% 90%, 32% 50%, 34% 20%, 36% 70%, 38% 40%, 40% 95%, 42% 55%, 44% 25%, 46% 80%, 48% 45%, 50% 10%, 52% 65%, 54% 35%, 56% 90%, 58% 50%, 60% 15%, 62% 75%, 64% 40%, 66% 95%, 68% 55%, 70% 20%, 72% 80%, 74% 45%, 76% 10%, 78% 70%, 80% 35%, 82% 90%, 84% 50%, 86% 25%, 88% 85%, 90% 45%, 92% 15%, 94% 75%, 96% 40%, 98% 95%, 100% 60%, 100% 0%);
  }

  .wp-tape-h {
    position: absolute;
    height: 22px;
    background: ${C.tapeLight};
    opacity: 0.82;
    box-shadow: 0 1px 4px rgba(0,0,0,0.18);
    z-index: 10;
  }
  .wp-tape-v {
    position: absolute;
    width: 22px;
    background: ${C.tapeLight};
    opacity: 0.82;
    box-shadow: 1px 0 4px rgba(0,0,0,0.18);
    z-index: 10;
  }

  .wp-poster-card:hover {
    transform: var(--hover-rot, rotate(-1deg)) translateY(-8px) !important;
    box-shadow: 12px 20px 60px rgba(0,0,0,0.5) !important;
    z-index: 20 !important;
  }
  .wp-poster-card {
    transition: transform 0.35s cubic-bezier(.22,1,.36,1), box-shadow 0.35s ease, z-index 0s;
  }

  .wp-skill-bar {
    position: relative;
    height: 10px;
    background: repeating-linear-gradient(
      90deg,
      ${C.paperDark} 0px,
      ${C.paperDark} 3px,
      transparent 3px,
      transparent 6px
    );
    border-radius: 2px;
    overflow: hidden;
  }
  .wp-skill-fill {
    position: absolute;
    top: 0; left: 0; height: 100%;
    background: ${C.red};
    border-radius: 2px;
    box-shadow: 2px 0 8px ${C.redMuted}80;
  }

  .wp-nav-link {
    transition: color 0.15s, letter-spacing 0.15s;
  }
  .wp-nav-link:hover {
    color: ${C.red} !important;
    letter-spacing: 0.08em;
  }

  .wp-input:focus {
    outline: none;
    border-color: ${C.red} !important;
    box-shadow: 3px 3px 0 ${C.ink} !important;
  }

  @media (prefers-reduced-motion: reduce) {
    @keyframes wp-float    { 0%, 100% {} }
    @keyframes wp-stamp    { 0%, 100% {} }
    @keyframes wp-flicker  { 0%, 100% {} }
    @keyframes wp-marquee  { from{} to{} }
    @keyframes wp-shake    { 0%, 100% {} }
  }
`;

function GlobalStyles() {
  return <style>{globalCSS}</style>;
}

/* ─────────────────────────────────────────────────────
   HELPERS — Torn paper, tape, decorative elements
───────────────────────────────────────────────────── */
function TornEdgeTop({ color = C.paperLight, height = 28 }) {
  const { portfolioData: data } = usePortfolio();

  const pts = Array.from({ length: 51 }, (_, i) => {
    const x = (i / 50) * 100;
    const y = i % 2 === 0
      ? 20 + ((i * 17) % 60)
      : 50 + ((i * 13) % 40);
    return `${x}% ${y}%`;
  });
  const path = `polygon(0% 100%, ${pts.join(', ')}, 100% 100%)`;
  return (
    <div style={{ lineHeight: 0, marginBottom: -1 }}>
      <div style={{
        height,
        background: color,
        clipPath: path,
        width: '100%',
      }} />
    </div>
  );
}

function TornEdgeBottom({ color = C.paperLight, height = 28 }) {
  const { portfolioData: data } = usePortfolio();

  const pts = Array.from({ length: 51 }, (_, i) => {
    const x = (i / 50) * 100;
    const y = i % 2 === 0
      ? 20 + ((i * 19) % 55)
      : 55 + ((i * 11) % 40);
    return `${x}% ${y}%`;
  });
  const path = `polygon(0% 0%, ${pts.join(', ')}, 100% 0%)`;
  return (
    <div style={{ lineHeight: 0, marginTop: -1 }}>
      <div style={{
        height,
        background: color,
        clipPath: path,
        width: '100%',
      }} />
    </div>
  );
}

function TapeStrip({ top, left, right, bottom, width = '80px', angle = '-3deg', color = C.tape }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <div style={{
      position: 'absolute',
      top, left, right, bottom,
      width,
      height: 20,
      background: color,
      opacity: 0.78,
      transform: `rotate(${angle})`,
      boxShadow: '0 2px 6px rgba(0,0,0,0.20)',
      zIndex: 15,
      pointerEvents: 'none',
    }} />
  );
}

function TapeCorner({ corner = 'tl' }) {
  const { portfolioData: data } = usePortfolio();

  const pos = {
    tl: { top: -8, left: 10 },
    tr: { top: -8, right: 10 },
    bl: { bottom: -8, left: 10 },
    br: { bottom: -8, right: 10 },
  }[corner];
  const rot = { tl: '-40deg', tr: '40deg', bl: '40deg', br: '-40deg' }[corner];
  return (
    <div style={{
      position: 'absolute', ...pos,
      width: 44, height: 18,
      background: C.tapeLight,
      opacity: 0.82,
      transform: `rotate(${rot})`,
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      zIndex: 15,
      pointerEvents: 'none',
    }} />
  );
}

function StickyNote({ children, style = {}, color = '#FDED82', rotate = '-2deg' }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <div style={{
      background: color,
      padding: '10px 14px',
      fontFamily: fontBody,
      fontSize: 13,
      fontWeight: 700,
      color: C.ink,
      transform: `rotate(${rotate})`,
      boxShadow: '3px 4px 10px rgba(0,0,0,0.25)',
      display: 'inline-block',
      lineHeight: 1.4,
      position: 'relative',
      ...style,
    }}>
      {children}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 6,
        background: 'rgba(0,0,0,0.08)',
      }} />
    </div>
  );
}

function InkStamp({ children, style = {} }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <motion.div
      initial={{ scale: 1.5, opacity: 0, rotate: -5 }}
      whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 320, damping: 18 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `3px solid ${C.red}`,
        color: C.red,
        fontFamily: fontDisplay,
        fontSize: 13,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        padding: '6px 14px',
        opacity: 0.85,
        transform: 'rotate(-4deg)',
        userSelect: 'none',
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

function MarqueeBar({ text, bg = C.red, fg = C.offWhite }) {
  const { portfolioData: data } = usePortfolio();

  const repeated = Array.from({ length: 12 }, () => text).join('  ✦  ');
  return (
    <div style={{
      background: bg,
      overflow: 'hidden',
      padding: '10px 0',
      borderTop: `2px solid ${C.ink}`,
      borderBottom: `2px solid ${C.ink}`,
    }}>
      <div style={{
        display: 'inline-block',
        whiteSpace: 'nowrap',
        animation: 'wp-marquee 18s linear infinite',
        fontFamily: fontDisplay,
        fontSize: 15,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: fg,
      }}>
        {repeated}&nbsp;&nbsp;&nbsp;{repeated}
      </div>
    </div>
  );
}

function PaperScrap({ style = {}, children }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <div style={{
      background: C.paperMid,
      padding: '12px 16px',
      boxShadow: '4px 5px 14px rgba(0,0,0,0.3)',
      fontFamily: fontBody,
      fontSize: 12,
      color: C.sepia,
      position: 'relative',
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   NAV
───────────────────────────────────────────────────── */
function Nav() {
  const { portfolioData: data } = usePortfolio();

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
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: scrolled ? `${C.ink}f4` : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? `2px solid ${C.red}` : 'none',
          transition: 'all 0.3s ease',
          padding: '0 20px',
        }}
      >
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60,
        }}>
          {/* Logo */}
          <span style={{
            fontFamily: fontDisplay,
            fontSize: 22,
            color: C.offWhite,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}>
            {data.personal.name.split(' ')[0]}
            <span style={{ color: C.red }}>.</span>
          </span>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <button type="button"
                key={link}
                onClick={() => scrollTo(link)}
                className="wp-nav-link"
                style={{
                  fontFamily: fontBody,
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.paperDark,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  padding: '4px 0',
                }}
              >
                {link}
              </button>
            ))}
            <a
              href={`mailto:${data.socials.email}`}
              style={{
                fontFamily: fontDisplay,
                fontSize: 12,
                color: C.offWhite,
                background: C.red,
                border: `2px solid ${C.red}`,
                padding: '7px 20px',
                textDecoration: 'none',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = C.offWhite; e.currentTarget.style.color = C.red; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = C.red; e.currentTarget.style.color = C.offWhite; }}
            >
              Hire Me
            </a>
          </div>

          {/* Hamburger */}
          <button type="button"
            className="md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', flexDirection: 'column', gap: 5 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                animate={{
                  rotate: open && i === 0 ? 45 : open && i === 2 ? -45 : 0,
                  y: open && i === 0 ? 9 : open && i === 2 ? -9 : 0,
                  opacity: open && i === 1 ? 0 : 1,
                }}
                style={{ display: 'block', width: 22, height: 2, background: C.offWhite, borderRadius: 0, transformOrigin: 'center' }}
              />
            ))}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.22 }}
            style={{
              position: 'fixed', top: 60, left: 0, right: 0, zIndex: 99,
              background: `${C.ink}f8`,
              borderBottom: `2px solid ${C.red}`,
              padding: '20px',
            }}
          >
            {links.map((link, i) => (
              <motion.button
                key={link}
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => scrollTo(link)}
                style={{
                  display: 'block', width: '100%',
                  fontFamily: fontDisplay, fontSize: 18, fontWeight: 400,
                  color: C.offWhite, background: 'none', border: 'none',
                  cursor: 'pointer', textAlign: 'left',
                  padding: '12px 0', letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  borderBottom: `1px solid ${C.red}30`,
                }}
              >
                {link}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Hero() {
  const { portfolioData: data } = usePortfolio();

  const { name, title, location, bio } = data.personal;
  const { github, linkedin, twitter, email } = data.socials;
  const { yearsExperience, projectsCompleted } = data.stats;

  const containerRef = useRef(null);
  const timeoutRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const yText = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const firstName = name.split(' ')[0].toUpperCase();
  const lastName  = name.split(' ').slice(1).join(' ').toUpperCase();

  const socials = [
    { href: github,             Icon: Github,   label: 'GitHub' },
    { href: linkedin,           Icon: Linkedin, label: 'LinkedIn' },
    { href: twitter,            Icon: Twitter,  label: 'Twitter' },
    { href: `mailto:${email}`,  Icon: Mail,     label: 'Email' },
  ];

  // Mouse parallax
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  // Cursor spotlight
  const [cursor, setCursor] = useState({ x: -300, y: -300 });
  // Typewriter for title
  const [typed, setTyped] = useState('');
  // Hover on name
  const [nameHovered, setNameHovered] = useState(false);

  useEffect(() => {
  return () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
}, []);

  useEffect(() => {
    const full = title || 'Full Stack Developer';
    let i = 0;
    const iv = setInterval(() => {
      setTyped(full.slice(0, i + 1));
      i++;
      if (i >= full.length) clearInterval(iv);
    }, 60);
    return () => clearInterval(iv);
  }, [title]);

  const handleMouseMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMouse({ x, y });
    setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  // Floating particles
  const particles = useMemo(() => Array.from({ length: 22 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 4,
    delay: Math.random() * 4,
    dur: 4 + Math.random() * 5,
    color: i % 3 === 0 ? C.red : i % 3 === 1 ? C.offWhite : C.tapeLight,
    opacity: 0.15 + Math.random() * 0.25,
  })), []);

  // Marquee items
  const marq = ['AVAILABLE FOR WORK', 'FULL STACK DEV', 'OPEN SOURCE', 'CREATIVE CODER', 'SAN FRANCISCO CA', 'HIRE ME ✦'];

  const px = (mouse.x - 0.5) * 30;
  const py = (mouse.y - 0.5) * 20;

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{
        minHeight: '100vh',
        background: `
          repeating-linear-gradient(0deg, transparent, transparent 39px, ${C.ink}14 39px, ${C.ink}14 40px),
          repeating-linear-gradient(90deg, transparent, transparent 39px, ${C.ink}08 39px, ${C.ink}08 40px),
          linear-gradient(160deg, ${C.inkDeep} 0%, #1C1408 40%, #221510 70%, ${C.inkDeep} 100%)
        `,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: 60,
        cursor: 'none',
      }}
    >
      {/* ── Cursor spotlight ── */}
      <div style={{
        position: 'absolute',
        left: cursor.x - 200,
        top: cursor.y - 200,
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${C.red}18 0%, transparent 70%)`,
        pointerEvents: 'none',
        zIndex: 1,
        transition: 'left 0.08s, top 0.08s',
      }} />

      {/* Custom cursor dot */}
      <div style={{
        position: 'absolute',
        left: cursor.x - 6,
        top: cursor.y - 6,
        width: 12,
        height: 12,
        borderRadius: '50%',
        background: C.red,
        pointerEvents: 'none',
        zIndex: 20,
        transition: 'left 0.04s, top 0.04s',
        boxShadow: `0 0 12px ${C.red}`,
      }} />

      {/* ── Floating particles ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {particles.map(p => (
          <motion.div
            key={p.id}
            animate={{ y: [0, -18, 0], opacity: [p.opacity, p.opacity * 1.8, p.opacity] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              borderRadius: '50%',
              background: p.color,
            }}
          />
        ))}
      </div>

      {/* ── Background poster layers (parallax) ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {/* Giant faded first name — moves with mouse */}
        <motion.div
          animate={{ x: px * 0.6, y: py * 0.4 }}
          transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          style={{
            position: 'absolute', top: '2%', left: '-3%',
            fontFamily: fontDisplay, fontSize: 'clamp(130px, 20vw, 280px)',
            color: `${C.red}08`, lineHeight: 0.9,
            userSelect: 'none', letterSpacing: '-0.04em',
            transform: 'rotate(-5deg)',
          }}
        >
          {firstName}
        </motion.div>

        {/* PORTFOLIO ghost text — counter-parallax */}
        <motion.div
          animate={{ x: -px * 0.4, y: -py * 0.3 }}
          transition={{ type: 'spring', stiffness: 60, damping: 18 }}
          style={{
            position: 'absolute', bottom: '8%', right: '-5%',
            fontFamily: fontDisplay, fontSize: 'clamp(90px, 14vw, 200px)',
            color: `${C.paperDark}07`, lineHeight: 0.9,
            userSelect: 'none', letterSpacing: '-0.02em',
            transform: 'rotate(3deg)',
          }}
        >
          PORTFOLIO
        </motion.div>

        {/* Diagonal distress lines */}
        {[15, 35, 55, 75].map((pct, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: 0, bottom: 0,
            left: `${pct}%`,
            width: 1,
            background: `linear-gradient(to bottom, transparent, ${C.red}08, transparent)`,
            transform: `rotate(${i % 2 === 0 ? 2 : -1}deg)`,
          }} />
        ))}

        {/* Floating paper scraps */}
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [8, 10, 8] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '12%', right: '6%',
            width: 150, background: C.paperMid,
            padding: '10px 14px',
            boxShadow: '4px 6px 18px rgba(0,0,0,0.55)',
            clipPath: 'polygon(0 0, 96% 0, 100% 88%, 94% 100%, 2% 96%, 0 84%)',
          }}
        >
          <div style={{ fontFamily: fontBody, fontSize: 10, color: C.sepia, lineHeight: 1.6 }}>
            AVAILABLE<br />FOR WORK<br />———<br />{location}
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0], rotate: [-6, -4, -6] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          whileHover={{ scale: 1.08 }}
          style={{
            position: 'absolute', bottom: '22%', left: '4%',
            width: 120, background: C.red,
            padding: '10px 14px',
            boxShadow: '3px 5px 14px rgba(0,0,0,0.5)',
          }}
        >
          <div style={{ fontFamily: fontDisplay, fontSize: 13, color: C.offWhite, lineHeight: 1.5, letterSpacing: '0.1em' }}>
            {yearsExperience}+ YRS<br />EXP
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, -6, 0], rotate: [5, 3, 5] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          whileHover={{ scale: 1.1, rotate: -2 }}
          style={{
            position: 'absolute', top: '40%', right: '2%',
            background: C.tapeLight,
            padding: '7px 14px',
            boxShadow: '2px 4px 10px rgba(0,0,0,0.3)',
            fontFamily: fontBody, fontSize: 11, color: C.charcoal,
          }}
        >
          📌 {projectsCompleted}+ PROJECTS
        </motion.div>

        {/* Red accent tape strips */}
        <div style={{
          position: 'absolute', top: '55%', left: 0,
          width: '28%', height: 3,
          background: `linear-gradient(90deg, ${C.red}60, transparent)`,
        }} />
        <div style={{
          position: 'absolute', top: '65%', right: 0,
          width: '20%', height: 2,
          background: `linear-gradient(270deg, ${C.red}40, transparent)`,
        }} />
      </div>

      {/* ── Main hero content ── */}
      <motion.div
        style={{ y: yText, opacity, position: 'relative', zIndex: 2 }}
        className="px-6 md:px-12 lg:px-20"
      >
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>

          {/* PRE-LABEL */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ marginBottom: 16 }}
          >
            <span style={{
              fontFamily: fontBody, fontSize: 11,
              color: C.paperDark, letterSpacing: '0.3em',
              textTransform: 'uppercase',
              borderLeft: `3px solid ${C.red}`, paddingLeft: 12,
            }}>
              Portfolio — {new Date().getFullYear()}
            </span>
          </motion.div>

          {/* MASSIVE NAME STACK with hover glitch */}
          <div
            style={{ lineHeight: 0.88, marginBottom: 24 }}
            onMouseEnter={() => setNameHovered(true)}
            onMouseLeave={() => setNameHovered(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.span
                animate={nameHovered ? {
                  x: [0, -3, 3, -2, 2, 0],
                  textShadow: [
                    `2px 0 ${C.red}, -2px 0 #00f`,
                    `-2px 0 ${C.red}, 2px 0 #0ff`,
                    `0 0 0 transparent`,
                  ],
                } : {}}
                transition={{ duration: 0.3 }}
                style={{
                  display: 'block',
                  fontFamily: fontDisplay,
                  fontSize: 'clamp(72px, 13vw, 180px)',
                  color: C.offWhite,
                  letterSpacing: '-0.03em',
                  textTransform: 'uppercase',
                  lineHeight: 0.88,
                  cursor: 'default',
                }}
              >
                {firstName}
              </motion.span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: 'relative', display: 'inline-block' }}
            >
              <motion.span
                animate={nameHovered ? {
                  x: [0, 3, -3, 2, -2, 0],
                  textShadow: [
                    `-2px 0 #0ff, 2px 0 ${C.red}`,
                    `2px 0 #f0f, -2px 0 ${C.red}`,
                    `0 0 0 transparent`,
                  ],
                } : {}}
                transition={{ duration: 0.3, delay: 0.05 }}
                style={{
                  display: 'block',
                  fontFamily: fontDisplay,
                  fontSize: 'clamp(72px, 13vw, 180px)',
                  color: C.red,
                  letterSpacing: '-0.03em',
                  textTransform: 'uppercase',
                  lineHeight: 0.88,
                  WebkitTextStroke: `2px ${C.redBright}`,
                  cursor: 'default',
                }}
              >
                {lastName || 'RIVERA'}
              </motion.span>
            </motion.div>
          </div>

          {/* TYPEWRITER TITLE STRIP */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.48, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'left', marginBottom: 32 }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 16,
              background: C.red, padding: '10px 24px', position: 'relative',
            }}>
              <span style={{
                fontFamily: fontDisplay, fontSize: 'clamp(16px, 2vw, 24px)',
                color: C.offWhite, letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>
                {typed}
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  style={{ display: 'inline-block', width: 3, height: '1em', background: C.offWhite, marginLeft: 4, verticalAlign: 'text-bottom' }}
                />
              </span>
            </div>
          </motion.div>

          {/* BIO + STAMP + CTA ROW */}
          <div className="flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.58 }}
              style={{ maxWidth: 460 }}
            >
              <p style={{
                fontFamily: fontBody, fontSize: 14,
                color: C.paperDark, lineHeight: 1.85, marginBottom: 28,
              }}>
                {bio.split('.')[0]}.
              </p>

              {/* CTA BUTTONS */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <motion.a
                  href={`mailto:${email}`}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    fontFamily: fontDisplay, fontSize: 13, color: C.ink,
                    background: C.offWhite, padding: '12px 28px',
                    textDecoration: 'none', letterSpacing: '0.12em', textTransform: 'uppercase',
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    border: `2px solid ${C.offWhite}`,
                    boxShadow: `4px 4px 0 ${C.red}`,
                    transition: 'box-shadow 0.15s',
                  }}
                >
                  <Mail size={14} /> Contact
                </motion.a>
                <motion.a
                  href={data.personal.resumeUrl || '#'}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    fontFamily: fontDisplay, fontSize: 13, color: C.offWhite,
                    background: 'transparent', padding: '12px 28px',
                    textDecoration: 'none', letterSpacing: '0.12em', textTransform: 'uppercase',
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    border: `2px solid ${C.offWhite}50`,
                    transition: 'border-color 0.2s',
                  }}
                >
                  View Resume <ArrowUpRight size={14} />
                </motion.a>
              </div>

              {/* SOCIAL ICONS */}
              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                {socials.map(({ href, Icon, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    aria-label={label}
                    whileHover={{ scale: 1.15, y: -3 }}
                    style={{
                      color: C.paperDeep, display: 'flex',
                      border: `1px solid ${C.paperDeep}40`, padding: 9,
                      transition: 'all 0.2s',
                    }}
                  >
                    <Icon size={16} />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* AVAILABLE STAMP — wobbles on hover */}
            <motion.div
              initial={{ scale: 1.8, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.55, delay: 0.72, type: 'spring', stiffness: 280, damping: 16 }}
              whileHover={{ rotate: [0, -5, 5, -3, 0], transition: { duration: 0.4 } }}
              style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
            >
              <div style={{
                border: `4px solid ${C.red}`, borderRadius: '50%',
                width: 160, height: 160,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                background: 'transparent', opacity: 0.9,
                position: 'relative', transform: 'rotate(-8deg)',
                cursor: 'pointer',
              }}>
                <div style={{ border: `2px solid ${C.red}`, borderRadius: '50%', position: 'absolute', inset: 6 }} />
                <div style={{
                  fontFamily: fontDisplay, fontSize: 11,
                  color: C.red, letterSpacing: '0.2em',
                  textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.3,
                }}>
                  AVAILABLE<br />FOR<br />WORK<br />
                  <span style={{ fontSize: 22, display: 'block', marginTop: 2 }}>✓</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ── Marquee ticker strip ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        style={{
          position: 'relative', zIndex: 3,
          background: C.red, marginTop: 48,
          overflow: 'hidden', padding: '10px 0',
          borderTop: `1px solid ${C.redBright}40`,
        }}
      >
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
          style={{ display: 'flex', gap: 0, whiteSpace: 'nowrap', width: 'max-content' }}
        >
          {[...marq, ...marq, ...marq, ...marq].map((item, i) => (
            <span key={i} style={{
              fontFamily: fontDisplay, fontSize: 12,
              color: C.offWhite, letterSpacing: '0.25em',
              textTransform: 'uppercase', padding: '0 32px',
            }}>
              {item} <span style={{ color: `${C.offWhite}70`, marginLeft: 8 }}>✦</span>
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        style={{
          position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, zIndex: 3,
        }}
      >
        <span style={{ fontFamily: fontBody, fontSize: 9, color: C.paperDeep, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Scroll</span>
        <motion.div animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}>
          <ChevronDown size={16} color={C.red} />
        </motion.div>
      </motion.div>

      {/* Bottom torn edge */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 4 }}>
        <TornEdgeBottom color={C.paperLight} height={36} />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────
   ABOUT
───────────────────────────────────────────────────── */
function About() {
  const { portfolioData: data } = usePortfolio();

  const { name, bio, avatar, location } = data.personal;
  const email = data.socials.email;
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const details = [
    { Icon: MapPin,  label: 'Location', value: location },
    { Icon: Mail,    label: 'Email',    value: email },
    { Icon: Briefcase, label: 'Status', value: 'Available for work' },
  ];

  return (
    <section id="about" ref={ref} style={{
      background: C.paperLight,
      padding: '90px 24px 80px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Paper texture overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `
          repeating-linear-gradient(0deg, transparent, transparent 24px, ${C.ink}04 24px, ${C.ink}04 25px)
        `,
      }} />

      {/* Background text watermark */}
      <div style={{
        position: 'absolute', bottom: '-4%', right: '-2%',
        fontFamily: fontDisplay, fontSize: 'clamp(80px, 14vw, 200px)',
        color: `${C.paperDark}30`, userSelect: 'none',
        letterSpacing: '-0.04em', transform: 'rotate(5deg)',
      }}>
        ABOUT
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        {/* SECTION HEADER */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 48 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 0,
            background: C.ink, padding: '8px 20px',
            position: 'relative',
          }}>
            <span style={{
              fontFamily: fontDisplay, fontSize: 14,
              color: C.offWhite, letterSpacing: '0.2em', textTransform: 'uppercase',
            }}>
              About Me
            </span>
          </div>
          <TapeStrip top={-8} left={20} width="60px" angle="3deg" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* POLAROID PORTRAIT */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: -4 }}
            animate={inView ? { opacity: 1, y: 0, rotate: -2 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'relative' }}
          >
            {/* Polaroid frame */}
            <div style={{
              background: C.offWhite,
              padding: '16px 16px 56px',
              boxShadow: '8px 12px 40px rgba(0,0,0,0.35)',
              position: 'relative',
              maxWidth: 340,
              margin: '0 auto',
            }}>
              <TapeCorner corner="tl" />
              <TapeCorner corner="tr" />
              <img
                src={avatar}
                alt={name}
                style={{
                  width: '100%',
                  aspectRatio: '1/1',
                  objectFit: 'cover',
                  display: 'block',
                  filter: 'sepia(15%) contrast(1.05)',
                }}
              />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '10px 16px 14px',
                textAlign: 'center',
              }}>
                <div style={{
                  fontFamily: fontBody,
                  fontSize: 14,
                  color: C.sepia,
                  letterSpacing: '0.05em',
                }}>
                  {name} — {new Date().getFullYear()}
                </div>
              </div>
            </div>

            {/* Handwritten annotation */}
            <motion.div
              animate={{ rotate: [-1, 1, -1] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute', bottom: -20, right: 10,
                fontFamily: 'Georgia, serif', fontSize: 12,
                color: C.sepia, fontStyle: 'italic',
                transform: 'rotate(12deg)',
              }}
            >
              ← that's me!
            </motion.div>
          </motion.div>

          {/* BIO CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Ripped notebook paper bio */}
            <div style={{
              background: '#FFFDF5',
              padding: '28px 28px',
              boxShadow: '4px 6px 20px rgba(0,0,0,0.15)',
              position: 'relative',
              marginBottom: 28,
              borderLeft: `4px solid ${C.red}`,
              backgroundImage: `
                repeating-linear-gradient(0deg, transparent, transparent 27px, #B8D4E830 27px, #B8D4E830 28px)
              `,
            }}>
              {/* Red margin line */}
              <div style={{
                position: 'absolute', top: 0, bottom: 0, left: 44,
                width: 1, background: `${C.red}40`,
              }} />
              <motion.h2
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.3 }}
                style={{
                  fontFamily: fontDisplay,
                  fontSize: 'clamp(28px, 4vw, 44px)',
                  color: C.ink,
                  letterSpacing: '-0.02em',
                  marginBottom: 16,
                  lineHeight: 1.1,
                  textTransform: 'uppercase',
                }}
              >
                The Story<br />
                <span style={{ color: C.red }}>Behind</span> The Code
              </motion.h2>
              <p style={{
                fontFamily: fontBody,
                fontSize: 14,
                color: C.charcoal,
                lineHeight: 2,
              }}>
                {bio}
              </p>
            </div>

            {/* STICKER DETAILS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {details.map(({ Icon, label, value }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    background: i === 0 ? C.ink : i === 1 ? C.red : C.charcoal,
                    padding: '10px 18px',
                    transform: `rotate(${i % 2 === 0 ? '-0.5deg' : '0.5deg'})`,
                    boxShadow: '3px 3px 0 rgba(0,0,0,0.2)',
                  }}
                >
                  <Icon size={14} color={C.offWhite} />
                  <span style={{ fontFamily: fontBody, fontSize: 11, color: `${C.offWhite}80`, letterSpacing: '0.1em', textTransform: 'uppercase', minWidth: 60 }}>{label}</span>
                  <span style={{ fontFamily: fontBody, fontSize: 13, color: C.offWhite, fontWeight: 700 }}>{value}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <TornEdgeBottom color={C.ink} height={32} />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────
   MARQUEE BAR (between sections)
───────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────
   SKILLS
───────────────────────────────────────────────────── */
function Skills() {
  const { portfolioData: data } = usePortfolio();

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const categories = [...new Set(data.skills.map((s) => s.category))];

  const catStyles = {
    Frontend: { bg: C.red,      fg: C.offWhite },
    Backend:  { bg: C.ink,      fg: C.offWhite },
    DevOps:   { bg: C.charcoal, fg: C.paperDark },
    Design:   { bg: C.paperDark, fg: C.ink },
  };

  return (
    <section id="skills" ref={ref} style={{
      background: C.inkDeep,
      padding: '0 0 80px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <MarqueeBar text={`Skills & Expertise — ${data.personal.name}`} bg={C.red} fg={C.offWhite} />

      {/* Background watermark */}
      <div style={{
        position: 'absolute', top: '10%', left: '-3%',
        fontFamily: fontDisplay, fontSize: 'clamp(80px, 15vw, 220px)',
        color: `${C.red}06`, userSelect: 'none', letterSpacing: '-0.04em',
        transform: 'rotate(-3deg)',
      }}>
        SKILLS
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '60px 24px 0', position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 48, textAlign: 'center' }}
        >
          <h2 style={{
            fontFamily: fontDisplay,
            fontSize: 'clamp(48px, 8vw, 100px)',
            color: C.offWhite,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            lineHeight: 0.9,
          }}>
            WHAT I<br />
            <span style={{ color: C.red, WebkitTextStroke: `2px ${C.red}` }}>DO BEST</span>
          </h2>
        </motion.div>

        {/* Skill strips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat, ci) => {
            const catSkills = data.skills.filter((s) => s.category === cat);
            const style = catStyles[cat] || catStyles.Frontend;
            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: ci * 0.12 }}
                style={{
                  background: C.paperLight,
                  position: 'relative',
                  padding: '0 0 24px',
                  boxShadow: '6px 8px 0 rgba(0,0,0,0.4)',
                  transform: `rotate(${ci % 2 === 0 ? '-0.4deg' : '0.4deg'})`,
                }}
              >
                {/* Category header strip */}
                <div style={{
                  background: style.bg,
                  padding: '12px 20px',
                  marginBottom: 20,
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <TapeStrip top={-8} left={16} width="50px" angle="2deg" />
                  <span style={{
                    fontFamily: fontDisplay,
                    fontSize: 20,
                    color: style.fg,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}>
                    {cat}
                  </span>
                  <span style={{
                    marginLeft: 'auto',
                    fontFamily: fontBody,
                    fontSize: 10,
                    color: `${style.fg}80`,
                    letterSpacing: '0.15em',
                  }}>
                    {catSkills.length} SKILLS
                  </span>
                </div>

                {/* Skills list */}
                <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {catSkills.map((skill, si) => (
                    <div key={skill.name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{
                          fontFamily: fontBody,
                          fontSize: 12,
                          color: C.charcoal,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          fontWeight: 700,
                        }}>
                          {skill.name}
                        </span>
                        <span style={{
                          fontFamily: fontDisplay,
                          fontSize: 13,
                          color: C.red,
                        }}>
                          {skill.level}%
                        </span>
                      </div>
                      {/* Marker-stroke progress bar */}
                      <div style={{
                        height: 10,
                        background: `repeating-linear-gradient(90deg, ${C.paperDark} 0px, ${C.paperDark} 3px, ${C.paperMid} 3px, ${C.paperMid} 6px)`,
                        position: 'relative',
                      }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
                          transition={{ duration: 1, delay: ci * 0.12 + si * 0.07, ease: [0.22, 1, 0.36, 1] }}
                          style={{
                            position: 'absolute',
                            top: 0, left: 0, height: '100%',
                            background: C.red,
                            boxShadow: `2px 0 8px ${C.red}80`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Skill tags cloud */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          style={{ marginTop: 48, display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}
        >
          {data.skills.map((skill, i) => (
            <motion.span
              key={skill.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.5 + i * 0.04 }}
              whileHover={{ scale: 1.08, rotate: 2 }}
              style={{
                fontFamily: fontBody,
                fontSize: 11,
                color: C.ink,
                background: i % 3 === 0 ? C.paperMid : i % 3 === 1 ? C.tape : C.paperDark,
                padding: '6px 14px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'default',
                transform: `rotate(${(i % 5 - 2) * 0.8}deg)`,
                boxShadow: '2px 3px 8px rgba(0,0,0,0.25)',
              }}
            >
              {skill.name}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────
   EXPERIENCE
───────────────────────────────────────────────────── */
function Experience() {
  const { portfolioData: data } = usePortfolio();

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="experience" ref={ref} style={{
      background: C.paperLight,
      padding: '0 24px 80px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <TornEdgeTop color={C.paperLight} height={32} />

      {/* Watermark */}
      <div style={{
        position: 'absolute', top: '5%', right: '-4%',
        fontFamily: fontDisplay, fontSize: 'clamp(60px, 11vw, 180px)',
        color: `${C.paperDark}25`, userSelect: 'none',
        letterSpacing: '-0.04em', transform: 'rotate(5deg)',
      }}>
        WORK
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 48, paddingTop: 16 }}
        >
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <h2 style={{
              fontFamily: fontDisplay,
              fontSize: 'clamp(48px, 7vw, 88px)',
              color: C.ink,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              lineHeight: 0.9,
            }}>
              WORK<br />
              <span style={{ color: C.red }}>HISTORY</span>
            </h2>
            <TapeStrip top={-10} left={0} width="70px" angle="-2deg" />
          </div>
        </motion.div>

        {/* TIMELINE */}
        <div style={{ position: 'relative' }}>
          {/* Red thread line */}
          <div style={{
            position: 'absolute',
            left: 20, top: 0, bottom: 0,
            width: 3,
            background: `repeating-linear-gradient(to bottom, ${C.red} 0px, ${C.red} 12px, transparent 12px, transparent 16px)`,
            zIndex: 1,
          }} />

          <div style={{ paddingLeft: 60, display: 'flex', flexDirection: 'column', gap: 32 }}>
            {data.experience.map((exp, i) => (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.14 }}
                style={{ position: 'relative' }}
              >
                {/* Timeline dot */}
                <div style={{
                  position: 'absolute',
                  left: -47, top: 16,
                  width: 18, height: 18,
                  borderRadius: 0,
                  background: i % 2 === 0 ? C.red : C.ink,
                  border: `2px solid ${C.paperLight}`,
                  boxShadow: `0 0 0 2px ${i % 2 === 0 ? C.red : C.ink}`,
                  zIndex: 2,
                }} />

                {/* Event flyer card */}
                <div
                  style={{
                    background: C.offWhite,
                    padding: '24px 24px',
                    boxShadow: `5px 6px 0 ${C.ink}`,
                    position: 'relative',
                    transform: `rotate(${i % 2 === 0 ? '-0.3deg' : '0.3deg'})`,
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                    borderTop: `5px solid ${i % 2 === 0 ? C.red : C.ink}`,
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'rotate(0deg) translateX(4px)';
                    e.currentTarget.style.boxShadow = `8px 8px 0 ${C.ink}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = `rotate(${i % 2 === 0 ? '-0.3deg' : '0.3deg'})`;
                    e.currentTarget.style.boxShadow = `5px 6px 0 ${C.ink}`;
                  }}
                >
                  <TapeCorner corner="tr" />

                  {/* Date sticker */}
                  <div style={{
                    position: 'absolute', top: 12, right: 12,
                    background: C.red,
                    padding: '4px 10px',
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}>
                    <Calendar size={10} color={C.offWhite} />
                    <span style={{
                      fontFamily: fontBody,
                      fontSize: 10,
                      color: C.offWhite,
                      letterSpacing: '0.1em',
                    }}>
                      {exp.period}
                    </span>
                  </div>

                  <div style={{ paddingRight: 100 }}>
                    <div style={{
                      fontFamily: fontDisplay,
                      fontSize: 'clamp(16px, 2.5vw, 22px)',
                      color: C.ink,
                      letterSpacing: '0.02em',
                      textTransform: 'uppercase',
                      marginBottom: 4,
                    }}>
                      {exp.role}
                    </div>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: C.ink, padding: '3px 12px', marginBottom: 14,
                    }}>
                      <span style={{
                        fontFamily: fontDisplay,
                        fontSize: 12,
                        color: C.offWhite,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                      }}>
                        {exp.company}
                      </span>
                    </div>
                  </div>
                  <p style={{
                    fontFamily: fontBody,
                    fontSize: 13,
                    color: C.sepia,
                    lineHeight: 1.85,
                  }}>
                    {exp.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <TornEdgeBottom color={C.inkDeep} height={32} />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────
   PROJECTS
───────────────────────────────────────────────────── */
function Projects() {
  const { portfolioData: data } = usePortfolio();

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const rotations = ['-2.5deg', '1.8deg', '-1.2deg', '2.2deg', '-1.8deg', '1deg'];
  const hoverRots = ['-1deg', '1deg', '-0.5deg', '1deg', '-1deg', '0.5deg'];

  return (
    <section id="projects" ref={ref} style={{
      background: C.inkDeep,
      padding: '0 24px 80px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background text */}
      <div style={{
        position: 'absolute', top: '8%', left: '-2%',
        fontFamily: fontDisplay, fontSize: 'clamp(60px, 12vw, 180px)',
        color: `${C.red}06`, userSelect: 'none', letterSpacing: '-0.04em',
        transform: 'rotate(-2deg)',
      }}>
        PROJECTS
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2, paddingTop: 60 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 48 }}
        >
          <h2 style={{
            fontFamily: fontDisplay,
            fontSize: 'clamp(48px, 8vw, 100px)',
            color: C.offWhite,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            lineHeight: 0.9,
          }}>
            FEATURED<br />
            <span style={{ color: C.red }}>WORK</span>
          </h2>
        </motion.div>

        {/* Projects poster grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 40, rotate: rotations[i] }}
              animate={inView ? { opacity: 1, y: 0, rotate: rotations[i] } : {}}
              transition={{ duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="wp-poster-card"
              style={{
                '--hover-rot': `rotate(${hoverRots[i]})`,
                transform: `rotate(${rotations[i]})`,
                position: 'relative',
                background: C.paperLight,
                boxShadow: '6px 8px 30px rgba(0,0,0,0.5)',
                zIndex: 5 + i,
              }}
            >
              <TapeCorner corner="tl" />
              <TapeCorner corner="tr" />

              {/* Project image */}
              <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                <img
                  src={project.image}
                  alt={project.title}
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    filter: 'sepia(20%) contrast(1.1) brightness(0.95)',
                    transition: 'transform 0.5s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.06)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                />
                {/* Red overlay on image */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `linear-gradient(to top, ${C.ink}80, transparent 60%)`,
                }} />

                {/* Project number sticker */}
                <div style={{
                  position: 'absolute', top: 10, left: 10,
                  background: C.red,
                  width: 36, height: 36,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontFamily: fontDisplay, fontSize: 14, color: C.offWhite }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Project info */}
              <div style={{ padding: '16px 16px 20px' }}>
                <h3 style={{
                  fontFamily: fontDisplay,
                  fontSize: 18,
                  color: C.ink,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}>
                  {project.title}
                </h3>
                <p style={{
                  fontFamily: fontBody,
                  fontSize: 11,
                  color: C.sepia,
                  lineHeight: 1.75,
                  marginBottom: 12,
                }}>
                  {project.description.slice(0, 90)}...
                </p>

                {/* Tech stack sticker tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
                  {project.techStack.slice(0, 3).map((tech, ti) => (
                    <span
                      key={tech}
                      style={{
                        fontFamily: fontBody,
                        fontSize: 9,
                        color: ti % 2 === 0 ? C.offWhite : C.ink,
                        background: ti % 2 === 0 ? C.ink : C.tape,
                        padding: '3px 8px',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action links */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <a
                    href={project.liveUrl}
                    style={{
                      flex: 1,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                      fontFamily: fontDisplay, fontSize: 11,
                      color: C.offWhite, background: C.red,
                      padding: '8px 12px', textDecoration: 'none',
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = C.redBright; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = C.red; }}
                  >
                    <ExternalLink size={11} /> Live
                  </a>
                  <a
                    href={project.githubUrl}
                    style={{
                      flex: 1,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                      fontFamily: fontDisplay, fontSize: 11,
                      color: C.offWhite, background: C.ink,
                      padding: '8px 12px', textDecoration: 'none',
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      border: `2px solid ${C.ink}`,
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = C.charcoal; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = C.ink; }}
                  >
                    <Github size={11} /> Code
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 1 }}>
        <TornEdgeBottom color={C.paperLight} height={36} />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────
   TESTIMONIALS
───────────────────────────────────────────────────── */
function Testimonials() {
  const { portfolioData: data } = usePortfolio();

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="testimonials" ref={ref} style={{
      background: C.paperLight,
      padding: '0 24px 80px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Lined paper overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `repeating-linear-gradient(0deg, transparent, transparent 27px, ${C.ink}04 27px, ${C.ink}04 28px)`,
      }} />

      {/* Watermark */}
      <div style={{
        position: 'absolute', bottom: '-2%', right: '-3%',
        fontFamily: fontDisplay, fontSize: 'clamp(50px, 10vw, 160px)',
        color: `${C.paperDark}25`, userSelect: 'none', letterSpacing: '-0.04em',
        transform: 'rotate(4deg)',
      }}>
        PRESS
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2, paddingTop: 48 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 48, textAlign: 'center' }}
        >
          <h2 style={{
            fontFamily: fontDisplay,
            fontSize: 'clamp(40px, 7vw, 88px)',
            color: C.ink,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            lineHeight: 0.9,
          }}>
            WHAT THEY<br />
            <span style={{ color: C.red }}>SAY</span>
          </h2>
          <div style={{ marginTop: 12 }}>
            <InkStamp style={{ fontSize: 11 }}>Press & Reviews</InkStamp>
          </div>
        </motion.div>

        {/* Newspaper clipping cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {data.testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30, rotate: i % 2 === 0 ? '-1deg' : '1deg' }}
              animate={inView ? { opacity: 1, y: 0, rotate: i % 2 === 0 ? '-1deg' : '1deg' } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={{ y: -6, rotate: 0 }}
              style={{
                background: C.offWhite,
                padding: '28px',
                boxShadow: `5px 7px 0 ${C.ink}`,
                position: 'relative',
                borderTop: `4px solid ${i % 3 === 0 ? C.red : i % 3 === 1 ? C.ink : C.paperBrown}`,
              }}
            >
              <TapeCorner corner={i % 2 === 0 ? 'tl' : 'tr'} />

              {/* Newspaper-style header */}
              <div style={{
                borderBottom: `2px solid ${C.ink}`,
                paddingBottom: 12, marginBottom: 16,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{
                  fontFamily: fontDisplay,
                  fontSize: 10,
                  color: C.sepia,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                }}>
                  TESTIMONIAL — Vol. {i + 1}
                </span>
                <div style={{ display: 'flex', gap: 2 }}>
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star key={si} size={10} fill={C.red} color={C.red} />
                  ))}
                </div>
              </div>

              {/* Quote */}
              <div style={{ position: 'relative', marginBottom: 20 }}>
                <Quote size={28} color={`${C.red}30`} style={{ marginBottom: 8 }} />
                <p style={{
                  fontFamily: 'Georgia, serif',
                  fontSize: 14,
                  color: C.charcoal,
                  lineHeight: 1.85,
                  fontStyle: 'italic',
                }}>
                  "{t.text}"
                </p>
              </div>

              {/* Author */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                borderTop: `1px solid ${C.paperDark}`,
                paddingTop: 16,
              }}>
                {/* Circular sticker avatar */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img
                    src={t.avatar}
                    alt={t.name}
                    style={{
                      width: 48, height: 48, borderRadius: '50%',
                      objectFit: 'cover',
                      border: `3px solid ${C.red}`,
                      filter: 'sepia(10%)',
                    }}
                  />
                </div>
                <div>
                  <div style={{
                    fontFamily: fontDisplay,
                    fontSize: 14,
                    color: C.ink,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    {t.name}
                  </div>
                  <div style={{
                    fontFamily: fontBody,
                    fontSize: 10,
                    color: C.sepia,
                    letterSpacing: '0.08em',
                  }}>
                    {t.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <TornEdgeBottom color={C.ink} height={32} />
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────
   CONTACT
───────────────────────────────────────────────────── */
function Contact() {
  const { portfolioData: data } = usePortfolio();

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    timeoutRef.current = setTimeout(() => {
  setStatus('success');
}, 1800);
  };

  const socials = [
    { href: data.socials.github,            Icon: Github,   label: 'GitHub' },
    { href: data.socials.linkedin,          Icon: Linkedin, label: 'LinkedIn' },
    { href: data.socials.twitter,           Icon: Twitter,  label: 'Twitter' },
    { href: `mailto:${data.socials.email}`, Icon: Mail,     label: 'Email' },
  ];

  const inputStyle = {
    width: '100%',
    fontFamily: fontBody,
    fontSize: 13,
    color: C.ink,
    background: C.offWhite,
    border: `2px solid ${C.ink}`,
    padding: '12px 14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.2s',
    letterSpacing: '0.02em',
  };

  return (
    <section id="contact" ref={ref} style={{
      background: C.ink,
      padding: '0 24px 60px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Watermark */}
      <div style={{
        position: 'absolute', top: '5%', left: '-3%',
        fontFamily: fontDisplay, fontSize: 'clamp(80px, 15vw, 220px)',
        color: `${C.red}08`, userSelect: 'none', letterSpacing: '-0.04em',
        transform: 'rotate(-4deg)',
      }}>
        CONTACT
      </div>

      {/* Grid texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `
          repeating-linear-gradient(0deg, transparent, transparent 39px, ${C.offWhite}04 39px, ${C.offWhite}04 40px),
          repeating-linear-gradient(90deg, transparent, transparent 39px, ${C.offWhite}04 39px, ${C.offWhite}04 40px)
        `,
      }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2, paddingTop: 60 }}>

        {/* Giant CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{
            background: C.red,
            padding: '40px 40px 32px',
            marginBottom: 48,
            position: 'relative',
            boxShadow: `6px 8px 0 ${C.offWhite}20`,
          }}
        >
          <TapeStrip top={-10} left={40} width="80px" angle="-3deg" color={C.tapeLight} />
          <TapeStrip top={-10} right={60} width="80px" angle="3deg" color={C.tapeLight} />

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div style={{
                fontFamily: fontBody, fontSize: 11, color: `${C.offWhite}90`,
                letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 8,
              }}>
                Open for Opportunities
              </div>
              <h2 style={{
                fontFamily: fontDisplay,
                fontSize: 'clamp(36px, 6vw, 72px)',
                color: C.offWhite,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                lineHeight: 0.9,
              }}>
                LET'S BUILD<br />SOMETHING
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: `${C.offWhite}15`, padding: '10px 16px',
              }}>
                <Mail size={14} color={C.offWhite} />
                <span style={{ fontFamily: fontBody, fontSize: 12, color: C.offWhite, letterSpacing: '0.05em' }}>
                  {data.socials.email}
                </span>
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: `${C.offWhite}15`, padding: '10px 16px',
              }}>
                <MapPin size={14} color={C.offWhite} />
                <span style={{ fontFamily: fontBody, fontSize: 12, color: C.offWhite, letterSpacing: '0.05em' }}>
                  {data.personal.location}
                </span>
              </div>
            </div>
          </div>

          {/* Social sticker buttons */}
          <div style={{ marginTop: 24, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {socials.map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontFamily: fontBody, fontSize: 10,
                  color: C.red, background: C.offWhite,
                  padding: '7px 14px', textDecoration: 'none',
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  transition: 'all 0.2s',
                  boxShadow: '2px 2px 0 rgba(0,0,0,0.2)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = C.ink; e.currentTarget.style.color = C.offWhite; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = C.offWhite; e.currentTarget.style.color = C.red; }}
              >
                <Icon size={12} /> {label}
              </a>
            ))}
          </div>
        </motion.div>

        {/* CONTACT FORM */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ maxWidth: 680, margin: '0 auto' }}
        >
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  background: C.paperLight,
                  padding: '48px',
                  textAlign: 'center',
                  boxShadow: `6px 8px 0 ${C.red}`,
                  position: 'relative',
                }}
              >
                <TapeCorner corner="tl" />
                <TapeCorner corner="tr" />
                <div style={{
                  width: 72, height: 72,
                  background: C.red,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontSize: 32,
                }}>
                  ✓
                </div>
                <h3 style={{
                  fontFamily: fontDisplay, fontSize: 36,
                  color: C.ink, textTransform: 'uppercase',
                  letterSpacing: '0.04em', marginBottom: 12,
                }}>
                  Message Sent!
                </h3>
                <p style={{ fontFamily: fontBody, fontSize: 13, color: C.sepia, lineHeight: 1.8 }}>
                  Thanks for reaching out. I'll get back to you soon.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                style={{
                  background: C.paperLight,
                  padding: '36px',
                  boxShadow: `6px 8px 0 ${C.red}`,
                  display: 'flex', flexDirection: 'column', gap: 18,
                  position: 'relative',
                  backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 31px, ${C.ink}06 31px, ${C.ink}06 32px)`,
                }}
              >
                <TapeCorner corner="tl" />
                <TapeCorner corner="tr" />

                {/* Form header */}
                <div style={{
                  background: C.ink, padding: '10px 16px', marginBottom: 4,
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <Zap size={14} color={C.red} />
                  <span style={{
                    fontFamily: fontDisplay, fontSize: 14,
                    color: C.offWhite, letterSpacing: '0.15em', textTransform: 'uppercase',
                  }}>
                    Send A Message
                  </span>
                </div>

                {[
                  { name: 'name',    label: 'YOUR NAME',      type: 'text',  placeholder: 'Full name...' },
                  { name: 'email',   label: 'EMAIL ADDRESS',  type: 'email', placeholder: 'your@email.com' },
                ].map(({ name, label, type, placeholder }) => (
                  <div key={name}>
                    <label style={{
                      fontFamily: fontBody, fontSize: 10,
                      color: C.sepia, display: 'block', marginBottom: 6,
                      letterSpacing: '0.18em', textTransform: 'uppercase',
                    }}>
                      {label}
                    </label>
                    <input
                      type={type}
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      required
                      placeholder={placeholder}
                      className="wp-input"
                      style={inputStyle}
                    />
                  </div>
                ))}

                <div>
                  <label style={{
                    fontFamily: fontBody, fontSize: 10,
                    color: C.sepia, display: 'block', marginBottom: 6,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                  }}>
                    MESSAGE
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell me about your project..."
                    className="wp-input"
                    style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  style={{
                    fontFamily: fontDisplay,
                    fontSize: 14,
                    color: C.offWhite,
                    background: status === 'sending' ? C.charcoal : C.red,
                    border: `2px solid ${C.ink}`,
                    padding: '14px 28px',
                    cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                    transition: 'all 0.2s',
                    boxShadow: `4px 4px 0 ${C.ink}`,
                  }}
                  onMouseEnter={(e) => { if (status !== 'sending') { e.currentTarget.style.background = C.redBright; e.currentTarget.style.transform = 'translate(-2px, -2px)'; e.currentTarget.style.boxShadow = `6px 6px 0 ${C.ink}`; } }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = status === 'sending' ? C.charcoal : C.red; e.currentTarget.style.transform = 'translate(0,0)'; e.currentTarget.style.boxShadow = `4px 4px 0 ${C.ink}`; }}
                >
                  {status === 'sending' ? (
                    <><Send size={14} style={{ animation: 'wp-shake 0.4s ease infinite' }} /> Sending...</>
                  ) : (
                    <><Send size={14} /> Send Message</>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────── */
function Footer() {
  const { portfolioData: data } = usePortfolio();

  return (
    <footer style={{
      background: C.inkDeep,
      padding: '0 24px 32px',
      borderTop: `2px solid ${C.red}`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <MarqueeBar
        text={`${data.personal.name} — ${data.personal.title} — ${new Date().getFullYear()}`}
        bg={C.ink}
        fg={C.paperDark}
      />

      <div style={{ maxWidth: 1280, margin: '0 auto', paddingTop: 32 }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div style={{
            fontFamily: fontDisplay, fontSize: 28,
            color: C.offWhite, letterSpacing: '0.04em', textTransform: 'uppercase',
          }}>
            {data.personal.name.split(' ')[0]}
            <span style={{ color: C.red }}>.</span>
          </div>

          <p style={{ fontFamily: fontBody, fontSize: 11, color: C.paperDeep, letterSpacing: '0.1em', textAlign: 'center' }}>
            © {new Date().getFullYear()} {data.personal.name}. All rights pasted.
          </p>

          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { href: data.socials.github,            Icon: Github },
              { href: data.socials.linkedin,          Icon: Linkedin },
              { href: `mailto:${data.socials.email}`, Icon: Mail },
            ].map(({ href, Icon }, i) => (
              <a
                key={i}
                href={href}
                style={{
                  color: C.paperDeep,
                  transition: 'all 0.2s',
                  display: 'flex',
                  border: `1px solid ${C.paperDeep}30`,
                  padding: 8,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = C.red; e.currentTarget.style.borderColor = C.red; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = C.paperDeep; e.currentTarget.style.borderColor = `${C.paperDeep}30`; }}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────
   ROOT EXPORT
───────────────────────────────────────────────────── */
export default function TypographicWheatpastePosterWall() {
  const { portfolioData: data } = usePortfolio();

  return (
    <>
      <GlobalStyles />
      <div className="wp-root">
        <Nav />
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Testimonials />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
