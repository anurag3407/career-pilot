import React from 'react';
import { usePortfolio } from "../../../../context/PortfolioContext";
import { Briefcase, Calendar, MapPin, Activity } from 'lucide-react';

export default function Experience() {
  const { portfolioData: data } = usePortfolio();
  
  if (!data?.experience || data.experience.length === 0) return null;

  return (
    <section id="experience" className="relative w-full bg-[#030e1a] py-24 px-6 md:px-16 font-mono text-cyan-50 border-t border-cyan-900/50">
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
            <span>Elevation: Work History</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-light uppercase tracking-tight text-cyan-50">
            Professional <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Milestones</span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative border-l border-cyan-800/50 pl-8 md:pl-12 ml-4 md:ml-6 space-y-16">
          {data.experience.map((exp, index) => (
            <div key={index} className="relative group">
              {/* Timeline Node */}
              <div className="absolute -left-[37px] md:-left-[53px] top-1 w-4 h-4 rounded-none border border-cyan-400 bg-[#030e1a] group-hover:bg-cyan-400 transition-colors flex items-center justify-center">
                <div className="w-1 h-1 bg-cyan-200"></div>
              </div>
              <div className="absolute -left-[37px] md:-left-[53px] top-1 w-4 h-4 rounded-none border border-cyan-400 animate-ping opacity-20"></div>

              {/* Connecting Line to content */}
              <div className="absolute top-3 -left-8 md:-left-12 w-6 md:w-10 h-px bg-cyan-800/50 group-hover:bg-cyan-500/50 transition-colors"></div>

              <div className="border border-cyan-900/40 bg-cyan-950/10 p-6 md:p-8 hover:border-cyan-500/40 transition-colors relative">
                {/* Tech Corners */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500"></div>

                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6 border-b border-cyan-900/30 pb-6">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-cyan-300 tracking-wide uppercase">{exp.role}</h3>
                    <div className="text-cyan-500 mt-1 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      <span className="text-sm tracking-wider">{exp.company}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 text-xs text-cyan-600 font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      {exp.period || `${exp.startDate} - ${exp.endDate}`}
                    </div>
                    {exp.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5" />
                        {exp.location}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {exp.description && (
                    <p className="text-sm md:text-base text-cyan-100/70 leading-relaxed mb-4">{exp.description}</p>
                  )}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="space-y-2">
                      {exp.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-cyan-200/60 leading-relaxed">
                          <Activity className="w-4 h-4 text-cyan-700 mt-0.5 shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
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
