import React, { useRef, useEffect, useState } from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';
import { Scroll, Compass } from 'lucide-react';

export default function About() {
  const { portfolioData } = usePortfolio();
  const data = portfolioData?.about || portfolioData?.personal || {};
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

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`relative w-full bg-[#0a090e] text-amber-100/90 py-20 px-4 sm:px-6 lg:px-8 overflow-hidden select-none transition-all duration-700 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(#201910_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-45" />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12 relative">
          <div className="flex items-center gap-4 mb-3">
            <Compass className="w-7 h-7 text-amber-500 animate-pulse" />
            <span className="font-fantasy-game text-sm text-amber-400 tracking-widest uppercase bg-amber-950/40 px-4 py-1.5 border border-amber-800/60 rounded">
              LORE & LEGEND
            </span>
            <Compass className="w-7 h-7 text-amber-500 animate-pulse" />
          </div>

          <h2 className="font-fantasy-title text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-700 tracking-wider my-2 uppercase select-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            THE ORIGIN STORY
          </h2>

          <div className="w-64 h-3 flex items-center justify-center gap-2 mt-4 text-amber-600/40">
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent to-amber-700/40" />
            <span className="text-amber-500/60 font-fantasy-game">✦</span>
            <div className="w-full h-0.5 bg-gradient-to-l from-transparent to-amber-700/40" />
          </div>
        </div>

        {/* Scroll Content */}
        <div className="bg-[#f4e4bc] text-[#3a2f24] p-8 md:p-12 rounded-sm shadow-[0_15px_35px_rgba(0,0,0,0.8),inset_0_0_40px_rgba(139,69,19,0.2)] relative max-w-3xl w-full">
          {/* Scroll torn edges effect using border images or simple styling */}
          <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-[#e3cda4] to-transparent opacity-50" />
          <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-[#e3cda4] to-transparent opacity-50" />
          
          <Scroll className="absolute -top-6 -right-6 w-16 h-16 text-amber-800/20 rotate-12" />

          <p className="font-fantasy-body text-base md:text-lg leading-relaxed mb-6 first-letter:float-left first-letter:font-fantasy-title first-letter:text-6xl first-letter:pr-2 first-letter:text-amber-900 first-line:tracking-widest first-line:uppercase">
            {data.about || "It began in an era where screens first flickered to life. A young squire discovered the magic of combining logic with art, bending runes and symbols to conjure experiences out of thin air."}
          </p>

          <p className="font-fantasy-body text-base md:text-lg leading-relaxed text-[#5c4a39]">
            {data.philosophy || "Through countless trials and debugging quests, I've honed my skills to master full-stack alchemy. I seek to join a party of seasoned adventurers, to build fortresses that withstand the test of time and traffic."}
          </p>

          <div className="mt-8 pt-6 border-t border-[#d4c4a1] flex justify-between items-center">
            <span className="font-fantasy-game text-sm text-[#8a7254] uppercase tracking-widest">
              Signed,
            </span>
            <span className="font-fantasy-game text-xl text-amber-900 font-bold signature-font">
              {data.name || "The Adventurer"}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
