import React from 'react';
import { MapPin, CalendarDays, Mic2 } from 'lucide-react';

export default function Experience({ experience }) {
  if (!experience || experience.length === 0) return null;

  return (
    <section className="w-full bg-gradient-to-b from-[#0a0502] to-[#1a0f0a] text-amber-50 py-20 px-4 sm:px-8 md:px-12 lg:px-20 font-serif border-t border-amber-900/30">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center space-x-3 text-amber-500 mb-16">
          <Mic2 className="w-8 h-8" />
          <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-widest text-amber-100">Tour History</h2>
        </div>

        <div className="relative border-l-2 border-amber-900/50 ml-4 md:ml-8 space-y-12 pb-4">
          {experience.map((exp, i) => (
            <div key={i} className="relative pl-8 sm:pl-12 font-sans group">
              {/* Timeline dot */}
              <div className="absolute -left-[11px] top-1.5 w-5 h-5 rounded-full bg-[#1a0f0a] border-2 border-amber-500 group-hover:bg-amber-500 group-hover:shadow-[0_0_10px_rgba(245,158,11,0.5)] transition-all"></div>
              
              <div className="flex items-center space-x-2 text-sm sm:text-base text-orange-400 mb-2 font-mono">
                <CalendarDays className="w-4 h-4" />
                <span>{exp.startDate} — {exp.endDate || 'Present'}</span>
              </div>
              
              <div className="bg-[#1a110a] p-6 rounded-xl border border-amber-900/30 group-hover:border-amber-700/50 transition-colors shadow-lg mt-4">
                <h3 className="text-2xl font-bold text-amber-100 font-serif mb-1">{exp.title}</h3>
                <div className="flex items-center space-x-2 text-amber-500 uppercase tracking-wider text-sm mb-4 font-mono">
                  <MapPin className="w-4 h-4" />
                  <span>{exp.company}</span>
                </div>
                
                <p className="text-amber-200/70 leading-relaxed font-sans text-sm sm:text-base">
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