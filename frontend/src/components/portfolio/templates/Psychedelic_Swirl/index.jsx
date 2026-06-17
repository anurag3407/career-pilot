import { usePortfolio } from "../../../../context/PortfolioContext";
import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import {
  Github, Linkedin, Twitter, Mail, MapPin, ExternalLink,
  Star, Menu, X, Send, CheckCircle, ChevronDown,
  Code2, Server, Layers, Palette,
} from 'lucide-react';

/* ─── Design Tokens ─────────────────────────────────────────────── */
const C = {
  pink:    '#FF1FA0',
  purple:  '#9400FF',
  violet:  '#7B00FF',
  green:   '#39FF14',
  orange:  '#FF6600',
  yellow:  '#FFE500',
  cyan:    '#00FFEE',
  magenta: '#FF00FF',
  bg:      '#0D0010',
  bgAlt:   '#130020',
  surface: '#1E0035',
  border:  'rgba(200,100,255,0.25)',
  text:    '#FFE8FF',
  sub:     '#CC99EE',
  muted:   '#9966BB',
  fontDisplay: "'Pacifico', 'Georgia', cursive",
  fontBody:    "'Fredoka One', 'Trebuchet MS', sans-serif",
};

const catMeta = {
  Frontend: { color: C.cyan,    bg: 'rgba(0,255,238,0.12)',  icon: Code2  },
  Backend:  { color: C.green,   bg: 'rgba(57,255,20,0.12)',  icon: Server },
  DevOps:   { color: C.orange,  bg: 'rgba(255,102,0,0.12)', icon: Layers },
  Design:   { color: C.pink,    bg: 'rgba(255,31,160,0.12)', icon: Palette },
};

const RAINBOW = `linear-gradient(135deg,
  ${C.pink} 0%, ${C.orange} 16%, ${C.yellow} 33%,
  ${C.green} 50%, ${C.cyan} 66%, ${C.purple} 83%, ${C.pink} 100%)`;

/* ─── Global Keyframes ───────────────────────────────────────────── */
function GlobalStyles() {
  const { portfolioData: data } = usePortfolio();

  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Fredoka+One&display=swap');

      @keyframes psych-spin      { to { transform: rotate(360deg);  } }
      @keyframes psych-spin-rev  { to { transform: rotate(-360deg); } }
      @keyframes psych-hue       { to { filter: hue-rotate(360deg); } }
      @keyframes psych-float {
        0%,100% { transform: translateY(0px); }
        50%     { transform: translateY(-18px); }
      }
      @keyframes psych-scale-pulse {
        0%,100% { transform: scale(1); }
        50%     { transform: scale(1.08); }
      }
      @keyframes psych-glow-pulse {
        0%,100% { box-shadow: 0 0 20px rgba(255,0,255,0.35), 0 0 60px rgba(148,0,255,0.2); }
        50%     { box-shadow: 0 0 45px rgba(255,0,255,0.65), 0 0 100px rgba(148,0,255,0.4); }
      }
      @keyframes psych-bg-shift {
        0%   { background-position: 0% 50%; }
        50%  { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes psych-border-hue {
        0%   { border-color: ${C.pink};   }
        16%  { border-color: ${C.orange}; }
        33%  { border-color: ${C.yellow}; }
        50%  { border-color: ${C.green};  }
        66%  { border-color: ${C.cyan};   }
        83%  { border-color: ${C.purple}; }
        100% { border-color: ${C.pink};   }
      }
      @keyframes psych-text-shift {
        0%,100% { background-position: 0% 50%; }
        50%     { background-position: 100% 50%; }
      }
      @keyframes psych-wave-anim {
        0%,100% { d: path("M0,20 Q200,0 400,20 T800,20 V40 H0Z"); }
        50%     { d: path("M0,20 Q200,40 400,20 T800,20 V40 H0Z"); }
      }

      .psych-spin      { animation: psych-spin 24s linear infinite; transform-box: fill-box; transform-origin: center; }
      .psych-spin-med  { animation: psych-spin 14s linear infinite; transform-box: fill-box; transform-origin: center; }
      .psych-spin-fast { animation: psych-spin  7s linear infinite; transform-box: fill-box; transform-origin: center; }
      .psych-spin-rev  { animation: psych-spin-rev 18s linear infinite; transform-box: fill-box; transform-origin: center; }
      .psych-hue       { animation: psych-hue 8s linear infinite; }
      .psych-float     { animation: psych-float 4.5s ease-in-out infinite; }
      .psych-glow      { animation: psych-glow-pulse 2.2s ease-in-out infinite; }

      .psych-text {
        background: linear-gradient(90deg,
          ${C.pink},${C.orange},${C.yellow},${C.green},${C.cyan},${C.purple},${C.magenta},${C.pink});
        background-size: 300% 100%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: psych-text-shift 4s linear infinite;
      }

      .psych-btn {
        background: linear-gradient(135deg, ${C.pink}, ${C.purple}, ${C.cyan});
        background-size: 200% 200%;
        animation: psych-bg-shift 3s ease infinite;
        color: #fff;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        cursor: pointer;
        border: none;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .psych-btn:hover  { transform: scale(1.05) translateY(-2px); box-shadow: 0 10px 40px rgba(148,0,255,0.5); }
      .psych-btn:active { transform: scale(0.97); }

      .psych-card {
        background: ${C.surface};
        border: 1.5px solid ${C.border};
        transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
      }
      .psych-card:hover {
        transform: translateY(-6px) rotate(0.4deg);
        box-shadow: 0 24px 64px rgba(148,0,255,0.35), 0 0 30px rgba(255,0,255,0.2);
        border-color: ${C.magenta};
      }

      .psych-input {
        background: rgba(30,0,53,0.8);
        border: 1.5px solid rgba(200,100,255,0.3);
        color: ${C.text};
        transition: border-color 0.25s, box-shadow 0.25s;
      }
      .psych-input:focus {
        outline: none;
        border-color: ${C.pink};
        box-shadow: 0 0 20px rgba(255,31,160,0.3), 0 0 40px rgba(148,0,255,0.15);
      }
      .psych-input::placeholder { color: ${C.muted}; }

      .psych-border-anim { animation: psych-border-hue 4s linear infinite; border-style: solid; }

      /* ── Responsive layout utilities ─────────────────────────────── */

      /* Section padding: tighter on mobile */
      .psych-sec { padding: 56px 16px; position: relative; overflow: hidden; }
      @media (min-width: 640px)  { .psych-sec { padding: 72px 24px; } }
      @media (min-width: 1024px) { .psych-sec { padding: 88px 32px; } }

      /* Mandala: scale down on small screens */
      .psych-mandala-wrap {
        position: absolute; top: 50%; left: 50%;
        transform: translate(-50%,-50%) scale(0.45);
        pointer-events: none;
      }
      @media (min-width: 480px)  { .psych-mandala-wrap { transform: translate(-50%,-50%) scale(0.65); } }
      @media (min-width: 768px)  { .psych-mandala-wrap { transform: translate(-50%,-50%) scale(0.85); } }
      @media (min-width: 1100px) { .psych-mandala-wrap { transform: translate(-50%,-50%) scale(1);    } }

      /* About: stack on mobile, side-by-side on md+ */
      .psych-about-grid {
        display: flex; flex-direction: column; gap: 36px; align-items: center;
      }
      @media (min-width: 768px) {
        .psych-about-grid {
          display: grid; grid-template-columns: auto 1fr;
          gap: 60px; align-items: start;
        }
      }

      /* About avatar column: centred + full-width on mobile */
      .psych-about-col {
        display: flex; flex-direction: column; align-items: center;
        gap: 20px; width: 100%; text-align: center;
      }
      @media (min-width: 768px) {
        .psych-about-col { align-items: flex-start; width: auto; text-align: left; }
      }

      /* About contact links: centred on mobile */
      .psych-about-links {
        display: flex; flex-direction: column; gap: 10px;
        align-items: center; width: 100%;
      }
      @media (min-width: 768px) { .psych-about-links { align-items: flex-start; } }

      /* About stats: 1-col → 3-col */
      .psych-about-stats {
        display: grid; grid-template-columns: repeat(3,1fr); gap: 10px;
      }
      @media (max-width: 400px) {
        .psych-about-stats { grid-template-columns: 1fr; gap: 10px; }
      }

      /* Featured project card: stack on mobile */
      .psych-featured-card {
        display: grid; grid-template-columns: 1fr;
        border-radius: 24px; overflow: hidden; margin-bottom: 28px;
      }
      @media (min-width: 768px) {
        .psych-featured-card { grid-template-columns: 1fr 1fr; min-height: 340px; }
      }

      /* Featured image: fixed height when stacked */
      .psych-featured-img { height: 220px; overflow: hidden; }
      @media (min-width: 768px) { .psych-featured-img { height: auto; } }

      /* Featured card content: tighter padding on mobile */
      .psych-featured-body {
        padding: 24px 20px;
        display: flex; flex-direction: column; justify-content: space-between;
      }
      @media (min-width: 768px) { .psych-featured-body { padding: 36px 32px; } }

      /* Projects grid: 1→2→auto col */
      .psych-projects-grid {
        display: grid; grid-template-columns: 1fr; gap: 20px;
      }
      @media (min-width: 520px)  { .psych-projects-grid { grid-template-columns: repeat(2,1fr); } }
      @media (min-width: 1024px) {
        .psych-projects-grid { grid-template-columns: repeat(auto-fill,minmax(290px,1fr)); gap: 24px; }
      }

      /* Testimonials grid: 1→2→3 col */
      .psych-testi-grid {
        display: grid; grid-template-columns: 1fr; gap: 20px;
      }
      @media (min-width: 520px) { .psych-testi-grid { grid-template-columns: repeat(2,1fr); } }
      @media (min-width: 960px) {
        .psych-testi-grid { grid-template-columns: repeat(auto-fill,minmax(260px,1fr)); gap: 24px; }
      }

      /* Experience card: tighter on mobile */
      .psych-exp-card {
        flex: 1; border-radius: 18px; padding: 18px 16px; margin-bottom: 4px;
      }
      @media (min-width: 640px) { .psych-exp-card { padding: 22px 26px; } }

      /* Contact card: full-bleed on mobile */
      .psych-contact-card { border-radius: 22px; padding: 26px 18px; }
      @media (min-width: 540px) { .psych-contact-card { border-radius: 28px; padding: 44px 40px; } }

      /* Contact name+email row: stack on mobile */
      .psych-contact-row {
        display: grid; grid-template-columns: 1fr; gap: 16px; margin-bottom: 16px;
      }
      @media (min-width: 520px) {
        .psych-contact-row { grid-template-columns: 1fr 1fr; margin-bottom: 20px; }
      }

      /* Contact social links: wrap neatly on small screens */
      .psych-contact-socials {
        display: flex; justify-content: center;
        gap: 16px; margin-top: 32px; flex-wrap: wrap;
      }

      /* Hero stats: force 3-col grid so they never wrap to 2+1 */
      .psych-hero-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        margin-bottom: 36px;
        width: 100%;
        max-width: 420px;
        margin-left: auto;
        margin-right: auto;
      }
      .psych-hero-stat {
        border-radius: 14px; padding: 12px 8px; text-align: center;
        backdrop-filter: blur(8px);
      }
      .psych-hero-stat-num {
        font-size: 1.5rem;
      }
      @media (min-width: 480px) { .psych-hero-stat-num { font-size: 1.8rem; } }

      /* Hero CTA buttons: stack on very small screens */
      .psych-hero-ctas {
        display: flex; gap: 14px; justify-content: center;
        flex-wrap: wrap; margin-bottom: 36px;
      }
      .psych-hero-cta-primary {
        padding: 13px 28px; border-radius: 28px; font-size: 0.95rem;
        text-decoration: none; display: inline-block;
      }
      @media (max-width: 380px) {
        .psych-hero-ctas { flex-direction: column; align-items: center; }
        .psych-hero-cta-primary { width: 100%; text-align: center; box-sizing: border-box; }
      }

      /* Skill grid: ensure single col on very small screens */
      .psych-skills-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 24px;
      }

      @media (prefers-reduced-motion: reduce) {
        .psych-spin, .psych-spin-med, .psych-spin-fast, .psych-spin-rev,
        .psych-hue, .psych-float, .psych-glow, .psych-text,
        .psych-btn, .psych-border-anim { animation: none !important; }
      }
    `}</style>
  );
}

/* ─── Mandala Background ─────────────────────────────────────────── */
function Mandala({ size = 700, opacity = 0.45 }) {
  const { portfolioData: data } = usePortfolio();

  const s = size;
  const cx = s / 2, cy = s / 2;

  const ring = (count, radius, rz, ry, hueBase, dur, dir = 1) =>
    Array.from({ length: count }, (_, i) => {
      const a = (i * 360 / count) * Math.PI / 180;
      const px = cx + radius * Math.sin(a);
      const py = cy - radius * Math.cos(a);
      const rot = (i * 360 / count) + 90;
      return (
        <ellipse key={i} cx={px} cy={py} rx={rz} ry={ry}
          fill={`hsl(${hueBase + i * (360 / count)},100%,65%)`}
          transform={`rotate(${rot},${px},${py})`} opacity={0.6} />
      );
    });

  return (
    <div className="psych-mandala-wrap" style={{ opacity }}>
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        <defs>
          <radialGradient id="mglow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={C.purple} stopOpacity="0.6" />
            <stop offset="100%" stopColor={C.bg} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r={s * 0.48} fill="url(#mglow)" />

        {/* Outer petals — slow clockwise */}
        <motion.g style={{ originX: `${cx}px`, originY: `${cy}px` }}
          animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}>
          {ring(16, s * 0.38, 11, 42, 0, 40)}
        </motion.g>

        {/* Middle petals — counterclockwise */}
        <motion.g style={{ originX: `${cx}px`, originY: `${cy}px` }}
          animate={{ rotate: -360 }} transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}>
          {ring(10, s * 0.25, 14, 54, 120, 26)}
        </motion.g>

        {/* Inner flower — fast clockwise */}
        <motion.g style={{ originX: `${cx}px`, originY: `${cy}px` }}
          animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}>
          {Array.from({ length: 6 }, (_, i) => {
            const a = (i * 60) * Math.PI / 180;
            const r = s * 0.12;
            return (
              <circle key={i} cx={cx + r * Math.sin(a)} cy={cy - r * Math.cos(a)}
                r={s * 0.046} fill={`hsl(${i * 60},100%,70%)`} opacity={0.75} />
            );
          })}
          <circle cx={cx} cy={cy} r={s * 0.042} fill={C.pink} opacity={0.9} />
        </motion.g>

        {/* Star spokes */}
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * 45) * Math.PI / 180;
          return (
            <line key={i} x1={cx} y1={cy}
              x2={cx + s * 0.47 * Math.sin(a)} y2={cy - s * 0.47 * Math.cos(a)}
              stroke={`hsl(${i * 45},100%,65%)`} strokeWidth={1} opacity={0.2} />
          );
        })}

        {/* Concentric circles */}
        {[0.45, 0.35, 0.22, 0.12].map((r, i) => (
          <circle key={i} cx={cx} cy={cy} r={s * r}
            fill="none" stroke={`hsl(${i * 60},100%,65%)`}
            strokeWidth={1.5} opacity={0.18} />
        ))}
      </svg>
    </div>
  );
}

/* ─── Floating Orbs ──────────────────────────────────────────────── */
function FloatOrb({ style }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="psych-float" style={{
      position: 'absolute', borderRadius: '50%',
      filter: 'blur(60px)', pointerEvents: 'none', ...style,
    }} />
  );
}

/* ─── Flower Decoration ──────────────────────────────────────────── */
function Flower({ size = 48, color = C.pink, className = '' }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className}>
      {Array.from({ length: 6 }, (_, i) => {
        const a = i * 60;
        return (
          <ellipse key={i} cx={24} cy={10} rx={6} ry={11}
            fill={color} opacity={0.7}
            transform={`rotate(${a} 24 24)`} />
        );
      })}
      <circle cx={24} cy={24} r={7} fill={C.yellow} />
    </svg>
  );
}

/* ─── Section Wave Divider ───────────────────────────────────────── */
function WaveDivider({ from, to, flip = false }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <div style={{ lineHeight: 0, transform: flip ? 'scaleY(-1)' : 'none' }}>
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 60 }}>
        <defs>
          <linearGradient id={`wg-${from.replace('#','')}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"
          fill={`url(#wg-${from.replace('#','')})`} opacity={0.9} />
      </svg>
    </div>
  );
}

/* ─── Section Heading ────────────────────────────────────────────── */
function SectionHeading({ title, sub }) {
  const { portfolioData: data } = usePortfolio();

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }} style={{ textAlign: 'center', marginBottom: 48 }}>
      <Flower size={32} color={C.yellow} className="psych-float"
        style={{ display: 'inline-block', marginBottom: 8 }} />
      <h2 className="psych-text" style={{ fontFamily: C.fontDisplay, fontSize: 'clamp(2rem,5vw,3.2rem)', margin: 0 }}>
        {title}
      </h2>
      {sub && <p style={{ color: C.sub, marginTop: 8, fontSize: '1.1rem' }}>{sub}</p>}
    </motion.div>
  );
}

/* ─── Nav ─────────────────────────────────────────────────────────── */
function Nav() {
  const { portfolioData: data } = usePortfolio();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);

  const links = ['Hero', 'About', 'Skills', 'Projects', 'Experience', 'Contact'];

  const handleScroll = () => {
    const el = navRef.current?.closest('[style*="overflow"]') || window;
    const top = el === window ? window.scrollY : el.scrollTop;
    setScrolled(top > 60);
  };

  return (
    <>
      <nav ref={navRef} onScroll={handleScroll} style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        background: scrolled ? 'rgba(13,0,16,0.92)' : 'transparent',
        borderBottom: `2px solid`,
        transition: 'background 0.3s, backdrop-filter 0.3s',
        fontFamily: C.fontBody,
      }} className="psych-border-anim">
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Flower size={30} color={C.yellow} className="psych-float" />
            <span className="psych-text" style={{ fontFamily: C.fontDisplay, fontSize: '1.35rem', cursor: 'default' }}>
              {data.personal.name.split(' ')[0]}
            </span>
          </div>

          {/* Desktop Links */}
          <div style={{ display: 'flex', gap: 6 }}
            className="hidden md:flex">
            {links.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{
                color: C.sub, padding: '6px 14px', borderRadius: 20, fontSize: '0.95rem',
                textDecoration: 'none', transition: 'color 0.2s, background 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = C.text; e.currentTarget.style.background = C.surface; }}
                onMouseLeave={e => { e.currentTarget.style.color = C.sub; e.currentTarget.style.background = 'transparent'; }}>
                {l}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <a href="#contact" className="psych-btn hidden md:inline-block"
            style={{ padding: '10px 24px', borderRadius: 24, fontSize: '0.9rem', textDecoration: 'none' }}>
            Hire Me ✿
          </a>

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(o => !o)} style={{
            background: 'none', border: 'none', color: C.text, cursor: 'pointer', padding: 6,
          }} className="flex md:hidden">
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.25 }}
            style={{
              position: 'fixed', top: 68, left: 0, right: 0, zIndex: 999,
              background: C.bgAlt, borderBottom: `2px solid ${C.border}`,
              padding: '20px 24px', fontFamily: C.fontBody,
            }}>
            {links.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)}
                style={{ display: 'block', padding: '12px 0', color: C.text,
                  textDecoration: 'none', fontSize: '1.1rem',
                  borderBottom: `1px solid ${C.border}` }}>
                ✿ {l}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────── */
function Hero() {
  const { portfolioData: data } = usePortfolio();

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -60]);

  const socials = [
    { Icon: Github,   href: data.socials.github,   color: C.sub     },
    { Icon: Linkedin, href: data.socials.linkedin,  color: C.cyan    },
    { Icon: Twitter,  href: data.socials.twitter,   color: C.cyan    },
    { Icon: Mail,     href: `mailto:${data.socials.email}`, color: C.pink },
  ];

  return (
    <section id="hero" style={{
      position: 'relative', minHeight: '100vh', display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', background: C.bg, padding: '88px 16px 72px',
    }}>
      {/* Background orbs */}
      <FloatOrb style={{ width: 500, height: 500, top: -100, left: -150, background: `radial-gradient(circle, ${C.purple}55 0%, transparent 70%)` }} />
      <FloatOrb style={{ width: 400, height: 400, bottom: -80, right: -100, background: `radial-gradient(circle, ${C.pink}44 0%, transparent 70%)`, animationDelay: '-2s' }} />
      <FloatOrb style={{ width: 300, height: 300, top: '40%', right: '10%', background: `radial-gradient(circle, ${C.cyan}33 0%, transparent 70%)`, animationDelay: '-1s' }} />

      {/* Mandala — CSS class handles responsive scaling */}
      <Mandala size={680} opacity={0.5} />

      {/* Content */}
      <motion.div style={{ y, position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: 820 }}>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'backOut' }}>
          <Flower size={52} color={C.yellow} className="psych-float" style={{ marginBottom: 16 }} />
        </motion.div>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ color: C.pink, fontFamily: C.fontBody, fontSize: '1rem',
            letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 12 }}>
          ✿ Peace, Love & Code ✿
        </motion.p>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="psych-text"
          style={{ fontFamily: C.fontDisplay, fontSize: 'clamp(2.8rem,9vw,6.5rem)',
            lineHeight: 1.05, marginBottom: 16 }}>
          {data.personal.name}
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ color: C.cyan, fontFamily: C.fontBody, fontSize: 'clamp(1rem,2.5vw,1.4rem)',
            marginBottom: 12, letterSpacing: '0.06em' }}>
          {data.personal.title}
        </motion.p>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
          style={{ color: C.sub, fontSize: '1rem', maxWidth: 580, margin: '0 auto 36px',
            lineHeight: 1.7, fontStyle: 'italic' }}>
          "{data.personal.tagline}"
        </motion.p>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }} className="psych-hero-stats">
          {[
            { n: `${data.stats.yearsExperience}+`, l: 'Years of Groove' },
            { n: `${data.stats.projectsCompleted}+`, l: 'Projects Shipped' },
            { n: `${data.stats.happyClients}+`, l: 'Happy Clients' },
          ].map(({ n, l }) => (
            <div key={l} className="psych-glow psych-hero-stat"
              style={{ background: C.surface, border: `1.5px solid ${C.border}` }}>
              <div className="psych-text psych-hero-stat-num" style={{ fontFamily: C.fontDisplay }}>{n}</div>
              <div style={{ color: C.muted, fontSize: '0.72rem', marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }} className="psych-hero-ctas">
          <a href="#projects" className="psych-btn psych-hero-cta-primary">
            See My Work ✿
          </a>
          <a href={data.personal.resumeUrl || '#contact'}
            className="psych-hero-cta-primary"
            style={{
              background: 'transparent', border: `2px solid ${C.pink}`,
              color: C.pink, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              transition: 'all 0.25s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = C.pink; e.currentTarget.style.color = C.bg; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.pink; }}>
            Resume
          </a>
        </motion.div>

        {/* Social links */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05 }}
          style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
          {socials.map(({ Icon, href, color }) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer"
              style={{
                width: 44, height: 44, borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                background: C.surface, border: `1.5px solid ${C.border}`,
                color, transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.2) rotate(10deg)'; e.currentTarget.style.boxShadow = `0 0 20px ${color}66`; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}>
              <Icon size={20} />
            </a>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}
        style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          color: C.muted, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <span style={{ fontSize: '0.75rem', letterSpacing: '0.15em' }}>SCROLL</span>
        <ChevronDown size={20} />
      </motion.div>
    </section>
  );
}

/* ─── About ──────────────────────────────────────────────────────── */
function About() {
  const { portfolioData: data } = usePortfolio();

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about" ref={ref} className="psych-sec" style={{ background: C.bgAlt }}>
      <FloatOrb style={{ width: 350, height: 350, top: -100, right: -80,
        background: `radial-gradient(circle, ${C.green}22 0%, transparent 70%)`, pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <SectionHeading title="About Me" sub="Get to know the groovy developer behind the code" />

        {/* psych-about-grid handles the 1-col → 2-col breakpoint via CSS */}
        <div className="psych-about-grid">

          {/* Avatar column */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }} className="psych-about-col">
            <div className="psych-glow" style={{
              width: 200, height: 200, borderRadius: '50%', flexShrink: 0,
              border: '4px solid transparent',
              background: `${C.surface} padding-box, ${RAINBOW} border-box`,
              padding: 4,
            }}>
              <img src={data.personal.avatar} alt={data.personal.name}
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            </div>
            <div className="psych-about-links">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: C.sub }}>
                <MapPin size={16} color={C.pink} />
                <span style={{ fontSize: '0.9rem' }}>{data.personal.location}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: C.sub }}>
                <Mail size={16} color={C.cyan} />
                <span style={{ fontSize: '0.85rem' }}>{data.socials.email}</span>
              </div>
              <a href={data.socials.github} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 8, color: C.sub, textDecoration: 'none', fontSize: '0.9rem' }}>
                <Github size={16} color={C.sub} /> GitHub Profile
              </a>
            </div>
          </motion.div>

          {/* Bio column */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}>
            <p style={{ color: C.sub, fontSize: '1rem', lineHeight: 1.85, marginBottom: 24 }}>
              {data.personal.bio}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              {[C.pink, C.orange, C.yellow, C.green, C.cyan, C.purple].map(c => (
                <div key={c} style={{ flex: 1, height: 3, borderRadius: 2, background: c }} />
              ))}
            </div>
            {/* psych-about-stats handles 3-col → 1-col at very small widths */}
            <div className="psych-about-stats">
              {[
                { n: `${data.stats.yearsExperience}+`, l: 'Years', c: C.pink },
                { n: `${data.stats.projectsCompleted}+`, l: 'Projects', c: C.green },
                { n: `${data.stats.happyClients}+`, l: 'Clients', c: C.cyan },
              ].map(({ n, l, c }) => (
                <div key={l} style={{
                  background: C.surface, borderRadius: 14, padding: '16px 10px',
                  textAlign: 'center', border: `1.5px solid ${c}44`,
                }}>
                  <div style={{ fontFamily: C.fontDisplay, fontSize: '1.75rem', color: c }}>{n}</div>
                  <div style={{ color: C.muted, fontSize: '0.8rem' }}>{l}</div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

/* ─── Skills ─────────────────────────────────────────────────────── */
function Skills() {
  const { portfolioData: data } = usePortfolio();

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const byCategory = data.skills.reduce((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});

  return (
    <section id="skills" ref={ref} className="psych-sec" style={{ background: C.bg }}>
      <FloatOrb style={{ width: 400, height: 400, bottom: -80, left: -100,
        background: `radial-gradient(circle, ${C.cyan}22 0%, transparent 70%)`, pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <SectionHeading title="My Skills" sub="A groovy rainbow of technical expertise" />

        <div className="psych-skills-grid">
          {Object.entries(byCategory).map(([cat, skills], ci) => {
            const meta = catMeta[cat] || { color: C.pink, bg: C.surface, icon: Code2 };
            const Icon = meta.icon;
            return (
              <motion.div key={cat}
                initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: ci * 0.12, duration: 0.6 }}
                className="psych-card" style={{ borderRadius: 20, padding: 28 }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 12,
                    background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={20} color={meta.color} />
                  </div>
                  <h3 style={{ color: meta.color, fontFamily: C.fontBody, fontSize: '1.15rem', margin: 0 }}>{cat}</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {skills.map((sk, si) => (
                    <div key={sk.name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ color: C.text, fontSize: '0.92rem' }}>{sk.name}</span>
                        <span style={{ color: meta.color, fontSize: '0.85rem', fontWeight: 700 }}>{sk.level}%</span>
                      </div>
                      <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${sk.level}%` } : {}}
                          transition={{ delay: ci * 0.12 + si * 0.06 + 0.3, duration: 0.9, ease: 'easeOut' }}
                          style={{
                            height: '100%', borderRadius: 4,
                            background: `linear-gradient(90deg, ${meta.color}, ${C.magenta})`,
                            boxShadow: `0 0 10px ${meta.color}88`,
                          }} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* All skills tag cloud */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 48, justifyContent: 'center' }}>
          {data.skills.map((sk, i) => {
            const meta = catMeta[sk.category] || { color: C.pink, bg: C.surface };
            return (
              <span key={sk.name} style={{
                padding: '7px 18px', borderRadius: 20, fontSize: '0.88rem',
                background: meta.bg, color: meta.color,
                border: `1px solid ${meta.color}44`,
                fontFamily: C.fontBody,
              }}>
                {sk.name}
              </span>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Projects ───────────────────────────────────────────────────── */
function Projects() {
  const { portfolioData: data } = usePortfolio();

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const featured = data.projects[0];
  const rest = data.projects.slice(1);

  return (
    <section id="projects" ref={ref} className="psych-sec" style={{ background: C.bgAlt }}>
      <FloatOrb style={{ width: 450, height: 450, top: -100, right: -120,
        background: `radial-gradient(circle, ${C.purple}33 0%, transparent 70%)`, pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionHeading title="My Projects" sub="Groovy things I've built and shipped" />

        {/* Featured project — psych-featured-card stacks on mobile */}
        <motion.div initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="psych-card psych-featured-card">
          <div className="psych-featured-img">
            <img src={featured.image} alt={featured.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover',
                transition: 'transform 0.5s ease', display: 'block' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
          </div>
          <div className="psych-featured-body">
            <div>
              <span style={{
                display: 'inline-block', padding: '4px 14px', borderRadius: 20,
                background: 'rgba(255,31,160,0.15)', color: C.pink,
                fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', marginBottom: 14,
              }}>Featured ✿</span>
              <h3 style={{ fontFamily: C.fontDisplay, fontSize: '1.8rem', color: C.text, margin: '0 0 12px' }}>
                {featured.title}
              </h3>
              <p style={{ color: C.sub, lineHeight: 1.75, marginBottom: 20, fontSize: '0.95rem' }}>
                {featured.description}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
                {featured.techStack.map(t => (
                  <span key={t} style={{
                    padding: '4px 12px', borderRadius: 12,
                    background: 'rgba(148,0,255,0.15)', color: C.violet,
                    border: `1px solid ${C.violet}44`, fontSize: '0.82rem',
                  }}>{t}</span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 14 }}>
              <a href={featured.liveUrl} target="_blank" rel="noopener noreferrer"
                className="psych-btn" style={{ padding: '10px 22px', borderRadius: 20, fontSize: '0.88rem', textDecoration: 'none' }}>
                Live Demo <ExternalLink size={14} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 4 }} />
              </a>
              <a href={featured.githubUrl} target="_blank" rel="noopener noreferrer"
                style={{ padding: '9px 20px', borderRadius: 20, fontSize: '0.88rem',
                  background: 'transparent', border: `1.5px solid ${C.border}`,
                  color: C.sub, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
                  transition: 'border-color 0.2s, color 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.sub; e.currentTarget.style.color = C.text; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.sub; }}>
                <Github size={16} /> Code
              </a>
            </div>
          </div>
        </motion.div>

        {/* Grid — psych-projects-grid: 1-col mobile, 2-col tablet, auto-fill desktop */}
        <div className="psych-projects-grid">
          {rest.map((proj, i) => (
            <motion.div key={proj.title}
              initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.6 }}
              className="psych-card" style={{ borderRadius: 20, overflow: 'hidden' }}>
              <div style={{ height: 200, overflow: 'hidden' }}>
                <img src={proj.image} alt={proj.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover',
                    transition: 'transform 0.4s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
              </div>
              <div style={{ padding: '22px 22px 20px' }}>
                <h3 style={{ fontFamily: C.fontBody, fontSize: '1.15rem', color: C.text, margin: '0 0 8px' }}>{proj.title}</h3>
                <p style={{ color: C.muted, fontSize: '0.88rem', lineHeight: 1.6, marginBottom: 14 }}>
                  {proj.description.slice(0, 100)}…
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
                  {proj.techStack.slice(0, 4).map(t => (
                    <span key={t} style={{
                      padding: '3px 10px', borderRadius: 10, fontSize: '0.78rem',
                      background: 'rgba(0,255,238,0.1)', color: C.cyan, border: `1px solid ${C.cyan}33`,
                    }}>{t}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer"
                    style={{ flex: 1, textAlign: 'center', padding: '8px', borderRadius: 12,
                      fontSize: '0.83rem', textDecoration: 'none', color: C.bg,
                      background: RAINBOW, fontWeight: 700, backgroundSize: '200%',
                      transition: 'background-position 0.4s' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundPosition = '100%'}
                    onMouseLeave={e => e.currentTarget.style.backgroundPosition = '0%'}>
                    Live ↗
                  </a>
                  <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer"
                    style={{ flex: 1, textAlign: 'center', padding: '8px', borderRadius: 12,
                      fontSize: '0.83rem', textDecoration: 'none', color: C.sub,
                      background: C.surface, border: `1px solid ${C.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <Github size={14} /> Code
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Experience ─────────────────────────────────────────────────── */
function Experience() {
  const { portfolioData: data } = usePortfolio();

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const dotColors = [C.pink, C.green, C.cyan, C.yellow];

  return (
    <section id="experience" ref={ref} className="psych-sec" style={{ background: C.bg }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <SectionHeading title="Experience" sub="My journey through the wild world of tech" />

        <div style={{ position: 'relative' }}>
          {/* Timeline line */}
          <div style={{
            position: 'absolute', left: 22, top: 0, bottom: 0, width: 3,
            background: `linear-gradient(to bottom, ${C.pink}, ${C.purple}, ${C.cyan}, ${C.green})`,
            borderRadius: 2,
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
            {data.experience.map((exp, i) => (
              <motion.div key={exp.company}
                initial={{ opacity: 0, x: -40 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                style={{ display: 'flex', gap: 28, paddingLeft: 4 }}>

                {/* Dot */}
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="psych-float" style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: dotColors[i % 4],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 0 20px ${dotColors[i % 4]}88`,
                    fontSize: '1.1rem', flexShrink: 0,
                    animationDelay: `${i * -0.8}s`,
                  }}>
                    ✿
                  </div>
                </div>

                {/* Card */}
                <div className="psych-card psych-exp-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                    flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                    <div>
                      <h3 style={{ fontFamily: C.fontBody, fontSize: '1.15rem', color: C.text, margin: '0 0 4px' }}>
                        {exp.role}
                      </h3>
                      <span style={{ color: dotColors[i % 4], fontSize: '0.95rem', fontWeight: 700 }}>
                        {exp.company}
                      </span>
                    </div>
                    <span style={{
                      padding: '4px 14px', borderRadius: 20, fontSize: '0.8rem',
                      background: `${dotColors[i % 4]}22`, color: dotColors[i % 4],
                      border: `1px solid ${dotColors[i % 4]}44`, whiteSpace: 'nowrap',
                    }}>
                      {exp.period}
                    </span>
                  </div>
                  <p style={{ color: C.sub, fontSize: '0.93rem', lineHeight: 1.7, margin: 0 }}>{exp.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials ───────────────────────────────────────────────── */
function Testimonials() {
  const { portfolioData: data } = usePortfolio();

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="testimonials" className="psych-sec" style={{ background: C.bgAlt }}>
      <FloatOrb style={{ width: 400, height: 400, bottom: -100, left: -100,
        background: `radial-gradient(circle, ${C.yellow}22 0%, transparent 70%)`, pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto' }} ref={ref}>
        <SectionHeading title="Testimonials" sub="Kind words from the people I've grooved with" />

        <div className="psych-testi-grid">
          {data.testimonials.map((t, i) => {
            const col = [C.pink, C.cyan, C.green, C.yellow][i % 4];
            return (
              <motion.div key={t.name}
                initial={{ opacity: 0, y: 40, rotate: -1 }}
                animate={inView ? { opacity: 1, y: 0, rotate: 0 } : {}}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className="psych-card" style={{ borderRadius: 22, padding: '28px 26px', position: 'relative' }}>

                {/* Quote mark */}
                <div style={{ position: 'absolute', top: 18, right: 22,
                  fontFamily: C.fontDisplay, fontSize: '5rem', lineHeight: 1,
                  color: col, opacity: 0.12, userSelect: 'none' }}>"</div>

                {/* Stars */}
                <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star key={si} size={16} fill={C.yellow} color={C.yellow} />
                  ))}
                </div>

                <p style={{ color: C.sub, fontSize: '0.93rem', lineHeight: 1.75, marginBottom: 24,
                  fontStyle: 'italic', position: 'relative', zIndex: 1 }}>
                  "{t.text}"
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 50, height: 50, borderRadius: '50%', flexShrink: 0,
                    border: `2.5px solid ${col}`,
                    boxShadow: `0 0 15px ${col}55`,
                    overflow: 'hidden',
                  }}>
                    <img src={t.avatar} alt={t.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <div style={{ color: col, fontWeight: 700, fontSize: '0.95rem' }}>{t.name}</div>
                    <div style={{ color: C.muted, fontSize: '0.8rem', marginTop: 2 }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Contact ────────────────────────────────────────────────────── */
function Contact() {
  const { portfolioData: data } = usePortfolio();

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | done

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => setStatus('done'), 1800);
  };

  return (
    <section id="contact" ref={ref} className="psych-sec" style={{ background: C.bg }}>
      <FloatOrb style={{ width: 500, height: 500, top: -150, left: -200,
        background: `radial-gradient(circle, ${C.pink}22 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <FloatOrb style={{ width: 400, height: 400, bottom: -120, right: -100,
        background: `radial-gradient(circle, ${C.purple}33 0%, transparent 70%)`, pointerEvents: 'none', animationDelay: '-2s' }} />

      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <SectionHeading title="Get In Touch" sub="Let's make something groovy together!" />

        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}>
          <div className="psych-card psych-glow psych-contact-card">
            <AnimatePresence mode="wait">
              {status === 'done' ? (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }} style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Flower size={72} color={C.yellow} className="psych-float" style={{ margin: '0 auto 20px' }} />
                  <CheckCircle size={52} color={C.green} style={{ margin: '0 auto 16px', display: 'block' }} />
                  <h3 className="psych-text" style={{ fontFamily: C.fontDisplay, fontSize: '1.8rem', marginBottom: 10 }}>
                    Far Out! ✿
                  </h3>
                  <p style={{ color: C.sub }}>Thanks for reaching out! I'll get back to you soon.</p>
                  <button onClick={() => { setStatus('idle'); setForm({ name: '', email: '', message: '' }); }}
                    style={{ marginTop: 24, background: 'none', border: `1.5px solid ${C.border}`,
                      color: C.muted, padding: '8px 20px', borderRadius: 20, cursor: 'pointer',
                      fontSize: '0.88rem', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = C.text}
                    onMouseLeave={e => e.currentTarget.style.color = C.muted}>
                    Send Another
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="psych-contact-row">
                    <div>
                      <label style={{ display: 'block', color: C.muted, fontSize: '0.83rem',
                        marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Name</label>
                      <input
                        className="psych-input"
                        value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="Your groovy name" required
                        style={{ width: '100%', padding: '12px 16px', borderRadius: 14,
                          fontSize: '0.95rem', fontFamily: C.fontBody, boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', color: C.muted, fontSize: '0.83rem',
                        marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Email</label>
                      <input type="email"
                        className="psych-input"
                        value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                        placeholder="you@example.com" required
                        style={{ width: '100%', padding: '12px 16px', borderRadius: 14,
                          fontSize: '0.95rem', fontFamily: C.fontBody, boxSizing: 'border-box' }} />
                    </div>
                  </div>

                  <div style={{ marginBottom: 28 }}>
                    <label style={{ display: 'block', color: C.muted, fontSize: '0.83rem',
                      marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Message</label>
                    <textarea
                      className="psych-input"
                      value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      placeholder="Tell me about your project, idea, or just say peace! ✌️"
                      required rows={5}
                      style={{ width: '100%', padding: '14px 16px', borderRadius: 14,
                        fontSize: '0.95rem', fontFamily: C.fontBody, resize: 'vertical',
                        boxSizing: 'border-box' }} />
                  </div>

                  <button type="submit" disabled={status === 'sending'}
                    className="psych-btn"
                    style={{ width: '100%', padding: '15px', borderRadius: 20,
                      fontSize: '1rem', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: 10 }}>
                    {status === 'sending' ? (
                      <>
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                          <Flower size={18} color="#fff" />
                        </motion.div>
                        Sending…
                      </>
                    ) : (
                      <><Send size={18} /> Send Message ✿</>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Direct contact links */}
          <div className="psych-contact-socials">
            {[
              { Icon: Mail,     href: `mailto:${data.socials.email}`,  label: data.socials.email,  color: C.pink   },
              { Icon: Github,   href: data.socials.github,             label: 'GitHub',             color: C.sub    },
              { Icon: Linkedin, href: data.socials.linkedin,           label: 'LinkedIn',           color: C.cyan   },
              { Icon: Twitter,  href: data.socials.twitter,            label: 'Twitter',            color: C.cyan   },
            ].map(({ Icon, href, label, color }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 8, color,
                  textDecoration: 'none', fontSize: '0.9rem', transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                <Icon size={18} /> {label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────────────── */
function Footer() {
  const { portfolioData: data } = usePortfolio();

  return (
    <footer style={{ background: C.bgAlt, borderTop: `2px solid ${C.border}`, padding: '40px 24px 32px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        {/* Decorative flowers */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 20 }}>
          {[C.pink, C.yellow, C.cyan, C.green, C.orange].map((c, i) => (
            <Flower key={i} size={28} color={c} className="psych-float"
              style={{ animationDelay: `${i * -0.7}s` }} />
          ))}
        </div>

        <div className="psych-text" style={{ fontFamily: C.fontDisplay, fontSize: '1.4rem', marginBottom: 8 }}>
          {data.personal.name}
        </div>
        <p style={{ color: C.muted, fontSize: '0.88rem', marginBottom: 20 }}>
          {data.personal.tagline}
        </p>

        {/* Rainbow line */}
        <div style={{ height: 3, borderRadius: 2, background: RAINBOW, margin: '20px auto', maxWidth: 300 }} />

        <p style={{ color: C.muted, fontSize: '0.82rem' }}>
          ✿ Made with peace & love · {new Date().getFullYear()} · {data.personal.name} ✿
        </p>
      </div>
    </footer>
  );
}

/* ─── Root Export ────────────────────────────────────────────────── */
export default function PsychedelicSwirl() {
  const { portfolioData: data } = usePortfolio();

  return (
    <>
      <GlobalStyles />
      <div style={{ background: C.bg, color: C.text, fontFamily: C.fontBody, minHeight: '100vh' }}>
        <Nav />
        <Hero />
        <WaveDivider from={C.pink} to={C.purple} />
        <About />
        <WaveDivider from={C.green} to={C.cyan} flip />
        <Skills />
        <WaveDivider from={C.orange} to={C.pink} />
        <Projects />
        <WaveDivider from={C.purple} to={C.violet} flip />
        <Experience />
        <WaveDivider from={C.yellow} to={C.green} />
        <Testimonials />
        <WaveDivider from={C.cyan} to={C.purple} flip />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
