import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../../../../context/PortfolioContext';

/* ─── Design tokens ─────────────────────────────────────────────── */
const T = {
  bg:      '#050508',
  surface: 'rgba(108,99,255,0.07)',
  border:  'rgba(108,99,255,0.25)',
  indigo:  '#6C63FF',
  cyan:    '#00F5FF',
  magenta: '#FF2D78',
  text:    '#E8E6FF',
  muted:   '#7B78A8',
};

/* ─── Animation variants ─────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

/* ─── Utility ────────────────────────────────────────────────────── */
function HudLine({ color = T.indigo }) {
  return <div style={{ height: 1, background: `linear-gradient(90deg,transparent,${color},transparent)`, opacity: 0.5 }} />;
}

function GlowDot({ color = T.cyan, size = 6 }) {
  return (
    <span style={{
      display: 'inline-block', width: size, height: size,
      borderRadius: '50%', background: color,
      boxShadow: `0 0 8px 2px ${color}`, flexShrink: 0,
    }} />
  );
}

function SectionLabel({ children, color = T.cyan }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      fontFamily: 'Orbitron, monospace', fontSize: 11, letterSpacing: '0.2em',
      color, textTransform: 'uppercase', marginBottom: 28,
    }}>
      <GlowDot color={color} />
      {children}
      <span style={{ flex: 1, height: 1, background: color, opacity: 0.25 }} />
    </div>
  );
}

function CountUp({ target, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 40;
    const id = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(id); }
      else setVal(Math.floor(start));
    }, 30);
    return () => clearInterval(id);
  }, [inView, target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

const scanlineStyle = {
  position: 'fixed', inset: 0, zIndex: 999, pointerEvents: 'none',
  background: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px)',
};

const btnStyle = (color) => ({
  fontFamily: 'Orbitron, monospace', fontSize: '0.7rem', letterSpacing: '0.1em',
  textTransform: 'uppercase', padding: '11px 22px', borderRadius: 4,
  border: `1px solid ${color}`, cursor: 'pointer', textDecoration: 'none',
  transition: 'all 0.2s', display: 'inline-block',
});

/* ─── NAV (with hamburger) ───────────────────────────────────────── */
function Nav({ personal }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // close menu on resize to desktop
  useEffect(() => {
    const fn = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  // lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const links = ['About', 'Skills', 'Projects', 'Experience', 'Contact'];

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 clamp(16px,5vw,80px)', height: 64,
          background: scrolled || menuOpen ? `${T.bg}F0` : 'transparent',
          borderBottom: scrolled || menuOpen ? `1px solid ${T.border}` : '1px solid transparent',
          backdropFilter: scrolled || menuOpen ? 'blur(16px)' : 'none',
          transition: 'background 0.3s, border-color 0.3s, backdrop-filter 0.3s',
        }}
      >
        {/* Logo */}
        <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.875rem', color: T.indigo, letterSpacing: '0.08em', zIndex: 201 }}>
          {personal.name.split(' ')[0]}<span style={{ color: T.cyan }}>_</span>
        </div>

        {/* Desktop links */}
        <div className="vr-nav-desktop" style={{ display: 'flex', gap: 28 }}>
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`}
              style={{ fontFamily: 'Orbitron, monospace', fontSize: 10, color: T.muted, textDecoration: 'none', letterSpacing: '0.1em', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = T.cyan}
              onMouseLeave={e => e.target.style.color = T.muted}
            >{l}</a>
          ))}
        </div>

        {/* Hamburger button (mobile) */}
        <button
          className="vr-hamburger"
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          style={{
            display: 'none',
            flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            gap: 5, width: 40, height: 40, background: 'transparent',
            border: `1px solid ${T.border}`, borderRadius: 6,
            cursor: 'pointer', zIndex: 201, padding: 0, flexShrink: 0,
          }}
        >
          {[0, 1, 2].map(i => (
            <motion.span
              key={i}
              animate={
                menuOpen
                  ? i === 0 ? { rotate: 45,  y: 10 }
                  : i === 1 ? { opacity: 0 }
                  :           { rotate: -45, y: -10 }
                  : { rotate: 0, y: 0, opacity: 1 }
              }
              transition={{ duration: 0.25 }}
              style={{ display: 'block', width: 20, height: 2, background: T.cyan, borderRadius: 99 }}
            />
          ))}
        </button>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, width: '75vw', maxWidth: 300,
              background: `${T.bg}F8`, borderLeft: `1px solid ${T.border}`,
              backdropFilter: 'blur(20px)', zIndex: 199,
              display: 'flex', flexDirection: 'column', justifyContent: 'center',
              padding: '80px 36px 40px',
            }}
          >
            {/* glow accent */}
            <div style={{ position: 'absolute', top: '20%', right: '-40px', width: 150, height: 150, borderRadius: '50%',
              background: `radial-gradient(circle, ${T.indigo}33, transparent 70%)`, pointerEvents: 'none' }} />

            <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 10, color: T.magenta, letterSpacing: '0.2em', marginBottom: 32 }}>
              // NAVIGATION
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {links.map((l, i) => (
                <motion.a
                  key={l}
                  href={`#${l.toLowerCase()}`}
                  onClick={handleLinkClick}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.35 }}
                  style={{
                    fontFamily: 'Orbitron, monospace', fontSize: '1rem', color: T.text,
                    textDecoration: 'none', letterSpacing: '0.08em', padding: '14px 0',
                    borderBottom: `1px solid ${T.border}`, display: 'flex',
                    alignItems: 'center', gap: 12, transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = T.cyan}
                  onMouseLeave={e => e.currentTarget.style.color = T.text}
                >
                  <span style={{ fontFamily: 'Orbitron, monospace', fontSize: 10, color: T.indigo }}>0{i + 1}</span>
                  {l}
                </motion.a>
              ))}
            </nav>

            <div style={{ marginTop: 40, fontFamily: 'Orbitron, monospace', fontSize: 10, color: T.muted, letterSpacing: '0.1em' }}>
              SYSTEM NOMINAL ●
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 198, background: 'rgba(0,0,0,0.5)' }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── HERO ───────────────────────────────────────────────────────── */
function Hero({ personal, stats, socials }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, -60]);

  return (
    <section style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      position: 'relative', overflow: 'hidden',
      padding: '80px clamp(16px,5vw,80px) 60px',
    }}>
      {/* ambient orbs */}
      <div style={{ position: 'absolute', top: '15%', left: '60%', width: 400, height: 400, borderRadius: '50%',
        background: `radial-gradient(circle,${T.indigo}22,transparent 70%)`, filter: 'blur(40px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: 250, height: 250, borderRadius: '50%',
        background: `radial-gradient(circle,${T.cyan}18,transparent 70%)`, filter: 'blur(40px)', pointerEvents: 'none' }} />

      {/* grid */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(${T.indigo}0D 1px,transparent 1px),linear-gradient(90deg,${T.indigo}0D 1px,transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      <motion.div style={{ y, zIndex: 1, width: '100%' }}>
        <motion.div initial="hidden" animate="show" variants={stagger}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
        >
          {/* avatar — mobile only, shows above text */}
          <motion.div
            variants={fadeUp}
            className="vr-avatar-mobile"
            style={{ display: 'none', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 32, alignSelf: 'center' }}
          >
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', inset: -4, borderRadius: '50%',
                border: `2px solid ${T.indigo}`, boxShadow: `0 0 20px ${T.indigo}88`,
                animation: 'spin 8s linear infinite',
              }} />
              <img src={personal.avatar} alt={personal.name || "Profile Avatar"}
                style={{ width: 110, height: 110, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{
              background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8,
              padding: '6px 14px', fontFamily: 'Orbitron, monospace', fontSize: 10, color: T.cyan, letterSpacing: '0.12em',
            }}>● ONLINE</div>
          </motion.div>

          <motion.div variants={fadeUp} style={{ marginBottom: 20 }}>
            <SectionLabel color={T.magenta}>VR Portfolio • Initialising</SectionLabel>
          </motion.div>

          <motion.h1 variants={fadeUp} style={{
            fontFamily: 'Orbitron, monospace', fontSize: 'clamp(2rem,7vw,5rem)',
            fontWeight: 900, lineHeight: 1.05, color: T.text, margin: 0,
          }}>
            {personal.name.split(' ').map((w, i) => (
              <span key={i} style={{ display: 'block', color: i % 2 === 1 ? T.indigo : T.text }}>{w}</span>
            ))}
          </motion.h1>

          <motion.p variants={fadeUp} style={{
            fontFamily: 'Inter, sans-serif', fontSize: 'clamp(0.9rem,2.2vw,1.2rem)',
            color: T.cyan, margin: '16px 0 8px', letterSpacing: '0.05em',
          }}>
            {personal.title}
          </motion.p>

          <motion.p variants={fadeUp} style={{
            fontFamily: 'Inter, sans-serif', color: T.muted,
            maxWidth: 520, lineHeight: 1.7, fontSize: 'clamp(0.875rem,1.5vw,1rem)', marginBottom: 32,
          }}>
            {personal.tagline}
          </motion.p>

          {/* stats */}
          <motion.div variants={fadeUp} style={{ display: 'flex', gap: 'clamp(16px,4vw,32px)', flexWrap: 'wrap', marginBottom: 36 }}>
            {[
              { label: 'Years Exp', val: stats.yearsExperience, suffix: '+' },
              { label: 'Projects',  val: stats.projectsCompleted, suffix: '' },
              { label: 'Clients',   val: stats.happyClients, suffix: '+' },
            ].map(s => (
              <div key={s.label} style={{ borderLeft: `2px solid ${T.indigo}`, paddingLeft: 14 }}>
                <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 'clamp(1.4rem,3.5vw,1.8rem)', color: T.text, fontWeight: 700 }}>
                  <CountUp target={s.val} suffix={s.suffix} />
                </div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', color: T.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.label}</div>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div variants={fadeUp} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href={socials.github} style={{ ...btnStyle(T.indigo), background: T.indigo, color: '#fff' }}>Enter Portfolio</a>
            <a href={`mailto:${socials.email}`} style={{ ...btnStyle(T.cyan), background: 'transparent', color: T.cyan, borderColor: T.cyan }}>Contact Me</a>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* avatar — desktop, absolute positioned */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="vr-avatar-desktop"
        style={{
          position: 'absolute', right: 'clamp(16px,6vw,80px)', top: '50%', transform: 'translateY(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
        }}
      >
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute', inset: -4, borderRadius: '50%',
            border: `2px solid ${T.indigo}`, boxShadow: `0 0 24px ${T.indigo}88`,
            animation: 'spin 8s linear infinite',
          }} />
          <img src={personal.avatar} alt={personal.name || "Profile Avatar"}
            style={{ width: 160, height: 160, borderRadius: '50%', objectFit: 'cover', display: 'block' }} />
        </div>
        <div style={{
          background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8,
          padding: '8px 16px', fontFamily: 'Orbitron, monospace', fontSize: 11, color: T.cyan, letterSpacing: '0.12em',
        }}>● ONLINE</div>
      </motion.div>
    </section>
  );
}

/* ─── ABOUT ──────────────────────────────────────────────────────── */
function About({ personal }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} style={{ padding: 'clamp(48px,8vw,120px) clamp(16px,5vw,80px)' }}>
      <HudLine />
      <motion.div
        initial="hidden" animate={inView ? 'show' : 'hidden'} variants={stagger}
        style={{ marginTop: 52 }}
      >
        {/* responsive grid: single col on mobile, two cols on desktop */}
        <div className="vr-about-grid">
          <motion.div variants={fadeUp}>
            <SectionLabel>About // Node_02</SectionLabel>
            <h2 style={{ fontFamily: 'Orbitron, monospace', fontSize: 'clamp(1.4rem,3.5vw,2.6rem)', color: T.text, margin: '0 0 20px' }}>
              Who <span style={{ color: T.indigo }}>I Am</span>
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', color: T.muted, lineHeight: 1.85, fontSize: 'clamp(0.875rem,1.5vw,1rem)' }}>
              {personal.bio}
            </p>
            <div style={{ marginTop: 20, fontFamily: 'Inter, sans-serif', color: T.cyan, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <GlowDot color={T.cyan} /> {personal.location}
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <div style={{
              background: T.surface, border: `1px solid ${T.border}`,
              borderRadius: 16, padding: 'clamp(20px,4vw,32px)', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%',
                background: `radial-gradient(circle,${T.magenta}33,transparent 70%)`,
              }} />
              <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 10, color: T.magenta, letterSpacing: '0.15em', marginBottom: 20 }}>
                // ROOM SCAN COMPLETE
              </div>
              {['Crafting pixel-perfect UIs', 'Building scalable APIs', 'Shipping fast, iterating faster', 'Open source enthusiast'].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 3 ? `1px solid ${T.border}` : 'none' }}>
                  <span style={{ fontFamily: 'Orbitron, monospace', fontSize: 11, color: T.indigo, minWidth: 28 }}>0{i + 1}</span>
                  <span style={{ fontFamily: 'Inter, sans-serif', color: T.text, fontSize: '0.875rem' }}>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/* ─── SKILLS ─────────────────────────────────────────────────────── */
function Skills({ skills }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const categories = [...new Set(skills.map(s => s.category))];

  return (
    <section ref={ref} style={{ padding: 'clamp(48px,8vw,120px) clamp(16px,5vw,80px)', background: `linear-gradient(180deg,transparent,${T.indigo}08,transparent)` }}>
      <HudLine />
      <motion.div initial="hidden" animate={inView ? 'show' : 'hidden'} variants={stagger} style={{ marginTop: 52 }}>
        <motion.div variants={fadeUp}>
          <SectionLabel color={T.magenta}>Skills // Node_03</SectionLabel>
          <h2 style={{ fontFamily: 'Orbitron, monospace', fontSize: 'clamp(1.4rem,3.5vw,2.6rem)', color: T.text, margin: '0 0 40px' }}>
            Tech <span style={{ color: T.indigo }}>Arsenal</span>
          </h2>
        </motion.div>

        {categories.map(cat => (
          <motion.div key={cat} variants={fadeUp} style={{ marginBottom: 36 }}>
            <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 10, color: T.cyan, letterSpacing: '0.15em', marginBottom: 16, opacity: 0.7 }}>
              [{cat}]
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {skills.filter(s => s.category === cat).map((skill, i) => (
                <motion.div
                  key={skill.name}
                  whileHover={{ scale: 1.05, boxShadow: `0 0 20px ${T.indigo}66` }}
                  style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: '10px 16px', cursor: 'default' }}
                >
                  <div style={{ fontFamily: 'Inter, sans-serif', color: T.text, fontSize: '0.8rem', marginBottom: 8 }}>{skill.name}</div>
                  <div style={{ height: 3, background: `${T.indigo}33`, borderRadius: 99, overflow: 'hidden', width: 90 }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
                      transition={{ delay: 0.2 + i * 0.05, duration: 0.8, ease: 'easeOut' }}
                      style={{ height: '100%', background: `linear-gradient(90deg,${T.indigo},${T.cyan})`, borderRadius: 99 }}
                    />
                  </div>
                  <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 9, color: T.muted, marginTop: 4 }}>{skill.level}%</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ─── PROJECTS ───────────────────────────────────────────────────── */
function Projects({ projects }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} style={{ padding: 'clamp(48px,8vw,120px) clamp(16px,5vw,80px)' }}>
      <HudLine />
      <motion.div initial="hidden" animate={inView ? 'show' : 'hidden'} variants={stagger} style={{ marginTop: 52 }}>
        <motion.div variants={fadeUp}>
          <SectionLabel>Projects // Node_04</SectionLabel>
          <h2 style={{ fontFamily: 'Orbitron, monospace', fontSize: 'clamp(1.4rem,3.5vw,2.6rem)', color: T.text, margin: '0 0 40px' }}>
            Mission <span style={{ color: T.indigo }}>Logs</span>
          </h2>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(320px,100%),1fr))', gap: 20 }}>
          {projects.map((p, i) => <ProjectCard key={i} project={p} index={i} inView={inView} />)}
        </div>
      </motion.div>
    </section>
  );
}

function ProjectCard({ project, index, inView }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        background: T.surface, border: `1px solid ${hovered ? T.indigo : T.border}`,
        borderRadius: 14, overflow: 'hidden', cursor: 'pointer',
        boxShadow: hovered ? `0 16px 48px ${T.indigo}33` : 'none',
        transition: 'border-color 0.25s, box-shadow 0.25s',
      }}
    >
      <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
        <img src={project.image} alt={project.title || "Project Screenshot"}
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: hovered ? 'brightness(0.7)' : 'brightness(0.5) saturate(0.6)', transition: 'filter 0.3s' }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg,transparent 30%,${T.bg})` }} />
        <div style={{
          position: 'absolute', top: 10, right: 10,
          fontFamily: 'Orbitron, monospace', fontSize: 9, color: T.cyan,
          background: `${T.bg}BB`, padding: '3px 8px', borderRadius: 4, border: `1px solid ${T.cyan}44`,
        }}>
          PROJ_{String(index + 1).padStart(2, '0')}
        </div>
      </div>
      <div style={{ padding: '16px 20px 20px' }}>
        <h3 style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.9rem', color: T.text, margin: '0 0 8px' }}>{project.title}</h3>
        <p style={{ fontFamily: 'Inter, sans-serif', color: T.muted, fontSize: '0.8rem', lineHeight: 1.7, margin: '0 0 14px' }}>{project.description}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {(project.techStack || []).map(t => (
            <span key={t} style={{
              fontFamily: 'Orbitron, monospace', fontSize: 9, color: T.indigo,
              background: `${T.indigo}18`, border: `1px solid ${T.indigo}44`,
              padding: '2px 8px', borderRadius: 4,
            }}>{t}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {project.liveUrl && <a href={project.liveUrl} style={{ fontFamily: 'Orbitron, monospace', fontSize: 9, color: T.cyan, textDecoration: 'none', letterSpacing: '0.1em' }}>↗ LIVE</a>}
          {project.githubUrl && <a href={project.githubUrl} style={{ fontFamily: 'Orbitron, monospace', fontSize: 9, color: T.muted, textDecoration: 'none', letterSpacing: '0.1em' }}>⌥ SOURCE</a>}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── EXPERIENCE ─────────────────────────────────────────────────── */
function Experience({ experience }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} style={{ padding: 'clamp(48px,8vw,120px) clamp(16px,5vw,80px)', background: `linear-gradient(180deg,transparent,${T.cyan}06,transparent)` }}>
      <HudLine />
      <motion.div initial="hidden" animate={inView ? 'show' : 'hidden'} variants={stagger} style={{ marginTop: 52 }}>
        <motion.div variants={fadeUp}>
          <SectionLabel color={T.magenta}>Experience // Node_05</SectionLabel>
          <h2 style={{ fontFamily: 'Orbitron, monospace', fontSize: 'clamp(1.4rem,3.5vw,2.6rem)', color: T.text, margin: '0 0 40px' }}>
            Career <span style={{ color: T.indigo }}>Timeline</span>
          </h2>
        </motion.div>

        <div style={{ position: 'relative', maxWidth: 760 }}>
          <div style={{ position: 'absolute', left: 14, top: 0, bottom: 0, width: 1, background: `linear-gradient(180deg,${T.indigo},${T.cyan}44)` }} />
          {experience.map((exp, i) => (
            <motion.div key={i} variants={fadeUp}
              style={{ display: 'flex', gap: 'clamp(20px,4vw,40px)', marginBottom: 32, paddingLeft: 'clamp(40px,8vw,60px)', position: 'relative' }}
            >
              <div style={{
                position: 'absolute', left: 6, top: 6, width: 16, height: 16, borderRadius: '50%',
                border: `2px solid ${T.indigo}`, background: T.bg, boxShadow: `0 0 10px ${T.indigo}88`,
              }} />
              <div style={{ flex: 1, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 'clamp(14px,3vw,24px)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                  <div>
                    <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 'clamp(0.8rem,1.5vw,0.95rem)', color: T.text }}>{exp.role}</div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: T.indigo, marginTop: 2 }}>{exp.company}</div>
                  </div>
                  <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 9, color: T.cyan, background: `${T.cyan}18`, padding: '4px 10px', borderRadius: 4, border: `1px solid ${T.cyan}33`, whiteSpace: 'nowrap' }}>
                    {exp.period}
                  </div>
                </div>
                <p style={{ fontFamily: 'Inter, sans-serif', color: T.muted, fontSize: '0.8rem', lineHeight: 1.7, margin: 0 }}>{exp.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ─── TESTIMONIALS ───────────────────────────────────────────────── */
function Testimonials({ testimonials }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [active, setActive] = useState(0);

  return (
    <section ref={ref} style={{ padding: 'clamp(48px,8vw,120px) clamp(16px,5vw,80px)' }}>
      <HudLine />
      <motion.div initial="hidden" animate={inView ? 'show' : 'hidden'} variants={stagger} style={{ marginTop: 52 }}>
        <motion.div variants={fadeUp}>
          <SectionLabel color={T.magenta}>Testimonials // Node_06</SectionLabel>
          <h2 style={{ fontFamily: 'Orbitron, monospace', fontSize: 'clamp(1.4rem,3.5vw,2.6rem)', color: T.text, margin: '0 0 40px' }}>
            Transmission <span style={{ color: T.indigo }}>Logs</span>
          </h2>
        </motion.div>
        <motion.div variants={fadeUp}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.35 }}
              style={{
                background: T.surface, border: `1px solid ${T.border}`,
                borderRadius: 16, padding: 'clamp(20px,4vw,48px)', maxWidth: 680, position: 'relative',
              }}
            >
              <div style={{ position: 'absolute', top: 16, right: 20, fontFamily: 'Orbitron, monospace', fontSize: 40, color: T.indigo, opacity: 0.12, lineHeight: 1 }}>❝</div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(0.9rem,2vw,1.1rem)', color: T.text, lineHeight: 1.8, margin: '0 0 24px', fontStyle: 'italic' }}>
                "{testimonials[active].text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <img src={testimonials[active].avatar} alt={testimonials[active].name || "Profile Avatar"}
                  style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${T.indigo}`, flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.8rem', color: T.text }}>{testimonials[active].name}</div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: T.muted }}>{testimonials[active].role}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setActive(i)} style={{
                width: i === active ? 26 : 8, height: 8, borderRadius: 99,
                background: i === active ? T.indigo : T.border,
                border: 'none', cursor: 'pointer', transition: 'all 0.3s',
                boxShadow: i === active ? `0 0 10px ${T.indigo}` : 'none',
              }} />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── CONTACT ────────────────────────────────────────────────────── */
function Contact({ personal, socials }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} style={{ padding: 'clamp(48px,8vw,120px) clamp(16px,5vw,80px)' }}>
      <HudLine />
      <motion.div initial="hidden" animate={inView ? 'show' : 'hidden'} variants={stagger} style={{ marginTop: 52, maxWidth: 620 }}>
        <motion.div variants={fadeUp}>
          <SectionLabel color={T.cyan}>Contact // Node_07</SectionLabel>
          <h2 style={{ fontFamily: 'Orbitron, monospace', fontSize: 'clamp(1.4rem,3.5vw,2.6rem)', color: T.text, margin: '0 0 14px' }}>
            Open a <span style={{ color: T.indigo }}>Channel</span>
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', color: T.muted, lineHeight: 1.7, marginBottom: 36, fontSize: 'clamp(0.875rem,1.5vw,1rem)' }}>
            Have a project in mind or just want to say hello? Transmission lines are open.
          </p>
        </motion.div>
        <motion.div variants={fadeUp}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(220px,100%),1fr))', gap: 12, marginBottom: 28 }}
        >
          {[
            { label: 'Email',    val: socials.email,    href: `mailto:${socials.email}`, color: T.cyan },
            { label: 'GitHub',   val: 'View Profile',   href: socials.github,            color: T.indigo },
            { label: 'LinkedIn', val: 'Connect',        href: socials.linkedin,          color: T.magenta },
            { label: 'Twitter',  val: 'Follow',         href: socials.twitter,           color: T.cyan },
          ].map(link => (
            <motion.a key={link.label} href={link.href}
              whileHover={{ scale: 1.02, borderColor: link.color }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: T.surface, border: `1px solid ${T.border}`,
                borderRadius: 10, padding: '14px 18px', textDecoration: 'none', transition: 'border-color 0.2s',
              }}
            >
              <GlowDot color={link.color} size={8} />
              <div>
                <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 9, color: T.muted, letterSpacing: '0.1em' }}>{link.label}</div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8rem', color: T.text }}>{link.val}</div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── FOOTER ─────────────────────────────────────────────────────── */
function Footer({ personal }) {
  return (
    <footer style={{ padding: '28px clamp(16px,5vw,80px)', borderTop: `1px solid ${T.border}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 10, color: T.muted, letterSpacing: '0.1em' }}>
          © {new Date().getFullYear()} {personal.name} // VR_ROOM_360
        </div>
        <div style={{ fontFamily: 'Orbitron, monospace', fontSize: 10, color: T.indigo, letterSpacing: '0.1em' }}>
          SYSTEM NOMINAL ●
        </div>
      </div>
    </footer>
  );
}

/* ─── ROOT ───────────────────────────────────────────────────────── */
export default function Virtual_Reality_Room_360() {
  const { portfolioData } = usePortfolio();
  const { personal, stats, socials, skills, projects, experience, testimonials } = portfolioData;

  return (
    <div style={{ background: T.bg, color: T.text, minHeight: '100vh', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@400;500;600&display=swap');

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${T.bg}; }
        ::-webkit-scrollbar-thumb { background: ${T.indigo}; border-radius: 99px; }

        /* ── Desktop: show desktop nav, hide hamburger & mobile avatar ── */
        .vr-nav-desktop  { display: flex !important; }
        .vr-hamburger    { display: none !important; }
        .vr-avatar-desktop { display: flex !important; }
        .vr-avatar-mobile  { display: none !important; }

        /* ── About grid: two columns on desktop ── */
        .vr-about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        /* ── Mobile breakpoint ── */
        @media (max-width: 768px) {
          .vr-nav-desktop    { display: none !important; }
          .vr-hamburger      { display: flex !important; }
          .vr-avatar-desktop { display: none !important; }
          .vr-avatar-mobile  { display: flex !important; }
          .vr-about-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
      `}</style>

      <div style={scanlineStyle} />
      <Nav personal={personal} />

      <main>
        <Hero personal={personal} stats={stats} socials={socials} />
        <div id="about"><About personal={personal} /></div>
        <div id="skills"><Skills skills={skills} /></div>
        <div id="projects"><Projects projects={projects} /></div>
        <div id="experience"><Experience experience={experience} /></div>
        <div id="contact"><Contact personal={personal} socials={socials} /></div>
        <Testimonials testimonials={testimonials} />
      </main>

      <Footer personal={personal} />
    </div>
  );
}

