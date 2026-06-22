import React from 'react';
import { Terminal } from 'lucide-react';

export default function Experience({ experience }) {
  if (!experience || experience.length === 0) return null;

  return (
    <section className="w-full bg-black text-green-400 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl">
        <div className="bg-zinc-950 border border-green-500/30 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(34,197,94,0.15)]">
          
          <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border-b border-green-500/20">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />

            <div className="ml-4 flex items-center gap-2 text-xs text-green-300">
              <Terminal size={14} />
              <span>experience.sh</span>
            </div>
          </div>

          <div className="p-6 md:p-10 font-mono">
            <p className="text-green-500 mb-6">
              visitor@portfolio:~$ <span className="text-white">./view_experience.sh</span>
            </p>
            
            <div className="space-y-8 pl-2 border-l border-green-500/20 ml-2">
              {experience.map((exp, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[13px] top-2 w-2 h-2 bg-black border border-green-500 rounded-full" />
                  <div className="pl-6">
                    <h3 className="text-xl md:text-2xl font-bold text-green-300">
                      {exp.title}
                    </h3>
                    <p className="text-green-400/80 font-semibold mb-2">@ {exp.company}</p>
                    <p className="text-sm text-gray-500 mb-4">{exp.startDate} - {exp.endDate}</p>
                    <p className="text-gray-300 leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center">
              <span className="text-green-500">visitor@portfolio:~$</span>
              <span className="ml-1 h-5 w-2 bg-green-500 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}