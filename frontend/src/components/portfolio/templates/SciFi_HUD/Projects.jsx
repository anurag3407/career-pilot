import React from 'react';
import { Database, ExternalLink, Github, Hexagon } from 'lucide-react';

export default function Projects({ projects }) {
  if (!projects || projects.length === 0) return null;
  return (
    <section className="relative w-full min-h-[500px] bg-slate-950 p-6 md:p-12 overflow-hidden font-mono text-cyan-400 select-none border-y border-cyan-900/50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.08)_0%,transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative z-20 max-w-6xl mx-auto flex flex-col gap-8">
        <div className="flex items-center gap-3 border-b border-cyan-500/30 pb-4">
          <Database className="w-8 h-8 text-cyan-300" />
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-cyan-100">
              DATA_ARCHIVES
            </h2>
            <div className="text-sm text-cyan-600 mt-1">Project logs and deployed modules</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, i) => (
            <div key={i} className="border border-cyan-900/50 bg-cyan-950/20 p-4 relative group hover:border-cyan-400/50 transition-all flex flex-col">
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-500/50" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-500/50" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-500/50" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-500/50" />
              
              <div className="w-full h-48 mb-4 border border-cyan-900/50 overflow-hidden relative group-hover:border-cyan-500/30">
                <div className="absolute inset-0 bg-cyan-950/50 z-10 group-hover:bg-transparent transition-colors mix-blend-overlay" />
                <img src={project.image} alt={project.title || "Project Screenshot"} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all scale-105 group-hover:scale-100 duration-500" />
              </div>
              
              <div className="flex items-center justify-between border-b border-cyan-900/50 pb-3 mb-3">
                <h3 className="text-lg font-bold text-cyan-100 tracking-wider flex items-center gap-2">
                  <Hexagon className="w-4 h-4 text-cyan-500" />
                  {project.title}
                </h3>
                <div className="flex gap-3">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-cyan-600 hover:text-cyan-300 transition-colors">
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-cyan-600 hover:text-cyan-300 transition-colors">
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>

              <p className="text-cyan-200 text-sm leading-relaxed mb-4 flex-grow">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-auto">
                {project.techStack?.map((tech, idx) => (
                  <span key={idx} className="text-[10px] tracking-widest text-cyan-400 bg-cyan-900/30 px-2 py-1 border border-cyan-800/50 uppercase">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
