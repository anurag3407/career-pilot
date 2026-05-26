import React from 'react';
import { ExternalLink, Github } from 'lucide-react';

export default function ProjectsFrame({ data }) {
  const { projects } = data;
  
  return (
    <div className="h-full p-10 bg-[#1A1A1A] overflow-y-auto custom-scrollbar">
      <h2 className="text-3xl font-bold mb-8 text-white">Selected Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map(project => (
          <div key={project.id} className="bg-[#252525] rounded-xl overflow-hidden border border-[#333] hover:border-blue-500/50 transition-all duration-300 group">
            <div className="h-48 overflow-hidden relative">
              <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 mix-blend-overlay"></div>
              <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{project.title}</h3>
                <div className="flex gap-2">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                      <Github size={18} />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>
              </div>
              <p className="text-sm text-blue-500 mb-4 font-mono">{project.category}</p>
              <p className="text-gray-400 text-sm mb-6 line-clamp-3">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map(tech => (
                  <span key={tech} className="text-xs px-2 py-1 bg-[#1A1A1A] text-gray-300 rounded border border-[#333]">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
