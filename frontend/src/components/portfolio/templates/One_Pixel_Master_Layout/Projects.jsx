import React, { useContext } from 'react';
import { PortfolioContext } from './index';

const Projects = () => {
  const { projects } = useContext(PortfolioContext);

  return (
    <section className="relative">
      <div className="absolute top-0 right-0 p-2 text-[10px] text-[#444] font-mono select-none">
        OBJ_ID: PROJECTS_04
      </div>
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl font-bold uppercase text-white tracking-widest">Projects</h2>
        <div className="flex-1 h-px bg-[#333]"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, i) => (
          <div key={i} className="border border-[#333] bg-[#0a0a0a] group hover:border-green-500/50 transition-colors duration-500 flex flex-col h-full">
            <div className="h-48 border-b border-[#333] overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-500">
              <div className="absolute inset-0 bg-green-500/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <img 
                src={project.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop"} 
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-lg font-bold text-white uppercase mb-2">{project.title}</h3>
              <p className="text-sm text-[#a0a0a0] mb-4 flex-1">{project.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {(project.techStack || []).slice(0, 4).map((tech, idx) => (
                  <span key={idx} className="text-[10px] uppercase border border-[#333] px-2 py-0.5 text-[#666]">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-4 border-t border-[#333] pt-4 mt-auto">
                {project.liveUrl && project.liveUrl !== "#" && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-xs uppercase tracking-widest text-[#a0a0a0] hover:text-green-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500"></span> Live_View
                  </a>
                )}
                {project.githubUrl && project.githubUrl !== "#" && (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-xs uppercase tracking-widest text-[#a0a0a0] hover:text-green-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#666] group-hover:bg-green-500 transition-colors"></span> Src_Code
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
