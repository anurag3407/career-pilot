import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Play, Pause, Disc3, Radio, Music2, Star, Mail, Github, Linkedin,
  Twitter, ExternalLink, MapPin, Quote, Repeat
} from 'lucide-react';

/**
 * Vinyl Record Portfolio Template
 * Category: Unique / Creative
 * Description: Spinning vinyl record hero animation. Projects listed as album tracks on a record sleeve. Music player-style section navigation with play/pause.
 */

const CREAM = '#f7f1e3';
const WALNUT = '#4a3226';
const DEEP = '#2b1d15';
const AMBER = '#d97706';
const INK = '#2f2318';

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
  return (parts.slice(0, 2).map(w => w[0].toUpperCase()).join('')) || 'LP';
};

// Vinyl surface: grooves via repeating radial gradient + light sheen
const vinylSurface = {
  background: [
    'radial-gradient(circle at 32% 30%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.03) 26%, transparent 42%)',
    'repeating-radial-gradient(circle at center, #191410 0px, #191410 2.5px, #2b221a 3.2px, #191410 3.8px)',
  ].join(','),
};

// The spinning record on a turntable platter, tonearm included
const Turntable = ({ spinning, initials }) => (
  <div className="relative mx-auto" style={{ width: 'min(78vw, 24rem)', height: 'min(78vw, 24rem)' }}>
    {/* platter */}
    <div className="absolute inset-0 rounded-full shadow-2xl"
      style={{ background: 'radial-gradient(circle at 40% 35%, #5d4037, #3e2b20 70%, #2b1d15)', boxShadow: '0 24px 60px rgba(43,29,21,0.5), inset 0 0 0 10px rgba(247,241,227,0.08)' }} />
    {/* vinyl */}
    <div className="absolute rounded-full"
      style={{
        inset: '7%', ...vinylSurface,
        animation: 'spin360 8s linear infinite',
        animationPlayState: spinning ? 'running' : 'paused',
        boxShadow: '0 0 0 2px rgba(247,241,227,0.06), 0 10px 30px rgba(0,0,0,0.45)'
      }}>
      {/* label */}
      <div className="absolute rounded-full flex flex-col items-center justify-center text-center"
        style={{ inset: '36%', background: `radial-gradient(circle at 35% 35%, #f0b45c, ${AMBER} 75%)`, boxShadow: 'inset 0 0 0 2px rgba(43,29,21,0.25)' }}>
        <span className="font-black text-lg tracking-widest" style={{ color: DEEP }}>{initials}</span>
        <span className="text-[8px] font-bold uppercase mt-0.5" style={{ color: DEEP, letterSpacing: '0.14em' }}>33&frac13; RPM</span>
      </div>
      {/* spindle */}
      <div className="absolute rounded-full" style={{ inset: '49.2%', background: CREAM }} />
    </div>
    {/* tonearm */}
    <div className="absolute origin-top-right transition-transform duration-700 ease-in-out"
      style={{ right: '-4%', top: '6%', transform: `rotate(${spinning ? 34 : 6}deg)` }}>
      <div className="w-4 h-4 rounded-full" style={{ background: 'linear-gradient(145deg,#e8d9bd,#b0987c)' }} />
      <div className="w-1.5 h-36 md:h-44 rounded-full mx-auto" style={{ background: 'linear-gradient(180deg,#cbbba0,#8a755c)' }} />
      <div className="w-6 h-12 rounded-md mx-auto" style={{ background: DEEP, transform: 'translateX(6px)' }} />
    </div>
  </div>
);

// Hero — Now Spinning
const Hero = ({ data, spinning, onToggle }) => (
  <section id="hero" className="relative min-h-screen flex items-center overflow-hidden"
    style={{ background: 'linear-gradient(180deg, #f7f1e3 0%, #f0e4cd 100%)' }}>
    {/* walnut side rails */}
    <div className="absolute inset-y-0 left-0 w-2 md:w-4" style={{ background: WALNUT }} />
    <div className="absolute inset-y-0 right-0 w-2 md:w-4" style={{ background: WALNUT }} />
    {/* warm glow */}
    <div className="absolute -top-24 right-0 w-[520px] h-[520px] rounded-full pointer-events-none"
      style={{ background: 'radial-gradient(circle, rgba(217,119,6,0.14), transparent 65%)' }} />

    <div className="max-w-6xl mx-auto px-8 md:px-14 py-24 grid md:grid-cols-2 gap-14 items-center relative z-10 w-full">
      <motion.div initial="hidden" animate="visible" variants={stagger}>
        <motion.p variants={fadeUp} className="inline-flex items-center gap-2 text-xs font-bold uppercase px-4 py-1.5 rounded-full mb-6"
          style={{ background: DEEP, color: '#f0b45c', letterSpacing: '0.25em' }}>
          <Disc3 size={14} /> Now Spinning
        </motion.p>
        <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-black leading-tight mb-4" style={{ color: INK }}>
          {data.personal?.name || 'My Portfolio'}
        </motion.h1>
        {data.personal?.title && (
          <motion.p variants={fadeUp} className="text-xl md:text-2xl font-bold mb-3" style={{ color: AMBER }}>
            {data.personal.title}
          </motion.p>
        )}
        {data.personal?.tagline && (
          <motion.p variants={fadeUp} className="text-sm md:text-base mb-4 max-w-md leading-relaxed" style={{ color: '#6b5233' }}>
            {data.personal.tagline}
          </motion.p>
        )}
        {data.personal?.location && (
          <motion.p variants={fadeUp} className="inline-flex items-center gap-1.5 text-sm mb-9" style={{ color: '#8a6d3b' }}>
            <MapPin size={15} /> {data.personal.location}
          </motion.p>
        )}
        <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
          <a href="#about" className="px-7 py-3 rounded-full font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5"
            style={{ background: WALNUT }}>
            Play the Album
          </a>
          <a href="#projects" className="px-7 py-3 rounded-full font-bold border-2 transition-colors hover:bg-amber-500/10"
            style={{ borderColor: WALNUT, color: WALNUT }}>
            Track List
          </a>
          <a href="#contact" className="px-7 py-3 rounded-full font-bold border-2 transition-colors hover:bg-amber-500/10"
            style={{ borderColor: AMBER, color: AMBER }}>
            Request Line
          </a>
        </motion.div>
        {/* transport controls */}
        <motion.button variants={fadeUp} onClick={onToggle} type="button"
          className="mt-10 inline-flex items-center gap-3 px-5 py-2.5 rounded-full border-2 transition-colors"
          style={{ borderColor: AMBER, color: AMBER, background: spinning ? 'rgba(217,119,6,0.1)' : 'transparent' }}>
          {spinning ? <Pause size={16} /> : <Play size={16} />}
          <span className="text-xs font-bold uppercase" style={{ letterSpacing: '0.18em' }}>
            {spinning ? 'Pause the record' : 'Play the record'}
          </span>
          <span className={`w-2.5 h-2.5 rounded-full ${spinning ? 'animate-pulse' : ''}`} style={{ background: spinning ? '#22c55e' : '#a8a29e' }} />
        </motion.button>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
        <Turntable spinning={spinning} initials={initialsOf(data.personal?.name)} />
      </motion.div>
    </div>
  </section>
);

// About — Liner Notes
const LinerNotes = ({ data }) => (
  <section id="about" className="py-24" style={{ background: '#f3ead6' }}>
    <div className="max-w-5xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}
        className="grid md:grid-cols-[auto_1fr] gap-12 items-center">
        <motion.div variants={fadeUp} className="flex justify-center">
          {data.personal?.avatar ? (
            <img src={data.personal.avatar} alt={data.personal.name}
              className="w-60 h-60 rounded-full object-cover shadow-xl"
              style={{ border: '8px solid #fff', boxShadow: '0 0 0 2px rgba(74,50,38,0.25), 0 18px 40px rgba(43,29,21,0.25)' }} />
          ) : (
            <div className="w-60 h-60 rounded-full flex flex-col items-center justify-center shadow-xl"
              style={{ background: `radial-gradient(circle at 35% 35%, #f0b45c, ${AMBER} 75%)`, boxShadow: '0 0 0 8px #fff, 0 0 0 10px rgba(74,50,38,0.25)' }}>
              <span className="text-5xl font-black tracking-widest" style={{ color: DEEP }}>{initialsOf(data.personal?.name)}</span>
              <span className="text-[10px] font-bold uppercase mt-2" style={{ color: DEEP, letterSpacing: '0.2em' }}>First Pressing</span>
            </div>
          )}
        </motion.div>
        <motion.div variants={fadeUp}>
          <p className="text-xs font-bold uppercase mb-3 inline-flex items-center gap-2" style={{ letterSpacing: '0.25em', color: AMBER }}>
            <Quote size={14} /> Liner Notes
          </p>
          <h2 className="text-4xl font-black mb-4" style={{ color: INK }}>About the Artist</h2>
          <p className="leading-relaxed mb-8" style={{ color: '#5c4a2f' }}>
            {data.personal?.bio || 'The liner notes are still being handwritten. Check back after the next pressing.'}
          </p>
          {(data.stats?.yearsExperience || data.stats?.projectsCompleted || data.stats?.happyClients) && (
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Sessions', value: data.stats.yearsExperience },
                { label: 'Tracks cut', value: data.stats.projectsCompleted },
                { label: 'Loyal fans', value: data.stats.happyClients },
              ].filter(s => s.value !== undefined && s.value !== null && s.value !== '').map((s, i) => (
                <div key={i} className="rounded-lg px-3 py-3 text-center shadow-inner"
                  style={{ background: DEEP, boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.5)' }}>
                  <div className="font-mono text-2xl font-bold" style={{ color: '#f0b45c', textShadow: '0 0 8px rgba(240,180,92,0.5)' }}>{s.value}</div>
                  <div className="text-[9px] font-bold uppercase mt-1 text-stone-400" style={{ letterSpacing: '0.16em' }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// VU meter made of small lit blocks
const VuMeter = ({ level }) => {
  const total = 12;
  const lit = Math.max(1, Math.min(total, Math.round(((level || 0) / 100) * total)));
  return (
    <div className="flex gap-1">
      {[...Array(total)].map((_, j) => (
        <span key={j} className="w-2 h-4 rounded-[3px]"
          style={{
            background: j < lit
              ? (j >= total - 3 ? 'linear-gradient(180deg,#ef4444,#b91c1c)' : `linear-gradient(180deg,#fbbf24,${AMBER})`)
              : 'rgba(43,29,21,0.12)',
            boxShadow: j < lit ? '0 0 6px rgba(217,119,6,0.55)' : 'none'
          }} />
      ))}
    </div>
  );
};

// Skills — Side A / Side B
const TwoSides = ({ data }) => {
  const half = Math.ceil(data.skills.length / 2);
  const sides = [
    { label: 'Side A', tracks: data.skills.slice(0, half) },
    { label: 'Side B', tracks: data.skills.slice(half) },
  ].filter(s => s.tracks.length > 0);
  return (
    <section id="skills" className="py-24" style={{ background: 'linear-gradient(180deg,#efe2c8,#e9dab8)' }}>
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
          <motion.div variants={fadeUp} className="text-center mb-12">
            <p className="text-xs font-bold uppercase mb-3 inline-flex items-center gap-2" style={{ letterSpacing: '0.25em', color: AMBER }}>
              <Music2 size={15} /> The Sessions
            </p>
            <h2 className="text-4xl font-black" style={{ color: INK }}>Skills, on Both Sides</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            {sides.map((side, si) => (
              <motion.div key={side.label} variants={fadeUp} className="rounded-2xl p-6 border-2"
                style={{ background: '#fbf5e6', borderColor: 'rgba(74,50,38,0.25)', boxShadow: '0 10px 30px rgba(43,29,21,0.12)' }}>
                <div className="flex items-center justify-between mb-5 pb-3 border-b-2 border-dashed" style={{ borderColor: 'rgba(74,50,38,0.2)' }}>
                  <span className="font-black uppercase" style={{ color: WALNUT, letterSpacing: '0.2em' }}>{side.label}</span>
                  <Repeat size={15} style={{ color: AMBER }} />
                </div>
                {side.tracks.map((skill, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 py-2.5 border-b last:border-b-0"
                    style={{ borderColor: 'rgba(74,50,38,0.1)' }}>
                    <div>
                      <div className="font-bold text-sm" style={{ color: INK }}>{skill.name}</div>
                      {skill.category && <div className="text-[10px] uppercase" style={{ color: '#8a6d3b', letterSpacing: '0.14em' }}>{skill.category}</div>}
                    </div>
                    <div className="flex items-center gap-2">
                      <VuMeter level={skill.level} />
                      <span className="font-mono text-[10px] w-8 text-right" style={{ color: AMBER }}>{skill.level}%</span>
                    </div>
                  </div>
                ))}
                <div className="mt-4 text-center text-[9px] font-bold uppercase" style={{ color: '#a1887f', letterSpacing: '0.3em' }}>
                  {si === 0 ? '45 RPM · Mono' : '33 RPM · Stereo'}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Projects — the record sleeve with a track list
const Sleeve = ({ data }) => (
  <section id="projects" className="py-24" style={{ background: '#f3ead6' }}>
    <div className="max-w-4xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.08 }} variants={stagger}>
        <motion.div variants={fadeUp} className="text-center mb-12">
          <p className="text-xs font-bold uppercase mb-3 inline-flex items-center gap-2" style={{ letterSpacing: '0.25em', color: AMBER }}>
            <Disc3 size={15} /> The Studio Album
          </p>
          <h2 className="text-4xl font-black" style={{ color: INK }}>Projects as Tracks</h2>
        </motion.div>

        <motion.div variants={fadeUp} className="relative rounded-xl overflow-hidden shadow-2xl"
          style={{ background: 'linear-gradient(155deg,#e9d7b4 0%,#d8bd92 55%,#c8a878 100%)', boxShadow: '0 30px 70px rgba(43,29,21,0.35)' }}>
          {/* cardboard texture lines */}
          <div className="absolute inset-0 pointer-events-none opacity-30"
            style={{ background: 'repeating-linear-gradient(115deg, transparent 0px, transparent 26px, rgba(120,84,50,0.06) 26px, rgba(120,84,50,0.06) 28px)' }} />
          {/* sleeve header */}
          <div className="relative flex items-start justify-between p-7 md:p-9 pb-4">
            <div>
              <div className="text-[10px] font-black uppercase mb-1" style={{ color: '#8a6d3b', letterSpacing: '0.3em' }}>
                A CareerPilot Record
              </div>
              <div className="text-2xl md:text-3xl font-black" style={{ color: INK }}>
                {data.personal?.name || 'My Portfolio'}
              </div>
              {data.personal?.title && (
                <div className="text-sm font-bold italic mt-1" style={{ color: '#6b5233' }}>&ldquo;{data.personal.title}&rdquo;</div>
              )}
            </div>
            <div className="shrink-0 rounded-md px-3 py-1.5 text-white font-black text-sm shadow"
              style={{ background: WALNUT, letterSpacing: '0.2em' }}>LP</div>
          </div>
          {/* spinning record peeking through the die-cut corner */}
          <div className="absolute rounded-full"
            style={{ right: '-52px', bottom: '-52px', width: 150, height: 150, ...vinylSurface, animation: 'spin360 10s linear infinite', opacity: 0.9 }}>
            <div className="absolute rounded-full" style={{ inset: '37%', background: AMBER }} />
          </div>

          {/* track list */}
          <div className="relative px-7 md:px-9 pb-8">
            {data.projects.map((project, i) => (
              <div key={i} className="group flex items-center gap-4 py-4 border-t first:border-t-0 transition-colors hover:bg-white/40 px-2 -mx-2 rounded-lg"
                style={{ borderColor: 'rgba(74,50,38,0.18)' }}>
                <span className="font-mono font-black text-lg w-10 shrink-0" style={{ color: AMBER }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                {project.image && (
                  <img src={project.image} alt={project.title} className="w-12 h-12 rounded object-cover shadow border-2 border-white shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black truncate" style={{ color: INK }}>{project.title}</h3>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-end gap-[3px] h-3.5">
                      {[0, 1, 2, 3].map(j => (
                        <span key={j} className="w-[3px] h-full rounded-sm origin-bottom"
                          style={{ background: AMBER, animation: 'eqBar 0.9s ease-in-out infinite', animationDelay: `${j * 0.13}s` }} />
                      ))}
                    </span>
                  </div>
                  {project.description && (
                    <p className="text-xs leading-relaxed line-clamp-1" style={{ color: '#6b5233' }}>{project.description}</p>
                  )}
                  {project.techStack?.length > 0 && (
                    <div className="text-[10px] italic mt-0.5 truncate" style={{ color: '#8a6d3b' }}>
                      {project.techStack.join(' · ')}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {project.liveUrl && project.liveUrl !== '#' && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" aria-label="Play track"
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white shadow transition-transform hover:scale-110"
                      style={{ background: AMBER }}>
                      <Play size={14} fill="#fff" />
                    </a>
                  )}
                  {project.githubUrl && project.githubUrl !== '#' && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" aria-label="View source"
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                      style={{ background: WALNUT, color: CREAM }}>
                      <Github size={14} />
                    </a>
                  )}
                </div>
              </div>
            ))}
            <div className="mt-4 text-center text-[9px] font-bold uppercase" style={{ color: '#8a6d3b', letterSpacing: '0.3em' }}>
              All tracks written &amp; produced by {data.personal?.name || 'the artist'}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

// Experience — session history
const SessionHistory = ({ data }) => (
  <section id="experience" className="py-24" style={{ background: 'linear-gradient(180deg,#efe2c8,#e9dab8)' }}>
    <div className="max-w-3xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <motion.div variants={fadeUp} className="text-center mb-12">
          <p className="text-xs font-bold uppercase mb-3 inline-flex items-center gap-2" style={{ letterSpacing: '0.25em', color: AMBER }}>
            <Radio size={15} /> Session History
          </p>
          <h2 className="text-4xl font-black" style={{ color: INK }}>Experience</h2>
        </motion.div>
        <div className="space-y-5">
          {data.experience.map((exp, i) => (
            <motion.div key={i} variants={fadeUp} className="flex gap-5 rounded-2xl p-6 border-2 hover:-translate-y-0.5 transition-transform"
              style={{ background: '#fbf5e6', borderColor: 'rgba(74,50,38,0.2)', boxShadow: '0 8px 24px rgba(43,29,21,0.1)' }}>
              <div className="shrink-0 font-mono text-xs font-bold px-3 py-1.5 rounded-full self-start"
                style={{ background: DEEP, color: '#f0b45c' }}>
                {exp.period || '—'}
              </div>
              <div>
                <h3 className="font-black" style={{ color: INK }}>{exp.role}</h3>
                {exp.company && <p className="text-sm font-bold mb-1.5" style={{ color: AMBER }}>{exp.company}</p>}
                {exp.description && <p className="text-sm leading-relaxed" style={{ color: '#5c4a2f' }}>{exp.description}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// Testimonials — critic reviews
const CriticReviews = ({ data }) => (
  <section id="testimonials" className="py-24" style={{ background: '#f3ead6' }}>
    <div className="max-w-6xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <motion.div variants={fadeUp} className="text-center mb-12">
          <p className="text-xs font-bold uppercase mb-3 inline-flex items-center gap-2" style={{ letterSpacing: '0.25em', color: AMBER }}>
            <Star size={15} /> Press Reviews
          </p>
          <h2 className="text-4xl font-black" style={{ color: INK }}>What the Critics Say</h2>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {data.testimonials.map((t, i) => (
            <motion.figure key={i} variants={fadeUp} className="rounded-2xl p-7 border-2 hover:-translate-y-1 transition-transform"
              style={{ background: '#fbf5e6', borderColor: 'rgba(74,50,38,0.2)', transform: `rotate(${i % 2 === 0 ? -0.5 : 0.5}deg)` }}>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => <Star key={j} size={14} style={{ color: AMBER }} fill={AMBER} />)}
              </div>
              <blockquote className="text-sm leading-relaxed italic mb-5 font-medium" style={{ color: '#4a3b22' }}>
                &ldquo;{t.text}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3">
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover"
                    style={{ border: '3px solid #fff', boxShadow: '0 2px 8px rgba(43,29,21,0.25)' }} />
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black"
                    style={{ background: AMBER, color: '#fff' }}>
                    {initialsOf(t.name)}
                  </div>
                )}
                <div>
                  <div className="font-black text-sm" style={{ color: INK }}>{t.name}</div>
                  {t.role && <div className="text-xs" style={{ color: '#8a6d3b' }}>{t.role}</div>}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

// Contact — request line
const RequestLine = ({ data }) => (
  <section id="contact" className="relative py-24 overflow-hidden" style={{ background: DEEP }}>
    <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[640px] h-[640px] rounded-full pointer-events-none"
      style={{ background: 'radial-gradient(circle, rgba(217,119,6,0.18), transparent 62%)' }} />
    <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
        <motion.div variants={fadeUp}>
          <Disc3 size={30} className="mx-auto mb-5" style={{ color: '#f0b45c' }} />
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: CREAM }}>Drop the Needle</h2>
          <p className="text-sm md:text-base mb-10" style={{ color: 'rgba(247,241,227,0.65)' }}>
            The request line is open. Call in a track, book a session, or just say hello.
          </p>
        </motion.div>
        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4 mb-14">
          {data.socials?.email && (
            <a href={`mailto:${data.socials.email}`}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-black shadow-lg transition-transform hover:-translate-y-0.5"
              style={{ background: AMBER, color: '#fff' }}>
              <Mail size={18} /> Request a Track
            </a>
          )}
          {['github', 'linkedin', 'twitter'].map(key => {
            const url = data.socials?.[key];
            if (!url) return null;
            const Icon = key === 'github' ? Github : key === 'linkedin' ? Linkedin : Twitter;
            return (
              <a key={key} href={url} target="_blank" rel="noreferrer" aria-label={key}
                className="inline-flex items-center justify-center w-12 h-12 rounded-full border-2 transition-colors"
                style={{ borderColor: 'rgba(247,241,227,0.35)', color: CREAM }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(217,119,6,0.25)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                <Icon size={18} />
              </a>
            );
          })}
        </motion.div>
        <motion.p variants={fadeUp} className="text-[10px] font-bold uppercase" style={{ color: 'rgba(247,241,227,0.4)', letterSpacing: '0.28em' }}>
          &copy; {new Date().getFullYear()} {data.personal?.name || 'The Artist'} &middot; Vinyl Record
        </motion.p>
      </motion.div>
    </div>
  </section>
);

// Main component
export default function VinylRecord() {
  const { portfolioData: data } = usePortfolio();
  const [spinning, setSpinning] = useState(true);

  const navItems = [
    { label: 'Liner Notes', href: '#about', show: Boolean(data.personal?.bio || data.personal?.avatar) },
    { label: 'Sessions', href: '#skills', show: data.skills?.length > 0 },
    { label: 'The Album', href: '#projects', show: data.projects?.length > 0 },
    { label: 'History', href: '#experience', show: data.experience?.length > 0 },
    { label: 'Reviews', href: '#testimonials', show: data.testimonials?.length > 0 },
    { label: 'Request Line', href: '#contact', show: true },
  ].filter(item => item.show);

  return (
    <div className="font-sans antialiased overflow-x-hidden" style={{ background: CREAM }}>
      <style>{`
        @keyframes spin360 { to { transform: rotate(360deg); } }
        @keyframes eqBar { 0%, 100% { transform: scaleY(0.25); } 50% { transform: scaleY(1); } }
      `}</style>

      {/* hi-fi console nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b shadow-lg" style={{ background: DEEP, borderColor: 'rgba(247,241,227,0.12)' }}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-2.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button type="button" onClick={() => setSpinning(s => !s)} aria-label={spinning ? 'Pause record' : 'Play record'}
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform hover:scale-105"
              style={{ background: AMBER, color: '#fff' }}>
              {spinning ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <div className="rounded px-2.5 py-1 font-mono text-[10px] overflow-hidden whitespace-nowrap text-ellipsis min-w-0"
              style={{ background: 'rgba(0,0,0,0.45)', color: '#f0b45c', boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6)' }}>
              {spinning ? '▶ ' : '❚❚ '}{(data.personal?.name || 'MY PORTFOLIO').toUpperCase()} — LIVE
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <a key={item.href} href={item.href}
                className="text-[11px] font-bold uppercase px-3 py-1.5 rounded-full transition-colors hover:bg-[#d97706] hover:text-white"
                style={{ color: CREAM, letterSpacing: '0.12em' }}>
                {item.label}
              </a>
            ))}
          </div>
          <a href="#contact" className="md:hidden text-[11px] font-bold uppercase px-3 py-1.5 rounded-full" style={{ background: AMBER, color: '#fff' }}>
            Contact
          </a>
        </div>
      </nav>

      <Hero data={data} spinning={spinning} onToggle={() => setSpinning(s => !s)} />
      {(data.personal?.bio || data.personal?.avatar) && <LinerNotes data={data} />}
      {data.skills?.length > 0 && <TwoSides data={data} />}
      {data.projects?.length > 0 && <Sleeve data={data} />}
      {data.experience?.length > 0 && <SessionHistory data={data} />}
      {data.testimonials?.length > 0 && <CriticReviews data={data} />}
      <RequestLine data={data} />
    </div>
  );
}
