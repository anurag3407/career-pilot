import React from 'react';
import { usePortfolio } from "../../../../context/PortfolioContext";
import { ExternalLink, Github, Code2, LayoutTemplate } from 'lucide-react';

export default function Projects() {
  const { portfolioData: data } = usePortfolio();

  if (!data?.projects || data.projects.length === 0) return null;

  return (
    <section id="projects" className="relative w-full bg-[#030e1a] py-24 px-6 md:px-16 font-mono text-cyan-50 border-t border-cyan-900/50">
      {/* Blueprint Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.1]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #0ea5e9 1px, transparent 1px),
            linear-gradient(to bottom, #0ea5e9 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      ></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col mb-16">
          <div className="flex items-center gap-4 text-cyan-400 text-xs md:text-sm tracking-[0.2em] uppercase mb-4">
            <span className="w-12 h-px bg-cyan-400"></span>
            <span>Constructed Models</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-light uppercase tracking-tight text-cyan-50">
            Featured <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Deployments</span>
          </h2>
        </div>

        <div className="space-y-20">
          {data.projects.map((project, index) => (
            <div key={index} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-16 items-center group`}>
              
              {/* Project Visual / Image Panel */}
              <div className="w-full lg:w-3/5 relative">
                <div className="relative border border-cyan-800/60 bg-[#030e1a] p-4 group-hover:border-cyan-500/50 transition-colors">
                  {/* Tech Corners */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500"></div>

                  <div className="relative overflow-hidden aspect-video border border-cyan-900/50">
                    <div className="absolute inset-0 bg-cyan-900/30 mix-blend-screen opacity-50 z-10 group-hover:opacity-0 transition-opacity duration-500"></div>
                    
                    {project.image ? (
                      <img 
                        src={project.image} 
                        alt={project.title || "Project Screenshot"} 
                        className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-cyan-950/20 text-cyan-800">
                        <LayoutTemplate className="w-16 h-16 mb-4 opacity-50" />
                        <span className="text-xs uppercase tracking-widest opacity-50">Visual Asset Not Found</span>
                      </div>
                    )}
                    
                    {/* Measurement Lines Overlay */}
                    <div className="absolute top-0 left-4 bottom-0 w-px border-l border-dashed border-cyan-500/30 z-20"></div>
                    <div className="absolute top-4 left-0 right-0 h-px border-t border-dashed border-cyan-500/30 z-20"></div>
                  </div>
                  
                  {/* ID Tag */}
                  <div className="absolute -bottom-3 right-8 bg-[#030e1a] border border-cyan-800 px-3 py-1 text-[10px] text-cyan-400 tracking-widest shadow-lg">
                    PRJ_ID: {String(index + 1).padStart(3, '0')}
                  </div>
                </div>
              </div>

              {/* Project Data Panel */}
              <div className="w-full lg:w-2/5 flex flex-col relative z-20">
                <div className="text-[10px] text-cyan-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                  <Code2 className="w-3 h-3" />
                  Development Phase Complete
                </div>
                
                <h3 className="text-3xl font-bold text-cyan-100 uppercase tracking-wide mb-6">{project.title}</h3>
                
                <div className="bg-cyan-950/20 border border-cyan-900/40 p-6 mb-6 backdrop-blur-sm relative shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                  {/* Decorative node */}
                  <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-cyan-500"></div>
                  <p className="text-cyan-100/70 text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Tech Stack */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.technologies.map((tech, idx) => (
                      <span key={idx} className="text-xs text-cyan-400 font-mono border border-cyan-800/60 px-2 py-1 uppercase tracking-wider bg-[#030e1a]/80">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Links */}
                <div className="flex items-center gap-4">
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-bold text-[#030e1a] bg-cyan-500 hover:bg-cyan-400 px-5 py-2.5 uppercase tracking-widest transition-colors border border-cyan-400">
                      <ExternalLink className="w-4 h-4" /> Live Build
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-bold text-cyan-400 bg-transparent hover:bg-cyan-900/30 px-5 py-2.5 uppercase tracking-widest transition-colors border border-cyan-800 hover:border-cyan-400">
                      <Github className="w-4 h-4" /> Source Code
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
