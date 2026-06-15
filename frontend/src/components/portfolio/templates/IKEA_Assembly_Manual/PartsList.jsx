import React from 'react';
import { usePortfolio } from "../../../../context/PortfolioContext";

export default function PartsList() {
  const { portfolioData } = usePortfolio();
  const projects = portfolioData?.projects || [];

  return (
    <div className="border-2 border-black p-6 md:p-12 mb-12 bg-white">
      <h3 className="text-3xl font-black uppercase mb-8 border-b-2 border-black pb-4">
        1. Parts List (Projects)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj, idx) => (
          <div key={idx} className="border-2 border-black p-4 flex flex-col h-full bg-[#f4f4f0]">
            <div className="text-xl font-black mb-2 flex justify-between items-start">
              <span className="uppercase">{proj.title}</span>
              <span className="text-sm bg-black text-white px-2 py-1 ml-2">x1</span>
            </div>
            <p className="text-sm font-bold mb-4 flex-grow">{proj.description}</p>
            <div className="flex flex-wrap gap-2 mt-auto">
              {(proj.techStack || []).map((tech, tIdx) => (
                <span key={tIdx} className="text-xs border border-black px-1 uppercase font-bold bg-white">
                  {tech}
                </span>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
               {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="flex-1 bg-[#0051ba] text-white text-center font-bold text-xs py-1 uppercase border-2 border-black hover:bg-black transition-colors">View Live</a>}
               {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="flex-1 bg-white text-black text-center font-bold text-xs py-1 uppercase border-2 border-black hover:bg-[#ffda1a] transition-colors">Source</a>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
