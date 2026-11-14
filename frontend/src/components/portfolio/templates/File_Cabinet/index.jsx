import { usePortfolio } from "../../../../context/PortfolioContext";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail, Github, Linkedin, Twitter, MapPin, ExternalLink, Folder, FileText, Briefcase, Contact
} from 'lucide-react';

/**
 * File Cabinet Portfolio Template
 * Category: Unique / Creative
 * Description: Physical file cabinet UI with metal drawer pulls, click drawers to slide open revealing tabbed project folders inside. Office skeuomorphic design.
 */

const INK = '#3e3a32';
const INK_SOFT = 'rgba(62,58,50,0.65)';
const PAPER = '#faf6ea';
const FOLDER_TINTS = ['#e8d5a3', '#b7cdbb', '#b6c4d6', '#d6b7a8', '#d9ca8f'];
const METAL_FRONT = 'linear-gradient(180deg, #dbd6c8 0%, #c9c3b4 45%, #b5afa0 100%)';
const METAL_EDGE = '#8f897b';
const INTERIOR = 'linear-gradient(180deg, #45403666, #35312a66), linear-gradient(180deg, #4a453b, #3a362e)';

const drawerEase = [0.45, 0, 0.2, 1];

// metal screw
const Screw = ({ className = '' }) => (
  <span aria-hidden className={`absolute w-2.5 h-2.5 rounded-full ${className}`}
    style={{
      background: 'radial-gradient(circle at 35% 30%, #e8e2d4, #9a9486 60%, #6f6a5e)',
      boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.7), inset 0 -1px 2px rgba(0,0,0,0.4)',
    }} />
);

// recessed brass label card engraved with text
const LabelCard = ({ children }) => (
  <div className="px-6 py-2 rounded-sm border"
    style={{
      background: 'linear-gradient(180deg, #efe9d8, #ddd5bd)',
      borderColor: 'rgba(120,110,90,0.55)',
      boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.28), 0 1px 0 rgba(255,255,255,0.55)',
    }}>
    <span className="text-[11px] md:text-xs font-bold uppercase tracking-[0.3em] text-center block"
      style={{ color: '#5c5443', textShadow: '0 1px 0 rgba(255,255,255,0.6)' }}>
      {children}
    </span>
  </div>
);

// cup pull handle
const Pull = () => (
  <div className="mx-auto mt-3 w-28 h-4 rounded-b-xl rounded-t-sm relative"
    style={{
      background: 'linear-gradient(180deg, #b8b1a0, #87816f 55%, #a49d8b)',
      boxShadow: 'inset 0 2px 3px rgba(255,255,255,0.45), inset 0 -2px 3px rgba(0,0,0,0.45), 0 3px 5px rgba(0,0,0,0.35)',
    }}>
    <span aria-hidden className="absolute inset-x-6 top-0.5 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.35)' }} />
  </div>
);

// One filing drawer. Front is a button; content slides open beneath it.
function Drawer({ id, label, hint, open, onToggle, children }) {
  return (
    <section id={id} className="relative px-4 sm:px-8">
      <motion.button
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`${id}-drawer-body`}
        whileTap={{ scale: 0.995 }}
        className="w-full relative rounded-md px-6 py-5 text-left cursor-pointer block"
        style={{
          background: open
            ? 'linear-gradient(180deg, #cfc9ba 0%, #c0b9a8 100%)'
            : METAL_FRONT,
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -3px 6px rgba(0,0,0,0.28), 0 6px 16px rgba(0,0,0,0.22), 0 1px 0 ${METAL_EDGE}`,
          border: `1px solid ${METAL_EDGE}`,
        }}>
        <Screw className="top-2 left-2" />
        <Screw className="top-2 right-2" />
        <Screw className="bottom-2 left-2" />
        <Screw className="bottom-2 right-2" />
        <div className="text-center" style={{ paddingLeft: 14, paddingRight: 14 }}>
          <LabelCard>{label}</LabelCard>
          <Pull />
          <span className="block mt-2 text-[9px] uppercase tracking-[0.3em]" style={{ color: '#7a7364' }}>
            {open ? 'release to close' : 'pull to open'}
          </span>
        </div>
      </motion.button>

      {/* drawer interior */}
      <motion.div
        id={`${id}-drawer-body`}
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ height: { duration: 0.55, ease: drawerEase }, opacity: { duration: 0.35, delay: open ? 0.12 : 0 } }}
        className="overflow-hidden"
        style={{ background: INTERIOR, borderRadius: '0 0 8px 8px', border: `1px solid #2e2b25`, borderTop: 'none', boxShadow: 'inset 0 8px 18px rgba(0,0,0,0.45)' }}>
        <motion.div
          initial={false}
          animate={{ y: open ? 0 : -24 }}
          transition={{ duration: 0.5, ease: drawerEase }}
          className="p-5 sm:p-7">
          {hint && (
            <p className="text-[10px] uppercase tracking-[0.3em] mb-5 text-center" style={{ color: 'rgba(235,225,200,0.45)' }}>
              {hint}
            </p>
          )}
          {children}
        </motion.div>
      </motion.div>
    </section>
  );
}

// hanging project folder with a tab
function ProjectFolder({ project, tint, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.12 + index * 0.09, ease: drawerEase }}
      className="relative rounded-lg"
      style={{ background: tint, boxShadow: '0 4px 10px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.4)' }}>
      {/* folder tab */}
      <div className="absolute -top-4 left-4 px-4 py-1 rounded-t-md max-w-[75%]"
        style={{ background: tint, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.45)' }}>
        <span className="block text-[10px] font-bold uppercase tracking-widest truncate" style={{ color: '#4c4638' }}>
          {project.title || `Project ${index + 1}`}
        </span>
      </div>
      <div className="pt-6 px-4 pb-4">
        <div className="rounded-sm p-4" style={{ background: PAPER, boxShadow: 'inset 0 0 0 1px rgba(120,110,90,0.25)' }}>
          <h3 className="text-base font-bold mb-1.5" style={{ color: INK }}>{project.title || `Project ${index + 1}`}</h3>
          {project.description && (
            <p className="text-xs leading-relaxed mb-3" style={{ color: INK_SOFT }}>{project.description}</p>
          )}
          {project.techStack?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {project.techStack.slice(0, 6).map((tech, j) => (
                <span key={j} className="text-[10px] px-2 py-0.5 rounded-sm border" style={{ borderColor: 'rgba(62,58,50,0.3)', color: INK, background: 'rgba(232,213,163,0.4)' }}>
                  {tech}
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-4 text-[11px] font-bold">
            {project.liveUrl && project.liveUrl !== '#' && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline underline-offset-2" style={{ color: '#7a5c22' }}>
                <ExternalLink size={12} /> Live file
              </a>
            )}
            {project.githubUrl && project.githubUrl !== '#' && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline underline-offset-2" style={{ color: INK_SOFT }}>
                <Github size={12} /> Repository
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// typewritten document sheet (experience)
function Document({ exp, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: index % 2 ? 0.6 : -0.6 }}
      animate={{ opacity: 1, y: 0, rotate: index % 2 ? 0.5 : -0.5 }}
      transition={{ duration: 0.45, delay: 0.1 + index * 0.08, ease: drawerEase }}
      className="relative rounded-sm px-5 py-4"
      style={{ background: PAPER, boxShadow: '0 3px 8px rgba(0,0,0,0.4)' }}>
      <span aria-hidden className="absolute top-3 bottom-3 left-9 w-px" style={{ background: 'rgba(180,70,60,0.35)' }} />
      <span aria-hidden className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
        style={{ background: 'radial-gradient(circle at 35% 30%, #d9d2c0, #8a8474)', boxShadow: '0 2px 4px rgba(0,0,0,0.4)' }} />
      <div className="pl-6">
        {exp.period && (
          <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: '#8a6b3a' }}>{exp.period}</span>
        )}
        <h3 className="text-base font-bold mt-0.5" style={{ color: INK }}>{exp.role || 'Role'}</h3>
        {exp.company && <p className="text-xs font-semibold mb-1.5" style={{ color: '#7a5c22' }}>{exp.company}</p>}
        {exp.description && <p className="text-xs leading-relaxed font-mono" style={{ color: INK_SOFT }}>{exp.description}</p>}
      </div>
    </motion.div>
  );
}

export default function FileCabinet() {
  const { portfolioData: data } = usePortfolio();
  const name = data.personal?.name || 'My Portfolio';
  const [open, setOpen] = useState(null);
  const toggle = (id) => setOpen((prev) => (prev === id ? null : id));

  const drawers = [
    { id: 'about', label: 'Personnel File', show: Boolean(data.personal?.bio || data.personal?.avatar) },
    { id: 'skills', label: 'Skill Index', show: data.skills?.length > 0 },
    { id: 'projects', label: 'Active Projects', show: data.projects?.length > 0 },
    { id: 'experience', label: 'Work History', show: data.experience?.length > 0 },
    { id: 'testimonials', label: 'Correspondence', show: data.testimonials?.length > 0 },
  ].filter((d) => d.show);

  return (
    <div className="antialiased overflow-x-hidden font-sans" style={{ background: 'linear-gradient(180deg, #e7e0d1 0%, #d8d0be 60%, #cfc7b4 100%)', color: INK }}>
      {/* HERO — office wall with cabinet top */}
      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 py-24"
        style={{ background: 'linear-gradient(180deg, #ece5d6 0%, #e3dbc9 55%, #d6cdbc 100%)' }}>
        {/* wall texture + baseboard */}
        <div aria-hidden className="absolute inset-0 pointer-events-none"
          style={{ background: 'repeating-linear-gradient(0deg, rgba(120,110,90,0.035) 0 2px, transparent 2px 6px)' }} />
        <div aria-hidden className="absolute bottom-0 inset-x-0 h-10" style={{ background: 'linear-gradient(180deg, #b3ab99, #9a9280)', borderTop: '1px solid rgba(90,84,70,0.5)' }} />

        <motion.div initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
          className="relative z-10 w-full max-w-xl">
          {/* cabinet top plate */}
          <motion.div variants={{ hidden: { opacity: 0, y: -16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
            className="rounded-t-lg px-6 py-5 text-center"
            style={{
              background: 'linear-gradient(180deg, #e2dccb, #cdc6b4)',
              border: `1px solid ${METAL_EDGE}`, borderBottom: 'none',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.65), 0 -4px 14px rgba(0,0,0,0.12)',
            }}>
            <div className="mx-auto inline-block px-7 py-3 rounded-sm"
              style={{
                background: 'linear-gradient(135deg, #d7b868 0%, #a9822e 55%, #c9a24b 100%)',
                boxShadow: 'inset 0 1px 0 rgba(255,235,180,0.8), inset 0 -2px 4px rgba(70,50,10,0.5), 0 3px 8px rgba(0,0,0,0.3)',
                border: '1px solid #8a6b2a',
              }}>
              <h1 className="text-2xl md:text-3xl font-bold tracking-wide" style={{ color: '#3d2f12', textShadow: '0 1px 0 rgba(255,225,160,0.5)' }}>
                {name}
              </h1>
              {data.personal?.title && (
                <p className="text-[11px] uppercase tracking-[0.3em] mt-1" style={{ color: '#5c4a20' }}>{data.personal.title}</p>
              )}
            </div>
            {data.personal?.tagline && (
              <p className="text-xs md:text-sm mt-4 max-w-sm mx-auto" style={{ color: INK_SOFT }}>{data.personal.tagline}</p>
            )}
            {data.personal?.location && (
              <p className="inline-flex items-center gap-1.5 text-[11px] mt-3 uppercase tracking-widest" style={{ color: INK_SOFT }}>
                <MapPin size={12} /> {data.personal.location}
              </p>
            )}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <a href="#projects" className="px-5 py-2.5 rounded text-xs font-bold uppercase tracking-widest transition-transform hover:-translate-y-0.5"
                style={{ background: '#3e3a32', color: '#efe8d5', boxShadow: '0 3px 8px rgba(0,0,0,0.3)' }}>
                Browse files
              </a>
              <a href="#about" className="px-5 py-2.5 rounded text-xs font-bold uppercase tracking-widest border-2 transition-transform hover:-translate-y-0.5"
                style={{ borderColor: INK, color: INK }}>
                Personnel
              </a>
              <a href="#contact" className="px-5 py-2.5 rounded text-xs font-bold uppercase tracking-widest border-2 transition-transform hover:-translate-y-0.5"
                style={{ borderColor: '#8a6b2a', color: '#6b5423' }}>
                Out tray
              </a>
            </div>
            <p className="text-[10px] mt-6 uppercase tracking-[0.3em]" style={{ color: '#8a8272' }}>
              Click a drawer to open the cabinet
            </p>
          </motion.div>

          {/* drawer stack preview (first section directly below hero) */}
          {drawers.slice(0, 1).map((d) => (
            <motion.div key={d.id} variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.25 } } }}>
              <div className="h-3 rounded-t-md" style={{ background: 'linear-gradient(180deg, #9a9280, #847d6c)', border: `1px solid ${METAL_EDGE}`, borderBottom: 'none' }} />
              <Drawer id={d.id} label={d.label} open={open === d.id} onToggle={() => toggle(d.id)}>
                {open === 'about' && (
                  <div className="grid sm:grid-cols-[auto_1fr] gap-5 items-start">
                    {data.personal?.avatar ? (
                      <div className="mx-auto p-1.5 rounded-sm rotate-2" style={{ background: PAPER, boxShadow: '0 3px 8px rgba(0,0,0,0.4)' }}>
                        <img src={data.personal.avatar} alt={name} className="w-36 h-40 object-cover" />
                        <p className="text-center text-[9px] mt-1.5 font-mono" style={{ color: INK_SOFT }}>FIG. 1 — EMPLOYEE</p>
                      </div>
                    ) : (
                      <div className="mx-auto p-1.5 rounded-sm rotate-2 w-36" style={{ background: PAPER, boxShadow: '0 3px 8px rgba(0,0,0,0.4)' }}>
                        <div className="w-full h-40 flex flex-col items-center justify-center gap-2" style={{ background: 'repeating-linear-gradient(45deg, rgba(120,110,90,0.08) 0 8px, transparent 8px 16px), #efe9d8' }}>
                          <span className="text-4xl font-bold" style={{ color: '#7a5c22' }}>{(name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('') || 'A')}</span>
                          <span className="text-[8px] uppercase tracking-[0.3em]" style={{ color: INK_SOFT }}>photo pending</span>
                        </div>
                        <p className="text-center text-[9px] mt-1.5 font-mono" style={{ color: INK_SOFT }}>FIG. 1 — EMPLOYEE</p>
                      </div>
                    )}
                    <div className="rounded-sm p-5" style={{ background: '#f3ecd8', boxShadow: 'inset 0 0 0 1px rgba(120,110,90,0.25)' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <FileText size={14} style={{ color: '#7a5c22' }} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: '#7a5c22' }}>Biography — Form B-12</span>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: INK }}>
                        {data.personal?.bio || 'This form has not been filled in yet. The employee file is awaiting its first entry.'}
                      </p>
                    </div>
                  </div>
                )}
              </Drawer>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* remaining drawers */}
      <div className="relative z-10 max-w-xl mx-auto px-6 space-y-0">
        <p className="sr-only">Portfolio filing cabinet</p>
        {drawers.slice(1).map((d, i) => (
          <div key={d.id}>
            <div className="h-3" style={{ background: 'linear-gradient(180deg, #9a9280, #847d6c)', border: `1px solid ${METAL_EDGE}`, borderBottom: 'none' }} />
            <Drawer id={d.id} label={d.label} open={open === d.id} onToggle={() => toggle(d.id)}>
              {open === d.id && d.id === 'skills' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {data.skills.map((skill, j) => (
                    <motion.div key={j}
                      initial={{ opacity: 0, y: 18, rotate: (j % 2 ? 1 : -1) * 0.8 }}
                      animate={{ opacity: 1, y: 0, rotate: (j % 2 ? 1 : -1) * 0.8 }}
                      transition={{ duration: 0.4, delay: 0.08 + j * 0.05, ease: drawerEase }}
                      className="rounded-sm p-3"
                      style={{
                        background: PAPER,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.35)',
                        backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 22px, rgba(140,150,170,0.35) 22px 23px)',
                      }}>
                      <div className="text-sm font-bold leading-tight" style={{ color: INK }}>{skill.name || 'Skill'}</div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-[9px] uppercase tracking-widest italic" style={{ color: INK_SOFT }}>{skill.category || 'Core'}</span>
                        <span className="text-xs font-bold px-1.5 rounded-sm" style={{ background: FOLDER_TINTS[j % FOLDER_TINTS.length], color: '#4c4638' }}>
                          {Number(skill.level) || 85}%
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              {open === d.id && d.id === 'projects' && (
                <div className="grid sm:grid-cols-2 gap-x-5 gap-y-8 pt-4">
                  {data.projects.slice(0, 8).map((project, j) => (
                    <ProjectFolder key={j} project={project} tint={FOLDER_TINTS[j % FOLDER_TINTS.length]} index={j} />
                  ))}
                </div>
              )}
              {open === d.id && d.id === 'experience' && (
                <div className="space-y-6 pt-4">
                  {data.experience.map((exp, j) => <Document key={j} exp={exp} index={j} />)}
                </div>
              )}
              {open === d.id && d.id === 'testimonials' && (
                <div className="grid sm:grid-cols-2 gap-5 pt-4">
                  {data.testimonials.map((t, j) => (
                    <motion.div key={j}
                      initial={{ opacity: 0, y: 20, rotate: (j % 2 ? -1 : 1) }}
                      animate={{ opacity: 1, y: 0, rotate: (j % 2 ? -1 : 1) }}
                      transition={{ duration: 0.45, delay: 0.08 + j * 0.07, ease: drawerEase }}
                      className="relative rounded-sm p-5 pt-6"
                      style={{ background: j % 2 ? '#f3ecd8' : PAPER, boxShadow: '0 3px 8px rgba(0,0,0,0.4)' }}>
                      <span aria-hidden className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full"
                        style={{ background: 'radial-gradient(circle at 35% 30%, #e2574d, #93312b)', boxShadow: '0 2px 4px rgba(0,0,0,0.4)' }} />
                      <p className="text-xs italic leading-relaxed mb-4" style={{ color: INK }}>&ldquo;{t.text}&rdquo;</p>
                      <div className="flex items-center gap-2.5">
                        {t.avatar ? (
                          <img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-full object-cover border" style={{ borderColor: 'rgba(120,110,90,0.4)' }} />
                        ) : (
                          <span className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold"
                            style={{ background: FOLDER_TINTS[j % FOLDER_TINTS.length], color: '#4c4638' }}>
                            {(t.name || 'A').trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
                          </span>
                        )}
                        <span>
                          <span className="block text-xs font-bold" style={{ color: INK }}>{t.name || 'Anonymous'}</span>
                          {t.role && <span className="block text-[10px]" style={{ color: INK_SOFT }}>{t.role}</span>}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Drawer>
          </div>
        ))}
        {/* cabinet base */}
        <div className="h-4 rounded-b-md" style={{ background: 'linear-gradient(180deg, #847d6c, #6f6857)', border: `1px solid ${METAL_EDGE}`, borderTop: 'none', boxShadow: '0 8px 16px rgba(0,0,0,0.25)' }} />
        <div className="flex justify-between px-10">
          <div className="w-8 h-5" style={{ background: '#5d5647', borderRadius: '0 0 4px 4px' }} />
          <div className="w-8 h-5" style={{ background: '#5d5647', borderRadius: '0 0 4px 4px' }} />
        </div>
      </div>

      {/* CONTACT — the out tray */}
      <section id="contact" className="relative py-24 px-6 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #d6cdbc 0%, #e7e0d1 100%)' }}>
        <div className="max-w-xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }} className="text-center">
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
              className="relative inline-block rounded-lg px-8 pt-8 pb-7 w-full"
              style={{ background: 'linear-gradient(180deg, #9a9280, #847d6c)', boxShadow: '0 10px 24px rgba(0,0,0,0.3)', border: `1px solid ${METAL_EDGE}` }}>
              <span className="absolute -top-4 left-6 px-4 py-1 rounded-t-md text-[10px] font-bold uppercase tracking-[0.3em]"
                style={{ background: '#b3ab99', color: '#4c4638', border: `1px solid ${METAL_EDGE}`, borderBottom: 'none' }}>
                Out Tray
              </span>
              <div className="rounded-md p-6" style={{ background: PAPER, boxShadow: 'inset 0 0 0 1px rgba(120,110,90,0.3)' }}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Contact size={16} style={{ color: '#7a5c22' }} />
                  <h2 className="text-xl font-bold" style={{ color: INK }}>Mail for {name}</h2>
                </div>
                <p className="text-xs mb-5" style={{ color: INK_SOFT }}>Drop a note in the tray — replies within one business day.</p>
                <div className="flex flex-wrap justify-center items-center gap-3">
                  {(data.personal?.email || data.socials?.email) && (
                    <a href={`mailto:${data.personal?.email || data.socials?.email}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded text-xs font-bold uppercase tracking-widest transition-transform hover:-translate-y-0.5"
                      style={{ background: '#3e3a32', color: '#efe8d5', boxShadow: '0 3px 8px rgba(0,0,0,0.3)' }}>
                      <Mail size={14} /> Send mail
                    </a>
                  )}
                  {['github', 'linkedin', 'twitter'].map((key) => {
                    const url = data.socials?.[key];
                    if (!url) return null;
                    const Icon = key === 'github' ? Github : key === 'linkedin' ? Linkedin : Twitter;
                    return (
                      <a key={key} href={url} target="_blank" rel="noreferrer" aria-label={key}
                        className="inline-flex items-center justify-center w-11 h-11 rounded-full border-2 transition-transform hover:-translate-y-0.5"
                        style={{ borderColor: INK, color: INK, background: '#efe9d8' }}>
                        <Icon size={17} />
                      </a>
                    );
                  })}
                </div>
                {(data.personal?.phone || data.personal?.location) && (
                  <p className="text-[11px] mt-5 font-mono" style={{ color: INK_SOFT }}>
                    {[data.personal?.phone, data.personal?.location].filter(Boolean).join('  |  ')}
                  </p>
                )}
              </div>
              <div className="flex justify-center mt-4 gap-1.5">
                <Briefcase size={13} style={{ color: 'rgba(235,225,200,0.5)' }} />
                <Folder size={13} style={{ color: 'rgba(235,225,200,0.5)' }} />
                <FileText size={13} style={{ color: 'rgba(235,225,200,0.5)' }} />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <footer className="py-6 text-center" style={{ background: '#3e3a32', color: 'rgba(239,232,213,0.6)' }}>
        <p className="text-[11px] uppercase tracking-[0.25em]">
          &copy; {new Date().getFullYear()} {name} &middot; File Cabinet
        </p>
      </footer>
    </div>
  );
}
