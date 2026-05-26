import React, { useEffect, useRef } from 'react';
import { ArrowUpRight, ExternalLink } from 'lucide-react';

/**
 * @component AboutSection
 * @description A premium, editorial-style "About" section built with the Warm Obsidian & Gold Leaf design system.
 * @returns {React.ReactElement} The rendered About section.
 */

// ── Content Configuration
const PERSON = {
  firstName: "Alex",
  lastName: "Rivera",
  role: "Principal Engineer",
  tagline: "Building products people reach for without thinking.",
  bio1: "I write software with a designer's eye, focusing on system responsiveness, clean architecture, and delightful micro-interactions. Over the past decade, I've led engineering teams at high-growth startups and design-led technology companies.",
  bio2: "Outside of writing production code, I'm dedicated to mentoring designers who code and engineers who design. I believe that the screen is a physical medium, and code is our chisel."
};

const STATS = [
  { number: "07+", label: "Years in the craft" },
  { number: "40k+", label: "Engineers reached via OSS" },
  { number: "12", label: "Products shipped to production" }
];

const EXPERTISE = [
  "React",
  "System Design",
  "TypeScript",
  "Distributed Systems",
  "DX",
  "Web Assembly",
  "WebGL"
];

const CURRENTLY = {
  project: "→ Building CraftOS — a workspace for creative engineers",
  date: "Mar 2025"
};

// ── Sub-components

/**
 * @component StatItem
 * @description Renders a single statistic block with custom indentation and hover transition.
 */
function StatItem({ number, label, isIndented }) {
  return (
    <div className={`group/stat flex flex-col items-start ${isIndented ? 'pl-8' : 'pl-0'} pb-6 border-b border-[rgba(224,185,106,0.1)] last:pb-0 last:border-b-0`}>
      <div className="font-display-custom italic text-[clamp(2.8rem,5vw,3.5rem)] text-[var(--primary-accent)] group-hover/stat:text-[var(--secondary-accent)] transition-colors duration-200 leading-none">
        {number}
      </div>
      <div className="font-mono-custom text-[0.625rem] tracking-[0.2em] uppercase text-[var(--text-muted)] mt-2">
        {label}
      </div>
    </div>
  );
}

/**
 * @component CurrentlyCard
 * @description Ambient card showing current live project status with a pulsing coral accent.
 */
function CurrentlyCard({ project, date }) {
  return (
    <div className="glass-panel border-l-2 border-l-[var(--secondary-accent)] hover:border-l-[var(--secondary-accent)] p-4 w-full">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--secondary-accent)] animate-pulse" />
        <span className="font-mono-custom text-[0.625rem] tracking-[0.2em] uppercase text-[var(--text-muted)]">CURRENTLY</span>
      </div>
      <div className="font-body-custom text-sm text-[var(--text-primary)] font-light mb-1">
        {project}
      </div>
      <div className="font-mono-custom text-[0.625rem] text-[var(--text-secondary)] flex justify-between items-center">
        <span>Last updated {date}</span>
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 hover:text-[var(--primary-accent)] transition-colors focus-visible:ring-2 focus-visible:ring-[var(--primary-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0B08] outline-none rounded-sm"
        >
          <span className="sr-only">Stealth Repository</span>
          <ExternalLink size={10} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

/**
 * @component ExpertiseTags
 * @description Renders a minimal taxonomy tag cloud with clean line wrapping and word-level hover state transitions.
 */
function ExpertiseTags({ items }) {
  return (
    <div className="flex flex-wrap items-center gap-[0.5rem] font-mono-custom text-[0.9375rem] text-[var(--text-secondary)] tracking-wide leading-relaxed">
      {items.map((item, index) => (
        <React.Fragment key={item}>
          <span className="expertise-tag cursor-default inline-block hover:text-[var(--primary-accent)] transition-colors duration-150">
            {item}
          </span>
          {index < items.length - 1 && (
            <span className="text-[rgba(224,185,106,0.3)] select-none" aria-hidden="true">·</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/**
 * @component CTARow
 * @description CTA buttons row including primary filled sharp button and secondary text link with custom animated underline.
 */
function CTARow() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8 items-start">
      <a
        href="#work"
        className="cta-primary inline-block font-mono-custom text-sm font-medium tracking-widest uppercase bg-[var(--primary-accent)] text-[#0D0B08] px-8 py-3 rounded-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0B08]"
      >
        See My Work →
      </a>
      <a
        href="#case-studies"
        className="cta-secondary group inline-flex items-center gap-1.5 font-mono-custom text-sm tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0B08]"
      >
        <span className="cta-secondary-underline">Read Case Studies</span>
        <ArrowUpRight size={14} className="text-[var(--primary-accent)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
      </a>
    </div>
  );
}

// ── Main Export
export default function AboutSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const currentSection = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          currentSection.classList.add('visible');
        }
      },
      { threshold: 0.1 }
    );
    if (currentSection) {
      observer.observe(currentSection);
    }
    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby="about-heading"
      className="reveal-section relative w-full min-h-screen bg-[#0D0B08] text-[var(--text-secondary)] px-6 py-20 lg:py-32 overflow-hidden flex items-center justify-center font-body-custom"
    >
      {/* ── Document Head & Custom Style Injector */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:ital,wght@1,400;1,700&display=swap');
        
        :root {
          --bg-root: #0D0B08;
          --surface-l1: #151210;
          --surface-l2: #1E1A14;
          --primary-accent: #E0B96A;
          --secondary-accent: #E8724A;
          --tertiary-accent: #8FA68E;
          --text-primary: #FAF6EE;
          --text-secondary: #ADA393;
          --text-muted: #B0A090;
          --border-subtle: rgba(224, 185, 106, 0.18);
          --border-emphasis: rgba(224, 185, 106, 0.38);
          
          --font-display: 'Playfair Display', Georgia, serif;
          --font-body: 'Inter', system-ui, sans-serif;
          --font-mono: 'JetBrains Mono', monospace;
        }
        
        .font-display-custom {
          font-family: var(--font-display);
        }
        
        .font-body-custom {
          font-family: var(--font-body);
        }
        
        .font-mono-custom {
          font-family: var(--font-mono);
        }

        .animated-underline-path {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: drawUnderline 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards;
        }

        @keyframes drawUnderline {
          to {
            stroke-dashoffset: 0;
          }
        }

        .spin-slow-custom {
          animation: spin-slow 40s linear infinite;
          transform-origin: center;
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .reveal-section {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .reveal-section.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .cta-primary {
          transition: transform 150ms ease, box-shadow 150ms ease;
        }
        
        .cta-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 28px rgba(224, 185, 106, 0.30);
        }
        
        .cta-primary:active {
          transform: translateY(-1px) scale(0.99);
        }

        .cta-secondary {
          color: var(--text-secondary);
          transition: color 250ms ease;
        }
        
        .cta-secondary:hover {
          color: var(--text-primary);
        }

        .cta-secondary-underline {
          position: relative;
        }
        
        .cta-secondary-underline::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 1px;
          background-color: var(--primary-accent);
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 400ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .cta-secondary:hover .cta-secondary-underline::after {
          transform: scaleX(1);
          transform-origin: left;
        }

        .glass-panel {
          background: rgba(28, 24, 18, 0.82);
          backdrop-filter: blur(12px) saturate(150%);
          border: 1px solid var(--border-subtle);
          box-shadow: inset 0 1px 0 rgba(224, 185, 106, 0.08);
          border-radius: 4px;
          transition: border-color 300ms ease, box-shadow 300ms ease;
        }

        .glass-panel:hover {
          border-color: var(--border-emphasis);
        }

        .noise-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          filter: url(#noise-filter);
          opacity: 0.03;
          pointer-events: none;
          z-index: 1;
        }
      `}} />

      {/* ── Background Stack (Layers 2, 3, 4) */}
      <svg className="sr-only" aria-hidden="true">
        <filter id="noise-filter">
          <feTurbulence type="fractalNoise" baseFrequency="0.80" numOctaves="4" stitchTiles="stitch" />
        </filter>
      </svg>
      <div className="noise-bg" aria-hidden="true" />
      
      {/* Spotlight Radial Gradients */}
      <div 
        className="absolute inset-0 pointer-events-none z-0" 
        style={{
          backgroundImage: `
            radial-gradient(ellipse 60% 50% at 15% 20%, rgba(224, 185, 106, 0.07) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 85% 85%, rgba(232, 114, 74, 0.04) 0%, transparent 70%)
          `
        }} 
        aria-hidden="true" 
      />

      {/* ── Content Grid */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[58%_minmax(0,1fr)] gap-16 lg:gap-20 items-start">
        
        {/* ── LEFT COLUMN (Narrative) */}
        <div className="flex flex-col gap-8 md:gap-10">
          
          {/* Block 1 — Eyebrow */}
          <div className="flex items-center gap-3 font-mono-custom text-[0.625rem] tracking-[0.25em] uppercase">
            <span className="w-6 h-[1px] bg-[rgba(224,185,106,0.2)]" aria-hidden="true" />
            <span>
              <span className="text-[var(--primary-accent)]">✦</span>{' '}
              <span className="text-[var(--text-muted)]">{PERSON.role} №001</span>
            </span>
          </div>

          {/* Block 2 — Name */}
          <header>
            <h1 
              id="about-heading" 
              className="font-display-custom italic text-[clamp(2.5rem,7vw,5rem)] leading-none tracking-tight text-[var(--text-secondary)] flex flex-wrap items-baseline gap-x-4"
            >
              <span className="font-light">{PERSON.firstName}</span>
              <span className="relative text-[var(--text-primary)] font-bold pb-2">
                {PERSON.lastName}
                <span className="absolute left-0 -bottom-1 w-full h-3 overflow-visible pointer-events-none">
                  <svg className="w-full h-full" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">
                    <path
                      className="animated-underline-path"
                      d="M2,6 C30,3 70,8 98,4"
                      fill="none"
                      stroke="var(--primary-accent)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      pathLength="1"
                    />
                  </svg>
                </span>
              </span>
            </h1>
          </header>

          {/* Block 3 — Philosophy Statement */}
          <article className="font-body-custom text-lg md:text-xl font-light text-[var(--text-secondary)] max-w-[52ch]">
            {PERSON.tagline}
          </article>

          {/* Block 4 — Bio */}
          <article className="space-y-6">
            <p className="text-[0.9375rem] leading-[1.9] text-[var(--text-secondary)] max-w-[52ch]">
              {PERSON.bio1}
            </p>
            <p className="text-[0.9375rem] leading-[1.9] text-[var(--text-secondary)] max-w-[52ch] border-l-2 border-[rgba(224,185,106,0.2)] pl-4">
              {PERSON.bio2}
            </p>
          </article>

          {/* Block 5 — Expertise Tags */}
          <nav aria-label="Expertise taxonomy">
            <ExpertiseTags items={EXPERTISE} />
          </nav>

          {/* Block 6 — CTA Row */}
          <CTARow />
        </div>

        {/* ── RIGHT COLUMN (Visual Artifacts) */}
        <aside className="flex flex-col gap-8 w-full max-w-md lg:max-w-none">
          
          {/* Artifact C — Abstract Identity Mark */}
          <div className="flex justify-start pl-2 lg:pl-0">
            <div 
              className="relative w-[90px] h-[90px] lg:w-[120px] lg:h-[120px] flex items-center justify-center transition-all duration-300" 
              role="img" 
              aria-label={`${PERSON.firstName} ${PERSON.lastName} monogram`}
            >
              <svg className="absolute inset-0 w-full h-full spin-slow-custom" viewBox="0 0 120 120" aria-hidden="true">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="var(--primary-accent)"
                  strokeWidth="0.75"
                  strokeOpacity="0.15"
                  strokeDasharray="4 4"
                />
              </svg>
              <span className="font-display-custom italic text-2xl lg:text-3.5xl text-[var(--primary-accent)] opacity-60 select-none transition-all duration-300">
                {PERSON.firstName[0]}{PERSON.lastName[0]}
              </span>
            </div>
          </div>

          {/* Artifact A — Signature Stats Panel */}
          <div className="glass-panel p-[1.5rem_1.25rem] lg:p-[2.5rem_2rem] w-full transition-all duration-300 ease-in-out">
            <div className="flex flex-col gap-8">
              {STATS.map((stat, index) => (
                <StatItem 
                  key={stat.label} 
                  number={stat.number} 
                  label={stat.label} 
                  isIndented={index === 1} 
                />
              ))}
            </div>
          </div>

          {/* Artifact B — Currently Working On Card */}
          <CurrentlyCard project={CURRENTLY.project} date={CURRENTLY.date} />
        </aside>

      </div>
    </section>
  );
}