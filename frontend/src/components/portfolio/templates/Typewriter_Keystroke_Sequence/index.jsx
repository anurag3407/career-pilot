import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../../../../context/PortfolioContext';
import GlobalStyles from './GlobalStyles';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Testimonials from './Testimonials';
import Contact from './Contact';
import { C } from './hooks';
import { Github, Linkedin, Twitter } from 'lucide-react';

// ── Typewriter Roller (top bar) ───────────────────────────────────────────────
function TypewriterRoller() {
  return (
    <div className="tks-roller" role="presentation" aria-hidden="true">
      <div className="tks-roller-knob" />
      <div className="tks-roller-bar">
        <div className="tks-paper-feed" />
      </div>
      <span className="tks-roller-text">Typewriter Keystroke Sequence</span>
      <div className="tks-roller-bar">
        <div className="tks-paper-feed" style={{ animationDelay: '-4s' }} />
      </div>
      <div className="tks-roller-knob" />
    </div>
  );
}

// ── Navigation ────────────────────────────────────────────────────────────────
const NAV_SECTIONS = ['About', 'Skills', 'Projects', 'Experience', 'Testimonials', 'Contact'];

function Navbar({ name, onScrollTo }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="tks-nav" role="navigation" aria-label="Main navigation">
        {/* Brand */}
        <button
          className="tks-nav-brand"
          onClick={() => onScrollTo('hero')}
          aria-label="Back to top"
        >
          {name.split(' ')[0]}
        </button>

        {/* Desktop links */}
        <div className="tks-nav-links" role="list">
          {NAV_SECTIONS.map(s => (
            <button
              key={s}
              className="tks-nav-link"
              onClick={() => onScrollTo(s.toLowerCase())}
              role="listitem"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 4, display: 'none',
          }}
          className="tks-hamburger-btn"
        >
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 20, height: 2,
              background: i === 1 ? C.deepRed : C.inkGray,
              margin: '4px 0',
              transition: 'all 0.2s',
              transform: menuOpen
                ? i === 0 ? 'rotate(45deg) translate(3px, 5px)'
                : i === 2 ? 'rotate(-45deg) translate(3px, -5px)'
                : 'none'
                : 'none',
              opacity: menuOpen && i === 1 ? 0 : 1,
            }} />
          ))}
        </button>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'sticky',
              top: 80, // roller(28) + nav(52)
              zIndex: 89,
              background: `${C.vintageCream}f8`,
              borderBottom: `1px solid ${C.border}`,
              padding: '8px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              backdropFilter: 'blur(4px)',
            }}
            role="menu"
          >
            {NAV_SECTIONS.map(s => (
              <button
                key={s}
                className="tks-nav-link"
                onClick={() => { onScrollTo(s.toLowerCase()); setMenuOpen(false); }}
                style={{ textAlign: 'left', padding: '8px 0' }}
                role="menuitem"
              >
                <span style={{ color: C.deepRed, marginRight: 8 }}>&gt;</span>
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hamburger responsive style */}
      <style>{`
        @media (max-width: 767px) {
          .tks-hamburger-btn { display: block !important; }
          .tks-nav-links { display: none !important; }
        }
      `}</style>
    </>
  );
}

// ── Section divider ───────────────────────────────────────────────────────────
function SectionRule({ sym = '* * *', alt = false }) {
  return (
    <hr
      className={`tks-rule${alt ? ' tks-rule-alt' : ''}`}
      data-sym={sym}
      aria-hidden="true"
    />
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer({ data }) {
  return (
    <footer
      style={{
        background: C.vintageCream,
        borderTop: `2px solid ${C.border}`,
        padding: '20px 48px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <div>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 10,
          color: C.warmBrown,
          letterSpacing: 2,
        }}>
          © {new Date().getFullYear()} {data.personal.name} &nbsp;—&nbsp;
          <span style={{ color: C.border }}>EOF</span>
        </span>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 9,
          color: C.border,
          letterSpacing: 1,
          marginTop: 2,
        }}>
          crafted with Typewriter_Keystroke_Sequence template
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {data.socials?.github   && <a href={data.socials.github}   className="tks-social" target="_blank" rel="noreferrer" aria-label="GitHub"><Github   size={14} /></a>}
        {data.socials?.linkedin && <a href={data.socials.linkedin} className="tks-social" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={14} /></a>}
        {data.socials?.twitter  && <a href={data.socials.twitter}  className="tks-social" target="_blank" rel="noreferrer" aria-label="Twitter"><Twitter  size={14} /></a>}
      </div>
    </footer>
  );
}

// ── Root Component ────────────────────────────────────────────────────────────
export default function TypewriterKeystrokeSequence() {
  const { portfolioData: data } = usePortfolio();
  if (!data) return null;

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="tks-root">
      {/* SEO meta */}
      <title>{data.personal.name} — Portfolio</title>
      <meta name="description" content={`Portfolio of ${data.personal.name} — ${data.personal.title}`} />

      {/* Styles */}
      <GlobalStyles />

      {/* Paper texture overlay */}
      <div className="tks-paper-texture" aria-hidden="true" />

      {/* ── Typewriter roller (sticky top chrome) ── */}
      <TypewriterRoller />

      {/* ── Navigation ── */}
      <Navbar name={data.personal.name} onScrollTo={scrollTo} />

      {/* ── Main content ── */}
      <main id="main-content">
        {/* Hero */}
        <Hero data={data} onScrollTo={scrollTo} />

        <SectionRule sym="— ✦ —" />

        {/* About */}
        <About data={data} />

        <SectionRule sym="* * *" alt />

        {/* Skills */}
        <Skills skills={data.skills} />

        <SectionRule sym="— — —" />

        {/* Projects */}
        <Projects projects={data.projects} />

        <SectionRule sym="* * *" alt />

        {/* Experience */}
        <Experience experience={data.experience} />

        <SectionRule sym="— — —" />

        {/* Testimonials */}
        <Testimonials testimonials={data.testimonials} />

        <SectionRule sym="✦ ✦ ✦" />

        {/* Contact */}
        <Contact data={data} />
      </main>

      {/* ── Footer ── */}
      <Footer data={data} />
    </div>
  );
}
