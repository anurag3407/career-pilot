import React from 'react';
import { MessageSquareQuote, User } from 'lucide-react';

export default function Testimonials({ testimonials }) {
  if (!testimonials || testimonials.length === 0) return null;
  return (
    <section className="relative w-full min-h-[400px] bg-slate-950 p-6 md:p-12 overflow-hidden font-mono text-cyan-400 select-none border-y border-cyan-900/50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="relative z-20 max-w-6xl mx-auto flex flex-col gap-8">
        <div className="flex items-center gap-3 border-b border-cyan-500/30 pb-4">
          <MessageSquareQuote className="w-8 h-8 text-cyan-300" />
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-cyan-100">
              EVALUATIONS
            </h2>
            <div className="text-sm text-cyan-600 mt-1">Peer reviews & personnel feedback</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="border border-cyan-900/50 bg-cyan-950/20 p-6 relative group flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="text-cyan-200 text-sm leading-relaxed mb-6 italic relative z-10 before:content-['>_'] before:text-cyan-500 before:mr-2">
                "{t.text || t.content}"
              </div>
              
              <div className="flex items-center gap-4 border-t border-cyan-900/50 pt-4">
                {t.avatar ? (
                  <img src={t.avatar} alt={t.name || t.author} className="w-10 h-10 object-cover border border-cyan-500/50 grayscale group-hover:grayscale-0 transition-all" />
                ) : (
                  <div className="w-10 h-10 border border-cyan-500/50 flex items-center justify-center bg-cyan-950/50">
                    <User className="w-5 h-5 text-cyan-500" />
                  </div>
                )}
                <div>
                  <div className="text-cyan-100 text-sm font-bold tracking-widest uppercase">
                    {t.name || t.author}
                  </div>
                  <div className="text-[10px] text-cyan-600 tracking-widest uppercase">
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}