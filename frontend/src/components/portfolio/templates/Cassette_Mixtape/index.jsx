import { useState, useRef } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Github, Linkedin, Twitter, Mail, MapPin, ExternalLink,
  Play, Pause, Star, Menu, X, Send, CheckCircle, ChevronDown,
  Code2, Server, Layers, Palette, Music, Rewind, FastForward,
} from 'lucide-react';
import data from '../../../../data/dummy_data.json';

/* ── Design tokens ─────────────────────────────────────────────── */
const C = {
  bg:     '#1C1008',   // very dark warm brown (cassette housing)
  bgAlt:  '#241508',   // slightly lighter dark
  paper:  '#EDE0C0',   // warm cream paper
  cream:  '#F5EAD0',   // lighter cream
  text:   '#1C1008',   // dark warm text on cream
  sub:    '#5A3E20',   // medium warm brown
  muted:  '#8A6A42',   // muted warm
  light:  '#C8B090',   // light warm on dark
  orange: '#C85A10',   // rust orange accent
  gold:   '#B88820',   // warm gold
  teal:   '#1A6A78',   // cassette window teal
  burg:   '#7A1818',   // burgundy accent
  tape:   '#3A2010',   // tape brown
  mono:   "'Courier New', 'Courier', monospace",
  serif:  "'Georgia', 'Times New Roman', serif",
  sans:   "'Helvetica Neue', 'Arial', sans-serif",
};

/* Fake track durations for visual authenticity */
const DURATIONS = ['3:47','4:12','2:58','5:03','3:22','4:47'];

/* ── Global CSS ────────────────────────────────────────────────── */
function GlobalStyles() {
  return (
    <style>{`
      @keyframes cm-reel {
        to { transform: rotate(360deg); }
      }
      @keyframes cm-eq {
        0%,100% { transform: scaleY(0.3); }
        25%     { transform: scaleY(1);   }
        50%     { transform: scaleY(0.6); }
        75%     { transform: scaleY(0.9); }
      }
      @keyframes cm-flicker {
        0%,89%,91%,100% { opacity: 1; }
        90%             { opacity: 0.7; }
      }
      @keyframes cm-scroll-tape {
        from { background-position: 0 0; }
        to   { background-position: 100px 0; }
      }
      @keyframes cm-pulse-dot {
        0%,100% { opacity: 1; transform: scale(1); }
        50%     { opacity: 0.4; transform: scale(0.8); }
      }

      .cm-reel  { animation: cm-reel    5s linear     infinite; transform-box: fill-box; transform-origin: center; }
      .cm-reel2 { animation: cm-reel    8s linear     infinite; transform-box: fill-box; transform-origin: center; }
      .cm-eq1   { animation: cm-eq     0.7s ease-in-out infinite; }
      .cm-eq2   { animation: cm-eq     0.9s ease-in-out 0.15s infinite; }
      .cm-eq3   { animation: cm-eq     0.6s ease-in-out 0.3s  infinite; }
      .cm-eq4   { animation: cm-eq     1.1s ease-in-out 0.1s  infinite; }
      .cm-eq5   { animation: cm-eq     0.8s ease-in-out 0.25s infinite; }
      .cm-flicker { animation: cm-flicker 4s ease-in-out infinite; }
      .cm-pulse   { animation: cm-pulse-dot 1.5s ease-in-out infinite; }

      /* Warm paper grain overlay */
      .cm-paper {
        background-color: ${C.paper};
        background-image:
          url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Ccircle cx='1' cy='1' r='0.6' fill='%23C8A870' opacity='0.18'/%3E%3C/svg%3E");
      }

      /* Section padding responsive */
      .cm-sec { padding: 64px 16px; position: relative; overflow: hidden; }
      @media (min-width: 640px)  { .cm-sec { padding: 80px 28px; } }
      @media (min-width: 1024px) { .cm-sec { padding: 96px 48px; } }

      /* About grid */
      .cm-about-grid { display: flex; flex-direction: column; gap: 36px; align-items: center; }
      @media (min-width: 768px) {
        .cm-about-grid { display: grid; grid-template-columns: auto 1fr; gap: 52px; align-items: start; }
      }
      .cm-about-col { display: flex; flex-direction: column; align-items: center; gap: 18px; width: 100%; }
      @media (min-width: 768px) { .cm-about-col { align-items: flex-start; width: auto; } }

      /* Stats always 3-col */
      .cm-stats {
        display: grid; grid-template-columns: repeat(3,1fr);
        gap: 10px; width: 100%; max-width: 420px; margin: 0 auto 32px;
      }

      /* Skills grid */
      .cm-skills-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
      @media (min-width: 640px)  { .cm-skills-grid { grid-template-columns: repeat(2,1fr); } }
      @media (min-width: 1024px) { .cm-skills-grid { grid-template-columns: repeat(auto-fit, minmax(260px,1fr)); } }

      /* Testi grid */
      .cm-testi-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
      @media (min-width: 540px) { .cm-testi-grid { grid-template-columns: repeat(2,1fr); } }
      @media (min-width: 960px) { .cm-testi-grid { grid-template-columns: repeat(auto-fill, minmax(260px,1fr)); gap: 24px; } }

      /* Contact row */
      .cm-contact-row { display: grid; grid-template-columns: 1fr; gap: 16px; margin-bottom: 16px; }
      @media (min-width: 520px) { .cm-contact-row { grid-template-columns: 1fr 1fr; margin-bottom: 20px; } }

      /* Hero CTAs */
      .cm-ctas { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
      @media (max-width: 380px) { .cm-ctas { flex-direction: column; align-items: stretch; } }

      /* Tape input */
      .cm-input {
        width: 100%; padding: 11px 14px; border: none; border-bottom: 2px solid ${C.sub};
        border-radius: 0; background: transparent; font-family: ${C.mono};
        font-size: 0.9rem; color: ${C.text}; box-sizing: border-box;
        transition: border-color 0.2s;
      }
      .cm-input:focus { outline: none; border-bottom-color: ${C.orange}; }
      .cm-input::placeholder { color: ${C.muted}; }

      /* Tape button */
      .cm-btn {
        padding: 12px 28px; border-radius: 2px; font-family: ${C.mono};
        font-size: 0.88rem; font-weight: 700; letter-spacing: 0.08em;
        text-transform: uppercase; cursor: pointer; border: none;
        transition: filter 0.2s, transform 0.15s;
        text-decoration: none; display: inline-block;
      }
      .cm-btn:hover  { filter: brightness(1.1); transform: translateY(-1px); }
      .cm-btn:active { transform: translateY(1px); }

      @media (prefers-reduced-motion: reduce) {
        .cm-reel, .cm-reel2, .cm-eq1, .cm-eq2, .cm-eq3, .cm-eq4, .cm-eq5,
        .cm-flicker, .cm-pulse { animation: none !important; }
      }
    `}</style>
  );
}

/* ── Cassette tape SVG illustration ───────────────────────────── */
function CassetteSVG({ width = 480, playing = false, label = '', subtitle = '' }) {
  const h = Math.round(width * 0.64);
  const lx = width * 0.08, ly = h * 0.07, lw = width * 0.84, lh = h * 0.38;
  const wy = h * 0.53, wry = h * 0.2;
  const r1x = width * 0.28, r2x = width * 0.72, ry = h * 0.65;
  const rr = width * 0.115;

  const ReelSpokes = ({ cx, cy, r, spin }) => (
    <g className={playing ? (spin ? 'cm-reel' : 'cm-reel2') : ''}>
      {[0,45,90,135,180,225,270,315].map(a => {
        const rad = a * Math.PI / 180;
        return (
          <line key={a}
            x1={cx + r * 0.22 * Math.cos(rad)} y1={cy + r * 0.22 * Math.sin(rad)}
            x2={cx + r * 0.82 * Math.cos(rad)} y2={cy + r * 0.82 * Math.sin(rad)}
            stroke="#3A3020" strokeWidth={1.5} />
        );
      })}
    </g>
  );

  return (
    <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`}
      style={{ filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.6))' }}>
      {/* Outer housing */}
      <rect x={3} y={3} width={width-6} height={h-6} rx={14}
        fill="#1A1008" stroke="#3A2510" strokeWidth={2} />

      {/* Screw holes */}
      {[[18,18],[width-18,18],[18,h-18],[width-18,h-18]].map(([x,y],i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={5} fill="#0D0A05" />
          <line x1={x-3} y1={y} x2={x+3} y2={y} stroke="#3A2510" strokeWidth={1} />
          <line x1={x} y1={y-3} x2={x} y2={y+3} stroke="#3A2510" strokeWidth={1} />
        </g>
      ))}

      {/* Label area */}
      <rect x={lx} y={ly} width={lw} height={lh} rx={6}
        fill="#EDE0C0" />
      {/* Label top stripe */}
      <rect x={lx} y={ly} width={lw} height={lh * 0.18} rx={0}
        fill={C.orange} />
      <rect x={lx} y={ly + lh * 0.18} width={lw} height={1} fill="#C84A08" />

      {/* SIDE A label */}
      <text x={lx + 10} y={ly + lh * 0.14} fontFamily={C.mono} fontSize={10}
        fill="#FAF0E0" fontWeight="bold" letterSpacing={3}>SIDE A</text>

      {/* Artist name */}
      <text x={width / 2} y={ly + lh * 0.48} textAnchor="middle"
        fontFamily={C.serif} fontSize={Math.min(20, width * 0.042)} fill={C.text}
        fontWeight="bold" letterSpacing={1}>
        {label || data.personal.name}
      </text>

      {/* Title */}
      <text x={width / 2} y={ly + lh * 0.68} textAnchor="middle"
        fontFamily={C.mono} fontSize={Math.min(11, width * 0.024)} fill={C.sub} letterSpacing={2}>
        {subtitle || 'THE MIXTAPE'}
      </text>

      {/* Mini track lines */}
      {[0.78, 0.86, 0.94].map((r, i) => (
        <line key={i} x1={lx + lw * 0.08} x2={lx + lw * 0.92}
          y1={ly + lh * r} y2={ly + lh * r}
          stroke={C.muted} strokeWidth={0.8} opacity={0.5} />
      ))}

      {/* Tape window */}
      <ellipse cx={width/2} cy={wy} rx={width*0.3} ry={wry}
        fill="#060C10" stroke="#0A1820" strokeWidth={2} />
      {/* Window shine */}
      <ellipse cx={width/2 - width*0.05} cy={wy - wry*0.3} rx={width*0.06} ry={wry*0.15}
        fill="rgba(255,255,255,0.05)" />

      {/* Tape strip across window */}
      <rect x={width*0.14} y={wy - 4} width={width*0.72} height={8}
        fill={C.tape} opacity={0.6} />

      {/* Left reel */}
      <circle cx={r1x} cy={ry} r={rr} fill="#0D0A08" stroke="#2A1808" strokeWidth={1.5} />
      <ReelSpokes cx={r1x} cy={ry} r={rr} spin />
      <circle cx={r1x} cy={ry} r={rr * 0.18} fill="#2A1808" />
      <circle cx={r1x} cy={ry} r={rr * 0.07} fill="#4A3020" />

      {/* Right reel */}
      <circle cx={r2x} cy={ry} r={rr} fill="#0D0A08" stroke="#2A1808" strokeWidth={1.5} />
      <ReelSpokes cx={r2x} cy={ry} r={rr} />
      <circle cx={r2x} cy={ry} r={rr * 0.18} fill="#2A1808" />
      <circle cx={r2x} cy={ry} r={rr * 0.07} fill="#4A3020" />

      {/* Guide rollers at bottom */}
      {[0.2, 0.5, 0.8].map((rx, i) => (
        <circle key={i} cx={width * rx} cy={h - 18} r={5}
          fill="#0D0A08" stroke="#2A1808" strokeWidth={1} />
      ))}

      {/* Playing indicator */}
      {playing && (
        <g>
          <circle cx={lx + lw - 16} cy={ly + 10} r={5} fill="#FF3030" className="cm-pulse" />
          <text x={lx + lw - 30} y={ly + 14} fontFamily={C.mono} fontSize={8}
            fill="#FF3030" textAnchor="end">REC</text>
        </g>
      )}
    </svg>
  );
}

/* ── EQ bars (playing animation) ──────────────────────────────── */
function EQBars({ color = C.orange, count = 5 }) {
  const classes = ['cm-eq1','cm-eq2','cm-eq3','cm-eq4','cm-eq5'];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 24 }}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className={classes[i % 5]} style={{
          width: 4, height: '100%', background: color,
          borderRadius: 1, transformOrigin: 'bottom',
        }} />
      ))}
    </div>
  );
}

/* ── Tape reel decoration ──────────────────────────────────────── */
function TapeReelDecor({ size = 60, style = {} }) {
  const c = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      style={{ position: 'absolute', pointerEvents: 'none', opacity: 0.15, ...style }}
      className="cm-reel">
      <circle cx={c} cy={c} r={c - 2} fill="none" stroke={C.light} strokeWidth={2} />
      {[0,60,120,180,240,300].map(a => {
        const rad = a * Math.PI / 180;
        return (
          <line key={a}
            x1={c + (c * 0.22) * Math.cos(rad)} y1={c + (c * 0.22) * Math.sin(rad)}
            x2={c + (c * 0.82) * Math.cos(rad)} y2={c + (c * 0.82) * Math.sin(rad)}
            stroke={C.light} strokeWidth={1.5} />
        );
      })}
      <circle cx={c} cy={c} r={c * 0.18} fill={C.light} />
    </svg>
  );
}

/* ── Side label strip ──────────────────────────────────────────── */
function SideLabel({ side = 'A', title, dark = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 44 }}>
      <div style={{
        background: C.orange, color: '#FAF0E0', fontFamily: C.mono,
        fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.25em',
        textTransform: 'uppercase', padding: '4px 12px', flexShrink: 0,
        writingMode: 'horizontal-tb',
      }}>
        SIDE {side}
      </div>
      <div style={{ flex: 1 }}>
        <h2 style={{
          fontFamily: C.serif, fontSize: 'clamp(1.9rem,5vw,3rem)',
          color: dark ? C.cream : C.text, margin: 0, letterSpacing: '-0.02em',
          fontWeight: 700, lineHeight: 1.1,
        }}>{title}</h2>
        {/* Tape line */}
        <div style={{ height: 2, background: `linear-gradient(90deg, ${C.orange}, transparent)`,
          marginTop: 8, maxWidth: 300 }} />
      </div>
    </div>
  );
}

/* ── Nav ───────────────────────────────────────────────────────── */
function Nav() {
  const [open, setOpen] = useState(false);
  const links = ['About','Skills','Projects','Experience','Contact'];

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: 'rgba(20,10,4,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.tape}`, fontFamily: C.mono,
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Music size={18} color={C.orange} />
            <span style={{ color: C.cream, fontSize: '0.88rem', fontWeight: 700,
              letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              {data.personal.name.split(' ')[0]}
            </span>
            <EQBars color={C.orange} count={4} />
          </div>

          <div className="hidden md:flex" style={{ gap: 4 }}>
            {links.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{
                color: C.light, textDecoration: 'none', fontSize: '0.78rem',
                fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                padding: '6px 12px', transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = C.cream}
                onMouseLeave={e => e.currentTarget.style.color = C.light}>
                {l}
              </a>
            ))}
          </div>

          <a href="#contact" className="hidden md:inline-block cm-btn"
            style={{ background: C.orange, color: '#FAF0E0', fontSize: '0.76rem', padding: '8px 18px' }}>
            Hire Me ▶
          </a>

          <button onClick={() => setOpen(o => !o)} className="flex md:hidden"
            style={{ background: 'none', border: `1px solid ${C.tape}`, color: C.cream,
              cursor: 'pointer', padding: '5px 7px', display: 'flex' }}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }}
            exit={{ height: 0 }} transition={{ duration: 0.22 }}
            style={{ position: 'fixed', top: 60, left: 0, right: 0, zIndex: 999,
              background: C.bg, borderBottom: `1px solid ${C.tape}`, overflow: 'hidden' }}>
            {links.map((l, i) => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: 12,
                  color: C.cream, textDecoration: 'none', fontSize: '0.95rem',
                  fontFamily: C.mono, fontWeight: 700, letterSpacing: '0.1em',
                  textTransform: 'uppercase', padding: '14px 20px',
                  borderBottom: `1px solid ${C.tape}44` }}>
                <span style={{ color: C.orange, fontSize: '0.72rem' }}>
                  {String(i + 1).padStart(2,'0')}.
                </span>
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
  const [playing, setPlaying] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -40]);

  return (
    <section id="hero" style={{
      minHeight: '100vh', background: C.bg, display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', padding: '88px 20px 64px', position: 'relative',
    }}>
      {/* Decorative tape reels */}
      <TapeReelDecor size={180} style={{ top: -40, left: -40 }} />
      <TapeReelDecor size={120} style={{ bottom: 60, right: -30, animationDelay: '-3s' }} />

      {/* Tape stripe running across bg */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: '62%', height: 6,
        background: C.tape, opacity: 0.3 }} />

      <motion.div style={{ y, width: '100%', maxWidth: 760, textAlign: 'center', position: 'relative', zIndex: 2 }}>

        {/* MIXTAPE label */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ display: 'inline-block', background: C.orange, color: '#FAF0E0',
            fontFamily: C.mono, fontSize: '0.7rem', letterSpacing: '0.3em',
            textTransform: 'uppercase', padding: '4px 16px', marginBottom: 20 }}>
          ▶ NOW PLAYING · PERSONAL MIXTAPE
        </motion.div>

        {/* Cassette illustration */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.7, ease: 'backOut' }}
          style={{ marginBottom: 28 }}
          onClick={() => setPlaying(p => !p)}
          role="button" aria-label="Toggle play"
          className="cm-flicker">
          <CassetteSVG
            width={Math.min(480, typeof window !== 'undefined' ? window.innerWidth - 48 : 480)}
            playing={playing}
            label={data.personal.name}
            subtitle={data.personal.title.slice(0, 28).toUpperCase()} />
        </motion.div>

        {/* Hint */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ color: C.muted, fontFamily: C.mono, fontSize: '0.7rem',
            letterSpacing: '0.15em', marginBottom: 16, textTransform: 'uppercase' }}>
          {playing ? '⏸ PAUSE' : '▶ CLICK CASSETTE TO PLAY'}
        </motion.p>

        {/* Name */}
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          style={{ fontFamily: C.serif, fontSize: 'clamp(2.5rem,8vw,5.5rem)',
            color: C.cream, fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.03em',
            lineHeight: 1 }}>
          {data.personal.name}
        </motion.h1>

        {/* Title */}
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          style={{ fontFamily: C.mono, fontSize: 'clamp(0.82rem,2vw,1rem)',
            color: C.orange, letterSpacing: '0.2em', textTransform: 'uppercase',
            marginBottom: 20 }}>
          {data.personal.title}
        </motion.p>

        {/* Tagline */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
          style={{ color: C.light, fontFamily: C.serif, fontSize: 'clamp(0.95rem,2vw,1.1rem)',
            fontStyle: 'italic', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.7 }}>
          "{data.personal.tagline}"
        </motion.p>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }} className="cm-stats">
          {[
            { n: `${data.stats.yearsExperience}+`, l: 'Years',    bg: C.orange },
            { n: `${data.stats.projectsCompleted}+`, l: 'Tracks', bg: C.burg   },
            { n: `${data.stats.happyClients}+`,     l: 'Fans',    bg: C.teal   },
          ].map(({ n, l, bg }) => (
            <div key={l} style={{ background: `${bg}22`, border: `1px solid ${bg}55`,
              padding: '12px 8px', textAlign: 'center' }}>
              <div style={{ fontFamily: C.serif, fontSize: 'clamp(1.4rem,4vw,1.9rem)',
                color: C.cream, lineHeight: 1 }}>{n}</div>
              <div style={{ fontFamily: C.mono, fontSize: '0.65rem', color: C.light,
                letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }} className="cm-ctas">
          <a href="#projects" className="cm-btn"
            style={{ background: C.orange, color: '#FAF0E0' }}>
            <Play size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
            Play My Work
          </a>
          <a href={data.personal.resumeUrl || '#contact'} className="cm-btn"
            style={{ background: 'transparent', color: C.cream,
              border: `1px solid ${C.light}66` }}>
            <Rewind size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
            Resume
          </a>
        </motion.div>

        {/* Transport controls */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
          {[
            { Icon: Github,   href: data.socials.github,           col: C.light },
            { Icon: Linkedin, href: data.socials.linkedin,          col: '#4A90C8' },
            { Icon: Twitter,  href: data.socials.twitter,           col: '#38A0C0' },
            { Icon: Mail,     href: `mailto:${data.socials.email}`, col: C.orange },
          ].map(({ Icon, href, col }) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer"
              style={{ width: 40, height: 40, display: 'flex', alignItems: 'center',
                justifyContent: 'center', border: `1px solid ${C.tape}`,
                color: col, transition: 'background 0.2s, transform 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = `${col}22`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <Icon size={17} />
            </a>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
        style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
          color: C.muted, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <span style={{ fontFamily: C.mono, fontSize: '0.6rem', letterSpacing: '0.2em' }}>SCROLL</span>
        <ChevronDown size={16} />
      </motion.div>
    </section>
  );
}

/* ── About ─────────────────────────────────────────────────────── */
function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about" ref={ref} className="cm-sec cm-paper">
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <SideLabel side="B" title="The Artist" dark={false} />

        <div className="cm-about-grid">
          {/* Avatar */}
          <motion.div initial={{ opacity: 0, x: -28 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }} className="cm-about-col">
            <div style={{ position: 'relative' }}>
              {/* Tape strip top decoration */}
              <div style={{ position: 'absolute', top: -8, left: -4, right: -4, height: 10,
                background: C.tape, opacity: 0.8 }} />
              <div style={{ width: 200, height: 200, overflow: 'hidden',
                border: `3px solid ${C.tape}` }}>
                <img src={data.personal.avatar} alt={data.personal.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover',
                    filter: 'sepia(0.15) contrast(1.05)' }} />
              </div>
              <div style={{ position: 'absolute', bottom: -8, left: -4, right: -4, height: 10,
                background: C.tape, opacity: 0.8 }} />
            </div>

            {/* Contact info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { Icon: MapPin, text: data.personal.location, color: C.sub  },
                { Icon: Mail,   text: data.socials.email,     color: C.teal, href: `mailto:${data.socials.email}` },
                { Icon: Github, text: 'GitHub',               color: C.sub,  href: data.socials.github },
              ].map(({ Icon, text, color, href }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon size={14} color={color} />
                  {href
                    ? <a href={href} target="_blank" rel="noopener noreferrer"
                        style={{ color: C.sub, fontSize: '0.84rem', fontFamily: C.mono, textDecoration: 'none' }}>{text}</a>
                    : <span style={{ color: C.sub, fontSize: '0.84rem', fontFamily: C.mono }}>{text}</span>
                  }
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div initial={{ opacity: 0, x: 28 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.12 }}>
            {/* Liner notes card */}
            <div style={{ background: '#FFF8EC', border: `1px solid ${C.light}`,
              padding: '24px 22px', marginBottom: 24, position: 'relative',
              boxShadow: '2px 2px 0 rgba(120,80,20,0.15)' }}>
              <div style={{ position: 'absolute', top: 8, right: 10,
                fontFamily: C.mono, fontSize: '0.6rem', color: C.muted,
                letterSpacing: '0.15em' }}>LINER NOTES</div>
              <p style={{ color: C.text, fontFamily: C.serif, fontSize: '1rem',
                lineHeight: 1.85, margin: 0 }}>{data.personal.bio}</p>
            </div>

            {/* Tape-style divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
              <div style={{ flex: 1, height: 2, background: `linear-gradient(90deg, ${C.orange}, ${C.tape})` }} />
              <Music size={14} color={C.orange} />
              <div style={{ flex: 1, height: 2, background: `linear-gradient(90deg, ${C.tape}, transparent)` }} />
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {[
                { n: `${data.stats.yearsExperience}+`,  l: 'Years Exp',  bg: C.orange },
                { n: `${data.stats.projectsCompleted}+`, l: 'Projects', bg: C.burg   },
                { n: `${data.stats.happyClients}+`,      l: 'Clients',  bg: C.teal   },
              ].map(({ n, l, bg }) => (
                <div key={l} style={{ textAlign: 'center', padding: '14px 8px',
                  border: `1px solid ${bg}44`, background: `${bg}12` }}>
                  <div style={{ fontFamily: C.serif, fontSize: '1.7rem', color: bg,
                    fontWeight: 700 }}>{n}</div>
                  <div style={{ fontFamily: C.mono, fontSize: '0.68rem', color: C.muted,
                    letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 3 }}>{l}</div>
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

  const catColors = {
    Frontend: C.orange, Backend: C.teal, DevOps: C.gold, Design: C.burg,
  };
  const catIcons = {
    Frontend: Code2, Backend: Server, DevOps: Layers, Design: Palette,
  };

  const byCategory = data.skills.reduce((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});

  return (
    <section id="skills" ref={ref} className="cm-sec"
      style={{ background: C.bgAlt }}>
      <TapeReelDecor size={140} style={{ top: -20, right: 20 }} />
      <TapeReelDecor size={90}  style={{ bottom: 20, left: 10, animationDelay: '-2s' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <SideLabel side="A" title="Signal Strength" />

        <div className="cm-skills-grid">
          {Object.entries(byCategory).map(([cat, skills], ci) => {
            const col = catColors[cat] || C.gold;
            const Icon = catIcons[cat] || Music;
            return (
              <motion.div key={cat}
                initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: ci * 0.1, duration: 0.5 }}
                style={{ background: '#20150A', border: `1px solid ${C.tape}`,
                  padding: '22px 20px' }}>

                {/* Category header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
                  paddingBottom: 12, borderBottom: `1px solid ${C.tape}` }}>
                  <Icon size={16} color={col} />
                  <span style={{ fontFamily: C.mono, fontSize: '0.78rem', color: col,
                    fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>{cat}</span>
                  <div style={{ marginLeft: 'auto' }}>
                    <EQBars color={col} count={3} />
                  </div>
                </div>

                {/* Skill bars */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {skills.map((sk, si) => (
                    <div key={sk.name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between',
                        marginBottom: 6 }}>
                        <span style={{ fontFamily: C.mono, fontSize: '0.82rem',
                          color: C.light }}>{sk.name}</span>
                        <span style={{ fontFamily: C.mono, fontSize: '0.72rem',
                          color: col, letterSpacing: '0.05em' }}>{sk.level}%</span>
                      </div>
                      {/* VU meter bar */}
                      <div style={{ height: 6, background: '#0A0804', border: `1px solid ${C.tape}`,
                        overflow: 'hidden', display: 'flex' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${sk.level}%` } : {}}
                          transition={{ delay: ci * 0.1 + si * 0.05 + 0.25, duration: 0.9, ease: 'easeOut' }}
                          style={{ height: '100%',
                            background: `linear-gradient(90deg, ${col}88, ${col})` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Skill tag cloud */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 40, justifyContent: 'center' }}>
          {data.skills.map(sk => {
            const col = catColors[sk.category] || C.gold;
            return (
              <span key={sk.name} style={{ padding: '4px 14px', fontFamily: C.mono,
                fontSize: '0.76rem', color: col, border: `1px solid ${col}44`,
                background: `${col}12`, letterSpacing: '0.06em' }}>
                {sk.name}
              </span>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ── Projects — Track List ─────────────────────────────────────── */
function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [activeTrack, setActiveTrack] = useState(null);

  return (
    <section id="projects" ref={ref} className="cm-sec cm-paper">
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <SideLabel side="A" title="The Tracklist" dark={false} />

        {/* Cassette label header */}
        <div style={{ background: C.orange, padding: '10px 20px', marginBottom: 4,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: C.mono, fontSize: '0.7rem', color: '#FAF0E0',
            letterSpacing: '0.2em' }}>TRACK / TITLE</span>
          <span style={{ fontFamily: C.mono, fontSize: '0.7rem', color: '#FAF0E0',
            letterSpacing: '0.2em' }}>TIME</span>
        </div>
        <div style={{ height: 2, background: C.tape, marginBottom: 4 }} />

        {/* Tracks */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {data.projects.map((proj, i) => {
            const isActive = activeTrack === i;
            return (
              <motion.div key={proj.title}
                initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.07, duration: 0.45 }}>

                {/* Track row — clickable to expand */}
                <button
                  onClick={() => setActiveTrack(isActive ? null : i)}
                  style={{ width: '100%', background: isActive ? '#FFF4E0' : (i % 2 === 0 ? '#FFF8EC' : '#FFF3E8'),
                    border: 'none', borderBottom: `1px solid ${C.light}44`,
                    padding: '14px 20px', cursor: 'pointer', textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: 16,
                    transition: 'background 0.2s' }}>

                  {/* Play / track number */}
                  <div style={{ width: 28, textAlign: 'center', flexShrink: 0 }}>
                    {isActive
                      ? <Pause size={16} color={C.orange} />
                      : <span style={{ fontFamily: C.mono, fontSize: '0.78rem', color: C.muted }}>
                          {String(i + 1).padStart(2,'0')}
                        </span>
                    }
                  </div>

                  {/* Title */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: C.serif, fontSize: '1rem', color: C.text,
                      fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden',
                      textOverflow: 'ellipsis' }}>{proj.title}</div>
                    <div style={{ fontFamily: C.mono, fontSize: '0.72rem', color: C.muted,
                      marginTop: 2 }}>{proj.techStack.slice(0, 3).join(' · ')}</div>
                  </div>

                  {/* EQ + duration */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    {isActive && <EQBars color={C.orange} count={4} />}
                    <span style={{ fontFamily: C.mono, fontSize: '0.8rem', color: C.muted }}>
                      {DURATIONS[i % DURATIONS.length]}
                    </span>
                  </div>
                </button>

                {/* Expanded track detail */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                      style={{ overflow: 'hidden', background: '#FFFBF2',
                        borderBottom: `2px solid ${C.orange}44` }}>
                      <div style={{ padding: '20px 20px 20px 64px', display: 'flex',
                        flexDirection: 'column', gap: 14 }}>
                        {proj.image && (
                          <div style={{ height: 180, overflow: 'hidden', maxWidth: 420 }}>
                            <img src={proj.image} alt={proj.title}
                              style={{ width: '100%', height: '100%', objectFit: 'cover',
                                filter: 'sepia(0.1)' }} />
                          </div>
                        )}
                        <p style={{ color: C.sub, fontFamily: C.serif, fontSize: '0.95rem',
                          lineHeight: 1.75, margin: 0 }}>{proj.description}</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {proj.techStack.map(t => (
                            <span key={t} style={{ padding: '3px 10px', fontFamily: C.mono,
                              fontSize: '0.74rem', color: C.teal, border: `1px solid ${C.teal}44`,
                              background: `${C.teal}10` }}>{t}</span>
                          ))}
                        </div>
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                          <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer"
                            className="cm-btn" style={{ background: C.orange, color: '#FAF0E0',
                              padding: '9px 20px', fontSize: '0.8rem' }}>
                            <Play size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                            Live Demo
                          </a>
                          <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer"
                            className="cm-btn" style={{ background: 'transparent', color: C.sub,
                              border: `1px solid ${C.light}66`, padding: '9px 20px', fontSize: '0.8rem',
                              display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Github size={13} /> Code
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Total time */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 20px 0',
          gap: 12, alignItems: 'center' }}>
          <FastForward size={14} color={C.muted} />
          <span style={{ fontFamily: C.mono, fontSize: '0.72rem', color: C.muted,
            letterSpacing: '0.1em' }}>
            {data.projects.length} TRACKS · TOTAL: {data.projects.length * 4}:{String(data.projects.length * 7 % 60).padStart(2,'0')}
          </span>
        </div>
      </div>
    </section>
  );
}

/* ── Experience ────────────────────────────────────────────────── */
function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const colors = [C.orange, C.teal, C.gold, C.burg];

  return (
    <section id="experience" ref={ref} className="cm-sec"
      style={{ background: C.bg }}>
      <TapeReelDecor size={160} style={{ top: -30, left: -30, animationDelay: '-1s' }} />

      <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <SideLabel side="B" title="The Backstory" />

        <div style={{ position: 'relative', paddingLeft: 12 }}>
          {/* Tape timeline line */}
          <div style={{ position: 'absolute', left: 12, top: 0, bottom: 0, width: 3,
            background: `repeating-linear-gradient(to bottom, ${C.orange} 0, ${C.orange} 8px, transparent 8px, transparent 16px)` }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {data.experience.map((exp, i) => (
              <motion.div key={exp.company}
                initial={{ opacity: 0, x: -24 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                style={{ display: 'flex', gap: 24 }}>

                {/* Track dot */}
                <div style={{ flexShrink: 0, width: 28, display: 'flex', justifyContent: 'center' }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%',
                    background: colors[i % 4], border: `2px solid ${C.bg}`,
                    boxShadow: `0 0 0 2px ${colors[i % 4]}`, marginTop: 6 }} />
                </div>

                {/* Card */}
                <div style={{ flex: 1, background: '#20150A', border: `1px solid ${C.tape}`,
                  borderLeft: `3px solid ${colors[i % 4]}`, padding: '18px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                    <div>
                      <h3 style={{ fontFamily: C.serif, fontSize: '1rem', color: C.cream,
                        margin: '0 0 3px', fontWeight: 700 }}>{exp.role}</h3>
                      <span style={{ fontFamily: C.mono, fontSize: '0.82rem',
                        color: colors[i % 4], letterSpacing: '0.08em' }}>{exp.company}</span>
                    </div>
                    <span style={{ fontFamily: C.mono, fontSize: '0.72rem', color: C.muted,
                      background: `${colors[i % 4]}18`, padding: '3px 10px',
                      border: `1px solid ${colors[i % 4]}44`, whiteSpace: 'nowrap' }}>
                      {exp.period}
                    </span>
                  </div>
                  <p style={{ color: C.light, fontFamily: C.serif, fontSize: '0.9rem',
                    lineHeight: 1.75, margin: 0 }}>{exp.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Testimonials — Liner Notes ────────────────────────────────── */
function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="testimonials" ref={ref} className="cm-sec cm-paper">
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SideLabel side="B" title="Fan Mail" dark={false} />

        <div className="cm-testi-grid">
          {data.testimonials.map((t, i) => {
            const col = [C.orange, C.teal, C.gold, C.burg][i % 4];
            return (
              <motion.div key={t.name}
                initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                style={{ background: '#FFF8EC', border: `1px solid ${C.light}66`,
                  padding: '24px 22px', position: 'relative',
                  boxShadow: '2px 3px 0 rgba(120,80,20,0.12)' }}>

                {/* Tape strip at top */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5,
                  background: col, opacity: 0.7 }} />

                {/* Stars */}
                <div style={{ display: 'flex', gap: 3, marginBottom: 14, marginTop: 8 }}>
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star key={si} size={13} fill={C.gold} color={C.gold} />
                  ))}
                </div>

                {/* Large quote mark */}
                <div style={{ position: 'absolute', top: 16, right: 16,
                  fontFamily: C.serif, fontSize: '4rem', color: col,
                  opacity: 0.12, lineHeight: 1 }}>"</div>

                <p style={{ color: C.sub, fontFamily: C.serif, fontSize: '0.9rem',
                  lineHeight: 1.8, marginBottom: 20, fontStyle: 'italic' }}>
                  "{t.text}"
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, flexShrink: 0, overflow: 'hidden',
                    border: `2px solid ${col}66`, filter: 'sepia(0.2)' }}>
                    <img src={t.avatar} alt={t.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: C.mono, fontSize: '0.84rem', color: C.text,
                      fontWeight: 700, letterSpacing: '0.05em' }}>{t.name}</div>
                    <div style={{ fontFamily: C.mono, fontSize: '0.72rem', color: C.muted,
                      marginTop: 2 }}>{t.role}</div>
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
    <section id="contact" ref={ref} className="cm-sec"
      style={{ background: C.bgAlt }}>
      <TapeReelDecor size={130} style={{ bottom: -20, right: -10, animationDelay: '-4s' }} />

      <div style={{ maxWidth: 680, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <SideLabel side="A" title="Drop a Note" />

        <motion.div initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}>
          <div style={{ background: '#20150A', border: `1px solid ${C.tape}`, padding: '32px 28px',
            position: 'relative' }}>
            {/* Tape strip top */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4,
              background: C.orange }} />

            <AnimatePresence mode="wait">
              {status === 'done' ? (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  style={{ textAlign: 'center', padding: '40px 0' }}>
                  <CheckCircle size={52} color={C.teal} style={{ margin: '0 auto 16px', display: 'block' }} />
                  <h3 style={{ fontFamily: C.serif, fontSize: '1.8rem', color: C.cream,
                    marginBottom: 8, fontWeight: 700 }}>Message Recorded!</h3>
                  <p style={{ color: C.light, fontFamily: C.mono, fontSize: '0.84rem' }}>
                    I'll play it back soon. ▶
                  </p>
                  <button onClick={() => { setStatus('idle'); setForm({ name:'',email:'',message:'' }); }}
                    className="cm-btn" style={{ background: C.orange, color: '#FAF0E0',
                      marginTop: 24 }}>
                    Record Another ◉
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="cm-contact-row">
                    <div>
                      <label style={{ display: 'block', fontFamily: C.mono, fontSize: '0.68rem',
                        color: C.muted, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>
                        Your Name
                      </label>
                      <input className="cm-input" placeholder="— enter name —" required
                        style={{ color: C.cream }}
                        value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: C.mono, fontSize: '0.68rem',
                        color: C.muted, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>
                        Email
                      </label>
                      <input type="email" className="cm-input" placeholder="— enter email —" required
                        style={{ color: C.cream }}
                        value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                    </div>
                  </div>
                  <div style={{ marginBottom: 28 }}>
                    <label style={{ display: 'block', fontFamily: C.mono, fontSize: '0.68rem',
                      color: C.muted, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>
                      Message
                    </label>
                    <textarea className="cm-input" placeholder="— what's on your mind? —" required
                      rows={5} style={{ resize: 'vertical', color: C.cream }}
                      value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
                  </div>

                  {/* Transport bar */}
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20 }}>
                    <Rewind size={14} color={C.muted} />
                    <div style={{ flex: 1, height: 3, background: C.tape }}>
                      <motion.div style={{ height: '100%', background: C.orange, width: '35%' }} />
                    </div>
                    <FastForward size={14} color={C.muted} />
                    <span style={{ fontFamily: C.mono, fontSize: '0.68rem', color: C.muted }}>1:23</span>
                  </div>

                  <button type="submit" disabled={status === 'sending'}
                    className="cm-btn" style={{ width: '100%', background: C.orange,
                      color: '#FAF0E0', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: 10, fontFamily: C.mono, fontSize: '0.9rem' }}>
                    {status === 'sending' ? (
                      <><motion.span animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>◉</motion.span> Recording…</>
                    ) : <><Send size={16} /> Send Message ▶</>}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Social links */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 28, flexWrap: 'wrap' }}>
            {[
              { Icon: Mail,     href: `mailto:${data.socials.email}`, label: 'Email',    col: C.orange },
              { Icon: Github,   href: data.socials.github,             label: 'GitHub',   col: C.light  },
              { Icon: Linkedin, href: data.socials.linkedin,           label: 'LinkedIn', col: '#4A90C8' },
              { Icon: Twitter,  href: data.socials.twitter,            label: 'Twitter',  col: C.teal   },
            ].map(({ Icon, href, label, col }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 7,
                  color: col, textDecoration: 'none', fontFamily: C.mono,
                  fontSize: '0.8rem', letterSpacing: '0.05em',
                  transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.65'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                <Icon size={15} /> {label}
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
    <footer style={{ background: '#100A04', borderTop: `2px solid ${C.tape}`,
      padding: '32px 24px 24px', fontFamily: C.mono, position: 'relative', overflow: 'hidden' }}>
      <TapeReelDecor size={100} style={{ top: -10, right: 20, animationDelay: '-6s' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        {/* Tape strip */}
        <div style={{ height: 4, background: `linear-gradient(90deg,
          ${C.burg}, ${C.orange}, ${C.gold}, ${C.teal}, ${C.orange}, ${C.burg})`,
          marginBottom: 20 }} />

        <Music size={22} color={C.orange} style={{ marginBottom: 10 }} />
        <div style={{ fontFamily: C.serif, fontSize: 'clamp(1.1rem,3vw,1.7rem)',
          color: C.cream, fontWeight: 700, marginBottom: 6 }}>
          {data.personal.name}
        </div>
        <p style={{ color: C.muted, fontSize: '0.76rem', marginBottom: 14,
          letterSpacing: '0.08em' }}>{data.personal.tagline}</p>
        <p style={{ color: '#4A3020', fontSize: '0.7rem', letterSpacing: '0.1em' }}>
          ◉ {new Date().getFullYear()} · RECORDED & MIXED BY {data.personal.name.toUpperCase()} ◉
        </p>
      </div>
    </footer>
  );
}

/* ── Root ──────────────────────────────────────────────────────── */
export default function CassetteMixtape() {
  return (
    <>
      <GlobalStyles />
      <div style={{ background: C.bg, color: C.cream, minHeight: '100vh' }}>
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
