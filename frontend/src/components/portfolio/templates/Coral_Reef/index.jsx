import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Anchor, Fish, Waves, Shell, Mail, Github, Linkedin, Twitter,
  ExternalLink, MapPin, ChevronDown
} from 'lucide-react';

/**
 * Coral Reef Portfolio Template
 * Category: Nature / Organic
 * Description: Underwater coral reef with marine blues, coral pinks, sea-foam greens. Animated bubble particles, fish silhouettes, seaweed swaying animations.
 */

const DEEP = '#01203d';
const OCEAN = '#042f57';
const OCEAN_2 = '#063a68';
const CORAL = '#f4845f';
const CORAL_PINK = '#ff7f6e';
const FOAM = '#a8dadc';
const KELP = '#52b69a';

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

const initialsOf = (name) =>
  (name || '').trim().split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

const REEF_STYLE = (
  <style>{`
    @keyframes bubbleRise { 0% { transform: translateY(0); opacity: 0; } 12% { opacity: .75; } 100% { transform: translateY(-108vh); opacity: 0; } }
    @keyframes swimAcross { from { transform: translateX(-18vw); } to { transform: translateX(118vw); } }
    @keyframes swayKelp { 0%,100% { transform: rotate(-6deg); } 50% { transform: rotate(6deg); } }
    @keyframes rayDrift { 0%,100% { opacity: .35; } 50% { opacity: .8; } }
  `}</style>
);

/* ---------- decorative reef pieces ---------- */

const Bubbles = ({ count = 16 }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
    {Array.from({ length: count }).map((_, i) => {
      const size = 5 + ((i * 29) % 16);
      return (
        <span key={i} className="absolute rounded-full"
          style={{
            left: `${(i * 53 + 7) % 100}%`,
            bottom: `-${size}px`,
            width: size, height: size,
            background: 'radial-gradient(circle at 32% 30%, rgba(255,255,255,0.55), rgba(168,218,220,0.14) 70%)',
            border: '1px solid rgba(255,255,255,0.22)',
            animation: `bubbleRise ${7 + ((i * 37) % 8)}s linear ${(i * 1.7) % 9}s infinite`
          }} />
      );
    })}
  </div>
);

const FishSilhouette = ({ top = '20%', color = 'rgba(168,218,220,0.35)', scale = 1, duration = 34, delay = 0, flip = false }) => (
  <div className="absolute overflow-hidden pointer-events-none" aria-hidden="true"
    style={{ top, left: 0, width: '100%', animation: `swimAcross ${duration}s linear ${delay}s infinite` }}>
    <svg viewBox="0 0 40 24" width={34 * scale} height={24 * scale}
      style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <path d="M4 12 C10 3 22 3 28 12 C22 21 10 21 4 12 Z" fill={color} />
      <path d="M28 12 L38 5 L38 19 Z" fill={color} />
      <circle cx="10" cy="11" r="1.6" fill="rgba(255,255,255,0.55)" />
    </svg>
  </div>
);

const Kelp = ({ h = 96, delay = 0, className = '' }) => (
  <div aria-hidden="true" className={`origin-bottom ${className}`}
    style={{ transformOrigin: 'bottom center', animation: `swayKelp ${4.5 + delay}s ease-in-out ${delay * 0.6}s infinite` }}>
    <div style={{
      width: 10, height: h, borderRadius: 8,
      background: `linear-gradient(180deg, ${KELP}, #1d6f5c)`,
      opacity: 0.7
    }} />
  </div>
);

const CoralBranches = () => (
  <svg viewBox="0 0 1440 150" preserveAspectRatio="none" className="w-full h-28 block" aria-hidden="true">
    <g stroke={CORAL_PINK} strokeWidth="9" strokeLinecap="round" fill="none" opacity="0.55">
      <path d="M120 150 V70 M120 105 L90 72 M120 115 L152 86" />
      <path d="M300 150 V90 M300 120 L272 96" />
      <path d="M520 150 V60 M520 96 L488 62 M520 110 L552 78" />
      <path d="M760 150 V84 M760 118 L734 92" />
      <path d="M980 150 V58 M980 95 L950 60 M980 108 L1012 74" />
      <path d="M1220 150 V88 M1220 120 L1194 94" />
    </g>
    <g stroke={KELP} strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.45">
      <path d="M210 150 V92 M210 118 L232 94" />
      <path d="M660 150 V76 M660 112 L636 84" />
      <path d="M1120 150 V70 M1120 108 L1144 80" />
    </g>
  </svg>
);

const LightRays = () => (
  <div className="absolute inset-x-0 top-0 h-[60vh] overflow-hidden pointer-events-none" aria-hidden="true">
    {[12, 34, 58, 78].map((left, i) => (
      <div key={i} className="absolute top-[-10%]"
        style={{
          left: `${left}%`, width: `${5 + (i % 3) * 3}rem`, height: '120%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.14), transparent 75%)',
          transform: 'rotate(14deg)', transformOrigin: 'top center',
          animation: `rayDrift ${6 + i * 2}s ease-in-out ${i}s infinite`
        }} />
    ))}
  </div>
);

/* ---------- Hero ---------- */

const Hero = ({ p }) => (
  <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 overflow-hidden"
    style={{ background: `linear-gradient(180deg, #0a4d8c 0%, ${OCEAN_2} 45%, ${OCEAN} 100%)` }}>
    {REEF_STYLE}
    <LightRays />
    <Bubbles count={18} />
    <FishSilhouette top="22%" duration={38} />
    <FishSilhouette top="34%" color="rgba(244,132,95,0.4)" scale={0.8} duration={46} delay={6} flip />
    <FishSilhouette top="60%" color="rgba(168,218,220,0.22)" scale={1.3} duration={52} delay={12} />

    <motion.div className="relative z-10 text-center max-w-3xl" initial="hidden" animate="visible" variants={stagger}>
      <motion.div variants={fadeUp} className="mb-5">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-white/10 text-xs font-semibold tracking-[0.3em] uppercase"
          style={{ color: FOAM }}>
          <Waves size={13} /> The Reef
        </span>
      </motion.div>
      <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-extrabold text-white mb-4" style={{ textShadow: '0 4px 24px rgba(1,32,61,0.6)' }}>
        {p.name}
      </motion.h1>
      <motion.p variants={fadeUp} className="text-xl md:text-2xl font-medium mb-2" style={{ color: CORAL_PINK }}>
        {p.title || 'Explorer of the deep'}
      </motion.p>
      {p.tagline && <motion.p variants={fadeUp} className="italic mb-2" style={{ color: FOAM }}>{p.tagline}</motion.p>}
      {p.location && (
        <motion.p variants={fadeUp} className="text-sm flex items-center justify-center gap-1.5 mb-8" style={{ color: 'rgba(207,232,247,0.8)' }}>
          <MapPin size={14} /> {p.location}
        </motion.p>
      )}
      <motion.div variants={fadeUp} className="flex justify-center gap-4 flex-wrap">
        <a href="#about" className="px-7 py-3 rounded-full text-white text-sm font-semibold shadow-lg transition-transform hover:scale-[1.04]"
          style={{ background: `linear-gradient(180deg, ${CORAL_PINK}, ${CORAL})` }}>
          Dive In
        </a>
        <a href="#contact" className="px-7 py-3 rounded-full text-sm font-semibold border transition-colors hover:bg-white/10"
          style={{ borderColor: `${FOAM}66`, color: FOAM }}>
          Send a Float
        </a>
      </motion.div>
    </motion.div>

    <div className="absolute bottom-0 inset-x-0 flex items-end justify-center gap-3 px-[12%]" aria-hidden="true">
      <Kelp h={110} delay={0} />
      <Kelp h={70} delay={1.4} />
      <Kelp h={130} delay={0.8} />
    </div>
    <div className="absolute bottom-0 inset-x-0"><CoralBranches /></div>

    <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/60" animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2.4 }}>
      <ChevronDown size={26} />
    </motion.div>
  </section>
);

/* ---------- About (tidal pool) ---------- */

const About = ({ p, stats }) => {
  const hasStats = stats && (stats.yearsExperience || stats.projectsCompleted || stats.happyClients);
  if (!p.bio && !p.avatar && !hasStats) return null;
  const statItems = [
    { label: 'Years Diving', value: stats?.yearsExperience },
    { label: 'Reef Builds', value: stats?.projectsCompleted },
    { label: 'Happy Fish', value: stats?.happyClients },
  ].filter((s) => s.value);

  return (
    <section id="about" className="relative py-24 px-6 overflow-hidden" style={{ backgroundColor: OCEAN }}>
      <Bubbles count={8} />
      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={stagger}
          className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeUp} className="mx-auto">
            {p.avatar
              ? <img src={p.avatar} alt={p.name} className="w-60 h-60 rounded-full object-cover border-4"
                  style={{ borderColor: `${CORAL_PINK}88`, boxShadow: '0 0 0 8px rgba(168,218,220,0.12), 0 24px 50px rgba(1,32,61,0.5)' }} />
              : <div className="w-60 h-60 rounded-full border-4 flex items-center justify-center"
                  style={{ borderColor: `${CORAL_PINK}88`, backgroundColor: 'rgba(255,255,255,0.06)', boxShadow: '0 0 0 8px rgba(168,218,220,0.12)' }}>
                  {initialsOf(p.name)
                    ? <span className="text-6xl font-extrabold text-white">{initialsOf(p.name)}</span>
                    : <Shell size={52} style={{ color: FOAM }} />}
                </div>}
          </motion.div>
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: CORAL_PINK }}>
              <Anchor size={14} /> Tidal Pool
            </span>
            <h2 className="text-4xl font-extrabold text-white mt-2 mb-4">About Me</h2>
            {p.bio && <p className="leading-relaxed mb-7" style={{ color: '#cfe8f7' }}>{p.bio}</p>}
            {hasStats && (
              <div className="flex flex-wrap gap-4">
                {statItems.map((s, i) => (
                  <div key={i} className="relative w-28 h-28 rounded-full flex flex-col items-center justify-center text-center border border-white/15"
                    style={{ background: 'radial-gradient(circle at 32% 28%, rgba(255,255,255,0.18), rgba(168,218,220,0.05) 70%)' }}>
                    <div className="text-2xl font-extrabold text-white">{s.value}</div>
                    <div className="text-[9px] font-semibold uppercase tracking-widest mt-0.5" style={{ color: FOAM }}>{s.label}</div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/* ---------- Skills (polyps) ---------- */

const Skills = ({ skills }) => {
  if (!skills?.length) return null;
  return (
    <section id="skills" className="relative py-24 px-6 overflow-hidden" style={{ backgroundColor: OCEAN_2 }}>
      <Bubbles count={7} />
      <FishSilhouette top="10%" color="rgba(244,132,95,0.25)" scale={0.7} duration={44} delay={4} flip />
      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: CORAL_PINK }}>
              <Shell size={14} /> Polyp Field
            </span>
            <h2 className="text-4xl font-extrabold text-white mt-2">Skills</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {skills.map((s, i) => (
              <motion.div key={i} variants={fadeUp} whileHover={{ y: -4 }}
                className="rounded-[1.6rem] p-5 border border-white/10"
                style={{
                  background: 'rgba(2,62,115,0.45)',
                  borderRadius: `${58 + ((i * 17) % 8)}% ${42 + ((i * 23) % 8)}% 55% 45% / ${50 + ((i * 11) % 8)}% 55% 45% 50%`
                }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center shrink-0"
                    style={{ background: `radial-gradient(circle at 35% 30%, ${CORAL_PINK}, ${CORAL})` }}>
                    <span className="w-2 h-2 rounded-full bg-white/80" />
                  </span>
                  <div className="min-w-0">
                    <div className="font-bold text-white truncate">{s.name}</div>
                    {s.category && <div className="text-[10px] uppercase tracking-widest" style={{ color: FOAM }}>{s.category}</div>}
                  </div>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 10 }).map((_, j) => (
                    <motion.span key={j} className="h-2 flex-1 rounded-full"
                      style={{ backgroundColor: j < Math.round((s.level || 85) / 10) ? CORAL_PINK : 'rgba(255,255,255,0.14)' }}
                      initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }} transition={{ delay: i * 0.05 + j * 0.04 }} />
                  ))}
                </div>
                <div className="text-right text-xs font-semibold mt-2" style={{ color: FOAM }}>{s.level || 85}%</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ---------- Projects (reef clusters) ---------- */

const Projects = ({ projects }) => {
  if (!projects?.length) return null;
  return (
    <section id="projects" className="relative py-24 px-6 overflow-hidden" style={{ backgroundColor: OCEAN }}>
      <Bubbles count={9} />
      <FishSilhouette top="8%" duration={40} delay={2} />
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: CORAL_PINK }}>
              <Fish size={14} /> Reef Clusters
            </span>
            <h2 className="text-4xl font-extrabold text-white mt-2">Projects</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {projects.map((project, i) => {
              const tech = Array.isArray(project.techStack) ? project.techStack : [];
              const blobRadius = i % 2 === 0
                ? '62% 38% 50% 50% / 48% 52% 48% 52%'
                : '42% 58% 52% 48% / 52% 46% 54% 48%';
              return (
                <motion.article key={i} variants={fadeUp} whileHover={{ y: -8, rotate: i % 2 === 0 ? -1.2 : 1.2 }}
                  className="rounded-[2rem] border border-white/10 overflow-hidden"
                  style={{ background: 'rgba(6,58,104,0.55)', boxShadow: '0 20px 45px rgba(1,32,61,0.45)' }}>
                  {project.image ? (
                    <img src={project.image} alt={project.title} className="w-full h-40 object-cover" style={{ borderRadius: blobRadius }} />
                  ) : (
                    <div className="w-full h-28 flex items-center justify-center" style={{ borderRadius: blobRadius, background: `linear-gradient(140deg, ${CORAL_PINK}55, ${KELP}44)` }}>
                      <Fish size={34} style={{ color: FOAM }} />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                    {project.description && <p className="text-sm leading-relaxed mb-4" style={{ color: '#cfe8f7' }}>{project.description}</p>}
                    {tech.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-5">
                        {tech.map((t, j) => (
                          <span key={j} className="px-2.5 py-1 rounded-full text-xs font-medium"
                            style={{ backgroundColor: `${CORAL}2e`, color: CORAL_PINK, border: `1px solid ${CORAL}55` }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-4">
                      {project.liveUrl && project.liveUrl !== '#' && (
                        <a href={project.liveUrl} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline" style={{ color: FOAM }}>
                          <ExternalLink size={14} /> Explore
                        </a>
                      )}
                      {project.githubUrl && project.githubUrl !== '#' && (
                        <a href={project.githubUrl} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline" style={{ color: 'rgba(207,232,247,0.75)' }}>
                          <Github size={14} /> Source
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

/* ---------- Experience (currents) ---------- */

const Experience = ({ experience }) => {
  if (!experience?.length) return null;
  return (
    <section id="experience" className="relative py-24 px-6 overflow-hidden" style={{ backgroundColor: OCEAN_2 }}>
      <Bubbles count={6} />
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: CORAL_PINK }}>
              <Waves size={14} /> Ocean Currents
            </span>
            <h2 className="text-4xl font-extrabold text-white mt-2">Experience</h2>
          </motion.div>
          <div className="relative">
            <div className="absolute left-5 top-4 bottom-4 border-l-2 border-dashed" style={{ borderColor: `${FOAM}55` }} aria-hidden="true" />
            {experience.map((exp, i) => (
              <motion.div key={i} variants={fadeUp} className="relative pl-16 pb-9 last:pb-0">
                <div className="absolute left-0 top-0 w-11 h-11 rounded-full flex items-center justify-center border-2"
                  style={{ backgroundColor: OCEAN, borderColor: i % 2 === 0 ? CORAL_PINK : FOAM }}>
                  <Fish size={16} style={{ color: i % 2 === 0 ? CORAL_PINK : FOAM }} />
                </div>
                <div className="rounded-2xl p-5 border border-white/10" style={{ background: 'rgba(2,62,115,0.4)' }}>
                  <div className="flex flex-wrap items-center gap-3 mb-1.5">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase text-white"
                      style={{ backgroundColor: i % 2 === 0 ? CORAL : `${KELP}cc` }}>
                      {exp.period || 'Drifting'}
                    </span>
                    <h3 className="font-bold text-white">{exp.role}</h3>
                    <span className="text-sm font-medium" style={{ color: FOAM }}>· {exp.company}</span>
                  </div>
                  {exp.description && <p className="text-sm leading-relaxed" style={{ color: '#cfe8f7' }}>{exp.description}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* ---------- Testimonials (bottled messages) ---------- */

const Testimonials = ({ testimonials }) => {
  if (!testimonials?.length) return null;
  return (
    <section id="testimonials" className="relative py-24 px-6 overflow-hidden" style={{ backgroundColor: OCEAN }}>
      <Bubbles count={8} />
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: CORAL_PINK }}>
              <Anchor size={14} /> Bottled Messages
            </span>
            <h2 className="text-4xl font-extrabold text-white mt-2">Testimonials</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUp} whileHover={{ y: -5 }}>
                <div className="rounded-2xl p-6 border border-white/10"
                  style={{ background: 'rgba(6,58,104,0.5)', transform: `rotate(${((i * 31) % 5) - 2}deg)` }}>
                  <p className="text-sm italic leading-relaxed mb-5" style={{ color: '#e6f2fa' }}>
                  <span className="text-lg" style={{ color: CORAL_PINK }}>"</span>{t.text}<span className="text-lg" style={{ color: CORAL_PINK }}>"</span>
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-dashed" style={{ borderColor: `${FOAM}44` }}>
                  {t.avatar
                    ? <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border-2" style={{ borderColor: `${CORAL_PINK}88` }} />
                    : <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: `linear-gradient(140deg, ${CORAL_PINK}, ${CORAL})` }}>
                        {initialsOf(t.name) || '?'}
                      </div>}
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-white truncate">{t.name}</div>
                    <div className="text-xs truncate" style={{ color: FOAM }}>{t.role}</div>
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
};

/* ---------- Contact (surface) ---------- */

const Contact = ({ p, socials }) => {
  const links = [
    { url: socials?.github, label: 'GitHub', Icon: Github },
    { url: socials?.linkedin, label: 'LinkedIn', Icon: Linkedin },
    { url: socials?.twitter, label: 'Twitter', Icon: Twitter },
  ].filter((l) => l.url);
  const email = p.email || socials?.email;

  return (
    <section id="contact" className="relative py-24 px-6 overflow-hidden"
      style={{ background: `linear-gradient(180deg, ${OCEAN} 0%, #0a4d8c 100%)` }}>
      <Bubbles count={12} />
      <LightRays />
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.3em] uppercase" style={{ color: CORAL_PINK }}>
              <Waves size={14} /> Surfacing
            </span>
            <h2 className="text-4xl font-extrabold text-white mt-2 mb-3">Come Up for Air</h2>
            <p className="mb-9" style={{ color: '#cfe8f7' }}>The best ideas surface in conversation — send a message and let's talk.</p>
          </motion.div>
          <motion.div variants={fadeUp} className="flex justify-center gap-4 flex-wrap mb-9">
            {email && (
              <a href={`mailto:${email}`} className="flex items-center gap-2 px-7 py-3 rounded-full text-white text-sm font-semibold shadow-lg transition-transform hover:scale-[1.04]"
                style={{ background: `linear-gradient(180deg, ${CORAL_PINK}, ${CORAL})` }}>
                <Mail size={17} /> Send a Message
              </a>
            )}
            {p.phone && (
              <a href={`tel:${p.phone}`} className="flex items-center px-6 py-3 rounded-full text-sm font-semibold border transition-colors hover:bg-white/10"
                style={{ borderColor: `${FOAM}66`, color: FOAM }}>
                {p.phone}
              </a>
            )}
          </motion.div>
          <motion.div variants={fadeUp} className="flex justify-center gap-3">
            {links.map(({ url, label, Icon }) => (
              <a key={label} href={url} target="_blank" rel="noreferrer" aria-label={label}
                className="w-11 h-11 rounded-full border flex items-center justify-center transition-colors hover:bg-white/10"
                style={{ borderColor: `${FOAM}44`, color: FOAM }}>
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

export default function CoralReef() {
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

  const [depth, setDepth] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      setDepth(total > 0 ? (window.scrollY / total) * 40 : 0);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = ['About', 'Skills', 'Reef', 'Currents', 'Surface'];
  const navTargets = ['#about', '#skills', '#projects', '#experience', '#contact'];

  return (
    <div className="font-sans antialiased" style={{ backgroundColor: DEEP }}>
      {REEF_STYLE}

      {/* Depth gauge */}
      <div className="fixed right-3 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-2" aria-hidden="true">
        <span className="font-mono text-[9px]" style={{ color: FOAM }}>{Math.round(depth)}m</span>
        <div className="relative w-1.5 h-44 rounded-full bg-white/10 overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 rounded-full transition-all duration-200"
            style={{ height: `${(depth / 40) * 100}%`, background: `linear-gradient(180deg, ${FOAM}, ${KELP})` }} />
        </div>
        <Anchor size={12} style={{ color: FOAM }} />
      </div>

      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/10"
        style={{ backgroundColor: 'rgba(1,32,61,0.85)', backdropFilter: 'blur(10px)' }}>
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <a href="#hero" className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
            <span className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(140deg, ${CORAL_PINK}, ${CORAL})` }}>
              <Fish size={14} className="text-white" />
            </span>
            {p.name || 'The Reef'}
          </a>
          <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto">
            {navItems.map((item, i) => (
              <a key={item} href={navTargets[i]}
                className="text-[11px] font-semibold uppercase tracking-[0.2em] whitespace-nowrap transition-colors hover:opacity-70"
                style={{ color: FOAM }}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <Hero p={p} />
      <About p={p} stats={stats} />
      <Skills skills={skills} />
      <Projects projects={projects} />
      <Experience experience={experience} />
      <Testimonials testimonials={testimonials} />
      <Contact p={p} socials={socials} />

      <footer className="py-10 px-6 text-center" style={{ backgroundColor: DEEP }}>
        <div className="flex items-center justify-center gap-2 mb-3" aria-hidden="true">
          <Kelp h={26} delay={0} />
          <span className="text-xs tracking-[0.3em] uppercase" style={{ color: '#6f9ab5' }}>© {year} {p.name} · Coral Reef</span>
          <Kelp h={26} delay={0.7} />
        </div>
      </footer>
    </div>
  );
}
