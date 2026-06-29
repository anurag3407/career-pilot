import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Folder } from 'lucide-react';

export default function Projects({ projects }) {
  if (!projects || projects.length === 0) return null;

  return (
    <section id="projects" className="relative w-full overflow-hidden bg-[#050816] py-24 px-6 sm:px-8 lg:px-12 text-white">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:84px_84px] opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(56,189,248,0.15),transparent_50%)] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.34em] text-sky-100/90 backdrop-blur-md mb-6">
            <Folder size={14} className="text-sky-300" />
            Portfolio
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-400 to-teal-300">Projects</span>
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden hover:border-sky-400/30 transition-all flex flex-col"
            >
              <div className="relative h-64 overflow-hidden border-b border-white/10">
                <div className="absolute inset-0 bg-sky-500/20 group-hover:bg-transparent transition-colors z-10" />
                {project.image ? (
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-[#050816] flex items-center justify-center">
                    <Folder size={48} className="text-slate-700" />
                  </div>
                )}
              </div>
              
              <div className="p-8 flex-grow flex flex-col">
                <h3 className="text-2xl font-bold text-white mb-3">{project.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 flex-grow">
                  {project.description}
                </p>
                
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="text-[10px] uppercase tracking-wider text-sky-300 border border-sky-400/20 rounded-full px-2 py-1 bg-sky-400/5">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center gap-4 mt-auto">
                  {project.link && (
                    <a 
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-semibold text-white hover:text-sky-300 transition-colors"
                    >
                      <ExternalLink size={16} /> Live Demo
                    </a>
                  )}
                  {project.github && (
                    <a 
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                    >
                      <Github size={16} /> Source
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
