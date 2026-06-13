import React from 'react';
import { usePortfolio } from "../../../../context/PortfolioContext";
import { Briefcase, Calendar, Mountain } from "lucide-react";

export default function Experience() {
  const { portfolioData: data } = usePortfolio();
  const experience = data?.experience || [];

  if (experience.length === 0) return null;

  return (
    <section className="relative w-full py-20 px-4 md:px-8 bg-gradient-to-bl from-emerald-950 via-green-900 to-green-950 overflow-hidden">
      <div className="relative max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-900/40 border border-green-700/50 text-green-300 text-xs tracking-widest uppercase px-5 py-2 rounded-full mb-5">
            <Mountain className="w-3 h-3" />
            The Journey
            <Mountain className="w-3 h-3" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Professional{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              Roots
            </span>
          </h2>
          <div className="w-20 h-1 bg-green-600 rounded-full mx-auto" />
        </div>

        <div className="relative border-l-2 border-green-800/50 ml-4 md:ml-0 space-y-12">
          {experience.map((exp, i) => (
            <div key={i} className="relative pl-8 md:pl-10">
              {/* Timeline marker */}
              <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-green-900 border-2 border-green-500 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-green-400" />
              </div>

              <div className="bg-green-900/20 border border-green-800/40 rounded-2xl p-6 md:p-8 hover:border-green-600/60 hover:bg-green-900/40 transition-all duration-300 group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-green-300 transition-colors">
                      {exp.title}
                    </h3>
                    <div className="text-emerald-400 font-medium text-lg flex items-center gap-2 mt-1">
                      <Briefcase className="w-4 h-4" />
                      {exp.company}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-green-300/70 text-sm bg-green-950/50 px-4 py-2 rounded-full border border-green-800/30 w-fit">
                    <Calendar className="w-4 h-4" />
                    <span>{exp.startDate}</span>
                    <span>—</span>
                    <span>{exp.endDate}</span>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}