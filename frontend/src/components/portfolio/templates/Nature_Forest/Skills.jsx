import React from 'react';
import { usePortfolio } from "../../../../context/PortfolioContext";
import { Leaf, Code } from "lucide-react";

export default function Skills() {
  const { portfolioData: data } = usePortfolio();
  const skills = data?.skills || [];

  if (skills.length === 0) return null;

  return (
    <section className="relative w-full py-20 px-4 md:px-8 bg-gradient-to-br from-emerald-950 via-green-900 to-green-950 overflow-hidden">
      {/* Decorative leaves */}
      <Leaf className="absolute top-[20%] right-[10%] text-green-600 opacity-5 -rotate-12 w-16 h-16" />
      <Leaf className="absolute bottom-[10%] left-[5%] text-green-600 opacity-5 rotate-45 w-24 h-24" />

      <div className="relative max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-green-900/40 border border-green-700/50 text-green-300 text-xs tracking-widest uppercase px-5 py-2 rounded-full mb-5">
          <Code className="w-3 h-3" />
          Toolkit
          <Code className="w-3 h-3" />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          My <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">Digital Ecosystem</span>
        </h2>
        <div className="w-20 h-1 bg-green-600 rounded-full mx-auto mb-16" />

        <div className="flex flex-wrap justify-center gap-4">
          {skills.map((skill, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-green-900/20 border border-green-800/40 hover:border-green-500/60 hover:bg-green-800/40 transition-all duration-300 px-6 py-3 rounded-2xl group cursor-default"
            >
              <div className="w-8 h-8 rounded-full bg-green-950/50 flex items-center justify-center border border-green-800/50 group-hover:bg-green-700/50 transition-colors">
                <Leaf className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-white font-medium group-hover:text-green-300 transition-colors">
                {typeof skill === 'object' ? skill.name : skill}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}