import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import { motion } from 'framer-motion';
import {
  Gauge, Power, Mail, Github, Linkedin, Twitter, ExternalLink, Wrench,
  Flag, Star, User, ChevronDown, Cog, Route, Timer
} from 'lucide-react';

/**
 * Carbon Fiber Portfolio Template
 * Category: Dark / Moody
 * Description: Carbon fiber texture pattern backgrounds, metallic silver/chrome accents, industrial aesthetic. Feels like a sports car dashboard.
 */

const RED = '#e10600';
const CARBON_BG = {
  backgroundColor: '#0c0d10',
  backgroundImage:
    'repeating-linear-gradient(0deg, rgba(255,255,255,0.028) 0 1px, transparent 1px 4px),' +
    'repeating-linear-gradient(90deg, rgba(255,255,255,0.028) 0 1px, transparent 1px 4px),' +
    'repeating-linear-gradient(45deg, #17181d 0 7px, #101216 7px 14px)'
};
const PANEL_BG = {
  backgroundColor: '#14161b',
  backgroundImage:
    'repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 4px),' +
    'repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 4px)'
};
const chromeText = {
  backgroundImage: 'linear-gradient(180deg, #f4f5f7 0%, #b7bcc4 45%, #6f757e 70%, #a9aeb6 100%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent'
};

const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } }
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const RacingStripe = ({ className = '' }) => (
  <div aria-hidden="true" className={`h-[3px] w-full ${className}`}
    style={{ backgroundImage: `repeating-linear-gradient(90deg, ${RED} 0 14px, transparent 14px 24px)` }} />
);

/* ---------- Gauge (SVG dial with red needle) ---------- */

const Gauge_ = ({ value = 85, label = '', size = 'w-full', sweepDelay = 0 }) => {
  const pct = Math.max(0, Math.min(100, Number(value) || 0)) / 100;
  const ARC = 138.2;
  const angle = -90 + pct * 180;
  const ticks = Array.from({ length: 9 }, (_, i) => -90 + i * 22.5);
  return (
    <div className={`${size} flex flex-col items-center`}>
      <svg viewBox="0 0 120 74" className="w-full max-w-[190px]" aria-hidden="true">
        <path d="M 16 60 A 44 44 0 0 1 104 60" fill="none" stroke="#2a2d33" strokeWidth="7" strokeLinecap="round" />
        <motion.path d="M 16 60 A 44 44 0 0 1 104 60" fill="none" stroke={RED} strokeWidth="7" strokeLinecap="round"
          strokeDasharray="0 138.2" whileInView={{ strokeDasharray: `${pct * ARC} 138.2` }}
          viewport={{ once: true }} transition={{ duration: 1.2, delay: sweepDelay, ease: 'easeOut' }} />
        {ticks.map((t, i) => (
          <line key={i} x1="60" y1="18" x2="60" y2={i % 2 === 0 ? '26' : '23'} stroke={i >= 7 ? RED : '#565b63'}
            strokeWidth="2" strokeLinecap="round"
            transform={`rotate(${t} 60 60)`} />
        ))}
        <motion.g style={{ transformOrigin: '60px 60px' }}
          initial={{ rotate: -90 }} whileInView={{ rotate: angle }}
          viewport={{ once: true }} transition={{ duration: 1.2, delay: sweepDelay, ease: 'easeOut' }}>
          <line x1="60" y1="60" x2="60" y2="21" stroke="#e8eaee" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="60" y1="60" x2="60" y2="27" stroke={RED} strokeWidth="4" strokeLinecap="round" />
        </motion.g>
        <circle cx="60" cy="60" r="5.5" fill={RED} stroke="#0c0d10" strokeWidth="1.5" />
      </svg>
      <div className="font-mono text-sm font-bold -mt-1" style={{ color: '#e8eaee', textShadow: `0 0 8px ${RED}66` }}>
        {Math.round(Number(value) || 0)}
      </div>
      {label && <div className="text-[9px] font-mono uppercase tracking-[0.25em] text-gray-500 mt-1">{label}</div>}
    </div>
  );
};

/* ---------- Hero (instrument cluster) ---------- */

const Hero = ({ p, stats }) => {
  const hasGauges = stats && (stats.yearsExperience || stats.projectsCompleted);
  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-4 py-24 overflow-hidden" style={CARBON_BG}>
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(225,6,0,0.09), transparent 55%)' }} />
      <motion.div className="relative z-10 w-full max-w-3xl text-center" initial="hidden" animate="visible" variants={stagger}>
        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-600/60 bg-black/40 mb-8">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: RED, boxShadow: `0 0 8px ${RED}` }} />
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-gray-300">Engine · Running</span>
        </motion.div>

        <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-3" style={chromeText}>
          {p.name}
        </motion.h1>
        <motion.p variants={fadeUp} className="text-lg md:text-xl font-mono uppercase tracking-[0.3em] mb-10" style={{ color: RED }}>
          {p.title || 'Performance Engineer'}
        </motion.p>

        {hasGauges && (
          <motion.div variants={fadeUp}
            className="mx-auto max-w-xl rounded-2xl border border-gray-700/60 p-6 grid grid-cols-3 items-end gap-2 shadow-2xl"
            style={PANEL_BG}>
            <Gauge_ value={stats.yearsExperience || 0} label="Years" />
            <div className="pb-4">
              <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-gray-500">Odometer</div>
              <div className="font-mono text-xl font-bold text-gray-100">{stats.projectsCompleted || 0}</div>
              <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-gray-500 mt-1">Builds Done</div>
            </div>
            <Gauge_ value={stats.happyClients || 0} label="Clients" sweepDelay={0.2} />
          </motion.div>
        )}

        <motion.div variants={fadeUp} className="flex justify-center items-center gap-5 flex-wrap mt-10">
          <a href="#projects" className="group flex items-center gap-3 pl-5 pr-6 py-3 rounded-full text-white text-sm font-bold uppercase tracking-widest transition-all hover:brightness-110"
            style={{ background: 'linear-gradient(180deg, #ff2b1f, #b80500)', boxShadow: `inset 0 1px 0 rgba(255,255,255,0.3), 0 8px 24px ${RED}44` }}>
            <Power size={17} className="group-hover:rotate-90 transition-transform duration-500" /> Ignition
          </a>
          <a href="#contact" className="px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest border border-gray-500/60 text-gray-300 hover:text-white hover:border-gray-300 transition-colors"
            style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01))' }}>
            Pit Wall
          </a>
        </motion.div>
      </motion.div>

      <motion.div className="absolute bottom-7 text-gray-500 z-10" animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2.2 }}>
        <ChevronDown size={24} />
      </motion.div>
      <style>{`@keyframes needleSweep { from { transform: rotate(-90deg); } }`}</style>
    </section>
  );
};

/* ---------- About (driver profile plate) ---------- */

const About = ({ p, stats }) => {
  const hasStats = stats && (stats.yearsExperience || stats.projectsCompleted || stats.happyClients);
  if (!p.bio && !p.avatar && !hasStats) return null;
  const monogram = (p.name || '').trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  const readouts = [
    { label: 'Years Experience', value: stats?.yearsExperience },
    { label: 'Builds Delivered', value: stats?.projectsCompleted },
    { label: 'Happy Clients', value: stats?.happyClients },
  ].filter((s) => s.value !== undefined && s.value !== null && s.value !== '');

  return (
    <section id="about" className="relative py-24 px-6" style={CARBON_BG}>
      <RacingStripe className="absolute top-0 left-0" />
      <div className="max-w-5xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={stagger}
          className="rounded-2xl border border-gray-700/50 p-8 md:p-10 shadow-2xl" style={PANEL_BG}>
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
            <User size={16} style={{ color: RED }} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-gray-400">Driver Profile · 01</span>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-600/70 to-transparent" />
          </motion.div>
          <div className="grid md:grid-cols-[auto,1fr] gap-10 items-center">
            <motion.div variants={fadeUp} className="mx-auto">
              {p.avatar
                ? <img src={p.avatar} alt={p.name}
                    className="w-52 h-52 object-cover rounded-xl border border-gray-600/60 shadow-2xl"
                    style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08), 0 20px 40px rgba(0,0,0,0.6)' }} />
                : <div className="w-52 h-52 flex items-center justify-center rounded-xl border border-gray-600/60"
                    style={{ background: 'linear-gradient(160deg, #2a2d34, #14161b)' }}>
                    <span className="text-6xl font-black" style={chromeText}>{monogram || <User size={56} className="text-gray-500" />}</span>
                  </div>}
              <div className="mt-4 text-center font-mono text-[9px] uppercase tracking-[0.3em] text-gray-500">Serial {monogram || 'CF-01'}</div>
            </motion.div>
            <motion.div variants={fadeUp}>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4" style={chromeText}>About the Driver</h2>
              {p.bio && <p className="text-gray-400 leading-relaxed mb-8 max-w-xl">{p.bio}</p>}
              {readouts.length > 0 && (
                <div className="grid grid-cols-3 gap-3 max-w-md">
                  {readouts.map((s, i) => (
                    <div key={i} className="rounded-lg border border-gray-700/60 bg-black/50 p-3 text-center">
                      <div className="font-mono text-xl font-bold" style={{ color: RED, textShadow: `0 0 10px ${RED}55` }}>{s.value}</div>
                      <div className="font-mono text-[8px] uppercase tracking-widest text-gray-500 mt-1">{s.label}</div>
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

/* ---------- Skills (gauge cluster) ---------- */

const Skills = ({ skills }) => {
  if (!skills?.length) return null;
  return (
    <section id="skills" className="py-24 px-6" style={CARBON_BG}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-12">
            <Gauge size={16} style={{ color: RED }} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-gray-400">Instrument Cluster · 02</span>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-600/70 to-transparent" />
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight" style={chromeText}>Dials</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {skills.map((s, i) => (
              <motion.div key={i} variants={fadeUp} whileHover={{ y: -4 }}
                className="rounded-xl border border-gray-700/50 p-5 shadow-xl"
                style={{ ...PANEL_BG, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 12px 30px rgba(0,0,0,0.5)' }}>
                <div className="flex items-baseline justify-between mb-3">
                  <h3 className="font-bold text-gray-200">{s.name}</h3>
                  {s.category && <span className="font-mono text-[9px] uppercase tracking-widest text-gray-500">{s.category}</span>}
                </div>
                <Gauge_ value={s.level || 85} label="Proficiency" sweepDelay={(i % 3) * 0.15} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ---------- Projects (garage models) ---------- */

const Projects = ({ projects }) => {
  if (!projects?.length) return null;
  return (
    <section id="projects" className="py-24 px-6" style={CARBON_BG}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-12">
            <Cog size={16} style={{ color: RED }} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-gray-400">The Garage · 03</span>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-600/70 to-transparent" />
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight" style={chromeText}>Builds</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => {
              const tech = Array.isArray(project.techStack) ? project.techStack : [];
              return (
                <motion.article key={i} variants={fadeUp} whileHover={{ y: -6 }}
                  className="rounded-xl border border-gray-700/50 overflow-hidden shadow-2xl"
                  style={{ ...PANEL_BG, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 16px 36px rgba(0,0,0,0.55)' }}>
                  <div className="h-[3px]" style={{ backgroundImage: `repeating-linear-gradient(90deg, ${RED} 0 12px, transparent 12px 20px)` }} />
                  {project.image && (
                    <div className="h-44 overflow-hidden border-b border-gray-700/50">
                      <img src={project.image} alt={project.title}
                        className="w-full h-full object-cover grayscale-[35%] group-hover:grayscale-0 transition-all duration-500" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: RED }}>Model CF-{String(i + 1).padStart(2, '0')}</span>
                      <span className="font-mono text-[9px] uppercase tracking-widest text-gray-600">Track ready</span>
                    </div>
                    <h3 className="text-lg font-black uppercase tracking-wide text-gray-100 mb-2">{project.title}</h3>
                    {project.description && <p className="text-sm text-gray-400 leading-relaxed mb-4">{project.description}</p>}
                    {tech.length > 0 && (
                      <div className="border-t border-gray-700/50 pt-3 mt-3">
                        <div className="font-mono text-[8px] uppercase tracking-[0.3em] text-gray-500 mb-2">Spec sheet</div>
                        <div className="flex flex-wrap gap-1.5">
                          {tech.map((t, j) => (
                            <span key={j} className="px-2 py-0.5 rounded font-mono text-[10px] bg-black/50 border border-gray-700/60 text-gray-300">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex gap-3 mt-5">
                      {project.liveUrl && project.liveUrl !== '#' && (
                        <a href={project.liveUrl} target="_blank" rel="noreferrer"
                          className="flex-1 inline-flex justify-center items-center gap-1.5 py-2 rounded-md text-xs font-bold uppercase tracking-widest text-white transition-all hover:brightness-110"
                          style={{ background: 'linear-gradient(180deg, #ff2b1f, #b80500)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)' }}>
                          <Flag size={13} /> Test Drive
                        </a>
                      )}
                      {project.githubUrl && project.githubUrl !== '#' && (
                        <a href={project.githubUrl} target="_blank" rel="noreferrer" aria-label="Blueprint"
                          className="inline-flex justify-center items-center gap-1.5 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest text-gray-300 border border-gray-600/60 hover:border-gray-300 hover:text-white transition-colors">
                          <Github size={13} /> Blueprint
                        </a>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ---------- Experience (service history) ---------- */

const Experience = ({ experience }) => {
  if (!experience?.length) return null;
  return (
    <section id="experience" className="py-24 px-6" style={CARBON_BG}>
      <div className="max-w-4xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-12">
            <Wrench size={16} style={{ color: RED }} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-gray-400">Service History · 04</span>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-600/70 to-transparent" />
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight" style={chromeText}>Experience</h2>
          </motion.div>
          <div className="space-y-4">
            {experience.map((exp, i) => (
              <motion.div key={i} variants={fadeUp} whileHover={{ x: 6 }}
                className="rounded-xl border border-gray-700/50 p-6 flex flex-col md:flex-row md:items-start gap-5"
                style={PANEL_BG}>
                <div className="md:w-44 shrink-0">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-black/60 border border-gray-700/60">
                    <Timer size={12} style={{ color: RED }} />
                    <span className="font-mono text-[10px] font-bold tracking-wider text-gray-300">{exp.period || 'LOG'}</span>
                  </div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-gray-600 mt-2">Entry #{String(i + 1).padStart(3, '0')}</div>
                </div>
                <div className="border-l-2 pl-5" style={{ borderColor: RED }}>
                  <h3 className="font-black uppercase tracking-wide text-gray-100">{exp.role}</h3>
                  <p className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-2">{exp.company}</p>
                  {exp.description && <p className="text-sm text-gray-400 leading-relaxed">{exp.description}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ---------- Testimonials (driver reviews) ---------- */

const Testimonials = ({ testimonials }) => {
  if (!testimonials?.length) return null;
  return (
    <section id="testimonials" className="py-24 px-6" style={CARBON_BG}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-12">
            <Route size={16} style={{ color: RED }} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-gray-400">Co-Driver Reviews · 05</span>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-600/70 to-transparent" />
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight" style={chromeText}>Testimonials</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUp}
                className="rounded-xl border border-gray-700/50 p-6"
                style={{ ...PANEL_BG, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }}>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={13} className={j < 4 ? 'fill-current' : 'opacity-30'} style={{ color: RED }} />
                  ))}
                </div>
                <p className="text-sm text-gray-300 leading-relaxed italic mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3 border-t border-gray-700/50 pt-4">
                  {t.avatar
                    ? <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover border border-gray-600" />
                    : <div className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                        style={{ background: 'linear-gradient(160deg, #3a3e46, #1a1c21)' }}>
                        {(t.name || '').trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase() || '?'}
                      </div>}
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-gray-200 truncate">{t.name}</div>
                    <div className="font-mono text-[10px] uppercase tracking-wider text-gray-500 truncate">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ---------- Contact (pit wall) ---------- */

const Contact = ({ p, socials }) => {
  const links = [
    { url: socials?.github, label: 'GitHub', Icon: Github },
    { url: socials?.linkedin, label: 'LinkedIn', Icon: Linkedin },
    { url: socials?.twitter, label: 'Twitter', Icon: Twitter },
  ].filter((l) => l.url);
  const email = p.email || socials?.email;

  return (
    <section id="contact" className="py-24 px-6" style={CARBON_BG}>
      <div className="max-w-2xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger}
          className="rounded-2xl border border-gray-700/50 p-10 text-center shadow-2xl" style={PANEL_BG}>
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-gray-400 mb-6">
              <Flag size={14} style={{ color: RED }} /> Pit Wall · 06
            </span>
            <h2 className="text-4xl font-black uppercase tracking-tight mb-3" style={chromeText}>Start Your Engine</h2>
            <p className="text-gray-400 mb-10">Have a build in mind? The pit crew is on standby.</p>
          </motion.div>
          <motion.div variants={fadeUp} className="flex justify-center gap-4 flex-wrap mb-8">
            {email && (
              <a href={`mailto:${email}`}
                className="flex items-center gap-2 px-7 py-3 rounded-full text-white text-sm font-bold uppercase tracking-widest transition-all hover:brightness-110"
                style={{ background: 'linear-gradient(180deg, #ff2b1f, #b80500)', boxShadow: `inset 0 1px 0 rgba(255,255,255,0.3), 0 8px 24px ${RED}44` }}>
                <Mail size={17} /> Radio the Pit
              </a>
            )}
            {p.phone && (
              <a href={`tel:${p.phone}`} className="flex items-center px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest text-gray-300 border border-gray-600/60 hover:text-white hover:border-gray-300 transition-colors">
                {p.phone}
              </a>
            )}
          </motion.div>
          <motion.div variants={fadeUp} className="flex justify-center gap-3">
            {links.map(({ url, label, Icon }) => (
              <a key={label} href={url} target="_blank" rel="noreferrer" aria-label={label}
                className="w-11 h-11 rounded-full border border-gray-600/60 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-300 transition-colors"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.01))' }}>
                <Icon size={17} />
              </a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/* ---------- Main ---------- */

export default function CarbonFiber() {
  const { portfolioData } = usePortfolio();
  const d = portfolioData || {};
  const p = d.personal || {};
  const socials = d.socials || {};
  const skills = Array.isArray(d.skills) ? d.skills : [];
  const projects = Array.isArray(d.projects) ? d.projects : [];
  const experience = Array.isArray(d.experience) ? d.experience : [];
  const testimonials = Array.isArray(d.testimonials) ? d.testimonials : [];
  const stats = d.stats || {};
  const year = new Date().getFullYear();

  const navItems = ['Profile', 'Dials', 'Builds', 'Service', 'Pit'];

  return (
    <div className="font-sans antialiased text-gray-200" style={CARBON_BG}>
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-gray-800/80"
        style={{ backgroundColor: 'rgba(10,11,14,0.92)', backdropFilter: 'blur(10px)' }}>
        <div className="h-[3px]" style={{ backgroundImage: `repeating-linear-gradient(90deg, ${RED} 0 14px, transparent 14px 24px)` }} />
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <a href="#hero" className="font-black uppercase tracking-widest text-sm" style={chromeText}>{p.name || 'CF'}</a>
          <div className="flex items-center gap-4 sm:gap-7 overflow-x-auto">
            {navItems.map((item, i) => (
              <a key={item} href={['#about', '#skills', '#projects', '#experience', '#contact'][i]}
                className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-gray-500 hover:text-gray-100 transition-colors whitespace-nowrap">
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <Hero p={p} stats={stats} />
      <About p={p} stats={stats} />
      <Skills skills={skills} />
      <Projects projects={projects} />
      <Experience experience={experience} />
      <Testimonials testimonials={testimonials} />
      <Contact p={p} socials={socials} />

      <footer className="py-8 px-6 text-center border-t border-gray-800/80" style={CARBON_BG}>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-600">
          © {year} {p.name} · Carbon Fiber Portfolio
        </p>
      </footer>
    </div>
  );
}
