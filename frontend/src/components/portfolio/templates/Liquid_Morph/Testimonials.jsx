import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function Testimonials({ data }) {
  return (
    <div className="space-y-12">
      <div className="flex items-center gap-3">
        <MessageSquare className="text-cyan-400 w-6 h-6" />
        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">Transmissions_</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {data.testimonials.map((test, idx) => (
          <div key={idx} className="p-8 bg-slate-900/30 border border-slate-800/60 rounded-[40px] hover:border-cyan-500/40 transition-all duration-500 relative flex flex-col justify-between overflow-hidden group">
            
            {/* Melting quote mark background blob */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-tr from-cyan-500/10 to-indigo-500/10 liquid-shape opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />
            
            <p className="text-slate-300 font-medium italic leading-relaxed mb-8 text-sm md:text-base relative z-10">
              "{test.text}"
            </p>
            
            <div className="flex items-center gap-5 border-t border-slate-800/60 pt-6 relative z-10">
              <div className="w-14 h-14 p-0.5 bg-gradient-to-br from-cyan-400 to-indigo-500 liquid-shape">
                <img src={test.avatar} alt={test.name || "Profile Avatar"} className="w-full h-full object-cover liquid-shape-fast" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm md:text-base uppercase tracking-wider">{test.name}</h4>
                <p className="text-cyan-400 text-xs font-mono mt-1">{test.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}