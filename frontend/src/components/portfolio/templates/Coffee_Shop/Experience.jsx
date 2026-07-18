import React from 'react';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import { usePortfolio } from "../../../../context/PortfolioContext";

const Experience = () => {
  const { portfolioData } = usePortfolio();
  const experience = portfolioData?.experience || [];

  if (experience.length === 0) return null;

  return (
    <section className="w-full bg-[#161210] py-20 relative overflow-hidden font-sans border-t-[3px] border-dashed border-[#2b1b12]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center justify-center mb-20">
          <div className="inline-block border-[4px] border-[#3e271a] bg-[#2d1a12] px-8 py-4 rounded-2xl shadow-2xl relative">
            {/* Screws */}
            <div className="absolute top-2 left-2 w-2 h-2 bg-[#1a0f0a] rounded-full shadow-inner" />
            <div className="absolute top-2 right-2 w-2 h-2 bg-[#1a0f0a] rounded-full shadow-inner" />
            <div className="absolute bottom-2 left-2 w-2 h-2 bg-[#1a0f0a] rounded-full shadow-inner" />
            <div className="absolute bottom-2 right-2 w-2 h-2 bg-[#1a0f0a] rounded-full shadow-inner" />
            
            <h2 className="text-3xl font-black tracking-widest text-amber-400 font-serif uppercase flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-amber-600" />
              Work History
            </h2>
            <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-stone-900 text-stone-300 text-[10px] font-mono font-bold px-3 py-1 rounded border border-stone-700 uppercase tracking-widest whitespace-nowrap">
              Roasting Log
            </span>
          </div>
        </div>

        {/* Experience Timeline */}
        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-[20px] sm:left-1/2 top-0 bottom-0 w-[4px] bg-gradient-to-b from-[#3e271a] via-[#5c4033] to-[#3e271a] -translate-x-1/2 rounded-full" />

          <div className="space-y-12">
            {experience.map((exp, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={index} className={`relative flex flex-col sm:flex-row items-center ${isEven ? 'sm:flex-row-reverse' : ''}`}>
                  
                  {/* Timeline Dot */}
                  <div className="absolute left-[20px] sm:left-1/2 top-6 w-10 h-10 bg-[#161210] border-[4px] border-[#5c4033] rounded-full -translate-x-1/2 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(92,64,51,0.5)]">
                    <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
                  </div>

                  {/* Content Card */}
                  <div className={`w-full sm:w-[48%] pl-16 sm:pl-0 ${isEven ? 'sm:pr-12 sm:text-right' : 'sm:pl-12 text-left'}`}>
                    <div className="bg-[#1e1511] border-2 border-[#3e271a] p-6 rounded-2xl shadow-xl hover:border-amber-700/60 hover:shadow-amber-900/20 transition-all duration-300 group relative overflow-hidden">
                      
                      {/* Subtle background pattern */}
                      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                      <div className={`flex flex-wrap items-center gap-2 mb-4 text-xs font-mono font-bold text-amber-500/80 ${isEven ? 'sm:justify-end' : 'justify-start'}`}>
                        <span className="flex items-center gap-1.5 bg-[#161210] px-2.5 py-1 rounded border border-[#3e271a]">
                          <Calendar className="w-3.5 h-3.5" />
                          {exp.duration || `${exp.startDate || ''} - ${exp.endDate || 'Present'}`}
                        </span>
                        {exp.location && (
                          <span className="flex items-center gap-1.5 bg-[#161210] px-2.5 py-1 rounded border border-[#3e271a]">
                            <MapPin className="w-3.5 h-3.5" />
                            {exp.location}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-serif font-black text-white tracking-wide mb-1 group-hover:text-amber-400 transition-colors">
                        {exp.role || exp.title}
                      </h3>
                      <h4 className={`text-base font-serif font-bold text-stone-400 mb-5 flex items-center gap-2 ${isEven ? 'sm:justify-end' : 'justify-start'}`}>
                         <span className="text-amber-700">@</span> {exp.company}
                      </h4>

                      <p className="text-sm text-stone-300 leading-relaxed font-medium">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Experience;
