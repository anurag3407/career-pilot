import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
  animate,
} from 'framer-motion';
import {
  Github, Linkedin, Twitter, Mail, MapPin,
  Code2, ChevronDown, Send, Quote, Globe,
  Eye, Crosshair, Circle,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   TELESCOPE CURSOR LENS
   A circular lens that follows the cursor, revealing a "seen through glass"
   layer – always visible after intro, adds depth to the telescope theme.
═══════════════════════════════════════════════════════════════════════════ */
function TelescopeCursorLens() {
  const { portfolioData: data } = usePortfolio();

  const lensRef = useRef(null);
  const [pos, setPos] = useState({ x: -999, y: -999 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const onMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      setActive(true);
    };
    const onLeave = () => setActive(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const LENS = 120;

  return (
    <motion.div
      ref={lensRef}
      className="fixed pointer-events-none z-30 hidden md:block"
      animate={{
        x: pos.x - LENS / 2,
        y: pos.y - LENS / 2,
        opacity: active ? 1 : 0,
        scale: active ? 1 : 0.6,
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 28, mass: 0.6 }}
      style={{ width: LENS, height: LENS }}
    >
      {/* Outer dark rim */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, transparent 46%, rgba(0,0,0,0.85) 47%, rgba(0,0,0,0.95) 100%)',
          boxShadow:
            '0 0 0 1.5px rgba(34,211,238,0.5), 0 0 30px rgba(34,211,238,0.18), inset 0 0 20px rgba(0,0,0,0.6)',
        }}
      />
      {/* Inner glass tint */}
      <div
        className="absolute rounded-full"
        style={{
          inset: '8%',
          background:
            'radial-gradient(circle at 38% 35%, rgba(34,211,238,0.06) 0%, rgba(139,92,246,0.04) 60%, transparent 100%)',
          border: '1px solid rgba(34,211,238,0.15)',
          borderRadius: '50%',
        }}
      />
      {/* Glare streak */}
      <div
        className="absolute rounded-full"
        style={{
          inset: '12%',
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 55%)',
          borderRadius: '50%',
        }}
      />
      {/* Crosshair H */}
      <div
        className="absolute top-1/2 left-[8%] right-[8%] -translate-y-px"
        style={{ height: 1, background: 'rgba(34,211,238,0.22)' }}
      />
      {/* Crosshair V */}
      <div
        className="absolute left-1/2 top-[8%] bottom-[8%] -translate-x-px"
        style={{ width: 1, background: 'rgba(34,211,238,0.22)' }}
      />
      {/* Center dot */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: 5,
          height: 5,
          background: 'rgba(34,211,238,0.7)',
          boxShadow: '0 0 6px rgba(34,211,238,0.8)',
        }}
      />
      {/* Inner ring */}
      <div
        className="absolute rounded-full"
        style={{
          inset: '30%',
          border: '1px solid rgba(34,211,238,0.14)',
          borderRadius: '50%',
        }}
      />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   INTRO ANIMATION — cinematic telescope iris opening
   Plays automatically on mount. Page is fully accessible afterward.
═══════════════════════════════════════════════════════════════════════════ */
function TelescopeIntro({ onComplete }) {
  const { portfolioData: data } = usePortfolio();

  const [phase, setPhase] = useState('closed'); // closed | opening | glare | done

  useEffect(() => {
    // tiny pause then burst open
    const t1 = setTimeout(() => setPhase('opening'), 400);
    const t2 = setTimeout(() => setPhase('glare'), 1600);
    const t3 = setTimeout(() => {
      setPhase('done');
      onComplete?.();
    }, 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (phase === 'done') return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950"
      animate={{ opacity: phase === 'glare' ? [1, 1, 0] : 1 }}
      transition={{ duration: phase === 'glare' ? 0.8 : 0 }}
    >
      {/* Star field */}
      {Array.from({ length: 60 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: Math.random() * 1.5 + 0.5,
            height: Math.random() * 1.5 + 0.5,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.1,
          }}
          animate={{ opacity: [0.1, 0.6, 0.1] }}
          transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
        />
      ))}

      {/* Dark overlay with the iris hole */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 1 }}
        style={{ pointerEvents: 'none' }}
      >
        <motion.div
          className="absolute inset-0"
          animate={
            phase === 'closed'
              ? { background: 'radial-gradient(circle 0px at 50% 50%, transparent 99%, #020617 100%)' }
              : { background: 'radial-gradient(circle 120vmax at 50% 50%, transparent 99%, #020617 100%)' }
          }
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>

      {/* Telescope ring that expands */}
      <motion.div
        className="absolute rounded-full"
        initial={{ width: 0, height: 0, opacity: 1 }}
        animate={
          phase === 'closed'
            ? { width: 0, height: 0 }
            : { width: '96vmin', height: '96vmin', opacity: [1, 1, 0] }
        }
        transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
        style={{
          border: '2px solid rgba(34,211,238,0.55)',
          boxShadow: '0 0 40px rgba(34,211,238,0.25), inset 0 0 40px rgba(34,211,238,0.04)',
        }}
      />

      {/* Secondary ring (slight lag) */}
      <motion.div
        className="absolute rounded-full"
        initial={{ width: 0, height: 0, opacity: 0 }}
        animate={
          phase === 'closed'
            ? {}
            : { width: '82vmin', height: '82vmin', opacity: [0, 0.4, 0] }
        }
        transition={{ duration: 1.3, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        style={{ border: '1px solid rgba(139,92,246,0.35)' }}
      />

      {/* Crosshairs */}
      {[0, 90].map((rot) => (
        <motion.div
          key={rot}
          className="absolute"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={phase === 'closed' ? {} : { scaleX: 1, opacity: [0, 0.3, 0] }}
          transition={{ duration: 1.2, delay: 0.1, ease: 'easeOut' }}
          style={{
            width: '90vmin',
            height: 1,
            background: 'rgba(34,211,238,0.3)',
            rotate: rot,
            transformOrigin: 'center',
          }}
        />
      ))}

      {/* Center glare flash */}
      {phase === 'glare' && (
        <motion.div
          className="absolute rounded-full"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 4, 8], opacity: [0, 0.6, 0] }}
          transition={{ duration: 0.7 }}
          style={{
            width: 120,
            height: 120,
            background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(34,211,238,0.4) 40%, transparent 70%)',
          }}
        />
      )}

      {/* Center tiny dot (the "eye") */}
      <motion.div
        className="absolute rounded-full bg-cyan-400"
        initial={{ scale: 1, opacity: 1 }}
        animate={phase === 'opening' ? { scale: [1, 1.5, 0], opacity: [1, 1, 0] } : {}}
        transition={{ duration: 0.5, delay: 0.4 }}
        style={{ width: 8, height: 8, boxShadow: '0 0 12px rgba(34,211,238,1)' }}
      />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   AMBIENT STAR FIELD (fixed background)
═══════════════════════════════════════════════════════════════════════════ */
function StarField() {
  const { portfolioData: data } = usePortfolio();

  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    r: Math.random() * 1.4 + 0.3,
    d: 3 + Math.random() * 4,
    delay: Math.random() * 4,
    op: 0.1 + Math.random() * 0.4,
  }));

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.r, height: s.r, opacity: s.op }}
          animate={{ opacity: [s.op, s.op * 2.5, s.op] }}
          transition={{ duration: s.d, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      {/* Nebula blobs */}
      <div className="absolute top-[10%] left-[5%] w-[40vw] h-[40vw] rounded-full bg-cyan-600/[0.04] blur-[100px]" />
      <div className="absolute bottom-[20%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-violet-600/[0.05] blur-[120px]" />
      <div className="absolute top-[50%] left-[40%] w-[30vw] h-[30vw] rounded-full bg-indigo-600/[0.04] blur-[90px]" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION REVEAL
═══════════════════════════════════════════════════════════════════════════ */
function Section({ children, className = '', id = '' }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.section>
  );
}

/* ─── Section Heading ──────────────────────────────────────────────────────── */
function SectionHeading({ label, title }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="mb-16 text-center relative">
      {/* decorative circle */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border border-cyan-500/10 pointer-events-none" />
      <span className="relative inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.4em] text-cyan-400 uppercase mb-4 px-4 py-1.5 rounded-full border border-cyan-500/25 bg-cyan-500/5">
        <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
        {label}
      </span>
      <h2 className="relative text-4xl md:text-5xl font-black text-white leading-tight mt-2">
        {title}
      </h2>
      <motion.div
        className="mx-auto mt-5 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
        initial={{ width: 0 }}
        whileInView={{ width: 96 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3 }}
      />
    </div>
  );
}

/* ─── Skill Bar ────────────────────────────────────────────────────────────── */
function SkillBar({ name, level, delay = 0, category }) {
  const { portfolioData: data } = usePortfolio();

  const catColors = {
    Frontend: 'from-cyan-500 to-sky-400',
    Backend: 'from-violet-500 to-purple-400',
    Database: 'from-emerald-500 to-teal-400',
    DevOps: 'from-orange-500 to-amber-400',
    default: 'from-cyan-500 to-violet-500',
  };
  const grad = catColors[category] || catColors.default;

  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex justify-between mb-2 text-sm">
        <span className="font-semibold text-gray-200 group-hover:text-cyan-300 transition-colors duration-200">
          {name}
        </span>
        <span className="text-cyan-400 font-mono text-xs">{level}%</span>
      </div>
      <div className="h-1.5 bg-gray-800/80 rounded-full overflow-hidden relative">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${grad} relative`}
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: delay + 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* shimmer */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.5, delay: delay + 1.4, repeat: Infinity, repeatDelay: 4 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─── Project Card ─────────────────────────────────────────────────────────── */
function ProjectCard({ project, index }) {
  const { portfolioData: data } = usePortfolio();

  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative bg-gray-900/50 backdrop-blur border border-gray-800/80 rounded-2xl overflow-hidden
                 hover:border-cyan-500/40 transition-colors duration-400"
      style={{
        boxShadow: hovered
          ? '0 20px 60px rgba(34,211,238,0.1), 0 0 0 1px rgba(34,211,238,0.15)'
          : '0 4px 20px rgba(0,0,0,0.3)',
        transition: 'box-shadow 0.4s ease',
      }}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-gray-800">
        {project.image ? (
          <motion.img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            animate={{ scale: hovered ? 1.07 : 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Code2 className="w-10 h-10 text-gray-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
        {/* Lens circle on hover */}
        <motion.div
          className="absolute top-3 right-3 rounded-full border border-cyan-400/40 flex items-center justify-center"
          animate={{ width: hovered ? 36 : 28, height: hovered ? 36 : 28, opacity: hovered ? 1 : 0.4 }}
          transition={{ duration: 0.3 }}
        >
          <Eye className="w-3.5 h-3.5 text-cyan-400" />
        </motion.div>
      </div>

      <div className="p-5">
        <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(project.techStack || []).slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="text-[10px] px-2 py-0.5 rounded-full bg-gray-800 text-cyan-400/80 border border-gray-700 font-mono"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="flex gap-2.5">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg
                         bg-cyan-500/15 hover:bg-cyan-500 border border-cyan-500/30 hover:border-cyan-500
                         text-cyan-400 hover:text-gray-950 transition-all duration-200"
            >
              <Globe className="w-3 h-3" /> Live
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg
                         bg-gray-800 hover:bg-gray-700 border border-gray-700
                         text-gray-400 hover:text-white transition-all duration-200"
            >
              <Github className="w-3 h-3" /> Code
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Experience Card ──────────────────────────────────────────────────────── */
function ExperienceCard({ exp, index }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.12 }}
      className="relative pl-10 pb-10 last:pb-0"
    >
      {/* timeline line */}
      <div className="absolute left-0 top-2 bottom-0 w-px">
        <div
          className="w-full h-full"
          style={{ background: 'linear-gradient(to bottom, rgba(34,211,238,0.6), rgba(139,92,246,0.2), transparent)' }}
        />
      </div>
      {/* dot with glow */}
      <div className="absolute -left-[5px] top-2">
        <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" style={{ boxShadow: '0 0 10px rgba(34,211,238,0.8)' }} />
        <div className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping" style={{ animationDuration: '2s' }} />
      </div>

      <motion.div
        whileHover={{ x: 4 }}
        transition={{ duration: 0.2 }}
        className="bg-gray-900/50 backdrop-blur border border-gray-800 hover:border-cyan-500/25 rounded-xl p-5 transition-colors duration-300"
      >
        <div className="flex flex-wrap gap-2 justify-between items-start mb-3">
          <div>
            <h3 className="text-white font-bold">{exp.role}</h3>
            <p className="text-cyan-400 text-sm mt-0.5">{exp.company}</p>
          </div>
          <span className="text-[11px] text-gray-500 bg-gray-800/80 px-2.5 py-1 rounded-full font-mono border border-gray-700/50">
            {exp.period}
          </span>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed">{exp.description}</p>
      </motion.div>
    </motion.div>
  );
}

/* ─── Testimonial Card ─────────────────────────────────────────────────────── */
function TestimonialCard({ t, index }) {
  const { portfolioData: data } = usePortfolio();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="relative bg-gray-900/50 backdrop-blur border border-gray-800 hover:border-violet-500/30
                 rounded-2xl p-6 flex flex-col gap-4 transition-colors duration-300 overflow-hidden"
    >
      {/* bg circle decoration */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full border border-violet-500/10" />
      <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full border border-cyan-500/10" />

      <Quote className="w-6 h-6 text-violet-500/50 flex-shrink-0" />
      <p className="text-gray-300 text-sm leading-relaxed italic flex-1">"{t.text}"</p>
      <div className="flex items-center gap-3 pt-3 border-t border-gray-800/80">
        <div
          className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-violet-500/30"
          style={{ boxShadow: '0 0 12px rgba(139,92,246,0.2)' }}
        >
          {t.avatar
            ? <img src={t.avatar} alt={t.name || "Profile Avatar"} className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center text-white text-sm font-bold">{t.name?.[0]}</div>
          }
        </div>
        <div>
          <p className="text-white font-semibold text-sm">{t.name}</p>
          <p className="text-violet-400 text-xs">{t.role}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Nav ──────────────────────────────────────────────────────────────────── */
function Nav() {
  const { portfolioData: data } = usePortfolio();

  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    return scrollY.on('change', (v) => setScrolled(v > 80));
  }, [scrollY]);

  const links = ['About', 'Skills', 'Projects', 'Experience', 'Testimonials', 'Contact'];

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 2.5 }}
      className={`fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-10 py-4 transition-all duration-300 ${
        scrolled ? 'bg-gray-950/90 backdrop-blur-xl border-b border-gray-800/60' : 'bg-transparent'
      }`}
    >
      <div className="flex items-center gap-2">
        {/* mini lens icon */}
        <div className="relative w-6 h-6">
          <div className="absolute inset-0 rounded-full border border-cyan-500/60" />
          <div className="absolute inset-[3px] rounded-full border border-cyan-500/30" />
          <div className="absolute inset-[5px] rounded-full bg-cyan-500/20" />
        </div>
        <span className="text-white font-black text-base tracking-tight">
          {data.personal?.name?.split(' ')[0] ?? 'Portfolio'}
          <span className="text-cyan-400">.</span>
        </span>
      </div>
      <ul className="hidden md:flex items-center gap-7">
        {links.map((l) => (
          <li key={l}>
            <a
              href={`#${l.toLowerCase()}`}
              className="text-sm text-gray-400 hover:text-cyan-400 transition-colors duration-200 font-medium"
            >
              {l}
            </a>
          </li>
        ))}
      </ul>
      <a
        href="#contact"
        className="text-xs font-bold px-4 py-2 rounded-full border border-cyan-500/40 text-cyan-400
                   hover:bg-cyan-500 hover:text-gray-950 hover:border-cyan-500 transition-all duration-200"
      >
        Hire Me
      </a>
    </motion.nav>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const { portfolioData: data } = usePortfolio();

  const personal = data.personal ?? {};
  const social = data.socials ?? {};
  const stats = data.stats ?? {};

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 2.5 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 overflow-hidden">
      {/* Rings decorating the hero */}
      {[200, 380, 560, 740].map((size, i) => (
        <motion.div
          key={size}
          className="absolute rounded-full border border-cyan-500/[0.06] pointer-events-none"
          style={{ width: size, height: size }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 40 + i * 15, repeat: Infinity, ease: 'linear' }}
        />
      ))}
      {/* One dashed ring */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 440,
          height: 440,
          border: '1px dashed rgba(34,211,238,0.12)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center"
      >
        {/* Avatar */}
        <motion.div variants={itemVariants} className="mb-8 relative">
          <motion.div
            className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mx-auto"
            style={{
              boxShadow: '0 0 0 3px rgba(34,211,238,0.35), 0 0 0 6px rgba(34,211,238,0.08), 0 0 50px rgba(34,211,238,0.2)',
            }}
          >
            {personal.avatar
              ? <img src={personal.avatar} alt={personal.name || "Profile Avatar"} className="w-full h-full object-cover" />
              : (
                <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-5xl font-black text-white">
                  {personal.name?.[0]}
                </div>
              )
            }
          </motion.div>
          {/* Orbiting dot */}
          <motion.div
            className="absolute"
            style={{ inset: '-14px' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          >
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-cyan-400"
              style={{ boxShadow: '0 0 8px rgba(34,211,238,1)' }}
            />
          </motion.div>
          {/* Second orbiting dot, opposite */}
          <motion.div
            className="absolute"
            style={{ inset: '-14px' }}
            animate={{ rotate: -360 }}
            transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
          >
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-violet-400"
              style={{ boxShadow: '0 0 6px rgba(139,92,246,1)' }}
            />
          </motion.div>
        </motion.div>

        <motion.p variants={itemVariants} className="text-cyan-400 text-xs font-bold tracking-[0.4em] uppercase mb-5">
          Viewing through the telescope
        </motion.p>

        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 leading-none tracking-tight"
        >
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(135deg, #fff 0%, #a5f3fc 40%, #c4b5fd 100%)' }}
          >
            {personal.name}
          </span>
        </motion.h1>

        <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-400 mb-2 font-light max-w-md">
          {personal.title}
        </motion.p>

        {personal.location && (
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-1.5 text-gray-500 text-sm mb-8">
            <MapPin className="w-3.5 h-3.5 text-cyan-500" />
            {personal.location}
          </motion.div>
        )}

        {/* Stats */}
        {Object.keys(stats).length > 0 && (
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-10 mb-10">
            {[
              { label: 'Years Exp.', value: stats.yearsExperience },
              { label: 'Projects', value: stats.projectsCompleted },
              { label: 'Clients', value: stats.happyClients },
            ].filter(s => s.value != null).map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-black text-white">
                  {s.value}
                  <span className="text-cyan-400 text-2xl">+</span>
                </div>
                <div className="text-[10px] text-gray-500 tracking-widest uppercase mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Socials */}
        <motion.div variants={itemVariants} className="flex items-center justify-center gap-3 mb-12">
          {[
            { href: data.socials?.github, icon: Github, label: 'GitHub' },
            { href: data.socials?.linkedin, icon: Linkedin, label: 'LinkedIn' },
            { href: data.socials?.twitter, icon: Twitter, label: 'Twitter' },
            { href: data.socials?.email ? `mailto:${data.socials.email}` : null, icon: Mail, label: 'Email' },
          ].filter(s => s.href).map(({ href, icon: Icon, label }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              whileHover={{ scale: 1.15, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="w-11 h-11 rounded-full bg-gray-800/80 hover:bg-cyan-500 border border-gray-700 hover:border-cyan-500
                         flex items-center justify-center text-gray-400 hover:text-gray-950 transition-colors duration-200"
              style={{ boxShadow: '0 0 0 0 rgba(34,211,238,0)' }}
            >
              <Icon className="w-4 h-4" />
            </motion.a>
          ))}
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center gap-2 text-gray-600"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-4 h-4 text-cyan-500" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════════════════════════════ */
export default function TelescopeZoom() {
  const { portfolioData: data } = usePortfolio();

  const [introComplete, setIntroComplete] = useState(false);

  const personal = data.personal ?? {};
  const social = data.socials ?? {};
  const skills = data.skills ?? [];
  const projects = data.projects ?? [];
  const experience = data.experience ?? [];
  const testimonials = data.testimonials ?? [];

  const skillCategories = skills.reduce((acc, s) => {
    const cat = s.category ?? 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <div className="relative bg-gray-950 text-white font-sans overflow-x-hidden"
         style={{ cursor: 'none' }} // hide default cursor on desktop, lens replaces it
    >
      {/* Intro animation */}
      <TelescopeIntro onComplete={() => setIntroComplete(true)} />

      {/* Persistent cursor lens */}
      {introComplete && <TelescopeCursorLens />}

      <StarField />

      {/* Subtle grid */}
      <div
        className="fixed inset-0 z-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(34,211,238,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,1) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <Nav />

      <div className="relative z-10">
        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <Hero />

        {/* ── ABOUT ────────────────────────────────────────────────────── */}
        <Section id="about" className="py-28 px-6">
          <div className="max-w-5xl mx-auto">
            <SectionHeading label="Who I Am" title="About Me" />
            <div className="grid md:grid-cols-2 gap-14 items-center">
              {/* Avatar block */}
              <div className="relative flex justify-center">
                <div className="relative w-72 h-72">
                  {/* ring decoration */}
                  <motion.div
                    className="absolute inset-0 rounded-full border border-cyan-500/20"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                    style={{ margin: '-20px' }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border border-violet-500/15"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
                    style={{ margin: '-10px' }}
                  />
                  <div className="w-full h-full rounded-full overflow-hidden"
                       style={{ boxShadow: '0 0 60px rgba(34,211,238,0.12), 0 0 0 1px rgba(34,211,238,0.15)' }}>
                    {personal.avatar
                      ? <img src={personal.avatar} alt={personal.name || "Profile Avatar"} className="w-full h-full object-cover" />
                      : <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-7xl font-black text-gray-600">{personal.name?.[0]}</div>
                    }
                  </div>
                </div>
              </div>
              {/* Bio block */}
              <div>
                <p className="text-gray-300 text-lg leading-relaxed mb-8">{personal.bio}</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: MapPin, label: personal.location, color: 'text-cyan-400' },
                    { icon: Mail, label: social.email, color: 'text-violet-400' },
                  ].filter(i => i.label).map(({ icon: Icon, label, color }) => (
                    <div key={label} className="flex items-center gap-2 text-sm text-gray-400 bg-gray-800/60 px-3 py-2 rounded-lg border border-gray-700/80">
                      <Icon className={`w-3.5 h-3.5 ${color}`} />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ── SKILLS ───────────────────────────────────────────────────── */}
        <Section id="skills" className="py-28 px-6">
          <div
            className="max-w-5xl mx-auto rounded-3xl p-10 md:p-14 relative overflow-hidden"
            style={{
              background: 'radial-gradient(ellipse at 30% 20%, rgba(34,211,238,0.04) 0%, transparent 60%), rgba(17,24,39,0.5)',
              border: '1px solid rgba(55,65,81,0.8)',
            }}
          >
            {/* decorative lens */}
            <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full border border-cyan-500/8 pointer-events-none" />
            <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full border border-cyan-500/5 pointer-events-none" />

            <SectionHeading label="What I Know" title="Skills & Expertise" />
            <div className="grid md:grid-cols-2 gap-10">
              {Object.entries(skillCategories).map(([cat, catSkills], ci) => (
                <div key={cat}>
                  <h3 className="flex items-center gap-2 text-[11px] font-bold tracking-[0.3em] text-violet-400 uppercase mb-6">
                    <span className="w-6 h-px bg-violet-500" />
                    {cat}
                  </h3>
                  <div className="space-y-5">
                    {catSkills.map((skill, si) => (
                      <SkillBar
                        key={skill.name}
                        name={skill.name}
                        level={skill.level}
                        category={cat}
                        delay={si * 0.07}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="mt-14 pt-10 border-t border-gray-800/60">
              <p className="text-center text-[10px] text-gray-600 uppercase tracking-[0.3em] mb-6">Technologies</p>
              <div className="flex flex-wrap justify-center gap-2">
                {skills.map((s, i) => (
                  <motion.span
                    key={s.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="text-xs px-3 py-1.5 rounded-full bg-gray-800/80 border border-gray-700 text-gray-400
                               hover:border-cyan-500/40 hover:text-cyan-300 hover:bg-cyan-500/5 transition-all duration-200 cursor-default"
                  >
                    {s.name}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ── PROJECTS ─────────────────────────────────────────────────── */}
        <Section id="projects" className="py-28 px-6">
          <div className="max-w-6xl mx-auto">
            <SectionHeading label="My Work" title="Featured Projects" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, i) => (
                <ProjectCard key={project.title ?? i} project={project} index={i} />
              ))}
            </div>
          </div>
        </Section>

        {/* ── EXPERIENCE ───────────────────────────────────────────────── */}
        <Section id="experience" className="py-28 px-6">
          <div className="max-w-3xl mx-auto">
            <SectionHeading label="My Journey" title="Work Experience" />
            {experience.map((exp, i) => (
              <ExperienceCard key={exp.company ?? i} exp={exp} index={i} />
            ))}
          </div>
        </Section>

        {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
        <Section id="testimonials" className="py-28 px-6">
          <div className="max-w-6xl mx-auto">
            <SectionHeading label="Kind Words" title="Testimonials" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <TestimonialCard key={t.name ?? i} t={t} index={i} />
              ))}
            </div>
          </div>
        </Section>

        {/* ── CONTACT ──────────────────────────────────────────────────── */}
        <Section id="contact" className="py-28 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <SectionHeading label="Let's Talk" title="Get In Touch" />

            {/* Big lens decoration */}
            <div className="relative flex justify-center mb-12">
              <div className="relative w-48 h-48 flex items-center justify-center">
                {[48, 96, 140, 188].map((sz, i) => (
                  <motion.div
                    key={sz}
                    className="absolute rounded-full border border-cyan-500"
                    style={{ width: sz, height: sz, opacity: 0.07 + i * 0.04 }}
                    animate={{ rotate: i % 2 === 0 ? 360 : -360, scale: [1, 1.02, 1] }}
                    transition={{ rotate: { duration: 20 + i * 8, repeat: Infinity, ease: 'linear' }, scale: { duration: 4, repeat: Infinity } }}
                  />
                ))}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center border border-cyan-500/30">
                  <Mail className="w-7 h-7 text-cyan-400" />
                </div>
              </div>
            </div>

            <p className="text-gray-400 leading-relaxed mb-10">
              Whether you have a project in mind, a question, or just want to say hello — I'd love to hear from you.
            </p>

            <div className="flex flex-col gap-3 mb-10">
              {[
                { href: social.email ? `mailto:${social.email}` : null, icon: Mail, label: social.email, color: 'cyan' },
                { href: social.linkedin, icon: Linkedin, label: 'LinkedIn Profile', color: 'violet' },
                { href: social.github, icon: Github, label: 'GitHub Profile', color: 'gray' },
              ].filter(i => i.href).map(({ href, icon: Icon, label, color }) => {
                const colorMap = {
                  cyan: 'hover:border-cyan-500/40 hover:bg-cyan-500/5',
                  violet: 'hover:border-violet-500/40 hover:bg-violet-500/5',
                  gray: 'hover:border-gray-600 hover:bg-gray-800',
                };
                const iconColorMap = {
                  cyan: 'text-cyan-400',
                  violet: 'text-violet-400',
                  gray: 'text-gray-400',
                };
                return (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 4 }}
                    className={`flex items-center gap-4 p-4 rounded-xl bg-gray-900/60 border border-gray-800 ${colorMap[color]} transition-all duration-200 text-left`}
                  >
                    <Icon className={`w-5 h-5 ${iconColorMap[color]} flex-shrink-0`} />
                    <span className="text-gray-300 text-sm font-medium">{label}</span>
                  </motion.a>
                );
              })}
            </div>

            <motion.a
              href={`mailto:${social.email ?? ''}`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2.5 px-9 py-4 rounded-full font-bold text-sm text-gray-950
                         transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #22d3ee 0%, #8b5cf6 100%)',
                boxShadow: '0 0 30px rgba(34,211,238,0.25)',
              }}
            >
              <Send className="w-4 h-4" />
              Send a Message
            </motion.a>
          </div>
        </Section>

        {/* ── FOOTER ───────────────────────────────────────────────────── */}
        <footer className="py-10 px-6 border-t border-gray-800/40 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-px h-4 bg-gray-700" />
            <div className="w-4 h-4 rounded-full border border-cyan-500/30 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-cyan-400" />
            </div>
            <div className="w-px h-4 bg-gray-700" />
          </div>
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} <span className="text-cyan-500 font-semibold">{personal.name}</span>
            {' '}— Telescope Zoom Portfolio
          </p>
        </footer>
      </div>
    </div>
  );
}