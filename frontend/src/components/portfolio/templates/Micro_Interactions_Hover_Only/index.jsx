import React, { useContext } from 'react';
import { PortfolioContext } from '../../../../context/PortfolioContext';

export default function MicroInteractionsHoverOnly() {
  const context = useContext(PortfolioContext);
  const portfolioData = context?.portfolioData || {};
  
  const { 
    personal = {}, 
    experience = [], 
    projects = [], 
    skills = [] 
  } = portfolioData;

  // Safe structural fallbacks for the visual preview canvas
  const defaults = {
    name: "Taylor Vance",
    title: "Interaction Architect // Frontend Engineer",
    summary: "Designing digital playgrounds focused heavily on micro-feedback mechanics. Specializing in high-performance fluid user interfaces, design system scaling, and smooth motion states."
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-6 md:p-12 overflow-x-hidden selection:bg-teal-400 selection:text-slate-950">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* ✨ HOVER GLOW HEADER ELEMENT */}
        <header className="relative group p-8 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm transition-all duration-500 hover:border-teal-500/40 hover:bg-slate-900/80 shadow-[0_0_30px_rgba(0,0,0,0.3)] hover:shadow-[0_0_40px_rgba(20,184,166,0.05)] overflow-hidden">
          {/* Animated Background Pulse Dot */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <div className="text-xs font-mono tracking-widest text-slate-500 group-hover:text-teal-400 transition-colors duration-300 mb-4">
            [SYS // INTERACTIVE_NODE] HOVER_TO_ACTIVATE
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight transition-all duration-300 group-hover:translate-x-2 text-white">
            {personal.name || defaults.name}
          </h1>
          
          {/* Sliding Kinetic Border Bar */}
          <div className="h-[2px] w-12 bg-slate-700 mt-6 group-hover:w-full transition-all duration-500 ease-out bg-gradient-to-r group-hover:from-teal-500 group-hover:to-emerald-400" />
          
          <p className="text-lg md:text-2xl font-bold mt-4 text-slate-400 group-hover:text-slate-200 transition-colors duration-300">
            {personal.title || defaults.title}
          </p>
        </header>

        {/* 📋 SPREAD CANVAS LABELS */}
        <main className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* LEFT CONTAINER: Manifesto & Arsenal */}
          <div className="md:col-span-5 space-y-8">
            
            {/* Interactive Summary Block */}
            <section className="group border border-slate-800 p-6 rounded-2xl bg-slate-900/30 hover:border-slate-700 hover:bg-slate-900/60 transition-all duration-300">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 group-hover:text-teal-400 transition-colors duration-300 mb-4">
                // 01_MANIFESTO
              </h2>
              <p className="text-sm md:text-base text-slate-400 group-hover:text-slate-200 transition-colors duration-300 leading-relaxed">
                {personal.summary || defaults.summary}
              </p>
            </section>

            {/* Kinetic Magnetic Skills Grid */}
            <section className="group border border-slate-800 p-6 rounded-2xl bg-slate-900/30 hover:border-slate-700 hover:bg-slate-900/60 transition-all duration-300">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 group-hover:text-teal-400 transition-colors duration-300 mb-4">
                // 02_CAPABILITIES
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.length > 0 ? (
                  skills.map((skill, idx) => (
                    <span 
                      key={idx} 
                      className="text-xs font-mono bg-slate-900 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-lg transition-all duration-200 hover:-translate-y-1 hover:border-teal-400 hover:text-white hover:bg-teal-950/20 shadow-sm cursor-default"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-600">// CAP_ARRAY_NULL</p>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT CONTAINER: Chronology Timeline Timeline */}
          <div className="md:col-span-7 space-y-8">
            <section className="border border-slate-800 p-6 rounded-2xl bg-slate-900/30">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-6">// 03_EXPERIENCE_LOG</h2>
              
              <div className="space-y-6">
                {experience.length > 0 ? (
                  experience.map((exp, idx) => (
                    <div 
                      key={idx} 
                      className="group/item border-l-2 border-slate-800 hover:border-teal-500 pl-4 transition-all duration-300 py-1"
                    >
                      <div className="flex justify-between items-baseline gap-2">
                        <h3 className="text-base font-bold text-slate-300 group-hover/item:text-white group-hover/item:translate-x-1 transition-all duration-300">
                          {exp.position}
                        </h3>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 border border-slate-800 rounded group-hover/item:border-teal-500/20 group-hover/item:text-teal-400 transition-colors">
                          {exp.startDate}
                        </span>
                      </div>
                      <h4 className="text-xs font-mono text-slate-400 mt-0.5">@{exp.company}</h4>
                      <p className="text-xs text-slate-500 group-hover/item:text-slate-400 transition-colors duration-300 mt-2 leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-600">// HIST_MATRIX_NULL</p>
                )}
              </div>
            </section>
          </div>
        </main>

        {/* 📂 SHUTTER COVER PROJECTS GRID */}
        <footer className="space-y-6">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">// 04_DEPLOYED_MODULES</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.length > 0 ? (
              projects.map((proj, idx) => (
                <div 
                  key={idx} 
                  className="group/card relative border border-slate-800 bg-slate-900/20 p-6 rounded-2xl overflow-hidden transition-all duration-300 hover:border-teal-500/30 hover:-translate-y-1"
                >
                  {/* Subtle Border Glow Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <div>
                      <span className="text-[10px] font-mono text-slate-600 group-hover/card:text-teal-400 transition-colors">
                        // MODULE_0{idx + 1}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-1 group-hover/card:translate-x-1 transition-transform duration-300">
                        {proj.name}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed mt-2">
                        {proj.description}
                      </p>
                    </div>
                    
                    {proj.technologies && (
                      <div className="flex flex-wrap gap-1 mt-4 pt-3 border-t border-slate-800/60 group-hover/card:border-slate-700 transition-colors">
                        {proj.technologies.map((tech, tIdx) => (
                          <span key={tIdx} className="text-[10px] font-mono bg-slate-950 border border-slate-800/80 px-2 py-0.5 text-slate-400 rounded transition-colors group-hover/card:border-slate-600">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-600">// MODULE_GRID_NULL</p>
            )}
          </div>
        </footer>
        
      </div>
    </div>
  );
}