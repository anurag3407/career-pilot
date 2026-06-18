import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCommit, GitBranch, Loader2 } from 'lucide-react';
import { PortfolioProvider } from './PortfolioContext';
import NavBar from './NavBar';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Experience from './Experience';
import Projects from './Projects';
import Testimonials from './Testimonials';
import Contact from './Contact';

/**
 * Git Commit History Tree — Portfolio Template
 *
 * Category:    Developer / Engineer / Open Source
 * Description: An interactive portfolio that visualizes a developer's career
 *   journey as a real Git repository — featuring commit graphs, branch trees,
 *   pull requests, version tags, contribution heatmaps, and a terminal-style
 *   contact form. Inspired by GitHub Desktop, GitKraken, and VS Code Git Graph.
 *
 * Color Palette:
 *   Background  #0D1117  |  Cards   #161B22  |  Border  #30363D
 *   Green       #3FB950  |  Blue    #58A6FF  |  Purple  #BC8CFF
 *   Orange      #F0883E  |  Text    #C9D1D9
 *
 * Data: All portfolio data sourced exclusively from PortfolioContext.
 *   No hardcoded data. No prop drilling. No local JSON imports.
 */

/* ─── Repository loading animation ──────────────────────────── */
const LOAD_STEPS = [
  { text: 'Initializing repository…',   delay: 0,   color: 'text-[#8B949E]' },
  { text: 'Fetching commit history…',   delay: 400, color: 'text-[#58A6FF]' },
  { text: 'Resolving branch trees…',    delay: 750, color: 'text-[#58A6FF]' },
  { text: 'Checking out main branch…',  delay: 1050, color: 'text-[#3FB950]' },
  { text: 'Hydrating portfolio data…',  delay: 1300, color: 'text-[#3FB950]' },
  { text: '✓ Repository ready.',         delay: 1600, color: 'text-[#3FB950] font-semibold' },
];

function RepoLoader({ onDone }) {
  const [visible, setVisible] = useState([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const timers = LOAD_STEPS.map((step, i) =>
      setTimeout(() => {
        setVisible(v => [...v, i]);
        if (i === LOAD_STEPS.length - 1) {
          setTimeout(() => { setFinished(true); setTimeout(onDone, 400); }, 500);
        }
      }, step.delay + 100)
    );
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <AnimatePresence>
      {!finished && (
        <motion.div
          className="fixed inset-0 bg-[#0D1117] z-50 flex flex-col items-center justify-center gap-8 px-4"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#3FB950]/15 border border-[#3FB950]/30 flex items-center justify-center">
              <GitCommit size={20} className="text-[#3FB950]" />
            </div>
            <span className="font-mono text-white text-lg font-semibold">portfolio.git</span>
          </div>

          {/* Progress lines */}
          <div className="w-full max-w-sm space-y-1.5 font-mono text-sm">
            {LOAD_STEPS.map((step, i) =>
              visible.includes(i) ? (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-center gap-2 ${step.color}`}
                >
                  {i < visible.length - 1 || visible.length === LOAD_STEPS.length ? (
                    <GitBranch size={12} className="shrink-0" />
                  ) : (
                    <Loader2 size={12} className="shrink-0 animate-spin" />
                  )}
                  {step.text}
                </motion.div>
              ) : null
            )}
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-sm h-1 bg-[#21262D] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#3FB950] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(visible.length / LOAD_STEPS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Global styles injected via <style> ────────────────────── */
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

  .git-portfolio-root {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background-color: #0D1117;
    color: #C9D1D9;
    -webkit-font-smoothing: antialiased;
  }

  .git-portfolio-root *,
  .git-portfolio-root *::before,
  .git-portfolio-root *::after {
    box-sizing: border-box;
  }

  .git-portfolio-root ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .git-portfolio-root ::-webkit-scrollbar-track {
    background: #0D1117;
  }
  .git-portfolio-root ::-webkit-scrollbar-thumb {
    background: #30363D;
    border-radius: 3px;
  }
  .git-portfolio-root ::-webkit-scrollbar-thumb:hover {
    background: #484F58;
  }

  .git-portfolio-root ::selection {
    background: rgba(88, 166, 255, 0.25);
    color: #79C0FF;
  }

  /* Font mono override for <code> elements */
  .git-portfolio-root code,
  .git-portfolio-root .font-mono {
    font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Courier New', monospace;
  }
`;

/* ─── Shell wrapper ──────────────────────────────────────────── */
function GitShell({ children }) {
  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div className="git-portfolio-root bg-[#0D1117] min-h-screen overflow-x-hidden text-[#C9D1D9]">
        {children}
      </div>
    </>
  );
}

/* ─── Main export ────────────────────────────────────────────── */
export default function GitCommitHistoryTree({ portfolioData } = {}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <PortfolioProvider portfolioData={portfolioData}>
      <GitShell>
        {/* Loading overlay */}
        <RepoLoader onDone={() => setLoaded(true)} />

        {/* Main content */}
        <AnimatePresence>
          {loaded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <NavBar />
              <main id="main-content" className="pt-[72px]">
                <Hero />
                <About />
                <Skills />
                <Experience />
                <Projects />
                <Testimonials />
                <Contact />
              </main>

              {/* Footer */}
              <footer className="border-t border-[#30363D] bg-[#0D1117] py-8 px-4">
                <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#484F58]">
                  <div className="flex items-center gap-2">
                    <GitCommit size={12} className="text-[#3FB950]" />
                    <span>portfolio.git</span>
                    <span className="text-[#30363D]">·</span>
                    <span className="text-[#3FB950]">main</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>Built with React + Framer Motion</span>
                    <span className="text-[#30363D]">·</span>
                    <span>Git Commit History Tree Template</span>
                  </div>
                </div>
              </footer>
            </motion.div>
          )}
        </AnimatePresence>
      </GitShell>
    </PortfolioProvider>
  );
}
