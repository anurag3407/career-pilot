import React from 'react';
import { Coffee, Star } from 'lucide-react';
import { usePortfolio } from "../../../../context/PortfolioContext";

const Skills = () => {
  const { portfolioData } = usePortfolio();
  const skills = portfolioData?.skills || [];

  if (skills.length === 0) return null;

  return (
    <section className="w-full bg-[#161210] py-20 border-t-[8px] border-double border-[#2b1b12] relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 opacity-10 bg-[linear-gradient(90deg,rgba(0,0,0,1)_2px,transparent_2px)] bg-[size:100px_100%]" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        <div className="flex flex-col items-center justify-center mb-16 text-center">
          <h2 className="text-3xl sm:text-5xl font-black tracking-widest text-white font-serif uppercase flex flex-col sm:flex-row items-center gap-4 drop-shadow-md">
             <span className="text-amber-600 hidden sm:inline">✦</span> 
             Premium Ingredients
             <span className="text-amber-600 hidden sm:inline">✦</span> 
          </h2>
          <div className="mt-4 flex items-center justify-center gap-2 text-stone-500 text-xs font-mono font-bold uppercase tracking-widest">
            <span className="w-8 h-[1px] bg-stone-600" />
            Stock & Inventory
            <span className="w-8 h-[1px] bg-stone-600" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {skills.map((skill, idx) => {
            const skillName = typeof skill === 'string' ? skill : skill.name;
            const skillLevel = typeof skill === 'object' && skill.level ? skill.level : 90;
            const starCount = Math.ceil((skillLevel / 100) * 5);

            return (
              <div 
                key={idx}
                className="bg-[#1e1511] border-2 border-[#3e271a] p-6 rounded-2xl flex flex-col items-center text-center shadow-[0_10px_20px_rgba(0,0,0,0.4)] hover:-translate-y-1.5 transition-all duration-300 group hover:border-amber-600/50 hover:bg-[#251a14]"
              >
                <div className="w-14 h-14 bg-[#2d1a12] rounded-full flex items-center justify-center mb-5 border-[3px] border-[#161210] group-hover:border-amber-900 transition-colors shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-amber-500 rounded-full blur-md group-hover:opacity-40 transition-opacity" />
                  <Coffee className="w-6 h-6 text-amber-500 relative z-10" />
                </div>
                
                <h3 className="text-stone-200 font-serif font-bold text-lg mb-3 tracking-wide group-hover:text-white transition-colors">
                  {skillName}
                </h3>
                
                <div className="flex gap-1.5 text-stone-700 group-hover:text-amber-500/30 transition-colors mt-auto">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < starCount ? 'fill-amber-500 text-amber-500' : 'fill-current'}`} 
                    />
                  ))}
                </div>
                <div className="mt-4 w-full h-1 bg-[#161210] rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-amber-600 rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-500" 
                     style={{ width: `${skillLevel}%` }}
                   />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Skills;
