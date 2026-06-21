import React from 'react';
import { Circle, Search, Star, Download, Box, ExternalLink, Github } from 'lucide-react';

export default function Projects({ projects }) {
  if (!projects || projects.length === 0) return null;

  return (
    <section id="projects" className="w-full flex items-center justify-center px-4 py-16" style={{ backgroundColor: "#0d1117", fontFamily: "'Fira Code', 'JetBrains Mono', monospace" }}>
      <div className="w-full max-w-5xl rounded-xl overflow-hidden" style={{ background: "#0d1117", border: "1px solid #30363d", boxShadow: "0 0 0 1px #21262d, 0 8px 64px rgba(0,0,0,0.6)" }}>
        {/* Window Chrome */}
        <div className="flex items-center gap-3 px-4 py-3" style={{ background: "#161b22", borderBottom: "1px solid #30363d" }}>
          <Circle size={12} fill="#ff5f57" stroke="none" />
          <Circle size={12} fill="#febc2e" stroke="none" />
          <Circle size={12} fill="#28c840" stroke="none" />
          <span className="ml-2 text-xs text-[#6e7681]">Extensions: Projects</span>
        </div>
        
        {/* Search Bar */}
        <div className="p-4 border-b border-[#30363d] bg-[#161b22] font-sans">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e]" />
            <input 
              type="text" 
              placeholder="Search Projects in Marketplace" 
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-md py-2 pl-10 pr-4 text-sm text-[#e6edf3] focus:outline-none focus:border-[#4ade80] placeholder-[#8b949e] transition-colors"
              readOnly
            />
          </div>
        </div>

        {/* Extensions List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#30363d] font-sans">
          {projects.map((project, i) => (
            <div key={i} className="bg-[#0d1117] p-6 hover:bg-[#161b22] transition-colors flex gap-5 group">
              <div className="w-16 h-16 rounded-lg bg-[#21262d] flex items-center justify-center shrink-0 border border-[#30363d] overflow-hidden">
                {project.image ? (
                   <img src={project.image} alt={project.title || "Project Screenshot"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                   <Box size={32} className="text-[#8b949e]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-[#e6edf3] font-bold text-base truncate group-hover:text-[#4ade80] transition-colors">{project.title}</h3>
                  <div className="flex items-center gap-3 mt-1 shrink-0 font-mono">
                    <span className="flex items-center gap-1 text-xs text-[#8b949e]"><Star size={12} className="fill-[#8b949e]" /> {Math.floor(Math.random() * 100) + 10}</span>
                    <span className="flex items-center gap-1 text-xs text-[#8b949e]"><Download size={12} /> {Math.floor(Math.random() * 900) + 100}k</span>
                  </div>
                </div>
                <div className="text-xs text-[#79c0ff] mb-3 truncate font-mono bg-[#161b22] inline-block px-2 py-0.5 rounded border border-[#30363d]">
                  {project.techStack?.join(', ') || project.category || "Fullstack"}
                </div>
                <p className="text-sm text-[#8b949e] line-clamp-2 leading-relaxed mb-4">
                  {project.description}
                </p>
                <div className="flex items-center gap-3">
                  {project.link && (
                     <a href={project.link} target="_blank" rel="noopener noreferrer" className="px-4 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-medium rounded transition-colors flex items-center gap-1">
                       <ExternalLink size={14} />
                       Install
                     </a>
                  )}
                  {project.github && (
                     <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-1.5 text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#21262d] rounded transition-colors" title="Repository">
                       <Github size={16} />
                     </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
