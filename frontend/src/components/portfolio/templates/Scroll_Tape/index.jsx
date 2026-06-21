import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useInView, AnimatePresence } from 'framer-motion';
import {
  Github, Linkedin, Twitter, Mail, MapPin, ExternalLink,
  Star, ChevronDown, Play, Pause,
  Volume2, VolumeX, SkipForward, Rewind
} from 'lucide-react';

/* ─── VHS / CRT utilities ──────────────────────────────────────── */

/** Scanlines overlay (pure CSS, rendered as an absolutely-positioned div) */
const Scanlines = () => (
  <div
    aria-hidden
    className="pointer-events-none fixed inset-0 z-50 mix-blend-overlay opacity-20"
    style={{
      backgroundImage:
        'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)',
    }}
  />
);

/** CRT vignette + phosphor glow */
const CRTVignette = () => (
  <div
    aria-hidden
    className="pointer-events-none fixed inset-0 z-40"
    style={{
      background:
        'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.85) 100%)',
    }}
  />
);

/** Horizontal static glitch strip that appears occasionally */
const StaticBurst = ({ trigger }) => (
  <AnimatePresence>
    {trigger && (
      <motion.div
        key="static"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.6, 1, 0] }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, times: [0, 0.1, 0.4, 0.7, 1] }}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[60]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(0,255,170,0.04) 0px, transparent 1px, transparent 3px, rgba(255,0,100,0.03) 4px)',
          mixBlendMode: 'screen',
        }}
      />
    )}
  </AnimatePresence>
);

/** Horizontal RGB-shift glitch line */
const GlitchLine = ({ top, color, delay = 0 }) => (
  <motion.div
    aria-hidden
    className="pointer-events-none absolute w-full h-px"
    style={{ top, background: color, mixBlendMode: 'screen' }}
    animate={{ scaleX: [1, 1.02, 0.98, 1], x: [0, 3, -2, 0], opacity: [0.6, 1, 0.7, 0.6] }}
    transition={{ duration: 4, repeat: Infinity, delay, ease: 'linear' }}
  />
);

/* ─── Section reveal wrapper ───────────────────────────────────── */
const TapeSection = ({ children, className = '' }) => {
  const { portfolioData: data } = usePortfolio();

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [showStatic, setShowStatic] = useState(false);

  useEffect(() => {
    if (isInView) {
      setShowStatic(true);
      const t = setTimeout(() => setShowStatic(false), 400);
      return () => clearTimeout(t);
    }
  }, [isInView]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <StaticBurst trigger={showStatic} />
      <motion.div
        initial={{ opacity: 0, filter: 'brightness(3) blur(4px)' }}
        animate={isInView
          ? { opacity: 1, filter: 'brightness(1) blur(0px)' }
          : { opacity: 0, filter: 'brightness(3) blur(4px)' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
};

/* ─── VHS timestamp / tape counter ────────────────────────────── */
const TapeCounter = () => {
  const { portfolioData: data } = usePortfolio();

  const [time, setTime] = useState('00:00:00:00');
  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date();
      setTime(
        `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}:${String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0')}`
      );
    }, 80);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[70] font-mono text-xs select-none flex flex-col items-end gap-1">
      <div className="px-2 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.7)', color: '#00ffaa', textShadow: '0 0 8px #00ffaa' }}>
        ● REC {time}
      </div>
      <div className="px-2 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.7)', color: '#ff4466', textShadow: '0 0 8px #ff4466' }}>
        SP ▶ PLAY
      </div>
    </div>
  );
};

/* ─── Tape transport bar (bottom) ──────────────────────────────── */
const TapeTransport = ({ progress }) => {
  const { portfolioData: data } = usePortfolio();

  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[70] flex items-center gap-3 px-4 py-2"
      style={{
        background: 'linear-gradient(0deg, rgba(0,0,0,0.97) 0%, rgba(10,5,20,0.95) 100%)',
        borderTop: '2px solid #00ffaa44',
      }}
    >
      {/* Tape reel left */}
      <TapeReel spinning={playing} size={28} />

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-[#00ffaa] hover:text-white transition-colors" aria-label="rewind">
          <Rewind size={14} />
        </button>
        <button onClick={() => setPlaying(p => !p)}
          className="text-[#00ffaa] hover:text-white transition-colors" aria-label="play/pause">
          {playing ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
          className="text-[#00ffaa] hover:text-white transition-colors" aria-label="skip forward">
          <SkipForward size={14} />
        </button>
        <button onClick={() => setMuted(m => !m)}
          className="text-[#00ffaa] hover:text-white transition-colors" aria-label="mute">
          {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
      </div>

      {/* Tape progress track */}
      <div className="flex-1 relative h-2 rounded-full overflow-hidden" style={{ background: '#1a0a2e' }}>
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${progress * 100}%`,
            background: 'linear-gradient(90deg, #00ffaa, #ff4466)',
            boxShadow: '0 0 8px #00ffaa',
          }}
        />
        {/* Tape notch marks */}
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute top-0 bottom-0 w-px opacity-20"
            style={{ left: `${(i + 1) * 5}%`, background: '#fff' }} />
        ))}
      </div>

      {/* Tape label */}
      <span className="font-mono text-[10px] whitespace-nowrap" style={{ color: '#00ffaa88' }}>
        {data.personal.name.toUpperCase()} — PORTFOLIO VOL.1
      </span>

      {/* Tape reel right */}
      <TapeReel spinning={playing} size={28} reverse />
    </div>
  );
};

/** Animated tape reel SVG */
const TapeReel = ({ spinning, size, reverse = false }) => (
  <motion.svg
    width={size} height={size} viewBox="0 0 40 40"
    animate={{ rotate: spinning ? (reverse ? 360 : -360) : 0 }}
    transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
  >
    <circle cx="20" cy="20" r="18" fill="none" stroke="#00ffaa44" strokeWidth="2" />
    <circle cx="20" cy="20" r="6" fill="#00ffaa22" stroke="#00ffaa" strokeWidth="1.5" />
    {[0, 60, 120, 180, 240, 300].map((deg) => {
      const r = 12;
      const x = 20 + r * Math.cos((deg * Math.PI) / 180);
      const y = 20 + r * Math.sin((deg * Math.PI) / 180);
      return <circle key={deg} cx={x} cy={y} r="2.5" fill="#00ffaa" opacity="0.7" />;
    })}
    {/* Hub spokes */}
    {[0, 120, 240].map((deg) => {
      const x2 = 20 + 5 * Math.cos((deg * Math.PI) / 180);
      const y2 = 20 + 5 * Math.sin((deg * Math.PI) / 180);
      return <line key={deg} x1="20" y1="20" x2={x2} y2={y2} stroke="#00ffaa" strokeWidth="1.5" />;
    })}
  </motion.svg>
);

/* ─── Section label (VHS chapter marker) ──────────────────────── */
const ChapterLabel = ({ label, index }) => (
  <div className="flex items-center gap-3 mb-10">
    <span className="font-mono text-[10px] px-2 py-0.5 rounded"
      style={{ background: '#ff446622', color: '#ff4466', border: '1px solid #ff446644', textShadow: '0 0 6px #ff4466' }}>
      CH.{String(index).padStart(2, '0')}
    </span>
    <span className="font-mono text-xs tracking-[0.3em] uppercase"
      style={{ color: '#00ffaa', textShadow: '0 0 10px #00ffaa88' }}>
      {label}
    </span>
    <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, #00ffaa44, transparent)' }} />
  </div>
);

/* ─── HERO ──────────────────────────────────────────────────────── */
const Hero = () => {
  const { portfolioData: data } = usePortfolio();

  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 3000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-16 pb-24 overflow-hidden">
      {/* Background noise texture */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }} />

      {/* Horizontal glitch lines in background */}
      <GlitchLine top="25%" color="rgba(0,255,170,0.3)" delay={0.5} />
      <GlitchLine top="60%" color="rgba(255,68,102,0.25)" delay={1.8} />
      <GlitchLine top="80%" color="rgba(100,100,255,0.2)" delay={3} />

      {/* VHS "PLAY" indicator */}
      <motion.div
        className="font-mono text-xs mb-10 flex items-center gap-2"
        style={{ color: '#00ffaa', textShadow: '0 0 12px #00ffaa' }}
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <Play size={12} fill="currentColor" />
        PLAY
      </motion.div>

      {/* Name with glitch */}
      <div className="relative text-center mb-4">
        <motion.h1
          className="font-mono font-black text-5xl sm:text-7xl md:text-8xl tracking-tighter leading-none select-none"
          style={{
            color: '#e8e0ff',
            textShadow: glitch
              ? '3px 0 #ff4466, -3px 0 #00ffaa'
              : '0 0 40px rgba(232,224,255,0.3)',
          }}
          animate={glitch ? { x: [0, -4, 3, -2, 0] } : { x: 0 }}
          transition={{ duration: 0.15 }}
        >
          {data.personal.name}
        </motion.h1>

        {/* Chromatic shift copy (decorative) */}
        <div
          aria-hidden
          className="absolute inset-0 font-mono font-black text-5xl sm:text-7xl md:text-8xl tracking-tighter leading-none select-none opacity-30 pointer-events-none"
          style={{
            color: '#00ffaa',
            transform: 'translate(3px, 0)',
            mixBlendMode: 'screen',
          }}
        >
          {data.personal.name}
        </div>
        <div
          aria-hidden
          className="absolute inset-0 font-mono font-black text-5xl sm:text-7xl md:text-8xl tracking-tighter leading-none select-none opacity-20 pointer-events-none"
          style={{
            color: '#ff4466',
            transform: 'translate(-3px, 0)',
            mixBlendMode: 'screen',
          }}
        >
          {data.personal.name}
        </div>
      </div>

      {/* Title ticker */}
      <motion.div
        className="font-mono text-base sm:text-xl tracking-[0.25em] uppercase mb-6"
        style={{ color: '#ff4466', textShadow: '0 0 20px #ff446688' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {data.personal.title}
      </motion.div>

      {/* Location */}
      <motion.div
        className="flex items-center gap-2 font-mono text-xs mb-10"
        style={{ color: '#8877aa' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <MapPin size={11} />
        {data.personal.location}
      </motion.div>

      {/* Stats bar */}
      <motion.div
        className="grid grid-cols-3 gap-6 sm:gap-12 mb-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        {[
          { val: data.stats.yearsExperience, label: 'YRS EXP' },
          { val: data.stats.projectsCompleted, label: 'PROJECTS' },
          { val: data.stats.happyClients, label: 'CLIENTS' },
        ].map(({ val, label }) => (
          <div key={label}>
            <div className="font-mono text-3xl font-black"
              style={{ color: '#00ffaa', textShadow: '0 0 20px #00ffaa88' }}>
              {val}+
            </div>
            <div className="font-mono text-[10px] tracking-widest mt-1"
              style={{ color: '#8877aa' }}>{label}</div>
          </div>
        ))}
      </motion.div>

      {/* Social links */}
      <motion.div
        className="flex items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
      >
        {[
          { href: data.socials.github, icon: Github },
          { href: data.socials.linkedin, icon: Linkedin },
          { href: data.socials.twitter, icon: Twitter },
          { href: `mailto:${data.socials.email}`, icon: Mail },
        ].map(({ href, icon: Icon }) => (
          <a key={href} href={href} target="_blank" rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded border transition-all duration-200 hover:scale-110"
            style={{
              borderColor: '#00ffaa44',
              color: '#00ffaa',
              background: 'rgba(0,255,170,0.05)',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 16px #00ffaa88'; e.currentTarget.style.borderColor = '#00ffaa'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = '#00ffaa44'; }}
          >
            <Icon size={16} />
          </a>
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 font-mono text-[10px] tracking-widest"
        style={{ color: '#8877aa' }}
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        SCROLL TO PLAY
        <ChevronDown size={14} />
      </motion.div>
    </section>
  );
};

/* ─── ABOUT ─────────────────────────────────────────────────────── */
const About = () => (
  <TapeSection>
    <section className="px-6 py-20 max-w-5xl mx-auto">
      <ChapterLabel label="About" index={1} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Avatar with CRT frame */}
        <div className="flex justify-center">
          <div className="relative">
            {/* CRT bezel */}
            <div className="absolute -inset-4 rounded-2xl"
              style={{ background: 'linear-gradient(135deg, #1a0a2e, #0d0520)', border: '3px solid #2a1a4e' }} />
            <div className="absolute -inset-2 rounded-xl"
              style={{ border: '1px solid #00ffaa22' }} />
            <img
              src={data.personal.avatar}
              alt={data.personal.name || "Profile Avatar"}
              className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-lg object-cover grayscale"
              style={{ filter: 'grayscale(30%) sepia(20%) hue-rotate(200deg) contrast(1.1)', boxShadow: '0 0 30px #00ffaa22' }}
            />
            {/* Screen glare */}
            <div className="absolute inset-0 rounded-lg pointer-events-none"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)' }} />
            {/* VHS label sticker */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] px-3 py-0.5 rounded"
              style={{ background: '#ff4466', color: '#000', fontWeight: 700, letterSpacing: '0.15em' }}>
              ▶ {data.personal.name.split(' ')[0].toUpperCase()}
            </div>
          </div>
        </div>

        {/* Bio */}
        <div>
          <p className="font-mono text-sm leading-7 mb-6" style={{ color: '#c4b8e0' }}>
            {data.personal.bio}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'STATUS', value: 'AVAILABLE' },
              { label: 'FORMAT', value: 'VHS SP' },
              { label: 'LOCATION', value: data.personal.location },
              { label: 'TAPE', value: 'VOL. 01' },
            ].map(({ label, value }) => (
              <div key={label} className="px-3 py-2 rounded font-mono text-xs"
                style={{ background: 'rgba(0,255,170,0.04)', border: '1px solid #00ffaa22' }}>
                <div style={{ color: '#8877aa' }}>{label}</div>
                <div className="mt-0.5 font-bold" style={{ color: '#00ffaa' }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  </TapeSection>
);

/* ─── SKILLS ────────────────────────────────────────────────────── */
const Skills = () => {
  const { portfolioData: data } = usePortfolio();

  const categories = [...new Set(data.skills.map(s => s.category))];

  return (
    <TapeSection>
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <ChapterLabel label="Skills" index={2} />
        <div className="space-y-8">
          {categories.map((cat) => (
            <div key={cat}>
              <div className="font-mono text-[10px] tracking-widest uppercase mb-4"
                style={{ color: '#ff4466' }}>
                // {cat}
              </div>
              <div className="space-y-3">
                {data.skills.filter(s => s.category === cat).map((skill, i) => (
                  <SkillBar key={skill.name} skill={skill} delay={i * 0.08} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </TapeSection>
  );
};

const SkillBar = ({ skill, delay }) => {
  const { portfolioData: data } = usePortfolio();

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="flex items-center gap-4">
      <div className="font-mono text-xs w-28 text-right shrink-0" style={{ color: '#c4b8e0' }}>
        {skill.name}
      </div>
      <div className="flex-1 h-3 rounded-full overflow-hidden relative"
        style={{ background: 'rgba(255,255,255,0.05)' }}>
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: 'linear-gradient(90deg, #00ffaa, #00ccff)',
            boxShadow: '0 0 8px #00ffaa88',
          }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
        />
        {/* Tape stripe pattern */}
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 6px, rgba(0,0,0,0.4) 6px, rgba(0,0,0,0.4) 8px)' }} />
      </div>
      <div className="font-mono text-[10px] w-8 shrink-0" style={{ color: '#8877aa' }}>
        {skill.level}%
      </div>
    </div>
  );
};

/* ─── PROJECTS ──────────────────────────────────────────────────── */
const Projects = () => (
  <TapeSection>
    <section className="px-6 py-20 max-w-5xl mx-auto">
      <ChapterLabel label="Projects" index={3} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {data.projects.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>
    </section>
  </TapeSection>
);

const ProjectCard = ({ project, index }) => {
  const { portfolioData: data } = usePortfolio();

  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="relative rounded-xl overflow-hidden group cursor-pointer"
      style={{
        background: 'rgba(10,5,30,0.9)',
        border: hovered ? '1px solid #00ffaa66' : '1px solid #2a1a4e',
        boxShadow: hovered ? '0 0 24px #00ffaa22' : 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      {/* Thumbnail with VHS filter */}
      {project.image && (
        <div className="relative h-44 overflow-hidden">
          <img src={project.image} alt={project.title || "Project Screenshot"}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ filter: 'saturate(0.7) hue-rotate(200deg) contrast(1.1)' }} />
          {/* Static overlay on hover */}
          <div className="absolute inset-0 transition-opacity duration-200"
            style={{
              opacity: hovered ? 0.12 : 0,
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
              backgroundSize: '150px 150px',
            }} />
          {/* Chapter badge */}
          <div className="absolute top-2 left-2 font-mono text-[9px] px-2 py-0.5 rounded"
            style={{ background: 'rgba(0,0,0,0.8)', color: '#ff4466', border: '1px solid #ff446644' }}>
            #{String(index + 1).padStart(2, '0')}
          </div>
        </div>
      )}

      <div className="p-5">
        <h3 className="font-mono font-bold text-base mb-2" style={{ color: '#e8e0ff' }}>
          {project.title}
        </h3>
        <p className="font-mono text-xs leading-6 mb-4" style={{ color: '#8877aa' }}>
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack?.map(tech => (
            <span key={tech} className="font-mono text-[10px] px-2 py-0.5 rounded"
              style={{ background: 'rgba(0,255,170,0.08)', color: '#00ffaa', border: '1px solid #00ffaa22' }}>
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-3">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-mono text-xs transition-colors hover:text-white"
              style={{ color: '#00ffaa' }}>
              <ExternalLink size={11} /> LIVE
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-mono text-xs transition-colors hover:text-white"
              style={{ color: '#8877aa' }}>
              <Github size={11} /> SOURCE
            </a>
          )}
        </div>
      </div>

      {/* Scanline effect on card */}
      <div className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden opacity-30"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.2) 3px, rgba(0,0,0,0.2) 4px)',
        }} />
    </motion.div>
  );
};

/* ─── EXPERIENCE ────────────────────────────────────────────────── */
const Experience = () => (
  <TapeSection>
    <section className="px-6 py-20 max-w-5xl mx-auto">
      <ChapterLabel label="Experience" index={4} />
      <div className="relative">
        {/* Tape spine */}
        <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px"
          style={{ background: 'linear-gradient(180deg, #00ffaa44, #ff446644, #00ffaa44)' }} />

        <div className="space-y-8 pl-16 sm:pl-20">
          {data.experience.map((exp, i) => (
            <motion.div
              key={`${exp.company}-${i}`}
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
            >
              {/* Timeline dot */}
              <div className="absolute -left-12 sm:-left-14 top-2 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: '#0d0520', border: '2px solid #00ffaa', boxShadow: '0 0 12px #00ffaa66' }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#00ffaa' }} />
              </div>

              <div className="p-5 rounded-xl"
                style={{ background: 'rgba(10,5,30,0.8)', border: '1px solid #2a1a4e' }}>
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="font-mono font-bold text-sm" style={{ color: '#e8e0ff' }}>{exp.role}</div>
                    <div className="font-mono text-xs mt-0.5" style={{ color: '#ff4466' }}>@ {exp.company}</div>
                  </div>
                  <div className="font-mono text-[10px] px-2 py-0.5 rounded shrink-0"
                    style={{ background: 'rgba(0,255,170,0.08)', color: '#00ffaa', border: '1px solid #00ffaa22' }}>
                    {exp.period}
                  </div>
                </div>
                <p className="font-mono text-xs leading-6" style={{ color: '#8877aa' }}>{exp.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </TapeSection>
);

/* ─── TESTIMONIALS ──────────────────────────────────────────────── */
const Testimonials = () => (
  <TapeSection>
    <section className="px-6 py-20 max-w-5xl mx-auto">
      <ChapterLabel label="Testimonials" index={5} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            className="p-5 rounded-xl relative overflow-hidden"
            style={{ background: 'rgba(10,5,30,0.9)', border: '1px solid #2a1a4e' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            {/* Quote mark */}
            <div className="font-mono text-4xl font-black mb-3 leading-none"
              style={{ color: '#ff446633' }}>"</div>
            <p className="font-mono text-xs leading-6 mb-4" style={{ color: '#c4b8e0' }}>
              {t.text}
            </p>
            <div className="flex items-center gap-3 pt-3"
              style={{ borderTop: '1px solid #2a1a4e' }}>
              {t.avatar && (
                <img src={t.avatar} alt={t.name || "Profile Avatar"}
                  className="w-8 h-8 rounded-full object-cover"
                  style={{ filter: 'saturate(0.6) hue-rotate(200deg)' }} />
              )}
              <div>
                <div className="font-mono text-xs font-bold" style={{ color: '#e8e0ff' }}>{t.name}</div>
                <div className="font-mono text-[10px]" style={{ color: '#8877aa' }}>{t.role}</div>
              </div>
              <div className="ml-auto flex gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={9} fill="#ff4466" style={{ color: '#ff4466' }} />
                ))}
              </div>
            </div>

            {/* Corner tape mark */}
            <div className="absolute top-0 right-0 w-6 h-6 overflow-hidden">
              <div className="absolute top-0 right-0 w-0 h-0"
                style={{ borderLeft: '24px solid transparent', borderTop: '24px solid #00ffaa22' }} />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  </TapeSection>
);

/* ─── CONTACT ───────────────────────────────────────────────────── */
const Contact = () => {
  const { portfolioData: data } = usePortfolio();

  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <TapeSection>
      <section className="px-6 py-20 pb-32 max-w-5xl mx-auto">
        <ChapterLabel label="Contact" index={6} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left: info */}
          <div>
            <h3 className="font-mono font-bold text-2xl mb-4" style={{ color: '#e8e0ff' }}>
              Press <span style={{ color: '#ff4466' }}>REC</span> to Connect
            </h3>
            <p className="font-mono text-sm leading-7 mb-8" style={{ color: '#8877aa' }}>
              Ready to record something great together? Drop a message and I'll rewind to you shortly.
            </p>
            <div className="space-y-4">
              {[
                { icon: Mail, label: 'EMAIL', value: data.socials.email, href: `mailto:${data.socials.email}` },
                { icon: Github, label: 'GITHUB', value: data.socials.github, href: data.socials.github },
                { icon: Linkedin, label: 'LINKEDIN', value: data.socials.linkedin, href: data.socials.linkedin },
                { icon: Twitter, label: 'TWITTER', value: data.socials.twitter, href: data.socials.twitter },
              ].map(({ icon: Icon, label, value, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-4 p-3 rounded-lg transition-all duration-200 group"
                  style={{ border: '1px solid #2a1a4e' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#00ffaa44'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#2a1a4e'}
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded"
                    style={{ background: 'rgba(0,255,170,0.08)', color: '#00ffaa' }}>
                    <Icon size={14} />
                  </div>
                  <div>
                    <div className="font-mono text-[10px] tracking-widest" style={{ color: '#8877aa' }}>{label}</div>
                    <div className="font-mono text-xs truncate max-w-[180px]" style={{ color: '#c4b8e0' }}>{value}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div className="p-6 rounded-xl" style={{ background: 'rgba(10,5,30,0.9)', border: '1px solid #2a1a4e' }}>
            {sent ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-8">
                <motion.div
                  animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                  className="font-mono text-4xl" style={{ color: '#00ffaa', textShadow: '0 0 20px #00ffaa' }}>
                  ● REC
                </motion.div>
                <p className="font-mono text-sm" style={{ color: '#c4b8e0' }}>Message recorded!<br />I'll play it back soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { key: 'name', label: 'NAME', type: 'text', placeholder: 'Your name' },
                  { key: 'email', label: 'EMAIL', type: 'email', placeholder: 'your@email.com' },
                ].map(({ key, label, type, placeholder }) => (
                  <div key={key}>
                    <label className="font-mono text-[10px] tracking-widest block mb-1.5" style={{ color: '#8877aa' }}>
                      // {label}
                    </label>
                    <input
                      type={type}
                      value={form[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      required
                      className="w-full px-3 py-2.5 rounded font-mono text-xs outline-none transition-all duration-200"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid #2a1a4e',
                        color: '#e8e0ff',
                      }}
                      onFocus={e => e.target.style.borderColor = '#00ffaa44'}
                      onBlur={e => e.target.style.borderColor = '#2a1a4e'}
                    />
                  </div>
                ))}
                <div>
                  <label className="font-mono text-[10px] tracking-widest block mb-1.5" style={{ color: '#8877aa' }}>
                    // MESSAGE
                  </label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="What's on the tape?"
                    required rows={4}
                    className="w-full px-3 py-2.5 rounded font-mono text-xs outline-none resize-none transition-all duration-200"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #2a1a4e', color: '#e8e0ff' }}
                    onFocus={e => e.target.style.borderColor = '#00ffaa44'}
                    onBlur={e => e.target.style.borderColor = '#2a1a4e'}
                  />
                </div>
                <button type="submit"
                  className="w-full py-3 rounded font-mono text-sm font-bold tracking-widest uppercase transition-all duration-200 hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(90deg, #00ffaa22, #ff446622)',
                    border: '1px solid #00ffaa44',
                    color: '#00ffaa',
                  }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 20px #00ffaa33'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
                >
                  ● REC — Send Message
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer tape label */}
        <div className="mt-16 text-center font-mono text-[10px] tracking-widest" style={{ color: '#2a1a4e' }}>
          ■ END OF TAPE — {data.personal.name.toUpperCase()} PORTFOLIO VOL.1 ■
        </div>
      </section>
    </TapeSection>
  );
};

/* ─── NAV ───────────────────────────────────────────────────────── */
const Nav = () => {
  const { portfolioData: data } = usePortfolio();

  const sections = ['About', 'Skills', 'Projects', 'Experience', 'Testimonials', 'Contact'];
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-[70] hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full"
      style={{ background: 'rgba(0,0,0,0.8)', border: '1px solid #00ffaa22', backdropFilter: 'blur(10px)' }}>
      {sections.map(s => (
        <a key={s}
          href={`#${s.toLowerCase()}`}
          onClick={e => {
            e.preventDefault();
            document.getElementById(s.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="font-mono text-[10px] tracking-wider px-3 py-1 rounded-full transition-all duration-200 hover:text-white"
          style={{ color: '#8877aa' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#00ffaa'; e.currentTarget.style.background = 'rgba(0,255,170,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#8877aa'; e.currentTarget.style.background = 'transparent'; }}
        >
          {s.toUpperCase()}
        </a>
      ))}
    </nav>
  );
};

/* ─── ROOT COMPONENT ────────────────────────────────────────────── */
export default function ScrollTape() {
  const { portfolioData: data } = usePortfolio();

  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    return scrollYProgress.onChange(v => setProgress(v));
  }, [scrollYProgress]);

  return (
    <div className="relative" style={{ background: '#070312', color: '#e8e0ff', fontFamily: "'Courier New', Courier, monospace" }}>
      {/* Global overlay effects */}
      <Scanlines />
      <CRTVignette />
      <TapeCounter />
      <TapeTransport progress={progress} />
      <Nav />

      {/* Sections */}
      <Hero />
      <div id="about"><About /></div>
      <div id="skills"><Skills /></div>
      <div id="projects"><Projects /></div>
      <div id="experience"><Experience /></div>
      <div id="testimonials"><Testimonials /></div>
      <div id="contact"><Contact /></div>
    </div>
  );
}
