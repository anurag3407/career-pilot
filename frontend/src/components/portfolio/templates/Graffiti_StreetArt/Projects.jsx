import React from 'react';
import { Github, ArrowRight } from 'lucide-react';

export default function Projects({ projects }) {
  if (!projects || projects.length === 0) return null;

  return (
    <section className="relative py-24 bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      {/* Street lights / glowing orbs */}
      <div className="absolute top-0 right-0 h-[800px] w-[800px] -translate-y-1/2 translate-x-1/2 animate-pulse rounded-full bg-green-500/10 blur-[150px]" />
      <div className="absolute bottom-0 left-0 h-[600px] w-[600px] translate-y-1/3 -translate-x-1/3 animate-pulse rounded-full bg-purple-600/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-20 flex flex-col items-center text-center">
          <h2 className="text-5xl font-black uppercase tracking-tighter md:text-7xl mb-4">
            <span className="text-white">THE </span>
            <span className="relative inline-block">
              <span className="absolute inset-0 -translate-x-1 translate-y-1 text-pink-500 blur-[2px]">GALLERY</span>
              <span className="relative text-transparent" style={{ WebkitTextStroke: '2px #fbbf24' }}>GALLERY</span>
            </span>
          </h2>
          <p className="text-gray-400 font-bold uppercase tracking-widest">Featured Masterpieces</p>
        </div>

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-2 xl:gap-16">
          {projects.map((project, i) => (
            <div key={i} className="group relative">
              {/* Backing shadow/border for street art offset effect */}
              <div className={`absolute inset-0 translate-x-3 translate-y-3 rounded-xl transition-transform duration-300 group-hover:translate-x-5 group-hover:translate-y-5 ${i % 2 === 0 ? 'bg-pink-500' : 'bg-yellow-400'}`} />
              
              <div className="relative h-full flex flex-col bg-gray-900 border-2 border-white/20 rounded-xl overflow-hidden hover:border-white/50 transition-colors">
                {/* Project Image */}
                <div className="relative aspect-video overflow-hidden bg-black">
                  {project.image ? (
                    <img 
                      src={project.image} 
                      alt={project.title || "Project Screenshot"} 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 mix-blend-luminosity group-hover:mix-blend-normal"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-600 font-black uppercase tracking-widest">
                      [No Preview]
                    </div>
                  )}
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80" />
                </div>

                {/* Project Info */}
                <div className="flex flex-col flex-grow p-6 md:p-8">
                  <h3 className="text-2xl md:text-3xl font-black uppercase text-white mb-3 group-hover:text-pink-400 transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-6 flex-grow leading-relaxed">
                    {project.description}
                  </p>

                  {/* Technologies */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                      {project.technologies.map((tech, j) => (
                        <span key={j} className="px-2 py-1 text-xs font-bold uppercase text-black bg-white/80 hover:bg-white transition-colors">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                    {project.link && (
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-black uppercase text-yellow-400 hover:text-yellow-300 transition-colors"
                      >
                        Live Demo <ArrowRight className="w-4 h-4" />
                      </a>
                    )}
                    {project.github && (
                      <a 
                        href={project.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-black uppercase text-gray-400 hover:text-white transition-colors ml-auto"
                      >
                        <Github className="w-4 h-4" /> Source
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
