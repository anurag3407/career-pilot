import React, { useRef, useEffect, useState } from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';
import { Sword, Scroll, Shield } from 'lucide-react';

export default function Hero() {
  const { portfolioData } = usePortfolio();
  const data = portfolioData?.personal || {};
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <section className="relative min-h-screen w-full bg-[#0a090e] text-amber-100 flex items-center justify-center overflow-hidden pt-20 pb-10">
      {/* Background Magic Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(#201910_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-45" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-900/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className={`relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center px-4 transition-all duration-1000 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
        
        <div className="mb-6 relative">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-amber-600 bg-amber-950 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.4)] overflow-hidden">
            {data.avatar ? (
              <img src={data.avatar} alt={data.name || "Profile Avatar"} className="w-full h-full object-cover" />
            ) : (
              <Shield className="w-16 h-16 text-amber-500" />
            )}
          </div>
          {/* Floating level badge */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-b from-amber-800 to-amber-950 border-2 border-amber-500 px-4 py-1 rounded-full shadow-lg">
            <span className="font-fantasy-game text-xs text-amber-200 uppercase tracking-widest font-bold">LVL 99</span>
          </div>
        </div>

        <h1 className="mt-8 font-fantasy-title text-4xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-700 tracking-wider uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
          {data.name || "Unknown Adventurer"}
        </h1>
        
        <div className="flex items-center gap-4 my-6">
          <div className="h-px w-16 bg-amber-700/50" />
          <p className="font-fantasy-game text-lg sm:text-xl text-amber-500 tracking-widest uppercase">
            {data.role || "Class: Grandmaster"}
          </p>
          <div className="h-px w-16 bg-amber-700/50" />
        </div>

        <p className="font-fantasy-body text-base sm:text-lg text-amber-100/70 max-w-2xl leading-relaxed mb-10">
          {data.bio || "A lone wanderer traversing the digital realms, crafting spells in code and forging legendary artifacts for the web."}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <a href="#projects" className="flex items-center gap-2 px-8 py-4 bg-gradient-to-b from-amber-800 to-amber-950 hover:from-amber-700 hover:to-amber-900 border border-amber-500 text-amber-100 font-fantasy-game font-bold rounded shadow-[inset_0_1px_4px_rgba(255,255,255,0.3),0_0_15px_rgba(212,175,55,0.4)] transition-all uppercase tracking-widest hover:scale-105">
            <Sword className="w-5 h-5" />
            View Quests
          </a>
          <a href="#contact" className="flex items-center gap-2 px-8 py-4 bg-black/60 hover:bg-amber-950/40 border border-amber-900/80 text-amber-400 font-fantasy-game font-bold rounded shadow-[inset_0_1px_4px_rgba(0,0,0,0.5)] transition-all uppercase tracking-widest hover:scale-105">
            <Scroll className="w-5 h-5" />
            Send Missive
          </a>
        </div>
      </div>
    </section>
  );
}
