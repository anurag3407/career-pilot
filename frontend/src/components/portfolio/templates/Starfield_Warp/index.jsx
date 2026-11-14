import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Rocket, MapPin, Mail, Github, Linkedin, Twitter, ExternalLink,
  User, Briefcase, Quote, Star, Send
} from 'lucide-react';

/**
 * Starfield Warp Portfolio Template
 * Category: 3D / WebGL
 * Description: Star Wars-style starfield warp speed effect using canvas or CSS animations. Stars streak past as you scroll. Pure dark mode with white streaks.
 */

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.13 } } };
const panelIn = {
  hidden: { opacity: 0, y: 46, scale: 0.985 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: 'easeOut' } }
};
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55 } } };

const initials = (name) =>
  (name || '').trim().split(/\s+/).map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || '?';

const statNumber = (v) => (typeof v === 'number' && isFinite(v) ? v : null);

// Canvas starfield: stars streak outward from center; warp speed rises with scroll velocity.
function StarfieldCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext && canvas.getContext('2d');
    if (!ctx) return;

    // Deterministic PRNG (LCG) so the field is stable and SSR/test friendly
    let seed = 987654321;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    const stars = [];
    for (let i = 0; i < 340; i++) {
      stars.push({ x: rand() * 2 - 1, y: rand() * 2 - 1, z: rand() * 0.92 + 0.08 });
    }

    let w = 0;
    let h = 0;
    const resize = () => {
      w = canvas.width = canvas.offsetWidth || 800;
      h = canvas.height = canvas.offsetHeight || 600;
      ctx.fillStyle = '#03060c';
      ctx.fillRect(0, 0, w, h);
    };
    resize();

    let lastScroll = window.scrollY || 0;
    let boost = 0;
    const onScroll = () => {
      const y = window.scrollY || 0;
      boost = Math.min(boost + Math.abs(y - lastScroll) * 0.0035, 2.4);
      lastScroll = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize);

    const rafFn = typeof window.requestAnimationFrame === 'function'
      ? window.requestAnimationFrame.bind(window)
      : (cb) => setTimeout(() => cb(Date.now()), 16);
    const cancelFn = typeof window.cancelAnimationFrame === 'function'
      ? window.cancelAnimationFrame.bind(window)
      : clearTimeout;

    let rafId;
    const draw = () => {
      boost *= 0.94; // warp cools down when scrolling stops
      ctx.fillStyle = 'rgba(3,6,12,0.42)'; // motion-trail fade
      ctx.fillRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const speed = 0.0022 + boost * 0.0055;
      for (const s of stars) {
        let prevZ = s.z;
        s.z -= speed * (0.35 + s.z);
        if (s.z <= 0.03) {
          s.x = rand() * 2 - 1;
          s.y = rand() * 2 - 1;
          s.z = 1;
          prevZ = 1;
        }
        const scale = 0.5;
        const sx = cx + (s.x / s.z) * cx * scale;
        const sy = cy + (s.y / s.z) * cy * scale;
        const px = cx + (s.x / prevZ) * cx * scale;
        const py = cy + (s.y / prevZ) * cy * scale;
        if (sx < -60 || sx > w + 60 || sy < -60 || sy > h + 60) continue;
        const depth = 1 - s.z;
        ctx.strokeStyle = `rgba(255,255,255,${(0.22 + depth * 0.75).toFixed(3)})`;
        ctx.lineWidth = Math.max(0.5, depth * 2.4);
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      }
      rafId = rafFn(draw);
    };
    rafId = rafFn(draw);

    return () => {
      cancelFn(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-0" />
  );
}

// Minimal content panel floating over the starfield
const Panel = ({ children, className = '', id }) => (
  <div id={id} className={`relative bg-black/70 border border-white/12 rounded-xl backdrop-blur-sm ${className}`}
    style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.03), 0 30px 80px rgba(0,0,0,0.6)' }}>
    {children}
  </div>
);

const Eyebrow = ({ icon, text }) => (
  <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.35em] uppercase text-white/45 mb-4">
    {React.createElement(icon, { size: 13 })} {text}
  </span>
);

// ---------------- Hero ----------------
const Hero = ({ data }) => (
  <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden">
    <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 max-w-3xl">
      <motion.div variants={fadeUp}>
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-black/50 text-[10px] font-bold tracking-[0.35em] uppercase text-white/60">
          <Rocket size={13} /> Transmission Incoming
        </span>
      </motion.div>
      <motion.h1 variants={fadeUp} className="mt-8 text-5xl md:text-8xl font-black tracking-[0.08em] uppercase text-white leading-none mb-5"
        style={{ textShadow: '0 0 30px rgba(255,255,255,0.25), 0 0 90px rgba(160,200,255,0.15)' }}>
        {data.personal.name || 'Starfield Warp'}
      </motion.h1>
      {data.personal.title && (
        <motion.p variants={fadeUp} className="text-lg md:text-2xl font-semibold tracking-[0.3em] uppercase text-sky-100/80 mb-4">
          {data.personal.title}
        </motion.p>
      )}
      {data.personal.tagline && (
        <motion.p variants={fadeUp} className="text-white/55 md:text-lg italic mb-3 max-w-xl mx-auto">{data.personal.tagline}</motion.p>
      )}
      {data.personal.location && (
        <motion.p variants={fadeUp} className="text-white/40 text-sm flex items-center justify-center gap-1.5 mb-10">
          <MapPin size={14} /> {data.personal.location}
        </motion.p>
      )}
      <motion.div variants={fadeUp} className="flex justify-center gap-4 flex-wrap">
        <a href="#about" className="px-7 py-3.5 rounded-md font-bold text-sm tracking-[0.2em] uppercase bg-white text-black transition-all hover:-translate-y-0.5"
          style={{ boxShadow: '0 0 30px rgba(255,255,255,0.25)' }}>
          Scan the Crew
        </a>
        <a href="#contact" className="px-7 py-3.5 rounded-md font-bold text-sm tracking-[0.2em] uppercase border border-white/30 text-white/80 hover:border-white hover:text-white transition-colors bg-black/40">
          Open a Channel
        </a>
      </motion.div>
    </motion.div>
    {/* HYPERDRIVE scroll indicator */}
    <a href="#about" aria-label="Engage hyperdrive — scroll down"
      className="absolute bottom-10 z-10 flex flex-col items-center gap-2.5 group">
      <span className="flex items-end gap-1 h-5" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <motion.span key={i} className="w-1 bg-white/80 group-hover:bg-white" style={{ height: '100%', transformOrigin: 'bottom' }}
            animate={{ scaleY: [0.15, 1, 0.15] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.16, ease: 'easeInOut' }} />
        ))}
      </span>
      <span className="text-[10px] font-bold tracking-[0.45em] uppercase text-white/50 group-hover:text-white/90 transition-colors">
        Engage Hyperdrive
      </span>
    </a>
  </section>
);

// ---------------- About ----------------
const About = ({ data }) => {
  const stats = [
    { label: 'Parsecs Sailed', value: statNumber(data.stats?.yearsExperience) },
    { label: 'Missions Flown', value: statNumber(data.stats?.projectsCompleted) },
    { label: 'Allies on Board', value: statNumber(data.stats?.happyClients) },
  ].filter((s) => s.value !== null);

  return (
    <section id="about" className="relative py-16 md:py-24 overflow-hidden">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={stagger}>
          <motion.div variants={panelIn}>
            <Panel className="p-8 md:p-10">
              <Eyebrow icon={User} text="Crew Manifest // 01" />
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wide text-white mb-6">The Pilot</h2>
              <div className="flex flex-col md:flex-row gap-7 items-start">
                {data.personal.avatar
                  ? <img src={data.personal.avatar} alt={data.personal.name || 'Portrait'}
                      className="w-32 h-32 rounded-lg object-cover border border-white/20 grayscale hover:grayscale-0 transition-all duration-700 shrink-0" />
                  : <div className="w-32 h-32 rounded-lg border border-white/20 bg-white/[0.04] flex items-center justify-center text-4xl font-black tracking-widest text-white/50 shrink-0">
                      {initials(data.personal.name)}
                    </div>}
                <div className="flex-1">
                  {data.personal.bio && <p className="text-white/65 leading-relaxed mb-6">{data.personal.bio}</p>}
                  {stats.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {stats.map((s, i) => (
                        <div key={i} className="border border-white/10 rounded-md bg-white/[0.03] p-3 text-center">
                          <div className="text-xl md:text-2xl font-black text-white">{s.value}</div>
                          <div className="text-[9px] tracking-widest uppercase text-white/40 mt-1">{s.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Panel>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// ---------------- Skills ----------------
const Skills = ({ data }) => {
  const categories = [...new Set(data.skills.map((s) => s.category || 'Core'))];
  return (
    <section id="skills" className="relative py-16 md:py-24 overflow-hidden">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <motion.div variants={panelIn}>
            <Panel className="p-8 md:p-10">
              <Eyebrow icon={Rocket} text="Systems Check // 02" />
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wide text-white mb-8">Ship Systems</h2>
              {categories.map((cat, ci) => (
                <div key={cat} className="mb-7 last:mb-0">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-sky-200/70">{cat}</span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>
                  <div className="space-y-4">
                    {data.skills.filter((s) => (s.category || 'Core') === cat).map((skill, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-baseline mb-1.5">
                          <span className="text-sm font-semibold text-white/85 tracking-wide">{skill.name}</span>
                          <span className="text-xs font-bold text-white/50">{skill.level || 85}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <motion.div className="h-full rounded-full bg-white/85"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level || 85}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: ci * 0.08 + i * 0.05, ease: 'easeOut' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </Panel>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// ---------------- Projects ----------------
const Projects = ({ data }) => (
  <section id="projects" className="relative py-16 md:py-24 overflow-hidden">
    <div className="max-w-4xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={stagger}>
        <motion.div variants={panelIn}>
          <Panel className="p-8 md:p-10">
            <Eyebrow icon={Rocket} text="Mission Log // 03" />
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wide text-white mb-8">Logged Missions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {data.projects.map((project, i) => (
                <motion.article key={i} variants={panelIn}
                  className="border border-white/10 rounded-lg overflow-hidden bg-white/[0.03] hover:border-white/30 transition-colors group">
                  <div className="relative h-36 overflow-hidden border-b border-white/10" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    {project.image
                      ? <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      : <div className="w-full h-full flex items-center justify-center text-white/20 group-hover:text-white/40 transition-colors">
                          <Rocket size={34} />
                        </div>}
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 text-[9px] font-bold tracking-[0.25em] bg-black/70 border border-white/20 rounded-sm text-white/70">
                      LOG {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-white mb-1.5 tracking-wide">{project.title}</h3>
                    {project.description && <p className="text-white/50 text-sm leading-relaxed line-clamp-3 mb-3">{project.description}</p>}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {(project.techStack || []).slice(0, 5).map((tech, j) => (
                        <span key={j} className="px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase border border-white/15 rounded-sm text-white/50">{tech}</span>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      {project.liveUrl && project.liveUrl !== '#' && (
                        <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-sky-200 hover:text-white transition-colors">
                          <ExternalLink size={12} /> View
                        </a>
                      )}
                      {project.githubUrl && project.githubUrl !== '#' && (
                        <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest uppercase text-white/40 hover:text-white/80 transition-colors">
                          <Github size={12} /> Source
                        </a>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </Panel>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// ---------------- Experience ----------------
const Experience = ({ data }) => (
  <section id="experience" className="relative py-16 md:py-24 overflow-hidden">
    <div className="max-w-3xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.18 }} variants={stagger}>
        <motion.div variants={panelIn}>
          <Panel className="p-8 md:p-10">
            <Eyebrow icon={Briefcase} text="Flight Record // 04" />
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wide text-white mb-8">Jump Log</h2>
            <div className="relative border-l border-white/15 ml-2 pl-7 space-y-8">
              {data.experience.map((exp, i) => (
                <motion.div key={i} variants={panelIn} className="relative">
                  <span className="absolute -left-[33px] top-1.5 w-2.5 h-2.5 rounded-full bg-white"
                    style={{ boxShadow: '0 0 10px rgba(255,255,255,0.8)' }} aria-hidden="true" />
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/40">{exp.period || 'UNDATED'}</span>
                  <h3 className="text-lg font-bold text-white mt-1">{exp.role}</h3>
                  {exp.company && <p className="text-sm font-semibold text-sky-100/60 mb-2">{exp.company}</p>}
                  {exp.description && <p className="text-white/50 text-sm leading-relaxed">{exp.description}</p>}
                </motion.div>
              ))}
            </div>
          </Panel>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// ---------------- Testimonials ----------------
const Testimonials = ({ data }) => (
  <section id="testimonials" className="relative py-16 md:py-24 overflow-hidden">
    <div className="max-w-4xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.18 }} variants={stagger}>
        <motion.div variants={panelIn}>
          <Panel className="p-8 md:p-10">
            <Eyebrow icon={Quote} text="Incoming Transmissions // 05" />
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wide text-white mb-8">Signals Received</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {data.testimonials.map((t, i) => (
                <motion.blockquote key={i} variants={panelIn} className="border border-white/10 rounded-lg p-5 bg-white/[0.03] hover:border-white/25 transition-colors">
                  <p className="text-white/70 text-sm leading-relaxed italic mb-4">“{t.text}”</p>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} size={11} className="text-white/80" fill="white" />)}
                  </div>
                  <footer className="flex items-center gap-3 border-t border-white/10 pt-3">
                    {t.avatar
                      ? <img src={t.avatar} alt={t.name || 'Ally'} className="w-9 h-9 rounded-full object-cover border border-white/20" />
                      : <div className="w-9 h-9 rounded-full border border-white/20 bg-white/[0.05] flex items-center justify-center text-[10px] font-black text-white/50">{initials(t.name)}</div>}
                    <div>
                      <div className="text-sm font-bold text-white">{t.name}</div>
                      {t.role && <div className="text-[11px] text-white/45">{t.role}</div>}
                    </div>
                  </footer>
                </motion.blockquote>
              ))}
            </div>
          </Panel>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// ---------------- Contact ----------------
const Contact = ({ data }) => (
  <section id="contact" className="relative py-16 md:py-24 overflow-hidden pb-24">
    <div className="max-w-2xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={stagger}>
        <motion.div variants={panelIn}>
          <Panel className="p-8 md:p-10 text-center">
            <Eyebrow icon={Send} text="Final Coordinates // 06" />
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wide text-white mb-4"
              style={{ textShadow: '0 0 24px rgba(255,255,255,0.2)' }}>
              Open a Channel
            </h2>
            <p className="text-white/50 mb-9 max-w-sm mx-auto text-sm leading-relaxed">
              Every great voyage starts with a single transmission. Send yours — the fleet is listening.
            </p>
            <div className="flex justify-center gap-3 flex-wrap mb-10">
              {data.socials.email && (
                <a href={`mailto:${data.socials.email}`} className="flex items-center gap-2 px-6 py-3 rounded-md font-bold text-xs tracking-[0.2em] uppercase bg-white text-black transition-all hover:-translate-y-0.5"
                  style={{ boxShadow: '0 0 26px rgba(255,255,255,0.25)' }}>
                  <Mail size={15} /> Transmit
                </a>
              )}
              {data.socials.github && (
                <a href={data.socials.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-3 rounded-md font-bold text-xs tracking-[0.2em] uppercase border border-white/25 text-white/70 hover:border-white hover:text-white transition-colors">
                  <Github size={15} /> GitHub
                </a>
              )}
              {data.socials.linkedin && (
                <a href={data.socials.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-3 rounded-md font-bold text-xs tracking-[0.2em] uppercase border border-white/25 text-white/70 hover:border-white hover:text-white transition-colors">
                  <Linkedin size={15} /> LinkedIn
                </a>
              )}
              {data.socials.twitter && (
                <a href={data.socials.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-3 rounded-md font-bold text-xs tracking-[0.2em] uppercase border border-white/25 text-white/70 hover:border-white hover:text-white transition-colors">
                  <Twitter size={15} /> Twitter
                </a>
              )}
            </div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-white/30">
              © {new Date().getFullYear()} {data.personal.name || 'Portfolio'} · Starfield Warp · Transmission End
            </p>
          </Panel>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// ---------------- Main ----------------
export default function StarfieldWarp() {
  const { portfolioData: data } = usePortfolio();

  return (
    <div className="relative font-sans antialiased text-white overflow-x-hidden" style={{ background: '#03060c' }}>
      <StarfieldCanvas />
      {/* subtle blue nebula tint behind panels */}
      <div className="fixed inset-0 z-[1] pointer-events-none" aria-hidden="true"
        style={{ background: 'radial-gradient(ellipse 60% 40% at 70% 80%, rgba(56,96,180,0.10), transparent 65%)' }} />
      <div className="relative z-10">
        <Hero data={data} />
        {data.personal.bio && <About data={data} />}
        {data.skills?.length > 0 && <Skills data={data} />}
        {data.projects?.length > 0 && <Projects data={data} />}
        {data.experience?.length > 0 && <Experience data={data} />}
        {data.testimonials?.length > 0 && <Testimonials data={data} />}
        <Contact data={data} />
      </div>
    </div>
  );
}
