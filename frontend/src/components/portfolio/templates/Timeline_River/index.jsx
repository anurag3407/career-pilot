import { usePortfolio } from "../../../../context/PortfolioContext";
import React from 'react';
import { motion } from 'framer-motion';
import {
  Waves, Droplets, Mail, Github, Linkedin, Twitter, ExternalLink,
  MapPin, Star, ChevronDown, Quote
} from 'lucide-react';

/**
 * Timeline River Portfolio Template
 * Category: Scroll-Triggered
 * Description: A winding river/path SVG timeline. Scroll follows the river. Experience milestones are placed along the riverbanks. Animated SVG path drawing.
 */

const INK = '#163a36';
const SAND = '#f4efe3';
const GOLD = '#d9a441';

const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } }
};

const initialsOf = (name) => {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  return (parts.slice(0, 2).map(w => w[0].toUpperCase()).join('')) || 'R';
};

// Build a smooth winding river path through alternating bend points
const buildRiverPath = (count, vbW, xA, xB, slotH) => {
  if (count <= 0) return '';
  const pts = [];
  for (let i = 0; i < count; i++) {
    pts.push({ x: i % 2 === 0 ? xA : xB, y: i * slotH + slotH / 2 });
  }
  let d = `M ${pts[0].x} 0 L ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const p = pts[i];
    const midY = (prev.y + p.y) / 2;
    d += ` C ${prev.x} ${midY}, ${p.x} ${midY}, ${p.x} ${p.y}`;
  }
  d += ` L ${pts[pts.length - 1].x} ${count * slotH}`;
  return d;
};

// The river itself: banks, water, shimmer and milestone stones
const RiverSVG = ({ count, slotH, vbW, xA, xB, gradientId, bank, water }) => {
  const d = buildRiverPath(count, vbW, xA, xB, slotH);
  if (!d) return null;
  const pts = [];
  for (let i = 0; i < count; i++) pts.push({ x: i % 2 === 0 ? xA : xB, y: i * slotH + slotH / 2 });
  return (
    <svg width="100%" height={count * slotH} viewBox={`0 0 ${vbW} ${count * slotH}`}
      preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="block">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2={vbW} y2={count * slotH} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0891b2" />
          <stop offset="50%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#155e75" />
        </linearGradient>
      </defs>
      {/* sandy banks */}
      <motion.path d={d} fill="none" stroke={bank} strokeWidth={46} strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        transition={{ duration: 2.6, ease: 'easeInOut' }} viewport={{ once: true, amount: 0.05 }} />
      {/* water */}
      <motion.path d={d} fill="none" stroke={`url(#${gradientId})`} strokeWidth={water} strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        transition={{ duration: 2.6, ease: 'easeInOut' }} viewport={{ once: true, amount: 0.05 }} />
      {/* flowing shimmer */}
      <motion.path d={d} fill="none" stroke="#a5f3fc" strokeWidth={6} strokeLinecap="round"
        strokeDasharray="3 22" opacity={0.85}
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
        transition={{ duration: 2.6, ease: 'easeInOut' }} viewport={{ once: true, amount: 0.05 }}
        style={{ animation: 'riverFlow 1.8s linear infinite' }} />
      {/* milestone stones on the bends */}
      {pts.map((p, i) => (
        <motion.circle key={i} cx={p.x} cy={p.y} r={11} fill={GOLD} stroke="#ffffff" strokeWidth={3.5}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + i * 0.35, duration: 0.4, type: 'spring', stiffness: 260 }}
          viewport={{ once: true, amount: 0.05 }}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
      ))}
    </svg>
  );
};

// Small winding stream for the hero
const SourceStream = () => (
  <svg viewBox="0 0 1440 260" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-48 md:h-64">
    <path d="M0,260 L0,200 C240,150 380,230 620,190 C860,150 1040,220 1240,180 C1340,160 1400,180 1440,170 L1440,260 Z" fill="#dce9d2" />
    <path d="M640,260 C660,220 600,200 680,170 C760,140 700,120 720,96" fill="none" stroke="#0d9488" strokeWidth="18" strokeLinecap="round" opacity="0.9" />
    <path d="M640,260 C660,220 600,200 680,170 C760,140 700,120 720,96" fill="none" stroke="#7dd3fc" strokeWidth="6" strokeLinecap="round" strokeDasharray="4 18" opacity="0.9" />
  </svg>
);

// Hero — the spring where the journey begins
const Hero = ({ data }) => (
  <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden px-6"
    style={{ background: 'linear-gradient(180deg,#eef7ef 0%,#d8ecdd 55%,#c8e2cf 100%)' }}>
    <div className="absolute rounded-full" style={{
      width: 130, height: 130, right: '12%', top: '14%',
      background: 'radial-gradient(circle, #fde68a 55%, rgba(253,230,138,0.25) 72%, transparent 75%)',
      boxShadow: '0 0 80px rgba(250,204,21,0.55)'
    }} />
    {[...Array(4)].map((_, i) => (
      <div key={i} className="absolute rounded-full" style={{
        width: 260 + i * 120, height: 60 + i * 22,
        left: `${8 + ((i * 37) % 60)}%`, top: `${18 + i * 11}%`,
        background: 'rgba(255,255,255,0.5)', filter: 'blur(14px)'
      }} />
    ))}
    <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 text-center max-w-3xl">
      <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 border border-teal-700/25 text-teal-800 text-xs font-semibold uppercase mb-6" style={{ letterSpacing: '0.2em' }}>
        <Waves size={14} /> From source to sea
      </motion.div>
      <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold mb-4" style={{ color: INK }}>
        {data.personal?.name || 'My Portfolio'}
      </motion.h1>
      {data.personal?.title && (
        <motion.p variants={fadeUp} className="text-xl md:text-2xl font-medium text-teal-700 mb-3">
          {data.personal.title}
        </motion.p>
      )}
      {data.personal?.tagline && (
        <motion.p variants={fadeUp} className="text-sm md:text-base mb-4 max-w-xl mx-auto" style={{ color: '#3f5c55' }}>
          {data.personal.tagline}
        </motion.p>
      )}
      {data.personal?.location && (
        <motion.p variants={fadeUp} className="inline-flex items-center gap-1.5 text-sm mb-9 text-teal-800/80">
          <MapPin size={15} /> {data.personal.location}
        </motion.p>
      )}
      <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
        <a href="#about" className="px-7 py-3 rounded-full font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(90deg,#0f766e,#0e7490)' }}>
          Follow the River
        </a>
        <a href="#projects" className="px-7 py-3 rounded-full font-semibold border-2 transition-colors hover:bg-teal-800/10"
          style={{ borderColor: 'rgba(15,118,110,0.55)', color: '#0f766e' }}>
          The Crossings
        </a>
        <a href="#contact" className="px-7 py-3 rounded-full font-semibold border-2 transition-colors hover:bg-teal-800/10"
          style={{ borderColor: INK, color: INK }}>
          Reach the Sea
        </a>
      </motion.div>
    </motion.div>
    <SourceStream />
    <motion.div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 text-teal-800/60"
      animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
      <ChevronDown size={26} />
    </motion.div>
  </section>
);

// About — The Headwaters
const Headwaters = ({ data }) => (
  <section id="about" className="py-24" style={{ background: SAND }}>
    <div className="max-w-5xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}
        className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div variants={fadeUp} className="flex justify-center">
          {data.personal?.avatar ? (
            <img src={data.personal.avatar} alt={data.personal.name} className="w-64 h-64 rounded-[2.5rem] object-cover shadow-xl border-4 border-white" />
          ) : (
            <div className="w-64 h-64 rounded-[2.5rem] flex flex-col items-center justify-center shadow-xl border-4 border-white"
              style={{ background: 'linear-gradient(145deg,#5eead4,#0f766e)' }}>
              <Droplets size={30} className="text-teal-50 mb-3" />
              <span className="text-5xl font-bold text-white tracking-widest">{initialsOf(data.personal?.name)}</span>
            </div>
          )}
        </motion.div>
        <motion.div variants={fadeUp}>
          <p className="text-teal-700 font-semibold text-xs uppercase mb-3 flex items-center gap-2" style={{ letterSpacing: '0.25em' }}>
            <Droplets size={14} /> The Headwaters
          </p>
          <h2 className="text-4xl font-bold mb-4" style={{ color: INK }}>Where it all begins</h2>
          <p className="leading-relaxed mb-8" style={{ color: '#3f5c55' }}>
            {data.personal?.bio || 'Every great river starts as a trickle. This is where the story gathers speed.'}
          </p>
          {(data.stats?.yearsExperience || data.stats?.projectsCompleted || data.stats?.happyClients) && (
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Years flowing', value: data.stats.yearsExperience },
                { label: 'Works shipped', value: data.stats.projectsCompleted },
                { label: 'Happy travelers', value: data.stats.happyClients },
              ].filter(s => s.value !== undefined && s.value !== null && s.value !== '').map((s, i) => (
                <div key={i} className="rounded-2xl bg-white/80 border border-teal-700/15 text-center p-4 shadow-sm">
                  <div className="text-2xl font-bold text-teal-700">{s.value}</div>
                  <div className="text-[10px] uppercase mt-1" style={{ letterSpacing: '0.14em', color: '#6b8478' }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// Skills — Tributaries feeding the main stream
const Tributaries = ({ data }) => {
  const categories = [...new Set(data.skills.map(s => s.category || 'Core'))];
  return (
    <section id="skills" className="py-24" style={{ background: 'linear-gradient(180deg,#eef4e6,#e6e9d8)' }}>
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-12">
            <p className="text-teal-700 font-semibold text-xs uppercase mb-3 flex items-center justify-center gap-2" style={{ letterSpacing: '0.25em' }}>
              <Waves size={14} /> Tributaries
            </p>
            <h2 className="text-4xl font-bold" style={{ color: INK }}>Streams that feed the river</h2>
          </motion.div>
          {categories.map(cat => (
            <motion.div key={cat} variants={fadeUp} className="mb-10">
              <h3 className="text-xs font-bold uppercase text-teal-800 mb-5 flex items-center gap-2" style={{ letterSpacing: '0.22em' }}>
                <span className="w-8 h-0.5 rounded-full bg-teal-600 inline-block" /> {cat}
              </h3>
              <div className="grid md:grid-cols-2 gap-x-10 gap-y-5">
                {data.skills.filter(s => (s.category || 'Core') === cat).map((skill, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold" style={{ color: INK }}>{skill.name}</span>
                      <span className="text-sm font-bold text-teal-700">{skill.level}%</span>
                    </div>
                    <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(15,118,110,0.14)' }}>
                      <motion.div className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg,#0d9488,#22d3ee)' }}
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

// Experience — the winding river with milestones on its banks
const RiverTimeline = ({ data }) => {
  const items = data.experience;
  const desktopSlot = 320;
  const mobileSlot = 340;
  const pts = items.map((_, i) => ({ y: i * desktopSlot + desktopSlot / 2, x: i % 2 === 0 ? 260 : 740 }));
  return (
    <section id="experience" className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#f4efe3 0%,#ece5d2 100%)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-6">
            <p className="text-teal-700 font-semibold text-xs uppercase mb-3 flex items-center justify-center gap-2" style={{ letterSpacing: '0.25em' }}>
              <Droplets size={14} /> Milestones along the banks
            </p>
            <h2 className="text-4xl font-bold" style={{ color: INK }}>The River</h2>
            <p className="mt-3 text-sm max-w-xl mx-auto" style={{ color: '#5c7369' }}>
              Scroll to follow the current. Each stone marks a bend in the journey.
            </p>
          </motion.div>

          <div className="relative">
            {/* winding river behind the milestones */}
            <div className="absolute inset-y-0 left-0 w-14 md:hidden overflow-hidden pointer-events-none">
              <RiverSVG count={items.length} slotH={mobileSlot} vbW={100} xA={30} xB={70}
                gradientId="waterMobile" bank="#e3d9bd" water={26} />
            </div>
            <div className="absolute inset-0 hidden md:block overflow-hidden pointer-events-none">
              <RiverSVG count={items.length} slotH={desktopSlot} vbW={1000} xA={260} xB={740}
                gradientId="waterDesktop" bank="#e3d9bd" water={30} />
              {/* golden connector dashes from bend to bank */}
              {pts.map((p, i) => {
                const left = i % 2 === 0;
                const x1 = left ? 280 : 720;
                const x2 = left ? 445 : 555;
                return (
                  <svg key={i} className="absolute" style={{ left: `${Math.min(x1, x2) / 10}%`, top: p.y - 12, width: `${Math.abs(x2 - x1) / 10}%`, height: 24, overflow: 'visible' }}>
                    <line x1="0" y1="12" x2="100%" y2="12" stroke={GOLD} strokeWidth="2.5" strokeDasharray="5 7" strokeLinecap="round" />
                  </svg>
                );
              })}
            </div>

            {/* milestone cards alternating along the banks */}
            <div className="relative">
              {items.map((exp, i) => {
                const left = i % 2 === 0;
                return (
                  <div key={i} className="flex items-center h-[340px] md:h-[320px]">
                    <motion.div variants={fadeUp}
                      className={`bg-white/95 border border-teal-700/15 rounded-2xl shadow-lg p-6 w-full ml-16 mr-2 z-10 md:mr-0 md:w-[43%] ${left ? 'md:ml-[3%]' : 'md:ml-auto md:mr-[3%]'}`}
                      style={{ borderTop: '4px solid #0d9488' }}>
                      {exp.period && (
                        <span className="text-[10px] font-bold uppercase inline-block px-3 py-1 rounded-full mb-3 bg-teal-50 text-teal-800" style={{ letterSpacing: '0.18em' }}>
                          {exp.period}
                        </span>
                      )}
                      <h3 className="text-lg font-bold" style={{ color: INK }}>{exp.role}</h3>
                      {exp.company && <p className="text-sm font-semibold text-teal-700 mb-2">{exp.company}</p>}
                      {exp.description && (
                        <p className="text-sm leading-relaxed line-clamp-3" style={{ color: '#5c7369' }}>{exp.description}</p>
                      )}
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Projects — crossings along the way
const Crossings = ({ data }) => (
  <section id="projects" className="py-24" style={{ background: 'linear-gradient(180deg,#e6e9d8,#e2e7d2)' }}>
    <div className="max-w-6xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <motion.div variants={fadeUp} className="text-center mb-12">
          <p className="text-teal-700 font-semibold text-xs uppercase mb-3 flex items-center justify-center gap-2" style={{ letterSpacing: '0.25em' }}>
            <Star size={14} /> Crossings
          </p>
          <h2 className="text-4xl font-bold" style={{ color: INK }}>Bridges I have built</h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {data.projects.map((project, i) => (
            <motion.div key={i} variants={fadeUp}
              className="bg-white/90 border border-teal-700/15 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all group">
              {project.image && (
                <div className="h-44 overflow-hidden relative">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <svg viewBox="0 0 400 24" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-5">
                    <path d="M0,24 L0,12 Q50,2 100,12 T200,12 T300,12 T400,12 L400,24 Z" fill="#ffffff" opacity="0.9" />
                  </svg>
                </div>
              )}
              <div className="p-5">
                <h3 className="text-lg font-bold mb-2" style={{ color: INK }}>{project.title}</h3>
                {project.description && (
                  <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: '#5c7369' }}>{project.description}</p>
                )}
                {project.techStack?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.map((tech, j) => (
                      <span key={j} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-700/10 text-teal-800 border border-teal-700/20">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-4">
                  {project.liveUrl && project.liveUrl !== '#' && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-600 transition-colors">
                      <ExternalLink size={14} /> Sail over
                    </a>
                  )}
                  {project.githubUrl && project.githubUrl !== '#' && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold hover:opacity-80 transition-opacity" style={{ color: '#5c7369' }}>
                      <Github size={14} /> Source
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

// Testimonials — voices from the banks (river stones)
const RiverVoices = ({ data }) => (
  <section id="testimonials" className="py-24" style={{ background: SAND }}>
    <div className="max-w-6xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <motion.div variants={fadeUp} className="text-center mb-12">
          <p className="text-teal-700 font-semibold text-xs uppercase mb-3 flex items-center justify-center gap-2" style={{ letterSpacing: '0.25em' }}>
            <Quote size={14} /> Voices on the bank
          </p>
          <h2 className="text-4xl font-bold" style={{ color: INK }}>Stories from fellow travelers</h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {data.testimonials.map((t, i) => (
            <motion.figure key={i} variants={fadeUp}
              className="p-7 border border-teal-700/12 shadow-sm hover:shadow-md transition-shadow"
              style={{ background: '#e9e3cf', borderRadius: '1.9rem 0.5rem 1.9rem 0.5rem' }}>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => <Star key={j} size={13} className="text-amber-500" fill="#f59e0b" />)}
              </div>
              <blockquote className="text-sm leading-relaxed italic mb-5" style={{ color: '#2f4a42' }}>
                &ldquo;{t.text}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3">
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow" />
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(145deg,#14b8a6,#0f766e)' }}>
                    {initialsOf(t.name)}
                  </div>
                )}
                <div>
                  <div className="font-semibold text-sm" style={{ color: INK }}>{t.name}</div>
                  {t.role && <div className="text-xs text-teal-700">{t.role}</div>}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// Contact — where the river meets the sea
const MeetTheSea = ({ data }) => (
  <section id="contact" className="relative py-24 overflow-hidden"
    style={{ background: 'linear-gradient(180deg,#0b3a45 0%,#073042 55%,#04202c 100%)' }}>
    {/* moonlit water sheen */}
    <div className="absolute left-1/2 -translate-x-1/2 top-24 w-[420px] max-w-[80vw] h-64 pointer-events-none"
      style={{ background: 'radial-gradient(ellipse at center, rgba(125,211,252,0.18), transparent 65%)' }} />
    <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
        <motion.div variants={fadeUp}>
          <Waves size={26} className="mx-auto mb-5 text-cyan-300" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Where the river meets the sea</h2>
          <p className="text-sm md:text-base mb-10 text-cyan-100/80">
            The current has carried us this far. Send a message and let it carry us further.
          </p>
        </motion.div>
        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4 mb-14">
          {data.socials?.email && (
            <a href={`mailto:${data.socials.email}`}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold shadow-lg transition-transform hover:-translate-y-0.5"
              style={{ background: `linear-gradient(90deg,#d9a441,#e3b45c)`, color: '#1d2a26' }}>
              <Mail size={18} /> Send a Message
            </a>
          )}
          {['github', 'linkedin', 'twitter'].map(key => {
            const url = data.socials?.[key];
            if (!url) return null;
            const Icon = key === 'github' ? Github : key === 'linkedin' ? Linkedin : Twitter;
            return (
              <a key={key} href={url} target="_blank" rel="noreferrer" aria-label={key}
                className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-cyan-300/35 text-cyan-100 hover:bg-cyan-300/15 transition-colors">
                <Icon size={18} />
              </a>
            );
          })}
        </motion.div>
        <motion.p variants={fadeUp} className="text-[11px] uppercase text-cyan-100/40" style={{ letterSpacing: '0.22em' }}>
          &copy; {new Date().getFullYear()} {data.personal?.name || 'The River Keeper'} &middot; Timeline River
        </motion.p>
      </motion.div>
    </div>
  </section>
);

// Main component
export default function TimelineRiver() {
  const { portfolioData: data } = usePortfolio();

  const navItems = [
    { label: 'Headwaters', href: '#about', show: Boolean(data.personal?.bio || data.personal?.avatar) },
    { label: 'Tributaries', href: '#skills', show: data.skills?.length > 0 },
    { label: 'The River', href: '#experience', show: data.experience?.length > 0 },
    { label: 'Crossings', href: '#projects', show: data.projects?.length > 0 },
    { label: 'Voices', href: '#testimonials', show: data.testimonials?.length > 0 },
    { label: 'The Sea', href: '#contact', show: true },
  ].filter(item => item.show);

  return (
    <div className="font-sans antialiased overflow-x-hidden" style={{ background: SAND }}>
      <style>{`@keyframes riverFlow { to { stroke-dashoffset: -50; } }`}</style>

      <nav className="fixed top-3 left-1/2 -translate-x-1/2 z-40 flex gap-1 md:gap-2 px-4 py-2 rounded-full border shadow-lg backdrop-blur-md max-w-[94vw] overflow-x-auto"
        style={{ background: 'rgba(244,239,227,0.92)', borderColor: 'rgba(15,118,110,0.3)' }}>
        {navItems.map(item => (
          <a key={item.href} href={item.href}
            className="whitespace-nowrap text-xs font-semibold px-3 py-1.5 rounded-full transition-colors hover:bg-teal-800 hover:text-white"
            style={{ color: INK }}>
            {item.label}
          </a>
        ))}
      </nav>

      <Hero data={data} />
      {(data.personal?.bio || data.personal?.avatar) && <Headwaters data={data} />}
      {data.skills?.length > 0 && <Tributaries data={data} />}
      {data.experience?.length > 0 && <RiverTimeline data={data} />}
      {data.projects?.length > 0 && <Crossings data={data} />}
      {data.testimonials?.length > 0 && <RiverVoices data={data} />}
      <MeetTheSea data={data} />
    </div>
  );
}
