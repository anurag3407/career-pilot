import React from 'react';
import { ExternalLink, Github, Briefcase } from 'lucide-react';
import data from '../../../../data/dummy_data.json';
import { GlitchText, SectionWrapper } from './shared';

export default function Projects() {
  return (
    <SectionWrapper id="projects">
      {/* Project cards use layered overlays to create the glitchy hover effect. */}
      <div className="flex items-center gap-4 mb-12">
        <Briefcase className="text-fuchsia-500 animate-pulse" />
        <GlitchText text="Archives" as="h2" className="text-4xl font-bold text-white" />
      </div>
      {/* The responsive grid avoids overly wide cards on smaller screens. */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {data.projects.map((project, idx) => (
          <div key={idx} className="group relative bg-zinc-900 border border-zinc-800 overflow-hidden hover:border-cyan-500 transition-colors cursor-crosshair">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity z-10" />
            <div className="h-48 overflow-hidden relative">
              <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
              {/* Thin noise stripes mimic video distortion over the thumbnail. */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC41KSIvPjwvc3ZnPg==')] opacity-50 z-20 pointer-events-none mix-blend-overlay"></div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-2 uppercase group-hover:text-cyan-400 transition-colors vibrate-hover inline-block">{project.title}</h3>
              <p className="text-zinc-400 font-mono text-sm mb-6 h-16 overflow-hidden">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.techStack.map((tech, i) => (
                  <span key={i} className="text-xs font-mono text-fuchsia-400 bg-fuchsia-400/10 px-2 py-1 hover:bg-fuchsia-400 hover:text-zinc-950 transition-colors">{tech}</span>
                ))}
              </div>
              <div className="flex gap-4 border-t border-zinc-800 pt-4 relative z-30">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-mono text-white hover:text-cyan-400 group/link"><ExternalLink className="w-4 h-4 group-hover/link:animate-pulse" /> Live_View</a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-mono text-white hover:text-fuchsia-500 group/link"><Github className="w-4 h-4 group-hover/link:animate-pulse" /> Source_Code</a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
