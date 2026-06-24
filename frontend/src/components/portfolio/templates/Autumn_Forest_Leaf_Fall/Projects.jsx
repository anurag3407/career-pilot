import React from 'react';
import { motion } from 'framer-motion';

export default function Projects({ projects }) {
  if (!projects || projects.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto">
      <motion.h3 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-3xl font-bold mb-12 text-center text-orange-200"
      >
        Recent Work
      </motion.h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group bg-stone-800/40 rounded-2xl overflow-hidden border border-stone-700 hover:border-orange-800/60 hover:shadow-2xl hover:shadow-orange-900/20 transition-all duration-300"
          >
            <div className="h-48 overflow-hidden relative">
              <div className="absolute inset-0 bg-amber-900/20 group-hover:bg-transparent transition-colors z-10" />
              <img 
                src={project.image || 'https://via.placeholder.com/600x400?text=Project+Image'} 
                alt={project.title} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />
            </div>
            
            <div className="p-6">
              <h4 className="text-2xl font-bold text-stone-100 mb-3">{project.title}</h4>
              <p className="text-stone-400 mb-6 line-clamp-3">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {project.techStack?.map((tech, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-1 text-xs font-medium bg-stone-900 text-orange-300 rounded-full border border-orange-900/30"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-4">
                {project.link && (
                  <a 
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-stone-900 bg-orange-400 hover:bg-orange-300 px-4 py-2 rounded-lg transition-colors"
                  >
                    View Project
                  </a>
                )}
                {project.github && (
                  <a 
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-stone-300 hover:text-white border border-stone-600 hover:border-stone-400 px-4 py-2 rounded-lg transition-colors"
                  >
                    Source Code
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
