import { usePortfolio } from "../../../../context/PortfolioContext";
import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Github, Linkedin, Twitter, Mail, MapPin, ExternalLink,
  Star, Menu, X, Send, CheckCircle, ChevronDown, Search,
  Code2, Server, Layers, Palette, Trophy, Gift, Eye, EyeOff,
} from 'lucide-react';

/* ── Design tokens ─────────────────────────────────────────────── */
const C = {
  bg:      '#0F1A0F',   // deep forest green
  bgAlt:   '#162416',   // slightly lighter dark green
  card:    '#1A2E1A',   // card background
  paper:   '#FFF8E7',   // warm cream
  cream:   '#FFFDF0',   // light cream
  text:    '#1A2E1A',   // dark text on cream
  sub:     '#3D6B3D',   // medium green
  muted:   '#6B8F6B',   // muted green
  light:   '#A8C8A8',   // light green on dark
  gold:    '#E8B84B',   // easter gold / yellow
  pink:    '#E86B8A',   // easter pink
  blue:    '#4B9BE8',   // easter blue
  purple:  '#9B6BE8',   // easter purple
  orange:  '#E8824B',   // easter orange
  green:   '#4BE882',   // bright easter green
  mono:    "'Courier New', monospace",
  serif:   "'Georgia', serif",
  sans:    "'Helvetica Neue', Arial, sans-serif",
};

/* ── Easter egg positions and clues ───────────────────────────── */
const EGGS = [
  { id: 'egg1', emoji: '🥚', color: C.gold,   section: 'hero',        clue: 'Find the golden egg hidden in the hero section!' },
  { id: 'egg2', emoji: '🐣', color: C.pink,   section: 'about',       clue: 'A hatching egg awaits in the About section...' },
  { id: 'egg3', emoji: '🐰', color: C.blue,   section: 'skills',      clue: 'The Easter Bunny hopped into the Skills section!' },
  { id: 'egg4', emoji: '🌸', color: C.purple, section: 'projects',    clue: 'Spring blossoms are hiding in the Projects section!' },
  { id: 'egg5', emoji: '🍬', color: C.orange, section: 'experience',  clue: 'Sweet candy is tucked away in Experience!' },
  { id: 'egg6', emoji: '🎁', color: C.green,  section: 'contact',     clue: 'A surprise gift is waiting in the Contact section!' },
];

/* ── Global CSS ────────────────────────────────────────────────── */
function GlobalStyles() {
  const { portfolioData: data } = usePortfolio();

  return (
    <style>{`
      @keyframes eh-float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        33%       { transform: translateY(-12px) rotate(5deg); }
        66%       { transform: translateY(-6px) rotate(-3deg); }
      }
      @keyframes eh-wiggle {
        0%, 100% { transform: rotate(0deg); }
        25%       { transform: rotate(-10deg); }
        75%       { transform: rotate(10deg); }
      }
      @keyframes eh-sparkle {
        0%, 100% { opacity: 0; transform: scale(0); }
        50%       { opacity: 1; transform: scale(1); }
      }
      @keyframes eh-bounce {
        0%, 100% { transform: translateY(0); }
        50%       { transform: translateY(-8px); }
      }
      @keyframes eh-spin {
        to { transform: rotate(360deg); }
      }
      @keyframes eh-pulse-glow {
        0%, 100% { box-shadow: 0 0 8px 2px currentColor; opacity: 0.7; }
        50%       { box-shadow: 0 0 20px 6px currentColor; opacity: 1; }
      }
      @keyframes eh-grass {
        0%, 100% { transform: rotate(-3deg); }
        50%       { transform: rotate(3deg); }
      }

      .eh-float    { animation: eh-float   3s ease-in-out infinite; }
      .eh-wiggle   { animation: eh-wiggle  0.5s ease-in-out infinite; }
      .eh-bounce   { animation: eh-bounce  1.2s ease-in-out infinite; }
      .eh-spin     { animation: eh-spin    8s linear infinite; }
      .eh-grass    { animation: eh-grass   2s ease-in-out infinite; }

      .eh-egg-hidden {
        cursor: pointer;
        opacity: 0.15;
        filter: blur(1px);
        transition: opacity 0.3s, filter 0.3s, transform 0.2s;
        font-size: 1.6rem;
        display: inline-block;
        color: currentColor;
      }
      .eh-egg-hidden:hover {
        opacity: 0.6;
        filter: blur(0px);
        transform: scale(1.2);
      }
      .eh-egg-found {
        font-size: 1.6rem;
        display: inline-block;
        animation: eh-float 2s ease-in-out infinite;
      }

      .eh-sec { padding: 72px 20px; position: relative; overflow: hidden; }
      @media (min-width: 640px)  { .eh-sec { padding: 88px 32px; } }
      @media (min-width: 1024px) { .eh-sec { padding: 104px 64px; } }

      .eh-btn {
        padding: 12px 28px; border-radius: 24px;
        font-family: ${C.mono}; font-size: 0.88rem;
        font-weight: 700; letter-spacing: 0.06em;
        cursor: pointer; border: none;
        transition: transform 0.15s, filter 0.2s;
        text-decoration: none; display: inline-block;
      }
      .eh-btn:hover  { filter: brightness(1.15); transform: translateY(-2px) scale(1.02); }
      .eh-btn:active { transform: translateY(1px) scale(0.98); }

      .eh-card {
        background: ${C.card};
        border: 1px solid #2A4A2A;
        border-radius: 16px;
        padding: 24px;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .eh-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 32px rgba(0,0,0,0.3);
      }

      .eh-input {
        width: 100%; padding: 12px 16px;
        border: 2px solid #2A4A2A; border-radius: 12px;
        background: #0F1A0F; font-family: ${C.mono};
        font-size: 0.9rem; color: ${C.light}; box-sizing: border-box;
        transition: border-color 0.2s;
      }
      .eh-input:focus { outline: none; border-color: ${C.gold}; }
      .eh-input::placeholder { color: ${C.muted}; }

      .eh-progress-bar {
        height: 8px; border-radius: 4px;
        background: #1A2E1A; overflow: hidden;
      }

      @media (prefers-reduced-motion: reduce) {
        .eh-float, .eh-wiggle, .eh-bounce, .eh-spin, .eh-grass,
        .eh-egg-hidden, .eh-egg-found { animation: none !important; }
      }
    `}</style>
  );
}

/* ── Floating decoration eggs ──────────────────────────────────── */
function FloatingEgg({ emoji, style }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="eh-float" style={{
      position: 'absolute', fontSize: '2rem', pointerEvents: 'none',
      opacity: 0.12, userSelect: 'none', ...style,
    }}>
      {emoji}
    </div>
  );
}

/* ── Egg counter HUD ───────────────────────────────────────────── */
function EggCounter({ found, total, onClick }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <motion.div
      initial={{ x: 80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1 }}
      onClick={onClick}
      style={{
        position: 'fixed', right: 20, top: '50%', transform: 'translateY(-50%)',
        zIndex: 1000, background: C.bgAlt,
        border: `2px solid ${C.gold}66`, borderRadius: 20,
        padding: '16px 14px', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        boxShadow: `0 0 20px ${C.gold}22`,
      }}>
      <div style={{ fontFamily: C.mono, fontSize: '0.65rem', color: C.gold,
        letterSpacing: '0.1em', textTransform: 'uppercase', writingMode: 'vertical-rl',
        textOrientation: 'mixed', transform: 'rotate(180deg)' }}>
        EGG HUNT
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {EGGS.map(egg => (
          <div key={egg.id} style={{
            fontSize: '1.3rem', opacity: found.includes(egg.id) ? 1 : 0.2,
            filter: found.includes(egg.id) ? 'none' : 'grayscale(1)',
            transition: 'all 0.4s',
            transform: found.includes(egg.id) ? 'scale(1.1)' : 'scale(1)',
          }}>
            {egg.emoji}
          </div>
        ))}
      </div>
      <div style={{ fontFamily: C.mono, fontSize: '0.8rem', color: C.gold,
        fontWeight: 700 }}>{found.length}/{total}</div>
    </motion.div>
  );
}

/* ── Victory modal ─────────────────────────────────────────────── */
function VictoryModal({ onClose }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(0,0,0,0.85)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
      onClick={onClose}>
      <motion.div
        initial={{ scale: 0.5, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: C.bgAlt, border: `3px solid ${C.gold}`,
          borderRadius: 28, padding: '48px 40px', textAlign: 'center',
          maxWidth: 480, width: '100%',
          boxShadow: `0 0 60px ${C.gold}44`,
        }}>
        <div style={{ fontSize: '4rem', marginBottom: 16 }}>🏆</div>
        <h2 style={{ fontFamily: C.serif, fontSize: '2rem', color: C.gold,
          marginBottom: 12, fontWeight: 700 }}>
          You Found All the Eggs!
        </h2>
        <p style={{ color: C.light, fontFamily: C.mono, fontSize: '0.9rem',
          lineHeight: 1.7, marginBottom: 28 }}>
          Congratulations! You've discovered every hidden Easter egg in {data.personal.name}'s portfolio.
          You're clearly someone who pays attention to detail — a great quality! 🌸
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap',
          marginBottom: 24 }}>
          {EGGS.map(e => (
            <span key={e.id} className="eh-bounce" style={{ fontSize: '2rem',
              animationDelay: `${EGGS.indexOf(e) * 0.15}s` }}>{e.emoji}</span>
          ))}
        </div>
        <button type="button" onClick={onClose} className="eh-btn"
          style={{ background: C.gold, color: C.bg }}>
          🎉 Thanks for Playing!
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ── Clue toast ────────────────────────────────────────────────── */
function ClueToast({ clue, egg, onClose }) {
  const { portfolioData: data } = usePortfolio();

  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [clue, onClose]);

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      style={{
        position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
        zIndex: 1500, background: C.bgAlt,
        border: `2px solid ${egg.color}`, borderRadius: 16,
        padding: '16px 24px', maxWidth: 400, width: 'calc(100% - 48px)',
        display: 'flex', alignItems: 'center', gap: 14,
        boxShadow: `0 8px 32px rgba(0,0,0,0.5)`,
      }}>
      <span style={{ fontSize: '2rem' }}>{egg.emoji}</span>
      <div>
        <div style={{ fontFamily: C.mono, fontSize: '0.72rem', color: egg.color,
          letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>
          🥚 EGG FOUND!
        </div>
        <div style={{ color: C.light, fontFamily: C.sans, fontSize: '0.88rem', lineHeight: 1.5 }}>
          {clue}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Hidden egg component ──────────────────────────────────────── */
function HiddenEgg({ eggId, foundEggs, onFind }) {
  const { portfolioData: data } = usePortfolio();

  const egg = EGGS.find(e => e.id === eggId);
  const isFound = foundEggs.includes(eggId);

  return (
    <span
      className={isFound ? 'eh-egg-found' : 'eh-egg-hidden'}
      style={{ color: egg.color }}
      onClick={() => !isFound && onFind(eggId)}
      title={isFound ? `Found: ${egg.emoji}` : '?'}
      role="button"
      aria-label={isFound ? `Found egg: ${egg.emoji}` : 'Hidden egg - click to find!'}>
      {egg.emoji}
    </span>
  );
}

/* ── Section label ─────────────────────────────────────────────── */
function SectionLabel({ title, color = C.gold, dark = true }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: color,
          boxShadow: `0 0 12px ${color}` }} />
        <h2 style={{
          fontFamily: C.serif, fontSize: 'clamp(2rem, 5vw, 3.2rem)',
          color: dark ? C.cream : C.text, margin: 0, fontWeight: 700,
          letterSpacing: '-0.02em',
        }}>{title}</h2>
      </div>
      <div style={{ height: 3, maxWidth: 200,
        background: `linear-gradient(90deg, ${color}, transparent)`,
        borderRadius: 2 }} />
    </div>
  );
}

/* ── Nav ───────────────────────────────────────────────────────── */
function Nav({ foundCount }) {
  const { portfolioData: data } = usePortfolio();

  const [open, setOpen] = useState(false);
  const links = ['About', 'Skills', 'Projects', 'Experience', 'Contact'];

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
        background: 'rgba(15,26,15,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #2A4A2A',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '1.4rem' }}>🥚</span>
            <span style={{ color: C.cream, fontFamily: C.mono, fontSize: '0.9rem',
              fontWeight: 700, letterSpacing: '0.15em' }}>
              {data.personal.name.split(' ')[0].toUpperCase()}
            </span>
            {foundCount > 0 && (
              <span style={{ background: `${C.gold}22`, border: `1px solid ${C.gold}55`,
                color: C.gold, fontFamily: C.mono, fontSize: '0.68rem',
                padding: '2px 10px', borderRadius: 12, letterSpacing: '0.1em' }}>
                {foundCount} eggs 🐣
              </span>
            )}
          </div>

          <div style={{ display: 'none', gap: 4 }} className="nav-desktop">
            {links.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{
                color: C.light, textDecoration: 'none', fontSize: '0.8rem',
                fontFamily: C.mono, fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', padding: '6px 14px',
                transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.color = C.cream}
                onMouseLeave={e => e.currentTarget.style.color = C.light}>
                {l}
              </a>
            ))}
          </div>

          <a href="#contact" className="eh-btn" style={{
            background: C.gold, color: C.bg, fontSize: '0.78rem',
            padding: '8px 20px', display: 'none',
          }}>
            Hire Me 🌸
          </a>

          <button type="button" onClick={() => setOpen(o => !o)} style={{
            background: 'none', border: '1px solid #2A4A2A',
            color: C.cream, cursor: 'pointer', padding: '6px 8px',
            display: 'flex', borderRadius: 8,
          }}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }}
            exit={{ height: 0 }} transition={{ duration: 0.22 }}
            style={{ position: 'fixed', top: 64, left: 0, right: 0, zIndex: 899,
              background: C.bg, borderBottom: '1px solid #2A4A2A', overflow: 'hidden' }}>
            {links.map((l, i) => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: 14,
                  color: C.cream, textDecoration: 'none', fontFamily: C.mono,
                  fontWeight: 700, fontSize: '0.95rem', padding: '16px 24px',
                  borderBottom: '1px solid #1A2E1A44', letterSpacing: '0.08em',
                  textTransform: 'uppercase' }}>
                <span style={{ color: C.gold, fontSize: '0.72rem' }}>
                  {['🥚','🐣','🐰','🌸','🍬'][i]}
                </span>
                {l}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 768px) {
          .nav-desktop { display: flex !important; }
          .nav-hire { display: inline-block !important; }
        }
      `}</style>
    </>
  );
}

/* ── Hero ──────────────────────────────────────────────────────── */
function Hero({ foundEggs, onFind }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <section id="hero" style={{
      minHeight: '100vh', background: C.bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '100px 20px 60px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative floating eggs */}
      <FloatingEgg emoji="🌸" style={{ top: '10%', left: '5%', animationDelay: '0s' }} />
      <FloatingEgg emoji="🌿" style={{ top: '20%', right: '8%', animationDelay: '-1s' }} />
      <FloatingEgg emoji="🦋" style={{ bottom: '25%', left: '10%', animationDelay: '-2s' }} />
      <FloatingEgg emoji="🌼" style={{ bottom: '15%', right: '6%', animationDelay: '-0.5s' }} />
      <FloatingEgg emoji="🐝" style={{ top: '40%', left: '3%', animationDelay: '-1.5s' }} />
      <FloatingEgg emoji="🍀" style={{ top: '60%', right: '4%', animationDelay: '-0.8s' }} />

      <div style={{ maxWidth: 760, textAlign: 'center', position: 'relative', zIndex: 2 }}>

        {/* Hunt badge */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
            background: `${C.gold}18`, border: `1px solid ${C.gold}44`,
            color: C.gold, borderRadius: 24, padding: '6px 20px',
            fontFamily: C.mono, fontSize: '0.72rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', marginBottom: 24 }}>
          <Search size={13} />
          Easter Egg Hunt · {EGGS.length} Eggs Hidden
        </motion.div>

        {/* Big egg emoji with hidden egg inside */}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
          style={{ fontSize: '5rem', marginBottom: 16, position: 'relative',
            display: 'inline-block' }}>
          🥚
          <span style={{ position: 'absolute', top: -8, right: -16 }}>
            <HiddenEgg eggId="egg1" foundEggs={foundEggs} onFind={onFind} />
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ fontFamily: C.serif, fontSize: 'clamp(2.8rem, 8vw, 5.5rem)',
            color: C.cream, fontWeight: 700, margin: '0 0 12px',
            letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          {data.personal.name}
        </motion.h1>

        {/* Title */}
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ fontFamily: C.mono, fontSize: 'clamp(0.85rem, 2vw, 1rem)',
            color: C.gold, letterSpacing: '0.2em', textTransform: 'uppercase',
            marginBottom: 20 }}>
          {data.personal.title}
        </motion.p>

        {/* Tagline */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ color: C.light, fontFamily: C.serif, fontSize: 'clamp(1rem, 2vw, 1.15rem)',
            fontStyle: 'italic', maxWidth: 500, margin: '0 auto 28px', lineHeight: 1.8 }}>
          "{data.personal.tagline}"
        </motion.p>

        {/* Hint text */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
            background: `${C.pink}15`, border: `1px dashed ${C.pink}44`,
            borderRadius: 12, padding: '10px 20px', marginBottom: 32,
            fontFamily: C.mono, fontSize: '0.78rem', color: C.pink }}>
          👀 Psst... {EGGS.length} Easter eggs are hidden on this page. Can you find them all?
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12, maxWidth: 420, margin: '0 auto 32px' }}>
          {[
            { n: `${data.stats.yearsExperience}+`, l: 'Years',    color: C.gold   },
            { n: `${data.stats.projectsCompleted}+`, l: 'Projects', color: C.pink },
            { n: `${data.stats.happyClients}+`,     l: 'Clients',  color: C.blue  },
          ].map(({ n, l, color }) => (
            <div key={l} style={{ background: `${color}12`, border: `1px solid ${color}33`,
              borderRadius: 14, padding: '14px 8px', textAlign: 'center' }}>
              <div style={{ fontFamily: C.serif, fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                color: C.cream, lineHeight: 1 }}>{n}</div>
              <div style={{ fontFamily: C.mono, fontSize: '0.65rem', color: color,
                letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap',
            marginBottom: 28 }}>
          <a href="#projects" className="eh-btn"
            style={{ background: C.gold, color: C.bg }}>
            🌸 View My Work
          </a>
          <a href={data.personal.resumeUrl || '#contact'} className="eh-btn"
            style={{ background: 'transparent', color: C.cream,
              border: '1px solid #2A4A2A' }}>
            📄 Resume
          </a>
        </motion.div>

        {/* Socials */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
          style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { Icon: Github,   href: data.socials.github,            color: C.light },
            { Icon: Linkedin, href: data.socials.linkedin,          color: C.blue  },
            { Icon: Twitter,  href: data.socials.twitter,           color: C.blue  },
            { Icon: Mail,     href: `mailto:${data.socials.email}`, color: C.gold  },
          ].map(({ Icon, href, color }) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer"
              style={{ width: 44, height: 44, display: 'flex', alignItems: 'center',
                justifyContent: 'center', border: `1px solid #2A4A2A`, borderRadius: 12,
                color, transition: 'background 0.2s, transform 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = `${color}18`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <Icon size={18} />
            </a>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
        style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          color: C.muted, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <span style={{ fontFamily: C.mono, fontSize: '0.6rem', letterSpacing: '0.2em' }}>SCROLL</span>
        <ChevronDown size={16} />
      </motion.div>
    </section>
  );
}

/* ── About ─────────────────────────────────────────────────────── */
function About({ foundEggs, onFind }) {
  const { portfolioData: data } = usePortfolio();

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about" ref={ref} className="eh-sec"
      style={{ background: C.paper, position: 'relative' }}>

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <SectionLabel title="About Me" color={C.pink} dark={false} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 40 }}>
          <motion.div initial={{ opacity: 0, x: -32 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>

            {/* Avatar */}
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div style={{ width: 200, height: 200, borderRadius: '50%', overflow: 'hidden',
                border: `4px solid ${C.pink}`, boxShadow: `0 0 0 8px ${C.pink}22` }}>
                <img src={data.personal.avatar} alt={data.personal.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              {/* Hidden egg on avatar */}
              <span style={{ position: 'absolute', top: 0, right: -8 }}>
                <HiddenEgg eggId="egg2" foundEggs={foundEggs} onFind={onFind} />
              </span>
              {/* Grass decoration */}
              <div className="eh-grass" style={{ position: 'absolute', bottom: -8, left: '50%',
                transform: 'translateX(-50%)', fontSize: '1.5rem', opacity: 0.6 }}>🌿</div>
            </div>

            {/* Contact chips */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 280 }}>
              {[
                { Icon: MapPin, text: data.personal.location, color: C.sub },
                { Icon: Mail,   text: data.socials.email,     color: C.pink,  href: `mailto:${data.socials.email}` },
                { Icon: Github, text: 'GitHub Profile',       color: C.text,  href: data.socials.github },
              ].map(({ Icon, text, color, href }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10,
                  background: `${color}12`, border: `1px solid ${color}33`,
                  borderRadius: 10, padding: '8px 14px' }}>
                  <Icon size={14} color={color} />
                  {href
                    ? <a href={href} target="_blank" rel="noopener noreferrer"
                        style={{ color, fontSize: '0.84rem', fontFamily: C.mono, textDecoration: 'none' }}>{text}</a>
                    : <span style={{ color, fontSize: '0.84rem', fontFamily: C.mono }}>{text}</span>
                  }
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div initial={{ opacity: 0, x: 32 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.12 }}>
            <div style={{ background: C.cream, border: `1px solid ${C.pink}33`,
              borderRadius: 20, padding: '28px 24px', marginBottom: 24,
              boxShadow: `0 4px 24px ${C.pink}12` }}>
              <p style={{ color: C.text, fontFamily: C.serif, fontSize: '1.05rem',
                lineHeight: 1.9, margin: 0 }}>{data.personal.bio}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {[
                { n: `${data.stats.yearsExperience}+`,  l: 'Years',    color: C.gold   },
                { n: `${data.stats.projectsCompleted}+`, l: 'Projects', color: C.pink  },
                { n: `${data.stats.happyClients}+`,      l: 'Clients',  color: C.blue  },
              ].map(({ n, l, color }) => (
                <div key={l} style={{ textAlign: 'center', padding: '16px 8px',
                  border: `2px solid ${color}33`, borderRadius: 14,
                  background: `${color}08` }}>
                  <div style={{ fontFamily: C.serif, fontSize: '1.8rem', color, fontWeight: 700 }}>{n}</div>
                  <div style={{ fontFamily: C.mono, fontSize: '0.68rem', color: C.muted,
                    letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          #about .about-grid { grid-template-columns: auto 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ── Skills ────────────────────────────────────────────────────── */
function Skills({ foundEggs, onFind }) {
  const { portfolioData: data } = usePortfolio();

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const catColors = { Frontend: C.gold, Backend: C.blue, DevOps: C.orange, Design: C.purple };
  const catIcons  = { Frontend: Code2,  Backend: Server, DevOps: Layers,   Design: Palette  };

  const byCategory = data.skills.reduce((acc, s) => {
    (acc[s.category] = acc[s.category] || []).push(s);
    return acc;
  }, {});

  return (
    <section id="skills" ref={ref} className="eh-sec"
      style={{ background: C.bgAlt, position: 'relative' }}>
      <FloatingEgg emoji="🌷" style={{ top: '10%', right: '3%' }} />
      <FloatingEgg emoji="🐇" style={{ bottom: '10%', left: '2%', animationDelay: '-2s' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16, marginBottom: 48 }}>
          <SectionLabel title="Skills" color={C.blue} />
          {/* Hidden egg in section header */}
          <HiddenEgg eggId="egg3" foundEggs={foundEggs} onFind={onFind} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {Object.entries(byCategory).map(([cat, skills], ci) => {
            const col = catColors[cat] || C.gold;
            const Icon = catIcons[cat] || Code2;
            return (
              <motion.div key={cat} className="eh-card"
                initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: ci * 0.1, duration: 0.5 }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10,
                  marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid #2A4A2A' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10,
                    background: `${col}18`, border: `1px solid ${col}33`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={16} color={col} />
                  </div>
                  <span style={{ fontFamily: C.mono, fontSize: '0.82rem', color: col,
                    fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    {cat}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {skills.map((sk, si) => (
                    <div key={sk.name}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontFamily: C.mono, fontSize: '0.84rem', color: C.light }}>{sk.name}</span>
                        <span style={{ fontFamily: C.mono, fontSize: '0.76rem', color: col }}>{sk.level}%</span>
                      </div>
                      <div className="eh-progress-bar">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${sk.level}%` } : {}}
                          transition={{ delay: ci * 0.1 + si * 0.05 + 0.3, duration: 1, ease: 'easeOut' }}
                          style={{ height: '100%', borderRadius: 4,
                            background: `linear-gradient(90deg, ${col}88, ${col})` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Skill tags */}
        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 40, justifyContent: 'center' }}>
          {data.skills.map(sk => {
            const col = catColors[sk.category] || C.gold;
            return (
              <span key={sk.name} style={{ padding: '5px 14px', fontFamily: C.mono,
                fontSize: '0.76rem', color: col, border: `1px solid ${col}33`,
                background: `${col}10`, borderRadius: 20, letterSpacing: '0.05em' }}>
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
function Projects({ foundEggs, onFind }) {
  const { portfolioData: data } = usePortfolio();

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="projects" ref={ref} className="eh-sec"
      style={{ background: C.bg, position: 'relative' }}>
      <FloatingEgg emoji="🌺" style={{ top: '5%', left: '4%' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16, marginBottom: 0 }}>
          <SectionLabel title="Projects" color={C.purple} />
          <HiddenEgg eggId="egg4" foundEggs={foundEggs} onFind={onFind} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {data.projects.map((proj, i) => {
            const colors = [C.gold, C.pink, C.blue, C.purple, C.orange, C.green];
            const col = colors[i % colors.length];
            return (
              <motion.div key={proj.title} className="eh-card"
                initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}>

                {/* Color top bar */}
                <div style={{ height: 4, borderRadius: '12px 12px 0 0', background: col,
                  margin: '-24px -24px 20px', borderTopLeftRadius: 16, borderTopRightRadius: 16 }} />

                {proj.image && (
                  <div style={{ height: 160, overflow: 'hidden', borderRadius: 12,
                    marginBottom: 16, border: `1px solid ${col}22` }}>
                    <img src={proj.image} alt={proj.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover',
                        transition: 'transform 0.4s' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                  </div>
                )}

                <h3 style={{ fontFamily: C.serif, fontSize: '1.1rem', color: C.cream,
                  marginBottom: 8, fontWeight: 700 }}>{proj.title}</h3>

                <p style={{ color: C.light, fontFamily: C.sans, fontSize: '0.88rem',
                  lineHeight: 1.7, marginBottom: 16, opacity: 0.85 }}>{proj.description}</p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
                  {proj.techStack.map(t => (
                    <span key={t} style={{ padding: '3px 10px', fontFamily: C.mono,
                      fontSize: '0.72rem', color: col, border: `1px solid ${col}33`,
                      background: `${col}10`, borderRadius: 6 }}>{t}</span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer"
                    className="eh-btn" style={{ background: col, color: C.bg,
                      padding: '8px 18px', fontSize: '0.8rem', flex: 1, textAlign: 'center' }}>
                    Live Demo
                  </a>
                  <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer"
                    className="eh-btn" style={{ background: 'transparent', color: C.light,
                      border: '1px solid #2A4A2A', padding: '8px 14px', fontSize: '0.8rem',
                      display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Github size={14} /> Code
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Experience ────────────────────────────────────────────────── */
function Experience({ foundEggs, onFind }) {
  const { portfolioData: data } = usePortfolio();

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const expColors = [C.gold, C.pink, C.blue, C.purple, C.orange];

  return (
    <section id="experience" ref={ref} className="eh-sec"
      style={{ background: C.bgAlt, position: 'relative' }}>

      <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16, marginBottom: 0 }}>
          <SectionLabel title="Experience" color={C.orange} />
          <HiddenEgg eggId="egg5" foundEggs={foundEggs} onFind={onFind} />
        </div>

        <div style={{ position: 'relative', paddingLeft: 16 }}>
          {/* Timeline line */}
          <div style={{ position: 'absolute', left: 16, top: 0, bottom: 0, width: 2,
            background: `linear-gradient(to bottom, ${C.gold}, ${C.pink}, ${C.blue})`,
            borderRadius: 2 }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {data.experience.map((exp, i) => {
              const col = expColors[i % expColors.length];
              return (
                <motion.div key={exp.company}
                  initial={{ opacity: 0, x: -28 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  style={{ display: 'flex', gap: 24 }}>

                  {/* Dot */}
                  <div style={{ flexShrink: 0, width: 32, display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%',
                      background: col, border: `3px solid ${C.bgAlt}`,
                      boxShadow: `0 0 0 2px ${col}`, marginTop: 8,
                      flexShrink: 0 }} />
                  </div>

                  {/* Card */}
                  <div className="eh-card" style={{ flex: 1, borderLeft: `3px solid ${col}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between',
                      alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                      <div>
                        <h3 style={{ fontFamily: C.serif, fontSize: '1rem', color: C.cream,
                          margin: '0 0 4px', fontWeight: 700 }}>{exp.role}</h3>
                        <span style={{ fontFamily: C.mono, fontSize: '0.84rem', color: col }}>{exp.company}</span>
                      </div>
                      <span style={{ fontFamily: C.mono, fontSize: '0.72rem', color: C.muted,
                        background: `${col}15`, padding: '3px 12px', borderRadius: 20,
                        border: `1px solid ${col}33`, whiteSpace: 'nowrap' }}>
                        {exp.period}
                      </span>
                    </div>
                    <p style={{ color: C.light, fontFamily: C.sans, fontSize: '0.9rem',
                      lineHeight: 1.75, margin: 0, opacity: 0.85 }}>{exp.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Testimonials ──────────────────────────────────────────────── */
function Testimonials() {
  const { portfolioData: data } = usePortfolio();

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="testimonials" ref={ref} className="eh-sec"
      style={{ background: C.paper, position: 'relative' }}>
      <FloatingEgg emoji="🦋" style={{ top: '8%', right: '5%' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionLabel title="Kind Words" color={C.purple} dark={false} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 20 }}>
          {data.testimonials.map((t, i) => {
            const col = [C.gold, C.pink, C.blue, C.purple][i % 4];
            return (
              <motion.div key={t.name}
                initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                style={{ background: C.cream, border: `2px solid ${col}22`,
                  borderRadius: 20, padding: '28px 24px', position: 'relative',
                  boxShadow: `0 4px 24px ${col}12` }}>

                {/* Top accent */}
                <div style={{ position: 'absolute', top: 0, left: 24, right: 24, height: 3,
                  background: col, borderRadius: '0 0 3px 3px' }} />

                <div style={{ display: 'flex', gap: 3, marginBottom: 16, marginTop: 8 }}>
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star key={si} size={14} fill={C.gold} color={C.gold} />
                  ))}
                </div>

                <p style={{ color: C.text, fontFamily: C.serif, fontSize: '0.92rem',
                  lineHeight: 1.8, marginBottom: 20, fontStyle: 'italic' }}>
                  "{t.text}"
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img src={t.avatar} alt={t.name}
                    style={{ width: 46, height: 46, borderRadius: '50%', objectFit: 'cover',
                      border: `2px solid ${col}66`, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontFamily: C.mono, fontSize: '0.86rem', color: C.text,
                      fontWeight: 700 }}>{t.name}</div>
                    <div style={{ fontFamily: C.mono, fontSize: '0.72rem', color: C.muted, marginTop: 2 }}>
                      {t.role}
                    </div>
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
function Contact({ foundEggs, onFind }) {
  const { portfolioData: data } = usePortfolio();

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
    <section id="contact" ref={ref} className="eh-sec"
      style={{ background: C.bg, position: 'relative' }}>
      <FloatingEgg emoji="🌻" style={{ bottom: '15%', right: '4%' }} />

      <div style={{ maxWidth: 680, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16, marginBottom: 0 }}>
          <SectionLabel title="Say Hello 👋" color={C.green} />
          <HiddenEgg eggId="egg6" foundEggs={foundEggs} onFind={onFind} />
        </div>

        <motion.div initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}>

          <div className="eh-card" style={{ border: `1px solid ${C.green}33` }}>
            <AnimatePresence mode="wait">
              {status === 'done' ? (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  style={{ textAlign: 'center', padding: '48px 20px' }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🌸</div>
                  <CheckCircle size={52} color={C.green} style={{ margin: '0 auto 16px', display: 'block' }} />
                  <h3 style={{ fontFamily: C.serif, fontSize: '1.8rem', color: C.cream,
                    marginBottom: 8, fontWeight: 700 }}>Message Sent!</h3>
                  <p style={{ color: C.light, fontFamily: C.mono, fontSize: '0.88rem', lineHeight: 1.6 }}>
                    Thanks for reaching out! I'll get back to you soon 🐣
                  </p>
                  <button type="button" onClick={() => { setStatus('idle'); setForm({ name:'', email:'', message:'' }); }}
                    className="eh-btn" style={{ background: C.green, color: C.bg, marginTop: 24 }}>
                    🌸 Send Another
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    {[
                      { key: 'name',  label: 'Your Name',  type: 'text',  placeholder: 'Jane Doe' },
                      { key: 'email', label: 'Email',      type: 'email', placeholder: 'jane@example.com' },
                    ].map(({ key, label, type, placeholder }) => (
                      <div key={key}>
                        <label style={{ display: 'block', fontFamily: C.mono, fontSize: '0.68rem',
                          color: C.muted, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>
                          {label}
                        </label>
                        <input type={type} className="eh-input" placeholder={placeholder} required
                          value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', fontFamily: C.mono, fontSize: '0.68rem',
                      color: C.muted, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>
                      Message
                    </label>
                    <textarea className="eh-input" placeholder="What's on your mind? 🌸" required
                      rows={5} style={{ resize: 'vertical' }}
                      value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
                  </div>

                  <button type="submit" disabled={status === 'sending'}
                    className="eh-btn" style={{ width: '100%', background: C.green,
                      color: C.bg, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: 10, fontSize: '0.92rem' }}>
                    {status === 'sending'
                      ? <><motion.span animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>🌸</motion.span> Sending…</>
                      : <><Send size={16} /> Send Message</>}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 28, flexWrap: 'wrap' }}>
            {[
              { Icon: Mail,     href: `mailto:${data.socials.email}`, label: 'Email',    col: C.gold  },
              { Icon: Github,   href: data.socials.github,             label: 'GitHub',   col: C.light },
              { Icon: Linkedin, href: data.socials.linkedin,           label: 'LinkedIn', col: C.blue  },
              { Icon: Twitter,  href: data.socials.twitter,            label: 'Twitter',  col: C.blue  },
            ].map(({ Icon, href, label, col }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 7,
                  color: col, textDecoration: 'none', fontFamily: C.mono,
                  fontSize: '0.82rem', letterSpacing: '0.05em', transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.6'}
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
function Footer({ foundEggs }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <footer style={{ background: '#0A120A', borderTop: '2px solid #1A2E1A',
      padding: '40px 24px 28px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <FloatingEgg emoji="🌿" style={{ top: -10, left: '10%' }} />
      <FloatingEgg emoji="🌸" style={{ top: -10, right: '12%', animationDelay: '-1s' }} />

      <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ height: 3, background: `linear-gradient(90deg,
          ${C.gold}, ${C.pink}, ${C.blue}, ${C.purple}, ${C.green}, ${C.gold})`,
          borderRadius: 2, marginBottom: 24 }} />

        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🥚</div>
        <div style={{ fontFamily: C.serif, fontSize: 'clamp(1.1rem,3vw,1.8rem)',
          color: C.cream, fontWeight: 700, marginBottom: 6 }}>
          {data.personal.name}
        </div>
        <p style={{ color: C.muted, fontFamily: C.mono, fontSize: '0.76rem',
          marginBottom: 14, letterSpacing: '0.06em' }}>
          {data.personal.tagline}
        </p>

        {foundEggs.length === EGGS.length ? (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8,
            background: `${C.gold}18`, border: `1px solid ${C.gold}44`,
            borderRadius: 20, padding: '8px 20px', marginBottom: 16 }}>
            <Trophy size={16} color={C.gold} />
            <span style={{ fontFamily: C.mono, fontSize: '0.78rem', color: C.gold }}>
              Master Egg Hunter! {EGGS.length}/{EGGS.length} eggs found 🏆
            </span>
          </div>
        ) : (
          <div style={{ color: C.muted, fontFamily: C.mono, fontSize: '0.76rem', marginBottom: 16 }}>
            🥚 {foundEggs.length}/{EGGS.length} eggs found — keep hunting!
          </div>
        )}

        <p style={{ color: '#2A4A2A', fontFamily: C.mono, fontSize: '0.7rem',
          letterSpacing: '0.08em' }}>
          🌸 {new Date().getFullYear()} · Built with ♥ by {data.personal.name.toUpperCase()} 🌸
        </p>
      </div>
    </footer>
  );
}

/* ── Scoreboard panel ──────────────────────────────────────────── */
function Scoreboard({ foundEggs, show, onClose }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          style={{
            position: 'fixed', right: 80, top: '50%', transform: 'translateY(-50%)',
            zIndex: 999, background: C.bgAlt,
            border: `2px solid ${C.gold}55`, borderRadius: 20,
            padding: '24px 20px', width: 260,
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontFamily: C.mono, fontSize: '0.78rem', color: C.gold,
              letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>
              🥚 Egg Progress
            </div>
            <button type="button" onClick={onClose} style={{ background: 'none', border: 'none',
              color: C.muted, cursor: 'pointer' }}>
              <X size={16} />
            </button>
          </div>

          {/* Progress bar */}
          <div className="eh-progress-bar" style={{ marginBottom: 20 }}>
            <motion.div
              animate={{ width: `${(foundEggs.length / EGGS.length) * 100}%` }}
              transition={{ duration: 0.5 }}
              style={{ height: '100%', borderRadius: 4,
                background: `linear-gradient(90deg, ${C.gold}, ${C.green})` }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {EGGS.map(egg => {
              const isFound = foundEggs.includes(egg.id);
              return (
                <div key={egg.id} style={{ display: 'flex', alignItems: 'center', gap: 12,
                  opacity: isFound ? 1 : 0.4 }}>
                  <span style={{ fontSize: '1.4rem',
                    filter: isFound ? 'none' : 'grayscale(1)' }}>{egg.emoji}</span>
                  <span style={{ fontFamily: C.mono, fontSize: '0.78rem',
                    color: isFound ? C.light : C.muted, flex: 1,
                    textDecoration: isFound ? 'none' : 'none' }}>
                    {isFound ? egg.clue : '??? Hidden ???'}
                  </span>
                  {isFound && <CheckCircle size={14} color={C.green} />}
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Root ──────────────────────────────────────────────────────── */
export default function HiddenEasterEggScavengerHunt() {
  const { portfolioData: data } = usePortfolio();

  const [foundEggs, setFoundEggs]       = useState([]);
  const [toastEgg, setToastEgg]         = useState(null);
  const [showVictory, setShowVictory]   = useState(false);
  const [showScoreboard, setShowScoreboard] = useState(false);

  const handleFind = (eggId) => {
    if (foundEggs.includes(eggId)) return;
    const newFound = [...foundEggs, eggId];
    setFoundEggs(newFound);
    setToastEgg(EGGS.find(e => e.id === eggId));
    if (newFound.length === EGGS.length) {
      setTimeout(() => setShowVictory(true), 1000);
    }
  };

  const eggProps = { foundEggs, onFind: handleFind };

  return (
    <>
      <GlobalStyles />
      <div style={{ background: C.bg, color: C.cream, minHeight: '100vh' }}>
        <Nav foundCount={foundEggs.length} />

        <EggCounter
          found={foundEggs}
          total={EGGS.length}
          onClick={() => setShowScoreboard(s => !s)} />

        <Scoreboard
          foundEggs={foundEggs}
          show={showScoreboard}
          onClose={() => setShowScoreboard(false)} />

        <Hero        {...eggProps} />
        <About       {...eggProps} />
        <Skills      {...eggProps} />
        <Projects    {...eggProps} />
        <Experience  {...eggProps} />
        <Testimonials />
        <Contact     {...eggProps} />
        <Footer foundEggs={foundEggs} />

        {/* Toast notification */}
        <AnimatePresence>
          {toastEgg && (
            <ClueToast
              key={toastEgg.id}
              clue={toastEgg.clue}
              egg={toastEgg}
              onClose={() => setToastEgg(null)} />
          )}
        </AnimatePresence>

        {/* Victory modal */}
        <AnimatePresence>
          {showVictory && <VictoryModal onClose={() => setShowVictory(false)} />}
        </AnimatePresence>
      </div>
    </>
  );
}
