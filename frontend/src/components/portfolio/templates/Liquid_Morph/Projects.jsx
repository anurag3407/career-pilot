import React from 'react';
import { Folder, ExternalLink, Github } from 'lucide-react';

export default function Projects({ data }) {
  const projects = Array.isArray(data.projects) ? data.projects : [];

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-3">
        <Folder className="text-purple-400 w-6 h-6" />
        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">Archives_</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, idx) => (
          <div key={idx} className="group relative bg-slate-900/40 border border-slate-800/80 rounded-[40px] overflow-hidden hover:border-purple-500/50 transition-all duration-500 flex flex-col z-10">
            
            {/* Aggressive Hover Liquid Background */}
            <div className="absolute -inset-10 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 liquid-shape opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 blur-2xl mix-blend-screen" />
            
            <div className="h-56 overflow-hidden relative">
              <img 
                src={project.image} 
                alt={project.title || "Project Screenshot"} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out" 
              />
              <div className="absolute inset-0 bg-slate-950/50 group-hover:bg-transparent transition-colors duration-700" />
            </div>

            <div className="p-8 flex flex-col flex-grow relative bg-gradient-to-t from-slate-900/90 to-transparent">
              <h3 className="text-2xl font-bold text-white mb-2 tracking-tight group-hover:text-purple-400 transition-colors">
                {project.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow font-medium">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {(Array.isArray(project.techStack) ? project.techStack : []).map((tech, i) => (
                  <span key={i} className="text-xs font-mono text-purple-300 bg-purple-500/10 border border-purple-500/30 px-3 py-1 liquid-shape shadow-sm">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-5 border-t border-slate-800/60 pt-5 mt-auto relative z-20">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-slate-300 hover:text-cyan-400 uppercase transition-colors">
                    <ExternalLink className="w-4 h-4" /> Live_View
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-slate-300 hover:text-indigo-400 uppercase transition-colors">
                    <Github className="w-4 h-4" /> Repository
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}