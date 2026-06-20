// frontend/src/components/portfolio/templates/Elevator_Pitch/Projects.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';

export const Projects = ({ projects }) => {
  return (
    <div className="space-y-8 md:space-y-12">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-white font-mono uppercase tracking-widest">Project Archives</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {projects.map((project, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10, scale: 1.02 }}
            style={{ willChange: "transform, opacity", WebkitTransform: "translateZ(0)" }}
            className="group relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-lg md:hover:shadow-[0_20px_40px_rgba(16,185,129,0.15)] hover:border-emerald-500/30 transition-all duration-300"
          >
            <div className="absolute inset-0 z-30 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full -translate-x-full transition-all duration-1000 ease-out pointer-events-none" />

            <div className="aspect-video overflow-hidden bg-zinc-950 relative">
              <img 
                src={project.image} 
                alt={project.title} 
                // transform-gpu and will-change-transform fixes mobile lag here
                className="w-full h-full object-cover transform-gpu will-change-transform group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100 mix-blend-luminosity md:group-hover:mix-blend-normal"
                loading="lazy"
              />
              <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-zinc-700 group-hover:bg-emerald-500 md:group-hover:shadow-[0_0_10px_rgba(16,185,129,1)] transition-colors duration-300" />
            </div>
            
            <div className="p-5 md:p-6 relative z-20">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">{project.title}</h3>
              <p className="text-sm md:text-base text-zinc-400 mb-6 line-clamp-3">{project.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {project.techStack.map((tech, i) => (
                  <span key={tech} className="px-2 py-1 text-[10px] md:text-xs font-mono text-zinc-400 bg-zinc-950 rounded border border-zinc-800 group-hover:border-zinc-600 transition-colors">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-4 border-t border-zinc-800 pt-4 mt-auto">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs md:text-sm font-bold text-zinc-500 hover:text-white transition-colors">
                    <Github size={16} /> REPOSITORY
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs md:text-sm font-bold text-zinc-500 hover:text-emerald-400 transition-colors ml-auto">
                    <ExternalLink size={16} /> DEPLOY
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};