import React from 'react';
import { usePortfolio } from '../../../../context/PortfolioContext';

export default function Experience() {
  const { portfolioData: data } = usePortfolio();
  const experience = data?.experience || [];

  if (!experience || experience.length === 0) return null;

  return (
    <section className="w-full py-20 px-6 md:px-12 lg:px-24 bg-gradient-to-r from-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-purple-100 shadow-sm text-purple-500 font-medium text-sm tracking-wide mb-6">
            My Journey
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-700 tracking-tight">
            Work Experience
          </h2>
        </div>
        
        <div className="space-y-8">
          {experience.map((exp, index) => (
            <div 
              key={index} 
              className="p-8 bg-white/60 backdrop-blur-md rounded-3xl border border-white/80 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-purple-300 to-pink-300 opacity-70 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pl-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-700">{exp.title}</h3>
                  <p className="text-lg font-medium text-purple-500">{exp.company}</p>
                </div>
                <div className="mt-2 md:mt-0 px-4 py-1.5 bg-purple-100 text-purple-600 rounded-full text-sm font-semibold w-fit">
                  {exp.startDate} - {exp.endDate}
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed pl-4">
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}