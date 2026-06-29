import React from 'react';
import { FreeFadeIn } from './Shared';
import { Github, ExternalLink, Rocket } from 'lucide-react';

export default function Projects({ projects }) {
  return (
    <section className="min-h-screen flex flex-col justify-center py-24">
      <FreeFadeIn>
        <div className="mb-20 w-full flex flex-col md:flex-row md:justify-between md:items-end border-b border-white/10 pb-6 group">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase group-hover:text-orange-500 transition-colors">Projects</h2>
          <span className="text-xs font-mono tracking-widest text-slate-500 uppercase mt-2 md:mt-0">Recent Work</span>
        </div>
      </FreeFadeIn>

      <div className="space-y-32 w-full">
        {(projects || []).map((project, index) => (
          <div key={index} className={`w-full grid md:grid-cols-12 items-center gap-8 md:gap-16 group ${index % 2 === 0 ? '' : 'md:dir-rtl'}`}>
            <div className="md:col-span-6 overflow-hidden rounded-lg relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-600 to-yellow-500 opacity-0 group-hover:opacity-60 blur-2xl transition-opacity duration-700" />
              <FreeFadeIn xOffset={index % 2 === 0 ? -30 : 30}>
                <img 
                  src={project.image} alt={project.title} 
                  className="relative w-full h-64 md:h-96 object-cover opacity-50 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-700 rounded-lg border border-transparent group-hover:border-orange-500/50" 
                />
              </FreeFadeIn>
            </div>

            <div className="md:col-span-6 flex flex-col justify-center">
              <FreeFadeIn xOffset={index % 2 === 0 ? 30 : -30}>
                <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">{project.title}</h3>
                <p className="text-slate-400 font-light text-base md:text-lg leading-relaxed mb-6 group-hover:text-slate-200 transition-colors">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.techStack.map((tech, i) => (
                    <span key={i} className="text-xs font-mono tracking-wider bg-slate-900 border border-slate-800 group-hover:border-orange-500/50 group-hover:text-orange-300 text-slate-400 px-3 py-1.5 rounded-full transition-colors">{tech}</span>
                  ))}
                </div>

                <div className="flex gap-6 font-mono text-xs">
                  {/* ROCKET FLYING HOVER EFFECT */}
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="group/btn flex items-center gap-1.5 text-white hover:text-orange-500 hover:drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] transition-all">
                    <Rocket size={14} className="group-hover/btn:translate-x-2 group-hover/btn:-translate-y-2 transition-transform duration-300" /> LIVE DEMO
                  </a>
                  <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-slate-500 hover:text-white transition-colors">
                    <Github size={14} /> GITHUB
                  </a>
                </div>
              </FreeFadeIn>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}