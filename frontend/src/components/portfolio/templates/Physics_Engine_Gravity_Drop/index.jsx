import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Github, Linkedin, Twitter, MapPin, ExternalLink, ArrowDown,
  Wrench, Quote, Box, Cog
} from 'lucide-react';

/**
 * Physics Engine Gravity Drop Portfolio Template
 * Category: Interactive / Physics
 * Description: Interactive gravity playground. Hero elements fall in and bounce with a custom JS gravity simulation (requestAnimationFrame, no physics library), projects are draggable physics cards with spring return, and a DROP button re-drops everything. Industrial lab palette: graphite + safety yellow.
 */

/* ------------------------------------------------------------------ */
/* Industrial lab palette                                              */
/* ------------------------------------------------------------------ */
const GRAPHITE = '#1c1e21';
const GRAPHITE_2 = '#22252a';
const PANEL = '#2a2e34';
const PANEL_2 = '#31363d';
const YELLOW = '#ffd21f';
const YELLOW_DEEP = '#e3b90c';
const CHALK = '#e7eaee';
const MUTE = 'rgba(231,234,238,0.62)';
const DIM = 'rgba(231,234,238,0.38)';
const HAZARD = `repeating-linear-gradient(-45deg, ${YELLOW} 0 12px, #151515 12px 24px)`;

const MONO = `ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace`;

const STYLE_CSS = `
.pg-hazard { background: ${HAZARD}; }
.pg-card { transition: transform .3s ease, box-shadow .3s ease, border-color .3s ease; }
.pg-card:hover { border-color: rgba(255,210,31,0.55); box-shadow: 0 16px 36px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,210,31,0.25); }
.pg-rivet { position: absolute; width: 6px; height: 6px; border-radius: 9999px;
  background: ${YELLOW_DEEP}; box-shadow: inset 0 1px 1px rgba(0,0,0,0.6); }
.pg-link { transition: color .25s ease, background .25s ease; }
.pg-link:hover { color: ${YELLOW}; background: rgba(255,210,31,0.08); }
@keyframes pgPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.25; } }
.pg-live { animation: pgPulse 1.6s ease-in-out infinite; }
`;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const initialsOf = (name) => {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  return (parts.slice(0, 2).map(w => w[0].toUpperCase()).join('')) || 'P';
};

/* Section header — stencil plate */
const Plate = ({ num, label, title }) => (
  <motion.div variants={fadeUp} className="mb-12 md:mb-16">
    <p className="text-[10px] mb-3 inline-flex items-center gap-2 px-3 py-1.5 border-2"
      style={{ borderColor: YELLOW, color: YELLOW, letterSpacing: '0.3em', fontFamily: MONO }}>
      <Cog size={13} /> UNIT_{num} &middot; {label}
    </p>
    <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight" style={{ color: CHALK }}>
      {title}
    </h2>
    <div className="mt-4 h-1 w-32" style={{ background: YELLOW }} />
  </motion.div>
);

/* Corner rivets for panels */
const Rivets = () => (
  <span aria-hidden>
    <span className="pg-rivet" style={{ top: 8, left: 8 }} />
    <span className="pg-rivet" style={{ top: 8, right: 8 }} />
    <span className="pg-rivet" style={{ bottom: 8, left: 8 }} />
    <span className="pg-rivet" style={{ bottom: 8, right: 8 }} />
  </span>
);

/* ------------------------------------------------------------------ */
/* Hero — the gravity drop chamber                                     */
/* ------------------------------------------------------------------ */
const BODY_ORDER = ['name', 'title', 'tagline', 'location', 'ctaAbout', 'ctaProjects'];
const BODY_FALLBACK = {
  name: { w: 380, h: 110 },
  title: { w: 250, h: 56 },
  tagline: { w: 320, h: 64 },
  location: { w: 190, h: 44 },
  ctaAbout: { w: 170, h: 52 },
  ctaProjects: { w: 190, h: 52 },
};

const blockBase = {
  position: 'absolute',
  top: 0,
  left: 0,
  willChange: 'transform',
  touchAction: 'none',
};

const Hero = ({ data, simState, onDrop, blockRefs, areaRef }) => {
  const name = data.personal?.name || 'My Portfolio';
  const pending = simState === 'pending';
  const physics = simState === 'on';
  /* physics bodies get their transforms from the rAF loop */
  const bodyStyle = (key) => {
    if (!pending && !physics) return { position: 'relative' };
    return { ...blockBase, transform: pending ? 'translateY(calc(-100vh - 160px))' : undefined };
  };
  const setRef = (key) => (el) => { if (el) blockRefs.current[key] = el; };

  return (
    <section id="hero" className="relative overflow-hidden"
      style={{ background: `radial-gradient(800px 400px at 70% 0%, rgba(255,210,31,0.07), transparent 60%), ${GRAPHITE}` }}>
      <div ref={areaRef}
        className="relative min-h-[92vh] px-6 pt-24 pb-16"
        style={physics || pending ? undefined : { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

        {/* chamber HUD readouts */}
        <span aria-hidden className="absolute top-20 left-6 text-[10px]" style={{ fontFamily: MONO, color: DIM, letterSpacing: '0.2em' }}>
          G = 9.81 m/s&sup2; &nbsp;|&nbsp; RESTITUTION 0.50 &nbsp;|&nbsp; BODIES 06
        </span>
        <span aria-hidden className="absolute top-20 right-6 text-[10px] flex items-center gap-2" style={{ fontFamily: MONO, color: DIM, letterSpacing: '0.2em' }}>
          <span className="pg-live inline-block w-2 h-2 rounded-full" style={{ background: YELLOW }} />
          {physics ? 'SIM.ACTIVE' : 'SIM.STANDBY'}
        </span>

        {/* falling physics blocks */}
        <div ref={setRef('name')}
          style={{ ...bodyStyle('name'), borderLeftColor: YELLOW, background: PANEL, boxShadow: '0 14px 34px rgba(0,0,0,0.5)' }}
          className={`select-none border-l-8 px-7 py-5 ${physics || pending ? '' : 'mb-6'}`}>
          <h1 className="text-4xl md:text-6xl font-extrabold uppercase leading-none tracking-tight" style={{ color: CHALK }}>
            {name}
          </h1>
          <p className="mt-2 text-[10px]" style={{ fontFamily: MONO, color: DIM, letterSpacing: '0.3em' }}>
            MASS 120KG &middot; CRATE.A &middot; FRAGILE
          </p>
        </div>

        {data.personal?.title && (
          <div ref={setRef('title')}
            style={{ ...bodyStyle('title'), background: YELLOW, boxShadow: '0 10px 26px rgba(0,0,0,0.45)' }}
            className={`px-5 py-3 ${physics || pending ? '' : 'mb-6'}`}>
            <p className="text-lg md:text-xl font-extrabold uppercase" style={{ color: '#151515' }}>
              {data.personal.title}
            </p>
          </div>
        )}

        {data.personal?.tagline && (
          <div ref={setRef('tagline')}
            style={{ ...bodyStyle('tagline'), borderColor: 'rgba(231,234,238,0.2)', background: 'rgba(34,37,42,0.9)', boxShadow: '0 10px 26px rgba(0,0,0,0.4)' }}
            className={`px-5 py-3 border ${physics || pending ? '' : 'mb-6'}`}>
            <p className="text-sm leading-relaxed max-w-sm" style={{ color: MUTE }}>{data.personal.tagline}</p>
          </div>
        )}

        {data.personal?.location && (
          <div ref={setRef('location')}
            style={{ ...bodyStyle('location'), borderColor: 'rgba(255,210,31,0.5)', background: GRAPHITE_2 }}
            className={`inline-flex items-center gap-2 px-4 py-2 border-2 ${physics || pending ? '' : 'mb-6'}`}>
            <MapPin size={14} style={{ color: YELLOW }} />
            <span className="text-xs font-semibold uppercase" style={{ color: CHALK, fontFamily: MONO, letterSpacing: '0.14em' }}>
              {data.personal.location}
            </span>
          </div>
        )}

        <a ref={setRef('ctaAbout')} href="#about"
          style={{ ...bodyStyle('ctaAbout'), background: YELLOW, color: '#151515', boxShadow: '0 10px 26px rgba(0,0,0,0.45)', fontFamily: MONO, letterSpacing: '0.12em', fontSize: 13 }}
          className={`inline-flex items-center gap-2 px-6 py-3 font-bold uppercase ${physics || pending ? '' : 'mb-6'}`}>
          <Wrench size={15} /> INSPECT WORKS
        </a>
        <a ref={setRef('ctaProjects')} href="#projects"
          style={{ ...bodyStyle('ctaProjects'), borderColor: CHALK, color: CHALK, background: 'rgba(34,37,42,0.85)', fontFamily: MONO, letterSpacing: '0.12em', fontSize: 13 }}
          className={`inline-flex items-center gap-2 px-6 py-3 font-bold uppercase border-2 ${physics || pending ? '' : 'mb-6'}`}>
          <Box size={15} /> VIEW CRATES
        </a>

        {/* DROP control */}
        {physics && (
          <button type="button" onClick={onDrop}
            className="absolute bottom-8 left-6 inline-flex items-center gap-2 px-6 py-3 font-extrabold uppercase transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
            style={{ background: YELLOW, color: '#151515', fontFamily: MONO, letterSpacing: '0.18em', fontSize: 13, boxShadow: '0 8px 22px rgba(0,0,0,0.5)' }}>
            <ArrowDown size={16} strokeWidth={3} /> DROP
          </button>
        )}
        <span aria-hidden className="absolute bottom-8 right-6 text-[10px] hidden sm:block"
          style={{ fontFamily: MONO, color: DIM, letterSpacing: '0.25em' }}>
          CHAMBER.01 &mdash; HANDLE WITH CARE
        </span>
      </div>

      {/* hazard stripe floor */}
      <div aria-hidden className="pg-hazard h-3 w-full" />
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* About — spec sheet                                                  */
/* ------------------------------------------------------------------ */
const About = ({ data }) => {
  const name = data.personal?.name || 'The Operator';
  return (
    <section id="about" className="relative py-24 border-t-4" style={{ background: GRAPHITE_2, borderTopColor: 'rgba(255,210,31,0.4)' }}>
      <div className="max-w-5xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <Plate num="01" label="SPEC.SHEET" title="About the Operator" />
          <div className="grid md:grid-cols-[auto_1fr] gap-12 items-center">
            <motion.div variants={fadeUp} className="flex justify-center">
              <div className="relative border-2 p-2" style={{ borderColor: 'rgba(255,210,31,0.6)', background: PANEL }}>
                <Rivets />
                {data.personal?.avatar ? (
                  <img src={data.personal.avatar} alt={name} className="w-52 h-64 md:w-60 md:h-72 object-cover"
                    style={{ filter: 'saturate(0.75) contrast(1.05)' }} />
                ) : (
                  <div className="w-52 h-64 md:w-60 md:h-72 flex flex-col items-center justify-center" style={{ background: GRAPHITE }}>
                    <Box size={28} style={{ color: YELLOW }} className="mb-4" />
                    <span className="text-6xl font-extrabold tracking-widest" style={{ color: CHALK }}>
                      {initialsOf(name)}
                    </span>
                    <span className="mt-4 text-[9px]" style={{ fontFamily: MONO, color: DIM, letterSpacing: '0.3em' }}>
                      SERIAL.PENDING
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
            <motion.div variants={fadeUp}>
              <p className="text-base md:text-lg leading-relaxed border-l-4 pl-5" style={{ color: MUTE, borderColor: YELLOW }}>
                {data.personal?.bio || `${name} has not filed a biography yet. This spec sheet remains blank pending inspection.`}
              </p>
              {(data.stats?.yearsExperience || data.stats?.projectsCompleted || data.stats?.happyClients) && (
                <div className="grid grid-cols-3 gap-4 mt-9">
                  {[
                    { label: 'YEARS.SVC', value: data.stats.yearsExperience },
                    { label: 'UNITS.SHIPPED', value: data.stats.projectsCompleted },
                    { label: 'CLIENTS.SIGNED', value: data.stats.happyClients },
                  ].filter(s => s.value !== undefined && s.value !== null && s.value !== '').map((s, i) => (
                    <div key={i} className="relative p-4 text-center border" style={{ borderColor: 'rgba(231,234,238,0.18)', background: PANEL }}>
                      <div className="text-3xl font-extrabold" style={{ color: YELLOW }}>{s.value}</div>
                      <div className="mt-1.5 text-[9px]" style={{ fontFamily: MONO, color: DIM, letterSpacing: '0.18em' }}>{s.label}</div>
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

/* ------------------------------------------------------------------ */
/* Skills — load ratings                                               */
/* ------------------------------------------------------------------ */
const Skills = ({ data }) => (
  <section id="skills" className="relative py-24 border-t-4" style={{ background: GRAPHITE, borderTopColor: 'rgba(255,210,31,0.4)' }}>
    <div className="max-w-4xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <Plate num="02" label="LOAD.RATINGS" title="Certified Capabilities" />
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
          {data.skills.map((skill, i) => (
            <motion.div key={i} variants={fadeUp}>
              <div className="flex justify-between items-baseline mb-2.5">
                <span className="font-bold text-base uppercase tracking-wide" style={{ color: CHALK }}>{skill.name}</span>
                <span className="text-xs font-extrabold" style={{ fontFamily: MONO, color: YELLOW }}>{skill.level || 85}% LOAD</span>
              </div>
              <div className="h-3.5 w-full border" style={{ borderColor: 'rgba(231,234,238,0.22)', background: '#17191c' }}>
                <motion.div className="h-full"
                  initial={{ width: 0 }} whileInView={{ width: `${skill.level || 85}%` }}
                  transition={{ duration: 1, delay: (i % 3) * 0.1, ease: 'easeOut' }} viewport={{ once: true }}
                  style={{ background: `repeating-linear-gradient(45deg, ${YELLOW} 0 8px, ${YELLOW_DEEP} 8px 16px)` }} />
              </div>
              {skill.category && (
                <span className="text-[9px] mt-2 inline-block" style={{ fontFamily: MONO, color: DIM, letterSpacing: '0.22em' }}>
                  CLASS.{String(skill.category).toUpperCase().replace(/\s+/g, '_')}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Projects — draggable crates with spring return                      */
/* ------------------------------------------------------------------ */
const Projects = ({ data }) => {
  const areaRef = useRef(null);
  return (
  <section id="projects" className="relative py-24 border-t-4" style={{ background: GRAPHITE_2, borderTopColor: 'rgba(255,210,31,0.4)' }}>
    <div className="max-w-6xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}>
        <Plate num="03" label="CRATE.MANIFEST" title="Shipped Projects" />
        <motion.p variants={fadeUp} className="mb-10 inline-flex items-center gap-2 text-[11px] px-3 py-1.5 border"
          style={{ fontFamily: MONO, color: YELLOW, borderColor: 'rgba(255,210,31,0.5)', letterSpacing: '0.22em' }}>
          <span className="pg-live inline-block w-2 h-2 rounded-full" style={{ background: YELLOW }} />
          DRAG A CRATE &mdash; IT SPRINGS BACK
        </motion.p>
        <div ref={areaRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {data.projects.map((project, i) => (
            <motion.article key={i} variants={fadeUp}
              drag
              dragConstraints={areaRef}
              dragElastic={0.22}
              dragSnapToOrigin
              dragMomentum={false}
              whileDrag={{ scale: 1.04, rotate: 1.5, zIndex: 20 }}
              whileHover={{ y: -4 }}
              className="pg-card relative cursor-grab active:cursor-grabbing border"
              style={{ borderColor: 'rgba(231,234,238,0.2)', background: PANEL, boxShadow: '0 10px 26px rgba(0,0,0,0.35)' }}>
              <div aria-hidden className="pg-hazard h-2 w-full" />
              <div className="relative overflow-hidden border-b" style={{ borderColor: 'rgba(231,234,238,0.15)' }}>
                {project.image ? (
                  <img src={project.image} alt={project.title} className="w-full h-40 object-cover" style={{ filter: 'saturate(0.7) contrast(1.05)' }} />
                ) : (
                  <div aria-hidden className="w-full h-40 flex flex-col items-center justify-center gap-3" style={{ background: GRAPHITE }}>
                    <Wrench size={26} style={{ color: YELLOW }} />
                    <span className="text-[9px]" style={{ fontFamily: MONO, color: DIM, letterSpacing: '0.3em' }}>
                      NO.PHOTO.ATTACHED
                    </span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-lg font-extrabold uppercase leading-tight" style={{ color: CHALK }}>{project.title}</h3>
                  <span className="text-[9px] px-2 py-1 border whitespace-nowrap" style={{ fontFamily: MONO, color: YELLOW, borderColor: 'rgba(255,210,31,0.5)' }}>
                    CRATE_{String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                {project.description && (
                  <p className="text-[13px] leading-relaxed mb-4 line-clamp-3" style={{ color: MUTE }}>{project.description}</p>
                )}
                {project.techStack?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.techStack.map((tech, j) => (
                      <span key={j} className="text-[10px] px-2 py-0.5 border" style={{ fontFamily: MONO, color: MUTE, borderColor: 'rgba(231,234,238,0.25)' }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-3 text-[11px] font-bold" style={{ fontFamily: MONO, letterSpacing: '0.12em' }}>
                  {project.liveUrl && project.liveUrl !== '#' && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
                      className="pg-link inline-flex items-center gap-1.5 px-3 py-1.5 border-2" style={{ color: '#151515', background: YELLOW, borderColor: YELLOW }}>
                      <ExternalLink size={12} /> OPEN
                    </a>
                  )}
                  {project.githubUrl && project.githubUrl !== '#' && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
                      className="pg-link inline-flex items-center gap-1.5 px-3 py-1.5 border" style={{ color: CHALK, borderColor: 'rgba(231,234,238,0.3)' }}>
                      <Github size={12} /> SOURCE
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
  );
};

/* ------------------------------------------------------------------ */
/* Experience — assembly line log                                      */
/* ------------------------------------------------------------------ */
const Experience = ({ data }) => (
  <section id="experience" className="relative py-24 border-t-4" style={{ background: GRAPHITE, borderTopColor: 'rgba(255,210,31,0.4)' }}>
    <div className="max-w-4xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <Plate num="04" label="SHIFT.LOG" title="Assembly Line History" />
        <div className="relative border-l-4 pl-8 md:pl-10 space-y-11" style={{ borderColor: YELLOW }}>
          {data.experience.map((exp, i) => (
            <motion.div key={i} variants={fadeUp} className="relative">
              <span aria-hidden className="absolute -left-[25px] md:-left-[29px] top-1 w-4 h-4 rotate-45 border-2"
                style={{ background: GRAPHITE, borderColor: YELLOW }} />
              {exp.period && (
                <span className="text-[10px] inline-block mb-2 px-2.5 py-1 font-bold"
                  style={{ fontFamily: MONO, color: '#151515', background: YELLOW, letterSpacing: '0.18em' }}>
                  SHIFT {exp.period}
                </span>
              )}
              <h3 className="text-xl md:text-2xl font-extrabold uppercase" style={{ color: CHALK }}>{exp.role}</h3>
              {exp.company && (
                <p className="text-sm font-semibold mb-2" style={{ fontFamily: MONO, color: YELLOW }}>
                  @ {exp.company}
                </p>
              )}
              {exp.description && (
                <p className="text-sm leading-relaxed" style={{ color: MUTE }}>{exp.description}</p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Testimonials — inspection reports                                   */
/* ------------------------------------------------------------------ */
const Testimonials = ({ data }) => (
  <section id="testimonials" className="relative py-24 border-t-4" style={{ background: GRAPHITE_2, borderTopColor: 'rgba(255,210,31,0.4)' }}>
    <div className="max-w-6xl mx-auto px-6">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
        <Plate num="05" label="QA.REPORTS" title="Inspection Reports" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {data.testimonials.map((t, i) => (
            <motion.figure key={i} variants={fadeUp} className="pg-card relative border p-6 pt-7"
              style={{ borderColor: 'rgba(231,234,238,0.2)', background: PANEL }}>
              <Rivets />
              <span aria-hidden
                className="absolute top-4 right-10 text-[9px] font-extrabold px-2 py-1 border-2 select-none"
                style={{
                  fontFamily: MONO, color: YELLOW, borderColor: YELLOW, letterSpacing: '0.2em',
                  transform: `rotate(${i % 2 === 0 ? -7 : 6}deg)`, opacity: 0.65,
                }}>
                APPROVED
              </span>
              <Quote size={18} style={{ color: YELLOW }} className="mb-3" />
              <blockquote className="text-sm leading-relaxed mb-5" style={{ color: CHALK }}>
                {t.text}
              </blockquote>
              <figcaption className="flex items-center gap-3 border-t pt-4" style={{ borderColor: 'rgba(231,234,238,0.15)' }}>
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover border-2" style={{ borderColor: YELLOW }} />
                ) : (
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-extrabold border-2"
                    style={{ color: CHALK, borderColor: YELLOW, background: GRAPHITE }}>
                    {initialsOf(t.name)}
                  </div>
                )}
                <div>
                  <div className="text-sm font-bold" style={{ color: CHALK }}>{t.name}</div>
                  {t.role && <div className="text-[10px]" style={{ fontFamily: MONO, color: DIM }}>{t.role}</div>}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Contact — receiving dock                                            */
/* ------------------------------------------------------------------ */
const Contact = ({ data }) => {
  const email = data.personal?.email || data.socials?.email;
  const socials = [
    { key: 'github', url: data.socials?.github, Icon: Github },
    { key: 'linkedin', url: data.socials?.linkedin, Icon: Linkedin },
    { key: 'twitter', url: data.socials?.twitter, Icon: Twitter },
  ].filter(s => s.url);
  return (
    <section id="contact" className="relative py-24 border-t-4" style={{ background: GRAPHITE, borderTopColor: 'rgba(255,210,31,0.4)' }}>
      <div className="max-w-2xl mx-auto px-6 text-center">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
          <Plate num="06" label="DOCK.07" title="Receiving Dock" />
          <motion.p variants={fadeUp} className="mb-10 text-sm leading-relaxed max-w-md mx-auto" style={{ color: MUTE }}>
            Send crates, contracts, or correspondence. All deliveries to the dock are signed for within one business cycle.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center items-center gap-4 mb-10">
            {email && (
              <a href={`mailto:${email}`}
                className="inline-flex items-center gap-2 px-8 py-3.5 font-extrabold uppercase transition-transform hover:-translate-y-0.5"
                style={{ background: YELLOW, color: '#151515', fontFamily: MONO, letterSpacing: '0.16em', fontSize: 13, boxShadow: '0 10px 26px rgba(0,0,0,0.45)' }}>
                <Mail size={16} /> Ship a Message
              </a>
            )}
            {data.personal?.phone && (
              <a href={`tel:${data.personal.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 font-bold uppercase border-2 transition-colors hover:bg-white/5"
                style={{ borderColor: CHALK, color: CHALK, fontFamily: MONO, letterSpacing: '0.14em', fontSize: 12 }}>
                Direct Line
              </a>
            )}
            {socials.map(({ key, url, Icon }) => (
              <a key={key} href={url} target="_blank" rel="noreferrer" aria-label={key}
                className="pg-link inline-flex items-center justify-center w-12 h-12 border-2"
                style={{ borderColor: 'rgba(231,234,238,0.35)', color: CHALK }}>
                <Icon size={18} />
              </a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Main component — hosts the gravity simulation                       */
/* ------------------------------------------------------------------ */
export default function PhysicsEngineGravityDrop() {
  const { portfolioData: data } = usePortfolio();
  const [simState, setSimState] = useState('pending'); /* 'pending' | 'on' | 'off' */
  const areaRef = useRef(null);
  const blockRefs = useRef({});
  const simRef = useRef(null);

  useEffect(() => {
    const area = areaRef.current;
    /* bail gracefully in environments without rAF or real layout (e.g. jsdom) */
    if (typeof window === 'undefined' || typeof requestAnimationFrame === 'undefined' || !area) {
      setSimState('off');
      return undefined;
    }
    /* layout is measured only here — never inside the rAF loop */
    const rect = area.getBoundingClientRect();
    const areaW = rect?.width || 0;
    const areaH = rect?.height || 0;
    if (areaW < 80 || areaH < 160) {
      setSimState('off');
      return undefined;
    }

    const G = 1800;           /* px/s^2 */
    const REST = 0.5;         /* floor restitution */
    const bodies = BODY_ORDER.map((key, i) => {
      const el = blockRefs.current[key];
      const fb = BODY_FALLBACK[key];
      const w = Math.min(el?.offsetWidth || fb.w, areaW * 0.94);
      const h = el?.offsetHeight || fb.h;
      const centered = key === 'name';
      const x = centered
        ? Math.max(0, (areaW - w) / 2 + ((i * 53) % 60) - 30)
        : Math.max(0, Math.min(((i * 137) % 100) / 100 * (areaW - w) + ((i * 53) % 50) - 25, areaW - w));
      return {
        key, w, h, x,
        y: -h - 60 - i * 90,
        vx: ((i * 29) % 80) - 40,
        vy: 0,
        rot: 0,
        el,
      };
    });

    const sim = { areaW, areaH, bodies };
    simRef.current = sim;

    const clampX = (b) => {
      if (b.x < 0) { b.x = 0; b.vx = Math.abs(b.vx) * 0.6; }
      if (b.x > sim.areaW - b.w) { b.x = sim.areaW - b.w; b.vx = -Math.abs(b.vx) * 0.6; }
    };

    let raf = 0;
    let last = performance.now();
    const frame = (t) => {
      const dt = Math.min((t - last) / 1000, 0.033) || 0.016;
      last = t;
      const floor = sim.areaH - 0;
      for (const b of sim.bodies) {
        b.vy += G * dt;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        const floorY = floor - b.h;
        if (b.y > floorY) {
          b.y = floorY;
          b.vy = Math.abs(b.vy) > 60 ? -b.vy * REST : 0;
          b.vx *= 0.9;
        }
        clampX(b);
        /* rotation follows horizontal motion, easing upright at rest */
        const targetRot = Math.max(-12, Math.min(12, b.vx * 0.06));
        b.rot += (targetRot - b.rot) * 0.15;
        if (b.el) {
          b.el.style.transform = `translate3d(${b.x}px, ${b.y}px, 0) rotate(${b.rot}deg)`;
        }
      }
      /* simple pairwise AABB resolution so crates shove each other instead of stacking */
      for (let i = 0; i < sim.bodies.length; i++) {
        for (let j = i + 1; j < sim.bodies.length; j++) {
          const a = sim.bodies[i];
          const b = sim.bodies[j];
          if (a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h) {
            const pushR = a.x + a.w - b.x;   /* push b right */
            const pushL = b.x + b.w - a.x;   /* push a left */
            const pushD = a.y + a.h - b.y;   /* push b down */
            const pushU = b.y + b.h - a.y;   /* push a up */
            if (Math.min(pushR, pushL) < Math.min(pushD, pushU)) {
              if (pushR < pushL) { b.x += pushR / 2; a.x -= pushR / 2; } else { a.x += pushL / 2; b.x -= pushL / 2; }
              const t = a.vx; a.vx = b.vx * 0.9; b.vx = t * 0.9;
            } else {
              if (pushD < pushU) {
                b.y += pushD / 2; a.y -= pushD / 2;
                if (a.vy > 0) a.vy = -a.vy * REST;
                if (b.vy < 0) b.vy = 0;
              } else {
                a.y += pushU / 2; b.y -= pushU / 2;
                if (b.vy > 0) b.vy = -b.vy * REST;
                if (a.vy < 0) a.vy = 0;
              }
            }
            clampX(a);
            clampX(b);
          }
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onResize = () => {
      const r2 = area.getBoundingClientRect();
      if (r2 && r2.width) sim.areaW = r2.width;
      if (r2 && r2.height) sim.areaH = r2.height;
      for (const b of sim.bodies) {
        b.x = Math.max(0, Math.min(b.x, sim.areaW - b.w));
        b.y = Math.min(b.y, sim.areaH - b.h);
      }
    };
    window.addEventListener('resize', onResize);

    setSimState('on');

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      simRef.current = null;
    };
  }, []);

  const drop = () => {
    const sim = simRef.current;
    if (!sim || !sim.bodies) return;
    sim.bodies.forEach((b, i) => {
      b.y = -b.h - 40 - i * 90;
      b.vy = 0;
      b.vx = ((i * 29) % 80) - 40;
      b.rot = 0;
    });
  };

  const name = data.personal?.name || 'My Portfolio';
  const navItems = [
    { label: 'ABOUT', href: '#about', show: Boolean(data.personal?.bio || data.personal?.avatar) },
    { label: 'SKILLS', href: '#skills', show: data.skills?.length > 0 },
    { label: 'CRATES', href: '#projects', show: data.projects?.length > 0 },
    { label: 'LOG', href: '#experience', show: data.experience?.length > 0 },
    { label: 'QA', href: '#testimonials', show: data.testimonials?.length > 0 },
    { label: 'DOCK', href: '#contact', show: true },
  ].filter(item => item.show);

  return (
    <div className="antialiased overflow-x-hidden" style={{ background: GRAPHITE, color: CHALK }}>
      <style>{STYLE_CSS}</style>

      <nav className="fixed top-0 left-0 right-0 z-40 border-b-2" style={{ borderColor: YELLOW, background: 'rgba(28,30,33,0.92)', backdropFilter: 'blur(6px)' }}>
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <a href="#hero" className="text-xs font-extrabold whitespace-nowrap uppercase" style={{ fontFamily: MONO, letterSpacing: '0.18em', color: CHALK }}>
            {name}<span style={{ color: YELLOW }}>_.LAB</span>
          </a>
          <div className="hidden md:flex gap-5">
            {navItems.map(item => (
              <a key={item.href} href={item.href} className="pg-link text-[11px] font-bold px-1.5 py-0.5 whitespace-nowrap"
                style={{ fontFamily: MONO, color: MUTE, letterSpacing: '0.16em' }}>
                [{item.label}]
              </a>
            ))}
          </div>
          <a href="#contact" className="md:hidden text-[11px] font-bold" style={{ fontFamily: MONO, color: YELLOW, letterSpacing: '0.16em' }}>
            [DOCK]
          </a>
        </div>
      </nav>

      <Hero data={data} simState={simState} onDrop={drop} blockRefs={blockRefs} areaRef={areaRef} />
      {(data.personal?.bio || data.personal?.avatar) && <About data={data} />}
      {data.skills?.length > 0 && <Skills data={data} />}
      {data.projects?.length > 0 && <Projects data={data} />}
      {data.experience?.length > 0 && <Experience data={data} />}
      {data.testimonials?.length > 0 && <Testimonials data={data} />}
      <Contact data={data} />

      <footer style={{ background: GRAPHITE }}>
        <div aria-hidden className="pg-hazard h-3 w-full" />
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-[10px]" style={{ fontFamily: MONO, color: MUTE, letterSpacing: '0.2em' }}>
            &copy; {new Date().getFullYear()} {name}
          </p>
          <p className="text-[10px]" style={{ fontFamily: MONO, color: DIM, letterSpacing: '0.2em' }}>
            GRAVITY.LAB &mdash; ALL CRATES CERTIFIED
          </p>
        </div>
      </footer>
    </div>
  );
}
