import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderGit2, Terminal, ExternalLink, Cpu, Activity } from 'lucide-react';
import data from '../../../../data/dummy_data.json';

export default function Projects() {
  const [activeProject, setActiveProject] = useState(null);
  const projects = data?.projects || [];

  return (
    <section className="relative w-full py-12 bg-slate-950 text-cyan-400 font-mono p-6 md:p-12 overflow-hidden select-none border-y border-cyan-900/50">
      <div className="relative z-20 max-w-7xl mx-auto flex flex-col gap-10">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-cyan-500/30 pb-4 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-950/40 border border-cyan-500/50 rounded-sm">
              <FolderGit2 className="w-8 h-8 text-cyan-300" />
            </div>
            <div>
              <div className="text-sm text-cyan-500 mb-1">Projects</div>
              <h2 className="text-2xl md:text-4xl font-bold text-cyan-100 drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">
                Projects
              </h2>
            </div>
          </div>
          <div className="text-xs text-cyan-600 tracking-widest flex items-center gap-2">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>{projects.length} RECORDS_FOUND</span>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              onHoverStart={() => setActiveProject(project.id)}
              onHoverEnd={() => setActiveProject(null)}
              className="relative group border border-cyan-900/50 hover:border-cyan-400/60 bg-cyan-950/10 hover:bg-cyan-950/30 transition-all duration-300 p-6 flex flex-col gap-4 shadow-[inset_0_0_20px_rgba(8,145,178,0.0)] hover:shadow-[inset_0_0_20px_rgba(8,145,178,0.12)]"
            >
              {/* Corner Targeting UI */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-500/30 group-hover:border-cyan-400 transition-colors" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-500/30 group-hover:border-cyan-400 transition-colors" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-500/30 group-hover:border-cyan-400 transition-colors" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-500/30 group-hover:border-cyan-400 transition-colors" />

              {/* Scanning Laser (on hover) */}
              <AnimatePresence>
                {activeProject === project.id && (
                  <motion.div 
                    initial={{ top: 0, opacity: 0 }}
                    animate={{ top: '100%', opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    className="absolute left-0 w-full h-[1px] bg-cyan-400/50 shadow-[0_0_10px_#22d3ee] pointer-events-none z-10"
                  />
                )}
              </AnimatePresence>

              {/* Top Row: Meta Info */}
              <div className="flex justify-between items-start border-b border-cyan-900/50 pb-3">
                <div className="flex items-center gap-3">
                  <div className="text-cyan-500">{project.icon || <FolderGit2 />}</div>
                  <div>
                    <h3 className="text-xl font-bold text-cyan-200 tracking-wider uppercase">{project.title}</h3>
                    <div className="text-[10px] text-cyan-600 tracking-widest">{project.id} // {project.type}</div>
                  </div>
                </div>
                <div className={`text-[10px] px-2 py-1 border rounded-sm font-bold tracking-widest ${project.status === 'ACTIVE' || project.status === 'DEPLOYED' ? 'border-cyan-500 text-cyan-400 bg-cyan-950/50' : 'border-slate-600 text-slate-400 bg-slate-900/50'}`}>
                  {project.status}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-cyan-300/80 leading-relaxed min-h-[60px]">
                {project.description}
              </p>

              {/* Stack & Modules */}
              <div className="mt-auto pt-4 border-t border-cyan-900/30 flex flex-wrap gap-2">
                <div className="w-full text-[10px] text-cyan-600 mb-1 flex items-center gap-1">
                  <Cpu className="w-3 h-3" /> REQUIRED_MODULES:
                </div>
                {(project.tech || []).map((techItem, i) => (
                  <span key={i} className="text-[10px] text-cyan-300 px-2 py-1 bg-cyan-900/30 border border-cyan-800/50 rounded-sm">
                    {techItem}
                  </span>
                ))}
              </div>

              {/* Hover Actions overlay */}
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6 z-20">
                <a href={project.repo || '#'} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-950 transition-colors text-xs font-bold tracking-widest uppercase">
                  <Terminal className="w-4 h-4" /> Src_Code
                </a>
                <a href={project.live || '#'} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-950 transition-colors text-xs font-bold tracking-widest uppercase">
                  <ExternalLink className="w-4 h-4" /> Initialize
                </a>
              </div>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}