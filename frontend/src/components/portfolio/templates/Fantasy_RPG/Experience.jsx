import React, { useRef, useEffect, useState } from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';
import { Shield, Swords, Calendar, MapPin, Star, Flame } from 'lucide-react';

export default function Experience() {
  const { portfolioData } = usePortfolio();
  const data = portfolioData?.experience || [];
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  if (!data || data.length === 0) return null;

  return (
    <section
      id="experience"
      ref={sectionRef}
      className={`relative min-h-screen w-full bg-[#0a090e] text-amber-100/90 py-20 px-4 sm:px-6 lg:px-8 border-t-4 border-b-4 border-amber-900/60 overflow-hidden select-none transition-all duration-700 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Background Magic Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(#201910_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-45" />
      <div className="absolute top-1/4 right-1/10 w-96 h-96 bg-red-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/10 w-96 h-96 bg-amber-900/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 relative">
          <div className="flex items-center gap-4 mb-3">
            <Shield className="w-7 h-7 text-amber-500 animate-pulse" />
            <span className="font-fantasy-game text-sm text-amber-400 tracking-widest uppercase bg-amber-950/40 px-4 py-1.5 border border-amber-800/60 rounded">
              CHRONICLES OF BATTLE
            </span>
            <Shield className="w-7 h-7 text-amber-500 animate-pulse" />
          </div>

          <h2 className="font-fantasy-title text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-700 tracking-wider my-2 uppercase select-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            GUILD HISTORY
          </h2>

          <p className="font-fantasy-game text-base md:text-lg text-amber-500/80 max-w-2xl tracking-wide uppercase mt-1">
            THE REALMS AND FACTIONS I HAVE SERVED
          </p>

          <div className="w-64 h-3 flex items-center justify-center gap-2 mt-4 text-amber-600/40">
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent to-amber-700/40" />
            <span className="text-amber-500/60 font-fantasy-game">✦</span>
            <div className="w-full h-0.5 bg-gradient-to-l from-transparent to-amber-700/40" />
          </div>
        </div>

        {/* Quest Timeline (Experience Grid) */}
        <div className="w-full relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-900/10 via-amber-700/50 to-amber-900/10" />

          <div className="flex flex-col gap-12">
            {data.map((exp, index) => (
              <div 
                key={index}
                className={`relative flex flex-col md:flex-row items-center gap-8 ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Timeline Node */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 bg-[#121118] border-2 border-amber-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.4)] z-20">
                  <Star className="w-4 h-4 text-amber-400" />
                </div>

                {/* Content Card */}
                <div className="w-full md:w-1/2 pl-12 md:pl-0 flex flex-col relative">
                  <div className={`bg-[#121118]/90 border border-[#2b221a] hover:border-amber-500/60 rounded-xl p-6 md:p-8 shadow-[0_8px_24px_rgba(0,0,0,0.8)] transition-all duration-300 group overflow-hidden ${
                    index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'
                  }`}>
                    {/* Metal corner highlights */}
                    <div className="metal-corner-tl opacity-30 group-hover:opacity-100 transition-opacity" />
                    <div className="metal-corner-tr opacity-30 group-hover:opacity-100 transition-opacity" />
                    <div className="metal-corner-bl opacity-30 group-hover:opacity-100 transition-opacity" />
                    <div className="metal-corner-br opacity-30 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                        <span className="font-fantasy-game text-[10px] px-2.5 py-1 border rounded border-red-500/50 bg-red-950/30 text-red-400">
                          RANK: {exp.title}
                        </span>
                        <div className="flex items-center gap-2 text-amber-500/80 font-fantasy-game text-[10px] uppercase">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{exp.startDate} - {exp.endDate || 'PRESENT'}</span>
                        </div>
                      </div>

                      <h3 className="font-fantasy-title text-xl font-bold text-amber-200 uppercase tracking-wide">
                        {exp.company}
                      </h3>
                      
                      <div className="flex items-center gap-1.5 text-amber-500/60 font-fantasy-game text-xs uppercase mb-4">
                        <MapPin className="w-3.5 h-3.5" />
                        {exp.location || "UNKNOWN REALM"}
                      </div>

                      <p className="font-fantasy-body text-sm text-amber-100/70 leading-relaxed mb-4">
                        {exp.description}
                      </p>

                      {exp.achievements && exp.achievements.length > 0 && (
                        <div className="mt-2 space-y-2">
                          <h4 className="font-fantasy-game text-[10px] text-amber-500/80 uppercase tracking-widest border-b border-amber-900/40 pb-1 mb-3">
                            NOTABLE CONQUESTS
                          </h4>
                          <ul className="space-y-2">
                            {exp.achievements.map((achievement, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <Swords className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                                <span className="font-fantasy-body text-xs text-amber-100/60">
                                  {achievement}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Empty spacer for the other side */}
                <div className="hidden md:block md:w-1/2"></div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}