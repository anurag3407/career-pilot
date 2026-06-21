import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, Star, GitFork, Eye, Menu, X, GitCommit } from 'lucide-react';
import { usePortfolio } from './PortfolioContext';

const NAV_LINKS = [
  { id: 'hero',         label: 'Code',        icon: '{ }' },
  { id: 'about',        label: 'About',        icon: '<>' },
  { id: 'skills',       label: 'Tags',         icon: '#' },
  { id: 'experience',   label: 'Commits',      icon: '●' },
  { id: 'projects',     label: 'Branches',     icon: '⎇' },
  { id: 'testimonials', label: 'Pull Requests', icon: 'PR' },
  { id: 'contact',      label: 'Remotes',      icon: '~' },
];

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export default function NavBar() {
  const { portfolioData } = usePortfolio();
  const { personal, stats } = portfolioData;
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive]   = useState('hero');
  const [menuOpen, setMenuOpen] = useState(false);

  const username = personal.name
    ?.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '') || 'developer';

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const sections = NAV_LINKS.map(l => document.getElementById(l.id)).filter(Boolean);
      const current = sections.reduce((acc, sec) => {
        return sec.getBoundingClientRect().top <= 120 ? sec.id : acc;
      }, 'hero');
      setActive(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0D1117]/95 backdrop-blur-md border-b border-[#30363D]'
          : 'bg-[#0D1117] border-b border-[#30363D]'
      }`}
      role="banner"
    >
      {/* Top breadcrumb bar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-[#21262D] text-xs font-mono text-[#8B949E]">
        <GitCommit size={12} className="text-[#3FB950]" />
        <span className="text-[#58A6FF] hover:underline cursor-pointer" onClick={() => scrollTo('hero')}>
          {username}
        </span>
        <span>/</span>
        <span className="text-white font-semibold">portfolio</span>
        <span className="ml-2 text-[#3FB950] border border-[#3FB950]/30 px-1.5 py-0.5 rounded-full text-[10px]">
          Public
        </span>

        {/* Star / Fork / Watch counts */}
        <div className="ml-auto flex items-center gap-3">
          <div className="flex items-center gap-1 hover:text-white cursor-pointer">
            <Eye size={12} /> <span>{stats?.happyClients || 32}</span>
          </div>
          <div className="flex items-center gap-1 hover:text-white cursor-pointer">
            <Star size={12} /> <span>{stats?.projectsCompleted || 48}</span>
          </div>
          <div className="flex items-center gap-1 hover:text-white cursor-pointer">
            <GitFork size={12} /> <span>{stats?.yearsExperience || 5}</span>
          </div>
        </div>
      </div>

      {/* Nav tabs */}
      <nav className="flex items-center justify-between px-4" aria-label="Repository navigation">
        {/* Desktop tabs */}
        <div className="hidden md:flex items-center" role="tablist">
          {NAV_LINKS.map(link => (
            <button
              key={link.id}
              role="tab"
              aria-selected={active === link.id}
              onClick={() => { scrollTo(link.id); setActive(link.id); }}
              id={`nav-tab-${link.id}`}
              className={`
                relative flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition-colors
                ${active === link.id
                  ? 'text-white border-b-2 border-[#F0883E]'
                  : 'text-[#8B949E] hover:text-white border-b-2 border-transparent'
                }
              `}
            >
              <span className="text-[#8B949E] text-xs">{link.icon}</span>
              {link.label}
            </button>
          ))}
        </div>

        {/* Branch pill */}
        <div className="hidden md:flex items-center gap-2 py-2">
          <div className="flex items-center gap-1.5 bg-[#161B22] border border-[#30363D] rounded-md px-3 py-1.5 text-xs font-mono text-[#3FB950]">
            <GitBranch size={12} />
            <span>main</span>
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-[#8B949E] hover:text-white"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#0D1117] border-t border-[#30363D]"
          >
            {NAV_LINKS.map(link => (
              <button
                key={link.id}
                onClick={() => { scrollTo(link.id); setMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left border-b border-[#21262D] transition-colors
                  ${active === link.id ? 'text-white bg-[#161B22]' : 'text-[#8B949E] hover:text-white hover:bg-[#161B22]/50'}`}
              >
                <span className="text-[#8B949E] w-6 text-xs font-mono">{link.icon}</span>
                {link.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
