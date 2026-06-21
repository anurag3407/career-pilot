import React from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';
import { ExternalLink, Github } from 'lucide-react';

export default function Projects() {
  const { portfolioData: data } = usePortfolio();
  const projects = data?.projects || [];

  if (!projects || projects.length === 0) return null;

  return (
    <section className="w-full py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-r from-blue-50 via-teal-50 to-emerald-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-teal-100 shadow-sm text-teal-600 font-medium text-sm tracking-wide mb-6">
            My Work
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-700 tracking-tight">
            Featured Projects
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div 
              key={index} 
              className="bg-white/60 backdrop-blur-md rounded-3xl border border-white/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col"
            >
              <div className="h-48 bg-gradient-to-br from-teal-100 to-blue-100 relative overflow-hidden flex items-center justify-center">
                {project.image ? (
                  <img src={project.image} alt={project.title || "Project Screenshot"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="text-teal-300 font-bold text-4xl opacity-50">{project.title.charAt(0)}</div>
                )}
                <div className="absolute inset-0 bg-teal-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="p-8 flex-grow flex flex-col">
                <h3 className="text-2xl font-bold text-slate-700 mb-3">{project.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-6 flex-grow">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies?.map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-teal-600 border border-teal-100 shadow-sm">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center gap-4 pt-4 border-t border-slate-200/50">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-medium text-sm">
                      <Github size={18} /> Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-teal-600 hover:text-teal-800 transition-colors font-medium text-sm">
                      <ExternalLink size={18} /> Live Demo
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
