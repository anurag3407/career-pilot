import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Github, Linkedin, Twitter, ExternalLink, Landmark, Palette, ArrowRight, Quote } from 'lucide-react';

/**
 * Museum Gallery Portfolio Template
 * Category: Unique / Creative
 * Description: Art museum layout with projects displayed in ornate gold frames on gallery walls. Placard descriptions beside each piece. Gallery room navigation.
 */

/* ------------------------------------------------------------------ */
/* Palette — warm plaster walls, gilded frames, engraved charcoal      */
/* ------------------------------------------------------------------ */
const WALL = '#e6dcc8';
const WALL_DEEP = '#dbcfb4';
const CHARCOAL = '#2b2419';
const MUTED = 'rgba(43,36,25,0.6)';
const GOLD = '#a8853b';
const GOLD_HI = '#dfc07c';
const PLACARD = '#f7f0de';
const SERIF = "Georgia, 'Times New Roman', serif";

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 0.61, 0.36, 1] } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

/* ------------------------------------------------------------------ */
/* Museum furniture                                                    */
/* ------------------------------------------------------------------ */
/* Ceiling track with deterministic lamp heads */
const TrackLighting = ({ lamps = 6 }) => (
  <div aria-hidden="true" className="absolute top-0 inset-x-0 pointer-events-none z-10">
    <div className="h-[4px] w-full" style={{ background: 'linear-gradient(180deg, #4a3f2c, #6b5c42)' }} />
    <div className="relative h-0">
      {Array.from({ length: lamps }).map((_, i) => {
        const left = ((i + 0.5) / lamps) * 100;
        return (
          <React.Fragment key={i}>
            <span className="absolute -top-[2px] w-2 h-3 rounded-b-sm"
              style={{ left: `${left}%`, marginLeft: -4, background: '#3a3122' }} />
            <span className="absolute w-1.5 h-1.5 rounded-full"
              style={{ left: `${left}%`, marginLeft: -3, background: '#ffe9b0', boxShadow: '0 0 12px 4px rgba(255,226,150,0.8)' }} />
          </React.Fragment>
        );
      })}
    </div>
  </div>
);

/* Pool of warm light cast by the track above a wall section */
const LightPool = ({ className = '', width = '78%' }) => (
  <div aria-hidden="true" className={`absolute top-0 pointer-events-none ${className}`}
    style={{
      width,
      height: 260,
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'radial-gradient(55% 100% at 50% 0%, rgba(255,238,190,0.5), rgba(255,238,190,0.12) 55%, transparent 78%)',
    }} />
);

/* Ornate gilded frame: molding + liner + mat + inner bezel */
const Frame = ({ children, rotate = 0 }) => (
  <div className="relative inline-block" style={{ transform: `rotate(${rotate}deg)` }}>
    {/* corner rosettes */}
    {[['-top-1.5', '-left-1.5'], ['-top-1.5', '-right-1.5'], ['-bottom-1.5', '-left-1.5'], ['-bottom-1.5', '-right-1.5']].map((pos, i) => (
      <span key={i} className={`absolute ${pos[0]} ${pos[1]} w-3.5 h-3.5 rotate-45 z-20`}
        style={{ background: `linear-gradient(135deg, ${GOLD_HI}, ${GOLD})`, boxShadow: '0 1px 3px rgba(43,36,25,0.5)' }} />
    ))}
    {/* outer molding */}
    <div className="p-[14px]"
      style={{
        background: `linear-gradient(135deg, #7c5f28 0%, ${GOLD_HI} 20%, ${GOLD} 42%, #ecd08c 58%, #7c5f28 80%, ${GOLD_HI} 100%)`,
        boxShadow: '0 24px 48px rgba(43,36,25,0.38), 0 6px 14px rgba(43,36,25,0.28)',
      }}>
      {/* liner */}
      <div className="p-[5px]" style={{ background: `linear-gradient(135deg, ${GOLD}, #e6c983)` }}>
        {/* mat */}
        <div className="p-4 md:p-6" style={{ background: '#f1e8d2' }}>
          <div style={{ border: '3px solid #3a2f1d' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* Canvas placeholder when a piece has no image */
const EtchedCanvas = ({ name, seed = 0 }) => {
  const initials = (name || '?').split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div className="aspect-[4/3] w-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: [
          'linear-gradient(155deg, #e7dbbd 0%, #cbb98f 55%, #b09c6d 100%)',
          'linear-gradient(205deg, #d8c9a6 0%, #a98f63 60%, #8c7449 100%)',
          'linear-gradient(115deg, #efe4c8 0%, #cdbf9f 50%, #9d8a60 100%)',
        ][seed % 3],
      }}>
      <svg viewBox="0 0 200 90" className="absolute inset-x-0 bottom-6 w-[85%]" fill="none" aria-hidden="true">
        <path d={`M6,${64 + (seed % 3) * 4} C40,44 70,72 104,56 C136,42 168,66 194,54`}
          stroke="rgba(43,36,25,0.30)" strokeWidth="2.4" strokeLinecap="round" />
        <path d={`M10,${76 - (seed % 2) * 5} C50,60 90,82 130,66 C158,56 178,72 192,66`}
          stroke="rgba(43,36,25,0.18)" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span className="relative text-5xl md:text-6xl" style={{ fontFamily: SERIF, color: 'rgba(43,36,25,0.55)', letterSpacing: '0.14em' }}>
        {initials}
      </span>
      <span className="relative mt-3 text-[10px] uppercase" style={{ letterSpacing: '0.4em', color: 'rgba(43,36,25,0.45)' }}>
        Mixed media
      </span>
    </div>
  );
};

/* Wall placard — small museum label beside a piece */
const Placard = ({ project, index }) => {
  const tech = project.techStack || [];
  return (
    <motion.div variants={fadeUp} className="p-5 md:p-6 relative"
      style={{ background: PLACARD, boxShadow: '0 2px 0 rgba(43,36,25,0.22), 0 10px 24px rgba(43,36,25,0.18)' }}>
      <span className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${GOLD}, ${GOLD_HI})` }} />
      <p className="text-[10px] uppercase mb-2" style={{ letterSpacing: '0.35em', color: MUTED }}>
        No. {String(index + 1).padStart(3, '0')}
      </p>
      <h3 className="text-xl md:text-2xl font-bold mb-2" style={{ fontFamily: SERIF, color: CHARCOAL }}>
        {project.title}
      </h3>
      {tech.length > 0 && (
        <p className="text-xs italic mb-3" style={{ fontFamily: SERIF, color: MUTED }}>
          Medium: {tech.join(', ')}
        </p>
      )}
      {project.description ? (
        <p className="text-[13px] leading-relaxed mb-4" style={{ color: 'rgba(43,36,25,0.78)' }}>
          {project.description}
        </p>
      ) : null}
      <div className="flex gap-4">
        {project.liveUrl ? (
          <a href={project.liveUrl} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase transition-opacity hover:opacity-60"
            style={{ letterSpacing: '0.18em', color: CHARCOAL }}>
            <ExternalLink size={12} strokeWidth={1.5} /> Visit site
          </a>
        ) : null}
        {project.githubUrl ? (
          <a href={project.githubUrl} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase transition-opacity hover:opacity-60"
            style={{ letterSpacing: '0.18em', color: GOLD }}>
            <Github size={12} strokeWidth={1.5} /> Studio archive
          </a>
        ) : null}
      </div>
    </motion.div>
  );
};

/* Section header engraved into the wall */
const SectionHead = ({ icon: Icon, label, title, dark = false }) => (
  <motion.div variants={fadeUp} className="text-center mb-12">
    <div className="inline-flex items-center gap-2.5 mb-3" style={{ color: dark ? GOLD_HI : GOLD }}>
      {Icon ? <Icon size={15} strokeWidth={1.5} /> : null}
      <span className="text-[11px] font-semibold uppercase" style={{ letterSpacing: '0.4em' }}>{label}</span>
    </div>
    <h2 className="text-3xl md:text-5xl font-bold uppercase"
      style={{
        fontFamily: SERIF,
        letterSpacing: '0.08em',
        color: dark ? '#efe6d0' : CHARCOAL,
        textShadow: dark ? 'none' : '0 1px 0 rgba(255,255,255,0.45)',
      }}>
      {title}
    </h2>
    <div className="mx-auto mt-5 h-px w-28" style={{ background: `linear-gradient(90deg, transparent, ${dark ? GOLD_HI : GOLD}, transparent)` }} />
  </motion.div>
);

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */
const Hero = ({ data }) => {
  const p = data.personal || {};
  const stats = data.stats || {};
  const years = Number(stats.yearsExperience) || 0;
  const estYear = years > 0 ? new Date().getFullYear() - years : new Date().getFullYear();

  return (
    <section id="hero" className="relative overflow-hidden" style={{ background: `linear-gradient(180deg, ${WALL_DEEP} 0%, ${WALL} 40%)` }}>
      <TrackLighting lamps={7} />
      <LightPool />
      {/* faint plaster mottling */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            'radial-gradient(ellipse 40% 30% at 12% 30%, rgba(120,104,72,0.10), transparent 70%)',
            'radial-gradient(ellipse 35% 25% at 85% 55%, rgba(120,104,72,0.08), transparent 70%)',
            'radial-gradient(ellipse 45% 30% at 45% 85%, rgba(120,104,72,0.07), transparent 70%)',
          ].join(', '),
        }} />

      <motion.div initial="hidden" animate="visible" variants={stagger}
        className="relative z-10 max-w-3xl mx-auto px-6 pt-40 pb-32 text-center">
        <motion.p variants={fadeUp} className="text-[11px] uppercase mb-6" style={{ letterSpacing: '0.5em', color: GOLD }}>
          Est. {estYear} — Permanent Collection
        </motion.p>
        <motion.p variants={fadeUp} className="text-xs uppercase mb-4" style={{ letterSpacing: '0.45em', color: MUTED }}>
          The Museum of
        </motion.p>
        <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-bold uppercase leading-tight mb-6"
          style={{
            fontFamily: SERIF,
            letterSpacing: '0.06em',
            color: CHARCOAL,
            textShadow: '0 1px 0 rgba(255,255,255,0.5), 0 -1px 1px rgba(43,36,25,0.25)',
          }}>
          {p.name || 'Untitled Artist'}
        </motion.h1>
        {p.tagline ? (
          <motion.p variants={fadeUp} className="text-base md:text-lg italic mb-3" style={{ fontFamily: SERIF, color: MUTED }}>
            {p.tagline}
          </motion.p>
        ) : null}
        {p.location ? (
          <motion.p variants={fadeUp} className="inline-flex items-center gap-2 text-xs uppercase mb-10"
            style={{ letterSpacing: '0.3em', color: MUTED }}>
            <MapPin size={12} strokeWidth={1.5} /> {p.location}
          </motion.p>
        ) : null}
        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
          <a href="#gallery"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-xs font-semibold uppercase transition-colors hover:bg-[#2b2419] hover:text-[#efe6d0]"
            style={{ letterSpacing: '0.28em', color: CHARCOAL, border: '1.5px solid #2b2419' }}>
            Enter the galleries <ArrowRight size={14} strokeWidth={1.5} />
          </a>
          <a href="#about"
            className="inline-flex items-center px-7 py-3.5 text-xs font-semibold uppercase border-b transition-opacity hover:opacity-60"
            style={{ letterSpacing: '0.28em', color: CHARCOAL, borderColor: CHARCOAL }}>
            About the artist
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

const About = ({ data }) => {
  const p = data.personal || {};
  const stats = data.stats || {};
  const plaqueItems = [
    { label: 'Years Active', value: stats.yearsExperience },
    { label: 'Works in Collection', value: stats.projectsCompleted },
    { label: 'Patrons Delighted', value: stats.happyClients },
  ].filter(s => s.value !== undefined && s.value !== null && s.value !== '');

  return (
    <section id="about" className="relative overflow-hidden" style={{ background: WALL_DEEP }}>
      <TrackLighting lamps={4} />
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <SectionHead icon={Landmark} label="Gallery Information" title="About the Artist" />
          <motion.div variants={fadeUp} className="grid md:grid-cols-5 gap-10 md:gap-14 items-center">
            <div className="md:col-span-2 flex justify-center">
              <Frame rotate={-0.8}>
                {p.avatar ? (
                  <img src={p.avatar} alt={p.name || 'Portrait'} className="w-44 h-52 md:w-48 md:h-56 object-cover"
                    style={{ filter: 'sepia(0.14) saturate(0.92)' }} />
                ) : (
                  <div className="w-44 h-52 md:w-48 md:h-56 flex items-center justify-center"
                    style={{ background: 'linear-gradient(155deg, #e7dbbd, #b09c6d)' }}>
                    <span className="text-5xl" style={{ fontFamily: SERIF, color: 'rgba(43,36,25,0.55)', letterSpacing: '0.12em' }}>
                      {(p.name || '?').split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                    </span>
                  </div>
                )}
              </Frame>
            </div>
            <div className="md:col-span-3">
              <p className="text-sm md:text-base leading-relaxed mb-8" style={{ fontFamily: SERIF, color: 'rgba(43,36,25,0.85)' }}>
                {p.bio || 'The artist has declined to provide wall text. Their work, displayed in the galleries beyond, is the only statement they wish to make.'}
              </p>
              {plaqueItems.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {plaqueItems.map((s, i) => (
                    <div key={i} className="py-4 text-center" style={{ background: PLACARD, boxShadow: '0 2px 0 rgba(43,36,25,0.2)' }}>
                      <div className="text-2xl font-bold" style={{ fontFamily: SERIF, color: GOLD }}>{s.value}</div>
                      <div className="text-[9px] uppercase mt-1.5 px-1" style={{ letterSpacing: '0.2em', color: MUTED }}>
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/* Skills — framed technical studies, one per medium */
const Skills = ({ data }) => {
  const skills = data.skills || [];
  const categories = [...new Set(skills.map(s => s.category || 'General'))];
  return (
    <section id="skills" className="relative overflow-hidden" style={{ background: WALL }}>
      <TrackLighting lamps={5} />
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <SectionHead icon={Palette} label="Collections" title="Mediums & Techniques" />
          {categories.map((cat, ci) => (
            <motion.div key={ci} variants={fadeUp} className="mb-10 last:mb-0">
              <h3 className="text-center text-xs uppercase mb-6" style={{ letterSpacing: '0.4em', color: MUTED }}>
                — {cat} —
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {skills.filter(s => (s.category || 'General') === cat).map((skill, i) => {
                  const level = Math.max(0, Math.min(100, Number(skill.level) || 85));
                  return (
                    <motion.div key={i} variants={fadeUp} whileHover={{ y: -4 }} className="p-5 pt-7 relative"
                      style={{ background: PLACARD, boxShadow: '0 2px 0 rgba(43,36,25,0.22), 0 12px 26px rgba(43,36,25,0.16)' }}>
                      <span className="absolute top-2.5 left-1/2 -translate-x-1/2 text-[9px] uppercase"
                        style={{ letterSpacing: '0.3em', color: GOLD }}>
                        Study {String(i + 1).padStart(2, '0')}
                      </span>
                      <h4 className="text-base font-bold text-center mb-4" style={{ fontFamily: SERIF, color: CHARCOAL }}>
                        {skill.name}
                      </h4>
                      <div className="h-[4px] w-full" style={{ background: 'rgba(43,36,25,0.12)' }}>
                        <motion.div className="h-full"
                          style={{ background: `linear-gradient(90deg, ${GOLD}, ${GOLD_HI})` }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.1, delay: i * 0.07, ease: 'easeOut' }} />
                      </div>
                      <p className="text-[10px] uppercase text-center mt-3" style={{ letterSpacing: '0.25em', color: MUTED }}>
                        Mastery — {level}%
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* Projects — the galleries: works hang in rooms of three */
const ROOM_NAMES = ['Early Works', 'Signature Pieces', 'Recent Acquisitions', 'The Annex'];
const ROOM_SIZE = 3;

const Projects = ({ data }) => {
  const projects = data.projects || [];
  const rooms = [];
  for (let i = 0; i < projects.length; i += ROOM_SIZE) rooms.push(projects.slice(i, i + ROOM_SIZE));
  const [roomIdx, setRoomIdx] = useState(0);
  const room = rooms[Math.min(roomIdx, rooms.length - 1)] || [];

  return (
    <section id="gallery" className="relative overflow-hidden" style={{ background: WALL_DEEP }}>
      <TrackLighting lamps={6} />
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-24" id="projects">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} variants={stagger}>
          <SectionHead icon={Landmark} label="Now Showing" title="The Collection" />

          {/* room directory */}
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-3 mb-14">
            {rooms.map((r, i) => (
              <button key={i} onClick={() => setRoomIdx(i)}
                className="px-5 py-2.5 text-[11px] font-semibold uppercase transition-colors"
                style={{
                  letterSpacing: '0.25em',
                  fontFamily: SERIF,
                  color: i === roomIdx ? '#efe6d0' : CHARCOAL,
                  background: i === roomIdx ? CHARCOAL : PLACARD,
                  border: `1px solid ${i === roomIdx ? CHARCOAL : 'rgba(43,36,25,0.25)'}`,
                  boxShadow: i === roomIdx ? 'none' : '0 2px 0 rgba(43,36,25,0.2)',
                }}>
                Room {String(i + 1).padStart(2, '0')} · {ROOM_NAMES[i % ROOM_NAMES.length]}
              </button>
            ))}
          </motion.div>

          {/* current room */}
          <motion.div key={roomIdx}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="space-y-16">
            {room.map((project, ri) => {
              const idx = roomIdx * ROOM_SIZE + ri;
              const flip = ri % 2 === 1;
              return (
                <div key={ri} className={`grid md:grid-cols-2 gap-8 md:gap-14 items-center`}>
                  <div className={`flex flex-col items-center ${flip ? 'md:order-2' : ''}`}>
                    <LightPool width="70%" />
                    <Frame rotate={flip ? 0.7 : -0.7}>
                      <div className="w-[240px] sm:w-[300px] md:w-[320px]">
                        {project.image ? (
                          <img src={project.image} alt={project.title} className="w-full aspect-[4/3] object-cover"
                            style={{ filter: 'saturate(0.92)' }} />
                        ) : (
                          <EtchedCanvas name={project.title} seed={idx} />
                        )}
                      </div>
                    </Frame>
                  </div>
                  <div className={flip ? 'md:order-1' : ''}>
                    <Placard project={project} index={idx} />
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* floor guide */}
          <motion.div variants={fadeUp} className="mt-16 text-center text-[11px] uppercase"
            style={{ letterSpacing: '0.3em', color: MUTED }}>
            Gallery {String(roomIdx + 1).padStart(2, '0')} of {String(rooms.length).padStart(2, '0')} — please walk, do not run
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/* Experience — exhibition history */
const Experience = ({ data }) => {
  const experience = data.experience || [];
  return (
    <section id="experience" className="relative overflow-hidden" style={{ background: WALL }}>
      <TrackLighting lamps={4} />
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <SectionHead icon={Landmark} label="Curriculum" title="Exhibition History" />
          <div className="space-y-0">
            {experience.map((exp, i) => (
              <motion.div key={i} variants={fadeUp} className="grid md:grid-cols-4 gap-2 md:gap-8 py-8"
                style={{ borderTop: i === 0 ? 'none' : '1px solid rgba(43,36,25,0.18)' }}>
                <div className="md:col-span-1">
                  <span className="inline-block px-3 py-1.5 text-[11px] font-semibold uppercase"
                    style={{ letterSpacing: '0.2em', fontFamily: SERIF, color: CHARCOAL, background: PLACARD, boxShadow: '0 2px 0 rgba(43,36,25,0.2)' }}>
                    {exp.period}
                  </span>
                </div>
                <div className="md:col-span-3">
                  <h3 className="text-xl md:text-2xl font-bold" style={{ fontFamily: SERIF, color: CHARCOAL }}>
                    {exp.role}
                  </h3>
                  <p className="text-xs uppercase mt-1 mb-3" style={{ letterSpacing: '0.25em', color: GOLD }}>
                    {exp.company}
                  </p>
                  {exp.description ? (
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(43,36,25,0.75)', fontFamily: SERIF }}>
                      {exp.description}
                    </p>
                  ) : null}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

/* Testimonials — the visitor book */
const Testimonials = ({ data }) => {
  const testimonials = data.testimonials || [];
  return (
    <section id="testimonials" className="relative overflow-hidden" style={{ background: WALL_DEEP }}>
      <TrackLighting lamps={4} />
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
          <SectionHead icon={Quote} label="Patron Reviews" title="The Visitor Book" />
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => {
              const initials = (t.name || '?').split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
              return (
                <motion.figure key={i} variants={fadeUp} className="p-6 relative"
                  style={{
                    transform: `rotate(${i % 2 === 0 ? -0.6 : 0.5}deg)`,
                    background: `repeating-linear-gradient(180deg, ${PLACARD} 0px, ${PLACARD} 27px, rgba(43,36,25,0.07) 28px)`,
                    boxShadow: '0 3px 0 rgba(43,36,25,0.22), 0 12px 28px rgba(43,36,25,0.18)',
                  }}>
                  <blockquote className="text-sm leading-[28px] italic mb-5" style={{ fontFamily: SERIF, color: 'rgba(43,36,25,0.85)' }}>
                    {t.text}
                  </blockquote>
                  <figcaption className="flex items-center gap-3">
                    {t.avatar ? (
                      <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover"
                        style={{ border: `2px solid ${GOLD}`, filter: 'sepia(0.15)' }} />
                    ) : (
                      <span className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold"
                        style={{ background: CHARCOAL, color: GOLD_HI, fontFamily: SERIF }}>
                        {initials}
                      </span>
                    )}
                    <span>
                      <span className="block text-sm font-bold" style={{ fontFamily: SERIF, color: CHARCOAL }}>{t.name}</span>
                      <span className="block text-[11px] italic" style={{ fontFamily: SERIF, color: MUTED }}>{t.role}</span>
                    </span>
                  </figcaption>
                </motion.figure>
              );
            })}
          </div>
        </motion.div>
      </div>
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
    <section id="contact" className="relative overflow-hidden"
      style={{ background: `linear-gradient(180deg, #241d12 0%, #1c160d 100%)` }}>
      <TrackLighting lamps={5} />
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-24 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <SectionHead icon={Mail} label="Membership Desk" title="Correspondence" dark />
          <motion.p variants={fadeUp} className="text-sm md:text-base italic mb-10 max-w-xl mx-auto"
            style={{ fontFamily: SERIF, color: 'rgba(239,230,208,0.65)' }}>
            The curator welcomes letters from patrons, collectors, and fellow artists. All correspondence receives a personal reply.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4 mb-10">
            {email ? (
              <a href={`mailto:${email}`}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 text-xs font-semibold uppercase transition-colors"
                style={{ letterSpacing: '0.28em', color: '#1c160d', background: `linear-gradient(135deg, ${GOLD_HI}, ${GOLD})` }}>
                <Mail size={14} strokeWidth={1.5} /> Write to the curator
              </a>
            ) : null}
            {socialLinks.map(l => (
              <a key={l.key} href={l.href} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase transition-colors hover:text-[#dfc07c]"
                style={{ letterSpacing: '0.28em', color: 'rgba(239,230,208,0.75)', border: `1px solid rgba(223,192,124,0.4)` }}>
                <l.Icon size={14} strokeWidth={1.5} /> {l.label}
              </a>
            ))}
          </motion.div>
          <motion.div variants={fadeUp} className="pt-8" style={{ borderTop: '1px solid rgba(223,192,124,0.3)' }}>
            <p className="text-[11px] uppercase" style={{ letterSpacing: '0.3em', color: 'rgba(239,230,208,0.45)' }}>
              &copy; {new Date().getFullYear()} {p.name || ''} — Museum Gallery Portfolio · Open daily, forever
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */
export default function MuseumGallery() {
  const { portfolioData: data } = usePortfolio();
  const p = data.personal || {};

  const navItems = [
    { label: 'Visit', href: '#about' },
    { label: 'Galleries', href: '#gallery' },
    { label: 'Techniques', href: '#skills' },
    { label: 'History', href: '#experience' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <div className="antialiased overflow-x-hidden" style={{ fontFamily: SERIF, color: CHARCOAL, background: WALL }}>
      {/* museum banner nav */}
      <nav className="fixed top-0 inset-x-0 z-40"
        style={{ background: 'rgba(28,22,13,0.94)', borderBottom: `2px solid ${GOLD}` }}>
        <div className="max-w-6xl mx-auto px-6 md:px-10 h-14 flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-2.5">
            <Landmark size={16} strokeWidth={1.5} style={{ color: GOLD_HI }} />
            <span className="text-xs font-bold uppercase" style={{ letterSpacing: '0.3em', color: '#efe6d0' }}>
              {p.name || 'Museum'} Gallery
            </span>
          </a>
          <div className="hidden md:flex items-center gap-7">
            {navItems.map(item => (
              <a key={item.label} href={item.href}
                className="text-[11px] uppercase transition-colors hover:text-[#dfc07c]"
                style={{ letterSpacing: '0.25em', color: 'rgba(239,230,208,0.7)' }}>
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <Hero data={data} />
      {(p.bio || p.avatar) ? <About data={data} /> : null}
      {data.skills?.length > 0 ? <Skills data={data} /> : null}
      {data.projects?.length > 0 ? <Projects data={data} /> : null}
      {data.experience?.length > 0 ? <Experience data={data} /> : null}
      {data.testimonials?.length > 0 ? <Testimonials data={data} /> : null}
      <Contact data={data} />
    </div>
  );
}
