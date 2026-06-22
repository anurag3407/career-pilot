import React from 'react';
import { Briefcase, Calendar, MapPin } from 'lucide-react';

export default function Experience({ experience }) {
  if (!experience || experience.length === 0) return null;

  return (
    <section className="relative w-full py-24 bg-gradient-to-br from-black via-purple-900/50 to-gray-900 overflow-hidden">
      {/* Background Splatters */}
      <div className="absolute top-10 right-10 h-64 w-64 animate-pulse rounded-full bg-pink-600 opacity-20 blur-[100px]" />
      <div className="absolute bottom-10 left-10 h-64 w-64 animate-pulse rounded-full bg-green-500 opacity-20 blur-[100px] delay-1000" />
      
      {/* Drip effects */}
      <div className="absolute right-1/4 top-0 h-32 w-1.5 bg-yellow-400 opacity-50" />
      <div className="absolute right-1/4 top-8 h-20 w-1.5 bg-yellow-400 opacity-30" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 md:px-12">
        <div className="mb-16 text-center md:text-left">
          <div className="inline-block -rotate-2 transform bg-pink-500 px-4 py-1 mb-4 shadow-lg shadow-pink-500/50">
            <span className="text-sm font-black uppercase text-black">The Hustle</span>
          </div>
          <h2 className="text-5xl font-black uppercase tracking-tighter md:text-7xl">
            <span className="bg-gradient-to-r from-pink-500 via-yellow-500 to-green-500 bg-clip-text text-transparent">
              EXPERIENCE
            </span>
          </h2>
        </div>

        <div className="relative border-l-4 border-dashed border-pink-500/50 pl-6 md:pl-10 ml-4 md:ml-0">
          {experience.map((exp, i) => (
            <div key={i} className="group relative mb-16 last:mb-0">
              {/* Timeline dot (Spray can tip) */}
              <div className="absolute -left-[35px] md:-left-[47px] top-2 h-6 w-6 rounded-full border-4 border-black bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)] group-hover:bg-pink-500 group-hover:shadow-[0_0_20px_rgba(236,72,153,0.8)] transition-all duration-300" />
              
              <div className="relative transform bg-black/60 p-6 md:p-8 backdrop-blur-md border-2 border-white/10 hover:border-pink-500/50 transition-colors duration-300 shadow-xl group-hover:-translate-y-1">
                {/* Tape strip */}
                <div className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-2 bg-yellow-400/80 backdrop-blur-sm" />
                
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold uppercase text-white drop-shadow-md md:text-3xl">
                      {exp.title}
                    </h3>
                    <div className="mt-2 text-lg font-black text-pink-400">
                      @{exp.company}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-bold uppercase text-green-400 md:text-right">
                    <Calendar className="h-4 w-4" />
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </div>
                </div>
                
                <p className="mt-6 text-gray-300 md:text-lg leading-relaxed whitespace-pre-line">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom border tape effect */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-900 via-pink-500 to-gray-900" />
    </section>
  );
}