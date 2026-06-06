import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { AnimatedHeading } from './Shared';
import data from '../../../../data/dummy_data.json';

const Projects = () => (
  <section className="py-24 relative z-10 px-6 max-w-7xl mx-auto">
    <AnimatedHeading>Projects</AnimatedHeading>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10" style={{ perspective: '1200px' }}>
      {data.projects.map((project, i) => (
        <motion.div
          key={i}
          className="relative h-[450px] w-full rounded-[2rem] transform-style-3d cursor-pointer"
          whileHover={{ rotateY: 10, rotateX: 5, z: 50 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <div className="absolute inset-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] overflow-hidden flex flex-col shadow-2xl">
            <div className="h-48 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent z-10" />
              <motion.img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between relative z-20 -mt-10">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-slate-300 text-sm line-clamp-3 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.slice(0, 3).map((tech, j) => (
                    <span key={j} className="text-xs px-2 py-1 bg-cyan-900/50 text-cyan-300 rounded-md border border-cyan-800/50">
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-slate-800/50 text-slate-400 rounded-md">
                      +{project.techStack.length - 3}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                {project.liveUrl && (
                  <motion.a 
                    href={project.liveUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm font-semibold text-white bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20 transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    <ExternalLink size={16} /> Live
                  </motion.a>
                )}
                {project.githubUrl && (
                  <motion.a 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    <Github size={16} /> Source
                  </motion.a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Projects;