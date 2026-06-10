import React from 'react';
import { Briefcase, ExternalLink, Github } from 'lucide-react';
import data from '../../../../data/dummy_data.json';
import { FadeIn, WireframeCorners } from './shared';

const ProjectsSection = () => {
  return (
    <section id="projects" className="py-12">
      <FadeIn>
        <div className="flex items-center gap-4 mb-16">
          <Briefcase size={20} strokeWidth={1} className="text-zinc-400" />
          <h3 className="text-xl font-light uppercase tracking-widest">Selected Works</h3>
          <div className="flex-1 border-t border-zinc-200 ml-4"></div>
        </div>
      </FadeIn>

      <div className="space-y-24">
        {data.projects.map((project, index) => (
          <FadeIn key={index} delay={index * 0.1}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center group">
              <div className={`md:col-span-7 relative p-4 border border-zinc-200 ${index % 2 !== 0 ? 'md:order-last' : ''}`}>
                <WireframeCorners />
                <div className="flex justify-between items-center mb-2 px-1">
                  <span className="text-[10px] font-mono text-zinc-400">FILE_{index + 1}.PNG</span>
                  <span className="text-[10px] font-mono text-zinc-400">RENDER</span>
                </div>

                <div className="relative overflow-hidden border border-zinc-100 aspect-[4/3] bg-zinc-50 p-2">
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none">
                    <div className="w-full h-px bg-white/50 absolute"></div>
                    <div className="h-full w-px bg-white/50 absolute"></div>
                    <div className="border border-white/50 w-1/2 h-1/2 absolute"></div>
                  </div>

                  <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                </div>
              </div>

              <div className={`md:col-span-5 flex flex-col ${index % 2 !== 0 ? 'md:items-end md:text-right' : ''}`}>
                <div className="text-[10px] tracking-[0.2em] uppercase text-zinc-400 mb-4 font-mono">Project // {String(index + 1).padStart(2, '0')}</div>
                <h4 className="text-3xl font-light text-zinc-900 mb-6">{project.title}</h4>
                <p className="text-zinc-500 font-light leading-relaxed mb-8">{project.description}</p>

                <div className={`flex flex-wrap gap-x-4 gap-y-2 mb-8 ${index % 2 !== 0 ? 'md:justify-end' : ''}`}>
                  {project.techStack.map((tech, idx) => (
                    <span key={idx} className="text-[11px] tracking-widest uppercase text-zinc-400 border border-zinc-200 px-2 py-1">{tech}</span>
                  ))}
                </div>

                <div className="flex gap-4">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="p-3 border border-zinc-200 hover:border-zinc-900 text-zinc-400 hover:text-zinc-900 transition-colors">
                      <Github size={18} strokeWidth={1} />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="p-3 border border-zinc-200 hover:border-zinc-900 text-zinc-400 hover:text-zinc-900 transition-colors">
                      <ExternalLink size={18} strokeWidth={1} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
