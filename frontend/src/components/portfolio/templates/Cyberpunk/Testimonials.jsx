import React from "react";
import { MessageSquareQuote } from "lucide-react";

export default function Testimonials({ testimonials }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[#070b14] py-20 px-6 md:px-12 border-t border-pink-500/20">
      
      {/* Glitch overlays */}
      <div className="absolute right-0 top-20 w-64 h-64 bg-pink-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="relative z-10 mx-auto max-w-6xl">
        
        <div className="mb-14 text-center">
          <div className="inline-flex items-center justify-center gap-2 mb-3">
            <MessageSquareQuote className="text-cyan-400" size={20} />
            <p className="tracking-[0.3em] text-cyan-400 uppercase text-sm font-mono">
              // Data_Transmissions
            </p>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white uppercase tracking-widest">
            Client <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">Feedback</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, index) => (
            <div 
              key={index} 
              className="group relative p-8 rounded-2xl bg-black/60 border-l-4 border-l-pink-500 border-t border-t-white/5 border-r border-r-white/5 border-b border-b-white/5 hover:border-white/10 hover:border-l-cyan-400 transition-all duration-500 shadow-2xl"
            >
              {/* Decorative Tech Elements */}
              <div className="absolute top-0 right-0 p-2 opacity-30 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
                </div>
              </div>

              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-cyan-500/30 rounded-br-2xl pointer-events-none"></div>

              <p className="text-gray-300 italic mb-6 leading-relaxed relative z-10 text-lg">
                <span className="text-pink-500 font-serif text-3xl absolute -top-4 -left-3 opacity-50">"</span>
                {t.content}
                <span className="text-pink-500 font-serif text-3xl absolute -bottom-4 opacity-50">"</span>
              </p>
              
              <div className="flex items-center gap-4 mt-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl border-2 border-black shadow-[0_0_10px_rgba(255,0,200,0.4)]">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg group-hover:text-cyan-300 transition-colors">
                    {t.author}
                  </h4>
                  <p className="text-pink-400 text-sm font-mono tracking-wider">
                    {t.role} {t.company && `// ${t.company}`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}