import React from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';

export default function Skills() {
  const { portfolioData: data } = usePortfolio();
  const skills = data?.skills || [];

  if (!skills || skills.length === 0) return null;

  return (
    <section className="w-full py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-indigo-100 shadow-sm text-indigo-500 font-medium text-sm tracking-wide mb-6">
          My Toolkit
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-700 tracking-tight mb-12">
          Skills & Expertise
        </h2>
        
        <div className="flex flex-wrap justify-center gap-4">
          {skills.map((skill, index) => (
            <div 
              key={index} 
              className="px-6 py-3 bg-white/50 backdrop-blur-md rounded-2xl border border-white/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-slate-600 font-medium"
            >
              {skill.name || skill}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}