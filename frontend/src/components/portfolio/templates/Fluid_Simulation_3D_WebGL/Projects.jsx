import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Code } from 'lucide-react';

export default function Projects({ data }) {
  const projects = data?.projects || [];

  // Trigger fluid burst on hovering a card
  const handleCardHover = (e) => {
    window.dispatchEvent(new CustomEvent('fluid-burst', {
      detail: {
        x: e.clientX,
        y: e.clientY,
        count: 10,
        color: '#6366f1' // purple/indigo stream
      }
    }));
  };

  return (
    <section id="projects-section" className="relative py-28 px-6 md:px-12 bg-slate-950/10 overflow-hidden text-white">
      <div className="max-w-6xl mx-auto relative z-10 space-y-16">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent uppercase tracking-wider"
          >
            Project Vortices
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-slate-400 text-sm md:text-base leading-relaxed"
          >
            A curated vortex of completed software projects. Hovering over a card creates a gravitational pull on floating background particles.
          </motion.p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => {
            const title = project.title || 'Untitled Project';
            const description = project.description || '';
            const techStack = project.techStack || project.technologies || [];
            const liveUrl = project.liveUrl || '#';
            const githubUrl = project.githubUrl || '#';
            const image = project.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop';

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseMove={handleCardHover}
                className="group relative bg-slate-900/30 hover:bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 flex flex-col h-[440px]"
              >
                {/* Flow Gradient Border Swirl (on Hover) */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 p-[1px] rounded-2xl" />

                {/* Project Image */}
                <div className="h-44 w-full relative overflow-hidden bg-slate-950">
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="text-lg md:text-xl font-bold text-slate-100 group-hover:text-white transition duration-200">
                      {title}
                    </h3>
                    
                    <p className="text-slate-400 text-xs md:text-sm leading-relaxed line-clamp-3">
                      {description}
                    </p>
                  </div>

                  {/* Tech stack & links */}
                  <div className="space-y-4 pt-4">
                    {/* Tech list */}
                    <div className="flex flex-wrap gap-1.5 max-h-12 overflow-hidden">
                      {techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-semibold tracking-wide uppercase"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Action Links */}
                    <div className="flex items-center gap-4 pt-2 border-t border-slate-800/50">
                      {githubUrl && githubUrl !== '#' && (
                        <a
                          href={githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
                        >
                          <Github className="w-4 h-4" />
                          <span>Codebase</span>
                        </a>
                      )}
                      
                      {liveUrl && liveUrl !== '#' && (
                        <a
                          href={liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-bold transition ml-auto"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
