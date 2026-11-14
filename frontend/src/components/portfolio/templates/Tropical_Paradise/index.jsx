import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import { motion } from 'framer-motion';
import {
  Sun, Flower2, Palmtree, Waves, Mail, Github, Linkedin, Twitter,
  ExternalLink, MapPin, Star, Heart, ChevronDown, Camera
} from 'lucide-react';

/**
 * Tropical Paradise Portfolio Template
 * Category: Colorful / Vibrant
 * Description: Tropical leaf patterns, vibrant greens, hot pinks, and sunny yellows. Palm tree silhouettes, exotic flower accents. Summer vacation energy.
 */

const INK = '#1b4332';
const PINK = '#ec4899';
const GREEN = '#16a34a';
const YELLOW = '#facc15';

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } }
};

const initialsOf = (name) => {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  return (parts.slice(0, 2).map(w => w[0].toUpperCase()).join('')) || 'A';
};

const BAR_COLORS = [
  'linear-gradient(90deg,#16a34a,#4ade80)',
  'linear-gradient(90deg,#ec4899,#f9a8d4)',
  'linear-gradient(90deg,#f59e0b,#fde047)',
  'linear-gradient(90deg,#0891b2,#67e8f9)',
];

// Monstera leaf decorative SVG
const MonsteraLeaf = ({ className = '', style, color = GREEN }) => (
  <svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg" className={className} style={style} aria-hidden>
    <g fill={color}>
      <path d="M60 8 C 20 20, 6 58, 14 92 C 22 124, 48 138, 60 136 C 72 138, 98 124, 106 92 C 114 58, 100 20, 60 8 Z" />
      <path d="M60 14 L60 130" stroke="#0f3d22" strokeWidth="4" fill="none" />
      <path d="M60 34 L22 30 M60 34 L98 30 M60 60 L14 58 M60 60 L106 58 M60 88 L20 90 M60 88 L100 90 M60 112 L30 118 M60 112 L90 118"
        stroke="#fafff5" strokeWidth="7" fill="none" strokeLinecap="round" />
    </g>
  </svg>
);

// Palm frond decorative SVG
const PalmFrond = ({ className = '', style, color = '#15803d' }) => (
  <svg viewBox="0 0 160 60" xmlns="http://www.w3.org/2000/svg" className={className} style={style} aria-hidden>
    <path d="M4 50 Q 80 -10 156 50" stroke={color} strokeWidth="3" fill="none" />
    {[...Array(9)].map((_, i) => {
      const x = 16 + i * 15;
      const y = 50 - Math.sin((i / 8) * Math.PI) * 26;
      return (
        <g key={i}>
          <path d={`M${x} ${y + 12} Q ${x - 4} ${y}, ${x + 2} ${y - 8}`} stroke={color} strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d={`M${x} ${y + 12} Q ${x + 8} ${y + 2}, ${x + 14} ${y - 4}`} stroke={color} strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </g>
      );
    })}
  </svg>
);

// Hibiscus flower accent
const Hibiscus = ({ className = '', style, petal = PINK }) => (
  <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" className={className} style={style} aria-hidden>
    {[...Array(5)].map((_, i) => (
      <ellipse key={i} cx="40" cy="22" rx="11" ry="17" fill={petal} opacity="0.92"
        transform={`rotate(${i * 72} 40 40)`} />
    ))}
    <circle cx="40" cy="40" r="9" fill={YELLOW} />
    <circle cx="40" cy="40" r="4" fill="#d97706" />
  </svg>
);

// Palm tree silhouette for the horizon
const PalmSilhouette = ({ className = '', style, color = '#14532d' }) => (
  <svg viewBox="0 0 120 160" xmlns="http://www.w3.org/2000/svg" className={className} style={style} aria-hidden>
    <path d="M58 158 C 60 110, 56 80, 52 52 L 66 52 C 64 84, 66 116, 72 158 Z" fill={color} />
    <path d="M58 54 C 30 44, 14 52, 4 70 C 26 58, 42 60, 58 62 Z" fill={color} />
    <path d="M60 52 C 46 30, 28 24, 12 28 C 34 34, 48 44, 60 58 Z" fill={color} />
    <path d="M62 52 C 74 28, 94 22, 110 26 C 88 34, 74 44, 62 58 Z" fill={color} />
    <path d="M62 54 C 90 44, 106 52, 116 70 C 94 58, 78 60, 62 62 Z" fill={color} />
    <path d="M60 56 C 58 74, 62 86, 66 96 C 58 88, 54 72, 56 58 Z" fill={color} />
  </svg>
);

// Hero — beach at golden hour with a postcard
const Hero = ({ data }) => (
  <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-16"
    style={{ background: 'linear-gradient(180deg,#7dd3fc 0%,#bae6fd 42%,#fef3c7 72%,#fde68a 100%)' }}>
    <motion.div className="absolute" style={{ top: '9%', left: '10%' }}
      animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} aria-hidden>
      <svg viewBox="0 0 120 120" className="w-24 h-24 md:w-32 md:h-32">
        {[...Array(12)].map((_, i) => (
          <rect key={i} x="58" y="4" width="4" height="18" rx="2" fill="#fbbf24" transform={`rotate(${i * 30} 60 60)`} />
        ))}
        <circle cx="60" cy="60" r="26" fill="#fde047" stroke="#fbbf24" strokeWidth="3" />
      </svg>
    </motion.div>
    {[0, 1, 2].map(i => (
      <motion.div key={i} className="absolute" style={{ top: `${12 + i * 13}%`, left: `${55 + i * 9}%` }}
        animate={{ x: [0, 26, 0] }} transition={{ duration: 9 + i * 3, repeat: Infinity }} aria-hidden>
        <div className="w-24 h-8 md:w-36 md:h-11 bg-white/85 rounded-full" />
        <div className="absolute -top-4 left-6 w-12 h-10 md:w-16 md:h-12 bg-white/85 rounded-full" />
      </motion.div>
    ))}
    <MonsteraLeaf className="absolute -left-10 top-24 w-36 md:w-52 opacity-90 rotate-[25deg]" />
    <PalmFrond className="absolute right-0 top-40 w-44 md:w-64 rotate-[18deg] opacity-90" />
    <MonsteraLeaf className="absolute -right-14 bottom-40 w-40 md:w-56 opacity-80 -rotate-[20deg]" color="#15803d" />

    <motion.div initial="hidden" animate="visible" variants={stagger}
      className="relative z-10 max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12 -rotate-1 border-8 border-white ring-2 ring-green-700/20">
      <Hibiscus className="absolute -top-7 -right-7 w-14 h-14 rotate-12" />
      <motion.p variants={fadeUp} className="text-xs font-bold uppercase text-green-700 mb-4 inline-flex items-center gap-2 bg-green-100 px-3 py-1.5 rounded-full" style={{ letterSpacing: '0.2em' }}>
        <Palmtree size={14} /> Greetings from paradise{data.personal?.location ? ` — ${data.personal.location}` : ''}
      </motion.p>
      <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-black mb-4 leading-tight" style={{ color: INK }}>
        {data.personal?.name || 'My Portfolio'}
      </motion.h1>
      {data.personal?.title && (
        <motion.p variants={fadeUp} className="text-xl md:text-2xl font-bold text-pink-600 mb-3">{data.personal.title}</motion.p>
      )}
      {data.personal?.tagline && (
        <motion.p variants={fadeUp} className="text-sm md:text-base mb-8 max-w-xl" style={{ color: '#36555c' }}>
          {data.personal.tagline}
        </motion.p>
      )}
      <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
        <a href="#about" className="px-7 py-3 rounded-full font-bold text-white shadow-lg transition-transform hover:-translate-y-1 hover:rotate-1"
          style={{ background: `linear-gradient(90deg,${PINK},#f472b6)` }}>
          Take the Tour
        </a>
        <a href="#projects" className="px-7 py-3 rounded-full font-bold border-2 border-yellow-500 text-yellow-600 bg-white transition-colors hover:bg-yellow-50">
          See Postcards
        </a>
        <a href="#contact" className="px-7 py-3 rounded-full font-bold border-2 border-green-600 text-green-700 bg-white transition-colors hover:bg-green-50">
          Drop a Coconut
        </a>
      </motion.div>
    </motion.div>

    {/* ocean band + palm silhouettes on the horizon */}
    <div className="absolute bottom-0 left-0 right-0 h-36 md:h-44">
      <div className="absolute inset-x-0 top-0 h-1/2" style={{ background: 'linear-gradient(180deg,#0ea5e9,#0369a1)' }} />
      <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="absolute top-1/2 w-full h-10">
        <path d="M0,20 Q 60,4 120,20 T 240,20 T 360,20 T 480,20 T 600,20 T 720,20 T 840,20 T 960,20 T 1080,20 T 1200,20 T 1320,20 T 1440,20 L1440,40 L0,40 Z" fill="#0369a1" opacity="0.85" />
      </svg>
      <div className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: 'linear-gradient(180deg,#fde68a,#fbbf24)' }} />
      <PalmSilhouette className="absolute bottom-0 left-[6%] w-20 md:w-28 h-auto" />
      <PalmSilhouette className="absolute bottom-0 right-[10%] w-16 md:w-24 h-auto -scale-x-100" color="#166534" />
      <PalmSilhouette className="absolute bottom-0 right-[26%] w-12 md:w-16 h-auto opacity-80" />
    </div>
    <motion.div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-teal-900"
      animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
      <ChevronDown size={26} />
    </motion.div>
  </section>
);

// About — island life
const IslandLife = ({ data }) => (
  <section id="about" className="relative py-24 overflow-hidden" style={{ background: '#fffbeb' }}>
    <MonsteraLeaf className="absolute -right-16 -top-10 w-52 opacity-10 rotate-[160deg]" />
    <PalmFrond className="absolute -left-8 bottom-8 w-56 opacity-10 -rotate-12" color="#ec4899" />
    <div className="max-w-5xl mx-auto px-6 relative z-10">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}
        className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div variants={fadeUp} className="flex justify-center relative">
          <div className="relative rounded-[2.5rem] p-2 bg-white shadow-xl border-4 border-green-100 rotate-2">
            {data.personal?.avatar ? (
              <img src={data.personal.avatar} alt={data.personal.name} className="w-64 h-72 rounded-[2rem] object-cover" />
            ) : (
              <div className="w-64 h-72 rounded-[2rem] flex flex-col items-center justify-center" style={{ background: 'linear-gradient(150deg,#4ade80,#15803d)' }}>
                <Palmtree size={32} className="text-green-50 mb-3" />
                <span className="text-5xl font-black text-white tracking-widest">{initialsOf(data.personal?.name)}</span>
              </div>
            )}
            <Hibiscus className="absolute -bottom-5 -right-5 w-14 h-14 rotate-12" />
          </div>
        </motion.div>
        <motion.div variants={fadeUp}>
          <p className="text-green-700 font-bold text-xs uppercase mb-3 inline-flex items-center gap-2" style={{ letterSpacing: '0.25em' }}>
            <Sun size={15} /> Island Life
          </p>
          <h2 className="text-4xl font-black mb-4" style={{ color: INK }}>The Islander</h2>
          <p className="leading-relaxed mb-8" style={{ color: '#3f6212' }}>
            {data.personal?.bio || 'This island has plenty of stories to share — the bio is still writing itself in the sand.'}
          </p>
          {(data.stats?.yearsExperience || data.stats?.projectsCompleted || data.stats?.happyClients) && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Island years', value: data.stats.yearsExperience, icon: Sun },
                { label: 'Adventures built', value: data.stats.projectsCompleted, icon: Camera },
                { label: 'Smiling visitors', value: data.stats.happyClients, icon: Heart },
              ].filter(s => s.value !== undefined && s.value !== null && s.value !== '').map((s, i) => (
                <div key={i} className="rounded-3xl p-4 text-center bg-white shadow-md border-2 border-yellow-100">
                  <s.icon size={18} className="mx-auto mb-2 text-pink-500" />
                  <div className="text-2xl font-black" style={{ color: INK }}>{s.value}</div>
                  <div className="text-[10px] font-bold uppercase mt-1 text-green-700" style={{ letterSpacing: '0.12em' }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// Skills — beach bag essentials
const BeachBag = ({ data }) => (
  <section id="skills" className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(180deg,#f0fdf4,#dcfce7)' }}>
    <MonsteraLeaf className="absolute -left-14 top-16 w-48 opacity-15" color="#166534" />
    <PalmFrond className="absolute -right-10 bottom-12 w-60 opacity-15 rotate-6" color="#15803d" />
    <div className="max-w-5xl mx-auto px-6 relative z-10">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <motion.div variants={fadeUp} className="text-center mb-12">
          <p className="text-green-700 font-bold text-xs uppercase mb-3 inline-flex items-center gap-2" style={{ letterSpacing: '0.25em' }}>
            <Waves size={15} /> What's in the beach bag
          </p>
          <h2 className="text-4xl font-black" style={{ color: INK }}>Skills &amp; Talents</h2>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-x-10 gap-y-5">
          {data.skills.map((skill, i) => (
            <motion.div key={i} variants={fadeUp}
              className="bg-white rounded-3xl p-5 shadow-md border-2 hover:shadow-lg hover:-translate-y-1 transition-all"
              style={{ borderColor: i % 3 === 0 ? '#bbf7d0' : i % 3 === 1 ? '#fbcfe8' : '#fef08a' }}>
              <div className="flex justify-between items-center mb-3">
                <span className="font-bold" style={{ color: INK }}>{skill.name}</span>
                <span className="text-xs font-black px-2.5 py-1 rounded-full text-white" style={{ background: i % 3 === 0 ? GREEN : i % 3 === 1 ? PINK : '#f59e0b' }}>
                  {skill.level}%
                </span>
              </div>
              <div className="h-3.5 rounded-full overflow-hidden bg-gray-100">
                <motion.div className="h-full rounded-full" style={{ background: BAR_COLORS[i % 4] }}
                  initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: (i % 2) * 0.12 }} viewport={{ once: true }} />
              </div>
              {skill.category && (
                <span className="text-[10px] font-bold uppercase mt-2.5 inline-block text-green-600/80" style={{ letterSpacing: '0.18em' }}>
                  {skill.category}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// Projects — postcard expeditions
const Expeditions = ({ data }) => (
  <section id="projects" className="relative py-24 overflow-hidden" style={{ background: '#fffbeb' }}>
    <Hibiscus className="absolute right-10 top-10 w-12 opacity-40 -rotate-12" petal="#f9a8d4" />
    <MonsteraLeaf className="absolute -left-16 bottom-0 w-56 opacity-10" />
    <div className="max-w-6xl mx-auto px-6 relative z-10">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <motion.div variants={fadeUp} className="text-center mb-14">
          <p className="text-pink-600 font-bold text-xs uppercase mb-3 inline-flex items-center gap-2" style={{ letterSpacing: '0.25em' }}>
            <Camera size={15} /> Postcards from the field
          </p>
          <h2 className="text-4xl font-black" style={{ color: INK }}>Expeditions &amp; Projects</h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.projects.map((project, i) => (
            <motion.div key={i} variants={fadeUp}
              className={`bg-white rounded-3xl overflow-hidden shadow-lg border-2 border-yellow-100 hover:shadow-2xl hover:-translate-y-2 transition-all group ${i % 2 === 0 ? '-rotate-1' : 'rotate-1'} hover:rotate-0`}>
              {project.image && (
                <div className="h-44 overflow-hidden relative">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <Hibiscus className="absolute top-3 right-3 w-9 h-9" petal={i % 2 === 0 ? PINK : '#fb7185'} />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-black mb-2" style={{ color: INK }}>{project.title}</h3>
                {project.description && (
                  <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: '#4d7c0f' }}>{project.description}</p>
                )}
                {project.techStack?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.techStack.map((tech, j) => (
                      <span key={j} className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${j % 3 === 0 ? 'bg-green-100 text-green-700' : j % 3 === 1 ? 'bg-pink-100 text-pink-600' : 'bg-yellow-100 text-yellow-700'}`}>
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-4">
                  {project.liveUrl && project.liveUrl !== '#' && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-pink-600 hover:text-pink-500 transition-colors">
                      <ExternalLink size={14} /> Visit
                    </a>
                  )}
                  {project.githubUrl && project.githubUrl !== '#' && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-green-700 hover:text-green-600 transition-colors">
                      <Github size={14} /> Code
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// Experience — voyage log
const VoyageLog = ({ data }) => (
  <section id="experience" className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(180deg,#fef9c3,#fef3c7)' }}>
    <PalmFrond className="absolute -right-12 top-10 w-56 opacity-15 rotate-[160deg]" />
    <div className="max-w-4xl mx-auto px-6 relative z-10">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <motion.div variants={fadeUp} className="text-center mb-14">
          <p className="text-green-700 font-bold text-xs uppercase mb-3 inline-flex items-center gap-2" style={{ letterSpacing: '0.25em' }}>
            <Palmtree size={15} /> Voyage log
          </p>
          <h2 className="text-4xl font-black" style={{ color: INK }}>The Journey So Far</h2>
        </motion.div>
        <div className="relative pl-10 border-l-4 border-dashed space-y-10" style={{ borderColor: '#86efac' }}>
          {data.experience.map((exp, i) => (
            <motion.div key={i} variants={fadeUp} className="relative">
              <div className="absolute -left-[52px] top-0 w-9 h-9 rounded-full flex items-center justify-center shadow-md border-4"
                style={{ background: i % 2 === 0 ? PINK : '#f59e0b', borderColor: '#fef9c3' }}>
                <Star size={14} className="text-white" fill="#fff" />
              </div>
              {exp.period && (
                <span className="inline-block text-[10px] font-black uppercase px-3 py-1 rounded-full mb-2 bg-white text-green-700 shadow-sm" style={{ letterSpacing: '0.16em' }}>
                  {exp.period}
                </span>
              )}
              <h3 className="text-xl font-black" style={{ color: INK }}>{exp.role}</h3>
              {exp.company && <p className="text-sm font-bold text-pink-600 mb-2">{exp.company}</p>}
              {exp.description && <p className="text-sm leading-relaxed" style={{ color: '#52525b' }}>{exp.description}</p>}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// Testimonials — messages in bottles
const Bottles = ({ data }) => (
  <section id="testimonials" className="relative py-24 overflow-hidden" style={{ background: '#fffbeb' }}>
    <MonsteraLeaf className="absolute -right-14 top-24 w-48 opacity-10 rotate-[150deg]" />
    <div className="max-w-6xl mx-auto px-6 relative z-10">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <motion.div variants={fadeUp} className="text-center mb-14">
          <p className="text-teal-600 font-bold text-xs uppercase mb-3 inline-flex items-center gap-2" style={{ letterSpacing: '0.25em' }}>
            <Waves size={15} /> Messages in bottles
          </p>
          <h2 className="text-4xl font-black" style={{ color: INK }}>Words That Washed Ashore</h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {data.testimonials.map((t, i) => (
            <motion.figure key={i} variants={fadeUp}
              className="p-7 rounded-3xl shadow-md border-2 hover:shadow-xl hover:-translate-y-1.5 transition-all"
              style={{
                background: i % 2 === 0 ? 'linear-gradient(160deg,#fff,#fef9e7)' : 'linear-gradient(160deg,#fff,#fdf2f8)',
                borderColor: i % 2 === 0 ? '#fde68a' : '#fbcfe8',
                transform: `rotate(${i % 2 === 0 ? 0.8 : -0.8}deg)`
              }}>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => <Star key={j} size={14} className="text-yellow-500" fill={YELLOW} />)}
              </div>
              <blockquote className="text-sm leading-relaxed italic mb-5" style={{ color: '#3f6212' }}>
                &ldquo;{t.text}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3">
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover border-2 border-yellow-200" />
                ) : (
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-xs font-black text-white"
                    style={{ background: i % 2 === 0 ? 'linear-gradient(145deg,#4ade80,#15803d)' : 'linear-gradient(145deg,#f9a8d4,#ec4899)' }}>
                    {initialsOf(t.name)}
                  </div>
                )}
                <div>
                  <div className="font-black text-sm" style={{ color: INK }}>{t.name}</div>
                  {t.role && <div className="text-xs text-teal-700 font-semibold">{t.role}</div>}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// Contact — sunset send-off
const SunsetSend = ({ data }) => (
  <section id="contact" className="relative py-24 overflow-hidden"
    style={{ background: 'linear-gradient(180deg,#fb923c 0%,#f472b6 45%,#c026d3 100%)' }}>
    <div className="absolute left-1/2 -translate-x-1/2 top-10 w-40 h-40 rounded-full pointer-events-none"
      style={{ background: 'radial-gradient(circle,#fef3c7 55%,rgba(254,243,199,0.3) 75%,transparent 78%)', boxShadow: '0 0 90px rgba(253,224,71,0.8)' }} />
    <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
        <motion.div variants={fadeUp}>
          <Flower2 size={26} className="mx-auto mb-5 text-white" />
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4" style={{ textShadow: '0 2px 14px rgba(0,0,0,0.25)' }}>
            Aloha! Let's Talk
          </h2>
          <p className="text-sm md:text-base mb-10 text-white/90">
            Send a message in a bottle — replies arrive on the next tide.
          </p>
        </motion.div>
        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4 mb-14">
          {data.socials?.email && (
            <a href={`mailto:${data.socials.email}`}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-black text-pink-600 bg-white shadow-xl transition-transform hover:-translate-y-1">
              <Mail size={18} /> Send a Postcard
            </a>
          )}
          {['github', 'linkedin', 'twitter'].map(key => {
            const url = data.socials?.[key];
            if (!url) return null;
            const Icon = key === 'github' ? Github : key === 'linkedin' ? Linkedin : Twitter;
            return (
              <a key={key} href={url} target="_blank" rel="noreferrer" aria-label={key}
                className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/25 border-2 border-white/60 text-white backdrop-blur-sm hover:bg-white/40 transition-colors">
                <Icon size={18} />
              </a>
            );
          })}
        </motion.div>
        <motion.p variants={fadeUp} className="text-[11px] font-bold uppercase text-white/75" style={{ letterSpacing: '0.22em' }}>
          &copy; {new Date().getFullYear()} {data.personal?.name || 'The Islander'} &middot; Tropical Paradise
        </motion.p>
      </motion.div>
    </div>
    <PalmSilhouette className="absolute bottom-0 left-[4%] w-20 md:w-28" color="#701a75" />
    <PalmSilhouette className="absolute bottom-0 right-[6%] w-16 md:w-24 -scale-x-100" color="#86198f" />
  </section>
);

// Main component
export default function TropicalParadise() {
  const { portfolioData: data } = usePortfolio();

  const navItems = [
    { label: 'Island Life', href: '#about', show: Boolean(data.personal?.bio || data.personal?.avatar) },
    { label: 'Beach Bag', href: '#skills', show: data.skills?.length > 0 },
    { label: 'Expeditions', href: '#projects', show: data.projects?.length > 0 },
    { label: 'Voyage Log', href: '#experience', show: data.experience?.length > 0 },
    { label: 'Bottles', href: '#testimonials', show: data.testimonials?.length > 0 },
    { label: 'Aloha', href: '#contact', show: true },
  ].filter(item => item.show);

  return (
    <div className="font-sans antialiased overflow-x-hidden" style={{ background: '#fffbeb' }}>
      <nav className="fixed top-3 left-1/2 -translate-x-1/2 z-40 flex gap-1 md:gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border-2 border-green-200 shadow-lg max-w-[94vw] overflow-x-auto">
        {navItems.map(item => (
          <a key={item.href} href={item.href}
            className="whitespace-nowrap text-xs font-bold px-3 py-1.5 rounded-full transition-colors hover:bg-pink-500 hover:text-white"
            style={{ color: INK }}>
            {item.label}
          </a>
        ))}
      </nav>

      <Hero data={data} />
      {(data.personal?.bio || data.personal?.avatar) && <IslandLife data={data} />}
      {data.skills?.length > 0 && <BeachBag data={data} />}
      {data.projects?.length > 0 && <Expeditions data={data} />}
      {data.experience?.length > 0 && <VoyageLog data={data} />}
      {data.testimonials?.length > 0 && <Bottles data={data} />}
      <SunsetSend data={data} />
    </div>
  );
}
