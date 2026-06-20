import React from 'react';
import { Terminal } from 'lucide-react';

export default function Testimonials({ testimonials }) {
  if (!testimonials || testimonials.length === 0) return null;

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
              <span>testimonials.sh</span>
            </div>
          </div>
          <div className="p-6 md:p-10 font-mono">
            <p className="text-green-500 mb-6">
              visitor@portfolio:~$ <span className="text-white">grep -R "feedback" ./clients</span>
            </p>
            <div className="space-y-6">
              {testimonials.map((t, i) => (
                <div key={i} className="border-l-2 border-green-500/30 pl-4 py-2">
                  <p className="text-gray-300 italic mb-3">"{t.content}"</p>
                  <p className="text-green-400 font-bold">
                    -- {t.author} <span className="text-green-500/60 font-normal">[{t.role}]</span>
                  </p>
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