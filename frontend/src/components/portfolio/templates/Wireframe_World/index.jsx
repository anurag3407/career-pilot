import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Github, Linkedin, Twitter, MapPin, ExternalLink, ChevronRight,
  Box, Terminal, Quote, Compass, Crosshair, Hexagon, Globe
} from 'lucide-react';

/**
 * Wireframe World Portfolio Template
 * Category: 3D / WebGL
 * Description: Low-poly wireframe aesthetic with blueprint-style grid backgrounds. Use SVG wireframe shapes, thin neon-green lines on dark backgrounds, and rotating geometric objects.
 */

/* ------------------------------------------------------------------ */
/* Palette — blueprint dark + neon-green HUD lines                     */
/* ------------------------------------------------------------------ */
const BG0 = '#04090b';
const BG1 = '#06120e';
const BG2 = '#030807';
const NEON = '#4ef08a';
const NEON_DIM = 'rgba(78,240,138,0.32)';
const GRID = 'rgba(78,240,138,0.075)';
const TEXT = '#dcffe8';
const MUTE = 'rgba(220,255,232,0.6)';
const MONO = `ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace`;

const STYLE_CSS = `
@keyframes wwSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes wwSpinRev { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
@keyframes wwFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
@keyframes wwScan { 0% { top: -14%; } 100% { top: 112%; } }
@keyframes wwBlink { 0%,49% { opacity: 1; } 50%,100% { opacity: 0; } }
.ww-card { transition: transform .4s ease, box-shadow .4s ease, border-color .4s ease; }
.ww-card:hover { transform: translateY(-6px);
  border-color: rgba(78,240,138,0.55);
  box-shadow: 0 18px 44px rgba(0,0,0,0.55), 0 0 22px rgba(78,240,138,0.12); }
.ww-scan { opacity: 0; transition: opacity .4s ease;
  background: repeating-linear-gradient(0deg, rgba(78,240,138,0.28) 0 1px, transparent 1px 4px); }
.ww-card:hover .ww-scan { opacity: 0.5; }
.ww-link { transition: color .3s ease, background .3s ease; }
.ww-link:hover { color: ${NEON}; background: rgba(78,240,138,0.08); }
`;

/* Blueprint grid background helper */
const gridBg = (cell = 44, color = GRID) => ({
  backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
  backgroundSize: `${cell}px ${cell}px`,
});

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const initialsOf = (name) => {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  return (parts.slice(0, 2).map(w => w[0].toUpperCase()).join('')) || 'W';
};

/* ------------------------------------------------------------------ */
/* Wireframe SVG primitives — thin neon strokes, CSS-rotated           */
/* ------------------------------------------------------------------ */
const strokeProps = { fill: 'none', stroke: NEON, strokeWidth: 1.2, strokeLinejoin: 'round' };

const WireCube = ({ size = 110, dur = 22, reverse = false, opacity = 0.5, className = '', style = {} }) => (
  <div aria-hidden className={`pointer-events-none ${className}`}
    style={{ width: size, height: size, opacity, animation: `wwFloat ${dur / 2}s ease-in-out infinite`, ...style }}>
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{
      width: '100%', height: '100%',
      animation: `${reverse ? 'wwSpinRev' : 'wwSpin'} ${dur}s linear infinite`,
    }}>
      <path {...strokeProps} d="M50 8 L88 28 L50 48 L12 28 Z" />
      <path {...strokeProps} d="M12 28 L12 68 L50 88 L88 68 L88 28 M12 68 L88 68 M50 48 L50 88" />
      <circle cx="50" cy="8" r="1.6" fill={NEON} />
      <circle cx="88" cy="28" r="1.6" fill={NEON} />
      <circle cx="12" cy="28" r="1.6" fill={NEON} />
    </svg>
  </div>
);

const WireDiamond = ({ size = 90, dur = 16, reverse = true, opacity = 0.45, className = '', style = {} }) => (
  <div aria-hidden className={`pointer-events-none ${className}`}
    style={{ width: size, height: size, opacity, animation: `wwFloat ${dur / 1.7}s ease-in-out infinite`, ...style }}>
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{
      width: '100%', height: '100%',
      animation: `${reverse ? 'wwSpinRev' : 'wwSpin'} ${dur}s linear infinite`,
    }}>
      <path {...strokeProps} d="M50 6 L90 50 L50 94 L10 50 Z M50 6 L50 94" />
      <ellipse cx="50" cy="50" rx="40" ry="10" {...strokeProps} />
      <circle cx="50" cy="50" r="2" fill={NEON} />
    </svg>
  </div>
);

const WireTorus = ({ size = 80, dur = 26, reverse = false, opacity = 0.4, className = '', style = {} }) => (
  <div aria-hidden className={`pointer-events-none ${className}`}
    style={{ width: size, height: size, opacity, animation: `wwFloat ${dur / 2.4}s ease-in-out infinite`, ...style }}>
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{
      width: '100%', height: '100%',
      animation: `${reverse ? 'wwSpinRev' : 'wwSpin'} ${dur}s linear infinite`,
    }}>
      <circle cx="50" cy="50" r="42" {...strokeProps} />
      <circle cx="50" cy="50" r="26" {...strokeProps} />
      <circle cx="50" cy="50" r="10" {...strokeProps} />
      <ellipse cx="50" cy="50" rx="42" ry="13" {...strokeProps} transform="rotate(28 50 50)" />
      <ellipse cx="50" cy="50" rx="42" ry="13" {...strokeProps} transform="rotate(-62 50 50)" />
    </svg>
  </div>
);

/* Deterministic low-poly mountain mesh (hero terrain) */
const LowPolyRidge = ({ className = '' }) => {
  const peaks = [30, 72, 96, 58, 88, 44, 78, 38, 24];
  const W = 900;
  const H = 150;
  const step = W / (peaks.length - 1);
  const pts = peaks.map((p, i) => ({ x: i * step, y: H - p }));
  const ridge = pts.map(pt => `L ${pt.x} ${pt.y}`).join(' ');
  return (
    <svg aria-hidden viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none"
      className={`w-full h-36 md:h-44 ${className}`} xmlns="http://www.w3.org/2000/svg">
      {/* triangulated mesh */}
      {pts.map((pt, i) => (
        <g key={`m${i}`} style={{ opacity: 0.4 }}>
          <line x1={pt.x} y1={pt.y} x2={pt.x} y2={H} stroke={NEON} strokeWidth="0.6" />
          <line x1={pt.x} y1={pt.y} x2={pt.x + step} y2={H} stroke={NEON} strokeWidth="0.6" />
        </g>
      ))}
      <line x1="0" y1={H - 18} x2={W} y2={H - 18} stroke={NEON} strokeWidth="0.6" opacity="0.35" />
      <line x1="0" y1={H - 6} x2={W} y2={H - 6} stroke={NEON} strokeWidth="0.6" opacity="0.25" />
      <path d={`M 0 ${H} ${ridge} L ${W} ${H}`} fill="none" stroke={NEON} strokeWidth="1.6"
        style={{ filter: 'drop-shadow(0 0 6px rgba(78,240,138,0.55))' }} />
      {pts.map((pt, i) => (
        <circle key={`n${i}`} cx={pt.x} cy={pt.y} r="2.4" fill={BG0} stroke={NEON} strokeWidth="1.2" />
      ))}
    </svg>
  );
};

/* HUD corner brackets for cards */
const Corners = ({ color = 'rgba(78,240,138,0.75)', size = 10 }) => {
  const base = { width: size, height: size, position: 'absolute' };
  return (
    <span aria-hidden>
      <span style={{ ...base, top: 0, left: 0, borderTop: `1px solid ${color}`, borderLeft: `1px solid ${color}` }} />
      <span style={{ ...base, top: 0, right: 0, borderTop: `1px solid ${color}`, borderRight: `1px solid ${color}` }} />
      <span style={{ ...base, bottom: 0, left: 0, borderBottom: `1px solid ${color}`, borderLeft: `1px solid ${color}` }} />
      <span style={{ ...base, bottom: 0, right: 0, borderBottom: `1px solid ${color}`, borderRight: `1px solid ${color}` }} />
    </span>
  );
};

/* Section header — HUD readout style */
const HudHead = ({ num, label, title }) => (
  <motion.div variants={fadeUp} className="mb-12 md:mb-16">
    <p className="text-[11px] mb-3 flex items-center gap-2" style={{ letterSpacing: '0.28em', color: NEON }}>
      [ {num} <span style={{ color: NEON_DIM }}>//</span> {label} ]
    </p>
    <h2 className="text-3xl md:text-5xl font-bold tracking-tight"
      style={{ color: TEXT, textShadow: '0 0 22px rgba(78,240,138,0.22)' }}>
      {title}
    </h2>
    <div className="mt-4 h-px w-40" style={{ background: `linear-gradient(90deg, ${NEON}, transparent)` }} />
  </motion.div>
);

/* Segmented HUD skill meter */
const Meter = ({ level = 85 }) => {
  const segments = 24;
  const filled = Math.round((level / 100) * segments);
  return (
    <div aria-hidden className="flex gap-[3px]">
      {Array.from({ length: segments }, (_, s) => (
        <span key={s} style={{
          width: 6, height: 12,
          background: s < filled ? NEON : 'rgba(78,240,138,0.12)',
          boxShadow: s < filled ? '0 0 6px rgba(78,240,138,0.5)' : 'none',
        }} />
      ))}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Hero — boot screen with orbiting wireframes                         */
/* ------------------------------------------------------------------ */
const Hero = ({ data }) => {
  const name = data.personal?.name || 'My Portfolio';
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-28"
      style={{ background: `radial-gradient(900px 460px at 50% 30%, rgba(78,240,138,0.08), transparent 65%), ${BG0}` }}>
      <div aria-hidden className="absolute inset-0" style={gridBg(52)} />
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 45%, transparent 30%, rgba(4,9,11,0.85) 100%)' }} />

      {/* floating rotating geometry */}
      <WireCube size={130} dur={24} className="absolute top-[14%] right-[7%] hidden sm:block" opacity={0.55} />
      <WireDiamond size={96} dur={18} className="absolute bottom-[26%] left-[6%] hidden sm:block" opacity={0.5} />
      <WireTorus size={74} dur={30} className="absolute top-[20%] left-[10%] hidden md:block" opacity={0.4} />
      <WireDiamond size={60} dur={14} className="absolute bottom-[32%] right-[16%] hidden md:block" opacity={0.35} />

      {/* HUD corner readouts */}
      <span aria-hidden className="absolute top-24 left-6 text-[10px]" style={{ color: NEON_DIM, letterSpacing: '0.2em' }}>
        + SYS.ONLINE
      </span>
      <span aria-hidden className="absolute top-24 right-6 text-[10px]" style={{ color: NEON_DIM, letterSpacing: '0.2em' }}>
        MESH.LOD_02 +
      </span>

      <motion.div initial="hidden" animate="visible" variants={stagger} className="relative max-w-3xl w-full text-center">
        <motion.div variants={fadeUp} className="mb-8 inline-flex items-center gap-3 px-4 py-2 border"
          style={{ borderColor: NEON_DIM, background: 'rgba(78,240,138,0.06)' }}>
          <Terminal size={14} style={{ color: NEON }} />
          <span className="text-[10px]" style={{ letterSpacing: '0.3em', color: MUTE }}>PORTFOLIO.OBJ &mdash; LOADED</span>
        </motion.div>
        <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold tracking-tight mb-5"
          style={{ color: TEXT, textShadow: '0 0 34px rgba(78,240,138,0.3), 0 0 2px rgba(78,240,138,0.8)' }}>
          {name}
        </motion.h1>
        {data.personal?.title && (
          <motion.p variants={fadeUp} className="text-lg md:text-2xl font-semibold mb-4" style={{ color: NEON }}>
            {'<'} {data.personal.title} {'/'} {'>'}
          </motion.p>
        )}
        {data.personal?.tagline && (
          <motion.p variants={fadeUp} className="text-sm md:text-base max-w-xl mx-auto mb-6 leading-relaxed" style={{ color: MUTE }}>
            {data.personal.tagline}
          </motion.p>
        )}
        {data.personal?.location && (
          <motion.p variants={fadeUp} className="inline-flex items-center gap-2 text-[11px] mb-10 px-4 py-1.5 border"
            style={{ letterSpacing: '0.22em', color: MUTE, borderColor: NEON_DIM }}>
            <MapPin size={13} style={{ color: NEON }} /> GEO // {data.personal.location}
          </motion.p>
        )}
        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
          {[
            { href: '#about', label: 'INITIALIZE_ABOUT' },
            { href: '#projects', label: 'LOAD_PROJECTS' },
            { href: '#contact', label: 'OPEN_CHANNEL' },
          ].map(item => (
            <a key={item.href} href={item.href}
              className="ww-link inline-flex items-center gap-1.5 px-6 py-3 border text-[11px] font-semibold"
              style={{ borderColor: NEON_DIM, color: TEXT, letterSpacing: '0.18em' }}>
              <ChevronRight size={13} style={{ color: NEON }} /> {item.label}
            </a>
          ))}
        </motion.div>
        <motion.p variants={fadeUp} className="mt-10 text-[10px]" style={{ color: NEON_DIM, letterSpacing: '0.25em' }}>
          ~$ render world --wireframe<span style={{ animation: 'wwBlink 1.1s steps(1) infinite', color: NEON }}>_</span>
        </motion.p>
      </motion.div>

      {/* low-poly terrain mesh */}
      <div aria-hidden className="absolute bottom-0 left-0 right-0 opacity-70">
        <LowPolyRidge />
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* About — dossier readout                                             */
/* ------------------------------------------------------------------ */
const About = ({ data }) => {
  const name = data.personal?.name || 'This Entity';
  return (
    <section id="about" className="relative overflow-hidden py-24" style={{ background: BG1 }}>
      <div aria-hidden className="absolute inset-0" style={gridBg(44)} />
      <div className="relative max-w-5xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <HudHead num="01" label="ENTITY.FILE" title="About the Operator" />
          <div className="grid md:grid-cols-[auto_1fr] gap-12 items-center">
            <motion.div variants={fadeUp} className="flex justify-center">
              {/* hexagonal HUD portrait frame */}
              <div className="relative w-56 h-60 flex items-center justify-center"
                style={{
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  background: 'linear-gradient(160deg, rgba(78,240,138,0.16), rgba(78,240,138,0.04))',
                  boxShadow: '0 0 30px rgba(78,240,138,0.15) inset',
                }}>
                <div className="absolute inset-[3px]" style={{
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  background: BG1,
                }} />
                {data.personal?.avatar ? (
                  <img src={data.personal.avatar} alt={name}
                    className="relative w-[200px] h-[218px] object-cover"
                    style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', filter: 'saturate(0.8) contrast(1.05)' }} />
                ) : (
                  <div className="relative flex flex-col items-center">
                    <Hexagon size={30} style={{ color: NEON }} className="mb-4" />
                    <span className="text-5xl font-bold tracking-widest" style={{ color: TEXT, textShadow: '0 0 18px rgba(78,240,138,0.4)' }}>
                      {initialsOf(name)}
                    </span>
                    <span className="mt-3 text-[9px]" style={{ letterSpacing: '0.35em', color: NEON_DIM }}>NO.IMG_FEED</span>
                  </div>
                )}
              </div>
            </motion.div>
            <motion.div variants={fadeUp}>
              <p className="text-[10px] mb-4" style={{ letterSpacing: '0.3em', color: NEON }}>[ BIO.LOG.DUMP ]</p>
              <p className="text-base md:text-lg leading-relaxed border-l-2 pl-5" style={{ color: MUTE, borderColor: NEON_DIM }}>
                {data.personal?.bio || `${name} has not yet rendered a biography. This mesh is still under construction.`}
              </p>
              {(data.stats?.yearsExperience || data.stats?.projectsCompleted || data.stats?.happyClients) && (
                <div className="grid grid-cols-3 gap-4 mt-9">
                  {[
                    { label: 'UPTIME_YRS', value: data.stats.yearsExperience },
                    { label: 'BUILDS_DONE', value: data.stats.projectsCompleted },
                    { label: 'CLIENTS_OK', value: data.stats.happyClients },
                  ].filter(s => s.value !== undefined && s.value !== null && s.value !== '').map((s, i) => (
                    <div key={i} className="relative p-4 border text-center" style={{ borderColor: NEON_DIM, background: 'rgba(78,240,138,0.05)' }}>
                      <Corners color="rgba(78,240,138,0.5)" size={8} />
                      <div className="text-3xl font-bold" style={{ color: TEXT }}>{s.value}</div>
                      <div className="text-[9px] mt-1.5" style={{ letterSpacing: '0.2em', color: NEON_DIM }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Skills — segmented capability meters                                */
/* ------------------------------------------------------------------ */
const Skills = ({ data }) => (
  <section id="skills" className="relative overflow-hidden py-24" style={{ background: BG0 }}>
    <div aria-hidden className="absolute inset-0" style={gridBg(64, 'rgba(78,240,138,0.05)')} />
    <WireTorus size={120} dur={34} className="absolute top-16 right-[4%] hidden lg:block" opacity={0.25} />
    <div className="relative max-w-4xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <HudHead num="02" label="CAPABILITY.MATRIX" title="Skill Modules" />
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-7">
          {data.skills.map((skill, i) => (
            <motion.div key={i} variants={fadeUp} className="p-4 border" style={{ borderColor: 'rgba(78,240,138,0.2)', background: 'rgba(78,240,138,0.03)' }}>
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-base" style={{ color: TEXT }}>{skill.name}</span>
                <span className="text-[11px] font-bold" style={{ color: NEON }}>{skill.level || 85}%</span>
              </div>
              <Meter level={skill.level || 85} />
              {skill.category && (
                <span className="text-[9px] mt-2.5 inline-block" style={{ letterSpacing: '0.25em', color: NEON_DIM }}>
                  MODULE.{String(skill.category).toUpperCase().replace(/\s+/g, '_')}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Projects — asset inspector cards                                    */
/* ------------------------------------------------------------------ */
const ProjectGlyph = ({ variant = 0 }) => (
  <div aria-hidden className="w-full h-40 flex items-center justify-center border-b" style={{ borderColor: 'rgba(78,240,138,0.2)' }}>
    {variant === 0 && <WireCube size={92} dur={20} opacity={0.8} />}
    {variant === 1 && <WireDiamond size={80} dur={15} opacity={0.8} />}
    {variant === 2 && <WireTorus size={84} dur={24} opacity={0.8} />}
  </div>
);

const Projects = ({ data }) => (
  <section id="projects" className="relative overflow-hidden py-24" style={{ background: BG1 }}>
    <div aria-hidden className="absolute inset-0" style={gridBg(44)} />
    <div className="relative max-w-6xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={stagger}>
        <HudHead num="03" label="ASSET.LIBRARY" title="Project Files" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {data.projects.map((project, i) => (
            <motion.article key={i} variants={fadeUp} className="ww-card relative border"
              style={{ borderColor: 'rgba(78,240,138,0.25)', background: 'rgba(4,9,11,0.75)' }}>
              <Corners />
              <div className="relative overflow-hidden">
                {project.image ? (
                  <img src={project.image} alt={project.title} className="w-full h-40 object-cover" style={{ filter: 'saturate(0.75) contrast(1.05)' }} />
                ) : (
                  <ProjectGlyph variant={i % 3} />
                )}
                <div aria-hidden className="ww-scan absolute inset-0 pointer-events-none" />
                <span aria-hidden className="absolute top-2 left-2 text-[9px] px-2 py-0.5 border"
                  style={{ color: NEON, borderColor: NEON_DIM, background: 'rgba(4,9,11,0.8)', letterSpacing: '0.2em' }}>
                  OBJ_{String(i + 1).padStart(3, '0')}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold mb-2" style={{ color: TEXT }}>{project.title}</h3>
                {project.description && (
                  <p className="text-[13px] leading-relaxed mb-4 line-clamp-3" style={{ color: MUTE }}>{project.description}</p>
                )}
                {project.techStack?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.techStack.map((tech, j) => (
                      <span key={j} className="text-[10px] px-2 py-0.5 border"
                        style={{ color: NEON, borderColor: 'rgba(78,240,138,0.3)', background: 'rgba(78,240,138,0.06)' }}>
                        [{tech}]
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-3 text-[11px] font-semibold" style={{ letterSpacing: '0.14em' }}>
                  {project.liveUrl && project.liveUrl !== '#' && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer"
                      className="ww-link inline-flex items-center gap-1.5 px-3 py-1.5 border" style={{ color: NEON, borderColor: NEON_DIM }}>
                      <ExternalLink size={12} /> VIEW
                    </a>
                  )}
                  {project.githubUrl && project.githubUrl !== '#' && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer"
                      className="ww-link inline-flex items-center gap-1.5 px-3 py-1.5 border" style={{ color: MUTE, borderColor: 'rgba(78,240,138,0.25)' }}>
                      <Github size={12} /> SRC
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Experience — mission log                                            */
/* ------------------------------------------------------------------ */
const Experience = ({ data }) => (
  <section id="experience" className="relative overflow-hidden py-24" style={{ background: BG0 }}>
    <div aria-hidden className="absolute inset-0" style={gridBg(64, 'rgba(78,240,138,0.05)')} />
    <div className="relative max-w-4xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <HudHead num="04" label="MISSION.LOG" title="Flight History" />
        <div className="relative border-l pl-8 md:pl-10 space-y-10" style={{ borderColor: NEON_DIM }}>
          {data.experience.map((exp, i) => (
            <motion.div key={i} variants={fadeUp} className="relative">
              <span aria-hidden className="absolute -left-[37px] md:-left-[45px] top-1 w-3 h-3 rotate-45 border-2"
                style={{ background: BG0, borderColor: NEON, boxShadow: '0 0 10px rgba(78,240,138,0.5)' }} />
              <p className="text-[10px] mb-2" style={{ letterSpacing: '0.22em', color: NEON }}>
                [{exp.period || 'PERIOD.UNKNOWN'}] &nbsp;T+{String(i).padStart(2, '0')}
              </p>
              <h3 className="text-xl md:text-2xl font-bold" style={{ color: TEXT }}>
                <span style={{ color: NEON }}>{'>'}</span> {exp.role}
              </h3>
              {exp.company && (
                <p className="text-sm mb-2" style={{ color: NEON_DIM }}>@ {exp.company}</p>
              )}
              {exp.description && (
                <p className="text-sm leading-relaxed" style={{ color: MUTE }}>{exp.description}</p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Testimonials — intercepted transmissions                            */
/* ------------------------------------------------------------------ */
const Testimonials = ({ data }) => (
  <section id="testimonials" className="relative overflow-hidden py-24" style={{ background: BG1 }}>
    <div aria-hidden className="absolute inset-0" style={gridBg(44)} />
    <WireCube size={110} dur={28} reverse className="absolute bottom-12 right-[5%] hidden lg:block" opacity={0.22} />
    <div className="relative max-w-6xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <HudHead num="05" label="SIGNAL.RECEIVED" title="Incoming Transmissions" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {data.testimonials.map((t, i) => (
            <motion.figure key={i} variants={fadeUp} className="ww-card relative border p-6"
              style={{ borderColor: 'rgba(78,240,138,0.25)', background: 'rgba(4,9,11,0.7)' }}>
              <Corners color="rgba(78,240,138,0.45)" size={8} />
              <div className="flex items-center gap-2 mb-4">
                <Quote size={15} style={{ color: NEON }} />
                <span className="text-[9px]" style={{ letterSpacing: '0.28em', color: NEON_DIM }}>
                  SIG.{String(i + 1).padStart(3, '0')} &mdash; CLEAR
                </span>
              </div>
              <blockquote className="text-sm leading-relaxed mb-5" style={{ color: TEXT }}>
                {t.text}
              </blockquote>
              <figcaption className="flex items-center gap-3 border-t pt-4" style={{ borderColor: 'rgba(78,240,138,0.2)' }}>
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 object-cover" style={{ filter: 'saturate(0.8)' }} />
                ) : (
                  <div className="w-9 h-9 flex items-center justify-center text-xs font-bold border"
                    style={{ color: NEON, borderColor: NEON_DIM, background: 'rgba(78,240,138,0.08)' }}>
                    {initialsOf(t.name)}
                  </div>
                )}
                <div>
                  <div className="text-sm font-bold" style={{ color: TEXT }}>{t.name}</div>
                  {t.role && <div className="text-[11px]" style={{ color: MUTE }}>{t.role}</div>}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Contact — transmission console                                      */
/* ------------------------------------------------------------------ */
const Contact = ({ data }) => {
  const email = data.personal?.email || data.socials?.email;
  const socials = [
    { key: 'github', url: data.socials?.github, Icon: Github },
    { key: 'linkedin', url: data.socials?.linkedin, Icon: Linkedin },
    { key: 'twitter', url: data.socials?.twitter, Icon: Twitter },
  ].filter(s => s.url);
  return (
    <section id="contact" className="relative overflow-hidden py-24" style={{ background: BG2 }}>
      <div aria-hidden className="absolute inset-0" style={gridBg(52)} />
      <div className="relative max-w-2xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
          <HudHead num="06" label="COMMS.CHANNEL" title="Open a Channel" />
          <motion.div variants={fadeUp} className="relative border p-6 md:p-8"
            style={{ borderColor: NEON_DIM, background: 'rgba(78,240,138,0.05)' }}>
            <Corners />
            <p className="text-[11px] leading-relaxed mb-6" style={{ color: MUTE }}>
              <span style={{ color: NEON }}>~$</span> establish_link --target="visitor"
              <br />
              <span style={{ color: NEON }}>&gt;</span> channel_status: <span style={{ color: NEON }}>READY</span>
              <br />
              <span style={{ color: NEON }}>&gt;</span> handshake: awaiting your signal
              <span style={{ animation: 'wwBlink 1.1s steps(1) infinite', color: NEON }}>_</span>
            </p>
            <div className="flex flex-wrap gap-4">
              {email && (
                <a href={`mailto:${email}`}
                  className="ww-link inline-flex items-center gap-2 px-6 py-3 border text-[11px] font-bold"
                  style={{ borderColor: NEON, color: BG0, background: NEON, letterSpacing: '0.18em', boxShadow: '0 0 22px rgba(78,240,138,0.35)' }}>
                  <Mail size={15} /> SEND_TRANSMISSION
                </a>
              )}
              {data.personal?.phone && (
                <a href={`tel:${data.personal.phone.replace(/\s+/g, '')}`}
                  className="ww-link inline-flex items-center gap-2 px-6 py-3 border text-[11px] font-semibold"
                  style={{ borderColor: NEON_DIM, color: TEXT, letterSpacing: '0.18em' }}>
                  <Crosshair size={14} style={{ color: NEON }} /> DIRECT_LINE
                </a>
              )}
              {socials.map(({ key, url, Icon }) => (
                <a key={key} href={url} target="_blank" rel="noreferrer" aria-label={key}
                  className="ww-link inline-flex items-center justify-center w-11 h-11 border"
                  style={{ borderColor: NEON_DIM, color: TEXT }}>
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </motion.div>
          <motion.p variants={fadeUp} className="mt-8 text-center text-[10px] flex items-center justify-center gap-2"
            style={{ color: NEON_DIM, letterSpacing: '0.25em' }}>
            <Globe size={13} /> ALL FREQUENCIES MONITORED &mdash; RESPONSE WITHIN 24H
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */
export default function WireframeWorld() {
  const { portfolioData: data } = usePortfolio();
  const name = data.personal?.name || 'My Portfolio';

  const navItems = [
    { label: '01.ABOUT', href: '#about', show: Boolean(data.personal?.bio || data.personal?.avatar) },
    { label: '02.SKILLS', href: '#skills', show: data.skills?.length > 0 },
    { label: '03.PROJECTS', href: '#projects', show: data.projects?.length > 0 },
    { label: '04.LOG', href: '#experience', show: data.experience?.length > 0 },
    { label: '05.SIGNALS', href: '#testimonials', show: data.testimonials?.length > 0 },
    { label: '06.COMMS', href: '#contact', show: true },
  ].filter(item => item.show);

  return (
    <div className="antialiased overflow-x-hidden" style={{ background: BG0, color: TEXT, fontFamily: MONO }}>
      <style>{STYLE_CSS}</style>

      {/* sweeping scanline overlay */}
      <div aria-hidden className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 45 }}>
        <div className="absolute left-0 right-0 h-20"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(78,240,138,0.05), transparent)', animation: 'wwScan 9s linear infinite' }} />
      </div>

      {/* HUD nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 border-b backdrop-blur-sm"
        style={{ borderColor: 'rgba(78,240,138,0.2)', background: 'rgba(4,9,11,0.85)' }}>
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <a href="#hero" className="text-[11px] font-bold whitespace-nowrap" style={{ color: NEON, letterSpacing: '0.15em' }}>
            WW://{name}
          </a>
          <div className="hidden md:flex gap-5 overflow-x-auto">
            {navItems.map(item => (
              <a key={item.href} href={item.href} className="ww-link text-[10px] px-1.5 py-0.5 whitespace-nowrap"
                style={{ color: MUTE, letterSpacing: '0.18em' }}>
                {item.label}
              </a>
            ))}
          </div>
          <a href="#contact" className="md:hidden text-[10px]" style={{ color: NEON, letterSpacing: '0.18em' }}>
            06.COMMS
          </a>
        </div>
      </nav>

      <Hero data={data} />
      {(data.personal?.bio || data.personal?.avatar) && <About data={data} />}
      {data.skills?.length > 0 && <Skills data={data} />}
      {data.projects?.length > 0 && <Projects data={data} />}
      {data.experience?.length > 0 && <Experience data={data} />}
      {data.testimonials?.length > 0 && <Testimonials data={data} />}
      <Contact data={data} />

      <footer className="border-t py-7" style={{ borderColor: 'rgba(78,240,138,0.2)', background: BG2 }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-[10px]" style={{ color: MUTE, letterSpacing: '0.2em' }}>
            &copy; {new Date().getFullYear()} {name}
          </p>
          <p className="text-[10px]" style={{ color: NEON_DIM, letterSpacing: '0.2em' }}>
            WIREFRAME.WORLD &mdash; RENDER STATUS: NOMINAL
          </p>
        </div>
      </footer>
    </div>
  );
}
