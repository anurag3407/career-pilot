import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import LavaAnimate from '../LavaAnimate';
import SectionHeader from './SectionHeader';

export default function Projects({ projects }) {
  return (
    <section id="projects" className="py-24 w-full relative z-10">
      <LavaAnimate className="flex! w-full flex-col" particleCount={80} formedDelay={1800} meltAmount={3}>
        <div className="w-full">
          <SectionHeader title="Projects" />
          
          {/* Added mt-12 to pull content away from the header */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mt-12">
            {projects.map((project, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px' }}
                transition={{ duration: 0.6, ease: [0.075, 0.82, 0.165, 1], delay: (idx % 6) * 0.15 }}
                whileHover={{ y: -10 }}
                className="group relative bg-stone-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-stone-800 hover:border-orange-500/50 transition-colors"
              >
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-stone-800/80 group-hover:bg-transparent transition-colors z-10 mix-blend-multiply" />
                  <img src={project.image} alt={project.title || "Project Screenshot"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 to-transparent z-10" />
                </div>
                <div className="p-6 relative z-20">
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">{project.title}</h3>
                  <p className="text-stone-400 mb-6 line-clamp-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.techStack.map((tech, i) => <span key={i} className="text-xs font-semibold px-2 py-1 bg-stone-950 text-orange-500 border border-stone-800 rounded">{tech}</span>)}
                  </div>
                  <div className="flex gap-4 border-t border-stone-800 pt-4">
                    {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-stone-300 hover:text-white transition-colors"><ExternalLink size={16} className="text-orange-500" /> Live Demo</a>}
                    {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-stone-300 hover:text-white transition-colors"><Github size={16} /> Source Code</a>}
                  </div>
                </div>
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none shadow-[inset_0_0_50px_rgba(249,115,22,0.1)] transition-opacity duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </LavaAnimate>
    </section>
  );
}