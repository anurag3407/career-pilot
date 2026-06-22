import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Github, Linkedin, Twitter, Mail, MapPin, ExternalLink,
  Star, Menu, X, Send, CheckCircle, ChevronDown,
} from 'lucide-react';
import { usePortfolio } from '../../../../context/PortfolioContext';

/* ── Design tokens ─────────────────────────────────────────────── */
const C = {
  bg:      '#1A0F00',
  bgAlt:   '#2A1800',
  card:    '#321E00',
  paper:   '#FFF8E7',
  cream:   '#FFFDF0',
  text:    '#1A0F00',
  honey:   '#F5A623',
  amber:   '#D4820A',
  gold:    '#FFD700',
  brown:   '#8B4513',
  darkBrown: '#3E1F00',
  wax:     '#F0C060',
  pollen:  '#FFE135',
  wing:    '#B8D4E8',
  green:   '#4A7C3F',
  cream2:  '#FAF0DC',
  mono:    "'Courier New', monospace",
  serif:   "'Georgia', serif",
  sans:    "'Helvetica Neue', Arial, sans-serif",
};

/* ── Honeycomb hex pattern ─────────────────────────────────────── */
function HoneycombBg() {
  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      opacity: 0.06, pointerEvents: 'none', zIndex: 0,
    }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="honeycomb" x="0" y="0" width="56" height="100" patternUnits="userSpaceOnUse">
            <polygon points="28,2 54,16 54,44 28,58 2,44 2,16"
              fill="none" stroke={C.honey} strokeWidth="1.5" />
            <polygon points="28,52 54,66 54,94 28,108 2,94 2,66"
              fill="none" stroke={C.honey} strokeWidth="1.5" />
            <polygon points="56,27 82,41 82,69 56,83 30,69 30,41"
              fill="none" stroke={C.honey} strokeWidth="1.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#honeycomb)" />
      </svg>
    </div>
  );
}

/* ── Floating bee ──────────────────────────────────────────────── */
function FloatingBee({ style }) {
  return (
    <div style={{
      position: 'absolute', fontSize: '1.8rem',
      pointerEvents: 'none', opacity: 0.15,
      animation: 'bee-float 4s ease-in-out infinite',
      ...style,
    }}>🐝</div>
  );
}

/* ── Global styles ─────────────────────────────────────────────── */
function GlobalStyles() {
  return (
    <style>{`
      @keyframes bee-float {
        0%   { transform: translateY(0) rotate(-5deg); }
        25%  { transform: translateY(-14px) rotate(5deg); }
        50%  { transform: translateY(-8px) rotate(-3deg); }
        75%  { transform: translateY(-18px) rotate(4deg); }
        100% { transform: translateY(0) rotate(-5deg); }
      }
      @keyframes drip {
        0%   { transform: scaleY(0); opacity: 0; }
        60%  { transform: scaleY(1); opacity: 1; }
        100% { transform: scaleY(1) translateY(6px); opacity: 0; }
      }
      @keyframes hex-pulse {
        0%, 100% { opacity: 0.15; }
        50%       { opacity: 0.35; }
      }
      @keyframes waggle {
        0%, 100% { transform: rotate(0deg); }
        25%       { transform: rotate(-8deg); }
        75%       { transform: rotate(8deg); }
      }

      .ab-sec {
        padding: 80px 20px;
        position: relative;
        overflow: hidden;
      }
      @media (min-width: 640px)  { .ab-sec { padding: 96px 32px; } }
      @media (min-width: 1024px) { .ab-sec { padding: 112px 64px; } }

      .ab-btn {
        padding: 12px 28px;
        border-radius: 8px;
        font-family: ${C.mono};
        font-size: 0.88rem;
        font-weight: 700;
        letter-spacing: 0.06em;
        cursor: pointer;
        border: none;
        transition: transform 0.15s, filter 0.2s;
        text-decoration: none;
        display: inline-block;
      }
      .ab-btn:hover  { filter: brightness(1.1); transform: translateY(-2px); }
      .ab-btn:active { transform: translateY(1px); }

      .ab-card {
        background: ${C.card};
        border: 1px solid ${C.amber}44;
        border-radius: 12px;
        padding: 24px;
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .ab-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 32px rgba(0,0,0,0.4);
      }

      .ab-input {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid ${C.amber}44;
        border-radius: 8px;
        background: ${C.bgAlt};
        font-family: ${C.mono};
        font-size: 0.9rem;
        color: ${C.wax};
        box-sizing: border-box;
        transition: border-color 0.2s;
      }
      .ab-input:focus { outline: none; border-color: ${C.honey}; }
      .ab-input::placeholder { color: ${C.amber}88; }

      /* Hex skill tag */
      .ab-hex-tag {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 6px 16px;
        background: ${C.amber}22;
        border: 1px solid ${C.honey}55;
        border-radius: 6px;
        font-family: ${C.mono};
        font-size: 0.78rem;
        color: ${C.wax};
        letter-spacing: 0.05em;
        transition: background 0.2s;
      }
      .ab-hex-tag:hover { background: ${C.amber}44; }

      @media (prefers-reduced-motion: reduce) {
        .ab-btn, .ab-card { transition: none !important; }
      }
    `}</style>
  );
}

/* ── Honey drip divider ────────────────────────────────────────── */
function HoneyDrip({ flip = false }) {
  return (
    <div style={{
      width: '100%', overflow: 'hidden', lineHeight: 0,
      transform: flip ? 'rotate(180deg)' : 'none',
    }}>
      <svg viewBox="0 0 1200 60" xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', width: '100%' }}>
        <path d={`
          M0,0 L0,20
          Q100,50 200,20 Q300,0 400,25 Q500,50 600,20
          Q700,0 800,30 Q900,55 1000,20 Q1100,0 1200,25
          L1200,0 Z
        `} fill={C.bgAlt} />
        {[100, 300, 600, 900, 1100].map((x, i) => (
          <ellipse key={i} cx={x} cy={30 + (i % 3) * 8} rx={6} ry={10 + i * 2}
            fill={C.honey} opacity={0.5}
            style={{ animation: `drip 2s ease-in-out ${i * 0.4}s infinite` }} />
        ))}
      </svg>
    </div>
  );
}

/* ── Section label ─────────────────────────────────────────────── */
function SectionLabel({ title, dark = true }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
        <span style={{ fontSize: '1.6rem' }}>🍯</span>
        <h2 style={{
          fontFamily: C.serif,
          fontSize: 'clamp(1.8rem, 4vw, 3rem)',
          color: dark ? C.wax : C.text,
          margin: 0, fontWeight: 700,
          letterSpacing: '-0.02em',
        }}>{title}</h2>
      </div>
      <div style={{
        height: 3, maxWidth: 180,
        background: `linear-gradient(90deg, ${C.honey}, transparent)`,
        borderRadius: 2, marginLeft: 44,
      }} />
    </div>
  );
}

/* ── Nav ───────────────────────────────────────────────────────── */
function Nav({ name }) {
  const [open, setOpen] = useState(false);
  const links = ['About', 'Skills', 'Projects', 'Experience', 'Contact'];
  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
        background: `${C.bg}F0`, backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.amber}33`,
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto', padding: '0 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.5rem' }}>🐝</span>
            <span style={{ color: C.wax, fontFamily: C.mono, fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.15em' }}>
              {name?.split(' ')[0]?.toUpperCase() || 'PORTFOLIO'}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 4 }} className="ab-nav-desktop">
            {links.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{
                color: C.wax, textDecoration: 'none', fontSize: '0.8rem',
                fontFamily: C.mono, fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', padding: '6px 14px', opacity: 0.7,
                transition: 'opacity 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}
              >{l}</a>
            ))}
          </div>
          <a href="#contact" className="ab-btn" style={{ background: C.honey, color: C.bg, padding: '8px 20px', fontSize: '0.78rem' }}>
            🍯 Hire Me
          </a>
          <button onClick={() => setOpen(o => !o)} style={{
            background: 'none', border: `1px solid ${C.amber}44`,
            color: C.wax, cursor: 'pointer', padding: '6px 8px',
            display: 'flex', borderRadius: 8,
          }} className="ab-nav-mobile-btn">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }}
            exit={{ height: 0 }} transition={{ duration: 0.22 }}
            style={{
              position: 'fixed', top: 64, left: 0, right: 0, zIndex: 899,
              background: C.bg, borderBottom: `1px solid ${C.amber}33`, overflow: 'hidden',
            }}>
            {links.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)}
                style={{
                  display: 'block', color: C.wax, textDecoration: 'none',
                  fontFamily: C.mono, fontWeight: 700, fontSize: '0.95rem',
                  padding: '16px 24px', borderBottom: `1px solid ${C.amber}22`,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>
                🐝 {l}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        .ab-nav-desktop { display: none !important; }
        .ab-nav-mobile-btn { display: flex !important; }
        @media (min-width: 768px) {
          .ab-nav-desktop { display: flex !important; }
          .ab-nav-mobile-btn { display: none !important; }
        }
      `}</style>
    </>
  );
}

/* ── Hero ──────────────────────────────────────────────────────── */
function Hero({ data }) {
  return (
    <section id="hero" style={{
      minHeight: '100vh', background: C.bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '100px 20px 0', position: 'relative', overflow: 'hidden',
      textAlign: 'center',
    }}>
      <HoneycombBg />
      <FloatingBee style={{ top: '15%', left: '5%', animationDelay: '0s' }} />
      <FloatingBee style={{ top: '25%', right: '8%', animationDelay: '-1.5s' }} />
      <FloatingBee style={{ bottom: '30%', left: '10%', animationDelay: '-3s' }} />
      <FloatingBee style={{ top: '60%', right: '5%', animationDelay: '-0.8s' }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 760 }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: `${C.honey}18`, border: `1px solid ${C.honey}44`,
            color: C.honey, borderRadius: 24, padding: '6px 20px',
            fontFamily: C.mono, fontSize: '0.72rem', letterSpacing: '0.2em',
            textTransform: 'uppercase', marginBottom: 24,
          }}>
          🐝 Apiarist · Craftsman · Developer
        </motion.div>

        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', bounce: 0.4 }}
          style={{ fontSize: '5rem', marginBottom: 16 }}>
          🍯
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            fontFamily: C.serif, fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            color: C.cream, fontWeight: 700, margin: '0 0 12px',
            letterSpacing: '-0.03em', lineHeight: 1.1,
          }}>
          {data.personal.name}
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            fontFamily: C.mono, fontSize: 'clamp(0.8rem, 2vw, 1rem)',
            color: C.honey, letterSpacing: '0.2em', textTransform: 'uppercase',
            marginBottom: 16,
          }}>
          {data.personal.title}
        </motion.p>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            color: C.wax, fontFamily: C.serif, fontSize: 'clamp(1rem, 2vw, 1.1rem)',
            fontStyle: 'italic', maxWidth: 520, margin: '0 auto 32px', lineHeight: 1.8, opacity: 0.85,
          }}>
          "{data.personal.tagline}"
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12, maxWidth: 400, margin: '0 auto 32px',
          }}>
          {[
            { n: `${data.stats.yearsExperience}+`, l: 'Years' },
            { n: `${data.stats.projectsCompleted}+`, l: 'Projects' },
            { n: `${data.stats.happyClients}+`, l: 'Clients' },
          ].map(({ n, l }) => (
            <div key={l} style={{
              background: `${C.honey}12`, border: `1px solid ${C.honey}33`,
              borderRadius: 12, padding: '14px 8px', textAlign: 'center',
            }}>
              <div style={{ fontFamily: C.serif, fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: C.cream }}>{n}</div>
              <div style={{ fontFamily: C.mono, fontSize: '0.65rem', color: C.honey, letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.65 }}
          style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 28 }}>
          <a href="#projects" className="ab-btn" style={{ background: C.honey, color: C.bg }}>
            🍯 View My Work
          </a>
          <a href={data.personal.resumeUrl || '#contact'} className="ab-btn"
            style={{ background: 'transparent', color: C.wax, border: `1px solid ${C.amber}55` }}>
            📄 Resume
          </a>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { Icon: Github,   href: data.socials.github,            color: C.wax  },
            { Icon: Linkedin, href: data.socials.linkedin,          color: C.wing },
            { Icon: Twitter,  href: data.socials.twitter,           color: C.wing },
            { Icon: Mail,     href: `mailto:${data.socials.email}`, color: C.honey },
          ].map(({ Icon, href, color }) => href && (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer"
              style={{
                width: 44, height: 44, display: 'flex', alignItems: 'center',
                justifyContent: 'center', border: `1px solid ${C.amber}44`,
                borderRadius: 10, color, transition: 'background 0.2s, transform 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `${color}18`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <Icon size={18} />
            </a>
          ))}
        </motion.div>
      </div>

      <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
        style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', color: C.amber, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <span style={{ fontFamily: C.mono, fontSize: '0.6rem', letterSpacing: '0.2em' }}>SCROLL</span>
        <ChevronDown size={16} />
      </motion.div>
    </section>
  );
}

/* ── About ─────────────────────────────────────────────────────── */
function About({ data }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about" ref={ref} className="ab-sec" style={{ background: C.paper }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <SectionLabel title="About Me" dark={false} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 40 }}>
          <motion.div initial={{ opacity: 0, x: -32 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: 200, height: 200, borderRadius: '50%', overflow: 'hidden',
                border: `4px solid ${C.honey}`, boxShadow: `0 0 0 8px ${C.honey}22`,
              }}>
                <img src={data.personal.avatar} alt={data.personal.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span style={{ position: 'absolute', bottom: -10, right: -10, fontSize: '2rem', animation: 'waggle 2s ease-in-out infinite' }}>🐝</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 280 }}>
              {[
                { Icon: MapPin, text: data.personal.location,   color: C.brown },
                { Icon: Mail,   text: data.socials.email,        color: C.honey, href: `mailto:${data.socials.email}` },
                { Icon: Github, text: 'GitHub Profile',          color: C.text,  href: data.socials.github },
              ].map(({ Icon, text, color, href }) => (
                <div key={text} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  background: `${color}12`, border: `1px solid ${color}33`,
                  borderRadius: 10, padding: '8px 14px',
                }}>
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

          <motion.div initial={{ opacity: 0, x: 32 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.12 }}>
            <div style={{
              background: C.cream2, border: `1px solid ${C.honey}33`,
              borderRadius: 16, padding: '28px 24px', marginBottom: 24,
              boxShadow: `0 4px 24px ${C.honey}18`,
            }}>
              <p style={{ color: C.text, fontFamily: C.serif, fontSize: '1.05rem', lineHeight: 1.9, margin: 0 }}>
                {data.personal.bio}
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {[
                { n: `${data.stats.yearsExperience}+`, l: 'Years',    color: C.honey },
                { n: `${data.stats.projectsCompleted}+`, l: 'Projects', color: C.amber },
                { n: `${data.stats.happyClients}+`,     l: 'Clients',  color: C.brown },
              ].map(({ n, l, color }) => (
                <div key={l} style={{
                  textAlign: 'center', padding: '16px 8px',
                  border: `2px solid ${color}44`, borderRadius: 12, background: `${color}0A`,
                }}>
                  <div style={{ fontFamily: C.serif, fontSize: '1.8rem', color, fontWeight: 700 }}>{n}</div>
                  <div style={{ fontFamily: C.mono, fontSize: '0.68rem', color: C.brown, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 4 }}>{l}</div>
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
function Skills({ data }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="skills" ref={ref} className="ab-sec" style={{ background: C.bgAlt, position: 'relative' }}>
      <HoneycombBg />
      <FloatingBee style={{ top: '10%', right: '3%', animationDelay: '-2s' }} />
      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <SectionLabel title="The Hive's Skills" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px,1fr))', gap: 20 }}>
          {Object.entries(
            data.skills.reduce((acc, s) => { (acc[s.category] = acc[s.category] || []).push(s); return acc; }, {})
          ).map(([cat, skills], ci) => (
            <motion.div key={cat} className="ab-card"
              initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: ci * 0.1, duration: 0.5 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18,
                paddingBottom: 12, borderBottom: `1px solid ${C.amber}33`,
              }}>
                <span style={{ fontSize: '1.2rem' }}>🍯</span>
                <span style={{ fontFamily: C.mono, fontSize: '0.82rem', color: C.honey, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{cat}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {skills.map((sk, si) => (
                  <div key={sk.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontFamily: C.mono, fontSize: '0.84rem', color: C.wax }}>{sk.name}</span>
                      <span style={{ fontFamily: C.mono, fontSize: '0.76rem', color: C.honey }}>{sk.level}%</span>
                    </div>
                    <div style={{ height: 8, borderRadius: 4, background: C.darkBrown, overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={inView ? { width: `${sk.level}%` } : {}}
                        transition={{ delay: ci * 0.1 + si * 0.06 + 0.3, duration: 1, ease: 'easeOut' }}
                        style={{ height: '100%', borderRadius: 4, background: `linear-gradient(90deg, ${C.amber}, ${C.honey})` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 36, justifyContent: 'center' }}>
          {data.skills.map(sk => (
            <span key={sk.name} className="ab-hex-tag">{sk.name}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ── Projects ──────────────────────────────────────────────────── */
function Projects({ data }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const cols = [C.honey, C.amber, C.wax, C.brown, C.gold, C.green];

  return (
    <section id="projects" ref={ref} className="ab-sec" style={{ background: C.bg, position: 'relative' }}>
      <HoneycombBg />
      <FloatingBee style={{ bottom: '20%', left: '3%', animationDelay: '-1s' }} />
      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <SectionLabel title="Honey in the Comb" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: 24 }}>
          {data.projects.map((proj, i) => {
            const col = cols[i % cols.length];
            return (
              <motion.div key={proj.title} className="ab-card"
                initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}>
                <div style={{ height: 4, borderRadius: '10px 10px 0 0', background: col, margin: '-24px -24px 20px' }} />
                {proj.image && (
                  <div style={{ height: 150, overflow: 'hidden', borderRadius: 10, marginBottom: 14, border: `1px solid ${col}22` }}>
                    <img src={proj.image} alt={proj.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                  </div>
                )}
                <h3 style={{ fontFamily: C.serif, fontSize: '1.1rem', color: C.cream, marginBottom: 8, fontWeight: 700 }}>{proj.title}</h3>
                <p style={{ color: C.wax, fontFamily: C.sans, fontSize: '0.88rem', lineHeight: 1.7, marginBottom: 14, opacity: 0.8 }}>{proj.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
                  {proj.techStack?.map(t => (
                    <span key={t} style={{ padding: '3px 10px', fontFamily: C.mono, fontSize: '0.72rem', color: col, border: `1px solid ${col}44`, background: `${col}10`, borderRadius: 6 }}>{t}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {proj.liveUrl && (
                    <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer"
                      className="ab-btn" style={{ background: col, color: C.bg, padding: '8px 16px', fontSize: '0.8rem', flex: 1, textAlign: 'center' }}>
                      Live Demo
                    </a>
                  )}
                  {proj.githubUrl && (
                    <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer"
                      className="ab-btn" style={{ background: 'transparent', color: C.wax, border: `1px solid ${C.amber}44`, padding: '8px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Github size={14} /> Code
                    </a>
                  )}
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
function Experience({ data }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const cols = [C.honey, C.amber, C.wax, C.gold, C.brown];

  return (
    <section id="experience" ref={ref} className="ab-sec" style={{ background: C.bgAlt, position: 'relative' }}>
      <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <SectionLabel title="The Colony's History" />
        <div style={{ position: 'relative', paddingLeft: 20 }}>
          <div style={{
            position: 'absolute', left: 20, top: 0, bottom: 0, width: 2,
            background: `linear-gradient(to bottom, ${C.honey}, ${C.amber}, ${C.brown})`,
            borderRadius: 2,
          }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {data.experience.map((exp, i) => {
              const col = cols[i % cols.length];
              return (
                <motion.div key={exp.company}
                  initial={{ opacity: 0, x: -28 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  style={{ display: 'flex', gap: 24 }}>
                  <div style={{ flexShrink: 0, width: 32, display: 'flex', justifyContent: 'center' }}>
                    <div style={{
                      width: 14, height: 14, borderRadius: '50%',
                      background: col, border: `3px solid ${C.bgAlt}`,
                      boxShadow: `0 0 0 2px ${col}`, marginTop: 8, flexShrink: 0,
                    }} />
                  </div>
                  <div className="ab-card" style={{ flex: 1, borderLeft: `3px solid ${col}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                      <div>
                        <h3 style={{ fontFamily: C.serif, fontSize: '1rem', color: C.cream, margin: '0 0 4px', fontWeight: 700 }}>{exp.role}</h3>
                        <span style={{ fontFamily: C.mono, fontSize: '0.84rem', color: col }}>{exp.company}</span>
                      </div>
                      <span style={{
                        fontFamily: C.mono, fontSize: '0.72rem', color: C.wax,
                        background: `${col}18`, padding: '3px 12px', borderRadius: 20,
                        border: `1px solid ${col}44`, whiteSpace: 'nowrap',
                      }}>{exp.period}</span>
                    </div>
                    <p style={{ color: C.wax, fontFamily: C.sans, fontSize: '0.9rem', lineHeight: 1.75, margin: 0, opacity: 0.8 }}>{exp.description}</p>
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
function Testimonials({ data }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="testimonials" ref={ref} className="ab-sec" style={{ background: C.paper }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <SectionLabel title="Sweet Words" dark={false} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: 20 }}>
          {data.testimonials.map((t, i) => {
            const col = [C.honey, C.amber, C.brown, C.gold][i % 4];
            return (
              <motion.div key={t.name}
                initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                style={{
                  background: C.cream2, border: `2px solid ${col}33`,
                  borderRadius: 16, padding: '28px 24px', position: 'relative',
                  boxShadow: `0 4px 24px ${col}12`,
                }}>
                <div style={{ position: 'absolute', top: 0, left: 24, right: 24, height: 3, background: col, borderRadius: '0 0 3px 3px' }} />
                <div style={{ display: 'flex', gap: 3, marginBottom: 14, marginTop: 8 }}>
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star key={si} size={14} fill={C.honey} color={C.honey} />
                  ))}
                </div>
                <p style={{ color: C.text, fontFamily: C.serif, fontSize: '0.92rem', lineHeight: 1.8, marginBottom: 20, fontStyle: 'italic' }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img src={t.avatar} alt={t.name} style={{ width: 46, height: 46, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${col}66`, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontFamily: C.mono, fontSize: '0.86rem', color: C.text, fontWeight: 700 }}>{t.name}</div>
                    <div style={{ fontFamily: C.mono, fontSize: '0.72rem', color: C.brown, marginTop: 2 }}>{t.role}</div>
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
function Contact({ data }) {
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
    <section id="contact" ref={ref} className="ab-sec" style={{ background: C.bg, position: 'relative' }}>
      <HoneycombBg />
      <FloatingBee style={{ top: '20%', right: '5%', animationDelay: '-2s' }} />
      <div style={{ maxWidth: 680, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <SectionLabel title="Send a Buzz 🐝" />
        <motion.div initial={{ opacity: 0, y: 32 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}>
          <div className="ab-card">
            <AnimatePresence mode="wait">
              {status === 'done' ? (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  style={{ textAlign: 'center', padding: '48px 20px' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 16 }}>🍯</div>
                  <CheckCircle size={52} color={C.honey} style={{ margin: '0 auto 16px', display: 'block' }} />
                  <h3 style={{ fontFamily: C.serif, fontSize: '1.8rem', color: C.cream, marginBottom: 8, fontWeight: 700 }}>Message Delivered!</h3>
                  <p style={{ color: C.wax, fontFamily: C.mono, fontSize: '0.88rem', lineHeight: 1.6 }}>
                    Sweet! I'll get back to you soon 🐝
                  </p>
                  <button onClick={() => { setStatus('idle'); setForm({ name: '', email: '', message: '' }); }}
                    className="ab-btn" style={{ background: C.honey, color: C.bg, marginTop: 24 }}>
                    🍯 Send Another
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                    {[
                      { key: 'name', label: 'Your Name', type: 'text', placeholder: 'Jane Doe' },
                      { key: 'email', label: 'Email', type: 'email', placeholder: 'jane@example.com' },
                    ].map(({ key, label, type, placeholder }) => (
                      <div key={key}>
                        <label style={{ display: 'block', fontFamily: C.mono, fontSize: '0.68rem', color: C.amber, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</label>
                        <input type={type} className="ab-input" placeholder={placeholder} required
                          value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', fontFamily: C.mono, fontSize: '0.68rem', color: C.amber, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>Message</label>
                    <textarea className="ab-input" placeholder="What's buzzing? 🐝" required rows={5} style={{ resize: 'vertical' }}
                      value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
                  </div>
                  <button type="submit" disabled={status === 'sending'} className="ab-btn"
                    style={{ width: '100%', background: C.honey, color: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: '0.92rem' }}>
                    {status === 'sending'
                      ? <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>🐝</motion.span> Sending…</>
                      : <><Send size={16} /> Send Message</>}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 28, flexWrap: 'wrap' }}>
            {[
              { Icon: Mail,     href: `mailto:${data.socials.email}`, label: 'Email',    col: C.honey },
              { Icon: Github,   href: data.socials.github,             label: 'GitHub',   col: C.wax  },
              { Icon: Linkedin, href: data.socials.linkedin,           label: 'LinkedIn', col: C.wing },
              { Icon: Twitter,  href: data.socials.twitter,            label: 'Twitter',  col: C.wing },
            ].map(({ Icon, href, label, col }) => href && (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 7, color: col, textDecoration: 'none', fontFamily: C.mono, fontSize: '0.82rem', transition: 'opacity 0.2s' }}
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
function Footer({ data }) {
  return (
    <footer style={{ background: '#0F0800', borderTop: `2px solid ${C.amber}22`, padding: '40px 24px 28px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <HoneycombBg />
      <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ height: 3, background: `linear-gradient(90deg, ${C.honey}, ${C.amber}, ${C.brown}, ${C.honey})`, borderRadius: 2, marginBottom: 24 }} />
        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🍯</div>
        <div style={{ fontFamily: C.serif, fontSize: 'clamp(1.1rem,3vw,1.8rem)', color: C.cream, fontWeight: 700, marginBottom: 6 }}>
          {data.personal.name}
        </div>
        <p style={{ color: C.amber, fontFamily: C.mono, fontSize: '0.76rem', marginBottom: 20, letterSpacing: '0.06em', opacity: 0.7 }}>
          {data.personal.tagline}
        </p>
        <p style={{ color: C.darkBrown, fontFamily: C.mono, fontSize: '0.7rem', letterSpacing: '0.08em' }}>
          🐝 {new Date().getFullYear()} · Crafted with ♥ by {data.personal.name.toUpperCase()} 🍯
        </p>
      </div>
    </footer>
  );
}

/* ── Root ──────────────────────────────────────────────────────── */
export default function ApiaristBeekeeperHive() {
  const { portfolioData } = usePortfolio();
  const data = portfolioData;

  return (
    <>
      <GlobalStyles />
      <div style={{ background: C.bg, color: C.wax, minHeight: '100vh' }}>
        <Nav name={data.personal.name} />
        <Hero data={data} />
        <HoneyDrip />
        <About data={data} />
        <HoneyDrip flip />
        <Skills data={data} />
        <HoneyDrip />
        <Projects data={data} />
        <HoneyDrip flip />
        <Experience data={data} />
        <HoneyDrip />
        <Testimonials data={data} />
        <HoneyDrip flip />
        <Contact data={data} />
        <Footer data={data} />
      </div>
    </>
  );
}