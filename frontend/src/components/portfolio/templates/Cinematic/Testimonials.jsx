import React from 'react';
import { MessageSquare, Star } from 'lucide-react';

export default function Testimonials({ data }) {
  if (!data?.testimonials || data.testimonials.length === 0) return null;

  return (
    <section className="relative w-full py-24 bg-[#050505] text-white font-sans selection:bg-neutral-800 border-t border-neutral-900">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="mb-16 flex flex-col items-center text-center animate-cinematic">
          <p className="text-[10px] sm:text-xs font-medium tracking-[0.5em] text-neutral-500 uppercase mb-4 flex items-center gap-3">
            <MessageSquare size={14} className="text-neutral-600" /> Critical Acclaim
          </p>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-600 drop-shadow-lg">
            Reviews
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.testimonials.map((test, index) => (
            <div 
              key={index} 
              className="group relative bg-[#080808] border border-neutral-800 p-8 hover:border-neutral-600 transition-all duration-500 rounded-sm flex flex-col justify-between"
            >
              {/* Subtle Film Grain Noise Overlay */}
              <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

              <div className="relative z-10">
                <div className="flex gap-1 mb-6 text-neutral-600 group-hover:text-white transition-colors duration-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-neutral-300 font-serif italic text-sm sm:text-base leading-relaxed mb-8 opacity-90">
                  "{test.text || test.quote || test.content}"
                </p>
              </div>

              <div className="relative z-10 border-t border-neutral-800/50 pt-4 mt-auto">
                <h4 className="text-sm font-bold tracking-widest uppercase text-neutral-100">{test.name}</h4>
                <p className="text-xs font-mono tracking-widest text-neutral-500 mt-1">{test.role || test.title}</p>
                {test.company && <p className="text-[10px] tracking-widest text-neutral-600 uppercase mt-1">{test.company}</p>}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
