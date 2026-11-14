import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import { motion } from 'framer-motion';
import {
  Waves, Anchor, Sailboat, Wind, Droplets, ExternalLink, Github, Linkedin,
  Twitter, Mail, MapPin, ChevronDown, Quote, Send, Phone
} from 'lucide-react';

/**
 * Wave Distortion Portfolio Template
 * Category: Animated / Motion
 * Description: Wavy distortion effect on images and section borders. Animated SVG wave paths as dividers. Ocean-wave-inspired fluid motion throughout.
 */

/* ------------------------------------------------------------------ */
/* Deep-sea palette                                                    */
/* ------------------------------------------------------------------ */
const ABYSS = '#031019';
const SEA = {
  about: '#0a2e46',
  skills: '#0d3a58',
  projects: '#092c44',
  experience: '#071f33',
  testimonials: '#051626',
  contact: '#030e1a',
  footer: '#020a12',
};
const FOAM = '#eafcff';
const INK = '#dcf1fb';
const MUTE = 'rgba(205,232,244,0.72)';
const TEAL = '#35e0c8';
const CYAN = '#7dd3fc';

/* Template-scoped keyframes & hover distortion rules */
const STYLE_CSS = `
@keyframes wdSlide { from { transform: translateX(0); } to { transform: translateX(-1440px); } }
@keyframes wdBob { 0%,100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-14px) rotate(4deg); } }
@keyframes wdRise { 0% { transform: translateY(6vh); opacity: 0; } 12% { opacity: .55; } 85% { opacity: .35; } 100% { transform: translateY(-110vh); opacity: 0; } }
@keyframes wdShimmer { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
.wd-bubble { position: absolute; bottom: -40px; border-radius: 9999px; pointer-events: none;
  background: radial-gradient(circle at 32% 30%, rgba(255,255,255,.65), rgba(125,211,252,.14) 62%, rgba(125,211,252,0) 74%);
  animation: wdRise linear infinite; }
.wd-card { transition: transform .45s ease, box-shadow .45s ease, border-color .45s ease; }
.wd-card:hover { transform: translateY(-9px) rotate(-.6deg);
  border-color: rgba(53,224,200,.55);
  box-shadow: 0 26px 60px rgba(1,8,18,.65), 0 0 26px rgba(53,224,200,.14); }
.wd-card .wd-card-wave { opacity: 0; transition: opacity .4s ease; }
.wd-card:hover .wd-card-wave { opacity: 1; }
.wd-img { transition: filter .5s ease, transform .5s ease; }
.wd-card:hover .wd-img { filter: url(#wd-distort); transform: scale(1.04) rotate(-.6deg); }
`;

/* ------------------------------------------------------------------ */
/* Deterministic SVG wave geometry (seamless on -1440px translate)     */
/* ------------------------------------------------------------------ */
const wavePath = (width, midY, amp, bottom) => {
  const periods = 6; /* 3 per half => translating half the width loops perfectly */
  const seg = width / periods;
  let d = `M 0 ${midY}`;
  for (let i = 0; i < periods; i++) {
    const x = i * seg;
    d += ` Q ${x + seg * 0.25} ${midY - amp} ${x + seg * 0.5} ${midY}`;
    d += ` Q ${x + seg * 0.75} ${midY + amp} ${x + seg} ${midY}`;
  }
  d += ` L ${width} ${bottom} L 0 ${bottom} Z`;
  return d;
};
const WAVE_MAIN = wavePath(2880, 58, 24, 120);
const WAVE_FOAM = wavePath(2880, 52, 34, 120);
const WAVE_MINI = wavePath(2880, 16, 9, 40);

const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
};

const initialsOf = (name) => {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  return (parts.slice(0, 2).map(w => w[0].toUpperCase()).join('')) || 'W';
};

/* Section-end divider: the NEXT section's water cresting into this one */
const DiveWave = ({ fill, height = 76, speed = 17 }) => (
  <div aria-hidden className="relative w-full overflow-hidden" style={{ height }}>
    <svg className="absolute bottom-0 left-0 w-[200%] max-w-none h-full" viewBox="0 0 2880 120"
      preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path d={WAVE_FOAM} fill="rgba(234,252,255,0.16)" style={{ animation: `wdSlide ${speed * 1.7}s linear infinite` }} />
      <path d={WAVE_MAIN} fill={fill} style={{ animation: `wdSlide ${speed}s linear infinite` }} />
    </svg>
  </div>
);

/* Small looping ripple line used as an accent under headings */
const MiniWave = ({ color = TEAL, className = '' }) => (
  <svg viewBox="0 0 2880 40" preserveAspectRatio="none" className={`h-5 ${className}`} aria-hidden>
    <path d={WAVE_MINI} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
      style={{ animation: 'wdSlide 8s linear infinite' }} />
  </svg>
);

const Bubbles = ({ count = 14 }) => (
  <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: count }, (_, i) => {
      const size = 6 + ((i * 13) % 20);
      return (
        <span key={i} className="wd-bubble" style={{
          left: `${(i * 37) % 100}%`,
          width: `${size}px`,
          height: `${size}px`,
          animationDuration: `${9 + ((i * 7) % 10)}s`,
          animationDelay: `${(i * 29) % 9}s`,
        }} />
      );
    })}
  </div>
);

const SectionHead = ({ icon: Icon, label, title, depth }) => (
  <motion.div variants={fadeUp} className="text-center mb-12 md:mb-16">
    <p className="text-[11px] uppercase mb-3 flex items-center justify-center gap-2"
      style={{ letterSpacing: '0.32em', color: TEAL }}>
      <Icon size={13} /> {label}
    </p>
    <h2 className="text-3xl md:text-5xl font-bold tracking-tight" style={{ color: FOAM }}>
      {title}
    </h2>
    <MiniWave className="mx-auto mt-5 w-44" />
    {depth && (
      <p className="mt-4 text-[10px] uppercase font-mono" style={{ letterSpacing: '0.4em', color: 'rgba(125,211,252,0.45)' }}>
        {depth}
      </p>
    )}
  </motion.div>
);

/* ------------------------------------------------------------------ */
/* Hero — sunlit surface                                               */
/* ------------------------------------------------------------------ */
const Hero = ({ data }) => {
  const name = data.personal?.name || 'My Portfolio';
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-28"
      style={{ background: 'radial-gradient(1100px 480px at 50% -8%, rgba(125,211,252,0.16), transparent 62%), linear-gradient(180deg, #062033 0%, #052a42 55%, #0a2e46 100%)' }}>
      {/* light shafts */}
      <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 left-[8%] w-56 h-[80vh] rotate-[14deg]"
          style={{ background: 'linear-gradient(180deg, rgba(125,211,252,0.14), transparent 70%)', filter: 'blur(8px)' }} />
        <div className="absolute -top-24 left-[38%] w-40 h-[70vh] rotate-[9deg]"
          style={{ background: 'linear-gradient(180deg, rgba(53,224,200,0.10), transparent 65%)', filter: 'blur(10px)' }} />
        <div className="absolute -top-24 right-[12%] w-64 h-[85vh] rotate-[-12deg]"
          style={{ background: 'linear-gradient(180deg, rgba(125,211,252,0.12), transparent 72%)', filter: 'blur(8px)' }} />
      </div>
      <Bubbles count={16} />

      <motion.div initial="hidden" animate="visible" variants={stagger} className="relative max-w-3xl w-full text-center">
        <motion.div variants={fadeUp} className="mb-7 flex justify-center">
          <span style={{ animation: 'wdBob 5.5s ease-in-out infinite', color: CYAN, display: 'inline-flex' }}>
            <Sailboat size={40} strokeWidth={1.4} />
          </span>
        </motion.div>
        <motion.p variants={fadeUp} className="text-[11px] uppercase mb-5" style={{ letterSpacing: '0.42em', color: TEAL }}>
          Riding the current
        </motion.p>
        <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-5 bg-clip-text text-transparent"
          style={{
            backgroundImage: `linear-gradient(90deg, ${FOAM}, ${TEAL}, ${CYAN}, ${FOAM})`,
            backgroundSize: '220% 100%',
            animation: 'wdShimmer 7s ease-in-out infinite',
          }}>
          {name}
        </motion.h1>
        {data.personal?.title && (
          <motion.p variants={fadeUp} className="text-xl md:text-2xl font-medium mb-4" style={{ color: CYAN }}>
            {data.personal.title}
          </motion.p>
        )}
        {data.personal?.tagline && (
          <motion.p variants={fadeUp} className="text-sm md:text-base max-w-xl mx-auto mb-6 leading-relaxed" style={{ color: MUTE }}>
            {data.personal.tagline}
          </motion.p>
        )}
        {data.personal?.location && (
          <motion.p variants={fadeUp} className="inline-flex items-center gap-2 text-xs uppercase mb-10 px-4 py-1.5 rounded-full border"
            style={{ letterSpacing: '0.25em', color: MUTE, borderColor: 'rgba(125,211,252,0.35)', background: 'rgba(10,46,70,0.5)' }}>
            <MapPin size={13} style={{ color: TEAL }} /> {data.personal.location}
          </motion.p>
        )}
        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
          <a href="#about"
            className="px-7 py-3 rounded-full font-semibold transition-transform hover:-translate-y-0.5"
            style={{ background: `linear-gradient(90deg, ${TEAL}, ${CYAN})`, color: '#03202f', boxShadow: '0 10px 30px rgba(53,224,200,0.3)' }}>
            Dive Deeper
          </a>
          <a href="#projects"
            className="px-7 py-3 rounded-full font-semibold border transition-colors hover:bg-white/10"
            style={{ borderColor: 'rgba(125,211,252,0.5)', color: FOAM }}>
            The Depths
          </a>
          <a href="#contact"
            className="px-7 py-3 rounded-full font-semibold border transition-colors hover:bg-white/10"
            style={{ borderColor: 'rgba(205,232,244,0.28)', color: MUTE }}>
            Reach the Harbor
          </a>
        </motion.div>
      </motion.div>

      <motion.a href="#about" aria-label="Scroll down" className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2.2 }} style={{ color: TEAL }}>
        <ChevronDown size={26} />
      </motion.a>

      {/* layered surface waves flowing into the About section */}
      <div aria-hidden className="absolute bottom-0 left-0 right-0 h-[150px] overflow-hidden pointer-events-none">
        <div className="absolute bottom-[64px] left-0 w-[200%] h-[70px]">
          <svg viewBox="0 0 2880 120" preserveAspectRatio="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d={WAVE_FOAM} fill="rgba(125,211,252,0.12)" style={{ animation: 'wdSlide 30s linear infinite' }} />
          </svg>
        </div>
        <div className="absolute bottom-[30px] left-0 w-[200%] h-[70px]">
          <svg viewBox="0 0 2880 120" preserveAspectRatio="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d={WAVE_MAIN} fill="rgba(13,58,88,0.5)" style={{ animation: 'wdSlide 24s linear infinite' }} />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-[200%] h-[70px]">
          <svg viewBox="0 0 2880 120" preserveAspectRatio="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d={WAVE_FOAM} fill="rgba(234,252,255,0.14)" style={{ animation: 'wdSlide 34s linear infinite' }} />
            <path d={WAVE_MAIN} fill={SEA.about} style={{ animation: 'wdSlide 19s linear infinite' }} />
          </svg>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* About — the shallows                                                */
/* ------------------------------------------------------------------ */
const About = ({ data }) => {
  const name = data.personal?.name || 'This Diver';
  return (
    <section id="about" className="relative overflow-hidden pt-16"
      style={{ background: `linear-gradient(180deg, ${SEA.about} 0%, #0c3854 100%)` }}>
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <SectionHead icon={Wind} label="Chapter I" title="The Shallows" depth="DEPTH 0180M" />
          <div className="grid md:grid-cols-[auto_1fr] gap-12 items-center">
            <motion.div variants={fadeUp} className="flex justify-center">
              {/* brass porthole avatar / monogram */}
              <div className="relative w-52 h-52 md:w-60 md:h-60 rounded-full p-[10px]"
                style={{
                  background: 'conic-gradient(from 120deg, rgba(53,224,200,0.75), rgba(125,211,252,0.28), rgba(53,224,200,0.75))',
                  boxShadow: '0 0 44px rgba(53,224,200,0.22), inset 0 0 18px rgba(2,12,24,0.8)',
                }}>
                <div className="w-full h-full rounded-full overflow-hidden flex flex-col items-center justify-center"
                  style={{
                    background: 'radial-gradient(circle at 35% 28%, #11517a, #052133 72%)',
                    boxShadow: 'inset 0 10px 30px rgba(0,0,0,0.7)',
                  }}>
                  {data.personal?.avatar ? (
                    <img src={data.personal.avatar} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Waves size={26} style={{ color: TEAL }} className="mb-3" />
                      <span className="text-5xl font-bold tracking-widest" style={{ color: FOAM }}>
                        {initialsOf(name)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
            <motion.div variants={fadeUp}>
              <p className="text-[11px] uppercase mb-4 flex items-center gap-2" style={{ letterSpacing: '0.3em', color: TEAL }}>
                <Droplets size={14} /> Log entries from the surface
              </p>
              <p className="text-base md:text-lg leading-relaxed" style={{ color: INK }}>
                {data.personal?.bio || `${name} keeps this log sealed for now. The voyage — and the biography — is still being charted.`}
              </p>
              {(data.stats?.yearsExperience || data.stats?.projectsCompleted || data.stats?.happyClients) && (
                <div className="grid grid-cols-3 gap-4 mt-9">
                  {[
                    { label: 'Years at sea', value: data.stats.yearsExperience },
                    { label: 'Voyages shipped', value: data.stats.projectsCompleted },
                    { label: 'Happy crews', value: data.stats.happyClients },
                  ].filter(s => s.value !== undefined && s.value !== null && s.value !== '').map((s, i) => (
                    <div key={i} className="text-center p-4 rounded-2xl border" style={{ borderColor: 'rgba(125,211,252,0.22)', background: 'rgba(6,32,51,0.6)' }}>
                      <div className="text-3xl font-bold" style={{ color: FOAM }}>{s.value}</div>
                      <div className="text-[10px] uppercase mt-1.5" style={{ letterSpacing: '0.16em', color: MUTE }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
      <DiveWave fill={SEA.skills} />
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Skills — the current                                                */
/* ------------------------------------------------------------------ */
const Skills = ({ data }) => (
  <section id="skills" className="relative overflow-hidden"
    style={{ background: `linear-gradient(180deg, ${SEA.skills} 0%, #10507a 100%)` }}>
    <div className="max-w-4xl mx-auto px-6 pb-16">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <SectionHead icon={Waves} label="Chapter II" title="The Current" depth="DEPTH 0420M" />
        <motion.p variants={fadeUp} className="text-center mb-12 max-w-xl mx-auto" style={{ color: MUTE }}>
          Skills flow like water — each one a current carrying the work forward.
        </motion.p>
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
          {data.skills.map((skill, i) => (
            <motion.div key={i} variants={fadeUp} className="pb-2">
              <div className="flex justify-between items-baseline mb-2.5">
                <span className="font-semibold text-lg" style={{ color: FOAM }}>{skill.name}</span>
                <span className="text-sm font-mono" style={{ color: TEAL }}>{skill.level || 85}%</span>
              </div>
              <div className="h-2.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(234,252,255,0.12)' }}>
                <motion.div className="h-full rounded-full"
                  initial={{ width: 0 }} whileInView={{ width: `${skill.level || 85}%` }}
                  transition={{ duration: 1.1, delay: (i % 3) * 0.12, ease: 'easeOut' }} viewport={{ once: true }}
                  style={{ background: `linear-gradient(90deg, ${TEAL}, ${CYAN})`, boxShadow: `0 0 14px rgba(53,224,200,0.45)` }} />
              </div>
              {skill.category && (
                <span className="text-[10px] uppercase mt-2 inline-block" style={{ letterSpacing: '0.2em', color: 'rgba(125,211,252,0.6)' }}>
                  {skill.category}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
    <DiveWave fill={SEA.projects} speed={15} />
  </section>
);

/* ------------------------------------------------------------------ */
/* Projects — the depths (cards distort like water on hover)           */
/* ------------------------------------------------------------------ */
const Projects = ({ data }) => (
  <section id="projects" className="relative overflow-hidden"
    style={{ background: `linear-gradient(180deg, ${SEA.projects} 0%, #072338 100%)` }}>
    {/* SVG filter: genuine wave distortion applied to images on hover */}
    <svg aria-hidden className="absolute w-0 h-0 overflow-hidden">
      <defs>
        <filter id="wd-distort" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.07" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="11" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
    <div className="max-w-6xl mx-auto px-6 pb-16">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={stagger}>
        <SectionHead icon={Anchor} label="Chapter III" title="The Depths" depth="DEPTH 0910M" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.projects.map((project, i) => (
            <motion.article key={i} variants={fadeUp} className="wd-card group rounded-3xl border overflow-hidden"
              style={{ background: 'rgba(4,20,33,0.72)', borderColor: 'rgba(125,211,252,0.18)', backdropFilter: 'blur(6px)' }}>
              <div className="relative">
                <svg viewBox="0 0 2880 40" preserveAspectRatio="none" className="wd-card-wave absolute top-0 left-0 w-full h-4 z-10" aria-hidden>
                  <path d={WAVE_MINI} fill="none" stroke={TEAL} strokeWidth="5" style={{ animation: 'wdSlide 9s linear infinite' }} />
                </svg>
                {project.image && (
                  <img src={project.image} alt={project.title} className="wd-img w-full h-40 object-cover" />
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2" style={{ color: FOAM }}>{project.title}</h3>
                {project.description && (
                  <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: MUTE }}>{project.description}</p>
                )}
                {project.techStack?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.map((tech, j) => (
                      <span key={j} className="text-[10px] uppercase px-2.5 py-1 rounded-full border"
                        style={{ letterSpacing: '0.14em', color: CYAN, borderColor: 'rgba(125,211,252,0.35)', background: 'rgba(125,211,252,0.08)' }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-5 text-sm font-medium">
                  {project.liveUrl && project.liveUrl !== '#' && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity" style={{ color: TEAL }}>
                      <ExternalLink size={15} /> Visit
                    </a>
                  )}
                  {project.githubUrl && project.githubUrl !== '#' && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity" style={{ color: MUTE }}>
                      <Github size={15} /> Code
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </div>
    <DiveWave fill={SEA.experience} speed={14} />
  </section>
);

/* ------------------------------------------------------------------ */
/* Experience — the descent                                            */
/* ------------------------------------------------------------------ */
const Experience = ({ data }) => (
  <section id="experience" className="relative overflow-hidden"
    style={{ background: `linear-gradient(180deg, ${SEA.experience} 0%, #04162a 100%)` }}>
    <div className="max-w-4xl mx-auto px-6 pb-16">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <SectionHead icon={Droplets} label="Chapter IV" title="The Descent" depth="DEPTH 2100M" />
        <div className="relative border-l-2 pl-8 md:pl-12 space-y-12" style={{ borderColor: 'rgba(53,224,200,0.3)' }}>
          {data.experience.map((exp, i) => (
            <motion.div key={i} variants={fadeUp} className="relative">
              <div className="absolute -left-[43px] md:-left-[59px] top-1.5 w-[18px] h-[18px] rounded-full flex items-center justify-center"
                style={{ background: 'rgba(53,224,200,0.2)', border: `2px solid ${TEAL}`, boxShadow: '0 0 14px rgba(53,224,200,0.5)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: TEAL }} />
              </div>
              {exp.period && (
                <span className="text-[10px] uppercase inline-block mb-2 px-3 py-1 rounded-full border font-mono"
                  style={{ letterSpacing: '0.2em', color: TEAL, borderColor: 'rgba(53,224,200,0.4)' }}>
                  {exp.period} &nbsp;&middot;&nbsp; DEPTH -{(180 + i * 260).toLocaleString()}m
                </span>
              )}
              <h3 className="text-2xl font-bold" style={{ color: FOAM }}>{exp.role}</h3>
              {exp.company && <p className="italic mb-2" style={{ color: CYAN }}>at {exp.company}</p>}
              {exp.description && (
                <p className="text-sm leading-relaxed" style={{ color: MUTE }}>{exp.description}</p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
    <DiveWave fill={SEA.testimonials} speed={13} />
  </section>
);

/* ------------------------------------------------------------------ */
/* Testimonials — messages in bottles                                  */
/* ------------------------------------------------------------------ */
const Testimonials = ({ data }) => (
  <section id="testimonials" className="relative overflow-hidden"
    style={{ background: `linear-gradient(180deg, ${SEA.testimonials} 0%, #03101f 100%)` }}>
    <Bubbles count={8} />
    <div className="max-w-6xl mx-auto px-6 pb-16">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <SectionHead icon={Mail} label="Chapter V" title="Messages in Bottles" depth="DEPTH 3400M" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {data.testimonials.map((t, i) => (
            <motion.figure key={i} variants={fadeUp} className="wd-card relative rounded-3xl border p-7 overflow-hidden"
              style={{ background: 'rgba(8,28,46,0.7)', borderColor: 'rgba(125,211,252,0.16)' }}>
              <svg viewBox="0 0 2880 40" preserveAspectRatio="none" className="wd-card-wave absolute top-0 left-0 w-full h-4" aria-hidden>
                <path d={WAVE_MINI} fill="none" stroke={TEAL} strokeWidth="5" style={{ animation: 'wdSlide 10s linear infinite' }} />
              </svg>
              <Quote size={22} style={{ color: TEAL }} className="mb-3" />
              <blockquote className="italic leading-relaxed mb-5" style={{ color: INK }}>
                &ldquo;{t.text}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3">
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                    style={{ background: 'radial-gradient(circle at 30% 30%, #11517a, #072a44)', color: FOAM, border: '1px solid rgba(53,224,200,0.4)' }}>
                    {initialsOf(t.name)}
                  </div>
                )}
                <div>
                  <div className="font-bold text-sm" style={{ color: FOAM }}>{t.name}</div>
                  {t.role && <div className="text-xs" style={{ color: MUTE }}>{t.role}</div>}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </motion.div>
    </div>
    <DiveWave fill={SEA.contact} speed={12} />
  </section>
);

/* ------------------------------------------------------------------ */
/* Contact — the harbor (trench floor, bioluminescent glow)            */
/* ------------------------------------------------------------------ */
const Contact = ({ data }) => {
  const email = data.personal?.email || data.socials?.email;
  const socials = [
    { key: 'github', url: data.socials?.github, Icon: Github },
    { key: 'linkedin', url: data.socials?.linkedin, Icon: Linkedin },
    { key: 'twitter', url: data.socials?.twitter, Icon: Twitter },
  ].filter(s => s.url);
  return (
    <section id="contact" className="relative overflow-hidden"
      style={{ background: `radial-gradient(760px 340px at 50% 112%, rgba(53,224,200,0.14), transparent 65%), ${SEA.contact}` }}>
      <Bubbles count={10} />
      <div className="max-w-2xl mx-auto px-6 pb-16 text-center relative">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
          <motion.div variants={fadeUp} className="mb-7 flex justify-center">
            <span style={{ animation: 'wdBob 6s ease-in-out infinite', color: TEAL, display: 'inline-flex' }}>
              <Anchor size={34} strokeWidth={1.4} />
            </span>
          </motion.div>
          <motion.p variants={fadeUp} className="text-[11px] uppercase mb-4" style={{ letterSpacing: '0.4em', color: TEAL }}>
            The Harbor
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-bold mb-5" style={{ color: FOAM }}>
            Dock your message here
          </motion.h2>
          <motion.p variants={fadeUp} className="italic mb-10" style={{ color: MUTE }}>
            Every wave eventually reaches a shore. Send yours along.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center items-center gap-4 mb-10">
            {email && (
              <a href={`mailto:${email}`}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold transition-transform hover:-translate-y-0.5"
                style={{ background: `linear-gradient(90deg, ${TEAL}, ${CYAN})`, color: '#03202f', boxShadow: '0 12px 34px rgba(53,224,200,0.3)' }}>
                <Send size={18} /> Send a Message
              </a>
            )}
            {data.personal?.phone && (
              <a href={`tel:${data.personal.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold border transition-colors hover:bg-white/10"
                style={{ borderColor: 'rgba(125,211,252,0.45)', color: FOAM }}>
                <Phone size={17} /> Call
              </a>
            )}
            {socials.map(({ key, url, Icon }) => (
              <a key={key} href={url} target="_blank" rel="noreferrer" aria-label={key}
                className="inline-flex items-center justify-center w-12 h-12 rounded-full border transition-colors hover:bg-white/10"
                style={{ borderColor: 'rgba(125,211,252,0.4)', color: FOAM }}>
                <Icon size={18} />
              </a>
            ))}
          </motion.div>
        </motion.div>
      </div>
      <DiveWave fill={SEA.footer} height={60} speed={11} />
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */
export default function WaveDistortion() {
  const { portfolioData: data } = usePortfolio();
  const name = data.personal?.name || 'My Portfolio';

  return (
    <div className="font-sans antialiased overflow-x-hidden" style={{ background: ABYSS }}>
      <style>{STYLE_CSS}</style>
      <Hero data={data} />
      {(data.personal?.bio || data.personal?.avatar) && <About data={data} />}
      {data.skills?.length > 0 && <Skills data={data} />}
      {data.projects?.length > 0 && <Projects data={data} />}
      {data.experience?.length > 0 && <Experience data={data} />}
      {data.testimonials?.length > 0 && <Testimonials data={data} />}
      <Contact data={data} />
      <footer className="py-8 text-center" style={{ background: SEA.footer }}>
        <Waves size={16} className="mx-auto mb-3" style={{ color: 'rgba(53,224,200,0.5)' }} />
        <p className="text-[11px] uppercase" style={{ letterSpacing: '0.28em', color: 'rgba(205,232,244,0.45)' }}>
          &copy; {new Date().getFullYear()} {name} &middot; Wave Distortion
        </p>
      </footer>
    </div>
  );
}
