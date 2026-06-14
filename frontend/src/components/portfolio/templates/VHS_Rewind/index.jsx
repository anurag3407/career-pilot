import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  ExternalLink,
  Play,
  Rewind,
  FastForward,
  Pause,
  Square,
  ChevronRight,
  Send,
  User,
  MessageSquare,
  Clock,
  Code,
  Briefcase,
  Award,
  Heart,
  Star,
  Volume2,
  Menu,
  X,
} from 'lucide-react';
import './styles.css';

/* ═══════════════════════════════════════════════════════════════
   VHS Rewind Portfolio Template
   Category: Retro / Nostalgic
   ═══════════════════════════════════════════════════════════════ */

// ── Shared animation variants ────────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

// ── VHS Timestamp Component ──────────────────────────────────
function VHSTimestamp() {
  const { portfolioData: data } = usePortfolio();

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (d) => {
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    const secs = String(d.getSeconds()).padStart(2, '0');
    return `${month}.${day}.${year}  ${hours}:${mins}:${secs}`;
  };

  return (
    <span className="vhs-timestamp tracking-wider">
      {formatDate(time)}
    </span>
  );
}

// ── VCR Controls Bar Component ───────────────────────────────
function VCRControls() {
  const { portfolioData: data } = usePortfolio();

  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="flex items-center gap-3 vhs-font">
      <button
        onClick={() => setIsPlaying(false)}
        className="text-[#f0e6d3]/40 hover:text-[#00e5ff] transition-colors"
        aria-label="Rewind"
      >
        <Rewind size={16} />
      </button>
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="text-[#00e5ff] hover:text-[#ff00aa] transition-colors"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>
      <button
        onClick={() => setIsPlaying(false)}
        className="text-[#f0e6d3]/40 hover:text-[#00e5ff] transition-colors"
        aria-label="Fast Forward"
      >
        <FastForward size={16} />
      </button>
      <button
        className="text-[#f0e6d3]/40 hover:text-[#ff00aa] transition-colors"
        aria-label="Stop"
      >
        <Square size={14} />
      </button>
      <div className="ml-2 flex items-center gap-1 text-[#f0e6d3]/30 text-xs">
        <Volume2 size={12} />
        <div className="flex gap-[2px]">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-1 ${i < 3 ? 'bg-[#00e5ff]' : 'bg-[#f0e6d3]/10'}`}
              style={{ height: `${6 + i * 2}px` }}
            />
          ))}
        </div>
      </div>
      {isPlaying && (
        <span className="ml-auto text-xs text-[#00e5ff]/60 vhs-font tracking-widest">
          ▶ PLAY
        </span>
      )}
    </div>
  );
}

// ── REC Indicator Component ──────────────────────────────────
function RECIndicator() {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-red-500 vhs-rec-dot" />
      <span className="vhs-font text-red-500 text-sm tracking-widest font-bold">
        REC
      </span>
    </div>
  );
}

// ── Section Label (VHS Style) ────────────────────────────────
function SectionLabel({ label, icon: Icon }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="flex items-center gap-2 px-3 py-1.5 vhs-tape-label">
        {Icon && <Icon size={14} className="text-[#00e5ff]" />}
        <span className="vhs-font text-[#00e5ff] text-sm tracking-[0.25em] uppercase">
          {label}
        </span>
      </div>
      <div className="flex-1 vhs-hline" />
    </div>
  );
}

// ── Navigation Bar ───────────────────────────────────────────
function VHSNavbar() {
  const { portfolioData: data } = usePortfolio();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sections = [
    { id: 'hero', label: 'HOME' },
    { id: 'about', label: 'ABOUT' },
    { id: 'skills', label: 'SKILLS' },
    { id: 'projects', label: 'PROJECTS' },
    { id: 'experience', label: 'EXP' },
    { id: 'testimonials', label: 'REVIEWS' },
    { id: 'contact', label: 'CONTACT' },
  ];

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (id) => {
    setIsMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a14]/90 backdrop-blur-sm border-b border-[#00e5ff]/10"
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo / Tape label */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-4 rounded-sm bg-gradient-to-r from-[#00e5ff] to-[#ff00aa] opacity-80" />
          <span className="vhs-font text-[#f0e6d3] text-lg tracking-wider hidden sm:inline">
            VHS://PORTFOLIO
          </span>
        </div>

        {/* Desktop Nav Links — hidden on mobile */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => handleNavClick(s.id)}
              className="px-2 py-1 text-xs vhs-font text-[#f0e6d3]/50 hover:text-[#00e5ff] hover:bg-[#00e5ff]/5 rounded transition-all tracking-widest"
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Right side: REC + Timestamp (desktop) | Hamburger (mobile) */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-4">
            <RECIndicator />
            <VHSTimestamp />
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            className="md:hidden p-2 rounded-lg border border-[#00e5ff]/20 bg-[#0a0a14]/60 text-[#00e5ff] hover:bg-[#00e5ff]/10 transition-colors"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Thin gradient progress line */}
      <div className="vhs-progress-bar w-full opacity-50" />

      {/* ── Mobile Slide-Down Menu ─────────────────────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-[#0a0a14]/95 backdrop-blur-md border-b border-[#00e5ff]/10"
          >
            <div className="px-4 py-4 space-y-1">
              {sections.map((s, idx) => (
                <motion.button
                  key={s.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                  onClick={() => handleNavClick(s.id)}
                  className="w-full text-left px-4 py-3 rounded-lg vhs-font text-sm text-[#f0e6d3]/60 hover:text-[#00e5ff] hover:bg-[#00e5ff]/5 tracking-[0.2em] transition-all flex items-center gap-3"
                >
                  <Play size={8} className="text-[#00e5ff]/40" />
                  {s.label}
                </motion.button>
              ))}

              {/* Mobile-only: REC + Timestamp row */}
              <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#1a1a3e]/50 px-4">
                <RECIndicator />
                <VHSTimestamp />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ═══════════════════════════════════════════════════════════════
//  HERO SECTION
// ═══════════════════════════════════════════════════════════════
function HeroSection() {
  const { portfolioData: data } = usePortfolio();

  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], [0, 150]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Animated background gradient */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 bg-gradient-to-b from-[#0d0d24] via-[#0a0a14] to-[#080818]"
      />

      {/* Decorative grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,229,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* VHS Top Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex items-center justify-between mb-12 px-4"
        >
          <RECIndicator />
          <VHSTimestamp />
        </motion.div>

        {/* Title with chromatic aberration */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-6"
        >
          <h1
            className="vhs-font text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-bold text-[#f0e6d3] vhs-chromatic vhs-glitch leading-tight"
            data-text={data.personal.name}
          >
            {data.personal.name}
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="vhs-font-mono text-sm sm:text-lg md:text-xl lg:text-2xl text-[#00e5ff] mb-8 tracking-wide break-words"
        >
          {'> '}{data.personal.title}
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="vhs-font text-[#f0e6d3]/50 text-base sm:text-lg max-w-2xl mx-auto mb-10 tracking-wide"
        >
          {data.personal.tagline || data.personal.bio.slice(0, 100) + '...'}
        </motion.p>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mb-12"
        >
          {[
            { val: `${data.stats.yearsExperience}+`, label: 'YEARS EXP' },
            { val: `${data.stats.projectsCompleted}+`, label: 'PROJECTS' },
            { val: `${data.stats.happyClients}+`, label: 'CLIENTS' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="vhs-font text-3xl sm:text-4xl text-[#00e5ff] vhs-glow-cyan mb-1">
                {stat.val}
              </div>
              <div className="vhs-font text-[10px] sm:text-xs text-[#f0e6d3]/40 tracking-[0.2em]">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* VCR Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="max-w-xs mx-auto"
        >
          <VCRControls />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 vhs-font text-[#f0e6d3]/30 text-xs tracking-widest"
        >
          ▼ SCROLL ▼
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//  ABOUT SECTION
// ═══════════════════════════════════════════════════════════════
function AboutSection() {
  const { portfolioData: data } = usePortfolio();

  return (
    <section id="about" className="relative py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <SectionLabel label="About Me" icon={User} />

        <div className="grid md:grid-cols-5 gap-8 items-start">
          {/* Avatar — CRT Monitor Frame */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="md:col-span-2 flex justify-center"
          >
            <div className="vhs-monitor p-3 max-w-[280px] w-full">
              {/* Monitor top bar */}
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="vhs-font text-[10px] text-[#00e5ff]/40 tracking-widest">CH-01</span>
                <span className="vhs-font text-[10px] text-[#f0e6d3]/30 tracking-widest">SP</span>
              </div>
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={data.personal.avatar}
                  alt={data.personal.name}
                  className="w-full aspect-square object-cover vhs-tracking"
                  loading="lazy"
                />
                {/* Scanline overlay on image */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)',
                  }}
                />
                {/* CRT curvature overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.4) 100%)',
                  }}
                />
              </div>
              {/* Monitor bottom bar */}
              <div className="flex items-center justify-between mt-2 px-1">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
                  <span className="vhs-font text-[10px] text-[#f0e6d3]/30">SIGNAL OK</span>
                </div>
                <RECIndicator />
              </div>
            </div>
          </motion.div>

          {/* Bio Content */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="md:col-span-3"
          >
            <div className="vhs-tape-border p-6 sm:p-8 rounded-lg bg-[#0d0d24]/60">
              {/* Label bar */}
              <div className="flex items-center gap-2 mb-6">
                <Play size={10} className="text-[#00e5ff]" />
                <span className="vhs-font text-xs text-[#00e5ff]/60 tracking-[0.2em]">
                  PLAYBACK — PERSONAL DATA
                </span>
              </div>

              <h2 className="vhs-font text-2xl sm:text-3xl text-[#f0e6d3] mb-4 vhs-glow-cyan">
                {data.personal.name}
              </h2>
              <p className="vhs-font-mono text-sm text-[#00e5ff] mb-4 tracking-wide">
                {data.personal.title}
              </p>
              <p className="text-[#f0e6d3]/60 leading-relaxed text-sm sm:text-base mb-6">
                {data.personal.bio}
              </p>

              {/* Location */}
              <div className="flex items-center gap-2 text-[#f0e6d3]/40 text-sm">
                <MapPin size={14} className="text-[#ff00aa]" />
                <span className="vhs-font tracking-wide">{data.personal.location}</span>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4 mt-6">
                {data.socials.github && (
                  <a href={data.socials.github} target="_blank" rel="noopener noreferrer"
                    className="text-[#f0e6d3]/40 hover:text-[#00e5ff] transition-colors" aria-label="GitHub">
                    <Github size={18} />
                  </a>
                )}
                {data.socials.linkedin && (
                  <a href={data.socials.linkedin} target="_blank" rel="noopener noreferrer"
                    className="text-[#f0e6d3]/40 hover:text-[#00e5ff] transition-colors" aria-label="LinkedIn">
                    <Linkedin size={18} />
                  </a>
                )}
                {data.socials.twitter && (
                  <a href={data.socials.twitter} target="_blank" rel="noopener noreferrer"
                    className="text-[#f0e6d3]/40 hover:text-[#00e5ff] transition-colors" aria-label="Twitter">
                    <Twitter size={18} />
                  </a>
                )}
                {data.socials.email && (
                  <a href={`mailto:${data.socials.email}`}
                    className="text-[#f0e6d3]/40 hover:text-[#ff00aa] transition-colors" aria-label="Email">
                    <Mail size={18} />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SKILLS SECTION
// ═══════════════════════════════════════════════════════════════
function SkillsSection() {
  const { portfolioData: data } = usePortfolio();

  // Group skills by category
  const categories = data.skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="relative py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <SectionLabel label="Skills" icon={Code} />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid sm:grid-cols-2 gap-8"
        >
          {Object.entries(categories).map(([category, skills]) => (
            <motion.div
              key={category}
              variants={fadeInUp}
              className="vhs-monitor p-5 sm:p-6"
            >
              {/* Category header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#00e5ff] rounded-sm" />
                  <span className="vhs-font text-sm text-[#00e5ff] tracking-[0.2em] uppercase">
                    {category}
                  </span>
                </div>
                <span className="vhs-font text-[10px] text-[#f0e6d3]/20 tracking-widest">
                  {skills.length} TRACKS
                </span>
              </div>

              {/* Skills bars */}
              <div className="space-y-4">
                {skills.map((skill, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="vhs-font-mono text-xs text-[#f0e6d3]/70 tracking-wide">
                        {skill.name}
                      </span>
                      <span className="vhs-font text-xs text-[#00e5ff]/60">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="h-2 bg-[#0a0a14] rounded-sm overflow-hidden border border-[#1a1a3e]/50">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: idx * 0.1, ease: 'easeOut' }}
                        className="h-full vhs-skill-bar rounded-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//  PROJECTS SECTION
// ═══════════════════════════════════════════════════════════════
function ProjectsSection() {
  const { portfolioData: data } = usePortfolio();

  return (
    <section id="projects" className="relative py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <SectionLabel label="Projects" icon={Briefcase} />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-2 gap-6"
        >
          {data.projects.map((project, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              custom={idx}
              className="group vhs-monitor overflow-hidden"
            >
              {/* Project Image — CRT style */}
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 sm:h-52 object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                {/* Scanlines on image */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
                  }}
                />
                {/* Top-left tape counter */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <div className="px-2 py-0.5 bg-black/70 rounded-sm">
                    <span className="vhs-font text-[10px] text-[#00e5ff] tracking-widest">
                      TAPE {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>
                {/* Bottom-right REC */}
                <div className="absolute bottom-3 right-3 px-2 py-0.5 bg-black/70 rounded-sm">
                  <RECIndicator />
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14] via-transparent to-transparent opacity-60" />
              </div>

              {/* Project Info */}
              <div className="p-5 sm:p-6">
                <h3 className="vhs-font text-xl text-[#f0e6d3] mb-2 vhs-glow-cyan tracking-wide group-hover:text-[#00e5ff] transition-colors">
                  {project.title}
                </h3>
                <p className="text-[#f0e6d3]/50 text-sm leading-relaxed mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.map((tech, ti) => (
                    <span
                      key={ti}
                      className="px-2 py-0.5 text-[10px] vhs-font tracking-wider text-[#00e5ff]/70 border border-[#00e5ff]/15 rounded-sm bg-[#00e5ff]/5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex items-center gap-4">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs vhs-font text-[#00e5ff]/70 hover:text-[#00e5ff] transition-colors tracking-wider"
                    >
                      <ExternalLink size={12} />
                      LIVE
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs vhs-font text-[#ff00aa]/70 hover:text-[#ff00aa] transition-colors tracking-wider"
                    >
                      <Github size={12} />
                      SOURCE
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//  EXPERIENCE SECTION
// ═══════════════════════════════════════════════════════════════
function ExperienceSection() {
  const { portfolioData: data } = usePortfolio();

  return (
    <section id="experience" className="relative py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <SectionLabel label="Experience" icon={Award} />

        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#00e5ff]/30 via-[#ff00aa]/20 to-transparent" />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="space-y-8"
          >
            {data.experience.map((exp, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                custom={idx}
                className="relative pl-12 sm:pl-20"
              >
                {/* Timeline dot */}
                <div className="absolute left-[7px] sm:left-[25px] top-6 w-3 h-3 rounded-full border-2 border-[#00e5ff] bg-[#0a0a14] z-10">
                  <div className="absolute inset-0.5 rounded-full bg-[#00e5ff]/40 animate-pulse" />
                </div>

                {/* Experience Card */}
                <div className="vhs-tape-border p-5 sm:p-6 rounded-lg bg-[#0d0d24]/50 hover:bg-[#0d0d24]/80 transition-colors group">
                  {/* Top bar */}
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Play size={8} className="text-[#00e5ff]" />
                      <span className="vhs-font text-[10px] text-[#00e5ff]/50 tracking-[0.2em]">
                        TAPE {String(idx + 1).padStart(2, '0')} / {String(data.experience.length).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#ff00aa]/60">
                      <Clock size={11} />
                      <span className="vhs-font text-xs tracking-wider">{exp.period}</span>
                    </div>
                  </div>

                  <h3 className="vhs-font text-lg sm:text-xl text-[#f0e6d3] mb-1 group-hover:text-[#00e5ff] transition-colors tracking-wide">
                    {exp.role}
                  </h3>
                  <p className="vhs-font-mono text-sm text-[#00e5ff]/80 mb-3">
                    @ {exp.company}
                  </p>
                  <p className="text-[#f0e6d3]/50 text-sm leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//  TESTIMONIALS SECTION
// ═══════════════════════════════════════════════════════════════
function TestimonialsSection() {
  const { portfolioData: data } = usePortfolio();

  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % data.testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimonials" className="relative py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <SectionLabel label="Testimonials" icon={MessageSquare} />

        {/* Featured testimonial — big CRT monitor */}
        <motion.div
          key={activeIdx}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="vhs-monitor p-6 sm:p-10 mb-8"
        >
          {/* Monitor bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Play size={10} className="text-[#00e5ff]" />
              <span className="vhs-font text-[10px] text-[#00e5ff]/50 tracking-[0.2em]">
                PLAYBACK — TESTIMONIAL {String(activeIdx + 1).padStart(2, '0')}
              </span>
            </div>
            <RECIndicator />
          </div>

          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="shrink-0 vhs-tape-border rounded-lg overflow-hidden w-16 h-16 sm:w-20 sm:h-20">
              <img
                src={data.testimonials[activeIdx].avatar}
                alt={data.testimonials[activeIdx].name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="flex-1">
              {/* Quote */}
              <div className="relative mb-4">
                <span className="absolute -top-4 -left-2 vhs-font text-4xl text-[#00e5ff]/20">
                  "
                </span>
                <p className="text-[#f0e6d3]/70 text-sm sm:text-base leading-relaxed pl-4 italic">
                  {data.testimonials[activeIdx].text}
                </p>
              </div>

              {/* Author */}
              <div className="pl-4">
                <p className="vhs-font text-[#00e5ff] text-sm tracking-wider">
                  {data.testimonials[activeIdx].name}
                </p>
                <p className="vhs-font text-xs text-[#ff00aa]/60 tracking-wider mt-0.5">
                  {data.testimonials[activeIdx].role}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Testimonial selector — tape thumbnails */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {data.testimonials.map((t, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`p-3 rounded-lg text-left transition-all duration-300 vhs-tape-border ${
                idx === activeIdx
                  ? 'bg-[#00e5ff]/10 border-[#00e5ff]/30'
                  : 'bg-[#0d0d24]/40 hover:bg-[#0d0d24]/70 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <span className="vhs-font text-[10px] text-[#f0e6d3]/60 tracking-wider truncate">
                  {t.name}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {idx === activeIdx ? (
                  <Play size={8} className="text-[#00e5ff] shrink-0" />
                ) : (
                  <Pause size={8} className="text-[#f0e6d3]/20 shrink-0" />
                )}
                <span className="vhs-font text-[9px] text-[#f0e6d3]/30 tracking-widest">
                  TAPE {String(idx + 1).padStart(2, '0')}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//  CONTACT SECTION
// ═══════════════════════════════════════════════════════════════
function ContactSection() {
  const { portfolioData: data } = usePortfolio();

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic placeholder
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="relative py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <SectionLabel label="Contact" icon={Send} />

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            <div className="vhs-monitor p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <Play size={10} className="text-[#00e5ff]" />
                <span className="vhs-font text-[10px] text-[#00e5ff]/50 tracking-[0.2em]">
                  INPUT — MESSAGE RECORDING
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block vhs-font text-xs text-[#00e5ff]/60 tracking-[0.15em] mb-2">
                    NAME
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name..."
                    className="w-full bg-[#0a0a14] border border-[#1a1a3e] rounded-lg px-4 py-3 text-[#f0e6d3] text-sm vhs-font-mono placeholder:text-[#f0e6d3]/20 focus:border-[#00e5ff]/40 focus:outline-none focus:ring-1 focus:ring-[#00e5ff]/20 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block vhs-font text-xs text-[#00e5ff]/60 tracking-[0.15em] mb-2">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email..."
                    className="w-full bg-[#0a0a14] border border-[#1a1a3e] rounded-lg px-4 py-3 text-[#f0e6d3] text-sm vhs-font-mono placeholder:text-[#f0e6d3]/20 focus:border-[#00e5ff]/40 focus:outline-none focus:ring-1 focus:ring-[#00e5ff]/20 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block vhs-font text-xs text-[#00e5ff]/60 tracking-[0.15em] mb-2">
                    MESSAGE
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Type your message..."
                    rows={4}
                    className="w-full bg-[#0a0a14] border border-[#1a1a3e] rounded-lg px-4 py-3 text-[#f0e6d3] text-sm vhs-font-mono placeholder:text-[#f0e6d3]/20 focus:border-[#00e5ff]/40 focus:outline-none focus:ring-1 focus:ring-[#00e5ff]/20 transition-all resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] bg-gradient-to-r from-[#00e5ff]/20 to-[#ff00aa]/20 border border-[#00e5ff]/30 rounded-lg vhs-font text-sm text-[#00e5ff] tracking-[0.15em] hover:from-[#00e5ff]/30 hover:to-[#ff00aa]/30 hover:border-[#00e5ff]/50 transition-all duration-300 group"
                >
                  <Send size={14} className="group-hover:translate-x-1 transition-transform" />
                  RECORD MESSAGE
                </button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="space-y-6"
          >
            {/* Info Card */}
            <div className="vhs-tape-border p-6 rounded-lg bg-[#0d0d24]/50">
              <div className="flex items-center gap-2 mb-4">
                <Play size={10} className="text-[#00e5ff]" />
                <span className="vhs-font text-[10px] text-[#00e5ff]/50 tracking-[0.2em]">
                  OUTPUT — CONTACT DATA
                </span>
              </div>

              <div className="space-y-4">
                {data.socials.email && (
                  <a
                    href={`mailto:${data.socials.email}`}
                    className="flex items-center gap-3 text-[#f0e6d3]/60 hover:text-[#00e5ff] transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#00e5ff]/10 flex items-center justify-center group-hover:bg-[#00e5ff]/20 transition-colors">
                      <Mail size={16} className="text-[#00e5ff]" />
                    </div>
                    <div>
                      <span className="vhs-font text-[10px] text-[#f0e6d3]/30 tracking-widest block">EMAIL</span>
                      <span className="vhs-font-mono text-sm">{data.socials.email}</span>
                    </div>
                  </a>
                )}
                {data.personal.location && (
                  <div className="flex items-center gap-3 text-[#f0e6d3]/60">
                    <div className="w-9 h-9 rounded-lg bg-[#ff00aa]/10 flex items-center justify-center">
                      <MapPin size={16} className="text-[#ff00aa]" />
                    </div>
                    <div>
                      <span className="vhs-font text-[10px] text-[#f0e6d3]/30 tracking-widest block">LOCATION</span>
                      <span className="vhs-font-mono text-sm">{data.personal.location}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links Card */}
            <div className="vhs-tape-border p-6 rounded-lg bg-[#0d0d24]/50">
              <div className="flex items-center gap-2 mb-4">
                <Play size={10} className="text-[#ff00aa]" />
                <span className="vhs-font text-[10px] text-[#ff00aa]/50 tracking-[0.2em]">
                  SOCIAL CHANNELS
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Github, label: 'GitHub', url: data.socials.github, color: '#00e5ff' },
                  { icon: Linkedin, label: 'LinkedIn', url: data.socials.linkedin, color: '#00e5ff' },
                  { icon: Twitter, label: 'Twitter', url: data.socials.twitter, color: '#00e5ff' },
                  { icon: Mail, label: 'Email', url: data.socials.email ? `mailto:${data.socials.email}` : null, color: '#ff00aa' },
                ].filter(s => s.url).map((social, idx) => (
                  <a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg bg-[#0a0a14]/50 border border-[#1a1a3e]/50 hover:border-[#00e5ff]/30 hover:bg-[#00e5ff]/5 transition-all group"
                  >
                    <social.icon size={16} style={{ color: social.color }} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                    <span className="vhs-font text-xs text-[#f0e6d3]/50 tracking-wider group-hover:text-[#f0e6d3]/80 transition-colors">
                      {social.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* VCR Bottom Controls */}
            <div className="vhs-tape-label p-4">
              <VCRControls />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════
//  FOOTER
// ═══════════════════════════════════════════════════════════════
function VHSFooter() {
  const { portfolioData: data } = usePortfolio();

  return (
    <footer className="relative py-8 px-4 sm:px-6 border-t border-[#1a1a3e]/50">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left */}
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 rounded-sm bg-gradient-to-r from-[#00e5ff] to-[#ff00aa] opacity-60" />
            <span className="vhs-font text-xs text-[#f0e6d3]/30 tracking-widest">
              VHS://REWIND — {data.personal.name.toUpperCase()}
            </span>
          </div>

          {/* Center — Tape counter */}
          <div className="vhs-font text-xs text-[#f0e6d3]/20 tracking-[0.3em]">
            ■ END OF TAPE ■
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <span className="vhs-font text-[10px] text-[#f0e6d3]/20 tracking-widest">
              © {new Date().getFullYear()}
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-red-500/40 vhs-rec-dot" />
          </div>
        </div>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN COMPONENT EXPORT
// ═══════════════════════════════════════════════════════════════
export default function VHSRewind() {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="relative min-h-screen bg-[#0a0a14] text-[#f0e6d3] vhs-scrollbar vhs-scanlines vhs-noise vhs-flicker overflow-x-hidden">
      {/* CRT Vignette overlay */}
      <div className="vhs-vignette" />

      {/* Navigation */}
      <VHSNavbar />

      {/* Sections */}
      <main>
        <HeroSection />

        <div className="vhs-section-divider" />
        <AboutSection />

        <div className="vhs-section-divider" />
        <SkillsSection />

        <div className="vhs-section-divider" />
        <ProjectsSection />

        <div className="vhs-section-divider" />
        <ExperienceSection />

        <div className="vhs-section-divider" />
        <TestimonialsSection />

        <div className="vhs-section-divider" />
        <ContactSection />
      </main>

      {/* Footer */}
      <VHSFooter />
    </div>
  );
}
