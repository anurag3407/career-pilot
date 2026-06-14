import React from 'react';
import { PortfolioProvider, usePortfolio } from './PortfolioContext';
import NavBar from './NavBar';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Testimonials from './Testimonials';
import Contact from './Contact';

/**
 * ASCII Art Terminal Code — Portfolio Template
 *
 * Category: Developer / Hacker / Retro
 * Description: A full-screen Linux terminal experience featuring ASCII art,
 * matrix rain, git commit history, animated skill bars, and command-line
 * interactions. Built with Tailwind CSS, Framer Motion & Lucide React.
 *
 * Data: All portfolio data sourced exclusively from PortfolioContext.
 */

// Inner shell reads theme from context and injects CSS vars + overrides
function TerminalShell({ children }) {
  const { theme } = usePortfolio();
  const p  = theme.primary;
  const pd = theme.primaryDim;
  const pb = theme.primaryBright;
  const pg = theme.primaryGlow;
  const b  = theme.border;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');

        /* ── Root & CSS Variables ──────────────────────────────── */
        .ascii-terminal-root {
          font-family: 'JetBrains Mono', 'Courier New', monospace;
          background: #000;
          color: ${p};
          --term-primary:        ${p};
          --term-primary-dim:    ${pd};
          --term-primary-bright: ${pb};
          --term-primary-glow:   ${pg};
          --term-border:         ${b};
          --term-scanline:       ${theme.scanline};
        }
        .ascii-terminal-root * { box-sizing: border-box; }

        /* ── Override ALL hardcoded green Tailwind classes ─────── */
        /* text colours */
        .ascii-terminal-root .text-green-300  { color: ${pb} !important; }
        .ascii-terminal-root .text-green-400  { color: ${p}  !important; }
        .ascii-terminal-root .text-green-500  { color: ${p}  !important; }
        .ascii-terminal-root .text-green-600  { color: ${pd} !important; }
        .ascii-terminal-root .text-green-700  { color: ${pd} !important; }
        .ascii-terminal-root .text-green-800  { color: ${b}  !important; }
        .ascii-terminal-root .text-green-900  { color: ${b}  !important; }

        /* SVG fill */
        .ascii-terminal-root .fill-green-400  { fill: ${p}  !important; }
        .ascii-terminal-root .fill-green-500  { fill: ${p}  !important; }

        /* borders */
        .ascii-terminal-root .border-green-400  { border-color: ${p}  !important; }
        .ascii-terminal-root .border-green-500  { border-color: ${p}  !important; }
        .ascii-terminal-root .border-green-600  { border-color: ${pd} !important; }
        .ascii-terminal-root .border-green-700  { border-color: ${pd} !important; }
        .ascii-terminal-root .border-green-800  { border-color: ${b}  !important; }
        .ascii-terminal-root .border-green-900  { border-color: ${b}  !important; }
        .ascii-terminal-root .border-green-950  { border-color: ${theme.primaryDeep} !important; }

        /* backgrounds */
        .ascii-terminal-root .bg-green-400\\/10 { background-color: ${pg} !important; }
        .ascii-terminal-root .bg-green-500\\/10 { background-color: ${pg} !important; }
        .ascii-terminal-root .bg-green-500\\/20 { background-color: ${pg} !important; }
        .ascii-terminal-root .bg-green-900\\/30 { background-color: rgba(0,0,0,0.3) !important; }
        .ascii-terminal-root .bg-green-950      { background-color: ${theme.primaryDeep} !important; }
        .ascii-terminal-root .bg-green-950\\/30 { background-color: ${pg} !important; }
        .ascii-terminal-root .bg-green-950\\/50 { background-color: ${pg} !important; }

        /* ring / shadow / glow utilities */
        .ascii-terminal-root .ring-green-500   { --tw-ring-color: ${p};  }
        .ascii-terminal-root .shadow-green-500 { --tw-shadow-color: ${p}; }

        /* hover variants */
        .ascii-terminal-root .hover\\:text-green-300:hover  { color: ${pb} !important; }
        .ascii-terminal-root .hover\\:text-green-400:hover  { color: ${p}  !important; }
        .ascii-terminal-root .hover\\:text-green-500:hover  { color: ${p}  !important; }
        .ascii-terminal-root .hover\\:border-green-500:hover { border-color: ${p} !important; }
        .ascii-terminal-root .hover\\:bg-green-500\\/20:hover { background-color: ${pg} !important; }

        /* ── Animations ──────────────────────────────────────────── */
        @keyframes termBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }

        /* ── Scrollbar ───────────────────────────────────────────── */
        .ascii-terminal-root::-webkit-scrollbar       { width: 6px; }
        .ascii-terminal-root::-webkit-scrollbar-track  { background: #000; }
        .ascii-terminal-root::-webkit-scrollbar-thumb  { background: ${theme.scrollThumb}; }
        .ascii-terminal-root::-webkit-scrollbar-thumb:hover { background: ${theme.scrollThumbHover}; }

        /* ── Selection ───────────────────────────────────────────── */
        .ascii-terminal-root ::selection {
          background: ${pg};
          color:      ${pb};
        }
      `}</style>

      <div className="ascii-terminal-root bg-black min-h-screen overflow-x-hidden">
        {/* Ambient scanline sweep */}
        <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-50 overflow-hidden opacity-5">
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '3px',
            background: `linear-gradient(to bottom, transparent, ${theme.scanline}, transparent)`,
            animation: 'scanline 8s linear infinite',
          }} />
        </div>

        {children}
      </div>
    </>
  );
}

export default function ASCIIArtTerminalCode() {
  return (
    <PortfolioProvider>
      <TerminalShell>
        <NavBar />
        <main id="main-content" className="pt-12">
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Testimonials />
          <Contact />
        </main>
      </TerminalShell>
    </PortfolioProvider>
  );
}
