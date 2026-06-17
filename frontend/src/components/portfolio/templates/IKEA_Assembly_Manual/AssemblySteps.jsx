import React from 'react';
import { usePortfolio } from "../../../../context/PortfolioContext";

export default function AssemblySteps() {
  const { portfolioData } = usePortfolio();
  const experience = portfolioData?.experience || [];

  return (
    <div className="border-2 border-black p-6 md:p-12 mb-12 bg-white">
      <h3 className="text-3xl font-black uppercase mb-8 border-b-2 border-black pb-4">
        2. Assembly Instructions (Experience)
      </h3>
      <div className="space-y-8">
        {experience.map((exp, idx) => (
          <div key={idx} className="flex flex-col md:flex-row gap-6 border-b-2 border-black border-dashed pb-8 last:border-b-0 last:pb-0">
            <div className="md:w-1/4 shrink-0">
              <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center text-2xl font-black bg-[#ffda1a]">
                {idx + 1}
              </div>
            </div>
            <div>
              <h4 className="text-2xl font-black uppercase mb-1">{exp.role}</h4>
              <h5 className="text-lg font-bold text-[#0051ba] uppercase mb-2">{exp.company} <span className="text-black ml-2 text-sm bg-[#f4f4f0] px-2 py-1 border-2 border-black inline-block mt-1 md:mt-0 md:inline">{exp.period}</span></h5>
              <p className="font-bold text-base">{exp.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
