import React from 'react';
import { usePortfolio } from "../../../../context/PortfolioContext";
import { Wrench, Terminal, Server, Layers, Cpu } from 'lucide-react';

export default function Skills() {
  const { portfolioData: data } = usePortfolio();

  if (!data?.skills || data.skills.length === 0) return null;

  // Render varying icons based on category (optional fallback)
  const getIcon = (categoryName) => {
    const n = categoryName.toLowerCase();
    if (n.includes('front')) return <Layers className="w-5 h-5 text-cyan-400" />;
    if (n.includes('back')) return <Server className="w-5 h-5 text-cyan-400" />;
    if (n.includes('tool')) return <Wrench className="w-5 h-5 text-cyan-400" />;
    if (n.includes('lang')) return <Terminal className="w-5 h-5 text-cyan-400" />;
    return <Cpu className="w-5 h-5 text-cyan-400" />;
  };

  return (
    <section id="skills" className="relative w-full bg-[#030e1a] py-24 px-6 md:px-16 font-mono text-cyan-50 border-t border-cyan-900/50">
      {/* Blueprint Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #0ea5e9 1px, transparent 1px),
            linear-gradient(to bottom, #0ea5e9 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      ></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col mb-16">
          <div className="flex items-center gap-4 text-cyan-400 text-xs md:text-sm tracking-[0.2em] uppercase mb-4">
            <span className="w-12 h-px bg-cyan-400"></span>
            <span>Specifications: Core Competencies</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-light uppercase tracking-tight text-cyan-50">
            Technical <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Inventory</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {data.skills.map((skillGroup, index) => (
            <div key={index} className="relative border border-cyan-800/60 bg-[#030e1a]/80 backdrop-blur-sm p-6 md:p-8 group hover:border-cyan-500/50 transition-colors">
              {/* Tech Corners */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-600"></div>
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-600"></div>
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-600"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-600"></div>

              {/* Group Header */}
              <div className="flex items-center gap-4 mb-6 border-b border-cyan-900/50 pb-4">
                <div className="p-2 border border-cyan-800 bg-cyan-950/30">
                  {getIcon(skillGroup.category)}
                </div>
                <h3 className="text-xl font-bold text-cyan-200 tracking-widest uppercase">
                  {skillGroup.category}
                </h3>
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-2 gap-4">
                {skillGroup.items.map((skill, i) => (
                  <div key={i} className="flex items-center justify-between group/skill">
                    <div className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-cyan-600 group-hover/skill:bg-cyan-300 group-hover/skill:shadow-[0_0_8px_#22d3ee] transition-all"></span>
                      <span className="text-sm text-cyan-100/80 group-hover/skill:text-cyan-50 transition-colors tracking-wide">{skill.name}</span>
                    </div>
                    {/* Simulated level indicator */}
                    <div className="flex gap-0.5 opacity-60 group-hover/skill:opacity-100 transition-opacity">
                      {[...Array(5)].map((_, levelIndex) => (
                        <div 
                          key={levelIndex} 
                          className={`w-1.5 h-3 border ${levelIndex < (skill.level ? Math.ceil(skill.level / 20) : 4) ? 'bg-cyan-500 border-cyan-400' : 'border-cyan-800'}`}
                        ></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
