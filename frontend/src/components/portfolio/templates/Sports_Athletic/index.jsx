import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './Hero';
import About from './About';
import TrophyCabinet from './TrophyCabinet';
import Projects from './Projects';
import Contact from './Contact';
import ResumeCTA from './ResumeCTA';

const S = {
  bg: '#0a0a0a', red: '#e11d48', white: '#f8fafc',
  muted: '#94a3b8', gold: '#f59e0b', border: '#1e1e1e',
};

const NAV_LINKS = [
  { id: 'hero',     label: 'Home' },
  { id: 'about',    label: 'About' },
  { id: 'trophies', label: 'Trophies' },
  { id: 'projects', label: 'Projects' },
  { id: 'resume',   label: 'Resume' },
  { id: 'contact',  label: 'Contact' },
];

function NavBar({ active, onNav }) {
  const [open, setOpen] = useState(false);

  const handleNav = (id) => { onNav(id); setOpen(false); };

  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: S.bg, borderBottom: `1px solid ${S.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 1.25rem', height: '52px',
      }}>
        {/* Logo */}
        <span style={{
          fontWeight: 900, fontSize: '0.85rem', letterSpacing: '0.2em',
          color: S.white, textTransform: 'uppercase', whiteSpace: 'nowrap',
        }}>
          <span style={{ color: S.red }}>M</span>ARCUS
        </span>

        {/* Desktop links */}
        <div className="hidden md:flex" style={{ gap: '1.75rem' }}>
          {NAV_LINKS.map(({ id, label }) => (
            <button key={id} onClick={() => handleNav(id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: active === id ? S.red : S.muted,
                borderBottom: active === id ? `2px solid ${S.red}` : '2px solid transparent',
                paddingBottom: '2px', transition: 'color 0.2s, border-color 0.2s',
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center gap-[5px] w-9 h-9"
          onClick={() => setOpen(o => !o)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
          aria-label="Menu">
          <motion.span animate={{ rotate: open ? 45 : 0, y: open ? 7 : 0 }} transition={{ duration: 0.22 }}
            style={{ display: 'block', width: '22px', height: '2px', background: S.white, transformOrigin: 'center' }} />
          <motion.span animate={{ opacity: open ? 0 : 1 }} transition={{ duration: 0.15 }}
            style={{ display: 'block', width: '22px', height: '2px', background: S.white }} />
          <motion.span animate={{ rotate: open ? -45 : 0, y: open ? -7 : 0 }} transition={{ duration: 0.22 }}
            style={{ display: 'block', width: '22px', height: '2px', background: S.white, transformOrigin: 'center' }} />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', top: '52px', left: 0, right: 0, zIndex: 49,
              background: S.bg, borderBottom: `1px solid ${S.border}`,
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}>
            {NAV_LINKS.map(({ id, label }) => (
              <button key={id} onClick={() => handleNav(id)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '1rem 1.5rem',
                  background: 'none', border: 'none', cursor: 'pointer',
                  borderBottom: `1px solid ${S.border}`,
                  fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: active === id ? S.red : S.muted,
                }}>
                {label}
                {active === id && <span style={{ width: '6px', height: '6px', background: S.red, borderRadius: '50%' }} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function SportsAthletic() {
  const [active, setActive] = useState('hero');
  const containerRef = useRef(null);

  const scrollTo = (id) => {
    setActive(id);
    const container = containerRef.current;
    if (!container) return;
    const el = container.querySelector(`#sa-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} style={{ background: S.bg, fontFamily: "'Inter', sans-serif", minHeight: '100vh' }}>
      <NavBar active={active} onNav={scrollTo} />
      <section id="sa-hero"><Hero /></section>
      <section id="sa-about"><About /></section>
      <section id="sa-trophies"><TrophyCabinet /></section>
      <section id="sa-projects"><Projects /></section>
      <section id="sa-resume"><ResumeCTA /></section>
      <section id="sa-contact"><Contact /></section>
    </div>
  );
}
