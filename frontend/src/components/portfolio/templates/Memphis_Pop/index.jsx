import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Github, Linkedin, Twitter, Mail, MapPin, ExternalLink,
  Star, Menu, X, Send, CheckCircle, ChevronDown,
  Code2, Server, Layers, Palette,
} from 'lucide-react';
import data from '../../../../data/dummy_data.json';

/* ── Design Tokens ─────────────────────────────────────────────── */
const C = {
  black:  '#0A0A0A',
  white:  '#FFFEF0',
  red:    '#FF3232',
  yellow: '#FFE600',
  blue:   '#0055FF',
  pink:   '#FF1493',
  teal:   '#00CCBB',
  orange: '#FF6600',
  lime:   '#CCFF00',
  purple: '#9B00FF',
  font:   "'Impact', 'Arial Black', 'Helvetica Neue', sans-serif",
  body:   "'Helvetica Neue', 'Arial', 'Trebuchet MS', sans-serif",
};

/* Memphis hard-shadow helpers — no blur, just offset */
const hs  = (n = 5, col = '#0A0A0A') => `${n}px ${n}px 0 ${col}`;
const hs3 = (col = '#0A0A0A')        => `3px 3px 0 ${col}`;

const catMeta = {
  Frontend: { color: '#0055FF', bg: '#EEF3FF' },
  Backend:  { color: '#FF3232', bg: '#FFF0F0' },
  DevOps:   { color: '#FF6600', bg: '#FFF5EE' },
  Design:   { color: '#FF1493', bg: '#FFF0F8' },
};

/* ── Global CSS ────────────────────────────────────────────────── */
function GlobalStyles() {
  return (
    <style>{`
      @keyframes mp-spin   { to { transform: rotate(360deg); } }
      @keyframes mp-wiggle {
        0%,100% { transform: rotate(-6deg); }
        50%     { transform: rotate(6deg);  }
      }
      @keyframes mp-bounce {
        0%,100% { transform: translateY(0); }
        50%     { transform: translateY(-12px); }
      }

      .mp-spin   { animation: mp-spin   8s  linear       infinite; }
      .mp-wiggle { animation: mp-wiggle 2s  ease-in-out  infinite; }
      .mp-bounce { animation: mp-bounce 2.5s ease-in-out infinite; }

      /* Memphis card — thick border + hard shadow, no radius */
      .mp-card {
        border: 3px solid #0A0A0A;
        box-shadow: 5px 5px 0 #0A0A0A;
        border-radius: 0;
        background: #FFFEF0;
        transition: box-shadow 0.15s, transform 0.15s;
      }
      .mp-card:hover {
        box-shadow: 8px 8px 0 #0A0A0A;
        transform: translate(-2px, -2px);
      }

      /* Section padding — responsive */
      .mp-sec { padding: 60px 16px; }
      @media (min-width: 640px)  { .mp-sec { padding: 80px 28px;  } }
      @media (min-width: 1024px) { .mp-sec { padding: 100px 48px; } }

      /* About grid */
      .mp-about-grid { display: flex; flex-direction: column; gap: 36px; align-items: center; }
      @media (min-width: 768px) {
        .mp-about-grid { display: grid; grid-template-columns: auto 1fr; gap: 56px; align-items: start; }
      }
      .mp-about-col { display: flex; flex-direction: column; align-items: center; gap: 20px; width: 100%; }
      @media (min-width: 768px) { .mp-about-col { align-items: flex-start; width: auto; } }

      /* About stats */
      .mp-about-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
      @media (max-width: 400px) { .mp-about-stats { grid-template-columns: 1fr; } }

      /* Skills */
      .mp-skills-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
      @media (min-width: 600px)  { .mp-skills-grid { grid-template-columns: repeat(2, 1fr); } }
      @media (min-width: 1024px) { .mp-skills-grid { grid-template-columns: repeat(auto-fit, minmax(250px,1fr)); } }

      /* Featured project */
      .mp-featured { display: grid; grid-template-columns: 1fr; }
      @media (min-width: 768px) { .mp-featured { grid-template-columns: 1fr 1fr; min-height: 360px; } }
      .mp-featured-img { height: 230px; overflow: hidden; }
      @media (min-width: 768px) { .mp-featured-img { height: auto; } }
      .mp-featured-body { padding: 24px 20px; display: flex; flex-direction: column; justify-content: space-between; }
      @media (min-width: 768px) { .mp-featured-body { padding: 36px 32px; } }

      /* Projects grid */
      .mp-projects-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
      @media (min-width: 520px)  { .mp-projects-grid { grid-template-columns: repeat(2, 1fr); } }
      @media (min-width: 1024px) { .mp-projects-grid { grid-template-columns: repeat(auto-fill, minmax(280px,1fr)); gap: 24px; } }

      /* Testimonials */
      .mp-testi-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
      @media (min-width: 520px) { .mp-testi-grid { grid-template-columns: repeat(2, 1fr); } }
      @media (min-width: 960px) { .mp-testi-grid { grid-template-columns: repeat(auto-fill, minmax(260px,1fr)); gap: 24px; } }

      /* Contact */
      .mp-contact-row { display: grid; grid-template-columns: 1fr; gap: 16px; margin-bottom: 16px; }
      @media (min-width: 520px) { .mp-contact-row { grid-template-columns: 1fr 1fr; margin-bottom: 20px; } }

      /* Hero stats — always 3-col grid */
      .mp-hero-stats {
        display: grid; grid-template-columns: repeat(3, 1fr);
        gap: 10px; max-width: 480px; margin: 0 auto 32px; width: 100%;
      }

      /* Hero CTAs */
      .mp-hero-ctas { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; margin-bottom: 32px; }
      .mp-cta {
        padding: 13px 26px; font-size: 0.92rem; font-weight: 900; text-decoration: none;
        letter-spacing: 0.08em; text-transform: uppercase; display: inline-block;
        border: 3px solid #0A0A0A; cursor: pointer;
        transition: box-shadow 0.15s, transform 0.15s;
        font-family: 'Impact', 'Arial Black', 'Helvetica Neue', sans-serif;
      }
      .mp-cta:hover  { box-shadow: 6px 6px 0 #0A0A0A; transform: translate(-2px,-2px); }
      .mp-cta:active { transform: translate(2px,2px);  box-shadow: 2px 2px 0 #0A0A0A; }
      @media (max-width: 380px) {
        .mp-hero-ctas { flex-direction: column; align-items: stretch; }
        .mp-cta { text-align: center; }
      }

      /* Memphis input */
      .mp-input {
        width: 100%; padding: 12px 14px; border: 3px solid #0A0A0A;
        border-radius: 0; background: #FFFEF0; font-size: 0.95rem;
        font-family: 'Helvetica Neue', Arial, sans-serif;
        box-sizing: border-box; transition: box-shadow 0.15s;
      }
      .mp-input:focus { outline: none; box-shadow: 4px 4px 0 #0055FF; }
      .mp-input::placeholder { color: #999; }

      @media (prefers-reduced-motion: reduce) {
        .mp-spin, .mp-wiggle, .mp-bounce { animation: none !important; }
      }
    `}</style>
  );
}

/* ── Squiggle SVG line ─────────────────────────────────────────── */
function Squiggle({ width = 180, color = '#0A0A0A', strokeWidth = 3, style = {} }) {
  const amp = 7, step = 20, waves = Math.ceil(width / step);
  let d = `M0,${amp}`;
  for (let i = 0; i < waves; i++) {
    const mid = i * step + step / 2, end = (i + 1) * step, y = i % 2 === 0 ? 0 : amp * 2;
    d += ` C${mid},${y} ${mid},${y} ${end},${amp}`;
  }
  return (
    <svg width={width} height={amp * 2 + strokeWidth}
      viewBox={`0 0 ${width} ${amp * 2 + strokeWidth}`}
      style={{ display: 'block', flexShrink: 0, ...style }}>
      <path d={d} stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ── Zigzag section divider ────────────────────────────────────── */
function ZigzagDivider({ fromBg, toBg, h = 18 }) {
  const W = 1440, teeth = 60, tw = W / teeth;
  let d = 'M0,0';
  for (let i = 0; i < teeth; i++) d += ` L${(i + 0.5) * tw},${h} L${(i + 1) * tw},0`;
  d += ` L${W},${h} L0,${h} Z`;
  return (
    <div style={{ lineHeight: 0, background: fromBg }}>
      <svg viewBox={`0 0 ${W} ${h}`} preserveAspectRatio="none"
        style={{ display: 'block', width: '100%', height: h }}>
        <path d={d} fill={toBg} />
      </svg>
    </div>
  );
}

/* ── Geometric decorations (position: absolute) ────────────────── */
function Dot({ size = 18, color = C.pink, style = {} }) {
  return <div style={{ width: size, height: size, borderRadius: '50%', background: color,
    border: `2px solid ${C.black}`, position: 'absolute', pointerEvents: 'none', ...style }} />;
}
function Box({ size = 20, color = C.yellow, style = {} }) {
  return <div style={{ width: size, height: size, background: color,
    border: `2px solid ${C.black}`, position: 'absolute', pointerEvents: 'none', ...style }} />;
}
function Tri({ size = 24, color = C.blue, style = {} }) {
  return (
    <svg width={size} height={size * 0.9} viewBox="0 0 24 22"
      style={{ position: 'absolute', pointerEvents: 'none', ...style }}>
      <polygon points="12,1 23,21 1,21" fill={color} stroke={C.black} strokeWidth={1.5} />
    </svg>
  );
}
function StarShape({ size = 24, color = C.red, style = {}, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      className={className} style={{ position: 'absolute', pointerEvents: 'none', ...style }}>
      <polygon points="12,2 14.9,8.8 22,9.3 16.7,14 18.2,21 12,17.3 5.8,21 7.3,14 2,9.3 9.1,8.8"
        fill={color} stroke={C.black} strokeWidth={1} />
    </svg>
  );
}
function Diamond({ size = 20, color = C.teal, style = {} }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 20 24"
      style={{ position: 'absolute', pointerEvents: 'none', ...style }}>
      <polygon points="10,1 19,12 10,23 1,12" fill={color} stroke={C.black} strokeWidth={1.5} />
    </svg>
  );
}
function Cross({ size = 20, color = C.orange, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      style={{ position: 'absolute', pointerEvents: 'none', ...style }}>
      <path d="M12,2 L12,22 M2,12 L22,12" stroke={color} strokeWidth={4} strokeLinecap="square" />
    </svg>
  );
}
function CircleOutline({ size = 28, color = C.purple, style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28"
      style={{ position: 'absolute', pointerEvents: 'none', ...style }}>
      <circle cx={14} cy={14} r={12} fill="none" stroke={color} strokeWidth={3} />
    </svg>
  );
}

/* ── Section Heading ───────────────────────────────────────────── */
function SectionHeading({ title, accent = C.yellow, dark = false }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }} style={{ marginBottom: 44 }}>
      <div style={{ display: 'inline-block' }}>
        <h2 style={{
          fontFamily: C.font, fontSize: 'clamp(2.2rem,5.5vw,3.5rem)',
          fontWeight: 900, color: dark ? C.white : C.black,
          textTransform: 'uppercase', letterSpacing: '-0.02em',
          margin: 0, lineHeight: 1,
        }}>{title}</h2>
        <div style={{ height: 10, background: accent, marginTop: 6,
          border: `2px solid ${C.black}`, boxShadow: hs3() }} />
      </div>
    </motion.div>
  );
}

/* ── Nav ───────────────────────────────────────────────────────── */
function Nav() {
  const [open, setOpen] = useState(false);
  const links = ['About', 'Skills', 'Projects', 'Experience', 'Contact'];

  return (
    <>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: C.black, borderBottom: `4px solid ${C.yellow}`, fontFamily: C.body }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62 }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <StarShape size={22} color={C.yellow}
              style={{ position: 'relative' }} className="mp-wiggle" />
            <span style={{ fontFamily: C.font, fontSize: '1.4rem', color: C.yellow,
              textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {data.personal.name.split(' ')[0]}
            </span>
          </div>

          <div className="hidden md:flex" style={{ gap: 2 }}>
            {links.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{
                color: C.white, textDecoration: 'none', fontSize: '0.82rem',
                fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                padding: '6px 14px', transition: 'background 0.15s, color 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = C.yellow; e.currentTarget.style.color = C.black; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.white; }}>
                {l}
              </a>
            ))}
          </div>

          <a href="#contact" className="hidden md:inline-block mp-cta"
            style={{ background: C.yellow, color: C.black, boxShadow: hs3(C.white), fontSize: '0.78rem', padding: '8px 18px' }}>
            Hire Me ★
          </a>

          <button onClick={() => setOpen(o => !o)} className="flex md:hidden" style={{
            background: 'none', border: `2px solid ${C.yellow}`, color: C.yellow,
            cursor: 'pointer', padding: '4px 6px', display: 'flex', alignItems: 'center',
          }}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }}
            exit={{ height: 0 }} transition={{ duration: 0.22 }}
            style={{ position: 'fixed', top: 62, left: 0, right: 0, zIndex: 999,
              background: C.black, borderBottom: `3px solid ${C.yellow}`, overflow: 'hidden' }}>
            {links.map((l, i) => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)}
                style={{ display: 'block', color: C.yellow, textDecoration: 'none',
                  fontSize: '1.05rem', fontWeight: 900, letterSpacing: '0.12em',
                  textTransform: 'uppercase', padding: '14px 20px',
                  borderBottom: `2px solid rgba(255,230,0,0.2)` }}>
                <span style={{ color: [C.red, C.pink, C.teal, C.orange, C.lime][i], marginRight: 10 }}>★</span>
                {l}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Hero ──────────────────────────────────────────────────────── */
function Hero() {
  const socials = [
    { Icon: Github,   href: data.socials.github,           color: C.black },
    { Icon: Linkedin, href: data.socials.linkedin,          color: C.blue  },
    { Icon: Twitter,  href: data.socials.twitter,           color: C.teal  },
    { Icon: Mail,     href: `mailto:${data.socials.email}`, color: C.red   },
  ];

  return (
    <section id="hero" style={{
      position: 'relative', minHeight: '100vh', background: C.white,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', overflow: 'hidden', padding: '88px 20px 72px',
    }}>
      {/* Scattered bg shapes */}
      <Dot   size={28} color={C.pink}   style={{ top: '10%', left: '5%' }} />
      <Box   size={22} color={C.yellow} style={{ top: '14%', left: '16%', transform: 'rotate(15deg)' }} />
      <Tri   size={32} color={C.blue}   style={{ top: '8%',  left: '31%' }} />
      <CircleOutline size={44} color={C.red}    style={{ top: '18%', right: '22%' }} />
      <StarShape size={30} color={C.orange} style={{ top: '10%', right: '9%'  }} className="mp-spin" />
      <Diamond   size={24} color={C.teal}   style={{ top: '6%',  right: '36%' }} />
      <Squiggle width={120} color={C.purple} strokeWidth={3}
        style={{ position: 'absolute', top: '22%', left: '2%' }} />
      <Cross     size={28} color={C.lime}   style={{ bottom: '25%', left: '8%' }} />
      <Dot   size={16} color={C.red}    style={{ bottom: '30%', left: '22%' }} />
      <Box   size={32} color={C.pink}   style={{ bottom: '20%', left: '3%', transform: 'rotate(30deg)' }} />
      <Tri   size={26} color={C.yellow} style={{ bottom: '15%', right: '8%' }} />
      <StarShape size={40} color={C.lime} style={{ bottom: '25%', right: '4%' }} className="mp-bounce" />
      <Dot   size={22} color={C.blue}   style={{ bottom: '35%', right: '20%' }} />
      <Diamond size={30} color={C.orange} style={{ bottom: '12%', right: '29%' }} />
      <CircleOutline size={56} color={C.teal} style={{ top: '42%', left: '1%' }} />
      <Squiggle width={100} color={C.orange} strokeWidth={3}
        style={{ position: 'absolute', bottom: '18%', right: '14%' }} />

      {/* Top stripe bar */}
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ duration: 0.6 }} style={{ transformOrigin: 'left',
          width: '100%', maxWidth: 700, height: 12, marginBottom: 28,
          background: `repeating-linear-gradient(-45deg, ${C.yellow} 0px, ${C.yellow} 8px, ${C.black} 8px, ${C.black} 16px)`,
          border: `2px solid ${C.black}` }} />

      <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{ fontFamily: C.font, fontSize: '0.82rem', letterSpacing: '0.3em',
          textTransform: 'uppercase', color: C.red, marginBottom: 10, textAlign: 'center' }}>
        ★ Memphis Pop Portfolio ★
      </motion.p>

      <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        style={{ fontFamily: C.font, fontSize: 'clamp(2.8rem,9vw,6.5rem)', fontWeight: 900,
          color: C.black, textTransform: 'uppercase', letterSpacing: '-0.03em',
          lineHeight: 0.95, textAlign: 'center', marginBottom: 10,
          textShadow: `4px 4px 0 ${C.yellow}, 6px 6px 0 ${C.black}` }}>
        {data.personal.name}
      </motion.h1>

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        style={{ background: C.blue, color: C.white, fontFamily: C.font,
          fontSize: 'clamp(0.8rem,2vw,1.05rem)', letterSpacing: '0.1em',
          textTransform: 'uppercase', padding: '6px 18px',
          border: `3px solid ${C.black}`, boxShadow: hs(4),
          marginBottom: 18, display: 'inline-block', textAlign: 'center' }}>
        {data.personal.title}
      </motion.div>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
        style={{ color: '#444', fontSize: '1rem', maxWidth: 500, textAlign: 'center',
          margin: '0 auto 28px', lineHeight: 1.65, fontStyle: 'italic' }}>
        "{data.personal.tagline}"
      </motion.p>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }} className="mp-hero-stats">
        {[
          { n: `${data.stats.yearsExperience}+`,  l: 'Yrs Exp',  bg: C.yellow },
          { n: `${data.stats.projectsCompleted}+`, l: 'Projects', bg: C.pink   },
          { n: `${data.stats.happyClients}+`,      l: 'Clients',  bg: C.teal   },
        ].map(({ n, l, bg }) => (
          <div key={l} style={{ background: bg, border: `3px solid ${C.black}`,
            boxShadow: hs(4), padding: '12px 8px', textAlign: 'center' }}>
            <div style={{ fontFamily: C.font, fontSize: 'clamp(1.3rem,4vw,1.9rem)', color: C.black }}>{n}</div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: C.black, marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </motion.div>

      {/* CTAs */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.78 }} className="mp-hero-ctas">
        <a href="#projects" className="mp-cta"
          style={{ background: C.red, color: C.white, boxShadow: hs() }}>
          See My Work ★
        </a>
        <a href={data.personal.resumeUrl || '#contact'} className="mp-cta"
          style={{ background: C.white, color: C.black, boxShadow: hs() }}>
          Resume
        </a>
      </motion.div>

      {/* Socials */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
        style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        {socials.map(({ Icon, href, color }) => (
          <a key={href} href={href} target="_blank" rel="noopener noreferrer"
            style={{ width: 42, height: 42, display: 'flex', alignItems: 'center',
              justifyContent: 'center', background: C.white,
              border: `3px solid ${C.black}`, boxShadow: hs(4), color,
              transition: 'box-shadow 0.15s, transform 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = hs(6); e.currentTarget.style.transform = 'translate(-2px,-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = hs(4); e.currentTarget.style.transform = 'translate(0,0)'; }}>
            <Icon size={19} />
          </a>
        ))}
      </motion.div>

      {/* Bottom stripe bar */}
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ delay: 1, duration: 0.6 }} style={{ transformOrigin: 'left',
          width: '100%', maxWidth: 700, height: 12, marginTop: 28,
          background: `repeating-linear-gradient(-45deg, ${C.red} 0, ${C.red} 8px, ${C.black} 8px, ${C.black} 16px)`,
          border: `2px solid ${C.black}` }} />

      {/* Scroll cue */}
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity }}
        style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
          color: C.black, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase' }}>Scroll</span>
        <ChevronDown size={17} />
      </motion.div>
    </section>
  );
}

/* ── About ─────────────────────────────────────────────────────── */
function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about" ref={ref} className="mp-sec"
      style={{ background: C.yellow, position: 'relative', overflow: 'hidden' }}>
      <Dot   size={24} color={C.pink}   style={{ top: 20,    right: '8%'  }} />
      <Box   size={20} color={C.blue}   style={{ bottom: 30, left: '5%', transform: 'rotate(20deg)' }} />
      <Tri   size={28} color={C.red}    style={{ bottom: 40, right: '12%' }} />
      <CircleOutline size={50} color={C.black} style={{ top: 40, left: '2%', opacity: 0.25 }} />
      <StarShape size={32} color={C.orange} style={{ top: 30, right: '20%' }} className="mp-spin" />
      <Squiggle width={100} color={C.black} strokeWidth={2.5}
        style={{ position: 'absolute', bottom: 20, right: '5%', opacity: 0.4 }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <SectionHeading title="About Me" accent={C.red} />

        <div className="mp-about-grid">
          {/* Avatar */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }} className="mp-about-col">
            <div style={{ width: 200, height: 200, border: `4px solid ${C.black}`,
              boxShadow: hs(8), flexShrink: 0, overflow: 'hidden' }}>
              <img src={data.personal.avatar} alt={data.personal.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
              {[
                { Icon: MapPin, text: data.personal.location, color: C.black  },
                { Icon: Mail,   text: data.socials.email,     color: C.blue,  href: `mailto:${data.socials.email}` },
                { Icon: Github, text: 'GitHub',               color: C.black, href: data.socials.github },
              ].map(({ Icon, text, color, href }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Icon size={15} color={color} />
                  {href
                    ? <a href={href} target="_blank" rel="noopener noreferrer"
                        style={{ color: C.black, fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>{text}</a>
                    : <span style={{ color: C.black, fontSize: '0.85rem', fontWeight: 600 }}>{text}</span>
                  }
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}>
            <div style={{ background: C.white, border: `3px solid ${C.black}`,
              boxShadow: hs(6), padding: '22px 20px', marginBottom: 22 }}>
              <p style={{ color: '#222', fontSize: '1rem', lineHeight: 1.8, margin: 0 }}>{data.personal.bio}</p>
            </div>
            <Squiggle width={200} color={C.black} strokeWidth={2.5}
              style={{ position: 'relative', marginBottom: 18 }} />
            <div className="mp-about-stats">
              {[
                { n: `${data.stats.yearsExperience}+`,  l: 'Years',    bg: C.blue,  text: C.white  },
                { n: `${data.stats.projectsCompleted}+`, l: 'Projects', bg: C.red,   text: C.white  },
                { n: `${data.stats.happyClients}+`,      l: 'Clients',  bg: C.black, text: C.yellow },
              ].map(({ n, l, bg, text }) => (
                <div key={l} style={{ background: bg, border: `3px solid ${C.black}`,
                  boxShadow: hs(4), padding: '14px 10px', textAlign: 'center' }}>
                  <div style={{ fontFamily: C.font, fontSize: '1.7rem', color: text }}>{n}</div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: text, marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── Skills ────────────────────────────────────────────────────── */
function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const byCategory = data.skills.reduce((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});

  return (
    <section id="skills" ref={ref} className="mp-sec"
      style={{ background: C.white, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.06,
        backgroundImage: `radial-gradient(${C.black} 2px, transparent 2px)`,
        backgroundSize: '28px 28px' }} />
      <Tri       size={36} color={C.pink}   style={{ top: 20, right: '6%' }} />
      <Box       size={24} color={C.blue}   style={{ bottom: 30, left: '4%', transform: 'rotate(12deg)' }} />
      <StarShape size={28} color={C.yellow} style={{ bottom: 20, right: '10%' }} className="mp-bounce" />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <SectionHeading title="My Skills" accent={C.blue} />

        <div className="mp-skills-grid">
          {Object.entries(byCategory).map(([cat, skills], ci) => {
            const meta = catMeta[cat] || { color: C.purple, bg: '#F5F0FF' };
            const Icon = { Frontend: Code2, Backend: Server, DevOps: Layers, Design: Palette }[cat] || Code2;
            return (
              <motion.div key={cat}
                initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: ci * 0.1, duration: 0.5 }}
                className="mp-card" style={{ padding: '24px 22px' }}>
                <div style={{ background: meta.color, border: `2px solid ${C.black}`,
                  padding: '8px 14px', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon size={18} color={C.white} />
                  <span style={{ fontFamily: C.font, fontSize: '1rem', color: C.white,
                    textTransform: 'uppercase', letterSpacing: '0.1em' }}>{cat}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {skills.map((sk, si) => (
                    <div key={sk.name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: C.black }}>{sk.name}</span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 900, color: meta.color }}>{sk.level}%</span>
                      </div>
                      <div style={{ height: 10, background: '#eee', border: `2px solid ${C.black}`, overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${sk.level}%` } : {}}
                          transition={{ delay: ci * 0.1 + si * 0.05 + 0.25, duration: 0.8, ease: 'easeOut' }}
                          style={{ height: '100%', background: meta.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tag cloud */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 44, justifyContent: 'center' }}>
          {data.skills.map((sk) => {
            const meta = catMeta[sk.category] || { color: C.purple, bg: '#F5F0FF' };
            return (
              <span key={sk.name} style={{ padding: '6px 16px', border: `2px solid ${C.black}`,
                background: meta.bg, color: meta.color, fontWeight: 700,
                fontSize: '0.82rem', letterSpacing: '0.06em', boxShadow: hs3() }}>
                {sk.name}
              </span>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ── Projects ──────────────────────────────────────────────────── */
function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const featured = data.projects[0];
  const rest = data.projects.slice(1);

  return (
    <section id="projects" ref={ref} className="mp-sec"
      style={{ background: '#F5F0FF', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 10,
        background: `repeating-linear-gradient(-45deg, ${C.purple} 0, ${C.purple} 6px, ${C.white} 6px, ${C.white} 12px)`,
        borderBottom: `2px solid ${C.black}` }} />
      <Dot       size={30} color={C.orange} style={{ top: 30,    left: '5%'  }} />
      <Cross     size={26} color={C.red}    style={{ bottom: 30, right: '6%' }} />
      <Diamond   size={28} color={C.blue}   style={{ top: 40,    right: '10%'}} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <SectionHeading title="Projects" accent={C.purple} />

        {/* Featured */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mp-card mp-featured" style={{ marginBottom: 28 }}>
          <div className="mp-featured-img">
            <img src={featured.image} alt={featured.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
          </div>
          <div className="mp-featured-body">
            <div>
              <div style={{ background: C.red, display: 'inline-block', color: C.white,
                fontFamily: C.font, fontSize: '0.7rem', letterSpacing: '0.15em',
                textTransform: 'uppercase', padding: '3px 12px',
                border: `2px solid ${C.black}`, marginBottom: 12 }}>★ Featured</div>
              <h3 style={{ fontFamily: C.font, fontSize: 'clamp(1.4rem,3vw,1.9rem)',
                color: C.black, margin: '0 0 10px', textTransform: 'uppercase' }}>
                {featured.title}
              </h3>
              <p style={{ color: '#333', lineHeight: 1.7, fontSize: '0.92rem', marginBottom: 18 }}>
                {featured.description}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
                {featured.techStack.map((t, i) => (
                  <span key={t} style={{ padding: '3px 10px', border: `2px solid ${C.black}`,
                    background: [C.yellow, C.pink, C.teal, C.lime][i % 4],
                    fontSize: '0.78rem', fontWeight: 700 }}>{t}</span>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href={featured.liveUrl} target="_blank" rel="noopener noreferrer"
                className="mp-cta" style={{ background: C.blue, color: C.white, boxShadow: hs(), fontSize: '0.82rem', padding: '10px 20px' }}>
                Live Demo <ExternalLink size={13} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 4 }} />
              </a>
              <a href={featured.githubUrl} target="_blank" rel="noopener noreferrer"
                className="mp-cta" style={{ background: C.white, color: C.black, boxShadow: hs(), fontSize: '0.82rem', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Github size={15} /> Code
              </a>
            </div>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="mp-projects-grid">
          {rest.map((proj, i) => (
            <motion.div key={proj.title}
              initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.12 + i * 0.09, duration: 0.5 }}
              className="mp-card" style={{ overflow: 'hidden' }}>
              <div style={{ height: 185, overflow: 'hidden' }}>
                <img src={proj.image} alt={proj.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.35s', display: 'block' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.07)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
              </div>
              <div style={{ height: 6, background: [C.yellow, C.pink, C.teal, C.blue, C.orange][i % 5] }} />
              <div style={{ padding: '18px 18px 16px' }}>
                <h3 style={{ fontFamily: C.font, fontSize: '1.05rem', color: C.black,
                  margin: '0 0 6px', textTransform: 'uppercase' }}>{proj.title}</h3>
                <p style={{ color: '#555', fontSize: '0.84rem', lineHeight: 1.6, marginBottom: 12 }}>
                  {proj.description.slice(0, 90)}…
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                  {proj.techStack.slice(0, 3).map((t, ti) => (
                    <span key={t} style={{ padding: '2px 8px', border: `1.5px solid ${C.black}`,
                      background: [C.yellow, C.lime, C.pink][ti % 3], fontSize: '0.74rem', fontWeight: 700 }}>{t}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer"
                    className="mp-cta" style={{ flex: 1, textAlign: 'center', background: C.black, color: C.yellow,
                      boxShadow: hs(3), fontSize: '0.76rem', padding: '8px 10px' }}>Live ↗</a>
                  <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer"
                    className="mp-cta" style={{ flex: 1, textAlign: 'center', background: C.white, color: C.black,
                      boxShadow: hs(3), fontSize: '0.76rem', padding: '8px 10px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <Github size={13} /> Code
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

/* ── Experience ────────────────────────────────────────────────── */
function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const dotColors = [C.yellow, C.pink, C.teal, C.lime];

  return (
    <section id="experience" ref={ref} className="mp-sec"
      style={{ background: C.black, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 10,
        background: `repeating-linear-gradient(-45deg, ${C.yellow} 0, ${C.yellow} 6px, ${C.black} 6px, ${C.black} 12px)`,
        borderBottom: `2px solid ${C.yellow}` }} />
      <Dot       size={24} color={C.pink}  style={{ top: 30,    right: '8%' }} />
      <StarShape size={30} color={C.teal}  style={{ bottom: 30, left: '5%'  }} className="mp-spin" />
      <CircleOutline size={50} color={C.yellow} style={{ bottom: 40, right: '4%', opacity: 0.35 }} />

      <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <SectionHeading title="Experience" accent={C.yellow} dark />
        <div style={{ position: 'relative', paddingLeft: 16 }}>
          {/* Dashed vertical timeline */}
          <div style={{ position: 'absolute', left: 16, top: 0, bottom: 0, width: 4,
            background: `repeating-linear-gradient(to bottom, ${C.yellow} 0, ${C.yellow} 8px, transparent 8px, transparent 16px)` }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
            {data.experience.map((exp, i) => (
              <motion.div key={exp.company}
                initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.12, duration: 0.55 }}
                style={{ display: 'flex', gap: 22 }}>
                <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 36, height: 36, background: dotColors[i % 4],
                    border: `3px solid ${C.black}`, boxShadow: `5px 5px 0 ${dotColors[i % 4]}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: C.font, fontSize: '0.85rem', color: C.black }}>{i + 1}</div>
                </div>
                <div style={{ flex: 1, background: C.white, border: `3px solid ${dotColors[i % 4]}`,
                  boxShadow: `5px 5px 0 ${dotColors[i % 4]}`, padding: '16px 18px', marginBottom: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                    <div>
                      <h3 style={{ fontFamily: C.font, fontSize: '1rem', color: C.black,
                        margin: '0 0 3px', textTransform: 'uppercase' }}>{exp.role}</h3>
                      <span style={{ color: dotColors[i % 4], fontSize: '0.88rem',
                        fontWeight: 900, fontFamily: C.font, textTransform: 'uppercase',
                        textShadow: `1px 1px 0 ${C.black}` }}>{exp.company}</span>
                    </div>
                    <span style={{ background: dotColors[i % 4], color: C.black,
                      padding: '3px 10px', border: `2px solid ${C.black}`,
                      fontSize: '0.74rem', fontWeight: 900, whiteSpace: 'nowrap' }}>{exp.period}</span>
                  </div>
                  <p style={{ color: '#333', fontSize: '0.87rem', lineHeight: 1.7, margin: 0 }}>
                    {exp.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Testimonials ──────────────────────────────────────────────── */
function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="testimonials" ref={ref} className="mp-sec"
      style={{ background: '#FFE8F4', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.08,
        backgroundImage: `radial-gradient(${C.black} 2.5px, transparent 2.5px)`,
        backgroundSize: '24px 24px' }} />
      <Tri       size={30} color={C.blue} style={{ top: 20,    left: '6%'  }} />
      <Box       size={22} color={C.teal} style={{ bottom: 30, right: '8%', transform: 'rotate(18deg)' }} />
      <StarShape size={26} color={C.red}  style={{ top: 30,    right: '5%' }} className="mp-wiggle" />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <SectionHeading title="Testimonials" accent={C.pink} />
        <div className="mp-testi-grid">
          {data.testimonials.map((t, i) => {
            const accent = [C.yellow, C.teal, C.blue, C.orange][i % 4];
            return (
              <motion.div key={t.name}
                initial={{ opacity: 0, y: 30, rotate: i % 2 === 0 ? -1 : 1 }}
                animate={inView ? { opacity: 1, y: 0, rotate: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="mp-card" style={{ padding: '24px 22px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ height: 8, background: accent, margin: '-24px -22px 18px',
                  borderBottom: `2px solid ${C.black}` }} />
                <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star key={si} size={15} fill={C.yellow} color={C.black} strokeWidth={1.5} />
                  ))}
                </div>
                <div style={{ position: 'absolute', top: 28, right: 18, fontFamily: C.font,
                  fontSize: '5rem', color: accent, opacity: 0.12, lineHeight: 1 }}>"</div>
                <p style={{ color: '#222', fontSize: '0.9rem', lineHeight: 1.75,
                  marginBottom: 20, fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 46, height: 46, flexShrink: 0, overflow: 'hidden',
                    border: `3px solid ${C.black}`, boxShadow: hs(3, accent) }}>
                    <img src={t.avatar} alt={t.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: C.font, fontSize: '0.9rem', color: C.black, textTransform: 'uppercase' }}>{t.name}</div>
                    <div style={{ fontSize: '0.76rem', color: '#666', marginTop: 2 }}>{t.role}</div>
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

/* ── Contact ───────────────────────────────────────────────────── */
function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => setStatus('done'), 1800);
  };

  return (
    <section id="contact" ref={ref} className="mp-sec"
      style={{ background: '#E0FFF8', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 10,
        background: `repeating-linear-gradient(-45deg, ${C.teal} 0, ${C.teal} 6px, ${C.white} 6px, ${C.white} 12px)`,
        borderBottom: `2px solid ${C.black}` }} />
      <Dot       size={26} color={C.orange} style={{ top: 30,    right: '7%' }} />
      <StarShape size={32} color={C.yellow} style={{ bottom: 30, left: '5%'  }} className="mp-bounce" />
      <Squiggle width={120} color={C.black} strokeWidth={2.5}
        style={{ position: 'absolute', bottom: 20, right: '8%', opacity: 0.25 }} />

      <div style={{ maxWidth: 680, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <SectionHeading title="Say Hello" accent={C.teal} />
        <motion.div initial={{ opacity: 0, y: 36 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}>
          <div style={{ background: C.white, border: `3px solid ${C.black}`, boxShadow: hs(8), padding: '32px 24px' }}>
            <AnimatePresence mode="wait">
              {status === 'done' ? (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  style={{ textAlign: 'center', padding: '36px 0' }}>
                  <CheckCircle size={54} color={C.teal} style={{ margin: '0 auto 16px', display: 'block' }} />
                  <h3 style={{ fontFamily: C.font, fontSize: '2rem', textTransform: 'uppercase',
                    color: C.black, marginBottom: 8 }}>Groovy! ★</h3>
                  <p style={{ color: '#555' }}>Thanks for reaching out — I'll be in touch soon!</p>
                  <button onClick={() => { setStatus('idle'); setForm({ name: '', email: '', message: '' }); }}
                    className="mp-cta" style={{ background: C.yellow, color: C.black, boxShadow: hs(), marginTop: 24 }}>
                    Send Another
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="mp-contact-row">
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900,
                        letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6, color: C.black }}>Name</label>
                      <input className="mp-input" placeholder="Your name" required
                        value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900,
                        letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6, color: C.black }}>Email</label>
                      <input type="email" className="mp-input" placeholder="you@example.com" required
                        value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                    </div>
                  </div>
                  <div style={{ marginBottom: 22 }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 900,
                      letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6, color: C.black }}>Message</label>
                    <textarea className="mp-input" placeholder="Tell me about your project..." required rows={5}
                      style={{ resize: 'vertical' }}
                      value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
                  </div>
                  <button type="submit" disabled={status === 'sending'}
                    className="mp-cta" style={{ width: '100%', background: C.black, color: C.yellow,
                      boxShadow: hs(6), display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: 10, fontFamily: C.font, fontSize: '1rem' }}>
                    {status === 'sending' ? (
                      <><motion.span animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}>★</motion.span> Sending…</>
                    ) : <><Send size={17} /> Send It ★</>}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 26, flexWrap: 'wrap' }}>
            {[
              { Icon: Mail,     href: `mailto:${data.socials.email}`, label: 'Email',    color: C.red   },
              { Icon: Github,   href: data.socials.github,             label: 'GitHub',   color: C.black },
              { Icon: Linkedin, href: data.socials.linkedin,           label: 'LinkedIn', color: C.blue  },
              { Icon: Twitter,  href: data.socials.twitter,            label: 'Twitter',  color: C.teal  },
            ].map(({ Icon, href, label, color }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 7, color,
                  textDecoration: 'none', fontSize: '0.86rem', fontWeight: 700,
                  transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.65'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                <Icon size={16} /> {label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Footer ────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ background: C.black, borderTop: `4px solid ${C.yellow}`,
      padding: '36px 24px 28px', position: 'relative', overflow: 'hidden' }}>
      <Dot   size={14} color={C.pink}   style={{ top: 16, left: '10%' }} />
      <Box   size={14} color={C.yellow} style={{ top: 20, left: '30%', transform: 'rotate(15deg)' }} />
      <Tri   size={16} color={C.teal}   style={{ top: 12, right: '20%' }} />
      <StarShape size={18} color={C.orange} style={{ top: 16, right: '8%' }} className="mp-spin" />

      <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ height: 8, marginBottom: 20,
          background: `repeating-linear-gradient(-45deg,
            ${C.red} 0, ${C.red} 6px, ${C.yellow} 6px, ${C.yellow} 12px,
            ${C.blue} 12px, ${C.blue} 18px, ${C.pink} 18px, ${C.pink} 24px)`,
          border: `2px solid ${C.yellow}` }} />
        <div style={{ fontFamily: C.font, fontSize: 'clamp(1.2rem,4vw,2rem)',
          color: C.yellow, textTransform: 'uppercase', letterSpacing: '0.05em',
          textShadow: `3px 3px 0 ${C.red}`, marginBottom: 8 }}>
          {data.personal.name}
        </div>
        <p style={{ color: '#666', fontSize: '0.82rem', marginBottom: 12 }}>{data.personal.tagline}</p>
        <p style={{ color: '#444', fontSize: '0.76rem' }}>
          ★ Made with bold shapes & big energy · {new Date().getFullYear()} · {data.personal.name} ★
        </p>
      </div>
    </footer>
  );
}

/* ── Root ──────────────────────────────────────────────────────── */
export default function MemphisPop() {
  return (
    <>
      <GlobalStyles />
      <div style={{ background: C.white, color: C.black, fontFamily: C.body, minHeight: '100vh' }}>
        <Nav />
        <Hero />
        <ZigzagDivider fromBg={C.white}  toBg={C.yellow} />
        <About />
        <ZigzagDivider fromBg={C.yellow} toBg={C.white}  />
        <Skills />
        <ZigzagDivider fromBg={C.white}  toBg="#F5F0FF"  />
        <Projects />
        <ZigzagDivider fromBg="#F5F0FF"  toBg={C.black}  />
        <Experience />
        <ZigzagDivider fromBg={C.black}  toBg="#FFE8F4"  />
        <Testimonials />
        <ZigzagDivider fromBg="#FFE8F4"  toBg="#E0FFF8"  />
        <Contact />
        <ZigzagDivider fromBg="#E0FFF8"  toBg={C.black}  />
        <Footer />
      </div>
    </>
  );
}
