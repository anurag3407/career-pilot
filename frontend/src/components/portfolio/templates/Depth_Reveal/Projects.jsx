import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

const Projects = ({ projects = [] }) => (
  <section className="relative max-w-6xl mx-auto py-10 sm:py-12 md:py-20 px-4 md:px-6 overflow-hidden">
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08),transparent_50%)]"
    />
    <motion.h2
      initial={{ opacity: 0, y: 26, rotateX: 18 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.75 }}
      className="relative text-3xl md:text-4xl font-bold mb-5 md:mb-12 text-center"
      style={{ transformPerspective: 900 }}
    >
      Projects
    </motion.h2>
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.2 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } } }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 relative"
    >
      {projects.map((proj, i) => (
        <motion.div
          key={`${proj.title}-${proj.liveUrl || proj.githubUrl || proj.description}`}
          variants={{ hidden: { opacity: 0, y: 48, scale: 0.86, rotateX: 18 }, show: { opacity: 1, y: 0, scale: 1, rotateX: 0 } }}
          whileHover={{ y: -10, scale: 1.02, rotateZ: i % 2 === 0 ? -0.5 : 0.5 }}
          transition={{ duration: 0.35 }}
          className="bg-slate-900 p-4 md:p-6 rounded-2xl border border-slate-800 hover:border-cyan-500 transition-colors shadow-[0_12px_40px_rgba(0,0,0,0.2)]"
          style={{ transformPerspective: 900, transformStyle: 'preserve-3d' }}
        >
          <div className="flex items-center justify-between mb-3 md:mb-4 gap-3">
            <span className="text-[10px] md:text-xs font-semibold tracking-wider uppercase text-cyan-300">Case Study {i + 1}</span>
            <span className="text-[10px] md:text-xs text-slate-500">Featured Build</span>
          </div>
          <img src={proj.image} alt={proj.title} className="w-full h-28 md:h-40 object-cover rounded-lg mb-3 md:mb-4" />
          <h3 className="text-lg md:text-xl font-bold mb-2">{proj.title}</h3>
          <p className="text-slate-400 text-sm mb-3 md:mb-4 line-clamp-3 md:line-clamp-4">{proj.description}</p>

          <div className="flex flex-wrap gap-2 mb-4 md:mb-5">
            {proj.techStack?.slice(0, 4).map((tech) => (
              <span key={`${proj.title}-${tech}`} className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-200">
                {tech}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm border-t border-slate-800 pt-3 md:pt-4">
            {proj.liveUrl && (
              <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-indigo-300 hover:text-cyan-300 transition-colors">
                <ExternalLink size={15} />
                <span>Live Demo</span>
              </a>
            )}
            {proj.githubUrl && (
              <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-indigo-300 hover:text-cyan-300 transition-colors">
                <Github size={15} />
                <span>Source</span>
              </a>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  </section>
);

export default Projects;
