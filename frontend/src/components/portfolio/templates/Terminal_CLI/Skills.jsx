import React from 'react';
import { Terminal } from 'lucide-react';

export default function Skills({ skills }) {
  if (!skills || skills.length === 0) return null;

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
              <span>skills.sh</span>
            </div>
          </div>

          <div className="p-6 md:p-10 font-mono">
            <p className="text-green-500 mb-6">
              visitor@portfolio:~$ <span className="text-white">ls -la ./skills</span>
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {skills.map((skill, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-300 hover:text-green-400 transition-colors">
                  <span className="text-green-500/60 text-xs">rwxr-xr-x</span>
                  <span>{skill.name}</span>
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