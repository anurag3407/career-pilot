import React, { useRef, useEffect, useState } from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';
import { BookOpen, Flame, Sparkles, Zap, Wand2 } from 'lucide-react';

export default function Skills() {
  const { portfolioData } = usePortfolio();
  const data = portfolioData?.skills || [];
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
      id="skills"
      ref={sectionRef}
      className={`relative w-full bg-[#0a090e] text-amber-100/90 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden select-none transition-all duration-700 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Background Magic Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(10,9,14,0.9),rgba(10,9,14,0.9)),url('https://www.transparenttextures.com/patterns/black-scales.png')] pointer-events-none opacity-50" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 relative">
          <div className="flex items-center gap-4 mb-3">
            <BookOpen className="w-7 h-7 text-amber-500 animate-pulse" />
            <span className="font-fantasy-game text-sm text-amber-400 tracking-widest uppercase bg-amber-950/40 px-4 py-1.5 border border-amber-800/60 rounded">
              ARCANE KNOWLEDGE
            </span>
            <BookOpen className="w-7 h-7 text-amber-500 animate-pulse" />
          </div>

          <h2 className="font-fantasy-title text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-700 tracking-wider my-2 uppercase select-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            THE GRIMOIRE
          </h2>

          <p className="font-fantasy-game text-base md:text-lg text-amber-500/80 max-w-2xl tracking-wide uppercase mt-1">
            SPELLS, RUNES, AND ENCHANTMENTS MASTERED
          </p>

          <div className="w-64 h-3 flex items-center justify-center gap-2 mt-4 text-amber-600/40">
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent to-amber-700/40" />
            <span className="text-amber-500/60 font-fantasy-game">✦</span>
            <div className="w-full h-0.5 bg-gradient-to-l from-transparent to-amber-700/40" />
          </div>
        </div>

        {/* Skills grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
          {data.map((skillGroup, index) => {
            const categoryIcon = index % 3 === 0 ? <Zap className="w-5 h-5 text-sky-400" /> : 
                                 index % 3 === 1 ? <Flame className="w-5 h-5 text-rose-400" /> : 
                                 <Wand2 className="w-5 h-5 text-purple-400" />;
            
            const badgeColor = index % 3 === 0 ? "border-sky-500/50 bg-sky-950/30 text-sky-400" :
                               index % 3 === 1 ? "border-rose-500/50 bg-rose-950/30 text-rose-400" :
                               "border-purple-500/50 bg-purple-950/30 text-purple-400";
            
            return (
              <div 
                key={index} 
                className="bg-[#121118]/90 border border-[#2b221a] hover:border-amber-500/50 rounded-xl p-6 shadow-[0_8px_24px_rgba(0,0,0,0.6)] relative group transition-all duration-300"
              >
                {/* Decorative Elements */}
                <div className="metal-corner-tl opacity-30 group-hover:opacity-100 transition-opacity" />
                <div className="metal-corner-tr opacity-30 group-hover:opacity-100 transition-opacity" />
                <div className="metal-corner-bl opacity-30 group-hover:opacity-100 transition-opacity" />
                <div className="metal-corner-br opacity-30 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-center justify-between mb-6 border-b border-amber-900/40 pb-4">
                  <h3 className="font-fantasy-title text-lg font-bold text-amber-200 uppercase tracking-widest flex items-center gap-2">
                    {categoryIcon}
                    {skillGroup.category || 'Arcana'}
                  </h3>
                </div>

                <div className="flex flex-wrap gap-3">
                  {(skillGroup.items || skillGroup.technologies || []).map((skill, i) => (
                    <span 
                      key={i}
                      className={`font-fantasy-game text-[10px] px-3 py-1.5 border rounded uppercase tracking-wider flex items-center gap-1 ${badgeColor} hover:scale-105 transition-transform cursor-default shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]`}
                    >
                      <Sparkles className="w-3 h-3 opacity-70" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}