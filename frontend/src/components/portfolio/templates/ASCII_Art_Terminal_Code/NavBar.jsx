import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Menu, X } from 'lucide-react';
import { usePortfolio, TERMINAL_THEMES } from './PortfolioContext';

const NAV_LINKS = [
  { id: 'hero',         label: '$ whoami'   },
  { id: 'about',        label: '$ about'    },
  { id: 'skills',       label: '$ skills'   },
  { id: 'projects',     label: '$ projects' },
  { id: 'experience',   label: '$ git log'  },
  { id: 'testimonials', label: '$ logs'     },
  { id: 'contact',      label: '$ connect'  },
];

export default function NavBar() {
  const { personal, theme, themeId, setThemeId } = usePortfolio();
  const [active,     setActive]     = useState('hero');
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const sections = NAV_LINKS.map(l => document.getElementById(l.id)).filter(Boolean);
      const current  = sections.find(s => {
        const r = s.getBoundingClientRect();
        return r.top <= 100 && r.bottom > 100;
      });
      if (current) setActive(current.id);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? 'bg-black/95' : 'bg-transparent'
        }`}
        style={{ borderBottom: scrolled ? `1px solid ${theme.navBorder}` : 'none' }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between font-mono text-xs">

          {/* Logo */}
          <button
            onClick={() => scrollTo('hero')}
            id="nav-logo"
            aria-label="Go to top"
            className="flex items-center gap-2 transition-colors"
            style={{ color: theme.primary }}
          >
            <Terminal size={14} />
            <span className="hidden sm:inline" style={{ color: theme.primaryDim }}>
              {personal.name.split(' ')[0].toLowerCase()}@portfolio
            </span>
            <span style={{ color: theme.primaryBright }}>:~$</span>
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1" role="list">
            {NAV_LINKS.map(link => (
              <button
                key={link.id}
                id={`nav-${link.id}`}
                onClick={() => scrollTo(link.id)}
                role="listitem"
                aria-current={active === link.id ? 'page' : undefined}
                className="px-3 py-1 transition-colors border text-xs"
                style={active === link.id ? {
                  color: theme.primaryBright,
                  borderColor: `${theme.border}99`,
                  backgroundColor: `${theme.primaryGlow}`,
                } : {
                  color: theme.primaryDim,
                  borderColor: 'transparent',
                }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right side: Color Picker + Mobile toggle */}
          <div className="flex items-center gap-2">

            {/* ── Terminal Color Picker ── */}
            <div
              className="flex items-center gap-1.5 px-2 py-1 rounded border font-mono text-xs"
              style={{ borderColor: `${theme.border}60`, backgroundColor: 'rgba(0,0,0,0.6)' }}
              title="Switch terminal color theme"
              role="group"
              aria-label="Terminal color themes"
            >
              <span style={{ color: theme.primaryDim }} className="text-[10px] hidden sm:inline tracking-widest">
                theme:
              </span>
              {Object.values(TERMINAL_THEMES).map(t => (
                <button
                  key={t.id}
                  id={`theme-btn-${t.id}`}
                  onClick={() => setThemeId(t.id)}
                  aria-label={`Switch to ${t.label} theme`}
                  aria-pressed={themeId === t.id}
                  title={t.label}
                  className="relative w-4 h-4 rounded-full transition-all duration-200 focus:outline-none"
                  style={{ backgroundColor: t.dot }}
                >
                  {/* Active ring */}
                  {themeId === t.id && (
                    <motion.span
                      layoutId="theme-ring"
                      className="absolute inset-0 rounded-full"
                      style={{
                        boxShadow: `0 0 0 2px #000, 0 0 0 3px ${t.dot}`,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Mobile hamburger */}
            <button
              id="nav-mobile-toggle"
              onClick={() => setMobileOpen(o => !o)}
              className="md:hidden transition-colors p-1"
              style={{ color: theme.primaryDim }}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="nav-mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed top-12 left-0 right-0 z-30 bg-black/97 font-mono text-xs"
            style={{ borderBottom: `1px solid ${theme.navBorder}` }}
            role="dialog"
            aria-label="Mobile navigation"
          >
            <div className="px-4 py-3 space-y-0.5">
              {NAV_LINKS.map(link => (
                <button
                  key={link.id}
                  id={`nav-mobile-${link.id}`}
                  onClick={() => scrollTo(link.id)}
                  className="w-full text-left px-3 py-2 transition-colors"
                  style={active === link.id
                    ? { color: theme.primaryBright, backgroundColor: theme.primaryGlow }
                    : { color: theme.primaryDim }
                  }
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
