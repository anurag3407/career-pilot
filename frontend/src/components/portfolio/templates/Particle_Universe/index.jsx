import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Twitter, MapPin, ExternalLink, Rocket, Orbit, Satellite, Radio } from 'lucide-react';

/**
 * Particle Universe Portfolio Template
 * Category: 3D / WebGL
 * Description: Interactive particle system background that reacts to mouse movement. Canvas-based star particles with connection lines. Dark space aesthetic with glowing nodes.
 */

/* ------------------------------------------------------------------ */
/* Palette — deep space, plasma blues, one hot magenta                 */
/* ------------------------------------------------------------------ */
const SPACE = '#05060f';
const PANEL = 'rgba(12,16,34,0.72)';
const BORDER = 'rgba(130,160,255,0.16)';
const TEXT = '#e6ecff';
const SECOND = '#8ea0cc';
const GLOW = '#5b8cff';
const HOT = '#ff4fd8';

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 0.61, 0.36, 1] } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11 } },
};

const MONO = "ui-monospace, 'SF Mono', Menlo, monospace";

/* ------------------------------------------------------------------ */
/* Canvas — deterministic star particles + constellation lines         */
/* ------------------------------------------------------------------ */
const ParticleCanvas = () => {
  const ref = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || typeof window.requestAnimationFrame !== 'function') return;
    const ctx = canvas.getContext && canvas.getContext('2d');
    if (!ctx) return;

    let raf;
    let w = 0;
    let h = 0;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      w = canvas.clientWidth || window.innerWidth;
      h = canvas.clientHeight || window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    /* deterministic starfield — no Math.random at render */
    const N = 84;
    const stars = Array.from({ length: N }, (_, i) => ({
      x: (((i * 137) % 1000) / 1000) * w,
      y: (((i * 61) % 1000) / 1000) * h,
      vx: ((((i * 17) % 10) - 5) / 46),
      vy: ((((i * 29) % 10) - 5) / 46),
      r: 0.9 + (((i * 13) % 22) / 12),
      hue: 210 + ((i * 7) % 90),
      pulse: ((i * 43) % 100) / 100,
    }));

    const onMouse = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    const onLeave = () => { mouse.current.x = -9999; mouse.current.y = -9999; };

    let t = 0;
    const frame = () => {
      t += 0.012;
      /* motion trail */
      ctx.fillStyle = 'rgba(5,6,15,0.4)';
      ctx.fillRect(0, 0, w, h);

      const m = mouse.current;
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        /* gentle attraction toward the cursor */
        const dx = m.x - s.x;
        const dy = m.y - s.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 160 * 160 && d2 > 1) {
          const d = Math.sqrt(d2);
          s.vx += (dx / d) * 0.02;
          s.vy += (dy / d) * 0.02;
        }
        s.vx *= 0.985;
        s.vy *= 0.985;
        s.x += s.vx;
        s.y += s.vy;
        /* wrap edges */
        if (s.x < -20) s.x = w + 20; if (s.x > w + 20) s.x = -20;
        if (s.y < -20) s.y = h + 20; if (s.y > h + 20) s.y = -20;
      }

      /* constellation lines */
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const a = stars[i];
          const b = stars[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 115 * 115) {
            const alpha = (1 - Math.sqrt(d2) / 115) * 0.30;
            ctx.strokeStyle = `hsla(225, 90%, 70%, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      /* glowing nodes */
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const glowPulse = 0.55 + 0.45 * Math.sin(t * 2 + s.pulse * Math.PI * 2);
        ctx.shadowBlur = 10 * glowPulse;
        ctx.shadowColor = `hsla(${s.hue}, 100%, 70%, 0.9)`;
        ctx.fillStyle = `hsla(${s.hue}, 95%, ${68 + glowPulse * 14}%, ${0.75 + glowPulse * 0.25})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      raf = window.requestAnimationFrame(frame);
    };
    raf = window.requestAnimationFrame(frame);

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('mouseout', onLeave);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('mouseout', onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="fixed inset-0 w-full h-full" style={{ background: SPACE, zIndex: 0 }} />;
};

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */
const Panel = ({ children, className = '' }) => (
  <div className={`rounded-xl backdrop-blur-md ${className}`}
    style={{ background: PANEL, border: `1px solid ${BORDER}`, boxShadow: '0 8px 40px rgba(0,0,0,0.45)' }}>
    {children}
  </div>
);

const SectionHead = ({ icon: Icon, kicker, title }) => (
  <motion.div variants={fadeUp} className="mb-10">
    <p className="text-[11px] font-semibold uppercase mb-2 flex items-center gap-2" style={{ letterSpacing: '0.4em', color: GLOW, fontFamily: MONO }}>
      <Icon size={14} strokeWidth={1.8} /> {kicker}
    </p>
    <h2 className="text-3xl md:text-4xl font-bold" style={{ color: TEXT }}>{title}</h2>
  </motion.div>
);

const Monogram = ({ name, size = 96 }) => {
  const initials = (name || '?').split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <span className="inline-flex items-center justify-center rounded-full font-bold"
      style={{
        width: size, height: size, fontSize: size * 0.3,
        color: TEXT,
        background: `radial-gradient(circle at 40% 35%, rgba(91,140,255,0.5), rgba(12,16,34,0.9) 75%)`,
        border: `1px solid ${BORDER}`,
        boxShadow: `0 0 34px rgba(91,140,255,0.45), inset 0 0 18px rgba(91,140,255,0.25)`,
      }}>
      {initials}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */
const Hero = ({ data }) => {
  const p = data.personal || {};
  return (
    <section id="hero" className="relative flex flex-col justify-center" style={{ minHeight: '92vh' }}>
      <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-4xl mx-auto px-6 md:px-10 w-full pt-32 pb-20">
        <motion.p variants={fadeUp} className="text-[11px] font-semibold uppercase mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{ letterSpacing: '0.4em', color: GLOW, border: `1px solid ${BORDER}`, background: 'rgba(12,16,34,0.6)', fontFamily: MONO }}>
          <Orbit size={13} strokeWidth={1.8} /> Deep space · transmission open
        </motion.p>
        <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold mb-5 leading-tight"
          style={{ color: TEXT, textShadow: '0 0 30px rgba(91,140,255,0.35)' }}>
          {p.name || 'Lost Signal'}
        </motion.h1>
        {p.title ? (
          <motion.p variants={fadeUp} className="text-lg md:text-xl mb-4" style={{ color: GLOW }}>{p.title}</motion.p>
        ) : null}
        {p.tagline ? (
          <motion.p variants={fadeUp} className="text-base max-w-xl mb-3 leading-relaxed" style={{ color: SECOND }}>
            {p.tagline}
          </motion.p>
        ) : null}
        {p.location ? (
          <motion.p variants={fadeUp} className="text-sm mb-9 inline-flex items-center gap-2" style={{ color: SECOND, fontFamily: MONO }}>
            <MapPin size={13} strokeWidth={1.8} /> {p.location}
          </motion.p>
        ) : null}
        <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
          <a href="#projects"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-sm transition-all hover:scale-105"
            style={{ background: `linear-gradient(135deg, ${GLOW}, #7f5bff)`, color: '#ffffff', boxShadow: '0 0 26px rgba(91,140,255,0.4)' }}>
            <Rocket size={16} strokeWidth={1.8} /> Launch the archive
          </a>
          <a href="#contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-sm transition-colors hover:bg-[rgba(91,140,255,0.12)]"
            style={{ border: `1px solid ${BORDER}`, color: TEXT, background: 'rgba(12,16,34,0.6)' }}>
            <Radio size={16} strokeWidth={1.8} /> Send a signal
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

const About = ({ data }) => {
  const p = data.personal || {};
  const stats = data.stats || {};
  const statItems = [
    { label: 'years in orbit', value: stats.yearsExperience },
    { label: 'missions flown', value: stats.projectsCompleted },
    { label: 'ground stations', value: stats.happyClients },
  ].filter(s => s.value !== undefined && s.value !== null && s.value !== '');

  return (
    <section id="about" className="px-6 md:px-10 py-16 max-w-4xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
        <SectionHead icon={Satellite} kicker="Origin story" title="The Explorer" />
        <motion.div variants={fadeUp}>
          <Panel className="p-7 md:p-9 flex flex-col md:flex-row gap-8 items-center">
            {p.avatar ? (
              <div className="relative shrink-0">
                <img src={p.avatar} alt={p.name || 'Portrait'} className="w-32 h-32 rounded-full object-cover"
                  style={{ border: `2px solid ${BORDER}`, boxShadow: '0 0 40px rgba(91,140,255,0.35)' }} />
              </div>
            ) : (
              <div className="shrink-0"><Monogram name={p.name} /></div>
            )}
            <div className="flex-1">
              <p className="text-sm md:text-base leading-relaxed mb-6" style={{ color: TEXT }}>
                {p.bio || 'A drifting body of work, slowly accumulating mass. Telemetry below.'}
              </p>
              {statItems.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {statItems.map((s, i) => (
                    <div key={i} className="rounded-lg py-3 text-center" style={{ background: 'rgba(91,140,255,0.08)', border: `1px solid ${BORDER}` }}>
                      <div className="text-2xl font-bold" style={{ fontFamily: MONO, color: i === 1 ? HOT : GLOW, textShadow: `0 0 16px ${i === 1 ? HOT : GLOW}66` }}>
                        {s.value}
                      </div>
                      <div className="text-[10px] uppercase mt-1" style={{ letterSpacing: '0.18em', color: SECOND, fontFamily: MONO }}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Panel>
        </motion.div>
      </motion.div>
    </section>
  );
};

/* Skills — constellation of glowing nodes */
const Skills = ({ data }) => {
  const skills = data.skills || [];
  return (
    <section id="skills" className="px-6 md:px-10 py-16 max-w-4xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
        <SectionHead icon={Orbit} kicker="Star map" title="Skill Constellations" />
        <div className="relative pl-8">
          <div className="absolute left-[11px] top-3 bottom-3 w-px" style={{ background: `linear-gradient(180deg, ${GLOW}66, ${HOT}44)` }} />
          {skills.map((skill, i) => {
            const level = Math.max(0, Math.min(100, Number(skill.level) || 85));
            return (
              <motion.div key={i} variants={fadeUp} className="relative flex items-center gap-4 py-3">
                <span className="absolute -left-8 w-[23px] h-[23px] rounded-full flex items-center justify-center"
                  style={{
                    background: SPACE,
                    border: `1.5px solid ${i % 5 === 0 ? HOT : GLOW}`,
                    boxShadow: `0 0 ${8 + (level / 8)}px ${i % 5 === 0 ? HOT : GLOW}88`,
                  }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: i % 5 === 0 ? HOT : GLOW }} />
                </span>
                <span className="text-sm font-medium w-44 md:w-56 truncate" style={{ color: TEXT }}>{skill.name}</span>
                <div className="flex-1 h-[3px] rounded-full" style={{ background: 'rgba(142,160,204,0.15)' }}>
                  <motion.div className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${GLOW}, ${i % 5 === 0 ? HOT : '#7f5bff'})`,
                      boxShadow: `0 0 10px ${GLOW}66`,
                    }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: i * 0.05, ease: 'easeOut' }} />
                </div>
                <span className="text-xs w-9 text-right" style={{ fontFamily: MONO, color: SECOND }}>{level}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

/* Projects — star charts */
const Projects = ({ data }) => {
  const projects = data.projects || [];
  return (
    <section id="projects" className="px-6 md:px-10 py-16 max-w-6xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.08 }} variants={stagger}>
        <SectionHead icon={Rocket} kicker="Deep survey" title="Charted Discoveries" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div key={i} variants={fadeUp} className="group rounded-xl overflow-hidden transition-transform hover:-translate-y-1.5"
              style={{ background: PANEL, border: `1px solid ${BORDER}`, boxShadow: '0 10px 34px rgba(0,0,0,0.5)' }}>
              <div className="relative h-40 overflow-hidden">
                {project.image ? (
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    style={{ filter: 'brightness(0.8) saturate(1.05)' }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"
                    style={{ background: `radial-gradient(circle at ${30 + (i * 17) % 40}% ${40 + (i * 29) % 30}%, rgba(91,140,255,0.3), rgba(12,16,34,0.95) 70%)` }}>
                    <Orbit size={34} strokeWidth={1.2} style={{ color: GLOW }} />
                  </div>
                )}
                <span className="absolute top-3 left-3 px-2 py-1 rounded text-[10px] font-semibold"
                  style={{ background: 'rgba(5,6,15,0.7)', color: GLOW, fontFamily: MONO, border: `1px solid ${BORDER}` }}>
                  CHART-{String(i + 1).padStart(3, '0')}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold mb-2" style={{ color: TEXT }}>{project.title}</h3>
                {project.description ? (
                  <p className="text-[13px] leading-relaxed mb-4" style={{ color: SECOND }}>{project.description}</p>
                ) : null}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {(project.techStack || []).map((t, j) => (
                    <span key={j} className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                      style={{ background: 'rgba(91,140,255,0.12)', color: '#9db6ff', border: `1px solid ${BORDER}`, fontFamily: MONO }}>
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  {project.liveUrl ? (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold transition-opacity hover:opacity-70"
                      style={{ color: GLOW }}>
                      <ExternalLink size={13} strokeWidth={1.8} /> Visit
                    </a>
                  ) : null}
                  {project.githubUrl ? (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold transition-opacity hover:opacity-70"
                      style={{ color: SECOND }}>
                      <Github size={13} strokeWidth={1.8} /> Source
                    </a>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

/* Experience — mission log */
const Experience = ({ data }) => {
  const experience = data.experience || [];
  return (
    <section id="experience" className="px-6 md:px-10 py-16 max-w-4xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
        <SectionHead icon={Satellite} kicker="Telemetry" title="Mission Log" />
        <Panel className="divide-y" style={{ borderColor: BORDER }}>
          {experience.map((exp, i) => (
            <motion.div key={i} variants={fadeUp} className="p-6 grid md:grid-cols-5 gap-3" style={{ borderColor: BORDER }}>
              <div className="md:col-span-1">
                <span className="inline-block px-2.5 py-1 rounded text-[10px] font-semibold"
                  style={{ background: i === 0 ? 'rgba(255,79,216,0.12)' : 'rgba(91,140,255,0.1)', color: i === 0 ? HOT : GLOW, fontFamily: MONO, border: `1px solid ${BORDER}` }}>
                  T-{exp.period}
                </span>
              </div>
              <div className="md:col-span-4">
                <h3 className="text-lg font-bold" style={{ color: TEXT }}>{exp.role}</h3>
                <p className="text-xs font-semibold uppercase mb-2 mt-0.5" style={{ letterSpacing: '0.2em', color: SECOND, fontFamily: MONO }}>
                  {exp.company}
                </p>
                {exp.description ? (
                  <p className="text-[13px] leading-relaxed" style={{ color: SECOND }}>{exp.description}</p>
                ) : null}
              </div>
            </motion.div>
          ))}
        </Panel>
      </motion.div>
    </section>
  );
};

/* Testimonials — incoming transmissions */
const Testimonials = ({ data }) => {
  const testimonials = data.testimonials || [];
  return (
    <section id="testimonials" className="px-6 md:px-10 py-16 max-w-6xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
        <SectionHead icon={Radio} kicker="Deep space network" title="Incoming Transmissions" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => {
            const initials = (t.name || '?').split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
            return (
              <motion.div key={i} variants={fadeUp} className="rounded-xl p-5"
                style={{ background: PANEL, border: `1px solid ${BORDER}` }}>
                <p className="text-[10px] font-semibold uppercase mb-3 flex items-center gap-2" style={{ letterSpacing: '0.2em', color: GLOW, fontFamily: MONO }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: i % 3 === 0 ? HOT : GLOW }} />
                  Signal {String(i + 1).padStart(3, '0')} · locked
                </p>
                <p className="text-[13px] leading-relaxed mb-5 italic" style={{ color: TEXT }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  {t.avatar ? (
                    <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover"
                      style={{ border: `1px solid ${BORDER}`, boxShadow: '0 0 12px rgba(91,140,255,0.4)' }} />
                  ) : (
                    <Monogram name={t.name} size={34} />
                  )}
                  <span>
                    <span className="block text-sm font-bold" style={{ color: TEXT }}>{t.name}</span>
                    <span className="block text-[11px]" style={{ color: SECOND, fontFamily: MONO }}>{t.role}</span>
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

const Contact = ({ data }) => {
  const socials = data.socials || {};
  const p = data.personal || {};
  const email = socials.email || p.email;
  const socialLinks = [
    { key: 'github', label: 'GitHub', href: socials.github, Icon: Github },
    { key: 'linkedin', label: 'LinkedIn', href: socials.linkedin, Icon: Linkedin },
    { key: 'twitter', label: 'Twitter', href: socials.twitter, Icon: Twitter },
  ].filter(l => l.href);

  return (
    <section id="contact" className="px-6 md:px-10 py-20 max-w-3xl mx-auto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
        <motion.div variants={fadeUp}>
          <Panel className="p-8 md:p-10 text-center">
            <p className="text-[11px] font-semibold uppercase mb-4 inline-flex items-center gap-2"
              style={{ letterSpacing: '0.4em', color: HOT, fontFamily: MONO }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: HOT }} /> Channel open
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: TEXT }}>Send a transmission</h2>
            <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: SECOND }}>
              Signals are answered within one orbital rotation (about a day, Earth time).
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {email ? (
                <a href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-sm transition-all hover:scale-105"
                  style={{ background: `linear-gradient(135deg, ${GLOW}, #7f5bff)`, color: '#ffffff', boxShadow: '0 0 26px rgba(91,140,255,0.4)' }}>
                  <Mail size={16} strokeWidth={1.8} /> {email}
                </a>
              ) : null}
              {socialLinks.map(l => (
                <a key={l.key} href={l.href} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-lg font-semibold text-sm transition-colors hover:bg-[rgba(91,140,255,0.12)]"
                  style={{ border: `1px solid ${BORDER}`, color: TEXT, background: 'rgba(12,16,34,0.6)' }}>
                  <l.Icon size={15} strokeWidth={1.8} /> {l.label}
                </a>
              ))}
            </div>
          </Panel>
        </motion.div>
        <motion.p variants={fadeUp} className="mt-8 text-center text-[11px]" style={{ color: 'rgba(142,160,204,0.55)', fontFamily: MONO }}>
          &copy; {new Date().getFullYear()} {p.name || ''} · Particle Universe Portfolio · drifting since forever
        </motion.p>
      </motion.div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */
export default function ParticleUniverse() {
  const { portfolioData: data } = usePortfolio();
  const p = data.personal || {};

  const navItems = [
    { label: 'Explorer', href: '#about' },
    { label: 'Star Map', href: '#skills' },
    { label: 'Discoveries', href: '#projects' },
    { label: 'Mission Log', href: '#experience' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <div className="antialiased overflow-x-hidden" style={{ background: SPACE, color: TEXT, fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
      <ParticleCanvas />
      {/* deep-space vignette above canvas */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none" style={{ zIndex: 1, background: 'radial-gradient(ellipse 80% 60% at 50% 40%, transparent 55%, rgba(5,6,15,0.75) 100%)' }} />

      <nav className="fixed top-0 inset-x-0 z-40 backdrop-blur-md"
        style={{ background: 'rgba(5,6,15,0.72)', borderBottom: `1px solid ${BORDER}` }}>
        <div className="max-w-6xl mx-auto px-6 md:px-10 h-14 flex items-center justify-between">
          <a href="#hero" className="inline-flex items-center gap-2 font-bold text-sm" style={{ color: TEXT }}>
            <Orbit size={16} strokeWidth={1.8} style={{ color: GLOW }} />
            {p.name || 'Unknown Signal'}
          </a>
          <div className="hidden md:flex items-center gap-7">
            {navItems.map(item => (
              <a key={item.label} href={item.href}
                className="text-xs font-medium transition-colors hover:text-[#5b8cff]"
                style={{ letterSpacing: '0.12em', color: SECOND, fontFamily: MONO }}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <div className="relative" style={{ zIndex: 10 }}>
        <Hero data={data} />
        {(p.bio || p.avatar) ? <About data={data} /> : null}
        {data.skills?.length > 0 ? <Skills data={data} /> : null}
        {data.projects?.length > 0 ? <Projects data={data} /> : null}
        {data.experience?.length > 0 ? <Experience data={data} /> : null}
        {data.testimonials?.length > 0 ? <Testimonials data={data} /> : null}
        <Contact data={data} />
      </div>
    </div>
  );
}
