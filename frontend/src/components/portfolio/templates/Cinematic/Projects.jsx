import React from 'react';
import { MonitorPlay, ArrowUpRight } from 'lucide-react';

export default function Projects({ data }) {
  if (!data?.projects || data.projects.length === 0) return null;

  return (
    <section className="relative w-full py-32 bg-[#050505] text-white font-sans selection:bg-neutral-800 border-t border-neutral-900">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="mb-20 flex flex-col items-center text-center animate-cinematic">
          <p className="text-[10px] sm:text-xs font-medium tracking-[0.5em] text-neutral-500 uppercase mb-4 flex items-center gap-3">
            <MonitorPlay size={14} className="text-neutral-600" /> Selected Works
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600 drop-shadow-lg">
            Filmography
          </h2>
        </div>

        {/* Projects List */}
        <div className="max-w-7xl mx-auto flex flex-col gap-24">
          {data.projects.map((project, index) => (
            <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-24 items-center group`}>
              
              {/* Project Visual (Poster) */}
              <div className="w-full lg:w-3/5">
                <div className="relative aspect-[16/9] bg-[#0a0a0a] border border-neutral-800 overflow-hidden rounded-sm cursor-pointer">
                  {/* Subtle Film Grain */}
                  <div className="absolute inset-0 opacity-20 mix-blend-overlay z-20 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
                  
                  {project.imageUrl ? (
                    <img 
                      src={project.imageUrl} 
                      alt={project.title || "Project Screenshot"} 
                      className="absolute inset-0 w-full h-full object-cover z-10 group-hover:scale-105 transition-transform duration-700 ease-out filter grayscale group-hover:grayscale-0"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-neutral-900 group-hover:bg-neutral-800 transition-colors duration-700">
                      <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-600">No Signal</span>
                    </div>
                  )}

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border border-white flex items-center justify-center backdrop-blur-sm">
                      <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Info */}
              <div className="w-full lg:w-2/5 flex flex-col justify-center">
                <div className="flex items-center gap-4 text-[10px] tracking-[0.2em] uppercase text-neutral-500 mb-4">
                  <span>Scene {String(index + 1).padStart(2, '0')}</span>
                  <div className="w-8 h-px bg-neutral-700"></div>
                  <span>{project.year || '2024'}</span>
                </div>
                
                <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-white mb-6">
                  {project.title}
                </h3>
                
                <p className="text-neutral-400 font-serif italic text-base leading-relaxed mb-8 opacity-90">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {(project.technologies || project.tags || []).map((tech, i) => (
                    <span key={i} className="px-3 py-1 text-[10px] uppercase tracking-widest border border-neutral-800 text-neutral-400 rounded-sm">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-6">
                  {project.demoUrl && (
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white hover:text-neutral-400 transition-colors">
                      Watch Feature <ArrowUpRight size={14} />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-white transition-colors">
                      Behind the Scenes <ArrowUpRight size={14} />
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
