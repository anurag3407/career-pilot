import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, ExternalLink, Github, ChevronRight } from 'lucide-react';

export default function Projects({ data }) {
  const projects = data?.projects;
  if (!projects || projects.length === 0) return null;

  return (
    <section id="projects" className="relative py-20 bg-[#121216] border-y border-neutral-900 text-white overflow-hidden selection:bg-[#E10600] selection:text-white">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-0 w-full h-[300px] bg-[#E10600]/5 blur-[150px] pointer-events-none -z-10 transform -skew-y-12" />

      <div className="container mx-auto px-4 z-10 relative">
        <div className="flex flex-col items-center mb-16 text-center space-y-4">
          <div className="inline-flex items-center bg-neutral-900/80 backdrop-blur-sm border-l-4 border-[#E10600] px-3 py-1.5 text-xs font-mono text-neutral-300 gap-2 uppercase tracking-widest">
            <Trophy className="w-4 h-4 text-[#E10600]" />
            <span>Championship Wins</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none uppercase italic transform -skew-x-12">
            <span className="block text-white">PROJECTS &</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#E10600] to-[#ff4d36]">
              HIGHLIGHT REEL
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#070709]/90 backdrop-blur-md border border-neutral-800 rounded-xl overflow-hidden group hover:border-neutral-600 transition-colors flex flex-col h-full"
            >
              {/* Image Container (Simulated HUD or screen) */}
              <div className="relative h-48 sm:h-64 overflow-hidden border-b border-neutral-800">
                <div className="absolute inset-0 bg-[#E10600]/10 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {project.image ? (
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                    <Trophy className="w-16 h-16 text-neutral-800" />
                  </div>
                )}
                
                {/* Overlay telemetry badges */}
                <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                  <div className="bg-[#121216]/80 backdrop-blur-md border border-neutral-700 px-2 py-1 text-[10px] font-mono font-bold tracking-widest text-white uppercase rounded-sm flex items-center gap-1.5 shadow-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-pulse" /> ACTIVE
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold font-mono tracking-tight text-white uppercase group-hover:text-[#E10600] transition-colors">
                    {project.title}
                  </h3>
                  
                  {/* Links */}
                  <div className="flex gap-3">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-neutral-900 border border-neutral-800 rounded-md hover:border-[#E10600] hover:text-[#E10600] text-neutral-400 transition-all group/link">
                        <Github className="w-4 h-4 group-hover/link:rotate-12 transition-transform" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-[#E10600]/10 border border-[#E10600]/30 rounded-md hover:bg-[#E10600] text-[#E10600] hover:text-white transition-all group/link">
                        <ExternalLink className="w-4 h-4 group-hover/link:scale-110 transition-transform" />
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-sm text-neutral-400 font-sans leading-relaxed mb-6 flex-grow">
                  {project.description}
                </p>

                {/* Tech Stack */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="mt-auto">
                    <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3" /> Tech Stack
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="px-2 py-1 text-[10px] font-mono tracking-wider bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
