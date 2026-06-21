import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

const F = {
  bg:       '#faf9f7',
  surface:  '#f2efe9',
  dark:     '#0a0a0a',
  charcoal: '#1a1a1a',
  muted:    '#6b6b6b',
  subtle:   '#b0b0b0',
  gold:     '#c9a84c',
  goldLight:'#e8c96e',
  cream:    '#f7f3ed',
  border:   '#e0dbd4',
};

function FeaturedCard({ project }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article ref={ref}
      initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65 }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      className="col-span-1 md:col-span-2 grid md:grid-cols-2 overflow-hidden"
      style={{ border: `1px solid ${F.border}` }}>

      <div className="relative overflow-hidden" style={{ height: '360px' }}>
        <motion.img src={project.image} alt={project.title}
          animate={{ scale: hovered ? 1.04 : 1 }} transition={{ duration: 0.5 }}
          className="w-full h-full object-cover"
          style={{ filter: 'contrast(1.05) saturate(0.85)' }} />
        <div className="absolute inset-0" style={{ background: hovered ? 'rgba(10,10,10,0.2)' : 'transparent', transition: 'background 0.3s' }} />
        <div className="absolute top-5 left-5 text-xs font-black uppercase tracking-widest px-3 py-1.5"
          style={{ background: F.dark, color: F.gold }}>
          Featured
        </div>
      </div>

      <div className="flex flex-col justify-between p-8 md:p-10" style={{ background: F.dark }}>
        <div>
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1.5 h-1.5" style={{ background: F.gold }} />
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: F.muted }}>Case Study 01</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-black tracking-tight leading-tight mb-4" style={{ color: '#fff' }}>
            {project.title}
          </h3>
          <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-8">
            {project.techStack.map(tech => (
              <span key={tech} className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1"
                style={{ border: `1px solid rgba(201,168,76,0.4)`, color: F.goldLight }}>
                {tech}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <motion.a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
            whileHover={{ backgroundColor: F.gold, color: F.dark }} transition={{ duration: 0.2 }}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest"
            style={{ border: `1px solid ${F.gold}`, color: F.gold }}>
            <ExternalLink size={11} /> Live
          </motion.a>
          <motion.a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
            whileHover={{ backgroundColor: '#fff', color: F.dark }} transition={{ duration: 0.2 }}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-widest"
            style={{ border: '1px solid rgba(255,255,255,0.2)', color: '#fff' }}>
            <Github size={11} /> Code
          </motion.a>
        </div>
      </div>
    </motion.article>
  );
}

function ProjectCard({ project, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article ref={ref}
      initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      className="flex flex-col overflow-hidden"
      style={{ border: `1px solid ${F.border}`, background: F.bg }}>

      <div className="relative overflow-hidden" style={{ height: '220px' }}>
        <motion.img src={project.image} alt={project.title}
          animate={{ scale: hovered ? 1.05 : 1 }} transition={{ duration: 0.5 }}
          className="w-full h-full object-cover"
          style={{ filter: 'contrast(1.04) saturate(0.82)' }} />
        <div className="absolute inset-0" style={{ background: hovered ? 'rgba(201,168,76,0.1)' : 'transparent', transition: 'background 0.3s' }} />
        <div className="absolute top-4 left-4 text-xs font-black uppercase tracking-widest px-2.5 py-1"
          style={{ background: F.cream, color: F.charcoal, border: `1px solid ${F.border}` }}>
          {String(index + 2).padStart(2, '0')}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-lg font-black tracking-tight mb-2" style={{ color: F.charcoal }}>{project.title}</h3>
        <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: F.muted }}>
          {project.description.slice(0, 100)}…
        </p>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.techStack.slice(0, 3).map(tech => (
            <span key={tech} className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5"
              style={{ border: `1px solid ${F.border}`, color: F.muted }}>
              {tech}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-4" style={{ borderTop: `1px solid ${F.border}` }}>
          <div className="flex gap-3">
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest" style={{ color: F.gold }}>
              <ExternalLink size={10} /> Live
            </a>
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest" style={{ color: F.muted }}>
              <Github size={10} /> Code
            </a>
          </div>
          <motion.div animate={{ x: hovered ? 3 : 0 }} transition={{ duration: 0.2 }}>
            <ArrowUpRight size={14} style={{ color: hovered ? F.gold : F.subtle }} />
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
}

export default function Projects() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [featured, ...rest] = data.projects;

  return (
    <section ref={sectionRef} style={{ background: F.bg, fontFamily: "'Inter', sans-serif" }}>

      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        className="flex items-center justify-between px-5 md:px-16 py-5"
        style={{ borderBottom: `1px solid ${F.border}` }}>
        <div className="flex items-center gap-3">
          <span className="w-2 h-2" style={{ background: F.gold }} />
          <span className="text-xs font-black uppercase tracking-widest" style={{ color: F.muted }}>Projects</span>
        </div>
        <span className="text-xs uppercase tracking-widest" style={{ color: F.subtle }}>§ 03</span>
      </motion.div>

      <div className="px-5 md:px-16 py-8 md:py-10" style={{ borderBottom: `1px solid ${F.border}` }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-black tracking-tight"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: F.charcoal, lineHeight: 1.1 }}>
          Selected
          <span className="italic ml-3"
            style={{ background: `linear-gradient(135deg, ${F.gold}, ${F.goldLight})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Work
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.25 }}
          className="text-sm mt-3 max-w-md" style={{ color: F.muted }}>
          {data.stats.projectsCompleted}+ projects shipped — a curated selection of the work I'm most proud of.
        </motion.p>
      </div>

      <div className="px-5 md:px-16 py-8 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeaturedCard project={featured} />
          {rest.map((p, i) => (
            <ProjectCard key={p.title} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
