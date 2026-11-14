import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import { motion } from 'framer-motion';
import {
  Terminal, Cpu, Zap, Activity, Mail, Github, Linkedin, Twitter,
  ExternalLink, MapPin, Star, ChevronDown
} from 'lucide-react';

/**
 * Tron Grid Portfolio Template
 * Category: 3D / WebGL
 * Description: Tron Legacy-style glowing grid floor extending to the horizon. Neon blue lines on black, futuristic HUD-style UI elements, glow effects everywhere.
 */

const CYAN = '#22d3ee';
const PANEL_BG = 'rgba(8,20,30,0.72)';

const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } }
};

const initialsOf = (name) => {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  return (parts.slice(0, 2).map(w => w[0].toUpperCase()).join('')) || 'UG';
};

// HUD panel with glowing corner brackets
const Panel = ({ label, children, className = '', id }) => (
  <div id={id} className={`relative border border-cyan-400/30 backdrop-blur-sm ${className}`}
    style={{ background: PANEL_BG, boxShadow: '0 0 24px rgba(34,211,238,0.08), inset 0 0 40px rgba(34,211,238,0.04)' }}>
    {['top-0 left-0 border-t-2 border-l-2', 'top-0 right-0 border-t-2 border-r-2', 'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2'].map((pos, i) => (
      <span key={i} aria-hidden className={`absolute w-5 h-5 border-cyan-300 ${pos}`} style={{ filter: 'drop-shadow(0 0 4px rgba(34,211,238,0.8))' }} />
    ))}
    {label && (
      <div className="absolute -top-3 left-6 px-3 font-mono text-[10px] uppercase tracking-[0.3em] bg-[#02060c] border border-cyan-400/40 text-cyan-300">
        {label}
      </div>
    )}
    <div className="relative p-6 md:p-8">{children}</div>
  </div>
);

// Perspective grid floor receding to a glowing horizon
const GridFloor = () => (
  <div className="absolute bottom-0 left-0 right-0 h-[46vh] overflow-hidden pointer-events-none">
    <div className="tron-grid-floor" />
    <div className="absolute inset-x-0 top-0 h-40" style={{ background: 'linear-gradient(180deg,#000205 0%, transparent 100%)' }} />
    <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${CYAN}, transparent)`, boxShadow: '0 0 24px 4px rgba(34,211,238,0.65)' }} />
  </div>
);

// Hero
const Hero = ({ data }) => (
  <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden px-6"
    style={{ background: 'radial-gradient(1000px 480px at 50% -8%, rgba(34,211,238,0.14), transparent 60%), #000205' }}>
    {/* identity disc rings */}
    <div aria-hidden className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
      style={{ width: 460, height: 460, maxWidth: '95vw', border: `1px solid rgba(34,211,238,0.14)`, boxShadow: 'inset 0 0 80px rgba(34,211,238,0.06)' }} />
    <div aria-hidden className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
      style={{ width: 300, height: 300, maxWidth: '70vw', border: `1px solid rgba(34,211,238,0.2)` }} />
    {/* drifting light particles (deterministic) */}
    {[...Array(14)].map((_, i) => (
      <motion.div key={i} className="absolute rounded-full pointer-events-none"
        style={{
          width: 3, height: 3, background: CYAN,
          left: `${((i * 37) % 100)}%`, top: `${((i * 53) % 80)}%`,
          boxShadow: '0 0 8px 1px rgba(34,211,238,0.8)', opacity: 0.6
        }}
        animate={{ y: [0, -30, 0], opacity: [0.25, 0.7, 0.25] }}
        transition={{ duration: 4 + (i % 5), repeat: Infinity, delay: i * 0.4 }} />
    ))}

    <GridFloor />

    <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 text-center max-w-3xl">
      <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 border border-cyan-400/50 bg-cyan-400/10 text-cyan-300 text-[11px] font-mono uppercase mb-8"
        style={{ letterSpacing: '0.35em', textShadow: '0 0 10px rgba(34,211,238,0.7)' }}>
        <Terminal size={13} /> Grid Online
      </motion.div>
      <motion.h1 variants={fadeUp} className="font-mono text-5xl md:text-7xl font-bold text-white mb-4 tracking-wide"
        style={{ textShadow: `0 0 8px rgba(34,211,238,0.9), 0 0 28px rgba(34,211,238,0.5), 0 0 80px rgba(34,211,238,0.3)` }}>
        {data.personal?.name || 'USER'}
      </motion.h1>
      {data.personal?.title && (
        <motion.p variants={fadeUp} className="font-mono text-base md:text-xl text-cyan-200/90 mb-3 uppercase"
          style={{ letterSpacing: '0.3em', textShadow: '0 0 12px rgba(34,211,238,0.55)' }}>
          {data.personal.title}
        </motion.p>
      )}
      {data.personal?.tagline && (
        <motion.p variants={fadeUp} className="font-mono text-sm mb-4 text-cyan-100/60 max-w-xl mx-auto">
          &gt; {data.personal.tagline}
        </motion.p>
      )}
      {data.personal?.location && (
        <motion.p variants={fadeUp} className="font-mono text-xs text-cyan-400/70 mb-10 inline-flex items-center gap-2 uppercase"
          style={{ letterSpacing: '0.2em' }}>
          <MapPin size={13} /> SECTOR :: {data.personal.location}
        </motion.p>
      )}
      <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-5">
        <a href="#about" className="tron-chamfer px-8 py-3 font-mono text-sm uppercase text-cyan-200 border border-cyan-300/70 transition-all hover:bg-cyan-400/15"
          style={{ letterSpacing: '0.25em', textShadow: '0 0 8px rgba(34,211,238,0.7)', boxShadow: '0 0 18px rgba(34,211,238,0.25)' }}>
          Enter Grid
        </a>
        <a href="#projects" className="tron-chamfer px-8 py-3 font-mono text-sm uppercase text-cyan-200/80 border border-cyan-400/30 transition-all hover:bg-cyan-400/10"
          style={{ letterSpacing: '0.25em' }}>
          Data Archive
        </a>
        <a href="#contact" className="tron-chamfer px-8 py-3 font-mono text-sm uppercase text-cyan-200/80 border border-cyan-400/30 transition-all hover:bg-cyan-400/10"
          style={{ letterSpacing: '0.25em' }}>
          Open Uplink
        </a>
      </motion.div>
    </motion.div>
    <motion.div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-cyan-400/70"
      animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
      <ChevronDown size={24} />
    </motion.div>
  </section>
);

// Stats readout strip
const StatReadout = ({ data }) => {
  const stats = [
    { k: 'YRS_EXP', v: data.stats?.yearsExperience },
    { k: 'BUILDS', v: data.stats?.projectsCompleted },
    { k: 'USERS', v: data.stats?.happyClients },
  ].filter(s => s.v !== undefined && s.v !== null && s.v !== '');
  if (stats.length === 0) return null;
  return (
    <div className="max-w-3xl mx-auto px-6 -mt-10 relative z-20">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }} variants={stagger}
        className="grid grid-cols-3 border border-cyan-400/25 divide-x divide-cyan-400/20 font-mono"
        style={{ background: PANEL_BG }}>
        {stats.map((s, i) => (
          <motion.div key={i} variants={fadeUp} className="py-4 text-center">
            <div className="text-xl md:text-2xl text-cyan-300" style={{ textShadow: '0 0 12px rgba(34,211,238,0.6)' }}>{s.v}</div>
            <div className="text-[9px] text-cyan-500/70 uppercase mt-1" style={{ letterSpacing: '0.25em' }}>{s.k}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

// Skills — system capabilities
const Capabilities = ({ data }) => {
  const categories = [...new Set(data.skills.map(s => s.category || 'CORE'))];
  return (
    <section id="skills" className="py-24" style={{ background: '#000205' }}>
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-14">
            <p className="font-mono text-[11px] uppercase text-cyan-400 mb-3 flex items-center justify-center gap-2" style={{ letterSpacing: '0.35em', textShadow: '0 0 8px rgba(34,211,238,0.6)' }}>
              <Cpu size={14} /> SYS.CAPABILITIES
            </p>
            <h2 className="font-mono text-3xl md:text-4xl font-bold text-white uppercase" style={{ letterSpacing: '0.1em', textShadow: '0 0 20px rgba(34,211,238,0.35)' }}>
              Skills
            </h2>
          </motion.div>
          {categories.map(cat => (
            <motion.div key={cat} variants={fadeUp} className="mb-10">
              <h3 className="font-mono text-xs uppercase text-cyan-500/90 mb-4" style={{ letterSpacing: '0.3em' }}>
                &gt; {cat}_
              </h3>
              <div className="grid md:grid-cols-2 gap-x-10 gap-y-4">
                {data.skills.filter(s => (s.category || 'CORE') === cat).map((skill, i) => (
                  <div key={i} className="border border-cyan-400/20 p-4 transition-colors hover:border-cyan-300/50" style={{ background: 'rgba(10,26,38,0.5)' }}>
                    <div className="flex justify-between font-mono mb-2.5">
                      <span className="text-cyan-100 text-sm">{skill.name}</span>
                      <span className="text-cyan-400 text-xs" style={{ textShadow: '0 0 8px rgba(34,211,238,0.6)' }}>{skill.level}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden" style={{ background: 'rgba(34,211,238,0.1)' }}>
                      <motion.div className="h-full"
                        style={{ background: `linear-gradient(90deg,#0e7490,${CYAN})`, boxShadow: '0 0 10px rgba(34,211,238,0.7)' }}
                        initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: (i % 2) * 0.12 }} viewport={{ once: true }} />
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
};

// Projects — data archive
const Archive = ({ data }) => (
  <section id="projects" className="py-24" style={{ background: 'radial-gradient(900px 400px at 50% 0%, rgba(34,211,238,0.06), transparent 60%), #01040a' }}>
    <div className="max-w-6xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={stagger}>
        <motion.div variants={fadeUp} className="text-center mb-14">
          <p className="font-mono text-[11px] uppercase text-cyan-400 mb-3 flex items-center justify-center gap-2" style={{ letterSpacing: '0.35em', textShadow: '0 0 8px rgba(34,211,238,0.6)' }}>
            <Zap size={14} /> DATA.ARCHIVE
          </p>
          <h2 className="font-mono text-3xl md:text-4xl font-bold text-white uppercase" style={{ letterSpacing: '0.1em', textShadow: '0 0 20px rgba(34,211,238,0.35)' }}>
            Projects
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {data.projects.map((project, i) => (
            <motion.div key={i} variants={fadeUp} className="group">
              <div className="relative border border-cyan-400/30 transition-all duration-300 group-hover:border-cyan-300/70"
                style={{
                  clipPath: 'polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)',
                  background: 'linear-gradient(160deg, rgba(14,40,56,0.85), rgba(4,12,20,0.9))',
                  boxShadow: '0 0 20px rgba(34,211,238,0.08)'
                }}>
                <span aria-hidden className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-300 group-hover:border-cyan-200 transition-colors" />
                {project.image && (
                  <div className="relative h-40 overflow-hidden">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      style={{ filter: 'saturate(0.85) contrast(1.05)' }} />
                    <div className="absolute inset-0 tron-scanlines pointer-events-none" />
                  </div>
                )}
                <div className="p-5">
                  <div className="font-mono text-[10px] text-cyan-500/80 mb-2" style={{ letterSpacing: '0.25em' }}>
                    FILE_{String(i + 1).padStart(3, '0')}
                  </div>
                  <h3 className="font-mono text-lg font-bold text-white mb-2" style={{ textShadow: '0 0 10px rgba(34,211,238,0.4)' }}>
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="text-sm leading-relaxed mb-4 line-clamp-3 text-cyan-100/60">{project.description}</p>
                  )}
                  {project.techStack?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.techStack.map((tech, j) => (
                        <span key={j} className="font-mono text-[10px] px-2 py-1 border border-cyan-400/30 text-cyan-300/90" style={{ letterSpacing: '0.12em' }}>
                          [{tech}]
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-5 font-mono text-xs uppercase" style={{ letterSpacing: '0.2em' }}>
                    {project.liveUrl && project.liveUrl !== '#' && (
                      <a href={project.liveUrl} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors" style={{ textShadow: '0 0 8px rgba(251,146,60,0.5)' }}>
                        <ExternalLink size={13} /> Execute
                      </a>
                    )}
                    {project.githubUrl && project.githubUrl !== '#' && (
                      <a href={project.githubUrl} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-cyan-300 hover:text-cyan-100 transition-colors">
                        <Github size={13} /> Source
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// Experience — operation log
const OperationLog = ({ data }) => (
  <section id="experience" className="py-24" style={{ background: '#000205' }}>
    <div className="max-w-4xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <motion.div variants={fadeUp} className="text-center mb-14">
          <p className="font-mono text-[11px] uppercase text-cyan-400 mb-3 flex items-center justify-center gap-2" style={{ letterSpacing: '0.35em', textShadow: '0 0 8px rgba(34,211,238,0.6)' }}>
            <Activity size={14} /> OPERATION.LOG
          </p>
          <h2 className="font-mono text-3xl md:text-4xl font-bold text-white uppercase" style={{ letterSpacing: '0.1em', textShadow: '0 0 20px rgba(34,211,238,0.35)' }}>
            Experience
          </h2>
        </motion.div>
        <div className="relative pl-8 border-l-2 space-y-12" style={{ borderColor: 'rgba(34,211,238,0.3)' }}>
          {data.experience.map((exp, i) => (
            <motion.div key={i} variants={fadeUp} className="relative">
              <span className="absolute -left-[41px] top-1 w-4 h-4 rotate-45 border-2"
                style={{ borderColor: CYAN, background: '#02141d', boxShadow: '0 0 12px rgba(34,211,238,0.8)' }} />
              {exp.period && (
                <div className="font-mono text-xs text-cyan-400 mb-2" style={{ letterSpacing: '0.22em' }}>&gt; {exp.period}</div>
              )}
              <h3 className="font-mono text-xl font-bold text-white" style={{ textShadow: '0 0 10px rgba(34,211,238,0.35)' }}>{exp.role}</h3>
              {exp.company && (
                <p className="font-mono text-sm text-amber-400/90 mb-2" style={{ textShadow: '0 0 8px rgba(251,146,60,0.4)' }}>{exp.company}</p>
              )}
              {exp.description && (
                <p className="text-sm leading-relaxed text-cyan-100/60">{exp.description}</p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// Testimonials — user feedback
const Feedback = ({ data }) => (
  <section id="testimonials" className="py-24" style={{ background: 'radial-gradient(900px 400px at 50% 100%, rgba(34,211,238,0.06), transparent 60%), #01040a' }}>
    <div className="max-w-6xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <motion.div variants={fadeUp} className="text-center mb-14">
          <p className="font-mono text-[11px] uppercase text-cyan-400 mb-3 flex items-center justify-center gap-2" style={{ letterSpacing: '0.35em', textShadow: '0 0 8px rgba(34,211,238,0.6)' }}>
            <Star size={14} /> USER.FEEDBACK
          </p>
          <h2 className="font-mono text-3xl md:text-4xl font-bold text-white uppercase" style={{ letterSpacing: '0.1em', textShadow: '0 0 20px rgba(34,211,238,0.35)' }}>
            Testimonials
          </h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {data.testimonials.map((t, i) => (
            <motion.div key={i} variants={fadeUp}>
              <Panel>
                <div className="font-mono text-xs text-cyan-300/90 leading-relaxed mb-5" style={{ textShadow: '0 0 6px rgba(34,211,238,0.3)' }}>
                  &ldquo;{t.text}&rdquo;
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} size={12} className="text-cyan-300" fill={CYAN} />)}
                </div>
                <div className="flex items-center gap-3">
                  {t.avatar ? (
                    <img src={t.avatar} alt={t.name} className="w-9 h-9 object-cover border border-cyan-400/40" />
                  ) : (
                    <div className="w-9 h-9 flex items-center justify-center font-mono text-[10px] font-bold text-cyan-200 border border-cyan-400/40 bg-cyan-400/10">
                      {initialsOf(t.name)}
                    </div>
                  )}
                  <div>
                    <div className="font-mono text-sm text-white">{t.name}</div>
                    {t.role && <div className="font-mono text-[10px] text-cyan-500/80 uppercase" style={{ letterSpacing: '0.15em' }}>{t.role}</div>}
                  </div>
                </div>
              </Panel>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// Contact — uplink
const Uplink = ({ data }) => (
  <section id="contact" className="relative py-24 overflow-hidden" style={{ background: '#000205' }}>
    <div className="absolute inset-x-0 bottom-0 h-40 opacity-60">
      <div className="tron-grid-floor" />
    </div>
    <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
        <motion.div variants={fadeUp}>
          <p className="font-mono text-[11px] uppercase text-cyan-400 mb-4 flex items-center justify-center gap-2" style={{ letterSpacing: '0.35em', textShadow: '0 0 8px rgba(34,211,238,0.6)' }}>
            <Mail size={14} /> COMM.UPLINK
          </p>
          <h2 className="font-mono text-3xl md:text-5xl font-bold text-white uppercase mb-4" style={{ letterSpacing: '0.08em', textShadow: '0 0 24px rgba(34,211,238,0.5)' }}>
            Initiate Contact
          </h2>
          <p className="font-mono text-sm text-cyan-100/60 mb-12">&gt; awaiting transmission from the users_</p>
        </motion.div>
        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-5 mb-16">
          {data.socials?.email && (
            <a href={`mailto:${data.socials.email}`}
              className="tron-chamfer inline-flex items-center gap-3 px-9 py-4 font-mono text-sm uppercase text-black font-bold transition-all hover:brightness-125"
              style={{ background: CYAN, boxShadow: '0 0 30px rgba(34,211,238,0.6)', letterSpacing: '0.2em' }}>
              <Mail size={17} /> Transmit
            </a>
          )}
          {['github', 'linkedin', 'twitter'].map(key => {
            const url = data.socials?.[key];
            if (!url) return null;
            const Icon = key === 'github' ? Github : key === 'linkedin' ? Linkedin : Twitter;
            return (
              <a key={key} href={url} target="_blank" rel="noreferrer" aria-label={key}
                className="inline-flex items-center justify-center w-12 h-12 border border-cyan-400/40 text-cyan-300 transition-all hover:bg-cyan-400/15 hover:border-cyan-300"
                style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}>
                <Icon size={18} />
              </a>
            );
          })}
        </motion.div>
        <motion.p variants={fadeUp} className="font-mono text-[10px] text-cyan-500/60 uppercase" style={{ letterSpacing: '0.3em' }}>
          &copy; {new Date().getFullYear()} {data.personal?.name || 'USER'} &middot; GRID.RES 1024x768
        </motion.p>
      </motion.div>
    </div>
  </section>
);

// Main component
export default function TronGrid() {
  const { portfolioData: data } = usePortfolio();

  const navItems = [
    { label: '01.ABOUT', href: '#about', show: Boolean(data.personal?.bio || data.personal?.avatar) },
    { label: '02.SKILLS', href: '#skills', show: data.skills?.length > 0 },
    { label: '03.ARCHIVE', href: '#projects', show: data.projects?.length > 0 },
    { label: '04.LOG', href: '#experience', show: data.experience?.length > 0 },
    { label: '05.FEEDBACK', href: '#testimonials', show: data.testimonials?.length > 0 },
    { label: '06.UPLINK', href: '#contact', show: true },
  ].filter(item => item.show);

  return (
    <div className="font-mono antialiased overflow-x-hidden text-cyan-100" style={{ background: '#000205' }}>
      <style>{`
        @keyframes tronGridMove { from { background-position-y: 0; } to { background-position-y: 44px; } }
        @keyframes tronScan { from { top: -12%; } to { top: 112%; } }
        .tron-grid-floor {
          position: absolute; left: -50%; right: -50%; bottom: -46%; height: 130%;
          background-image:
            linear-gradient(rgba(34,211,238,0.38) 1.5px, transparent 1.5px),
            linear-gradient(90deg, rgba(34,211,238,0.38) 1.5px, transparent 1.5px);
          background-size: 44px 44px;
          transform: perspective(420px) rotateX(62deg);
          transform-origin: top center;
          animation: tronGridMove 1.6s linear infinite;
          -webkit-mask-image: linear-gradient(180deg, transparent 0%, black 26%);
          mask-image: linear-gradient(180deg, transparent 0%, black 26%);
        }
        .tron-scanlines {
          background: repeating-linear-gradient(180deg, rgba(34,211,238,0.08) 0px, rgba(34,211,238,0.08) 1px, transparent 1px, transparent 4px);
        }
        .tron-chamfer {
          clip-path: polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px);
        }
      `}</style>

      {/* fixed HUD frame: corner brackets */}
      <div aria-hidden className="fixed top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-cyan-400/60 z-50 pointer-events-none" />
      <div aria-hidden className="fixed top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-cyan-400/60 z-50 pointer-events-none" />
      <div aria-hidden className="fixed bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-cyan-400/60 z-50 pointer-events-none" />
      <div aria-hidden className="fixed bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-cyan-400/60 z-50 pointer-events-none" />

      {/* global scanlines + travelling scan bar */}
      <div aria-hidden className="fixed inset-0 z-40 pointer-events-none tron-scanlines opacity-40" />
      <div aria-hidden className="fixed inset-x-0 h-10 z-40 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, transparent, rgba(34,211,238,0.05), transparent)', animation: 'tronScan 7s linear infinite' }} />

      {/* top HUD bar */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-cyan-400/25 backdrop-blur-md" style={{ background: 'rgba(2,6,12,0.85)' }}>
        <div className="flex items-center justify-between px-4 md:px-8 py-2.5">
          <a href="#hero" className="font-mono text-xs text-cyan-300 uppercase" style={{ letterSpacing: '0.25em', textShadow: '0 0 8px rgba(34,211,238,0.7)' }}>
            USR::{(data.personal?.name || 'USER').split(' ')[0].toUpperCase()}
          </a>
          <div className="flex gap-1 md:gap-3 overflow-x-auto max-w-[70vw]">
            {navItems.map(item => (
              <a key={item.href} href={item.href}
                className="whitespace-nowrap font-mono text-[10px] px-2 py-1 text-cyan-400/80 hover:text-cyan-200 hover:bg-cyan-400/10 transition-colors uppercase"
                style={{ letterSpacing: '0.18em' }}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <Hero data={data} />
      {(data.stats?.yearsExperience || data.stats?.projectsCompleted || data.stats?.happyClients) && <StatReadout data={data} />}
      {(data.personal?.bio || data.personal?.avatar) && (
        <section id="about" className="py-24" style={{ background: '#000205' }}>
          <div className="max-w-5xl mx-auto px-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
              <Panel label="USR.PROFILE">
                <div className="grid md:grid-cols-[auto_1fr] gap-10 items-center">
                  {data.personal?.avatar ? (
                    <img src={data.personal.avatar} alt={data.personal.name}
                      className="w-44 h-44 object-cover border border-cyan-400/50"
                      style={{ boxShadow: '0 0 24px rgba(34,211,238,0.3)', filter: 'saturate(0.8) contrast(1.08)' }} />
                  ) : (
                    <div className="w-44 h-44 flex flex-col items-center justify-center border border-cyan-400/50 bg-cyan-400/5"
                      style={{ boxShadow: '0 0 24px rgba(34,211,238,0.2)' }}>
                      <Terminal size={26} className="text-cyan-400 mb-3" />
                      <span className="font-mono text-3xl font-bold text-cyan-200" style={{ textShadow: '0 0 14px rgba(34,211,238,0.7)' }}>
                        {initialsOf(data.personal?.name)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h2 className="font-mono text-2xl md:text-3xl font-bold text-white uppercase mb-4" style={{ textShadow: '0 0 16px rgba(34,211,238,0.4)' }}>
                      The Program
                    </h2>
                    <p className="text-sm leading-relaxed text-cyan-100/70">
                      {data.personal?.bio || 'This program has not yet written its own description. It runs, it builds, it endures.'}
                    </p>
                  </div>
                </div>
              </Panel>
            </motion.div>
          </div>
        </section>
      )}
      {data.skills?.length > 0 && <Capabilities data={data} />}
      {data.projects?.length > 0 && <Archive data={data} />}
      {data.experience?.length > 0 && <OperationLog data={data} />}
      {data.testimonials?.length > 0 && <Feedback data={data} />}
      <Uplink data={data} />
    </div>
  );
}
