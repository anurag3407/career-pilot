import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './Hero';
import About from './About';
import Projects from './Projects';
import Contact from './Contact';
import RunwayLookbook from './RunwayLookbook';
import ResumeCTA from './ResumeCTA';

const F = {
  bg: '#faf9f7', dark: '#0a0a0a', charcoal: '#1a1a1a',
  muted: '#6b6b6b', gold: '#c9a84c', border: '#e0dbd4',
};

const NAV_LINKS = [
  { id: 'hero',     label: 'Home' },
  { id: 'about',    label: 'About' },
  { id: 'lookbook', label: 'Lookbook' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact',  label: 'Contact' },
  { id: 'resume',   label: 'Resume' },
];

function NavBar({ active, onNav }) {
  const [open, setOpen] = useState(false);

  const handleNav = (id) => {
    onNav(id);
    setOpen(false);
  };

  // Close drawer on resize to desktop
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: F.bg, borderBottom: `1px solid ${F.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 1.25rem', height: '52px',
      }}>
        {/* Logo */}
        <span style={{
          fontFamily: 'serif', fontWeight: 900, fontSize: '0.95rem',
          letterSpacing: '0.18em', color: F.charcoal, textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>
          High Fashion
        </span>

        {/* Desktop links */}
        <div className="hidden md:flex" style={{ gap: '1.75rem' }}>
          {NAV_LINKS.map(({ id, label }) => (
            <button key={id} onClick={() => handleNav(id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: active === id ? F.gold : F.charcoal,
                borderBottom: active === id ? `2px solid ${F.gold}` : '2px solid transparent',
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
          <motion.span animate={{ rotate: open ? 45 : 0, y: open ? 6 : 0 }} transition={{ duration: 0.22 }}
            style={{ display: 'block', width: '22px', height: '2px', background: F.charcoal, transformOrigin: 'center' }} />
          <motion.span animate={{ opacity: open ? 0 : 1 }} transition={{ duration: 0.15 }}
            style={{ display: 'block', width: '22px', height: '2px', background: F.charcoal }} />
          <motion.span animate={{ rotate: open ? -45 : 0, y: open ? -6 : 0 }} transition={{ duration: 0.22 }}
            style={{ display: 'block', width: '22px', height: '2px', background: F.charcoal, transformOrigin: 'center' }} />
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', top: '52px', left: 0, right: 0, zIndex: 49,
              background: F.bg, borderBottom: `1px solid ${F.border}`,
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            }}>
            {NAV_LINKS.map(({ id, label }) => (
              <button key={id} onClick={() => handleNav(id)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '1rem 1.5rem',
                  background: 'none', border: 'none', cursor: 'pointer',
                  borderBottom: `1px solid ${F.border}`,
                  fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: active === id ? F.gold : F.charcoal,
                }}>
                {label}
                {active === id && (
                  <span style={{ width: '6px', height: '6px', background: F.gold, borderRadius: '50%' }} />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function HighFashion() {
  const [active, setActive] = useState('hero');

  const scrollTo = (id) => {
    setActive(id);
    const el = document.getElementById(`hf-${id}`);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ background: F.bg, fontFamily: "'Inter', sans-serif", minHeight: '100vh' }}>
      <NavBar active={active} onNav={scrollTo} />
      <section id="hf-hero"><Hero /></section>
      <section id="hf-about"><About /></section>
      <section id="hf-lookbook"><RunwayLookbook /></section>
      <section id="hf-projects"><Projects /></section>
      <section id="hf-contact"><Contact /></section>
      <section id="hf-resume"><ResumeCTA /></section>
    </div>
  );
}
